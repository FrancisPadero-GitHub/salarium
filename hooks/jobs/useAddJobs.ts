import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type JobFormValues = Database["public"]["Tables"]["jobs"]["Insert"];
type JobRow = Database["public"]["Tables"]["jobs"]["Row"];

const dbAddJob = async (data: JobFormValues) => {
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
  return useMutation<JobRow, Error, JobFormValues>({
    mutationFn: dbAddJob,
    onSuccess: async (result) => {
      console.log("Job added successfully:", result);
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
      console.error("Error adding job:", error.message || error);
    },
  });
}
