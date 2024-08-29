import prismadb from "@/lib/prismadb";

export const getDailySales = async (restaurantId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const paidOrdersToday = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: today,
      },
    },
  });

  const paidOrdersYesterday = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
  });

  return {
    paidOrdersToday,
    paidOrdersYesterday
  }
};
