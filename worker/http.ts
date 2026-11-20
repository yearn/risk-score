export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ENVIRONMENT: string;
  SOURCE_REVISION: string;
  ANALYTICS_ENABLED?: string;
  MONITORING_API_URL?: string;
  MONITORING_API_TOKEN?: string;
}

export const REVALIDATE = 'public, max-age=0, must-revalidate';
export const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'strict-transport-security': 'max-age=31536000',
};

export function response(body: BodyInit | null, status = 200, headers: HeadersInit = {}): Response {
  return new Response(body, {
    status,
    headers: { 'cache-control': 'no-store', ...SECURITY_HEADERS, ...headers },
  });
}

export function methodResponse(req: Request): Response | undefined {
  if (req.method === 'OPTIONS')
    return response(null, 204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': '*',
      'access-control-max-age': '86400',
    });
  if (req.method !== 'GET')
    return response('bad method', 405, {
      allow: 'GET, OPTIONS',
      'access-control-allow-origin': '*',
    });
}

export class BodyLimitError extends Error {}

export function reportFailure(operation: string, error: unknown): void {
  const kind =
    error instanceof SyntaxError
      ? 'invalid JSON'
      : error instanceof TypeError
        ? 'request or response error'
        : 'operation error';
  // Exception messages and request details can contain backend URLs or credentials.
  console.error(`[curation] ${operation}: ${kind}`);
}

// Bound streaming bodies as well as requests/responses with Content-Length.
export async function readBounded(
  res: Request | Response,
  maxBytes: number,
): Promise<Uint8Array<ArrayBuffer>> {
  if (Number(res.headers.get('content-length')) > maxBytes) {
    await res.body?.cancel();
    throw new BodyLimitError('body too large');
  }
  const reader = res.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new BodyLimitError('body too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function withTimeout<T>(
  ms: number,
  action: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('upstream timeout'));
    }, ms);
  });
  try {
    return await Promise.race([action(controller.signal), timeout]);
  } finally {
    clearTimeout(timer!);
  }
}
