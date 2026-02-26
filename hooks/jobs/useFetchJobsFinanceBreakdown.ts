import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type JobFinancialBreakdownRow =
  Database["public"]["Views"]["v_job_financial_breakdown"]["Row"];

// Server-side data fetching function
export const fetchJobFinancialBreakdown = async (): Promise<
  JobFinancialBreakdownRow[]
> => {
  const { data: result, error } = await supabase
    .from("v_job_financial_breakdown")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch job financial breakdown");
  }

  return result as JobFinancialBreakdownRow[];
};

export function useFetchJobFinancialBreakdown(
  initialData?: JobFinancialBreakdownRow[],
) {
  return useQuery<JobFinancialBreakdownRow[], Error>({
    queryKey: ["jobs", "financial-breakdown"],
    queryFn: fetchJobFinancialBreakdown,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}
