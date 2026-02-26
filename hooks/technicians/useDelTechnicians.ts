import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type TechnicianRow = Database["public"]["Tables"]["technicians"]["Row"];

const dbSoftDeleteTechnician = async (id: string) => {
  const { data: result, error } = await supabase
    .from("technicians")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
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
      queryClient.invalidateQueries({
        queryKey: ["technicians"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["technicians", "monthly-summary"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["technicians", "summary"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Error deleting technician:", error.message || error);
    },
  });
}
