/**
 * Guards the authoring docs against silent drift.
 *
 * Two failure modes this catches:
 *
 *  1. `reports/graph/SKILL.md` hand-mirrors enums that actually live in
 *     `src/lib/graph.ts`. When someone adds an edge kind or a chain to the
 *     validator and not to the doc, graph authors keep writing against the
 *     old vocabulary (and vice versa: a doc-only kind fails the build).
 *
 *  2. The skills in `reports/` are registered twice — `.claude/skills/` for
 *     Claude Code, `.pi/settings.json` for Pi. A rename that updates one
 *     adapter and not the other silently drops the skill for that tool.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, realpathSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

/** Pull the quoted entries out of a `new Set([...])` / object literal block. */
function sliceBlock(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `marker not found in graph.ts: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(end, -1, `end marker not found after ${startMarker}`);
  return source.slice(start + startMarker.length, end);
}

const graphTs = read("src/lib/graph.ts");
const graphDoc = read("reports/graph/SKILL.md");

test("graph SKILL.md documents exactly the validator's edge kinds", () => {
  const block = sliceBlock(graphTs, "ALLOWED_EDGE_KINDS = new Set([", "]);");
  const fromCode = new Set([...block.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]));

  // The doc lists each kind as the first cell of a table row, across the
  // grouped "Edge kinds" tables that run until the "Flow kinds" subsection.
  const section = graphDoc.slice(
    graphDoc.indexOf("### Edge kinds"),
    graphDoc.indexOf("### Flow kinds"),
  );
  assert.ok(section.length > 0, "edge-kind section not found in graph SKILL.md");
  const fromDoc = new Set(
    [...section.matchAll(/^\| `([a-z-]+)` \|/gm)]
      .map((m) => m[1])
      .filter((k) => k !== "kind"), // the tables' own header cell
  );

  assert.deepEqual(
    [...fromDoc].sort(),
    [...fromCode].sort(),
    "edge kinds in reports/graph/SKILL.md drifted from ALLOWED_EDGE_KINDS",
  );

  // The heading advertises a count; keep it honest too.
  const heading = /### Edge kinds \((\d+)\)/.exec(graphDoc);
  assert.ok(heading, "edge-kind heading should state a count");
  assert.equal(Number(heading[1]), fromCode.size);
});

test("graph SKILL.md documents exactly the validator's chains", () => {
  const block = sliceBlock(graphTs, "CHAIN_EXPLORERS: Record<string, string> = {", "};");
  const fromCode = new Set(
    [...block.matchAll(/^\s*([a-z0-9]+):\s*"https/gm)].map((m) => m[1]),
  );

  const row = /\| `chain` \| yes \| string \| Default chain for nodes\.(.*)\|/.exec(graphDoc);
  assert.ok(row, "top-level `chain` row not found in graph SKILL.md schema table");
  const fromDoc = new Set([...row[1].matchAll(/`([a-z0-9]+)`/g)].map((m) => m[1]));

  assert.deepEqual(
    [...fromDoc].sort(),
    [...fromCode].sort(),
    "chains in reports/graph/SKILL.md drifted from CHAIN_EXPLORERS",
  );
});

test("every skill is registered for both Claude Code and Pi", () => {
  const claudeSkillsDir = join(ROOT, ".claude/skills");
  const dirs = readdirSync(claudeSkillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  assert.ok(dirs.length > 0, "no skills registered under .claude/skills");

  const piSkills = JSON.parse(read(".pi/settings.json")).skills ?? [];
  // Pi paths are relative to .pi/; resolve to repo-relative canonical paths.
  const piTargets = new Set(
    piSkills.map((p) => realpathSync(resolve(ROOT, ".pi", p))),
  );

  for (const name of dirs) {
    const entry = join(claudeSkillsDir, name, "SKILL.md");
    assert.ok(existsSync(entry), `${name}: .claude/skills/${name}/SKILL.md missing or dangling symlink`);

    // The frontmatter name is the address agents use; it must match the dir.
    const declared = /^name:\s*(\S+)\s*$/m.exec(readFileSync(entry, "utf8"));
    assert.ok(declared, `${name}: SKILL.md has no frontmatter name`);
    assert.equal(
      declared[1],
      name,
      `${name}: frontmatter name '${declared[1]}' does not match its directory`,
    );

    // Both adapters must point at the same canonical file in reports/.
    const target = realpathSync(entry);
    assert.ok(
      piTargets.has(target),
      `${name}: registered for Claude Code but missing from .pi/settings.json skills`,
    );
  }

  assert.equal(
    piTargets.size,
    dirs.length,
    ".pi/settings.json registers a different number of skills than .claude/skills",
  );
});

test("skill cross-references point at files that exist", () => {
  const skillFiles = [
    "AGENTS.md",
    "reports/SKILL.md",
    "reports/reassessment/SKILL.md",
    "reports/review/SKILL.md",
    "reports/graph/SKILL.md",
    "reports/onchain/SKILL.md",
    "reports/bridges/SKILL.md",
    "reports/README.md",
  ];

  for (const file of skillFiles) {
    const text = read(file);
    // Backtick-quoted repo paths, e.g. `reports/onchain/SKILL.md`. Skip
    // globbed/templated paths like reports/graph/<slug>.yaml.
    const refs = [...text.matchAll(/`((?:reports|src|scripts|tests)\/[^`\s]+|AGENTS\.md)`/g)]
      .map((m) => m[1])
      .filter((p) => !p.includes("<") && !p.includes("*"));

    for (const ref of new Set(refs)) {
      assert.ok(
        existsSync(join(ROOT, ref)),
        `${file} references '${ref}', which does not exist`,
      );
    }
  }
});
