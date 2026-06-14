export const config = { runtime: 'edge' }

// Edge proxy for the yearn/monitoring alerts API (github.com/yearn/monitoring, api/server.py).
// The upstream binds to 127.0.0.1, sets no CORS headers and `Cache-Control: no-store`, so the
// browser cannot call it directly. This function fetches the internal API server-side and injects
// CORS + caching. Only the read-only `/v1/protocols`, `/v1/alerts` and `/v1/alerts/{id}` endpoints
// are exposed, and the alerts querystring is whitelisted to avoid open proxying.

const ALLOWED_PARAMS = ['protocol', 'severity', 'source', 'from', 'to', 'cursor', 'limit']
const SEVERITIES = new Set(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

type UpstreamResult = { path: string } | { error: string; status: number }

// Rejects any non-allowlisted or malformed alerts param. On success the (already validated)
// querystring is forwarded verbatim, so there is nothing to return.
function validateAlertsQuery(search: URLSearchParams): { error: string; status: number } | null {
  for (const [key, value] of search) {
    if (!ALLOWED_PARAMS.includes(key)) {
      return { error: `unsupported query param: ${key}`, status: 400 }
    }
    if (key === 'severity' && !SEVERITIES.has(value)) {
      return { error: 'invalid severity', status: 400 }
    }
    if ((key === 'cursor' || key === 'limit') && !/^\d+$/.test(value)) {
      return { error: `invalid ${key}`, status: 400 }
    }
    if ((key === 'protocol' || key === 'source') && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { error: `invalid ${key}`, status: 400 }
    }
    if ((key === 'from' || key === 'to') && !/^[0-9T:+.\- Z]+$/.test(value)) {
      return { error: `invalid ${key}`, status: 400 }
    }
  }
  return null
}

// Maps an inbound `/api/monitoring/*` URL to the upstream path under MONITORING_API_URL.
export function getUpstreamPath(url: URL): UpstreamResult {
  if (!url.pathname.startsWith('/api/monitoring/')) {
    return { error: 'bad path', status: 400 }
  }
  const sub = url.pathname.slice('/api/monitoring/'.length).replace(/\/+$/, '')

  if (sub === 'protocols') {
    return { path: '/v1/protocols' }
  }

  if (sub === 'alerts') {
    const error = validateAlertsQuery(url.searchParams)
    if (error) return error
    const qs = url.searchParams.toString()
    return { path: qs ? `/v1/alerts?${qs}` : '/v1/alerts' }
  }

  const single = sub.match(/^alerts\/(\d+)$/)
  if (single) {
    return { path: `/v1/alerts/${single[1]}` }
  }

  return { error: 'not found', status: 404 }
}

function jsonError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ error: code, message }), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': '*',
        'access-control-max-age': '86400',
      },
    })
  }

  if (req.method !== 'GET') {
    return jsonError(405, 'method_not_allowed', 'only GET is supported')
  }

  const base = (process.env.MONITORING_API_URL || '').replace(/\/+$/, '')
  if (!base) {
    return jsonError(500, 'not_configured', 'MONITORING_API_URL is not set')
  }

  try {
    const url = new URL(req.url)
    const resolved = getUpstreamPath(url)
    if ('error' in resolved) {
      const code = resolved.status === 404 ? 'not_found' : 'bad_request'
      return jsonError(resolved.status, code, resolved.error)
    }

    const upstreamRes = await fetch(`${base}${resolved.path}`, {
      headers: { accept: 'application/json' },
    })

    const body = await upstreamRes.text()
    const headers = new Headers({
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    })
    // Override the upstream's `no-store`; alert history tolerates brief staleness.
    headers.set(
      'cache-control',
      upstreamRes.ok ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' : 'no-store',
    )

    return new Response(body, { status: upstreamRes.status, headers })
  } catch (error) {
    console.error('monitoring proxy error:', error)
    return jsonError(502, 'upstream_unreachable', 'failed to reach the monitoring API')
  }
}
