// Feature-detect WebGL2 support directly rather than sniffing UA/viewport —
// the actual capability is what matters for whether the 3D Moon view can
// run at all.
export function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

// Distinct from hasWebGL2(): this is for devices that CAN run WebGL2 but
// are memory/bandwidth-constrained (issue #135's tiled real-imagery
// renderer is much heavier than the old procedural canvas). navigator.
// deviceMemory isn't implemented in every browser (notably Safari), so
// this falls back to a coarse mobile-UA/viewport-width heuristic rather
// than assuming "capable" by default — the failure mode of wrongly
// capping detail on a powerful device is far cheaper than the failure
// mode of a constrained device attempting full tile-refinement.
export function isConstrainedDevice(): boolean {
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof deviceMemory === "number") return deviceMemory <= 4;

  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const isNarrowViewport = window.innerWidth < 768;
  return isMobileUA || isNarrowViewport;
}
