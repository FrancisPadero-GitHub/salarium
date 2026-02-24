export type PaymentMethod = "Cash" | "Check" | "Credit Card" | "Zelle";

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
  notes?: string;
}
