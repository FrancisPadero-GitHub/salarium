"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TechRevenue } from "@/hooks/dashboard/useDashboardData";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface TechRevenueDonutProps {
  data: TechRevenue[];
}

export function TechRevenueDonut({ data }: TechRevenueDonutProps) {
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((item, idx) => {
      config[item.name] = {
        label: item.name,
        color: COLORS[idx % COLORS.length],
      };
    });
    return config;
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Gross Revenue by Technician
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Revenue share for selected period
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex h-70 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
          No data for this period
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto h-70 w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  }
                  nameKey="name"
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              strokeWidth={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}
