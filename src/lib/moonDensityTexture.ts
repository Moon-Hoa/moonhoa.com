// Draws the same lot_density_grid buckets that power the flat /density
// heatmap as hard-edged rects on a transparent equirect canvas, for use as
// a second, unlit sphere layered over the base moon (kept separate from
// moonRealTexture.ts so periodic density-data refreshes never force a
// re-fetch/re-composite of the real-imagery surface tiles).
import { densityColor } from "./densityColor";

const WIDTH = 1024;
const HEIGHT = 512;
const BUCKET_DEG = 5; // lot_density_grid buckets are floor(cell/50) at a 0.1° step = 5° buckets

export interface DensityCell {
  lat_bucket: number;
  lon_bucket: number;
  total_lots: number;
  claimed_lots: number;
}

export function generateDensityOverlayTexture(cells: DensityCell[]): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (const cell of cells) {
    const latDeg = cell.lat_bucket * BUCKET_DEG;
    const lonDeg = cell.lon_bucket * BUCKET_DEG;

    // Same u/v convention as moonGeo/moonTexture: u=(lon+180)/360, v=(90-lat)/180.
    const x = ((lonDeg + 180) / 360) * WIDTH;
    const yTop = ((90 - (latDeg + BUCKET_DEG)) / 180) * HEIGHT;
    const w = (BUCKET_DEG / 360) * WIDTH;
    const h = (BUCKET_DEG / 180) * HEIGHT;

    const fraction = cell.total_lots > 0 ? cell.claimed_lots / cell.total_lots : 0;
    ctx.fillStyle = densityColor(fraction);
    ctx.globalAlpha = 0.62;
    // +1px overdraw avoids hairline seams between adjacent buckets from sub-pixel rounding.
    ctx.fillRect(Math.floor(x), Math.floor(yTop), Math.ceil(w) + 1, Math.ceil(h) + 1);
  }

  ctx.globalAlpha = 1;
  return canvas;
}
