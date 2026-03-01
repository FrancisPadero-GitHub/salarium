import Decimal from "decimal.js";

// Configure decimal.js for financial precision
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/** Create a Decimal from a possibly-null number, defaulting to 0. */
export const d = (value: number | string | null | undefined): Decimal =>
  new Decimal(value ?? 0);

/** Sum an array of nullable numbers precisely. */
export const dSum = (values: (number | null | undefined)[]): Decimal =>
  values.reduce<Decimal>((acc, v) => acc.plus(d(v)), d(0));

/** Subtract: a - b */
export const dSub = (
  a: number | null | undefined,
  b: number | null | undefined,
): Decimal => d(a).minus(d(b));

/** Multiply: a * b */
export const dMul = (
  a: number | null | undefined,
  b: number | null | undefined,
): Decimal => d(a).times(d(b));

/** Divide: a / b — returns 0 if b is zero. */
export const dDiv = (
  a: number | null | undefined,
  b: number | null | undefined,
): Decimal => {
  const divisor = d(b);
  return divisor.isZero() ? d(0) : d(a).dividedBy(divisor);
};

/** Commission earned: netRevenue * (commissionRate / 100) */
export const dCommission = (
  netRevenue: number | null | undefined,
  commissionRate: number | null | undefined,
): Decimal => d(netRevenue).times(d(commissionRate).dividedBy(100));

/** Company net: netRevenue * (1 - commissionRate / 100) */
export const dCompanyNet = (
  netRevenue: number | null | undefined,
  commissionRate: number | null | undefined,
): Decimal => d(netRevenue).times(d(1).minus(d(commissionRate).dividedBy(100)));

/** Net revenue: subtotal - parts_total_cost */
export const dNetRevenue = (
  subtotal: number | null | undefined,
  partsCost: number | null | undefined,
): Decimal => d(subtotal).minus(d(partsCost));

/** Format a Decimal to a fixed-precision number (for display). */
export const dToNum = (value: Decimal, dp = 2): number =>
  value.toDecimalPlaces(dp, Decimal.ROUND_HALF_UP).toNumber();

/** Format a number as USD currency string. */
export const fmtUSD = (value: number | Decimal): string => {
  const num = value instanceof Decimal ? dToNum(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
};

/** Format a Decimal as a percentage string with 1 decimal place. */
export const fmtPct = (value: Decimal, dp = 1): string =>
  `${dToNum(value, dp)}%`;
