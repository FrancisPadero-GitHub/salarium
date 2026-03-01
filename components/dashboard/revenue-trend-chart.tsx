"use client";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DailyRevenue } from "@/hooks/dashboard/useDashboardData";

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

interface RevenueTrendChartProps {
  data: DailyRevenue[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Daily Revenue Trend
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Gross vs Company Net per day
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex h-70 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
          No data for this period
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.split(" ")[1] ?? v}
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
            <Area
              type="monotone"
              dataKey="gross"
              stroke="var(--color-gross)"
              fill="var(--color-gross)"
              fillOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke="var(--color-net)"
              fill="var(--color-net)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
