import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type WorkOrdersRow = Database["public"]["Tables"]["work_orders"]["Row"];

// Data fetching function
export const fetchWorkOrdersRow = async (): Promise<WorkOrdersRow[]> => {
  const { data: result, error } = await supabase
    .from("work_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch work orders table");
  }

  return result as WorkOrdersRow[];
};

export function useFetchWorkOrdersRow() {
  return useQuery<WorkOrdersRow[], Error>({
    queryKey: ["jobs", "work-orders"],
    queryFn: fetchWorkOrdersRow,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
