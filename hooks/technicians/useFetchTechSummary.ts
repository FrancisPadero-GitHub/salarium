import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianSummaryRow =
  Database["public"]["Views"]["v_technicians_summary"]["Row"];

// Data fetching function
export const fetchTechSummary = async (): Promise<TechnicianSummaryRow[]> => {
  const { data: result, error } = await supabase
    .from("v_technicians_summary")
    .select("*");

  if (error) {
    throw new Error(error.message || "Failed to fetch technician summary");
  }

  return result as TechnicianSummaryRow[];
};

export function useFetchTechSummary() {
  return useQuery<TechnicianSummaryRow[], Error>({
    queryKey: ["technicians", "summary"],
    queryFn: fetchTechSummary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
