import prismadb from "@/lib/prismadb";

export const getPreferredPayment = async (restaurantId: string) => {
  const result = await prismadb.orders.groupBy({
    by: ['payMode'],
    where: {
      resId: restaurantId,
      isPaid: true,
    },
    _count: {
      payMode: true,
    },
    orderBy: {
      _count: {
        payMode: 'desc',
      },
    },
  });

  return result.map((item) => ({
    itemName: item.payMode,
    value: item._count.payMode,
  }));
};
