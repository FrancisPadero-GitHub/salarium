import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type JobFinancialBreakdownRow =
  Database["public"]["Views"]["v_job_financial_breakdown"]["Row"];

export type JobStatus = "done" | "pending" | "cancelled" | (string & {});

export interface FetchJobFinancialBreakdownOptions {
  /** Filter by one or more job statuses. Omit to return all statuses. */
  status?: JobStatus | JobStatus[];
}

export interface UseJobFinancialBreakdownOptions extends FetchJobFinancialBreakdownOptions {
  initialData?: JobFinancialBreakdownRow[];
}

/**
 * I forgot to put status: "done" in the original query and it returned all jobs, which was a
 * ctually more useful for the dashboard since we can show pending jobs too.
 * So now the fetch function accepts an optional status filter but doesn't apply it by default,
 * and the React Query hook passes undefined to fetch all statuses since we have the full dataset available on the client after the initial load.
 *
 * WILL FIX THIS LATER
 *
 * possible fix
 *
 * divide the view schema to individual parts i.e., for tables, charts, cards, etc
 * and not have a single view with all the data for all components, this way we can fetch only the relevant data for each component
 *
 */

// Server-side data fetching function
export const fetchJobFinancialBreakdown = async (
  options: FetchJobFinancialBreakdownOptions = {},
): Promise<JobFinancialBreakdownRow[]> => {
  let query = supabase
    .from("v_job_financial_breakdown")
    .select("*")
    .order("created_at", { ascending: false });

  if (options.status !== undefined) {
    const statuses = Array.isArray(options.status)
      ? options.status
      : [options.status];

    if (statuses.length === 1) {
      query = query.eq("status", statuses[0]);
    } else {
      query = query.in("status", statuses);
    }
  }

  const { data: result, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch job financial breakdown");
  }

  return result as JobFinancialBreakdownRow[];
};

export function useFetchJobFinancialBreakdown(
  options: UseJobFinancialBreakdownOptions = {},
) {
  const { initialData, ...fetchOptions } = options;

  // Normalise status into a stable key segment so each filter variant has its own cache entry
  const statusKey = fetchOptions.status
    ? Array.isArray(fetchOptions.status)
      ? fetchOptions.status.slice().sort().join(",")
      : fetchOptions.status
    : "all";

  return useQuery<JobFinancialBreakdownRow[], Error>({
    queryKey: ["jobs", "financial-breakdown", statusKey],
    queryFn: () => fetchJobFinancialBreakdown(fetchOptions),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}
