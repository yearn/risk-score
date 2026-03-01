# Protocol Risk Assessment: KernelDAO (Kelp Gain)

- **Assessment Date:** March 1, 2026
- **Token:** hgETH (High Growth ETH)
- **Chain:** Ethereum
- **Token Address:** [`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD)
- **Final Score: 3.1/5.0**

## Overview + Links

hgETH (High Growth ETH) is a liquid, reward-bearing ERC-4626 vault token issued by the **High Growth Vault**, a product of **Kelp Gain** (part of the KernelDAO ecosystem). The vault is built on **Upshift Finance** infrastructure and curated by **UltraYield** (a spin-off of Edge Capital).

Users deposit ETH, LSTs (stETH, ETHx), or rsETH into the vault. All deposits are converted to **rsETH** (Kelp's liquid restaked ETH token) via an adapter contract, then allocated across **12+ DeFi protocols** by professional fund managers. hgETH appreciates in value as yield accrues from these strategies.

**Yield strategies include:**
- Leverage farming on Aave
- Deposits on Usual, Pendle, and Elixir
- Lending on Morpho, Euler, and Compound
- Dynamic allocation across best-performing DeFi protocols

**Multi-layered risk architecture:**
- **Layer 1**: ETH → rsETH (Kelp restaking via EigenLayer)
- **Layer 2**: rsETH → Gain vault (active strategy deployment across 12+ protocols)
- **Layer 3**: Gain vault → hgETH (ERC-4626 receipt token)

Each layer introduces additional smart contract risk, oracle risk, and counterparty risk.

**Key metrics (on-chain verified, March 1, 2026):**
- hgETH total supply: 15,897.55 hgETH (`totalSupply()` on-chain)
- hgETH total assets: 16,454.11 rsETH (`totalAssets()` on-chain)
- hgETH exchange rate: 1 hgETH = 1.035 rsETH (`convertToAssets(1e18)` = 1,035,008,842,997,178,375)
- Underlying asset: rsETH ([`0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7`](https://etherscan.io/address/0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7))
- hgETH market cap: ~$48M (CoinGecko)
- Upshift TVL for hgETH vault: ~$77M
- Kelp protocol TVL: ~$2B+ (DeFiLlama)
- Claimed yield: 8.5% net APR over the last 6 months (per issue), 11-14% reward rate (per KernelDAO marketing)

**Yearn use case per issue #65:**
- Accept hgETH as collateral, or use in a strategy
- Morpho market: hgETH/WETH at 91.5% LLTV

**Links:**

- [KernelDAO](https://kerneldao.com)
- [Kelp Growth Vault](https://kerneldao.com/kelp/gain/growth-vault/)
- [Kelp Documentation](https://kelp.gitbook.io/kelp/)
- [Upshift Finance Documentation](https://docs.upshift.finance/)
- [DeFiLlama - Kelp](https://defillama.com/protocol/kelp)
- [DeFiLlama - Gain](https://defillama.com/protocol/gain)
- [LlamaRisk - rsETH Collateral Risk Assessment](https://llamarisk.com/research/collateral-risk-rseth)
- [CoinGecko - hgETH](https://www.coingecko.com/en/coins/high-growth-eth)
- [Immunefi Bug Bounty](https://immunefi.com/bug-bounty/kelp-dao/information/)
- [KernelDAO Blog](https://blogs.kerneldao.com)
- [Twitter/X - @KelpDAO](https://x.com/KelpDAO)

## Contract Addresses

### Core Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| hgETH (High Growth Vault) | [`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD) | TransparentUpgradeableProxy → GainLendingPool |
| rsETH (underlying asset) | [`0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7`](https://etherscan.io/address/0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7) | Kelp liquid restaked ETH |
| KERNEL (governance token) | [`0x3f80b1c54ae920be41a77f8b902259d48cf24ccf`](https://etherscan.io/address/0x3f80b1c54ae920be41a77f8b902259d48cf24ccf) | KernelDAO governance token |

### Proxy Infrastructure

| Contract | ProxyAdmin | ProxyAdmin Owner |
|----------|-----------|-----------------|
| hgETH | [`0xd355daae366220a0282cd5d2687fbc395395fc40`](https://etherscan.io/address/0xd355daae366220a0282cd5d2687fbc395395fc40) | 3-of-5 Multisig ([`0xFD96F6854bc73aeBc6dc6E61A372926186010a91`](https://etherscan.io/address/0xFD96F6854bc73aeBc6dc6E61A372926186010a91)) |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| Vault Owner Multisig | [`0x66Bee721697BF17D9Eea28c51C828a43ba597B0b`](https://etherscan.io/address/0x66Bee721697BF17D9Eea28c51C828a43ba597B0b) | 3-of-5 Gnosis Safe (on-chain verified via `getThreshold()` and `getOwners()`) |
| ProxyAdmin Owner Multisig | [`0xFD96F6854bc73aeBc6dc6E61A372926186010a91`](https://etherscan.io/address/0xFD96F6854bc73aeBc6dc6E61A372926186010a91) | 3-of-5 Gnosis Safe — same 5 signers as vault owner (on-chain verified) |

**Vault Owner Multisig signers (on-chain verified):**
1. [`0xf5A37fEEe552895B4B7843c66e8A3F1036767873`](https://etherscan.io/address/0xf5A37fEEe552895B4B7843c66e8A3F1036767873)
2. [`0xCfd77d87e633749d09F1A09ba333cc739E6fcB2B`](https://etherscan.io/address/0xCfd77d87e633749d09F1A09ba333cc739E6fcB2B)
3. [`0x3485fa418874f04485047C384eef53377a81bd0e`](https://etherscan.io/address/0x3485fa418874f04485047C384eef53377a81bd0e)
4. [`0x1e15e35d436960Cb95094142e73AABA9656393C3`](https://etherscan.io/address/0x1e15e35d436960Cb95094142e73AABA9656393C3)
5. [`0x7AAd74b7f0d60D5867B59dbD377a71783425af47`](https://etherscan.io/address/0x7AAd74b7f0d60D5867B59dbD377a71783425af47) — labeled "Kelp DAO Deployer" on Etherscan

### Morpho Market Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| Morpho Blue | [`0xBBBBBbbBBb9cc5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cc5e90e3b3Af64bdAF62C37EEFFCb) | Morpho singleton |
| Oracle (MorphoChainlinkOracleV2) | [`0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c`](https://etherscan.io/address/0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c) | hgETH/WETH pricing |
| BASE_FEED_1 (hgETH/USD) | [`0x70cf192d6b76d57a46aafc9285ced110034eb013`](https://etherscan.io/address/0x70cf192d6b76d57a46aafc9285ced110034eb013) | TransparentUpgradeableProxy → EOMultiFeedAdapter |
| QUOTE_FEED_1 (ETH/USD) | [`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Chainlink ETH/USD feed |
| IRM | [`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC) | AdaptiveCurveIrm |

### On-Chain Verification (Etherscan + cast, March 1, 2026)

| Contract | Name | Verified | Proxy | Implementation |
|----------|------|----------|-------|----------------|
| hgETH | TransparentUpgradeableProxy → GainLendingPool | Yes | Yes | [`0x4FFe25598489C7259DC9686a2Cba0507177bcf7F`](https://etherscan.io/address/0x4FFe25598489C7259DC9686a2Cba0507177bcf7F) |
| BASE_FEED_1 | TransparentUpgradeableProxy → EOMultiFeedAdapter | Yes | Yes | [`0x8a1bae36ee0e7b7d6ced3ffea250914bfca09292`](https://etherscan.io/address/0x8a1bae36ee0e7b7d6ced3ffea250914bfca09292) |
| Vault Owner | SafeProxy (Gnosis Safe) | Yes | Yes | — |
| ProxyAdmin | ProxyAdmin | Yes | No | — |

**On-chain ownership verification (via `cast`):**
- hgETH `owner()` → `0x66Bee721697BF17D9Eea28c51C828a43ba597B0b` (3-of-5 multisig) ✓
- hgETH ProxyAdmin `owner()` → `0xFD96F6854bc73aeBc6dc6E61A372926186010a91` (3-of-5 multisig, same signers) ✓
- Vault multisig `getThreshold()` → 3, `getOwners()` → 5 signers ✓
- ProxyAdmin multisig `getThreshold()` → 3, `getOwners()` → 5 signers (same set) ✓

## Audits and Due Diligence Disclosures

### Audit History

hgETH involves multiple protocol layers, each with its own audit history.

#### hgETH / Gain Vault Audits

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **Sigma Prime** | Nov 2024 | GainAdapter contract (rsETH adapter for hgETH) | [PDF](https://kerneldao.com/kelp/audits/smartcontracts/Sigma_Prime_hgETH.pdf) |
| 2 | **Zellic** | Unknown | Gain vault contracts | Not publicly available |
| 3 | **ChainSecurity** | Unknown | Gain vault contracts | Not publicly available |

**Key findings from Sigma Prime hgETH audit:**
- Assets held by the adapter are not included in share calculations, causing users to receive more shares per asset than they should upon deposits
- A portion of rsETH tokens will not be accounted for by any vault and become stuck in the contract
- Team acknowledged these as "design choices for protocol stability"

#### Upshift Finance (vault infrastructure) Audits

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **ChainSecurity** | Jan 2025 | Core Vault | Available |
| 2 | **Hacken** | Sep 2025 | Unknown scope | Available |
| 3 | **Hacken** | Dec 2025 | Unknown scope | Available |
| 4 | **Hacken** | Jan 2026 | AllocationWhitelist | Available |
| 5 | **Sigma Prime** | Aug 2024 | Unknown scope | Available |
| 6 | **Zellic** | Apr 2023 | Fractal Protocol (predecessor) | Available |

#### rsETH (Kelp) Audits

| # | Firm | Date | Scope | Findings | Report |
|---|------|------|-------|----------|--------|
| 1 | **Sigma Prime** | Dec 2023 | rsETH smart contracts | 2M, 3L, 5I | [PDF](https://kelpdao.xyz/audits/smartcontracts/SigmaPrime.pdf) |
| 2 | **Code4rena** | Nov 2023 | rsETH system (competitive, $28K pool) | 3H, 2M | [Report](https://code4rena.com/reports/2023-11-kelp) |
| 3 | **MixBytes** | Mar 2024 | rsETH + withdrawal mechanism | 4H | [PDF](https://kerneldao.com/kelp/audits/smartcontracts/mixbytes.pdf) |
| 4 | **Sigma Prime** | 2024 | rsETH with withdrawals | Unknown | [PDF](https://kelpdao.xyz/audits/smartcontracts/SigmaPrime_2.pdf) |
| 5 | **Sigma Prime** | 2024 | rsETH with withdrawals | Unknown | [PDF](https://kelpdao.xyz/audits/smartcontracts/SigmaPrime_3.pdf) |

**Notable Code4rena findings (Nov 2023):**
- **H-01:** Possible arbitrage from Chainlink price discrepancy (disputed by Kelp)
- **H-02:** Protocol mints less rsETH on deposit than intended (fixed)
- **H-03:** rsETH price manipulable by first staker via donation attack (disputed but upheld as HIGH)

**Notable MixBytes findings (Mar 2024):**
- 4 HIGH severity including EigenPod initialization problem and race condition in node delegator management

#### Kernel (BNB Chain) Audits

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **ChainSecurity** | Dec 2024 | Kernel smart contracts | [PDF](https://cdn.prod.website-files.com/65d35b01a4034b72499019e8/677289c9b2a5ff641ff2d3d0_ChainSecurity_Kernel_DAO_Kernel_audit.pdf) |
| 2 | **Bailsec** | Unknown | Kernel platform | Not publicly available |
| 3 | **Sherlock** | Jul 2025 | Slashing/restaking logic | Private engagement |

### On-Chain Complexity

The architecture is **highly complex** with multiple layers:
- **ERC-4626 vault**: hgETH wraps rsETH via the GainLendingPool implementation
- **Upgradeable proxy**: TransparentUpgradeableProxy controlled by 3-of-5 multisig
- **Multi-protocol strategy**: Funds deployed across 12+ DeFi protocols simultaneously
- **August subaccounts**: Smart contract wallets used for strategy segregation on Upshift
- **Policy-constrained execution**: Curators can only execute whitelisted strategies
- **rsETH layer**: Additional complexity from the underlying liquid restaking protocol (EigenLayer integration)

### Bug Bounty

**Active Immunefi bug bounty program for Kelp DAO:**
- **Critical smart contract bugs**: $100,000 - $250,000 (10% of funds at risk)
- **High**: $50,000 - $100,000
- **Medium**: $11,000 - $50,000
- **Low**: $10,000
- In-scope: 10 smart contracts (rsETH core)
- KYC required, paid in USDC
- [Immunefi - Kelp DAO](https://immunefi.com/bug-bounty/kelp-dao/information/)

**Note:** The bug bounty covers rsETH core contracts only. **hgETH/Gain vault contracts are NOT in scope** — verified on [Immunefi Kelp DAO scope](https://immunefi.com/bug-bounty/kelp-dao/scope/). The 10 in-scope contracts are: LRT Config, rsETH, LRT Deposit Pool, LRT Oracle, EthXPriceOracle, FeeReceiver, LRTConverter, LRTWithdrawalManager, LRTUnstakingVault, and NodeDelegator. The hgETH contract ([`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD)) and Upshift infrastructure are not covered. There is also no separate KernelDAO bug bounty program on Immunefi.

### Insurance

**Nexus Mutual embedded cover** — confirmed partnership between Nexus Mutual, Edge Capital (UltraYield), and Kelp for the High Growth Vault ([announcement](https://www.einpresswire.com/article/887618132/nexus-mutual-edge-capital-and-kelp-partner-on-world-first-defi-vault-with-embedded-cover)). Described as a "world-first DeFi vault with embedded cover":
- Cover protects across **$30M+ of the vault's core positions**
- Cover is integrated directly into the vault — users receive protection as part of the product, not purchased separately
- Nexus Mutual track record: $5.5B in crypto safeguarded since 2019, $17M+ in claims paid

**What IS covered** ([Nexus Mutual cover terms](https://opencover.com/nexus-mutual-cover-covered-risks-and-exclusions/)):
- Smart contract exploits/hacks (e.g., a bug in Aave, Euler, or the vault contract itself)
- Oracle manipulation or oracle failure
- Liquidation **failure** (when a protocol's liquidation mechanism malfunctions and bad debt accrues)
- Governance takeovers (malicious upgrade forced through)

**What is NOT covered:**
- **Strategy losses from looping/leverage are NOT covered** — if hgETH's leveraged looping strategy on Aave gets liquidated because ETH price drops and the health factor falls below 1, that is the protocol working as intended → not a covered event
- Market price movements of assets (except oracle manipulation)
- Depegs of assets that the covered protocol generates
- Rug pulls / owner confiscation within existing permissions
- Bridge failures
- User errors (phishing, private key compromise, malware)
- Pre-existing issues or previously disclosed bugs

**Key distinction for Yearn**: The Nexus Mutual cover protects against *protocol failures* (smart contract bugs, oracle malfunctions, broken liquidation mechanisms), but does **not** protect against *strategy underperformance* or losses from legitimate DeFi protocol behavior. Since hgETH's primary yield strategy involves leverage farming on Aave and looping, a normal liquidation from adverse market conditions would result in a loss to hgETH holders that insurance would not cover.

## Historical Track Record

- **KelpDAO launch**: December 2023 — ~27 months in operation
- **rsETH deployment**: December 2023 — ~27 months on-chain
- **hgETH deployment**: November 19, 2024 — block [21223734](https://etherscan.io/block/21223734), tx [`0xfe6428fc9e5f89fd48ddb02953f1e2f3edf3a2e276524232e61788b5e2b853df`](https://etherscan.io/tx/0xfe6428fc9e5f89fd48ddb02953f1e2f3edf3a2e276524232e61788b5e2b853df) — ~15 months on-chain
- **GitHub**: Source code not publicly available for hgETH/Gain vaults; rsETH contracts verified on Etherscan
- **KernelDAO total TVL**: $2B+ across 10+ chains
- **Kelp TVL**: ~$2B (DeFiLlama) — second largest liquid restaking protocol

### Incidents

| Date | Incident | Impact | Resolution |
|------|----------|--------|------------|
| **Jul 22, 2024** | DNS hijacking — attacker convinced GoDaddy to bypass 2FA and redirect domain to malicious UI | A small number of users lost funds via phishing UI. **No smart contract exploit.** | Domain ownership recovered, registrar transferred, security alerts improved |
| **Apr 30, 2025** | rsETH fee minting bug — code used `1e36` instead of `1e18` base, minting an astronomical excess of rsETH to the fee address | Deposits/withdrawals paused. rsETH frozen on Aave as precaution. **No user funds lost.** | Bug resolved May 1, 2025. Kelp integrated Chainlink Proof of Reserve (PoR) Secure Mint |
| **Apr 2024** | rsETH depeg — -1.5% deviation from theoretical exchange rate | Brief depeg, quickly corrected. Protocol monitoring paused operations when exchange rates deviated >1% | ETH withdrawal feature improvements subsequently reduced depeg risk |

**No known smart contract exploits where user funds were actually lost.**

## Funds Management

### Deposit/Withdrawal Flow

**Depositing**: Users deposit ETH, LSTs (stETH, ETHx), or rsETH into the High Growth Vault via the Kelp Gain dApp. An adapter contract converts all deposits to rsETH before depositing into the vault. hgETH shares are minted proportional to the current exchange rate (ERC-4626 standard).

**Strategy deployment**: The vault curator (UltraYield by Edge Capital) allocates rsETH across ~12 DeFi protocols:
- Leverage farming (Aave)
- Stablecoin strategies (Usual, Elixir)
- Fixed-yield instruments (Pendle)
- Lending markets (Morpho, Euler, Compound)
- Strategies execute within Upshift's August subaccount infrastructure — curators operate within policy-constrained smart contract wallets

**Withdrawals (hgETH → ETH full flow, on-chain verified):**

```
hgETH → rsETH → ETH
 3-4 days    instant (DEX) or 2+ days (Kelp unstake)
```

**Step 1: hgETH → rsETH (3-4 days)**
1. User calls `requestRedeem(shares, receiver, holder)` on the hgETH vault — emits `WithdrawalRequested` with a scheduled claim date (year/month/day)
2. Withdrawal epoch processes daily (`getWithdrawalEpoch()` = 2026/3/1 on March 1, 2026)
3. Operator recalls assets from deployed strategy positions (162 active loans, 98.4% of assets deployed)
4. Operator calls `processWithdrawal(account, shares)` or `processAllClaimsByDate(year, month, day, maxLimit)` to settle
5. User calls `claim(year, month, day, receiver)` to receive rsETH
6. `maxRedeem()` = 0 (direct ERC-4626 redemption disabled — must use `requestRedeem()` flow)
7. `maxWithdrawalAmount()` = 100,000 rsETH per request (on-chain verified)

**Step 2: rsETH → ETH (two options)**
- **Option A — DEX swap (instant)**: Sell rsETH on Curve/Balancer (~$79M liquidity). Instant with slippage on large amounts
- **Option B — Kelp unstaking (2+ days)**: Submit withdrawal via LRTWithdrawalManager ([`0x62De59c08eB5dAE4b7E6F7a8cAd3006d6965ec16`](https://etherscan.io/address/0x62De59c08eB5dAE4b7E6F7a8cAd3006d6965ec16)) → wait for processing → claim ETH

**Total time: 3-4 days** (vault + DEX) or **5-6+ days** (vault + Kelp unstake)

**Vault buffer (on-chain verified, March 1, 2026):**

| Metric | Value |
|--------|-------|
| Total assets | 16,454.10 rsETH |
| Deployed in strategies (loans) | 16,192.96 rsETH (**98.4%**) |
| **Vault buffer (rsETH balance)** | **238.90 rsETH (1.45%)** |
| Active loan/strategy positions | 162 |
| Settlement account | [`0x66Bee721697BF17D9Eea28c51C828a43ba597B0b`](https://etherscan.io/address/0x66Bee721697BF17D9Eea28c51C828a43ba597B0b) (vault owner multisig) |

Only **1.45% of assets** are available as buffer for immediate redemptions. The remaining 98.4% must be recalled from 162 strategy positions — this explains the 3-4 day withdrawal delay and is a critical concern for Morpho liquidation viability.

### Accessibility

- **Deposits**: Open to anyone — deposit ETH/LSTs/rsETH, receive hgETH
- **Withdrawals**: 3-4 day processing period via `requestRedeem()` → `claim()` flow (not instant). Assets recalled from 162 deployed strategy positions. Only 1.45% buffer available
- **Composability**: hgETH can be used across DeFi (Morpho, Euler, Pendle) for additional yield

### Fees (on-chain verified)

| Fee | Value | Mechanism |
|-----|-------|-----------|
| Management fee | **1.5% annual** (`managementFeePercent()` = 150) | Time-based, continuously accruing against `totalAssets()`. `chargeManagementFee()` materializes accrued fees as new hgETH shares → **dilutes existing holders**. `collectFees()` transfers shares to fee collector. Last charged: Feb 28, 2026 |
| Withdrawal fee | **0%** (`withdrawalFee()` = 0) | — |
| Performance fee | Unknown — prospectus not publicly accessible | — |
| Fee collector | [`0x2151A97C7819782fD99efF020CdfE0aE838Ad378`](https://etherscan.io/address/0x2151A97C7819782fD99efF020CdfE0aE838Ad378) | Receives minted hgETH shares |
| Daily fee accrual | ~0.676 rsETH/day (~$1,760) | On current 16,454 rsETH total assets |
| Annual fee | ~246.8 rsETH (~$642K) | 1.5% of total assets |

### Collateralization

- **Underlying asset**: rsETH (Kelp liquid restaked ETH)
- **rsETH backing**: ETH (~59.5%), ETHx from Stader (~32.5%), wstETH from Lido (~8%) — restaked on EigenLayer
- **hgETH backing**: 1 hgETH = 1.035 rsETH (on-chain, March 1, 2026). rsETH is deployed across 12+ DeFi protocols
- **Non-custodial vault**: Per Upshift documentation, neither Upshift nor the Curator can withdraw user funds to an external EOA. Funds only move between whitelisted strategy contracts and the vault
- **Withdrawal Liquidity Buffer**: Configurable percentage of assets held in buffer for immediate redemptions (per Upshift docs)
- **No over-collateralization**: hgETH is a 1:1 receipt token for vault shares, not an over-collateralized position

### Provability

- **hgETH exchange rate**: Fully on-chain via ERC-4626 `convertToAssets()` — programmatic, trustless
- **rsETH exchange rate**: On-chain via Kelp's LRT oracle
- **Strategy positions**: Deployed across DeFi protocols — visible on-chain via August subaccounts
- **rsETH reserves**: Chainlink Proof of Reserve (PoR) integration (added May 2025 after fee minting incident)
- **Risk management**: Upshift enforces NAV Volatility Protection (max percentage change constraint on share-to-asset ratio per update cycle)

## Liquidity Risk

### Primary Exit Mechanisms

1. **Withdrawal from vault**: Request hgETH → rsETH redemption via Kelp Gain dApp. 3-4 day processing period as assets are recalled from strategies
2. **DEX swap**: hgETH composability on Balancer, Pendle; rsETH has ~$79M DEX liquidity (Curve rsETH/weETH $26M, Balancer rsETH/WETH $25.8M per LlamaRisk)
3. **Morpho/Euler**: hgETH can be used as collateral on Morpho and Euler Frontier vaults

### Liquidity Assessment

- **Primary liquidity**: 3-4 day withdrawal via vault is the main exit path. `maxRedeem()` = 0 (direct ERC-4626 redemption disabled). Users must use `requestRedeem()` flow. `maxWithdrawalAmount()` = 100,000 rsETH per request (on-chain verified)
- **rsETH secondary market**: Decent — ~$79M across major DEX pools. rsETH has consistently traded above ETH (LlamaRisk)
- **hgETH secondary market (verified)**: **Extremely thin.** Only one DEX pool exists:
  - **Uniswap V4 hgETH/ETH**: ~$311K liquidity, $52.58 24h volume (effectively zero). First traded November 19, 2025
  - No pools on Balancer, Curve, or other DEXes despite marketing claims of composability
  - CoinGecko notes hgETH "stopped trading 27 days ago on all exchanges"
  - hgETH DEX liquidity represents only ~0.65% of market cap — **negligible**
- **rsETH depeg risk**: Only one significant depeg (-1.5% in April 2024), quickly corrected
- **Morpho context**: 3-4 day withdrawal delay creates challenges for the 91.5% LLTV market — liquidators cannot sell hgETH on DEXes (~$311K liquidity is far too thin for any meaningful liquidation) and must wait 3-4 days to redeem through the vault

### Morpho Market (hgETH/WETH)

| Parameter | Value |
|-----------|-------|
| Market ID | `0xec97655fab06b53bfad9d8c2358768aed5a1c97b204d3e51e2a7cb0cb786a264` |
| Collateral | hgETH ([`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD)) |
| Loan Token | WETH ([`0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)) |
| Oracle | MorphoChainlinkOracleV2 ([`0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c`](https://etherscan.io/address/0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c)) |
| IRM | AdaptiveCurveIrm ([`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)) |
| LLTV | 91.5% |
| Total Supply | ~756.59 WETH (`totalSupplyAssets` on-chain) |
| Total Borrow | ~597.22 WETH (`totalBorrowAssets` on-chain) |
| Utilization | ~78.9% |
| Fee | 0% |

### Morpho Oracle Analysis (on-chain verified)

The oracle is a `MorphoChainlinkOracleV2` that uses two price feeds (no vault conversion):

| Parameter | Address | Description | Current Value |
|-----------|---------|-------------|---------------|
| BASE_VAULT | `0x0` | Not used | — |
| BASE_VAULT_CONVERSION_SAMPLE | — | — | 1 |
| BASE_FEED_1 | [`0x70cf192d6b76d57a46aafc9285ced110034eb013`](https://etherscan.io/address/0x70cf192d6b76d57a46aafc9285ced110034eb013) | EOMultiFeedAdapter (hgETH/USD, 18 decimals) — **TransparentUpgradeableProxy** | ~$2,190.62 |
| BASE_FEED_2 | `0x0` | Not set | — |
| QUOTE_FEED_1 | [`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Chainlink ETH/USD (8 decimals) | ~$1,985.44 |
| QUOTE_FEED_2 | `0x0` | Not set | — |
| SCALE_FACTOR | — | Decimal adjustment | 1e26 |
| **price()** | — | **Final oracle price** | **~1.103 (hgETH/ETH ratio)** |

**Oracle architecture:**
- `price = baseFeed1 * SCALE_FACTOR / quoteFeed1` → hgETH/USD ÷ ETH/USD = hgETH/ETH
- The hgETH/USD feed is an **EOMultiFeedAdapter** behind a **TransparentUpgradeableProxy**
- Proxy admin: [`0x9b61cf07caa513430a21d4f1cb6b93d90a6bbfb8`](https://etherscan.io/address/0x9b61cf07caa513430a21d4f1cb6b93d90a6bbfb8) (ProxyAdmin)
- ProxyAdmin owner: [`0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E`](https://etherscan.io/address/0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E) (3-of-5 Gnosis Safe — different signers from vault multisig, on-chain verified)

**Oracle feed details (on-chain verified):**
- BASE_FEED_1 `latestRoundData()`: roundId=0, answer=2,190,621,602,669,676,260,878 (~$2,190.62), updatedAt=1772368931 (valid timestamp)
- QUOTE_FEED_1 `latestRoundData()`: roundId=129127208515966887504, answer=198,544,000,000 (~$1,985.44), standard Chainlink response

**Oracle concerns:**
- **Upgradeable oracle feed**: The hgETH/USD feed is a TransparentUpgradeableProxy (EOMultiFeedAdapter). The proxy admin multisig (3-of-5) could upgrade the oracle implementation — this is a significant centralization vector. Unlike the standard Chainlink ETH/USD feed, this oracle can be modified
- **No vault conversion**: The oracle does NOT use the on-chain ERC-4626 exchange rate. Instead, it relies entirely on the EOMultiFeedAdapter for hgETH pricing. If the adapter price diverges from the actual vault value, mispricing could occur
- **roundId=0**: The hgETH/USD feed returns roundId=0 and startedAt=0, which are non-standard for a Chainlink-compatible feed. Staleness checks based on roundId may not work correctly
- **Single oracle source**: No redundant fallback oracle for hgETH/USD
- **No circuit breakers or pause functionality**: The EOMultiFeedAdapter implementation ([`0x8a1bae36ee0e7b7d6ced3ffea250914bfca09292`](https://etherscan.io/address/0x8a1bae36ee0e7b7d6ced3ffea250914bfca09292)) has **no pause, freeze, emergency shutdown, or circuit breaker functions** (on-chain ABI verified). The only state-changing function is `initialize()`, which can only be called once. The implementation is entirely read-only after initialization — the only way to modify oracle behavior is via a full proxy upgrade by the ProxyAdmin owner ([`0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E`](https://etherscan.io/address/0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E), a Gnosis Safe). This means there is no ability to quickly halt a malfunctioning oracle without a full implementation upgrade
- **Positive**: The ETH/USD quote feed is standard Chainlink with normal roundId, timestamps, and heartbeat

## Centralization & Control Risks

### Governance

The hgETH vault is controlled by a 3-of-5 Gnosis Safe multisig. Both the vault `owner()` and the ProxyAdmin are controlled by the same 5 signers:

| Role | Controlled By | Description |
|------|---------------|-------------|
| hgETH `owner()` | 3-of-5 Multisig | Vault administrative operations |
| hgETH ProxyAdmin Owner | 3-of-5 Multisig (same signers) | Can upgrade hgETH implementation |

**Governance concerns:**
- **No timelock on proxy upgrades (on-chain verified)**: The ProxyAdmin ([`0xd355daae366220a0282cd5d2687fbc395395fc40`](https://etherscan.io/address/0xd355daae366220a0282cd5d2687fbc395395fc40)) is owned directly by the 3-of-5 Safe — no TimelockController or delay contract in between. The ProxyAdmin has no `getMinDelay()` or `delay()` functions. Neither Safe has modules (`getModulesPaginated()` returns empty). The vault's `lagDuration()` = 0. Upshift documentation claims "24-hour timelocks on critical modifications" — **this is not enforced on-chain for proxy upgrades**. The `updateTimelockDuration` function exists in the vault ABI but controls vault operational parameters, not proxy upgrades
- **One known signer**: Only 1 of 5 signers is identifiable (Kelp DAO Deployer address). The other 4 are anonymous EOAs
- **Same signers for both owner and ProxyAdmin**: No separation of concerns between operational control and upgrade authority

**rsETH governance (underlying layer):**
- **External Admin**: 6-of-8 multisig with 10-day timelock for contract upgrades (via Timelock contract at [`0x49bD9989E31aD35B0A62c20BE86335196A3135B1`](https://etherscan.io/address/0x49bD9989E31aD35B0A62c20BE86335196A3135B1))
- **Manager**: 2-of-5 multisig for operational tasks (deposits, limits, pausing)
- **8 known signers** on External Admin including venture partners and protocol founders (per LlamaRisk)

The rsETH layer has notably better governance than the hgETH vault layer (higher threshold, timelock, more known signers).

**KERNEL token governance:**
- $KERNEL is the unified governance token (1B total supply)
- Token distribution: 55% community rewards/airdrops, 20% private sale (18-month vesting after 12-month lock), 20% team/advisors (36-month vesting after 12-month lock), 5% ecosystem partners
- Governance token launched April 2025; DAO structure is relatively new

### Programmability

- **hgETH exchange rate**: On-chain via ERC-4626 `convertToAssets()`. Programmatic
- **Strategy execution**: Curators execute strategies within Upshift's August subaccount infrastructure. Strategies are policy-constrained (whitelisted protocols and contract calls only). **Curator-managed, not fully programmatic**
- **Withdrawal**: 3-4 days, requires assets to be recalled from deployed strategies. **Not instant, involves operational steps**
- **NAV updates**: Upshift enforces Max Percentage Change constraint per update cycle. Bounds checking exists
- **Emergency functions**: Multi-sig controlled pause for deposits/withdrawals; can instantly return all strategy funds to vault

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **rsETH (Kelp)** | Underlying asset | **Critical** | hgETH value directly tied to rsETH; rsETH depeg or exploit would impact hgETH |
| **EigenLayer** | Restaking infrastructure | **Critical** | rsETH depends on EigenLayer; slashing or EigenLayer failure would impact rsETH |
| **Upshift Finance** | Vault infrastructure | **Critical** | hgETH vault built on Upshift; Upshift vulnerability would impact all vault operations |
| **UltraYield / Edge Capital** | Vault curator | **High** | Strategy execution and allocation decisions; poor decisions could lead to losses |
| **August** | Subaccount infrastructure | **High** | Smart contract wallets for strategy segregation |
| **EOMultiFeedAdapter** | Oracle (Morpho market) | **High** | Oracle failure could cause incorrect liquidations on Morpho |
| **Chainlink** | Oracle (ETH/USD) | **Medium** | Standard Chainlink feed; well-established |
| **Nexus Mutual** | Insurance | **Medium** | Loss of embedded vault cover |
| **12+ DeFi protocols** | Strategy destinations | **Medium** | Exploit in any destination protocol could cause partial loss |

**Key dependency risk**: hgETH has a **deeply layered dependency chain**. ETH → rsETH (Kelp + EigenLayer) → Gain vault (Upshift + August + UltraYield) → 12+ DeFi protocols. Each layer multiplies smart contract risk. The Upshift non-custodial architecture and policy constraints mitigate some curator risk, but the overall complexity is high.

## Operational Risk

- **Team**: **Well-known founders** — Dheeraj Borra and Amitej Gajjala, both previously co-founded Stader Labs ($680M+ TVL). Dheeraj: LinkedIn, Blend Labs, PayPal, IIT Kharagpur, UT Austin. Amitej: A.T. Kearney, Swiggy, IIT Madras, IIM Calcutta
- **Funding**: $19M+ raised — $9M Kelp private sale (May 2024, SCB Limited, Laser Digital), $10M KernelDAO round (Nov 2024, Binance Labs, Laser Digital, Hypersphere Ventures). $40M strategic ecosystem fund
- **Legal structure**: Evercrest Technologies Inc. (Andorra/India per various sources). Limited regulatory oversight
- **Documentation**: Good quality — comprehensive docs across Kelp GitBook, Upshift docs, KernelDAO blog
- **Source code**: rsETH contracts verified on Etherscan. hgETH implementation (GainLendingPool) verified on Etherscan. Not open source on GitHub
- **Incident response**: DNS hijack resolved within hours (Jul 2024). Fee minting bug resolved within 24 hours (Apr 2025). Both incidents handled competently with no user fund loss
- **Track record**: Stader Labs (predecessor project) has been running since April 2021 with $680M+ TVL. KelpDAO operational since December 2023

## Monitoring

### hgETH Vault Monitoring

- **hgETH contract**: [`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD)
  - Monitor `convertToAssets(1e18)` for exchange rate changes (should only increase)
  - **Alert**: If exchange rate **decreases** — indicates potential loss event in underlying strategies
  - Monitor `totalAssets()` for large changes relative to `totalSupply()`
  - Monitor `Deposit`, `Withdraw` events for large movements
  - **Alert**: Single deposits/withdrawals >$2M (given ~$48M market cap)

### rsETH Monitoring

- **rsETH contract**: [`0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7`](https://etherscan.io/address/0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7)
  - Monitor rsETH/ETH exchange rate for depeg events
  - **Alert**: If rsETH depegs >1% from theoretical exchange rate
  - Monitor Chainlink PoR feed for reserve discrepancies

### Governance Monitoring

- **Vault multisig**: [`0x66Bee721697BF17D9Eea28c51C828a43ba597B0b`](https://etherscan.io/address/0x66Bee721697BF17D9Eea28c51C828a43ba597B0b)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change
- **ProxyAdmin**: [`0xd355daae366220a0282cd5d2687fbc395395fc40`](https://etherscan.io/address/0xd355daae366220a0282cd5d2687fbc395395fc40)
  - Monitor for proxy upgrade transactions
  - **Alert**: Immediately on any implementation upgrade
- **rsETH Timelock**: [`0x49bD9989E31aD35B0A62c20BE86335196A3135B1`](https://etherscan.io/address/0x49bD9989E31aD35B0A62c20BE86335196A3135B1)
  - Monitor for queued and executed transactions

### Oracle Monitoring

- **Morpho Oracle**: [`0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c`](https://etherscan.io/address/0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c)
  - Monitor `price()` for staleness or deviation from expected hgETH/ETH ratio
- **hgETH/USD feed**: [`0x70cf192d6b76d57a46aafc9285ced110034eb013`](https://etherscan.io/address/0x70cf192d6b76d57a46aafc9285ced110034eb013)
  - Monitor for price staleness (check `updatedAt` from `latestRoundData()`)
  - **Alert**: If `updatedAt` is more than 24 hours stale
  - **Alert**: Immediately on any proxy upgrade of the oracle feed
- **Oracle proxy admin**: [`0x9b61cf07caa513430a21d4f1cb6b93d90a6bbfb8`](https://etherscan.io/address/0x9b61cf07caa513430a21d4f1cb6b93d90a6bbfb8)
  - Monitor for implementation changes
  - **Alert**: Immediately on any upgrade

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| hgETH proxy upgrade events | Real-time | Critical |
| Multisig signer/threshold changes | Real-time | Critical |
| hgETH exchange rate decrease | Every 6 hours | Critical |
| rsETH depeg (>1%) | Every 6 hours | Critical |
| Oracle feed proxy upgrades | Real-time | Critical |
| Oracle price staleness | Every 6 hours | High |
| hgETH total assets changes | Daily | High |
| rsETH timelock transactions | Real-time | High |
| Large deposit/withdrawal events | Real-time | Medium |
| Protocol TVL changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Experienced team**: Founders built Stader Labs ($680M+ TVL, operating since 2021). Strong institutional credibility
- **Significant funding**: $19M+ raised from reputable investors (Binance Labs, SCB Limited, Laser Digital, Hypersphere Ventures)
- **Multiple audit layers**: Extensive auditing across the stack — Sigma Prime, ChainSecurity, Code4rena, MixBytes, Zellic, Hacken across rsETH, Gain, and Upshift
- **Bug bounty**: Active Immunefi program for Kelp with up to $250K for critical bugs (rsETH core contracts only; hgETH/Gain vaults are not in scope)
- **Non-custodial vault architecture**: Upshift's design prevents curators from withdrawing funds to external EOAs; policy-constrained execution via August subaccounts
- **Nexus Mutual embedded cover**: Integrated insurance covering $30M+ of vault positions against smart contract exploits, oracle failures, and liquidation mechanism failures. **Does not cover** strategy losses from looping/leverage liquidations or market movements
- **Chainlink PoR**: rsETH integrated Chainlink Proof of Reserve Secure Mint (added post-incident)
- **rsETH governance**: 6-of-8 multisig with 10-day timelock for the underlying rsETH layer
- **Large ecosystem TVL**: $2B+ across KernelDAO protocols provides scale and operational track record

### Key Risks

- **Multi-layered complexity**: hgETH involves ETH → rsETH → Gain vault → 12+ DeFi protocols. Each layer adds smart contract risk. A vulnerability at any layer could impact hgETH value
- **Actively managed vault**: Unlike passive vaults, the curator (UltraYield) makes allocation decisions. Strategy risk depends on curator competence
- **Upgradeable oracle**: The hgETH/USD Morpho oracle feed (EOMultiFeedAdapter) is behind an upgradeable proxy. The oracle admin multisig (3-of-5) could modify the price feed
- **hgETH governance weaker than rsETH**: The hgETH vault uses a 3-of-5 multisig with mostly anonymous signers and no verified timelock, while rsETH has a 6-of-8 multisig with 10-day timelock
- **Withdrawal delay + zero DEX liquidity**: 3-4 days to exit hgETH to rsETH, and only ~$311K DEX liquidity with $52/day volume. Incompatible with instant liquidation needs on the 91.5% LLTV Morpho market
- **Confirmed no on-chain timelock**: Despite Upshift documentation claiming "24-hour timelocks," no timelock exists on the hgETH ProxyAdmin upgrade path (on-chain verified)
- **Past incidents**: DNS hijack (Jul 2024) and fee minting bug (Apr 2025) demonstrate operational risk, though both were resolved competently

### Critical Risks

- **Layered smart contract risk**: A single exploit in any of the 12+ DeFi protocols where rsETH is deployed could cause partial loss. Combined with rsETH + EigenLayer + Upshift layers, the total attack surface is very large
- **91.5% LLTV with 3-4 day withdrawal + zero DEX liquidity**: If hgETH/ETH price drops, liquidators cannot sell hgETH on DEXes (~$311K liquidity, $52/day volume is negligible). They must redeem through the vault and wait 3-4 days. At 91.5% LLTV, there is very little margin before bad debt
- **Upgradeable oracle proxy**: The hgETH/USD oracle feed can be modified by a 3-of-5 multisig. A compromised multisig could manipulate the oracle, enabling extraction from the Morpho market

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Extensively audited across multiple layers: Sigma Prime (rsETH + hgETH), Code4rena, MixBytes, ChainSecurity (Upshift + Kernel), Hacken, Zellic. **PASS**
- [x] **Unverifiable reserves** — hgETH is an ERC-4626 vault wrapping rsETH. Both exchange rates are verifiable on-chain. Strategy positions are on-chain in DeFi protocols. rsETH has Chainlink PoR. **PASS**
- [x] **Total centralization** — 3-of-5 multisig for hgETH, 6-of-8 multisig with 10-day timelock for rsETH. Not a single EOA. **PASS**

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 5+ audits for rsETH from 3 reputable firms (Sigma Prime, Code4rena, MixBytes). 3+ audits for Gain vaults (Sigma Prime, Zellic, ChainSecurity). 6+ audits for Upshift (ChainSecurity, Hacken, Sigma Prime, Zellic). Extensive coverage
- **Bug Bounty**: Active Immunefi program with $250K max for rsETH core contracts only. hgETH/Gain vault contracts are **not in scope** (verified on Immunefi). No separate KernelDAO bounty exists
- **Time in Production**: KelpDAO ~27 months (since Dec 2023). Founders' prior project (Stader) since Apr 2021. hgETH deployed November 19, 2024 (~15 months on-chain)
- **TVL**: ~$48M hgETH market cap, $2B+ Kelp protocol TVL. Significant scale
- **Incidents**: Two incidents (DNS hijack, fee minting bug) — neither resulted in user fund loss, both resolved competently

**Score: 2.5/5** — Extensive auditing from reputable firms across all layers. Active bug bounty, but notably the hgETH/Gain vault contracts are **not in scope** of the Kelp Immunefi program (only rsETH core is covered). Significant TVL and operational track record. Two past incidents (no fund loss) show both vulnerability and competent response. The rsETH fee minting bug (Apr 2025) is concerning as it was a basic unit conversion error that should have been caught. Multiple HIGH findings across audits suggest a complex codebase with non-trivial attack surface. The team's track record with Stader (4+ years) provides confidence. hgETH has been deployed for ~15 months (since November 2024).

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-5 multisig for hgETH vault (4 anonymous signers, 1 known deployer)
- ProxyAdmin controlled by same 3-of-5 multisig (same signers)
- No verified on-chain timelock on the hgETH ProxyAdmin (Upshift docs claim 24-hour timelocks but not verified on-chain)
- rsETH layer: 6-of-8 multisig with 10-day timelock (better governance)
- $KERNEL governance token launched April 2025 (DAO still maturing)

**Governance Score: 3.5** — The rsETH underlying layer has good governance (6-of-8 multisig + 10-day timelock + known signers), but the hgETH vault layer has weaker governance (3-of-5, mostly anonymous, **no timelock confirmed on-chain** despite Upshift documentation claims). The hgETH layer is the direct exposure. Upshift's non-custodial architecture partially mitigates upgrade risk (curators cannot extract funds even without a timelock), but the proxy is still instantly upgradeable by the 3-of-5 multisig.

**Subcategory B: Programmability**

- hgETH exchange rate: on-chain via ERC-4626. Programmatic
- Strategy execution: curator-managed via Upshift, policy-constrained but not fully automated
- Withdrawals: 3-4 days, operational process
- NAV bounds checking: automated guards against anomalous exchange rate changes
- Emergency pause: multi-sig controlled

**Programmability Score: 3.0** — Hybrid. ERC-4626 accounting is programmatic, but strategy allocation is curator-managed. Upshift's policy constraints and NAV protection provide guardrails, but core allocation decisions are human-driven.

**Subcategory C: External Dependencies**

- **Critical**: rsETH (Kelp), EigenLayer, Upshift Finance
- **High**: UltraYield/Edge Capital (curator), August (subaccounts), EOMultiFeedAdapter (oracle)
- **Medium**: 12+ DeFi destination protocols, Chainlink, Nexus Mutual
- Many dependencies with varying trust levels, but most are well-established DeFi protocols

**Dependencies Score: 3.5** — Heavy dependency chain (rsETH → EigenLayer → Upshift → August → 12+ protocols), but these are generally well-established DeFi protocols. The curator dependency (UltraYield) adds trust assumptions but is mitigated by Upshift's non-custodial design.

**Centralization Score = (3.5 + 3.0 + 3.5) / 3 = 3.33**

**Score: 3.5/5** — Rounded up due to the lack of verified timelock on the hgETH proxy. The underlying rsETH governance is good, but hgETH-specific governance is weaker. The Upshift non-custodial architecture is a significant mitigant.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- hgETH is a 1:1 ERC-4626 receipt token for rsETH deposited in the vault
- rsETH is backed by ETH/LSTs restaked on EigenLayer — fundamentally ETH-denominated
- Vault positions deployed across well-known DeFi protocols
- Non-custodial: curators cannot extract funds to external EOAs
- Nexus Mutual embedded cover provides additional protection

**Collateralization Score: 2.5** — ETH-denominated underlying with on-chain verifiable vault positions. Non-custodial architecture. Strategy diversification across 12+ protocols. The ERC-4626 standard ensures transparent accounting. Insurance coverage via Nexus Mutual.

**Subcategory B: Provability**

- hgETH exchange rate: fully on-chain (ERC-4626)
- rsETH exchange rate: on-chain, Chainlink PoR verified
- Strategy positions: on-chain in DeFi protocols (transparent)
- NAV updates: bounded, with anomaly detection
- All positions verifiable on-chain via August subaccounts

**Provability Score: 2.5** — High on-chain verifiability. Both hgETH and rsETH exchange rates are programmatic. Strategy positions are in DeFi protocols (on-chain). Chainlink PoR for rsETH reserves. This is significantly more transparent than custodial stablecoin models.

**Funds Management Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5** — Strong on-chain verifiability across all layers. Non-custodial vault design. ETH-denominated collateral. The multi-protocol strategy deployment is transparent on-chain.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: 3-4 day withdrawal (assets recalled from strategies). `maxRedeem()` = 0 (direct redemption disabled). Not instant
- **rsETH DEX liquidity**: ~$79M across Curve and Balancer pools. Adequate for rsETH
- **hgETH DEX liquidity (verified)**: **Negligible** — only ~$311K in a single Uniswap V4 pool with $52/day volume. Effectively zero secondary market
- **rsETH depeg history**: Only one -1.5% depeg (April 2024), quickly corrected
- **Same-denomination**: hgETH → rsETH → ETH. All ETH-denominated. No stablecoin/ETH mismatch
- **Morpho context**: 91.5% LLTV with 3-4 day withdrawal and near-zero DEX liquidity makes liquidation extremely challenging
- **Composability**: hgETH used on Pendle (3,494 hgETH / ~$9.3M locked) — but this is not exit liquidity

**Score: 3.5/5** — The 3-4 day withdrawal delay combined with near-zero DEX liquidity (~$311K, $52/day volume) is a significant concern. Liquidators on the 91.5% LLTV Morpho market have no practical secondary market to sell hgETH collateral — they must redeem through the vault and wait 3-4 days. The same-denomination (ETH) nature reduces depeg risk, and rsETH has decent liquidity (~$79M) once redeemed. Between score 3 (market-based, 3-7 days exit) and score 4 (withdrawal restrictions, >1 week or >10% impact). The near-zero direct DEX liquidity pushes toward 3.5.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Both founders publicly known with strong credentials (Stader Labs, LinkedIn, PayPal, IIT, Wharton-level institutions). Well-funded ($19M+)
- **Curator**: UltraYield by Edge Capital — professional crypto fund manager ($500M+ AUM)
- **Documentation**: Good quality across Kelp GitBook, Upshift docs, KernelDAO blog
- **Legal Structure**: Evercrest Technologies Inc. (Andorra). Limited regulatory oversight
- **Source code**: Contracts verified on Etherscan but not open source on GitHub
- **Incident response**: Two incidents handled competently with no fund loss

**Score: 2.5/5** — Strong team with proven track record (Stader, $680M+ TVL). Professional curator. Well-funded. Good documentation. Past incidents resolved without fund loss. Andorra jurisdiction and closed source code are minor concerns.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.95** |

**Final Score: 3.1** (rounded up from 2.95 due to conservative adjustments for: multi-layered complexity, upgradeable oracle proxy, confirmed absence of on-chain timelock on hgETH proxy, and the combination of 91.5% LLTV with 3-4 day withdrawal delay + near-zero DEX liquidity)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk**

---

hgETH is an actively managed ERC-4626 vault token built by a well-funded, experienced team (KelpDAO / Stader Labs founders) on established infrastructure (Upshift Finance). The protocol benefits from extensive auditing, an active bug bounty, Nexus Mutual embedded cover, and non-custodial vault architecture that prevents curator fund extraction.

However, the protocol has meaningful complexity: **three layers of smart contract risk** (rsETH → Gain vault → 12+ DeFi protocols), an **upgradeable oracle proxy** for the Morpho market, and **weaker governance on the hgETH layer** compared to the underlying rsETH layer (3-of-5 with no verified timelock vs 6-of-8 with 10-day timelock).

**For the intended Yearn use case (hgETH as Morpho collateral or in a strategy):**

The **91.5% LLTV combined with a 3-4 day withdrawal delay** is the primary concern for the Morpho collateral use case. If hgETH/ETH price drops (e.g., due to rsETH depeg or strategy loss), liquidators cannot quickly redeem hgETH — they must sell on secondary markets. The hgETH/ETH relationship should be relatively stable (both ETH-denominated), which makes the high LLTV less risky than it would be for a stablecoin/ETH pair, but the multi-layered risk profile means tail events could cause rapid value changes.

For a **strategy use case** (depositing into the vault), the risk profile is more favorable: Yearn would hold hgETH directly and benefit from the yield, insurance, and non-custodial architecture without the added Morpho liquidation risk.

**Key conditions for any exposure:**

- Monitor hgETH exchange rate for decreases (indicates strategy losses)
- Monitor rsETH/ETH for depeg events (>1% deviation)
- Monitor hgETH proxy for implementation upgrades (no verified timelock)
- Monitor the hgETH/USD oracle feed proxy for upgrades
- Monitor vault multisig for signer/threshold changes
- Note: **No on-chain timelock exists** on hgETH ProxyAdmin despite Upshift documentation claims — proxy upgrades are instant
- Request access to the Edge Capital prospectus for performance fee details (management fee confirmed at 1.5%)
- Request access to the rev share proposal
- Consider position sizing relative to hgETH total supply (~15,900 hgETH / ~$48M)

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (September 2026) given medium risk tier and established track record
- **TVL-based**: Reassess if hgETH market cap changes by >50% (below ~$24M or above ~$72M)
- **Incident-based**: Reassess after any exploit, rsETH depeg >2%, or strategy loss event
- **Governance-based**: Reassess if an on-chain timelock is verified/added for hgETH vault upgrades (should improve Centralization score)
- **Oracle-based**: Reassess if the hgETH/USD oracle feed is upgraded or if an alternative oracle is deployed
- **Audit-based**: Reassess if additional hgETH-specific audits by tier-1 firms are completed
- **Bug bounty scope**: Reassess if hgETH/Gain vault contracts are explicitly added to the Immunefi program scope

## TODO

- [x] Verify hgETH deployment date on Etherscan (exact block/date) — **Resolved**: November 19, 2024, block 21223734
- [ ] Access and review the Edge Capital hgETH prospectus (Google Drive link requires authentication)
- [ ] Access and review the rev share proposal (Google Drive link requires authentication)
- [ ] Verify hgETH performance fee percentage (management fee confirmed at 1.5%, withdrawal fee at 0%)
- [x] Verify whether hgETH/Gain vault contracts are in scope of the Kelp Immunefi bug bounty — **Resolved**: NOT in scope. Only rsETH core contracts (10 contracts) are covered
- [x] Check if the EOMultiFeedAdapter oracle has any additional governance controls or circuit breakers — **Resolved**: No circuit breakers, pause, or governance functions exist. Implementation is entirely read-only after initialization. Only modification path is full proxy upgrade
