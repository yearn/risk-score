# Protocol Risk Assessment: Spectra Finance

- **Assessment Date:** February 21, 2026
- **Token:** PT (Principal Token) / MetaVault shares
- **Chain:** Ethereum (+ Base, Arbitrum, and others)
- **Token Address:** N/A (permissionless protocol — multiple PT and MetaVault deployments)
- **Final Score: 2.25/5.0**

## Overview + Links

Spectra Finance (formerly APWine Finance, rebranded July 2023) is a permissionless interest rate derivatives protocol for EVM chains. It enables users to tokenize, trade, and fix the yield on ERC-4626 interest-bearing assets by splitting them into **Principal Tokens (PT)** and **Yield Tokens (YT)**. The protocol is built on top of Curve's AMM infrastructure and supports permissionless pool creation.

**Core Protocol Mechanics:**

1. Users deposit an ERC-4626 interest-bearing token (IBT) into a Spectra market
2. The IBT is split into PT (claim on principal at maturity) and YT (claim on future yield)
3. PTs trade at a discount on Curve pools — the discount represents the "fixed rate"
4. At maturity, 1 PT redeems for 1 unit of underlying (unless negative yield occurred)
5. MetaVaults automate liquidity management across expiring pools

**Use Case Context:** The report is needed for deposits from [Ethstrat ESPN](https://docs.ethstrat.xyz/espn/espn) to a newly deployed, self-curated MetaVault. PT tokens from this MetaVault may be used as collateral on Morpho markets (see [existing PT-cUSD Morpho market](https://app.morpho.org/ethereum/market/0x802ec6e878dc9fe6905b8a0a18962dcca10440a87fa2242fbf4a0461c7b0c789/pt-cusd-29jan2026-usdc) as precedent). Liquidity data will not be available initially for the new deployment.

**Links:**

- [Spectra Documentation](https://docs.spectra.finance/)
- [Spectra App](https://app.spectra.finance/)
- [MetaVault Docs](https://docs.spectra.finance/metavaults/about-core-concepts)
- [PT/Fixed Rates Docs](https://docs.spectra.finance/app-help/fixed-rates)
- [Spectra Developer Docs](https://dev.spectra.finance/)
- [Spectra Curator Docs](https://curator.docs.spectra.finance/)
- [Security & Audits](https://docs.spectra.finance/security/audits)
- [Risk Documentation](https://docs.spectra.finance/security/risk-documentation)
- [Spectra Core GitHub](https://github.com/perspectivefi/spectra-core)
- [Code4rena Audit Report](https://code4rena.com/reports/2024-02-spectra)
- [Nansen Research: Spectra](https://research.nansen.ai/articles/spectra-finance-fixed-rate-stablecoin-vaults)
- [DefiLlama: Spectra V2](https://defillama.com/protocol/spectra-v2)

## Audits and Due Diligence Disclosures

| Auditor | Date | Scope | High | Medium | Low/Info | Status |
|---------|------|-------|------|--------|----------|--------|
| [Code4rena](https://code4rena.com/reports/2024-02-spectra) (42 wardens) | Mar-Apr 2024 | spectra-core (7 contracts, 976 LoC) | 0 | 2 | 11 | All resolved |
| [Pashov Audit Group](https://github.com/pashov/audits/blob/master/team/pdf/Spectra-security-review.pdf) | Mar 2024 | spectra-core | 0 | 3 | 15 | All resolved |
| Sherlock | Sep 2025 | MetaVaults V1 (private repo) | 0 | 2 | 9 | All resolved |

**Zero high-severity findings** across all three audits. Codebase is open source.

**Notable Code4rena findings:**
- **M-01:** PrincipalToken is not fully ERC-5095 compliant — `redeem` and `withdraw` don't support ERC-20 approval flows; `maxWithdraw`/`maxRedeem` revert when paused instead of returning 0
- **M-02:** IBT vault yield drainage via flash loan deflation attack — attackers can exploit flash loans to drain accumulated yield when IBT vault prices reset to default values

The smart contract architecture involves: PrincipalToken, YieldToken, AMBeacon, AMProxyAdmin, AMTransparentUpgradeableProxy, PrincipalTokenUtil, and RayMath — moderate complexity with Curve AMM integration.

### Bug Bounty

- [Immunefi Audit Competition](https://immunefi.com/audit-competition/audit-comp-spectra-finance/) — $40,000 pool, 2-week competition (April 3-17, 2025), **now finished**
- **No active ongoing bug bounty program** currently exists for Spectra Finance
- Historical APWine bug bounty on HackenProof — status unknown post-rebrand
- **Not listed** on SEAL Safe Harbor registry

## Historical Track Record

- **Production time:** Spectra V2 live since early 2024 (~2 years); APWine V1 launched 2021 (~5 years total development)
- **TVL:** ~$40.69M across chains (Spectra V2), historically peaked ~$100M+ (August 2025)
- **Token:** SPECTRA (launched December 2024, replacing APW via SIP3), max supply 876.7M

**Chain Deployments:**

| Chain | TVL |
|-------|-----|
| Hemi | $20.39M |
| Katana | $6.5M |
| Ethereum | $5.71M |
| Flare | $5.25M |
| Base | $1.12M |
| Arbitrum | $100K |
| Others (Avalanche, Sonic, BSC, OP) | Minimal |

**Security Incidents:**

1. **Router Exploit (July 23, 2024):** ~168 ETH (~$73K) lost. Arbitrary call vulnerability in the `execute` function's `_dispatch` handler allowed an attacker to drain tokens approved to the router via the `KYBER_SWAP` command type. 4 wallets affected. **Core protocol was unaffected** — only the router contract had the vulnerability. [Post-mortem published](https://mirror.xyz/spectraprotocol.eth/7Y1L_0y8CxA5rkneK5DAUelhb8v3GLEeGbEX39y9790).

2. **APWine Critical Delegation Bug (pre-rebrand):** Discovered by whitehat `setuid0` via Immunefi before exploitation. Incorrect check in PT `beforeTokenTransfer` allowed bypassing delegation amount checks when burning tokens (since `to == address(0)`). Could have enabled yield theft after ~6 months. **$100,000 bounty paid**. Patched before any exploitation.

No concentration risk data available for the specific MetaVault (not yet deployed). Existing MetaVaults (Gami Spectra USDC on Base: $637K TVL, vbUSDC Katana: $905K TVL) are small-scale with limited depositor data.

## Funds Management

Spectra itself does not custody or delegate funds — it provides a permissionless framework for yield tokenization. The actual fund flows depend on the MetaVault configuration and the underlying IBT used.

### MetaVault Fund Flow

1. Users deposit underlying assets (e.g., USDC) into MetaVault (ERC-7540 asynchronous deposit)
2. MetaVault curator allocates to Spectra pools containing interest-bearing tokens (IBTs)
3. IBTs are split into PT + YT positions and deployed into Curve liquidity pools
4. Curator manages rollovers between expiring pools and new maturities
5. Yield compounds via "YT → LP Token" reinjection loop

### Accessibility

**MetaVault (ERC-7540 Asynchronous):**
- **Deposits:** Request → Settle → Claim (three-step asynchronous flow)
- **Redemptions:** Request → Settle → Claim
- **Not atomic** — curator must batch-settle requests per epoch
- **Settlement risk:** If curator fails to prepare sufficient assets before settlement, users face delays

**Spectra PT/YT (Direct, no MetaVault):**
- Anyone can deposit IBTs to mint PT + YT (permissionless)
- Deposit and withdrawal are atomic (single transaction)
- Slippage protection available via `minShares` parameter
- Post-expiry: first caller triggers `StoreRatesAtExpiry()` which freezes final rates

### Collateralization

**PT Backing:**
- PTs are **fully backed** by the deposited IBT
- 1 PT represents a claim on 1 unit of underlying at maturity
- **Negative yield risk:** If the underlying IBT loses value (e.g., vault exploit), the PT backing decreases proportionally. The `ptRate` can only decrease, never increase. `_computeYield()` reconciles losses fairly across all holders
- All collateral is verifiable on-chain through the PrincipalToken contract

**The quality of PT collateral depends entirely on the underlying IBT** — Spectra is agnostic to what IBT is used. If the IBT comes from a risky vault, PTs inherit that risk. Risk assessment of the specific IBT should be done separately (see respective asset reports).

### Provability

- All PT/YT balances and rates are on-chain and programmatically computed
- `ptRate` and `ibtRate` are transparent contract state variables
- Exchange rates computed algorithmically — no privileged role updates
- Anyone can verify reserves by reading the PrincipalToken contract
- Revenue: 3% yield fee + 3% points fee to Spectra DAO treasury

## Liquidity Risk

**Note:** The MetaVault is newly deployed and liquidity data will not be available initially. This section assesses structural liquidity characteristics rather than current depth.

**Spectra PT Exit Mechanisms:**

1. **At maturity:** Direct 1:1 redemption for underlying (minus any negative yield losses). This is a time-based exit guarantee
2. **Before maturity:** Market-based exit via Curve AMM pools — price depends on liquidity and time to maturity
3. **MetaVault:** Async redemption via ERC-7540 request → settle → claim flow

**Structural Liquidity Considerations:**

- PT liquidity depends on the depth of the specific Curve pool for that market
- New pools and new MetaVaults will start with limited liquidity
- MetaVault curator controls rollover timing — if poorly managed, liquidity gaps can occur between pool expirations
- **MetaVault adds async withdrawal delay** on top of any delay from the underlying IBT. If the underlying IBT also has async withdrawals, exits face compounded delays
- PT holders can always wait until maturity for 1:1 redemption (subject to negative yield risk)
- Same-value assets (e.g., USDC-denominated PTs) can tolerate longer exit times

**Existing MetaVault Liquidity Data (for reference):**

| MetaVault | Chain | TVL | Curator |
|-----------|-------|-----|---------|
| Gami Spectra USDC | Base | $637K | Gami Labs |
| vbUSDC Katana | Katana | $905K | Clearstar |

Both existing MetaVaults are small-scale. No stress-period liquidity data available.

## Centralization & Control Risks

### Governance

**Spectra Protocol:**
- **Token:** $SPECTRA with veSPECTRA for governance voting, gauge allocation, and fee sharing
- **Core contracts** use AMProxyAdmin and AMTransparentUpgradeableProxy — **upgradeable**
- TODO: Verify ProxyAdmin owner on-chain (multisig threshold, timelock, signer identities)
- Revenue sharing: 60% swap fees to veSPECTRA voters, 20% to LPs, 20% to Curve DAO
- Pool creation is **permissionless** — anyone can create a Spectra market for any ERC-4626 token

**Spectra MetaVault Governance (Zodiac + Gnosis Safe):**

| Role | Responsibilities |
|------|-----------------|
| **Accountant** | Share settlement, performance tracking, conversion rate adjustments |
| **Curator** | Portfolio strategy, capital allocation across Spectra markets, rebalancing |
| **Guardian** | Security oversight, transaction monitoring, operation verification, time-locked mechanisms |

- Curators execute via `execTransactionWithRole` with strict constraints:
  - Token receivers restricted to the MetaVault's SAFE address
  - Actions limited to curator-enabled markets only
  - DelegateCall is NOT authorized
  - Time-locked actions require cooldown period
- **ADMIN** can disconnect all curator access modules immediately upon trigger events
- **SAFE can pause/unpause** the AsyncVault, blocking deposits/withdrawals

### Programmability

**Spectra Core:**
- Fully programmatic — PT/YT minting, yield calculation, and rate computation are all on-chain
- Exchange rates (`ptRate`, `ibtRate`) computed algorithmically
- No keeper or relayer dependencies for core protocol

**MetaVault:**
- Hybrid — automated smart contract logic + manual curator intervention for strategy decisions
- Curator decisions (pool allocation, rollover timing, pool creation) are manual
- Settlement of deposit/redemption epochs requires active curator action
- Guardian role provides time-locked oversight for sensitive operations

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Curve Finance** | Critical | All PT/IBT trading via Curve AMM pools. Spectra uses `CurveOracleLib` for price data. Curve is battle-tested (since 2020) |
| **ERC-4626 IBT protocols** | Critical | Spectra markets depend on the security of the underlying vault protocol providing the IBT. If the IBT vault is exploited, PT holders face proportional losses (negative yield) |
| **Oracles** | Important | Spectra provides three oracle types (Deterministic, TWAP, Hybrid) following Chainlink AggregatorV3Interface. TWAP oracles derive from Curve's `price_oracle()` method |
| **Amphor** | Important | MetaVault AsyncVault infrastructure. Amphor provides the ERC-7540 implementation |

## PT Tokens as Morpho Collateral

**Context:** The team plans to use Spectra PT tokens as collateral on Morpho markets.

### PT Oracle Architecture for Lending Markets

Spectra provides three oracle types, all implementing Chainlink's `AggregatorV3Interface`:

1. **Deterministic Oracles:** Price PT against underlying using a model based on expected implied APY set at deployment. Price converges to par (1:1) at maturity. Deployed via `SpectraPriceOracleFactory`.

2. **TWAP Oracles:** Report exponential moving average of PT prices derived from Curve pool's `price_oracle()`. Native oracle manipulation protection from Curve. Two factory variants: `TwapOracleFactoryNG` (twocrypto-ng) and `TwapOracleFactorySNG` (stableswap-ng).

3. **Hybrid Oracles (Recommended for lending):** Combine TWAP accuracy with deterministic oracles as a lower bound. Provides enhanced robustness against price manipulation.

### Existing Morpho PT Market Precedent

- [PT-cUSD Morpho market](https://app.morpho.org/ethereum/market/0x802ec6e878dc9fe6905b8a0a18962dcca10440a87fa2242fbf4a0461c7b0c789/pt-cusd-29jan2026-usdc) — example of Spectra PT used as Morpho collateral

### PT Collateral Risks

- **Maturity mismatch:** PT value at discount before maturity — if used as collateral, liquidation before maturity realizes a loss
- **Negative yield risk:** If underlying IBT loses value, PT backing decreases, potentially triggering liquidation
- **Oracle manipulation:** While hybrid oracles mitigate this, TWAP-based prices can lag during rapid market moves
- **Liquidity risk for liquidators:** PT liquidity on Curve may be insufficient for large liquidations, especially in new markets
- **Post-expiry rate freezing:** First caller after expiry triggers `StoreRatesAtExpiry()` — if nobody calls this, rates aren't frozen, which could cause pricing issues

## Operational Risk

- **Founders:** Gaspard Peduzzi, Antoine Mouran, Jean Chambras — EPFL (Lausanne) graduates
- **Team size:** 4 co-founders + 5 full-time core contributors
- **Development entity:** Perspective SAS (French company)
- **Funding:** $1M seed (March 2021, led by Delphi Ventures with Spartan Group, DeFi Alliance, Rarestone Capital, angels including Julien Bouteloup and Marc Zeller) + $2.6M seed extension (November 2022, led by Greenfield Capital)
- **History:** Founded August 2020, originally as APWine Finance. Rebranded July 2023. ~5 years of continuous development
- **Documentation:** Comprehensive — separate docs for users, developers, and curators
- **Known entities** — doxxed team with public professional backgrounds
- **Incident response:** Published detailed post-mortem after the July 2024 router exploit within days. Paid $100K bounty for pre-rebrand critical bug

## Monitoring

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| SPECTRA Token | [`0x6a89228055c7c28430692e342f149f37462b478b`](https://etherscan.io/address/0x6a89228055c7c28430692e342f149f37462b478b) | Supply changes, transfers |
| DAO Treasury | [`0xe59d75C87ED608E4f5F22c9f9AFFb7b6fd02cc7C`](https://etherscan.io/address/0xe59d75C87ED608E4f5F22c9f9AFFb7b6fd02cc7C) | Balance changes |

**MetaVault (to be deployed):**

| Contract | Monitor |
|----------|---------|
| MetaVault SAFE | Signer changes, pauses, curator role changes |
| MetavaultWrapper | Epoch settlements, deposit/redemption queues |
| Curator Roles Module | Whitelisted actions, new market additions |
| Delay Module | Time-locked operations, guardian verifications |

**Critical Events to Monitor:**
- MetaVault SAFE signer/threshold changes
- Curator role grants/revocations
- PT rate changes (`ptRate` decreases indicating negative yield)
- Large withdrawal requests queued in MetaVault epochs
- Curve pool liquidity changes for PT/IBT pairs
- Underlying IBT protocol incidents
- Spectra core contract upgrades (AMProxyAdmin changes)

**Recommended Frequency:** Daily monitoring, hourly during market stress.

## Risk Summary

### Key Strengths

- **Zero high-severity audit findings** across three professional audits (Code4rena, Pashov, Sherlock)
- **~5 years of continuous development** (APWine 2020 → Spectra 2023 → MetaVaults 2025) with ~2 years Spectra V2 in production
- **Fully on-chain PT/YT mechanics** — rates computed algorithmically, no privileged role updates
- **Robust oracle architecture** — three oracle types (Deterministic, TWAP, Hybrid) following Chainlink standard, with manipulation resistance via Curve
- **Doxxed team** with established reputation, transparent incident response, and $3.6M in funding from reputable VCs
- **MetaVault curator constraints** — whitelisted actions, receiver restrictions, DelegateCall disabled, time-locked sensitive operations

### Key Risks

- **No active ongoing bug bounty** — only a completed time-limited $40K Immunefi competition
- **Negative yield risk** — if the underlying IBT vault is exploited, PT holders face proportional losses with no protocol-level backstop
- **MetaVault curator dependency** — settlement, rollover, and strategy decisions require active manual management. Curator failure can strand assets or delay withdrawals
- **MetaVault adds async withdrawal layer** — ERC-7540 epoch-based exits add delay on top of any underlying IBT withdrawal mechanism
- **Core governance details unverified** — ProxyAdmin owner, multisig threshold, and timelock details require on-chain verification (TODO)

### Critical Risks

- **IBT dependency risk:** Spectra's security model is only as strong as the underlying IBT. A vault exploit in the IBT protocol directly impairs PT backing. This is by design (permissionless pools), but means risk curation at the MetaVault level is critical
- **Pause authority:** MetaVault SAFE can pause/unpause the AsyncVault, locking all deposits and withdrawals. While this is a safety feature, it represents significant centralized control over user funds

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims
- This assessment covers Spectra Finance protocol only — underlying IBT risks should be assessed separately

### Critical Risk Gates

- [x] **No audit** — Spectra has been audited by 3 reputable firms (Code4rena, Pashov, Sherlock) ✅ PASS
- [x] **Unverifiable reserves** — PT reserves are fully on-chain and verifiable via PrincipalToken contract ✅ PASS
- [x] **Total centralization** — Uses multisig governance with Zodiac role constraints ✅ PASS

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | 3 audits by reputable firms (Code4rena w/ 42 wardens, Pashov, Sherlock), 0 high-severity findings |
| Production history | ~2 years Spectra V2, ~5 years total (APWine). ~$40M TVL |
| Security incidents | 1 router exploit ($73K, non-core), 1 critical bug caught pre-exploitation ($100K bounty paid) |
| Bug bounty | No active ongoing bounty — only completed $40K competition |
| MetaVaults | Sherlock audit for MetaVaults V1 with 0 highs, but MetaVaults are newer (~2025) with limited production history |

**Score: 2.5/5** — Strong audit coverage with zero high-severity findings across three reputable firms, and ~2 years production track record. The router exploit was contained to a peripheral contract. Penalized for no active bug bounty and MetaVaults being relatively new. TVL (~$40M) is moderate.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Core contracts | Upgradeable via AMProxyAdmin. TODO: verify owner, threshold, timelock |
| MetaVault | SAFE with Zodiac roles. Curator constrained by whitelisted actions. ADMIN can revoke. Time-locked sensitive ops |
| Pause capability | SAFE can pause/unpause AsyncVault — significant control over user funds |
| Pool creation | Permissionless — anyone can create Spectra markets |

**Subcategory A Score: 2.5/5** — Zodiac-based MetaVault governance is well-designed with strict curator constraints. However, pause capability is significant, and core protocol governance details need on-chain verification. Assuming reasonable multisig setup (pending TODO).

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Spectra PT/YT | Fully programmatic — rates computed on-chain algorithmically |
| MetaVault | Hybrid — automated contracts + manual curator decisions for allocation/rollover/settlement |
| PPS | On-chain, algorithmically computed via `ptRate` and `ibtRate` |

**Subcategory B Score: 2.0/5** — Core protocol is highly programmatic with on-chain rate computation. MetaVault curator introduces manual intervention for strategy, but share pricing remains algorithmic.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Curve Finance | Critical — trading + oracle pricing. Battle-tested (since 2020), blue-chip dependency |
| ERC-4626 IBTs | Critical — Spectra inherits all risk from underlying IBT protocol |
| Amphor | Important — MetaVault async infrastructure |

**Subcategory C Score: 2.5/5** — Primary dependency (Curve) is a blue-chip protocol. IBT dependency is by design and curated at the MetaVault level. Amphor adds one more dependency layer.

**Centralization Score = (2.5 + 2.0 + 2.5) / 3 = 2.33/5**

**Score: 2.5/5** — Well-structured governance with Zodiac constraints and fully programmatic core. Main concerns are pause authority and unverified core governance details.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| PT backing | Fully backed by deposited IBT, verifiable on-chain, 1:1 at maturity |
| Negative yield | PT backing decreases proportionally if IBT loses value — no protocol-level backstop |
| Collateral quality | Depends entirely on IBT selected — Spectra is agnostic |

**Subcategory A Score: 2.0/5** — Full on-chain collateralization with transparent backing. Negative yield mechanism is well-designed (fair loss distribution). Score assumes the IBT risk is assessed separately.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Fully on-chain — `ptRate`, `ibtRate` are contract state variables |
| Reporting mechanism | Programmatic, real-time, anyone can verify |
| Third-party verification | On-chain by design — no off-chain components in core protocol |

**Subcategory B Score: 1.5/5** — Excellent provability. All rates are computed algorithmically on-chain. Anyone can verify PT backing at any time by reading the PrincipalToken contract.

**Funds Management Score = (2.0 + 1.5) / 2 = 1.75/5**

**Score: 1.75/5** — Strong on-chain collateralization and provability. PT backing is transparent and programmatically verifiable.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| PT exit at maturity | Direct 1:1 redemption (subject to negative yield) — guaranteed time-based exit |
| PT exit before maturity | Market-based via Curve pools — depends on pool depth |
| MetaVault exit | Async ERC-7540: request → settle → claim — curator-dependent |
| New deployment | No liquidity track record for the specific MetaVault |
| Same-value asset | USDC-denominated — lower urgency for exit speed |

**Score: 2.5/5** — Maturity-based exit guarantee is a strong feature providing a floor. Pre-maturity exits are market-dependent. MetaVault async mechanism adds delay but is well-structured. Score reflects that the new MetaVault lacks liquidity history, partially offset by same-value asset nature and maturity guarantee.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Doxxed founders from EPFL, Perspective SAS (French company), 5+ years active |
| Documentation | Excellent — comprehensive user/developer/curator docs |
| Funding | $3.6M from reputable VCs (Delphi Ventures, Greenfield Capital) |
| Incident response | Published post-mortem, paid $100K bounty — proven track record |
| Legal | Perspective SAS — registered French entity |

**Score: 2.0/5** — Transparent, doxxed team with established reputation and proven incident response. Comprehensive documentation. Clear legal structure. Only gap is relatively modest funding ($3.6M) for a protocol handling $40M+ TVL.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical Track Record | 2.5 | 20% | 0.50 |
| Centralization & Control | 2.5 | 30% | 0.75 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.25/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.25/5.0) — Approved with standard monitoring**

**Important caveat:** This score assesses Spectra Finance protocol risk only. The total risk of any MetaVault position includes the underlying IBT risk (assessed separately) which propagates through PT tokens. The overall position risk will be the higher of Spectra's score and the underlying asset's score.

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (August 2026)
- **TVL-based:** Reassess if protocol TVL changes by more than ±50%
- **Incident-based:** Reassess after any exploit affecting Spectra core or MetaVault contracts
- **Governance-based:** Reassess if core ProxyAdmin ownership changes or MetaVault governance structure is modified
- **Bug bounty:** Reassess if an active ongoing bug bounty is established (would improve score)
- **Dependency-based:** Reassess if Curve Finance experiences a significant security event

---

## Appendix A: MetaVault Management Guide

This appendix covers how to manage a self-curated Spectra MetaVault, potential problems, and security risks.

### MetaVault Architecture

The MetaVault consists of two core contracts:

1. **MetavaultWrapper** — ERC-7540 compliant asynchronous vault, the user-facing interface
2. **AsyncVault (Amphor)** — Underlying yield aggregation infrastructure

Governance uses **Zodiac contracts** attached to a **Gnosis SAFE multisig** with three roles:

| Role | Key Actions | Risk Level |
|------|------------|------------|
| **Accountant** | Settlement execution, share price updates, conversion rate adjustments | High — incorrect rates directly impact all depositors |
| **Curator** | Pool allocation, rollover timing, yield compounding, market selection | High — poor decisions cause yield loss or asset stranding |
| **Guardian** | Transaction monitoring, time-lock verification, security oversight | Medium — delayed verification could allow harmful curator actions |

### Curator Whitelisted Operations

Curators execute via `execTransactionWithRole` through the Zodiac Roles module ([source](https://curator.docs.spectra.finance/technical/whitelisted-actions)):

**Immediate actions:**
- Token approvals (only to approved contracts)
- PT operations: `claimYield`, `redeem`, `deposit`, `withdraw` (restricted to enabled markets, receivers = SAFE only)
- Liquidity zaps: `addLiquidityWithWrap`, `removeLiquidity`, `redeemLiquidityUnderlying` (enabled markets only)
- IBT functions: `deposit`, `redeem` on IBTs of enabled markets
- ERC4626 wrapper: `wrap`, `unwrap` operations via [Spectra4626Wrapper](https://dev.spectra.finance/technical-reference/contract-functions/spectra4626wrapper) (for non-compliant IBTs)

**Time-locked actions (via Delay module):**
- Submitted via delay module, executed after cooldown via `executeNextTx`
- DelegateCall is NOT authorized (only regular Call)

**Critical constraint:** Most functions restrict token receivers to the MetaVault's SAFE address — preventing fund extraction.

### Key Management Risks

#### 1. Settlement Risk
**Problem:** Curator fails to prepare the SAFE with sufficient assets before epoch settlement.
**Impact:** Users unable to claim deposits or redemptions, creating trust issues and potential panic.
**Mitigation:** Establish automated monitoring of pending epochs and asset balances. Set calendar reminders for settlement windows.

#### 2. Rollover Risk
**Problem:** When a Spectra pool expires, the curator must move assets to a new maturity pool. Delays leave assets idle (no yield) or stranded.
**Impact:** Yield loss during transition periods. If no suitable new pool exists, assets may need to be returned to depositors.
**Mitigation:** Pre-deploy new pools before current ones expire. Maintain a rollover schedule with buffer time.

#### 3. Pool Selection Risk
**Problem:** Curator selects a pool with an underlying IBT that experiences negative yield (e.g., vault exploit).
**Impact:** PT backing decreases proportionally — MetaVault depositors suffer losses.
**Mitigation:** Only allocate to well-audited, established IBTs. Monitor underlying vault health continuously. Diversify across multiple IBTs/pools.

#### 4. Yield Compounding Complexity
**Problem:** The "YT → LP Token" reinjection loop involves multiple steps that must be executed correctly.
**Impact:** Failed compounding reduces effective yield. Incorrect execution could result in asset loss.
**Mitigation:** Test compounding steps on small amounts first. Establish clear operational procedures.

#### 5. Oracle/Pricing Risk (for Morpho collateral use)
**Problem:** PT oracle prices lag market reality during rapid moves, or deterministic oracle assumptions diverge from actual market pricing.
**Impact:** If using PT as Morpho collateral, oracle lag could delay liquidation triggers or cause premature liquidations.
**Mitigation:** Use hybrid oracles (TWAP + deterministic lower bound). Monitor oracle deviation from market prices. Set conservative LTV ratios on Morpho markets.

#### 6. Pause/Emergency Risk
**Problem:** SAFE has the ability to pause/unpause the AsyncVault.
**Impact:** Pausing blocks all deposits and withdrawals — users are locked in.
**Mitigation:** Establish clear pause criteria documented in advance. Require multi-party approval for pause actions. Communicate pause events immediately to depositors.

#### 7. Curator Key Compromise
**Problem:** If curator signing keys are compromised, an attacker can execute whitelisted actions within the constraint set.
**Impact:** While receiver restrictions limit extraction, an attacker could still cause economic harm through poor allocation decisions (e.g., depositing into a manipulated pool).
**Mitigation:** Use hardware wallets for all signers. Implement guardian time-locks for sensitive operations. ADMIN should monitor for anomalous curator activity and revoke access immediately if compromise is suspected.

### Operational Checklist

1. **Daily:** Check pending deposit/redemption requests, monitor underlying IBT rates, verify no negative yield events
2. **Per epoch:** Settle pending requests, ensure SAFE has sufficient assets
3. **Per pool expiry:** Execute rollover to new maturity pool, verify new pool liquidity
4. **Weekly:** Review yield performance, compound YT positions into LP tokens
5. **Monthly:** Review overall strategy allocation, assess underlying protocol health
6. **On alert:** Respond to negative yield events, pause if necessary, communicate to depositors

## Appendix B: PT Token Oracle Details for Morpho Integration

### Oracle Types Available

| Oracle Type | Mechanism | Best For | Manipulation Resistance |
|------------|-----------|----------|------------------------|
| **Deterministic** | Model-based pricing converging to par at maturity | Stable, predictable pricing | High — independent of market price |
| **TWAP** | Exponential moving average from Curve pool | Lending market reference | Medium — manipulation requires sustained pool impact |
| **Hybrid** | TWAP with deterministic lower bound | **Lending collateral (recommended)** | High — combines both protections |

### Technical Implementation

- All oracles implement Chainlink's `AggregatorV3Interface` (`latestRoundData()`, `getRoundData()`)
- 12 distinct feed contracts: 3 asset types (PT, YT, LP) × 2 quote assets (IBT, underlying) × 2 AMM variants
- `CurveOracleLib` invokes Curve pool's `price_oracle()` for TWAP data
- Deployed via factory contracts: `SpectraPriceOracleFactory`, `TwapOracleFactoryNG`, `TwapOracleFactorySNG`

### Key Considerations for Morpho Market Creation

1. **Oracle selection:** Use **Hybrid oracle** for maximum manipulation resistance
2. **LTV ratio:** Set conservatively given PT price volatility before maturity and negative yield risk
3. **Liquidation parameters:** Ensure sufficient Curve pool liquidity for liquidator exits
4. **Maturity alignment:** Match Morpho market duration with PT maturity to avoid forced pre-maturity liquidations
5. **Post-expiry handling:** Monitor for `StoreRatesAtExpiry()` call — rates must be frozen for accurate post-expiry pricing

## Appendix C: TODOs

Items requiring further on-chain verification or follow-up:

- [ ] Verify Spectra core ProxyAdmin owner (multisig threshold, timelock, signer identities)
- [ ] Identify specific MetaVault contract addresses once deployed
- [ ] Verify ERC-4626 compliance of chosen IBT for Spectra compatibility (or assess Spectra4626Wrapper necessity)
- [ ] Confirm Spectra4626Wrapper deployment address on target chain
