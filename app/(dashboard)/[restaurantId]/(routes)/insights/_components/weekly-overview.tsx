"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MonthSelect from "@/components/month-select";
import axios from "axios";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface WeeklyOverviewProps {
  resId: string;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

type GraphData = {
  name: string;
  total: number;
};

const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ resId }) => {
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

  const [month, setMonth] = useState(new Date().getMonth().toString());
  const [data, setData] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const getData = async () => {
    setLoading(true);
    setProgress(25); // Start progress
    try {
      const response = await axios.get(
        `/api/${resId}/reports/weekly?month=${month}`
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } finally {
      setProgress(100); // Complete progress
      setTimeout(() => setLoading(false), 500); // Adding slight delay for effect
    }
  };

  useEffect(() => {
    getData();
  }, [month]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between max-[320px]:flex-col max-[320px]:gap-3">
          <CardTitle>Weekly Sales Overview</CardTitle>
          <MonthSelect month={month} setMonth={setMonth} />
        </div>
        <CardTitle className="text-lg font-normal text-muted-foreground">
          {getMonthName(parseInt(month))} Report
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <Progress value={progress} className="w-1/2" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            style={{ height: "350px", width: "100%" }}
          >
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="total"
                layout="vertical"
                fill="var(--color-desktop)"
                radius={4}
              >
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="total"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyOverview;
