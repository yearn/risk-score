import { describe, expect, test } from 'bun:test'
import { getPath } from './cdn'

describe('getPath', () => {
  test('returns path with schema and file query params', () => {
    const url = new URL('http://localhost/api/cdn?schema=vaults&file=1.json')
    expect(getPath(url)).toEqual({ type: 'direct', path: 'vaults/1.json' })
  })

  test('returns path by removing /api/cdn/ prefix for chain file', () => {
    const url = new URL('http://localhost/api/cdn/vaults/42161.json')
    expect(getPath(url)).toEqual({ type: 'direct', path: 'vaults/42161.json' })
  })

  test('returns path by removing /cdn/ prefix', () => {
    const url = new URL('http://localhost/cdn/asset/ETHplus.md')
    expect(getPath(url)).toEqual({ type: 'direct', path: 'asset/ETHplus.md' })
  })

  test('query params take precedence over pathname', () => {
    const url = new URL('http://localhost/api/cdn/ignored?schema=vaults&file=1.json')
    expect(getPath(url)).toEqual({ type: 'direct', path: 'vaults/1.json' })
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

  describe('single vault pattern', () => {
    test('detects single vault pattern with /api/cdn/ prefix', () => {
      const url = new URL('http://localhost/api/cdn/vaults/1/0xb9228370e2fa4908fc2bf559a50bb77ba66fdd66.json')
      expect(getPath(url)).toEqual({
        type: 'single-vault',
        chainId: '1',
        address: '0xb9228370e2fa4908fc2bf559a50bb77ba66fdd66',
        path: 'vaults/1.json',
      })
    })

    test('detects single vault pattern with /cdn/ prefix', () => {
      const url = new URL('http://localhost/cdn/vaults/137/0xABCDEF1234567890ABCDEF1234567890ABCDEF12.json')
      expect(getPath(url)).toEqual({
        type: 'single-vault',
        chainId: '137',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        path: 'vaults/137.json',
      })
    })

    test('normalizes address to lowercase', () => {
      const url = new URL('http://localhost/api/cdn/vaults/42161/0xABCDEF1234567890ABCDEF1234567890ABCDEF12.json')
      const result = getPath(url)
      expect(result).toBeDefined()
      if (result && result.type === 'single-vault') {
        expect(result.address).toBe('0xabcdef1234567890abcdef1234567890abcdef12')
      }
    })

    test('does not match invalid address format', () => {
      const url = new URL('http://localhost/api/cdn/vaults/1/invalid-address.json')
      expect(getPath(url)).toEqual({ type: 'direct', path: 'vaults/1/invalid-address.json' })
    })

    test('does not match short address', () => {
      const url = new URL('http://localhost/api/cdn/vaults/1/0xabc.json')
      expect(getPath(url)).toEqual({ type: 'direct', path: 'vaults/1/0xabc.json' })
    })

    test('does not match non-json file', () => {
      const url = new URL('http://localhost/api/cdn/vaults/1/0xb9228370e2fa4908fc2bf559a50bb77ba66fdd66.txt')
      expect(getPath(url)).toEqual({ type: 'direct', path: 'vaults/1/0xb9228370e2fa4908fc2bf559a50bb77ba66fdd66.txt' })
    })
  })
})
