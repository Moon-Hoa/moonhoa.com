import FadeIn from "./FadeIn";
import { stats } from "@/lib/content";

export default function StatRow() {
  return (
    <FadeIn className="stat-row">
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </FadeIn>
  );
}
