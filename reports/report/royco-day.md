# Protocol Risk Assessment: Royco Day Senior Tranches (sr-reUSDe, proposed sr-liUSD-13w)

- **Assessment Date:** October 19, 2026
- **Onchain Snapshot:** Ethereum block [26229366](https://etherscan.io/block/26229366) (hash `0x54e7e8be31ef0934aadcabc1f6be219a1cda4846b9d9524fd6789a04e50316cc`, October 19, 2026 21:39:47 UTC). DeFiLlama, Morpho API, Immunefi, and Royco docs fetched the same day.
- **Token:** sr-reUSDe (Royco Day Senior Tranche on Re reUSDe). The proposed sibling sr-liUSD-13w (Senior Tranche on InfiniFi liUSD-13w) is assessed in the same report; it is **not deployed** at the snapshot.
- **Chain:** Ethereum
- **Token Address:** [`0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0`](https://etherscan.io/address/0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0)
- **Final Score: 3.77/5.0**
- **Visibility:** Hidden

## Overview + Links

Royco Day is Royco's second tranching deployment. It replaces Royco Dawn, which the docs now label a [legacy deployment](https://docs.royco.org/royco-dawn/legacy-deployment.md); the Dawn-based Senior Vault [srRoyUSDC](royco-srroyusdc.md) is in withdrawal-only wind-down. Each Day market splits one yield-bearing **collateral asset** into up to three tranches ([How Royco Works](https://docs.royco.org/how-royco-works.md)):

- **Senior Tranche (ST):** holds the collateral asset. Protected by any Junior capital, and given a secondary exit through the SLP pool.
- **Junior Tranche (JT):** co-invested first-loss capital. It earns a risk premium from ST yield.
- **Senior Liquidity Provider (SLP / LPT):** owns a Balancer V3 Gyro E-CLP pool that pairs ST shares against a quote stablecoin. It earns a liquidity premium from ST yield.

Each market sets two ratios: **minimum coverage** (JT / collateral NAV) and **minimum liquidity** (LPT value / ST NAV). A Junior tranche is optional ([README](https://github.com/roycoprotocol/royco-day/blob/main/README.md#extended-capabilities)).

**What the Royco team is proposing.** The team asked Yearn to support Morpho USDC lending markets on two Senior tokens. In their words: *"the Senior doesn't provide additional risk coverage, so the underlying exposure would remain the same. The value here is the added liquidity on a higher yielding asset."* The two decks:

| Item | sr-liUSD-13w ([deck](https://docs.google.com/presentation/d/11OjCU4qZbapFZxb_Gu6qfVPJ02qcGxiE/edit)) | sr-reUSDe ([deck](https://docs.google.com/presentation/d/184pmk7JRLm-nSjj_A1NBrmDS6TVKfXT0T-UkMf_yVd8/edit)) |
|---|---|---|
| Underlying | InfiniFi liUSD-13w (first-loss locked iUSD, 13-week unwind) | Re reUSDe (mezzanine reinsurance tranche, quarterly redemption) |
| Status | **Not deployed** (no factory deployment found) | Live "test market" |
| Team-quoted ST yield | 8.59% vs 9.59% on liUSD-13w | 9.82% vs 11.80% on reUSDe |
| Exit pool quote asset | siUSD (proposed) | sUSDe today, reUSD proposed |
| Team-quoted "exit cash" | 11¢ per $1 | 16¢ per $1 |
| Requested Morpho market | sr-liUSD-13w/USDC, LLTV 0.86, then 0.915; oracle "Royco's sr-liUSD-13w NAV feed" | Not specified |

All deck figures are team-supplied (InfiniFi API, Re, and royco.org snapshots from October 1–7, 2026). None of them are verified here except where this report cites an onchain read.

**Bottom line.** Both proposed markets are configured with **0% minimum coverage**: the Senior token carries 100% of the underlying's loss exposure. On top of that exposure, Royco Day adds:

1. A new and complex smart-contract layer, live for about two months.
2. Upgradeable and parameterizable admin control, with a 3-day delay. This contradicts the docs' "markets are IMMUTABLE" statement.
3. An instant 1-of-4 pause that freezes every ST transfer.
4. Unverified oracle adapters on the price path.
5. A secondary exit capped at roughly 10–15% of ST supply. That exit pays a yield-bearing quote token, not USDC.

Above the pool's depth, exit reverts to the underlying's own lock (13 weeks for liUSD-13w, quarterly for reUSDe).

**Key metrics (snapshot):**

- **sr-reUSDe market:**
  - ST supply 18.7527 shares at a share price of 1.00902; ST NAV **$18.92**.
  - Collateral is 13.2041 reUSDe at a reUSDe NAV of $1.43316.
  - JT supply 0. LPT raw NAV **$3.00**.
  - The deployer EOA [`0x7c54033a1298c6225ba141F6B38E4f0f360a8aF2`](https://etherscan.io/address/0x7c54033a1298c6225ba141F6B38E4f0f360a8aF2) holds 16.41 of the 18.75 ST shares (87.5%).
- **All Royco Day markets on Ethereum:** about **$196K** of collateral NAV across 17 deployments. sr-pBedrockStrategies ($170.4K) and sr-liUSD-8w ($25.8K) account for nearly all of it. Two further markets exist on Arbitrum.
- **DeFiLlama Royco V2 (Dawn + Day):** [$17.58M](https://defillama.com/protocol/royco-v2), down from a $25.25M peak on August 6, 2026. This figure is mostly legacy Dawn and vault capital, not Day.
- **Underlyings:**
  - reUSDe supply 20.86M × $1.4332 ≈ $29.9M.
  - liUSD-13w supply 3.506M shares × exchange rate 1.2556 ≈ 4.40M iUSD (`LockingController.exchangeRate(13)`).

**Links:**

- [Royco docs](https://docs.royco.org/royco-overview.md): [How Royco Works](https://docs.royco.org/how-royco-works.md), [Senior Tranche](https://docs.royco.org/senior-tranche.md), [SLP](https://docs.royco.org/liquidity-provider-tranche.md), [Market Dynamics](https://docs.royco.org/market-dynamics.md), [Deposits and Withdrawals](https://docs.royco.org/deposits-and-withdrawals.md), [EntryPoint](https://docs.royco.org/roycoentrypoint.md), [Governance and Fees](https://docs.royco.org/governance-and-fees.md), [Risks](https://docs.royco.org/risk-framework.md), [Key Addresses](https://docs.royco.org/key-addresses.md), [Market Deployment](https://docs.royco.org/market-deployment.md)
- [GitHub: roycoprotocol/royco-day](https://github.com/roycoprotocol/royco-day) and [audits](https://github.com/roycoprotocol/royco-day/tree/main/audit)
- [Immunefi bug bounty](https://immunefi.com/bug-bounty/royco/information/)
- [DeFiLlama: Royco V2](https://defillama.com/protocol/royco-v2)
- Underlying reports: [Re reUSD](re-reusd.md) (covers the reUSDe mezzanine layer) and [InfiniFi](infinifi.md) (covers the liUSD first-loss layer)

## Contract Addresses

All Day contract addresses below are on Ethereum and were read at the snapshot block. Implementations are source-verified on Etherscan unless marked otherwise.

### Protocol Scaffolding (shared by all Day markets)

| Contract | Address | Notes |
|----------|---------|-------|
| RoycoAccessManager | [`0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8`](https://etherscan.io/address/0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8) | OZ AccessManager; authority for every Day contract; owns all beacons; `minSetback()` = 432,000s (5 days) |
| RoycoFactoryGatekeeper | [`0x716fFB13728Aec2F376883d00689679A418537f6`](https://etherscan.io/address/0x716fFB13728Aec2F376883d00689679A418537f6) | Holds `ADMIN` with 0 delay; callable only by the Factory (`onlyFactory`), configures only fresh targets |
| RoycoFactory (ERC1967 proxy) | [`0xaAAaaAAAaE46cA12Bf3810DF8C13c5E8A4400812`](https://etherscan.io/address/0xaAAaaAAAaE46cA12Bf3810DF8C13c5E8A4400812) | Impl [`0x3E051925bdeFBAC937119BB064510ed4C863E532`](https://etherscan.io/address/0x3E051925bdeFBAC937119BB064510ed4C863E532); `executeMarketDeployment` is `PUBLIC` |
| Balancer V3 Market Template | [`0xDA3fd0EFF34f201436F21806A0F2A0B55A5b97f1`](https://etherscan.io/address/0xDA3fd0EFF34f201436F21806A0F2A0B55A5b97f1) | `RoycoDayBalancerV3MarketDeploymentTemplate` |
| RoycoDayEntryPoint (ERC1967 proxy) | [`0xaf55a0c251690d9322b5F94b7e50EE895750262c`](https://etherscan.io/address/0xaf55a0c251690d9322b5F94b7e50EE895750262c) | Impl [`0xf30adF306d453e638785a2319dcE43E110F8E720`](https://etherscan.io/address/0xf30adF306d453e638785a2319dcE43E110F8E720); async deposit/redeem gateway |
| MarketSyncer (ERC1967 proxy) | [`0x387e025306cb1C41fe7AB752D9C04607E03Bb8CE`](https://etherscan.io/address/0x387e025306cb1C41fe7AB752D9C04607E03Bb8CE) | Periphery |
| SeniorTranche beacon | [`0xB6862ADa846003E66e2BC2dE1E1ACc4687F2Ccb3`](https://etherscan.io/address/0xB6862ADa846003E66e2BC2dE1E1ACc4687F2Ccb3) | → [`0x029b8117Fd9BE010E32B19D7d9E35dCa9e44AE6e`](https://etherscan.io/address/0x029b8117Fd9BE010E32B19D7d9E35dCa9e44AE6e) (`RoycoSeniorTranche`); `upgradeTo` = `ADMIN_UPGRADER` |
| JuniorTranche beacon | [`0x19C3aF06eC541FAB8Fdf0c6a526715Bb5679c266`](https://etherscan.io/address/0x19C3aF06eC541FAB8Fdf0c6a526715Bb5679c266) | → [`0xaE2ce905230B0cd11Dd0d6eb09be5881F4bE2237`](https://etherscan.io/address/0xaE2ce905230B0cd11Dd0d6eb09be5881F4bE2237) |
| LPTranche beacon | [`0x97503cA6EC760866852E299DAE7Ce2a98cf05E7B`](https://etherscan.io/address/0x97503cA6EC760866852E299DAE7Ce2a98cf05E7B) | → [`0x8CC25B62251D96CBFCe61aF89a97d61E0E84FCC8`](https://etherscan.io/address/0x8CC25B62251D96CBFCe61aF89a97d61E0E84FCC8) |
| Kernel beacon | [`0x2bf9FA23f038057249E975213Cf2b31BF8c512D8`](https://etherscan.io/address/0x2bf9FA23f038057249E975213Cf2b31BF8c512D8) | → [`0x20745842191bEF60f9ED0DebdfD166F04f8AbD4d`](https://etherscan.io/address/0x20745842191bEF60f9ED0DebdfD166F04f8AbD4d) (`RoycoDayBalancerV3Kernel`) |
| Accountant beacon | [`0x1be88d8B5696A69378973729523f3a135921854b`](https://etherscan.io/address/0x1be88d8B5696A69378973729523f3a135921854b) | → [`0xB872a1E6F37c66CcE3eB704cC756ea681C0e5B5a`](https://etherscan.io/address/0xB872a1E6F37c66CcE3eB704cC756ea681C0e5B5a) (`RoycoDayAccountant`) |

### sr-reUSDe Market (live test market)

| Contract | Address | Notes |
|----------|---------|-------|
| Senior Tranche (sr-reUSDe) | [`0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0`](https://etherscan.io/address/0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0) | Beacon proxy; 18 decimals; deployed Sep 12, 2026 (block [25962921](https://etherscan.io/block/25962921)) |
| Junior Tranche (jr-reUSDe) | [`0xF59dD0cA5cf69A563936a6ad83F00492c1a46b1D`](https://etherscan.io/address/0xF59dD0cA5cf69A563936a6ad83F00492c1a46b1D) | Supply 0 |
| Liquidity Provider Tranche (lp-reUSDe) | [`0xeabDEFd6E1BB1201284a29F2CCE1013ae227Ea6C`](https://etherscan.io/address/0xeabDEFd6E1BB1201284a29F2CCE1013ae227Ea6C) | Supply 2.9838 |
| Kernel | [`0xD0d180384e2e53b8CB8d40e4e7F629B905359932`](https://etherscan.io/address/0xD0d180384e2e53b8CB8d40e4e7F629B905359932) | Holds collateral, BPT, and idle premium ST shares; ST-leg rate provider for the pool |
| Accountant | [`0x58e6a1EF68ed7b787eE90E93e5377533bf752950`](https://etherscan.io/address/0x58e6a1EF68ed7b787eE90E93e5377533bf752950) | Coverage/liquidity, NAV, premiums |
| Exit pool (Gyro E-CLP, `sr-reUSDe/sUSDe`) | [`0x469967348F006B2a4FDFb6e0761386670910c389`](https://etherscan.io/address/0x469967348F006B2a4FDFb6e0761386670910c389) | Balancer V3 Vault [`0xbA1333333333a1BA1108E8412f11850A5C319bA9`](https://etherscan.io/address/0xbA1333333333a1BA1108E8412f11850A5C319bA9) |
| Collateral asset oracle (Royco adapter) | [`0xF8aAd4D54E31EE811Fdc545C7A54D3D624840084`](https://etherscan.io/address/0xF8aAd4D54E31EE811Fdc545C7A54D3D624840084) | **Unverified on Etherscan and Sourcify**; `description()` = "reUSDe NAV / USD (18 decimals)"; `FEED_STALENESS_THRESHOLD_SECONDS()` = 129,600 (36h) |
| Upstream feed (Re `NAVFeedProxy`) | [`0x0B2A5b2765cf964988c59897E4d888DE7035D7B0`](https://etherscan.io/address/0x0B2A5b2765cf964988c59897E4d888DE7035D7B0) | Answer 1.433161; updated October 18, 2026 23:45 UTC (about 22h before the snapshot) |
| JT YDM (`FixedYDM`) | [`0x2DeCecd7bbA7D7c4Ac13af8ED0685561B3FA9C03`](https://etherscan.io/address/0x2DeCecd7bbA7D7c4Ac13af8ED0685561B3FA9C03) | `maxJTYieldShareWAD` = 0 |
| LPT YDM (`AdaptiveCurveYDM_V2`) | [`0x45E254ec0CB393fA9818A5cC61dCD0c9d63529CC`](https://etherscan.io/address/0x45E254ec0CB393fA9818A5cC61dCD0c9d63529CC) | `maxLPTYieldShareWAD` = 30% of ST yield |
| Collateral: reUSDe | [`0xdDC0f880ff6e4e22E4B74632fBb43Ce4DF6cCC5a`](https://etherscan.io/address/0xdDC0f880ff6e4e22E4B74632fBb43Ce4DF6cCC5a) | See [Re report](re-reusd.md) |
| Quote: sUSDe | [`0x9D39A5DE30e57443BfF2A8307A4256c8797A3497`](https://etherscan.io/address/0x9D39A5DE30e57443BfF2A8307A4256c8797A3497) | Ethena staked USDe |

There are two further deployments labelled sr-reUSDe and two labelled sr-reUSDe-test (Senior tokens [`0x455aD9e031236Bc3A0578e2b0e9302D9e70F7eAC`](https://etherscan.io/address/0x455aD9e031236Bc3A0578e2b0e9302D9e70F7eAC), [`0x787B643e4F49ae158363ecc8530BBdbd83F822D8`](https://etherscan.io/address/0x787B643e4F49ae158363ecc8530BBdbd83F822D8), [`0x44E4fA94EF48aF84C9bE556F0263554D0EF4FC70`](https://etherscan.io/address/0x44E4fA94EF48aF84C9bE556F0263554D0EF4FC70), [`0x87A9CC8ee891a501868F323480F93dC4259647F8`](https://etherscan.io/address/0x87A9CC8ee891a501868F323480F93dC4259647F8)). Each holds under $10 and has different parameters. **A lending integration must pin one exact Senior token address.** Symbols are not unique, because market deployment is permissionless.

### sr-liUSD-13w (proposed) and the Live Sibling sr-liUSD-8w

No factory `MarketDeploymentCompleted` event creates an sr-liUSD-13w market (17 Ethereum deployments scanned through the snapshot block). Its configuration (coverage, liquidity, oracle, pool, delays) is therefore **TODO: unknown until deployed**. The deck states a 10% exit pool holding siUSD and 0% coverage.

The live sibling, sr-liUSD-8w, shows how an InfiniFi market is wired today:

| Contract | Address | Notes |
|----------|---------|-------|
| Senior Tranche (sr-liUSD-8w) | [`0x28dE32dFe05bC5FDFAF1881bd115fa998C9a179E`](https://etherscan.io/address/0x28dE32dFe05bC5FDFAF1881bd115fa998C9a179E) | ST NAV $609; same Senior beacon |
| Kernel | [`0x5DBE1e257b23780BCbd0433E836aCe31a3F824C0`](https://etherscan.io/address/0x5DBE1e257b23780BCbd0433E836aCe31a3F824C0) | Collateral 20,739 liUSD-8w; quote USDC |
| Accountant | [`0x986E1D8cdE91ad84329eb08D9D8E9486FfF4B782`](https://etherscan.io/address/0x986E1D8cdE91ad84329eb08D9D8E9486FfF4B782) | **15% coverage, 0% liquidity** (the inverse of the sr-reUSDe configuration); JT NAV $25,178 |
| Collateral asset oracle (Royco adapter) | [`0x743b10203875CC3EA451F5ECC95284CC881E8b27`](https://etherscan.io/address/0x743b10203875CC3EA451F5ECC95284CC881E8b27) | **Unverified**; staleness threshold 90,000s |
| Upstream feed (`ChainlinkLPTOracleNoK`, InfiniFi) | [`0xAA7Ed7489721C832B9D5A1d4C620acFbbD87F802`](https://etherscan.io/address/0xAA7Ed7489721C832B9D5A1d4C620acFbbD87F802) | `price = LockingController.exchangeRate(8) × Accounting.price(iUSD)`; `updatedAt = block.timestamp` always; references settable by InfiniFi `GOVERNOR` |
| liUSD-13w token (proposed collateral) | [`0xbd3f9814eB946E617f1d774A6762cDbec0bf087A`](https://etherscan.io/address/0xbd3f9814eB946E617f1d774A6762cDbec0bf087A) | Bucket 13 of LockingController [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) |

### Governance Addresses

| Role | Address | Type |
|------|---------|------|
| Root `ADMIN` (3-day execution delay); `GUARDIAN`; `ADMIN_UNPAUSER`; `ADMIN_FACTORY`; `ADMIN_ORACLE`; `ADMIN_ENTRY_POINT_CLAIM_FEE` | [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997) | Safe v1.4.1, 3-of-4 |
| Protocol admin: `ADMIN_UPGRADER`, `ADMIN_ORACLE`, `ADMIN_KERNEL`, `ADMIN_MARKET_OPS`, `ADMIN_ACCOUNTANT`, `ADMIN_PROTOCOL_FEE_SETTER`, `ADMIN_FACTORY` (each with a 3-day delay); `ADMIN_ENTRY_POINT` (1-day delay); `ADMIN_BALANCER_POOL_MANAGER`, `LP_ROLE_ADMIN` (no delay) | [`0x84d37A25e46029CE161111420E07cEb78880119e`](https://etherscan.io/address/0x84d37A25e46029CE161111420E07cEb78880119e) | Safe v1.4.1, 3-of-4 |
| `ADMIN_PAUSER` (no delay) | [`0xC7605B1891B449B0051d55D083B49D6b46D164bb`](https://etherscan.io/address/0xC7605B1891B449B0051d55D083B49D6b46D164bb) | Safe v1.4.1, **1-of-4** |
| `GUARDIAN` (cancels scheduled operations) | [`0xc5Df006FA0647EFF1A55CCF5749ce17772F4d8CB`](https://etherscan.io/address/0xc5Df006FA0647EFF1A55CCF5749ce17772F4d8CB) | Safe v1.4.1, 1-of-4 |
| `LP_ROLE_ADMIN` (no delay) | [`0xb2B80EBcb7EE285806ddcB26E84a444032D1c244`](https://etherscan.io/address/0xb2B80EBcb7EE285806ddcB26E84a444032D1c244) | Safe v1.4.1, 1-of-4 |
| Protocol fee recipient | [`0x05ea95aE815809D77153Ed3500Ad6d936712b639`](https://etherscan.io/address/0x05ea95aE815809D77153Ed3500Ad6d936712b639) | Safe v1.4.1, 2-of-3 |

## Audits and Due Diligence Disclosures

The Day codebase ([royco-day](https://github.com/roycoprotocol/royco-day)) is a rewrite of Dawn (repository commit `c006198` "dawn → day", July 7, 2026). It has seven published reviews in [`audit/`](https://github.com/roycoprotocol/royco-day/tree/main/audit):

| Reviewer | Type | Date (repo commit) | Findings | Status |
|----------|------|--------------------|----------|--------|
| [Hexens](https://github.com/roycoprotocol/royco-day/blob/main/audit/Hexens-Royco-Day.pdf) | Manual, 1 week | Aug 6, 2026 | 0 C / 0 H / 0 M / 6 L / 1 I | All fixed |
| [Certora](https://github.com/roycoprotocol/royco-day/blob/main/audit/Certora-Royco-Day.pdf) | Manual | Aug 9, 2026 | 1 H / 11 M / 14 L (+ Info) | 1/1 H, 10/11 M, 9/14 L fixed |
| [Tomer Ganor](https://github.com/roycoprotocol/royco-day/blob/main/audit/Tomer-Royco-Day.pdf) | Manual (latest commit reviewed `92f05aed`) | Aug 10 / Aug 20, 2026 | **1 Critical / 7 High** / 7 M / 8 L / 10 I | All 33 fixed |
| [Cyfrin Solace](https://github.com/roycoprotocol/royco-day/blob/4eac294e055660d98cc89d14670fd3dd3aa37951/audit/Cyfrin-Solace-Royco-Day.md) | Automated review | Aug 14, 2026 | 0 C/H/M / 8 L / 4 I | Triaged |
| [Certora Autoprover](https://github.com/roycoprotocol/royco-day/blob/main/audit/Certora-Autoprover-Royco-Day.pdf) | Formal verification (53 properties, 92 CVL rules) | Aug 19, 2026 | 18 violated-rule issues (several Medium) | See report |
| [Olympix BugPoCer](https://github.com/roycoprotocol/royco-day/blob/main/audit/Olympix-Royco-Day.pdf) | Automated | — | Medium/Low true positives | See report |
| [Cantina competition](https://github.com/roycoprotocol/royco-day/blob/main/audit/Cantina-Royco-Day.pdf) | Competitive | Aug 28, 2026 | 0 H / 1 M / 6 I | — |

**Deployed code vs. audited code:** the verified sources of the deployed Accountant, Kernel, and VaultTranche implementations hash-match repository commit `92f05aed` (August 15, 2026, "fix/factory-params"). That commit is the latest one Tomer Ganor reviewed, and it is also the current `main` for those files. The repository changes after it (September 2026) add new oracle adapters only: Discrete/IdleCDO and Stork. No published review covers them. The two collateral oracle adapters live in the markets assessed here are **unverified bytecode**, so they cannot be matched to any reviewed source.

**Open items:**
- Certora left 1 Medium and 5 Low findings unfixed.
- Several findings concern admin parameter setters: Certora M-05, "minimum coverage updates can create unearned liquidation bonuses"; Tomer M-03, "`setMinCoverage` lacks post-update safety check"; Solace L-1, "`setDustTolerance` has no upper bound". These matter because the parameters are mutable (see [Governance](#governance)).

**Smart contract complexity: High.** The system comprises:
- three tranche types and a kernel with modular liquidity-venue logic (Balancer V3 E-CLP with BPT oracle and premium reinvestment);
- an accountant with junior-first loss waterfall, fixed-term state machine, and liquidation regime;
- adaptive YDMs, an async EntryPoint with request pricing and oracle gating, a blacklist/sanctions overlay, beacon proxies, and a factory/template/gatekeeper role graph.

### Bug Bounty

- **Platform:** [Immunefi](https://immunefi.com/bug-bounty/royco/information/). Maximum $250,000, KYC required, PoC required. Live since February 17, 2026; last updated August 12, 2026.
- **Scope:** the [assets-in-scope list](https://immunefi.com/bug-bounty/royco/scope/) names Dawn contracts (srRoyUSDC, Multisig Strategy, Dawn factories on ETH/ARB/AVAX, Makina strategy). It does **not** list the Day Factory or EntryPoint. The Day audits were added as resources on August 11, 2026, and "Primacy of Impact" is in scope, so Day vulnerabilities are likely eligible. Explicit Day asset coverage is unconfirmed.
- The program treats whitelisted parties as trusted. Funds sent to whitelisted addresses are considered recoverable, so admin misbehavior is out of scope.

### Safe Harbor

Royco is not listed on the [SEAL Safe Harbor registry](https://safeharbor.securityalliance.org/).

## Historical Track Record

- **Day in production:** the AccessManager and Factory went live on August 15, 2026 (block [25759227](https://etherscan.io/block/25759227)). The sr-reUSDe market launched September 12, 2026, and sr-liUSD-8w on September 5, 2026. That is about 65 days for Day and 37 days for sr-reUSDe.
- **Scale:** about $196K of collateral NAV across all Ethereum Day markets. sr-reUSDe ST NAV is **$18.92**, and 87.5% of its ST is held by the deployer EOA. There is no meaningful production TVL behind any Senior token proposed as collateral.
- **Predecessor (Dawn):** live since January 6, 2026, with no exploits found. The docs now flag a [known accounting limitation](https://docs.royco.org/royco-dawn/legacy-deployment.md): Dawn can clear a Junior impermanent-loss balance before Junior is fully restored. Dawn's flagship vault srRoyUSDC is in withdrawal-only wind-down (see [srRoyUSDC report](royco-srroyusdc.md)).
- **Incidents:** none found for Day.
- **TVL trend:** DeFiLlama Royco V2 fell from $25.25M (August 6, 2026) to $17.58M (October 19, 2026), consistent with the Dawn wind-down.
- **Peg:** sr-reUSDe has no market price history. The E-CLP pool has traded only dust.

## Funds Management

A Royco Day Senior token is an ERC-4626-style claim on a kernel-held pool of one collateral asset. With 0% coverage, its effective NAV equals the collateral NAV less premiums and fees: **every unit of underlying loss passes through 1:1**. The kernel does not delegate collateral anywhere else. It holds the collateral token directly, and LPT capital sits in the Balancer pool.

### Accessibility

- **Entry and exit go through the EntryPoint.** `requestDeposit`, `requestRedemption`, and `execute*` are `PUBLIC`. The tranche's own `deposit` and `redeem` require `ST_LP_ROLE`, which is held by:
  - the EntryPoint;
  - root Safe [`0x7c405bbD131e42af506d14e752f2e59B19D49997`](https://etherscan.io/address/0x7c405bbD131e42af506d14e752f2e59B19D49997);
  - Makina caliber [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://etherscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083);
  - EOA [`0x8A25d8C9fa8C7A726137f2D618d85CbC2C083F78`](https://etherscan.io/address/0x8A25d8C9fa8C7A726137f2D618d85CbC2C083F78), which can therefore bypass the EntryPoint delay and oracle gate.
- **sr-reUSDe EntryPoint config** (`getTrancheConfig`): enabled; deposit delay 300s; **redemption delay 86,400s (T+1)**; `gateByOracleUpdate = true`. A redemption executes only after the reUSDe NAV feed posts a new update following the request.
- **Request pricing** ([EntryPoint docs](https://docs.royco.org/roycoentrypoint.md)): requests are priced at submission. Yield during the delay is forfeited to the protocol, and losses still pass through.
- **Redemption is in kind.** ST holders receive the collateral asset (reUSDe or liUSD-13w), not USDC. ST redemption is available whenever the market is `PERPETUAL`. Both proposed configurations have `fixedTermDuration = 0`, so they are always `PERPETUAL`.
- **Secondary exit:** sell ST into the E-CLP pool for the quote asset (sUSDe today).
- **KYC/blacklist:** no market blacklist is set (`roycoBlacklist = 0x0`). Admin can set one via `setRoycoBlacklist` (`ADMIN_MARKET_OPS`, 3-day delay). Once set, every mint, transfer, and burn screens the caller, sender, and receiver against it and the Chainalysis sanctions list.
- **Fees:** ST protocol fee 0%; protocol fee of 5% on the JT and LPT yield shares (`jtYieldShareProtocolFeeWAD` = `lptYieldShareProtocolFeeWAD` = 5e16).

### Token Mint Authority

**Mint mechanism:** kernel-only. `RoycoVaultTranche.kernelMint`, `mintProtocolFeeShares`, and `RoycoSeniorTranche.mintLiquidityPremiumShares` are `onlyKernel`. The kernel address is fixed per tranche, so this is not an AccessManager role.

**Mint requires backing:** Yes for deposits. `RoycoVaultTranche.deposit` transfers collateral to the kernel (`safeTransferFrom(msg.sender, kernel, assets)`) before the kernel prices and mints shares in the same transaction ([DepositLogic](https://github.com/roycoprotocol/royco-day/blob/main/src/libraries/logic/DepositLogic.sol)). Liquidity-premium and protocol-fee shares are minted without new collateral. They re-split existing ST appreciation: premium shares are credited to the kernel for the LPT, and fee shares go to the fee recipient. That is the intended cost of the SLP, not unbacked supply.

**Per-address mint authority** (verified onchain at block 26229366, sr-reUSDe Senior token [`0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0`](https://etherscan.io/address/0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0xD0d180384e2e53b8CB8d40e4e7F629B905359932`](https://etherscan.io/address/0xD0d180384e2e53b8CB8d40e4e7F629B905359932) (Kernel) | ✓ | ✓ | `onlyKernel` (`kernelMint` / `kernelBurn`) | Deposits (collateral pulled in the same tx), liquidity premium, protocol fees; burns on redemption |
| `BURNER_ROLE` holders | — | ✓ (own or allowance) | `burn` / `burnFrom` (OZ `ERC20Burnable`, allowance-checked) | **No holder** in the AccessManager role history |
| [`0x84d37A25e46029CE161111420E07cEb78880119e`](https://etherscan.io/address/0x84d37A25e46029CE161111420E07cEb78880119e) (protocol-admin Safe) | Indirect | Indirect | `ADMIN_UPGRADER` on the Senior beacon (3-day delay) | A beacon upgrade can replace the logic of every Senior token at once |

**Rate limits / supply caps:** ST deposits are bounded by `maxSTDeposit`, the minimum of the coverage and liquidity constraints. sr-reUSDe has a 0% coverage requirement, so only the 15% liquidity requirement binds.

**Backing check at mint time:** atomic for deposits. Premium and fee mints are accounting re-splits.

### Collateralization

- **Backing is 100% the collateral asset, held by the kernel.** The kernel's ledger reconciles exactly to its token balances at the snapshot: `totalCollateralAssets` = `reUSDe.balanceOf(kernel)` = 13.204084657860805637; BPT and idle-ST ledgers also match.
- **Coverage is 0%** for sr-reUSDe: `minCoverageWAD` = 0, JT supply 0, `maxJTYieldShareWAD` = 0. The deck states the same for sr-liUSD-13w. The protective feature of a Senior tranche is absent by design, so **ST loss = underlying loss**.
- **Collateral quality is the underlying's, at a junior position in its own capital structure:**
  - **reUSDe** is Re's mezzanine / second-loss tranche. It absorbs reinsurance losses after Re Capital and ahead of reUSD. Redemption is quarterly with an actuarial gate. Backing is custodied largely at plain EOAs, and the ICL wallet attributed to reUSDe held about $2.87M of sUSDe as of September 2026 ([Re report](re-reusd.md#capital-structure-reusde-mezzanine--second-loss-tranche)).
  - **liUSD-13w** is InfiniFi's first-loss locked capital. It absorbs losses before siUSD. About 84% of InfiniFi TVL is offchain-custodied credit (Midas/Fasanara mGLOBAL and RWA escrows), and the Midas position alone was 1.57× the entire liUSD buffer as of July 2026 ([InfiniFi report](infinifi.md)). The deck itself states "Most of the book can't be exited quickly. $5.75M is liquid."
- **Protected Exit and self-liquidation bonus** only operate when there is JT capital. They are inert in both proposed markets (`stSelfLiquidationBonusWAD` = 0; `coverageLiquidationUtilizationWAD` = `type(uint256).max` on sr-reUSDe).
- **Admin can change risk parameters after deployment** (`ADMIN_ACCOUNTANT`, 3-day delay): `setMinCoverage`, `setMinLiquidity`, `setFixedTermDuration`, `setLiquidationCoverageUtilization`, `setMaxYieldShares`, the YDM setters, and `setDustTolerance`. This contradicts the docs' "Royco markets are IMMUTABLE" ([Market Deployment](https://docs.royco.org/market-deployment.md)). In particular, `setMinLiquidity(0)` would remove the SLP withdrawal floor and let SLP capital leave the exit pool entirely.

### Provability

- **Holdings are fully onchain and verifiable in real time.** `kernel.getState()` and `accountant.getState()` expose collateral, LPT assets, NAVs, coverage, and liquidity, and ST `convertToAssets()` returns the claim.
- **The value of the collateral is not computed by Royco.** It comes from the collateral asset oracle:
  - **sr-reUSDe:** the Royco adapter (**unverified source**) reads Re's `NAVFeedProxy`. That feed is an admin-pushed NAV ("reUSDe NAV / USD"), last updated about 22 hours before the snapshot, and the adapter's staleness threshold is 36 hours. reUSDe NAV reflects Re's offchain reinsurance accounting, which this report cannot verify independently ([Re report](re-reusd.md)).
  - **sr-liUSD-8w (template for 13w):** the Royco adapter (**unverified**) reads InfiniFi's `ChainlinkLPTOracleNoK`, which computes `LockingController.exchangeRate × Accounting.price(iUSD)` onchain. Because it always reports `updatedAt = block.timestamp`, the adapter's 25-hour staleness check can never trip. The liUSD exchange rate falls only when InfiniFi books a loss (`LockingController` `LossesApplied`), and offchain RWA marks reach it through InfiniFi's attestation flow ([InfiniFi report](infinifi.md)).
- **Oracle replaceability:** `setCollateralAssetOracle` (`ADMIN_ORACLE`, held by the protocol-admin Safe and the root Safe, 3-day delay) can repoint any market's price source.
- **Exit-pool depth is provable onchain:** `pool.getCurrentLiveBalances()` and `accountant.getState().lastLPTRawNAV`.

## Liquidity Risk

**Exit paths for an sr-reUSDe holder:**

1. **Sell into the exit pool (instant).**
   - Pool [`0x469967348F006B2a4FDFb6e0761386670910c389`](https://etherscan.io/address/0x469967348F006B2a4FDFb6e0761386670910c389) holds live balances (`getCurrentLiveBalances()`) of 0.3056 ST-value and **2.6973 USDe-value of sUSDe**, with a 0.10% swap fee.
   - E-CLP price bounds are α = 0.85 and β = 1.0025. ST can be sold down to a 15% discount before the sUSDe leg is exhausted.
   - Today's maximum instant exit is therefore **≈ $2.70 of sUSDe**, about 14% of ST NAV. That matches the deck's "16¢ per $1" once the ST inventory is counted.
2. **Redeem in kind (T+1 plus the next oracle update).** The holder receives reUSDe, which redeems only quarterly. The request window is the first 72 hours of each quarter, payouts are pro-rata against "Available Surplus", and unfilled balances roll forward ([Re report](re-reusd.md)). reUSDe has one Morpho market ([`0x904142eb…`](https://app.morpho.org/ethereum/market/0x904142eba80012455c361f3c442b9c89c0dd0fb86c7d8f062c4425bfa2314eb9)): USDC loan, 77% LLTV, $146K supplied.

**Why the liquidity requirement does not guarantee cash depth:**
- The requirement is `LPT_RAW_NAV ≥ ST_EFFECTIVE_NAV × minLiquidity`. LPT raw NAV values *both* pool legs through the BPT oracle ([README](https://github.com/roycoprotocol/royco-day/blob/main/README.md#minimum-liquidity-requirement)).
- When ST holders sell, the pool converts quote into ST at a discount, but LPT raw NAV (ST marked at NAV) barely moves. The floor stays satisfied while the **quote leg is drained**.
- After that, the only remaining exit is in-kind redemption into the underlying. In a stress event this is exactly when the pool would be emptied.
- The SLP is path-dependent and loses in a realized drawdown ([docs](https://docs.royco.org/how-royco-works.md)). That makes LPs more likely to rebalance away or wait than to add depth.

**Structural cap on instant exit:** at most about `minLiquidity` (10% proposed for liUSD, 15% for reUSDe) of ST NAV, paid in a yield-bearing quote token:
- **sUSDe** has a 7-day Ethena cooldown, or a DEX sale.
- **siUSD** redeems through InfiniFi's instant bucket ($5.45M as of July 2026), then a FIFO queue.

**Lending-collateral implication (the team's proposal):**
- A liquidator seizing sr-liUSD-13w can sell into the pool for siUSD up to the pool's quote depth. Past that point, it must redeem to liUSD-13w and start a **13-week unwind**. The deck says the same: "Past the pool, sr-liUSD-13w redeems into liUSD-13w and a 13-week unwind."
- A liquidation incentive of a few percent cannot compensate a 13-week lock on first-loss capital. Collateral above the pool's depth is therefore effectively non-liquidatable in stress.
- Liquidation demand would coincide with InfiniFi-driven markdowns, which are the same events that drain the pool.
- At the proposed LLTVs, that is a direct bad-debt path for lenders.
- **The pause path:** `ADMIN_PAUSER` (1-of-4 Safe, no delay) can pause the kernel. `preTrancheBalanceUpdateHook` is `whenNotPaused`, so a pause freezes every ST transfer, including Morpho collateral seizure and withdrawal. Unpause requires the 3-of-4 root Safe, and pauses have no maximum duration.

**Holder concentration:** 87.5% of sr-reUSDe is held by the deployer EOA [`0x7c54033a1298c6225ba141F6B38E4f0f360a8aF2`](https://etherscan.io/address/0x7c54033a1298c6225ba141F6B38E4f0f360a8aF2), 10.6% by a contract-wallet holder [`0x0197d7FaFCA118Bc91f6854B9A2ceea94E676585`](https://etherscan.io/address/0x0197d7FaFCA118Bc91f6854B9A2ceea94E676585), and 1.6% by the Balancer Vault.

## Centralization & Control Risks

### Governance

**Access control.** Every Day contract uses [RoycoAccessManager](https://etherscan.io/address/0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8) (OpenZeppelin AccessManager). Role holders were reconstructed from all `RoleGranted`/`RoleRevoked` events through the snapshot block (1,237 logs) and function mappings from `TargetFunctionRoleUpdated`.

| Power | Role → holder | Delay | Effect on Senior holders |
|-------|---------------|-------|--------------------------|
| Upgrade every ST/JT/LPT/Kernel/Accountant (beacons) and the Factory/EntryPoint (UUPS) | `ADMIN_UPGRADER` → protocol-admin Safe (3/4) | 3 days | Arbitrary logic change across all markets at once |
| Replace collateral oracle / BPT oracle | `ADMIN_ORACLE` → protocol-admin Safe and root Safe | 3 days | Re-marks ST NAV |
| Change coverage, liquidity, fixed term, YDMs, dust tolerance | `ADMIN_ACCOUNTANT` / `ADMIN_MARKET_OPS` → protocol-admin Safe | 3 days | Can remove the SLP floor (`setMinLiquidity(0)`) |
| Set market blacklist | `ADMIN_MARKET_OPS` → protocol-admin Safe | 3 days | Can freeze specific holders, including a lending venue |
| Modify EntryPoint tranche configs (enable flag, delays, expiry, oracle gate) | `ADMIN_ENTRY_POINT` → protocol-admin Safe | **1 day** | Can disable EntryPoint redemption or set a long redemption delay |
| Pause kernel, tranches, accountant, EntryPoint, Factory | `ADMIN_PAUSER` → **1-of-4 Safe** | **None** | Freezes all ST transfers and redemptions, with no time limit |
| Unpause | `ADMIN_UNPAUSER` → root Safe (3/4) | None | — |
| Grant direct-deposit/redeem LP roles | `LP_ROLE_ADMIN` → protocol-admin Safe and a 1-of-4 Safe | None | Lets addresses bypass the EntryPoint delay and oracle gate |
| Cancel scheduled operations | `GUARDIAN` → root Safe and a 1-of-4 Safe | — | Protective |
| Root `ADMIN` (grant any role, set function roles) | Root Safe (3/4) | 3 days; 5-day `minSetback` to reduce delays | — |

- **Timelock:** all upgrade, oracle, parameter, and role paths are scheduled through the AccessManager with a ≥3-day execution delay. The exceptions are the EntryPoint config (1 day) and pause and LP-role grants (none). The delay is enforced onchain by the AccessManager.
- **Pending operation:** at the snapshot, one scheduled operation was still unexecuted: `removeBaseToken(address)` on the srRoyUSDC Makina caliber [`0x5476F4E23dAA093Ce6700e1026013c55F7AF9083`](https://etherscan.io/address/0x5476F4E23dAA093Ce6700e1026013c55F7AF9083), scheduled by the protocol-admin Safe and executable since October 1, 2026. It does not touch Day markets.
- **Safe structure:**
  - The root Safe is 3-of-4. Its owners are the protocol-admin Safe (3-of-4), a separate 1-of-4 Safe [`0xC4F2b2e9fbD1A121E5A7D176c90224D398eba6BD`](https://etherscan.io/address/0xC4F2b2e9fbD1A121E5A7D176c90224D398eba6BD), and two EOAs, with no signer overlap between those three groups.
  - The 1-of-4 pauser Safe has the same four signers as the protocol-admin Safe, so any one of them can pause alone.
  - The 1-of-4 guardian and LP-role Safes share the root Safe's four owners.
  - Signers are not publicly attributed.
  - Three of the root Safe's four owners also own the Dawn-era Owner Safe [`0x85de42e5697d16b853ea24259c42290dace35190`](https://etherscan.io/address/0x85de42e5697d16b853ea24259c42290dace35190).
- **Docs vs. chain:** the docs say Day markets are immutable and that critical changes are timelocked. The timelock claim holds, apart from the EntryPoint config and pause, but market parameters, oracles, and implementations are all mutable.

### Programmability

- ST/JT/LPT accounting, loss waterfall, premiums, fee accrual, coverage/liquidity enforcement, and the E-CLP venue are fully onchain and programmatic. `syncTrancheAccounting` and `reinvestLiquidityPremium` are `PUBLIC`.
- The NAV input is external. reUSDe NAV is admin-pushed by Re. liUSD is InfiniFi-computed onchain, but its losses reach it only through InfiniFi's loss-booking and attestation process.
- The EntryPoint is asynchronous (T+1 plus an oracle update) and relies on public keepers, with an optional executor bonus.
- The Morpho oracle proposed for sr-liUSD-13w ("Royco's sr-liUSD-13w NAV feed") does not exist yet. **TODO:** its address, source, and verification are needed before listing.

### External Dependencies

1. **Underlying issuer (critical, single point of failure).** The Senior token is a pass-through of reUSDe (Re) or liUSD-13w (InfiniFi), with zero subordination. Any impairment, NAV error, redemption gate, or upgrade at the issuer flows directly to ST.
2. **Royco collateral oracle adapters (critical, unverified bytecode)** and the issuers' upstream feeds.
3. **Balancer V3 (blue chip)** for the exit pool: the Vault, the Gyro E-CLP pool, and the LP oracle.
4. **Quote asset:** sUSDe (Ethena) for sr-reUSDe; siUSD (InfiniFi, i.e. the same issuer as the collateral) proposed for sr-liUSD-13w. The latter concentrates both the collateral and the exit cash on one counterparty.
5. **Keepers** for EntryPoint execution, oracle pokes, and premium reinvestment. These are permissionless.

## Operational Risk

- **Team:** Royco was founded by Jai Bhavnani (formerly Rari Capital), and the Royco Foundation governs the protocol ([Governance and Fees](https://docs.royco.org/governance-and-fees.md)). A Series A led by Electric Capital is reported in the [FAQ](https://docs.royco.org/faq.md). The repository has active development (oracle adapters were added in September 2026).
- **Documentation:** good conceptual coverage with videos and a glossary, plus a public simulator. However:
  - it is **inconsistent with the deployed system**: it calls markets "IMMUTABLE" (they are not), and its Risks page still cites "Concrete Earn v2" vault audits as Day mitigants;
  - it does not explain that the liquidity floor counts ST inventory;
  - it does not document the market-level admin role map.
- **Market creators:** market deployment is permissionless at the contract level (`executeMarketDeployment` is `PUBLIC`). Frontend listing is limited to approved creators (R13N, Xerberus, Concrete, Tulipa, Dialectic), and per-market risk parameters are chosen by the creator. Royco markets share symbols, so integrators must pin addresses.
- **Legal:** Royco Foundation. U.S. persons excluded. **TODO:** jurisdiction and entity details for the Foundation are not published in the docs.
- **Incident response:** Hypernative monitoring and an "emergency response plan" are claimed ([Security and Audits](https://docs.royco.org/security-and-audits.md)) but not published.

## Monitoring

### Contracts and Getters

| Contract | Address | What to watch |
|----------|---------|---------------|
| sr-reUSDe Senior Tranche | [`0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0`](https://etherscan.io/address/0x01Fe8a0d76D056393d24CC1402f7f852cdaFbAD0) | `totalSupply()`, `convertToAssets(1e18).nav` (share price, baseline 1.00902), `Paused`/`Unpaused` |
| sr-reUSDe Kernel | [`0xD0d180384e2e53b8CB8d40e4e7F629B905359932`](https://etherscan.io/address/0xD0d180384e2e53b8CB8d40e4e7F629B905359932) | `getState()` (collateral, oracle, blacklist, LPT assets), `queryCollateralAssetOracle()`, events `CollateralAssetOracleUpdated`, `RoycoBlacklistUpdated`, `Paused` |
| sr-reUSDe Accountant | [`0x58e6a1EF68ed7b787eE90E93e5377533bf752950`](https://etherscan.io/address/0x58e6a1EF68ed7b787eE90E93e5377533bf752950) | `getState()`: `minCoverageWAD` (0), `minLiquidityWAD` (0.15), `fixedTermDurationSeconds` (0), `lastMarketState` (0), `lastCollateralNAV`, `lastSTEffectiveNAV`, `lastLPTRawNAV`; events `MinLiquidityUpdated`, `MinCoverageUpdated`, YDM/fee updates |
| Exit pool (E-CLP) | [`0x469967348F006B2a4FDFb6e0761386670910c389`](https://etherscan.io/address/0x469967348F006B2a4FDFb6e0761386670910c389) | `getCurrentLiveBalances()`: the quote-leg share of the pool is the real exit cash |
| reUSDe NAV feed | [`0x0B2A5b2765cf964988c59897E4d888DE7035D7B0`](https://etherscan.io/address/0x0B2A5b2765cf964988c59897E4d888DE7035D7B0) | `latestRoundData()` answer and `updatedAt` |
| RoycoAccessManager | [`0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8`](https://etherscan.io/address/0x82EecE4a736db0767370d2DfFdE9BDF6e38AaeB8) | `OperationScheduled`/`Executed`/`Canceled`, `RoleGranted`/`RoleRevoked`, `TargetFunctionRoleUpdated`, `RoleGrantDelayChanged` |
| Beacons (ST/JT/LPT/Kernel/Accountant) | see [Contract Addresses](#protocol-scaffolding-shared-by-all-day-markets) | `Upgraded` |
| EntryPoint | [`0xaf55a0c251690d9322b5F94b7e50EE895750262c`](https://etherscan.io/address/0xaf55a0c251690d9322b5F94b7e50EE895750262c) | `getTrancheConfig(ST)`, tranche config modification events, `Upgraded` |
| Governance Safes | root, protocol-admin, pauser (addresses above) | Owner and threshold changes; any pauser transaction |

### Thresholds and Alerts

- **Critical (immediate):**
  - any `Paused` on the kernel or Senior tranche;
  - any `OperationScheduled` targeting a beacon `upgradeTo`, `setCollateralAssetOracle`, `setMinLiquidity`/`setMinCoverage`, `setRoycoBlacklist`, or `modifyTrancheConfigs` (each gives 1–3 days of notice);
  - share price (`convertToAssets(1e18).nav`) decreasing.
- **High:**
  - pool quote-leg value below 50% of `minLiquidity × ST NAV` (the floor being met with ST inventory instead of cash);
  - reUSDe NAV feed `updatedAt` older than 30h (the adapter reverts at 36h, which halts EntryPoint execution);
  - `lastMarketState` ≠ 0.
- **Underlying:** apply the monitoring in the [Re](re-reusd.md#monitoring) and [InfiniFi](infinifi.md#monitoring) reports. For liUSD markets, alert on `LockingController` `LossesApplied`.
- **Frequency:** hourly for state, oracle, and pool; real-time for AccessManager and pause events.

## Appendix: Contract Architecture

```
┌────────────────────────── GOVERNANCE (RoycoAccessManager 0x82Ee…aeB8) ──────────────────────────┐
│ Root ADMIN Safe 3/4 0x7c40…9997 (3d delay)    Protocol-admin Safe 3/4 0x84d3…119e (3d / EP 1d)   │
│   └ GUARDIAN, UNPAUSER, ORACLE, FACTORY          └ UPGRADER, ORACLE, KERNEL, MARKET_OPS,           │
│                                                    ACCOUNTANT, FEE_SETTER, ENTRY_POINT, LP_ROLE_ADMIN│
│ Pauser Safe 1/4 0xC760…64bb (no delay) ── pause() on kernel/tranches/EP/factory = transfers frozen │
└──────────────┬───────────────────────────────────────────────┬──────────────────────────────────┘
               │ upgradeTo (beacons, 3d)                         │ setters (3d)
               ▼                                                 ▼
┌──────────────────────────── ROYCO DAY MARKET: sr-reUSDe ─────────────────────────────────────────┐
│  RoycoFactory 0xaAAa…0812 (PUBLIC executeMarketDeployment) ──deploys──►                          │
│                                                                                                  │
│  EntryPoint 0xaf55…262c  ──request/execute (T+1, oracle-gated)──►  Senior Tranche sr-reUSDe      │
│                                                                    0x01Fe…bAD0 (ST, 0% coverage)  │
│                                                                          │ onlyKernel mint/burn   │
│  Junior Tranche 0xF59d…6c1D (supply 0)                                   ▼                        │
│  LP Tranche 0xeabD…a6C ── owns BPT ──►  Kernel 0xD0d1…9932 ◄──► Accountant 0x58e6…2950          │
│                                         │  holds 13.2041 reUSDe            min liq 15%, cov 0%    │
│                                         │  ST-leg rate provider                                   │
│                                         ▼                                                         │
│                         Balancer V3 Gyro E-CLP 0x4699…c389  [ST 0.31 | sUSDe 2.70 (USD)]          │
│                         α=0.85 β=1.0025, fee 0.10%                                                │
│                                                                                                  │
│  Collateral oracle adapter 0xF8aA…0084 (UNVERIFIED) ──► Re NAVFeedProxy 0x0B2A…D7B0 (admin NAV)    │
└──────────────────────────────────────────┬───────────────────────────────────────────────────────┘
                                           │ collateral (100% pass-through, no JT buffer)
                                           ▼
┌────────────────────────── UNDERLYING ──────────────────────────┐
│ Re reUSDe 0xdDC0…CC5a — mezzanine reinsurance tranche,          │
│ quarterly redemption, EOA-custodied backing (see re-reusd.md)   │
│ Proposed: InfiniFi liUSD-13w 0xbd3f…087A — first-loss, 13-week   │
│ unwind; exit pool in siUSD (see infinifi.md)                    │
└──────────────────────────────────────────────────────────────────┘

Flow: user → EntryPoint (escrow) → ST.deposit → collateral to Kernel → shares minted.
Exit: (a) swap ST→quote in E-CLP (≤ ~minLiquidity of ST NAV); (b) EntryPoint redemption
      T+1 → collateral in kind → underlying's own redemption (quarterly / 13-week unwind).
```

---

## Risk Summary

### Key Strengths

- **Onchain, reconciled backing.** The kernel holds the collateral directly, its ledger matches token balances to the wei, and all NAV, coverage, and liquidity state is readable via `getState()`.
- **Enforced timelocks on change paths.** Upgrades, oracle swaps, parameter changes, blacklisting, and role grants all go through a ≥3-day AccessManager delay (5-day `minSetback`), and guardians can cancel scheduled operations.
- **Broad review coverage.** Seven reviews/tools, including Certora manual review plus formal verification and an independent auditor who found and saw fixed 1 Critical and 7 Highs. Deployed core sources match the last reviewed commit.
- **A genuine secondary exit for small positions.** The E-CLP pool lets ST exit up to `minLiquidity` of NAV without waiting for the underlying's lock.

### Key Risks

- **No added protection.** With 0% coverage, the Senior token carries the full loss of reUSDe (mezzanine reinsurance) or liUSD-13w (InfiniFi first-loss), both of which sit *below* the senior tokens Yearn already assessed. The "Senior" name does not mean senior to anything in these markets.
- **Exit liquidity is capped and fragile.** Instant exit is at most about 10–15% of supply and paid in sUSDe/siUSD. The liquidity floor can be met with ST inventory after the quote leg is drained, and admin can lower it to zero with 3 days' notice. Beyond the pool, holders inherit a 13-week (liUSD-13w) or quarterly (reUSDe) lock.
- **Unproven at any scale.** Day has been live about 65 days. The sr-reUSDe market holds $18.92 of ST NAV (87.5% held by the deployer), and sr-liUSD-13w does not exist.
- **Mutable despite "immutable" docs.** Beacon upgrades replace every market's logic at once, and oracles and risk parameters are admin-settable.
- **Unverified oracle bytecode.** The Royco collateral-oracle adapters sit on the NAV path that a Morpho oracle would ultimately consume.

### Critical Risks

- **Liquidation failure for lending.** For the proposed sr-liUSD-13w/USDC Morpho market (LLTV 0.86 → 0.915), liquidations beyond the exit pool's quote depth require taking a 13-week unwind on first-loss capital. The exit pool drains in the very scenario that triggers liquidations, an InfiniFi markdown. Lenders bear bad-debt risk on any collateral above pool depth.
- **Instant 1-of-4 pause freezes all transfers.** A single signer can make all Senior collateral non-transferable indefinitely, including blocking liquidations, and unpausing requires the 3-of-4 root Safe.

---

## Risk Score Assessment

The score below is for **sr-reUSDe** (the deployed token in the header). The proposed **sr-liUSD-13w** is scored indicatively under [sr-liUSD-13w (Indicative)](#sr-liusd-13w-indicative).

### Critical Risk Gates

- [ ] **Unverified contract source**: **PASS (with caveat).** The Senior tranche (beacon proxy → verified `RoycoSeniorTranche`), Kernel, Accountant, EntryPoint, and Factory are all verified. The collateral oracle adapters ([`0xF8aAd4D54E31EE811Fdc545C7A54D3D624840084`](https://etherscan.io/address/0xF8aAd4D54E31EE811Fdc545C7A54D3D624840084), [`0x743b10203875CC3EA451F5ECC95284CC881E8b27`](https://etherscan.io/address/0x743b10203875CC3EA451F5ECC95284CC881E8b27)) are **unverified**. They are not the assessed token, but they price it. This is scored in Provability and Dependencies, and source verification is a precondition for any lending integration.
- [ ] **No audit**: **PASS.** Hexens, Certora, Tomer Ganor, and a Cantina competition reviewed the deployed commit lineage.
- [ ] **Unverifiable reserves**: **PASS.** Collateral is held by the kernel and reconciles onchain. Its value depends on the underlying's NAV, which is covered by the underlying reports.
- [ ] **Total centralization**: **PASS.** Control sits with multisigs behind a 3-day AccessManager delay. The pause power is held by a 1-of-4 Safe, so a single signer can pause.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits & Security Reviews: 2.5.** Multiple reviews by reputable firms (Certora manual plus formal verification, Hexens, Cantina competition, and Tomer Ganor) and a $250K Immunefi bounty would support 2.0. It is held at 2.5 for three reasons: high contract complexity; unfixed Certora items (1 Medium, 5 Low); and no explicit Day assets in the bounty scope (Primacy of Impact only).
- **Historical Track Record: 5.0.** Day has been in production about 65 days (<3 months). The assessed market holds $18.92, and all Ethereum Day markets together hold about $196K, so there is no meaningful TVL.

**Score: 3.75/5.** `(2.5 + 5.0) / 2`.

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 3.0.**
  - The timelock is ≥3 days on upgrade, oracle, parameter, and role paths, which meets the score-1 timelock bar.
  - Control sits with 3-of-4 Safes with unattributed signers (rubric 4 on threshold).
  - Powerful roles with limited constraints: beacon upgrades hit all markets; oracle and liquidity floor are settable; EntryPoint redemption can be disabled with a 1-day delay; and a **no-delay 1-of-4 pause freezes all transfers** (rubric 4).
- **Programmability: 2.5.** Accounting, loss waterfall, premiums, and venue are onchain and algorithmic. The PPS input, however, is an external NAV that Re pushes daily. EntryPoint execution relies on permissionless keepers.
- **External Dependencies: 4.0.** The underlying issuer is a critical, newer dependency with zero subordination. The Royco oracle adapters are unverified. Balancer V3 and Ethena are established. Collateral quality is scored separately in Category 3.

**Score: 3.17/5.** `(3.0 + 2.5 + 4.0) / 3 = 3.1667`.

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 4.5.** Backing is 100% one asset, held onchain by the kernel. That asset is reUSDe, a mezzanine reinsurance tranche with custodial (EOA) backing and quarterly redemption, with **no Royco coverage** in front of it. It ranks below reUSD, which scores 4.0 on Funds Management in the [Re report](re-reusd.md). The same 4.5 applies to liUSD-13w, InfiniFi's first-loss layer (InfiniFi's siUSD collateralization is already 4.5).
- **Provability: 4.0.** Kernel holdings are verifiable in real time. Their value, though, rests on an admin-pushed offchain NAV (reUSDe) or offchain RWA attestations (liUSD), read through an **unverified** Royco adapter that admin can replace.

**Score: 4.25/5.** `(4.5 + 4.0) / 2`.

#### Category 4: Liquidity Risk (Weight: 15%)

- The instant exit (E-CLP) is capped at about `minLiquidity` of ST NAV (15%). It is worth **$2.70 of sUSDe** today, at up to a 15% discount, and is paid in a yield-bearing token.
- Primary redemption is in kind, T+1, into an asset with **quarterly** redemption.
- The liquidity floor can be met with ST inventory once the quote leg is drained, and it can be lowered by admin.
- A no-delay pause can freeze transfers.
- Rubric: "Withdrawal queues or restrictions; <$1M; >1 week" (4), plus the throttle modifier (+0.5). Exit is not impossible, so it stops short of 5.

**Score: 4.5/5.**

#### Category 5: Operational Risk (Weight: 5%)

The team is public and VC-backed, and development is active. Documentation is good conceptually but materially inconsistent with the deployed control surface ("immutable" markets, Dawn-era mitigants). Foundation jurisdiction and the incident-response plan are unpublished. Market creation is permissionless, so per-market risk depends on the creator.

**Score: 2.5/5.**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.75 | 20% | 0.750 |
| Centralization & Control | 3.17 | 30% | 0.950 |
| Funds Management | 4.25 | 30% | 1.275 |
| Liquidity Risk | 4.5 | 15% | 0.675 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.77 / 5.0** |

No optional modifiers apply: the protocol is younger than 2 years and its TVL is below $500M.

### sr-liUSD-13w (Indicative)

**Indicative score: 3.77**, conditional on a deployment matching the deck: 0% coverage, a 10% exit pool in siUSD, `fixedTermDuration = 0`, and the InfiniFi LPT oracle path. The categories map as follows:

- Categories 1, 2 and 5 are identical: same code, same governance, same team. The InfiniFi oracle is computed onchain (Programmability 2.5), and InfiniFi is the single critical dependency for both collateral and exit cash (Dependencies 4.0).
- Category 3 is 4.25: liUSD-13w is first-loss and InfiniFi is ~84% offchain-custodied (Collateralization 4.5), and its value rests on offchain RWA attestations read through an unverified adapter (Provability 4.0).
- Category 4 is 4.5: a 10% pool in siUSD, then a 13-week unwind. It is **5.0 until the market and pool exist.**

Before any listing:
- **TODO:** the deployed market, oracle, and pool addresses.
- **TODO:** source verification of the Royco oracle adapter and of the proposed Morpho NAV feed.
- **TODO:** confirmation of who seeds and controls the SLP. The deck says InfiniFi is being asked to seed it.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| 1.50–2.49 | Low Risk | Approved with standard monitoring |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: ELEVATED RISK**

For lending specifically, size any Morpho market on these tokens to the exit pool's quote-leg depth, not to ST supply. An LLTV near the underlying's (0.86–0.915) does not reflect the 13-week or quarterly exit beyond the pool. Avoid integration until the pause power has a time bound or a higher threshold, and until the oracle adapters are source-verified.

---

## Reassessment Triggers

- **Deployment-based:** reassess when sr-liUSD-13w is deployed, when a Morpho oracle or market for any sr- token is proposed, or when the sr-reUSDe pool quote asset changes to reUSD.
- **TVL-based:** reassess if any assessed market's ST NAV exceeds $1M, or if Day TVL exceeds $10M.
- **Governance-based:** reassess on any beacon or UUPS upgrade, oracle replacement, `setMinLiquidity`/`setMinCoverage` change, blacklist activation, pauser/root Safe threshold or owner change, or any change in AccessManager execution delays.
- **Incident-based:** reassess on any pause, share-price decrease, InfiniFi `LossesApplied`, or Re NAV markdown.
- **Time-based:** reassess in 3 months (January 19, 2027).

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| October 19, 2026 | 3.77 | Initial assessment of Royco Day Senior tranches (sr-reUSDe live test market; sr-liUSD-13w proposed, not deployed) |
