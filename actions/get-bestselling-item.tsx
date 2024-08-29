import prismadb from "@/lib/prismadb";

export const getTopSellingItems = async (restaurantId: string) => {
  const topItems = await prismadb.orderItems.groupBy({
    by: ['itemId'],
    where: {
      orders: {
        resId: restaurantId,
        isPaid: true,
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  });

  const graphData = await Promise.all(
    topItems.map(async (item) => {
      const menuItem = await prismadb.menu.findUnique({
        where: { id: item.itemId },
      });
      return {
        itemName: menuItem?.name || 'Unknown Item',
        value: item._sum?.quantity || 0,
      };
    })
  );

  return graphData;
};
