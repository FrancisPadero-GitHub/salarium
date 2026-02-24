"use client";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { dailyRevenueTrend } from "@/data/chart-data";

const chartConfig = {
  gross: {
    label: "Gross Revenue",
    color: "var(--chart-1)",
  },
  net: {
    label: "Company Net",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RevenueTrendChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Daily Revenue Trend
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          February 2026 — Gross vs Company Net
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <AreaChart data={dailyRevenueTrend} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => v.replace("Feb ", "")}
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
          <defs>
            <linearGradient id="fillGross" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-gross)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-gross)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-net)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-net)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="net"
            type="natural"
            fill="url(#fillNet)"
            stroke="var(--color-net)"
            strokeWidth={2}
            stackId="a"
          />
          <Area
            dataKey="gross"
            type="natural"
            fill="url(#fillGross)"
            stroke="var(--color-gross)"
            strokeWidth={2}
            stackId="b"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
