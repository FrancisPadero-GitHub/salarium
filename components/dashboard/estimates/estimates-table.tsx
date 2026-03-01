"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { EstimateStatus } from "@/types/estimate";
import type { EstimatesRow } from "@/hooks/estimates/useFetchEstimates";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const statusStyles: Record<EstimateStatus, string> = {
  follow_up:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  denied: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<EstimateStatus, string> = {
  follow_up: "Follow Up",
  approved: "Approved",
  denied: "Denied",
};

type SortKey =
  | "work_order_date"
  | "work_title"
  | "address"
  | "technician"
  | "description"
  | "estimated_amount"
  | "estimate_status"
  | "handled_by";

type SortDir = "asc" | "desc";
type StatusFilter = "all" | EstimateStatus;
type DynamicFilter = "all" | (string & {});

interface EstimatesTableProps {
  estimates: EstimatesRow[];
  technicianNameById: Record<string, string>;
  onPromoteToJob: (estimate: EstimatesRow) => void;
  onRowClick: (estimate: EstimatesRow) => void;
}

export function EstimatesTable({
  estimates,
  technicianNameById,
  onPromoteToJob,
  onRowClick,
}: EstimatesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [technicianFilter, setTechnicianFilter] =
    useState<DynamicFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("work_order_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const activeFilterCount = [
    search !== "",
    startDate !== "",
    endDate !== "",
    statusFilter !== "all",
    technicianFilter !== "all",
  ].filter(Boolean).length;

  const technicians = useMemo(
    () =>
      Array.from(
        new Set(
          estimates
            .map((estimate) =>
              estimate.technician_id
                ? (technicianNameById[estimate.technician_id] ??
                  estimate.technician_id)
                : null,
            )
            .filter(Boolean),
        ),
      ).sort() as string[],
    [estimates, technicianNameById],
  );

  function clearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setTechnicianFilter("all");
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    return [...estimates]
      .filter((estimate) => {
        const techName = estimate.technician_id
          ? (technicianNameById[estimate.technician_id] ??
            estimate.technician_id)
          : "";
        const matchSearch =
          !q ||
          (estimate.work_title ?? "").toLowerCase().includes(q) ||
          (estimate.address ?? "").toLowerCase().includes(q) ||
          (estimate.description ?? "").toLowerCase().includes(q) ||
          (estimate.region ?? "").toLowerCase().includes(q) ||
          (estimate.category ?? "").toLowerCase().includes(q) ||
          techName.toLowerCase().includes(q) ||
          (estimate.handled_by ?? "").toLowerCase().includes(q);

        const matchStatus =
          statusFilter === "all" || estimate.estimate_status === statusFilter;
        const matchTechnician =
          technicianFilter === "all" || techName === technicianFilter;

        let matchDate = true;
        if (startDateObj || endDateObj) {
          const estimateDate = estimate.work_order_date
            ? new Date(estimate.work_order_date)
            : null;

          if (estimateDate) {
            if (startDateObj && estimateDate < startDateObj) matchDate = false;
            if (endDateObj) {
              const endOfDay = new Date(endDateObj);
              endOfDay.setHours(23, 59, 59, 999);
              if (estimateDate > endOfDay) matchDate = false;
            }
          }
        }

        return matchSearch && matchStatus && matchTechnician && matchDate;
      })
      .sort((a, b) => {
        const techA = a.technician_id
          ? (technicianNameById[a.technician_id] ?? a.technician_id)
          : "";
        const techB = b.technician_id
          ? (technicianNameById[b.technician_id] ?? b.technician_id)
          : "";

        const av: string | number =
          sortKey === "technician"
            ? techA
            : sortKey === "estimated_amount"
              ? Number(a.estimated_amount ?? 0)
              : String(a[sortKey] ?? "");
        const bv: string | number =
          sortKey === "technician"
            ? techB
            : sortKey === "estimated_amount"
              ? Number(b.estimated_amount ?? 0)
              : String(b[sortKey] ?? "");

        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }

        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [
    estimates,
    technicianNameById,
    search,
    statusFilter,
    technicianFilter,
    startDate,
    endDate,
    sortKey,
    sortDir,
  ]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(key);
    setSortDir("asc");
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) {
      return <ChevronsUpDown className="ml-1 inline h-3 w-3 text-zinc-400" />;
    }

    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3 text-zinc-600 dark:text-zinc-300" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3 text-zinc-600 dark:text-zinc-300" />
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Estimates
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {filtered.length} of {estimates.length} estimates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((value) => !value)}
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

      {showFilters && (
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <Input
            placeholder="Search title, technician, status, address..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 w-full text-sm sm:w-64"
          />

          <Input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="h-8 w-full text-sm sm:w-40"
            title="Start date"
          />

          <Input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="h-8 w-full text-sm sm:w-40"
            title="End date"
          />

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={technicianFilter}
            onValueChange={(value) => setTechnicianFilter(value)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-44">
              <SelectValue placeholder="Technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians.map((technician) => (
                <SelectItem key={technician} value={technician}>
                  {technician}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="min-h-80 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sticky top-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {[
                { key: "work_order_date" as SortKey, label: "Date" },
                { key: "work_title" as SortKey, label: "Work Title" },
                { key: "address" as SortKey, label: "Address" },
                { key: "technician" as SortKey, label: "Technician" },
                { key: "description" as SortKey, label: "Description" },
                { key: "estimated_amount" as SortKey, label: "Amount" },
                { key: "estimate_status" as SortKey, label: "Status" },
                { key: "handled_by" as SortKey, label: "Handled By" },
                { key: "work_title" as SortKey, label: "Actions" },
              ].map(({ key, label }, index) => (
                <th
                  key={`${key}-${label}-${index}`}
                  onClick={
                    label === "Actions" ? undefined : () => handleSort(key)
                  }
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400",
                    label === "Actions"
                      ? "cursor-default"
                      : "cursor-pointer select-none hover:text-zinc-700 dark:hover:text-zinc-200",
                  )}
                >
                  {label}
                  {label === "Actions" ? null : <SortIcon col={key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-600"
                >
                  No estimates match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((estimate, index) => {
                const techName = estimate.technician_id
                  ? (technicianNameById[estimate.technician_id] ??
                    estimate.technician_id)
                  : "—";

                return (
                  <tr
                    key={
                      estimate.work_order_id ??
                      `${estimate.created_at}-${index}`
                    }
                    onClick={() => onRowClick(estimate)}
                    className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                      {estimate.work_order_date
                        ? new Date(
                            estimate.work_order_date,
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                      {estimate.work_title ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                      {estimate.address ?? "—"}
                      {estimate.region && (
                        <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                          {estimate.region}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {techName}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                      {estimate.description ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                      {fmt(Number(estimate.estimated_amount ?? 0))}
                    </td>
                    <td className="px-4 py-3">
                      {estimate.estimate_status ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statusStyles[estimate.estimate_status],
                          )}
                        >
                          {statusLabels[estimate.estimate_status]}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          ,
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {estimate.handled_by ?? "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
