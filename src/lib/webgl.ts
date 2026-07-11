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
