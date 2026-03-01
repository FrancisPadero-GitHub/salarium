import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type ReviewTypeRow = Database["public"]["Tables"]["review_types"]["Row"];

const fetchReviewTypes = async (): Promise<ReviewTypeRow[]> => {
  const { data, error } = await supabase
    .from("review_types")
    .select("*")
    .is("deleted_at", null)
    .order("name");

  if (error) throw new Error(error.message || "Failed to fetch review types");

  return data as ReviewTypeRow[];
};

export function useFetchReviewTypes() {
  return useQuery<ReviewTypeRow[], Error>({
    queryKey: ["review-types"],
    queryFn: fetchReviewTypes,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
