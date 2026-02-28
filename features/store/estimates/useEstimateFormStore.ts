import { create } from "zustand";
import type { Database } from "@/database.types";

type EstimateStatus = Database["public"]["Enums"]["estimate_status_enum"];
type WorkOrderInsert = Database["public"]["Tables"]["work_orders"]["Insert"];
type EstimateInsert = Database["public"]["Tables"]["estimates"]["Insert"];

export interface EstimateFormValues {
  date: string;
  work_title: string;
  address: string;
  technician_id: string;
  description: string;
  estimated_amount: number;
  status: EstimateStatus;
  handled_by: string;
  notes: string;
}

interface EstimateStore {
  form: EstimateFormValues;
  isDialogOpen: boolean;
  isSubmitting: boolean;

  setFormField: <K extends keyof EstimateFormValues>(
    field: K,
    value: EstimateFormValues[K],
  ) => void;

  openDialog: () => void;
  closeDialog: () => void;
  resetForm: () => void;
  setIsSubmitting: (value: boolean) => void;

  buildPayload: () => {
    workOrder: WorkOrderInsert;
    estimate: Omit<EstimateInsert, "work_order_id">;
  };
}

export const defaultEstimateForm: EstimateFormValues = {
  date: new Date().toISOString().slice(0, 10),
  work_title: "",
  address: "",
  technician_id: "",
  description: "",
  estimated_amount: 0,
  status: "follow_up",
  handled_by: "",
  notes: "",
};

export const useEstimateFormStore = create<EstimateStore>((set, get) => ({
  form: defaultEstimateForm,
  isDialogOpen: false,
  isSubmitting: false,

  setFormField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),

  openDialog: () =>
    set({
      form: defaultEstimateForm,
      isDialogOpen: true,
      isSubmitting: false,
    }),

  closeDialog: () =>
    set({
      isDialogOpen: false,
    }),

  resetForm: () =>
    set({
      form: defaultEstimateForm,
      isSubmitting: false,
    }),

  setIsSubmitting: (value) => set({ isSubmitting: value }),

  buildPayload: () => {
    const form = get().form;

    const workOrder: WorkOrderInsert = {
      work_title: form.work_title,
      work_order_date: form.date,
      technician_id: form.technician_id,
      address: form.address || null,
      description: form.description || null,
      notes: form.notes || null,
      category: null,
      region: null,
    };

    const estimate: Omit<EstimateInsert, "work_order_id"> = {
      estimated_amount: Number(form.estimated_amount),
      status: form.status,
      handled_by: form.handled_by || null,
    };

    return { workOrder, estimate };
  },
}));
