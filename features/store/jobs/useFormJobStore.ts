import { create } from "zustand";
import type { Database } from "@/database.types";

type WorkOrderInsert = Database["public"]["Tables"]["work_orders"]["Insert"];
type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];

type FormMode = "add" | "edit";

export interface JobFormValues {
  // identity – only populated in edit mode
  work_order_id?: string;
  // work order fields
  work_title: string;
  work_order_date: string;
  technician_id: string;
  address: string;
  category: string;
  description: string;
  notes: string;
  region: string;
  contact_no: string;
  contact_email: string;
  // job fields
  subtotal: number;
  parts_total_cost: number;
  payment_method_id: string;
  /** Name of the payment method – supplied by the view row; used to resolve id on edit */
  payment_method?: string | null;
  status: Database["public"]["Enums"]["job_status_enum"];
  tip_amount: number;
}

interface JobStore {
  form: JobFormValues;
  mode: FormMode;
  isDialogOpen: boolean;
  isSubmitting: boolean;

  setFormField: <K extends keyof JobFormValues>(
    field: K,
    value: JobFormValues[K],
  ) => void;

  openAdd: () => void;
  openAddWithPrefill: (data: Partial<JobFormValues>) => void;
  openEdit: (data: JobFormValues & { work_order_id: string }) => void;
  closeDialog: () => void;
  resetForm: () => void;

  setIsSubmitting: (value: boolean) => void;

  /** Builds the `AddJobPayload` from the current form state */
  buildPayload: () => {
    workOrder: WorkOrderInsert;
    job: Omit<JobInsert, "work_order_id">;
  };
}

const getLocalISOTime = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export const defaultJobForm: JobFormValues = {
  work_order_id: undefined,
  work_title: "",
  work_order_date: getLocalISOTime(),
  technician_id: "",
  address: "",
  category: "",
  description: "",
  notes: "",
  region: "",
  contact_no: "",
  contact_email: "",
  subtotal: 0,
  parts_total_cost: 0,
  payment_method_id: "",
  payment_method: null,
  status: "pending",
  tip_amount: 0,
};

export const useJobStore = create<JobStore>((set, get) => ({
  form: defaultJobForm,
  mode: "add",
  isDialogOpen: false,
  isSubmitting: false,

  setFormField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),

  openAdd: () =>
    set({
      form: defaultJobForm,
      mode: "add",
      isDialogOpen: true,
      isSubmitting: false,
    }),

  openAddWithPrefill: (data) => {
    let localDate = data.work_order_date;
    if (localDate) {
      const d = new Date(localDate);
      if (!isNaN(d.getTime())) {
        localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }
    }
    set({
      form: { ...defaultJobForm, ...data, ...(localDate ? { work_order_date: localDate } : {}), work_order_id: undefined },
      mode: "add",
      isDialogOpen: true,
      isSubmitting: false,
    });
  },

  openEdit: (data) => {
    let localDate = data.work_order_date;
    if (localDate) {
      const d = new Date(localDate);
      if (!isNaN(d.getTime())) {
        localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }
    }
    set({
      form: { ...defaultJobForm, ...data, work_order_date: localDate },
      mode: "edit",
      isDialogOpen: true,
      isSubmitting: false,
    });
  },

  closeDialog: () =>
    set({
      isDialogOpen: false,
    }),

  resetForm: () =>
    set({
      form: defaultJobForm,
      mode: "add",
      isSubmitting: false,
    }),

  setIsSubmitting: (value) => set({ isSubmitting: value }),

  buildPayload: () => {
    const f = get().form;
    const workOrder: WorkOrderInsert = {
      work_title: f.work_title,
      work_order_date: new Date(f.work_order_date).toISOString(),
      technician_id: f.technician_id,
      address: f.address || null,
      category: f.category || null,
      description: f.description || null,
      notes: f.notes || null,
      region: f.region || null,
      contact_no: f.contact_no || null,
      contact_email: f.contact_email || null,
    };
    const job: Omit<JobInsert, "work_order_id"> = {
      subtotal: f.subtotal,
      parts_total_cost: f.parts_total_cost,
      payment_method_id: f.payment_method_id || null,
      status: f.status,
      tip_amount: f.tip_amount,
    };
    return { workOrder, job };
  },
}));
