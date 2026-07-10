// Points of interest for the 3D Moon view: real Apollo crewed-landing sites
// and a handful of well-known named craters. Coordinates are real, public
// facts (published NASA landing-site coordinates; standard IAU-named
// craters) — nothing here is invented.
//
// This intentionally does NOT source from a shared "legacy structures"
// dataset, because no such dataset exists on this branch (this page is
// built directly off `newsite`, independent of later phases). If a richer
// canonical dataset of lunar surface sites lands on `newsite` later, this
// list is a natural candidate to be replaced with an import from it rather
// than kept as a second, hand-maintained copy.
//
// Deliberately excluded: any fixed location for the Association's missing
// "Zero-Gravity Swimming Pool" amenity — its location is canonically
// unresolved, and inventing coordinates for it would be exactly the kind of
// fabrication this dataset otherwise avoids.

export interface MoonPoi {
  id: string;
  label: string;
  latDeg: number;
  lonDeg: number;
  kind: "landing-site" | "feature";
  description: string;
}

const landingSites: MoonPoi[] = [
  {
    id: "tranquility-base",
    label: "Tranquility Base",
    latDeg: 0.67,
    lonDeg: 23.47,
    kind: "landing-site",
    description: "Apollo 11 landing site (1969) — first crewed lunar landing. Registered, grandfathered.",
  },
  {
    id: "ocean-of-storms",
    label: "Ocean of Storms Site",
    latDeg: -3.01,
    lonDeg: -23.42,
    kind: "landing-site",
    description: "Apollo 12 landing site (1969), Oceanus Procellarum. Registered, grandfathered.",
  },
  {
    id: "fra-mauro",
    label: "Fra Mauro Highlands Site",
    latDeg: -3.65,
    lonDeg: -17.47,
    kind: "landing-site",
    description: "Apollo 14 landing site (1971), Fra Mauro formation. Registered, grandfathered.",
  },
  {
    id: "hadley-rille",
    label: "Hadley Rille Site",
    latDeg: 26.13,
    lonDeg: 3.63,
    kind: "landing-site",
    description: "Apollo 15 landing site (1971) — first lunar roving vehicle. Registered, grandfathered.",
  },
  {
    id: "descartes-highlands",
    label: "Descartes Highlands Site",
    latDeg: -8.97,
    lonDeg: 15.5,
    kind: "landing-site",
    description: "Apollo 16 landing site (1972), lunar highlands terrain. Registered, grandfathered.",
  },
  {
    id: "taurus-littrow",
    label: "Taurus-Littrow Site",
    latDeg: 20.19,
    lonDeg: 30.77,
    kind: "landing-site",
    description: "Apollo 17 landing site (1972) — final crewed lunar landing to date. Registered, grandfathered.",
  },
];

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
