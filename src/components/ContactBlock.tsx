import FadeIn from "./FadeIn";
import { CardGrid, Card } from "./CardGrid";

export default function ContactBlock() {
  return (
    <FadeIn>
      <CardGrid minWidth={200}>
        <Card>
          <div className="contact-label">Official Correspondence</div>
          <p className="contact-value">admin@moonhoa.com</p>
          <p className="contact-note">
            All messages are automatically filtered to spam. Response time: 1–3
            lunar cycles.
          </p>
        </Card>
        <Card>
          <div className="contact-label">Compliance Office</div>
          <p className="contact-value">compliance@moonhoa.com</p>
          <p className="contact-note">
            For violation reporting and strongly-worded-letter requests. Open
            during Association-approved hours only.
          </p>
        </Card>
        <Card>
          <div className="contact-label">Office Hours</div>
          <p className="contact-value">Saturdays, ~14:00 UTC</p>
          <p className="contact-note">
            Meetings are mandatory. Opinions expressed will be noted but not
            acted upon.
          </p>
        </Card>
        <Card>
          <div className="contact-label">Jurisdiction</div>
          <p className="contact-value">Full Lunar Surface</p>
          <p className="contact-note">
            Including Mare Tranquillitatis, the Mons Olympus vicinity, and all
            craters regardless of naming rights.
          </p>
        </Card>
      </CardGrid>
    </FadeIn>
  );
}
