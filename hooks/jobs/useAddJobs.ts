import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type WorkOrderInsert = Database["public"]["Tables"]["work_orders"]["Insert"];
type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];

export interface AddJobPayload {
  workOrder: WorkOrderInsert;
  job: Omit<JobInsert, "work_order_id">;
}

const dbAddJob = async (payload: AddJobPayload) => {
  // Step 1: Insert work order
  const { data: workOrder, error: woError } = await supabase
    .from("work_orders")
    .insert([payload.workOrder])
    .select()
    .single();

  if (woError) {
    throw new Error(woError.message || "Failed to create work order");
  }

  // Step 2: Insert job with work_order_id
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert([{ ...payload.job, work_order_id: workOrder.id }])
    .select()
    .single();

  if (jobError) {
    // Clean up the work order on failure
    await supabase.from("work_orders").delete().eq("id", workOrder.id);
    throw new Error(jobError.message || "Failed to create job");
  }

  return { workOrder, job };
};

export function useAddJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbAddJob,
    onSuccess: async (result) => {
      console.log("Job added successfully:", result);
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
      console.error("Error adding job:", error.message || error);
    },
  });
}
