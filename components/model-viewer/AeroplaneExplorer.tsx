"use client";

import { useState } from "react";
import Link from "next/link";
import { ModelViewer } from "./ModelViewer";
import type { SidebarVariant } from "./PartInfoModal";
import { MODELS, type ModelName } from "./models";

const MODEL_ORDER = Object.keys(MODELS) as ModelName[];

/**
 * The aeroplane page's client half: owns which registered model is showing
 * and renders a switcher for it, on top of the same single ModelViewer
 * instance (only its `model` prop changes — CameraControls/Canvas stay
 * mounted, only the GLTF underneath swaps and re-fits).
 */
export function AeroplaneExplorer({ sidebarVariant }: { sidebarVariant?: SidebarVariant }) {
  const [model, setModel] = useState<ModelName>("airbus_a380_800");

  return (
    <div className="flex flex-1 flex-col items-center gap-4 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {MODELS[model].label}
          </h1>
          <div className="mt-2 flex gap-2">
            {MODEL_ORDER.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setModel(name)}
                aria-pressed={model === name}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  model === name
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-black/10 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {MODELS[name].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/"
            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            ← Home
          </Link>
          <Link
            href={sidebarVariant === "inline" ? "/aeroplane" : "/aeroplane/inline-sidebar"}
            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {sidebarVariant === "inline" ? "Compare: fixed sidebar →" : "Compare: inline sidebar →"}
          </Link>
          <Link
            href="/charts"
            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            View charts →
          </Link>
        </div>
      </div>
      <ModelViewer
        model={model}
        sidebarVariant={sidebarVariant}
        className="h-[60vh]! w-full max-w-6xl rounded-xl border border-black/8 dark:border-white/15"
      />
    </div>
  );
}
