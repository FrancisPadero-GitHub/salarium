"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Briefcase, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Spinner } from "@/components/ui/spinner";

// hooks
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians";
import { useFetchPaymentMethods } from "@/hooks/payment-methods/useFetchPaymentMethods";
import { useAddJob, type AddJobPayload } from "@/hooks/jobs/useAddJobs";
import { useEditJob, type EditJobPayload } from "@/hooks/jobs/useEditJob";
import { useDelJob } from "@/hooks/jobs/useDelJob";

// zustand
import { useJobsStore, type FormJobState } from "@/features/store/jobs/useFormJobStore";

// types
import { DEFAULT_VALUES, type JobFormValues } from "@/types/log-job";

export function LogJobDialog() {
  const {
    form: storeForm,
    mode,
    isDialogOpen,
    isSubmitting,
    openAdd,
    closeDialog,
    resetForm,
    setIsSubmitting,
  } = useJobsStore();

  const isEdit = mode === "edit";
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const {
    mutateAsync: addJobAsync,
    isError: isAddError,
    isSuccess: isAddSuccess,
    error: addError,
    reset: resetAddJobMutation,
  } = useAddJob();

  const {
    mutateAsync: editJobAsync,
    isError: isEditError,
    isSuccess: isEditSuccess,
    error: editError,
    reset: resetEditJobMutation,
  } = useEditJob();

  const {
    mutate: softDeleteJob,
    isPending: isDeletePending,
    isSuccess: isDeleteSuccess,
    reset: resetDeleteJobMutation,
  } = useDelJob();

  const isJobError = isEdit ? isEditError : isAddError;
  const isJobSuccess = isEdit ? isEditSuccess : isAddSuccess;
  const jobError = isEdit ? editError : addError;

  const { data: technicians = [], isLoading: techLoading } = useFetchTechnicians();
  const { data: paymentMethods = [], isLoading: paymentLoading } = useFetchPaymentMethods();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, touchedFields },
  } = useForm<JobFormValues>({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (!isDialogOpen) return;
    if (isEdit) {
      reset({
        work_order_date:
          storeForm.work_order_date ?? new Date().toISOString().slice(0, 10),
        work_title: storeForm.work_title ?? "",
        category: storeForm.category ?? "",
        description: storeForm.description ?? "",
        address: storeForm.address ?? "",
        region: storeForm.region ?? "",
        technician_id: storeForm.technician_id ?? "",
        parts_total_cost: String(storeForm.parts_total_cost ?? 0),
        subtotal: String(storeForm.subtotal ?? 0),
        tip_amount: String(storeForm.tip_amount ?? 0),
        payment_method_id: storeForm.payment_method_id ?? "",
        status: storeForm.status ?? "done",
        notes: storeForm.notes ?? "",
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isDialogOpen, isEdit, storeForm, reset]);

  const selectedTechId = watch("technician_id");
  const subtotalVal = parseFloat(watch("subtotal") || "0");
  const tipVal = parseFloat(watch("tip_amount") || "0");
  const partsTotal = parseFloat(watch("parts_total_cost") || "0");

  // Calculate financials
  const gross = subtotalVal;
  const netRevenue = gross - partsTotal;
  const tech = technicians.find((t) => t.technician_id === selectedTechId);
  const commissionRate = tech?.commission ?? 0;
  const commissionAmount = netRevenue * (commissionRate / 100);
  const companyNet = netRevenue - commissionAmount;
  const totalCollected = subtotalVal + tipVal;

  const handleDelete = () => {
    if (!storeForm.work_order_id) return;
    softDeleteJob(storeForm.work_order_id as string, {
      onSuccess: () => {
        setIsConfirmDeleteOpen(false);
        setTimeout(() => {
          closeDialog();
          setTimeout(() => {
            resetDeleteJobMutation?.();
            resetForm();
            reset(DEFAULT_VALUES);
          }, 300);
        }, 1500);
      },
    });
  };

  const resetAll = () => {
    resetAddJobMutation?.();
    resetEditJobMutation?.();
    resetForm();
    reset(DEFAULT_VALUES);
    setIsSubmitting(false);
  };

  const onSubmit = async (data: JobFormValues) => {
    const parts_total_cost = parseFloat(data.parts_total_cost) || 0;
    const subtotal = parseFloat(data.subtotal) || 0;
    const tip_amount = parseFloat(data.tip_amount) || 0;

    setIsSubmitting(true);

    try {
      if (isEdit) {
        const payload: EditJobPayload = {
          workOrderId: storeForm.work_order_id as string,
          workOrder: {
            work_order_date: data.work_order_date,
            work_title: data.work_title || null,
            category: data.category || null,
            description: data.description || null,
            address: data.address || null,
            region: data.region || null,
            technician_id: data.technician_id || null,
            notes: data.notes || null,
          },
          job: {
            parts_total_cost,
            subtotal,
            tip_amount,
            payment_method_id: data.payment_method_id || null,
            status: data.status as "pending" | "done" | "cancelled",
          },
        };
        await editJobAsync(payload);
      } else {
        const payload: AddJobPayload = {
          workOrder: {
            work_order_date: data.work_order_date,
            work_title: data.work_title || null,
            category: data.category || null,
            description: data.description || null,
            address: data.address || null,
            region: data.region || null,
            technician_id: data.technician_id || null,
            notes: data.notes || null,
          },
          job: {
            parts_total_cost,
            subtotal,
            tip_amount,
            payment_method_id: data.payment_method_id || null,
            status: data.status as "pending" | "done" | "cancelled",
          },
        };
        await addJobAsync(payload);
      }

      setTimeout(() => {
        closeDialog();
        setTimeout(resetAll, 300);
      }, 1500);
    } catch (err) {
      console.error("Error logging job:", err);
      setIsSubmitting(false);
    }
  };

  const showFeedback = isDeleteSuccess || isJobSuccess || isJobError;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(newOpen) => {
          if (newOpen) {
            resetAddJobMutation?.();
            resetEditJobMutation?.();
            openAdd();
          } else {
            closeDialog();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={openAdd}>
            <Briefcase className="mr-2 h-4 w-4" />
            Log Job
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {isDeleteSuccess
                ? "Job Removed"
                : isJobSuccess
                  ? isEdit
                    ? "Job Updated!"
                    : "Job Logged!"
                  : isJobError
                    ? isEdit
                      ? "Error Updating Job"
                      : "Error Logging Job"
                    : isEdit
                      ? "Edit Job"
                      : "Log New Job"}
            </DialogTitle>
            <DialogDescription>
              {isDeleteSuccess
                ? "The job has been removed from all views."
                : isJobSuccess
                  ? isEdit
                    ? "Job has been updated successfully."
                    : "Job has been recorded successfully."
                  : isJobError
                    ? `Something went wrong: ${jobError?.message || "Unknown error"}`
                    : isEdit
                      ? "Update the details for this job."
                      : "Record a completed or pending job for a technician."}
            </DialogDescription>
          </DialogHeader>

          {showFeedback ? (
            <div className="py-8 text-center">
              {isJobSuccess && (
                <div className="text-sm text-emerald-600 dark:text-emerald-400">✓ Success</div>
              )}
              {isDeleteSuccess && (
                <div className="text-sm text-emerald-600 dark:text-emerald-400">✓ Job deleted</div>
              )}
              {isJobError && (
                <div className="text-sm text-red-600 dark:text-red-400">✗ Error: {jobError?.message}</div>
              )}
              <Spinner className="mx-auto mt-4" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid">
              <div className="overflow-y-auto max-h-[75vh] space-y-4 py-2 px-2">
                {/* Basic Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work_order_date">Date *</Label>
                    <Input
                      id="work_order_date"
                      type="date"
                      disabled={isSubmitting}
                      {...register("work_order_date", { required: "Date is required" })}
                    />
                    {errors.work_order_date && (
                      <p className="text-xs text-red-600">{errors.work_order_date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technician_id">Technician</Label>
                    <Select
                      value={watch("technician_id")}
                      onValueChange={(v) => setValue("technician_id", v, { shouldDirty: true })}
                      disabled={isSubmitting || techLoading}
                    >
                      <SelectTrigger id="technician_id">
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((t) => (
                          <SelectItem key={t.technician_id} value={t.technician_id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_title">Job Title *</Label>
                  <Input
                    id="work_title"
                    placeholder="e.g., Heating System Repair"
                    disabled={isSubmitting}
                    {...register("work_title", { required: "Job title is required" })}
                  />
                  {errors.work_title && (
                    <p className="text-xs text-red-600">{errors.work_title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., HVAC"
                      disabled={isSubmitting}
                      {...register("category")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(v) => setValue("status", v as any, { shouldDirty: true })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Service description..."
                    rows={2}
                    disabled={isSubmitting}
                    {...register("description")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      disabled={isSubmitting}
                      {...register("address")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      placeholder="City/Region"
                      disabled={isSubmitting}
                      {...register("region")}
                    />
                  </div>
                </div>

                {/* Financial Fields */}
                <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                  <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Financials
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="subtotal">Subtotal *</Label>
                      <Input
                        id="subtotal"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={isSubmitting}
                        {...register("subtotal", { required: "Subtotal is required" })}
                      />
                      {errors.subtotal && (
                        <p className="text-xs text-red-600">{errors.subtotal.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parts_total_cost">Parts Cost</Label>
                      <Input
                        id="parts_total_cost"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={isSubmitting}
                        {...register("parts_total_cost")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tip_amount">Tip</Label>
                      <Input
                        id="tip_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={isSubmitting}
                        {...register("tip_amount")}
                      />
                    </div>
                  </div>

                  {(touchedFields.parts_total_cost || touchedFields.subtotal) &&
                    partsTotal > subtotalVal && (
                      <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        ⚠ Parts cost (${partsTotal.toFixed(2)}) exceeds the job subtotal ($
                        {subtotalVal.toFixed(2)}). This will result in a negative net revenue.
                      </p>
                    )}

                  <div className="mt-3 space-y-2 rounded-md bg-zinc-50 p-3 dark:bg-zinc-800/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Gross Revenue:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {fmt(gross)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Net Revenue:</span>
                      <span
                        className={
                          netRevenue < 0
                            ? "font-medium text-red-600 dark:text-red-400"
                            : "font-medium text-zinc-900 dark:text-zinc-50"
                        }
                      >
                        {fmt(netRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Tech Commission ({commissionRate}%):
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {fmt(commissionAmount)}
                      </span>
                    </div>
                    <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-900 dark:text-zinc-50">Company Net:</span>
                        <span
                          className={
                            companyNet < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }
                        >
                          {fmt(companyNet)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label htmlFor="payment_method_id">Payment Method</Label>
                    <Select
                      value={watch("payment_method_id")}
                      onValueChange={(v) =>
                        setValue("payment_method_id", v, { shouldDirty: true })
                      }
                      disabled={isSubmitting || paymentLoading}
                    >
                      <SelectTrigger id="payment_method_id">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((pm) => (
                          <SelectItem key={pm.id} value={pm.id}>
                            {pm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Service details, observations..."
                    rows={2}
                    disabled={isSubmitting}
                    {...register("notes")}
                  />
                </div>
              </div>

              <DialogFooter className="flex-row items-center justify-between gap-2 pt-4 sm:justify-between">
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isSubmitting || isDeletePending}
                    onClick={() => setIsConfirmDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => {
                      closeDialog();
                      reset(DEFAULT_VALUES);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
                    {isSubmitting
                      ? "Saving…"
                      : isEdit
                        ? "Update Job"
                        : "Save Job"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
              disabled={isDeletePending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
