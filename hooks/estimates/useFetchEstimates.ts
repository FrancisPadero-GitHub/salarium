import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type EstimatesRow = Database["public"]["Views"]["v_estimates"]["Row"];

// Data fetching function
export const fetchEstimates = async (): Promise<EstimatesRow[]> => {
  const { data: result, error } = await supabase
    .from("v_estimates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch estimates");
  }

  return result as EstimatesRow[];
};

export function useFetchEstimates() {
  return useQuery<EstimatesRow[], Error>({
    queryKey: ["estimates", "view-table"],
    queryFn: fetchEstimates,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
}
