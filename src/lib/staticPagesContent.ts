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
    title: "Submit a Structural Approval Application (Form LRA-300-STR)",
    text: "Accompanying architectural drawings, a site plan, and a written explanation of necessity are required. Digital submissions are accepted but will still be printed, per Committee preference.",
  },
  {
    number: "Step 2",
    title: "Initial Review (4–6 Weeks)",
    text: "Standard turnaround per §12.1.2. During any active investigation under Part IV (Behavioural Standards), turnaround extends to 8–12 weeks. No construction may begin during this period.",
  },
  {
    number: "Step 3",
    title: "Biweekly Committee Hearing",
    text: "The Architectural Review Committee, chaired by the Deputy Director of Surface Standards, meets biweekly to hear applications.",
  },
  {
    number: "Step 4",
    title: "Determination",
    text: "The Committee issues Approved, Denied, or Approved Pending Further Review. Written denials must cite the specific Charter section at issue, per §12.1.2.",
  },
  {
    number: "Step 5",
    title: "Appeal",
    text: "Denials may be appealed to the Tribunal within 14 days, per §5.4. (The separate Aesthetic Review Committee below has no such appeal path at all.)",
  },
];

export interface Committee {
  name: string;
  chair: string;
  cadence: string;
}

// Per §12.9.1, consolidating the meeting frequency and chair for each
// committee and subcommittee established under Part XII.
export const committees: Committee[] = [
  { name: "Architectural Review Committee", chair: "Deputy Director of Surface Standards", cadence: "Biweekly" },
  { name: "Aesthetic Review Committee", chair: "At-Large Member", cadence: "Quarterly" },
  { name: "Legacy Equipment Preservation Subcommittee", chair: "Chief Albedo Officer (acting)", cadence: "Monthly" },
  { name: "Craterscaping Subcommittee", chair: "At-Large Member", cadence: "Monthly" },
  { name: "Social Events Committee", chair: "Director of Community Relations", cadence: "Monthly, more often before the Full Moon Party" },
  { name: "Audit & Finance Committee", chair: "Treasurer", cadence: "Monthly" },
  { name: "Nominating Committee", chair: "Chairperson (ex officio)", cadence: "Annually, ahead of elections" },
  { name: "Grievance & Ethics Committee", chair: "Deputy Director of Surface Standards", cadence: "As needed" },
];

export interface DuesItem {
  item: string;
  amount: string;
  note: string;
}

// Per §1.4, the OC/USD exchange rate is set quarterly and has been
// unfavourable "for as long as records have been kept." Appendix T's most
// recent annual snapshot: 1.31 OC per Earth-currency unit, up from 1.00 at
// incorporation in 2088.
export const duesSchedule: DuesItem[] = [
  { item: "Standard Annual Dues", amount: "200 OC (≈ $153)", note: "Per §6.1.1, payable the first day of each Earth calendar year." },
  { item: "Crater-Share Annual Dues", amount: "120 OC each (≈ $92)", note: "Per resident, for jointly-registered crater-share properties." },
  { item: "Premium Compliance Programme", amount: "180 OC (≈ $137)", note: "Includes a commemorative pin — the same one new residents receive automatically, a discrepancy the Board has elected not to address." },
  { item: "Late Payment Surcharge (30+ days)", amount: "15 OC", note: "Per §6.1.2. An additional 20 OC applies beyond 60 days." },
  { item: "Special Assessment", amount: "Varies", note: "Levied by resolution when a Reserve Component shortfall exceeds ordinary dues. See the current Special Assessment Notice." },
  { item: "Strongly Worded Letter", amount: "0 OC", note: "Complimentary. The Board absorbs the (considerable) typesetting cost as a gesture of goodwill." },
];

export interface BoardMember {
  name: string;
  title: string;
  bio: string;
}

// Per §5.1.2 — the current sitting Board.
export const boardMembers: BoardMember[] = [
  {
    name: "Adaeze Okafor",
    title: "Chairperson",
    bio: "Also serves on the Tribunal (§5.4) — by tradition, not requirement. Per §5.3.4, the Chairperson's hand counts for two when votes are taken by show of hands. This has not been challenged since incorporation.",
  },
  {
    name: "Tobias Renn",
    title: "Deputy Director of Surface Standards",
    bio: "Reviews and countersigns every Strongly Worded Letter (§6.4) before it's sent. Chairs the Architectural Review Committee and the Grievance & Ethics Committee.",
  },
  {
    name: "Position Currently Vacant",
    title: "Keeper of the Dust Drift Ledger",
    bio: 'Vacant since 2092. Applications are not currently being accepted (§5.1.4). The Board is "working through some things" and will announce next steps in due course. Unconfirmed sightings have been logged at Full Moon Parties.',
  },
  {
    name: "Youssef Haddad",
    title: "Director of Community Relations",
    bio: "Prepares the Full Moon Party seating chart (§7.3.2) — residents with pending dust drift complaints against each other are seated on opposite sides, non-negotiably. Chairs the Social Events Committee.",
  },
  {
    name: "Priya Anand",
    title: "Chief Albedo Officer",
    bio: "Oversees the annual Reflectivity Audit (§3.1). Acting Chair of the Legacy Equipment Preservation Subcommittee, pending resolution of a jurisdictional question the Board has not yet found time to resolve.",
  },
  {
    name: "Marcus Ilves",
    title: "Treasurer, Oxygen Credits Division",
    bio: 'Administers dues, fines, and special assessments (Part VI). Chairs the Audit & Finance Committee, which compiles the Association\'s internal citation rankings — purely, in its own words, "for the diversion."',
  },
  {
    name: "Ingrid Solheim",
    title: "At-Large Member",
    bio: "Elected biennially — the only Board seat regularly contested. Chairs both the Aesthetic Review Committee and the Craterscaping Subcommittee.",
  },
];

export const meetingMinutes: NoticeItem[] = [
  {
    stamp: "Approved",
    title: "General Assembly Minutes — Q2 2094",
    paragraphs: [
      "Treasurer Ilves presented the Q2 budget, noting the Oxygen Credit exchange rate has reached 1.31 per Appendix T — the least favourable rate on record, a distinction the Committee declined to celebrate.",
      "Director of Community Relations Haddad confirmed Full Moon Party seating chart procedures remain unchanged: residents with pending mutual dust drift complaints will continue to be seated on opposite sides of the venue, per §7.3.2.",
    ],
  },
  {
    stamp: "Approved",
    title: "General Assembly Minutes — Q1 2094",
    paragraphs: [
      'The Compliance Office provided an update on the ongoing "MONS RULE" surface graffiti investigation — now three confirmed occurrences. Anonymous tips remain actively encouraged per §14.2.1.',
      "Chief Albedo Officer Anand reported the annual Reflectivity Audit is on schedule. Board member properties remain exempt from imagery review pending equipment recalibration, a status unchanged since the position was first filled.",
    ],
  },
  {
    stamp: "Noted",
    title: "General Assembly Minutes — Q4 2093",
    paragraphs: [
      "The Legacy Equipment Preservation Subcommittee revisited its proposal to merge the vacant Keeper of the Dust Drift Ledger seat into Subcommittee membership. Tabled again for lack of a Keeper to consult regarding their own merger.",
      "Deputy Director Renn confirmed all Strongly Worded Letters issued this quarter were countersigned by the full sitting Board, including the vacant Keeper's seat, per §6.4.4 (\"[Position Vacant — Intent Endorsed.]\").",
    ],
  },
];

export const annualMeetingAgenda: Decree[] = [
  {
    number: "Item 1",
    title: "Call to Order & Quorum Certification",
    text: "Per §5.3.6, binding votes (budget ratification, Board elections) require attendance or proxy from at least 25% of registered lots. Meetings falling short proceed as informal gatherings — refreshments are served regardless.",
  },
  {
    number: "Item 2",
    title: "Reading of Previous Minutes",
    text: "See the Meeting Minutes page. The Board will read them aloud regardless of whether anyone has objections, corrections, or a pulse.",
  },
  {
    number: "Item 3",
    title: "Chairperson's Annual Report & Treasurer's Report",
    text: "Delivered verbally, from memory, without notes, as is tradition. Includes review of the current Reserve Study per §6.5. Written copies remain tabled indefinitely.",
  },
  {
    number: "Item 4",
    title: "Committee Reports",
    text: "Architectural Review, Aesthetic Review, Legacy Equipment Preservation, Craterscaping, Social Events, and Grievance & Ethics each report in turn.",
  },
  {
    number: "Item 5",
    title: "Board Elections",
    text: "For available seats per §5.1.3. The Chairperson's seat is not subject to election. Nominations from the floor are welcomed in spirit but not in practice.",
  },
  {
    number: "Item 6",
    title: "Old & New Business",
    text: 'Including any Resident Amendment Petitions received this cycle. The ongoing "MONS RULE" investigation is a standing old-business item until further notice.',
  },
  {
    number: "Item 7",
    title: "Open Floor for Resident Comments",
    text: "Limited to 30 seconds per resident. Enforcement mechanism unspecified this revision.",
  },
  {
    number: "Item 8",
    title: "Adjournment & Refreshments",
    text: "Per §5.3.6, refreshments are served regardless of whether quorum was met.",
  },
];

export interface BallotResolution {
  id: string;
  title: string;
  description: string;
}

export const ballotResolutions: BallotResolution[] = [
  {
    id: "2094-r-04",
    title: "Resolution 2094-R-04",
    description: "Should the Zero-Gravity Swimming Pool be renamed if and when it is recovered?",
  },
  {
    id: "2094-r-05",
    title: "Resolution 2094-R-05",
    description: "Should Howling hours (§4.1.3) be extended to include weekdays?",
  },
  {
    id: "2094-r-06",
    title: "Resolution 2094-R-06",
    description: "Should the Keeper of the Dust Drift Ledger seat be merged into the Legacy Equipment Preservation Subcommittee?",
  },
];

export interface FineScheduleItem {
  violation: string;
  section: string;
  fine: string;
}

// A representative selection from the full Appendix B — Master Schedule of
// Fines (45+ rows in the source Charter). Chosen for range across Parts
// III, IV, VI, IX, X, XI, XIII, and XV rather than exhaustive coverage.
export const fineSchedule: FineScheduleItem[] = [
  { violation: "Dust drift, Tier 1", section: "§ 3.2.2", fine: "20 OC" },
  { violation: "Dust drift, Tier 2", section: "§ 3.2.2", fine: "60 OC" },
  { violation: "Dust drift, Tier 3 (Dust Event)", section: "§ 3.2.2", fine: "200 OC" },
  { violation: "Albedo non-compliance, per cycle", section: "§ 3.1.3", fine: "40 OC" },
  { violation: "Unauthorised late landing", section: "§ 4.2.2", fine: "40 OC" },
  { violation: "Unlicensed structure", section: "§ 3.3.1", fine: "80 OC" },
  { violation: "Howling outside permitted hours", section: "§ 4.1.4", fine: "25 OC (35 OC during Board meetings)" },
  { violation: "Unapproved lawn ornament", section: "§ 3.4.2", fine: "30 OC" },
  { violation: "Unauthorised surface writing", section: "§ 4.5.1", fine: "75 OC — but 50 OC per § 6.2. See note below." },
  { violation: "Impersonating a Board member", section: "§ 4.5.1", fine: "250 OC" },
  { violation: "Attempted secession", section: "§ 4.5.1", fine: "500 OC" },
  { violation: "New monolith installation", section: "§ 3.4.2", fine: "1,000 OC" },
  { violation: "Filing a knowingly false complaint", section: "§ 14.2.2", fine: "150 OC" },
  { violation: "Crater modification without approval", section: "§ 3.5.1", fine: "150 OC plus remediation" },
  { violation: "Filling in a crater entirely", section: "§ 3.5.3", fine: "1,000 OC plus full restoration, where possible" },
  { violation: "Interfering with a Legacy Structure", section: "§ 4.5.1 / Part IX", fine: "1,000 OC, minimum" },
  { violation: "Disturbing a memorial site", section: "§ 9.3.4", fine: "2,000 OC, minimum, and immediate Tribunal referral" },
  { violation: "Removal or possession of a Register item", section: "§ 9.10.1", fine: "2,000 OC, minimum, and Tribunal referral" },
  { violation: "Failure to maintain solar flare shelter access", section: "§ 10.4.1", fine: "100 OC" },
  { violation: "Lapsed individual insurance coverage", section: "§ 13.1.2", fine: "50 OC per audit cycle" },
  { violation: "Contractor operating without proof of liability coverage", section: "§ 13.3.2", fine: "200 OC, contractor barred pending compliance" },
  { violation: "Submission of knowingly false compliance data to the Registry", section: "§ 15.2.1", fine: "200 OC" },
  { violation: "Heritage filming without permit", section: "§ 9.9.1", fine: "500 OC" },
  { violation: "Forum content doxxing a Board member's Earth-based information", section: "§ 15.7.3", fine: "Immediate removal; 300 OC if traced to a specific resident" },
];

export interface TribunalCase {
  caseNo: string;
  name: string;
  summary: string;
}

// Per Appendix U, the four most-requested general (non-Howling) Tribunal
// precedents.
export const tribunalCases: TribunalCase[] = [
  {
    caseNo: "T-2090-008",
    name: "Resident v. The Board (\"the Retroactive Structure Case\")",
    summary: "A temporary greenhouse stood 34 days — four beyond the §3.3.2 threshold — due to a documented equipment delay. The Tribunal upheld the retroactive approval fee, but the Board later adopted a standing practice of waiving the fee (not the filing requirement) where delay is documented in advance.",
  },
  {
    caseNo: "T-2091-002",
    name: "Resident v. Resident (\"the Crater-Share Liability Case\")",
    summary: "Following a Tier 2 dust drift event on a jointly-held crater-share property, one co-resident argued they bore no liability, having been off-property at the time. The Tribunal upheld joint-and-several liability per §2.4.4 regardless — presence is not the test.",
  },
  {
    caseNo: "T-2093-011",
    name: "Resident v. The Board (\"the Emergency Landing Paperwork Case\")",
    summary: "A resident who made a documented emergency landing filed the required incident report on day 51 rather than within 48 hours. The Tribunal upheld the fine — the emergency had concluded well within the reporting window, and \"I was still shaking\" was sympathetic but not a Charter exception.",
  },
  {
    caseNo: "T-2094-005",
    name: "Resident v. The Board (\"the Directory Opt-Out Case\")",
    summary: "A resident argued that opting out of the Resident Directory (§2.6.2) should also exempt them from the Good Neighbour introduction at §14.3. The Tribunal held the two provisions unrelated, noting §14.3 carries no enforcement mechanism in any case.",
  },
];

export interface ReserveComponent {
  name: string;
  fundedPct: string;
  status: string;
}

// Per the current Reserve Study Summary (Appendix M, Specimen 5).
export const reserveComponents: ReserveComponent[] = [
  { name: "Moonwalk Trail", fundedPct: "68%", status: "Adequate. No action recommended." },
  { name: "Community Hall", fundedPct: "74%", status: "Adequate." },
  { name: "Zero-Gravity Swimming Pool", fundedPct: "11%", status: "Critical shortfall. See current Special Assessment Notice." },
  { name: "Solar Tanning Deck", fundedPct: "91%", status: "Reflects low utilisation-driven wear, per the Committee, \"rather than particularly effective saving.\"" },
];

export interface LegacyStructure {
  site: string;
  coordinates: string;
  origin: string;
  contents: string;
  bufferZone: string;
  status: string;
}

// Per Appendix C — Register of Pre-Existing Historic Surface Structures.
// Coordinates are planetocentric degrees, rounded, as published.
export const legacyStructures: LegacyStructure[] = [
  {
    site: "Tranquility Base",
    coordinates: "0.67°N, 23.47°E",
    origin: "United States — first crewed landing, late 20th c.",
    contents: "Descent stage, flag, seismometer, laser-ranging retroreflector, tools, and an estimated 100+ smaller discarded items",
    bufferZone: "500 m",
    status: "Registered — Grandfathered",
  },
  {
    site: "Ocean of Storms site",
    coordinates: "3.01°S, 23.42°W",
    origin: "United States, late 20th c.",
    contents: "Descent stage, instrument package; a nearby robotic probe visited and partially sampled by the crew",
    bufferZone: "300 m",
    status: "Registered — Grandfathered",
  },
  {
    site: "Fra Mauro highlands site",
    coordinates: "3.65°S, 17.47°W",
    origin: "United States, early 1970s",
    contents: "Descent stage, instrument package, and two recreational sporting items left during an unscheduled demonstration",
    bufferZone: "300 m",
    status: "Registered — Grandfathered",
  },
  {
    site: "Hadley Rille site",
    coordinates: "26.13°N, 3.63°E",
    origin: "United States, early 1970s",
    contents: "Descent stage, first lunar roving vehicle, a small memorial sculpture and plaque, and apparatus from a public physics demonstration",
    bufferZone: "300 m; memorial under § 9.3.4",
    status: "Registered — Grandfathered",
  },
  {
    site: "Descartes Highlands site",
    coordinates: "8.97°S, 15.50°E",
    origin: "United States, early 1970s",
    contents: "Descent stage, second lunar roving vehicle, and a personal family photograph left by a crew member",
    bufferZone: "300 m",
    status: "Registered — Grandfathered",
  },
  {
    site: "Taurus-Littrow site",
    coordinates: "20.19°N, 30.77°E",
    origin: "United States, early 1970s",
    contents: "Descent stage, third lunar roving vehicle, commemorative plaque, and surface inscriptions left by the final crew to walk on the surface",
    bufferZone: "300 m",
    status: "Registered — Grandfathered",
  },
  {
    site: "Multiple sites, near side",
    coordinates: "Various",
    origin: "Soviet Union / Russian Federation, mid-late 20th c.",
    contents: "Robotic landers and two teleoperated rovers; two retroreflectors still used in active laser-ranging work",
    bufferZone: "200 m each",
    status: "Registered — Grandfathered",
  },
  {
    site: "Multiple sites, incl. one far-side",
    coordinates: "Various",
    origin: "China (CNSA), 21st c.",
    contents: "Robotic landers and rovers, including the first successful far-side soft landing and two robotic sample-return missions",
    bufferZone: "200 m each, incl. the far-side site (grandfathered per § 1.2.2 despite falling within enforcement range)",
    status: "Registered — Grandfathered",
  },
  {
    site: "South polar region site",
    coordinates: "Southern, exact coordinates restricted",
    origin: "India (ISRO), 21st c.",
    contents: "Robotic lander and rover, first successful soft landing in the lunar south polar region",
    bufferZone: "200 m",
    status: "Registered — Grandfathered",
  },
  {
    site: "Odysseus landing site (Malapert A vicinity)",
    coordinates: "80.13°S, 1.44°E",
    origin: "Intuitive Machines (IM-1), United States, 21st c. — first US commercial lunar landing, first US lunar landing since 1972",
    contents: "Robotic lander, came to rest on its side after a harder-than-planned descent — a textbook § 9.6.3 case, broken out of the generic commercial-sites grouping below now that it's a specific, citable mission",
    bufferZone: "150 m",
    status: "Registered — Grandfathered; Non-Conforming, § 9.6.3",
  },
  {
    site: "Multiple commercial sites",
    coordinates: "Various",
    origin: "Private aerospace companies, multiple nations, 21st c.",
    contents: "A growing set of robotic landers, several resting at an angle the Board considers structurally undignified",
    bufferZone: "150 m each; see § 9.6.3",
    status: "Registered — Grandfathered; several Non-Conforming",
  },
  {
    site: "Scattered impact & debris sites",
    coordinates: "Various, uncatalogued below 50kg",
    origin: "Multiple, mid-20th c. onward",
    contents: "Discarded rocket stages and uncontrolled impact debris",
    bufferZone: "Not individually buffered; see § 10.5.2",
    status: "Partially Registered",
  },
];

export interface CorrespondenceEntry {
  date: string;
  recipient: string;
  subject: string;
  response: string;
}

// Per Appendix H — Board Correspondence Log with Pre-Association Entities.
// Extended per the Phase 9.7 Real-World Mission Tie-In Playbook whenever a
// real mission event happens — see MISSION_TIEIN_PLAYBOOK.md.
export const correspondenceLog: CorrespondenceEntry[] = [
  {
    date: "2024-02-23",
    recipient: "Operator, IM-1 Odysseus lander",
    subject: "Welcome and Grandfathered-registration notice, Malapert A vicinity site",
    response: "None received",
  },
  {
    date: "2024-02-23",
    recipient: "Operator, IM-1 Odysseus lander",
    subject: "Reflectivity Audit scheduling request",
    response: "None received",
  },
];

export interface CollectionsStage {
  stage: string;
  day: string;
  action: string;
}

// Per §6.7.1's collections process table.
export const collectionsStages: CollectionsStage[] = [
  { stage: "1", day: "1–45", action: "Payment due. Payment plans available on written request." },
  { stage: "2", day: "46", action: "Account declared delinquent. Late fee (35 OC) plus 1.5% monthly interest applied." },
  { stage: "3", day: "60", action: "Formal demand letter sent via certified transmission (approx. 2.6 second one-way delay, per standard communications terms)." },
  { stage: "4", day: "90", action: "Account referred to the Association's collections counsel. Counsel's fees and costs of collection are added to the balance owed." },
  { stage: "5", day: "120", action: "Lien recorded against the property with the Lunar Registry Office." },
];

export interface RecordsFaq {
  question: string;
  response: string;
}

// Per Appendix P — Frequently Submitted Records Requests.
export const recordsFaq: RecordsFaq[] = [
  { question: "Where is the pool?", response: "See the most recent Special Assessment Notice. The Board will update residents if and when the pool is located." },
  { question: "Why is my albedo assessment different from my neighbour's?", response: "Albedo is assessed per-property based on actual surface conditions. Differences are expected and are not, on their own, evidence of unequal enforcement." },
  { question: "Can I speak to the Keeper of the Dust Drift Ledger?", response: "The position is currently vacant. See §5.1.4." },
  { question: "Why does my correspondence go to spam?", response: "This is a known and, per §2.1.2, acknowledged condition. It is not a malfunction." },
  { question: "Can I get a copy of Volumes II through XII?", response: "Yes, via Form LRA-905. Estimated response time is longer than for Volume I alone." },
  { question: 'Is the Board aware that "MONS RULE" has appeared again?', response: "Yes. The investigation remains open. See Appendix D." },
  { question: "Why wasn't my agenda item included in the Board meeting?", response: "The Board reviews all submitted items and is under no obligation to include them. See §5.3.3." },
  { question: "Has NASA (or any other agency) ever responded to Association correspondence?", response: "Not to date. See Appendix H." },
  { question: "Can I remove an old lander from near my property?", response: "No. See §9.10.1 and the associated fine schedule at Appendix B." },
];

export interface GazetteItem {
  headline: string;
  body: string;
}

export interface GazetteIssue {
  issue: string;
  date: string;
  items: GazetteItem[];
}

// The recurring HOA Gazette. Each issue is a curated mix of real Charter
// facts reframed as in-character Board announcements. Future issues,
// including real-world mission tie-ins (Phase 9.7), get appended here.
export const gazetteIssues: GazetteIssue[] = [
  {
    issue: "Issue 1",
    date: "Q3 2094",
    items: [
      {
        headline: "Reserve Study Certified — Pool Remains Elusive",
        body: 'The biennial Reserve Study is in: the Moonwalk Trail and Community Hall are adequately funded, the Solar Tanning Deck is overfunded (low usage, the Committee notes, "rather than particularly effective saving"), and the Zero-Gravity Swimming Pool remains at a critical 11%. A Special Assessment of 85 OC has been levied accordingly. See the full Reserve Study Summary.',
      },
      {
        headline: '"MONS RULE" Investigation Enters Its Fifth Year',
        body: "Three confirmed sightings, zero arrests, one Compliance Office that remains, in its own words, cautiously optimistic. Anonymous tips continue to be actively encouraged — this remains the sole exception to the Charter's no-anonymous-complaints rule.",
      },
      {
        headline: "New This Revision: The Legacy Overlook",
        body: "Residents and visitors may now observe Tranquility Base from a respectful 500-metre distance. Telephoto imaging equipment is permitted; landing is not. See the Legacy Structures Register for the full catalogue of protected sites.",
      },
      {
        headline: "Dear Board: Advice from the Compliance Office",
        body: '"My neighbour\'s dust keeps drifting onto my property, but I don\'t want to escalate things." — A Concerned Resident. The Board\'s position: file Form LRA-COMPLAINT-1. Escalation is the process. There is no non-escalating tier.',
      },
    ],
  },
  {
    issue: "Issue 2",
    date: "Q4 2094",
    items: [
      {
        headline: "Register Welcomes a New Entry: The Malapert A Vicinity Site",
        body: "Formerly filed under the generic \"multiple commercial sites\" grouping, this site now has its own Register entry — a first US commercial lunar landing, and, per the Association's own less charitable internal assessment, a textbook § 9.6.3 case. The Board has sent the operator a Welcome and Grandfathered-registration notice. As with every prior Pre-Association correspondence, none has been received in return.",
      },
      {
        headline: "A Reminder on the Correspondence Log",
        body: 'The Board wishes to remind residents that a non-response from a Pre-Association Entity is not, in itself, cause for concern. It is, per § 9.5.2, treated as constructive delivery — a legal theory the Board acknowledges "has not been tested outside its own meeting minutes."',
      },
    ],
  },
];
