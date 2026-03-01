import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type JobRow = Database["public"]["Views"]["v_jobs"]["Row"];

const fetchJobs = async (): Promise<JobRow[]> => {
  const { data, error } = await supabase
    .from("v_jobs")
    .select("*")
    .eq("status", "done")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Failed to fetch jobs");

  return data as JobRow[];
};

export function useFetchJobsForReview() {
  return useQuery<JobRow[], Error>({
    queryKey: ["jobs", "for-review"],
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
