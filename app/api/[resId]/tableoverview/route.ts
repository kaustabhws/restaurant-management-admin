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

    const { menuItem, quantity, tableId, takeAwayId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!menuItem) {
      return new NextResponse("Menu items are required", { status: 400 });
    }

    if (!tableId && !takeAwayId) {
      return new NextResponse("Table/takeaway id are required", {
        status: 400,
      });
    }

    if (!quantity) {
      return new NextResponse("Quantity are required", { status: 400 });
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

    const item = await prismadb.menu.findUnique({
      where: {
        id: menuItem,
      },
    });

    const itemPrice = item?.price ?? 0;
    const amount = parseFloat(itemPrice.toFixed(2));

    const menu = await prismadb.menu.findUnique({
      where: {
        id: menuItem,
      },
      include: {
        ingredients: true,
      },
    });

    const inventory = await prismadb.inventory.findMany({
      where: {
        resId: params.resId,
      },
    });

    // Check if the required quantity of each ingredient is available in inventory
    if (menu && inventory) {
      for (const ingredient of menu.ingredients) {
        const requiredQuantity = ingredient.quantityUsed * quantity;
        const inventoryItem = inventory.find(
          (inv) => inv.id === ingredient.inventoryId
        );

        if (
          !inventoryItem ||
          inventoryItem.availableQuantity < requiredQuantity
        ) {
          return new NextResponse(
            `Insufficient stock for ingredient ${inventoryItem?.name}`,
            {
              status: 400,
            }
          );
        }
      }
    }

    const temporder = await prismadb.tempOrders.create({
      data: {
        resId: params.resId,
        amount: amount * quantity,
        tableId: tableId ? tableId : null,
        takeawayId: takeAwayId ? takeAwayId : null,
        isPaid: false,
        orderItems: {
          create: [
            {
              menuItem: {
                connect: {
                  id: menuItem,
                },
              },
              quantity: quantity,
            },
          ],
        },
      },
    });

    // Decrement inventory quantities for each ingredient
    if (menu && menu.ingredients.length > 0 && temporder) {
      await Promise.all(
        menu.ingredients.map(async (ingredient) => {
          const totalRequiredQuantity = ingredient.quantityUsed * quantity;

          await prismadb.inventory.update({
            where: { id: ingredient.inventoryId },
            data: {
              availableQuantity: {
                decrement: totalRequiredQuantity,
              },
            },
          });
        })
      );
    }

    return NextResponse.json(temporder);
  } catch (error) {
    console.log("[TEMPORDER_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
