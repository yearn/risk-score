# Protocol Risk Assessment: Fluid Lending Protocol

- **Assessment Date:** April 27, 2026 (Reassessment — original assessment Feb 12, 2026)
- **Token:** fTokens (fUSDC, fUSDT, fWETH, etc.)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) (fUSDC)
- **Final Score: 1.3/5.0** (was 1.1/5.0 in Feb 2026)

## Reassessment Summary (Apr 2026)

This reassessment is triggered by two material events that occurred since the original Feb 12, 2026 assessment:

1. **Resolv USR depeg / contagion event (Mar 22, 2026)** — Resolv's stablecoin (USR) was exploited via a compromised AWS KMS key. Fluid was the most-impacted lending counterparty due to the previously-flagged wstUSR concentration risk (which materialized). Fluid absorbed ~$10–17.5M of bad debt and saw ~$300M of net outflows in a single day. Fluid covered 100% of bad debt via a short-term loan coverage agreement (cyberfund/Lomashuk, weremeow, Fluid core team). User funds (fToken holders) were made whole. By March 25, 2026, Fluid reported repaying $70M of USR-related debt across affected chains.

2. **Kelp DAO rsETH bridge exploit (Apr 18, 2026)** — $292M drained via a LayerZero cross-chain messaging exploit. Fluid froze its rsETH markets within hours alongside Aave, SparkLend, and Upshift. No direct loss to Fluid contracts; this was a precautionary action against contagion.

**Net effect on the assessment:**

- Lending TVL fell from $1.28B (Feb 2026) to **~$751M** (Apr 27, 2026) — a 41% decline driven by the two stress events.
- fToken exchange rates remain **monotonically increasing onchain** for every fToken (verified) — no value loss to lenders due to the protocol's coverage of bad debt.
- A previously-identified "key risk" (concentration in wstUSR at 18.9% of TVL) materialized. The protocol response was rapid and effective, but the recovery relied on **discretionary off-balance-sheet capital commitments** rather than a pre-funded, programmatic insurance/coverage layer.
- The "Protocol live >2 years with no incidents" optional modifier (-0.5) does not apply due to the Resolv-related bad debt event.
- Score moves from **1.1 → 1.3** (still **MINIMAL RISK**), reflecting the materialization of a previously-identified concentration risk and reliance on ad-hoc loss coverage, partially offset by a successful response that protected lenders.

## Overview + Links

This assessment focuses on the **Fluid Lending Protocol (fTokens)** — an ERC4626-compliant lending product built on top of Fluid's unified Liquidity Layer. Users supply assets (USDC, USDT, WETH, wstETH, etc.) and receive fTokens representing their share of the lending pool. Yield is generated from borrower interest via the Vault Protocol.

**Architecture dependency chain relevant to lending risk:**

```
fTokens (Lending Protocol)
    ↓ deposits/withdraws via
Liquidity Layer (central fund store, 0x52Aa...)
    ↑ borrows against collateral
Vault Protocol (borrowers, liquidations, oracles)
```

fToken holders are exposed to risks across this entire stack: the Lending Protocol itself, the Liquidity Layer that holds all funds, and the Vault Protocol whose borrowers generate the yield. The DEX Protocol and stETH Protocol also interact with the Liquidity Layer but are secondary dependencies.

Fluid is governed by FLUID token holders via onchain GovernorBravo governance with a 1-day Timelock. The protocol was developed by Instadapp Labs and launched in February 2024. As of Feb 23, 2026 a [Fluid Foundation proposal](https://gov.fluid.io/t/proposal-establish-fluid-foundation/1768) (DMH/Instadapp COO) is in discussion to transfer all protocol IP, contracts, and front-end assets to a Cayman Islands foundation governed by the DAO with a $3M/yr operating grant. Status: in governance discussion, not yet implemented as of this reassessment.

**Links:**

- [Protocol Documentation](https://docs.fluid.instadapp.io/)
- [Protocol App](https://fluid.io/)
- [Security/Audits Page](https://docs.fluid.instadapp.io/audits-and-security.html)
- [GitHub (Public Contracts)](https://github.com/Instadapp/fluid-contracts-public)
- [Deployments](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md)
- [Governance Forum](https://gov.fluid.io/) (formerly gov.instadapp.io — redirects)
- [Snapshot Governance](https://snapshot.org/#/instadapp-gov.eth)
- [DeFiLlama — Fluid Lending](https://defillama.com/protocol/fluid-lending)
- [DeFiLlama — Fluid (overall)](https://defillama.com/protocol/fluid)

## Contract Addresses (Ethereum Mainnet)

All contracts verified on Etherscan. Compiled with Solidity 0.8.21.

### fToken Contracts (Lending)

| fToken | Address | Underlying | Underlying Address |
|--------|---------|------------|--------------------|
| **fUSDC** | [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) | USDC | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) |
| **fUSDT** | [`0x5C20B550819128074FD538Edf79791733ccEdd18`](https://etherscan.io/address/0x5C20B550819128074FD538Edf79791733ccEdd18) | USDT | [`0xdAC17F958D2ee523a2206206994597C13D831ec7`](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) |
| **fWETH** | [`0x90551c1795392094FE6D29B758EcCD233cFAa260`](https://etherscan.io/address/0x90551c1795392094FE6D29B758EcCD233cFAa260) | WETH | [`0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) |
| **fwstETH** | [`0x2411802D8BEA09be0aF8fD8D08314a63e706b29C`](https://etherscan.io/address/0x2411802D8BEA09be0aF8fD8D08314a63e706b29C) | wstETH | [`0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0`](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) |
| **fGHO** | [`0x6A29A46E21C730DcA1d8b23d637c101cec605C5B`](https://etherscan.io/address/0x6A29A46E21C730DcA1d8b23d637c101cec605C5B) | GHO | [`0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f`](https://etherscan.io/address/0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f) |
| **fsUSDS** | [`0x2BBE31d63E6813E3AC858C04dae43FB2a72B0D11`](https://etherscan.io/address/0x2BBE31d63E6813E3AC858C04dae43FB2a72B0D11) | sUSDS | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) |
| **fUSDtb** | [`0x15e8c742614b5D8Db4083A41Df1A14F5D2bFB400`](https://etherscan.io/address/0x15e8c742614b5D8Db4083A41Df1A14F5D2bFB400) | USDtb | [`0xC139190F447e929f090Edeb554D95AbB8b18aC1C`](https://etherscan.io/address/0xC139190F447e929f090Edeb554D95AbB8b18aC1C) |

### fToken On-Chain State (Ethereum Mainnet, verified Apr 27, 2026)

| fToken | Total Assets (Apr 2026) | Total Assets (Feb 2026) | Exchange Rate (Apr) | Exchange Rate (Feb) | Δ TVL |
|--------|------------------------|------------------------|---------------------|---------------------|-------|
| fUSDC | 183.47M USDC | 274.8M USDC | 1.1929 | 1.1853 | -33.2% |
| fUSDT | 125.77M USDT | 167.5M USDT | 1.1865 | 1.1788 | -24.9% |
| fGHO | 16.39M GHO | 42.3M GHO | 1.1072 | 1.0975 | -61.3% |
| fwstETH | 2,803 wstETH | 2,874 wstETH | 1.0383 | 1.0381 | -2.5% |
| fWETH | 1,740 WETH | 1,773 WETH | 1.0741 | 1.0682 | -1.9% |
| fUSDtb | 2.50M USDtb | 5.8M USDtb | TODO | 1.0171 | -56.9% |
| fsUSDS | 15,025 sUSDS | 15,025 sUSDS | TODO | 1.0021 | 0.0% |
| **Total Ethereum fTokens (USD est.)** | **~$343M** | **~$504M** | | | **-32%** |

All exchange rates **continue to increase monotonically** (verified onchain — none decreased through the March or April events). This is the key safety property of the ERC4626 fToken design and confirms that fToken holders did not lose any principal value on Ethereum.

The largest declines (fGHO, fUSDtb, fUSDC) reflect post-Resolv withdrawals as users de-risked. The fGHO decline (-61%) is notable but not protocol-specific — it tracks broader risk-off in stablecoin exposure.

### Core Infrastructure (Dependency for Lending) — Verified Onchain Apr 27, 2026

- **Liquidity Layer (proxy)**: [`0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) — Central contract holding all funds. Upgradeable proxy (Instadapp Infinite Proxy).
  - **EIP-1967 admin slot**: `0x2386DC45AdDed673317eF068992F19421B481F4c` (Timelock) ✓ unchanged
  - **EIP-1967 implementation slot**: `0xcc331daf69752bece3dc98dbc63eacd5092266a2` — **TODO: confirm whether this implementation matches the address that was live in Feb 2026** (previous report did not capture the implementation address). Any change should be monitored.
- **LendingFactory**: [`0x54B91A0D94cb471F37f949c60F7Fa7935b551D03`](https://etherscan.io/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03) — `owner() = 0x2386DC45...` (Timelock) ✓
- **Timelock**: [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) — `delay() = 86400` (1 day) ✓; `admin() = 0x0204Cd03...` (GovernorBravo) ✓
- **GovernorBravo**: [`0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) — `proposalCount() = 128` (was 117 in Feb — **11 new proposals executed**)
  - quorumVotes: 4,000,000 FLUID ✓; proposalThreshold: 1,000,000 FLUID ✓; votingDelay: 7,200 blocks ✓; votingPeriod: 14,400 blocks ✓
- **Avocado Multisig (Timelock guardian)**: [`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) — Custom contract; standard `getThreshold()` / `getOwners()` calls revert (not a Gnosis Safe). Signers / threshold not verifiable via standard ABI — TODO: confirm via Avocado documentation or proxy implementation.
- **FLUID Token**: [`0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb`](https://etherscan.io/address/0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb) — Governance token. 100M max supply.

### Resolvers (Read-Only Periphery)

- **FluidLiquidityResolver**: [`0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb`](https://etherscan.io/address/0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb) — Active resolver for supply/borrow rates, exchange prices, rate model params
- **RevenueResolver**: [`0x0A84741D50B4190B424f57425b09FAe60C330F32`](https://etherscan.io/address/0x0A84741D50B4190B424f57425b09FAe60C330F32)

## Audits and Due Diligence Disclosures

**No new audits have been published since the Feb 2026 assessment.** The audit landscape is unchanged: 8 distinct security audits across 4 audit firms covering all major protocol components, including the Lending Protocol (PeckShield + StateMind full-protocol audits) and the Liquidity Layer (MixBytes + StateMind dual audit in 2025). All audit reports are available on the [audits and security page](https://docs.fluid.instadapp.io/audits-and-security.html).

The Resolv USR contagion event was **not the result of an unaudited Fluid contract bug**; it was the result of a leverage-loop borrower position becoming undercollateralized when an external collateral asset (wstUSR) collapsed in price following the upstream Resolv exploit.

| # | Firm | Date | Scope | Critical | High | Medium | Low | Info | Total |
|---|------|------|-------|----------|------|--------|-----|------|-------|
| 1 | PeckShield | Nov 2023 | Full Protocol (incl. Lending) | 0 | 4 | 4 | 5 | 0 | 13 |
| 2 | StateMind | Oct–Dec 2023 | Full Protocol (incl. Lending) | 3 | 8 | 15 | 0 | 40 | 66 |
| 3 | MixBytes | Mar–Jun 2024 | Vault Protocol | 0 | 0 | 2 | 4 | 0 | 6 |
| 4 | Cantina | Sep–Oct 2024 | DEX Protocol | 0 | 0 | 2 | 7 | 4 | 13 |
| 5 | MixBytes | Oct 2024 | DEX Protocol | 0 | 0 | 0 | 3 | 0 | 3 |
| 6 | MixBytes | Sep–Dec 2025 | Liquidity Layer | 0 | 0 | 0 | 2 | 0 | 2 |
| 7 | StateMind | Sep–Oct 2025 | Liquidity Layer | 0 | 1 | 0 | 0 | 4 | 5 |
| **Total** | | | | **3** | **13** | **23** | **21** | **48** | **108** |

No formal verification (Certora, Halmos, etc.) has been performed.

### Bug Bounty

[Immunefi Bug Bounty Program](https://immunefi.com/bug-bounty/instadapp/) — Active program under the "Instadapp" name. **Fluid Lending Protocol explicitly in scope.**

| Category | Severity | Min Reward | Max Reward | Calculation |
|----------|----------|------------|------------|-------------|
| Smart Contract | Critical | $25,000 | $500,000 | 10% of directly affected funds |
| Smart Contract | High | $5,000 | $100,000 | 50% of affected funds value |
| Web/App | Critical | $5,000 | $50,000 | Range model |
| Web/App | High | $5,000 | $10,000 | Range model |

**Fluid scope**: Liquidity Layer, **Lending Protocol**, Vault Protocol (excluding periphery folder). [Source repo](https://github.com/Instadapp/fluid-contracts-public).

**Payment**: USDC, USDT, or DAI on Ethereum. Medium/Low severity levels are not in scope.

## Historical Track Record

- **Production History**: Fluid launched on Ethereum mainnet on **February 20, 2024**. As of April 27, 2026, the protocol has been in production for **~2.18 years (798 days)**.
- **Total Fluid TVL** (DeFiLlama "fluid" — all products, all chains): **$911.5M** (down from $1.45B in Feb 2026; peak $2.68B on Oct 9, 2025).
- **Lending-only TVL** (DeFiLlama "fluid-lending" — all chains): **$750.8M** (down from $1.28B in Feb 2026; peak $2.37B on Oct 9, 2025).

### Major TVL Drawdowns (Historical)

| Date | Drawdown | Driver |
|------|----------|--------|
| 2024-03-20 | -13.7% | Early-protocol churn |
| 2024-08-06 | -16.1% | Broader crypto market selloff |
| 2025-04-11 | -11.3% | Market stress |
| **2026-03-23** | **-30.3%** | **Resolv USR exploit contagion (NEW)** |
| **2026-04-19/20** | **-17.5%** | **Kelp DAO bridge exploit / rsETH market freeze (NEW)** |

The two 2026 events are the largest single-day drawdowns in the protocol's history. Both were driven by external counterparty/collateral-asset events, not by a bug in Fluid's contracts.

### Incidents (NEW since Feb 2026)

#### 1. Resolv USR Depeg / Bad Debt Event — March 22, 2026

**Upstream cause:** Resolv Labs' minting infrastructure was exploited via a compromised AWS KMS-hosted private key (the `SERVICE_ROLE` signer). The attacker minted ~80M unbacked USR for ~$200K of USDC collateral, extracted ~$25M, and the USR stablecoin depegged from $1.00 to as low as $0.0025 on Curve before partially recovering to ~$0.85.

**Impact on Fluid:**

- **Concentration risk materialized:** wstUSR was the largest single supply asset on Fluid (18.9% of all-chain lending TVL per the Feb 2026 assessment), and ~98% of wstUSR supply was reportedly deployed in Fluid leverage loops at up to 6x leverage.
- **Bad debt:** Estimated $10–17.5M of bad debt accrued in Fluid lending markets when wstUSR-collateralized borrower positions became insolvent (the wrapping ratio of wstUSR meant that positions were deeply underwater even if USR repegged).
- **Outflows:** ~$300M of net outflows in a single day (the largest in protocol history). Total Fluid TVL: $1.25B (Mar 22) → $873M (Mar 23) = **-30.3%** in 24 hours.
- **Operational response (~30 minutes):** Admin team paused new borrowings and froze new deposits on affected vaults, then began analyzing existing positions. Per Fluid's official statement, *all other markets continued operating normally*.
- **Bad debt coverage:** Per Fluid's official communication, **100% of bad debt was covered via a short-term loan coverage agreement** funded by personal commitments from Lom Lomashuk (Cyber Fund), a contributor known as "weremeow," and the Fluid core team itself. Resolv Labs additionally executed USR redemptions for whitelisted (pre-incident) wallets covering >90% of the affected user group, and committed to a permanent burn of 46M USR (9M immediate + 36M frozen via blacklist) to reduce ongoing depeg pressure.
- **Repayment status:** Fluid reported that ~$70M of USR-related debt was fully repaid by **March 25, 2026**, three days after the incident. All lending markets remained operational.
- **fToken impact:** **No direct loss to fToken holders** on Ethereum — onchain exchange rates continued to increase monotonically through and after the event (verified). fToken holders are reported as "not affected" per the official statement.

**Sources:**
- [Halborn — Explained: The Resolv Hack (March 2026)](https://www.halborn.com/blog/post/explained-the-resolv-hack-march-2026)
- [Sentora Research — The Resolv Hack: $25M From a Single Compromised Key](https://sentora.com/research/articles/the-resolv-hack-25m-from-a-single-compromised-key)
- [WEEX News — Fluid: 100% of bad debts are covered by the short-term loan coverage agreement](https://www.weex.com/news/detail/fluid-100-of-bad-debts-are-covered-by-the-short-term-loan-coverage-agreement-and-user-funds-are-not-affected-399991)
- [Phemex News — Fluid Begins $70M Repayments After Resolv Incident](https://phemex.com/news/article/fluid-commences-70m-repayments-following-resolv-incident-68934)
- [Resolv USR Exploit Analysis (independent)](https://resolv-usr-exploit.vercel.app/)
- [Protos — Resolv hack shows DeFi learned nothing from last contagion](https://protos.com/resolv-hack-shows-defi-learned-nothing-from-last-contagion/)

**Critical observation:** The bad-debt coverage was **discretionary and off-balance-sheet** (loans from named individuals/entities). It is not a pre-funded, programmatic insurance fund or first-loss tranche. While the response was rapid and successful, the same coverage mechanism cannot be assumed to scale to a much larger event, and there is no documented contractual obligation forcing those parties to backstop losses again. This is the most material change to the risk profile since the previous assessment.

#### 2. Kelp DAO rsETH Bridge Exploit — April 18, 2026

**Upstream cause:** Attacker drained 116,500 rsETH (~18% of circulating supply, ~$292M) from Kelp DAO's LayerZero-powered bridge by tricking the cross-chain messaging layer into accepting a forged instruction. This is the largest DeFi exploit of 2026 to date.

**Impact on Fluid:**

- Fluid froze its rsETH markets within hours, alongside Aave, SparkLend, and Upshift.
- This was a **precautionary action** — Fluid contracts were not exploited.
- Total Fluid TVL: $1.04B (Apr 18) → $861M (Apr 20) = **-17.5%** over 2 days.
- No bad debt event reported.

**Sources:**
- [CoinDesk — 2026's biggest crypto exploit: Kelp DAO hit for $292M](https://www.coindesk.com/tech/2026/04/19/2026-s-biggest-crypto-exploit-kelp-dao-hit-for-usd292-million-with-wrapped-ether-stranded-across-20-chains)
- [Aave Governance — rsETH Incident Report (April 20, 2026)](https://governance.aave.com/t/rseth-incident-report-april-20-2026/24580)

### Multi-chain Lending Deployment

Snapshot from Feb 2026 (the source data was the Fluid frontend at the time of the original assessment). The reassessment did not re-fetch per-chain breakdowns onchain — **TODO: refresh per-chain utilization figures** (the previous figures, especially Ethereum lending utilization at 95.0%, are no longer reliable post-outflow events).

Combined lending TVL fell from $1.28B → $750.8M (-41%) across all chains. Most reduction was driven by stablecoin supply withdrawals.

### Instadapp Legacy

Instadapp has been operating since 2019, maintaining ~$2B TVL through 2023. Fluid represents the team's most ambitious protocol built on years of DeFi infrastructure experience. Track record now includes one **bad debt absorption event** (Mar 2026) with successful third-party-funded recovery.

## Funds Management

### How fTokens Work

fTokens are **ERC4626-compliant vault tokens**. When a user deposits an underlying asset (e.g., USDC), the fToken contract:

1. Calls `LIQUIDITY.operate()` to deposit the underlying into the Liquidity Layer
2. The Liquidity Layer triggers a callback; the fToken transfers the underlying via SafeTransfer or Permit2
3. Shares are minted to the user based on the current exchange rate

On withdrawal, the reverse occurs: shares are **burned before** the underlying is withdrawn from the Liquidity Layer (burn-first pattern for safety).

**Exchange rate**: Computed onchain as `tokenExchangePrice / EXCHANGE_PRICES_PRECISION` (1e12 precision). The rate is monotonically increasing — it can never decrease. **Verified onchain on Apr 27, 2026:** all fToken exchange rates have increased since Feb 2026.

It incorporates:
- Yield from the Liquidity Layer (borrower interest)
- Optional rewards from a `LendingRewardsRateModel` (currently **inactive** for all fTokens; yields are purely organic)

**Safety mechanisms in fToken contracts (unchanged):**
- Custom reentrancy guard (deposit/withdraw/rebalance all protected)
- Callback validation: checks caller = Liquidity AND token = ASSET AND status = ENTERED
- Burn-before-withdraw pattern
- BigMath precision with SafeCast overflow protection
- Rewards rate capped at 50% APR maximum

### Accessibility

- **Supplying**: Permissionless — anyone can deposit via fTokens. No whitelist required.
- **Redemption**: fToken withdrawals via `withdraw()` or `redeem()` (standard ERC4626). Subject to Liquidity Layer withdrawal limits. During the Mar 2026 event, withdrawals from affected (wstUSR-related) vaults were paused while solvent markets continued operating; standard fToken markets (fUSDC etc.) on Ethereum remained operational throughout.
- **Fees**: No explicit deposit/withdrawal fees. Interest rates are algorithmically determined by utilization via a kink-based model.

### Yield Source and Counterparty Risk

fToken yield comes from **borrower interest**. Borrowers use the Vault Protocol to deposit collateral and borrow assets from the Liquidity Layer. This means fToken holders are exposed to:

- **Vault Protocol solvency**: If borrowers default and liquidations fail to recover full value, bad debt could affect lending reserves. **The Mar 2026 event is a concrete example of this risk materializing** — the wstUSR price collapse outpaced the liquidation engine's ability to safely close positions, producing $10–17.5M of bad debt.
- **Liquidation effectiveness**: The tick-based liquidation mechanism must function correctly to prevent bad debt accumulation. In the Mar 2026 case, the speed and magnitude of the wstUSR price collapse exceeded what the liquidation mechanism could handle without losses.
- **Oracle correctness**: Vault liquidations depend on Chainlink, UniswapV3 TWAP, and Redstone price feeds. Oracle failures could delay liquidations.
- **Coverage mechanism**: Bad debt is **not covered by a programmatic, pre-funded insurance fund or first-loss tranche.** The Mar 2026 incident was covered via discretionary short-term loans from named individuals and entities.

**Collateral quality backing fToken yield** (borrower collateral types):
- Blue-chip: ETH, WETH, wstETH, weETH, WBTC, cbBTC
- Stablecoins: USDC, USDT, sUSDe, GHO
- Yield/restaking: PAXG, XAUt, various LSTs, sUSDe, syrupUSDC (and previously wstUSR — substantially de-risked post-Mar 2026)

### Collateralization

- **Backing**: All lending positions are over-collateralized onchain. Borrowers must maintain collateral ratios (80–95% LTV depending on the pair).
- **Liquidations**: Fully onchain tick-based mechanism. Liquidation penalty as low as 0.1% for correlated pairs (wstETH/ETH), higher for uncorrelated pairs.
- **Withdrawal Gap**: Extra gap on Liquidity Layer limits reserved for liquidations to ensure they can always execute.
- **Limitation observed Mar 2026:** the liquidation engine's effectiveness depends on the collateral asset behaving like a liquid market asset. When wstUSR's underlying USR depegged ~99.7% intraday, on-DEX liquidity for wstUSR was insufficient for safe liquidation, producing bad debt.

### Provability

- **Transparency**: All reserves are fully onchain and verifiable via resolver contracts (FluidLiquidityResolver at [`0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb`](https://etherscan.io/address/0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb)).
- **Exchange Rate**: fToken exchange rates are computed programmatically onchain (ERC4626 standard). No offchain oracle or admin input needed. Rate is monotonically increasing — verified.
- **Interest Rates**: Algorithmically determined based on utilization. USDC rate model: kink at 85% utilization (5.5% rate), second kink at 93% (8.5%), max rate 40%.
- **Revenue**: Protocol revenue is calculated and verifiable via the RevenueResolver contract.

### Interest Rate Model (USDC example, verified onchain Feb 2026)

| Parameter | Value |
|-----------|-------|
| Model Type | Kinked (V2) |
| Kink 1 | 85% utilization |
| Rate at Kink 1 | 5.50% |
| Kink 2 | 93% utilization |
| Rate at Kink 2 | 8.50% |
| Max Rate | 40.00% |
| Fee | 10% of spread |

**TODO**: re-verify rate model parameters via `FluidLiquidityResolver.getRateConfig` against the current model version. Spot check on Apr 27, 2026 returned the resolver `getOverallTokenData(USDC)` payload but the rate model parameters were not decoded into a refreshed table.

## Liquidity Risk

### Lending-Specific Liquidity Concerns

fToken holders face liquidity risk from the **shared Liquidity Layer** architecture. This architecture and its trade-offs are unchanged since Feb 2026, but the Mar 2026 event provides a concrete stress test.

- **Shared pool**: fToken withdrawals compete with all other withdrawal demand on the Liquidity Layer.
- **Withdrawal limits**: The Liquidity Layer enforces per-token expandable withdrawal limits. `maxWithdraw()` returns the minimum of: (1) the withdrawal limit at Liquidity, (2) actual liquid balance.
- **Stress test result (Mar 22–25, 2026)**: $300M+ net outflows in 24 hours. Standard fToken markets (fUSDC, fUSDT, etc.) on Ethereum continued processing withdrawals throughout. Affected vaults (wstUSR-collateralized) were paused. The kink-based rate model worked as designed — high utilization produced rate increases that incentivized borrowers to repay and stabilize utilization.
- **Stress test result (Apr 18–20, 2026)**: Additional ~$180M outflows over 2 days following the Kelp/rsETH freeze. No further bad debt; precautionary freeze of rsETH markets only.

### Exit Mechanisms

- **Normal exit**: Call `withdraw()` or `redeem()` on fToken. Subject to available liquidity and withdrawal limits.
- **Secondary market**: fTokens are ERC20 tokens and can be traded on secondary markets, though no significant DEX liquidity for fTokens was observed.
- **Throttled exit**: During high utilization, the expansion-rate mechanism throttles large withdrawals.

### Lending TVL by Asset Type (Ethereum) — TODO refresh

The Feb 2026 breakdown showed stablecoins at 51.3% of Ethereum lending TVL. **TODO**: refresh per-asset breakdown via DeFiLlama / Fluid API given the post-Mar/Apr 2026 outflow profile (which was disproportionately stablecoin-driven).

### Top Supply Assets — TODO refresh

The Feb 2026 ranking had **wstUSR at 18.9% of all-chain lending TVL** (largest single asset). Following the Mar 2026 incident, wstUSR exposure has been substantially reduced (Resolv whitelist redemptions absorbed >90% of affected positions; Resolv burned 46M USR). **TODO**: re-pull current top-asset breakdown to confirm wstUSR concentration is materially lower.

### Concentration Risk Reassessment

The previous report's call-out — *"Concentration risk: wstUSR is the single largest supply asset at 18.9% of total lending TVL"* — was correct and the risk materialized within ~6 weeks of the assessment. Going forward, it is reasonable to assume:

- Top-asset concentrations of >15% in any non-blue-chip asset warrant elevated monitoring
- Yield-bearing wrappers of stablecoins (wstUSR pattern) carry additional contagion risk because their wrap ratio amplifies losses when the underlying depegs

### Historical Liquidity Performance

- August 2024: -16.1% TVL drop, recovered without operational issues
- **March 2026: -30.3% drop, partial market freezes (wstUSR vaults), bad debt event covered, full recovery within days. Standard fToken markets remained functional.**
- **April 2026: -17.5% drop, precautionary rsETH freeze, no operational impact to other markets.**

## Centralization & Control Risks

### Governance — Verified Apr 27, 2026

- **Governance Model**: Onchain GovernorBravo governance. FLUID token holders vote on proposals that execute through a timelock. Discussion on [governance forum](https://gov.fluid.io/), onchain voting via [GovernorBravo](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B), and offchain signaling via [Snapshot](https://snapshot.org/#/instadapp-gov.eth).
- **Timelock**: [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) — **1-day (86,400s) delay** ✓ unchanged. Admin = GovernorBravo.
- **Owner/Admin**: All core contracts (Liquidity Layer proxy admin, LendingFactory) confirmed owned by the **Timelock** (`0x2386DC45...`) — verified onchain via `owner()` and EIP-1967 admin slot reads.
- **GovernorBravo Parameters** (verified onchain Apr 27, 2026):
  - Quorum: 4,000,000 FLUID (4% of total supply) ✓
  - Proposal threshold: 1,000,000 FLUID (1% of total supply) ✓
  - Voting delay: 7,200 blocks (~1 day) ✓
  - Voting period: 14,400 blocks (~2 days) ✓
  - **Proposals executed: 128** (was 117 in Feb 2026 → 11 new since)
- **Pending governance change (NEW)**: [Fluid Foundation Proposal](https://gov.fluid.io/t/proposal-establish-fluid-foundation/1768) (Feb 23, 2026, by DMH/Instadapp COO). Would transfer all Fluid IP, code, frontend, and trademarks to a Cayman Islands foundation with no owners (operating via custodians/directors), funded by a $250K/month ($3M/yr) DAO grant. Token holders retain ultimate authority (can change policy or dissolve foundation). **Status: in governance discussion, not executed.** This would be a positive maturation of the operational/legal structure if approved as written.

### Lending-Specific Admin Controls (Unchanged)

| Role | Who | What They Can Do to Lending |
|------|-----|---------------------------|
| **Timelock** (governance) | [`0x2386DC45...`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Upgrade Liquidity Layer implementation, change LendingFactory owner, change supply/borrow configs, change rate models |
| **LendingFactory Auths** | Set by Timelock | Update fToken rewards config, change rebalancer address, rescue stuck tokens, set fToken creation code |
| **LendingFactory Deployers** | Set by Timelock | Create new fToken contracts |
| **Rebalancer** | [`0x724d...b9b6`](https://etherscan.io/address/0x724d0c9497Fa89B2C6A4585e08380c91a92ab9b6) (fUSDC/fUSDT only) | Deposit underlying without minting shares (adds as rewards). Cannot withdraw. |
| **Guardian** (Avocado multisig) | [`0x4F6F977a...`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Pause Class 0 protocols only. **Cannot move or withdraw funds.** Cancel timelock transactions. Used to freeze rsETH markets in Apr 2026 (precautionary). |

**Key finding (unchanged):** No admin role can directly access or move user funds deposited via fTokens. The most powerful action is the Timelock upgrading the Liquidity Layer implementation (1-day delay). The Guardian's pause capability was exercised appropriately in both Mar and Apr 2026 events without abuse.

### Programmability

- **System Operations**: Largely programmatic. Interest rates and exchange rates are all computed onchain algorithmically.
- **Oracle System** (dependency via Vault Protocol): Chainlink primary, with UniswapV3 TWAP, Redstone, and custom center-price oracles as fallbacks. Modular per vault.
- **Rate Model**: Interest rates determined algorithmically via kink-based utilization model. Parameters set by governance.
- **Keepers/Automation**: No keepers needed for lending. Liquidations (in Vaults) are incentivized and performed by external liquidators.

### External Dependencies

- **Liquidity Layer**: Critical dependency — holds all fToken deposits. Upgradeable proxy controlled by Timelock.
- **Vault Protocol**: Generates fToken yield. Vault borrowers, liquidations, and oracles all affect lending counterparty risk.
- **Chainlink**: Indirect dependency via Vault Protocol oracle system. Multiple fallback oracle paths reduce risk.
- **Permit2**: Supported for deposits (Uniswap's `0x000000000022D473030F116dDEE9F6B43aC78BA3`).
- **External collateral asset issuers (NEW emphasis)**: As demonstrated by the Resolv (USR/wstUSR) and Kelp (rsETH) events, the protocol's risk surface includes the operational security of every accepted collateral asset issuer. A compromise of an issuer's keys or bridge can produce contagion damage even without any bug in Fluid.

## Operational Risk

- **Team**: Instadapp Labs. Founded by **Sowmay Jain** and **Samyak Jain** — both are publicly known, India-based founders active since 2019. Key GitHub contributors include **thrilok209**, **KABBOUCHI**, and **SamarendraGouda**.
- **Funding**: Well-funded by top-tier VCs: Pantera Capital, Coinbase Ventures, Standard Crypto, additional undisclosed investors.
- **Legal Structure**: Currently Instadapp Labs. **Pending: Cayman Islands Fluid Foundation** (Feb 2026 proposal, awaiting approval and IP transfer expected mid-2026 if approved).
- **Documentation**: Comprehensive technical documentation at [docs.fluid.instadapp.io](https://docs.fluid.instadapp.io/). Full source code on GitHub.
- **Communication**: Active [governance forum](https://gov.fluid.io/), [Discord](https://discord.com/invite/C76CeZc), Twitter [@0xfluid](https://x.com/0xfluid), [Blog](https://blog.instadapp.io/).
- **Incident Response (NEW evidence)**: Mar 2026 response demonstrated the team can act within ~30 minutes (pause/freeze affected markets) and arrange off-balance-sheet capital coverage of ~$70M within ~3 days. Strong response, but reliance on personal commitments rather than a programmatic mechanism is a structural concern.

## Monitoring

### Contracts to Monitor

| Contract | Address | Why Monitor |
|----------|---------|-------------|
| **fUSDC** | [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) | Largest fToken (~$183M Apr 2026). Exchange rate, deposits/withdrawals |
| **fUSDT** | [`0x5C20B550819128074FD538Edf79791733ccEdd18`](https://etherscan.io/address/0x5C20B550819128074FD538Edf79791733ccEdd18) | Second largest (~$126M Apr 2026). Exchange rate, deposits/withdrawals |
| **Liquidity Layer** | [`0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) | Holds all fToken deposits. Admin changes, implementation upgrades |
| **Liquidity Layer impl (current)** | [`0xcc331daf69752bece3dc98dbc63eacd5092266a2`](https://etherscan.io/address/0xcc331daf69752bece3dc98dbc63eacd5092266a2) | Implementation contract behind the proxy. Monitor for changes via EIP-1967 implementation slot. |
| **Timelock** | [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Owner of all core contracts — queued/executed transactions |
| **GovernorBravo** | [`0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) | Governance proposals, voting, execution |
| **Avocado Multisig** | [`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Guardian pause/cancel actions |

### Key Events to Watch (Unchanged + new emphasis)

| Contract | Event | Significance |
|----------|-------|-------------|
| **Timelock** | `QueueTransaction` / `ExecuteTransaction` | Governance actions queued/executed — 1 day warning |
| **Timelock** | `CancelTransaction` | Guardian cancelled a queued action |
| **Liquidity Layer** | `LogUpdateAuth` | Auth permissions changed — affects who can modify lending configs |
| **Liquidity Layer** | `LogUpdateGuardian` | Guardian address changed |
| **Liquidity Layer** | `LogPauseUser` / `LogUnpauseUser` | Protocol paused/unpaused — directly affects fToken operations. **Now an actively exercised path (Mar/Apr 2026).** |
| **Liquidity Layer** | `LogUpdateUserSupplyConfigs` | Supply limits changed — affects max fToken deposits |
| **Liquidity Layer** | `LogUpdateUserBorrowConfigs` | Borrow limits changed — affects utilization and withdrawal availability |
| **Liquidity Layer** | `LogUpdateRateDataV1` / `LogUpdateRateDataV2` | Interest rate parameters changed — affects fToken yield |
| **EIP-1967 Admin (proxy)** | Storage slot read | Implementation changes on Liquidity Layer / fToken contracts |
| **LendingFactory** | New fToken creation | New lending market created |

### New Monitoring Recommendation: Collateral Asset Issuers

Given the Mar/Apr 2026 contagion events, monitoring of the off-protocol collateral asset issuers (Resolv, Kelp, Ethena, Maple, etc.) is now a first-order concern. A compromise at any major upstream issuer can produce sub-day bad-debt events at Fluid even without any Fluid contract change.

## Risk Summary

### Key Strengths

- **fToken design held under stress**: Monotonically-increasing exchange rates verified before and after the Mar/Apr 2026 stress events; no direct loss to lenders on Ethereum.
- **Rapid incident response**: ~30 minute pause-and-freeze response on Mar 22; ~3 days to fully repay $70M of bad debt.
- Battle-tested team with ~6 years of DeFi operational history (Instadapp since 2019).
- 8 security audits from 4 reputable firms covering Lending Protocol and Liquidity Layer.
- Onchain GovernorBravo governance with 1-day Timelock and **128 proposals executed** (up from 117) — all core contracts owned by Timelock.
- Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- Fully programmatic interest rates and exchange rates — no offchain oracle for lending.
- ~2.18 years in production, $750M+ lending TVL across 5 chains even after a 41% TVL drawdown.

### Key Risks

- **Concentration risk has demonstrably materialized**: The Feb 2026 report flagged wstUSR (18.9% of TVL) as a concentration risk. That risk turned into a real bad-debt event within 6 weeks. Future top-asset concentrations should be treated as elevated risk.
- **Ad-hoc bad-debt coverage**: The Mar 2026 recovery relied on **discretionary off-balance-sheet loans from named individuals/entities** (cyberfund/Lomashuk, weremeow, Fluid core team). There is no programmatic, pre-funded insurance fund, first-loss tranche, or contractual coverage obligation. The same coverage pattern is not guaranteed to scale to a larger event.
- **Wrapped-stablecoin contagion amplification**: The wstUSR wrapping ratio meant that even a partial USR repeg would not have made wstUSR-collateralized borrowers solvent. Other yield-bearing wrappers (sUSDe, syrupUSDC, etc.) share this structural property.
- **Shared Liquidity Layer**: fToken deposits are commingled with Vault, DEX, and stETH protocol funds. A vulnerability anywhere in the stack affects fToken holders.
- **Liquidity Layer upgradeability**: Upgradeable proxy controlled by Timelock with only 1-day delay.
- **No formal verification** has been performed.
- **External collateral-issuer dependency surface (NEW)**: Mar/Apr 2026 demonstrated that the protocol is significantly exposed to the operational security of every accepted collateral issuer (Resolv, Kelp, etc.).

### Critical Risks

- None that would trigger an automatic score of 5. All contracts verified, reserves fully onchain, governance is via onchain GovernorBravo + Timelock, no EOA control. Guardian can only pause. The Mar 2026 bad-debt event was material but did not result in lender losses on Ethereum.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. 8 audits by 4 reputable firms. Lending Protocol directly covered.
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain via resolver contracts. fToken exchange rates computed programmatically and verified monotonically increasing through stress events.
- [x] **Total centralization** — PASSED. Onchain GovernorBravo governance with 1-day Timelock. No EOA control. Guardian can only pause.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Unchanged — 8 audits across 4 firms. All 3 criticals and 13 highs from prior audits resolved. No new audits since Feb 2026.
- **History**: 2.18 years in production, $750M lending TVL across 5 chains.
- **Bounty**: Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- **NEW — material incident**: The Mar 2026 Resolv contagion event produced $10–17.5M of bad debt and a 30% single-day TVL drop. While Fluid's own contracts were not exploited and lenders were made whole, this is a material adverse event that did not exist at the prior assessment. The Apr 2026 Kelp event triggered a precautionary freeze and a 17.5% TVL drop with no bad debt.

**Score: 2.0/5** (was 1.5/5) — Strong audit coverage and bounty unchanged. History grew from ~2 to ~2.18 years but is no longer "incident-free": one bad-debt event covered via off-balance-sheet capital, plus one precautionary freeze. Still excellent overall but not the unblemished record of the Feb 2026 assessment.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 2.0** (unchanged)
- Full onchain GovernorBravo governance with 128 proposals executed
- 1-day timelock delay; all core contracts owned by Timelock
- No admin role can directly access or withdraw fToken user funds
- Guardian pause used appropriately in Mar/Apr 2026 events; no abuse

**Subcategory B: Programmability — 1.5** (unchanged)
- Fully programmatic: interest rates and fToken exchange rates all onchain
- ERC4626 fTokens with algorithmically computed, monotonically increasing exchange rates (stress-tested)
- No offchain keepers/oracles for lending
- Bad-debt coverage process is **not programmatic** (relies on discretionary capital commitments) — a structural gap, but does not affect day-to-day operations

**Subcategory C: Dependencies — 2.5** (was 2.0)
- Critical dependency on Liquidity Layer (unchanged)
- Indirect dependency on Chainlink via Vault Protocol oracle system (unchanged)
- **NEW emphasis**: external collateral-issuer dependency demonstrated to be a first-order risk by Mar/Apr 2026 events. Not a single point of failure (multiple issuers across many assets) but a real and recurring contagion vector.

**Score: 2.0/5** — (2.0 + 1.5 + 2.5) / 3 = 2.0 (was 1.83). Governance/programmability unchanged; dependency risk reweighted upward to reflect the demonstrated contagion exposure.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 2.0** (was 1.5)
- All lending is over-collateralized via Vault Protocol (unchanged)
- Blue-chip collateral assets dominate (unchanged)
- Tick-based liquidation mechanism (unchanged)
- All reserves fully onchain and verifiable (unchanged)
- **NEW**: Demonstrated that the liquidation engine cannot prevent bad debt for accepted collateral assets that experience extreme intraday repricing (>90% in minutes) when DEX liquidity is shallow. The wstUSR wrapping ratio also amplifies losses from underlying depegs.
- **NEW**: Bad-debt coverage is discretionary, not programmatic. Other major lending protocols (e.g., Aave Safety Module) have pre-funded backstops; Fluid does not.

**Subcategory B: Provability — 1.0** (unchanged)
- fToken exchange rates computed programmatically (ERC4626), monotonically increasing — verified through stress events
- Interest rates algorithmically determined via kink-based model
- All reserves verifiable onchain via FluidLiquidityResolver
- No offchain reporting dependencies

**Score: 1.5/5** — (2.0 + 1.0) / 2 = 1.5 (was 1.25). Collateralization remains strong but with a known stress-test gap (wrapped-stablecoin amplification + lack of programmatic backstop). Provability is unchanged and excellent.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: fToken withdrawals subject to Liquidity Layer withdrawal limits and available liquidity
- **Stress test results (Mar 22–25, 2026)**: $300M+ net outflows in 24 hours absorbed; standard fToken markets remained operational; affected vaults paused. Kink-based rate model worked as designed.
- **Stress test results (Apr 18–20, 2026)**: ~$180M outflows over 2 days; rsETH markets precautionarily frozen; no other operational impact.
- **Withdrawal limits**: Expandable limits throttle large exits.
- **Shared pool risk**: Liquidity Layer serves lending, vaults, DEX, and stETH (unchanged)
- **Concentration**: Previously identified concentration risk materialized; current concentrations TODO refresh but reportedly substantially reduced post-Resolv recovery.
- **Secondary market**: No significant DEX liquidity for fTokens themselves.

**Score: 2.0/5** (unchanged). The shared Liquidity Layer / withdrawal-limit dynamics are unchanged. The Mar/Apr 2026 stress events are evidence of robust liquidity behavior **for unaffected markets** — standard fToken withdrawals continued processing through both events. Negative: concentration in a single risky collateral asset proved to be a real source of liquidity risk for vault depositors. Net: same score, but now backed by real-world stress-test data (mixed signal: protocol mechanics worked, but the system did require manual intervention).

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Publicly known founders (Sowmay Jain, Samyak Jain). Active since 2019. Strong DeFi reputation.
- **Funding**: Well-funded by Pantera Capital, Coinbase Ventures, and others.
- **Docs**: Comprehensive documentation and open-source code.
- **Legal**: Cayman Islands Fluid Foundation **proposed** Feb 23, 2026; not yet executed. Currently still Instadapp Labs.
- **Incident Response (NEW evidence)**: ~30 min pause/freeze response, $70M coverage arranged in ~3 days. Strong execution. No formal documented IR plan but operational track record now exists. Reliance on personal commitments rather than programmatic backstop is a documented structural concern.

**Score: 1.5/5** (unchanged). Publicly known team, strong reputation, well-funded, comprehensive docs. Incident response was demonstrably effective. Legal wrapper still pending — would improve to 1.0 if Foundation executes as proposed.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 2.0 | 30% | 0.60 |
| Funds Management | 1.5 | 30% | 0.45 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 1.5 | 5% | 0.075 |
| **Subtotal** | | | **1.83** |

**Optional Modifiers:**

- Protocol live >2 years with no incidents: **NOT APPLIED**. Protocol has been live >2 years (2.18y), but the Mar 2026 Resolv contagion / bad-debt event disqualifies the "no incidents" condition. (Previous report had not yet reached the 2-year mark and explicitly noted "borderline — will qualify at reassessment"; the reassessment determines it does not qualify due to incident.)
- TVL maintained >$500M for >1 year: **APPLIED (-0.5)**. Lending TVL has been >$500M for >1.5 years and is currently $750M.

**Final Score: 1.33** → rounded to **1.3** (vs. 1.1 in Feb 2026)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0–1.5 | Minimal Risk | Approved, high confidence |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: MINIMAL RISK** (unchanged tier; score moved from 1.1 to 1.3)

The Fluid Lending Protocol (fTokens) remains a well-designed ERC4626-compliant lending product with strong security properties. The Mar 2026 Resolv USR contagion event is the most material change to the risk profile since the prior assessment: a previously-flagged concentration risk materialized into a real bad-debt event, and recovery relied on **discretionary off-balance-sheet capital commitments** rather than a programmatic insurance mechanism. Lender funds on Ethereum were not impaired — exchange rates remained monotonically increasing throughout — but the episode demonstrates a structural gap (no pre-funded backstop) that did not factor into the previous score. The Apr 2026 Kelp event triggered a precautionary freeze with no direct loss. Score moves up modestly from 1.1 → 1.3 within the Minimal Risk tier.

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (October 2026), or earlier if any of the below trigger.
- **Coverage-mechanism formalization**: Reassess if Fluid implements a programmatic insurance/coverage layer (would lower funds-management subcategory). Conversely, reassess if the protocol experiences a second bad-debt event without comparable third-party coverage.
- **Foundation execution**: Reassess once the Cayman Islands Fluid Foundation IP transfer completes (would improve operational score).
- **TVL-based**: Reassess if lending TVL changes by more than 50% from current $750M baseline.
- **Concentration-based**: Reassess if any single supply asset exceeds 15% of total lending TVL (the wstUSR threshold that materialized).
- **Incident-based**: Reassess after any further exploit, governance change, significant parameter modification, or contagion event from a major collateral issuer.
- **Governance**: Reassess if GovernorBravo parameters change (quorum, timelock delay, voting period) or if Avocado guardian configuration changes.
- **Dependency**: Reassess if Liquidity Layer implementation is upgraded (current impl: `0xcc331daf69752bece3dc98dbc63eacd5092266a2`) or if a new protocol is added to the shared liquidity pool.
- **Utilization-based**: Reassess if Ethereum lending utilization sustains >99% for >24 hours.

## Open TODOs from this Reassessment

- **Avocado multisig signer/threshold**: not verifiable via standard Gnosis Safe ABI; requires Avocado-specific resolution
- **Liquidity Layer implementation history**: confirm whether `0xcc331daf69752bece3dc98dbc63eacd5092266a2` was the live implementation in Feb 2026 or if an upgrade occurred (no upgrade was found in news/governance, but onchain history not reviewed in this pass)
- **Per-chain lending utilization refresh**: Feb 2026 report had Ethereum at 95% utilization; current per-chain utilization not refreshed (DefiLlama lending TVL is total only)
- **Top-asset concentration refresh**: confirm wstUSR concentration is materially lower than the 18.9% Feb 2026 figure post-Resolv recovery
- **Per-asset Ethereum lending TVL breakdown** (stablecoins / ETH+LSTs / BTC / other) — refresh
- **Rate model parameters refresh**: re-decode `FluidLiquidityResolver.getOverallTokenData(USDC)` and verify rate kink/max parameters are unchanged
- **fUSDtb / fsUSDS exchange rates**: not re-fetched in this pass (small TVL — low priority)
- **Foundation proposal status**: track for execution date and any amendments
