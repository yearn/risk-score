# Protocol Risk Assessment: Cap — stcUSD

- **Assessment Date:** March 20, 2026
- **Token:** stcUSD (Staked cap USD)
- **Chain:** Ethereum
- **Token Address:** [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888)
- **Final Score: 2.5/5.0**

## Overview + Links

stcUSD is a **yield-bearing ERC-4626 vault token** issued by Cap (Covered Agent Protocol). Users stake cUSD (Cap's dollar-pegged stablecoin) to receive stcUSD, which auto-compounds yield from two sources: (1) **fractional reserve deployment** of idle cUSD reserves to Aave V3 and Morpho, and (2) **operator borrowing fees** from institutional market makers (IMC Trading, Edge Capital, Susquehanna Crypto) who borrow reserve capital for proprietary yield strategies secured by Symbiotic restaking collateral.

**Key architecture:**

- **cUSD:** Dollar-pegged stablecoin backed 1:1 by whitelisted reserve assets. Currently **2 assets accepted on-chain**: USDC (~96% of reserves) and wWTGXX/WisdomTree Government Money Market Digital Fund (~4%). Max 40% single-asset concentration rule exists but is not binding given current composition. Users mint by depositing reserves and burn/redeem to withdraw
- **stcUSD:** ERC-4626 vault wrapping cUSD. Yield accrues via exchange rate appreciation. ~76% of cUSD supply is staked as stcUSD
- **Fractional Reserve:** ~$75M USDC deployed via the USDC Fractional Reserve Vault (a Yearn V3 vault) — split between **Morpho Gauntlet USDC Prime** (~$50.2M, 67%) and **Aave V3 USDC Lender** (~$25.0M, 33%). An additional ~$5M wWTGXX is held in a separate Fractional Reserve Vault via a simple holder strategy
- **Operator Model:** Institutional operators borrow reserves at a dynamic hurdle rate (~5.2% avg over 90 days), execute off-chain/proprietary strategies (HFT, private credit, arbitrage, MEV), and return principal + hurdle rate. Excess yield is split between operators and restakers
- **Security Network:** Per-operator Symbiotic vaults with instant slashing. Restakers delegate collateral (ETH, wBTC, LSTs, stablecoins) to specific operators. If an operator defaults, their delegated collateral is slashed and redistributed to cover losses
- **Governance:** 3-of-5 Gnosis Safe multisig → 24-hour TimelockController → Access Control system. All contracts are upgradeable proxies

**Key metrics (March 20, 2026):**

- **cUSD Total Supply:** ~129,029,543 cUSD
- **stcUSD Total Supply:** ~93,554,000 stcUSD
- **stcUSD Total Assets:** ~98,522,086 cUSD
- **Price Per Share:** ~1.0531 cUSD/stcUSD (~5.3% cumulative appreciation since launch)
- **Fractional Reserve USDC:** ~$75.17M USDC (67% Morpho, 33% Aave V3)
- **Fractional Reserve wWTGXX:** ~$5.0M wWTGXX (WisdomTree Gov MMF)
- **Outstanding Debt USDC:** ~$48.86M
- **Protocol TVL (DeFi Llama):** ~$288M (includes restaker collateral)
- **Net APY:** ~5.2% (hurdle rate benchmark)
- **Minting Fee:** 0.10%
- **Launch Date:** August 19, 2025 (~7 months in production)

**Links:**

- [Cap Documentation](https://docs.cap.app/)
- [Cap stcUSD Mechanics](https://docs.cap.app/protocol-overview/stcusd-mechanics)
- [Cap cUSD Mechanics](https://docs.cap.app/protocol-overview/cusd-mechanics)
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

| Contract | Address | Configuration |
|----------|---------|---------------|
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | OZ TimelockController, 24-hour delay. Holds DEFAULT_ADMIN_ROLE on Access Control |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | 3-of-5 Gnosis Safe (v1.4.1). PROPOSER, EXECUTOR, CANCELLER roles on Timelock |
| Deployer EOA | [`0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52`](https://etherscan.io/address/0xc1ab5a9593e6e1662a9a44f84df4f31fc8a76b52) | Retains EXECUTOR_ROLE on Timelock (can execute queued proposals but cannot propose or cancel) |

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

### Morpho Markets (stcUSD as collateral)

| Market | Collateral | Loan Token | LLTV | Supply TVL | Utilization |
|--------|-----------|------------|------|-----------|-------------|
| stcUSD / USDC | stcUSD | USDC | 91.5% | ~$42M | ~91% |
| PT-cUSD-23JUL2026 / USDC | PT-cUSD (Pendle) | USDC | 91.5% | ~$2.3M | ~91% |
| PT-stcUSD-23JUL2026 / USDC | PT-stcUSD (Pendle) | USDC | 91.5% | ~$1.5M | ~91% |

## Audits and Due Diligence Disclosures

### Cap Protocol Audits

Cap has been audited by **7 firms** with **8 total reports** (including one PR review), covering the core protocol, security network, and invariant testing:

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
- **Operator model:** Off-chain yield generation by institutional counterparties, on-chain borrowing/repayment/liquidation
- **Multi-oracle system:** RedStone price feeds with staleness checks, Morpho oracle adapters
- **Cross-protocol dependencies:** Aave V3, Morpho, Symbiotic, RedStone, Pendle (for PT tokens)

## Historical Track Record

- **Launch date:** August 19, 2025 — **~7 months** in production
- **cUSD supply:** ~129M cUSD
- **stcUSD supply:** ~93.6M stcUSD (~76% staking ratio)
- **stcUSD PPS:** 1.0000 → 1.0531 (~5.3% cumulative return over ~7 months, ~9-10% annualized)
- **Security incidents:** None known
- **Cumulative yield paid:** $4M+ to stcUSD holders
- **Peak TVL:** ~$500M (January 2026)
- **Current TVL:** ~$288M (March 2026, includes restaker collateral)
- **Protocol age:** Relatively new — launched August 2025, audited from February 2025

**Team track record:**

- **Benjamin918 (CEO):** Previously scaled QiDAO from $0 to $400M TVL
- **the_weso (CTO):** Founding member of Beefy Finance (peaked at $1B+ TVL)

**Funding:** $11M total raised — $3M pre-seed, $8M seed (co-led by Franklin Templeton and Kraken Ventures), $1.1M community round on Echo. Investors include Franklin Templeton, Kraken Ventures, Blockchain Capital, a16z crypto, Dragonfly, Lightspeed Faction, Susquehanna (SIG), Nomura's Laser Digital, GSR, Robot Ventures, and others.

## Funds Management

### Yield Generation

stcUSD earns yield from two primary sources:

**1. Fractional Reserve Deployment**

Idle cUSD reserves are deployed via two Yearn V3 Fractional Reserve Vaults:

- **USDC FRV** ([`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072)): ~$75.2M USDC split between **Morpho Gauntlet USDC Prime** (~$50.2M, 67%) and **Aave V3 USDC Lender** (~$25.0M, 33%)
- **wWTGXX FRV** ([`0xb1c1C80FDbBde5B40264e1410550F3C864113bF8`](https://etherscan.io/address/0xb1c1C80FDbBde5B40264e1410550F3C864113bF8)): ~$5.0M wWTGXX held via simple holder strategy (wWTGXX is itself a yield-bearing WisdomTree Government Money Market fund token)

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

- **cUSD reserves:** Backed by 2 whitelisted assets on-chain: **USDC** (~$124M, 96%) and **wWTGXX** (~$5M, 4%). USDC dominates — the 40% single-asset concentration cap is not binding
- **Reserve deployment:** USDC Fractional Reserve Vault holds ~$75.2M (Morpho ~$50.2M + Aave ~$25.0M). ~$48.9M lent to operators. wWTGXX FRV holds ~$5M via holder strategy
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

### Provability

- **stcUSD exchange rate:** On-chain ERC-4626 standard (`convertToAssets()`/`convertToShares()`). Fully programmatic
- **Reserve composition:** On-chain — reserve assets held in the vault contracts are verifiable
- **Fractional reserve positions:** On-chain — Aave V3 aToken balances verifiable
- **Operator positions:** Partially on-chain — borrowing/repayment recorded on-chain, but operators' actual yield strategies are off-chain and opaque
- **Slashing conditions:** On-chain verifiable — objective fault conditions, no governance discretion

## Liquidity Risk

- **Primary exit for stcUSD:** Redeem stcUSD for cUSD via ERC-4626 `withdraw()`/`redeem()`. Then burn/redeem cUSD for underlying reserves
- **cUSD exit mechanisms:** Burn (receive single asset at oracle price, dynamic fee) or Redeem (receive proportional basket, fixed fee). The redemption mechanism is designed to prevent "last man standing" scenarios
- **Morpho/Aave liquidity dependency:** ~$75M USDC deployed across Morpho (~$50M) and Aave V3 (~$25M). Withdrawal depends on available liquidity in both protocols. Generally liquid, but in extreme scenarios (high utilization spikes), withdrawal may be delayed
- **Morpho markets:** stcUSD is collateral in Morpho markets with ~$42M supply TVL at ~91% utilization. High utilization means limited immediate liquidity for Morpho lenders
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
| stcUSD PPS | On-chain ERC-4626, fully algorithmic |
| Vault operations | Permissionless staking/unstaking on-chain |
| Reserve deployment | Automated via Fractional Reserve Vault to Aave V3 |
| Operator strategies | **Off-chain** — operators execute proprietary strategies. Borrowing/repayment recorded on-chain, but actual yield generation is opaque |
| Hurdle rate | On-chain — dynamic function of market rate + utilization |
| Slashing | On-chain — objective fault conditions, permissionless liquidation |

**Programmability is mixed:** Core vault mechanics (staking, PPS, reserve deployment, slashing) are fully on-chain. However, the operator yield generation — which represents a portion of stcUSD yield — is off-chain and opaque.

### External Dependencies

| Dependency | Criticality | Notes |
|-----------|-------------|-------|
| **Morpho** | Critical | ~$50.2M USDC deployed (67% of USDC FRV). Also stcUSD collateral market (~$42M). Core yield source |
| **Aave V3 Core Ethereum** | Critical | ~$25.0M USDC deployed (33% of USDC FRV). Blue-chip protocol ($30B+ TVL) |
| **Symbiotic** | Critical | Restaking infrastructure securing operator positions. Per-operator vault delegation model |
| **RedStone** | High | cUSD price oracle (0.05% deviation threshold). Stale prices disable minting/burning |
| **wWTGXX (WisdomTree)** | Low | ~$5M tokenized gov money market fund. Only 7 holders. Minimal DeFi track record |
| **USDC (Circle)** | High | Primary reserve asset |
| **USDT, pyUSD, BENJI, BUIDL** | Low | Listed in docs as potential reserve assets but **not currently whitelisted on-chain** |
| **Institutional Operators** | High | IMC Trading, Edge Capital, Susquehanna Crypto generate yield via off-chain strategies. Counterparty risk mitigated by Symbiotic restaking |

## Operational Risk

- **Team:** Cap Labs — Benjamin918 (CEO, ex-QiDAO $400M TVL) and the_weso (CTO, ex-Beefy Finance $1B+ TVL). Experienced DeFi founders but relatively small team
- **Funding:** $11M raised from tier-1 investors (Franklin Templeton, Kraken Ventures, a16z, Dragonfly, Blockchain Capital, Susquehanna). Strong institutional backing
- **Governance:** 3-of-5 multisig with anonymous signers and 24-hour timelock. No governance token. Protocol described as designed to "run autonomously via economic incentives"
- **Documentation:** Comprehensive documentation covering protocol mechanics, operator model, and security network. Contract source code verified on Etherscan
- **Legal:** No disclosed legal entity structure. Relies on operators being "regulated financial institutions" with legal agreements with restakers
- **Incident response:** No incidents to date. $1M Sherlock bug bounty provides responsible disclosure channel. Emergency admin role can pause/unpause protocol
- **Operator transparency:** Off-chain yield strategies are opaque. While slashing provides recourse, users cannot independently verify operator positions

## Monitoring

### Key Contracts

| Contract | Address | Monitor |
|----------|---------|---------|
| stcUSD Vault | [`0x88887bE419578051FF9F4eb6C858A951921D8888`](https://etherscan.io/address/0x88887bE419578051FF9F4eb6C858A951921D8888) | PPS (`convertToAssets(1e18)`), `totalAssets()`, `totalSupply()` |
| cUSD Token | [`0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC`](https://etherscan.io/address/0xcCcc62962d17b8914c62D74FfB843d73B2a3cccC) | `totalSupply()`, `paused()`, Mint/Burn events |
| Fractional Reserve | [`0x3Ed6aa32c930253fc990dE58fF882B9186cd0072`](https://etherscan.io/address/0x3Ed6aa32c930253fc990dE58fF882B9186cd0072) | `totalAssets()`, Aave aUSDC balance |
| Debt USDC | [`0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9`](https://etherscan.io/address/0xfa8C6D0b95d9191B5A1D51C868Da2BDFd6C04Ff9) | `totalSupply()` — tracks outstanding operator debt |
| Multisig | [`0xb8FC49402dF3ee4f8587268FB89fda4d621a8793`](https://etherscan.io/address/0xb8FC49402dF3ee4f8587268FB89fda4d621a8793) | Signer/threshold changes, submitted transactions |
| Timelock | [`0xD8236031d8279d82E615aF2BFab5FC0127A329ab`](https://etherscan.io/address/0xD8236031d8279d82E615aF2BFab5FC0127A329ab) | Scheduled/executed transactions, delay changes |
| Access Control | [`0x7731129a10d51e18cDE607C5C115F26503D2c683`](https://etherscan.io/address/0x7731129a10d51e18cDE607C5C115F26503D2c683) | Role grants/revocations, implementation upgrades |

### Critical Events to Monitor

- **stcUSD PPS decrease** — any decrease in `convertToAssets(1e18)` indicates a loss event
- **cUSD supply changes** — large mint/burn events may indicate reserve stress
- **Operator liquidations** — Lender contract liquidation events indicate operator defaults
- **Contract upgrades** — implementation changes on proxy contracts (24h timelock provides advance notice)
- **Multisig changes** — signer additions/removals, threshold changes
- **Morpho/Aave USDC utilization** — high utilization in either protocol could delay reserve withdrawal
- **Oracle staleness** — stale RedStone prices disable minting/burning
- **Reserve composition** — significant changes in backing asset ratios

## Risk Summary

### Key Strengths

- **Strong audit coverage:** 7 auditors including Trail of Bits, Spearbit, Zellic, Certora, and Sherlock contest. Comprehensive coverage of core protocol, security network, and invariant testing
- **Novel security model:** Per-operator Symbiotic restaking with instant slashing provides cryptoeconomic guarantees against operator defaults. Not pooled risk — each operator is independently collateralized
- **Blue-chip reserve deployment:** ~$75M USDC deployed across Morpho (67%) and Aave V3 (33%), both battle-tested DeFi protocols
- **Institutional backing:** $11M from tier-1 investors (Franklin Templeton, Kraken, a16z, Dragonfly). Named operators include major trading firms (IMC Trading, Susquehanna)
- **24-hour Timelock:** All governance changes go through 24-hour delay, providing users a window to react

### Key Risks

- **Upgradeable contracts:** Core token contracts (cUSD, stcUSD) are upgradeable proxies. While upgrades go through the 24h Timelock, the 3-of-5 multisig can modify fundamental contract logic
- **Weak multisig configuration:** 3-of-5 threshold with 2 dormant owners, 1 nested 1-of-2 Safe, and no public signer disclosure. Effective security is weaker than the threshold suggests
- **Off-chain operator strategies:** Operators execute proprietary yield strategies that are opaque to on-chain verification. While slashing provides recourse, users cannot independently verify operator positions or risk exposure
- **Morpho/Aave concentration risk:** ~$75M USDC reserves deployed across Morpho (~$50M) and Aave V3 (~$25M). An incident in either protocol would significantly impact reserves
- **Relatively new protocol:** 7 months in production. While growing rapidly ($288M TVL), the operator model and Symbiotic slashing mechanism have not been stress-tested in adverse conditions
- **Deployer EOA retains EXECUTOR_ROLE:** Residual permission on the Timelock that was never revoked

### Critical Risks

- **Operator default cascade:** If multiple operators default simultaneously, slashing capacity depends on available restaker collateral. The per-operator model isolates individual defaults, but a correlated failure (e.g., market crash affecting all trading strategies) could test the system beyond its design assumptions
- **Contract upgrade risk:** A compromised 3-of-5 multisig could upgrade cUSD/stcUSD contracts after a 24h delay. The anonymous signers and weak threshold make this a non-trivial concern

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — 7 auditors with 8 reports including Trail of Bits, Spearbit, Zellic, Sherlock. ✅ PASS
- [x] **Unverifiable reserves** — ERC-4626 standard. cUSD reserves on-chain. Fractional reserve Aave positions verifiable. However, operator yield strategies are off-chain. ⚠️ PARTIAL — core reserves verifiable, operator positions opaque
- [x] **Total centralization** — 3-of-5 multisig with 24h Timelock. Not a single EOA or 1-of-N setup. ✅ PASS

**All gates pass (with caveat on operator opacity).** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

| Factor | Assessment |
|--------|-----------|
| Audits | 7 auditors, 8 reports: Trail of Bits, Spearbit (×2), Zellic, Sherlock (contest), Certora, Electisec, Recon (invariant). Premium firms with comprehensive coverage |
| Bug bounty | $1M on Sherlock (Critical only). No Immunefi |
| Production history | **~7 months** (August 19, 2025). Relatively new |
| TVL | **~$288M** total (includes restaker collateral). ~$129M cUSD supply |
| Security incidents | None known |
| Finding details | Severity breakdowns not publicly summarized |

**Score: 2.0/5** — Excellent audit coverage from premium firms (Trail of Bits, Spearbit, Zellic) with good breadth (core, security network, invariant testing, contest). However, only 7 months of production history is short compared to mature protocols. $1M bug bounty is strong. No incidents to date. The short track record and lack of public finding details prevent a score below 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Factor | Assessment |
|--------|-----------|
| Upgradeability | Core contracts (cUSD, stcUSD, Access Control) are **upgradeable proxies** through Timelock |
| Multisig | 3-of-5 Gnosis Safe with **anonymous signers**, 2 dormant owners, 1 nested 1-of-2 Safe |
| Timelock | **24-hour delay** on all governance actions via TimelockController |
| Privileged roles | Granular role system (oracle_admin, lender_admin, vault_config_admin, emergency_admin). All go through Timelock |
| EOA risk | Deployer EOA retains EXECUTOR_ROLE (cannot propose, but can execute queued proposals) |

**Governance Score: 2.5/5** — The 24-hour timelock and granular role separation are positives. The 3-of-5 multisig with anonymous signers and 2 dormant owners is a concern but still provides meaningful multi-party control. Upgradeable proxy contracts mean the multisig can alter protocol behavior, but only through the timelock. The deployer EOA's residual EXECUTOR_ROLE is a minor but unnecessary risk.

**Subcategory B: Programmability**

| Factor | Assessment |
|--------|-----------|
| PPS | On-chain ERC-4626, fully algorithmic |
| Core vault operations | Permissionless staking/unstaking on-chain |
| Reserve deployment | Automated via Fractional Reserve to Aave |
| Operator yield | **Off-chain** — proprietary strategies are opaque. Only borrowing/repayment recorded on-chain |
| Hurdle rate | On-chain, dynamic |
| Slashing | On-chain, objective conditions |

**Programmability Score: 2.5/5** — Core mechanics (PPS, staking, reserves, slashing) are fully on-chain and programmatic. However, operator yield strategies — a fundamental component of the protocol's value proposition — are executed off-chain and cannot be independently verified. This hybrid on-chain/off-chain model is less transparent than fully on-chain protocols.

**Subcategory C: External Dependencies**

| Factor | Assessment |
|--------|-----------|
| Protocol count | Morpho (critical), Aave V3 (critical), Symbiotic (critical), RedStone (high), USDC/Circle (high), wWTGXX/WisdomTree (low) |
| Morpho + Aave concentration | ~$75M USDC deployed across Morpho (67%) and Aave (33%). Both are yield dependencies |
| Symbiotic | Novel restaking infrastructure, less battle-tested than established alternatives |
| Operator counterparties | Institutional firms (IMC, Susquehanna, Edge) — blue-chip but opaque |

**Dependencies Score: 3.0/5** — Heavy dependency on Morpho and Aave V3 for reserve deployment (~$75M USDC split 67/33). Symbiotic integration adds complexity and a dependency on relatively new restaking infrastructure. Multiple oracle dependencies (RedStone). The operator model introduces counterparty risk with institutional firms. More dependencies and more complexity than simple vault protocols.

**Centralization Score = (2.5 + 2.5 + 3.0) / 3 = 2.7**

**Score: 2.7/5** — Upgradeable contracts with a moderate multisig configuration, partially off-chain yield model, and complex multi-protocol dependency chain.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Factor | Assessment |
|--------|-----------|
| Backing | cUSD backed by 2 on-chain whitelisted assets: USDC (~96%) and wWTGXX/WisdomTree (~4%). Heavy USDC concentration |
| Reserve quality | USDC (Circle) is blue-chip. wWTGXX (WisdomTree Gov Money Market) is an institutional tokenized fund with only 7 holders — limited track record in DeFi |
| Reserve deployment | USDC FRV: ~$50.2M in Morpho + ~$25.0M in Aave V3. ~$48.9M lent to operators. wWTGXX FRV: ~$5M in holder strategy |
| Leverage | No direct leverage in reserve. Operators borrow from reserves (over-collateralized via Symbiotic) |
| Operator collateral | Per-operator Symbiotic delegations (50% default LTV, 80% liquidation threshold) |
| Verifiability | Reserves on-chain. Operator positions partially verifiable (borrow/repay on-chain, strategies off-chain) |

**Collateralization Score: 2.0/5** — USDC is blue-chip but makes up 96% of reserves (low diversification despite the 40% cap rule). wWTGXX is a tokenized money market fund with minimal DeFi adoption (7 holders). The per-operator over-collateralization via Symbiotic is a strong mechanism. However, the fractional reserve model means reserves are actively deployed (~$75M in Morpho/Aave, ~$49M lent to operators), and operator strategies are off-chain.

**Subcategory B: Provability**

| Factor | Assessment |
|--------|-----------|
| Reserve transparency | On-chain — reserve balances, Aave positions, operator debt balances all verifiable |
| Exchange rate | ERC-4626, fully on-chain |
| Operator positions | **Partially opaque** — borrowing/repayment on-chain, but actual strategy execution and risk exposure are off-chain |
| Slashing verifiability | On-chain — objective fault conditions |

**Provability Score: 2.5/5** — Core protocol state is fully on-chain and verifiable (reserves, PPS, operator debt, slashing conditions). However, the operator yield generation — where capital is deployed and what risks operators are taking — is off-chain and not independently verifiable. This hybrid model has a provability gap compared to fully on-chain protocols.

**Funds Management Score = (2.0 + 2.5) / 2 = 2.3**

**Score: 2.3/5** — Good reserve quality and on-chain provability for core protocol state, but operator strategy opacity and fractional reserve model introduce trust assumptions.

#### Category 4: Liquidity Risk (Weight: 15%)

| Factor | Assessment |
|--------|-----------|
| Exit mechanism | stcUSD → cUSD (ERC-4626 redeem) → burn/redeem cUSD for reserves |
| Morpho/Aave liquidity | ~$75M USDC in Morpho (67%) + Aave (33%). Withdrawal depends on available liquidity in both protocols |
| cUSD redemption | Proportional basket redemption prevents "last man standing" scenarios |
| Withdrawal restrictions | No lock for stcUSD. Restaker withdrawals up to 14 days |
| Large withdrawal impact | With ~$75M in Fractional Reserve and ~$49M lent to operators, a large withdrawal would need to be sourced from Aave or wait for operator repayment |

**Score: 3.0/5** — Multiple layers between stcUSD holder and underlying assets (stcUSD → cUSD → reserve assets). ~$75M deployed across Morpho/Aave (liquid but adds dependencies), ~$49M lent to operators (not immediately available — operator epoch-based repayment). The proportional redemption mechanism is well-designed for stress scenarios, but the fractional reserve model means not all capital is immediately liquid. In adverse scenarios (high utilization spikes + operator delays), significant redemptions could face delays.

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
            = (2.7 × 0.30) + (2.3 × 0.30) + (2.0 × 0.20) + (3.0 × 0.15) + (2.0 × 0.05)
            = 0.81 + 0.69 + 0.40 + 0.45 + 0.10
            = 2.45
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0 | 20% | 0.40 |
| Centralization & Control | 2.7 | 30% | 0.81 |
| Funds Management | 2.3 | 30% | 0.69 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **2.5/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk (2.5/5.0) — Approved with enhanced monitoring**

The score sits at the boundary of Low/Medium risk. The strong audit coverage, institutional backing, and novel security model (Symbiotic restaking) are positives. The key risk drivers are the upgradeable contracts with a weak multisig, off-chain operator strategy opacity, Aave concentration, and the relatively short production history (~7 months). Enhanced monitoring is recommended, particularly around operator positions, multisig transactions, and contract upgrade proposals.

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (September 2026) or after 12 months of production history
- **TVL-based:** Reassess if TVL exceeds $500M or changes by more than ±50%
- **Incident-based:** Reassess after any exploit, operator default, slashing event, or governance incident
- **Governance-based:** Reassess if multisig threshold or signers change, or if deployer EOA's EXECUTOR_ROLE is revoked (positive signal)
- **Operator-based:** Reassess if new operators are onboarded or existing operators experience issues
- **Protocol-based:** Reassess if Morpho or Aave V3 USDC utilization consistently exceeds 90% or if either experiences a security incident
- **Upgrade-based:** Reassess after any contract upgrade via Timelock
