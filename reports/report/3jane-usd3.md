# Protocol Risk Assessment: 3Jane — USD3

- **Assessment Date:** March 4, 2026 (Updated: June 11, 2026)
- **Reassessment trigger:** Time-based reassessment (2 months from May 2026). See summary below.
- **Token:** USD3
- **Chain:** Ethereum
- **Token Address:** [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc)
- **Final Score: 3.75/5.0**

> **June 11, 2026 reassessment summary** — score held at **3.75 (Elevated Risk)**. Key changes since May 2026: (1) TVL recovered dramatically — `USD3.totalAssets()` rose from ~$9.93M to ~$27.09M (↑173%), with deposits returned and new capital entering; (2) borrow book grew 3× from ~$6.91M to ~$19.8M, pushing utilization to ~73%; (3) a **new 7-day TimelockController** (`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`) now owns all proxy admins, creating a two-tier governance system (7d for implementation upgrades, 24h for configuration changes) — a partial but material governance hardening; (4) the combined first-loss buffer (Insurance Fund + sUSD3) now covers only ~39% of the borrow book (down from ~103%), representing a material deterioration in relative loss-absorbing capacity; (5) OperationalController (PR [#111](https://github.com/3jane-protocol/moneymarket-contracts/pull/111)) **remains undeployed onchain** despite being merged in the v1.1.4 release. The two-tier timelock improvement (+0.5 governance) was offset by buffer-coverage deterioration (+0.5 collateralization), netting no change to the final score.

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
- [3Jane Introduction](https://paragraph.com/@3jane-protocol/introducing-3jane)
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

### Due Diligence Document Disclosure (protocol-provided, May 2026)

3Jane provided a 15-page "USD3 — Due Diligence Document" (primary contact: Josh Fong, Head of DeFi). It is a useful primary source on design intent, but **several claims could not be reconciled with onchain data or public docs and should be treated with caution:**

- **Incorrect contract addresses.** The DD doc's market/token addresses (USD3, sUSD3, MorphoCredit, Helper, MarkdownController) match onchain, but its **governance and insurance addresses are wrong** — the listed TimelockController, Multisig, EmergencyController, InsuranceFund, and RewardsDistributor addresses do not match the live contracts (e.g. its InsuranceFund `0x45077D8e…9935` has no code and a zero `waEthUSDC` balance, whereas the real fund `0x4507B5B2…9935` holds ~868K). This report uses the **onchain-verified** addresses throughout.
- **Yield split misstated.** The DD doc says USD3/sUSD3 split ~70/30; the public docs and IRM weighting confirm **85/15** (sUSD3 weight 0.15, capped at 15%). This report uses 85/15.
- **Loss-waterfall ordering.** The DD doc places the Insurance Fund ahead of sUSD3 (Step 2, after net yield) — this is **corroborated** by the [debt-write-off docs](https://docs.3jane.xyz/architecture/credit-slasher/debt-write-off) ("first-loss capital … preemptively makes funds whole at default"), so the report's waterfall was corrected to Insurance Fund → sUSD3 → USD3.
- **Unverified off-chain ABF sleeve.** The DD doc describes an Asset-Backed Financing sleeve (SPV bank accounts, multisig-pushed valuations, ~$13M "deploying") not reflected onchain or in public docs — see *Provability*.
- **EmergencyController excluded from audit scope.** The DD doc states the EmergencyController "was added after the audit window," so the four audits do **not** cover it — relevant given it can pause the protocol, zero caps, and revoke credit lines. A claimed audited-vs-deployed code-delta gist is at [gist.github.com/fp-crypto/0c7dd772…](https://gist.github.com/fp-crypto/0c7dd772f20d8867d276d644f0774346).
- **Corroborated governance details:** 3-of-5 Gnosis Safe with **4 of 5 signers on hardware wallets**, anonymous signer identities, yearly rotation; timelock currently 24h with a **stated plan to extend to 7 days**; no protocol-level management or performance fee; target yield SOFR + 300–500 bps.

## Historical Track Record

- **Production time:** USD3 deployed August 25, 2025 (~10 months as of June 2026)
- **TVL:** ~$7.28M idle reserves in MorphoCredit `waEthUSDC`, with ~$19.81M borrowed and ~$27.09M total `USD3.totalAssets()` (sources: [DeFiLlama](https://defillama.com/protocol/3jane) ~$6.2M–$7.2M TVL, onchain `totalAssets()` call June 11, 2026)
- **Token supply:** ~$23.41M USD3 supply (`totalSupply()`), ~$6.10M sUSD3 supply; PPS = `1.157119` USDC/USD3 and `1.096092` USD3/sUSD3 (June 11, 2026)
- **Utilization:** ~$19.81M borrowed / ~$27.09M deposited → ~73% (was ~70% in May 2026, ~44% in March 2026)
- **TVL change since May:** USD3 deposits tripled (`$9.93M → $27.09M`); idle reserves doubled (`$3.15M → $7.28M`); borrowed nearly tripled (`$6.91M → $19.81M`)
- **Security incidents:**
  - **April 18–28, 2026 — emergency shutdown / restart event.** Per merged PR [#112](https://github.com/3jane-protocol/moneymarket-contracts/pull/112) the team had already executed `strategy.shutdownStrategy()` and `strategy.emergencyWithdraw(...)` "in prod" before April 27, 2026. DeFiLlama TVL series confirms idle reserves collapsed from ~$4.78M on Apr 19 to ~$269K on Apr 20 and stayed at $120K–$273K for ~7 days, recovering to ~$2.92M by May 2 and ~$3.15M today. Restoration required deploying a new `USD3.restartStrategy()` reinitializer (PR #112 merged Apr 28, 2026); current onchain state is `isShutdown() = false`. The only public artefact is PR [#112](https://github.com/3jane-protocol/moneymarket-contracts/pull/112) describing the `restartStrategy()` fix.
    - **Protocol's framing (per 3Jane DD document, received May 2026):** 3Jane characterizes the action not as an incident but as operational discipline — "3Jane preemptively withdrew its idle USDC from Aave during the Kelp exploit as a precautionary measure" — and states "no prior security incidents have occurred on the 3Jane protocol." The timing supports the precautionary reading: the [KelpDAO/rsETH bridge exploit](https://governance.aave.com/t/rseth-incident-report-april-20-2026/24580) occurred April 18–20, 2026, exactly when idle reserves collapsed. **However**, the protocol's "no incident / routine precaution" framing partially conflicts with the onchain evidence: a precautionary Aave de-risk would not normally require a full `shutdownStrategy()` + a new `restartStrategy()` reinitializer (a 24h-timelocked code upgrade) to reopen deposits/redemptions. Treat the event as a successfully-handled but non-routine stress episode.
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
- **Redemption:** USD3 is redeemable for USDC **atomically (T+0) against idle reserves** when the protocol's targeted ~15% idle-liquidity buffer is available (per the DD document and [Suppliers docs](https://docs.3jane.xyz/architecture/core-money-market/suppliers), which describe USD3 as a "fully liquid USDC receipt" in Phase 1). A **FIFO redemption queue is described as "under development"** for scenarios where the buffer is fully utilized — i.e. not yet a live throttling mechanism.
- Redemption is atomic only while idle reserves suffice; when the buffer is depleted (as during the April 2026 shutdown, when `isShutdown()` blocked the path entirely) redemptions are delayed. There is no live queue today; instead the protocol can raise borrow rates via the IRM to compel repayment and refill the buffer.

### Collateralization

USD3 is fundamentally different from traditional overcollateralized stablecoins:

- **Not overcollateralized** — USD3 is backed by USDC deposits that are then lent out via unsecured credit lines
- **Credit-based model:** Borrowing limits are based on offchain reputation and financial records, not onchain collateral
- **Default risk / loss waterfall:** For losses on the cryptonative credit sleeve, the **Insurance Fund acts as first-loss capital** — per 3Jane docs ([debt-write-off](https://docs.3jane.xyz/architecture/credit-slasher/debt-write-off)) it "steps in with a `settle()` call that preemptively makes funds whole at the default phase." Beyond the fund's capacity, losses then cascade through the tranche structure: **sUSD3 (junior) absorbs before USD3 (senior)**. Net order: Insurance Fund → sUSD3 → USD3. *(Note: the protocol-provided DD document places net distributable yield ahead of the Insurance Fund as Step 1; that yield cushion is not separately verifiable onchain.)*
- **Insurance Fund:** [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) holds **~868,288 waEthUSDC** — the `waEthUSDC` static-wrapped Aave V3 USDC token at [`0xd4fa2d31b7968e448877f69a96de69f5de8cd23e`](https://etherscan.io/address/0xd4fa2d31b7968e448877f69a96de69f5de8cd23e). The fund is yield-bearing: the underlying `aEthUSDC` accrues Aave interest, and the `waEthUSDC` wrapper reflects this via `convertToAssets`. Current USDC value: **~$1.02M** (June 11, 2026 — up from ~$868K in May due to Aave yield on `waEthUSDC`). The fund has never been topped up with additional deposits beyond the initial seed.
- **Markdown mechanism:** `MarkdownController` ([`0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214`](https://etherscan.io/address/0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214)) gradually reduces the value of defaulted loans from their initial value to zero over time, preventing sharp market shocks
- **No liquidation mechanism** — there is no onchain collateral to liquidate. Default recovery relies on offchain legal enforcement via U.S.-based collection agencies

### Default Recovery Process

Per-loan recovery sequence applied to a defaulted credit line:

1. Immediate credit score reduction (slashing 3Jane score)
2. Overdue interest reallocation
3. Markdown: protocol marks down delinquent/defaulted positions to reflect recovery rate
4. NPL Auction: non-performing loans sold to registered U.S. collection agencies via Dutch-style auctions
5. Offchain legal recovery via credit bureau reporting and regulatory enforcement

Any residual loss after the per-loan recovery above is then absorbed in the **loss waterfall** (see *Collateralization* above):

1. **Insurance Fund** — ~868,288 `waEthUSDC` (≈$1.02M USDC at current `waEthUSDC` rate, June 11 2026); first-loss capital for cryptonative credit/fraud losses via preemptive `settle()` (per [3Jane docs](https://docs.3jane.xyz/architecture/credit-slasher/debt-write-off)). See *Collateralization* for address details.
2. **sUSD3** (junior tranche) — absorbs losses beyond the fund's capacity
3. **USD3** (senior tranche) — impaired only after junior + Insurance Fund are exhausted

### Provability

- **USD3/sUSD3 share prices** are computed onchain via ERC-4626 standard
- **Outstanding loans and interest accruals** are tracked onchain in MorphoCredit
- **Credit assessment is offchain** — the 3CA (3Jane Credit Algorithm) is a proprietary black box. Credit line sizes, default risk rates, and repayment schedules are computed offchain
- **zkTLS + Reclaim Protocol** provides zero-knowledge proofs of offchain data (bank statements, credit scores), verified by **EigenLayer AVS** nodes
- **Offchain data sources:** Plaid (bank data), Credit Karma (credit scores)
- Total reserves cannot be fully verified onchain because outstanding loan values depend on offchain repayment status
- **Claimed off-chain ABF sleeve (unverified — provability concern):** The protocol-provided DD document (May 2026) describes a third yield channel beyond Aave idle and on-chain credit lines — an **Asset-Backed Financing (ABF)** sleeve: forward-flow agreements, warehouse facilities, and participation agreements with U.S. fintech lenders, with capital "held in an SPV bank account before deployment" and **interest "calculated weekly and pushed via the protocol multisig"** into the Yearn V3 `report()` path. The DD doc cites ~$13M asset-backed "deploying" alongside ~$7M cryptonative. **This is not corroborated by the public docs** (the [Suppliers](https://docs.3jane.xyz/architecture/core-money-market/suppliers) page lists yield as Aave + on-chain unsecured only) and **is not reflected onchain** (`totalAssets()` ≈ $27.09M, with no on-chain representation of SPV/off-chain receivables). If active, this introduces a material provability gap: off-chain receivable valuations would be multisig-attested rather than onchain-verifiable, and a misreported `report()` could misprice USD3/sUSD3 PPS. **TODO: confirm whether the ABF sleeve is live and how its valuations are sourced/attested.**

## Liquidity Risk

- **Primary exit:** Redeem USD3 for USDC from idle reserves in the Aave V3 pool
- **Throttling:** No live redemption queue today; a FIFO queue is "under development" (per DD doc). In stressed conditions the protocol raises borrow rates via the IRM to compel repayment and refill the idle buffer.
- **Utilization risk:** If a high percentage of deposited USDC is lent out to borrowers, idle reserves shrink and redemptions may be delayed
- **Current utilization:** ~$19.81M borrowed out of ~$27.09M `totalAssets` (~73% utilization, June 11, 2026) — up from ~70% in May 2026 and ~44% in March 2026
- **Stress event (April 2026):** During the strategy shutdown, Yearn V3 `isShutdown()=true` blocked the standard `deposit/redeem` paths. DeFiLlama-visible idle reserves collapsed from ~$4.78M to ~$269K and stayed depressed for ~7 days before recovering. This is the protocol's first observed liquidity stress event, and it required a contract upgrade (new `restartStrategy()` reinitializer) — a governance action now behind the 7-day timelock — to fully reopen the strategy.
- **DEX liquidity is effectively zero.** Verified onchain June 11, 2026: only one pair exists, a Uniswap V3 USD3/USDC 0.01% pool at [`0x8E12388Ea7366Aa87445d747F83B810aD538a981`](https://etherscan.io/address/0x8E12388Ea7366Aa87445d747F83B810aD538a981) holding dust. No Uniswap V2 USD3/USDC or USD3/WETH pair, no Curve pool. All meaningful exit liquidity is therefore via the protocol's own redemption path against idle reserves.
- **sUSD3 exit:** Subject to lock period (1 month in Phase 1) plus cooldown mechanism. During the April incident, sUSD3 supply was largely unchanged while USD3 supply contracted, which is consistent with senior holders redeeming and junior holders being locked.

## Centralization & Control Risks

### Governance

**Ownership structure:**

All core contracts use a **two-tier TimelockController system** (verified onchain June 11, 2026):

- **TimelockController (7d, upgrades):** [`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`](https://etherscan.io/address/0x3D3C41419Ab401cd25055E8f9421D7D96d887885) — 7-day minimum delay (`getMinDelay() = 604800`). Owns all five ProxyAdmins (USD3, sUSD3, MorphoCredit, ProtocolConfig, AdaptiveCurveIRM). Controls implementation upgrades only. Self-administered.
- **TimelockController (24h, config):** [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) — 24h minimum delay (`getMinDelay() = 86400`). Remains `owner()` of MorphoCredit (proxy), ProtocolConfig (proxy), CreditLine, and MarkdownController. Controls configuration changes. Self-administered.
- **Proposer/Executor/Canceller (both timelocks):** 3-of-5 Gnosis Safe [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef)
- **Safe signers (5 EOAs):**
  - [`0x208662548D73755b4C96a9f7809a035910E55631`](https://etherscan.io/address/0x208662548D73755b4C96a9f7809a035910E55631)
  - [`0x5A519B341962307a98BB196EcFc21b8fa89395D1`](https://etherscan.io/address/0x5A519B341962307a98BB196EcFc21b8fa89395D1)
  - [`0x751A84FCE3dd5161ecC741Da47929337a7e6f64f`](https://etherscan.io/address/0x751A84FCE3dd5161ecC741Da47929337a7e6f64f)
  - [`0xa84Bd17f9efBA6A4dbB631285C689D9E58d56D33`](https://etherscan.io/address/0xa84Bd17f9efBA6A4dbB631285C689D9E58d56D33)
  - [`0x1226858E04b9d077258F153275613734421cD06B`](https://etherscan.io/address/0x1226858E04b9d077258F153275613734421cD06B)
- Signer identities are **not publicly labeled** on Etherscan

**Contracts are upgradeable** — MorphoCredit, USD3, sUSD3, ProtocolConfig, and AdaptiveCurveIRM use TransparentUpgradeableProxy patterns. Each proxy has a dedicated ProxyAdmin whose `owner()` is the **new 7-day TimelockController** (`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`). The 3-of-5 multisig can upgrade contract logic after a **7-day** timelock delay. CreditLine and Helper are standalone (non-proxy) contracts.

**Implementation upgrade history:** USD3 and sUSD3 implementations were upgraded to v1.1.4 between May and June 2026. Current implementations: USD3 → [`0xb606fb370eaaad03d71b49ae5e42aa4aec7458d9`](https://etherscan.io/address/0xb606fb370eaaad03d71b49ae5e42aa4aec7458d9), sUSD3 → [`0x529cbf11ffbc272d63858ca40a2c7f2695712073`](https://etherscan.io/address/0x529cbf11ffbc272d63858ca40a2c7f2695712073).

**EmergencyController v2 — deployed Feb 25, 2026** at [`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051) (verified onchain as the active `ProtocolConfig.emergencyAdmin` and `CreditLine.ozd`). Migrated from `Ownable` to `AccessControlEnumerable` per PR [#109](https://github.com/3jane-protocol/moneymarket-contracts/pull/109), introducing role separation:

- `OWNER_ROLE` (count 1): the 3-of-5 multisig [`0x33333333Bd7045F1A601A1E289D7AB21036fB5EF`](https://etherscan.io/address/0x33333333Bd7045F1A601A1E289D7AB21036fB5EF)
- `EMERGENCY_AUTHORIZED_ROLE` (count 2): the multisig + an EOA [`0x48c59b01af01515e69460b6b5b55e557e914941d`](https://etherscan.io/address/0x48c59b01af01515e69460b6b5b55e557e914941d) — per PR #111 description, this is the **Hypernative monitoring/automation address**. (Identity inferred from PR text "Hypernative + multisig"; not labeled on Etherscan.)
- Capabilities: pause protocol, set debt cap to 0, stop USD3 deployments to MorphoCredit, stop new deposits, revoke individual borrower credit lines. Emergency actions bypass the 24h timelock (binary stop controls only).

**OperationalController (PR [#111](https://github.com/3jane-protocol/moneymarket-contracts/pull/111), merged Apr 29, 2026, included in v1.1.4 release June 5, 2026 — NOT yet wired in onchain):** designed to introduce an additional `OPERATOR_ROLE` for routine credit operations (`setCreditLines`, `closeCycleAndPostObligations`, `addObligationsToLatestCycle`, `settle`) so frequent ops can run via a smaller operational multisig while emergency actions remain on Hypernative + main multisig. As of June 11, 2026, `ProtocolConfig.emergencyAdmin` and `CreditLine.ozd` still resolve to the v2 EmergencyController above — i.e. the role split is **code-complete but not yet executed onchain**.

**Privileged roles (from Veridise audit trust model):**

- `ProtocolConfig.owner` (= 24h TimelockController, behind 3/5 Safe): pauses protocol, sets bounds on grace/delinquency periods, loan sizes, tranche ratios, interest rate configurations, and rotates `emergencyAdmin`.
- `CreditLine.owner` (= 24h TimelockController) and `CreditLine.ozd` (= EmergencyController v2): the latter currently aggregates emergency + operational duties (approving credit lines, posting minimum repayments, settling debt from insurance fund). The pending OperationalController is the planned split.

**Auditor (Veridise) recommendation status:** The original recommendation to split `ProtocolConfig.owner`/`CreditLine.ozd` into separate keys with different delays for emergency vs configuration actions has been **substantially addressed**: the two-tier timelock system (7d for upgrades, 24h for config) directly implements different delays by action type, and the EmergencyController v2 + Hypernative integration handles emergency role separation. The final OperationalController split (PR #111, v1.1.4) is **code-complete but not yet executed onchain**.

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
- **Documentation:** Good — comprehensive docs covering architecture, risks, and developer resources.
- **Incident response:** First real-world test occurred April 18–28, 2026. Team executed `shutdownStrategy()` + `emergencyWithdraw()` and then had to ship new code (`USD3.restartStrategy()` reinitializer in PR #112) before the strategy could be reopened — i.e. the existing v2 `reinitialize()` could not reverse a Yearn V3 shutdown, which is consistent with the runbook in PR #112 stating that "Differs from the v2 multisig pattern". Net read: the team was able to halt and recover, but full recovery required a governance upgrade (now behind the 7-day timelock for upgrades), and idle reserves were depressed (~$120K–$273K) for ~7 days.
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
| TimelockController (24h, config) | [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) | Scheduled/executed/cancelled operations on config contracts (`getMinDelay()` = 86400). Owner of MorphoCredit, ProtocolConfig, CreditLine, MarkdownController. |
| TimelockController (7d, upgrades) | [`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`](https://etherscan.io/address/0x3D3C41419Ab401cd25055E8f9421D7D96d887885) | **New June 2026** — owns all 5 ProxyAdmins (`getMinDelay()` = 604800). Scheduled/executed/cancelled operations for implementation upgrades. Self-administered; multisig holds PROPOSER/EXECUTOR/CANCELLER. |
| Multisig (3/5 Safe) | [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef) | Signer/threshold changes, submitted transactions (threshold = 3, owners unchanged from prior assessment) |
| EmergencyController v2 | [`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051) | Pause/cap/revoke actions, `EMERGENCY_AUTHORIZED_ROLE` membership changes (Hypernative + multisig today) |
| Hypernative agent (EOA) | [`0x48c59b01af01515e69460b6b5b55e557e914941d`](https://etherscan.io/address/0x48c59b01af01515e69460b6b5b55e557e914941d) | Automated emergency calls; nonce/activity spikes |
| InsuranceFund | [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) | `waEthUSDC` balance (currently ≈$1.02M USDC at `waEthUSDC` rate); `bring()` calls (drain to CreditLine) |
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
- Contract upgrades via BOTH TimelockControllers (`CallScheduled` / `CallExecuted` events on `0x1dCcD4...` for config changes and `0x3D3C41...` for implementation upgrades)
- Multisig signer/threshold changes
- `EMERGENCY_AUTHORIZED_ROLE` / `OPERATOR_ROLE` grants/revokes on EmergencyController v2 (and on the future OperationalController once deployed)
- Large withdrawal requests and redemption queue depth
- Aave V3 USDC utilization (affects idle reserve availability)
- DeFiLlama TVL series for 3Jane — sharp idle-reserve drops are an early signal of a strategy shutdown or mass redemption

## Appendix: Contract Architecture

```
 Governance Layer
 ┌─────────────────────────────────────────────────────────────────────┐
 │  3-of-5 Safe  ──owns──►  TimelockController (24h, config changes)   │
 │  0x33333333…              0x1dCcD4628d…                             │
 │                              │                                      │
 │                              ├──owner──► MorphoCredit (proxy)        │
 │                              ├──owner──► ProtocolConfig (proxy)      │
 │                              ├──owner──► CreditLine (non-proxy)      │
 │                              └──owner──► MarkdownController           │
 │                                                                     │
 │  3-of-5 Safe  ──owns──►  TimelockController (7d, upgrades)          │
 │  0x33333333…              0x3D3C4141…  (NEW — June 2026)             │
 │                              │                                      │
 │                              ├──owner──► ProxyAdmin(USD3)  0x41c8…  │
 │                              ├──owner──► ProxyAdmin(sUSD3) 0xecda…  │
 │                              ├──owner──► ProxyAdmin(MorphoCr) 0x0b0…│
 │                              ├──owner──► ProxyAdmin(ProtConf) 0x2c4…│
 │                              └──owner──► ProxyAdmin(IRM)    0x5b79… │
 │                                                                     │
 │  EmergencyController v2  0x84b31b8…  (AccessControlEnumerable)      │
 │   ├─ OWNER_ROLE: 3/5 Safe                                           │
 │   └─ EMERGENCY_AUTHORIZED_ROLE: 3/5 Safe + Hypernative EOA 0x48c5…  │
 │   ⇧ wired in as: ProtocolConfig.emergencyAdmin AND CreditLine.ozd   │
 │                                                                     │
 │  [PENDING] OperationalController (PR #111 merged Apr 29 2026,       │
 │            included in v1.1.4 release but NOT yet executed onchain  │
 │            — would replace EC v2 above and add OPERATOR_ROLE)       │
 └─────────────────────────────────────────────────────────────────────┘

 Token / Vault Layer (Yearn V3 TokenizedStrategy)
 ┌─────────────────────────────────────────────────────────────────────┐
 │  USD3 (proxy)   0x056B269E…   impl 0xb606fb37… (v1.1.4, upgraded)   │
 │     ▲ deposits USDC, mints USD3                                     │
 │     │ shutdownStrategy() / emergencyWithdraw() / restartStrategy()  │
 │     │   ← all admin-callable; April 2026 incident exercised these   │
 │  sUSD3 (proxy)  0xf6895551…   impl 0x529cbf11… (v1.1.4, upgraded)   │
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
 │  InsuranceFund          0x4507B5B2…   ←  ~$1.02M waEthUSDC,         │
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

- The 3-of-5 Safe is the PROPOSER/EXECUTOR/CANCELLER on **both** timelocks. The 24h timelock controls configuration (contract owners, parameter changes); the new 7-day timelock (`0x3D3C4141…`) controls implementation upgrades (all five ProxyAdmins). Both timelocks are self-administered (`DEFAULT_ADMIN_ROLE` held by the timelock itself).
- `EmergencyController v2` bypasses both timelocks for binary stop controls only (pause / set caps to zero / revoke a credit line). Both the multisig and the Hypernative agent EOA can invoke it.
- The CreditLine contract trusts an `ozd` for credit-line approval / repayment posting / debt settlement; today this resolves to EmergencyController v2, which is the same address as `emergencyAdmin`. The pending OperationalController (PR #111) is the planned split.
- The `restartStrategy()` reinitializer added in PR #112 demonstrated that recovery from a Yearn V3 shutdown sits behind the timelock-gated upgrade path — now with the 7-day timelock, worst-case redemption-restart latency is at least 7 days (assuming the upgrade is already coded and ready to schedule).

## Risk Summary

### Key Strengths

- **Tier-1 backing:** $5.2M seed led by Paradigm, with Coinbase Ventures, Robot Ventures, Wintermute Ventures
- **Solid governance structure:** 3-of-5 multisig with **two-tier timelock**: 7-day delay on implementation upgrades (proxy admins), 24h delay on configuration changes (contract owners). Both timelocks are self-administered with the multisig as proposer/executor/canceller. This addresses the Veridise recommendation for different delays by action type.
- **Inherited Morpho Blue security:** Core lending logic based on extensively audited Morpho Blue codebase
- **Dual-tranche protection:** sUSD3 junior tranche (~$6.10M supply, ~$6.68M assets) + Insurance Fund (~$1.02M in `waEthUSDC`) absorb losses before senior USD3 holders
- **Improved emergency tooling:** EmergencyController v2 (deployed Feb 2026) introduces role separation; `EMERGENCY_AUTHORIZED_ROLE` is now held by both the multisig and a Hypernative automation agent for 24/7 monitored response
- **Demonstrated incident response:** Team successfully halted and later restarted the strategy during the April 2026 shutdown event without any loss of funds, share-price (PPS) preservation visible onchain (USD3 PPS = 1.157119 USDC; sUSD3 PPS = 1.096092 USD3 on June 11, 2026)

### Key Risks

- **Unsecured lending model:** Fundamentally higher risk than overcollateralized DeFi lending. Default recovery depends entirely on offchain legal mechanisms and U.S. collection agencies — novel and untested in DeFi
- **Proprietary credit algorithm:** The 3CA is a black box. Credit decisions are offchain and opaque. Incorrect credit assessments could lead to systemic defaults
- **No bug bounty program:** Notable absence from Immunefi, Sherlock, and Cantina despite managing ~$27M of user funds
- **Novel offchain dependencies:** zkTLS/Reclaim Protocol, EigenLayer AVS, and now Hypernative are early-stage technologies / runtime trust deps with limited battle-testing
- **Limited team transparency:** Only the founder is publicly known. No disclosed legal entity.
- **Auditor recommendation only partially addressed:** Veridise asked for a hard split between emergency and configuration roles. EmergencyController v2 split off the emergency role from `Ownable`, but the further `OPERATOR_ROLE` split (PR #111) is merged in code yet **not yet deployed onchain**.
- **EmergencyController outside audit scope:** Per the protocol DD document, the EmergencyController "was added after the audit window" — so the most powerful safety contract (can pause the protocol, zero caps, revoke credit lines, and is partly controlled by a Hypernative hot EOA) is **not covered by any of the four audits**.
- **Unverified off-chain ABF sleeve:** The DD document describes an Asset-Backed Financing sleeve (off-chain receivables in SPV bank accounts, valuations pushed weekly via the multisig into the strategy `report()`). It is not corroborated by public docs or onchain state. If live, it adds an off-chain, multisig-attested valuation dependency that can directly move USD3/sUSD3 PPS — see *Provability*.

### Critical Risks

- **Default contagion:** If multiple borrowers default simultaneously, the sUSD3 junior tranche + ~$1.02M Insurance Fund may be insufficient to cover losses, directly impacting USD3 holders. With ~$19.81M outstanding loans and ~$6.68M sUSD3 assets + ~$1.02M fund, the combined first-loss buffer covers only **~39%** of the borrow book — i.e. once cumulative defaults exceed ~$7.70M (≈39% of outstanding), USD3 senior holders begin to take losses. This is a material deterioration from May 2026 (~103% coverage on a ~$6.91M borrow book).
- **Offchain legal dependency:** Entire default recovery mechanism depends on U.S. legal system, licensed collection agencies, and credit bureau reporting — none of which have been tested at scale in a DeFi context
- **Upgrade risk + Yearn V3 shutdown semantics:** The April 2026 incident showed that recovering from `shutdownStrategy()` required a brand-new `restartStrategy()` reinitializer (PR #112). Future shutdowns may again require timelocked upgrades to fully reopen — a hidden coupling between emergency response and governance.
- **Liquidity risk under stress:** Utilization is now ~73% (up from ~70% in May, ~44% in March). The April 2026 event demonstrated that when the strategy is shut down, idle reserves available for redemption can collapse to near-zero for a week+ window. The new 7-day upgrade timelock means worst-case restart latency from a shutdown is now at least 7 days.
- **TVL concentration:** USD3 deposits have recovered to ~$27M, but the borrow book is now ~3× its May size without proportional buffer growth — the protocol is taking on more credit risk relative to its loss-absorbing capacity.

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
| Production history | ~10 months (Aug 2025 deployment, June 2026 reassessment). TVL ~$27.09M `totalAssets` (~$7.28M idle + ~$19.81M outstanding) — well above the $10M threshold, but the borrow book has grown 3× without proportional first-loss buffer growth |
| Security incidents | One — April 18–28, 2026 emergency shutdown + restart. No reported loss of funds, but ~7 days of effectively unavailable redemptions. |
| Bug bounty | Still none — checked Immunefi, Sherlock, Cantina, SEAL Safe Harbor on June 11, 2026; not listed |

**Score: 3.5/5** — Audit coverage is strong (rubric ≈3 for "3+ audits by top firms" once you count the contest). Historical track record: ~10 months live, TVL recovered to ~$27M (well above $10M threshold), but the protocol experienced its first non-trivial stress event (shutdown) and no bug bounty exists. Net: held at 3.5 — TVL recovery positive, but missing bounty and the residual weight of the April event keep this from improving.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | MorphoCredit, USD3, sUSD3, ProtocolConfig, AdaptiveCurveIRM upgradeable via TransparentUpgradeableProxy. As of June 11, 2026: **all five ProxyAdmins are now owned by a NEW 7-day TimelockController** (`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`), replacing the old 24h timelock for the proxy-admin role. USD3/sUSD3 implementations were upgraded (current impls: USD3 → `0xb606fb370eaaad03d71b49ae5e42aa4aec7458d9`, sUSD3 → `0x529cbf11ffbc272d63858ca40a2c7f2695712073`) |
| Timelock | **Two-tier system** (verified onchain June 11, 2026): (a) **New 7-day TimelockController** at `0x3D3C41419Ab401cd25055E8f9421D7D96d887885` (`getMinDelay() = 604800`) owns all ProxyAdmins — implementation upgrades require 7 days; (b) **Original 24h TimelockController** at `0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2` (`getMinDelay() = 86400`) remains `owner()` of MorphoCredit (proxy), CreditLine, ProtocolConfig, and MarkdownController — configuration changes still require 24h. Both timelocks are self-administered; the 3-of-5 multisig holds PROPOSER + EXECUTOR + CANCELLER on both. This split materially addresses the Veridise recommendation for different delays by action type. |
| Privileged roles | Pause, config changes, credit line approval, contract upgrades, debt settlement. EmergencyController v2 (Feb 2026) split emergency role from owner role; OperationalController split (Apr 2026) merged in v1.1.4 but **still not executed onchain** (`ProtocolConfig.emergencyAdmin` and `CreditLine.ozd` still return `0x84b31b8...`). |
| Emergency | EmergencyController v2 at `0x84b31b8...` holds `EMERGENCY_AUTHORIZED_ROLE` for the multisig + a Hypernative agent EOA — bypasses both timelocks for binary stop controls only |

**Subcategory A Score: 3.0/5** — 3/5 multisig with two-tier timelock: 7-day for implementation upgrades, 24h for configuration changes. The 7-day delay on upgrades is a material hardening relative to the May 2026 state (where everything was behind the 24h delay). Per rubric: 3/5 multisig maps to ~4; the 7-day upgrade delay pulls toward 2 (better), while 24h config delay and pending OperationalController deployment keep this from improving further. Net: moved from 3.5 → **3.0** (two-tier timelock improvement).

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

**Centralization Score = (3.0 + 4 + 4) / 3 = 3.67/5**

**Score: 3.75/5** — Held at 3.75 (subcategory A dropped from 3.5→3.0 on the two-tier timelock improvement, but the composite rounds to the same 3.75 level). The 7-day timelock for upgrades is a real governance hardening; offsetting gravity remains from the OperationalController not being deployed and the demonstrated coupling between emergency recovery and governance upgrades.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | **Not overcollateralized** — USD3 is backed by USDC that is lent out via unsecured credit lines |
| Collateral quality | USDC / `waEthUSDC` (high quality) but lent out without onchain collateral |
| Default protection | Loss waterfall (fund → junior → senior): for cryptonative credit losses the **Insurance Fund** (~$1.02M USDC in `waEthUSDC`, verified onchain June 11, 2026) is first-loss capital via preemptive `settle()`, then the **sUSD3** junior tranche (~$6.10M supply, ~$6.68M assets) absorbs, then **USD3** senior holders. Combined first-loss buffer (~$1.02M + ~$6.68M ≈ $7.70M) covers only **~39%** of the ~$19.81M borrow book before USD3 is touched — down from ~103% in May 2026, as the borrow book grew 3× while the buffer barely grew. |
| Verifiability | Onchain idle reserves verifiable; outstanding loan values partially opaque |

**Subcategory A Score: 4.5/5** — Moved from 4 → 4.5. The first-loss buffer coverage ratio deteriorated materially (103% → 39%) because borrows grew ~3× (`$6.91M → $19.81M`) while sUSD3 and the Insurance Fund grew only modestly. While the absolute buffer increased (~$7.15M → ~$7.70M), the relative protection for senior depositors has weakened substantially.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Aave idle reserves and InsuranceFund `waEthUSDC` are onchain and individually verifiable; outstanding loans tracked onchain but valuation depends on offchain repayment status |
| Reporting mechanism | Onchain ERC-4626 for share price; offchain for credit health and repayment tracking |
| Third-party verification | zkTLS proofs for credit data, but credit algorithm itself is opaque |

**Subcategory B Score: 3.5/5** — Held. The April 2026 incident did not change provability characteristics; PPS remained well-defined onchain throughout.

**Funds Management Score = (4.5 + 3.5) / 2 = 4.0/5**

**Score: 4.0/5** — Moved from 3.75 → 4.0. The unsecured lending model remains the core risk, and the buffer-coverage deterioration (103% → 39%) pushes the collateralization sub-score higher. The provability characteristics are unchanged.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Redeem USD3 for USDC from idle reserves. Throttling mechanism exists. **Risk demonstrated April 2026:** when `isShutdown()` flips, redemption via the standard ERC-4626 path is blocked entirely. |
| Liquidity depth | Depends on idle reserves. Currently ~$7.28M idle vs ~$19.81M outstanding (~27% headroom on `totalAssets`). No DEX liquidity: only Uniswap V3 0.01% pool [`0x8E12388Ea7366Aa87445d747F83B810aD538a981`](https://etherscan.io/address/0x8E12388Ea7366Aa87445d747F83B810aD538a981) exists and holds dust (~$0.001). No Uniswap V2 / Curve pools (verified onchain June 11, 2026). |
| Utilization risk | **~73% (from ~70% in May 2026, ~44% in March 2026).** High utilization + the shutdown coupling means idle reserves can fall to near-zero quickly — observed for ~7 days in April. The new 7-day upgrade timelock extends worst-case restart latency. |
| Lock periods | sUSD3 has 1-month lock period; sUSD3 supply was approximately flat through the April incident (locks held) |
| Same-value asset | USDC-denominated — lower urgency for exit speed |

**Score: 3.5/5** — Held at 3.5. The April 2026 incident was a real-world demonstration of stress-window redemption failure. The Yearn V3 shutdown semantics make redemption availability a function of (a) credit utilization and (b) governance willingness to keep the strategy live. With idle reserves now at ~$7.28M against ~$23.41M USD3 supply (~31% headroom for redemptions), there is adequate buffer for normal flows, but the historical worst-case (idle ≈$120K in April) remains recent. The new 7-day upgrade timelock extends the worst-case restart latency from a shutdown event. Held at 3.5.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Founder publicly known (Jacob Chudnovsky, ex-Ribbon/Aevo). Rest of team undisclosed |
| Documentation | Good — comprehensive docs, whitepaper, architecture docs |
| Funding | $5.2M seed from Paradigm, Coinbase Ventures, and other reputable investors |
| Legal | No publicly disclosed legal entity |
| Incident response | Tested for the first time April 2026: shutdown + emergency withdraw executed cleanly, but recovery required a governance upgrade (new `restartStrategy` reinitializer in PR #112, now behind the 7-day timelock). Net read: response works, but is not pre-rehearsed enough to be fast |

**Score: 3.5/5** — Held at 3.5. VC backing and doxxed founder remain strengths. Limited team transparency, no disclosed legal entity, and the demonstrated need for governance upgrades during emergency response keep this above the median.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical Track Record | 3.5 | 20% | 0.70 |
| Centralization & Control | 3.75 | 30% | 1.125 |
| Funds Management | 4.0 | 30% | 1.20 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 3.5 | 5% | 0.175 |
| **Final Score** | | | **3.725/5.0 → reported as 3.75/5.0** |

(Raw weighted sum is 3.725; rounded to the nearest 0.25 step used elsewhere in this report yields **3.75/5.0**.)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk (3.75/5.0) — Limited approval, strict limits**

The tier remains **Elevated** since the March 2026 assessment. The two-tier timelock improvement (governance) was offset by buffer-coverage deterioration (collateralization). Current drivers: (1) the demonstrated April 2026 strategy-shutdown stress event, (2) borrow book grew 3× without proportional first-loss buffer growth (coverage fell from 103% → 39%), (3) utilization at ~73%, partially offset by (4) the new 7-day timelock for implementation upgrades, (5) TVL recovery to ~$27M, and (6) EmergencyController v2 + Hypernative integration.

---

## Reassessment Triggers

- **Time-based:** Reassess in 2 months (August 2026) — shorter cadence given Elevated Risk tier and pending OperationalController deployment
- **TVL-based:** Reassess if `USD3.totalAssets()` changes by more than ±30% from the June 2026 baseline of ~$27.09M, or if idle reserves drop below $1M for >24h (raised from $500K due to larger scale)
- **Shutdown-based:** Reassess on any `USD3.isShutdown() = true` event, with target turnaround <72h
- **Governance-based:** Reassess once OperationalController (PR #111) is deployed onchain — this is a pending governance change with material impact on role separation
- **Incident-based:** Reassess after any borrower default exceeding $500K, any exploit, any further emergency shutdown, or any change to the multisig signer set
- **Default-based:** Reassess if default rate exceeds 5% of outstanding loans, or if the Insurance Fund `waEthUSDC` balance drops by >$100K
- **Audit-based:** Reassess if additional audits are completed or a bug bounty is established (could improve score)
- **Dependency-based:** Reassess if Aave V3, EigenLayer AVS, or Hypernative experience significant security events
- **Phase-based:** Reassess when Phase 1 bootstrapping ends and full unsecured lending is active

