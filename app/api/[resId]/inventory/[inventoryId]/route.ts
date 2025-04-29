import prismadb from "@/lib/prismadb";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { inventoryId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, availableQuantity, unit, minStockThreshold } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await hasPermission(userId, "UpdateInventory");

    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    if (!name || !price || !availableQuantity || !unit || !minStockThreshold) {
      return new NextResponse("Invalid data provided", { status: 400 });
    }

    if (!params.inventoryId) {
      return new NextResponse("Inventory item id is required", { status: 400 });
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
                  permissions: { some: { name: "UpdateInventory" } },
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

    const inventoryItem = await prismadb.inventory.updateMany({
      where: {
        id: params.inventoryId,
      },
      data: {
        name,
        price,
        availableQuantity,
        unit,
        minStockThreshold,
        totalCost: price * availableQuantity,
      },
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.log("[INVENTORY_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { inventoryId: string; resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await hasPermission(userId, "UpdateInventory");

    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    if (!params.inventoryId) {
      return new NextResponse("Inventory item id is required", { status: 400 });
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
                  permissions: { some: { name: "UpdateInventory" } },
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

    const inventoryItem = await prismadb.inventory.deleteMany({
      where: {
        id: params.inventoryId,
      },
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.log("[INVENTORY_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { inventoryId: string } }
) {
  try {
    const inventoryItem = await prismadb.inventory.findUnique({
      where: {
        id: params.inventoryId,
      },
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.log("[INVENTORY_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
