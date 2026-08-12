"use client";

import * as echarts from "echarts/core";
import EChart, { type EChartOption } from "./EChart";
import { ChartCard } from "./ChartCard";
import { CHART_INK } from "./theme";

const CATEGORIES = ["Q1 24", "Q2 24", "Q3 24", "Q4 24", "Q1 25", "Q2 25"];

const SERIES = [
  { key: "leaseRent", name: "leaseRent", color: "#0f9b8e", stack: "pos", data: [3000, 3100, 2900, 3200, 3600, 3500] },
  { key: "maintenance", name: "maintenance", color: "#22d3ee", stack: "pos", data: [1600, 1700, 1500, 1800, 2000, 1900] },
  { key: "eol", name: "eol", color: "#3b82f6", stack: "pos", data: [600, 650, 550, 700, 800, 750] },
  { key: "opex", name: "opex", color: "#f43f5e", stack: "neg", data: [-1000, -1100, -1200, -1000, -900, -950] },
  { key: "capex", name: "capex", color: "#9ca3af", stack: "neg", data: [-1500, -1700, -2300, -1600, -1300, -1200] },
] as const;

function formatM(value: number) {
  return `$${value}M`;
}

const option: EChartOption = {
  color: SERIES.map((s) => s.color),
  grid: { left: 70, right: 20, top: 40, bottom: 30 },
  tooltip: {
    trigger: "axis",
    valueFormatter: (value) => formatM(value as number),
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
    min: -3500,
    max: 10500,
    interval: 3500,
    splitLine: { lineStyle: { color: CHART_INK.grid } },
    axisLabel: { color: CHART_INK.muted, formatter: (value: number) => formatM(value) },
  },
  series: SERIES.map((s) => ({
    type: "line",
    name: s.name,
    data: [...s.data],
    stack: s.stack,
    smooth: true,
    symbol: "none",
    lineStyle: { width: 1.5, color: s.color },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: `${s.color}66` },
        { offset: 1, color: `${s.color}0d` },
      ]),
    },
  })),
};

export function ProjectedCashflowChart() {
  return (
    <ChartCard
      title="Projected Cashflow by Segment"
      subtitle="Forecasted revenue streams vs mandatory outflows"
      action={
        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
          FY24-FY25 PROJECTION
        </span>
      }
    >
      <EChart option={option} className="h-80 w-full" />
    </ChartCard>
  );
}
