# Protocol Risk Assessment: Fluid Lending Protocol

- **Assessment Date:** February 12, 2026 (Updated: September 29, 2026)
- **Token:** fTokens (fUSDC, fUSDT, fWETH, etc.)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) (fUSDC)
- **Final Score: 2.61/5.0**

## Reassessment Summary (September 2026)

Onchain snapshot at Ethereum block `26079998` (September 29, 2026); Arbitrum and Base reads and DeFiLlama data are from the same day. Core Fluid controls are unchanged: every core contract is still Timelock-owned, the Timelock delay is still 1 day, the Liquidity Layer implementation is the same, and GovernorBravo parameters are the same. Every fToken exchange rate is higher than at the July snapshot. **Final score 2.57 → 2.61 (still Medium Risk)**: Collateralization moves 4.0 → 4.25 because of the USDai hard peg below.

**Change #1: sUSDai concentration eased but is still dominant.** sUSDai is **27.8%** of cross-chain lending TVL ($205.4M), back below the 30% trigger. The drop comes from other assets growing; the sUSDai position itself grew. The per-chain share is **59.6% of Arbitrum** and **66.1% of Plasma** supply, and sUSDai is also the largest asset on Base (24.3%). sUSDai market cap has grown to ~$487M, so Fluid's ~184M sUSDai shares are now **~42% of circulating supply**, down from roughly two-thirds. CoinGecko 24h volume was ~$10.9M (~2.2% of market cap), up from ~$681K in July.

**Change #2: every sUSDai vault checked prices USDai at a fixed $1, and ~$214M of debt sits behind those oracles.** Across Ethereum, Arbitrum, and Base, each sUSDai vault oracle uses a single hop: the sUSDai→USDai exchange rate, with USDai treated as exactly 1 USDC/USDT/GHO and no market price input. On Ethereum, [IGP-136](https://etherscan.io/tx/0xd15d1125436002e51ac376212227f07b971156e64d0eac2c4bc8e56a8c824c6a) (July 21) moved all eight sUSDai vaults to [`FluidChainlinkCappedRate`](https://etherscan.io/address/0xC5D27C5d356479b681328351F1583c63051E76a0) over the Chainlink "SUSDAI / USDAI Exchange Rate" feed. Arbitrum uses a `FluidERC4626CappedRate` and Base a `FluidChainlinkCappedRateL2`, both quoting USDai per sUSDai. Onchain debt against sUSDai collateral is **~$106.1M on Ethereum, ~$100.9M on Arbitrum, and ~$7.4M on Base (~$214.3M total)**, at 82–88% vault-level LTV against an 88% collateral factor and 90% liquidation threshold. A USDai depeg of more than ~10% would leave maxed positions underwater with no liquidation. The USDai-collateral vaults add ~$4.4M of debt at ~93% LTV against a 94% threshold. USDai traded between $0.9989 and $1.0006 over the 75 days to Sep 29. Plasma could not be checked because no Plasma RPC is configured.

**Change #3: TVL recovered.** Lending TVL is **$737.5M** (DeFiLlama, Sep 29), up 15.4% from $639.0M on Jul 14. The 30-day range was $726.1M–$767.3M. Overall Fluid TVL is ~$988.0M.

**Other changes (verified onchain):**

- **Guardian multisig:** now **6-of-12**, down from 7-of-14. On Sep 9 [tx `0xa374…0bff`](https://etherscan.io/tx/0xa37473e230d292ec5e19f1ccbc062d4ea6807b501642ccead04927fd713b0bff) removed two signers and set the threshold to 6. On Sep 13 [tx `0x6135…edcd`](https://etherscan.io/tx/0x613501ea762c79eaf0cac946101062800ac8c342fbd151143197db368a17edcd) replaced one signer with another. 11 of the 12 current signers were signers at the July snapshot. The threshold stays at half the signer set.
- **Governance:** proposalCount 135 → 140, and all five new proposals executed (132 of 140 executed in total). [IGP-137](https://etherscan.io/tx/0x09ab220ddd2b56babe0372efff2e05ab4e2460a595c9004a5eadaffee65066ec) moved **5,000,000 FLUID** (5% of supply, above the 4M quorum) from the treasury to a dedicated wallet, [`0xcabe…3fd7`](https://etherscan.io/address/0xcabebc7f76d53582a4be7d9972a2b4f531753fd7), for the AGI3 institutional-custody partnership. At the snapshot this wallet had not delegated its votes. [IGP-138](https://etherscan.io/tx/0xe1594471c2f5e314303e7bc4b160a0a2684b9abca903fb4fcfd7a5fccefd5b15) and [IGP-140](https://etherscan.io/tx/0xa21b5547fb79dba5ca5398aca783c76dde38cc7a2e6edc3383c74709c0a6d67c) cut borrow capacity on legacy collateral (osETH, tBTC, LBTC, ezETH, rsETH, weETHs). IGP-136 and IGP-140 used Liquidity Layer revenue to repay the remaining Resolv-related debt and to fund the Foundation grant.
- **sUSDai bridge:** on Sep 21, the USD.AI 48h timelock upgraded the Ethereum sUSDai `OToken` to v1.1 ([tx `0x6398…0d41`](https://etherscan.io/tx/0x639875db790f62f1dad1f53ad755c0595817b8650b4eea0150b7d4dc54b50d41)). The adapter address is now hard-coded as the only minter, and a `PAUSE_ADMIN_ROLE` was added that halts bridge mints and burns (no holder yet on Ethereum). The Arbitrum `OAdapter` added **Solana** (Aug 14) and **Arc** (Sep 10) as peers. That makes five inbound routes, all using the same 3-of-3 DVN set and a 10M sUSDai/hour limiter, that can mint canonical Arbitrum sUSDai.
- **Liquidity Layer:** no `LogUpdateAuths`, `LogUpdateGuardians`, `LogPauseUser`, or `LogUnpauseUser` events and no implementation changes since block `25529610`. The only rate events were two new listings, USDat (Aug 6) and trUSD (Aug 18). USDC/USDT/GHO/ETH curves are unchanged.
- **Cross-references:** reUSD's standalone score is now **3.45 (Medium Risk)**, improved from 3.51. PST grew to $52.0M (7.1% of cross-chain TVL), and Fluid holds ~25.5% of Ethereum PST supply. The PST CCIP pool is still the only minter and Solana is still its only remote chain.
- **Audits:** no new audits published since the May 24 report.

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

### fToken On-Chain State (Ethereum Mainnet)

| fToken | Total Assets (Sep 29 2026) | Total Assets (Jul 14 2026) | `convertToAssets(1 share)` Jul 14 → Sep 29 |
|--------|---------------------------|---------------------------|--------------------------------------------|
| fUSDC | 131.4M USDC | 134.4M USDC | 1.205908 → 1.218341 |
| fUSDT | 133.2M USDT | 130.5M USDT | 1.196235 → 1.207877 |
| fGHO | 26.66M GHO | 15.45M GHO | 1.117172 → 1.126087 |
| fwstETH | 731.9 wstETH | 359.8 wstETH | 1.038401 → 1.038476 |
| fWETH | 867.0 WETH | 1,599.5 WETH | 1.077947 → 1.082061 |
| fUSDtb | 1.92M USDtb | 2.22M USDtb | 1.025424 → 1.032478 |
| fsUSDS | 13.85 sUSDS | 5,015 sUSDS | 1.002057 → 1.002057 (no sUSDS borrowing) |

Onchain at blocks `25529610` and `26079998`. Every fToken exchange rate is monotonically increasing (ERC-4626) and has never decreased at any checkpoint — the key safety property confirming fToken holders have not lost principal value on Ethereum.

Over the Jul 14 → Sep 29 window, fGHO (+72.5%) and fwstETH (+103%) grew, fUSDC (−2.2%) and fUSDT (+2.1%) were roughly flat, and fWETH (−45.8%) and fUSDtb (−13.6%) contracted. fsUSDS was almost fully withdrawn after the Jul 11 pause of the sUSDS-borrowing vaults ([tx `0x16aa…c138`](https://etherscan.io/tx/0x16aa9b50da7ddc833dd19189a4356851732dbcca7db5e3cc15e751636f6bc138)); its rate is flat because no sUSDS is borrowed.

### Core Infrastructure

All core contracts are owned/administered by the Timelock (1-day delay, GovernorBravo admin).

| Contract | Address | Role / Key Facts |
|----------|---------|------------------|
| Liquidity Layer (proxy) | [`0x52Aa…F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) | Holds all funds. Upgradeable Instadapp Infinite Proxy; admin = Timelock; current impl [`0xcc331…266a2`](https://etherscan.io/address/0xcc331daf69752bece3dc98dbc63eacd5092266a2) (since Mar 31 2026). |
| LendingFactory | [`0x54B9…51D03`](https://etherscan.io/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03) | Deploys fTokens; owner = Timelock. |
| Timelock | [`0x2386…1F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | 1-day (86,400s) delay; admin = GovernorBravo. |
| GovernorBravo | [`0x0204…5fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) | 140 proposals, 132 executed (8 terminal non-executed: 3 Canceled, 3 Defeated, 2 Expired). Quorum 4M / threshold 1M FLUID; 1-day voting delay, 2-day voting period. |
| Avocado Guardian / Team Multisig | [`0x4F6F…D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | 6-of-12 custom multisig (7-of-14 until Sep 9 2026); can pause Class-0 protocols and cancel timelock txns; **cannot move Liquidity Layer funds**. Governance also grants it temporary vault/DEX auth during market launches and routes treasury and revenue transfers through it. |
| FLUID token | [`0x6f40…03eb`](https://etherscan.io/address/0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb) | Governance token; 100M total supply. |
| Rebalancer (FluidReserveContractProxy) | [`0x2647…ce92`](https://etherscan.io/address/0x264786EF916af64a1DB19F513F24a3681734ce92) | Permissioned `rebalance()` on fUSDC/fUSDT; owner = Timelock; deposits underlying as rewards, cannot withdraw. |
| LiquidityResolver / RevenueResolver | [`0xca13…5C60`](https://etherscan.io/address/0xca13A15de31235A37134B4717021C35A3CF25C60) / [`0x0A84…0F32`](https://etherscan.io/address/0x0A84741D50B4190B424f57425b09FAe60C330F32) | Read-only periphery. |

The most powerful admin action is the Timelock upgrading the Liquidity Layer implementation (1-day delay); the current impl is treated as in-scope of the 2025 MixBytes/StateMind Liquidity Layer audits absent a separate post-upgrade review.

## Audits and Due Diligence Disclosures

**No new audits have been published since the Feb 2026 assessment.** The audit landscape is unchanged: 8 distinct security audits across 4 audit firms covering all major protocol components, including the Lending Protocol (PeckShield + StateMind full-protocol audits) and the Liquidity Layer (MixBytes + StateMind dual audit in 2025). All audit reports are available on the [audits and security page](https://docs.fluid.instadapp.io/audits-and-security.html).

The Resolv USR contagion event was **not the result of an unaudited Fluid contract bug**; it was the result of a leverage-loop borrower position becoming undercollateralized when an external collateral asset (wstUSR) collapsed in price following the upstream Resolv exploit.

| Firm | Date | Scope |
|------|------|-------|
| PeckShield | Nov 2023 | Full Protocol (incl. Lending) |
| StateMind | Oct–Dec 2023 | Full Protocol (incl. Lending) |
| MixBytes | Mar–Jun 2024 | Vault Protocol |
| Cantina | Sep–Oct 2024 | DEX Protocol |
| MixBytes | Oct 2024 | DEX Protocol |
| MixBytes | Sep–Dec 2025 | Liquidity Layer |
| StateMind | Sep–Oct 2025 | Liquidity Layer |

No formal verification (Certora, Halmos, etc.) has been performed.

### Bug Bounty

Active [Immunefi program](https://immunefi.com/bug-bounty/instadapp/) (under the "Instadapp" name) covering the Liquidity Layer, **Lending Protocol**, and Vault Protocol — up to **$500,000** for critical smart-contract bugs.

## Historical Track Record

- **Production History**: Fluid launched on Ethereum mainnet on **February 20, 2024**. As of September 29, 2026, the protocol has been in production for **~2.61 years (~952 days)**.
- **Total Fluid TVL** ([DeFiLlama "fluid"](https://defillama.com/protocol/fluid) — all products, all chains, supply-side only): **~$988.0M** as of September 29 2026 (July 14: ~$771.2M; May 23: ~$999.6M; Apr 27: $911.5M; Feb 2026: $1.45B; peak $2.68B on Oct 9, 2025).
- **Lending-only TVL** ([DeFiLlama "fluid-lending"](https://defillama.com/protocol/fluid-lending) — all chains): **~$737.5M** as of September 29 2026 (July 14: $639.0M; July 6 low: $631.9M; May 23: $872.5M; Apr 27: $750.8M; Feb 2026: $1.28B; peak $2.37B on Oct 9, 2025). Per-chain (September 29): Ethereum $505.1M, Arbitrum $153.0M, Plasma $46.6M, Base $28.4M, Polygon $4.4M.
- **Recent TVL trend (DeFiLlama, lending-only daily series):** After the May 23 peak of $872.5M, TVL fell to $631.9M on July 6 and has recovered since. Over the 30 days to Sep 29 it stayed between $726.1M and $767.3M. The recovery came from Ethereum (+$79.0M since Jul 14), Arbitrum (+$41.8M), and Base (+$9.9M), while Plasma shrank (−$33.3M).

### Major TVL Drawdowns (Historical)

| Date | Drawdown | Driver |
|------|----------|--------|
| 2024-03-20 | -13.7% | Early-protocol churn |
| 2024-08-06 | -16.1% | Broader crypto market selloff |
| 2025-04-11 | -11.3% | Market stress |
| **2026-03-23** | **-30.3%** | **Resolv USR exploit contagion** |
| **2026-04-19/20** | **-17.5%** | **Kelp DAO bridge exploit / rsETH market freeze** |

The two 2026 events are the largest single-day drawdowns in the protocol's history. Both were driven by external counterparty/collateral-asset events, not by a bug in Fluid's contracts.

### Incidents (since Feb 2026)

#### 1. Resolv USR Depeg / Bad Debt Event — March 22, 2026

**Upstream cause:** Resolv Labs' minting infrastructure was exploited via a compromised AWS KMS-hosted private key (the `SERVICE_ROLE` signer). The attacker minted ~80M unbacked USR for ~$200K of USDC collateral, extracted ~$25M, and the USR stablecoin depegged from $1.00 to as low as $0.0025 on Curve before partially recovering to ~$0.85.

**Impact on Fluid:**

- **Concentration risk materialized:** wstUSR was the largest single supply asset on Fluid (18.9% of all-chain lending TVL per the Feb 2026 assessment), and ~98% of wstUSR supply was reportedly deployed in Fluid leverage loops at up to 6x leverage.
- **Bad debt:** Estimated $10–17.5M of bad debt accrued in Fluid lending markets when wstUSR-collateralized borrower positions became insolvent (the wrapping ratio of wstUSR meant that positions were deeply underwater even if USR repegged).
- **Outflows:** ~$300M of net outflows in a single day (the largest in protocol history). Total Fluid TVL: $1.25B (Mar 22) → $873M (Mar 23) = **-30.3%** in 24 hours.
- **Operational response (~30 minutes):** Admin team paused new borrowings and froze new deposits on affected vaults, then began analyzing existing positions. Per Fluid's official statement, *all other markets continued operating normally*.
- **Bad debt coverage:** Per Fluid's official communication, **100% of bad debt was covered via a short-term loan coverage agreement** funded by personal commitments from Lom Lomashuk (Cyber Fund), a contributor known as "weremeow," and the Fluid core team itself. Resolv Labs additionally executed USR redemptions for whitelisted (pre-incident) wallets covering >90% of the affected user group, and committed to a permanent burn of 46M USR (9M immediate + 36M frozen via blacklist) to reduce ongoing depeg pressure.
- **Repayment status:** Fluid reported that ~$70M of USR-related debt was fully repaid by **March 25, 2026**, three days after the incident. All lending markets remained operational. On **July 21, 2026**, [IGP-136](https://etherscan.io/tx/0xd15d1125436002e51ac376212227f07b971156e64d0eac2c4bc8e56a8c824c6a) collected Liquidity Layer revenue (USDC, USDT, ETH, GHO, weETH) into the Reserve and forwarded it to the Team Multisig to clear the remaining Resolv-related debt, per the proposal text. The coverage loans were thus partly repaid from protocol revenue.
- **fToken impact:** **No direct loss to fToken holders** on Ethereum — onchain exchange rates continued to increase monotonically through and after the event (verified). fToken holders are reported as "not affected" per the official statement.

**Sources:**
- [Halborn — Explained: The Resolv Hack (March 2026)](https://www.halborn.com/blog/post/explained-the-resolv-hack-march-2026)
- [Sentora Research — The Resolv Hack: $25M From a Single Compromised Key](https://sentora.com/research/articles/the-resolv-hack-25m-from-a-single-compromised-key)
- [WEEX News — Fluid: 100% of bad debts are covered by the short-term loan coverage agreement](https://www.weex.com/news/detail/fluid-100-of-bad-debts-are-covered-by-the-short-term-loan-coverage-agreement-and-user-funds-are-not-affected-399991)
- [Phemex News — Fluid Begins $70M Repayments After Resolv Incident](https://phemex.com/news/article/fluid-commences-70m-repayments-following-resolv-incident-68934)
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

Per-chain supply is from DeFiLlama (September 29 2026). Utilization is recomputed onchain on Sep 29 from [`FluidLiquidityResolver`](https://etherscan.io/address/0xca13A15de31235A37134B4717021C35A3CF25C60) `getOverallTokenData` for every listed token, priced with DeFiLlama coin prices. It covers all Liquidity Layer supply and borrow, including DEX and vault positions. The resulting borrow totals match DeFiLlama's borrowed figures within 0.3% on Ethereum and exactly on Arbitrum and Base. Plasma is carried forward from May 6 because no Plasma RPC is configured.

| Chain | Supply | USD-Weighted Util | Highest Borrowed-Token Util (borrow >$0.2M) |
|-------|--------|-------------------|------------------------------|
| Ethereum | $505.1M | ~53.9% | GHO 91.2%, ETH 85.4%, USDC 84.7%, USDT 79.8% |
| Arbitrum | $153.0M | ~46.1% | GHO 87.1%, USDC 81.4%, USDT0 79.8% |
| Plasma | $46.6M | ~44.3% (May 6) | USDT0 90.9%, USDe 58.5% (May 6) |
| Base | $28.4M | ~42.2% | USDC 77.0%, GHO 75.6% |
| Polygon | $4.4M | ~28.7% | USDT0 88.5%, USDC 83.9% |

Combined lending TVL is **$737.5M** (September 29), −15.5% from the $872.5M May 23 peak and +16.7% from the $631.9M July 6 low.

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

**Safety mechanisms in fToken contracts:**
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
- **Blue-chip:** ETH, WETH, wstETH, weETH, rsETH, WBTC, cbBTC
- **Stablecoins:** USDC, USDT, USDT0, sUSDe, GHO
- **Yield-bearing / higher-risk (the concentration drivers):** **sUSDai / USDai** (27.8% — USD.AI synthetic dollar, Arbitrum-native and bridged), **PST** (7.1% — Huma PayFi RWA, bridged from Solana via CCIP), **reUSD** (5.4% — Re Protocol, Medium Risk 3.45), plus smaller positions such as sUSDe, and previously wstUSR (substantially de-risked post-Mar 2026). The sUSDS borrow markets were paused on Jul 11 2026.

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

### Interest Rate Model

Decoded from `FluidLiquidityResolver.getTokenRateData(token)` for each token (`(uint256 version, RateDataV1Params v1, RateDataV2Params v2)`). Compared against the May 6 and Feb 2026 snapshots in prior reports. All curves unchanged since May 24.

**Stablecoins and ETH — current curves:**

| Token | Version | Kink 1 | Rate@K1 | Kink 2 | Rate@K2 | Max Rate |
|-------|---------|--------|---------|--------|---------|----------|
| USDC | V2 | 85% | **5.40%** | 93% | **7.50%** | 40.00% |
| USDT | V2 | 85% | **5.40%** | 93% | **7.50%** | 40.00% |
| GHO  | V2 | 85% | **6.50%** | 93% | **9.50%** | 40.00% |
| ETH (native) | V2 | 88% | **2.50%** | 93% | **4.00%** | **10.00%** |

**Rate-update events on the Liquidity Layer since May 24, 2026:** the only `LogUpdateRateDataV2s` events were new-token listings: PST on May 18, [USDat](https://etherscan.io/address/0x23238f20b894f29041f48D88eE91131C395Aaa71) on Aug 6 ([tx `0x3ab0…4e7d`](https://etherscan.io/tx/0x3ab0b104d1239c52cc3a20d881a716389d00198517e5028e717b9f82e6db7e4d)), and [trUSD](https://etherscan.io/address/0xd0580192E98eA6CEB9c7b6191Ed2E27560911697) on Aug 18 ([tx `0x5c10…8305`](https://etherscan.io/tx/0x5c1019890142269f99841d5e4be7e22427b6b1a33fe7f79545cb10be7fcf8305)). Both new listings use a 50%/80% kink curve with a 100% max rate. USDC/USDT/GHO/ETH curves unchanged since May 6.

**Post-Feb USDC/USDT rate history (verified that no new events since the April 23 2026 update — rechecked at block `26079998`):**

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

### Lending TVL by Asset Type (Ethereum)

Source: [DeFiLlama `fluid-lending`](https://defillama.com/protocol/fluid-lending) Ethereum `tokensInUsd` (Sep 29, 2026): $505.1M of supply routed through the Liquidity Layer. This includes Vault-collateral deposits, not only fToken supply. Percentages are of that Ethereum total.

| Asset Type | Supply TVL | % |
|------------|-----------|---|
| ETH/LSTs (wstETH, WETH, osETH, weETH, rsETH, …) | ~$202.6M | 40.1% |
| Yield-bearing stablecoin wrappers (sUSDai, reUSD, sUSDe) | ~$116.3M | 23.0% |
| Stablecoins (USDT, USDC, GHO, trUSD, USDe, …) | ~$69.1M | 13.7% |
| BTC tokens (WBTC, cbBTC, eBTC, LBTC) | ~$56.2M | 11.1% |
| Other (PST, FLUID, PAXG, XAUT, …) | ~$61.0M | 12.1% |

Yield-bearing stablecoin wrappers are **~23% of Ethereum supply**, still the second-largest category after ETH/LSTs. sUSDai on Ethereum is **$76.5M (15.1% of Eth supply)**, up from $64.6M on Jul 14. Fluid's Ethereum Liquidity Layer holds 68.55M of the 85.13M Ethereum sUSDai `OToken` supply (~80.5%, onchain at block `26079998`). Ethereum sUSDai is a **bridged representation whose source chain is Arbitrum**, not a native Ethereum ERC-4626 vault; the burn/mint authority on both chains is documented below. PST alone is $52.0M (10.3% of Ethereum supply).

### Top Supply Assets (Cross-Chain)

Source: [DeFiLlama `fluid-lending`](https://defillama.com/protocol/fluid-lending) `tokensInUsd` — cross-chain, total $737.5M (Sep 29, 2026).

| Rank | Token | Supply TVL | % of Total |
|------|-------|-----------|------------|
| 1 | **sUSDai** | **$205.4M** | **27.8%** |
| 2 | **wstETH** | $158.3M | **21.5%** |
| 3 | **PST** | $52.0M | **7.1%** |
| 4 | USDC | $47.2M | 6.4% |
| 5 | WBTC | $42.5M | 5.8% |
| 6 | **reUSD** | $39.7M | **5.4%** |
| 7 | USDT | $35.7M | 4.8% |
| 8 | WETH | $31.7M | 4.3% |
| 9 | USDT0 | $26.2M | 3.6% |
| 10 | cbBTC | $24.6M | 3.3% |
| 11 | osETH | $16.4M | 2.2% |
| 12 | weETH | $14.4M | 2.0% |
| 13 | ETH | $8.5M | 1.2% |

**Top-5 concentration: 68.6%** (69.0% on Jul 14, 70.6% on May 23). **Top single-asset concentration: 27.8%**, below the 30% trigger (31.2% on Jul 14, 30.6% on Jul 6, 28.3% on May 23, 19.9% on Apr 27). sUSDai + reUSD: **33.2%** of cross-chain TVL in yield-bearing stablecoin wrappers (37.3% on Jul 14). Including PST, assets whose value depends on offchain credit or admin-reported NAV make up **40.3%**.

### Top Supply Assets (Ethereum)

Source: [DeFiLlama `fluid-lending`](https://defillama.com/protocol/fluid-lending) Ethereum `tokensInUsd` — total $505.1M (Sep 29, 2026).

| Rank | Token | Supply TVL | % of Total |
|------|-------|-----------|------------|
| 1 | **wstETH** | **$135.4M** | **26.8%** |
| 2 | **sUSDai** | **$76.5M** | **15.1%** |
| 3 | **PST** | $52.0M | **10.3%** |
| 4 | **reUSD** | $38.7M | **7.7%** |
| 5 | USDT | $35.7M | 7.1% |
| 6 | WBTC | $34.2M | 6.8% |
| 7 | WETH | $30.9M | 6.1% |
| 8 | USDC | $26.7M | 5.3% |
| 9 | cbBTC | $19.0M | 3.8% |
| 10 | Other | $56.0M | 11.1% |

**Top-5 concentration: 67.0%.** **Top single-asset concentration: 26.8%** (wstETH). Higher-risk assets **sUSDai + PST + reUSD** combined: **$167.2M (33.1%)** of Ethereum supply.

**Non-blue-chip collateral beyond the wrappers — PST (Ethereum rank 3, $52.0M, 10.3%).** Unlike Fluid's blue-chip collateral (wstETH, WETH, WBTC, cbBTC), **PST** is Huma Finance's "PayFi Strategy Token". It carries three stacked risks that blue-chip assets do not (mint path first verified onchain Jul 22 and re-verified Sep 29, 2026). Fluid's Ethereum Liquidity Layer holds 45.80M of the 179.30M Ethereum PST supply (~25.5%). IGP-136 raised the PST/USDC and PST/USDT T1 vault max borrow limits from $10M to $15.1M.
- **Off-chain RWA credit backing:** PST represents a claim on Huma's **PayFi receivables** (real-world payment-financing / invoice credit), not onchain collateral — its value is not independently verifiable onchain and depends on the performance of off-chain receivables.
- **Chainlink CCIP bridge:** on Ethereum PST is a **`BurnMintERC20`** ([`0x22ae3d9a…d4c7`](https://etherscan.io/address/0x22ae3d9a738471f405169af055d31c687087d4c7)) — mint authority is the CCIP `BurnMintTokenPool` ([`0xBE77…0D3d`](https://etherscan.io/address/0xBE776C85FE1f35BE8341167A6305230075F30D3d)), the only `MINTER_ROLE` holder, with no role grants since May 9 2026. A CCIP compromise could mint unbacked PST on Ethereum. The pool's inbound rate limiter from Solana has a 7.7M PST capacity and refills at ~6,112 PST/s, so a full bucket refills in about 21 minutes.
- **Solana source-chain risk:** the CCIP pool's *only* configured remote chain is **Solana** (`getSupportedChains()` returns solely the Solana selector `124615329519749607`), so PST is effectively bridged from Solana and inherits Solana-side program/custody risk.

PST was listed May 18 2026 with a steep 50%/80% kink and 100% max rate — Fluid's own rate curve treats it as a higher-risk market than the stablecoin/ETH pairs.

### Per-Chain Concentration (Worse Than Cross-Chain Average) — September 29, 2026

| Chain | Total Supply | #1 Asset | #1 Share | #2 Asset | #2 Share |
|-------|--------------|----------|----------|----------|----------|
| **Plasma** | $46.6M | **sUSDai** | **66.1%** | USDT0 | 30.3% |
| **Arbitrum** | $153.0M | **sUSDai** | **59.6%** | USDC | 10.9% |
| Base | $28.4M | sUSDai | 24.3% | wstETH | 21.7% |
| Polygon | $4.4M | WBTC | 33.5% | wstETH | 30.4% |
| Ethereum | $505.1M | wstETH | 26.8% | sUSDai | 15.1% |

On Arbitrum and Plasma, sUSDai (issued by **USD.AI**, a synthetic-dollar protocol backed by AI hardware loans) still dominates lending TVL (59.6% / 66.1%, down from 63.9% / 75.3% on Jul 14). A USD.AI-level upstream event would still functionally take down lending on those two chains. sUSDai is now also the largest asset on Base ($6.9M, 24.3%), where Fluid holds 6.18M of the 6.33M Base sUSDai supply (onchain Sep 29). On Ethereum it is $76.5M (15.1%).

**Issuer risk profile (USD.AI):** USD.AI (usd.ai) describes itself as "a yield-bearing synthetic dollar backed by loans against AI hardware, compute, and DePIN assets" targeting 15–25% APR, with peg maintenance relying on arbitrage rather than over-collateralization or RWA backing. Per [CoinGecko](https://www.coingecko.com/en/coins/susdai) on Sep 29, sUSDai has a ~$487M market cap (~436.6M circulating), trades at ~$1.12, and had ~$10.9M of 24h volume (~2.2% of market cap). The July snapshot showed ~$681K (~0.2%); a single-day volume figure is noisy. Fluid's Liquidity Layers hold ~184M sUSDai shares: 68.55M on Ethereum, 81.70M on Arbitrum, and 6.18M on Base (onchain), plus ~27.6M on Plasma (derived from DeFiLlama's $30.8M). That is **~42% of circulating supply**, down from roughly two-thirds in July. Fluid is still the largest single holder and venue, so a large exit would still face material price impact. On-chain price history: ATL $0.796 on Sep 26 2025 (−20% from par), confirming sUSDai is not a stable-value instrument.

**sUSDai cross-chain architecture and LayerZero mint authority (re-verified Sep 29, 2026):** The canonical sUSDai contract is the Arbitrum [`StakedUSDai`](https://arbiscan.io/address/0x0b2b2b2076d95dda7817e785989fe353fe955ef9) (implementation version 1.13, [`0xef07…860d`](https://arbiscan.io/address/0xef07186d90ca00107c4fc73a6fbfcb5ec3d3860d); the Arbitrum proxy was upgraded on Jul 28, Jul 31, and Sep 21 2026 through the same `ProxyAdmin`), an ERC-4626 vault whose `asset()` is Arbitrum USDai [`0x0A1a…82EF`](https://arbiscan.io/address/0x0A1a1A107E45b7Ced86833863f482BC5f4ed82EF). Its bridge `mint`/`burn` functions are gated to an immutable bridge-adapter address. `BRIDGE_ADMIN_ROLE` was revoked on Apr 29 2026 when the check moved into the implementation. The same address on Ethereum, [`0x0b2b…955ef9`](https://etherscan.io/address/0x0b2b2b2076d95dda7817e785989fe353fe955ef9), is an upgradeable `OToken` with no `asset()` / `convertToAssets()` path. The 48h USD.AI timelock upgraded it on Sep 21 2026 ([tx `0x6398…0d41`](https://etherscan.io/tx/0x639875db790f62f1dad1f53ad755c0595817b8650b4eea0150b7d4dc54b50d41)) to implementation [`0x192a…01fe`](https://etherscan.io/address/0x192aff9d44d35c8c5ac08a7d1d4cedc8305801fe) (`OToken` v1.1). In v1.1, `mint`/`burn` are restricted to the immutable `OAdapter`, and a `PAUSE_ADMIN_ROLE` can halt both. No account had been granted that role on Ethereum at the snapshot; on Arbitrum it is held by a 2-of-3 Safe, [`0x3a32…b872`](https://arbiscan.io/address/0x3a32e198cafeb0fcd061ac0c9d8a2256bccab872).

The same-address `OAdapter` [`0xffB2…7f24`](https://arbiscan.io/address/0xffB20098FD7B8E84762eea4609F299D101427f24) burns on send and mints on receive on both chains, so its authenticated receive path can mint canonical Arbitrum sUSDai. The Arbitrum adapter has five inbound peers, and each can trigger that mint:

| Source | Peer set | DVNs required | Confirmations | Hourly limit |
|--------|----------|---------------|---------------|--------------|
| Ethereum | May 27 2025 | 3-of-3 (LayerZero Labs, Nethermind, Canary) | 15 | 10M |
| Plasma | Sep 19 2025 | same 3-of-3 | 20 | 10M |
| Base | Nov 18 2025 | same 3-of-3 | 10 | 10M |
| **Solana** | **Aug 14 2026** ([tx `0x116d…902b`](https://arbiscan.io/tx/0x116dcaf1cbcd9bf06674c937762a5a8fc7e7df09c38aaa16725796cbd38a902b)) | same 3-of-3 | 32 | 10M |
| **Arc** | **Sep 10 2026** ([tx `0xcd1e…f98bc`](https://arbiscan.io/tx/0xcd1e3e5b2b55e5090c9f0c0bb149fb50966f0068e0c86823cd7dcd2902bf98bc)) | same 3-of-3 | 10 | 10M |

The Ethereum-side receive route from Arbitrum is a separate 3-of-3 DVN set with 20 confirmations. Both adapters are owned by the same-address 3-of-3 Safe [`0x5F0B…841F`](https://arbiscan.io/address/0x5F0BC72FB5952b2f3F2E11404398eD507B25841F), which has identical owners on both chains; see the [Bridges page](https://curation.yearn.fi/bridges/). Upgrades on both chains go through `ProxyAdmin` [`0x0b32…8d9F`](https://etherscan.io/address/0x0b3296b6f50611B28d466a6D5A49754dAd4D8d9F), owned by the [48-hour TimelockController](https://etherscan.io/address/0x0EEA1EE08611fF4A4E83BFe3916712751995639b). The 10M sUSDai/hour limiters apply to outbound debit and do not cap `_credit` on a forged inbound message. A verifier-path or adapter-owner compromise could dilute canonical supply and impair Fluid's cross-chain exposure independently of Fluid's own vault oracles. Each new peer adds another source chain whose compromise could reach that path. The uniform 3-of-3 DVN quorum and 3-of-3 owner Safe are meaningful mitigants, but they do not remove the canonical-supply bridge dependency.

**sUSDai vault oracles (Ethereum, Arbitrum, Base; verified Sep 29, 2026):** [IGP-136](https://etherscan.io/tx/0xd15d1125436002e51ac376212227f07b971156e64d0eac2c4bc8e56a8c824c6a) (Jul 21) moved all eight Ethereum sUSDai vaults (171–173, 175–179) and the sUSDai-USDC / sUSDai-USDT DEX center prices to oracles built on [`FluidChainlinkCappedRate` `0xC5D2…76a0`](https://etherscan.io/address/0xC5D27C5d356479b681328351F1583c63051E76a0). That contract reads the Chainlink [`SUSDAI / USDAI Exchange Rate`](https://etherscan.io/address/0x0fbE44B96320eBd455fF9cCE0781FA9A83DdeE7a) feed, which returned 1.11525 at the snapshot. The T1 oracles, e.g. `GenericOracle_SUSDAI_USDC` [`0x08E9…Ef4e`](https://etherscan.io/address/0x08E954EfD116563894dec499EFF1Ed34F4B1Ef4e), have one hop: that capped rate divided by `1e12` for decimals. **USDai is therefore priced at exactly 1 USDC/USDT/GHO, with no market price input.** The other chains use the same structure. The Arbitrum sUSDai oracles (e.g. [`0x603E…5042`](https://arbiscan.io/address/0x603E507193873aD47bbca39099f05a1D34145042)) have one hop, [`FluidERC4626CappedRate` `0x1428…6c2d`](https://arbiscan.io/address/0x14288700dc560a3f26a81ff10ab19c8b75846c2d) ("USDAI per 1 SUSDAI"). The Base oracle [`0xB1f5…1bc4`](https://basescan.org/address/0xB1f51Fd13C554660c19f96750C4b1d8c9BB31bc4) has one hop, [`FluidChainlinkCappedRateL2` `0x6318…5496`](https://basescan.org/address/0x6318a3444df45eea3dcd36df7abac6f24e035496).

Debt and LTV per vault, read from [`VaultResolver.getVaultEntireData`](https://etherscan.io/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC) on each chain on Sep 29 (all 182 Ethereum, 95 Arbitrum, and 50 Base vaults scanned for sUSDai/USDai collateral). LTV is vault-level debt divided by collateral at the oracle price. Smart-debt (T3/T4) debt is DEX borrow shares valued at the oracle-implied share price (~$2.257 on Ethereum, ~$2.152 on Arbitrum). All vaults use CF 88% / LT 90%. Dust vaults are omitted.

| Chain | Vault | Type | Debt | LTV |
|-------|-------|------|------|-----|
| Ethereum | [sUSDai / USDC (171)](https://etherscan.io/address/0x009d7471Fc3BD28fc45495d38978287FdF39416D) | T1 | $21.90M | 84.7% |
| Ethereum | [sUSDai / USDT (172)](https://etherscan.io/address/0x4AFF5C338453D0Ef0165900ca174ccE3e9C46DFf) | T1 | $21.93M | 87.4% |
| Ethereum | [sUSDai / USDC-USDT smart debt (173)](https://etherscan.io/address/0x1d3FADD621946c104d72bc2D01A79acdf9719EBa) | T3 | $15.21M | 86.8% |
| Ethereum | [sUSDai-USDC / USDC-USDT (175)](https://etherscan.io/address/0x26A5F44Aac931f2aBc1C89236a6DfdE3ebeEd997) | T4 | $4.47M | 87.9% |
| Ethereum | [sUSDai-USDT / USDC-USDT (176)](https://etherscan.io/address/0xc16f5c0996B80a4Ae4F75652bBE684b6F6b808eB) | T4 | $2.12M | 87.9% |
| Ethereum | [sUSDai-USDT / USDT (177)](https://etherscan.io/address/0x0FAA99E9662d5b6000f525b830CA2d054cDB8339) | T2 | $20.41M | 85.4% |
| Ethereum | [sUSDai-USDC / USDC (178)](https://etherscan.io/address/0x7e1874Cdc9195163c23A1bb38B83E136B0b1D8E5) | T2 | $18.66M | 87.8% |
| Ethereum | [sUSDai / GHO (179)](https://etherscan.io/address/0xe6214008ab48E27c7289C7A8A9844Ca49314D05C) | T1 | $1.34M | 85.9% |
| Arbitrum | [sUSDai / USDC (65)](https://arbiscan.io/address/0x1B4EC865915872AEc7A30423fdA2584C9fa894C5) | T1 | $33.49M | 82.5% |
| Arbitrum | [sUSDai / USDT0 (66)](https://arbiscan.io/address/0xB98EeA7132f1De6EC24D4Ee4AfBDf4d63Ef1a9F0) | T1 | $25.73M | 76.1% |
| Arbitrum | [sUSDai-USDC / USDC (67)](https://arbiscan.io/address/0x8FB5c0896C70B0056A09249EcEF7E7Ee01f037AF) | T2 | $15.61M | 87.9% |
| Arbitrum | [sUSDai / USDC-USDT0 smart debt (68)](https://arbiscan.io/address/0x75580D4be33C61700969583fDAeC566Ca84e5B69) | T3 | $10.52M | 83.9% |
| Arbitrum | [sUSDai-USDT0 / USDT0 (69)](https://arbiscan.io/address/0x2f6c2A725EA6c4304cdC92B49F637a7735362EF5) | T2 | $15.49M | 87.5% |
| Base | [sUSDai / USDC (47)](https://basescan.org/address/0x01F0D07fdE184614216e76782c6b7dF663F5375e) | T1 | $4.83M | 87.1% |
| Base | [sUSDai-USDC / USDC (48)](https://basescan.org/address/0x59fa2F51F5c8fFfceB538180EC47A869eC3DBd4a) | T2 | $2.56M | 86.8% |

**Total: ~$106.1M on Ethereum, ~$100.9M on Arbitrum, ~$7.4M on Base, ~$214.3M overall** of stablecoin debt secured by sUSDai at a fixed USDai = $1. On the maxed T2/T4 vaults (~88% LTV), a USDai depeg of only ~2–3% already puts real LTV above the 90% liquidation threshold without triggering liquidation. A depeg past ~12% leaves those vaults' debt larger than their collateral value; the threshold is ~18% for the lowest-LTV large vault, Arbitrum 65. USDai traded between $0.9989 and $1.0006 over the 75 days to Sep 29 ([CoinGecko](https://www.coingecko.com/en/coins/usdai)); its all-time low was $0.770 (Sep 26 2025). The Plasma sUSDai vaults were not checked because no Plasma RPC is configured (TODO).

External corroboration: per [CoinDesk RWA Yield Infrastructure Trade](https://www.coindesk.com/research/the-rwa-yield-infrastructure-trade) (Mar 2026), **Fluid handled ~100% of on-chain sUSDai trading volume and 68% of reUSD trading volume** at that time, so a redemption-side stress event in sUSDai would also concentrate on Fluid's liquidity venues.

### Concentration Risk Reassessment (September 29, 2026)

sUSDai crossed the 30% trigger (set May 24) on Jul 6 and peaked at 31.2% on Jul 14. At this snapshot it is **27.8% of cross-chain lending TVL**. Its absolute size is slightly higher ($205.4M vs $199.2M); the share fell because wstETH, PST, USDC, and WBTC supply grew faster.

Key facts:
- sUSDai cross-chain share is still **8.9 pp higher** than the wstUSR share that preceded the Mar 2026 incident.
- On Arbitrum and Plasma, sUSDai remains a single point of failure for the chain's lending business (59.6% / 66.1% of chain TVL).
- Two of the top 6 supply assets (sUSDai #1, reUSD #6) are yield-bearing stablecoin wrappers, the same structural amplification pattern as wstUSR/USR. Together they are **33.2% of all-chain TVL**. PST, an offchain-credit RWA, adds another 7.1%.
- Fluid's share of total sUSDai supply fell to ~42%, and reported 24h sUSDai volume rose to ~2.2% of market cap. Fluid is still the largest single sUSDai holder.
- USDai is priced at a fixed 1:1 in every sUSDai vault oracle checked, so a USDai depeg would not reach liquidation pricing on ~$214.3M of debt across Ethereum, Arbitrum, and Base (~29% of lending TVL).

The structural reasoning holds: yield-bearing stablecoin wrappers carry contagion risk because their wrap ratio amplifies losses when the underlying depegs. Share-based concentration improved, but because USDai is fixed at $1 in the sUSDai oracles, a USDai-level event would not be caught by liquidations on any chain checked.

### Historical Liquidity Performance

- August 2024: -16.1% TVL drop, recovered without operational issues
- **March 2026: -30.3% drop, partial market freezes (wstUSR vaults), bad debt event covered, full recovery within days. Standard fToken markets remained functional.**
- **April 2026: -17.5% drop, precautionary rsETH freeze, no operational impact to other markets.**
- **May–Jul 2026: TVL fell 27.6% from peak to low ($872.5M → $631.9M on Jul 6).** The decline was broad-based across all chains and asset types, with no incident and no bad debt. Targeted `LogPauseUser` actions paused a USDai/USDC vault on Jun 14 ([tx `0xbde0…4ebb`](https://etherscan.io/tx/0xbde0f67e5aa597536815fba9c0e3add21d4a19fbea02edf36b12ebaa2b184ebb)) and three sUSDS-borrowing vaults on Jul 11 ([tx `0x16aa…c138`](https://etherscan.io/tx/0x16aa9b50da7ddc833dd19189a4356851732dbcca7db5e3cc15e751636f6bc138)) as market wind-downs. fToken exchange rates kept increasing throughout.
- **Jul–Sep 2026: TVL recovered to $737.5M (Sep 29)** with no incidents, no pauses, and no bad debt.

## Centralization & Control Risks

### Governance

- **Governance Model**: Onchain GovernorBravo governance. FLUID token holders vote on proposals that execute through a timelock. Discussion on [governance forum](https://gov.fluid.io/), onchain voting via [GovernorBravo](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B), and offchain signaling via [Snapshot](https://snapshot.org/#/instadapp-gov.eth).
- **Timelock**: [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) — **1-day (86,400s) delay**. Admin = GovernorBravo.
- **Owner/Admin**: All core contracts (Liquidity Layer proxy admin, LendingFactory, RebalancerProxy) confirmed owned by the **Timelock**.
- **GovernorBravo Parameters**:
  - Quorum: 4,000,000 FLUID (4% of total supply) ✓
  - Proposal threshold: 1,000,000 FLUID (1% of total supply) ✓
  - Voting delay: 7,200 blocks (~1 day) ✓
  - Voting period: 14,400 blocks (~2 days) ✓
  - **Proposals created: 140; proposals executed: 132** (other 8 are terminal non-executed: 3 Canceled, 3 Defeated, 2 Expired; verified by iterating `state()` at block `26079998`)
- **Token distribution change (IGP-137):** 5,000,000 FLUID moved from the Treasury DSA to the Team Multisig on Aug 7 2026. On Aug 14 it was forwarded ([tx `0x2d08…d9ef`](https://etherscan.io/tx/0x2d0864eb17f861ce356fd11edbbbb0a3fce6fcb9b3838a030378cb348c12d9ef)) to a dedicated contract wallet, [`0xcabe…3fd7`](https://etherscan.io/address/0xcabebc7f76d53582a4be7d9972a2b4f531753fd7), for distribution to institutional custodians under the AGI3 partnership. The proposal says these tokens are legally locked until 2030, but that lock is not enforced onchain. At the snapshot the wallet held all 5M FLUID and had not delegated its votes. 5M FLUID exceeds both the 4M quorum and the 1M proposal threshold, so delegation of this block would be a material shift in voting power. The proposal text also says Kinetic Group plans to acquire up to 10% of FLUID supply on the open market.

### Lending-Specific Admin Controls

| Role | Who | What They Can Do to Lending |
|------|-----|---------------------------|
| **Timelock** (governance) | [`0x2386DC45...`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Upgrade Liquidity Layer implementation, change LendingFactory owner, change supply/borrow configs, change rate models |
| **LendingFactory Auths** | Set by Timelock | Update fToken rewards config, change rebalancer address, rescue stuck tokens, set fToken creation code |
| **LendingFactory Deployers** | Set by Timelock | Create new fToken contracts |
| **Rebalancer (fUSDC, fUSDT)** | [`0x264786EF…ce92`](https://etherscan.io/address/0x264786EF916af64a1DB19F513F24a3681734ce92) — `FluidReserveContractProxy`, `owner()=Timelock` | Deposit underlying without minting shares (adds as rewards). Cannot withdraw. (Corrected from Apr 2026 report, which named the inactive `FluidLendingRewardsRateModel` `0x724d…b9b6` in this slot.) |
| **Guardian** (Avocado multisig, 6-of-12) | [`0x4F6F977a...`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Pause Class 0 protocols only. **Cannot move or withdraw Liquidity Layer funds.** Cancel timelock transactions. Used to freeze rsETH markets in Apr 2026 (precautionary). Governance temporarily grants it vault/DEX auth during market launches (e.g. IGP-138, IGP-140) and removes that auth after launch. |

**Key finding:** No admin role can directly access or move user funds deposited via fTokens. The most powerful action is the Timelock upgrading the Liquidity Layer implementation (1-day delay). The Guardian's pause capability was exercised appropriately in both Mar and Apr 2026 events without abuse. The last Liquidity Layer pause was on Jul 11 2026 (sUSDS-borrowing vault wind-down). **No `LogPauseUser`, `LogUnpauseUser`, `LogUpdateAuths`, or `LogUpdateGuardians` events occurred between block `25529610` (Jul 14) and block `26079998` (Sep 29).** The guardian multisig changed from 7-of-14 to 6-of-12 on Sep 9 2026 and had a one-for-one signer replacement on Sep 13. The threshold stays at half the signer set.

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
- **External collateral asset issuers**: As demonstrated by the Resolv (USR/wstUSR) and Kelp (rsETH) events, the protocol's risk surface includes the operational security of every accepted collateral asset issuer. A compromise of an issuer's keys or bridge can produce contagion damage even without any bug in Fluid.

## Operational Risk

- **Team**: Instadapp Labs. Founded by **Sowmay Jain** and **Samyak Jain** — both are publicly known, India-based founders active since 2019. Key GitHub contributors include **thrilok209**, **KABBOUCHI**, and **SamarendraGouda**.
- **Funding**: Well-funded by top-tier VCs: Pantera Capital, Coinbase Ventures, Standard Crypto, additional undisclosed investors.
- **Legal Structure**: Instadapp Labs.
- **Documentation**: Comprehensive technical documentation at [docs.fluid.instadapp.io](https://docs.fluid.instadapp.io/). Full source code on GitHub.
- **Communication**: Active [governance forum](https://gov.fluid.io/), [Discord](https://discord.com/invite/C76CeZc), Twitter [@0xfluid](https://x.com/0xfluid).
- **Incident Response**: Mar 2026 response demonstrated the team can act within ~30 minutes (pause/freeze affected markets) and arrange off-balance-sheet capital coverage of ~$70M within ~3 days. Strong response, but reliance on personal commitments rather than a programmatic mechanism is a structural concern.

## Monitoring

### Contracts to Monitor

| Contract | Address | What to Monitor |
|----------|---------|-------------|
| **fUSDC** | [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) | Second largest fToken (~$131M Sep 29 2026). Exchange rate, deposits/withdrawals |
| **fUSDT** | [`0x5C20B550819128074FD538Edf79791733ccEdd18`](https://etherscan.io/address/0x5C20B550819128074FD538Edf79791733ccEdd18) | Largest fToken (~$133M Sep 29 2026). Exchange rate, deposits/withdrawals |
| **Liquidity Layer** | [`0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) | Holds all fToken deposits. Admin changes, implementation upgrades |
| **Liquidity Layer impl (current)** | [`0xcc331daf69752bece3dc98dbc63eacd5092266a2`](https://etherscan.io/address/0xcc331daf69752bece3dc98dbc63eacd5092266a2) | Implementation contract behind the proxy. Monitor for changes via EIP-1967 implementation slot. |
| **Timelock** | [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Owner of all core contracts — queued/executed transactions |
| **GovernorBravo** | [`0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) | Governance proposals, voting, execution |
| **Avocado Multisig** | [`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Guardian pause/cancel actions; `requiredSigners()` (6) and signer-set changes |
| **AGI3 FLUID allocation wallet** | [`0xcabebc7f76d53582a4be7d9972a2b4f531753fd7`](https://etherscan.io/address/0xcabebc7f76d53582a4be7d9972a2b4f531753fd7) | 5M FLUID; `DelegateChanged` / transfers (would exceed quorum if delegated) |
| **sUSDai capped-rate oracle** | [`0xC5D27C5d356479b681328351F1583c63051E76a0`](https://etherscan.io/address/0xC5D27C5d356479b681328351F1583c63051E76a0) | Source for all Ethereum sUSDai vault oracles; compare against the USDai market price, because the USDai leg is fixed at 1:1 |
| **Arbitrum sUSDai rate source** | [`0x14288700dc560a3f26a81ff10ab19c8b75846c2d`](https://arbiscan.io/address/0x14288700dc560a3f26a81ff10ab19c8b75846c2d) | `FluidERC4626CappedRate` for all Arbitrum sUSDai vault oracles; same USDai = $1 assumption |
| **sUSDai-collateral vaults (all chains)** | See the sUSDai vault oracle table in the Liquidity Risk section | Aggregate debt (~$214.3M at Sep 29: Ethereum ~$106.1M, Arbitrum ~$100.9M, Base ~$7.4M) and vault-level LTV vs the 90% liquidation threshold |

### Key Events to Watch

| Contract | Event | Significance |
|----------|-------|-------------|
| **Timelock** | `QueueTransaction` / `ExecuteTransaction` | Governance actions queued/executed — 1 day warning |
| **LendingFactory** | New fToken creation | New lending market created |
| **Liquidity Layer** | `LogUpdateAuth` | Auth permissions changed — affects who can modify lending configs |
| **Liquidity Layer** | `LogUpdateGuardian` | Guardian address changed |
| **Liquidity Layer** | `LogPauseUser` / `LogUnpauseUser` | Protocol paused/unpaused — directly affects fToken operations. **Now an actively exercised path (Mar/Apr 2026).** |
| **Liquidity Layer** | `LogUpdateUserSupplyConfigs` | Supply limits changed — affects max fToken deposits |
| **Liquidity Layer** | `LogUpdateUserBorrowConfigs` | Borrow limits changed — affects utilization and withdrawal availability |
| **Liquidity Layer** | `LogUpdateRateDataV1` / `LogUpdateRateDataV2` | Interest rate parameters changed — affects fToken yield |
| **EIP-1967 Admin (proxy)** | Storage slot read | Implementation changes on Liquidity Layer / fToken contracts |

### New Monitoring Recommendation: Collateral Asset Issuers

Given the Mar/Apr 2026 contagion events, monitoring of the off-protocol collateral asset issuers (Resolv, Kelp, Ethena, Maple, etc.) is now a first-order concern. A compromise at any major upstream issuer can produce sub-day bad-debt events at Fluid even without any Fluid contract change.

**Top-priority issuer to monitor (September 2026 update): USD.AI (sUSDai / USDai).** sUSDai is **27.8%** of cross-chain Fluid lending TVL ($205.4M; below the 30% trigger but still the largest asset) and 59.6% / 66.1% of Arbitrum/Plasma supply. **sUSDai is issued by USD.AI (usd.ai).** USD.AI is a synthetic-dollar protocol backed by AI hardware loans with peg maintenance via arbitrage, targeting 15–25% APR. Key risk factors: Fluid holds ~42% of circulating sUSDai supply. Price has historically ranged $0.796–$1.19. **USDai peg stability is now directly monitorable risk**, because every sUSDai vault oracle checked prices USDai at a fixed 1:1, with ~$214.3M of debt behind them. Also monitor the canonical sUSDai mint path: new `OAdapter` peers, DVN or confirmation changes, `PAUSE_ADMIN_ROLE` grants, and proxy upgrades on either chain. Any incident touching USD.AI governance, the underlying loan-collateral pool, or USDai redemption mechanics is the single highest-impact external event for Fluid lenders at this snapshot.

**Second-priority: Huma / PST (bridged from Solana).** See below; PST is now the #3 cross-chain asset.

**Third-priority: Re Protocol (reUSD).** reUSD is $39.7M cross-chain (5.4% of cross-chain TVL). On Ethereum, Fluid's Liquidity Layer holds 35.07M of the 250.80M reUSD supply (~14.0%, onchain Sep 29). The standalone risk assessment at [`reports/report/re-reusd.md`](re-reusd.md) scores **3.45/5.0 (Medium Risk)** as of Sep 23, 2026. Key risk factors for Fluid lenders: roughly one-third of NAV is backed offchain (onchain reserve coverage ~66.7% reUSD-only). The share price is written daily by a Chainlink Functions `NAVConsumer`; its admin now sits behind a 48h Timelock. ~94% of onchain reserves are held at three plain EOAs, and ~99.5% of onchain reserves are sUSDe. There is no bug bounty and branch test coverage is 42%. Any incident touching Re's custodial EOAs, the NAVConsumer oracle, the §114 trust counterparties, or Re's governance Safe and Timelock would affect the reUSD position on Fluid.

**Lower priority: Sky/Maker (sUSDS, fsUSDS).** The sUSDS-borrowing vaults were paused on Jul 11 2026, and fsUSDS supply is ~14 sUSDS.

**Huma / PST (bridged from Solana) — detail.** PST (Huma "PayFi Strategy Token") is $52.0M (7.1% of cross-chain TVL, all on Ethereum) and is **not blue-chip**: it is backed by **off-chain PayFi receivables** rather than onchain collateral, and on Ethereum is a **Chainlink CCIP `BurnMintERC20`** ([`0x22ae3d9a…d4c7`](https://etherscan.io/address/0x22ae3d9a738471f405169af055d31c687087d4c7)) bridged solely from **Solana** (pool [`0xBE77…0D3d`](https://etherscan.io/address/0xBE776C85FE1f35BE8341167A6305230075F30D3d) supports only the Solana chain selector). Monitor the CCIP token-pool mint activity and rate limits, Huma's receivables performance and redemption liquidity, and any Solana-side program incident — any of which could impair or unbacked-mint the Ethereum PST that Fluid vaults hold as collateral.

## Risk Summary

### Key Strengths

- **fToken design held under stress**: Monotonically-increasing exchange rates verified at every checkpoint (Feb / Apr 27 / May 11 / May 24 / Jul 6 / Jul 14 / Sep 29, all confirmed onchain); no direct loss to lenders on Ethereum through the May–Jul 2026 TVL drawdown.
- **Rapid incident response**: ~30 minute pause-and-freeze response on Mar 22; ~3 days to fully repay $70M of bad debt. Remaining Resolv-related debt was cleared from protocol revenue (IGP-136, Jul 21 2026).
- **No new incidents since Apr 2026**: The Kelp/rsETH freeze was the last incident-driven freeze. Later pauses (Jun 14, Jul 11) were targeted market wind-downs, and there have been no bad-debt events.
- **Proactive surface reduction**: IGP-138 and IGP-140 capped or deprecated borrowing on legacy collateral (osETH, tBTC, LBTC, ezETH, rsETH, weETHs).
- Battle-tested team with ~6 years of DeFi operational history (Instadapp since 2019).
- 8 security audits from 4 reputable firms covering Lending Protocol and Liquidity Layer.
- Onchain GovernorBravo governance with 1-day Timelock and **140 proposals created / 132 executed** — all core contracts owned by Timelock (re-verified Sep 29 2026).
- Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- Fully programmatic interest rates and exchange rates — no offchain oracle for lending.
- ~2.61 years in production, ~$737.5M lending TVL across 5 chains.

### Key Risks

- **sUSDai concentration is still dominant**: The Feb 2026 wstUSR concentration (18.9%) preceded the Mar 2026 incident. sUSDai rose from 19.9% (Apr 27) to a 31.2% peak (Jul 14), above the 30% trigger, and is **27.8% at Sep 29**. That is still larger than the pre-incident wstUSR exposure and structurally identical. Its absolute size ($205.4M) did not shrink.
- **USDai hard peg in all sUSDai vault oracles checked**: sUSDai vaults on Ethereum, Arbitrum, and Base price USDai at exactly 1:1, so a USDai depeg does not reach liquidation pricing. They carry **~$214.3M of debt** (~29% of lending TVL) at 76–88% vault-level LTV against a 90% liquidation threshold. On the most leveraged vaults, a ~2–3% USDai depeg is enough to put real LTV above that threshold without any liquidation.
- **Ad-hoc bad-debt coverage**: The Mar 2026 recovery relied on **discretionary off-balance-sheet loans from named individuals/entities** (cyberfund/Lomashuk, weremeow, Fluid core team). There is no programmatic, pre-funded insurance fund, first-loss tranche, or contractual coverage obligation. The same coverage pattern is not guaranteed to scale to a larger event.
- **Wrapped-stablecoin contagion amplification**: The wstUSR wrapping ratio meant that even a partial USR repeg would not have made wstUSR-collateralized borrowers solvent. sUSDai and reUSD share this structural property.
- **Growing sUSDai bridge surface**: five source chains (Ethereum, Plasma, Base, Solana, Arc) can now mint canonical Arbitrum sUSDai through the `OAdapter`. Each route requires the same 3-of-3 DVN quorum, and the 10M/hour limiters are outbound-only.
- **Venue concentration for sUSDai**: Fluid holds ~42% of circulating sUSDai and was reported in Mar 2026 as ~100% of on-chain sUSDai trading volume. Under stress, sUSDai redemption flow would concentrate on Fluid's own venues.
- **Undelegated 5M FLUID block**: the IGP-137 allocation wallet holds more FLUID than the 4M quorum. Its lock-up is contractual, not onchain.
- **Shared Liquidity Layer**: fToken deposits are commingled with Vault, DEX, and stETH protocol funds. A vulnerability anywhere in the stack affects fToken holders.
- **Liquidity Layer upgradeability**: Upgradeable proxy controlled by Timelock with only 1-day delay.
- **No formal verification** has been performed.
- **External collateral-issuer dependency surface**: Mar/Apr 2026 demonstrated this is a first-order risk. At 27.8% sUSDai concentration, USD.AI (usd.ai), a novel synthetic-dollar protocol, is the single most important external dependency to monitor. PST (7.1%, offchain PayFi credit bridged from Solana) is now the third-largest cross-chain asset.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. 8 audits by 4 reputable firms. Lending Protocol directly covered.
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable onchain via resolver contracts. fToken exchange rates computed programmatically and verified monotonically increasing through stress events.
- [x] **Total centralization** — PASSED. Onchain GovernorBravo governance with 1-day Timelock. No EOA control. Guardian can only pause.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Unchanged — 8 audits across 4 firms. All 3 criticals and 13 highs from prior audits resolved. No new audits since Feb 2026 (audits page rechecked September 29 2026).
- **History**: ~2.61 years in production, **~$737.5M lending TVL across 5 chains** (September 29 2026 snapshot; May 23 peak was $872.5M, July 6 low was $631.9M).
- **Bounty**: Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- **Material incidents**: Mar 2026 Resolv contagion → $10–17.5M bad debt, lenders made whole; Apr 2026 Kelp/rsETH precautionary freeze, no bad debt. No incidents since.

**Score: 2.0/5 (unchanged)**. Strong audit coverage and bounty are unchanged. History grew to ~2.61 years but is still not "incident-free": one bad-debt event was covered with off-balance-sheet capital, plus one precautionary freeze.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 2.0**
- Full onchain GovernorBravo governance with 140 proposals created / 132 executed (8 terminal non-executed: 3 Canceled, 3 Defeated, 2 Expired)
- 1-day timelock delay; all core contracts owned by Timelock
- No admin role can directly access or withdraw fToken user funds
- Guardian pause used appropriately in Mar/Apr 2026 events; no abuse. Guardian multisig is now 6-of-12 (from 7-of-14), keeping the same 50% ratio.
- The IGP-137 5M FLUID allocation (above quorum) sits undelegated in a single wallet; its lock-up is contractual, not onchain. This is not scored as a change today, but delegation would be a governance trigger.

**Subcategory B: Programmability — 1.5**
- Fully programmatic: interest rates and fToken exchange rates all onchain
- ERC4626 fTokens with algorithmically computed, monotonically increasing exchange rates (re-verified Sep 29 2026 — monotonicity continues through all stress events and the May–Jul TVL drawdown)
- No offchain keepers/oracles for lending
- Bad-debt coverage process is **not programmatic** (relies on discretionary capital commitments) — a structural gap, but does not affect day-to-day operations

**Subcategory C: Dependencies — 4.0**
- Critical dependency on Liquidity Layer
- Indirect dependency on Chainlink via Vault Protocol oracle system
- External collateral-issuer dependency remains a first-order risk (Mar/Apr 2026 events). With sUSDai at 27.8% cross-chain and 59.6% / 66.1% on Arbitrum/Plasma, a single novel issuer (**USD.AI**) is the dominant external dependency. Fluid holds ~42% of circulating sUSDai. USD.AI has no standalone Yearn risk assessment and is newer and less scrutinized than the issuers behind Fluid's blue-chip collateral. sUSDai uses a cross-chain burn/mint `OAdapter` whose authenticated path can mint canonical Arbitrum supply. Five source chains (Ethereum, Plasma, Base, Solana, Arc) now reach that path, each through the same 3-of-3 DVN quorum. The adapter is owned by USD.AI's 3-of-3 Safe, and the 10M/hour limiters are outbound-only.
- **reUSD** ($39.7M, 5.4% cross-chain) has a standalone score of **3.45/5.0 (Medium Risk)** per [`reports/report/re-reusd.md`](re-reusd.md). Its main risks are ~94% of onchain reserves at plain EOAs, ~99.5% sUSDe reserve concentration, a Chainlink-Functions-written share price, and no bug bounty. Fluid holds ~14.0% of reUSD supply.
- **PST** ($52.0M, 7.1%) adds offchain-credit RWA risk bridged via Chainlink CCIP from Solana.

**Score: 2.5/5 (unchanged)** Dependencies stays at 4.0, the rubric's "many or newer protocol dependencies / critical functionality depends on them" row. sUSDai's share fell below 30% and reUSD's standalone score improved to 3.45. Against that, the sUSDai bridge now has two additional canonical-mint source chains, and PST roughly doubled to 7.1%. sUSDai, reUSD, and PST together are ~40% of Fluid's lending TVL.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.25**
- All lending is over-collateralized per-position via Vault Protocol with onchain tick-based liquidations — the *backing* axis is strong.
- **Top supply asset sUSDai is 27.8% of all-chain TVL ($205.4M).** It peaked at 31.2% on Jul 14, the largest single-asset exposure in the protocol's history; wstUSR was 18.9% before the Mar 2026 incident.
- **Collateral quality, not the backing ratio, is the binding constraint.** ~33% of the cross-chain book is in yield-bearing wrappers (sUSDai 27.8% + reUSD 5.4%), plus 7.1% in PST, and their quality maps to the low end of the rubric. The single largest asset, sUSDai, is by the evidence below no better than reUSD, which scores Collateralization 4.5 in its own report.
- **sUSDai issuer is USD.AI**, a synthetic-dollar protocol backed by offchain AI-hardware loans. Fluid holds ~42% of circulating sUSDai (down from ~two-thirds in July). Reported 24h volume was ~$10.9M (~2.2% of market cap) on Sep 29.
- **Concentrated, hard-to-exit collateral undercuts the quality of the lending base.** Fluid is the largest sUSDai holder and venue, so 27.8% of lending supply TVL cannot be sold into external depth quickly without material price impact. This is direct issuer and exit risk for sUSDai suppliers. It becomes cross-asset bad-debt risk where sUSDai is Vault/DEX collateral, the same pathway that turned the March 2026 wstUSR depeg into realized bad debt.
- **Hard-pegged USDai leg on all sUSDai collateral checked (verified onchain Sep 29).** Every sUSDai vault oracle on Ethereum, Arbitrum, and Base prices sUSDai as the sUSDai→USDai exchange rate × a fixed 1.0 for USDai. These vaults carry **~$214.3M of USDC/USDT/USDT0/GHO debt**: Ethereum ~$106.1M, Arbitrum ~$100.9M, Base ~$7.4M. Vault-level LTVs are 76–88% against CF 88% / LT 90%. A ~2–3% USDai depeg puts the most leveraged vaults above the liquidation threshold on real prices, and a ~12% depeg makes them insolvent, with no liquidation trigger in either case. This is a direct mechanical path from a USDai depeg to lender bad debt, sized at ~29% of lending TVL. It is the same failure mode as March 2026, where collateral repriced faster than liquidations could act. Here, liquidations would never start.
- On Arbitrum and Plasma, sUSDai is 59.6% / 66.1% of chain TVL — a USD.AI-level upstream event would functionally take down lending on those two chains.
- Tick-based liquidation mechanism; the Mar 2026 incident showed it cannot prevent bad debt for collateral that experiences extreme intraday repricing.
- Bad-debt coverage is discretionary, not programmatic.
- **Separate USDai T1 oracle finding (verified onchain Jul 22; peg leg re-verified Sep 29).** Three Arbitrum T1 vaults accept **USDai collateral** and borrow USDC / USDT0 / GHO. Their collateral factor is 94% and liquidation threshold 95%; the USDC and USDT0 vaults use Arbitrum [`PegOracleL2` `0xdf79…fc72`](https://arbiscan.io/address/0xdf79ee3ab9ae7631a9b109d7345136274119fc72), while the GHO vault uses a separate oracle with the same USDai peg leg. The Base USDai/USDC T1 vault uses a different deployment, [`0xd03a…81d4`](https://basescan.org/address/0xd03aff8c62c93d179d7933F2e1B9FAfB02bC81d4). The peg leg returns a constant `1e15`; operate and liquidation rates are identical, with no market or Chainlink input. A USDai drop below ~0.94 can therefore leave a maxed position real-underwater without triggering liquidation. Both peg oracles still returned a constant `1e15` on Sep 29. On Sep 29, debt in these USDai T1 vaults was negligible (Arbitrum 37/38/39 ~$370 combined; Base 45 ~$10). Material USDai-collateral debt sits in the USDai-USDC smart-collateral vaults, which use `DexSmartColPegOracle` and so also value USDai at USDC parity. [Arbitrum 41](https://arbiscan.io/address/0x97950bF81f5605d2d0be37f28a33A752D6f16BDF) holds ~$2.83M, [Arbitrum 44](https://arbiscan.io/address/0x528CF7DBBff878e02e48E83De5097F8071af768D) ~$1.01M, and [Ethereum 180](https://etherscan.io/address/0x1449Fa85260fd18Edb742F9e2dfB2f2BaDE65C84) ~$0.61M, for **~$4.4M** in total. All three sit at ~93% LTV against CF 93% / LT 94%.
- **reUSD oracle cross-check (verified onchain Jul 22):** All seven located mainnet vaults using reUSD use it on the collateral side and route through [`FluidREUSDCappedRate` `0x0964…bb6c`](https://etherscan.io/address/0x0964957869b2fdd70f0a120e8d8d7a5a187abb6c), sourced from Re's [`SharePriceCalculator` `0xd1D1…05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8). The collateral-side maximum-downside setting is `1e6` (effectively uncapped) and `avoidForcedLiquidationsCol` is `false`, so a lower reUSD source rate passes through to liquidation pricing rather than being hidden by a peg floor. This avoids the specific USDai hard-peg blind spot, while retaining the upstream admin-NAV, custody, and offchain-backing risks documented in the reUSD report.
- **sUSDai LayerZero mint dependency:** The OAdapter can mint canonical Arbitrum sUSDai as well as the Ethereum `OToken`. Five inbound routes each require all three configured DVNs, and the adapter is owned by a 3-of-3 Safe. The 10M/hour limiters apply only to outbound debit and would not cap `_credit` after a forged inbound message. This dependency therefore applies to the full canonical-linked exposure, not just the $76.5M Ethereum position.
- **Calibration:** 4.25 sits above Maple syrupUSDC (3.0, more diversified/transparent collateral) and below reUSD (4.5) and structurally undercollateralized credit books (3jane/infinifi 4.5). Fluid's per-position over-collateralization and working onchain liquidations are real for most of the book. Since July, sUSDai's share and Fluid's share of sUSDai supply improved, and reported sUSDai volume rose. Against that, this refresh shows that ~$214M of debt (~29% of lending TVL) is secured by collateral whose USDai leg liquidations cannot see. For that slice, "over-collateralized with onchain liquidations" holds only while USDai stays at par. That pushes it toward the rubric's "partially collateralized" column, and PST also grew. The score moves 4.0 → 4.25 rather than 4.5 because USDai has held its peg (0.9989–1.0006 over 75 days) and the rest of the book is liquidated normally.

**Subcategory B: Provability — 2.5**
- fToken exchange rates themselves are computed programmatically (ERC4626) and are monotonically increasing — verified onchain through all stress events and the May 24 → Sep 29 window. In isolation this is fully provable.
- **However, ~40% of lending supply TVL is in assets whose economic value depends on offchain or admin-side inputs that cannot be independently verified onchain**, so the value of those fToken underlyings is not purely onchain-provable:
  - **reUSD** ($39.7M): its share price is written by a Chainlink Functions job (`setSharePrice` on `SharePriceCalculator`, admin behind a 48h Timelock). The price reflects an offchain reinsurance-trust NAV component (~1/3 of NAV) attested by a third party. There is no independent onchain oracle to cross-check it.
  - **sUSDai** ($205.4M): its value derives from USD.AI's offchain AI-hardware loan book, with no onchain proof of the underlying collateral. Fluid's Ethereum vaults additionally assume USDai = $1. The privileged sUSDai `OAdapter` can mint canonical Arbitrum sUSDai and the Ethereum `OToken`, so cross-chain verifier and adapter-owner integrity are part of canonical-supply provability.
  - **PST** ($52.0M): backed by offchain PayFi receivables.
- Because the fToken exchange rate reads healthy right up until a liquidation shortfall is *realized*, forming bad debt against these offchain-marked assets is **not observable onchain in advance** — the same latency that surprised lenders in March 2026.
- Interest rates and all Liquidity-Layer reserves remain onchain-verifiable via FluidLiquidityResolver.

**Score: 3.375/5 (was 3.25)** Collateralization 4.0 → 4.25 for the cross-chain USDai hard peg on ~$214M of sUSDai-backed debt, on top of the underlying-asset quality, exit-depth, realized-loss, and bridge-dependency factors above. Provability stays at 2.5 because ~40% of lending supply TVL depends on offchain or admin-side value inputs (USD.AI loan-book NAV, reUSD `setSharePrice`, PST receivables).

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: fToken withdrawals subject to Liquidity Layer withdrawal limits and available liquidity
- **Stress test results (Mar 22–25, 2026)**: $300M+ net outflows in 24 hours absorbed; standard fToken markets remained operational; affected vaults paused. Kink-based rate model worked as designed.
- **Stress test results (Apr 18–20, 2026)**: ~$180M outflows over 2 days; rsETH markets precautionarily frozen; no other operational impact.
- **Recovery (Apr 27 → May 24)**: lending TVL recovered $751M → $872.5M (+16%); previously paused vaults unpaused on May 12–13 with no observed exit stress.
- **Drawdown (May 24 → Jul 6)**: lending TVL declined $872.5M → $631.9M (−27.6%). Broad-based across all chains. No incidents, no bad debt; the only pauses were targeted market wind-downs. Exchange rates continued to increase monotonically throughout.
- **Recovery (Jul 6 → Sep 29)**: lending TVL recovered to $737.5M; 30-day range $726.1M–$767.3M.
- **Withdrawal limits**: Expandable limits throttle large exits.
- **Shared pool risk**: Liquidity Layer serves lending, vaults, DEX, and stETH
- **Concentration**: sUSDai exposure is $205.4M (27.8% cross-chain, 59.6% / 66.1% on Arbitrum/Plasma, 15.1% on Ethereum). Concentration is mostly captured in Funds Mgmt § A. In this category, a sUSDai stress event would likely produce per-chain withdrawal pressure similar in shape to the Mar 2026 Ethereum event.
- **Secondary market**: No significant DEX liquidity for fTokens themselves.

**Score: 2.5/5 (unchanged)** Fluid's withdrawal mechanism handled the Mar/Apr stress events and the May–Jul drawdown, which prevents a 3-level score. Row 2 assumes a large holder can exit with less than 1% impact over 1–3 days. Fluid's ~42% share of sUSDai supply ($205.4M) is still far larger than the ~$10.9M of reported 24h sUSDai volume, and that volume figure is a single-day snapshot. The improvement from July (two-thirds share, ~$681K volume) is real but not yet enough for row 2. Withdrawing sUSDai from Fluid returns the asset but not an economically viable exit from it, so 2.5 still captures the split between strong protocol withdrawal mechanics and limited underlying-asset market depth.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Publicly known founders (Sowmay Jain, Samyak Jain). Active since 2019. Strong DeFi reputation.
- **Funding**: Well-funded by Pantera Capital, Coinbase Ventures, and others.
- **Docs**: Comprehensive documentation and open-source code.
- **Incident Response**: Mar 2026: ~30 min pause/freeze response, $70M coverage arranged in ~3 days. Strong execution; reliance on personal commitments rather than programmatic backstop remains a structural concern.

**Score: 1.5/5**. Publicly known team, strong reputation, well-funded, comprehensive docs.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.0  | 20% | 0.400 |
| Centralization & Control | 2.5 | 30% | 0.750 |
| Funds Management | 3.375 | 30% | 1.013 |
| Liquidity Risk | 2.5  | 15% | 0.375 |
| Operational Risk | 1.5  | 5% | 0.075 |
| **Subtotal** | | | **2.61** |

**Final Score: 2.61 (was 2.57)** Weighted subtotal 2.6125. The only subcategory change is Collateralization 4.0 → 4.25: every sUSDai vault oracle checked (Ethereum, Arbitrum, Base) fixes USDai at $1, behind ~$214.3M of debt (~29% of lending TVL) at 76–88% vault-level LTV. Several facts improved: sUSDai fell to 27.8%, below the 30% trigger; Fluid's share of sUSDai supply fell to ~42%; reported sUSDai volume rose; reUSD improved to 3.45; and TVL recovered. These kept Dependencies and Liquidity from moving despite the two new sUSDai canonical-mint source chains (Solana, Arc) and PST doubling to 7.1%. The -0.5 TVL modifier is not applied (the protocol had a material Mar-2026 bad-debt incident).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK** (unchanged since July 22, 2026; score 2.57 → 2.61)

---

## Reassessment Triggers

- **Time-based**: Reassess in 2 months (November 2026). This is shorter than the standard 6 months because of the ~$214M sUSDai hard-peg exposure and the growing sUSDai bridge surface.
- **Concentration-based**: The 30% sUSDai trigger fired on Jul 6 2026 (30.6%, peak 31.2% on Jul 14); sUSDai is now 27.8%. Reassess **immediately** if sUSDai exceeds **40%** of cross-chain lending TVL, or if sUSDai + reUSD + PST exceed **50%**.
- **Coverage-mechanism formalization**: Reassess if Fluid implements a programmatic insurance/coverage layer (would lower funds-management subcategory). Conversely, reassess if the protocol experiences a second bad-debt event without comparable third-party coverage.
- **TVL-based**: Reassess if lending TVL changes by more than 50% from the ~$737.5M baseline (September 29 2026), i.e., drops below ~$369M or exceeds ~$1.106B.
- **sUSDai source-chain / bridge controls (highest priority)**: Reassess immediately on any of the following on Arbitrum or Ethereum sUSDai: a mint-role or admin-role change, a `PAUSE_ADMIN_ROLE` grant, an `OAdapter` owner change, a new peer or DVN-route configuration change, a rate-limit change, a proxy implementation upgrade, a cross-chain supply mismatch, or an unexpected canonical Arbitrum mint.
- **USDai depeg / hard-peg debt**: Every sUSDai vault checked (Ethereum 171–173 and 175–179; Arbitrum 65–69; Base 47–48) and every USDai-collateral vault prices USDai at a fixed 1:1. Monitor the USDai market price and the debt in these vaults. Reassess immediately if USDai trades below ~$0.98, if total hard-peg debt exceeds ~$300M (currently ~$218.7M including USDai vaults), or if their oracle configuration changes. A ~2–3% USDai depeg pushes the most leveraged sUSDai vaults (~88% LTV) past their 90% LT without liquidation. Past ~12% they become insolvent.
- **Incident-based**: Reassess after any further exploit, governance change, significant parameter modification, or contagion event from a major collateral issuer (especially **USD.AI** for sUSDai/USDai, Huma for PST, Re for reUSD).
- **Governance**: Reassess if GovernorBravo parameters change (quorum, timelock delay, voting period), if the Avocado guardian threshold or signer set changes, or if the IGP-137 5M FLUID allocation wallet delegates its votes or is distributed to a party that can reach quorum alone.
- **Dependency**: Reassess if Liquidity Layer implementation is upgraded (current impl: [`0xcc331daf69752bece3dc98dbc63eacd5092266a2`](https://etherscan.io/address/0xcc331daf69752bece3dc98dbc63eacd5092266a2)) or if a new protocol is added to the shared liquidity pool.

## Open Observations

- **Proposal #128 (executed May 5 2026) didn't change USDC/USDT kinks** despite the proposal text saying it would; only an ETH `rateAtUtilizationMax` event was emitted. All subsequent proposals (#129–#140) have since executed. No USDC/USDT rate event has been emitted since Apr 23 2026 (rechecked at block `26079998`), so the curves remain at 85%/93% kink with 5.40%/7.50% rates.
- **TODO — Plasma:** the Plasma sUSDai vault oracles and their debt, and Plasma utilization, were not verified because no Plasma RPC is configured. Plasma holds $30.8M of sUSDai supply. Source: `VaultResolver.getVaultEntireData` and the oracle `getOracleHopSources()` at [`0xA5C3…95cC`](https://plasmascan.to/address/0xA5C3E16523eeeDDcC34706b0E6bE88b4c6EA95cC) on Plasma.

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
│   │  proposalCount: 140        │      │  Custom contract (not Safe)  │  │
│   │  132 Executed              │      │  6-of-12 custom guardian     │  │
│   │  voting: 1d delay, 2d vote │      │  - Pause Class-0 protocols   │  │
│   │                            │      │  - Cancel timelock txns      │  │
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
│   fUSDC   0x9Fb7…  ~$131M        │    │  Vault Protocol                │
│   fUSDT   0x5C20…  ~$133M        │    │   - borrowers + collateral     │
│   fGHO    0x6A29…  ~$27M         │◀───│   - tick-based liquidations    │
│   fwstETH 0x2411…  ~732 wstETH   │ yield   - generates fToken yield    │
│   fWETH   0x9055…  ~867 WETH     │    │                                │
│   fUSDtb  0x15e8…  ~$1.9M        │    │  DEX Protocol                  │
│   fsUSDS  0x2BBE…  ~14 sUSDS     │    │  stETH Protocol                │
│                                  │    │                                │
│   All-chain lending TVL: ~$738M  │    │                                │
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
│    Top-10 cross-chain supply (Sep 29 2026, total $737.5M):               │
│      sUSDai   27.8%  (USD.AI — Staked USDai)            ★ (peak 31.2%)   │
│      wstETH   21.5%  (Lido)                                              │
│      PST       7.1%  (Huma PayFi RWA, CCIP from Solana)                  │
│      reUSD     5.4%  (Re Protocol — score 3.45 Medium)  ★                │
│      USDC      6.4%   WBTC  5.8%   USDT  4.8%   WETH  4.3%               │
│      USDT0     3.6%   cbBTC 3.3%                                         │
│    ★ = yield-bearing stablecoin wrapper (same structural pattern as      │
│        wstUSR/USR that produced the Mar 22 2026 bad-debt event)          │
│    sUSDai: issuer USD.AI; Fluid holds ~42% of supply. Per-chain:         │
│        Plasma 66.1%, Arbitrum 59.6%, Base 24.3%, Ethereum 15.1%.         │
│    All sUSDai vault oracles fix USDai = $1 (~$214M debt, 3 chains).      │
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

- **Lender → fToken → Liquidity Layer**: fully programmatic ERC4626 with burn-before-withdraw; exchange rate monotonically increasing (verified through all 2026 events including the May–Jul TVL drawdown).
- **Borrower default → bad debt → fToken yield**: realized in Mar 2026 ($10–17.5M). **No programmatic backstop**; covered via discretionary loans (cyberfund/Lomashuk, weremeow, Fluid core team).
- **Collateral-issuer / bridge compromise → wrap-ratio amplified loss → bad debt**: the structural pattern that produced Mar 2026. **sUSDai is 27.8% cross-chain and 59.6% / 66.1% on Arbitrum/Plasma**, still larger than the wstUSR exposure that preceded the prior incident. **Issuer and source chain: USD.AI on Arbitrum**, a novel synthetic-dollar protocol backed by AI hardware loans. Fluid holds ~42% of circulating sUSDai, and sUSDai has traded as low as $0.796. The LayerZero `OAdapter` has mint/burn authority on the Ethereum `OToken` and canonical Arbitrum sUSDai. Five source chains (Ethereum, Plasma, Base, Solana, Arc) reach the canonical mint path, each through the same 3-of-3 DVN quorum, and the outbound rate limiters do not cap inbound credit. **reUSD (5.4%, $39.7M)** has a standalone score of **3.45/5.0 (Medium Risk)** per [`reports/report/re-reusd.md`](re-reusd.md): offchain backing component, Chainlink-Functions-written share price, EOA reserve custody, no bug bounty. sUSDai + reUSD make up ~33% of TVL, and PST another 7.1%.
- **USDai depeg → no liquidation on sUSDai vaults → bad debt**: every sUSDai vault oracle checked (Ethereum, Arbitrum, Base) fixes USDai at $1, behind ~$214.3M of debt at 76–88% vault-level LTV (90% LT). A ~2–3% USDai depeg pushes the most leveraged vaults past the liquidation threshold on real prices, and past ~12% they become insolvent, with no liquidation trigger in either case.
- **Governance → Timelock (1d) → Liquidity Layer impl**: upgrade path. The Mar 31 2026 upgrade bundled dummy-impl swap + module-dispatcher selectors in one tx ([`0xf484b2a2…`](https://etherscan.io/tx/0xf484b2a265add120c907049c43ca1cfd11b73fce6154c0abe3e15d5ac325d487)). No subsequent upgrades (rechecked Sep 29 2026).
- **Avocado Guardian (6-of-12) → Pause Class-0**: cannot move Liquidity Layer funds; used appropriately in both Mar and Apr 2026 events. The last pause was the Jul 11 2026 sUSDS-vault wind-down, with no pause/unpause events since.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [February 12, 2026](https://github.com/yearn/risk-score/pull/33) | 1.1 | Initial assessment |
| [April 27, 2026](https://github.com/yearn/risk-score/pull/144) | 1.4 | Reassessment: TVL recovery; sUSDai concentration flagged (19.9%) as structurally identical to pre-incident wstUSR |
| [May 24, 2026](https://github.com/yearn/risk-score/pull/215) | 1.4 | Reassessment: sUSDai grew to 28.3%; explicit 30% concentration trigger set; Collateralization 2.5 → 2.75 |
| [July 22, 2026](https://github.com/yearn/risk-score/pull/293) | 2.57 | Reassessment (TVL/on-chain snapshot Jul 14, block `25529610`; sUSDai bridge & oracle layer verified Jul 22): lending TVL $639.0M (−26.8% off May peak, stabilizing); sUSDai above 30% trigger at 31.2%; issuer and Arbitrum source chain identified as USD.AI (Fluid holds ~2/3 of supply, extreme illiquidity); LayerZero burn/mint path verified on canonical Arbitrum and Ethereum, with a 3-of-3 DVN / 15-confirmation canonical mint route, 3-of-3 Safe owner, and a 10M/hour outbound-only rate limiter that does not cap inbound mint; separate USDai T1 hard-peg oracle finding scoped to its own currently tiny debt; reUSD cross-referenced to its 3.51 Elevated-Risk report; ~37% of lending supply TVL depends on offchain/admin-side value inputs. Collateralization 2.75 → 4.0, Provability 1.0 → 2.5, Dependencies 2.5 → 4.0, Liquidity 2.0 → 2.5; Minimal → Medium Risk |
| [September 29, 2026](https://github.com/yearn/risk-score/pull/497) | 2.61 | Reassessment (Ethereum block `26079998`, Sep 29): lending TVL $737.5M (+15.4%); sUSDai 27.8% (below the 30% trigger; Fluid holds ~42% of supply, down from ~2/3); every sUSDai vault oracle checked (Ethereum, Arbitrum, Base) fixes USDai at $1 behind ~$214.3M of debt; sUSDai `OToken` v1.1 upgrade and new Solana/Arc canonical-mint peers (same 3-of-3 DVNs); guardian 7-of-14 → 6-of-12; 5M FLUID AGI3 allocation undelegated; reUSD cross-reference 3.51 → 3.45; PST 7.1%. Collateralization 4.0 → 4.25 |
