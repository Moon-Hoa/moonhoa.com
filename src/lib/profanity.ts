import { Filter } from "bad-words";

const filter = new Filter();

// Registration-form-specific additions: the plan's own copy jokes about
// "MONS RULE" surface graffiti — block the obvious griefing patterns a
// display name field would otherwise let through.
filter.addWords("mons rule", "mare gang");

export interface DisplayNameCheck {
  clean: boolean;
  reason?: string;
}

const MIN_LENGTH = 2;
const MAX_LENGTH = 40;

export function checkDisplayName(rawName: string): DisplayNameCheck {
  const name = rawName.trim();

  if (name.length < MIN_LENGTH) {
    return { clean: false, reason: `Name must be at least ${MIN_LENGTH} characters.` };
  }
  if (name.length > MAX_LENGTH) {
    return { clean: false, reason: `Name must be ${MAX_LENGTH} characters or fewer.` };
  }
  if (filter.isProfane(name)) {
    return { clean: false, reason: "Please try another name." };
  }

  return { clean: true };
}
