import cdn from './api/cdn'
import monitoring from './api/monitoring'

async function cached(req: Request, ctx: ExecutionContext, handler: (req: Request) => Promise<Response>) {
  if (req.method !== 'GET') return handler(req)
  const hit = await caches.default.match(req)
  if (hit) return hit
  const res = await handler(req)
  if (res.status === 200) ctx.waitUntil(caches.default.put(req, res.clone()))
  return res
}

export default {
  async fetch(req: Request, env: { ASSETS: Fetcher }, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url)
    const path = url.pathname
    if (path.startsWith('/cdn/') || path.startsWith('/api/cdn')) return cdn(req, env.ASSETS)
    if (path.startsWith('/api/monitoring/')) return cached(req, ctx, monitoring)
    if (path.startsWith('/proxy/plausible/')) {
      const fwd = new Request(`https://plausible.io/${path.slice(17)}${url.search}`, req)
      fwd.headers.delete('cookie')
      return fetch(fwd)
    }
    url.pathname = path.replace(/\/?$/, '/index.html')
    return env.ASSETS.fetch(new Request(url, req))
  },
}
