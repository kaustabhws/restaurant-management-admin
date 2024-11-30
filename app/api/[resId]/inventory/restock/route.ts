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

    const { quantity, price, inventoryItemId, isExpense } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!quantity || !price || !inventoryItemId) {
      return new NextResponse("Invalid data provided", { status: 400 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    if (quantity < 1 || price < 1) {
      return new NextResponse("Quantity and price must be at least 1", {
        status: 400,
      });
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

    const inventory = await prismadb.inventory.findUnique({
      where: {
        id: inventoryItemId,
      },
    });

    if (!inventory) {
      return new NextResponse("Inventory item not found", { status: 404 });
    }

    // Create inventory transaction
    const inventoryTransaction = await prismadb.inventoryTransaction.create({
      data: {
        quantity,
        price,
        resId: params.resId,
        inventoryId: inventoryItemId,
        isExpense,
      },
    });

    // Update inventory available quantity
    if (inventoryTransaction) {
      const updatedInventory = await prismadb.inventory.update({
        where: {
          id: inventoryItemId,
        },
        data: {
          availableQuantity: inventory.availableQuantity + quantity,
          lastRestockedAt: new Date(),
        },
      });
    }

    if (isExpense) {
      // Get or create expense category
      let categoryId = await prismadb.expenseCategory.findFirst({
        where: {
          name: "Ingredients",
        },
      });

      // Create category if not exists
      if (!categoryId) {
        categoryId = await prismadb.expenseCategory.create({
          data: {
            name: "Ingredients",
            resId: params.resId,
          },
        });
      }

      // Create expense
      await prismadb.expense.create({
        data: {
          amount: price,
          categoryId: categoryId.id,
          resId: params.resId,
          description: `Restocked ${inventory.name}`,
        },
      });
    }

    return NextResponse.json(inventoryTransaction);
  } catch (error) {
    console.log("[INVENTORY_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
