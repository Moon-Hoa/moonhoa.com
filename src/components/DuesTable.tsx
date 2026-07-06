import FadeIn from "./FadeIn";
import { duesSchedule } from "@/lib/staticPagesContent";

export default function DuesTable() {
  return (
    <FadeIn className="dues-table">
      {duesSchedule.map((row) => (
        <div className="dues-row" key={row.item}>
          <div className="dues-item">{row.item}</div>
          <div className="dues-amount">{row.amount}</div>
          <p className="dues-note">{row.note}</p>
        </div>
      ))}
    </FadeIn>
  );
}
