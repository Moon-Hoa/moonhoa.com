// Procedural, stylized lunar surface — no external imagery, no DEM/elevation
// data (deliberate product call: see issue #53, logged 2026-07-10 — real
// NASA/USGS imagery + LOLA elevation data may be revisited later, but v1 is
// hand-drawn to match the site's own palette rather than photoreal).
//
// Deterministic seeded PRNG so the art is stable across remounts (no
// flicker on re-render, nothing to persist). Draws two canvases in one
// pass: an albedo (color) map and a lower-res greyscale height map fed to
// MeshStandardMaterial's bumpMap for cheap fake relief — three.js perturbs
// shading from a bumpMap in-shader, so this needs no normal-map derivation.

const ALBEDO_WIDTH = 2048;
const ALBEDO_HEIGHT = 1024;
const BUMP_WIDTH = 1024;
const BUMP_HEIGHT = 512;

const SEED = 0x6d6f6f6e; // 'moon' — fixed so the surface art never changes between loads

function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Crater {
  x: number; // 0..1 fraction across the equirect canvas
  y: number;
  r: number; // px, at ALBEDO_WIDTH scale
}

interface Maria {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
}

function generateFeatures(rng: () => number) {
  const craters: Crater[] = [];
  const craterCount = 220;
  for (let i = 0; i < craterCount; i++) {
    // Power-law-ish size distribution: mostly small craters, a few large ones.
    const r = 6 + Math.pow(rng(), 3) * 90;
    craters.push({ x: rng(), y: rng(), r });
  }

  const maria: Maria[] = [];
  const mariaCount = 34;
  for (let i = 0; i < mariaCount; i++) {
    maria.push({
      x: rng(),
      y: rng(),
      rx: 40 + rng() * 160,
      ry: 30 + rng() * 110,
      rot: rng() * Math.PI,
    });
  }

  return { craters, maria };
}

/** Lat/lon jurisdiction rectangle -> equirect pixel rect, matching moonGeo's UV convention. */
function boundsToRect(
  bounds: { latMinDeg: number; latMaxDeg: number; lonMinDeg: number; lonMaxDeg: number },
  width: number,
  height: number
) {
  const xMin = ((bounds.lonMinDeg + 180) / 360) * width;
  const xMax = ((bounds.lonMaxDeg + 180) / 360) * width;
  // v = (90-lat)/180 is decreasing in lat, so latMax maps to the smaller y.
  const yMin = ((90 - bounds.latMaxDeg) / 180) * height;
  const yMax = ((90 - bounds.latMinDeg) / 180) * height;
  return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
}

export interface MoonBaseTextures {
  albedoCanvas: HTMLCanvasElement;
  bumpCanvas: HTMLCanvasElement;
}

export function generateMoonBaseTextures(jurisdictionBounds: {
  latMinDeg: number;
  latMaxDeg: number;
  lonMinDeg: number;
  lonMaxDeg: number;
}): MoonBaseTextures {
  const rng = mulberry32(SEED);
  const { craters, maria } = generateFeatures(rng);

  const albedoCanvas = document.createElement("canvas");
  albedoCanvas.width = ALBEDO_WIDTH;
  albedoCanvas.height = ALBEDO_HEIGHT;
  const actx = albedoCanvas.getContext("2d")!;

  // Base albedo tied to the site's own palette rather than photoreal grey.
  actx.fillStyle = "#a8a0a8";
  actx.fillRect(0, 0, ALBEDO_WIDTH, ALBEDO_HEIGHT);

  // Maria — desaturated navy blobs.
  actx.fillStyle = "rgba(26, 37, 64, 0.55)"; // --navy-light
  for (const m of maria) {
    actx.save();
    actx.translate(m.x * ALBEDO_WIDTH, m.y * ALBEDO_HEIGHT);
    actx.rotate(m.rot);
    actx.beginPath();
    actx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
    actx.fill();
    actx.restore();
  }

  // Craters — bright rim, dark floor, drawn via radial gradient.
  for (const c of craters) {
    const cx = c.x * ALBEDO_WIDTH;
    const cy = c.y * ALBEDO_HEIGHT;
    const grad = actx.createRadialGradient(cx, cy, 0, cx, cy, c.r);
    grad.addColorStop(0, "rgba(40, 34, 46, 0.65)");
    grad.addColorStop(0.75, "rgba(40, 34, 46, 0.35)");
    grad.addColorStop(0.85, "rgba(232, 201, 126, 0.25)"); // --gold-light rim highlight
    grad.addColorStop(1, "rgba(232, 201, 126, 0)");
    actx.fillStyle = grad;
    actx.beginPath();
    actx.arc(cx, cy, c.r, 0, Math.PI * 2);
    actx.fill();
  }

  // Fine grain for texture.
  const grainRng = mulberry32(SEED ^ 0x9e3779b9);
  actx.globalAlpha = 0.04;
  for (let i = 0; i < 6000; i++) {
    actx.fillStyle = grainRng() > 0.5 ? "#ffffff" : "#000000";
    actx.fillRect(grainRng() * ALBEDO_WIDTH, grainRng() * ALBEDO_HEIGHT, 1, 1);
  }
  actx.globalAlpha = 1;

  // Static jurisdiction boundary — dashed gold rectangle around the seeded lot grid.
  const rect = boundsToRect(jurisdictionBounds, ALBEDO_WIDTH, ALBEDO_HEIGHT);
  actx.save();
  actx.strokeStyle = "#e8c97e";
  actx.lineWidth = 3;
  actx.setLineDash([14, 10]);
  actx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  actx.restore();

  // Bump map: same feature list, lower resolution, greyscale height only.
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = BUMP_WIDTH;
  bumpCanvas.height = BUMP_HEIGHT;
  const bctx = bumpCanvas.getContext("2d")!;
  const scaleX = BUMP_WIDTH / ALBEDO_WIDTH;
  const scaleY = BUMP_HEIGHT / ALBEDO_HEIGHT;

  bctx.fillStyle = "#808080";
  bctx.fillRect(0, 0, BUMP_WIDTH, BUMP_HEIGHT);

  for (const m of maria) {
    bctx.save();
    bctx.translate(m.x * BUMP_WIDTH, m.y * BUMP_HEIGHT);
    bctx.rotate(m.rot);
    bctx.fillStyle = "#707070"; // maria sit slightly lower
    bctx.beginPath();
    bctx.ellipse(0, 0, m.rx * scaleX, m.ry * scaleY, 0, 0, Math.PI * 2);
    bctx.fill();
    bctx.restore();
  }

  for (const c of craters) {
    const cx = c.x * BUMP_WIDTH;
    const cy = c.y * BUMP_HEIGHT;
    const r = c.r * scaleX;
    const grad = bctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, "#202020"); // floor: dark = low
    grad.addColorStop(0.8, "#404040");
    grad.addColorStop(0.92, "#d8d8d8"); // rim: bright = high
    grad.addColorStop(1, "#808080");
    bctx.fillStyle = grad;
    bctx.beginPath();
    bctx.arc(cx, cy, r, 0, Math.PI * 2);
    bctx.fill();
  }

  return { albedoCanvas, bumpCanvas };
}
