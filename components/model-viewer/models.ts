export interface Hotspot {
  id: string;
  label: string;
  /** Marker position, in the model's local space. */
  marker: readonly [number, number, number];
  /** Region the camera fits to on click: [[minX, minY, minZ], [maxX, maxY, maxZ]]. */
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
        marker: [0, 0.75, 3.2],
        box: [
          [-0.9, -0.4, 2.0],
          [0.9, 1.0, 3.4],
        ],
      },
      {
        id: "tail",
        label: "Tail",
        marker: [0, 1.6, -2.6],
        box: [
          [-1.8, -0.4, -3.4],
          [1.8, 1.8, -1.8],
        ],
      },
      {
        id: "wing-right",
        label: "Right wing",
        marker: [2.3, 0.0, 0.6],
        box: [
          [0.8, -0.4, -0.2],
          [3.7, 0.55, 1.6],
        ],
      },
      {
        id: "wing-left",
        label: "Left wing",
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
