import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianSummaryRow =
  Database["public"]["Views"]["v_technician_summary"]["Row"];

// Server-side data fetching function
export const fetchTechSummary = async (): Promise<TechnicianSummaryRow[]> => {
  const { data: result, error } = await supabase
    .from("v_technician_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch technician summary");
  }

  return result as TechnicianSummaryRow[];
};

// Apparently this hook is not being used anywhere,
// but it can be used in client components to fetch
// the technician summary data with caching and revalidation features provided by React Query.
// Since state management and data fetching are often handled in client components,
// this hook can be useful for any component that needs to access the technician summary data on the client side.
export function useFetchTechSummary(initialData?: TechnicianSummaryRow[]) {
  return useQuery<TechnicianSummaryRow[], Error>({
    queryKey: ["technicians", "summary"],
    queryFn: fetchTechSummary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}
