import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Orders } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { saveAs } from "file-saver";

const chartConfig = {
  total: {
    label: "Sales",
  },
  date: {
    label: "Date",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface SalesContentProps {
  loading: boolean;
  totalSales: number;
  averageDailySales: number;
  mostOrdered: { id: string; name: string; count: number };
  dateRange: DateRange;
  chartData: { key: string; createdAt: string; amount: number }[];
}

const SalesContent: React.FC<SalesContentProps> = ({
  loading,
  averageDailySales,
  totalSales,
  mostOrdered,
  dateRange,
  chartData,
}) => {
  const exportToCSV = () => {
    if (!chartData || chartData.length === 0) return;

    const header = ["Date", "Total Sales"];

    const rows = chartData.map((day) => [
      format(day.createdAt, "dd MMMM, yyyy"),
      `₹${day.amount.toFixed(2)}`,
    ]);

    const csvContent = [
      `Sales Report for ${format(dateRange.from!, "dd MMMM, yyyy")} - ${
        dateRange.to ? format(dateRange.to, "dd MMMM, yyyy") : "Present"
      }`,
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `Sales_Report_${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-6 w-2/5" />
              ) : !totalSales ? (
                <p>No data available</p>
              ) : (
                <p>₹{totalSales.toFixed(2)}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              For the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Daily Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-6 w-2/5" />
              ) : !averageDailySales ? (
                <p>No data available</p>
              ) : (
                <p>₹{averageDailySales.toFixed(2)}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Per day in the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Best Selling Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-6 w-2/5" />
              ) : mostOrdered ? (
                mostOrdered.name
              ) : (
                "No data available"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostOrdered ? mostOrdered.count : "No data available"} units sold
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Daily Sales</CardTitle>
          <CardDescription>
            Overview of sales for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="createdAt"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="amount"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="amount"
                  layout="vertical"
                  fill="var(--color-date)"
                ></Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p>No data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Sales Data</CardTitle>
          <CardDescription>
            Daily breakdown of sales for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell>
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                </TableRow>
              ) : chartData ? (
                chartData.map((day, key) => (
                  <TableRow key={day.key}>
                    <TableCell>
                      {format(day.createdAt, "dd MMMM, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{day.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={exportToCSV}>
            Export to CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SalesContent;
