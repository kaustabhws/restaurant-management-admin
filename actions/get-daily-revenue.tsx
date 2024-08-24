import prismadb from "@/lib/prismadb";

export const getDailyRevenue = async (restaurantId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const paidOrders = await prismadb.orders.findMany({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: today,
      },
    },
  });

  const dailyRevenue = paidOrders.reduce((total, order) => {
    return total + order.amount;
  }, 0);

  return dailyRevenue;
};
