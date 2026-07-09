import type { Decree, NoticeItem } from "./content";

export const propertyStandards: Decree[] = [
  {
    number: "§ 3.1",
    title: "Albedo Compliance",
    text: 'All properties must maintain a minimum surface reflectivity (albedo) of 12% at all times. Below 8% albedo, a property is considered a "Blight on the Collective Dignity of the Lunar Surface" (Form LRA-BLIGHT-1) and subject to mandatory remediation. Non-compliance runs 40 OC per audit cycle.',
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 3.2",
    title: "Dust Containment & Drift Liability",
    text: 'The single most litigated violation in Association history. Drift beyond 0.3m of your boundary is Tier 1 (20 OC); beyond 1m, Tier 2 (60 OC); beyond 3m, a "Dust Event" (200 OC plus mandatory remediation) — what residents informally call "a very bad afternoon."',
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 3.3",
    title: "Structural Regulations",
    text: "Permanent structures require advance Board approval via the Structural Approval Process (Form LRA-300-STR). \"Temporary\" structures standing more than 30 days lose that status and become subject to full retroactive approval — 80 OC plus the standard fee.",
    severity: "med",
    severityLabel: "Moderately Enforced",
  },
  {
    number: "§ 3.4",
    title: "Lawn Ornaments & Exterior Decoration",
    text: 'No free-standing ornament may exceed 36 inches without ARC approval (30 OC). One inflatable ornament per property — the Board has not forgotten the 2090 Full Moon Party. New monolith applications will not be considered, full stop (1,000 OC if you try anyway).',
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 3.5",
    title: "Crater Modification & Landscaping",
    text: 'Craters are assets to be stewarded, not filled in. Minor modifications (under 5% of crater volume) cost 20 OC and a simplified review; major modifications cost 150 OC, full Board review, and a 14-day comment period. Filling a crater entirely is prohibited outright — 1,000 OC plus full restoration, where possible.',
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 3.6",
    title: "Boundary Markers & Fencing",
    text: "Boundaries must be marked with LRA-approved regolith berms, reflective posts, or a boundary transponder, max 45cm in height. Tampering with a neighbour's marker is prohibited regardless of whether you believe it's misplaced — take it to mediation instead.",
    severity: "med",
    severityLabel: "Moderately Enforced",
  },
  {
    number: "§ 3.7",
    title: "Signage Standards",
    text: "One for-sale or for-transfer sign (max 60×90cm) is permitted per property without ARC approval. Political signage and criticism of the Board are not restricted by content — a rare carve-out the Board notes it has fielded exactly one sign under, which was later removed for unrelated dust drift reasons.",
    severity: "low",
    severityLabel: "Loosely Enforced",
  },
  {
    number: "§ 3.8",
    title: "Approved Exterior Paint & Material Palette",
    text: "Exterior finishes must be selected from six approved options: Regolith Grey, Reflective White, Tranquility Beige, Highland Tan, Crisium Slate, and Heritage Bronze (reserved for structures near a Legacy Structure Buffer Zone). Four Palette Exceptions have been granted since incorporation — a rate the Committee calls \"generous.\"",
    severity: "med",
    severityLabel: "Moderately Enforced",
  },
  {
    number: "§ 3.9",
    title: "Reflectivity Assistance Programme",
    text: 'Residents facing hardship achieving albedo compliance may apply for a grant covering up to 50% of remediation costs — funded by a Reserve Component the most recent Reserve Study found not fully funded. The Board concedes this is "not, in the ordinary sense, much of a program."',
    severity: "low",
    severityLabel: "Under Review",
  },
];

export const behaviouralStandards: Decree[] = [
  {
    number: "§ 4.1",
    title: "Noise Ordinance & Howling Regulations",
    text: 'Howling (sustained vocalisation directed at Earth, the void, or the celestial sphere generally) is permitted Saturdays 20:00–23:59 UTC, Sundays 20:00–22:00 UTC, and during the 11 Approved Lunar Holidays. Outside those hours: 25 OC (35 OC during Board meetings). Enforcement is complaint-driven only — the Compliance Office does not monitor proactively.',
    severity: "med",
    severityLabel: "Complaint-Driven",
  },
  {
    number: "§ 4.2",
    title: "Rocket Landing Protocols",
    text: 'Landings must complete by 21:00 UTC or defer to 06:00 UTC — there is no curfew exception for "good reasons." A Pre-Arrival Notification (Form LRA-ARRIVE-1) is required at least 24 hours ahead. Unauthorised late landings run 40 OC.',
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 4.3",
    title: "Circadian Compliance",
    text: 'The lunar day runs approximately 708.7 Earth hours. The Board acknowledges this and does not consider it a relevant scheduling factor: all residents operate on Earth-synchronised UTC for fines, meetings, and curfews. Requests to adopt "Lunar Standard Time" are declined via Form LRA-DECLINE-001.',
    severity: "low",
    severityLabel: "Non-Negotiable",
  },
  {
    number: "§ 4.4",
    title: "Relations with Non-Association Jurisdictions",
    text: 'The Association does not govern activity on Mars, in Earth orbit, or on any other celestial body — it "does, however, maintain opinions." Residents dealing with non-lunar entities do so as private individuals and remain fully bound by the Charter regardless.',
    severity: "low",
    severityLabel: "Advisory",
  },
  {
    number: "§ 4.5",
    title: "Prohibited Conduct",
    text: 'Boundary marker tampering, false dust drift complaints, and attempted secession (three residents have tried; all three remain within HOA jurisdiction) are all prohibited outright. Unauthorised surface writing — including the still-unsolved "MONS RULE," now three occurrences — requires a Lunar Surface Expression Permit and runs 50 OC per §6.2, or 75 OC per the Appendix B master schedule. The Board has reviewed this discrepancy and calls it "either a clerical error or a test." It has not decided which.',
    severity: "high",
    severityLabel: "Under Active Investigation",
  },
  {
    number: "§ 4.6",
    title: "Vehicle & Rover Parking Standards",
    text: 'No more than two registered surface vehicles may be parked visibly on a property without a Secondary Vehicle Variance. An inoperative or unregistered vehicle left more than 30 days is subject to the Junk Vehicle Ordinance — applied to residents "on the same terms" as Pre-Association Entities, though with considerably better luck securing compliance.',
    severity: "med",
    severityLabel: "Moderately Enforced",
  },
  {
    number: "§ 4.7",
    title: "Pets, Companion Organisms & Registered Life Forms",
    text: "Up to two companion organisms per household are permitted without a variance, and must be registered within 30 days of arrival. Non-terrestrial organisms of unconfirmed origin require prior Board clearance — none has ever been requested.",
    severity: "low",
    severityLabel: "Loosely Enforced",
  },
  {
    number: "§ 4.8",
    title: "Emergency Powers",
    text: "During a declared Dust Event, solar flare warning, moonquake, or other good-faith emergency, the Board may suspend curfews, noise restrictions, and mandatory event attendance for the emergency's duration plus 48 hours. Four emergency declarations have been issued since incorporation, three of which concerned actual emergencies.",
    severity: "low",
    severityLabel: "As Needed",
  },
];

export const arcSteps: Decree[] = [
  {
    number: "Step 1",
    title: "Submit Form 12-B",
    text: "Application for Non-Reflective Surface Treatment (or the appropriate construction-class equivalent) must be submitted in triplicate. Digital submissions are accepted but will still be printed, because the Committee prefers paper.",
  },
  {
    number: "Step 2",
    title: "Initial Review (6–8 Lunar Cycles)",
    text: "A subcommittee confirms your application is complete, then schedules a second meeting to confirm that confirmation. No construction may begin during this period, including construction of the mailbox where you'll receive the rejection.",
  },
  {
    number: "Step 3",
    title: "Quarterly Committee Hearing",
    text: "The full Architectural Review Committee meets quarterly to hear applications. Attendance is optional for applicants but strongly recommended, since decisions made in your absence cannot be appealed on the grounds of your absence.",
  },
  {
    number: "Step 4",
    title: "Determination",
    text: "The Committee issues one of three outcomes: Approved, Denied, or Approved Pending Further Review (functionally identical to Denied, but with more paperwork).",
  },
  {
    number: "Step 5",
    title: "Appeal",
    text: "Appeals may be filed within 14 days and are reviewed by the same Committee that issued the original determination, which the Board maintains is \"a completely different process.\"",
  },
];

export interface DuesItem {
  item: string;
  amount: string;
  note: string;
}

export const duesSchedule: DuesItem[] = [
  { item: "Base Monthly Assessment", amount: "₸ 480 / mo", note: "Covers general Association overhead and the annual seal-polishing ceremony." },
  { item: "Crater Maintenance Fund", amount: "₸ 60 / mo", note: "Funds the Crater Cleanup Initiative. Brooms not included; see §2.0." },
  { item: "Dust Abatement Levy", amount: "₸ 35 / mo", note: "Mandatory regardless of whether your dust has ever left your property boundary." },
  { item: "Pool Recovery Special Assessment", amount: "₸ 120 (one-time)", note: "Ongoing effort to retrieve the community pool. See Notice No. 2069-051." },
  { item: "Late Payment Fee", amount: "₸ 25 + 4%/mo", note: "Compounds monthly. The Board considers this \"a gentle reminder.\"" },
  { item: "Strongly Worded Letter Surcharge", amount: "₸ 0", note: "Complimentary. The Board absorbs this cost as a gesture of goodwill." },
];

export interface BoardMember {
  name: string;
  title: string;
  bio: string;
}

export const boardMembers: BoardMember[] = [
  {
    name: "Marguerite Okonkwo-Reyes",
    title: "President",
    bio: "Elected unopposed in 2069 and every term since. Believes the Moon's lack of a 24-hour day-night cycle is \"a personal choice the Moon has made and should reconsider.\"",
  },
  {
    name: "Desmond Vance III",
    title: "Treasurer",
    bio: "Keeps the books in a format only he understands. Has never once produced a budget on request, but insists dues are \"extremely reasonable, actually.\"",
  },
  {
    name: "Priya Anand-Nakamura",
    title: "Compliance Officer",
    bio: "Author of Notice No. 2069-047. Has a working theory about the \"MONS RULE\" incident that she will not share until the investigation concludes, which it will not.",
  },
  {
    name: "Buck Ferris",
    title: "Sergeant-at-Arms",
    bio: "Enforces meeting order via a gavel he insists is \"regulation lunar-weight.\" Has never been asked to actually remove anyone, but remains vigilant.",
  },
  {
    name: "Odalys Whitfield",
    title: "Architectural Review Chair",
    bio: "Reviews all Form 12-B submissions personally. Has approved four applications since 2069. Is very proud of this.",
  },
  {
    name: "Reginald Aldric-Voss",
    title: "Secretary",
    bio: "Maintains the official meeting minutes, when a notepad is available. Disputes the Board's characterization of the Q4 2088 gavel incident as \"resolved.\"",
  },
];

export const meetingMinutes: NoticeItem[] = [
  {
    stamp: "Approved",
    title: "General Assembly Minutes — Q2 2089",
    paragraphs: [
      "Motion to formally rename the \"Full Moon Party\" to the \"Full Moon Mandatory Community Gathering\" passed 4–1, with President Okonkwo-Reyes abstaining on the grounds that she \"didn't love the branding either way.\"",
      "Treasurer Vance presented the Q2 budget verbally, from memory, without notes. Motion to request a written copy was tabled indefinitely.",
    ],
  },
  {
    stamp: "Approved",
    title: "General Assembly Minutes — Q1 2089",
    paragraphs: [
      "Compliance Officer Anand-Nakamura provided a 40-minute update on the \"MONS RULE\" surface graffiti investigation, concluding with \"we're close, we're very close.\"",
      "Motion to approve a fourth Form 12-B application (satellite dish, 1.8m, non-reflective) passed unanimously. ARC Chair Whitfield described it as \"a good day.\"",
    ],
  },
  {
    stamp: "Contested",
    title: "General Assembly Minutes — Q4 2088",
    paragraphs: [
      "Extended debate over whether the Zero-Gravity Swimming Pool's continued drift constitutes an \"amenity\" or a \"missing person report.\" No resolution reached; item carried forward to Q1 2089.",
      "Sergeant-at-Arms Ferris's gavel was confiscated mid-meeting after an unrelated procedural dispute, then returned once the dispute was found to be about the gavel itself.",
    ],
  },
];

export const annualMeetingAgenda: Decree[] = [
  {
    number: "Item 1",
    title: "Call to Order",
    text: "Quorum is determined by whoever showed up. Historically, this has never been fewer than three people and one very committed houseplant.",
  },
  {
    number: "Item 2",
    title: "Reading of Previous Minutes",
    text: "See the Meeting Minutes page. The Board will read them aloud regardless of whether anyone has objections, corrections, or a pulse.",
  },
  {
    number: "Item 3",
    title: "Treasurer's Report",
    text: "Delivered verbally, from memory, without notes, as is tradition. Written copies remain tabled indefinitely.",
  },
  {
    number: "Item 4",
    title: "Old Business: MONS RULE Investigation",
    text: 'Compliance Officer Anand-Nakamura will provide an update. The Board anticipates this update will conclude with "we\'re close, we\'re very close."',
  },
  {
    number: "Item 5",
    title: "New Business: Pool Recovery Budget Amendment",
    text: "Proposed reallocation of funds toward the ongoing Zero-Gravity Swimming Pool retrieval effort. See Notice No. 2069-051 for background.",
  },
  {
    number: "Item 6",
    title: "Board Elections",
    text: "Uncontested, as always. Nominations from the floor are welcomed in spirit but not in practice.",
  },
  {
    number: "Item 7",
    title: "Open Floor for Resident Comments",
    text: "Limited to 30 seconds per resident, strictly enforced by the Sergeant-at-Arms and his gavel, assuming it has not been confiscated.",
  },
  {
    number: "Item 8",
    title: "Adjournment",
    text: "The meeting will be adjourned at the Board's discretion, regardless of whether Item 7 has concluded.",
  },
];

export interface BallotResolution {
  id: string;
  title: string;
  description: string;
}

export const ballotResolutions: BallotResolution[] = [
  {
    id: "2089-r-01",
    title: "Resolution 2089-R-01",
    description: "Should the community pool be renamed if and when it is recovered?",
  },
  {
    id: "2089-r-02",
    title: "Resolution 2089-R-02",
    description: "Should Earth-howling hours (§1.5) be extended to include weekdays?",
  },
  {
    id: "2089-r-03",
    title: "Resolution 2089-R-03",
    description: "Should the Sergeant-at-Arms's gavel be replaced with a non-confiscatable model?",
  },
];
