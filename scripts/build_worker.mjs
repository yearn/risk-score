import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_DATA } from '../worker/public-data.ts';
import { SECURITY_HEADERS, REVALIDATE } from '../worker/http.ts';

export function validateVaults(text, filename = 'vaults.json') {
  const data = JSON.parse(text);
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error(`${filename}: expected vault object`);
  // JSON.parse alone silently drops duplicate keys. Scan the already-valid JSON's
  // root keys (including escaped characters) before accepting it for publication.
  const tokens = [...text.matchAll(/"(?:[^"\\]|\\.)*"|[{}[\]:,]/g)].map(m => m[0]);
  let depth = 0;
  const seen = new Set();
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (depth === 1 && token.startsWith('"') && tokens[i + 1] === ':') {
      const key = JSON.parse(token);
      const normalized = key.toLowerCase();
      if (seen.has(normalized)) throw new Error(`${filename}: duplicate normalized address`);
      seen.add(normalized);
      if (!/^0x[0-9a-f]{40}$/.test(key)) throw new Error(`${filename}: invalid lowercase vault address`);
    }
    if (token === '{' || token === '[') depth++;
    if (token === '}' || token === ']') depth--;
  }
  for (const vault of Object.values(data)) {
    if (!vault || Array.isArray(vault) || typeof vault !== 'object' ||
        !Number.isInteger(vault.riskLevel) || vault.riskLevel < 1 || vault.riskLevel > 5 ||
        !vault.riskScore || Array.isArray(vault.riskScore) || typeof vault.riskScore !== 'object' ||
        Object.entries(vault.riskScore).some(([k, v]) => k === 'comment' ? typeof v !== 'string' : typeof v !== 'number' || !Number.isFinite(v)) ||
        ('report' in vault && typeof vault.report !== 'string')) throw new Error(`${filename}: invalid vault shape`);
  }
  return data;
}

const sha256 = body => createHash('sha256').update(body).digest('hex');

export async function buildWorker() {
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (process.env.SOURCE_REVISION && process.env.SOURCE_REVISION !== sha) throw new Error('checkout does not match SOURCE_REVISION');
  const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0');
  const vaultFiles = tracked.filter(f => /^vaults\/[^/]+\.(json|md)$/.test(f));
  for (const f of vaultFiles) if (!Object.values(PUBLIC_DATA).includes(f)) throw new Error(`unlisted vault file: ${f}`);
  const dataHashes = {};
  for (const [route, source] of Object.entries(PUBLIC_DATA)) {
    if (!tracked.includes(source) || !/^[a-zA-Z0-9_./-]+$/.test(route) || route.includes('..')) throw new Error('invalid public-data manifest');
    const body = await readFile(source);
    if (source.endsWith('.json')) validateVaults(body.toString(), source);
    const dest = path.join('dist/_data', route);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, body);
    dataHashes[route] = sha256(body);
  }
  // Exact file headers apply to asset-first responses; Worker responses set their own.
  let headers = '/*\n';
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers += `  ${key}: ${value}\n`;
  if (process.env.PUBLIC_ANALYTICS_ENABLED !== 'true') headers += '  X-Robots-Tag: noindex, nofollow\n';
  headers += `  X-Source-Revision: ${sha}\n`;
  const files = {};
  const cacheRules = new Map();
  async function walk(dir) {
    for (const name of (await readdir(dir)).sort()) {
      const file = path.join(dir, name);
      const stat = await lstat(file);
      if (stat.isSymbolicLink()) throw new Error('symlink in asset bundle');
      if (stat.isDirectory()) await walk(file);
      else {
        const route = '/' + path.relative('dist', file).split(path.sep).join('/');
        // Astro/Vite emits hashes in this namespace. Public files are copied
        // verbatim, so a hash-looking public filename alone never earns a long TTL.
        const hashed = !tracked.includes(`public${route}`) && /^\/_astro\/.+\.[A-Za-z0-9_-]{8}\.(?:js|css|woff2?)$/.test(route);
        const group = route.startsWith('/_astro/') ? route : route.slice(1).includes('/') ? `/${route.split('/')[1]}/*` : route;
        cacheRules.set(group, route.startsWith('/_data/') ? 'no-store' : hashed ? 'public, max-age=31536000, immutable' : REVALIDATE);
        files['assets' + route] = (await readFile(file)).toString('base64');
      }
    }
  }
  await walk('dist');
  if (cacheRules.size >= 100) throw new Error('Static Assets _headers rule limit exceeded');
  for (const [route, policy] of cacheRules) headers += `${route}\n  Cache-Control: ${policy}\n`;
  await writeFile('dist/_headers', headers);
  files['assets/_headers'] = Buffer.from(headers).toString('base64');
  await mkdir('release', { recursive: true });
  await build({ entryPoints: ['worker/index.ts'], outfile: 'release/worker.mjs', bundle: true, format: 'esm', platform: 'browser', target: 'es2022' });
  files['worker.mjs'] = (await readFile('release/worker.mjs')).toString('base64');
  const metadata = {
    repository: process.env.GITHUB_REPOSITORY || 'local',
    pr: process.env.PR_NUMBER || '',
    run: process.env.GITHUB_RUN_ID || 'local',
    attempt: process.env.GITHUB_RUN_ATTEMPT || '1',
    sha, analytics: process.env.PUBLIC_ANALYTICS_ENABLED === 'true', dataHashes,
  };
  const bundle = JSON.stringify({ metadata, files });
  await writeFile('release/bundle.json', bundle);
  await writeFile('release/provenance.json', JSON.stringify({ ...metadata, checksum: sha256(bundle) }, null, 2) + '\n');
  console.log(`Worker + ${Object.keys(files).length - 1} assets; source ${sha}; bundle SHA-256 ${sha256(bundle)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildWorker();
