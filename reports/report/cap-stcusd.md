# Protocol Risk Assessment: Cap — stcUSD

- **Assessment Date:** March 20, 2026 (Updated: October 4, 2026)
- **Token:** stcUSD (Staked cap USD)
- **Chain:** Ethereum
- **Token Address:** [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- **Final Score: 2.72/5.0**
- **Snapshot:** Ethereum block [26,114,512](https://etherscan.io/block/26114512), October 3, 2026 at 21:29:59 UTC; hash `0x948c259667c7b9479d2152bc2068808ab21fc6ffaa50b57a4b363d1b08810c29`. Current Ethereum calls and storage reads use this block; historical Safe continuity reads use block 25,160,215. API data is separately dated. Remote blocks at the same timestamp: Katana [44,320,188](https://katanascan.com/block/44320188), MegaETH [28,265,988](https://mega.etherscan.io/block/28265988), Tempo [42,471,037](https://explore.tempo.xyz/block/42471037); hashes and public-RPC archive reads are in the [October 4 follow-up evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json). [Snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json).

## Overview + Links

stcUSD is a **yield-bearing ERC-4626 vault token** issued by Cap. Users stake cUSD to receive stcUSD; yield increases the cUSD exchange rate. cUSD reserves earn through onchain fractional reserve deployment and fees from covered operator loans. Borrowing, repayment, collateral coverage, and liquidation are onchain; operators' proprietary trading strategies remain offchain. Cap's documentation describes the collateral providers as [underwriters](https://docs.cap.app/concepts/delegation.md).

**Key architecture:**

- **cUSD:** Permissionless mint/burn against two whitelisted reserve assets: USDC (**99.88%** of nominal accounted reserves) and wWTGXX (**0.12%**). The fee configuration has a 33% optimal ratio, but zero fee slopes; this is not a hard concentration ceiling.
- **stcUSD:** ERC-4626 wrapping cUSD. `totalAssets()` represents **97.06%** of cUSD supply; this measures staked underlying rather than comparing share supply with cUSD supply.
- **Fractional Reserve:** USDC Yearn V3 vault has **$6.186M** of assets: **$6.086M Aave V3 (98.38%)** and **$100K Ondo rUSDY (1.62%)**. Former Morpho strategies are revoked with zero debt. The wWTGXX vault has **76,915.77 tokens**, of which cUSD's shares convert to **71,578.27 tokens**.
- **Operator loans:** **$55.346M USDC principal**, **89.94%** of accounted USDC reserves. Per-agent debt including interest totals **$55.393M**. The largest agent has **53.75%** of that debt.
- **Security networks:** Symbiotic and EigenLayer isolate coverage by borrower. EigenLayer covers **$838K**, or **1.51%** of accrued USDC debt; the remainder is mapped to Symbiotic.
- **Governance:** 3-of-5 Safe → 24-hour timelock for core upgrades, access grants/revocations, new reserve assets, and selected parameters. The Safe also holds direct configuration and full reserve-vault roles, so the delay does not protect every risk-changing action.
- **Bridge:** LayerZero lockbox holds **10.287M stcUSD (18.64% of Ethereum supply)** in pooled escrow for configured Katana, MegaETH, and Tempo peers. It transfers existing canonical tokens and cannot mint canonical stcUSD.

**Key metrics ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)):**

- **cUSD supply:** 61,610,362.18 cUSD.
- **stcUSD supply / assets:** 55,197,514.91 shares / 59,800,669.88 cUSD.
- **Price per share:** 1.083394 cUSD per stcUSD (`convertToAssets(1e18)`).
- **Accounted reserves:** 61,534,168.77 USDC + 75,864.86 wWTGXX. These are accounting claims, including operator principal; they are not all liquid custody balances.
- **USDC outside operator principal:** 6,188,597.98 USDC (**10.06%** of USDC reserve accounting), including 2,879.72 USDC directly held by cUSD.
- **Protocol TVL:** **$272.70M**, including collateral tracked by [DeFiLlama](https://api.llama.fi/protocol/cap), retrieved October 3, 2026. Latest API point dated October 3; 30 returned observations span September 5–October 3 and decline **19.26%** from $337.73M. This API series is separate from the Ethereum block snapshot.
- **Fees / pauses:** Minimum mint fee 0.10%, mint/burn fee slopes zero, basket redeem fee zero. Global and both reserve-asset pauses are false.
- **Launch:** August 19, 2025; approximately 13.5 months in production.

**Links:**

- [Cap Documentation](https://docs.cap.app/)
- [Cap Lending Mechanics](https://docs.cap.app/overview/protocol-overview/stcusd-mechanics)
- [Cap Protocol Overview](https://docs.cap.app/overview/protocol-overview)
- [Cap Audits](https://docs.cap.app/resources/audits)
- [DeFiLlama: Cap](https://defillama.com/protocol/cap)
- [Snapshot evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)

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
| USDC Fractional Reserve Vault | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | Yearn V3 vault — $6.086M Aave V3 + $100K Ondo rUSDY |
| wWTGXX Fractional Reserve Vault | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | Yearn V3 vault — 76,915.77 wWTGXX via holder strategy; cUSD owns 71,578.27 tokens of value |
| cUSD Adapter | [`0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf`](https://etherscan.io/address/0xAcc9ce4C15A0F6A2bec49C3F81261d60553D2Faf) | cUSD integration adapter |
| stcUSD Adapter | [`0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0`](https://etherscan.io/address/0xdf48Eb321B38bc19E7F5b2CCA8242Cc6B9a6EcD0) | stcUSD integration adapter |

### Governance Contracts

Verified at the header's fixed block; roles are fully enumerated from Access Control getters and the Timelock's complete grant/revoke event history, with current `hasRole` confirmation ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)).

| Contract | Address | Configuration |
|----------|---------|---------------|
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | `getMinDelay() = 86400`; sole DEFAULT_ADMIN on both Access Control and Timelock. Sole Access Control grant/revoke authority and sole core upgrade authority |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Safe v1.4.1, 3-of-5. Sole Timelock proposer/canceller; one of two executors. Five EOA owners, publicly anonymous; exact owner set and threshold match historical reads at block 25,160,215. Owner sets are preserved in the evidence |
| Deployer EOA | [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52) | Timelock executor, without proposer/canceller/admin rights. Also direct protocol pause permission and reserve-vault roles; its permissions are broader than Timelock execution |
| Reserve RoleManager | [`0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24`](https://etherscan.io/address/0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24) | Both Yearn V3 vaults' `role_manager()`. `getGovernance()` = Timelock; `getManagement()` = Safe. Independently, each vault's `roles(Safe) = 16383` (all 14 role bits), `roles(deployer) = 6512`; role-manager governance does not impose a delay on existing vault roles |
| OFT lockbox | [`0x983aeaaa0d0426839158435c43725ea7f45d4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) | UUPS owner = Timelock; LayerZero endpoint delegate = Safe, which can change endpoint security configuration directly |

### Security Network Integration

| Contract | Address | Purpose |
|----------|---------|---------|
| Network | [`0x98e52Ea7578F2088c152E81b17A9a459bF089f2a`](https://etherscan.io/address/0x98e52Ea7578F2088c152E81b17A9a459bF089f2a) | Cap's Symbiotic network registration |
| Network Middleware | [`0x09A3976d8D63728d20DCDFEe1e531C206Ba91225`](https://etherscan.io/address/0x09A3976d8D63728d20DCDFEe1e531C206Ba91225) | Slashing/reward logic |
| Vault Factory | [`0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e`](https://etherscan.io/address/0x0B92300C8494833E504Ad7d36a301eA80DbBAE2e) | Deploys per-operator Symbiotic vaults |
| Agent Manager | [`0x08A728CF4E6b39f4AFa059c6eE376103722953eA`](https://etherscan.io/address/0x08A728CF4E6b39f4AFa059c6eE376103722953eA) | Manages operator-vault whitelisting |
| EigenLayer Service Manager | [`0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd`](https://etherscan.io/address/0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd) | EigenServiceManager; $838K accrued USDC debt mapped to this network |
| EigenLayer Agent Manager | [`0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9`](https://etherscan.io/address/0xa82f6f9E67E127621F3e5F3953bEEf926b4B5bA9) | EigenAgentManager; borrower onboarding and coverage settings |

### Oracles

| Contract | Address | Purpose |
|----------|---------|---------|
| Primary USDC reserve feed | [`0xeef31c7d9f2e82e8a497b140cc60cc082be4b94e`](https://etherscan.io/address/0xeef31c7d9f2e82e8a497b140cc60cc082be4b94e) | RedStone USDC_V2 feed, queried through ChainlinkAdapter; price $0.99993498, last update October 3, 2026 at 12:08:23 UTC |
| Backup USDC reserve feed | [`0x8fffffd4afb6115b954bd326cbe7b4ba576818f6`](https://etherscan.io/address/0x8fffffd4afb6115b954bd326cbe7b4ba576818f6) | Chainlink USDC/USD via the same adapter |
| wWTGXX pricing | [`0xC96d5EC90B07fe2a96253990Dc7eF2df22FDe0b3`](https://etherscan.io/address/0xC96d5EC90B07fe2a96253990Dc7eF2df22FDe0b3) | FixedPriceOracle returns $1 and block timestamp; it does not observe fund impairment |

`Oracle.priceOracleData`, `priceBackupOracleData`, `getPrice`, and `staleness` are in the [snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json). USDC staleness is **86,600 seconds**; wWTGXX staleness is zero. Oracle adapter/payload changes are timelocked, but the Safe can change staleness directly.

### Morpho Markets

(stcUSD / PT-stcUSD / PT-cUSD as collateral)

Ethereum stcUSD markets queried from [Morpho's API](https://api.morpho.org/graphql) on October 3, 2026, separately from the fixed block. Eight matching markets have only **$148.44 supply** and **$35.71 borrowed** in aggregate. This is dust rather than material alternative liquidity; it does not measure DEX or other-chain liquidity. Market IDs and API responses are in the [evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json).

| Market | LLTV | Supply | Utilization |
|--------|------|--------|-------------|
| [stcUSD / USDC](https://app.morpho.org/ethereum/market/0x8abcf6d7bb7a4bd8720fef5fa27917ac50a88cf2bf1a97002f43fec3919a373c/) | 86% | $90.00 | 0% |
| [stcUSD / AUSD](https://app.morpho.org/ethereum/market/0x21181d33ac70b7290592338113e5af6e68c0e623ffaf932515727bb35f5690ef/) | 91.5% | $29.57 | ~100% |
| [stcUSD / USDT](https://app.morpho.org/ethereum/market/0xdbf4bc065d4e76f4505a523f2bba5e5ccdca94c16d67c3a6ff1dadbcbb26d4aa/) | 91.5% | $17.41 | 7.41% |

Other matching stcUSD markets have less than $5 supply each. A fully paginated [Pendle Ethereum registry](https://api-v2.pendle.finance/core/v1/1/markets?limit=100&skip=0) query on October 4 returned 494 markets. Four have canonical cUSD/stcUSD as their underlying, all with January 29 or July 23, 2026 maturities confirmed by `expiry()` at the fixed block; **no unmatured replacement Cap PT market was found in this registry**. This is an indexed-market result, not an exhaustive permissionless-deployment search. A separate [Morpho API](https://api.morpho.org/graphql) query finds 18 markets using these matured PTs, with **$33,623.61 supply / $30,908.50 borrow**. These outstanding matured positions are distinct from the eight direct stcUSD dust markets ([follow-up evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).

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

**Deployed coverage:** The PR 273 review identifies head commit [`224d7c593769fe58feaf3ac2a2f38e51528353e3`](https://github.com/cap-labs-dev/cap-contracts/commit/224d7c593769fe58feaf3ac2a2f38e51528353e3). Its reviewed `Vault.sol` and `RateOracle.sol` are byte-for-byte identical to the corresponding Etherscan-verified sources in the deployed September cUSD and Oracle implementations. This establishes source coverage for the reviewed rate-cap/reentrancy delta, not a full audit of every compiled dependency or inherited change. The review warns that pre-upgrade rates over 100% APR persist; all **43 current restaker-rate reads are ≤100% APR**. The March token review scopes `Token.sol`, not cUSD `CapToken.sol`. **TODO:** dedicated coverage for cUSD insurance-fund fee issuance/full inherited deployment and the new OndoHolder strategy remains unestablished in the published scopes ([source hashes and rate reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).

### Bug Bounty

- **Sherlock Bug Bounty:** [Program 114](https://audits.sherlock.xyz/bug-bounties/114) is live, with **critical-only** rewards capped at **1,000,000 USDC and 10% of funds at risk**. It requires an executable coded PoC, covers deployed Ethereum core contracts and inherited code, excludes known audit issues and external integrations, trusts protocol administrators, and applies a one-hour mitigation window when administrators can intervene. The repository scope is pinned to [`695c8280b410bce1b43c9254cb214be30fe51dde`](https://github.com/cap-labs-dev/cap-contracts/commit/695c8280b410bce1b43c9254cb214be30fe51dde); this does not independently prove coverage of later upgrades, OndoHolder, or remote-chain tokens ([October 4 terms evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).
- **Immunefi:** No listing established in this refresh
- **Safe Harbor:** No Cap entry appears among the **33 current public adoption entries** in the [official listing](https://safeharbor.securityalliance.org/), checked October 4. No indexed adoption is established; this does not prove absence of an unindexed agreement ([listing evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).

### On-Chain Complexity

The Cap system is **high complexity**:

- **Multi-contract architecture:** 10+ core contracts (cUSD, stcUSD, Lender, Oracle, Access Control, Delegation, Fee Auction, Fee Receiver, Fractional Reserve, Adapters)
- **Upgradeable proxies:** cUSD, stcUSD, and Access Control are ERC-1967 upgradeable proxies (proxy admin set to address(0), upgrades via Access Control roles through Timelock)
- **Security network integration:** Per-borrower Symbiotic/EigenLayer coverage, middleware for slashing/rewards, collateral delegation management
- **Operator model:** Offchain yield generation by institutional counterparties, onchain borrowing/repayment/liquidation
- **Multi-oracle system:** RedStone primary / Chainlink backup for USDC, and a fixed $1 oracle for wWTGXX
- **Cross-protocol dependencies:** Aave V3, Ondo rUSDY, Symbiotic, EigenLayer, RedStone/Chainlink, WisdomTree, and LayerZero. Morpho collateral markets are dust; no current Morpho reserve allocation

## Historical Track Record

- **Launch:** August 19, 2025; approximately 13.5 months as of October 3, 2026.
- **Historical supply:** cUSD was approximately 129M on March 20, 2026 and 97.73M on May 23, 2026; the fixed October snapshot is 61.61M ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)).
- **Historical PPS snapshots:** 1.0531 on March 20, 2026; 1.0630 on May 23, 2026; 1.083394 at the October snapshot. These observations do not establish that PPS never decreased between snapshots.
- **TVL peak and drawdown:** [DeFiLlama](https://api.llama.fi/protocol/cap) records $483.79M on January 28, 2026 and $272.70M on October 3, 2026, a **43.63%** decline. In the recent API series, September 24–25 declined from $339.73M to $292.81M (**13.81%**).
- **Security incidents:** No confirmed exploit established by the sources reviewed for this refresh. One small undercollateralized operator position is recorded below; this is not proof of a realized protocol loss.
- **cUSD upgrade:** On September 28, 2026, [transaction](https://etherscan.io/tx/0x8e61ca35d40b6a9d2446554e989d980660d49553a11af05756cb5992597cef62) installed [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97) at block 26,077,312. Current verified source includes cUSD mint-fee issuance to the insurance fund. The transient reentrancy-guard delta matches the PR 273 review; dedicated insurance-fund fee coverage remains unestablished.

**Team track record:**

- **Benjamin918 (CEO):** Previously scaled QiDAO from $0 to $400M TVL
- **the_weso (CTO):** Founding member of Beefy Finance (peaked at $1B+ TVL)

**Funding:** $11M total raised — $3M pre-seed, $8M seed (co-led by Franklin Templeton and Kraken Ventures), $1.1M community round on Echo. Investors include Franklin Templeton, Kraken Ventures, Blockchain Capital, a16z crypto, Dragonfly, Lightspeed Faction, Susquehanna (SIG), Nomura's Laser Digital, GSR, Robot Ventures, and others.

## Funds Management

### Yield Generation

stcUSD earns yield from two primary sources:

**1. Fractional Reserve Deployment**

The USDC vault and wWTGXX vault are Yearn V3 vaults. Debt, maximum debt, depositor shares, asset conversions, queues, and withdrawal limits were read at the fixed block ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)).

| USDC reserve strategy | Current debt / share of FRV | Maximum debt | Status |
|-----------------------|-----------------------------|--------------|--------|
| [Aave V3 USDC Lender](https://etherscan.io/address/0x7D7F72d393F242DA6e22D3b970491C06742984Ff) | $6,085,718.50 / **98.38%** | $50M | Active, first in default queue |
| [OndoHolder USDC](https://etherscan.io/address/0x9939009295eAD3c67259aF3b93C284079ffE931e) | $100,000.00 / **1.62%** | $15M | Active, second in default queue |
| [Steakhouse Prime Compounder](https://etherscan.io/address/0xBAed9839573d349e42DFbF23a8916e5AB9cAf2E3) | $0 | $0 | Revoked: `strategies()` returns four zeros; strategy supply/assets zero |
| [Gauntlet Prime Compounder](https://etherscan.io/address/0x8092C20351CF4048B464DF2144Dc8a4DD49ce71D) | $0 | $0 | Revoked: `strategies()` returns four zeros; strategy supply/assets zero |

**USDC FRV:** [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072), `totalDebt() = totalAssets() = $6,185,718.50`, `totalIdle() = 0`. cUSD owns all reported depositor shares; `convertToAssets(balanceOf(cUSD))` and `maxWithdraw(cUSD)` both return this amount. Both vaults are active (`isShutdown() = false`), have zero minimum idle, and have unlimited vault deposit limits. Maximum debts authorize future allocations; they are not amounts currently invested.

**Ondo leg:** The holder has no idle USDC and holds **100,000.0000003 rUSDY** at [`0xaf37c1167910ebC994e266949387d2c7C326b879`](https://etherscan.io/address/0xaf37c1167910ebC994e266949387d2c7C326b879). Its [verified source](https://etherscan.io/address/0x9939009295eAD3c67259aF3b93C284079ffE931e#code) values rUSDY at 1:1 after decimal conversion and uses [`0xa42613C243b67BF6194Ac327795b926B4b491f15`](https://etherscan.io/address/0xa42613C243b67BF6194Ac327795b926B4b491f15) (USDY_InstantManager) to subscribe/redeem. The strategy must satisfy Ondo identity/compliance checks; redemption depends on token-router liquidity, fees, oracle pricing, and rate limits. `redeemPaused()` is false and USDC is an accepted redemption token. `availableWithdrawLimit()` returns uint256 maximum for its depositor, without measuring those external gates. **Read-only withdrawal simulations succeeded** for **$1, $1,000, and the full $100,000 position**, calling the strategy from its actual depositor vault at the fixed block with zero tolerated loss. The full call returns **99,969,745,256 strategy shares burned**. These `eth_call` results exercise redemption but do not send a transaction or guarantee future execution ([simulation evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)). The Safe is strategy `management()` and can change `exchange` directly.

**wWTGXX FRV:** [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) has **76,915.77 wWTGXX** in [Holder wWTGXX](https://etherscan.io/address/0xB0D399E8A11E1c6df00E1Fb5698936B5614e9259). cUSD's shares convert to **71,578.27 wWTGXX**; total vault assets must not be attributed wholly to cUSD. cUSD separately holds **4,348.21 wWTGXX**. WisdomTree fund-token redemption and the fixed $1 valuation remain external trust assumptions.

**Concentration:** Aave is the principal liquid reserve venue, but its $6.09M position is only about **9.88% of cUSD supply**. Operator principal represents almost 90% of USDC reserve accounting. Neither the inactive Morpho vaults nor their underlying markets are current reserve dependencies.

**2. Operator Borrowing Fees**

Operators borrow at a dynamic benchmark-plus-utilization rate. The current USDC `Oracle.benchmarkRate()` is **3.5%** ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)); the realized yield split and a current 90-day average were not established in this refresh. The hurdle rate is a function of:

- **Market rate:** Benchmarked against Aave USDC supply rate (competitive floor)
- **Utilization rate:** Piecewise linear adjustment that escalates sharply at high utilization

Operators generate yield through proprietary strategies: HFT, private credit, cross-market arbitrage, MEV capture, funding rate arbitrage, and token farming. Named operators include **IMC Trading**, **Edge Capital**, and **Susquehanna Crypto**.

**Yield distribution (example with 15% operator yield, 8% hurdle rate):**

- 8% flows to stcUSD holders (hurdle rate)
- 2% goes to restakers (negotiated premium)
- 5% remains as operator profit

### Collateralization

**Accounting and custody must be distinguished.** `totalSupplies(USDC)` is **61,534,168.77 USDC**; `totalBorrows(USDC)` is **55,345,570.79 USDC principal**. The difference is **6,188,597.98 USDC**, reconciling to USDC FRV assets plus **2,879.72 USDC** directly held by cUSD, within sub-cent accounting differences. wWTGXX supply accounting is **75,864.86 tokens** = **71,516.65 principal loaned to its FRV** + **4,348.21 tokens** held directly. Its actual cUSD-owned FRV share value is **71,578.27 tokens**, including yield ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)).

At $1 nominal values, reserve accounting totals **61,610,033.63**, versus **61,610,362.18 cUSD supply** (approximately **$328.55 / 0.00053%** difference). These getters do **not** prove exact 1:1 market-value backing: USDC's oracle price is $0.99993498, wWTGXX is fixed at $1, operator debt is a credit claim, and recoverability depends on collateral realization. No confirmed realized shortfall is inferred from this small accounting difference.

43 agents are enumerable; 17 have positive USDC debt. Per-agent `Lender.debt()` includes accrued restaker interest and totals **$55,392,597.34**, distinct from vault principal. The five largest positions account for **91.78%** of accrued debt:

| Agent | USDC debt including interest | Debt share | Configured LTV / liquidation threshold | Current health |
|-------|------------------------------|------------|---------------------------------------|----------------|
| [`0x0D35D950FDb0741F11c4384dAd15A07EdB26E21A`](https://etherscan.io/address/0x0D35D950FDb0741F11c4384dAd15A07EdB26E21A) | $29.776M | 53.75% | 60% / 80% | 1.331 |
| [`0x7F2165014A477f6ABA532000d8088Ed64dD1eBA1`](https://etherscan.io/address/0x7F2165014A477f6ABA532000d8088Ed64dD1eBA1) | $8.430M | 15.22% | 50% / 80% | 1.596 |
| [`0x3fA0d4Ce8c396B03beB3D8411e10b0126A1B913d`](https://etherscan.io/address/0x3fA0d4Ce8c396B03beB3D8411e10b0126A1B913d) | $5.343M | 9.65% | 50% / 80% | 3.356 |
| [`0x4Cd7C473985Ca1399810536e0482dF1e4E0672D6`](https://etherscan.io/address/0x4Cd7C473985Ca1399810536e0482dF1e4E0672D6) | $4.809M | 8.68% | 50% / 80% | 2.624 |
| [`0x624C31fdFB9CcbAF182a3c503Cf245BCa671b860`](https://etherscan.io/address/0x624C31fdFB9CcbAF182a3c503Cf245BCa671b860) | $2.480M | 4.48% | 50% / 80% | 3.226 |

The small agent [`0x77df7B5aBF875894Ffb1443Fd2840b603d3AC1DA`](https://etherscan.io/address/0x77df7B5aBF875894Ffb1443Fd2840b603d3AC1DA) owes **592.24 USDC**, has **$152.22** delegated/slashable collateral, health **0.2056**, and `liquidationStart = 0`. It is below the liquidation threshold despite its small size. All 43 `liquidationStart()` reads are zero; that does not establish a clean historical default/slashing record. Historical reads around the [June 2, 2026 collateral withdrawal](https://etherscan.io/tx/0xc7baeed30ea683141f5cf35bd6422d8bde5485606b49465bceca69499357976c) at block 25,230,395 show **0.853529535 collateral tokens** removed from active stake: delegated value falls from **$2,141.91 to $108.41**, while approximately **$671.67 USDC debt** remains, and health falls **2.552 → 0.129**. Slashable historical collateral remains temporarily available, which does not prevent the immediate coverage decline. The last recorded repayment is a [partial $100 USDC payment on August 19](https://etherscan.io/tx/0x79d13e5010ab662fd1e10143e0c720b7b8ee873a5e34b9464e5343931dd95afe). Complete lender-event scans find no open/close/liquidate events for this borrower through the fixed block. **TODO:** actual repayment or liquidation recovery remains unresolved; partial repayments are not proof of remediation ([history and adjacent-block reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).

Symbiotic covers 98.49% of current accrued USDC debt; [EigenLayer Service Manager](https://etherscan.io/address/0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd) covers 1.51%. The borrower-address table does not attribute addresses to the historically named institutions. The live largest position uses 60% configured LTV, so a universal 50% LTV claim is incorrect.

- **Liquidation parameters:** 12-hour grace, 3-day expiry, 10% bonus cap, and target health 1.25, verified from Lender getters. The Safe can change grace, expiry, bonus, and agent LTV/thresholds directly.
- **Slashing:** Permissionless liquidation can call the relevant security-network collateral path; coverage is isolated per borrower. Recoverable value depends on the collateral, oracle, and liquidation execution, not just nominal accounting.

### Accessibility

- **Deposits:** Permissionless — deposit cUSD to receive stcUSD (ERC-4626 standard)
- **Withdrawals:** ERC-4626 standard. Redeem stcUSD for cUSD
- **cUSD minting:** Deposit whitelisted reserve assets at oracle price with 0.10% minting fee
- **cUSD burning:** Receive a single reserve asset at oracle price with dynamic fee
- **cUSD redemption:** Receive the proportional reserve basket; current redeem fee is zero. Redemption remains bounded by available reserves and external strategy withdrawals
- **Restaker withdrawal delay:** All **34 mapped Symbiotic vaults** have **604,800-second (7-day) epochs** and the same verified Vault implementation. Withdrawals are assigned to the next epoch and claimed only after that epoch ends: approximately **7–14 days from request**, subject to slashing and claim execution. EigenLayer [DelegationManager](https://etherscan.io/address/0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A) has `minWithdrawalDelayBlocks = 100800`, and [AllocationManager](https://etherscan.io/address/0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39) has `DEALLOCATION_DELAY = 100800` blocks (approximately 14 days at 12 seconds/block). These collateral-exit rules do not establish a universal cUSD redemption or recovery deadline ([source and per-vault reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).

### Token Mint Authority

Re-verified against source-verified cUSD implementation [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97) and stcUSD implementation [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31) ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)).

| Caller / path | Mint / burn authority | Backing check |
|---------------|----------------------|---------------|
| Any stcUSD depositor | ERC-4626 `deposit` / `mint`; shares burned on withdrawal | Atomic cUSD transfer in |
| Any cUSD minter | `Vault.mint(asset, amountIn, minAmountOut, receiver, deadline)`; caller burns its own cUSD for exits | Whitelisted asset, capacity, oracle price, pause checks, and atomic reserve transfer |
| cUSD mint-fee issuance | The same deposit call mints the fee as cUSD to `insuranceFund()` [`0x5Eaf535b1e399DE08Db23b4E18bD3cD29E16b825`](https://etherscan.io/address/0x5Eaf535b1e399DE08Db23b4E18bD3cD29E16b825) | User output plus fee issuance share the deposited reserve backing; no separately callable privileged mint |
| LayerZero lockbox [`0x983aeaaa0d0426839158435c43725ea7f45d4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) | Escrows/releases existing stcUSD; no canonical mint/burn role | Authenticated peer/message path then `safeTransfer`; loss exposure is pooled canonical escrow and remote claims |

There is **no privileged standalone unbacked mint function** in these verified implementations. This does not eliminate indirect unbacked issuance: a malicious upgrade, inflated oracle, or worthless whitelisted reserve can impair economic backing. Core upgrades, reserve additions, oracle adapter/payload changes, deposit caps, and fee schedules are timelocked. Emergency/configuration powers outside that delay are detailed below.

Current USDC deposit cap is uint256 maximum; wWTGXX cap is **6M tokens**, with **5,924,135.14 tokens** remaining. Both reserve floors are zero. Fees are denominated in ray: `minMintFee = 1e24` is **0.10%**; slopes are zero and the configured 33% optimal ratio is a fee input, not an enforceable diversification cap.

**LayerZero exposure:** `balanceOf(lockbox)` = **10,286,620.48 stcUSD**, or **18.64%** of canonical supply. Complete `PeerSet` event enumeration plus current `peers()` finds nonzero peers for **Katana (30375)**, **MegaETH (30398)**, and **Tempo (30410)**; endpoint 30390 is disabled. The lockbox's pool cannot be attributed wholly to Katana.

Each active **remote→Ethereum escrow-release** route uses receive library [`0xc02Ab410f0734EFa3F14628780e6e695156024C2`](https://etherscan.io/address/0xc02Ab410f0734EFa3F14628780e6e695156024C2), **15 confirmations**, **3 required DVNs**, and **no optional DVNs**. Providers are [LayerZero Labs](https://etherscan.io/address/0x589dEDbD617e0CBcB916A9223F4d1300c294236b), [Canary](https://etherscan.io/address/0xa4fE5A5B9A846458a70Cd0748228aED3bF65c2cd), and [Nethermind](https://etherscan.io/address/0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5), attributed using [LayerZero metadata](https://metadata.layerzero-api.com/v1/metadata). Ownership/UUPS upgrades are held by the Timelock, but the endpoint **delegate is the Safe**, allowing direct security-configuration changes. All three Ethereum send configurations and the receive/send configurations for all **nine remote inbound routes** are also read at matching-time blocks, covering the fully enumerated four-chain peer mesh. All 12 receive-library grace entries return the zero address and zero expiry, so no additional old receive library is enabled at the snapshot. Every configured receive path requires **3-of-3 LayerZero Labs / Canary / Nethermind, 15 confirmations, no optional DVNs**; chain-local DVN addresses and raw ULN tuples are in the [follow-up evidence](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json).

| Remote chain / token | Source-verified implementation | Supply in stcUSD units |
|---------------------|--------------------------------|-----------------------|
| Katana [`stcUSD`](https://katanascan.com/address/0x88887be419578051ff9f4eb6c858a951921d8888) | [`L2TokenUpgradeable`](https://katanascan.com/address/0xdf784f64f0498e5d671cd6c50d2ded402959d306) | 90,917.176288 |
| MegaETH [`stcUSD`](https://mega.etherscan.io/address/0x88887be419578051ff9f4eb6c858a951921d8888) | [`L2TokenUpgradeable`](https://mega.etherscan.io/address/0x3b2bf0834130878e0568b8047061a77e234ef37b) | 10,171,828.083819 |
| Tempo [`stcUSD` TIP-20](https://explore.tempo.xyz/address/0x20c0000000000000000000008ee4fcff88888888) | [`TempoBridgeUpgradeable`](https://explore.tempo.xyz/address/0x0a1635eacee7dde9792ce2b7ae5bc373878d389b), via [adapter](https://explore.tempo.xyz/address/0x4eec5b8fdfbcdd45dfb29f666d9c34ad38c7afa5) | 23,872.216376 (6 decimals) |

Katana and MegaETH OFTs mint only in their authenticated receive `_credit` path and burn on send. Tempo's adapter mints/burns the separate TIP-20; its **sole current `ISSUER_ROLE` holder is the adapter**, and its sole role admin is the remote timelock, established by a complete six-event membership history and current `hasRole` reads. Tempo's token is unpaused with an always-allow transfer policy; the adapter's timelock owner can also replace its underlying token.

Remote owner timelocks share address [`0x0000000035A7744F94e6949431CE20EA77312a55` on Katana](https://katanascan.com/address/0x0000000035A7744F94e6949431CE20EA77312a55), [MegaETH](https://mega.etherscan.io/address/0x0000000035A7744F94e6949431CE20EA77312a55), and [Tempo](https://explore.tempo.xyz/address/0x0000000035A7744F94e6949431CE20EA77312a55). Each has a **24-hour delay**, sole self-admin, and the chain-local Safe as sole proposer/canceller/executor. Their runtime bytecodes are identical to the source-verified Katana/MegaETH timelock. All three local Safe delegates have the same **3-of-5 threshold and exact five-owner set** as the Ethereum Safe, and can directly change endpoint configuration. These are shared signer trust, not independent governance quorums.

The three remote supplies sum to **10,286,617.476483 stcUSD** versus **10,286,620.476483 canonical escrow**, a **3.000000 stcUSD escrow surplus**. Its cause is not established; matching-time supply reads do not reconcile in-flight packets or prove settlement finality. Malicious remote upgrades, new issuer grants, token replacement, or weaker receive settings can create claims redeemable against pooled canonical custody. All measured verification settings are mutable ([full mesh, source fingerprints, roles, and reconciliation](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-followup-2026-10-04.json)).

### Provability

- **stcUSD exchange rate:** Onchain ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic
- **Reserve composition:** Onchain — reserve assets held in the vault contracts are verifiable
- **Fractional reserve positions:** Onchain — Yearn strategy debt, depositor-share conversions, Aave liquidity, and Ondo rUSDY balance are verifiable; RWA redemption and proprietary operator strategies add offchain assumptions
- **Operator positions:** Partially onchain — borrowing/repayment recorded onchain, but operators' actual yield strategies are offchain and opaque
- **Slashing conditions:** Onchain verifiable — objective fault conditions, no governance discretion

## Liquidity Risk

- **Primary exit:** stcUSD → cUSD through ERC-4626, followed by cUSD burn for a chosen reserve or basket redemption. stcUSD has no staking lock; underlying liquidity still constrains the final exit.
- **USDC buffer:** **$6.189M**, or **10.06%** of USDC reserve accounting, lies outside operator principal; **$55.346M** is outstanding credit. The active Aave strategy reports approximately **$155.72M** available withdraw liquidity, above its $6.086M position, and the FRV reports `maxWithdraw(cUSD) = $6.186M` at this block ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)). These values can change with Aave utilization and do not accelerate operator repayment.
- **Ondo gate:** The $100K leg depends on KYC/compliance, rate limits, oracle/fees, and router liquidity. Fixed-block strategy simulations succeeded through the full position; its declared unlimited limit does not guarantee future execution. A small request below the minimum redemption can also fail.
- **Large exit:** A 20% cUSD exit is about **$12.32M**, exceeding the available non-operator USDC buffer. Larger withdrawals depend on operator repayment or new inflows; a permissionless call can revert for insufficient underlying liquidity rather than enter a guaranteed withdrawal queue. No unconditional full-exit time is established.
- **Secondary liquidity:** The October 3 [Morpho API](https://api.morpho.org/graphql) snapshot shows only $148.44 across Ethereum stcUSD collateral markets. No current DEX-depth claim is established. The separately dated October 4 registry/API checks find only matured Cap PTs, with $33.62K Morpho supply; no unmatured Ethereum replacement is indexed.
- **Bridge exits:** The pooled 18.64% escrow exposure adds LayerZero message/security and remote-token risks before canonical redemption.
- **Restaker withdrawals:** Epoch-based withdrawal mechanics remain a separate collateral constraint; they are not an stcUSD withdrawal guarantee.

## Centralization & Control Risks

### Governance

Core token upgrades and Access Control administration are protected by the **3-of-5 Safe → 24-hour Timelock** path. Direct operational and parameter powers coexist with that path ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json)); [protocol documentation](https://docs.cap.app/concepts/access-controls) describes function-specific roles, not a universal delay.

| Authority | Current holders | Effect |
|-----------|-----------------|--------|
| Core proxy upgrades (`bytes4(0)` role); Access Control DEFAULT_ADMIN and grant/revoke selectors | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) alone | Can replace token/control logic or grant new permissions after 24h |
| cUSD `addAsset`, `setDepositCap`, `setFeeData`, `setRedeemFee`, `setFractionalReserveVault`; oracle price/backup/market/utilization adapters | Timelock alone | Reserve addition, caps, fees, destination vault, and oracle configuration after 24h |
| cUSD `removeAsset`, `setReserve`, `setWhitelist`, `setInsuranceFund`, divest; Lender `setGrace`, `setExpiry`, `setBonusCap`; Delegation `modifyAgent` | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) directly | Can change reserve floor, fee exemption/recipient, liquidity deployment, and liquidation/LTV parameters without scheduling a timelock operation. Asset removal requires zero accounted supply; rescue is restricted to unsupported assets |
| Oracle `setStaleness` | Safe and Timelock | Safe can relax or tighten stale-price acceptance directly |
| cUSD `pauseProtocol` | Safe, [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52), [`0x5143957cfCA5c683a2b6B4Bdb715a9d9aCF6d77a`](https://etherscan.io/address/0x5143957cfCA5c683a2b6B4Bdb715a9d9aCF6d77a) | Direct emergency pause; unpause belongs to Safe |
| cUSD `investAll` | Safe and [`0x51da1eC8dC52F146e644F5F759D399038CCf7aB4`](https://etherscan.io/address/0x51da1eC8dC52F146e644F5F759D399038CCf7aB4) | Direct investment into the already selected FRV; cannot select a new FRV |
| cUSD `borrow` / `repay` | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) alone | Contract-authorized covered loan path |
| Yearn FRV roles | Safe: 16383; deployer: 6512 on both vaults | Safe has all 14 roles, including strategy/debt/queue configuration. RoleManager governance is Timelock, but current permissions execute directly |
| OndoHolder `management` | Safe | Direct `setExchange` changes the conversion/redemption venue |
| LayerZero owner / endpoint delegate | Timelock / Safe respectively | Owner controls UUPS upgrades/peers; delegate can alter receive security settings directly |

Every enumerated Access Control selector role has DEFAULT_ADMIN as its role admin; the Timelock is the sole holder. Timelock event history identifies the Safe as sole proposer/canceller, Safe plus deployer as executors, and Timelock itself as sole admin. Address-zero execution is not enabled. The complete current selector-holder matrix is preserved in the evidence.

Safe threshold and **exact owner set** match the recorded May 23 baseline at block 25,160,215. All five current owners return empty code (EOAs); no nested Safe is present. Public signer attribution remains anonymous. The Timelock protects core upgrades, but direct reserve-vault, liquidation, oracle-staleness, and bridge-delegate powers materially limit advance warning.

### Programmability

| Factor | Assessment |
|--------|-----------|
| stcUSD PPS | Onchain ERC-4626, fully algorithmic |
| Vault operations | Permissionless staking/unstaking onchain |
| Reserve deployment | Yearn V3 debt deployment to Aave V3 / Ondo, with direct Safe allocation control |
| Operator strategies | **Offchain** — operators execute proprietary strategies. Borrowing/repayment recorded onchain, but actual yield generation is opaque |
| Hurdle rate | Onchain — dynamic function of market rate + utilization |
| Slashing | Onchain — objective fault conditions, permissionless liquidation |

**Programmability is mixed:** Core vault mechanics (staking, PPS, reserve deployment, slashing) are fully onchain. However, the operator yield generation — which represents a portion of stcUSD yield — is offchain and opaque.

### External Dependencies

| Dependency | Criticality | Current exposure / loss path |
|------------|-------------|------------------------------|
| **Aave V3 Core Ethereum** | High | $6.086M USDC, 98.38% of FRV; pool losses or utilization impair the principal liquid reserve venue |
| **Ondo rUSDY** | Low current size; expandable | $100K (1.62% of FRV), with $15M maximum strategy debt. Compliance/issuer/oracle/rate-limit/router failure can block redemption or impair value; Safe can change exchange |
| **Symbiotic** | Critical | 98.49% of accrued operator USDC debt mapped to Symbiotic; collateral/slashing failure undermines loan recovery |
| **EigenLayer** | Material | $838K / 1.51% of accrued operator debt through [`0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd`](https://etherscan.io/address/0xE65c3eccd18879E103dBC96D854e376Ced4cC7dd) |
| **RedStone / Chainlink** | High | RedStone USDC primary feed and Chainlink backup via ChainlinkAdapter. Oracle mispricing changes cUSD mint/burn value; staleness threshold has direct Safe control |
| **wWTGXX / WisdomTree** | Low current size | About $75.9K accounted backing; fixed $1 price does not track issuer/fund impairment |
| **USDC / Circle** | Critical concentration | 99.88% of nominal accounted reserves; freeze/depeg exposure propagates to cUSD and stcUSD |
| **LayerZero V2** | High | Pooled 10.287M stcUSD escrow, 18.64% of supply, for configured Katana/MegaETH/Tempo peers. Current release routes are 3-of-3; Safe can reconfigure endpoint security without an owner timelock |
| **Institutional operators / underwriters** | Critical | $55.346M principal is offchain credit; largest agent has 53.75% of accrued debt. Address-to-institution mapping is not independently established |
| **Morpho / Pendle** | No current reserve allocation | Morpho FRV strategies revoked/zero; Ethereum stcUSD markets are dust. All four indexed Ethereum Cap PTs are mature; $33.62K supply remains in associated Morpho markets, with no indexed unmatured replacement |

## Operational Risk

- **Team:** Cap Labs — Benjamin918 (CEO, ex-QiDAO $400M TVL) and the_weso (CTO, ex-Beefy Finance $1B+ TVL). Experienced DeFi founders but relatively small team
- **Funding:** $11M raised from tier-1 investors (Franklin Templeton, Kraken Ventures, a16z, Dragonfly, Blockchain Capital, Susquehanna). Strong institutional backing
- **Governance:** 3-of-5 multisig with anonymous signers and 24-hour timelock. No governance token. Core upgrades are delayed; direct parameter and reserve-vault authority remain
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
| wWTGXX FRV | [`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8) | cUSD-owned share value separately from total vault assets; fund-token custody and withdrawal limits |
| OndoHolder | [`0x9939009295eAD3c67259aF3b93C284079ffE931e`](https://etherscan.io/address/0x9939009295eAD3c67259aF3b93C284079ffE931e) | rUSDY balance, exchange changes, management, external redemption pause/compliance/rate limits |
| Lender / Delegation | [`0x15622c3dbbc5614E6DFa9446603c1779647f01FC`](https://etherscan.io/address/0x15622c3dbbc5614E6DFa9446603c1779647f01FC) / [`0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F`](https://etherscan.io/address/0xF3E3Eae671000612CE3Fd15e1019154C1a4d693F) | Enumerate agents; principal versus interest-bearing debt, coverage, health, configured LTV/thresholds, liquidation start, network mapping |
| Governance | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) / [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) / [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | Exact owner set/threshold; full role grants/revokes; 24h delay; selector-level direct authority; proxy upgrades |
| Reserve RoleManager | [`0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24`](https://etherscan.io/address/0x2995401cB465F3fbAE64a2D2f78Dfa571F570D24) | Governance/management holders and each vault's direct role bitmap, especially Safe 16383 and deployer 6512 |
| LayerZero lockbox | [`0x983aeaaa0d0426839158435c43725ea7f45d4137`](https://etherscan.io/address/0x983aeaaa0d0426839158435c43725ea7f45d4137) | Escrow/supply share, peer list, owner/delegate, per-route receive library/DVNs/confirmations, implementation |

### Critical Events to Monitor

- **Liquidity:** Alert when USDC outside operator principal falls below 10% of accounted USDC reserves (snapshot: 10.06%), or a 20% cUSD exit exceeds available backing liquidity. Aave withdraw liquidity and successful Ondo redemption need independent checks.
- **Operator concentration:** Largest current agent has 53.75% of accrued USDC debt. Monitor health below 1.25, all health below 1 immediately, and the ~$592 unhealthy position until repayment/liquidation is evidenced.
- **Direct parameter changes:** Grace/expiry/bonus, agent LTV/liquidation thresholds, stale-price allowance, reserve floors, FRV strategy/debt/queue roles, and Ondo exchange can change without a Timelock proposal.
- **Mint/backing:** Watch for whitelist/oracle/implementation changes that allow economically unsupported issuance; insurance-fund mint fees must reconcile to deposit value.
- **PPS / reserves:** Any PPS decrease, unexplained reserve-accounting discrepancy, USDC depeg/freeze, or wWTGXX issuer impairment merits investigation.
- **Bridge:** Current remote→Ethereum release routes each require 3-of-3 DVNs. All 12 receive routes and corresponding send configurations in the four-chain mesh are verified at matching-time blocks. Monitor remote upgrades, Tempo issuer/admin/token replacement, every active route, and direct Safe delegate changes.
- **Upgrades:** cUSD current implementation [`0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97`](https://etherscan.io/address/0xbdaa34082f1a1a3c32190a672bc9dd1b69791b97); stcUSD [`0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31`](https://etherscan.io/address/0x42c0e0ef7c2f35de073f4d6f9c0e4483429c3d31); Access Control [`0x6681eb184c876d74ea3ddfae0ecee0c9c0f84bc1`](https://etherscan.io/address/0x6681eb184c876d74ea3ddfae0ecee0c9c0f84bc1). Verify source and audit coverage for each proposed replacement.

## Risk Summary

### Key Strengths

- Broad published audit coverage and an ongoing disclosed bounty; assessed core implementations are source-verified.
- Core upgrades, access escalation, reserve additions, and oracle adapter changes are protected by a 24-hour Timelock with fully enumerated administration.
- Supplies, credit principal, interest-bearing debts, strategy allocations, collateral coverage, and permission holders are inspectable onchain.
- Current Aave withdrawal liquidity exceeds the active reserve strategy position; borrower collateral is isolated by security network.

### Key Risks

- **Direct configuration authority:** 3-of-5 anonymous EOA owners control full FRV permissions, liquidation/LTV settings, oracle staleness, and bridge endpoint delegation outside the core upgrade delay.
- **Credit and liquidity concentration:** 89.94% of USDC reserve accounting is operator principal. One borrower address represents 53.75% of accrued USDC debt; a larger exit depends on repayment.
- **Reserve quality versus liquidity:** USDC is 99.88% of nominal backing; accounting includes loans rather than exclusively liquid holdings. Aave, issuer, and collateral recovery risks propagate to cUSD/stcUSD.
- **RWA gate:** Ondo's small current position has $15M debt authorization and externally controlled compliance/redemption dependencies. Full-position withdrawal succeeds in a fixed-block simulation; future redemption remains subject to those gates.
- **Small unhealthy borrower:** ~$592 USDC debt has health 0.2056 and no started liquidation. Recovery status is unresolved.
- **Bridge custody:** 18.64% of canonical supply is pooled LayerZero escrow for multiple peers, with mutable delegate-controlled verification settings.
- **Audit coverage uncertainty:** The reviewed cUSD reentrancy/rate delta matches deployed verified source; dedicated insurance-fund fee and OndoHolder coverage remains TODO. Approximately 13.5 months of history does not establish stress-tested full-exit or collateral recovery performance.

### Critical Risks

- Correlated operator defaults or collateral impairment can overwhelm realizable coverage while the available reserve buffer is small.
- Safe compromise can immediately alter risk parameters/reserve deployment/bridge verification, and can replace core logic after 24 hours.

---

## Risk Score Assessment

**Scoring Guidelines:**

- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Source verification** — cUSD, stcUSD, Access Control, Lender, Oracle, Delegation, bridge lockbox, and security-network implementations are verified on Etherscan at the recorded implementation addresses; OndoHolder is verified. ✅ PASS ([snapshot reads](https://github.com/yearn/risk-score/blob/master/reports/data/cap-stcusd-2026-10-03.json))
- [x] **Audit coverage** — eight firms / eleven published reports; reviewed cUSD guard/rate files match deployed verified source, with insurance-fee/full inherited deployment and OndoHolder coverage caveats. ✅ PASS for published protocol audit history, with coverage caveat.
- [x] **Reserve verifiability** — accounting, custody/share conversions, debt, and coverage are inspectable. Operator strategies and RWA realization remain trust assumptions; no claim of exact liquid 1:1 backing. ✅ PASS with caveats.
- [x] **Governance** — 3-of-5 Safe with Timelock for core upgrades; direct configuration powers weaken protection but do not make control a single-EOA system. ✅ PASS.

No critical gate is triggered by the verified state. Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|------------|
| Audits / bounty | Eight firms, eleven public reports; cUSD guard/rate delta source-matches PR 273. Critical-only Sherlock bounty capped at $1M / 10% at risk; insurance-fee/Ondo audit coverage unresolved |
| Production history | Approximately 13.5 months; 1–2-year rubric band |
| Scale | $272.70M DeFiLlama TVL, including collateral; 61.61M cUSD supply |
| Incidents / stress | No confirmed exploit established; small unhealthy loan and full-exit stress performance unresolved |

**Score: 2.0/5** — Audit subscore 2.0 (broad reputable coverage and disclosed $1M bounty, with current-code coverage uncertainty) and historical subscore 2.0 (over one year and TVL above $50M) average to 2.0. No longevity modifier applies before two years.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 4.0/5**

The same anonymous 3-of-5 Safe controls core changes through a 24-hour Timelock, but also directly controls full FRV strategy/debt/queue authority, liquidation/LTV parameters, oracle staleness, and endpoint verification delegation. Those powers can materially change custody, credit risk, or oracle/message acceptance without advance notice. The governance rubric's low-threshold/powerful-admin band applies; the upgrade delay remains a meaningful constraint. Deployer pause and vault permissions add a separate operational trust surface.

**Subcategory B: Programmability — 2.5/5**

PPS, deposits, reserve accounting, credit/coverage, and liquidation are onchain. Allocation is admin-controlled and operators' proprietary strategies remain opaque. This supports the established hybrid-operation subscore.

**Subcategory C: Dependencies — 3.0/5**

Aave is the principal liquid reserve venue, with no current Morpho strategy debt. Symbiotic, EigenLayer, RedStone/Chainlink, USDC, WisdomTree, Ondo, and the LayerZero pooled escrow form material loss/availability paths. The Ondo leg is small; the multiple-peer escrow is bounded by canonical locked tokens under current logic. These dependencies support a subscore of 3.0, without treating the measured DVNs as immutable.

**Centralization Score = (4.0 + 2.5 + 3.0) / 3 = 3.166666…**

**Score: 3.1667/5** — Direct parameter and custody-control authority materially limits the protections of the core upgrade timelock. The final calculation uses the unrounded mean.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 2.5/5**

Nominal reserve accounting is 99.88% USDC and 0.12% wWTGXX. **89.94%** of accounted USDC is operator principal; the largest borrower address represents **53.75%** of accrued debt, with 60% configured LTV and health 1.331. Collateral remains enumerable and the small unhealthy position is not a demonstrated systemic loss, but concentrated offchain credit and externally realized RWA reserves justify a subscore of 2.5. Accounting equality alone does not establish recoverable backing.

**Subcategory B: Provability — 2.5/5**

Debt and collateral data, Yearn depositor-share conversions, and ERC-4626 PPS are observable. Proprietary borrower positions, collateral sale proceeds in stress, and RWA recovery/compliance remain outside full onchain verification. Current reserve-accounting mismatch is quantified rather than asserted to be exactly zero.

**Funds Management Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5** — Concentrated covered credit, rather than a wholly liquid reserve, is the dominant backing risk.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 3.5/5** — Approximately $6.19M USDC outside operator principal supports small exits; Aave reports adequate liquidity for its current position. A 20% cUSD exit exceeds this buffer, and full-exit timing is not established because most backing is operator credit. Ondo compliance/redemption gates and negligible measured Ethereum Morpho collateral liquidity reduce alternatives. This sits between the rubric's short-exit and restricted-large-exit bands; it does not assert an observed one-week queue or measured slippage. No drawdown-liquidity modifier is applied without withdrawal execution evidence.

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
Final = ((4.0 + 2.5 + 3.0) / 3 × 0.30) + (2.5 × 0.30)
      + (2.0 × 0.20) + (3.5 × 0.15) + (2.0 × 0.05)
      = 0.95 + 0.75 + 0.40 + 0.525 + 0.10
      = 2.725 → 2.72/5.0
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 3.166666… | 30% | 0.95 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.72/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (2.72/5.0) — Approved with enhanced monitoring**

The material risks are direct Safe configuration authority, concentrated operator credit, a roughly 10% USDC redemption buffer, RWA realization gates, and mutable bridge verification settings. Core upgrade timelocks and inspectable collateral remain protections. Monitor borrower health/concentration, actual exit liquidity, and direct role/parameter changes alongside scheduled upgrades.

---

## Reassessment Triggers

- **Time:** Refresh within 60 days, by December 3, 2026.
- **TVL / supply:** More than ±25% change from $272.70M protocol TVL or 61.61M cUSD supply.
- **Liquidity:** Non-operator USDC availability below 10% of accounted reserves; failed redemptions; Aave liquidity insufficient for the strategy position; Ondo redemption restrictions.
- **Credit:** Any material agent health below 1.25, any health below 1, larger borrower concentration, or unresolved unhealthy dust debt; confirm repayment/slashing recovery.
- **Governance:** Any Safe owner/threshold change, selector role grant/revoke, direct FRV role change, liquidation/LTV/staleness modification, or deployment of a new reserve strategy.
- **Bridge:** Peer addition/removal, endpoint delegate change, DVN/library/confirmation changes, or escrow concentration above 25%; separately verify remote implementations and supply before claiming bidirectional security.
- **Upgrade / audit:** Any core/lockbox/security-network implementation change; establish deployed coverage for the latest cUSD and OndoHolder code.
- **Incident:** Exploit, oracle/depeg/freeze, collateral recovery failure, operator default, or security-network slashing incident.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [March 20, 2026](https://github.com/yearn/risk-score/pull/101) | 2.4 | Initial assessment |
| [May 23, 2026](https://github.com/yearn/risk-score/pull/214) | 2.4 | Reassessment: USDC Fractional Reserve rebalanced to 100% Morpho (Steakhouse + Gauntlet); Aave V3 leg drained; LayerZero stcUSD/Katana OFT integration documented |
| [July 31, 2026](https://github.com/yearn/risk-score/pull/369) | 2.39 | LayerZero OFT escrow figures corrected (~26.1M stcUSD escrowed, ~38% of ~68.3M supply); Dependencies score unchanged |
| [October 4, 2026](https://github.com/yearn/risk-score/pull/509) | 2.72 | Reassessment: Aave/Ondo reserve allocation, concentrated operator debt and thin exit buffer, direct Safe authority, current implementations, full LayerZero peer mesh/mint controls, withdrawal simulations, and unhealthy-loan history; Medium Risk |
