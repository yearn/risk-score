import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';

const require = createRequire(import.meta.url);
assert.equal(execFileSync('npm', ['config', 'get', 'ignore-scripts'], { encoding: 'utf8' }).trim(), 'true');
for (const name of ['wrangler', 'esbuild', 'workerd', '@resvg/resvg-js']) {
  const pkg = JSON.parse(readFileSync(require.resolve(`${name}/package.json`), 'utf8'));
  console.log(`${name}@${pkg.version}; lifecycle scripts: ${Object.keys(pkg.scripts || {}).filter(k => /^(preinstall|install|postinstall)$/.test(k)).join(', ') || 'none'}`);
}
assert.match(execFileSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', '--version'], { encoding: 'utf8' }), /4\.154\.0/);
assert.match(execFileSync(process.execPath, ['node_modules/esbuild/bin/esbuild', '--version'], { encoding: 'utf8' }), /0\.28\.2/);
// These JS wrappers resolve pinned platform optional packages without postinstall.
assert.match(execFileSync(process.execPath, ['node_modules/workerd/bin/workerd', '--version'], { encoding: 'utf8' }), /workerd/);
assert.ok((await transform('const a: number = 1', { loader: 'ts' })).code.includes('const a = 1'));
if (process.platform === 'linux' && process.arch === 'x64') {
  for (const pkg of ['@esbuild/linux-x64/bin/esbuild', '@cloudflare/workerd-linux-64/bin/workerd', '@resvg/resvg-js-linux-x64-gnu']) console.log(`Resolved native package: ${require.resolve(pkg)}`);
}
