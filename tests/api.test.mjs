import { test } from "node:test";
import assert from "node:assert/strict";

import { getPath } from "../api/cdn.ts";
import { getUpstreamPath } from "../api/monitoring.ts";

const VAULT = "0xb9228370e2fa4908fc2bf559a50bb77ba66fdd66";
const MIXED = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12";

const cdn = (path) => getPath(new URL(`http://localhost${path}`));
const upstream = (path) => getUpstreamPath(new URL(`http://localhost${path}`));

test("cdn resolves query params, then /api/cdn/ and /cdn/ prefixes", () => {
  assert.deepEqual(cdn("/api/cdn?schema=vaults&file=1.json"), { type: "direct", path: "vaults/1.json" });
  assert.deepEqual(cdn("/api/cdn/ignored?schema=vaults&file=1.json"), { type: "direct", path: "vaults/1.json" });
  assert.deepEqual(cdn("/api/cdn/vaults/42161.json"), { type: "direct", path: "vaults/42161.json" });
  assert.deepEqual(cdn("/cdn/asset/ETHplus.md"), { type: "direct", path: "asset/ETHplus.md" });
});

test("cdn rejects unknown paths and partial query params", () => {
  assert.equal(cdn("/other/path"), undefined);
  assert.equal(cdn("/api/cdn?schema=vaults"), undefined);
  assert.equal(cdn("/cdn?file=1.json"), undefined);
});

test("cdn detects single-vault paths and lowercases the address", () => {
  assert.deepEqual(cdn(`/api/cdn/vaults/1/${VAULT}.json`), {
    type: "single-vault",
    chainId: "1",
    address: VAULT,
    path: "vaults/1.json",
  });
  assert.deepEqual(cdn(`/cdn/vaults/137/${MIXED}.json`), {
    type: "single-vault",
    chainId: "137",
    address: MIXED.toLowerCase(),
    path: "vaults/137.json",
  });
});

test("cdn treats malformed single-vault paths as direct files", () => {
  for (const file of ["invalid-address.json", "0xabc.json", `${VAULT}.txt`]) {
    assert.deepEqual(cdn(`/api/cdn/vaults/1/${file}`), { type: "direct", path: `vaults/1/${file}` });
  }
});

test("monitoring maps allowed routes and params upstream", () => {
  const cases = {
    "/api/monitoring/protocols": "/v1/protocols",
    "/api/monitoring/protocols/": "/v1/protocols",
    "/api/monitoring/alerts": "/v1/alerts",
    "/api/monitoring/alerts/5021": "/v1/alerts/5021",
    "/api/monitoring/alerts?protocol=aave&severity=HIGH&limit=5": "/v1/alerts?protocol=aave&severity=HIGH&limit=5",
    "/api/monitoring/alerts?cursor=5021&limit=100": "/v1/alerts?cursor=5021&limit=100",
    // Vercel's /api/monitoring/:path* rewrite appends ?path=alerts to the destination.
    "/api/monitoring/alerts?path=alerts&protocol=aave&limit=5": "/v1/alerts?protocol=aave&limit=5",
  };
  for (const [path, expected] of Object.entries(cases)) {
    assert.deepEqual(upstream(path), { path: expected }, path);
  }
});

test("monitoring rejects anything outside the allowlist", () => {
  const cases = {
    "/api/monitoring/alerts?protocol=aave&evil=1": [400, "unsupported query param: evil"],
    "/api/monitoring/alerts?severity=URGENT": [400, "invalid severity"],
    "/api/monitoring/alerts?limit=abc": [400, "invalid limit"],
    "/api/monitoring/alerts?protocol=../../etc": [400, "invalid protocol"],
    "/api/monitoring/secrets": [404, "not found"],
    "/api/monitoring/alerts/not-a-number": [404, "not found"],
    "/api/other": [400, "bad path"],
  };
  for (const [path, [status, error]] of Object.entries(cases)) {
    assert.deepEqual(upstream(path), { error, status }, path);
  }
});
