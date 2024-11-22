import prismadb from "@/lib/prismadb";

export const getMonthlyExpenses = async (restaurantId: string) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Current month's total expenses
  const currentMonth = await prismadb.expense.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: currentMonthStart,
      },
    },
  });

  // Previous month's total expenses
  const previousMonth = await prismadb.expense.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: previousMonthStart,
        lt: previousMonthEnd,
      },
    },
  });

  return {
    currentMonth: {
      total: currentMonth._sum.amount || 0, // Default to 0 if no expenses
    },
    previousMonth: {
      total: previousMonth._sum.amount || 0, // Default to 0 if no expenses
    },
  };
};
