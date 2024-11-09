import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { campaignId: string; resId: string } }
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

    if (!params.campaignId) {
      return new NextResponse("Campaign id is required", { status: 400 });
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

    const campaign = await prismadb.campaign.updateMany({
      where: {
        id: params.campaignId,
      },
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
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.log("[CAMPAIGN_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}