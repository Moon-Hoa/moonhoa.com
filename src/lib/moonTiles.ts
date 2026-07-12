// Tile fetching/caching against NASA Moon Trek's public WMTS service
// (trek.nasa.gov) for the Moon -- real LRO/LROC imagery and LOLA-derived
// elevation, replacing the procedural art in moonTexture.ts (issue #135).
//
// No API key is required for tile fetches (verified live 2026-07-12,
// despite trek.nasa.gov/tiles/apidoc/ describing an api.data.gov key for
// the broader Trek API family -- GetCapabilities and GetTile both work
// unauthenticated for these layers). All layers here share the same WMTS
// convention: a global 2:1 tile pyramid with TopLeftCorner fixed at
// (-180, 90), matrixWidth = 2 * 2^z, matrixHeight = 2^z at zoom z, 256x256
// tiles, style "default", TileMatrixSet "default028mm" -- confirmed
// against the real GetCapabilities documents for every layer below.
// Row/col within a zoom level follow the same UV convention already used
// in moonGeo.ts/moonTexture.ts: u = (lon+180)/360, v = (90-lat)/180.
//
// "Hotspot" layers (real NAC mosaics for named landing sites) exist
// ready-made in Trek's catalog -- no separate tiling pipeline was needed.
// Their tile pyramids extend much deeper (up to z=15, ~cm/pixel) than the
// global WAC base layer (max z=8, ~100m/pixel); the extra depth is exactly
// what "hotspot" detail means here.

const STYLE = "default";
const MATRIX_SET = "default028mm";

export interface Bounds {
  latMinDeg: number;
  latMaxDeg: number;
  lonMinDeg: number;
  lonMaxDeg: number;
}

export interface TileLayer {
  /** WMTS base URL, e.g. ".../tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02" */
  baseUrl: string;
  ext: "jpg" | "png";
  /** Highest zoom level this layer's tile pyramid actually has imagery for. */
  maxZoom: number;
  /** Real data coverage -- outside this, tiles 404 (no coverage), not an error. */
  bounds: Bounds;
}

/** Global ~100m/px visible-light mosaic. Covers the whole sphere. */
export const BASE_LAYER: TileLayer = {
  baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02",
  ext: "jpg",
  maxZoom: 8,
  bounds: { latMinDeg: -90, latMaxDeg: 90, lonMinDeg: -180, lonMaxDeg: 180 },
};

/** LOLA-derived color shaded relief, global -- feeds the bump map. */
export const RELIEF_LAYER: TileLayer = {
  baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04",
  ext: "png",
  maxZoom: 8,
  bounds: { latMinDeg: -90, latMaxDeg: 90, lonMinDeg: -180, lonMaxDeg: 180 },
};

export interface HotspotLayer extends TileLayer {
  id: string;
  label: string;
}

// Real NAC mosaics already tile-served by Moon Trek for named sites --
// bounds are each layer's actual WGS84BoundingBox (deliberately generous
// vs. the pinpoint landing coordinate, since these are strip mosaics, not
// perfect squares around the touchdown point).
export const HOTSPOT_LAYERS: HotspotLayer[] = [
  {
    id: "apollo-11",
    label: "Apollo 11 (Tranquility Base)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Apollo11_Mosaic_p",
    ext: "png",
    maxZoom: 15,
    bounds: { latMinDeg: 0.1, latMaxDeg: 1.2, lonMinDeg: 23.4, lonMaxDeg: 23.6 },
  },
  {
    id: "apollo-12",
    label: "Apollo 12 (Ocean of Storms)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Apollo12_Mosaic_p",
    ext: "png",
    maxZoom: 15,
    bounds: { latMinDeg: -4.1, latMaxDeg: -2.6, lonMinDeg: -23.9, lonMaxDeg: -22.9 },
  },
  {
    id: "apollo-14",
    label: "Apollo 14 (Fra Mauro)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Apollo14_Mosaic_p",
    ext: "png",
    maxZoom: 15,
    bounds: { latMinDeg: -4.1, latMaxDeg: -3.0, lonMinDeg: -17.9, lonMaxDeg: -16.9 },
  },
  {
    id: "apollo-15",
    label: "Apollo 15 (Hadley Rille)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Mosaic_26N004E_50cmp",
    ext: "png",
    maxZoom: 15,
    bounds: { latMinDeg: 25.5, latMaxDeg: 26.5, lonMinDeg: 3.2, lonMaxDeg: 4.2 },
  },
  {
    id: "apollo-16",
    label: "Apollo 16 (Descartes)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Mosaic_09S015E_50cmp",
    ext: "png",
    maxZoom: 15,
    bounds: { latMinDeg: -9.5, latMaxDeg: -8.5, lonMinDeg: 14.6, lonMaxDeg: 15.6 },
  },
  {
    id: "apollo-17",
    label: "Apollo 17 (Taurus-Littrow)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/A17_60x60km.eq",
    ext: "png",
    maxZoom: 12,
    bounds: { latMinDeg: 19.7, latMaxDeg: 20.7, lonMinDeg: 30.3, lonMaxDeg: 31.3 },
  },
  {
    id: "malapert-massif",
    label: "Malapert Massif (near south pole landing sites)",
    baseUrl: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Mosaic_86S356E_50cmp",
    ext: "png",
    maxZoom: 15,
    bounds: { latMinDeg: -86.5, latMaxDeg: -85.5, lonMinDeg: -4.5, lonMaxDeg: -3.5 },
  },
];

export function tileUrl(layer: TileLayer, z: number, row: number, col: number): string {
  return `${layer.baseUrl}/1.0.0/${STYLE}/${MATRIX_SET}/${z}/${row}/${col}.${layer.ext}`;
}

export function latLonInBounds(latDeg: number, lonDeg: number, bounds: Bounds): boolean {
  return (
    latDeg >= bounds.latMinDeg &&
    latDeg <= bounds.latMaxDeg &&
    lonDeg >= bounds.lonMinDeg &&
    lonDeg <= bounds.lonMaxDeg
  );
}

/** Which hotspot (if any) covers this point, for swapping in extra detail on zoom. */
export function hotspotAt(latDeg: number, lonDeg: number): HotspotLayer | null {
  for (const layer of HOTSPOT_LAYERS) {
    if (latLonInBounds(latDeg, lonDeg, layer.bounds)) return layer;
  }
  return null;
}

export function latLonToTile(latDeg: number, lonDeg: number, z: number): { row: number; col: number } {
  const matrixWidth = 2 * 2 ** z;
  const matrixHeight = 2 ** z;
  const u = (lonDeg + 180) / 360;
  const v = (90 - latDeg) / 180;
  const col = Math.min(matrixWidth - 1, Math.max(0, Math.floor(u * matrixWidth)));
  const row = Math.min(matrixHeight - 1, Math.max(0, Math.floor(v * matrixHeight)));
  return { row, col };
}

/** Degrees of lon/lat covered by one tile at zoom z, for iterating a small region. */
export function tileSpanDeg(z: number): { lonSpan: number; latSpan: number } {
  const matrixWidth = 2 * 2 ** z;
  const matrixHeight = 2 ** z;
  return { lonSpan: 360 / matrixWidth, latSpan: 180 / matrixHeight };
}

const tileCache = new Map<string, Promise<HTMLImageElement | null>>();

/** Fetches (and caches) one tile image. Resolves null on missing coverage (404) rather than rejecting. */
export function loadTile(layer: TileLayer, z: number, row: number, col: number): Promise<HTMLImageElement | null> {
  const key = `${layer.baseUrl}|${z}|${row}|${col}`;
  const cached = tileCache.get(key);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = tileUrl(layer, z, row, col);
  });
  tileCache.set(key, promise);
  return promise;
}
