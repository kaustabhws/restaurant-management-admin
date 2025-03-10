import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      currency,
      upiId,
      street,
      city,
      zipcode,
      state,
      country,
      phone,
      gstNo,
      openingTime,
      closingTime,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const restaurant = await prismadb.restaurants.updateMany({
      where: {
        id: params.resId,
        userId,
      },
      data: {
        name,
        currency,
        upiId,
        street,
        city,
        zipcode,
        state,
        country,
        phone,
        gstNo,
        openingTime,
        closingTime,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.log("[RESTAURANT_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    // Delete related data first to avoid foreign key constraint violations
    await prismadb.tempOrderItems.deleteMany({
      where: {
        orders: {
          resId: params.resId,
        },
      },
    });

    await prismadb.orderItems.deleteMany({
      where: {
        orders: {
          resId: params.resId,
        },
      },
    });

    await prismadb.tempOrders.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.menu.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.table.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.orders.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.bill.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.customer.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.loyaltyTransaction.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.reservation.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    await prismadb.notification.deleteMany({
      where: {
        resId: params.resId,
      },
    });

    // Finally, delete the restaurant itself
    const restaurant = await prismadb.restaurants.deleteMany({
      where: {
        id: params.resId,
        userId,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.log("[RESTAURANT_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
