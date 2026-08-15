"use client";

import { useEffect } from "react";
import type { PartInfo } from "./models";

/** Two comparable sidebar styles — see the `variant` prop below. */
export type SidebarVariant = "fixed" | "inline";

/** Positioning classes for each `variant`: "fixed" pins to the viewport (full
 *  page height, floats over everything); "inline" is a normal flex child
 *  that only spans the canvas's own height and pushes it over when open. */
const VARIANT_CLASSES: Record<SidebarVariant, string> = {
  fixed: "fixed inset-y-0 right-0 z-50",
  inline: "h-full shrink-0",
};

/**
 * Sidebar shown when the user clicks a part of the model (mesh or hotspot
 * pin — see `Scene`'s `handleModelClick`/`onPick` in ModelViewerCanvas.tsx).
 */
export function PartInfoModal({
  part,
  onClose,
  variant = "fixed",
}: {
  part: PartInfo | null;
  onClose: () => void;
  variant?: SidebarVariant;
}) {
  useEffect(() => {
    if (!part) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [part, onClose]);

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="part-info-title"
      className={`${VARIANT_CLASSES[variant]} overflow-hidden border-black/10 bg-white shadow-xl transition-[width] duration-300 dark:border-white/15 dark:bg-zinc-900 ${
        part ? "w-72 border-l" : "w-0"
      }`}
    >
      {part && (
        <div className="w-72 p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 id="part-info-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
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
      )}
    </aside>
  );
}
