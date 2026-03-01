import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type TechnicianRow = Database["public"]["Tables"]["technicians"]["Row"];

const dbSoftDeleteTechnician = async (id: string) => {
  const { data: result, error } = await supabase
    .from("technicians")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to delete technician");
  }

  return result as TechnicianRow;
};

export function useDelTechnician() {
  const queryClient = useQueryClient();
  return useMutation<TechnicianRow, Error, string>({
    mutationFn: dbSoftDeleteTechnician,
    onSuccess: async (result) => {
      console.log("Technician soft-deleted successfully:", result);
      await queryClient.invalidateQueries({
        queryKey: ["technicians"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["job-monthly-financial-summary"],
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
    onError: (error) => {
      console.error("Error deleting technician:", error.message || error);
    },
  });
}
