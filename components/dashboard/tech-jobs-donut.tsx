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
import { technicianBreakdown } from "@/data/chart-data";

const pieData = technicianBreakdown.map((t) => ({
  name: t.name,
  value: t.jobs,
}));

const chartConfig = {
  Yotam: { label: "Yotam", color: "var(--chart-1)" },
  Tamir: { label: "Tamir", color: "var(--chart-2)" },
  Shalom: { label: "Shalom", color: "var(--chart-3)" },
  Subs: { label: "Subs", color: "var(--chart-4)" },
} satisfies ChartConfig;

const COLORS = [
  "var(--color-Yotam)",
  "var(--color-Tamir)",
  "var(--color-Shalom)",
  "var(--color-Subs)",
];

export function TechJobsDonut() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Jobs Distribution
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Total jobs per technician — YTD
        </p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto h-70 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} jobs`}
                nameKey="name"
              />
            }
          />
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            strokeWidth={2}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
