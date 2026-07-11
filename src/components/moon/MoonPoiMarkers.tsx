"use client";

import { useState } from "react";
import Link from "next/link";
import { Html } from "@react-three/drei";
import type { Mesh, Object3D } from "three";
import { latLonToVec3 } from "@/lib/moonGeo";
import { moonPois, type MoonPoi } from "@/lib/moonPoi";
import { Panel, PanelRow } from "@/components/Panel";

export default function MoonPoiMarkers({
  radius,
  occludeRef,
}: {
  radius: number;
  occludeRef: React.RefObject<Mesh | null>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      {moonPois.map((poi) => {
        const pos = latLonToVec3(poi.latDeg, poi.lonDeg, radius * 1.01);
        const active = activeId === poi.id;
        return (
          <Html
            key={poi.id}
            position={[pos.x, pos.y, pos.z]}
            // Mesh extends Object3D; drei's occlude prop wants
            // RefObject<Object3D> specifically (non-null), which React's
            // ref-object variance won't infer automatically from a
            // RefObject<Mesh | null> -- safe cast, drei only reads
            // .current for occlusion raycasting.
            occlude={[occludeRef as unknown as React.RefObject<Object3D>]}
            center
            distanceFactor={radius * 3.2}
            zIndexRange={[10, 0]}
          >
            <MarkerButton poi={poi} active={active} onToggle={() => setActiveId(active ? null : poi.id)} />
          </Html>
        );
      })}
    </>
  );
}

function MarkerButton({ poi, active, onToggle }: { poi: MoonPoi; active: boolean; onToggle: () => void }) {
  return (
    <div className={`moon-poi-marker${active ? " active" : ""}`}>
      <button
        type="button"
        className={`moon-poi-dot${poi.kind === "landing-site" ? " landing-site" : ""}`}
        aria-label={poi.label}
        title={poi.label}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      />
      {active && (
        <Panel className="moon-poi-popover">
          <PanelRow className="moon-poi-popover-row">
            <strong>{poi.label}</strong>
            <p>{poi.description}</p>
            {poi.kind === "landing-site" && (
              <Link href="/legacy-structures" onClick={(e) => e.stopPropagation()}>
                Legacy Structures Register →
              </Link>
            )}
          </PanelRow>
        </Panel>
      )}
    </div>
  );
}
