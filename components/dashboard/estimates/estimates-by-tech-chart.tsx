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
import type { EstimatesRow } from "@/hooks/estimates/useFetchEstimates";

const chartConfig = {
  value: {
    label: "Pipeline Value",
    color: "var(--chart-1)",
  },
  count: {
    label: "Estimate Count",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface EstimatesByTechChartProps {
  estimates: EstimatesRow[];
  technicianNameById: Record<string, string>;
}

export function EstimatesByTechChart({
  estimates,
  technicianNameById,
}: EstimatesByTechChartProps) {
  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      { name: string; count: number; value: number }
    >();

    for (const estimate of estimates) {
      const technicianId = estimate.technician_id;
      if (!technicianId) continue;

      const name = technicianNameById[technicianId] ?? technicianId;
      const existing = grouped.get(technicianId) ?? {
        name,
        count: 0,
        value: 0,
      };

      existing.count += 1;
      existing.value += Number(estimate.estimated_amount ?? 0);

      grouped.set(technicianId, existing);
    }

    return Array.from(grouped.values()).sort((a, b) => b.value - a.value);
  }, [estimates, technicianNameById]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Estimates by Technician
        </h3>
        <p className="text-xs text-muted-foreground">
          Pipeline value per tech
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-62.5 w-full">
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
                formatter={(value, name) =>
                  name === "value"
                    ? `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : `${value} estimates`
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
