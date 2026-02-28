import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type ViewJobsRow = Database["public"]["Views"]["v_jobs"]["Row"];

// Data fetching function
export const fetchViewJobRow = async (): Promise<ViewJobsRow[]> => {
  const { data: result, error } = await supabase
    .from("v_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch jobs view table");
  }

  return result as ViewJobsRow[];
};

export function useFetchViewJobRow() {
  return useQuery<ViewJobsRow[], Error>({
    queryKey: ["jobs", "view-table"],
    queryFn: fetchViewJobRow,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
