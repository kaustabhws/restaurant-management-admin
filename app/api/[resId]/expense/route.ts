import prismadb from "@/lib/prismadb";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { amount, category, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const hasAccess = await hasPermission(userId, "ManageExpenses");

    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    if (!amount || !category || !description) {
      return new NextResponse("Invalid data provided", { status: 400 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const restaurantsByUserId = await prismadb.restaurants.findFirst({
      where: {
        OR: [
          { id: params.resId, userId },
          {
            id: params.resId,
            users: {
              some: {
                clerkId: userId,
                role: {
                  permissions: { some: { name: "ManageExpenses" } },
                },
              },
            },
          },
        ],
      },
    });

    if (!restaurantsByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const expense = await prismadb.expense.create({
      data: {
        amount,
        categoryId: category,
        description,
        resId: params.resId,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.log("[EXPENSE_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const expenses = await prismadb.expense.findMany({
      where: {
        resId: params.resId,
      },
      include: {
        category: true,
      }
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.log("[EXPENSE_GET]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
