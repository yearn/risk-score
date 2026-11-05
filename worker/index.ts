import cdn from './cdn.ts';
import monitoring from './monitoring.ts';
import plausible from './plausible.ts';
import { response, REVALIDATE, SECURITY_HEADERS } from './http.ts';
import type { Env } from './http.ts';

const within = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

function finish(req: Request, env: Env, res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) headers.set(key, value);
  headers.set('x-source-revision', env.SOURCE_REVISION);
  if (env.ENVIRONMENT !== 'production') headers.set('x-robots-tag', 'noindex, nofollow');
  return new Response(req.method === 'HEAD' ? null : res.body, { status: res.status, headers });
}

export default {
  async fetch(req: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    const url = new URL(req.url);
    let path: string;
    try { path = decodeURIComponent(url.pathname); }
    catch { return finish(req, env, response('invalid path', 400)); }
    // Reject ambiguous encoding before ASSETS lookup (including double-encoded paths).
    if (path.includes('%') || path.includes('\\') || path.includes('//') || /[\x00-\x1f\x7f]/.test(path)) {
      return finish(req, env, response('not found', 404));
    }
    let res: Response;
    try {
      if (within(path, '/_data')) res = response('not found', 404);
      else if (within(path, '/cdn') || within(path, '/api/cdn')) {
        url.pathname = path;
        res = await cdn(new Request(url, req), env);
      } else if (within(path, '/api/monitoring')) res = await monitoring(req, env, ctx);
      else if (within(path, '/api')) res = response('not found', 404);
      else if (within(path, '/proxy/plausible')) res = await plausible(req, env);
      else {
        if (!['GET', 'HEAD'].includes(req.method)) return finish(req, env, response('bad method', 405, { allow: 'GET, HEAD' }));
        // Exact assets normally never invoke the Worker. This also handles internal fallthrough.
        res = await env.ASSETS.fetch(req);
        if (res.status === 404 && !path.split('/').at(-1)?.includes('.')) {
          url.pathname = `${path.replace(/\/$/, '')}/index.html`;
          res = await env.ASSETS.fetch(new Request(url, req));
        }
        if (res.status === 404) res = response('not found', 404);
        else if (res.ok || res.status === 304) {
          const headers = new Headers(res.headers);
          headers.set('cache-control', REVALIDATE);
          res = new Response(req.method === 'HEAD' ? null : res.body, { status: res.status, headers });
        }
      }
    } catch { res = response('internal server error', 500); }
    return finish(req, env, res);
  },
};
