import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  FileText,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMetrics } from "@/data/metrics";
import { jobs } from "@/data/jobs";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const kpis = [
  {
    label: "Daily Gross",
    value: fmt(dashboardMetrics.dailyGross),
    icon: DollarSign,
    sub: `${dashboardMetrics.dailyTrend[5].gross > dashboardMetrics.dailyTrend[6].gross ? "↓" : "↑"} vs yesterday`,
    up:
      dashboardMetrics.dailyTrend[6].gross >=
      dashboardMetrics.dailyTrend[5].gross,
  },
  {
    label: "Daily Net",
    value: fmt(dashboardMetrics.dailyNet),
    icon: TrendingUp,
    sub: "Business net after commissions",
    up: true,
  },
  {
    label: "Monthly Revenue",
    value: fmt(dashboardMetrics.monthlyRevenue),
    icon: TrendingDown,
    sub: "February 2026",
    up: true,
  },
  {
    label: "Year to Date",
    value: fmt(dashboardMetrics.yearToDate),
    icon: DollarSign,
    sub: "Jan 1 — today",
    up: true,
  },
  {
    label: "Total Jobs",
    value: dashboardMetrics.totalJobs.toString(),
    icon: Briefcase,
    sub: "All time logged jobs",
    up: true,
  },
  {
    label: "Active Technicians",
    value: dashboardMetrics.totalTechnicians.toString(),
    icon: Users,
    sub: "Currently active",
    up: true,
  },
  {
    label: "Pending Estimates",
    value: dashboardMetrics.pendingEstimates.toString(),
    icon: FileText,
    sub: "Awaiting response",
    up: false,
  },
];

const recentJobs = jobs.slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Financial snapshot for February 24, 2026
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* Recent Jobs */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Recent Jobs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {[
                  "Date",
                  "Address",
                  "Technician",
                  "Gross",
                  "Net",
                  "Payment",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job, i) => (
                <tr
                  key={job.id}
                  className={cn(
                    "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                    i !== recentJobs.length - 1 &&
                      "border-b border-zinc-100 dark:border-zinc-800",
                  )}
                >
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">
                    {job.date}
                  </td>
                  <td className="px-6 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                    {job.address}
                  </td>
                  <td className="px-6 py-3 text-zinc-600 dark:text-zinc-300">
                    {job.technicianName}
                  </td>
                  <td className="px-6 py-3 tabular-nums text-zinc-800 dark:text-zinc-200">
                    {fmt(job.gross)}
                  </td>
                  <td className="px-6 py-3 tabular-nums text-emerald-600 dark:text-emerald-400">
                    {fmt(job.net)}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {job.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
