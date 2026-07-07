import FadeIn from "./FadeIn";
import { boardMembers } from "@/lib/staticPagesContent";

export default function BoardGrid() {
  return (
    <FadeIn className="board-grid">
      {boardMembers.map((member) => (
        <div className="board-card" key={member.name}>
          <div className="board-name">{member.name}</div>
          <div className="board-title">{member.title}</div>
          <p className="board-bio">{member.bio}</p>
        </div>
      ))}
    </FadeIn>
  );
}
