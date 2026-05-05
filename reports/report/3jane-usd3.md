# Protocol Risk Assessment: 3Jane — USD3

- **Assessment Date:** March 4, 2026 (Updated: May 5, 2026)
- **Reassessment trigger:** April 2026 emergency shutdown event — see summary below.
- **Token:** USD3
- **Chain:** Ethereum
- **Token Address:** [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc)
- **Final Score: 3.75/5.0**

> **May 5, 2026 reassessment summary** — score moved from **3.5 → 3.75**, tier from **Medium → Elevated**. Key changes since March 2026: (1) the protocol experienced its first stress event on April 18–28, 2026 — `USD3.shutdownStrategy()` + `emergencyWithdraw()` were executed in prod, idle reserves collapsed, and recovery required a new `restartStrategy()` reinitializer (PR [#112](https://github.com/3jane-protocol/moneymarket-contracts/pull/112)); (2) USD3 deposits contracted ~51% (`$20.3M → $9.93M`) and utilization rose `~44% → ~70%`; (3) governance role separation improved with EmergencyController v2 + Hypernative integration on `EMERGENCY_AUTHORIZED_ROLE`; (4) the further OperationalController split (PR [#111](https://github.com/3jane-protocol/moneymarket-contracts/pull/111), merged Apr 29, 2026) is **not yet wired in onchain**; (5) Insurance Fund balance corrected to ~$868K `waEthUSDC` (previously approximated as "$1M USDC"). **Open TODO:** 3Jane has not published a public post-mortem of the April shutdown.

## Overview + Links

3Jane is a **credit-based money market** on Ethereum that enables **unsecured (uncollateralized) USDC credit lines** underwritten against verifiable proofs of crypto assets, bank assets, future cash flows, and credit scores. The protocol is built as a **modified fork of Morpho Blue**, replacing collateral logic with credit assessment, and uses **Yearn V3 tokenized strategy** architecture for its vault contracts.

**USD3** is the **senior tranche** of 3Jane's lending pool. Users deposit USDC to mint USD3, and those funds are allocated into a shared lending pool. Idle capital earns baseline yield via **Aave V3 USDC market**. When borrowers draw down credit lines, funds are withdrawn from Aave and lent at interest rates determined by a base rate + per-borrower risk premium.

**Dual-Tranche Structure:**

- **USD3 (Senior Tranche):** Priority claim on interest repayments, lower risk, lower yield (~2.1% APY). ERC-4626 compliant.
- **sUSD3 (Junior/Subordinated Tranche):** First-loss capital. Users stake USD3 to mint sUSD3. Higher yield but absorbs losses first in case of defaults. Has a lock period before withdrawal.

Interest is distributed with an **85/15 split** between USD3 (senior) and sUSD3 (junior) tranches.

**Links:**

- [3Jane Documentation](https://docs.3jane.xyz/)
- [3Jane App](https://www.3jane.xyz/)
- [3Jane Whitepaper](https://www.3jane.xyz/pdf/whitepaper.pdf)
- [3Jane Introduction (Mirror)](https://mirror.xyz/0x763E83224239b339788c36652EFA9f40107EFf2C/AtiYFk_sL7-74q-wRqRhPMqW_OQbs4xqZHKgAbRa37Y)
- [Veridise Audit Report](https://github.com/3jane-protocol/audits/blob/main/veridise-audit.pdf)
- [GitHub: moneymarket-contracts](https://github.com/3jane-protocol/moneymarket-contracts)
- [DefiLlama: 3Jane](https://defillama.com/protocol/3jane)

## Audits and Due Diligence Disclosures

### 3Jane-Specific Audits

| Auditor | Date | Type | Scope | Critical | High | Medium | Low/Info | Status |
|---------|------|------|-------|----------|------|--------|----------|--------|
| [Veridise](https://github.com/3jane-protocol/audits/blob/main/veridise-audit.pdf) (4 analysts, 20 person-days) | Aug 7–18, 2025 | Audit | MorphoCredit, USD3/sUSD3, ProtocolConfig, CreditLine, Helper, MarkdownController, InsuranceFund, IRM | 1 | 2 | 2 | 5 | 6 Fixed, 4 Acknowledged |
| [Sherlock](https://github.com/3jane-protocol/audits/blob/main/sherlock-audit.pdf) (Kirkeelee, mstpr-brainbot) | Aug 4–20, 2025 | Collaborative Audit | MorphoCredit, USD3/sUSD3, CreditLine, Helper, IRM (2 repos: 3jane-morpho-blue + usd3) | 0 | 7 | 5 | 3 | All fixed/acknowledged |
| [Electisec](https://github.com/3jane-protocol/audits/blob/main/electisec-audit.pdf) (Panda, Fede — 10 days, 13 contracts ~2000 LoC) | Oct 18, 2025 | Audit | Full moneymarket + Jane token, RewardsDistributor, PYTLocker | 0 | 1 | 2 | 10 | All fixed/acknowledged |
| [Sherlock 2](https://github.com/3jane-protocol/audits/blob/main/sherlock-2-audit.pdf) (Obsidian lead, ~40 wardens) | Oct 7–17, 2025 | Private Contest | Full moneymarket + USD3/sUSD3 + Jane/PYTLocker/RewardsDistributor | 0 | 1 | 7 | 0 | All fixed/acknowledged |

**Notable findings across all audits:**

- **V-3JNE-VUL-001 (Veridise Critical):** Funds draining via malicious market creation — attacker could create fake markets with malicious MarkdownManager and CreditLine contracts to drain the MorphoCredit waUSDC wallet. **Fixed** via access control on market creation.
- **Sherlock H-1:** Settlement flow double deduction and incorrect balance clearing — `MorphoCredit` settlement flow contained critical accounting vulnerabilities that could lead to protocol insolvency. **Fixed**.
- **Sherlock H-2 through H-7:** Various high-severity issues across credit line settlement, repayment flows, and balance tracking. **All fixed**.
- **Electisec H-1:** Pendle YT token interests lost during lock period in PYTLocker — locker never claims accrued yield, so YT tokens are worth $0 at expiry. **Feature subsequently removed from codebase**.
- **Sherlock 2 H-1:** Loss of all YT yield accrued due to PYTLocker staleness (same root cause as Electisec H-1). **Fixed**.
- **Veridise H-1/H-2:** Griefing via small donations resetting lock timer; lock period bypass via uncontrolled `startCooldown()`. **Both fixed**.
- **Electisec M-1/M-2:** Cooldown restart allows users to bypass cooldown mechanism; JANE burn mechanism is unfair and gameable. **Acknowledged/Fixed**.

**Veridise auditor recommendations:** Split the `ProtocolConfig.owner` role into separate keys with different delays for emergency vs. configuration actions. Enforce access control on market creation (least privilege approach).

**Total across all 4 audits:** 1 Critical, 11 High, 16 Medium — all fixed or acknowledged. The high volume of findings (particularly in the first Sherlock audit with 7 highs) indicates the codebase had significant issues that were caught and resolved before mainnet deployment.

### Inherited Morpho Blue Audits

The core lending logic is a modified fork of Morpho Blue, which has been extensively audited:

| Auditor | Date | Scope |
|---------|------|-------|
| OpenZeppelin | Sep–Oct 2023 | Morpho Blue & Speed Jump IRM |
| Cantina | Nov 2023 – Mar 2024 | Morpho Blue managed review, IRM, Competition, Periphery, Fixed rate IRM |

**Note:** The inherited audits cover the base Morpho Blue logic. 3Jane's modifications (credit-based lending, tranche system, markdown controller) are the novel risk surface covered by the 4 3Jane-specific audits above.

The source code includes a `/certora` directory indicating formal verification efforts for rate math.

### Bug Bounty

- **Not listed** on Immunefi, Sherlock, or Cantina
- **Not listed** on [SEAL Safe Harbor](https://safeharbor.securityalliance.org/)
- No active bug bounty program found

## Historical Track Record

- **Production time:** USD3 deployed August 25, 2025 (~9 months as of May 2026)
- **TVL:** ~$3.15M idle reserves (DeFiLlama), with ~$6.91M borrowed and ~$9.93M total `USD3.totalAssets()` (sources: [DeFiLlama](https://defillama.com/protocol/3jane), `totalAssets()` call at block ~24,887,082, May 5 2026)
- **Token supply:** ~$8.59M USD3 supply (`totalSupply()`), ~$5.81M sUSD3 supply; PPS = `1.155560` USDC/USD3 and `1.081790` USD3/sUSD3 (May 5, 2026)
- **Utilization:** ~$6.91M borrowed / ~$9.93M deposited → ~70% (was ~44% in March 2026 assessment)
- **TVL change since March:** USD3 deposits dropped ~51% (`$20.3M → $9.93M`); idle reserves dropped ~66% (`$9.2M → $3.15M`); borrowed roughly flat (`$7.2M → $6.91M`)
- **Security incidents:**
  - **April 18–28, 2026 — emergency shutdown / restart event.** Per merged PR [#112](https://github.com/3jane-protocol/moneymarket-contracts/pull/112) the team had already executed `strategy.shutdownStrategy()` and `strategy.emergencyWithdraw(...)` "in prod" before April 27, 2026. DeFiLlama TVL series confirms idle reserves collapsed from ~$4.78M on Apr 19 to ~$269K on Apr 20 and stayed at $120K–$273K for ~7 days, recovering to ~$2.92M by May 2 and ~$3.15M today. Restoration required deploying a new `USD3.restartStrategy()` reinitializer (PR #112 merged Apr 28, 2026); current onchain state is `isShutdown() = false`. Root cause and post-mortem: **TODO — not publicly disclosed by 3Jane (no announcement on docs site or audits repo as of this reassessment).**
- **Peg history:** USD3 is USDC-denominated and redeemable from idle reserves; no public depeg event reported. Note that during the April shutdown window, redemptions were effectively unavailable from the Yearn V3 strategy path.
- **Phase 1 (bootstrapping):** During initial phase, USD3 operates in a "fully risk-off" configuration where funds are only deposited into Aave's USDC market. The unsecured lending component ramps up over time.

**Funding:** $5.2M seed round (June 2025) led by **Paradigm**, with participation from Coinbase Ventures, Robot Ventures, Wintermute Ventures, Breed VC, and Bodhi Ventures. Andre Cronje listed among backers.

## Funds Management

USD3 funds are deployed into two channels:

1. **Aave V3 USDC market** — baseline yield on idle capital
2. **Unsecured credit lines** — funds lent to approved borrowers at interest (base rate + risk premium + potential penalty rate)

### Accessibility

- **Minting:** Deposit USDC → receive USD3 (1:1). Anyone can mint.
- **Staking:** Stake USD3 → receive sUSD3 (junior tranche). Lock period applies (1 month in Phase 1).
- **Redemption:** USD3 redeemable for USDC from idle reserves (Aave). A **redemption queue with time-based throttling** exists for liquidity management.
- Minting/redeeming is not fully atomic — subject to available idle reserves and throttling mechanisms.

### Collateralization

USD3 is fundamentally different from traditional overcollateralized stablecoins:

- **Not overcollateralized** — USD3 is backed by USDC deposits that are then lent out via unsecured credit lines
- **Credit-based model:** Borrowing limits are based on offchain reputation and financial records, not onchain collateral
- **Default risk:** If borrowers default, losses are absorbed first by sUSD3 (junior tranche), then by the Insurance Fund, and finally by USD3 holders (senior tranche)
- **Insurance Fund:** [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) holds **~868,288 waEthUSDC** (≈ $868K, May 5 2026) — `waEthUSDC` is the static-wrapped Aave V3 USDC token at [`0xd4fa2d31b7968e448877f69a96de69f5de8cd23e`](https://etherscan.io/address/0xd4fa2d31b7968e448877f69a96de69f5de8cd23e). The fund is yield-bearing and grows through Aave interest. The earlier "$1M USDC" figure was approximate; **actual onchain balance is ≈$868K**, never funded above ~$868K since deployment.
- **Markdown mechanism:** `MarkdownController` ([`0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214`](https://etherscan.io/address/0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214)) gradually reduces the value of defaulted loans from their initial value to zero over time, preventing sharp market shocks
- **No liquidation mechanism** — there is no onchain collateral to liquidate. Default recovery relies on offchain legal enforcement via U.S.-based collection agencies

### Default Recovery Process

Per-loan recovery sequence applied to a defaulted credit line:

1. Immediate credit score reduction (slashing 3Jane score)
2. Overdue interest reallocation
3. Markdown: protocol marks down delinquent/defaulted positions to reflect recovery rate
4. NPL Auction: non-performing loans sold to registered U.S. collection agencies via Dutch-style auctions
5. Offchain legal recovery via credit bureau reporting and regulatory enforcement

Any residual loss after the per-loan recovery above is then absorbed in the **tranche loss waterfall** (same order as in *Collateralization* above):

1. **sUSD3** (junior tranche) — first-loss capital
2. **Insurance Fund** — ~868,288 `waEthUSDC` (≈$868K, May 5 2026); see *Collateralization* for address details
3. **USD3** (senior tranche) — last-resort loss absorption

### Provability

- **USD3/sUSD3 share prices** are computed onchain via ERC-4626 standard
- **Outstanding loans and interest accruals** are tracked onchain in MorphoCredit
- **Credit assessment is offchain** — the 3CA (3Jane Credit Algorithm) is a proprietary black box. Credit line sizes, default risk rates, and repayment schedules are computed offchain
- **zkTLS + Reclaim Protocol** provides zero-knowledge proofs of offchain data (bank statements, credit scores), verified by **EigenLayer AVS** nodes
- **Offchain data sources:** Plaid (bank data), Credit Karma (credit scores)
- Total reserves cannot be fully verified onchain because outstanding loan values depend on offchain repayment status

## Liquidity Risk

- **Primary exit:** Redeem USD3 for USDC from idle reserves in the Aave V3 pool
- **Throttling:** Redemption queue with time-based throttling exists for large withdrawals
- **Utilization risk:** If a high percentage of deposited USDC is lent out to borrowers, idle reserves shrink and redemptions may be delayed
- **Current utilization:** ~$6.91M borrowed out of ~$9.93M `totalAssets` (~70% utilization, May 5 2026) — up sharply from ~44% in March 2026
- **Stress event (April 2026):** During the strategy shutdown, Yearn V3 `isShutdown()=true` blocked the standard `deposit/redeem` paths. DeFiLlama-visible idle reserves collapsed from ~$4.78M to ~$269K and stayed depressed for ~7 days before recovering. This is the protocol's first observed liquidity stress event, and it required a contract upgrade (new `restartStrategy()` reinitializer) — i.e. a 24h-timelocked governance action — to fully reopen the strategy.
- **No DEX liquidity data** readily available for USD3/USDC pairs (TODO: re-check Curve/Uniswap pools — none verified onchain in this assessment)
- **sUSD3 exit:** Subject to lock period (1 month in Phase 1) plus cooldown mechanism. During the April incident, sUSD3 supply was largely unchanged while USD3 supply contracted, which is consistent with senior holders redeeming and junior holders being locked.

## Centralization & Control Risks

### Governance

**Ownership structure:**

All core contracts (MorphoCredit, ProtocolConfig, CreditLine, USD3) are owned by a **TimelockController** with a **24-hour delay**:

- **TimelockController:** [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) — 24h minimum delay
- **Proposer/Executor/Canceller:** 3-of-5 Gnosis Safe [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef)
- **Safe signers (5 EOAs):**
  - [`0x208662548D73755b4C96a9f7809a035910E55631`](https://etherscan.io/address/0x208662548D73755b4C96a9f7809a035910E55631)
  - [`0x5A519B341962307a98BB196EcFc21b8fa89395D1`](https://etherscan.io/address/0x5A519B341962307a98BB196EcFc21b8fa89395D1)
  - [`0x751A84FCE3dd5161ecC741Da47929337a7e6f64f`](https://etherscan.io/address/0x751A84FCE3dd5161ecC741Da47929337a7e6f64f)
  - [`0xa84Bd17f9efBA6A4dbB631285C689D9E58d56D33`](https://etherscan.io/address/0xa84Bd17f9efBA6A4dbB631285C689D9E58d56D33)
  - [`0x1226858E04b9d077258F153275613734421cD06B`](https://etherscan.io/address/0x1226858E04b9d077258F153275613734421cD06B)
- Signer identities are **not publicly labeled** on Etherscan

**Contracts are upgradeable** — MorphoCredit, USD3, sUSD3, ProtocolConfig, and AdaptiveCurveIRM use TransparentUpgradeableProxy patterns. Each proxy has a dedicated ProxyAdmin (e.g. USD3 → [`0x41c838664a9c64905537ff410333b9f5964cc596`](https://etherscan.io/address/0x41c838664a9c64905537ff410333b9f5964cc596), sUSD3 → [`0xecda55c32966b00592ed3922e386063e1bc752c2`](https://etherscan.io/address/0xecda55c32966b00592ed3922e386063e1bc752c2)) whose `owner()` is the TimelockController. The 3-of-5 multisig can upgrade contract logic after the 24h timelock delay. CreditLine and Helper are standalone (non-proxy) contracts.

**EmergencyController v2 — deployed Feb 25, 2026** at [`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051) (verified onchain as the active `ProtocolConfig.emergencyAdmin` and `CreditLine.ozd`). Migrated from `Ownable` to `AccessControlEnumerable` per PR [#109](https://github.com/3jane-protocol/moneymarket-contracts/pull/109), introducing role separation:

- `OWNER_ROLE` (count 1): the 3-of-5 multisig [`0x33333333Bd7045F1A601A1E289D7AB21036fB5EF`](https://etherscan.io/address/0x33333333Bd7045F1A601A1E289D7AB21036fB5EF)
- `EMERGENCY_AUTHORIZED_ROLE` (count 2): the multisig + an EOA [`0x48c59b01af01515e69460b6b5b55e557e914941d`](https://etherscan.io/address/0x48c59b01af01515e69460b6b5b55e557e914941d) — per PR #111 description, this is the **Hypernative monitoring/automation address**. (Identity inferred from PR text "Hypernative + multisig"; not labeled on Etherscan.)
- Capabilities: pause protocol, set debt cap to 0, stop USD3 deployments to MorphoCredit, stop new deposits, revoke individual borrower credit lines. Emergency actions bypass the 24h timelock (binary stop controls only).

**OperationalController (PR [#111](https://github.com/3jane-protocol/moneymarket-contracts/pull/111), merged Apr 29, 2026 — NOT yet wired in onchain):** designed to introduce an additional `OPERATOR_ROLE` for routine credit operations (`setCreditLines`, `closeCycleAndPostObligations`, `addObligationsToLatestCycle`, `settle`) so frequent ops can run via a smaller operational multisig while emergency actions remain on Hypernative + main multisig. As of May 5, 2026 the deployment scripts (`01_DeployOperationalController.s.sol`, `02_Schedule…`, `03_Execute…`) are merged but `ProtocolConfig.emergencyAdmin` and `CreditLine.ozd` still resolve to the v2 EmergencyController above — i.e. the role split is **partially implemented**.

**Privileged roles (from Veridise audit trust model):**

- `ProtocolConfig.owner` (= TimelockController, behind 3/5 Safe + 24h delay): pauses protocol, sets bounds on grace/delinquency periods, loan sizes, tranche ratios, interest rate configurations, and rotates `emergencyAdmin`.
- `CreditLine.owner` (= TimelockController) and `CreditLine.ozd` (= EmergencyController v2): the latter currently aggregates emergency + operational duties (approving credit lines, posting minimum repayments, settling debt from insurance fund). The pending OperationalController is the planned split.

**Auditor (Veridise) recommendation status:** The original recommendation to split `ProtocolConfig.owner`/`CreditLine.ozd` into separate keys with different delays for emergency vs configuration actions has been **partially addressed** by the EmergencyController v2 role separation and Hypernative integration; full operational/emergency split via OperationalController is **deployed in code but not yet executed onchain**.

### Programmability

- **Onchain:** Interest accruals, share price computation (ERC-4626), loan state tracking, markdown decay — all programmatic
- **Offchain (critical):** Credit assessment (3CA algorithm), borrower approval, minimum repayment posting, credit line sizing — all require admin intervention
- **PPS (price per share):** Computed onchain algorithmically via ERC-4626 standard, but the total asset value depends on outstanding loan values which can be marked down by admin
- **Hybrid system:** Automated onchain mechanics + significant manual offchain operations

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Aave V3** | Critical | Base yield on idle USDC (held as `waEthUSDC` static-wrapped Aave aToken). Well-audited, blue-chip dependency |
| **Morpho Blue** (forked) | Critical | Core lending logic. Modifications (credit, tranches, markdown) are the novel risk surface |
| **Yearn V3 TokenizedStrategy** | Critical | USD3 is a Yearn V3 tokenized strategy proxy; `shutdown`/`emergencyWithdraw`/`reinitializer(...)` semantics on `StrategyData` storage slots are load-bearing — see April 2026 incident which required a `restartStrategy()` reinitializer to clear the shutdown flag (PR #112) |
| **Reclaim Protocol / zkTLS** | High | Offchain data verification for credit scores and bank data. Novel technology with limited battle-testing |
| **EigenLayer AVS** | High | ZK proof distribution and verification. Early-stage infrastructure |
| **Hypernative** | Medium-High | Automated monitoring + emergency response (one of two `EMERGENCY_AUTHORIZED_ROLE` holders on EmergencyController v2). New runtime trust dependency; failure mode is a missed-or-malicious automated pause |
| **Plaid** | Medium | Bank account data access. Centralized offchain dependency |
| **Credit Karma** | Medium | VantageScore/FICO data. Centralized offchain dependency |

## Operational Risk

- **Founder:** Jacob Chudnovsky — publicly identified, previously at Ribbon Finance / Aevo. Active on [X/Twitter](https://x.com/_yakovsky)
- **Team:** Only founder is publicly known. Rest of team not disclosed
- **Developed in stealth** before the June 2025 funding announcement
- **Legal entity:** Not publicly disclosed
- **Documentation:** Good — comprehensive docs covering architecture, risks, and developer resources. **Gap:** the April 2026 emergency shutdown is not (yet) acknowledged in public docs or the audits repo as of May 5, 2026 — no post-mortem found.
- **Incident response:** First real-world test occurred April 18–28, 2026. Team executed `shutdownStrategy()` + `emergencyWithdraw()` and then had to ship new code (`USD3.restartStrategy()` reinitializer in PR #112) before the strategy could be reopened — i.e. the existing v2 `reinitialize()` could not reverse a Yearn V3 shutdown, which is consistent with the runbook in PR #112 stating that "Differs from the v2 multisig pattern". Net read: the team was able to halt and recover, but full recovery required a 24h-timelocked governance upgrade rather than a pre-rehearsed runbook, and idle reserves were depressed (~$120K–$273K) for ~7 days.
- **Funding:** $5.2M seed from tier-1 investors (Paradigm, Coinbase Ventures)

## Monitoring

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| USD3 Token (Proxy) | [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc) | Supply changes, large deposits/withdrawals, share price |
| sUSD3 Token (Proxy) | [`0xf689555121e529Ff0463e191F9Bd9d1E496164a7`](https://etherscan.io/address/0xf689555121e529Ff0463e191F9Bd9d1E496164a7) | Supply changes, lock period changes, cooldown events |
| MorphoCredit (Proxy) | [`0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc`](https://etherscan.io/address/0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc) | Borrow/repay events, utilization ratio, new market creation, delinquency/default state changes |
| ProtocolConfig (Proxy) | [`0x6b276A2A7dd8b629adBA8A06AD6573d01C84f34E`](https://etherscan.io/address/0x6b276A2A7dd8b629adBA8A06AD6573d01C84f34E) | Config changes (pause, debt cap, supply cap, tranche ratios) |
| CreditLine | [`0x26389b03298BA5DA0664FfD6bF78cF3A7820c6A9`](https://etherscan.io/address/0x26389b03298BA5DA0664FfD6bF78cF3A7820c6A9) | New credit line approvals, credit line revocations, repayment postings |
| Helper | [`0x82736F81A56935c8429ADdbDa4aEBec737444505`](https://etherscan.io/address/0x82736F81A56935c8429ADdbDa4aEBec737444505) | Borrower interactions |
| AdaptiveCurveIRM (Proxy) | [`0x1d434D2899f81F3C3fdf52C814A6E23318f9C7Df`](https://etherscan.io/address/0x1d434D2899f81F3C3fdf52C814A6E23318f9C7Df) | Rate model parameter changes |
| TimelockController (24h) | [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) | Scheduled/executed/cancelled operations, role changes (`getMinDelay()` = 86400) |
| Multisig (3/5 Safe) | [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef) | Signer/threshold changes, submitted transactions (threshold = 3, owners unchanged from prior assessment) |
| EmergencyController v2 | [`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051) | Pause/cap/revoke actions, `EMERGENCY_AUTHORIZED_ROLE` membership changes (Hypernative + multisig today) |
| Hypernative agent (EOA) | [`0x48c59b01af01515e69460b6b5b55e557e914941d`](https://etherscan.io/address/0x48c59b01af01515e69460b6b5b55e557e914941d) | Automated emergency calls; nonce/activity spikes |
| InsuranceFund | [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) | `waEthUSDC` balance (currently ≈$868K); `bring()` calls (drain to CreditLine) |
| MarkdownController | [`0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214`](https://etherscan.io/address/0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214) | Markdown parameter changes, defaulted-position write-downs |

**Critical Events to Monitor:**

- Protocol pause/unpause events
- `USD3.isShutdown()` flips (the April 2026 incident was visible here days before the protocol publicly acknowledged it)
- Debt cap or supply cap changes
- New credit line approvals (borrowers being approved)
- Delinquency and default state transitions
- Markdown events on defaulted positions
- USD3/sUSD3 share price deviations
- Insurance Fund `waEthUSDC` balance changes (esp. outflows via `bring()`)
- Contract upgrades via TimelockController (`CallScheduled` / `CallExecuted` events on `0x1dCcD4...`)
- Multisig signer/threshold changes
- `EMERGENCY_AUTHORIZED_ROLE` / `OPERATOR_ROLE` grants/revokes on EmergencyController v2 (and on the future OperationalController once deployed)
- Large withdrawal requests and redemption queue depth
- Aave V3 USDC utilization (affects idle reserve availability)
- DeFiLlama TVL series for 3Jane — sharp idle-reserve drops are an early signal of a strategy shutdown or mass redemption

## Appendix: Contract Architecture

```
 Governance Layer
 ┌─────────────────────────────────────────────────────────────────────┐
 │  3-of-5 Safe  ──owns──►  TimelockController (24h delay)             │
 │  0x33333333…              0x1dCcD4628d…                             │
 │                              │                                      │
 │                              ├──owner──► ProxyAdmin(USD3)  0x41c8…  │
 │                              ├──owner──► ProxyAdmin(sUSD3) 0xecda…  │
 │                              ├──owner──► MorphoCredit (proxy)       │
 │                              ├──owner──► ProtocolConfig (proxy)     │
 │                              └──owner──► CreditLine (non-proxy)     │
 │                                                                     │
 │  EmergencyController v2  0x84b31b8…  (AccessControlEnumerable)      │
 │   ├─ OWNER_ROLE: 3/5 Safe                                           │
 │   └─ EMERGENCY_AUTHORIZED_ROLE: 3/5 Safe + Hypernative EOA 0x48c5…  │
 │   ⇧ wired in as: ProtocolConfig.emergencyAdmin AND CreditLine.ozd   │
 │                                                                     │
 │  [PENDING] OperationalController (PR #111 merged Apr 29 2026,       │
 │            not yet executed onchain — would replace EC v2 above     │
 │            and add OPERATOR_ROLE for routine credit ops)            │
 └─────────────────────────────────────────────────────────────────────┘

 Token / Vault Layer (Yearn V3 TokenizedStrategy)
 ┌─────────────────────────────────────────────────────────────────────┐
 │  USD3 (proxy)   0x056B269E…   impl 0xaf1554f3… (USD3 contract)      │
 │     ▲ deposits USDC, mints USD3                                     │
 │     │ shutdownStrategy() / emergencyWithdraw() / restartStrategy()  │
 │     │   ← all admin-callable; April 2026 incident exercised these   │
 │  sUSD3 (proxy)  0xf6895551…   impl 0x4f6694dd… (junior tranche)     │
 │     ▲ stake USD3, mint sUSD3, 1-month lock                          │
 └─────────────────────────────────────────────────────────────────────┘

 Protocol Layer (forked Morpho Blue)
 ┌─────────────────────────────────────────────────────────────────────┐
 │  MorphoCredit (proxy)   0xDe6e08ac…   ←  market state, accruals     │
 │  ProtocolConfig (proxy) 0x6b276A2A…   ←  global params, emergency   │
 │  CreditLine             0x26389b03…   ←  borrower approval,         │
 │                                          repayment posting,         │
 │                                          settlement                 │
 │  Helper                 0x82736F81…   ←  borrower entry point       │
 │  AdaptiveCurveIRM(prox) 0x1d434D28…   ←  rate model                 │
 │  MarkdownController     0xF0eaE710…   ←  default markdown decay     │
 │  InsuranceFund          0x4507B5B2…   ←  ~868K waEthUSDC,           │
 │                                          .bring() ⇒ CreditLine      │
 └─────────────────────────────────────────────────────────────────────┘

 Underlying / Offchain Layer
 ┌─────────────────────────────────────────────────────────────────────┐
 │  Aave V3 USDC market  ←  base yield on idle (held as waEthUSDC      │
 │                          0xd4fa2d31…)                               │
 │  Reclaim Protocol / zkTLS  ←  proofs of bank/credit data            │
 │  EigenLayer AVS            ←  proof distribution / verification     │
 │  Plaid + Credit Karma      ←  centralized offchain data sources     │
 │  Hypernative (offchain)    ←  monitoring agent that drives the      │
 │                                EOA holding EMERGENCY_AUTHORIZED_ROLE│
 └─────────────────────────────────────────────────────────────────────┘
```

**Trust boundaries**

- The 3-of-5 Safe + 24h timelock is the only path to upgrade contract logic, change ProtocolConfig, or rotate `emergencyAdmin`/`ozd`.
- `EmergencyController v2` bypasses the timelock for binary stop controls only (pause / set caps to zero / revoke a credit line). Both the multisig and the Hypernative agent EOA can invoke it.
- The CreditLine contract trusts an `ozd` for credit-line approval / repayment posting / debt settlement; today this resolves to EmergencyController v2, which is the same address as `emergencyAdmin`. The pending OperationalController (PR #111) is the planned split.
- The `restartStrategy()` reinitializer added in PR #112 demonstrated that recovery from a Yearn V3 shutdown sits behind the timelock-gated upgrade path — a coupling worth highlighting because it determines worst-case redemption-restart latency.

## Risk Summary

### Key Strengths

- **Tier-1 backing:** $5.2M seed led by Paradigm, with Coinbase Ventures, Robot Ventures, Wintermute Ventures
- **Solid governance structure:** 3-of-5 multisig with 24h timelock on all non-emergency actions; ProxyAdmins owned by the timelock for all upgradeable contracts (verified onchain)
- **Inherited Morpho Blue security:** Core lending logic based on extensively audited Morpho Blue codebase
- **Dual-tranche protection:** sUSD3 junior tranche (~$5.81M supply) + Insurance Fund (~$868K in `waEthUSDC`) absorb losses before senior USD3 holders
- **Improved emergency tooling:** EmergencyController v2 (deployed Feb 2026) introduces role separation; `EMERGENCY_AUTHORIZED_ROLE` is now held by both the multisig and a Hypernative automation agent for 24/7 monitored response
- **Demonstrated incident response:** Team successfully halted and later restarted the strategy during the April 2026 shutdown event without any loss of funds, share-price (PPS) preservation visible onchain (USD3 PPS = 1.155560 USDC; sUSD3 PPS = 1.081790 USD3 on May 5)

### Key Risks

- **Unsecured lending model:** Fundamentally higher risk than overcollateralized DeFi lending. Default recovery depends entirely on offchain legal mechanisms and U.S. collection agencies — novel and untested in DeFi
- **Proprietary credit algorithm:** The 3CA is a black box. Credit decisions are offchain and opaque. Incorrect credit assessments could lead to systemic defaults
- **No bug bounty program:** Notable absence from Immunefi, Sherlock, and Cantina despite managing ~$10M of user funds
- **Novel offchain dependencies:** zkTLS/Reclaim Protocol, EigenLayer AVS, and now Hypernative are early-stage technologies / runtime trust deps with limited battle-testing
- **Limited team transparency:** Only the founder is publicly known. No disclosed legal entity. No public post-mortem of the April 2026 shutdown event as of this reassessment.
- **Auditor recommendation only partially addressed:** Veridise asked for a hard split between emergency and configuration roles. EmergencyController v2 split off the emergency role from `Ownable`, but the further `OPERATOR_ROLE` split (PR #111) is merged in code yet **not yet deployed onchain**.

### Critical Risks

- **Default contagion:** If multiple borrowers default simultaneously, the sUSD3 junior tranche + ~$868K Insurance Fund may be insufficient to cover losses, directly impacting USD3 holders. With ~$6.91M outstanding loans, even a ~14% default rate would exhaust the insurance buffer before touching sUSD3.
- **Offchain legal dependency:** Entire default recovery mechanism depends on U.S. legal system, licensed collection agencies, and credit bureau reporting — none of which have been tested at scale in a DeFi context
- **Upgrade risk + Yearn V3 shutdown semantics:** The April 2026 incident showed that recovering from `shutdownStrategy()` required a brand-new `restartStrategy()` reinitializer (PR #112). Future shutdowns may again require timelocked upgrades to fully reopen — a hidden coupling between emergency response and governance.
- **Liquidity risk under stress:** Utilization is now ~70% (up from ~44% in March). The April 2026 event demonstrated that when the strategy is shut down, idle reserves available for redemption can collapse to near-zero for a week+ window.
- **TVL contraction:** USD3 deposits are down ~51% since the previous assessment. If contraction continues, the protocol could fall below the scale needed for the credit model to be economically meaningful.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — 3Jane has been audited by Veridise, Sherlock x2, and Electisec (4 audits 2025). Additionally inherits Morpho Blue audits. ✅ PASS
- [ ] **Unverifiable reserves** — Outstanding loan values depend on offchain repayment status. Onchain reserves (Aave-backed idle + InsuranceFund `waEthUSDC`) are verifiable, but total asset value including outstanding loans is partially opaque ⚠️ CONDITIONAL PASS
- [x] **Total centralization** — Uses 3/5 multisig with 24h timelock; ProxyAdmins owned by timelock; emergency role split off into AccessControlEnumerable ✅ PASS

**All gates pass (conditional).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | 4 specific audits (Veridise, Sherlock x2, Electisec) with 1 critical + 11 high + 16 medium findings, all fixed. Inherited Morpho Blue audits (OpenZeppelin, Cantina). Certora formal verification present |
| Production history | ~9 months (Aug 2025 deployment, May 2026 reassessment). TVL ~$9.93M `totalAssets` (~$3.15M idle + ~$6.91M outstanding) — slipped below the $10M threshold |
| Security incidents | One — April 18–28, 2026 emergency shutdown + restart. No reported loss of funds, but ~7 days of effectively unavailable redemptions. **No public post-mortem yet (TODO).** |
| Bug bounty | Still none — checked Immunefi, Sherlock, Cantina, SEAL Safe Harbor on May 5, 2026; not listed |

**Score: 3.5/5** — Audit coverage is strong (rubric ≈3 for "3+ audits by top firms" once you count the contest). Historical track record is weaker than at the March assessment: still ~9 months live, but TVL has fallen to ~$10M (rubric: <$10M idle is a 4) and the protocol experienced its first non-trivial stress event (shutdown). Net: bumped from 3 → 3.5 to reflect (a) the unresolved post-mortem, (b) the smaller scale, and (c) the still-missing bug bounty.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | MorphoCredit, USD3, sUSD3, ProtocolConfig, AdaptiveCurveIRM upgradeable via TransparentUpgradeableProxy; ProxyAdmin `owner()` = TimelockController for both USD3 and sUSD3 (verified onchain May 5 2026) |
| Timelock | 24 hours (`getMinDelay() = 86400`, verified onchain) — adequate for monitoring but limited for complex response. The April 2026 incident showed the timelock is a binding constraint when a recovery upgrade is required |
| Privileged roles | Pause, config changes, credit line approval, contract upgrades, debt settlement. EmergencyController v2 (Feb 2026) split emergency role from owner role; OperationalController split (Apr 2026) merged but **not yet executed onchain** |
| Emergency | EmergencyController v2 at `0x84b31b8...` holds `EMERGENCY_AUTHORIZED_ROLE` for the multisig + a Hypernative agent EOA — bypasses 24h timelock for binary stop controls only |

**Subcategory A Score: 3.5/5** — 3/5 multisig with 24h timelock. Per rubric, 3/5 multisig maps to 4 but 24h timelock pulls toward 2–3. The role-separation work since the last assessment (EmergencyController v2 + Hypernative integration) is a real improvement, but the OperationalController split is not yet live, so the auditor's recommendation is still only partially addressed. Net: held at **3.5** (improvement from new tooling offset by the demonstrated criticality of the upgrade path during the April incident).

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Onchain | ERC-4626 share price, interest accruals, loan state tracking — programmatic |
| Offchain | Credit assessment (3CA), borrower approval, repayment posting, credit line sizing — manual/admin |
| PPS | Onchain via ERC-4626, but depends on loan valuations that can be marked down by admin |
| Yearn V3 strategy semantics | `shutdownStrategy()` / `emergencyWithdraw()` / `restartStrategy()` are admin-callable and proved to be load-bearing in April 2026 |

**Subcategory B Score: 4/5** — Significant offchain components are critical to protocol operation. The credit algorithm is a proprietary black box. Admin can mark down loan values, directly affecting USD3 share price, and admin can shut the strategy entirely (with funds emergency-withdrawn but solvent). Hybrid system with substantial manual intervention. Held at 4.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Aave V3 | Critical, blue-chip (held as `waEthUSDC` static-wrapped aToken) |
| Morpho Blue (forked) | Critical, well-audited base but modifications add risk |
| Yearn V3 TokenizedStrategy | Critical — April 2026 incident revealed shutdown semantics couple emergency response to governance upgrades |
| zkTLS / Reclaim / EigenLayer AVS | High criticality, early-stage technologies |
| Hypernative | Medium-High — new runtime trust dependency for automated emergency response |
| Plaid / Credit Karma | Medium, centralized offchain |

**Subcategory C Score: 4/5** — Multiple dependencies including novel, early-stage technologies (zkTLS, EigenLayer AVS, Hypernative) that are critical to either the credit assessment pipeline or the emergency response path. Held at 4.

**Centralization Score = (3.5 + 4 + 4) / 3 = 3.83/5**

**Score: 3.75/5** — Held essentially unchanged. Modest improvements in role separation (EmergencyController v2 + Hypernative) are offset by the demonstration that recovering from a Yearn V3 shutdown is governance-coupled (24h timelock + new reinitializer code).

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | **Not overcollateralized** — USD3 is backed by USDC that is lent out via unsecured credit lines |
| Collateral quality | USDC / `waEthUSDC` (high quality) but lent out without onchain collateral |
| Default protection | Loss waterfall (junior → fund → senior): **sUSD3** junior tranche (~$5.81M supply, ~$6.28M assets) absorbs first, then **Insurance Fund** ~$868K in `waEthUSDC` (verified onchain May 5 2026; previously approximated as "$1M USDC"), then **USD3** senior holders. With ~$6.91M outstanding, sUSD3 alone covers ~91% of the borrow book before the fund or USD3 are touched. |
| Verifiability | Onchain idle reserves verifiable; outstanding loan values partially opaque |

**Subcategory A Score: 4/5** — Held. Insurance fund correction (~$868K vs $1M assumed) does not change the rubric placement. sUSD3 buffer is still meaningful relative to the now-smaller total deposits, but the absolute loss-absorbing capacity has not grown while utilization has.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Aave idle reserves and InsuranceFund `waEthUSDC` are onchain and individually verifiable; outstanding loans tracked onchain but valuation depends on offchain repayment status |
| Reporting mechanism | Onchain ERC-4626 for share price; offchain for credit health and repayment tracking |
| Third-party verification | zkTLS proofs for credit data, but credit algorithm itself is opaque |

**Subcategory B Score: 3.5/5** — Held. The April 2026 incident did not change provability characteristics; PPS remained well-defined onchain throughout.

**Funds Management Score = (4 + 3.5) / 2 = 3.75/5**

**Score: 3.75/5** — Held at 3.75. The unsecured lending model remains the core risk. The insurance fund correction is informational rather than score-moving; the buffer is still meaningful but no larger than at the previous assessment.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Redeem USD3 for USDC from idle reserves. Throttling mechanism exists. **Risk demonstrated April 2026:** when `isShutdown()` flips, redemption via the standard ERC-4626 path is blocked entirely. |
| Liquidity depth | Depends on idle reserves. Currently ~$3.15M idle vs ~$6.91M outstanding (~32% headroom on `totalAssets`). No significant DEX liquidity (TODO: re-verify). |
| Utilization risk | **Up sharply: ~70% (from ~44% in March 2026).** High utilization + the shutdown coupling means idle reserves can fall to ~$120K very quickly — observed for ~7 days in April. |
| Lock periods | sUSD3 has 1-month lock period; sUSD3 supply was approximately flat through the April incident (locks held) |
| Same-value asset | USDC-denominated — lower urgency for exit speed |

**Score: 3.5/5** — Bumped from 3 → 3.5. The April 2026 incident was a real-world demonstration of stress-window redemption failure. The Yearn V3 shutdown semantics make redemption availability a function of (a) credit utilization and (b) governance willingness to keep the strategy live. With idle reserves now at ~$3.15M against ~$8.59M USD3 supply, there is enough headroom for normal flows, but the historical worst-case (idle ≈$120K) is recent enough to be load-bearing in this score. Per template modifier "Throttle mechanisms delaying large exits: +0.5", we'd already be near 3.5; the demonstrated shutdown event holds it there rather than letting same-value asset relief pull it back to 3.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Founder publicly known (Jacob Chudnovsky, ex-Ribbon/Aevo). Rest of team undisclosed |
| Documentation | Good — comprehensive docs, whitepaper, architecture docs. **Gap: no public post-mortem of the April 2026 emergency shutdown found in docs site or audits repo as of May 5, 2026** |
| Funding | $5.2M seed from Paradigm, Coinbase Ventures, and other reputable investors |
| Legal | No publicly disclosed legal entity |
| Incident response | Tested for the first time April 2026: shutdown + emergency withdraw executed cleanly, but recovery required a 24h-timelocked governance upgrade (new `restartStrategy` reinitializer in PR #112). Net read: response works, but is not pre-rehearsed enough to be fast |

**Score: 3.5/5** — Bumped from 3 → 3.5 to reflect the lack of a public post-mortem for a non-trivial onchain event (~7 days of unavailable redemptions). VC backing and doxxed founder remain strengths. Limited team transparency, no disclosed legal entity, and the demonstrated need for governance upgrades during emergency response keep this above the median.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical Track Record | 3.5 | 20% | 0.70 |
| Centralization & Control | 3.75 | 30% | 1.125 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 3.5 | 5% | 0.175 |
| **Final Score** | | | **3.65/5.0 → reported as 3.75/5.0** |

(Raw weighted sum is 3.65; rounded to the nearest 0.25 step used elsewhere in this report yields **3.75/5.0**.)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk (3.75/5.0) — Limited approval, strict limits**

The tier moved from **Medium → Elevated** since the March 2026 assessment, driven by: (1) the demonstrated April 2026 strategy-shutdown stress event with no public post-mortem, (2) ~50% TVL contraction, (3) utilization spiking from 44% → 70%, partially offset by (4) better role separation in EmergencyController v2 + Hypernative integration.

---

## Reassessment Triggers

- **Time-based:** Reassess in 2 months (July 2026) — shorter cadence given Elevated Risk tier and pending OperationalController deployment
- **TVL-based:** Reassess if `USD3.totalAssets()` changes by more than ±30% from the May 2026 baseline of ~$9.93M, or if idle reserves drop below $500K for >24h
- **Shutdown-based:** Reassess on any `USD3.isShutdown() = true` event, with target turnaround <72h
- **Governance-based:** Reassess once OperationalController (PR #111) is deployed onchain — this is a pending governance change with material impact on role separation
- **Incident-based:** Reassess after any borrower default exceeding $500K, any exploit, any further emergency shutdown, or any change to the multisig signer set
- **Default-based:** Reassess if default rate exceeds 5% of outstanding loans, or if the Insurance Fund `waEthUSDC` balance drops by >$100K
- **Audit-based:** Reassess if additional audits are completed or a bug bounty is established (could improve score)
- **Dependency-based:** Reassess if Aave V3, EigenLayer AVS, or Hypernative experience significant security events
- **Phase-based:** Reassess when Phase 1 bootstrapping ends and full unsecured lending is active
- **Post-mortem trigger:** Reassess once 3Jane publishes a public post-mortem of the April 2026 shutdown event (currently absent — TODO)
