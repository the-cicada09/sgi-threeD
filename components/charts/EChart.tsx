"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  BarChart,
  LineChart,
  CustomChart,
  type BarSeriesOption,
  type LineSeriesOption,
  type CustomSeriesOption,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  type GridComponentOption,
  type TooltipComponentOption,
  type LegendComponentOption,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  LineChart,
  CustomChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

export type EChartOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | CustomSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
>;

/** Thin, dependency-free wrapper around echarts/core: mounts one instance per
 *  div, keeps it in sync with `option`, and disposes it on unmount. Charts are
 *  client-only (canvas + ResizeObserver), so every caller carries "use client". */
export default function EChart({
  option,
  className,
  style,
}: {
  option: EChartOption;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={containerRef} className={className} style={style} />;
}
