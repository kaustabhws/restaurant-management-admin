import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { OrderType } from "@prisma/client";
import { NextResponse } from "next/server";

function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function findOrCreateCustomer(
  contactMethod: "phone" | "email" | null | undefined,
  contact: string | null | undefined,
  resId: string
) {
  // If contactMethod or contact is missing, return null
  if (!contactMethod || !contact) {
    return null;
  }

  const whereCondition =
    contactMethod === "phone" ? { phone: contact } : { email: contact };

  let customerData = await prismadb.customer.findFirst({
    where: whereCondition,
  });

  if (!customerData) {
    customerData = await prismadb.customer.create({
      data: {
        resId: resId,
        [contactMethod]: contact,
        loyaltyPoints: 0, // will be updated after bill is paid [/order/[orderId]/route.ts]
        totalSpent: 0, // will be updated after bill is paid [/order/[orderId]/route.ts]
      },
    });
  }
  return customerData;
}

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { resultData, customer } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!resultData) {
      return new NextResponse("Order data is required", { status: 400 });
    }

    if (!resultData.menuItems || resultData.menuItems.length === 0) {
      return new NextResponse("Menu items are required", { status: 400 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const restaurantsByUserId = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurantsByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Generate SL No
    const restaurantName = restaurantsByUserId.name;
    const nameParts = restaurantName.split(" ");
    let slNo = "";

    if (nameParts.length > 1) {
      slNo = nameParts
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    } else {
      slNo = restaurantName.substring(0, 2).toUpperCase();
    }

    slNo += generateRandomString(5);

    let tableName = null;

    // Check if it's a dine-in order
    if (resultData.tableId) {
      tableName = await prismadb.table.findFirst({
        where: {
          id: resultData.tableId,
        },
      });
    }

    // Check if it's a takeaway order
    const orderType = tableName ? "DINE_IN" : "TAKE_AWAY";

    // Find or create the customer
    const customerData = await findOrCreateCustomer(
      customer.contactMethod,
      customer.contact,
      params.resId
    );

    const discount = resultData.discount || 0;
    const totalAmount: number = resultData.totalAmount - discount;

    // Create the order
    const order = await prismadb.orders.create({
      data: {
        resId: params.resId,
        slNo: slNo,
        tableNo: tableName ? tableName.name : null,
        orderType: orderType as OrderType,
        isPaid: false,
        customerId: customerData && customerData.id ? customerData.id : null,
        discount,
        amount: totalAmount,
        bill: {
          create: resultData.menuItems.map((item: any) => ({
            resId: params.resId,
            customerId:
              customerData && customerData.id ? customerData.id : null,
            itemName: item.name,
            itemId: item.id,
            totalPrice: item.quantity * item.price,
            quantity: item.quantity,
          })),
        },
        orderItems: {
          create: resultData.menuItems.map((item: any) => ({
            menuItem: {
              connect: {
                id: item.id,
              },
            },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
        bill: true,
      },
    });

    // forward to kds
    const kds = await prismadb.kDSOrder.create({
      data: {
        resId: params.resId,
        orderId: order.slNo,
        tableNo: tableName ? tableName.name : null,
        orderType: orderType as OrderType,
        items: {
          create: resultData.menuItems.map((item: any) => ({
            orderId: order.id,
            itemName: item.name,
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    // If it's a dine-in order, clear the temp order and set the table to "Available"
    if (tableName) {
      await prismadb.tempOrderItems.deleteMany({
        where: {
          orderId: resultData.menuItems.orderId,
        },
      });

      await prismadb.tempOrders.deleteMany({
        where: {
          tableId: resultData.tableId,
        },
      });

      await prismadb.table.update({
        where: {
          id: resultData.tableId,
        },
        data: {
          status: "Available",
        },
      });
    }

    if (resultData.takeawayId) {
      await prismadb.tempOrderItems.deleteMany({
        where: {
          orderId: resultData.menuItems.orderId,
        },
      });

      await prismadb.tempOrders.deleteMany({
        where: {
          takeawayId: resultData.takeawayId,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
