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
import type { EstimatesRow } from "@/hooks/estimates/useFetchEstimates";

const chartConfig = {
  follow_up: { label: "Follow Up", color: "var(--primary)" },
  approved: { label: "Approved", color: "var(--success)" },
  denied: { label: "Denied", color: "var(--destructive)" },
} satisfies ChartConfig;

const COLORS = [
  "var(--primary)",
  "var(--success)",
  "var(--destructive)",
];

interface EstimateStatusChartProps {
  estimates: EstimatesRow[];
}

export function EstimateStatusChart({ estimates }: EstimateStatusChartProps) {
  const chartData = useMemo(
    () =>
      (["follow_up", "approved", "denied"] as const).map((status) => {
        const statusRows = estimates.filter(
          (estimate) => estimate.estimate_status === status,
        );

        return {
          status,
          count: statusRows.length,
          value: statusRows.reduce(
            (sum, row) => sum + Number(row.estimated_amount ?? 0),
            0,
          ),
        };
      }),
    [estimates],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Estimate Pipeline
        </h3>
        <p className="text-xs text-muted-foreground">
          Status distribution by count
        </p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto h-62.5 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} estimates`}
                nameKey="status"
              />
            }
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
            nameKey="status"
            strokeWidth={2}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
