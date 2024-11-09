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

    const { isPaid, payMode, discount, removeDiscount, coupon, discountType } =
      body;

    // null checks
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

    // Check if the order is paid with loyalty points
    const orderById = await prismadb.orders.findFirst({
      where: {
        id: params.orderId,
      },
    });

    if (!orderById) {
      return new NextResponse("Order not found", { status: 400 });
    }

    if (orderById?.payMode == "Loyalty Points") {
      return new NextResponse(
        "Order paid with loyalty points cannot be updated",
        { status: 400 }
      );
    }

    // Apply discount
    // Handle discount application
    if (discount || (removeDiscount && discountType === "Percentage")) {
      if (orderById?.isPaid) {
        return new NextResponse("Order is already paid", { status: 400 });
      }

      if (discount && orderById?.discount) {
        return new NextResponse("Discount already applied", { status: 400 });
      }
      const updatedAmount = removeDiscount
        ? orderById?.amount! + orderById?.discount!
        : orderById?.amount! - discount!;

      await prismadb.orders.update({
        where: { id: params.orderId },
        data: {
          discount: removeDiscount ? 0 : discount,
          amount: updatedAmount,
          discountType: removeDiscount ? null : "Percentage",
        },
      });

      return NextResponse.json({
        message: removeDiscount ? "Discount removed" : "Discount applied",
      });
    }

    // Apply coupon
    // Handle coupon application
    if (coupon || (removeDiscount && discountType === "Coupon")) {
      if (orderById?.isPaid) {
        return new NextResponse("Order is already paid", { status: 400 });
      }

      if (!removeDiscount && discount && orderById?.discount) {
        return new NextResponse("Coupon already applied", { status: 400 });
      }

      const couponById = await prismadb.campaign.findUnique({
        where: { code: coupon },
      });

      if (!couponById) {
        return new NextResponse("Invalid coupon code", { status: 404 });
      }

      // Check if coupon is still valid
      const currentDate = new Date();
      if (
        currentDate < couponById.startDate ||
        currentDate > couponById.endDate
      ) {
        return new NextResponse("Coupon is not valid at this time", {
          status: 400,
        });
      }

      if (couponById.remainingUsage <= 0) {
        return new NextResponse("Coupon usage limit reached", { status: 400 });
      }

      if (orderById.amount < couponById.minOrderAmount) {
        return new NextResponse(
          `Minimum order amount of ${couponById.minOrderAmount} required to apply this coupon`,
          { status: 400 }
        );
      }

      // Calculate discount based on coupon settings
      const discountAmount = (orderById.amount * couponById.discount) / 100;
      const finalDiscount = Math.min(discountAmount, couponById.maxDiscount);

      const updatedAmount = removeDiscount
        ? orderById?.amount! + finalDiscount
        : orderById?.amount! - finalDiscount;
      
      // Update order with the calculated discount
      await prismadb.orders.update({
        where: { id: orderById.id },
        data: {
          discount: finalDiscount,
          discountType: "Coupon",
          amount: updatedAmount,
        },
      });

      // Update remaining usage of the coupon
      await prismadb.campaign.update({
        where: { id: couponById.id },
        data: { remainingUsage: couponById.remainingUsage - 1 },
      });

      return NextResponse.json({
        message: "Discount applied",
        discount: finalDiscount,
      });
    }

    if (isPaid && !payMode) {
      return new NextResponse("Payment mode is required", { status: 400 });
    }

    // Update the order
    const order = await prismadb.orders.update({
      where: {
        id: params.orderId,
      },
      data: {
        isPaid,
        payMode,
      },
    });

    // Create a notification if the order is paid
    if (isPaid) {
      await prismadb.notification.create({
        data: {
          resId: params.resId,
          type: "Order",
          referenceId: order.id,
          message: `Order #${order.slNo} paid successfully`,
          status: "Unread",
        },
      });
    }

    if (!order.customerId) {
      return NextResponse.json(order);
    }

    // if order is paid and not paid before, increment loyalty points
    if (isPaid) {
      await prismadb.customer.update({
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
    } else if (
      !isPaid &&
      orderById?.isPaid &&
      orderById.payMode !== "Loyalty Points"
    ) {
      // Deduct loyalty points if the order is now unpaid and was previously paid
      const loyaltyPointsDeducted = countPoints(order.amount); // Calculate the points to deduct

      await prismadb.customer.update({
        where: {
          id: order.customerId,
        },
        data: {
          loyaltyPoints: { decrement: loyaltyPointsDeducted },
          totalSpent: { decrement: order.amount },
        },
      });

      await prismadb.loyaltyTransaction.create({
        data: {
          customerId: order.customerId,
          resId: params.resId,
          amount: loyaltyPointsDeducted,
          type: "Deleted",
          description: `Unpaid order #${order.slNo} - Deducted ${loyaltyPointsDeducted} points`,
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

    if (orderById?.customer?.id) {
      // Only attempt to update if customer ID is available
      await prismadb.customer.update({
        where: {
          id: orderById.customer.id,
        },
        data: {
          loyaltyPoints: {
            decrement: orderById.amount ? countPoints(orderById.amount) : 0,
          },
          totalSpent: { decrement: orderById.amount },
        },
      });

      await prismadb.loyaltyTransaction.create({
        data: {
          customerId: orderById.customer.id,
          resId: params.resId,
          amount: countPoints(orderById.amount!),
          type: "Deleted",
          description: `Deleted order #${
            orderById.slNo
          } - Deducted ${countPoints(orderById.amount!)}`,
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
