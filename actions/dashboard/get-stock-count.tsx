import prismadb from "@/lib/prismadb";

export const getStockCount = async (restaurantId: string) => {
  const stockCount = await prismadb.menu.count({
    where: {
      resId: restaurantId,
    }
  });

  return stockCount;
};