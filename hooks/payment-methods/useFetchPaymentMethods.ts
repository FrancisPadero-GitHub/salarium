import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type PaymentMethodRow =
  Database["public"]["Tables"]["payment_methods"]["Row"];

export const fetchPaymentMethods = async (): Promise<PaymentMethodRow[]> => {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .is("deleted_at", null)
    .order("name");

  if (error)
    throw new Error(error.message || "Failed to fetch payment methods");

  return data as PaymentMethodRow[];
};

export function useFetchPaymentMethods() {
  return useQuery<PaymentMethodRow[], Error>({
    queryKey: ["payment-methods"],
    queryFn: fetchPaymentMethods,
    staleTime: 1000 * 60 * 10, // 10 minutes — these rarely change
  });
}
