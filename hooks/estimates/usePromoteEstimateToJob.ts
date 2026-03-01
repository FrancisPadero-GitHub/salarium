import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type WorkOrderUpdate = Database["public"]["Tables"]["work_orders"]["Update"];
type EstimateUpdate = Database["public"]["Tables"]["estimates"]["Update"];
type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];

export interface PromoteEstimateToJobPayload {
  workOrderId: string;
  workOrderUpdates?: WorkOrderUpdate;
  estimateUpdates: EstimateUpdate;
  job: Omit<JobInsert, "work_order_id">;
}

const dbPromoteEstimateToJob = async (payload: PromoteEstimateToJobPayload) => {
  if (
    payload.workOrderUpdates &&
    Object.keys(payload.workOrderUpdates).length
  ) {
    const { error: workOrderError } = await supabase
      .from("work_orders")
      .update(payload.workOrderUpdates)
      .eq("id", payload.workOrderId);

    if (workOrderError) {
      throw new Error(workOrderError.message || "Failed to update work order");
    }
  }

  const { data: jobResult, error: jobError } = await supabase
    .from("jobs")
    .upsert(
      [
        {
          ...payload.job,
          work_order_id: payload.workOrderId,
          deleted_at: null,
        },
      ],
      { onConflict: "work_order_id" },
    )
    .select()
    .single();

  if (jobError) {
    throw new Error(jobError.message || "Failed to promote estimate to job");
  }

  const { data: estimateResult, error: estimateError } = await supabase
    .from("estimates")
    .update(payload.estimateUpdates)
    .eq("work_order_id", payload.workOrderId)
    .select()
    .single();

  if (estimateError) {
    await supabase
      .from("jobs")
      .delete()
      .eq("work_order_id", payload.workOrderId);
    throw new Error(
      estimateError.message || "Failed to update estimate status",
    );
  }

  return {
    job: jobResult,
    estimate: estimateResult,
  };
};

export function usePromoteEstimateToJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dbPromoteEstimateToJob,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ["estimates"] });
      await queryClient.refetchQueries({
        queryKey: ["estimates", "view-table"],
        exact: false,
      });
      await queryClient.cancelQueries({ queryKey: ["jobs", "work-orders"] });
      await queryClient.refetchQueries({
        queryKey: ["jobs", "work-orders"],
        exact: false,
      });

      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      await queryClient.refetchQueries({
        queryKey: ["jobs", "view-table"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "summary"],
        exact: false,
      });
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
      console.error("Error promoting estimate to job:", error.message || error);
    },
  });
}
