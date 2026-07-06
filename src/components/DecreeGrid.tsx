import FadeIn from "./FadeIn";
import { decrees } from "@/lib/content";

export default function DecreeGrid() {
  return (
    <FadeIn className="decree-grid">
      {decrees.map((decree) => (
        <div className="decree" key={decree.number}>
          <div className="decree-number">{decree.number}</div>
          <div className="decree-body">
            <div className="decree-title">{decree.title}</div>
            <p className="decree-text">{decree.text}</p>
            <span className={`decree-severity ${decree.severity}`}>
              {decree.severityLabel}
            </span>
          </div>
        </div>
      ))}
    </FadeIn>
  );
}
