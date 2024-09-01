import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type GraphData = {
  date: string;
  total: number;
};

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const month = Number(searchParams.get("month"));

  const restaurant = await prismadb.restaurants.findFirst({
    where: {
      id: params.resId,
    },
  });

  if (!restaurant) {
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

    const dailyRevenue: { [key: number]: number } = {};

    // Grouping the orders by day and summing the revenue
    for (const order of paidOrders) {
      const localDate = new Date(order.createdAt);
      const day = localDate.getDate(); // Get the day of the month

      // Adding the revenue for this order to the respective day
      dailyRevenue[day] = (dailyRevenue[day] || 0) + order.amount;
    }

    // Converting the grouped data into the format expected by the graph
    const graphData: GraphData[] = [];

    const daysInMonth = new Date(
      new Date().getFullYear(),
      month + 1,
      0
    ).getDate(); // Get the number of days in the month

    const year = new Date().getFullYear();

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = new Date(year, month, day)
        .toLocaleDateString("en-CA");

      graphData.push({
        date: formattedDate, // "YYYY-MM-DD"
        total: dailyRevenue[day] || 0, // Revenue for that day, or 0 if no orders
      });
    }

    return NextResponse.json(graphData, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}
