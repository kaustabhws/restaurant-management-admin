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

    const { name, price, availableQuantity, unit, minStockThreshold } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !price || !availableQuantity || !unit || !minStockThreshold) {
      return new NextResponse("Invalid data provided", { status: 400 });
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

    const inventory = await prismadb.inventory.create({
      data: {
        name,
        price,
        availableQuantity,
        unit,
        totalCost: price * availableQuantity,
        minStockThreshold,
        resId: params.resId,
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.log("[INVENTORY_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const inventory = await prismadb.inventory.findMany({
      where: {
        resId: userId,
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.log("[INVENTORY_GET]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
