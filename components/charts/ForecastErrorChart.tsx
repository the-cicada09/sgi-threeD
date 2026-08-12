"use client";

import EChart, { type EChartOption } from "./EChart";
import { ChartCard } from "./ChartCard";
import { CHART_INK, SEGMENT_COLORS } from "./theme";

const CATEGORIES = ["-10%", "-5%", "0%", "+5%", "+10%"];
const VALUES = [3, 12, 38, 24, 8];

const option: EChartOption = {
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: CATEGORIES,
    axisLine: { lineStyle: { color: CHART_INK.grid } },
    axisTick: { show: false },
    axisLabel: { color: CHART_INK.muted },
  },
  yAxis: {
    type: "value",
    min: 0,
    max: 40,
    interval: 10,
    splitLine: { lineStyle: { color: CHART_INK.grid } },
    axisLabel: { color: CHART_INK.muted },
  },
  series: [
    {
      type: "bar",
      data: VALUES,
      barWidth: 36,
      itemStyle: { color: SEGMENT_COLORS.airframe, borderRadius: [4, 4, 0, 0] },
    },
  ],
};

export function ForecastErrorChart() {
  return (
    <ChartCard title="Forecast Error Distribution" subtitle="Historical variance between projected and actuals">
      <EChart option={option} className="h-64 w-full" />
      <div className="mt-4 flex gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
        <span aria-hidden className="text-amber-500">
          ⓘ
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Statistical Insight</p>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            95% of forecast errors fall within +/- 7.5% margin. The distribution is slightly
            positively skewed due to recent lease rate escalations in the European market.
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
