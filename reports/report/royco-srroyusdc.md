# Protocol Risk Assessment: Royco Dawn (srRoyUSDC)

- **Assessment Date:** March 26, 2026
- **Token:** srRoyUSDC (Senior Royco USDC)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32)
- **Final Score: 3.35/5.0**

## Overview + Links

srRoyUSDC is the Senior Vault token of Royco Dawn, an on-chain yield-splitting protocol that divides yield into two tranches: Senior (conservative, protected) and Junior (enhanced returns, first-loss). Users deposit USDC into the Dawn Senior Vault (DSV) and receive srRoyUSDC tokens (ERC-4626) representing diversified Senior tranche exposure across multiple whitelisted yield markets.

The Senior Vault is curator-managed by the Royco Foundation, which allocates deposited USDC across whitelisted markets including autoUSD (Auto), savUSD (Avant), sNUSD (Neutrl), Aave v3 Core USDC, and stcUSD (Cap Finance, currently paused). Junior capital in each market absorbs losses first, providing a coverage buffer for Senior depositors.

Royco's tranche mechanics are enforced on-chain, but the vault's capital path is trust-based: `MultisigStrategy` hands full custody of allocated funds to the treasury multisig.

- **Current PPS:** ~1.005571 USDC per srRoyUSDC (verified on-chain March 25, 2026)
- **Total Supply:** ~10,673,575 srRoyUSDC
- **Total Assets:** ~$10,733,046 USDC (100% deployed via MultisigStrategy, $0 held directly in vault)
- **Total Holders:** ~8 (3 with meaningful holdings; 1 EOA holds ~69% of supply)
- **DeFiLlama TVL (Royco V2, all chains):** ~$5.16M (Ethereum: $5.15M, Avalanche: $3.5K)
- **Management Fee:** 0%
- **Performance Fee:** 0% at vault level (`performanceFee()` returns 0, recipient is `address(0)`). Fees are charged at the Dawn market layer instead: 10% on ST yield, 0% on JT yield, 45% on yield share — verified via accountant `getState()`. Documentation claims "10% Senior / 20% Junior" are partially outdated (JT fee is 0%, yield share fee is undocumented).
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
| RoycoVaultMakinaStrategy | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) |
| ConcreteFactory (Vault Proxy Admin) | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) |
| ConcreteFactory Owner (Gnosis Safe 3/5) | [`0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C`](https://etherscan.io/address/0xdc29BD10CB9000dffBb5aAcD30606c66f07c866C) |
| RoycoFactory (AccessManager) | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) |
| AdaptiveCurveYDM (Yield Distribution Model) | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) |
| RoycoFactory Proxy (Dawn Market Factory) | [`0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C`](https://etherscan.io/address/0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C) |
| Contract Creator | [`0xe86055afa2714dcd416594bc2db9b8fa69d70a47`](https://etherscan.io/address/0xe86055afa2714dcd416594bc2db9b8fa69d70a47) |

### Royco Dawn Market Contracts (On-Chain Tranching)

The Treasury multisig ([`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)) holds Senior Tranche tokens in each market, linking the srRoyUSDC vault to the Royco Dawn tranching system. All contracts are verified on Etherscan.

Blueprint's own architecture docs describe MultisigStrategy as a design that "simply forwards deposits to a multi-sig wallet and retrieves" them later: [`Architecture.md#3.1.3 Multisig Strategies`](https://github.com/Blueprint-Finance/concrete-earn-v2-bug-bounty/blob/a9ace6154cb2728bc9d3d4c5019e040fb2d4b562/doc/Architecture.md#313-multisig-strategies).

The configured `multiSig` address was also verified live on-chain to be a standard Safe v1.4.1, not a custom treasury contract: `MultisigStrategy.getMultiSig()` returns [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8), and that address responds to `VERSION()` = `1.4.1`, `getThreshold()` = `3`, and `getOwners()` = 5 owners.
| Market | Contract | Address |
|--------|----------|---------|
| Neutrl sNUSD | Kernel | [`0x0aE0978B868804929fd4C06B3B22D9197B8cd3c6`](https://etherscan.io/address/0x0aE0978B868804929fd4C06B3B22D9197B8cd3c6) |
| Neutrl sNUSD | Senior Tranche (ROY-ST-sNUSD) | [`0x2070Af1C865f5d764F673Baf5654822947e71243`](https://etherscan.io/address/0x2070Af1C865f5d764F673Baf5654822947e71243) |
| Neutrl sNUSD | Junior Tranche (ROY-JT-sNUSD) | [`0x3821eBea3BBbE23F3dea74f24082BD0f0b67f6c5`](https://etherscan.io/address/0x3821eBea3BBbE23F3dea74f24082BD0f0b67f6c5) |
| Neutrl sNUSD | Accountant | [`0xCaa3F221fCf3c2EC7b6a49B73BB810cca35e1085`](https://etherscan.io/address/0xCaa3F221fCf3c2EC7b6a49B73BB810cca35e1085) |
| Neutrl sNUSD (legacy active market) | Kernel | [`0xbdf2d357464727ee136a5f81479554f86759993a`](https://etherscan.io/address/0xbdf2d357464727ee136a5f81479554f86759993a) |
| Neutrl sNUSD (legacy active market) | Senior Tranche (ROY-ST-sNUSD) | [`0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e`](https://etherscan.io/address/0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e) |
| Neutrl sNUSD (legacy active market) | Junior Tranche (ROY-JT-sNUSD) | [`0x58c578d7e4f291ee1a11399d03e4418443e7a134`](https://etherscan.io/address/0x58c578d7e4f291ee1a11399d03e4418443e7a134) |
| Neutrl sNUSD (legacy active market) | Accountant | [`0x3371871e8901899fec4539ae2d1737d84acb6d89`](https://etherscan.io/address/0x3371871e8901899fec4539ae2d1737d84acb6d89) |
| Tokemak autoUSD | Kernel | [`0x8748D1c21CC550B435487F473d9Aaf6C84dA46A6`](https://etherscan.io/address/0x8748D1c21CC550B435487F473d9Aaf6C84dA46A6) |
| Tokemak autoUSD | Senior Tranche (ROY-ST-autoUSD) | [`0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE`](https://etherscan.io/address/0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE) |
| Tokemak autoUSD | Junior Tranche (ROY-JT-autoUSD) | [`0x6f0D6567099621deE3850C673d73c532071A888d`](https://etherscan.io/address/0x6f0D6567099621deE3850C673d73c532071A888d) |
| Tokemak autoUSD | Accountant | [`0xB0166629D78E3876F570f18B154A60b99024b6f4`](https://etherscan.io/address/0xB0166629D78E3876F570f18B154A60b99024b6f4) |
| Avant savUSD (Avalanche) | Kernel | [`0x7240FF91b471217FF93349184ABE9f102Ca1955C`](https://snowtrace.io/address/0x7240FF91b471217FF93349184ABE9f102Ca1955C) |
| Avant savUSD (Avalanche) | Senior Tranche (ROY-ST-savUSD) | [`0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9`](https://snowtrace.io/address/0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9) |
| Avant savUSD (Avalanche) | Junior Tranche (ROY-JT-savUSD) | [`0x2dfde7811567562aaB39D0A292e43aa7195f6Cf6`](https://snowtrace.io/address/0x2dfde7811567562aaB39D0A292e43aa7195f6Cf6) |
| Avant savUSD (Avalanche) | Accountant | [`0x1067405d143a3973Dc48fD0Ea14ed6c1AF20dbb1`](https://snowtrace.io/address/0x1067405d143a3973Dc48fD0Ea14ed6c1AF20dbb1) |

#### On-Chain Coverage Data (Verified March 26, 2026)

Each market's Accountant contract exposes `getState()` which returns all NAV and coverage parameters. Junior capital absorbs losses first, enforced by the kernel/accountant contracts ([source code](https://github.com/roycoprotocol/royco-dawn/blob/main/src/accountant/RoycoAccountant.sol)).

| Market | ST Effective NAV | JT Effective NAV | Coverage (JT/ST) | Required Coverage | Market State |
|--------|-----------------|-----------------|-------------------|-------------------|--------------|
| Neutrl sNUSD | ~1,172,599 sNUSD | ~145,187 sNUSD | 12.4% | 10% | PERPETUAL |
| Tokemak autoUSD | ~1,168,619 autoUSD | ~145,849 autoUSD | 12.5% | 10% | PERPETUAL |

Smokehouse USDC and Maple syrupUSDC markets have dust-level Senior NAV (<$10) and are not currently allocated by the Treasury. They contain only Junior capital (~$20K and ~$19.6K respectively).

- **Treasury multisig holds**: ~1,172,390 ROY-ST-sNUSD shares at [`0x2070Af1C865f5d764F673Baf5654822947e71243`](https://etherscan.io/address/0x2070Af1C865f5d764F673Baf5654822947e71243), ~1,981,280 ROY-ST-sNUSD shares at [`0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e`](https://etherscan.io/address/0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e), ~1,168,613 ROY-ST-autoUSD shares at [`0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE`](https://etherscan.io/address/0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE), and on Avalanche ~4,278,073 ROY-ST-savUSD shares at [`0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9`](https://snowtrace.io/address/0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9)
- **Junior depositors**: 2-3 independent addresses per market (e.g., [`0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476`](https://etherscan.io/address/0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476), [`0xfef0bb8df6210e441f03de23edafb0150129e176`](https://etherscan.io/address/0xfef0bb8df6210e441f03de23edafb0150129e176))
- **No impermanent loss** recorded in any market (both `stImpermanentLoss` and `jtImpermanentLoss` are 0)
- **Beta = 1.0** (1e18) in all markets — Junior uses the same underlying asset as Senior, meaning JT losses correlate with ST losses
- **Per-market Fixed-Term (Protection Mode) configuration differs significantly:**
  - **Neutrl sNUSD: `fixedTermDuration = 0`** — this market is **permanently PERPETUAL** and can never enter Protection Mode. When JT covers ST losses, `jtImpermanentLoss` is immediately erased — JT permanently absorbs the loss with zero recovery period. ST withdrawals are never paused. Liquidation threshold: ~100.09%.
  - **Tokemak autoUSD: `fixedTermDuration = 172,800s (2 days)`** — enters Protection Mode when JT covers losses. ST withdrawals blocked for up to 2 days. If no recovery, JT absorbs permanently. Liquidation threshold: 122.5%.
- **Dawn-level protocol fees (per-market, separate from vault fees):**
  - ST protocol fee: 10% of Senior yield
  - JT protocol fee: 0%
  - Yield share protocol fee: 45% of the risk premium (yield share) paid from ST to JT
  - Fee recipient: [`0x05ea95aE815809D77153Ed3500Ad6d936712b639`](https://etherscan.io/address/0x05ea95aE815809D77153Ed3500Ad6d936712b639)
  - No fees taken during Fixed-Term state
- **JT withdrawal is coverage-constrained:** The kernel enforces `postOpSyncTrancheAccountingAndEnforceCoverage` on every JT redemption — if the withdrawal would push utilization above 1.0 (coverage below required %), the tx reverts. JT can only withdraw the surplus above the coverage requirement. Current withdrawable surplus: ~28K sNUSD (Neutrl), ~28K autoUSD (Tokemak). However, coverage can still breach the threshold via underlying asset depreciation (no withdrawal needed) — this is when the loss escalation flow kicks in.

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

| Market | Protocol | Chain | Target | Actual (March 27, 2026) | Status |
|--------|----------|-------|--------|------------------------|--------|
| savUSD | Avant | Avalanche | 35% | **~40%** (~$4.278M) | Active — at concentration cap |
| sNUSD | Neutrl | Ethereum | 35% | **~29.4%** (~$3.153M, across 2 markets) | Active — under target |
| Aave v3 Core USDC | Aave | Ethereum | 20% | **~19.7%** (~$2.108M) | Active (liquidity reserve) |
| autoUSD | Auto | Ethereum | 10% | **~10.9%** (~$1.169M) | Active |
| stcUSD | Cap Finance | Ethereum | Paused | 0% | Paused (compressed yields) |
| sUSDai | USD.ai | Arbitrum | Pending | 0% | Pending integration |

Actual allocations computed from Treasury multisig token balances (see [Reserve Location Reconciliation](#reserve-location-reconciliation-verified-march-27-2026)). Target allocations are set off-chain by the Royco Foundation curator — not stored in any contract.

**Concentration Controls:**
- Per-protocol: 40% max — Avant is currently at the cap (~40%)
- Per-asset: 40% max
- Per-chain: 40% max (Ethereum exempt) — Avalanche at ~40% (Avant savUSD only)
- Aave v3 USDC exempt from per-market caps

### Accessibility

- **Deposits:** KYC-gated. Participants undergo KYC verification and deposits restricted to whitelisted addresses. Not fully permissionless.
- **Withdrawals:** Request triggers up to 14-day unlock period. Vault sources liquidity from underlying Senior tranches. After unlock period, funds become claimable.
- **Fees:** 0% management fee, 0% performance fee at the vault level (`managementFee()` and `performanceFee()` both return 0 with `address(0)` recipients, verified on-chain). Fees are charged at the Dawn market layer: 10% on ST yield (`stProtocolFeeWAD`), 0% on JT yield (`jtProtocolFeeWAD`), 45% on yield share / risk premium (`yieldShareProtocolFeeWAD`) — verified via accountant `getState()`. Documentation claims "10% Senior / 20% Junior" are partially outdated. Vault-level fee updates require VAULT_MANAGER role (3/4 multisig).
- **Secondary Market:** Improved since launch. Curve CurveStableSwapNG pool holds ~489K srRoyUSDC. Morpho Blue markets: srRoyUSDC/USDC (~$272K supply, 84% utilized), srRoyUSDC/pmUSD (~$1.99M supply, 91% utilized — loan asset is pmUSD, not direct USDC exit).

### Collateralization

- USDC deposits are deployed to underlying yield markets (not held as idle collateral)
- Junior tranche capital in each market absorbs losses first — this is enforced on-chain by each market's RoycoAccountant contract (verified in [source code](https://github.com/roycoprotocol/royco-dawn/blob/main/src/accountant/RoycoAccountant.sol) and on deployed contracts). The loss waterfall: JT effective NAV is reduced first; if JT is depleted, residual losses hit ST as `stImpermanentLoss`.
- **On-chain coverage verified (March 26, 2026):** Neutrl sNUSD: 12.4% (required 10%), Tokemak autoUSD: 12.5% (required 10%). See [On-Chain Coverage Data](#on-chain-coverage-data-verified-march-26-2026) for full breakdown.
- If losses exceed Junior coverage, Senior absorbs remaining losses
- **Loss Escalation Flow (enforced on-chain by kernel/accountant):**

  The flow differs per market depending on the `fixedTermDuration` parameter. Note: srRoyUSDC vault holders always face the 14-day async withdrawal queue at the Concrete vault layer regardless of market state below.

  **Path A — Permanently PERPETUAL markets (`fixedTermDuration = 0`): Neutrl sNUSD (~29% of vault)**
  1. **Normal:** ST and JT deposit/redeem instantly at market level (subject to coverage).
  2. **Loss occurs:** JT covers ST losses. `jtImpermanentLoss` is **immediately erased** — JT permanently absorbs the loss with zero recovery period. Market stays PERPETUAL. ST can always withdraw. No Protection Mode, no withdrawal pause, no recovery window for JT.
  3. **Severe loss → Liquidation threshold (~100.09%):** If utilization breaches the liquidation threshold, ST can exit with a self-liquidation bonus sourced from JT's remaining NAV. If JT is fully depleted, remaining losses hit ST as `stImpermanentLoss`.

  **Path B — Fixed-Term markets (`fixedTermDuration > 0`): Tokemak autoUSD (~11% of vault, 2-day term)**
  1. **Normal (PERPETUAL):** ST and JT deposit/redeem instantly at market level (subject to coverage).
  2. **Small loss → Fixed-Term (Protection Mode):** When JT covers ST drawdowns and `jtImpermanentLoss` exceeds dust tolerance, market transitions to Fixed-Term. **ST withdrawals blocked** (protects JT from ST withdrawing covered capital). JT deposits blocked (protects existing JT from dilution). ST deposits and JT redemptions remain enabled (JT can still exit surplus above coverage). YDM curve frozen. No protocol fees taken.
  3. **Recovery within fixed term:** Underlying asset recovers before the term expires, `jtImpermanentLoss` is repaid from ST appreciation, and the market returns to PERPETUAL.
  4. **No recovery, term expires:** `jtImpermanentLoss` is **permanently zeroed** — JT absorbs the loss forever with no recourse. Market returns to PERPETUAL. ST is made whole at JT's expense.
  5. **Severe loss → Liquidation threshold (122.5%):** The market is forced back to PERPETUAL regardless of Fixed-Term status. ST can withdraw with a self-liquidation bonus from JT's remaining NAV. If JT is fully depleted, remaining losses hit ST as `stImpermanentLoss`.

  **Impact on srRoyUSDC:** During Fixed-Term (Tokemak only, up to 2 days), the Treasury multisig cannot redeem Senior Tranche tokens from the affected market, blocking vault liquidity sourcing for that sleeve. Neutrl never blocks withdrawals. The srRoyUSDC vault itself is not aware of market states.
- Coverage adjustments require 3-day notice to whitelisted depositors with incremental 1% daily changes
- **Loss propagation from Dawn markets to Senior vault is indirect:** While the Royco Dawn kernel/accountant contracts enforce Junior-first loss coverage on-chain, the srRoyUSDC Concrete vault itself cannot read these contracts. The Treasury multisig holds the Senior Tranche tokens and calls `adjustTotalAssets()` on the MultisigStrategy to report the net value. The loss waterfall (underlying drawdown → JT absorption → residual ST loss) is enforced at the market level, but the reporting of the net result to the vault is mediated by the multisig.

**Collateral Concerns:**
- Underlying protocols (Avant, Neutrl, Auto, Cap Finance) are newer, less battle-tested DeFi protocols
- savUSD (Avant) on Avalanche introduces cross-chain risk
- sNUSD (Neutrl) and autoUSD (Auto) are relatively unknown protocols — limited public track record
- **Junior coverage is verifiable at the market level but indirect from the vault:** Each market's Accountant exposes `getState()` returning JT effective NAV, coverage parameters, and impermanent loss. However, the srRoyUSDC Concrete vault has no on-chain link to these contracts — it relies on the Treasury multisig holding Senior Tranche tokens and reporting values via `adjustTotalAssets()`. The tranching enforcement is on-chain, but the vault's view of it is trust-based.
- **Junior capital is concentrated:** Only 2-3 depositor addresses per market. Junior depositors could withdraw (subject to coverage enforcement — kernel blocks JT redemption if it would breach coverage).
- **Coverage buffer is thin:** Active markets have 12.4-12.5% actual coverage vs 10% required — only ~2.5% buffer above minimum.
- **Beta = 1.0:** In all markets, Junior uses the same underlying asset as Senior, meaning JT and ST losses are correlated. JT does not provide diversification — only a capital buffer.
- Vault holds $0 USDC directly — 100% of ~$10.73M is deployed externally via MultisigStrategy. Importantly, this strategy is a **full-custody handoff** design: the vault calls `allocateFunds()`, the strategy's `_allocateToPosition()` forwards USDC directly to the Treasury multisig via `safeTransfer(multiSig, amount)`, and assets return only if the multisig cooperates with `_retrieveAssetsFromMultisig()` / `safeTransferFrom(multiSig, ...)`. There is no on-chain guarantee that forwarded funds will be deployed to approved markets or returned to the vault. Once funds reach the Treasury multisig, that multisig can break the expected flow and use the funds freely.
- Vault holds $0 USDC directly — 100% of ~$10.73M is deployed externally via MultisigStrategy. Importantly, this strategy is a **full-custody handoff** design: the vault calls `allocateFunds()`, the strategy's `_allocateToPosition()` forwards USDC directly to the Treasury multisig via `safeTransfer(multiSig, amount)`, and assets return only if the multisig cooperates with `_retrieveAssetsFromMultisig()` / `safeTransferFrom(multiSig, ...)`. There is no on-chain guarantee that forwarded funds will be deployed to approved markets or returned to the vault. Once funds reach the Treasury multisig, that multisig can break the expected flow and use the funds freely.

#### Reserve Location Reconciliation (Verified March 27, 2026)

I traced the current reserve path further by combining live `balanceOf()` reads on Ethereum and Avalanche, Royco deployment configs, and treasury USDC transfer history.

| Chain | Position | Contract | Treasury Balance | Approx. Raw Value |
|------|----------|----------|------------------|-------------------|
| Ethereum | Aave aUSDC | [`0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c`](https://etherscan.io/address/0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c) | ~2,108,035.93 aUSDC | ~$2.108M |
| Ethereum | ROY-ST-sNUSD | [`0x2070Af1C865f5d764F673Baf5654822947e71243`](https://etherscan.io/address/0x2070Af1C865f5d764F673Baf5654822947e71243) | ~1,172,390.32 shares | ~$1.172M raw shares |
| Ethereum | ROY-ST-sNUSD (legacy active market) | [`0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e`](https://etherscan.io/address/0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e) | ~1,981,279.85 shares | ~$1.981M raw shares |
| Ethereum | ROY-ST-autoUSD | [`0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE`](https://etherscan.io/address/0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE) | ~1,168,613.95 shares | ~$1.169M raw shares |
| Avalanche | ROY-ST-savUSD | [`0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9`](https://snowtrace.io/address/0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9) | ~4,278,072.87 shares | ~$4.278M raw shares |

- These raw treasury balances sum to **~$10.708M**, versus vault `totalAssets()` of **~$10.7378M**. Residual unexplained gap: **~$29.4K**.
- The vault's second strategy is **not** at zero anymore: `getStrategyData(0xc5FeF644d59415cec65049e0653CA10eD9Cba778)` returns allocation **1,000 USDC** on March 27, 2026.
- The Treasury multisig sent **~3.155M USDC** cumulatively to the Neutrl NUSD Router [`0xa052883ebee7354fc2aa0f9c727e657fdeca744a`](https://etherscan.io/address/0xa052883ebee7354fc2aa0f9c727e657fdeca744a), which aligns closely with the two live sNUSD senior tranche positions.
- The Treasury multisig sent **~4.2628M USDC** cumulatively to Circle `TokenMinterV2` [`0xfd78ee919681417d192449715b2594ab58f5d002`](https://etherscan.io/address/0xfd78ee919681417d192449715b2594ab58f5d002), and the same Treasury safe address on Avalanche currently holds **~4.2781M ROY-ST-savUSD** shares in Royco's Avalanche kernel [`0x7240FF91b471217FF93349184ABE9f102Ca1955C`](https://snowtrace.io/address/0x7240FF91b471217FF93349184ABE9f102Ca1955C).
- This is strong evidence for reserve *location* across Aave, Neutrl sNUSD, Tokemak autoUSD, and Avant savUSD.
- **Important caveat:** if the tranche tokens are valued via current `convertToAssets()`/`previewRedeem()` outputs rather than raw share balances, the traced redeemable value is only **~$9.944M**, about **~$794K below** the vault's reported `totalAssets()`. So the reserve location is now mostly evidenced, but the vault's exact NAV methodology remains trust-based and cannot be treated as fully independently provable.

### Provability

- srRoyUSDC exchange rate is computed on-chain via ERC-4626 (`totalAssets()` / `totalSupply()`)
- `totalAssets()` = `totalAllocatedValue()` from MultisigStrategy (~$10.73M). Vault holds $0 USDC directly — 100% of assets are reported by the strategy.
- **Accounting is admin-reported:** The MultisigStrategy's `totalAllocatedValue()` is updated via `adjustTotalAssets(int256 diff, uint256 nonce)`, called by the 3/5 treasury multisig ([`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)). This is **not** computed from on-chain positions — it is manually reported by the multisig.
- **How `adjustTotalAssets` works:** The `diff` parameter is a **signed raw USDC amount** (not a percentage), added to or subtracted from `vaultDepositedAmount`. Positive diffs increase reported assets (yield accrual), negative diffs decrease them (loss reporting). The funds themselves are on-chain in underlying protocols (Aave, Avant, etc.), but the vault cannot read those balances directly — instead the multisig manually reports the net change.
- **Accounting constraints (verified on-chain March 25, 2026):**
  - Max change per update: 50 bps (~0.5% of current `vaultDepositedAmount`), applies to both positive and negative diffs (`abs(diff)` is checked). At ~$10.73M, max ~$53.6K per call in either direction. If exceeded, contract **auto-pauses without applying the diff** — calls `_pause()` and returns immediately, discarding the change. This is a circuit breaker: the suspicious accounting update is rejected and the contract locks until `STRATEGY_ADMIN` calls `unpauseAndAdjustTotalAssets()`.
  - Cooldown between updates: 43,200 seconds (12 hours). If violated, same circuit-breaker behavior — **diff is discarded**, contract pauses.
  - Validity period: 2,592,000 seconds (30 days) — if no update within 30 days, `_previewPosition()` reverts with `AccountingValidityPeriodExpired`, freezing deposits/withdrawals.
  - Sequential nonce required (current: 37, ~1 update every 2 days). Prevents replay/out-of-order submissions.
  - Underflow protection: negative diffs cannot reduce `vaultDepositedAmount` below zero (reverts with `InsufficientUnderlyingBalance`). This is a floor guard only — the 0.5% cap is the actual per-call limit on losses.
  - Last updated: March 25, 2026
- **Emergency bypass — `unpauseAndAdjustTotalAssets(int256 diff)`:** Callable only by `STRATEGY_ADMIN`. Skips diff validation (no nonce check, no percentage cap, no cooldown). The diff is `int256` — can be positive or negative, unconstrained in magnitude. However, **the contract must be paused first** — OpenZeppelin's `_unpause()` reverts if not paused. This means the bypass can only be used after the circuit breaker has already triggered (a `Paused` event is emitted on-chain when `adjustTotalAssets` fails validation). The intended flow: (1) `adjustTotalAssets` exceeds 0.5% cap or cooldown → contract auto-pauses, diff discarded, `Paused` event emitted; (2) STRATEGY_ADMIN investigates the anomaly; (3) STRATEGY_ADMIN calls `unpauseAndAdjustTotalAssets(diff)` → emits `Unpaused` + `AdjustTotalAssets` in one tx. This design ensures the emergency bypass is always preceded by an observable on-chain pause event, providing a detection window before the unconstrained adjustment is applied.
- **Observed usage pattern:** 36 adjustments since Jan 30, 2026. Overwhelmingly small positive diffs (+$800–4,000 USDC for yield accrual). One negative diff observed (nonce 7: -$1,225 USDC). Calls every 12–72 hours.
- **Yield distribution — AdaptiveCurveYDM** ([`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc)): Determines what percentage of Senior yield is redirected to Junior as a risk premium. Inspired by [Morpho's AdaptiveCurveIrm](https://github.com/morpho-org/morpho-blue-irm). Uses a piecewise linear curve with a kink at 90% utilization (Junior capital backing Senior exposure). When utilization > 90% (Junior scarce), Junior's yield share increases exponentially over time to attract more Junior capital; when < 90% (Junior abundant), it decreases. **Immutable contract** — no admin functions, no owner, no upgradeability. Parameters are set once at market initialization and the curve adapts autonomously. Floor: 0.01% JT yield share, ceiling: 100%.
- **Per-market Junior/Senior coverage is verifiable on-chain:** Each market's Accountant contract exposes `getState()` returning `lastSTEffectiveNAV`, `lastJTEffectiveNAV`, `lastSTImpermanentLoss`, `lastJTImpermanentLoss`, `coverageWAD`, `betaWAD`, and `marketState`. The kernel exposes `getState()` returning `stOwnedYieldBearingAssets` and `jtOwnedYieldBearingAssets`. These can be queried without protocol-specific tooling (standard `eth_call` to verified contracts).
- Underlying market positions must be verified by checking each external protocol individually
- No third-party verification mechanism (no Chainlink PoR, no custodian attestations)
- **Overall provability is limited but better than initially documented**: Treasury holdings on Ethereum and Avalanche now evidence ~99.7% of reported assets by raw share balances, but the vault exchange rate still depends on the MultisigStrategy correctly reporting strategy NAV. The current tranche `convertToAssets()` outputs do not fully reconcile to the reported `totalAssets()`, so the exact accounting methodology remains trust-based.

## Liquidity Risk

- **Primary Exit:** Async withdrawal from vault (ERC-7540 pattern — `maxWithdraw()` returns 0, confirming no instant redemption). Request triggers up to 14-day unlock period. Vault sources liquidity from underlying Senior tranches during this window. The 20% Aave v3 USDC allocation is described as a "liquidity reserve" but this refers to the vault's internal rebalancing speed (Aave is instant to unwind on the vault side), **not** instant withdrawals for depositors — all exits go through the request-and-wait mechanism.
- **Secondary Exit (DEX):** Curve CurveStableSwapNG pool ([`0x8fc753f96752b35f64d1bae514e6cf8db0b9322e`](https://etherscan.io/address/0x8fc753f96752b35f64d1bae514e6cf8db0b9322e)) holds ~489K srRoyUSDC — significant improvement from ~$600 at initial assessment. Meaningful DEX liquidity now exists.
- **Morpho Blue Markets** (verified via [Morpho API](https://api.morpho.org/graphql), March 25, 2026):
  - srRoyUSDC/USDC (91.5% LLTV, [market](https://app.morpho.org/ethereum/market/0xacc49fbf58feb1ac971acce68f8adc177c43682d6a7087bbd4991a05cb7a2c67/srroyusdc-usdc)): ~$272K supply, ~$228K borrowed, 84% utilized — meaningful USDC exit path, significant growth from ~$22K at initial assessment
  - srRoyUSDC/pmUSD (86% LLTV, [market](https://app.morpho.org/ethereum/market/0x72cc79433e9f91c2a185422725510f4bdd19c9006010f464f851468b2371b756/srroyusdc-pmusd)): ~$1.99M supply, ~$1.81M borrowed, 91% utilized — largest market by supply, but loan asset is pmUSD (Precious Metals USD from RAAC protocol), not direct USDC exit. Morpho Blue holds ~2.83M srRoyUSDC (~26% of total supply) as collateral.
  - Two additional markets (srRoyUSDC/pmUSD at 91.5% LLTV and srRoyUSDC/USDC at 86% LLTV) are empty or negligible
- **Slippage Analysis:** Curve pool now provides meaningful exit liquidity (~$490K). Large exits still face slippage given the vault's ~$10.7M total assets.
- **Withdrawal Queues:** Up to 14-day max during normal conditions. Protection Mode impact on vault liquidity is **per-market and proportional to exposure**, not a vault-wide pause: Neutrl sNUSD (`fixedTermDuration=0`) never enters Protection Mode — ST can always withdraw. Tokemak autoUSD has a 2-day Protection Mode that blocks ST redemptions during losses. Only the affected market's allocation becomes illiquid; the vault can still source from other markets.
- **Stress Scenario:** If Tokemak enters Protection Mode, ~$1.17M of vault exposure (~11%) becomes temporarily illiquid (up to 2 days). Neutrl never pauses. In a worst case where all non-Aave, non-Neutrl markets are impaired simultaneously, the vault could still source from Aave (~$2.1M, instant unwind) and Neutrl (~$3.15M, always redeemable). The Curve pool provides an additional escape valve for smaller positions.
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
- **Dawn market `setConversionRate`:** Each kernel's NAV conversion rate can be admin-set via `setConversionRate()` (AccessManager role, **no timelock**). For ERC4626 kernels, NAV = `ERC4626.convertToAssets(shares) × conversionRate`. Manipulating this rate directly affects raw NAVs, which drives the entire tranching/loss waterfall. Currently: Neutrl uses oracle (stored rate = 0), Tokemak uses hardcoded 1:1 (stored rate = 1e18).

**Upgradeable Contracts:**
- srRoyUSDC vault: ERC-1967 proxy → ConcreteAsyncVaultImpl (upgradeable via ConcreteFactory, requires Concrete team approval)
- MultisigStrategy: TransparentUpgradeableProxy → MultisigStrategy implementation (upgradeable by Owner multisig, **no timelock**)
- RoycoVaultMakinaStrategy: New strategy added, currently has a small live allocation (~1,000 USDC on March 27, 2026)

### Programmability

- srRoyUSDC PPS is calculated on-chain via ERC-4626 standard (`totalAssets()` / `totalSupply()`)
- Yield distribution uses the on-chain AdaptiveCurveYDM model
- Fund deployment and rebalancing are executed by the MultisigStrategy, which is controlled by the 3/5 treasury multisig — **significant manual intervention**
- A second strategy (RoycoVaultMakinaStrategy) has been added and currently has a small live allocation (~1,000 USDC on March 27, 2026). It uses an OZ AccessManager authority rather than direct multisig control, potentially for automated fund deployment via Makina.
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

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Purpose | Key Events/Functions |
|----------|---------|---------|---------------------|
| srRoyUSDC Vault | [`0xcD9f5907F92818bC06c9Ad70217f089E190d2a32`](https://etherscan.io/address/0xcD9f5907F92818bC06c9Ad70217f089E190d2a32) | Vault state | `Deposit`, `Withdraw`, `Transfer`, `totalAssets()`, `totalSupply()`, `convertToAssets()`, `accrueYield()` |
| Owner Multisig | [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190) | Governance | Submitted/confirmed/executed transactions, owner changes |
| VAULT_MANAGER | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) | Fee/queue mgmt | Fee updates, queue toggles, signer changes |
| MultisigStrategy | [`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D) | Fund deployment | `adjustTotalAssets()`, strategy changes, proxy upgrades |
| RoycoVaultMakinaStrategy | [`0xc5FeF644d59415cec65049e0653CA10eD9Cba778`](https://etherscan.io/address/0xc5FeF644d59415cec65049e0653CA10eD9Cba778) | Secondary strategy | `allocateFunds()`, `totalAllocatedValue()` (~1,000 USDC allocated on March 27, 2026) |
| Multisig Safe (Treasury) | [`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8) | Treasury/accounting | `adjustTotalAssets()` calls, large transfers, signer changes |
| ConcreteFactory | [`0x0265d73a8e61f698d8eb0dfeb91ddce55516844c`](https://etherscan.io/address/0x0265d73a8e61f698d8eb0dfeb91ddce55516844c) | Vault proxy admin | Implementation approvals, vault upgrades |
| RoycoFactory | [`0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d`](https://etherscan.io/address/0xD567cCbb336Eb71eC2537057E2bCF6DB840bB71d) | AccessManager | Role grants, scheduled operations, market creation |
| AdaptiveCurveYDM | [`0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc`](https://etherscan.io/address/0x071B0FA065774b403B8dae0aE93A09Df5DE3DFAc) | Yield distribution | Parameter changes |
| Neutrl sNUSD Kernel | [`0x0aE0978B868804929fd4C06B3B22D9197B8cd3c6`](https://etherscan.io/address/0x0aE0978B868804929fd4C06B3B22D9197B8cd3c6) | Dawn market (sNUSD) | `syncTrancheAccounting()`, `pause()`, `getState()`, coverage changes |
| Tokemak autoUSD Kernel | [`0x8748D1c21CC550B435487F473d9Aaf6C84dA46A6`](https://etherscan.io/address/0x8748D1c21CC550B435487F473d9Aaf6C84dA46A6) | Dawn market (autoUSD) | `syncTrancheAccounting()`, `pause()`, `getState()`, coverage changes |
| RoycoFactory Proxy | [`0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C`](https://etherscan.io/address/0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C) | Dawn market factory | `deployMarket()`, role grants, scheduled operations |

### Critical Monitoring Points

- **PPS (Price Per Share):** Track `convertToAssets(1e6)` — should be monotonically increasing. Alert on any decrease (indicates loss event or Protection Mode). Current: ~1.005571.
- **Total Assets:** Monitor `totalAssets()` — currently 100% dependent on MultisigStrategy's admin-reported `totalAllocatedValue()`. Cross-reference with actual on-chain positions in underlying protocols (Aave, Avant, Neutrl, Auto) for sanity checking.
- **Accounting Updates (`adjustTotalAssets`):**
  - Track all `adjustTotalAssets(int256 diff, uint256 nonce)` calls on MultisigStrategy ([`0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D`](https://etherscan.io/address/0xd3F8Edff57570c4F9B11CC95eA65117e2D7A6C2D))
  - `diff` is a signed raw USDC amount (positive = yield accrual, negative = loss). Normal range: +$800–4,000 per update.
  - Alert on: negative diffs (loss events), unusually large positive diffs (>$10K), nonce gaps or out-of-sequence, updates faster than 12-hour cooldown
  - Alert on contract pause: if diff exceeds 0.5% cap or cooldown is violated, the contract auto-pauses instead of reverting
  - **Critical alert on `unpauseAndAdjustTotalAssets()`**: This emergency function skips diff validation (no cap, no cooldown, no nonce). Can only be called when the contract is already paused (circuit breaker triggered). Monitor for the sequence: `Paused` event (circuit breaker) followed by `Unpaused` + `AdjustTotalAssets` in same tx. Any such sequence is a high-severity event requiring immediate investigation.
  - Monitor `accountingValidityPeriod`: if no update for 30 days, vault freezes (deposits/withdrawals revert)
  - Verify nonce increments sequentially (current: 37)
- **Governance:** Monitor Owner multisig for MultisigStrategy proxy upgrade transactions (**no timelock**). Monitor ConcreteFactory for vault implementation upgrade proposals. Monitor RoycoFactory for role grants and scheduled operations.
- **Fee Changes:** Monitor VAULT_MANAGER multisig for `updateManagementFee()` and `updatePerformanceFee()` calls. Currently both 0% — any change would enable fee share minting via `accrueYield()`.
- **Strategy:** Monitor MultisigStrategy for fund movements. Monitor RoycoVaultMakinaStrategy for growth beyond its current small allocation (~1,000 USDC on March 27, 2026).
- **Protection Mode / Fixed-Term State:** Alert on any market transitioning from PERPETUAL (0) to FIXED_TERM (1) state via `marketState` in accountant `getState()`. This means JT is covering ST losses and Senior withdrawals are paused.

### Junior Vault / Tranching Monitoring

The Junior tranche provides the first-loss buffer protecting Senior depositors. Loss of Junior capital directly reduces srRoyUSDC's structural protection. All data below is queryable on-chain via the kernel and accountant contracts.

**Contracts to poll (via `getState()`):**

| Market | Accountant | Kernel | Junior Tranche (ERC20) |
|--------|-----------|--------|------------------------|
| Neutrl sNUSD | [`0xCaa3F221fCf3c2EC7b6a49B73BB810cca35e1085`](https://etherscan.io/address/0xCaa3F221fCf3c2EC7b6a49B73BB810cca35e1085) | [`0x0aE0978B868804929fd4C06B3B22D9197B8cd3c6`](https://etherscan.io/address/0x0aE0978B868804929fd4C06B3B22D9197B8cd3c6) | [`0x3821eBea3BBbE23F3dea74f24082BD0f0b67f6c5`](https://etherscan.io/address/0x3821eBea3BBbE23F3dea74f24082BD0f0b67f6c5) |
| Tokemak autoUSD | [`0xB0166629D78E3876F570f18B154A60b99024b6f4`](https://etherscan.io/address/0xB0166629D78E3876F570f18B154A60b99024b6f4) | [`0x8748D1c21CC550B435487F473d9Aaf6C84dA46A6`](https://etherscan.io/address/0x8748D1c21CC550B435487F473d9Aaf6C84dA46A6) | [`0x6f0D6567099621deE3850C673d73c532071A888d`](https://etherscan.io/address/0x6f0D6567099621deE3850C673d73c532071A888d) |

**Key metrics (from Accountant `getState()` tuple):**

| Field | Index | Type | Alert Condition |
|-------|-------|------|-----------------|
| `lastMarketState` | 0 | uint8 | Alert if != 0 (0 = PERPETUAL, 1 = FIXED_TERM). Fixed-Term means JT is actively covering ST losses and Senior withdrawals are paused. |
| `coverageWAD` | 3 | uint64 | Alert on any change. Currently 1e17 (10%) for both active markets. Decrease = less protection. |
| `betaWAD` | 4 | uint96 | Alert on any change. Currently 1e18 (100%) — JT has same underlying exposure as ST. |
| `lastSTRawNAV` | 10 | uint256 | Track for trend. Decrease = underlying asset depreciation. |
| `lastJTRawNAV` | 11 | uint256 | Track for trend. Decrease = JT asset depreciation (since beta=1.0, correlates with ST). |
| `lastSTEffectiveNAV` | 12 | uint256 | Alert if < `lastSTRawNAV` (means JT has NOT fully covered ST losses). |
| `lastJTEffectiveNAV` | 13 | uint256 | **Critical metric.** Alert if drops >10% in 24h. Alert if approaches 0 (JT depleted = no protection). |
| `lastSTImpermanentLoss` | 14 | uint256 | Alert if != 0. Non-zero means ST has suffered losses beyond what JT could cover. |
| `lastJTImpermanentLoss` | 15 | uint256 | Alert if != 0. Non-zero means JT is actively covering ST losses. |
| `fixedTermEndTimestamp` | 2 | uint32 | If market is in FIXED_TERM, this is when the protection period ends. After expiry, `jtImpermanentLoss` is zeroed (JT permanently absorbs loss). |

**Key metrics (from Kernel `getState()` tuple):**

| Field | Index | Type | Alert Condition |
|-------|-------|------|-----------------|
| `stOwnedYieldBearingAssets` | 3 | uint256 | Track. Cross-reference with accountant NAV for consistency. |
| `jtOwnedYieldBearingAssets` | 4 | uint256 | Track. Significant decrease = JT capital leaving. |

**Derived metrics to compute and track:**

| Metric | Formula | Baseline (March 26, 2026) | Alert Threshold |
|--------|---------|--------------------------|-----------------|
| Coverage ratio (Neutrl) | `lastJTEffectiveNAV / lastSTEffectiveNAV` | 12.4% | < 11% (approaching 10% minimum) |
| Coverage ratio (Tokemak) | `lastJTEffectiveNAV / lastSTEffectiveNAV` | 12.5% | < 11% (approaching 10% minimum) |
| Utilization (Neutrl) | `(stRawNAV + jtRawNAV × beta) × coverageWAD / jtEffectiveNAV` | ~90.8% | > 95% (approaching liquidation at 100%) |
| Utilization (Tokemak) | `(stRawNAV + jtRawNAV × beta) × coverageWAD / jtEffectiveNAV` | ~90.0% | > 95% (approaching liquidation at 122.5%) |

**Junior depositor monitoring:**
- **ROY-JT-sNUSD holders** (2 addresses holding ~145K shares total):
  - [`0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476`](https://etherscan.io/address/0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476): ~76,224 shares
  - [`0xfef0bb8df6210e441f03de23edafb0150129e176`](https://etherscan.io/address/0xfef0bb8df6210e441f03de23edafb0150129e176): ~68,903 shares
- **ROY-JT-autoUSD holders** (3 addresses holding ~145K shares total):
  - [`0x72f9c5433113289985977e72f87d76969194f9ef`](https://etherscan.io/address/0x72f9c5433113289985977e72f87d76969194f9ef): ~100,414 shares
  - [`0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476`](https://etherscan.io/address/0x2d745a6596d47a0fe28a7db7bd9dc7bdbca4e476): ~30,256 shares
  - [`0xfef0bb8df6210e441f03de23edafb0150129e176`](https://etherscan.io/address/0xfef0bb8df6210e441f03de23edafb0150129e176): ~15,177 shares
- Alert on any `Transfer` event from these addresses (potential JT exit reducing coverage)
- Alert on JT `totalSupply()` decrease > 5% in 24h
- Note: Kernel enforces coverage on JT redemption — JT cannot withdraw below coverage requirement. However, if market enters Fixed-Term, JT deposits are also paused (cannot replenish).

**Senior Tranche token monitoring (Treasury holdings):**
- Treasury multisig ([`0x170ff06326eBb64BF609a848Fc143143994AF6c8`](https://etherscan.io/address/0x170ff06326eBb64BF609a848Fc143143994AF6c8)) holds:
  - ~1,172,390 ROY-ST-sNUSD at [`0x2070Af1C865f5d764F673Baf5654822947e71243`](https://etherscan.io/address/0x2070Af1C865f5d764F673Baf5654822947e71243)
  - ~1,168,613 ROY-ST-autoUSD at [`0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE`](https://etherscan.io/address/0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE)
- Alert if Treasury transfers or redeems Senior Tranche tokens (could indicate rebalancing or exit)
- Alert if Treasury deposits into new markets (new Senior Tranche tokens appearing)
**Market allocation monitoring:**

Target allocations are set off-chain by the Royco Foundation curator — there is no on-chain registry of targets. Actual allocations must be reconstructed from the Treasury multisig's token balances across chains.

*How to compute current allocation per market:*

| Step | Chain | Call | Purpose |
|------|-------|------|---------|
| 1 | Ethereum | `balanceOf(0x170ff0...)` on aUSDC [`0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c`](https://etherscan.io/address/0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c) | Aave USDC position |
| 2 | Ethereum | `balanceOf(0x170ff0...)` on ROY-ST-sNUSD [`0x2070Af1C865f5d764F673Baf5654822947e71243`](https://etherscan.io/address/0x2070Af1C865f5d764F673Baf5654822947e71243) | Neutrl sNUSD market 1 |
| 3 | Ethereum | `balanceOf(0x170ff0...)` on ROY-ST-sNUSD [`0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e`](https://etherscan.io/address/0x3b2df77f0eaa0ca98aaabffa96b03eaf08ec6c8e) | Neutrl sNUSD market 2 |
| 4 | Ethereum | `balanceOf(0x170ff0...)` on ROY-ST-autoUSD [`0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE`](https://etherscan.io/address/0x73C641fe41EB0270C7f473f3c3E4A40eb97fd8dE) | Tokemak autoUSD market |
| 5 | Avalanche | `balanceOf(0x170ff0...)` on ROY-ST-savUSD [`0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9`](https://snowtrace.io/address/0xDA7bf1788aecb94fE6D5D3f739358De94f43E5C9) | Avant savUSD market |
| 6 | — | Convert each balance to USD via `convertToAssets()` on each tranche (for Senior Tranche shares) or 1:1 for aUSDC | Get USD value per position |
| 7 | — | Sum all positions and compute % per market | Current allocation |

*Alert conditions:*
- Any single protocol exceeding 40% concentration cap (Avant currently at ~40%)
- Any single chain exceeding 40% (Avalanche currently at ~40%, Ethereum exempt)
- Allocation drift >5% from last known target for any market
- New positions appearing (Treasury holding new token types)
- Positions disappearing (Treasury balance dropping to 0 on an existing market)

*Important limitation:* The vault's `totalAssets()` (~$10.74M) is reported by the MultisigStrategy via `adjustTotalAssets()`. The sum of Treasury token balances converted via `convertToAssets()` (~$9.944M) does not exactly match the vault's reported value — there is a ~$794K gap. This means allocation percentages computed from Treasury balances are approximate. The vault's own accounting is the authoritative source, but it doesn't break down by market.
**New market deployment monitoring:**
- Monitor RoycoFactory Proxy ([`0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C`](https://etherscan.io/address/0x7cC6fB28eC7b5e7afC3cB3986141797ffc27253C)) for `deployMarket()` calls (6 markets deployed so far)
- When new markets appear, verify coverage parameters and underlying assets

**Recommended polling frequency:**
- Accountant/Kernel `getState()`: Every 1 hour (coverage and market state)
- Junior Tranche `Transfer` events: Real-time (event subscription) or every 15 minutes
- Treasury Senior Tranche `balanceOf()`: Every 6 hours
- **Allocation monitoring:** Daily — compute per-market allocation from Treasury balances, alert on concentration cap breaches or significant drift
- RoycoFactory `deployMarket()` events: Daily
- **Holder Concentration:** Monitor the dominant EOA holder (~69% of supply) and Morpho Blue (~26%) for significant movements.
- **Underlying Protocols:** Monitor health of Avant (savUSD), Neutrl (sNUSD), Auto (autoUSD), and Aave.
- **Recommended Frequency:** Hourly for PPS, governance, and strategy. Daily for underlying protocol health and allocation. Immediate alerts for proxy upgrades and fee changes.

## Risk Summary

### Key Strengths

1. **Tranching mechanism provides structural protection (verified on-chain at market level)** — Junior capital absorbs losses first, enforced by on-chain kernel/accountant contracts. Coverage verified: ~12.4% (Neutrl), ~12.5% (Tokemak) vs 10% required. Treasury holdings now evidence live exposure across Aave, two sNUSD senior tranche positions, autoUSD, and Avalanche savUSD. The srRoyUSDC vault itself still doesn't directly reference these contracts (indirect link via Treasury multisig).
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
5. **100% of assets admin-reported** — Funds are deployed on-chain to underlying protocols, but the vault cannot read those balances. The entire ~$10.73M totalAssets is reported via MultisigStrategy's `adjustTotalAssets()` (signed USDC delta per call). No oracle or on-chain verification of actual positions. Emergency function `unpauseAndAdjustTotalAssets()` can bypass diff constraints, but requires the contract to be paused first (observable on-chain).

### Critical Risks

- **MultisigStrategy upgradeable with no timelock:** The Owner multisig (3/5) controls the MultisigStrategy's ProxyAdmin and can upgrade the strategy implementation immediately. A malicious upgrade could redirect funds or bypass the 0.5% accounting constraint. This is the most direct risk vector.
- **Treasury multisig can divert 100% of allocated funds:** `onlyVault` restricts who can call strategy entrypoints, but does not constrain what happens after allocation. Once the vault allocates, `_allocateToPosition()` transfers the full amount to the Treasury multisig. The strategy cannot force deployment into Aave / Dawn markets, and `_retrieveAssetsFromMultisig()` requires the multisig to approve funds back. This means the Treasury multisig has full practical control over all forwarded capital and can break the expected flow, divert funds elsewhere, or refuse to return them to the vault.
- **Underlying protocol risk is opaque:** The quality and health of Avant, Neutrl, Auto, and Cap Finance positions are not easily verifiable. These protocols themselves are newer with limited audit and track record history.
- **Junior coverage is on-chain but indirect from the vault:** The Royco Dawn kernel/accountant contracts enforce Junior-first loss coverage on-chain (verified: ~12.4-12.5% actual coverage, 10% required, 0 impermanent loss). However, the srRoyUSDC Concrete vault has no direct on-chain link to these contracts — the Treasury multisig bridges this gap by holding Senior Tranche tokens and reporting values via `adjustTotalAssets()`. The loss waterfall enforcement is real at the market level, but the vault cannot independently verify it. Coverage buffer is thin (~2.5% above minimum) and Junior capital comes from only 2-3 depositor addresses per market.
- **Strategy totalAssets is manually reported, not derived from on-chain data:** `totalAllocatedValue()` returns a stored `vaultDepositedAmount` variable updated via `adjustTotalAssets()` by the treasury multisig. It does not read balances from Aave, Avant, Neutrl, or any underlying protocol. The reported value may not represent actual on-chain positions — there is no mechanism to verify accuracy.

---

## Token Minting Analysis

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
   - `diff` is a signed raw USDC amount added to `vaultDepositedAmount`. Positive values inflate `totalAssets()` and thus PPS.
   - Constrained: max 50 bps (~0.5%) per update, 12-hour cooldown, sequential nonce, 30-day validity period
   - At ~$10.73M total assets, each update can inflate by at most ~$53.6K
   - This doesn't mint new tokens but can gradually misrepresent value
   - **Emergency bypass:** `unpauseAndAdjustTotalAssets(int256 diff)` (STRATEGY_ADMIN only) skips caps/cooldowns — requires contract to be paused first (circuit breaker must have triggered), then enables unconstrained adjustment in a single call

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
- [ ] **Unverifiable reserves** → **CONDITIONAL PASS** (ERC-4626 exchange rate is on-chain. Treasury holdings on Ethereum and Avalanche now evidence ~99.7% of reported assets by raw share balances, including Aave, two sNUSD tranche positions, autoUSD, and Avalanche savUSD. However, the vault's totalAssets still relies on MultisigStrategy reporting, and current tranche `convertToAssets()` outputs do not fully reconcile to reported NAV.)
- [ ] **Total centralization** → **PASS** (multiple multisigs with dual-control for vault upgrades via ConcreteFactory — though MultisigStrategy upgrade has no timelock)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **3.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | Hexens completed full audit + whitelist audit (Dawn). Cantina competition in judging phase (262 submissions, ~2 months since competition ended). Cantina whitelist audit completed. Spearbit/Nethermind audited V1/Boosts only. The Cantina competition excluded oracle manipulation, centralization risks, and whitelisted party misbehavior from scope. |
| Bug Bounty | $250K on Immunefi (live since Feb 17, 2026 — ~5 weeks active) |
| Time in Production | ~78 days (since Jan 6, 2026). V1 (different product) launched 2024. |
| TVL | ~$10.73M in srRoyUSDC vault (admin-reported). ~$5.16M across Royco V2 on DeFiLlama. |
| Historical Incidents | None in ~78 days. |

Hexens audit completed; Cantina competition still in judging after ~2 months (concerning delay — 262 submissions, only high-severity eligible for rewards). Protocol approaching 3 months with growing TVL. Bug bounty established for 5+ weeks. Cantina competition excluded key risk vectors from scope.

**Score: 3.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.5**

**Subcategory A: Governance — 3.0**

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
- New RoycoVaultMakinaStrategy added with a small live allocation (~1,000 USDC) — may indicate move toward automated allocation
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
- **Junior coverage verified at market level, but indirect from vault** — Junior capital exists on-chain (~12.4-12.5% coverage, enforced by kernel/accountant), but the srRoyUSDC vault cannot directly query these contracts. The Treasury multisig holding Senior Tranche tokens is the bridge. Coverage buffer is thin (2.5% above minimum) with concentrated Junior depositors (2-3 addresses).

**Score: (3.0 + 3.5 + 4.0) / 3 = 3.5/5**

#### Category 3: Funds Management (Weight: 30%) — **3.5**

**Subcategory A: Collateralization — 3.0**

- 100% USDC-backed (deposits are USDC, deployed to yield markets)
- Junior tranche provides first-loss protection, enforced on-chain by each market's kernel/accountant contracts. Verified coverage (March 26, 2026): Neutrl sNUSD 12.4%, Tokemak autoUSD 12.5%, both above 10% required minimum. No impermanent loss recorded. Treasury multisig holds Senior Tranche tokens, connecting srRoyUSDC to these markets.
- **Coverage is thin and concentrated:** Only ~2.5% buffer above the 10% minimum. Junior capital comes from 2-3 depositor addresses per market. Beta = 1.0 (JT uses same asset as ST — correlated losses, not diversification).
- Underlying yield comes from newer protocols (Avant, Neutrl, Auto) — collateral quality is mixed
- Protection Mode (Fixed-Term State) is enforced on-chain by the accountant — pauses ST withdrawals and JT deposits when JT is covering losses. However, the srRoyUSDC vault itself is not aware of this state — it would manifest as the Treasury multisig being unable to redeem Senior Tranche tokens.
- Vault holds $0 USDC directly — 100% of ~$10.73M deployed externally via MultisigStrategy
- If Junior coverage is insufficient, Senior absorbs losses

**Subcategory B: Provability — 4.0**

- ERC-4626 exchange rate is on-chain (PPS verifiable)
- However, `totalAssets()` depends entirely on MultisigStrategy's `adjustTotalAssets(int256 diff, uint256 nonce)` — the multisig submits a signed USDC delta (not an absolute value), which is added/subtracted from `vaultDepositedAmount`. This is **not** computed from on-chain positions in underlying protocols.
- Funds are on-chain in Aave/Avant/Neutrl/Auto only if the Treasury multisig actually deploys them there. The strategy itself does not enforce deployment: `_allocateToPosition()` forwards full custody to the multisig, and `_retrieveAssetsFromMultisig()` depends on multisig approval to pull assets back. The entire PPS therefore depends on both multisig accounting honesty and multisig custody cooperation, because there is no on-chain guarantee that allocated funds remain in the intended flow after reaching the Treasury multisig (reporting is constrained by max 0.5% per update, 12-hour cooldown, nonce 37 confirming regular updates).
- Funds are on-chain in Aave/Avant/Neutrl/Auto only if the Treasury multisig actually deploys them there. The strategy itself does not enforce deployment: `_allocateToPosition()` forwards full custody to the multisig, and `_retrieveAssetsFromMultisig()` depends on multisig approval to pull assets back. The entire PPS therefore depends on both multisig accounting honesty and multisig custody cooperation, because there is no on-chain guarantee that allocated funds remain in the intended flow after reaching the Treasury multisig (reporting is constrained by max 0.5% per update, 12-hour cooldown, nonce 37 confirming regular updates).
- **Emergency bypass exists:** `unpauseAndAdjustTotalAssets()` skips diff validation — but requires contract to be paused first (circuit breaker triggered, `Paused` event emitted on-chain). Provides a detection window before the unconstrained adjustment.
- Individual underlying market positions are not easily auditable without protocol-specific tooling
- **Per-market Junior coverage IS verifiable on-chain:** Each market's Accountant `getState()` returns JT/ST effective NAV, impermanent loss, coverage parameters, and market state. Kernel `getState()` returns owned yield-bearing assets per tranche. All contracts are verified on Etherscan.
- No third-party verification mechanism (no Chainlink PoR, no custodian attestations)
- Yield computation is on-chain via AdaptiveCurveYDM
- **Self-reported accounting** with constraints is better than no reporting, but fundamentally depends on multisig honesty

**Score: (3.0 + 4.0) / 2 = 3.5/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **3.5**

- Queue-based withdrawal with up to 14-day unlock period
- Protection Mode impact is per-market: Neutrl never pauses (fixedTermDuration=0), Tokemak pauses ST for up to 2 days. Not a vault-wide freeze — proportional to affected market exposure.
- **Improved DEX liquidity:** Curve CurveStableSwapNG pool holds ~489K srRoyUSDC (~$490K) — significant improvement from ~$600 at launch
- Morpho Blue markets: srRoyUSDC/USDC (~$272K supply, 84% utilized — meaningful USDC exit), srRoyUSDC/pmUSD (~$1.99M supply, not direct USDC exit). Morpho holds ~2.83M srRoyUSDC (26% of supply) as collateral.
- Extreme holder concentration — one EOA holds ~69% of supply. A single large withdrawal would require unwinding most underlying positions.
- Same-value asset (USDC-denominated) mitigates some waiting risk
- Throttle mechanism (14-day max + Protection Mode pauses): +0.5
- Same-value asset: -0.5 (net neutral)

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%) — **2.5**

- Founder Jai Bhavnani is publicly known with DeFi track record
- VC-backed by reputable investors (Electric Capital, Coinbase Ventures, Hashed, Amber Group)
- Public GitHub repo ([roycoprotocol/royco-dawn](https://github.com/roycoprotocol/royco-dawn)) — verified source code
- Small dev team (2 GitHub contributors)
- Documentation has some gaps: oracle mechanism unclear, per-market risk data only on JS-rendered site. However, per-market Junior coverage is verifiable directly on-chain via accountant `getState()`, partially compensating for documentation gaps.
- Hypernative monitoring being configured but not yet active
- Security council being assembled but not yet formed
- No publicly documented incident response plan
- KYC requirements suggest regulatory compliance awareness
- Legal structure: Waymont Co., Los Angeles — details limited

**Score: 2.5/5**

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (3.0 × 0.20) + (3.5 × 0.30) + (3.5 × 0.30) + (3.5 × 0.15) + (2.5 × 0.05)
            = 0.60 + 1.05 + 1.05 + 0.525 + 0.125
            = 3.35
```

No optional modifiers apply (protocol is <2 years old, TVL <$500M).

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.35 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK**

---

## Reassessment Triggers

- **Time-based:** Reassess in 2 months (May 2026) or when Cantina audit judging concludes and remediation is publicly confirmed
- **TVL-based:** Reassess if TVL exceeds $50M or drops below $2M
- **Incident-based:** Reassess after any exploit, Protection Mode activation, or governance change
- **Governance-based:** Reassess if timelock is added to MultisigStrategy, multisig threshold/signers change, or new governance mechanism is introduced
- **Strategy-based:** Reassess if RoycoVaultMakinaStrategy grows materially beyond its current small allocation (~1,000 USDC)
- **Fee-based:** Reassess if performance or management fees are changed from 0%
- **Underlying protocol:** Reassess if any whitelisted market (Avant, Neutrl, Auto) experiences an exploit or significant issue

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONCRETE VAULT LAYER                            │
│                                                                     │
│  ┌──────────────────────┐       ┌───────────────────────────────┐  │
│  │  srRoyUSDC Vault     │       │  MultisigStrategy             │  │
│  │  (ERC-4626 Proxy)    │──────▶│  (TransparentUpgradeableProxy)│  │
│  │  0xcD9f...           │       │  0xd3F8...                    │  │
│  │                      │       │                               │  │
│  │  totalAssets() reads │       │  adjustTotalAssets(diff,nonce) │  │
│  │  from strategy       │       │  unpauseAndAdjustTotalAssets() │  │
│  └──────────┬───────────┘       └──────────────┬────────────────┘  │
│             │                                  │                    │
│             │ upgrade                          │ calls              │
│             ▼                                  ▼                    │
│  ┌──────────────────────┐       ┌───────────────────────────────┐  │
│  │  ConcreteFactory     │       │  Treasury Multisig (3/5)      │  │
│  │  (Proxy Admin)       │       │  0x170ff0...                  │  │
│  │  0x0265...           │       │                               │  │
│  │  Owner: Concrete 3/5 │       │  - Reports value via diff     │  │
│  │  0xdc29...           │       │  - Holds Senior Tranche tokens│  │
│  └──────────────────────┘       └──────────────┬────────────────┘  │
│                                                │                    │
└────────────────────────────────────────────────┼────────────────────┘
                                                 │
                                    holds ST tokens / redeems
                                                 │
┌────────────────────────────────────────────────┼────────────────────┐
│                   ROYCO DAWN TRANCHING LAYER   │                    │
│                                                ▼                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  RoycoFactory Proxy (AccessManager)  0x7cC6...              │  │
│  │  Manages roles for all Dawn contracts (DEPLOYER, LP, SYNC)  │  │
│  └────────────────────────────┬─────────────────────────────────┘  │
│                               │ deploys & governs                   │
│               ┌───────────────┼───────────────┐                     │
│               ▼               ▼               ▼                     │
│  ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐        │
│  │  PER-MARKET SET  │ │              │ │                  │        │
│  │  (×2 active)     │ │  Neutrl      │ │  Tokemak         │        │
│  │                  │ │  sNUSD       │ │  autoUSD         │        │
│  │ ┌──────────────┐│ │  Market      │ │  Market          │        │
│  │ │   Kernel     ││ │              │ │                  │        │
│  │ │ stDeposit()  ││ │ fixedTerm=0  │ │ fixedTerm=2days  │        │
│  │ │ stRedeem()   ││ │ liqUtil=100% │ │ liqUtil=122.5%   │        │
│  │ │ jtDeposit()  ││ └──────────────┘ └──────────────────┘        │
│  │ │ jtRedeem()   ││                                               │
│  │ │ setConversion││                                               │
│  │ │  Rate()      ││                                               │
│  │ └──────┬───────┘│                                               │
│  │        │        │                                               │
│  │ ┌──────▼───────┐│  ┌──────────────┐  ┌──────────────────┐      │
│  │ │  Accountant  ││  │Senior Tranche│  │ Junior Tranche   │      │
│  │ │  getState()  ││  │ (ERC-4626)   │  │ (ERC-4626)       │      │
│  │ │  coverage    ││  │ ROY-ST-*     │  │ ROY-JT-*         │      │
│  │ │  NAV sync    │◀─▶│              │  │                  │      │
│  │ │  loss waterf.││  │ Held by      │  │ Held by 2-3      │      │
│  │ │  market state││  │ Treasury     │  │ independent      │      │
│  │ └──────────────┘│  │ multisig     │  │ depositors       │      │
│  │                  │  └──────────────┘  └──────────────────┘      │
│  └─────────────────┘                                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  AdaptiveCurveYDM (Immutable)  0x071B...                    │  │
│  │  Determines JT yield share (risk premium). No admin.        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    deposits yield-bearing assets
                                │
┌───────────────────────────────┼─────────────────────────────────────┐
│              UNDERLYING YIELD PROTOCOLS                              │
│                               ▼                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Neutrl      │  │  Tokemak     │  │  Aave v3     │              │
│  │  (sNUSD)     │  │  (autoUSD)   │  │  (USDC)      │              │
│  │  35% target  │  │  10% target  │  │  20% target  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │  Avant       │  │  Cap Finance │                                 │
│  │  (savUSD)    │  │  (stcUSD)    │                                 │
│  │  35% target  │  │  Paused      │                                 │
│  └──────────────┘  └──────────────┘                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GOVERNANCE                                   │
│                                                                     │
│  Owner Multisig (3/5)          VAULT_MANAGER (3/4)                 │
│  0x85de42...                   0x7c405b...                         │
│  - Vault owner                 - Fee management                    │
│  - MultisigStrategy upgrade    - Queue toggles                     │
│    (NO TIMELOCK)                                                    │
│                                                                     │
│  Treasury Multisig (3/5)       ConcreteFactory Owner (3/5)         │
│  0x170ff0...                   0xdc29BD... (Concrete team)         │
│  - adjustTotalAssets()         - Vault implementation upgrades     │
│  - Holds Senior Tranche tokens                                     │
│                                                                     │
│  ⚠ Owner & Treasury share same 5 signers (no separation of powers)│
│  ⚠ VAULT_MANAGER shares 3 of 5 + 1 additional                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → srRoyUSDC vault → MultisigStrategy
→ Treasury multisig deploys to Dawn Senior Tranches → Kernel routes
to underlying protocols. Value reported back via adjustTotalAssets().
```
