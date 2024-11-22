import prismadb from "@/lib/prismadb";

export const getPopularDays = async (restaurantId: string) => {
  const popularDays = await prismadb.orders.groupBy({
    by: ["createdAt"],
    where: {
      resId: restaurantId,
      isPaid: true,
    },
    _count: {
      _all: true,
    },
  });

  const dayCounts = popularDays.reduce((acc, curr) => {
    const day = new Date(curr.createdAt).getDay(); // Get day of the week (0-6)
    acc[day] = (acc[day] || 0) + curr._count._all;
    return acc;
  }, {} as Record<number, number>);

  // Convert dayCounts to an array of [day, count] pairs
  const sortedDays = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .slice(0, 4) // Get the top 4 days
    .map(([day, count]) => ({
      itemName: getDayName(parseInt(day)), // Convert day index to day name
      value: count,
    }));

  return sortedDays;
};

// function to convert day index to day name
const getDayName = (dayIndex: number) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[dayIndex];
};
