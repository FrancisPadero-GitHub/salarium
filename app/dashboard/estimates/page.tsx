import { cn } from "@/lib/utils";
import { estimates } from "@/data/estimates";
import type { EstimateStatus } from "@/types/estimate";
import { EstimateStatusChart } from "@/components/dashboard/estimate-status-chart";
import { EstimatesByTechChart } from "@/components/dashboard/estimates-by-tech-chart";
import { NewEstimateDialog } from "@/components/dashboard/new-estimate-dialog";

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

const counts = estimates.reduce(
  (acc, e) => ({ ...acc, [e.status]: (acc[e.status] ?? 0) + 1 }),
  {} as Record<EstimateStatus, number>,
);

const totalValue = estimates.reduce((s, e) => s + e.estimatedAmount, 0);

export default function EstimatesPage() {
  return (
    <div className="space-y-6">
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

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(["follow_up", "approved", "denied"] as EstimateStatus[]).map(
          (status) => {
            const labels: Record<EstimateStatus, string> = {
              follow_up: "Follow Up",
              approved: "Approved",
              denied: "Denied",
            };
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
                  {labels[status]}
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
                  "Address",
                  "Technician",
                  "Description",
                  "Amount",
                  "Status",
                  "Notes",
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
                  key={est.id}
                  className={cn(
                    "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                    i !== estimates.length - 1 &&
                      "border-b border-zinc-100 dark:border-zinc-800",
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {est.date}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                    {est.address}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {est.technicianName}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {est.description}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                    {fmt(est.estimatedAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        statusStyles[est.status],
                      )}
                    >
                      {est.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {est.notes ?? "—"}
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
