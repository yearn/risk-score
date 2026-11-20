import { BodyLimitError, readBounded, reportFailure, response, withTimeout } from './http.ts';
import type { Env } from './http.ts';

export default async function plausible(req: Request, env: Env): Promise<Response> {
  if (new URL(req.url).pathname !== '/proxy/plausible/api/event') return response('not found', 404);
  if (req.method !== 'POST') return response('bad method', 405, { allow: 'POST' });
  // A separate runtime gate protects previews even if a browser sends events manually.
  if (env.ENVIRONMENT !== 'production' || env.ANALYTICS_ENABLED !== 'true')
    return response(null, 204);
  const contentType = req.headers.get('content-type') || '';
  const mediaType = (contentType.split(';')[0] ?? '').trim().toLowerCase();
  if (!['application/json', 'text/plain'].includes(mediaType)) {
    return response('unsupported content type', 415);
  }
  try {
    return await withTimeout(5000, async (signal) => {
      const body = await readBounded(req, 16 * 1024);
      const headers = new Headers({ 'content-type': contentType });
      const ua = req.headers.get('user-agent');
      if (ua) headers.set('user-agent', ua);
      // Cloudflare ingress supplies this value. Never trust X-Forwarded-For from the client.
      const ip = req.headers.get('cf-connecting-ip');
      if (ip) {
        headers.set('x-forwarded-for', ip);
        headers.set('cf-connecting-ip', ip);
      }
      const upstream = await fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers,
        body,
        signal,
        redirect: 'manual',
      });
      await upstream.body?.cancel();
      if (upstream.status >= 300 && upstream.status < 400)
        return response('upstream redirect rejected', 502);
      return response(null, upstream.status);
    });
  } catch (error) {
    if (!(error instanceof BodyLimitError)) reportFailure('analytics upstream', error);
    return response(
      error instanceof BodyLimitError ? 'body too large' : 'analytics unavailable',
      error instanceof BodyLimitError ? 413 : 502,
    );
  }
}
