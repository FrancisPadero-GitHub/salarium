"use client";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useFetchReviewRecordsSummaries } from "@/hooks/reviews/useFetchReviewSummaries";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  ListChecks,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const pct = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n);

const num = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function ReviewSummaryCards() {
  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useFetchReviewRecordsSummaries();

  const summaryData = useMemo(() => summary?.[0] || null, [summary]);

  const cards = useMemo(
    () => [
      {
        title: "Total Review Amount",
        value: fmt(summaryData?.total_review_amount ?? 0),
        icon: WalletCards,
        iconWrapperClass:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      },
      {
        title: "Avg Review Amount",
        value: fmt(summaryData?.avg_review_amount ?? 0),
        icon: BadgeDollarSign,
        iconWrapperClass:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      },
      {
        title: "Avg / Reviewed Job",
        value: fmt(summaryData?.avg_amount_per_reviewed_job ?? 0),
        icon: CircleDollarSign,
        iconWrapperClass:
          "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
      },
      {
        title: "Min Review Amount",
        value: fmt(summaryData?.min_review_amount ?? 0),
        icon: TrendingDown,
        iconWrapperClass:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      },
      {
        title: "Coverage Ratio",
        value: pct(summaryData?.review_coverage_ratio ?? 0),
        icon: ClipboardCheck,
        iconWrapperClass:
          "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
      },
      {
        title: "Total Done Jobs",
        value: num(summaryData?.total_done_jobs ?? 0),
        icon: BriefcaseBusiness,
        iconWrapperClass:
          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
      },
      {
        title: "Jobs With Reviews",
        value: num(summaryData?.total_jobs_with_reviews ?? 0),
        icon: ClipboardList,
        iconWrapperClass:
          "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      },
      {
        title: "Jobs Without Reviews",
        value: num(summaryData?.total_jobs_without_reviews ?? 0),
        icon: ListChecks,
        iconWrapperClass:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      },
    ],
    [summaryData],
  );

  return (
    <QueryStatePanel
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
      loadingMessage="Loading review summary..."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {card.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg",
                    card.iconWrapperClass,
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </QueryStatePanel>
  );
}
