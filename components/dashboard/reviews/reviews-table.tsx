"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useFetchReviewRecords,
  type ReviewRecordRow,
} from "@/hooks/reviews/useFetchReviewRecords";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type SortKey =
  | "review_date"
  | "review_amount"
  | "technician_id"
  | "work_order_id";
type SortDir = "asc" | "desc";
type DynamicFilter = "all" | (string & {});

interface ReviewsTableProps {
  onEdit: (record: ReviewRecordRow) => void;
}

export function ReviewsTable({ onEdit }: ReviewsTableProps) {
  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = useFetchReviewRecords();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("review_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reviewTypeFilter, setReviewTypeFilter] =
    useState<DynamicFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<DynamicFilter>("all");
  const [showFilters, setShowFilters] = useState(true);

  const reviewTypes = useMemo(
    () =>
      Array.from(
        new Set(records.map((r) => r.review_type).filter(Boolean)),
      ).sort() as string[],
    [records],
  );

  const paymentMethods = useMemo(
    () =>
      Array.from(
        new Set(records.map((r) => r.payment_method).filter(Boolean)),
      ).sort() as string[],
    [records],
  );

  const technicians = useMemo(
    () =>
      Array.from(
        new Set(records.map((r) => r.technician_id).filter(Boolean)),
      ).sort() as string[],
    [records],
  );

  const activeFilterCount = [
    search !== "",
    startDate !== "",
    endDate !== "",
    reviewTypeFilter !== "all",
    paymentFilter !== "all",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setReviewTypeFilter("all");
    setPaymentFilter("all");
  }

  // Filtered and sorted data
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    return [...records]
      .filter((r) => {
        const matchesSearch =
          !q ||
          (r.work_title ?? "").toLowerCase().includes(q) ||
          (r.review_type ?? "").toLowerCase().includes(q) ||
          (r.technician_id ?? "").toLowerCase().includes(q) ||
          (r.payment_method ?? "").toLowerCase().includes(q) ||
          (r.work_order_id ?? "").toLowerCase().includes(q);

        const matchesReviewType =
          reviewTypeFilter === "all" ||
          (r.review_type ?? "") === reviewTypeFilter;

        const matchesPayment =
          paymentFilter === "all" || (r.payment_method ?? "") === paymentFilter;

        let matchesDate = true;
        if (startDateObj || endDateObj) {
          const rowDate = r.review_date ? new Date(r.review_date) : null;
          if (rowDate) {
            if (startDateObj && rowDate < startDateObj) matchesDate = false;
            if (endDateObj) {
              const endOfDay = new Date(endDateObj);
              endOfDay.setHours(23, 59, 59, 999);
              if (rowDate > endOfDay) matchesDate = false;
            }
          }
        }

        return (
          matchesSearch && matchesReviewType && matchesPayment && matchesDate
        );
      })
      .sort((a, b) => {
        let av: any = a[sortKey as keyof ReviewRecordRow] ?? "";
        let bv: any = b[sortKey as keyof ReviewRecordRow] ?? "";

        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();

        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    records,
    search,
    sortKey,
    sortDir,
    startDate,
    endDate,
    reviewTypeFilter,
    paymentFilter,
  ]);

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="h-4 w-4" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleSort = (k: SortKey) => {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  return (
    <QueryStatePanel
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message || "Failed to load reviews"}
      loadingMessage="Loading reviews table..."
      className="min-h-80"
    >
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Reviews
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {filtered.length} of {records.length} records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              className="h-8 gap-1.5 text-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {!showFilters && activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-white dark:bg-zinc-200 dark:text-zinc-900">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800">
            <Input
              placeholder="Search work title, review type, technician, payment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full text-sm sm:w-64"
            />

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-full text-sm sm:w-40"
              title="Start date"
            />

            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-full text-sm sm:w-40"
              title="End date"
            />

            <Select
              value={reviewTypeFilter}
              onValueChange={(v) => setReviewTypeFilter(v)}
            >
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue placeholder="Review Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {reviewTypes.map((reviewType) => (
                  <SelectItem key={reviewType} value={reviewType}>
                    {reviewType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentFilter}
              onValueChange={(v) => setPaymentFilter(v)}
            >
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                {paymentMethods.map((paymentMethod) => (
                  <SelectItem key={paymentMethod} value={paymentMethod}>
                    {paymentMethod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                  <button
                    onClick={() => handleSort("review_date")}
                    className="flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    Date
                    <SortIcon k="review_date" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                  Finished Jobs
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                  Job Name
                </th>

                <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                  Review Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-50">
                  Payment
                </th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-50">
                  <button
                    onClick={() => handleSort("review_amount")}
                    className="flex items-center justify-end gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    Amount
                    <SortIcon k="review_amount" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No reviews found
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr
                    key={record.review_id}
                    onClick={() => onEdit(record)}
                    className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                  >
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                      {formatDate(record.review_date)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {record.work_order_id ? (
                        <Link
                          href={`/dashboard/jobs?highlight=${record.work_order_id}`}
                          className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {record.work_order_id}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                      {record.work_title || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {record.review_type || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {record.payment_method || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-50">
                      {fmt(record.review_amount ?? 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </QueryStatePanel>
  );
}
