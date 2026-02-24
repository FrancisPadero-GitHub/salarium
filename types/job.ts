export type PaymentMethod = "Cash" | "Check" | "Credit Card" | "Zelle";

export type JobStatus = "Done" | "Cancelled" | "Pending";

export interface Job {
  id: string;
  date: string; // ISO date string
  address: string;
  technicianId: string;
  technicianName: string;
  parts: number;
  tips: number;
  subtotal: number;
  /** Computed: subtotal + parts + tips */
  gross: number;
  /** Commission earned by the technician (gross * commissionRate) */
  commissionAmount: number;
  commissionRate: number;
  /** Net to the business after commission */
  net: number;
  paymentMethod: PaymentMethod;
  status: JobStatus;
  /** True if a review was requested from the customer */
  review?: boolean;
  notes?: string;
}
