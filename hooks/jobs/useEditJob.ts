import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type WorkOrderUpdate = Database["public"]["Tables"]["work_orders"]["Update"];
type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

export interface EditJobPayload {
  workOrderId: string;
  workOrder: WorkOrderUpdate;
  job: JobUpdate;
}

const dbEditJob = async (payload: EditJobPayload) => {
  // Update the work order
  const { error: woError } = await supabase
    .from("work_orders")
    .update(payload.workOrder)
    .eq("id", payload.workOrderId);

  if (woError) {
    throw new Error(woError.message || "Failed to update work order");
  }

  // Update the job
  const { data: result, error: jobError } = await supabase
    .from("jobs")
    .update(payload.job)
    .eq("work_order_id", payload.workOrderId)
    .select()
    .single();

  if (jobError) {
    throw new Error(jobError.message || "Failed to update job");
  }

  return result;
};

export function useEditJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbEditJob,
    onSuccess: async (result) => {
      console.log("Job edited successfully:", result);
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "summary"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["jobs", "view-table"],
        exact: false,
      });
      // technicians
      await queryClient.refetchQueries({
        queryKey: ["tech", "details"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["tech", "summary"],
        exact: false,
      });
    },
    onError: (error: Error) => {
      console.error("Error editing job:", error.message || error);
    },
  });
}
