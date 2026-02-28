import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PartInsert, Part } from "@/types/parts";

/**
 * NOTE: The parts table has been removed from the database schema.
 * These hooks are retained as stubs. Parts costs are now tracked
 * as parts_total_cost on the jobs table.
 */

export interface UseAddPartOptions {
  onSuccess?: (data: Part) => void;
  onError?: (error: Error) => void;
}

export function useAddPart(options: UseAddPartOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation<Part, Error, PartInsert>({
    mutationFn: async () => {
      throw new Error("Parts table has been removed from the database schema");
    },
  });
}

export function useAddParts(options: UseAddPartOptions = {}) {
  const queryClient = useQueryClient();
  return useMutation<Part[], Error, PartInsert[]>({
    mutationFn: async () => {
      throw new Error("Parts table has been removed from the database schema");
    },
  });
}
