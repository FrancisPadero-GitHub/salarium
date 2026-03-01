import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type TechnicianInsert = Database["public"]["Tables"]["technicians"]["Insert"];
type TechnicianRow = Database["public"]["Tables"]["technicians"]["Row"];

const dbAddTechnician = async (data: TechnicianInsert) => {
  const { data: result, error } = await supabase
    .from("technicians")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add technician");
  }

  return result as TechnicianRow;
};

export function useAddTechnician() {
  const queryClient = useQueryClient();
  return useMutation<TechnicianRow, Error, TechnicianInsert>({
    mutationFn: dbAddTechnician,
    onSuccess: async (result) => {
      console.log("Technician added successfully:", result);
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
      console.error("Error adding technician:", error.message || error);
    },
  });
}
