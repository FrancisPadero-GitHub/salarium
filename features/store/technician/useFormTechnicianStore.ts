import { create } from "zustand";
import type { Database } from "@/database.types";

type TechnicianInsert = Database["public"]["Tables"]["technicians"]["Insert"];
type TechnicianRow = Database["public"]["Tables"]["technicians"]["Row"];

type FormMode = "add" | "edit";

interface TechnicianStore {
  form: TechnicianInsert;
  mode: FormMode;
  isDialogOpen: boolean;
  isSubmitting: boolean;

  setFormField: <K extends keyof TechnicianInsert>(
    field: K,
    value: TechnicianInsert[K],
  ) => void;

  openAdd: () => void;
  openEdit: (data: TechnicianRow) => void;
  closeDialog: () => void;
  resetForm: () => void;

  setIsSubmitting: (value: boolean) => void;
}

const defaultForm: TechnicianInsert = {
  name: "",
  email: "",
  phone: "",
  default_commission_rate: 0.0,
  hired_date: new Date().toISOString().slice(0, 10),
};

export const useTechnicianStore = create<TechnicianStore>((set) => ({
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
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        default_commission_rate: data.default_commission_rate,
        hired_date: data.hired_date,
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
