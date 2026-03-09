const CHAIN_ID_MAP: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  polygon: 137,
  optimism: 10,
  bnb: 56,
  avalanche: 43114,
};

export function protocolIconUrl(defillamaSlug: string): string {
  if (!defillamaSlug) return "";
  return `https://icons.llamao.fi/icons/protocols/${defillamaSlug}?w=48&h=48`;
}

export function chainIconUrl(chain: string): string {
  const lower = chain.toLowerCase();
  if (lower.includes("hyperliquid") || lower.includes("hyperev")) {
    return "https://icons.llamao.fi/icons/chains/rsz_hyperliquid?w=48&h=48";
  }
  for (const [key, id] of Object.entries(CHAIN_ID_MAP)) {
    if (lower.includes(key)) {
      return `https://token-assets-one.vercel.app/api/chains/${id}/logo-32.png?fallback=true`;
    }
  }
  return "";
}
