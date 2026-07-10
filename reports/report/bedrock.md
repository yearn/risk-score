# Protocol Risk Assessment: Bedrock brBTC

- **Assessment Date:** May 18, 2026
- **Scope Updated:** July 10, 2026 — narrowed to brBTC only
- **Token:** brBTC
- **Chain:** Ethereum
- **Token Address:** [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646)
- **Final Score: 3.6/5.0**

## Overview + Links

Bedrock brBTC is a BTC meta-LRT. Users deposit BTC-denominated assets into the brBTC Vault and receive brBTC. The asset is intended to allocate across multiple BTC restaking venues rather than track one single backing venue.

This report is scoped to **brBTC only**. It does not assess uniBTC or uniETH as standalone assets. uniBTC is still mentioned where relevant because it is one of the accepted brBTC deposit assets and therefore an upstream dependency.

**Links:**

- [Bedrock website](https://www.bedrock.technology/)
- [Bedrock app](https://app.bedrock.technology/)
- [Bedrock docs](https://docs.bedrock.technology/)
- [Statistics dashboard](https://app.bedrock.technology/statistics)
- [GitHub — Bedrock-Technology](https://github.com/Bedrock-Technology)
- [brBTC GitHub — Bedrock-Technology/omni](https://github.com/Bedrock-Technology/omni)
- [BlockSec brBTC audit](https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf)
- [DefiLlama — Bedrock aggregate](https://defillama.com/protocol/bedrock)
- [Babylon Labs](https://babylonlabs.io/)

## Contract Addresses

### brBTC Token Layer

| Contract | Address | Role |
|----------|---------|------|
| brBTC token proxy | [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646) | User-facing brBTC token, EIP-1967 transparent proxy |
| brBTC token implementation | [`0x6fc60782295b8c3d83bba1324cd2ab1e77330fbe`](https://etherscan.io/address/0x6fc60782295b8c3d83bba1324cd2ab1e77330fbe) | Token implementation |
| brBTC ProxyAdmin | [`0x9f63269196a8828f05f2e49d1078ea7c44e7f002`](https://etherscan.io/address/0x9f63269196a8828f05f2e49d1078ea7c44e7f002) | Upgrade authority for brBTC token and brBTC Vault |

### brBTC Protocol Layer

| Contract | Address | Role |
|----------|---------|------|
| brBTC Vault proxy | [`0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386) | brBTC mint and restaking allocation vault |
| brBTC Vault implementation | [`0xC7D81a22b384e4bBE6cC3a860e246501728334C7`](https://etherscan.io/address/0xC7D81a22b384e4bBE6cC3a860e246501728334C7) | `brVault` implementation |

### Governance Layer

| Safe | Address | Threshold | Controls |
|------|---------|-----------|----------|
| Bedrock admin Safe | [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A) | 3/5 | Owns brBTC ProxyAdmin `0x9f632691…` |
| brBTC ops Safe | [`0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9) | 3/4 | Holds `DEFAULT_ADMIN_ROLE` on brBTC Vault |

All thresholds/owners were read live via `getThreshold()` / `getOwners()` in the original verification pass. ProxyAdmin ownership was read via `owner()`. `DEFAULT_ADMIN_ROLE` was confirmed via `hasRole(bytes32(0), <safe>)`.

**Signer overlap:** signer [`0x09610d4239c8f3413509202DCcC7e27C6B0a47A3`](https://etherscan.io/address/0x09610d4239c8f3413509202DCcC7e27C6B0a47A3) appears in multiple Bedrock governance Safes, and signer [`0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32`](https://etherscan.io/address/0x1fc76b7C6F092e0566Ce9Bbb9c6803Ba5e45Ba32) appears in both the uniBTC and brBTC Safe set. This reduces effective independence between Bedrock admin paths.

## How brBTC Works

- **Deposit assets accepted:** uniBTC, FBTC, cbBTC, WBTC, M-BTC.
- **Mint flow:** User-facing mint is atomic through the brBTC Vault.
- **Restaking allocations:** Babylon Labs, Kernel DAO, SatLayer, Pell Network, Symbiotic, and Mellow Finance. Each venue is a distinct smart-contract and/or protocol counterparty.
- **PoR:** No public Chainlink Proof-of-Reserve feed or equivalent independent reserve feed was found for brBTC. Reserve accounting appears internal to the Bedrock system.
- **Vault status:** `outOfService = false` in the original onchain verification pass.
- **Redemption:** TODO — Bedrock's public documentation does not specify brBTC redemption fee, delay, or queue mechanics. The brBTC docs pages document minting/bridging rather than a complete redemption flow; the dApp is JS-rendered. Treat this as a material disclosure gap.

## Audits and Due Diligence Disclosures

| Scope | Firm | Date | Link |
|-------|------|------|------|
| brBTC / BR contracts | BlockSec | Dec 16, 2024 | [PDF](https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf) |

brBTC has one published BlockSec audit. The brBTC codebase is separate from Bedrock's uniBTC repository: brBTC lives in [`Bedrock-Technology/omni`](https://github.com/Bedrock-Technology/omni), while uniBTC lives in [`Bedrock-Technology/uniBTC`](https://github.com/Bedrock-Technology/uniBTC). The September 2024 uniBTC exploit is therefore not treated as a direct exploit of brBTC code, but uniBTC remains relevant as an accepted brBTC input asset and as a shared Bedrock governance/ecosystem dependency.

### Bug Bounty

- **No public Immunefi / Cantina / Sherlock / Code4rena bug bounty program found.** Direct URL [immunefi.com/bug-bounty/bedrock/](https://immunefi.com/bug-bounty/bedrock/) returns 404. The Bedrock docs site has no dedicated bug-bounty page.
- **SEAL Safe Harbor: NOT registered.** Confirmed against the onchain SafeHarborRegistry [`0x8f72fcf695523a6fc7dd97eafdd7a083c386b7b6`](https://etherscan.io/address/0x8f72fcf695523a6fc7dd97eafdd7a083c386b7b6) — no Bedrock-related address (vault, token, or deployer) appeared in the registry adoption logs during the original verification pass.

## Historical Track Record

- **Time in production:** brBTC has been live since approximately December 2024, or about 19 months as of July 2026.
- **Scale:** brBTC is materially smaller than Bedrock's uniBTC product. The original onchain verification pass read **121.37 brBTC** total supply on Ethereum (`12,137,141,779` sats). brBTC is not tracked as a separate DeFiLlama protocol page in the same way as Bedrock aggregate / uniBTC.
- **Bedrock aggregate TVL context:** DeFiLlama reported **$310.87M** Bedrock aggregate TVL on July 10, 2026. This should be treated as ecosystem context, not brBTC-specific TVL.
- **Incident history:** No brBTC-specific exploit was identified in this review. Bedrock did suffer a September 2024 uniBTC mint-validation exploit, but that occurred in a different codebase and before brBTC's launch. It remains relevant only as an operational-history signal for the same organization.

## Funds Management

### Accessibility

| Token | Mint | Redeem | Fees | Permissioning |
|-------|------|--------|------|---------------|
| brBTC | Atomic through brBTC Vault | TODO (delay/queue not documented) | TODO | Permissionless |

### Collateralization

- **Accepted backing assets:** uniBTC, FBTC, cbBTC, WBTC, and M-BTC. This creates issuer/custody dependencies on multiple wrapped BTC providers and on Bedrock's own uniBTC.
- **Restaking venue spread:** brBTC allocates across Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, and Mellow. This diversification reduces dependence on one venue but compounds the number of independent slashing, oracle, upgrade, and smart-contract failure paths.
- **Custody / reserve visibility:** TODO — no brBTC-specific public PoR feed, no complete per-venue allocation report, and no named BTC custodian/signing arrangement was found in public Bedrock materials.

### Provability

brBTC has weak public reserve provability relative to uniBTC. The report found no Chainlink PoR feed for brBTC and no independent public feed that ties brBTC supply to backing collateral across the accepted BTC wrappers and restaking venues. Users must rely on Bedrock's internal accounting and operational controls.

## Liquidity Risk

- **Secondary market liquidity:** brBTC had no meaningful reported 24h DEX volume on CoinGecko in the original review. Treat secondary-market exit as effectively unavailable for material size.
- **Primary exit:** Protocol redemption is therefore the binding exit path, but fee, queue, and delay mechanics are not publicly documented. This is the single largest liquidity disclosure gap.
- **CEX listings:** None disclosed in CoinGecko for brBTC in the original review.

## Centralization & Control Risks

### Governance

- brBTC token and brBTC Vault are upgradeable transparent proxies.
- The Bedrock admin Safe is 3-of-5 and owns the brBTC ProxyAdmin.
- The brBTC ops Safe is 3-of-4 and holds `DEFAULT_ADMIN_ROLE` on the brBTC Vault.
- No Safe Guard or Delay module was configured on the relevant Bedrock Safes in the original onchain verification pass. A threshold signature can therefore execute upgrades or privileged actions without an onchain delay.
- Signer overlap across Bedrock Safes weakens practical separation between product lines.

### Programmability

brBTC's user-facing mint is atomic, but venue allocation is operator/admin driven across six restaking venues. The system is not a simple immutable wrapper; it depends on privileged operational choices and upgradeable contracts.

### External Dependencies

| Dependency | Used by brBTC | Criticality |
|-----------|---------------|-------------|
| uniBTC | Accepted deposit asset | High — upstream Bedrock BTC LRT and custody/PoR assumptions |
| WBTC / FBTC / cbBTC / M-BTC | Accepted deposit assets | High — wrapped BTC issuer/custody risk |
| Babylon Labs | BTC restaking venue | High |
| Kernel DAO | BTC restaking venue | High |
| SatLayer | BTC restaking venue | High |
| Pell Network | BTC restaking venue | High |
| Symbiotic | Restaking venue | High |
| Mellow Finance | Restaking / vault venue | High |
| Chainlink CCIP | Cross-chain path | High — bridge security affects multi-chain peg |
| Undisclosed custody/signing setup | BTC backing control | Critical unknown |

## Operational Risk

- **Team transparency:** Bedrock/RockX leadership is public. Zhuling Chen is CEO of both Bedrock and RockX; Alex Lam is a RockX co-founder.
- **Legal structure:** Per Bedrock [Terms of Use](https://docs.bedrock.technology/legal/terms-of-use.md), the website and protocol are operated by **Golden Bull Enterprises Limited**, formed under the laws of the **British Virgin Islands**.
- **Documentation:** Public docs cover Bedrock architecture and audits, but brBTC-specific redemption and reserve-accounting disclosures are thin.
- **Incident handling:** The prior uniBTC incident response was credible at the organization level (pause, patch, re-audit, user reimbursement by Fuzzland), but it was not a brBTC incident and should not be over-weighted as brBTC code history.

## Monitoring

### Critical

1. **brBTC Vault** [`0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386`](https://etherscan.io/address/0x1419b48e5C1f5ce413Cf02D6dcbe1314170E3386):
   - `outOfService()` state changes.
   - `Upgraded` events.
   - `RoleGranted` / `RoleRevoked` for `DEFAULT_ADMIN_ROLE`, `OPERATOR_ROLE`, and other privileged roles.
2. **brBTC token** [`0x2eC37d45FCAE65D9787ECf71dc85a444968f6646`](https://etherscan.io/address/0x2eC37d45FCAE65D9787ECf71dc85a444968f6646):
   - `totalSupply()` changes.
   - Implementation upgrades.
3. **Governance Safes:**
   - Bedrock admin Safe [`0xAeE017052DF6Ac002647229D58B786E380B9721A`](https://etherscan.io/address/0xAeE017052DF6Ac002647229D58B786E380B9721A).
   - brBTC ops Safe [`0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9`](https://etherscan.io/address/0x1f3c54ec74f1a5c0BC19af04dadFa1A677231aC9).
   - Monitor owner additions/removals and threshold changes.
4. **Restaking venue changes:** alert if Bedrock adds/removes a brBTC venue or materially changes allocation methodology.
5. **Public reserve disclosures:** alert if Bedrock publishes a brBTC PoR feed, per-venue allocation report, or custodian disclosure.

### Recommended Frequency

- Vault state and upgrades: every block.
- Governance Safe activity: daily.
- brBTC supply reconciliation: daily.
- Restaking venue announcements and docs changes: daily.
- TVL / market liquidity: daily.

## Appendix: Contract Architecture

```
Governance Layer
================
Bedrock Admin Safe 0xAeE01705… (3/5)
  └── owns brBTC ProxyAdmin 0x9f632691…
        ├── admin ──> brBTC token 0x2eC37d…
        └── admin ──> brBTC Vault 0x1419b4…

brBTC Ops Safe 0x1f3c54ec… (3/4)
  └── DEFAULT_ADMIN_ROLE ──> brBTC Vault

Token / Vault Layer
===================
brBTC token 0x2eC37d…646
  └── mint/redeem through brBTC Vault 0x1419b4…3386
        └── accepts deposits: uniBTC, FBTC, cbBTC, WBTC, M-BTC

Restaking / External Layer
==========================
brBTC Vault
  └── allocates across Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, Mellow

Critical Unknowns
=================
No brBTC-specific public PoR
No public brBTC redemption fee/delay documentation
Undisclosed custody/signing setup
```

---

## Risk Summary

### Key Strengths

1. **Separate brBTC codebase and audit:** brBTC is not the same codebase as the exploited uniBTC vault; it has a dedicated BlockSec audit.
2. **Multisig governance rather than single EOA:** brBTC admin paths are controlled by Safes.
3. **Doxxed leadership and known legal entity:** Bedrock / RockX leadership is public, and Terms of Use identify a BVI operating entity.
4. **Venue diversification:** brBTC is not dependent on a single BTC restaking venue.

### Key Risks

1. **No brBTC-specific public Proof-of-Reserve.** Users cannot independently reconcile brBTC supply to per-venue reserves from a public feed.
2. **Redemption mechanics are not publicly documented.** Fee, delay, queue, and processing path remain TODO.
3. **Very thin secondary liquidity.** Material exits appear dependent on protocol redemption.
4. **Upgradeable contracts with no onchain timelock.** Safe threshold signatures can upgrade contracts or change privileged roles without an onchain delay.
5. **Compounded restaking/counterparty exposure.** Babylon, Kernel DAO, SatLayer, Pell, Symbiotic, and Mellow each add independent failure/slashing paths.
6. **Accepted-asset risk.** brBTC accepts multiple wrapped BTC assets, including uniBTC, so upstream issuer/custody failures can affect brBTC.
7. **One audit only and no public bug bounty.**

### Critical Risks

- brBTC does not trigger a terminal critical gate because it has a published audit, verified contracts, and multisig governance. The unresolved risk is narrower than the original combined Bedrock scope, but no public brBTC PoR, undocumented redemption, thin liquidity, and no timelock still require strict caps and enhanced monitoring.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASS. brBTC has a dedicated BlockSec audit.
- [x] **Unverifiable reserves** — BORDERLINE. There is no brBTC-specific public PoR or per-venue reserve feed. Not marked as a hard gate only because the contract source is verified and minting is through a public vault, but this remains a major score driver.
- [x] **Total centralization** — PASS. Governance uses 3-of-5 and 3-of-4 Safes, not a single EOA.

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**
- One brBTC-specific BlockSec audit.
- No public bug bounty program.
- Moderate brBTC-specific contract surface, with cross-chain and restaking allocation components.
- **Score: 3.0**

**Subcategory B: Historical Track Record**
- brBTC live since roughly December 2024.
- No brBTC-specific exploit identified.
- Small scale and limited public liquidity history.
- **Score: 3.0**

**Audits & Historical Score = (3.0 + 3.0) / 2 = 3.0**

**Score: 3.0/5** — One dedicated audit and no brBTC-specific incident justify a lower score than the original combined Bedrock assessment, though no bug bounty and limited production history keep it above low risk.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**
- 3-of-5 Safe owns brBTC ProxyAdmin; 3-of-4 Safe controls brBTC Vault admin role.
- No timelock, no Safe Guard / Delay module in the original verification pass.
- Signer overlap across Bedrock Safes.
- **Score: 3.8**

**Subcategory B: Programmability**
- Mint is onchain, but restaking venue allocation and operational management are privileged/admin-driven.
- **Score: 3.25**

**Subcategory C: External Dependencies**
- Six restaking venues, multiple wrapped BTC issuers, Chainlink CCIP, and undisclosed custody/signing setup.
- **Score: 4.25**

**Centralization Score = (3.8 + 3.25 + 4.25) / 3 = 3.77**

**Score: 3.8/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**
- Intended BTC-denominated backing through accepted BTC wrappers and restaking positions.
- Collateral quality is mixed and includes multiple issuer/custody dependencies.
- Per-venue balances and brBTC-specific reserve reconciliation are not publicly available.
- **Score: 3.75**

**Subcategory B: Provability**
- No brBTC-specific PoR.
- No public per-venue reserve dashboard sufficient to independently reconcile backing.
- **Score: 4.0**

**Funds Management Score = (3.75 + 4.0) / 2 = 3.875**

**Score: 3.9/5** — The absence of public reserve proofs remains the main constraint, but the brBTC-only scope removes unrelated uniBTC/uniETH mechanics from this category.

#### Category 4: Liquidity Risk (Weight: 15%)

- brBTC has effectively no useful secondary DEX exit.
- Protocol redemption is the binding exit path, but redemption mechanics are not publicly documented.
- **Score: 4.0**

**Score: 4.0/5** — Thin secondary liquidity and undocumented redemption still warrant an elevated liquidity score, but this is brBTC-specific rather than a combined liquidity assessment across three assets.

#### Category 5: Operational Risk (Weight: 5%)

- Doxxed leadership and legal entity are positives.
- Documentation gaps are material for brBTC specifically.
- Prior uniBTC incident is an organizational caution but not direct brBTC code history.
- **Score: 2.25**

**Score: 2.25/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.600 |
| Centralization & Control | 3.8 | 30% | 1.140 |
| Funds Management | 3.9 | 30% | 1.170 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 2.25 | 5% | 0.113 |
| **Subtotal** | | | **3.623** |

**Modifiers:**
- No brBTC-specific public PoR and undocumented redemption mechanics are already captured in Funds Management and Liquidity; no extra modifier applied.
- Prior uniBTC exploit is not applied as a direct brBTC incident modifier because brBTC uses a separate codebase.

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

brBTC should be treated as an elevated-risk BTC restaking asset. Narrowing the scope to brBTC lowers the score materially versus the original combined Bedrock report, but strict caps remain appropriate until Bedrock publishes brBTC-specific reserve proofs and complete redemption mechanics.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months, or sooner on any of the events below.
- **TVL / supply-based:** Reassess if brBTC supply changes by more than ±40% from the latest verified baseline.
- **Incident-based:** Any exploit, depeg >2% sustained >1h, redemption queue freeze, restaking-venue loss, or governance compromise.
- **Specific triggers:**
  1. brBTC implementation upgrade or brBTC Vault implementation upgrade.
  2. ProxyAdmin or Safe ownership transfer.
  3. Safe owner addition/removal or threshold change.
  4. brBTC adds/removes a restaking venue.
  5. Bedrock publishes brBTC PoR or per-venue reserve reporting.
  6. Bedrock publishes brBTC redemption fee/delay/queue mechanics.
  7. Introduction of a timelock on brBTC upgrades.
  8. New audit or bug bounty publication.

## Open TODOs (Items Not Verifiable This Session)

- **brBTC reserve proof / per-venue allocations** — no public brBTC-specific PoR or independently reconciliable allocation feed found.
- **brBTC redemption flow** — exact fee, delay, and queue mechanics are not documented publicly.
- **Custody/signing setup** for accepted BTC assets and restaked positions is not fully disclosed.

## Sources

- Bedrock docs: https://docs.bedrock.technology/
- Bedrock app: https://app.bedrock.technology/
- Bedrock statistics: https://app.bedrock.technology/statistics
- Bedrock audit reports: https://docs.bedrock.technology/security/audit-reports
- Bedrock GitHub org: https://github.com/Bedrock-Technology
- brBTC GitHub: https://github.com/Bedrock-Technology/omni
- BlockSec brBTC audit: https://github.com/Bedrock-Technology/omni/blob/main/blocksec_bedrock_br_v1.0-signed.pdf
- DefiLlama Bedrock aggregate: https://defillama.com/protocol/bedrock
- Babylon Labs: https://babylonlabs.io/
- Onchain verification from original review: `totalSupply()`, `name()`, `symbol()`, `decimals()`, EIP-1967 implementation/admin slots, `owner()` on ProxyAdmins, `getThreshold()` / `getOwners()` on Safes, `hasRole(bytes32,address)` on brBTC Vault.
