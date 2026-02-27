"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useFetchJobDetailed } from "@/hooks/jobs/useFetchJobs";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function TechRevenueDonut() {
  const { data: jobs = [] } = useFetchJobDetailed();

  const chartData = useMemo(() => {
    const techData: Record<string, number> = {};

    jobs.forEach((job) => {
      const tech = job.technician_name || "Unassigned";
      techData[tech] = (techData[tech] || 0) + (job.gross || 0);
    });

    return Object.entries(techData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [jobs]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, idx) => {
      config[item.name] = {
        label: item.name,
        color: COLORS[idx % COLORS.length],
      };
    });
    return config;
  }, [chartData]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Gross Revenue by Technician
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          YTD gross revenue share
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
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            strokeWidth={2}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
