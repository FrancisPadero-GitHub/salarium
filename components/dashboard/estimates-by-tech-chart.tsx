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
import { estimatesByTech } from "@/data/chart-data";

const chartConfig = {
  value: {
    label: "Pipeline Value",
    color: "var(--chart-1)",
  },
  count: {
    label: "Estimate Count",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function EstimatesByTechChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Estimates by Technician
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Pipeline value per tech
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-62.5 w-full">
        <BarChart data={estimatesByTech} margin={{ left: 12, right: 12 }}>
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
                formatter={(value, name) =>
                  name === "value"
                    ? `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : `${value} estimates`
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
