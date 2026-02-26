import { create } from "zustand";
import type { Database } from "@/database.types";

type JobsInsert = Database["public"]["Tables"]["jobs"]["Insert"];
type PaymentMode = Database["public"]["Enums"]["payment_mode_enum"];

type FormMode = "add" | "edit";

// Flexible payload type that works with both the jobs table row and view rows
export type JobEditPayload = {
  id?: string | null;
  job_name?: string | null;
  description?: string | null;
  job_date?: string | null;
  technician_id?: string | null;
  category?: string | null;
  address?: string | null;
  region?: string | null;
  payment_mode?: PaymentMode | null;
  cash_on_hand?: number | null;
  parts_total_cost?: number | null;
  subtotal?: number | null;
  tip_amount?: number | null;
  notes?: string | null;
  status?: string | null;
};

interface JobsStore {
  form: JobsInsert;
  mode: FormMode;
  isDialogOpen: boolean;
  isSubmitting: boolean;

  setFormField: <K extends keyof JobsInsert>(
    field: K,
    value: JobsInsert[K],
  ) => void;

  openAdd: () => void;
  openEdit: (data: JobEditPayload) => void;
  closeDialog: () => void;
  resetForm: () => void;

  setIsSubmitting: (value: boolean) => void;
}

const defaultForm: JobsInsert = {
  address: "",
  cash_on_hand: 0,
  category: "",
  description: "",
  job_date: "",
  job_name: "",
  notes: "",
  parts_total_cost: undefined,
  payment_mode: "" as PaymentMode | undefined,
  region: "",
  status: undefined,
  subtotal: 0,
  technician_id: "",
  tip_amount: undefined,
  total_amount: undefined,
};

export const useJobsStore = create<JobsStore>((set) => ({
  form: defaultForm,
  mode: "add",
  isDialogOpen: false,
  isSubmitting: false,

  setFormField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),

  openAdd: () =>
    set({
      form: defaultForm,
      mode: "add",
      isDialogOpen: true,
      isSubmitting: false,
    }),

  openEdit: (data) =>
    set({
      form: {
        id: data.id ?? undefined,
        job_name: data.job_name,
        description: data.description,
        job_date: data.job_date ?? "",
        technician_id: data.technician_id,
        category: data.category,
        address: data.address,
        region: data.region,
        payment_mode: data.payment_mode,
        cash_on_hand: data.cash_on_hand ?? 0,
        parts_total_cost: data.parts_total_cost ?? 0,
        subtotal: data.subtotal ?? 0,
        tip_amount: data.tip_amount ?? 0,
        notes: data.notes,
        status: data.status ?? "done",
      },
      mode: "edit",
      isDialogOpen: true,
      isSubmitting: false,
    }),

  closeDialog: () =>
    set({
      isDialogOpen: false,
    }),

  resetForm: () =>
    set({
      form: defaultForm,
      mode: "add",
      isSubmitting: false,
    }),

  setIsSubmitting: (value) => set({ isSubmitting: value }),
}));
