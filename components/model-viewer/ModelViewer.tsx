"use client";

import dynamic from "next/dynamic";
import type { ModelViewerProps } from "./ModelViewerCanvas";

// three.js + fiber + drei are heavy and touch WebGL, so they're loaded only
// on the client, in their own chunk, once a <ModelViewer> actually renders.
const ModelViewerCanvas = dynamic(() => import("./ModelViewerCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
  ),
});

export type { ModelName } from "./models";
export type { EnvironmentPreset, Lighting, ModelViewerProps } from "./ModelViewerCanvas";

/** Renders a registered 3D model. Usage: <ModelViewer model="airbus_a380_800" /> */
export function ModelViewer(props: ModelViewerProps) {
  return <ModelViewerCanvas {...props} />;
}
