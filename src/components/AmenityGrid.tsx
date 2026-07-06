import FadeIn from "./FadeIn";
import { amenities } from "@/lib/content";

export default function AmenityGrid() {
  return (
    <FadeIn className="amenity-grid">
      {amenities.map((amenity) => (
        <div className="amenity-card" key={amenity.name}>
          <span className="amenity-icon">{amenity.icon}</span>
          <div className="amenity-name">{amenity.name}</div>
          <p className="amenity-desc">{amenity.desc}</p>
          <span className={`amenity-status status-${amenity.status}`}>
            {amenity.statusLabel}
          </span>
        </div>
      ))}
    </FadeIn>
  );
}
