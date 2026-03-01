import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type TechnicianUpdate =
  Database["public"]["Tables"]["technicians"]["Update"];
export type TechnicianRow = Database["public"]["Tables"]["technicians"]["Row"];

const dbEditTechnician = async (data: TechnicianUpdate) => {
  const { data: result, error } = await supabase
    .from("technicians")
    .update(data)
    .eq("id", data.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to edit technician");
  }

  return result as TechnicianRow;
};

export function useEditTechnician() {
  const queryClient = useQueryClient();
  return useMutation<TechnicianRow, Error, TechnicianUpdate>({
    mutationFn: dbEditTechnician,
    onSuccess: async (result) => {
      console.log("Technician edited successfully:", result);
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
      console.error("Error editing technician:", error.message || error);
    },
  });
}
