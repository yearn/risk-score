/**
 * Scores are always rounded down: two decimals everywhere, one decimal on the
 * home page and reports list cards (2.459 → "2.45" / "2.4").
 *
 * Tier bands are lower-inclusive hard lines (2.5 is Medium). Every boundary
 * sits on a tenth, so the floored value is always in the same tier as the full
 * score: color, tier, and bars take the raw score and agree with any shown
 * number.
 */
function floorTo(score: number, digits: number): string {
  const f = 10 ** digits;
  // Epsilon keeps values already on the grid (2.3 is 2.2999… in IEEE) from
  // dropping a step.
  return (Math.floor(score * f + 1e-8) / f).toFixed(digits);
}

/** Two-decimal score used on report pages, graphs, and OG images. */
export function formatScore(score: number): string {
  return floorTo(score, 2);
}

/** Home page and reports list cards: floored one-decimal score. */
export function formatListScore(score: number): string {
  return floorTo(score, 1);
}

const BANDS = [
  { below: 1.5, tier: "Minimal Risk", color: "#22C55E", text: "#0C0C0C" },
  { below: 2.5, tier: "Low Risk", color: "#86EFAC", text: "#0C0C0C" },
  { below: 3.5, tier: "Medium Risk", color: "#FACC15", text: "#0C0C0C" },
  { below: 4.5, tier: "Elevated Risk", color: "#FB923C", text: "#FFFFFF" },
  { below: Infinity, tier: "High Risk", color: "#EF4444", text: "#FFFFFF" },
];

function bandIndex(score: number): number {
  return BANDS.findIndex((b) => score < b.below);
}

export function scoreColor(score: number): string {
  return BANDS[bandIndex(score)].color;
}

export function scoreTier(score: number): string {
  return BANDS[bandIndex(score)].tier;
}

export function scoreTextColor(score: number): string {
  return BANDS[bandIndex(score)].text;
}

/** How many of the five list-bar segments to fill: one per tier, Minimal = 1. */
export function scoreSegments(score: number): number {
  return bandIndex(score) + 1;
}
