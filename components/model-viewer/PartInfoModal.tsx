"use client";

import { useEffect } from "react";
import type { PartInfo } from "./models";

/**
 * Info popup shown when the user clicks directly on the model's mesh (as
 * opposed to a hotspot pin, which zooms the camera in instead — see
 * `Scene`'s `handleModelClick` in ModelViewerCanvas.tsx). Renders as a plain
 * DOM overlay outside the Canvas, so it isn't affected by WebGL occlusion.
 */
export function PartInfoModal({
  part,
  onClose,
}: {
  part: PartInfo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!part) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [part, onClose]);

  if (!part) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="part-info-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-5 shadow-xl dark:border-white/15 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="part-info-title"
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {part.label}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {part.description}
        </p>
      </div>
    </div>
  );
}
