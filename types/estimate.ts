export type EstimateStatus = "Pending" | "Approved" | "Rejected" | "Converted";

export interface Estimate {
  id: string;
  date: string; // ISO date string
  address: string;
  technicianId: string;
  technicianName: string;
  description: string;
  estimatedAmount: number;
  status: EstimateStatus;
  /** Set when status === "Converted" */
  convertedJobId?: string;
  notes?: string;
}
