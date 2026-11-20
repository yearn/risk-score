// This file runs only from the reviewed master checkout in protected jobs.
// Downloaded release bytes are data: never import them, bundle them, or run them.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp, appendFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function requireValue(condition, message) { if (!condition) throw new Error(message); }

export function validateBundle(bytes, expected) {
  requireValue(bytes.length <= 100 * 1024 * 1024 && digest(bytes) === expected.checksum, 'release checksum or size mismatch');
  const bundle = JSON.parse(bytes);
  const m = bundle.metadata;
  for (const key of ['repository', 'pr', 'run', 'attempt', 'sha']) requireValue(m[key] === expected[key], `release ${key} mismatch`);
  requireValue(m.analytics === (expected.pr === ''), 'release analytics mode mismatch');
  requireValue(/^[0-9a-f]{40}$/.test(m.sha), 'invalid revision');
  requireValue(bundle.files && typeof bundle.files === 'object' && !Array.isArray(bundle.files), 'missing files');
  const files = new Map();
  let total = 0;
  for (const [name, encoded] of Object.entries(bundle.files)) {
    requireValue(name === 'worker.mjs' || (name.startsWith('assets/') && name.length < 240 &&
      name.split('/').every(p => p && p !== '.' && p !== '..' && /^[\w.@-]+$/.test(p))), 'invalid release filename');
    requireValue(typeof encoded === 'string' && /^[A-Za-z0-9+/]*={0,2}$/.test(encoded), 'invalid release content');
    const body = Buffer.from(encoded, 'base64');
    total += body.length;
    requireValue(total <= 75 * 1024 * 1024, 'release too large');
    files.set(name, body);
  }
  requireValue(files.has('worker.mjs') && files.has('assets/index.html') && files.has('assets/_headers'), 'incomplete release');
  for (const [route, hash] of Object.entries(m.dataHashes)) {
    const data = files.get(`assets/_data/${route}`);
    requireValue(data && digest(data) === hash, 'bundled data checksum mismatch');
  }
  return { metadata: m, files };
}

async function github(route, init = {}) {
  const res = await fetch(`https://api.github.com/repos/yearn/risk-score${route && `/${route}`}`, {
    ...init, signal: AbortSignal.timeout(15000), headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', ...init.headers },
  });
  requireValue(res.ok, `GitHub API failed (${res.status})`);
  return res.json();
}

export async function eligible(expected) {
  requireValue(expected.repository === 'yearn/risk-score', 'unexpected repository');
  const run = await github(`actions/runs/${expected.run}`);
  requireValue(String(run.run_attempt) === expected.attempt && run.repository.full_name === expected.repository, 'run identity mismatch');
  const jobs = await github(`actions/runs/${expected.run}/attempts/${expected.attempt}/jobs?per_page=100`);
  requireValue(jobs.jobs.some(job => job.name === 'Build, data and Worker checks' && job.conclusion === 'success'), 'required checks have not passed in this attempt');
  if (!expected.pr) {
    requireValue(run.event === 'push' && run.head_branch === 'master' && run.head_sha === expected.sha, 'production requires master push');
    // Do not publish an obsolete run after a later push or while waiting for approval.
    const head = await github('git/ref/heads/master');
    requireValue(head.object.sha === expected.sha, 'master has moved; use its latest successful run');
    return;
  }
  requireValue(run.event === 'pull_request', 'preview requires pull_request');
  requireValue(jobs.jobs.some(job => job.name === 'Merge result checks' && job.conclusion === 'success'), 'merge-result checks have not passed');
  const pr = await github(`pulls/${expected.pr}`);
  requireValue(pr.state === 'open' && !pr.draft && pr.head.repo?.full_name === expected.repository &&
    pr.base.ref === 'master' && pr.head.sha === expected.sha, 'PR is ineligible or head has changed');
  // Require a current-head approval in addition to the protected environment approval.
  const latest = new Map();
  for (let page = 1; ; page++) {
    const reviews = await github(`pulls/${expected.pr}/reviews?per_page=100&page=${page}`);
    for (const review of reviews) {
      if (['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) latest.set(review.user.id, review);
    }
    if (reviews.length < 100) break;
  }
  const reviews = [...latest.values()];
  requireValue(!reviews.some(r => r.state === 'CHANGES_REQUESTED'), 'PR has outstanding changes requested');
  requireValue(reviews.some(r => r.state === 'APPROVED' && r.commit_id === expected.sha &&
    ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(r.author_association) && r.user.login !== pr.user.login), 'current head needs maintainer review');
}

export async function deploy({ execFile = execFileSync } = {}) {
  requireValue(process.env.CLOUDFLARE_API_TOKEN?.trim(), 'Environment-scoped Cloudflare API token is missing');
  requireValue(process.env.CLOUDFLARE_ACCOUNT_ID?.trim(), 'CLOUDFLARE_ACCOUNT_ID is missing');
  const expected = {
    repository: process.env.GITHUB_REPOSITORY, pr: process.env.PR_NUMBER || '',
    run: process.env.GITHUB_RUN_ID, attempt: process.env.GITHUB_RUN_ATTEMPT,
    sha: process.env.SOURCE_REVISION, checksum: process.env.BUNDLE_CHECKSUM,
  };
  await eligible(expected);
  // Official artifact download is restricted by this run + ID. Verify the API
  // identity too, so a differently named artifact cannot be substituted.
  const artifact = await github(`actions/artifacts/${process.env.ARTIFACT_ID}`);
  const name = `curation-${expected.sha}-${expected.run}-${expected.attempt}`;
  requireValue(artifact.name === name && !artifact.expired && String(artifact.workflow_run.id) === expected.run &&
    artifact.workflow_run.repository_id === (await github('')).id, 'artifact identity mismatch');
  const bytes = await readFile(process.env.BUNDLE_PATH);
  const { files, metadata } = validateBundle(bytes, expected);
  const temp = await mkdtemp(path.join(tmpdir(), 'curation-publish-'));
  try {
    for (const [name, body] of files) {
      const dest = path.join(temp, name);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, body, { flag: 'wx', mode: 0o600 });
    }
    const mode = expected.pr ? 'preview' : 'production';
    const config = JSON.parse(await readFile(new URL(`../config/wrangler.${mode}.json`, import.meta.url)));
    delete config.$schema;
    config.main = './worker.mjs';
    config.find_additional_modules = false;
    config.assets.directory = './assets';
    config.vars.SOURCE_REVISION = expected.sha;
    config.vars.MONITORING_API_URL = process.env.MONITORING_API_URL || '';
    // Explicitly bind an empty preview token if none is configured. Never inherit
    // an existing remote token or substitute the production secret.
    await writeFile(path.join(temp, 'secrets.json'), JSON.stringify({ MONITORING_API_TOKEN: process.env.MONITORING_API_TOKEN || '' }), { mode: 0o600 });
    await writeFile(path.join(temp, 'wrangler.json'), JSON.stringify(config));
    await eligible(expected); // Recheck after artifact validation, immediately before upload.
    const output = path.join(temp, 'wrangler-output.jsonl');
    const args = expected.pr ? ['versions', 'upload'] : ['deploy'];
    args.push('--config', path.join(temp, 'wrangler.json'), '--no-bundle', '--secrets-file', path.join(temp, 'secrets.json'));
    if (expected.pr) args.push('--tag', `pr-${expected.pr}-${expected.sha.slice(0, 12)}`, '--message', `PR #${expected.pr} head ${expected.sha}`);
    // Only the reviewed Wrangler is executed. No bundle config, hooks or imports.
    execFile(process.execPath, [fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url)), ...args], {
      cwd: temp, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024,
      env: { PATH: process.env.PATH, HOME: process.env.HOME, CI: 'true', WRANGLER_SEND_METRICS: 'false',
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
        WRANGLER_OUTPUT_FILE_PATH: output },
    });
    const entries = (await readFile(output, 'utf8')).trim().split('\n').map(line => JSON.parse(line));
    const record = entries.findLast(x => x.type === (expected.pr ? 'version-upload' : 'deploy'));
    requireValue(record?.version_id, 'Wrangler did not record a version');
    if (expected.pr) {
      requireValue(typeof record.preview_url === 'string' && /^https:\/\/[a-f0-9]+-curation-preview\.[a-z0-9-]+\.workers\.dev$/.test(record.preview_url), 'missing immutable preview version URL');
      const deployment = await github('deployments', { method: 'POST', body: JSON.stringify({
        ref: expected.sha, environment: `preview-pr-${expected.pr}`, auto_merge: false, required_contexts: [],
        transient_environment: true, production_environment: false, payload: { pr: expected.pr, run: expected.run, checksum: expected.checksum, version: record.version_id },
      }) });
      await github(`deployments/${deployment.id}/statuses`, { method: 'POST', body: JSON.stringify({
        state: 'success', environment_url: record.preview_url, log_url: `https://github.com/yearn/risk-score/actions/runs/${expected.run}`, auto_inactive: false,
      }) });
    }
    const evidence = { ...metadata, checksum: expected.checksum, artifact: artifact.id, worker: config.name, version: record.version_id, url: record.preview_url || 'https://curation.yearn.fi' };
    await writeFile(process.env.DEPLOY_RECORD_PATH || 'deployment.json', JSON.stringify(evidence, null, 2) + '\n');
    if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `Published ${config.name} version ${record.version_id}\n\nSource: ${expected.sha}\n\n${evidence.url}\n\nBundle SHA-256: ${expected.checksum}\n`);
    console.log(`Published ${config.name} version ${record.version_id}`);
  } finally { await rm(temp, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await deploy(); }
  catch (error) {
    // Child-process errors can contain command output. Do not print credentials,
    // secret-file contents or upstream diagnostics on the privileged runner.
    console.error(error?.status !== undefined ? `Wrangler publication failed (${error.status}); inspect Cloudflare audit logs.` : error.message);
    process.exitCode = 1;
  }
}
