"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ModelViewer } from "./ModelViewer";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { SidebarVariant } from "./PartInfoModal";
import { Breadcrumbs } from "./Breadcrumbs";
import { ManufacturerNavigation, type FamilySummary } from "./ManufacturerNavigation";
import { ModelNavigation } from "./ModelNavigation";
import { SpecificationGrid } from "./SpecificationGrid";
import { RelatedAircraft } from "./RelatedAircraft";
import { MODELS, type ModelName } from "./models";

const MODEL_ORDER = Object.keys(MODELS) as ModelName[];

/** MODEL_ORDER grouped by `family`, preserving registry order within each
 *  group and each family's first-appearance order overall. Shared by the
 *  manufacturer nav (parent level), the model nav (child level), and the
 *  related-aircraft section (siblings within a family). */
const FAMILIES: { family: string; models: ModelName[] }[] = (() => {
  const order: string[] = [];
  const groups = new Map<string, ModelName[]>();
  for (const name of MODEL_ORDER) {
    const family = MODELS[name].family;
    if (!groups.has(family)) {
      groups.set(family, []);
      order.push(family);
    }
    groups.get(family)!.push(name);
  }
  return order.map((family) => ({ family, models: groups.get(family)! }));
})();

const FAMILY_SUMMARIES: FamilySummary[] = FAMILIES.map(({ family, models }) => ({
  family,
  count: models.length,
}));

function familyOf(model: ModelName) {
  return MODELS[model].family;
}

/** Small classification badge next to the aircraft name, e.g. "Regional Jet". */
function CategoryBadge({ children }: { children: string }) {
  return (
    <span className="rounded border border-black/10 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:border-white/15 dark:text-zinc-400">
      {children}
    </span>
  );
}

const DEFAULT_MODEL: ModelName = "airbus_a380_800";

/**
 * The aeroplane page's client half: owns which registered model is showing
 * and renders the manufacturer → model switcher, the 3D viewer, and the
 * technical-information sections below it, all on top of the same single
 * ModelViewer instance (only its `model` prop changes — CameraControls/
 * Canvas stay mounted, only the GLTF underneath swaps and re-fits).
 */
export function AeroplaneExplorer({ sidebarVariant }: { sidebarVariant?: SidebarVariant }) {
  const [model, setModel] = useState<ModelName>(DEFAULT_MODEL);
  // Which multi-model family's sub-list is expanded in ModelNavigation —
  // starts open on the initial model's own family so it's never a click away.
  const [openFamily, setOpenFamily] = useState<string>(familyOf(DEFAULT_MODEL));

  const config = MODELS[model];
  const family = config.family;

  const selectModel = (name: ModelName) => {
    setModel(name);
    setOpenFamily(familyOf(name));
  };

  const openFamilyModels = useMemo(
    () => FAMILIES.find((f) => f.family === openFamily)?.models ?? [],
    [openFamily],
  );

  const siblings = useMemo(
    () =>
      (FAMILIES.find((f) => f.family === family)?.models ?? [])
        .filter((name) => name !== model)
        .map((name) => ({ name, label: MODELS[name].label, category: MODELS[name].category })),
    [family, model],
  );

  // The breadcrumb tracks which family is open in the nav, not just which
  // model happens to be loaded — clicking "Boeing" while an Airbus is still
  // showing should read "Aircraft / Boeing", not silently keep claiming
  // you're on the Airbus. Only once the open family and the active model's
  // family agree (either it's the model's own family, or nothing else is
  // being browsed right now) does the model segment appear too.
  const breadcrumbFamily = openFamily || family;
  const breadcrumbShowsModel = breadcrumbFamily === family;

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <Breadcrumbs
          items={[
            { label: "Aircraft", href: "/" },
            { label: breadcrumbFamily, onClick: () => setOpenFamily(breadcrumbFamily) },
            ...(breadcrumbShowsModel ? [{ label: config.label }] : []),
          ]}
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
              Aircraft
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">{family}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-50">
                {config.label}
              </h1>
              {config.category && <CategoryBadge>{config.category}</CategoryBadge>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 pt-1">
            <Link
              href={sidebarVariant === "inline" ? "/aeroplane" : "/aeroplane/inline-sidebar"}
              className="text-xs font-medium text-zinc-400 transition hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
            >
              {sidebarVariant === "inline" ? "Compare: fixed sidebar →" : "Compare: inline sidebar →"}
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div>
          <ManufacturerNavigation
            families={FAMILY_SUMMARIES}
            activeFamily={family}
            openFamily={openFamily}
            onSelect={(f) => {
              const group = FAMILIES.find((g) => g.family === f);
              // A single-model family has no sub-nav row to expand (see
              // ModelNavigation, which renders nothing below 2 models) — so
              // its pill has to select that model directly, or clicking it
              // would do nothing visible at all.
              if (group?.models.length === 1) {
                selectModel(group.models[0]);
              } else {
                setOpenFamily((current) => (current === f ? "" : f));
              }
            }}
          />
          <ModelNavigation
            family={openFamily}
            models={openFamilyModels.map((name) => ({ name, label: MODELS[name].label }))}
            activeModel={model}
            onSelect={selectModel}
          />
        </div>

        <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-black/8 dark:border-white/15">
          <ModelViewer
            model={model}
            sidebarVariant={sidebarVariant}
            showToolbar
            background="radial-gradient(ellipse at 50% 40%, var(--viewer-bg-start) 0%, var(--viewer-bg-end) 100%)"
            className="h-full w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="border-t border-black/8 pt-6 dark:border-white/10">
            <h2 className="mb-3 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
              Overview
            </h2>
            {config.description ? (
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {config.description}
              </p>
            ) : (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                No overview available for this aircraft yet.
              </p>
            )}
            <dl className="mt-4 flex gap-8">
              <div>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">Manufacturer</dt>
                <dd className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {family}
                </dd>
              </div>
              {config.category && (
                <div>
                  <dt className="text-xs text-zinc-500 dark:text-zinc-400">Category</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {config.category}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <SpecificationGrid specs={config.specs} />
        </div>

        <RelatedAircraft family={family} siblings={siblings} onSelect={selectModel} />
      </div>
    </div>
  );
}
