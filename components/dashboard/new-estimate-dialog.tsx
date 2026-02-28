"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians";
import { useAddEstimate } from "@/hooks/estimates/useAddEstimate";
import {
  useEstimateFormStore,
  type EstimateFormValues,
} from "@/features/store/estimates/useEstimateFormStore";
import type { Database } from "@/database.types";

const ESTIMATE_STATUSES = ["follow_up", "approved", "denied"] as const;

export function NewEstimateDialog() {
  const {
    form,
    isDialogOpen,
    isSubmitting,
    openDialog,
    closeDialog,
    resetForm,
    setIsSubmitting,
    buildPayload,
  } = useEstimateFormStore();

  const {
    mutate: addEstimate,
    isPending,
    isSuccess,
    isError,
    error,
    reset: resetMutation,
  } = useAddEstimate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EstimateFormValues>({
    defaultValues: form,
  });

  useEffect(() => {
    if (!isDialogOpen) return;
    reset(form);
  }, [isDialogOpen, form, reset]);

  const selectedTechId = watch("technician_id");
  const { data: technicians = [] } = useFetchTechnicians();

  const onSubmit = (data: EstimateFormValues) => {
    setIsSubmitting(true);

    useEstimateFormStore.setState({ form: data });

    addEstimate(buildPayload(), {
      onSuccess: () => {
        setTimeout(() => {
          closeDialog();
          setTimeout(() => {
            resetMutation();
            resetForm();
            reset();
            setIsSubmitting(false);
          }, 300);
        }, 1200);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(newOpen) => {
        if (newOpen) {
          resetMutation();
          openDialog();
        } else {
          closeDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={openDialog}>
          <FileText className="mr-2 h-4 w-4" />
          New Estimate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Estimate</DialogTitle>
          <DialogDescription>
            Create a new estimate for a customer.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Estimate created successfully!
            </p>
          </div>
        ) : isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
            {error?.message ?? "Failed to create estimate."}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
            {/* Date & Technician */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="est-date">Date</Label>
                <Input
                  id="est-date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="est-tech">Technician</Label>
                <Select
                  value={selectedTechId}
                  onValueChange={(v) =>
                    setValue("technician_id", v, { shouldDirty: true })
                  }
                >
                  <SelectTrigger id="est-tech">
                    <SelectValue placeholder="Select tech" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("technician_id", {
                    required: "Select a technician",
                  })}
                />
                {errors.technician_id && (
                  <p className="text-xs text-red-500">
                    {errors.technician_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="est-title">Work Title</Label>
              <Input
                id="est-title"
                placeholder="Inspection and estimate"
                {...register("work_title", {
                  required: "Work title is required",
                })}
              />
              {errors.work_title && (
                <p className="text-xs text-red-500">
                  {errors.work_title.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="est-address">Address</Label>
              <Input
                id="est-address"
                placeholder="123 Main St, Tampa, FL"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="est-description">Description</Label>
              <Textarea
                id="est-description"
                placeholder="Services to be performed..."
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Amount & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="est-amount">Estimated Amount ($)</Label>
                <Input
                  id="est-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("estimated_amount", {
                    required: "Amount is required",
                    min: { value: 0.01, message: "Must be > 0" },
                    valueAsNumber: true,
                  })}
                />
                {errors.estimated_amount && (
                  <p className="text-xs text-red-500">
                    {errors.estimated_amount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="est-status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(v) =>
                    setValue(
                      "status",
                      v as Database["public"]["Enums"]["estimate_status_enum"],
                      { shouldDirty: true },
                    )
                  }
                >
                  <SelectTrigger id="est-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTIMATE_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Handled By */}
            <div className="space-y-2">
              <Label htmlFor="est-handled">Handled By</Label>
              <Input
                id="est-handled"
                placeholder="Office admin or tech name"
                {...register("handled_by")}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="est-notes">Notes</Label>
              <Textarea
                id="est-notes"
                placeholder="Additional details..."
                rows={2}
                {...register("notes")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  closeDialog();
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isSubmitting || !isDirty}
              >
                {isPending || isSubmitting ? "Saving..." : "Save Estimate"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
