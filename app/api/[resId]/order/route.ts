import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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
      return new NextResponse("Table id are required", { status: 400 });
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

    const totalAmount = resultData.totalAmount;

    const order = await prismadb.orders.create({
      data: {
        resId: params.resId,
        isPaid: false,
        amount: totalAmount,
        bill: {
          create: resultData.menuItems.map((item: any) => ({
            resId: params.resId,
            itemName: item.name,
            itemId: item.id,
            totalPrice: item.quantity*item.price,
            quantity: item.quantity,
          }))
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
        bill: true
      },
    });

    const tempOrderItems = await prismadb.tempOrderItems.deleteMany({
      where: {
        orderId: resultData.menuItems.orderId,
      }
    })

    const tempOrder = await prismadb.tempOrders.deleteMany({
      where: {
        tableId: resultData.tableId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[TABLES_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
