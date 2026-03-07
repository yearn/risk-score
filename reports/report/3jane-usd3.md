# Protocol Risk Assessment: 3Jane — USD3

- **Assessment Date:** March 4, 2026
- **Token:** USD3
- **Chain:** Ethereum
- **Token Address:** [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc)
- **Final Score: 3.4/5.0**

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

- **Production time:** USD3 deployed August 25, 2025 (~6 months)
- **TVL:** ~$16.4M (DeFiLlama), with ~$7.2M borrowed
- **Token supply:** ~$20.3M USD3, ~$6.4M sUSD3
- **Security incidents:** None known
- **Peg history:** USD3 is USDC-denominated and redeemable 1:1 from idle reserves; no known depegging events
- **Phase 1 (bootstrapping):** During initial phase, USD3 operates in a "fully risk-off" configuration where funds are only deposited into Aave's USDC market. The unsecured lending component ramps up over time

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
- **Credit-based model:** Borrowing limits are based on off-chain reputation and financial records, not on-chain collateral
- **Default risk:** If borrowers default, losses are absorbed first by sUSD3 (junior tranche), then by the Insurance Fund ($1M USDC), and finally by USD3 holders (senior tranche)
- **Markdown mechanism:** `MarkdownController` gradually reduces the value of defaulted loans from their initial value to zero over time, preventing sharp market shocks
- **No liquidation mechanism** — there is no on-chain collateral to liquidate. Default recovery relies on off-chain legal enforcement via U.S.-based collection agencies

### Default Recovery Process

1. Immediate credit score reduction (slashing 3Jane score)
2. Overdue interest reallocation
3. Markdown: protocol marks down delinquent/defaulted positions to reflect recovery rate
4. Insurance Fund coverage ($1M USDC)
5. NPL Auction: non-performing loans sold to registered U.S. collection agencies via Dutch-style auctions
6. Off-chain legal recovery via credit bureau reporting and regulatory enforcement

### Provability

- **USD3/sUSD3 share prices** are computed on-chain via ERC-4626 standard
- **Outstanding loans and interest accruals** are tracked on-chain in MorphoCredit
- **Credit assessment is off-chain** — the 3CA (3Jane Credit Algorithm) is a proprietary black box. Credit line sizes, default risk rates, and repayment schedules are computed off-chain
- **zkTLS + Reclaim Protocol** provides zero-knowledge proofs of off-chain data (bank statements, credit scores), verified by **EigenLayer AVS** nodes
- **Off-chain data sources:** Plaid (bank data), Credit Karma (credit scores)
- Total reserves cannot be fully verified on-chain because outstanding loan values depend on off-chain repayment status

## Liquidity Risk

- **Primary exit:** Redeem USD3 for USDC from idle reserves in the Aave V3 pool
- **Throttling:** Redemption queue with time-based throttling exists for large withdrawals
- **Utilization risk:** If a high percentage of deposited USDC is lent out to borrowers, idle reserves shrink and redemptions may be delayed
- **Current utilization:** ~$7.2M borrowed out of ~$16.4M TVL (~44% utilization)
- **No DEX liquidity data** readily available for USD3/USDC pairs
- **sUSD3 exit:** Subject to lock period (1 month in Phase 1) plus cooldown mechanism
- **No historical stress test data** — protocol is only ~6 months old

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

**Contracts are upgradeable** — MorphoCredit, CreditLine, and USD3 use proxy patterns. The 3-of-5 multisig can upgrade contract logic after the 24h timelock delay.

**EmergencyController** (source verified, deployed address not publicly documented):

- Has `EMERGENCY_AUTHORIZED_ROLE` that can: pause protocol, set debt cap to 0, stop USD3 deployments to MorphoCredit, stop new deposits
- Can revoke individual borrower credit lines
- Emergency actions bypass the 24h timelock by design (binary stop controls only)

**Privileged roles (from Veridise audit trust model):**

- `ProtocolConfig.owner`: Pauses protocol, sets bounds on grace/delinquency periods, loan sizes, tranche ratios, interest rate configurations
- `CreditLine.owner`: Approves credit lines, posts minimum repayments, settles debt from insurance fund. Can upgrade contracts. All core contracts are upgradeable.

**Auditor noted:** These powerful roles are not sufficiently separated — the same owner role controls both emergency and configuration actions.

### Programmability

- **On-chain:** Interest accruals, share price computation (ERC-4626), loan state tracking, markdown decay — all programmatic
- **Off-chain (critical):** Credit assessment (3CA algorithm), borrower approval, minimum repayment posting, credit line sizing — all require admin intervention
- **PPS (price per share):** Computed on-chain algorithmically via ERC-4626 standard, but the total asset value depends on outstanding loan values which can be marked down by admin
- **Hybrid system:** Automated on-chain mechanics + significant manual off-chain operations

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Aave V3** | Critical | Base yield on idle USDC. Well-audited, blue-chip dependency |
| **Morpho Blue** (forked) | Critical | Core lending logic. Modifications (credit, tranches, markdown) are the novel risk surface |
| **Reclaim Protocol / zkTLS** | High | Off-chain data verification for credit scores and bank data. Novel technology with limited battle-testing |
| **EigenLayer AVS** | High | ZK proof distribution and verification. Early-stage infrastructure |
| **Plaid** | Medium | Bank account data access. Centralized off-chain dependency |
| **Credit Karma** | Medium | VantageScore/FICO data. Centralized off-chain dependency |
| **Yearn V3 Vault** | Low | USD3/sUSD3 vault design pattern. Well-tested |

## Operational Risk

- **Founder:** Jacob Chudnovsky — publicly identified, previously at Ribbon Finance / Aevo. Active on [X/Twitter](https://x.com/_yakovsky)
- **Team:** Only founder is publicly known. Rest of team not disclosed
- **Developed in stealth** before the June 2025 funding announcement
- **Legal entity:** Not publicly disclosed
- **Documentation:** Good — comprehensive docs covering architecture, risks, and developer resources
- **Incident response:** No incidents to date, untested response plan
- **Funding:** $5.2M seed from tier-1 investors (Paradigm, Coinbase Ventures)

## Monitoring

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| USD3 Token (Proxy) | [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc) | Supply changes, large deposits/withdrawals, share price |
| sUSD3 Token (Proxy) | [`0xf689555121e529Ff0463e191F9Bd9d1E496164a7`](https://etherscan.io/address/0xf689555121e529Ff0463e191F9Bd9d1E496164a7) | Supply changes, lock period changes, cooldown events |
| MorphoCredit (Proxy) | [`0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc`](https://etherscan.io/address/0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc) | Borrow/repay events, utilization ratio, new market creation, delinquency/default state changes |
| ProtocolConfig | [`0x6b276A2A7dd8b629adBA8A06AD6573d01C84f34E`](https://etherscan.io/address/0x6b276A2A7dd8b629adBA8A06AD6573d01C84f34E) | Config changes (pause, debt cap, supply cap, tranche ratios) |
| CreditLine | [`0x26389b03298BA5DA0664FfD6bF78cF3A7820c6A9`](https://etherscan.io/address/0x26389b03298BA5DA0664FfD6bF78cF3A7820c6A9) | New credit line approvals, credit line revocations, repayment postings |
| Helper | [`0x82736F81A56935c8429ADdbDa4aEBec737444505`](https://etherscan.io/address/0x82736F81A56935c8429ADdbDa4aEBec737444505) | Borrower interactions |
| AdaptiveCurveIRM | [`0x1d434D2899f81F3C3fdf52C814A6E23318f9C7Df`](https://etherscan.io/address/0x1d434D2899f81F3C3fdf52C814A6E23318f9C7Df) | Rate model parameter changes |
| TimelockController (24h) | [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) | Scheduled/executed/cancelled operations, role changes |
| Multisig (3/5 Safe) | [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef) | Signer/threshold changes, submitted transactions |

**Critical Events to Monitor:**

- Protocol pause/unpause events
- Debt cap or supply cap changes
- New credit line approvals (borrowers being approved)
- Delinquency and default state transitions
- Markdown events on defaulted positions
- USD3/sUSD3 share price deviations
- Insurance Fund balance changes
- Contract upgrades via TimelockController
- Multisig signer/threshold changes
- Large withdrawal requests and redemption queue depth
- Aave V3 USDC utilization (affects idle reserve availability)

## Risk Summary

### Key Strengths

- **Tier-1 backing:** $5.2M seed led by Paradigm, with Coinbase Ventures, Robot Ventures, Wintermute Ventures
- **Solid governance structure:** 3-of-5 multisig with 24h timelock on all non-emergency actions
- **Inherited Morpho Blue security:** Core lending logic based on extensively audited Morpho Blue codebase
- **Dual-tranche protection:** sUSD3 junior tranche + $1M Insurance Fund absorb losses before senior USD3 holders
- **Emergency controls:** Dedicated EmergencyController with binary stop controls for rapid incident response

### Key Risks

- **Unsecured lending model:** Fundamentally higher risk than overcollateralized DeFi lending. Default recovery depends entirely on off-chain legal mechanisms and U.S. collection agencies — novel and untested in DeFi
- **Proprietary credit algorithm:** The 3CA is a black box. Credit decisions are off-chain and opaque. Incorrect credit assessments could lead to systemic defaults
- **No bug bounty program:** Notable absence from Immunefi, Sherlock, and Cantina despite managing $20M+ in user funds
- **Novel off-chain dependencies:** zkTLS/Reclaim Protocol and EigenLayer AVS are early-stage technologies with limited battle-testing
- **Limited team transparency:** Only the founder is publicly known. No disclosed legal entity

### Critical Risks

- **Default contagion:** If multiple borrowers default simultaneously, the sUSD3 junior tranche + $1M Insurance Fund may be insufficient to cover losses, directly impacting USD3 holders
- **Off-chain legal dependency:** Entire default recovery mechanism depends on U.S. legal system, licensed collection agencies, and credit bureau reporting — none of which have been tested at scale in a DeFi context
- **Upgrade risk:** All core contracts are upgradeable via 3/5 multisig + 24h timelock. Anonymous signers. The auditor explicitly recommended splitting roles, which has not been fully implemented
- **Liquidity risk under stress:** If utilization spikes due to high borrowing demand or defaults, USD3 redemptions could face significant delays

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — 3Jane has been audited by Veridise (Aug 2025). Additionally inherits Morpho Blue audits. ✅ PASS
- [ ] **Unverifiable reserves** — Outstanding loan values depend on off-chain repayment status. On-chain reserves (Aave idle) are verifiable, but total asset value including outstanding loans is partially opaque ⚠️ CONDITIONAL PASS
- [x] **Total centralization** — Uses 3/5 multisig with 24h timelock ✅ PASS

**All gates pass (conditional).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | 4 specific audits (Veridise, Sherlock x2, Electisec) with 1 critical + 11 high + 16 medium findings, all fixed. Inherited Morpho Blue audits (OpenZeppelin, Cantina). Certora formal verification present |
| Production history | ~6 months (Aug 2025). TVL ~$16.4M |
| Security incidents | None known |
| Bug bounty | None — notable gap |

**Score: 3/5** — Strong audit coverage with 4 independent security reviews (Veridise, Sherlock x2, Electisec) covering the full codebase. However, the high volume of findings (1 critical, 11 high, 16 medium) indicates significant pre-deployment issues — all resolved but reflecting codebase complexity. Only 6 months in production with moderate TVL (~$16M). No active bug bounty program is a notable gap.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | All core contracts upgradeable via proxy. 3/5 multisig + 24h timelock |
| Timelock | 24 hours — adequate for monitoring but limited for complex response |
| Privileged roles | Significant: pause, config changes, credit line approval, contract upgrades, debt settlement. Auditor noted roles should be split |
| Emergency | EmergencyController can pause/stop protocol immediately (bypasses timelock by design) |

**Subcategory A Score: 3/5** — 3/5 multisig with 24h timelock is reasonable governance. However, contracts are upgradeable, signer identities are anonymous, and the auditor's recommendation to split roles has not been fully implemented. Emergency controller bypass is acceptable for safety but adds centralization.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| On-chain | ERC-4626 share price, interest accruals, loan state tracking — programmatic |
| Off-chain | Credit assessment (3CA), borrower approval, repayment posting, credit line sizing — manual/admin |
| PPS | On-chain via ERC-4626, but depends on loan valuations that can be marked down by admin |

**Subcategory B Score: 4/5** — Significant off-chain components are critical to protocol operation. The credit algorithm is a proprietary black box. Admin can mark down loan values, directly affecting USD3 share price. This is a fundamentally hybrid system with substantial manual intervention.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Aave V3 | Critical, blue-chip |
| Morpho Blue (forked) | Critical, well-audited base but modifications add risk |
| zkTLS / Reclaim / EigenLayer AVS | High criticality, early-stage technologies |
| Plaid / Credit Karma | Medium, centralized off-chain |

**Subcategory C Score: 4/5** — Multiple dependencies including novel, early-stage technologies (zkTLS, EigenLayer AVS) that are critical to the credit assessment pipeline. Failure of these dependencies would compromise the protocol's ability to underwrite new loans.

**Centralization Score = (3 + 4 + 4) / 3 = 3.67/5**

**Score: 3.5/5** — Reasonable multisig + timelock governance structure, but significant centralization in off-chain credit operations, upgradeable contracts with anonymous signers, and heavy reliance on novel off-chain dependencies.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | **Not overcollateralized** — USD3 is backed by USDC that is lent out via unsecured credit lines |
| Collateral quality | USDC (high quality) but lent out without on-chain collateral |
| Default protection | sUSD3 junior tranche (~$6.4M) + Insurance Fund ($1M) absorb losses first |
| Verifiability | On-chain idle reserves verifiable; outstanding loan values partially opaque |

**Subcategory A Score: 4/5** — This is fundamentally an unsecured lending protocol. While the dual-tranche structure and insurance fund provide some loss absorption, there is no on-chain collateral to liquidate in case of default. Recovery depends on off-chain legal mechanisms. The sUSD3 buffer (~$6.4M) provides meaningful first-loss capital relative to current TVL.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Aave idle reserves on-chain; outstanding loans tracked on-chain but valuation depends on off-chain repayment status |
| Reporting mechanism | On-chain ERC-4626 for share price; off-chain for credit health and repayment tracking |
| Third-party verification | zkTLS proofs for credit data, but credit algorithm itself is opaque |

**Subcategory B Score: 3.5/5** — On-chain reserve tracking is decent, but total asset value cannot be fully verified because outstanding loan recovery depends on off-chain borrower repayment. The credit algorithm is a proprietary black box.

**Funds Management Score = (4 + 3.5) / 2 = 3.75/5**

**Score: 3.75/5** — The unsecured lending model is the core risk. While the dual-tranche structure provides meaningful protection, the lack of on-chain collateral and dependence on off-chain recovery mechanisms significantly increase risk.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Redeem USD3 for USDC from idle reserves. Throttling mechanism exists |
| Liquidity depth | Depends on idle reserves (~56% currently not lent out). No significant DEX liquidity |
| Utilization risk | High utilization → reduced redemption availability |
| Lock periods | sUSD3 has 1-month lock period |
| Same-value asset | USDC-denominated — lower urgency for exit speed |

**Score: 3/5** — Redemption from idle reserves works when utilization is moderate (~44% currently). However, during stress periods or high default rates, utilization could spike and idle reserves shrink, creating redemption delays. No meaningful DEX liquidity as fallback. Same-value asset nature and throttling mechanism partially mitigate urgency. sUSD3 lock period restricts junior tranche exits.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Founder publicly known (Jacob Chudnovsky, ex-Ribbon/Aevo). Rest of team undisclosed |
| Documentation | Good — comprehensive docs, whitepaper, architecture docs |
| Funding | $5.2M seed from Paradigm, Coinbase Ventures, and other reputable investors |
| Legal | No publicly disclosed legal entity |
| Incident response | Untested — no incidents to date |

**Score: 3/5** — Strong VC backing and doxxed founder provide some confidence. However, limited team transparency beyond the founder, no disclosed legal entity, and untested incident response are concerns.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical Track Record | 3.0 | 20% | 0.60 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.4/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (3.4/5.0) — Approved with enhanced monitoring**

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (June 2026)
- **TVL-based:** Reassess if TVL changes by more than ±30%
- **Incident-based:** Reassess after any borrower default exceeding $500K, any exploit, or governance change
- **Default-based:** Reassess if default rate exceeds 5% of outstanding loans
- **Audit-based:** Reassess if additional audits are completed or bug bounty is established (could improve score)
- **Dependency-based:** Reassess if Aave V3 or EigenLayer AVS experience significant security events
- **Phase-based:** Reassess when Phase 1 bootstrapping ends and full unsecured lending is active
