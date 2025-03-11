import { getBusinessWindow } from "@/lib/ist-to-utc";
import prismadb from "@/lib/prismadb";

export const getDailySales = async (restaurantId: string) => {
  // Fetch restaurant's opening and closing times (assuming stored as 'HH:MM:SS')
  const restaurant = await prismadb.restaurants.findUnique({
    where: { id: restaurantId },
    select: { openingTime: true, closingTime: true },
  });

  let todayOpening: Date, todayClosing: Date;
  let yesterdayOpening: Date, yesterdayClosing: Date;

  if (restaurant?.openingTime && restaurant?.closingTime) {
    // Use business hours conversion to UTC
    ({ openingUTC: todayOpening, closingUTC: todayClosing } =
      getBusinessWindow(restaurant.openingTime, restaurant.closingTime));

    // Calculate yesterday's business window
    yesterdayOpening = new Date(todayOpening);
    yesterdayOpening.setDate(yesterdayOpening.getDate() - 1);
    yesterdayClosing = new Date(todayClosing);
    yesterdayClosing.setDate(yesterdayClosing.getDate() - 1);
  } else {
    // Default logic using 18:30 UTC cutoff
    const now = new Date();
    
    // Default cut-off time is 18:30 UTC
    todayOpening = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18, 30)
    );

    if (
      now.getUTCHours() < 18 ||
      (now.getUTCHours() === 18 && now.getUTCMinutes() < 30)
    ) {
      todayOpening.setDate(todayOpening.getDate() - 1);
    }

    yesterdayOpening = new Date(todayOpening);
    yesterdayOpening.setDate(yesterdayOpening.getDate() - 1);

    todayClosing = new Date(todayOpening);
    todayClosing.setDate(todayClosing.getDate() + 1);
    yesterdayClosing = new Date(yesterdayOpening);
    yesterdayClosing.setDate(yesterdayClosing.getDate() + 1);
  }

  const paidOrdersToday = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: todayOpening,
        lt: todayClosing,
      },
    },
  });

  const paidOrdersYesterday = await prismadb.orders.count({
    where: {
      resId: restaurantId,
      isPaid: true,
      createdAt: {
        gte: yesterdayOpening,
        lt: yesterdayClosing,
      },
    },
  });

  return {
    paidOrdersToday,
    paidOrdersYesterday,
  };
};
