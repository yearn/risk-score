import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { cp, mkdtemp, readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { chromium } from '@playwright/test';
import { createServer as httpServer } from 'node:http';

test('built Worker and actual asset routing preserve the HTTP contract under workerd', { timeout: 90000 }, async t => {
  const root = process.cwd();
  const provenance = JSON.parse(await readFile('release/provenance.json'));
  const temp = await mkdtemp(path.join(tmpdir(), 'curation-workerd-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const assets = path.join(temp, 'assets');
  await cp('dist', assets, { recursive: true });
  // Static collisions would bypass policy without run_worker_first. Also put an
  // encoded-name collision alongside the real internal file to test the router.
  for (const file of ['api', 'cdn/vaults/1.json', 'proxy/plausible/api/event', '%5fdata/vaults/1.json']) {
    // A bare namespace cannot be a file and directory at once in a filesystem.
    const dest = path.join(assets, file);
    try { await mkdir(path.dirname(dest), { recursive: true }); await writeFile(dest, 'COLLISION'); }
    catch (e) { if (!['EEXIST', 'ENOTDIR'].includes(e.code)) throw e; }
  }
  const config = JSON.parse(await readFile('config/wrangler.preview.json'));
  let upstreamCalls = 0;
  const upstream = httpServer((request, res) => {
    upstreamCalls++;
    assert.equal(request.headers.authorization, 'Bearer runtime-only-sentinel');
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ data: [], path: request.url }));
  }).listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  t.after(() => new Promise(resolve => upstream.close(resolve)));
  config.vars.MONITORING_API_URL = `http://127.0.0.1:${upstream.address().port}`;
  config.vars.MONITORING_API_TOKEN = 'runtime-only-sentinel';
  // Run the compiled module unchanged behind an outbound test guard. Even a
  // forwarding regression must never send test events to production analytics.
  const guard = `const nativeFetch = globalThis.fetch; globalThis.fetch = (input, init) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
    if (url.origin !== ${JSON.stringify(config.vars.MONITORING_API_URL)}) throw new Error('external network disabled in runtime tests');
    return nativeFetch(input, init);
  };\n`;
  await writeFile(path.join(temp, 'worker.mjs'), guard + await readFile('release/worker.mjs', 'utf8'));
  config.main = path.join(temp, 'worker.mjs');
  config.assets.directory = assets;
  config.vars.SOURCE_REVISION = 'runtime-test';
  delete config.$schema;
  await writeFile(path.join(temp, 'wrangler.json'), JSON.stringify(config));
  const socket = createServer().listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const child = spawn(process.execPath, [path.join(root, 'node_modules/wrangler/bin/wrangler.js'), 'dev', '--config', path.join(temp, 'wrangler.json'), '--local', '--ip', '127.0.0.1', '--port', String(port)], {
    cwd: temp,
    env: { PATH: process.env.PATH, HOME: process.env.HOME, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', x => { log += x; });
  child.stderr.on('data', x => { log += x; });
  t.after(async () => { if (child.exitCode === null) { child.kill('SIGTERM'); await once(child, 'exit'); } });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 150; i++) {
    if (child.exitCode !== null) assert.fail(`workerd exited: ${log}`);
    try { await fetch(base); ready = true; break; } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  assert.ok(ready, `workerd failed to start: ${log}`);
  const get = (url, init) => fetch(base + url, { redirect: 'manual', ...init });
  for (const url of ['/', '/reports', '/reports/', '/monitoring', '/monitoring/', '/monitoring/status/', '/report/reserve-ethplus/', '/graph/reserve-ethplus/', '/favicon.svg', '/llms.txt', '/sitemap-index.xml', '/og/default.png']) {
    const res = await get(url);
    assert.equal(res.status, 200, url);
    assert.equal(res.headers.get('location'), null, url);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=0, must-revalidate', url);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff', url);
    const workerResponse = res.headers.get('x-source-revision') === 'runtime-test';
    assert.equal(res.headers.get('x-robots-tag'), !provenance.analytics || workerResponse ? 'noindex, nofollow' : null, url);
  }
  for (const url of ['/_data', '/_data/', '/_data/vaults/1.json', '/%5fdata/vaults/1.json', '/_d%61ta/vaults/1.json', '/%5Fd%61ta/vaults/1.json', '/_data%2fvaults/1.json', '/%255fdata/vaults/1.json', '/_data%252fvaults/1.json', '/missing-page', '/api', '/api/missing']) {
    const res = await get(url);
    assert.equal(res.status, 404, url);
    assert.equal(res.headers.get('cache-control'), 'no-store', url);
    assert.ok(!(await res.text()).includes('riskLevel'), url);
  }
  for (const prefix of ['/cdn', '/api/cdn']) {
    assert.equal((await get(prefix)).status, 400, prefix);
    assert.equal((await get(`${prefix}?schema=vaults&file=1.json`)).status, 400);
    for (const file of ['1.json', 'RISK_FRAMEWORK.md', 'VAULT.md']) {
      const res = await get(`${prefix}/vaults/${file}`);
      assert.equal(res.status, 200, `${prefix}/${file}`);
      assert.equal(await res.text(), await readFile(`vaults/${file}`, 'utf8'));
      assert.equal(res.headers.get('access-control-allow-origin'), '*');
      assert.equal(res.headers.get('cache-control'), 'public, max-age=60');
    }
    const chain = JSON.parse(await readFile('vaults/1.json'));
    const address = Object.keys(chain)[1];
    const single = await get(`${prefix}/vaults/1/0x${address.slice(2).toUpperCase()}.json`);
    assert.deepEqual(await single.json(), chain[address]);
    assert.equal(single.headers.get('etag'), null);
    assert.equal((await get(`${prefix}/ignored?schema=vaults&file=VAULT.md`)).status, 200);
    assert.equal((await get(`${prefix}/vaults/999999.json`)).status, 404);
    assert.equal((await get(`${prefix}/vaults/1/invalid.json`)).status, 404);
    assert.equal((await get(`${prefix}/vaults/1.json`, { method: 'OPTIONS' })).status, 204);
    for (const method of ['HEAD', 'POST', 'PUT', 'PATCH', 'DELETE']) assert.equal((await get(`${prefix}/vaults/1.json`, { method })).status, 405);
  }
  assert.equal((await get('/api/monitoring/alerts', { method: 'HEAD' })).status, 405);
  assert.equal((await get('/api/monitoring/alerts?path=alerts')).status, 400);
  assert.equal((await get('/api/monitoring/alerts')).status, 200);
  assert.equal((await get('/api/monitoring/alerts')).headers.get('x-monitoring-cache'), 'HIT');
  assert.equal(upstreamCalls, 1);
  assert.equal((await get('/api/monitoring/alerts', { method: 'HEAD' })).status, 405);
  assert.equal(upstreamCalls, 1);
  assert.equal((await get('/api/monitoring/alerts?limit=2')).status, 200);
  assert.equal(upstreamCalls, 2);
  assert.equal((await get('/proxy/plausible/api/event', { method: 'POST', body: 'preview-pageview' })).status, 204);
  assert.equal((await get('/proxy/plausible/api/event')).status, 405);
  assert.equal((await get('/proxy/plausible/anything', { method: 'POST' })).status, 404);
  const html = await get('/reports');
  const tag = html.headers.get('etag');
  assert.ok(tag);
  assert.equal((await get('/reports', { headers: { 'if-none-match': tag } })).status, 304);
  assert.equal((await get('/reports/', { method: 'HEAD' })).status, 200);
  const hashed = (await readdir('dist/_astro')).find(f => /[._-][\w-]{8,}\.js$/.test(f));
  assert.ok(hashed);
  const staticRes = await get(`/_astro/${hashed}`);
  assert.equal(staticRes.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  // Exact static delivery bypasses the Worker: its header comes from packaging,
  // while clean pages carry the runtime revision set above.
  assert.notEqual(staticRes.headers.get('x-source-revision'), 'runtime-test');
  assert.equal((await get('/reports')).headers.get('x-source-revision'), 'runtime-test');
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const context = await browser.newContext();
  // Exercise analytics gating itself rather than the tracker's automation skip.
  await context.addInitScript(() => { window.__plausible = true; });
  const events = [];
  const eventStatuses = [];
  context.on('request', request => {
    if (request.url().includes('/proxy/plausible/') || request.url().includes('plausible.io/')) events.push(request.url());
  });
  // Browser checks cannot send any analytics or other requests to external sites.
  const browserBase = 'http://curation.test';
  await context.route('**/*', async route => {
    if (!route.request().url().startsWith(browserBase)) return route.abort();
    const url = new URL(route.request().url());
    const headers = new Headers(route.request().headers());
    headers.delete('host');
    headers.delete('content-length');
    const result = await fetch(base + url.pathname + url.search, {
      method: route.request().method(), headers, body: route.request().postDataBuffer() ?? undefined,
    });
    if (url.pathname === '/proxy/plausible/api/event') eventStatuses.push(result.status);
    const outgoing = Object.fromEntries(result.headers);
    delete outgoing['content-encoding'];
    delete outgoing['content-length'];
    return route.fulfill({ status: result.status, headers: outgoing, body: Buffer.from(await result.arrayBuffer()) });
  });
  const page = await context.newPage();
  await page.goto(browserBase + '/reports/');
  await page.waitForLoadState('networkidle');
  assert.ok(await page.locator('a.logo-link').count(), (await page.content()).slice(0, 2000));
  await page.locator('a.logo-link').click();
  await page.waitForTimeout(500);
  if (!provenance.analytics) assert.deepEqual(events, [], 'preview pageviews and outbound clicks must not initialize analytics');
  else assert.ok(events.length >= 2, 'explicit production build tracks pageviews and outbound links against the local suppressed endpoint');
  assert.ok(eventStatuses.every(status => status === 204), 'preview runtime suppresses every browser event');
  assert.equal(await page.evaluate(async () => (await fetch('/proxy/plausible/api/event', { method: 'POST', body: 'manual-preview-event' })).status), 204);
});
