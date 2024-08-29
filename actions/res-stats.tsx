import prismadb from "@/lib/prismadb";

// Most ordered food
export const getMostOrderedFood = async (restaurantId: string) => {
  const mostOrdered = await prismadb.orderItems.groupBy({
    by: ["itemId"],
    _sum: {
      quantity: true,
    },
    where: {
      orders: {
        resId: restaurantId,
        isPaid: true
      },
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 1,
  });

  if (mostOrdered.length === 0) {
    return null; // No orders found
  }

  const mostOrderedItemId = mostOrdered[0].itemId;

  // Step 2: Fetch the details of the most ordered menu item
  const mostOrderedItem = await prismadb.menu.findUnique({
    where: {
      id: mostOrderedItemId,
    },
  });

  return {
    ...mostOrdered[0],
    menuItem: mostOrderedItem,
  };
};

// Highest revenue generating food
export const getHighestRevenueFood = async (restaurantId: string) => {
  const highestRevenue = await prismadb.orderItems.groupBy({
    by: ["itemId"],
    _sum: {
      quantity: true,
    },
    where: {
      orders: {
        resId: restaurantId,
        isPaid: true
      },
    },
  });

  if (highestRevenue.length === 0) {
    return null; // No orders found
  }

  let highestRevenueItem = null;
  let highestRevenueAmount = 0;

  for (const item of highestRevenue) {
    const quantity = item._sum.quantity ?? 0;
    const menuItem = await prismadb.menu.findUnique({
      where: {
        id: item.itemId,
      },
    });

    if (menuItem) {
      const revenue = quantity * menuItem.price;

      if (revenue > highestRevenueAmount) {
        highestRevenueAmount = revenue;
        highestRevenueItem = {
          ...item,
          menuItem,
          revenue,
        };
      }
    }
  }

  return highestRevenueItem;
};

// Highest amount paid by a customer
export const getHighestBillAmount = async (restaurantId: string) => {
  const highestBill = await prismadb.orders.findFirst({
    where: {
      resId: restaurantId,
      isPaid: true,
    },
    orderBy: {
      amount: "desc",
    },
  });

  return highestBill;
};

// Average order value
export const getAverageOrderValue = async (restaurantId: string) => {
  const result = await prismadb.orders.aggregate({
    where: {
      resId: restaurantId,
      isPaid: true,
    },
    _avg: {
      amount: true,
    },
  });

  return result._avg.amount ?? 0; // Return 0 if no orders are found
};

// Most popular table

export const getMostPopularTable = async (restaurantId: string) => {
  const tablePopularity = await prismadb.orders.groupBy({
    by: ['tableNo'], // Group by table name
    _count: {
      id: true, // Count the number of orders for each table
    },
    where: {
      resId: restaurantId,
      isPaid: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 1, // Get the table with the highest count
  });

  if (tablePopularity.length === 0) {
    return null; // No orders found
  }

  const popularTableName = tablePopularity[0].tableNo;
  const tableCount = tablePopularity[0]._count.id;

  const popularTable = await prismadb.table.findFirst({
    where: {
      name: popularTableName?.toString(),
      resId: restaurantId, 
    },
  });

  return {
    table: popularTable,
    count: tableCount,
  };
};