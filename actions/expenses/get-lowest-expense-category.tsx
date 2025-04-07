import prismadb from "@/lib/prismadb";

export const getLowestExpenseCategory = async (restaurantId: string) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lowestExpenseCategory = await prismadb.expense.groupBy({
    by: ["categoryId"],
    where: {
      resId: restaurantId,
      createdAt: {
        gte: currentMonthStart,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "asc", // Ascending order for lowest expense
      },
    },
    take: 1, // Get only the lowest expense category
  });

  if (lowestExpenseCategory.length === 0) {
    return null; // No expenses found
  }

  const category = await prismadb.expenseCategory.findUnique({
    where: {
      id: lowestExpenseCategory[0].categoryId,
    },
  });

  return {
    category: category?.name || "Unknown Category",
    total: lowestExpenseCategory[0]._sum.amount || 0,
  };
};
