/**
 * NOTE: The parts table has been removed from the database schema.
 * Part costs are now tracked as `parts_total_cost` on the jobs table.
 * These types are retained as stubs for backward compatibility.
 */

export interface Part {
  id: string;
  name: string;
  unit_cost: number;
  quantity: number;
  amount: number;
  job_id: string;
  created_at: string;
  deleted_at: string | null;
}

export type PartInsert = Omit<
  Part,
  "id" | "amount" | "created_at" | "deleted_at"
>;
export type PartUpdate = Partial<PartInsert>;

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
