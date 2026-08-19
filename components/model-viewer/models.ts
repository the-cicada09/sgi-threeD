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
      // convention. `box` is derived from each engine's actual fan-face mesh
      // in scene.gltf (its own accessor min/max, transformed through the
      // node's full ancestor matrix chain) padded out to cover the visible
      // nacelle without overlapping the neighboring engine on the same wing.
      // `marker` sits past the box's front face, in open air ahead of the
      // intake — anchoring the Html pin on the mesh itself gets it occluded
      // by the nacelle/pylon geometry from most angles (same fix as Nose's
      // marker above).
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
        // box is read directly off the fan-face mesh's own bounding box (see
        // prop3_still node in the .gltf), transformed through the node's
        // full ancestor chain — not eyeballed, so it sits right on the
        // actual nacelle regardless of camera angle. marker is pushed past
        // the box's front face into open air (same reason as the nose pin
        // above) — sitting on the mesh itself gets it occluded by the
        // nacelle/pylon geometry from most camera angles.
        marker: [-2.326, -0.073, 0.73],
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
        // marker pushed past the box's front face — see engine-1's comment.
        marker: [-1.34, -0.168, 1.46],
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
        // marker pushed past the box's front face — see engine-1's comment.
        marker: [1.323, -0.168, 1.46],
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
        // marker pushed past the box's front face — see engine-1's comment.
        marker: [2.309, -0.073, 0.73],
        box: [
          [1.959, -0.373, -0.323],
          [2.659, 0.227, 0.577],
        ],
      },
    ],
  },
  // Single .glb file (binary container) rather than .gltf + .bin + loose
  // textures — same GLTFLoader codepath in Model.tsx handles both formats
  // transparently, so this proves that out. This model's own local space is
  // unrelated in scale/orientation to the A380 above (nose end at +x, tail
  // at -x, up is +y, span is z, and units run in the hundreds not ±1-4) —
  // every marker/box below was read off this .glb's actual vertex data
  // (downloaded and parsed offline: composed the node ancestor matrix chain,
  // transformed each mesh's POSITION accessor into this local space, then
  // searched the resulting point cloud for the nose-tip vertex and the two
  // low-slung, wing-symmetric clusters that are the engine nacelles), not
  // eyeballed from a screenshot — same approach as the A380 engine fix.
  vietnam_airlines_a321_200: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1786439617/vietnam_airlines_airbus_a321-200.glb",
    label: "Vietnam Airlines A321-200 (.glb)",
    hotspots: [
      {
        id: "nose",
        label: "Nose",
        description:
          "Houses the weather radar dome and forward avionics bay ahead of the pressure bulkhead. Its tapered shape reduces drag and shields the radar antenna that scans ahead for storms and turbulence.",
        manufacturer: "Honeywell Aerospace",
        partNumber: "RDR-4000 Radome",
        cost: "$95,000",
        installDate: "2016-08-21",
        lastMaintenance: "2026-01-15",
        nextMaintenance: "2026-10-15",
        status: "Operational",
        // Pushed past the actual tip (x max ~281.4 in this model's local
        // space) so the marker floats in open air instead of sitting on the
        // mesh surface — see the A380 nose hotspot's comment for why that
        // matters for `occlude`.
        marker: [301, 116.5, -621.7],
        box: [
          [230, 85, -655],
          [283, 160, -588],
        ],
      },
      {
        id: "cockpit",
        label: "Cockpit",
        description:
          "The flight deck, just aft of the radome. Vietnam Airlines' A321s fly with an Airbus glass cockpit — primary flight and navigation displays flanking a shared central display, with side-stick controls.",
        manufacturer: "Thales Avionics",
        partNumber: "A320-family Glass Cockpit Suite (6x Display Unit)",
        cost: "$3,100,000",
        installDate: "2016-08-21",
        lastMaintenance: "2026-04-09",
        nextMaintenance: "2027-04-09",
        status: "Operational",
        // Pushed above the fuselage crown at the windshield (y max ~172.6
        // there) so it floats clear of the mesh, same reasoning as Nose.
        marker: [177, 188, -621.7],
        box: [
          [150, 120, -658],
          [215, 173, -584],
        ],
      },
      // Two CFM56 turbofans, one per wing — numbered left/right by this
      // model's own z-axis sign (span axis here, not verified against the
      // real airframe's pilot-left/right, since nothing in the geometry
      // itself carries that labeling).
      {
        id: "engine-1",
        label: "Engine 1",
        description:
          "Underwing turbofan on the left side. Vietnam Airlines' A321-200s are commonly fitted with CFM56-5B engines, each producing up to 33,000 lbf of thrust.",
        manufacturer: "CFM International",
        partNumber: "CFM56-5B4/P",
        cost: "$12,800,000",
        installDate: "2016-08-21",
        lastMaintenance: "2026-03-27",
        nextMaintenance: "2026-09-27",
        status: "Operational",
        // Marker pushed forward past the nacelle's intake face (x max ~-41
        // there) into open air, same reasoning as the A380 engine markers.
        marker: [-21, 76, -703],
        box: [
          [-121, 54, -754],
          [-36, 100, -684],
        ],
      },
      {
        id: "engine-2",
        label: "Engine 2",
        description:
          "Underwing turbofan on the right side, mirroring Engine 1. Bleed air tapped from its compressor also feeds the cabin's environmental control system.",
        manufacturer: "CFM International",
        partNumber: "CFM56-5B4/P",
        cost: "$12,800,000",
        installDate: "2016-08-21",
        lastMaintenance: "2026-03-27",
        nextMaintenance: "2026-09-27",
        status: "Under Inspection",
        marker: [-21, 76, -541],
        box: [
          [-121, 54, -559],
          [-36, 100, -489],
        ],
      },
    ],
  },
} as const satisfies Record<string, ModelConfig>;

export type ModelName = keyof typeof MODELS;
