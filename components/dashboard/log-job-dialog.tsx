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
import type { Database } from "@/database.types";

// hooks
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import { useAddJob } from "@/hooks/jobs/useAddJobs";
import { useEditJob } from "@/hooks/jobs/useEditJob";
import { useDelJob } from "@/hooks/jobs/useDelJob";

// zustand
import { useJobsStore } from "@/features/store/jobs/useFormJobStore";

// Components
import { JobStatusFeedback } from "./log-job/job-status-feedback";
import { JobBasicFields } from "./log-job/job-basic-fields";
import { JobFinancialsFields } from "./log-job/job-financials-fields";
import { JobFinancialsSummary } from "./log-job/job-financials-summary";
import { PaymentStatusNotes } from "./log-job/payment-status-notes";
import { DeleteJobDialog } from "./log-job/delete-job-dialog";
import { DEFAULT_VALUES, type JobFormValues } from "@/types/log-job";

type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

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

  const { data: technicians = [] } = useFetchTechSummary();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<JobFormValues>({ defaultValues: DEFAULT_VALUES });

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
        parts_total_cost: String(storeForm.parts_total_cost ?? 0),
        subtotal: String(storeForm.subtotal ?? 0),
        tip_amount: String(storeForm.tip_amount ?? 0),
        cash_on_hand: String(storeForm.cash_on_hand ?? 0),
        payment_mode: storeForm.payment_mode ?? "cash",
        status: storeForm.status ?? "done",
        notes: storeForm.notes ?? "",
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [isDialogOpen]);

  const selectedTechId = watch("technician_id");
  const subtotalVal = parseFloat(watch("subtotal") || "0");
  const tipVal = parseFloat(watch("tip_amount") || "0");
  const cashOnHandVal = parseFloat(watch("cash_on_hand") || "0");

  // parts_total_cost comes from the store when editing an existing job
  const partsTotal = isEdit ? (storeForm.parts_total_cost ?? 0) : 0;

  // Mirror the v_job_table_detailed view calculations
  const gross = subtotalVal; // gross = subtotal
  const netRevenue = gross - partsTotal; // net_revenue = subtotal - parts_total_cost
  const tech = technicians.find((t) => t.technician_id === selectedTechId);
  const commissionRate = tech?.commission_rate ?? 0;
  const commissionAmount = netRevenue * (commissionRate / 100); // commission on net_revenue
  const companyNet = netRevenue - commissionAmount; // company_net
  const totalCollected = subtotalVal + tipVal; // total_amount
  const netPlusTip = totalCollected - partsTotal; // net_plus_tip
  const balance = subtotalVal - cashOnHandVal; // balance
  const isNetNegative = companyNet < 0;

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

  const resetAll = () => {
    resetAddJobMutation?.();
    resetEditJobMutation?.();
    resetForm();
    reset(DEFAULT_VALUES);
    setIsSubmitting(false);
  };

  const onSubmit = async (data: JobFormValues) => {
    const subtotal = parseFloat(data.subtotal) || 0;
    const tip_amount = parseFloat(data.tip_amount) || 0;
    const cash_on_hand = parseFloat(data.cash_on_hand) || 0;

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
          parts_total_cost: partsTotal,
          subtotal,
          tip_amount,
          cash_on_hand,
          payment_mode: data.payment_mode,
          status: data.status,
          notes: data.notes || null,
        };
        await editJobAsync(jobUpdate);
      } else {
        const jobPayload: JobInsert = {
          job_date: data.job_date,
          job_name: data.job_name || null,
          category: data.category || null,
          description: data.description || null,
          address: data.address || null,
          region: data.region || null,
          technician_id: data.technician_id || null,
          parts_total_cost: partsTotal,
          subtotal,
          tip_amount,
          cash_on_hand,
          payment_mode: data.payment_mode,
          status: data.status,
          notes: data.notes || null,
        };
        await addJobAsync(jobPayload);
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
        <DialogContent
          className="sm:max-w-xl"
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

          {showFeedback ? (
            <JobStatusFeedback
              isDeleteSuccess={isDeleteSuccess}
              isJobSuccess={isJobSuccess}
              isJobError={isJobError}
              isEdit={isEdit}
              jobError={jobError}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid">
              <div className="overflow-y-auto max-h-[80vh] space-y-6 py-2 px-2">
                <JobBasicFields
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  technicians={technicians}
                  selectedTechId={selectedTechId}
                  setValue={setValue}
                />

                <JobFinancialsFields
                  register={register}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  isNetNegative={isNetNegative}
                />

                <JobFinancialsSummary
                  gross={gross}
                  partsTotal={partsTotal}
                  netRevenue={netRevenue}
                  commissionRate={commissionRate}
                  commissionAmount={commissionAmount}
                  companyNet={companyNet}
                  totalCollected={totalCollected}
                  netPlusTip={netPlusTip}
                  balance={balance}
                  isNetNegative={isNetNegative}
                />

                <PaymentStatusNotes
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  isSubmitting={isSubmitting}
                />
              </div>
              <DialogFooter className="flex-row pt-3 items-center justify-between sm:justify-between">
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
                <div className="ml-auto flex gap-2">
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
                  <Button type="submit" disabled={isSubmitting || !isDirty}>
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

      <DeleteJobDialog
        isOpen={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        isDeletePending={isDeletePending}
        onConfirm={handleDelete}
      />
    </>
  );
}
