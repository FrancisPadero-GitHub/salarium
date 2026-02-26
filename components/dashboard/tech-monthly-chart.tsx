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
import {
  useFetchTechMonthlySummary,
  type TechnicianMonthlySummaryRow,
} from "@/hooks/technicians/useFetchTechMonthlySummary";
import { Spinner } from "@/components/ui/spinner";

interface TechMonthlyChartProps {
  initialMonthlySummary?: TechnicianMonthlySummaryRow[];
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function TechMonthlyChart({
  initialMonthlySummary,
}: TechMonthlyChartProps) {
  const {
    data: monthlyData,
    isLoading,
    isError,
  } = useFetchTechMonthlySummary(initialMonthlySummary);

  console.log("Monthly Summary Data:", monthlyData);

  // Extract unique months and generate dynamic config
  const { months, chartConfig } = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) {
      return { months: [], chartConfig: {} as ChartConfig };
    }

    // Get unique year-months and sort them (filter out nulls)
    const uniqueMonths = Array.from(
      new Set(
        monthlyData
          .map((row) => row.year_month)
          .filter((ym): ym is string => ym !== null && ym !== undefined),
      ),
    ).sort();

    // Generate chart config dynamically
    const config: ChartConfig = {};
    uniqueMonths.forEach((yearMonth, index) => {
      // Parse year-month (e.g., "2026-02" -> "February 2026")
      const [year, month] = yearMonth.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1,
      ).toLocaleDateString("en-US", { month: "long" });

      config[yearMonth] = {
        label: `${monthName} ${year}`,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return { months: uniqueMonths, chartConfig: config };
  }, [monthlyData]);

  const chartData = useMemo(() => {
    if (!monthlyData || months.length === 0) return [];

    // Group by technician name, pivot months into columns
    const grouped = monthlyData.reduce(
      (acc, row) => {
        const name = row.name || "Unknown";
        const yearMonth = row.year_month;

        if (!acc[name]) {
          acc[name] = { name } as Record<string, string | number>;
          // Initialize all months to 0
          months.forEach((m) => {
            acc[name][m] = 0;
          });
        }

        if (yearMonth && months.includes(yearMonth)) {
          acc[name][yearMonth] = row.total_gross || 0;
        }

        return acc;
      },
      {} as Record<string, Record<string, string | number>>,
    );

    return Object.values(grouped);
  }, [monthlyData, months]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load chart data
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Monthly Gross by Technician
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {months.length > 0
            ? `${months.map((m) => chartConfig[m]?.label).join(" vs ")}`
            : "No data available"}
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-75 w-full">
        <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
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
          {months.map((month, index) => (
            <Bar
              key={month}
              dataKey={month}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
