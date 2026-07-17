# Protocol Risk Assessment: Cap — stcUSD

- **Assessment Date:** March 20, 2026 (Updated: May 23, 2026)
- **Token:** stcUSD (Staked cap USD)
- **Chain:** Ethereum
- **Token Address:** [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- **Final Score: 2.4/5.0**

## Overview + Links

stcUSD is a **yield-bearing ERC-4626 vault token** issued by Cap (Covered Agent Protocol). Users stake cUSD (Cap's dollar-pegged stablecoin) to receive stcUSD, which auto-compounds yield from two sources: (1) **fractional reserve deployment** of idle cUSD reserves to Aave V3 and Morpho, and (2) **operator borrowing fees** from institutional market makers (IMC Trading, Edge Capital, Susquehanna Crypto) who borrow reserve capital for proprietary yield strategies secured by Symbiotic restaking collateral.

**Key architecture:**

- **cUSD:** Dollar-pegged stablecoin backed 1:1 by whitelisted reserve assets. Currently **2 assets accepted onchain**: USDC (~95% of reserves) and wWTGXX/WisdomTree Government Money Market Digital Fund (~5%). Max 40% single-asset concentration rule exists but is not binding given current composition. Users mint by depositing reserves and burn/redeem to withdraw
- **stcUSD:** ERC-4626 vault wrapping cUSD. Yield accrues via exchange rate appreciation. ~83% of cUSD supply is staked as stcUSD
- **Fractional Reserve:** ~$48.86M USDC deployed via the USDC Fractional Reserve Vault (a Yearn V3 vault) — now split between **Morpho Steakhouse Prime USDC** (~$29.13M, 60%) and **Morpho Gauntlet USDC Prime** (~$19.73M, 40%). The Aave V3 USDC Lender strategy remains wired in the default queue but has been fully drained (current debt ≈ 0, max debt = 0). An additional ~$5.08M wWTGXX is held in a separate Fractional Reserve Vault via a simple holder strategy
- **Operator Model:** Institutional operators borrow reserves at a dynamic hurdle rate (~5.2% avg over 90 days), execute offchain/proprietary strategies (HFT, private credit, arbitrage, MEV), and return principal + hurdle rate. Excess yield is split between operators and restakers
- **Security Network:** Per-operator Symbiotic vaults with instant slashing. Restakers delegate collateral (ETH, wBTC, LSTs, stablecoins) to specific operators. If an operator defaults, their delegated collateral is slashed and redistributed to cover losses
- **Governance:** 3-of-5 Gnosis Safe multisig → 24-hour TimelockController → Access Control system. All contracts are upgradeable proxies

**Key metrics (verified onchain May 23, 2026 at block ~25,160,215):**

- **cUSD Total Supply:** ~97,728,786 cUSD (down ~24% since March)
- **stcUSD Total Supply:** ~81,567,930 stcUSD
- **stcUSD Total Assets:** ~86,703,368 cUSD
- **Price Per Share:** ~1.0630 cUSD/stcUSD (+0.93% vs. March 20 PPS of 1.0531; ~6.3% cumulative appreciation since launch)
- **cUSD Reserves:** ~92.66M USDC + ~5.07M wWTGXX (sum matches total supply)
- **Operator USDC Debt:** ~$43.80M outstanding
- **Available USDC in Fractional Reserve:** ~$48.86M (= 92.66M reserves − 43.80M operator debt)
  - **Morpho Steakhouse Prime USDC:** ~$29.13M (60% of FRV)
  - **Morpho Gauntlet USDC Prime:** ~$19.73M (40% of FRV)
  - **Aave V3 USDC Lender:** ~$0 (deactivated; 0 max debt)
- **Fractional Reserve wWTGXX:** ~$5.08M wWTGXX
- **Protocol TVL (DeFi Llama, Ethereum):** ~$300M (includes restaker collateral); **Peak TVL ~$484M on Jan 28, 2026**
- **Minting Fee:** 0.10%
- **Launch Date:** August 19, 2025 (~9 months in production)

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
| Delegation | [`0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F`](https://etherscan.io/address/0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F) | Symbiotic delegation management |
| Fee Auction | [`0xa1a20aBdc873CF291c22Ce3C8968EC06277324D0`](https://etherscan.io/address/0xa1a20aBdc873CF291c22Ce3C8968EC06277324D0) | Dutch auction for fee conversion |
| Fee Receiver | [`0x0036c7b9b62c53F47c804a5643F0c09f864beF0b`](https://etherscan.io/address/0x0036c7b9b62c53F47c804a5643F0c09f864beF0b) | Collects protocol fees |
| USDC Fractional Reserve Vault | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | Yearn V3 vault — deploys USDC to Morpho (67%) + Aave V3 (33%) |
| wWTGXX Fractional Reserve Vault | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | Yearn V3 vault — holds wWTGXX (~$5M) via holder strategy |
| cUSD Adapter | [`0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf`](https://etherscan.io/address/0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf) | cUSD integration adapter |
| stcUSD Adapter | [`0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0`](https://etherscan.io/address/0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0) | stcUSD integration adapter |

### Governance Contracts

All values in this table verified via `eth_call` on May 23, 2026.

| Contract | Address | Configuration |
|----------|---------|---------------|
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | OZ TimelockController. `getMinDelay() = 86400` (24h). Holds the sole DEFAULT_ADMIN_ROLE on Access Control (enumerated: 1 holder = this Timelock) |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Gnosis Safe v1.4.1, threshold = 3, 5 owners. `hasRole` confirms PROPOSER_ROLE, EXECUTOR_ROLE, and CANCELLER_ROLE on the Timelock. Owners are anonymous: `0xDD30a4712e6B34926d4f5aA99c1881573407538C`, `0xdf466Fa3ddd0042d990FA9A023e040884CBaD439`, `0x7c29F6A93df60Bcd3B20f03B57a2F9e698FD4128`, `0x62D0b3c0a77bE77EaB2060266a95FfaD9e6A3F51`, `0xA62f87A9D4B5EE1F83cb644Ea076832A396101b8` |
| Deployer EOA | [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52) | `hasRole` returns true only for EXECUTOR_ROLE on Timelock — PROPOSER, CANCELLER, and DEFAULT_ADMIN are all false. Residual permission from deployment, not revoked as of this reassessment |

### Symbiotic Integration

| Contract | Address | Purpose |
|----------|---------|---------|
| Network | [`0x98e52Ea7578F2088c152E81b17A9a459bF089f2a`](https://etherscan.io/address/0x98e52Ea7578F2088c152E81b17A9a459bF089f2a) | Cap's Symbiotic network registration |
| Network Middleware | [`0x09A3976d8D63728d20DCDFEe1e531C206Ba91225`](https://etherscan.io/address/0x09A3976d8D63728d20DCDFEe1e531C206Ba91225) | Slashing/reward logic |
| Vault Factory | [`0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e`](https://etherscan.io/address/0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e) | Deploys per-operator Symbiotic vaults |
| Agent Manager | [`0x08A728CF4E6b39f4AFa059c6eE376103722953eA`](https://etherscan.io/address/0x08A728CF4E6b39f4AFa059c6eE376103722953eA) | Manages operator-vault whitelisting |

### Oracles

| Contract | Address | Purpose |
|----------|---------|---------|
| Redstone cUSD | [`0x9A5a3c3Ed0361505cC1D4e824B3854De5724434A`](https://etherscan.io/address/0x9A5a3c3Ed0361505cC1D4e824B3854De5724434A) | cUSD price feed (0.05% deviation threshold) |
| Morpho stcUSD | [`0x8E3386B2f6084eB1B0988070c3d826995BD175c0`](https://etherscan.io/address/0x8E3386B2f6084eB1B0988070c3d826995BD175c0) | stcUSD price feed for Morpho markets |

### Morpho Markets (stcUSD / PT-stcUSD / PT-cUSD as collateral)

Sourced from Morpho Blue API on May 23, 2026. Composition has shifted materially since the March assessment — USDT/stcUSD is now the largest market (was USDC).

| Market | Collateral | Loan Token | LLTV | Supply TVL | Utilization |
|--------|-----------|------------|------|-----------|-------------|
| stcUSD / USDT | stcUSD | USDT | 91.5% | ~$16.6M | ~70% |
| stcUSD / USDC | stcUSD | USDC | 91.5% | ~$8.9M | ~91% |
| PT-cUSD-23JUL2026 / USDC | PT-cUSD (Pendle) | USDC | 91.5% | ~$0.87M | ~90% |
| PT-stcUSD-23JUL2026 / USDC | PT-stcUSD (Pendle) | USDC | 91.5% | ~$0.40M | ~90% |
| PT-cUSD-23JUL2026 / USDT | PT-cUSD (Pendle) | USDT | 91.5% | ~$0.14M | ~70% |

Several smaller / unused markets (AUSD pairs, mismatched-LLTV duplicates) also exist with <$20K supply each.

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
- **Symbiotic integration:** Per-operator vault deployment, middleware for slashing/rewards, restaker delegation management
- **Operator model:** Offchain yield generation by institutional counterparties, onchain borrowing/repayment/liquidation
- **Multi-oracle system:** RedStone price feeds with staleness checks, Morpho oracle adapters
- **Cross-protocol dependencies:** Aave V3, Morpho, Symbiotic, RedStone, Pendle (for PT tokens)

## Historical Track Record

- **Launch date:** August 19, 2025 — **~9 months** in production as of this reassessment
- **cUSD supply:** ~97.73M cUSD (was 129M in March 2026, down ~24%)
- **stcUSD supply:** ~81.57M stcUSD (~83% staking ratio, up from ~76%)
- **stcUSD PPS:** 1.0000 → 1.0531 (Mar 20) → 1.0630 (May 23) — ~6.3% cumulative since launch, ~9–10% annualized; PPS has not decreased
- **Security incidents:** None known
- **Peak TVL:** ~$484M on January 28, 2026 (DeFi Llama)
- **Current TVL:** ~$300M (May 23, 2026, includes restaker collateral)
- **Protocol age:** Still relatively new — launched August 2025, first audit February 2025

**Team track record:**

- **Benjamin918 (CEO):** Previously scaled QiDAO from $0 to $400M TVL
- **the_weso (CTO):** Founding member of Beefy Finance (peaked at $1B+ TVL)

**Funding:** $11M total raised — $3M pre-seed, $8M seed (co-led by Franklin Templeton and Kraken Ventures), $1.1M community round on Echo. Investors include Franklin Templeton, Kraken Ventures, Blockchain Capital, a16z crypto, Dragonfly, Lightspeed Faction, Susquehanna (SIG), Nomura's Laser Digital, GSR, Robot Ventures, and others.

## Funds Management

### Yield Generation

stcUSD earns yield from two primary sources:

**1. Fractional Reserve Deployment**

Idle cUSD reserves are deployed via two Yearn V3 Fractional Reserve Vaults. Strategy queue and per-strategy `totalAssets()` verified onchain on May 23, 2026:

- **USDC FRV** ([`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072)): ~$48.86M USDC total assets. Default queue now contains three strategies:
  - [Morpho Steakhouse Prime USDC Compounder](https://etherscan.io/address/0xBAed9839573d349e42DFbF23a8916e5AB9cAf2E3) — ~$29.13M (60% of FRV). Underlying MetaMorpho vault [`0xbeef088055857739C12CD3765F20b7679Def0f51`](https://etherscan.io/address/0xbeef088055857739C12CD3765F20b7679Def0f51) ("Steakhouse Prime USDC", $58M total assets)
  - [Morpho Gauntlet USDC Prime Compounder](https://etherscan.io/address/0x8092C20351CF4048B464DF2144Dc8a4DD49ce71D) — ~$19.73M (40% of FRV). Underlying MetaMorpho vault [`0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0`](https://etherscan.io/address/0x8c106EEDAd96553e64287A5A6839c3Cc78afA3D0) ("Gauntlet USDC Prime", $98.6M total assets)
  - [Aave V3 USDC Lender](https://etherscan.io/address/0x7D7F72d393F242DA6e22D3b970491C06742984Ff) — **~$0 (deactivated)**. `strategies[strat].max_debt = 0` and current debt is dust (~2 USDC). Still wired into the default queue but receives no new allocation
- **wWTGXX FRV** ([`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8)): ~$5.08M wWTGXX held via "Holder wWGTXX" strategy ([`0xB0D399E8A11E1c6df00E1Fb5698936B5614e9259`](https://etherscan.io/address/0xB0D399E8A11E1c6df00E1Fb5698936B5614e9259)). wWTGXX is itself a yield-bearing WisdomTree Government Money Market fund token ([`0x434558CB1EBe9950e8A66f1ef8A15A473Dce7D8c`](https://etherscan.io/address/0x434558CB1EBe9950e8A66f1ef8A15A473Dce7D8c))

**Concentration note (change since March 2026):** USDC reserves were previously split ~67% Morpho / ~33% Aave V3. After the rebalance, **100% of deployed USDC reserves now sit in Morpho** (split across two MetaMorpho vaults: Steakhouse and Gauntlet). This increases concentration on a single underlying protocol (Morpho Blue + MetaMorpho), even though it spreads risk across two curators.

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

Backing breakdown verified via `Vault.totalSupplies(asset)` and per-asset balance checks on May 23, 2026:

- **cUSD reserves:** Backed by 2 whitelisted assets onchain: **USDC** (~$92.66M, 95%) and **wWTGXX** (~$5.07M, 5%). Sum equals cUSD total supply (~97.73M), confirming 1:1 backing. USDC still dominates and the 40% single-asset concentration cap is not binding
- **Reserve deployment:** USDC FRV holds ~$48.86M (Morpho Steakhouse ~$29.13M + Morpho Gauntlet ~$19.73M; Aave V3 leg drained). ~$43.80M of USDC reserves are lent to operators (`Vault.totalBorrows(USDC)`). wWTGXX FRV holds ~$5.08M via holder strategy
- **Operator collateralization:** Each operator must secure over-collateralized Symbiotic delegations (default 50% LTV, 80% liquidation threshold) from restakers before borrowing
- **Liquidation:** Health Factor < 1.0 triggers a 12-hour grace period, then a 3-day liquidation window via permissionless Dutch auction. Liquidation bonus capped at 10%. Target: 125% health ratio post-liquidation
- **Slashing:** Instant slashing on two objective fault conditions: (1) failure to return expected amount, (2) insufficient active delegation. No governance intervention needed

### Accessibility

- **Deposits:** Permissionless — deposit cUSD to receive stcUSD (ERC-4626 standard)
- **Withdrawals:** ERC-4626 standard. Redeem stcUSD for cUSD
- **cUSD minting:** Deposit whitelisted reserve assets at oracle price with 0.10% minting fee
- **cUSD burning:** Receive a single reserve asset at oracle price with dynamic fee
- **cUSD redemption:** Receive proportional basket of all underlying assets with fixed fee (lower than burn fee)
- **Restaker withdrawal delay:** Up to 14 days (epoch-based: 7-day epochs)

### Token Mint Authority

Re-verified onchain on May 23, 2026 against current Vault implementation [`0xa76645e15c267b876999bf7689e0b2c1ee29bfe6`](https://etherscan.io/address/0xa76645e15c267b876999bf7689e0b2c1ee29bfe6) and stcUSD implementation [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31) (both unchanged since the March assessment). Cap does **not** implement a privileged `MINTER_ROLE` on either token — both mint paths are permissionless and require collateral in the same transaction.

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
- **Fractional reserve positions:** Onchain — Aave V3 aToken balances verifiable
- **Operator positions:** Partially onchain — borrowing/repayment recorded onchain, but operators' actual yield strategies are offchain and opaque
- **Slashing conditions:** Onchain verifiable — objective fault conditions, no governance discretion

## Liquidity Risk

- **Primary exit for stcUSD:** Redeem stcUSD for cUSD via ERC-4626 `withdraw()`/`redeem()`. Then burn/redeem cUSD for underlying reserves
- **cUSD exit mechanisms:** Burn (receive single asset at oracle price, dynamic fee) or Redeem (receive proportional basket, fixed fee). The redemption mechanism is designed to prevent "last man standing" scenarios
- **Morpho liquidity dependency:** ~$48.9M of available USDC reserves now sit entirely in two MetaMorpho vaults (Steakhouse Prime $29M, Gauntlet Prime $19M). Withdrawal depends on idle USDC + Morpho market liquidity. Removal of the active Aave V3 leg has eliminated a secondary, blue-chip liquidity venue
- **Morpho markets (stcUSD as collateral):** Top markets are USDT/stcUSD (~$16.6M @ 70% util) and USDC/stcUSD (~$8.9M @ 91% util). Pendle PT-cUSD / PT-stcUSD markets add ~$1.4M. High utilization on the USDC market means limited immediate exit for Morpho lenders
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
| Reserve deployment | Automated via Fractional Reserve Vault to Aave V3 |
| Operator strategies | **Offchain** — operators execute proprietary strategies. Borrowing/repayment recorded onchain, but actual yield generation is opaque |
| Hurdle rate | Onchain — dynamic function of market rate + utilization |
| Slashing | Onchain — objective fault conditions, permissionless liquidation |

**Programmability is mixed:** Core vault mechanics (staking, PPS, reserve deployment, slashing) are fully onchain. However, the operator yield generation — which represents a portion of stcUSD yield — is offchain and opaque.

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Morpho (Steakhouse Prime + Gauntlet Prime)** | Critical | **~$48.9M USDC** — 100% of the deployed USDC FRV is now in Morpho (split ~60/40 Steakhouse/Gauntlet). Also the venue for ~$26M of stcUSD collateral markets. A Morpho Blue protocol incident or simultaneous curator failure would impair both reserve liquidity and stcUSD collateral utility |
| **Aave V3 Core Ethereum** | Low (currently) | Strategy still wired in but max debt set to 0; effectively unused. Was a critical dependency in March 2026 |
| **Symbiotic** | Critical | Restaking infrastructure securing operator positions. Per-operator vault delegation model |
| **RedStone** | High | cUSD price oracle (0.05% deviation threshold). Stale prices disable minting/burning |
| **wWTGXX (WisdomTree)** | Low | ~$5.08M tokenized gov money market fund. Minimal DeFi adoption and few holders |
| **USDC (Circle)** | High | Primary reserve asset (~95% of cUSD backing) |
| **LayerZero V2** | High | The Ethereum OFT Adapter [`0x983a…4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) escrows 25,311,191 stcUSD, **51.99% of the 48.68M supply**, backing the native Katana OFT. The adapter cannot mint canonical stcUSD, so compromise risk is bounded by the remote supply and locked collateral, but the integration affects a majority of current supply |
| **USDT, pyUSD, BENJI, BUIDL** | Low | Listed in docs as potential reserve assets but **not currently whitelisted onchain** (`Vault.assets()` returns only USDC and wWTGXX) |
| **Institutional Operators** | High | IMC Trading, Edge Capital, Susquehanna Crypto generate yield via offchain strategies. Counterparty risk mitigated by Symbiotic restaking |

## Operational Risk

- **Team:** Cap Labs — Benjamin918 (CEO, ex-QiDAO $400M TVL) and the_weso (CTO, ex-Beefy Finance $1B+ TVL). Experienced DeFi founders but relatively small team
- **Funding:** $11M raised from tier-1 investors (Franklin Templeton, Kraken Ventures, a16z, Dragonfly, Blockchain Capital, Susquehanna). Strong institutional backing
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
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Signer/threshold changes, submitted transactions |
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | `getMinDelay()`, scheduled/executed transactions, role changes |
| Access Control | [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | `RoleGranted` / `RoleRevoked` events, `getRoleMember(DEFAULT_ADMIN_ROLE, 0)`, implementation upgrades (ERC-1967 impl slot) |

### Critical Events to Monitor

- **stcUSD PPS decrease** — any decrease in `convertToAssets(1e18)` indicates a loss event
- **cUSD supply changes** — large mint/burn events may indicate reserve stress
- **Operator liquidations** — Lender contract liquidation events indicate operator defaults
- **Contract upgrades** — implementation changes on proxy contracts (24h timelock provides advance notice). Current impls: cUSD `0xa766…bfe6`, stcUSD `0x42c0…3d31`, AccessControl `0x6681…4bc1`
- **Multisig changes** — signer additions/removals, threshold changes on `0xb8FC…8793`
- **FRV strategy queue changes** — `get_default_queue()` on the USDC FRV; reactivation of Aave V3 or addition/removal of Morpho legs
- **Morpho vault utilization** — high utilization in Steakhouse Prime or Gauntlet Prime could delay reserve withdrawal; both are now single points of liquidity for the USDC reserve
- **Oracle staleness** — stale RedStone prices disable minting/burning
- **Reserve composition** — significant changes in backing asset ratios (USDC vs. wWTGXX); whitelist changes (`Vault.assets()`)

## Risk Summary

### Key Strengths

- **Strong audit coverage:** 8 auditors / 9 reports including Trail of Bits, Spearbit (core + incremental PR), Zellic, Certora, Sherlock contest, and a fresh Octane token audit (March 2026). Comprehensive coverage of core protocol, security network, and invariant testing
- **Novel security model:** Per-operator Symbiotic restaking with instant slashing provides cryptoeconomic guarantees against operator defaults. Not pooled risk — each operator is independently collateralized
- **1:1 onchain backing verified:** cUSD total supply (~97.73M) exactly matches USDC + wWTGXX held in the reserve system; no IOUs or unbacked mint paths
- **Institutional backing:** $11M from tier-1 investors (Franklin Templeton, Kraken, a16z, Dragonfly). Named operators include major trading firms (IMC Trading, Susquehanna)
- **24-hour Timelock with sole DEFAULT_ADMIN_ROLE:** Onchain enumeration confirms only the Timelock holds DEFAULT_ADMIN on Access Control. All governance changes go through 24-hour delay

### Key Risks

- **Upgradeable contracts:** Core token contracts (cUSD, stcUSD, Access Control) are UUPS upgradeable proxies. While upgrades require Timelock execution (24h delay), the 3-of-5 multisig can ultimately modify fundamental contract logic
- **Weak multisig configuration:** 3-of-5 threshold with anonymous signers. Confirmed onchain: 5 owners, threshold 3, Safe v1.4.1. Effective security is weaker than the threshold suggests; signer identities and nested-Safe composition are not disclosed
- **Offchain operator strategies:** Operators execute proprietary yield strategies that are opaque to onchain verification. While slashing provides recourse, users cannot independently verify operator positions or risk exposure
- **Increased Morpho concentration:** USDC reserves are now 100% deployed in Morpho (was 67/33 Morpho/Aave). Risk is partially diversified across two MetaMorpho vaults (Steakhouse Prime, Gauntlet Prime), but a Morpho Blue protocol incident would now affect 100% of deployed USDC reserves
- **Relatively new protocol:** ~9 months in production. TVL has receded from a peak of ~$484M (Jan 2026) to ~$300M (May 2026). The operator model and Symbiotic slashing mechanism still have not been stress-tested in adverse conditions
- **Deployer EOA retains EXECUTOR_ROLE:** Still not revoked as of May 23, 2026. Cannot propose or cancel, but can execute any already-queued Timelock proposal

### Critical Risks

- **Operator default cascade:** If multiple operators default simultaneously, slashing capacity depends on available restaker collateral. The per-operator model isolates individual defaults, but a correlated failure (e.g., market crash affecting all trading strategies) could test the system beyond its design assumptions
- **Contract upgrade risk:** A compromised 3-of-5 multisig could upgrade cUSD/stcUSD contracts after a 24h delay. The anonymous signers and weak threshold make this a non-trivial concern

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

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
| Production history | **~9 months** (August 19, 2025). Still relatively new |
| TVL | **~$300M** total (DeFi Llama, Ethereum; includes restaker collateral). ~$97.7M cUSD supply. Peak ~$484M on Jan 28, 2026 |
| Security incidents | None known |
| Finding details | Severity breakdowns not publicly summarized |

**Score: 2.0/5** — Excellent audit coverage from premium firms (Trail of Bits, Spearbit, Zellic) with good breadth (core, security network, invariant testing, contest). The added Octane audit in March 2026 strengthens coverage incrementally. ~9 months of production history is still short compared to mature protocols. $1M bug bounty is strong. No incidents to date. The short track record and lack of public finding details prevent a score below 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | Core contracts (cUSD, stcUSD, Access Control) are **upgradeable proxies** through Timelock |
| Multisig | 3-of-5 Gnosis Safe with **anonymous signers**, 2 dormant owners, 1 nested 1-of-2 Safe |
| Timelock | **24-hour delay** on all governance actions via TimelockController |
| Privileged roles | Granular role system (oracle_admin, lender_admin, vault_config_admin, emergency_admin). All go through Timelock |
| EOA risk | Deployer EOA retains EXECUTOR_ROLE (cannot propose, but can execute queued proposals) |

**Governance Score: 2.0/5** — The 24-hour timelock on all governance actions (including contract upgrades) provides meaningful user protection. Granular role separation with function-level permissions. The 3-of-5 multisig with anonymous signers is a concern, but upgrades cannot bypass the timelock. The deployer EOA's residual EXECUTOR_ROLE is a minor but unnecessary risk.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | Onchain ERC-4626, fully algorithmic |
| Core vault operations | Permissionless staking/unstaking onchain |
| Reserve deployment | Automated via Fractional Reserve to Aave |
| Operator yield | **Offchain** — proprietary strategies are opaque. Only borrowing/repayment recorded onchain |
| Hurdle rate | Onchain, dynamic |
| Slashing | Onchain, objective conditions |

**Programmability Score: 2.5/5** — Core mechanics (PPS, staking, reserves, slashing) are fully onchain and programmatic. However, operator yield strategies — a fundamental component of the protocol's value proposition — are executed offchain and cannot be independently verified. This hybrid onchain/offchain model is less transparent than fully onchain protocols.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Morpho (critical), Symbiotic (critical), RedStone (high), USDC/Circle (high), LayerZero V2 (high), wWTGXX/WisdomTree (low). Aave V3 is wired in but no longer holds reserves |
| Morpho concentration | ~$48.9M USDC — **100%** of deployed USDC reserves are in Morpho (Steakhouse Prime + Gauntlet Prime). Concentration on a single underlying lending protocol increased materially vs. March's 67/33 Morpho/Aave split |
| Symbiotic | Novel restaking infrastructure, less battle-tested than established alternatives |
| LayerZero concentration | The OFT Adapter escrows 25.31M stcUSD (**51.99% of supply**) for Katana. This is a lock-and-mint representation, not a canonical-token mint authority, but bridge failure or compromise can affect the majority escrowed share |
| Operator counterparties | Institutional firms (IMC, Susquehanna, Edge) — blue-chip but opaque |

**Dependencies Score: 3.0/5** — Reserve concentration has shifted: 100% of the deployed USDC reserve now sits in Morpho (across two MetaMorpho curators), removing the Aave V3 diversification leg. The live LayerZero integration also escrows 51.99% of stcUSD supply for Katana. Its lock-and-mint model cannot dilute canonical stcUSD, but it adds a material availability and escrow dependency that must be monitored. Symbiotic integration, RedStone oracles, and opaque institutional operator strategies add further complexity. Score remains 3.0 because the bridge blast radius is bounded by its locked collateral and the category already reflects several high-impact dependencies; the newly documented LayerZero concentration reinforces rather than changes that assessment.

**Centralization Score = (2.0 + 2.5 + 3.0) / 3 = 2.5**

**Score: 2.5/5** — Upgradeable contracts behind a 24h timelock, partially offchain yield model, and complex multi-protocol dependency chain.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | cUSD backed by 2 onchain whitelisted assets: USDC (~95%) and wWTGXX/WisdomTree (~5%). Heavy USDC concentration. Per-asset `Vault.totalSupplies()` sums to cUSD total supply (1:1 backing confirmed) |
| Reserve quality | USDC (Circle) is blue-chip. wWTGXX (WisdomTree Gov Money Market) is an institutional tokenized fund with minimal DeFi track record |
| Reserve deployment | USDC FRV: ~$29.13M in Morpho Steakhouse Prime + ~$19.73M in Morpho Gauntlet Prime + ~$0 in Aave V3 (deactivated). ~$43.8M lent to operators. wWTGXX FRV: ~$5.08M in holder strategy |
| Leverage | No direct leverage in reserve. Operators borrow from reserves (over-collateralized via Symbiotic) |
| Operator collateral | Per-operator Symbiotic delegations (50% default LTV, 80% liquidation threshold) |
| Verifiability | Reserves onchain. Operator positions partially verifiable (borrow/repay onchain, strategies offchain) |

**Collateralization Score: 2.0/5** — USDC is blue-chip but makes up 95% of reserves (low diversification despite the 40% cap rule). wWTGXX is a tokenized money market fund with minimal DeFi adoption. The per-operator over-collateralization via Symbiotic is a strong mechanism. However, the fractional reserve model means reserves are actively deployed (~$48.9M now entirely in Morpho, ~$43.8M lent to operators), and operator strategies are offchain.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | Onchain — reserve balances, Aave positions, operator debt balances all verifiable |
| Exchange rate | ERC-4626, fully onchain |
| Operator positions | **Partially opaque** — borrowing/repayment onchain, but actual strategy execution and risk exposure are offchain |
| Slashing verifiability | Onchain — objective fault conditions |

**Provability Score: 2.5/5** — Core protocol state is fully onchain and verifiable (reserves, PPS, operator debt, slashing conditions). However, the operator yield generation — where capital is deployed and what risks operators are taking — is offchain and not independently verifiable. This hybrid model has a provability gap compared to fully onchain protocols.

**Funds Management Score = (2.0 + 2.5) / 2 = 2.3**

**Score: 2.3/5** — Good reserve quality and onchain provability for core protocol state, but operator strategy opacity and fractional reserve model introduce trust assumptions.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | stcUSD → cUSD (ERC-4626 redeem) → burn/redeem cUSD for reserves |
| Morpho liquidity | ~$48.9M USDC entirely in Morpho (Steakhouse + Gauntlet). Withdrawal depends on Morpho market liquidity for the underlying allocations. Loss of the Aave V3 leg removes a secondary withdrawal venue |
| cUSD redemption | Proportional basket redemption prevents "last man standing" scenarios |
| Withdrawal restrictions | No lock for stcUSD. Restaker withdrawals up to 14 days |
| Large withdrawal impact | With ~$48.9M in Fractional Reserve and ~$43.8M lent to operators, a large redemption would need to be sourced from Morpho or wait for operator repayment |

**Score: 3.0/5** — Multiple layers between stcUSD holder and underlying assets (stcUSD → cUSD → reserve assets). ~$48.9M deployed entirely through Morpho (liquid in normal conditions but now a single-protocol dependency), ~$43.8M lent to operators (not immediately available — operator epoch-based repayment). The proportional redemption mechanism is well-designed for stress scenarios, but the fractional reserve model means not all capital is immediately liquid. In adverse scenarios (Morpho utilization spike + operator delays), significant redemptions could face delays.

#### Category 5: Operational Risk (Weight: 5%)

| Factor | Assessment |
|--------|-----------|
| Team | Experienced DeFi founders (QiDAO, Beefy). Relatively small team |
| Funding | $11M from tier-1 investors including Franklin Templeton |
| Documentation | Comprehensive protocol docs |
| Legal | No disclosed legal entity. Operators described as "regulated financial institutions" |
| Incident response | $1M bug bounty. Emergency admin with pause capability. No incidents tested |
| Monitoring | Not publicly documented |

**Score: 2.0/5** — Experienced team with strong investor backing and comprehensive documentation. However, no disclosed legal entity, monitoring infrastructure not publicly documented, and the protocol's incident response has not been tested in production.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
            = (2.5 × 0.30) + (2.3 × 0.30) + (2.0 × 0.20) + (3.0 × 0.15) + (2.0 × 0.05)
            = 0.75 + 0.69 + 0.40 + 0.45 + 0.10
            = 2.39
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 2.5 | 30% | 0.75 |
| Funds Management | 2.3 | 30% | 0.69 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.4/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Low Risk (2.4/5.0) — Approved with standard monitoring**

The score is unchanged from the March 2026 assessment. Strong audit coverage (now 8 firms / 9 reports with the added Octane review), institutional backing, novel security model (Symbiotic restaking), and onchain-verified 1:1 backing remain the primary positives. The key risk drivers are unchanged: upgradeable contracts with a 3-of-5 anonymous multisig, offchain operator strategy opacity, and the relatively short production history (~9 months). The shift from 67/33 Morpho/Aave deployment to 100% Morpho is flagged as a watch-item — it raises Morpho-specific risk but is partly offset by curator diversification (Steakhouse + Gauntlet) and is not severe enough on its own to move the score. Enhanced monitoring is recommended, particularly around operator positions, multisig transactions, FRV queue changes (potential Aave V3 reactivation or new strategies), and contract upgrade proposals.

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (November 2026) or after 12 months of production history
- **TVL-based:** Reassess if TVL exceeds $500M or changes by more than ±50% from the current ~$300M
- **Incident-based:** Reassess after any exploit, operator default, slashing event, or governance incident
- **Governance-based:** Reassess if multisig threshold or signers change, or if deployer EOA's EXECUTOR_ROLE is revoked (positive signal)
- **Operator-based:** Reassess if new operators are onboarded or existing operators experience issues
- **Protocol-based:** Reassess if either Morpho vault (Steakhouse Prime, Gauntlet Prime) utilization consistently exceeds 90% or experiences a security incident; reassess if the Aave V3 leg is reactivated or any new strategy is added to the USDC FRV default queue
- **Upgrade-based:** Reassess after any contract upgrade via Timelock
