"use client";

export interface FamilySummary {
  family: string;
  count: number;
}

/**
 * Parent level of the aircraft switcher: one pill per manufacturer/family,
 * each showing its model count. Selecting a family with more than one model
 * expands its members in ModelNavigation below (the two components share
 * "which family is expanded" state, owned by AeroplaneExplorer) — a family
 * with just one model selects it directly, no expansion needed.
 *
 * Deliberately not a solid black pill for the active state: a soft filled
 * background + subtle border reads as "selected" without looking like every
 * other pill just went inert.
 */
export function ManufacturerNavigation({
  families,
  activeFamily,
  openFamily,
  onSelect,
}: {
  families: FamilySummary[];
  activeFamily: string;
  openFamily: string;
  onSelect: (family: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
        Manufacturers
      </p>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
        {families.map(({ family, count }) => {
          const isActive = activeFamily === family;
          const isOpen = openFamily === family;
          return (
            <button
              key={family}
              type="button"
              onClick={() => onSelect(family)}
              aria-expanded={count > 1 ? isOpen : undefined}
              aria-pressed={isActive}
              className={`flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                isActive
                  ? "border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  : "border-transparent text-zinc-500 hover:border-black/10 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:border-white/10 dark:hover:bg-zinc-900"
              }`}
            >
              {family}
              <span
                className={
                  isActive ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-300 dark:text-zinc-600"
                }
              >
                {count}
              </span>
              {count > 1 && (
                <span aria-hidden className="text-[9px] text-zinc-300 dark:text-zinc-600">
                  {isOpen ? "▾" : "▸"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
