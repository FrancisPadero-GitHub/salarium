"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { EstimateStatus } from "@/types/estimate";
import { EstimateStatusChart } from "@/components/dashboard/estimate-status-chart";
import { EstimatesByTechChart } from "@/components/dashboard/estimates-by-tech-chart";
import { NewEstimateDialog } from "@/components/dashboard/new-estimate-dialog";
import { LogJobDialog } from "@/components/dashboard/log-job-dialog";
import { useFetchEstimates } from "@/hooks/estimates/useFetchEstimates";
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians";
import { useJobStore } from "@/features/store/jobs/useFormJobStore";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const statusStyles: Record<EstimateStatus, string> = {
  follow_up:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  denied: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<EstimateStatus, string> = {
  follow_up: "Follow Up",
  approved: "Approved",
  denied: "Denied",
};

export default function EstimatesPage() {
  const {
    data: estimates = [],
    isLoading,
    isError,
    error,
  } = useFetchEstimates();
  const { data: technicians = [] } = useFetchTechnicians();
  const { openAddWithPrefill } = useJobStore();

  const technicianNameById = useMemo(
    () =>
      technicians.reduce<Record<string, string>>((acc, tech) => {
        acc[tech.id] = tech.name;
        return acc;
      }, {}),
    [technicians],
  );

  const counts = useMemo(
    () =>
      estimates.reduce(
        (acc, estimate) => {
          const status = estimate.estimate_status;
          if (!status) return acc;
          acc[status] = (acc[status] ?? 0) + 1;
          return acc;
        },
        {} as Record<EstimateStatus, number>,
      ),
    [estimates],
  );

  const totalValue = useMemo(
    () =>
      estimates.reduce(
        (sum, estimate) => sum + Number(estimate.estimated_amount ?? 0),
        0,
      ),
    [estimates],
  );

  const handlePromoteToJob = (estimate: (typeof estimates)[number]) => {
    if (!estimate.technician_id || !estimate.work_order_date) return;

    openAddWithPrefill({
      work_title: estimate.work_title ?? "Promoted Estimate",
      work_order_date: estimate.work_order_date,
      technician_id: estimate.technician_id,
      address: estimate.address ?? "",
      category: estimate.category ?? "",
      description: estimate.description ?? "",
      notes: estimate.handled_by ? `Handled by: ${estimate.handled_by}` : "",
      region: estimate.region ?? "",
      subtotal: Number(estimate.estimated_amount ?? 0),
      parts_total_cost: 0,
      payment_method_id: "",
      status: "pending",
      tip_amount: 0,
    });
  };

  return (
    <div className="space-y-6">
      <LogJobDialog showTrigger={false} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Estimates
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {estimates.length} estimates in pipeline
          </p>
        </div>
        <NewEstimateDialog />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Loading estimates...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
          {error?.message ?? "Failed to load estimates."}
        </div>
      ) : null}

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(["follow_up", "approved", "denied"] as EstimateStatus[]).map(
          (status) => {
            return (
              <div
                key={status}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusStyles[status],
                  )}
                >
                  {statusLabels[status]}
                </span>
                <p className="mt-3 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                  {counts[status] ?? 0}
                </p>
              </div>
            );
          },
        )}
      </div>

      {/* Pipeline value */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Total Pipeline Value
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
          {fmt(totalValue)}
        </p>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EstimateStatusChart />
        <EstimatesByTechChart />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {[
                  "Date",
                  "Work Title",
                  "Address",
                  "Technician",
                  "Description",
                  "Amount",
                  "Status",
                  "Handled By",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estimates.map((est, i) => (
                <tr
                  key={est.work_order_id ?? `${est.created_at}-${i}`}
                  className={cn(
                    "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                    i !== estimates.length - 1 &&
                      "border-b border-zinc-100 dark:border-zinc-800",
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {est.work_order_date ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                    {est.work_title ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                    {est.address ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {est.technician_id
                      ? (technicianNameById[est.technician_id] ??
                        est.technician_id)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {est.description ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                    {fmt(Number(est.estimated_amount ?? 0))}
                  </td>
                  <td className="px-4 py-3">
                    {est.estimate_status ? (
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusStyles[est.estimate_status],
                        )}
                      >
                        {statusLabels[est.estimate_status]}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {est.handled_by ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handlePromoteToJob(est)}
                      disabled={!est.technician_id || !est.work_order_date}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        est.technician_id && est.work_order_date
                          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500",
                      )}
                    >
                      Promote to Job
                    </button>
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
