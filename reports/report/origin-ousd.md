# Protocol Risk Assessment: Origin OUSD

- **Assessment Date:** June 25, 2026 (Updated: August 31, 2026)
- **Token:** OUSD (Origin Dollar)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86)
- **Final Score: 2.17/5.0**

## Overview + Links

Origin Dollar (OUSD) is a rebasing stablecoin backed 100% by USDC. Holders' wallet balances automatically increase as yield accrues, without staking, locking, or manual compounding. Smart contracts must opt in to receive rebased yield; those that don't forfeit rewards to standard holders, amplifying returns for participants. An ERC-4626 wrapper (wOUSD) is available for DeFi composability, appreciating in value instead of rebasing.

OUSD generates yield through three mechanisms:
1. **Morpho Lending on Ethereum** (~$2.97M, ~47.6% of TVL) — Deposits USDC into a Morpho Vault V2 that routes into a MetaMorpho vault and on into Morpho Blue markets
2. **Curve AMO** (~$1.02M, ~16.3% of TVL) — Algorithmic Market Operations providing liquidity in the Curve OUSD/USDC pool, earning trading fees and CRV incentives
3. **Cross-Chain Strategies** (~$2.25M, ~36.1% of TVL) — Bridges USDC via Circle CCTP to Base (~$1.21M) and HyperEVM (~$1.04M), where each remote leg deposits into a local Morpho Vault V2 stack

Every strategy leg other than the Curve AMO therefore terminates in Morpho lending markets: ~80% of TVL is USDC supplied to Morpho Blue across three chains.

Collateral was simplified from multi-stablecoin (USDT, DAI, USDC) to **USDC-only** via governance proposal in November 2025.

- **Launch Date:** September 18, 2020 (relaunched January 5, 2021 after November 2020 hack)
- **Performance Fee:** 20% (2,000 bps), collected by Trustee multisig
- **Total Value:** ~$6.24M (vault `totalValue()` at block 25876180, August 31, 2026)
- **OUSD Supply:** ~6,216,831 OUSD — backing ratio `totalValue() / totalSupply()` = 100.34%

**Links:**

- [Protocol Documentation](https://docs.originprotocol.com/yield-bearing-tokens/origin-dollar-ousd)
- [Protocol App](https://www.originprotocol.com/ousd)
- [GitHub Repository](https://github.com/OriginProtocol/origin-dollar)
- [Security / Audits](https://github.com/OriginProtocol/security)
- [Bug Bounty](https://immunefi.com/bug-bounty/originprotocol/scope/#top)
- [DeFiLlama](https://defillama.com/protocol/origin-dollar)

## Contract Addresses

### Ethereum Mainnet

| Contract | Address | Role / Key facts |
|----------|---------|------------------|
| OUSD Token (Proxy) | [`0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86) | Rebasing ERC-20; `governor()` = Timelock |
| OUSD Token Implementation | [`0xA7B7c59a1705e4a624ea8a4ad8a06f9de22dcc33`](https://etherscan.io/address/0xA7B7c59a1705e4a624ea8a4ad8a06f9de22dcc33) | EIP-1967 implementation slot |
| wOUSD (ERC-4626) | [`0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62`](https://etherscan.io/address/0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62) | Non-rebasing wrapper; holds ~1.54M OUSD (~24.9% of supply) |
| OUSD Vault (Proxy) | [`0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70`](https://etherscan.io/address/0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70) | Collateral vault; `governor()` = Timelock |
| OUSD Vault Implementation | [`0x82948060c4b72684bededec342350ab344975145`](https://etherscan.io/address/0x82948060c4b72684bededec342350ab344975145) | `OUSDVault`; EIP-1967 admin slot is zero (Governable pattern) |
| Curve USDC AMO Strategy | [`0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11`](https://etherscan.io/address/0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11) | Only mint-whitelisted strategy; `SOLVENCY_THRESHOLD` = 99.8%, `maxSlippage` = 0.2% |
| Morpho V2 Strategy | [`0x3643cafA6eF3dd7Fcc2ADaD1cabf708075AFFf6e`](https://etherscan.io/address/0x3643cafA6eF3dd7Fcc2ADaD1cabf708075AFFf6e) | `defaultStrategy` — receives auto-allocated deposits |
| Cross-Chain Master Strategy (Base) | [`0xB1d624fc40824683e2bFBEfd19eB208DbBE00866`](https://etherscan.io/address/0xB1d624fc40824683e2bFBEfd19eB208DbBE00866) | `CrossChainMasterStrategy`; reports a cached `remoteStrategyBalance` |
| Cross-Chain Master Strategy (HyperEVM) | [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://etherscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) | Same pattern; peer strategy shares the address on HyperEVM |
| OUSD Vault V2 (Morpho Vault V2) | [`0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960`](https://etherscan.io/address/0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960) | `OUSD-V2`; owner + curator = Yearn Security (4/7); 0% fees |
| Morpho Vault V1 Adapter | [`0xD8F093dCE8504F10Ac798A978eF9E0C230B2f5fF`](https://etherscan.io/address/0xD8F093dCE8504F10Ac798A978eF9E0C230B2f5fF) | Sole adapter of `OUSD-V2`; forwards 100% into `OUSD-V1` |
| OUSD Vault V1 (MetaMorpho) | [`0x5B8b9FA8e4145eE06025F642cAdB1B47e5F39F04`](https://etherscan.io/address/0x5B8b9FA8e4145eE06025F642cAdB1B47e5F39F04) | `OUSD-V1`; owner Yearn Security (4/7), curator [`0x90D0…6B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3), guardian [`0xF14B…8FDC`](https://etherscan.io/address/0xF14BBdf064E3F67f51cd9BD646aE3716aD938FDC), 3-day timelock, 5% fee |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Immutable lending primitive underneath both vault layers |
| Curve OUSD/USDC Pool | [`0x6d18E1a7faeB1F0467A77C0d293872ab685426dc`](https://etherscan.io/address/0x6d18E1a7faeB1F0467A77C0d293872ab685426dc) | StableSwapNG; ~$1.10M TVL; 92.5% of its LP is the AMO |
| Curve Gauge | [`0x1eF8B6Ea6434e722C916314caF8Bf16C81cAF2f9`](https://etherscan.io/address/0x1eF8B6Ea6434e722C916314caF8Bf16C81cAF2f9) | AMO stakes LP here for CRV |
| CoW Harvester | [`0xD400341aEfED0BC75176714cFdE82e8BDAA2D3b8`](https://etherscan.io/address/0xD400341aEfED0BC75176714cFdE82e8BDAA2D3b8) | Sells CRV / MORPHO into USDC |
| Timelock Controller | [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F) | `getMinDelay()` = 172,800s (48h); self-administered |
| Origin DeFi Governance | [`0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC`](https://etherscan.io/address/0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC) | PROPOSER + EXECUTOR + CANCELLER on the Timelock |
| GOV Multisig (5/8, cancel-only) | [`0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899`](https://etherscan.io/address/0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899) | CANCELLER only |
| Strategist / Guardian (2/8) | [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://etherscan.io/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) | `strategistAddr()` on vault and on both remote strategies |
| Trustee / Fee Collector (1/3) | [`0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c`](https://etherscan.io/address/0xBB077E716A5f1F1B63ed5244eBFf5214E50fec8c) | Receives the 20% performance fee |
| Operator (EOA) | [`0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b`](https://etherscan.io/address/0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b) | `operatorAddr()` on the vault and on both remote strategies; can call `rebase()` and push cross-chain balance updates |
| xOGN Governance Token | [`0x63898b3b6Ef3d39332082178656E9862bee45C57`](https://etherscan.io/address/0x63898b3b6Ef3d39332082178656E9862bee45C57) | Staked OGN voting power |
| USDC (Collateral) | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Sole vault asset (`getAllAssets()`) |
| Chainlink ETH/USD | [`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Base feed of the OETH/USDC Morpho market oracle |
| Chainlink USDC/USD | [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) | Quote feed of the same market oracle |
| Legacy Oracle Router | [`0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c`](https://etherscan.io/address/0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c) | No longer wired in — the vault's price provider slot is `_deprecated_priceProvider` |

### Base

| Contract | Address | Role / Key facts |
|----------|---------|------------------|
| Cross-Chain Remote Strategy | [`0xB1d624fc40824683e2bFBEfd19eB208DbBE00866`](https://basescan.org/address/0xB1d624fc40824683e2bFBEfd19eB208DbBE00866) | Same address as the mainnet master; `governor()` = [`0xf817…464f`](https://basescan.org/address/0xf817cb3092179083c48c014688D98B72fB61464f) |
| OUSD Vault V2 (Morpho Vault V2) | [`0x2Ba14b2e1E7D2189D3550b708DFCA01f899f33c1`](https://basescan.org/address/0x2Ba14b2e1E7D2189D3550b708DFCA01f899f33c1) | `OUSDb-V2`; owner [`0xFEaE…E36F`](https://basescan.org/address/0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F) (4/8), curator [`0x90D0…6B51`](https://basescan.org/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3) |
| Morpho Vault V1 Adapter | [`0xFE4ccb1f0d9634F3191cA45B7f3413c4ca85086E`](https://basescan.org/address/0xFE4ccb1f0d9634F3191cA45B7f3413c4ca85086E) | Sole adapter; forwards 100% into `OUSDb-V1` |
| OUSD Vault V1 (MetaMorpho) | [`0x581Cc9a73Ec7431723A4a80699B8f801205841F1`](https://basescan.org/address/0x581Cc9a73Ec7431723A4a80699B8f801205841F1) | `OUSDb-V1`; guardian [`0x28bc…9703`](https://basescan.org/address/0x28bce2eE5775B652D92bB7c2891A89F036619703), 3-day timelock, 5% fee |
| USDC (Base) | [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) | CCTP destination asset |

### HyperEVM

| Contract | Address | Role / Key facts |
|----------|---------|------------------|
| Cross-Chain Remote Strategy | [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://hyperevmscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) | Same address as the mainnet master; `governor()` = [`0x7712…1364`](https://hyperevmscan.io/address/0x77121911A387c9e4Eae46345E0f831A6da8a1364) |
| OUSD Vault V2 (Morpho Vault V2) | [`0xE90959cbE7E56b5eBFF9AD12de611A4976F2d2B1`](https://hyperevmscan.io/address/0xE90959cbE7E56b5eBFF9AD12de611A4976F2d2B1) | `OUSDh-V2`; **owner = curator = a single EOA** [`0xFc5F…C12B`](https://hyperevmscan.io/address/0xFc5F89d29CCaa86e5410a7ad9D9d280d4455C12B) |
| Morpho Vault V1 Adapter | [`0xF912d9489DEc1593D888eb680a4074f84c44413c`](https://hyperevmscan.io/address/0xF912d9489DEc1593D888eb680a4074f84c44413c) | Sole adapter; forwards 100% into `OUSDh-V1` |
| OUSD Vault V1 (MetaMorpho v1.1) | [`0x0fb7e41A0A85Eb0BcA55172b73942cc6685e2B2E`](https://hyperevmscan.io/address/0x0fb7e41A0A85Eb0BcA55172b73942cc6685e2B2E) | `OUSDh-V1`; **owner = the same EOA, `curator()` = 0x0, `guardian()` = 0x0, `timelock()` = 0** |
| Morpho Blue (HyperEVM) | [`0x68e37dE8d93d3496ae143F2E900490f6280C57cD`](https://hyperevmscan.io/address/0x68e37dE8d93d3496ae143F2E900490f6280C57cD) | Lending primitive |
| USDC (HyperEVM) | [`0xb88339CB7199b77E23DB6E890353E22632Ba630f`](https://hyperevmscan.io/address/0xb88339CB7199b77E23DB6E890353E22632Ba630f) | CCTP destination asset |

## Audits and Due Diligence Disclosures

OUSD has been audited extensively across its lifecycle. Key OUSD-specific audits:

| # | Date | Firm | Scope | Report |
|---|------|------|-------|--------|
| 1 | Dec 2020 | Trail of Bits | OUSD (pre-relaunch) | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Trail%20of%20Bits%20-%20Origin%20Dollar%20-%20Dec%202020.pdf) |
| 2 | Dec 2020 | Solidified | OUSD (pre-relaunch) | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Solidified%20-%20Origin%20Dollar%20-%20Dec%202020.pdf) |
| 3 | Oct 2021 | OpenZeppelin | Origin Dollar | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20-%20October%202021.pdf) |
| 4 | Jun 2022 | OpenZeppelin | Origin Dollar Governance | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20Governance%20-%20June%202022.pdf) |
| 5 | Oct 2022 | OpenZeppelin | Origin Dollar Convex | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20Convex%20-%20October%202022.pdf) |
| 6 | Apr 2023 | OpenZeppelin | OUSD Dripper & Uniswap Strategy | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20Dollar%20Dripper%20%26%20Uniswap%20strategy%20-%20April%202023.pdf) |
| 7 | Dec 2024 | Certora | Formal Verification (OUSD) | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Certora%20-%20Formal%20verification%20-%20December%202024.pdf) |
| 8 | Dec 2024 | OpenZeppelin | Origin OUSD | [Report](https://github.com/OriginProtocol/security/blob/master/audits/OpenZeppelin%20-%20Origin%20OUSD%20-%20December%202024.pdf) |
| 9 | Feb 2026 | Sigma Prime | OUSD Upgrade Security Assessment v2 | [Report](https://github.com/OriginProtocol/security/blob/master/audits/Sigma%20Prime%20-%20Origin%20OUSD%20Upgrade%20Security%20Assessment%20Report%20v2%20-%20February%202026.pdf) |

The February 2026 Sigma Prime review is the one that matters for the current architecture: its scope covered both the vault upgrade (rebase mechanism, strategy management, yield distribution) and the cross-chain CCTP strategies, and it produced findings specific to CCTP fee handling, remote-balance timestamp tracking, and finality-threshold validation.

Origin Protocol maintains 30+ audit reports across all products in their [security repository](https://github.com/OriginProtocol/security). They have a continuous auditing agreement with OpenZeppelin to review 100% of smart contract changes.

**Smart Contract Complexity:** High — upgradeable proxy pattern (EIP-1967), rebasing token with non-standard ERC-20 behavior, AMO minting mechanism, 4 active strategies including two cross-chain legs driven by CCTP messaging, and a three-deep Morpho vault nesting (strategy → Morpho Vault V2 → adapter → MetaMorpho → Morpho Blue markets) replicated on three chains.

### Bug Bounty

- **Platform:** Immunefi
- **Maximum Payout:** $1,000,000 (critical smart contract, capped at 10% of economic damage, min $50,000)
- **Scope:** OUSD token contract explicitly in-scope (34 assets total)
- **Safe Harbor:** Enabled via SEAL team
- **Link:** https://immunefi.com/bug-bounty/originprotocol/scope/

## Historical Track Record

- **Launched:** September 18, 2020 (~5.5 years in production)
- **Relaunched:** January 5, 2021 (after November 2020 hack, with fresh audits)
- **November 17, 2020 — OUSD Flash Loan Reentrancy Attack ($7.7M loss):**
  - **Attack:** Exploited missing input validation in `mintMultiple()` and lack of reentrancy protection. Attacker used a malicious ERC-20 contract to re-enter the mint function, inflating OUSD supply without depositing backing collateral.
  - **Impact:** 11,809 ETH + 2,249,821 DAI stolen (~$7.7M), including $1M+ from Origin founders/employees.
  - **Resolution:** Deposits immediately disabled. $1M bounty offered for fund recovery. All existing OUSD balances reset to zero upon relaunch.
  - **Compensation:** Users <=1,000 OUSD received 100% in newly minted OUSD. Users >1,000 OUSD received 25% OUSD + 75% in OGN tokens (1-year lock, 25% interest). Founders received no compensation.
  - **Source:** [PeckShield Root Cause Analysis](https://peckshield.medium.com/origin-dollar-incident-root-cause-analysis-f27e11988c90), [rekt.news](https://rekt.news/origin-rekt/)
- **Post-relaunch incidents:** None in ~5 years since relaunch
- **TVL history:** Peak $298.2M (January 1, 2022), all-time low $4.90M (November 2024), current ~$6.24M on-chain / $5.69M as tracked by [DeFiLlama](https://defillama.com/protocol/origin-dollar). Over the last 90 days TVL ran from ~$7.31M in mid-June down to ~$5.63M in mid-August and has since flattened around $5.7M — a ~22% quarterly drawdown with no single-day cliff.
- **Price stability:** Post-relaunch peg maintained within a few basis points of $1.00. Minor deviation to $0.9671 in March 2022. The Curve pool's internal EMA oracle currently marks OUSD at $1.0001.
- **Team:** Origin Protocol since 2017. Founded by Josh Fraser & Matthew Liu. CEO: Rafael Ugolini. Backed by Pantera Capital, Founders Fund.

## Funds Management

**Strategy Allocation** (vault `totalValue()` = 6,237,697.49 USDC at block 25876180):

| Strategy | Balance (USDC) | % of TVL | Description |
|----------|---------------|----------|-------------|
| Morpho V2 (Ethereum) | 2,966,094 | 47.55% | Morpho Vault V2 → MetaMorpho → Morpho Blue |
| Curve USDC AMO | 1,015,646 | 16.28% | Curve OUSD/USDC pool + gauge staking |
| Cross-Chain (Base) | 1,209,584 | 19.39% | CCTP to Base → Morpho Vault V2 stack |
| Cross-Chain (HyperEVM) | 1,039,942 | 16.67% | CCTP to HyperEVM → Morpho Vault V2 stack |
| Vault (idle) | 6,432 | 0.10% | Raw vault USDC 6,446 less the withdrawal queue's `queued − claimed` reserve of 14; `vaultBuffer` = 0 |

Reward tokens (CRV, MORPHO) are sold via CoW Protocol into USDC and returned to the vault, where they are distributed to holders via rebase.

### Where the Morpho Legs Actually Sit

Each Morpho leg is three contracts deep: the strategy holds shares of a **Morpho Vault V2**, which holds a single `MorphoVaultV1Adapter`, which holds shares of a **MetaMorpho (Vault V1)**, which supplies **Morpho Blue** markets. Only the outermost layer is named after OUSD; the risk lives in the innermost markets.

| Chain | Morpho Blue market | LLTV | OUSD exposure | Market utilization | Oracle |
|-------|--------------------|------|---------------|--------------------|--------|
| Ethereum | OETH / USDC — [`0xb8fe…510e`](https://app.morpho.org/ethereum/market/0xb8fef900b383db2dbbf4458c7f46acf5b140f26d603a6d1829963f241b82510e/) | 86% | ~$2,966,000 (~100% of the leg) | 84.6% ($10.32M supplied, $8.73M borrowed) | Chainlink ETH/USD ÷ USDC/USD |
| Base | superOETHb / USDC — [`0x67a6…b538`](https://app.morpho.org/base/market/0x67a66cbacb2fe48ec4326932d4528215ad11656a86135f2795f5b90e501eb538/) | 77% | ~$421,100 (~35% of the leg) | 88.2% ($421.1K supplied, $371.5K borrowed) | Chainlink ETH/USD ÷ USDC/USD |
| Base | cbXRP / USDC — [`0xd4a9…4109`](https://app.morpho.org/base/market/0xd4a903dc6d949519060c7707f9604fdc9772c046e05c2e3a8fce0bd7196e4109/) | 62.5% | ~$788,900 (~65% of the leg) | 86.7% ($50.6M supplied, $43.9M borrowed) | Chainlink XRP/USD |
| HyperEVM | kHYPE / USDC | 62.5% | ~$957,000 (~92% of the leg) | 85.5% ($11.64M supplied, $9.95M borrowed) | RedStone kHYPE_FUNDAMENTAL × RedStone HYPE |
| HyperEVM | WHYPE / USDC | 62.5% | ~$84,000 (~8% of the leg) | 87.9% ($1.37M supplied, $1.21M borrowed) | RedStone HYPE |

Two consequences follow directly from this table.

**Origin's own LSTs back over half of OUSD.** ~$2.97M (OETH on Ethereum) plus ~$421K (superOETHb on Base) is **~54% of OUSD's TVL** lent against collateral that Origin itself issues. The borrowers are third parties — 38 `Borrow` events from 15 distinct accounts in the OETH market over the last ~275K blocks — so this is not a self-loan, but the credit quality of a majority of OUSD's backing is a function of an Origin product. Both oracles price the collateral off **Chainlink ETH/USD with no OETH/ETH or superOETHb/ETH feed**, i.e. they hard-assume a 1:1 peg to ETH. An OETH depeg would not trigger liquidations; it would silently convert those positions into bad debt carried by OUSD.

**Origin's own AMO is the Curve pool.** The AMO strategy holds 1,012,809 of the pool's 1,094,475 LP tokens — **92.5%** of the OUSD/USDC pool. The "secondary DEX liquidity" that backstops OUSD's peg is, in the main, OUSD's own capital.

### Accessibility

- **Minting:** Permissionless. Anyone can call `mint()` by depositing USDC; the vault mints equivalent OUSD 1:1. Requires `safeTransferFrom` of USDC — cannot mint without depositing collateral.
- **AMO Minting:** The Curve AMO strategy can call `mintForStrategy()` to mint OUSD without direct user-deposited backing (see [AMO Minting Analysis](#amo-minting-analysis) below). Only governor-whitelisted strategies can use this function.
- **Redemption:** Async withdrawal queue — two-step process:
  1. `requestWithdrawal(amount)` burns OUSD immediately and enqueues a withdrawal (NFT-like request ID).
  2. `claimWithdrawal(id)` / `claimWithdrawals(ids[])` pays out USDC after `withdrawalClaimDelay` (600s = **10 minutes minimum**, verified on-chain) AND when the queue's claimable liquidity has caught up to the request.
  There is no on-chain upper bound on claim time — if the queue is ahead of deposits/strategy withdrawals, a claim can wait indefinitely. The strategist (or anyone permissionlessly, via `allocate()` / `addWithdrawalQueueLiquidity()`) must supply USDC to advance the queue.
- **Queue state:** `withdrawalQueueMetadata()` reports lifetime cumulative counters — `queued` = `claimable` = 3,546,522 USDC and `claimed` = 3,546,507 across 161 requests since launch. The outstanding, unclaimed balance is `queued − claimed` = **14 USDC**; there is effectively no backlog.
- **DEX Swaps:** Instant exits via Curve OUSD/USDC pool (~$1.10M TVL).
- **Fees:** 20% performance fee (2,000 bps), no deposit/withdrawal fees.

### AMO Minting Analysis

**Can OUSD be minted without backing?** Yes, through the AMO mechanism, but with constraints:

1. **`mintForStrategy()`** allows whitelisted strategies to mint OUSD without depositing collateral. Currently only the Curve USDC AMO strategy ([`0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11`](https://etherscan.io/address/0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11)) is whitelisted.
2. **Adding strategies to the mint whitelist requires governance** (xOGN vote + 48h timelock).
3. **Solvency check:** After every AMO operation, `_solvencyAssert()` verifies that `totalVaultValue / totalOUSDSupply >= 99.8%` (SOLVENCY_THRESHOLD). This caps the maximum unbacked OUSD at ~0.2% of total supply.
4. **Pool balance check:** The `improvePoolBalance` modifier ensures one-sided operations (mint-and-add or remove-and-burn) must improve the Curve pool's balance. Sequential operations in the same direction are prevented.
5. **`maxSupplyDiff`:** Set to 5% (checked during redemptions) — if supply exceeds backing by >5%, redemptions revert.
6. **Historical minting cap (`netOusdMintForStrategyThreshold`) has been deprecated.** There is no vault-level per-strategy cap. Protection relies on the strategy-level solvency check.

**Risk assessment:** AMO-minted OUSD enters the Curve pool (not free circulation). It can only be obtained by someone swapping USDC for it, at which point it becomes backed. The strategist (2-of-8 multisig) can trigger AMO operations without governance vote. The 99.8% solvency threshold limits exploitation but the deprecated vault-level cap is a design choice worth monitoring.

### Collateralization

- The vault's only asset is USDC (`getAllAssets()` returns a single entry), and OUSD is minted 1:1 against it. Backing ratio `totalValue() / totalSupply()` = 100.34%.
- What backs OUSD in practice is not idle USDC but **lending claims**: ~80% of TVL is USDC supplied to Morpho Blue markets across Ethereum, Base, and HyperEVM, and ~16% is an AMO LP position in the Curve OUSD/USDC pool. `vaultBuffer` = 0, so effective idle USDC is ~6,432.
- Collateral behind those lending claims is Origin's own OETH and superOETHb (~54% of TVL), cbXRP (~12.6%), and HYPE / kHYPE (~16.7%). Every market is over-collateralized at the LLTVs above, but the OETH and superOETHb markets rely on oracles that assume a hard 1:1 peg to ETH.
- No debt, leverage, or liquidation mechanics exist in the OUSD vault itself; the leverage sits with the third-party borrowers on the other side of the Morpho markets.
- Cross-chain strategies hold ~36% of TVL on Base and HyperEVM — these funds require a CCTP round trip before they can settle an Ethereum redemption.

### Provability

- `vault.totalValue()` returns the sum of strategy balances plus vault USDC, **minus the withdrawal-queue reserve** (`queued − claimed`). The same is true of `vault.checkBalance(asset)`. Raw vault USDC and the queue reserve must be inspected separately to reconstruct each component.
- `ousd.totalSupply()` lives on the OUSD token, not on the vault. The vault parameter `maxSupplyDiff` (5%) and the AMO `SOLVENCY_THRESHOLD` (99.8%) compare these two sources at redemption / AMO time.
- Rebase calculated programmatically: `rebasingCreditsPerToken` determines each holder's share of rebased yield.
- The vault holds no oracle. The current implementation's price-provider slot is `_deprecated_priceProvider` and neither `VaultCore` nor `VaultAdmin` reads a price anywhere — with a single 1:1 asset there is nothing to price. Chainlink still matters, but one layer down, inside the Morpho market oracles.
- **Cross-chain balances are cached, not live.** `CrossChainMasterStrategy.checkBalance()` returns `local USDC + pendingAmount + remoteStrategyBalance`, where `remoteStrategyBalance` is a value pushed from the remote chain over CCTP messaging and accepted up to `MAX_BALANCE_CHECK_AGE = 1 day` old. At the snapshot block the cached figures track the remote side to within ~$23 (Base 1,209,584 cached vs 1,209,605 live; HyperEVM 1,039,942 vs 1,039,964), so the mechanism is working — but 36% of reported TVL is a message, not a read.
- Full verification requires walking three chains and four contract layers per leg. Everything is on-chain and permissionlessly readable; nothing is attested off-chain.

## Liquidity Risk

- **Primary exit:** Async withdrawal queue via `requestWithdrawal()` → `claimWithdrawal()`. OUSD is burned at request time; USDC is paid only after (a) `withdrawalClaimDelay` of 10 minutes AND (b) queue claimable liquidity has advanced past the request. No on-chain upper bound on wait time — effective wait depends on how quickly strategies return USDC.
- **Queue backlog:** effectively zero. `withdrawalQueueMetadata()` cumulative `queued` (3,546,522) minus cumulative `claimed` (3,546,507) leaves 14 USDC outstanding across 161 lifetime requests. Note that `queued` and `claimable` are running lifetime totals, not a live backlog; only `queued − claimed` measures pending exit demand.
- **Instant on-Ethereum liquidity is the binding constraint.** Only ~$1.59M of the $2.97M Ethereum Morpho position can be pulled right now — the OETH/USDC market runs at 84.6% utilization, leaving $1,594,442 of free liquidity. Adding vault idle (~$6K) and the Curve pool's USDC side (~$505K), roughly **$2.1M (~34% of TVL) is reachable without waiting on borrowers or a bridge**.
- **DEX liquidity:** Curve OUSD/USDC pool ([`0x6d18E1a7faeB1F0467A77C0d293872ab685426dc`](https://etherscan.io/address/0x6d18E1a7faeB1F0467A77C0d293872ab685426dc)) holds 592,983 OUSD + 504,559 USDC (nominal TVL ~$1.10M). `get_dy(0,1, 100k OUSD)` = 99,965 USDC (−0.03%), `get_dy(0,1, 300k)` = 299,732 (−0.09%), `get_dy(0,1, 500k)` = 492,141 (−1.6%). The USDC side is only ~$505K, so swap exits past ~$500K OUSD deplete it. 92.5% of the pool's LP is Origin's own AMO, so this depth is not independent third-party liquidity.
- **Vault buffer:** `vaultBuffer` = 0 and effective idle USDC is ~6,432. Queue advancement depends on the strategist pulling from strategies (`withdrawFromStrategy` / `withdrawAllFromStrategies`), on the permissionless `addWithdrawalQueueLiquidity()`, or on new deposits auto-allocating.
- **Cross-chain assets:** ~$2.25M (~36% of TVL) on Base and HyperEVM. The HyperEVM leg is fully liquid at the remote end ($1.04M position against $1.86M of free market liquidity); the Base leg is not — its superOETHb market is 88.2% utilized with only ~$50K free against a ~$421K position, so ~$421K of the Base leg is illiquid until borrowers repay. Everything returning to Ethereum needs a CCTP round trip (minutes to hours) on top.
- **No priority mechanism** — first-come-first-served queue ordering.
- **Same-value assets** (USD stablecoins) mitigate price impact risk during any waiting period.
- **Legacy OUSD/3CRV pool:** ~13,956 OUSD + ~13,990 3CRV (~$28K), effectively deprecated.

## Centralization & Control Risks

### Governance

**Governance Structure:** Identical to Origin ARM — same xOGN governance, same Timelock, same multisig. See [Appendix: Contract Architecture](#appendix-contract-architecture) for full diagram.

**Timelock Roles (verified via `hasRole()`):**

| Role | Origin DeFi Governance | GOV Multisig (5/8) |
|------|:---:|:---:|
| PROPOSER | ✓ | ✗ |
| EXECUTOR | ✓ | ✗ |
| CANCELLER | ✓ | ✓ |

- Timelock is self-administered (TIMELOCK_ADMIN_ROLE held by itself)
- Total time from proposal to execution: ~5 days minimum (24h voting delay + 48h voting + 48h timelock)
- No backdoor — only Origin DeFi Governance can propose/execute

**Multisig thresholds (`getThreshold()` / `getOwners()`):** GOV Multisig 5-of-8, Strategist / Guardian 2-of-8, Trustee 1-of-3.

**Privileged Roles:**

| Role | Who | Timelock? | Powers |
|------|-----|-----------|--------|
| Governor (owner) | Timelock → xOGN governance | ~5 days | Upgrade proxy, approve/remove strategies, add/remove from mint whitelist, `setAutoAllocateThreshold`, `setMaxSupplyDiff`, `setWithdrawalClaimDelay`, `setTrusteeFeeBps`, `setTrusteeAddress`, `setStrategistAddr`, `setOperatorAddr`, `governanceRebaseOptIn` |
| Strategist | 2-of-8 Safe `0x4FF1…971` | None | Vault (all `onlyGovernorOrStrategist`): `depositToStrategy` / `withdrawFromStrategy` / `withdrawAllFromStrategy` / `withdrawAllFromStrategies`, `setVaultBuffer`, `setDefaultStrategy`, `setRebaseRateMax`, `setDripDuration`, `pauseCapital` / `pauseRebase`, `unpauseCapital` / `unpauseRebase`, `rebase`. Curve AMO: `mintAndAddOTokens` / `removeAndBurnOTokens` / `removeOnlyAssets`, reward harvesting. Both remote cross-chain strategies: `deposit` / `depositAll` / `withdraw` / `withdrawAll`. OUSD Token (`onlyGovernorOrStrategist`): `delegateYield(from, to)`, `undelegateYield(from)` — can redirect rebase yield of **any account** to any other account without that account's consent. |
| Operator | EOA `0x7392…F38b` | None | `rebase()` on the vault; `sendBalanceUpdate()` on both remote strategies. Bounded — `_rebase()` only ratchets supply upward, never above `totalValue()`, and is capped by `rebasePerSecondMax` and a 2% per-rebase ceiling. |
| Trustee | 1-of-3 Safe `0xBB07…c8c` | None | Receives 20% performance fee |

**Key Risks:**

1. **A single EOA governs the HyperEVM Morpho stack.** `OUSDh-V1` ([`0x0fb7e41A…2B2E`](https://hyperevmscan.io/address/0x0fb7e41A0A85Eb0BcA55172b73942cc6685e2B2E)), the MetaMorpho v1.1 vault holding the whole ~$1.04M HyperEVM leg (~16.7% of OUSD TVL), has `owner()` = [`0xFc5F89d2…C12B`](https://hyperevmscan.io/address/0xFc5F89d29CCaa86e5410a7ad9D9d280d4455C12B) — an address with no code — together with `curator()` = `0x0`, `guardian()` = `0x0`, and `timelock()` = **0**. In MetaMorpho the owner is implicitly an allocator, and with a zero timelock `submitCap` takes effect immediately, so that one key can raise a cap on an arbitrary market, reorder the supply queue, and `reallocate` the entire position into a market of its own construction in a single block, with no guardian able to revoke and no delay in which Origin could react. The `OUSDh-V2` wrapper above it is governed by the same EOA. This is the largest single un-timelocked fund-loss path in the system and it sits outside Origin's governance entirely.
2. **AMO minting without timelock:** The Strategist can trigger AMO mint/burn operations, constrained by the strategy-level 99.8% solvency check. The vault-level AMO minting cap (`netOusdMintForStrategyThreshold`) is deprecated (function reverts on-chain).
3. **Yield delegation without timelock:** `delegateYield` / `undelegateYield` on the OUSD token are `onlyGovernorOrStrategist` — the strategist can redirect the rebase yield of any account (including smart contracts holding OUSD) to an arbitrary recipient. This is a non-trivial power over holder yield.
4. **Strategy reallocation without timelock:** The strategist can move all vault funds to/from any approved strategy (`withdrawAllFromStrategies`, `setDefaultStrategy`, `depositToStrategy`). Bounded by what's already on the governor-approved strategy list.
5. **Rebase rate cap without timelock:** `setRebaseRateMax` lets the strategist cap the rebase APR — misconfiguration could strand yield. `rebasePerSecondMax` is currently 2,496,362,574 (≈7.87% APR).

### Programmability

- Standard minting and `requestWithdrawal` / `claimWithdrawal`: fully programmatic and permissionless. `allocate()` and `addWithdrawalQueueLiquidity()` are permissionless too.
- Rebase: **not** automatic on user operations. `rebase()` is restricted to the operator EOA, the strategist, or the governor. Yield is dripped rather than paid in full: `_nextYield()` smooths the surplus over `dripDuration` (604,800s = 7 days), caps it at `rebasePerSecondMax` (≈7.87% APR), and hard-caps any single rebase at 2% of rebasing supply. Supply only ever ratchets up and never above `totalValue()`.
- Auto-allocation: triggered inside `mint()` when a deposit exceeds `autoAllocateThreshold` (25,000 USDC), routed to `defaultStrategy` (currently the Morpho V2 strategy).
- AMO operations and inter-strategy rebalancing: require strategist intervention.
- Cross-chain strategy management: manual bridging decisions plus operator-pushed balance updates; the mainnet accounting for those legs is a cached value refreshed by CCTP messages.
- Reward harvesting: CoW Harvester sells CRV/MORPHO → USDC via CoW Protocol (semi-automated, bot-triggered).

### External Dependencies

1. **USDC / Circle (Critical)** — Sole collateral asset on all three chains. Circle can freeze/blacklist addresses holding USDC, which would impact the vault, the strategies, or the remote legs.
2. **Morpho (Critical)** — ~80% of TVL ultimately sits in Morpho Blue markets, reached through six intermediating vault contracts across three chains. Morpho Blue itself is immutable; the risk is concentrated in the curation layer above it.
3. **Morpho curation counterparties (Critical)** — three separate governance sets sit between OUSD and the markets:
   - **Ethereum:** `OUSD-V2` and `OUSD-V1` are owned by the **Yearn Security multisig** ([`0xe5e2Baf9…89c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0), 4-of-7), curated by [`0x90D0…6B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2-of-3), with a guardian and a 3-day timelock. Note that this is the same Yearn multisig that curates Yearn's own Morpho vaults — a related-party relationship from Yearn's perspective, though a well-governed one.
   - **Base:** `OUSDb-V2` / `OUSDb-V1` owned by [`0xFEaE2F85…E36F`](https://basescan.org/address/0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F) (4-of-8), same curator Safe, guardian set, 3-day timelock.
   - **HyperEVM:** `OUSDh-V2` / `OUSDh-V1` owned and curated by a **single EOA** with **no guardian and a zero timelock**. See Key Risk 1 above.
4. **Origin OETH / superOETHb (Critical)** — ~54% of TVL is lent against Origin's own LSTs, priced by oracles that assume a fixed 1:1 ETH peg. A sustained OETH depeg produces bad debt in the markets OUSD supplies without triggering liquidations first.
5. **Curve (High)** — AMO yield generation (~16% of TVL) and the primary on-Ethereum DEX exit (~$1.10M pool TVL, ~$505K USDC side). 92.5% of that pool's LP is the AMO itself.
6. **Circle CCTP (High)** — Cross-chain strategies use Circle CCTP V2 to bridge USDC to Base and HyperEVM, and also to carry the balance and withdrawal messages the mainnet accounting depends on. ~36% of TVL is held on remote chains.
7. **Chainlink (High)** — No longer read by the OUSD vault, but the ETH/USD and USDC/USD feeds price the OETH and superOETHb Morpho markets that hold ~54% of TVL.
8. **RedStone (Medium)** — `kHYPE_FUNDAMENTAL` and `HYPE` push feeds price the HyperEVM markets holding ~17% of TVL.
9. **CoW Protocol (Low)** — Used for reward token swaps (CRV, MORPHO → USDC). Not critical for core functionality.

There is no single dependency whose failure stops the protocol, but the dependency surface is now both wider and deeper than the vault's "100% USDC-backed" description suggests: a Circle freeze, a Morpho curation failure on any of three chains, or an OETH depeg each reaches a large fraction of backing.

## Operational Risk

- **Team:** Origin Protocol since 2017, public team, known leadership (Josh Fraser, Matthew Liu, Rafael Ugolini), VC-backed (Pantera, Founders Fund)
- **Documentation:** Comprehensive. Public GitHub with active development, dedicated security repo with 30+ audits
- **Legal:** Established company (Origin Protocol)
- **Incident Response:** Learned from 2020 hack. $1M bug bounty on Immunefi. Safe Harbor enabled via SEAL team. Full relaunch with multiple audits after incident.

## Monitoring

- **HyperEVM Morpho vault (highest priority):** Watch `OUSDh-V1` [`0x0fb7e41A…2B2E`](https://hyperevmscan.io/address/0x0fb7e41A0A85Eb0BcA55172b73942cc6685e2B2E) for `SetSupplyQueue`, `SetWithdrawQueue`, `SubmitCap` / `SetCap`, `ReallocateSupply`, `SetTimelock`, `SetGuardian`, `SetCurator`, and `SetOwner`. Because `timelock()` is 0 and no guardian is set, a cap change and a reallocation can land in the same block — detection is the only control available. Do the same for `OUSDh-V2` [`0xE90959cb…D2B1`](https://hyperevmscan.io/address/0xE90959cbE7E56b5eBFF9AD12de611A4976F2d2B1) (`SetIsAdapter`, `SetIsAllocator`, `Submit`/`Accept`). Alert on any change to `owner()`, `curator()`, `guardian()`, or `timelock()`.
- **Governance:** Monitor Timelock events (`CallScheduled`, `CallExecuted`, `Cancelled`) on [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F). Monitor EIP-1967 implementation slot changes on Vault and OUSD Token proxies. Monitor Origin DeFi Governance proposals.
- **Vault Parameters:** Track `totalValue()` on the vault ([`0xE75D…F70`](https://etherscan.io/address/0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70)) and `totalSupply()` on the OUSD token ([`0x2A8e…E86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86)). Alert on >1% divergence. **Note:** `totalValue()` and `checkBalance(asset)` already subtract the withdrawal-queue reserve (`queued − claimed`); reconstruct components from the per-strategy `checkBalance()` calls, the vault's raw USDC balance, and `withdrawalQueueMetadata()` separately. Monitor `rebasePaused()` / `capitalPaused()`. Track `maxSupplyDiff`, `vaultBuffer`, `defaultStrategy`, `dripDuration`, `rebasePerSecondMax`, and `operatorAddr` changes.
- **AMO:** Monitor `mintForStrategy()` calls and the OUSD supply vs vault value ratio. Alert if solvency drops below 99.5%. Track `isMintWhitelistedStrategy` changes (requires governance).
- **Strategy Allocation:** Monitor strategy balances via `checkBalance()` on each strategy. Alert on >20% TVL change in 24h. Track CCTP bridge transactions on both cross-chain legs.
- **Cross-chain balance freshness:** The mainnet `checkBalance()` for both remote legs is a cached `remoteStrategyBalance` accepted up to `MAX_BALANCE_CHECK_AGE` (1 day) old. Compare it against the live remote-side `checkBalance()` on Base and HyperEVM; alert on divergence >1% or on a cache older than a day.
- **Morpho market oracles:** The OETH/USDC (Ethereum) and superOETHb/USDC (Base) markets price collateral as Chainlink ETH/USD ÷ USDC/USD with no LST-specific feed. Monitor the OETH and superOETHb secondary-market prices against ETH directly; a depeg is invisible to those markets. Monitor Chainlink ETH/USD ([`0x5f4eC3Df…8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)) and USDC/USD ([`0x8fFfFfd4…18f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6)) for staleness, and the RedStone `kHYPE_FUNDAMENTAL` / `HYPE` feeds on HyperEVM.
- **Morpho market liquidity:** Track `totalSupplyAssets − totalBorrowAssets` for the OETH/USDC and superOETHb/USDC markets. Alert when free liquidity in the Ethereum OETH market falls below the vault's likely redemption need, or when the Base superOETHb market's free liquidity stays near zero.
- **Morpho curation (Ethereum + Base):** Track curator, owner, guardian, timelock, cap submissions, and supply-queue changes on `OUSD-V2` / `OUSD-V1` and `OUSDb-V2` / `OUSDb-V1`.
- **Liquidity:** Monitor the Curve OUSD/USDC pool balance ratio; alert on imbalance beyond 60/40. Track the AMO's share of the pool's LP supply — a fall would signal the AMO is unwinding OUSD's own DEX depth.
- **Strategist:** Monitor role changes on vault `strategistAddr()`. Track AMO operation frequency and size. Monitor `YieldDelegated` / `YieldUndelegated` events on the OUSD token. Monitor `withdrawAllFromStrategies`, `setVaultBuffer`, `setDefaultStrategy`, `setDripDuration`, `setRebaseRateMax` calls.
- **Withdrawal Queue:** Track `withdrawalQueueMetadata()` and compute the live backlog as `queued − claimed` — `queued` and `claimable` on their own are lifetime cumulative totals and will look alarming if read as a depth. Alert when the backlog exceeds vault idle plus free Ethereum Morpho liquidity.

## Risk Summary

### Key Strengths

1. On-chain xOGN governance with a ~5-day total cycle, self-administered 48h Timelock, cancel-only GOV multisig, and no admin backdoor — identical governance to audited Origin ARM
2. 9 OUSD-specific audits by top firms (OpenZeppelin, Trail of Bits, Sigma Prime, Solidified, Certora formal verification) + $1M Immunefi bounty; the February 2026 Sigma Prime review covered both the current vault implementation and the cross-chain CCTP design
3. ~5 years clean track record since the January 2021 relaunch, with lessons learned from the 2020 hack
4. Standard minting always requires a USDC collateral deposit — permissionless and fully backed; backing ratio is 100.34%
5. AMO minting constrained by the 99.8% solvency check, the pool-balance-improvement modifier, and a governance-controlled whitelist that still contains only the Curve AMO
6. The withdrawal queue is fully drained (14 USDC outstanding across 161 lifetime requests) and the vault is unpaused
7. Rebase is rate-limited by construction: supply only ratchets up, never above `totalValue()`, capped at ≈7.87% APR and 2% per rebase

### Key Risks

1. **A single EOA with no timelock and no guardian controls ~16.7% of TVL.** The HyperEVM MetaMorpho vault holding the $1.04M leg is owned and curated by one keypair with `timelock() = 0`; it can reallocate the entire position into an arbitrary Morpho market in one transaction. This dependency sits wholly outside Origin's governance.
2. **~54% of TVL is credit exposure to Origin's own LSTs.** USDC is lent against OETH (Ethereum) and superOETHb (Base) in Morpho markets whose oracles hard-assume a 1:1 ETH peg — a depeg produces bad debt without first producing liquidations.
3. **Morpho concentration and depth.** ~80% of TVL routes through Morpho Blue via six intermediating vault contracts on three chains; the Ethereum leg alone is 47.6% of TVL in a single market at 84.6% utilization, leaving ~$1.59M withdrawable on demand.
4. AMO `mintForStrategy()` can mint OUSD without direct backing (constrained to ~0.2% of supply by the strategy-level solvency check); the historical vault-level cap is deprecated
5. Strategist (2-of-8 multisig) has broad untimelocked power: AMO operations, strategy allocation, vault parameters, pause controls, remote-strategy deposits/withdrawals, **and yield delegation** (`delegateYield` / `undelegateYield` can redirect any account's rebase yield)
6. Single collateral dependency on USDC (Circle) — a centralized stablecoin with freeze capability, now held on three chains
7. Cross-chain strategies (~36% of TVL) add bridge risk, and mainnet accounting for them is a CCTP-pushed cached balance up to a day stale by design
8. Thin and non-independent exit depth: the Curve pool holds only ~$505K of USDC and 92.5% of its LP is Origin's own AMO; `vaultBuffer` = 0 leaves ~$6K idle; redemptions flow through an async queue with no on-chain upper bound on claim time
9. TVL ~$6.24M, down ~22% over the quarter and ~98% from the $298M peak — small enough that a single large redeemer dominates the exit path

### Critical Risks

- **No gate is triggered for OUSD itself.** OUSD is governed by an on-chain DAO plus a 48h timelock, its contracts are source-verified, and reserves are fully readable on-chain.
- The single-EOA HyperEVM Morpho vault would trigger the "total centralization" gate if it were the assessed protocol. It is a dependency rather than the subject of this assessment, so it is priced into the dependency and collateralization scores instead — but it is the finding a reader should carry away.
- Historical $7.7M hack (November 2020) was on a different codebase; the protocol was completely relaunched with audited contracts.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **Unverified contract source** → **PASS** (vault, token, strategies, and every Morpho vault in the chain are source-verified)
- [ ] **No audit** → **PASS** (9 OUSD-specific audits including Trail of Bits, OpenZeppelin, Sigma Prime, Certora)
- [ ] **Unverifiable reserves** → **PASS** (fully on-chain via `totalValue()` and per-strategy `checkBalance()`, though the cross-chain legs read a CCTP-pushed cache and full reconstruction spans three chains)
- [ ] **Total centralization** → **PASS** (xOGN governance + 48h Timelock; strategist is a 2-of-8 multisig, not an EOA). The gate is scoped to the assessed protocol; the single-EOA HyperEVM Morpho vault is scored as a dependency in Categories 2C and 3A.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.5**

**Subcategory A: Audits & Security Reviews — 1.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | 9 OUSD-specific audits by 5 top firms (OpenZeppelin, Trail of Bits, Sigma Prime, Solidified, Certora) |
| Current architecture | The Feb 2026 Sigma Prime review scoped both the deployed vault implementation and the cross-chain CCTP strategies |
| Bug Bounty | $1M on Immunefi, OUSD explicitly in scope, Safe Harbor enabled |
| Formal Verification | Certora formal verification (December 2024) |
| Continuous Review | OpenZeppelin reviews 100% of contract changes |

**Subcategory B: Historical Track Record — 2.0**

| Aspect | Assessment |
|--------|-----------|
| Time in Production | ~5.9 years total, ~5.6 years since the secure relaunch |
| Past Incidents | $7.7M flash-loan reentrancy hack (Nov 2020) on pre-relaunch code; users fully compensated; different code since relaunch |
| TVL | ~$6.24M — down ~22% over the quarter and ~98% from the $298M peak (Jan 2022) |
| Price Stability | Peg maintained within basis points of $1.00 since relaunch; Curve EMA marks OUSD at $1.0001 |
| Redemption pressure | Withdrawal queue fully drained — 14 USDC outstanding across 161 lifetime requests |

**Score: (1.0 + 2.0) / 2 = 1.5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **2.33**

**Subcategory A: Governance — 1.0**
- On-chain xOGN token governance with a ~5-day cycle (24h delay + 48h voting + 48h timelock); `getMinDelay()` = 172,800s
- Self-administered Timelock (TIMELOCK_ADMIN_ROLE held by itself); Origin DeFi Governance holds PROPOSER/EXECUTOR/CANCELLER; GOV Multisig (5-of-8) is CANCELLER-only
- No admin backdoor, and no EOA holds a fund-moving role on Origin's own contracts. Same governance as Origin ARM.

**Subcategory B: Programmability — 2.5**
- Minting, `requestWithdrawal`, `claimWithdrawal`, `allocate`, and `addWithdrawalQueueLiquidity` are permissionless; rebase is algorithmic, rate-capped, and can only ratchet supply upward within `totalValue()`
- **Broad untimelocked strategist surface** (2-of-8 multisig, `onlyGovernorOrStrategist`): AMO mint/burn, strategy allocation (`depositToStrategy`, `withdrawFromStrategy`, `withdrawAllFromStrategies`, `setDefaultStrategy`), vault parameters (`setVaultBuffer`, `setDripDuration`, `setRebaseRateMax`), pause controls, remote-strategy deposits and withdrawals, and OUSD token `delegateYield` / `undelegateYield` which can redirect any account's rebase yield without consent
- An operator EOA can call `rebase()` and push cross-chain balance updates — bounded, but it means live accounting for 36% of TVL depends on an off-chain keeper doing its job
- Cross-chain strategy management and AMO rebalancing require manual intervention; reward harvesting is semi-automated via CoW Protocol

**Subcategory C: External Dependencies — 3.5**
- Critical: USDC/Circle (sole asset, three chains); Morpho Blue (~80% of TVL); three independent Morpho curation regimes; Origin's own OETH/superOETHb as the collateral behind ~54% of TVL
- One of those curation regimes — HyperEVM, ~16.7% of TVL — is a single EOA with a zero timelock, no curator separation, and no guardian, i.e. an unmitigated single-key path to the funds
- High: Curve (AMO yield plus the only meaningful on-Ethereum DEX exit, 92.5% AMO-owned), Circle CCTP (asset transport *and* the accounting message bus), Chainlink (prices the OETH/superOETHb markets)
- Medium: RedStone (prices the HyperEVM markets). Low: CoW Protocol (reward swaps)
- The vault's own oracle dependency is gone — the price-provider slot is deprecated and no code path reads a feed — but the dependency moved down a layer rather than away

**Score: (1.0 + 2.5 + 3.5) / 3 = 2.33**

#### Category 3: Funds Management (Weight: 30%) — **2.5**

**Subcategory A: Collateralization — 3.0**
- 100% on-chain backing, ratio 100.34%, single high-quality asset (USDC)
- But the backing is deployed as lending claims, not held: ~80% of TVL is USDC supplied to Morpho Blue and ~16% is an AMO LP position. Collateral quality behind those claims is mixed — Origin's own OETH/superOETHb (~54% of TVL) priced at an assumed 1:1 ETH peg, cbXRP (~12.6%), and HYPE/kHYPE (~16.7%)
- ~16.7% of TVL sits under a Morpho vault whose owner-curator is a single EOA with no timelock — collateral that is over-collateralized on paper but whose custody path has a one-key failure mode
- AMO can temporarily create up to ~0.2% unbacked OUSD (solvency check)
- `vaultBuffer` = 0; effective idle USDC ~$6,432

**Subcategory B: Provability — 2.0**
- Everything is on-chain and permissionlessly readable, with no off-chain attestation anywhere
- But reconstruction is genuinely involved: `totalValue()` nets out the queue reserve, and each cross-chain leg requires walking a master strategy, a remote strategy, two Morpho vault layers, and the underlying markets on a second chain
- 36% of reported TVL is a **cached** `remoteStrategyBalance` refreshed by CCTP messages and accepted up to a day old, rather than a live read. It tracked the remote side to within ~$23 at the snapshot block, but the accounting is push-based

**Score: (3.0 + 2.0) / 2 = 2.5**

#### Category 4: Liquidity Risk (Weight: 15%) — **2.5**

- Async withdrawal queue: 10-minute minimum delay (`withdrawalClaimDelay` = 600s) plus queue liquidity catch-up; no on-chain upper bound
- Queue backlog is effectively zero (14 USDC outstanding), so there is no queued exit demand competing with a new redeemer
- Instantly reachable on Ethereum: ~$1.59M of free Morpho liquidity + ~$505K Curve USDC side + ~$6K idle ≈ **$2.1M, ~34% of TVL** — enough to absorb a sizeable but not a wholesale exit
- Curve OUSD/USDC pool ~$1.10M TVL with slippage under 0.1% up to 300K OUSD, but the USDC side is only ~$505K and 92.5% of the pool's LP is Origin's own AMO
- Cross-chain assets (~$2.25M, ~36% of TVL) need a CCTP round trip; the HyperEVM leg is liquid at the remote end, but ~$421K of the Base leg is stuck behind an 88%-utilized superOETHb market
- Same-value assets (USD stablecoins) mitigate waiting risk; no priority mechanism, first-come-first-served

#### Category 5: Operational Risk (Weight: 5%) — **1.0**

- Established team (2017), public, VC-backed (Pantera, Founders Fund)
- Comprehensive security repo with 30+ audit reports
- $1M bug bounty, Safe Harbor enabled
- Demonstrated incident response capability (2020 hack recovery and user compensation)

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.5 × 0.20) + (2.33 × 0.30) + (2.5 × 0.30) + (2.5 × 0.15) + (1.0 × 0.05)
            = 0.300 + 0.699 + 0.750 + 0.375 + 0.050
            = 2.174
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 2.33 | 30% | 0.699 |
| Funds Management | 2.5 | 30% | 0.750 |
| Liquidity Risk | 2.5 | 15% | 0.375 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **2.17 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

---

## Reassessment Triggers

- **Time-based:** Quarterly (next: November 2026)
- **Incident-based:** Any security incident, AMO solvency anomaly, USDC depeg/freeze, OETH or superOETHb depeg, bad debt in any Morpho market OUSD supplies, or a CCTP outage
- **Change-based:**
  - Any change to `owner()`, `curator()`, `guardian()`, or `timelock()` on the HyperEVM `OUSDh-V1` / `OUSDh-V2` vaults — in particular, a non-zero timelock or a real guardian being set would materially reduce Key Risk 1
  - Curator, owner, guardian, or timelock changes on the Ethereum or Base Morpho vault stacks
  - Supply-queue or cap changes that move a Morpho leg into a new collateral type
  - New strategy added to the mint whitelist, or a new cross-chain deployment
  - Governance parameter changes on the vault (`setStrategistAddr`, `setOperatorAddr`, `setMaxSupplyDiff`, `setWithdrawalClaimDelay`, proxy upgrades)
  - Significant TVL change (>50%), or Origin-LST collateral exposure moving materially away from ~54% of TVL

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [June 25, 2026](https://github.com/yearn/risk-score/pull/136) | 1.85 | Initial assessment |
| [August 31, 2026](https://github.com/yearn/risk-score/pull/434) | 2.17 | TVL $6.24M (−16%). Traced the Morpho legs three vault layers deep on three chains: ~54% of TVL is USDC lent against Origin's own OETH / superOETHb in markets whose oracles assume a 1:1 ETH peg, and the HyperEVM leg (~16.7% of TVL) sits under a MetaMorpho vault owned and curated by a single EOA with `timelock() = 0` and no guardian. Corrected the withdrawal-queue reading — `queued` / `claimable` are lifetime counters, outstanding demand is 14 USDC. Vault uses no oracle (`_deprecated_priceProvider`) and rebase is permissioned and rate-capped. Governance, roles, thresholds, proxies, and the mint whitelist unchanged. Dependencies 2.5 → 3.5, Collateralization 2.0 → 3.0, Provability 1.5 → 2.0. |

---

## Appendix: Contract Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          GOVERNANCE (Ethereum)                           │
│                                                                          │
│  xOGN Token Holders (Staked OGN)                                         │
│  (100K xOGN to propose, ~274M xOGN quorum)                               │
│         │                                                                │
│         ▼                                                                │
│  Origin DeFi Governance (0x1D3f...)                                      │
│  [PROPOSER + EXECUTOR + CANCELLER]                                       │
│  (7,200 blocks voting delay + 14,416 blocks voting period)               │
│         │                                                                │
│         ▼                                                                │
│  Timelock Controller (0x3591...)          GOV Multisig 5/8               │
│  [48h delay, self-administered]  ◄────── (0xbe2A...)                     │
│         │                                [CANCELLER only]                │
│         │ governor                                                       │
│         ├──────────────────────────────────────────────────────────┐     │
│         ▼                                                          ▼     │
│  OUSD Token (0x2A8e...)                                OUSD Vault (0xE75D│
│  [Rebasing ERC-20, proxy]                              [Proxy, impl: 0x82│
│  impl: 0xA7B7...                                                         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        OUSD VAULT (0xE75D...)                            │
│                                                                          │
│  Supported Asset: USDC only (0xA0b8...)    No oracle — 1:1 mint/redeem    │
│  (vault's price-provider slot is _deprecated_priceProvider)              │
│                                                                          │
│  Roles:                                                                  │
│  ├── governor:      Timelock (0x3591...) [~5d timelock]                  │
│  │   approveStrategy, addStrategyToMintWhitelist, setTrusteeFeeBps,      │
│  │   setAutoAllocateThreshold, setMaxSupplyDiff, setOperatorAddr,        │
│  │   setWithdrawalClaimDelay, setStrategistAddr, upgradeTo               │
│  ├── strategistAddr: 2-of-8 Safe (0x4FF1...) "Origin: Guardian" [none]   │
│  │   Vault: depositToStrategy, withdrawFromStrategy,                     │
│  │   withdrawAllFromStrategy(ies), setDefaultStrategy, setVaultBuffer,   │
│  │   setDripDuration, setRebaseRateMax,                                  │
│  │   pauseCapital/Rebase, unpauseCapital/Rebase, rebase.                 │
│  │   AMO: mintAndAddOTokens, removeAndBurnOTokens, harvest.              │
│  │   Remote strategies: deposit(All), withdraw(All).                     │
│  │   OUSD Token: delegateYield, undelegateYield (any account).           │
│  ├── operatorAddr:  EOA (0x7392...) [none] — rebase(), balance updates   │
│  ├── trusteeAddress: 1-of-3 Safe (0xBB07...) receives 20% fee            │
│  └── vaultBuffer:   0 (all funds deployed to strategies)                 │
│                                                                          │
│  Key Parameters:                                                         │
│  ├── autoAllocateThreshold: 25,000 USDC                                  │
│  ├── dripDuration:          604,800s (7d)                                │
│  ├── rebasePerSecondMax:    2,496,362,574 (~7.87% APR)                   │
│  ├── maxSupplyDiff:         5%                                           │
│  ├── withdrawalClaimDelay:  600s                                         │
│  └── trusteeFeeBps:         2,000 (20%)                                  │
│                                                                          │
│  Permissionless: mint, requestWithdrawal, claimWithdrawal(s),            │
│                  allocate, addWithdrawalQueueLiquidity                   │
│  Permissioned:   rebase (operator / strategist / governor)               │
│                                                                          │
└──────┬──────────────┬──────────────┬──────────────┬──────────────────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ Curve USDC   │ │ Morpho V2    │ │ Cross-Chain  │ │ Cross-Chain          │
│ AMO Strategy │ │ Strategy     │ │ Master (Base)│ │ Master (HyperEVM)    │
│ (0x26a0...)  │ │ (0x3643...)  │ │ (0xB1d6...)  │ │ (0xE022...)          │
│ $1.02M 16.3% │ │ $2.97M 47.6% │ │ $1.21M 19.4% │ │ $1.04M 16.7%         │
│              │ │              │ │  cached bal  │ │  cached bal          │
│ ┌──────────┐ │ │      ▼       │ │      │       │ │      │               │
│ │Curve Pool│ │ │  OUSD-V2     │ │  CCTP V2     │ │  CCTP V2             │
│ │OUSD/USDC │ │ │ (0xFB15...)  │ │      ▼       │ │      ▼               │
│ │(0x6d18..)│ │ │ Vault V2     │ │ Remote strat │ │ Remote strat         │
│ │~$1.10M   │ │ │ owner+curator│ │ (0xB1d6...)  │ │ (0xE022...)          │
│ │92.5% LP  │ │ │ = Yearn Sec  │ │      ▼       │ │      ▼               │
│ │ is AMO   │ │ │   (4-of-7)   │ │ OUSDb-V2 →   │ │ OUSDh-V2 →           │
│ └──────────┘ │ │      ▼       │ │ OUSDb-V1     │ │ OUSDh-V1             │
│       │      │ │  adapter →   │ │ owner 4-of-8 │ │ owner = curator      │
│   Gauge      │ │  OUSD-V1     │ │ curator 2/3  │ │ = ONE EOA            │
│  (0x1eF8..)  │ │ (0x5B8b...)  │ │ guardian set │ │ guardian: none       │
│   → CRV      │ │ MetaMorpho   │ │ timelock 3d  │ │ timelock: 0          │
│   rewards    │ │ 3d timelock  │ │      ▼       │ │      ▼               │
│       │      │ │      ▼       │ │ Morpho Blue  │ │ Morpho Blue          │
│       ▼      │ │ Morpho Blue  │ │ superOETHb   │ │ kHYPE 62.5% ~$957K   │
│  Strategist  │ │ OETH/USDC    │ │  77% ~$421K  │ │ WHYPE 62.5% ~$84K    │
│  harvests    │ │ 86% ~$2.97M  │ │ cbXRP 86%    │ │ (RedStone oracles)   │
│              │ │ 84.6% util   │ │ 62.5% ~$789K │ │                      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│              ORIGIN-COLLATERAL CONCENTRATION (~54% of TVL)               │
│                                                                          │
│  OETH/USDC market (Ethereum)      ~$2.97M   oracle: CL ETH/USD ÷ USDC/USD│
│  superOETHb/USDC market (Base)    ~$421K    oracle: CL ETH/USD ÷ USDC/USD│
│                                                                          │
│  Neither oracle reads an OETH/ETH or superOETHb/ETH price — a depeg of   │
│  Origin's own LST does not trigger liquidation, it creates bad debt in   │
│  the markets OUSD supplies.                                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    AMO MINTING FLOW                                      │
│                                                                          │
│  Curve AMO Strategy → mintForStrategy() → OUSD Token mints new OUSD      │
│  [Whitelisted by governor]   [No vault-level cap]   [99.8% solvency]     │
│                                                                          │
│  OUSD enters Curve pool → only obtainable by swapping USDC → backed      │
│                                                                          │
│  Constraints:                                                            │
│  ├── _solvencyAssert(): totalValue/totalSupply >= 99.8%                  │
│  ├── improvePoolBalance: must improve pool ratio                         │
│  ├── maxSlippage: 0.2%                                                   │
│  └── maxSupplyDiff: 5% (checked on requestWithdrawal)                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    SECONDARY LIQUIDITY                                   │
│                                                                          │
│  Curve Pool: OUSD/USDC (CurveStableSwapNG)                               │
│  (0x6d18...)  ~$1.10M TVL (592,983 OUSD + 504,559 USDC)                  │
│  AMO holds 1,012,809 / 1,094,475 LP = 92.5% — not third-party depth      │
│                                                                          │
│  Legacy: OUSD/3CRV Metapool (0x8765...)  ~$28K TVL [deprecated]          │
│                                                                          │
│  wOUSD (0xD2af...): ERC-4626 wrapper holding ~1.54M OUSD (~24.9%)        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Data flows:
  Mint:    User USDC → Vault → mint OUSD 1:1 → auto-allocate above 25K
  Redeem:  requestWithdrawal (burns OUSD, enqueues request) →
           wait >=600s AND queue liquidity advances →
           claimWithdrawal(s) pays USDC (no on-chain upper bound on wait)
  Rebase:  Operator/strategist/governor calls rebase() → yield dripped over
           7 days, capped at ~7.87% APR and 2% per rebase
  AMO:     Strategist → AMO Strategy → mintForStrategy → Curve pool
  Yield:   Morpho interest + CRV/MORPHO rewards → CoW Harvester → USDC → Vault
  Bridge:  Vault → Master strategy → CCTP → Remote strategy → Morpho V2 stack
  Report:  Remote strategy → CCTP message → master.remoteStrategyBalance
           (accepted up to 1 day old)
```
