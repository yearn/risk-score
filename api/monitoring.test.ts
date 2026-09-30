import { describe, expect, test } from 'bun:test'
import { getUpstreamPath } from './monitoring'

describe('getUpstreamPath', () => {
  test('maps /api/monitoring/protocols to /v1/protocols', () => {
    const url = new URL('http://localhost/api/monitoring/protocols')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/protocols' })
  })

  test('maps /api/monitoring/alerts with no query to /v1/alerts', () => {
    const url = new URL('http://localhost/api/monitoring/alerts')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/alerts' })
  })

  test('forwards whitelisted alert params verbatim', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?protocol=aave&severity=HIGH&limit=5')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/alerts?protocol=aave&severity=HIGH&limit=5' })
  })

  test('forwards cursor pagination param', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?cursor=5021&limit=100')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/alerts?cursor=5021&limit=100' })
  })

  test('strips the `path` param injected by the vercel rewrite', () => {
    // Vercel's /api/monitoring/:path* rewrite appends ?path=alerts to the destination.
    const url = new URL('http://localhost/api/monitoring/alerts?path=alerts&protocol=aave&limit=5')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/alerts?protocol=aave&limit=5' })
  })

  test('maps single-alert path /api/monitoring/alerts/{id}', () => {
    const url = new URL('http://localhost/api/monitoring/alerts/5021')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/alerts/5021' })
  })

  test('tolerates a trailing slash', () => {
    const url = new URL('http://localhost/api/monitoring/protocols/')
    expect(getUpstreamPath(url)).toEqual({ path: '/v1/protocols' })
  })

  test('rejects an unsupported query param', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?protocol=aave&evil=1')
    expect(getUpstreamPath(url)).toEqual({ error: 'unsupported query param: evil', status: 400 })
  })

  test('rejects an invalid severity', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?severity=URGENT')
    expect(getUpstreamPath(url)).toEqual({ error: 'invalid severity', status: 400 })
  })

  test('rejects a param outside the allowlist (e.g. since)', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?since=2026-06-11T00:00:00Z')
    expect(getUpstreamPath(url)).toEqual({ error: 'unsupported query param: since', status: 400 })
  })

  test('rejects a non-numeric limit', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?limit=abc')
    expect(getUpstreamPath(url)).toEqual({ error: 'invalid limit', status: 400 })
  })

  test('rejects a protocol with unsafe characters', () => {
    const url = new URL('http://localhost/api/monitoring/alerts?protocol=../../etc')
    expect(getUpstreamPath(url)).toEqual({ error: 'invalid protocol', status: 400 })
  })

  test('rejects an unknown sub-path', () => {
    const url = new URL('http://localhost/api/monitoring/secrets')
    expect(getUpstreamPath(url)).toEqual({ error: 'not found', status: 404 })
  })

  test('rejects a non-numeric alert id', () => {
    const url = new URL('http://localhost/api/monitoring/alerts/not-a-number')
    expect(getUpstreamPath(url)).toEqual({ error: 'not found', status: 404 })
  })

  test('rejects a path outside /api/monitoring/', () => {
    const url = new URL('http://localhost/api/other')
    expect(getUpstreamPath(url)).toEqual({ error: 'bad path', status: 400 })
  })
})
