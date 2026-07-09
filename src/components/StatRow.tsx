import FadeIn from "./FadeIn";
import { CardGrid, Card } from "./CardGrid";
import { stats } from "@/lib/content";

export default function StatRow() {
  return (
    <FadeIn>
      <CardGrid minWidth={140} className="stat-row">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </Card>
        ))}
      </CardGrid>
    </FadeIn>
  );
}
