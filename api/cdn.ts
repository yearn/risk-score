export const config = { runtime: 'edge' }

const REPO_OWNER = 'yearn'
const REPO_NAME = 'risk-score'
const HEAD = 'master'

function getPath(url: URL) {
  const schema = url.searchParams.get('schema')
  const file = url.searchParams.get('file')
  if (schema && file) {
    return `${schema}/${file}`
  }
  
  if (url.pathname.startsWith('/api/cdn/')) {
    return url.pathname.slice(9) // Remove '/api/cdn/'
  }
  if (url.pathname.startsWith('/cdn/')) {
    return url.pathname.slice(5) // Remove '/cdn/'
  }

  return undefined
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
    return new Response('bad method', { status: 405 })
  }

  try {
    const url = new URL(req.url)
    const startsWithApiCdn = url.pathname.startsWith('/api/cdn/')
    const startsWithCdn = url.pathname.startsWith('/cdn/')
    if (!(startsWithApiCdn || startsWithCdn)) return new Response('bad path', { status: 400 })

    const path = getPath(url)
    if (!path) {
      return new Response('missing path', { status: 400 })
    }

    if (!/^[a-zA-Z0-9/_.-]+$/i.test(path) || path.includes('..')) {
      return new Response('invalid path', { status: 400 })
    }

    const upstream = `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${HEAD}/${path}`

    const upstreamRes = await fetch(upstream)

    if (!upstreamRes.ok || !upstreamRes.body)
      return new Response(`upstream ${upstreamRes.status}`, { status: upstreamRes.status })

    const headers = new Headers()
    headers.set('content-type', upstreamRes.headers.get('content-type') || 'application/octet-stream')
    headers.set('cache-control', `public, max-age=60, s-maxage=300, stale-while-revalidate=600`)
    headers.set('access-control-allow-origin', '*')
    
    return new Response(upstreamRes.body, { status: 200, headers })
  } catch (error) {
    console.error('CDN error:', error)
    return new Response('internal server error', { status: 500 })
  }
}