import type { AircraftSpecs } from "./models";

const DIMENSION_FIELDS: { key: keyof AircraftSpecs; label: string }[] = [
  { key: "length", label: "Length" },
  { key: "wingspan", label: "Wingspan" },
  { key: "height", label: "Height" },
  { key: "passengers", label: "Passengers" },
];

const PERFORMANCE_FIELDS: { key: keyof AircraftSpecs; label: string }[] = [
  { key: "cruiseSpeed", label: "Cruise speed" },
  { key: "range", label: "Range" },
  { key: "serviceCeiling", label: "Service ceiling" },
  { key: "engine", label: "Engine" },
];

function SpecGroup({
  title,
  fields,
  specs,
}: {
  title: string;
  fields: typeof DIMENSION_FIELDS;
  specs: AircraftSpecs;
}) {
  const present = fields.filter((f) => specs[f.key]);
  if (present.length === 0) return null;
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
        {title}
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {present.map(({ key, label }) => (
          <div key={key}>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {specs[key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Typical production dimensions/performance for the selected aircraft type —
 *  reads straight from MODELS[model].specs (see models.ts's AircraftSpecs),
 *  rendering only the fields a given model actually has. Shows a clean empty
 *  state instead of blank space when a model has no spec sheet at all. */
export function SpecificationGrid({ specs }: { specs?: AircraftSpecs }) {
  if (!specs || Object.keys(specs).length === 0) {
    return (
      <div className="border-t border-black/8 pt-6 text-sm text-zinc-400 dark:border-white/10 dark:text-zinc-500">
        Specifications unavailable for this aircraft yet.
      </div>
    );
  }
  return (
    <div className="animate-fade-in flex flex-col gap-6 border-t border-black/8 pt-6 dark:border-white/10">
      <SpecGroup title="Dimensions" fields={DIMENSION_FIELDS} specs={specs} />
      <SpecGroup title="Performance" fields={PERFORMANCE_FIELDS} specs={specs} />
    </div>
  );
}
