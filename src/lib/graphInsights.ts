/**
 * Build-time derivation of the graph page's metric strip and guide callouts.
 *
 * Everything here reads fields the YAML already carries plus the report's
 * parsed frontmatter — no new schema. Anything that can't be derived is simply
 * omitted rather than guessed, so a sparse graph degrades to fewer stats
 * instead of showing blanks.
 */

import type { Graph, GraphNode } from "./graph";
import { scoreColor, scoreTier, scoreTextColor } from "./colors";

export interface GraphMetric {
  label: string;
  value: string;
  /** Secondary line under the value. */
  sub?: string;
  /** When set, the value renders as a filled chip in this color. */
  chipColor?: string;
  chipTextColor?: string;
}

export interface GraphCallout {
  n: number;
  /** Node the pin anchors to. Always an id present in the expanded graph. */
  nodeId: string;
  title: string;
  body: string;
}

/** Cross-link facts the page has already resolved, keyed by node id. */
export interface CrossLinkInfo {
  slug: string;
  score: number;
  tier: string;
  color: string;
  /** Foreground that stays legible on `color` — see `scoreTextColor`. */
  textColor: string;
}

/**
 * Pull a share out of an `allocates-to` label.
 *
 * Two shapes occur in the corpus, because not every report expresses
 * allocation the same way:
 *   - a percentage — "97.15%", "~12%", "7.3% (instant)"
 *   - an absolute amount — "~$48.9M USDC", "WBTC ~$71.8M"
 * A third group is purely qualitative ("Deribit margin", "lending", "curator
 * allocation") for protocols whose reports give no split at all. Those return
 * null and simply drop out of the metric — the alternative would be inventing
 * a number.
 */
type Share =
  | { unit: "pct"; value: number }
  | { unit: "usd"; value: number };

const USD_SCALE: Record<string, number> = { k: 1e3, m: 1e6, b: 1e9 };

function parseShare(label: string | undefined): Share | null {
  if (!label) return null;
  const pct = label.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (pct) {
    const n = Number.parseFloat(pct[1].replace(",", "."));
    if (Number.isFinite(n)) return { unit: "pct", value: n };
  }
  const usd = label.match(/\$\s*(\d+(?:[.,]\d+)?)\s*([kmb])?/i);
  if (usd) {
    const n = Number.parseFloat(usd[1].replace(",", "."));
    const scale = usd[2] ? (USD_SCALE[usd[2].toLowerCase()] ?? 1) : 1;
    if (Number.isFinite(n)) return { unit: "usd", value: n * scale };
  }
  return null;
}

const fmtPct = (n: number): string => `${Number.parseFloat(n.toFixed(2))}%`;

function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${Number.parseFloat((n / 1e9).toFixed(2))}B`;
  if (n >= 1e6) return `$${Number.parseFloat((n / 1e6).toFixed(2))}M`;
  if (n >= 1e3) return `$${Number.parseFloat((n / 1e3).toFixed(1))}K`;
  return `$${Math.round(n)}`;
}

const fmtShare = (s: Share): string =>
  s.unit === "pct" ? fmtPct(s.value) : fmtUsd(s.value);

interface Allocation {
  share: Share;
  targetId: string;
  targetLabel: string;
}

/**
 * Sorted largest-first. Mixed units are not comparable, so when a graph uses
 * both we rank within the dominant unit rather than pretending 48.9M > 77.9.
 */
function allocations(graph: Graph): Allocation[] {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const out: Allocation[] = [];
  for (const e of graph.edges) {
    if (e.kind !== "allocates-to") continue;
    const share = parseShare(e.label);
    const target = byId.get(e.to);
    if (!share || !target) continue;
    out.push({ share, targetId: target.id, targetLabel: target.label });
  }
  const pcts = out.filter((a) => a.share.unit === "pct");
  const scoped = pcts.length >= out.length - pcts.length ? pcts : out.filter((a) => a.share.unit === "usd");
  return scoped.sort((a, b) => b.share.value - a.share.value);
}

/** The node a graph is "about" — same anchor rule `getGraphIndex()` uses. */
function primaryVault(graph: Graph): GraphNode | undefined {
  return graph.nodes.find((n) => n.category === "vault");
}

export function buildMetrics(
  graph: Graph,
  finalScore: number | null | undefined,
  crossLinks: Map<string, CrossLinkInfo>,
): GraphMetric[] {
  const metrics: GraphMetric[] = [];

  if (finalScore != null && finalScore > 0) {
    metrics.push({
      label: "Final score",
      value: finalScore.toFixed(1),
      sub: scoreTier(finalScore),
      chipColor: scoreColor(finalScore),
      chipTextColor: scoreTextColor(finalScore),
    });
  }

  metrics.push({
    label: "Graph size",
    value: `${graph.nodes.length}`,
    sub: `contracts · ${graph.edges.length} links`,
  });

  const allocs = allocations(graph);
  if (allocs.length > 0) {
    const top = allocs[0];
    metrics.push({
      label: "Largest allocation",
      value: fmtShare(top.share),
      sub: top.targetLabel,
    });
  }

  const deps = graph.nodes.filter((n) => n.category === "dependency");
  if (deps.length > 0) {
    // "Worst" = highest score, since the scale runs low-risk → high-risk.
    let worst: CrossLinkInfo | undefined;
    for (const d of deps) {
      const cl = crossLinks.get(d.id);
      if (cl && (!worst || cl.score > worst.score)) worst = cl;
    }
    const assessed = deps.filter((d) => crossLinks.has(d.id)).length;
    metrics.push({
      label: "External dependencies",
      value: `${deps.length}`,
      sub: worst
        ? `${assessed} assessed · worst ${worst.score.toFixed(1)} ${worst.tier.replace(" Risk", "")}`
        : "none separately assessed",
    });
  }

  const mintEdges = graph.edges.filter((e) => e.kind === "mints");
  metrics.push({
    label: "Mint authority",
    value: mintEdges.length > 0 ? `${mintEdges.length}` : "None",
    sub:
      mintEdges.length > 0
        ? `privileged mint ${mintEdges.length === 1 ? "role" : "roles"}`
        : "permissionless or collateral-gated",
  });

  return metrics;
}

/**
 * Four at most, in reading order. Each one is anchored to a real node and
 * phrased from this graph's own numbers — a generic tour would not be worth
 * the pixels.
 */
export function buildCallouts(
  graph: Graph,
  crossLinks: Map<string, CrossLinkInfo>,
): GraphCallout[] {
  const out: Omit<GraphCallout, "n">[] = [];
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));

  const vault = primaryVault(graph);
  if (vault) {
    out.push({
      nodeId: vault.id,
      title: "Start here",
      body: `${vault.label} is what a depositor holds. Everything to the right is where that money goes; everything to the left is who can change it.`,
    });
  }

  const allocs = allocations(graph);
  if (allocs.length > 0) {
    const top = allocs[0];
    const share = fmtShare(top.share);
    out.push({
      nodeId: top.targetId,
      title: "The concentration to watch",
      body:
        allocs.length > 1
          ? `${top.targetLabel} carries ${share} of vault debt — the largest of ${allocs.length} funded legs. Hover it to trace what sits underneath.`
          : `${top.targetLabel} carries ${share} of vault debt. It is the only funded leg, so its underlying protocol is a single point of failure.`,
    });
  }

  let riskiest: { node: GraphNode; cl: CrossLinkInfo } | undefined;
  for (const n of graph.nodes) {
    if (n.category !== "dependency") continue;
    const cl = crossLinks.get(n.id);
    if (cl && (!riskiest || cl.score > riskiest.cl.score)) riskiest = { node: n, cl };
  }
  if (riskiest) {
    out.push({
      nodeId: riskiest.node.id,
      title: "Separately assessed dependency",
      body: `${riskiest.node.label} has its own risk report, scored ${riskiest.cl.score.toFixed(1)} (${riskiest.cl.tier}). Its downstream strategies are inlined here at reduced opacity — open the card for the full graph.`,
    });
  }

  const mint = graph.edges.find((e) => e.kind === "mints");
  if (mint) {
    const holder = byId.get(mint.from);
    const token = byId.get(mint.to);
    const role = mint.label ? ` (${mint.label})` : "";
    out.push({
      nodeId: mint.to,
      title: "Mint authority",
      body: `${holder?.label ?? mint.from} can create new ${token?.label ?? mint.to} supply${role}. Privileged minting is a fund-loss path that does not require a hack — check the report's governance section for who controls it.`,
    });
  } else if (vault) {
    out.push({
      nodeId: vault.id,
      title: "No mint authority",
      body: "This graph draws no mint edges: supply here is permissionless or gated only by collateral deposit. The absence is itself a signal — nobody holds a privileged mint role over these tokens.",
    });
  }

  // Dedupe by anchor so two pins never stack on one card, then number.
  const seen = new Set<string>();
  return out
    .filter((c) => {
      if (seen.has(c.nodeId)) return false;
      seen.add(c.nodeId);
      return true;
    })
    .slice(0, 4)
    .map((c, i) => ({ ...c, n: i + 1 }));
}
