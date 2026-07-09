import FadeIn from "./FadeIn";
import { Panel, PanelRow } from "./Panel";
import { duesSchedule } from "@/lib/staticPagesContent";

export default function DuesTable() {
  return (
    <FadeIn>
      <Panel>
        {duesSchedule.map((row) => (
          <PanelRow className="dues-row" key={row.item}>
            <div className="dues-item">{row.item}</div>
            <div className="dues-amount">{row.amount}</div>
            <p className="dues-note">{row.note}</p>
          </PanelRow>
        ))}
      </Panel>
    </FadeIn>
  );
}
