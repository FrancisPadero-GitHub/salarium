"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  Briefcase,
  Users,
  FileText,
  DollarSign,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchJobDetailed } from "@/hooks/jobs/useFetchJobs";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import { useFetchJobMonthlyFinancialSummary } from "@/hooks/jobs/useFetchJobMonthlyFinancialSummary";
import type { JobDetailedRow } from "@/hooks/jobs/useFetchJobs";
import type { TechnicianSummaryRow } from "@/hooks/technicians/useFetchTechSummary";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

interface DashboardKPIsProps {
  initialJobs: JobDetailedRow[];
  initialTechnicians: TechnicianSummaryRow[];
}

export function DashboardKPIs({
  initialJobs,
  initialTechnicians,
}: DashboardKPIsProps) {
  const { data: jobs = initialJobs } = useFetchJobDetailed(initialJobs);
  const { data: technicians = initialTechnicians } =
    useFetchTechSummary(initialTechnicians);
  const { data: monthlySummaries = [] } = useFetchJobMonthlyFinancialSummary();

  const metrics = useMemo(() => {
    if (jobs.length === 0)
      return {
        totalGross: 0,
        companyNet: 0,
        totalJobs: 0,
        avgRevenuePerJob: 0,
        companyNetMargin: 0,
        monthlyRevenue: 0,
        pendingJobs: 0,
      };

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // YTD calculations
    const ytdJobs = jobs.filter((j) => {
      const jobDate = new Date(j.job_date || "");
      return jobDate.getFullYear() === currentYear;
    });

    const totalGross = ytdJobs.reduce((sum, j) => sum + (j.gross || 0), 0);
    const companyNet = ytdJobs.reduce(
      (sum, j) => sum + (j.company_net || 0),
      0,
    );
    const totalJobs = ytdJobs.length;
    const avgRevenuePerJob = totalJobs > 0 ? totalGross / totalJobs : 0;
    const companyNetMargin =
      totalGross > 0 ? ((companyNet / totalGross) * 100).toFixed(1) : "0.0";

    // Current month calculations from the view
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthPeriod = currentMonthStart.toISOString().split("T")[0];

    const monthlyData = monthlySummaries.find((m) =>
      m.period?.startsWith(currentMonthPeriod.substring(0, 7)),
    );
    const monthlyRevenue = monthlyData?.gross_total || 0;

    // Pending jobs
    const pendingJobs = jobs.filter(
      (j) => j.status?.toLowerCase() === "pending",
    ).length;

    return {
      totalGross,
      companyNet,
      totalJobs,
      avgRevenuePerJob,
      companyNetMargin,
      monthlyRevenue,
      pendingJobs,
    };
  }, [jobs, monthlySummaries]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const kpis = [
    {
      label: "YTD Gross Revenue",
      value: fmt(metrics.totalGross),
      icon: DollarSign,
      sub: `Jan 1 — ${currentDate}`,
      up: true,
    },
    {
      label: "Company Net",
      value: fmt(metrics.companyNet),
      icon: TrendingUp,
      sub: "After tech payouts & parts",
      up: true,
    },
    {
      label: "Monthly Gross",
      value: fmt(metrics.monthlyRevenue),
      icon: TrendingUp,
      sub: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      up: true,
    },
    {
      label: "Net Margin",
      value: `${metrics.companyNetMargin}%`,
      icon: Percent,
      sub: "Company net / gross",
      up: true,
    },
    {
      label: "Total Jobs",
      value: metrics.totalJobs.toString(),
      icon: Briefcase,
      sub: "YTD across all techs",
      up: true,
    },
    {
      label: "Avg Revenue / Job",
      value: fmt(metrics.avgRevenuePerJob),
      icon: DollarSign,
      sub: `Based on ${metrics.totalJobs} jobs`,
      up: true,
    },
    {
      label: "Active Technicians",
      value: technicians.length.toString(),
      icon: Users,
      sub: "Currently active",
      up: true,
    },
    {
      label: "Pending Jobs",
      value: metrics.pendingJobs.toString(),
      icon: FileText,
      sub: "Awaiting completion",
      up: false,
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
