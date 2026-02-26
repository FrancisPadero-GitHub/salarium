import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type Part = Database["public"]["Tables"]["parts"]["Row"];

export interface FetchPartsOptions {
  jobId?: string;
  includeDeleted?: boolean;
}

export interface UsePartsOptions extends FetchPartsOptions {
  enabled?: boolean;
  initialData?: Part[];
}

/**
 * Server-side data fetching function
 */
export const fetchParts = async (
  options: FetchPartsOptions = {},
): Promise<Part[]> => {
  let query = supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false });

  // Filter by job if jobId is provided
  if (options.jobId) {
    query = query.eq("job_id", options.jobId);
  }

  // Exclude soft-deleted parts by default
  if (!options.includeDeleted) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch parts");
  }

  return data as Part[];
};

/**
 * Hook to fetch parts for a specific job
 * @param jobId - The job ID to fetch parts for (optional)
 * @param options - Additional options for the query
 */
export function useFetchParts(jobId?: string, options: UsePartsOptions = {}) {
  const {
    enabled = true,
    initialData,
    includeDeleted = false,
  } = options;

  return useQuery<Part[], Error>({
    queryKey: ["parts", jobId || "all", includeDeleted ? "with-deleted" : "active"],
    queryFn: () =>
      fetchParts({
        jobId,
        includeDeleted,
      }),
    enabled: enabled && (jobId !== undefined || !jobId),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch all parts for a specific job
 */
export function useFetchJobParts(jobId: string, options: UsePartsOptions = {}) {
  const { enabled = true, initialData, includeDeleted = false } = options;

  return useQuery<Part[], Error>({
    queryKey: ["parts", jobId, includeDeleted ? "with-deleted" : "active"],
    queryFn: () =>
      fetchParts({
        jobId,
        includeDeleted,
      }),
    enabled: enabled && !!jobId,
    initialData,
    staleTime: 1000 * 60 * 5,
  });
}
