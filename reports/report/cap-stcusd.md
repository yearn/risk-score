# Protocol Risk Assessment: Cap — stcUSD

- **Assessment Date:** March 20, 2026 (Updated: July 26, 2026)
- **Token:** stcUSD (Staked cap USD)
- **Chain:** Ethereum
- **Token Address:** [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- **Final Score: 2.9/5.0**
- **Current Snapshot:** Ethereum block 25,616,609 (July 26, 2026, 11:16:59 UTC)

## Overview + Links

stcUSD is a **yield-bearing ERC-4626 vault token** issued by Cap (Covered Agent Protocol). Users stake cUSD (Cap's dollar-pegged stablecoin) to receive stcUSD, which auto-compounds yield from two sources: (1) **fractional reserve deployment** of idle cUSD reserves to Morpho, and (2) **operator borrowing fees** from institutional market makers (IMC Trading, Edge Capital, Susquehanna Crypto) who borrow reserve capital for proprietary yield strategies secured by Symbiotic or EigenLayer collateral.

**Key architecture:**

- **cUSD:** Dollar-pegged stablecoin backed 1:1 by whitelisted reserve assets. Currently **2 assets accepted onchain**: USDC (~93% of reserves) and wWTGXX/WisdomTree Government Money Market Digital Fund (~7%). Max 40% single-asset concentration rule exists but is not binding given current composition. Users mint by depositing reserves and burn/redeem to withdraw
- **stcUSD:** ERC-4626 vault wrapping cUSD. Yield accrues via exchange rate appreciation. Its 68.42M cUSD of `totalAssets()` represents ~91.5% of cUSD supply
- **Fractional Reserve:** ~$24.28M USDC deployed via the USDC Fractional Reserve Vault (a Yearn V3 vault) — nearly all in **Morpho Steakhouse Prime USDC** (~$23.62M, 97.3%), with a residual position in **Morpho Gauntlet USDC Prime** (~$0.63M, 2.6%). The Aave V3 USDC Lender strategy remains wired in the default queue but has been fully drained (current debt ≈ 0, max debt = 0). An additional ~$5.10M wWTGXX is held in a separate Fractional Reserve Vault via a simple holder strategy
- **Operator Model:** Institutional operators borrow reserves at a dynamic hurdle rate (~5.2% avg over 90 days), execute offchain/proprietary strategies (HFT, private credit, arbitrage, MEV), and return principal + hurdle rate. Excess yield is split between operators and restakers
- **Security Networks:** Operator loans are covered through per-agent Symbiotic vaults or EigenLayer operator allocations. Live collateral includes wstETH, WBTC, weETH, OETH, uniBTC, SolvBTC, LBTC, and XAUM. If an operator becomes unhealthy, liquidators repay USDC debt in exchange for slashed collateral
- **Governance:** 3-of-5 Gnosis Safe multisig → 24-hour TimelockController → Access Control system. All contracts are upgradeable proxies

**Key metrics (verified onchain July 26, 2026):**

- **cUSD Total Supply:** ~74,814,821 cUSD
- **stcUSD Total Supply:** ~63,800,462 stcUSD
- **stcUSD Total Assets:** ~68,420,131 cUSD
- **Price Per Share:** ~1.0724 cUSD/stcUSD (~7.2% cumulative appreciation since launch)
- **cUSD Reserves:** ~69.72M USDC + ~5.10M wWTGXX (within ~0.0014% of total supply at the snapshot)
- **Operator USDC Debt:** ~$45.44M outstanding
- **Available USDC in Fractional Reserve:** ~$24.28M (= 69.72M reserves − 45.44M operator debt)
  - **Morpho Steakhouse Prime USDC:** ~$23.62M (97.3% of FRV)
  - **Morpho Gauntlet USDC Prime:** ~$0.63M (2.6% of FRV)
  - **Aave V3 USDC Lender:** ~$0 (deactivated; 0 max debt)
- **Fractional Reserve wWTGXX:** ~$5.10M wWTGXX
- **Protocol TVL (DeFi Llama, Ethereum):** ~$253M (includes restaker collateral); **Peak TVL ~$484M on Jan 28, 2026**
- **Minting Fee:** 0.10%
- **Launch Date:** August 19, 2025 (~11 months in production)

**Links:**

- [Cap Documentation](https://docs.cap.app/)
- [Cap stcUSD Mechanics](https://docs.cap.app/protocol-overview/stcusd-mechanics)
- [Cap cUSD Mechanics](https://docs.cap.app/overview/protocol-overview)
- [Cap Audits](https://docs.cap.app/resources/audits)
- [DeFi Llama: Cap](https://defillama.com/protocol/cap)
- [Aave Blog: Cap Integration](https://aave.com/blog/cap)

## Contract Addresses

### Core Cap Contracts

| Contract | Address | Type |
|----------|---------|------|
| cUSD | [`0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC) | ERC-20, upgradeable proxy (impl: [`0xa76645e15c267b876999bf7689e0b2c1ee29bfe6`](https://etherscan.io/address/0xa76645e15c267b876999bf7689e0b2c1ee29bfe6)) |
| stcUSD | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | ERC-4626 vault, upgradeable proxy (impl: [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31)) |
| Debt USDC | [`0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9`](https://etherscan.io/address/0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9) | Tracks operator borrowings |

### Infrastructure Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| Oracle | [`0xcD7f45566bc0E7303fB92A93969BB4D3f6e662bb`](https://etherscan.io/address/0xcD7f45566bc0E7303fB92A93969BB4D3f6e662bb) | Price oracle for reserve assets |
| Lender | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) | Operator borrowing/repayment engine |
| Access Control | [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | Role-based permission system (upgradeable proxy) |
| Delegation | [`0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F`](https://etherscan.io/address/0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F) | Routes operator collateral coverage through Symbiotic or EigenLayer |
| Fee Auction | [`0xa1a20aBdc873CF291c22Ce3C8968EC06277324D0`](https://etherscan.io/address/0xa1a20aBdc873CF291c22Ce3C8968EC06277324D0) | Dutch auction for fee conversion |
| Fee Receiver | [`0x0036c7b9b62c53F47c804a5643F0c09f864beF0b`](https://etherscan.io/address/0x0036c7b9b62c53F47c804a5643F0c09f864beF0b) | Collects protocol fees |
| USDC Fractional Reserve Vault | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | Yearn V3 vault — deploys USDC to Morpho (Steakhouse ~97% + Gauntlet ~3%). Aave V3 leg in queue but deactivated |
| wWTGXX Fractional Reserve Vault | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | Yearn V3 vault — holds wWTGXX (~$5M) via holder strategy |
| cUSD Adapter | [`0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf`](https://etherscan.io/address/0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf) | cUSD integration adapter |
| stcUSD Adapter | [`0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0`](https://etherscan.io/address/0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0) | stcUSD integration adapter |

### Governance Contracts

All values in this table verified via `eth_call` on July 26, 2026.

| Contract | Address | Configuration |
|----------|---------|---------------|
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | OZ TimelockController. `getMinDelay() = 86400` (24h). Holds the sole DEFAULT_ADMIN_ROLE on Access Control (enumerated: 1 holder = this Timelock) |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Gnosis Safe v1.4.1, threshold = 3, 5 owners. `hasRole` confirms PROPOSER_ROLE, EXECUTOR_ROLE, and CANCELLER_ROLE on the Timelock. Owners are anonymous: `0xDD30a4712e6B34926d4f5aA99c1881573407538C`, `0xdf466Fa3ddd0042d990FA9A023e040884CBaD439`, `0x7c29F6A93df60Bcd3B20f03B57a2F9e698FD4128`, `0x62D0b3c0a77bE77EaB2060266a95FfaD9e6A3F51`, `0xA62f87A9D4B5EE1F83cb644Ea076832A396101b8` |
| Deployer EOA | [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52) | `hasRole` returns true only for EXECUTOR_ROLE on Timelock — PROPOSER, CANCELLER, and DEFAULT_ADMIN are all false. Residual permission from deployment, not revoked as of July 26, 2026 |

### Symbiotic Integration

| Contract | Address | Purpose |
|----------|---------|---------|
| Network | [`0x98e52Ea7578F2088c152E81b17A9a459bF089f2a`](https://etherscan.io/address/0x98e52Ea7578F2088c152E81b17A9a459bF089f2a) | Cap's Symbiotic network registration |
| Network Middleware | [`0x09A3976d8D63728d20DCDFEe1e531C206Ba91225`](https://etherscan.io/address/0x09A3976d8D63728d20DCDFEe1e531C206Ba91225) | Slashing/reward logic |
| Vault Factory | [`0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e`](https://etherscan.io/address/0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e) | Deploys per-operator Symbiotic vaults |
| Agent Manager | [`0x08A728CF4E6b39f4AFa059c6eE376103722953eA`](https://etherscan.io/address/0x08A728CF4E6b39f4AFa059c6eE376103722953eA) | Manages operator-vault whitelisting |

### EigenLayer Integration

| Contract | Address | Purpose |
|----------|---------|---------|
| Eigen Service Manager | [`0xe65c3eccd18879e103dbc96d854e376ced4cc7dd`](https://etherscan.io/address/0xe65c3eccd18879e103dbc96d854e376ced4cc7dd) | Active collateral network for five OETH-backed operator positions; creates distinct EigenLayer operator allocations and handles slashing |

### Oracles

| Contract | Address | Purpose |
|----------|---------|---------|
| Redstone cUSD | [`0x9A5a3c3Ed0361505cC1D4e824B3854De5724434A`](https://etherscan.io/address/0x9A5a3c3Ed0361505cC1D4e824B3854De5724434A) | cUSD price feed (0.05% deviation threshold) |
| Morpho stcUSD | [`0x8E3386B2f6084eB1B0988070c3d826995BD175c0`](https://etherscan.io/address/0x8E3386B2f6084eB1B0988070c3d826995BD175c0) | stcUSD price feed for Morpho markets |

### Morpho Markets (stcUSD / PT-stcUSD / PT-cUSD as collateral)

Sourced from the [Morpho Blue API](https://api.morpho.org/graphql) on July 26, 2026. Cap-collateral markets total ~$2.02M of supply across Ethereum and Katana.

| Market | Chain | Collateral | Loan Token | LLTV | Supply TVL | Utilization |
|--------|-------|-----------|------------|------|-----------|-------------|
| stcUSD / USDT | Ethereum | stcUSD | USDT | 91.5% | ~$0.94M | ~0% |
| stcUSD / vbUSDC | Katana | stcUSD | vbUSDC | 86.0% | ~$0.89M | ~91% |
| PT-cUSD-23JUL2026 / USDT | Ethereum | PT-cUSD (Pendle) | USDT | 91.5% | ~$0.17M | ~93% |
| PT-cUSD-29JAN2026 / USDC | Ethereum | PT-cUSD (Pendle) | USDC | 91.5% | ~$0.014M | ~58% |
| stcUSD / USDC | Ethereum | stcUSD | USDC | 91.5% | ~$0.006M | ~8% |

Remaining stcUSD, PT-cUSD, and PT-stcUSD markets (AUSD pairs, matured PT series, mismatched-LLTV duplicates) each hold under $200 of supply. At ~$2.02M total, Morpho is a minor venue for stcUSD collateral utility; its material role for Cap is as the reserve-deployment venue described under Funds Management.

## Audits and Due Diligence Disclosures

### Cap Protocol Audits

Cap has been audited by **8 firms** with **9 total reports** (including PR / incremental reviews), covering the core protocol, security network, and invariant testing. One new incremental audit (Octane) has been added since the March 2026 assessment:

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
| [Octane](https://github.com/cap-labs-dev/cap-audits/blob/main/2026-03-24-Octane.pdf) | Mar 2026 | Token audit (incremental) | PDF |

**Note:** Finding severity breakdowns are not publicly summarized. The audit PDFs are available in the [cap-audits repository](https://github.com/cap-labs-dev/cap-audits).

### Bug Bounty

- **Sherlock Bug Bounty:** Active since October 24, 2025. Max payout: **$1,000,000 USDC** (10% of funds at risk). Critical severity only. Coded PoC required. Core contracts in scope include AccessControl, Delegation, FeeAuction, Oracle, Lender, Vault, FractionalReserve, and Minter
  - Link: https://audits.sherlock.xyz/bug-bounties/114
- **Immunefi:** Not listed
- **Safe Harbor:** Cap is not listed on the SEAL Safe Harbor registry

### On-Chain Complexity

The Cap system is **high complexity**:

- **Multi-contract architecture:** 10+ core contracts (cUSD, stcUSD, Lender, Oracle, Access Control, Delegation, Fee Auction, Fee Receiver, Fractional Reserve, Adapters)
- **Upgradeable proxies:** cUSD, stcUSD, and Access Control are ERC-1967 upgradeable proxies (proxy admin set to address(0), upgrades via Access Control roles through Timelock)
- **Collateral-network integration:** Per-agent Symbiotic vaults and EigenLayer operator allocations, with network-specific slashing and reward logic
- **Operator model:** Offchain yield generation by institutional counterparties, onchain borrowing/repayment/liquidation
- **Multi-oracle system:** RedStone price feeds with staleness checks, Morpho oracle adapters
- **Cross-protocol dependencies:** Morpho, Symbiotic, EigenLayer, RedStone, LayerZero, and the protocols issuing the live operator-collateral tokens

## Historical Track Record

- **Launch date:** August 19, 2025 — **~11 months** in production
- **cUSD supply:** ~74.81M cUSD
- **stcUSD supply:** ~63.80M shares representing ~68.42M cUSD assets (**91.5% staking ratio**)
- **stcUSD PPS:** 1.0000 → 1.0724 (July 26, 2026) — ~7.2% cumulative since launch; PPS has not decreased
- **Security incidents:** None known
- **Peak TVL:** ~$484M on January 28, 2026 (DeFi Llama)
- **Current TVL:** ~$253M (July 26, 2026, includes restaker collateral)
- **Active redemption trend:** cUSD supply contracted from ~77.66M (July 22) to ~73.50M (July 26), and [DeFi Llama](https://defillama.com/protocol/cap) TVL from ~$264.9M to ~$252.5M over the same five days — roughly 1.4%/day of net outflow. At that pace the ~$24.28M liquid FRV buffer, against ~$45.44M lent to operators on epoch-based repayment, is the binding constraint on redemption capacity
- **Protocol age:** ~11 months in production — launched August 2025, first audit February 2025

**Team track record:**

- **Benjamin918 (CEO):** Previously scaled QiDAO from $0 to $400M TVL
- **the_weso (CTO):** Founding member of Beefy Finance (peaked at $1B+ TVL)

**Funding:** $11M across pre-seed and seed financing, plus a $1.1M community round on Echo. Investors include Franklin Templeton, Kraken Ventures, Blockchain Capital, a16z crypto, Dragonfly, Lightspeed Faction, Susquehanna (SIG), Nomura's Laser Digital, GSR, Robot Ventures, and others.

## Funds Management

### Yield Generation

stcUSD earns yield from two primary sources:

**1. Fractional Reserve Deployment**

Idle cUSD reserves are deployed via two Yearn V3 Fractional Reserve Vaults. Strategy queue and per-strategy `totalAssets()` verified onchain on July 26, 2026:

- **USDC FRV** ([`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072)): ~$24.28M USDC total assets. Default queue contains three strategies:
  - [Morpho Steakhouse Prime USDC Compounder](https://etherscan.io/address/0xBAed9839573d349e42DFbF23a8916e5AB9cAf2E3) — ~$23.62M (97.3% of FRV). Underlying MetaMorpho vault [`0xbeef088055857739C12CD3765F20b7679Def0f51`](https://etherscan.io/address/0xbeef088055857739C12CD3765F20b7679Def0f51) ("Steakhouse Prime USDC")
  - [Morpho Gauntlet USDC Prime Compounder](https://etherscan.io/address/0x8092C20351CF4048B464DF2144Dc8a4DD49ce71D) — ~$0.63M (2.6% of FRV). Underlying MetaMorpho vault [`0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0`](https://etherscan.io/address/0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0) ("Gauntlet USDC Prime")
  - [Aave V3 USDC Lender](https://etherscan.io/address/0x7D7F72d393F242DA6e22D3b970491C06742984Ff) — **~$0 (deactivated)**. `strategies[strat].max_debt = 0` and current debt is 0. Still wired into the default queue but receives no new allocation
- **wWTGXX FRV** ([`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8)): ~$5.10M wWTGXX held via "Holder wWGTXX" strategy ([`0xB0D399E8A11E1c6df00E1Fb5698936B5614e9259`](https://etherscan.io/address/0xB0D399E8A11E1c6df00E1Fb5698936B5614e9259)). wWTGXX is itself a yield-bearing WisdomTree Government Money Market fund token ([`0x434558CB1EBe9950e8A66f1ef8A15A473Dce7D8c`](https://etherscan.io/address/0x434558CB1EBe9950e8A66f1ef8A15A473Dce7D8c))

**Concentration note:** **97.3% of deployed USDC reserves sit in a single MetaMorpho vault (Steakhouse Prime)**, with the Gauntlet Prime leg drained to a $0.63M residual and the Aave V3 leg deactivated. The FRV is therefore exposed almost entirely to one curator's vault management and Morpho Blue market selection, with no curator-level or protocol-level diversification.

**2. Operator Borrowing Fees (~10% of yield)**

Institutional operators borrow reserve capital at a **dynamic hurdle rate** (~5.2% average over 90 days). The hurdle rate is a function of:
- **Market rate:** Benchmarked against Aave USDC supply rate (competitive floor)
- **Utilization rate:** Piecewise linear adjustment that escalates sharply at high utilization

Operators generate yield through proprietary strategies: HFT, private credit, cross-market arbitrage, MEV capture, funding rate arbitrage, and token farming. Named operators include **IMC Trading**, **Edge Capital**, and **Susquehanna Crypto**.

**Yield distribution (example with 15% operator yield, 8% hurdle rate):**
- 8% flows to stcUSD holders (hurdle rate)
- 2% goes to restakers (negotiated premium)
- 5% remains as operator profit

### Collateralization

Backing and operator coverage were verified at Ethereum block 25,616,609 using `Vault.totalSupplies(asset)`, `Vault.totalBorrows(asset)`, `Delegation.agents()`, `Delegation.collateral(agent)`, and `Lender.agent(agent)`:

- **cUSD reserves:** Backed by 2 whitelisted assets onchain: **USDC** (~$69.72M, 93.2%) and **wWTGXX** (~$5.10M, 6.8%). Their nominal sum was within ~$1,034 (about 0.0014%) of cUSD total supply at the snapshot, closely reconciling but not exactly equaling it. USDC still dominates and the 40% single-asset concentration cap is not binding
- **Reserve deployment:** USDC FRV holds ~$24.28M (Morpho Steakhouse ~$23.62M + Morpho Gauntlet ~$0.63M; Aave V3 leg drained). ~$45.44M of USDC reserves are lent to operators (`Vault.totalBorrows(USDC)`). wWTGXX FRV holds ~$5.10M via holder strategy
- **Operator collateralization:** 19 agents had non-zero debt. Configured initial LTVs ranged from 50% to 65%, with an 80% liquidation threshold. Coverage is provided through Symbiotic for 14 positions and distinct EigenLayer allocations for 5 OETH-backed positions; no reused allocation was identified
- **Liquidation:** A caller must open liquidation when Health Factor < 1.0; it is not automatic. The process normally has a 12-hour grace period followed by a 3-day liquidation window. Liquidation bonus is capped at 10%, with a 125% target health ratio
- **Slashing:** Instant slashing on two objective fault conditions: (1) failure to return expected amount, (2) insufficient active delegation. No governance intervention needed

#### Operator Collateral in Active Use

`Vault.totalBorrows(USDC)` was $45.44M. Summing the 19 live `Lender.agent()` debt values, including accrued restaker interest not yet fully reflected in the vault borrow ledger, produced ~$45.47M:

| Collateral | Coverage network | Operator debt secured | Share of live agent debt | Dependency note |
|------------|------------------|----------------------:|-------------------------:|-----------------|
| [uniBTC](https://etherscan.io/token/0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568) | Symbiotic | ~$18.35M | 40.35% | Bedrock-issued BTC representation; largest collateral dependency |
| [wstETH](https://etherscan.io/token/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | Symbiotic | ~$7.48M | 16.45% | Lido liquid-staking token |
| [LBTC](https://etherscan.io/token/0x8236a87084f8B84306f72007F36F2618A5634494) | Symbiotic | ~$7.01M | 15.41% | Lombard-issued BTC representation |
| [weETH](https://etherscan.io/token/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee) | Symbiotic | ~$6.90M | 15.18% | Ether.fi liquid-restaking token |
| [SolvBTC](https://etherscan.io/token/0x7A56E1C57C7475CCf742a1832B028F0456652F97) | Symbiotic | ~$4.60M | 10.12% | Solv-issued BTC representation |
| [OETH](https://etherscan.io/token/0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3) | EigenLayer | ~$1.02M | 2.24% | Origin Ether; five distinct EigenLayer operator allocations |
| [XAUM](https://etherscan.io/token/0x2103E845C5E135493Bb6c2A4f0B8651956eA8682) | Symbiotic | ~$0.11M | 0.24% | Matrixdock tokenized-gold RWA |
| [WBTC](https://etherscan.io/token/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | Symbiotic | ~$108 | <0.01% | Dust debt position |

The collateral stack introduces direct Bedrock, Lido, Lombard, Ether.fi, Solv, Origin, Matrixdock, Symbiotic, EigenLayer, and collateral-oracle dependencies. A collateral-token depeg, issuer/custody failure, oracle mispricing, or slashing-path failure can reduce recovery on the operator loans even when the operator's offchain strategy is otherwise solvent.

**Unhealthy dust position:** Agent [`0x77df…c1da`](https://etherscan.io/address/0x77df7B5aBF875894Ffb1443Fd2840b603d3AC1DA) had ~$680.93 of USDC debt against ~$106.33 of wstETH coverage (current LTV ~640%, health factor ~0.125). `maxLiquidatable` covered the full debt, but `liquidationStart = 0` at the snapshot block. The amount is immaterial to system solvency, but it demonstrates that the collateralization guarantee is enforced through permissionless liquidation rather than ensuring every live position remains over-collateralized at all times.

### Accessibility

- **Deposits:** Permissionless — deposit cUSD to receive stcUSD (ERC-4626 standard)
- **Withdrawals:** ERC-4626 standard. Redeem stcUSD for cUSD
- **cUSD minting:** Deposit whitelisted reserve assets at oracle price with 0.10% minting fee
- **cUSD burning:** Receive a single reserve asset at oracle price with dynamic fee
- **cUSD redemption:** Receive proportional basket of all underlying assets with fixed fee (lower than burn fee)
- **Restaker withdrawal delay:** Up to 14 days (epoch-based: 7-day epochs)

### Token Mint Authority

The current Vault implementation is [`0xa76645e15c267b876999bf7689e0b2c1ee29bfe6`](https://etherscan.io/address/0xa76645e15c267b876999bf7689e0b2c1ee29bfe6) and the stcUSD implementation is [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31). Cap does **not** implement a privileged `MINTER_ROLE` on either token — both mint paths are permissionless and require collateral in the same transaction.

**Mint mechanism:**

- **stcUSD** ([`0x88887bE…D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)): standard ERC-4626 (`ERC4626Upgradeable`). Anyone with cUSD can call `deposit()` / `mint()` and receive stcUSD. No access check on the mint path.
- **cUSD** ([`0xcCcc62…cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC)): `Vault.mint(asset, amountIn, minAmountOut, receiver, deadline)` is `external whenNotPaused`. Anyone can mint cUSD by depositing a whitelisted reserve asset; the asset whitelist is gated by `vault_config_admin` behind the 24-hour Timelock.

**Mint requires backing:** Yes — atomic in both directions. cUSD mints only against a reserve transferIn in the same call (`_mint(asset, amountIn, amountOut, receiver)` is invoked after the transfer); stcUSD mints only against a cUSD transferIn via ERC-4626.

**Per-address mint authority:**

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any caller of stcUSD `deposit()` / `mint()` | ✓ | ✓ | Permissionless ERC-4626 | Atomic against cUSD |
| Any caller of cUSD `Vault.mint()` | ✓ | ✓ | Permissionless, asset-whitelisted | Atomic against whitelisted reserve (currently USDC / wWTGXX) |

**Rate limits / supply caps:** Per-asset `getRemainingMintCapacity(asset)` cap, set by `vault_config_admin`. Pause is held by `emergency_admin` and disables both mint and burn. No global supply cap.

**Backing check at mint time:** Atomic. There is no path for the multisig, timelock, or any role-holder to mint cUSD or stcUSD without a corresponding reserve / cUSD inflow. The trust surface is the **asset whitelist** (controlled by `vault_config_admin` via 24h Timelock) and **oracle pricing** (controlled by `oracle_admin` via 24h Timelock — `RedStone` price feeds determine the mint exchange rate). A compromised oracle could let an attacker mint cUSD at the wrong price; a compromised whitelist could add a worthless asset as a reserve. Neither would let the protocol mint unbacked cUSD outright.

### Provability

- **stcUSD exchange rate:** Onchain ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic
- **Reserve composition:** Onchain — reserve assets held in the vault contracts are verifiable
- **Fractional reserve positions:** Onchain — Morpho vault share balances verifiable
- **Operator positions:** Partially onchain — borrowing/repayment recorded onchain, but operators' actual yield strategies are offchain and opaque
- **Slashing conditions:** Onchain verifiable — objective fault conditions, no governance discretion

## Liquidity Risk

- **Primary exit for stcUSD:** Redeem stcUSD for cUSD via ERC-4626 `withdraw()`/`redeem()`. Then burn/redeem cUSD for underlying reserves
- **cUSD exit mechanisms:** Burn (receive single asset at oracle price, dynamic fee) or Redeem (receive proportional basket, fixed fee). The redemption mechanism is designed to prevent "last man standing" scenarios
- **Morpho liquidity dependency:** ~$24.28M of available USDC reserves sit almost entirely in a single MetaMorpho vault (Steakhouse Prime $23.62M; Gauntlet nearly empty at $0.63M). Withdrawal depends on idle USDC + Morpho market liquidity. The Aave V3 leg remains deactivated, leaving no secondary liquidity venue
- **Morpho markets (stcUSD as collateral):** Top markets as of May 2026 snapshot were USDT/stcUSD (~$16.6M @ 70% util) and USDC/stcUSD (~$8.9M @ 91% util). Pendle PT-cUSD / PT-stcUSD markets add ~$1.4M. Current market data not refreshed for this reassessment — treat values as directional
- **No DEX liquidity pool required** — exit is via protocol's own mint/burn/redeem mechanism
- **Restaker withdrawal:** Up to 14-day delay creates a potential friction point for operators needing to return capital
- **Deposit/withdrawal:** Permissionless, no lock period for stcUSD stakers

## Centralization & Control Risks

### Governance

Cap's governance flows through a **3-of-5 Gnosis Safe multisig** → **24-hour TimelockController** → **Access Control** system.

**Governance hierarchy:**

| Position | Address | Configuration |
|----------|---------|---------------|
| **Multisig** | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | 3-of-5 Gnosis Safe v1.4.1. PROPOSER + EXECUTOR + CANCELLER on Timelock |
| **Timelock** | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | 24-hour minimum delay. Holds DEFAULT_ADMIN_ROLE on Access Control |
| **Deployer EOA** | [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52) | Retains EXECUTOR_ROLE on Timelock (residual, never revoked) |

**Governance concerns:**
1. **Low multisig threshold:** 3-of-5 is a relatively low threshold. Two dormant owners and one nested 1-of-2 Safe weaken the effective security
2. **No public signer disclosure:** Unlike Yearn (named, prominent DeFi signers), Cap's multisig owners are anonymous
3. **Deployer EOA retains EXECUTOR_ROLE:** While it cannot propose or cancel, it can execute already-queued Timelock proposals — a residual permission from deployment that was never revoked
4. **Upgradeable contracts:** cUSD, stcUSD, and Access Control are all upgradeable proxies. The upgrade path goes through the Timelock (24h delay), but the multisig can upgrade core token contracts

### Programmability

| Factor | Assessment |
|--------|-----------|
| stcUSD PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless staking/unstaking onchain |
| Reserve deployment | Automated via Fractional Reserve Vault to Morpho |
| Operator strategies | **Offchain** — operators execute proprietary strategies. Borrowing/repayment recorded onchain, but actual yield generation is opaque |
| Hurdle rate | Onchain — dynamic function of market rate + utilization |
| Slashing | Onchain — objective fault conditions, permissionless liquidation |

**Programmability is mixed:** Core vault mechanics (staking, PPS, reserve deployment, slashing) are fully onchain. However, the operator yield generation — which represents a portion of stcUSD yield — is offchain and opaque.

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Morpho (Steakhouse Prime)** | Critical | **~$23.62M USDC** — 97.3% of the deployed USDC FRV is now in Steakhouse Prime (Gauntlet nearly fully drained at $0.63M). Also the venue for stcUSD collateral markets. A Morpho Blue protocol incident or Steakhouse curator failure would impair reserve liquidity and stcUSD collateral utility |
| **Aave V3 Core Ethereum** | Low | Strategy still wired into the FRV default queue but `max_debt = 0` and current debt is 0; effectively unused |
| **Symbiotic** | Critical | Primary slashing network for 14 live debt positions; its vault, middleware, and liquidation paths secure most operator loans |
| **EigenLayer** | High | Active slashing network for five OETH-backed positions securing ~$1.02M of operator debt |
| **Operator collateral issuers** | Critical | ~$45.47M of agent debt depends on wstETH/Lido, uniBTC/Bedrock, LBTC/Lombard, weETH/Ether.fi, SolvBTC/Solv, OETH/Origin, XAUM/Matrixdock, and WBTC retaining value and remaining slashable. uniBTC alone secures 40.35% |
| **RedStone** | High | cUSD price oracle (0.05% deviation threshold). Stale prices disable minting/burning |
| **wWTGXX (WisdomTree)** | Low | ~$5.10M tokenized gov money market fund. Minimal DeFi adoption and few holders |
| **USDC (Circle)** | High | Primary reserve asset (~93% of cUSD backing, ~$69.72M in reserves) |
| **LayerZero V2** | High | The Ethereum OFT Adapter [`0x983a…4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) escrows 26,143,963 stcUSD, **40.98% of the 63.80M supply**, backing the native Katana OFT. The adapter cannot mint canonical stcUSD, so compromise risk is bounded by the remote supply and locked collateral |
| **USDT, pyUSD, BENJI, BUIDL** | Low | Listed in docs as potential reserve assets but **not currently whitelisted onchain** (`Vault.assets()` returns only USDC and wWTGXX) |
| **Institutional Operators** | High | IMC Trading, Edge Capital, Susquehanna Crypto generate yield via offchain strategies. Counterparty risk is mitigated, but not eliminated, by Symbiotic or EigenLayer collateral |

## Operational Risk

- **Team:** Cap Labs — Benjamin918 (CEO, ex-QiDAO $400M TVL) and the_weso (CTO, ex-Beefy Finance $1B+ TVL). Experienced DeFi founders but relatively small team
- **Funding:** $11M institutional financing plus a $1.1M community round, with investors including Franklin Templeton, Kraken Ventures, a16z, Dragonfly, Blockchain Capital, and Susquehanna
- **Governance:** 3-of-5 multisig with anonymous signers and 24-hour timelock. No governance token. Protocol described as designed to "run autonomously via economic incentives"
- **Documentation:** Comprehensive documentation covering protocol mechanics, operator model, and security network. Contract source code verified on Etherscan
- **Legal:** No disclosed legal entity structure. Relies on operators being "regulated financial institutions" with legal agreements with restakers
- **Incident response:** No incidents to date. $1M Sherlock bug bounty provides responsible disclosure channel. Emergency admin role can pause/unpause protocol
- **Operator transparency:** Offchain yield strategies are opaque. While slashing provides recourse, users cannot independently verify operator positions

## Monitoring

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| stcUSD Vault | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalSupply()` |
| cUSD Token | [`0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC) | `totalSupply()`, `totalSupplies(asset)`, `totalBorrows(asset)`, `paused()`, Mint/Burn events |
| USDC Fractional Reserve | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | `totalAssets()`, `get_default_queue()`, per-strategy `totalAssets()` (esp. Steakhouse vs. Gauntlet share, Aave V3 re-activation) |
| wWTGXX Fractional Reserve | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | `totalAssets()` — wWTGXX holdings |
| Debt USDC | [`0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9`](https://etherscan.io/address/0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9) | `totalSupply()` — tracks outstanding operator debt |
| Lender | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) | For every `Delegation.agents()` entry: `agent()`, `debt()`, `maxLiquidatable()`, `liquidationStart()` |
| Delegation | [`0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F`](https://etherscan.io/address/0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F) | `agents()`, `collateral(agent)`, `networks(agent)`, `coverage(agent)`, `slashableCollateral(agent)`, configured LTVs and coverage caps |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Signer/threshold changes, submitted transactions |
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | `getMinDelay()`, scheduled/executed transactions, role changes |
| Access Control | [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | `RoleGranted` / `RoleRevoked` events, `getRoleMember(DEFAULT_ADMIN_ROLE, 0)`, implementation upgrades (ERC-1967 impl slot) |

### Critical Events to Monitor

- **stcUSD PPS decrease** — any decrease in `convertToAssets(1e18)` indicates a loss event
- **cUSD supply changes** — large mint/burn events may indicate reserve stress
- **Operator liquidations** — Lender contract liquidation events indicate operator defaults
- **Operator health and collateral changes** — alert on any `agent()` health below 1, any collateral/network change, and any position whose debt exceeds current slashable collateral. The unhealthy dust agent identified in this snapshot should remain monitored until repaid or liquidated
- **Contract upgrades** — implementation changes on proxy contracts (24h timelock provides advance notice). Current impls: cUSD [`0xa766…bfe6`](https://etherscan.io/address/0xa76645e15c267b876999bf7689e0b2c1ee29bfe6), stcUSD [`0x42c0…3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31), AccessControl [`0x6681…4bc1`](https://etherscan.io/address/0x6681eb184c876d74ea3ddfae0ecee0c9c0f84bc1)
- **Multisig changes** — signer additions/removals, threshold changes on [`0xb8FC…8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793)
- **FRV strategy queue changes** — `get_default_queue()` on the USDC FRV; reactivation of Aave V3 or addition/removal of Morpho legs
- **Morpho vault utilization** — high utilization in Steakhouse Prime could delay reserve withdrawal; it is the sole meaningful liquidity venue for the USDC reserve (Gauntlet nearly drained)
- **Oracle staleness** — stale RedStone prices disable minting/burning
- **Reserve composition** — significant changes in backing asset ratios (USDC vs. wWTGXX); whitelist changes (`Vault.assets()`)

## Risk Summary

### Key Strengths

- **Strong audit coverage:** 8 auditors / 9 reports including Trail of Bits, Spearbit (core + incremental PR), Zellic, Certora, Sherlock contest, and a fresh Octane token audit (March 2026). Comprehensive coverage of core protocol, security network, and invariant testing
- **Onchain coverage accounting:** Operator debt, configured LTVs, collateral-token addresses, current coverage, and slashable collateral are directly enumerable through the Lender and Delegation contracts
- **Reserve ledger reconciliation:** cUSD supply (~74.81M) closely reconciles to the protocol's USDC and wWTGXX supply accounting, including assets deployed to FRVs and receivables from operator loans
- **Institutional backing:** $11M institutional financing plus a $1.1M community round. Named operators include major trading firms (IMC Trading, Susquehanna)
- **24-hour Timelock with sole DEFAULT_ADMIN_ROLE:** Onchain enumeration confirms only the Timelock holds DEFAULT_ADMIN on Access Control. All governance changes go through 24-hour delay

### Key Risks

- **Upgradeable contracts:** Core token contracts (cUSD, stcUSD, Access Control) are UUPS upgradeable proxies. While upgrades require Timelock execution (24h delay), the 3-of-5 multisig can ultimately modify fundamental contract logic
- **Weak multisig configuration:** 3-of-5 threshold with anonymous signers. Confirmed onchain: 5 owners, threshold 3, Safe v1.4.1. Effective security is weaker than the threshold suggests; signer identities and nested-Safe composition are not disclosed
- **Offchain operator strategies:** Operators execute proprietary yield strategies that are opaque to onchain verification. While slashing provides recourse, users cannot independently verify operator positions or risk exposure
- **Layered collateral dependencies:** Operator recovery depends on eight live collateral tokens, their issuers/custodians and price oracles, plus Symbiotic or EigenLayer slashing. BTC representations account for ~65.9% of live agent debt, led by uniBTC at 40.35%
- **Unhealthy position observed:** One ~$681 dust position was fully liquidatable with health ~0.125, but liquidation had not been opened. This is immaterial in size but shows that over-collateralization is not a continuously guaranteed state
- **Morpho concentration:** USDC reserves are 100% deployed in Morpho and **97.3% concentrated in a single MetaMorpho vault (Steakhouse Prime)**, with Gauntlet Prime holding a $0.63M residual. A Morpho Blue protocol incident or Steakhouse curator failure would affect virtually all deployed USDC reserves
- **Relatively new protocol:** ~11 months in production. TVL has receded from a peak of ~$484M (Jan 2026) to ~$253M (July 2026). The operator model and its Symbiotic/EigenLayer slashing mechanisms still have not been stress-tested in adverse conditions
- **Deployer EOA retains EXECUTOR_ROLE:** Still not revoked as of July 26, 2026. Cannot propose or cancel, but can execute any already-queued Timelock proposal

### Critical Risks

- **Operator default or collateral cascade:** If multiple operators default, or correlated BTC/LST collateral loses value, recovery depends on the affected tokens remaining liquid and slashable through Symbiotic or EigenLayer. The per-agent model limits direct allocation reuse, but common issuers, custody systems, and oracle paths remain correlated
- **Contract upgrade risk:** A compromised 3-of-5 multisig could upgrade cUSD/stcUSD contracts after a 24h delay. The anonymous signers and weak threshold make this a non-trivial concern

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Unverified contract source** — assessed token proxies and their current implementations are source-verified on Etherscan. ✅ PASS
- [x] **No audit** — 8 auditors with 9 reports (added Octane in March 2026). ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. cUSD reserves enumerable onchain (`Vault.totalSupplies(asset)` matches token + strategy balances). Fractional reserve Morpho positions verifiable. Operator yield strategies remain offchain. ⚠️ PARTIAL — core reserves verifiable, operator positions opaque
- [x] **Total centralization** — 3-of-5 multisig with 24h Timelock (verified `getMinDelay() = 86400`). Not a single EOA or 1-of-N setup. ✅ PASS

**All gates pass (with caveat on operator opacity).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | 8 auditors, 9 reports: Trail of Bits, Spearbit (×2), Zellic, Sherlock (contest), Certora, Electisec, Recon (invariant), Octane (token, Mar 2026). Premium firms with comprehensive coverage |
| Bug bounty | $1M on Sherlock (Critical only). No Immunefi |
| Production history | **~11 months** (August 19, 2025). Still relatively new |
| TVL | **~$253M** total (DeFi Llama, Ethereum; includes restaker collateral). ~$74.8M cUSD supply. Peak ~$484M on Jan 28, 2026 |
| Security incidents | None known |
| Finding details | Severity breakdowns not publicly summarized |

**Score: 2.0/5** — Excellent audit coverage from premium firms (Trail of Bits, Spearbit, Zellic) with good breadth (core, security network, invariant testing, contest). The added Octane audit in March 2026 strengthens coverage incrementally. ~11 months of production history is still short compared to mature protocols. $1M bug bounty is strong. No incidents to date. The short track record and lack of public finding details prevent a score below 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | Core contracts (cUSD, stcUSD, Access Control) are **upgradeable proxies** through Timelock |
| Multisig | 3-of-5 Gnosis Safe with **anonymous signers**, 2 dormant owners, 1 nested 1-of-2 Safe |
| Timelock | **24-hour delay** on all governance actions via TimelockController |
| Privileged roles | Granular role system (oracle_admin, lender_admin, vault_config_admin, emergency_admin). All go through Timelock |
| EOA risk | Deployer EOA retains EXECUTOR_ROLE (cannot propose, but can execute queued proposals) |

**Governance Score: 3.5/5** — The 24-hour timelock provides meaningful advance notice and upgrades cannot bypass it, but the framework places a 3-of-5 multisig in the high-risk governance band. Anonymous signers, two dormant owners, a nested 1-of-2 Safe, upgrade authority over core contracts, and the deployer EOA's residual EXECUTOR_ROLE justify scoring between the framework's 3 and 4 rows.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Core vault operations | Permissionless staking/unstaking onchain |
| Reserve deployment | Automated via Fractional Reserve Vaults to Morpho |
| Operator yield | **Offchain** — proprietary strategies are opaque. Only borrowing/repayment recorded onchain |
| Hurdle rate | Onchain, dynamic |
| Slashing | Onchain, objective conditions |

**Programmability Score: 3.0/5** — Core mechanics (PPS, staking, reserve accounting, and liquidation) are onchain and programmatic. However, operator yield strategies — a fundamental component of the protocol's value proposition and the use of ~$45.4M of reserve assets — are executed offchain and cannot be independently verified. This matches the framework's hybrid onchain/offchain band.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Morpho, Symbiotic, EigenLayer, RedStone, LayerZero V2, USDC/Circle, wWTGXX/WisdomTree, and eight live operator-collateral tokens with issuer/custody/oracle dependencies. Aave V3 is wired in but no longer holds reserves |
| Morpho concentration | ~$24.3M USDC — **97.3%** of deployed USDC reserves are in a single MetaMorpho vault (Steakhouse Prime). Gauntlet Prime holds a $0.63M residual, so there is no effective curator-level diversification |
| Collateral networks | Symbiotic secures 14 live debt positions; EigenLayer secures five OETH-backed positions |
| Collateral issuers | uniBTC/Bedrock secures 40.35% of live agent debt; LBTC/Lombard, SolvBTC/Solv, weETH/Ether.fi, wstETH/Lido, OETH/Origin, XAUM/Matrixdock, and WBTC form the remaining collateral stack |
| LayerZero concentration | The OFT Adapter escrows 26.14M stcUSD (**40.98% of supply**) for Katana. This is a lock-and-mint representation, not a canonical-token mint authority, but bridge failure or compromise can affect the escrowed share |
| Operator counterparties | Institutional firms (IMC, Susquehanna, Edge) — blue-chip but opaque |

**Dependencies Score: 4.0/5** — This matches the framework's "many or newer protocol dependencies" band. In addition to Morpho concentration and the LayerZero route, recovery of ~$45.47M of agent debt depends on two slashing networks and eight collateral tokens. uniBTC alone secures 40.35% of live agent debt, while correlated BTC representations collectively secure ~65.9%. Failure or mispricing of a collateral issuer, custodian, oracle, or slashing path can directly reduce reserve recovery.

**Centralization Score = (3.5 + 3.0 + 4.0) / 3 = 3.5**

**Score: 3.5/5** — A low-threshold upgrade multisig, materially offchain operator activity, and a large multi-protocol collateral and oracle dependency stack outweigh the protection provided by the 24-hour timelock.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | cUSD backed by 2 onchain whitelisted assets: USDC (~93%) and wWTGXX/WisdomTree (~7%). Heavy USDC concentration. Per-asset `Vault.totalSupplies()` closely reconciled to cUSD supply, with a ~$1,034 (~0.0014%) nominal difference at the snapshot |
| Reserve quality | USDC (Circle) is blue-chip. wWTGXX (WisdomTree Gov Money Market) is an institutional tokenized fund with minimal DeFi track record |
| Reserve deployment | USDC FRV: ~$23.62M in Morpho Steakhouse Prime + ~$0.63M in Morpho Gauntlet Prime + ~$0 in Aave V3 (deactivated). ~$45.4M lent to operators. wWTGXX FRV: ~$5.10M in holder strategy |
| Leverage | No direct leverage in the FRVs. Operators borrow reserve assets against Symbiotic or EigenLayer collateral; live configured initial LTVs range from 50% to 65% |
| Operator collateral | Eight live collateral tokens of mixed quality. BTC representations secure ~65.9% of agent debt; one ~$681 position was undercollateralized and fully liquidatable at the snapshot |
| Verifiability | Reserves onchain. Operator positions partially verifiable (borrow/repay onchain, strategies offchain) |

**Collateralization Score: 3.0/5** — USDC makes up ~93% of reserves (low diversification despite the 40% cap rule). The reserve ledger and collateral coverage are onchain, but collateral quality is mixed and much of it depends on newer BTC representations, LRTs, and an RWA token. Approximately $45.4M of USDC is outside the reserve contracts in opaque operator strategies, with recovery dependent on liquidation and slashing. The observed unhealthy dust position is immaterial in size but confirms that live over-collateralization is not guaranteed continuously.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Onchain — reserve balances, Morpho positions, operator debt, collateral identity, coverage, and slashable amounts are verifiable |
| Exchange rate | ERC-4626, fully onchain |
| Operator positions | **Partially opaque** — borrowing/repayment onchain, but actual strategy execution and risk exposure are offchain |
| Slashing verifiability | Onchain — objective fault conditions |

**Provability Score: 3.0/5** — Core protocol state is onchain and verifiable, including the newly enumerated collateral and health values. However, the destination, custody, and risk exposure of ~$45.4M used by operators remain offchain and cannot be independently verified. This matches the framework's hybrid onchain/offchain band.

**Funds Management Score = (3.0 + 3.0) / 2 = 3.0**

**Score: 3.0/5** — Onchain accounting is strong, but mixed operator-collateral quality, offchain use of borrowed reserves, and liquidation-dependent recovery introduce material trust and dependency risk.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | stcUSD → cUSD (ERC-4626 redeem) → burn/redeem cUSD for reserves |
| Morpho liquidity | ~$24.28M USDC almost entirely in a single Morpho vault (Steakhouse Prime). Withdrawal depends on Morpho market liquidity. The Aave V3 leg remains deactivated, leaving no secondary withdrawal venue |
| cUSD redemption | Proportional basket redemption prevents "last man standing" scenarios |
| Withdrawal restrictions | No lock for stcUSD. Restaker withdrawals up to 14 days |
| Large withdrawal impact | With ~$24.3M in Fractional Reserve and ~$45.4M lent to operators, a large redemption would need to be sourced from Morpho or wait for operator repayment |

**Score: 3.0/5** — Multiple layers between stcUSD holder and underlying assets (stcUSD → cUSD → reserve assets). ~$24.3M deployed almost entirely through a single Morpho MetaMorpho vault (liquid in normal conditions but concentrated in one curator), ~$45.4M lent to operators (not immediately available — operator epoch-based repayment). The proportional redemption mechanism is well-designed for stress scenarios, but the fractional reserve model means not all capital is immediately liquid. In adverse scenarios (Morpho utilization spike + operator delays), significant redemptions could face delays.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Experienced DeFi founders (QiDAO, Beefy). Relatively small team |
| Funding | $11M institutional financing plus a $1.1M community round; tier-1 investors include Franklin Templeton |
| Documentation | Comprehensive protocol docs |
| Legal | No disclosed legal entity. Operators described as "regulated financial institutions" |
| Incident response | $1M bug bounty. Emergency admin with pause capability. No incidents tested |
| Monitoring | Not publicly documented |

**Score: 2.5/5** — Experienced founders, strong investor backing, good documentation, and a substantial bounty are positives. The lack of a disclosed legal entity, no public monitoring program, and an untested incident-response record place the protocol between the framework's 2 and 3 bands.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (3.5 × 0.30) + (3.0 × 0.30) + (2.0 × 0.20) + (3.0 × 0.15) + (2.5 × 0.05)
            = 1.05 + 0.90 + 0.40 + 0.45 + 0.125
            = 2.925
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 3.0 | 30% | 0.90 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.9/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (2.9/5.0) — Approved with enhanced monitoring**

The score is driven by governance and dependency risk under the framework's rubrics. The 3-of-5 anonymous upgrade multisig maps between the governance score-3 and score-4 bands, while the live operator-collateral enumeration shows many critical dependencies: Symbiotic, EigenLayer, eight collateral tokens and their issuers/custodians, and their price-oracle paths. Approximately $45.4M of reserve assets is used in opaque offchain operator strategies, so onchain collateral and slashing provide recourse rather than eliminating counterparty risk. Reserve deployment is 97.3% concentrated in a single MetaMorpho vault, and cUSD supply is contracting steadily. Strong audits, a 24-hour timelock, permissionless redemption, and transparent onchain accounting remain meaningful protections, but enhanced monitoring is warranted.

---

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| March 20, 2026 | 2.4/5.0 | Initial assessment |
| May 23, 2026 | 2.4/5.0 | Rescored; Aave V3 leg deactivated, Morpho allocation 60/40 Steakhouse/Gauntlet, TVL $300M, cUSD supply 97.73M |
| July 26, 2026 | 2.9/5.0 | Reassessment; live operator collateral and EigenLayer path enumerated, score raised for governance/dependency risk; Gauntlet nearly fully drained (97.3% Steakhouse), TVL $253M |

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (January 2027) or after 12 months of production history (August 2026)
- **TVL-based:** Reassess if TVL exceeds $500M or changes by more than ±25% from the current ~$253M. Given the current ~1.4%/day net outflow, also reassess if cUSD supply falls below 50M or if the USDC FRV buffer drops below 15% of cUSD supply
- **Incident-based:** Reassess after any exploit, operator default, slashing event, or governance incident
- **Governance-based:** Reassess if multisig threshold or signers change, or if deployer EOA's EXECUTOR_ROLE is revoked (positive signal)
- **Operator-based:** Reassess if new operators are onboarded or existing operators experience issues
- **Collateral-based:** Reassess if any live collateral token depegs, changes custody/mint controls, is removed or added, or if any operator health falls below 1
- **Protocol-based:** Reassess if either Morpho vault (Steakhouse Prime, Gauntlet Prime) utilization consistently exceeds 90% or experiences a security incident; reassess if the Aave V3 leg is reactivated or any new strategy is added to the USDC FRV default queue
- **Upgrade-based:** Reassess after any contract upgrade via Timelock
