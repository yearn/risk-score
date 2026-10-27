# Protocol Risk Assessment: Cap — stcUSD

- **Assessment Date:** March 20, 2026 (Updated: October 27, 2026)
- **Token:** stcUSD (Staked cap USD)
- **Chain:** Ethereum
- **Token Address:** [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- **Final Score: 2.45/5.0**
- **Snapshot:** Ethereum block [26,283,075](https://etherscan.io/block/26283075), October 27, 2026 at 09:13:59 UTC; hash `0x6ea9dc438f6a3354af9c90d59b2f5eb62865aa01421d2f884f861672ecd2fb7c` ([October 27 snapshot reads](https://etherscan.io/block/26283075)). Supplies, reserves, strategy debt, agent debt/health/collateral, implementations, Safe/Timelock state, all Ethereum LayerZero send and receive routes, and governance/bridge event scans from block 26,180,756 use this block. Earlier scans cover blocks 26,114,513–26,180,755 ([October 3–5](https://etherscan.io/block/26128579), [October 5–13](https://etherscan.io/block/26180755)). Katana supply was re-read at Katana block [46,351,154](https://katanascan.com/block/46351154) (October 27 at 09:39:25 UTC). MegaETH and Tempo supplies and inbound receive routes are from the October 13 matching-time blocks MegaETH [29,063,556](https://mega.etherscan.io/block/29063556) and Tempo [43,886,480](https://explore.tempo.xyz/block/43886480), read through public RPCs. No configured RPC was available to re-read them on October 27. The complete selector-role matrix, Symbiotic vault epochs, Ondo withdrawal simulations, remote governance roles, and the remote send-side mesh are from the October 3 block [26,114,512](https://etherscan.io/block/26114512) ([October 3 reads](https://etherscan.io/block/26114512); [October 4 follow-up](https://etherscan.io/block/26114512)). Access Control emitted no events between the October 3 and October 27 blocks. Historical Safe continuity reads use block 25,160,215. API data is separately dated.

## Overview + Links

stcUSD is a **yield-bearing ERC-4626 vault token** issued by Cap. Users stake cUSD to receive stcUSD; yield increases the cUSD exchange rate. cUSD reserves earn through onchain fractional reserve deployment and fees from covered operator loans. Borrowing, repayment, collateral coverage, and liquidation are onchain; operators' proprietary trading strategies remain offchain. Cap's documentation describes the collateral providers as [underwriters](https://docs.cap.app/concepts/delegation.md).

**Key architecture:**

- **cUSD:** Permissionless mint/burn against one whitelisted reserve asset, USDC (**100%** of accounted reserves). The Safe removed wWTGXX from `assets()` on October 22, 2026, after the Oct 19 divestment and the Oct 19–20 holder burns described below. The USDC fee configuration has zero minimum mint fee and zero slopes.
- **stcUSD:** ERC-4626 wrapping cUSD. `totalAssets()` represents **97.93%** of cUSD supply; this measures staked underlying rather than comparing share supply with cUSD supply.
- **Fractional Reserve:** USDC Yearn V3 vault has **$20.826M** of assets: **$20.726M Aave V3 (99.52%)** and **$100.24K Ondo rUSDY (0.48%)**. Former Morpho strategies are revoked with zero debt. The wWTGXX vault is empty (zero assets and shares); its asset is no longer in cUSD's `assets()` list.
- **Operator loans:** **$56.035M USDC principal**, **72.90%** of accounted USDC reserves. Per-agent debt including interest totals **$56.103M**. The largest agent has **51.59%** of that debt, against LBTC collateral at health 1.289. BTC-wrapper collateral backs 63.95% of debt and ETH liquid-staking tokens 36.05%.
- **Security networks:** Symbiotic and EigenLayer isolate coverage by borrower. EigenLayer covers **$843.6K**, or **1.50%** of accrued USDC debt; the remainder is mapped to Symbiotic.
- **Governance:** 3-of-5 Safe → 24-hour timelock for core upgrades, access grants/revocations, new reserve assets, fee schedules, and selected parameters. Since October 5, 2026, a separate 3-of-6 Safe can also cancel queued Timelock operations. The Safe also holds direct configuration, borrower-onboarding, asset-removal, and full reserve-vault roles, so the delay does not protect every risk-changing action.
- **Bridge:** LayerZero lockbox holds **6.763M stcUSD (9.77% of Ethereum supply)** in pooled escrow for configured Katana, MegaETH, and Tempo peers. It transfers existing canonical tokens and cannot mint canonical stcUSD.

**Key metrics ([snapshot reads](https://etherscan.io/block/26283075)):**

- **cUSD supply:** 76,866,057.74 cUSD.
- **stcUSD supply / assets:** 69,229,902.49 shares / 75,272,442.22 cUSD.
- **Price per share:** 1.087282 cUSD per stcUSD (`convertToAssets(1e18)`).
- **Accounted reserves:** 76,865,666.15 USDC. This is an accounting claim, including operator principal; it is not all liquid custody balance.
- **USDC outside operator principal:** 20,830,221.41 USDC (**27.10%** of USDC reserve accounting): 20,826,165.35 USDC loaned to the USDC FRV and 4,056.28 USDC idle in cUSD.
- **Large holders:** The three largest identified stcUSD holders hold **16.930M stcUSD (24.46% of supply)**. An unidentified upgradeable proxy, [`0x31b7d5a2b1ce1871dd642f6aecc0ef68d126b95a`](https://etherscan.io/address/0x31b7d5a2b1ce1871dd642f6aecc0ef68d126b95a), holds **6.457M (9.33%)**. An EOA, [`0x64471d103a7f77262529383d53bdd28b260b1ae8`](https://etherscan.io/address/0x64471d103a7f77262529383d53bdd28b260b1ae8), holds **5.596M (8.08%)**; it received 3.500M from MegaETH on October 11. [Ether.Fi Liquid USD](https://etherscan.io/address/0x08c6f91e2b681faf5e17227f2a44c307b3c1364c) holds **4.877M (7.05%)**. The proxy and Ether.Fi Liquid USD were the two contracts behind 9.0M of the 9.35M cUSD minted and staked between the October 3 and October 5 blocks.
- **Protocol TVL:** **$201.78M**, including restaker collateral tracked by [DeFiLlama](https://api.llama.fi/protocol/cap), retrieved October 27, 2026. The latest API point is October 27 at 07:40 UTC. The 30-day series declines **30.48%** from $290.26M on September 29. The October 22→23 drop from $232.44M to $209.23M (**9.99%**) is mostly uniBTC restaker collateral ($92.38M → $74.11M); uniBTC vaults back $2.99M of debt. This API series is separate from the Ethereum block snapshot.
- **Fees / pauses:** Minimum mint fee **0%** since the October 23 Timelock execution; mint/burn fee slopes zero; basket redeem fee zero. Global and USDC pauses are false.
- **Launch:** August 19, 2025; approximately 14.3 months in production.

**Links:**

- [Cap Documentation](https://docs.cap.app/)
- [Cap Lending Mechanics](https://docs.cap.app/overview/protocol-overview/stcusd-mechanics)
- [Cap Protocol Overview](https://docs.cap.app/overview/protocol-overview)
- [Cap Audits](https://docs.cap.app/resources/audits)
- [DeFiLlama: Cap](https://defillama.com/protocol/cap)
- [Snapshot block 26,283,075 (Etherscan)](https://etherscan.io/block/26283075)

## Contract Addresses

### Core Cap Contracts

| Contract | Address | Type |
|----------|---------|------|
| cUSD | [`0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC) | ERC-20, upgradeable proxy (impl: [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97)) |
| stcUSD | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | ERC-4626 vault, upgradeable proxy (impl: [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31)) |
| Debt USDC | [`0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9`](https://etherscan.io/address/0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9) | Tracks operator borrowings |

### Infrastructure Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| Oracle | [`0xcD7f45566bc0E7303fB92A93969BB4D3f6e662bb`](https://etherscan.io/address/0xcD7f45566bc0E7303fB92A93969BB4D3f6e662bb) | Price oracle for reserve assets |
| Lender | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) | Operator borrowing/repayment engine |
| Access Control | [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | Role-based permission system (upgradeable proxy) |
| Delegation | [`0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F`](https://etherscan.io/address/0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F) | Symbiotic / EigenLayer coverage management |
| Fee Auction | [`0xa1a20aBdc873CF291c22Ce3C8968EC06277324D0`](https://etherscan.io/address/0xa1a20aBdc873CF291c22Ce3C8968EC06277324D0) | Dutch auction for fee conversion |
| Fee Receiver | [`0x0036c7b9b62c53F47c804a5643F0c09f864beF0b`](https://etherscan.io/address/0x0036c7b9b62c53F47c804a5643F0c09f864beF0b) | Collects protocol fees |
| USDC Fractional Reserve Vault | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | Yearn V3 vault — $20.726M Aave V3 + $100.24K Ondo rUSDY |
| wWTGXX Fractional Reserve Vault | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | Yearn V3 vault — empty since the October 19 divestment; wWTGXX removed from cUSD on October 22 |
| cUSD Adapter | [`0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf`](https://etherscan.io/address/0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf) | cUSD integration adapter |
| stcUSD Adapter | [`0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0`](https://etherscan.io/address/0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0) | stcUSD integration adapter |

### Governance Contracts

Selector roles are fully enumerated from Access Control getters at the October 3 block. Access Control emitted no events through the October 27 block. Timelock roles combine the complete grant/revoke event history with `hasRole` confirmation at the October 27 block ([October 3 reads](https://etherscan.io/block/26114512); [October 13](https://etherscan.io/block/26180755) and [October 27](https://etherscan.io/block/26283075) reads and events).

| Contract | Address | Configuration |
|----------|---------|---------------|
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | `getMinDelay() = 86400`; sole DEFAULT_ADMIN on both Access Control and Timelock. Sole Access Control grant/revoke authority and sole core upgrade authority |
| Canceller Safe | [`0xfbf18b80569b29c897c6a857456b5adea720b984`](https://etherscan.io/address/0xfbf18b80569b29c897c6a857456b5adea720b984) | Safe v1.5.0, 3-of-6. Owners: the main Safe, two 2-of-5 Safes (one is also a registered Cap agent with zero USDC debt), and three EOAs; owner addresses are listed on the Safe's [Etherscan page](https://etherscan.io/address/0xfbf18b80569b29c897c6a857456b5adea720b984#readProxyContract) via `getOwners()`. Holds only Timelock `CANCELLER_ROLE`, granted at block [26,125,618](https://etherscan.io/tx/0x77b65415918f7018ff12b84fb82258f63409a3cd76fe603a07c46bd93e6d1d38) after the 24h delay. It cannot propose or execute |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Safe v1.4.1, 3-of-5. Sole Timelock proposer; one of two cancellers and one of two executors. Five EOA owners, publicly anonymous; exact owner set and threshold match historical reads at block 25,160,215. Owner sets are readable from `getOwners()` at both blocks |
| Deployer EOA | [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52) | Timelock executor, without proposer/canceller/admin rights. Also direct protocol pause permission and reserve-vault roles; its permissions are broader than Timelock execution |
| Reserve RoleManager | [`0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24`](https://etherscan.io/address/0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24) | Both Yearn V3 vaults' `role_manager()`. `getGovernance()` = Timelock; `getManagement()` = Safe. Independently, each vault's `roles(Safe) = 16383` (all 14 role bits), `roles(deployer) = 6512`; role-manager governance does not impose a delay on existing vault roles |
| OFT lockbox | [`0x983aeaaa0d0426839158435c43725ea7f45d4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) | UUPS owner = Timelock; LayerZero endpoint delegate = Safe, which can change endpoint security configuration directly |

### Security Network Integration

| Contract | Address | Purpose |
|----------|---------|---------|
| Network | [`0x98e52Ea7578F2088c152E81b17A9a459bF089f2a`](https://etherscan.io/address/0x98e52Ea7578F2088c152E81b17A9a459bF089f2a) | Cap's Symbiotic network registration |
| Network Middleware | [`0x09A3976d8D63728d20DCDFEe1e531C206Ba91225`](https://etherscan.io/address/0x09A3976d8D63728d20DCDFEe1e531C206Ba91225) | Slashing/reward logic |
| Vault Factory | [`0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e`](https://etherscan.io/address/0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e) | Deploys per-operator Symbiotic vaults |
| Agent Manager | [`0x08A728CF4E6b39f4AFa059c6eE376103722953eA`](https://etherscan.io/address/0x08A728CF4E6b39f4AFa059c6eE376103722953eA) | `SymbioticAgentManager`; `addAgent` registers a borrower, its Symbiotic vault, LTV/threshold, restaker rate, and coverage cap in one call. The Safe is the sole `addAgent` holder and calls it directly |
| EigenLayer Service Manager | [`0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd`](https://etherscan.io/address/0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd) | EigenServiceManager; $843.6K accrued USDC debt mapped to this network, all against OETH collateral |
| EigenLayer Agent Manager | [`0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9`](https://etherscan.io/address/0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9) | EigenAgentManager; borrower onboarding and coverage settings |

### Oracles

| Contract | Address | Purpose |
|----------|---------|---------|
| Primary USDC reserve feed | [`0xeef31c7d9f2e82e8a497b140cc60cc082be4b94e`](https://etherscan.io/address/0xeef31c7d9f2e82e8a497b140cc60cc082be4b94e) | RedStone USDC_V2 feed, queried through ChainlinkAdapter; price $0.99973161, last update October 26, 2026 at 10:56:35 UTC |
| Backup USDC reserve feed | [`0x8fffffd4afb6115b954bd326cbe7b4ba576818f6`](https://etherscan.io/address/0x8fffffd4afb6115b954bd326cbe7b4ba576818f6) | Chainlink USDC/USD via the same adapter |
| wWTGXX pricing | [`0xC96d5EC90B07fe2a96253990Dc7eF2df22FDe0b3`](https://etherscan.io/address/0xC96d5EC90B07fe2a96253990Dc7eF2df22FDe0b3) | FixedPriceOracle still returns $1; no longer used for a cUSD reserve asset since wWTGXX was removed on October 22 |

Reserve-asset adapter and payload data are in the [October 3 reads](https://etherscan.io/block/26114512). The Oracle emitted no events through the October 27 block. `getPrice` and `staleness` are re-read in the [October 27 reads](https://etherscan.io/block/26283075). USDC staleness is **86,600 seconds**. Oracle adapter/payload changes are timelocked, but the Safe can change staleness directly, and `setStaleness` has no bound in the verified source.

**Collateral pricing:** The same Oracle values borrower collateral: the Symbiotic middleware calls `getPrice(vault.collateral())` and the EigenServiceManager calls `getPrice(strategy.underlyingToken())`. Adding or changing a collateral price therefore requires the Timelock, and collateral with no price cannot be valued. Prices of the main collateral assets (debt shares at the October 27 block):

| Collateral | Share of USDC debt | Primary pricing | Backup |
|------------|-------------------|-----------------|--------|
| [LBTC](https://etherscan.io/address/0x8236a87084f8B84306f72007F36F2618A5634494) | 51.59% | [Adapter `0x7aA9896a606314335A09fE66d069d11ab50D40DF`](https://etherscan.io/address/0x7aA9896a606314335A09fE66d069d11ab50D40DF) over Chainlink [BTC/USD](https://etherscan.io/address/0xf4030086522a5beea4988f8ca5b36dbc97bee88c) | [`0xECd42243262e3807956eEBDA8DCB9aEa6a3FFd49`](https://etherscan.io/address/0xECd42243262e3807956eEBDA8DCB9aEa6a3FFd49) |
| [uniBTC](https://etherscan.io/address/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) | 5.33% | Chainlink BTC/USD directly, through ChainlinkAdapter; this does not observe a uniBTC depeg | Same feed |
| [OETH](https://etherscan.io/address/0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3) | 1.50% (all EigenLayer agents) | Adapter [`0x7aA9896a606314335A09fE66d069d11ab50D40DF`](https://etherscan.io/address/0x7aA9896a606314335A09fE66d069d11ab50D40DF) over Chainlink [ETH/USD](https://etherscan.io/address/0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419) and the [OETH vault lens](https://etherscan.io/address/0xad2b1657e2c3243750b32cb9a51169575945b05b) | None; see below |

The OETH entry changed in a Timelock batch scheduled at block [26,125,618](https://etherscan.io/tx/0x77b65415918f7018ff12b84fb82258f63409a3cd76fe603a07c46bd93e6d1d38) and executed at block [26,146,408](https://etherscan.io/tx/0x450d228b3ac54f39d640ce852e95c0e3c2c3bf686e8aea5d2d29b4ba34dab69e) on October 6. It moved OETH from a two-feed adapter onto the same adapter used for LBTC: Chainlink ETH/USD combined with Origin's vault rate, without a backup entry. This matches established practice. The largest Ethereum Morpho OETH market, [OETH/USDC](https://app.morpho.org/ethereum/market/0xb8fef900b383db2dbbf4458c7f46acf5b140f26d603a6d1829963f241b82510e/) (86% LLTV, $10.68M supply on October 13), uses [oracle `0xE8aDfF9117151fb5ad7313873780b87cC56EEDB0`](https://etherscan.io/address/0xE8aDfF9117151fb5ad7313873780b87cC56EEDB0). That oracle prices OETH from the same Chainlink ETH/USD feed, with no backup; Cap additionally applies the vault rate. A stale or zero primary makes `getPrice` revert, which pauses coverage reads for the affected agents rather than misvaluing them. wstETH, weETH, SolvBTC, and cbBTC pricing is readable from `Oracle.priceOracleData` and `priceBackupOracleData` at block [26,283,075](https://etherscan.io/block/26283075).

### Morpho Markets

(stcUSD / PT-stcUSD / PT-cUSD as collateral)

Ethereum stcUSD markets queried from [Morpho's API](https://api.morpho.org/graphql) on October 27, 2026, separately from the fixed block. Eight matching markets have only **$139.82 supply** and **$42.59 borrowed** in aggregate. This is dust rather than material alternative liquidity; it does not measure DEX or other-chain liquidity. Market IDs are linked in the table below; the other six markets are reproducible with the same API query.

| Market | LLTV | Supply | Utilization |
|--------|------|--------|-------------|
| [stcUSD / USDC](https://app.morpho.org/ethereum/market/0x8abcf6d7bb7a4bd8720fef5fa27917ac50a88cf2bf1a97002f43fec3919a373c/) | 86% | $89.94 | 0% |
| [stcUSD / AUSD](https://app.morpho.org/ethereum/market/0x21181d33ac70b7290592338113e5af6e68c0e623ffaf932515727bb35f5690ef/) | 91.5% | $35.80 | ~100% |

Other matching stcUSD markets have less than $5 supply each. The Pendle registry figures below are from October 13. A fully paginated [Pendle Ethereum registry](https://api-v2.pendle.finance/core/v1/1/markets?limit=100&skip=0) query on October 13 returned 498 markets. Four have canonical cUSD/stcUSD as their underlying, all with January 29 or July 23, 2026 maturities confirmed by `expiry()` at the October 3 block; **no unmatured replacement Cap PT market was found in this registry**. This is an indexed-market result, not an exhaustive permissionless-deployment search. A separate October 4 [Morpho API](https://api.morpho.org/graphql) query finds 18 markets using these matured PTs, with **$33,623.61 supply / $30,908.50 borrow**. These outstanding matured positions are distinct from the eight direct stcUSD dust markets (PT `expiry()` values read at block [26,114,512](https://etherscan.io/block/26114512)).

## Audits and Due Diligence Disclosures

### Cap Protocol Audits

The [published audit repository](https://github.com/cap-labs-dev/cap-audits) contains **11 reports from 8 firms** as checked October 4, 2026, including core-protocol, security-network, invariant, token, and incremental reviews. Publication count does not establish coverage of every deployed contract:

| Auditor | Date | Scope | Report |
|---------|------|-------|--------|
| [Zellic](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-03-17-Zellic.pdf) | Feb–Mar 2025 | Cap protocol (core) | PDF |
| [Trail of Bits](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-05-15-TrailOfBits.pdf) | Mar–May 2025 | Cap protocol (core) | PDF |
| [Spearbit](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-06-23-Spearbit.pdf) | Apr–Jun 2025 | Cap protocol (core) | PDF |
| [Electisec](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-05-25-Electisec.pdf) | May 2025 | LayerZero vault | PDF |
| [Recon](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-07-04-Recon.pdf) | May–Jul 2025 | Invariant testing | PDF |
| [Sherlock](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-09-03-Sherlock.pdf) | Jul–Sep 2025 | Cap protocol (contest, $126K pool) | PDF |
| [Certora](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-09-15-Certora%20(EigenAVS).pdf) | Sep 2025 | EigenLayer SSN (AVS) | PDF |
| [Spearbit (PR Review)](https://github.com/cap-labs-dev/cap-audits/blob/main/2025-11-27-Spearbit%20(PR%20Review).pdf) | Nov 2025 | Incremental PR review | PDF |
| [Octane](https://github.com/cap-labs-dev/cap-audits/blob/main/2026-03-24-Octane.pdf) | Mar 2026 | `Token.sol`, not a full cUSD deployment audit | PDF |
| [Octane (Delegation)](https://github.com/cap-labs-dev/cap-audits/blob/main/octane_audit_jan_8.pdf) | Undated; filename references Jan 8 | `Delegation.sol`; one high marked fixed, one low, five informational | PDF |
| [Octane (PR 273)](https://github.com/cap-labs-dev/cap-audits/blob/main/2026-9-26-Octane%20(Upgrade).pdf) | Sep 18, 2026; file dated Sep 26 | Restaker-rate cap and cUSD transient reentrancy guard; one informational | PDF |

**Deployed coverage:** The PR 273 review identifies head commit [`224d7c593769fe58feaf3ac2a2f38e51528353e3`](https://github.com/cap-labs-dev/cap-contracts/commit/224d7c593769fe58feaf3ac2a2f38e51528353e3). Its reviewed `Vault.sol` and `RateOracle.sol` are byte-for-byte identical to the corresponding Etherscan-verified sources in the deployed September cUSD and Oracle implementations. This establishes source coverage for the reviewed rate-cap/reentrancy delta, not a full audit of every compiled dependency or inherited change. The review warns that pre-upgrade rates over 100% APR persist; all **43 current restaker-rate reads are ≤100% APR**. The March token review scopes `Token.sol`, not cUSD `CapToken.sol`. The deployed `Vault.sol`, `VaultLogic.sol`, `Minter.sol`, `MinterLogic.sol`, and `CapToken.sol` match the public repository at the PR 273 head. Apart from PR 273's reentrancy guard, they also match the Sherlock bounty-pinned commit [`695c8280b410bce1b43c9254cb214be30fe51dde`](https://github.com/cap-labs-dev/cap-contracts/commit/695c8280b410bce1b43c9254cb214be30fe51dde). The cUSD mint-fee issuance to the insurance fund (`_mint(insuranceFund, fee)`) was added on April 4, 2025 in [`9fdccae64f7b0d4a68734da7626661f449f8a822`](https://github.com/cap-labs-dev/cap-contracts/commit/9fdccae64f7b0d4a68734da7626661f449f8a822) and is present unchanged through the Sherlock contest (July–September 2025) and the November 2025 Spearbit review. The only later fee-path change is the February 25, 2026 #240 ([`0b6701365eb7d589cf3fc9083a2ab742c6cd500a`](https://github.com/cap-labs-dev/cap-contracts/commit/0b6701365eb7d589cf3fc9083a2ab742c6cd500a)) Minter refactor, which passes the caller into fee calculation. It is inside the bounty scope but is not named in a published audit scope. [OndoHolder](https://github.com/cap-labs-dev/cap-yearn-strategies/blob/d993380f8fef3e96c2aecd50af1ee5b34fa71e40/src/strategies/ondo/OndoHolder.sol) is byte-identical to the public `cap-yearn-strategies` repository at [`d993380f8fef3e96c2aecd50af1ee5b34fa71e40`](https://github.com/cap-labs-dev/cap-yearn-strategies/commit/d993380f8fef3e96c2aecd50af1ee5b34fa71e40) (September 25, 2026). Neither that repository nor the audit repository contains a review of it, so it is **unaudited** ([source comparison](https://etherscan.io/block/26180755)).

### Bug Bounty

- **Sherlock Bug Bounty:** [Program 114](https://audits.sherlock.xyz/bug-bounties/114) is live, with **critical-only** rewards capped at **1,000,000 USDC and 10% of funds at risk**. It requires an executable coded PoC, covers deployed Ethereum core contracts and inherited code, excludes known audit issues and external integrations, trusts protocol administrators, and applies a one-hour mitigation window when administrators can intervene. The repository scope is pinned to [`695c8280b410bce1b43c9254cb214be30fe51dde`](https://github.com/cap-labs-dev/cap-contracts/commit/695c8280b410bce1b43c9254cb214be30fe51dde); this does not independently prove coverage of later upgrades, OndoHolder, or remote-chain tokens (terms checked October 4).
- **Immunefi:** No listing established in this refresh
- **Safe Harbor:** No Cap entry appears among the **33 current public adoption entries** in the [official listing](https://safeharbor.securityalliance.org/), checked October 4. No indexed adoption is established; this does not prove absence of an unindexed agreement (checked October 4).

### On-Chain Complexity

The Cap system is **high complexity**:

- **Multi-contract architecture:** 10+ core contracts (cUSD, stcUSD, Lender, Oracle, Access Control, Delegation, Fee Auction, Fee Receiver, Fractional Reserve, Adapters)
- **Upgradeable proxies:** cUSD, stcUSD, and Access Control are ERC-1967 upgradeable proxies (proxy admin set to address(0), upgrades via Access Control roles through Timelock)
- **Security network integration:** Per-borrower Symbiotic/EigenLayer coverage, middleware for slashing/rewards, collateral delegation management
- **Operator model:** Offchain yield generation by institutional counterparties, onchain borrowing/repayment/liquidation
- **Multi-oracle system:** RedStone primary / Chainlink backup for USDC; Chainlink-based adapters for borrower collateral
- **Cross-protocol dependencies:** Aave V3, Ondo rUSDY, Symbiotic, EigenLayer, RedStone/Chainlink, and LayerZero. WisdomTree exposure ended with the October 22 wWTGXX removal. Morpho collateral markets are dust; no current Morpho reserve allocation

## Historical Track Record

- **Launch:** August 19, 2025; approximately 14.3 months as of October 27, 2026.
- **Historical supply:** cUSD was approximately 129M on March 20, 2026, 97.73M on May 23, 2026, 61.61M on October 3 ([reads](https://etherscan.io/block/26114512)), 70.91M on October 5 ([reads](https://etherscan.io/block/26128579)), 73.85M on October 13 ([reads](https://etherscan.io/block/26180755)), and 76.87M at the October 27 snapshot ([reads](https://etherscan.io/block/26283075)).
- **Historical PPS snapshots:** 1.0531 on March 20, 2026; 1.0630 on May 23, 2026; 1.083394 on October 3; 1.083773 on October 5; 1.085048 on October 13; 1.087282 on October 27. These observations do not establish that PPS never decreased between snapshots.
- **TVL peak and drawdown:** [DeFiLlama](https://api.llama.fi/protocol/cap) records $483.79M on January 28, 2026 and $201.78M on October 27, 2026, a **58.29%** decline. In the recent API series, September 24–25 declined from $339.73M to $292.81M (**13.81%**), October 11–12 from $271.50M to $216.66M (**20.20%**), and October 22–23 from $232.44M to $209.23M (**9.99%**); both October drops were mostly uniBTC restaker collateral. cUSD supply rose over the same October period.
- **Security incidents:** No confirmed exploit established by the sources reviewed for this refresh. One small undercollateralized operator position was partially liquidated on October 25 and remains open (below); this is not proof of a realized protocol loss.
- **wWTGXX wind-down:** On October 19, 2026, the Safe paused wWTGXX in cUSD, raised its reserve floor to uint256 maximum, and divested the wWTGXX FRV in [transaction](https://etherscan.io/tx/0x5deff1ef86c1d32f4426b5855f4364073fa8c9d1deaf9ae99a12e4f0efaa4715) at block 26,228,966. This returned all 81,263.98 accounted tokens to cUSD custody. A [Beefy zap router](https://etherscan.io/address/0x5cc9400ffb4da168cf271e912f589462c3a00d1f) then burned cUSD for about 81.26K wWTGXX across three transactions on October 19–20 ([first](https://etherscan.io/tx/0xee6c12731c34ccb9006c8c5fe682e7cad1afcde2aea46aa926e6bfd53b067ef8)). On October 22, a Safe multisend in [transaction](https://etherscan.io/tx/0x738d9f5be7fcc5a56b5b770a5c2d50b29569c5e16d16b633f5b96b2cb4087637) at block 26,248,308 did four things. It whitelisted the Safe, unpaused wWTGXX, cleared the remaining dust supply with a mint and burn, and called `removeAsset(wWTGXX)` directly. It also scheduled a Timelock `setFeeData` for USDC that sets `minMintFee` from 0.10% to zero. That operation executed at block [26,257,467](https://etherscan.io/tx/0x77dd9dac2321df0fc59aa9168b1b6df47307cb4d759b96dab0bb5368bdd876e7) on October 23.
- **Borrower changes:** The cbBTC agent onboarded on October 7 borrowed 303K USDC on October 15. The Safe then set its configured LTV to zero with a direct `modifyAgent` call in [transaction](https://etherscan.io/tx/0xa20fbcf93100cc4d175fec1aa13aaa42d1fef694a6270b5e896c33d2d9d7ada2), which blocks new borrowing while keeping the 80% liquidation threshold. A uniBTC agent borrowed 1.2M USDC on October 19 in [transaction](https://etherscan.io/tx/0x7c7f6568b89bb24b7460129d4efebd5483fe04db56008e048b9d072d0510459d). The largest LBTC agent repaid 999,999 USDC on October 13 in [transaction](https://etherscan.io/tx/0xb7774f97e80edfb7280486809d62b9642f1a9c694c5946ed553dc1fad2e1c1be).
- **cUSD upgrade:** On September 28, 2026, [transaction](https://etherscan.io/tx/0x8e61ca35d40b6a9d2446554e989d980660d49553a11af05756cb5992597cef62) installed [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97) at block 26,077,312. Current verified source includes cUSD mint-fee issuance to the insurance fund. The transient reentrancy-guard delta matches the PR 273 review; dedicated insurance-fund fee coverage remains unestablished.
- **Timelock canceller:** The Safe scheduled a `CANCELLER_ROLE` grant to the 3-of-6 canceller Safe at block [26,116,120](https://etherscan.io/tx/0x42207c14f3dac159287a9db9965d8f811cc99b945095132bd92ae6d3271cb17f) on October 3, 2026. The same transaction cancelled an unexecuted oracle batch from May. The grant executed at block [26,125,618](https://etherscan.io/tx/0x77b65415918f7018ff12b84fb82258f63409a3cd76fe603a07c46bd93e6d1d38) on October 5.
- **Borrower onboarding:** On October 7, 2026, the Safe directly called `SymbioticAgentManager.addAgent` in [transaction](https://etherscan.io/tx/0x6869a4022b817a26cee5a283dd01c2612d6b338df1ef4dcd1d138216ab4ae08c) at block 26,151,077. It registered agent [`0x3403070f6e7266757595348f3c3df2c763cd673a`](https://etherscan.io/address/0x3403070f6e7266757595348f3c3df2c763cd673a), an EIP-7702-delegated EOA, with a cbBTC Symbiotic [vault](https://etherscan.io/address/0xC46566c8E5452d0107e8400BAedeF7855C436E3d) (7-day epochs, the same verified Vault implementation), 50%/80% LTV/threshold, and an unlimited coverage cap. It has $719.14K of delegation and $303.58K of debt at the October 27 snapshot; its configured LTV has been zero since October 15.
- **Safe composition correction:** The May 23, 2026 report described the Safe as having two dormant owners and a nested 1-of-2 Safe. That was incorrect: all five current owners also had empty code at block 25,160,215, and the owner set and threshold were the same.

**Team track record:**

- **Benjamin918 (CEO):** Previously scaled QiDAO from $0 to $400M TVL
- **the_weso (CTO):** Founding member of Beefy Finance (peaked at $1B+ TVL)

**Funding:** $11M total raised — $3M pre-seed, $8M seed (co-led by Franklin Templeton and Kraken Ventures), $1.1M community round on Echo. Investors include Franklin Templeton, Kraken Ventures, Blockchain Capital, a16z crypto, Dragonfly, Lightspeed Faction, Susquehanna (SIG), Nomura's Laser Digital, GSR, Robot Ventures, and others.

## Funds Management

### Yield Generation

stcUSD earns yield from two primary sources:

**1. Fractional Reserve Deployment**

The USDC vault and wWTGXX vault are Yearn V3 vaults. Debt, maximum debt, depositor shares, asset conversions, queues, and withdrawal limits were read at the October 27 block ([snapshot reads](https://etherscan.io/block/26283075)). The October 3–27 scan range contains `DebtUpdated`, `StrategyReported`, deposit, and withdrawal events, with no role or strategy-set changes.

| USDC reserve strategy | Current debt / share of FRV | Maximum debt | Status |
|-----------------------|-----------------------------|--------------|--------|
| [Aave V3 USDC Lender](https://etherscan.io/address/0x7D7F72d393F242DA6e22D3b970491C06742984Ff) | $20,725,922.98 / **99.52%** | $50M | Active, first in default queue |
| [OndoHolder USDC](https://etherscan.io/address/0x9939009295eAD3c67259aF3b93C284079ffE931e) | $100,242.37 / **0.48%** | $15M | Active, second in default queue |
| [Steakhouse Prime Compounder](https://etherscan.io/address/0xBAed9839573d349e42DFbF23a8916e5AB9cAf2E3) | $0 | $0 | Revoked: `strategies()` returns four zeros; strategy supply/assets zero |
| [Gauntlet Prime Compounder](https://etherscan.io/address/0x8092C20351CF4048B464DF2144Dc8a4DD49ce71D) | $0 | $0 | Revoked: `strategies()` returns four zeros; strategy supply/assets zero |

**USDC FRV:** [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072), `totalDebt() = totalAssets() = $20,826,165.35`, `totalIdle() = 0`. cUSD owns all reported depositor shares; `maxWithdraw(cUSD)` returns this amount. Both vaults are active (`isShutdown() = false`), have zero minimum idle, and have unlimited vault deposit limits. Maximum debts authorize future allocations; they are not amounts currently invested.

**Ondo leg:** The holder has no idle USDC and holds **100,242.37 rUSDY** at [`0xaf37c1167910ebC994e266949387d2c7C326b879`](https://etherscan.io/address/0xaf37c1167910ebC994e266949387d2c7C326b879). Its [verified source](https://etherscan.io/address/0x9939009295eAD3c67259aF3b93C284079ffE931e#code) values rUSDY at 1:1 after decimal conversion and uses [`0xa42613C243b67BF6194Ac327795b926B4b491f15`](https://etherscan.io/address/0xa42613C243b67BF6194Ac327795b926B4b491f15) (USDY_InstantManager) to subscribe/redeem. The strategy must satisfy Ondo identity/compliance checks; redemption depends on token-router liquidity, fees, oracle pricing, and rate limits. `redeemPaused()` is false at the October 27 block, and USDC is an accepted redemption token. `availableWithdrawLimit()` returns uint256 maximum for its depositor, without measuring those external gates. **Read-only withdrawal simulations succeeded** for **$1, $1,000, and the full $100,000 position**, calling the strategy from its actual depositor vault at the October 3 block with zero tolerated loss. The full call returns **99,969,745,256 strategy shares burned**. These `eth_call` results exercise redemption but do not send a transaction or guarantee future execution (simulated with `eth_call` at block [26,114,512](https://etherscan.io/block/26114512)). The Safe is strategy `management()` and can change `exchange` directly.

**wWTGXX FRV:** [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) has zero assets and zero shares; [Holder wWTGXX](https://etherscan.io/address/0xB0D399E8A11E1c6df00E1Fb5698936B5614e9259) holds no wWTGXX. cUSD holds no wWTGXX, and wWTGXX is absent from `assets()`. The vault remains in `fractionalReserveVaults()` with the Safe's full role bitmap, but re-adding wWTGXX or any reserve asset requires the Timelock `addAsset` path.

**Concentration:** Aave is the principal liquid reserve venue, but its $20.73M position is only about **26.96% of cUSD supply**. Operator principal represents 72.90% of USDC reserve accounting. Neither the inactive Morpho vaults nor their underlying markets are current reserve dependencies.

**2. Operator Borrowing Fees**

Operators borrow at a dynamic benchmark-plus-utilization rate. The current USDC `Oracle.benchmarkRate()` is **3.5%** ([snapshot reads](https://etherscan.io/block/26283075)); the realized yield split and a current 90-day average were not established in this refresh. The hurdle rate is a function of:

- **Market rate:** Benchmarked against Aave USDC supply rate (competitive floor)
- **Utilization rate:** Piecewise linear adjustment that escalates sharply at high utilization

Operators generate yield through proprietary strategies: HFT, private credit, cross-market arbitrage, MEV capture, funding rate arbitrage, and token farming. Named operators include **IMC Trading**, **Edge Capital**, and **Susquehanna Crypto**.

**Yield distribution (example with 15% operator yield, 8% hurdle rate):**

- 8% flows to stcUSD holders (hurdle rate)
- 2% goes to restakers (negotiated premium)
- 5% remains as operator profit

### Collateralization

**Accounting and custody must be distinguished.** `totalSupplies(USDC)` is **76,865,666.15 USDC**; `totalBorrows(USDC)` is **56,035,444.74 USDC principal**. The difference is **20,830,221.41 USDC** (`availableBalance`). It consists of **20,826,165.35 USDC** loaned to the FRV and **4,056.28 USDC** idle in cUSD, which together exceed `availableBalance` by about 0.23 USDC ([snapshot reads](https://etherscan.io/block/26283075)).

At $1 nominal values, reserve accounting totals **76,865,666.15**, versus **76,866,057.74 cUSD supply** (approximately **$391.59 / 0.00051%** difference). These getters do **not** prove exact 1:1 market-value backing: USDC's oracle price is $0.99973161, operator debt is a credit claim, and recoverability depends on collateral realization. No confirmed realized shortfall is inferred from this small accounting difference.

44 agents are enumerable; 18 have positive USDC debt. Per-agent `Lender.debt()` includes accrued restaker interest and totals **$56,103,328.00**, distinct from vault principal. The five largest positions account for **90.20%** of accrued debt:

| Agent | Collateral | USDC debt including interest | Debt share | Configured LTV / liquidation threshold | Current health |
|-------|------------|------------------------------|------------|---------------------------------------|----------------|
| [`0x0D35D950FDb0741F11c4384dAd15A07EdB26E21A`](https://etherscan.io/address/0x0D35D950FDb0741F11c4384dAd15A07EdB26E21A) | LBTC | $28.941M | 51.59% | 60% / 80% | 1.289 |
| [`0x7F2165014A477f6ABA532000d8088Ed64dD1eBA1`](https://etherscan.io/address/0x7F2165014A477f6ABA532000d8088Ed64dD1eBA1) | wstETH | $8.483M | 15.12% | 50% / 80% | 1.367 |
| [`0x3fA0d4Ce8c396B03beB3D8411e10b0126A1B913d`](https://etherscan.io/address/0x3fA0d4Ce8c396B03beB3D8411e10b0126A1B913d) | weETH | $5.363M | 9.56% | 50% / 80% | 2.880 |
| [`0x4Cd7C473985Ca1399810536e0482dF1e4E0672D6`](https://etherscan.io/address/0x4Cd7C473985Ca1399810536e0482dF1e4E0672D6) | wstETH | $4.830M | 8.61% | 50% / 80% | 2.227 |
| [`0xaCaaF5AAc016257BF305640fc7D7239648A0D34A`](https://etherscan.io/address/0xaCaaF5AAc016257BF305640fc7D7239648A0D34A) | uniBTC | $2.988M | 5.33% | 50% / 80% | 1.558 |

The SolvBTC agent [`0x624C31fdFB9CcbAF182a3c503Cf245BCa671b860`](https://etherscan.io/address/0x624C31fdFB9CcbAF182a3c503Cf245BCa671b860) follows with $2.432M (4.33%, health 1.999).

The small agent [`0x77df7B5aBF875894Ffb1443Fd2840b603d3AC1DA`](https://etherscan.io/address/0x77df7B5aBF875894Ffb1443Fd2840b603d3AC1DA) was partially liquidated on October 25 in [transaction](https://etherscan.io/tx/0x481f5a78f80c3abb8660d2d6bf4082dd22be7bddb75dbb5e004fd3f1195dd4b2) at block 26,268,879. A permissionless liquidator repaid **74.46 USDC**, and the Lender slashed the agent's collateral through the Symbiotic middleware (`SlashNetwork`). The position remains open with **521.47 USDC** of debt, **$56.81** of delegated collateral, and health **0.0872**. This is the first `Liquidate` and `SlashNetwork` event in the October 3–27 scans; the residual is too small to matter for backing. All 44 `liquidationStart()` reads are zero at the October 27 block; that does not establish a clean historical default/slashing record. Historical reads around the [June 2, 2026 collateral withdrawal](https://etherscan.io/tx/0xc7baeed30ea683141f5cf35bd6422d8bde5485606b49465bceca69499357976c) at block 25,230,395 show **0.853529535 collateral tokens** removed from active stake: delegated value falls from **$2,141.91 to $108.41**, while approximately **$671.67 USDC debt** remains, and health falls **2.552 → 0.129**. Slashable historical collateral remains temporarily available, which does not prevent the immediate coverage decline. The last recorded repayment is a [partial $100 USDC payment on August 19](https://etherscan.io/tx/0x79d13e5010ab662fd1e10143e0c720b7b8ee873a5e34b9464e5343931dd95afe). Complete lender-event scans find no open/close/liquidate events for this borrower through the October 3 block. Between the October 3 and October 27 blocks, the only liquidation event for it is the partial October 25 liquidation. Partial repayments and liquidations are not proof of remediation ([history and adjacent-block reads](https://etherscan.io/block/26114512)).

Symbiotic covers 98.50% of current accrued USDC debt; [EigenLayer Service Manager](https://etherscan.io/address/0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd) covers 1.50%.

**Collateral composition (by USDC debt):** LBTC 51.59%, wstETH 24.99%, weETH 9.56%, SolvBTC 6.50%, uniBTC 5.33%, OETH 1.50%, cbBTC 0.54%, WBTC dust. BTC-denominated wrappers back **63.95%** of debt and ETH liquid-staking tokens **36.05%**. Liquidation recovery therefore depends on BTC/ETH prices, wrapper redemption, and DEX depth for Lombard, Lido, ether.fi, Solv, Bedrock, Coinbase, and Origin tokens. The largest borrower's health of 1.289 means its LBTC collateral covers its debt by about 1.61×. A fall of about 22% in the LBTC price would bring it to health 1 and open liquidation. Its health was 1.331 on October 3, 1.345 on October 5, 1.298 on October 13, and 1.289 on October 27. Its delegated collateral value was $49.53M, $50.10M, $48.41M, and $46.62M at those blocks. Each agent's collateral asset is readable from `Delegation.collateral(agent)` at block [26,283,075](https://etherscan.io/block/26283075). The borrower-address table does not attribute addresses to the historically named institutions. The live largest position uses 60% configured LTV, so a universal 50% LTV claim is incorrect.

- **Liquidation parameters:** 12-hour grace, 3-day expiry, 10% bonus cap, and target health 1.25, verified from Lender getters. The Safe can change grace, expiry, bonus, LTV buffer, and agent LTV/thresholds directly, within source-level bounds: liquidation threshold ≤100%, LTV + `ltvBuffer` ≤ threshold, buffer >1% (currently 5%), bonus cap ≤100%, and grace < expiry. These bounds stop configured LTV from exceeding collateral value. They do not stop the Safe from raising a threshold to delay liquidation.
- **Slashing:** `openLiquidation` and `liquidate` are permissionless once health is below 1 and have no pause check; only the Lender can call `Delegation.slash`. The October 25 partial liquidation exercised this path onchain. Coverage is isolated per borrower. Recoverable value depends on the collateral, oracle, and liquidation execution, not just nominal accounting.

### Accessibility

- **Deposits:** Permissionless — deposit cUSD to receive stcUSD (ERC-4626 standard)
- **Withdrawals:** ERC-4626 standard. Redeem stcUSD for cUSD
- **cUSD minting:** Deposit USDC at oracle price; the minimum minting fee is zero since October 23
- **cUSD burning:** Receive a single reserve asset at oracle price with dynamic fee
- **cUSD redemption:** Receive the proportional reserve basket; current redeem fee is zero. Redemption remains bounded by available reserves and external strategy withdrawals
- **Restaker withdrawal delay:** All **34 mapped Symbiotic vaults** read at the October 3 block, and the vault added on October 7, have **604,800-second (7-day) epochs** and the same verified Vault implementation. Withdrawals are assigned to the next epoch and claimed only after that epoch ends: approximately **7–14 days from request**, subject to slashing and claim execution. EigenLayer [DelegationManager](https://etherscan.io/address/0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A) has `minWithdrawalDelayBlocks = 100800`, and [AllocationManager](https://etherscan.io/address/0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39) has `DEALLOCATION_DELAY = 100800` blocks (approximately 14 days at 12 seconds/block). These collateral-exit rules do not establish a universal cUSD redemption or recovery deadline ([source and per-vault reads](https://etherscan.io/block/26114512)).

### Token Mint Authority

Re-verified against source-verified cUSD implementation [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97) and stcUSD implementation [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31) ([October 3 reads](https://etherscan.io/block/26114512); implementations unchanged and source-verified at the [October 5 block](https://etherscan.io/block/26128579), and unchanged at the [October 13](https://etherscan.io/block/26180755) and [October 27](https://etherscan.io/block/26283075) blocks).

| Caller / path | Mint / burn authority | Backing check |
|---------------|----------------------|---------------|
| Any stcUSD depositor | ERC-4626 `deposit` / `mint`; shares burned on withdrawal | Atomic cUSD transfer in |
| Any cUSD minter | `Vault.mint(asset, amountIn, minAmountOut, receiver, deadline)`; caller burns its own cUSD for exits | Whitelisted asset, capacity, oracle price, pause checks, and atomic reserve transfer |
| cUSD mint-fee issuance | The same deposit call mints the fee as cUSD to `insuranceFund()` [`0x5Eaf535b1e399DE08Db23b4E18bD3cD29E16b825`](https://etherscan.io/address/0x5Eaf535b1e399DE08Db23b4E18bD3cD29E16b825) | User output plus fee issuance share the deposited reserve backing; no separately callable privileged mint |
| LayerZero lockbox [`0x983aeaaa0d0426839158435c43725ea7f45d4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) | Escrows/releases existing stcUSD; no canonical mint/burn role | Authenticated peer/message path then `safeTransfer`; loss exposure is pooled canonical escrow and remote claims |

There is **no privileged standalone unbacked mint function** in these verified implementations. This does not eliminate indirect unbacked issuance: a malicious upgrade, inflated oracle, or worthless whitelisted reserve can impair economic backing. Core upgrades, reserve additions, oracle adapter/payload changes, deposit caps, and fee schedules are timelocked. Emergency/configuration powers outside that delay are detailed below.

Current USDC deposit cap is uint256 maximum and its reserve floor is zero. USDC is the only asset in `assets()`. Fees are denominated in ray: `minMintFee` is **0** since the October 23 Timelock execution; slopes are zero and the configured 33% optimal ratio is a fee input, not an enforceable diversification cap. Fee-exempt whitelist entries were added directly by the Safe for a Safe proxy [`0x20860df33c7fed203f21eb5a1166548a54c3c05c`](https://etherscan.io/address/0x20860df33c7fed203f21eb5a1166548a54c3c05c) on October 15. Two EOAs, [`0xce5781c0a6b11e33ad5f1e04052ff02149657594`](https://etherscan.io/address/0xce5781c0a6b11e33ad5f1e04052ff02149657594) and [`0xed41a12ea862f31df054e9bd3af1dd59486c6029`](https://etherscan.io/address/0xed41a12ea862f31df054e9bd3af1dd59486c6029), were added on October 21, and the Safe itself on October 22.
**LayerZero exposure:** `balanceOf(lockbox)` = **6,763,265.74 stcUSD**, or **9.77%** of canonical supply. Between the October 13 and October 27 blocks, 28 `OFTReceived` releases (23,581.77 stcUSD from Tempo and 2.97 from MegaETH) and two `OFTSent` deposits to MegaETH (3.90 stcUSD) reduced it by 23,584.17 stcUSD. Lockbox-related LayerZero logs in the October 3–13 scans are packet verification/delivery events only. Between the October 13 and October 27 blocks, the lockbox emitted only OFT events (no `PeerSet`), and the October 27 re-reads find the same peers, delegate, libraries, and DVN configuration. Complete `PeerSet` event enumeration plus current `peers()` finds nonzero peers for **Katana (30375)**, **MegaETH (30398)**, and **Tempo (30410)**; endpoint 30390 is disabled. The lockbox's pool cannot be attributed wholly to Katana.

At the October 3, October 13, and October 27 blocks, each active **remote→Ethereum escrow-release** route used receive library [`0xc02Ab410f0734EFa3F14628780e6e695156024C2`](https://etherscan.io/address/0xc02Ab410f0734EFa3F14628780e6e695156024C2), **15 confirmations**, **3 required DVNs**, and **no optional DVNs**. Providers are [LayerZero Labs](https://etherscan.io/address/0x589dEDbD617e0CBcB916A9223F4d1300c294236b), [Canary](https://etherscan.io/address/0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd), and [Nethermind](https://etherscan.io/address/0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5), attributed using [LayerZero metadata](https://metadata.layerzero-api.com/v1/metadata). Ownership/UUPS upgrades are held by the Timelock, but the endpoint **delegate is the Safe**, allowing direct security-configuration changes. The three Ethereum receive routes and three Ethereum send routes (send library [`0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1`](https://etherscan.io/address/0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1)) were re-read at the October 27 block. All require the same 3-of-3 set and 15 confirmations. The nine remote route configurations are the October 3 and October 4 reads. The MegaETH and Tempo inbound receive configurations were re-read at their October 13 matching-time blocks and still required 3-of-3 and 15 confirmations; they were not re-read on October 27. Katana's remote DVN configuration was not repeated after October 4. The three Ethereum receive routes have no receive-library grace. The nine remote receive-library timeouts in the October 4 reads are the zero address and zero expiry, so no additional old receive library was enabled in that mesh. Every configured receive path requires **3-of-3 LayerZero Labs / Canary / Nethermind, 15 confirmations, no optional DVNs**; chain-local DVN addresses and raw ULN tuples are readable from each chain's endpoint `getConfig(oapp, receiveLibrary, eid, 2)` at the matching-time blocks.

| Remote chain / token | Source-verified implementation | Supply in stcUSD units |
|---------------------|--------------------------------|-----------------------|
| Katana [`stcUSD`](https://katanascan.com/address/0x88887be419578051ff9f4eb6c858a951921d8888) | [`L2TokenUpgradeable`](https://katanascan.com/address/0xdf784f64f0498e5d671cd6c50d2ded402959d306) | 90,917.176288 (October 27, block 46,351,154; unchanged from October 13) |
| MegaETH [`stcUSD`](https://mega.etherscan.io/address/0x88887be419578051ff9f4eb6c858a951921d8888) | [`L2TokenUpgradeable`](https://mega.etherscan.io/address/0x3b2bf0834130878e0568b8047061a77e234ef37b) | 6,672,058.520565 (October 13); TODO: re-read `totalSupply()` with a configured MegaETH RPC |
| Tempo [`stcUSD` TIP-20](https://explore.tempo.xyz/address/0x20c0000000000000000000008ee4fcff88888888) | [`TempoBridgeUpgradeable`](https://explore.tempo.xyz/address/0x0a1635eacee7dde9792ce2b7ae5bc373878d389b), via [adapter](https://explore.tempo.xyz/address/0x4eec5b8fdfbcdd45dfb29f666d9c34ad38c7afa5) | 23,871.216376, 6 decimals (October 13); 23,581.77 stcUSD has since been released on Ethereum from Tempo. TODO: re-read `totalSupply()` with a configured Tempo RPC |

Katana and MegaETH OFTs mint only in their authenticated receive `_credit` path and burn on send. Tempo's adapter mints/burns the separate TIP-20; its **sole current `ISSUER_ROLE` holder is the adapter**, and its sole role admin is the remote timelock, established by a complete six-event membership history and current `hasRole` reads. Tempo's token is unpaused with an always-allow transfer policy; the adapter's timelock owner can also replace its underlying token.

Remote owner timelocks share address [`0x0000000035A7744F94e6949431CE20EA77312a55` on Katana](https://katanascan.com/address/0x0000000035A7744F94e6949431CE20EA77312a55), [MegaETH](https://mega.etherscan.io/address/0x0000000035A7744F94e6949431CE20EA77312a55), and [Tempo](https://explore.tempo.xyz/address/0x0000000035A7744F94e6949431CE20EA77312a55). Each has a **24-hour delay**, sole self-admin, and the chain-local Safe as sole proposer/canceller/executor. Their runtime bytecodes are identical to the source-verified Katana/MegaETH timelock. All three local Safe delegates have the same **3-of-5 threshold and exact five-owner set** as the Ethereum Safe, and can directly change endpoint configuration. These are shared signer trust, not independent governance quorums.

At the October 13 matching-time blocks, the three remote supplies sum to **6,786,846.913229 stcUSD** versus **6,786,849.913229 canonical escrow**. That is the same **3.000000 stcUSD escrow surplus** as on October 3 (10,286,617.476483 versus 10,286,620.476483), so the October 11 release reconciles exactly. The October 27 reconciliation is incomplete because MegaETH and Tempo supplies were not re-read; Katana's supply is unchanged. The surplus is not on the Ethereum side. All 350 stcUSD transfers into the lockbox since its December 30, 2025 deployment pair with an `OFTSent` event, and all 178 transfers out pair with an `OFTReceived` event; none is a direct deposit. Netting those flows by chain gives MegaETH 107.088037 stcUSD more than its supply, and Tempo and Katana 103.060037 and 1.028000 less. Those offsets sum to the 3.000000 surplus. Tokens moved between remote chains account for the per-chain gaps, and 3 stcUSD left remote supply without arriving on another chain. That is consistent with a remote burn or an undelivered remote-to-remote packet. The surplus over-collateralizes the escrow rather than leaving it short. Remote implementations, peers, owners, endpoint delegates, receive libraries, and raw receive configurations for the Ethereum route on MegaETH and Tempo are unchanged from October 3 ([October 13 remote reads](https://etherscan.io/block/26180755)); matching-time supply reads do not reconcile in-flight packets or prove settlement finality. Malicious remote upgrades, new issuer grants, token replacement, or weaker receive settings can create claims redeemable against pooled canonical custody. All measured verification settings are mutable ([full mesh, source fingerprints, roles, and reconciliation](https://etherscan.io/block/26114512)).

### Provability

- **stcUSD exchange rate:** Onchain ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic
- **Reserve composition:** Onchain — reserve assets held in the vault contracts are verifiable
- **Fractional reserve positions:** Onchain — Yearn strategy debt, depositor-share conversions, Aave liquidity, and Ondo rUSDY balance are verifiable; RWA redemption and proprietary operator strategies add offchain assumptions
- **Operator positions:** Partially onchain — borrowing/repayment recorded onchain, but operators' actual yield strategies are offchain and opaque
- **Collateral valuation:** Onchain — the Timelock-controlled Oracle prices collateral. uniBTC is priced at BTC/USD.
- **Slashing conditions:** Onchain verifiable — liquidation opens permissionlessly when health falls below 1. The Safe directly controls the inputs that decide when that happens and how much is recovered: agent LTV/threshold, LTV buffer, grace, expiry, and bonus cap, within code bounds.

## Liquidity Risk

- **Primary exit:** stcUSD → cUSD through ERC-4626, followed by cUSD burn for a chosen reserve or basket redemption. stcUSD has no staking lock; underlying liquidity still constrains the final exit.
- **USDC buffer:** **$20.830M**, or **27.10%** of USDC reserve accounting, lies outside operator principal; **$56.035M** is outstanding credit. The active Aave strategy reports approximately **$155.72M** available withdraw liquidity, above its $20.726M position, and the FRV reports `maxWithdraw(cUSD) = $20.826M` at this block ([snapshot reads](https://etherscan.io/block/26283075)). The buffer was 10.06% on October 3, 21.83% on October 5, and 24.82% on October 13. These values can change with Aave utilization and do not accelerate operator repayment.
- **Ondo gate:** The $100K leg depends on KYC/compliance, rate limits, oracle/fees, and router liquidity. October 3 fixed-block strategy simulations succeeded through the full position; its declared unlimited limit does not guarantee future execution. A small request below the minimum redemption can also fail.
- **Large exit:** A 20% cUSD exit is about **$15.37M**, within the current $20.83M buffer. The largest holder, `0x31b7d5a2b1ce1871dd642f6aecc0ef68d126b95a`, has 6.457M stcUSD, about $7.02M of cUSD; its full exit would leave about $13.8M of buffer. The three largest identified holders together hold about $18.41M of cUSD, 88% of the buffer. Withdrawals beyond the buffer depend on operator repayment or new inflows. A permissionless call can revert for insufficient underlying liquidity rather than enter a guaranteed withdrawal queue. No unconditional full-exit time is established.
- **Secondary liquidity:** The October 27 [Morpho API](https://api.morpho.org/graphql) snapshot shows only $139.82 across Ethereum stcUSD collateral markets. No current DEX-depth claim is established. The October 13 Pendle registry check finds only matured Cap PTs; on October 4, their Morpho markets had $33.62K supply. No unmatured Ethereum replacement is indexed.
- **Bridge exits:** The pooled 9.77% escrow exposure adds LayerZero message/security and remote-token risks before canonical redemption.
- **Restaker withdrawals:** Epoch-based withdrawal mechanics remain a separate collateral constraint; they are not an stcUSD withdrawal guarantee.

## Centralization & Control Risks

### Governance

Core token upgrades and Access Control administration are protected by the **3-of-5 Safe → 24-hour Timelock** path. A separate 3-of-6 Safe can cancel queued operations. Direct operational and parameter powers coexist with that path ([October 3 role matrix](https://etherscan.io/block/26114512); [October 13](https://etherscan.io/block/26180755) and [October 27](https://etherscan.io/block/26283075) reads and events); [protocol documentation](https://docs.cap.app/concepts/access-controls) describes function-specific roles, not a universal delay.

| Authority | Current holders | Effect |
|-----------|-----------------|--------|
| Core proxy upgrades (`bytes4(0)` role); Access Control DEFAULT_ADMIN and grant/revoke selectors | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) alone | Can replace token/control logic or grant new permissions after 24h |
| cUSD `addAsset`, `setDepositCap`, `setFeeData`, `setRedeemFee`, `setFractionalReserveVault`; oracle price/backup/market/utilization adapters | Timelock alone | Reserve addition, caps, fees, destination vault, and oracle configuration after 24h |
| cUSD `removeAsset`, `setReserve`, `setWhitelist`, `setInsuranceFund`, divest; Lender `setGrace`, `setExpiry`, `setBonusCap`, `pauseAsset`; Delegation `modifyAgent`, `setLtvBuffer`, `registerNetwork` | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) directly | Can change reserve floor, fee exemption/recipient, liquidity deployment, and liquidation/LTV parameters without scheduling a timelock operation. Source bounds: threshold ≤100%, LTV + buffer ≤ threshold, bonus ≤100%, grace < expiry. Lender pause blocks borrowing, not liquidation. Asset removal requires zero accounted supply; rescue is restricted to unsupported assets. Used between October 15 and 22 for fee whitelisting, the cbBTC agent's LTV cut to zero, and the wWTGXX pause, divest, and removal |
| Symbiotic AgentManager `addAgent` | Safe alone | Directly onboards a borrower, registers its Symbiotic vault, and sets LTV/threshold, restaker rate, and coverage cap. Bounds: the vault must be a Symbiotic registry entity with an instant slasher and the required epoch; LTV/threshold limits apply; collateral must already have an Oracle price, which only the Timelock can set. Used on October 7 with an unlimited coverage cap. The [EigenAgentManager](https://etherscan.io/address/0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9)'s `addEigenAgent`, `setRestakerRate`, and `setServiceManager` are also held by the Safe alone; both managers' upgrades belong to the Timelock |
| Oracle `setStaleness` | Safe and Timelock | Safe can relax or tighten stale-price acceptance directly; no source bound |
| cUSD `pauseProtocol` | Safe, [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52), [`0x5143957cfCA5c683a2b6B4Bdb715a9d9aCF6d77a`](https://etherscan.io/address/0x5143957cfCA5c683a2b6B4Bdb715a9d9aCF6d77a) | Direct emergency pause; unpause belongs to Safe |
| cUSD `investAll` | Safe and [`0x51da1eC8dC52F146e644F5F759D399038CCf7aB4`](https://etherscan.io/address/0x51da1eC8dC52F146e644F5F759D399038CCf7aB4) | Direct investment into the already selected FRV; cannot select a new FRV |
| cUSD `borrow` / `repay` | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) alone | Contract-authorized covered loan path |
| Yearn FRV roles | Safe: 16383; deployer: 6512 on both vaults | Safe has all 14 roles, including strategy/debt/queue configuration. RoleManager governance is Timelock, but current permissions execute directly |
| OndoHolder `management` | Safe | Direct `setExchange` changes the conversion/redemption venue |
| LayerZero owner / endpoint delegate | Timelock / Safe respectively | Owner controls UUPS upgrades/peers; delegate can alter receive security settings directly |
| Timelock `CANCELLER_ROLE` | Safe and [`0xfbf18b80569b29c897c6a857456b5adea720b984`](https://etherscan.io/address/0xfbf18b80569b29c897c6a857456b5adea720b984) | Either can cancel a queued operation during the 24h delay. The 3-of-6 canceller Safe adds a veto path that does not depend on main-Safe consent; it does not affect direct powers |
| Stabledrop `recoverERC20` | Timelock (queued operation) | [Stabledrop](https://etherscan.io/address/0xfe2e276ec427cea3ee16f34cd1f617df62b798a4) is a Merkle-claim distributor holding **588,148.85 cUSD**. A Timelock operation scheduled on October 22 in [transaction](https://etherscan.io/tx/0x416868b58b1ca3c137050bae690a2aed2e0e5dc60e938e71e231b7e38556fae0) transfers that full balance to a 2-of-3 Safe, [`0xa388cf78ba2abffbe6dfcc0a4211cdbd430b69fd`](https://etherscan.io/address/0xa388cf78ba2abffbe6dfcc0a4211cdbd430b69fd). At the October 27 block it is ready but unexecuted. It moves existing cUSD and does not mint |

Every enumerated Access Control selector role has DEFAULT_ADMIN as its role admin; the Timelock is the sole holder. Timelock event history identifies the Safe as sole proposer; the Safe and the canceller Safe as cancellers; the Safe plus deployer as executors; and the Timelock itself as sole admin. Between the October 3 and October 13 blocks, the Safe's transactions were Timelock schedule/cancel/execute calls plus one direct `addAgent` borrower onboarding on October 7. Between the October 13 and October 27 blocks, the Safe executed seven transactions. Four were direct configuration calls: a `modifyAgent` and a whitelist on October 15, the wWTGXX pause/divest on October 19, and two whitelists on October 21. The other three were the October 22 asset-removal multisend with its fee schedule, the Stabledrop schedule, and the October 23 fee execution. The Timelock emitted no role grant or revoke events. Address-zero execution is not enabled. The complete selector-holder matrix is readable from Access Control `getRoleMembers` at block [26,114,512](https://etherscan.io/block/26114512); Access Control emitted no events through the October 27 block.

Safe threshold and **exact owner set** match block 25,160,215, the May 23 baseline, and are unchanged at the October 27 block; the canceller Safe's owners and threshold are also unchanged from October 13. All five main-Safe owners return empty code (EOAs) at both the baseline block and the October 27 snapshot, so the May report's description of dormant owners and a nested 1-of-2 Safe was an error, not a later change. Public signer attribution remains anonymous. The Timelock protects core upgrades, but direct reserve-vault, borrower-onboarding, liquidation, oracle-staleness, and bridge-delegate powers materially limit advance warning.

### Programmability

| Factor | Assessment |
|--------|-----------|
| stcUSD PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless staking/unstaking onchain |
| Reserve deployment | Yearn V3 debt deployment to Aave V3 / Ondo, with direct Safe allocation control |
| Operator strategies | **Offchain** — operators execute proprietary strategies. Borrowing/repayment recorded onchain, but actual yield generation is opaque |
| Hurdle rate | Onchain — dynamic function of market rate + utilization |
| Slashing | Onchain — permissionless liquidation below health 1; Safe-set thresholds, buffer, grace, expiry, and bonus within code bounds |

**Programmability is mixed:** Core vault mechanics (staking, PPS, reserve deployment, slashing) are fully onchain. However, the operator yield generation — which represents a portion of stcUSD yield — is offchain and opaque.

### External Dependencies

| Dependency | Criticality | Current exposure / loss path |
|------------|-------------|------------------------------|
| **Aave V3 Core Ethereum** | High | $20.726M USDC, 99.52% of FRV; pool losses or utilization impair the principal liquid reserve venue |
| **Ondo rUSDY** | Low current size; expandable | $100.24K (0.48% of FRV), with $15M maximum strategy debt. Compliance/issuer/oracle/rate-limit/router failure can block redemption or impair value; Safe can change exchange |
| **Symbiotic** | Critical | 98.50% of accrued operator USDC debt mapped to Symbiotic; collateral/slashing failure undermines loan recovery |
| **EigenLayer** | Material | $843.6K / 1.50% of accrued operator debt through [`0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd`](https://etherscan.io/address/0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd), all against OETH |
| **Collateral tokens: Lombard LBTC, Lido wstETH, ether.fi weETH, Solv SolvBTC, Bedrock uniBTC, Origin OETH, Coinbase cbBTC** | Critical for credit recovery | Back 51.59% / 24.99% / 9.56% / 6.50% / 5.33% / 1.50% / 0.54% of operator debt. A wrapper depeg, redemption halt, or thin DEX depth reduces slashed-collateral proceeds. uniBTC is priced at BTC/USD and cannot reflect a depeg |
| **RedStone / Chainlink** | High | RedStone USDC primary feed and Chainlink backup via ChainlinkAdapter; Chainlink BTC/USD and ETH/USD feeds also value borrower collateral. Oracle mispricing changes cUSD mint/burn value and liquidation timing; staleness threshold has direct Safe control |
| **USDC / Circle** | Critical concentration | 100% of accounted reserves since the October 22 wWTGXX removal; freeze/depeg exposure propagates to cUSD and stcUSD |
| **LayerZero V2** | High | Pooled 6.763M stcUSD escrow, 9.77% of supply, for configured Katana/MegaETH/Tempo peers. Current release routes are 3-of-3; Safe can reconfigure endpoint security without an owner timelock |
| **Institutional operators / underwriters** | Critical | $56.035M principal is offchain credit; largest agent has 51.59% of accrued debt. Address-to-institution mapping is not independently established |
| **Morpho / Pendle** | No current reserve allocation | Morpho FRV strategies revoked/zero; Ethereum stcUSD markets are dust. All four indexed Ethereum Cap PTs are mature; $33.62K supply remains in associated Morpho markets, with no indexed unmatured replacement |

## Operational Risk

- **Team:** Cap Labs — Benjamin918 (CEO, ex-QiDAO $400M TVL) and the_weso (CTO, ex-Beefy Finance $1B+ TVL). Experienced DeFi founders but relatively small team
- **Funding:** $11M raised from tier-1 investors (Franklin Templeton, Kraken Ventures, a16z, Dragonfly, Blockchain Capital, Susquehanna). Strong institutional backing
- **Governance:** 3-of-5 multisig with anonymous signers and 24-hour timelock; separate 3-of-6 Timelock canceller. No governance token. Core upgrades are delayed; direct parameter and reserve-vault authority remain
- **Documentation:** Comprehensive documentation covering protocol mechanics, operator model, and security network. Contract source code verified on Etherscan
- **Legal:** [Published platform terms](https://docs.cap.app/resources/terms-and-conditions/platform-terms-of-use), revised March 26, 2025, identify **Covered Agents S.A. (Panama)** as the website/service operator, with broad liability limitations and individual arbitration. This is a published disclosure, not verification of current incorporation or a tokenholder repayment guarantee. **TODO:** private borrower/underwriter agreement terms and enforceability remain unavailable in the reviewed public sources.
- **Incident response:** Cap currently discloses an ongoing Sherlock bounty up to $1M. Direct emergency pause holders are enumerated above; incident-response effectiveness is not demonstrated by the absence of a confirmed exploit
- **Operator transparency:** Offchain yield strategies are opaque. While slashing provides recourse, users cannot independently verify operator positions

## Monitoring

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| stcUSD | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | `convertToAssets(1e18)`, `totalAssets`, `totalSupply`, ERC-1967 implementation |
| cUSD | [`0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC) | Supplies, borrows, balances, global/per-asset pauses, reserve floors, deposit caps, mint fees and insurance-fund issuance |
| USDC FRV | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | Queue, per-strategy current/max debt, revoked strategies, depositor-share conversion, `maxWithdraw`, role changes |
| wWTGXX FRV | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | Empty; alert on any new deposit, strategy debt, or Timelock `addAsset` re-listing wWTGXX |
| OndoHolder | [`0x9939009295eAD3c67259aF3b93C284079ffE931e`](https://etherscan.io/address/0x9939009295eAD3c67259aF3b93C284079ffE931e) | rUSDY balance, exchange changes, management, external redemption pause/compliance/rate limits |
| Lender / Delegation | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) / [`0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F`](https://etherscan.io/address/0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F) | Enumerate agents; principal versus interest-bearing debt, coverage, health, configured LTV/thresholds, liquidation start, network mapping, collateral asset |
| Agent Managers | [`0x08A728CF4E6b39f4AFa059c6eE376103722953eA`](https://etherscan.io/address/0x08A728CF4E6b39f4AFa059c6eE376103722953eA) / [`0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9`](https://etherscan.io/address/0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9) | `addAgent`, coverage-cap, and restaker-rate calls; new collateral types |
| Oracle | [`0xcD7f45566bc0E7303fB92A93969BB4D3f6e662bb`](https://etherscan.io/address/0xcD7f45566bc0E7303fB92A93969BB4D3f6e662bb) | Primary/backup data and staleness for reserve and collateral assets, especially LBTC and OETH |
| Governance | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) / [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) / [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | Exact owner set/threshold; full role grants/revokes, including the canceller Safe; 24h delay; queued operations, including the pending Stabledrop `recoverERC20`; selector-level direct authority; proxy upgrades |
| Reserve RoleManager | [`0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24`](https://etherscan.io/address/0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24) | Governance/management holders and each vault's direct role bitmap, especially Safe 16383 and deployer 6512 |
| LayerZero lockbox | [`0x983aeaaa0d0426839158435c43725ea7f45d4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) | Escrow/supply share, peer list, owner/delegate, per-route receive library/DVNs/confirmations, implementation |

### Critical Events to Monitor

- **Liquidity:** Alert when USDC outside operator principal falls below 10% of accounted USDC reserves (snapshot: 27.10%; 24.82% on October 13; 21.83% on October 5; 10.06% on October 3), or a 20% cUSD exit exceeds available backing liquidity. Aave withdraw liquidity and successful Ondo redemption need independent checks.
- **Operator concentration:** Largest current agent has 51.59% of accrued USDC debt against LBTC collateral at health 1.289. Monitor health below 1.25, all health below 1 immediately, LBTC/BTC price moves of more than 15%, and the ~$521 unhealthy residual position until it is closed. Also track borrowing by agents whose configured LTV is zero (the cbBTC agent).
- **Direct parameter changes:** New borrower onboarding and coverage caps, grace/expiry/bonus, agent LTV/liquidation thresholds, stale-price allowance, reserve floors, asset removal, fee whitelist, FRV strategy/debt/queue roles, and Ondo exchange can change without a Timelock proposal.
- **Concentrated holders:** Track `0x31b7d5a2b1ce1871dd642f6aecc0ef68d126b95a` (6.457M stcUSD), EOA `0x64471d103a7f77262529383d53bdd28b260b1ae8` (5.596M), and Ether.Fi Liquid USD (4.877M); together 24.46% of supply.
- **Mint/backing:** Watch for whitelist/oracle/implementation changes that allow economically unsupported issuance, and any Timelock `addAsset` adding a new reserve asset. Insurance-fund mint fees must reconcile to deposit value; with `minMintFee` at zero, any nonzero mint fee reflects a later Timelock change.
- **PPS / reserves:** Any PPS decrease, unexplained reserve-accounting discrepancy, or USDC depeg/freeze merits investigation.
- **Bridge:** Current remote→Ethereum release routes each require 3-of-3 DVNs. The three Ethereum receive and send routes were re-read at the October 27 block. The MegaETH and Tempo inbound receive routes are from October 13, and the remaining remote configurations are the October 3/4 reads. Monitor remote upgrades, Tempo issuer/admin/token replacement, every active route, and direct Safe delegate changes.
- **Upgrades:** cUSD current implementation [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97); stcUSD [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31); Access Control [`0x6681eb184c876d74ea3ddfae0ecee0c9c0f84bc1`](https://etherscan.io/address/0x6681eb184c876d74ea3ddfae0ecee0c9c0f84bc1). Verify source and audit coverage for each proposed replacement.

## Risk Summary

### Key Strengths

- Broad published audit coverage and an ongoing disclosed bounty; assessed core implementations are source-verified.
- Core upgrades, access escalation, reserve additions, and oracle adapter changes are protected by a 24-hour Timelock with fully enumerated administration and a separate 3-of-6 canceller.
- Supplies, credit principal, interest-bearing debts, strategy allocations, collateral coverage, and permission holders are inspectable onchain.
- The USDC buffer outside operator credit is 27.10% and covers a 20% cUSD exit; Aave withdrawal liquidity exceeds the strategy position. Reserves are now USDC only, so the WisdomTree fixed-price dependency has been removed. Borrower collateral is isolated by security network and priced by a Timelock-controlled oracle.

### Key Risks

- **Direct configuration authority:** 3-of-5 anonymous EOA owners control full FRV permissions, borrower onboarding, liquidation/LTV settings, oracle staleness, asset removal, fee whitelisting, and bridge endpoint delegation with no delay, outside the 24h Timelock that covers upgrades and role changes. The Safe used several of these powers between October 15 and 22. Governance is scored 2.0 on that Timelock, so these direct powers are carried here as residual risk.
- **Credit and collateral concentration:** 72.90% of USDC reserve accounting is operator principal. One borrower address represents 51.59% of accrued USDC debt, backed by LBTC at health 1.289; BTC wrappers back 63.95% of debt. Exits beyond the 27.10% buffer depend on repayment.
- **Holder concentration:** Three identified holders own 24.46% of stcUSD supply, about 88% of the USDC buffer in cUSD terms.
- **Reserve quality versus liquidity:** USDC is 100% of accounted backing; accounting includes loans rather than exclusively liquid holdings. Aave, issuer, and collateral recovery risks propagate to cUSD/stcUSD.
- **RWA gate:** Ondo's small current position has $15M debt authorization and externally controlled compliance/redemption dependencies. Full-position withdrawal succeeded in an October 3 fixed-block simulation; future redemption remains subject to those gates.
- **Small unhealthy borrower:** After a partial liquidation on October 25, ~$521 USDC of debt remains at health 0.0872. Full recovery is unresolved.
- **Bridge custody:** 9.77% of canonical supply is pooled LayerZero escrow for multiple peers, with mutable delegate-controlled verification settings.
- **Audit coverage gaps:** Deployed cUSD matches audited and bounty-pinned code plus the reviewed PR 273 delta. The February 2026 Minter refactor is not named in a published audit, and the OndoHolder strategy ($100K current debt, $15M maximum) is unaudited. Approximately 14.3 months of history does not establish stress-tested full-exit or collateral recovery performance.

### Critical Risks

- A sharp BTC/ETH drawdown, or an LBTC depeg, can push the largest borrower into liquidation. Correlated operator defaults or collateral impairment can then overwhelm realizable coverage, with only about a quarter of USDC reserves liquid.
- Safe compromise can immediately alter risk parameters/reserve deployment/bridge verification, and can replace core logic after 24 hours.

---

## Risk Score Assessment

**Scoring Guidelines:**

- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Source verification** — cUSD, stcUSD, Access Control, Lender, Oracle, Delegation, bridge lockbox, and security-network implementations are verified on Etherscan at the recorded implementation addresses; OndoHolder is verified. Implementations are unchanged at the October 27 block. ✅ PASS ([snapshot reads](https://etherscan.io/block/26114512))
- [x] **Audit coverage** — eight firms / eleven published reports; deployed cUSD fee and mint code traces to audited and bounty-pinned commits plus the reviewed PR 273 delta. OndoHolder is unaudited, at a small current allocation. ✅ PASS.
- [x] **Reserve verifiability** — accounting, custody/share conversions, debt, and coverage are inspectable. Operator strategies and RWA realization remain trust assumptions; no claim of exact liquid 1:1 backing. ✅ PASS with caveats.
- [x] **Governance** — 3-of-5 Safe with Timelock for core upgrades; direct configuration powers weaken protection but do not make control a single-EOA system. ✅ PASS.

No critical gate is triggered by the verified state. Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|------------|
| Audits / bounty | Eight firms, eleven public reports; deployed cUSD traces to audited/bounty-pinned code plus the PR 273 delta. Critical-only Sherlock bounty capped at $1M / 10% at risk. OndoHolder unaudited; February 2026 Minter refactor not named in a published scope |
| Production history | Approximately 14.3 months; 1–2-year rubric band |
| Scale | $201.78M DeFiLlama TVL, including collateral; 76.87M cUSD supply |
| Incidents / stress | No confirmed exploit established; a small unhealthy loan was partially liquidated but remains open; full-exit stress performance unresolved |

**Score: 2.0/5** — Audit subscore 2.0 (broad reputable coverage and disclosed $1M bounty, with current-code coverage uncertainty) and historical subscore 2.0 (over one year and TVL above $50M) average to 2.0. No longevity modifier applies before two years.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 2.0/5**

Every core upgrade and critical role change goes through one Timelock, [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab), with `getMinDelay() = 86400`. That is **24 hours, not 7 days**. The Timelock is the only holder of the `UPGRADE` role on cUSD, stcUSD, Lender, Oracle and Delegation, the only Access Control admin, and the owner of the LayerZero lockbox. Reserve additions, oracle adapters, caps and fees use the same 24h path. Since October 5, a separate 3-of-6 Safe can also cancel queued operations. A 24-48h delay on the path that changes the protocol fits rubric **Score 2**. Under this judgment, the anonymous 3-of-5 Safe and its immediate powers are scored as residual risk, not as a governance-score penalty.

**Residual risk: the Safe can act immediately, with no delay:**
- Add an arbitrary strategy to either reserve vault (FRV) and allocate the $20.83M USDC FRV to it, and repoint the Ondo exchange.
- Onboard new borrowers with unlimited coverage caps, as it did on October 7.
- Relax oracle staleness (`setStaleness`), which has no bound in source.
- Change liquidation and LTV parameters within source bounds, as it did when it cut the cbBTC agent's LTV to zero on October 15.
- Remove a zero-supply reserve asset and set fee exemptions, as it did for wWTGXX and four addresses on October 15–22.
- As LayerZero endpoint delegate, reconfigure verification for the 6.76M stcUSD escrow.

None of these can mint cUSD or upgrade core logic without the Timelock. They are also listed under Key Risks. This is a judgment call: a reviewer who weights the direct powers more heavily would score Governance 3.5–4.0 (Final 2.60–2.65, Medium).

**Subcategory B: Programmability — 2.5/5**

The two rubric columns diverge. On PPS/rate definition, ERC-4626 PPS, deposits, reserve accounting, credit/coverage, and permissionless liquidation are calculated onchain, which is row 1–2. On system operations, the system is hybrid (row 3): FRV allocation and liquidation parameters are admin-set, and operators' proprietary strategies are offchain. The midpoint is 2.5. The admin powers that change protocol risk outside approved bounds are scored under Governance rather than counted again here.

**Subcategory C: Dependencies — 3.0/5**

Aave is the principal liquid reserve venue, with no current Morpho strategy debt. Symbiotic, EigenLayer, RedStone/Chainlink, USDC, Ondo, and the LayerZero pooled escrow form material loss/availability paths. WisdomTree dropped out with the October 22 wWTGXX removal, but it was only 0.11% of backing, so the change is too small to move the subscore. Operator-loan recovery also depends on seven collateral tokens, led by Lombard LBTC at 51.59% of debt. These are collateral rather than reserve holdings, so they matter on borrower default and are weighed under Collateralization. The Ondo leg is small; the multiple-peer escrow is bounded by canonical locked tokens under current logic and is 9.77% of supply. These dependencies support a subscore of 3.0, without treating the measured DVNs as immutable.

**Centralization Score = (2.0 + 2.5 + 3.0) / 3 = 2.5**

**Score: 2.5/5** — Core upgrades and role changes sit behind a 24h Timelock with a separate canceller. The Safe's direct strategy, borrower-onboarding, oracle-staleness, and bridge-delegate authority remains a residual risk.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 2.5/5**

Reserve accounting is 100% USDC. **72.90%** of accounted USDC is operator principal, down from 89.94% on October 3 because of new deposits; outstanding credit rose only slightly. The largest borrower address represents **51.59%** of accrued debt, with 60% configured LTV, LBTC collateral, and health 1.289, down from 1.345 on October 5. Collateral is liquid BTC/ETH wrappers, enumerable and instantly slashable. Over-collateralization is about 1.6× for the largest loan, and more for most others. The small unhealthy position is not a demonstrated systemic loss. Concentrated offchain credit, single-asset concentration in LBTC, and externally realized RWA reserves still justify a subscore of 2.5. Accounting equality alone does not establish recoverable backing.

**Subcategory B: Provability — 2.5/5**

Debt and collateral data, Yearn depositor-share conversions, and ERC-4626 PPS are observable. Proprietary borrower positions, collateral sale proceeds in stress, and RWA recovery/compliance remain outside full onchain verification. Current reserve-accounting mismatch is quantified rather than asserted to be exactly zero.

**Funds Management Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5** — Concentrated covered credit, rather than a wholly liquid reserve, is the dominant backing risk.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 3.0/5** — The USDC outside operator principal is $20.83M, or 27.10% of USDC accounting. It covers a 20% cUSD exit ($15.37M) and the largest holder's full position (about $7.02M), and Aave reports $155.72M of withdrawal liquidity against its $20.73M position. The buffer was above 20% at the October 5, October 13, and October 27 blocks, and grew across them. The May 23 assessment recorded about $48.9M in the FRV against about $43.8M of operator loans. This places the October 3 reading of 10.06% as a low point rather than the norm. The score is unchanged at 3.0 from the merged May/July assessments.

It is not lower than 3.0:

- Operator credit, which is not callable on demand, backs 73% of USDC accounting, so a full exit of all holders has no established timeline.
- Three identified holders hold about $18.41M of cUSD value, 88% of the buffer.
- A permissionless redemption beyond the buffer reverts rather than queueing.
- The buffer fell to 10% as recently as October 3.
- Ondo compliance/redemption gates and negligible Ethereum Morpho collateral liquidity leave no measured secondary exit.

This fits the rubric's short-exit band for large holders, without asserting measured slippage. No drawdown-liquidity modifier is applied without withdrawal execution evidence.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Experienced DeFi founders (QiDAO, Beefy). Relatively small team |
| Funding | $11M from tier-1 investors including Franklin Templeton |
| Documentation | Comprehensive protocol docs |
| Legal | Published terms identify Covered Agents S.A. (Panama); private borrower/underwriter agreements and enforceability remain TODO |
| Incident response | Cap discloses up to $1M bounty; direct pause holders enumerated; production response effectiveness unresolved |
| Monitoring | Not publicly documented |

**Score: 2.0/5** — Experienced team with strong investor backing and comprehensive documentation. Private contractual protections and monitoring effectiveness are not established; published platform terms do not establish tokenholder recovery rights, and incident-response effectiveness remains unproven.

### Final Score Calculation

The category means are kept unrounded through weighting; the displayed final score is rounded down to two decimals under the scoring framework.

```
Final = ((2.0 + 2.5 + 3.0) / 3 × 0.30) + (2.5 × 0.30)
      + (2.0 × 0.20) + (3.0 × 0.15) + (2.0 × 0.05)
      = 0.75 + 0.75 + 0.40 + 0.45 + 0.10
      = 2.45/5.0
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 2.5 | 30% | 0.75 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.45/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.45/5.0) — Approved with standard monitoring**

The material risks are:

- direct (undelayed) Safe strategy, borrower-onboarding, oracle-staleness, bridge-delegate, and parameter authority, outside the 24h Timelock
- concentrated operator credit, with 52% of debt on LBTC collateral at health 1.289
- a USDC redemption buffer of 27.10% that fell to 10% as recently as October 3, against holders concentrated enough that three own 24% of supply
- RWA realization gates
- mutable bridge verification settings

Core upgrade timelocks with a separate canceller, source-bounded liquidation parameters, and inspectable collateral remain protections. Monitor borrower health/concentration, actual exit liquidity, and direct role/parameter changes alongside scheduled upgrades.

---

## Reassessment Triggers

- **Time:** Refresh within 60 days, by December 26, 2026.
- **TVL / supply:** More than ±25% change from $201.78M protocol TVL or 76.87M cUSD supply; exit of the `0x31b7d5a2b1ce1871dd642f6aecc0ef68d126b95a`, `0x64471d103a7f77262529383d53bdd28b260b1ae8`, or Ether.Fi Liquid USD stcUSD positions.
- **Liquidity:** Non-operator USDC availability below 20% of accounted reserves (the condition for the 3.0 liquidity score) or below 10% (critical); failed redemptions; Aave liquidity insufficient for the strategy position; Ondo redemption restrictions.
- **Credit:** Any material agent health below 1.25 (the largest is 1.289), LBTC depeg, any health below 1, larger borrower concentration, or unresolved unhealthy dust debt; confirm repayment/slashing recovery.
- **Governance:** Any Safe or canceller-Safe owner/threshold change, Timelock role change, new borrower onboarding, oracle primary/backup changes for collateral assets, selector role grant/revoke, direct FRV role change, liquidation/LTV/staleness modification, or deployment of a new reserve strategy.
- **Bridge:** Peer addition/removal, endpoint delegate change, DVN/library/confirmation changes, or escrow concentration above 25%; separately verify remote implementations and supply before claiming bidirectional security.
- **Upgrade / audit:** Any core/lockbox/security-network implementation change; OndoHolder debt above $1M without a published review.
- **Incident:** Exploit, oracle/depeg/freeze, collateral recovery failure, operator default, or security-network slashing incident.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [March 20, 2026](https://github.com/yearn/risk-score/pull/101) | 2.4 | Initial assessment |
| [May 23, 2026](https://github.com/yearn/risk-score/pull/214) | 2.4 | Reassessment: USDC Fractional Reserve rebalanced to 100% Morpho (Steakhouse + Gauntlet); Aave V3 leg drained; LayerZero stcUSD/Katana OFT integration documented |
| [July 31, 2026](https://github.com/yearn/risk-score/pull/369) | 2.39 | LayerZero OFT escrow figures corrected (~26.1M stcUSD escrowed, ~38% of ~68.3M supply); Dependencies score unchanged |
| [October 13, 2026](https://github.com/yearn/risk-score/pull/509) | 2.45 | Reassessment: Aave/Ondo reserve allocation, concentrated operator debt and LBTC-led collateral, direct Safe authority including borrower onboarding (Governance unchanged at 2.0: single 24h Timelock for upgrades and role changes, new 3-of-6 canceller, direct Safe powers listed as residual risk), USDC buffer above 20% at two snapshots (Liquidity unchanged at 3.0), Funds Management 2.3 → 2.5, Final 2.39 → 2.45, current implementations, full LayerZero peer mesh/mint controls, withdrawal simulations, and unhealthy-loan history; corrects May nested-Safe description; Low Risk |
| [October 27, 2026](https://github.com/yearn/risk-score/pull/555) | 2.45 | Reassessment: wWTGXX divested and removed (reserves now 100% USDC), minimum mint fee cut to zero via Timelock, pending Stabledrop cUSD recovery, cbBTC agent LTV set to zero after borrowing, dust borrower partially liquidated, USDC buffer 27.10%, three holders at 24.46% of supply, escrow 9.77%; implementations and governance unchanged; all scores unchanged; Low Risk |
