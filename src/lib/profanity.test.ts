import { test } from "node:test";
import assert from "node:assert/strict";
import { checkDisplayName } from "./profanity";

test("accepts a normal name", () => {
  assert.equal(checkDisplayName("Tycho Homesteader").clean, true);
});

test("rejects a name that's too short", () => {
  const result = checkDisplayName("A");
  assert.equal(result.clean, false);
});

test("rejects a name that's too long", () => {
  const result = checkDisplayName("A".repeat(41));
  assert.equal(result.clean, false);
});

test("rejects profane names", () => {
  const result = checkDisplayName("ash0le");
  assert.equal(result.clean, false);
});

test("rejects site-specific griefing patterns", () => {
  const result = checkDisplayName("MONS RULE");
  assert.equal(result.clean, false);
});

test("trims whitespace before checking length", () => {
  assert.equal(checkDisplayName("  Ty  ").clean, true);
});
