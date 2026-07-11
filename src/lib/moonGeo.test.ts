import { test } from "node:test";
import assert from "node:assert/strict";
import { latLonToVec3, vec3ToLatLon } from "./moonGeo";

function approxEqual(a: number, b: number, eps = 1e-6) {
  assert.ok(Math.abs(a - b) < eps, `expected ${a} ~= ${b}`);
}

test("sub-Earth point (0,0) sits on +X, facing the default camera", () => {
  const p = latLonToVec3(0, 0, 1);
  approxEqual(p.x, 1);
  approxEqual(p.y, 0);
  approxEqual(p.z, 0);
});

test("north pole sits on +Y regardless of longitude", () => {
  const p = latLonToVec3(90, 47, 1);
  approxEqual(p.x, 0);
  approxEqual(p.y, 1);
  approxEqual(p.z, 0);
});

test("latLonToVec3 / vec3ToLatLon round-trip for known points", () => {
  const points: [number, number][] = [
    [0, 0],
    [0, 90],
    [0, -90],
    [45, 30],
    [-45, -120],
    [0.67, 23.47], // Tranquility Base
  ];

  for (const [latDeg, lonDeg] of points) {
    const v = latLonToVec3(latDeg, lonDeg, 1);
    const back = vec3ToLatLon(v);
    approxEqual(back.latDeg, latDeg, 1e-4);
    approxEqual(back.lonDeg, lonDeg, 1e-4);
  }
});

test("vec3ToLatLon clamps out-of-range y from floating point drift", () => {
  const result = vec3ToLatLon({ x: 0, y: 1.0000001, z: 0 });
  approxEqual(result.latDeg, 90, 1e-3);
});
