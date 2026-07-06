import { navLinks } from "@/lib/content";

export default function SiteNav() {
  return (
    <nav>
      <ul>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
