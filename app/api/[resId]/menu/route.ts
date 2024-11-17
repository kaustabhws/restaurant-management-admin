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
    const { name, price, ingredients, images } = body;

    // Validation
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!params.resId) {
      return new NextResponse("Restaurant ID is required", { status: 400 });
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

    const menu = await prismadb.menu.create({
      data: {
        name,
        price,
        resId: params.resId,
        ingredients: {
          create: ingredients.map(
            (ingredient: { inventoryId: string; quantityUsed: number }) => ({
              inventoryId: ingredient.inventoryId,
              quantityUsed: ingredient.quantityUsed,
            })
          ),
        },
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.log("[MENUS_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const menus = await prismadb.menu.findMany({
      where: {
        resId: params.resId,
      },
      include: {
        ingredients: true,
      }
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.log("[MENUS_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
