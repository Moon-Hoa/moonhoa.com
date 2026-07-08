// Sequential one-hue ramp (navy -> gold-light) for the density heatmap,
// anchored to the same two colors already in the design system's palette
// (--navy-mid, --gold-light). Validated for monotonic lightness via the
// dataviz skill's palette validator before use.
const LOW = [17, 24, 39]; // #111827 (--navy-mid)
const HIGH = [232, 201, 126]; // #e8c97e (--gold-light)

export function densityColor(fraction: number): string {
  const f = Math.max(0, Math.min(1, fraction));
  const [r, g, b] = LOW.map((low, i) => Math.round(low + f * (HIGH[i] - low)));
  return `rgb(${r}, ${g}, ${b})`;
}
