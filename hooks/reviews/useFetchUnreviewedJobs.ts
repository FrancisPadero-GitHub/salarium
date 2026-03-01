import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type UnreviewedJobRow = Database["public"]["Views"]["v_jobs"]["Row"];

const fetchUnreviewedJobs = async (): Promise<UnreviewedJobRow[]> => {
  const { data, error } = await supabase
    .from("v_jobs")
    .select("*")
    .eq("status", "done")
    .is("review_id", null)
    .order("work_order_date", { ascending: false });

  if (error)
    throw new Error(error.message || "Failed to fetch unreviewed jobs");

  return data as UnreviewedJobRow[];
};

export function useFetchUnreviewedJobs() {
  return useQuery<UnreviewedJobRow[], Error>({
    queryKey: ["jobs", "unreviewed"],
    queryFn: fetchUnreviewedJobs,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
