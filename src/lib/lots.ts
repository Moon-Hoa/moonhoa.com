// Selenographic lot grid: real Moon lat/long coordinates divided into fixed
// 0.1°×0.1° cells (~9 km² near the equator). Every cell is a potential lot;
// `LOT_GRID` bounds which cells actually get seeded.
//
// Whole-sphere coverage (near side, far side, and poles) — every square
// inch of the Moon is addressable, ~6,485,401 lots total. Previously
// scoped to a near-side-only rectangle as a scarcity/gameplay knob; see
// issue #134 for the whole-sphere expansion.
export const LOT_GRID = {
  stepDeg: 0.1,
  latMinDeg: -90,
  latMaxDeg: 90,
  lonMinDeg: -180,
  lonMaxDeg: 180,
} as const;

// Offsets covering the full theoretical -90..90 / -180..180 range at 0.1°
// resolution, so encoded codes stay non-negative and fit in 4 digits
// regardless of which subset of the grid is actually seeded.
const LAT_OFFSET = 900;
const LON_OFFSET = 1800;

export function degToCell(deg: number, stepDeg: number = LOT_GRID.stepDeg): number {
  return Math.round(deg / stepDeg);
}

export function cellToDeg(cell: number, stepDeg: number = LOT_GRID.stepDeg): number {
  return cell * stepDeg;
}

/** Deterministic public lot code, e.g. 'MOON-0472-1188'. */
export function lotIdForCell(latCell: number, lonCell: number): string {
  const latCode = String(latCell + LAT_OFFSET).padStart(4, "0");
  const lonCode = String(lonCell + LON_OFFSET).padStart(4, "0");
  return `MOON-${latCode}-${lonCode}`;
}

export function cellsForLotId(lotId: string): { latCell: number; lonCell: number } {
  const match = /^MOON-(\d{4})-(\d{4})$/.exec(lotId);
  if (!match) throw new Error(`Invalid lot_id: ${lotId}`);
  const [, latCodeStr, lonCodeStr] = match;
  return {
    latCell: Number(latCodeStr) - LAT_OFFSET,
    lonCell: Number(lonCodeStr) - LON_OFFSET,
  };
}

export interface GridCell {
  latCell: number;
  lonCell: number;
}

export interface GridBounds {
  stepDeg: number;
  latMinDeg: number;
  latMaxDeg: number;
  lonMinDeg: number;
  lonMaxDeg: number;
}

/** Yields every {latCell, lonCell} pair in the seeded grid, in row-major order. */
export function* generateGridCells(bounds: GridBounds = LOT_GRID): Generator<GridCell> {
  const latCellMin = degToCell(bounds.latMinDeg, bounds.stepDeg);
  const latCellMax = degToCell(bounds.latMaxDeg, bounds.stepDeg);
  const lonCellMin = degToCell(bounds.lonMinDeg, bounds.stepDeg);
  const lonCellMax = degToCell(bounds.lonMaxDeg, bounds.stepDeg);

  for (let latCell = latCellMin; latCell <= latCellMax; latCell++) {
    for (let lonCell = lonCellMin; lonCell <= lonCellMax; lonCell++) {
      yield { latCell, lonCell };
    }
  }
}

export function gridSize(bounds: GridBounds = LOT_GRID): number {
  const latCells = degToCell(bounds.latMaxDeg, bounds.stepDeg) - degToCell(bounds.latMinDeg, bounds.stepDeg) + 1;
  const lonCells = degToCell(bounds.lonMaxDeg, bounds.stepDeg) - degToCell(bounds.lonMinDeg, bounds.stepDeg) + 1;
  return latCells * lonCells;
}
