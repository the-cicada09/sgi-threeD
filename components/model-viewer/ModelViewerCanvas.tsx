"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  Html,
  useProgress,
  type CameraControlsImpl,
} from "@react-three/drei";
import * as THREE from "three";
import Model from "./Model";
import { PartInfoModal, type SidebarVariant } from "./PartInfoModal";
import { frame } from "./frame";
import { MODELS, type Hotspot, type ModelName, type PartInfo } from "./models";

export type Lighting = "day" | "night";

/** Mirrors drei's PresetsType (not re-exported from the package root), so this
 *  stays a plain string union instead of reaching into drei's internals. */
export type EnvironmentPreset =
  | "apartment"
  | "city"
  | "dawn"
  | "forest"
  | "lobby"
  | "night"
  | "park"
  | "studio"
  | "sunset"
  | "warehouse";

/** Two fixed light rigs: the default "day" rig is what every production page
 *  has always used; "night" exists so the /poc lighting demo can show a real
 *  before/after on the model's materials, not just a page-level dark class.
 *  Pure lighting intensities only — deliberately has no opinion on canvas
 *  backdrop color, see the `background` prop below. */
const LIGHT_RIGS: Record<Lighting, { ambient: number; hemi: number; dir: number }> = {
  day: { ambient: 0.6, hemi: 0.35, dir: 3.4 },
  night: { ambient: 0.06, hemi: 0.04, dir: 0.5 },
};

export interface ModelViewerProps {
  /** Key from the model registry, e.g. "airbus_a380_800" */
  model: ModelName;
  /** Slowly spins the model. Off by default to avoid a perpetual render loop. */
  autoRotate?: boolean;
  /** Scroll/pinch dolly. Default true. */
  enableZoom?: boolean;
  /** Left-click/one-finger drag orbit. Default true. */
  enableRotate?: boolean;
  /** Right-click/two-finger drag pan. Default true. */
  enablePan?: boolean;
  /** Clamp how close/far the camera can dolly. Unconstrained (library defaults) if omitted. */
  minDistance?: number;
  maxDistance?: number;
  /** Ambient/hemisphere/directional rig. Default "day" — every existing page's look. */
  lighting?: Lighting;
  /** HDRI image-based lighting/reflections, loaded from drei's asset CDN at
   *  runtime. Off by default — this is additive to the `lighting` rig above. */
  environmentPreset?: EnvironmentPreset;
  /** Show the HDRI itself as the canvas background, not just its reflections. */
  environmentBackground?: boolean;
  /** Renders the model registry's hotspot pins and click-to-zoom. Default
   *  true; only visible for models that actually define hotspots. */
  enableHotspots?: boolean;
  /** Style of the part-info sidebar: "fixed" (default) pins it to the
   *  viewport, full page height; "inline" makes it a flex sibling of the
   *  canvas that only spans the canvas's height and pushes it over. */
  sidebarVariant?: SidebarVariant;
  /** External camera-controls ref, so a caller can drive zoom/rotate/pan/reset
   *  imperatively (buttons, etc). A local ref is used if omitted. */
  controlsRef?: RefObject<CameraControlsImpl | null>;
  /** External bounding-box ref, populated once the model is framed. */
  boundsRef?: RefObject<THREE.Box3 | null>;
  /** Canvas backdrop color. Omitted by default (transparent — the parent
   *  page's own background shows through, as every production page expects);
   *  set explicitly where a demo wants a visibly distinct backdrop. */
  background?: string;
  className?: string;
}

const PADDING = { paddingLeft: 0.3, paddingRight: 0.3, paddingTop: 0.3, paddingBottom: 0.3 };

/** True if `point` falls within a hotspot's [min, max] box. */
function boxContainsPoint(box: Hotspot["box"], point: THREE.Vector3) {
  const [min, max] = box;
  return (
    point.x >= min[0] &&
    point.x <= max[0] &&
    point.y >= min[1] &&
    point.y <= max[1] &&
    point.z >= min[2] &&
    point.z <= max[2]
  );
}

/** Identifies which named part (if any) a direct click on the model landed
 *  on: the first hotspot whose box contains the point, or null if the click
 *  landed elsewhere on the body (no info to show there). */
function findClickedPart(model: ModelName, point: THREE.Vector3): PartInfo | null {
  const hotspots = MODELS[model].hotspots ?? [];
  return hotspots.find((hotspot) => boxContainsPoint(hotspot.box, point)) ?? null;
}

// Dev-only: click the model to log its local-space coordinates to the console,
// so new hotspot `marker`/`box` values can be read off directly instead of guessed.
// Always on in dev regardless of `enableHotspots` — it's how you'd discover the
// coordinates for a model that has none yet. Stripped from production builds.
const PICK_COORDINATES = process.env.NODE_ENV === "development";

class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("ModelViewer failed to load model:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
          Failed to load 3D model.
        </div>
      );
    }
    return this.props.children;
  }
}

function ProgressOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
      Loading {Math.round(progress)}%
    </div>
  );
}

/** Loads the model, frames the camera to it, and renders its hotspot pins
 *  (hidden while one is already active, so a zoomed-in pin can't cover the others). */
function Scene({
  model,
  autoRotate,
  enableHotspots,
  activeId,
  controlsRef,
  boundsRef,
  onPick,
  onPartClick,
}: {
  model: ModelName;
  autoRotate: boolean;
  enableHotspots: boolean;
  activeId: string | null;
  controlsRef: RefObject<CameraControlsImpl | null>;
  boundsRef: RefObject<THREE.Box3 | null>;
  onPick: (hotspot: Hotspot) => void;
  onPartClick: (part: PartInfo) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const hotspots = enableHotspots ? (MODELS[model].hotspots ?? []) : [];
  const [pickedPoint, setPickedPoint] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!groupRef.current || !controlsRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    boundsRef.current = box;
    frame(controlsRef.current, box, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useFrame((_, delta) => {
    if (autoRotate && controlsRef.current) {
      controlsRef.current.azimuthAngle += delta * 0.15;
    }
  });

  const handleModelClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!groupRef.current) return;
      event.stopPropagation();
      // event.point is world space; hotspot marker/box values are local space
      // (the group has no transform of its own, but converting stays correct
      // even if that ever changes).
      const local = groupRef.current.worldToLocal(event.point.clone());

      if (PICK_COORDINATES) {
        const round = (n: number) => Math.round(n * 100) / 100;
        setPickedPoint(local);
        console.log(
          `[hotspot-picker] [${round(local.x)}, ${round(local.y)}, ${round(local.z)}]`,
        );
      }

      const part = findClickedPart(model, local);
      if (part) onPartClick(part);
    },
    [model, onPartClick],
  );

  return (
    <group ref={groupRef} onClick={handleModelClick}>
      <Model name={model} />
      {PICK_COORDINATES && pickedPoint && (
        <mesh position={pickedPoint}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="red" depthTest={false} />
        </mesh>
      )}
      {activeId === null &&
        hotspots.map((hotspot) => (
          <Html key={hotspot.id} position={hotspot.marker} center occlude distanceFactor={8}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPick(hotspot);
              }}
              className="cursor-pointer rounded-full border border-white/40 bg-black/70 px-3 py-1 text-xs font-medium whitespace-nowrap text-white backdrop-blur transition hover:scale-105 hover:bg-black/90"
            >
              {hotspot.label}
            </button>
          </Html>
        ))}
    </group>
  );
}

/**
 * The one configurable viewer stack used everywhere a model renders — the
 * production aeroplane page, the /poc capability cards, all of it. Every
 * capability (zoom/rotate/pan, auto-rotate, lighting, HDRI environment,
 * hotspots) is a prop with a default that reproduces the original production
 * look, so existing callers don't need to change anything to keep working.
 */
export default function ModelViewerCanvas({
  model,
  autoRotate = false,
  enableZoom = true,
  enableRotate = true,
  enablePan = true,
  minDistance,
  maxDistance,
  lighting = "day",
  environmentPreset,
  environmentBackground = false,
  enableHotspots = true,
  sidebarVariant = "fixed",
  controlsRef: externalControlsRef,
  boundsRef: externalBoundsRef,
  background,
  className,
}: ModelViewerProps) {
  const internalControlsRef = useRef<CameraControlsImpl | null>(null);
  const internalBoundsRef = useRef<THREE.Box3 | null>(null);
  const controlsRef = externalControlsRef ?? internalControlsRef;
  const boundsRef = externalBoundsRef ?? internalBoundsRef;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [infoPart, setInfoPart] = useState<PartInfo | null>(null);

  const pickHotspot = useCallback((hotspot: Hotspot) => {
    if (!controlsRef.current) return;
    const box = new THREE.Box3(
      new THREE.Vector3(...hotspot.box[0]),
      new THREE.Vector3(...hotspot.box[1]),
    );
    setActiveId(hotspot.id);
    controlsRef.current.fitToBox(box, true, PADDING);
    // Hotspot pins sit right on top of the part they label, so they'd
    // otherwise block a bare-mesh click from ever reaching that same part —
    // show the info modal here too rather than requiring an off-pin click.
    setInfoPart(hotspot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetView = useCallback(() => {
    if (!controlsRef.current || !boundsRef.current) return;
    setActiveId(null);
    frame(controlsRef.current, boundsRef.current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rig = LIGHT_RIGS[lighting];

  // Shared between both sidebar variants — only the wrapper around it (and
  // the sidebar itself) differ below.
  const canvas = (
    <ModelErrorBoundary>
      <Canvas
        className="h-full w-full"
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 1000, position: [4, 2, 6] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={rig.ambient} />
        <hemisphereLight intensity={rig.hemi} groundColor="#444444" />
        <directionalLight position={[5, 8, 5]} intensity={rig.dir} />

        <Suspense fallback={null}>
          <Scene
            model={model}
            autoRotate={autoRotate}
            enableHotspots={enableHotspots}
            activeId={activeId}
            controlsRef={controlsRef}
            boundsRef={boundsRef}
            onPick={pickHotspot}
            onPartClick={setInfoPart}
          />
          {environmentPreset && (
            <Environment
              preset={environmentPreset}
              background={environmentBackground}
              // Tilts the HDRI sphere (not just the camera) so the aircraft reads
              // as airborne against open sky instead of parked at street level —
              // the raw presets center their horizon on the default eye line.
              backgroundRotation={[-0.5, 0, 0]}
              environmentRotation={[-0.5, 0, 0]}
            />
          )}
        </Suspense>

        <CameraControls
          ref={controlsRef}
          makeDefault
          smoothTime={0.4}
          minDistance={minDistance}
          maxDistance={maxDistance}
          azimuthRotateSpeed={enableRotate ? 1 : 0}
          polarRotateSpeed={enableRotate ? 1 : 0}
          truckSpeed={enablePan ? 1 : 0}
          dollySpeed={enableZoom ? 1 : 0}
        />
      </Canvas>
      <ProgressOverlay />
      {activeId !== null && (
        <button
          type="button"
          onClick={resetView}
          className="absolute bottom-3 right-3 cursor-pointer rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/70 dark:text-zinc-200"
        >
          Reset view
        </button>
      )}
    </ModelErrorBoundary>
  );

  return (
    <div
      className={`${sidebarVariant === "inline" ? "flex" : "relative overflow-hidden"} ${className ?? ""}`}
      style={background ? { backgroundColor: background } : undefined}
    >
      {sidebarVariant === "inline" ? (
        <div className="relative h-full min-w-0 flex-1 overflow-hidden">{canvas}</div>
      ) : (
        canvas
      )}
      <PartInfoModal part={infoPart} onClose={() => setInfoPart(null)} variant={sidebarVariant} />
    </div>
  );
}
