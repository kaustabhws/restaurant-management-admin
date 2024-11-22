import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphExpenses = async (
  restaurantId: string
): Promise<GraphData[]> => {
  const expenses = await prismadb.expense.findMany({
    where: {
      resId: restaurantId,
    },
  });

  const monthlyExpenses: { [key: number]: number } = {};

  // Grouping the expenses by month and summing the amounts
  for (const expense of expenses) {
    const month = expense.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
    monthlyExpenses[month] =
      (monthlyExpenses[month] || 0) + Number(expense.amount);
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  // Filling in the expense data
  for (const month in monthlyExpenses) {
    graphData[parseInt(month)].total = monthlyExpenses[parseInt(month)];
  }

  return graphData;
};
