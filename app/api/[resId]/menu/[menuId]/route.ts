import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { menuId: string, resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!params.menuId) {
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

    const menu = await prismadb.menu.updateMany({
      where: {
        id: params.menuId,
      },
      data: {
        name,
        price
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { menuId: string, resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.menuId) {
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

    const menu = await prismadb.menu.deleteMany({
      where: {
        id: params.menuId,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[Menu_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { menuId: string } }
) {
  try {
    const menu = await prismadb.menu.findUnique({
      where: {
        id: params.menuId,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}