import prismadb from "@/lib/prismadb";

export const getDailyRevenue = async (restaurantId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const paidOrdersToday = await prismadb.orders.findMany({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: today,
      },
    },
  });

  const paidOrdersYesterday = await prismadb.orders.findMany({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
  });

  const todayRevenue = paidOrdersToday.reduce((total, order) => {
    return total + order.amount;
  }, 0);

  const yesterdayRevenue = paidOrdersYesterday.reduce((total, order) => {
    return total + order.amount;
  }, 0);

  return {
    todayRevenue,
    yesterdayRevenue,
  };
};
