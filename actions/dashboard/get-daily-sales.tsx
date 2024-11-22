import prismadb from "@/lib/prismadb";

export const getDailySales = async (restaurantId: string) => {
  // Get the current date
  const now = new Date();

  // Create a date object for today at 18:30 UTC of the current day
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 30)
  );

  // If current time is before 18:30 UTC, set today to the previous day
  if (
    now.getUTCHours() < 18 ||
    (now.getUTCHours() === 18 && now.getUTCMinutes() < 30)
  ) {
    today.setDate(today.getDate() - 1);
  }

  // Create a date for yesterday at 18:30 UTC
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const paidOrdersToday = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: today,
      },
    },
  });

  const paidOrdersYesterday = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
  });

  return {
    paidOrdersToday,
    paidOrdersYesterday,
  };
};
