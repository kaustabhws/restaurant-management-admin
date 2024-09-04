import React, { lazy, Suspense } from "react";
import {
  CalendarCheck,
  CreditCard,
  IndianRupee,
  MenuSquare,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { getDailyRevenue } from "@/actions/get-daily-revenue";
import { getDailySales } from "@/actions/get-daily-sales";
const Overview = lazy(() => import("@/components/overview"));

interface DashboardPageProps {
  params: {
    restaurantId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.restaurantId);
  const graphRevenue = await getGraphRevenue(params.restaurantId);
  const salesCount = await getSalesCount(params.restaurantId);
  const stockCount = await getStockCount(params.restaurantId);
  const dailyRevenue = await getDailyRevenue(params.restaurantId);
  const dailySales = await getDailySales(params.restaurantId);

  // Calculate revenue increase
  const calculateRevenueIncrease = () => {
    if (dailyRevenue.yesterdayRevenue === 0) {
      return dailyRevenue.todayRevenue > 0 ? 100 : 0;
    }

    return (
      ((dailyRevenue.todayRevenue - dailyRevenue.yesterdayRevenue) /
        dailyRevenue.yesterdayRevenue) *
      100
    );
  };

  const increasedRevenue = calculateRevenueIncrease() > 0;

  // Calculate sales increase
  const calculateSalesIncrease = () => {
    if (dailySales.paidOrdersYesterday === 0) {
      return dailySales.paidOrdersToday > 0 ? 100 : 0;
    }

    return (
      ((dailySales.paidOrdersToday - dailySales.paidOrdersYesterday) /
        dailySales.paidOrdersYesterday) *
      100
    );
  };
  const increasedSales = calculateSalesIncrease() > 0;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3 max-[430px]:px-2">
        <Heading title="Dashboard" description="Overview of your restaurant" />
        <Separator />
        <div className="grid gap-4 grid-cols-3 max-[657px]:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Revenue
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold">
                {formatter.format(dailyRevenue.todayRevenue)}
              </div>
              <div>
                {increasedRevenue ? (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 text-xs border w-max px-2 rounded-full bg-[#e1f7f0]"
                      style={{ color: "green" }}
                    >
                      <TrendingUp size={15} color="green" />
                      {parseFloat(calculateRevenueIncrease().toFixed(2))}%
                    </div>
                    <span className="text-xs">vs yesterday</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 text-xs border w-max px-2 rounded-full bg-[#fcf0f5]"
                      style={{ color: "red" }}
                    >
                      <TrendingDown size={15} color="red" />
                      {Math.abs(
                        parseFloat(calculateRevenueIncrease().toFixed(2))
                      )}
                      %
                    </div>
                    <span className="text-xs">vs yesterday</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold">
                +{dailySales.paidOrdersToday}
              </div>
              <div>
                {increasedSales ? (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 text-xs border w-max px-2 rounded-full bg-[#e1f7f0]"
                      style={{ color: "green" }}
                    >
                      <TrendingUp size={15} color="green" />
                      {parseFloat(calculateSalesIncrease().toFixed(2))}%
                    </div>
                    <span className="text-xs">vs yesterday</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div
                      className="flex items-center gap-1 text-xs border w-max px-2 rounded-full bg-[#fcf0f5]"
                      style={{ color: "red" }}
                    >
                      <TrendingDown size={15} color="red" />
                      {Math.abs(
                        parseFloat(calculateSalesIncrease().toFixed(2))
                      )}
                      %
                    </div>
                    <span className="text-xs">vs yesterday</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Menu items
              </CardTitle>
              <MenuSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lifetime Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lifetime Sales
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense>
              <Overview data={graphRevenue} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
