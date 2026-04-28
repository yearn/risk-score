# Protocol Risk Assessment: KernelDAO (Kelp Gain)

- **Assessment Date:** April 27, 2026 (reassessment after April 18, 2026 rsETH bridge exploit)
- **Token:** hgETH (High Growth ETH)
- **Chain:** Ethereum
- **Token Address:** [`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD)
- **Final Score: 3.75/5.0** (Elevated Risk; reassessment up from 2.8/5.0 in March 2026)

> **Status (April 27, 2026):** hgETH vault is currently **PAUSED for both deposits and withdrawals** (verified onchain via `depositsPaused()` = true and `withdrawalsPaused()` = true). The pause was activated on April 18, 2026 by the 3-of-5 vault multisig in response to the **KelpDAO LayerZero bridge exploit** (~116,500 rsETH / ~$292M released from escrow via a forged cross-chain message). hgETH-specific contracts and the rsETH balances held by the vault on Ethereum were not directly affected, but the broader rsETH peg has come under stress and the vault remains frozen pending investigation.

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

**Key metrics (onchain verified, April 27, 2026):**
- hgETH total supply: 14,752.14 hgETH (`totalSupply()` onchain) — down ~7% from 15,897.55 in March (net redemptions before pause)
- hgETH total assets: 15,294.54 rsETH (`totalAssets()` onchain) — down from 16,454.11 in March
- hgETH exchange rate: 1 hgETH = 1.0368 rsETH (`convertToAssets(1e18)` = 1,036,767,594,618,287,781) — gradual yield accrual continued
- Vault buffer (rsETH held directly by hgETH): 117.13 rsETH (~0.77% of total assets) — down from 238.90 rsETH (1.45%) in March
- Active loans/strategy positions: 169 (was 162 in March)
- **Vault deposits and withdrawals paused since April 18, 2026** — `depositsPaused()` = true, `withdrawalsPaused()` = true
- Underlying asset: rsETH ([`0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7`](https://etherscan.io/address/0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7))
- rsETHPrice (Kelp LRT oracle): 1.0696 ETH per rsETH (unchanged from pre-exploit; oracle has not adjusted for the under-collateralization on bridged wrsETH)
- hgETH market cap: ~$37M (using ETH/USD ≈ $2,288 and onchain rsETH ratio; pre-exploit was ~$48M)
- Kelp protocol TVL: down sharply post-exploit (rsETH/wrsETH frozen on Aave and other lending markets)
- Claimed yield: 8.5% net APR over the last 6 months (per issue) — yield generation halted while vault is paused

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
| Vault Owner Multisig | [`0x66Bee721697BF17D9Eea28c51C828a43ba597B0b`](https://etherscan.io/address/0x66Bee721697BF17D9Eea28c51C828a43ba597B0b) | 3-of-5 Gnosis Safe (onchain verified via `getThreshold()` and `getOwners()`) |
| ProxyAdmin Owner Multisig | [`0xFD96F6854bc73aeBc6dc6E61A372926186010a91`](https://etherscan.io/address/0xFD96F6854bc73aeBc6dc6E61A372926186010a91) | 3-of-5 Gnosis Safe — same 5 signers as vault owner (onchain verified) |

### On-Chain Verification (Etherscan + cast, April 27, 2026)

| Contract | Name | Verified | Proxy | Implementation |
|----------|------|----------|-------|----------------|
| hgETH | TransparentUpgradeableProxy → GainLendingPool | Yes | Yes | [`0x4FFe25598489C7259DC9686a2Cba0507177bcf7F`](https://etherscan.io/address/0x4FFe25598489C7259DC9686a2Cba0507177bcf7F) (unchanged from March) |
| BASE_FEED_1 | TransparentUpgradeableProxy → EOMultiFeedAdapter | Yes | Yes | [`0x8a1bae36ee0e7b7d6ced3ffea250914bfca09292`](https://etherscan.io/address/0x8a1bae36ee0e7b7d6ced3ffea250914bfca09292) (unchanged from March) |
| Vault Owner | SafeProxy (Gnosis Safe) | Yes | Yes | — |
| ProxyAdmin | ProxyAdmin | Yes | No | — |

**Onchain ownership verification (via `cast`, April 27, 2026):**
- hgETH `owner()` → `0x66Bee721697BF17D9Eea28c51C828a43ba597B0b` (3-of-5 multisig, unchanged signers)
- hgETH ProxyAdmin `owner()` → `0xFD96F6854bc73aeBc6dc6E61A372926186010a91` (3-of-5 multisig, same 5 signers as vault owner, unchanged)
- Vault multisig `getThreshold()` → 3, `getOwners()` → 5 signers (unchanged)
- ProxyAdmin multisig `getThreshold()` → 3, `getOwners()` → 5 signers (same set, unchanged)
- No proxy upgrade since deployment (implementation slot still points to `0x4FFe25598489C7259DC9686a2Cba0507177bcf7F`)
- `depositsPaused()` → true, `withdrawalsPaused()` → true (since April 18, 2026 via [tx `0xec9de389a42cc3213fd1d95243a1caa3812574acb0a8012407a57411aa48fcef`](https://etherscan.io/tx/0xec9de389a42cc3213fd1d95243a1caa3812574acb0a8012407a57411aa48fcef))

## Audits and Due Diligence Disclosures

### Audit History

hgETH involves multiple protocol layers, each with its own audit history.

#### hgETH / Gain Vault Audits

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **Sigma Prime** | Nov 2024 | GainAdapter contract (rsETH adapter for hgETH) | [PDF](https://kerneldao.com/kelp/audits/smartcontracts/Sigma_Prime_hgETH.pdf) |

**Key findings from Sigma Prime hgETH audit:**
- Assets held by the adapter are not included in share calculations, causing users to receive more shares per asset than they should upon deposits
- A portion of rsETH tokens will not be accounted for by any vault and become stuck in the contract
- Team acknowledged these as "design choices for protocol stability"

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
- **rsETH deployment**: December 2023 — ~27 months onchain
- **hgETH deployment**: November 19, 2024 — block [21223734](https://etherscan.io/block/21223734), tx [`0xfe6428fc9e5f89fd48ddb02953f1e2f3edf3a2e276524232e61788b5e2b853df`](https://etherscan.io/tx/0xfe6428fc9e5f89fd48ddb02953f1e2f3edf3a2e276524232e61788b5e2b853df) — ~15 months onchain
- **GitHub**: Source code not publicly available for hgETH/Gain vaults; rsETH contracts verified on Etherscan
- **Kelp TVL**: ~$1.54B on Ethereum ([DeFiLlama, April 28, 2026](https://defillama.com/protocol/kelp)) — down from ~$2B prior to the April 18, 2026 exploit. KernelDAO ecosystem TVL has fallen accordingly

### Incidents

| Date | Incident | Impact | Resolution |
|------|----------|--------|------------|
| **Apr 18, 2026** | **KelpDAO LayerZero V2 OFT bridge exploit** — attacker forged a cross-chain message via a misconfigured 1-of-1 DVN setup on the Unichain→Ethereum rsETH route, causing the OFT escrow on Ethereum to release ~116,500 rsETH (~$292M, ~18% of supply) to an attacker address. Attacker used the rsETH as collateral to borrow ~$200–236M across lending venues. Aave's Guardian froze rsETH/wrsETH markets across 10+ deployments on the same day. | **rsETH on Ethereum supply unchanged onchain (escrow drain, not new mint). Wrapped rsETH on bridged chains is now ~18% under-collateralized. rsETH market peg broke versus ETH.** Kelp/Upshift paused hgETH and other Gain vaults the same day as a precaution — vault still paused on April 27, 2026. Arbitrum Security Council froze ~30,766 ETH (~$71M) of attacker funds on April 21. Kelp, Aave Labs, LayerZero, EtherFi, Compound jointly filed a Constitutional AIP seeking to release frozen funds into a "DeFi United" recovery vehicle. **Investigation and remediation still ongoing.** |
| **Apr 30, 2025** | rsETH fee minting bug — code used `1e36` instead of `1e18` base, minting an astronomical excess of rsETH to the fee address | Deposits/withdrawals paused. rsETH frozen on Aave as precaution. **No user funds lost.** | Bug resolved May 1, 2025. Kelp integrated Chainlink Proof of Reserve (PoR) Secure Mint |
| **Apr 2024** | rsETH depeg — -1.5% deviation from theoretical exchange rate | Brief depeg, quickly corrected. Protocol monitoring paused operations when exchange rates deviated >1% | ETH withdrawal feature improvements subsequently reduced depeg risk |
| **Jul 22, 2024** | DNS hijacking — attacker convinced GoDaddy to bypass 2FA and redirect domain to malicious UI | A small number of users lost funds via phishing UI. **No smart contract exploit.** | Domain ownership recovered, registrar transferred, security alerts improved |

**Direct hgETH/Gain vault contract impact**: None of the incidents above are bugs in the hgETH or Gain vault smart contracts themselves. The April 2026 exploit was on the LayerZero OFT bridge layer; hgETH vault holds canonical rsETH on Ethereum and was paused only as a precaution. However, the rsETH peg break and the prolonged pause materially increase **redemption / liquidity risk** for hgETH holders because the vault sits on top of a now-stressed asset.

## Funds Management

### Deposit/Withdrawal Flow

**Depositing**: Users deposit ETH, LSTs (stETH, ETHx), or rsETH into the High Growth Vault via the Kelp Gain dApp. An adapter contract converts all deposits to rsETH before depositing into the vault. hgETH shares are minted proportional to the current exchange rate (ERC-4626 standard).

**Strategy deployment**: The vault curator (UltraYield by Edge Capital) allocates rsETH across ~12 DeFi protocols:
- Leverage farming (Aave)
- Stablecoin strategies (Usual, Elixir)
- Fixed-yield instruments (Pendle)
- Lending markets (Morpho, Euler, Compound)
- Strategies execute within Upshift's August subaccount infrastructure — curators operate within policy-constrained smart contract wallets

**Withdrawals (hgETH → ETH full flow, onchain verified):**

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
7. `maxWithdrawalAmount()` = 100,000 rsETH per request (onchain verified)

**Step 2: rsETH → ETH (two options)**
- **Option A — DEX swap (instant)**: Sell rsETH on Curve/Balancer (~$79M liquidity). Instant with slippage on large amounts
- **Option B — Kelp unstaking (2+ days)**: Submit withdrawal via LRTWithdrawalManager ([`0x62De59c08eB5dAE4b7E6F7a8cAd3006d6965ec16`](https://etherscan.io/address/0x62De59c08eB5dAE4b7E6F7a8cAd3006d6965ec16)) → wait for processing → claim ETH

**Total time: 3-4 days** (vault + DEX) or **5-6+ days** (vault + Kelp unstake)

**Vault buffer (onchain verified, April 27, 2026):**

| Metric | Value |
|--------|-------|
| Total assets | 15,294.54 rsETH |
| Deployed in strategies (`globalLoansAmount`) | 15,176.75 rsETH (**99.2%**) |
| **Vault buffer (rsETH balance held by hgETH)** | **117.13 rsETH (0.77%)** |
| Active loan/strategy positions (`getTotalLoansDeployed`) | 169 (was 162 in March) |
| Settlement account (`settlementAccount`) | [`0x66Bee721697BF17D9Eea28c51C828a43ba597B0b`](https://etherscan.io/address/0x66Bee721697BF17D9Eea28c51C828a43ba597B0b) (vault owner multisig) |
| Loans operator (`loansOperator`) | [`0x416e26e331Fc0b77386e9dDB5Ed9AdE73F1241F4`](https://etherscan.io/address/0x416e26e331Fc0b77386e9dDB5Ed9AdE73F1241F4) |
| Loans deployer (`loansDeployerAddress`) | [`0x9E053AAA3C435e94C1663a428cdC4ea91F23C556`](https://etherscan.io/address/0x9E053AAA3C435e94C1663a428cdC4ea91F23C556) |
| Scheduled caller (`scheduledCallerAddress`) | [`0x06eada250B02A3614AFce04B8cd7025093312159`](https://etherscan.io/address/0x06eada250B02A3614AFce04B8cd7025093312159) |
| GainAdapter (`gainAdapter`) | [`0xB185D98056419029daE7120EcBeFa0DbC12c283A`](https://etherscan.io/address/0xB185D98056419029daE7120EcBeFa0DbC12c283A) |
| Max supply cap (`maxSupply`) | 100,000 hgETH |
| Max deposit cap (`maxDepositAmount`) | 100,000 rsETH |

Only **0.77% of assets** are available as buffer (down from 1.45% in March). The remaining 99.2% is deployed across 169 strategy positions. **Withdrawals are currently disabled at the contract level** (`withdrawalsPaused()` = true), so even users with pending `requestRedeem()` claims cannot exit until the vault is unpaused.

### Accessibility

- **Deposits**: **Currently PAUSED** (since April 18, 2026). When active, open to anyone — deposit ETH/LSTs/rsETH, receive hgETH
- **Withdrawals**: **Currently PAUSED** (since April 18, 2026). When active, 3-4 day processing period via `requestRedeem()` → `claim()` flow (not instant). Assets recalled from 169 deployed strategy positions; only 0.77% buffer available even when unpaused
- **Composability**: hgETH can be used across DeFi (Morpho, Euler, Pendle) for additional yield, but secondary markets are extremely thin and the underlying rsETH peg is currently stressed

### Fees (onchain verified, April 27, 2026)

| Fee | Value | Mechanism |
|-----|-------|-----------|
| Management fee | **1.5% annual** (`managementFeePercent()` = 150, unchanged) | Time-based, continuously accruing against `totalAssets()`. `chargeManagementFee()` materializes accrued fees as new hgETH shares → **dilutes existing holders**. `collectFees()` transfers shares to fee collector. Last charged: March 24, 2026 17:01:35 UTC (`managementFeeLastKnownTimestamp` = 1774371695). Fee continues to accrue while vault is paused |
| Withdrawal fee | **0%** (`withdrawalFee()` = 0, unchanged) | — |
| Performance fee | **20%** (per Edge Capital proposal: "Fee Structure (management/performance): 1.5/20%") | Applied to profits above baseline; not independently verified onchain |
| Fee collector (`feesCollector`) | [`0x2151A97C7819782fD99efF020CdfE0aE838Ad378`](https://etherscan.io/address/0x2151A97C7819782fD99efF020CdfE0aE838Ad378) | Receives minted hgETH shares |
| Daily fee accrual | ~0.628 rsETH/day | On current 15,295 rsETH total assets |
| Annual fee | ~229 rsETH | 1.5% of total assets |
| `totalCollectableFees` | 0 (just collected) | — |

### Collateralization

- **Underlying asset**: rsETH (Kelp liquid restaked ETH)
- **rsETH backing**: ETH (~59.5%), ETHx from Stader (~32.5%), wstETH from Lido (~8%) — restaked on EigenLayer
- **hgETH backing**: 1 hgETH = 1.035 rsETH (onchain, March 1, 2026). rsETH is deployed across 12+ DeFi protocols
- **Non-custodial vault**: Per Upshift documentation, neither Upshift nor the Curator can withdraw user funds to an external EOA. Funds only move between whitelisted strategy contracts and the vault
- **Withdrawal Liquidity Buffer**: Configurable percentage of assets held in buffer for immediate redemptions (per Upshift docs)
- **No over-collateralization**: hgETH is a 1:1 receipt token for vault shares, not an over-collateralized position

### Provability

- **hgETH exchange rate**: Fully onchain via ERC-4626 `convertToAssets()` — programmatic, trustless
- **rsETH exchange rate**: Onchain via Kelp's LRT oracle
- **Strategy positions**: Deployed across DeFi protocols — visible onchain via August subaccounts
- **rsETH reserves**: Chainlink Proof of Reserve (PoR) integration (added May 2025 after fee minting incident)
- **Risk management**: Upshift enforces NAV Volatility Protection (max percentage change constraint on share-to-asset ratio per update cycle)

## Liquidity Risk

### Primary Exit Mechanisms

1. **Withdrawal from vault**: **Currently disabled at the contract level (`withdrawalsPaused()` = true)**. When active, request hgETH → rsETH redemption via Kelp Gain dApp; 3-4 day processing period as assets are recalled from strategies
2. **DEX swap**: hgETH composability on Balancer, Pendle; rsETH has ~$79M DEX liquidity (Curve rsETH/weETH $26M, Balancer rsETH/WETH $25.8M per LlamaRisk pre-exploit — current liquidity may be lower after the April 18 incident)
3. **Morpho/Euler**: hgETH can be used as collateral on Morpho and Euler Frontier vaults

### Liquidity Assessment

- **Primary liquidity (currently zero)**: Vault withdrawals are paused as of April 18, 2026. Even pending `requestRedeem()` claims cannot be processed until unpause. `maxRedeem()` = 0 (direct ERC-4626 redemption disabled). `maxWithdrawalAmount()` = 100,000 rsETH per request (onchain verified, but only meaningful when not paused)
- **rsETH secondary market (post-exploit)**: Pre-exploit rsETH had ~$79M across major DEX pools and traded above ETH. Following the April 18 LayerZero exploit, rsETH/wrsETH peg has come under significant stress (per multiple sources, rsETH traded as low as $1,723 vs ETH ≈ $2,270 in the days following). Liquidity providers across Curve/Balancer pools likely suffered substantial impermanent loss; current depth is materially thinner than pre-exploit
- **hgETH secondary market (verified)**: **Effectively zero.** Only one DEX pool exists:
  - **Uniswap V4 hgETH/ETH**: ~$311K liquidity, negligible 24h volume
  - No pools on Balancer, Curve, or other DEXes despite marketing claims of composability
  - hgETH DEX liquidity represents <1% of market cap — **negligible**
- **rsETH depeg risk (now realized)**: Prior to April 2026 the only significant depeg was -1.5% in April 2024 (quickly corrected). The April 18, 2026 LayerZero bridge exploit has created a sustained, structural rsETH depeg — wrapped rsETH on bridged chains is ~18% under-collateralized, and the canonical rsETH on Ethereum trades at a discount as the market prices in remediation uncertainty
- **Morpho context (urgent)**: The hgETH/WETH market (91.5% LLTV) is now at **99.5% utilization** (see table below). Suppliers are effectively locked because borrowers occupy almost all the capital. Liquidators cannot sell hgETH on DEXes (~$311K liquidity), the vault is paused (cannot redeem), and the Morpho oracle still references Kelp's LRT oracle (which has not adjusted for the bridge exploit). If the oracle eventually updates to reflect the rsETH market depeg, mass liquidations could trigger with no working exit path — a textbook bad-debt scenario

### Morpho Market (hgETH/WETH)

| Parameter | Value (April 27, 2026) |
|-----------|-------|
| Market ID | `0xec97655fab06b53bfad9d8c2358768aed5a1c97b204d3e51e2a7cb0cb786a264` |
| Collateral | hgETH ([`0xc824A08dB624942c5E5F330d56530cD1598859fD`](https://etherscan.io/address/0xc824A08dB624942c5E5F330d56530cD1598859fD)) |
| Loan Token | WETH ([`0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)) |
| Oracle | MorphoChainlinkOracleV2 ([`0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c`](https://etherscan.io/address/0x56dbc0f2784cd959e57fcc9cd83c3b7a24ee678c)) |
| IRM | AdaptiveCurveIrm ([`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)) |
| LLTV | 91.5% (immutable per Morpho design) |
| Total Supply | ~495.82 WETH (`totalSupplyAssets` onchain, was 756.59 in March) |
| Total Borrow | ~493.58 WETH (`totalBorrowAssets` onchain, was 597.22 in March) |
| **Utilization** | **~99.5%** (was 78.9% in March — suppliers cannot withdraw) |
| Last update | block timestamp 1777319567 (~April 27, 2026) |
| Fee | 0% |

### Morpho Oracle Analysis (onchain verified)

The oracle is a `MorphoChainlinkOracleV2` that uses two price feeds (no vault conversion):

| Parameter | Address | Description | Current Value |
|-----------|---------|-------------|---------------|
| BASE_VAULT | `0x0` | Not used | — |
| BASE_VAULT_CONVERSION_SAMPLE | — | — | 1 |
| BASE_FEED_1 | [`0x70cf192d6b76d57a46aafc9285ced110034eb013`](https://etherscan.io/address/0x70cf192d6b76d57a46aafc9285ced110034eb013) | EOMultiFeedAdapter (hgETH/USD, 18 decimals) — **TransparentUpgradeableProxy** | ~$2,529.25 |
| BASE_FEED_2 | `0x0` | Not set | — |
| QUOTE_FEED_1 | [`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Chainlink ETH/USD (8 decimals) | ~$2,280.78 |
| QUOTE_FEED_2 | `0x0` | Not set | — |
| SCALE_FACTOR | — | Decimal adjustment | 1e26 |
| **price()** | — | **Final oracle price** | **~1.1089 (hgETH/ETH ratio, unchanged from pre-exploit)** |

Values above are read at Ethereum block 24973596 (timestamp 1777319567, the Morpho market `lastUpdate`). Spot prices an hour later were materially identical in ratio (~1.109) but a few dollars different in absolute USD terms.

**Oracle architecture:**
- `price = baseFeed1 * SCALE_FACTOR / quoteFeed1` → hgETH/USD ÷ ETH/USD = hgETH/ETH
- The hgETH/USD feed is an **EOMultiFeedAdapter** behind a **TransparentUpgradeableProxy**
- Proxy admin: [`0x9b61cf07caa513430a21d4f1cb6b93d90a6bbfb8`](https://etherscan.io/address/0x9b61cf07caa513430a21d4f1cb6b93d90a6bbfb8) (ProxyAdmin)
- ProxyAdmin owner: [`0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E`](https://etherscan.io/address/0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E) (3-of-5 Gnosis Safe — different signers from vault multisig, onchain verified)

**Oracle concerns:**
- **Upgradeable oracle feed**: The hgETH/USD feed is a TransparentUpgradeableProxy (EOMultiFeedAdapter). The proxy admin multisig (3-of-5) could upgrade the oracle implementation — this is a significant centralization vector. Unlike the standard Chainlink ETH/USD feed, this oracle can be modified
- **No vault conversion**: The oracle does NOT use the onchain ERC-4626 exchange rate. Instead, it relies entirely on the EOMultiFeedAdapter for hgETH pricing. If the adapter price diverges from the actual vault value, mispricing could occur
- **Realized risk post-April 2026 exploit**: The Morpho oracle still reports hgETH/ETH ≈ 1.109 (unchanged from pre-exploit), and Kelp's underlying LRT oracle (`rsETHPrice()` = 1.0696 ETH per rsETH) has not adjusted to reflect the under-collateralization on bridged wrsETH. While this protects current borrowers from immediate liquidation, it means the oracle is **structurally divergent** from market value. If Kelp updates the LRT oracle to reflect the true backing post-remediation, the Morpho market would see mass liquidations against extremely thin liquidity (~$311K hgETH DEX, vault paused) — high risk of bad debt
- **Oracle proxy admin (different multisig)**: ProxyAdmin owner is [`0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E`](https://etherscan.io/address/0x266f15c63d5D3dE038F2E05D1fA397d92BCB013E) (3-of-5 Gnosis Safe with 5 different signers from the vault multisig — onchain verified). Configuration unchanged from March 2026
- **Positive**: The ETH/USD quote feed is standard Chainlink with normal roundId, timestamps, and heartbeat

## Centralization & Control Risks

### Governance

The hgETH vault is controlled by a 3-of-5 Gnosis Safe multisig. Both the vault `owner()` and the ProxyAdmin are controlled by the same 5 signers:

| Role | Controlled By | Description |
|------|---------------|-------------|
| hgETH `owner()` | 3-of-5 Multisig | Vault administrative operations |
| hgETH ProxyAdmin Owner | 3-of-5 Multisig (same signers) | Can upgrade hgETH implementation |

**Governance concerns:**
- **No timelock on proxy upgrades (onchain verified)**: The ProxyAdmin ([`0xd355daae366220a0282cd5d2687fbc395395fc40`](https://etherscan.io/address/0xd355daae366220a0282cd5d2687fbc395395fc40)) is owned directly by the 3-of-5 Safe — no TimelockController or delay contract in between. The ProxyAdmin has no `getMinDelay()` or `delay()` functions. Neither Safe has modules (`getModulesPaginated()` returns empty). The vault's `lagDuration()` = 0. Upshift documentation claims "24-hour timelocks on critical modifications" — **this is not enforced onchain for proxy upgrades**. The `updateTimelockDuration` function exists in the vault ABI but controls vault operational parameters, not proxy upgrades
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

- **hgETH exchange rate**: Onchain via ERC-4626 `convertToAssets()`. Programmatic
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
- **Quick incident response (April 2026)**: Kelp's operations multisig paused rsETH contracts and bridge routes within ~46 minutes of the LayerZero exploit. hgETH vault was paused the same day. Arbitrum Security Council froze ~30,766 ETH of attacker funds within days
- **Multiple audit layers**: Extensive auditing across the stack — Sigma Prime, Code4rena, MixBytes across rsETH; ChainSecurity, Hacken, Sigma Prime, Zellic across Upshift and Kernel. Only 1 public audit for hgETH/Gain vault (Sigma Prime, Nov 2024)
- **hgETH/Gain contracts not directly compromised**: The April 18, 2026 exploit was on the LayerZero OFT bridge layer (escrow on Ethereum, forged DVN attestation). The hgETH vault contract, the Gain accounting, and the rsETH balances held by the vault on Ethereum were not the source of the bug
- **Non-custodial vault architecture**: Upshift's design prevents curators from withdrawing funds to external EOAs; policy-constrained execution via August subaccounts
- **Nexus Mutual embedded cover**: Integrated insurance covering $30M+ of vault positions against smart contract exploits, oracle failures, and liquidation mechanism failures. **Does not cover** strategy losses from looping/leverage liquidations, market movements, or — based on the public cover terms — bridge / cross-chain messaging failures of the kind seen in April 2026 (this would need to be confirmed with Nexus on the actual hgETH cover policy)
- **Chainlink PoR**: rsETH integrated Chainlink Proof of Reserve Secure Mint (added after the April 2025 fee-minting bug)
- **rsETH governance**: 6-of-8 multisig with 10-day timelock for the underlying rsETH layer

### Key Risks

- **Vault is paused (April 18, 2026)**: Both deposits and withdrawals are disabled at the contract level. Existing holders cannot exit even via `requestRedeem()`. There is no public timeline for unpause
- **Underlying rsETH peg under stress**: ~116,500 rsETH (~18% of supply) was released from the LayerZero OFT escrow to an attacker. Wrapped rsETH on bridged chains is structurally under-collateralized; rsETH market price diverged sharply from ETH in the days following. Remediation (recovery / DeFi United AIP) is uncertain
- **Multi-layered complexity (now realized)**: The "deeply layered dependency chain" called out in the prior assessment (rsETH → EigenLayer → Upshift → 12+ protocols) materialized as a real-world failure on the bridge / cross-chain layer
- **Actively managed vault**: Unlike passive vaults, the curator (UltraYield) makes allocation decisions. Strategy risk depends on curator competence
- **Upgradeable oracle that did not adjust**: The hgETH/USD Morpho oracle feed (EOMultiFeedAdapter) is behind an upgradeable proxy. As of April 27, 2026 it still reports hgETH/ETH ≈ 1.109 — unchanged from pre-exploit — even though market price of rsETH/ETH has dropped materially. A future oracle update to reflect reality would trigger mass liquidations against essentially zero exit liquidity
- **hgETH governance weaker than rsETH**: 3-of-5 multisig with mostly anonymous signers and no verified onchain timelock, while rsETH has a 6-of-8 multisig with 10-day timelock
- **Withdrawal delay + zero DEX liquidity (was already a concern, now compounded)**: When the vault is unpaused, 3-4 days to exit hgETH to rsETH, and only ~$311K DEX liquidity. The Morpho market is at **99.5% utilization** so suppliers are also locked
- **Confirmed no onchain timelock**: Despite Upshift documentation claiming "24-hour timelocks," no timelock exists on the hgETH ProxyAdmin upgrade path (onchain verified)
- **Bug bounty scope still excludes hgETH/Gain**: Immunefi Kelp DAO bounty covers rsETH core contracts only; the hgETH and Gain vault contracts remain out of scope (not changed since the prior assessment)

### Critical Risks

- **Liquidation cascade against frozen exit paths**: hgETH/WETH on Morpho is 99.5% utilized at 91.5% LLTV. The vault is paused, hgETH DEX liquidity is ~$311K, the underlying rsETH market is depegged, and the Morpho oracle has not adjusted. If the oracle eventually updates to reflect rsETH's true market value, liquidations would trigger with no functioning sell path — a high-probability bad-debt scenario for Morpho suppliers
- **Underlying asset value uncertainty**: The accounting hgETH ≈ 1.0368 rsETH is unchanged onchain, but rsETH's *market value in ETH* is materially lower than the protocol's oracle and may need to be marked down once the recovery process resolves. The size of any markdown depends on bridge-exploit remediation outcomes (recovered funds, socialization across rsETH holders, etc.)
- **Concentrated multisig over a paused asset with no timelock**: The same 3-of-5 Safe controls operational pause/unpause and proxy upgrades on hgETH. With the vault frozen, this multisig has effectively unilateral control over user exit — an unfavorable position for any third-party integrator

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — Extensively audited across multiple layers: Sigma Prime (rsETH + hgETH), Code4rena, MixBytes (rsETH), ChainSecurity, Hacken, Zellic (Upshift + Kernel). Only 1 public audit specifically for hgETH/Gain (Sigma Prime). **PASS**
- [x] **Unverifiable reserves** — hgETH is an ERC-4626 vault wrapping rsETH. Both exchange rates are verifiable onchain. Strategy positions are onchain in DeFi protocols. rsETH has Chainlink PoR (though PoR did not prevent the LayerZero bridge exploit, since the issue was on the OFT messaging layer, not on Ethereum-side mint accounting). **PASS**
- [x] **Total centralization** — 3-of-5 multisig for hgETH, 6-of-8 multisig with 10-day timelock for rsETH. Not a single EOA. **PASS**

**All gates pass.** Proceed to category scoring. Note: the April 18, 2026 incident does not trigger a hard auto-fail (the bug was not in hgETH/Gain contracts and reserves remain verifiable), but it materially increases risk in several categories.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 5+ audits for rsETH from 3 reputable firms (Sigma Prime, Code4rena, MixBytes). 1 public audit for hgETH/Gain vault (Sigma Prime, Nov 2024). 6+ audits for Upshift (ChainSecurity, Hacken, Sigma Prime, Zellic). No new hgETH-specific audit found since Nov 2024
- **Bug Bounty**: Active Immunefi program with $250K max for rsETH core contracts only. hgETH/Gain vault contracts are **not in scope** (verified on Immunefi). No separate KernelDAO bounty exists. Bridge / OFT messaging configuration was also not in any auditable scope — the misconfigured 1-of-1 DVN was an operational/deployment choice
- **Time in Production**: KelpDAO ~28 months (since Dec 2023). Founders' prior project (Stader) since Apr 2021. hgETH deployed November 19, 2024 (~17 months onchain)
- **TVL**: ~$37M hgETH market cap (down from $48M in March, mainly from price/redemptions before pause). Kelp ecosystem TVL down significantly post-exploit
- **Incidents (now THREE, including a ~$292M direct ecosystem loss)**:
  - DNS hijack (Jul 2024) — ops issue, resolved
  - rsETH fee-minting bug (Apr 2025) — caught before fund loss, resolved
  - **LayerZero OFT bridge exploit (Apr 18, 2026) — ~116,500 rsETH (~$292M) released from escrow. Not an hgETH bug, but the largest crypto exploit of 2026 in the same ecosystem. Operational cause: misconfigured 1-of-1 DVN on the Unichain→Ethereum route**

**Score: 3.5/5** (was 2.5) — The audit coverage on hgETH/Gain itself has not changed (still 1 public audit, still out of bug bounty scope). What changed is that the broader Kelp ecosystem now has a confirmed nine-figure exploit driven by a deployment/configuration error that the team's existing security processes did not catch. Even though the bug was in a LayerZero-managed OFT path rather than in hgETH code, it directly affects the hgETH underlying asset and demonstrates that security processes around adjacent infrastructure are inadequate. Prior incidents being non-loss-events looked good in March; the April 2026 event invalidates that interpretation.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-5 multisig for hgETH vault (4 anonymous signers, 1 known deployer) — unchanged
- ProxyAdmin controlled by same 3-of-5 multisig (same signers) — unchanged
- No verified onchain timelock on the hgETH ProxyAdmin (Upshift docs claim 24-hour timelocks; not verified onchain)
- The same 3-of-5 multisig has unilateral control over pause/unpause, currently exercised since April 18, 2026 with no public timeline for unpause
- rsETH layer: 6-of-8 multisig with 10-day timelock — but the LayerZero OFT bridge configuration that was exploited was an operational/deployment setting outside this timelock
- $KERNEL governance token launched April 2025 (DAO still maturing)

**Governance Score: 3.5** (was 3.0) — Same architecture as before, but the April 2026 incident demonstrated that critical configuration (DVN trust assumption on cross-chain messaging) lived outside both audit and timelock scope. The vault is also currently in an indefinite pause controlled by the 3-of-5 multisig.

**Subcategory B: Programmability**

- hgETH exchange rate: onchain via ERC-4626. Programmatic
- Strategy execution: curator-managed via Upshift, policy-constrained but not fully automated
- Withdrawals: paused by multisig action. When active, 3-4 days, operational process
- NAV bounds checking: automated guards against anomalous exchange rate changes
- Emergency pause: multi-sig controlled — currently active

**Programmability Score: 3.5** (was 3.0) — Hybrid as before, with the additional realization that user exit rights are at the discretion of the multisig (currently exercised). The Morpho oracle that prices hgETH is also operationally driven (Kelp's LRT oracle has not adjusted to reflect the bridge-induced under-collateralization).

**Subcategory C: External Dependencies**

- **Critical**: rsETH (Kelp), EigenLayer, Upshift Finance, **LayerZero OFT messaging** (now demonstrably failed)
- **High**: UltraYield/Edge Capital (curator), August (subaccounts), EOMultiFeedAdapter (oracle)
- **Medium**: 12+ DeFi destination protocols, Chainlink, Nexus Mutual
- The Kelp/LayerZero relationship is no longer a benign dependency — a misconfiguration there caused the largest single-protocol crypto exploit of 2026 and directly stresses the hgETH underlying asset

**Dependencies Score: 4.0** (was 3.5) — Heavy dependency chain that has now produced a real, large-magnitude failure outside hgETH's direct contracts. Curator and Upshift architectural mitigants remain, but cross-chain messaging risk is elevated.

**Centralization Score = (3.5 + 3.5 + 4.0) / 3 = 3.67**

**Score: 3.67/5** (was 3.0) — Architecture unchanged, but observed failure modes increase scoring relative to March. Score is the calculated subcategory mean rather than a half-point bucket.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- hgETH is a 1:1 ERC-4626 receipt token for rsETH deposited in the vault — onchain accounting unchanged
- rsETH is *nominally* backed by ETH/LSTs restaked on EigenLayer, but the LayerZero OFT escrow leaked ~116,500 rsETH (~18% of supply) to an attacker on April 18, 2026. Wrapped rsETH on bridged chains is now under-collateralized; ultimate impact on the rsETH/ETH backing ratio depends on remediation outcomes (recovery, socialization, etc.)
- Vault positions deployed across well-known DeFi protocols (169 active loans)
- Non-custodial: curators cannot extract funds to external EOAs (architecture unchanged)
- Nexus Mutual embedded cover for $30M+ of vault positions exists, but cover scope is for protocol-level smart-contract exploits, oracle failures, and liquidation mechanism failures. **Bridge / cross-chain messaging failures (the actual April 2026 cause) are likely outside the Nexus cover terms** based on standard exclusions — this should be confirmed with Nexus before relying on insurance for this specific event

**Collateralization Score: 4.0** (was 2.5) — Vault accounting is unchanged onchain, but the underlying rsETH backing is materially weakened by an unresolved nine-figure loss in the bridge layer. Insurance coverage is unlikely to apply to this specific failure mode.

**Subcategory B: Provability**

- hgETH exchange rate: fully onchain (ERC-4626) — unchanged
- rsETH exchange rate: onchain via Kelp's LRT oracle (`rsETHPrice()` = 1.0696 ETH/rsETH) — but this oracle has not adjusted for the under-collateralization on bridged wrsETH, so it does not currently reflect economic reality
- Chainlink PoR was added to rsETH after the April 2025 incident, but the April 2026 exploit was not on the mint path on Ethereum — it was on the cross-chain release path, where PoR did not detect or prevent the issue
- Strategy positions: onchain in DeFi protocols (transparent)
- NAV updates: bounded, with anomaly detection — but the anomaly that occurred (cross-chain backing loss) is not visible to the vault's NAV checks

**Provability Score: 3.5** (was 2.5) — Onchain verifiability of hgETH itself remains good, but the *meaningful* answer ("how much ETH actually backs my rsETH right now?") is no longer reliably provable given unresolved bridge exploit accounting.

**Funds Management Score = (4.0 + 3.5) / 2 = 3.75**

**Score: 3.75/5** (was 2.5) — Architecture unchanged, but ability to actually realize the claimed value is materially impaired pending remediation.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: **Currently disabled** — `withdrawalsPaused()` = true since April 18, 2026. No public timeline for unpause. When active, 3-4 day withdrawal cycle with `maxRedeem()` = 0 (must use `requestRedeem()` flow)
- **rsETH DEX liquidity**: Pre-exploit ~$79M across Curve and Balancer pools. Post-exploit liquidity is materially diminished (DEX LPs hit by IL during depeg, Aave/SparkLend/Fluid froze rsETH markets). Specific current depth not verified in this reassessment
- **hgETH DEX liquidity (verified)**: **Negligible** — only ~$311K in a single Uniswap V4 pool. Effectively zero secondary market
- **rsETH depeg history (now severe)**: April 2024 had a brief -1.5% depeg. April 2026 produced a structural depeg from a real cross-chain backing loss; recovery is uncertain
- **Same-denomination**: hgETH → rsETH → ETH. All notionally ETH-denominated, but the rsETH/ETH peg is the load-bearing assumption — currently broken
- **Morpho context**: 91.5% LLTV market is 99.5% utilized — suppliers are locked in at the smart-contract level until borrowers repay. With the vault paused and DEX liquidity essentially zero, there is no functioning exit path for either suppliers or potential liquidators

**Score: 4.5/5** (was 3.5) — Practically, exit is currently impossible: vault paused, Morpho market 99.5% utilized, DEX liquidity ~$311K against tens of millions in market cap, and the underlying rsETH peg is broken. This corresponds to "withdrawal restrictions, >1 week or >10% impact" — and at the moment is closer to "no exit at all".

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Both founders publicly known with strong credentials (Stader Labs, LinkedIn, PayPal, IIT). Well-funded ($19M+)
- **Curator**: UltraYield by Edge Capital — professional crypto fund manager
- **Documentation**: Good quality across Kelp GitBook, Upshift docs, KernelDAO blog
- **Legal Structure**: Evercrest Technologies Inc. (Andorra). Limited regulatory oversight
- **Source code**: Contracts verified on Etherscan but not open source on GitHub
- **Incident response (April 2026)**: Operations multisig paused rsETH and hgETH within an hour of detection; coordination with Aave Labs, LayerZero, Arbitrum Security Council, EtherFi, Compound on remediation; jointly filed Constitutional AIP for "DeFi United" recovery vehicle. Public communication has been reasonably timely
- **Root cause (April 2026)**: 1-of-1 DVN configuration on a production OFT route is a serious deployment / configuration failure. Process gap rather than a code bug, but still attributable to the team's operational practices

**Score: 3.0/5** (was 2.0) — Team and response remain credible. The cause of the largest single-protocol crypto exploit of 2026 was a deployment configuration choice attributable to Kelp's operations, which materially raises operational risk relative to the prior assessment. Credit for fast and coordinated response.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score (Apr 2026) | Score (Mar 2026) | Weight | Weighted (Apr 2026) |
|----------|------------------|------------------|--------|---------------------|
| Audits & Historical | 3.5 | 2.5 | 20% | 0.70 |
| Centralization & Control | 3.67 | 3.0 | 30% | 1.101 |
| Funds Management | 3.75 | 2.5 | 30% | 1.125 |
| Liquidity Risk | 4.5 | 3.5 | 15% | 0.675 |
| Operational Risk | 3.0 | 2.0 | 5% | 0.15 |
| **Final Score** | | | | **3.75** |

**Final Score: 3.75/5.0** (was 2.8/5.0 in March 2026). Subcategory means are used directly; no half-point bucketing.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

**Practical recommendation**: Do not take new exposure to hgETH while the vault remains paused and rsETH bridge remediation is unresolved. Reassess after (a) vault unpauses, (b) Kelp publishes a detailed post-mortem and remediation plan with concrete numbers, and (c) the rsETH/ETH peg stabilizes for a sustained period. Do not rely on the Morpho hgETH/WETH market as a Yearn collateral or liquidation venue: the market is already 99.5% utilized and an oracle update would produce mass liquidations against effectively zero exit liquidity.

---

hgETH is an actively managed ERC-4626 vault token built by a well-funded, experienced team (KelpDAO / Stader Labs founders) on established infrastructure (Upshift Finance). The protocol benefits from extensive auditing, an active bug bounty (rsETH only), Nexus Mutual embedded cover, and non-custodial vault architecture that prevents curator fund extraction.

The original assessment (March 2026, score 2.8 — Medium Risk) flagged three concerns: layered smart-contract risk, an upgradeable oracle for the Morpho market, and weaker governance on the hgETH layer than on rsETH. **The April 18, 2026 LayerZero OFT bridge exploit (~116,500 rsETH / ~$292M released from escrow) materialized exactly the "tail event in a layered dependency chain" risk the prior report warned about.** The bug was not in hgETH/Gain code — those contracts hold canonical rsETH on Ethereum and are unchanged — but the cascading effects on rsETH peg, on Aave/Morpho rsETH markets, and on hgETH operational state are direct and material.

**For the intended Yearn use case (hgETH as Morpho collateral or in a strategy), the current state is unworkable:**

- The hgETH/WETH Morpho market is at **99.5% utilization** at 91.5% LLTV. Suppliers are locked in; no liquidator could exit either
- The hgETH vault is paused at the contract level — `requestRedeem()` claims cannot be processed
- hgETH DEX liquidity is ~$311K against tens of millions of market cap
- The Morpho oracle still references Kelp's LRT oracle, which has not adjusted to reflect rsETH's lost cross-chain backing. A future oracle update would trigger mass liquidations against zero exit liquidity — the textbook scenario for bad debt accumulation on Morpho

**Recommendation**: hold off on new exposure. Revisit once (a) vault is unpaused, (b) Kelp/LayerZero publish a clear post-mortem and an executed remediation that restores rsETH backing or socializes the loss with a known number, (c) rsETH/ETH stabilizes at a clear new peg for several weeks, and (d) the Morpho hgETH/WETH market normalizes (utilization, supply/borrow, oracle alignment).

**Key conditions for any future exposure:**

- Monitor `depositsPaused()` / `withdrawalsPaused()` (currently true, true)
- Monitor hgETH exchange rate (`convertToAssets(1e18)`) for decreases — would indicate underlying loss being passed through
- Monitor rsETH/ETH market vs. `rsETHPrice()` from Kelp's LRT oracle for divergence (currently very large)
- Monitor hgETH proxy for implementation upgrades (no verified timelock — instant once executed)
- Monitor the hgETH/USD Morpho oracle feed proxy ([`0x70cf192d6b76d57a46aafc9285ced110034eb013`](https://etherscan.io/address/0x70cf192d6b76d57a46aafc9285ced110034eb013)) for implementation upgrades
- Monitor both vault and oracle Safes for signer/threshold changes
- Note: **No onchain timelock exists** on hgETH ProxyAdmin despite Upshift documentation claims — proxy upgrades are instant
- Performance fee confirmed at 20% per Edge Capital proposal (management fee 1.5%, performance fee 20%); fee continues to accrue while paused
- Position sizing should remain very conservative until the broader rsETH ecosystem stabilizes; current hgETH supply is ~14,750 hgETH

---

## Reassessment Triggers

- **Time-based**: Reassess every 30 days while vault remains paused or until rsETH bridge remediation is fully resolved; thereafter every 6 months
- **Pause-state**: Reassess immediately on `depositsPaused()` or `withdrawalsPaused()` flipping to false
- **rsETH bridge remediation**: Reassess on (a) Kelp publishing a final post-mortem with concrete numbers, (b) any movement on the Constitutional AIP / "DeFi United" recovery vehicle, (c) socialization or recovery transactions executed onchain
- **rsETH peg**: Reassess if rsETH/ETH market price returns within 1% of Kelp's `rsETHPrice()` for 30 consecutive days, OR if Kelp's LRT oracle updates to reflect a new lower peg
- **Morpho market normalization**: Reassess if hgETH/WETH market utilization drops below 90% and DEX liquidity returns to >$5M
- **Governance-based**: Reassess if an onchain timelock is verified/added for hgETH vault upgrades (would improve Centralization score)
- **Oracle-based**: Reassess immediately if the hgETH/USD oracle feed proxy is upgraded
- **Audit-based**: Reassess if additional hgETH/Gain or rsETH bridge-layer audits by tier-1 firms are completed
- **Bug bounty scope**: Reassess if hgETH/Gain vault contracts are explicitly added to the Immunefi program scope, and if cross-chain messaging configuration is brought into auditable scope

## Appendix A — Related Protocol Audits

### Upshift Finance (vault infrastructure) Audits

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **ChainSecurity** | Jan 2025 | Core Vault | Available |
| 2 | **Hacken** | Sep 2025 | Unknown scope | Available |
| 3 | **Hacken** | Dec 2025 | Unknown scope | Available |
| 4 | **Hacken** | Jan 2026 | AllocationWhitelist | Available |
| 5 | **Sigma Prime** | Aug 2024 | Unknown scope | Available |
| 6 | **Zellic** | Apr 2023 | Fractal Protocol (predecessor) | Available |

### rsETH (Kelp) Audits

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

### Kernel (BNB Chain) Audits

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **ChainSecurity** | Dec 2024 | Kernel smart contracts | [PDF](https://cdn.prod.website-files.com/65d35b01a4034b72499019e8/677289c9b2a5ff641ff2d3d0_ChainSecurity_Kernel_DAO_Kernel_audit.pdf) |
| 2 | **Bailsec** | Unknown | Kernel platform | Not publicly available |
| 3 | **Sherlock** | Jul 2025 | Slashing/restaking logic | Private engagement |
