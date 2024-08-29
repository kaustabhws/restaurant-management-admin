import React, { lazy, Suspense } from "react";
import {
  getAverageOrderValue,
  getHighestBillAmount,
  getHighestRevenueFood,
  getMostOrderedFood,
  getMostPopularTable,
} from "@/actions/res-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
const WeeklyOverview = lazy(() => import("./_components/weekly-overview"));
import { IndianRupee, Table, TrendingUp } from "lucide-react";

interface InsightsPageProps {
  params: {
    restaurantId: string;
  };
}

const InsightsPage: React.FC<InsightsPageProps> = async ({ params }) => {
  const mostOrderedFood = await getMostOrderedFood(params.restaurantId);
  const highestRevenueFood = await getHighestRevenueFood(params.restaurantId);
  const highestBillAmount = await getHighestBillAmount(params.restaurantId);
  const avgOrderValue = (
    await getAverageOrderValue(params.restaurantId)
  ).toFixed(2);
  const mostPopularTable = await getMostPopularTable(params.restaurantId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-[430px]:px-2">
      <div className="flex flex-col">
        <Heading
          title="Restaurant Insights"
          description="Key performance metrics for your restaurant."
        />
      </div>
      <Separator />
      <div className="grid gap-4 grid-cols-3 !mt-8 max-[920px]:grid-cols-2 max-[590px]:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Highest Sold Food Item
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex flex-col mt-2">
              {mostOrderedFood ? (
                <React.Fragment>
                  <p>{mostOrderedFood?.menuItem?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mostOrderedFood?._sum?.quantity} orders
                  </p>
                </React.Fragment>
              ) : (
                <p className="text-red-600">No Data Available</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Highest Revenue Generating Item
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex flex-col mt-2">
              {highestRevenueFood ? (
                <React.Fragment>
                  <p>{highestRevenueFood?.menuItem?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {highestRevenueFood?._sum?.quantity} orders
                  </p>
                </React.Fragment>
              ) : (
                <p className="text-red-600">No Data Available</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Highest Bill Amount
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex flex-col mt-2">
              <p className="flex items-center">
                {highestBillAmount ? (
                  <React.Fragment>
                    <IndianRupee size={20} />
                    {highestBillAmount?.amount}
                  </React.Fragment>
                ) : (
                  <p className="text-red-600">No Data Available</p>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Average Order Value
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex flex-col mt-2">
              <p className="flex items-center">
                {parseInt(avgOrderValue) === 0 ? (
                  <p className="text-red-600">No Data Available</p>
                ) : (
                  <React.Fragment>
                    <IndianRupee size={20} />
                    {parseInt(avgOrderValue)}
                  </React.Fragment>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Most Popular Table
            </CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium flex flex-col mt-2">
              {mostPopularTable ? (
                <React.Fragment>
                  <p>{mostPopularTable?.table?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mostPopularTable?.count} bookings
                  </p>
                </React.Fragment>
              ) : (
                <p className="text-red-600">No Data Available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Suspense>
          <WeeklyOverview resId={params.restaurantId} />
        </Suspense>
      </div>
    </div>
  );
};

export default InsightsPage;
