import Link from "next/link";
import Ornament from "./Ornament";

export default function SiteFooter() {
  return (
    <footer>
      <Ornament style={{ maxWidth: 500, margin: "0 auto 36px" }}>
        ✦ &nbsp; Moon HOA &nbsp; ✦
      </Ornament>
      <div className="footer-seal">🌕</div>
      <div className="footer-org">Moon Homeowners Association · Chartered 2088</div>
      <p className="footer-legal">
        The Moon HOA operates under the administrative authority of the
        Lunar Residential Authority (the &ldquo;LRA,&rdquo; the
        &ldquo;Authority,&rdquo; or, informally, &ldquo;the people who sent
        you that letter,&rdquo; per §1.1.1). All rules contained herein are
        binding, enforceable, and largely unenforced. The Association accepts
        no responsibility for property damage caused by meteorite impact,
        tidal forces, or the general hostility of the lunar environment.
        Membership is automatic upon occupancy and cannot be revoked,
        transferred, or escaped.
      </p>
      <div className="footer-links">
        <Link href="/#regulations">Bylaws</Link>
        <Link href="/#amenities">Amenities</Link>
        <Link href="/#calendar">Calendar</Link>
        <Link href="/#notices">Notices</Link>
        <Link href="/#contact">Contact</Link>
        <a href="#">Privacy Policy (9 Pages)</a>
        <a href="#">Definitions Annex</a>
      </div>
      <p
        style={{
          marginTop: 28,
          fontSize: ".78rem",
          color: "rgba(136,150,170,.4)",
          fontFamily: "var(--font-playfair), serif",
          letterSpacing: ".15em",
        }}
      >
        © 2088–{new Date().getFullYear()} Moon Homeowners Association. All
        rights reserved. Earth-visible from 384,400 km.
      </p>
    </footer>
  );
}
