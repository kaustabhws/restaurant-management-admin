import prismadb from "@/lib/prismadb";

export const getDailyRevenue = async (restaurantId: string) => {
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

  // Get paid orders for today
  const paidOrdersToday = await prismadb.orders.findMany({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: today, // Orders from today
      },
    },
  });

  // Get paid orders for yesterday
  const paidOrdersYesterday = await prismadb.orders.findMany({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: yesterday, // Orders from yesterday
        lt: today, // Less than today
      },
    },
  });

  // Calculate today's revenue
  const todayRevenue = paidOrdersToday.reduce((total, order) => {
    return total + order.amount;
  }, 0);

  // Calculate yesterday's revenue
  const yesterdayRevenue = paidOrdersYesterday.reduce((total, order) => {
    return total + order.amount;
  }, 0);

  return {
    todayRevenue,
    yesterdayRevenue,
  };
};
