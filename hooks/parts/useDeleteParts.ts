import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type Part = Database["public"]["Tables"]["parts"]["Row"];

interface DeletePartInput {
  id: string;
  softDelete?: boolean; // If true, sets deleted_at; if false, hard deletes
}

const dbDeletePart = async (data: DeletePartInput): Promise<void> => {
  const { id, softDelete = true } = data;

  if (softDelete) {
    // Soft delete: set deleted_at timestamp
    const { error } = await supabase
      .from("parts")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message || "Failed to delete part");
    }
  } else {
    // Hard delete: permanently remove
    const { error } = await supabase.from("parts").delete().eq("id", id);

    if (error) {
      throw new Error(error.message || "Failed to delete part");
    }
  }
};

export interface UseDeletePartOptions {
  onSuccess?: (id: string) => void;
  onError?: (error: Error) => void;
  softDelete?: boolean; // Default: true
}

/**
 * Hook to delete a part
 * @param options - Success/error callbacks and deletion type
 */
export function useDeletePart(options: UseDeletePartOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError, softDelete = true } = options;

  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      dbDeletePart({
        id,
        softDelete,
      }),
    onSuccess: async (_, partId) => {
      // Invalidate all parts queries
      await queryClient.invalidateQueries({
        queryKey: ["parts"],
        exact: false,
      });

      // Also invalidate job financial breakdown since amount changed
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "financial-breakdown"],
        exact: false,
      });

      console.log(`Part ${softDelete ? "soft" : "hard"} deleted:`, partId);
      onSuccess?.(partId);
    },
    onError: (error) => {
      console.error("Error deleting part:", error.message || error);
      onError?.(error);
    },
  });
}

/**
 * Hook to delete multiple parts in batch
 */
export function useDeleteParts(options: UseDeletePartOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError, softDelete = true } = options;

  return useMutation<void, Error, string[]>({
    mutationFn: async (ids: string[]): Promise<void> => {
      for (const id of ids) {
        await dbDeletePart({
          id,
          softDelete,
        });
      }
    },
    onSuccess: async (_, partIds) => {
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

      console.log(
        `${partIds.length} parts ${softDelete ? "soft" : "hard"} deleted`,
      );
      onSuccess?.(partIds[0]); // Call callback with first ID for compatibility
    },
    onError: (error) => {
      console.error("Error deleting parts:", error.message || error);
      onError?.(error);
    },
  });
}
