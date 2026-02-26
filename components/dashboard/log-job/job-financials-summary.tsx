import { fmt } from "../../../types/log-job";

interface JobFinancialsSummaryProps {
  gross: number;
  partsTotal: number;
  netRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  companyNet: number;
  totalCollected: number;
  netPlusTip: number;
  // balance: number;
  isNetNegative: boolean;
}

export function JobFinancialsSummary({
  gross,
  partsTotal,
  netRevenue,
  commissionRate,
  commissionAmount,
  companyNet,
  totalCollected,
  netPlusTip,
  // balance,
  isNetNegative,
}: JobFinancialsSummaryProps) {
  return (
    <div className="space-y-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
      {/* Row 1: Gross / Parts Cost / Net Revenue */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Gross</p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {fmt(gross)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Parts Cost</p>
          <p className="font-semibold tabular-nums text-zinc-600 dark:text-zinc-400">
            {fmt(partsTotal)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Net Revenue
          </p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {fmt(netRevenue)}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700" />

      {/* Row 2: Commission / Company Net */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Commission ({commissionRate}%)
          </p>
          <p className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
            {fmt(commissionAmount)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Company Net ({100 - commissionRate}%)
          </p>
          <p
            className={`font-semibold tabular-nums ${
              isNetNegative
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {fmt(companyNet)}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700" />

      {/* Row 3: Total Collected / Net + Tip / Balance */}
      <div className="grid grid-cols-2 items gap-2 text-sm">
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Total Collected
          </p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {fmt(totalCollected)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Net + Tip</p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {fmt(netPlusTip)}
          </p>
        </div>
        {/* <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Balance</p>
          <p
            className={`font-semibold tabular-nums ${
              balance > 0
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {fmt(balance)}
          </p>
        </div> */}
      </div>
    </div>
  );
}
