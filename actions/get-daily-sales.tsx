import prismadb from "@/lib/prismadb";

export const getDailySales = async (restaurantId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const paidOrders = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: today,
      },
    },
  });

  return paidOrders
};
