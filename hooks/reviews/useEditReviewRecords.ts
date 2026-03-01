import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type ReviewRecordUpdate =
  Database["public"]["Tables"]["review_records"]["Update"];
type ReviewRecordRow = Database["public"]["Tables"]["review_records"]["Row"];

const dbEditReviewRecord = async (data: ReviewRecordUpdate) => {
  const { data: result, error } = await supabase
    .from("review_records")
    .update(data)
    .eq("id", data.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to edit review record");
  }

  return result as ReviewRecordRow;
};

export function useEditReviewRecord() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecordRow, Error, ReviewRecordUpdate>({
    mutationFn: dbEditReviewRecord,
    onSuccess: async (result) => {
      console.log("Review record edited successfully:", result);
      await queryClient.invalidateQueries({
        queryKey: ["reviews", "review-records"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "unreviewed"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["job-monthly-financial-summary"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["estimates"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "work-orders"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Error editing review record:", error.message || error);
    },
  });
}
