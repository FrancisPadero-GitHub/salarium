import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CommissionFilter = "all" | "low" | "mid" | "high";
export type SortKey =
  | "name"
  | "commission"
  | "total_jobs"
  | "gross_revenue"
  | "total_company_net"
  | "total_commission_earned"
  | "hired_date";
export type SortDir = "asc" | "desc";

interface FilterState {
  search: string;
  commissionFilter: CommissionFilter;
  sortKey: SortKey;
  sortDir: SortDir;
  showRemoved: boolean;

  setSearch: (search: string) => void;
  setCommissionFilter: (filter: CommissionFilter) => void;
  setSortKey: (key: SortKey) => void;
  setSortDir: (dir: SortDir) => void;
  setShowRemoved: (show: boolean) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  commissionFilter: "all" as CommissionFilter,
  sortKey: "name" as SortKey,
  sortDir: "asc" as SortDir,
  showRemoved: false,
};

export const useFilterTechTable = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,
      setSearch: (search) => set({ search }),
      setCommissionFilter: (commissionFilter) => set({ commissionFilter }),
      setSortKey: (sortKey) => set({ sortKey }),
      setSortDir: (sortDir) => set({ sortDir }),
      setShowRemoved: (showRemoved) => set({ showRemoved }),
      reset: () => set(initialState),
    }),
    {
      name: "tech-table-filters", // localStorage key
    },
  ),
);
