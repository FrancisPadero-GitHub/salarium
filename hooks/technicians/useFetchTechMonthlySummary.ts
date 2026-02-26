import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianMonthlySummaryRow =
  Database["public"]["Views"]["v_technician_monthly_summary"]["Row"];

// Server-side data fetching function
export const fetchTechMonthlySummary = async (): Promise<
  TechnicianMonthlySummaryRow[]
> => {
  const { data: result, error } = await supabase
    .from("v_technician_monthly_summary")
    .select("*");

  if (error) {
    throw new Error(error.message || "Failed to fetch technician summary");
  }

  return result as TechnicianMonthlySummaryRow[];
};

// Apparently this hook is not being used anywhere,
// but it can be used in client components to fetch
// the technician summary data with caching and revalidation features provided by React Query.
// Since state management and data fetching are often handled in client components,
// this hook can be useful for any component that needs to access the technician summary data on the client side.
export function useFetchTechMonthlySummary(
  initialData?: TechnicianMonthlySummaryRow[],
) {
  return useQuery<TechnicianMonthlySummaryRow[], Error>({
    queryKey: ["technicians", "monthly-summary"],
    queryFn: fetchTechMonthlySummary,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}
