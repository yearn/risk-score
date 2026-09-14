#!/usr/bin/env node
/**
 * Lints the dependency-graph corpus in reports/graph/.
 *
 * The build-time validator in src/lib/graph.ts already rejects anything that
 * would break rendering (bad ids, unknown kinds, dangling edges). This checks
 * the softer conventions that don't break the build but do degrade the page:
 * a `mints` edge with no role name renders as an unexplained red arrow, a node
 * on an unknown chain silently links to the wrong explorer, and a graph with
 * no `vault` anchor can never be cross-linked from another graph.
 *
 * Deliberately *not* checked: that `allocates-to` labels carry a percentage.
 * Several protocols express allocation in dollars ("~$48.9M USDC") or
 * qualitatively ("Deribit margin", "curator allocation") because their reports
 * do; demanding a percentage there would invite invented numbers.
 *
 * Usage:  node scripts/check_graphs.mjs [--strict]
 *         --strict exits 1 on warnings (for CI); default exits 0.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { MORPHO_CHAINS, GENERATED_NODE_PREFIX } from "./update_morpho_graph_markets.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GRAPH_DIR = path.join(ROOT, "reports", "graph");
const REPORT_DIR = path.join(ROOT, "reports", "report");

/** Chains `explorerUrl()` knows about; anything else falls back to Etherscan. */
export const KNOWN_CHAINS = new Set([
  "ethereum",
  "polygon",
  "base",
  "arbitrum",
  "sonic",
  "katana",
  "hyperevm",
  "plume",
]);

/**
 * Kinds whose label is the only place the relationship's *specifics* can live.
 * These render in the details panel; unlabelled, the reader sees "MINT
 * AUTHORITY ← Some Multisig" with no idea which role that is.
 */
export const LABEL_REQUIRED_KINDS = new Set([
  "mints",
  "holds-role",
  "proposes-on",
  "cancels-on",
]);

/**
 * Pure function over already-parsed graphs so it can be unit-tested without
 * touching the filesystem.
 *
 * @param {{slug: string, graph: object}[]} graphs
 * @param {Set<string>} reportSlugs
 * @returns {{level: "error"|"warn", slug: string, message: string}[]}
 */
export function findGraphIssues(graphs, reportSlugs) {
  const issues = [];
  const add = (level, slug, message) => issues.push({ level, slug, message });

  // Every addressed `vault` node anchors its graph in getGraphIndex(), so two
  // graphs claiming the same address makes the drill-down target arbitrary
  // (first file wins). Usually it means a node is mis-categorised: shared
  // machinery like an accountant or fee recipient belongs in `infra`.
  const vaultClaims = new Map();
  for (const { slug, graph } of graphs) {
    for (const n of graph.nodes ?? []) {
      if (n.category !== "vault" || !n.address) continue;
      const key = `${(n.chain ?? graph.chain ?? "ethereum").toLowerCase()}:${n.address.toLowerCase()}`;
      if (!vaultClaims.has(key)) vaultClaims.set(key, []);
      vaultClaims.get(key).push({ slug, id: n.id });
    }
  }
  for (const [key, claims] of vaultClaims) {
    const owners = [...new Set(claims.map((c) => c.slug))];
    if (owners.length < 2) continue;
    const address = key.split(":")[1];
    for (const owner of owners) {
      const ids = claims.filter((c) => c.slug === owner).map((c) => c.id);
      add(
        "warn",
        owner,
        `vault node(s) ${ids.map((i) => `'${i}'`).join(", ")} claim ${address}, also claimed by ${owners.filter((o) => o !== owner).join(", ")} — cross-links to this address resolve arbitrarily`,
      );
    }
  }

  for (const { slug, graph } of graphs) {
    const nodes = graph.nodes ?? [];
    const edges = graph.edges ?? [];
    const byId = new Map(nodes.map((n) => [n.id, n]));

    if (!reportSlugs.has(slug)) {
      add("error", slug, `no matching report at reports/report/${slug}.md`);
    }

    if (graph.slug && graph.slug !== slug) {
      add("error", slug, `'slug: ${graph.slug}' does not match the filename`);
    }

    // Without a vault node carrying an address, getGraphIndex() cannot anchor
    // this graph, so no other graph can ever cross-link to it.
    const anchor = nodes.find((n) => n.category === "vault" && n.address);
    if (!anchor) {
      add(
        "error",
        slug,
        "no `vault` node with an address — this graph can never be cross-linked from another",
      );
    }

    const chains = new Set([graph.chain, ...nodes.map((n) => n.chain)].filter(Boolean));
    for (const c of chains) {
      if (!KNOWN_CHAINS.has(String(c).toLowerCase())) {
        add("error", slug, `unknown chain '${c}' — explorer links will fall back to Etherscan`);
      }
    }

    // A duplicated address inside one graph usually means two nodes that
    // should have been merged, and it makes the cross-link anchor ambiguous.
    const seenAddr = new Map();
    for (const n of nodes) {
      if (!n.address) continue;
      const key = `${(n.chain ?? graph.chain ?? "ethereum").toLowerCase()}:${n.address.toLowerCase()}`;
      if (seenAddr.has(key)) {
        add("warn", slug, `nodes '${seenAddr.get(key)}' and '${n.id}' share address ${n.address}`);
      } else {
        seenAddr.set(key, n.id);
      }
    }

    // Morpho vault tagging: the tag is the only signal the updater expands on,
    // so its invariants are linted here (mirrors src/lib/graph.ts validation).
    for (const n of nodes) {
      if (n.morphoVault !== undefined && n.morphoVault !== "v1" && n.morphoVault !== "v2") {
        add("error", slug, `node '${n.id}' has invalid morphoVault '${n.morphoVault}' (expected "v1" or "v2")`);
      }
      if (n.morphoVault !== undefined && !n.address) {
        add("error", slug, `node '${n.id}' is tagged morphoVault but has no address`);
      }
      if (n.morphoVault !== undefined && String(n.id).startsWith(GENERATED_NODE_PREFIX)) {
        add("error", slug, `generated Morpho market node '${n.id}' must not carry morphoVault`);
      }
      if (n.morphoVault !== undefined) {
        const chain = String(n.chain ?? graph.chain ?? "ethereum").toLowerCase();
        if (!MORPHO_CHAINS.has(chain)) {
          add("error", slug, `node '${n.id}' is tagged morphoVault on unsupported chain '${chain}'`);
        }
      }
      if (n.link !== undefined && !/^https:\/\//.test(n.link)) {
        add("error", slug, `node '${n.id}' has a non-https link '${n.link}'`);
      }
    }

    for (const e of edges) {
      if (LABEL_REQUIRED_KINDS.has(e.kind) && !e.label) {
        const from = byId.get(e.from)?.label ?? e.from;
        const to = byId.get(e.to)?.label ?? e.to;
        add("warn", slug, `${e.kind} '${from}' → '${to}' has no label (the role name is not shown to readers)`);
      }
    }

    // A node nothing connects to is almost always a leftover from an edit.
    const connected = new Set(edges.flatMap((e) => [e.from, e.to]));
    for (const n of nodes) {
      if (!connected.has(n.id)) {
        add("warn", slug, `node '${n.id}' (${n.label}) has no edges`);
      }
    }
  }

  return issues;
}

function main() {
  const strict = process.argv.includes("--strict");
  const files = fs.existsSync(GRAPH_DIR)
    ? fs.readdirSync(GRAPH_DIR).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    : [];
  const reportSlugs = new Set(
    fs.existsSync(REPORT_DIR)
      ? fs.readdirSync(REPORT_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(".md", ""))
      : [],
  );

  const graphs = [];
  for (const f of files) {
    const slug = f.replace(/\.ya?ml$/, "");
    try {
      graphs.push({ slug, graph: yaml.load(fs.readFileSync(path.join(GRAPH_DIR, f), "utf-8")) });
    } catch (err) {
      console.error(`[check-graphs] ${slug}: failed to parse — ${err.message}`);
      process.exit(1);
    }
  }

  const issues = findGraphIssues(graphs, reportSlugs);
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");

  for (const i of [...errors, ...warns]) {
    console.log(`[check-graphs] ${i.level === "error" ? "ERROR" : "warn "} ${i.slug}: ${i.message}`);
  }
  console.log(
    `[check-graphs] ${graphs.length} graphs checked — ${errors.length} error(s), ${warns.length} warning(s)`,
  );

  if (errors.length > 0) process.exit(1);
  if (strict && warns.length > 0) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
