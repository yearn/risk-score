#!/usr/bin/env node
/**
 * Expand explicitly tagged Morpho vault nodes in dependency-graph YAML into
 * their current underlying market allocations, fetched from the Morpho GraphQL
 * API.
 *
 * A vault node is expanded only when it carries an explicit `morphoVault: v1`
 * or `morphoVault: v2` tag (never inferred from labels, IDs, notes, or address
 * probing). The tag also names the API collection to query, so a deployed
 * vault's immutable generation is recorded once in reviewed YAML rather than
 * probed on every run.
 *
 * Generated content is written into two marker-delimited sections so that
 * hand-authored YAML — comments, formatting, everything outside the markers —
 * is preserved byte-for-byte. Reruns replace only the managed regions.
 *
 * Usage:
 *   node scripts/update_morpho_graph_markets.mjs [--write] [--graph <slug>]...
 *
 *   Without --write the script runs in check mode: it fetches and computes the
 *   generated sections, prints which graphs would change, and exits non-zero
 *   when any managed content is stale. --write applies the changes. --graph
 *   restricts the run to one or more graph slugs (repeatable); the default is
 *   every graph in reports/graph/.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GRAPH_DIR = path.join(ROOT, "reports", "graph");

export const MORPHO_API_URL = "https://api.morpho.org/graphql";
export const MORPHO_APP_URL = "https://app.morpho.org";
const USER_AGENT = "yearn-risk-score-graph-updater/1.0 (+https://github.com/yearn/risk-score)";

/** Chains for which a Morpho app market URL can be built. */
export const MORPHO_CHAIN_SEGMENTS = { ethereum: "ethereum", base: "base" };
export const MORPHO_CHAINS = new Set(Object.keys(MORPHO_CHAIN_SEGMENTS));

/** Chain id used by the Morpho GraphQL `chainId_in` filter. */
export const MORPHO_CHAIN_IDS = { ethereum: 1, base: 8453 };

export const NODES_START = "# BEGIN GENERATED MORPHO MARKET NODES";
export const NODES_END = "# END GENERATED MORPHO MARKET NODES";
export const EDGES_START = "# BEGIN GENERATED MORPHO MARKET EDGES";
export const EDGES_END = "# END GENERATED MORPHO MARKET EDGES";

/** Prefix used for generated market-node IDs; validated against in graph.ts. */
export const GENERATED_NODE_PREFIX = "morpho-market-";

// The API serializes integer scalars as JSON numbers when the value is a safe
// integer and as decimal strings otherwise (e.g. 18-decimal assets), so every
// integer field must be normalised through BigInt.
function toBigInt(value, context) {
  if (typeof value === "bigint") return value;
  if (typeof value === "string") {
    const t = value.trim();
    if (t === "") return 0n;
    if (!/^\d+$/.test(t)) throw new Error(`${context}: non-integer string ${JSON.stringify(value)}`);
    return BigInt(t);
  }
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value))
      throw new Error(`${context}: unsafe numeric value ${value}; expected a string from the API`);
    return BigInt(value);
  }
  if (value === null || value === undefined) return 0n;
  throw new Error(`${context}: unsupported value ${JSON.stringify(value)}`);
}

export function morphoChainSegment(chain) {
  return MORPHO_CHAIN_SEGMENTS[String(chain).toLowerCase()];
}

export function morphoMarketUrl(chain, marketId) {
  const segment = morphoChainSegment(chain);
  if (!segment) throw new Error(`unsupported Morpho chain '${chain}' (expected one of: ${[...MORPHO_CHAINS].join(", ")})`);
  return `${MORPHO_APP_URL}/${segment}/market/${marketId}/`;
}

/**
 * Format a WAD-scaled LLTV (1e18 = 100%) as a human percentage, trimming the
 * trailing zero from a single decimal place: 860000000000000000 → "86%",
 * 945000000000000000 → "94.5%".
 */
export function formatLltv(lltv) {
  const bp = toBigInt(lltv, "lltv") / 100000000000000n; // 1e18 / 1e4 basis points
  const whole = bp / 100n;
  const frac = bp % 100n;
  let out = String(whole);
  if (frac > 0n) {
    const trimmed = String(frac).padStart(2, "0").replace(/0+$/, "");
    if (trimmed) out += `.${trimmed}`;
  }
  return `${out}%`;
}

/**
 * Allocation share as a percentage string, computed in raw underlying units.
 * Returns null for exactly zero supply. Values below 0.1% are kept (not
 * rounded to 0) and labelled "<0.1%".
 */
export function allocationLabel(supply, total) {
  if (total <= 0n) throw new Error("allocationLabel: totalAssets must be positive");
  if (supply <= 0n) return null;
  const tenths = (supply * 1000n) / total;
  if (tenths === 0n) return "<0.1%";
  return `${tenths / 10n}.${tenths % 10n}%`;
}

/* ------------------------------------------------------------------ planning */

/**
 * Find every node tagged `morphoVault` across the parsed graphs. Each
 * occurrence keeps its graph/node identity so one fetched allocation can be
 * rendered into every graph that references the vault.
 *
 * @returns {{occurrences: Array, queries: Array}}
 */
export function findMorphoVaults(graphs) {
  const occurrences = [];
  const querySet = new Map(); // key -> query, preserving first-seen order
  for (const { slug, graph } of graphs) {
    for (const node of graph.nodes ?? []) {
      if (node.morphoVault !== "v1" && node.morphoVault !== "v2") continue;
      const version = node.morphoVault;
      const address = node.address;
      const chain = String(node.chain ?? graph.chain ?? "ethereum").toLowerCase();
      if (!address)
        throw new Error(`[${slug}] node '${node.id}' is tagged morphoVault:${version} but has no address`);
      if (!MORPHO_CHAINS.has(chain))
        throw new Error(`[${slug}] node '${node.id}' uses unsupported Morpho chain '${chain}'`);
      const key = `${version}:${chain}:${address.toLowerCase()}`;
      if (!querySet.has(key)) querySet.set(key, { version, chain, address });
      occurrences.push({ slug, nodeId: node.id, version, chain, address, nodeLabel: node.label });
    }
  }
  return { occurrences, queries: [...querySet.values()] };
}

/**
 * Turn a 32-byte market ID into a deterministic, collision-free node ID. Uses
 * at least 12 hex characters and extends until unique against `usedIds`.
 */
export function marketNodeId(marketId, usedIds) {
  const hex = String(marketId).replace(/^0x/, "");
  if (!/^[0-9a-f]{12,64}$/i.test(hex))
    throw new Error(`marketNodeId: marketId is not a 32-byte hex identifier: ${marketId}`);
  for (let len = 12; len <= hex.length; len++) {
    const id = `${GENERATED_NODE_PREFIX}${hex.slice(0, len).toLowerCase()}`;
    if (!usedIds.has(id)) return id;
  }
  throw new Error(`marketNodeId: cannot find a unique id for marketId ${marketId}`);
}

/**
 * Build the sorted set of allocations for one vault, computing percentage
 * labels in raw units and sorting markets by allocation descending then market
 * ID ascending. Idle assets (null collateral) are kept as a synthetic
 * allocation so displayed shares reconcile to 100%.
 */
export function buildAllocations(vault, usedIds) {
  const { totalAssets, assetSymbol, name } = vault;
  const items = [];

  for (const alloc of vault.allocations ?? []) {
    // Include every allocation with positive supplied assets — even when the
    // market's current supply cap is zero, the vault remains exposed until the
    // assets are withdrawn, so the position still counts toward risk. Supply
    // caps are deliberately not consulted here.
    if (alloc.supplyAssets <= 0n) continue;
    const label = allocationLabel(alloc.supplyAssets, totalAssets);
    if (label === null) continue;

    if (!alloc.collateralSymbol) {
      // Idle assets are not a lending market: no Morpho link, but they must be
      // shown for the allocations to reconcile.
      const id = uniqueBaseId(`morpho-idle-${slugify(assetSymbol)}`, usedIds);
      items.push({
        id,
        marketId: null,
        label: `Idle ${assetSymbol}`,
        note: `Idle ${assetSymbol} held in ${name}`,
        link: null,
        pct: label,
        supplyAssets: alloc.supplyAssets,
      });
      continue;
    }

    const pair = `${alloc.collateralSymbol}/${alloc.loanSymbol}`;
    const lltv = formatLltv(alloc.lltv);
    const display = `${pair} · ${lltv} LLTV`;

    items.push({
      id: marketNodeId(alloc.marketId, usedIds),
      marketId: alloc.marketId,
      label: display,
      note: `Morpho market ${alloc.marketId}`,
      link: morphoMarketUrl(vault.chain, alloc.marketId),
      pct: label,
      supplyAssets: alloc.supplyAssets,
    });
  }

  items.sort((a, b) => {
    if (a.supplyAssets !== b.supplyAssets)
      return a.supplyAssets > b.supplyAssets ? -1 : 1;
    const am = a.marketId ?? "";
    const bm = b.marketId ?? "";
    return am < bm ? -1 : am > bm ? 1 : 0;
  });
  return items;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
}

function uniqueBaseId(base, usedIds) {
  let id = base;
  let n = 2;
  while (usedIds.has(id)) id = `${base}-${n++}`;
  usedIds.add(id);
  return id;
}

function isGeneratedId(id) {
  const s = String(id);
  return s.startsWith(GENERATED_NODE_PREFIX) || s.startsWith("morpho-idle-");
}

/**
 * Build the generated node/edge lists for one graph. Vaults are processed in
 * graph/node order; a market seen from two vaults in the same graph becomes a
 * single node with one edge per vault.
 */
export function buildGraphSections(graph, occurrences, allocByKey) {
  // Collision base is hand-authored nodes only: the generated nodes from a
  // previous run live inside the managed region and are replaced wholesale, so
  // they must not shift this run's ID derivation (otherwise the output would
  // not be idempotent).
  const usedIds = new Set(
    (graph.nodes ?? []).filter((n) => !isGeneratedId(n.id)).map((n) => n.id),
  );
  const marketNodes = [];
  const edges = [];
  const seenMarket = new Map(); // marketId -> node id

  for (const occ of occurrences) {
    const key = `${occ.version}:${occ.chain}:${occ.address.toLowerCase()}`;
    const vault = allocByKey.get(key);
    if (!vault) continue;
    const items = buildAllocations(vault, usedIds);
    for (const item of items) {
      const nodeKey = item.marketId ?? `idle:${vault.chain}:${vault.address.toLowerCase()}`;
      let nodeId = seenMarket.get(nodeKey);
      if (!nodeId) {
        nodeId = item.id;
        seenMarket.set(nodeKey, nodeId);
        marketNodes.push({
          id: item.id,
          label: item.label,
          category: "dependency",
          link: item.link,
          note: item.note,
        });
      }
      edges.push({ from: occ.nodeId, to: nodeId, kind: "deposits-into", label: item.pct });
    }
  }

  return { marketNodes, edges };
}

/* ---------------------------------------------------------------- rendering */

function yamlScalar(value) {
  // Notes and labels are quoted in the generated blocks; keep the quotes
  // consistent and always safe by JSON-stringifying (valid YAML for scalars).
  return JSON.stringify(value);
}

function renderNode(node) {
  const lines = [`  - id: ${node.id}`];
  lines.push(`    label: ${yamlScalar(node.label)}`);
  lines.push(`    category: ${node.category}`);
  if (node.link) lines.push(`    link: ${yamlScalar(node.link)}`);
  if (node.note) lines.push(`    note: ${yamlScalar(node.note)}`);
  return lines;
}

function renderEdge(edge) {
  const lines = [`  - from: ${edge.from}`];
  lines.push(`    to: ${edge.to}`);
  lines.push(`    kind: ${edge.kind}`);
  lines.push(`    label: ${yamlScalar(edge.label)}`);
  return lines;
}

export function renderNodesBlock(marketNodes) {
  const lines = [NODES_START, "# Managed by scripts/update_morpho_graph_markets.mjs — do not edit."];
  for (const node of marketNodes) lines.push(...renderNode(node));
  lines.push(NODES_END);
  return lines;
}

export function renderEdgesBlock(edges) {
  const lines = [EDGES_START, "# Managed by scripts/update_morpho_graph_markets.mjs — do not edit."];
  for (const edge of edges) lines.push(...renderEdge(edge));
  lines.push(EDGES_END);
  return lines;
}

/** Replace content between two marker lines; returns null when absent. */
export function replaceManagedSection(text, start, end, blockLines) {
  const lines = text.split("\n");
  let startIdx = -1;
  let endIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === start) startIdx = i;
    if (startIdx !== -1 && lines[i].trim() === end) {
      endIdx = i;
      break;
    }
  }
  if (startIdx === -1 || endIdx === -1) return null;
  const replaced = [...lines.slice(0, startIdx), ...blockLines, ...lines.slice(endIdx + 1)];
  return replaced.join("\n");
}

function insertBlockBefore(lines, targetLine, blockLines) {
  const idx = lines.findIndex((l) => l.trim() === targetLine);
  if (idx === -1) throw new Error(`insertBlockBefore: target line ${JSON.stringify(targetLine)} not found`);
  let insert = [...blockLines];
  if (idx > 0 && lines[idx - 1].trim() !== "") insert = ["", ...insert];
  insert = [...insert, ""];
  return [...lines.slice(0, idx), ...insert, ...lines.slice(idx)].join("\n");
}

function appendBlockAtEnd(lines, blockLines) {
  let insert = [...blockLines];
  if (lines[lines.length - 1] !== "") insert = ["", ...insert];
  return [...lines, ...insert, ""].join("\n");
}

/**
 * Apply generated node/edge blocks to a graph file's text. Preserves every
 * byte outside the managed regions; a rerun with unchanged data is a no-op.
 */
export function applySections(text, marketNodes, edges) {
  const nodesBlock = renderNodesBlock(marketNodes);
  const edgesBlock = renderEdgesBlock(edges);

  let result = replaceManagedSection(text, NODES_START, NODES_END, nodesBlock);
  if (result === null) result = insertBlockBefore(text.split("\n"), "edges:", nodesBlock);

  const withNodes = result;
  result = replaceManagedSection(result, EDGES_START, EDGES_END, edgesBlock);
  if (result === null) result = appendBlockAtEnd(withNodes.split("\n"), edgesBlock);

  return result;
}

/* ---------------------------------------------------------------- API fetch */

export async function postGraphql(query, variables, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(MORPHO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (err) {
    throw new Error(`Morpho API request failed: ${err.message}`);
  }

  let text;
  try {
    text = await response.text();
  } catch (err) {
    throw new Error(`failed to read Morpho API response: ${err.message}`);
  }

  if (!response.ok)
    throw new Error(`Morpho API returned HTTP ${response.status}: ${truncate(text)}`);

  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Morpho API returned invalid JSON (HTTP ${response.status})`);
  }

  if (payload?.errors?.length)
    throw new Error(`Morpho GraphQL errors: ${JSON.stringify(payload.errors)}`);
  if (!payload?.data || typeof payload.data !== "object")
    throw new Error("Morpho GraphQL response contained no data");

  return payload.data;
}

function truncate(text) {
  const s = String(text ?? "");
  return s.length > 400 ? `${s.slice(0, 400)}…` : s;
}

const V1_QUERY = `
query MorphoV1Allocations($addresses: [String!]!, $chainIds: [Int!]!) {
  vaults(first: 50, where: { address_in: $addresses, chainId_in: $chainIds }) {
    items {
      address
      name
      chain { id }
      asset { symbol }
      state {
        totalAssets
        allocation {
          supplyAssets
          market {
            marketId
            lltv
            loanAsset { symbol }
            collateralAsset { symbol }
          }
        }
      }
    }
  }
}
`;

const V2_QUERY = `
query MorphoV2Allocations($addresses: [String!]!, $chainIds: [Int!]!) {
  vaultV2s(first: 10, where: { address_in: $addresses, chainId_in: $chainIds }) {
    items {
      address
      name
      chain { id }
      asset { symbol }
      totalAssets
      idleAssets
      adapters(first: 3) {
        items {
          address
          type
          ... on MorphoMarketV1Adapter {
            positions(first: 20) {
              items {
                state { supplyAssets }
                market {
                  marketId
                  lltv
                  loanAsset { symbol }
                  collateralAsset { symbol }
                }
              }
              pageInfo { countTotal count limit skip }
            }
          }
        }
        pageInfo { countTotal count limit skip }
      }
    }
  }
}
`;

function missingVaultError(version, chain, address) {
  return (
    `Morpho API returned no ${version === "v1" ? "vaults" : "vaultV2s"} entry for ` +
    `${address} on ${chain} — the address is not a Morpho Vault ${version === "v1" ? "V1" : "V2"} ` +
    `contract, or the morphoVault tag is wrong. Check the tag (and chain) on the node.`
  );
}

export function parseV1Items(items, queries, chain) {
  const expectedChainId = MORPHO_CHAIN_IDS[String(chain).toLowerCase()];
  const byAddress = new Map();
  for (const item of items ?? []) {
    const returnedChainId = item.chain?.id;
    if (
      expectedChainId !== undefined &&
      returnedChainId !== undefined &&
      Number(returnedChainId) !== expectedChainId
    )
      throw new Error(
        `Vault ${item.address} returned chain id ${returnedChainId}, expected ${expectedChainId} (${chain})`,
      );
    const addr = String(item.address).toLowerCase();
    const totalAssets = toBigInt(item.state?.totalAssets, `${addr} totalAssets`);
    const allocations = (item.state?.allocation ?? []).map((a) => ({
      supplyAssets: toBigInt(a.supplyAssets, `${addr} supplyAssets`),
      marketId: a.market?.marketId ?? null,
      lltv: a.market?.lltv ?? null,
      loanSymbol: a.market?.loanAsset?.symbol ?? null,
      collateralSymbol: a.market?.collateralAsset?.symbol ?? null,
    }));
    byAddress.set(addr, {
      version: "v1",
      chain,
      address: item.address,
      name: item.name || item.address,
      assetSymbol: item.asset?.symbol ?? "asset",
      totalAssets,
      allocations,
    });
  }
  for (const q of queries) {
    if (!byAddress.has(q.address.toLowerCase()))
      throw new Error(missingVaultError("v1", q.chain, q.address));
  }
  return byAddress;
}

export function parseV2Items(items, queries, chain) {
  const expectedChainId = MORPHO_CHAIN_IDS[String(chain).toLowerCase()];
  const byAddress = new Map();
  for (const item of items ?? []) {
    const returnedChainId = item.chain?.id;
    if (
      expectedChainId !== undefined &&
      returnedChainId !== undefined &&
      Number(returnedChainId) !== expectedChainId
    )
      throw new Error(
        `Vault V2 ${item.address} returned chain id ${returnedChainId}, expected ${expectedChainId} (${chain})`,
      );
    const addr = String(item.address).toLowerCase();
    const totalAssets = toBigInt(item.totalAssets, `${addr} totalAssets`);
    const idleAssets = toBigInt(item.idleAssets, `${addr} idleAssets`);
    const adapters = item.adapters ?? {};
    const adapterPage = adapters.pageInfo ?? {};
    if (adapterPage.count !== undefined && adapterPage.limit !== undefined && adapterPage.count >= adapterPage.limit)
      throw new Error(
        `Vault V2 ${item.address} returned ${adapterPage.count} adapters (page limit ${adapterPage.limit}); raise the limit or implement pagination`,
      );

    const allocations = [];
    for (const adapter of adapters.items ?? []) {
      const type = adapter.type;
      if (type !== "MorphoMarketV1Adapter" && type !== "MorphoMarketV1")
        throw new Error(
          `Vault V2 ${item.address} uses unsupported adapter ${JSON.stringify(type)} at ${adapter.address}`,
        );
      const positions = adapter.positions ?? {};
      const posPage = positions.pageInfo ?? {};
      if (posPage.count !== undefined && posPage.limit !== undefined && posPage.count >= posPage.limit)
        throw new Error(
          `Vault V2 ${item.address} adapter ${adapter.address} returned ${posPage.count} positions (page limit ${posPage.limit}); raise the limit or implement pagination`,
        );
      for (const position of positions.items ?? []) {
        allocations.push({
          supplyAssets: toBigInt(position.state?.supplyAssets, `${addr} position supplyAssets`),
          marketId: position.market?.marketId ?? null,
          lltv: position.market?.lltv ?? null,
          loanSymbol: position.market?.loanAsset?.symbol ?? null,
          collateralSymbol: position.market?.collateralAsset?.symbol ?? null,
        });
      }
    }

    if (idleAssets > 0n) {
      allocations.push({
        supplyAssets: idleAssets,
        marketId: null,
        lltv: null,
        loanSymbol: null,
        collateralSymbol: null,
      });
    }

    byAddress.set(addr, {
      version: "v2",
      chain,
      address: item.address,
      name: item.name || item.address,
      assetSymbol: item.asset?.symbol ?? "asset",
      totalAssets,
      allocations,
    });
  }
  for (const q of queries) {
    if (!byAddress.has(q.address.toLowerCase()))
      throw new Error(missingVaultError("v2", q.chain, q.address));
  }
  return byAddress;
}

function groupByChain(queries) {
  const grouped = new Map();
  for (const q of queries) {
    if (!grouped.has(q.chain)) grouped.set(q.chain, []);
    grouped.get(q.chain).push(q);
  }
  return grouped;
}

function batch(addresses, size) {
  const out = [];
  for (let i = 0; i < addresses.length; i += size) out.push(addresses.slice(i, i + size));
  return out;
}

export async function fetchV1(queries, fetchFn) {
  const result = new Map();
  for (const [chain, qs] of groupByChain(queries)) {
    const chainIds = [MORPHO_CHAIN_IDS[chain]];
    for (const chunk of batch(qs, 5)) {
      const addresses = chunk.map((q) => q.address.toLowerCase());
      const data = await postGraphql(V1_QUERY, { addresses, chainIds }, fetchFn);
      const parsed = parseV1Items(data.vaults?.items, chunk, chain);
      for (const [addr, vault] of parsed) result.set(`v1:${chain}:${addr}`, vault);
    }
  }
  return result;
}

export async function fetchV2(queries, fetchFn) {
  const result = new Map();
  for (const [chain, qs] of groupByChain(queries)) {
    const chainIds = [MORPHO_CHAIN_IDS[chain]];
    for (const chunk of batch(qs, 1)) {
      const addresses = chunk.map((q) => q.address.toLowerCase());
      const data = await postGraphql(V2_QUERY, { addresses, chainIds }, fetchFn);
      const parsed = parseV2Items(data.vaultV2s?.items, chunk, chain);
      for (const [addr, vault] of parsed) result.set(`v2:${chain}:${addr}`, vault);
    }
  }
  return result;
}

/* ------------------------------------------------------------------ driver */

function loadGraphs(slugs) {
  const files = fs.existsSync(GRAPH_DIR)
    ? fs.readdirSync(GRAPH_DIR).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    : [];
  const graphs = [];
  for (const file of files) {
    const slug = file.replace(/\.ya?ml$/, "");
    if (slugs && !slugs.includes(slug)) continue;
    const text = fs.readFileSync(path.join(GRAPH_DIR, file), "utf-8");
    const graph = yaml.load(text);
    graphs.push({ slug, file, text, graph });
  }
  if (slugs) {
    const found = new Set(graphs.map((g) => g.slug));
    for (const slug of slugs) {
      if (!found.has(slug))
        throw new Error(`no graph file found for slug '${slug}'`);
    }
  }
  return graphs;
}

function usage() {
  return [
    "Usage: node scripts/update_morpho_graph_markets.mjs [--write] [--graph <slug>]...",
    "",
    "  --write         apply generated sections (default: check-only, exit 1 if stale)",
    "  --graph <slug>  restrict to one graph (repeatable); default: all graphs",
  ].join("\n");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(usage());
    return;
  }
  const write = argv.includes("--write");
  const slugs = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--write") continue;
    if (argv[i] === "--graph") {
      if (!argv[i + 1]) {
        console.error(`--graph requires a slug argument\n\n${usage()}`);
        process.exit(2);
      }
      slugs.push(argv[i + 1]);
      i++;
    } else if (argv[i].startsWith("--")) {
      console.error(`unknown option '${argv[i]}'\n\n${usage()}`);
      process.exit(2);
    }
  }

  const graphs = loadGraphs(slugs.length ? slugs : null);
  const { occurrences, queries } = findMorphoVaults(graphs);
  if (queries.length === 0) {
    console.log("No nodes tagged morphoVault in the selected graphs — nothing to do.");
    return;
  }
  console.log(`Found ${occurrences.length} tagged vault occurrence(s), ${queries.length} unique vault query(ies).`);

  const v1 = queries.filter((q) => q.version === "v1");
  const v2 = queries.filter((q) => q.version === "v2");
  const allocByKey = new Map();
  if (v1.length) {
    const fetched = await fetchV1(v1, fetch);
    for (const [k, v] of fetched) allocByKey.set(k, v);
  }
  if (v2.length) {
    const fetched = await fetchV2(v2, fetch);
    for (const [k, v] of fetched) allocByKey.set(k, v);
  }

  const bySlug = new Map();
  for (const occ of occurrences) {
    if (!bySlug.has(occ.slug)) bySlug.set(occ.slug, []);
    bySlug.get(occ.slug).push(occ);
  }

  // Phase 1: compute every resulting graph in memory. Any failure here throws
  // before a single file is touched, so `--write` is all-or-nothing.
  const results = [];
  for (const { slug, text } of graphs) {
    const occ = bySlug.get(slug);
    if (!occ) continue;
    const { marketNodes, edges } = buildGraphSections(
      { slug, ...(yaml.load(text)) },
      occ,
      allocByKey,
    );
    const next = applySections(text, marketNodes, edges);
    results.push({ slug, next, dirty: next !== text, marketNodes, edges });
  }

  // Phase 2: report, and only after every graph has been computed, write.
  let changed = 0;
  let unchanged = 0;
  for (const r of results) {
    if (!r.dirty) {
      unchanged++;
      console.log(`  [unchanged] ${r.slug} (${r.marketNodes.length} market nodes, ${r.edges.length} edges)`);
    } else if (write) {
      changed++;
      console.log(`  [written  ] ${r.slug} (${r.marketNodes.length} market nodes, ${r.edges.length} edges)`);
    } else {
      changed++;
      console.log(`  [stale    ] ${r.slug} (${r.marketNodes.length} market nodes, ${r.edges.length} edges)`);
    }
  }

  if (write) {
    for (const r of results) {
      if (r.dirty) fs.writeFileSync(path.join(GRAPH_DIR, `${r.slug}.yaml`), r.next);
    }
  }

  if (!write) {
    if (changed > 0) {
      console.error(`\n${changed} graph(s) have stale generated Morpho market sections. Re-run with --write to update.`);
      process.exit(1);
    }
    console.log(`\nAll ${unchanged} graph(s) up to date.`);
    return;
  }
  console.log(`\nUpdated ${changed} graph(s); ${unchanged} unchanged.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error(`[update-morpho-graph-markets] ${err.message}`);
    process.exit(1);
  });
}
