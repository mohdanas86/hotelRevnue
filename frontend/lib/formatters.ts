// ─────────────────────────────────────────────────────────────────────────────
// Shared formatters — currency, percentage, numbers, dates.
// All monetary values are INR from the backend.
// ─────────────────────────────────────────────────────────────────────────────

/** Format a number as INR currency — compact for display (₹1.2M) */
export function formatCurrency(value: number, compact = true): string {
  if (compact) {
    if (value >= 1_000_000_000) return `₹${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Full INR currency for tooltips */
export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a percentage value — value should already be 0-100 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Format occupancy already in 0-1 scale */
export function formatOccupancy(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/** Format large numbers with comma separators */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

/** Format a date string (YYYY-MM-DD) to a human-readable label */
export function formatDate(dateStr: string, granularity: "day" | "week" | "month" = "day"): string {
  const date = new Date(dateStr + "T00:00:00");
  if (granularity === "month") {
    return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }
  if (granularity === "week") {
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "2-digit" });
}

/** Format a timestamp to "Last updated HH:MM:SS" */
export function formatLastUpdated(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
