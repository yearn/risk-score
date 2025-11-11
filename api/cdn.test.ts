import { describe, expect, test } from 'bun:test'
import { getPath } from './cdn'

describe('getPath', () => {
  test('returns path with schema and file query params', () => {
    const url = new URL('http://localhost/api/cdn?schema=vaults&file=1.json')
    expect(getPath(url)).toBe('vaults/1.json')
  })

  test('returns path by removing /api/cdn/ prefix', () => {
    const url = new URL('http://localhost/api/cdn/vaults/42161.json')
    expect(getPath(url)).toBe('vaults/42161.json')
  })

  test('returns path by removing /cdn/ prefix', () => {
    const url = new URL('http://localhost/cdn/asset/ETHplus.md')
    expect(getPath(url)).toBe('asset/ETHplus.md')
  })

  test('query params take precedence over pathname', () => {
    const url = new URL('http://localhost/api/cdn/ignored?schema=vaults&file=1.json')
    expect(getPath(url)).toBe('vaults/1.json')
  })

  test('returns undefined when pathname does not match /api/cdn/ or /cdn/', () => {
    const url = new URL('http://localhost/other/path')
    expect(getPath(url)).toBeUndefined()
  })

  test('returns undefined when only schema param is provided', () => {
    const url = new URL('http://localhost/api/cdn?schema=vaults')
    expect(getPath(url)).toBeUndefined()
  })

  test('returns undefined when only file param is provided', () => {
    const url = new URL('http://localhost/cdn?file=1.json')
    expect(getPath(url)).toBeUndefined()
  })
})
