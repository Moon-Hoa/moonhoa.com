"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { generateMoonBaseTextures } from "@/lib/moonTexture";
import { generateDensityOverlayTexture, type DensityCell } from "@/lib/moonDensityTexture";
import { vec3ToLatLon } from "@/lib/moonGeo";
import MoonPoiMarkers from "./MoonPoiMarkers";
import LotRegionPanel from "./LotRegionPanel";

const RADIUS = 2;
// Distance (in sphere radii) below which the camera counts as "zoomed in"
// and the individual-lot overlay panel appears.
const ZOOM_TRIGGER_DISTANCE = RADIUS * 1.6;
const MIN_DISTANCE = RADIUS * 1.15;
const MAX_DISTANCE = RADIUS * 6;

export default function MoonViewer({ densityCells }: { densityCells: DensityCell[] | null }) {
  const [zoomCenter, setZoomCenter] = useState<{ latDeg: number; lonDeg: number } | null>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  // three-stdlib's OrbitControls (what drei re-exports) isn't worth pulling
  // in as an explicit type dependency just for this ref -- it's only ever
  // used to call .addEventListener("change", ...) in ZoomWatcher below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  return (
    <div className="moon-canvas-wrap">
      <Canvas
        dpr={[1, 1.75]}
        frameloop="demand"
        // Starts on the +X axis, facing lat 0/lon 0 (moonGeo's
        // latLonToVec3(0, 0, r) = (r, 0, 0)) -- facing Earth -- so a
        // visitor's first view is the familiar Earth-facing side rather
        // than the default +Z view.
        camera={{ position: [RADIUS * 3, 0, 0], fov: 45, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#dce5f0", "#0a0f1e", 0.4]} />
        <directionalLight position={[5, 3, 5]} intensity={1.3} />

        <MoonSurface sphereRef={sphereRef} />
        <DensityOverlay cells={densityCells} />
        <MoonPoiMarkers radius={RADIUS} occludeRef={sphereRef} />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          enablePan={false}
          minDistance={MIN_DISTANCE}
          maxDistance={MAX_DISTANCE}
        />
        <ZoomWatcher controlsRef={controlsRef} onCenterChange={setZoomCenter} />
      </Canvas>

      <LotRegionPanel center={zoomCenter} />
    </div>
  );
}

function MoonSurface({ sphereRef }: { sphereRef: React.RefObject<THREE.Mesh | null> }) {
  const { albedoTexture, bumpTexture } = useMemo(() => {
    const { albedoCanvas, bumpCanvas } = generateMoonBaseTextures();
    const albedo = new THREE.CanvasTexture(albedoCanvas);
    albedo.colorSpace = THREE.SRGBColorSpace;
    const bump = new THREE.CanvasTexture(bumpCanvas);
    return { albedoTexture: albedo, bumpTexture: bump };
  }, []);

  useEffect(() => {
    return () => {
      albedoTexture.dispose();
      bumpTexture.dispose();
    };
  }, [albedoTexture, bumpTexture]);

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[RADIUS, 96, 64]} />
      <meshStandardMaterial map={albedoTexture} bumpMap={bumpTexture} bumpScale={0.04} roughness={0.95} />
    </mesh>
  );
}

function DensityOverlay({ cells }: { cells: DensityCell[] | null }) {
  const texture = useMemo(() => {
    if (!cells || cells.length === 0) return null;
    const canvas = generateDensityOverlayTexture(cells);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, [cells]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh scale={[1.002, 1.002, 1.002]} renderOrder={1}>
      <sphereGeometry args={[RADIUS, 48, 32]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

// Watches the camera's distance/direction (OrbitControls always orbits the
// sphere's center at the origin with panning disabled, so camera.position
// alone tells us both "how zoomed in" and "which point on the surface is
// facing the viewer" -- no raycasting needed). Wired off the controls'
// own "change" event (fires only on actual interaction/damping decay, not
// per-frame) rather than useFrame. Renders nothing itself.
function ZoomWatcher({
  controlsRef,
  onCenterChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: React.RefObject<any>;
  onCenterChange: (center: { latDeg: number; lonDeg: number } | null) => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    function handleChange() {
      const distance = camera.position.length();
      if (distance > ZOOM_TRIGGER_DISTANCE) {
        onCenterChange(null);
        return;
      }
      const dir = camera.position.clone().normalize();
      const { latDeg, lonDeg } = vec3ToLatLon(dir);
      onCenterChange({ latDeg, lonDeg });
    }

    controls.addEventListener("change", handleChange);
    handleChange();

    return () => {
      controls.removeEventListener("change", handleChange);
    };
  }, [camera, controlsRef, onCenterChange]);

  return null;
}
