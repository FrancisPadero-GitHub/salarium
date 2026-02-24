"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { topJobs } from "@/data/chart-data";

const chartConfig = {
  gross: {
    label: "Gross Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TopJobsChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Top Jobs by Revenue
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Highest grossing jobs — YTD
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-75 w-full">
        <BarChart
          data={topJobs}
          layout="vertical"
          margin={{ left: 0, right: 12 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="address"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={160}
            tick={{ fontSize: 11 }}
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                }
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? `${item.address} (${item.tech})` : "";
                }}
              />
            }
          />
          <Bar
            dataKey="gross"
            fill="var(--color-gross)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
