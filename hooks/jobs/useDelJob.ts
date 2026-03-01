import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const dbSoftDeleteJob = async (workOrderId: string) => {
  const now = new Date().toISOString();

  // Soft delete the job record
  const { error: jobError } = await supabase
    .from("jobs")
    .update({ deleted_at: now })
    .eq("work_order_id", workOrderId);

  if (jobError) {
    throw new Error(jobError.message || "Failed to delete job");
  }

  // Soft delete the work order
  const { data: result, error: woError } = await supabase
    .from("work_orders")
    .update({ deleted_at: now })
    .eq("id", workOrderId)
    .select()
    .single();

  if (woError) {
    throw new Error(woError.message || "Failed to delete work order");
  }

  return result;
};

export function useDelJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbSoftDeleteJob,
    onSuccess: async (result) => {
      console.log("Job soft-deleted successfully:", result);
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["job-monthly-financial-summary"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["technicians"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["estimates"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "work-orders"],
        exact: false,
      });
    },
    onError: (error: Error) => {
      console.error("Error soft-deleting job:", error.message || error);
    },
  });
}
