export const config = { runtime: 'edge' }

const REPO_OWNER = 'yearn'
const REPO_NAME = 'risk-score'
const HEAD = 'master'

type PathResult =
  | { type: 'direct'; path: string }
  | { type: 'single-vault'; chainId: string; address: string; path: string }
  | undefined

export function getPath(url: URL): PathResult {
  const schema = url.searchParams.get('schema')
  const file = url.searchParams.get('file')
  if (schema && file) {
    return { type: 'direct', path: `${schema}/${file}` }
  }

  let path: string | undefined
  if (url.pathname.startsWith('/api/cdn/')) {
    path = url.pathname.slice(9) // Remove '/api/cdn/'
  } else if (url.pathname.startsWith('/cdn/')) {
    path = url.pathname.slice(5) // Remove '/cdn/'
  }

  if (!path) return undefined

  // Detect single vault pattern: vaults/{chainId}/{address}.json
  const singleVaultMatch = path.match(/^vaults\/(\d+)\/(0x[a-fA-F0-9]{40})\.json$/)
  if (singleVaultMatch) {
    const [, chainId, address] = singleVaultMatch
    return {
      type: 'single-vault',
      chainId,
      address: address.toLowerCase(),
      path: `vaults/${chainId}.json`,
    }
  }

  // Direct file access (chain files, protocols, assets, etc.)
  return { type: 'direct', path }
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

    const pathResult = getPath(url)
    if (!pathResult) {
      return new Response('missing path', { status: 400 })
    }

    if (!/^[a-zA-Z0-9/_.-]+$/i.test(pathResult.path) || pathResult.path.includes('..')) {
      return new Response('invalid path', { status: 400 })
    }

    const upstream = `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${HEAD}/${pathResult.path}`

    const upstreamRes = await fetch(upstream)

    if (!upstreamRes.ok || !upstreamRes.body)
      return new Response(`upstream ${upstreamRes.status}`, { status: upstreamRes.status })

    // Handle single vault extraction
    if (pathResult.type === 'single-vault') {
      try {
        const chainData = await upstreamRes.json()
        const vaultData = chainData[pathResult.address]

        if (!vaultData) {
          return new Response('vault not found', { status: 404 })
        }

        const headers = new Headers()
        headers.set('content-type', 'application/json')
        headers.set('cache-control', `public, max-age=60, s-maxage=300, stale-while-revalidate=600`)
        headers.set('access-control-allow-origin', '*')

        return new Response(JSON.stringify(vaultData), { status: 200, headers })
      } catch (error) {
        console.error('Error extracting vault:', error)
        return new Response('error processing vault data', { status: 500 })
      }
    }

    // Direct file access
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