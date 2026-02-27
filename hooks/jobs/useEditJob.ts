import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

const dbEditJob = async (data: JobUpdate) => {
  const { data: result, error } = await supabase
    .from("jobs")
    .update(data)
    .eq("id", data.id!)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to edit job");
  }

  return result as JobRow;
};

export function useEditJob() {
  const queryClient = useQueryClient();
  return useMutation<JobRow, Error, JobUpdate>({
    mutationFn: dbEditJob,
    onSuccess: async (result) => {
      console.log("Job edited successfully:", result);
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["jobs"],
        type: "active",
      });
    },
    onError: (error) => {
      console.error("Error editing job:", error.message || error);
    },
  });
}
