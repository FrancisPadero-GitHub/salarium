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

interface DeleteJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDeletePending: boolean;
  onConfirm: () => void;
}

export function DeleteJobDialog({
  isOpen,
  onOpenChange,
  isDeletePending,
  onConfirm,
}: DeleteJobDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={onConfirm}
            disabled={isDeletePending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isDeletePending ? "Removing..." : "Yes, remove job"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
