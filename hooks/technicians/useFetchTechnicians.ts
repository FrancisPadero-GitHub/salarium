import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianDetailRow =
  Database["public"]["Tables"]["technicians"]["Row"];

/** You might be asking why I don't put
 * .is("deleted_at", null) in the query to exclude deleted technicians.
 * The reason is that I want to fetch all technicians, including those that are soft-deleted,
 * so that I can determine which ones are deleted and show them differently in the UI.
 */

export const fetchTechnicians = async (): Promise<TechnicianDetailRow[]> => {
  const { data: result, error } = await supabase
    .from("technicians")
    .select("*")
    .order("created_at", { ascending: false });

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
