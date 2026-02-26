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
      console.error("Error editing technician:", error.message || error);
    },
  });
}
