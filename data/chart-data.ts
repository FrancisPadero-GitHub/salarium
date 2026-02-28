/**
 * Aggregated chart data derived from the resource reports:
 *   - YTD Summary (Jan 1 – Feb 20, 2026)
 *   - Monthly Analysis (January & February 2026)
 *   - Tech Detail Report (per-technician breakdowns)
 *   - Daily Gross & Net (daily revenue tracking)
 */

// ── Monthly revenue comparison ──────────────────────────────────────────
export const monthlyRevenue = [
  {
    month: "January",
    gross: 160925.4,
    net: 144651.5,
    companyNet: 51207.63,
    parts: 16273.9,
    jobs: 215,
  },
  {
    month: "February",
    gross: 87119.08,
    net: 83397.08,
    companyNet: 30134.64,
    parts: 3722.0,
    jobs: 168,
  },
];

// ── Per-technician YTD breakdown ────────────────────────────────────────
export const technicianBreakdown = [
  {
    name: "Yotam",
    jobs: 69,
    gross: 42855.0,
    parts: 1117.0,
    net: 41738.0,
    techPay: 31303.5,
    companyNet: 10434.5,
    split: "75/25",
    type: "Own" as const,
  },
  {
    name: "Tamir",
    jobs: 81,
    gross: 71073.01,
    parts: 8690.9,
    net: 62382.11,
    techPay: 46786.58,
    companyNet: 15595.53,
    split: "75/25",
    type: "Own" as const,
  },
  {
    name: "Shalom",
    jobs: 74,
    gross: 29183.0,
    parts: 2575.0,
    net: 26608.0,
    techPay: 19956.0,
    companyNet: 6652.0,
    split: "75/25",
    type: "Own" as const,
  },
  {
    name: "Subs",
    jobs: 159,
    gross: 104933.47,
    parts: 7613.0,
    net: 97320.47,
    techPay: 48660.24,
    companyNet: 48660.24,
    split: "50/50",
    type: "Sub" as const,
  },
];

// ── Revenue split (company vs tech) ────────────────────────────────────
export const revenueSplit = [
  { name: "Tech Pay", value: 171262.44 }, // 75%
  { name: "Company Net", value: 57087.48 }, // 25%
];

// ── Profit breakdown ───────────────────────────────────────────────────
export const profitBreakdown = [
  { category: "Company Net", value: 81342.27 },
  { category: "Parts Cost", value: 19995.9 },
  { category: "Tech Pay", value: 146706.32 },
];

// ── Daily revenue trend (extended from Feb 1–22, 2026) ─────────────────
export const dailyRevenueTrend = [
  { date: "Feb 01", gross: 4409, net: 2149.5 },
  { date: "Feb 02", gross: 4753, net: 1188.25 },
  { date: "Feb 03", gross: 0, net: 0 },
  { date: "Feb 04", gross: 8092.22, net: 3814.67 },
  { date: "Feb 05", gross: 2500, net: 860.25 },
  { date: "Feb 06", gross: 4486.84, net: 2243.42 },
  { date: "Feb 07", gross: 0, net: 0 },
  { date: "Feb 08", gross: 4095, net: 1023.75 },
  { date: "Feb 09", gross: 3686, net: 940.5 },
  { date: "Feb 10", gross: 6287.38, net: 1589.1 },
  { date: "Feb 11", gross: 1893, net: 623.25 },
  { date: "Feb 12", gross: 4828.79, net: 1516.47 },
  { date: "Feb 13", gross: 3917.57, net: 979.39 },
  { date: "Feb 14", gross: 0, net: 0 },
  { date: "Feb 15", gross: 5489, net: 1372.25 },
  { date: "Feb 16", gross: 4948.52, net: 1642.13 },
  { date: "Feb 17", gross: 3860, net: 1636 },
  { date: "Feb 18", gross: 5115, net: 2198.25 },
  { date: "Feb 19", gross: 7529, net: 2163.5 },
  { date: "Feb 20", gross: 3600.35, net: 1212.1 },
  { date: "Feb 21", gross: 0, net: 0 },
  { date: "Feb 22", gross: 952, net: 288 },
];

// ── Weekly revenue aggregation ─────────────────────────────────────────
export const weeklyRevenue = [
  { week: "Week 1 (Feb 1–7)", gross: 24241.06, net: 10256.09 },
  { week: "Week 2 (Feb 8–14)", gross: 24707.74, net: 6672.46 },
  { week: "Week 3 (Feb 15–21)", gross: 30541.87, net: 10224.23 },
  { week: "Week 4 (Feb 22+)", gross: 952, net: 288 },
];

// ── Per-technician monthly breakdown (Jan vs Feb) ──────────────────────
export const techMonthlyComparison = [
  { name: "Yotam", january: 28694, february: 14161 },
  { name: "Tamir", january: 51675.06, february: 19397.95 },
  { name: "Shalom", january: 16599, february: 12584 },
  { name: "Subs", january: 63957.34, february: 40976.13 },
];

// ── Payment method distribution (from job data) ────────────────────────
export const paymentMethodDistribution = [
  { method: "Credit Card", count: 9, amount: 17334.5 },
  { method: "Cash", count: 6, amount: 7413.95 },
  { method: "Zelle", count: 6, amount: 13088.84 },
  { method: "Check", count: 5, amount: 10222 },
];

// ── Top jobs by revenue ────────────────────────────────────────────────
export const topJobs = [
  { address: "14607 Brick Pl, Westchase", tech: "Tamir", gross: 12646.74 },
  { address: "4790 140th Ave N, Clearwater", tech: "Yotam", gross: 11100 },
  { address: "6731 Seminole Blvd", tech: "Subs", gross: 6731 },
  { address: "Silver Charm Terrace", tech: "Tamir", gross: 4735 },
  { address: "443 48th St Ct W, Palmetto", tech: "Subs", gross: 4400 },
  { address: "Silverstone Ct", tech: "Tamir", gross: 3633.84 },
  { address: "Golden Poppy Court, Orlando", tech: "Subs", gross: 3218 },
  { address: "Falcon Dr", tech: "Subs", gross: 2900 },
];

// ── Estimate status summary ────────────────────────────────────────────
export const estimateStatusData = [
  { status: "follow_up", count: 4, value: 14164 },
  { status: "approved", count: 7, value: 12280.5 },
  { status: "denied", count: 1, value: 199 },
];

// ── Estimate value by technician ───────────────────────────────────────
export const estimatesByTech = [
  { name: "Tamir", count: 4, value: 9651.5 },
  { name: "3 Bros (Sub)", count: 5, value: 14479 },
  { name: "Yotam", count: 2, value: 549 },
  { name: "Shalom", count: 1, value: 1964 },
];

// ── KPI summary for YTD ────────────────────────────────────────────────
export const ytdSummary = {
  totalJobs: 383,
  totalGross: 248044.48,
  totalParts: 19995.9,
  totalNet: 228048.58,
  companyNet: 81342.26,
  avgRevenuePerJob: 647.64,
  companyNetMargin: 32.8,
};
