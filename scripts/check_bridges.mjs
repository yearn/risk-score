#!/usr/bin/env node
/**
 * Validates src/data/bridges.json against the reports.
 *
 * Two jobs:
 *  1. STRICT (fails the build): every dependency `slug` in bridges.json must
 *     point to an existing reports/report/<slug>.md file, so every row on the
 *     Bridges page links to a real report.
 *  2. SOFT (warns only): scan report markdown for each bridge's `keywords`. Any
 *     report that mentions a bridge but is NOT listed under that bridge (and is
 *     not in its `ignore` list) is printed as a reminder to review it — a mere
 *     mention is not always a dependency, so this never fails the build unless
 *     run with --strict (used in CI to force a conscious decision).
 *
 * Usage: node scripts/check_bridges.mjs [--strict]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, "reports", "report");
const BRIDGES_JSON = path.join(ROOT, "src", "data", "bridges.json");

const STRICT = process.argv.includes("--strict");

function main() {
  const { bridges } = JSON.parse(fs.readFileSync(BRIDGES_JSON, "utf-8"));
  const reportFiles = fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".md"));
  const reportSlugs = new Set(reportFiles.map((f) => f.replace(/\.md$/, "")));

  const errors = [];
  const warnings = [];

  for (const bridge of bridges) {
    // 1. STRICT: dependency slugs must resolve to a report.
    for (const dep of bridge.dependencies) {
      if (!reportSlugs.has(dep.slug)) {
        errors.push(
          `[${bridge.id}] dependency "${dep.name}" -> slug "${dep.slug}" has no reports/report/${dep.slug}.md`
        );
      }
      if (dep.kind !== "direct" && dep.kind !== "indirect") {
        errors.push(
          `[${bridge.id}] dependency "${dep.name}" has invalid kind "${dep.kind}" (expected direct|indirect)`
        );
      }
    }

    // 2. SOFT: find reports mentioning this bridge but not listed under it.
    const keywords = (bridge.keywords ?? []).map((k) => k.toLowerCase());
    if (keywords.length === 0) continue;
    const listed = new Set(bridge.dependencies.map((d) => d.slug));
    const ignore = new Set(bridge.ignore ?? []);
    for (const file of reportFiles) {
      const slug = file.replace(/\.md$/, "");
      if (listed.has(slug) || ignore.has(slug)) continue;
      const text = fs
        .readFileSync(path.join(REPORTS_DIR, file), "utf-8")
        .toLowerCase();
      const hit = keywords.find((k) => text.includes(k));
      if (hit) {
        warnings.push(
          `[${bridge.id}] report "${slug}" mentions "${hit}" but is not listed under ${bridge.name}. ` +
            `If it depends on ${bridge.name}, add it to bridges.json; otherwise add "${slug}" to that bridge's "ignore" list.`
        );
      }
    }
  }

  for (const w of warnings) console.warn(`[check_bridges] WARN  ${w}`);
  for (const e of errors) console.error(`[check_bridges] ERROR ${e}`);

  if (errors.length > 0) {
    console.error(`[check_bridges] ${errors.length} error(s) — see above.`);
    process.exit(1);
  }
  if (warnings.length > 0 && STRICT) {
    console.error(
      `[check_bridges] ${warnings.length} unreviewed bridge mention(s) in --strict mode.`
    );
    process.exit(1);
  }
  console.log(
    `[check_bridges] ok — ${bridges.length} bridges, ${bridges.reduce(
      (n, b) => n + b.dependencies.length,
      0
    )} dependencies, ${warnings.length} warning(s).`
  );
}

main();
