/** Info shown in the click-to-inspect modal for a clicked part of the model. */
export interface PartInfo {
  label: string;
  description: string;
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
        marker: [0, 0.75, 3.2],
        box: [
          [-0.9, -0.4, 2.0],
          [0.9, 1.0, 3.4],
        ],
      },
      {
        id: "tail",
        label: "Tail",
        description:
          "The empennage, made up of the vertical stabilizer and rudder for yaw control, plus the horizontal stabilizer for pitch trim. The auxiliary power unit that runs onboard systems on the ground also sits at its base.",
        marker: [0, 1.6, -2.6],
        box: [
          [-1.8, -0.4, -3.4],
          [1.8, 1.8, -1.8],
        ],
      },
      {
        id: "wing-right",
        label: "Right wing",
        description:
          "Generates the lift that keeps the aircraft airborne and carries the engines and main fuel tanks. Flaps, slats, ailerons, and spoilers along its edges control lift and roll.",
        marker: [2.3, 0.0, 0.6],
        box: [
          [0.8, -0.4, -0.2],
          [3.7, 0.55, 1.6],
        ],
      },
      {
        id: "wing-left",
        label: "Left wing",
        description:
          "Mirrors the right wing, generating lift and housing fuel and engines. Together the two wings span roughly 80 meters on the real A380-800.",
        marker: [-2.3, 0.0, 0.6],
        box: [
          [-3.7, -0.4, -0.2],
          [-0.8, 0.55, 1.6],
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
