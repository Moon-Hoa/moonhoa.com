import FadeIn from "./FadeIn";
import type { NoticeItem } from "@/lib/content";

export default function NoticeCard({
  notice,
  style,
}: {
  notice: NoticeItem;
  style?: React.CSSProperties;
}) {
  return (
    <FadeIn className="notice" style={style}>
      <div className="notice-stamp">{notice.stamp}</div>
      <h3>{notice.title}</h3>
      {notice.paragraphs.map((paragraph, i) => (
        <p
          key={i}
          style={i === notice.paragraphs.length - 1 ? { marginBottom: 0 } : undefined}
        >
          {paragraph}
        </p>
      ))}
    </FadeIn>
  );
}
