import { Briefcase, Trash2 } from "lucide-react";

interface JobStatusFeedbackProps {
  isDeleteSuccess: boolean;
  isJobSuccess: boolean;
  isJobError: boolean;
  isEdit: boolean;
  jobError: Error | null;
}

export function JobStatusFeedback({
  isDeleteSuccess,
  isJobSuccess,
  isJobError,
  isEdit,
  jobError,
}: JobStatusFeedbackProps) {
  if (isDeleteSuccess) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
          <Trash2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Job removed successfully.
        </p>
      </div>
    );
  }

  if (isJobSuccess) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
          <Briefcase className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {isEdit ? "Job updated successfully!" : "Job recorded successfully!"}
        </p>
      </div>
    );
  }

  if (isJobError) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <Briefcase className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Something went wrong: {jobError?.message}
        </p>
      </div>
    );
  }

  return null;
}
