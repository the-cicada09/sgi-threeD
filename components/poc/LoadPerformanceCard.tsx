const ASSET_ROWS = [
  { file: "scene.gltf", role: "Scene graph / material JSON", size: "41 KB", overWire: "≈4 KB gzipped" },
  { file: "scene.bin", role: "Geometry buffers (vertices, normals, UVs)", size: "312 KB", overWire: "312 KB (binary, not compressible)" },
  { file: "material00_baseColor.png", role: "Fuselage/livery texture", size: "632 KB", overWire: "632 KB (already-compressed PNG)" },
  { file: "material02_baseColor.png", role: "Texture", size: "620 KB", overWire: "620 KB" },
  { file: "material02_metallicRoughness.png", role: "PBR metal/rough map", size: "28 KB", overWire: "28 KB" },
  { file: "material03_baseColor.png", role: "Texture", size: "624 KB", overWire: "624 KB" },
];

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-4 py-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

/**
 * Not a live demo — a written breakdown of this repo's actual A380 asset
 * payload and this app's actual HTTP cache headers (checked with curl
 * against both `next dev` and a real `next build && next start`), plus the
 * loading practices already in place vs. what would shave more off.
 */
export function LoadPerformanceCard() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label="Total payload" value="2.3 MB" />
        <StatChip label="Files fetched" value="6" />
        <StatChip label="Geometry" value="312 KB" />
        <StatChip label="Textures" value="1.9 MB" />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="text-xs text-zinc-500">
              <th className="pb-2 font-medium">File</th>
              <th className="pb-2 font-medium">What it is</th>
              <th className="pb-2 font-medium">Size</th>
              <th className="pb-2 font-medium">Over the wire</th>
            </tr>
          </thead>
          <tbody className="text-zinc-700">
            {ASSET_ROWS.map((row) => (
              <tr key={row.file} className="border-t border-zinc-100">
                <td className="py-1.5 pr-2 font-mono text-xs">{row.file}</td>
                <td className="py-1.5 pr-2 text-zinc-500">{row.role}</td>
                <td className="py-1.5 pr-2">{row.size}</td>
                <td className="py-1.5">{row.overWire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-5 space-y-4 text-sm text-zinc-700">
        <div>
          <dt className="font-semibold text-zinc-900">How long does it actually take?</dt>
          <dd className="mt-1">
            Once the fetch kicks off, the JSON, the geometry buffer, and all four textures download
            in parallel — the JSON is gzipped roughly 10:1 by Next&apos;s static file server (41 KB → ~4
            KB), but the buffer and PNGs are already-compressed binary, so gzip does nothing for
            them; the real cost is downloading that ~2.2 MB of incompressible bytes. On a decent
            broadband connection that&apos;s well under a second; on a throttled mobile connection
            (~1–2 Mbps) it can run into several seconds. Parsing the glTF and uploading geometry +
            textures to the GPU after the download typically adds well under 100 ms — it&apos;s
            network time that dominates, not parse time.
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-zinc-900">Where it&apos;s stored, and does that matter?</dt>
          <dd className="mt-1">
            The model lives under <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">public/airbus_a380_-_800/</code> and
            is served as a static file by Next — checked with curl against both <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">next dev</code> and
            a real <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">next build && next start</code>: every file in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">public/</code> comes back{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">Cache-Control: public, max-age=0</code> with just an
            ETag — the browser must revalidate on every visit (a fast 304 if unchanged, but still a
            round trip). Compare that to the app&apos;s own hashed JS bundles under{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">_next/static/chunks/</code>, which come back{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">Cache-Control: public, max-age=31536000, immutable</code> —
            54-26cached for a year, never revalidated. <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">public/</code> doesn&apos;t
            get that treatment automatically.
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-zinc-900">Can we cache it, and are we already?</dt>
          <dd className="mt-1">
            Two layers, already partly in use: (1) <strong>HTTP cache</strong> — every revisit still
            gets a fast 304 instead of a full re-download, but for real far-future caching the model
            path needs explicit headers (a <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">headers()</code> rule
            in <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">next.config.ts</code> for{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">/airbus_a380_-_800/**</code>, or moving the asset to a
            CDN/object store with a content-hashed, immutable URL) so a repeat visit skips the round
            trip entirely. (2) <strong>In-memory parse cache</strong> — this is already relied on:
            drei&apos;s <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">useGLTF</code> keeps the parsed scene keyed
            by URL, so every card on this very page and every hotspot switch on the aeroplane page
            reuses the same parsed result instead of re-fetching — only a full page reload loses it.
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-zinc-900">Best practices to load it faster</dt>
          <dd className="mt-1">
            In rough order of impact for this specific model: <strong>compress the textures</strong> —
            1.9 MB of the 2.3 MB total is four PNGs; re-exporting them as KTX2/Basis (GPU-compressed)
            or even just resizing/re-encoding as WebP would cut that by 4–10×, which dwarfs every
            other optimization here. <strong>Compress the geometry</strong> — Draco or Meshopt
            re-export shrinks <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">scene.bin</code> further
            (less impactful here since it&apos;s already the smallest file, but free once the
            pipeline exists). <strong>Set long-lived cache headers</strong> or serve from a CDN, per
            above. <strong>Keep the model out of the JS bundle</strong> — already done: the viewer is
            behind <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs">next/dynamic(..., {"{"} ssr: false {"}"})</code>,
            so three.js and the GLTF loader ship in their own chunk and never block the rest of the
            page.
          </dd>
        </div>
      </dl>
    </div>
  );
}
