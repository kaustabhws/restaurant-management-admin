import React, { lazy, Suspense } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getTopSellingItems } from "@/actions/statistics/get-bestselling-item";
import { getPopularDays } from "@/actions/statistics/get-popular-day";
import { getOrderType } from "@/actions/statistics/get-order-type";
import { getPreferredPayment } from "@/actions/statistics/get-preferred-payment";
const PieChartComponent = lazy(() => import("@/components/pie-chart"));
const DailySalesOverview = lazy(
  () => import("./_components/daily-sales-overview")
);

interface StatisticsPageProps {
  params: {
    restaurantId: string;
  };
}

const StatisticsPage: React.FC<StatisticsPageProps> = async ({ params }) => {
  const bestSellingItems = await getTopSellingItems(params.restaurantId);
  const mostPopularDay = await getPopularDays(params.restaurantId);
  const orderType = await getOrderType(params.restaurantId);
  const preferredPayment = await getPreferredPayment(params.restaurantId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3 max-[430px]:px-2">
      <div className="flex flex-col">
        <Heading
          title="Restaurant Statistics"
          description="Statistics for your restaurant"
        />
      </div>
      <Separator />
      <div className='flex-1 flex flex-col gap-3'>
        <div className="flex items-center gap-2 max-[780px]:flex-col">
          <Suspense>
            <DailySalesOverview resId={params.restaurantId} />
            <PieChartComponent
              title="Bestselling Items"
              description="Total Orders Sold"
              data={bestSellingItems}
            />
          </Suspense>
        </div>
        <div className='flex items-center gap-2 max-[780px]:flex-col'>
          <Suspense>
            <PieChartComponent
              title="Most Selling Days"
              description="Total Orders Sold"
              data={mostPopularDay}
            />
            <PieChartComponent
              title="Order Type"
              description="Dine in VS Takeaway"
              data={orderType}
            />
            <PieChartComponent
              title="Preferred Payment"
              description="Total Orders Sold"
              data={preferredPayment}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
