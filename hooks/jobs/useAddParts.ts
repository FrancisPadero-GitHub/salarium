import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type PartsInsert = Database["public"]["Tables"]["parts"]["Insert"];
type PartsRow = Database["public"]["Tables"]["parts"]["Row"];

const dbAddParts = async (data: PartsInsert) => {
  const { data: result, error } = await supabase
    .from("parts")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add parts");
  }

  return result as PartsRow;
};

export function useAddParts() {
  const queryClient = useQueryClient();
  return useMutation<PartsRow, Error, PartsInsert>({
    mutationFn: dbAddParts,
    onSuccess: async (result) => {
      console.log("Parts added successfully:", result);
      queryClient.invalidateQueries({
        queryKey: ["parts"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("Error adding parts:", error.message || error);
    },
  });
}
