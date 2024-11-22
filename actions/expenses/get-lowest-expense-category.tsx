import prismadb from "@/lib/prismadb";

export const getLowestExpenseCategory = async (restaurantId: string) => {
  const lowestExpenseCategory = await prismadb.expense.groupBy({
    by: ["categoryId"],
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
