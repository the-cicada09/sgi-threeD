import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Aircraft Portfolio Explorer
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Inspect the aircraft in 3D, or dive into the lease and maintenance financials.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/aeroplane"
          className="flex w-64 flex-col items-center gap-2 rounded-2xl border border-black/8 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
        >
          <span aria-hidden className="text-4xl">
            ✈️
          </span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            3D Aeroplane
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Explore the A380 model and hotspots
          </span>
        </Link>

        <Link
          href="/charts"
          className="flex w-64 flex-col items-center gap-2 rounded-2xl border border-black/8 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
        >
          <span aria-hidden className="text-4xl">
            📊
          </span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Charts
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Lease, maintenance and revenue financials
          </span>
        </Link>
      </div>

      <Link
        href="/poc"
        className="text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        Camera &amp; lighting capabilities POC →
      </Link>
    </div>
  );
}
