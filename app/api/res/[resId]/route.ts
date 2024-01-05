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

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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
