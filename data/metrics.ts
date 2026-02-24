import type { DashboardMetrics } from "@/types/metrics";

export const dashboardMetrics: DashboardMetrics = {
  dailyGross: 1115.0, // today: job-1 (425) + job-2 (690)
  dailyNet: 385.0, // today: job-1 (212.5) + job-2 (172.5)
  monthlyRevenue: 4220.0,
  yearToDate: 18640.0,
  totalJobs: 8,
  totalTechnicians: 3, // active only
  pendingEstimates: 2,
  dailyTrend: [
    { date: "2026-02-18", gross: 740.0, net: 330.0, jobCount: 2 },
    { date: "2026-02-19", gross: 560.0, net: 240.0, jobCount: 2 },
    { date: "2026-02-20", gross: 375.0, net: 187.5, jobCount: 1 },
    { date: "2026-02-21", gross: 760.0, net: 190.0, jobCount: 1 },
    { date: "2026-02-22", gross: 1200.0, net: 600.0, jobCount: 2 },
    { date: "2026-02-23", gross: 770.0, net: 278.75, jobCount: 2 },
    { date: "2026-02-24", gross: 1115.0, net: 385.0, jobCount: 2 },
  ],
};
