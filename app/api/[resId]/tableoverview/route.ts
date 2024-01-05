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

    const { menuItem, quantity, tableId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!menuItem) {
      return new NextResponse("Menu items are required", { status: 400 });
    }

    if (!tableId) {
      return new NextResponse("Table id are required", { status: 400 });
    }

    if (!quantity) {
      return new NextResponse("Quantity are required", { status: 400 });
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

    const item = await prismadb.menu.findUnique({
      where: {
        id: menuItem,
      },
    });

    const itemPrice = item?.price ?? 0;
    const amount = parseFloat(itemPrice.toFixed(2));

    const temporder = await prismadb.tempOrders.create({
      data: {
        resId: params.resId,
        amount: amount*quantity,
        tableId: tableId,
        isPaid: false,
        orderItems: {
          create: [
            {
              menuItem: {
                connect: {
                  id: menuItem,
                },
              },
              quantity: quantity,
            },
          ],
        },
      },
    });

    return NextResponse.json(temporder);
  } catch (error) {
    console.log("[TABLES_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}