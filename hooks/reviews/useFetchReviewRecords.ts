import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/database.types";
import { supabase } from "@/lib/supabase";

export type ReviewRecordRow =
  Database["public"]["Views"]["v_review_records"]["Row"];

const fetchReviewRecords = async (): Promise<ReviewRecordRow[]> => {
  const { data, error } = await supabase
    .from("v_review_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch review records");
  }

  return (data ?? []) as ReviewRecordRow[];
};

export function useFetchReviewRecords() {
  return useQuery<ReviewRecordRow[], Error>({
    queryKey: ["reviews", "review-records"],
    queryFn: fetchReviewRecords,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
