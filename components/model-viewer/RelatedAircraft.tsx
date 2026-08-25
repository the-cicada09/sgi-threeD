"use client";

import type { ModelName } from "./models";

export interface RelatedEntry {
  name: ModelName;
  label: string;
  category?: string;
}

/** Other models in the current model's own family (see AeroplaneExplorer's
 *  FAMILIES grouping), reusing the existing parent/child relationship rather
 *  than a separate "related items" data source. No thumbnail render pipeline
 *  exists for these glTF assets yet, so cards lead with a plane glyph instead
 *  of a fabricated image. */
export function RelatedAircraft({
  family,
  siblings,
  onSelect,
}: {
  family: string;
  siblings: RelatedEntry[];
  onSelect: (name: ModelName) => void;
}) {
  return (
    <div className="animate-fade-in border-t border-black/8 pt-6 dark:border-white/10">
      <p className="mb-3 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
        Related aircraft
      </p>
      {siblings.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          No other {family} aircraft in the registry yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {siblings.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => onSelect(s.name)}
              className="group flex flex-col items-start gap-1 rounded-lg border border-black/8 bg-white p-3 text-left transition-colors duration-150 hover:border-black/20 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/25"
            >
              <span aria-hidden className="mb-1 text-base text-zinc-300 dark:text-zinc-600">
                ✈
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{family}</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{s.label}</span>
              {s.category && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.category}</span>
              )}
              <span className="mt-1 text-xs text-zinc-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                View →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
