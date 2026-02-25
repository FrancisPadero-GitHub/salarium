import { TechPerformanceChart } from "@/components/dashboard/tech-performance-chart";
import { TechMonthlyChart } from "@/components/dashboard/tech-monthly-chart";
import { TechJobsDonut } from "@/components/dashboard/tech-jobs-donut";
import { AddTechnicianDialog } from "@/components/dashboard/add-technician-dialog";
import { TechnicianCardsGrid } from "@/components/dashboard/technician-cards-grid";

// Server-side data fetching
import { fetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";

// types
import type { TechnicianSummaryRow } from "@/hooks/technicians/useFetchTechSummary";

export default async function TechniciansPage() {
  // Fetch data server-side during render
  let techSummary: TechnicianSummaryRow[] = [];
  let error = null;

  try {
    techSummary = await fetchTechSummary();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch technicians";
    console.error("Error fetching technician summary:", error);
  }

  const activeCount = techSummary.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Technicians
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {activeCount} active
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

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-zinc-200 bg-red-100 p-8 text-center dark:border-zinc-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-400">
            Something went wrong!
          </p>
        </div>
      )}

      {/* Technician Cards Grid - passed as client component */}
      {techSummary.length > 0 ? (
        <TechnicianCardsGrid initialTechSummary={techSummary} />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No technicians found. Add one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
