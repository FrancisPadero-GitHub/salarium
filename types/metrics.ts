export interface DailyMetrics {
  date: string; // ISO date string
  gross: number;
  net: number;
  jobCount: number;
}

export interface DashboardMetrics {
  dailyGross: number;
  dailyNet: number;
  monthlyRevenue: number;
  yearToDate: number;
  totalJobs: number;
  totalTechnicians: number;
  pendingEstimates: number;
  dailyTrend: DailyMetrics[]; // last 7 days
}
