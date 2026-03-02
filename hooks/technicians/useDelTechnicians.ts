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

const dbRestoreTechnician = async (id: string) => {
  const { data: result, error } = await supabase
    .from("technicians")
    .update({ deleted_at: null })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to restore technician");
  }

  return result as TechnicianRow;
};

const invalidateTechnicianRelatedQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
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
};

export function useDelTechnician() {
  const queryClient = useQueryClient();
  return useMutation<TechnicianRow, Error, string>({
    mutationFn: dbSoftDeleteTechnician,
    onSuccess: async (result) => {
      console.log("Technician soft-deleted successfully:", result);
      await invalidateTechnicianRelatedQueries(queryClient);
    },
    onError: (error) => {
      console.error("Error deleting technician:", error.message || error);
    },
  });
}

export function useRestoreTechnician() {
  const queryClient = useQueryClient();
  return useMutation<TechnicianRow, Error, string>({
    mutationFn: dbRestoreTechnician,
    onSuccess: async (result) => {
      console.log("Technician restored successfully:", result);
      await invalidateTechnicianRelatedQueries(queryClient);
    },
    onError: (error) => {
      console.error("Error restoring technician:", error.message || error);
    },
  });
}
