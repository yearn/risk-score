import './commit'
import cdn from './api/cdn'
import monitoring from './api/monitoring'

export default {
  async fetch(req: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(req.url)
    const path = url.pathname
    if (path.startsWith('/cdn/') || path.startsWith('/api/cdn')) return cdn(req)
    if (path.startsWith('/api/monitoring/')) return monitoring(req)
    if (path.startsWith('/proxy/plausible/')) {
      return fetch(new Request(`https://plausible.io/${path.slice(17)}${url.search}`, req))
    }
    return env.ASSETS.fetch(req)
  },
}
