import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validateBundle, eligible } from '../scripts/deploy_cloudflare.mjs';

const sha = 'a'.repeat(40);
const metadata = { repository: 'yearn/risk-score', pr: '578', run: '123', attempt: '1', sha, analytics: false, dataHashes: {} };
const files = { 'worker.mjs': Buffer.from('throw new Error("must never execute")').toString('base64'), 'assets/index.html': '', 'assets/_headers': '' };
const bundle = (changes = {}) => Buffer.from(JSON.stringify({ metadata, files, ...changes }));
const expected = bytes => ({ ...metadata, checksum: createHash('sha256').update(bytes).digest('hex') });

test('deployment treats checked bundle bytes as data and binds every release identity field', () => {
  const bytes = bundle();
  assert.equal(validateBundle(bytes, expected(bytes)).files.get('worker.mjs').toString(), 'throw new Error("must never execute")');
  for (const key of ['repository', 'pr', 'run', 'attempt', 'sha', 'checksum']) {
    assert.throws(() => validateBundle(bytes, { ...expected(bytes), [key]: 'wrong' }), /mismatch/);
  }
  for (const name of ['assets/../outside', '/tmp/outside', 'assets//duplicate', 'assets/evil\\path', 'config.json', 'assets/foo/../../worker.mjs']) {
    const bytes = bundle({ files: { ...files, [name]: '' } });
    assert.throws(() => validateBundle(bytes, expected(bytes)), /filename/);
  }
  const enabled = bundle({ metadata: { ...metadata, analytics: true } });
  assert.throws(() => validateBundle(enabled, expected(enabled)), /analytics/);
  const corruptData = bundle({ metadata: { ...metadata, dataHashes: { 'vaults/1.json': 'incorrect' } } });
  assert.throws(() => validateBundle(corruptData, expected(corruptData)), /data checksum/);
});

test('publication rechecks same-repository current-head review and successful checks', async t => {
  const state = { fork: false, changed: false, review: true, checked: true, event: 'pull_request' };
  t.mock.method(globalThis, 'fetch', async url => {
    let data;
    if (url.includes('/attempts/')) data = { jobs: [{ name: 'Build, data and Worker checks', conclusion: state.checked ? 'success' : 'failure' }, { name: 'Merge result checks', conclusion: 'success' }] };
    else if (url.includes('/actions/runs/')) data = { run_attempt: 1, repository: { full_name: metadata.repository }, event: state.event };
    else if (url.includes('/reviews?')) data = state.review ? [{ state: 'APPROVED', commit_id: sha, author_association: 'MEMBER', user: { id: 1, login: 'reviewer' } }] : [];
    else data = { state: 'open', draft: false, user: { login: 'author' }, base: { ref: 'master' }, head: { sha: state.changed ? 'b'.repeat(40) : sha, repo: { full_name: state.fork ? 'fork/risk-score' : metadata.repository } } };
    return Response.json(data);
  });
  await eligible(metadata);
  for (const key of ['fork', 'changed']) {
    state[key] = true;
    await assert.rejects(eligible(metadata), /ineligible/);
    state[key] = false;
  }
  state.review = false;
  await assert.rejects(eligible(metadata), /review/);
  state.review = true;
  state.checked = false;
  await assert.rejects(eligible(metadata), /checks/);
  state.checked = true;
  state.event = 'workflow_run';
  await assert.rejects(eligible(metadata), /pull_request/);
});
