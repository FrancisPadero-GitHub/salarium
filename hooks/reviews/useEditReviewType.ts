import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";
import { toast } from "sonner";

type ReviewTypeUpdate = Database["public"]["Tables"]["review_types"]["Update"];

export interface EditReviewTypePayload {
  id: string;
  data: ReviewTypeUpdate;
}

const dbEditReviewType = async (payload: EditReviewTypePayload) => {
  const { data, error } = await supabase
    .from("review_types")
    .update(payload.data)
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update review type");
  }

  return data;
};

export function useEditReviewType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbEditReviewType,
    onSuccess: async (result) => {
      toast.success(`Review type "${result.name}" updated successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["review-types"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update review type",
      );
    },
  });
}
