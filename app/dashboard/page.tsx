"use client";

import { TriangleAlert } from "lucide-react";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { DashboardDateFilter } from "@/components/dashboard/dashboard-date-filter";
import { DashboardKPIs } from "@/components/dashboard/dashboard-kpis";
import { RevenueTrendChart } from "@/components/dashboard/revenue-trend-chart";
import { MonthlyComparisonChart } from "@/components/dashboard/monthly-comparison-chart";
import { TechRevenueDonut } from "@/components/dashboard/tech-revenue-donut";
import { ProfitSplitChart } from "@/components/dashboard/profit-split-chart";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
import { QueryStatePanel } from "@/components/misc/query-state-panel";

export default function DashboardPage() {
  const {
    isLoading,
    isError,
    errorMessage,
    metrics,
    dailyRevenue,
    monthlyBreakdown,
    techRevenue,
    profitSplit,
    recentJobs,
    techNameMap,
    techSummaries,
  } = useDashboardData();

  return (
    <div className="space-y-8">
      {/* Header + Date Filters */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Overview
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Financial dashboard with date filtering
          </p>
        </div>
        <DashboardDateFilter />
      </div>

      {/* Content, loading / error / data */}
      <QueryStatePanel
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        loadingMessage="Loading dashboard data..."
      >
        {/* KPI Cards */}
        <div className="space-y-8">
          <DashboardKPIs metrics={metrics} techCount={techSummaries.length} />

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RevenueTrendChart data={dailyRevenue} />
            <MonthlyComparisonChart data={monthlyBreakdown} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TechRevenueDonut data={techRevenue} />
            <ProfitSplitChart data={profitSplit} />
          </div>

          {/* Recent Jobs */}
          <RecentJobsTable jobs={recentJobs} techNameMap={techNameMap} />
        </div>
      </QueryStatePanel>
    </div>
  );
}
