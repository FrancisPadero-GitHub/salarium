"use client";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useFetchReviewRecordsSummaries } from "@/hooks/reviews/useFetchReviewSummaries";
import {
  BadgeDollarSign,
  ClipboardList,
  ListChecks,
  WalletCards,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

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
        color: "text-success",
        bg: "bg-success/10",
      },
      {
        title: "Avg Review Amount",
        value: fmt(summaryData?.avg_review_amount ?? 0),
        icon: BadgeDollarSign,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        title: "Jobs With Reviews",
        value: num(summaryData?.total_jobs_with_reviews ?? 0),
        icon: ClipboardList,
        color: "text-chart-1",
        bg: "bg-chart-1/10",
      },
      {
        title: "Jobs Without Reviews",
        value: num(summaryData?.total_jobs_without_reviews ?? 0),
        icon: ListChecks,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, color, bg }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {title}
              </p>
              <div className={cn("rounded-md p-1.5", bg)}>
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
            </div>
            <p className={cn("mt-2 text-2xl font-bold tabular-nums", color)}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </QueryStatePanel>
  );
}
