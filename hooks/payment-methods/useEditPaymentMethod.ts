import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";
import { toast } from "sonner";

type PaymentMethodUpdate =
  Database["public"]["Tables"]["payment_methods"]["Update"];

export interface EditPaymentMethodPayload {
  id: string;
  data: PaymentMethodUpdate;
}

const dbEditPaymentMethod = async (payload: EditPaymentMethodPayload) => {
  const { data, error } = await supabase
    .from("payment_methods")
    .update(payload.data)
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update payment method");
  }

  return data;
};

export function useEditPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbEditPaymentMethod,
    onSuccess: async (result) => {
      toast.success(`Payment method "${result.name}" updated successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update payment method",
      );
    },
  });
}
