import prismadb from "@/lib/prismadb";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { menuId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, ingredients, images } = body;

    const hasAccess = await hasPermission(userId!, "UpdateMenu");
    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

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
        OR: [
          { id: params.resId, userId },
          {
            id: params.resId,
            users: {
              some: {
                clerkId: userId,
                role: {
                  permissions: { some: { name: "UpdateMenu" } },
                },
              },
            },
          },
        ],
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
        images: {
          deleteMany: {},
        },
      },
    });

    await prismadb.menu.update({
      where: {
        id: params.menuId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
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

    const hasAccess = await hasPermission(userId, "DeleteMenu");
    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    const restaurantByUserId = await prismadb.restaurants.findFirst({
      where: {
        OR: [
          { id: params.resId, userId },
          {
            id: params.resId,
            users: {
              some: {
                clerkId: userId,
                role: {
                  permissions: { some: { name: "UpdateMenu" } },
                },
              },
            },
          },
        ],
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
        images: true,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENU_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
