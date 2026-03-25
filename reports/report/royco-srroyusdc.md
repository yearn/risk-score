# Protocol Risk Assessment: Royco Dawn (srRoyUSDC)

- **Assessment Date:** March 25, 2026
- **Token:** srRoyUSDC (Senior Royco USDC)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32)
- **Final Score: 3.7/5.0**

## Overview + Links

srRoyUSDC is the Senior Vault token of Royco Dawn, an on-chain yield-splitting protocol that divides yield into two tranches: Senior (conservative, protected) and Junior (enhanced returns, first-loss). Users deposit USDC into the Dawn Senior Vault (DSV) and receive srRoyUSDC tokens (ERC-4626) representing diversified Senior tranche exposure across multiple whitelisted yield markets.

The Senior Vault is curator-managed by the Royco Foundation, which allocates deposited USDC across whitelisted markets including autoUSD (Auto), savUSD (Avant), sNUSD (Neutrl), Aave v3 Core USDC, and stcUSD (Cap Finance, currently paused). Junior capital in each market absorbs losses first, providing a coverage buffer for Senior depositors.

- **Current PPS:** ~1.005571 USDC per srRoyUSDC (verified on-chain March 25, 2026)
- **Total Supply:** ~10,673,575 srRoyUSDC
- **Total Assets:** ~$10,733,046 USDC (100% deployed via MultisigStrategy, $0 held directly in vault)
- **Total Holders:** ~8 (3 with meaningful holdings; 1 EOA holds ~69% of supply)
- **DeFiLlama TVL (Royco V2, all chains):** ~$5.16M (Ethereum: $5.15M, Avalanche: $3.5K)
- **Management Fee:** 0%
- **Performance Fee:** 0% (currently; documentation states 10% of Senior yield, 20% of Junior yield)
- **Contract Created:** January 6, 2026 (~78 days ago)

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
| VAULT_MANAGER (Gnosis Safe 3/4) | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) |
| Multisig Safe (Treasury, 3/5) | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) |
| Multisig Strategy (TransparentUpgradeableProxy) | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) |
| MultisigStrategy Implementation | [`0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c`](https://etherscan.io/address/0xb417a7c43a7a8aa27bba2b2bb4639878532f9d0c) |
| RoycoVaultMakinaStrategy (inactive) | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) |
| ConcreteFactory (Vault Proxy Admin) | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) |
| ConcreteFactory Owner (Gnosis Safe 3/5) | [`0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C`](https://etherscan.io/address/0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C) |
| RoycoFactory (AccessManager) | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) |
| AdaptiveCurveYDM (Yield Distribution Model) | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) |
| Contract Creator | [`0xe86055afa2714dcd416594bc2db9b8fa69d70a47`](https://etherscan.io/address/0xe86055afa2714dcd416594bc2db9b8fa69d70a47) |

## Audits and Due Diligence Disclosures

Royco Dawn has been audited by Hexens, with a Cantina competitive audit still in judging phase (262 submissions, judging by Royco team). The protocol is built on the Concrete vault framework (ConcreteAsyncVaultImpl) which was separately audited by Halborn, Code4rena, and Zellic according to the Concrete project. However, those audits cover the Concrete framework, not Royco Dawn-specific logic.

| Auditor | Scope | Date | Status | Report |
|---------|-------|------|--------|--------|
| Hexens | Royco Dawn (full audit) | ~Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn.pdf) |
| Hexens | Royco Dawn (whitelist) | ~Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Hexens-Royco-Dawn-Whitelist.pdf) |
| Cantina | Royco Dawn (competition) | Jan 20-27, 2026 | Judging (262 submissions, judged by Royco team) | [Competition Page](https://cantina.xyz/competitions/9c6e38e2-535e-47b2-83ef-29df91fbb774) |
| Cantina | Royco Dawn (whitelist) | Jan 2026 | Completed | [Report (PDF)](https://github.com/roycoprotocol/royco-dawn/blob/main/audit/Cantina-Royco-Dawn-Whitelist.pdf) |
| Spearbit | Royco V1 (not Dawn) | Oct 2024 | Completed | [Report (PDF)](https://3836750677-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FFUgP4mdwyU2SaFFJTcT6%2Fuploads%2FyMcPEXtbAbVKk8rFSLAZ%2Freport-spearbit.pdf) |
| Nethermind | Royco Boosts (not Dawn) | May 2025 | Completed | [Blog Post](https://www.nethermind.io/blog/how-nethermind-secured-royco-boosts-development) |

**Smart Contract Complexity:** Moderate — Upgradeable proxy (ERC-1967), ERC-4626 vault based on Concrete framework, MultisigStrategy for fund deployment, RoycoVaultMakinaStrategy (inactive), yield distribution model (AdaptiveCurveYDM), multi-market allocation, tranching mechanics with Protection Mode, OZ AccessManager for factory roles.

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
- **Royco Dawn (V2) Launch:** January 6, 2026 (~78 days in production)
- **Smart Contract Exploits:** None known. Protocol is still very new.
- **Security Incidents:** None found in rekt.news, de.fi REKT Database, or other exploit trackers.
- **TVL:** ~$5.16M across Royco V2 on DeFiLlama (Ethereum: $5.15M, Avalanche: $3.5K). srRoyUSDC vault `totalAssets()`: ~$10.73M (discrepancy likely due to DeFiLlama methodology vs on-chain reported value via MultisigStrategy).
- **Holder Distribution:** ~8 holders with non-zero balances (3 with meaningful holdings). One EOA holds ~7.36M srRoyUSDC (~69% of supply). Morpho Blue holds ~2.83M (~26%, collateral from Morpho lending). Curve pool holds ~489K (~4.6%). Extreme concentration risk. The vault holds $0 USDC directly — 100% of ~$10.73M is deployed via MultisigStrategy.
- **Peg Stability:** srRoyUSDC is a yield-bearing vault token priced at ~1.005571 USDC (reflecting accrued yield since January 6). The Curve CurveStableSwapNG pool ([`0x8fc753f96752b35f64d1bae514e6cf8db0b9322e`](https://etherscan.io/address/0x8fc753f96752b35f64d1bae514e6cf8db0b9322e)) holds ~489K srRoyUSDC, a significant improvement from initial launch (~$600).
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
- **Fees:** 0% management fee. 0% performance fee on-chain (both fees and fee recipients are set to zero/address(0) as verified on-chain March 25, 2026). Documentation states 10%/20% for Senior/Junior yield — either not yet enabled or changed since documentation was written. Fee updates require VAULT_MANAGER role (3/4 multisig).
- **Secondary Market:** Improved since launch. Curve CurveStableSwapNG pool holds ~489K srRoyUSDC. Morpho Blue markets (~$2M, mostly srRoyUSDC/pmUSD, not direct USDC exit).

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
- Vault holds $0 USDC on-chain — 100% of ~$10.73M is deployed externally via MultisigStrategy, creating full reliance on underlying protocol solvency and accurate admin-reported accounting

### Provability

- srRoyUSDC exchange rate is computed on-chain via ERC-4626 (`totalAssets()` / `totalSupply()`)
- `totalAssets()` = `totalAllocatedValue()` from MultisigStrategy (~$10.73M). Vault holds $0 USDC directly — 100% of assets are reported by the strategy.
- **Accounting is admin-reported:** The MultisigStrategy's `totalAllocatedValue()` is updated via `adjustTotalAssets(int256 diff, uint256 nonce)`, called by the 3/5 treasury multisig ([`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)). This is **not** computed from on-chain positions — it is manually reported by the multisig.
- **Accounting constraints (verified on-chain March 25, 2026):**
  - Max change per update: 50 (basis points, ~0.5% of deployed value)
  - Cooldown between updates: 43,200 seconds (12 hours)
  - Validity period: 2,592,000 seconds (30 days)
  - Current nonce: 37 (37 updates since launch, ~1 update every 2 days)
  - Last updated: March 25, 2026
- Yield computation and distribution use the AdaptiveCurveYDM model on-chain
- Junior/Senior coverage ratios are managed per-market, but not easily verifiable by external observers without protocol-specific tooling
- Underlying market positions must be verified by checking each external protocol individually
- No third-party verification mechanism (no Chainlink PoR, no custodian attestations)
- **Overall provability is limited**: while the vault exchange rate is on-chain, the accuracy depends entirely on the MultisigStrategy correctly reporting deployed asset values ($0 held in vault vs ~$10.73M reported). The max change threshold and cooldown provide some protection against sudden malicious adjustments, but do not prevent gradual misreporting

## Liquidity Risk

- **Primary Exit:** Async withdrawal from vault (ERC-7540 pattern — `maxWithdraw()` returns 0, confirming no instant redemption). Request triggers up to 14-day unlock period. Vault sources liquidity from underlying Senior tranches during this window. The 20% Aave v3 USDC allocation is described as a "liquidity reserve" but this refers to the vault's internal rebalancing speed (Aave is instant to unwind on the vault side), **not** instant withdrawals for depositors — all exits go through the request-and-wait mechanism.
- **Secondary Exit (DEX):** Curve CurveStableSwapNG pool ([`0x8fc753f96752b35f64d1bae514e6cf8db0b9322e`](https://etherscan.io/address/0x8fc753f96752b35f64d1bae514e6cf8db0b9322e)) holds ~489K srRoyUSDC — significant improvement from ~$600 at initial assessment. Meaningful DEX liquidity now exists.
- **Morpho Blue Markets:**
  - srRoyUSDC/pmUSD (86% LLTV): ~$1.97M supply — this is the largest secondary market, but loan asset is pmUSD (Precious Metals USD from RAAC protocol), not USDC. Morpho Blue holds ~2.83M srRoyUSDC (~26% of total supply) as collateral.
  - srRoyUSDC/USDC (91.5% LLTV): ~$22.4K supply, 100% utilized — tiny and fully utilized
  - Two additional markets are empty or negligible
- **Slippage Analysis:** Curve pool now provides meaningful exit liquidity (~$490K). Large exits still face slippage given the vault's ~$10.7M total assets.
- **Withdrawal Queues:** Up to 14-day max during normal conditions. During Protection Mode (market drawdown), Senior withdrawals are paused entirely until the Protection Mode period ends (1-7 days depending on market volatility parameters).
- **Stress Scenario:** If multiple underlying markets enter Protection Mode simultaneously, all Senior withdrawals could be paused. Combined with 14-day unlock, holders could face extended periods unable to exit. The Curve pool now provides a partial escape valve for smaller positions.
- **Large Holder Impact:** One EOA holds ~69% of supply (~7.36M srRoyUSDC). A withdrawal of this magnitude would require unwinding the vast majority of underlying positions.

## Centralization & Control Risks

### Governance

The vault governance involves multiple multisigs and two factory contracts with different access controls.

**Owner Multisig (Vault Owner):** [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190)
- **Type:** Gnosis Safe v1.3.0
- **Threshold:** 3 of 5 signers (anonymous EOAs, no ENS)
- **Powers:** Vault owner (strategy management, parameters). Also holds `ADMIN_UPGRADER_ROLE` on RoycoFactory with 1-day execution delay. Controls MultisigStrategy proxy upgrades (no timelock).

**VAULT_MANAGER Multisig:** [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997)
- **Type:** Gnosis Safe
- **Threshold:** 3 of 4 signers (3 signers overlap with Owner multisig, 1 new signer)
- **Powers:** Can update fees (management/performance), toggle queue, manage withdrawal requests

**Multisig Safe (Treasury):** [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)
- **Type:** Gnosis Safe v1.3.0
- **Threshold:** 3 of 5 signers (same 5 signers as Owner multisig — no separation of powers)
- **Powers:** Controls `adjustTotalAssets()` on MultisigStrategy (admin-reported accounting)

**ConcreteFactory Owner:** [`0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C`](https://etherscan.io/address/0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C)
- **Type:** Gnosis Safe v1.3.0
- **Threshold:** 3 of 5 signers (completely different signers from Royco — these are Concrete protocol team)
- **Powers:** Approves and deploys vault implementation upgrades via ConcreteFactory

**Signer Overlap:** The Owner and Treasury multisigs share identical 5 signers. The VAULT_MANAGER shares 3 of those 5 plus 1 additional signer. Effectively, the same group of anonymous EOAs controls vault administration, treasury, and fee management. The ConcreteFactory owner is a separate party (Concrete team).

**Timelock Architecture:**
- **RoycoFactory (AccessManager):** Uses OZ AccessManager with `minSetback` of 432,000 seconds (5 days) and `expiration` of 604,800 seconds (7 days). The Owner multisig has `ADMIN_UPGRADER_ROLE` with a 1-day (86,400s) execution delay for factory-mediated operations.
- **Vault implementation upgrades:** Controlled by the ConcreteFactory (owned by Concrete team 3/5 multisig). The vault's `upgrade()` function requires `msg.sender == factory` (the ConcreteFactory). This means vault implementation upgrades require cooperation between the Concrete team and Royco team — a dual-control mechanism.
- **MultisigStrategy upgrades:** Controlled by a ProxyAdmin owned by the Royco Owner multisig (3/5). **No timelock** — can be upgraded immediately. This is the most direct risk vector.
- **Accounting adjustments:** No timelock, but constrained by max 0.5% change per update and 12-hour cooldown.

**Upgradeable Contracts:**
- srRoyUSDC vault: ERC-1967 proxy → ConcreteAsyncVaultImpl (upgradeable via ConcreteFactory, requires Concrete team approval)
- MultisigStrategy: TransparentUpgradeableProxy → MultisigStrategy implementation (upgradeable by Owner multisig, **no timelock**)
- RoycoVaultMakinaStrategy: New strategy added, currently inactive (0 allocation)

### Programmability

- srRoyUSDC PPS is calculated on-chain via ERC-4626 standard (`totalAssets()` / `totalSupply()`)
- Yield distribution uses the on-chain AdaptiveCurveYDM model
- Fund deployment and rebalancing are executed by the MultisigStrategy, which is controlled by the 3/5 treasury multisig — **significant manual intervention**
- A second strategy (RoycoVaultMakinaStrategy) has been added but is currently inactive (0 allocation). It uses an OZ AccessManager authority rather than direct multisig control, potentially for automated fund deployment via Makina.
- Market selection, allocation targets, and coverage parameters are set by the Royco Foundation (off-chain decisions)
- Fee management (management/performance fees) requires VAULT_MANAGER role (3/4 multisig). Both fees are currently 0%.
- `accrueYield()` is callable by anyone (no access control) — triggers yield computation and fee share minting (currently mints 0 since fees are 0%)
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

2. **Concrete Framework (Medium-High):** The vault implementation uses the Concrete vault framework (ConcreteAsyncVaultImpl). Bugs in Concrete would affect srRoyUSDC. Additionally, the ConcreteFactory (owned by the Concrete team's 3/5 multisig) serves as the vault's proxy admin and controls implementation upgrades. This adds a **third-party trust dependency** — the Concrete team can approve new vault implementations.

3. **Accounting/NAV (High):** `totalAllocatedValue()` on the MultisigStrategy is **manually adjusted** by the 3/5 treasury multisig via `adjustTotalAssets()`. There is no oracle — deployed asset values are admin-reported. The vault holds $0 USDC directly — 100% of `totalAssets()` (~$10.73M) is reported via this mechanism. The Cantina competition excluded NAV/share price manipulation from scope, confirming this is a known trust assumption. Constraints exist (max 0.5% change per update, 12-hour cooldown, 30-day validity) but the system ultimately relies on the multisig reporting accurate values.

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
| srRoyUSDC Vault | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) | Vault state | `Deposit`, `Withdraw`, `Transfer`, `totalAssets()`, `totalSupply()`, `convertToAssets()`, `accrueYield()` |
| Owner Multisig | [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190) | Governance | Submitted/confirmed/executed transactions, owner changes |
| VAULT_MANAGER | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) | Fee/queue mgmt | Fee updates, queue toggles, signer changes |
| MultisigStrategy | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) | Fund deployment | `adjustTotalAssets()`, strategy changes, proxy upgrades |
| RoycoVaultMakinaStrategy | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) | Future strategy | `allocateFunds()`, `totalAllocatedValue()` (currently 0) |
| Multisig Safe (Treasury) | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) | Treasury/accounting | `adjustTotalAssets()` calls, large transfers, signer changes |
| ConcreteFactory | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) | Vault proxy admin | Implementation approvals, vault upgrades |
| RoycoFactory | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) | AccessManager | Role grants, scheduled operations, market creation |
| AdaptiveCurveYDM | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) | Yield distribution | Parameter changes |

### Critical Monitoring Points

- **PPS (Price Per Share):** Track `convertToAssets(1e6)` — should be monotonically increasing. Alert on any decrease (indicates loss event or Protection Mode). Current: ~1.005571.
- **Total Assets:** Monitor `totalAssets()` — currently 100% dependent on MultisigStrategy's admin-reported `totalAllocatedValue()` ($0 held in vault). Track correlation with DeFiLlama TVL data for sanity checking.
- **Accounting Updates:** Track `adjustTotalAssets()` calls on MultisigStrategy — verify nonce increments sequentially (current: 37), changes stay within 0.5% threshold, and 12-hour cooldown is respected.
- **Governance:** Monitor Owner multisig for MultisigStrategy proxy upgrade transactions (**no timelock**). Monitor ConcreteFactory for vault implementation upgrade proposals. Monitor RoycoFactory for role grants and scheduled operations.
- **Fee Changes:** Monitor VAULT_MANAGER multisig for `updateManagementFee()` and `updatePerformanceFee()` calls. Currently both 0% — any change would enable fee share minting via `accrueYield()`.
- **Strategy:** Monitor MultisigStrategy for fund movements. Monitor RoycoVaultMakinaStrategy for activation (currently 0 allocation).
- **Protection Mode:** Alert on any Protection Mode activation (Senior withdrawal pauses).
- **Holder Concentration:** Monitor the dominant EOA holder (~69% of supply) and Morpho Blue (~26%) for significant movements.
- **Underlying Protocols:** Monitor health of Avant (savUSD), Neutrl (sNUSD), Auto (autoUSD), and Aave.
- **Recommended Frequency:** Hourly for PPS, governance, and strategy. Daily for underlying protocol health. Immediate alerts for proxy upgrades and fee changes.

## Risk Summary

### Key Strengths

1. **Tranching mechanism provides structural protection** — Junior capital absorbs losses first, creating a buffer for Senior depositors
2. **Institutional-grade access controls** — KYC and whitelisting convert potential exploits into recoverable, legally actionable incidents
3. **Experienced founder** — Jai Bhavnani has prior DeFi experience (Rari Capital, Ambo) and backing from reputable investors (Electric Capital, Coinbase Ventures, Hashed)
4. **Active bug bounty** — $250K on Immunefi
5. **Conservative allocation framework** — Concentration limits (40% per protocol/asset/chain), with Aave v3 USDC as a 20% liquidity reserve
6. **Dual-control vault upgrades** — Vault implementation upgrades require Concrete team (ConcreteFactory owner, separate 3/5 multisig) cooperation, not just Royco team. RoycoFactory uses OZ AccessManager with 5-day minSetback and 1-day execution delay for upgrader role.
7. **Improved DEX liquidity** — Curve pool grew from ~$600 to ~$490K since launch

### Key Risks

1. **Still a new protocol** — ~78 days in production (created January 6, 2026). Limited track record.
2. **Extreme holder concentration** — One EOA holds ~69% of supply. ~$10.73M total assets with only ~8 holders.
3. **MultisigStrategy upgradeable without timelock** — The Owner multisig (3/5) can upgrade the MultisigStrategy proxy immediately. This controls how all funds are deployed.
4. **Reliance on newer underlying protocols** — 70% target allocation to Avant (savUSD) and Neutrl (sNUSD), which are relatively unknown protocols with limited public track records.
5. **100% of assets admin-reported** — Vault holds $0 USDC directly; the entire ~$10.73M totalAssets is reported via MultisigStrategy's `adjustTotalAssets()`. No oracle or on-chain verification.

### Critical Risks

- **MultisigStrategy upgradeable with no timelock:** The Owner multisig (3/5) controls the MultisigStrategy's ProxyAdmin and can upgrade the strategy implementation immediately. A malicious upgrade could redirect funds or bypass the 0.5% accounting constraint. This is the most direct risk vector.
- **Same signers across multisigs:** The Owner and Treasury multisig share identical 5 signers. The VAULT_MANAGER (3/4) shares 3 of those signers. Compromising 3 of 5 EOAs gives control over vault administration, treasury, and accounting.
- **ConcreteFactory as third-party trust dependency:** The Concrete team's 3/5 multisig controls vault implementation upgrades. While this provides dual-control protection, it also means a compromise of the Concrete team could affect all Concrete-based vaults, not just srRoyUSDC.
- **Underlying protocol risk is opaque:** The quality and health of Avant, Neutrl, Auto, and Cap Finance positions are not easily verifiable. These protocols themselves are newer with limited audit and track record history.
- **Rari Capital exploit history:** The founder's previous project (Rari Capital) suffered an ~$80M exploit. While the current protocol is architecturally different, this is relevant context for risk assessment.

---

## Token Minting Analysis

**Question: Can new srRoyUSDC tokens be minted out of thin air (without depositing underlying USDC)?**

### Current Implementation — No Direct Minting Without Assets

The vault implementation (ConcreteAsyncVaultImpl) uses standard ERC-4626 minting:

1. **`mint(uint256 shares, address receiver)`** — Standard ERC-4626. Internally calls `SafeERC20.safeTransferFrom()` to pull USDC from the caller before minting shares. **Cannot mint without depositing USDC.**

2. **`deposit(uint256 assets, address receiver)`** — Standard ERC-4626 deposit. Same underlying flow — requires USDC transfer first.

3. **Fee Share Minting (`accrueYield()`)** — The vault can mint shares to fee recipients via `accrueManagementFee()` and `accruePerformanceFee()`. These are the only code paths that mint shares without requiring a corresponding USDC deposit. However:
   - Both management fee and performance fee are currently **0%** (verified on-chain March 25, 2026)
   - Both fee recipient addresses are `address(0)` (no recipient set)
   - `accrueYield()` is publicly callable (no access control), but currently mints 0 shares since fees are 0%
   - Fee changes require the VAULT_MANAGER role (3/4 Gnosis Safe at [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997))
   - Fee caps exist: `MAX_MANAGEMENT_FEE` and `MAX_PERFORMANCE_FEE` (set in the implementation)

### Indirect Inflation Vectors

While tokens cannot be directly minted without assets, the following mechanisms could effectively inflate or dilute value:

1. **`adjustTotalAssets()` — PPS Inflation (Constrained)**
   - The treasury multisig (3/5) can call `adjustTotalAssets(int256 diff, uint256 nonce)` on the MultisigStrategy to inflate the reported `totalAllocatedValue()`
   - This inflates `totalAssets()` and thus PPS, making existing tokens appear more valuable
   - Constrained: max 50 bps (~0.5%) per update, 12-hour cooldown, 30-day validity period
   - At ~$10.73M total assets, each update can inflate by at most ~$53.6K
   - This doesn't mint new tokens but can gradually misrepresent value

2. **Fee Manipulation → Fee Share Minting**
   - The VAULT_MANAGER (3/4 Safe) could set non-zero fees via `updateManagementFee()` / `updatePerformanceFee()`
   - Then `accrueYield()` (callable by anyone) would mint fee shares to the fee recipient
   - Combined with `adjustTotalAssets()` inflation: the multisig could inflate totalAssets (creating fake "yield"), then fee shares would be minted based on this fake yield
   - This is a **realistic attack vector** requiring cooperation of the VAULT_MANAGER (3/4 Safe) and Treasury (3/5 Safe) — which share overlapping signers

3. **MultisigStrategy Proxy Upgrade (No Timelock)**
   - The Owner multisig (3/5) can upgrade the MultisigStrategy implementation immediately
   - A malicious implementation could remove the 0.5% cap on `adjustTotalAssets()`, enabling unlimited PPS inflation
   - Or could add a function that drains deposited USDC directly

4. **Vault Implementation Upgrade (Dual-Control)**
   - A new vault implementation could include an unrestricted `mint()` function
   - Requires ConcreteFactory owner (Concrete team 3/5 multisig) to approve the new implementation
   - This is the highest-impact but hardest-to-execute vector — requires cooperation between two separate teams

### Conclusion

**In the current implementation, there is no function that can mint srRoyUSDC tokens without depositing underlying USDC.** The `mint` function is standard ERC-4626 and requires USDC transfer. Fee minting is disabled (0% fees, no recipient set).

The most realistic risk vector is the MultisigStrategy proxy upgrade (no timelock, controlled by Owner 3/5 multisig), which could remove accounting constraints and enable PPS manipulation or fund diversion. The fee manipulation path (VAULT_MANAGER sets fees + treasury inflates totalAssets) is also viable but slower-acting due to the 0.5% cap and 12-hour cooldown on accounting adjustments.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **No audit** → **PASS** (Hexens completed full audit + whitelist audit; Cantina competition with 262 submissions still in judging)
- [ ] **Unverifiable reserves** → **CONDITIONAL PASS** (ERC-4626 exchange rate is on-chain, but 100% of deployed assets rely on MultisigStrategy reporting. $0 held in vault vs ~$10.73M reported totalAssets — entirely dependent on admin honesty.)
- [ ] **Total centralization** → **PASS** (multiple multisigs with dual-control for vault upgrades via ConcreteFactory — though MultisigStrategy upgrade has no timelock)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **3.75**

| Aspect | Assessment |
|--------|-----------|
| Audits | Hexens completed full audit + whitelist audit (Dawn). Cantina competition in judging phase (262 submissions, ~2 months since competition ended). Cantina whitelist audit completed. Spearbit/Nethermind audited V1/Boosts only. The Cantina competition excluded oracle manipulation, centralization risks, and whitelisted party misbehavior from scope. |
| Bug Bounty | $250K on Immunefi (live since Feb 17, 2026 — ~5 weeks active) |
| Time in Production | ~78 days (since Jan 6, 2026). V1 (different product) launched 2024. |
| TVL | ~$10.73M in srRoyUSDC vault (admin-reported). ~$5.16M across Royco V2 on DeFiLlama. |
| Historical Incidents | None in ~78 days. Founder's prior project (Rari Capital) suffered ~$80M exploit in 2022. |

Hexens audit completed; Cantina competition still in judging after ~2 months (concerning delay — 262 submissions, only high-severity eligible for rewards). Protocol approaching 3 months with growing TVL. Bug bounty established for 5+ weeks. Cantina competition excluded key risk vectors from scope.

**Score: 3.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.83**

**Subcategory A: Governance — 4.0**

- 3/5 Gnosis Safe multisig for vault ownership
- Vault implementation upgrades require dual-control: ConcreteFactory (Concrete team 3/5 multisig) + Royco team. This is significantly better than single-party control.
- RoycoFactory uses OZ AccessManager with 5-day minSetback and 1-day execution delay for upgrader role.
- **MultisigStrategy proxy upgrade has no timelock** — Owner multisig can upgrade immediately. This is the primary remaining governance risk.
- Owner and Treasury multisig share the same 5 anonymous EOA signers — no separation of powers for those functions
- VAULT_MANAGER is a separate 3/4 multisig (3 overlapping signers + 1 new)
- No on-chain governance, no DAO, no community vote mechanism
- Pausing mechanism via Protection Mode (automatic, not admin-triggered — this is reasonable)

**Subcategory B: Programmability — 3.5**

- PPS calculated on-chain via ERC-4626
- Yield distribution uses on-chain AdaptiveCurveYDM model
- Fund deployment is controlled by MultisigStrategy — requires multisig intervention for allocation changes
- New RoycoVaultMakinaStrategy added (inactive, 0 allocation) — may indicate move toward automated allocation
- `accrueYield()` is publicly callable (no access control) — currently no effect since fees are 0%
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
- Concrete vault framework — serves as proxy admin and controls vault upgrades. Adds third-party trust dependency.
- Failure of any major underlying protocol (Avant or Neutrl) would impact 35% of allocated capital

**Score: (4.0 + 3.5 + 4.0) / 3 = 3.83/5**

#### Category 3: Funds Management (Weight: 30%) — **3.75**

**Subcategory A: Collateralization — 3.5**

- 100% USDC-backed (deposits are USDC, deployed to yield markets)
- Junior tranche provides first-loss protection (coverage = Junior TVL / Senior TVL)
- Coverage ratio varies per market and is not publicly displayed in real-time
- Underlying yield comes from newer protocols (Avant, Neutrl, Auto) — collateral quality is mixed
- Protection Mode mechanism provides structural protection but pauses withdrawals
- Vault holds $0 USDC directly — 100% of ~$10.73M deployed externally via MultisigStrategy
- If Junior coverage is insufficient, Senior absorbs losses

**Subcategory B: Provability — 4.0**

- ERC-4626 exchange rate is on-chain (PPS verifiable)
- However, `totalAssets()` depends entirely on MultisigStrategy's `adjustTotalAssets()` — **manually reported** by the 3/5 treasury multisig (not computed from on-chain positions)
- Vault holds $0 USDC — reported totalAssets is ~$10.73M. The entire PPS depends on trusting the multisig's accounting adjustments (constrained by max 0.5% per update, 12-hour cooldown, nonce 37 confirming regular updates)
- Individual underlying market positions are not easily auditable without protocol-specific tooling
- Per-market Junior coverage ratios are not transparently displayed
- No third-party verification mechanism (no Chainlink PoR, no custodian attestations)
- Yield computation is on-chain via AdaptiveCurveYDM
- **Self-reported accounting** with constraints is better than no reporting, but fundamentally depends on multisig honesty — particularly concerning given the SEC settlement for misrepresenting automation at Rari Capital

**Score: (3.5 + 4.0) / 2 = 3.75/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **3.5**

- Queue-based withdrawal with up to 14-day unlock period
- During Protection Mode, Senior withdrawals are paused entirely (additional delay)
- **Improved DEX liquidity:** Curve CurveStableSwapNG pool holds ~489K srRoyUSDC (~$490K) — significant improvement from ~$600 at launch
- Morpho Blue markets exist (~$2M) — Morpho holds ~2.83M srRoyUSDC (26% of supply) as collateral, mostly for pmUSD (not direct USDC exit)
- srRoyUSDC/USDC Morpho market has only $22.4K and is 100% utilized
- Extreme holder concentration — one EOA holds ~69% of supply. A single large withdrawal would require unwinding most underlying positions.
- Same-value asset (USDC-denominated) mitigates some waiting risk
- Throttle mechanism (14-day max + Protection Mode pauses): +0.5
- Same-value asset: -0.5 (net neutral)

**Score: 3.5/5**

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
            = (3.75 × 0.20) + (3.83 × 0.30) + (3.75 × 0.30) + (3.5 × 0.15) + (3.0 × 0.05)
            = 0.75 + 1.149 + 1.125 + 0.525 + 0.15
            = 3.699
            ≈ 3.7
```

No optional modifiers apply (protocol is <2 years old, TVL <$500M).

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.75 | 20% | 0.75 |
| Centralization & Control | 3.83 | 30% | 1.149 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.699 / 5.0** |

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

- **Time-based:** Reassess in 2 months (May 2026) or when Cantina audit judging concludes and remediation is publicly confirmed
- **TVL-based:** Reassess if TVL exceeds $50M or drops below $2M
- **Incident-based:** Reassess after any exploit, Protection Mode activation, or governance change
- **Governance-based:** Reassess if timelock is added to MultisigStrategy, multisig threshold/signers change, or new governance mechanism is introduced
- **Strategy-based:** Reassess when RoycoVaultMakinaStrategy is activated (currently 0 allocation)
- **Fee-based:** Reassess if performance or management fees are changed from 0%
- **Underlying protocol:** Reassess if any whitelisted market (Avant, Neutrl, Auto) experiences an exploit or significant issue
