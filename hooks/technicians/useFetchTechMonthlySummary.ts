import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type VJobsRow = Database["public"]["Views"]["v_jobs"]["Row"];

export interface TechnicianMonthlySummaryRow {
  name: string | null;
  technician_id: string | null;
  year_month: string | null;
  total_gross: number | null;
}

/**
 * Computes technician monthly summary from v_jobs data
 * (replaces the removed v_technician_monthly_summary view).
 */
const computeTechMonthlySummary = (
  jobs: VJobsRow[],
  techNameMap: Map<string, string>,
): TechnicianMonthlySummaryRow[] => {
  const grouped: Record<string, TechnicianMonthlySummaryRow> = {};

  for (const job of jobs) {
    const date = job.work_order_date || job.created_at;
    if (!date || !job.technician_id) continue;
    const yearMonth = date.substring(0, 7);
    const key = `${job.technician_id}-${yearMonth}`;

    if (!grouped[key]) {
      grouped[key] = {
        name: techNameMap.get(job.technician_id) || "Unknown",
        technician_id: job.technician_id,
        year_month: yearMonth,
        total_gross: 0,
      };
    }
    grouped[key].total_gross =
      (grouped[key].total_gross || 0) + (job.subtotal || 0);
  }

  return Object.values(grouped);
};

export const fetchTechMonthlySummary = async (): Promise<
  TechnicianMonthlySummaryRow[]
> => {
  const [jobsResult, techResult] = await Promise.all([
    supabase.from("v_jobs").select("*"),
    supabase.from("v_technicians_summary").select("technician_id, name"),
  ]);

  if (jobsResult.error) throw new Error(jobsResult.error.message);
  if (techResult.error) throw new Error(techResult.error.message);

  const techNameMap = new Map<string, string>();
  for (const t of techResult.data || []) {
    if (t.technician_id && t.name) techNameMap.set(t.technician_id, t.name);
  }

  return computeTechMonthlySummary(
    (jobsResult.data as VJobsRow[]) || [],
    techNameMap,
  );
};

export function useFetchTechMonthlySummary() {
  return useQuery<TechnicianMonthlySummaryRow[], Error>({
    queryKey: ["technicians", "monthly-summary"],
    queryFn: fetchTechMonthlySummary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
