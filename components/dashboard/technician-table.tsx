"use client";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import {
  useFetchTechnicians,
  type TechnicianDetailRow,
} from "@/hooks/technicians/useFetchTechnicians";
import { Spinner } from "@/components/ui/spinner";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useFilterTechTable } from "@/features/store/technician/useFilterTechTable";
import { useTechnicianStore } from "@/features/store/technician/useFormTechnicianStore";

/** Merged row combining v_technicians_summary + v_technicians detail fields */
type MergedTechRow = {
  technician_id: string | null;
  name: string | null;
  commission: number | null;
  email: string | null;
  hired_date: string | null;
  total_jobs: number | null;
  gross_revenue: number | null;
  total_company_net: number | null;
  total_commission_earned: number | null;
  total_parts: number | null;
  total_tips: number | null;
};

type SortKey = keyof Pick<
  MergedTechRow,
  | "name"
  | "commission"
  | "total_jobs"
  | "gross_revenue"
  | "total_company_net"
  | "total_commission_earned"
  | "hired_date"
>;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export function TechnicianTable() {
  const { data: summaries = [], isLoading, isError } = useFetchTechSummary();
  const { data: techDetails = [] } = useFetchTechnicians();

  const openEdit = useTechnicianStore((state) => state.openEdit);

  /** Map technician_id → detail row for commission/email/hired_date */
  const detailMap = useMemo(() => {
    const m = new Map<string, TechnicianDetailRow>();
    for (const d of techDetails) if (d.technician_id) m.set(d.technician_id, d);
    return m;
  }, [techDetails]);

  /** Merge summary + detail into a unified row */
  const technicians: MergedTechRow[] = useMemo(
    () =>
      summaries.map((s) => {
        const detail = s.technician_id ? detailMap.get(s.technician_id) : null;
        return {
          technician_id: s.technician_id,
          name: s.name,
          commission: detail?.commission ?? null,
          email: detail?.email ?? null,
          hired_date: detail?.hired_date ?? null,
          total_jobs: s.total_jobs,
          gross_revenue: s.gross_revenue,
          total_company_net: s.total_company_net,
          total_commission_earned: s.total_commission_earned,
          total_parts: s.total_parts,
          total_tips: s.total_tips,
        };
      }),
    [summaries, detailMap],
  );

  // Get filter state from Zustand store
  const search = useFilterTechTable((state) => state.search);
  const commissionFilter = useFilterTechTable(
    (state) => state.commissionFilter,
  );
  const sortKey = useFilterTechTable((state) => state.sortKey);
  const sortDir = useFilterTechTable((state) => state.sortDir);
  const setSearch = useFilterTechTable((state) => state.setSearch);
  const setCommissionFilter = useFilterTechTable(
    (state) => state.setCommissionFilter,
  );
  const setSortKey = useFilterTechTable((state) => state.setSortKey);
  const setSortDir = useFilterTechTable((state) => state.setSortDir);

  const techCommissionRates = technicians.map((t) => ({
    name: t.name,
    commission: t.commission,
  }));

  // compute dynamic thresholds (33rd and 66th percentiles) for commission rate percentages
  const [p33, p66] = useMemo(() => {
    const rates = technicians
      .map((t) => t.commission ?? 0)
      .sort((a, b) => a - b);
    if (rates.length === 0) return [20, 30];
    const percentile = (q: number) => {
      const pos = q * (rates.length - 1);
      const lo = Math.floor(pos);
      const hi = Math.ceil(pos);
      if (lo === hi) return rates[lo];
      const w = pos - lo;
      return rates[lo] * (1 - w) + rates[hi] * w;
    };
    return [percentile(0.33), percentile(0.66)];
  }, [technicians]);

  console.log("Technician commission rates:", techCommissionRates, {
    p33,
    p66,
  });

  const COMMISSION_FILTERS = useMemo(
    () => [
      { label: "All Rates", value: "all" as const },
      { label: `Low (< ${p33.toFixed(0)}%)`, value: "low" as const },
      {
        label: `Mid (${p33.toFixed(0)}–${p66.toFixed(0)}%)`,
        value: "mid" as const,
      },
      { label: `High (> ${p66.toFixed(0)}%)`, value: "high" as const },
    ],
    [p33, p66],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return [...technicians]
      .filter((t) => {
        const matchesSearch =
          !q ||
          (t.name ?? "").toLowerCase().includes(q) ||
          (t.email ?? "").toLowerCase().includes(q);

        const rate = t.commission ?? 0;
        const matchesCommission =
          commissionFilter === "all" ||
          (commissionFilter === "low" && rate < p33) ||
          (commissionFilter === "mid" && rate >= p33 && rate <= p66) ||
          (commissionFilter === "high" && rate > p66);

        return matchesSearch && matchesCommission;
      })
      .sort((a, b) => {
        let av = a[sortKey] ?? "";
        let bv = b[sortKey] ?? "";

        // Invert commission values for sorting since display shows 100 - value
        if (sortKey === "commission") {
          av = typeof av === "number" ? 100 - av : av;
          bv = typeof bv === "number" ? 100 - bv : bv;
        }

        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [technicians, search, commissionFilter, sortKey, sortDir, p33, p66]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner />
      </div>
    );

  if (isError)
    return (
      <div className="rounded-lg border border-zinc-200 bg-red-100 p-4 text-center dark:border-zinc-800 dark:bg-red-900/20">
        <p className="text-sm text-red-700 dark:text-red-400">
          Failed to load table
        </p>
      </div>
    );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Technicians
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {filtered.length} of {technicians.length} technicians
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full text-sm sm:w-56"
          />
          <div className="flex gap-1">
            {COMMISSION_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCommissionFilter(f.value)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  commissionFilter === f.value
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-96 max-h-96">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900">
              {(
                [
                  { key: "name", label: "Name" },
                  { key: "commission", label: "Commission" },
                  { key: "total_jobs", label: "Jobs" },
                  { key: "gross_revenue", label: "Total Gross" },
                  { key: "total_company_net", label: "Company Net" },
                  { key: "total_commission_earned", label: "Tech Earned" },
                  { key: "hired_date", label: "Hired" },
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Contact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-600"
                >
                  No technicians match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((tech) => {
                const initials = (tech.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("");
                return (
                  <tr
                    key={tech.technician_id}
                    onClick={() =>
                      openEdit({
                        id: tech.technician_id ?? "",
                        name: tech.name ?? "",
                        email: tech.email ?? null,
                        commission: tech.commission ?? 0,
                        hired_date: tech.hired_date ?? null,
                        created_at: "",
                        deleted_at: null,
                      })
                    }
                    className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {initials}
                        </div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                          {tech.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    {/* Commission */}
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {tech.commission ?? 0} %
                    </td>
                    {/* Jobs */}
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">
                      {tech.total_jobs ?? 0}
                    </td>
                    {/* Total Gross */}
                    <td className="px-4 py-3 tabular-nums text-zinc-700 dark:text-zinc-300">
                      {fmt(tech.gross_revenue ?? 0)}
                    </td>
                    {/* Company Net */}
                    <td className="px-4 py-3 tabular-nums font-medium text-cyan-700 dark:text-cyan-400">
                      {fmt(tech.total_company_net ?? 0)}
                    </td>
                    {/* Tech Earned */}
                    <td className="px-4 py-3 tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                      {fmt(tech.total_commission_earned ?? 0)}
                    </td>
                    {/* Hired */}
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                      {tech.hired_date
                        ? new Date(tech.hired_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    {/* Contact */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {tech.email || "—"}
                      </span>
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
