// Points of interest for the 3D Moon view: real Apollo/other crewed and
// robotic landing sites (sourced from the canonical Legacy Structures
// Register — see Appendix C, `staticPagesContent.ts`) plus a handful of
// well-known named craters. Coordinates are real, public facts; nothing
// here is invented.
//
// Landing-site entries whose Register coordinates are "Various" or
// "restricted" (multi-site or undisclosed rows) are filtered out rather
// than backfilled with a plausible point — inventing one would be the same
// category of fabrication as inventing a location for the Association's
// still-missing "Zero-Gravity Swimming Pool" (its location is canonically
// unresolved and deliberately excluded here too).

import { legacyStructures } from "./staticPagesContent";

export interface MoonPoi {
  id: string;
  label: string;
  latDeg: number;
  lonDeg: number;
  kind: "landing-site" | "feature";
  description: string;
}

const COORD_RE = /^(-?\d+(?:\.\d+)?)°([NS]),\s*(-?\d+(?:\.\d+)?)°([EW])$/;

function parseCoordinates(coordinates: string): { latDeg: number; lonDeg: number } | null {
  const match = COORD_RE.exec(coordinates.trim());
  if (!match) return null;
  const [, latStr, ns, lonStr, ew] = match;
  const lat = Number(latStr) * (ns === "S" ? -1 : 1);
  const lon = Number(lonStr) * (ew === "W" ? -1 : 1);
  return { latDeg: lat, lonDeg: lon };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const landingSites: MoonPoi[] = legacyStructures
  .map((structure) => {
    const coords = parseCoordinates(structure.coordinates);
    if (!coords) return null;
    const poi: MoonPoi = {
      id: `legacy-${slugify(structure.site)}`,
      label: structure.site,
      latDeg: coords.latDeg,
      lonDeg: coords.lonDeg,
      kind: "landing-site",
      description: `${structure.origin} — ${structure.status}`,
    };
    return poi;
  })
  .filter((poi): poi is MoonPoi => poi !== null);

const craters: MoonPoi[] = [
  {
    id: "crater-tycho",
    label: "Tycho",
    latDeg: -43.31,
    lonDeg: -11.36,
    kind: "feature",
    description: "Prominent rayed crater in the lunar southern highlands, ~85 km diameter.",
  },
  {
    id: "crater-copernicus",
    label: "Copernicus",
    latDeg: 9.62,
    lonDeg: -20.08,
    kind: "feature",
    description: "Large rayed crater on the eastern edge of Oceanus Procellarum, ~93 km diameter.",
  },
  {
    id: "crater-shackleton",
    label: "Shackleton",
    latDeg: -89.9,
    lonDeg: 0,
    kind: "feature",
    description: "Crater at the lunar south pole with a permanently shadowed floor, ~21 km diameter.",
  },
  {
    id: "crater-aristarchus",
    label: "Aristarchus",
    latDeg: 23.73,
    lonDeg: -47.49,
    kind: "feature",
    description: "One of the brightest features on the near side, ~40 km diameter.",
  },
  {
    id: "crater-kepler",
    label: "Kepler",
    latDeg: 8.12,
    lonDeg: -38.01,
    kind: "feature",
    description: "Bright rayed crater in Oceanus Procellarum, ~32 km diameter.",
  },
  {
    id: "crater-plato",
    label: "Plato",
    latDeg: 51.62,
    lonDeg: -9.38,
    kind: "feature",
    description: "Large, flat-floored crater on the edge of Mare Imbrium, ~101 km diameter.",
  },
];

export const moonPois: MoonPoi[] = [...landingSites, ...craters];
