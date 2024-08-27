"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import MonthSelect from "@/components/month-select";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

interface DailySalesOverviewProps {
  resId: string;
}

type GraphData = {
  date: string;
  total: number;
};

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const DailySalesOverview: React.FC<DailySalesOverviewProps> = ({ resId }) => {
  const getMonthName = (monthIndex: number): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  };

  const [month, setMonth] = React.useState(new Date().getMonth().toString());
  const [data, setData] = React.useState<GraphData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const getData = async () => {
    setLoading(true);
    setProgress(25); // Start progress
    try {
      const response = await axios.get(
        `/api/${resId}/reports/daily?month=${month}`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } finally {
      setProgress(100); // Complete progress
      setTimeout(() => setLoading(false), 500); // Adding slight delay for effect
    }
  };

  React.useEffect(() => {
    getData();
  }, [month]);

  return (
    <Card className='flex-1 max-[780px]:w-full'>
      <CardHeader>
        <div className="flex items-center justify-between max-[320px]:flex-col max-[320px]:gap-3">
          <CardTitle>Daily Sales Overview</CardTitle>
          <MonthSelect month={month} setMonth={setMonth} />
        </div>
        <CardTitle className="text-lg font-normal text-muted-foreground">
          {getMonthName(parseInt(month))} Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Progress value={progress} className="w-1/2" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
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
                    nameKey="views"
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
                dataKey="total"
                layout="vertical"
                fill="var(--color-desktop)"
              ></Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySalesOverview;
