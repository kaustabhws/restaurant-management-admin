"use client";

import { useEffect, useState, useMemo } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Heading } from "@/components/ui/heading";
import SalesContent from "./components/sales-content";
import axios from "axios";
import { Orders } from "@prisma/client";

const SalesReportPage = ({ params }: { params: { restaurantId: string } }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<Orders[]>([]);
  const [mostOrdered, setMostOrdered] = useState({
    id: "",
    name: "",
    count: 0,
  });

  const getReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/${params.restaurantId}/sales-report?from=${date?.from}&to=${date?.to}`
      );
      setSalesData(res.data.salesData);
      setMostOrdered(res.data.mostOrderedItem);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate sales data by date
  const consolidatedSalesData = useMemo(() => {
    if (!salesData || salesData.length === 0) {
      return [];
    }

    const grouped = salesData.reduce((acc, order) => {
      const dateKey = format(new Date(order.createdAt), "yyyy-MM-dd");

      if (!acc[dateKey]) {
        acc[dateKey] = {
          key: `${dateKey}-${order.id}`,
          createdAt: dateKey,
          amount: 0,
        };
      }

      acc[dateKey].amount += order.amount;

      return acc;
    }, {} as Record<string, { key: string; createdAt: string; amount: number }>);

    return Object.values(grouped);
  }, [salesData]);

  const totalSales = consolidatedSalesData.reduce(
    (sum, day) => sum + day.amount,
    0
  );
  const averageDailySales = consolidatedSalesData.length
    ? totalSales / consolidatedSalesData.length
    : 0;

  useEffect(() => {
    getReport();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <Heading
          title="Sales Report"
          description="Sales report for selected range"
        />
        <div className="flex items-center space-x-2 mb-6 max-[460px]:flex-col max-[460px]:items-start max-[460px]:gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal max-[460px]:w-full",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={getReport}>Generate Report</Button>
        </div>
        <SalesContent
          restaurantId={params.restaurantId}
          loading={loading}
          averageDailySales={averageDailySales}
          chartData={consolidatedSalesData}
          totalSales={totalSales}
          mostOrdered={mostOrdered}
          dateRange={date ?? { from: new Date(), to: new Date() }}
        />
      </div>
    </div>
  );
};

export default SalesReportPage;
