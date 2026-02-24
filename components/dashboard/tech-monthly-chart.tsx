"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { techMonthlyComparison } from "@/data/chart-data";

const chartConfig = {
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TechMonthlyChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Monthly Gross by Technician
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          January vs February 2026
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-75 w-full">
        <BarChart data={techMonthlyComparison} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="january"
            fill="var(--color-january)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="february"
            fill="var(--color-february)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
