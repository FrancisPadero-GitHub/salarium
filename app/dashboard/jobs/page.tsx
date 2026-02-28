"use client";

import { useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import {
  useFetchJobsV2,
  type JobsSummaryFilter,
} from "@/hooks/jobs/useFetchJobsV2";

import { TopCategoriesChart } from "@/components/dashboard/job-top-categories";
import { TechRevenueBarChart } from "@/components/dashboard/tech-revenue-bar-chart";
import { TopJobsChart } from "@/components/dashboard/top-jobs-chart";
import { LogJobDialog } from "@/components/dashboard/log-job-dialog";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { JobsErrorToast } from "@/components/toasts/jobs-error";
import { JobSummaryCards } from "@/components/dashboard/job-summary-cards";

export default function JobsPage() {
  const now = new Date();
  const [mode, setMode] = useState<JobsSummaryFilter["mode"]>("all");
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [isoWeek, setIsoWeek] = useState("");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filter = useMemo<JobsSummaryFilter>(() => {
    if (mode === "all") return { mode: "all" };
    if (mode === "year") return { mode, year: Number(year) };
    if (mode === "month")
      return { mode, year: Number(year), month: Number(month) };
    if (mode === "week") return { mode, isoWeek: isoWeek || undefined };
    if (mode === "day") return { mode, date: date || undefined };
    return {
      mode: "range",
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
  }, [mode, year, month, isoWeek, date, startDate, endDate]);

  const { isError: isJobsError, error: jobsError } = useFetchJobsV2(filter);
  const {
    data: summary,
    isError: jobSummaryError,
    error: jobSummaryErrorMessage,
  } = useFetchJobsV2(filter);

  const errorMessage =
    jobsError?.message ||
    jobSummaryErrorMessage?.message ||
    "Failed to fetch jobs";

  if (isJobsError || jobSummaryError) {
    return (
      <>
        <JobsErrorToast />
        <div className="rounded-lg border border-zinc-200 bg-red-100 p-3 text-center dark:border-zinc-800 dark:bg-red-900/20">
          <div className="flex items-center justify-center gap-2">
            <TriangleAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-md text-red-700 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Jobs
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {summary?.total_jobs ?? 0} jobs logged
          </p>
        </div>
        <LogJobDialog />
      </div>

      {/* Summary cards */}
      <JobSummaryCards
        filter={filter}
        onFilterChange={(newFilter) => {
          setMode(newFilter.mode ?? "all");
          if (newFilter.year !== undefined) setYear(String(newFilter.year));
          if (newFilter.month !== undefined) setMonth(String(newFilter.month));
          if (newFilter.isoWeek !== undefined)
            setIsoWeek(newFilter.isoWeek ?? "");
          if (newFilter.date !== undefined) setDate(newFilter.date ?? "");
          if (newFilter.startDate !== undefined)
            setStartDate(newFilter.startDate ?? "");
          if (newFilter.endDate !== undefined)
            setEndDate(newFilter.endDate ?? "");
        }}
      />

      <JobsTable />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopCategoriesChart />
        <TechRevenueBarChart />
      </div>

      <TopJobsChart />
    </div>
  );
}
