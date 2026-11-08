# Protocol Risk Assessment: Origin OUSD

- **Assessment Date:** June 25, 2026 (Updated: November 8, 2026)
- **Token:** OUSD (Origin Dollar)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86)
- **Snapshot:** Ethereum block 26372721, Base block 54907103, HyperEVM block 50746871 (November 8, 2026)
- **Final Score: 2.12/5.0**

## Overview + Links

Origin Dollar (OUSD) is a rebasing stablecoin backed 100% by USDC. Holders' wallet balances automatically increase as yield accrues, without staking, locking, or manual compounding. Smart contracts must opt in to receive rebased yield; those that don't forfeit rewards to standard holders, amplifying returns for participants. An ERC-4626 wrapper (wOUSD) is available for DeFi composability, appreciating in value instead of rebasing.

OUSD generates yield through three strategies:
1. **Morpho Lending on Ethereum** (~$4.15M, ~65.9% of TVL): deposits USDC into a Morpho Vault V2 that routes into a MetaMorpho vault and on into Morpho Blue markets
2. **Curve AMO** (~$1.08M, ~17.1% of TVL): Algorithmic Market Operations providing liquidity in the Curve OUSD/USDC pool, earning trading fees and CRV incentives
3. **Cross-Chain Strategy, Base** (~$1.07M, ~17.0% of TVL): bridges USDC via Circle CCTP to Base, where the remote leg deposits into a local Morpho Vault V2 stack

A fourth strategy, the HyperEVM cross-chain leg, is still approved on the vault but holds only ~$28. Its funds were withdrawn between September 28 and October 1, 2026 (master-strategy `WithdrawRequested` transactions [`0x8aa9c4d3b5e9bb3bd96ad579fa4f19cec7e5d95802ea9cfc022b34e2c1ddc5a8`](https://etherscan.io/tx/0x8aa9c4d3b5e9bb3bd96ad579fa4f19cec7e5d95802ea9cfc022b34e2c1ddc5a8), [`0xcd3d995a1527ee0ff47e80cd222adef69c8247826864560a1269c643ca750806`](https://etherscan.io/tx/0xcd3d995a1527ee0ff47e80cd222adef69c8247826864560a1269c643ca750806), [`0x07551c923226fb1a1087a52daac9719f515038ac4ebd47424dce2452efa11a2d`](https://etherscan.io/tx/0x07551c923226fb1a1087a52daac9719f515038ac4ebd47424dce2452efa11a2d)).

Every strategy except the Curve AMO ends in Morpho lending markets, so **~82.9% of TVL is USDC supplied to Morpho Blue** on Ethereum and Base. **~74.6% of TVL is lent against Origin's own OETH and superOETHb.**

Collateral was simplified from multi-stablecoin (USDT, DAI, USDC) to **USDC-only** via governance proposal in November 2025.

- **Launch Date:** September 18, 2020 (relaunched January 5, 2021 after November 2020 hack)
- **Performance Fee:** 20% (2,000 bps), minted to the `trusteeAddress`, now the FeeSplitter contract [`0xbbE561181D831e2a0fAd54C2c27F159a20B60464`](https://etherscan.io/address/0xbbE561181D831e2a0fAd54C2c27F159a20B60464)
- **Total Value:** ~$6.30M (vault `totalValue()` = 6,298,052.94 at block 26372721)
- **OUSD Supply:** ~6,289,354 OUSD, so the backing ratio `totalValue() / totalSupply()` is 100.14%

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
| wOUSD (ERC-4626) | [`0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62`](https://etherscan.io/address/0xD2af830E8CBdFed6CC11Bab697bB25496ed6FA62) | Non-rebasing wrapper; holds ~1.81M OUSD (~28.8% of supply) |
| OUSD Vault (Proxy) | [`0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70`](https://etherscan.io/address/0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70) | Collateral vault; `governor()` = Timelock |
| OUSD Vault Implementation | [`0x82948060c4b72684bededec342350ab344975145`](https://etherscan.io/address/0x82948060c4b72684bededec342350ab344975145) | `OUSDVault`; EIP-1967 admin slot is zero (Governable pattern) |
| Curve USDC AMO Strategy | [`0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11`](https://etherscan.io/address/0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11) | Only mint-whitelisted strategy; `SOLVENCY_THRESHOLD` = 99.8%, `maxSlippage` = 0.2% (governor-only setter) |
| Morpho V2 Strategy | [`0x3643cafA6eF3dd7Fcc2ADaD1cabf708075AFFf6e`](https://etherscan.io/address/0x3643cafA6eF3dd7Fcc2ADaD1cabf708075AFFf6e) | `defaultStrategy`; receives auto-allocated deposits |
| Cross-Chain Master Strategy (Base) | [`0xB1d624fc40824683e2bFBEfd19eB208DbBE00866`](https://etherscan.io/address/0xB1d624fc40824683e2bFBEfd19eB208DbBE00866) | `CrossChainMasterStrategy`; reports a cached `remoteStrategyBalance` |
| Cross-Chain Master Strategy (HyperEVM) | [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://etherscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) | Still approved on the vault; balance ~$28 after the September 28 to October 1, 2026 withdrawals |
| OUSD Vault V2 (Morpho Vault V2) | [`0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960`](https://etherscan.io/address/0xFB154c729A16802c4ad1E8f7FF539a8b9f49c960) | `OUSD-V2`; owner and curator are Yearn Security (4/7); 0% fees; Origin Strategist Safe is a sentinel; `addAdapter` / cap increases on a 3-day timelock; fee setters untimelocked; `setAdapterRegistry` abdicated; receive-shares gate [`0x6704aB7aF6787930c60DFa422104E899E823e657`](https://etherscan.io/address/0x6704aB7aF6787930c60DFa422104E899E823e657) owned by the mainnet Timelock |
| Morpho Vault V1 Adapter | [`0xD8F093dCE8504F10Ac798A978eF9E0C230B2f5fF`](https://etherscan.io/address/0xD8F093dCE8504F10Ac798A978eF9E0C230B2f5fF) | Sole adapter of `OUSD-V2`; forwards 100% into `OUSD-V1` |
| OUSD Vault V1 (MetaMorpho) | [`0x5B8b9FA8e4145eE06025F642cAdB1B47e5F39F04`](https://etherscan.io/address/0x5B8b9FA8e4145eE06025F642cAdB1B47e5F39F04) | `OUSD-V1`; owner Yearn Security (4/7), curator [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3), guardian = Origin Strategist Safe (2/8) since October 7, 2026, 3-day timelock, 5% fee |
| Morpho Blue | [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | Immutable lending primitive underneath both vault layers |
| Curve OUSD/USDC Pool | [`0x6d18E1a7faeB1F0467A77C0d293872ab685426dc`](https://etherscan.io/address/0x6d18E1a7faeB1F0467A77C0d293872ab685426dc) | StableSwapNG; ~$1.08M TVL; 99.9% of its LP is the AMO (staked in the gauge) |
| Curve Gauge | [`0x1eF8B6Ea6434e722C916314caF8Bf16C81cAF2f9`](https://etherscan.io/address/0x1eF8B6Ea6434e722C916314caF8Bf16C81cAF2f9) | AMO stakes LP here for CRV |
| CoW Harvester | [`0xD400341aEfED0BC75176714cFdE82e8BDAA2D3b8`](https://etherscan.io/address/0xD400341aEfED0BC75176714cFdE82e8BDAA2D3b8) | Sells CRV / MORPHO into USDC |
| Timelock Controller | [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F) | `getMinDelay()` = 172,800s (48h); self-administered |
| Origin DeFi Governance | [`0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC`](https://etherscan.io/address/0x1D3fBD4d129Ddd2372EA85c5Fa00b2682081c9EC) | PROPOSER + EXECUTOR + CANCELLER on the Timelock |
| GOV Multisig (5/8, cancel-only) | [`0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899`](https://etherscan.io/address/0xbe2AB3d3d8F6a32b96414ebbd865dBD276d3d899) | CANCELLER on the Timelock; `governor()` of the FeeSplitter |
| Strategist / Guardian (2/8) | [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://etherscan.io/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) | `strategistAddr()` on the vault and both remote strategies; guardian / sentinel on all six OUSD Morpho vaults |
| FeeSplitter (trustee) | [`0xbbE561181D831e2a0fAd54C2c27F159a20B60464`](https://etherscan.io/address/0xbbE561181D831e2a0fAd54C2c27F159a20B60464) | Non-upgradeable `FeeSplitter`; became `trusteeAddress` in Timelock tx [`0x715cec2789d71459af239f6d2f242836e46fdaf4c468bb89b319bf635c395120`](https://etherscan.io/tx/0x715cec2789d71459af239f6d2f242836e46fdaf4c468bb89b319bf635c395120); `operationsBps` = 0, so 100% of fees go to the harvester [`0x637C509383Ec7Da55C19a3Dbf3227C1Bb8A89151`](https://etherscan.io/address/0x637C509383Ec7Da55C19a3Dbf3227C1Bb8A89151) (`HarvestingEIP1271`) to buy OGN |
| Operator (EOA) | [`0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b`](https://etherscan.io/address/0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b) | `operatorAddr()` on the vault and `operator()` on both cross-chain strategy pairs; can call `rebase()`, relay CCTP messages, and push cross-chain balance updates |
| xOGN Governance Token | [`0x63898b3b6Ef3d39332082178656E9862bee45C57`](https://etherscan.io/address/0x63898b3b6Ef3d39332082178656E9862bee45C57) | Staked OGN voting power |
| USDC (Collateral) | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | Sole vault asset (`getAllAssets()`) |
| OETH/USDC Market Oracle | [`0xE8aDfF9117151fb5ad7313873780b87cC56EEDB0`](https://etherscan.io/address/0xE8aDfF9117151fb5ad7313873780b87cC56EEDB0) | `BASE_FEED_1` = Chainlink ETH/USD, `QUOTE_FEED_1` = Chainlink USDC/USD, no vault or second feed |
| Chainlink ETH/USD | [`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) | Base feed of the OETH/USDC Morpho market oracle |
| Chainlink USDC/USD | [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) | Quote feed of the same market oracle |
| Legacy Oracle Router | [`0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c`](https://etherscan.io/address/0x36CFB852d3b84afB3909BCf4ea0dbe8C82eE1C3c) | No longer wired in; the vault's price provider slot is `_deprecated_priceProvider` |

### Base

| Contract | Address | Role / Key facts |
|----------|---------|------------------|
| Cross-Chain Remote Strategy | [`0xB1d624fc40824683e2bFBEfd19eB208DbBE00866`](https://basescan.org/address/0xB1d624fc40824683e2bFBEfd19eB208DbBE00866) | Same address as the mainnet master; implementation [`0xaa8af8db4b6a827b51786334d26349eb03569731`](https://basescan.org/address/0xaa8af8db4b6a827b51786334d26349eb03569731) (`CrossChainRemoteStrategy`); `governor()` = Base Timelock |
| Base Timelock | [`0xf817cb3092179083c48c014688D98B72fB61464f`](https://basescan.org/address/0xf817cb3092179083c48c014688D98B72fB61464f) | `getMinDelay()` = 172,800s (48h); PROPOSER + EXECUTOR + CANCELLER = Origin Base Safe; EXECUTOR also held by the Strategist Safe; TIMELOCK_ADMIN_ROLE held only by itself (the deployer's admin role was renounced at block 19592753). Full role history checked: an earlier executor Safe [`0x28bce2eE5775B652D92bB7c2891A89F036619703`](https://basescan.org/address/0x28bce2eE5775B652D92bB7c2891A89F036619703) was replaced by the Strategist Safe at block 24827166 |
| Origin Base / HyperEVM Safe (5/8) | [`0x92A19381444A001d62cE67BaFF066fA1111d7202`](https://basescan.org/address/0x92A19381444A001d62cE67BaFF066fA1111d7202) | Same eight signers as the mainnet GOV multisig; proposer on both remote-chain Timelocks |
| OUSD Vault V2 (Morpho Vault V2) | [`0x2Ba14b2e1E7D2189D3550b708DFCA01f899f33c1`](https://basescan.org/address/0x2Ba14b2e1E7D2189D3550b708DFCA01f899f33c1) | `OUSDb-V2`; owner [`0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F`](https://basescan.org/address/0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F) (4/7, six of seven signers shared with Yearn Security), curator [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://basescan.org/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3); Origin Strategist Safe is a sentinel; `addAdapter` / cap increases on a ~3-day timelock; management / performance fee setters **untimelocked** (fee shares limited to the gate whitelist) |
| Morpho Vault V1 Adapter | [`0xFE4ccb1f0d9634F3191cA45B7f3413c4ca85086E`](https://basescan.org/address/0xFE4ccb1f0d9634F3191cA45B7f3413c4ca85086E) | Sole adapter; forwards 100% into `OUSDb-V1` |
| OUSD Vault V1 (MetaMorpho) | [`0x581Cc9a73Ec7431723A4a80699B8f801205841F1`](https://basescan.org/address/0x581Cc9a73Ec7431723A4a80699B8f801205841F1) | `OUSDb-V1`; owner and curator as above, guardian = Origin Strategist Safe [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://basescan.org/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) (2/8), 3-day timelock, 5% fee |
| USDC (Base) | [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) | CCTP destination asset |

### HyperEVM

| Contract | Address | Role / Key facts |
|----------|---------|------------------|
| Cross-Chain Remote Strategy | [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://hyperevmscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) | Same address as the mainnet master; `checkBalance()` ≈ 28 USDC; `governor()` = HyperEVM Timelock |
| HyperEVM Timelock | [`0x77121911A387c9e4Eae46345E0f831A6da8a1364`](https://hyperevmscan.io/address/0x77121911A387c9e4Eae46345E0f831A6da8a1364) | `getMinDelay()` = **60s**; PROPOSER + EXECUTOR + CANCELLER = Origin 5/8 Safe [`0x92A19381444A001d62cE67BaFF066fA1111d7202`](https://hyperevmscan.io/address/0x92A19381444A001d62cE67BaFF066fA1111d7202); EXECUTOR also held by the Strategist Safe; CANCELLER also held by deployer EOA [`0x58890A9cB27586E83Cb51d2d26bbE18a1a647245`](https://hyperevmscan.io/address/0x58890A9cB27586E83Cb51d2d26bbE18a1a647245) |
| OUSD Vault V2 (Morpho Vault V2) | [`0xE90959cbE7E56b5eBFF9AD12de611A4976F2d2B1`](https://hyperevmscan.io/address/0xE90959cbE7E56b5eBFF9AD12de611A4976F2d2B1) | `OUSDh-V2`; owner [`0x518C21DC88D9780c0A1Be566433c571461A70149`](https://hyperevmscan.io/address/0x518C21DC88D9780c0A1Be566433c571461A70149) (4/7, same signer set as Yearn Security), curator [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://hyperevmscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3); Origin Strategist Safe is a sentinel; `setReceiveAssetsGate` and `setAdapterRegistry` abdicated |
| Morpho Vault V1 Adapter | [`0xF912d9489DEc1593D888eb680a4074f84c44413c`](https://hyperevmscan.io/address/0xF912d9489DEc1593D888eb680a4074f84c44413c) | Sole adapter; forwards 100% into `OUSDh-V1` |
| OUSD Vault V1 (MetaMorpho v1.1) | [`0x0fb7e41A0A85Eb0BcA55172b73942cc6685e2B2E`](https://hyperevmscan.io/address/0x0fb7e41A0A85Eb0BcA55172b73942cc6685e2B2E) | `OUSDh-V1`; owner as above, curator 2/3, guardian = Origin Strategist Safe, `timelock()` = 3 days; ~28 USDC of assets |
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

The February 2026 Sigma Prime review is the one that matters for the current architecture. It covered both the vault upgrade (rebase mechanism, strategy management, yield distribution) and the cross-chain CCTP strategies. Its findings dealt with CCTP fee handling, remote-balance timestamp tracking, and finality-threshold validation. The newest audit in the [security repository](https://github.com/OriginProtocol/security) (yAudit, September 2026) covers the Origin WETH ARM, not OUSD.

Origin Protocol maintains 30+ audit reports across all products in their [security repository](https://github.com/OriginProtocol/security). They have a continuous auditing agreement with OpenZeppelin to review 100% of smart contract changes.

The non-upgradeable `FeeSplitter` that became the trustee in October 2026 only routes performance fees and never holds user deposits. It has no external audit in the security repository. It shipped through [origin-dollar PR #2988](https://github.com/OriginProtocol/origin-dollar/pull/2988) with internal Origin review and unit and fuzz tests, and was deployed in [PR #3008](https://github.com/OriginProtocol/origin-dollar/pull/3008).

**Smart Contract Complexity:** High. The system uses an upgradeable proxy pattern (EIP-1967), a rebasing token with non-standard ERC-20 behavior, AMO minting, and four approved strategies, including two cross-chain legs driven by CCTP messaging. Each Morpho leg nests three vault layers deep (strategy → Morpho Vault V2 → adapter → MetaMorpho → Morpho Blue markets).

### Bug Bounty

- **Platform:** Immunefi, live since November 22, 2021; program last updated September 7, 2026
- **Maximum Payout:** $1,000,000 for a critical smart-contract report, capped at 10% of directly affected funds. Payouts are made directly by Origin.
- **Scope:** OUSD Token and OUSD Vault explicitly in scope (64 assets in scope)
- **Track record:** 40 paid reports totalling $139.2K
- **Safe Harbor:** Offered through Immunefi's [Safe Harbor page](https://immunefi.com/bug-bounty/originprotocol/safe-harbor/) under the Security Alliance (SEAL) Safe Harbor Agreement. Recovered funds go to the program vault [`0x82e0cE4255597cbA08273E0305de40C318F5117E`](https://etherscan.io/address/0x82e0cE4255597cbA08273E0305de40C318F5117E) (a 1/1 Safe) within six hours. The Safe Harbor reward is still listed as "TBD". KYC not required for bug-bounty payouts.
- **Link:** https://immunefi.com/bug-bounty/originprotocol/information/

## Historical Track Record

- **Launched:** September 18, 2020 (~6.1 years in production)
- **Relaunched:** January 5, 2021 (after November 2020 hack, with fresh audits)
- **November 17, 2020: OUSD Flash Loan Reentrancy Attack ($7.7M loss):**
  - **Attack:** Exploited missing input validation in `mintMultiple()` and lack of reentrancy protection. Attacker used a malicious ERC-20 contract to re-enter the mint function, inflating OUSD supply without depositing backing collateral.
  - **Impact:** 11,809 ETH + 2,249,821 DAI stolen (~$7.7M), including $1M+ from Origin founders/employees.
  - **Resolution:** Deposits immediately disabled. $1M bounty offered for fund recovery. All existing OUSD balances reset to zero upon relaunch.
  - **Compensation:** Users <=1,000 OUSD received 100% in newly minted OUSD. Users >1,000 OUSD received 25% OUSD + 75% in OGN tokens (1-year lock, 25% interest). Founders received no compensation.
  - **Source:** [PeckShield Root Cause Analysis](https://peckshield.medium.com/origin-dollar-incident-root-cause-analysis-f27e11988c90), [rekt.news](https://rekt.news/origin-rekt/)
- **Post-relaunch incidents:** None in ~5.8 years since relaunch
- **TVL history:** Peak $298.2M (January 1, 2022), all-time low $4.90M (November 12, 2024). Current TVL is ~$6.30M onchain and $5.70M as tracked by [DeFiLlama](https://defillama.com/protocol/origin-dollar). Over the last 90 days DeFiLlama TVL ranged from $5.47M (October 4, 2026) to $6.33M (October 22, 2026), with no single-day cliff. It is roughly flat against the $5.71M of August 31, 2026.
- **Price stability:** Post-relaunch peg maintained within a few basis points of $1.00. Minor deviation to $0.9671 in March 2022. The Curve pool's EMA oracle (`price_oracle(0)` = 1.000154 OUSD per USDC) marks OUSD at ~$0.9998, consistent with the pool's OUSD-heavy 56/44 balance.
- **Team:** Origin Protocol since 2017. Founded by Josh Fraser & Matthew Liu. CEO: Rafael Ugolini. Backed by Pantera Capital, Founders Fund.

## Funds Management

**Strategy Allocation** (vault `totalValue()` = 6,298,052.94 USDC at block 26372721):

| Strategy | Balance (USDC) | % of TVL | Description |
|----------|---------------|----------|-------------|
| Morpho V2 (Ethereum) | 4,149,617 | 65.89% | Morpho Vault V2 → MetaMorpho → Morpho Blue (OETH/USDC, cbBTC/USDC) |
| Curve USDC AMO | 1,078,045 | 17.12% | Curve OUSD/USDC pool + gauge staking |
| Cross-Chain (Base) | 1,070,363 | 17.00% | CCTP to Base → Morpho Vault V2 stack |
| Cross-Chain (HyperEVM) | 28 | 0.00% | Wound down September 28 to October 1, 2026; still an approved strategy |
| Vault (idle, net of queue) | 0 | 0.00% | Raw vault USDC 14, fully reserved by the withdrawal queue's `queued − claimed` of 14; `vaultBuffer` = 0 |

Reward tokens (CRV, MORPHO) are sold via CoW Protocol into USDC and returned to the vault, where they are distributed to holders via rebase.

### Where the Morpho Legs Actually Sit

Each Morpho leg is three contracts deep. The strategy holds shares of a **Morpho Vault V2**, which holds a single `MorphoVaultV1Adapter`. The adapter holds shares of a **MetaMorpho (Vault V1)**, which supplies **Morpho Blue** markets. Only the outermost layer is named after OUSD; the risk lives in the innermost markets. Positions are computed as `supplyShares × totalSupplyAssets / totalSupplyShares` from Morpho Blue `position()` / `market()`.

| Chain | Morpho Blue market | LLTV | OUSD exposure | OUSD share of market | Market utilization | Oracle |
|-------|--------------------|------|---------------|----------------------|--------------------|--------|
| Ethereum | OETH / USDC ([`0xb8fef900b383db2dbbf4458c7f46acf5b140f26d603a6d1829963f241b82510e`](https://app.morpho.org/ethereum/market/0xb8fef900b383db2dbbf4458c7f46acf5b140f26d603a6d1829963f241b82510e/)) | 86% | ~$3,946,500 (~95.1% of the leg) | 39.1% of $10.09M supplied | 87.9% ($8.87M borrowed, ~$1.22M free) | Chainlink ETH/USD ÷ USDC/USD |
| Ethereum | cbBTC / USDC ([`0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64`](https://app.morpho.org/ethereum/market/0x64d65c9a2d91c36d56fbc42d69e979335320169b3df63bf92789e2c8883fcc64/)) | 86% | ~$204,200 (~4.9% of the leg) | 0.06% of $339.0M supplied | 89.8% (~$34.7M free) | Chainlink BTC/USD |
| Base | superOETHb / USDC ([`0x67a66cbacb2fe48ec4326932d4528215ad11656a86135f2795f5b90e501eb538`](https://app.morpho.org/base/market/0x67a66cbacb2fe48ec4326932d4528215ad11656a86135f2795f5b90e501eb538/)) | 77% | ~$753,200 (~70.3% of the leg) | 95.2% of $791K supplied | 90.3% (~$77K free) | Chainlink ETH/USD ÷ USDC/USD |
| Base | cbXRP / USDC ([`0xd4a903dc6d949519060c7707f9604fdc9772c046e05c2e3a8fce0bd7196e4109`](https://app.morpho.org/base/market/0xd4a903dc6d949519060c7707f9604fdc9772c046e05c2e3a8fce0bd7196e4109/)) | 62.5% | ~$317,500 (~29.7% of the leg) | 0.5% of $66.3M supplied | 88.0% (~$7.99M free) | Chainlink XRP/USD |
| Base | cbBTC, WETH, wstETH, cbETH markets | 77–86% | None | 0% | 89–90% | Chainlink |
| HyperEVM | WHYPE / kHYPE markets | 62.5% | ~$28 | dust | n/a | RedStone |

Three consequences follow directly from this table.

**Origin's own LSTs back ~75% of OUSD.** ~$3.95M is lent against OETH on Ethereum and ~$753K against superOETHb on Base, together **~74.6% of OUSD's TVL**. Both markets price collateral as Chainlink ETH/USD ÷ USDC/USD, with no OETH/ETH or superOETHb/ETH feed: the Ethereum oracle [`0xE8aDfF9117151fb5ad7313873780b87cC56EEDB0`](https://etherscan.io/address/0xE8aDfF9117151fb5ad7313873780b87cC56EEDB0) reads `BASE_FEED_1` = ETH/USD and `QUOTE_FEED_1` = USDC/USD, and the Base oracle [`0xFEa2D58cEfCb9fcb597723c6bAE66fFE4193aFE4`](https://basescan.org/address/0xFEa2D58cEfCb9fcb597723c6bAE66fFE4193aFE4) is the same design. They hard-assume a 1:1 peg to ETH. An OETH depeg would not trigger liquidations; it would silently convert those positions into bad debt carried by OUSD.

**The Ethereum OETH market's borrowing is concentrated in one account.** EOA [`0xa122687285dc5012141055a801045f069112e7c6`](https://etherscan.io/address/0xa122687285dc5012141055a801045f069112e7c6) owes ~$6.43M, **72.5% of the market's $8.87M debt**, against 4,960.6 OETH (~$11.03M at the oracle's $2,224/ETH). That is 58.3% LTV, a health factor of ~1.48, and liquidation at an oracle ETH price near $1,508. The next borrower, [`0x86d888c3fa8a7f67452ef2eccc1c5ee9751ec8d6`](https://etherscan.io/address/0x86d888c3fa8a7f67452ef2eccc1c5ee9751ec8d6), owes ~$1.41M at 24.1% LTV. Eleven distinct accounts made 33 `Borrow` calls in this market over the last 275K blocks. OUSD is the market's largest supplier (39%). A liquidation of the top position would need ~4,960 OETH to clear through secondary liquidity.

**Origin's own AMO is the Curve pool.** The AMO holds 1,074,872 of the pool's 1,075,763 LP tokens (staked in the gauge), **99.9%** of the OUSD/USDC pool. The "secondary DEX liquidity" that backstops OUSD's peg is OUSD's own capital.

### Accessibility

- **Minting:** Permissionless. Anyone can call `mint()` by depositing USDC; the vault mints equivalent OUSD 1:1. Requires `safeTransferFrom` of USDC, so OUSD cannot be minted without depositing collateral.
- **AMO Minting:** The Curve AMO strategy can call `mintForStrategy()` to mint OUSD without direct user-deposited backing (see [AMO Minting Analysis](#amo-minting-analysis) below). Only governor-whitelisted strategies can use this function.
- **Redemption:** Async withdrawal queue, a two-step process:
  1. `requestWithdrawal(amount)` burns OUSD immediately and enqueues a withdrawal (NFT-like request ID).
  2. `claimWithdrawal(id)` / `claimWithdrawals(ids[])` pays out USDC after `withdrawalClaimDelay` (600s = **10 minutes minimum**, verified onchain) AND when the queue's claimable liquidity has caught up to the request.
  There is no onchain upper bound on claim time. If the queue is ahead of deposits and strategy withdrawals, a claim can wait indefinitely. The strategist, or anyone permissionlessly via `allocate()` / `addWithdrawalQueueLiquidity()`, must supply USDC to advance the queue.
- **Queue state:** `withdrawalQueueMetadata()` reports lifetime cumulative counters: `queued` = 4,173,105, `claimable` = 4,173,105, and `claimed` = 4,173,091 USDC across 216 requests since launch. The outstanding balance is `queued − claimed` = **14 USDC**, all of it claimable and matched by the vault's 14 USDC idle. Any larger request depends on someone pulling funds from strategies.
- **DEX Swaps:** Instant exits via Curve OUSD/USDC pool (~$1.08M TVL, ~$479K USDC side).
- **Fees:** 20% performance fee (2,000 bps), no deposit/withdrawal fees.

### AMO Minting Analysis

**Can OUSD be minted without backing?** Yes, through the AMO mechanism, but with constraints:

1. **`mintForStrategy()`** allows whitelisted strategies to mint OUSD without depositing collateral. Currently only the Curve USDC AMO strategy ([`0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11`](https://etherscan.io/address/0x26a02ec47ACC2A3442b757F45E0A82B8e993Ce11)) is whitelisted; `isMintWhitelistedStrategy` is false for the other three strategies.
2. **Adding strategies to the mint whitelist requires governance** (xOGN vote + 48h timelock).
3. **Solvency check:** After every AMO operation (`mintAndAddOTokens`, `removeAndBurnOTokens`, `removeOnlyAssets`), `_solvencyAssert()` verifies that `totalVaultValue / totalOUSDSupply >= 99.8%` (`SOLVENCY_THRESHOLD`). This is a state check, not a per-call allowance, so it caps cumulative AMO-driven value loss at the gap between current backing (100.14%) and 99.8%, about 0.34% of supply (~$21K).
4. **Pool balance check:** The `improvePoolBalance` modifier ensures one-sided operations (mint-and-add or remove-and-burn) must improve the Curve pool's balance. Sequential operations in the same direction are prevented.
5. **`maxSupplyDiff`:** Set to 5% (checked during redemptions); if supply exceeds backing by >5%, redemptions revert.
6. **Historical minting cap (`netOusdMintForStrategyThreshold`) has been deprecated.** There is no vault-level per-strategy cap. Protection relies on the strategy-level solvency check.

**Risk assessment:** AMO-minted OUSD enters the Curve pool (not free circulation). It can only be obtained by someone swapping USDC for it, at which point it becomes backed. The strategist (2-of-8 multisig) can trigger AMO operations without governance vote. The 99.8% solvency threshold bounds the cumulative loss. `maxSlippage` (0.2%) can only be changed by the governor.

### Collateralization

- The vault's only asset is USDC (`getAllAssets()` returns a single entry), and OUSD is minted 1:1 against it. Backing ratio `totalValue() / totalSupply()` = 100.14%.
- What backs OUSD in practice is not idle USDC but **lending claims**: ~82.9% of TVL is USDC supplied to Morpho Blue markets on Ethereum and Base, and ~17.1% is an AMO LP position in the Curve OUSD/USDC pool. `vaultBuffer` = 0, and raw idle USDC (14) only covers the 14 USDC queue reserve.
- Collateral behind those lending claims is Origin's own OETH and superOETHb (~74.6% of TVL), cbXRP (~5.0%), and cbBTC (~3.2%). Every market is over-collateralized at the LLTVs above, but the OETH and superOETHb markets rely on oracles that assume a hard 1:1 peg to ETH. A single EOA's position accounts for 72.5% of the Ethereum OETH market's debt.
- No debt, leverage, or liquidation mechanics exist in the OUSD vault itself; the leverage sits with the third-party borrowers on the other side of the Morpho markets.
- The Base cross-chain strategy holds ~17.0% of TVL; these funds require a CCTP round trip before they can settle an Ethereum redemption.

### Provability

- `vault.totalValue()` returns the sum of strategy balances plus vault USDC, **minus the withdrawal-queue reserve** (`queued − claimed`). The same is true of `vault.checkBalance(asset)`. Raw vault USDC and the queue reserve must be inspected separately to reconstruct each component.
- `ousd.totalSupply()` lives on the OUSD token, not on the vault. The vault parameter `maxSupplyDiff` (5%) and the AMO `SOLVENCY_THRESHOLD` (99.8%) compare these two sources at redemption / AMO time.
- Rebase calculated programmatically: `rebasingCreditsPerToken` determines each holder's share of rebased yield.
- The vault holds no oracle. The current implementation's price-provider slot is `_deprecated_priceProvider`, and neither `VaultCore` nor `VaultAdmin` reads a price anywhere; with a single 1:1 asset there is nothing to price. Chainlink still matters, but one layer down, inside the Morpho market oracles.
- **Cross-chain balances are cached, not live.** `CrossChainMasterStrategy.checkBalance()` returns `local USDC + pendingAmount + remoteStrategyBalance`. `remoteStrategyBalance` is a value pushed from the remote chain over CCTP messaging. `MAX_BALANCE_CHECK_AGE` (1 day) only makes the master ignore an ordinary balance message that is already older than a day when it arrives. Transfer confirmations skip that check, and the stored value never expires: `checkBalance()` keeps returning the last accepted balance however old it is, and no last-update timestamp is stored onchain. The last accepted updates before the snapshot were at blocks 26366640 (Base) and 26366609 (HyperEVM), both about 20 hours earlier. The value is also uncapped: whatever balance an authenticated message from the peer strategy reports is written straight into `remoteStrategyBalance` (see [Critical Permission Paths](#critical-permission-paths-and-weakest-link)). At the snapshot the Base cache read 1,070,362.53 against a live remote `checkBalance()` of 1,070,504.38 (Δ ~$142, 0.013%), and `pendingAmount` was zero on both masters. About 17.0% of reported TVL is a message, not a read.
- Full verification requires walking two chains and four contract layers per leg. Everything is onchain and permissionlessly readable; nothing is attested offchain.

## Liquidity Risk

- **Primary exit:** Async withdrawal queue via `requestWithdrawal()` → `claimWithdrawal()`. OUSD is burned at request time. USDC is paid only after (a) `withdrawalClaimDelay` of 10 minutes AND (b) queue claimable liquidity has advanced past the request. There is no onchain upper bound on wait time; the effective wait depends on how quickly strategies return USDC.
- **Queue backlog:** 14 USDC outstanding (`queued − claimed`), all of it claimable, across 216 lifetime requests. `queued` and `claimable` are running lifetime totals, not a live backlog.
- **Instant on-Ethereum liquidity is the binding constraint.** The Ethereum Morpho position is $4.15M, but ~$3.95M of it sits in the OETH/USDC market, which is 87.9% utilized and has only ~$1.22M of free liquidity, all of which OUSD would have to share with the market's other suppliers. The ~$204K cbBTC position is fully withdrawable. Adding the Curve pool's USDC side (~$479K), with vault idle fully reserved for the queue, roughly **$1.90M (~30.2% of TVL) is reachable without waiting on borrowers or a bridge**.
- **DEX liquidity:** Curve OUSD/USDC pool ([`0x6d18E1a7faeB1F0467A77C0d293872ab685426dc`](https://etherscan.io/address/0x6d18E1a7faeB1F0467A77C0d293872ab685426dc)) holds 600,382 OUSD + 478,562 USDC (~$1.08M, 56/44 OUSD-heavy). `get_dy(0,1, 100k OUSD)` = 99,959 USDC (−0.04%), `get_dy(0,1, 300k)` = 299,680 (−0.11%), `get_dy(0,1, 500k)` = 474,770 (−5.05%, the USDC side is nearly exhausted). 99.9% of the pool's LP is Origin's own AMO, so this depth is not independent third-party liquidity.
- **Vault buffer:** `vaultBuffer` = 0 and raw idle USDC is 14. Queue advancement depends on the strategist pulling from strategies (`withdrawFromStrategy` / `withdrawAllFromStrategies`), on the permissionless `addWithdrawalQueueLiquidity()`, or on new deposits auto-allocating.
- **Cross-chain assets:** ~$1.07M (~17.0% of TVL) on Base. The cbXRP portion (~$318K) is liquid at the remote end. The superOETHb portion (~$753K) is not: OUSD supplies 95% of that market, which is 90.3% utilized with only ~$77K free. Everything returning to Ethereum needs a CCTP round trip (minutes to hours) on top.
- **No priority mechanism:** first-come-first-served queue ordering.
- **Same-value assets** (USD stablecoins) mitigate price impact risk during any waiting period.
- **Legacy OUSD/3CRV pool:** ~13,428 OUSD + ~14,505 3CRV (~$28K), effectively deprecated.

## Centralization & Control Risks

### Governance

**Governance Structure:** Identical to Origin ARM, with the same xOGN governance, Timelock, and multisig. See [Appendix: Contract Architecture](#appendix-contract-architecture) for full diagram.

**Timelock Roles (verified via `hasRole()` at the snapshot block):**

| Role | Origin DeFi Governance | GOV Multisig (5/8) |
|------|:---:|:---:|
| PROPOSER | ✓ | ✗ |
| EXECUTOR | ✓ | ✗ |
| CANCELLER | ✓ | ✓ |

- Timelock is self-administered (TIMELOCK_ADMIN_ROLE held by itself)
- Total time from proposal to execution: ~5 days minimum (24h voting delay + 48h voting + 48h timelock)
- No backdoor: only Origin DeFi Governance can propose/execute on mainnet
- Between August 31 and November 8, 2026 the Timelock executed 9 calls and scheduled none that remain pending. The two OUSD-relevant calls are both in tx [`0x715cec2789d71459af239f6d2f242836e46fdaf4c468bb89b319bf635c395120`](https://etherscan.io/tx/0x715cec2789d71459af239f6d2f242836e46fdaf4c468bb89b319bf635c395120), which pointed `setTrusteeAddress` on the OUSD and OETH vaults to the FeeSplitter. The other calls target other Origin products. There were no upgrades of the OUSD token, vault, or strategy proxies.

**Multisig thresholds (`getThreshold()` / `getOwners()`):** GOV Multisig 5-of-8; Strategist / Guardian 2-of-8 (same eight signers on Ethereum, Base, and HyperEVM); Origin remote-chain Safe 5-of-8 (same eight signers as the GOV Multisig).

**Privileged Roles:**

| Role | Who | Timelock? | Powers |
|------|-----|-----------|--------|
| Governor (owner) | Timelock → xOGN governance | ~5 days | Upgrade proxy, approve/remove strategies, add/remove from mint whitelist, `setAutoAllocateThreshold`, `setMaxSupplyDiff`, `setWithdrawalClaimDelay`, `setTrusteeFeeBps` (≤50%), `setTrusteeAddress`, `setStrategistAddr`, `setOperatorAddr`, `governanceRebaseOptIn`; AMO `setMaxSlippage` (≤5%); master-strategy `setFeePremiumBps` (≤30%), `setMinFinalityThreshold`, `setOperator` |
| Remote-strategy governor | Base Timelock (48h) / HyperEVM Timelock (60s), both driven by the Origin 5/8 Safe | 48h / 60s | Upgrade the remote strategy proxies; `setFeePremiumBps`, `setMinFinalityThreshold`, `setOperator`, `transferToken` (unsupported assets only) on the remote side |
| Strategist | 2-of-8 Safe [`0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971`](https://etherscan.io/address/0x4FF1b9D9ba8558F5EAfCec096318eA0d8b541971) | None | Vault (all `onlyGovernorOrStrategist`): `depositToStrategy` / `withdrawFromStrategy` / `withdrawAllFromStrategy` / `withdrawAllFromStrategies` (approved strategies only), `setVaultBuffer`, `setDefaultStrategy` (approved strategies only), `setRebaseRateMax`, `setDripDuration`, `pauseCapital` / `pauseRebase`, `unpauseCapital` / `unpauseRebase`, `rebase`. Curve AMO: `mintAndAddOTokens` / `removeAndBurnOTokens` / `removeOnlyAssets`. Both remote cross-chain strategies: `deposit` / `depositAll` / `withdraw` / `withdrawAll` (recipient forced to the strategy itself). OUSD Token: `delegateYield(from, to)`, `undelegateYield(from)`, which can redirect rebase yield of **any account** to any other account without that account's consent. Guardian / sentinel on all six OUSD Morpho vaults (can revoke pending curator actions). |
| Operator | EOA [`0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b`](https://etherscan.io/address/0x739212d5bAfE6AAC8Be49a60B7d003bD41DBf38b) | None | `rebase()` on the vault; `relay()` and `sendBalanceUpdate()` on the cross-chain strategies; FeeSplitter `distribute()`. Bounded: `_rebase()` only ratchets supply upward, never above `totalValue()`, and is capped by `rebasePerSecondMax` and a 2% per-rebase ceiling. `relay()` only forwards Circle-attested messages from the peer strategy address. |
| Trustee | FeeSplitter [`0xbbE561181D831e2a0fAd54C2c27F159a20B60464`](https://etherscan.io/address/0xbbE561181D831e2a0fAd54C2c27F159a20B60464) (governor = GOV Multisig 5/8) | None | Receives the 20% performance fee; split between operations wallet and OGN buyback is governor-only, capped at 50% operations, currently 0% |

**Key Risks:**

1. **AMO minting without timelock:** The Strategist can trigger AMO mint/burn operations, constrained by the strategy-level 99.8% solvency check. The vault-level AMO minting cap (`netOusdMintForStrategyThreshold`) is deprecated (function reverts onchain).
2. **Yield delegation without timelock:** `delegateYield` / `undelegateYield` on the OUSD token are `onlyGovernorOrStrategist`. The strategist can redirect the rebase yield of any account (including smart contracts holding OUSD) to an arbitrary recipient. This affects yield, not principal balances. Seven `YieldUndelegated` events and no `YieldDelegated` events were emitted between August 31 and November 8, 2026.
3. **Strategy reallocation without timelock:** The strategist can move all vault funds to/from any approved strategy (`withdrawAllFromStrategies`, `setDefaultStrategy`, `depositToStrategy`). This is bounded by the governor-approved strategy list, but that list still includes the HyperEVM leg, whose remote governor has only a 60-second timelock.
4. **Rebase rate cap without timelock:** `setRebaseRateMax` lets the strategist cap the rebase APR, and a misconfiguration could strand yield. `rebasePerSecondMax` is currently 2,496,362,574 (≈7.87% APR).

### Critical Permission Paths and Weakest Link

A material loss here means loss of the USDC backing OUSD. The inventory covers the OUSD token, vault, all four strategies (mainnet and remote sides), the six Morpho vaults, and the timelocks and Safes above them.

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|-----------------------|-------------------------------|------------|----------------|
| `upgradeTo` on OUSD token, vault, and the four mainnet strategy proxies; `approveStrategy`, `addStrategyToMintWhitelist`, `setStrategistAddr` | Timelock [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F) ← Origin DeFi Governance (xOGN) | 24h voting delay + 48h vote + 48h Timelock (5 days); GOV Multisig 5/8 can cancel | All ~$6.30M |
| `upgradeTo` on the Base remote strategy proxy [`0xB1d624fc40824683e2bFBEfd19eB208DbBE00866`](https://basescan.org/address/0xB1d624fc40824683e2bFBEfd19eB208DbBE00866) | Base Timelock [`0xf817cb3092179083c48c014688D98B72fB61464f`](https://basescan.org/address/0xf817cb3092179083c48c014688D98B72fB61464f) ← Origin 5/8 Safe [`0x92A19381444A001d62cE67BaFF066fA1111d7202`](https://basescan.org/address/0x92A19381444A001d62cE67BaFF066fA1111d7202) (proposer, executor, sole canceller) | 5-of-8 + 48h; no independent canceller, and no xOGN vote | ~$1.07M (17.0%) |
| `upgradeTo` on the HyperEVM remote strategy proxy [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://hyperevmscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) | HyperEVM Timelock [`0x77121911A387c9e4Eae46345E0f831A6da8a1364`](https://hyperevmscan.io/address/0x77121911A387c9e4Eae46345E0f831A6da8a1364) ← same Origin 5/8 Safe | 5-of-8 + **60s** | Funds: ~$28 now (up to `MAX_TRANSFER_AMOUNT` = 10M USDC per CCTP transfer if re-funded). **Accounting: all of OUSD.** An upgraded remote can send a balance report for any amount; the mainnet master authenticates only the source domain and sender and writes the value into `remoteStrategyBalance` uncapped. On a mainnet fork at Ethereum block 26322936, a forged $100M report was accepted and lifted vault `totalValue()` from $6.45M to $106.4M |
| Enable a new market on `OUSD-V1` (`submitCap` → `acceptCap`), then `reallocate` into it | Curator [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2/3; owner Yearn Security 4/7 also holds curator powers); allocators EOA [`0x50B75d586929Ab2F75dC15f07E1B921b7C4Ba8fA`](https://etherscan.io/address/0x50B75d586929Ab2F75dC15f07E1B921b7C4Ba8fA), EIP-7702 account [`0x75a1253432356f90611546a487b5350cef08780d`](https://etherscan.io/address/0x75a1253432356f90611546a487b5350cef08780d), [PublicAllocator](https://etherscan.io/address/0xfd32fa2ca22c76dd6e550706ad913fc6ce91c75d), [EmergencyAllocator](https://etherscan.io/address/0xffb824d00fd6f9513259fc6e79674a0065570862) | 3-day `timelock()` on cap increases; guardian (Origin Strategist Safe) and owner can revoke; allocators can only move funds between markets that already have caps | ~$4.15M (65.9%) |
| `addAdapter` / cap increases on `OUSD-V2` | Curator Yearn Security [`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0) (4/7) | 3-day timelock; sentinel (Origin Strategist Safe) can revoke; `setAdapterRegistry` abdicated | ~$4.15M |
| Same curator paths on `OUSDb-V1` / `OUSDb-V2` (new markets / adapters) | Curator 2/3 Safe, owner [`0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F`](https://basescan.org/address/0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F) (4/7) | 3-day timelocks; Origin Strategist Safe is guardian / sentinel | ~$1.07M |
| `setManagementFeeRecipient` + `setManagementFee` on `OUSDb-V2` [`0x2Ba14b2e1E7D2189D3550b708DFCA01f899f33c1`](https://basescan.org/address/0x2Ba14b2e1E7D2189D3550b708DFCA01f899f33c1) (management fee accrues on assets, not on interest) | Curator 2/3 Safe [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://basescan.org/address/0x90D0f26025571295D18a6c041E47450B81886B51) | **No timelock** on either selector (neither is abdicated), so the sentinel cannot revoke. The fee is capped at 5%/yr (`MAX_MANAGEMENT_FEE`). Fee shares mint only to addresses the abdicated `receiveSharesGate` [`0xB6AEa13581E8dF678a461884CE71584B4e827cfb`](https://basescan.org/address/0xB6AEa13581E8dF678a461884CE71584B4e827cfb) whitelists; its owner is the Base Timelock. The whitelist (every `setIsWhitelisted` call traced) holds the OUSD remote strategy, the OGN token contract [`0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7`](https://basescan.org/address/0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7), and a legacy Origin strategy proxy [`0x1743658b284a843b47f555343dBB628d46D0C254`](https://basescan.org/address/0x1743658b284a843b47f555343dBB628d46D0C254) governed by EIP-7702 account [`0xDba474FeF81bc7475f70e28DFC12410f032A83Db`](https://basescan.org/address/0xDba474FeF81bc7475f70e28DFC12410f032A83Db). The curator cannot pay itself. | Rate-capped: on a fork at Ethereum block 26322936, a 5% fee to the OGN contract cost the OUSD position $146.51/day (≈$53K/yr, ~0.8% of OUSD TVL per year), while a fee to the curator Safe cost nothing |
| Same fee selectors on `OUSD-V2` (Ethereum) and `OUSDh-V2` (HyperEVM) | Yearn Security 4/7 (Ethereum); curator 2/3 Safe (HyperEVM) | No timelock; 5%/yr cap; receive-shares gates owned by the mainnet Timelock and the HyperEVM Timelock whitelist the OUSD strategy and `0x…dEaD` | Ethereum: rate-capped, held by a 4/7 Safe. HyperEVM: dust |
| Reallocate between approved strategies; AMO mint/burn; remote `deposit` / `withdraw` | Strategist 2/8 Safe | No timelock. Funds can only move between governor-approved strategies and back to the vault or the remote strategy itself. AMO cumulative loss is bounded by the `_solvencyAssert()` state check (≈0.35% of supply at current backing). Cannot cause a material loss alone, but can route funds into the HyperEVM leg | Not material alone |
| `delegateYield` / `undelegateYield` on OUSD | Strategist 2/8 Safe | None | Yield only, not principal |
| `pauseCapital` / `pauseRebase` | Strategist 2/8 Safe | None | Liquidity only (blocks exits) |
| `rebase`, `relay`, `sendBalanceUpdate` | Operator EOA | `rebase` capped at ≈7.87% APR / 2% per call, never above `totalValue()`; `relay` requires a Circle attestation and the peer strategy as sender; balance updates are computed onchain on the remote side | Not material |
| Performance-fee routing (FeeSplitter split, recipients); `setPerformanceFee` / `setPerformanceFeeRecipient` on the three Vault V2s (no timelock) | GOV Multisig 5/8; V2 curators | Fee-only; Morpho caps the V2 performance fee at 50% of interest; recipients limited by the same share gates | Yield only |

**Weakest credible path to material loss:** the **HyperEVM remote-strategy upgrade**. The Origin 5-of-8 Safe proposes `upgradeTo` on the HyperEVM remote strategy and executes it 60 seconds later. The upgraded contract then sends the mainnet master a balance report for any amount. `CrossChainMasterStrategy._processBalanceCheckMessage` checks only the nonce and message age, and `_handleReceivedMessage` checks only the source domain and peer address, so the forged value becomes part of vault `totalValue()` (fork-confirmed with a $100M report). The leg's $28 balance does not limit this. Effects:

- **Unbacked supply:** `rebase()` mints the phantom surplus as OUSD at up to `rebasePerSecondMax` (≈7.87% APR on rebasing supply, smoothed over the 7-day drip), and 20% of it goes to the FeeSplitter as fees. Unbacked OUSD then redeems against real USDC.
- **Blinded safety checks:** the AMO's 99.8% `_solvencyAssert()` and the vault's 5% `maxSupplyDiff` both read the inflated `totalValue()`, so neither would stop losses while the forged balance stands.
- **Masked losses:** real losses elsewhere, such as Morpho bad debt, would not show in `totalValue()`.

The path needs five of eight Origin GOV signers and no xOGN vote; the 60-second delay leaves no time to react. The same path exists on Base behind the 48h Timelock. Because the holder is a 5-of-8 Safe, the critical gate does not apply.

Comparably weak paths for direct fund loss:

1. **Base remote-strategy upgrade:** the Origin 5-of-8 Safe proposes `upgradeTo` on the Base remote strategy through the Base Timelock and executes it 48 hours later, putting ~$1.07M (17.0% of TVL) at risk. This bypasses the xOGN vote that guards everything on mainnet. The same Safe is the only canceller, so the 48 hours are a detection window rather than a veto. Exiting within the window is partial: the cbXRP portion can be pulled back over CCTP, but only ~$77K of the ~$753K superOETHb portion is withdrawable.
2. **Morpho curation on Ethereum:** the 2-of-3 curator Safe submits a cap for a malicious market, and after 3 days an allocator (one is an EOA) reallocates up to ~$4.15M (66% of TVL) into it. This path has the lowest signer threshold and the largest exposure, but it also has the most checks: a code-enforced 72-hour timelock that both the Origin Strategist Safe (guardian) and Yearn Security (owner) can revoke. The same structure applies on Base.

The lowest-threshold untimelocked path is the Base curator's management fee: a 2-of-3 Safe can set a 5%/yr fee with no delay, but only toward gate-whitelisted addresses it does not control. The loss rate is capped by code at ≈$146/day on the Base leg, which is the kind of rate limit the framework treats as bounding cumulative loss. It is listed and monitored but does not trigger the fewer-than-three-signers gate. The Ethereum fee setters are held by Yearn Security (4/7).

Both remote Timelocks were enumerated from deployment to the snapshot. For the Base Timelock that covers every `RoleGranted` / `RoleRevoked` event since deployment tx [`0x2e2cbd5f5527b64e5bf33794ef09a908acfa75dceaed5bba811f7ecd22888a4e`](https://basescan.org/tx/0x2e2cbd5f5527b64e5bf33794ef09a908acfa75dceaed5bba811f7ecd22888a4e); for HyperEVM it was read via Etherscan V2. The Base Timelock has scheduled 91 calls and executed 88, with none cancelled. The three ready-but-unexecuted operations target other Origin Base contracts ([`0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93`](https://basescan.org/address/0x98a0CbeF61bD2D21435f433bE4CD42B56B38CC93) `removeStrategy`, [`0xF611cC500eEE7E4e4763A05FE623E2363c86d2Af`](https://basescan.org/address/0xF611cC500eEE7E4e4763A05FE623E2363c86d2Af) `setAllowedPoolWethShareInterval`, [`0x9cfcAF81600155e01c63e4D2993A8A81A8205829`](https://basescan.org/address/0x9cfcAF81600155e01c63e4D2993A8A81A8205829) `setHarvesterAddress`), not the OUSD remote strategy. The HyperEVM Timelock has executed all 7 of its scheduled calls.

### Programmability

- Standard minting and `requestWithdrawal` / `claimWithdrawal` are fully programmatic and permissionless. `allocate()` and `addWithdrawalQueueLiquidity()` are permissionless too.
- Rebase is **not** automatic on user operations. `rebase()` is restricted to the operator EOA, the strategist, or the governor. Yield is dripped rather than paid in full: `_nextYield()` smooths the surplus over `dripDuration` (604,800s = 7 days), caps it at `rebasePerSecondMax` (≈7.87% APR), and hard-caps any single rebase at 2% of rebasing supply. Supply only ever ratchets up and never above `totalValue()`.
- Auto-allocation is triggered inside `mint()` when a deposit exceeds `autoAllocateThreshold` (25,000 USDC) and routes to `defaultStrategy` (currently the Morpho V2 strategy).
- AMO operations and inter-strategy rebalancing require strategist intervention.
- Cross-chain strategy management relies on manual bridging decisions plus operator-relayed CCTP messages; the mainnet accounting for the Base leg is a cached value refreshed by those messages.
- Reward harvesting: the CoW Harvester sells CRV/MORPHO → USDC via CoW Protocol (semi-automated, bot-triggered).

### External Dependencies

1. **USDC / Circle (Critical):** Sole collateral asset on every chain. Circle can freeze/blacklist addresses holding USDC, which would impact the vault, the strategies, or the remote legs.
2. **Morpho (Critical):** ~82.9% of TVL ultimately sits in Morpho Blue markets, reached through four active intermediating vault contracts on two chains. Morpho Blue itself is immutable; the risk is concentrated in the curation layer above it and in the markets chosen.
3. **Morpho curation: Yearn (not an external counterparty).** Every OUSD Morpho vault on all three chains is curated by Yearn:
   - **Ethereum:** `OUSD-V2` and `OUSD-V1` are owned by the **Yearn Security multisig** ([`0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0`](https://etherscan.io/address/0xe5e2Baf96198c56380dDD5E992D7d1ADa0e989c0), 4-of-7). `OUSD-V1` is curated by [`0x90D0f26025571295D18a6c041E47450B81886B51`](https://etherscan.io/address/0x90D0f26025571295D18a6c041E47450B81886B51) (2-of-3) with a 3-day timelock.
   - **Base:** `OUSDb-V2` / `OUSDb-V1` are owned by [`0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F`](https://basescan.org/address/0xFEaE2F855250c36A77b8C68dB07C4dD9711fE36F) (4-of-7, six signers shared with Yearn Security), with the same curator Safe and a 3-day timelock.
   - **HyperEVM:** `OUSDh-V2` / `OUSDh-V1` are now owned by [`0x518C21DC88D9780c0A1Be566433c571461A70149`](https://hyperevmscan.io/address/0x518C21DC88D9780c0A1Be566433c571461A70149) (4-of-7, the Yearn Security signer set), curated by the same 2-of-3 Safe, with a 3-day `timelock()`. The EOA owner, zero timelock, and missing guardian recorded in August 2026 are no longer in place. `setReceiveAssetsGate` and `setAdapterRegistry` remain abdicated on `OUSDh-V2`.
   - **Origin veto on every vault:** the Origin Strategist Safe is guardian on all three MetaMorpho vaults (Ethereum since October 7, 2026) and sentinel on all three Vault V2s (Ethereum since September 14, 2026), so Origin can revoke any pending Yearn curator action.

   For a Yearn allocation decision this is an internal counterparty rather than a third-party trust assumption. It is recorded because it is a real concentration: Yearn curation sits under ~82.9% of OUSD's TVL.
4. **Origin OETH / superOETHb (Critical):** ~74.6% of TVL is lent against Origin's own LSTs, priced by oracles that assume a fixed 1:1 ETH peg. A sustained OETH depeg produces bad debt in the markets OUSD supplies without triggering liquidations first. One EOA borrower accounts for 72.5% of the Ethereum OETH market's debt.
5. **Curve (High):** AMO yield generation (~17.1% of TVL) and the primary on-Ethereum DEX exit (~$1.08M pool TVL, ~$479K USDC side). 99.9% of that pool's LP is the AMO itself.
6. **Circle CCTP (High):** The Base cross-chain strategy uses Circle CCTP V2 to bridge USDC and to carry the balance and withdrawal messages the mainnet accounting depends on. ~17.0% of TVL is held on Base.
7. **Chainlink (High):** No longer read by the OUSD vault, but the ETH/USD and USDC/USD feeds price the OETH and superOETHb Morpho markets that hold ~74.6% of TVL.
8. **CoW Protocol (Low):** Used for reward token swaps (CRV, MORPHO → USDC). Not critical for core functionality.

No single dependency failure stops the protocol. The surface is still wider and deeper than the vault's "100% USDC-backed" description suggests. A Circle freeze, a Morpho curation failure, or an OETH depeg would each reach a large fraction of backing, and an OETH depeg now reaches about three-quarters of it.

## Operational Risk

- **Team:** Origin Protocol since 2017, public team, known leadership (Josh Fraser, Matthew Liu, Rafael Ugolini), VC-backed (Pantera, Founders Fund)
- **Documentation:** Comprehensive. Public GitHub with active development, dedicated security repo with 30+ audits
- **Legal:** Established company (Origin Protocol)
- **Incident Response:** Learned from 2020 hack. $1M bug bounty on Immunefi with SEAL Safe Harbor offered. Full relaunch with multiple audits after the incident.

## Monitoring

- **Morpho curation (all three chains):** Track owner, curator, guardian, timelock, sentinel, allocator, cap submissions, and supply-queue changes on `OUSD-V2` / `OUSD-V1` (Ethereum), `OUSDb-V2` / `OUSDb-V1` (Base), and `OUSDh-V2` / `OUSDh-V1` (HyperEVM). Alert on any `submitCap` for a new market and on any change of `owner()`, `curator()`, `guardian()`, or `timelock()`. These are the 72-hour windows in which the Origin guardian can veto.
- **Governance:** Monitor Timelock events (`CallScheduled`, `CallExecuted`, `Cancelled`) on [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F). Monitor EIP-1967 implementation slot changes on Vault and OUSD Token proxies. Monitor Origin DeFi Governance proposals.
- **Remote-chain timelocks:** Monitor `CallScheduled` on the Base Timelock [`0xf817cb3092179083c48c014688D98B72fB61464f`](https://basescan.org/address/0xf817cb3092179083c48c014688D98B72fB61464f) (48h) and the HyperEVM Timelock [`0x77121911A387c9e4Eae46345E0f831A6da8a1364`](https://hyperevmscan.io/address/0x77121911A387c9e4Eae46345E0f831A6da8a1364) (60s), and implementation-slot changes on both remote strategy proxies. Keep these alerts active even while the HyperEVM leg holds dust: an upgraded remote can inflate mainnet accounting without holding any funds. A 60-second delay leaves effectively no reaction time, so pair the upgrade alert with a check of the next `RemoteStrategyBalanceUpdated` value.
- **Morpho Vault V2 fees:** Alert on `SetManagementFee`, `SetManagementFeeRecipient`, `SetPerformanceFee`, and `SetPerformanceFeeRecipient` on all three OUSD Vault V2s. These selectors have no timelock, so detection is the only control.
- **Vault Parameters:** Track `totalValue()` on the vault ([`0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70`](https://etherscan.io/address/0xE75D77B1865Ae93c7eaa3040B038D7aA7BC02F70)) and `totalSupply()` on the OUSD token ([`0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86`](https://etherscan.io/address/0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86)). Alert on >1% divergence. **Note:** `totalValue()` and `checkBalance(asset)` already subtract the withdrawal-queue reserve (`queued − claimed`); reconstruct components from the per-strategy `checkBalance()` calls, the vault's raw USDC balance, and `withdrawalQueueMetadata()` separately. Monitor `rebasePaused()` / `capitalPaused()`. Track `maxSupplyDiff`, `vaultBuffer`, `defaultStrategy`, `dripDuration`, `rebasePerSecondMax`, `trusteeAddress`, and `operatorAddr` changes.
- **AMO:** Monitor `mintForStrategy()` calls and the OUSD supply vs vault value ratio. Alert if solvency drops below 99.5%. Track `isMintWhitelistedStrategy` changes (requires governance).
- **Strategy Allocation:** Monitor strategy balances via `checkBalance()` on each strategy. Alert on >20% TVL change in 24h, and on any deposit into the HyperEVM master strategy [`0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e`](https://etherscan.io/address/0xE0228DB13F8C4Eb00fD1e08e076b09eF5cD0EA1e) while its remote governor's delay remains 60s. Track CCTP bridge transactions on both cross-chain legs.
- **Cross-chain balance freshness and size:** The mainnet `checkBalance()` for each remote leg returns the last accepted `remoteStrategyBalance` indefinitely; `MAX_BALANCE_CHECK_AGE` only filters stale incoming messages and does not expire the stored value. Track the block time of the last `RemoteStrategyBalanceUpdated` event on each master and alert when it is more than 24h old. Compare the stored value against the live remote-side `checkBalance()` and alert on divergence >1%. Alert on any update that moves a master's balance by more than the CCTP transfers in flight, since the master accepts reported balances without a cap.
- **Morpho market oracles and borrowers:** The OETH/USDC (Ethereum) and superOETHb/USDC (Base) markets price collateral as Chainlink ETH/USD ÷ USDC/USD with no LST-specific feed. Monitor OETH and superOETHb secondary-market prices against ETH directly, because those markets cannot see a depeg. Monitor Chainlink ETH/USD ([`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)) and USDC/USD ([`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6)) for staleness. Track the health factor of the dominant OETH-market borrower [`0xa122687285dc5012141055a801045f069112e7c6`](https://etherscan.io/address/0xa122687285dc5012141055a801045f069112e7c6) (~1.48 at snapshot).
- **Morpho market liquidity:** Track `totalSupplyAssets − totalBorrowAssets` for the OETH/USDC and superOETHb/USDC markets, and OUSD's share of each market's supply. Alert when free liquidity in the Ethereum OETH market falls below the vault's likely redemption need, or when the Base superOETHb market's free liquidity stays near zero.
- **Liquidity:** Monitor the Curve OUSD/USDC pool balance ratio; alert on imbalance beyond 60/40 (currently 56/44). Track the AMO's share of the pool's LP supply.
- **Strategist:** Monitor role changes on vault `strategistAddr()`. Track AMO operation frequency and size. Monitor `YieldDelegated` / `YieldUndelegated` events on the OUSD token. Monitor `withdrawAllFromStrategies`, `setVaultBuffer`, `setDefaultStrategy`, `setDripDuration`, `setRebaseRateMax` calls.
- **Withdrawal Queue:** Track `withdrawalQueueMetadata()` and compute the live backlog as `queued − claimed`. `queued` and `claimable` on their own are lifetime cumulative totals and will look alarming if read as a depth. Alert when the backlog exceeds vault idle plus free Ethereum Morpho liquidity, or when `queued − claimable` stays non-zero for more than a day.

## Risk Summary

### Key Strengths

1. Onchain xOGN governance with a ~5-day total cycle, a self-administered 48h Timelock, a cancel-only GOV multisig, and no admin backdoor on mainnet; this is the same governance as the audited Origin ARM
2. 9 OUSD-specific audits by top firms (OpenZeppelin, Trail of Bits, Sigma Prime, Solidified, Certora formal verification) + $1M Immunefi bounty; the February 2026 Sigma Prime review covered both the current vault implementation and the cross-chain CCTP design
3. ~5.8 years clean track record since the January 2021 relaunch, with lessons learned from the 2020 hack
4. Standard minting always requires a USDC collateral deposit, so it is permissionless and fully backed; backing ratio is 100.14%
5. AMO minting constrained by the 99.8% solvency state check, the pool-balance-improvement modifier, and a governance-controlled whitelist that still contains only the Curve AMO
6. Rebase is rate-limited by construction: supply only ratchets up, never above `totalValue()`, capped at ≈7.87% APR and 2% per rebase
7. All six Morpho vaults are now held by Yearn multisigs with 3-day timelocks on market and adapter changes (the V2 fee setters remain untimelocked but rate-capped and gate-restricted), and Origin's Strategist Safe can veto pending curator actions on each of them as guardian or sentinel; the HyperEVM EOA configuration flagged in August 2026 is gone
8. The HyperEVM leg and its RedStone-priced markets were wound down, leaving only two chains in the dependency set

### Key Risks

1. **~75% of TVL is credit exposure to Origin's own LSTs.** USDC is lent against OETH (Ethereum, ~63% of TVL) and superOETHb (Base, ~12%) in Morpho markets whose oracles hard-assume a 1:1 ETH peg. A depeg produces bad debt without first producing liquidations, and one EOA borrower holds 72.5% of the Ethereum market's debt at a ~1.48 health factor.
2. **Morpho concentration and depth.** ~82.9% of TVL routes through Morpho Blue. The Ethereum OETH market alone holds ~63% of TVL at 87.9% utilization, where OUSD is 39% of supply and only ~$1.22M is withdrawable on demand.
3. **Remote-leg governance bypasses the DAO.** An Origin 5-of-8 Safe can upgrade the HyperEVM remote strategy after only 60 seconds. The upgraded contract could feed an uncapped forged balance into mainnet vault accounting, inflating `totalValue()`, enabling rate-capped unbacked rebases, and blinding the AMO solvency check, even though the leg holds dust. The Base remote strategy (~$1.07M) has the same exposure behind a 48h Timelock with no independent canceller. Separately, the Base 2-of-3 Morpho curator can set a 5%/yr management fee with no delay, capped at ≈$146/day and payable only to gate-whitelisted addresses.
4. AMO `mintForStrategy()` can mint OUSD without direct backing, bounded by the strategy-level solvency check; the historical vault-level cap is deprecated
5. Strategist (2-of-8 multisig) has broad untimelocked operational power: AMO operations, strategy allocation, vault parameters, pause controls, remote-strategy deposits/withdrawals, **and yield delegation** (`delegateYield` / `undelegateYield` can redirect any account's rebase yield)
6. Single collateral dependency on USDC (Circle), a centralized stablecoin with freeze capability
7. Thin and non-independent exit depth: the Curve pool holds ~$479K of USDC and is 99.9% AMO-owned; vault idle only covers the queue reserve; only ~$1.90M (~30% of TVL) is reachable without waiting on borrowers or a bridge; redemptions flow through an async queue with no onchain upper bound on claim time
8. TVL ~$6.30M, ~98% below the $298M peak, which is small enough that a single large redeemer dominates the exit path

### Critical Risks

- **None identified. All critical gates pass.** OUSD is governed by an onchain DAO plus a 48h timelock, its contracts are source-verified, and reserves are fully readable onchain. No EOA or fewer-than-three-signer Safe holds an uncapped path to material loss. The one untimelocked path held by fewer than three signers, the Base curator's management fee, is rate-capped at 5%/yr and payable only to whitelisted addresses.
- Historical $7.7M hack (November 2020) was on a different codebase; the protocol was completely relaunched with audited contracts.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **Unverified contract source** → **PASS** (vault, token, strategies, remote strategies, and every Morpho vault in the chain are source-verified)
- [ ] **No audit** → **PASS** (9 OUSD-specific audits including Trail of Bits, OpenZeppelin, Sigma Prime, Certora)
- [ ] **Unverifiable reserves** → **PASS** (fully onchain via `totalValue()` and per-strategy `checkBalance()`, though the Base leg reads a CCTP-pushed cache)
- [ ] **Total centralization** → **PASS** (xOGN governance + 48h Timelock on mainnet; the weakest material path is a 5-of-8 Safe behind a 60-second Timelock (HyperEVM remote upgrade → forged accounting); the only sub-3-signer untimelocked path is the rate-capped Base management fee; no EOA holds a material path)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%): **1.5**

**Subcategory A: Audits & Security Reviews: 1.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | 9 OUSD-specific audits by 5 top firms (OpenZeppelin, Trail of Bits, Sigma Prime, Solidified, Certora) |
| Current architecture | The Feb 2026 Sigma Prime review scoped both the deployed vault implementation and the cross-chain CCTP strategies |
| Bug Bounty | $1M on Immunefi, OUSD token and vault explicitly in scope, SEAL Safe Harbor offered |
| Formal Verification | Certora formal verification (December 2024) |
| Continuous Review | OpenZeppelin reviews 100% of contract changes |

**Subcategory B: Historical Track Record: 2.0**

| Aspect | Assessment |
|--------|-----------|
| Time in Production | ~6.1 years total, ~5.8 years since the secure relaunch |
| Past Incidents | $7.7M flash-loan reentrancy hack (Nov 2020) on pre-relaunch code; users fully compensated; different code since relaunch |
| TVL | ~$6.30M onchain, roughly flat over the last two months and ~98% below the $298M peak (Jan 2022) |
| Price Stability | Peg maintained within basis points of $1.00 since relaunch; Curve EMA marks OUSD at ~$0.9998 |
| Redemption pressure | 14 USDC outstanding in the queue across 216 lifetime requests |

**Score: (1.0 + 2.0) / 2 = 1.5**

#### Category 2: Centralization & Control Risks (Weight: 30%): **2.17**

**Subcategory A: Governance: 1.0**
- **Mainnet upgrades are DAO-gated end to end.** `upgradeTo` / `upgradeToAndCall` are `onlyGovernor` on the token and vault proxies, and `governor()` on the OUSD token, the vault, and all four mainnet strategies is the Timelock [`0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F`](https://etherscan.io/address/0x35918cDE7233F2dD33fA41ae3Cb6aE0e42E0e69F). PROPOSER and EXECUTOR are held solely by Origin DeFi Governance; `getMinDelay()` = 48h, `votingDelay` 7,200 blocks + `votingPeriod` 14,416 blocks give **5.00 days** from proposal to execution.
- **The weakest material path sits outside the DAO.** An Origin 5-of-8 Safe can upgrade the HyperEVM remote strategy after a 60-second delay and use it to report an uncapped forged balance into mainnet accounting, whatever the leg holds. The Base remote strategy has the same exposure behind a 48h Timelock. The Morpho curation path over ~70% of TVL is held back by a vetoable 72-hour timelock. The Base curator's untimelocked management fee is rate-capped at 5%/yr and gate-restricted.
- No EOA or sub-3-signer holder has an uncapped path to material loss, so the critical gate does not apply. Governance is held at **1.0** by reviewer decision. On the rubric's timelock column alone, the HyperEVM path (5-of-8 Safe, 60 seconds) would sit in the <12h row. Its damage is bounded by `rebasePerSecondMax` for supply inflation, but it also disables the AMO and `maxSupplyDiff` checks while the forged balance stands.

**Subcategory B: Programmability: 2.5**
- Minting, `requestWithdrawal`, `claimWithdrawal`, `allocate`, and `addWithdrawalQueueLiquidity` are permissionless; rebase is algorithmic, rate-capped, and can only ratchet supply upward within `totalValue()`
- **Broad untimelocked strategist surface** (2-of-8 multisig, `onlyGovernorOrStrategist`): AMO mint/burn, strategy allocation (`depositToStrategy`, `withdrawFromStrategy`, `withdrawAllFromStrategies`, `setDefaultStrategy`), vault parameters (`setVaultBuffer`, `setDripDuration`, `setRebaseRateMax`), pause controls, remote-strategy deposits and withdrawals, and OUSD token `delegateYield` / `undelegateYield`, which can redirect any account's rebase yield without consent. Cumulative principal loss from these calls is bounded by code (approved-strategy list, forced recipients, AMO solvency state check).
- An operator EOA calls `rebase()` and relays cross-chain balance updates. Its power is bounded, but live accounting for the Base leg depends on an offchain keeper doing its job.
- Cross-chain strategy management and AMO rebalancing require manual intervention; reward harvesting is semi-automated via CoW Protocol

**Subcategory C: External Dependencies: 3.0**
- Critical: USDC/Circle (sole asset); Morpho Blue (~82.9% of TVL); Origin's own OETH/superOETHb as the collateral behind ~74.6% of TVL
- The Morpho curation layer on all three chains is Yearn's own, so it is not scored as an external trust assumption
- High: Curve (AMO yield plus the only meaningful on-Ethereum DEX exit, 99.9% AMO-owned), Circle CCTP (asset transport *and* the accounting message bus for the Base leg), Chainlink (prices the OETH/superOETHb markets). Low: CoW Protocol (reward swaps)
- Winding down the HyperEVM leg removed RedStone and a third chain, but concentration in Origin-issued collateral rose from ~54% to ~75% of TVL, so the score stays at 3.0

**Score: (1.0 + 2.5 + 3.0) / 3 = 2.17**

#### Category 3: Funds Management (Weight: 30%): **2.25**

**Subcategory A: Collateralization: 2.5**
- 100% onchain backing, ratio 100.14%, single high-quality asset (USDC)
- But the backing is deployed as lending claims rather than held: ~82.9% of TVL is USDC supplied to Morpho Blue and ~17.1% is an AMO LP position. The collateral behind those claims is concentrated in a single issuer: Origin's own OETH/superOETHb back ~74.6% of TVL at an assumed 1:1 ETH peg, and the remainder is mostly cbXRP (~5.0%) and cbBTC (~3.2%)
- Borrower concentration: one EOA holds 72.5% of the Ethereum OETH market's debt (health factor ~1.48); OUSD supplies 39% of that market and 95% of the Base superOETHb market
- AMO can create unbacked OUSD only up to the 99.8% solvency floor
- `vaultBuffer` = 0; raw idle USDC only covers the queue reserve
- Every loan is over-collateralized by LSTs or blue-chip assets, which sits in the rubric's score-2 collateral-quality row. Single-issuer concentration (~75% of TVL, against ~54% at the August assessment, after the HyperEVM funds moved into the Ethereum OETH market) and the hard-peg oracles keep the score at 2.5

**Subcategory B: Provability: 2.0**
- Everything is onchain and permissionlessly readable, with no offchain attestation anywhere
- Reconstruction is involved: `totalValue()` nets out the queue reserve, and the cross-chain leg requires walking a master strategy, a remote strategy, two Morpho vault layers, and the underlying markets on Base
- ~17.0% of reported TVL is a **cached** `remoteStrategyBalance` refreshed by CCTP messages. The stored value does not expire and is not capped; it was ~20 hours old and tracked the remote side to within ~$142 at the snapshot

**Score: (2.5 + 2.0) / 2 = 2.25**

#### Category 4: Liquidity Risk (Weight: 15%): **3.0**

- Async withdrawal queue: 10-minute minimum delay (`withdrawalClaimDelay` = 600s) plus queue liquidity catch-up; no onchain upper bound
- Instantly reachable on Ethereum: ~$1.22M of free OETH-market liquidity (shared with other suppliers) + ~$204K cbBTC position + ~$479K Curve USDC side ≈ **$1.90M, ~30% of TVL**, against ~34% at the August assessment. The ~63%-of-TVL OETH position sits in an 87.9%-utilized market
- Curve OUSD/USDC pool ~$1.08M, 56/44 OUSD-heavy: −0.04% at 100K OUSD, −0.11% at 300K, −5.05% at 500K as the USDC side runs out; 99.9% of LP is Origin's own AMO
- Base leg (~$1.07M) needs a CCTP round trip, and ~$676K of its superOETHb position cannot be withdrawn until borrowers repay
- Same-value assets (USD stablecoins) mitigate waiting risk; no priority mechanism, first-come-first-served
- Scored 3.0 (2.5 at the August assessment): ~70% of TVL still depends on Morpho borrowers repaying or a bridge round trip, which matches the rubric's "3-7 days for full exit" row, and exits above the ~$479K Curve USDC side take more than 3% slippage

#### Category 5: Operational Risk (Weight: 5%): **1.0**

- Established team (2017), public, VC-backed (Pantera, Founders Fund)
- Comprehensive security repo with 30+ audit reports
- $1M bug bounty, SEAL Safe Harbor offered
- Demonstrated incident response capability (2020 hack recovery and user compensation)

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.5 × 0.20) + (2.17 × 0.30) + (2.25 × 0.30) + (3.0 × 0.15) + (1.0 × 0.05)
            = 0.300 + 0.650 + 0.675 + 0.450 + 0.050
            = 2.125
            → 2.12 (two decimals, rounded down)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.300 |
| Centralization & Control | 2.17 | 30% | 0.650 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 3.0 | 15% | 0.450 |
| Operational Risk | 1.0 | 5% | 0.050 |
| **Final Score** | | | **2.12 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

---

## Reassessment Triggers

- **Time-based:** Quarterly (next: February 2027)
- **Incident-based:** Any security incident, AMO solvency anomaly, USDC depeg/freeze, OETH or superOETHb depeg, bad debt in any Morpho market OUSD supplies, liquidation of the dominant OETH-market borrower, or a CCTP outage
- **Change-based:**
  - Any HyperEVM or Base Timelock operation targeting a remote strategy, any remote-strategy upgrade, or any `remoteStrategyBalance` jump not explained by a CCTP transfer
  - Any change to the HyperEVM Timelock delay, or a material deposit into the HyperEVM cross-chain strategy
  - Any management or performance fee set on an OUSD Vault V2, or any change to a receive-shares gate whitelist
  - Curator, owner, guardian, sentinel, or timelock changes on any of the six OUSD Morpho vaults. In particular, if Morpho curation passed out of Yearn's hands, an internal concentration would become a third-party dependency and warrant a re-score
  - Role changes on the Base or HyperEVM Timelocks, or a remote-strategy upgrade
  - Supply-queue or cap changes that move a Morpho leg into a new collateral type
  - New strategy added to the mint whitelist, or a new cross-chain deployment
  - Governance parameter changes on the vault (`setStrategistAddr`, `setOperatorAddr`, `setMaxSupplyDiff`, `setWithdrawalClaimDelay`, `setTrusteeAddress`, proxy upgrades)
  - Significant TVL change (>50%), or Origin-LST collateral exposure moving materially away from ~75% of TVL

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [June 25, 2026](https://github.com/yearn/risk-score/pull/136) | 1.85 | Initial assessment |
| [August 31, 2026](https://github.com/yearn/risk-score/pull/434) | 2.05 | TVL $6.24M (−16%). Traced the Morpho legs three vault layers deep across Ethereum, Base, and HyperEVM: ~80% of TVL now sits in Morpho Blue markets, and ~54% of TVL is USDC lent against Origin's own OETH / superOETHb in markets whose oracles assume a 1:1 ETH peg with no LST feed. Morpho curation on all three chains is Yearn's own, so it is treated as an internal counterparty rather than an external dependency; the HyperEVM leg is configured more loosely (EOA key, no guardian, `timelock()` = 0) and is called out for monitoring. Corrected the withdrawal-queue reading: `queued` / `claimable` are lifetime counters, so outstanding demand is 14 USDC, not the ~$1.68M implied previously. Vault uses no oracle (`_deprecated_priceProvider`) and rebase is permissioned and rate-capped. Bug bounty reconfirmed live at $1M. Governance, roles, thresholds, proxies, and the mint whitelist unchanged. Dependencies 2.5 → 3.0, Collateralization 2.0 → 2.5, Provability 1.5 → 2.0. |
| [November 8, 2026](https://github.com/yearn/risk-score/pull/571) | 2.12 | Onchain TVL $6.30M. HyperEVM leg wound down to ~$28 (September 28 to October 1, 2026), and the Ethereum Morpho leg grew to 66% of TVL, mostly in the OETH/USDC market, so Origin-LST collateral rose from ~54% to ~75% of TVL. One EOA holds 72.5% of that market's debt, and instantly reachable liquidity fell to ~30% of TVL. HyperEVM Morpho vaults moved from an EOA to a 4/7 Safe with a 3-day timelock, and the Origin Strategist Safe became guardian / sentinel on all six vaults. Trustee changed to a non-upgradeable FeeSplitter (100% of fees to OGN buyback). Added the Critical Permission Paths section; enumerated the Base (48h) and HyperEVM (60s) remote-strategy Timelocks, both driven by an Origin 5/8 Safe. The weakest material path is a HyperEVM remote upgrade feeding an uncapped forged balance into vault accounting (fork-confirmed). Also recorded the untimelocked, gate-restricted 5%/yr management fee available to the Base 2-of-3 curator, and corrected the cross-chain freshness description (the stored balance never expires). Mainnet governance, proxies, strategist, operator, and mint whitelist unchanged. Governance (1.0) and Collateralization (2.5) held after review under the weakest-link rule; Liquidity 2.5 → 3.0. |

---

## Appendix: Contract Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          GOVERNANCE (Ethereum)                           │
│                                                                          │
│  xOGN Token Holders (Staked OGN)                                         │
│  (250K xOGN to propose, ~289M xOGN quorum)                               │
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
│  REMOTE CHAINS: Origin 5/8 Safe (0x92A1..., GOV signer set)              │
│    → Base Timelock (0xf817..., 48h)     → Base remote strategy           │
│    → HyperEVM Timelock (0x7712..., 60s) → HyperEVM remote strategy       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        OUSD VAULT (0xE75D...)                            │
│                                                                          │
│  Supported Asset: USDC only (0xA0b8...)    No oracle, 1:1 mint/redeem    │
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
│  │   AMO: mintAndAddOTokens, removeAndBurnOTokens, removeOnlyAssets.     │
│  │   Remote strategies: deposit(All), withdraw(All).                     │
│  │   OUSD Token: delegateYield, undelegateYield (any account).           │
│  │   Morpho: guardian/sentinel on all six OUSD vaults.                   │
│  ├── operatorAddr:  EOA (0x7392...) [none]: rebase(), relay, balances    │
│  ├── trusteeAddress: FeeSplitter (0xbbE5...) 20% fee → OGN buyback       │
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
│ $1.08M 17.1% │ │ $4.15M 65.9% │ │ $1.07M 17.0% │ │ ~$28 (wound down)    │
│              │ │              │ │  cached bal  │ │  still approved      │
│ ┌──────────┐ │ │      ▼       │ │      │       │ │      │               │
│ │Curve Pool│ │ │  OUSD-V2     │ │  CCTP V2     │ │  CCTP V2             │
│ │OUSD/USDC │ │ │ (0xFB15...)  │ │      ▼       │ │      ▼               │
│ │(0x6d18..)│ │ │ Vault V2     │ │ Remote strat │ │ Remote strat         │
│ │~$1.08M   │ │ │ owner+curator│ │ (0xB1d6...)  │ │ (0xE022...)          │
│ │99.9% LP  │ │ │ = Yearn Sec  │ │ gov: 48h TL  │ │ gov: 60s TL          │
│ │ is AMO   │ │ │   (4-of-7)   │ │      ▼       │ │      ▼               │
│ └──────────┘ │ │      ▼       │ │ OUSDb-V2 →   │ │ OUSDh-V2 →           │
│       │      │ │  adapter →   │ │ OUSDb-V1     │ │ OUSDh-V1             │
│   Gauge      │ │  OUSD-V1     │ │ owner 4-of-7 │ │ owner 4-of-7         │
│  (0x1eF8..)  │ │ (0x5B8b...)  │ │ curator 2/3  │ │ curator 2/3          │
│   → CRV      │ │ MetaMorpho   │ │ timelock 3d  │ │ timelock 3d          │
│   rewards    │ │ 3d timelock  │ │      ▼       │ │      ▼               │
│       │      │ │      ▼       │ │ Morpho Blue  │ │ Morpho Blue          │
│       ▼      │ │ Morpho Blue  │ │ superOETHb   │ │ WHYPE / kHYPE        │
│  Strategist  │ │ OETH/USDC    │ │  77% ~$753K  │ │ dust                 │
│  harvests    │ │ 86% ~$3.95M  │ │ cbXRP 62.5%  │ │                      │
│              │ │ 87.9% util   │ │  ~$318K      │ │                      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│              ORIGIN-COLLATERAL CONCENTRATION (~75% of TVL)               │
│                                                                          │
│  OETH/USDC market (Ethereum)      ~$3.95M   oracle: CL ETH/USD ÷ USDC/USD│
│  superOETHb/USDC market (Base)    ~$753K    oracle: CL ETH/USD ÷ USDC/USD│
│                                                                          │
│  Neither oracle reads an OETH/ETH or superOETHb/ETH price. A depeg of    │
│  Origin's own LST does not trigger liquidation, it creates bad debt in   │
│  the markets OUSD supplies. One EOA owes 73% of the OETH market's debt.  │
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
│  ├── maxSlippage: 0.2% (governor-only setter)                            │
│  └── maxSupplyDiff: 5% (checked on requestWithdrawal)                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    SECONDARY LIQUIDITY                                   │
│                                                                          │
│  Curve Pool: OUSD/USDC (CurveStableSwapNG)                               │
│  (0x6d18...)  ~$1.08M TVL (600,382 OUSD + 478,562 USDC)                  │
│  AMO holds 1,074,872 / 1,075,763 LP = 99.9%, not third-party depth       │
│                                                                          │
│  Legacy: OUSD/3CRV Metapool (0x8765...)  ~$28K TVL [deprecated]          │
│                                                                          │
│  wOUSD (0xD2af...): ERC-4626 wrapper holding ~1.81M OUSD (~28.8%)        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Data flows:
  Mint:    User USDC → Vault → mint OUSD 1:1 → auto-allocate above 25K
  Redeem:  requestWithdrawal (burns OUSD, enqueues request) →
           wait >=600s AND queue liquidity advances →
           claimWithdrawal(s) pays USDC (no onchain upper bound on wait)
  Rebase:  Operator/strategist/governor calls rebase() → yield dripped over
           7 days, capped at ~7.87% APR and 2% per rebase
  AMO:     Strategist → AMO Strategy → mintForStrategy → Curve pool
  Yield:   Morpho interest + CRV/MORPHO rewards → CoW Harvester → USDC → Vault
  Fees:    20% of yield minted to FeeSplitter → harvester → OGN buyback
  Bridge:  Vault → Master strategy → CCTP → Remote strategy → Morpho V2 stack
  Report:  Remote strategy → CCTP message → master.remoteStrategyBalance
           (stored until replaced; no expiry or cap)
```
