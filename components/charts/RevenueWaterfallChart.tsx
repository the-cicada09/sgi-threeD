"use client";

import EChart, { type EChartOption } from "./EChart";
import { ChartCard } from "./ChartCard";
import { CHART_INK } from "./theme";

const CATEGORIES = ["Gross Revenue", "OPEX", "Maintenance", "CAPEX", "Net Cashflow"];

// Gross Revenue and Net Cashflow are absolute totals (drawn from 0); OPEX,
// Maintenance and CAPEX are the deltas between them, drawn from a running
// base so the bars float and read as a waterfall.
const VALUES = [5800, -1450, -850, -1200, 1850];
const IS_TOTAL = [true, false, false, false, true];

let running = 0;
const base: number[] = [];
const bars: number[] = [];
VALUES.forEach((value, i) => {
  if (IS_TOTAL[i]) {
    base.push(0);
    bars.push(value);
    running = value;
  } else {
    const start = running + value;
    base.push(Math.min(running, start));
    bars.push(Math.abs(value));
    running = start;
  }
});

function formatM(value: number) {
  const sign = value < 0 ? "-" : "";
  return `$${sign}${Math.abs(value)}M`;
}

const option: EChartOption = {
  grid: { left: 60, right: 20, top: 30, bottom: 30 },
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      const p = Array.isArray(params) ? params[params.length - 1] : params;
      const i = p.dataIndex as number;
      return `${CATEGORIES[i]}<br/>${formatM(VALUES[i])}`;
    },
  },
  xAxis: {
    type: "category",
    data: CATEGORIES,
    axisLine: { lineStyle: { color: CHART_INK.grid } },
    axisTick: { show: false },
    axisLabel: { color: CHART_INK.muted },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: CHART_INK.grid } },
    axisLabel: { color: CHART_INK.muted, formatter: (value: number) => `${value}` },
  },
  series: [
    {
      type: "bar",
      name: "base",
      stack: "waterfall",
      data: base,
      itemStyle: { color: "transparent" },
      silent: true,
      emphasis: { disabled: true },
    },
    {
      type: "bar",
      name: "value",
      stack: "waterfall",
      data: bars,
      barWidth: 48,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params) => (IS_TOTAL[params.dataIndex] ? "#0f9b8e" : "#ef4444"),
      },
      label: {
        show: true,
        position: "top",
        color: CHART_INK.secondary,
        fontWeight: 600,
        formatter: (params) => formatM(VALUES[params.dataIndex as number]),
      },
    },
  ],
};

export function RevenueWaterfallChart() {
  return (
    <ChartCard title="Revenue Waterfall" subtitle="Decomposition of Gross Revenue to Net Cashflow (FY24)">
      <EChart option={option} className="h-80 w-full" />
    </ChartCard>
  );
}
