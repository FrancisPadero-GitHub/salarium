import { cn } from "@/lib/utils";
import { technicians } from "@/data/technicians";
import { jobs } from "@/data/jobs";
import { TechPerformanceChart } from "@/components/dashboard/tech-performance-chart";
import { TechMonthlyChart } from "@/components/dashboard/tech-monthly-chart";
import { TechJobsDonut } from "@/components/dashboard/tech-jobs-donut";
import { AddTechnicianDialog } from "@/components/dashboard/add-technician-dialog";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

/** Aggregate per-technician stats from jobs */
function getTechnicianStats(techId: string) {
  const techJobs = jobs.filter((j) => j.technicianId === techId);
  return {
    jobCount: techJobs.length,
    totalGross: techJobs.reduce((s, j) => s + j.gross, 0),
    totalCommission: techJobs.reduce((s, j) => s + j.commissionAmount, 0),
  };
}

export default function TechniciansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Technicians
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {technicians.filter((t) => t.active).length} active ·{" "}
            {technicians.filter((t) => !t.active).length} inactive
          </p>
        </div>
        <AddTechnicianDialog />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TechPerformanceChart />
        <TechMonthlyChart />
      </div>

      <TechJobsDonut />

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {technicians.map((tech) => {
          const stats = getTechnicianStats(tech.id);
          return (
            <div
              key={tech.id}
              className={cn(
                "rounded-xl border bg-white p-6 dark:bg-zinc-900",
                tech.active
                  ? "border-zinc-200 dark:border-zinc-800"
                  : "border-zinc-100 opacity-60 dark:border-zinc-800/50",
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {tech.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {tech.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {tech.email}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    tech.active
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                >
                  {tech.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Commission Rate
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {Math.round(tech.commissionRate * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Jobs Completed
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {stats.jobCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Total Gross
                  </p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                    {fmt(stats.totalGross)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Total Earned
                  </p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {fmt(stats.totalCommission)}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                <span>{tech.phone}</span>
                <span className="mx-2">·</span>
                <span>Hired {tech.hiredAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
