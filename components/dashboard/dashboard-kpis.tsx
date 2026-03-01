"use client";

import {
  TrendingUp,
  Briefcase,
  Users,
  FileText,
  DollarSign,
  Percent,
  Wrench,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtUSD } from "@/lib/decimal";
import type { DashboardMetrics } from "@/hooks/dashboard/useDashboardData";

interface DashboardKPIsProps {
  metrics: DashboardMetrics;
  techCount: number;
}

export function DashboardKPIs({ metrics, techCount }: DashboardKPIsProps) {
  const kpis = [
    {
      label: "Gross Revenue",
      value: fmtUSD(metrics.grossRevenue),
      icon: DollarSign,
      sub: `From ${metrics.doneJobs} completed jobs`,
      up: true,
    },
    {
      label: "Company Net",
      value: fmtUSD(metrics.companyNet),
      icon: TrendingUp,
      sub: "After tech payouts & parts",
      up: true,
    },
    {
      label: "Net Revenue",
      value: fmtUSD(metrics.netRevenue),
      icon: Banknote,
      sub: "Gross minus parts cost",
      up: true,
    },
    {
      label: "Net Margin",
      value: `${metrics.companyNetMarginPct}%`,
      icon: Percent,
      sub: "Company net / gross",
      up: metrics.companyNetMarginPct > 0,
    },
    {
      label: "Total Jobs",
      value: metrics.totalJobs.toString(),
      icon: Briefcase,
      sub: `${metrics.doneJobs} done · ${metrics.pendingJobs} pending`,
      up: true,
    },
    {
      label: "Avg Revenue / Job",
      value: fmtUSD(metrics.avgRevenuePerJob),
      icon: DollarSign,
      sub: `Based on ${metrics.doneJobs} done jobs`,
      up: true,
    },
    {
      label: "Parts Cost",
      value: fmtUSD(metrics.partsCost),
      icon: Wrench,
      sub: "Total parts expense",
      up: false,
    },
    {
      label: "Active Technicians",
      value: techCount.toString(),
      icon: Users,
      sub: "Currently active",
      up: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map(({ label, value, icon: Icon, sub, up }) => (
        <div
          key={label}
          className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {label}
            </p>
            <div className="rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-800">
              <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
          <p
            className={cn(
              "mt-1 text-xs",
              up
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400",
            )}
          >
            {sub}
          </p>
        </div>
      ))}
    </div>
  );
}
