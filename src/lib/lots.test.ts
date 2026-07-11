import { test } from "node:test";
import assert from "node:assert/strict";
import { LOT_GRID, cellsForLotId, degToCell, gridSize, lotIdForCell } from "./lots";

test("LOT_GRID covers the whole sphere at 0.1° resolution", () => {
  assert.equal(LOT_GRID.latMinDeg, -90);
  assert.equal(LOT_GRID.latMaxDeg, 90);
  assert.equal(LOT_GRID.lonMinDeg, -180);
  assert.equal(LOT_GRID.lonMaxDeg, 180);
  assert.equal(gridSize(LOT_GRID), 6485401);
});

test("lot IDs round-trip at the extremes of the full ±90/±180 range", () => {
  const latCells = [degToCell(LOT_GRID.latMinDeg), 0, degToCell(LOT_GRID.latMaxDeg)];
  const lonCells = [degToCell(LOT_GRID.lonMinDeg), 0, degToCell(LOT_GRID.lonMaxDeg)];

  for (const latCell of latCells) {
    for (const lonCell of lonCells) {
      const lotId = lotIdForCell(latCell, lonCell);
      assert.deepEqual(cellsForLotId(lotId), { latCell, lonCell });
    }
  }
});
