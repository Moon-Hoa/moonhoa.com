"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
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
            occlude={[occludeRef]}
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
          </PanelRow>
        </Panel>
      )}
    </div>
  );
}
