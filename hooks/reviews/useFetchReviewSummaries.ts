import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/database.types";
import { supabase } from "@/lib/supabase";

export type ReviewRecordRowSummaries =
  Database["public"]["Views"]["v_review_records_summary"]["Row"];

const fetchReviewRecordsSummaries = async (): Promise<
  ReviewRecordRowSummaries[]
> => {
  const { data, error } = await supabase
    .from("v_review_records_summary")
    .select("*");

  if (error) {
    throw new Error(error.message || "Failed to fetch review records");
  }

  return (data ?? []) as ReviewRecordRowSummaries[];
};

export function useFetchReviewRecordsSummaries() {
  return useQuery<ReviewRecordRowSummaries[], Error>({
    queryKey: ["reviews", "review-records-summaries"],
    queryFn: fetchReviewRecordsSummaries,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
