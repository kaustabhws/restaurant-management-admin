import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { tableId: string, resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, seats, status } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if(!seats) {
        return new NextResponse("Seats is required", { status: 400 });
    }

    if(!status) {
        return new NextResponse("Status is required", { status: 400 });
    }

    if (!params.tableId) {
      return new NextResponse("Table id is required", { status: 400 });
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

    const table = await prismadb.table.updateMany({
      where: {
        id: params.tableId,
      },
      data: {
        name,
        seats,
        status
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.log("[TABLE_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tableId: string, resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.tableId) {
      return new NextResponse("Menu item id is required", { status: 400 });
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

    const table = await prismadb.table.deleteMany({
      where: {
        id: params.tableId,
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.log("[TABLE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { tableId: string } }
) {
  try {
    const table = await prismadb.table.findUnique({
      where: {
        id: params.tableId,
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.log("[TABLE_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}