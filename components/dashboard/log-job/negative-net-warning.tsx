import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmt } from "./types";

interface NegativeNetWarningProps {
  partsTotalCost: number;
  commissionAmount: number;
  minSubtotalForPositiveNet: number;
  handleAutoAdjustSubtotal: () => void;
  isSubmitting: boolean;
}

export function NegativeNetWarning({
  partsTotalCost,
  commissionAmount,
  minSubtotalForPositiveNet,
  handleAutoAdjustSubtotal,
  isSubmitting,
}: NegativeNetWarningProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              Negative Net Revenue
            </p>
            <p className="mt-1 text-xs text-red-700 dark:text-red-300">
              Parts cost ({fmt(partsTotalCost)}) + commission (
              {fmt(commissionAmount)}) exceeds the subtotal. The business will
              lose money on this job.
            </p>
            <p className="mt-1 text-xs font-medium text-red-800 dark:text-red-200">
              Recommended minimum subtotal: {fmt(minSubtotalForPositiveNet)}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAutoAdjustSubtotal}
            disabled={isSubmitting}
            className="h-7 border-red-300 bg-white text-xs text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
          >
            Auto-Adjust Subtotal
          </Button>
        </div>
      </div>
    </div>
  );
}
