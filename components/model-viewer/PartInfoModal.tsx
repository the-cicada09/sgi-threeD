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

/** Badge color per maintenance status. */
const STATUS_CLASSES: Record<PartInfo["status"], string> = {
  Operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  "Scheduled Maintenance": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  "Under Inspection": "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
};

/** One label/value row in the part-record table below the description. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-right text-xs font-medium text-zinc-800 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

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
        <div className="w-72 overflow-y-auto p-5">
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

          <span
            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[part.status]}`}
          >
            {part.status}
          </span>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {part.description}
          </p>

          <dl className="mt-4 divide-y divide-black/5 border-t border-b border-black/5 dark:divide-white/10 dark:border-white/10">
            <InfoRow label="Manufacturer" value={part.manufacturer} />
            <InfoRow label="Part number" value={part.partNumber} />
            <InfoRow label="Unit cost" value={part.cost} />
            <InfoRow label="Installed" value={part.installDate} />
            <InfoRow label="Last maintenance" value={part.lastMaintenance} />
            <InfoRow label="Next maintenance" value={part.nextMaintenance} />
          </dl>
        </div>
      )}
    </aside>
  );
}
