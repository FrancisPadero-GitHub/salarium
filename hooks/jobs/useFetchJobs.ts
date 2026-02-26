import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type JobDetailedRow =
  Database["public"]["Views"]["v_job_table_detailed"]["Row"];

// Server-side data fetching function
export const fetchJobDetailed = async (): Promise<JobDetailedRow[]> => {
  const { data: result, error } = await supabase
    .from("v_job_table_detailed")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch job detailed view");
  }

  return result as JobDetailedRow[];
};

export function useFetchJobDetailed(initialData?: JobDetailedRow[]) {
  return useQuery<JobDetailedRow[], Error>({
    queryKey: ["jobs", "table-detailed"],
    queryFn: fetchJobDetailed,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}
