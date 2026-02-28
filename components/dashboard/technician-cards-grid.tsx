"use client";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

// Hooks client side
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import {
  useFetchTechnicians,
  type TechnicianDetailRow,
} from "@/hooks/technicians/useFetchTechnicians";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export function TechnicianCardsGrid() {
  const { data: summaries = [], isLoading, isError } = useFetchTechSummary();
  const { data: techDetails = [] } = useFetchTechnicians();

  /** Map technician_id → detail row for commission/email/hired_date */
  const detailMap = useMemo(() => {
    const m = new Map<string, TechnicianDetailRow>();
    for (const d of techDetails) if (d.technician_id) m.set(d.technician_id, d);
    return m;
  }, [techDetails]);

  const technicians = useMemo(
    () =>
      summaries.map((s) => {
        const detail = s.technician_id ? detailMap.get(s.technician_id) : null;
        return {
          ...s,
          commission: detail?.commission ?? null,
          email: detail?.email ?? null,
          hired_date: detail?.hired_date ?? null,
        };
      }),
    [summaries, detailMap],
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (isError) return <div>Error loading technicians</div>;

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-2">
      {technicians.map((tech) => {
        const initials = (tech.name || "?")
          .split(" ")
          .map((n) => n[0])
          .join("");
        return (
          <div
            key={tech.technician_id}
            className={cn(
              "w-md shrink-0 rounded-xl border bg-white p-6 dark:bg-zinc-900",
              "border-zinc-200 dark:border-zinc-800",
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {initials}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {tech.name || "Unknown"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {tech.email || "—"}
                  </p>
                </div>
              </div>
              <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Active
              </span>
            </div>

            {/* Details */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Commission Rate
                </p>
                <p className="mt-0.5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {tech.commission ?? 0} %
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Jobs Completed
                </p>
                <p className="mt-0.5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {tech.total_jobs ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Total Gross
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                  {fmt(tech.gross_revenue ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Company Net Revenue Gained
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-cyan-800 dark:text-cyan-200">
                  {fmt(tech.total_company_net ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Tech Total Earned
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {fmt(tech.total_commission_earned ?? 0)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
              <span className="mx-2">·</span>
              <span>
                Hired{" "}
                {tech.hired_date
                  ? new Date(tech.hired_date).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
