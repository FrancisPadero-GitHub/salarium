import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type ReviewRecordUpdate =
  Database["public"]["Tables"]["review_records"]["Update"];
type ReviewRecordRow = Database["public"]["Tables"]["review_records"]["Row"];

const dbDelReviewRecord = async (id: string) => {
  // Soft-delete the review record
  const { data: result, error } = await supabase
    .from("review_records")
    .update({ deleted_at: new Date().toISOString() } as ReviewRecordUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to delete review record");
  }

  // Clear review_id on work_orders so the job becomes available for re-review
  const { error: workOrderError } = await supabase
    .from("work_orders")
    .update({ review_id: null })
    .eq("review_id", id);

  if (workOrderError) {
    throw new Error(
      workOrderError.message || "Failed to unlink job from review record",
    );
  }

  return result as ReviewRecordRow;
};

export function useDelReviewRecord() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecordRow, Error, string>({
    mutationFn: dbDelReviewRecord,
    onSuccess: async (result) => {
      console.log("Review record deleted successfully:", result);
      await queryClient.invalidateQueries({
        queryKey: ["reviews", "review-records"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
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
      console.error("Error deleting review record:", error.message || error);
    },
  });
}
