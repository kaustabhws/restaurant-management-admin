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

    const {
      name,
      description,
      code,
      startDate,
      endDate,
      discount,
      maxDiscount,
      minOrderAmount,
      maxUsage,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !description || !code || !startDate || !endDate || !discount) {
      return new NextResponse("Invalid data provided", { status: 400 });
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

    const campaign = await prismadb.campaign.create({
      data: {
        name,
        description,
        code,
        startDate,
        endDate,
        discount,
        maxDiscount,
        minOrderAmount,
        maxUsage,
        remainingUsage: maxUsage,
        resId: params.resId,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.log("[CAMPAIGN_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
