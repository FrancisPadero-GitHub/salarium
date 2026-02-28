import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type VJobsRow = Database["public"]["Views"]["v_jobs_summary"]["Row"];

// Data fetching function
export const fetchJobSummary = async (): Promise<VJobsRow[]> => {
  const { data: result, error } = await supabase
    .from("v_jobs_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch jobs");
  }

  return result as VJobsRow[];
};

export function useFetchJobSummary() {
  return useQuery<VJobsRow[], Error>({
    queryKey: ["jobs", "summary"],
    queryFn: fetchJobSummary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
