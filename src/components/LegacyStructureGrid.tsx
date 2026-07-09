import FadeIn from "./FadeIn";
import { CardGrid, Card } from "./CardGrid";
import type { LegacyStructure } from "@/lib/staticPagesContent";

export default function LegacyStructureGrid({ items }: { items: LegacyStructure[] }) {
  return (
    <FadeIn>
      <CardGrid minWidth={280}>
        {items.map((structure) => (
          <Card key={structure.site}>
            <div className="legacy-name">{structure.site}</div>
            <div className="legacy-origin">{structure.origin}</div>
            <div className="legacy-coords">
              {structure.coordinates} · Buffer Zone: {structure.bufferZone}
            </div>
            <p className="legacy-contents">{structure.contents}</p>
            <span className="legacy-status">{structure.status}</span>
          </Card>
        ))}
      </CardGrid>
    </FadeIn>
  );
}
