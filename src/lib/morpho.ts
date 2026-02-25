export interface MorphoVault {
  name: string;
  address: string;
  riskLevel: number;
}

export interface MorphoMarket {
  uniqueKey: string;
  description: string;
  riskLevel: number;
}

interface ChainMeta {
  chainName: string;
  chainId: number;
  explorerUrl: string;
  morphoSlug: string;
}

export interface ChainVaults extends ChainMeta {
  vaults: MorphoVault[];
}

export interface ChainMarkets extends ChainMeta {
  markets: MorphoMarket[];
}

const CHAIN_META: Record<string, ChainMeta> = {
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

let cachedRaw: string | null = null;

async function fetchRaw(): Promise<string> {
  if (cachedRaw) return cachedRaw;
  const response = await fetch(MARKETS_URL);
  if (!response.ok)
    throw new Error(`Failed to fetch morpho markets: ${response.status}`);
  cachedRaw = await response.text();
  return cachedRaw;
}

function parseMorphoVaults(raw: string): ChainVaults[] {
  const blockMatch = raw.match(
    /VAULTS_BY_CHAIN\s*=\s*\{([\s\S]*?)\n\}\s*\n/,
  );
  if (!blockMatch) throw new Error("Could not find VAULTS_BY_CHAIN in source");
  const block = blockMatch[1];

  const chainPattern = /Chain\.(\w+)\s*:\s*\[([\s\S]*?)\n    \],/g;
  const vaultPattern =
    /\["([^"]+)",\s*"(0x[0-9a-fA-F]{40})",\s*(\d+),?\s*\]/g;

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

function parseMorphoMarkets(raw: string): ChainMarkets[] {
  // Collect markets from MARKETS_RISK_1 through MARKETS_RISK_5
  const chainMap = new Map<string, MorphoMarket[]>();

  for (let risk = 1; risk <= 5; risk++) {
    const blockPattern = new RegExp(
      `MARKETS_RISK_${risk}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}\\s*\\n`,
    );
    const blockMatch = raw.match(blockPattern);
    if (!blockMatch) continue;
    const block = blockMatch[1];

    const chainPattern = /Chain\.(\w+)\s*:\s*\[([\s\S]*?)\n    \],/g;
    // Match hex key with optional inline comment: "0x..." # description
    const marketPattern =
      /^\s*"(0x[0-9a-fA-F]{64})",?\s*(?:#\s*(.*))?$/gm;

    let chainMatch;
    while ((chainMatch = chainPattern.exec(block)) !== null) {
      const chainKey = chainMatch[1];
      const entries = chainMatch[2];

      const existing = chainMap.get(chainKey) ?? [];
      let marketMatch;
      while ((marketMatch = marketPattern.exec(entries)) !== null) {
        const comment = marketMatch[2]?.trim() ?? "";
        // Extract pair name from comment like "WBTC/USDC -> lltv 86%, oracle: ..."
        const description = comment.split("->")[0].trim();
        existing.push({
          uniqueKey: marketMatch[1],
          description,
          riskLevel: risk,
        });
      }
      chainMap.set(chainKey, existing);
    }
  }

  return CHAIN_ORDER.filter(
    (key) => chainMap.has(key) && chainMap.get(key)!.length > 0,
  ).map((key) => ({
    ...CHAIN_META[key],
    markets: chainMap.get(key)!,
  }));
}

export async function fetchMorphoVaults(): Promise<ChainVaults[]> {
  const raw = await fetchRaw();
  return parseMorphoVaults(raw);
}

export async function fetchMorphoMarkets(): Promise<ChainMarkets[]> {
  const raw = await fetchRaw();
  return parseMorphoMarkets(raw);
}
