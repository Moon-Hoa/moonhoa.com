"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNavLinks, secondaryNavLinks } from "@/lib/content";

function useIsActive(pathname: string) {
  return (href: string) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };
}

export default function SiteNav() {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <nav>
      <div className="nav-inner" ref={containerRef}>
        <Link href="/" className="nav-brand">
          Moon HOA
        </Link>

        <ul className="nav-primary">
          {primaryNavLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={isActive(link.href) ? "active" : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((o) => !o)}
        >
          Menu {open ? "▴" : "▾"}
        </button>

        {open && (
          <div className="nav-panel" role="menu">
            <div className="nav-panel-mobile-only">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? "active" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="nav-panel-divider" />
            </div>
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
