import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, currency } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const restaurant = await prismadb.restaurants.create({
      data: {
        name,
        currency,
        userId,
      },
    });
    return NextResponse.json(restaurant);
  } catch (error) {
    console.log("[RESTAURANTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resId = searchParams.get("resId");

    if (!resId) {
      return new NextResponse("Restaurant ID is required", { status: 400 });
    }

    const restaurant = await prismadb.restaurants.findUnique({
      where: {
        id: resId,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.log("[RESTAURANTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
