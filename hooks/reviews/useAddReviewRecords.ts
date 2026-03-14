import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type TechnicianInsert =
  Database["public"]["Tables"]["review_records"]["Insert"];
type TechnicianRow = Database["public"]["Tables"]["review_records"]["Row"];

const dbAddReviewRecord = async (data: TechnicianInsert) => {
  const { data: result, error } = await supabase
    .from("review_records")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add review record");
  }

  return result as TechnicianRow;
};

export function useAddReviewRecord() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation<TechnicianRow, Error, TechnicianInsert>({
    mutationFn: async (data: TechnicianInsert) => {
      const companyId = session?.user.app_metadata.company_id as
        | string
        | undefined;

      if (!companyId) {
        throw new Error("Company ID is missing from user session");
      }

      return dbAddReviewRecord({
        ...data,
        company_id: companyId,
      });
    },
    onSuccess: (result) => {
      void result;
      toast.success("Review record added successfully");
      // Fire all invalidations in parallel without blocking so that
      // isAddSuccess is set immediately and the dialog can close.
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reviews", "review-records"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["reviews", "review-records-summaries"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["jobs"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["jobs", "unreviewed"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["jobs", "for-review"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["jobs", "work-orders"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["job-monthly-financial-summary"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["estimates"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["export_dashboard_report"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard-metrics"],
          exact: false,
        }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add review record");
    },
  });
}
