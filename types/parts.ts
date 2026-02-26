import type { Database } from "@/database.types";

export type Part = Database["public"]["Tables"]["parts"]["Row"];
export type PartInsert = Database["public"]["Tables"]["parts"]["Insert"];
export type PartUpdate = Database["public"]["Tables"]["parts"]["Update"];

/**
 * Part with computed amount (unit_cost * quantity)
 * The database generates this automatically
 */
export interface PartWithAmount extends Part {
  amount: number;
}

/**
 * Options for fetching parts
 */
export interface FetchPartsOptions {
  jobId?: string;
  includeDeleted?: boolean;
}

/**
 * Edit part input including the part ID
 */
export interface EditPartInput extends PartUpdate {
  id: string;
}

/**
 * Delete part options
 */
export interface DeletePartInput {
  id: string;
  softDelete?: boolean;
}
