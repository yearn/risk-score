import { methodResponse, reportFailure, response } from './http.ts';
import type { Env } from './http.ts';
import { PUBLIC_DATA } from './public-data.ts';

type PathResult =
  | { type: 'direct'; path: string }
  | { type: 'single-vault'; chainId: string; address: string; path: string };

function getPath(url: URL): PathResult | undefined {
  // Bare endpoints have never supported query-only requests.
  let path = url.pathname.startsWith('/api/cdn/')
    ? url.pathname.slice(9)
    : url.pathname.startsWith('/cdn/')
      ? url.pathname.slice(5)
      : '';
  if (!path) return;
  const schema = url.searchParams.get('schema');
  const file = url.searchParams.get('file');
  if (schema && file) path = `${schema}/${file}`;
  const single = path.match(/^vaults\/(\d+)\/(0x[a-fA-F0-9]{40})\.json$/);
  const chainId = single?.[1];
  const address = single?.[2];
  if (chainId && address)
    return {
      type: 'single-vault',
      chainId,
      address: address.toLowerCase(),
      path: `vaults/${chainId}.json`,
    };
  return { type: 'direct', path };
}

export default async function cdn(req: Request, env: Env): Promise<Response> {
  const method = methodResponse(req);
  if (method) return method;
  const cors = { 'access-control-allow-origin': '*' };
  const url = new URL(req.url);
  const result = getPath(url);
  if (!result) return response('missing path', 400, cors);
  if (
    ['schema', 'file'].some((k) => url.searchParams.getAll(k).length > 1) ||
    ['schema', 'file'].some((k) => url.searchParams.has(k) && !url.searchParams.get(k)) ||
    url.searchParams.has('schema') !== url.searchParams.has('file') ||
    !/^[a-zA-Z0-9/_.-]+$/.test(result.path) ||
    result.path.includes('..')
  ) {
    return response('invalid path', 400, cors);
  }
  if (!Object.hasOwn(PUBLIC_DATA, result.path)) return response('not found', 404, cors);
  const assetUrl = new URL(`/_data/${result.path}`, url.origin);
  // Only the allowlisted asset path reaches ASSETS; user headers/queries cannot select data.
  const asset = await env.ASSETS.fetch(new Request(assetUrl));
  if (asset.status !== 200) return response('not found', 404, cors);
  const headers: Record<string, string> = {
    ...cors,
    'cache-control': 'public, max-age=60',
    'content-type': result.path.endsWith('.json')
      ? 'application/json; charset=utf-8'
      : 'text/markdown; charset=utf-8',
  };
  if (result.type === 'single-vault') {
    try {
      const data = (await asset.json()) as Record<string, unknown>;
      if (!Object.hasOwn(data, result.address)) return response('vault not found', 404, cors);
      // Extraction changes the body, so no chain-file ETag or Content-Length survives.
      return response(JSON.stringify(data[result.address]), 200, headers);
    } catch (error) {
      reportFailure('vault data extraction', error);
      return response('error processing vault data', 500, cors);
    }
  }
  const etag = asset.headers.get('etag');
  if (etag) headers['etag'] = etag;
  if (
    etag &&
    req.headers
      .get('if-none-match')
      ?.split(',')
      .map((x) => x.trim().replace(/^W\//, ''))
      .includes(etag)
  ) {
    return response(null, 304, headers);
  }
  return response(asset.body, 200, headers);
}
