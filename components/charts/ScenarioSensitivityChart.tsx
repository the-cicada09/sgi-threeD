"use client";

import EChart, { type EChartOption } from "./EChart";
import { ChartCard } from "./ChartCard";
import { CHART_INK, SCENARIO_COLORS } from "./theme";

const CATEGORIES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const SERIES = [
  { key: "base", name: "Base", color: SCENARIO_COLORS.base, dashed: false, data: [430, 450, 465, 480, 500, 575] },
  { key: "adverse", name: "Adverse", color: SCENARIO_COLORS.adverse, dashed: true, data: [400, 420, 395, 415, 430, 460] },
  { key: "severe", name: "Severe", color: SCENARIO_COLORS.severe, dashed: true, data: [320, 345, 300, 330, 345, 365] },
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
    icon: "roundRect",
    itemWidth: 10,
    itemHeight: 4,
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
    max: 600,
    interval: 150,
    splitLine: { lineStyle: { color: CHART_INK.grid } },
    axisLabel: { color: CHART_INK.muted, formatter: (value: number) => formatM(value) },
  },
  series: SERIES.map((s) => ({
    type: "line",
    name: s.name,
    data: [...s.data],
    smooth: true,
    symbol: "circle",
    symbolSize: 6,
    lineStyle: { width: 2, color: s.color, type: s.dashed ? "dashed" : "solid" },
    itemStyle: { color: s.color, borderWidth: 2, borderColor: "#fff" },
  })),
};

export function ScenarioSensitivityChart() {
  return (
    <ChartCard title="Scenario Sensitivity" subtitle="Comparative monthly projections across scenarios">
      <EChart option={option} className="h-80 w-full" />
    </ChartCard>
  );
}
