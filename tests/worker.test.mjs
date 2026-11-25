import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../worker.ts";

const VAULT = "0x00000000000000000000000000000000000000aa";
const FILES = {
  "/reports/index.html": { body: "<html>reports</html>", type: "text/html" },
  "/cdn/vaults/1.json": { body: JSON.stringify({ [VAULT]: { riskLevel: 2 } }), type: "application/json" },
};

function assets() {
  const seen = [];
  return {
    seen,
    async fetch(input, init) {
      const req = new Request(input, init);
      seen.push(req);
      if (req.method !== "GET") return new Response(null, { status: 405 });
      const file = FILES[new URL(req.url).pathname];
      if (!file) return new Response(null, { status: 404 });
      const headers = { "content-type": file.type, etag: '"abc"' };
      if (req.headers.get("if-none-match") === '"abc"') return new Response(null, { status: 304, headers });
      return new Response(file.body, { headers });
    },
  };
}

async function call(path, init) {
  const env = { ASSETS: assets() };
  const res = await worker.fetch(new Request(`https://curation.yearn.fi${path}`, init), env, { waitUntil() {} });
  return { res, body: await res.text(), seen: env.ASSETS.seen.map((r) => new URL(r.url).pathname) };
}

test("clean page URLs serve index.html with and without a trailing slash", async () => {
  for (const path of ["/reports", "/reports/"]) {
    const { res, body, seen } = await call(path);
    assert.equal(res.status, 200, path);
    assert.equal(body, "<html>reports</html>");
    assert.deepEqual(seen, ["/reports/index.html"]);
    assert.equal(res.headers.get("access-control-allow-origin"), "*");
  }
});

test("body-less asset errors get a status text body and CORS", async () => {
  const missing = await call("/nope");
  assert.equal(missing.res.status, 404);
  assert.equal(missing.body, "Not Found");
  assert.equal(missing.res.headers.get("access-control-allow-origin"), "*");

  const post = await call("/reports", { method: "POST" });
  assert.equal(post.res.status, 405);
  assert.equal(post.body, "Method Not Allowed");
});

test("cdn preflight answers 204 without reading assets", async () => {
  const { res, seen } = await call("/cdn/vaults/1.json", { method: "OPTIONS" });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.deepEqual(seen, []);
});

test("cdn files come from assets and keep conditional requests", async () => {
  for (const path of ["/cdn/vaults/1.json", "/api/cdn/vaults/1.json", "/api/cdn/x?schema=vaults&file=1.json"]) {
    const { res, seen } = await call(path);
    assert.equal(res.status, 200, path);
    assert.equal(res.headers.get("etag"), '"abc"');
    assert.deepEqual(seen, ["/cdn/vaults/1.json"]);
  }
  const cached = await call("/cdn/vaults/1.json", { headers: { "if-none-match": '"abc"' } });
  assert.equal(cached.res.status, 304);
});

test("cdn single-vault lookups extract the vault case-insensitively", async () => {
  const hit = await call(`/cdn/vaults/1/${VAULT.toUpperCase().replace("0X", "0x")}.json`);
  assert.equal(hit.res.status, 200);
  assert.deepEqual(JSON.parse(hit.body), { riskLevel: 2 });

  const miss = await call(`/cdn/vaults/1/0x${"b".repeat(40)}.json`);
  assert.equal(miss.res.status, 404);
  assert.equal(miss.body, "vault not found");
});

test("plausible proxy forwards to plausible.io without cookies", async (t) => {
  let forwarded;
  t.mock.method(globalThis, "fetch", async (req) => {
    forwarded = req;
    return new Response("ok");
  });
  const { res } = await call("/proxy/plausible/js/script.js?x=1", { headers: { cookie: "a=b" } });
  assert.equal(res.status, 200);
  assert.equal(forwarded.url, "https://plausible.io/js/script.js?x=1");
  assert.equal(forwarded.headers.get("cookie"), null);
});
