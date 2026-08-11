/**
 * Single source of truth for how the dependency graph is drawn.
 *
 * Before this module the same encoding lived in four places — the edge-kind
 * enum in `graph.ts`, `KIND_LABELS` in the page frontmatter, the
 * `flow`/`role`/`gov` sets in the client script, and the `.line-*` rules in
 * CSS — which meant a restyle had to touch all of them and could silently
 * drift. Both the Astro frontmatter (legend, insights) and the browser bundle
 * (cytoscape styling) import from here.
 *
 * Deliberately dependency-free so it can be imported from either side.
 */

/** Capital movement. Drives hover chains and cross-graph downstream expansion. */
export const FLOW_KINDS = new Set(["allocates-to", "deposits-into", "routes-through"]);

/**
 * The subset of flow kinds whose `label` is drawn on the canvas. `routes-through`
 * is a flow kind for traversal purposes but renders as a thin unlabelled hop —
 * it is the most common kind in the corpus and labelling it would bury the
 * allocation percentages that matter.
 */
export const CANVAS_LABEL_KINDS = new Set(["allocates-to", "deposits-into"]);

/** One contract administering another. */
export const ROLE_KINDS = new Set(["holds-role", "controls", "manages"]);

/** Multisig → timelock signalling. */
export const GOV_KINDS = new Set(["proposes-on", "cancels-on"]);

export const KIND_LABELS: Record<string, string> = {
  "allocates-to": "Allocation",
  "deposits-into": "Deposits into",
  mints: "Mint authority",
  "routes-through": "Routes through",
  "routes-fees-to": "Fees routed",
  "holds-role": "Holds role",
  controls: "Controls",
  manages: "Manages",
  "proposes-on": "Proposes on",
  "cancels-on": "Cancels on",
  deploys: "Deploys",
};

export const kindLabel = (k: string): string => KIND_LABELS[k] ?? k;

export function edgeColor(kind: string): string {
  if (CANVAS_LABEL_KINDS.has(kind)) return "rgba(110, 231, 183, 0.55)";
  // mints: high-trust authority (privileged supply creation) — red is the
  // strongest signal in the palette, intentional to draw the reviewer's eye
  // to mint-role holders.
  if (kind === "mints") return "rgba(239, 68, 68, 0.85)";
  if (ROLE_KINDS.has(kind)) return "rgba(251, 191, 36, 0.5)";
  if (GOV_KINDS.has(kind)) return "rgba(167, 139, 250, 0.55)";
  // routes-through participates in flow but renders as a thin hop — muted
  // khaki keeps it visible without competing with the bright money-flow edges
  // or the amber role edges.
  if (kind === "routes-through") return "rgba(202, 184, 110, 0.75)";
  // routes-fees-to + deploys: background plumbing (deployment lineage, fee
  // routing) — mid-gray reads on both dark and light themes; pure white at low
  // opacity vanishes on light mode.
  return "rgba(140, 140, 140, 0.6)";
}

export function edgeStyle(kind: string): "solid" | "dashed" | "dotted" {
  if (kind === "mints") return "dashed";
  if (ROLE_KINDS.has(kind)) return "dashed";
  if (GOV_KINDS.has(kind)) return "dotted";
  return "solid";
}

export function edgeWidth(kind: string): number {
  if (CANVAS_LABEL_KINDS.has(kind)) return 2;
  if (kind === "mints") return 2.25; // slightly heavier than role edges
  return 1.5;
}

/** Shared by the initial layout and the "Re-layout" button. */
export const DAGRE_OPTIONS = {
  name: "dagre",
  rankDir: "LR",
  nodeSep: 28,
  rankSep: 110,
  edgeSep: 12,
  ranker: "network-simplex",
} as const;

/** The 5 node categories, in the order the legend should list them. */
export const CATEGORY_ORDER = ["vault", "strategy", "governance", "infra", "dependency"];

/**
 * Display names for the chains `explorerUrl()` knows about. Shown in the
 * details panel — a node's chain was previously only visible as part of the
 * explorer URL.
 */
export const CHAIN_LABELS: Record<string, string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  base: "Base",
  arbitrum: "Arbitrum",
  sonic: "Sonic",
  katana: "Katana",
  hyperevm: "HyperEVM",
};

export const chainLabel = (chain: string): string =>
  CHAIN_LABELS[chain.toLowerCase()] ?? chain;
