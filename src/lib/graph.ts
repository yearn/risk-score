import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

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

export function getGraphBySlug(slug: string): Graph | undefined {
  const yamlPath = path.join(GRAPH_DIR, `${slug}.yaml`);
  const ymlPath = path.join(GRAPH_DIR, `${slug}.yml`);
  const file = fs.existsSync(yamlPath) ? yamlPath : fs.existsSync(ymlPath) ? ymlPath : null;
  if (!file) return undefined;
  const content = fs.readFileSync(file, "utf-8");
  const raw = yaml.load(content);
  return validate(slug, raw);
}
