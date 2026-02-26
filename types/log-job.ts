import type { Database } from "@/database.types";

export type PaymentMode = Database["public"]["Enums"]["payment_mode_enum"];

export interface JobFormValues {
  job_date: string;
  job_name: string;
  category: string;
  description: string;
  address: string;
  region: string;
  technician_id: string;
  parts_total_cost: string;
  subtotal: string;
  tip_amount: string;
  cash_on_hand: string;
  payment_mode: PaymentMode;
  status: string;
  notes: string;
}

export const DEFAULT_VALUES: JobFormValues = {
  job_date: new Date().toISOString().slice(0, 10),
  job_name: "",
  category: "",
  description: "",
  address: "",
  region: "",
  technician_id: "",
  parts_total_cost: "0",
  subtotal: "0",
  tip_amount: "0",
  cash_on_hand: "0",
  payment_mode: "credit card",
  status: "done",
  notes: "",
};

export const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
