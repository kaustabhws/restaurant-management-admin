import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (restaurantId: string) => {
  const paidOrders = await prismadb.orders.findMany({
    where: {
      resId: restaurantId,
      isPaid: true
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    return total + order.amount;
  }, 0);

  return totalRevenue;
};
