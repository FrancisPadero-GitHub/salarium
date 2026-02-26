"use client";

import { DollarSign, TrendingUp, Briefcase } from "lucide-react";
import { useFetchJobFinancialBreakdown } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";
import type { JobFinancialBreakdownRow } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

interface JobSummaryCardsProps {
  initialData?: JobFinancialBreakdownRow[];
}

export function JobSummaryCards({ initialData }: JobSummaryCardsProps) {
  const { data: jobs = [] } = useFetchJobFinancialBreakdown(initialData);

  // Calculate totals
  const totalGross = jobs.reduce((s, j) => s + (j.gross ?? 0), 0);
  const totalCommission = jobs.reduce((s, j) => s + (j.commission ?? 0), 0);
  const totalCompanyNet = jobs.reduce((s, j) => s + (j.company_net ?? 0), 0);

  const summaryCards = [
    {
      label: "Total Gross",
      value: fmt(totalGross),
      Icon: DollarSign,
      color: "text-zinc-900 dark:text-zinc-50",
    },
    {
      label: "Total Commission",
      value: fmt(totalCommission),
      Icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Company Net",
      value: fmt(totalCompanyNet),
      Icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {summaryCards.map(({ label, value, Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {label}
            </p>
          </div>
          <p className={`mt-1 text-xl font-bold tabular-nums ${color}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
