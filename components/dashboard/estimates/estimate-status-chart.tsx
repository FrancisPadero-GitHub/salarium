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
import { estimateStatusData } from "@/data/chart-data";

const chartConfig = {
  follow_up: { label: "Follow Up", color: "oklch(0.795 0.184 86.047)" },
  approved: { label: "Approved", color: "oklch(0.765 0.177 163.223)" },
  denied: { label: "Denied", color: "oklch(0.637 0.237 25.331)" },
} satisfies ChartConfig;

const COLORS = [
  "var(--color-follow_up)",
  "var(--color-approved)",
  "var(--color-denied)",
];

export function EstimateStatusChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Estimate Pipeline
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Status distribution by count
        </p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto h-62.5 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} estimates`}
                nameKey="status"
              />
            }
          />
          <Pie
            data={estimateStatusData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
            nameKey="status"
            strokeWidth={2}
          >
            {estimateStatusData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
