import { test } from "node:test";
import assert from "node:assert/strict";

import { getUpstreamPath } from "../worker/monitoring.ts";

const upstream = (path) => getUpstreamPath(new URL(`http://localhost${path}`));

test("monitoring maps allowed routes and params upstream", () => {
  const cases = {
    "/api/monitoring/protocols": "/v1/protocols",
    "/api/monitoring/protocols/": "/v1/protocols",
    "/api/monitoring/alerts": "/v1/alerts",
    "/api/monitoring/alerts/5021": "/v1/alerts/5021",
    "/api/monitoring/alerts?protocol=aave&severity=HIGH&limit=5": "/v1/alerts?protocol=aave&severity=HIGH&limit=5",
    "/api/monitoring/alerts?cursor=5021&limit=100": "/v1/alerts?cursor=5021&limit=100",
  };
  for (const [path, expected] of Object.entries(cases)) {
    const result = upstream(path);
    const actual = new URL(result.path, 'https://upstream');
    const wanted = new URL(expected, 'https://upstream');
    actual.searchParams.sort();
    wanted.searchParams.sort();
    assert.equal(actual.href, wanted.href, path);
  }
});

test("monitoring rejects anything outside the allowlist", () => {
  const cases = {
    "/api/monitoring/alerts?path=alerts": [400, "unsupported query param: path"],
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
