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

/** Typical production-spec dimensions/performance for the aircraft *type* —
 *  public reference figures (rounded), not measurements of this specific
 *  glTF asset or a real tail number. Every field is optional so a model can
 *  ship with a partial sheet; SpecificationGrid renders only what's present
 *  and shows an empty state if none of it is. */
export interface AircraftSpecs {
  length?: string;
  wingspan?: string;
  height?: string;
  passengers?: string;
  cruiseSpeed?: string;
  range?: string;
  serviceCeiling?: string;
  engine?: string;
}

export interface ModelConfig {
  /** Path to the .gltf/.glb file, relative to /public */
  path: string;
  label: string;
  /** Manufacturer/family grouping (e.g. "Airbus", "Boeing") the model switcher
   *  nests this entry under — see AeroplaneExplorer's FAMILIES grouping. */
  family: string;
  /** Short classification shown as a badge next to the model name, e.g.
   *  "Wide-body Airliner", "Regional Turboprop", "General Aviation". */
  category?: string;
  /** Short blurb about the aircraft type, shown on the page when this model
   *  is selected (not the per-part sidebar — see PartInfoModal for that). */
  description?: string;
  specs?: AircraftSpecs;
  hotspots?: readonly Hotspot[];
}

export const MODELS = {
  airbus_a380_800: {
    path: "/airbus_a380_-_800/scene.gltf",
    label: "Airbus A380-800",
    family: "Airbus",
    category: "Wide-body Airliner",
    description:
      "Airbus's double-deck, four-engine wide-body — the largest passenger airliner ever built, with two full-length cabins seating 500+ passengers. Built for high-capacity trunk routes between major long-haul hubs.",
    specs: {
      length: "72.72 m",
      wingspan: "79.75 m",
      height: "24.09 m",
      passengers: "525 (typical 3-class)",
      cruiseSpeed: "903 km/h (Mach 0.85)",
      range: "8,000 nmi (14,800 km)",
      serviceCeiling: "13,100 m",
      engine: "4× Rolls-Royce Trent 900 / Engine Alliance GP7200",
    },
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
    family: "Airbus",
    category: "Narrow-body Airliner",
    description:
      "A single-aisle narrow-body from the Airbus A320 family, sized for short- to medium-haul routes. This livery reflects a Vietnam Airlines A321-200, one of the carrier's workhorse domestic and regional jets.",
    specs: {
      length: "44.51 m",
      wingspan: "35.80 m",
      height: "11.76 m",
      passengers: "185–220",
      cruiseSpeed: "830 km/h (Mach 0.78)",
      range: "3,200 nmi (5,950 km)",
      serviceCeiling: "12,000 m",
      engine: "2× CFM56-5B / IAE V2500",
    },
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
  // Uploaded models without per-part hotspot data. `hotspots` is optional on
  // ModelConfig, but MODELS keeps `as const satisfies ...` (literal types,
  // not widened) so every entry declares it explicitly as `[]` here —
  // otherwise indexing MODELS[model].hotspots across the union of entry
  // types would fail to typecheck for entries missing the property.
  airbus_a320: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787654123/airbus_a320_1.glb",
    label: "Airbus A320",
    family: "Airbus",
    category: "Narrow-body Airliner",
    description:
      "Airbus's original narrow-body twinjet, the aircraft that launched the A320 family in 1988 and brought fly-by-wire controls into mainstream commercial aviation. A short- to medium-haul single-aisle workhorse.",
    specs: {
      length: "37.57 m",
      wingspan: "35.80 m",
      height: "11.76 m",
      passengers: "150–180",
      cruiseSpeed: "828 km/h (Mach 0.78)",
      range: "3,300 nmi (6,100 km)",
      serviceCeiling: "12,000 m",
      engine: "2× CFM56-5 / IAE V2500",
    },
    hotspots: [],
  },
  airbus_a320_200: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787654123/airbus_a320-200.glb",
    label: "Airbus A320-200",
    family: "Airbus",
    category: "Narrow-body Airliner",
    description:
      "The definitive production version of the A320, in continuous service since the early 1990s and one of the most widely flown narrow-bodies in the world, competing directly with Boeing's 737 family.",
    specs: {
      length: "37.57 m",
      wingspan: "35.80 m",
      height: "11.76 m",
      passengers: "150–180",
      cruiseSpeed: "828 km/h (Mach 0.78)",
      range: "3,300 nmi (6,100 km)",
      serviceCeiling: "12,000 m",
      engine: "2× CFM56-5B / IAE V2500",
    },
    hotspots: [],
  },
  airbus_a330: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787654124/airbus_a330_1.glb",
    label: "Airbus A330",
    family: "Airbus",
    category: "Wide-body Airliner",
    description:
      "A wide-body twinjet from Airbus, used on medium- to long-haul routes as a lower-capacity, twin-engine complement to four-engine jets like the A340 and A380.",
    specs: {
      length: "63.69 m",
      wingspan: "60.30 m",
      height: "16.83 m",
      passengers: "277–335",
      cruiseSpeed: "871 km/h (Mach 0.82)",
      range: "6,350 nmi (11,750 km)",
      serviceCeiling: "12,500 m",
      engine: "2× Rolls-Royce Trent 700 / GE CF6 / PW4000",
    },
    hotspots: [],
  },
  boeing_737: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787654123/boeing_737.glb",
    label: "Boeing 737",
    family: "Boeing",
    category: "Narrow-body Airliner",
    description:
      "Boeing's best-selling narrow-body family, in continuous production since 1967 across multiple generations — from short regional hops to longer single-aisle routes on the newest MAX variants.",
    specs: {
      length: "39.5 m",
      wingspan: "35.9 m (with winglets)",
      height: "12.5 m",
      passengers: "160–189",
      cruiseSpeed: "842 km/h (Mach 0.79)",
      range: "3,115 nmi (5,765 km)",
      serviceCeiling: "12,500 m",
      engine: "2× CFM56-7B",
    },
    hotspots: [],
  },
  boeing_777_300er: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787657297/boeing_777-300er_model-optimized.glb",
    label: "Boeing 777-300ER",
    family: "Boeing",
    category: "Wide-body Airliner",
    description:
      "A long-range, high-capacity twinjet — one of the largest twin-engine wide-bodies in service, built for high-density international routes that would otherwise need a four-engine aircraft.",
    specs: {
      length: "73.9 m",
      wingspan: "64.8 m",
      height: "18.5 m",
      passengers: "396 (3-class), up to 550",
      cruiseSpeed: "892 km/h (Mach 0.84)",
      range: "7,370 nmi (13,650 km)",
      serviceCeiling: "13,100 m",
      engine: "2× GE90-115B",
    },
    hotspots: [],
  },
  boeing_787_dreamliner: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660665/boeing_787_dreamliner.glb",
    label: "Boeing 787 Dreamliner",
    family: "Boeing",
    category: "Wide-body Airliner",
    description:
      "Boeing's composite-airframe long-haul twinjet, designed for high fuel efficiency on routes that don't need a wide-body quad-jet's capacity — opening up long, thin routes that weren't previously economical.",
    specs: {
      length: "62.8 m",
      wingspan: "60.1 m",
      height: "17.0 m",
      passengers: "290–330",
      cruiseSpeed: "903 km/h (Mach 0.85)",
      range: "7,635 nmi (14,140 km)",
      serviceCeiling: "13,100 m",
      engine: "2× GEnx-1B / Rolls-Royce Trent 1000",
    },
    hotspots: [],
  },
  utair_boeing_767: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787657293/utair_boeing_767_1.glb",
    label: "UTair Boeing 767",
    family: "Boeing",
    category: "Wide-body Airliner",
    description:
      "A wide-body twinjet from Boeing, originally developed for medium- to long-haul routes in the 1980s. This livery reflects Russian carrier UTair's fleet.",
    specs: {
      length: "54.9 m",
      wingspan: "47.6 m",
      height: "15.8 m",
      passengers: "218–269",
      cruiseSpeed: "851 km/h (Mach 0.80)",
      range: "5,980 nmi (11,070 km)",
      serviceCeiling: "13,100 m",
      engine: "2× PW4000 / GE CF6 / RR RB211",
    },
    hotspots: [],
  },
  bombardier_crj_200: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660666/bombardier_crj_200.glb",
    label: "Bombardier CRJ 200",
    family: "Bombardier",
    category: "Regional Jet",
    description:
      "A 50-seat regional jet from Bombardier's Canadair Regional Jet family, built to feed passengers from smaller airports into larger hub networks.",
    specs: {
      length: "26.77 m",
      wingspan: "21.21 m",
      height: "6.22 m",
      passengers: "50",
      cruiseSpeed: "830 km/h (Mach 0.74)",
      range: "1,700 nmi (3,150 km)",
      serviceCeiling: "12,500 m",
      engine: "2× GE CF34-3B1",
    },
    hotspots: [],
  },
  bombardier_dash_q400_qantaslink: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660665/bombardier_dash_q400_-_qantas_link.glb",
    label: "Bombardier Dash 8 Q400 (QantasLink)",
    family: "Bombardier",
    category: "Regional Turboprop",
    description:
      "A twin-turboprop regional airliner from Bombardier's Dash 8 family, seating around 74-78 passengers. This livery reflects QantasLink, Qantas's regional subsidiary.",
    specs: {
      length: "32.83 m",
      wingspan: "28.42 m",
      height: "8.34 m",
      passengers: "74–78",
      cruiseSpeed: "667 km/h",
      range: "1,362 nmi (2,522 km)",
      serviceCeiling: "7,620 m",
      engine: "2× Pratt & Whitney Canada PW150A turboprops",
    },
    hotspots: [],
  },
  atr_42_600: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660666/atr_42-600.glb",
    label: "ATR 42-600",
    family: "ATR",
    category: "Regional Turboprop",
    description:
      "A twin-turboprop regional airliner from the Franco-Italian ATR partnership, seating around 48 passengers on short regional hops where jets aren't economical.",
    specs: {
      length: "22.67 m",
      wingspan: "24.57 m",
      height: "7.59 m",
      passengers: "48",
      cruiseSpeed: "556 km/h",
      range: "716 nmi (1,326 km)",
      serviceCeiling: "7,620 m",
      engine: "2× Pratt & Whitney Canada PW127M turboprops",
    },
    hotspots: [],
  },
  atr_72_600: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660665/atr_72-600.glb",
    label: "ATR 72-600",
    family: "ATR",
    category: "Regional Turboprop",
    description:
      "The larger stablemate of the ATR 42 — a twin-turboprop regional airliner seating around 70-78 passengers on short regional routes.",
    specs: {
      length: "27.17 m",
      wingspan: "27.05 m",
      height: "7.65 m",
      passengers: "70–78",
      cruiseSpeed: "510 km/h",
      range: "825 nmi (1,528 km)",
      serviceCeiling: "7,620 m",
      engine: "2× Pratt & Whitney Canada PW127M turboprops",
    },
    hotspots: [],
  },
  embraer_erj_135: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660668/embraer_erj-135.glb",
    label: "Embraer ERJ-135",
    family: "Embraer",
    category: "Regional Jet",
    description:
      "A regional jet from Brazilian manufacturer Embraer, seating around 37 passengers on thinner regional routes too small for a mainline narrow-body.",
    specs: {
      length: "26.33 m",
      wingspan: "20.04 m",
      height: "6.76 m",
      passengers: "37",
      cruiseSpeed: "829 km/h (Mach 0.78)",
      range: "1,631 nmi (3,020 km)",
      serviceCeiling: "11,280 m",
      engine: "2× Rolls-Royce AE 3007A1",
    },
    hotspots: [],
  },
  saab_340: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787661577/saab_340-optimized.glb",
    label: "Saab 340",
    family: "Saab",
    category: "Regional Turboprop",
    description:
      "A twin-turboprop regional airliner from Swedish manufacturer Saab, seating around 33-37 passengers — one of the most widely used aircraft in its size class since the 1980s.",
    specs: {
      length: "19.73 m",
      wingspan: "21.44 m",
      height: "6.97 m",
      passengers: "33–37",
      cruiseSpeed: "467 km/h",
      range: "1,090 nmi (2,020 km)",
      serviceCeiling: "7,620 m",
      engine: "2× General Electric CT7-9B turboprops",
    },
    hotspots: [],
  },
  cessna_210a_centurion: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660668/cessna_210a_centurion.glb",
    label: "Cessna 210A Centurion",
    family: "Cessna",
    category: "General Aviation",
    description:
      "A single-engine, retractable-gear piston aircraft from Cessna's high-performance line — a fast, long-range general-aviation cruiser rather than an airliner.",
    specs: {
      length: "8.66 m",
      wingspan: "11.25 m",
      height: "2.84 m",
      passengers: "5 (1 pilot + 4)",
      cruiseSpeed: "324 km/h",
      range: "1,150 nmi (2,130 km)",
      serviceCeiling: "5,500 m",
      engine: "1× Continental IO-520 piston",
    },
    hotspots: [],
  },
  cessna_182_skylane: {
    path: "https://res.cloudinary.com/vtulbqli/image/upload/v1787660875/cessna_182_skylane-optimized.glb",
    label: "Cessna 182 Skylane",
    family: "Cessna",
    category: "General Aviation",
    description:
      "A single-engine, fixed-gear piston aircraft from Cessna — one of the most widely flown general-aviation aircraft in the world, used for training and personal flying rather than airline service.",
    specs: {
      length: "8.84 m",
      wingspan: "11.0 m",
      height: "2.84 m",
      passengers: "4 (1 pilot + 3)",
      cruiseSpeed: "269 km/h",
      range: "915 nmi (1,695 km)",
      serviceCeiling: "5,490 m",
      engine: "1× Lycoming IO-540 piston",
    },
    hotspots: [],
  },
} as const satisfies Record<string, ModelConfig>;

export type ModelName = keyof typeof MODELS;
