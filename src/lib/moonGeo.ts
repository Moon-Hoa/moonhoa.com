// Lat/lon <-> 3D sphere position, and the inverse used to figure out what
// point on the Moon the camera is currently facing.
//
// Convention matches the equirectangular texture mapping used by
// moonRealTexture.ts/moonTiles.ts/moonDensityTexture.ts: u = (lon+180)/360, v = (90-lat)/180.
// Any change here must stay in sync with those UV formulas or the texture
// and the 3D geometry (POI markers, camera->lat/lon) will disagree about
// where a given lat/lon actually sits on the sphere.

export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export function latLonToVec3(latDeg: number, lonDeg: number, radius: number): Vec3Like {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return {
    x: radius * Math.cos(lat) * Math.cos(lon),
    y: radius * Math.sin(lat),
    z: -radius * Math.cos(lat) * Math.sin(lon),
  };
}

/** `dir` must already be a unit vector (e.g. camera direction relative to the sphere's center). */
export function vec3ToLatLon(dir: Vec3Like): { latDeg: number; lonDeg: number } {
  const latDeg = (Math.asin(Math.max(-1, Math.min(1, dir.y))) * 180) / Math.PI;
  const lonDeg = (Math.atan2(-dir.z, dir.x) * 180) / Math.PI;
  return { latDeg, lonDeg };
}
