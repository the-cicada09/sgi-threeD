/** Fixed categorical colors, matched to the reference dashboard mockups. Keep
 *  hue assignment stable across charts: a segment/series always gets the same
 *  color no matter which chart it appears in. */
export const SEGMENT_COLORS = {
  airframe: "#0f9b8e",
  engines: "#ef4444",
  apu: "#22d3ee",
  landingGears: "#f5a623",
} as const;

export const CASHFLOW_COLORS = {
  leaseRent: "#0f9b8e",
  mtxReserves: "#3b82f6",
  mrPayouts: "#ef4444",
  lessorContributions: "#f5a623",
} as const;

export const SCENARIO_COLORS = {
  base: "#0f9b8e",
  adverse: "#f5a623",
  severe: "#ef4444",
} as const;

export const CHART_INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
} as const;
