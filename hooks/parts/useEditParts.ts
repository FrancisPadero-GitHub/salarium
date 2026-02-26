import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type PartUpdate = Database["public"]["Tables"]["parts"]["Update"];
type Part = Database["public"]["Tables"]["parts"]["Row"];

export interface EditPartInput extends PartUpdate {
  id: string;
}

const dbEditPart = async (data: EditPartInput): Promise<Part> => {
  const { id, ...updates } = data;

  const { data: result, error } = await supabase
    .from("parts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update part");
  }

  return result as Part;
};

export interface UseEditPartOptions {
  onSuccess?: (data: Part) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to edit an existing part
 * @param options - Success/error callbacks
 */
export function useEditPart(options: UseEditPartOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation<Part, Error, EditPartInput>({
    mutationFn: dbEditPart,
    onSuccess: async (result) => {
      // Invalidate all parts queries
      await queryClient.invalidateQueries({
        queryKey: ["parts"],
        exact: false,
      });

      // Also invalidate job financial breakdown since amount might have changed
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "financial-breakdown"],
        exact: false,
      });

      console.log("Part updated successfully:", result);
      onSuccess?.(result);
    },
    onError: (error) => {
      console.error("Error updating part:", error.message || error);
      onError?.(error);
    },
  });
}

/**
 * Hook to edit multiple parts in batch
 */
export function useEditParts(options: UseEditPartOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation<Part[], Error, EditPartInput[]>({
    mutationFn: async (data: EditPartInput[]): Promise<Part[]> => {
      // Supabase doesn't have batch update, so we need to update individually
      const results: Part[] = [];

      for (const item of data) {
        const { id, ...updates } = item;
        const { data: result, error } = await supabase
          .from("parts")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message || `Failed to update part ${id}`);
        }

        results.push(result as Part);
      }

      return results;
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

      console.log("Parts updated successfully:", result);
      onSuccess?.(result[0]); // Call callback with first part for compatibility
    },
    onError: (error) => {
      console.error("Error updating parts:", error.message || error);
      onError?.(error);
    },
  });
}
