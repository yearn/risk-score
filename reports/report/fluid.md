# Protocol Risk Assessment: Fluid Lending Protocol

- **Assessment Date:** May 24, 2026 (Reassessment — prior assessments Feb 12, 2026; Apr 27, 2026)
- **Token:** fTokens (fUSDC, fUSDT, fWETH, etc.)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) (fUSDC)
- **Final Score: 1.4/5.0** (unchanged from Apr 2026 at one-decimal rounding; raw weighted subtotal moved 1.90 → 1.94, which rounds to the same final 1.4 after the -0.5 modifier)

## Reassessment Summary (May 2026)

Onchain refresh at block `25161749` (May 24 2026 01:06 UTC). No new contagion event since Apr 2026; the headline change is concentration.

**Material change — SUSDAI concentration:** Top supply asset SUSDAI grew **19.9% → 28.3%** of cross-chain lending TVL ($149.4M → $246.7M) in 26 days. Per-chain it is **75.3% of Arbitrum and 80.4% of Plasma supply**. Same yield-bearing-stable-wrapper pattern as the wstUSR exposure that produced the Mar 2026 bad-debt event, now larger in both absolute terms and as a share of TVL. Funds Mgmt § A (Collateralization) moves 2.5 → 2.75; weighted subtotal 1.90 → 1.94; post-modifier 1.44, rounds to **1.4** (unchanged at one decimal, but trajectory is up).

**Everything else healthy at refresh:**

- **TVL:** Lending $750.8M → $803.6M → **$872.5M** (Apr 27 → May 11 → May 23). Overall Fluid TVL ~$1.00B.
- **fTokens:** Exchange rates still monotonically increasing across every checkpoint; supply rising (fUSDC 193M → 204M USDC, fWETH 2,533 → 3,335 WETH, fGHO 12.1M → 14.6M).
- **Governance:** GovernorBravo proposalCount 128 → 131 (Executed still 120; #129 Queued past eta May 20 but not yet executed, #130 Active, #131 Pending). All quorum/threshold/delay/period params unchanged.
- **Admin/guardian:** Timelock delay 1 day, all core contracts still Timelock-owned. Avocado 7-of-14 unchanged. No `LogUpdateAuth` or `LogUpdateGuardian` events since May 6. Two `LogUnpauseUser` batches on May 12–13 reopened previously-paused vaults via the permissioned ConfigHandler `0x46978CD4…`.
- **Liquidity Layer impl:** `0xcc33…66a2` since Mar 31 2026, unchanged.
- **Rate model:** USDC/USDT/GHO/ETH curves unchanged. Only `LogUpdateRateDataV2s` event since May 6 was for a new small market (PST, `0x22ae3d9a…`).
- **Audits:** No 2026-dated audit published; most recent posted reviews remain MixBytes (Sep–Dec 2025) and StateMind (Sep–Oct 2025).

**Correction to the Apr 27 report:** The "Rebalancer" address `0x724d0c…b9b6` is actually `FluidLendingRewardsRateModel` (inactive). True rebalancer for fUSDC and fUSDT is `FluidReserveContractProxy` at [`0x264786EF916af64a1DB19F513F24a3681734ce92`](https://etherscan.io/address/0x264786EF916af64a1DB19F513F24a3681734ce92), `owner() = Timelock` ✓. Verified via the single `LogUpdateRebalancer` event on each fToken at protocol launch in Feb 2024. Admin-controls table corrected below.

## Overview + Links

This assessment focuses on the **Fluid Lending Protocol (fTokens)** — an ERC4626-compliant lending product built on top of Fluid's unified Liquidity Layer. Users supply assets (USDC, USDT, WETH, wstETH, etc.) and receive fTokens representing their share of the lending pool. Yield is generated from borrower interest via the Vault Protocol.

**Architecture dependency chain relevant to lending risk:**

```
fTokens (Lending Protocol)
    ↓ deposits/withdraws via
Liquidity Layer (central fund store, 0x52Aa...)
    ↑ borrows against collateral
Vault Protocol (borrowers, liquidations, oracles)
```

fToken holders are exposed to risks across this entire stack: the Lending Protocol itself, the Liquidity Layer that holds all funds, and the Vault Protocol whose borrowers generate the yield. The DEX Protocol and stETH Protocol also interact with the Liquidity Layer but are secondary dependencies.

Fluid is governed by FLUID token holders via onchain GovernorBravo governance with a 1-day Timelock. The protocol was developed by Instadapp Labs and launched in February 2024.

**Links:**

- [Protocol Documentation](https://docs.fluid.instadapp.io/)
- [Protocol App](https://fluid.io/)
- [Security/Audits Page](https://docs.fluid.instadapp.io/audits-and-security.html)
- [GitHub (Public Contracts)](https://github.com/Instadapp/fluid-contracts-public)
- [Deployments](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md)
- [Governance Forum](https://gov.fluid.io/) (formerly gov.instadapp.io — redirects)
- [Snapshot Governance](https://snapshot.org/#/instadapp-gov.eth)
- [DeFiLlama — Fluid Lending](https://defillama.com/protocol/fluid-lending)
- [DeFiLlama — Fluid (overall)](https://defillama.com/protocol/fluid)

## Contract Addresses (Ethereum Mainnet)

All contracts verified on Etherscan. Compiled with Solidity 0.8.21.

### fToken Contracts (Lending)

| fToken | Address | Underlying | Underlying Address |
|--------|---------|------------|--------------------|
| **fUSDC** | [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) | USDC | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) |
| **fUSDT** | [`0x5C20B550819128074FD538Edf79791733ccEdd18`](https://etherscan.io/address/0x5C20B550819128074FD538Edf79791733ccEdd18) | USDT | [`0xdAC17F958D2ee523a2206206994597C13D831ec7`](https://etherscan.io/address/0xdAC17F958D2ee523a2206206994597C13D831ec7) |
| **fWETH** | [`0x90551c1795392094FE6D29B758EcCD233cFAa260`](https://etherscan.io/address/0x90551c1795392094FE6D29B758EcCD233cFAa260) | WETH | [`0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) |
| **fwstETH** | [`0x2411802D8BEA09be0aF8fD8D08314a63e706b29C`](https://etherscan.io/address/0x2411802D8BEA09be0aF8fD8D08314a63e706b29C) | wstETH | [`0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0`](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) |
| **fGHO** | [`0x6A29A46E21C730DcA1d8b23d637c101cec605C5B`](https://etherscan.io/address/0x6A29A46E21C730DcA1d8b23d637c101cec605C5B) | GHO | [`0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f`](https://etherscan.io/address/0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f) |
| **fsUSDS** | [`0x2BBE31d63E6813E3AC858C04dae43FB2a72B0D11`](https://etherscan.io/address/0x2BBE31d63E6813E3AC858C04dae43FB2a72B0D11) | sUSDS | [`0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD`](https://etherscan.io/address/0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD) |
| **fUSDtb** | [`0x15e8c742614b5D8Db4083A41Df1A14F5D2bFB400`](https://etherscan.io/address/0x15e8c742614b5D8Db4083A41Df1A14F5D2bFB400) | USDtb | [`0xC139190F447e929f090Edeb554D95AbB8b18aC1C`](https://etherscan.io/address/0xC139190F447e929f090Edeb554D95AbB8b18aC1C) |

### fToken On-Chain State (Ethereum Mainnet, verified May 24, 2026 at block `25161749`)

| fToken | Total Assets (May 24 2026) | Total Assets (May 11 2026) | Exchange Rate (May 24) | Exchange Rate (May 11) | Δ Rate (May 11→24) |
|--------|---------------------------|---------------------------|------------------------|------------------------|---------------------|
| fUSDC | 203.64M USDC | 193.13M USDC | 1.195945 | 1.1944 | +0.13% |
| fUSDT | 135.23M USDT | 130.00M USDT | 1.189083 | 1.1881 | +0.08% |
| fGHO | 14.65M GHO | 12.08M GHO | 1.111000 | 1.1096 | +0.13% |
| fwstETH | 1,827.65 wstETH | 1,767.83 wstETH | 1.038332 | 1.0383 | +0.00% |
| fWETH | 3,335.10 WETH | 2,532.88 WETH | 1.075462 | 1.0749 | +0.05% |
| fUSDtb | 2.10M USDtb | 2.10M USDtb | 1.021861 | 1.0214 | +0.05% |
| fsUSDS | 15,024.77 sUSDS | 15,024.77 sUSDS | 1.002057 | 1.0021 | +0.00% |

All exchange rates **continue to increase monotonically** through every checkpoint (Feb 2026 → Apr 27 → May 11 → May 24, verified onchain). This is the key safety property of the ERC4626 fToken design and confirms that fToken holders have not lost any principal value on Ethereum at any point.

Recovery has accelerated between May 11 and May 24: fUSDC +5.4% (193M → 204M), fUSDT +4.0%, fGHO +21% (12.1M → 14.6M), fWETH +31.7% (2,533 → 3,335 WETH), fwstETH +3.4%. fsUSDS and fUSDtb are flat. No fToken has declined in supply over this window.

### Core Infrastructure (Dependency for Lending) — Verified Onchain May 24, 2026 at block `25161749`

- **Liquidity Layer (proxy)**: [`0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) — Central contract holding all funds. Upgradeable proxy (Instadapp **Infinite Proxy** — uses a Fluid-custom slot layout, *not* standard EIP-1967). The dispatch logic lives in module slots; the impl-slot holds a "dummy" implementation purely so block explorers can detect the proxy.
  - **Admin slot** (EIP-1967-style, `keccak("eip1967.proxy.admin")-1` = `0xb531...6103`): `0x2386DC45AdDed673317eF068992F19421B481F4c` (Timelock) ✓ unchanged since Feb 2026.
  - **Dummy-implementation slot** (Fluid custom: `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` — defined in [`infiniteProxy/proxy.sol`](https://github.com/Instadapp/fluid-contracts-public/blob/main/contracts/infiniteProxy/proxy.sol)): changed once between assessments. At block `24436972` (Feb 12, 2026) the slot held [`0xa57d7cEF617271F4cEa4F665D33eBcFCbA4929f6`](https://etherscan.io/address/0xa57d7cEF617271F4cEa4F665D33eBcFCbA4929f6); at block `24779519` (Mar 31, 2026) it was upgraded to the current [`0xcc331DaF69752Bece3Dc98DBc63EacD5092266a2`](https://etherscan.io/address/0xcc331DaF69752Bece3Dc98DBc63EacD5092266a2). Both impls are verified as `FluidLiquidityDummyImpl` (compiler `0.8.21` → `0.8.29` respectively). **Verified unchanged at block `25161749` (May 24, 2026).** The standard EIP-1967 impl slot is **empty** — Fluid does not use it.
    - **Upgrade tx**: [`0xf484b2a265add120c907049c43ca1cfd11b73fce6154c0abe3e15d5ac325d487`](https://etherscan.io/tx/0xf484b2a265add120c907049c43ca1cfd11b73fce6154c0abe3e15d5ac325d487). The transaction was executed by the Timelock and bundled (a) the dummy-impl swap (`Upgraded` EIP-1967 event), (b) module-dispatcher selector updates (`ad967e15`, `dacb5419`), and (c) user borrow-config updates. Follow-up verification found **no `LogUpdateRateDataV2s` event in this transaction**; the current USDC/USDT rate values did not come from proposal #126.
    - Scheduled by **governance proposal #126** — verified via the `ProposalExecuted(126)` event emitted by GovernorBravo within the upgrade tx (block 24779519, Mar 31 2026). **No 2026-dated audit covering the new module version is published** at [audits-and-security.html](https://docs.fluid.instadapp.io/audits-and-security.html) (rechecked May 24 2026); the most recent posted audits are MixBytes (Sep–Dec 2025) and StateMind (Sep–Oct 2025), both on the Liquidity Layer. Treat the `0xcc33…` impl as in-scope of those 2025 reviews unless a separate post-upgrade audit is later published.
- **LendingFactory**: [`0x54B91A0D94cb471F37f949c60F7Fa7935b551D03`](https://etherscan.io/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03) — `owner() = 0x2386DC45...` (Timelock) ✓ (rechecked block `25161749`)
- **Timelock**: [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) — `delay() = 86400` (1 day) ✓; `admin() = 0x0204Cd03...` (GovernorBravo) ✓ (rechecked block `25161749`)
- **GovernorBravo**: [`0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) — `proposalCount() = 131` (was 128 on May 11 2026, 117 in Feb 2026). Re-verified onchain May 24 2026 (block `25161749`) by iterating `state(uint256)` for all 131 proposals: **120 are in state `Executed`** (state==7).
  - **Three new proposals since May 11 (129, 130, 131):**
    - **#129 — Queued (state=5).** Created May 15 2026 at 23:28 UTC (block `25103841`), voting May 16 23:31 → May 18 23:40 UTC, eta May 20 16:17 UTC. Past eta but not yet executed at the May 24 snapshot. Proposer `0x3dAff61f…`. Timelock grace period has not elapsed; executable until then.
    - **#130 — Active (state=1).** Created May 22 03:21 UTC (block `25148075`), voting closes ~May 24 07:21 UTC. Proposer `0x3dAff61f…`.
    - **#131 — Pending (state=0).** Voting window starts at block `25167170`. Proposer `0x5C43AAC9…`.
  - **Proposal 128 executed on May 5, 2026** at 05:43 UTC ([tx](https://etherscan.io/tx/0x6e0273ae285520126687f852efd623a0c84b351a6873850553da331d0c2430f5), block `25007782`). Although the proposal text said it would move the V2 USDC/USDT kinks from 85%/93% to 90%/95%, the execution receipt emitted `LogUpdateRateDataV2s` only for ETH (`rateAtUtilizationMax` 100% -> 10%). Re-verified current onchain values at block `25161749`: USDC and USDT remain at 85%/93% with 5.40%/7.50% kink rates.
  - quorumVotes: 4,000,000 FLUID ✓; proposalThreshold: 1,000,000 FLUID ✓; votingDelay: 7,200 blocks ✓; votingPeriod: 14,400 blocks ✓ (all rechecked at block `25161749`)
- **Avocado Multisig (Timelock guardian)**: [`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) — Custom contract (not a Gnosis Safe; standard `getThreshold()` / `getOwners()` revert). Signers exposed via `signers()(address[])` and threshold via `requiredSigners()(uint256)`. Re-verified onchain May 24 2026 (block `25161749`): **7-of-14 multisig** (unchanged from May 11; was 8-of-16 on Apr 27 2026), `owner() = 0xC7810aA3b0c6A2778EEcC114B93d59B2E9Da9E05` (also one of the 14 signers).
  - Signers (14, unchanged from May 11): `0x1d895E5C…`, `0x33581f26…`, `0x4604E3bF…`, `0x5612C18E…`, `0x7284a845…`, `0x88bB9B99…`, `0x97399C93…`, `0xA32e5237…`, `0xa385B298…`, `0xa7615CD3…`, `0xC0c72156…`, `0xc1490E04…`, `0xC7810aA3…`, `0xD33D3fcE…`.
- **FLUID Token**: [`0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb`](https://etherscan.io/address/0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb) — Governance token. `totalSupply() = 100,000,000 FLUID` ✓ (verified block `25161749`).
- **Rebalancer (FluidReserveContractProxy)**: [`0x264786EF916af64a1DB19F513F24a3681734ce92`](https://etherscan.io/address/0x264786EF916af64a1DB19F513F24a3681734ce92) — Permissioned address for `rebalance()` calls on fUSDC and fUSDT. `owner() = 0x2386DC45…` (Timelock) ✓. Only one `LogUpdateRebalancer` event was ever emitted by fUSDC (block `19247609`, Feb 2024) and fUSDT (block `19247666`, Feb 2024); current rebalancer matches that initial event. (The Apr 2026 report previously identified `0x724d0c…b9b6` as the rebalancer — that address is actually `FluidLendingRewardsRateModel`, an inactive rewards model contract.)

### Resolvers (Read-Only Periphery)

- **LiquidityResolver (current, all 6 chains)**: [`0xca13A15de31235A37134B4717021C35A3CF25C60`](https://etherscan.io/address/0xca13A15de31235A37134B4717021C35A3CF25C60) — Per Fluid's official [deployments registry](https://github.com/Instadapp/fluid-contracts-public/blob/main/deployments/deployments.md), this is the current LiquidityResolver on mainnet, arbitrum, base, polygon, plasma, and bnb. Verified onchain Apr 27 2026: `LIQUIDITY()` returns `0x52Aa899454998Be5b000Ad077a46Bbe360F4e497` ✓.
- **FluidLiquidityResolver (prior version, still deployed)**: [`0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb`](https://etherscan.io/address/0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb) — Earlier version; bytecode still live and `LIQUIDITY()` returns the same Liquidity Layer, but no longer the canonical address in the deployments registry.
- **RevenueResolver**: [`0x0A84741D50B4190B424f57425b09FAe60C330F32`](https://etherscan.io/address/0x0A84741D50B4190B424f57425b09FAe60C330F32)

## Audits and Due Diligence Disclosures

**No new audits have been published since the Feb 2026 assessment.** The audit landscape is unchanged: 8 distinct security audits across 4 audit firms covering all major protocol components, including the Lending Protocol (PeckShield + StateMind full-protocol audits) and the Liquidity Layer (MixBytes + StateMind dual audit in 2025). All audit reports are available on the [audits and security page](https://docs.fluid.instadapp.io/audits-and-security.html).

The Resolv USR contagion event was **not the result of an unaudited Fluid contract bug**; it was the result of a leverage-loop borrower position becoming undercollateralized when an external collateral asset (wstUSR) collapsed in price following the upstream Resolv exploit.

| # | Firm | Date | Scope | Critical | High | Medium | Low | Info | Total |
|---|------|------|-------|----------|------|--------|-----|------|-------|
| 1 | PeckShield | Nov 2023 | Full Protocol (incl. Lending) | 0 | 4 | 4 | 5 | 0 | 13 |
| 2 | StateMind | Oct–Dec 2023 | Full Protocol (incl. Lending) | 3 | 8 | 15 | 0 | 40 | 66 |
| 3 | MixBytes | Mar–Jun 2024 | Vault Protocol | 0 | 0 | 2 | 4 | 0 | 6 |
| 4 | Cantina | Sep–Oct 2024 | DEX Protocol | 0 | 0 | 2 | 7 | 4 | 13 |
| 5 | MixBytes | Oct 2024 | DEX Protocol | 0 | 0 | 0 | 3 | 0 | 3 |
| 6 | MixBytes | Sep–Dec 2025 | Liquidity Layer | 0 | 0 | 0 | 2 | 0 | 2 |
| 7 | StateMind | Sep–Oct 2025 | Liquidity Layer | 0 | 1 | 0 | 0 | 4 | 5 |
| **Total** | | | | **3** | **13** | **23** | **21** | **48** | **108** |

No formal verification (Certora, Halmos, etc.) has been performed.

### Bug Bounty

[Immunefi Bug Bounty Program](https://immunefi.com/bug-bounty/instadapp/) — Active program under the "Instadapp" name. **Fluid Lending Protocol explicitly in scope.**

| Category | Severity | Min Reward | Max Reward | Calculation |
|----------|----------|------------|------------|-------------|
| Smart Contract | Critical | $25,000 | $500,000 | 10% of directly affected funds |
| Smart Contract | High | $5,000 | $100,000 | 50% of affected funds value |
| Web/App | Critical | $5,000 | $50,000 | Range model |
| Web/App | High | $5,000 | $10,000 | Range model |

**Fluid scope**: Liquidity Layer, **Lending Protocol**, Vault Protocol (excluding periphery folder). [Source repo](https://github.com/Instadapp/fluid-contracts-public).

**Payment**: USDC, USDT, or DAI on Ethereum. Medium/Low severity levels are not in scope.

## Historical Track Record

- **Production History**: Fluid launched on Ethereum mainnet on **February 20, 2024**. As of May 24, 2026, the protocol has been in production for **~2.26 years (~825 days)**.
- **Total Fluid TVL** (DeFiLlama "fluid" — all products, all chains, supply-side only): **~$999.6M** as of May 23 2026 23:02 UTC (May 11 snapshot: $969M; Apr 27 snapshot: $911.5M; down from $1.45B in Feb 2026; peak $2.68B on Oct 9, 2025).
- **Lending-only TVL** (DeFiLlama "fluid-lending" — all chains): **~$872.5M** as of May 23 2026 23:02 UTC (May 11 snapshot: $803.6M; Apr 27 snapshot: $750.8M; down from $1.28B in Feb 2026; peak $2.37B on Oct 9, 2025). Per-chain (May 23): Ethereum $531.2M, Arbitrum $185.4M, Plasma $126.5M, Base $24.8M, Polygon $4.5M.
- **Recent 2-week TVL trend (DeFiLlama, lending-only daily series):** May 10 $789M → May 14 $819M → May 18 $787M → May 21 $863M → May 23 $864M → May 23 23:02 UTC $872.5M. Trend is monotonically positive over the last 5 days; the May 17–18 dip aligns with the broader market drawdown rather than a Fluid-specific event.

### Major TVL Drawdowns (Historical)

| Date | Drawdown | Driver |
|------|----------|--------|
| 2024-03-20 | -13.7% | Early-protocol churn |
| 2024-08-06 | -16.1% | Broader crypto market selloff |
| 2025-04-11 | -11.3% | Market stress |
| **2026-03-23** | **-30.3%** | **Resolv USR exploit contagion (NEW)** |
| **2026-04-19/20** | **-17.5%** | **Kelp DAO bridge exploit / rsETH market freeze (NEW)** |

The two 2026 events are the largest single-day drawdowns in the protocol's history. Both were driven by external counterparty/collateral-asset events, not by a bug in Fluid's contracts.

### Incidents (NEW since Feb 2026)

#### 1. Resolv USR Depeg / Bad Debt Event — March 22, 2026

**Upstream cause:** Resolv Labs' minting infrastructure was exploited via a compromised AWS KMS-hosted private key (the `SERVICE_ROLE` signer). The attacker minted ~80M unbacked USR for ~$200K of USDC collateral, extracted ~$25M, and the USR stablecoin depegged from $1.00 to as low as $0.0025 on Curve before partially recovering to ~$0.85.

**Impact on Fluid:**

- **Concentration risk materialized:** wstUSR was the largest single supply asset on Fluid (18.9% of all-chain lending TVL per the Feb 2026 assessment), and ~98% of wstUSR supply was reportedly deployed in Fluid leverage loops at up to 6x leverage.
- **Bad debt:** Estimated $10–17.5M of bad debt accrued in Fluid lending markets when wstUSR-collateralized borrower positions became insolvent (the wrapping ratio of wstUSR meant that positions were deeply underwater even if USR repegged).
- **Outflows:** ~$300M of net outflows in a single day (the largest in protocol history). Total Fluid TVL: $1.25B (Mar 22) → $873M (Mar 23) = **-30.3%** in 24 hours.
- **Operational response (~30 minutes):** Admin team paused new borrowings and froze new deposits on affected vaults, then began analyzing existing positions. Per Fluid's official statement, *all other markets continued operating normally*.
- **Bad debt coverage:** Per Fluid's official communication, **100% of bad debt was covered via a short-term loan coverage agreement** funded by personal commitments from Lom Lomashuk (Cyber Fund), a contributor known as "weremeow," and the Fluid core team itself. Resolv Labs additionally executed USR redemptions for whitelisted (pre-incident) wallets covering >90% of the affected user group, and committed to a permanent burn of 46M USR (9M immediate + 36M frozen via blacklist) to reduce ongoing depeg pressure.
- **Repayment status:** Fluid reported that ~$70M of USR-related debt was fully repaid by **March 25, 2026**, three days after the incident. All lending markets remained operational.
- **fToken impact:** **No direct loss to fToken holders** on Ethereum — onchain exchange rates continued to increase monotonically through and after the event (verified). fToken holders are reported as "not affected" per the official statement.

**Sources:**
- [Halborn — Explained: The Resolv Hack (March 2026)](https://www.halborn.com/blog/post/explained-the-resolv-hack-march-2026)
- [Sentora Research — The Resolv Hack: $25M From a Single Compromised Key](https://sentora.com/research/articles/the-resolv-hack-25m-from-a-single-compromised-key)
- [WEEX News — Fluid: 100% of bad debts are covered by the short-term loan coverage agreement](https://www.weex.com/news/detail/fluid-100-of-bad-debts-are-covered-by-the-short-term-loan-coverage-agreement-and-user-funds-are-not-affected-399991)
- [Phemex News — Fluid Begins $70M Repayments After Resolv Incident](https://phemex.com/news/article/fluid-commences-70m-repayments-following-resolv-incident-68934)
- [Resolv USR Exploit Analysis (independent)](https://resolv-usr-exploit.vercel.app/)
- [Protos — Resolv hack shows DeFi learned nothing from last contagion](https://protos.com/resolv-hack-shows-defi-learned-nothing-from-last-contagion/)

**Critical observation:** The bad-debt coverage was **discretionary and off-balance-sheet** (loans from named individuals/entities). It is not a pre-funded, programmatic insurance fund or first-loss tranche. While the response was rapid and successful, the same coverage mechanism cannot be assumed to scale to a much larger event, and there is no documented contractual obligation forcing those parties to backstop losses again. This is the most material change to the risk profile since the previous assessment.

#### 2. Kelp DAO rsETH Bridge Exploit — April 18, 2026

**Upstream cause:** Attacker drained 116,500 rsETH (~18% of circulating supply, ~$292M) from Kelp DAO's LayerZero-powered bridge by tricking the cross-chain messaging layer into accepting a forged instruction. This is the largest DeFi exploit of 2026 to date.

**Impact on Fluid:**

- Fluid froze its rsETH markets within hours, alongside Aave, SparkLend, and Upshift.
- This was a **precautionary action** — Fluid contracts were not exploited.
- Total Fluid TVL: $1.04B (Apr 18) → $861M (Apr 20) = **-17.5%** over 2 days.
- No bad debt event reported.

**Sources:**
- [CoinDesk — 2026's biggest crypto exploit: Kelp DAO hit for $292M](https://www.coindesk.com/tech/2026/04/19/2026-s-biggest-crypto-exploit-kelp-dao-hit-for-usd292-million-with-wrapped-ether-stranded-across-20-chains)
- [Aave Governance — rsETH Incident Report (April 20, 2026)](https://governance.aave.com/t/rseth-incident-report-april-20-2026/24580)

### Multi-chain Lending Deployment

Per-chain utilization figures below are from the May 6 2026 LiquidityResolver refresh (carried forward — the May 24 2026 reassessment did not re-iterate all six chains' resolvers). Cross-chain supply totals **were** refreshed to May 23 2026 from DeFiLlama; per-chain supply USD is current as of that snapshot.

| Chain | Per-Chain Supply (May 23 2026) | Per-Chain Supply (Apr 27 2026) | Listed Tokens | USD-Weighted Util (May 6) | Highest Borrowed-Token Util (May 6) |
|-------|-------------------------------|--------------------------------|---------------|---------------------------|--------------------------------------|
| Ethereum | $531.2M | $503.6M | 38 | ~52.5% | GHO 86.7%, ETH 84.9%, USDT 77.6%, USDC 76.1% |
| Arbitrum | $185.4M | n/a | 22 | ~45.2% | USDC 90.3%, USDT0 88.6%, GHO 86.3%, ETH 81.1% |
| Base | $24.8M | $32.4M | 23 | ~40.4% | USDC 86.5%, GHO 84.0%, ETH 70.5% |
| Polygon | $4.5M | $4.7M | 13 | ~31.7% | USDT0 92.1%, USDC 87.3%, WETH 80.6% |
| Plasma | $126.5M | $107.6M | 16 | ~44.3% | USDT0 90.9%, USDe 58.5%, GHO 46.7% |
| BNB | n/a (no lending TVL reported in DeFiLlama snapshot) | n/a | 10 | ~43.3% | USDT 96.7%, USDC 90.1%, WETH 84.9% |

Combined lending TVL: $1.28B (Feb 2026) → $750.8M (Apr 27 trough, -41%) → **$872.5M (May 23, +16% from trough)**. Most of the recovery is on Arbitrum (largely SUSDAI inflows) and Plasma (SUSDAI + USDT0); Ethereum supply is flat-to-slightly-up.

### Instadapp Legacy

Instadapp has been operating since 2019, maintaining ~$2B TVL through 2023. Fluid represents the team's most ambitious protocol built on years of DeFi infrastructure experience. Track record now includes one **bad debt absorption event** (Mar 2026) with successful third-party-funded recovery.

## Funds Management

### How fTokens Work

fTokens are **ERC4626-compliant vault tokens**. When a user deposits an underlying asset (e.g., USDC), the fToken contract:

1. Calls `LIQUIDITY.operate()` to deposit the underlying into the Liquidity Layer
2. The Liquidity Layer triggers a callback; the fToken transfers the underlying via SafeTransfer or Permit2
3. Shares are minted to the user based on the current exchange rate

On withdrawal, the reverse occurs: shares are **burned before** the underlying is withdrawn from the Liquidity Layer (burn-first pattern for safety).

**Exchange rate**: Computed onchain as `tokenExchangePrice / EXCHANGE_PRICES_PRECISION` (1e12 precision). The rate is monotonically increasing — it can never decrease. **Verified onchain on Apr 27, 2026:** all fToken exchange rates have increased since Feb 2026.

It incorporates:
- Yield from the Liquidity Layer (borrower interest)
- Optional rewards from a `LendingRewardsRateModel` (currently **inactive** for all fTokens; yields are purely organic)

**Safety mechanisms in fToken contracts (unchanged):**
- Custom reentrancy guard (deposit/withdraw/rebalance all protected)
- Callback validation: checks caller = Liquidity AND token = ASSET AND status = ENTERED
- Burn-before-withdraw pattern
- BigMath precision with SafeCast overflow protection
- Rewards rate capped at 50% APR maximum

### Accessibility

- **Supplying**: Permissionless — anyone can deposit via fTokens. No whitelist required.
- **Redemption**: fToken withdrawals via `withdraw()` or `redeem()` (standard ERC4626). Subject to Liquidity Layer withdrawal limits. During the Mar 2026 event, withdrawals from affected (wstUSR-related) vaults were paused while solvent markets continued operating; standard fToken markets (fUSDC etc.) on Ethereum remained operational throughout.
- **Fees**: No explicit deposit/withdrawal fees. Interest rates are algorithmically determined by utilization via a kink-based model.

### Yield Source and Counterparty Risk

fToken yield comes from **borrower interest**. Borrowers use the Vault Protocol to deposit collateral and borrow assets from the Liquidity Layer. This means fToken holders are exposed to:

- **Vault Protocol solvency**: If borrowers default and liquidations fail to recover full value, bad debt could affect lending reserves. **The Mar 2026 event is a concrete example of this risk materializing** — the wstUSR price collapse outpaced the liquidation engine's ability to safely close positions, producing $10–17.5M of bad debt.
- **Liquidation effectiveness**: The tick-based liquidation mechanism must function correctly to prevent bad debt accumulation. In the Mar 2026 case, the speed and magnitude of the wstUSR price collapse exceeded what the liquidation mechanism could handle without losses.
- **Oracle correctness**: Vault liquidations depend on Chainlink, UniswapV3 TWAP, and Redstone price feeds. Oracle failures could delay liquidations.
- **Coverage mechanism**: Bad debt is **not covered by a programmatic, pre-funded insurance fund or first-loss tranche.** The Mar 2026 incident was covered via discretionary short-term loans from named individuals and entities.

**Collateral quality backing fToken yield** (borrower collateral types):
- Blue-chip: ETH, WETH, wstETH, weETH, WBTC, cbBTC
- Stablecoins: USDC, USDT, sUSDe, GHO
- Yield/restaking: PAXG, XAUt, various LSTs, sUSDe, syrupUSDC (and previously wstUSR — substantially de-risked post-Mar 2026)

### Collateralization

- **Backing**: All lending positions are over-collateralized onchain. Borrowers must maintain collateral ratios (80–95% LTV depending on the pair).
- **Liquidations**: Fully onchain tick-based mechanism. Liquidation penalty as low as 0.1% for correlated pairs (wstETH/ETH), higher for uncorrelated pairs.
- **Withdrawal Gap**: Extra gap on Liquidity Layer limits reserved for liquidations to ensure they can always execute.
- **Limitation observed Mar 2026:** the liquidation engine's effectiveness depends on the collateral asset behaving like a liquid market asset. When wstUSR's underlying USR depegged ~99.7% intraday, on-DEX liquidity for wstUSR was insufficient for safe liquidation, producing bad debt.

### Provability

- **Transparency**: All reserves are fully onchain and verifiable via resolver contracts (FluidLiquidityResolver at [`0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb`](https://etherscan.io/address/0xD7588F6c99605Ab274C211a0AFeC60947668A8Cb)).
- **Exchange Rate**: fToken exchange rates are computed programmatically onchain (ERC4626 standard). No offchain oracle or admin input needed. Rate is monotonically increasing — verified.
- **Interest Rates**: Algorithmically determined based on utilization. USDC rate model (re-verified onchain May 6, 2026): kink at 85% utilization (5.40% rate), second kink at 93% (7.50%), max rate 40%. Proposal #128 has now executed, but it did **not** emit a USDC/USDT rate update and the live USDC/USDT curve remains unchanged.
- **Revenue**: Protocol revenue is calculated and verifiable via the RevenueResolver contract.

### Interest Rate Model — Re-verified Onchain May 24, 2026 at block `25161749`

Decoded from `FluidLiquidityResolver.getTokenRateData(token)` for each token (`(uint256 version, RateDataV1Params v1, RateDataV2Params v2)`). Compared against the May 6 and Feb 2026 snapshots in prior reports.

**Stablecoins and ETH — current curves:**

| Token | Version | Kink 1 | Rate@K1 | Kink 2 | Rate@K2 | Max Rate | Δ vs May 6 |
|-------|---------|--------|---------|--------|---------|----------|------------|
| USDC | V2 | 85% | **5.40%** | 93% | **7.50%** | 40.00% | unchanged |
| USDT | V2 | 85% | **5.40%** | 93% | **7.50%** | 40.00% | unchanged |
| GHO  | V2 | 85% | **6.50%** | 93% | **9.50%** | 40.00% | unchanged |
| ETH (native) | V2 | 88% | **2.50%** | 93% | **4.00%** | **10.00%** | unchanged (post-prop-128 state) |

**Rate-update events on the Liquidity Layer since May 6, 2026:** exactly one `LogUpdateRateDataV2s` event ([tx `0x8939…d87a`](https://etherscan.io/tx/0x8939e2fc50cd9628dbf24e0ce691784aabce0fc1d401cf40cb30f007f187d87a), block `25125289`, May 18 23:10 UTC) for token [`0x22ae3d9a738471f405169af055d31c687087d4c7`](https://etherscan.io/address/0x22ae3d9a738471f405169af055d31c687087d4c7) (`PST` — "PayFi Strategy Token", a newly-listed market with a 50%/80% kink curve and 100% max rate). No USDC/USDT/GHO/ETH rate changes since May 6.

**Post-Feb USDC/USDT rate history (unchanged from prior report — verified that no new events since May 6 update this):**

| Date | Tx | USDC/USDT Kink 1 | Rate at Kink 1 | Kink 2 | Rate at Kink 2 | Notes |
|------|----|------------------|----------------|--------|----------------|-------|
| Feb 13, 2026 | [`0xe373...131bb`](https://etherscan.io/tx/0xe373ed1f4fa84ae1e4e0f9c33f3a88dc6143eb7bcee56c9a4152b6e9974131bb) | 85% | 5.00% | 93% | 8.00% | Liquidity Layer rate update event |
| Mar 10, 2026 | [`0xa99e...96c06`](https://etherscan.io/tx/0xa99e59f371916802c5228c585d0edc7a35ee1988873c0768c9820284d3496c06) | 85% | 4.50% | 93% | 7.50% | Liquidity Layer rate update event |
| Apr 23, 2026 | [`0x1927...49e`](https://etherscan.io/tx/0x1927e2147a52b2a4ba0bdfb3b764b79fa33339c12a7048fb51dda19225b0490e) | 85% | 5.40% | 93% | 7.50% | Liquidity Layer rate update event; **still the current live USDC/USDT curve** |

Proposal #128 (executed May 5 2026) was *expected* by its text to move USDC/USDT kinks to 90%/95%; the execution receipt did not emit a USDC/USDT rate event and the live state did not change. This unresolved gap between proposal text and onchain effect remains a documented open observation; no follow-up proposal has corrected it.

## Liquidity Risk

### Lending-Specific Liquidity Concerns

fToken holders face liquidity risk from the **shared Liquidity Layer** architecture. This architecture and its trade-offs are unchanged since Feb 2026, but the Mar 2026 event provides a concrete stress test.

- **Shared pool**: fToken withdrawals compete with all other withdrawal demand on the Liquidity Layer.
- **Withdrawal limits**: The Liquidity Layer enforces per-token expandable withdrawal limits. `maxWithdraw()` returns the minimum of: (1) the withdrawal limit at Liquidity, (2) actual liquid balance.
- **Stress test result (Mar 22–25, 2026)**: $300M+ net outflows in 24 hours. Standard fToken markets (fUSDC, fUSDT, etc.) on Ethereum continued processing withdrawals throughout. Affected vaults (wstUSR-collateralized) were paused. The kink-based rate model worked as designed — high utilization produced rate increases that incentivized borrowers to repay and stabilize utilization.
- **Stress test result (Apr 18–20, 2026)**: Additional ~$180M outflows over 2 days following the Kelp/rsETH freeze. No further bad debt; precautionary freeze of rsETH markets only.

### Exit Mechanisms

- **Normal exit**: Call `withdraw()` or `redeem()` on fToken. Subject to available liquidity and withdrawal limits.
- **Secondary market**: fTokens are ERC20 tokens and can be traded on secondary markets, though no significant DEX liquidity for fTokens was observed.
- **Throttled exit**: During high utilization, the expansion-rate mechanism throttles large withdrawals.

### Lending TVL by Asset Type — Refreshed May 23, 2026

Source: DeFiLlama `fluid-lending` `chainTvls.Ethereum.tokensInUsd` snapshot dated 2026-05-23 23:02 UTC (Ethereum-only, total $531.2M of supply collateral routed through the Liquidity Layer; this includes Vault-collateral deposits, not only fToken supply).

| Asset Type | Eth Supply TVL | % of Eth |
|------------|----------------|----------|
| ETH/LSTs (WSTETH, WEETH, WETH, OSETH, RSETH, …) | ~$230.8M | 43.4% |
| Stablecoins (USDT, USDC, USDE, GHO, USDT0, …) | ~$124.0M | 23.3% |
| Yield-bearing stablecoin wrappers (REUSD, SUSDE, SYRUPUSDT, SYRUPUSDC) | ~$96.3M | 18.1% |
| BTC tokens (WBTC, CBBTC) | ~$55.2M | 10.4% |
| Other (PAXG, XAUT, LBTC, METH, EZETH, …) | ~$24.9M | 4.7% |

Stablecoin share has rebounded since the Apr 27 trough (17.3% → 23.4%) as direct-stable lenders return; yield-bearing-stable-wrapper share fell on Ethereum (21.5% → 17.9%) but that is entirely because the largest such asset (SUSDAI) is **not on Ethereum** — see per-chain breakdown below. The cross-chain concentration story is materially worse than Ethereum-only suggests.

### Top Supply Assets (Cross-Chain) — Refreshed May 23, 2026

Source: DeFiLlama `fluid-lending` `tokensInUsd` snapshot dated 2026-05-23 23:02 UTC (cross-chain, total $872.5M).

| Rank | Token | Supply TVL | % of Total | Δ vs Apr 27 share |
|------|-------|-----------|------------|---------------------|
| 1 | **SUSDAI** | **$246.7M** | **28.3%** | **+8.4 pp** |
| 2 | **WSTETH** | $160.3M | **18.4%** | +1.6 pp |
| 3 | **REUSD** | $82.6M | **9.5%** | -3.2 pp |
| 4 | USDT | $69.6M | 8.0% | +4.3 pp |
| 5 | WBTC | $56.0M | 6.4% | -0.4 pp |
| 6 | WETH | $52.5M | 6.0% | +2.8 pp |
| 7 | USDC | $40.9M | 4.7% | -0.5 pp |
| 8 | USDT0 | $23.4M | 2.7% | +0.7 pp |
| 9 | WEETH | $21.5M | 2.5% | -10.4 pp |
| 10 | CBBTC | $15.7M | 1.8% | -0.8 pp |

**Top-5 concentration: 70.6%** (was 69.0% on Apr 27). **Top single-asset concentration: 28.3%** (was 19.9% on Apr 27, and 18.9% wstUSR in Feb 2026 before the bad-debt event).

### Per-Chain Concentration (Worse Than Cross-Chain Average) — May 23, 2026

| Chain | Total Supply | #1 Asset | #1 Share | #2 Asset | #2 Share |
|-------|--------------|----------|----------|----------|----------|
| **Arbitrum** | $185.4M | **SUSDAI** | **75.3%** | WSTETH | 8.6% |
| **Plasma** | $126.5M | **SUSDAI** | **80.4%** | USDT0 | 13.3% |
| Base | $24.8M | CBBTC | 29.2% | SUSDAI | 22.0% |
| Polygon | $4.5M | WBTC | 30.1% | WSTETH | 29.2% |
| Ethereum | $531.2M | WSTETH | 26.2% | REUSD | 15.5% |

On Arbitrum and Plasma, SUSDAI is **effectively the only supply asset that matters** (75.3% / 80.4% of those chains' lending TVL). A SUSDAI- or sUSDS-level upstream event would functionally take down lending on those two chains.

External corroboration: per [CoinDesk RWA Yield Infrastructure Trade](https://www.coindesk.com/research/the-rwa-yield-infrastructure-trade) (Mar 2026), **Fluid handles ~100% of on-chain sUSDai trading volume and 68% of reUSD trading volume**, so a redemption-side stress event in sUSDai would also concentrate on Fluid's liquidity venues.

### Concentration Risk Reassessment (May 24, 2026)

The Apr 27 reassessment said: *"the concentration risk has shifted assets but has not been reduced in pattern or magnitude."* That conclusion is now too optimistic. **In the 26 days since, SUSDAI grew from 19.9% → 28.3% of cross-chain lending TVL (+$97M absolute) and the protocol has accumulated the largest single-asset exposure in its history.**

Key facts:
- SUSDAI cross-chain share is **9.4 pp higher** than the wstUSR share that triggered the Mar 2026 incident.
- On Arbitrum and Plasma, SUSDAI is a single point of failure for the *chain's* lending business (75–80% of chain TVL).
- Of the top 4 supply assets globally, two (SUSDAI #1, REUSD #3) are yield-bearing stablecoin wrappers — the same structural amplification pattern as wstUSR/USR. Combined they are **37.8% of all-chain TVL** (was 32.6% on Apr 27).
- Fluid is also the dominant on-chain trading venue for sUSDai (~100%), so the redemption/liquidity surface for SUSDAI under stress is itself heavily Fluid-concentrated.

The structural reasoning from the Apr 27 report still holds: yield-bearing-stable wrappers carry contagion risk because their wrap ratio amplifies losses when the underlying depegs. The change since Apr 27 is in **magnitude**, not in pattern.

### Historical Liquidity Performance

- August 2024: -16.1% TVL drop, recovered without operational issues
- **March 2026: -30.3% drop, partial market freezes (wstUSR vaults), bad debt event covered, full recovery within days. Standard fToken markets remained functional.**
- **April 2026: -17.5% drop, precautionary rsETH freeze, no operational impact to other markets.**

## Centralization & Control Risks

### Governance — Re-verified onchain May 24, 2026 at block `25161749`

- **Governance Model**: Onchain GovernorBravo governance. FLUID token holders vote on proposals that execute through a timelock. Discussion on [governance forum](https://gov.fluid.io/), onchain voting via [GovernorBravo](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B), and offchain signaling via [Snapshot](https://snapshot.org/#/instadapp-gov.eth).
- **Timelock**: [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) — **1-day (86,400s) delay** ✓ unchanged. Admin = GovernorBravo.
- **Owner/Admin**: All core contracts (Liquidity Layer proxy admin, LendingFactory, RebalancerProxy) confirmed owned by the **Timelock** (`0x2386DC45...`) — verified onchain via `owner()` and EIP-1967 admin slot reads at block `25161749`.
- **GovernorBravo Parameters** (re-verified onchain May 24 2026 at block `25161749`):
  - Quorum: 4,000,000 FLUID (4% of total supply) ✓
  - Proposal threshold: 1,000,000 FLUID (1% of total supply) ✓
  - Voting delay: 7,200 blocks (~1 day) ✓
  - Voting period: 14,400 blocks (~2 days) ✓
  - **Proposals created: 131; proposals executed: 120** (was 128 created / 120 executed on May 11)

### Lending-Specific Admin Controls (Unchanged in scope; rebalancer address corrected)

| Role | Who | What They Can Do to Lending |
|------|-----|---------------------------|
| **Timelock** (governance) | [`0x2386DC45...`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Upgrade Liquidity Layer implementation, change LendingFactory owner, change supply/borrow configs, change rate models |
| **LendingFactory Auths** | Set by Timelock | Update fToken rewards config, change rebalancer address, rescue stuck tokens, set fToken creation code |
| **LendingFactory Deployers** | Set by Timelock | Create new fToken contracts |
| **Rebalancer (fUSDC, fUSDT)** | [`0x264786EF…ce92`](https://etherscan.io/address/0x264786EF916af64a1DB19F513F24a3681734ce92) — `FluidReserveContractProxy`, `owner()=Timelock` | Deposit underlying without minting shares (adds as rewards). Cannot withdraw. (Corrected from Apr 2026 report, which named the inactive `FluidLendingRewardsRateModel` `0x724d…b9b6` in this slot.) |
| **Guardian** (Avocado multisig) | [`0x4F6F977a...`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Pause Class 0 protocols only. **Cannot move or withdraw funds.** Cancel timelock transactions. Used to freeze rsETH markets in Apr 2026 (precautionary). |

**Key finding (unchanged):** No admin role can directly access or move user funds deposited via fTokens. The most powerful action is the Timelock upgrading the Liquidity Layer implementation (1-day delay). The Guardian's pause capability was exercised appropriately in both Mar and Apr 2026 events without abuse. **Two batches of `LogUnpauseUser` events on May 12 and May 13 2026** (txs [`0x8e63…7618`](https://etherscan.io/tx/0x8e63f96e4358993c71ceefbcaa707f34b6cb009a1d2decdd164b0482da2d7618) and [`0x463d…0b3f`](https://etherscan.io/tx/0x463d1ea177b98ddc087bea8afddde155e31648249b5393ea3a22ab0f18fa0b3f)) routed through the Liquidity Layer ConfigHandler (`0x46978CD4…`) re-enabled several previously-frozen vaults — consistent with markets reopening post-Resolv/Kelp.

### Programmability

- **System Operations**: Largely programmatic. Interest rates and exchange rates are all computed onchain algorithmically.
- **Oracle System** (dependency via Vault Protocol): Chainlink primary, with UniswapV3 TWAP, Redstone, and custom center-price oracles as fallbacks. Modular per vault.
- **Rate Model**: Interest rates determined algorithmically via kink-based utilization model. Parameters set by governance.
- **Keepers/Automation**: No keepers needed for lending. Liquidations (in Vaults) are incentivized and performed by external liquidators.

### External Dependencies

- **Liquidity Layer**: Critical dependency — holds all fToken deposits. Upgradeable proxy controlled by Timelock.
- **Vault Protocol**: Generates fToken yield. Vault borrowers, liquidations, and oracles all affect lending counterparty risk.
- **Chainlink**: Indirect dependency via Vault Protocol oracle system. Multiple fallback oracle paths reduce risk.
- **Permit2**: Supported for deposits (Uniswap's `0x000000000022D473030F116dDEE9F6B43aC78BA3`).
- **External collateral asset issuers (NEW emphasis)**: As demonstrated by the Resolv (USR/wstUSR) and Kelp (rsETH) events, the protocol's risk surface includes the operational security of every accepted collateral asset issuer. A compromise of an issuer's keys or bridge can produce contagion damage even without any bug in Fluid.

## Operational Risk

- **Team**: Instadapp Labs. Founded by **Sowmay Jain** and **Samyak Jain** — both are publicly known, India-based founders active since 2019. Key GitHub contributors include **thrilok209**, **KABBOUCHI**, and **SamarendraGouda**.
- **Funding**: Well-funded by top-tier VCs: Pantera Capital, Coinbase Ventures, Standard Crypto, additional undisclosed investors.
- **Legal Structure**: Instadapp Labs.
- **Documentation**: Comprehensive technical documentation at [docs.fluid.instadapp.io](https://docs.fluid.instadapp.io/). Full source code on GitHub.
- **Communication**: Active [governance forum](https://gov.fluid.io/), [Discord](https://discord.com/invite/C76CeZc), Twitter [@0xfluid](https://x.com/0xfluid), [Blog](https://blog.instadapp.io/).
- **Incident Response (NEW evidence)**: Mar 2026 response demonstrated the team can act within ~30 minutes (pause/freeze affected markets) and arrange off-balance-sheet capital coverage of ~$70M within ~3 days. Strong response, but reliance on personal commitments rather than a programmatic mechanism is a structural concern.

## Monitoring

### Contracts to Monitor

| Contract | Address | Why Monitor |
|----------|---------|-------------|
| **fUSDC** | [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) | Largest fToken (~$204M May 24 2026). Exchange rate, deposits/withdrawals |
| **fUSDT** | [`0x5C20B550819128074FD538Edf79791733ccEdd18`](https://etherscan.io/address/0x5C20B550819128074FD538Edf79791733ccEdd18) | Second largest (~$135M May 24 2026). Exchange rate, deposits/withdrawals |
| **Liquidity Layer** | [`0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) | Holds all fToken deposits. Admin changes, implementation upgrades |
| **Liquidity Layer impl (current)** | [`0xcc331daf69752bece3dc98dbc63eacd5092266a2`](https://etherscan.io/address/0xcc331daf69752bece3dc98dbc63eacd5092266a2) | Implementation contract behind the proxy. Monitor for changes via EIP-1967 implementation slot. |
| **Timelock** | [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Owner of all core contracts — queued/executed transactions |
| **GovernorBravo** | [`0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) | Governance proposals, voting, execution |
| **Avocado Multisig** | [`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Guardian pause/cancel actions |

### Key Events to Watch (Unchanged + new emphasis)

| Contract | Event | Significance |
|----------|-------|-------------|
| **Timelock** | `QueueTransaction` / `ExecuteTransaction` | Governance actions queued/executed — 1 day warning |
| **Timelock** | `CancelTransaction` | Guardian cancelled a queued action |
| **Liquidity Layer** | `LogUpdateAuth` | Auth permissions changed — affects who can modify lending configs |
| **Liquidity Layer** | `LogUpdateGuardian` | Guardian address changed |
| **Liquidity Layer** | `LogPauseUser` / `LogUnpauseUser` | Protocol paused/unpaused — directly affects fToken operations. **Now an actively exercised path (Mar/Apr 2026).** |
| **Liquidity Layer** | `LogUpdateUserSupplyConfigs` | Supply limits changed — affects max fToken deposits |
| **Liquidity Layer** | `LogUpdateUserBorrowConfigs` | Borrow limits changed — affects utilization and withdrawal availability |
| **Liquidity Layer** | `LogUpdateRateDataV1` / `LogUpdateRateDataV2` | Interest rate parameters changed — affects fToken yield |
| **EIP-1967 Admin (proxy)** | Storage slot read | Implementation changes on Liquidity Layer / fToken contracts |
| **LendingFactory** | New fToken creation | New lending market created |

### New Monitoring Recommendation: Collateral Asset Issuers

Given the Mar/Apr 2026 contagion events, monitoring of the off-protocol collateral asset issuers (Resolv, Kelp, Ethena, Maple, etc.) is now a first-order concern. A compromise at any major upstream issuer can produce sub-day bad-debt events at Fluid even without any Fluid contract change.

**Top-priority issuer to monitor (May 2026 update): Sky / Maker (SUSDAI).** SUSDAI is now 28.3% of cross-chain Fluid lending TVL and 75–80% of Arbitrum/Plasma supply. Any incident touching sUSDS / Sky DSR mechanics, Sky governance keys, or sUSDai redemption mechanics is the single highest-impact external event for Fluid lenders at this snapshot.

## Risk Summary

### Key Strengths

- **fToken design held under stress**: Monotonically-increasing exchange rates verified at every checkpoint (Feb / Apr 27 / May 11 / May 24, all confirmed onchain); no direct loss to lenders on Ethereum.
- **Rapid incident response**: ~30 minute pause-and-freeze response on Mar 22; ~3 days to fully repay $70M of bad debt.
- **Recovery trajectory intact**: Lending TVL $751M (Apr 27 trough) → $872.5M (May 23), +16%. Previously-paused vaults unpaused May 12–13 without exit stress.
- Battle-tested team with ~6 years of DeFi operational history (Instadapp since 2019).
- 8 security audits from 4 reputable firms covering Lending Protocol and Liquidity Layer.
- Onchain GovernorBravo governance with 1-day Timelock and **131 proposals created / 120 executed** — all core contracts owned by Timelock (re-verified May 24 2026).
- Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- Fully programmatic interest rates and exchange rates — no offchain oracle for lending.
- ~2.26 years in production, ~$873M lending TVL across 5 chains.

### Key Risks

- **Concentration risk has grown, not shrunk**: The Feb 2026 wstUSR concentration (18.9%) produced the Mar 2026 incident. The Apr 27 reassessment flagged the same pattern at SUSDAI (19.9%). By May 23 2026 SUSDAI is **28.3% of cross-chain TVL and 75–80% of Arbitrum/Plasma supply** — larger than the wstUSR exposure that triggered the prior incident, and structurally identical.
- **Ad-hoc bad-debt coverage**: The Mar 2026 recovery relied on **discretionary off-balance-sheet loans from named individuals/entities** (cyberfund/Lomashuk, weremeow, Fluid core team). There is no programmatic, pre-funded insurance fund, first-loss tranche, or contractual coverage obligation. The same coverage pattern is not guaranteed to scale to a larger event.
- **Wrapped-stablecoin contagion amplification**: The wstUSR wrapping ratio meant that even a partial USR repeg would not have made wstUSR-collateralized borrowers solvent. SUSDAI and REUSD share this structural property.
- **Trading-venue concentration for SUSDAI**: Fluid handles ~100% of on-chain sUSDai trading volume — under stress, SUSDAI redemption flow would concentrate on Fluid's own venues, amplifying the impact of the supply-side concentration.
- **Shared Liquidity Layer**: fToken deposits are commingled with Vault, DEX, and stETH protocol funds. A vulnerability anywhere in the stack affects fToken holders.
- **Liquidity Layer upgradeability**: Upgradeable proxy controlled by Timelock with only 1-day delay.
- **No formal verification** has been performed.
- **External collateral-issuer dependency surface**: Mar/Apr 2026 demonstrated this is a first-order risk; the SUSDAI growth makes Sky/Maker the single most important external dependency to monitor.
- **Proposal-text vs onchain-effect gap**: Proposal #128 (executed May 5) did not produce the USDC/USDT kink change its text described. No proposal #129–#131 has corrected this. Minor in isolation, but suggests a coordination gap between governance authoring and module-update execution worth watching.

### Critical Risks

- None that would trigger an automatic score of 5. All contracts verified, reserves fully onchain, governance is via onchain GovernorBravo + Timelock, no EOA control. Guardian can only pause. The Mar 2026 bad-debt event was material but did not result in lender losses on Ethereum.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. 8 audits by 4 reputable firms. Lending Protocol directly covered.
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain via resolver contracts. fToken exchange rates computed programmatically and verified monotonically increasing through stress events.
- [x] **Total centralization** — PASSED. Onchain GovernorBravo governance with 1-day Timelock. No EOA control. Guardian can only pause.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Unchanged — 8 audits across 4 firms. All 3 criticals and 13 highs from prior audits resolved. No new audits since Feb 2026 (audits page rechecked May 24 2026).
- **History**: ~2.26 years in production, **~$873M lending TVL across 5 chains** (May 23 2026 snapshot; Apr 27 drawdown bottom was $751M).
- **Bounty**: Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- **Material incidents (unchanged from Apr 27)**: Mar 2026 Resolv contagion → $10–17.5M bad debt, lenders made whole; Apr 2026 Kelp/rsETH precautionary freeze, no bad debt.

**Score: 2.0/5** (unchanged from Apr 27). Strong audit coverage and bounty unchanged. History grew from ~2.18 → ~2.26 years but is still not "incident-free": one bad-debt event covered via off-balance-sheet capital, plus one precautionary freeze. Still excellent overall.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 2.0** (unchanged)
- Full onchain GovernorBravo governance with 131 proposals created / 120 executed
- 1-day timelock delay; all core contracts owned by Timelock (re-verified May 24 2026)
- No admin role can directly access or withdraw fToken user funds
- Guardian pause used appropriately in Mar/Apr 2026 events; no abuse. Post-stress unpauses (May 12–13) routed through governance-permissioned ConfigHandler.

**Subcategory B: Programmability — 1.5** (unchanged)
- Fully programmatic: interest rates and fToken exchange rates all onchain
- ERC4626 fTokens with algorithmically computed, monotonically increasing exchange rates (re-verified May 24 2026 — monotonicity continues through all stress events)
- No offchain keepers/oracles for lending
- Bad-debt coverage process is **not programmatic** (relies on discretionary capital commitments) — a structural gap, but does not affect day-to-day operations

**Subcategory C: Dependencies — 2.5** (unchanged)
- Critical dependency on Liquidity Layer (unchanged)
- Indirect dependency on Chainlink via Vault Protocol oracle system (unchanged)
- External collateral-issuer dependency remains a first-order risk (Mar/Apr 2026 events). The SUSDAI concentration growth since Apr 27 (see Funds Mgmt § A below) intensifies this dependency on a single issuer (Sky/Maker ecosystem) and a single asset.

**Score: 2.0/5** (unchanged). (2.0 + 1.5 + 2.5) / 3 = 2.0.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 2.75** (was 2.5)
- All lending is over-collateralized via Vault Protocol (unchanged).
- **Top supply asset SUSDAI grew from 19.9% → 28.3% of all-chain TVL (+$97M) in 26 days.** This is the largest single-asset exposure in the protocol's history (wstUSR peaked at 18.9% before the Mar 2026 incident).
- **On Arbitrum and Plasma, SUSDAI is 75.3% and 80.4% of chain TVL respectively** — a SUSDAI-level upstream event would functionally take down lending on those two chains.
- Top-4 yield-bearing-stable wrappers (SUSDAI + REUSD) now total **37.8%** of cross-chain TVL (was 32.6% on Apr 27); two of the top three slots.
- Fluid handles ~100% of on-chain sUSDai trading volume (CoinDesk research, Mar 2026), so the redemption/liquidity surface for SUSDAI under stress is itself heavily Fluid-concentrated — amplifying the risk.
- Tick-based liquidation mechanism (unchanged); the Mar 2026 incident showed it cannot prevent bad debt for collateral that experiences extreme intraday repricing.
- Bad-debt coverage is discretionary, not programmatic (unchanged).

**Subcategory B: Provability — 1.0** (unchanged)
- fToken exchange rates computed programmatically (ERC4626), monotonically increasing — verified through stress events and through the May 11 → May 24 window
- Interest rates algorithmically determined via kink-based model
- All reserves verifiable onchain via FluidLiquidityResolver
- No offchain reporting dependencies

**Score: 1.88/5** — (2.75 + 1.0) / 2 = 1.875 (was 1.75). Collateralization is bumped 0.25 to reflect the magnitude growth of the same pattern flagged at Apr 27 (SUSDAI concentration well past the 15% trigger and now larger than the wstUSR exposure that materialized in Mar 2026). Provability unchanged.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: fToken withdrawals subject to Liquidity Layer withdrawal limits and available liquidity
- **Stress test results (Mar 22–25, 2026)**: $300M+ net outflows in 24 hours absorbed; standard fToken markets remained operational; affected vaults paused. Kink-based rate model worked as designed.
- **Stress test results (Apr 18–20, 2026)**: ~$180M outflows over 2 days; rsETH markets precautionarily frozen; no other operational impact.
- **Recovery (Apr 27 → May 24)**: lending TVL recovered $751M → $872.5M (+16%); previously paused vaults unpaused on May 12–13 with no observed exit stress.
- **Withdrawal limits**: Expandable limits throttle large exits.
- **Shared pool risk**: Liquidity Layer serves lending, vaults, DEX, and stETH (unchanged)
- **Concentration**: SUSDAI exposure now $246.7M (28.3% cross-chain, 75–80% on Arbitrum/Plasma) — the previously-flagged concentration-as-liquidity-risk vector has *grown*, not shrunk. Concentration is mostly captured in Funds Mgmt § A; in this category it manifests as: a SUSDAI stress event would likely produce per-chain withdrawal pressure on Arbitrum/Plasma similar in shape to the Mar 2026 Ethereum event.
- **Secondary market**: No significant DEX liquidity for fTokens themselves.

**Score: 2.0/5** (unchanged). Withdrawal mechanism robustness validated by Mar/Apr 2026 stress events. Concentration risk is rising but the Apr 27 score already reflected the structural pattern — the magnitude change is captured in Funds Mgmt § A rather than double-counted here.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Publicly known founders (Sowmay Jain, Samyak Jain). Active since 2019. Strong DeFi reputation.
- **Funding**: Well-funded by Pantera Capital, Coinbase Ventures, and others.
- **Docs**: Comprehensive documentation and open-source code.
- **Incident Response**: Mar 2026: ~30 min pause/freeze response, $70M coverage arranged in ~3 days. Strong execution; reliance on personal commitments rather than programmatic backstop remains a structural concern.

**Score: 1.5/5** (unchanged). Publicly known team, strong reputation, well-funded, comprehensive docs.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0  | 20% | 0.40  |
| Centralization & Control | 2.0  | 30% | 0.60  |
| Funds Management | 1.88 | 30% | 0.564 |
| Liquidity Risk | 2.0  | 15% | 0.30  |
| Operational Risk | 1.5  | 5% | 0.075 |
| **Subtotal** | | | **1.94** |

**Optional Modifiers:**

- Protocol live >2 years with no incidents: **NOT APPLIED**. Protocol has been live >2 years (2.26y), but the Mar 2026 Resolv contagion / bad-debt event disqualifies the "no incidents" condition.
- TVL maintained >$500M for >1 year: **APPLIED (-0.5)**. Lending TVL has been >$500M for >1.5 years and is currently ~$872.5M (May 23 2026 DeFiLlama snapshot).

**Final Score: 1.94 − 0.5 = 1.44** → rounded to **1.4** (unchanged from Apr 2026 at one-decimal rounding; was 1.1 in Feb 2026). Underlying weighted subtotal moved 1.90 → 1.94 driven entirely by the SUSDAI concentration growth (Funds Mgmt § A: 2.5 → 2.75).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| **1.0–1.5** | **Minimal Risk** | **Approved, high confidence** |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| 2.5–3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: MINIMAL RISK** (unchanged tier; final one-decimal score 1.4 unchanged; underlying subtotal 1.90 → 1.94)

The Fluid Lending Protocol (fTokens) remains a well-designed ERC4626-compliant lending product. Operational metrics since the Apr 27 reassessment are positive: TVL recovered from $751M → $872.5M (+16%), fToken exchange rates kept increasing monotonically across every checkpoint (Feb / Apr 27 / May 11 / May 24), governance is functioning normally (131 proposals created / 120 executed; #129 currently queued past eta), Avocado guardian 7-of-14 unchanged, Liquidity Layer impl unchanged at `0xcc33…66a2`, and previously-paused vaults reopened on May 12–13 without exit stress.

The single negative datapoint that moves the underlying score is the **concentration trajectory**. The Apr 27 report flagged SUSDAI (19.9%) as structurally identical to the pre-incident wstUSR exposure (18.9%). Twenty-six days later SUSDAI is **28.3% of cross-chain TVL** ($246.7M) and is **75.3% of Arbitrum and 80.4% of Plasma supply** — by every measure larger than the wstUSR exposure that produced Mar 2026's bad debt. Combined with the fact that Fluid handles ~100% of on-chain sUSDai trading volume, the SUSDAI exposure is now both bigger than the prior incident's trigger and structurally tightly coupled to Fluid's own venues. The Funds Mgmt § A (Collateralization) subcategory moves 2.5 → 2.75 in response; everything else holds. At the one-decimal rounding the final score stays at 1.4, but the next reassessment cadence is shortened to 3 months in light of the trajectory.

---

## Reassessment Triggers

- **Time-based**: Reassess in 3 months (Aug 2026) — shorter than the standard 6 months because SUSDAI concentration is on a rising trajectory and warrants closer monitoring. Or earlier if any of the below trigger.
- **Concentration-based (escalated)**: Reassess **immediately** if SUSDAI exceeds 30% of cross-chain lending TVL (currently 28.3%) OR if any per-chain single-asset concentration exceeds 85% (Arbitrum SUSDAI 75.3%, Plasma SUSDAI 80.4% — both approaching this threshold). The 15% generic trigger from prior reports is permanently firing for SUSDAI/REUSD/WSTETH; the meaningful trigger now is on growth rate.
- **Coverage-mechanism formalization**: Reassess if Fluid implements a programmatic insurance/coverage layer (would lower funds-management subcategory). Conversely, reassess if the protocol experiences a second bad-debt event without comparable third-party coverage.
- **Foundation execution**: Reassess once the Cayman Islands Fluid Foundation IP transfer completes (would improve operational score).
- **TVL-based**: Reassess if lending TVL changes by more than 50% from current ~$872M baseline (May 23 2026).
- **Incident-based**: Reassess after any further exploit, governance change, significant parameter modification, or contagion event from a major collateral issuer (especially Sky/Maker for SUSDAI, Re for REUSD).
- **Governance**: Reassess if GovernorBravo parameters change (quorum, timelock delay, voting period) or if Avocado guardian configuration changes.
- **Dependency**: Reassess if Liquidity Layer implementation is upgraded (current impl: `0xcc331daf69752bece3dc98dbc63eacd5092266a2`) or if a new protocol is added to the shared liquidity pool.
- **Utilization-based**: Reassess if Ethereum lending utilization sustains >99% for >24 hours.

## Open Observations

- **Proposal #128 (executed May 5 2026) didn't change USDC/USDT kinks** despite the proposal text saying it would; only an ETH `rateAtUtilizationMax` event was emitted. Not corrected in proposals #129–#131.
- **Proposal #129 sat Queued past eta** (eta May 20 16:17 UTC, snapshot May 24 01:06 UTC) without execution. Within Timelock grace period, but worth tracking.

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GOVERNANCE LAYER                                │
│                                                                          │
│   FLUID Token Holders   (100M max supply, 4M quorum, 1M propose)         │
│              │                                                           │
│              │ propose / vote                                            │
│              ▼                                                           │
│   ┌────────────────────────────┐      ┌──────────────────────────────┐  │
│   │  GovernorBravo             │      │  Avocado Multisig (Guardian) │  │
│   │  0x0204Cd03...             │      │  0x4F6F977a...               │  │
│   │  proposalCount: 131        │      │  Custom contract (not Safe)  │  │
│   │  120 Executed / 1 Queued   │      │  7-of-14 (unchanged May 24)  │  │
│   │  1 Active / 1 Pending      │      │  - Pause Class-0 protocols   │  │
│   │  voting: 1d delay, 2d vote │      │  - Cancel timelock txns      │  │
│   └────────────┬───────────────┘      └────────────┬─────────────────┘  │
│                │ queue                             │ cancel              │
│                ▼                                   ▼                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  Timelock — 1-day delay (admin = GovernorBravo)                  │  │
│   │  0x2386DC45AdDed673317eF068992F19421B481F4c                      │  │
│   │  Owns: Liquidity Layer admin slot, LendingFactory, VaultFactory, │  │
│   │        DexFactory                                                │  │
│   └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │ owns / upgrades
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CORE INFRASTRUCTURE                               │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  Liquidity Layer  (Instadapp Infinite Proxy)                     │  │
│   │  Proxy: 0x52Aa899454998Be5b000Ad077a46Bbe360F4e497                │  │
│   │  EIP-1967 dummy impl (current): 0xcc331daf… (since Mar 31 2026)  │  │
│   │      previous: 0xa57d7cEF…  (upgrade tx 0xf484b2a2…)             │  │
│   │  Module-dispatch logic in module slots, NOT EIP-1967 impl slot   │  │
│   │                                                                  │  │
│   │  Holds ALL deposits across lending / vaults / DEX / stETH        │  │
│   └────┬─────────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│   ┌────▼────────────────┐  ┌─────────────────┐  ┌───────────────────┐   │
│   │  LendingFactory     │  │  Resolvers      │  │  Sibling Factories│   │
│   │  0x54B91A0D...      │  │  FluidLiquidity │  │  VaultFactory     │   │
│   │  Deploys fTokens    │  │  Revenue        │  │  DexFactory       │   │
│   └────┬────────────────┘  └─────────────────┘  └────────┬──────────┘   │
└────────┼───────────────────────────────────────────────────┼────────────┘
         │ deploys                                           │ deploys
         ▼                                                   ▼
┌──────────────────────────────────┐    ┌────────────────────────────────┐
│   LENDING PROTOCOL (fTokens)     │    │   SIBLING PROTOCOLS            │
│   ERC4626, monotonic exch. rate  │    │   (share Liquidity Layer)      │
│                                  │    │                                │
│   fUSDC   0x9Fb7…  ~$204M        │    │  Vault Protocol                │
│   fUSDT   0x5C20…  ~$135M        │    │   - borrowers + collateral     │
│   fGHO    0x6A29…  ~$15M         │◀───│   - tick-based liquidations    │
│   fwstETH 0x2411…  ~1,828 wstETH │ yield   - generates fToken yield    │
│   fWETH   0x9055…  ~3,335 WETH   │    │                                │
│   fUSDtb  0x15e8…  ~$2.1M        │    │  DEX Protocol                  │
│   fsUSDS  0x2BBE…  ~$15K         │    │  stETH Protocol                │
│                                  │    │                                │
│   Eth subtotal grew vs May 11    │    │                                │
│   All-chain lending TVL: ~$873M  │    │                                │
└──────┬──────────────────▲────────┘    └─────────┬──────────────────────┘
       │ deposit            ▲ withdraw            │ borrow / repay
       ▼                    │                     ▼
   Lenders               (no value loss        Borrowers
                          Mar/Apr 2026)        (post collateral)
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL DEPENDENCIES                              │
│                                                                          │
│  ORACLES  (Vault Protocol consumes these for liquidations)               │
│    Chainlink (primary)  •  UniswapV3 TWAP  •  Redstone  •  custom        │
│                                                                          │
│  COLLATERAL-ASSET ISSUERS  ← first-order contagion vector                │
│    Top-10 cross-chain supply (May 23 2026, total $872.5M):               │
│      SUSDAI   28.3%  (Sky yield-bearing wrapper)       ★★ +8.4 pp        │
│      WSTETH   18.4%  (Lido)                                              │
│      REUSD     9.5%  (Re Protocol yield-bearing stable) ★ -3.2 pp        │
│      USDT      8.0%   WBTC  6.4%   WETH 6.0%   USDC 4.7%                 │
│      USDT0     2.7%   WEETH 2.5%   CBBTC 1.8%                            │
│    ★ = yield-bearing stablecoin wrapper (same structural pattern as      │
│        wstUSR/USR that produced the Mar 22 2026 bad-debt event)          │
│    ★★ = SUSDAI per-chain: Arbitrum 75.3%, Plasma 80.4% (single asset)    │
│                                                                          │
│                                                                          │
│    Materialized contagion (since Feb 2026 assessment):                   │
│      Mar 22 2026 — Resolv USR depeg → wstUSR collateral collapse →       │
│                    $10–17.5M bad debt (covered off-balance-sheet)        │
│      Apr 18 2026 — Kelp DAO bridge exploit → rsETH precautionary freeze  │
│                    (no Fluid contract loss)                              │
│                                                                          │
│  PERMIT2 (Uniswap):  0x000000000022D473030F116dDEE9F6B43aC78BA3          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Risk pathways (key):**

- **Lender → fToken → Liquidity Layer**: fully programmatic ERC4626 with burn-before-withdraw; exchange rate monotonically increasing (verified through both 2026 events).
- **Borrower default → bad debt → fToken yield**: realized in Mar 2026 ($10–17.5M). **No programmatic backstop**; covered via discretionary loans (cyberfund/Lomashuk, weremeow, Fluid core team).
- **Collateral-issuer compromise → wrap-ratio amplified loss → bad debt**: the structural pattern that produced Mar 2026. **SUSDAI is now 28.3% cross-chain and 75–80% on Arbitrum/Plasma** — larger than the wstUSR exposure that triggered the prior incident. REUSD (9.5%) replicates the same pattern at smaller scale.
- **Governance → Timelock (1d) → Liquidity Layer impl**: upgrade path. The Mar 31 2026 upgrade bundled dummy-impl swap + module-dispatcher selectors in one tx (`0xf484b2a2…`); follow-up verification found no USDC/USDT rate event in that receipt.
- **Avocado Guardian → Pause Class-0**: cannot move funds; used appropriately in both Mar and Apr 2026 events.
