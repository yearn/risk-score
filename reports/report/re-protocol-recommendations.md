# What Re Should Genuinely Change — Recommendations from the reUSD Risk Assessment

- **Date:** July 29, 2026
- **Companion doc to:** `re-reusd.md` (Final Score 3.51/5.0, Elevated Risk)
- **Purpose:** Not criticism for its own sake — each item names the issue, why it holds the score back, and a concrete fix. Items are ordered by impact on the risk score and on actual fund-loss probability.

## 1. Move reserve custody off plain EOAs (the single largest issue)

**Issue:** ~86% of onchain reserves (~$81M of ~$94M at the June 2026 assessment) sit at three plain EOAs (ICL Custodial Wallet `0x295F…689E`, Redemption Reserves Custodian `0x9eA3…ADF8`, reUSDe custodian `0xd437…31e9`). Onchain, these are indistinguishable from single-key wallets: no destination whitelist, no spending cap, no delay, no role check. The Fireblocks MPC quorum and policies are entirely offchain and unverifiable; the TNF AUP only observed management logging in — it did not cryptographically attest N-of-M signing.

**Why it matters:** One signed transaction drains the majority of onchain backing. The 48h Timelock does not apply. This is flagged as the #1 unmitigated fund-loss risk in the report and dominates the Funds Management score (4.0/5).

**Fix:** Migrate reserve custody to onchain-verifiable structures — a Safe multisig (quorum visible onchain) at minimum, ideally contract vaults with role-gated, timelocked, destination-whitelisted outflows (the Daily Instant Redemption Vault already demonstrates the pattern). Even keeping Fireblocks as the signing layer, pointing it at a Safe makes the quorum publicly provable.

## 2. Put the price-write and mint role admins behind the Timelock

**Issue:** The June 2026 governance fixes (EOA `PRICE_SETTER_ROLE` revoked, `NAVConsumer` as sole price writer, MINTER_ROLE reduced to 2 holders) are real but reversible: the role admin (`DEFAULT_ADMIN`) on `SharePriceCalculator` and the reUSD token is the 3-of-5 Governance Safe, not the Timelock. The Safe can re-grant `PRICE_SETTER_ROLE` or `MINTER_ROLE` to any EOA with no 48h delay.

**Why it matters:** Reviewers must treat the fixes as current-state, not structural. This single caveat is what kept reUSD from crossing from Elevated into Medium risk in the June reassessment.

**Fix:** Transfer `DEFAULT_ADMIN_ROLE` on `SharePriceCalculator` and the reUSD token (and ideally on ICL) to the Timelock Controller, as was already done for `UPGRADER_ROLE` and `CUSTODIAN_MANAGER_ROLE`. Then every privileged role change inherits the 48h public review window.

## 3. Launch a bug bounty and adopt SEAL Safe Harbor

**Issue:** No Immunefi (or comparable) bug bounty exists (re-checked July 29, 2026), and Re is not in the SEAL Safe Harbor registry. For a protocol holding ~$180M+ of tokenized deposits with UUPS-upgradeable contracts, this is a visible gap every reviewer will flag.

**Fix:** Stand up a public bounty (Immunefi is the default venue for this TVL class) with meaningful critical-severity payouts, and adopt Safe Harbor. This is the cheapest score improvement available — it directly lifts the Audits & Track Record category.

## 4. Fix the loss-waterfall inconsistency in the public docs

**Issue:** The docs contradict themselves. "Loss waterfall order" headlines *"Impairment of reUSD would require a Combined Ratio of 135% — a 0.03% probability event"*, while "Scenario walkthroughs" on the same docs site states reUSD takes losses **above 115%** (probability of reaching 115% ≈ 0.9%). The 135%/0.03% framing understates reUSD's modeled attachment probability by roughly 30x. (This was already flagged internally in June; the headline page still reads this way as of July 29, 2026.)

**Fix:** Align both pages on the attachment-point framing: reUSD attaches above 115% (~0.9% modeled); 135%/0.03% is a deep-stress severity level, not the attachment. Sophisticated allocators will find the inconsistency, and it reads as marketing over precision.

## 5. Publish the loss model behind the impairment probabilities

**Issue:** The 3.9% / 1.9% / 0.9% / 0.03% ladder comes from a single chart in the LP memo. No distributional assumptions, correlation structure, simulation count, calibration window, confidence intervals, or actuarial sign-off are public. Reviewers must label every tail figure "Re-asserted, model undisclosed."

**Fix:** Publish a model methodology note (even summarized) with an actuary's sign-off, and refresh it with each quarterly actuarial report. This converts the strongest marketing claim ("risk-remote by design") into a verifiable one.

## 6. Reconcile the "daily attestation" claim with what is publicly verifiable

**Issue:** Docs state TNF performs "daily AUP attestations", but the only public artifact is a single AUP report dated Oct 31, 2025. No publication cadence is observable; the Avalanche PoR feed transports the same TNF data and Chainlink labels it "non-value-securing".

**Fix:** Either publish the attestations (or a signed digest) on a stated cadence, or reword the docs to match what is actually published. Additionally: publish a reUSD-only reserve figure (the PoR feed reports "Re Offchain Reserves" generically), deploy the PoR feed on Ethereum, and — the real upgrade — have the ICL consume it onchain (e.g., gate minting or admin sweeps on reserve sufficiency), turning transparency into enforcement.

## 7. Rebuild coverage headroom and reduce sUSDe concentration

**Issue:** reUSD-only onchain coverage sat at ~50.2% in June — essentially at the stated ≥50% floor — with ~73% of reserves in sUSDe (Ethena counterparty risk, 7-day unstake cooldown) and zero USDC in the instant-redemption path (`dayPayoutToken` = sUSDe). Docs say redeemers receive the "deposit asset", which does not match a config where instant exits settle only in sUSDe. The BUIDL / T-bill wrappers mentioned in Re's materials are not held onchain.

**Fix:** Hold coverage meaningfully above the floor (55%+ gives visible headroom), diversify reserves (more USDC; actually hold the T-bill wrappers the docs mention), and either fund USDC instant redemptions or update the docs to state plainly that instant exits pay sUSDe.

## 8. Make the admin quorums onchain-verifiable

**Issue:** The Oracle / Redemptions / Access admin controllers are EOAs described as "MPC 3-of-5" or "5-of-8" in docs. Nothing onchain corroborates any quorum; signers are not identified.

**Fix:** Replace admin EOAs with Safes (visible owners and thresholds), or publish signer-set attestations. Same logic as item 1, applied to the control plane. Also disclose the §114 Trust banking counterparties (or at least their category/rating) — "an independent bank" is currently unverifiable.

## 9. Reconcile external fee disclosures

**Issue:** Onchain redemption fee is 6 bps (verified) and docs agree, but RWA.xyz shows 0.18% subscription / 0.18% redemption — and small historical deposit-fee collections exist onchain (flagged in Hacken F-2024-5214). Inconsistent fee data across public surfaces erodes trust disproportionately to its size.

**Fix:** Correct the RWA.xyz listing, document any deposit-fee mechanism that exists in the contracts, and state the full fee schedule in one place in the docs.

## 10. Keep the audit trail tidy

**Issue:** Small but recurring: docs list the Hacken engagements as Sept 2024 / Dec 2024 / Apr 2025 while the published Hacken reports are dated Aug 2024 / Nov 2024 / Mar 2025; the governance codebase was noted as out of audit scope in 2024 and no governance-scope audit has been published since.

**Fix:** Use the report dates consistently, and commission an audit covering the governance/access-control layer (AccessManager, Timelock wiring, role-admin topology) — precisely the surface where items 2 and 8 live.

---

**Summary:** Items 1–2 are the score-movers: they are what keeps reUSD in Elevated rather than Medium. Items 3–6 are trust/verifiability upgrades that cost little and remove reviewer discounts on Re's own claims. Items 7–10 are hygiene that prevents each future reassessment from re-flagging the same findings.
