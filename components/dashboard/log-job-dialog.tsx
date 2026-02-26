"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Briefcase, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import { useAddJob } from "@/hooks/jobs/useAddJobs";
import { useAddParts } from "@/hooks/jobs/useAddParts";
import { useEditJob } from "@/hooks/jobs/useEditJob";
import { useSoftDeleteJob } from "@/hooks/jobs/useDelJob";
import { useJobsStore } from "@/features/store/jobs/useFormJobStore";
import type { Database } from "@/database.types";

type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];
type PartInsert = Database["public"]["Tables"]["parts"]["Insert"];
type PaymentMode = Database["public"]["Enums"]["payment_mode_enum"];

interface PartRow {
  name: string;
  quantity: string;
  unit_cost: string;
}

interface JobFormValues {
  job_date: string;
  job_name: string;
  category: string;
  description: string;
  address: string;
  region: string;
  technician_id: string;
  subtotal: string;
  tip_amount: string;
  cash_on_hand: string;
  payment_mode: PaymentMode;
  status: string;
  notes: string;
  parts: PartRow[];
}

const DEFAULT_VALUES: JobFormValues = {
  job_date: new Date().toISOString().slice(0, 10),
  job_name: "",
  category: "",
  description: "",
  address: "",
  region: "",
  technician_id: "",
  subtotal: "",
  tip_amount: "0",
  cash_on_hand: "0",
  payment_mode: "cash",
  status: "done",
  notes: "",
  parts: [],
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export function LogJobDialog() {
  // Zustand store
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

  // TanStack Query mutations
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
  } = useSoftDeleteJob();

  const isJobError = isEdit ? isEditError : isAddError;
  const isJobSuccess = isEdit ? isEditSuccess : isAddSuccess;
  const jobError = isEdit ? editError : addError;

  const { mutateAsync: addPartsAsync, reset: resetAddPartsMutation } =
    useAddParts();

  const { data: technicians = [] } = useFetchTechSummary();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<JobFormValues>({ defaultValues: DEFAULT_VALUES });

  const {
    fields: partFields,
    append: appendPart,
    remove: removePart,
  } = useFieldArray({ control, name: "parts" });

  // Reset RHF form whenever the dialog opens
  useEffect(() => {
    if (!isDialogOpen) return;
    if (isEdit) {
      reset({
        job_date: storeForm.job_date ?? new Date().toISOString().slice(0, 10),
        job_name: storeForm.job_name ?? "",
        category: storeForm.category ?? "",
        description: storeForm.description ?? "",
        address: storeForm.address ?? "",
        region: storeForm.region ?? "",
        technician_id: storeForm.technician_id ?? "",
        subtotal: String(storeForm.subtotal ?? 0),
        tip_amount: String(storeForm.tip_amount ?? 0),
        cash_on_hand: String(storeForm.cash_on_hand ?? 0),
        payment_mode: storeForm.payment_mode ?? "cash",
        status: storeForm.status ?? "done",
        notes: storeForm.notes ?? "",
        parts: [],
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isDialogOpen]);

  const watchedParts = useWatch({ control, name: "parts" });

  const partsTotalCost = useMemo(
    () =>
      (watchedParts ?? []).reduce(
        (s, p) =>
          s + (parseFloat(p.unit_cost) || 0) * (parseFloat(p.quantity) || 0),
        0,
      ),
    [watchedParts],
  );

  const selectedTechId = watch("technician_id");
  const subtotalVal = parseFloat(watch("subtotal") || "0");
  const tipVal = parseFloat(watch("tip_amount") || "0");
  const gross = subtotalVal + partsTotalCost + tipVal;
  const tech = technicians.find((t) => t.technician_id === selectedTechId);
  const commissionRate = tech?.commission_rate ?? 0;
  const commissionAmount = gross * (commissionRate / 100);
  const net = gross - commissionAmount;

  const handleDelete = () => {
    if (!storeForm.id) return;
    softDeleteJob(storeForm.id as string, {
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

  const onSubmit = async (data: JobFormValues) => {
    const subtotal = parseFloat(data.subtotal) || 0;
    const tip_amount = parseFloat(data.tip_amount) || 0;
    const cash_on_hand = parseFloat(data.cash_on_hand) || 0;
    const parts_total_cost = data.parts.reduce(
      (s, p) =>
        s + (parseFloat(p.unit_cost) || 0) * (parseFloat(p.quantity) || 0),
      0,
    );

    setIsSubmitting(true);

    try {
      if (isEdit) {
        const jobUpdate: JobUpdate = {
          id: storeForm.id as string,
          job_date: data.job_date,
          job_name: data.job_name || null,
          category: data.category || null,
          description: data.description || null,
          address: data.address || null,
          region: data.region || null,
          technician_id: data.technician_id || null,
          subtotal,
          tip_amount,
          cash_on_hand,
          parts_total_cost:
            (storeForm.parts_total_cost ?? 0) + parts_total_cost,
          payment_mode: data.payment_mode,
          status: data.status,
          notes: data.notes || null,
        };
        await editJobAsync(jobUpdate);
        for (const p of data.parts) {
          const partPayload: PartInsert = {
            job_id: storeForm.id as string,
            name: p.name,
            quantity: parseFloat(p.quantity) || 0,
            unit_cost: parseFloat(p.unit_cost) || 0,
            amount:
              (parseFloat(p.quantity) || 0) * (parseFloat(p.unit_cost) || 0),
          };
          await addPartsAsync(partPayload);
        }
      } else {
        const jobPayload: JobInsert = {
          job_date: data.job_date,
          job_name: data.job_name || null,
          category: data.category || null,
          description: data.description || null,
          address: data.address || null,
          region: data.region || null,
          technician_id: data.technician_id || null,
          subtotal,
          tip_amount,
          cash_on_hand,
          parts_total_cost,
          payment_mode: data.payment_mode,
          status: data.status,
          notes: data.notes || null,
        };
        const jobResult = await addJobAsync(jobPayload);
        for (const p of data.parts) {
          const partPayload: PartInsert = {
            job_id: jobResult.id,
            name: p.name,
            quantity: parseFloat(p.quantity) || 0,
            unit_cost: parseFloat(p.unit_cost) || 0,
            amount:
              (parseFloat(p.quantity) || 0) * (parseFloat(p.unit_cost) || 0),
          };
          await addPartsAsync(partPayload);
        }
      }

      setTimeout(() => {
        closeDialog();
        setTimeout(() => {
          resetAddJobMutation?.();
          resetEditJobMutation?.();
          resetAddPartsMutation?.();
          resetForm();
          reset(DEFAULT_VALUES);
          setIsSubmitting(false);
        }, 300);
      }, 1500);
    } catch (err) {
      console.error("Error logging job:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(newOpen) => {
          if (newOpen) {
            resetAddJobMutation?.();
            resetEditJobMutation?.();
            resetAddPartsMutation?.();
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
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
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
                    ? "Something went wrong while saving the job."
                    : isEdit
                      ? "Update the details for this job."
                      : "Record a completed or pending job for a technician."}
            </DialogDescription>
          </DialogHeader>

          {isDeleteSuccess ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                <Trash2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Job removed successfully.
              </p>
            </div>
          ) : isJobSuccess ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <Briefcase className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {isEdit
                  ? "Job updated successfully!"
                  : "Job recorded successfully!"}
              </p>
            </div>
          ) : isJobError ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <Briefcase className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Something went wrong: {jobError?.message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
              {/* Date & Technician */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-date">Date *</Label>
                  <Input
                    id="job-date"
                    type="date"
                    disabled={isSubmitting}
                    {...register("job_date", { required: "Date is required" })}
                  />
                  {errors.job_date && (
                    <p className="text-xs text-red-500">
                      {errors.job_date.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-tech">Technician</Label>
                  <Select
                    value={selectedTechId}
                    onValueChange={(v) => setValue("technician_id", v)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="job-tech">
                      <SelectValue placeholder="Select tech" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((t) => (
                        <SelectItem
                          key={t.technician_id!}
                          value={t.technician_id!}
                        >
                          {t.name} ({t.commission_rate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Name & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-name">Job Name</Label>
                  <Input
                    id="job-name"
                    placeholder="e.g. AC Repair"
                    disabled={isSubmitting}
                    {...register("job_name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-category">Category</Label>
                  <Input
                    id="job-category"
                    placeholder="e.g. HVAC, Plumbing"
                    disabled={isSubmitting}
                    {...register("category")}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="job-description">Description</Label>
                <Input
                  id="job-description"
                  placeholder="Short service description"
                  disabled={isSubmitting}
                  {...register("description")}
                />
              </div>

              {/* Address & Region */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="job-address">Address</Label>
                  <Input
                    id="job-address"
                    placeholder="123 Main St, Tampa, FL"
                    disabled={isSubmitting}
                    {...register("address")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-region">Region</Label>
                  <Input
                    id="job-region"
                    placeholder="e.g. South"
                    disabled={isSubmitting}
                    {...register("region")}
                  />
                </div>
              </div>

              {/* Subtotal, Tips, Cash on Hand */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-subtotal">Subtotal ($) *</Label>
                  <Input
                    id="job-subtotal"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    disabled={isSubmitting}
                    {...register("subtotal", {
                      required: "Required",
                      min: { value: 0, message: "Must be ≥ 0" },
                    })}
                  />
                  {errors.subtotal && (
                    <p className="text-xs text-red-500">
                      {errors.subtotal.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-tips">Tip ($)</Label>
                  <Input
                    id="job-tips"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    disabled={isSubmitting}
                    {...register("tip_amount")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-cash">Cash on Hand ($)</Label>
                  <Input
                    id="job-cash"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    disabled={isSubmitting}
                    {...register("cash_on_hand")}
                  />
                </div>
              </div>

              {/* Parts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Parts</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    disabled={isSubmitting}
                    onClick={() =>
                      appendPart({ name: "", quantity: "1", unit_cost: "" })
                    }
                  >
                    <Plus className="h-3 w-3" />
                    Add Part
                  </Button>
                </div>

                {partFields.length > 0 && (
                  <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_80px_100px_32px] gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                      <span className="text-xs font-medium text-zinc-500">
                        Name
                      </span>
                      <span className="text-xs font-medium text-zinc-500">
                        Qty
                      </span>
                      <span className="text-xs font-medium text-zinc-500">
                        Unit Cost
                      </span>
                      <span />
                    </div>
                    {/* Rows */}
                    {partFields.map((field, index) => {
                      const qty = parseFloat(
                        watchedParts?.[index]?.quantity || "0",
                      );
                      const uc = parseFloat(
                        watchedParts?.[index]?.unit_cost || "0",
                      );
                      const rowTotal = qty * uc;
                      return (
                        <div
                          key={field.id}
                          className="grid grid-cols-[1fr_80px_100px_32px] items-center gap-2 border-b border-zinc-100 px-3 py-2 last:border-0 dark:border-zinc-800"
                        >
                          <Input
                            placeholder="Part name"
                            className="h-7 text-xs"
                            disabled={isSubmitting}
                            {...register(`parts.${index}.name`, {
                              required: true,
                            })}
                          />
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="1"
                            className="h-7 text-xs"
                            disabled={isSubmitting}
                            {...register(`parts.${index}.quantity`)}
                          />
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="h-7 text-xs"
                              disabled={isSubmitting}
                              {...register(`parts.${index}.unit_cost`)}
                            />
                            {rowTotal > 0 && (
                              <span className="absolute -bottom-4 left-0 text-[10px] tabular-nums text-zinc-400">
                                = {fmt(rowTotal)}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removePart(index)}
                            disabled={isSubmitting}
                            className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                    {/* Parts total */}
                    <div className="flex items-center justify-between rounded-b-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
                      <span className="text-xs text-zinc-500">Parts Total</span>
                      <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                        {fmt(partsTotalCost)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculated summary */}
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Gross
                    </p>
                    <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {fmt(gross)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Parts Cost
                    </p>
                    <p className="font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                      {fmt(partsTotalCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Commission ({commissionRate}%)
                    </p>
                    <p className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                      {fmt(commissionAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Net to Business
                    </p>
                    <p className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {fmt(net)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-payment">Payment Method</Label>
                  <Select
                    value={watch("payment_mode")}
                    onValueChange={(v) =>
                      setValue("payment_mode", v as PaymentMode)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="job-payment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit card">Credit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="zelle">Zelle</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-status">Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(v) => setValue("status", v)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="job-status">
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

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="job-notes">Notes</Label>
                <Textarea
                  id="job-notes"
                  placeholder="Service details, observations..."
                  rows={3}
                  disabled={isSubmitting}
                  {...register("notes")}
                />
              </div>

              <DialogFooter className="flex-row items-center justify-between sm:justify-between">
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isSubmitting || isDeletePending}
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
                    disabled={isSubmitting}
                    onClick={() => {
                      closeDialog();
                      reset(DEFAULT_VALUES);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
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
      <AlertDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This job will be hidden from all views and reports but{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                not permanently deleted
              </span>
              . The data will remain in the database and can be restored if
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
              {isDeletePending ? "Removing..." : "Yes, remove job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
