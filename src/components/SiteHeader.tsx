export default function SiteHeader() {
  return (
    <header>
      <div className="header-top-bar">
        Established by Lunar Charter · Anno Domini 2088 · Sol-Earth Orbit Zone 1
      </div>

      <div className="seal-wrapper">
        <div className="seal">
          <svg
            className="seal-ring"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path
                id="circle-path"
                d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
              />
            </defs>
            <text
              fontFamily="Playfair Display, serif"
              fontSize="7.5"
              fill="rgba(201,168,76,0.7)"
              letterSpacing="3.2"
            >
              <textPath href="#circle-path">
                MOON HOMEOWNERS ASSOCIATION · OFFICIAL SEAL · EST. 2088 ·
              </textPath>
            </text>
          </svg>
          <span className="seal-inner">🌕</span>
        </div>
      </div>

      <div className="site-subtitle">
        Official Governing Body of Lunar Residential Properties
      </div>
      <h1 className="site-title">
        Moon <span>Homeowners</span>
        <br />
        Association
      </h1>
      <p className="header-tagline">
        Upholding property standards, community decorum, and dust
        displacement regulations across all crater-side developments since
        2088.
      </p>

      <div className="ornament" style={{ maxWidth: 400, margin: "0 auto" }}>
        <span className="ornament-center">
          ✦ &nbsp; Jurisdiction: Full Lunar Surface &nbsp; ✦
        </span>
      </div>

      <div className="header-badges">
        <div className="badge">ISO 9001:2088 Certified</div>
        <div className="badge">Interplanetary HOA Alliance Member</div>
        <div className="badge">Zero-G Compliant</div>
        <div className="badge">Earth-Visibility Rated</div>
        <div className="badge">Order. Albedo. Compliance.</div>
      </div>
    </header>
  );
}
