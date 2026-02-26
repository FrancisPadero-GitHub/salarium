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
import { Spinner } from "@/components/ui/spinner";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useJobsStore } from "@/features/store/jobs/useFormJobStore";
import { JobDetailedRow, useFetchJobDetailed } from "@/hooks/jobs/useFetchJobs";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

type SortKey =
  | "job_date"
  | "address"
  | "technician_name"
  | "gross"
  | "commission"
  | "company_net"
  | "payment_mode"
  | "status";

type SortDir = "asc" | "desc";
type StatusFilter = "all" | "done" | "pending" | "cancelled";
type PaymentFilter = "all" | "cash" | "credit card" | "check" | "zelle";
type DynamicFilter = "all" | (string & {});

const paymentColors: Record<string, string> = {
  cash: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  check: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "credit card":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  zelle: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const statusColors: Record<string, string> = {
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

interface JobsTableProps {
  initialJobs: JobDetailedRow[];
}

export function JobsTable({ initialJobs }: JobsTableProps) {
  const { data: jobs = [], isLoading, isError } = useFetchJobDetailed();
  const { openEdit } = useJobsStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<DynamicFilter>("all");
  const [technicianFilter, setTechnicianFilter] =
    useState<DynamicFilter>("all");
  const [yearFilter, setYearFilter] = useState<DynamicFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("job_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(jobs.map((j) => j.category).filter(Boolean)),
      ).sort() as string[],
    [jobs],
  );

  const technicians = useMemo(
    () =>
      Array.from(
        new Set(jobs.map((j) => j.technician_name).filter(Boolean)),
      ).sort() as string[],
    [jobs],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          jobs
            .map((j) =>
              j.job_date ? new Date(j.job_date).getFullYear() : null,
            )
            .filter((y): y is number => y !== null),
        ),
      ).sort((a, b) => b - a),
    [jobs],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return [...jobs]
      .filter((j) => {
        const matchSearch =
          !q ||
          (j.address ?? "").toLowerCase().includes(q) ||
          (j.technician_name ?? "").toLowerCase().includes(q) ||
          (j.region ?? "").toLowerCase().includes(q) ||
          (j.job_name ?? "").toLowerCase().includes(q) ||
          (j.category ?? "").toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "all" ||
          (j.status ?? "").toLowerCase() === statusFilter;
        const matchPayment =
          paymentFilter === "all" ||
          (j.payment_mode ?? "").toLowerCase() === paymentFilter;
        const matchCategory =
          categoryFilter === "all" || (j.category ?? "") === categoryFilter;
        const matchTechnician =
          technicianFilter === "all" ||
          (j.technician_name ?? "") === technicianFilter;
        const matchYear =
          yearFilter === "all" ||
          (j.job_date
            ? String(new Date(j.job_date).getFullYear()) === yearFilter
            : false);
        return (
          matchSearch &&
          matchStatus &&
          matchPayment &&
          matchCategory &&
          matchTechnician &&
          matchYear
        );
      })
      .sort((a, b) => {
        const av: string | number = (a[sortKey] as string | number) ?? "";
        const bv: string | number = (b[sortKey] as string | number) ?? "";
        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [
    jobs,
    search,
    statusFilter,
    paymentFilter,
    categoryFilter,
    technicianFilter,
    yearFilter,
    sortKey,
    sortDir,
  ]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronsUpDown className="ml-1 inline h-3 w-3 text-zinc-400" />;
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3 text-zinc-600 dark:text-zinc-300" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3 text-zinc-600 dark:text-zinc-300" />
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Jobs
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {filtered.length} of {jobs.length} jobs
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:items-center">
          <Input
            placeholder="Search job, category, technician, address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full text-sm sm:w-56"
          />

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={paymentFilter}
            onValueChange={(v) => setPaymentFilter(v as PaymentFilter)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-36">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit card">Credit Card</SelectItem>
              <SelectItem value="zelle">Zelle</SelectItem>
              <SelectItem value="check">Check</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={technicianFilter}
            onValueChange={(v) => setTechnicianFilter(v)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-40">
              <SelectValue placeholder="Technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={(v) => setYearFilter(v)}>
            <SelectTrigger size="sm" className="w-full sm:w-28">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table body */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="rounded-b-xl bg-red-50 p-6 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Failed to load jobs.
        </div>
      ) : (
        <div className="min-h-96 max-h-96 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                {(
                  [
                    { key: "job_name", label: "Job Name" },
                    { key: "description", label: "Description" },
                    { key: "category", label: "Category" },
                    { key: "job_date", label: "Date" },
                    { key: "address", label: "Address" },
                    { key: "technician_name", label: "Technician" },
                    { key: "gross", label: "Gross" },
                    { key: "commission", label: "Commission" },
                    { key: "company_net", label: "Company Net" },
                    { key: "payment_mode", label: "Payment" },
                    { key: "status", label: "Status" },
                  ] as { key: SortKey; label: string }[]
                ).map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    {label}
                    <SortIcon col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-600"
                  >
                    No jobs match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((job) => {
                  const statusKey = (job.status ?? "pending").toLowerCase();
                  const paymentKey = (job.payment_mode ?? "").toLowerCase();
                  return (
                    <tr
                      key={job.id}
                      onClick={() => openEdit(job)}
                      className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      {/* Job Name */}
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                        {job.job_name ?? "—"}
                      </td>
                      {/* Description */}
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {job.description ?? "—"}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {job.category ?? "—"}
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                        {job.job_date
                          ? new Date(job.job_date).toLocaleDateString()
                          : "—"}
                      </td>
                      {/* Address */}
                      <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                        {job.address ?? "—"}
                        {job.region && (
                          <span className="ml-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                            {job.region}
                          </span>
                        )}
                      </td>
                      {/* Technician */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            {(job.technician_name ?? "?")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {job.technician_name ?? "—"}
                          </span>
                          {job.default_commission_rate != null && (
                            <span className="text-xs text-zinc-400">
                              ({job.default_commission_rate}%)
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Gross */}
                      <td className="px-4 py-3 tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                        {fmt(job.gross ?? 0)}
                      </td>
                      {/* Commission */}
                      <td className="px-4 py-3 tabular-nums text-amber-600 dark:text-amber-400">
                        {fmt(job.commission ?? 0)}
                      </td>
                      {/* Company Net */}
                      <td className="px-4 py-3 tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                        {fmt(job.company_net ?? 0)}
                      </td>
                      {/* Payment */}
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                            paymentColors[paymentKey] ??
                              "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                          )}
                        >
                          {job.payment_mode ?? "—"}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                            statusColors[statusKey] ??
                              "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                          )}
                        >
                          {job.status ?? "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
