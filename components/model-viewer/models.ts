/** Info shown in the click-to-inspect modal for a clicked part of the model.
 *  The maintenance-record fields (cost/dates/status) are illustrative sample
 *  data, not real airline records — actual MRO logs aren't public. */
export interface PartInfo {
  label: string;
  description: string;
  /** OEM/supplier that manufactures this part. */
  manufacturer: string;
  /** Manufacturer part or model designation. */
  partNumber: string;
  /** Unit replacement/list cost, formatted for display. */
  cost: string;
  /** Date this specific unit was installed on the airframe. */
  installDate: string;
  /** Date of its most recently completed maintenance check. */
  lastMaintenance: string;
  /** Date the next scheduled maintenance check is due. */
  nextMaintenance: string;
  status: "Operational" | "Scheduled Maintenance" | "Under Inspection";
}

export interface Hotspot extends PartInfo {
  id: string;
  /** Marker position, in the model's local space. */
  marker: readonly [number, number, number];
  /** Region the camera fits to on click, and also the hit-test box used to
   *  identify this part when the model itself is clicked directly:
   *  [[minX, minY, minZ], [maxX, maxY, maxZ]]. */
  box: readonly [
    readonly [number, number, number],
    readonly [number, number, number],
  ];
}

export interface ModelConfig {
  /** Path to the .gltf/.glb file, relative to /public */
  path: string;
  label: string;
  hotspots?: readonly Hotspot[];
}

export const MODELS = {
  airbus_a380_800: {
    path: "/airbus_a380_-_800/scene.gltf",
    label: "Airbus A380-800",
    hotspots: [
      {
        id: "nose",
        label: "Nose",
        description:
          "Houses the weather radar dome and forward avionics bay. Its curved, tapered shape reduces aerodynamic drag and shields the radar antenna that scans the flight path ahead for storms and turbulence.",
        manufacturer: "Honeywell Aerospace",
        partNumber: "WXR-2100 MultiScan Radome",
        cost: "$185,000",
        installDate: "2019-03-12",
        lastMaintenance: "2026-02-04",
        nextMaintenance: "2026-11-04",
        status: "Operational",
        // Pushed slightly beyond the model's actual nose tip (~3.33) so the
        // marker floats in open air instead of sitting on the mesh surface —
        // right on the surface, `occlude` flickers the pin invisible because
        // the camera-to-marker raycast is right at the boundary every frame.
        marker: [0.01, -0.02, 3.5],
        box: [
          [-0.35, -0.35, 2.9],
          [0.35, 0.35, 3.4],
        ],
      },
      {
        id: "cockpit",
        label: "Cockpit",
        description:
          "The flight deck, where the pilots sit. On the A380 it's fitted with a glass cockpit — large digital displays and side-stick controls replacing traditional analog dials and yokes.",
        manufacturer: "Thales Avionics",
        partNumber: "A380 Glass Cockpit Suite (8x Display Unit)",
        cost: "$4,200,000",
        installDate: "2019-03-12",
        lastMaintenance: "2026-05-18",
        nextMaintenance: "2027-05-18",
        status: "Operational",
        marker: [0, 0.75, 3.2],
        box: [
          [-0.9, -0.4, 2.0],
          [0.9, 1.0, 3.4],
        ],
      },
      // Engines are numbered left-to-right across the aircraft (1 = left
      // outboard … 4 = right outboard), matching standard multi-engine
      // convention. Marker positions are the exact centers of each engine's
      // fan-face mesh in scene.gltf (its own accessor min/max, transformed
      // through the node's full ancestor matrix chain — see the derivation
      // in git history/PR description if this ever needs redoing); boxes
      // pad out from there to cover the visible nacelle without overlapping
      // the neighboring engine on the same wing.
      {
        id: "engine-1",
        label: "Engine 1",
        description:
          "Outboard engine on the left wing. One of four Rolls-Royce Trent 900 turbofans that power the A380, each mounted on its own pylon to keep engine-out asymmetry manageable if one fails.",
        manufacturer: "Rolls-Royce",
        partNumber: "Trent 972-84",
        cost: "$27,500,000",
        installDate: "2019-03-12",
        lastMaintenance: "2026-04-02",
        nextMaintenance: "2026-10-02",
        status: "Operational",
        // Marker/box read directly off the fan-face mesh's own bounding box
        // (see prop3_still node in the .gltf), transformed through the
        // node's full ancestor chain — not eyeballed, so this sits right on
        // the actual nacelle regardless of camera angle.
        marker: [-2.326, -0.073, 0.427],
        box: [
          [-2.676, -0.373, -0.323],
          [-1.976, 0.227, 0.577],
        ],
      },
      {
        id: "engine-2",
        label: "Engine 2",
        description:
          "Inboard engine on the left wing, mounted closer to the fuselage than Engine 1. Its thrust reversers help slow the aircraft on landing rollout.",
        manufacturer: "Rolls-Royce",
        partNumber: "Trent 972-84",
        cost: "$27,500,000",
        installDate: "2019-03-12",
        lastMaintenance: "2026-07-14",
        nextMaintenance: "2027-01-14",
        status: "Operational",
        marker: [-1.34, -0.168, 1.159],
        box: [
          [-1.69, -0.468, 0.409],
          [-0.99, 0.132, 1.309],
        ],
      },
      {
        id: "engine-3",
        label: "Engine 3",
        description:
          "Inboard engine on the right wing, mirroring Engine 2. Bleed air from its compressor also feeds the cabin's environmental control system.",
        manufacturer: "Rolls-Royce",
        partNumber: "Trent 972-84",
        cost: "$27,500,000",
        installDate: "2019-03-12",
        lastMaintenance: "2026-07-14",
        nextMaintenance: "2027-01-14",
        status: "Under Inspection",
        marker: [1.323, -0.168, 1.159],
        box: [
          [0.973, -0.468, 0.409],
          [1.673, 0.132, 1.309],
        ],
      },
      {
        id: "engine-4",
        label: "Engine 4",
        description:
          "Outboard engine on the right wing, mirroring Engine 1. Being furthest from the fuselage, it produces the largest yaw effect of the four if it loses thrust in flight.",
        manufacturer: "Rolls-Royce",
        partNumber: "Trent 972-84",
        cost: "$27,500,000",
        installDate: "2019-03-12",
        lastMaintenance: "2026-04-02",
        nextMaintenance: "2026-10-02",
        status: "Operational",
        marker: [2.309, -0.073, 0.427],
        box: [
          [1.959, -0.373, -0.323],
          [2.659, 0.227, 0.577],
        ],
      },
    ],
  },
  // Single .glb file (binary container) rather than .gltf + .bin + loose
  // textures — same GLTFLoader codepath in Model.tsx handles both formats
  // transparently, so this needs no hotspots to prove that out.
  vietnam_airlines_a321_200: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1786439617/vietnam_airlines_airbus_a321-200.glb",
    label: "Vietnam Airlines A321-200 (.glb)",
    hotspots: [],
  },
} as const satisfies Record<string, ModelConfig>;

export type ModelName = keyof typeof MODELS;
