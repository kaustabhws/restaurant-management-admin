import prismadb from "@/lib/prismadb";

export const getHighestExpenseCategory = async (restaurantId: string) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const highestExpenseCategory = await prismadb.expense.groupBy({
    by: ["categoryId"],
    where: {
      resId: restaurantId,
      createdAt: {
        gte: currentMonthStart,
      }
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 1, // Get only the highest expense category
  });

  if (highestExpenseCategory.length === 0) {
    return null; // No expenses found
  }

  const category = await prismadb.expenseCategory.findUnique({
    where: {
      id: highestExpenseCategory[0].categoryId,
    },
  });

  return {
    category: category?.name || "Unknown Category",
    total: highestExpenseCategory[0]._sum.amount || 0,
  };
};
