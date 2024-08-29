import prismadb from "@/lib/prismadb";

export const getOrderType = async (restaurantId: string) => {
  const orderTypes = await prismadb.orders.groupBy({
    by: ["orderType"],
    where: {
      resId: restaurantId,
      isPaid: true,
    },
    _count: {
      id: true,  // Sum the amount for each orderType
    },
  });

  const orderTypeTotals = orderTypes.map(orderType => ({
    itemName: orderType.orderType,
    value: orderType._count.id,
  }));

  return orderTypeTotals;
};
