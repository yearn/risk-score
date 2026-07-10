# Protocol Risk Assessment: Bedrock uniBTC

- **Assessment Date:** July 10, 2026
- **Token:** uniBTC
- **Chain:** Ethereum
- **Token Address:** [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568)
- **Final Score: 3.6/5.0**

## Overview + Links

Bedrock uniBTC is a wrapped-BTC liquid restaking token. Users deposit supported BTC-denominated assets into the uniBTC Vault and receive uniBTC 1:1 in 8-decimal BTC units. Bedrock documentation describes the underlying BTC exposure as deployed across BTC restaking / custody venues, with Chainlink Proof-of-Reserve used as the public reserve check.

This report is scoped to **uniBTC only**. Bedrock brBTC is a separate codebase and asset, but it is mentioned where relevant because brBTC accepts uniBTC as a deposit asset and therefore creates downstream demand/contagion paths for uniBTC.

**Links:**

- [Bedrock website](https://www.bedrock.technology/)
- [Bedrock app](https://app.bedrock.technology/)
- [Bedrock docs](https://docs.bedrock.technology/)
- [Statistics dashboard](https://app.bedrock.technology/statistics)
- [GitHub - Bedrock-Technology](https://github.com/Bedrock-Technology)
- [uniBTC GitHub - Bedrock-Technology/uniBTC](https://github.com/Bedrock-Technology/uniBTC)
- [DefiLlama - Bedrock uniBTC](https://defillama.com/protocol/bedrock-unibtc)
- [DefiLlama - Bedrock aggregate](https://defillama.com/protocol/bedrock)
- [Chainlink uniBTC PoR feed](https://data.chain.link/feeds/ethereum/mainnet/unibtc-por)
- [QuillAudits - Sept 2024 exploit analysis](https://www.quillaudits.com/blog/hack-analysis/bedrock-2million-exploit)
- [BlockApex - uniBTC hack analysis](https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8)
- [Babylon Labs](https://babylonlabs.io/)

## Contract Addresses

### uniBTC Token Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC token proxy | [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) | User-facing uniBTC token, EIP-1967 transparent proxy |
| uniBTC token implementation | [`0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD`](https://etherscan.io/address/0xe0E6a124d500BE28BBdC47e6123E68B23b039cAD) | Token implementation |
| uniBTC ProxyAdmin | [`0x029e4fbdaa31de075dd74b2238222a08233978f6`](https://etherscan.io/address/0x029e4fbdaa31de075dd74b2238222a08233978f6) | Upgrade authority for uniBTC token and uniBTC Vault |

### uniBTC Protocol Layer

| Contract | Address | Role |
|----------|---------|------|
| uniBTC Vault proxy | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Mint/redeem uniBTC against allowed wrapped BTC |
| uniBTC Vault implementation | [`0x01e9161D1621466eB086651FD514d3eFb8C3752E`](https://etherscan.io/address/0x01e9161D1621466eB086651FD514d3eFb8C3752E) | `VaultWithoutNative` implementation |
| Chainlink uniBTC PoR feed | [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2) | uniBTC reserve feed, 18 decimals, 2% deviation |
| uniBTC supply feeder | [`0xE542919E4b281f10b437F947c8Ba224DdfaBc716`](https://etherscan.io/address/0xE542919E4b281f10b437F947c8Ba224DdfaBc716) | Aggregates global uniBTC supply for PoR comparison |

### Governance Layer

| Safe | Address | Threshold | Controls |
|------|---------|-----------|----------|
| uniBTC ops Safe | [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3) | 3/5 | Owns uniBTC ProxyAdmin; holds `DEFAULT_ADMIN_ROLE` on uniBTC Vault |

Fresh onchain verification on July 10, 2026 read Safe thresholds/owners via `getThreshold()` / `getOwners()`, ProxyAdmin ownership via `owner()`, Vault roles via `hasRole(bytes32,address)`, and EIP-1967 implementation/admin slots. The uniBTC ops Safe currently has no modules and no guard configured.

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in multiple Bedrock governance Safes, and signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in both the uniBTC and brBTC Safe set. This reduces effective independence across Bedrock product lines.

## How uniBTC Works

- **Deposit assets accepted:** WBTC, FBTC, cbBTC, M-BTC, and uniBTC itself for cross-chain routing.
- **Mint flow:** User deposits a permitted wrapped BTC asset into the Vault `mint` function and atomically receives uniBTC 1:1 in 8-decimal BTC units.
- **PoR gate:** Minting checks Chainlink PoR reserves against circulating supply reported by the uniBTC supply feeder. Fresh onchain verification on July 10, 2026 read `chainlinkReserveFeeder = 0xc590D9fb...`, `uniBTCSupplyFeeder = 0xE542919E...`, `feederHeartbeat = 86,400s`, `outOfService = false`, and `paused = false`.
- **Adequacy ratio:** The Vault explicitly permits minting while PoR-reported reserves are at least 90% of supply. Fresh onchain verification read `adequacyRatio = 900`, and source review found `checkReserve` requiring `supply * adequacyRatio / 1000 <= reserves`. This is not a strict 1:1 mint gate.
- **Redeem flow:** Bedrock docs describe claim-based unstaking with an **8-day delay**, **0.5% redemption fee**, and **2 WBTC/day Ethereum cap**.
- **Custody:** TODO - Bedrock docs do not name the BTC custodian(s), signers, or full address-control model for the backing wallets monitored by Chainlink PoR.
- **Cross-chain:** Chainlink CCIP is the documented canonical bridge path. uniBTC is deployed across many chains; Ethereum is one slice of total supply.

## Token Mint Authority

| Minter / Role Holder | Address | Notes |
|----------------------|---------|-------|
| uniBTC Vault | [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da) | Collateralized mint path for supported wrapped BTC deposits. Mint is PoR-gated but allows a 10% reserve shortfall via `adequacyRatio = 900`. |
| Cross-chain bridge / routing contracts | TODO | uniBTC is deployed cross-chain and docs identify Chainlink CCIP as canonical; complete current bridge mint/burn authority enumeration across every non-Ethereum deployment remains TODO. |

## Audits and Due Diligence Disclosures

| Scope | Firm | Date | Link |
|-------|------|------|------|
| uniBTC | BlockSec | Jun 12, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/code%20audit%20blocksec.pdf) |
| uniBTC | PeckShield | Oct 1, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/PeckShield-Audit-Report-uniBTC-v1.0.pdf) |
| uniBTC | BlockSec | Oct 30, 2024 | [PDF](https://github.com/Bedrock-Technology/uniBTC/blob/main/blocksec_bedrock_unibtc_v1.0-signed.pdf) |

The October 2024 audits are post-exploit re-engagements covering the patched uniBTC vault. No top-tier audit engagement (Trail of Bits, OpenZeppelin, ChainSecurity, Spearbit, Cantina) was found for uniBTC.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.** Direct URL [immunefi.com/bug-bounty/bedrock/](https://immunefi.com/bug-bounty/bedrock/) returns 404. The Bedrock docs site has no dedicated bug-bounty page.
- **SEAL Safe Harbor: NOT registered.** The original verification checked the onchain SafeHarborRegistry [`0x8f72fcf695523a6fc7dd97eafdd7a083c386b7b6`](https://etherscan.io/address/0x8f72fcf695523a6fc7dd97eafdd7a083c386b7b6) and found no Bedrock-related adoption logs.

## Historical Track Record

- **Time in production:** uniBTC launched in 2024; DeFiLlama first records Bedrock uniBTC on Oct 29, 2024.
- **TVL (DeFiLlama, July 10, 2026):** Bedrock uniBTC reported **$291.37M** across 18 chains. Major slices: Bitcoin $107.6M, Ethereum $81.2M, Merlin $61.0M, BOB $25.3M, BSC $15.6M.
- **Peak TVL:** Bedrock uniBTC peaked at **$638.3M** on July 15, 2025.
- **Minimum after launch:** $109.4M on Nov 2, 2024, shortly after the Sept 2024 exploit.
- **Ethereum total supply:** Fresh onchain verification on July 10, 2026 read **2,985.80444007 uniBTC** (`298,580,444,007` sats).
- **PoR reserves:** Fresh onchain verification read Chainlink PoR `latestAnswer = 4,614.724024573852871295 BTC` (18 decimals), updated at `2026-07-09T19:35:35Z`, which exceeded circulating supply at that snapshot.

### Security Incident: September 27, 2024 - uniBTC Mint Exploit

- **Loss:** approximately $2M, reported as roughly 649.6 WETH by public incident analyses.
- **Root cause:** The uniBTC Vault mint flow did not properly validate the deposit asset's price/decimals against the uniBTC issuance rate. Public analyses describe an attacker depositing WETH and receiving uniBTC 1:1, then swapping uniBTC for WETH.
- **Affected contract:** uniBTC Vault [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da), the same proxy address still in use after the patch.
- **Exploiter:** EOA [`0x2bFB373017349820dda2Da8230E6b66739BE9F96`](https://etherscan.io/address/0x2bFB373017349820dda2Da8230E6b66739BE9F96).
- **Response:** Bedrock paused the vault, upgraded the implementation, added Chainlink Proof-of-Reserve / Secure Mint checks, and re-audited with PeckShield and BlockSec in October 2024. Fuzzland publicly took responsibility because the attacker was reportedly a Fuzzland ex-employee; Fuzzland reimbursed Bedrock with company funds ([Cointelegraph, June 2025](https://cointelegraph.com/news/fuzzland-ex-employee-bedrock-unibtc-exploit); [Cryptonews](https://cryptonews.com/news/ex-employee-hacks-bedrock-unibtc-for-2m-fuzzland-uncovers-insider-exploit/)).
- **Restitution txs:** TODO - specific onchain Fuzzland-to-Bedrock reimbursement transaction hashes are not publicly disclosed.

The exploit occurred on the same vault proxy that remains in production. Post-exploit controls are materially stronger, but future upgrade or validation mistakes remain a high-impact path because there is no onchain timelock.

## Funds Management

### Accessibility

| Token | Mint | Redeem | Fees | Permissioning |
|-------|------|--------|------|---------------|
| uniBTC | Atomic, PoR-gated | 8-day queue, per docs | 0.5% redemption fee; 2 WBTC/day Ethereum cap | Permissionless |

### Collateralization

- uniBTC is intended to be backed 1:1 by wrapped BTC assets and native/restaked BTC positions.
- Accepted deposit assets include WBTC, FBTC, cbBTC, and M-BTC. Counterparty quality is mixed: WBTC and cbBTC are more established; FBTC and M-BTC are newer issuer/custody dependencies.
- Chainlink PoR reported backing above circulating supply in the July 10, 2026 verification pass, but the mint gate permits up to 10% under-collateralization via `adequacyRatio = 900`.
- Only a small amount of WBTC was held directly in the Ethereum Vault in the July 10, 2026 verification pass (1.90156049 WBTC, plus 0.01 WBTC in the ops Safe). The majority of backing sits outside the Ethereum vault contract, including native BTC/restaking/custody arrangements monitored through PoR.

### Provability

uniBTC has materially better reserve provability than brBTC because a Chainlink PoR feed is wired directly into the uniBTC Vault mint path. However:

- The feed depends on a Bedrock-supplied address set.
- PoR validates balances, not legal ownership or private-key control.
- The Vault allows minting if reserves are at least 90% of supply.
- The named custodian/signing setup remains undisclosed.

## Liquidity Risk

- **Primary exit:** Bedrock redemption queue. The documented 8-day delay, 0.5% fee, and 2 WBTC/day Ethereum cap materially limit large same-chain exits.
- **Secondary exit:** Original CoinGecko review found uniBTC 24h DEX volume around **$19,774** across all DEXes, thin for a multi-hundred-million dollar asset.
- **Slippage:** Original CoW Protocol quote checks showed approximately **2.4%** slippage for a ~$1M uniBTC -> WBTC exit and approximately **77%** slippage for a ~$5M exit on Ethereum mainnet, indicating a hard liquidity cliff.
- **Downstream integration:** brBTC accepts uniBTC as an input asset. Stress in brBTC may create uniBTC flow pressure, and stress in uniBTC directly affects brBTC when uniBTC is used as backing.

## Centralization & Control Risks

### Governance

- uniBTC token and uniBTC Vault are upgradeable transparent proxies.
- The uniBTC ops Safe is 3-of-5 and owns the ProxyAdmin.
- The same Safe holds `DEFAULT_ADMIN_ROLE` on the uniBTC Vault.
- No Safe Guard or Delay module was configured on the uniBTC ops Safe in the July 10, 2026 verification pass. A 3-of-5 signature can therefore upgrade implementations or execute privileged actions without an onchain delay.
- Signer overlap across Bedrock Safes weakens practical separation between product lines.

### Programmability

Minting is programmatic and PoR-gated, which is a major strength relative to opaque custody wrappers. The main residual programmability risks are upgradeability, role-controlled pausing/outflows, PoR address-set dependence, and the explicit 90% adequacy threshold.

### External Dependencies

| Dependency | Used by uniBTC | Criticality |
|-----------|----------------|-------------|
| Chainlink PoR feed | Mint reserve gate | High - stale/wrong data can halt or weaken mint safety |
| Chainlink CCIP | Cross-chain routing | High - bridge security affects multi-chain supply/peg |
| WBTC / FBTC / cbBTC / M-BTC | Accepted deposit assets | High - issuer/custody risk |
| Bitcoin network / native BTC custody | Backing assets | Critical |
| Babylon Labs / BTC restaking venues | Yield / restaking exposure | High |
| Undisclosed custody/signing setup | BTC backing control | Critical unknown |

## Operational Risk

- **Team transparency:** Bedrock/RockX leadership is public. Zhuling Chen is CEO of Bedrock and RockX; Alex Lam is a RockX co-founder.
- **Legal structure:** Per Bedrock [Terms of Use](https://docs.bedrock.technology/legal/terms-of-use.md), the website and protocol are operated by **Golden Bull Enterprises Limited**, formed under the laws of the **British Virgin Islands**.
- **Documentation:** Public docs cover minting, unstaking, audits, and PoR at a high level. Custodian identity, full signing model, and restitution txs remain undisclosed.
- **Incident handling:** The Sept 2024 response was credible (pause, patch, re-audit, PoR hardening, users made whole through Fuzzland reimbursement), but the incident remains a meaningful historical risk marker because it affected the same vault proxy still in production.

## Monitoring

### Critical

1. **Chainlink uniBTC PoR feed** [`0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2`](https://etherscan.io/address/0xc590D9fb8eE78a0909dFF341ccf717000b7b7fF2):
   - `latestAnswer()` vs global uniBTC supply.
   - Feed staleness relative to the 24h heartbeat.
2. **uniBTC Vault** [`0x047D41F2544B7F63A8e991aF2068a363d210d6Da`](https://etherscan.io/address/0x047D41F2544B7F63A8e991aF2068a363d210d6Da):
   - `outOfService()`.
   - `paused()`.
   - `Upgraded` events.
   - Role grants/revocations and `execute()` target list changes.
3. **uniBTC token** [`0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568`](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568):
   - `totalSupply()` changes.
   - Implementation upgrades.
4. **uniBTC ops Safe** [`0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3`](https://etherscan.io/address/0xC9dA980fFABbE2bbe15d4734FDae5761B86b5Fc3):
   - owner additions/removals and threshold changes.
5. **Liquidity / peg:**
   - uniBTC/WBTC ratio on Ethereum and major cross-chain venues.
   - DEX depth and 24h volume.
   - Redemption queue throughput versus the 2 WBTC/day Ethereum cap.

### Recommended Frequency

- PoR feed: every block or keeper-style monitoring.
- Vault pause/outOfService/upgrades: every block.
- Governance Safe activity: daily.
- Supply reconciliation: daily.
- TVL / market liquidity: daily.

## Appendix: Contract Architecture

```
Governance Layer
================
uniBTC Ops Safe 0xC9dA980f... (3/5)
  |-- owns ProxyAdmin 0x029e4fbd...
  |     |-- admin --> uniBTC token 0x004E9C...
  |     `-- admin --> uniBTC Vault 0x047D41...
  `-- DEFAULT_ADMIN_ROLE --> uniBTC Vault

Token / Vault Layer
===================
uniBTC token 0x004E9C...0568
  `-- minted by uniBTC Vault 0x047D41...D6Da
        |-- accepts WBTC / FBTC / cbBTC / M-BTC
        |-- checks Chainlink PoR 0xc590D9fb...
        `-- checks global supply feeder 0xE542919E...

Backing / External Layer
========================
Wrapped BTC issuers
Native BTC custody / restaking
Babylon and BTC restaking venues
Chainlink PoR + CCIP

Critical Unknowns
=================
Named BTC custodian/signers
Complete current cross-chain mint/burn authority map
Public restitution txs for Sept 2024 exploit
```

---

## Risk Summary

### Key Strengths

1. **Chainlink PoR is wired into the Vault mint path.** Minting is not purely admin-attested; the Vault checks public reserve data before issuing new uniBTC.
2. **Three uniBTC-specific audits** including two post-exploit re-audits.
3. **Verified source and multisig governance** in the July 10, 2026 review.
4. **Large ecosystem scale** with $291.37M DeFiLlama uniBTC TVL on July 10, 2026.
5. **Public team and known legal entity** via Bedrock/RockX leadership and Bedrock Terms of Use.

### Key Risks

1. **Prior exploit on the same vault proxy.** The Sept 2024 mint-validation exploit occurred on the uniBTC Vault still in use.
2. **PoR is not a strict 1:1 mint gate.** `adequacyRatio = 900` permits minting while reserves are at least 90% of supply.
3. **No timelock.** The 3-of-5 Safe can upgrade token/vault implementations without onchain delay.
4. **Custody opacity.** The PoR address set is public through Chainlink, but Bedrock does not publicly name the BTC custodian/signers or prove unencumbered control.
5. **Thin secondary liquidity and capped redemption.** The 2 WBTC/day Ethereum cap and thin DEX liquidity are binding for large exits.
6. **Accepted-asset risk.** uniBTC accepts multiple BTC wrappers with different issuer/custody risk profiles.
7. **No public bug bounty / no SEAL Safe Harbor registration found.**

### Critical Risks

- The prior exploit on the same proxy plus instant-upgrade governance is the main critical path. PoR hardening materially reduces recurrence risk, but it does not remove upgrade, custody, bridge, or PoR-address-set risk.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** - PASS. uniBTC has three public audits, including post-exploit audits.
- [x] **Unverifiable reserves** - PASS, with caveats. Chainlink PoR is wired into the Vault, but it depends on a self-declared address set and allows 90% adequacy.
- [x] **Total centralization** - PASS. Governance uses a 3-of-5 Safe, not a single EOA.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**
- Three uniBTC-specific audits by BlockSec and PeckShield.
- Two post-exploit re-audits.
- No top-tier audit and no public bug bounty.
- **Score: 2.75**

**Subcategory B: Historical Track Record**
- uniBTC has been live since 2024 and has sustained material TVL.
- September 2024 exploit on the same vault proxy is a major incident.
- No recurrence identified after the post-exploit implementation and PoR hardening.
- **Score: 3.25**

**Audits & Historical Score = (2.75 + 3.25) / 2 = 3.0**

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**
- 3-of-5 Safe controls ProxyAdmin and Vault admin role.
- No onchain timelock or Safe Delay module in the July 10, 2026 verification.
- **Score: 4.0**

**Subcategory B: Programmability**
- Minting is programmatic and PoR-gated.
- Upgradeability, pause/outflow controls, and adequacy-ratio governance remain material.
- **Score: 2.75**

**Subcategory C: External Dependencies**
- Chainlink PoR/CCIP, wrapped BTC issuers, BTC custody/signers, Babylon/restaking venues.
- **Score: 4.0**

**Centralization Score = (4.0 + 2.75 + 4.0) / 3 = 3.58**

**Score: 3.6/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- PoR showed backing above supply in the July 10, 2026 verification pass.
- Mixed collateral issuer quality and offchain/native BTC custody opacity.
- Explicit 90% adequacy threshold weakens the mint gate.
- **Score: 3.5**

**Subcategory B: Provability**
- Chainlink PoR is a real positive.
- Self-declared address set, opaque custody/signing, and 90% threshold limit confidence.
- **Score: 3.0**

**Funds Management Score = (3.5 + 3.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Redemption is delayed, fee-bearing, and capped at 2 WBTC/day on Ethereum.
- Secondary DEX liquidity is thin for the asset size.
- **Score: 4.0**

**Score: 4.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed leadership and legal entity are positives.
- Prior incident response was credible.
- Custodian/signing disclosure and formal incident-response disclosure remain incomplete.
- **Score: 2.25**

**Score: 2.25/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.600 |
| Centralization & Control | 3.6 | 30% | 1.080 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 2.25 | 5% | 0.113 |
| **Subtotal** | | | **3.368** |

**Modifiers:**
- Prior exploit on same vault proxy: **+0.25**. The incident is already reflected in historical scoring, but the same proxy and no-timelock upgrade path justify a small residual modifier.
- No additional custody-opacity modifier; this is already captured in Funds Management.

**Adjusted Final Score: ~3.6 / 5.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

uniBTC is stronger than brBTC on reserve provability because Chainlink PoR is wired into the mint path. It remains Elevated Risk because the same vault proxy was exploited, minting is allowed down to 90% reserve adequacy, governance has no onchain timelock, custody/signing details are opaque, and large exits are constrained by both redemption caps and thin DEX liquidity.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months, or sooner on any event below.
- **TVL / supply-based:** Reassess if uniBTC TVL or supply changes by more than +/-40% from the July 10, 2026 baseline.
- **Incident-based:** Any exploit, depeg >2% sustained >1h, PoR reserve shortfall, redemption queue freeze, bridge failure, or governance compromise.
- **Specific triggers:**
  1. Chainlink uniBTC PoR feed reports backing below circulating supply.
  2. PoR feed stale beyond heartbeat.
  3. `adequacyRatio` is lowered or PoR feeder / supply feeder is changed.
  4. uniBTC token or Vault implementation upgrade.
  5. ProxyAdmin or Safe ownership transfer.
  6. Safe owner addition/removal or threshold change.
  7. Disclosure of BTC custodian/signers.
  8. Introduction of an onchain timelock / Safe Delay module.
  9. New top-tier audit or bug bounty publication.

## Open TODOs (Items Not Verifiable This Session)

- **Custodian identity / signing setup** for BTC backing uniBTC.
- **Complete current cross-chain mint/burn authority enumeration** for every non-Ethereum uniBTC deployment.
- **September 2024 restitution transactions** - onchain Fuzzland-to-Bedrock reimbursement tx hashes are not published.

## Sources

- Bedrock docs: https://docs.bedrock.technology/
- Bedrock app: https://app.bedrock.technology/
- Bedrock statistics: https://app.bedrock.technology/statistics
- Bedrock audit reports: https://docs.bedrock.technology/security/audit-reports
- Bedrock GitHub org: https://github.com/Bedrock-Technology
- uniBTC GitHub: https://github.com/Bedrock-Technology/uniBTC
- DefiLlama Bedrock uniBTC: https://defillama.com/protocol/bedrock-unibtc
- DefiLlama Bedrock aggregate: https://defillama.com/protocol/bedrock
- Chainlink uniBTC PoR feed: https://data.chain.link/feeds/ethereum/mainnet/unibtc-por
- QuillAudits hack analysis: https://www.quillaudits.com/blog/hack-analysis/bedrock-2million-exploit
- BlockApex hack analysis: https://blockapex.medium.com/unibtc-hack-analysis-bffd6cebd4a8
- Babylon Labs: https://babylonlabs.io/
- Onchain verification on July 10, 2026: `totalSupply()`, `name()`, `symbol()`, `decimals()`, EIP-1967 implementation/admin slots, `owner()` on ProxyAdmin, `getThreshold()` / `getOwners()` / `getModulesPaginated()` and guard storage on the Safe, `hasRole(bytes32,address)` on Vault/token, `chainlinkReserveFeeder()`, `uniBTCSupplyFeeder()`, `feederHeartbeat()`, `outOfService()`, `paused()`, `adequacyRatio()`, WBTC `balanceOf(address)`, and Chainlink feed `latestAnswer()`, `latestRoundData()`, `description()`, `decimals()`.
