import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, realpathSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

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
const graphDoc = read(".agents/skills/generating-dependency-graphs/references/schema.md");

test("graph schema reference documents exactly the validator's edge kinds", () => {
  const block = sliceBlock(graphTs, "ALLOWED_EDGE_KINDS = new Set([", "]);");
  const fromCode = new Set([...block.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]));

  // The doc lists each kind as the first cell of a table row, across the
  // grouped "Edge kinds" tables that run until the "Flow kinds" subsection.
  const section = graphDoc.slice(
    graphDoc.indexOf("### Edge kinds"),
    graphDoc.indexOf("### Flow kinds"),
  );
  assert.ok(section.length > 0, "edge-kind section not found in graph schema reference");
  const fromDoc = new Set(
    [...section.matchAll(/^\| `([a-z-]+)` \|/gm)]
      .map((m) => m[1])
      .filter((k) => k !== "kind"), // the tables' own header cell
  );

  assert.deepEqual(
    [...fromDoc].sort(),
    [...fromCode].sort(),
    "edge kinds in .agents/skills/generating-dependency-graphs/references/schema.md drifted from ALLOWED_EDGE_KINDS",
  );

  // The heading advertises a count; keep it honest too.
  const heading = /### Edge kinds \((\d+)\)/.exec(graphDoc);
  assert.ok(heading, "edge-kind heading should state a count");
  assert.equal(Number(heading[1]), fromCode.size);
});

test("graph schema reference documents exactly the validator's chains", () => {
  const block = sliceBlock(graphTs, "CHAIN_EXPLORERS: Record<string, string> = {", "};");
  const fromCode = new Set(
    [...block.matchAll(/^\s*([a-z0-9]+):\s*"https/gm)].map((m) => m[1]),
  );

  const row = /\| `chain` \| yes \| string \| Default chain for nodes\.(.*)\|/.exec(graphDoc);
  assert.ok(row, "top-level `chain` row not found in graph schema reference schema table");
  const fromDoc = new Set([...row[1].matchAll(/`([a-z0-9]+)`/g)].map((m) => m[1]));

  assert.deepEqual(
    [...fromDoc].sort(),
    [...fromCode].sort(),
    "chains in .agents/skills/generating-dependency-graphs/references/schema.md drifted from CHAIN_EXPLORERS",
  );
});

const skillsDir = join(ROOT, ".agents/skills");
const skillNames = readdirSync(skillsDir).filter((name) =>
  existsSync(join(skillsDir, name, "SKILL.md")),
);

function frontmatter(file) {
  const match = /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, "utf8"));
  assert.ok(match, `${file}: missing frontmatter`);
  return load(match[1]);
}

function markdownFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory()
      ? markdownFiles(path)
      : path.endsWith(".md") ? [path] : [];
  });
}

test("Codex, Claude, and Pi discover the same canonical skills", () => {
  assert.ok(skillNames.length > 0, "no canonical skills");
  const claudeDir = join(ROOT, ".claude/skills");
  assert.equal(realpathSync(claudeDir), realpathSync(skillsDir));
  const piPaths = JSON.parse(read(".pi/settings.json")).skills;
  assert.deepEqual(
    piPaths.map((p) => realpathSync(resolve(ROOT, ".pi", p))),
    [realpathSync(skillsDir)],
  );
  for (const name of skillNames) {
    const entry = join(skillsDir, name, "SKILL.md");
    const metadata = frontmatter(entry);
    assert.equal(metadata.name, name, `${entry}: directory/name mismatch`);
    assert.ok(typeof metadata.description === "string" && metadata.description.trim());
    assert.equal(realpathSync(join(claudeDir, name, "SKILL.md")), entry);
  }
});

test("Claude and Pi commands share the canonical prompts", () => {
  const commandsDir = join(ROOT, ".agents/commands");
  const names = readdirSync(commandsDir).sort();
  assert.deepEqual(names, ["graph.md", "reassess.md", "report.md", "review-report.md"]);
  for (const adapter of [".claude/commands", ".pi/prompts"]) {
    assert.equal(realpathSync(join(ROOT, adapter)), commandsDir);
    for (const name of names) {
      assert.equal(realpathSync(join(ROOT, adapter, name)), join(commandsDir, name));
    }
  }
});

test("agent links resolve from canonical and adapter paths", () => {
  const files = [
    ...markdownFiles(join(ROOT, ".agents")),
    ...markdownFiles(join(ROOT, ".claude/skills")),
    ...markdownFiles(join(ROOT, ".claude/commands")),
    ...markdownFiles(join(ROOT, ".pi/prompts")),
    ...["AGENTS.md", "CLAUDE.md", "reports/README.md", "reports/TEMPLATE.md", "tests/skill_scenarios.md"].map((p) => join(ROOT, p)),
  ];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const links = [...content.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);
    for (const href of links) {
      // Ignore external links and the report template's literal URL placeholders.
      if (/^[a-z][a-z\d+.-]*:/i.test(href) || href === "URL") continue;
      const [path, anchor] = href.split("#");
      const target = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
      assert.ok(existsSync(target), `${file}: broken link ${href}`);
      if (anchor && target.endsWith(".md")) {
        const headings = [...readFileSync(target, "utf8").matchAll(/^#{1,6} (.+)$/gm)]
          .map((m) => m[1].toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, "").replace(/ /g, "-"));
        assert.ok(headings.includes(anchor), `${file}: missing heading ${href}`);
      }
    }
  }
});
