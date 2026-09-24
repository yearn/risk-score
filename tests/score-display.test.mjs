import assert from "node:assert/strict";
import { test } from "node:test";
import {
  displayScore,
  formatScore,
  scoreColor,
  scoreSegments,
  scoreTier,
} from "../src/lib/colors.ts";

test("floors to one decimal", () => {
  assert.equal(displayScore(2.48), 2.4);
  assert.equal(displayScore(2.54), 2.5);
  assert.equal(displayScore(2.46), 2.4);
  assert.equal(displayScore(2.3), 2.3);
  assert.equal(displayScore(5), 5);
  assert.equal(formatScore(3.45), "3.4");
  assert.equal(formatScore(2.1), "2.1");
});

test("color and tier follow the displayed tenth", () => {
  assert.equal(scoreTier(2.54), "Low Risk");
  assert.equal(scoreTier(2.6), "Medium Risk");
  assert.equal(scoreColor(2.46), scoreColor(2.4));
  assert.notEqual(scoreColor(2.46), scoreColor(2.6));
  assert.equal(scoreTier(3.59), "Medium Risk");
  assert.equal(scoreTier(3.6), "Elevated Risk");
  assert.equal(scoreTier(1.59), "Minimal Risk");
  assert.equal(scoreTier(4.6), "High Risk");
});

test("list bars use the integer part of the displayed score", () => {
  assert.equal(scoreSegments(2.49), 2);
  assert.equal(scoreSegments(2.6), 2);
  assert.equal(scoreSegments(3.0), 3);
  assert.equal(scoreSegments(5.0), 5);
});
