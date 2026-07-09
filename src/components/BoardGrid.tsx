import FadeIn from "./FadeIn";
import { CardGrid, Card } from "./CardGrid";
import { boardMembers } from "@/lib/staticPagesContent";

export default function BoardGrid() {
  return (
    <FadeIn>
      <CardGrid minWidth={240}>
        {boardMembers.map((member) => (
          <Card key={member.name}>
            <div className="board-name">{member.name}</div>
            <div className="board-title">{member.title}</div>
            <p className="board-bio">{member.bio}</p>
          </Card>
        ))}
      </CardGrid>
    </FadeIn>
  );
}
