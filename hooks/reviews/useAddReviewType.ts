import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";
import { toast } from "sonner";

type ReviewTypeInsert = Database["public"]["Tables"]["review_types"]["Insert"];

const dbAddReviewType = async (type: ReviewTypeInsert) => {
  const { data, error } = await supabase
    .from("review_types")
    .insert([type])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add review type");
  }

  return data;
};

export function useAddReviewType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbAddReviewType,
    onSuccess: async (result) => {
      toast.success(`Review type "${result.name}" added successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["review-types"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add review type",
      );
    },
  });
}
