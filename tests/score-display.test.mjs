import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatListScore,
  formatScore,
  scoreColor,
  scoreSegments,
  scoreTextColor,
  scoreTier,
} from "../src/lib/colors.ts";

test("scores round down: two decimals, one on the reports list", () => {
  assert.equal(formatScore(2.459), "2.45");
  assert.equal(formatScore(2.496), "2.49");
  assert.equal(formatScore(2.5), "2.50");
  assert.equal(formatScore(2.3), "2.30");
  assert.equal(formatListScore(2.48), "2.4");
  assert.equal(formatListScore(2.54), "2.5");
  assert.equal(formatListScore(2.3), "2.3");
  assert.equal(formatListScore(5), "5.0");
});

test("tier bands are lower-inclusive hard lines", () => {
  assert.equal(scoreTier(1.49), "Minimal Risk");
  assert.equal(scoreTier(1.5), "Low Risk");
  assert.equal(scoreTier(2.49), "Low Risk");
  assert.equal(scoreTier(2.5), "Medium Risk");
  assert.equal(scoreTier(3.49), "Medium Risk");
  assert.equal(scoreTier(3.5), "Elevated Risk");
  assert.equal(scoreTier(4.49), "Elevated Risk");
  assert.equal(scoreTier(4.5), "High Risk");
  assert.equal(scoreTextColor(3.49), "#0C0C0C");
  assert.equal(scoreTextColor(3.5), "#FFFFFF");
});

test("the floored list value always keeps the full score's tier and color", () => {
  for (let i = 100; i <= 500; i++) {
    const s = i / 100;
    const shown = Number(formatListScore(s));
    assert.equal(scoreTier(shown), scoreTier(s), `tier at ${s}`);
    assert.equal(scoreColor(shown), scoreColor(s), `color at ${s}`);
    assert.equal(scoreTier(Number(formatScore(s))), scoreTier(s), `2dp tier at ${s}`);
  }
});

test("bar segments follow the tier", () => {
  assert.equal(scoreSegments(1.0), 1);
  assert.equal(scoreSegments(2.49), 2);
  assert.equal(scoreSegments(2.5), 3);
  assert.equal(scoreSegments(2.86), 3);
  assert.equal(scoreSegments(3.9), 4);
  assert.equal(scoreSegments(5.0), 5);
});
