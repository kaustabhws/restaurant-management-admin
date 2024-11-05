import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const fromISTMidnightUTC = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1); // Move to the previous day
  date.setHours(18, 30, 0, 0); // Set to 18:30 UTC (00:00 IST of the intended day)
  return date;
};

const toISTMidnightUTC = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  date.setHours(18, 30, 0, 0); // Set to 18:30 UTC (00:00 IST of the intended day)
  return date;
};

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = fromISTMidnightUTC(from);
    const toDate = toISTMidnightUTC(to);

    if (!fromDate || !toDate) {
      return new NextResponse("Invalid date range", { status: 400 });
    }

    // Fetch sales data within the specified date range
    const salesData = await prismadb.orders.findMany({
      where: {
        resId: params.resId,
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Aggregate order items to find the most ordered item
    const itemCountMap = new Map();

    for (const order of salesData) {
      for (const item of order.orderItems) {
        itemCountMap.set(item.itemId, (itemCountMap.get(item.itemId) || 0) + 1);
      }
    }

    // Convert Map to array and find the itemId with the maximum count
    let mostOrderedItemId = null;
    let maxCount = 0;

    Array.from(itemCountMap.entries()).forEach(([itemId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostOrderedItemId = itemId;
      }
    });

    if (!mostOrderedItemId) {
      return NextResponse.json({ message: "No orders found" });
    }

    // Fetch the item name from the menu model
    const mostOrderedItem = await prismadb.menu.findUnique({
      where: {
        id: mostOrderedItemId,
      },
      select: {
        name: true,
      },
    });

    return NextResponse.json({
      salesData,
      mostOrderedItem: {
        id: mostOrderedItemId,
        name: mostOrderedItem?.name,
        count: maxCount,
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
