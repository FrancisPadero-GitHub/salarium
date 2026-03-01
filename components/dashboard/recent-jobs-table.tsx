"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useFetchJobDetailed } from "@/hooks/jobs/useFetchJobs";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const paymentColors: Record<string, string> = {
  cash: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  check: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "credit card":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  zelle: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function RecentJobsTable() {
  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
  } = useFetchJobDetailed();
  const {
    data: techSummaries = [],
    isLoading: isTechLoading,
    isError: isTechError,
    error: techError,
  } = useFetchTechSummary();

  const isLoading = isJobsLoading || isTechLoading;
  const isError = isJobsError || isTechError;
  const errorMessage = jobsError?.message || techError?.message;

  const techNameMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of techSummaries)
      if (t.technician_id && t.name) m.set(t.technician_id, t.name);
    return m;
  }, [techSummaries]);

  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort(
        (a, b) =>
          new Date(b.work_order_date || "").getTime() -
          new Date(a.work_order_date || "").getTime(),
      )
      .slice(0, 5);
  }, [jobs]);

  return (
    <QueryStatePanel
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      loadingMessage="Loading recent jobs..."
    >
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Recent Jobs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Last 5 completed jobs
          </p>
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
                  "Company Net",
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
              {recentJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-zinc-400 dark:text-zinc-500"
                  >
                    No jobs found
                  </td>
                </tr>
              ) : (
                recentJobs.map((job, i) => (
                  <tr
                    key={job.work_order_id}
                    className={cn(
                      "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                      i !== recentJobs.length - 1 &&
                        "border-b border-zinc-100 dark:border-zinc-800",
                    )}
                  >
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">
                      {job.work_order_date
                        ? new Date(job.work_order_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "—"}
                    </td>
                    <td className="px-6 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                      {job.address || "—"}
                    </td>
                    <td className="px-6 py-3 text-zinc-600 dark:text-zinc-300">
                      {job.technician_id
                        ? (techNameMap.get(job.technician_id) ?? "—")
                        : "—"}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-zinc-800 dark:text-zinc-200">
                      {fmt(job.subtotal || 0)}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-emerald-600 dark:text-emerald-400">
                      {fmt(job.total_company_net || 0)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                          paymentColors[job.payment_method || ""] ||
                            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                        )}
                      >
                        {job.payment_method || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </QueryStatePanel>
  );
}
