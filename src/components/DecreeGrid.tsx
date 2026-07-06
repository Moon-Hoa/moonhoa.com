import FadeIn from "./FadeIn";
import { decrees as regulationDecrees, type Decree } from "@/lib/content";

export default function DecreeGrid({ items = regulationDecrees }: { items?: Decree[] }) {
  return (
    <FadeIn className="decree-grid">
      {items.map((decree) => (
        <div className="decree" key={decree.number}>
          <div className="decree-number">{decree.number}</div>
          <div className="decree-body">
            <div className="decree-title">{decree.title}</div>
            <p className="decree-text">{decree.text}</p>
            {decree.severity && decree.severityLabel && (
              <span className={`decree-severity ${decree.severity}`}>{decree.severityLabel}</span>
            )}
          </div>
        </div>
      ))}
    </FadeIn>
  );
}
