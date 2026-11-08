import { test } from 'node:test';
import assert from 'node:assert/strict';
import cdn from '../worker/cdn.ts';
import monitoring from '../worker/monitoring.ts';
import plausible from '../worker/plausible.ts';
import worker from '../worker/index.ts';
import { validateVaults } from '../scripts/build_worker.mjs';
import { readBounded, withTimeout } from '../worker/http.ts';

const address = '0xabcdef1234567890abcdef1234567890abcdef12';
const data = { [address]: { riskLevel: 2, riskScore: { comment: 'test', complexity: 1 } } };
const env = {
  ENVIRONMENT: 'preview',
  SOURCE_REVISION: 'abc',
  ASSETS: {
    fetch() {
      return new Response(JSON.stringify(data), { headers: { etag: '"asset"' } });
    },
  },
};
const req = (path, method = 'GET', headers = {}) =>
  new Request(`https://curation.test${path}`, { method, headers });
const pending = [];
const ctx = {
  waitUntil(p) {
    pending.push(p);
  },
};

test('packaging rejects invalid shape and duplicate or mixed-case root keys', () => {
  assert.deepEqual(validateVaults(JSON.stringify(data)), data);
  for (const value of [
    '[]',
    'null',
    '{"not-an-address":{}}',
    JSON.stringify({ [address]: [] }),
    JSON.stringify({ [address.toUpperCase()]: data[address] }),
    `{ "${address}": {}, "${address}": {} }`,
    `{ "${address}": {}, "${address.toUpperCase()}": {} }`,
    `{ "${address}": {}, "\\u0030${address.slice(1)}": {} }`,
  ]) {
    assert.throws(() => validateVaults(value), undefined, value);
  }
});

test('CDN handler enforces bare paths, allowlist, suffixed queries, methods and validators', async () => {
  for (const prefix of ['/cdn', '/api/cdn']) {
    assert.equal((await cdn(req(`${prefix}?schema=vaults&file=1.json`), env)).status, 400);
    for (const file of ['1.json', 'RISK_FRAMEWORK.md', 'VAULT.md']) {
      const res = await cdn(req(`${prefix}/vaults/${file}`), env);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('access-control-allow-origin'), '*');
      assert.equal(res.headers.get('cache-control'), 'public, max-age=60');
      assert.equal(res.headers.get('etag'), '"asset"');
    }
    const single = await cdn(
      req(`${prefix}/vaults/1/0x${address.slice(2).toUpperCase()}.json`),
      env,
    );
    assert.deepEqual(await single.json(), data[address]);
    assert.equal(single.headers.get('etag'), null);
    assert.equal((await cdn(req(`${prefix}/ignored?schema=vaults&file=1.json`), env)).status, 200);
    assert.equal(
      (await cdn(req(`${prefix}/ignored?schema=secrets&file=foo.json`), env)).status,
      404,
    );
    assert.equal((await cdn(req(`${prefix}/ignored?schema=vaults`), env)).status, 400);
    assert.equal((await cdn(req(`${prefix}/vaults/1.json?v=123`), env)).status, 200);
    assert.equal(
      (await cdn(req(`${prefix}/vaults/1.json`, 'GET', { 'if-none-match': '"asset"' }), env))
        .status,
      304,
    );
  }
  const noRead = {
    ...env,
    ASSETS: {
      fetch() {
        assert.fail('disallowed method read assets');
      },
    },
  };
  for (const method of ['HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'])
    assert.equal((await cdn(req('/cdn/vaults/1.json', method), noRead)).status, 405);
  assert.equal((await cdn(req('/cdn/vaults/1.json', 'OPTIONS'), noRead)).status, 204);
  assert.equal(
    (
      await cdn(req('/cdn/vaults/1.json'), {
        ...env,
        ASSETS: { fetch: async () => new Response(null, { status: 404 }) },
      })
    ).status,
    404,
  );
});

test('monitoring is GET-only and caches successes for 60s by query, revision and environment', async (t) => {
  const logs = [];
  t.mock.method(console, 'error', (message) => logs.push(message));
  let now = 0,
    calls = 0;
  const entries = new Map();
  const cache = {
    async match(key) {
      const hit = entries.get(key.url);
      return hit && hit.expires > now ? hit.value.clone() : undefined;
    },
    async put(key, value) {
      assert.equal(value.headers.get('cache-control'), 'public, max-age=60');
      entries.set(key.url, { expires: now + 60, value });
    },
  };
  const live = {
    ...env,
    MONITORING_API_URL: 'https://monitoring.test',
    MONITORING_API_TOKEN: 'server-only-sentinel',
  };
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls++;
    assert.equal(init.headers.authorization, 'Bearer server-only-sentinel');
    assert.equal(init.redirect, 'manual');
    return new Response(JSON.stringify({ data: [url] }));
  });
  const read = async (path, config = live) => {
    const res = await monitoring(req(path), config, ctx, cache);
    await Promise.all(pending.splice(0));
    assert.equal(res.headers.get('cache-control'), 'public, max-age=30');
    assert.ok(!(await res.clone().text()).includes(live.MONITORING_API_TOKEN));
    return res;
  };
  const path = '/api/monitoring/alerts?severity=HIGH&limit=5';
  assert.equal((await read(path)).headers.get('x-monitoring-cache'), 'MISS');
  assert.equal(
    (await read('/api/monitoring/alerts?limit=5&severity=HIGH')).headers.get('x-monitoring-cache'),
    'HIT',
  );
  assert.equal(calls, 1);
  now = 60;
  await read(path);
  await read(path, { ...live, SOURCE_REVISION: 'next' });
  await read(path, { ...live, ENVIRONMENT: 'production' });
  await read('/api/monitoring/alerts?limit=6&severity=HIGH');
  assert.equal(calls, 5);
  const forbiddenCache = {
    match() {
      assert.fail('disallowed cache read');
    },
    put() {
      assert.fail('disallowed cache write');
    },
  };
  for (const method of ['HEAD', 'POST', 'DELETE', 'PUT', 'PATCH']) {
    assert.equal((await monitoring(req(path, method), live, ctx, forbiddenCache)).status, 405);
  }
  assert.equal((await monitoring(req(path, 'OPTIONS'), live, ctx, forbiddenCache)).status, 204);
  assert.equal(calls, 5);
  const broken = {
    match() {
      throw new Error('cache unavailable');
    },
    put() {
      throw new Error('storage unavailable');
    },
  };
  assert.equal((await monitoring(req(path), live, ctx, broken)).status, 200);
  await Promise.all(pending.splice(0));
  assert.ok(logs.some((message) => message.includes('monitoring cache read')));
  assert.ok(logs.some((message) => message.includes('monitoring cache write')));
  globalThis.fetch.mock.mockImplementation(
    async () => new Response('private error sentinel', { status: 503 }),
  );
  const error = await monitoring(req('/api/monitoring/protocols'), live, ctx, cache);
  assert.equal(error.status, 503);
  assert.equal(error.headers.get('cache-control'), 'no-store');
  assert.ok(!(await error.text()).includes('sentinel'));
  assert.equal(pending.length, 0);
});

test('failed upstream and asset requests log their operation without secret exception text', async (t) => {
  const secret = 'private-token-and-url-sentinel';
  const logs = [];
  t.mock.method(console, 'error', (message) => logs.push(message));
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error(secret);
  });
  const live = { ...env, MONITORING_API_URL: 'https://monitoring.test' };
  const upstream = await monitoring(req('/api/monitoring/alerts'), live, ctx, undefined);
  assert.equal(upstream.status, 502);
  assert.ok(!(await upstream.text()).includes(secret));
  const assets = {
    ...env,
    ASSETS: {
      fetch: async () => {
        throw new Error(secret);
      },
    },
  };
  const page = await worker.fetch(req('/reports'), assets, ctx);
  assert.equal(page.status, 500);
  assert.ok(!(await page.text()).includes(secret));
  assert.ok(logs.some((message) => message.includes('monitoring upstream')));
  assert.ok(logs.some((message) => message.includes('request handling')));
  assert.ok(logs.every((message) => !message.includes(secret)));
});

test('Plausible uses an exact endpoint, preview suppression and a bounded outbound header allowlist', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls++;
    assert.equal(url, 'https://plausible.io/api/event');
    assert.equal(init.redirect, 'manual');
    assert.equal(init.method, 'POST');
    assert.deepEqual(Object.fromEntries(init.headers), {
      'cf-connecting-ip': '203.0.113.7',
      'content-type': 'text/plain; charset=utf-8',
      'user-agent': 'visitor-agent',
      'x-forwarded-for': '203.0.113.7',
    });
    assert.equal(new TextDecoder().decode(init.body), '{"name":"pageview"}');
    return new Response(null, { status: 202 });
  });
  const event = () =>
    new Request('https://preview.test/proxy/plausible/api/event', {
      method: 'POST',
      body: '{"name":"pageview"}',
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'user-agent': 'visitor-agent',
        'cf-connecting-ip': '203.0.113.7',
        'x-forwarded-for': 'spoofed, chain',
        cookie: 'secret',
        authorization: 'secret',
      },
    });
  assert.equal((await plausible(event(), env)).status, 204);
  assert.equal((await plausible(event(), { ...env, ENVIRONMENT: 'production' })).status, 204);
  assert.equal(calls, 0);
  const prod = { ...env, ENVIRONMENT: 'production', ANALYTICS_ENABLED: 'true' };
  assert.equal((await plausible(event(), prod)).status, 202);
  assert.equal((await plausible(req('/proxy/plausible/other', 'POST'), prod)).status, 404);
  assert.equal((await plausible(req('/proxy/plausible/api/event', 'GET'), prod)).status, 405);
  assert.equal(
    (
      await plausible(
        req('/proxy/plausible/api/event', 'POST', { 'content-type': 'image/png' }),
        prod,
      )
    ).status,
    415,
  );
  assert.equal(
    (await plausible(new Request(event(), { method: 'POST', body: 'x'.repeat(16385) }), prod))
      .status,
    413,
  );
  globalThis.fetch.mock.mockImplementation(
    async () => new Response(null, { status: 302, headers: { location: 'https://evil.test' } }),
  );
  assert.equal((await plausible(event(), prod)).status, 502);
});

test('streamed body and timeout bounds apply without Content-Length', async () => {
  await assert.rejects(readBounded(new Response('x'.repeat(100)), 99), /body too large/);
  await assert.rejects(
    withTimeout(5, async () => new Promise(() => {})),
    /timeout/,
  );
});
