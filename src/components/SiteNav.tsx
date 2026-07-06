import Link from "next/link";
import { navLinks } from "@/lib/content";

export default function SiteNav() {
  return (
    <nav>
      <ul>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
