import { TriangleAlert } from "lucide-react";
import {
  fetchJobDetailed,
  type JobDetailedRow,
} from "@/hooks/jobs/useFetchJobs";
import { TopCategoriesChart } from "@/components/dashboard/job-top-categories";
import { TechRevenueBarChart } from "@/components/dashboard/tech-revenue-bar-chart";
import { TopJobsChart } from "@/components/dashboard/top-jobs-chart";
import { LogJobDialog } from "@/components/dashboard/log-job-dialog";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { JobsErrorToast } from "@/components/toasts/jobs-error";
import { JobSummaryCards } from "@/components/dashboard/job-summary-cards";

export default async function JobsPage() {
  let jobs: JobDetailedRow[] = [];
  let error = null;

  try {
    jobs = await fetchJobDetailed();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch jobs";
    console.error("Error fetching job financial breakdown:", error);
  }

  if (error) {
    return (
      <>
        <JobsErrorToast />
        <div className="rounded-lg border border-zinc-200 bg-red-100 p-3 text-center dark:border-zinc-800 dark:bg-red-900/20">
          <div className="flex items-center justify-center gap-2">
            <TriangleAlert className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-md text-red-700 dark:text-red-400">
              Failed to load data
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
            {jobs.length} jobs logged
          </p>
        </div>
        <LogJobDialog />
      </div>

      {/* Summary cards */}
      <JobSummaryCards initialData={jobs} />

      <JobsTable initialJobs={jobs} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopCategoriesChart />
        <TechRevenueBarChart initialData={jobs} />
      </div>

      <TopJobsChart initialData={jobs} />
    </div>
  );
}
