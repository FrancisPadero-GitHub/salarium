"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface TopCategoriesChartProps {
  data: { category: string; count: number }[];
}

export function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const chartConfig = Object.fromEntries(
    data.map((d, i) => [
      d.category,
      { label: d.category, color: PALETTE[i % PALETTE.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Top Categories
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Distribution by job count
        </p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto h-62.5 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} jobs`}
                nameKey="category"
              />
            }
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="count"
            nameKey="category"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PALETTE[index % PALETTE.length]}
              />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="category" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
