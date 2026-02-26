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
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import type { JobDetailedRow } from "@/hooks/jobs/useFetchJobs";
import type { TechnicianSummaryRow } from "@/hooks/technicians/useFetchTechSummary";

const chartConfig = {
  "Company Net": { label: "Company Net", color: "var(--chart-1)" },
  "Tech Pay": { label: "Tech Pay", color: "var(--chart-2)" },
} satisfies ChartConfig;

const COLORS = ["var(--chart-1)", "var(--chart-2)"];

interface ProfitSplitChartProps {
  initialJobs: JobDetailedRow[];
  initialTechnicians: TechnicianSummaryRow[];
}

export function ProfitSplitChart({
  initialJobs,
  initialTechnicians,
}: ProfitSplitChartProps) {
  const { data: jobs = initialJobs } = useFetchJobDetailed(initialJobs);
  const { data: technicians = initialTechnicians } =
    useFetchTechSummary(initialTechnicians);

  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();

    // Calculate YTD totals from jobs
    const ytdJobs = jobs.filter((j) => {
      const jobDate = new Date(j.job_date || "");
      return jobDate.getFullYear() === currentYear;
    });

    const totalCompanyNet = ytdJobs.reduce(
      (sum, j) => sum + (j.company_net || 0),
      0,
    );

    // Calculate total commissions (tech pay) from jobs
    const totalTechPay = ytdJobs.reduce((sum, j) => {
      const netRevenue = (j.gross || 0) - (j.parts_total_cost || 0);
      const commissionRate =
        technicians.find((t) => t.technician_id === j.technician_id)
          ?.commission_rate || 0;
      return sum + netRevenue * (commissionRate / 100);
    }, 0);

    return [
      { name: "Company Net", value: Math.max(0, totalCompanyNet) },
      { name: "Tech Pay", value: Math.max(0, totalTechPay) },
    ];
  }, [jobs, technicians]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Revenue Split
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Company vs Technician - YTD
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
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            strokeWidth={2}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
