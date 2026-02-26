"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// data
import { countryCodes } from "@/data/country-code";

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
    formState: { errors },
  } = useForm<TechnicianFormValues & { country_code?: string }>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country_code: "+63",
      default_commission_rate: 0.75,
      hired_date: new Date().toISOString().slice(0, 10),
    },
  });

  const default_commision_rate = watch("default_commission_rate");

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
      default_commission_rate: form.default_commission_rate ?? 0.75,
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

  const commisionDropdown = [
    { value: "0.75", label: "75% - Own Technician" },
    { value: "0.5", label: "50% - Sub Contractor" },
    { value: "1", label: "100% - Full Commission" },
  ];

  return (
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
            {isSuccess
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
            {isSuccess
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
            {isEdit
              ? "technician details."
              : "a new technician or sub-contractor."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
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
              <div className="space-y-2">
                <Label htmlFor="tech-commission">Commission Rate</Label>
                <Select
                  value={default_commision_rate?.toString() ?? "0"} // somehow this needs to be string for the select component to work
                  onValueChange={
                    (value) =>
                      setValue("default_commission_rate", parseFloat(value)) // value here needs to be converted to string as it was being converted first
                  }
                  disabled={isPending}
                >
                  <SelectTrigger id="tech-commission">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commisionDropdown.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Business keeps{" "}
                  {Math.round(
                    (1 -
                      parseFloat(default_commision_rate?.toString() ?? "0")) *
                      100,
                  )}
                  %
                </p>
              </div>
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

            <DialogFooter>
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
                disabled={isSubmitting || isPending || isSuccess}
              >
                {isSubmitting || isPending
                  ? isEdit
                    ? "Saving..."
                    : "Adding..."
                  : isEdit
                    ? "Save Changes"
                    : "Add Technician"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
