# Protocol Risk Assessment: Origin ARM

- **Assessment Date:** May 18, 2026 (Updated: October 19, 2026)
- **Onchain Snapshot:** Ethereum block [26229345](https://etherscan.io/block/26229345) (October 19, 2026)
- **Token:** ARM-WETH-stETH
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6`](https://etherscan.io/address/0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6)
- **Final Score: 1.49/5.0**

## Overview + Links

Origin's stETH ARM (Automated Redemption Manager) is a yield-generating ETH vault (ERC4626) that earns returns primarily through arbitraging stETH against its redemption value via Lido's withdrawal queue. Users deposit WETH, receive ARM-WETH-stETH LP tokens. The protocol buys discounted stETH, redeems it 1:1 through Lido, and captures the spread as yield. The contract also supports deploying idle capital to Morpho lending markets, currently using WETH ARM Morpho vault curated by Yearn.

- **Launch Date:** October 25, 2024
- **Performance Fee:** 20% (2,000 bps) - mutable by owner (Timelock)
- **Backing:** Lido Ecosystem Foundation provides liquidity support

**Links:**

- [Protocol Documentation](https://docs.originprotocol.com/automated-redemption-manager-arm/introduction-to-arm)
- [Protocol App](https://www.originprotocol.com/arm)
- [GitHub Repository](https://github.com/OriginProtocol/arm-oeth)
- [Security / Audits](https://github.com/OriginProtocol/security)
- [Bug Bounty](https://immunefi.com/bug-bounty/originprotocol/scope/#top)
- [DeFiLlama](https://defillama.com/protocol/origin-arm)

## Contract Addresses

| Contract | Address |
|----------|---------|
| ARM Proxy | [`0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6`](https://etherscan.io/address/0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6) |
| ARM Implementation | [`0x850da2e21f1f71479e2a307edab114777d9f6217`](https://etherscan.io/address/0x850da2e21f1f71479e2a307edab114777d9f6217) |
| Timelock Controller | [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F) |
| Origin DeFi Governance | [`0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC`](https://etherscan.io/address/0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC) |
| GOV Multisig (5/8, cancel-only) | [`0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899`](https://etherscan.io/address/0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899) |
| Operator (EOA) | [`0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b`](https://etherscan.io/address/0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b) |
| Fee Collector | [`0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c`](https://etherscan.io/address/0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c) |
| xOGN Governance Token | [`0x63898b3b6Ef3d39332082178656E9862bee45C57`](https://etherscan.io/address/0x63898b3b6Ef3d39332082178656E9862bee45C57) |
| Lido Withdrawal Queue | [`0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1`](https://etherscan.io/address/0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1) |
| MorphoMarket Wrapper (Proxy) | [`0xB7CeFE4CB483Be80C2963D3D9Edb991e69ff39cf`](https://etherscan.io/address/0xB7CeFE4CB483Be80C2963D3D9Edb991e69ff39cf) |
| Morpho Vault (WETH ARM, Yearn curated) | [`0x3Dfe70B05657949A5dB340754aD664810ac63b21`](https://etherscan.io/address/0x3Dfe70B05657949A5dB340754aD664810ac63b21) |
| Harvester (Morpho rewards) / Morpho Vault Guardian (Safe 2/8) | [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://etherscan.io/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) |

## Audits and Due Diligence Disclosures

ARM has been audited by OpenZeppelin (twice) and yAudit:

| # | Date | Firm | Scope | Report |
|---|------|------|-------|--------|
| 1 | Nov 2024 | OpenZeppelin | ARM contracts | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Arm%20Audit%20-%20November%202024.pdf) |
| 2 | Jun 2025 | OpenZeppelin | ARM contracts | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20ARM%20-%20June%202025.pdf) |
| 3 | Dec 2025 | yAudit | ARM contracts | [Report](https://github.com/OriginProtocol/security/blob/master/audits/yAudit%20-%20Origin%20ARM%20-%20December%202025.pdf) |

**Note:** The Certora [formal verification report](https://github.com/OriginProtocol/security/blob/master/audits/Certora%20-%20Formal%20verification%20-%20December%202024.pdf) (December 2024) covers OUSD only, not ARM.

Origin Protocol has 30+ audit reports across all products (OpenZeppelin, Trail of Bits, Solidified, Nethermind, Sigma Prime, Narya, Perimeter) in their [security repository](https://github.com/OriginProtocol/security).

**Smart Contract Complexity:** Moderate - Upgradeable proxy (EIP-1967), AbstractARM base contract, Lido withdrawal queue integration, operator-controlled pricing with cross-price timelock protection.

### Bug Bounty

- **Platform:** Immunefi
- **Maximum Payout:** $1,000,000
- **Scope:** ARM (stETH/WETH) contract explicitly in-scope
- **Link:** https://immunefi.com/bug-bounty/originprotocol/scope/

## Historical Track Record

- **Launched:** October 25, 2024 (~24 months in production)
- **ARM-specific incidents:** None ✓
- **Origin Protocol incident:** November 17, 2020 - OUSD Flash Loan Reentrancy Attack ($8M loss). Different product (OUSD) with different contracts. ARM codebase built later with lessons learned. Source: [DeFiLlama Hacks DB](https://defillama.com/hacks), [rekt.news](https://rekt.news/origin-rekt/)
- **TVL volatility:** DeFiLlama's [Origin ARM](https://defillama.com/protocol/origin-arm) series aggregates all Origin ARMs (Lido ARM, multi-asset WETH ARM, USDC ARM). It ranges from $782K (January 11, 2026) to a $28.0M peak (October 9, 2025) and was $12.7M on October 19, 2026, suggesting whale concentration risk. This Lido ARM held 1,879.99 ETH (~$4.5M at $2,401.73/ETH) per onchain `totalAssets()` at the snapshot block.
- **Team:** Origin Protocol since 2017. Founded by Josh Fraser & Matthew Liu. CEO: Rafael Ugolini. Backed by Pantera Capital, Founders Fund. Previously launched OETH and OUSD. Active development - expanding to EtherFi, Ethena ARM variants.

## Funds Management

**Strategy:** Buy discounted stETH → redeem 1:1 via Lido withdrawal queue → capture spread.

**Asset composition (block [26229345](https://etherscan.io/block/26229345)):** `totalAssets()` = 1,879.99 ETH; `totalSupply()` = 1,721.64 shares; `convertToAssets(1e18)` = 1.0920 ETH.

| Holding | Amount (ETH) | Share of gross |
|---------|-------------:|---------------:|
| Lido withdrawal queue (`lidoWithdrawalQueueAmount()`) | 1,031.49 | 52.9% |
| Morpho WETH ARM vault via wrapper (`maxWithdraw(ARM)`) | 756.00 | 38.8% |
| WETH balance | 134.39 | 6.9% |
| stETH balance | 26.50 | 1.4% |
| **Gross** | **1,948.38** | **100%** |

Gross holdings less 68.37 ETH of outstanding redemption requests (`withdrawsQueued()` − `withdrawsClaimed()`) and accrued fees reconcile to `totalAssets()`.

**Morpho Integration:** Idle WETH above the 0.1 ETH `armBuffer()` is deployed to the WETH ARM Morpho vault ([`0x3Dfe70B05657949A5dB340754aD664810ac63b21`](https://etherscan.io/address/0x3Dfe70B05657949A5dB340754aD664810ac63b21)) curated by Yearn. This is considered a safer option compared to the previous MEV Capital wETH vault, as Yearn's curation provides stronger risk management and oversight. The ARM supplies 32.7% of the vault's 2,312.26 WETH `totalAssets()`. Vault owner is Yearn Security ([`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0), 4/7), curator is [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3), guardian is Origin's 2/8 Safe [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://etherscan.io/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971), timelock is 3 days, and performance fee is 5%.

| Morpho market (collateral/loan · LLTV) | Vault supply (WETH) | Share | Market utilization | Supply cap (WETH) |
|------|------:|------:|------:|------:|
| [wstETH/WETH · 96.5%](https://app.morpho.org/ethereum/market/0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e/) | 2,069.43 | 89.5% | 87.7% | 15,000,000 |
| [weETH/WETH · 94.5%](https://app.morpho.org/ethereum/market/0x37e7484d642d90f14451f1910ba4b7b8e4c3ccdd0ec28f8b2bdb35479e472ba7/) | 174.50 | 7.5% | 85.4% | 10,000,000 |
| [wstETH/WETH · 94.5%](https://app.morpho.org/ethereum/market/0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d/) | 68.33 | 3.0% | 87.6% | 15,000,000 |
| [WBTC/WETH · 91.5%](https://app.morpho.org/ethereum/market/0x138eec0e4a1937eb92ebc70043ed539661dd7ed5a89fb92a720b341650288a40/) | 0 | 0% | 28.1% | 12,000,000 (withdraw queue only, not in supply queue) |

Supply caps were raised to effectively unlimited levels and the WBTC/WETH market was enabled on June 4, 2026 ([tx](https://etherscan.io/tx/0xd51e92ffcc1df442f86a905395f457db41f3b3684d5e22b3661330dd53b14b6c)), so the curator's 3-day vault timelock and market selection, not caps, bound allocation. Available liquidity in the funded markets (~6,376 WETH) exceeds the ARM's 756 ETH position.

### Accessibility

- **Deposits:** Permissionless, atomic. Deposit WETH, receive ARM-WETH-stETH LP tokens. Cap manager currently disabled (address(0)).
- **Withdrawals:** Two-step Request → Claim. PPS locked at request time, shares burned immediately. 10-minute minimum delay. Liquidity-dependent - exits exceeding WETH buffer require waiting for Lido withdrawal queue processing (1-3 days typical). No yield during queue.

### Collateralization

- 100% onchain collateral: WETH + stETH (same-value ETH-denominated assets)
- No debt, leverage, or liquidation mechanics
- Operator sets buy/sell prices manually, bounded by cross-price (which requires timelock to change)

### Provability

- All reserves verifiable onchain via view functions: `totalAssets()`, `totalSupply()`, `convertToAssets()`
- PPS calculated programmatically onchain: `totalAssets() / totalSupply()`
- Lido withdrawal queue state verifiable: `withdrawsQueued()`, `withdrawsClaimed()`, `claimable()`
- 100% onchain reserves, no offchain components

## Liquidity Risk

- **Exit Mechanism:** Direct vault redemption with 10-minute delay. PPS locked at request time (no slippage on redemption value). Limited secondary DEX liquidity via Curve pool ([OETH/ARM-WETH-stETH](https://curve.finance/dex/ethereum/pools/factory-stable-ng-641/deposit), [`0x95753095f15870acc0cb0ed224478ea61aeb0b8e`](https://etherscan.io/address/0x95753095f15870acc0cb0ed224478ea61aeb0b8e), ~14.6 ETH / ~$35K of balances). Its gauge ([`0xFcaDecfc207e3329a38821E5B04f88029cc4fa62`](https://etherscan.io/address/0xFcaDecfc207e3329a38821E5B04f88029cc4fa62)) is active but has zero CRV weight (`gauge_relative_weight()` = 0 on the GaugeController).
- **Immediate exits** limited to WETH balance plus withdrawable Morpho position: ~890 ETH (~47% of `totalAssets()`) at the snapshot block
- **Larger exits** require Lido withdrawal queue processing (1-3 days)
- No priority mechanism - first-come-first-served
- Same-value assets (ETH/stETH) mitigate price impact risk during wait

## Centralization & Control Risks

### Governance

**Governance Structure:** See [Appendix: Contract Architecture](#appendix-contract-architecture) for full diagram.

**Timelock Roles (verified via `hasRole()`):**

| Role | Origin DeFi Governance | GOV Multisig (5/8) | address(0) |
|------|:---:|:---:|:---:|
| PROPOSER | ✓ | ✗ | - |
| EXECUTOR | ✓ | ✗ | ✗ (not open) |
| CANCELLER | ✓ | ✓ | - |

- Timelock is self-administered (TIMELOCK_ADMIN_ROLE held by itself)
- Total time from proposal to execution: ~5 days minimum (24h voting delay + 48h voting + 48h timelock)
- No backdoor - only Origin DeFi Governance can propose/execute

**GOV Multisig (5-of-8)** — threshold and owner count verified onchain via `getThreshold()` / `getOwners()`. Five of eight signers were rotated (one on June 3, 2026 ([tx](https://etherscan.io/tx/0x95988dff1f6c11f39e2a0c1c5bb2bcb585c81822b90eed05821957b79890cb4a)), four on September 29, 2026 ([tx](https://etherscan.io/tx/0x355c5579c7c858cc0431f9553a22c115c1f3fafdeca098691f57afcbb74c2a81))); the threshold is unchanged. The Safe holds only CANCELLER on the Timelock, so signer composition cannot propose or execute changes.

**Privileged Roles:**

| Role | Who | Timelock? | Powers |
|------|-----|-----------|--------|
| Admin (owner) | Timelock → xOGN governance | ~5 days | Upgrade proxy, set cross price, change lending markets, grant/revoke operator, set fee |
| Operator | EOA [`0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b`](https://etherscan.io/address/0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b) (set by governance on June 16, 2026, [tx](https://etherscan.io/tx/0x0a66a564c9dd74c298ccc7ceedd5ac99892676ef3125f6d6c6092a511baa55a4)) | None | Set buy/sell prices (traderate0/1), trigger allocate/rebalance |
| Cap Manager | address(0) (disabled) | - | Could restrict deposits if enabled |

**Key Risk:** Operator is a single EOA (not a multisig). Can adjust buy/sell prices without timelock. Cross-price timelock limits exploitation.

### Programmability

- PPS calculated programmatically onchain (`totalAssets() / totalSupply()`)
- `allocate()` function is permissionless
- Operator sets buy/sell prices manually (no timelock), bounded by cross-price (admin-set, 48h timelock)
- If operator inactive, pricing could become stale (no automated price discovery)

### External Dependencies

1. **Lido (Critical)** - Core value proposition depends on Lido's stETH and withdrawal queue. Failure would halt all operations.
2. **Morpho (High)** - Idle capital (38.8% of gross holdings at the snapshot block) is deposited into WETH ARM Morpho vault curated by Yearn. The vault lends against wstETH (92.5%) and weETH (7.5%); a WBTC/WETH market is enabled with no allocation. Yearn curation reduces curator risk compared to previous MEV Capital setup.
3. **DEX Aggregators (Non-critical)** - 1inch, CoWSwap for stETH acquisition. Not required for core functionality.

No cross-chain dependencies.

## Operational Risk

- **Team:** Origin Protocol since 2017, public team, known leadership, VC-backed (Pantera, Founders Fund)
- **Documentation:** Good. Public GitHub actively maintained, comprehensive security repo
- **Legal:** Company structure (Origin Protocol), established entity
- **Incident Response:** $1M bug bounty on Immunefi, learned from 2020 OUSD incident

## Monitoring

- **Governance:** Monitor Timelock events (`CallScheduled`, `CallExecuted`, `Cancelled`) and Origin DeFi Governance proposals. Monitor EIP-1967 implementation slot for proxy upgrades.
- **Operator:** Monitor `traderate0()`, `traderate1()`, `crossPrice()` for changes. Alert on >5% market deviation or operator role changes.
- **PPS & Liquidity:** Track `totalAssets() / totalSupply()`, alert on >1% sudden PPS drops. Monitor WETH buffer and Lido withdrawal queue state. Track large movements (>20% TVL change in 24h).
- **Lending:** Monitor Morpho WETH ARM vault allocation (`withdrawQueue`, Morpho `position()`), market utilization, `SubmitCap`/`SetCap` events, and Yearn curator changes. Alert on any allocation to the WBTC/WETH market or new collateral types.

## Risk Summary

### Key Strengths

1. Onchain xOGN governance with ~5-day total cycle, self-administered Timelock, no admin backdoor
2. Cross-price protected by 48h timelock — limits operator manipulation
3. 3 independent audits (2x OpenZeppelin + yAudit) + $1M Immunefi bounty
4. Simple strategy (stETH arbitrage), with lending to low risk ARM Morpho Vault curated by Yearn
5. ~24 months clean ARM track record, same-value assets (ETH/stETH)

### Key Risks

1. Operator is single EOA (not multisig) — can set prices without timelock
2. Extreme TVL volatility ($782K–$28M across Origin ARMs) — whale concentration
3. Upgradeable proxy (protected by ~5-day governance cycle)
4. Critical Lido dependency

### Critical Risks

- None identified. All critical gates pass.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** → **PASS** (2x OpenZeppelin + yAudit)
- [ ] **Unverifiable reserves** → **PASS** (100% onchain, verifiable)
- [ ] **Total centralization** → **PASS** (xOGN governance + Timelock; operator is EOA but admin is not)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.5**

| Aspect | Assessment |
|--------|-----------|
| Audits | 2x OpenZeppelin + yAudit |
| Bug Bounty | $1M on Immunefi, ARM in scope |
| Time in Production | ~24 months, no ARM incidents |
| TVL | 1,879.99 ETH (~$4.5M) onchain; $12.7M across all Origin ARMs ([DeFiLlama](https://defillama.com/protocol/origin-arm)) |

#### Category 2: Centralization & Control Risks (Weight: 30%) — **1.33**

**Subcategory A: Governance — 1.0**
- Onchain xOGN token governance with ~5-day cycle
- 48h timelock, self-administered, GOV Multisig (5/8) cancel-only
- No admin backdoor. Shorter than ideal 72h+ timelock.

**Subcategory B: Programmability — 1.5**
- PPS onchain, cross-price timelocked, `allocate()` permissionless
- Operator is single EOA with no-timelock price setting

**Subcategory C: External Dependencies — 1.5**
- Critical dependency on Lido (blue-chip)
- Dependency on Morpho code
- Morpho vault curated by Yearn (safer than previous MEV Capital curator); wstETH- and weETH-collateralized markets

**Score: (1.0 + 1.5 + 1.5) / 3 = 1.33**

#### Category 3: Funds Management (Weight: 30%) — **1.25**

**Subcategory A: Collateralization — 1.5**
- 100% onchain, same-value assets (ETH/stETH), no leverage
- Idle capital deposited into Yearn-curated WETH ARM Morpho vault, a safer option with stronger risk oversight than the previous MEV Capital vault

**Subcategory B: Provability — 1.0**
- Fully transparent onchain. Minor dependency on operator pricing (bounded by cross-price)

**Score: (1.5 + 1.0) / 2 = 1.25**

#### Category 4: Liquidity Risk (Weight: 15%) — **2.5**

- Direct redemption with PPS lock (no slippage) ✓
- ~47% of assets immediately available (WETH + Morpho); larger exits require multiple days Lido processing
- Same-value assets mitigate waiting risk

#### Category 5: Operational Risk (Weight: 5%) — **1.0**

- Established team (2017), public, VC-backed, comprehensive security repo

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.5 × 0.20) + (1.33 × 0.30) + (1.25 × 0.30) + (2.5 × 0.15) + (1.0 × 0.05)
            = 0.30 + 0.399 + 0.375 + 0.375 + 0.05
            = 1.499
            → 1.49 (two decimals, rounded down)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.30 |
| Centralization & Control | 1.33 | 30% | 0.399 |
| Funds Management | 1.25 | 30% | 0.375 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.0 | 5% | 0.05 |
| **Final Score** | | | **1.49 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | **Approved, high confidence** |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: MINIMAL RISK**

---

## Reassessment Triggers

- **Time-based:** Quarterly (next: January 2027)
- **Incident-based:** Any security incident, pricing anomaly, or withdrawal issues
- **Change-based:** Morpho vault curator Yearn changes, especially adding new markets or allocating to the WBTC/WETH market. Contract upgrade, Lido WQ issues or stETH depeg

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| May 18, 2026 | 1.50 | Initial assessment |
| Aug 6, 2026 | 1.49 | Implementation upgraded to [`0x850d…6217`](https://etherscan.io/address/0x850da2e21f1f71479e2a307edab114777d9f6217) — [changes](https://gist.github.com/spalen0/54b015bb1c98089f0abb963459a57219); TVL ~$8.8M. New pause mechanism is in line with existing operator controls and bounded by governance-only unpause; protocol cannot block users indefinitely. Score unchanged. |
| [Oct 19, 2026](https://github.com/yearn/risk-score/pull/540) | 1.49 | Operator EOA rotated via governance; allocation now 52.9% Lido WQ / 38.8% Morpho; Morpho vault adds weETH/WETH exposure (7.5%) and an unfunded WBTC/WETH market; GOV multisig signers rotated (5/8 unchanged). Score unchanged. |

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GOVERNANCE                                   │
│                                                                     │
│  xOGN Token Holders (Staked OGN)                                   │
│  (250K xOGN to propose, ~291.0M xOGN quorum = 20% of supply)      │
│         │                                                           │
│         ▼                                                           │
│  Origin DeFi Governance (0x1D3f...)                                │
│  [PROPOSER + EXECUTOR + CANCELLER]                                 │
│  (7,200 blocks voting delay + 14,416 blocks voting period)         │
│         │                                                           │
│         ▼                                                           │
│  Timelock Controller (0x3591...)          GOV Multisig 5/8         │
│  [48h delay, self-administered]  ◄────── (0xbe2A...)               │
│         │                                [CANCELLER only]           │
│         │ owner                                                     │
│         ├──────────────────────────────────────┐                    │
│         ▼                                      ▼                    │
│  ARM Proxy (0x85B7...)              MorphoMarket Wrapper (0xB7Ce..)│
│  [EIP-1967, impl: 0x850d...]       [EIP-1967, also owned by TL]   │
│                                                                     │
│  ⚠ Proxy upgrade = single-step setOwner (no 2-step transfer)      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     ARM VAULT (LidoARM)                             │
│                     0x85B7...cc6                                    │
│                                                                     │
│  Immutables:         Storage:                                      │
│  ├── stETH (0xae7a)  ├── traderate0/1 (36-dec pricing)            │
│  ├── WETH  (0xC02a)  ├── crossPrice (operator bound, timelocked)  │
│  └── lidoWQ(0x889e)  ├── fee: 2000 (20%)                          │
│                       ├── armBuffer: 0.1 ETH                       │
│                       ├── claimDelay: 600s (10 min)                │
│                       └── activeMarket: 0xB7Ce... (MorphoMarket)  │
│                                                                     │
│  Roles:                                                             │
│  ├── owner:        Timelock (0x3591...)                             │
│  │   setCrossPrice, setFee, setOperator, addMarkets, upgradeTo    │
│  ├── operator:     EOA (0x7392...)                                 │
│  │   setPrices, requestLidoWithdrawals, setActiveMarket            │
│  ├── feeCollector: Safe 1/3 (0xBB07...)                            │
│  └── capManager:   address(0) [disabled]                           │
│                                                                     │
│  Permissionless: deposit, requestRedeem, claimRedeem, allocate,    │
│  claimLidoWithdrawals, collectFees, swap stETH↔WETH               │
│                                                                     │
└──────────┬──────────────┬──────────────┬────────────────────────────┘
           │              │              │
           ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────────────────┐
│  stETH       │ │  Lido WQ     │ │  MorphoMarket Wrapper            │
│  (0xae7a...) │ │  (0x889e...) │ │  (0xB7Ce...)                     │
│              │ │              │ │  [Abstract4626MarketWrapper]      │
│  transfer,   │ │  request,    │ │  owner: Timelock                 │
│  approve     │ │  claim       │ │         │                        │
│              │ │              │ │         ▼                        │
└──────────────┘ └──────────────┘ │  Morpho Vault (0x3Dfe...)       │
                                  │  [MetaMorpho v1.1, Yearn curated]│
                                  │         │                        │
                                  │         ▼                        │
                                  │  Harvester Safe 2/8 (0x4FF1...)  │
                                  │  [MORPHO rewards; vault guardian]│
                                  └──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                   SECONDARY LIQUIDITY                               │
│                                                                     │
│  Curve Pool: OETH / ARM-WETH-stETH (factory-stable-ng-641)        │
│  (0x9575...)  ~14.6 ETH (~$35K)                                    │
│  Gauge: 0xfcad... (active, no CRV weight)                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Data flows:
  Deposit:  User WETH → ARM → mint LP shares
  Redeem:   requestRedeem (burns shares, locks PPS) → claimRedeem (after 10m + liquidity)
  Yield:    ARM buys discounted stETH → requestLidoWithdrawals → claimLidoWithdrawals → WETH
  Lending:  allocate() → excess WETH → MorphoMarket wrapper → Morpho Vault (Yearn curated)
  Swap:     User stETH↔WETH at operator-set traderates (bounded by crossPrice)
```
