export interface MonitoringItem {
  label: string;
  description: string;
}

export interface Protocol {
  id: string;
  name: string;
  defillamaSlug: string;
  items: MonitoringItem[];
  // Protocol name in the alerts API (= the `protocols/<name>/` dir in yearn/monitoring, as
  // returned by GET /v1/protocols). Site ids differ from API names (e.g. aave-v3 -> aave), so
  // this is the join key for live alert history. Left unset for protocols with no enabled
  // backend job yet (euler, pendle, silo) — the UI omits live data for those.
  apiProtocol?: string;
}

// --- API response types ---

export interface ApiMonitor {
  name: string;
  description: string;
  severity?: string;
}

export interface ApiProtocol {
  slug: string;
  display_name: string;
  description: string;
  cadence: string;
  monitor_count: number;
  disabled: boolean;
  tasks: string[];
  monitors: ApiMonitor[];
}

export interface ApiMonitoringResponse {
  version: string;
  data: ApiProtocol[];
  count: number;
}

// --- DefiLlama slug mapping (API slug -> defillamaSlug) ---
// Not provided by the monitoring API; maintained here.

const SLUG_TO_DEFILLAMA: Record<string, string> = {
  "3jane": "3jane",
  aave: "aave-v3",
  apyusd: "",
  cap: "cap-protocol",
  compound: "compound-v3",
  ethena: "ethena",
  euler: "euler",
  fluid: "fluid",
  infinifi: "infinifi",
  lido: "lido",
  "lrt-pegs": "",
  maker: "sky",
  maple: "maple",
  morpho: "morpho",
  pendle: "pendle",
  rtoken: "reserve-protocol",
  safe: "",
  silo: "silo-v2",
  stables: "",
  strata: "strata-finance",
  timelock: "",
  ustb: "superstate",
  usdai: "",
  yearn: "yearn-finance",
};

// monitoring.yaml slugs -> backend alert.protocol values.
// The monitoring.yaml slug may differ from the PROTOCOL constant used in
// the per-protocol Python scripts (e.g. slug "compound" but scripts use
// "comp"). This maps the slug to the actual alert.protocol value for live
// badge/feed matching. Slugs not in this map use the slug itself.
const SLUG_TO_ALERT_PROTOCOL: Record<string, string> = {
  compound: "comp",
  rtoken: "ethplus",
  // lrt-pegs sub-scripts emit different protocol values ("origin", "pegs")
  // so there is no single canonical match — leave apiProtocol empty.
  "lrt-pegs": "",
};

/** Transform the API response into the shape the monitoring page expects. */
export function transformApiProtocols(apiProtocols: ApiProtocol[]): Protocol[] {
  return apiProtocols
    .filter((p) => !p.disabled)
    .map((p) => ({
      id: p.slug,
      name: p.display_name,
      defillamaSlug: SLUG_TO_DEFILLAMA[p.slug] ?? "",
      apiProtocol: SLUG_TO_ALERT_PROTOCOL[p.slug] ?? p.slug,
      items: p.monitors.map((m) => ({
        label: m.name,
        description: m.description,
      })),
    }));
}

// --- Static fallback (used when the API is unreachable at build time) ---
// Last synced from monitoring.yaml on 2026-07-02.

export const FALLBACK_PROTOCOLS: Protocol[] = [
  {
    id: "3jane",
    name: "3Jane",
    defillamaSlug: "3jane",
    apiProtocol: "3jane",
    items: [
      {
        label: "Price Per Share",
        description: "PPS changes on USD3 and sUSD3 vaults vs cached prior runs",
      },
      {
        label: "TVL",
        description: "Alerts on >=15% absolute change in Total Value Locked",
      },
      {
        label: "Junior Buffer Ratio",
        description: "sUSD3 as % of USD3 supply — alerts if below 15%",
      },
      {
        label: "Vault Shutdown",
        description: "Alert-once on emergency shutdown status",
      },
      {
        label: "Debt Cap",
        description: "Governance debt cap changes",
      },
      {
        label: "Timelock",
        description: "TimelockController monitoring on Mainnet",
      },
    ],
  },
  {
    id: "aave-v3",
    name: "Aave V3",
    defillamaSlug: "aave-v3",
    apiProtocol: "aave",
    items: [
      {
        label: "Bad Debt Ratio",
        description: "Alerts if bad debt ratio exceeds 0.1% (via Risk DAO)",
      },
      {
        label: "Market Utilization",
        description: "Alerts if utilization exceeds 96%",
      },
      {
        label: "Governance Proposals",
        description: "Queued proposals to Aave Governance",
      },
      {
        label: "Payload Controller",
        description: "Execution delay monitoring (1 day minimum)",
      },
      {
        label: "Safe Multisigs",
        description:
          "Protocol and Governance Emergency Guardian multisig monitoring",
      },
    ],
  },
  {
    id: "cap",
    name: "CAP",
    defillamaSlug: "cap-protocol",
    apiProtocol: "cap",
    items: [
      {
        label: "Withdrawable Liquidity",
        description:
          "Alerts if total withdrawable liquidity across all cUSD assets falls below $100M",
      },
      {
        label: "Timelock",
        description: "Timelock monitoring with 24-hour delay on Mainnet",
      },
    ],
  },
  {
    id: "compound-v3",
    name: "Compound V3",
    defillamaSlug: "compound-v3",
    apiProtocol: "comp",
    items: [
      {
        label: "Market Utilization",
        description: "Alerts if utilization exceeds 99%",
      },
      {
        label: "Timelock Transactions",
        description: "2-day delay monitoring across all chains",
      },
      {
        label: "Governance Proposals",
        description: "Proposals via Compound API",
      },
      {
        label: "Collateral Risk",
        description:
          "Allocation ratios vs thresholds, total risk levels, borrow/supply ratio (>95% alert)",
      },
      {
        label: "Bad Debt",
        description: "Negative reserves detection",
      },
    ],
  },
  {
    id: "ethena",
    name: "Ethena",
    defillamaSlug: "ethena",
    apiProtocol: "ethena",
    items: [
      {
        label: "USDe Backing Ratio",
        description: "Via Chaos Labs attestation",
      },
      {
        label: "Attestation Freshness",
        description: "Alerts if attestation is older than 1 day",
      },
      {
        label: "Consistency Checks",
        description:
          "Delta neutral strategy, approved assets only, backing assets vs total supply",
      },
      {
        label: "Reserve Buffer",
        description: "Adequacy of reserve buffer",
      },
    ],
  },
  {
    id: "fluid",
    name: "Fluid",
    defillamaSlug: "fluid",
    apiProtocol: "fluid",
    items: [
      {
        label: "Governance Proposals",
        description: "Proposals via Fluid API",
      },
      {
        label: "Timelock",
        description: "InstaTimelock contract monitoring (1-day delay)",
      },
    ],
  },
  {
    id: "infinifi",
    name: "Infinifi",
    defillamaSlug: "infinifi",
    apiProtocol: "infinifi",
    items: [
      {
        label: "Reserves & Backing",
        description: "Protocol reserves, backing, and liquid USDC reserves",
      },
      {
        label: "Liquid Reserves",
        description: "Alerts if below $15M",
      },
      {
        label: "Backing Per iUSD",
        description: "Alerts if below 0.999",
      },
      {
        label: "Redemption Pressure",
        description: "Alerts if exceeding 80% of liquid reserves",
      },
      {
        label: "Farm Allocation",
        description: "Allocation shift monitoring",
      },
      {
        label: "Junior TVL Coverage",
        description: "Alerts if below 50% of risky farm exposure",
      },
      {
        label: "Timelock",
        description: "Longtimelock and Shorttimelock monitoring on Mainnet",
      },
    ],
  },
  {
    id: "lido",
    name: "Lido",
    defillamaSlug: "lido",
    apiProtocol: "lido",
    items: [
      {
        label: "DAO Voting",
        description: "Governance monitoring via Tenderly alerts",
      },
      {
        label: "Proxy Contracts",
        description:
          "Locator proxy, Staking Router, Withdrawal Queue updates",
      },
      {
        label: "Emergency Brakes",
        description: "Multisig and GateSeal Committee monitoring",
      },
      {
        label: "stETH Exchange Rate",
        description:
          "Exchange rate vs validator rate — alerts if deviation exceeds 2%",
      },
      {
        label: "Curve Pool",
        description: "stETH/ETH Curve pool monitoring",
      },
      {
        label: "Timelock",
        description: "Lido Timelock monitoring on Mainnet",
      },
    ],
  },
  {
    id: "lrt-pegs",
    name: "LRT Pegs",
    defillamaSlug: "",
    items: [
      {
        label: "Curve Pool Depegs",
        description:
          "pufETH-wstETH, ETH+/WETH, weETH-WETH, frxETH-WETH, OETH/ETH",
      },
      {
        label: "Lombard (LBTC)",
        description: "Oracle feed via Redstone and timelock monitoring",
      },
      {
        label: "Renzo (ezETH)",
        description: "TimelockController monitoring on Mainnet",
      },
      {
        label: "Origin (superOETH)",
        description: "Wrapped share price, vault backing, and timelock monitoring on Base",
      },
      {
        label: "Ether.fi (eETH)",
        description: "Timelock monitoring on Mainnet",
      },
      {
        label: "Kelp DAO (rsETH)",
        description: "Timelock monitoring (10-day delay)",
      },
      {
        label: "Puffer (pufETH)",
        description: "Timelock monitoring on Mainnet",
      },
    ],
  },
  {
    id: "maker-dao",
    name: "Maker DAO",
    defillamaSlug: "sky",
    apiProtocol: "maker",
    items: [
      {
        label: "Executive Proposals",
        description: "From Sky governance portal",
      },
      {
        label: "DSPause Contract",
        description: "Proposal scheduling monitoring (16-hour delay)",
      },
      {
        label: "PSM USDC Balance",
        description: "Alerts if below 2B USDC",
      },
      {
        label: "Token Upgrades",
        description: "sUSDS and USDS token upgrade monitoring",
      },
      {
        label: "Tenderly Alerts",
        description: "Critical governance function monitoring",
      },
    ],
  },
  {
    id: "maple",
    name: "Maple Finance",
    defillamaSlug: "maple",
    apiProtocol: "maple",
    items: [
      {
        label: "Price Per Share",
        description: "Alerts on any PPS decrease",
      },
      {
        label: "TVL",
        description: "Alerts if >=15% change",
      },
      {
        label: "Unrealized Losses",
        description: "Onchain and subgraph — alerts if >=0.5% of pool",
      },
      {
        label: "Withdrawal Queue",
        description: "Queue vs liquid funds — alerts if exceeding 80%",
      },
      {
        label: "Loan Collateral Risk",
        description: "Weighted USD-based collateral risk and ratio (<140% alert)",
      },
      {
        label: "Stablecoin Peg",
        description: "DeFiLlama peg monitoring — depeg alert below $0.97",
      },
      {
        label: "Timelock",
        description: "Maple GovernorTimelock monitoring on Mainnet",
      },
    ],
  },
  {
    id: "morpho",
    name: "Morpho",
    defillamaSlug: "morpho",
    apiProtocol: "morpho",
    items: [
      {
        label: "Governance Timelock",
        description:
          "3-day minimum for vault whitelisting, timelock value changes",
      },
      {
        label: "Supply Caps & Guardian",
        description: "Changes to supply caps and guardian address",
      },
      {
        label: "Bad Debt Ratio",
        description: "Alerts if exceeding 0.5%",
      },
      {
        label: "Utilization Ratio",
        description: "Alerts if exceeding 95%",
      },
      {
        label: "Vault Risk Levels",
        description: "Risk levels vs thresholds across Mainnet and Base vaults",
      },
      {
        label: "Market Allocation",
        description: "Risk-adjusted allocation ratio monitoring",
      },
    ],
  },
  {
    id: "rtoken",
    name: "RToken (ETH+)",
    defillamaSlug: "reserve-protocol",
    apiProtocol: "ethplus",
    items: [
      {
        label: "Collateral Coverage",
        description: "Alerts if backing falls below 104%",
      },
      {
        label: "StRSR Exchange Rate",
        description: "Stability monitoring — alerts if rate falls below initial",
      },
      {
        label: "Redemption Available",
        description: "Alerts if below defined ETH threshold",
      },
      {
        label: "Supply Changes",
        description: "Via Tenderly alerts",
      },
      {
        label: "Timelock",
        description: "Contract monitoring (2-day delay)",
      },
    ],
  },
  {
    id: "strata",
    name: "Strata",
    defillamaSlug: "strata-finance",
    apiProtocol: "strata",
    items: [
      {
        label: "srUSDe Exchange Rate",
        description: "Alerts if exchange rate decreases",
      },
      {
        label: "Senior Coverage Ratio",
        description: "Alerts if senior coverage falls below 105%",
      },
      {
        label: "Junior Tranche Drain",
        description: "Alerts on rapid jrUSDe totalAssets drop (>=15%)",
      },
      {
        label: "Strategy Balance",
        description:
          "Alerts if sUSDe strategy balance drops significantly (>=20%)",
      },
      {
        label: "TVL",
        description: "Alerts on >=15% change in Total Value Locked",
      },
      {
        label: "sUSDe Dependency",
        description:
          "sUSDe exchange rate monotonicity and cooldown period changes",
      },
      {
        label: "Timelock",
        description: "48h and 24h timelock monitoring on Mainnet",
      },
    ],
  },
  {
    id: "superstate-ustb",
    name: "Superstate USTB",
    defillamaSlug: "superstate",
    apiProtocol: "ustb",
    items: [
      {
        label: "NAV/Share Monotonicity",
        description:
          "Alerts if NAV per share decreases — indicates fund losses",
      },
      {
        label: "Oracle Divergence",
        description:
          "Alerts if Continuous Price Oracle and Chainlink feed differ by more than 0.5%",
      },
      {
        label: "Redemption Capacity",
        description: "Alerts if RedemptionIdle USDC balance falls below $500K",
      },
      {
        label: "Supply Changes",
        description: "Alerts if total supply changes by more than 10%",
      },
      {
        label: "Oracle Staleness",
        description:
          "Alerts if oracle checkpoint is older than 4 days (reverts at 5 days)",
      },
      {
        label: "Stablecoin Price",
        description: "Depeg alert if USTB price falls below $10.50",
      },
    ],
  },
  {
    id: "usdai",
    name: "USDAI",
    defillamaSlug: "",
    apiProtocol: "usdai",
    items: [
      {
        label: "Collateral Backing",
        description: "USDai supply vs wM collateral backing",
      },
      {
        label: "Mint Ratio",
        description: "0.995 compliance and change monitoring",
      },
      {
        label: "Buffer Tracking",
        description: "Implied collateral minus supply — alerts if below $1M",
      },
      {
        label: "Loan Activity",
        description:
          "Active loans vs total supply, new originations and repayments",
      },
      {
        label: "Governance",
        description: "Admin Safe events",
      },
    ],
  },
  {
    id: "yearn",
    name: "Yearn",
    defillamaSlug: "yearn-finance",
    apiProtocol: "yearn",
    items: [
      {
        label: "Large Flows",
        description:
          "Deposit/withdrawal flows exceeding $5M or 10% of vault totalSupply",
      },
      {
        label: "Token Pricing",
        description:
          "Non-stable token pricing via CoinGecko with onchain fallback",
      },
      {
        label: "Timelock",
        description:
          "TimelockController monitoring across Mainnet, Base, Arbitrum, Polygon, Optimism, and Katana",
      },
    ],
  },
];
