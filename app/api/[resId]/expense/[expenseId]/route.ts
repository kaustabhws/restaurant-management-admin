import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { expenseId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { amount, category, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!amount || !category || !description) {
      return new NextResponse("Invalid data provided", { status: 400 });
    }

    if (!params.expenseId) {
      return new NextResponse("Expense id is required", { status: 400 });
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

    const expenseItem = await prismadb.expense.update({
      where: {
        id: params.expenseId,
      },
      data: {
        amount,
        categoryId: category,
        description,
      },
    });

    return NextResponse.json(expenseItem);
  } catch (error) {
    console.log("[EXPENSE_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { expenseId: string; resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.expenseId) {
      return new NextResponse("Expense id is required", { status: 400 });
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

    const expenseItem = await prismadb.expense.delete({
      where: {
        id: params.expenseId,
      },
    });

    return NextResponse.json(expenseItem);
  } catch (error) {
    console.log("[EXPENSE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const expenseItem = await prismadb.expense.findUnique({
      where: {
        id: params.expenseId,
      },
    });

    return NextResponse.json(expenseItem);
  } catch (error) {
    console.log("[EXPENSE_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
