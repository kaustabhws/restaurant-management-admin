import prismadb from "@/lib/prismadb";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, phone, status, visitors, date, tableId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const hasAccess = await hasPermission(userId, "ManageReservations");
    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    if (!name || !phone || !status || !visitors || !date || !tableId) {
      return new NextResponse("Invalid data", { status: 400 });
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

    const reservation = await prismadb.reservation.create({
      data: {
        resId: params.resId,
        name,
        phone,
        status,
        visitors,
        date,
        tableId,
      },
    });

    await prismadb.notification.create({
      data: {
        message: `New reservation from ${name}`,
        resId: params.resId,
        type: "Reservation",
        referenceId: reservation.id,
        status: "Unread",
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.log("[RESERVATION_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const reservations = await prismadb.reservation.findMany({
      where: {
        resId: params.resId,
      },
    });
    return NextResponse.json(reservations);
  } catch (error) {
    console.log("[RESERVATIONS_GET]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
