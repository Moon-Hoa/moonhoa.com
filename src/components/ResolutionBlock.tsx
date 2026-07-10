import FadeIn from "./FadeIn";

export default function ResolutionBlock() {
  return (
    <FadeIn className="resolution">
      <div className="resolution-number">Resolution · 2091-R-07</div>
      <h3>Official Position on Circadian Rhythms</h3>
      <p>
        Per §4.3 (Circadian Compliance), the Board acknowledges that the
        lunar day is approximately 708.7 Earth hours, comprising roughly 354
        hours of daylight and 354 of darkness. The Board does not consider
        this a relevant factor in scheduling. All residents remain on an
        Earth-synchronised UTC schedule for fines, meetings, and curfews.
        Curfew is 21:00 UTC. Please calibrate accordingly.
      </p>
    </FadeIn>
  );
}
