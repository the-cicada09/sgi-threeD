"use client";

import EChart, { type EChartOption } from "./EChart";
import { ChartCard } from "./ChartCard";
import { CASHFLOW_COLORS, CHART_INK } from "./theme";

const CATEGORIES = ["Narrow Body", "Regional Jets", "Wide Body"];

const SERIES = [
  { key: "leaseRent", name: "Lease Rent", color: CASHFLOW_COLORS.leaseRent, data: [1_250_000, 900_000, 1_300_000] },
  { key: "mtxReserves", name: "Mtx Reserves", color: CASHFLOW_COLORS.mtxReserves, data: [875_000, 550_000, 1_450_000] },
  { key: "mrPayouts", name: "MR Payouts", color: CASHFLOW_COLORS.mrPayouts, data: [430_000, 350_000, 600_000] },
  { key: "lessorContributions", name: "Lessor Contributions", color: CASHFLOW_COLORS.lessorContributions, data: [230_000, 150_000, 300_000] },
] as const;

function formatUsd(value: number) {
  return `$ ${value.toLocaleString("en-US")}`;
}

const option: EChartOption = {
  color: SERIES.map((s) => s.color),
  grid: { left: 90, right: 20, top: 40, bottom: 30 },
  tooltip: {
    trigger: "axis",
    valueFormatter: (value) => formatUsd(value as number),
  },
  legend: {
    top: 0,
    left: 0,
    icon: "circle",
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { color: CHART_INK.secondary, fontSize: 12 },
  },
  xAxis: {
    type: "category",
    data: CATEGORIES,
    boundaryGap: false,
    axisLine: { lineStyle: { color: CHART_INK.grid } },
    axisTick: { show: false },
    axisLabel: { color: CHART_INK.muted },
  },
  yAxis: {
    type: "value",
    min: 0,
    max: 1_500_000,
    interval: 250_000,
    splitLine: { lineStyle: { color: CHART_INK.grid } },
    axisLabel: { color: CHART_INK.muted, formatter: (value: number) => formatUsd(value) },
  },
  series: SERIES.map((s) => ({
    type: "line",
    name: s.name,
    data: [...s.data],
    smooth: true,
    symbol: "circle",
    symbolSize: 8,
    lineStyle: { width: 2, color: s.color },
    itemStyle: { color: s.color, borderWidth: 2, borderColor: "#fff" },
  })),
};

export function CashflowsChart() {
  return (
    <ChartCard
      title="Cashflows"
      action={
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Export
        </button>
      }
    >
      <EChart option={option} className="h-80 w-full" />
    </ChartCard>
  );
}
