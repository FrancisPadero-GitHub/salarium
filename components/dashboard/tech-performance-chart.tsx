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
import { technicianBreakdown } from "@/data/chart-data";

const chartConfig = {
  gross: {
    label: "Gross Revenue",
    color: "var(--chart-1)",
  },
  companyNet: {
    label: "Company Net",
    color: "var(--chart-2)",
  },
  parts: {
    label: "Parts",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TechPerformanceChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Technician Performance
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Gross, company net, and parts — YTD
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-75 w-full">
        <BarChart data={technicianBreakdown} margin={{ left: 12, right: 12 }}>
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
            dataKey="gross"
            fill="var(--color-gross)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="companyNet"
            fill="var(--color-companyNet)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="parts"
            fill="var(--color-parts)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
