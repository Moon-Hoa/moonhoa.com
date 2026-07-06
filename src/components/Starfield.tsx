"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const stars: HTMLDivElement[] = [];
    for (let i = 0; i < 200; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() < 0.85 ? 1 : Math.random() < 0.7 ? 1.5 : 2;
      s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--lo:${(Math.random() * 0.2 + 0.05).toFixed(2)};--hi:${(Math.random() * 0.5 + 0.2).toFixed(2)};--d:${(Math.random() * 5 + 2).toFixed(1)}s;animation-delay:${(Math.random() * 6).toFixed(1)}s;`;
      el.appendChild(s);
      stars.push(s);
    }

    return () => {
      stars.forEach((s) => s.remove());
    };
  }, []);

  return <div className="starfield" ref={ref} aria-hidden="true" />;
}
