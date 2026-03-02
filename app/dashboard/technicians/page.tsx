"use client";

import { TriangleAlert } from "lucide-react";
import { TechPerformanceChart } from "@/components/dashboard/technician/tech-performance-chart";
import { TechJobsDonut } from "@/components/dashboard/technician/tech-jobs-donut";
import { AddTechnicianDialog } from "@/components/dashboard/technician/form-technician-dialog";
import { TechnicianCardsGrid } from "@/components/dashboard/technician/technician-cards-grid";
import { TechnicianTable } from "@/components/dashboard/technician/technician-table";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";

// toasts
import { TechniciansErrorToast } from "@/components/toasts/technicians-error";

export default function TechniciansPage() {
  const {
    data: techSummary = [],
    isError: isTechError,
    error: techError,
  } = useFetchTechSummary();

  const errorMessage = techError?.message || "Failed to fetch technicians";

  if (isTechError) {
    return (
      <>
        <TechniciansErrorToast />
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
  if (techSummary.length < 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No technicians found. Add one to get started.
        </p>
      </div>
    );
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
      {/* Technician Table */}
      <TechnicianTable />
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TechPerformanceChart />
        <TechJobsDonut />
      </div>

      <div className="grid ">
        {/* Technician Cards Grid */}
        <div className="h-full overflow-hidden p-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-xl">
          <TechnicianCardsGrid />
        </div>
      </div>
    </div>
  );
}
