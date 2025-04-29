import prismadb from "@/lib/prismadb";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { resId: string; tempId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hasAccess = await hasPermission(userId, "ManageReservations");
    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id id is required", { status: 400 });
    }

    if (!params.tempId) {
      return new NextResponse("Temp order id id is required", { status: 400 });
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

    const item = await prismadb.tempOrderItems.findUnique({
      where: {
        orderId: params.tempId,
      },
    });

    const deleteTempOrderItems = await prismadb.tempOrderItems.deleteMany({
      where: {
        orderId: params.tempId,
      },
    });

    const deleteTempOrder = await prismadb.tempOrders.delete({
      where: {
        id: params.tempId,
      },
    });

    if (deleteTempOrder && item) {
      const itemId = item.itemId;

      const menu = await prismadb.menu.findUnique({
        where: {
          id: itemId,
        },
        include: {
          ingredients: true,
        },
      });

      if (menu) {
        await Promise.all(
          menu.ingredients.map(async (ingredient) => {
            const totalRequiredQuantity =
              ingredient.quantityUsed * item.quantity;

            await prismadb.inventory.update({
              where: { id: ingredient.inventoryId },
              data: {
                availableQuantity: {
                  increment: totalRequiredQuantity,
                },
              },
            });
          })
        );
      }
    }

    return NextResponse.json(item);
  } catch (error) {
    console.log("[Menu_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
