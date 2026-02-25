import { create } from "zustand";
import type { Database } from "@/database.types";

export type TechnicianFormState =
  Database["public"]["Tables"]["technicians"]["Insert"];

interface AddTechnicianStore {
  form: TechnicianFormState;
  isDialogOpen: boolean;
  isSubmitting: boolean;

  // Form actions
  setFormField: <K extends keyof TechnicianFormState>(
    field: K,
    value: TechnicianFormState[K],
  ) => void;
  resetForm: () => void;
  setForm: (form: TechnicianFormState) => void;

  // Dialog actions
  openDialog: () => void;
  closeDialog: () => void;

  // Submission state
  setIsSubmitting: (submitting: boolean) => void;
}

const defaultForm: TechnicianFormState = {
  name: "",
  email: "",
  phone: "",
  default_commission_rate: 0.75,
  hired_date: new Date().toISOString().slice(0, 10),
};

export const useAddTechnicianStore = create<AddTechnicianStore>((set) => ({
  form: defaultForm,
  isDialogOpen: false,
  isSubmitting: false,

  setFormField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
    })),

  resetForm: () =>
    set({
      form: defaultForm,
      isSubmitting: false,
    }),

  setForm: (form) => set({ form }),

  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),

  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
}));
