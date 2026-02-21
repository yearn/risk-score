# Protocol Risk Assessment: Royco Dawn (srRoyUSDC)

- **Assessment Date:** February 20, 2026
- **Token:** srRoyUSDC (Senior Royco USDC)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32)
- **Final Score: 3.9/5.0**

## Overview + Links

srRoyUSDC is the Senior Vault token of Royco Dawn, an on-chain yield-splitting protocol that divides yield into two tranches: Senior (conservative, protected) and Junior (enhanced returns, first-loss). Users deposit USDC into the Dawn Senior Vault (DSV) and receive srRoyUSDC tokens (ERC-4626) representing diversified Senior tranche exposure across multiple whitelisted yield markets.

The Senior Vault is curator-managed by the Royco Foundation, which allocates deposited USDC across whitelisted markets including autoUSD (Auto), savUSD (Avant), sNUSD (Neutrl), Aave v3 Core USDC, and stcUSD (Cap Finance, currently paused). Junior capital in each market absorbs losses first, providing a coverage buffer for Senior depositors.

- **Current PPS:** ~1.001074 USDC per srRoyUSDC (verified on-chain Feb 21, 2026)
- **Total Supply:** ~6,726,164 srRoyUSDC
- **Total Assets:** ~$6,733,390 USDC (of which ~$37,900 held directly in vault, ~$6,695,490 deployed via MultisigStrategy)
- **Total Holders:** ~5
- **DeFiLlama TVL (Royco V2, all chains):** ~$7.78M
- **Management Fee:** 0%
- **Performance Fee:** 10% of Senior yield, 20% of Junior yield
- **Contract Created:** January 6, 2026 (~45 days ago)

**Links:**

- [Royco Dawn Documentation](https://royco.gitbook.io/royco-dawn)
- [Dawn Senior Vault (DSV)](https://royco.gitbook.io/royco-dawn/royco-dawn/dawn-senior-vault-dsv)
- [Mechanism](https://royco.gitbook.io/royco-dawn/royco-dawn/mechanism)
- [Key Addresses](https://royco.gitbook.io/royco-dawn/royco-dawn/key-addresses)
- [Security & Audits](https://royco.gitbook.io/royco-dawn/royco-dawn/security-and-audits)
- [GitHub (roycoprotocol/royco-dawn)](https://github.com/roycoprotocol/royco-dawn)
- [Bug Bounty (Immunefi)](https://immunefi.com/bug-bounty/royco/information/)
- [DeFiLlama (Royco V2)](https://defillama.com/protocol/royco-v2)
- [Summer.fi RFC — Onboard Royco Dawn Senior Vault](https://forum.summer.fi/t/rfc-onboard-royco-dawn-lp-program-senior-vault-as-new-yield-source/681)

## Contract Addresses

| Contract | Address |
|----------|---------|
| srRoyUSDC (VaultProxy, ERC-4626) | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) |
| Implementation (ConcreteAsyncVaultImpl) | [`0x1b5cd91e61505d431d2a61192a1006146bd9bb28`](https://etherscan.io/address/0x1b5cd91e61505d431d2a61192a1006146bd9bb28) |
| Owner (Gnosis Safe 3/5) | [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190) |
| Multisig Safe (Treasury, 3/5) | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) |
| Multisig Strategy (TransparentUpgradeableProxy) | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) |
| MultisigStrategy Implementation | [`0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c`](https://etherscan.io/address/0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c) |
| RoycoFactory | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) |
| AdaptiveCurveYDM (Yield Distribution Model) | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) |
| Contract Creator | [`0xe86055afa2714dcd416594bc2db9b8fa69d70a47`](https://etherscan.io/address/0xe86055afa2714dcd416594bc2db9b8fa69d70a47) |

## Audits and Due Diligence Disclosures

Royco Dawn has been audited by Hexens, with a Cantina competitive audit recently completed (judging phase). The protocol is built on the Concrete vault framework (ConcreteAsyncVaultImpl) which was separately audited by Halborn, Code4rena, and Zellic according to the Concrete project. However, those audits cover the Concrete framework, not Royco Dawn-specific logic.

| Auditor | Scope | Date | Status | Report |
|---------|-------|------|--------|--------|
| Hexens | Royco Dawn (full audit) | ~Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn.pdf) |
| Hexens | Royco Dawn (whitelist) | ~Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn-Whitelist.pdf) |
| Cantina | Royco Dawn (competition) | Jan 20-27, 2026 | Judging (262 submissions) | [Competition Page](https://cantina.xyz/competitions/9c6e38e2-535e-47b2-83ef-29df91fbb774) |
| Cantina | Royco Dawn (whitelist) | Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Cantina-Royco-Dawn-Whitelist.pdf) |
| Spearbit | Royco V1 (not Dawn) | Oct 2024 | Completed | [Report (PDF)](https://3836750677-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FFUgP4mdwyU2SaFFJTcT6%2Fuploads%2FyMcPEXtbAbVKk8rFSLAZ%2Freport-spearbit.pdf) |
| Nethermind | Royco Boosts (not Dawn) | May 2025 | Completed | [Blog Post](https://www.nethermind.io/blog/how-nethermind-secured-royco-boosts-development) |

**Smart Contract Complexity:** Moderate — Upgradeable proxy (ERC-1967), ERC-4626 vault based on Concrete framework, MultisigStrategy for fund deployment, yield distribution model (AdaptiveCurveYDM), multi-market allocation, tranching mechanics with Protection Mode.

**Note:** The Cantina competition explicitly excluded from scope: oracle/NAV/share price manipulation, whitelisted parties behaving maliciously, external protocol bugs, centralization risks, MEV, and frontrunning. These exclusions mean some significant risk vectors remain unaudited.

### Bug Bounty

- **Platform:** Immunefi
- **Maximum Payout:** $250,000 (Critical, capped at 10% of affected funds)
- **Status:** Live since February 17, 2026
- **KYC Required:** Yes
- **Link:** https://immunefi.com/bug-bounty/royco/information/

### Safe Harbor

Royco is **not** listed on the [SEAL Safe Harbor Registry](https://safeharbor.securityalliance.org/).

## Historical Track Record

- **Royco V1 Launch:** 2024 (incentive marketplace for DeFi liquidity)
- **Royco Dawn (V2) Launch:** January 6, 2026 (~45 days in production)
- **Smart Contract Exploits:** None known. Protocol is extremely new.
- **Security Incidents:** None found in rekt.news, de.fi REKT Database, or other exploit trackers.
- **TVL:** ~$7.78M across Royco V2 (Ethereum: $4.9M, Avalanche: $2.9M). srRoyUSDC vault: ~$6.73M. TVL history shows only 4 data points starting February 18, 2026 on DeFiLlama.
- **Holder Distribution:** Only ~5 holders. Extreme concentration risk — this is a very early-stage product. The vault contract holds ~$37,900 USDC directly; the remaining ~$6.70M is deployed across underlying yield markets via MultisigStrategy.
- **Peg Stability:** srRoyUSDC is a yield-bearing vault token priced at ~1.001074 USDC (slightly above 1:1, reflecting accrued yield since January 6). The Curve pool shows a price of ~$0.986 but this pool has only ~$600 in liquidity and is not meaningful.
- **GitHub Activity:** 548 commits on main branch, 2 contributors (Shivaansh Kapoor and Ankur Dubey). v1.0.0 released February 5, 2026. Repository has 4 stars.

## Funds Management

The Senior Vault allocates deposited USDC across whitelisted markets where Junior tranche capital provides first-loss protection. The Royco Foundation curates allocations.

### Target Allocations

| Market | Protocol | Chain | Target Allocation | Status |
|--------|----------|-------|-------------------|--------|
| savUSD | Avant | Avalanche | 35% | Active |
| sNUSD | Neutrl | Ethereum | 35% | Active |
| Aave v3 Core USDC | Aave | Ethereum | 20% | Active (liquidity reserve) |
| autoUSD | Auto | Ethereum | 10% | Active |
| stcUSD | Cap Finance | Ethereum | Paused | Paused (compressed yields) |
| sUSDai | USD.ai | Arbitrum | Pending | Pending integration |

**Concentration Controls:**
- Per-market: +15 percentage points above target allowed during bootstrapping
- Per-protocol: 40% max
- Per-asset: 40% max
- Per-chain: 40% max (Ethereum exempt)
- Aave v3 USDC exempt from per-market caps

### Accessibility

- **Deposits:** KYC-gated. Participants undergo KYC verification and deposits restricted to whitelisted addresses. Not fully permissionless.
- **Withdrawals:** Request triggers up to 14-day unlock period. Vault sources liquidity from underlying Senior tranches. After unlock period, funds become claimable.
- **Fees:** 0% management fee. 10% performance fee on Senior yield.
- **Secondary Market:** Minimal. Curve pool (~$600) and Morpho Blue markets (~$2M, mostly srRoyUSDC/pmUSD, not direct USDC exit).

### Collateralization

- USDC deposits are deployed to underlying yield markets (not held as idle collateral)
- Junior tranche capital in each market absorbs losses first — coverage = Junior TVL / Senior TVL
- If losses exceed Junior coverage, Senior absorbs remaining losses
- **Protection Mode:** When underlying assets drawdown, system enters Protection Mode (1-7 days per market based on volatility):
  - Senior withdrawals pause
  - Junior deposits pause
  - 100% of yield flows to Junior to rebuild buffer
  - If recovery occurs within Protection Mode, losses are erased
  - If losses persist, Junior absorbs up to its coverage %
  - If losses exceed coverage %, Senior activates Emergency Exit
- **Minimum coverage per-market** is set at creation based on historical drawdown data
- Coverage adjustments require 3-day notice to whitelisted depositors with incremental 1% daily changes

**Collateral Concerns:**
- Underlying protocols (Avant, Neutrl, Auto, Cap Finance) are newer, less battle-tested DeFi protocols
- savUSD (Avant) on Avalanche introduces cross-chain risk
- sNUSD (Neutrl) and autoUSD (Auto) are relatively unknown protocols — limited public track record
- Junior buffer size is not publicly disclosed or easily verifiable on-chain for each market
- Vault holds only ~$37.9K USDC on-chain — the remaining ~$6.70M is deployed externally, creating reliance on underlying protocol solvency and accurate admin-reported accounting

### Provability

- srRoyUSDC exchange rate is computed on-chain via ERC-4626 (`totalAssets()` / `totalSupply()`)
- `totalAssets()` = USDC held in vault (~$37.9K) + `totalAllocatedValue()` from MultisigStrategy (~$6.70M)
- **Accounting is admin-reported:** The MultisigStrategy's `totalAllocatedValue()` is updated via `adjustTotalAssets(int256 diff, uint256 nonce)`, called by the 3/5 multisig ([`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)). This is **not** computed from on-chain positions — it is manually reported by the multisig
- **Accounting constraints (verified on-chain):**
  - Max change per update: 50 (likely basis points, ~0.5% of deployed value)
  - Cooldown between updates: 43,200 seconds (12 hours)
  - Validity period: 2,592,000 seconds (30 days)
  - Current nonce: 15 (15 updates since launch)
  - Last updated: February 20, 2026
- Yield computation and distribution use the AdaptiveCurveYDM model on-chain
- Junior/Senior coverage ratios are managed per-market, but not easily verifiable by external observers without protocol-specific tooling
- Underlying market positions must be verified by checking each external protocol individually
- No third-party verification mechanism (no Chainlink PoR, no custodian attestations)
- **Overall provability is limited**: while the vault exchange rate is on-chain, the accuracy depends on the MultisigStrategy correctly reporting deployed asset values. The max change threshold and cooldown provide some protection against sudden malicious adjustments, but do not prevent gradual misreporting

## Liquidity Risk

- **Primary Exit:** Async withdrawal from vault (ERC-7540 pattern — `maxWithdraw()` returns 0, confirming no instant redemption). Request triggers up to 14-day unlock period. Vault sources liquidity from underlying Senior tranches during this window. The 20% Aave v3 USDC allocation is described as a "liquidity reserve" but this refers to the vault's internal rebalancing speed (Aave is instant to unwind on the vault side), **not** instant withdrawals for depositors — all exits go through the request-and-wait mechanism.
- **Secondary Exit (DEX):** Curve srRoyUSDC/frxUSD pool with ~$600 TVL and zero trading volume. **Effectively no DEX liquidity.**
- **Morpho Blue Markets:**
  - srRoyUSDC/pmUSD (86% LLTV): ~$1.97M supply, 94% utilized — this is the largest secondary market, but loan asset is pmUSD (Precious Metals USD from RAAC protocol), not USDC
  - srRoyUSDC/USDC (91.5% LLTV): ~$22.4K supply, 100% utilized — tiny and fully utilized
  - Two additional markets are empty or negligible
- **Slippage Analysis:** Cannot exit via DEX without massive slippage. Only ~$600 DEX liquidity exists.
- **Withdrawal Queues:** Up to 14-day max during normal conditions. During Protection Mode (market drawdown), Senior withdrawals are paused entirely until the Protection Mode period ends (1-7 days depending on market volatility parameters).
- **Stress Scenario:** If multiple underlying markets enter Protection Mode simultaneously, all Senior withdrawals could be paused. Combined with 14-day unlock and zero DEX liquidity, holders could face extended periods unable to exit.
- **Large Holder Impact:** With only ~5 holders and ~$6.71M total, a single large withdrawal could require unwinding significant portions of underlying positions.

## Centralization & Control Risks

### Governance

The vault is controlled by a 3/5 Gnosis Safe multisig. There is **no timelock** on governance actions.

**Owner Multisig (Vault Owner):** [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190)
- **Type:** Gnosis Safe v1.3.0
- **Threshold:** 3 of 5
- **Powers:** Full administrative control — can upgrade vault implementation, change strategy, modify parameters

**Multisig Safe (Treasury):** [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)
- **Type:** Gnosis Safe v1.3.0
- **Threshold:** 3 of 5

**CRITICAL: Both multisigs share the same 5 signers:**

| Signer # | Address |
|----------|---------|
| 1 | [`0x84d37a25e46029ce161111420e07ceb78880119e`](https://etherscan.io/address/0x84d37a25e46029ce161111420e07ceb78880119e) |
| 2 | [`0xb7a526e45d9e73a191528de630ab3fa941e8dd99`](https://etherscan.io/address/0xb7a526e45d9e73a191528de630ab3fa941e8dd99) |
| 3 | [`0x1862b63be492714dfecceeefd92181c48d16e38c`](https://etherscan.io/address/0x1862b63be492714dfecceeefd92181c48d16e38c) |
| 4 | [`0x8a3a0f40c6206a870f1bd3bd7289a4688eb45fb2`](https://etherscan.io/address/0x8a3a0f40c6206a870f1bd3bd7289a4688eb45fb2) |
| 5 | [`0x5c0f850517ecb2575ff5007019be64076d15b437`](https://etherscan.io/address/0x5c0f850517ecb2575ff5007019be64076d15b437) |

All signers are EOAs with no ENS names. The identities of the signers are not publicly disclosed.

**No Timelock:** There is no timelock contract between the multisig and the vault. Governance actions (including contract upgrades) can be executed immediately upon 3/5 multisig approval. This is a significant centralization risk.

**Upgradeable Contracts:**
- srRoyUSDC vault: ERC-1967 proxy → ConcreteAsyncVaultImpl (upgradeable by owner multisig)
- MultisigStrategy: TransparentUpgradeableProxy → MultisigStrategy implementation (upgradeable)

### Programmability

- srRoyUSDC PPS is calculated on-chain via ERC-4626 standard (`totalAssets()` / `totalSupply()`)
- Yield distribution uses the on-chain AdaptiveCurveYDM model
- Fund deployment and rebalancing are executed by the MultisigStrategy, which is controlled by the 3/5 multisig — **significant manual intervention**
- Market selection, allocation targets, and coverage parameters are set by the Royco Foundation (off-chain decisions)
- Protection Mode activation and parameters are configurable
- KYC gating for deposits adds an off-chain dependency

### External Dependencies

1. **Underlying Yield Protocols (Critical):**
   - **Avant (savUSD, Avalanche)** — 35% target allocation. Newer protocol. Cross-chain dependency adds bridge risk.
   - **Neutrl (sNUSD, Ethereum)** — 35% target allocation. Newer protocol with limited public track record.
   - **Aave v3 (Ethereum)** — 20% target. Blue-chip protocol, lowest risk dependency.
   - **Auto (autoUSD, Ethereum)** — 10% target. Newer protocol.
   - **Cap Finance (stcUSD, Ethereum)** — Currently paused.
   - **USD.ai (sUSDai, Arbitrum)** — Pending integration. Cross-chain dependency.

2. **Concrete Framework (Medium):** The vault implementation uses the Concrete vault framework (ConcreteAsyncVaultImpl). Bugs in Concrete would affect srRoyUSDC.

3. **Accounting/NAV (High):** `totalAllocatedValue()` on the MultisigStrategy is **manually adjusted** by the 3/5 multisig via `adjustTotalAssets()`. There is no oracle — deployed asset values are admin-reported. The Cantina competition excluded NAV/share price manipulation from scope, confirming this is a known trust assumption. Constraints exist (max 0.5% change per update, 12-hour cooldown, 30-day validity) but the system ultimately relies on the multisig reporting accurate values.

## Operational Risk

- **Team:** Jai Bhavnani (Co-founder & CEO of Waymont, the company behind Royco). Previously co-founded Rari Capital (grew to $1.5B AUM, sold to Tribe DAO for $375M). Also founded Ambo (acquired by MyCrypto). James Folkestad is co-founder. Team is small — only 2 contributors to the GitHub repo (Shivaansh Kapoor and Ankur Dubey).
- **Funding:** Pre-seed completed. Investors include Electric Capital, Coinbase Ventures, Amber Group, and Hashed. Exact amount undisclosed.
- **Documentation:** Adequate. Gitbook documentation covers mechanism, risk framework, key addresses, and DSV. Some areas lack depth (oracle mechanism, detailed per-market coverage data). No comprehensive technical documentation for smart contract integrations.
- **Legal:** Waymont Co., based in Los Angeles, California. Founded 2022. Formal legal structure not disclosed in detail. KYC required for participation suggests regulatory compliance efforts.
- **Incident Response:** Hypernative being configured for continuous monitoring. Emergency upgrade system in place. Private security council being assembled. No publicly documented incident response plan yet.
- **License:** Not specified in contracts.

**Note on Rari Capital history:** Jai Bhavnani co-founded Rari Capital, which suffered a ~$80M exploit in April 2022 via a reentrancy vulnerability in Fuse pools and a ~$15M price manipulation attack in May 2021. Additionally, the [SEC charged Rari Capital and its three co-founders](https://www.sec.gov/newsroom/press-releases/2024-138) (September 2024) with misleading investors about automated rebalancing (was actually manual) and unregistered broker activity. The settlement resulted in **five-year officer-and-director bars** for all three co-founders, civil penalties, and disgorgement. While the current project is architecturally different, the regulatory history and the pattern of misrepresenting automation levels is relevant context — particularly given that srRoyUSDC's `totalAssets()` relies on manual multisig-reported accounting via `adjustTotalAssets()`.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Purpose | Key Events/Functions |
|----------|---------|---------|---------------------|
| srRoyUSDC Vault | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) | Vault state | `Deposit`, `Withdraw`, `Transfer`, `totalAssets()`, `totalSupply()`, `convertToAssets()` |
| Owner Multisig | [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190) | Governance | Submitted/confirmed/executed transactions, owner changes |
| MultisigStrategy | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) | Fund deployment | Strategy changes, deposits/withdrawals to underlying protocols, proxy upgrades |
| Multisig Safe (Treasury) | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) | Treasury | Large transfers, signer changes |
| RoycoFactory | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) | Factory | New market creation |
| AdaptiveCurveYDM | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) | Yield distribution | Parameter changes |

### Critical Monitoring Points

- **PPS (Price Per Share):** Track `convertToAssets(1e6)` — should be monotonically increasing. Alert on any decrease (indicates loss event or Protection Mode).
- **Total Assets vs Vault Balance:** Monitor discrepancy between `totalAssets()` and USDC actually held in vault. The ~$6.70M gap is admin-reported via `adjustTotalAssets()` — monitor for unusual adjustments.
- **Accounting Updates:** Track `adjustTotalAssets()` calls on MultisigStrategy — verify nonce increments sequentially, changes stay within 0.5% threshold, and 12-hour cooldown is respected.
- **Governance:** Monitor owner multisig for any proxy upgrade transactions. **No timelock — upgrades take effect immediately.**
- **Strategy:** Monitor MultisigStrategy for fund movements to/from underlying protocols.
- **Protection Mode:** Alert on any Protection Mode activation (Senior withdrawal pauses).
- **Holder Concentration:** Monitor for significant deposit/withdrawal activity from the ~5 holders.
- **Underlying Protocols:** Monitor health of Avant (savUSD), Neutrl (sNUSD), Auto (autoUSD), and Aave.
- **Recommended Frequency:** Hourly for PPS, governance, and strategy. Daily for underlying protocol health.

## Risk Summary

### Key Strengths

1. **Tranching mechanism provides structural protection** — Junior capital absorbs losses first, creating a buffer for Senior depositors
2. **Institutional-grade access controls** — KYC and whitelisting convert potential exploits into recoverable, legally actionable incidents
3. **Experienced founder** — Jai Bhavnani has prior DeFi experience (Rari Capital, Ambo) and backing from reputable investors (Electric Capital, Coinbase Ventures, Hashed)
4. **Active bug bounty** — $250K on Immunefi, recently launched
5. **Conservative allocation framework** — Concentration limits (40% per protocol/asset/chain), with Aave v3 USDC as a 20% liquidity reserve

### Key Risks

1. **Extremely new protocol** — Only 45 days in production (created January 6, 2026). No meaningful track record or battle-testing.
2. **Very low TVL and holder count** — ~$6.71M TVL with only ~5 holders. Not yet validated at scale.
3. **No timelock on governance** — 3/5 multisig can upgrade contracts immediately. Both vault owner and treasury share the same 5 anonymous signers.
4. **Reliance on newer underlying protocols** — 70% target allocation to Avant (savUSD) and Neutrl (sNUSD), which are relatively unknown protocols with limited public track records.
5. **No meaningful exit liquidity** — DEX liquidity is ~$600. Morpho markets are small or fully utilized. Primary exit requires 14-day withdrawal queue.

### Critical Risks

- **Upgradeable proxy with no timelock:** The vault owner (3/5 multisig) can upgrade the srRoyUSDC implementation contract at any time. This means a compromised multisig (or malicious signers) could deploy a new implementation that drains funds. There is no timelock delay giving depositors time to exit.
- **Same signers control all multisigs:** The vault owner and treasury multisig share identical signers — there is no separation of powers. Compromising 3 of 5 EOAs gives full control over the vault, treasury, and fund deployment.
- **Cantina audit not finalized:** The Cantina competition (262 submissions, $50K pool) is still in judging phase. Critical findings may not yet be remediated.
- **MultisigStrategy is upgradeable:** Fund deployment strategy can be changed via proxy upgrade, potentially redirecting funds.
- **Underlying protocol risk is opaque:** The quality and health of Avant, Neutrl, Auto, and Cap Finance positions are not easily verifiable. These protocols themselves are newer with limited audit and track record history.
- **Rari Capital exploit history:** The founder's previous project (Rari Capital) suffered an ~$80M exploit. While the current protocol is architecturally different, this is relevant context for risk assessment.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** → **PASS** (Hexens completed full audit + whitelist audit; Cantina competition with 262 submissions in judging phase)
- [ ] **Unverifiable reserves** → **CONDITIONAL PASS** (ERC-4626 exchange rate is on-chain, but underlying deployed assets rely on MultisigStrategy reporting. Verifiability is partial — vault balance ($17.5K) vs totalAssets ($6.71M) gap requires trusting strategy contracts.)
- [ ] **Total centralization** → **PASS** (3/5 multisig, not single EOA — though no timelock is a significant concern)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **4.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | 1 completed audit by Hexens (Dawn). 1 Cantina competition in judging phase (262 submissions). Spearbit/Nethermind audited V1/Boosts only. The Cantina competition excluded oracle manipulation, centralization risks, and whitelisted party misbehavior from scope. |
| Bug Bounty | $250K on Immunefi (live since Feb 17, 2026 — only 3 days old at assessment) |
| Time in Production | ~45 days (since Jan 6, 2026). V1 (different product) launched 2024. |
| TVL | ~$6.71M in srRoyUSDC vault. ~$7.78M across Royco V2. |
| Historical Incidents | None (protocol is extremely new). Founder's prior project (Rari Capital) suffered ~$80M exploit in 2022. |

Only 1 completed audit from a single firm (Hexens). Protocol is <3 months old with TVL <$10M. Bug bounty just launched. Cantina competition still in judging phase with unfinalized findings.

**Score: 4.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **4.0**

**Subcategory A: Governance — 4.5**

- 3/5 Gnosis Safe multisig (low threshold)
- **No timelock** — contract upgrades are immediate
- Both owner and treasury multisig share the same 5 anonymous EOA signers — no separation of powers
- All signers are anonymous (no ENS, no public identity disclosure)
- Upgradeable proxy (ERC-1967) for vault AND upgradeable proxy for MultisigStrategy
- No on-chain governance, no DAO, no community vote mechanism
- Pausing mechanism via Protection Mode (automatic, not admin-triggered — this is reasonable)

**Subcategory B: Programmability — 3.5**

- PPS calculated on-chain via ERC-4626
- Yield distribution uses on-chain AdaptiveCurveYDM model
- Fund deployment is controlled by MultisigStrategy — requires multisig intervention for allocation changes
- Market selection and coverage parameters set off-chain by Royco Foundation
- KYC gating adds off-chain dependency for deposits
- Protection Mode activation is partially programmatic (triggered by drawdowns)
- Hybrid system: core vault mechanics are on-chain, but allocation decisions and strategy execution are manual

**Subcategory C: External Dependencies — 4.0**

- Depends on 4-5 underlying yield protocols, most of which are newer/less established
- Avant (savUSD, Avalanche) — newer protocol, cross-chain dependency, 35% allocation
- Neutrl (sNUSD) — newer protocol, 35% allocation
- Auto (autoUSD) — newer protocol, 10% allocation
- Aave v3 — blue-chip, 20% allocation (positive)
- Concrete vault framework — additional dependency layer
- Failure of any major underlying protocol (Avant or Neutrl) would impact 35% of allocated capital

**Score: (4.5 + 3.5 + 4.0) / 3 = 4.0/5**

#### Category 3: Funds Management (Weight: 30%) — **3.75**

**Subcategory A: Collateralization — 3.5**

- 100% USDC-backed (deposits are USDC, deployed to yield markets)
- Junior tranche provides first-loss protection (coverage = Junior TVL / Senior TVL)
- Coverage ratio varies per market and is not publicly displayed in real-time
- Underlying yield comes from newer protocols (Avant, Neutrl, Auto) — collateral quality is mixed
- Protection Mode mechanism provides structural protection but pauses withdrawals
- Vault holds only ~$37.9K directly — ~$6.70M deployed externally via MultisigStrategy
- If Junior coverage is insufficient, Senior absorbs losses

**Subcategory B: Provability — 4.0**

- ERC-4626 exchange rate is on-chain (PPS verifiable)
- However, `totalAssets()` depends on MultisigStrategy's `adjustTotalAssets()` — **manually reported** by the 3/5 multisig (not computed from on-chain positions)
- Gap between vault USDC balance (~$37.9K) and reported totalAssets (~$6.73M) — requires trusting the multisig's accounting adjustments (constrained by max 0.5% per update, 12-hour cooldown)
- Individual underlying market positions are not easily auditable without protocol-specific tooling
- Per-market Junior coverage ratios are not transparently displayed
- No third-party verification mechanism (no Chainlink PoR, no custodian attestations)
- Yield computation is on-chain via AdaptiveCurveYDM
- **Self-reported accounting** with constraints is better than no reporting, but fundamentally depends on multisig honesty — particularly concerning given the SEC settlement for misrepresenting automation at Rari Capital

**Score: (3.5 + 4.0) / 2 = 3.75/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **4.0**

- Queue-based withdrawal with up to 14-day unlock period
- During Protection Mode, Senior withdrawals are paused entirely (additional delay)
- DEX liquidity is effectively zero (~$600 Curve pool)
- Morpho Blue markets exist but are small (~$2M) and mostly for pmUSD (not USDC exit)
- srRoyUSDC/USDC Morpho market has only $22.4K and is 100% utilized
- Only ~5 holders — any single large withdrawal would require unwinding underlying positions
- No established secondary market or market maker
- Same-value asset (USDC-denominated) mitigates some waiting risk
- Throttle mechanism (14-day max + Protection Mode pauses): +0.5
- Same-value asset: -0.5 (net neutral)

**Score: 4.0/5**

#### Category 5: Operational Risk (Weight: 5%) — **3.0**

- Founder Jai Bhavnani is publicly known with DeFi track record (though includes Rari Capital exploit history)
- VC-backed by reputable investors (Electric Capital, Coinbase Ventures, Hashed, Amber Group)
- Small dev team (2 GitHub contributors)
- Documentation is adequate but has gaps (oracle mechanism, per-market coverage data)
- Hypernative monitoring being configured but not yet active
- Security council being assembled but not yet formed
- No publicly documented incident response plan
- KYC requirements suggest regulatory compliance awareness
- Legal structure: Waymont Co., Los Angeles — details limited

**Score: 3.0/5**

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (4.0 × 0.20) + (4.0 × 0.30) + (3.75 × 0.30) + (4.0 × 0.15) + (3.0 × 0.05)
            = 0.80 + 1.20 + 1.125 + 0.60 + 0.15
            = 3.875
            ≈ 3.9
```

No optional modifiers apply (protocol is <2 years old, TVL <$500M).

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.0 | 20% | 0.80 |
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.875 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: ELEVATED RISK**

---

## Reassessment Triggers

- **Time-based:** Reassess in 2 months (April 2026) or when Cantina audit findings are published and remediated
- **TVL-based:** Reassess if TVL exceeds $50M or drops below $2M
- **Incident-based:** Reassess after any exploit, Protection Mode activation, or governance change
- **Governance-based:** Reassess if timelock is added, multisig threshold/signers change, or new governance mechanism is introduced
- **Audit-based:** Reassess when Cantina competition results are finalized and remediation is confirmed
- **Underlying protocol:** Reassess if any whitelisted market (Avant, Neutrl, Auto) experiences an exploit or significant issue
