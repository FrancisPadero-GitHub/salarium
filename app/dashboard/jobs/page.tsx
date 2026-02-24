import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { jobs } from "@/data/jobs";
import type { PaymentMethod } from "@/types/job";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const paymentColors: Record<PaymentMethod, string> = {
  Cash: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Check: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Credit Card":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Zelle: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const totalGross = jobs.reduce((s, j) => s + j.gross, 0);
const totalNet = jobs.reduce((s, j) => s + j.net, 0);
const totalCommission = jobs.reduce((s, j) => s + j.commissionAmount, 0);

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Jobs
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {jobs.length} jobs logged
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
          <Briefcase className="h-4 w-4" />
          Log Job
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Gross", value: fmt(totalGross) },
          { label: "Total Commission", value: fmt(totalCommission) },
          { label: "Total Net", value: fmt(totalNet) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
          </div>
        ))}
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
                  "Parts",
                  "Tips",
                  "Subtotal",
                  "Gross",
                  "Commission",
                  "Net",
                  "Payment",
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
              {jobs.map((job, i) => (
                <tr
                  key={job.id}
                  className={cn(
                    "transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                    i !== jobs.length - 1 &&
                      "border-b border-zinc-100 dark:border-zinc-800",
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {job.date}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                    {job.address}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {job.technicianName}
                    <span className="ml-1 text-xs text-zinc-400">
                      ({Math.round(job.commissionRate * 100)}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {fmt(job.parts)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {fmt(job.tips)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {fmt(job.subtotal)}
                  </td>
                  <td className="px-4 py-3 tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                    {fmt(job.gross)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-amber-600 dark:text-amber-400">
                    {fmt(job.commissionAmount)}
                  </td>
                  <td className="px-4 py-3 tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                    {fmt(job.net)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        paymentColors[job.paymentMethod],
                      )}
                    >
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
