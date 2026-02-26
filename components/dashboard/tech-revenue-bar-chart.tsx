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
import { useFetchJobFinancialBreakdown } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";
import type { JobFinancialBreakdownRow } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";

const chartConfig = {
  companyNet: {
    label: "Company Net",
    color: "var(--chart-4)",
  },
  techPay: {
    label: "Tech Pay",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface TechRevenueBarChartProps {
  initialData?: JobFinancialBreakdownRow[];
}

export function TechRevenueBarChart({ initialData }: TechRevenueBarChartProps) {
  const { data: jobs = [] } = useFetchJobFinancialBreakdown(initialData);

  const data = useMemo(() => {
    const techRevenueMap: Record<
      string,
      { companyNet: number; techPay: number }
    > = {};
    for (const j of jobs) {
      const name = j.technician_name ?? "Unknown";
      if (!techRevenueMap[name])
        techRevenueMap[name] = { companyNet: 0, techPay: 0 };
      techRevenueMap[name].companyNet += j.company_net ?? 0;
      techRevenueMap[name].techPay += j.commission ?? 0;
    }
    return Object.entries(techRevenueMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.companyNet + b.techPay - (a.companyNet + a.techPay));
  }, [jobs]);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Revenue Split by Technician
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Company net vs tech pay - YTD
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <BarChart data={data} margin={{ left: 12, right: 12 }}>
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
            dataKey="companyNet"
            stackId="a"
            fill="var(--color-companyNet)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="techPay"
            stackId="a"
            fill="var(--color-techPay)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
