import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { resultData } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!resultData) {
      return new NextResponse("Table id is required", { status: 400 });
    }

    if(!resultData.menuItems || resultData.menuItems.length === 0) {
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

    const tableName = await prismadb.table.findFirst({
      where: {
        id: resultData.tableId,
      },
    });

    if (!tableName) {
      return new NextResponse("TableId not received", { status: 403 });
    }

    const totalAmount = resultData.totalAmount;

    const order = await prismadb.orders.create({
      data: {
        resId: params.resId,
        slNo: slNo,
        tableNo: tableName.name,
        isPaid: false,
        amount: totalAmount,
        bill: {
          create: resultData.menuItems.map((item: any) => ({
            resId: params.resId,
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

    return NextResponse.json(order);
  } catch (error) {
    console.log("[TABLES_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
