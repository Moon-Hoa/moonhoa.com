"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { generateMoonBaseTextures, refineRegion } from "@/lib/moonRealTexture";
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
// Same debounce/min-move approach as LotRegionPanel -- absorbs OrbitControls
// damping/inertia jitter so a high-res tile refine isn't kicked off on every
// intermediate drag frame.
const REFINE_DEBOUNCE_MS = 280;
const REFINE_MIN_MOVE_DEG = 0.5;

export default function MoonViewer({
  densityCells,
  constrained = false,
}: {
  densityCells: DensityCell[] | null;
  constrained?: boolean;
}) {
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

        <MoonSurface sphereRef={sphereRef} zoomCenter={zoomCenter} constrained={constrained} />
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

// Real NASA/USGS imagery (moonRealTexture.ts), not the old procedural
// canvas art -- loaded async (network tile fetches), so this renders
// nothing until the first full-sphere composite arrives, then
// progressively repaints the camera-facing region at higher resolution
// as the user zooms in (see moonRealTexture.ts's refineRegion).
function MoonSurface({
  sphereRef,
  zoomCenter,
  constrained,
}: {
  sphereRef: React.RefObject<THREE.Mesh | null>;
  zoomCenter: { latDeg: number; lonDeg: number } | null;
  constrained: boolean;
}) {
  const { invalidate } = useThree();

  // Canvases/textures are created ONCE, synchronously, pre-filled with a
  // neutral placeholder -- three.js compiles a material's shader with
  // USE_MAP based on whether `map` was present at first compile. Starting
  // with `map={undefined}` and only later swapping in a loaded texture
  // (as this used to) never recompiles the shader to sample it, so the
  // map silently has zero effect forever (found via an empirical test:
  // tinting the material red rendered a flat, untextured red sphere).
  // Keeping the same texture *object* for the component's whole lifetime
  // and only repainting its canvas's pixels in place (+ needsUpdate,
  // which *does* just re-upload pixels, no recompile needed) sidesteps
  // the issue entirely.
  const { albedoTexture, bumpTexture } = useMemo(() => {
    const makePlaceholder = (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return canvas;
    };
    const albedo = new THREE.CanvasTexture(makePlaceholder("#8a8690"));
    albedo.colorSpace = THREE.SRGBColorSpace;
    const bump = new THREE.CanvasTexture(makePlaceholder("#808080"));
    return { albedoTexture: albedo, bumpTexture: bump };
  }, []);

  useEffect(() => {
    return () => {
      albedoTexture.dispose();
      bumpTexture.dispose();
    };
  }, [albedoTexture, bumpTexture]);

  useEffect(() => {
    let cancelled = false;
    generateMoonBaseTextures().then(({ albedoCanvas, bumpCanvas }) => {
      if (cancelled) return;
      const albedoCtx = (albedoTexture.image as HTMLCanvasElement).getContext("2d")!;
      albedoCtx.drawImage(albedoCanvas, 0, 0);
      const bumpCtx = (bumpTexture.image as HTMLCanvasElement).getContext("2d")!;
      bumpCtx.drawImage(bumpCanvas, 0, 0);
      albedoTexture.needsUpdate = true;
      bumpTexture.needsUpdate = true;
      invalidate();
    });
    return () => {
      cancelled = true;
    };
  }, [albedoTexture, bumpTexture, invalidate]);

  // Debounced high-res refine of the camera-facing patch on zoom-in.
  // Skipped entirely on constrained devices (#135's mobile/perf tier) --
  // those still get the full-sphere base composite, just not the extra
  // network/texture-repaint cost of continual close-up refinement.
  const lastRefinedRef = useRef<{ latDeg: number; lonDeg: number } | null>(null);
  useEffect(() => {
    if (!zoomCenter || constrained) return;

    const last = lastRefinedRef.current;
    if (last) {
      const moved = Math.hypot(zoomCenter.latDeg - last.latDeg, zoomCenter.lonDeg - last.lonDeg);
      if (moved < REFINE_MIN_MOVE_DEG) return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      lastRefinedRef.current = zoomCenter;
      refineRegion(albedoTexture.image as HTMLCanvasElement, zoomCenter.latDeg, zoomCenter.lonDeg, () => {
        if (cancelled) return;
        albedoTexture.needsUpdate = true;
        invalidate();
      });
    }, REFINE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [albedoTexture, zoomCenter, constrained, invalidate]);

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
