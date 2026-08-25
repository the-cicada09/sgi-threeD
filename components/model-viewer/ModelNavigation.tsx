"use client";

import type { ModelName } from "./models";

export interface ModelNavEntry {
  name: ModelName;
  label: string;
}

/**
 * Child level of the aircraft switcher: the individual models inside the
 * manufacturer currently expanded in ManufacturerNavigation above. Renders
 * nothing for a single-model family — see that component's own note on why.
 */
export function ModelNavigation({
  family,
  models,
  activeModel,
  onSelect,
}: {
  family: string;
  models: ModelNavEntry[];
  activeModel: ModelName;
  onSelect: (name: ModelName) => void;
}) {
  if (models.length < 2) return null;
  return (
    <div className="animate-fade-in mt-2 border-l-2 border-black/10 pl-3 dark:border-white/10">
      <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
        {family} models
      </p>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
        {models.map(({ name, label }) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            aria-pressed={activeModel === name}
            className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
              activeModel === name
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                : "border-black/10 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
