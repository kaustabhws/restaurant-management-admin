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

    const order = await prismadb.orders.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Check if the order is already paid
    if (order.isPaid) {
      return new NextResponse("Order is already paid", { status: 400 });
    }

    // Proceed with updating the payment status and loyalty points
    const updatedOrder = await prismadb.orders.update({
      where: {
        id: params.orderId,
      },
      data: {
        isPaid,
        payMode,
      },
    });

    if (updatedOrder.customerId) {
      const customer = await prismadb.customer.update({
        where: {
          id: updatedOrder.customerId,
        },
        data: {
          loyaltyPoints: { decrement: updatedOrder.amount },
        },
      });

      await prismadb.loyaltyTransaction.create({
        data: {
          customerId: updatedOrder.customerId,
          resId: params.resId,
          amount: updatedOrder.amount,
          description: `Redeemed for #${updatedOrder.slNo}`,
          type: "Redeemed",
        },
      });

      await prismadb.customer.update({
        where: {
          id: updatedOrder.customerId,
        },
        data: {
          loyaltyPoints: { increment: countPoints(updatedOrder.amount) },
          totalSpent: { increment: updatedOrder.amount },
        },
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log("[LOYALTY_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
