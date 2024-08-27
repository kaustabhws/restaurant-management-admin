import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type GraphData = {
  name: string;
  total: number;
};

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);

  if(!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const month = Number(searchParams.get("month"));

  const restaurant = await prismadb.restaurants.findFirst({
    where: {
      id: params.resId,
    }
  })

  if(!restaurant) {
    return new NextResponse("Restaurant not found", { status: 404 });
  }

  try {
    const paidOrders = await prismadb.orders.findMany({
      where: {
        resId: params.resId,
        isPaid: true,
        createdAt: {
          gte: new Date(new Date().getFullYear(), month, 1),
          lt: new Date(new Date().getFullYear(), month + 1, 1),
        },
      },
    });

    const weeklyRevenue: { [key: number]: number } = {};

    // Grouping the orders by week and summing the revenue
    for (const order of paidOrders) {
      const week = Math.floor((order.createdAt.getDate() - 1) / 7) + 1; // Determine the week of the month

      // Adding the revenue for this order to the respective week
      weeklyRevenue[week] = (weeklyRevenue[week] || 0) + order.amount;
    }

    // Converting the grouped data into the format expected by the graph
    const graphData: GraphData[] = [];

    for (let week = 1; week <= 5; week++) {
      // Assuming a maximum of 5 weeks in a month
      graphData.push({
        name: `Week ${week}`,
        total: weeklyRevenue[week] || 0, // Revenue for that week, or 0 if no orders
      });
    }

    return NextResponse.json(graphData, { status: 200 });

  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
