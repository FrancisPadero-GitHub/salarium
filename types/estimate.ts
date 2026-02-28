import type { Database } from "@/database.types";

export type EstimateStatus =
  Database["public"]["Enums"]["estimate_status_enum"];

export type EstimateRow = Database["public"]["Views"]["v_estimates"]["Row"];

/**
 * Local display type for static/legacy estimate data.
 * DB enum values: "approved" | "denied" | "follow_up"
 */
export interface Estimate {
  id: string;
  date: string;
  address: string;
  technicianId: string;
  technicianName: string;
  description: string;
  estimatedAmount: number;
  status: EstimateStatus;
  /** Admin or office person who handled the estimate */
  handledBy?: string;
  notes?: string;
}
