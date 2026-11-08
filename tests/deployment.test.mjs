import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { load } from 'js-yaml';
import { deploy, validateBundle, eligible } from '../scripts/deploy_cloudflare.mjs';

const sha = 'a'.repeat(40);
const metadata = {
  repository: 'yearn/risk-score',
  pr: '578',
  run: '123',
  attempt: '1',
  sha,
  analytics: false,
  dataHashes: {},
};
const files = {
  'worker.mjs': Buffer.from('throw new Error("must never execute")').toString('base64'),
  'assets/index.html': '',
  'assets/_headers': '',
};
const bundle = (changes = {}) => Buffer.from(JSON.stringify({ metadata, files, ...changes }));
const expected = (bytes) => ({
  ...metadata,
  checksum: createHash('sha256').update(bytes).digest('hex'),
});

test('publication forwards only the selected environment credentials to its workflow', () => {
  const workflow = load(
    readFileSync(new URL('../.github/workflows/tests.yml', import.meta.url), 'utf8'),
  );
  const publication = load(
    readFileSync(new URL('../.github/workflows/cloudflare-publish.yml', import.meta.url), 'utf8'),
  );
  const declared = publication.on.workflow_call.secrets;
  for (const mode of ['preview', 'production']) {
    const caller = workflow.jobs[mode];
    const suffix = mode.toUpperCase();
    const names = [
      'CLOUDFLARE_ACCOUNT_ID',
      `CLOUDFLARE_${suffix}_API_TOKEN`,
      `MONITORING_${suffix}_API_TOKEN`,
    ];
    assert.deepEqual(Object.keys(caller.secrets).sort(), names.sort(), `${mode} secret boundary`);
    for (const name of names) {
      assert.ok(Object.hasOwn(declared, name), `${name} must be declared by the called workflow`);
      assert.equal(caller.secrets[name], '${{ secrets.' + name + ' }}');
    }
    const step = publication.jobs.publish.steps.find(
      (step) => step.if === `inputs.mode == '${mode}'`,
    );
    assert.ok(step, `${mode} publication must select credentials independently`);
    assert.equal(
      step.env.CLOUDFLARE_API_TOKEN,
      '${{ secrets.CLOUDFLARE_' + suffix + '_API_TOKEN }}',
    );
    assert.equal(
      step.env.MONITORING_API_TOKEN,
      '${{ secrets.MONITORING_' + suffix + '_API_TOKEN }}',
    );
  }
  assert.equal(publication.jobs.publish.concurrency['cancel-in-progress'], false);
  assert.equal(
    workflow.concurrency['cancel-in-progress'],
    "${{ github.event_name == 'pull_request' }}",
  );
  assert.ok(
    workflow.concurrency.group.includes('github.sha'),
    'push runs cannot cancel one another',
  );
});

test('deployment treats checked bundle bytes as data and binds every release identity field', () => {
  const bytes = bundle();
  assert.equal(
    validateBundle(bytes, expected(bytes)).files.get('worker.mjs').toString(),
    'throw new Error("must never execute")',
  );
  for (const key of ['repository', 'pr', 'run', 'attempt', 'sha', 'checksum']) {
    assert.throws(() => validateBundle(bytes, { ...expected(bytes), [key]: 'wrong' }), /mismatch/);
  }
  for (const name of [
    'assets/../outside',
    '/tmp/outside',
    'assets//duplicate',
    'assets/evil\\path',
    'config.json',
    'assets/foo/../../worker.mjs',
  ]) {
    const bytes = bundle({ files: { ...files, [name]: '' } });
    assert.throws(() => validateBundle(bytes, expected(bytes)), /filename/);
  }
  const enabled = bundle({ metadata: { ...metadata, analytics: true } });
  assert.throws(() => validateBundle(enabled, expected(enabled)), /analytics/);
  const corruptData = bundle({
    metadata: { ...metadata, dataHashes: { 'vaults/1.json': 'incorrect' } },
  });
  assert.throws(() => validateBundle(corruptData, expected(corruptData)), /data checksum/);
});

test('publication rechecks same-repository current-head review and successful checks', async (t) => {
  const state = { fork: false, changed: false, review: true, checked: true, event: 'pull_request' };
  t.mock.method(globalThis, 'fetch', async (url) => {
    let data;
    if (url.includes('/attempts/'))
      data = {
        jobs: [
          {
            name: 'Build, data and Worker checks',
            conclusion: state.checked ? 'success' : 'failure',
          },
          { name: 'Merge result checks', conclusion: 'success' },
        ],
      };
    else if (url.includes('/actions/runs/'))
      data = { run_attempt: 1, repository: { full_name: metadata.repository }, event: state.event };
    else if (url.includes('/reviews?'))
      data = state.review
        ? [
            {
              state: 'APPROVED',
              commit_id: sha,
              author_association: 'MEMBER',
              user: { id: 1, login: 'reviewer' },
            },
          ]
        : [];
    else
      data = {
        state: 'open',
        draft: false,
        user: { login: 'author' },
        base: { ref: 'master' },
        head: {
          sha: state.changed ? 'b'.repeat(40) : sha,
          repo: { full_name: state.fork ? 'fork/risk-score' : metadata.repository },
        },
      };
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

test('publication reads the bundle from where the artifact download puts it', () => {
  const publish = load(
    readFileSync(new URL('../.github/workflows/cloudflare-publish.yml', import.meta.url), 'utf8'),
  ).jobs.publish.steps;
  const download = publish.find((step) => step.uses?.startsWith('actions/download-artifact@'));
  assert.equal(download.with['merge-multiple'], true, 'by-ID downloads otherwise nest by name');
  const deploys = publish.filter((step) => step.run === 'node scripts/deploy_cloudflare.mjs');
  assert.equal(deploys.length, 2);
  for (const step of deploys) {
    assert.equal(step.env.BUNDLE_PATH, `${download.with.path}/bundle.json`);
  }
});

async function publish(t, pr) {
  const dir = await mkdtemp(path.join(tmpdir(), 'curation-deploy-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const identity = { ...metadata, pr, analytics: pr === '' };
  const bytes = bundle({ metadata: identity });
  const record = path.join(dir, 'deployment.json');
  const env = {
    GITHUB_TOKEN: 'github-sentinel',
    GITHUB_REPOSITORY: metadata.repository,
    GITHUB_RUN_ID: metadata.run,
    GITHUB_RUN_ATTEMPT: metadata.attempt,
    GITHUB_STEP_SUMMARY: '',
    PR_NUMBER: pr,
    SOURCE_REVISION: sha,
    BUNDLE_CHECKSUM: expected(bytes).checksum,
    ARTIFACT_ID: '9',
    BUNDLE_PATH: path.join(dir, 'bundle.json'),
    DEPLOY_RECORD_PATH: record,
    CLOUDFLARE_API_TOKEN: 'cloudflare-sentinel',
    CLOUDFLARE_ACCOUNT_ID: 'account',
    MONITORING_API_URL: 'https://monitoring.test',
    MONITORING_API_TOKEN: 'monitoring-sentinel',
  };
  const saved = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  t.after(() => {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  Object.assign(process.env, env);
  await writeFile(env.BUNDLE_PATH, bytes);

  // Exact GitHub routes: GitHub returns 404 for anything else, including a trailing slash.
  const api = 'https://api.github.com/repos/yearn/risk-score';
  const routes = {
    [`GET ${api}`]: { id: 7 },
    [`GET ${api}/actions/runs/123`]: {
      run_attempt: 1,
      repository: { full_name: metadata.repository },
      event: pr ? 'pull_request' : 'push',
      head_branch: pr ? 'feature' : 'master',
      head_sha: sha,
    },
    [`GET ${api}/actions/runs/123/attempts/1/jobs?per_page=100`]: {
      jobs: ['Build, data and Worker checks', 'Merge result checks'].map((name) => ({
        name,
        conclusion: 'success',
      })),
    },
    [`GET ${api}/actions/artifacts/9`]: {
      id: 9,
      name: `curation-${sha}-123-1`,
      expired: false,
      workflow_run: { id: 123, repository_id: 7 },
    },
    [`GET ${api}/git/ref/heads/master`]: { object: { sha } },
    [`GET ${api}/pulls/${pr}`]: {
      state: 'open',
      draft: false,
      user: { login: 'author' },
      base: { ref: 'master' },
      head: { sha, repo: { full_name: metadata.repository } },
    },
    [`GET ${api}/pulls/${pr}/reviews?per_page=100&page=1`]: [
      {
        state: 'APPROVED',
        commit_id: sha,
        author_association: 'MEMBER',
        user: { id: 1, login: 'reviewer' },
      },
    ],
    [`POST ${api}/deployments`]: { id: 55 },
    [`POST ${api}/deployments/55/statuses`]: {},
  };
  const posts = [];
  t.mock.method(globalThis, 'fetch', async (url, init = {}) => {
    const key = `${init.method ?? 'GET'} ${url}`;
    if (!Object.hasOwn(routes, key)) return Response.json({}, { status: 404 });
    if (init.method === 'POST') posts.push({ url, body: JSON.parse(init.body) });
    return Response.json(routes[key]);
  });

  const runs = [];
  const execFile = (_node, args, options) => {
    const secrets = JSON.parse(readFileSync(path.join(options.cwd, 'secrets.json'), 'utf8'));
    runs.push({ args: args.slice(1), env: options.env, secrets });
    const result = pr
      ? {
          type: 'version-upload',
          version_id: 'version-1',
          preview_url: 'https://abc123-curation-preview.team.workers.dev',
        }
      : { type: 'deploy', version_id: 'version-1' };
    writeFileSync(options.env.WRANGLER_OUTPUT_FILE_PATH, JSON.stringify(result) + '\n');
  };
  await deploy({ execFile });
  return { runs, posts, record: JSON.parse(await readFile(record, 'utf8')) };
}

for (const [mode, pr, command] of [
  ['preview', '578', ['versions', 'upload']],
  ['production', '', ['deploy']],
]) {
  test(`${mode} publication validates the release and runs Wrangler with scoped credentials`, async (t) => {
    const { runs, posts, record } = await publish(t, pr);
    assert.equal(runs.length, 1);
    assert.deepEqual(runs[0].args.slice(0, command.length), command);
    assert.equal(runs[0].env.CLOUDFLARE_API_TOKEN, 'cloudflare-sentinel');
    assert.equal(runs[0].env.GITHUB_TOKEN, undefined);
    assert.equal(runs[0].env.MONITORING_API_TOKEN, undefined);
    assert.deepEqual(runs[0].secrets, { MONITORING_API_TOKEN: 'monitoring-sentinel' });
    assert.equal(record.version, 'version-1');
    assert.equal(record.sha, sha);
    // Only previews get a GitHub deployment record; production is the Worker release itself.
    assert.equal(posts.length, pr ? 2 : 0);
  });
}
