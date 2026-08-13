import { test } from "node:test";
import assert from "node:assert/strict";

import { findGraphIssues } from "../scripts/check_graphs.mjs";
import {
  allocationLabel,
  applySections,
  buildAllocations,
  buildGraphSections,
  fetchV1,
  fetchV2,
  findMorphoVaults,
  formatLltv,
  marketNodeId,
  morphoMarketUrl,
  parseV1Items,
  parseV2Items,
  postGraphql,
} from "../scripts/update_morpho_graph_markets.mjs";

const REPORTS = new Set(["demo", "infinifi"]);

/* ------------------------------------------------------------ fixtures */

function graph(overrides = {}) {
  return {
    slug: "demo",
    chain: "ethereum",
    categories: [
      { id: "vault", label: "Vault" },
      { id: "strategy", label: "Strategy" },
      { id: "dependency", label: "Dependency" },
    ],
    nodes: [
      { id: "vault", label: "Demo Vault", category: "vault", address: "0xAAA" },
      { id: "morpho-vault", label: "Yearn USDC", category: "strategy", address: "0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3", morphoVault: "v1" },
    ],
    edges: [{ from: "vault", to: "morpho-vault", kind: "allocates-to", label: "10%" }],
    ...overrides,
  };
}

/** A valid 32-byte (64-hex) market id from a short hex prefix. */
function mid(hex) {
  return `0x${hex.padEnd(64, "0")}`;
}

/** A parsed allocation entry, in the shape the generator consumes. */
function alloc(supply, marketId, lltv, collateral, loan) {
  return {
    supplyAssets: BigInt(supply),
    marketId,
    lltv,
    loanSymbol: loan,
    collateralSymbol: collateral,
  };
}

function vaultData(overrides = {}) {
  return {
    version: "v1",
    chain: "ethereum",
    address: "0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3",
    name: "Yearn USDC",
    assetSymbol: "USDC",
    totalAssets: 1000n,
    allocations: [],
    ...overrides,
  };
}

/* --------------------------------------------------------- validation */

test("findGraphIssues flags invalid morphoVault value", () => {
  const g = graph();
  g.nodes[1].morphoVault = "v3";
  const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
  assert.ok(issues.some((i) => i.level === "error" && /invalid morphoVault/.test(i.message)));
});

test("findGraphIssues flags morphoVault without an address", () => {
  const g = graph();
  delete g.nodes[1].address;
  const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
  assert.ok(issues.some((i) => i.level === "error" && /has no address/.test(i.message)));
});

test("findGraphIssues accepts v1 and v2 tags", () => {
  for (const version of ["v1", "v2"]) {
    const g = graph();
    g.nodes[1].morphoVault = version;
    const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
    assert.ok(!issues.some((i) => /morphoVault/.test(i.message)), `tag ${version} should pass`);
  }
});

test("findGraphIssues flags morphoVault on an unsupported chain", () => {
  const g = graph();
  g.nodes[1].chain = "polygon";
  const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
  assert.ok(issues.some((i) => i.level === "error" && /unsupported chain 'polygon'/.test(i.message)));
});

test("findGraphIssues flags a generated market node carrying morphoVault", () => {
  const g = graph();
  g.nodes.push({ id: "morpho-market-64d65c9a2d91", label: "x", category: "dependency", address: "0xAAA", morphoVault: "v1" });
  const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
  assert.ok(issues.some((i) => i.level === "error" && /must not carry morphoVault/.test(i.message)));
});

test("findGraphIssues flags a non-https link", () => {
  const g = graph();
  g.nodes[1].link = "http://app.morpho.org/market/x/";
  const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
  assert.ok(issues.some((i) => i.level === "error" && /non-https link/.test(i.message)));
});

test("findGraphIssues accepts an https link", () => {
  const g = graph();
  g.nodes[1].link = "https://app.morpho.org/ethereum/market/x/";
  const issues = findGraphIssues([{ slug: "demo", graph: g }], REPORTS);
  assert.ok(!issues.some((i) => /link/.test(i.message)));
});

/* ----------------------------------------------------------- discovery */

test("only explicitly tagged nodes are discovered", () => {
  const g = graph();
  // Untagged node whose label, id and address all look Morpho-y.
  g.nodes.push({ id: "steakhouse-meta", label: "Steakhouse MetaMorpho", category: "dependency", address: "0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9" });
  const { occurrences, queries } = findMorphoVaults([{ slug: "demo", graph: g }]);
  assert.equal(occurrences.length, 1);
  assert.equal(queries.length, 1);
  assert.equal(occurrences[0].nodeId, "morpho-vault");
});

test("the same vault referenced by two graphs yields one query", () => {
  const a = graph();
  const b = graph({ slug: "other" });
  const { occurrences, queries } = findMorphoVaults([
    { slug: "demo", graph: a },
    { slug: "other", graph: b },
  ]);
  assert.equal(occurrences.length, 2);
  assert.equal(queries.length, 1);
  assert.equal(queries[0].address, "0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3");
});

test("a tagged Morpho vault in a non-Yearn graph is discovered", () => {
  const g = graph({
    slug: "infinifi",
    nodes: [
      { id: "siUSD", label: "siUSD", category: "vault", address: "0xAAA" },
      { id: "dep-steakhouse-vault", label: "Steakhouse infiniFi USDC", category: "dependency", address: "0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9", morphoVault: "v1" },
    ],
    edges: [],
  });
  const { occurrences, queries } = findMorphoVaults([{ slug: "infinifi", graph: g }]);
  assert.equal(occurrences.length, 1);
  assert.equal(occurrences[0].slug, "infinifi");
  assert.equal(queries[0].address, "0xBEEF1f5bD88285E5b239B6AACB991D38CCa23aC9");
});

/* -------------------------------------------------------- percentages */

test("allocationLabel computes an exact BigInt percentage", () => {
  // 56.4% of 1000
  assert.equal(allocationLabel(564n, 1000n), "56.4%");
  // 36.9%
  assert.equal(allocationLabel(369n, 1000n), "36.9%");
  // 6.7%
  assert.equal(allocationLabel(67n, 1000n), "6.7%");
  // 100%
  assert.equal(allocationLabel(1000n, 1000n), "100.0%");
});

test("allocationLabel returns null for zero supply", () => {
  assert.equal(allocationLabel(0n, 1000n), null);
});

test("allocationLabel labels tiny positive shares <0.1%", () => {
  assert.equal(allocationLabel(1n, 10000n), "<0.1%");
  assert.equal(allocationLabel(9n, 10000n), "<0.1%");
});

test("formatLltv renders WAD LLTV with trimming", () => {
  assert.equal(formatLltv("860000000000000000"), "86%");
  assert.equal(formatLltv("945000000000000000"), "94.5%");
  assert.equal(formatLltv("965000000000000000"), "96.5%");
  assert.equal(formatLltv(0), "0%");
});

/* ---------------------------------------------------------- allocation */

test("zero allocations are omitted; tiny ones kept", () => {
  const v = vaultData({
    totalAssets: 1000000n,
    allocations: [
      alloc(0, mid("aaaa"), "860000000000000000", "cbBTC", "USDC"),
      alloc(5, mid("bbbb"), "860000000000000000", "WBTC", "USDC"),
      alloc(999995, mid("cccc"), "860000000000000000", "wstETH", "USDC"),
    ],
  });
  const used = new Set();
  const items = buildAllocations(v, used);
  assert.equal(items.length, 2);
  assert.ok(items.some((i) => i.pct === "<0.1%"));
  assert.ok(!items.some((i) => i.marketId === mid("aaaa")));
});

test("same pair with different LLTVs produces distinct labels", () => {
  const v = vaultData({
    totalAssets: 1000n,
    allocations: [
      alloc(500, mid("a1a1"), "945000000000000000", "wstETH", "WETH"),
      alloc(500, mid("b2b2"), "965000000000000000", "wstETH", "WETH"),
    ],
  });
  const items = buildAllocations(v, new Set());
  assert.equal(items.length, 2);
  assert.equal(items[0].label, "wstETH/WETH · 94.5% LLTV");
  assert.equal(items[1].label, "wstETH/WETH · 96.5% LLTV");
});

test("same pair and LLTV keeps a simple label (no market-id suffix)", () => {
  const v = vaultData({
    totalAssets: 1000n,
    allocations: [
      alloc(600, "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64", "860000000000000000", "cbBTC", "USDC"),
      alloc(400, "0xbc99de6a88904cd0e69042ad6f266e63182801f030c636507c3caf590ffd84fe", "860000000000000000", "cbBTC", "USDC"),
    ],
  });
  const items = buildAllocations(v, new Set());
  assert.equal(items.length, 2);
  // Labels stay name + LLTV only; the full market id remains in `note`/`link`.
  assert.equal(items[0].label, "cbBTC/USDC · 86% LLTV");
  assert.equal(items[1].label, "cbBTC/USDC · 86% LLTV");
  assert.ok(items[0].note.includes("0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64"));
  assert.ok(items[1].note.includes("0xbc99de6a88904cd0e69042ad6f266e63182801f030c636507c3caf590ffd84fe"));
});

test("positive idle assets become a synthetic Idle node", () => {
  const v = vaultData({
    totalAssets: 1000n,
    allocations: [
      alloc(820, null, null, null, null), // idle (collateral null)
      alloc(180, "0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549", "945000000000000000", "LBTC", "WBTC"),
    ],
  });
  const items = buildAllocations(v, new Set());
  const idle = items.find((i) => i.marketId === null);
  assert.ok(idle, "idle node should exist");
  assert.equal(idle.label, "Idle USDC");
  assert.equal(idle.link, null);
  assert.equal(idle.pct, "82.0%");
});

test("markets sort by allocation descending then market id", () => {
  const v = vaultData({
    totalAssets: 1000n,
    allocations: [
      alloc(100, mid("eeee"), "860000000000000000", "A", "USDC"),
      alloc(700, mid("aaaa"), "860000000000000000", "B", "USDC"),
      alloc(700, mid("bbbb"), "860000000000000000", "C", "USDC"),
    ],
  });
  const items = buildAllocations(v, new Set());
  assert.deepEqual(
    items.map((i) => i.supplyAssets),
    [700n, 700n, 100n],
  );
  assert.equal(items[0].marketId, mid("aaaa"));
  assert.equal(items[1].marketId, mid("bbbb"));
});

test("marketNodeId detects and resolves collisions", () => {
  const marketId = "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64";
  const used = new Set(["morpho-market-64d65c9a2d91"]);
  assert.equal(marketNodeId(marketId, used), "morpho-market-64d65c9a2d91c");
});

test("morphoMarketUrl builds the full market link", () => {
  assert.equal(
    morphoMarketUrl("ethereum", "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64"),
    "https://app.morpho.org/ethereum/market/0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64/",
  );
  assert.throws(() => morphoMarketUrl("polygon", "0xaaa"));
});

/* ---------------------------------------------------------- V2 parsing */

test("parseV2Items parses direct MorphoMarketV1Adapter positions", () => {
  const items = [
    {
      address: "0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0",
      name: "Gauntlet USDC Prime",
      asset: { symbol: "USDC" },
      totalAssets: 70669397774691,
      idleAssets: 0,
      adapters: {
        items: [
          {
            address: "0xDF62f57Ea333a842Db200d4892c90F98204fa22F",
            type: "MorphoMarketV1",
            positions: {
              items: [
                {
                  state: { supplyAssets: 1328046542738 },
                  market: {
                    marketId: "0x7e585a933ffe8443c371b4f8cfeb4430f5f6a14c2f32a898c26662c67a1cb8b8",
                    lltv: "860000000000000000",
                    loanAsset: { symbol: "USDC" },
                    collateralAsset: { symbol: "wstETH" },
                  },
                },
              ],
              pageInfo: { countTotal: 1, count: 1, limit: 20, skip: 0 },
            },
          },
        ],
        pageInfo: { countTotal: 1, count: 1, limit: 3, skip: 0 },
      },
    },
  ];
  const parsed = parseV2Items(items, [{ version: "v2", chain: "ethereum", address: "0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0" }], "ethereum");
  const vault = parsed.get("0x8c106eedad96553e64287a5a6839c3cc78afa3d0");
  assert.equal(vault.version, "v2");
  assert.equal(vault.allocations.length, 1);
  assert.equal(vault.allocations[0].collateralSymbol, "wstETH");
});

test("parseV2Items fails on unsupported (nested) adapter", () => {
  const items = [
    {
      address: "0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960",
      name: "OUSD Vault V2",
      asset: { symbol: "USDC" },
      totalAssets: 100,
      idleAssets: 0,
      adapters: {
        items: [
          { address: "0xD8F093dCE8504F10Ac798A978eF9E0C230B2f5fF", type: "MetaMorpho" },
        ],
        pageInfo: { countTotal: 1, count: 1, limit: 3, skip: 0 },
      },
    },
  ];
  assert.throws(
    () => parseV2Items(items, [{ version: "v2", chain: "ethereum", address: "0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960" }], "ethereum"),
    /unsupported adapter "MetaMorpho".*0xD8F093dCE8504F10Ac798A978eF9E0C230B2f5fF/,
  );
});

test("parseV2Items fails on a full adapter page (pagination ceiling)", () => {
  const items = [
    {
      address: "0xAAA",
      name: "Vault",
      asset: { symbol: "USDC" },
      totalAssets: 100,
      idleAssets: 0,
      adapters: {
        items: [{ address: "0xBBB", type: "MorphoMarketV1" }],
        pageInfo: { countTotal: 5, count: 3, limit: 3, skip: 0 },
      },
    },
  ];
  assert.throws(
    () => parseV2Items(items, [{ version: "v2", chain: "ethereum", address: "0xAAA" }], "ethereum"),
    /raise the limit or implement pagination/,
  );
});

test("parseV1Items fails with an actionable message on missing address", () => {
  assert.throws(
    () => parseV1Items([], [{ version: "v1", chain: "ethereum", address: "0xAAA" }], "ethereum"),
    /not a Morpho Vault V1.*Check the tag/s,
  );
});

test("parseV2Items fails with an actionable message on missing address", () => {
  assert.throws(
    () => parseV2Items([], [{ version: "v2", chain: "ethereum", address: "0xAAA" }], "ethereum"),
    /not a Morpho Vault V2.*Check the tag/s,
  );
});

/* ------------------------------------------------------- GraphQL errors */

test("postGraphql raises on non-2xx responses", async () => {
  const bad = async () => ({ ok: false, status: 500, text: async () => "boom" });
  await assert.rejects(() => postGraphql("q", {}, bad), /HTTP 500/);
});

test("postGraphql raises on invalid JSON", async () => {
  const bad = async () => ({ ok: true, status: 200, text: async () => "not json" });
  await assert.rejects(() => postGraphql("q", {}, bad), /invalid JSON/);
});

test("postGraphql raises on GraphQL errors", async () => {
  const bad = async () => ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify({ errors: [{ message: "nope" }], data: null }),
  });
  await assert.rejects(() => postGraphql("q", {}, bad), /GraphQL errors/);
});

test("postGraphql raises on missing data", async () => {
  const bad = async () => ({ ok: true, status: 200, text: async () => JSON.stringify({}) });
  await assert.rejects(() => postGraphql("q", {}, bad), /no data/);
});

test("fetchV1 and fetchV2 are offline-testable via injected fetch", async () => {
  // A minimal fake covering the V1 path (batching, lowercase addresses).
  const calls = [];
  const fake = async (url, init) => {
    calls.push(JSON.parse(init.body).variables.addresses);
    return {
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          data: {
            vaults: {
              items: [
                {
                  address: "0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3",
                  name: "Yearn USDC",
                  chain: { id: 1 },
                  asset: { symbol: "USDC" },
                  state: { totalAssets: 1000, allocation: [] },
                },
              ],
            },
          },
        }),
    };
  };
  const result = await fetchV1([{ version: "v1", chain: "ethereum", address: "0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3" }], fake);
  assert.equal(calls[0][0], "0x68aea7b82df6ccdf76235d46445ed83f85f845a3");
  assert.ok(result.has("v1:ethereum:0x68aea7b82df6ccdf76235d46445ed83f85f845a3"));
});

/* ---------------------------------------------------- marker manipulation */

const TEXT = `slug: demo
chain: ethereum
nodes:
  - id: vault
    label: Vault
    category: vault

edges:
  - from: vault
    to: morpho-vault
    kind: allocates-to
`;

test("applySections inserts marker blocks and preserves surrounding bytes", () => {
  const nodes = [
    { id: "morpho-market-64d65c9a2d91", label: "cbBTC/USDC · 86% LLTV", category: "dependency", link: "https://app.morpho.org/ethereum/market/x/", note: "Morpho market x used by Yearn USDC" },
  ];
  const edges = [{ from: "morpho-vault", to: "morpho-market-64d65c9a2d91", kind: "deposits-into", label: "56.4%" }];
  const next = applySections(TEXT, nodes, edges);

  assert.ok(next.includes("# BEGIN GENERATED MORPHO MARKET NODES"));
  assert.ok(next.includes("# BEGIN GENERATED MORPHO MARKET EDGES"));
  // Byte-preservation outside the markers.
  assert.ok(next.startsWith("slug: demo\nchain: ethereum\nnodes:\n  - id: vault\n"));
  assert.ok(next.includes("  - from: vault\n    to: morpho-vault\n    kind: allocates-to\n"));
});

test("applySections is idempotent on a second run", () => {
  const nodes = [
    { id: "morpho-market-64d65c9a2d91", label: "cbBTC/USDC · 86% LLTV", category: "dependency", link: "https://app.morpho.org/ethereum/market/x/", note: "Morpho market x used by Yearn USDC" },
  ];
  const edges = [{ from: "morpho-vault", to: "morpho-market-64d65c9a2d91", kind: "deposits-into", label: "56.4%" }];
  const once = applySections(TEXT, nodes, edges);
  const twice = applySections(once, nodes, edges);
  assert.equal(twice, once);
});

test("buildGraphSections ignores previous generated nodes when deriving ids", () => {
  // Simulate a graph that already contains a generated node from a prior run.
  const g = graph();
  g.nodes.push({ id: "morpho-market-64d65c9a2d91", label: "stale", category: "dependency", link: "https://x/", note: "stale" });
  const occ = [{ slug: "demo", nodeId: "morpho-vault", version: "v1", chain: "ethereum", address: "0x68Aea7b82Df6CcdF76235D46445Ed83f85F845A3", nodeLabel: "Yearn USDC" }];
  const allocByKey = new Map([
    [
      "v1:ethereum:0x68aea7b82df6ccdf76235d46445ed83f85f845a3",
      vaultData({
        totalAssets: 1000n,
        allocations: [alloc(1000, "0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64", "860000000000000000", "cbBTC", "USDC")],
      }),
    ],
  ]);
  const { marketNodes } = buildGraphSections(g, occ, allocByKey);
  // Stable, not shifted by the stale generated node.
  assert.equal(marketNodes[0].id, "morpho-market-64d65c9a2d91");
});
