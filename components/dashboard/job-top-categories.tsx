"use client";
import { Spinner } from "@/components/ui/spinner";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// hooks
import { useFetchJobFinancialBreakdown } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";

export function TopCategoriesChart() {
  const {
    data: jobsData,
    isError,
    isLoading,
  } = useFetchJobFinancialBreakdown();

  // ── Chart data ────────────────────────────────────────────────────────────
  const categoryCounts: Record<string, number> = {};
  for (const j of jobsData || []) {
    const c = j.category ?? "Uncategorized";
    categoryCounts[c] = (categoryCounts[c] ?? 0) + 1;
  }
  const categoryChartData = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const chartConfig = Object.fromEntries(
    categoryChartData.map((d, i) => [
      d.category,
      { label: d.category, color: PALETTE[i % PALETTE.length] },
    ]),
  ) satisfies ChartConfig;

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <div>Error loading technicians</div>;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Top Categories
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Distribution by job count
        </p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto h-62.5 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} jobs`}
                nameKey="category"
              />
            }
          />
          <Pie
            data={categoryChartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="count"
            nameKey="category"
            strokeWidth={2}
          >
            {categoryChartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PALETTE[index % PALETTE.length]}
              />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="category" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
