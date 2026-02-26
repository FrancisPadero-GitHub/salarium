import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Database } from "@/database.types";

type VJobMosYrFinancialSummary =
  Database["public"]["Views"]["v_job_mos_yr_financial_summary"]["Row"];

export const useFetchJobMonthlyFinancialSummary = (
  initialData?: VJobMosYrFinancialSummary[],
) => {
  return useQuery({
    queryKey: ["job-monthly-financial-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_job_mos_yr_financial_summary")
        .select("*")
        .order("period", { ascending: false });

      if (error) throw error;
      return (data as VJobMosYrFinancialSummary[]) || [];
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });
};
