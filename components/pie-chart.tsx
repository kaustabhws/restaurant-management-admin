"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BestsellingItemsProps {
  data: any[];
  title: string;
  description: string;
}

// Function to generate a color based on index
const generateColor = (index: number) => {
  const hue = (index * 137.5) % 360; // Use golden angle approximation for distribution
  return `hsl(${hue}, 70%, 50%)`;
};

const PieChartComponent: React.FC<BestsellingItemsProps> = ({ data, description, title }) => {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: generateColor(index),
    }));
  }, [data]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      totalQuantitySold: { label: "Sold" },
    };
    chartData.forEach((item) => {
      config[item.itemName] = {
        label: item.itemName,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex-1 max-[780px]:w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent nameKey="totalQuantitySold" hideLabel />
              }
            />
            <Pie
              data={chartData}
              dataKey="totalQuantitySold"
              nameKey="itemName"
              labelLine={false}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="itemName" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PieChartComponent;
