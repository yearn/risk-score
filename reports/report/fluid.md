# Protocol Risk Assessment: Fluid Lending Protocol

- **Assessment Date:** February 12, 2026 (Updated: July 22, 2026; prior reassessments Apr 27, May 24, Jul 6, 2026)
- **Token:** fTokens (fUSDC, fUSDT, fWETH, etc.)
- **Chain:** Ethereum Mainnet
- **Token Address:** [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) (fUSDC)
- **Final Score: 2.6/5.0** (up from 1.4; weighted subtotal 1.94 → 2.575 as sUSDai crossed the 30% trigger, the issuer and Arbitrum source chain were identified as USD.AI, the LayerZero burn/mint path—including canonical Arbitrum mint authority—was verified, the existing reUSD risk assessment [score 3.51, Elevated Risk] was cross-referenced, and ~37% of lending supply TVL was found to sit in wrappers with offchain/admin-side value inputs; -0.5 TVL modifier removed — protocol had a material bad-debt incident in Mar 2026)

## Reassessment Summary (July 2026)

Onchain refresh at block `25529610` (July 14, 2026); the sUSDai cross-chain bridge and vault-oracle layer were separately verified on July 22, 2026 (all figures onchain-confirmed — canonical mint path, DVN quorum, rate limiter, and USDai T1 vault debt). Governance, proxy implementations, and rate models are all unchanged since May 24. The material changes are the sustained TVL decline off the May peak (now stabilizing) and sUSDai concentration holding above the 30% trigger. **sUSDai is issued by USD.AI (usd.ai)**, a synthetic-dollar protocol backed by AI hardware loans. This surfaces additional risk factors including Fluid holding roughly two-thirds of total sUSDai supply and extreme on-chain illiquidity.

**Material change #1 — sUSDai concentration above the 30% trigger:** Top supply asset sUSDai is **31.2%** of cross-chain lending TVL ($199.2M), up from 30.6% on Jul 6 and 28.3% on May 23 — the explicit reassessment trigger set in May 2026 has fired and the share is still rising. Per-chain it is **63.9% of Arbitrum and 75.3% of Plasma supply** (down from May peaks of 75.3% / 80.4% as diverse TVL exited those chains faster than sUSDai did, though the cross-chain share keeps climbing). Same yield-bearing-stable-wrapper pattern as the wstUSR exposure that produced the Mar 2026 bad-debt event. **Issuer and source chain: USD.AI on Arbitrum.** **Additional concentration risks:** Fluid holds ~$199M of sUSDai — roughly two-thirds of its ~$300M supply — and sUSDai 24h on-chain volume is only ~$681K (~0.2% of market cap), making exit nearly impossible without severe slippage. sUSDai has historically traded between $0.796 and $1.19, confirming it is not a stable-value token. The same-address LayerZero `OAdapter` burns/mints on both Ethereum and Arbitrum; critically, its authenticated receive path can mint the canonical Arbitrum ERC-4626 token, not only the Ethereum `OToken` representation. Funds Mgmt § A (Collateralization) moves 2.75 → 4.0 and § B (Provability) 1.0 → 2.5; Category 2 § C (Dependencies) moves 2.5 → 4.0; Liquidity moves 2.0 → 2.5; weighted subtotal 1.94 → 2.575. The -0.5 TVL modifier is removed (protocol had a material incident): final score **2.6** (up from 1.4; moves from Minimal Risk to Medium Risk tier).

**Material change #2 — TVL fell 26.8% off the May peak, now stabilizing:** Lending TVL dropped from $872.5M (May 23) to $631.9M (Jul 6) and has since flattened at **$639.0M** (Jul 14, DeFiLlama). Overall Fluid TVL $771.2M (down from ~$1.00B in May). The May–June decline was broad-based across chains and asset types; the Jul 6→14 window shows mild stabilization (fUSDT, fGHO, and fWETH supplies grew back while fUSDC/fUSDtb slipped). Exchange rates remain monotonically increasing (verified onchain at block `25529610`), confirming no principal loss to fToken holders on Ethereum. The decline may reflect the broader market drawdown in May–Jun 2026 and/or sUSDai rotation. Under the 50% TVL trigger — not firing.

**Everything else healthy at refresh:**

- **fTokens:** Exchange rates still monotonically increasing across every checkpoint (Feb → Apr → May → Jul 6 → Jul 14, verified onchain); supplies mixed over the Jul 6→14 window (fUSDT +5.3%, fGHO +8.8%, fWETH +3.3%, fwstETH +0.5% recovered; fUSDC −6.7%, fUSDtb −10.1% slipped; fsUSDS flat). Net lending supply up slightly. Since May 24 the trend is still down (fUSDC 203.6M → 134.4M USDC, fwstETH 1,828 → 360 wstETH, fWETH 3,335 → 1,600 WETH).
- **Governance:** GovernorBravo proposalCount 131 → 135. Of all 135 proposals, **127 are Executed**; the remaining 8 are terminal non-executed states (3 Canceled, 3 Defeated, 2 Expired) — verified onchain by iterating `state()` at block `25529610`. All quorum/threshold/delay/period params unchanged.
- **Admin/guardian:** Timelock delay 1 day, all core contracts still Timelock-owned. Avocado 7-of-14 unchanged. No `LogUpdateAuth`, `LogUpdateGuardian`, `LogPauseUser`, or `LogUnpauseUser` events since May 24.
- **Liquidity Layer impl:** `0xcc33…66a2` since Mar 31 2026, unchanged. No proxy implementation upgrades since May.
- **Rate model:** USDC/USDT/GHO/ETH curves unchanged. No `LogUpdateRateDataV2s` events since the May 18 PST listing.
- **Audits:** No new audits published since the May 24 report.

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

| fToken | Total Assets (Jul 14 2026) | Total Assets (Jul 6 2026) |
|--------|---------------------------|---------------------------|
| fUSDC | 134.4M USDC | 144.0M USDC |
| fUSDT | 130.5M USDT | 123.9M USDT |
| fGHO | 15.45M GHO | 14.2M GHO |
| fwstETH | 359.8 wstETH | 358.0 wstETH |
| fWETH | 1,599.5 WETH | 1,548.7 WETH |
| fUSDtb | 2.22M USDtb | 2.47M USDtb |
| fsUSDS | 5,015 sUSDS | 5,015 sUSDS |

Every fToken exchange rate is monotonically increasing (ERC-4626) and has never decreased at any checkpoint — the key safety property confirming fToken holders have not lost principal value on Ethereum.

Over the Jul 6→Jul 14 window supply stabilized: fGHO (+8.8%), fUSDT (+5.3%), fWETH (+3.3%), and fwstETH (+0.5%) recovered, while fUSDC (−6.7%) and fUSDtb (−10.1%) slipped and fsUSDS was flat. Net lending supply rose slightly ($631.9M → $639.0M). The larger May 24 → Jul 14 contraction remains broad-based (fUSDC −34%, fwstETH −80%, fWETH −52%). No fToken exchange rate has decreased at any checkpoint — holders who remained earned yield through the drawdown.

### Core Infrastructure

All core contracts are owned/administered by the Timelock (1-day delay, GovernorBravo admin).

| Contract | Address | Role / Key Facts |
|----------|---------|------------------|
| Liquidity Layer (proxy) | [`0x52Aa…F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) | Holds all funds. Upgradeable Instadapp Infinite Proxy; admin = Timelock; current impl `0xcc331…266a2` (since Mar 31 2026). |
| LendingFactory | [`0x54B9…51D03`](https://etherscan.io/address/0x54B91A0D94cb471F37f949c60F7Fa7935b551D03) | Deploys fTokens; owner = Timelock. |
| Timelock | [`0x2386…1F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | 1-day (86,400s) delay; admin = GovernorBravo. |
| GovernorBravo | [`0x0204…5fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) | 135 proposals, 127 executed (8 terminal non-executed: 3 Canceled, 3 Defeated, 2 Expired). Quorum 4M / threshold 1M FLUID; 1-day voting delay, 2-day voting period. |
| Avocado Guardian | [`0x4F6F…D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | 7-of-14 custom multisig; can pause Class-0 protocols and cancel timelock txns; **cannot move funds**. |
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

- **Production History**: Fluid launched on Ethereum mainnet on **February 20, 2024**. As of July 14, 2026, the protocol has been in production for **~2.40 years (~876 days)**.
- **Total Fluid TVL** (DeFiLlama "fluid" — all products, all chains, supply-side only): **~$771.2M** as of July 14 2026 (July 6 snapshot: ~$757.6M; May 23: ~$999.6M; Apr 27: $911.5M; Feb 2026: $1.45B; peak $2.68B on Oct 9, 2025).
- **Lending-only TVL** (DeFiLlama "fluid-lending" — all chains): **~$639.0M** as of July 14 2026 (July 6 snapshot: $631.9M; May 23: $872.5M; Apr 27: $750.8M; Feb 2026: $1.28B; peak $2.37B on Oct 9, 2025). Per-chain (July 14): Ethereum $426.1M, Arbitrum $111.2M, Plasma $79.9M, Base $18.5M, Polygon $3.4M.
- **Recent TVL trend (DeFiLlama, lending-only daily series):** The May 23 peak of $872.5M was followed by a sustained decline through June to $631.9M on July 6, then stabilized at $639.0M by July 14. The May–June decline was broad-based across all chains and asset types; the most recent week is flat-to-slightly-up.

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

Per-chain supply is current (July 14 2026, DeFiLlama); utilization is carried forward from the May 6 LiquidityResolver refresh.

| Chain | Supply | USD-Weighted Util | Highest Borrowed-Token Util |
|-------|--------|-------------------|------------------------------|
| Ethereum | $426.1M | ~52.5% | GHO 86.7%, ETH 84.9%, USDT 77.6% |
| Arbitrum | $111.2M | ~45.2% | USDC 90.3%, USDT0 88.6%, GHO 86.3% |
| Plasma | $79.9M | ~44.3% | USDT0 90.9%, USDe 58.5% |
| Base | $18.5M | ~40.4% | USDC 86.5%, GHO 84.0% |
| Polygon | $3.4M | ~31.7% | USDT0 92.1%, USDC 87.3% |

Combined lending TVL fell from the $872.5M May 23 peak to $631.9M (July 6), then stabilized at **$639.0M** (July 14, −26.8% from peak). The May–June decline was broad-based across all chains.

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
- **Yield-bearing / higher-risk (the concentration drivers):** **sUSDai / USDai** (31.2% — USD.AI synthetic dollar, Arbitrum-native and bridged), **reUSD** (6.1% — Re Protocol, Elevated Risk), **PST** (4.2% — Huma PayFi RWA, bridged from Solana via CCIP), plus syrupUSDC, sUSDS, and previously wstUSR (substantially de-risked post-Mar 2026)

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

| Token | Version | Kink 1 | Rate@K1 | Kink 2 | Rate@K2 | Max Rate | Δ vs May 6 |
|-------|---------|--------|---------|--------|---------|----------|------------|
| USDC | V2 | 85% | **5.40%** | 93% | **7.50%** | 40.00% | unchanged |
| USDT | V2 | 85% | **5.40%** | 93% | **7.50%** | 40.00% | unchanged |
| GHO  | V2 | 85% | **6.50%** | 93% | **9.50%** | 40.00% | unchanged |
| ETH (native) | V2 | 88% | **2.50%** | 93% | **4.00%** | **10.00%** | unchanged (post-prop-128 state) |

**Rate-update events on the Liquidity Layer since May 24, 2026:** no new `LogUpdateRateDataV2s` events. The last rate event remains the May 18 listing of PST (`0x22ae3d9a…`). USDC/USDT/GHO/ETH curves unchanged since May 6.

**Post-Feb USDC/USDT rate history (verified that no new events since the April 23 2026 update — rechecked at block `25529610`):**

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

Source: DeFiLlama `fluid-lending` Ethereum `tokensInUsd` — total $426.1M of supply collateral routed through the Liquidity Layer (includes Vault-collateral deposits, not only fToken supply). Percentages are of that Ethereum supply total.

| Asset Type | Supply TVL | % |
|------------|-----------|---|
| ETH/LSTs (wstETH, weETH, WETH, osETH, rsETH, …) | ~$191.8M | 45.0% |
| Yield-bearing stablecoin wrappers (sUSDai, reUSD, sUSDe, …) | ~$106.6M | 25.0% |
| Stablecoins (USDT, USDC, USDe, GHO, …) | ~$55.7M | 13.1% |
| BTC tokens (WBTC, cbBTC, …) | ~$36.7M | 8.6% |
| Other (PST, PAXG, XAUT, …) | ~$35.3M | 8.3% |

Yield-bearing stablecoin wrappers are **~25% of Ethereum supply**, now the second-largest category behind ETH/LSTs and larger than plain stablecoins. sUSDai is present on Ethereum at **$64.6M (15.2% of Eth supply)**, up from ~$52M on Jul 6 and near-zero in May — its expansion onto Ethereum adds to the cross-chain concentration concern. This is a **bridged representation whose source chain is Arbitrum**, not a native Ethereum ERC-4626 vault; the cross-chain burn/mint authority on both chains is documented below.

### Top Supply Assets (Cross-Chain)

Source: DeFiLlama `fluid-lending` `tokensInUsd` — cross-chain, total $639.0M.

| Rank | Token | Supply TVL | % of Total |
|------|-------|-----------|------------|
| 1 | **sUSDai** | **$199.2M** | **31.2%** |
| 2 | **wstETH** | $133.2M | **20.8%** |
| 3 | WETH | $42.1M | 6.6% |
| 4 | **reUSD** | $38.8M | **6.1%** |
| 5 | USDT | $27.4M | 4.3% |
| 6 | PST | $26.5M | **4.2%** |
| 7 | USDT0 | $26.0M | 4.1% |
| 8 | USDC | $25.8M | 4.0% |
| 9 | WBTC | $24.9M | 3.9% |
| 10 | cbBTC | $23.5M | 3.7% |
| 11 | weETH | $18.1M | 2.8% |
| 12 | osETH | $11.0M | 1.7% |
| 13 | ETH | $10.3M | 1.6% |

**Top-5 concentration: 69.0%** (was 69.9% on Jul 6, 70.6% on May 23). **Top single-asset concentration: 31.2%** (was 30.6% on Jul 6, 28.3% on May 23, and 19.9% on Apr 27 before the May 24 memo flagged the 30% trigger). sUSDai + reUSD combined: **37.3%** of cross-chain TVL in yield-bearing stablecoin wrappers (was 38.5% on Jul 6 — reUSD shrank while sUSDai grew).

**Non-blue-chip collateral beyond the wrappers — PST (rank 6, $26.5M, 4.2%).** Unlike Fluid's blue-chip collateral (wstETH, WETH, WBTC, cbBTC), rank-6 **PST** is Huma Finance's "PayFi Strategy Token" and carries three stacked risks that blue-chip assets do not (verified onchain Jul 22, 2026):
- **Off-chain RWA credit backing:** PST represents a claim on Huma's **PayFi receivables** (real-world payment-financing / invoice credit), not onchain collateral — its value is not independently verifiable onchain and depends on the performance of off-chain receivables.
- **Chainlink CCIP bridge:** on Ethereum PST is a **`BurnMintERC20`** ([`0x22ae3d9a…d4c7`](https://etherscan.io/address/0x22ae3d9a738471f405169af055d31c687087d4c7)) — mint authority is the CCIP `BurnMintTokenPool` ([`0xBE77…0D3d`](https://etherscan.io/address/0xBE776C85FE1f35BE8341167A6305230075F30D3d)); a CCIP/DVN compromise could mint unbacked PST on Ethereum.
- **Solana source-chain risk:** the CCIP pool's *only* configured remote chain is **Solana** (`getSupportedChains()` returns solely the Solana selector `124615329519749607`), so PST is effectively bridged from Solana and inherits Solana-side program/custody risk.

PST was listed May 18 2026 with a steep 50%/80% kink and 100% max rate — Fluid's own rate curve treats it as a higher-risk market than the stablecoin/ETH pairs.

### Per-Chain Concentration (Worse Than Cross-Chain Average) — July 14, 2026

| Chain | Total Supply | #1 Asset | #1 Share | #2 Asset | #2 Share |
|-------|--------------|----------|----------|----------|----------|
| **Plasma** | $79.9M | **sUSDai** | **75.3%** | USDT0 | 20.6% |
| **Arbitrum** | $111.2M | **sUSDai** | **63.9%** | wstETH | 10.0% |
| Base | $18.5M | cbBTC | 27.6% | wstETH | 22.4% |
| Polygon | $3.4M | wstETH | 32.0% | WBTC | 30.3% |
| Ethereum | $426.1M | wstETH | 27.4% | sUSDai | 15.2% |

On Arbitrum and Plasma, sUSDai (issued by **USD.AI**, a synthetic-dollar protocol backed by AI hardware loans) remains overwhelmingly dominant (63.9% / 75.3% of those chains' lending TVL) despite the per-chain percentages declining from May peaks (75.3% / 80.4%) because diverse TVL exited those chains faster than sUSDai did. A USD.AI-level upstream event would still functionally take down lending on those two chains. sUSDai has also expanded onto Ethereum to $64.6M (15.2% of Eth supply), up from ~$52M on Jul 6 and near-zero in May.

**Issuer risk profile (USD.AI):** USD.AI (usd.ai) describes itself as "a yield-bearing synthetic dollar backed by loans against AI hardware, compute, and DePIN assets" targeting 15–25% APR, with peg maintenance relying on arbitrage rather than over-collateralization or RWA backing. sUSDai market cap is ~$300M with 24h on-chain volume of only ~$681K (~0.2% of market cap — extreme illiquidity). **Fluid holds ~$199M of sUSDai — roughly two-thirds of its total supply**, making Fluid the dominant liquidity venue for the asset and making any sUSDai exit effectively impossible without cascading price impact. On-chain price history: ATL $0.796 (−20% from par), recently ~$1.10, confirming sUSDai is not a stable-value instrument.

**sUSDai cross-chain architecture and LayerZero mint authority (verified Jul 22, 2026):** The canonical sUSDai contract is the Arbitrum [`StakedUSDai`](https://arbiscan.io/address/0x0b2b2b2076d95dda7817e785989fe353fe955ef9), an ERC-4626 vault whose `asset()` is Arbitrum USDai [`0x0A1a…82EF`](https://arbiscan.io/address/0x0A1a1A107E45b7Ced86833863f482BC5f4ed82EF). The same address on Ethereum, [`0x0b2b…955ef9`](https://etherscan.io/address/0x0b2b2b2076d95dda7817e785989fe353fe955ef9), is instead an upgradeable `OToken` with no `asset()` / `convertToAssets()` path. The same-address `OAdapter` [`0xffB200…7f24`](https://arbiscan.io/address/0xffB20098FD7B8E84762eea4609F299D101427f24) burns on send and mints on receive on both chains. On Ethereum it is the sole current `BRIDGE_ADMIN_ROLE` holder; on Arbitrum, an `eth_call` simulation from the adapter successfully invoked `mint(address,uint256)` on canonical sUSDai while an arbitrary caller reverted. The authenticated LayerZero path can therefore mint canonical Arbitrum sUSDai, not only the remote Ethereum representation. The canonical mint-side Ethereum→Arbitrum receive route requires all three DVNs (LayerZero Labs, Nethermind, and Canary) and 15 confirmations. Both adapters are owned by the same-address 3-of-3 Safe on their respective chains. Ethereum proxy upgrades are separately controlled by `ProxyAdmin` [`0x0b3296…d9F`](https://etherscan.io/address/0x0b3296b6f50611B28d466a6D5A49754dAd4D8d9F), owned by a [48-hour TimelockController](https://etherscan.io/address/0x0EEA1EE08611fF4A4E83BFe3916712751995639b). The configured 10M sUSDai/hour Arbitrum→Ethereum limiter applies to outbound debit and does not cap `_credit` on a forged inbound message. Fluid's Ethereum Liquidity Layer held ~67.5M of ~70.2M mainnet sUSDai supply when rechecked Jul 22 (~96%); at the Jul 14 report snapshot it accounted for the stated $64.6M. A verifier-path or adapter-owner compromise could dilute canonical supply and impair Fluid's broader cross-chain exposure independently of Fluid's own vault oracles. The 3-of-3 DVN route and 3-of-3 owner Safe are meaningful mitigants, but they do not remove the canonical-supply bridge dependency.

External corroboration: per [CoinDesk RWA Yield Infrastructure Trade](https://www.coindesk.com/research/the-rwa-yield-infrastructure-trade) (Mar 2026), **Fluid handles ~100% of on-chain sUSDai trading volume and 68% of reUSD trading volume**, so a redemption-side stress event in sUSDai would also concentrate on Fluid's liquidity venues.

### Concentration Risk Reassessment (July 14, 2026)

The May 24 reassessment said: *"the concentration risk has shifted assets but has not been reduced in pattern or magnitude."* The situation has further intensified: **sUSDai has held above the 30% trigger explicitly set in the May 24 reassessment** and now stands at **31.2% of cross-chain lending TVL** (up from 30.6% on Jul 6).

Key facts:
- sUSDai cross-chain share is **12.3 pp higher** than the wstUSR share that triggered the Mar 2026 incident.
- On Arbitrum and Plasma, sUSDai is a single point of failure for the chain's lending business (63.9% / 75.3% of chain TVL). While these percentages declined from May peaks, it's because diverse TVL left faster, not because sUSDai was reduced.
- Of the top 4 supply assets globally, two (sUSDai #1, reUSD #4) are yield-bearing stablecoin wrappers — the same structural amplification pattern as wstUSR/USR. Combined they are **37.3% of all-chain TVL** (was 38.5% on Jul 6 — reUSD shrank while sUSDai grew).
- Fluid is also the dominant on-chain trading venue for sUSDai (~100%), so the redemption/liquidity surface for sUSDai under stress is itself heavily Fluid-concentrated.
- Note: absolute sUSDai fell from the May peak of $246.7M to $193.3M on Jul 6 as overall TVL contracted, then edged back up to $199.2M by Jul 14. The rising 31.2% share reflects sUSDai being stickier than other assets plus modest renewed inflows in early July, not a return to the May absolute level.

The structural reasoning holds: yield-bearing-stable wrappers carry contagion risk because their wrap ratio amplifies losses when the underlying depegs. The change since May is that the 30% trigger fired and the share keeps climbing, and sUSDai now appears on Ethereum ($64.6M) as well as Arbitrum/Plasma.

### Historical Liquidity Performance

- August 2024: -16.1% TVL drop, recovered without operational issues
- **March 2026: -30.3% drop, partial market freezes (wstUSR vaults), bad debt event covered, full recovery within days. Standard fToken markets remained functional.**
- **April 2026: -17.5% drop, precautionary rsETH freeze, no operational impact to other markets.**
- **May–Jul 2026: -26.8% TVL decline ($872.5M → $639.0M by Jul 14, having bottomed near $632M in early July). Broad-based across all chains and asset types. No incident, no freezes, no bad debt. fToken exchange rates continued increasing monotonically throughout. This is the first sustained TVL decline without an associated incident — consistent with market rotation rather than protocol stress.**

## Centralization & Control Risks

### Governance

- **Governance Model**: Onchain GovernorBravo governance. FLUID token holders vote on proposals that execute through a timelock. Discussion on [governance forum](https://gov.fluid.io/), onchain voting via [GovernorBravo](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B), and offchain signaling via [Snapshot](https://snapshot.org/#/instadapp-gov.eth).
- **Timelock**: [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) — **1-day (86,400s) delay** ✓ unchanged. Admin = GovernorBravo.
- **Owner/Admin**: All core contracts (Liquidity Layer proxy admin, LendingFactory, RebalancerProxy) confirmed owned by the **Timelock** (`0x2386DC45...`) — verified onchain via `owner()` and EIP-1967 admin slot reads at block `25529610`.
- **GovernorBravo Parameters** (re-verified onchain July 14 2026 at block `25529610`):
  - Quorum: 4,000,000 FLUID (4% of total supply) ✓
  - Proposal threshold: 1,000,000 FLUID (1% of total supply) ✓
  - Voting delay: 7,200 blocks (~1 day) ✓
  - Voting period: 14,400 blocks (~2 days) ✓
  - **Proposals created: 135; proposals executed: 127** (other 8 are terminal non-executed: 3 Canceled, 3 Defeated, 2 Expired)

### Lending-Specific Admin Controls

| Role | Who | What They Can Do to Lending |
|------|-----|---------------------------|
| **Timelock** (governance) | [`0x2386DC45...`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Upgrade Liquidity Layer implementation, change LendingFactory owner, change supply/borrow configs, change rate models |
| **LendingFactory Auths** | Set by Timelock | Update fToken rewards config, change rebalancer address, rescue stuck tokens, set fToken creation code |
| **LendingFactory Deployers** | Set by Timelock | Create new fToken contracts |
| **Rebalancer (fUSDC, fUSDT)** | [`0x264786EF…ce92`](https://etherscan.io/address/0x264786EF916af64a1DB19F513F24a3681734ce92) — `FluidReserveContractProxy`, `owner()=Timelock` | Deposit underlying without minting shares (adds as rewards). Cannot withdraw. (Corrected from Apr 2026 report, which named the inactive `FluidLendingRewardsRateModel` `0x724d…b9b6` in this slot.) |
| **Guardian** (Avocado multisig) | [`0x4F6F977a...`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Pause Class 0 protocols only. **Cannot move or withdraw funds.** Cancel timelock transactions. Used to freeze rsETH markets in Apr 2026 (precautionary). |

**Key finding:** No admin role can directly access or move user funds deposited via fTokens. The most powerful action is the Timelock upgrading the Liquidity Layer implementation (1-day delay). The Guardian's pause capability was exercised appropriately in both Mar and Apr 2026 events without abuse. **No `LogPauseUser` or `LogUnpauseUser` events since May 24, 2026** — all previously-frozen vaults have been reopened and no new market freezes have occurred.

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

| Contract | Address | Why Monitor |
|----------|---------|-------------|
| **fUSDC** | [`0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33`](https://etherscan.io/address/0x9Fb7b4477576Fe5B32be4C1843aFB1e55F251B33) | Largest fToken (~$134M Jul 14 2026). Exchange rate, deposits/withdrawals |
| **fUSDT** | [`0x5C20B550819128074FD538Edf79791733ccEdd18`](https://etherscan.io/address/0x5C20B550819128074FD538Edf79791733ccEdd18) | Second largest (~$131M Jul 14 2026). Exchange rate, deposits/withdrawals |
| **Liquidity Layer** | [`0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`](https://etherscan.io/address/0x52Aa899454998Be5b000Ad077a46Bbe360F4e497) | Holds all fToken deposits. Admin changes, implementation upgrades |
| **Liquidity Layer impl (current)** | [`0xcc331daf69752bece3dc98dbc63eacd5092266a2`](https://etherscan.io/address/0xcc331daf69752bece3dc98dbc63eacd5092266a2) | Implementation contract behind the proxy. Monitor for changes via EIP-1967 implementation slot. |
| **Timelock** | [`0x2386DC45AdDed673317eF068992F19421B481F4c`](https://etherscan.io/address/0x2386DC45AdDed673317eF068992F19421B481F4c) | Owner of all core contracts — queued/executed transactions |
| **GovernorBravo** | [`0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B`](https://etherscan.io/address/0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B) | Governance proposals, voting, execution |
| **Avocado Multisig** | [`0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e`](https://etherscan.io/address/0x4F6F977aCDD1177DCD81aB83074855EcB9C2D49e) | Guardian pause/cancel actions |

### Key Events to Watch

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

**Top-priority issuer to monitor (July 2026 update): USD.AI (sUSDai).** sUSDai is now **31.2%** of cross-chain Fluid lending TVL (above the 30% reassessment trigger set in May 2026) and 64–75% of Arbitrum/Plasma supply. **sUSDai is issued by USD.AI (usd.ai).** USD.AI is a synthetic-dollar protocol backed by AI hardware loans with peg maintenance via arbitrage, targeting 15–25% APR. Key risk factors: Fluid holds ~$199M of sUSDai — roughly two-thirds of its ~$300M supply; 24h on-chain volume is only ~$681K (~0.2% of market cap); price has historically ranged $0.796–$1.19. Any incident touching USD.AI governance, the underlying loan-collateral pool, USDai redemption mechanics, or USDai peg stability is the single highest-impact external event for Fluid lenders at this snapshot. **Second-priority: Sky/Maker (sUSDS, fsUSDS).** sUSDS is Sky's savings token — a separate, much smaller exposure (~$5K fToken supply). Sky is well-established but a Sky governance incident would still affect Fluid via USDS/USDC and USDS/USDT liquidity even though sUSDS supply on Fluid is minimal.

**Third-priority: Re Protocol (reUSD).** reUSD is $38.8M (6.1% of cross-chain TVL, ~26.7% of total reUSD supply). Standalone risk assessment at [`reports/report/re-reusd.md`](re-reusd.md) scores **3.51/5.0 (Elevated Risk)**. Key risk factors for Fluid lenders: ~50% offchain backing via §114 reinsurance trusts; share price written daily by admin-controlled Chainlink Functions (`setSharePrice` on `SharePriceCalculator`); ~86% of onchain reserves held at plain EOAs with no onchain timelock or role gating; only ~50.2% reUSD-only onchain coverage (near the 50% floor); no bug bounty; 42% branch test coverage. Any incident touching Re's custodial EOAs, the NAVConsumer oracle, the §114 trust counterparties, or Re's 3-of-5 governance Safe would affect the $38.8M reUSD position on Fluid.

**Fourth-priority: Huma / PST (bridged from Solana).** PST (Huma "PayFi Strategy Token") is $26.5M (4.2% of cross-chain TVL) and is **not blue-chip**: it is backed by **off-chain PayFi receivables** rather than onchain collateral, and on Ethereum is a **Chainlink CCIP `BurnMintERC20`** ([`0x22ae3d9a…d4c7`](https://etherscan.io/address/0x22ae3d9a738471f405169af055d31c687087d4c7)) bridged solely from **Solana** (pool [`0xBE77…0D3d`](https://etherscan.io/address/0xBE776C85FE1f35BE8341167A6305230075F30D3d) supports only the Solana chain selector). Monitor the CCIP token-pool mint activity and rate limits, Huma's receivables performance and redemption liquidity, and any Solana-side program incident — any of which could impair or unbacked-mint the Ethereum PST that Fluid vaults hold as collateral.

## Risk Summary

### Key Strengths

- **fToken design held under stress**: Monotonically-increasing exchange rates verified at every checkpoint (Feb / Apr 27 / May 11 / May 24 / Jul 6, all confirmed onchain); no direct loss to lenders on Ethereum through the May–Jul 2026 TVL drawdown.
- **Rapid incident response**: ~30 minute pause-and-freeze response on Mar 22; ~3 days to fully repay $70M of bad debt.
- **No new incidents since Apr 2026**: The Kelp/rsETH freeze was the last operational event. May–Jul 2026 had no freezes, pauses, or bad-debt events.
- Battle-tested team with ~6 years of DeFi operational history (Instadapp since 2019).
- 8 security audits from 4 reputable firms covering Lending Protocol and Liquidity Layer.
- Onchain GovernorBravo governance with 1-day Timelock and **135 proposals created / 127 executed** — all core contracts owned by Timelock (re-verified Jul 14 2026).
- Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- Fully programmatic interest rates and exchange rates — no offchain oracle for lending.
- ~2.40 years in production, ~$639M lending TVL across 5 chains.

### Key Risks

- **Concentration risk has escalated — 30% trigger fired**: The Feb 2026 wstUSR concentration (18.9%) produced the Mar 2026 incident. The Apr 27 reassessment flagged the same pattern at sUSDai (19.9%). By May 23 sUSDai was 28.3% with a 30% trigger explicitly set. sUSDai crossed that trigger at 30.6% on Jul 6 and **by Jul 14 stands at 31.2% and rising** — larger than the wstUSR exposure that triggered the prior incident, and structurally identical.
- **Ad-hoc bad-debt coverage**: The Mar 2026 recovery relied on **discretionary off-balance-sheet loans from named individuals/entities** (cyberfund/Lomashuk, weremeow, Fluid core team). There is no programmatic, pre-funded insurance fund, first-loss tranche, or contractual coverage obligation. The same coverage pattern is not guaranteed to scale to a larger event.
- **TVL declined 26.8% since May**: Lending TVL fell from $872.5M to $639.0M (bottoming near $632M in early July before stabilizing). While this broad-based decline did not trigger a 50% reassessment trigger, it reflects significant capital exit across all chains and asset types. sUSDai's concentration share rose mainly because it was stickier than other assets.
- **Wrapped-stablecoin contagion amplification**: The wstUSR wrapping ratio meant that even a partial USR repeg would not have made wstUSR-collateralized borrowers solvent. sUSDai and reUSD share this structural property.
- **Trading-venue concentration for sUSDai**: Fluid handles ~100% of on-chain sUSDai trading volume — under stress, sUSDai redemption flow would concentrate on Fluid's own venues, amplifying the impact of the supply-side concentration.
- **Shared Liquidity Layer**: fToken deposits are commingled with Vault, DEX, and stETH protocol funds. A vulnerability anywhere in the stack affects fToken holders.
- **Liquidity Layer upgradeability**: Upgradeable proxy controlled by Timelock with only 1-day delay.
- **No formal verification** has been performed.
- **External collateral-issuer dependency surface**: Mar/Apr 2026 demonstrated this is a first-order risk; the sUSDai concentration at 31.2% makes USD.AI (usd.ai) — a novel synthetic-dollar protocol — the single most important external dependency to monitor. Fluid holds ~two-thirds of all sUSDai supply with near-zero exit liquidity.

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

- **Audits**: Unchanged — 8 audits across 4 firms. All 3 criticals and 13 highs from prior audits resolved. No new audits since Feb 2026 (audits page rechecked July 14 2026).
- **History**: ~2.40 years in production, **~$639M lending TVL across 5 chains** (July 14 2026 snapshot; May 23 peak was $872.5M, Apr 27 drawdown bottom was $750.8M).
- **Bounty**: Active Immunefi bug bounty ($500K max) with Lending Protocol explicitly in scope.
- **Material incidents**: Mar 2026 Resolv contagion → $10–17.5M bad debt, lenders made whole; Apr 2026 Kelp/rsETH precautionary freeze, no bad debt.

**Score: 2.0/5**. Strong audit coverage and bounty unchanged. History grew from ~2.18 → ~2.40 years but is still not "incident-free": one bad-debt event covered via off-balance-sheet capital, plus one precautionary freeze.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 2.0**
- Full onchain GovernorBravo governance with 135 proposals created / 127 executed (8 terminal non-executed: 3 Canceled, 3 Defeated, 2 Expired)
- 1-day timelock delay; all core contracts owned by Timelock (re-verified Jul 14 2026)
- No admin role can directly access or withdraw fToken user funds
- Guardian pause used appropriately in Mar/Apr 2026 events; no abuse. No pause/unpause events since May 24.

**Subcategory B: Programmability — 1.5**
- Fully programmatic: interest rates and fToken exchange rates all onchain
- ERC4626 fTokens with algorithmically computed, monotonically increasing exchange rates (re-verified Jul 14 2026 — monotonicity continues through all stress events and the May–Jul TVL drawdown)
- No offchain keepers/oracles for lending
- Bad-debt coverage process is **not programmatic** (relies on discretionary capital commitments) — a structural gap, but does not affect day-to-day operations

**Subcategory C: Dependencies — 4.0** (was 2.5)
- Critical dependency on Liquidity Layer
- Indirect dependency on Chainlink via Vault Protocol oracle system
- External collateral-issuer dependency remains a first-order risk (Mar/Apr 2026 events). The sUSDai concentration at 31.2% (cross-chain) and 64–75% (per-chain on Arbitrum/Plasma) makes a single novel issuer (**USD.AI**) the dominant external dependency. Fluid holds ~$199M of sUSDai — roughly two-thirds of its ~$300M supply — with 24h on-chain volume of only ~$681K, making any exit from the position effectively impossible without cascading price impact. USD.AI has no standalone Yearn risk assessment and is newer and less-scrutinized than the issuers behind Fluid's blue-chip collateral. sUSDai uses a cross-chain burn/mint `OAdapter` on canonical Arbitrum and Ethereum; the authenticated path can mint canonical supply. Its canonical mint-side route is a 3-of-3 DVN quorum with 15 confirmations, the adapter is owned by USD.AI's 3-of-3 Safe, and the 10M/hour limiter is outbound-only. **Additionally, reUSD ($38.8M, 6.1% cross-chain) has a standalone risk score of 3.51/5.0 (Elevated Risk)** per [`reports/report/re-reusd.md`](re-reusd.md): ~50% offchain backing via reinsurance trusts, share price written daily by admin-controlled Chainlink Functions (`setSharePrice`), ~86% of onchain reserves held at plain EOAs, no bug bounty, and only 42% branch test coverage. Fluid holds ~26.7% of all reUSD supply.

**Score: 2.5/5** (was 2.0 in May). (2.0 + 1.5 + 4.0) / 3 = 2.5. Dependencies subcategory raised 2.5 → 4.0 because the evidence now matches the rubric's "many or newer protocol dependencies / critical functionality depends on them" row: (a) sUSDai is a single novel synthetic-dollar issuer on which 31.2% of lending supply TVL depends, Fluid holds ~two-thirds of total supply, and the privileged cross-chain adapter can mint canonical Arbitrum supply; plus (b) **reUSD cross-reference** to the existing 3.51-rated (Elevated Risk) assessment at `reports/report/re-reusd.md`, an asset with ~50% offchain backing, admin-written share prices, EOA-based reserve custody, and no bug bounty. With sUSDai (31.2%) and reUSD (6.1%), ~37% of Fluid's lending TVL is in yield-bearing wrappers from two high-risk issuers (USD.AI and Re Protocol), one of which we independently rate Elevated Risk. A 5 is not assigned because either issuer's failure would severely impair affected markets but would not necessarily break the entire Fluid protocol.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.0** (was 3.25 on Jul 6, 3.00 mid-reassessment, 2.75 in May, 2.5 in Apr)
- All lending is over-collateralized per-position via Vault Protocol with onchain tick-based liquidations — the *backing* axis is strong.
- **Top supply asset sUSDai is 31.2% of all-chain TVL ($199.2M), above the 30% trigger and still rising.** This is the largest single-asset exposure in the protocol's history (wstUSR peaked at 18.9% before the Mar 2026 incident).
- **Collateral quality, not the backing ratio, is the binding constraint.** ~37% of the cross-chain book is in yield-bearing wrappers (sUSDai 31.2% + reUSD 6.1%) whose quality maps to the low end of the rubric. The single largest asset, sUSDai, is by the evidence below *worse* than reUSD — which we score at Collateralization 4.25 in its own report — yet dominates the book.
- **sUSDai issuer is USD.AI**, a synthetic-dollar protocol backed by offchain AI-hardware loans. **Fluid holds ~$199M — roughly two-thirds of total sUSDai supply** — with 24h on-chain volume of only ~$681K (~0.2% of market cap). sUSDai price has ranged $0.796–$1.19; it is not a $1-pegged instrument.
- **Un-liquidateable concentration undercuts the quality of the lending base.** Because Fluid *is* the sUSDai market (~100% of on-chain trading volume, ~two-thirds of supply), 31.2% of lending supply TVL cannot be sold into external depth without cascading price impact. This is direct issuer and exit risk for sUSDai suppliers and becomes cross-asset bad-debt risk to the extent sUSDai is used as Vault/DEX collateral—the same pathway that turned the March 2026 wstUSR depeg into realized bad debt.
- **Exposure-basis caveat:** the $199.2M figure is lending supply TVL, not a measurement of borrower collateral or debt secured by sUSDai. **TODO:** quantify live cross-asset debt secured by sUSDai before treating the full supply figure as protocol-wide bad-debt exposure.
- On Arbitrum and Plasma, sUSDai is 63.9% / 75.3% of chain TVL — a USD.AI-level upstream event would functionally take down lending on those two chains. sUSDai has also expanded onto Ethereum ($64.6M, 15.2% of Eth supply).
- Tick-based liquidation mechanism; the Mar 2026 incident showed it cannot prevent bad debt for collateral that experiences extreme intraday repricing.
- Bad-debt coverage is discretionary, not programmatic.
- **Separate USDai T1 oracle finding (verified onchain Jul 22; not the $199.2M sUSDai position).** Three Arbitrum T1 vaults accept **USDai collateral** and borrow USDC / USDT0 / GHO. Their collateral factor is 94% and liquidation threshold 95%; the USDC and USDT0 vaults use Arbitrum [`PegOracleL2` `0xdf79…fc72`](https://arbiscan.io/address/0xdf79ee3ab9ae7631a9b109d7345136274119fc72), while the GHO vault uses a separate oracle with the same USDai peg leg. The Base USDai/USDC T1 vault uses a different deployment, [`0xd03a…81d4`](https://basescan.org/address/0xd03aff8c62c93d179d7933F2e1B9FAfB02bC81d4). The peg leg returns a constant `1e15`; operate and liquidation rates are identical, with no market or Chainlink input. A USDai drop below ~0.94 can therefore leave a maxed position real-underwater without triggering liquidation. **This oracle secures those USDai-collateral vault debts, not Fluid's $199.2M sUSDai supply/DEX position.** At the Jul 22 recheck, the three Arbitrum T1 vaults held only ~$3.44K USDai collateral against ~$365 of debt, so the structural defect is monitorable but does not justify scoring the entire dominant sUSDai exposure as hard-peg-priced. Staked sUSDai DEX vaults use reserve-based oracles on Fluid-dominated venues, a separate circularity risk.
- **reUSD oracle cross-check (verified onchain Jul 22):** All seven located mainnet vaults using reUSD use it on the collateral side and route through [`FluidREUSDCappedRate` `0x0964…bb6c`](https://etherscan.io/address/0x0964957869b2fdd70f0a120e8d8d7a5a187abb6c), sourced from Re's [`SharePriceCalculator` `0xd1D1…05B8`](https://etherscan.io/address/0xd1D104a7515989ac82F1AFDa15a23650411b05B8). The collateral-side maximum-downside setting is `1e6` (effectively uncapped) and `avoidForcedLiquidationsCol` is `false`, so a lower reUSD source rate passes through to liquidation pricing rather than being hidden by a peg floor. This avoids the specific USDai hard-peg blind spot, while retaining the upstream admin-NAV, custody, and offchain-backing risks documented in the reUSD report.
- **sUSDai LayerZero mint dependency:** The OAdapter can mint canonical Arbitrum sUSDai as well as the Ethereum `OToken`. The canonical mint-side route requires all three configured DVNs and 15 confirmations, with the adapter owned by a 3-of-3 Safe; however, the 10M/hour limiter applies only to outbound debit and would not cap `_credit` after a forged inbound message. This dependency therefore applies to the full canonical-linked exposure, not just the $64.6M Ethereum position.
- **Calibration:** 4.0 sits above Maple syrupUSDC (3.0, more diversified/transparent collateral) and stays below reUSD (4.25) and structurally-undercollateralized credit books (3jane/infinifi 4.5), because Fluid's per-position over-collateralization and functioning onchain liquidations are real. The realized Mar-2026 loss at a *smaller* wrapper concentration, extreme exit illiquidity, opaque upstream value, and canonical-supply bridge mint dependency match the rubric's 4-level lower-quality/illiquid/custodial risk. The currently tiny USDai T1 hard-peg debt is tracked separately rather than attributed to the $199.2M supply position.

**Subcategory B: Provability — 2.5** (was 1.0)
- fToken exchange rates themselves are computed programmatically (ERC4626) and are monotonically increasing — verified onchain through all stress events and the May 24 → Jul 14 window. In isolation this is fully provable.
- **However, ~37% of lending supply TVL is in assets whose economic value depends on offchain/admin-side inputs that cannot be independently verified onchain**, so the value of those fToken underlyings is not purely onchain-provable:
  - **reUSD** ($38.8M): its share price is written by an admin-controlled Chainlink Functions job (`setSharePrice` on `SharePriceCalculator`), reflecting ~50% offchain reinsurance-trust NAV attested by a third party. There is no independent onchain oracle to cross-check it.
  - **sUSDai** ($199.2M): its value derives from USD.AI's offchain AI-hardware loan book; there is no onchain proof of the underlying collateral, and its market price is set on a venue Fluid itself dominates. The privileged sUSDai `OAdapter` can mint on both canonical Arbitrum sUSDai and the Ethereum `OToken`, so cross-chain verifier and adapter-owner integrity are part of canonical-supply provability.
- Because the fToken exchange rate reads healthy right up until a liquidation shortfall is *realized*, forming bad debt against these offchain-marked assets is **not observable onchain in advance** — the same latency that surprised lenders in March 2026.
- Interest rates and all Liquidity-Layer reserves remain onchain-verifiable via FluidLiquidityResolver.
- Net: between rubric rows 2 and 3. Most Fluid accounting remains onchain, but the affected share is too large and relies on multiple opaque/admin-driven sources to fit row 2's "some offchain / single reliable source" description.

**Score: 3.25/5** — (4.0 + 2.5) / 2 = 3.25 (was 1.875 on Jul 6). Collateralization 3.25 → 4.0 for the underlying-asset quality, illiquidity, realized-loss, and bridge-dependency factors above; Provability 1.0 → 2.5 because ~37% of lending supply TVL depends on offchain/admin-side value inputs (reUSD `setSharePrice`; USD.AI loan-book NAV), with sUSDai adding a privileged LayerZero path capable of minting canonical Arbitrum supply.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: fToken withdrawals subject to Liquidity Layer withdrawal limits and available liquidity
- **Stress test results (Mar 22–25, 2026)**: $300M+ net outflows in 24 hours absorbed; standard fToken markets remained operational; affected vaults paused. Kink-based rate model worked as designed.
- **Stress test results (Apr 18–20, 2026)**: ~$180M outflows over 2 days; rsETH markets precautionarily frozen; no other operational impact.
- **Recovery (Apr 27 → May 24)**: lending TVL recovered $751M → $872.5M (+16%); previously paused vaults unpaused on May 12–13 with no observed exit stress.
- **Drawdown (May 24 → Jul 14)**: lending TVL declined $872.5M → $639.0M (−26.8%, having bottomed near $632M on Jul 6). Broad-based across all chains. No freezes, no incidents, no bad debt. Exchange rates continued to increase monotonically throughout.
- **Withdrawal limits**: Expandable limits throttle large exits.
- **Shared pool risk**: Liquidity Layer serves lending, vaults, DEX, and stETH
- **Concentration**: sUSDai exposure now $199.2M (31.2% cross-chain, 64–75% on Arbitrum/Plasma, 15.2% on Ethereum) — the previously-flagged concentration-as-liquidity-risk vector continues to worsen, holding above the 30% trigger. Concentration is mostly captured in Funds Mgmt § A; in this category it manifests as: a sUSDai stress event would likely produce per-chain withdrawal pressure similar in shape to the Mar 2026 Ethereum event, now with an additional Ethereum surface.
- **Secondary market**: No significant DEX liquidity for fTokens themselves.

**Score: 2.5/5** (was 2.0). Fluid's withdrawal mechanism handled the Mar/Apr stress events and the May–Jul drawdown, which prevents a 3-level score. However, row 2 assumes a large holder can exit with less than 1% impact over 1–3 days; that is inconsistent with Fluid holding roughly two-thirds of sUSDai supply while external daily volume is only ~0.2% of market cap. Withdrawing sUSDai from Fluid returns the asset but does not provide an economically viable exit from it, so 2.5 captures the split between strong protocol withdrawal mechanics and weak underlying-asset market depth.

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
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 2.5  | 15% | 0.375 |
| Operational Risk | 1.5  | 5% | 0.075 |
| **Subtotal** | | | **2.575** |

**Final Score: 2.575** → rounded to **2.6** (was 1.4 in May 2026; was 1.1 in Feb 2026). Underlying weighted subtotal moved 1.94 → 2.575 driven by: (a) sUSDai concentration crossing and holding above the 30% trigger, sUSDai issuer and Arbitrum source chain identified as USD.AI, extreme exit illiquidity, and the LayerZero `OAdapter` path capable of minting canonical Arbitrum sUSDai — Funds Mgmt § A (Collateralization) 2.75 → 4.0; (b) Funds Mgmt § B (Provability) 1.0 → 2.5 (~37% of lending supply TVL depends on offchain/admin-side value inputs — reUSD `setSharePrice`, USD.AI loan-book NAV — while sUSDai adds a privileged canonical-supply mint path); (c) Category 2 § C (Dependencies) 2.5 → 4.0 (single novel issuer USD.AI + reUSD cross-reference to the 3.51-rated Elevated Risk assessment); and (d) Liquidity 2.0 → 2.5 because protocol withdrawals return the underlying but cannot provide an economically viable exit from Fluid's dominant sUSDai position. The USDai T1 hard-peg oracle remains a specific structural issue, but its currently tiny vault debt is not attributed to the $199.2M sUSDai supply position. The -0.5 TVL modifier is not applied (the protocol had a material Mar-2026 bad-debt incident, disqualifying a discretionary reduction).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|-------------|-----------|----------------|
| 1.0–1.5 | Minimal Risk | Approved, high confidence |
| 1.5–2.5 | Low Risk | Approved with standard monitoring |
| **2.5–3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5–4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5–5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK** (moved from Minimal Risk; final score 1.4 → 2.6; driven by sUSDai concentration above the 30% trigger, sUSDai issuer and Arbitrum source chain identified as USD.AI, a LayerZero path capable of minting canonical Arbitrum sUSDai, ~37% of lending supply TVL relying on offchain/admin-side value inputs, reUSD 3.51 Elevated Risk cross-reference, economically constrained sUSDai exit liquidity, and non-application of the -0.5 TVL modifier due to the Mar 2026 incident)

The Fluid Lending Protocol (fTokens) remains a well-designed ERC4626-compliant lending product. Since the May 24 reassessment, TVL declined 26.8% to $639M — broad-based across all chains and asset types, now stabilizing — but fToken exchange rates kept increasing monotonically (verified Jul 14 onchain), governance is functioning normally (135 proposals created / 127 executed; 8 in terminal non-executed states), Avocado guardian 7-of-14 unchanged, Liquidity Layer impl unchanged at `0xcc33…66a2`, and no new pauses, freezes, or incidents occurred.

Factors driving the score movement from 1.4 to 2.6: (1) the **30% concentration trigger firing** — sUSDai is now 31.2% of cross-chain TVL and still rising; (2) the **identification of sUSDai's issuer and cross-chain architecture** — canonical sUSDai is an Arbitrum ERC-4626 vault, Ethereum uses an upgradeable `OToken`, and the LayerZero `OAdapter` can mint both. The canonical mint-side route requires a 3-of-3 DVN quorum with 15 confirmations and is owned by a 3-of-3 Safe; (3) Fluid holds ~two-thirds of all sUSDai supply (~$199M) with extreme on-chain illiquidity, and sUSDai is not a stable-value instrument; (4) **cross-referencing the existing reUSD risk assessment** (score 3.51/5.0, Elevated Risk), which shows $38.8M (6.1% of Fluid TVL, ~26.7% of reUSD supply) is in an asset with ~50% offchain backing, admin-written share prices, EOA reserve custody, and no bug bounty; and (5) the finding that **~37% of lending supply TVL depends on offchain/admin-side value inputs** (reUSD `setSharePrice`, USD.AI loan-book NAV). Combined sUSDai + reUSD: ~37% of TVL in yield-bearing wrappers from two high-risk issuers, one independently rated Elevated Risk. The $199.2M sUSDai figure is supply-side exposure rather than quantified borrower collateral; the report therefore does not treat all of it as protocol-wide bad-debt exposure. The separate USDai T1 hard-peg oracle can miss a depeg at 94% CF, but the affected Arbitrum T1 debt was only ~$365 at the Jul 22 recheck. **The -0.5 TVL modifier is not applied** — a protocol with a material bad-debt event in the past ~4 months should not receive a discretionary score reduction. Funds Mgmt § A (Collateralization) moves 2.75 → 4.0, § B (Provability) 1.0 → 2.5, Category 2 § C (Dependencies) 2.5 → 4.0, and Liquidity 2.0 → 2.5 (weighted subtotal 1.94 → 2.575). At one-decimal rounding the final score moves to 2.6, shifting from Minimal Risk to **Medium Risk** tier.

---

## Reassessment Triggers

- **Time-based**: Reassess in 2 months (September 2026) — shorter than the standard 6 months because sUSDai has crossed the 30% trigger and the TVL trajectory bears watching.
- **Concentration-based (FIRED — Jul 6 2026)**: ~~Reassess immediately if sUSDai exceeds 30% of cross-chain lending TVL~~ → **TRIGGER FIRED at 30.6% (Jul 6), now 31.2% (Jul 14)**. Reassess **immediately** if sUSDai exceeds **35%** of cross-chain lending TVL OR if any per-chain single-asset concentration exceeds 85% (Plasma sUSDai 75.3%, Arbitrum sUSDai 63.9% — both still below).
- **Coverage-mechanism formalization**: Reassess if Fluid implements a programmatic insurance/coverage layer (would lower funds-management subcategory). Conversely, reassess if the protocol experiences a second bad-debt event without comparable third-party coverage.
- **Foundation execution**: Reassess once the Cayman Islands Fluid Foundation IP transfer completes (would improve operational score).
- **TVL-based**: Reassess if lending TVL changes by more than 50% from current ~$639M baseline (July 14 2026) — i.e., drops below ~$320M or exceeds ~$959M.
- **sUSDai source-chain / bridge controls (highest priority)**: Reassess immediately on any mint-role or admin-role change on Arbitrum or Ethereum sUSDai, either `OAdapter` owner change, peer or DVN-route configuration change, rate-limit change, proxy implementation upgrade, cross-chain supply mismatch, or unexpected canonical Arbitrum mint.
- **USDai T1 depeg / utilization**: The Arbitrum and Base USDai T1 vaults use a hardcoded 1:1 peg leg that does not reflect a depeg. Monitor USDai market price and these vaults' debt, not the aggregate sUSDai supply balance. Reassess immediately if USDai deviates below ~$0.97, if aggregate hard-peg T1 debt becomes material, or if their oracle configuration changes. A depeg past ~1 − CF (≈6% at 94% CF) on maxed positions can produce uncovered bad debt.
- **Incident-based**: Reassess after any further exploit, governance change, significant parameter modification, or contagion event from a major collateral issuer (especially **USD.AI** for sUSDai, Re for reUSD, Sky/Maker for sUSDS).
- **Governance**: Reassess if GovernorBravo parameters change (quorum, timelock delay, voting period) or if Avocado guardian configuration changes.
- **Dependency**: Reassess if Liquidity Layer implementation is upgraded (current impl: `0xcc331daf69752bece3dc98dbc63eacd5092266a2`) or if a new protocol is added to the shared liquidity pool.
- **Utilization-based**: Reassess if Ethereum lending utilization sustains >99% for >24 hours.

## Open Observations

- **Proposal #128 (executed May 5 2026) didn't change USDC/USDT kinks** despite the proposal text saying it would; only an ETH `rateAtUtilizationMax` event was emitted. All subsequent proposals (#129–#135) have since executed. The onchain USDC/USDT curves remain at 85%/93% kink with 5.40%/7.50% rates as verified at block `25529610`.
- **Proposal-text vs onchain-effect gap** from #128 remains unresolved after 10 further proposals executed. This is a minor governance-coordination observation rather than a risk event.

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
│   │  proposalCount: 135        │      │  Custom contract (not Safe)  │  │
│   │  127 Executed              │      │  7-of-14 custom guardian     │  │
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
│   fUSDC   0x9Fb7…  ~$134M        │    │  Vault Protocol                │
│   fUSDT   0x5C20…  ~$131M        │    │   - borrowers + collateral     │
│   fGHO    0x6A29…  ~$15M         │◀───│   - tick-based liquidations    │
│   fwstETH 0x2411…  ~360 wstETH   │ yield   - generates fToken yield    │
│   fWETH   0x9055…  ~1,600 WETH   │    │                                │
│   fUSDtb  0x15e8…  ~$2.2M        │    │  DEX Protocol                  │
│   fsUSDS  0x2BBE…  ~$5K          │    │  stETH Protocol                │
│                                  │    │                                │
│   All-chain lending TVL: ~$639M  │    │                                │
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
│    Top-10 cross-chain supply (Jul 14 2026, total $639.0M):               │
│      sUSDai   31.2%  (USD.AI — Staked USDai)            ★★★ ABOVE 30%     │
│      wstETH   20.8%  (Lido)                             trigger          │
│      reUSD     6.1%  (Re Protocol — score 3.51 Elevated Risk) ★              │
│      WETH      6.6%   USDT  4.3%   PST   4.2%   USDT0 4.1%               │
│      USDC      4.0%   WBTC  3.9%   cbBTC 3.7%   weETH 2.8%               │
│    ★ = yield-bearing stablecoin wrapper (same structural pattern as      │
│        wstUSR/USR that produced the Mar 22 2026 bad-debt event)          │
│    ★★★ = sUSDai above 30% trigger set in May 24 report. Issuer is       │
│        USD.AI (usd.ai). Fluid holds ~2/3 of total supply.  │
│        Per-chain: Plasma 75.3%, Arbitrum 63.9%, Ethereum 15.2%.         │
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

- **Lender → fToken → Liquidity Layer**: fully programmatic ERC4626 with burn-before-withdraw; exchange rate monotonically increasing (verified through all 2026 events including the May–Jul TVL drawdown).
- **Borrower default → bad debt → fToken yield**: realized in Mar 2026 ($10–17.5M). **No programmatic backstop**; covered via discretionary loans (cyberfund/Lomashuk, weremeow, Fluid core team).
- **Collateral-issuer / bridge compromise → wrap-ratio amplified loss → bad debt**: the structural pattern that produced Mar 2026. **sUSDai is 31.2% cross-chain and 64–75% on Arbitrum/Plasma** — larger than the wstUSR exposure that triggered the prior incident. **Issuer and source chain: USD.AI on Arbitrum**, a novel synthetic-dollar protocol backed by AI hardware loans. Fluid holds ~two-thirds of all sUSDai supply with near-zero exit liquidity (~0.2% daily volume). sUSDai has traded as low as $0.796. The LayerZero `OAdapter` has mint/burn authority on both the Ethereum `OToken` and canonical Arbitrum sUSDai, adding a canonical-supply failure path; the Arbitrum receive route is 3-of-3 with 15 confirmations, but its outbound rate limiter does not cap inbound credit. **reUSD (6.1%, $38.8M)** has a standalone risk score of **3.51/5.0 (Elevated Risk)** per [`reports/report/re-reusd.md`](re-reusd.md): ~50% offchain backing, admin-written share prices, EOA reserve custody, no bug bounty. Combined sUSDai + reUSD = ~37% of TVL in high-risk yield-bearing wrappers.
- **Governance → Timelock (1d) → Liquidity Layer impl**: upgrade path. The Mar 31 2026 upgrade bundled dummy-impl swap + module-dispatcher selectors in one tx (`0xf484b2a2…`). No subsequent upgrades.
- **Avocado Guardian → Pause Class-0**: cannot move funds; used appropriately in both Mar and Apr 2026 events. No pause/unpause events since May 24 2026.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| February 12, 2026 | 1.1 | Initial assessment |
| April 27, 2026 | 1.4 | Reassessment: TVL recovery; sUSDai concentration flagged (19.9%) as structurally identical to pre-incident wstUSR |
| May 24, 2026 | 1.4 | Reassessment: sUSDai grew to 28.3%; explicit 30% concentration trigger set; Collateralization 2.5 → 2.75 |
| July 22, 2026 | 2.6 | Reassessment (TVL/on-chain snapshot Jul 14, block `25529610`; sUSDai bridge & oracle layer verified Jul 22): lending TVL $639.0M (−26.8% off May peak, stabilizing); sUSDai above 30% trigger at 31.2%; issuer and Arbitrum source chain identified as USD.AI (Fluid holds ~2/3 of supply, extreme illiquidity); LayerZero burn/mint path verified on canonical Arbitrum and Ethereum, with a 3-of-3 DVN / 15-confirmation canonical mint route, 3-of-3 Safe owner, and a 10M/hour outbound-only rate limiter that does not cap inbound mint; separate USDai T1 hard-peg oracle finding scoped to its own currently tiny debt; reUSD cross-referenced to its 3.51 Elevated-Risk report; ~37% of lending supply TVL depends on offchain/admin-side value inputs. Collateralization 2.75 → 4.0, Provability 1.0 → 2.5, Dependencies 2.5 → 4.0, Liquidity 2.0 → 2.5; GovernorBravo corrected to 127/135 executed. Minimal → Medium Risk |
