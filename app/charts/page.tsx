import Link from "next/link";
import { StatTile } from "@/components/charts/StatTile";
import { CashflowsChart } from "@/components/charts/CashflowsChart";
import { ProjectedCashflowChart } from "@/components/charts/ProjectedCashflowChart";
import { RevenueWaterfallChart } from "@/components/charts/RevenueWaterfallChart";
import { ScenarioSensitivityChart } from "@/components/charts/ScenarioSensitivityChart";
import { ForecastErrorChart } from "@/components/charts/ForecastErrorChart";

const MR_PAYOUTS = [
  { airframe: 55, engines: 80, apu: 15, landingGears: 12 },
  { airframe: 40, engines: 55, apu: 10, landingGears: 8 },
  { airframe: 60, engines: 90, apu: 18, landingGears: 14 },
  { airframe: 65, engines: 95, apu: 16, landingGears: 13 },
  { airframe: 45, engines: 62, apu: 12, landingGears: 9 },
  { airframe: 58, engines: 78, apu: 14, landingGears: 11 },
  { airframe: 38, engines: 50, apu: 9, landingGears: 7 },
];

const LESSOR_CONTRIBUTIONS = [
  { airframe: 30, engines: 42, apu: 8, landingGears: 6 },
  { airframe: 22, engines: 30, apu: 6, landingGears: 4 },
  { airframe: 34, engines: 48, apu: 9, landingGears: 7 },
  { airframe: 36, engines: 52, apu: 10, landingGears: 8 },
  { airframe: 24, engines: 33, apu: 6, landingGears: 5 },
  { airframe: 32, engines: 44, apu: 8, landingGears: 6 },
  { airframe: 20, engines: 27, apu: 5, landingGears: 4 },
];

const MAINTENANCE_RESERVES = [
  { airframe: 60, engines: 100, apu: 20, landingGears: 16 },
  { airframe: 45, engines: 65, apu: 13, landingGears: 10 },
  { airframe: 68, engines: 105, apu: 22, landingGears: 17 },
  { airframe: 72, engines: 110, apu: 20, landingGears: 15 },
  { airframe: 50, engines: 72, apu: 14, landingGears: 11 },
  { airframe: 64, engines: 92, apu: 17, landingGears: 13 },
  { airframe: 42, engines: 58, apu: 11, landingGears: 8 },
];

const LEASE_RENT = [70, 45, 68, 95, 82, 55, 40];

export default function ChartsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Portfolio Financials
        </h1>
        <Link
          href="/aeroplane"
          className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          ← View 3D model
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
        <StatTile title="MR Payouts" value="$ 560,000" deltaPercent={25} tone="rose" segmentData={MR_PAYOUTS} />
        <StatTile title="Lessor Contributions" value="$ 250,000" deltaPercent={12} tone="rose" segmentData={LESSOR_CONTRIBUTIONS} />
        <StatTile title="Lease Rent" value="$ 1.35 M" deltaPercent={18} tone="mint" singleSeries={LEASE_RENT} />
        <StatTile title="Maintenance Reserves" value="$ 1.48 M" deltaPercent={29} tone="mint" segmentData={MAINTENANCE_RESERVES} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-2">
        <CashflowsChart />
        <ProjectedCashflowChart />
        <RevenueWaterfallChart />
        <ScenarioSensitivityChart />
        <div className="xl:col-span-2">
          <ForecastErrorChart />
        </div>
      </div>
    </div>
  );
}
