import Link from "next/link";
import { PocCapabilityGrid } from "@/components/poc/PocCapabilityGrid";

export default function PocPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Camera &amp; Lighting POC
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Every camera and lighting capability the viewer supports, isolated one at a time on the
            Airbus A380-800 so you can see exactly what each one does.
          </p>
        </div>
        <Link
          href="/"
          className="shrink-0 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          ← Home
        </Link>
      </div>

      <PocCapabilityGrid />
    </div>
  );
}
