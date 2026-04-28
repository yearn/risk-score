# Protocol Risk Assessment: Reserve Protocol

- **Assessment Date:** April 27, 2026
- **Token:** ETH+
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8)
- **Final Score: 2.0/5.0**

## Overview + Links

ETH+ is a yield-bearing diversified Ethereum LST basket built on Reserve Protocol. It is an over-collateralized RToken backed by a basket of liquid staking tokens. Staking rewards from underlying LSTs accrue to ETH+ holders through an appreciating basket-to-token ratio (`basketsNeeded / totalSupply`). RSR stakers provide a first-loss overcollateralization buffer in exchange for a share of revenue.

**Yield Source:** Ethereum staking rewards from the underlying LSTs (currently 3.41% APY per DefiLlama).

**Current Basket (basket nonce 9, set 2026-04-23):**
| Asset | Issuer | Quantity per BU | ETH per BU | Share of basket |
|-------|--------|-----------------|------------|-----------------|
| wstETH | Lido | 0.40556 | 0.5001 | 50.0% |
| weETH | Ether.fi | 0.20120 | 0.2200 | 22.0% |
| sfrxETH | Frax | 0.08645 | 0.1000 | 10.0% |
| rETH | Rocket Pool | 0.08605 | 0.1000 | 10.0% |
| ETHx | Stader | 0.07355 | 0.0800 | 8.0% |

Onchain values fetched from `BasketHandler.quote(1e18, ROUND)` and each LST's exchange-rate function. Total ETH per BU ≈ 1.00.

**Supply / Backing (as of 2026-04-27, block ~24,974,544):**

| Metric | Value | Source |
|--------|-------|--------|
| ETH+ totalSupply | 27,247.85 ETH+ | `totalSupply()` |
| basketsNeeded | 29,318.59 BU | `RToken.basketsNeeded()` |
| ETH+ → BU ratio | 1.0760 BU per ETH+ | computed |
| Backing held by BackingManager | ~29,406 ETH-equivalent | LST balances × exchange rates |
| `fullyCollateralized()` | true | `BasketHandler.fullyCollateralized()` |
| `status()` | 0 (SOUND) | `BasketHandler.status()` |
| Trading paused / Issuance paused / Frozen | false / false / false | `Main` |

**TVL:**
- ETH+ alone: **~$66.98M** (DefiLlama yield pool, ETH price $2,293)
- Reserve Protocol total: $100M (DefiLlama, peak $530M on 2025-09-13)
- Net change since prior assessment (2025-12-22): **−38%** in USD ($108M → $67M), **−25%** in ETH terms (36,246 → 27,248 ETH+)

**Links:**
- [Reserve Protocol Documentation](https://reserve.org/)
- [ETH+ Dashboard](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/overview)
- [Reserve GitHub](https://github.com/reserve-protocol/protocol)
- [Audit Reports Folder](https://github.com/reserve-protocol/protocol/tree/master/audits)
- [LlamaRisk ETH+ Analysis (July 2024)](https://www.llamarisk.com/research/rtoken-risk-ethplus)

## Audits and Due Diligence Disclosures

**Audit Status:** Comprehensive, with audits covering each major version including the recently-deployed v4.2.0.

Audit reports are published in [`reserve-protocol/protocol/audits`](https://github.com/reserve-protocol/protocol/tree/master/audits):

| Firm | Scope | Date |
|------|-------|------|
| Trail of Bits | Reserve Protocol (security review + fix review) | 2022-08 |
| Solidified | Reserve Protocol core | 2024-04 |
| Solidified | Reserve Protocol 3.4.0 | 2024 |
| Halborn | Reserve Protocol smart contracts | — |
| Ackee Blockchain | Reserve Protocol | — |
| Code4rena | Releases 2.1.0, 3.0.0 (core + collaterals), **4.0.0** | 2023–2025 |
| Trust Security | Releases 3.1.0, 3.2.0, 3.4.0 Spell, **4.2.0** | 2024–2026 |
| Oak Security | Reserve Updates (4.x) | 2026-03-12 |
| Certora | Formal verification of `FixLib` | 2026-04 |

The current onchain `Main` implementation (`version() = "4.2.0"`) was deployed and granted ownership at block 24,944,370 (2026-04-23) via the `Upgrade4_2_0` spell ([`0xbff761d367291281f3c4db4bda2c591d6dde3601`](https://etherscan.io/address/0xbff761d367291281f3c4db4bda2c591d6dde3601)).

**Findings:** No critical unresolved issues disclosed. v4.2.0 audits (Trust Security, Oak Security, Certora) were completed before mainnet activation.

**Smart Contract Complexity:** Moderate–High. Multi-contract architecture (`Main`, `RToken`, `StRSR`, `BackingManager`, `BasketHandler`, `AssetRegistry`, `Distributor`, `Furnace`, `Broker`, `RSRTrader`, `RTokenTrader`) plus per-collateral plugins. All contracts are upgradeable ERC-1967 proxies behind the `Main` access controller.

### Bug Bounty

**Platform:** Cantina
**Maximum Payout:** $10,000,000 (Critical tier)
**Severity tiers:** Critical $10M / High $100k / Medium $5k / Low $1k
**Status:** Live (launched 2026-03-26; 106 findings submitted as of this assessment)
**Link:** https://cantina.xyz/bounties/3709ca85-4050-407e-9b36-51f5d5ea9b00

Reserve Protocol is **not** enrolled in the SEAL Safe Harbor agreement (verified via [safeharbor.securityalliance.org](https://safeharbor.securityalliance.org/)).

## Historical Track Record

**Time in Production:**
- Reserve Protocol RTokens: live since 2023-04 (~3 years)
- ETH+ specifically: deployed in basket nonce 1 at block 17,086,178 (2023-04-26), ~3 years
- Current architecture upgraded to v4.2.0 on 2026-04-23 (4 days before this assessment) — material change worth flagging

**Past Security Incidents:**
- No exploits or hacks on Reserve Protocol or ETH+
- No collateral default events triggered for ETH+
- StRSR exchange rate is monotonically increasing (1.162 RSR/stRSR currently) — no RSR has been seized to cover losses

**Peg / Basket Stability:**
- ETH+ has no fixed peg to ETH; it tracks the appreciating basket value (currently 1.076 ETH per ETH+)
- No significant deviations from basket value have been observed
- Direct redemption provides a hard floor

**TVL History:**
- Peak: ~36,246 ETH (~$108M) at 2025-12-22
- Today: 27,248 ETH+ (~$67M) — supply contracted ~25% in ~4 months
- Reserve total TVL peaked at $530M on 2025-09-13, now $100M
- The supply contraction is large enough to warrant monitoring, but the protocol remains fully collateralized and `status()` is SOUND

**Team Track Record:**
- Reserve has been building since 2018; previously launched RSV (USD-pegged stablecoin)
- Active development continues: most recent commits add RToken Deprecation tooling, Certora verification, weETH whale tests
- Operator entity is **ABC Labs, LLC** (per reserve.org legal notice) — not "Reserve Labs" as commonly written. The Reserve trademark is held by Confusion Capital

## Funds Management

**Fund Delegation:** Yes. ETH+ holds five LSTs as collateral, each wrapping its own underlying staking protocol:
- wstETH → Lido (50.0%)
- weETH → Ether.fi (22.0%) **— added since prior assessment**
- sfrxETH → Frax (10.0%)
- rETH → Rocket Pool (10.0%)
- ETHx → Stader (8.0%)

**Due Diligence on Underlying Protocols:**
- wstETH (Lido) and rETH (Rocket Pool) are blue-chip LSTs with the longest track records
- weETH (Ether.fi) is the largest restaking-LST and has Chainlink price feeds
- sfrxETH (Frax) has historically lacked a Chainlink ETH-denominated PoR; LlamaRisk flagged it as more centralized — Reserve uses an alternative oracle plugin
- ETHx (Stader) is the smallest, both in basket weight (8%) and standalone TVL — highest single-name idiosyncratic risk in the basket

**Monitoring Fund Delegation:**
- Basket is fully onchain and queryable via `BasketHandler.quote()` and `nonce()`
- Basket changes emit `BasketSet(uint256 nonce, address[] erc20s, uint192[] refAmts, bool disabled)`
- Governance proposals to change the basket pass through Governor Anastasius (2-day voting delay, 10% StRSR quorum, 3-day vote) plus a 3-day timelock — total floor ~8 days from proposal to execution

### Accessibility

**Minting:**
- Permissionless. Anyone can call `RToken.issue()` / `issueTo()`
- Atomic in a single transaction; users deposit the proportional basket of LSTs (or a single asset using the Reserve "zap" router)
- Subject to issuance throttle: `amtRate = 1,700 ETH+/hr`, `pctRate = 10%/hr`. Effective hourly cap is the larger of the two; `issuanceAvailable() = 2,724.78 ETH+` at the time of writing
- Backing is **required** to mint. There is no admin-controlled mint function; `MAIN` cannot mint ETH+ directly, and there is no role labeled "minter"

**Redemption:**
- Permissionless. `RToken.redeem(amount)` returns the prorata basket (or a custom basket if redeeming during a basket switch via `redeemCustom`)
- Throttle: `amtRate = 2,000 ETH+/hr`, `pctRate = 12.5%/hr`. `redemptionAvailable() = 3,405.98 ETH+` currently
- A full redemption of the entire supply would take ~8 hours under the current pctRate cap
- No fees, no cooldown. Redemption is paused only if `tradingPaused` or system frozen

**Slippage:**
- Mint/redeem is a basket operation — no slippage from the protocol itself
- Slippage applies only when a user converts the redeemed LSTs back to ETH on a DEX

### Collateralization

**On-Chain Collateralization:** Yes — 100%, fully onchain.
- All collateral is held in the `BackingManager` ([`0x608e1e01EF072c15E5Da7235ce793f4d24eCa67B`](https://etherscan.io/address/0x608e1e01EF072c15E5Da7235ce793f4d24eCa67B))
- Verified directly: backing manager holds ~11,925 wstETH, ~5,915 weETH, ~2,543 sfrxETH, ~2,530 rETH, ~2,163 ETHx → ~29,406 ETH-equivalent vs. 27,248 ETH+ supply
- `BasketHandler.fullyCollateralized()` returns `true`

**Collateral Quality:** High. All five collateral assets are established Ethereum LSTs, each with independent audits, Chainlink-style price feeds (or vetted alternates), and active markets.

**Over-Collateralization (RSR buffer):**
- StRSR contract holds **~898M RSR** as a first-loss buffer
- At the current RSR price (~$0.00180), this is **~$1.61M of buffer for $66.98M of ETH+ TVL → ~2.4% OC**
- This is in line with LlamaRisk's 2024 finding (2%) and remains the protocol's main material weakness. The buffer scales with RSR price, not ETH+ TVL

**Default Handling:**
- `BasketHandler.refresh()` checks each collateral's price/peg every interaction
- A collateral that depegs persistently transitions through `IFFY → DISABLED` and is removed from the basket
- The protocol then triggers automatic auctions to swap the disabled collateral, using the backup basket and, if needed, seizing RSR from StRSR
- Emergency collateral: WETH ([`0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)) is in the asset registry as a fallback

**Risk Curation:**
- Basket composition, collateral plugins, and throttle parameters are all governance-managed
- Changes require Governor Anastasius proposal + 3-day timelock execution

**Off-Chain Components:** None. Fully onchain — no custodians, no off-chain reserve management, no T-bills, no real-world assets.

### Provability

**Reserve Verification:** Easy.
- `BasketHandler.basketsHeld()` and `RToken.basketsNeeded()` are public view functions
- Backing computation is deterministic from onchain state plus oracle prices
- Anyone can call `BasketHandler.refresh()` and the protocol's status updates atomically

**Yield Calculation:** Transparent. Yield is the appreciation of `basketsNeeded / totalSupply`, driven entirely by the appreciation of the underlying LSTs.

**On-Chain Reporting:** Programmatic. There is no admin-controlled exchange rate.

**Off-Chain Reserves:** None.

**Third-Party Verification:** Chainlink price feeds are used for collateral plugins (with curated alternates where Chainlink is not available, e.g., sfrxETH).

**Minting Without Backing:** Not possible. There is no minter role and no admin function to mint ETH+ outside of `RToken.issue()`, which requires the user to deposit the basket.

## Liquidity Risk

**Direct Redemption:** Always available (subject to throttle). 1:1 with the basket.

**On-Chain DEX Liquidity (per DefiLlama, 2026-04-27):**

| Pool | TVL |
|------|-----|
| Curve ETH+/WETH | $12.5M |
| Convex ETH+/WETH (boosted Curve) | $7.3M |
| Beefy ETH+/WETH | $5.6M |
| StakeDAO ETH+/WETH | $5.4M |
| Curve ETH+/EUSD-RSR | $2.6M |
| Curve ETH+/ETH | $0.5M |
| Uniswap v3 WETH/ETH+ | $1.0M |
| Morpho Blue ETH+ | $3.9M |

The primary spot pool (Curve ETH+/WETH) has ~$12.5M TVL. With Convex/Beefy/StakeDAO wrappers around the same Curve pool, the underlying Curve LP TVL is the binding liquidity for direct DEX exits.

**Slippage Analysis (rule-of-thumb):**
- <$100k: Minimal (<0.5%) via direct redemption
- $100k–$1M: 0.5–2% via redemption or DEX
- >$1M: Direct redemption preferred; selling components on their own deep markets is the cleanest exit

**Withdrawal Restrictions:**
- Throttle limits redemption to ~12.5% of supply per hour (~3,406 ETH+ now)
- A full exit of the entire ETH+ supply would take ~8 hours

**Historical Liquidity:**
- No liquidity-stress incidents recorded
- DEX liquidity has tracked the supply contraction since Q1 2026

## Centralization & Control Risks

### Governance

**Contract Upgradeability:** Yes. All core contracts are ERC-1967 proxies. Implementations can be swapped by the OWNER role on `Main`.

**Governance Path (post-2026-04-23 upgrade):**

| Component | Address | Notes |
|-----------|---------|-------|
| Main (proxy) | [`0xb6A7d481719E97e142114e905E86a39a2Fa0dfD2`](https://etherscan.io/address/0xb6A7d481719E97e142114e905E86a39a2Fa0dfD2) | `version() = 4.2.0` |
| Main implementation | [`0xc5bf686cfb85786fcfff557297d4aff8f4e15e44`](https://etherscan.io/address/0xc5bf686cfb85786fcfff557297d4aff8f4e15e44) | |
| Governor (Governor Anastasius v1) | [`0xa8a608b9b558235e7f87d7024cc05e6f47d62022`](https://etherscan.io/address/0xa8a608b9b558235e7f87d7024cc05e6f47d62022) | OZ Governor, voting token = StRSR |
| Timelock | [`0xd7985a7c617febc4a833b5f70cfa79b40c313ad2`](https://etherscan.io/address/0xd7985a7c617febc4a833b5f70cfa79b40c313ad2) | OZ TimelockController, `getMinDelay() = 259,200s` (3 days) |
| Guardian Safe (canceller + pauser + freezers) | [`0xd5fe2780eb882d1da78f2136b81c2a4395488c98`](https://etherscan.io/address/0xd5fe2780eb882d1da78f2136b81c2a4395488c98) | 3-of-6 Gnosis Safe |

**Governor Anastasius parameters (verified onchain):**
- Voting delay: 172,800s (2 days)
- Voting period: 259,200s (3 days)
- Quorum: 10% of staked RSR (`quorumNumerator/quorumDenominator = 10/100`)
- Proposal threshold: 76,720.92 stRSR

**End-to-end change cadence:** ~2 days (voting delay) + 3 days (vote) + 3 days (timelock) = **~8 days** from proposal to execution, assuming quorum.

**Privileged Roles on `Main` (verified via `hasRole`):**

| Role | Holder(s) | Power |
|------|-----------|-------|
| OWNER (`bytes32("OWNER")`) | Timelock `0xd7985a7c…` | Upgrade implementations, change basket, modify parameters, manage all other roles |
| PAUSER | Guardian Safe `0xd5fe2780…` **and an EOA `0xe3e34fa9…`** | Pause issuance & trading (cannot freeze redemption) |
| SHORT_FREEZER | Guardian Safe `0xd5fe2780…` | Freeze the system for 6 hours |
| LONG_FREEZER | Guardian Safe `0xd5fe2780…` | Freeze for an extended period (governance-set) |
| Timelock CANCELLER | Guardian Safe `0xd5fe2780…` | Cancel queued timelock proposals |

**⚠️ Finding:** The deployer EOA [`0xe3e34fa93575af41bef3476236e1a3cdb3f60b85`](https://etherscan.io/address/0xe3e34fa93575af41bef3476236e1a3cdb3f60b85) **still holds the PAUSER role** on `Main`. It was granted at deployment (block 17,086,220) and was not revoked in the 4.2.0 upgrade transaction. PAUSER cannot freeze the system or seize funds, but a single private-key compromise here would let an attacker pause issuance and trading, disrupting the protocol. The Reserve team should be asked to revoke this role; until then, treat the protocol as having an active EOA pauser.

**Old governance (pre-upgrade, no longer authoritative):** the previous timelock [`0x5f4A10aE2fF68bE3cdA7d7FB432b10C6BFA6457B`](https://etherscan.io/address/0x5f4A10aE2fF68bE3cdA7d7FB432b10C6BFA6457B) was revoked from OWNER, PAUSER, SHORT_FREEZER, and LONG_FREEZER at block 24,944,370.

**Powers Analysis:**
- Governance **cannot** seize user funds directly
- Governance **can** swap collateral, change implementations, modify throttles, and change oracles — all subject to the 3-day timelock, giving holders a window to redeem
- The Guardian Safe **can** pause and freeze, and **can** cancel governance proposals — concentrating real-time emergency power in a 3-of-6 multisig
- The deployer EOA **can** pause issuance/trading

**Risk Assessment:** Medium. The 3-day timelock and 8-day proposal cycle are at the lower end of acceptable; the guardian Safe and active EOA pauser are the main centralization vectors.

### Programmability

**System Programmability:** Highly programmatic.
- Basket valuation, default detection, redemption, and reward distribution are all onchain
- `Furnace.melt()` and `Distributor.distribute()` can be called by anyone (no privileged keeper)
- PPS is `basketsNeeded / totalSupply` — no oracle, no admin update, no offchain accounting

**Non-Programmatic Elements:**
- Basket composition and weights are set by governance
- Oracle plugin addresses are governance-controlled (some collateral plugins use non-Chainlink oracles where Chainlink lacks coverage)

### External Dependencies

**Critical dependencies:**
1. **Chainlink** — used for the bulk of collateral price feeds. Failure of a single feed only impacts the corresponding collateral
2. **Five LST issuers** — Lido, Ether.fi, Frax, Rocket Pool, Stader. A solvency event at any single issuer would trigger that collateral's default path; ETH+ would revert to the backup basket and slash RSR to recapitalize
3. **Ethereum L1** — fully onchain, no cross-chain bridges

**Concentration:**
- Lido (wstETH) is 50% of basket value — the largest single-name dependency
- The remaining 50% is split across four LSTs, which materially diversifies idiosyncratic risk

## Operational Risk

**Operating Entity:** ABC Labs, LLC (per reserve.org legal notice). The "Reserve" trademark is held by Confusion Capital, a separate entity.

**Team Transparency:** Public, doxxed core team with established reputation; long history of public communication.

**Documentation:** Comprehensive technical and developer documentation; per-version audit reports published in-repo.

**Communication Channels:**
- Discord (active, multiple thousand members)
- Twitter: @reserveprotocol
- Forum: discourse.reserve.org
- GitHub: reserve-protocol/protocol (active)

**Development Activity:** Active. Recent commits (last 90 days) include weETH integration tests, Certora formal verification, RToken deprecation tooling, and the v4.2.0 audit cycle.

**Incident Response:**
- Active Immunefi bug bounty
- Pause/freeze mechanisms at multiple severity levels
- Guardian multisig with timelock-cancellation power for live-incident response
- No prior incidents to assess response from

## Monitoring

### 1. Governance Monitoring (MANDATORY)

| Component | Address | Events / Functions to monitor |
|-----------|---------|-------------------------------|
| Governor Anastasius v1 | `0xa8a608b9b558235e7f87d7024cc05e6f47d62022` | `ProposalCreated`, `ProposalExecuted`, `ProposalCanceled`, `VoteCast` |
| Timelock | `0xd7985a7c617febc4a833b5f70cfa79b40c313ad2` | `CallScheduled`, `CallExecuted`, `Cancelled` |
| Guardian Safe | `0xd5fe2780eb882d1da78f2136b81c2a4395488c98` | Owner changes, threshold changes, all executions (yearn safe-monitoring) |
| Main (`hasRole`) | `0xb6A7d481719E97e142114e905E86a39a2Fa0dfD2` | `RoleGranted`, `RoleRevoked` for OWNER / PAUSER / SHORT_FREEZER / LONG_FREEZER |

**Action:** add to [yearn/monitoring-scripts-py](https://github.com/yearn/monitoring-scripts-py). Recommended cadence: hourly poll for queued timelock calls; immediate alert on any RoleGranted/Revoked or Guardian Safe execution.

**Important:** the deployer EOA `0xe3e34fa93575af41bef3476236e1a3cdb3f60b85` still has PAUSER. Add to the role-watch list and alert on any transaction from it.

### 2. Backing / Collateralization Monitoring (MANDATORY)

| Check | Function | Threshold |
|-------|----------|-----------|
| Fully collateralized | `BasketHandler.fullyCollateralized()` | must be `true` |
| Basket status | `BasketHandler.status()` | must be `0` (SOUND); alert on 1 (IFFY) or 2 (DISABLED) |
| Backing ratio | `RToken.basketsNeeded() / RToken.totalSupply()` | must be ≥ 1.0 |
| Basket nonce changes | `BasketHandler.nonce()` and `BasketSet` event | alert on any change |

Recommended cadence: hourly.

### 3. RSR Buffer Monitoring

| Component | Address | Check |
|-----------|---------|-------|
| StRSR | [`0xffa151Ad0A0e2e40F39f9e5E9F87cF9E45e819dd`](https://etherscan.io/address/0xffa151Ad0A0e2e40F39f9e5E9F87cF9E45e819dd) | `exchangeRate()` — alert on any decrease (RSR seizure) |
| RSR balance held by StRSR | `RSR.balanceOf(StRSR)` | track absolute value; alert on >10% drop |

OC ratio = `(RSR_balance × RSR_price) / ETH+_TVL` — currently ~2.4%. Alert if it drops below 1%.

### 4. Throttle Monitoring

`RToken.issuanceAvailable()` and `redemptionAvailable()` should normally track 10–12.5% of supply. Persistent depletion of `redemptionAvailable` indicates large coordinated exits; alert if it stays below 1% of supply for >2 hours.

### 5. Implementation Upgrade Monitoring

ERC-1967 implementation slot (`0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`) on every core contract: alert on any change.

## Appendix: Contract Architecture

```
                                  ┌──────────────────────────────────┐
                                  │        Governance layer          │
                                  │                                  │
                           ┌──────│ Governor Anastasius v1           │
                           │      │ 0xa8a608b9…                      │
                           │      │ • 2d voting delay                │
                           │      │ • 3d voting period               │
                           │      │ • 10% StRSR quorum               │
                           │      │ • 76,720 stRSR proposal threshold│
                           │      └──────────────────────────────────┘
                           │ proposals
                           ▼
                  ┌────────────────────────────┐         ┌────────────────────────┐
                  │ TimelockController         │◀────────│ Guardian Safe (3-of-6) │
                  │ 0xd7985a7c…                │ cancel  │ 0xd5fe2780…            │
                  │ minDelay = 259,200s (3d)   │         │ + PAUSER, S/L_FREEZER  │
                  └─────────────┬──────────────┘         │ on Main                │
                                │ executes               └────────────────────────┘
                                │ (OWNER role)                         │
                                ▼                                      │ (also pauser:
                  ┌──────────────────────────────────┐                 │  EOA 0xe3e34fa9…)
                  │  Main (ERC1967Proxy)             │                 │
                  │  0xb6A7d481…    impl 0xc5bf686c… │◀────────────────┘
                  │  version 4.2.0                   │
                  │  AccessController for all roles  │
                  └────────────┬─────────────────────┘
                               │ wires
        ┌──────────┬───────────┼────────────┬──────────┬──────────┬──────────────┐
        ▼          ▼           ▼            ▼          ▼          ▼              ▼
  ┌───────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────────┐
  │ RToken    │ │ StRSR  │ │ Backing  │ │ Basket  │ │ Asset  │ │ Furnace │ │ Distributor│
  │ ETH+      │ │ stRSR  │ │ Manager  │ │ Handler │ │ Reg.   │ │ +Broker │ │ +Traders   │
  │ 0xE72B…   │ │ 0xffa1…│ │ 0x608e…  │ │ 0x56f4… │ │ 0xf526…│ │         │ │            │
  └─────┬─────┘ └───┬────┘ └────┬─────┘ └────┬────┘ └────────┘ └─────────┘ └────────────┘
        │           │           │            │
        │ issue/    │ stake/    │ holds      │ defines
        │ redeem    │ unstake   │ collateral │ basket
        │           │           ▼            ▼
        │           │      ┌─────────────────────────────────┐
        │           │      │      LST collateral plugins     │
        │           │      │  wstETH 50%  weETH 22%  rETH 10%│
        │           │      │  sfrxETH 10% ETHx 8%            │
        │           │      └────────────┬────────────────────┘
        │           │                   │
        │           │                   ▼
        │           │      ┌─────────────────────────────────┐
        │           │      │   Underlying staking protocols  │
        │           │      │   Lido / Ether.fi / Rocket Pool │
        │           │      │   / Frax / Stader               │
        │           │      └─────────────────────────────────┘
        │           │ provides 1st-loss capital (≈2.4% OC)
        │           ▼
        │      ┌──────────────┐
        └─────▶│ ETH+ holders │
               └──────────────┘
```

**Key trust boundaries:**
- The Timelock owns Main; the only path to upgrade or change parameters is governance-proposed and 3-day delayed
- The Guardian Safe (3-of-6) is the only counterparty that can act inside the timelock window — by pausing, freezing, or cancelling proposals
- The deployer EOA can pause but cannot freeze or upgrade
- All collateral is held by `BackingManager`; ETH+ holders' redemption is a direct claim on it

---

## Risk Summary

### Key Strengths

- **Fully onchain, verifiable backing.** `fullyCollateralized()` is true; any holder can prove the basket onchain in one call
- **Direct, permissionless redemption** at the basket value with no fee and only a throttle-based pace limit
- **Diversified LST basket.** No single LST exceeds 50%; idiosyncratic risk is meaningfully spread
- **Comprehensive audit history.** Trail of Bits, Code4rena, Trust Security, Solidified, Halborn, Ackee, Oak Security, Certora — and v4.2.0 specifically was audited before activation
- **Programmatic operations.** No admin-controlled exchange rate, no off-chain accounting, no minting role

### Key Risks

- **Recently rotated governance (4 days old).** The v4.2.0 upgrade and new timelock/governor went live on 2026-04-23. Track record on the new governance is by definition <1 week
- **Guardian Safe concentration.** A 3-of-6 multisig can pause, freeze, and cancel governance proposals — the binding constraint inside any 3-day timelock window
- **Deployer EOA still holds PAUSER role.** Single-key risk that can disrupt issuance/trading; should be revoked
- **Thin RSR overcollateralization (~2.4%).** The first-loss buffer is small relative to TVL and scales with RSR price, not ETH+ TVL
- **TVL contraction.** Supply has dropped 25% in ETH terms and 38% in USD since the prior assessment, with no obvious onchain cause — worth understanding before increasing exposure

### Critical Risks

- None identified that would block integration. The EOA-pauser finding is fixable by Reserve governance and does not threaten user funds directly

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** — PASS (multiple top-firm audits, including v4.2.0)
- [ ] **Unverifiable reserves** — PASS (fully onchain, real-time verifiable)
- [ ] **Total centralization** — PASS (decentralized governance, 3-day timelock, multisig guardian)

All gates pass. Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A — Audits:** 1
- 8+ audits across multiple top firms; v4.2.0 specifically covered by Trust Security, Oak Security, Certora
- Active Immunefi bounty
- Moderate–high contract complexity, but offset by repeated audit cycles and formal verification

**Subcategory B — Historical track record:** 1
- ~3 years in production
- Sustained TVL >$100M for >1 year (peak $530M)
- No incidents, no defaults, no peg deviations

**Score: (1 + 1) / 2 = 1.0**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A — Governance:** 2.5
- DAO via Governor Anastasius v1 (StRSR voting) ✓
- 3-day timelock — meets the rubric Score-1 bar of "7+ days" only when combined with the 5-day governance vote (~8 days end-to-end)
- Guardian Safe is 3-of-6 (rubric Score 4 says "3/5 threshold" for governance-controlled multisigs; this is only a guardian, with cancel/pause but not upgrade)
- Deployer EOA holds PAUSER — not catastrophic but a real centralization vector
- New governance is 4 days old — not yet battle-tested

**Subcategory B — Programmability:** 2
- Mostly programmatic with governance-set parameters (basket, throttles, oracle plugins)
- Onchain PPS, no admin updates
- Minor offchain dependence: oracle plugin addresses are governance-managed

**Subcategory C — External dependencies:** 3
- 5 LST dependencies + Chainlink (and per-collateral oracle plugins)
- All collateral is mainstream/established but each is critical to its share of the basket
- Lido is 50% of the basket — single largest concentration
- Per rubric: "many or established protocol dependencies, critical functionality depends on them" → Score 3

**Score: (2.5 + 2 + 3) / 3 = 2.5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A — Collateralization:** 2
- 100% onchain backing ✓
- Five high-quality DeFi LSTs (rubric Score 2: "high-quality DeFi assets, LSTs, major LPs")
- RSR over-collateralization buffer is thin (~2.4%) but exists

**Subcategory B — Provability:** 1
- Reserves fully onchain, real-time verifiable
- Multiple verification sources (per-collateral plugins, anyone can call `refresh()`)

**Score: (2 + 1) / 2 = 1.5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Direct 1:1 redemption with throttle (~12.5%/hr → ~8h for full supply exit)
- Curve ETH+/WETH primary spot pool: ~$12.5M
- DEX exit is good for <$1M positions; larger positions should redeem and sell components on their native markets
- Throttle adds ≥1 day for very large exits → +0.5 modifier
- Same-asset-class redemption (ETH-denominated) → tolerates longer exit windows

Base score 2 (rubric: ">$5M, <1% slippage, 1-3 days"); +0.5 for throttle ≈ **2.5**, capped to **2** given LST exit class.

**Score: 2.0**

#### Category 5: Operational Risk (Weight: 5%)

- Public, doxxed team; established reputation (rubric Score 1)
- Excellent documentation and audit transparency (rubric Score 1)
- Operating entity ABC Labs, LLC; mark Score 2 because the trademark is held by a separate entity (Confusion Capital) and there is no formal foundation/DAO entity holding protocol assets

**Score: (1 + 1 + 2) / 3 = 1.3**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.0 | 20% | 0.20 |
| Centralization & Control | 2.5 | 30% | 0.75 |
| Funds Management | 1.5 | 30% | 0.45 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 1.3 | 5% | 0.07 |
| **Final Score** | | | **1.77** |

**Modifiers:**
- Protocol live >2 years with no incidents: **−0.5** would apply, but offset by:
  - Major version upgrade (v4.2.0) and full governance rotation 4 days before assessment: **+0.5** for unproven new governance state
- Net modifier: **0**

**Final score (rounded): 1.8**

But: the EOA holding PAUSER role is a discrete finding that the rubric does not capture in the existing subcategory ranges. Adding **+0.2** as an explicit penalty until that role is revoked.

**Adjusted Final Score: 2.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0–1.5 | Minimal Risk | Approved, high confidence |
| **1.5–2.5** | **Low Risk** | **Approved with standard monitoring** ← **ETH+ is here** |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

## Overall Risk Score: **2.0 / 5.0**

### Risk Tier: **LOW RISK**

**Recommendation:** ✅ **APPROVED** for Yearn integration with standard monitoring, conditional on:
1. Tracking the new (v4.2.0) governance for at least 30 days post-deployment for unexpected behavior
2. Adding all governance / role / backing checks listed in **Monitoring** to yearn's monitoring repo, including the EOA pauser address
3. Watching the supply contraction trend; reassess if TVL drops below $40M

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months or sooner if any trigger below fires
- **TVL-based:** Reassess if ETH+ TVL drops below $40M or grows above $200M
- **Basket-based:** Reassess on any `BasketSet` event (basket nonce change)
- **Governance-based:** Reassess on any of:
  - New OWNER, PAUSER, SHORT_FREEZER, or LONG_FREEZER role grant on Main
  - Guardian Safe owner or threshold change
  - Governor or timelock contract replacement
  - PAUSER role grant or revoke involving the EOA `0xe3e34fa9…` (positive: revocation reduces risk score)
- **Collateral-based:** Reassess on any LST issuer incident (Lido, Ether.fi, Rocket Pool, Frax, Stader)
- **OC-based:** Reassess if RSR over-collateralization ratio falls below 1%
- **Incident-based:** Reassess after any pause, freeze, IFFY/DISABLED collateral status, or RSR seizure
