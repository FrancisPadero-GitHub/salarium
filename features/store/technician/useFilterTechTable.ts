import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CommissionFilter = "all" | "low" | "mid" | "high";
export type SortKey =
  | "name"
  | "commission_rate"
  | "total_jobs"
  | "total_gross"
  | "total_company_earned"
  | "total_earned"
  | "hired_date";
export type SortDir = "asc" | "desc";

interface FilterState {
  search: string;
  commissionFilter: CommissionFilter;
  sortKey: SortKey;
  sortDir: SortDir;

  setSearch: (search: string) => void;
  setCommissionFilter: (filter: CommissionFilter) => void;
  setSortKey: (key: SortKey) => void;
  setSortDir: (dir: SortDir) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  commissionFilter: "all" as CommissionFilter,
  sortKey: "name" as SortKey,
  sortDir: "asc" as SortDir,
};

export const useFilterTechTable = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,
      setSearch: (search) => set({ search }),
      setCommissionFilter: (commissionFilter) => set({ commissionFilter }),
      setSortKey: (sortKey) => set({ sortKey }),
      setSortDir: (sortDir) => set({ sortDir }),
      reset: () => set(initialState),
    }),
    {
      name: "tech-table-filters", // localStorage key
    },
  ),
);
