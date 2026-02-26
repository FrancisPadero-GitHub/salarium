import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type PartInsert = Database["public"]["Tables"]["parts"]["Insert"];
type Part = Database["public"]["Tables"]["parts"]["Row"];

const dbAddPart = async (data: PartInsert): Promise<Part> => {
  const { data: result, error } = await supabase
    .from("parts")
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add part");
  }

  return result as Part;
};

export interface UseAddPartOptions {
  onSuccess?: (data: Part) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to add a new part
 * @param options - Success/error callbacks
 */
export function useAddPart(options: UseAddPartOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation<Part, Error, PartInsert>({
    mutationFn: dbAddPart,
    onSuccess: async (result) => {
      // Invalidate all parts queries to refetch
      await queryClient.invalidateQueries({
        queryKey: ["parts"],
        exact: false,
      });

      // Also invalidate job financial breakdown if the amount changed
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "financial-breakdown"],
        exact: false,
      });

      console.log("Part added successfully:", result);
      onSuccess?.(result);
    },
    onError: (error) => {
      console.error("Error adding part:", error.message || error);
      onError?.(error);
    },
  });
}

/**
 * Hook to add multiple parts in batch
 */
export function useAddParts(options: UseAddPartOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation<Part[], Error, PartInsert[]>({
    mutationFn: async (data: PartInsert[]): Promise<Part[]> => {
      const { data: result, error } = await supabase
        .from("parts")
        .insert(data)
        .select();

      if (error) {
        throw new Error(error.message || "Failed to add parts");
      }

      return result as Part[];
    },
    onSuccess: async (result) => {
      // Invalidate all parts queries
      await queryClient.invalidateQueries({
        queryKey: ["parts"],
        exact: false,
      });

      // Also invalidate job financial breakdown
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "financial-breakdown"],
        exact: false,
      });

      console.log("Parts added successfully:", result);
      onSuccess?.(result[0]); // Call callback with first part for compatibility
    },
    onError: (error) => {
      console.error("Error adding parts:", error.message || error);
      onError?.(error);
    },
  });
}
