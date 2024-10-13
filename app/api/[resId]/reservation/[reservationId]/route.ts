import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { reservationId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, phone, status, visitors, date, tableId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !phone || !status || !visitors || !date || !tableId) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (!params.reservationId) {
      return new NextResponse("Reservation id is required", { status: 400 });
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

    const res = await prismadb.reservation.findFirst({
      where: {
        id: params.reservationId,
      },
    });

    if (!res) {
      return new NextResponse("Reservation not found", { status: 404 });
    }

    const reservation = await prismadb.reservation.update({
      where: {
        id: params.reservationId,
      },
      data: {
        name,
        phone,
        status,
        visitors,
        date,
        tableId,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.log("[RESERVATION_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
