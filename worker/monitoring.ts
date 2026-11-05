import { methodResponse, readBounded, reportFailure, response, withTimeout } from './http.ts';
import type { Env } from './http.ts';

const ALLOWED_PARAMS = ['protocol', 'severity', 'source', 'from', 'to', 'cursor', 'limit'];
const SEVERITIES = new Set(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

type UpstreamResult = { path: string } | { error: string; status: number };

// Validate all response-affecting inputs before upstream or cache access.
function validateAlertsQuery(
  search: URLSearchParams,
): { query: URLSearchParams } | { error: string; status: number } {
  const out = new URLSearchParams();
  for (const [key, value] of search) {
    if (!ALLOWED_PARAMS.includes(key)) {
      return { error: `unsupported query param: ${key}`, status: 400 };
    }
    if (key === 'severity' && !SEVERITIES.has(value)) {
      return { error: 'invalid severity', status: 400 };
    }
    if ((key === 'cursor' || key === 'limit') && !/^\d+$/.test(value)) {
      return { error: `invalid ${key}`, status: 400 };
    }
    if ((key === 'protocol' || key === 'source') && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { error: `invalid ${key}`, status: 400 };
    }
    if ((key === 'from' || key === 'to') && !/^[0-9T:+.\- Z]+$/.test(value)) {
      return { error: `invalid ${key}`, status: 400 };
    }
    if (out.has(key) || value.length > 128) return { error: `invalid ${key}`, status: 400 };
    out.append(key, value);
  }
  out.sort();
  return { query: out };
}

// Maps an inbound `/api/monitoring/*` URL to the upstream path under MONITORING_API_URL.
export function getUpstreamPath(url: URL): UpstreamResult {
  if (!url.pathname.startsWith('/api/monitoring/')) {
    return { error: 'bad path', status: 400 };
  }
  const sub = url.pathname.slice('/api/monitoring/'.length).replace(/\/+$/, '');

  if (sub !== 'alerts' && url.search) return { error: 'unsupported query params', status: 400 };

  if (sub === 'protocols') {
    return { path: '/v1/protocols' };
  }

  if (sub === 'alerts') {
    const result = validateAlertsQuery(url.searchParams);
    if ('error' in result) return result;
    const qs = result.query.toString();
    return { path: qs ? `/v1/alerts?${qs}` : '/v1/alerts' };
  }

  const single = sub.match(/^alerts\/(\d+)$/);
  if (single) {
    return { path: `/v1/alerts/${single[1]}` };
  }

  return { error: 'not found', status: 404 };
}

function jsonError(status: number, code: string, message: string): Response {
  return response(JSON.stringify({ error: code, message }), status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  });
}

type CacheBinding = {
  match(key: Request): Promise<Response | undefined>;
  put(key: Request, value: Response): Promise<void>;
};

export default async function monitoring(
  req: Request,
  env: Env,
  ctx: { waitUntil(promise: Promise<unknown>): void },
  cache: CacheBinding | undefined = (globalThis as any).caches?.default,
): Promise<Response> {
  const method = methodResponse(req);
  if (method) return method;
  const url = new URL(req.url);
  if (url.search.length > 2048) return jsonError(400, 'bad_request', 'query too long');
  const resolved = getUpstreamPath(url);
  if ('error' in resolved)
    return jsonError(
      resolved.status,
      resolved.status === 404 ? 'not_found' : 'bad_request',
      resolved.error,
    );
  const base = (env.MONITORING_API_URL || '').replace(/\/+$/, '');
  if (!base) return jsonError(500, 'not_configured', 'MONITORING_API_URL is not set');
  // The path and sorted, validated query are the complete public response identity.
  const keyUrl = new URL(
    `/__monitoring_cache/${encodeURIComponent(env.ENVIRONMENT)}/${encodeURIComponent(env.SOURCE_REVISION)}${resolved.path}`,
    url.origin,
  );
  const key = new Request(keyUrl);
  try {
    const hit = await cache?.match(key);
    if (hit) {
      const headers = new Headers(hit.headers);
      headers.set('cache-control', 'public, max-age=30');
      headers.set('x-monitoring-cache', 'HIT');
      return new Response(hit.body, { status: hit.status, headers });
    }
  } catch (error) {
    reportFailure('monitoring cache read; fetching upstream', error);
  }
  try {
    const result = await withTimeout(8000, async (signal) => {
      const headers: Record<string, string> = { accept: 'application/json' };
      if (env.MONITORING_API_TOKEN) headers['authorization'] = `Bearer ${env.MONITORING_API_TOKEN}`;
      const upstream = await fetch(`${base}${resolved.path}`, {
        headers,
        signal,
        redirect: 'manual',
      });
      if (!upstream.ok) {
        await upstream.body?.cancel();
        // Do not expose upstream error bodies, auth headers or redirect locations.
        return jsonError(
          upstream.status >= 400 ? upstream.status : 502,
          'upstream_error',
          'monitoring API request failed',
        );
      }
      const body = await readBounded(upstream, 2 * 1024 * 1024);
      JSON.parse(new TextDecoder().decode(body));
      return response(body, 200, {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=30',
        'x-monitoring-cache': 'MISS',
      });
    });
    if (result.ok && cache) {
      const cached = result.clone();
      cached.headers.set('cache-control', 'public, max-age=60');
      ctx.waitUntil(
        Promise.resolve()
          .then(() => cache.put(key, cached))
          .catch((error) => {
            reportFailure('monitoring cache write; response served uncached', error);
          }),
      );
    }
    return result;
  } catch (error) {
    reportFailure('monitoring upstream', error);
    return jsonError(502, 'upstream_unreachable', 'failed to reach the monitoring API');
  }
}
