export interface MonitoringItem {
  label: string;
  description: string;
}

export interface Protocol {
  id: string;
  name: string;
  defillamaSlug: string;
  frequency: string;
  items: MonitoringItem[];
}

export const protocols: Protocol[] = [
  {
    id: "3jane",
    name: "3Jane",
    defillamaSlug: "3jane",
    frequency: "Hourly",
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
    frequency: "Hourly",
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
    id: "compound-v3",
    name: "Compound V3",
    defillamaSlug: "compound-v3",
    frequency: "Hourly / Daily",
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
    frequency: "Daily",
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
    id: "euler",
    name: "Euler",
    defillamaSlug: "euler",
    frequency: "Hourly",
    items: [
      {
        label: "Vault Risk Levels",
        description: "Computed risk vs maximum threshold",
      },
      {
        label: "Vault Allocation Ratios",
        description: "Risk-adjusted allocation thresholds",
      },
      {
        label: "Debt Supply Ratio",
        description: "Alerts if ratio exceeds 60%",
      },
      {
        label: "Safe Multisig",
        description: "4/7 multisig transaction queue monitoring",
      },
    ],
  },
  {
    id: "fluid",
    name: "Fluid",
    defillamaSlug: "fluid",
    frequency: "Hourly",
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
    frequency: "Hourly",
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
    frequency: "Hourly / Real-time",
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
    frequency: "Hourly",
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
    frequency: "Hourly",
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
    frequency: "Hourly / Daily",
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
        description: "On-chain and subgraph — alerts if >=0.5% of pool",
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
    frequency: "Hourly / Daily",
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
    id: "pendle",
    name: "Pendle",
    defillamaSlug: "pendle",
    frequency: "Hourly",
    items: [
      {
        label: "Safe Multisig",
        description: "2/4 governance on Mainnet and Arbitrum",
      },
      {
        label: "Proxy Ownership",
        description: "Governance proxy contract ownership monitoring",
      },
      {
        label: "SY Token Governance",
        description: "SY token governance and pause functionality",
      },
      {
        label: "Core Contracts",
        description:
          "vePENDLE, PENDLE, RewardDistributor, and Voting contract monitoring",
      },
    ],
  },
  {
    id: "rtoken",
    name: "RToken (ETH+)",
    defillamaSlug: "reserve-protocol",
    frequency: "Hourly / Real-time",
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
    id: "silo",
    name: "Silo",
    defillamaSlug: "silo-v2",
    frequency: "Hourly",
    items: [
      {
        label: "Bad Debt",
        description: "Positions with riskFactor > 1",
      },
      {
        label: "Timelock",
        description: "Contract monitoring (2-day minimum delay)",
      },
      {
        label: "Safe Multisig",
        description:
          "3/6 multisig monitoring on Mainnet, Optimism, and Arbitrum",
      },
    ],
  },
  {
    id: "usdai",
    name: "USDAI",
    defillamaSlug: "",
    frequency: "Hourly",
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
    frequency: "Hourly",
    items: [
      {
        label: "Large Flows",
        description:
          "Deposit/withdrawal flows exceeding $5M or 10% of vault totalSupply",
      },
      {
        label: "Token Pricing",
        description:
          "Non-stable token pricing via CoinGecko with on-chain fallback",
      },
      {
        label: "Timelock",
        description:
          "TimelockController monitoring across Mainnet, Base, Arbitrum, Polygon, Optimism, and Katana",
      },
    ],
  },
];
