import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobDialogHeaderProps {
  isDeleteSuccess: boolean;
  isJobSuccess: boolean;
  isJobError: boolean;
  isEdit: boolean;
}

export function JobDialogHeader({
  isDeleteSuccess,
  isJobSuccess,
  isJobError,
  isEdit,
}: JobDialogHeaderProps) {
  return (
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
  );
}
