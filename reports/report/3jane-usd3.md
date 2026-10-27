# Protocol Risk Assessment: 3Jane — USD3

- **Assessment Date:** March 4, 2026 (Updated: October 27, 2026)
- **Token:** USD3
- **Chain:** Ethereum
- **Token Address:** [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc)
- **Snapshot:** Ethereum block [26,285,884](https://etherscan.io/block/26285884) (hash `0x85f5e71bfa59caeb6e93e74be66795719a9b7c3da062d1ae4ba0a4ea2c24bafd`, October 27, 2026 18:36:35 UTC). All onchain figures below are read at this block unless another block is stated.
- **Final Score: 3.79/5.0**

## Overview + Links

3Jane is a **credit-based money market** on Ethereum. It is built as a **modified fork of Morpho Blue** that replaces collateral logic with admin-set credit lines, and it uses the **Yearn V3 tokenized strategy** architecture for its vault contracts. 3Jane's docs describe two credit sleeves behind USD3/sUSD3. **Fintech Credit Conduits (FCC)** are off-chain warehouse loans and forward-flow purchases of U.S. fintech receivables, held through bankruptcy-remote SPVs; the docs call this "the pool's primary backing." **Crypto Credit Lines (CCL)** are unsecured USDC lines to crypto-native borrowers ([Backing overview](https://docs.3jane.xyz/backing/backing.md)).

USD3 deposits sit in one MorphoCredit market, denominated in `waEthUSDC`. Idle reserves earn Aave V3 yield, and the rest is drawn against credit lines. At the snapshot, **~98.8% of the borrow book (~$88.82M of ~$89.91M) is drawn by a single borrower.** That borrower is the 1-of-1 Safe [`0x3Ff3ff33D20a086834A095ed6ed562c9e189291b`](https://etherscan.io/address/0x3Ff3ff33D20a086834A095ed6ed562c9e189291b), and its sole owner is 3Jane's 3-of-5 governance multisig. 3Jane's repository calls it the "protocol-owned origination account" ([moneymarket-contracts `AGENTS.md`](https://github.com/3jane-protocol/moneymarket-contracts/blob/main/AGENTS.md)). Borrowed USDC leaves the chain through EOAs, consistent with the documented FCC flow (off-ramp to 3Jane's Erebor bank account, then wires to originators). The same file states that the third-party CCL program is retired: 75 of 76 borrowers ever issued a line are at zero. Remaining third-party CCL debt is ~$1.09M. **USD3 is now in substance an off-chain asset-backed-finance vehicle, with an onchain senior/junior tranche wrapper.**

**Levered Callable Capital (LCC)** is a separate inbound funding rail. Third parties stake margin and earn standby fees in exchange for an obligation to deposit USDC into USD3 when called. Since the September 25, 2026 USD3 upgrade, both LCC facilities are `supplyCapExempt` and registered as ring-fence conduits, so the funding path is operational. No capital call has been opened through epoch 2, and the `USD3l` cooldown vault is empty.

**USD3** is the **senior tranche**. Users deposit USDC to mint USD3. Idle capital earns baseline yield via the **Aave V3 USDC market** (held as `waEthUSDC`). When the origination account or a CCL borrower draws, funds are withdrawn from Aave and lent at the IRM base rate plus any per-borrower premium. The origination account's premium rate is zero.

**Dual-Tranche Structure:**

- **USD3 (Senior Tranche):** Priority claim on pool income, lower risk, lower yield. ERC-4626 compliant.
- **sUSD3 (Junior/Subordinated Tranche):** First-loss capital at the pool level. Users stake USD3 to mint sUSD3. Higher yield, but it absorbs pool losses before USD3. Withdrawal requires a 30-day cooldown (`cooldownDuration() = 2,592,000`). The onchain lock duration is zero (`lockDuration() = 0`), even though the [Liquidity docs](https://docs.3jane.xyz/usd3-susd3/liquidity.md) still describe a 1-month lock.

**Tranche split:** sUSD3's share of USD3 profit is paid as a USD3 performance fee to sUSD3. It is currently configured at **7.5%** (`TRANCHE_SHARE_VARIANT = 750` in ProtocolConfig; USD3 `performanceFee() = 750`, `performanceFeeRecipient() = sUSD3`). That gives a 92.5/7.5 senior/junior profit split at the snapshot, not the 85/15 split described in earlier 3Jane materials.

**Links:**

- [3Jane Documentation](https://docs.3jane.xyz/)
- [3Jane Backing Overview](https://docs.3jane.xyz/backing/backing.md), [FCC Facilities](https://docs.3jane.xyz/backing/fcc/facilities.md), [FCC Legal Structuring](https://docs.3jane.xyz/backing/fcc/legal-structuring.md), [Banking Rail (Erebor)](https://docs.3jane.xyz/backing/fcc/banking-rail-erebor.md)
- [3Jane Risks](https://docs.3jane.xyz/risks.md)
- [3Jane FCC dashboard](https://app.3jane.xyz/info/pulls/fcc) (self-reported facility data)
- [3Jane App](https://www.3jane.xyz/)
- [3Jane Whitepaper](https://www.3jane.xyz/pdf/whitepaper.pdf)
- [3Jane Introduction](https://paragraph.com/@3jane-protocol/introducing-3jane)
- [LCC (Levered Callable Capital) Introduction](https://docs.3jane.xyz/levered-callable-capital-lcc/introduction)
- [LCC Risks Disclosure](https://docs.3jane.xyz/levered-callable-capital-lcc/risks)
- [Veridise Audit Report](https://github.com/3jane-protocol/audits/blob/main/veridise-audit.pdf)
- [GitHub: moneymarket-contracts](https://github.com/3jane-protocol/moneymarket-contracts)
- [GitHub: audits](https://github.com/3jane-protocol/audits)
- [DefiLlama: 3Jane](https://defillama.com/protocol/3jane)

## Audits and Due Diligence Disclosures

### 3Jane-Specific Audits

| Auditor | Date | Type | Scope | Critical | High | Medium | Low/Info | Status |
|---------|------|------|-------|----------|------|--------|----------|--------|
| [Veridise](https://github.com/3jane-protocol/audits/blob/main/veridise-audit.pdf) (4 analysts, 20 person-days) | Aug 7–18, 2025 | Audit | MorphoCredit, USD3/sUSD3, ProtocolConfig, CreditLine, Helper, MarkdownController, InsuranceFund, IRM | 1 | 2 | 2 | 5 | 6 Fixed, 4 Acknowledged |
| [Sherlock](https://github.com/3jane-protocol/audits/blob/main/sherlock-audit.pdf) (Kirkeelee, mstpr-brainbot) | Aug 4–20, 2025 | Collaborative Audit | MorphoCredit, USD3/sUSD3, CreditLine, Helper, IRM (2 repos: 3jane-morpho-blue + usd3) | 0 | 7 | 5 | 3 | All fixed/acknowledged |
| [Electisec](https://github.com/3jane-protocol/audits/blob/main/electisec-audit.pdf) (Panda, Fede — 10 days, 13 contracts ~2000 LoC) | Oct 18, 2025 | Audit | Full moneymarket + Jane token, RewardsDistributor, PYTLocker | 0 | 1 | 2 | 10 | All fixed/acknowledged |
| [Sherlock 2](https://github.com/3jane-protocol/audits/blob/main/sherlock-2-audit.pdf) (Obsidian lead, ~40 wardens) | Oct 7–17, 2025 | Private Contest | Full moneymarket + USD3/sUSD3 + Jane/PYTLocker/RewardsDistributor | 0 | 1 | 7 | 0 | All fixed/acknowledged |
| [yAudit](https://github.com/3jane-protocol/audits/blob/main/yaudit-usd3-susd3-may-2026-audit.pdf) (Panda, Fedebianlu) | May 26–28, 2026 | Audit | USD3/sUSD3 update (PR #116): `USD3.sol`, `sUSD3.sol`, `ProtocolConfigLib.sol`, `BaseHooksUpgradeable.sol` | 0 | 3 | 5 | 1 | 3/3 High fixed; 3/5 Medium fixed, 2/5 Medium acknowledged (operational mitigation only, not code-fixed) |
| [Guardian](https://github.com/3jane-protocol/audits/blob/main/guardian-lcc-august-2026-audit.pdf) (0xCiphky, Wafflemakr) | Aug 3–26, 2026 | Audit (main + remediation review) | LCC protocol: `LCCVault.sol`, `LCCVaultFactory.sol`, `NotificationVault.sol`, `USD3.sol`, LCC libraries (1,947 SLOC) | 0 | 0 | 20 | 34 | High Confidence (4/5); 12/20 Medium acknowledged, 2 declined, 6 resolved |

**Notable findings across all audits:**

- **V-3JNE-VUL-001 (Veridise Critical):** Funds draining via malicious market creation — attacker could create fake markets with malicious MarkdownManager and CreditLine contracts to drain the MorphoCredit waUSDC wallet. **Fixed** via access control on market creation.
- **Sherlock H-1:** Settlement flow double deduction and incorrect balance clearing — `MorphoCredit` settlement flow contained critical accounting vulnerabilities that could lead to protocol insolvency. **Fixed**.
- **Sherlock H-2 through H-7:** Various high-severity issues across credit line settlement, repayment flows, and balance tracking. **All fixed**.
- **Electisec H-1:** Pendle YT token interests lost during lock period in PYTLocker — locker never claims accrued yield, so YT tokens are worth $0 at expiry. **Feature subsequently removed from codebase**.
- **Sherlock 2 H-1:** Loss of all YT yield accrued due to PYTLocker staleness (same root cause as Electisec H-1). **Fixed**.
- **Veridise H-1/H-2:** Griefing via small donations resetting lock timer; lock period bypass via uncontrolled `startCooldown()`. **Both fixed**.
- **Electisec M-1/M-2:** Cooldown restart allows users to bypass cooldown mechanism; JANE burn mechanism is unfair and gameable. **Acknowledged/Fixed**.
- **yAudit High (×3), all fixed:** (1) an sUSD3-withdrawal timing gap let the senior-tranche deployment cap be computed against post-withdrawal debt without first reclaiming the now-excess Morpho supply, stranding senior liquidity above the live subordination cap (fixed in `bfa8c39`); (2) `USD3.report()` did not refresh Yearn's cached `totalAssets()` after `MorphoCredit.settleAccount()` realized a loss, letting early redeemers exit at a stale, pre-loss share price (fixed in `8ab2d6c`, which adds a live-NAV guard to `availableWithdrawLimit()`); (3) the subordination deployment cap could finish a loss-absorption report above the post-burn backing cap because `_tend()` ran before the sUSD3 burn (fixed in `24c4642`).
- **yAudit Medium, acknowledged (design choice / operational mitigation, not code-fixed):** (1) *"USD3 deposits can capture borrower premiums earned before entry at a stale share price"* — bounded in practice by USD3's profit-unlock period; 3Jane and reviewers regard this as informational rather than a live exploit path. (2) *"Stale borrower markdowns let USD3 redeemers exit at an inflated NAV"* — 3Jane characterizes this as an intentional design tradeoff, mitigated operationally via frequent touches of defaulted borrowers rather than a code change.
- **Guardian LCC (Aug 2026), notable Medium findings (0 High/Critical in either round):** *"Shutdown exits remain coupled to a failed high-utilization Morpho valuation"* (M-11, acknowledged) and *"waUSDC pauses can block willing LCC funders and expose their entire margin to auction"* (M-12, resolved) — both bear on how the LCC facility behaves if the underlying USD3/Morpho position is stressed or Aave's `waUSDC` wrapper is paused.
- **Private audit engagement:** 3Jane has also engaged an independent security researcher for a private review of the LCC facility, separate from the public Guardian engagement above. Scope and findings are not publicly disclosed.

**Veridise auditor recommendations:** Split the `ProtocolConfig.owner` role into separate keys with different delays for emergency vs. configuration actions. Enforce access control on market creation (least privilege approach).

**Total across all 6 public audits:** 1 Critical, 14 High, 41 Medium — all Critical/High findings fixed; remaining findings are fixed or acknowledged.

### Inherited Morpho Blue Audits

The core lending logic is a modified fork of Morpho Blue, which has been extensively audited:

| Auditor | Date | Scope |
|---------|------|-------|
| OpenZeppelin | Sep–Oct 2023 | Morpho Blue & Speed Jump IRM |
| Cantina | Nov 2023 – Mar 2024 | Morpho Blue managed review, IRM, Competition, Periphery, Fixed rate IRM |

**Note:** The inherited audits cover the base Morpho Blue logic. 3Jane's modifications (credit-based lending, tranche system, markdown controller) are the novel risk surface covered by the 6 3Jane-specific audits above.

The source code includes a `/certora` directory indicating formal verification efforts for rate math.

### Bug Bounty

- **Not listed** on Immunefi (`immunefi.com/bug-bounty/3jane` returns 404, checked October 27, 2026), Sherlock, or Cantina
- **Not listed** on [SEAL Safe Harbor](https://safeharbor.securityalliance.org/)
- No active bug bounty program found; the [3Jane audits page](https://docs.3jane.xyz/resources/audits.md) lists no bounty

### Due Diligence Document Disclosure (protocol-provided, May 2026)

3Jane provided a 15-page "USD3 — Due Diligence Document" (primary contact: Josh Fong, Head of DeFi). It is a useful primary source on design intent, but **several claims could not be reconciled with onchain data or public docs and should be treated with caution:**

- **Incorrect contract addresses.** The DD doc's market/token addresses (USD3, sUSD3, MorphoCredit, Helper, MarkdownController) match onchain, but its **governance and insurance addresses are wrong** — the listed TimelockController, Multisig, EmergencyController, InsuranceFund, and RewardsDistributor addresses do not match the live contracts (e.g. its InsuranceFund `0x45077D8e…9935` has no code and a zero `waEthUSDC` balance, whereas the real fund [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) holds ~868K). This report uses the **onchain-verified** addresses throughout.
- **Yield split.** The DD doc says the USD3/sUSD3 split is ~70/30, and earlier public materials said 85/15. Onchain, sUSD3 receives **7.5%** of USD3 profit (`TRANCHE_SHARE_VARIANT = 750`). This report uses the onchain value.
- **Loss-waterfall ordering.** The DD doc places the Insurance Fund ahead of sUSD3 (Step 2, after net yield) — this is **corroborated** by the [debt-write-off docs](https://docs.3jane.xyz/backing/ccl/credit-slasher/debt-write-off.md) ("first-loss capital … preemptively makes funds whole at default"), for the CCL sleeve (Insurance Fund → sUSD3 → USD3). The Insurance Fund is not part of the FCC loss order; see *Collateralization*.
- **Off-chain ABF sleeve, now the dominant use of funds.** The DD doc describes an Asset-Backed Financing sleeve (SPV bank accounts, ~$13M "deploying"). 3Jane's public docs now describe it as the FCC sleeve and "primary backing." Onchain, it appears as the protocol-owned origination account's ~$88.82M draw. The DD doc said interest would be "pushed via the protocol multisig" through `report()`. Onchain, the position instead accrues IRM interest on face debt inside MorphoCredit; see *Provability*.
- **EmergencyController excluded from audit scope.** The DD doc states the EmergencyController "was added after the audit window," so the four audits do **not** cover it — relevant given it can pause the protocol, zero caps, and revoke credit lines. A claimed audited-vs-deployed code-delta gist is at [gist.github.com/fp-crypto/0c7dd772…](https://gist.github.com/fp-crypto/0c7dd772f20d8867d276d644f0774346).
- **Corroborated governance details:** 3-of-5 Gnosis Safe with **4 of 5 signers on hardware wallets**, anonymous signer identities, yearly rotation; timelock currently 24h with a **stated plan to extend to 7 days**; no protocol-level management fee (the USD3 `performanceFee` of 7.5% is the sUSD3 tranche share, paid to sUSD3, not to 3Jane); target yield SOFR + 300–500 bps.

## Historical Track Record

- **Production time:** USD3 deployed August 25, 2025 (~14 months as of October 2026)
- **TVL:** ~$115.00M `USD3.totalAssets()`. That is ~$25.15M idle (21,107,376.67 `waEthUSDC` held by MorphoCredit at `convertToAssets` = 1.191305) plus ~$89.91M outstanding borrows (75,473,269.65 `waEthUSDC` `totalBorrowAssets` in market [`0xc2c3e4b6…0d75`](https://etherscan.io/address/0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc#readProxyContract) — full ID `0xc2c3e4b656f4b82649c8adbe82b3284c85cc7dc57c6dc8df6ca3dad7d2740d75`). [DeFiLlama](https://defillama.com/protocol/3jane) tracks only idle reserves: ~$25.2M on October 27, 2026, after ~$10.5–13.6M through most of October.
- **TVL trend:** `totalAssets()` rose ~44% from ~$80.01M on September 5, 2026. USD3 `Deposit` events total ~$39.18M since then, against ~$5.09M of `Withdraw` events. The growth followed two supply-cap raises: $80M → $100M on September 29 ([tx](https://etherscan.io/tx/0x327f96bc4eff71943f4bb6f05ae9a9d3e0b7dc0266ce22c8af9c6eb2e792b454)) and → $115M on October 26 ([tx](https://etherscan.io/tx/0xbe053d448e1d74373e8db1c7034d5778065c238d720dd594f50d22dae02b6fa1)). It also followed a temporary `supplyCapExempt` list of ~47 depositor addresses between September 25 and October 22, all now revoked; only the two LCC vaults remain exempt.
- **Token supply:** ~96.97M USD3 (`totalSupply()`), ~6.28M sUSD3. PPS = `1.185932` USDC/USD3 (+0.93% since September 5) and `1.122801` USD3/sUSD3 (+0.88%).
- **Utilization:** ~$89.91M borrowed / ~$115.06M market supply → ~78.1%. Utilization was ~84–90% through most of October, before the October 26–27 deposits.
- **Borrower concentration:** the protocol-owned origination account holds 71.543e18 of 72.423e18 borrow shares (**98.8%**), i.e. ~$88.82M. That account already held ~97.4% of borrows (~$65.83M) on September 5, 2026. Its first borrow dates to May 13–14, 2026, and its credit line was 60,000,000 at block 25,741,635 per 3Jane's `AGENTS.md`.
- **Notable events:**
  - **April 18–28, 2026 — strategy shutdown / restart.** Per merged PR [#112](https://github.com/3jane-protocol/moneymarket-contracts/pull/112) the team had already executed `strategy.shutdownStrategy()` and `strategy.emergencyWithdraw(...)` "in prod" before April 27, 2026. DeFiLlama TVL series confirms idle reserves collapsed from ~$4.78M on Apr 19 to ~$269K on Apr 20 and stayed at $120K–$273K for ~7 days, recovering to ~$2.92M by May 2. Restoration required deploying a new `USD3.restartStrategy()` reinitializer (PR #112 merged Apr 28, 2026).
    - **Protocol's framing (per 3Jane DD document, received May 2026):** 3Jane characterizes the action not as an incident but as operational discipline — "3Jane preemptively withdrew its idle USDC from Aave during the Kelp exploit as a precautionary measure" — and states "no prior security incidents have occurred on the 3Jane protocol." The timing supports the precautionary reading: the [KelpDAO/rsETH bridge exploit](https://governance.aave.com/t/rseth-incident-report-april-20-2026/24580) occurred April 18–20, 2026, exactly when idle reserves collapsed. **However**, the protocol's "no incident / routine precaution" framing partially conflicts with the onchain evidence: a precautionary Aave de-risk would not normally require a full `shutdownStrategy()` + a new `restartStrategy()` reinitializer (a 24h-timelocked code upgrade) to reopen deposits/redemptions. Treat the event as a successfully-handled but non-routine stress episode.
  - **July 29 – August 5, 2026 — sharp idle-reserve compression, no shutdown.** Idle `waEthUSDC` held by MorphoCredit fell from ~$9.62M (block near July 29) to ~$2.89M (block near Aug 1) and recovered to ~$9.16M by Aug 5; DeFiLlama's idle-reserve series shows the same pattern at protocol level, bottoming near $3.5M on Aug 1–4 before recovering. Onchain `isShutdown()` was confirmed `false` at all three sampled blocks. Unlike April, this was **not** an emergency shutdown, and no corresponding GitHub incident PR exists. The swing was driven by the protocol-owned origination account. It drew ~$8.2M USDC between July 29 and 31, then returned $7.25M through the Helper on August 4, funded by a $7.14M inflow from the off-chain-facing EOA [`0x95ad969cd40be146d46f0ec05439ab9f515c2c7f`](https://etherscan.io/address/0x95ad969cd40be146d46f0ec05439ab9f515c2c7f). The buffer therefore moves with 3Jane's own off-chain deployment and recall decisions.
  - **September 1, 2026 — Levered Callable Capital (LCC) epoch clock starts.** The factory, beacon, and two facilities were deployed with ~$7.55M standby commitment. See *Levered Callable Capital (LCC)* under Funds Management.
  - **September 25, 2026 — USD3/sUSD3 implementation upgrade.** The upgrade was scheduled on the 7-day timelock on September 18 ([tx](https://etherscan.io/tx/0xf07101d3b936d74e603a53fb0bc9e0ab59ba8188a88339621dff8110ea9dd77c)) and executed September 25 ([tx](https://etherscan.io/tx/0xfe5683b394e9ee06378f87a6df75fd668c1193f14d2af752d7facf19f67b8472)). The new implementation adds the `supplyCapExempt` / `ringFenceConduit` / `ringFencedLiquidity` / `releaseRingFence` integration. Both LCC vaults were enabled as ring-fence conduits the same day ([tx](https://etherscan.io/tx/0xf23f9dbd589a901228db474da0c3544c2ad5a18f845cf76859e1655f4e85a149), [tx](https://etherscan.io/tx/0xee2b3db0e6f2d6b213fe80d77a1fff36d70d85123a4f2756dc6b5da5eccf9a9b)).
  - **September 28 – October 27, 2026 — origination-account credit line raised three times**, to 73.0M, 81.5M, and 94.06M (`waEthUSDC` units), each through the 24h timelock ([latest tx](https://etherscan.io/tx/0x35e5d81652c148750079fceb778239f9b7286eba72f69e3bcef686767150e28b)). Each batch temporarily lifts the global `MAX_CREDIT_LINE` (normally 850,911.12) to the new line, sets the line, raises `DEBT_CAP` to just above total borrows plus the new headroom, then restores `MAX_CREDIT_LINE`. The account drew ~$18.6M on September 30 ([tx](https://etherscan.io/tx/0xb5917dc819f1f44a5ce68afebdd50a154248d2e71dca7f863283c022b656d64c)) and ~$1.8M on October 14 ([tx](https://etherscan.io/tx/0x370cd2a1409a2b85b6be65279a27966270f0f0eb03b738a01104728a2ecfc1d7)).
  - **October 8, 2026 — payment cycles disabled and a JANE redistribution.** `CYCLE_DURATION` was set to `type(uint128).max` ([tx](https://etherscan.io/tx/0xe3377143ee6d36f2db46e84b7be3bcb5c094a31abf0554d7d95b270051254757)), so the market can no longer freeze for a missed cycle close. In a separate batch ([tx](https://etherscan.io/tx/0x05facabacbce50e3803c4cd15973bf45e3e38d098641c53755fb0755f011ab5e)), governance temporarily pointed the JANE token's markdown controller at the timelock, redistributed 639,697.68 JANE from CCL borrower [`0x14FAa112a14b70328D2cA17102aAfE398F0c369c`](https://etherscan.io/address/0x14FAa112a14b70328D2cA17102aAfE398F0c369c) to the multisig, and restored the controller. The borrower had repaid ~424,289 `waEthUSDC` on October 7 and has zero debt. The Insurance Fund balance did not change, so no USD3 loss was recognized.
- **Peg history:** USD3 is USDC-denominated and redeemable from idle reserves; no public depeg event reported. Note that during the April shutdown window, redemptions were effectively unavailable from the Yearn V3 strategy path.
- **Phase 1 (bootstrapping, historical):** At launch USD3 ran "fully risk-off", with funds only in Aave's USDC market. That phase has ended: ~78% of market supply is now drawn, almost all of it by the protocol-owned origination account.

**Funding:** $5.2M seed round (June 2025) led by **Paradigm**, with participation from Coinbase Ventures, Robot Ventures, Wintermute Ventures, Breed VC, and Bodhi Ventures. Andre Cronje listed among backers.

## Funds Management

USD3 assets are deployed through one MorphoCredit market (loan token `waEthUSDC`, credit-line manager = CreditLine):

| Use of funds | Amount (USDC) | Share of `totalAssets` | Evidence |
|---|---|---|---|
| Idle `waEthUSDC` in MorphoCredit (Aave V3) | ~$25.15M | ~21.9% | `waEthUSDC.balanceOf(MorphoCredit)` = 21,107,376.67 |
| Protocol-owned origination account (FCC) | ~$88.82M | ~77.2% | `position(marketId,` [`0x3Ff3ff33D20a086834A095ed6ed562c9e189291b`](https://etherscan.io/address/0x3Ff3ff33D20a086834A095ed6ed562c9e189291b)`)` = 71.543e18 borrow shares |
| Remaining third-party CCL borrowers | ~$1.09M | ~0.9% | residual borrow shares (0.879e18) |

1. **Aave V3 USDC market:** baseline yield on idle capital, and the only onchain redemption liquidity.
2. **Protocol-owned origination account:** a credit line to a 3Jane-controlled Safe, which moves USDC off-chain into FCC facilities. See *Protocol-Owned Origination Account* below.
3. **Legacy CCL credit lines:** unsecured lines to crypto-native borrowers. The program is retired; residual balances are repaying.

**LCC is an inbound funding rail, not a deployment destination.** Its stakers supply new USDC into USD3 when called. Both LCC vaults are now `supplyCapExempt` and registered as ring-fence conduits, so a capital call can deliver capital even when the ordinary supply cap is full. USD3 headroom for non-exempt depositors is zero at the snapshot (`availableDepositLimit()` = 0; `totalAssets()` ≈ $115.00M against the $115M cap).

### Protocol-Owned Origination Account

- **Identity and control:** [`0x3Ff3ff33D20a086834A095ed6ed562c9e189291b`](https://etherscan.io/address/0x3Ff3ff33D20a086834A095ed6ed562c9e189291b) is a Gnosis Safe with threshold 1. Its single owner is 3Jane's 3-of-5 multisig [`0x33333333Bd7045F1A601A1E289D7AB21036fB5EF`](https://etherscan.io/address/0x33333333Bd7045F1A601A1E289D7AB21036fB5EF), so the same signers that govern the protocol also operate the pool's dominant borrower. 3Jane's repository names it the "protocol-owned origination account" ([`AGENTS.md`](https://github.com/3jane-protocol/moneymarket-contracts/blob/main/AGENTS.md)). The account is not listed on 3Jane's [Addresses page](https://docs.3jane.xyz/developers/addresses.md).
- **Credit terms:** credit line 94,063,624.04 `waEthUSDC` (~$112.06M), drawn ~74,556,850 `waEthUSDC` (~$88.82M). `borrowerPremium` rate is **0**, so the account pays only the AdaptiveCurveIRM base rate. `repaymentObligation` is empty. Line increases require the 24h timelock. Draws within the line are executed by the multisig-owned Safe with no timelock. `MorphoCredit._isHealthy` compares the line (stored as position collateral) with borrowed assets in `waEthUSDC` units. The global `DEBT_CAP` is 95,022,415.55 `waEthUSDC` against 75,473,269.65 borrowed. The account can therefore draw a further ~19.5M `waEthUSDC` (**~$23.2M**) without any new governance action, nearly all of the ~$25.15M idle buffer.
- **Flow of funds:** borrowed `waEthUSDC` is redeemed through Aave and the USDC is sent to the Safe. Since May 2026, the Safe has forwarded ~$94.97M of USDC to the EOA [`0x3835350170db8e093576fab23d5b934fbbb9a42e`](https://etherscan.io/address/0x3835350170db8e093576fab23d5b934fbbb9a42e). That EOA forwarded it to [`0x755bc7104b98ea061197be76d1e49fa84e3e702f`](https://etherscan.io/address/0x755bc7104b98ea061197be76d1e49fa84e3e702f) (14 transfers) and [`0x95ad969cd40be146d46f0ec05439ab9f515c2c7f`](https://etherscan.io/address/0x95ad969cd40be146d46f0ec05439ab9f515c2c7f) (12 transfers). Both are EIP-7702-delegated EOAs with no public Etherscan label; the latter has routed >$1.3B of USDC in total. The Safe's history also contains look-alike zero-value transfers (address-poisoning spam); the figures above count only canonical USDC ([`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)).
- **Interpretation:** this path is consistent with 3Jane's [Erebor flow of funds](https://docs.3jane.xyz/backing/fcc/banking-rail-erebor.md): "Capital deposited into 3Jane is converted from stablecoin to USD and parked in 3Jane's Erebor account", then wired to originators. **TODO:** the off-ramp counterparties, the USD balance held at Erebor ("staging"), and the deployed facility principal cannot be verified onchain. A bank or custodian attestation, or the [FCC dashboard](https://app.3jane.xyz/info/pulls/fcc) figures reconciled to the ~$88.82M draw, is needed.
- **Disclosed facilities:** the docs name one live facility, a **$10M LendSwift senior warehouse**. It has a 75% advance rate, a 15% coupon, LendSwift's 25% first-loss equity, a DACA-controlled collection account, a revolving period to May 26, 2027, and final maturity November 26, 2027 ([Facilities](https://docs.3jane.xyz/backing/fcc/facilities.md)). A June 2026 press report also cites an $8.5M whole-loan purchase from Slope ([stock3](https://stock3.com/news/3jane-taps-consumer-and-business-loans-to-expand-defi-yield-sources-17115367)). **TODO:** the remaining ~$70M of the draw is not mapped to any publicly disclosed facility. It may be in Erebor staging, in undisclosed facilities, or both.
- **Operating decisions recorded by 3Jane:** the markdown module "will not be activated." Non-empty repayment obligations are not posted onchain ([operations runbook](https://github.com/3jane-protocol/moneymarket-contracts/blob/main/docs/operations-runbook.md)). Payment cycles were disabled on October 8 (`CYCLE_DURATION = type(uint128).max`). As a result, the onchain market carries no delinquency or default state for the origination account. Its face debt plus IRM interest counts in full in USD3 NAV until governance calls `CreditLine.settle()`.

### Accessibility

- **Minting:** Deposit USDC → receive USD3 at the current PPS. Anyone can mint while supply-cap headroom exists; headroom is zero at the snapshot ($115M cap reached).
- **Staking:** Stake USD3 → receive sUSD3 (junior tranche). Onchain `lockDuration() = 0` and `cooldownDuration() = 30 days`.
- **Redemption:** USD3 is redeemable for USDC **atomically (T+0) against idle reserves** (`availableWithdrawLimit()` = ~$25.15M at the snapshot). The DD document targets a ~15% idle buffer. A **FIFO redemption queue is described as "under development"** and is not live.
- Redemption is atomic only while idle reserves suffice. Beyond the buffer, redemption depends on the origination account repaying, which means 3Jane recalling USD from Erebor staging or from FCC facilities with ~4-month underlying WAL and 12-month revolving periods. The IRM can raise the base rate, but the origination account is 3Jane itself, so the rate is not an external repayment incentive. During the April 2026 shutdown, `isShutdown()` blocked the path entirely.

### Collateralization

USD3 is fundamentally different from traditional overcollateralized stablecoins:

- **No onchain collateral:** about 77% of `totalAssets` is a claim on 3Jane's own origination account. Its repayment capacity rests on off-chain assets: USD at Erebor and senior positions in fintech-receivable SPVs. None of these assets are visible or enforceable onchain.
- **Claimed off-chain credit enhancement (FCC):** for disclosed facilities, 3Jane describes originator first-loss equity (e.g. LendSwift 25%, 1.33x OC), borrowing-base haircuts, reserves and triggers, and DACA control of collections, all ahead of the sUSD3 tranche ([Credit Enhancement & Loss Distribution](https://docs.3jane.xyz/backing/fcc/credit-enhancement-and-loss-distribution.md), [Legal Structuring](https://docs.3jane.xyz/backing/fcc/legal-structuring.md)). These protections are documented by 3Jane only; no third-party attestation or legal documentation is public. **TODO:** facility agreements, SPV entities, and an independent reconciliation of off-chain assets to the ~$88.82M draw.
- **Pool-level loss waterfall:** losses that reach USD3 are absorbed by **sUSD3 (junior) before USD3 (senior)**. The **Insurance Fund** is a CCL-sleeve backstop: 3Jane's [Risks page](https://docs.3jane.xyz/risks.md) lists it as a mitigant for Crypto Credit Lines only, and the FCC loss-order page does not mention it. Order for FCC losses: originator first-loss / OC (off-chain) → sUSD3 → USD3. Order for residual CCL losses: Insurance Fund → sUSD3 → USD3.
- **Insurance Fund:** [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) holds **868,288.86 waEthUSDC** (~$1.03M). The token is the static-wrapped Aave V3 USDC at [`0xd4fa2d31b7968e448877f69a96de69f5de8cd23e`](https://etherscan.io/address/0xd4fa2d31b7968e448877f69a96de69f5de8cd23e). The balance is unchanged since the initial seed and grows only through Aave yield.
- **Onchain first-loss buffer:** sUSD3 holds 7,054,810.26 USD3 (~$8.37M) plus the ~$1.03M fund, ~$9.40M in total. That covers **~10.5%** of the ~$89.91M borrow book.
- **Markdown mechanism inactive:** `MarkdownController` ([`0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214`](https://etherscan.io/address/0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214)) remains wired as `CreditLine.mm()`. However, 3Jane's standing operating decision is not to activate the markdown module and not to post repayment obligations. There is therefore no programmatic write-down path; losses are recognized only when governance calls `CreditLine.settle()`.
- **No liquidation mechanism:** there is no onchain collateral to liquidate. FCC recovery relies on SPV/DACA enforcement against originators. CCL recovery relies on offchain legal enforcement and collection agencies.

### Default Recovery Process

This sequence applies to the residual CCL sleeve (~$1.09M). FCC defaults are handled off-chain inside each facility (haircuts, triggers, originator first-loss, DACA collections) and reach USD3 only through a governance `settle()` on the origination account.

Per-loan recovery sequence applied to a defaulted CCL credit line:

1. Immediate credit score reduction (slashing 3Jane score)
2. Overdue interest reallocation
3. Markdown: protocol marks down delinquent/defaulted positions to reflect recovery rate
4. NPL Auction: non-performing loans sold to registered U.S. collection agencies via Dutch-style auctions
5. Offchain legal recovery via credit bureau reporting and regulatory enforcement

Any residual loss after the per-loan recovery above is then absorbed in the **loss waterfall** (see *Collateralization* above):

1. **Insurance Fund** — 868,288.86 `waEthUSDC` (≈$1.03M USDC, October 27, 2026); first-loss capital for cryptonative credit/fraud losses via preemptive `settle()` (per [3Jane docs](https://docs.3jane.xyz/backing/ccl/credit-slasher/debt-write-off.md)). See *Collateralization* for address details.
2. **sUSD3** (junior tranche) — absorbs losses beyond the fund's capacity
3. **USD3** (senior tranche) — impaired only after junior + Insurance Fund are exhausted

### Provability

- **USD3/sUSD3 share prices** are computed onchain via the ERC-4626 standard
- **Outstanding loans and interest accruals** are tracked onchain in MorphoCredit, but only as face debt plus IRM interest
- **~77% of `totalAssets` is an off-chain claim.** The origination account's ~$88.82M debt is valued onchain at face plus interest. The assets that back it (Erebor USD balances, warehouse advances, whole loans) are reported only through 3Jane's self-published [FCC dashboard](https://app.3jane.xyz/info/pulls/fcc), which offers weekly surveillance, loan tapes "where a facility publishes it," and no third-party attestation. With markdown inactive, no repayment obligations posted, and payment cycles disabled, an off-chain impairment does not move USD3 PPS until governance chooses to call `CreditLine.settle()`. 3Jane's runbook describes bundling `settle()` with `USD3.report()`/`sUSD3.report()` privately to avoid front-running, which confirms that loss recognition is a discretionary admin action.
- **Interest without cash:** the origination account pays only the IRM base rate on face debt. Interest accrues as debt rather than being paid in cash: the account's only repayment since May was $7.25M on August 4. USD3 profit therefore includes accrued interest owed by 3Jane's own account. 3Jane's `AGENTS.md` notes that base interest "mints tranche fee shares with no cash behind them."
- **Credit assessment is offchain:** CCL underwriting (3CA) and FCC facility selection, eligibility, and haircuts are offchain decisions
- **zkTLS + Reclaim Protocol** provides zero-knowledge proofs of offchain data for CCL borrowers (bank statements, credit scores), verified by **EigenLayer AVS** nodes; this pipeline is now relevant only to the ~$1.09M residual CCL book
- **Offchain data sources:** Plaid (bank data), Credit Karma (credit scores) for CCL; originator servicer reports for FCC
- Total reserves cannot be verified onchain: only the ~$25.15M idle `waEthUSDC` and the ~$1.03M Insurance Fund are directly verifiable
- **The ABF / FCC sleeve is live and dominant.** The DD document's Asset-Backed Financing sleeve and the public docs' **Fintech Credit Conduits** describe the same channel: warehouse loans, forward-flow purchases, and participations with U.S. fintech lenders, held through "bankruptcy-remote SPVs that insulate the collateral from the originator and from 3Jane's sponsor entity." The sponsor entity is unnamed; see Operational Risk. The channel does not use a `report()` push. It is wired into MorphoCredit as a credit line to the protocol-owned origination account, so its valuation is the account's face debt. That debt was ~$65.8M on September 5, 2026 and is ~$88.82M now. The provability gap is that the onchain NAV cannot reflect the off-chain assets' performance; it changes only through discretionary `settle()` calls.

### Levered Callable Capital (LCC)

LCC is a leveraged capital-commitment primitive whose deployed facilities began their epoch clock on **September 1, 2026** (`epochConfig().startTimestamp = 1788220800`), audited separately from the core money market by Guardian (Aug 3–26, 2026; 0 High/Critical, 20 Medium, 34 Low/Info — see Audits). It lets third parties ("stakers") post margin against a callable obligation to fund USD3 on demand, in exchange for standby fees. Since the September 25, 2026 USD3 upgrade, the deposit leg into USD3 is enabled, but no call has been opened yet.

**Mechanics (per [3Jane's LCC docs](https://docs.3jane.xyz/levered-callable-capital-lcc/mechanism) and onchain `epochConfig()`/`riskConfig()` reads, October 27, 2026):**

- **Leverage:** stakers post margin at a **7.5% margin ratio** (`marginRatioBps = 750`), i.e. up to **13.33×** standby leverage — a $75,000 margin stake backs up to $1,000,000 of callable standby capital.
- **Epoch structure:** 21-day epochs (`epochLength = 1,814,400s`), each with a 2-day call-decisioning window (`preCallDuration`), a 9-day funding window (`fundingDuration`) once a call is opened, and the remaining time as a 4-day auction window for any missed obligations.
- **Capital calls:** 3Jane (via the `OWNER_ROLE`, held by the 24h TimelockController) can open at most one capital call per epoch, sized up to the total active standby.
- **Default handling:** a staker who misses a funding obligation has their **full margin slashed into an auction pool**; backstop bidders compete in a rising-price Dutch auction (`maxAuctionAwardBps = 10000`, i.e. up to 100% of the missed amount can be awarded), with any unfilled residual absorbed by 3Jane. `slashFeeBps = 0` (no protocol auction fee).
- **Exit:** unstaking requires a 2-epoch delay (`exitDelayEpochs = 2`) and is capped per epoch at 6.67% of the USDC facility (`exitCapBps = 667`, lowered from 2000 on October 27, 2026 — [tx](https://etherscan.io/tx/0xc55899d18e6c34a61268308f9f8c699d381c6566eb14bf3c8d5e6dc270d4a2d3)) and 20% of the USDT facility (`exitCapBps = 2000`). Funded USD3 is additionally locked in a 35-day cooldown vault before it becomes redeemable.
- **Trust model:** the **margin oracle is "fully trusted"** for pricing margin assets into USDC — a per-facility oracle dependency (see External Dependencies). The deployed oracles are feedless ERC-4626 share-rate oracles, so waEthUSDT is priced at USDT = USDC par; 3Jane records this as an accepted risk. 3Jane can also rotate the margin oracle and adjust risk caps. A guardian or owner can `pause()` a facility, only the owner can `unpause()` it, and owner-triggered `shutdown()` is terminal.

**Deployed contracts (Ethereum, verified onchain October 27, 2026):**

| Contract | Address | Role |
|----------|---------|------|
| LCCVaultFactory | [`0x95431c2Fbfe3E0f17a61EF1d7601Eb34aE6cd6ba`](https://etherscan.io/address/0x95431c2Fbfe3E0f17a61EF1d7601Eb34aE6cd6ba) | Deploys/registers official LCCVault facilities; role registry |
| LCCVault — LCC-WAETHUSDC-01 | [`0x8350ba7c69aeADD74b891EFc53F52a0f592aD796`](https://etherscan.io/address/0x8350ba7c69aeADD74b891EFc53F52a0f592aD796) | waEthUSDC-margined facility, $30M protocol commitment cap, $1M per-user cap (raised from $10M on October 20, 2026 — [tx](https://etherscan.io/tx/0xd2746a858b51be86b103f32e1beeb393d0fe50a331a3719eee57c95889eb2470)) |
| LCCVault — LCC-WAETHUSDT-01 | [`0xF4ae98CD6ef156aD87C1f004BBF0cdaB6442042f`](https://etherscan.io/address/0xF4ae98CD6ef156aD87C1f004BBF0cdaB6442042f) | waEthUSDT-margined facility, $5M protocol commitment cap, $1M per-user cap |
| LCC beacon (shared implementation) | [`0xa767a51810644dDc34588cB8392EFd2591350302`](https://etherscan.io/address/0xa767a51810644dDc34588cB8392EFd2591350302) | Owned by the 7-day TimelockController; implementation [`0xf543F3C822b48f833f27e6c41F344012362F1627`](https://etherscan.io/address/0xf543F3C822b48f833f27e6c41F344012362F1627) (unchanged) |
| USD3l — funding cooldown vault | [`0xDF697c55f0D696CA9E3E624cD52d8186C6745904`](https://etherscan.io/address/0xDF697c55f0D696CA9E3E624cD52d8186C6745904) | Holds funded USD3 through the 35-day cooldown before staker claim |
| LCCMarginDepositHelper (v1) | [`0x7C3c37dF5508103Ec0E5eE4B3715f2fB58962c66`](https://etherscan.io/address/0x7C3c37dF5508103Ec0E5eE4B3715f2fB58962c66) | `DEPOSIT_OPERATOR_ROLE` holder; margin deposit entry point |
| LCCMarginDepositHelper (referral version) | [`0x061654840aE779b902D3a4D615De1Ceda4DA01cE`](https://etherscan.io/address/0x061654840aE779b902D3a4D615De1Ceda4DA01cE) | `DEPOSIT_OPERATOR_ROLE` granted October 8, 2026 ([tx](https://etherscan.io/tx/0x18c8fc76d3c994068e1fba2bb2bb9ba512cd158195c2ab1f4248b48ea2e07bdf)); adds an unauthenticated referral event (PR [#139](https://github.com/3jane-protocol/moneymarket-contracts/pull/139)) |
| Margin oracle — waEthUSDC/USDC | [`0xb6F6BAF2532859e8482A89FF75563426417f70fa`](https://etherscan.io/address/0xb6F6BAF2532859e8482A89FF75563426417f70fa) | Fully-trusted price feed for the USDC facility |
| Margin oracle — waEthUSDT/USDC | [`0x6e93B9C9a09aD1Fc1Dd5316b525BFFE1ec3a8b91`](https://etherscan.io/address/0x6e93B9C9a09aD1Fc1Dd5316b525BFFE1ec3a8b91) | Fully-trusted price feed for the USDT facility |

**Current state (onchain, snapshot block):** both facilities are in epoch 2 (`currentEpoch() = 2`) with **no capital call ever opened** (`calledEpochs() = []`), and the `USD3l` cooldown vault is empty (`totalAssets() = 0`). Active standby commitment is **~$10.92M**: ~$9.97M on the USDC facility plus ~$1.70M pending activation, and ~$0.96M on the USDT facility. Posted active margin is **630,896.55 waEthUSDC (~$751.6K)** and **60,965.11 waEthUSDT**. On September 28, 2026, governance used the newly granted `BOUNCER_ROLE` to bounce ~$500K of commitment from staker [`0x66C0d9152209B51977047b9DC3b0B5bf2339b67C`](https://etherscan.io/address/0x66C0d9152209B51977047b9DC3b0B5bf2339b67C) ([tx](https://etherscan.io/tx/0x63db2e600b18e780a7d3ffc5b59e9e56db6cb711d90962e12a259003e8ba4896)).

The LCC funding path is **operational**. USD3 implementation [`0xd1f1c3f485063712873285bf4ef25ab068f13893`](https://etherscan.io/address/0xd1f1c3f485063712873285bf4ef25ab068f13893#code) (verified, upgraded September 25, 2026) exposes `supplyCapExempt`, `ringFenceConduit`, `ringFencedLiquidity`, and `releaseRingFence`. Both LCC vaults return `true` for `supplyCapExempt` and `ringFenceConduit`, and `ringFencedLiquidity() = 0`. A capital call can therefore mint USD3 above the ordinary $115M supply cap. Only a zero supply cap blocks exempt deposits.

**What LCC changes for an ordinary USD3/sUSD3 holder:** LCC is a parallel capital-raising rail. Staker margin sits in the LCC vault contracts, separate from USD3. `LCCVault._deliverWrapped()` deposits received USDC through USD3's `deposit()` and sends the resulting fungible USD3 shares to the `USD3l` cooldown vault. Conduit deposits increase `ringFencedLiquidity`, which is **subtracted from every holder's withdrawal capacity** until management (the 24h timelock) calls `releaseRingFence()`. Per 3Jane's `AGENTS.md`, the ring fence "reserves *pool cash* for the off-chain asset purchases an LCC capital call funds", i.e. it earmarks the new cash for the origination account. Release is an "owner-discipline duty," and "a stale reservation haircuts every unrelated depositor's withdrawal capacity." LCC calls therefore scale the FCC book directly and can temporarily reduce redeemable liquidity for existing holders.

**Unfilled-residual mechanics, confirmed from source:** cross-checking `LCCVault.sol` against the Guardian-audited commit and the live Etherscan-verified beacon implementation (`0xf543f3c822b48f833f27e6c41f344012362f1627`) confirms the "3Jane absorbs any unfilled residual" language has no code path into InsuranceFund, MorphoCredit, CreditLine, or USD3 beyond ordinary deposits. If a capital call goes fully unfilled, USD3 simply never receives that portion of the intended funding — a missed capital raise for 3Jane, not a liability transferred to USD3/sUSD3/the Insurance Fund. Slashed staker margin is split between treasury and the defaulting staker per the auction's fill outcome; existing USD3/sUSD3 holders do not inherit the funding shortfall either way.

## Liquidity Risk

- **Primary exit:** Redeem USD3 for USDC from idle reserves in the Aave V3 pool
- **Throttling:** No live redemption queue; a FIFO queue is "under development" (per DD doc). Refilling the idle buffer beyond third-party CCL repayments requires 3Jane to repay its own origination account from off-chain FCC assets.
- **Utilization risk:** If a high percentage of deposited USDC is lent out, idle reserves shrink and redemptions may be delayed. The origination account's undrawn headroom (~$23.2M) nearly equals today's idle buffer, so 3Jane can drain idle liquidity with no governance action.
- **Current utilization:** ~$89.91M borrowed out of ~$115.06M market supply (~78.1%). Idle `waEthUSDC` is ~$25.15M (~21.9% of `totalAssets`) after the October 26–27 deposits. Through most of October, DeFiLlama's idle series was ~$10.4–13.6M, ~10–12% of `totalAssets`. A pattern recurs: idle reserves spike after a cap raise and are then drawn by the origination account. Idle was ~$29.6–30.4M on September 29–30 and fell to ~$12.2M on October 1 after the $18.6M draw. `isShutdown()` is `false`.
- **Duration mismatch:** the disclosed FCC facility (LendSwift) has a revolving period to May 26, 2027 and final maturity November 26, 2027. Its underlying receivables have a ~124-day WAL. 3Jane's [Liquidity page](https://docs.3jane.xyz/usd3-susd3/liquidity.md) acknowledges that credit assets are "longer-dated than instant redemption" and lists committed liquidity facilities as roadmap only.
- **Stress event (April 2026):** During the strategy shutdown, Yearn V3 `isShutdown()=true` blocked the standard `deposit/redeem` paths. DeFiLlama-visible idle reserves collapsed from ~$4.78M to ~$269K and stayed depressed for ~7 days before recovering. This is the protocol's first observed liquidity stress event, and it required a contract upgrade (new `restartStrategy()` reinitializer) — a governance action now behind the 7-day timelock — to fully reopen the strategy.
- **Compression event (late July – early August 2026), no shutdown:** idle `waEthUSDC` fell from ~$9.62M to ~$2.89M onchain (DeFiLlama's series bottomed near $3.5M) over roughly three days before recovering to ~$9.16M by August 5. `isShutdown()` stayed `false` throughout. The compression came from origination-account draws and a later $7.25M repayment, showing that the idle buffer can fall well under $5M in normal operation at 3Jane's discretion.
- **DEX liquidity:** A Curve frxUSD/USD3 pool exists at [`0x7ba89bc658c07569cfa6d7947adaa80181a24568`](https://etherscan.io/address/0x7ba89bc658c07569cfa6d7947adaa80181a24568) holding **~190,203 USD3 (~$226K)** at the snapshot. A Uniswap V3 USD3/USDC 0.01% pool at [`0x8E12388Ea7366Aa87445d747F83B810aD538a981`](https://etherscan.io/address/0x8E12388Ea7366Aa87445d747F83B810aD538a981) holds dust (1 wei of USD3). No Uniswap V2 pairs exist. Together these provide minimal exit capacity relative to the ~$115M protocol scale; the primary exit path remains direct redemption from idle reserves.
- **sUSD3 exit:** 30-day cooldown (`cooldownDuration() = 2,592,000`); onchain `lockDuration() = 0`.
- **LCC cooldown and ring fence:** any USD3 minted from an LCC capital call is held in the `USD3l` cooldown vault for **35 days** before the funding staker can claim it. The cash it brings in is ring-fenced (`ringFencedLiquidity`) and excluded from every holder's `availableWithdrawLimit` until management releases it, so a call adds deposits without adding redeemable liquidity for existing holders. `ringFencedLiquidity() = 0` at the snapshot; no call has been opened.

## Centralization & Control Risks

### Governance

**Ownership structure:**

All core contracts use a **two-tier TimelockController system** (verified onchain October 27, 2026; no `RoleGranted`/`RoleRevoked` events on either timelock since September 5, 2026):

- **TimelockController (7d, upgrades):** [`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`](https://etherscan.io/address/0x3D3C41419Ab401cd25055E8f9421D7D96d887885) — 7-day minimum delay (`getMinDelay() = 604800`). Owns all five ProxyAdmins (USD3, sUSD3, MorphoCredit, ProtocolConfig, AdaptiveCurveIRM). Controls implementation upgrades only. Self-administered.
- **TimelockController (24h, config):** [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) — 24h minimum delay (`getMinDelay() = 86400`). Remains `owner()` of MorphoCredit (proxy), ProtocolConfig (proxy), CreditLine, and MarkdownController. Controls configuration changes. Self-administered.
- **Proposer/Executor/Canceller (both timelocks):** 3-of-5 Gnosis Safe [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef)
- **Safe signers:** 5 EOAs, anonymous (not publicly labeled). Threshold 3 and the owner set are identical to the September 5, 2026 snapshot.
- **Overlap with the origination account:** the same Safe is the sole owner of the 1-of-1 origination-account Safe [`0x3Ff3ff33D20a086834A095ed6ed562c9e189291b`](https://etherscan.io/address/0x3Ff3ff33D20a086834A095ed6ed562c9e189291b). Governance and the pool's dominant borrower are controlled by the same three-of-five signers.

**Contracts are upgradeable** — MorphoCredit, USD3, sUSD3, ProtocolConfig, and AdaptiveCurveIRM use TransparentUpgradeableProxy patterns. Each proxy has a dedicated ProxyAdmin whose `owner()` is the **new 7-day TimelockController** (`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`). The 3-of-5 multisig can upgrade contract logic after a **7-day** timelock delay. CreditLine and Helper are standalone (non-proxy) contracts.

**Implementation upgrade history:** USD3 and sUSD3 were upgraded to v1.1.4 between May and June 2026. They were upgraded again on September 25, 2026 via the 7-day timelock ([tx](https://etherscan.io/tx/0xfe5683b394e9ee06378f87a6df75fd668c1193f14d2af752d7facf19f67b8472)) to implementations carrying the v1.2 `supplyCapExempt` / ring-fence integration (3Jane release [v1.2.0](https://github.com/3jane-protocol/moneymarket-contracts/releases/tag/v1.2.0), September 15, 2026). Current implementations, both Etherscan-verified: USD3 → [`0xd1f1c3f485063712873285bf4ef25ab068f13893`](https://etherscan.io/address/0xd1f1c3f485063712873285bf4ef25ab068f13893#code), sUSD3 → [`0x6093d95f6c102163d19f5681e7d84997060bbaed`](https://etherscan.io/address/0x6093d95f6c102163d19f5681e7d84997060bbaed#code). MorphoCredit ([`0xb326c390a607b4317a1d205dff4afb1a42ca7157`](https://etherscan.io/address/0xb326c390a607b4317a1d205dff4afb1a42ca7157#code)), ProtocolConfig ([`0x64bc68ea388e42c73747668122eee3a5bfb70b98`](https://etherscan.io/address/0x64bc68ea388e42c73747668122eee3a5bfb70b98#code)), and AdaptiveCurveIRM ([`0xdced1a6264a598d3fc07a4b502d1e06a0d210627`](https://etherscan.io/address/0xdced1a6264a598d3fc07a4b502d1e06a0d210627)) implementations are unchanged since September 5. USD3 `management()` is the 24h timelock, and `keeper()` is the KeeperRelayer [`0xc22158100B823e1Ef612fBA265941efE9E7d7975`](https://etherscan.io/address/0xc22158100B823e1Ef612fBA265941efE9E7d7975).

**EmergencyController v2 — deployed Feb 25, 2026** at [`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051) (verified onchain as the active `ProtocolConfig.emergencyAdmin` and `CreditLine.ozd`). Migrated from `Ownable` to `AccessControlEnumerable` per PR [#109](https://github.com/3jane-protocol/moneymarket-contracts/pull/109), introducing role separation:

- `OWNER_ROLE` (count 1): the 3-of-5 multisig [`0x33333333Bd7045F1A601A1E289D7AB21036fB5EF`](https://etherscan.io/address/0x33333333Bd7045F1A601A1E289D7AB21036fB5EF)
- `EMERGENCY_AUTHORIZED_ROLE` (count 2): the multisig + an EOA [`0x48c59b01af01515e69460b6b5b55e557e914941d`](https://etherscan.io/address/0x48c59b01af01515e69460b6b5b55e557e914941d) — per PR #111 description, this is the **Hypernative monitoring/automation address**. (Identity inferred from PR text "Hypernative + multisig"; not labeled on Etherscan.)
- Capabilities: pause protocol, set debt cap to 0, stop USD3 deployments to MorphoCredit, stop new deposits, revoke individual borrower credit lines. Emergency actions bypass the 24h timelock (binary stop controls only).

**OperationalController (PR [#111](https://github.com/3jane-protocol/moneymarket-contracts/pull/111), merged Apr 29, 2026, included in v1.1.4 release June 5, 2026 — NOT yet wired in onchain):** designed to introduce an additional `OPERATOR_ROLE` for routine credit operations (`setCreditLines`, `closeCycleAndPostObligations`, `addObligationsToLatestCycle`, `settle`) so frequent ops can run via a smaller operational multisig while emergency actions remain on Hypernative + main multisig. As of October 27, 2026, `ProtocolConfig.emergencyAdmin` and `CreditLine.ozd` still resolve to the v2 EmergencyController above — i.e. the role split is **code-complete but not yet executed onchain**.

**Privileged roles (from Veridise audit trust model):**

- `ProtocolConfig.owner` (= 24h TimelockController, behind 3/5 Safe): pauses protocol, sets bounds on grace/delinquency periods, loan sizes, tranche ratios, interest rate configurations, and rotates `emergencyAdmin`.
- `CreditLine.owner` (= 24h TimelockController) and `CreditLine.ozd` (= EmergencyController v2): `CreditLine` lets either set credit lines, post obligations, and call `settle()`. However, EmergencyController v2's verified ABI forwards only `emergencyRevokeCreditLine` and `setConfig`, so credit-line increases, obligation posting, and settlement run through the 24h timelock in practice. The pending OperationalController is the planned split for routine operations. All origination-account line changes since September were executed by the 24h timelock.
- **Global caps are not binding on governance:** `MAX_CREDIT_LINE` (850,911.12) is lifted and restored inside the same timelock batch whenever the origination account's line is raised. The effective constraint on that account is therefore the 24h delay, not the configured cap.

**Auditor (Veridise) recommendation status:** The original recommendation to split `ProtocolConfig.owner`/`CreditLine.ozd` into separate keys with different delays for emergency vs configuration actions has been **substantially addressed**: the two-tier timelock system (7d for upgrades, 24h for config) directly implements different delays by action type, and the EmergencyController v2 + Hypernative integration handles emergency role separation. The final OperationalController split (PR #111, v1.1.4) is **code-complete but not yet executed onchain**, unchanged as of October 27, 2026.

**LCC governance (verified onchain October 27, 2026):** the `LCCVaultFactory` largely reuses the existing trust model but adds one new privileged key:

- `OWNER_ROLE` (count 1): the 24h TimelockController — parameter/risk-cap changes, same governance path as the rest of the protocol.
- `GUARDIAN_ROLE` (count 2): the 3-of-5 multisig + the Hypernative EOA [`0x48c59b01Af01515E69460B6B5b55E557E914941d`](https://etherscan.io/address/0x48c59b01Af01515E69460B6B5b55E557E914941d) — pause-only, same holders as `EMERGENCY_AUTHORIZED_ROLE` on EmergencyController v2.
- `DEPOSIT_OPERATOR_ROLE` (count 2): the original `LCCMarginDepositHelper` and the referral-version helper [`0x061654840aE779b902D3a4D615De1Ceda4DA01cE`](https://etherscan.io/address/0x061654840aE779b902D3a4D615De1Ceda4DA01cE). Both are self-only margin-deposit entry points.
- `LISTER_ROLE` (count 1): a single EOA, [`0x485828f6373c5FB1aA1DD8A58D6A6E7803fC5b15`](https://etherscan.io/address/0x485828f6373c5FB1aA1DD8A58D6A6E7803fC5b15) — **held directly by an EOA, not gated by the multisig or a timelock**. It can set and clear per-depositor caps, controlling who may enter/top up and at what size; only `OWNER_ROLE` can create vaults. It cannot move deposited margin.
- `BOUNCER_ROLE` (count 1): the 24h TimelockController, granted September 26, 2026 ([tx](https://etherscan.io/tx/0xc80c6a7835b2bff2395acde862c0cb575d863c30721752e5d2929b1dde4ea3de)). It can reduce a staker's active commitment and return the paired margin, bypassing ordinary exit timing and caps. It was used once, on September 28, 2026 (~$500K).
- The beacon controlling both vaults' shared implementation ([`0xa767a51810644dDc34588cB8392EFd2591350302`](https://etherscan.io/address/0xa767a51810644dDc34588cB8392EFd2591350302)) is owned by the same 7-day TimelockController as the core proxies — upgrade risk is symmetric with the rest of the protocol.
- Each vault's `assetConfig().treasury` is the 3-of-5 multisig directly (not a separate treasury contract) — auction fees and treasury-allocated surplus accrue to the multisig.

### Programmability

- **Onchain:** Interest accruals, share price computation (ERC-4626), and loan state tracking are programmatic. Markdown decay exists in code but is deliberately not activated.
- **Offchain (critical):** FCC facility selection, off-ramping, wires, collections, and valuation run through 3Jane's Erebor account and SPVs. CCL underwriting (3CA), credit-line sizing, and settlement are admin actions.
- **Custodial deployment:** ~77% of `totalAssets` is drawn by a Safe controlled by the governance multisig and moved off-chain. Draws within the credit line need no timelock.
- **PPS (price per share):** computed onchain via ERC-4626, but it reflects the origination account's face debt plus IRM interest. Losses on the off-chain assets reach PPS only when governance calls `CreditLine.settle()`, which in effect makes NAV admin-attested for the dominant asset.

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Aave V3** | Critical | Base yield on idle USDC (held as `waEthUSDC` static-wrapped Aave aToken). Well-audited, blue-chip dependency |
| **Morpho Blue** (forked) | Critical | Core lending logic. Modifications (credit, tranches, markdown) are the novel risk surface |
| **Yearn V3 TokenizedStrategy** | Critical | USD3 is a Yearn V3 tokenized strategy proxy; `shutdown`/`emergencyWithdraw`/`reinitializer(...)` semantics on `StrategyData` storage slots are load-bearing — see April 2026 incident which required a `restartStrategy()` reinitializer to clear the shutdown flag (PR #112) |
| **FCC originators / SPVs** (e.g. LendSwift) | Critical | ~77% of `totalAssets` relies on off-chain originator performance, servicing, SPV bankruptcy remoteness, and DACA enforcement. Only one $10M facility is publicly documented |
| **Erebor (banking rail)** | Critical | Holds 3Jane's USD staging balance and settles all FCC wires and collections ([docs](https://docs.3jane.xyz/backing/fcc/banking-rail-erebor.md)). Single bank dependency for the dollar leg; balances unverifiable onchain |
| **Reclaim Protocol / zkTLS** | Medium (CCL only) | Offchain data verification for credit scores and bank data. Novel technology with limited battle-testing |
| **EigenLayer AVS** | Medium (CCL only) | ZK proof distribution and verification for the ~$1.09M residual CCL book. Early-stage infrastructure |
| **Hypernative** | Medium-High | Automated monitoring + emergency response (one of two `EMERGENCY_AUTHORIZED_ROLE` holders on EmergencyController v2, and `GUARDIAN_ROLE` on LCCVaultFactory). New runtime trust dependency; failure mode is a missed-or-malicious automated pause |
| **LCC (Levered Callable Capital)** | Low today; monitor | Funding path operational since September 25, 2026 (both vaults `supplyCapExempt` + ring-fence conduits). ~$10.92M active standby, **$0 called** through epoch 2. A call would mint USD3 above the supply cap and ring-fence the cash for the origination account |
| **Margin oracles (waEthUSDC/USDC, waEthUSDT/USDC)** | Low (confined to LCC) | "Fully trusted" per 3Jane's own LCC risk disclosure — prices *staker margin* for slashing/auction/standby sizing within LCC. Does not price USD3/sUSD3 itself and has no direct read-path into USD3 share price |
| **Plaid** | Low (CCL only) | Bank account data access. Centralized offchain dependency |
| **Credit Karma** | Low (CCL only) | VantageScore/FICO data. Centralized offchain dependency |

## Operational Risk

- **Founder:** Jacob Chudnovsky — publicly identified, previously at Ribbon Finance / Aevo. Active on [X/Twitter](https://x.com/_yakovsky)
- **Team:** Only founder is publicly known. Rest of team not disclosed
- **Developed in stealth** before the June 2025 funding announcement
- **Legal entity:** Not publicly disclosed. 3Jane's own docs refer only to an unnamed "3Jane's sponsor entity" in the context of bankruptcy-remote SPVs for offchain financing (see Fintech Credit Conduits under Provability); no Delaware or other jurisdiction filing, LLC/Inc. name, or registered agent could be found in public searches as of October 27, 2026.
- **Documentation:** Detailed on mechanics: architecture, FCC structure, LCC risk disclosures, and an unusually candid public operations runbook and `AGENTS.md`. Disclosure of the dominant position is weak, however. The protocol-owned origination account is absent from the [Addresses page](https://docs.3jane.xyz/developers/addresses.md), which also still lists a superseded Helper. Only one $10M FCC facility is documented against an ~$88.82M draw.
- **Incident response:** First real-world test occurred April 18–28, 2026. Team executed `shutdownStrategy()` + `emergencyWithdraw()` and then had to ship new code (`USD3.restartStrategy()` reinitializer in PR #112) before the strategy could be reopened — i.e. the existing v2 `reinitialize()` could not reverse a Yearn V3 shutdown, which is consistent with the runbook in PR #112 stating that "Differs from the v2 multisig pattern". Net read: the team was able to halt and recover, but full recovery required a governance upgrade (now behind the 7-day timelock for upgrades), and idle reserves were depressed (~$120K–$273K) for ~7 days. No second shutdown has occurred since; the late-July/early-August idle-reserve compression (see Historical Track Record) resolved without invoking emergency powers.
- **Funding:** $5.2M seed from tier-1 investors (Paradigm, Coinbase Ventures)

## Monitoring

### Key Contracts (Ethereum)

| Contract | Address | Monitor |
|----------|---------|---------|
| USD3 Token (Proxy) | [`0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc`](https://etherscan.io/address/0x056B269Eb1f75477a8666ae8C7fE01b64dD55eCc) | Supply changes, large deposits/withdrawals, share price, `availableWithdrawLimit()`, `supplyCapExempt` / `ringFenceConduit` changes, `RingFencedLiquidityIncreased` and `releaseRingFence` |
| sUSD3 Token (Proxy) | [`0xf689555121e529Ff0463e191F9Bd9d1E496164a7`](https://etherscan.io/address/0xf689555121e529Ff0463e191F9Bd9d1E496164a7) | Supply and `totalAssets` changes (junior buffer), lock/cooldown changes, loss burns on `report()` |
| MorphoCredit (Proxy) | [`0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc`](https://etherscan.io/address/0xDe6e08ac208088cc62812Ba30608D852c6B0EcBc) | Borrow/repay events, utilization ratio, `totalSupplyAssets` drops (settlement write-downs), new market creation, `setFee` (must stay 0 per 3Jane's M-04 precondition) |
| ProtocolConfig (Proxy) | [`0x6b276A2A7dd8b629adBA8A06AD6573d01C84f34E`](https://etherscan.io/address/0x6b276A2A7dd8b629adBA8A06AD6573d01C84f34E) | `setConfig` for `USD3_SUPPLY_CAP` (115M), `DEBT_CAP` (95.02M `waEthUSDC`), `MAX_CREDIT_LINE` (850,911.12; temporarily raised inside line-increase batches), `TRANCHE_SHARE_VARIANT` (750), `MIN_SUSD3_BACKING_RATIO` (0), `CYCLE_DURATION` (uint128 max), `IS_PAUSED` |
| CreditLine | [`0x26389b03298BA5DA0664FfD6bF78cF3A7820c6A9`](https://etherscan.io/address/0x26389b03298BA5DA0664FfD6bF78cF3A7820c6A9) | `setCreditLines` (any third-party line re-arms 14 dormant audit findings per 3Jane), `settle()` calls (the only loss-recognition path), repayment postings |
| Helper (live, `MorphoCredit.helper()`) | [`0x2A66F992bF227D2e50eF19EDD21503C3c4F3f682`](https://etherscan.io/address/0x2A66F992bF227D2e50eF19EDD21503C3c4F3f682) | Borrower borrow/repay routing. 3Jane's Addresses page still lists the superseded [`0x82736F81A56935c8429ADdbDa4aEBec737444505`](https://etherscan.io/address/0x82736F81A56935c8429ADdbDa4aEBec737444505) |
| Origination account (1-of-1 Safe) | [`0x3Ff3ff33D20a086834A095ed6ed562c9e189291b`](https://etherscan.io/address/0x3Ff3ff33D20a086834A095ed6ed562c9e189291b) | **Highest priority.** `Borrow`/`Repay` events, outflows of USDC, `SetCreditLine` changes, owner/threshold changes, and borrow-share share of the market (98.8% today) |
| Off-ramp EOA | [`0x3835350170db8e093576fab23d5b934fbbb9a42e`](https://etherscan.io/address/0x3835350170db8e093576fab23d5b934fbbb9a42e) | USDC inflows from the origination account and onward transfers |
| AdaptiveCurveIRM (Proxy) | [`0x1d434D2899f81F3C3fdf52C814A6E23318f9C7Df`](https://etherscan.io/address/0x1d434D2899f81F3C3fdf52C814A6E23318f9C7Df) | Rate model parameter changes |
| TimelockController (24h, config) | [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) | Scheduled/executed/cancelled operations on config contracts (`getMinDelay()` = 86400). Owner of MorphoCredit, ProtocolConfig, CreditLine, MarkdownController. |
| TimelockController (7d, upgrades) | [`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`](https://etherscan.io/address/0x3D3C41419Ab401cd25055E8f9421D7D96d887885) | Owns all 5 ProxyAdmins and the LCC beacon (`getMinDelay()` = 604800). Scheduled/executed/cancelled operations for implementation upgrades. Self-administered; multisig holds PROPOSER/EXECUTOR/CANCELLER. |
| Multisig (3/5 Safe) | [`0x33333333bd7045f1a601a1e289d7ab21036fb5ef`](https://etherscan.io/address/0x33333333bd7045f1a601a1e289d7ab21036fb5ef) | Signer/threshold changes, submitted transactions (threshold = 3) |
| EmergencyController v2 | [`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051) | Pause/cap/revoke actions, `EMERGENCY_AUTHORIZED_ROLE` membership changes (Hypernative + multisig today) |
| Hypernative agent (EOA) | [`0x48c59b01af01515e69460b6b5b55e557e914941d`](https://etherscan.io/address/0x48c59b01af01515e69460b6b5b55e557e914941d) | Automated emergency calls; nonce/activity spikes |
| InsuranceFund | [`0x4507B5B23340D248457d955a211C8B0634D29935`](https://etherscan.io/address/0x4507B5B23340D248457d955a211C8B0634D29935) | `waEthUSDC` balance (currently ≈$1.03M USDC at `waEthUSDC` rate); `bring()` calls (drain to CreditLine) |
| MarkdownController | [`0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214`](https://etherscan.io/address/0xF0eaE71092F3c9411A9EAb8F81E7d91D29726214) | `setEnableMarkdown` for any borrower (activation would reverse the standing decision); JANE redistributions |
| LCCVaultFactory | [`0x95431c2Fbfe3E0f17a61EF1d7601Eb34aE6cd6ba`](https://etherscan.io/address/0x95431c2Fbfe3E0f17a61EF1d7601Eb34aE6cd6ba) | Vault creation (`OWNER_ROLE`); depositor-cap changes (`LISTER_ROLE`); role membership, default-cap, and pending-owner changes |
| LCCVault — LCC-WAETHUSDC-01 | [`0x8350ba7c69aeADD74b891EFc53F52a0f592aD796`](https://etherscan.io/address/0x8350ba7c69aeADD74b891EFc53F52a0f592aD796) | Capital call openings, funding shortfalls/slashes, auction outcomes, standby/margin totals |
| LCCVault — LCC-WAETHUSDT-01 | [`0xF4ae98CD6ef156aD87C1f004BBF0cdaB6442042f`](https://etherscan.io/address/0xF4ae98CD6ef156aD87C1f004BBF0cdaB6442042f) | Capital call openings, funding shortfalls/slashes, auction outcomes, standby/margin totals |
| Margin oracles (waEthUSDC, waEthUSDT) | [`0xb6F6BAF2532859e8482A89FF75563426417f70fa`](https://etherscan.io/address/0xb6F6BAF2532859e8482A89FF75563426417f70fa), [`0x6e93B9C9a09aD1Fc1Dd5316b525BFFE1ec3a8b91`](https://etherscan.io/address/0x6e93B9C9a09aD1Fc1Dd5316b525BFFE1ec3a8b91) | Oracle rotation (24h timelock), reported price sanity |
| USD3l (LCC cooldown vault) | [`0xDF697c55f0D696CA9E3E624cD52d8186C6745904`](https://etherscan.io/address/0xDF697c55f0D696CA9E3E624cD52d8186C6745904) | USD3 balance changes (first inflow marks the first funded capital call) |

**Critical Events to Monitor:**

- Protocol pause/unpause events
- `USD3.isShutdown()` flips (the April 2026 incident was visible here days before the protocol publicly acknowledged it)
- Debt cap or supply cap changes
- New credit line approvals (borrowers being approved)
- Origination-account draws, repayments, and credit-line increases; borrower-share concentration
- `CreditLine.settle()` and any drop in MorphoCredit `totalSupplyAssets` (loss recognition)
- Any non-empty `closeCycleAndPostObligations` / repayment-obligation posting or markdown enablement (would reverse 3Jane's standing decision)
- Any new third-party credit line (re-arms dormant audit findings)
- 3Jane FCC dashboard status changes (Watch / Trigger Tripped / Default) and reconciliation of reported deployed + staged capital to the origination account's debt
- USD3/sUSD3 share price deviations
- Insurance Fund `waEthUSDC` balance changes (esp. outflows via `bring()`)
- Contract upgrades via BOTH TimelockControllers (`CallScheduled` / `CallExecuted` events on [`0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2`](https://etherscan.io/address/0x1dCcD4628d48a50C1A7adEA3848bcC869f08f8C2) for config changes and [`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`](https://etherscan.io/address/0x3D3C41419Ab401cd25055E8f9421D7D96d887885) for implementation upgrades)
- Multisig signer/threshold changes
- `EMERGENCY_AUTHORIZED_ROLE` / `OPERATOR_ROLE` grants/revokes on EmergencyController v2 (and on the future OperationalController once deployed)
- Large withdrawal requests and redemption queue depth
- Aave V3 USDC utilization (affects idle reserve availability)
- DeFiLlama TVL series for 3Jane (idle reserves only) — sharp idle-reserve drops signal origination-account draws, a strategy shutdown, or mass redemption
- **LCC:** first `openEpochCall()` and first successful funding; `ringFencedLiquidity` increases and releases; auction/slash events; `setRiskCaps` changes; depositor-cap changes by `LISTER_ROLE`; `bounceCommitment` calls; `DEPOSIT_OPERATOR_ROLE` grants; margin-oracle rotations; beacon ([`0xa767a51810644dDc34588cB8392EFd2591350302`](https://etherscan.io/address/0xa767a51810644dDc34588cB8392EFd2591350302)) upgrade schedules; `USD3l` cooldown-vault balance

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
 │  0x33333333…              0x3D3C4141…                                │
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
 │  USD3 (proxy)   0x056B269E…   impl 0xd1f1c3f4… (v1.2, Sep 25 2026)  │
 │     ▲ deposits USDC, mints USD3; $115M cap; LCC vaults exempt       │
 │     │ ringFencedLiquidity / releaseRingFence() (management)         │
 │     │ shutdownStrategy() / emergencyWithdraw() / restartStrategy()  │
 │  sUSD3 (proxy)  0xf6895551…   impl 0x6093d95f… (v1.2, Sep 25 2026)  │
 │     ▲ stake USD3, mint sUSD3, 30-day cooldown, 7.5% profit share    │
 └─────────────────────────────────────────────────────────────────────┘

 Protocol Layer (forked Morpho Blue)
 ┌─────────────────────────────────────────────────────────────────────┐
 │  MorphoCredit (proxy)   0xDe6e08ac…   ←  market state, accruals     │
 │  ProtocolConfig (proxy) 0x6b276A2A…   ←  global params, emergency   │
 │  CreditLine             0x26389b03…   ←  borrower approval,         │
 │                                          repayment posting,         │
 │                                          settlement                 │
 │  Helper                 0x2A66F992…   ←  borrower entry point       │
 │  AdaptiveCurveIRM(prox) 0x1d434D28…   ←  rate model                 │
 │  MarkdownController     0xF0eaE710…   ←  wired but NOT activated    │
 │  InsuranceFund          0x4507B5B2…   ←  ~$1.03M waEthUSDC,         │
 │                                          .bring() ⇒ CreditLine      │
 │                                                                     │
 │  Borrowers: origination account 0x3Ff3ff33… (1-of-1 Safe, owner =   │
 │             3/5 Safe) ≈ 98.8% of borrows; legacy CCL ≈ 1.2%         │
 └─────────────────────────────────────────────────────────────────────┘

 Off-chain FCC Layer (not verifiable onchain)
 ┌─────────────────────────────────────────────────────────────────────┐
 │  origination Safe ⇒ EOA 0x38353501… ⇒ EOAs 0x755bc710… / 0x95ad969c…│
 │     ⇒ (per docs) off-ramp to 3Jane's Erebor USD account ("staging") │
 │     ⇒ wires to FCC SPVs: warehouse / forward-flow (e.g. LendSwift)  │
 │     ⇐ collections via DACA accounts ⇒ onramp ⇒ repay MorphoCredit   │
 └─────────────────────────────────────────────────────────────────────┘

 LCC Layer (epoch clock started Sept 1; funding path live, no call yet)
 ┌─────────────────────────────────────────────────────────────────────┐
 │  LCCVaultFactory  0x95431c2F…  (AccessControlEnumerable)             │
 │   ├─ OWNER_ROLE: 24h Timelock          ├─ GUARDIAN_ROLE: Safe + HN    │
 │   ├─ LISTER_ROLE: EOA 0x485828… (depositor caps)                    │
 │   ├─ BOUNCER_ROLE: 24h Timelock                                      │
 │   └─ DEPOSIT_OPERATOR_ROLE: helpers 0x7C3c37… + 0x061654…            │
 │        │ deploys (beacon proxy, owner = 7d Timelock 0xa767a5…)       │
 │        ▼                                                            │
 │  LCCVault LCC-WAETHUSDC-01  0x8350ba7c…  (cap $30M, margin waEthUSDC)│
 │  LCCVault LCC-WAETHUSDT-01  0xF4ae98CD…  (cap $5M, margin waEthUSDT) │
 │   ├─ margin oracle (per vault, "fully trusted")                      │
 │   ├─ margin ⇒ commitment ⇒ [call] ⇒ USD3 (cap-exempt, ring-fenced)   │
 │   └─ missed call ⇒ slash margin ⇒ Dutch auction ⇒ backstop bidders   │
 │  USD3l cooldown vault  0xDF697c55…  ←  funded USD3, 35-day lock      │
 └─────────────────────────────────────────────────────────────────────┘

 Underlying / Offchain Layer
 ┌─────────────────────────────────────────────────────────────────────┐
 │  Aave V3 USDC market  ←  base yield on idle (held as waEthUSDC      │
 │                          0xd4fa2d31…)                               │
 │  Reclaim / zkTLS, EigenLayer AVS, Plaid, Credit Karma  ←  CCL only  │
 │  Hypernative (offchain)    ←  monitoring agent that drives the      │
 │                                EOA holding EMERGENCY_AUTHORIZED_ROLE│
 └─────────────────────────────────────────────────────────────────────┘
```

**Trust boundaries**

- The 3-of-5 Safe is the PROPOSER/EXECUTOR/CANCELLER on **both** timelocks. The 24h timelock controls configuration (contract owners, parameter changes); the 7-day timelock ([`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`](https://etherscan.io/address/0x3D3C41419Ab401cd25055E8f9421D7D96d887885)) controls implementation upgrades (all five ProxyAdmins). Both timelocks are self-administered (`DEFAULT_ADMIN_ROLE` held by the timelock itself).
- `EmergencyController v2` bypasses both timelocks for binary stop controls only (pause / set caps to zero / revoke a credit line). Both the multisig and the Hypernative agent EOA can invoke it.
- The CreditLine contract trusts an `ozd` for credit-line approval / repayment posting / debt settlement; today this resolves to EmergencyController v2, which is the same address as `emergencyAdmin`. The pending OperationalController (PR #111) is the planned split.
- The `restartStrategy()` reinitializer added in PR #112 demonstrated that recovery from a Yearn V3 shutdown sits behind the timelock-gated upgrade path — now with the 7-day timelock, worst-case redemption-restart latency is at least 7 days (assuming the upgrade is already coded and ready to schedule).
- **The largest trust boundary is the origination account.** The governance multisig both sets credit lines (24h timelock) and operates the Safe that draws them (no timelock). It moves ~77% of `totalAssets` off-chain into assets whose existence and value are attested only by 3Jane.
- LCC largely reuses the existing trust boundaries (24h timelock for parameters and `BOUNCER_ROLE`, 7d timelock for the shared beacon, multisig+Hypernative for pause). It adds `LISTER_ROLE` on `LCCVaultFactory`, held directly by a single EOA with no timelock or multisig gate. That EOA can set or clear per-depositor caps, controlling admission and top-up sizing, but cannot create vaults or move margin.
- The LCC margin oracle is described by 3Jane itself as "fully trusted" — there is no fallback price source or onchain sanity bound disclosed. A stale or manipulated oracle read would misprice staker margin for slashing/auction purposes.

## Appendix: Default → USD3 Loss Flow

USD3 PPS is defined by the ERC-4626 standard: `convertToAssets(1 share) = totalAssets() / totalSupply()`. The calculation is programmatic, but its main input, the origination account's debt, is carried at face value plus IRM interest. With the markdown module inactive, no repayment obligations posted, and payment cycles disabled, **no onchain mechanism recognizes a loss automatically**. Losses reach PPS only through a governance `CreditLine.settle()`.

```
  OFF-CHAIN (FCC, ~77% of totalAssets)            ONCHAIN
  ═══════════════════════════════════             ═══════════════════════════

  Fintech receivables default
        │
        ▼
  Originator first-loss / OC / reserves   (self-reported, weekly, 3Jane dashboard)
  absorb losses inside the SPV
        │  if exhausted, 3Jane's senior
        ▼  position is impaired
  3Jane decides to recognize the loss ────────►  CreditLine.settle()  (owner = 24h
                                                 timelock; EmergencyCtrl v2 as ozd
                                                 exposes no settle() forwarder)
                                                        │
                                                        ▼
                                                 MorphoCredit.totalSupplyAssets ↓
                                                        │
                                                        ▼
                                                 USD3.report(): sUSD3 shares burned
                                                 first; excess socialized to USD3

  Until settle() is called: USD3 PPS keeps accruing IRM interest on the full face debt.

  CCL residual (~$1.09M): Insurance Fund (~$1.03M) via settle() → sUSD3 → USD3.
```

| Step | Who | Timelock? |
|------|-----|-----------|
| Off-chain impairment assessment | 3Jane (servicer reports, weekly surveillance) | **N/A — off-chain** |
| Recognize loss (`CreditLine.settle`) | CreditLine owner (24h timelock). `ozd` = EmergencyController v2, whose verified ABI exposes only `emergencyRevokeCreditLine` and `setConfig` | **24h** |
| Junior absorption | `USD3.report()` burns sUSD3 shares on pending loss | **N/A — programmatic once settled** |
| PPS change | `totalAssets() / totalSupply()` | **N/A — pure math** |
| Activate markdown for a borrower | MarkdownController owner (24h timelock) | **24h** (standing decision: not to activate) |

Key takeaway: the timing and size of any loss on ~77% of the backing is a discretionary governance decision. 3Jane's runbook commits to bundling `settle()` with `USD3.report()` and `sUSD3.report()` privately to prevent front-running. The same design means holders cannot observe an impairment onchain before it is recognized.

## Risk Summary

### Key Strengths

- **Tier-1 backing:** $5.2M seed led by Paradigm, with Coinbase Ventures, Robot Ventures, Wintermute Ventures
- **Two-tier timelock with an unchanged signer set:** 3-of-5 multisig with a 7-day delay on implementation upgrades (proxy admins and the LCC beacon) and a 24h delay on configuration. Credit-line increases, supply-cap raises, and LCC risk caps all went through the 24h timelock, so they were publicly visible in advance. Owner set and threshold are unchanged since September.
- **Inherited Morpho Blue security:** core lending logic based on the extensively audited Morpho Blue codebase
- **Documented off-chain structure:** the disclosed FCC facility (LendSwift) sits senior to 25% originator first-loss equity with DACA-controlled collections and weekly surveillance. 3Jane publishes facility-level reporting and loan tapes on its own dashboard.
- **Audit coverage, all severe findings fixed:** 6 public audits across the core money market, the USD3/sUSD3 update, and the LCC facility; every Critical/High finding fixed. 3Jane also publishes unusually detailed accepted-risk preconditions (`AGENTS.md`, operations runbook).
- **Recognized loss history is clean:** no `settle()` write-down has been recorded, the Insurance Fund has never been drawn, and the October 2026 CCL delinquency case (JANE redistribution) ended with full repayment.

### Key Risks

- **Single-borrower concentration in a protocol-controlled account:** 98.8% of borrows (~$88.82M, ~77% of `totalAssets`) are owed by a 1-of-1 Safe owned by the governance multisig. That account pays a zero premium and has made one repayment since May. It can draw ~$23.2M more without new governance action.
- **Off-chain, self-attested backing:** the assets behind that debt (Erebor USD staging, SPV warehouse/forward-flow positions) are unverifiable onchain and lack any third-party attestation. Only a $10M facility is publicly documented against the ~$88.82M draw (**TODO:** reconciliation).
- **Discretionary loss recognition:** markdown is deliberately inactive, no repayment obligations are posted, and payment cycles are disabled. USD3 PPS accrues interest on face debt until governance chooses to call `CreditLine.settle()`.
- **Bank and originator dependencies:** a single U.S. bank (Erebor) carries the dollar leg; originator servicing and SPV bankruptcy remoteness are critical and documented only by 3Jane.
- **No bug bounty program** despite ~$115M of user funds
- **Limited team transparency:** only the founder is publicly known, and no legal entity or "sponsor entity" is disclosed even though the FCC structure depends on SPVs and bank accounts
- **EmergencyController outside audit scope** (per the DD document), and the OperationalController split is still undeployed
- **LCC accelerates the FCC book:** the funding path is live. A capital call mints USD3 above the supply cap and ring-fences the cash for off-chain purchases, excluding it from holders' withdrawal capacity until management releases it. Release is a manual "owner-discipline duty."

### Critical Risks

- **Off-chain credit or custody failure:** a loss at Erebor, an SPV, or an originator beyond the originator's first-loss equity hits a pool whose onchain junior buffer (~$8.37M sUSD3 + ~$1.03M Insurance Fund, of which only sUSD3 applies to FCC) covers **~10.5%** of borrows. Because recognition is discretionary, holders may exit or enter at a stale NAV during the gap.
- **Liquidity dependent on 3Jane's own recall:** beyond the idle buffer (~$25.15M now, ~$10–13M for most of October), redemptions depend on 3Jane recalling USD from off-chain facilities with revolving periods to mid-2027. No committed liquidity facility exists.
- **Upgrade risk and Yearn V3 shutdown semantics:** recovering from the April 2026 `shutdownStrategy()` required a new `restartStrategy()` reinitializer (PR #112). Future shutdowns may again require upgrades behind the 7-day timelock.
- **Scale outpacing the verifiable buffer:** TVL grew ~44% in seven weeks, while the onchain junior buffer stayed ~10–11% of borrows and the off-chain asset base remained largely undisclosed.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — Veridise, Sherlock ×2, Electisec, yAudit (May 2026), and Guardian (LCC, Aug 2026): 6 audits total, plus inherited Morpho Blue audits. ✅ PASS
- [ ] **Unverifiable reserves** — Only ~23% of `totalAssets` (idle `waEthUSDC`) plus the Insurance Fund is verifiable onchain. The remaining ~77% is a claim on 3Jane's own origination account, backed by off-chain assets that 3Jane reports on its own dashboard (facility KPIs, weekly surveillance, loan tapes for some facilities), with no third-party attestation. ⚠️ CONDITIONAL PASS — self-reported attestation exists, so the gate is not triggered, but this is the binding constraint on the score. An independent attestation or reconciliation would firm it up; evidence of a material unreported shortfall would trigger the gate.
- [x] **Total centralization** — 3/5 multisig with 24h/7d two-tier timelock; ProxyAdmins and LCC beacon owned by timelock. The multisig also directly controls the dominant borrower, but no single EOA controls the protocol. ✅ PASS

**All gates pass (conditional).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | 6 public audits: Veridise, Sherlock ×2, Electisec (2025, 1 critical + 11 high + 16 medium, all fixed); yAudit (May 2026) on the live USD3/sUSD3 update, 3 high + 5 medium, **all 3 High fixed**; Guardian (Aug 2026) on LCC and the v1.2 USD3 integration, 0 high/critical, 20 medium/34 low. A private LCC review is undisclosed. Inherited Morpho Blue audits (OpenZeppelin, Cantina). Certora formal verification present. 3Jane classifies 14 round-3 findings as dormant only while no third-party CCL line is drawn. |
| Production history | ~14 months (Aug 2025 deployment). TVL ~$115.0M `totalAssets` (~$25.2M idle + ~$89.9M borrowed). |
| Notable events | April 2026 strategy shutdown + restart (precautionary, no loss of funds). Late July – early August 2026 idle-reserve compression driven by origination-account draws. September 25, 2026 v1.2 upgrade. |
| Bug bounty | None — Immunefi 404 (October 27, 2026); not on Sherlock, Cantina, or SEAL Safe Harbor |

**Score: 3.0/5** — Audit coverage is broad and frequent, and the v1.2 USD3 changes that went live in September were inside Guardian's scope. Offsets are the absence of a bug bounty for a ~$115M protocol and 3Jane's own acknowledgment that several audit findings stay dormant only by operating policy.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | MorphoCredit, USD3, sUSD3, ProtocolConfig, AdaptiveCurveIRM upgradeable via TransparentUpgradeableProxy; **all five ProxyAdmins and the LCC beacon are owned by the 7-day TimelockController** (`0x3D3C41419Ab401cd25055E8f9421D7D96d887885`). USD3 → `0xd1f1c3f485063712873285bf4ef25ab068f13893` and sUSD3 → `0x6093d95f6c102163d19f5681e7d84997060bbaed` since September 25, 2026 |
| Timelock | **Two-tier system** (verified October 27, 2026): 7-day `getMinDelay() = 604800` for upgrades; 24h `getMinDelay() = 86400` for configuration. The 24h timelock is `owner()` of MorphoCredit, CreditLine, ProtocolConfig, MarkdownController, and JANE, USD3/sUSD3 `management()`, and `OWNER_ROLE`/`BOUNCER_ROLE` on `LCCVaultFactory`. Both are self-administered; the 3-of-5 multisig holds PROPOSER + EXECUTOR + CANCELLER on both. |
| Privileged roles | Pause, config changes, credit lines, settlement, upgrades. Global caps (`MAX_CREDIT_LINE`) are lifted and restored within governance batches, so the 24h delay, not the cap, constrains credit-line growth. The OperationalController split is still not executed onchain. LCC adds a single-EOA `LISTER_ROLE` (depositor caps only). |
| Emergency | EmergencyController v2 ([`0x84b31b84917485e221305edf590b8e3660d2e051`](https://etherscan.io/address/0x84b31b84917485e221305edf590b8e3660d2e051)): multisig + Hypernative EOA can pause, zero caps, and revoke credit lines, bypassing both timelocks. `LCCVaultFactory.GUARDIAN_ROLE` reuses the same holders. |

**Subcategory A Score: 3.0/5** — The 3/5 multisig maps to ~4, and the 7-day upgrade delay pulls toward 2. Every protocol-changing action since September went through the 24h or 7d timelock. The multisig's control of the origination account is a custody and operations concern, scored under Programmability.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| Onchain | ERC-4626 share price, interest accruals, loan state tracking are programmatic |
| Offchain | ~77% of `totalAssets` deployed off-chain by a multisig-controlled Safe; off-ramp, wires, facility selection, collections, and valuation run outside the chain |
| PPS | Onchain math, but the dominant input is face debt; losses enter only via discretionary `settle()` (markdown inactive, no obligations, cycles disabled) |
| Yearn V3 strategy semantics | `shutdownStrategy()` / `emergencyWithdraw()` / `restartStrategy()` are admin-callable and proved load-bearing in April 2026 |

**Subcategory B Score: 4.5/5** — Under the rubric, the dominant asset now sits between "offchain accounting with periodic reporting" (4) and "fully custodial operations" (5). Deployment is custodial through 3Jane's own Safe and bank account, and its valuation changes only by admin action. The onchain share-price mechanics and the timelocked credit-line limit keep it below 5.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| FCC originators / SPVs | Critical — ~77% of backing; one $10M facility publicly documented |
| Erebor (bank) | Critical — single bank for staging, wires, and collections |
| Aave V3 | Critical for idle liquidity; blue-chip |
| Morpho Blue (forked) / Yearn V3 TokenizedStrategy | Critical; shutdown semantics coupled to upgrades |
| Hypernative | Medium-High — automated emergency-response role |
| LCC + margin oracles | Low today ($0 called); feedless par oracles are an accepted LCC-staker risk |
| zkTLS / Reclaim / EigenLayer AVS / Plaid / Credit Karma | Now confined to the ~$1.09M residual CCL book |

**Subcategory C Score: 4.5/5** — The critical dependencies have shifted from early-stage onchain infrastructure to off-chain counterparties (originators, SPVs, servicers, one bank). Their failure would impair most of the backing, and none can be monitored onchain. This is close to a single-point-of-failure profile, held below 5 by SPV/DACA structuring, which is documented but not independently verified.

**Centralization Score = (3.0 + 4.5 + 4.5) / 3 = 4.0/5**

**Score: 4.0/5** — Upgrade and parameter governance is sound. Operationally, however, most pool capital is custodied and valued by the same multisig through off-chain counterparties.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | **No onchain collateral.** ~77% of `totalAssets` is a claim on 3Jane's own origination account; ~22% idle `waEthUSDC`; ~1% residual CCL |
| Collateral quality | Per 3Jane: senior positions in fintech consumer/SMB receivables behind originator first-loss equity (LendSwift: 25%, 1.33x OC) plus USD at Erebor. Unverified, and largely undisclosed beyond one $10M facility |
| Default protection | Pool level: sUSD3 ~$8.37M (+ Insurance Fund ~$1.03M for CCL only) ≈ **~10.5%** of ~$89.91M borrows. Facility level: originator equity / OC / reserves (self-reported) |
| Verifiability | Idle reserves and Insurance Fund verifiable onchain; dominant asset self-reported only |

**Subcategory A Score: 4.75/5** — The onchain buffer covers only ~10.5% of borrows, and the claimed facility-level enhancement cannot be verified for most of the book. Per the rubric this is partially collateralized and custodial with opaque reporting, just short of the critical gate.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | ~23% verifiable onchain; ~77% primarily offchain |
| Reporting mechanism | 3Jane's own FCC dashboard (weekly surveillance, loan tapes where published); onchain NAV reflects face debt, not off-chain performance |
| Third-party verification | None found — no bank, custodian, or auditor attestation of Erebor balances or SPV assets |

**Subcategory B Score: 4.5/5** — The rubric's "primarily offchain / self-reported only" row is 4. The score goes higher because the onchain NAV is structurally unable to reflect the self-reported data: loss recognition is discretionary and the automatic markdown path is disabled by policy. It stays below 5 because 3Jane does publish frequent facility-level reporting.

**Funds Management Score = (4.75 + 4.5) / 2 = 4.63/5**

**Score: 4.63/5** — USD3 functions as an off-chain asset-backed-finance vehicle whose dominant asset is a self-attested claim on the protocol's own account.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | Redeem USD3 for USDC from idle reserves (`availableWithdrawLimit()` ~$25.15M). No queue. `isShutdown()` would block the path entirely, as in April 2026. |
| Liquidity depth | ~$25.15M idle now (~21.9%), after ~$10.4–13.6M (~10–12%) for most of October. DEX depth immaterial (Curve frxUSD/USD3 ~$226K; Uniswap V3 dust). |
| Utilization risk | ~78% now, ~84–90% for most of October. The origination account can draw ~$23.2M more without governance action, and has repeatedly drawn idle down after cap raises. |
| Refill path | Beyond CCL repayments, refilling requires 3Jane to recall USD from off-chain facilities (disclosed facility revolving to May 2027) |
| Lock periods | sUSD3 30-day cooldown; LCC-funded USD3 35-day cooldown and ring-fenced cash (currently $0) |
| Same-value asset | USDC-denominated — lower urgency for exit speed |

**Score: 3.0/5** — Direct redemption from idle reserves still works and the asset is same-value. But the buffer beyond idle cash rests on off-chain assets with multi-month duration, and 3Jane itself controls both the drain (origination draws) and the refill (recall). The buffer has repeatedly compressed to ~10% of `totalAssets` in normal operation.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Founder publicly known (Jacob Chudnovsky, ex-Ribbon/Aevo). Rest of team undisclosed |
| Documentation | Detailed mechanics, runbook, and accepted-risk register; weak disclosure of the origination account and of most FCC deployments |
| Funding | $5.2M seed from Paradigm, Coinbase Ventures, and other reputable investors |
| Legal | No publicly disclosed legal entity or sponsor entity, despite the SPV/bank structure |
| Incident response | April 2026 precautionary shutdown and recovery; CCL delinquency in October 2026 resolved with full repayment |

**Score: 3.0/5** — Doxxed founder with strong VC backing and an unusually transparent engineering record. The legal entity is undisclosed and the dominant position is under-disclosed.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical Track Record | 3.0 | 20% | 0.60 |
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 4.63 | 30% | 1.389 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.79/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk (3.79/5.0) — Limited approval, strict limits**

The tier is **Elevated** because ~98.8% of the borrow book (~77% of `totalAssets`) is owed by 3Jane's own multisig-controlled origination account. The account funds off-chain fintech-receivable facilities through a bank account, its backing is self-attested only, and losses on it reach USD3 PPS only when governance chooses to settle. Mitigants: a sound two-tier timelock with unchanged signers, broad audit coverage, documented SPV/DACA/first-loss structuring for the disclosed facility, unusually candid accepted-risk documentation, and no recognized loss to date. An independent attestation of Erebor balances and FCC assets, reconciled to the origination account's debt, is the main item that could lower the score.

---

## Reassessment Triggers

- **Time-based:** Reassess in 1 month (late November 2026), given rapid TVL growth and the now-live LCC funding path
- **TVL-based:** Reassess if `USD3.totalAssets()` changes by more than ±30% from the October 2026 baseline of ~$115.0M, or if idle reserves drop below $5M for >24h
- **Concentration-based:** Reassess on any origination-account credit-line increase, any `DEBT_CAP` / `USD3_SUPPLY_CAP` increase, or any new third-party credit line
- **Loss-based:** Reassess on any `CreditLine.settle()`, any drop in MorphoCredit `totalSupplyAssets`, any sUSD3 share burn, any FCC facility moving to Watch / Trigger Tripped / Default, or any Insurance Fund outflow
- **Provability-based:** Reassess if 3Jane publishes a third-party attestation of Erebor/SPV assets or a reconciliation of FCC deployed + staged capital to the origination account's debt (could improve score)
- **Shutdown-based:** Reassess on any `USD3.isShutdown() = true` event, with target turnaround <72h
- **Governance-based:** Reassess once OperationalController (PR #111) is deployed onchain, on any multisig signer/threshold change, or on any change to the origination Safe's owners
- **Buffer-based:** Reassess if the combined sUSD3 + Insurance Fund buffer falls below 10% of the outstanding borrow book (currently ~10.5%)
- **Policy-based:** Reassess if markdown is activated for any borrower, non-empty repayment obligations are posted, or `MIN_SUSD3_BACKING_RATIO` becomes nonzero (each re-arms audit findings 3Jane classifies as dormant)
- **Audit-based:** Reassess if additional audits are completed or a bug bounty is established (could improve score)
- **Dependency-based:** Reassess on any Erebor, originator, Aave V3, or Hypernative security or solvency event
- **LCC-based:** Reassess on the first opened call and first successful funding; any `ringFencedLiquidity` that remains unreleased for more than one epoch; any staker default/slash/auction event; or any margin-oracle rotation

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [March 4, 2026](https://github.com/yearn/risk-score/pull/77) | 3.5 | Initial assessment |
| [July 3, 2026](https://github.com/yearn/risk-score/pull/168) | 3.4 | Reassessment after April 2026 emergency shutdown |
| [September 5, 2026](https://github.com/yearn/risk-score/pull/444) | 3.46 | Reassessment: thinner loss buffer, higher utilization; LCC launch noted but not risk-scored (deposit path disabled at snapshot) |
| October 27, 2026 | 3.79 | Reassessment: 98.8% of borrows owed by protocol-owned origination account funding off-chain FCC assets; discretionary loss recognition; v1.2 upgrade enables LCC funding; TVL ~$115M |
