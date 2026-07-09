import FadeIn from "./FadeIn";
import { Panel, PanelRow } from "./Panel";
import type { Committee } from "@/lib/staticPagesContent";

export default function CommitteeTable({ items }: { items: Committee[] }) {
  return (
    <FadeIn>
      <Panel>
        {items.map((committee) => (
          <PanelRow className="committee-row" key={committee.name}>
            <span className="committee-name">{committee.name}</span>
            <span className="committee-chair">{committee.chair}</span>
            <span className="committee-cadence">{committee.cadence}</span>
          </PanelRow>
        ))}
      </Panel>
    </FadeIn>
  );
}
