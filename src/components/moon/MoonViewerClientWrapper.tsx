"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL2, isConstrainedDevice } from "@/lib/webgl";
import type { DensityCell } from "@/lib/moonDensityTexture";

const MoonViewer = dynamic(() => import("./MoonViewer"), {
  ssr: false,
  loading: () => <MoonViewerSkeleton />,
});

export default function MoonViewerClientWrapper({
  densityCells,
  fallback,
}: {
  densityCells: DensityCell[] | null;
  fallback: React.ReactNode;
}) {
  // Starts `null` (not an eager hasWebGL2() call) so server HTML and the
  // first client paint match exactly -- the real check only runs after
  // mount, same pattern this codebase already uses for FadeIn's
  // IntersectionObserver. Avoids a hydration mismatch warning.
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);
  const [constrained, setConstrained] = useState(false);

  useEffect(() => {
    function checkSupport() {
      setSupportsWebGL(hasWebGL2());
      setConstrained(isConstrainedDevice());
    }
    checkSupport();
  }, []);

  if (supportsWebGL === null) return <MoonViewerSkeleton />;
  if (!supportsWebGL) return <>{fallback}</>;
  return <MoonViewer densityCells={densityCells} constrained={constrained} />;
}

function MoonViewerSkeleton() {
  return (
    <div className="moon-canvas-wrap moon-canvas-skeleton" aria-hidden="true">
      <p className="lot-picker-note">Loading the 3D view…</p>
    </div>
  );
}
