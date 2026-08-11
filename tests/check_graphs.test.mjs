import { test } from "node:test";
import assert from "node:assert/strict";

import { findGraphIssues } from "../scripts/check_graphs.mjs";

const REPORTS = new Set(["demo"]);

/** Minimal well-formed graph; individual tests mutate a copy. */
function baseGraph(overrides = {}) {
  return {
    slug: "demo",
    chain: "ethereum",
    categories: [{ id: "vault", label: "Vault" }],
    nodes: [
      { id: "vault", label: "Demo Vault", category: "vault", address: "0xAAA" },
      { id: "gov", label: "Multisig", category: "vault", address: "0xBBB" },
    ],
    edges: [{ from: "gov", to: "vault", kind: "holds-role", label: "ADMIN" }],
    ...overrides,
  };
}

const run = (graph, reports = REPORTS) =>
  findGraphIssues([{ slug: "demo", graph }], reports);

test("a well-formed graph produces no issues", () => {
  assert.deepEqual(run(baseGraph()), []);
});

test("missing report is an error", () => {
  const issues = run(baseGraph(), new Set());
  assert.equal(issues.length, 1);
  assert.equal(issues[0].level, "error");
  assert.match(issues[0].message, /no matching report/);
});

test("slug mismatch is an error", () => {
  const issues = run(baseGraph({ slug: "other" }));
  assert.ok(issues.some((i) => i.level === "error" && /does not match the filename/.test(i.message)));
});

test("no addressed vault node is an error", () => {
  const g = baseGraph();
  g.nodes = g.nodes.map((n) => ({ ...n, address: undefined }));
  const issues = run(g);
  assert.ok(issues.some((i) => i.level === "error" && /never be cross-linked/.test(i.message)));
});

test("unknown chain is an error, at graph and node level", () => {
  assert.ok(
    run(baseGraph({ chain: "solana" })).some(
      (i) => i.level === "error" && /unknown chain 'solana'/.test(i.message),
    ),
  );
  const g = baseGraph();
  g.nodes[1].chain = "fantom";
  assert.ok(run(g).some((i) => /unknown chain 'fantom'/.test(i.message)));
});

test("known chains pass, case-insensitively", () => {
  assert.deepEqual(run(baseGraph({ chain: "HyperEVM" })), []);
});

test("duplicate address within a graph warns", () => {
  const g = baseGraph();
  g.nodes[1].address = "0xaaa"; // same as vault, different case
  const issues = run(g);
  assert.ok(issues.some((i) => i.level === "warn" && /share address/.test(i.message)));
});

test("the same address on different chains does not warn", () => {
  const g = baseGraph();
  g.nodes[1].address = "0xAAA";
  g.nodes[1].chain = "base";
  assert.ok(!run(g).some((i) => /share address/.test(i.message)));
});

for (const kind of ["mints", "holds-role", "proposes-on", "cancels-on"]) {
  test(`${kind} without a label warns`, () => {
    const g = baseGraph();
    g.edges = [{ from: "gov", to: "vault", kind }];
    const issues = run(g);
    assert.ok(issues.some((i) => i.level === "warn" && /has no label/.test(i.message)));
  });
}

test("kinds where a label adds nothing are not required to have one", () => {
  for (const kind of ["controls", "manages", "deploys", "routes-fees-to", "routes-through"]) {
    const g = baseGraph();
    g.edges = [{ from: "gov", to: "vault", kind }];
    assert.deepEqual(run(g), [], `${kind} should not require a label`);
  }
});

test("allocates-to is never required to carry a percentage", () => {
  // Several protocols express allocation in dollars or qualitatively because
  // their reports do; flagging those would invite invented numbers.
  for (const label of ["~$48.9M USDC", "Deribit margin", "curator allocation", undefined]) {
    const g = baseGraph();
    g.edges = [{ from: "vault", to: "gov", kind: "allocates-to", label }];
    assert.deepEqual(run(g), [], `allocates-to labelled ${String(label)} should pass`);
  }
});

test("an unconnected node warns", () => {
  const g = baseGraph();
  g.nodes.push({ id: "orphan", label: "Orphan Safe", category: "vault", address: "0xCCC" });
  const issues = run(g);
  assert.ok(issues.some((i) => i.level === "warn" && /'orphan'.*has no edges/.test(i.message)));
});

test("issues from several graphs are reported together", () => {
  const issues = findGraphIssues(
    [
      { slug: "demo", graph: baseGraph() },
      { slug: "demo", graph: baseGraph({ chain: "solana" }) },
    ],
    REPORTS,
  );
  assert.equal(issues.length, 1);
});
