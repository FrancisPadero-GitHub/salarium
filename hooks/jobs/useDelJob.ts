import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

const dbSoftDeleteJob = async (id: string) => {
  const { data: result, error } = await supabase
    .from("jobs")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to delete job");
  }

  return result as JobRow;
};

export function useDelJob() {
  const queryClient = useQueryClient();
  return useMutation<JobRow, Error, string>({
    mutationFn: dbSoftDeleteJob,
    onSuccess: async (result) => {
      console.log("Job soft-deleted successfully:", result);
      queryClient.invalidateQueries({
        queryKey: ["jobs", "financial-breakdown"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "table-detailed"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Error soft-deleting job:", error.message || error);
    },
  });
}
