import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianMonthlySummaryRow =
  Database["public"]["Views"]["v_technician_monthly_summary"]["Row"];

// Data fetching function
export const fetchTechMonthlySummary = async (): Promise<
  TechnicianMonthlySummaryRow[]
> => {
  const { data: result, error } = await supabase
    .from("v_technician_monthly_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch technician summary");
  }

  return result as TechnicianMonthlySummaryRow[];
};

export function useFetchTechMonthlySummary() {
  return useQuery<TechnicianMonthlySummaryRow[], Error>({
    queryKey: ["technicians", "monthly-summary"],
    queryFn: fetchTechMonthlySummary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
