export interface Decree {
  number: string;
  title: string;
  text: string;
  severity?: "high" | "med" | "low";
  severityLabel?: string;
}

export const decrees: Decree[] = [
  {
    number: "§ 1.1",
    title: "Rocket Landing Curfew",
    text: 'No unauthorized rocket landings are permitted between the hours of 21:00 and 06:00 Coordinated Universal Time. Residents citing "it\'s technically always daytime in space" will be issued a formal reprimand and directed to the Definitions Annex.',
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 1.2",
    title: "Lunar Dust Containment Policy",
    text: "All moon dust must be confined to your registered property boundary. Regolith particulates observed drifting into adjacent craters are subject to a strongly worded letter, followed by a second, slightly more strongly worded letter.",
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 1.3",
    title: "Lawn Ornament Height Restriction",
    text: 'No alien lawn ornaments may exceed three (3) feet in height. Inflatable Martian effigies are expressly prohibited. This includes "vintage" inflatable Martians, "ironic" inflatable Martians, and inflatable Martians described as "art."',
    severity: "med",
    severityLabel: "Moderately Enforced",
  },
  {
    number: "§ 1.4",
    title: "Earth-Visibility Reflectivity Standards",
    text: 'All properties must maintain a minimum albedo rating of 0.12, consistent with established lunar surface standards. Properties found to be "too matte" will receive a complimentary polishing referral at the resident\'s expense.',
    severity: "med",
    severityLabel: "Under Review",
  },
  {
    number: "§ 1.5",
    title: "Earth-Howling Hours",
    text: "Prolonged howling in the direction of Earth is permitted only on weekends and Association-approved holidays. This includes, but is not limited to: Full Perigee, Lunar New Year, and the annual Mons Memorial Day.",
    severity: "low",
    severityLabel: "Loosely Enforced",
  },
  {
    number: "§ 1.6",
    title: "Surface Graffiti Prohibition",
    text: 'The unauthorized inscription of phrases — including but not limited to "MONS RULE," "MARE GANG," or any territorial designations — on the visible lunar surface is a Class III HOA violation. We are currently investigating. We have suspects.',
    severity: "high",
    severityLabel: "Under Active Investigation",
  },
];

export interface Amenity {
  icon: string;
  name: string;
  desc: string;
  status: "open" | "disrupted" | "closed";
  statusLabel: string;
}

export const amenities: Amenity[] = [
  {
    icon: "🏊",
    name: "Zero-Gravity Swimming Pool",
    desc: "Olympic-standard facility. Currently adrift somewhere between Crater Tycho and the South Pole. Last known heading: 14°N. Please report any sightings.",
    status: "disrupted",
    statusLabel: "Location Unknown",
  },
  {
    icon: "🚶",
    name: "The Moonwalk Trail",
    desc: "A 12.4km scenic walking path with complimentary 80s music broadcast via helmet speaker. Surface is uneven. Bring your own oxygen.",
    status: "open",
    statusLabel: "Operational",
  },
  {
    icon: "☀️",
    name: "Solar Tanning Deck",
    desc: "Premium sun exposure facility. Results vary significantly by hemisphere and orbital position. SPF ∞ sunscreen dispensers available on the near side only.",
    status: "open",
    statusLabel: "Operational (Near Side)",
  },
  {
    icon: "🧹",
    name: "Crater Cleanup Station",
    desc: "Community-maintained equipment depot for the bi-weekly Crater Cleanup Initiative. Brooms are not provided. BYOB policy strictly observed.",
    status: "open",
    statusLabel: "Operational",
  },
  {
    icon: "🏛️",
    name: "HOA Meeting Hall",
    desc: "Climate-controlled (relatively) facility for official Association proceedings. Attendance is mandatory. Opinions are discouraged. Refreshments are tepid.",
    status: "open",
    statusLabel: "Open Saturdays",
  },
  {
    icon: "📡",
    name: "Earth Communication Array",
    desc: "High-latency communication terminal for contacting Earth-based relatives. Average round-trip message delay: 2.6 seconds. Emotional context arrives even later.",
    status: "closed",
    statusLabel: "Under Maintenance",
  },
];

export interface EventItem {
  day: string;
  dow: string;
  title: string;
  detail: string;
  type: string;
}

export const events: EventItem[] = [
  {
    day: "TUE",
    dow: "This Week",
    title: "Crater Cleanup Crew",
    detail: "All registered residents required to report with personal broom. No broom-sharing. This policy is final.",
    type: "Mandatory",
  },
  {
    day: "FRI",
    dow: "This Week",
    title: "Full Moon Party",
    detail: 'Attendance required for all residents, including those who describe themselves as "introverted" or "busy." No exceptions. Festivities begin at dusk (conceptually).',
    type: "Mandatory",
  },
  {
    day: "SAT",
    dow: "This Week",
    title: "Monthly HOA General Assembly",
    detail: 'Primary agenda: investigation into the "MONS RULE" surface graffiti incident. Secondary: Q3 dust containment report. Refreshments: tepid.',
    type: "Mandatory",
  },
  {
    day: "TBD",
    dow: "Next Month",
    title: "Annual Albedo Inspection",
    detail: "Reflectivity compliance review for all registered properties. Violations will be noted, catalogued, and discussed at length in a forthcoming letter.",
    type: "Compliance",
  },
];

export interface NoticeItem {
  stamp: string;
  title: string;
  paragraphs: string[];
}

export const notices: NoticeItem[] = [
  {
    stamp: "Unresolved",
    title: "Notice No. 2093-047: Surface Inscription Investigation",
    paragraphs: [
      'The Board is aware that the phrase "MONS RULE" has been inscribed on the lunar surface in letters exceeding 200 meters in height, visible from low Earth orbit. This constitutes a violation of §4.5.1 (unauthorized surface writing without a Lunar Surface Expression Permit, Form LRA-WRITE-1). This is the third confirmed occurrence and remains under active investigation.',
      "If you have information regarding this incident, you are encouraged to contact the Compliance Office. Anonymity is guaranteed. We will still absolutely figure out who it was.",
    ],
  },
  {
    stamp: "Action Required",
    title: "Notice No. 2093-051: Zero-Gravity Pool Recovery Initiative",
    paragraphs: [
      "Per §7.1.1, the community swimming pool is a sealed, pressurised facility that should be located at the eastern edge of Sector Alpha. It is not. Its Reserve Component (§6.5) has been found critically underfunded since the first Reserve Study, a status that has not materially improved since.",
      "Residents with sightings are asked to report them to the front office. This is, in fact, not the first time the pool has escaped.",
    ],
  },
];

export const stats = [
  { value: "384,400", label: "km from Earth HQ" },
  { value: "1,247", label: "Registered Properties" },
  { value: "847", label: "Active Violations" },
  { value: "∞", label: "Strongly Worded Letters Sent" },
];

// Home-relative (`/#...`) rather than bare hashes since these render on
// non-homepage routes too (e.g. /register) via the shared SiteNav.
//
// Split into primary (always visible, real destinations) and secondary
// (folded into the nav's "Menu" panel — lower-traffic pages plus same-page
// anchors into the homepage) to keep the primary bar short.
export const primaryNavLinks = [
  { href: "/register", label: "Register" },
  { href: "/registry", label: "Registry" },
  { href: "/density", label: "Density Map" },
  { href: "/covenants", label: "Covenants" },
  { href: "/dues", label: "Dues" },
  { href: "/board", label: "Board" },
];

export const secondaryNavLinks = [
  { href: "/arc", label: "Committees" },
  { href: "/minutes", label: "Minutes" },
  { href: "/annual-meeting", label: "Annual Meeting" },
  { href: "/legacy-structures", label: "Legacy Structures" },
  { href: "/fines", label: "Schedule of Fines" },
  { href: "/special-assessment", label: "Special Assessment" },
  { href: "/reserve-study", label: "Reserve Study" },
  { href: "/collections", label: "Collections Policy" },
  { href: "/records-request", label: "Records Request" },
  { href: "/#welcome", label: "Welcome" },
  { href: "/#regulations", label: "Regulations" },
  { href: "/#amenities", label: "Amenities" },
  { href: "/#calendar", label: "Calendar" },
  { href: "/#notices", label: "Notices" },
  { href: "/#contact", label: "Contact" },
  { href: "/#charter", label: "Charter" },
];
