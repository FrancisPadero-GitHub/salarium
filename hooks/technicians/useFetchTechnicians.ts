import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianDetailRow =
  Database["public"]["Tables"]["technicians"]["Row"];

export const fetchTechnicians = async (): Promise<TechnicianDetailRow[]> => {
  const { data: result, error } = await supabase
    .from("technicians")
    .select("*")
    .is("deleted_at", null);

  if (error) {
    throw new Error(error.message || "Failed to fetch technicians");
  }

  return result as TechnicianDetailRow[];
};

export function useFetchTechnicians() {
  return useQuery<TechnicianDetailRow[], Error>({
    queryKey: ["technicians", "details"],
    queryFn: fetchTechnicians,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
