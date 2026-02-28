"use client";

import { TriangleAlert } from "lucide-react";
import { useFetchJobsV2 } from "@/hooks/jobs/useFetchJobsV2";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import { RevenueTrendChart } from "@/components/dashboard/revenue-trend-chart";
import { MonthlyComparisonChart } from "@/components/dashboard/monthly-comparison-chart";
import { TechRevenueDonut } from "@/components/dashboard/tech-revenue-donut";
import { ProfitSplitChart } from "@/components/dashboard/profit-split-chart";
import { DashboardKPIs } from "@/components/dashboard/dashboard-kpis";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";

export default function DashboardPage() {
  const { isError: isJobsError, error: jobsError } = useFetchJobsV2();
  const { isError: isTechniciansError, error: techniciansError } =
    useFetchTechSummary();

  const errorMessage =
    jobsError?.message ||
    techniciansError?.message ||
    "Failed to fetch dashboard data";

  if (isJobsError || isTechniciansError) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-red-100 p-3 text-center dark:border-zinc-800 dark:bg-red-900/20">
        <div className="flex items-center justify-center gap-2">
          <TriangleAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
          <p className="text-md text-red-700 dark:text-red-400">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Financial snapshot for {currentDate}
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardKPIs />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueTrendChart />
        <MonthlyComparisonChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TechRevenueDonut />
        <ProfitSplitChart />
      </div>

      {/* Recent Jobs */}
      <RecentJobsTable />
    </div>
  );
}
