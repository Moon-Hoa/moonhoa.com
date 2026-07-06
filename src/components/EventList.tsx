import FadeIn from "./FadeIn";
import { events } from "@/lib/content";

export default function EventList() {
  return (
    <FadeIn className="event-list">
      {events.map((event) => (
        <div className="event-item" key={`${event.day}-${event.title}`}>
          <div className="event-date">
            <div className="event-day">{event.day}</div>
            <div className="event-dow">{event.dow}</div>
          </div>
          <div>
            <div className="event-title">{event.title}</div>
            <p className="event-detail">{event.detail}</p>
          </div>
          <div className="event-type">{event.type}</div>
        </div>
      ))}
    </FadeIn>
  );
}
