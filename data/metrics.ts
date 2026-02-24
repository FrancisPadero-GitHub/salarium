import type { DashboardMetrics } from "@/types/metrics";

/**
 * Dashboard metrics derived from real spreadsheet data (DAILY GROSS & NET,
 * individual technician sheets, DAILY ESTIMATES).
 *
 * February 2026 actuals, 4 active techs:
 *   Tamir & Yotam  → 50% commission (business keeps 50%)
 *   Shalom & Aviran → 75% commission (business keeps 25%)
 *
 * Monthly gross through 2/22:  $92,968
 * Monthly net to business:     $34,228
 * January 2026 estimated gross: ~$68,000  (similar daily run-rate)
 * YTD gross (Jan + Feb):       ~$160,968
 */
export const dashboardMetrics: DashboardMetrics = {
  // Last logged business day: 2/22/2026
  dailyGross: 952,
  dailyNet: 288,
  monthlyRevenue: 92968,
  yearToDate: 160968,
  totalJobs: 26, // jobs currently in dataset
  totalTechnicians: 5, // all active
  pendingEstimates: 4, // est-1, est-2, est-3, est-11
  /**
   * Last 7 data days from DAILY GROSS & NET spreadsheet.
   * Gross = sum of all 4 tech columns for that date.
   * Net   = (Tamir + Yotam) × 0.50 + (Shalom + Aviran) × 0.25
   */
  dailyTrend: [
    { date: "2026-02-16", gross: 4948.52, net: 1642.13, jobCount: 4 },
    { date: "2026-02-17", gross: 3860.0, net: 1636.0, jobCount: 4 },
    { date: "2026-02-18", gross: 5115.0, net: 2198.25, jobCount: 5 },
    { date: "2026-02-19", gross: 7529.0, net: 2163.5, jobCount: 5 },
    { date: "2026-02-20", gross: 3600.35, net: 1212.1, jobCount: 3 },
    { date: "2026-02-21", gross: 0, net: 0, jobCount: 0 }, // Sunday, no jobs
    { date: "2026-02-22", gross: 952.0, net: 288.0, jobCount: 2 },
  ],
};
