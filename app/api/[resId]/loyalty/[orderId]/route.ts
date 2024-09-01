import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

function countPoints(totalAmount: number) {
  return Math.floor((totalAmount * 5) / 100);
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { isPaid, payMode } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const restaurantByUserId = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurantByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const order = await prismadb.orders.update({
      where: {
        id: params.orderId,
      },
      data: {
        isPaid,
        payMode,
      },
    });

    if (!order.customerId) {
      return NextResponse.json(order);
    }

    await prismadb.customer.update({
      where: {
        id: order.customerId,
      },
      data: {
        loyaltyPoints: { decrement: order.amount },
      },
    });

    await prismadb.customer.update({
      where: {
        id: order.customerId,
      },
      data: {
        loyaltyPoints: { increment: countPoints(order.amount) },
        totalSpent: { increment: order.amount },
      },
    });

    if (!order.customerId) {
      return NextResponse.json(order);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log("[LOYALTY_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
