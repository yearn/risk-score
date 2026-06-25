import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { getReportBySlug } from "./reports";

const GRAPH_DIR = path.resolve("reports/graph");

export interface GraphCategory {
  id: string;
  label: string;
}

export interface GraphNode {
  id: string;
  label: string;
  address?: string;
  chain?: string;
  category: string;
  link?: string;
  note?: string;
  /** Set at build time by expandCrossLinks; never present in YAML. */
  _inlinedFromSlug?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: string;
  label?: string;
}

export interface Graph {
  slug: string;
  chain: string;
  title?: string;
  categories: GraphCategory[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * The closed set of edge kinds the renderer + cross-link expansion know how
 * to handle. A YAML that uses anything outside this set would still render
 * (with generic fallback styling) but would silently drop out of FLOW_KINDS,
 * hover chains, and cross-graph expansion. So validate at build time and
 * fail loudly instead.
 */
export const ALLOWED_EDGE_KINDS = new Set([
  // Money flow
  "allocates-to",
  "deposits-into",
  // Mint authority (high-trust — privileged ability to create new token supply)
  "mints",
  // Role / control
  "holds-role",
  "controls",
  "manages",
  // Governance signaling
  "proposes-on",
  "cancels-on",
  // Incidental wiring
  "routes-through",
  "routes-fees-to",
  "deploys",
]);

const CHAIN_EXPLORERS: Record<string, string> = {
  ethereum: "https://etherscan.io/address/",
  polygon: "https://polygonscan.com/address/",
  base: "https://basescan.org/address/",
  arbitrum: "https://arbiscan.io/address/",
  sonic: "https://sonicscan.org/address/",
  katana: "https://explorer.katanarpc.com/address/",
  hyperevm: "https://hyperevmscan.io/address/",
};

export function explorerUrl(address: string, chain = "ethereum"): string {
  const base = CHAIN_EXPLORERS[chain.toLowerCase()] ?? CHAIN_EXPLORERS.ethereum;
  return `${base}${address}`;
}

function validate(slug: string, raw: unknown): Graph {
  if (!raw || typeof raw !== "object")
    throw new Error(`[graph:${slug}] file is empty or not an object`);
  const g = raw as Partial<Graph>;
  if (!Array.isArray(g.categories))
    throw new Error(`[graph:${slug}] missing 'categories'`);
  if (!Array.isArray(g.nodes))
    throw new Error(`[graph:${slug}] missing 'nodes'`);
  if (!Array.isArray(g.edges))
    throw new Error(`[graph:${slug}] missing 'edges'`);

  const catIds = new Set(g.categories.map((c) => c.id));
  const nodeIds = new Set<string>();
  for (const n of g.nodes) {
    if (!n.id) throw new Error(`[graph:${slug}] node missing id`);
    if (nodeIds.has(n.id))
      throw new Error(`[graph:${slug}] duplicate node id '${n.id}'`);
    nodeIds.add(n.id);
    if (!catIds.has(n.category))
      throw new Error(
        `[graph:${slug}] node '${n.id}' has unknown category '${n.category}'`,
      );
  }
  for (const e of g.edges) {
    if (!nodeIds.has(e.from))
      throw new Error(
        `[graph:${slug}] edge.from '${e.from}' does not match any node`,
      );
    if (!nodeIds.has(e.to))
      throw new Error(
        `[graph:${slug}] edge.to '${e.to}' does not match any node`,
      );
    if (typeof e.kind !== "string" || !ALLOWED_EDGE_KINDS.has(e.kind))
      throw new Error(
        `[graph:${slug}] edge '${e.from}' → '${e.to}' has unknown kind '${e.kind}'. ` +
          `Allowed: ${[...ALLOWED_EDGE_KINDS].sort().join(", ")}`,
      );
  }
  return {
    slug,
    chain: g.chain ?? "ethereum",
    title: g.title,
    categories: g.categories,
    nodes: g.nodes,
    edges: g.edges,
  };
}

function listFiles(): string[] {
  if (!fs.existsSync(GRAPH_DIR)) return [];
  return fs.readdirSync(GRAPH_DIR).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
}

export function getGraphSlugs(): string[] {
  return listFiles().map((f) => f.replace(/\.ya?ml$/, ""));
}

export function hasGraph(slug: string): boolean {
  return (
    fs.existsSync(path.join(GRAPH_DIR, `${slug}.yaml`)) ||
    fs.existsSync(path.join(GRAPH_DIR, `${slug}.yml`))
  );
}

export interface CrossLinkEntry {
  slug: string;
  label: string;
}

/**
 * Build an address → owning-graph index across every YAML in reports/graph/.
 * "Owning" graph means the graph's primary vault / token node, not every
 * addressed contract in that graph. Used at build time to detect cross-graph
 * references - when a dependency node's address matches the primary vault node
 * in another report-backed graph, the dependency card becomes a drill-down link.
 *
 * Key is `<chain>:<address-lowercased>`. First write wins (a contract is
 * normally only "owned" by one graph).
 */
export function getGraphIndex(): Map<string, CrossLinkEntry> {
  const index = new Map<string, CrossLinkEntry>();
  for (const slug of getGraphSlugs()) {
    if (!getReportBySlug(slug)) continue;
    const g = getGraphBySlug(slug);
    if (!g) continue;
    const owner = g.nodes.find((n) => n.category === "vault" && n.address);
    if (!owner?.address) continue;
    const key = `${(owner.chain ?? g.chain).toLowerCase()}:${owner.address.toLowerCase()}`;
    if (!index.has(key)) {
      index.set(key, { slug, label: owner.label });
    }
  }
  return index;
}

/** Resolve a cross-link target for a single node, or `undefined` when none applies. */
export function resolveCrossLink(
  node: GraphNode,
  graphChain: string,
  currentSlug: string,
  index: Map<string, CrossLinkEntry>,
): CrossLinkEntry | undefined {
  if (!node.address) return undefined;
  if (node.category !== "dependency") return undefined;
  const key = `${(node.chain ?? graphChain).toLowerCase()}:${node.address.toLowerCase()}`;
  const entry = index.get(key);
  if (!entry || entry.slug === currentSlug) return undefined;
  return entry;
}

const FLOW_KINDS = new Set(["allocates-to", "deposits-into", "routes-through"]);

/**
 * For every cross-linked node in `graph`, inline the downstream subgraph from
 * the linked graph (flow edges only — `allocates-to`, `deposits-into`,
 * `routes-through`). One level deep: we follow the chain inside the linked
 * graph but never recurse into a third graph.
 *
 * IDs of inlined nodes are namespaced as `<linked-slug>::<original-id>` to
 * avoid collisions. The start node of the linked subgraph (the contract whose
 * address matches the cross-linked node) is *merged* into the existing node —
 * no duplicate.
 *
 * Inlined nodes get `_inlinedFromSlug` set so the renderer can style them
 * differently.
 */
export function expandCrossLinks(graph: Graph, currentSlug: string): Graph {
  const index = getGraphIndex();
  const mergedNodes: GraphNode[] = graph.nodes.map((n) => ({ ...n }));
  const mergedEdges: GraphEdge[] = graph.edges.map((e) => ({ ...e }));
  const mergedCategories: GraphCategory[] = [...graph.categories];
  const seenIds = new Set(mergedNodes.map((n) => n.id));
  const seenCategoryIds = new Set(graph.categories.map((c) => c.id));

  for (const hostNode of graph.nodes) {
    if (!hostNode.address) continue;
    if (hostNode.category !== "dependency") continue;
    const key = `${(hostNode.chain ?? graph.chain).toLowerCase()}:${hostNode.address.toLowerCase()}`;
    const entry = index.get(key);
    if (!entry || entry.slug === currentSlug) continue;

    const linked = getGraphBySlug(entry.slug);
    if (!linked) continue;

    // Union categories so the merged graph's legend covers inlined nodes.
    for (const cat of linked.categories) {
      if (!seenCategoryIds.has(cat.id)) {
        mergedCategories.push(cat);
        seenCategoryIds.add(cat.id);
      }
    }

    const startNode = linked.nodes.find((n) => {
      if (!n.address) return false;
      const k = `${(n.chain ?? linked.chain).toLowerCase()}:${n.address.toLowerCase()}`;
      return k === key;
    });
    if (!startNode) continue;

    // Map linked-graph id → merged-graph id. The start node maps to the host
    // node id so the first edge of the inlined subgraph attaches to it.
    const idMap = new Map<string, string>();
    idMap.set(startNode.id, hostNode.id);

    const queue: string[] = [startNode.id];
    const visited = new Set<string>([startNode.id]);

    while (queue.length) {
      const currentLinkedId = queue.shift()!;
      const outgoing = linked.edges.filter(
        (e) => e.from === currentLinkedId && FLOW_KINDS.has(e.kind),
      );
      for (const edge of outgoing) {
        const targetLinkedId = edge.to;
        if (!idMap.has(targetLinkedId)) {
          const targetNode = linked.nodes.find((n) => n.id === targetLinkedId);
          if (!targetNode) continue;
          const mergedId = `${entry.slug}::${targetLinkedId}`;
          idMap.set(targetLinkedId, mergedId);
          if (!seenIds.has(mergedId)) {
            mergedNodes.push({
              ...targetNode,
              id: mergedId,
              _inlinedFromSlug: entry.slug,
            });
            seenIds.add(mergedId);
          }
        }
        if (!visited.has(targetLinkedId)) {
          visited.add(targetLinkedId);
          queue.push(targetLinkedId);
        }
        mergedEdges.push({
          from: idMap.get(currentLinkedId)!,
          to: idMap.get(targetLinkedId)!,
          kind: edge.kind,
          label: edge.label,
        });
      }
    }
  }

  return {
    ...graph,
    categories: mergedCategories,
    nodes: mergedNodes,
    edges: mergedEdges,
  };
}

export function getGraphBySlug(slug: string): Graph | undefined {
  const yamlPath = path.join(GRAPH_DIR, `${slug}.yaml`);
  const ymlPath = path.join(GRAPH_DIR, `${slug}.yml`);
  const file = fs.existsSync(yamlPath) ? yamlPath : fs.existsSync(ymlPath) ? ymlPath : null;
  if (!file) return undefined;
  const content = fs.readFileSync(file, "utf-8");
  const raw = yaml.load(content);
  return validate(slug, raw);
}
