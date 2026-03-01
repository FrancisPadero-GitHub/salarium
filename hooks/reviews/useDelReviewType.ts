import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const dbDelReviewType = async (id: string) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("review_types")
    .update({ deleted_at: now })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to delete review type");
  }

  return data;
};

export function useDelReviewType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbDelReviewType,
    onSuccess: async (result) => {
      toast.success(`Review type "${result.name}" deleted successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["review-types"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete review type",
      );
    },
  });
}
