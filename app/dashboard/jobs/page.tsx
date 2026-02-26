import { TriangleAlert, DollarSign, TrendingUp, Briefcase } from "lucide-react";
import { fetchJobFinancialBreakdown } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";
import { TopCategoriesChart } from "@/components/dashboard/job-top-categories";
import { TechRevenueBarChart } from "@/components/dashboard/tech-revenue-bar-chart";
import { TopJobsChart } from "@/components/dashboard/top-jobs-chart";
import { LogJobDialog } from "@/components/dashboard/log-job-dialog";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { JobsErrorToast } from "@/components/toasts/jobs-error";
import type { JobFinancialBreakdownRow } from "@/hooks/jobs/useFetchJobsFinanceBreakdown";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export default async function JobsPage() {
  let jobs: JobFinancialBreakdownRow[] = [];
  let error = null;

  try {
    jobs = await fetchJobFinancialBreakdown({ status: "done" });
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

  // ── Summary totals ────────────────────────────────────────────────────────
  const totalGross = jobs.reduce((s, j) => s + (j.gross ?? 0), 0);
  const totalCommission = jobs.reduce((s, j) => s + (j.commission ?? 0), 0);
  const totalCompanyNet = jobs.reduce((s, j) => s + (j.company_net ?? 0), 0);

  const techRevenueMap: Record<
    string,
    { companyNet: number; techPay: number }
  > = {};
  for (const j of jobs) {
    const name = j.technician_name ?? "Unknown";
    if (!techRevenueMap[name])
      techRevenueMap[name] = { companyNet: 0, techPay: 0 };
    techRevenueMap[name].companyNet += j.company_net ?? 0;
    techRevenueMap[name].techPay += j.commission ?? 0;
  }
  const techRevenueData = Object.entries(techRevenueMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.companyNet + b.techPay - (a.companyNet + a.techPay));

  const topJobsData = [...jobs]
    .sort((a, b) => (b.gross ?? 0) - (a.gross ?? 0))
    .slice(0, 10)
    .map((j) => ({
      label: j.job_name ?? j.category ?? "Unknown",
      address: j.address ?? "Unknown",
      tech: j.technician_name ?? "?",
      gross: j.gross ?? 0,
      category: j.category ?? "Uncategorized",
    }));

  const summaryCards = [
    {
      label: "Total Gross",
      value: fmt(totalGross),
      Icon: DollarSign,
      color: "text-zinc-900 dark:text-zinc-50",
    },
    {
      label: "Total Commission",
      value: fmt(totalCommission),
      Icon: TrendingUp,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Company Net",
      value: fmt(totalCompanyNet),
      Icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                {label}
              </p>
            </div>
            <p className={`mt-1 text-xl font-bold tabular-nums ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopCategoriesChart />
        <TechRevenueBarChart data={techRevenueData} />
      </div>

      <TopJobsChart data={topJobsData} />

      <JobsTable initialJobs={jobs} />
    </div>
  );
}
