"use client";

import EChart, { type EChartOption } from "./EChart";
import { SEGMENT_COLORS } from "./theme";

const SEGMENT_LEGEND = [
  { key: "airframe", label: "Airframe", color: SEGMENT_COLORS.airframe },
  { key: "engines", label: "Engines", color: SEGMENT_COLORS.engines },
  { key: "apu", label: "APU", color: SEGMENT_COLORS.apu },
  { key: "landingGears", label: "Landing Gears", color: SEGMENT_COLORS.landingGears },
] as const;

export interface SegmentBars {
  airframe: number;
  engines: number;
  apu: number;
  landingGears: number;
}

export function StatTile({
  title,
  value,
  deltaPercent,
  tone,
  segmentData,
  singleSeries,
}: {
  title: string;
  value: string;
  deltaPercent: number;
  tone: "rose" | "mint";
  /** 4-segment breakdown (Airframe/Engines/APU/Landing Gears) with a legend. */
  segmentData?: SegmentBars[];
  /** A single undifferentiated series, no legend (e.g. Lease Rent). */
  singleSeries?: number[];
}) {
  const option: EChartOption = segmentData
    ? {
        grid: { left: 0, right: 0, top: 4, bottom: 0, containLabel: false },
        xAxis: { type: "category", show: false, data: segmentData.map((_, i) => i) },
        yAxis: { type: "value", show: false },
        tooltip: { trigger: "axis", axisPointer: { type: "none" } },
        series: SEGMENT_LEGEND.map(({ key, color }) => ({
          type: "bar",
          name: key,
          data: segmentData.map((d) => d[key as keyof SegmentBars]),
          barWidth: 5,
          barGap: "30%",
          itemStyle: { color, borderRadius: [2, 2, 0, 0] },
        })),
      }
    : {
        grid: { left: 0, right: 0, top: 4, bottom: 0, containLabel: false },
        xAxis: { type: "category", show: false, data: (singleSeries ?? []).map((_, i) => i) },
        yAxis: { type: "value", show: false },
        tooltip: { trigger: "axis", axisPointer: { type: "none" } },
        series: [
          {
            type: "bar",
            data: singleSeries,
            barWidth: 10,
            itemStyle: { color: SEGMENT_COLORS.landingGears, borderRadius: [3, 3, 0, 0] },
          },
        ],
      };

  const bg =
    tone === "rose"
      ? "bg-rose-50 dark:bg-rose-950/30"
      : "bg-emerald-50 dark:bg-emerald-950/20";

  return (
    <div className={`flex items-center gap-4 rounded-2xl p-6 ${bg}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        <p className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <span aria-hidden>↑</span>
          {deltaPercent}%
        </p>
      </div>

      {segmentData && (
        <ul className="hidden shrink-0 flex-col gap-1.5 sm:flex">
          {SEGMENT_LEGEND.map(({ key, label, color }) => (
            <li key={key} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              {label}
            </li>
          ))}
        </ul>
      )}

      <EChart option={option} className="h-24 w-32 shrink-0" />
    </div>
  );
}
