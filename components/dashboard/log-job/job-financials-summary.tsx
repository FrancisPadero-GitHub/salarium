import { fmt } from "./types";

interface JobFinancialsSummaryProps {
  gross: number;
  commissionRate: number;
  commissionAmount: number;
  net: number;
  isNetNegative: boolean;
}

export function JobFinancialsSummary({
  gross,
  commissionRate,
  commissionAmount,
  net,
  isNetNegative,
}: JobFinancialsSummaryProps) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Gross</p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {fmt(gross)}
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
          <p
            className={`font-semibold tabular-nums ${
              isNetNegative
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {fmt(net)}
          </p>
        </div>
      </div>
    </div>
  );
}
