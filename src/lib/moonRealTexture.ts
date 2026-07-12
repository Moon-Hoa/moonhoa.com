// Builds the Moon's surface textures from real NASA/USGS imagery (via
// moonTiles.ts) instead of moonTexture.ts's procedural canvas art --
// issue #135. Two textures, matching the interface moonTexture.ts used to
// provide: an albedo (color) map from the WAC mosaic, and a bump map
// derived from LOLA color shaded relief.
//
// Strategy: composite a full-sphere base texture once at a modest fixed
// zoom level (fast initial load), then progressively repaint the small
// region the camera is actually facing at a much higher zoom level as the
// user zooms in -- reusing the same equirect canvas/UV convention, so this
// is just smarter canvas painting, not a separate tile-per-mesh system.
// When the zoomed-in region falls inside a named hotspot's bounds
// (moonPoi.ts sites), its dedicated high-resolution NAC mosaic is used
// instead of the base WAC layer for that patch.
import {
  BASE_LAYER,
  RELIEF_LAYER,
  hotspotAt,
  latLonToTile,
  loadTile,
  tileSpanDeg,
  type TileLayer,
} from "./moonTiles";

export const ALBEDO_BASE_ZOOM = 2; // 8x4 tiles = 2048x1024px initial load
export const REFINE_ZOOM = 6; // deeper detail for the camera-facing patch
// Radius (degrees) of the region repainted at higher zoom around the
// camera's facing lat/lon -- roughly matches LotRegionPanel's viewport span.
const REFINE_RADIUS_DEG = 3;

// Real WAC reflectance data is low-contrast (measured range ~2-156 out of
// 255, vs. the old procedural texture's ~66% grey) -- scene lighting tuned
// for one intensity can't make both shadows and highlights read correctly
// across that range at once (either crushed to black or blown to flat
// grey; tested empirically). A gamma lookup applied to the imagery itself,
// same idea as the "levels" adjustment every public-facing lunar image
// viewer applies to raw mosaic data, fixes this at the source instead of
// fighting it with light intensities.
const ALBEDO_GAMMA = 0.5;
const GAMMA_LUT = (() => {
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) lut[i] = Math.round(255 * Math.pow(i / 255, ALBEDO_GAMMA));
  return lut;
})();

function applyGamma(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const canvas = ctx.canvas;
  const clampedX = Math.max(0, Math.min(x, canvas.width));
  const clampedY = Math.max(0, Math.min(y, canvas.height));
  const clampedW = Math.max(0, Math.min(x + w, canvas.width) - clampedX);
  const clampedH = Math.max(0, Math.min(y + h, canvas.height) - clampedY);
  if (clampedW === 0 || clampedH === 0) return;

  const imageData = ctx.getImageData(clampedX, clampedY, clampedW, clampedH);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = GAMMA_LUT[data[i]];
    data[i + 1] = GAMMA_LUT[data[i + 1]];
    data[i + 2] = GAMMA_LUT[data[i + 2]];
  }
  ctx.putImageData(imageData, clampedX, clampedY);
}

export interface MoonBaseTextures {
  albedoCanvas: HTMLCanvasElement;
  bumpCanvas: HTMLCanvasElement;
}

async function compositeLayer(layer: TileLayer, zoom: number, levels: boolean): Promise<HTMLCanvasElement> {
  const matrixWidth = 2 * 2 ** zoom;
  const matrixHeight = 2 ** zoom;
  const canvas = document.createElement("canvas");
  canvas.width = matrixWidth * 256;
  canvas.height = matrixHeight * 256;
  const ctx = canvas.getContext("2d")!;

  const loads: Promise<void>[] = [];
  for (let row = 0; row < matrixHeight; row++) {
    for (let col = 0; col < matrixWidth; col++) {
      loads.push(
        loadTile(layer, zoom, row, col).then((img) => {
          if (!img) return;
          ctx.drawImage(img, col * 256, row * 256, 256, 256);
          if (levels) applyGamma(ctx, col * 256, row * 256, 256, 256);
        })
      );
    }
  }
  await Promise.all(loads);
  return canvas;
}

/** Initial full-sphere composite at a fixed, fast-loading zoom level. */
export async function generateMoonBaseTextures(): Promise<MoonBaseTextures> {
  const [albedoCanvas, bumpCanvas] = await Promise.all([
    compositeLayer(BASE_LAYER, ALBEDO_BASE_ZOOM, true),
    compositeLayer(RELIEF_LAYER, ALBEDO_BASE_ZOOM, false),
  ]);
  return { albedoCanvas, bumpCanvas };
}

/**
 * Repaints the region around (latDeg, lonDeg) at higher resolution --
 * called when the camera zooms in on a point (same trigger as the lot
 * region panel). Draws directly onto the existing albedo canvas and marks
 * it dirty via markDirty. Only albedo is refined, not the bump/relief
 * canvas: LOLA relief at the base zoom already gives real elevation
 * shading everywhere, hotspot layers have no elevation data of their own,
 * and color imagery is the dominant visual signal at zoom anyway.
 */
export async function refineRegion(
  albedoCanvas: HTMLCanvasElement,
  latDeg: number,
  lonDeg: number,
  markDirty: () => void
): Promise<void> {
  const hotspot = hotspotAt(latDeg, lonDeg);
  const layer = hotspot ?? BASE_LAYER;
  const zoom = hotspot ? Math.min(hotspot.maxZoom, 12) : REFINE_ZOOM;

  const actx = albedoCanvas.getContext("2d")!;
  const { lonSpan, latSpan } = tileSpanDeg(zoom);
  const tilesAcross = Math.ceil(REFINE_RADIUS_DEG / lonSpan) * 2 + 1;
  const tilesDown = Math.ceil(REFINE_RADIUS_DEG / latSpan) * 2 + 1;
  const { row: centerRow, col: centerCol } = latLonToTile(latDeg, lonDeg, zoom);

  // Base canvas pixel-per-degree, for mapping this zoom's tiles onto it.
  const pxPerLonDeg = albedoCanvas.width / 360;
  const pxPerLatDeg = albedoCanvas.height / 180;

  const loads: Promise<void>[] = [];
  for (let dRow = -Math.floor(tilesDown / 2); dRow <= Math.floor(tilesDown / 2); dRow++) {
    for (let dCol = -Math.floor(tilesAcross / 2); dCol <= Math.floor(tilesAcross / 2); dCol++) {
      const row = centerRow + dRow;
      const col = centerCol + dCol;
      if (row < 0 || row >= 2 ** zoom) continue;

      // Where this tile lands in the base canvas's pixel space.
      const tileLonMin = -180 + col * lonSpan;
      const tileLatMax = 90 - row * latSpan;
      const destX = (tileLonMin + 180) * pxPerLonDeg;
      const destY = (90 - tileLatMax) * pxPerLatDeg;
      const destW = lonSpan * pxPerLonDeg;
      const destH = latSpan * pxPerLatDeg;

      loads.push(
        loadTile(layer, zoom, row, col).then((img) => {
          if (!img) return;
          actx.drawImage(img, destX, destY, destW + 1, destH + 1);
          applyGamma(actx, Math.floor(destX), Math.floor(destY), Math.ceil(destW) + 1, Math.ceil(destH) + 1);
        })
      );
    }
  }
  await Promise.all(loads);
  markDirty();
}
