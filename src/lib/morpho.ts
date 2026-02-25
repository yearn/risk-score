export interface MorphoVault {
  name: string;
  address: string;
  riskLevel: number;
}

export interface ChainVaults {
  chainName: string;
  chainId: number;
  explorerUrl: string;
  morphoSlug: string;
  vaults: MorphoVault[];
}

const CHAIN_META: Record<
  string,
  { chainName: string; chainId: number; explorerUrl: string; morphoSlug: string }
> = {
  MAINNET: {
    chainName: "Ethereum",
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    morphoSlug: "ethereum",
  },
  BASE: {
    chainName: "Base",
    chainId: 8453,
    explorerUrl: "https://basescan.org",
    morphoSlug: "base",
  },
  POLYGON: {
    chainName: "Polygon",
    chainId: 137,
    explorerUrl: "https://polygonscan.com",
    morphoSlug: "polygon",
  },
  KATANA: {
    chainName: "Katana",
    chainId: 747474,
    explorerUrl: "https://katanascan.com",
    morphoSlug: "katana",
  },
};

const CHAIN_ORDER = ["MAINNET", "BASE", "POLYGON", "KATANA"];

const MARKETS_URL =
  "https://raw.githubusercontent.com/yearn/monitoring-scripts-py/main/morpho/markets.py";

function parseMorphoVaults(raw: string): ChainVaults[] {
  // Extract only the VAULTS_BY_CHAIN block
  const blockMatch = raw.match(
    /VAULTS_BY_CHAIN\s*=\s*\{([\s\S]*?)\n\}\s*\n/,
  );
  if (!blockMatch) throw new Error("Could not find VAULTS_BY_CHAIN in source");
  const block = blockMatch[1];

  // Match each Chain.<NAME>: [...] section within the block.
  // The chain-level closing ], is at 4-space indent; vault entries are at 8-space indent.
  const chainPattern = /Chain\.(\w+)\s*:\s*\[([\s\S]*?)\n    \],/g;
  // Handle both single-line ["name", "0x...", 1], and multi-line entries with trailing comma
  const vaultPattern = /\["([^"]+)",\s*"(0x[0-9a-fA-F]{40})",\s*(\d+),?\s*\]/g;

  const chainMap = new Map<string, MorphoVault[]>();
  let chainMatch;
  while ((chainMatch = chainPattern.exec(block)) !== null) {
    const chainKey = chainMatch[1];
    const entries = chainMatch[2];

    const vaults: MorphoVault[] = [];
    let vaultMatch;
    while ((vaultMatch = vaultPattern.exec(entries)) !== null) {
      const riskLevel = parseInt(vaultMatch[3], 10);
      vaults.push({
        name: vaultMatch[1],
        address: vaultMatch[2],
        riskLevel,
      });
    }

    if (vaults.length > 0) {
      chainMap.set(chainKey, vaults);
    }
  }

  return CHAIN_ORDER.filter((key) => chainMap.has(key)).map((key) => ({
    ...CHAIN_META[key],
    vaults: chainMap.get(key)!,
  }));
}

export async function fetchMorphoVaults(): Promise<ChainVaults[]> {
  const response = await fetch(MARKETS_URL);
  if (!response.ok)
    throw new Error(`Failed to fetch morpho markets: ${response.status}`);
  const raw = await response.text();
  return parseMorphoVaults(raw);
}
