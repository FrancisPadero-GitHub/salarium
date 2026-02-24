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
import { revenueSplit } from "@/data/chart-data";

const chartConfig = {
  "Company Net": { label: "Company Net", color: "var(--chart-2)" },
  "Tech Pay": { label: "Tech Pay", color: "var(--chart-1)" },
} satisfies ChartConfig;

const COLORS = ["var(--color-Company Net)", "var(--color-Tech Pay)"];

export function ProfitSplitChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Revenue Split
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Company vs Technician — YTD
        </p>
      </div>
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
            data={revenueSplit}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            strokeWidth={2}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {revenueSplit.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
