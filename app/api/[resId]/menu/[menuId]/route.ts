import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { menuId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, ingredients } = body;

    // Validate authentication and input
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!params.menuId || !params.resId) {
      return new NextResponse("Menu item ID and Restaurant ID are required", {
        status: 400,
      });
    }

    // Check if the user owns the restaurant
    const restaurant = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurant) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update the menu item details
    const menu = await prismadb.menu.update({
      where: {
        id: params.menuId,
      },
      data: {
        name,
        price,
      },
    });

    // Delete existing ingredients for the menu item in MenuInventory
    await prismadb.menuInventory.deleteMany({
      where: {
        menuId: params.menuId,
      },
    });

    // Create new ingredients in MenuInventory
    if (ingredients && Array.isArray(ingredients)) {
      await prismadb.menuInventory.createMany({
        data: ingredients.map(
          (ingredient: { inventoryId: string; quantityUsed: number }) => ({
            menuId: params.menuId,
            inventoryId: ingredient.inventoryId,
            quantityUsed: ingredient.quantityUsed,
          })
        ),
      });
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { menuId: string; resId: string } }
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

    await prismadb.menuInventory.deleteMany({
      where: {
        menuId: params.menuId,
      },
    });

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
      include: {
        ingredients: true,
      }
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
