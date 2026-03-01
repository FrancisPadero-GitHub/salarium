import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type TechnicianInsert =
  Database["public"]["Tables"]["review_records"]["Insert"];
type TechnicianRow = Database["public"]["Tables"]["review_records"]["Row"];

const dbAddReviewRecord = async (data: TechnicianInsert) => {
  const { data: result, error } = await supabase
    .from("review_records")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add review record");
  }

  return result as TechnicianRow;
};

export function useAddReviewRecord() {
  const queryClient = useQueryClient();
  return useMutation<TechnicianRow, Error, TechnicianInsert>({
    mutationFn: dbAddReviewRecord,
    onSuccess: async (result) => {
      console.log("Review record added successfully:", result);
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
      console.error("Error adding review record:", error.message || error);
    },
  });
}
