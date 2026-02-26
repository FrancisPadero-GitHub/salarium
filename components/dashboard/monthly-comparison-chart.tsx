"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
  companyNet: {
    label: "Company Net",
    color: "var(--chart-2)",
  },
  parts: {
    label: "Parts Cost",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface MonthlyComparisonChartProps {
  initialJobs: JobDetailedRow[];
}

export function MonthlyComparisonChart({
  initialJobs,
}: MonthlyComparisonChartProps) {
  const { data: jobs = initialJobs } = useFetchJobDetailed(initialJobs);

  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Get current month and previous month
    const months = [
      { month: "January", index: 0 },
      { month: "February", index: 1 },
      { month: "March", index: 2 },
      { month: "April", index: 3 },
      { month: "May", index: 4 },
      { month: "June", index: 5 },
      { month: "July", index: 6 },
      { month: "August", index: 7 },
      { month: "September", index: 8 },
      { month: "October", index: 9 },
      { month: "November", index: 10 },
      { month: "December", index: 11 },
    ];

    const comparisonData: Record<
      string,
      { month: string; gross: number; companyNet: number; parts: number }
    > = {};

    // Include current and previous month
    const monthsToShow = [
      currentMonth > 0 ? currentMonth - 1 : 11,
      currentMonth,
    ];

    monthsToShow.forEach((monthIdx) => {
      const monthName = months[monthIdx].month;
      comparisonData[monthName] = {
        month: monthName,
        gross: 0,
        companyNet: 0,
        parts: 0,
      };
    });

    jobs.forEach((job) => {
      if (job.job_date) {
        const jobDate = new Date(job.job_date);
        const jobYear = jobDate.getFullYear();
        const jobMonth = jobDate.getMonth();

        if (jobYear === currentYear && monthsToShow.includes(jobMonth)) {
          const monthName = months[jobMonth].month;
          comparisonData[monthName].gross += job.gross || 0;
          comparisonData[monthName].companyNet += job.company_net || 0;
          comparisonData[monthName].parts += job.parts_total_cost || 0;
        }
      }
    });

    return monthsToShow.map((idx) => comparisonData[months[idx].month]);
  }, [jobs]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Monthly Comparison
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {new Date().getFullYear()} — Month over Month
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => v.slice(0, 3)}
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
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="companyNet"
            fill="var(--color-companyNet)"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="parts"
            fill="var(--color-parts)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
