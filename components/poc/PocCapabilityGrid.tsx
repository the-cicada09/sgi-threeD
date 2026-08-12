"use client";

import { CapabilityCard } from "./CapabilityCard";
import { CAPABILITIES } from "./capabilities";

/**
 * A Server Component can import a "use client" module's *components* fine,
 * but a plain data export (CAPABILITIES) doesn't cross that boundary the
 * same way — so the map over it lives here, client-side, rather than in
 * app/poc/page.tsx.
 */
export function PocCapabilityGrid() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2">
      {CAPABILITIES.map((capability) => (
        <CapabilityCard
          key={capability.id}
          title={capability.title}
          description={capability.description}
          lazy={!capability.static}
          className={capability.static ? "md:col-span-2" : undefined}
        >
          {capability.render()}
        </CapabilityCard>
      ))}
    </div>
  );
}
