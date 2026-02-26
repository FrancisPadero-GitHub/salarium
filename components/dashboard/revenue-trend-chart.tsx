"use client";

import { useMemo } from "react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useFetchJobDetailed } from "@/hooks/jobs/useFetchJobs";
import type { JobDetailedRow } from "@/hooks/jobs/useFetchJobs";

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
  initialJobs: JobDetailedRow[];
}

export function RevenueTrendChart({ initialJobs }: RevenueTrendChartProps) {
  const { data: jobs = initialJobs } = useFetchJobDetailed(initialJobs);

  const chartData = useMemo(() => {
    const dailyData: Record<
      string,
      { date: string; gross: number; net: number }
    > = {};

    jobs.forEach((job) => {
      if (job.job_date) {
        const date = new Date(job.job_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (!dailyData[date]) {
          dailyData[date] = { date, gross: 0, net: 0 };
        }
        dailyData[date].gross += job.gross || 0;
        dailyData[date].net += job.company_net || 0;
      }
    });

    return Object.values(dailyData)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-30); // Last 30 days
  }, [jobs]);

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Daily Revenue Trend
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {currentMonth} — Gross vs Company Net
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => v.split(" ")[1]}
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
    </div>
  );
}
