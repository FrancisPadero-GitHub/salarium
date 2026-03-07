import { format } from "date-fns";
import { User, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ViewJobsRow } from "@/hooks/jobs/useFetchJobTable";

interface DayJobsDialogProps {
  date: Date | null;
  jobs: ViewJobsRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobClick: (job: ViewJobsRow) => void;
  techMap: Map<string, { name: string; commission: number }>;
}

export function DayJobsDialog({
  date,
  jobs,
  open,
  onOpenChange,
  onJobClick,
  techMap,
}: DayJobsDialogProps) {
  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Jobs on {format(date, "MMMM d, yyyy")}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No jobs scheduled for this date.
            </p>
          ) : (
            jobs.map((job) => {
              const isDone = job.status === "done";
              const techName = job.technician_id
                ? techMap.get(job.technician_id)?.name || "Unknown Tech"
                : "No Tech";

              return (
                <button
                  key={job.work_order_id}
                  onClick={() => onJobClick(job)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    isDone
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/30"
                      : "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30",
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        #{job.work_order_id?.slice(0, 8)}
                      </span>
                      <span className="font-semibold text-foreground">
                        {job.work_title || "Unnamed Job"}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        isDone
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
                      )}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3 w-3 shrink-0" />
                      {techName}
                    </span>
                    {job.address && (
                      <span className="flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {job.address}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
