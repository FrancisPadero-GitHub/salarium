"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { paymentMethodDistribution } from "@/data/chart-data";

const chartConfig = {
  "Credit Card": { label: "Credit Card", color: "var(--chart-1)" },
  Cash: { label: "Cash", color: "var(--chart-2)" },
  Zelle: { label: "Zelle", color: "var(--chart-4)" },
  Check: { label: "Check", color: "var(--chart-3)" },
} satisfies ChartConfig;

const COLORS = [
  "var(--color-Credit Card)",
  "var(--color-Cash)",
  "var(--color-Zelle)",
  "var(--color-Check)",
];

export function PaymentMethodChart() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Payment Methods
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Distribution by transaction count
        </p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto h-62.5 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} jobs`}
                nameKey="method"
              />
            }
          />
          <Pie
            data={paymentMethodDistribution}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="count"
            nameKey="method"
            strokeWidth={2}
          >
            {paymentMethodDistribution.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="method" />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
