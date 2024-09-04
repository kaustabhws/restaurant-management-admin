import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

function countPoints(totalAmount: number) {
  return Math.floor((totalAmount * 5) / 100);
}

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orders = await prismadb.orders.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        orderItems: true,
        bill: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log("[ORDER_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
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

    const orderById = await prismadb.orders.findFirst({
      where: {
        id: params.orderId,
      },
    });

    if (orderById?.payMode == "Loyalty Points") {
      return new NextResponse(
        "Order paid with loyalty points cannot be updated",
        { status: 400 }
      );
    }

    if (isPaid && !payMode) {
      return new NextResponse("Payment mode is required", { status: 400 });
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

    if (isPaid) {
      const customer = await prismadb.customer.update({
        where: {
          id: order.customerId,
        },
        data: {
          loyaltyPoints: { increment: countPoints(order.amount) },
          totalSpent: { increment: order.amount },
        },
      });

      await prismadb.loyaltyTransaction.create({
        data: {
          customerId: order.customerId,
          resId: params.resId,
          amount: countPoints(order.amount),
          type: "Earned",
          description: `#${order.slNo} - Earned ${countPoints(
            order.amount
          )} points`,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { resId: string; orderId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
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

    // Delete associated order items first
    await prismadb.orderItems.deleteMany({
      where: {
        orderId: params.orderId,
      },
    });

    // Delete associated bill
    await prismadb.bill.deleteMany({
      where: {
        orderId: params.orderId,
      },
    });

    const orderById = await prismadb.orders.findFirst({
      where: {
        id: params.orderId,
      },
      include: {
        customer: true,
      },
    });

    await prismadb.customer.update({
      where: {
        id: orderById?.customer?.id,
      },
      data: {
        loyaltyPoints: {
          decrement: orderById?.amount ? countPoints(orderById.amount) : 0,
        },
        totalSpent: { decrement: orderById?.amount },
      },
    });

    if (orderById?.customer?.id) {
      await prismadb.loyaltyTransaction.create({
        data: {
          customerId: orderById?.customer?.id,
          resId: params.resId,
          amount: countPoints(orderById?.amount!),
          type: "Deleted",
          description: `Deleted order #${
            orderById?.slNo
          } - Deducted ${countPoints(orderById?.amount!)}`,
        },
      });
    }

    // Then delete the order
    const order = await prismadb.orders.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
