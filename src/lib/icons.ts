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

export function tokenIconUrl(address: string, chainId: number = 1): string {
  if (!address) return "";
  return `https://token-assets-one.vercel.app/api/tokens/${chainId}/${address}/logo-32.png`;
}

// DefiLlama's token-icon CDN, keyed by chain id + address. Use for tokens that
// have a DefiLlama token page (e.g. /token/USDG) but no protocol icon.
export function defillamaTokenIconUrl(
  address: string,
  chainId: number = 1,
): string {
  if (!address) return "";
  return `https://token-icons.llamao.fi/icons/tokens/${chainId}/${address}?h=48&w=48`;
}

// Resolve a typed DefiLlama icon reference to a CDN URL. One reusable form that
// covers the different DefiLlama listings an asset may appear under:
//   "protocol:<slug>"        -> /protocol/<slug>        (e.g. apyx-protocol)
//   "stablecoin:<slug>"      -> /stablecoin/<slug>      (e.g. global-dollar)
//   "token:<address>"        -> /token/<address> on Ethereum
//   "token:<chainId>:<addr>" -> /token/<address> on the given chain
export function defillamaIconUrl(ref: string): string {
  if (!ref) return "";
  const sep = ref.indexOf(":");
  if (sep === -1) return "";
  const kind = ref.slice(0, sep);
  const value = ref.slice(sep + 1);
  switch (kind) {
    case "protocol":
      return protocolIconUrl(value);
    case "stablecoin":
    case "pegged":
      return `https://icons.llamao.fi/icons/pegged/${value}?w=48&h=48`;
    case "token": {
      const parts = value.split(":");
      const [chainId, address] =
        parts.length === 2 ? [Number(parts[0]), parts[1]] : [1, parts[0]];
      return defillamaTokenIconUrl(address, chainId);
    }
    default:
      return "";
  }
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
