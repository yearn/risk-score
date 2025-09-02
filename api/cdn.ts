export const config = { runtime: 'edge' }

// @ts-ignore
const REPO_OWNER = process.env.REPO_OWNER || 'yearn'
// @ts-ignore  
const REPO_NAME = process.env.REPO_NAME || 'risk-score'

function getPath(url: URL) {
  const schema = url.searchParams.get('schema')
  const file = url.searchParams.get('file')
  if (schema && file) {
    return `${schema}/${file}`
  }
 console.info(url.pathname)
  if (url.pathname.startsWith('/api/cdn/')) {
    console.info(url.pathname.slice(9))
    return url.pathname.slice(9) // Remove '/api/cdn/'
  }
  if (url.pathname.startsWith('/cdn/')) {
    console.info(url.pathname.slice(5))
    return url.pathname.slice(5) // Remove '/cdn/'
  }

  return undefined
}

export default async function (req: Request): Promise<Response> {
  console.info(req.method)
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
    console.info(startsWithApiCdn, startsWithCdn)
    if (!(startsWithApiCdn || startsWithCdn)) return new Response('bad path', { status: 400 })

    const path = getPath(url)
    if (!path) {
      return new Response('missing path', { status: 400 })
    }

    if (!/^[a-zA-Z0-9/_.-]+$/.test(path) || path.includes('..')) {
      return new Response('invalid path', { status: 400 })
    }

    // @ts-ignore
    const HEAD = process.env.VERCEL_GIT_COMMIT_SHA || 'main'
    const upstream = `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${HEAD}/${path}`

    const response = await fetch(upstream)

    if (!response.ok) {
      if (response.status === 404) {
        return new Response('file not found', { status: 404 })
      }
      return new Response('upstream error', { status: response.status })
    }

    const content = await response.text()
    
    // Determine content type based on file extension
    const contentType = getContentType(path)
    
    return new Response(content, {
      headers: {
        'content-type': contentType,
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('CDN error:', error)
    return new Response('internal server error', { status: 500 })
  }
}

function getContentType(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'json':
      return 'application/json'
    case 'js':
      return 'application/javascript'
    case 'ts':
      return 'text/typescript'
    case 'css':
      return 'text/css'
    case 'html':
      return 'text/html'
    case 'md':
      return 'text/markdown'
    case 'txt':
      return 'text/plain'
    case 'xml':
      return 'application/xml'
    case 'yaml':
    case 'yml':
      return 'text/yaml'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    default:
      return 'text/plain'
  }
}