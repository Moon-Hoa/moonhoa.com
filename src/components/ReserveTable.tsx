import FadeIn from "./FadeIn";
import { Panel, PanelRow } from "./Panel";
import type { ReserveComponent } from "@/lib/staticPagesContent";

export default function ReserveTable({ items }: { items: ReserveComponent[] }) {
  return (
    <FadeIn>
      <Panel>
        {items.map((row) => (
          <PanelRow className="reserve-row" key={row.name}>
            <span className="reserve-name">{row.name}</span>
            <span className="reserve-pct">{row.fundedPct}</span>
            <span className="reserve-status">{row.status}</span>
          </PanelRow>
        ))}
      </Panel>
    </FadeIn>
  );
}
