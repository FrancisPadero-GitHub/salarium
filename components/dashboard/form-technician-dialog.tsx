"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Users, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zustand store
import { useTechnicianStore } from "@/features/store/technician/useFormTechnicianStore";

// Db types from supabase generted types
import type { Database } from "@/database.types";

// Hooks
import { useAddTechnician } from "@/hooks/technicians/useAddTechnician";
import { useEditTechnician } from "@/hooks/technicians/useEditTechnician";
import { useDelTechnician } from "@/hooks/technicians/useDelTechnicians";

// data
import { countryCodes } from "@/data/country-code";
import { Area } from "recharts";

type TechnicianFormValues =
  Database["public"]["Tables"]["technicians"]["Insert"];

export function AddTechnicianDialog() {
  // Zustand store
  const {
    form,
    mode,
    isDialogOpen,
    isSubmitting,
    openAdd,
    resetForm,
    closeDialog,
    setIsSubmitting,
  } = useTechnicianStore();

  // TanStack Query mutations
  const {
    mutate: addTechnician,
    error: addError,
    isError: isAddError,
    isPending: isAddPending,
    isSuccess: isAddSuccess,
    reset: resetAddMutation,
  } = useAddTechnician();

  const {
    mutate: editTechnician,
    error: editError,
    isError: isEditError,
    isPending: isEditPending,
    isSuccess: isEditSuccess,
    reset: resetEditMutation,
  } = useEditTechnician();

  const {
    mutate: deleteTechnician,
    isPending: isDeletePending,
    isSuccess: isDeleteSuccess,
  } = useDelTechnician();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const isEdit = mode === "edit";
  const error = isEdit ? editError : addError;
  const isError = isEdit ? isEditError : isAddError;
  const isPending = isEdit ? isEditPending : isAddPending;
  const isSuccess = isEdit ? isEditSuccess : isAddSuccess;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,

    formState: { errors, isDirty },
  } = useForm<TechnicianFormValues & { country_code?: string }>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country_code: "+63",
      default_commission_rate: 0,
      hired_date: new Date().toISOString().slice(0, 10),
    },
  });

  const default_commission_rate = watch("default_commission_rate");

  // When the dialog opens, reset form with the current store values
  useEffect(() => {
    if (!isDialogOpen) return;

    const phone = form.phone ?? "";
    const matchedCountry = countryCodes.find((c) => phone.startsWith(c.value));
    const countryCode = matchedCountry?.value ?? "+63";
    const phoneNum = matchedCountry ? phone.slice(countryCode.length) : phone;

    reset({
      name: form.name ?? "",
      email: form.email ?? "",
      phone: phoneNum,
      country_code: countryCode,
      default_commission_rate: form.default_commission_rate ?? 0,
      hired_date: form.hired_date ?? new Date().toISOString().slice(0, 10),
      id: form.id,
    });
  }, [isDialogOpen]);

  const onSubmit = (data: TechnicianFormValues & { country_code?: string }) => {
    const { id, created_at, country_code, ...rest } = data;

    // Prepend country code to phone number if provided, otherwise default to +63 for Philippines
    const fullPhone = `${country_code ?? "+63"}${rest.phone ?? ""}`;
    const payload = { ...rest, phone: fullPhone };

    setIsSubmitting(true);

    if (isEdit) {
      editTechnician(
        { ...payload, id: form.id },
        {
          onSuccess: () => {
            setTimeout(() => {
              closeDialog();
              setTimeout(() => {
                resetEditMutation?.();
                resetForm();
                reset();
                setIsSubmitting(false);
              }, 300);
            }, 1500);
          },
          onError: (err) => {
            console.error("Error editing technician:", err);
            setIsSubmitting(false);
          },
        },
      );
    } else {
      addTechnician(payload, {
        onSuccess: () => {
          setTimeout(() => {
            closeDialog();
            setTimeout(() => {
              resetAddMutation?.();
              resetForm();
              reset();
              setIsSubmitting(false);
            }, 300);
          }, 1500);
        },
        onError: (err) => {
          console.error("Error adding technician:", err);
          setIsSubmitting(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!form.id) return;
    deleteTechnician(form.id as string, {
      onSuccess: () => {
        setIsConfirmDeleteOpen(false);
        setTimeout(() => {
          closeDialog();
          setTimeout(() => {
            resetForm();
            reset();
          }, 300);
        }, 2000);
      },
    });
  };

  return (
    <>
    <Dialog
      open={isDialogOpen}
      onOpenChange={(newOpen) => {
        if (newOpen) {
          resetAddMutation?.();
          resetEditMutation?.();
          openAdd();
        } else {
          closeDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={openAdd}>
          <Users className="mr-2 h-4 w-4" />
          Add Technician
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isDeleteSuccess
              ? "Technician Hidden"
              : isSuccess
                ? isEdit
                  ? "Technician Updated!"
                  : "Technician Added!"
                : isError
                  ? isEdit
                    ? "Error Updating Technician"
                    : "Error Adding Technician"
                  : isEdit
                    ? "Edit Technician"
                    : "Add New Technician"}
          </DialogTitle>
          <DialogDescription>
            {isDeleteSuccess
              ? "The technician has been hidden from all views."
              : isSuccess
                ? isEdit
                  ? "Updated"
                  : "Registered"
                : isError
                  ? isEdit
                    ? "Error updating technician"
                    : "Error registering technician"
                  : isEdit
                    ? "Update"
                    : "Register"}{" "}
            {!isDeleteSuccess &&
              (isEdit
                ? "technician details."
                : "a new technician or sub-contractor.")}
          </DialogDescription>
        </DialogHeader>

        {isDeleteSuccess ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
              <Trash2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Technician hidden successfully.
            </p>
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
              They have been removed from all views and reports but their data
              remains in the database.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {isEdit
                ? "Technician updated successfully!"
                : "Technician added successfully!"}
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Something went wrong: {error?.message || "Unknown error"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="tech-name">Name</Label>
              <Input
                id="tech-name"
                placeholder="Full name"
                disabled={isPending}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tech-email">Email</Label>
                <Input
                  id="tech-email"
                  type="email"
                  placeholder="tech@example.com"
                  disabled={isPending}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-phone">Phone</Label>
                <div className="flex-row space-y-2 ">
                  <Select
                    value={watch("country_code") ?? "+63"}
                    onValueChange={(value) =>
                      setValue("country_code" as any, value)
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger id="tech-country" className="w-full">
                      <SelectValue className="sr-only" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <div className="flex gap-2 items-center">
                      <span className="text-md text-zinc-500 dark:text-zinc-400">
                        {watch("country_code") ?? "+63"}
                      </span>

                      <Input
                        id="tech-phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="912 345 6789"
                        disabled={isPending}
                        className="flex-1"
                        {...register("phone", {
                          required: "Phone is required",
                          pattern: {
                            value: /^[0-9 ]+$/,
                            message: "Only numbers and spaces allowed",
                          },
                          minLength: {
                            value: 7,
                            message: "Phone must be at least 7 characters",
                          },
                          maxLength: {
                            value: 15,
                            message: "Phone must be no more than 15 characters",
                          },
                        })}
                      />
                    </div>
                  </Select>
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Commission Rate & Hire Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* commission rate */}
              <div className="space-y-2">
                <Label htmlFor="tech-commission">Commission Rate %</Label>
                <Input
                  id="tech-commission"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="100"
                  placeholder="e.g. 75"
                  disabled={isPending}
                  {...register("default_commission_rate", {
                    required: "Commission rate is required",
                    min: {
                      value: 0,
                      message: "Commission rate must be at least 0",
                    },
                    max: {
                      value: 100,
                      message: "Commission rate must be no more than 100",
                    },
                  })}
                />
                {errors.default_commission_rate && (
                  <p className="text-xs text-red-500">
                    {errors.default_commission_rate.message}
                  </p>
                )}
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Business keeps{" "}
                  {(() => {
                    const result = Math.round(
                      100 -
                        parseFloat(default_commission_rate?.toString() ?? "0"),
                    );
                    return isNaN(result) ? "" : `${result}%`;
                  })()}
                </p>
              </div>

              {/* Hire Date */}
              <div className="space-y-2">
                <Label htmlFor="tech-hired">Hire Date</Label>
                <Input
                  id="tech-hired"
                  type="date"
                  disabled={isPending}
                  {...register("hired_date", {
                    required: "Hire date is required",
                  })}
                />
                {errors.hired_date && (
                  <p className="text-xs text-red-500">
                    {errors.hired_date.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex-row items-center justify-between sm:justify-between">
              {isEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSubmitting || isPending || isDeletePending}
                  onClick={() => setIsConfirmDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || isPending}
                  onClick={() => {
                    closeDialog();
                    resetForm();
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isPending || isSuccess || !isDirty}
                >
                  {isSubmitting || isPending
                    ? isEdit
                      ? "Saving..."
                      : "Adding..."
                    : isEdit
                      ? "Save Changes"
                      : "Add Technician"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>

    <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hide this technician?</AlertDialogTitle>
          <AlertDialogDescription>
            This technician will be hidden from all views and reports but{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              not permanently deleted
            </span>
            . Their data will remain in the database and can be restored if
            needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeletePending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeletePending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isDeletePending ? "Hiding..." : "Yes, hide technician"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
