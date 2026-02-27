import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  return useMutation<JobRow, Error, JobUpdate>({
    mutationFn: dbEditJob,
    onSuccess: async (result) => {
      console.log("Job edited successfully:", result);
      queryClient.invalidateQueries({
        queryKey: ["jobs", "financial-breakdown"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "table-detailed"],
        exact: false,
      });
      router.refresh();
    },
    onError: (error) => {
      console.error("Error editing job:", error.message || error);
    },
  });
}
