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
    // Use the restaurant's configured business hours
    ({ openingUTC: todayOpening, closingUTC: todayClosing } = getBusinessWindow(
      restaurant.openingTime,
      restaurant.closingTime
    ));
    ({ openingUTC: yesterdayOpening, closingUTC: yesterdayClosing } =
      getBusinessWindow(restaurant.openingTime, restaurant.closingTime));
    yesterdayOpening.setDate(yesterdayOpening.getDate() - 1);
    yesterdayClosing.setDate(yesterdayClosing.getDate() - 1);
  } else {
    // Default to 18:30 UTC as the cut-off when no opening/closing time is set
    const now = new Date();

    todayOpening = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        18,
        30
      )
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
    todayClosing.setDate(todayClosing.getDate() + 1); // Closing time is the next day's opening
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
