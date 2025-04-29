import { getHighestExpenseCategory } from "@/actions/expenses/get-highest-expense-category";
import { getLowestExpenseCategory } from "@/actions/expenses/get-lowest-expense-category";
import { getMonthlyExpenses } from "@/actions/expenses/get-monthly-expense";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
const Overview = lazy(() => import("@/components/overview"));

import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { getCurrencyIcon } from "@/lib/getCurrenctIcon";
import prismadb from "@/lib/prismadb";
import { lazy, Suspense } from "react";
import { getGraphExpenses } from "@/actions/expenses/get-graph-expenses";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExpenseColumn } from "./components/columns";
import { format } from "date-fns";
import { getISTTime } from "@/lib/getISTTime";
import { ExpenseClient } from "./components/client";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const ExpensesPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {

  const { userId } = auth()

  const hasAccess = await hasPermission(userId!, "ViewExpenses")

  if(!hasAccess) {
    return (
      <AccessDenied url={`/${params.restaurantId}`} />
    )
  }

  const expenses = await getMonthlyExpenses(params.restaurantId);
  const highestExpenseCategory = await getHighestExpenseCategory(
    params.restaurantId
  );
  const lowestExpenseCategory = await getLowestExpenseCategory(
    params.restaurantId
  );
  const graphExpenses = await getGraphExpenses(params.restaurantId);

  // Calculate revenue increase
  const calculateExpenseIncrease = () => {
    if (expenses.previousMonth.total === 0) {
      return expenses.currentMonth.total > 0 ? 100 : 0;
    }

    return (
      ((expenses.currentMonth.total - expenses.previousMonth.total) /
        expenses.previousMonth.total) *
      100
    );
  };

  const increasedExpense = calculateExpenseIncrease() > 0;

  const currency = await prismadb.restaurants.findUnique({
    where: {
      id: params.restaurantId,
    },
  });

  if (!currency) {
    throw new Error("Currency not found");
  }

  const expenseDetails = await prismadb.expense.findMany({
    where: {
      resId: params.restaurantId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const formattedExpense: ExpenseColumn[] = expenseDetails.map((item) => ({
    id: item.id,
    category: item.category.name,
    amount: item.amount.toString(),
    description: item.description,
    createdAt: format(getISTTime(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3 max-[430px]:px-2">
        <div className="flex items-center justify-between">
          <Heading
            title="Expenses Dashboard"
            description="Expenses of your restaurant"
          />
          <Link href={`/${params.restaurantId}/expenses/add`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </Link>
        </div>
        <Separator />
        <div className="grid gap-4 grid-cols-3 max-[890px]:grid-cols-2 max-[630px]:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Expense
              </CardTitle>
              {getCurrencyIcon({
                currency: currency.currency,
                className: "h-4 w-4 text-muted-foreground",
              })}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold flex items-center">
                {getCurrencyIcon({ currency: currency.currency })}
                {expenses.currentMonth.total.toString()}
              </div>
              <div>
                {increasedExpense ? (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 text-xs border w-max px-2 rounded-full bg-[#fcf0f5]"
                      style={{ color: "red" }}
                    >
                      <TrendingUp size={15} color="red" />
                      {Math.abs(
                        parseFloat(calculateExpenseIncrease().toFixed(2))
                      )}
                      %
                    </div>
                    <span className="text-xs">vs last month</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 text-xs border w-max px-2 rounded-full bg-[#e1f7f0]"
                      style={{ color: "green" }}
                    >
                      <TrendingDown size={15} color="green" />
                      {parseFloat(calculateExpenseIncrease().toFixed(2))}%
                    </div>
                    <span className="text-xs">vs last month</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Highest Expense Category
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold">
                {highestExpenseCategory?.category || (
                  <p className="text-red-500">No Data</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">
                  {highestExpenseCategory?.total ? (
                    <p className="flex items-center">
                      {getCurrencyIcon({
                        currency: currency.currency,
                        size: 12,
                      })}{" "}
                      {highestExpenseCategory?.total} this month
                    </p>
                  ) : (
                    <p> No data </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lowest Expense Category
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold">
                {lowestExpenseCategory?.category || (
                  <p className="text-red-500">No Data</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">
                  {lowestExpenseCategory?.total ? (
                    <p className="flex items-center">
                      {getCurrencyIcon({
                        currency: currency.currency,
                        size: 12,
                      })}{" "}
                      {lowestExpenseCategory?.total} this month
                    </p>
                  ) : (
                    <p> No data </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Suspense>
                <Overview data={graphExpenses} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <ExpenseClient data={formattedExpense} />
      </div>
    </div>
  );
};

export default ExpensesPage;
