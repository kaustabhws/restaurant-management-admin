import prismadb from "@/lib/prismadb";

export const getSalesCount = async (restaurantId: string) => {
  const salesCount = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true
    },
  });

  return salesCount;
};