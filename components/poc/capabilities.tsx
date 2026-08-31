"use client";

import { useRef, useState, type ReactNode } from "react";
import type { CameraControlsImpl } from "@react-three/drei";
import * as THREE from "three";
import {
  ModelViewer,
  type EnvironmentPreset,
} from "@/components/model-viewer/ModelViewer";
import { frame } from "@/components/model-viewer/frame";
import { LoadPerformanceCard } from "./LoadPerformanceCard";

const MODEL = "vietnam_airlines_a321_200" as const;
const GLB_MODEL = "vietnam_airlines_a321_200" as const;

// Every demo below renders the same production <ModelViewer> the aeroplane
// page uses — this backdrop just makes each card's canvas read as a distinct
// stage against the white card, since ModelViewer itself defaults to
// transparent (letting whatever page it's on show through).
const DAY_BACKDROP = "#dbe6f1";
const NIGHT_BACKDROP = "#050810";

function DemoButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
    >
      {children}
    </button>
  );
}

function ControlsRow({ children }: { children: ReactNode }) {
  return <div className="mt-3 flex flex-wrap gap-2">{children}</div>;
}

// --- Zoom -------------------------------------------------------------

function ZoomDemo() {
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  return (
    <>
      <ModelViewer
        model={MODEL}
        controlsRef={controlsRef}
        minDistance={2.5}
        maxDistance={14}
        enableRotate={false}
        enablePan={false}
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton onClick={() => controlsRef.current?.dolly(1.5, true)}>
          Zoom in
        </DemoButton>
        <DemoButton onClick={() => controlsRef.current?.dolly(-1.5, true)}>
          Zoom out
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Orbit (cursor rotate) --------------------------------------------

function OrbitDemo() {
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  return (
    <>
      <ModelViewer
        model={MODEL}
        controlsRef={controlsRef}
        enableZoom={false}
        enablePan={false}
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton
          onClick={() => controlsRef.current?.rotate(-Math.PI / 4, 0, true)}
        >
          Rotate left
        </DemoButton>
        <DemoButton
          onClick={() => controlsRef.current?.rotate(Math.PI / 4, 0, true)}
        >
          Rotate right
        </DemoButton>
        <DemoButton
          onClick={() => controlsRef.current?.rotate(0, -Math.PI / 6, true)}
        >
          Tilt up
        </DemoButton>
        <DemoButton
          onClick={() => controlsRef.current?.rotate(0, Math.PI / 6, true)}
        >
          Tilt down
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Pan -----------------------------------------------------------------

function PanDemo() {
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  return (
    <>
      <ModelViewer
        model={MODEL}
        controlsRef={controlsRef}
        enableZoom={false}
        enableRotate={false}
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton onClick={() => controlsRef.current?.truck(-0.6, 0, true)}>
          Pan left
        </DemoButton>
        <DemoButton onClick={() => controlsRef.current?.truck(0.6, 0, true)}>
          Pan right
        </DemoButton>
        <DemoButton onClick={() => controlsRef.current?.truck(0, 0.6, true)}>
          Pan up
        </DemoButton>
        <DemoButton onClick={() => controlsRef.current?.truck(0, -0.6, true)}>
          Pan down
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Auto-rotate -----------------------------------------------------------

function AutoRotateDemo() {
  const [spinning, setSpinning] = useState(true);
  return (
    <>
      <ModelViewer
        model={MODEL}
        autoRotate={spinning}
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton onClick={() => setSpinning((v) => !v)}>
          {spinning ? "Pause spin" : "Resume spin"}
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Lighting (day / night) -------------------------------------------

function LightingDemo() {
  const [lighting, setLighting] = useState<"day" | "night">("day");
  return (
    <>
      <ModelViewer
        model={MODEL}
        lighting={lighting}
        background={lighting === "day" ? DAY_BACKDROP : NIGHT_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton onClick={() => setLighting("day")}>☀️ Day rig</DemoButton>
        <DemoButton onClick={() => setLighting("night")}>
          🌙 Night rig
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Environment reflections (HDRI) -------------------------------------

const ENV_PRESETS: { id: EnvironmentPreset; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "sunset", label: "Sunset" },
  { id: "city", label: "City" },
  { id: "night", label: "Night" },
];

function EnvironmentDemo() {
  const [preset, setPreset] = useState<EnvironmentPreset>("studio");
  const [showBackground, setShowBackground] = useState(false);
  return (
    <>
      <ModelViewer
        model={MODEL}
        environmentPreset={preset}
        environmentBackground={showBackground}
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        {ENV_PRESETS.map(({ id, label }) => (
          <DemoButton key={id} onClick={() => setPreset(id)}>
            {label}
            {preset === id ? " ✓" : ""}
          </DemoButton>
        ))}
        <DemoButton onClick={() => setShowBackground((v) => !v)}>
          {showBackground ? "Hide HDRI backdrop" : "Show HDRI backdrop"}
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Reset / fit-to-bounds ----------------------------------------------

function ResetViewDemo() {
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  const boundsRef = useRef<THREE.Box3 | null>(null);
  return (
    <>
      <ModelViewer
        model={MODEL}
        controlsRef={controlsRef}
        boundsRef={boundsRef}
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton onClick={() => controlsRef.current?.dolly(2.5, true)}>
          Zoom way in
        </DemoButton>
        <DemoButton onClick={() => controlsRef.current?.truck(1.2, 0.6, true)}>
          Pan off-model
        </DemoButton>
        <DemoButton
          onClick={() => {
            if (controlsRef.current && boundsRef.current) {
              frame(controlsRef.current, boundsRef.current, true);
            }
          }}
        >
          Reset view
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --- Hotspot click-to-zoom (reuses the production viewer as-is) ---------

function HotspotDemo() {
  return (
    <ModelViewer
      model={MODEL}
      className="h-72 w-full overflow-hidden rounded-xl"
    />
  );
}

// --- .glb format (different model, same pipeline) -----------------------

function GlbFormatDemo() {
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  return (
    <>
      <ModelViewer
        model={GLB_MODEL}
        controlsRef={controlsRef}
        autoRotate
        background={DAY_BACKDROP}
        className="h-72 w-full overflow-hidden rounded-xl"
      />
      <ControlsRow>
        <DemoButton onClick={() => controlsRef.current?.dolly(1.5, true)}>
          Zoom in
        </DemoButton>
        <DemoButton
          onClick={() => controlsRef.current?.rotate(Math.PI / 4, 0, true)}
        >
          Rotate
        </DemoButton>
      </ControlsRow>
    </>
  );
}

// --------------------------------------------------------------------------

export interface Capability {
  id: string;
  title: string;
  description: string;
  render: () => ReactNode;
  /** Static content with no WebGL canvas: render immediately, skip the
   *  scroll-into-view gate, and let it span the full grid width. */
  static?: boolean;
}

export const CAPABILITIES: Capability[] = [
  {
    id: "zoom",
    title: "Zoom (dolly)",
    description:
      "Scroll, pinch, or the buttons below move the camera along its line of sight — a dolly, not a focal-length change — so panel-level detail stays in true perspective as you get close.",
    render: () => <ZoomDemo />,
  },
  {
    id: "orbit",
    title: "Rotate with the cursor (orbit)",
    description:
      'Left-click-drag (or a one-finger touch-drag) orbits the camera around the aircraft\'s centre on both azimuth and polar axes — this is what reads as "spinning the model" with the mouse.',
    render: () => <OrbitDemo />,
  },
  {
    id: "pan",
    title: "Pan",
    description:
      "Right-click-drag (or a two-finger drag) slides the camera's target sideways without rotating — for lining up a specific panel instead of orbiting past it.",
    render: () => <PanDemo />,
  },
  {
    id: "auto-rotate",
    title: "Auto-rotate",
    description:
      "A hands-free turntable spin: every frame nudges the camera's azimuth angle by a fixed amount regardless of user input, so the aircraft slowly rotates in place for a showcase view.",
    render: () => <AutoRotateDemo />,
  },
  {
    id: "lighting",
    title: "Lighting — day vs. night",
    description:
      "Swaps the light rig's ambient/hemisphere/directional intensities and the scene background between a bright daylight setup and a dim night rig — shows how the fuselage's metallic paint and shadow contrast respond to light, independent of the page's own light/dark theme.",
    render: () => <LightingDemo />,
  },
  {
    id: "environment",
    title: "Environment reflections (HDRI)",
    description:
      "Swaps the image-based-lighting environment map behind the scene — the fuselage's metallic paint and glass reflect the surrounding preset (studio softbox, sunset sky, city skyline) instead of just responding to the fixed light rig above.",
    render: () => <EnvironmentDemo />,
  },
  {
    id: "reset",
    title: "Reset / fit to bounds",
    description:
      "However far you've zoomed or panned off-model, this recomputes the aircraft's bounding sphere and animates the camera back to a frame that fits the whole aircraft.",
    render: () => <ResetViewDemo />,
  },
  {
    id: "hotspot",
    title: "Hotspot click-to-zoom",
    description:
      'Each labeled pin is a named hotspot in the model registry; clicking one fits the camera to that part\'s bounding box for a close look, then "Reset view" zooms back out to the full aircraft.',
    render: () => <HotspotDemo />,
  },
  {
    id: "glb-format",
    title: ".glb format (different model, same pipeline)",
    description:
      "A totally different aircraft loaded from a single .glb file — one binary container instead of the A380's .gltf JSON + .bin + 4 loose PNGs — proving useGLTF()/GLTFLoader handle both formats identically with zero code changes, just a different path in the model registry.",
    render: () => <GlbFormatDemo />,
  },
  {
    id: "performance",
    title: "Loading time, storage & caching",
    description:
      "Not a camera/lighting toggle — a measured breakdown of this A380 model's real payload, this app's actual HTTP cache headers, and where the load time really goes.",
    render: () => <LoadPerformanceCard />,
    static: true,
  },
];
