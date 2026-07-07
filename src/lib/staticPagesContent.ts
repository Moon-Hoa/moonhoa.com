import type { Decree, NoticeItem } from "./content";

export const covenants: Decree[] = [
  {
    number: "§ 8.1",
    title: "No Flags Without HOA Approval",
    text: "No resident, nation-state, or private space consortium may plant a flag, banner, or territorial marker of any kind without prior written approval from the Architectural Review Committee. Retroactive approval is not available. This includes flags planted \"ironically.\"",
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 8.2",
    title: "No Mining Without Permit",
    text: "Extraction of regolith, helium-3, or any subsurface material requires Permit Form 14-M, a $450 (moon dollar) filing fee, and a 90-day comment period. Recreational digging (\"just to see what's down there\") is not exempt.",
    severity: "high",
    severityLabel: "Strictly Enforced",
  },
  {
    number: "§ 8.3",
    title: "Satellite Dish Size Restriction",
    text: "Communication arrays visible from the property line may not exceed 2 meters in diameter, regardless of signal necessity. Residents citing \"the curvature of the Moon requires a bigger dish\" will be redirected to Section 8.3, which they are currently reading.",
    severity: "med",
    severityLabel: "Moderately Enforced",
  },
  {
    number: "§ 8.4",
    title: "Crater Modification Prohibition",
    text: "Existing craters may not be filled, deepened, renamed, or landscaped without ARC review. This includes crater modifications performed by natural meteorite impact after the fact, which the Board considers \"foreseeable.\"",
    severity: "med",
    severityLabel: "Under Review",
  },
  {
    number: "§ 8.5",
    title: "Bootprint Accumulation Limit",
    text: "No more than 40 square meters of visible bootprint trail may accumulate outside a registered walkway per lunar month. Excess prints will be billed at the prevailing Crater Cleanup Initiative labor rate.",
    severity: "low",
    severityLabel: "Loosely Enforced",
  },
  {
    number: "§ 8.6",
    title: "Second Homestead Restriction",
    text: "Members may not establish an unauthorized second dwelling on an adjacent unclaimed lot, even temporarily, even \"just for the view.\" See §1.3 for lawn ornament rules governing any structure erected in violation of this section.",
    severity: "high",
    severityLabel: "Strictly Enforced",
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
