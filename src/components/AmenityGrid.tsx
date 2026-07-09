import FadeIn from "./FadeIn";
import { CardGrid, Card } from "./CardGrid";
import { amenities } from "@/lib/content";

export default function AmenityGrid() {
  return (
    <FadeIn>
      <CardGrid minWidth={220}>
        {amenities.map((amenity) => (
          <Card key={amenity.name}>
            <span className="amenity-icon">{amenity.icon}</span>
            <div className="amenity-name">{amenity.name}</div>
            <p className="amenity-desc">{amenity.desc}</p>
            <span className={`amenity-status status-${amenity.status}`}>
              {amenity.statusLabel}
            </span>
          </Card>
        ))}
      </CardGrid>
    </FadeIn>
  );
}
