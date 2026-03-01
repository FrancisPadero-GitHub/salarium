"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash2, Briefcase, CalendarDays, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Db types
import type { Database } from "@/database.types";

// Hooks
import { useAddReviewRecord } from "@/hooks/reviews/useAddReviewRecords";
import { useEditReviewRecord } from "@/hooks/reviews/useEditReviewRecords";
import { useDelReviewRecord } from "@/hooks/reviews/useDelReviewRecords";
import { useFetchReviewTypes } from "@/hooks/reviews/useFetchReviewTypes";
import { useFetchPaymentMethods } from "@/hooks/payment-methods/useFetchPaymentMethods";
import { useFetchJobsForReview } from "@/hooks/reviews/useFetchJobsForReview";
import { useFetchUnreviewedJobs } from "@/hooks/reviews/useFetchUnreviewedJobs";

type ReviewRecordFormValues =
  Database["public"]["Tables"]["review_records"]["Insert"];
type ReviewRecordViewRow =
  Database["public"]["Views"]["v_review_records"]["Row"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

interface AddEditReviewDialogProps {
  open: boolean;
  mode: "add" | "edit";
  selectedReview: ReviewRecordViewRow | null;
  onOpenChange: (open: boolean) => void;
}

export function AddEditReviewDialog({
  open,
  mode,
  selectedReview,
  onOpenChange,
}: AddEditReviewDialogProps) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // TanStack Query mutations
  const {
    mutate: addReview,
    error: addError,
    isError: isAddError,
    isPending: isAddPending,
    isSuccess: isAddSuccess,
    reset: resetAddMutation,
  } = useAddReviewRecord();

  const {
    mutate: editReview,
    error: editError,
    isError: isEditError,
    isPending: isEditPending,
    isSuccess: isEditSuccess,
    reset: resetEditMutation,
  } = useEditReviewRecord();

  const {
    mutate: deleteReview,
    isPending: isDelPending,
    isSuccess: isDelSuccess,
    reset: resetDelMutation,
  } = useDelReviewRecord();

  // Fetch review types, payment methods, and jobs
  const { data: reviewTypes = [] } = useFetchReviewTypes();
  const { data: paymentMethods = [] } = useFetchPaymentMethods();
  const { data: allDoneJobs = [] } = useFetchJobsForReview();
  const { data: unreviewedJobs = [] } = useFetchUnreviewedJobs();

  // In add mode only show unreviewed jobs; in edit mode show unreviewed jobs + the current job
  const jobOptions =
    mode === "add"
      ? unreviewedJobs
      : (() => {
          const currentJob = allDoneJobs.find(
            (j) => j.work_order_id === selectedReview?.work_order_id,
          );
          const alreadyIncluded = unreviewedJobs.some(
            (j) => j.work_order_id === selectedReview?.work_order_id,
          );
          if (currentJob && !alreadyIncluded) {
            return [currentJob, ...unreviewedJobs];
          }
          return unreviewedJobs;
        })();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
  } = useForm<ReviewRecordFormValues>({
    defaultValues: {
      amount: 0,
      review_date: new Date().toISOString().split("T")[0],
      job_id: "",
      review_type_id: "",
      notes: "",
      payment_method_id: null,
    },
  });

  // Watch only fields used by controlled Select components
  const job_id = watch("job_id");
  const review_type_id = watch("review_type_id");
  const payment_method_id = watch("payment_method_id");

  // Derive selected job details for the preview card
  const selectedJob =
    jobOptions.find((j) => j.work_order_id === job_id) ?? null;

  // Sync form state with selected record
  useEffect(() => {
    if (!open) return;

    resetAddMutation();
    resetEditMutation();
    resetDelMutation();
    setIsDeleteAlertOpen(false);

    if (mode === "edit" && selectedReview) {
      const reviewTypeId =
        reviewTypes.find((type) => type.name === selectedReview.review_type)
          ?.id ?? "";
      const paymentMethodId =
        paymentMethods.find(
          (paymentMethod) =>
            paymentMethod.name === selectedReview.payment_method,
        )?.id ?? null;

      resetForm({
        amount: Number(selectedReview.review_amount ?? 0),
        review_date:
          selectedReview.review_date ?? new Date().toISOString().split("T")[0],
        job_id: selectedReview.work_order_id ?? "",
        review_type_id: reviewTypeId,
        notes: selectedReview.review_notes ?? "",
        payment_method_id: paymentMethodId,
      });
      return;
    }

    resetForm({
      amount: 0,
      review_date: new Date().toISOString().split("T")[0],
      job_id: "",
      review_type_id: "",
      notes: "",
      payment_method_id: null,
    });
  }, [
    open,
    mode,
    selectedReview,
    reviewTypes,
    paymentMethods,
    resetForm,
    resetAddMutation,
    resetEditMutation,
    resetDelMutation,
  ]);

  const closeDialog = () => {
    setIsDeleteAlertOpen(false);
    onOpenChange(false);
  };

  // Handle success
  useEffect(() => {
    if (isAddSuccess || isEditSuccess || isDelSuccess) {
      closeDialog();
      resetAddMutation();
      resetEditMutation();
      resetDelMutation();
    }
  }, [isAddSuccess, isEditSuccess, isDelSuccess]);

  const isSubmitting = isAddPending || isEditPending || isDelPending;

  const onSubmit = (data: ReviewRecordFormValues) => {
    if (mode === "add") {
      addReview(data);
    } else if (mode === "edit" && selectedReview?.review_id) {
      editReview({
        ...data,
        id: selectedReview.review_id,
      });
    }
  };

  const handleDelete = () => {
    if (mode === "edit" && selectedReview?.review_id) {
      deleteReview(selectedReview.review_id);
      setIsDeleteAlertOpen(false);
    }
  };

  const currentError = isAddError ? addError : isEditError ? editError : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
          onCloseAutoFocus={(event) => {
            // Prevent auto-focus on close to avoid scroll jump
            event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {mode === "add" ? "New Review Record" : "Edit Review Record"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              {mode === "add"
                ? "Link a completed job to a review and record the payment."
                : "Update the review record details."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
            {/* ── Job Selection ────────────────────────────── */}
            <div className="space-y-1.5">
              <Label
                htmlFor="job_id"
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Job <span className="text-red-500">*</span>
              </Label>
              <Select
                value={job_id || ""}
                onValueChange={(value) => {
                  setValue("job_id", value);
                  if (mode === "add") {
                    const picked = unreviewedJobs.find(
                      (j) => j.work_order_id === value,
                    );
                    if (picked?.work_order_date) {
                      setValue("review_date", picked.work_order_date);
                    }
                  }
                }}
              >
                <SelectTrigger id="job_id" className="w-full">
                  <SelectValue placeholder="Select a completed job…" />
                </SelectTrigger>
                <SelectContent>
                  {jobOptions.length === 0 ? (
                    <div className="px-3 py-5 text-center text-xs text-zinc-400">
                      {mode === "add"
                        ? "No unreviewed jobs available"
                        : "No jobs available"}
                    </div>
                  ) : (
                    jobOptions.map((job) => (
                      <SelectItem
                        key={job.work_order_id}
                        value={job.work_order_id || ""}
                      >
                        <span className="font-medium">
                          {job.work_title || job.work_order_id}
                        </span>
                        {job.work_order_date && (
                          <span className="ml-2 text-xs text-zinc-400">
                            {new Date(job.work_order_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Job detail preview card */}
              {selectedJob && (
                <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="flex items-start gap-2">
                    <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      {selectedJob.work_title}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {selectedJob.work_order_date && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <CalendarDays className="h-3 w-3 shrink-0" />
                        {new Date(
                          selectedJob.work_order_date,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    )}
                    {selectedJob.address && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{selectedJob.address}</span>
                      </div>
                    )}
                    {selectedJob.subtotal != null && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="text-zinc-400">Subtotal</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {fmt(selectedJob.subtotal)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Review Type + Date (2-col) ───────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="review_type_id"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Review Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={review_type_id || ""}
                  onValueChange={(value) => {
                    setValue("review_type_id", value);
                    // Auto-fill amount from the review type's price
                    const picked = reviewTypes.find((t) => t.id === value);
                    if (picked?.price != null) {
                      setValue("amount", picked.price);
                    }
                  }}
                >
                  <SelectTrigger id="review_type_id" className="w-full">
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <span>{type.name}</span>
                        <span className="ml-2 text-xs text-zinc-400">
                          {fmt(type.price)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="review_date"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Review Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="review_date"
                  type="date"
                  className="w-full"
                  {...register("review_date", { required: true })}
                />
              </div>
            </div>

            {/* ── Amount + Payment Method (2-col) ─────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="amount"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-zinc-400">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="pl-6"
                    {...register("amount", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                {review_type_id && (
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Prefilled from review type · editable
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="payment_method_id"
                  className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Payment Method
                </Label>
                <Select
                  value={payment_method_id ?? "none"}
                  onValueChange={(value) =>
                    setValue(
                      "payment_method_id",
                      value === "none" ? null : value,
                    )
                  }
                >
                  <SelectTrigger id="payment_method_id" className="w-full">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Notes ───────────────────────────────────── */}
            <div className="space-y-1.5">
              <Label
                htmlFor="notes"
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this review…"
                {...register("notes")}
                className="min-h-20 resize-none text-sm"
              />
            </div>

            {/* ── Error banner ─────────────────────────────── */}
            {currentError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                {currentError.message}
              </div>
            )}

            {/* ── Footer ───────────────────────────────────── */}
            <DialogFooter
              className={cn(
                "flex items-center gap-2 pt-2",
                mode === "edit" ? "justify-between" : "justify-end",
              )}
            >
              {mode === "edit" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteAlertOpen(true)}
                  disabled={isSubmitting}
                  className="mr-auto h-8 gap-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="min-w-24"
                >
                  {isSubmitting
                    ? "Saving…"
                    : mode === "add"
                      ? "Add Review"
                      : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDelPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDelPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDelPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
