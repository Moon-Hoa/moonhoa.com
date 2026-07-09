import FadeIn from "./FadeIn";
import { Panel, PanelRow } from "./Panel";
import type { FineScheduleItem } from "@/lib/staticPagesContent";

export default function FineTable({ items }: { items: FineScheduleItem[] }) {
  return (
    <FadeIn>
      <Panel>
        {items.map((row) => (
          <PanelRow className="fine-row" key={row.violation}>
            <span className="fine-violation">{row.violation}</span>
            <span className="fine-section">{row.section}</span>
            <span className="fine-amount">{row.fine}</span>
          </PanelRow>
        ))}
      </Panel>
    </FadeIn>
  );
}
