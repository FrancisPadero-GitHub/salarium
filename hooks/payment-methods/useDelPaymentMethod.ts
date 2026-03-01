import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const dbDelPaymentMethod = async (id: string) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("payment_methods")
    .update({ deleted_at: now })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to delete payment method");
  }

  return data;
};

export function useDelPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbDelPaymentMethod,
    onSuccess: async (result) => {
      toast.success(`Payment method "${result.name}" deleted successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete payment method",
      );
    },
  });
}
