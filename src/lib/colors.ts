/**
 * Scores are shown to one decimal, always rounded down.
 * 2.48 → 2.4, 2.54 → 2.5. Color, tier, and the list bars use that
 * same displayed value, so a badge and its color cannot disagree.
 *
 * The epsilon keeps values that are already on a tenth (2.3 is
 * 2.2999… in IEEE) from dropping an extra tenth.
 */
export function displayScore(score: number): number {
  return Math.floor(score * 10 + 1e-8) / 10;
}

export function formatScore(score: number): string {
  return displayScore(score).toFixed(1);
}

/** How many of the five list-bar segments to fill. Integer part of the displayed score. */
export function scoreSegments(score: number): number {
  return Math.min(5, Math.max(0, Math.floor(displayScore(score) + 1e-8)));
}

function colorFor(s: number): string {
  if (s <= 1.5) return "#22C55E";
  if (s <= 2.5) return "#86EFAC";
  if (s <= 3.5) return "#FACC15";
  if (s <= 4.5) return "#FB923C";
  return "#EF4444";
}

function tierFor(s: number): string {
  if (s <= 1.5) return "Minimal Risk";
  if (s <= 2.5) return "Low Risk";
  if (s <= 3.5) return "Medium Risk";
  if (s <= 4.5) return "Elevated Risk";
  return "High Risk";
}

/** Color and tier for a final score: bands apply to the floored one-decimal value. */
export function scoreColor(score: number): string {
  return colorFor(displayScore(score));
}

export function scoreTier(score: number): string {
  return tierFor(displayScore(score));
}

export function scoreTextColor(score: number): string {
  return displayScore(score) <= 3.5 ? "#0C0C0C" : "#FFFFFF";
}

/**
 * Color for a figure shown at full precision (category rows print two decimals).
 * Bands use that printed value, not the floored final-score tenth.
 */
export function exactScoreColor(score: number): string {
  return colorFor(score);
}

export function exactScoreTextColor(score: number): string {
  return score <= 3.5 ? "#0C0C0C" : "#FFFFFF";
}
