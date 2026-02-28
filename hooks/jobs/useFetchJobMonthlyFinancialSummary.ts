import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type VJobsRow = Database["public"]["Views"]["v_jobs"]["Row"];

export interface MonthlyFinancialSummary {
  period: string;
  gross_total: number;
  net_total: number;
  parts_total: number;
  total_jobs: number;
}

/**
 * Computes monthly financial summary from v_jobs data
 * (replaces the removed v_job_mos_yr_financial_summary view).
 */
const computeMonthlySummary = (jobs: VJobsRow[]): MonthlyFinancialSummary[] => {
  const grouped: Record<string, MonthlyFinancialSummary> = {};

  for (const job of jobs) {
    const date = job.work_order_date || job.created_at;
    if (!date) continue;
    const period = date.substring(0, 7); // "YYYY-MM"

    if (!grouped[period]) {
      grouped[period] = {
        period,
        gross_total: 0,
        net_total: 0,
        parts_total: 0,
        total_jobs: 0,
      };
    }

    grouped[period].gross_total += job.subtotal || 0;
    grouped[period].net_total += job.total_company_net || 0;
    grouped[period].parts_total += job.parts_total_cost || 0;
    grouped[period].total_jobs += 1;
  }

  return Object.values(grouped).sort((a, b) =>
    b.period.localeCompare(a.period),
  );
};

export const useFetchJobMonthlyFinancialSummary = (
  initialData?: MonthlyFinancialSummary[],
) => {
  return useQuery({
    queryKey: ["job-monthly-financial-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("v_jobs").select("*");

      if (error) throw error;
      return computeMonthlySummary((data as VJobsRow[]) || []);
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });
};
