import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

const dbAddJob = async (data: JobInsert) => {
  const { data: result, error } = await supabase
    .from("jobs")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add job");
  }

  return result as JobRow;
};

export function useAddJob() {
  const queryClient = useQueryClient();
  return useMutation<JobRow, Error, JobInsert>({
    mutationFn: dbAddJob,
    onSuccess: async (result) => {
      console.log("Job added successfully:", result);
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
      console.error("Error adding job:", error.message || error);
    },
  });
}
