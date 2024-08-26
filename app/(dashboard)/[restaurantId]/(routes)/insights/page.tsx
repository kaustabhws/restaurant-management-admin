import { getWeeklyRevenue } from "@/actions/get-weekly-graph-revenue";
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
import WeeklyOverview from "@/components/weekly-overview";
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

  const graphRevenue = await getWeeklyRevenue(
    params.restaurantId,
    new Date().getMonth()
  );

  const getMonthName = (monthIndex: number): string => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };

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
              <p>{mostOrderedFood?.menuItem?.name}</p>
              <p className="text-sm text-muted-foreground">
                {mostOrderedFood?._sum?.quantity} orders
              </p>
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
              <p>{highestRevenueFood?.menuItem?.name}</p>
              <p className="text-sm text-muted-foreground">
                {highestRevenueFood?._sum?.quantity} orders
              </p>
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
                <IndianRupee size={20} />
                {highestBillAmount?.amount}
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
                <IndianRupee size={20} />
                {avgOrderValue}
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
              <p>{mostPopularTable?.table?.name}</p>
              <p className="text-sm text-muted-foreground">
                {mostPopularTable?.count} bookings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Sales Overview</CardTitle>
            <CardTitle className='text-lg font-normal text-muted-foreground'>{getMonthName(new Date().getMonth())} Report</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <WeeklyOverview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsPage;
