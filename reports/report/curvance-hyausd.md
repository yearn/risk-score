# Protocol Risk Assessment: Curvance High Yield AUSD (hyAUSD)

- **Assessment Date:** August 17, 2026
- **Token:** hyAUSD (High Yield AUSD Vault)
- **Chain:** Monad (chain id 143)
- **Token Address:** [`0xaD663aC84052b52BE4ed1b27BA416505e84a00Bf`](https://monadscan.com/address/0xaD663aC84052b52BE4ed1b27BA416505e84a00Bf)
- **Final Score: 3.4/5.0**

## Overview + Links

**hyAUSD** is a Curvance *Earn Vault* — an ERC-4626-style share token issued by the `LendingOptimizer` contract. Users deposit [AUSD](https://monadscan.com/address/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a) (Agora's fiat-backed dollar) and the vault spreads that AUSD pro-rata across a fixed, whitelisted set of Curvance **isolated lending markets** that share the same underlying. Yield is the blended AUSD supply rate of those markets; there is no leverage, no swapping, and no external strategy contract.

Today the vault routes into exactly two markets, both of which lend AUSD against a single correlated collateral:

| Market (borrowable cAUSD) | Collateral accepted | Vault position | Allocation | Cap |
|---|---|---|---|---|
| [`0xbDe2459A…6c93`](https://monadscan.com/address/0xbDe2459A033f20442CE18483CDD48643D80C6c93) | Pendle **PT-AUSD-8OCT2026** | 11,019,729 AUSD | 60.0% | 90% |
| [`0xD1BFEA17…91D4`](https://monadscan.com/address/0xD1BFEA1728ffe98F515f26082fACfcc3341691D4) | Avant **savUSD** (CCIP-bridged) | 7,332,183 AUSD | 40.0% | 40% |

So the honest one-line description of the risk is: **hyAUSD is an unlevered AUSD lender into two ~90%-utilised, high-LTV (95% / 92%) looping markets whose collateral is a Pendle principal token and a bridge-minted synthetic dollar.** Vault-level totals verified onchain at block 96,882,186 (August 17, 2026): `totalAssets()` = **18,351,893.923865 AUSD**, `totalSupply()` = **18,206,533.277677 hyAUSD**, `exchangeRate()` = **1.007983982671002306** (WAD), `fee()` = **0**, `mintPaused()` = **1** (deposits active).

Realised yield since the vault went live (June 23, 2026) is ~0.80% over 55 days ≈ **5.4% APY**, consistent with DefiLlama's reported base supply rates for the two underlying markets (5.63% and 7.03%).

**Links:**

- [Protocol Documentation](https://docs.curvance.com/app)
- [Earn Vaults documentation](https://docs.curvance.com/app/protocol-overview/earn-vaults)
- [Protocol Dashboard/App](https://app.curvance.com/vault?address=0xaD663aC84052b52BE4ed1b27BA416505e84a00Bf)
- [GitHub Repository](https://github.com/curvance/curvance-contracts)
- [LendingOptimizer integration & operations doc](https://github.com/curvance/curvance-contracts/blob/develop/docs/lending-optimizer-integration.md)
- [Security/Audits Page](https://docs.curvance.com/app/security/bug-bounty-and-audits)
- [Audit directory (PDFs)](https://github.com/curvance/curvance-contracts/tree/develop/contracts/audits)
- [Curvance on DefiLlama](https://defillama.com/protocol/curvance)
- [Monad Contract Addresses (docs)](https://docs.curvance.com/app/protocol-overview/monad-contract-addresses)

## Audits and Due Diligence Disclosures

Curvance has six published reports. Firm names, dates and scope were read directly out of the PDFs in the repo audit directory:

| Firm | Date | Scope (as stated in the report) | Report |
|---|---|---|---|
| TrustSec | Nov 22, 2025 | Curvance core (follow-up; `BorrowableCToken`, `MarketManagerIsolated` in scope) | [PDF](https://github.com/curvance/curvance-contracts/blob/develop/contracts/audits/TrustSec%20Audit%202%20-%202025.11.22.pdf) |
| TrustSec | Oct 17, 2025 | Curvance core lending stack (`BorrowableCToken` ×68, `MarketManagerIsolated` ×42 references) | [PDF](https://github.com/curvance/curvance-contracts/blob/develop/contracts/audits/TrustSec%20Audit%201%20-%202025.10.17.pdf) |
| Sherlock | Aug 25 – Sep 29, 2025 | `curvance-contracts` @ `478fc3be…`: CentralRegistry, DAOTimelock, calldata checkers, ActionRegistry; plus `Atlas-Integration/AuctionManager.sol` | [PDF](https://github.com/curvance/curvance-contracts/blob/develop/contracts/audits/Sherlock%20Audit%20-%202025.9.29.pdf) |
| Trail of Bits | May 23, 2025 | Curvance security assessment | [PDF](https://github.com/curvance/curvance-contracts/blob/develop/contracts/audits/Trail%20of%20Bits%201%20-%202025.5.23.pdf) |
| Cantina | Apr 16, 2025 | Public audit competition (oracles, CVE bridging, veCVE, fee routing) | [PDF](https://github.com/curvance/curvance-contracts/blob/develop/contracts/audits/Cantina%201%202025.4.16.pdf) |
| Trail of Bits | Mar 13, 2024 | Invariant development engagement | [PDF](https://github.com/curvance/curvance-contracts/blob/develop/contracts/audits/Trail%20of%20Bits%20Invariant%20Development%201%20-%202024.3.13.pdf) |

**Critical scoping finding — the assessed contract is not covered by any published audit.** Every one of the six PDFs was text-extracted and searched: the strings `LendingOptimizer` and `optimizer` appear **zero times in all six reports**. The most recent audit predates the `LendingOptimizer` deployment (June 23, 2026) by seven months. The *markets underneath* the vault are audited (`BorrowableCToken` and `MarketManagerIsolated` appear 68/42 times in TrustSec 1, 25/8 times in Sherlock), and so is `CentralRegistry`/`DAOTimelock` — but the 1,513-line contract that actually custodies hyAUSD depositors' AUSD has no public third-party review.

**Complexity.** The optimizer itself is moderately complex: pro-rata deposit/withdraw routing with per-market liquidity caps, a rounding-adjusted share burn on withdraw, a high-watermark performance-fee accrual, and cToken conversion round-trips on `mint()`/`redeem()`. The stack beneath it (isolated market managers, dynamic IRM, dual-aggregator oracles, a dynamic liquidation engine with auctions, position managers, plugin/zapper system) is substantially more complex than a Compound/Morpho-style lender.

**Deployed code matches the public repo.** The verified MonadScan source for the optimizer was diffed against `contracts/market/optimizer/LendingOptimizer.sol` on `develop`. The 82-line diff is **entirely NatSpec comments** — no logic differences. Notably, the repo version *adds* several risk disclosures written after deployment (unrecognised credit impairment, non-continuous allocation caps, transitive-dependency requirements); those are quoted where relevant below.

**Unresolved findings:** no public findings tracker or remediation matrix was located for the audits; the PDFs are published without a "status" column that could be machine-checked. Marked **TODO** — Curvance would need to supply the fix-status log.

### Bug Bounty

- **Self-run program**, reports to `security@curvance.com`. Maximum payouts: **Critical $250,000**, High $50,000, Medium $5,000, Low/Informational no guaranteed reward ([source](https://docs.curvance.com/app/security/bug-bounty-and-audits)). No Immunefi / Cantina / HackerOne / Sherlock hosted program was found for the deployed contracts.
- **The assessed vault is out of bounty scope.** The program states: *"Only Curvance contracts with a populated Monad mainnet address on the Monad Contract Addresses page and currently in active use are in scope. Blank or placeholder entries… are out of scope."* On that page, the Earn Vaults section contains a single row — "AUSD Flagship" — with an **empty address cell**. `0xaD663aC8…00Bf` does not appear anywhere on the page, and neither does either of its two lending markets (`0xbDe2459A…`, `0xD1BFEA17…`) or their market managers. Verified by string search of the page markdown on August 17, 2026.
- **Safe Harbor / SEAL:** not found. No Curvance entry was located in SEAL Safe Harbor material or in Curvance's own security docs. Treated as **unverified/not adopted**.

## Historical Track Record

- **Vault time in production: 55 days.** `LendingOptimizer` was deployed June 23, 2026 16:28 UTC (block 83,204,988, [tx `0x8cca706e…57f8`](https://monadscan.com/tx/0x8cca706e7d9641d29a0389f8c781314696921e6591a568c83666d04a38c057f8)) by deployer [`0x029cf33e…7b5c`](https://monadscan.com/address/0x029cf33e40f779e3632cba317bd43a836e117b5c). The two markets it lends into are barely older: market B June 8, 2026; market A June 20, 2026.
- **Protocol time in production on Monad: ~9 months.** `CentralRegistry` was deployed November 25, 2025 ([tx `0xe05befec…db89`](https://monadscan.com/tx/0xe05befec0c3db9a8a17712e0d5b185a2fafbd5ca03330e2bda61d03de411db89)). Curvance itself was founded in 2022 and ran a long Monad testnet campaign before mainnet.
- **Security incidents:** one — a **frontend/DNS attack on February 16, 2026**, detected by security partners and blocked before any user funds or approvals were compromised; core contracts were unaffected ([report](https://ourcryptotalk.com/news/curvance-protocol-detects-and-blocks-malicious-frontend-attack)). No smart-contract exploit is known.
- **Protocol TVL history** ([DefiLlama](https://api.llama.fi/protocol/curvance)): $8.0M (Nov 28, 2025) → $43M (Jan 2026) → dip to $32M (Feb 2026) → $57M (Apr) → $99.5M peak (Aug 7, 2026) → **$88.46M supplied / $69.27M borrowed** today. Growth has been steady with one ~25% drawdown in Jan–Feb 2026. Curvance is a Monad-only deployment.
- **hyAUSD concentration is high.** Reconstructed from all 1,893 `Transfer` logs (reconstructed supply 18,206,533.20 vs onchain `totalSupply()` 18,206,533.28 — matches): **95 holders**, with:

| Rank | Holder | Balance | Share | Type |
|---|---|---|---|---|
| 1 | [`0x9f1a1479…bd1a`](https://monadscan.com/address/0x9f1a1479191af103ff82fead23e950b6b3b2bd1a) | 8,369,723 | **45.97%** | EOA |
| 2 | [`0x6cc60a0b…c4bd`](https://monadscan.com/address/0x6cc60a0b57bc882a0471980d0e2d4ad7ddf3c4bd) | 2,886,207 | 15.85% | EOA |
| 3 | [`0x1cde180f…d891`](https://monadscan.com/address/0x1cde180fd33935c744623d655696eb3a77e5d891) | 1,871,512 | 10.28% | Safe (2-of-N) |
| 4 | [`0xa5190552…c6bd`](https://monadscan.com/address/0xa5190552e8a7902812c6f6df07813bf6aebfc6bd) | 1,784,454 | 9.80% | "FUSDE Boring Vault" |
| 5 | [`0xccb8e090…8812`](https://monadscan.com/address/0xccb8e090fe070945cc0131a075b6e1ea8f208812) | 1,394,589 | 7.66% | EIP-7702 delegated EOA |

  **Top 5 = 89.6% of supply.** The largest holder alone (≈8.43M AUSD of claim) exceeds total instantly-available exit liquidity (≈3.85M AUSD, see Liquidity Risk) by more than 2×.
- **Peg / NAV history:** hyAUSD is a non-rebasing yield share, not a pegged token. Exchange rate has moved monotonically from 1.000000 to 1.007984 since inception; `PerformanceFeeAccrued` has never fired (fee is 0) and `ExcessRecovered` (skim) has never fired.

## Funds Management

**Yes — the vault delegates 100% of deposits to other contracts.** It holds zero idle AUSD (`AUSD.balanceOf(vault)` = 0) and its entire NAV is two cToken positions:

| Position | Shares held | Asset value | Underlying market state |
|---|---|---|---|
| cAUSD (PT market) [`0xbDe2459A…6c93`](https://monadscan.com/address/0xbDe2459A033f20442CE18483CDD48643D80C6c93) | 10,937,602.023203 | 11,019,729.121792 AUSD | supply 23,366,343; debt 21,257,356; idle **2,108,967**; **utilisation 90.97%** |
| cAUSD (savUSD market) [`0xD1BFEA17…91D4`](https://monadscan.com/address/0xD1BFEA1728ffe98F515f26082fACfcc3341691D4) | 7,264,286.554879 | 7,332,183.026031 AUSD | supply 16,881,395; debt 15,135,535; idle **1,745,841**; **utilisation 89.66%** |

Sum = **18,351,912.15 AUSD** against a cached `totalAssets()` of 18,351,893.92 (the small gap is accrual staleness between blocks) and a share supply of 18,206,533.28 — i.e. **reserves ≥ shares**, and the whole reconciliation is a two-call onchain read. See Provability.

**How funds delegation changes.** Only three functions can change where the money sits, and all three are permissioned:

| Function | Permission required | Effect |
|---|---|---|
| `rebalance(actions, bounds)` | `hasHarvestPermissions` **or** `hasMarketPermissions` | Moves AUSD between *already-approved* markets. Withdrawal total must equal deposit total; post-state must respect per-market caps and caller-supplied bounds. |
| `addApprovedAsset(cToken, capBps)` | `hasElevatedPermissions` | Adds a new market to the approved set (max 8). |
| `removeApprovedAsset(cToken, actions, bounds)` | `hasMarketPermissions` | Redeems a market entirely and redistributes by BPS across remaining markets. |

Monitoring hooks: `Rebalanced`, `MarketAdded`, `MarketRemoved`, `AllocationCapUpdated` events on the vault (see Monitoring). `getApprovedMarkets()` and `allocationCaps(cToken)` give current state in two calls.

**Rebalance cadence.** 64 `Rebalanced` events between June 24, 2026 and August 14, 2026, **median gap 3.0 hours** (max gap 422 h). Every one was sent by harvester EOA [`0xd21dc65f…cbc7`](https://monadscan.com/address/0xd21dc65f42fb039a1c403a38c18c2731211ecbc7). Rebalance plans are computed offchain by the `OptimizerReader` "route planner" described in the [Earn Vaults docs](https://docs.curvance.com/app/protocol-overview/earn-vaults), including a defensive path that excludes markets with stale oracle feeds or breached price guards.

**Cap history.** Market B's cap has been raised twice, both times executed **directly through the Emergency Council Safe, not the 5-day timelock**: 2000 → 3000 BPS on July 4, 2026 ([tx `0x9addc49d…942f`](https://monadscan.com/tx/0x9addc49dbe6b28de75b197a98f8dbd7161061e85ee21f0295d3d11b3f9bd942f)) and 3000 → 4000 BPS on August 13, 2026 ([tx `0x1312c516…d373b`](https://monadscan.com/tx/0x1312c516ac9ecb9074e4876dc994ca38762f1f0b5bdae1a5df1e8c18490d373d)). The vault is currently **at** its market-B cap.

**Caps are not continuous exposure limits.** The protocol's own operations doc is explicit: *"Allocation caps constrain post-rebalance and post-removal allocations. They are not continuous hard limits on live exposure. Different market yields, donated cTokens, and other balance changes can move a market above its configured cap. Normal deposits are routed according to current allocations and can preserve an already over-cap ratio."* Monitoring must compare live positions to caps rather than assume the cap binds.

### Accessibility

- **Deposit/mint: permissionless.** `deposit(assets, receiver)` and `mint(shares, receiver)` are open to anyone. Gated only by `mintPaused == 1` and by *no approved market being mint-paused* (`_checkMintPaused`).
- **Withdraw/redeem: permissionless**, but see the pause coupling and liquidity cap below.
- **Atomic:** yes in both directions. Deposit pulls AUSD, deposits into each cToken and mints shares in one transaction; redeem withdraws from cTokens and transfers AUSD in one transaction. There is no queue, no cooldown and no epoch.
- **Fees:** the performance fee is currently **0 BPS** (`fee()` = 0) and has never been changed (`FeeUpdated` has zero events). Ceiling is `MAX_FEE_BPS` = **5000 (50%)** and it is charged only on NAV above the exchange-rate high watermark, minted as shares to `centralRegistry.daoAddress()`. There is no deposit or withdrawal fee. The underlying markets take `interestFee()` = **1000 BPS (10%)** of borrower interest before it reaches suppliers.
- **Rate limits:** none at the vault. `maxDeposit`/`maxMint` return `type(uint256).max` while unpaused; there is no deposit cap. `maxWithdraw`/`maxRedeem` are throttled by market idle cash.
- **Non-standard ERC-20 behaviour:** `transfer`/`transferFrom` **revert on zero amount and on self-transfer**, and both accrue underlying market NAV before executing. Any integrating strategy must not assume vanilla ERC-20 semantics.

### Token Mint Authority

**Mint mechanism:** Open, permissionless ERC-4626-style mint via collateral deposit. There is no role-gated mint, no `MINTER_ROLE`, no whitelist, no `owner()` and no bridge minter. `_mint` is reachable from exactly three places in `LendingOptimizer.sol`: `deposit()`, `mint()`, and two privileged-but-backed paths (`initializeDeposits()` dead shares, and the performance-fee share mint inside `_accrueIfNeeded()`).

**Mint requires backing:** **Yes — atomic and measured.** `deposit()` pulls AUSD with `safeTransferFrom` *before* routing, then derives shares from `trackedAssets` (the *recoverable* value after cToken share rounding, not the input amount) using the pre-deposit denominator. `mint()` reverts with `LendingOptimizer__AssetMismatch` if the tracked value would not cover the requested shares.

**Per-address mint authority** (verified onchain August 17, 2026 from [`0xaD663aC8…00Bf`](https://monadscan.com/address/0xaD663aC84052b52BE4ed1b27BA416505e84a00Bf)):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any address | ✓ | ✓ | `deposit()` / `mint()` / `withdraw()` / `redeem()` | Permissionless, atomically collateral-backed. No allow-list. |
| [`0x0Acb7eF4…5C02`](https://monadscan.com/address/0x0Acb7eF4D8733C719d60e0992B489b629bc55C02) | ✓ (fee shares only) | — | `_accrueIfNeeded()` → `_mint(centralRegistry.daoAddress(), feeShares)` | Curvance DAO Safe, **3-of-4**. Receives performance-fee shares. Fee is currently 0, so this path mints nothing; a `setFee` change (market permissions) can enable it up to 50% of NAV growth above the high watermark. |
| [`0x379D4a8F…399c`](https://monadscan.com/address/0x379D4a8FBc23A8Fd8c2b3738Dbf1fEBe9a64399c) / [`0x26777386…8C08`](https://monadscan.com/address/0x2677738657F27e1A3591E00AD7E5a78807688C08) | ✓ (one-time) | — | `initializeDeposits()` → `_mint(address(0), 77777)` | Emergency Council Safe / DAOTimelock (both `hasMarketPermissions`). Already executed and permanently locked out (`mintPaused != 0` ⇒ `AlreadyInitialized`). The 77,777 dead shares sit at `address(0)` as inflation-attack protection. |

**Rate limits / supply caps:** none. No global supply cap, no per-minter cap, no per-block limit. Supply is bounded only by the fact that every share must be paid for in AUSD.

**Backing check at mint time:** **Atomic.** Every non-fee share is minted against AUSD that has already been transferred in and deposited into a cToken in the same transaction, and shares are derived from the post-rounding recoverable value so rounding never favours the minter.

**No unbacked-mint path exists at the vault level.** The realistic loss paths for a hyAUSD holder are (a) NAV impairment from the markets underneath, and (b) governance re-pointing where the AUSD sits — both covered below, not unbacked issuance.

### Collateralization

hyAUSD is not a stablecoin and has no collateral ratio of its own — it is a 1:1 pro-rata claim on the vault's AUSD-denominated cToken positions. The meaningful collateral question is **what backs the loans the vault is funding.** Both markets are `IS_CORRELATED_ASSET_MARKET() == true`, which unlocks Curvance's highest LTV band.

**Market A — PT-AUSD-8OCT2026** (manager [`0xdDd5681f…ec2e`](https://monadscan.com/address/0xdDd5681fCBB040e3bD3c126AA6caf1677DFCEc2e), collateral cToken [`0x6eD14BA7…3bF8`](https://monadscan.com/address/0x6eD14BA7d1Ec30a97E21d0D8037867535BA43bF8)):

| Parameter | Value |
|---|---|
| Collateral ratio (max LTV) | **9500 BPS (95%)** |
| Soft liquidation collateral requirement | 10300 BPS (103%) |
| Hard liquidation collateral requirement | 10250 BPS (102.5%) |
| Collateral cap | 30,000,000 PT |
| Debt cap | 30,000,000 AUSD |
| Collateral posted | 23,089,873 PT ≈ **$22.77M** at oracle $0.98590 |
| Outstanding AUSD debt | 21,257,356 |
| Implied market-wide CR | **≈107.1%** |

The collateral is a [Pendle Principal Token](https://monadscan.com/address/0x9FC74f8Ed616B5BaF52a170caa97d6d3898602d1) with `expiry()` = 1,791,417,600 (**October 8, 2026 24:00 UTC**), redeemable 1:1 into AUSD at maturity via `SY AUSD` (whose `yieldToken()` is AUSD itself). This is the *better* of the two collaterals: at maturity the collateral becomes the same asset the vault lends.

**Market B — savUSD** (manager [`0x4B0a39eC…09F7`](https://monadscan.com/address/0x4B0a39eCC3e5A5dA3ce6D492D4D255cD1F0209F7), collateral cToken [`0x2552232c…7c2f`](https://monadscan.com/address/0x2552232caBd544b67eEa900A951346D3272c7c2f)):

| Parameter | Value |
|---|---|
| Collateral ratio (max LTV) | **9200 BPS (92%)** |
| Soft liquidation collateral requirement | 10450 BPS (104.5%) |
| Hard liquidation collateral requirement | 10350 BPS (103.5%) |
| Collateral cap | 20,000,000 savUSD |
| Debt cap | 20,000,000 AUSD |
| Collateral posted | 15,364,191 savUSD ≈ **$18.34M** at oracle $1.19363 |
| Outstanding AUSD debt | 15,135,535 |
| Implied market-wide CR | **≈121.2%** |

**savUSD on Monad is not the canonical Avant token — it is a Chainlink CCIP burn-and-mint representation.** [`0x9648dB94…06c6`](https://monadscan.com/address/0x9648dB94F1e6B19e7D755585542981F97dc806c6) reports `typeAndVersion()` = `"FactoryBurnMintERC20 1.6.2"`, and its sole minter/burner is [`0xc5cAAC64…8D3E`](https://monadscan.com/address/0xc5cAAC64Dd93b6E2B369d52610Fdae069e568D3E), a `BurnMintTokenPool 1.5.1` owned by [`0xd4d23209…57cb`](https://monadscan.com/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb) (which is also the token's `owner()` and `getCCIPAdmin()`). The pool serves 7 remote lanes; the Avalanche lane inbound bucket has capacity **44,881,724 savUSD** refilling at ~519 savUSD/s — roughly 3× the entire posted collateral, so the rate limiter is not a meaningful throttle at this size. Underneath, avUSD is a delta-neutral synthetic dollar with offchain-managed strategies and a senior/junior tranche structure ([Avant docs](https://docs.avantprotocol.com/overview/core-tokens)).

**Tracing the canonical Avant stack on Avalanche shows the backing for this collateral is almost entirely offchain, under single-EOA control.** Addresses confirmed against Avant's own [contract-addresses page](https://docs.avantprotocol.com/security/contract-addresses) and then read onchain (Avalanche, August 17, 2026):

| Fact | Value |
|---|---|
| avUSD total supply | **127,269,028 avUSD** |
| USDC + USDT held by `AvantMintingV2` [`0xcb43139E…A49c`](https://snowtrace.io/address/0xcb43139E90f019624e3B76C56FB05394B162A49c) | **$0.01** (0.000000% of supply) |
| Sole registered custodian [`0x3bbcb84f…e0ec`](https://snowtrace.io/address/0x3bbcb84fcde71063d8c396e6c54f5dc3d19ee0ec) — **an EOA**, no code, nonce 3698 | **$741,565 USDC** (0.58% of supply) |
| avUSD staked in savUSD vault [`0x06d47F3f…219E`](https://snowtrace.io/address/0x06d47F3fb376649c3A9Dafe069B3D6E35572219E) | 108,231,057 avUSD (matches `totalAssets()` 108,210,389) |

Three things follow, each verified from source rather than inferred:

1. **Collateral never touches a protocol contract.** `AvantMintingV2._transferCollateral()` executes `token.safeTransferFrom(benefactor, addresses[i], …)` — the depositor's USDC/USDT is routed **directly to custodian addresses** at mint time. There were **zero `CustodyTransfer` events** in the contract's history, because the escrow-then-sweep path is never used. So ~99.4% of what backs avUSD is not observable onchain at all; it sits in offchain venues supporting the delta-neutral position.
2. **A single non-multisig address is the entire admin surface.** [`0xd4d23209…57cb`](https://snowtrace.io/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb) has **no code on Avalanche (nonce 270) or Monad**. It is simultaneously: `owner()` of avUSD, `owner()` + `DEFAULT_ADMIN_ROLE` of savUSD, `owner()` + `DEFAULT_ADMIN_ROLE` + `COLLATERAL_MANAGER_ROLE` of `AvantMintingV2`, and `owner()` + `getCCIPAdmin()` of the Monad savUSD token **and** its CCIP pool. avUSD is `Ownable2Step` with `setMinter(address,bool) onlyOwner`, so that key can appoint itself a minter and issue unbacked avUSD without limit (`maxMintPerBlock` is 25,000,000 avUSD, and the admin sets that too).

   **Important qualifier — do not read "no code" as "hot EOA."** An MPC wallet is indistinguishable from an EOA onchain, and Avant explicitly documents MPC custody for its [Reserve Fund wallets](https://docs.avantprotocol.com/security/reserve-fund) and an **ongoing Trail of Bits OPSEC engagement** covering "treasury management and transaction controls," "infrastructure security and access controls," and incident response ([audits page](https://docs.avantprotocol.com/security/contract-and-opsec-audits)). What is verifiable is that this key is **not an onchain multisig and carries no timelock**, so there is no onchain quorum or delay on any of the powers above. The offchain signing policy behind it is undisclosed — treat it as *unverified*, not as a single hot key.
3. **Avant retained Ethena's blacklist-and-seize powers.** `StakedAvUSD` keeps `FULL_RESTRICTED_STAKER_ROLE` plus `redistributeLockedAmount(from, to)`, letting `DEFAULT_ADMIN_ROLE` burn a blacklisted holder's entire savUSD balance and reassign it.

**Two bounding facts cut the other way, and both were checked rather than assumed:**

- **The Monad collateral cannot be seized.** `FactoryBurnMintERC20.burnFrom()` still routes through OpenZeppelin's `_spendAllowance(account, msg.sender, amount)`, so the burner — even though the EOA controls it — **cannot burn savUSD out of the Curvance market** without an allowance the market never grants. The Monad-side risk is unbacked *minting*, not confiscation. Likewise `redistributeLockedAmount` acts on the Avalanche token, not the bridged Monad one.
- **The savUSD/avUSD rate cannot be drained.** `StakedAvUSD.rescueTokens()` reverts when `token == asset()`, so the admin cannot pull staked avUSD out of the vault to crash the exchange rate the Monad oracle reads. The 108.23M avUSD backing 90.63M savUSD shares is real and onchain.
- **savUSD sits behind a real ~10.5% first-loss buffer.** Avant runs a senior/junior structure, and unlike the "planned" governance backstop, both live layers are countable onchain: the junior tranche **avUSDx / "avUSD MAX"** [`0xDd1cDFA5…B3B9`](https://snowtrace.io/address/0xDd1cDFA52E7D8474d434cd016fd346701db6B3B9) has a supply of **12,619,965**, and the USD Reserve Fund [`0xd98e1faf…f43a`](https://snowtrace.io/address/0xd98e1faf532b9c481c56741ab3ac47ec18d8f43a) holds **751,078 savUSD**. Together that is **13,371,043 — 10.51% of the 127,247,274 senior avUSD supply** — absorbed before savUSD takes a loss. Two caveats: the Reserve Fund is denominated in savUSD, so it is a claim on the same pool it protects rather than independent capital, and the governance backstop layer is explicitly described as future work.
- **Security posture is more developed than the key structure suggests.** Avant publishes **eight** smart-contract audit files and states no critical or high-severity findings, runs a continuous Trail of Bits OPSEC engagement, and uses Hypernative for real-time threat monitoring. The audit PDFs are served as GitBook file blobs, so **firm names and dates could not be extracted from the page text** and remain **TODO** — they would need to be confirmed by opening the files.

Net: the savUSD/avUSD *ratio* is sound and onchain-verifiable; what is neither sound nor verifiable is **what one avUSD is worth**, because that rests on offchain custody controlled by a single EOA — and the Curvance oracle has no avUSD/USD feed to price it (see External Dependencies).

**Liquidations are onchain**, run by Curvance's Dynamic Liquidation Engine with a soft/hard tier (market A: 1.25% base incentive, 25 BPS step, close factors 40%/60%; market B: 2.00% incentive, 50 BPS step). `liquidationPaused()` = 1 (active) on both markets. `MIN_HOLD_PERIOD` = 1200 s on both.

**Bad debt is socialized to lenders — i.e. to hyAUSD.** Per the [Curvance docs](https://docs.curvance.com/app/protocol-overview/liquidity-markets/bad-debt-socialization): *"the deficit is socialized across the entire lender market… Each lender's token value for redemption is slightly reduced."* A liquidation shortfall in either market lowers the cAUSD exchange rate, which lowers `totalAssets()`, which lowers hyAUSD NAV. There is no insurance fund, junior tranche, or first-loss buffer between hyAUSD depositors and a market shortfall.

**Risk curation** is Curvance-operated. Collateral ratios, caps and IRM parameters are set by market-permissioned addresses; a family of `ProtocolManager` contracts exists to delegate *bounded* parameter changes to ops bots, but **none of them currently manages the two markets behind this vault** (`config(address)` returns false for both cTokens and both managers on all five deployed `ProtocolManager` instances). Parameter changes on these two markets therefore go through the Emergency Council or the timelock directly.

### Provability

- **Everything that determines hyAUSD's value is onchain and permissionlessly readable.** NAV = `convertToAssets(cToken.balanceOf(vault))` summed over `getApprovedMarkets()`. Exchange rate = `totalAssets() * 1e18 / totalSupply()`. Anyone can force a fresh accrual with the **permissionless** `accrueIfNeeded()` or `exchangeRateUpdated()`, which call `accrueIfNeeded()` on each underlying cToken first. There is no offchain price feed, no admin-set unit price, no keeper-submitted NAV.
- **Yield is computed onchain**, absorbed immediately into `_totalAssets` on every accrual (cToken-style), which is what blocks yield-frontrunning: `_accrueIfNeeded()` runs before every user action.
- **Freshness caveat.** `totalAssets()`, `exchangeRate()`, previews and `max*` methods return **cached** values and are stale between accruals — deliberately so, because `deposit()` reads `totalAssets()` *after* depositing into cTokens. The protocol's own doc says: *"Do not use a raw optimizer view as authoritative collateral or credit state. Force stateful accrual in the same atomic execution as the final authoritative read."* Any Yearn strategy reporting on hyAUSD must call `accrueIfNeeded()` in the same transaction as its valuation read.
- **Credit impairment is NOT reflected in NAV until the cToken recognises it.** This is the single most important provability caveat and Curvance documents it plainly: *"Borrower health can be negative while a borrowable cToken still accounts for the loan at par. The loss reaches optimizer NAV only when the cToken recognizes it, such as during liquidation and bad-debt accounting."* Combined with pooled withdrawal routing, this creates a **first-mover advantage**: *"an exit can be funded by healthy-market cash before an impaired cToken recognizes its loss. If that loss is recognized later, remaining holders own the resulting concentration."* A large, slow-to-react holder (a Yearn vault) is structurally on the wrong side of that race.
- **Third-party verification:** none required — there is no offchain collateral. Collateral *pricing*, however, depends on Chainlink OCR2 feeds on Monad (see External Dependencies).

## Liquidity Risk

- **Exit mechanism:** direct redemption at NAV, no queue, no fee, no delay — **but hard-capped by the idle cash in the underlying markets.** `_availableWithdrawLiquidity()` sums `min(vault position, cToken.assetsHeld())` per market.
- **Instantly available exit liquidity: 2,108,967 + 1,745,841 = 3,854,808 AUSD, or 21.0% of the vault's 18.35M NAV.** Beyond that, `withdraw`/`redeem` revert with `LendingOptimizer__InsufficientLiquidity` until borrowers repay, borrowers are liquidated, or new suppliers arrive. Both markets sit at ~90% utilisation, which is the design point for PT/staked-dollar looping markets, not an anomaly.
- **The largest holder cannot exit today.** Holder #1 (45.97%, ≈8.43M AUSD of claim) exceeds available liquidity by 2.2×. Any two of the top three exiting simultaneously would exhaust it.
- **Withdrawals are all-or-nothing across markets.** `_checkRedeemPaused()` reverts the *entire* vault's withdrawals if **any single** approved market has `redeemPaused()` set. The docs frame this as fairness (*"prevents early users from withdrawing from only the healthy markets while later users are left bearing the paused one"*), and it is a defensible design — but from an integrator's view it means one paused market anywhere in the approved set freezes 100% of hyAUSD exits, not the affected fraction. The same coupling applies to deposits via `_checkMintPaused()`.
- **Recovery mechanism:** the dynamic IRM raises borrow rates sharply as utilisation approaches the vertex, which pulls repayments and new supply. This is a real but rate-dependent, hours-to-days mechanism, not a guarantee.
- **Secondary market:** effectively none. hyAUSD is a 95-holder Monad-native share token with no DEX pool located. There is no market exit; redemption is the only exit.
- **Reflexive leverage on hyAUSD exists.** Two `LendingOptimizerShareCToken` markets accept hyAUSD as collateral — [`0xbaAD847D…cA30`](https://monadscan.com/address/0xbaAD847D1Adcf143eE4Eb4DCFDd17dbB93d9cA30) (manager [`0x120E3ef1…cE6a`](https://monadscan.com/address/0x120E3ef143457F9F4d1E3eCDC448a5bb1092cE6a)) and [`0xc3DfC3CD…7F28`](https://monadscan.com/address/0xc3DfC3CD69C97877720f5386f8d4742B0F147F28) (manager [`0x8AF3E980…5974`](https://monadscan.com/address/0x8AF3E980d2d50F8E97dcD7DBbD7cAa0d17605974)). The first already holds 494,923 hyAUSD (2.72% of supply). A liquidation cascade there would force hyAUSD redemptions into the same thin idle-cash budget that ordinary holders rely on.
- **Historical stress:** none observed. The vault has never experienced a redemption event larger than its idle liquidity, and has existed for only 55 days.

## Centralization & Control Risks

### Governance

**Upgradeability: none.** `LendingOptimizer`, both `BorrowableCToken` markets, both `MarketManagerIsolated` contracts, `CentralRegistry` and `DAOTimelock` are all **non-proxy, source-verified contracts** (`Proxy: 0`, empty `Implementation` on the Etherscan V2 `getsourcecode` response for chain 143). Code cannot be swapped under depositors. `centralRegistry` is `immutable` on the optimizer, so the vault's permission root cannot be re-pointed either.

**Permission root: `CentralRegistry`** [`0x1310f352…12fF`](https://monadscan.com/address/0x1310f352f1389969Ece6741671c4B919523912fF). It exposes four boolean mappings (`hasDaoPermissions`, `hasElevatedPermissions`, `hasMarketPermissions`, `hasHarvestPermissions`). Current holders, enumerated from all 48 `PermissionsUpdated` and 7 `PermissionsTransferred` events since deployment and then re-checked live onchain:

| Address | DAO | Elevated | Market | Harvest | Type |
|---|:---:|:---:|:---:|:---:|---|
| [`0x0Acb7eF4…5C02`](https://monadscan.com/address/0x0Acb7eF4D8733C719d60e0992B489b629bc55C02) | ✓ | — | — | — | **DAO Safe, 3-of-4** (Safe v1.4.1) |
| [`0x379D4a8F…399c`](https://monadscan.com/address/0x379D4a8FBc23A8Fd8c2b3738Dbf1fEBe9a64399c) | ✓ | ✓ | ✓ | — | **Emergency Council Safe, 4-of-5** |
| [`0x26777386…8C08`](https://monadscan.com/address/0x2677738657F27e1A3591E00AD7E5a78807688C08) | ✓ | ✓ | ✓ | — | **DAOTimelock**, `getMinDelay()` = 432,000 s = **5 days** |
| [`0x1482192D…3e4c`](https://monadscan.com/address/0x1482192deb828a870f7e9b99d75d1dafda973e4c) | — | — | ✓ | — | `ProtocolManagerDeployment`, owner = EIP-7702 EOA [`0x6D3DA13B…bCE8`](https://monadscan.com/address/0x6D3DA13B41E18Dc7bd1c084De0034fBcB1fDbCE8) |
| [`0xbb82aee1…ad73`](https://monadscan.com/address/0xbb82aee16936fb2232f3c0d700b6fc832d7ead73) | — | — | ✓ | — | `ProtocolManagerMassPause`, owner = Emergency Council, `canUnpause` = **true** |
| [`0x89d2253b…7803`](https://monadscan.com/address/0x89d2253b13c718d06b78fcce3d973a520bd07803) | — | — | ✓ | — | `ProtocolManagerMassPause`, owner = [`0x25D41348…0902`](https://monadscan.com/address/0x25D4134861b30Ba7215d2A280DD84C57c5780902) (**Safe, threshold 1-of-5**), `canUnpause` = **false** |
| `0xc3a29745…21a1`, `0x7d89822c…4441`, `0x4dad55e3…a012`, `0xb68f3241…c3a4`, `0x1cfeaa99…38cc` | — | — | ✓ | — | Five `ProtocolManager` instances, each with one immutable bot caller and per-parameter limits. **None manages this vault's markets.** |
| [`0x97f6886d…4521`](https://monadscan.com/address/0x97f6886d04c804a278caf904e1adf5864b384521) | — | — | — | ✓ | **EOA** (original deployer) |
| [`0xd21dc65f…cbc7`](https://monadscan.com/address/0xd21dc65f42fb039a1c403a38c18c2731211ecbc7) | — | — | — | ✓ | **EOA** (active rebalance keeper) |

**Privileged-role harm matrix on hyAUSD:**

| Action | Who can do it | Delay | Harm potential |
|---|---|---|---|
| `setFee(0 → 5000)` | Market perms: EC Safe (4-of-5), timelock | **None via EC** | Medium — up to 50% of all *future* NAV growth above the high watermark diverted to the DAO Safe. Cannot touch principal or accrued past yield. |
| `setMintPaused(true)` | Market perms | None via EC | Low — blocks deposits only; withdrawals unaffected. |
| `updateCap(cToken, bps)` | Market perms | None via EC | Low alone — caps constrain future rebalances; changing a cap moves no assets. Already exercised twice via the EC. |
| `removeApprovedAsset(...)` | Market perms | None via EC | Medium — forcibly redeems a market and redistributes into the remaining approved set. Funds stay in the vault. |
| `rebalance(...)` | Harvest perms (**two EOAs**) or market perms | None | Medium — can concentrate up to the caps (90% into market A). Cannot move assets outside approved markets and cannot move assets out of the vault. **Bounds are caller-supplied**, so they protect the caller against races, not depositors against the caller. |
| `skim()` | DAO perms | None | Negligible — sweeps only *idle* underlying, which is 0 by construction. |
| `addApprovedAsset(cToken, cap)` | **Elevated perms**: EC Safe (4-of-5), timelock | **None via EC** | **Critical — this is the drain path (see below).** |
| Grant any permission to any address | **Elevated perms** | **None via EC** | Critical — the EC can hand market/harvest permissions to an arbitrary address instantly. |
| Pause redemptions on any Curvance market | `ProtocolManagerMassPause` owner — including a **1-of-5 Safe** | None | **High — freezes 100% of hyAUSD withdrawals** (see below). |

**Critical path 1 — a 4-of-5 multisig can drain the vault with no delay.** `addApprovedAsset` only checks that the candidate cToken (a) has `asset() == AUSD`, (b) is `isBorrowable()`, (c) has a `marketManager` registered in `CentralRegistry.isMarketManager`, and (d) is listed there. `addMarketManager` is itself gated by the same `_checkElevatedPermissions()`. So an actor with elevated permissions can register a market manager it controls, list a cToken it controls, `addApprovedAsset` it, then `rebalance` the vault's AUSD into it and withdraw. Both the Emergency Council Safe (**4-of-5, instant**) and the DAOTimelock (5-day delay) hold elevated permissions. The 5-day timelock is therefore **not** a binding constraint on this path — it is one of two parallel routes, and the observed operating practice (both cap changes) uses the EC route.

**Critical path 2 — a 1-of-5 Safe can freeze all hyAUSD withdrawals.** `ProtocolManagerMassPause` [`0x89d2253b…7803`](https://monadscan.com/address/0x89d2253b13c718d06b78fcce3d973a520bd07803) holds market permissions and exposes `pauseAll(markets)` / `pauseTokenLevelEntryActions(...)`, with an empty array meaning *every registered market*. Its `owner()` is a Safe with **`getThreshold()` = 1** over five signers, and `canUnpause` = false. So **any single one of five signers** can set `redeemPaused` on the markets behind hyAUSD, which makes `_checkRedeemPaused()` revert every withdraw and redeem — and that key cannot itself undo the pause. Unpausing requires the second mass-pause key (owned by the 4-of-5 EC) or the EC/timelock directly. The design intent is clearly a fast, low-friction emergency brake with a deliberate asymmetry, and the pause is recoverable — but it is a genuine single-signer freeze of user funds and should be scored as one.

**Critical path 3 — transitive dependency safety is an offchain operator control, not an onchain check.** `_validateCToken()` rejects only a *direct* sibling whose immediate `asset()` is the optimizer. The repo doc states plainly: *"It does not walk nested receipt tokens, vaults, LP components, or oracle dependencies. Operators must separately reject every transitive dependency path that reaches this optimizer."* Two Foundry verifier scripts (`VerifyLendingOptimizerLaunch.s.sol`, `VerifyOptimizerShareDeScope.s.sol`) exist for this, and the doc requires archiving their output before every `addApprovedAsset`. **No public attestation that these were run for this vault was located** — marked **TODO**; Curvance would need to publish the verifier output and terminal-asset manifest for the June 23, 2026 launch.

**Signer sets** (read onchain; identities not validated per assessment rules): DAO Safe 3-of-4 over `0xB41F64D0…`, `0x0F92E975…`, `0x1FFC8e39…`, `0x69879e4e…`. Emergency Council 4-of-5 over `0x342D3130…`, `0xB41F64D0…`, `0x1FFC8e39…`, `0xdA54Eb76…`, `0x69879e4e…`. The 1-of-5 pause Safe has the **same five signers as the Emergency Council**, so the freeze key is not an independent party — it is the EC operating under a lowered threshold.

### Programmability

- **Accounting is fully programmatic and onchain.** PPS = `totalAssets() / totalSupply()`, both onchain; `totalAssets` is re-derived from actual cToken balances on every accrual and re-synced from ground truth after every rebalance (`_verifyAllocations` recomputes from `_getMarketAssets` rather than trusting the cache). No admin sets the rate.
- **The only offchain dependency is the rebalance planner.** `OptimizerReader` computes plans offchain; the onchain `rebalance()` then enforces (i) exact ordering match against `approvedCTokensList`, (ii) withdrawals == deposits, (iii) no market paused for the relevant action, (iv) post-state within `allocationCaps`, (v) post-state within caller bounds. A stalled keeper degrades yield optimisation and lets allocations drift above caps; it cannot lose principal.
- **`accrueIfNeeded()` is permissionless**, so anyone (including a Yearn keeper) can force NAV to be current.
- **Documented rounding forgiveness:** *"Permissionless accrual can therefore advance the watermark when an individual positive fee increment is too small to mint a fee share, permanently forgiving that dust amount."* This is protocol-revenue dust, not user principal, and is moot while `fee() == 0`.

### External Dependencies

| Dependency | Role | Criticality | Failure mode for hyAUSD |
|---|---|---|---|
| **Curvance isolated markets** (2× `BorrowableCToken` + `MarketManagerIsolated`) | Where 100% of AUSD sits | **Total** | Bad debt socialises directly into NAV; redeem-pause freezes exits |
| **Agora AUSD** [`0x00000000…012a`](https://monadscan.com/address/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a) | The underlying itself | **Total** | Upgradeable ERC-1967 proxy (impl [`0xc1e3c7d4…12da`](https://monadscan.com/address/0xc1e3c7d486d6a92fbe920232e439eec2ceb112da), admin [`0xB8fCC66d…dedee`](https://monadscan.com/address/0xB8fCC66d613e5f54ee6A425DDbf4a2fDBE4Dedee)). Monad supply 132,763,800 AUSD. Roles read onchain: `MINTER_ROLE` [`0x65e28662…D7fF`](https://monadscan.com/address/0x65e28662b0DCD6D89d4652A61FB0896d4F58D7fF) (**EOA**), `FREEZER_ROLE` [`0xcF7D2a52…4681`](https://monadscan.com/address/0xcF7D2a525057555d7b4816941185b7ae10E94681) (**EOA**), `ACCESS_CONTROL_MANAGER_ROLE` [`0x68898B77…30e2`](https://monadscan.com/address/0x68898B77EbF7b55dCA8A2e62d6Fd74959a2930e2) (**EOA**), `BRIDGE_MINTER_ROLE` [`0x9CaB7Ede…689b`](https://monadscan.com/address/0x9CaB7Ede13dc56652E44D2404E969C212f22689b) (contract). `isFreezingPaused()` = false, so the freezer can freeze the vault's or the markets' AUSD balances |
| **Pendle (Monad)** — PT-AUSD-8OCT2026, SY AUSD, YT | Collateral in market A | High | PT/SY contract failure, or a PT market-price gap vs the model oracle, impairs market A's collateral |
| **Avant avUSD/savUSD** | Collateral in market B | **Critical** | ~99.4% of avUSD backing is offchain and unverifiable; the sole registered custodian is an EOA; one EOA holds every admin key across avUSD, savUSD, the minting contract and the CCIP pool, and can mint unbacked avUSD via `setMinter`. A strategy loss or a key compromise impairs market B, and the Curvance oracle has no avUSD/USD feed to see it |
| **Chainlink CCIP** (`BurnMintTokenPool` [`0xc5cAAC64…8D3E`](https://monadscan.com/address/0xc5cAAC64Dd93b6E2B369d52610Fdae069e568D3E)) | Mints savUSD on Monad | High | A CCIP-path compromise or a malicious pool owner can mint unbacked savUSD, post it as collateral, and borrow out market B's AUSD, leaving socialised bad debt. Inbound capacity from the Avalanche lane is 44.88M savUSD — ~3× current posted collateral |
| **Chainlink OCR2 data feeds (Monad)** | All collateral pricing | High | AUSD/USD [`0x253c9599…51Af`](https://monadscan.com/address/0x253c95994246DE5A83AAFE82909681522DA051Af) (`DualAggregator 1.0.0`), savUSD/avUSD exchange rate [`0x8ABac2dD…7501`](https://monadscan.com/address/0x8ABac2dDBE08ED7CC26a5275355e8231AdBE7501) (`AccessControlledOCR2Aggregator 1.0.0`), USDC/USD [`0x6789f81a…56AB`](https://monadscan.com/address/0x6789f81a983AfE7bd4C2a557c27084Ab705e56AB). All owned by Chainlink's 4-of-N Safe [`0x73877Fe3…c4F1`](https://monadscan.com/address/0x73877Fe34aA2b162430CeF680FEA268B8Ec1c4F1). Feeds were fresh at assessment (updated within seconds of the read) |
| **Monad L1** | Everything | Total | New high-throughput L1; single-sequencer/consensus risk and RPC availability are outside Curvance's control |

**Oracle wiring, verified onchain.** `CentralRegistry.oracleManager()` = [`0x65ADF8aE…37c5`](https://monadscan.com/address/0x65ADF8aE8420A58278De066593E6fF1713A137c5), and all three relevant assets resolve to a **single** `ChainlinkAdaptor` [`0x42B318ab…22e1`](https://monadscan.com/address/0x42B318abFDE82a43B3685eB65a5863B9367B22e1) — there is no second pricing adaptor per asset, so a bad route for an asset has no redundant source.

- **PT-AUSD** → `PendlePTAggregator` [`0x3ED78CA0…6134`](https://monadscan.com/address/0x3ED78CA090d4B20aC043505A880A04B0f23B6134), which multiplies the AUSD/USD feed by a **fixed linear discount to maturity** (`WAD − timeToExpiry × discountOneYear / SECONDS_PER_YEAR`); at maturity it returns exactly WAD. Current output $0.98590 implies ≈9.8% annualised discount. This is the conservative, non-manipulable approach (no AMM TWAP, so no Pendle-pool price manipulation vector), but it is also **not a market price**: if PT trades below the model — e.g. a sharp AUSD-yield repricing or a Monad Pendle liquidity crunch — the oracle keeps quoting the model value, liquidations do not trigger, and market A can be economically under-collateralized while reporting 107% CR. Because PT redeems at par on October 8, 2026, this is primarily a *duration and liquidation-execution* risk rather than a permanent credit loss — provided AUSD holds and the market can wait to maturity.
- **savUSD** → `CombinedAggregator` [`0x7CB9a321…4999`](https://monadscan.com/address/0x7CB9a321c30c753c3F7C6af7Ae8776E5C1524999) = **USDC/USD × savUSD/avUSD**. **There is no avUSD/USD feed anywhere in the route.** avUSD is assumed to be worth exactly one USDC. Curvance's own contract comments name this exact limitation: *"if AUSD depegs and loses value, this may remain hidden from the guard due to an increase in the [secondary] rate… the primary price [is left] without an effective guard."* An avUSD depeg — the realistic failure mode for an offchain delta-neutral synthetic dollar — would leave market B's 92%-LTV loans priced off a collateral value that no longer exists, and the resulting bad debt lands on hyAUSD.

**Fallbacks:** the `OptimizerReader` defensive-routing path can flag a market whose collateral feed is stale or whose price guard is breached and exclude it from future allocations, pulling liquidity out when the market is not redeem-paused. This is a keeper-triggered mitigation, not an automatic onchain circuit breaker, and it cannot exit a market that has been redeem-paused.

## Operational Risk

- **Team: public.** Curvance was founded in 2022 by Chris Carapola and Michael Butcher. Funding: $3.6M seed (Dec 2023, incl. Offchain Labs, Wormhole, Sandeep Nailwal) and a **$4M strategic round in Nov 2025** led by F Prime Capital and 0xPrimal with Auros, GSR, Flowdesk, Q42 and v3v ventures ([Crunchbase](https://www.crunchbase.com/organization/curvance)).
- **Documentation: good in the places that matter, stale in one that matters a lot.** The Earn Vaults page and the in-repo `docs/lending-optimizer-integration.md` are unusually candid — they self-disclose the loss-recognition race, the non-continuous caps, the fee-dust forgiveness and the transitive-dependency gap. That is above-average transparency. **But the published [Monad Contract Addresses](https://docs.curvance.com/app/protocol-overview/monad-contract-addresses) page is materially out of date**: the Earn Vaults section lists one row ("AUSD Flagship") with a blank address; neither hyAUSD nor either of its markets or market managers appears; and the `OracleManager` it lists (`0x32faD39e…CDb6`) is **not** the one `CentralRegistry` actually points at (`0x65ADF8aE…37c5`). Since the bug-bounty scope is defined by that page, the staleness has a direct security consequence, not just a documentation one.
- **Legal structure:** Cayman Islands per [Crunchbase](https://www.crunchbase.com/organization/curvance); [Terms of Use](https://app.curvance.com/terms-of-use) exist but were not machine-readable for jurisdiction extraction. Governance is a "Curvance Collective" DAO around the CVE/veCVE token, but the live control surface is the two Safes above, not a token vote.
- **Incident response: one real test, passed.** The February 16, 2026 frontend attack was detected by security partners and blocked with no fund loss, and the team publicly committed to time-locked upgrades and a strengthened bounty afterwards. There is no published, versioned incident-response runbook. The mass-pause tooling (two purpose-built contracts, one pause-only) is concrete evidence of pre-built emergency capability.

## Monitoring

**Vault — [`0xaD663aC84052b52BE4ed1b27BA416505e84a00Bf`](https://monadscan.com/address/0xaD663aC84052b52BE4ed1b27BA416505e84a00Bf)**

| What | How | Threshold / alert | Frequency |
|---|---|---|---|
| NAV per share | `exchangeRateUpdated()` (state-changing; forces accrual) or `accrueIfNeeded()` then `exchangeRate()` | **Any decrease** — this vault has no mechanism that legitimately lowers PPS except realized bad debt. Alert on any tick below the previous high | Hourly |
| Reserve reconciliation | `totalAssets()` vs Σ `cToken.convertToAssets(cToken.balanceOf(vault))` over `getApprovedMarkets()` | Divergence >0.1% after a forced accrual | Hourly |
| Approved market set | `getApprovedMarkets()`; events `MarketAdded`, `MarketRemoved` | **Any change — page immediately.** This is the drain-path signal | Every block / event-driven |
| Allocation vs cap | `cToken.convertToAssets(balanceOf(vault)) / totalAssets()` vs `allocationCaps(cToken)/1e18` | Live allocation > cap (caps are not continuously enforced); or any market >70% | Hourly |
| Performance fee | `fee()`; event `FeeUpdated` | **Any non-zero value** (currently 0; ceiling 5000 BPS) | Event-driven |
| Deposit pause | `mintPaused()`; event `ActionPaused` | != 1 | Hourly |
| Rebalance keeper health | `Rebalanced` events; sender address | No event for >24 h (median gap is 3 h); **or a sender other than a known harvester EOA** | Hourly |
| Exit liquidity | Σ `min(vault position, cToken.assetsHeld())` = `_availableWithdrawLiquidity()`; proxy via `maxWithdraw(ourAddress)` | **< our position size**, or < 15% of `totalAssets()` | Hourly |
| Share concentration | `Transfer` logs / top-holder balances | Top holder > 40% of supply (currently 45.97%) | Daily |

**Underlying markets — [`0xbDe2459A…6c93`](https://monadscan.com/address/0xbDe2459A033f20442CE18483CDD48643D80C6c93) and [`0xD1BFEA17…91D4`](https://monadscan.com/address/0xD1BFEA1728ffe98F515f26082fACfcc3341691D4)**

| What | How | Threshold | Frequency |
|---|---|---|---|
| Utilisation | `marketOutstandingDebt()` / `totalAssets()` | >95% warn, >98% page (both ~90% today) | Hourly |
| Idle cash | `assetsHeld()` | < our position, or a >50% day-over-day drop | Hourly |
| Market-wide CR | collateral cToken `marketCollateralPosted()` × oracle price ÷ `marketOutstandingDebt()` | Market A <105% (soft-liq req 103%), Market B <108% (soft-liq req 104.5%) | Hourly |
| Redeem / mint / borrow pause | `MarketManagerIsolated.redeemPaused()`, `transferPaused()`, `liquidationPaused()`, `actionsPaused(cToken)` | **Any value != 1 on redeem or liquidation — page immediately** (redeem-pause on either market freezes all hyAUSD exits) | Every block / event-driven |
| Risk parameters | `collConfig(collateral)`, `collateralCaps`, `debtCaps`, `IRM()` | Any change to LTV, liquidation requirement, or caps | Event-driven |
| cToken exchange rate | `cToken.exchangeRateUpdated()` | **Any decrease** = realized bad debt socialisation | Hourly |

**Governance — [`CentralRegistry 0x1310f352…12fF`](https://monadscan.com/address/0x1310f352f1389969Ece6741671c4B919523912fF)**

| What | How | Threshold | Frequency |
|---|---|---|---|
| Permission grants | Events `PermissionsUpdated(string,address,bool)` (topic0 `0x40f7b3ef…feb9`) and `PermissionsTransferred(string,address,address)` (topic0 `0xd8e12777…211d`) | **Any grant of `Market`, `Harvest` or a DAO/EC/Timelock transfer — page immediately** | Every block |
| Market-manager registry | `marketManagers()` (26 entries today); `PermissionsUpdated("Market Manager", …)` | Any addition — precondition for the `addApprovedAsset` drain path | Every block |
| Governance addresses | `daoAddress()`, `emergencyCouncil()`, `timelock()` | Any change | Daily |
| Safe composition | `getOwners()` / `getThreshold()` on `0x0Acb7eF4…5C02`, `0x379D4a8F…399c`, and the 1-of-5 pause Safe `0x25D41348…0902` | Any signer or threshold change | Daily |
| Timelock queue | `DAOTimelock` [`0x26777386…8C08`](https://monadscan.com/address/0x2677738657F27e1A3591E00AD7E5a78807688C08) scheduled-operation events | Any queued operation touching the optimizer or its markets — 5 days of warning, *when this route is used* | Every block |
| Mass-pause keys | `ProtocolManagerMassPause` events `MassPauseExecuted`, `MarketPauseFailed` on `0xbb82aee1…ad73` and `0x89d2253b…7803` | Any execution | Every block |

**Offchain / cross-chain**

- **CCIP savUSD pool** [`0xc5cAAC64…8D3E`](https://monadscan.com/address/0xc5cAAC64Dd93b6E2B369d52610Fdae069e568D3E): `getCurrentInboundRateLimiterState(6433500567565415381)` (Avalanche lane) and `savUSD.totalSupply()` on Monad vs the amount escrowed/burned on Avalanche. Alert on Monad supply growth >10% in 24 h, on any `owner()` change, or on any rate-limit capacity increase. Daily, event-driven on `owner()`.
- **Avant admin key and reserves (Avalanche)**: this is the least verifiable part of the exposure, so monitor it hardest. Watch `avUSD.minters(address)` via `MinterUpdated` events on [`0x24dE8771…E346`](https://snowtrace.io/address/0x24dE8771bC5DdB3362Db529Fc3358F2df3A0E346) — **any new minter is a page-immediately event**; `owner()`/`pendingOwner()` on avUSD, savUSD and `AvantMintingV2`; `CustodianAddressAdded`/`Removed` and `CustodyTransfer` on [`0xcb43139E…A49c`](https://snowtrace.io/address/0xcb43139E90f019624e3B76C56FB05394B162A49c); `maxMintPerBlock` changes; and `savUSD.totalAssets()/totalSupply()` for any non-monotonic move in the exchange rate. Also alert if `DEFAULT_ADMIN_ROLE` on savUSD is granted to a new address, since that unlocks `redistributeLockedAmount`. Event-driven; the admin EOA had nonce 270 on Avalanche at assessment, so any burst of activity is itself a signal.
- **Avant reserve attestation**: no onchain proof of the ~99.4% offchain backing exists. Track whatever attestation Avant publishes and treat a lapse in reporting cadence as a reassessment trigger.
- **Chainlink feeds**: `latestRoundData()` staleness on all three aggregators; alert if `updatedAt` is older than the heartbeat + grace. Hourly.
- **AUSD roles**: `getMinterRoleMembers()`, `getFreezerRoleMembers()`, `getAccessControlManagerRoleMembers()`, `proxyAdminAddress()` and the ERC-1967 implementation slot on [`0x00000000…012a`](https://monadscan.com/address/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a). Alert on any implementation change or role-set change; also alert if `isAccountFrozen()` returns true for the vault or either market. Daily.
- **Pendle PT maturity**: PT-AUSD expires **October 8, 2026**. Market A must be rolled or wound down; reassess before that date. There is no automatic handling in the optimizer.
- **DefiLlama** [`api.llama.fi/protocol/curvance`](https://api.llama.fi/protocol/curvance) as an independent TVL cross-check. Daily.

## Appendix: Contract Architecture

```
GOVERNANCE
  DAO Safe 3/4                  Emergency Council Safe 4/5        DAOTimelock (5 days)
  0x0Acb7eF4…5C02               0x379D4a8F…399c                   0x2677738657…8C08
  hasDaoPermissions             DAO+ELEVATED+MARKET               DAO+ELEVATED+MARKET
        │                              │        │                        │
        │                              │        └────────┐               │
        │                              │                 │               │
        └──────────────┬───────────────┴─────────────────┼───────────────┘
                       ▼                                 ▼
            ┌──────────────────────────┐   Pause Safe 1-of-5  0x25D41348…0902
            │   CentralRegistry        │        │  owns
            │   0x1310f352…12fF        │        ▼
            │  (immutable, non-proxy)  │   ProtocolManagerMassPause (pause-only)
            │  hasDao / hasElevated /  │   0x89d2253b…7803  ──► pauseAll(markets)
            │  hasMarket / hasHarvest  │        (2nd instance 0xbb82aee1…ad73,
            └──────────┬───────────────┘         owned by EC, canUnpause=true)
                       │ permission root (immutable ref on the vault)
   Harvester EOAs      │
   0x97f6886d…4521 ────┤ hasHarvestPermissions → rebalance()
   0xd21dc65f…cbc7 ────┘
                       │
VAULT / TOKEN LAYER    ▼
            ┌────────────────────────────────────────────┐
            │  LendingOptimizer  "hyAUSD"                │  totalAssets 18.35M AUSD
            │  0xaD663aC8…00Bf   (non-proxy, 6 dp)       │  totalSupply 18.21M
            │  ERC-4626-like · fee 0 BPS · HWM 1.0       │  rate 1.007984
            │  77,777 dead shares at address(0)          │  95 holders, top-1 46%
            └───────┬─────────────────────────┬──────────┘
                    │ 60.0% (cap 90%)         │ 40.0% (cap 40%)
                    ▼                         ▼
PROTOCOL LAYER  ┌──────────────────┐    ┌──────────────────┐
                │ BorrowableCToken │    │ BorrowableCToken │
                │ cAUSD (PT mkt)   │    │ cAUSD (savUSD)   │
                │ 0xbDe2459A…6c93  │    │ 0xD1BFEA17…91D4  │
                │ util 90.97%      │    │ util 89.66%      │
                │ idle 2.11M AUSD  │    │ idle 1.75M AUSD  │
                └───────┬──────────┘    └───────┬──────────┘
                        │ listed in              │ listed in
                ┌───────▼──────────┐    ┌───────▼──────────┐
                │ MarketManager    │    │ MarketManager    │
                │ Isolated         │    │ Isolated         │
                │ 0xdDd5681f…ec2e  │    │ 0x4B0a39eC…09F7  │
                │ LTV 95% soft103% │    │ LTV 92% soft104.5%│
                │ redeemPaused=1   │    │ redeemPaused=1   │
                └───────┬──────────┘    └───────┬──────────┘
                        │ collateral             │ collateral
                ┌───────▼──────────┐    ┌───────▼──────────┐
                │ cPT-AUSD-8OCT2026│    │ csavUSD          │
                │ 0x6eD14BA7…3bF8  │    │ 0x2552232c…7c2f  │
                │ 23.09M PT posted │    │ 15.36M savUSD    │
                └───────┬──────────┘    └───────┬──────────┘
UNDERLYING LAYER        ▼                        ▼
                Pendle PT-AUSD            savUSD (Monad)
                0x9FC74f8E…02d1           0x9648dB94…06c6
                expiry 2026-10-08         FactoryBurnMintERC20
                  │ SY AUSD                 │ minted by
                  ▼                         ▼
                AUSD  ◄───────────────  CCIP BurnMintTokenPool
                0x00000000…012a         0xc5cAAC64…8D3E
                (Agora, upgradeable,    owner 0xd4d23209…57cb
                 EOA minter/freezer)    ← Avant savUSD (Avalanche)

ORACLE LAYER
  OracleManager 0x65ADF8aE…37c5
        └─► ChainlinkAdaptor 0x42B318ab…22e1  (single adaptor for all three assets)
              ├─ PT-AUSD  ─► PendlePTAggregator 0x3ED78CA0…6134
              │                = AUSD/USD × linear discount to 2026-10-08
              ├─ savUSD   ─► CombinedAggregator 0x7CB9a321…4999
              │                = USDC/USD × (savUSD/avUSD)   ← NO avUSD/USD feed
              └─ AUSD     ─► EACAggregatorProxy 0xEd21588e…eBf3 → DualAggregator
                               0x253c9599…51Af (Chainlink OCR2, owner Safe 0x73877Fe3…c4F1)
```

---

## Risk Summary

### Key Strengths

- **No upgradeability anywhere on the path.** The optimizer, both cTokens, both market managers, the CentralRegistry and the timelock are all non-proxy, source-verified contracts. `centralRegistry` is `immutable` on the vault. Code cannot be swapped under depositors.
- **Fully onchain, permissionlessly provable NAV.** Reserves reconcile in two calls; `accrueIfNeeded()` is open to anyone; there is no admin-set price, no offchain accountant, no keeper-submitted unit price. Reserves (18,351,912 AUSD) exceed shares (18,206,533) with zero idle dust.
- **No unbacked-mint path.** Mint is permissionless and atomically collateral-backed, shares are derived from post-rounding *recoverable* value, and 77,777 dead shares block inflation attacks. The only privileged mint is a performance-fee share mint that is currently disabled (`fee()` = 0).
- **Unusually candid operator documentation.** Curvance self-discloses the loss-recognition race, the fact that caps are not continuous limits, the fee-dust forgiveness, and the transitive-dependency gap — including in the deployed contract's own NatSpec. That is materially better disclosure hygiene than most curated-vault products.
- **Audited stack underneath, with real emergency tooling.** The isolated-market layer carries three 2025 reviews (Sherlock, TrustSec ×2) plus Trail of Bits and Cantina on the core; purpose-built mass-pause contracts and a defensive-routing planner exist and are deployed.

### Key Risks

- **The contract holding the money has never been audited.** `LendingOptimizer` appears zero times across all six published reports, the newest of which predates its deployment by seven months — and it is simultaneously **outside the bug-bounty scope**, because the bounty is defined by a docs page that does not list it.
- **A 4-of-5 multisig can drain the vault instantly.** Elevated permissions allow registering a market manager and adding an approved market with no delay; a harvester can then rebalance into it. The 5-day timelock is a parallel route, not a gate, and observed practice uses the Emergency Council route.
- **A 1-of-5 Safe can freeze 100% of withdrawals.** `ProtocolManagerMassPause` `0x89d2253b…7803` can redeem-pause every market; the optimizer reverts all withdrawals if *any* approved market is redeem-paused; and that key cannot unpause itself.
- **Only 21% of the vault can exit today.** Both markets run at ~90% utilisation; instantly available liquidity is 3.85M AUSD against 18.35M NAV, and the single largest holder (46%) is 2.2× larger than that budget.
- **40% of the vault is lent at 92% LTV against collateral whose backing is ~99.4% offchain and unverifiable.** Tracing Avant on Avalanche: $0.01 of collateral sits in `AvantMintingV2` and $741,565 at the sole registered custodian — itself an **EOA** — against 127,269,028 avUSD outstanding. Collateral is routed straight from depositor to custodian at mint time and never touches a protocol contract. The Curvance oracle then prices savUSD as `USDC/USD × savUSD/avUSD` with **no avUSD/USD feed anywhere in the route**, so neither the backing nor a depeg is observable from Monad. A 10.51% junior-tranche + Reserve Fund buffer sits beneath savUSD, which is real but thin against a 92% LTV book. Bad debt in either market socialises straight into hyAUSD's exchange rate.
- **55 days of production history**, high holder concentration (top 5 = 89.6%), and a hard calendar event (PT maturity, October 8, 2026) that requires an operator roll.

### Critical Risks

1. **Unaudited, out-of-bounty custody contract.** If Yearn's standard is that the contract directly holding strategy funds must have third-party review, this is a blocking issue today, independent of everything else. Mitigation would be a published audit of `LendingOptimizer` (and `LendingOptimizerShareCToken`), plus adding `0xaD663aC8…00Bf` and both markets to the Monad Contract Addresses page so they fall inside the $250K bounty scope.
2. **Instant, no-delay drain path via elevated permissions** (`addMarketManager` + `addApprovedAsset` + `rebalance`), exercisable by a 4-of-5 Safe whose signer set is the same five people who also operate a 1-of-5 pause key. Requires block-level monitoring of `PermissionsUpdated` and `MarketAdded` with an automated exit trigger.
3. **Single-signer withdrawal freeze**, recoverable only by a different key. Any position must be sized assuming exits can be blocked without warning.
4. **A single non-multisig, non-timelocked key is the whole onchain trust surface behind 40% of the vault's collateral.** [`0xd4d23209…57cb`](https://snowtrace.io/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb) has no code on either Avalanche or Monad — plausibly MPC rather than a hot EOA, but with no onchain quorum or delay either way — and is simultaneously `owner()` of avUSD, `owner()`/`DEFAULT_ADMIN_ROLE` of savUSD, `owner()`/`DEFAULT_ADMIN_ROLE`/`COLLATERAL_MANAGER_ROLE` of `AvantMintingV2`, and `owner()`/`getCCIPAdmin()` of the Monad savUSD token and its CCIP pool. avUSD's `setMinter(address,bool)` is `onlyOwner`, so that one key can mint unbacked avUSD without limit. Separately, a CCIP-path compromise can mint unbacked savUSD directly on Monad (inbound lane capacity 44.88M vs 15.36M posted) and borrow out market B. Both land on hyAUSD holders through bad-debt socialisation. *Bounded, and verified as such:* `burnFrom` still spends allowance so the market's savUSD cannot be seized, `rescueTokens` blocks draining the staking vault so the savUSD/avUSD rate is safe, and a **10.51% first-loss buffer** (12.62M junior tranche + 0.75M Reserve Fund) absorbs losses before savUSD.
5. **First-mover exit advantage on unrecognised impairment.** Curvance documents that pooled liquidity can fund an exit before an impaired cToken recognises its loss, concentrating the loss on whoever is still in. A large, procedurally-slow holder such as a Yearn vault is structurally the last one out.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

If ANY gate is triggered, the protocol automatically receives a score of **5** (High Risk).

- [ ] **Unverified contract source** — **PASSES.** Every contract on the path is source-verified and non-proxy on chain 143: `LendingOptimizer`, both `BorrowableCToken`s, both `MarketManagerIsolated`s, `CentralRegistry`, `DAOTimelock`, `OracleManager`, `ChainlinkAdaptor`, `PendlePTAggregator`, `CombinedAggregator`. Confirmed via Etherscan V2 `getsourcecode` (`Proxy: 0`, empty `Implementation`).
- [ ] **No audit** — **PASSES, narrowly and with a caveat.** The gate is written at protocol level, and the Curvance lending stack the vault sits on has been reviewed by Sherlock (Sept 2025), TrustSec (Oct + Nov 2025), Trail of Bits (May 2025) and Cantina (Apr 2025). The gate is therefore not triggered. **But the assessed contract itself has no audit coverage**, so this is carried as the dominant penalty in Category 1 (scored 4.5) and as Critical Risk #1 rather than as a gate.
- [ ] **Unverifiable reserves** — **PASSES.** 100% onchain, two-call reconciliation, permissionless forced accrual.
- [ ] **Total centralization** — **PASSES.** Control sits with a 3-of-4 Safe, a 4-of-5 Safe and a 5-day timelock, not a single EOA. (The 1-of-5 *pause-only* Safe and the two harvester EOAs are real weaknesses but are not unilateral control of funds; they are scored in Category 2.)

**All gates pass** — proceeding to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 4.5/5**

Six audits exist and three of them (Sherlock, TrustSec ×2) genuinely cover the lending markets the vault deposits into. But the rubric asks about the assessed thing, and the assessed thing is a 1,513-line custody contract with **zero** audit coverage — verified by full-text search of all six PDFs — that is also **excluded from the bug bounty** because it is missing from the scope-defining docs page. The self-run bounty (max $250K critical, email intake, no hosted platform) is weaker than a comparable Immunefi program, and no remediation matrix was published for the existing findings. The contract surface is moderately complex at the vault level and substantially complex underneath. Scored between "1 audit by lesser-known firm or dated" (4) and "no audit" (5): **4.5**.

**Subcategory B: Historical Track Record — 4.5/5**

Vault deployed **June 23, 2026 — 55 days ago**, which is squarely "<3 months" (5). Scale is $18.35M, which is "≥$10M" (3). The protocol beneath is 9 months live on Monad with $88.46M TVL and one non-contract incident handled cleanly, which pulls the blend up; holder concentration (top 5 = 89.6%) and the fact that the two markets are themselves only ~2 months old push it back down. **4.5**.

**Audits & Historical Score = (4.5 + 4.5) / 2 = 4.5**

**Score: 4.5/5** — audited stack, unaudited and out-of-bounty vault, two months of history.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 4/5**

Positives: nothing is upgradeable, the permission root is immutable on the vault, and a 5-day timelock exists. Negatives, all verified onchain: the **Emergency Council 4-of-5 Safe holds elevated + market permissions with no delay**, and that combination is a complete drain path (`addMarketManager` → `addApprovedAsset` → `rebalance`); the timelock is a parallel route rather than a gate, and observed practice (both `AllocationCapUpdated` transactions) bypasses it; a **1-of-5 Safe** holding the pause-only mass-pause key can freeze all withdrawals; two **EOAs** hold harvest permissions; and the 1-of-5 Safe shares its signer set with the 4-of-5 EC, so it is not an independent check. This is "powerful admin roles with limited constraints" with an effective delay of zero: **4**.

**Subcategory B: Programmability — 2/5**

PPS is computed onchain from real cToken balances, re-synced from ground truth after every rebalance, and refreshable by anyone. The only offchain component is the rebalance *planner*, whose output is constrained onchain by ordering checks, conservation of assets, pause checks, caps and bounds — a stalled or hostile keeper degrades yield and can concentrate to the caps, but cannot remove principal from the vault. Docked from 1 for the caller-supplied (rather than governance-supplied) rebalance bounds and the documented view-staleness that integrators must work around: **2**.

**Subcategory C: External Dependencies — 4/5**

Six critical dependencies, most of them young: two Curvance isolated markets (total criticality), Agora AUSD (upgradeable, EOA minter/freezer/access-control-manager on Monad), Pendle on Monad, Avant avUSD/savUSD (~99.4% offchain backing, single-EOA admin across every contract), Chainlink CCIP as the *mint* authority for market B's collateral, Chainlink OCR2 feeds through a single non-redundant adaptor, and Monad itself. Failure of any one of the first five impairs or freezes the vault. "Many or newer protocol dependencies / critical functionality depends on them": **4**.

**Centralization Score = (4 + 2 + 4) / 3 = 3.33**

**Score: 3.3/5** — immutable code, but zero-delay multisig control, a single-signer freeze key, and a long young-dependency chain.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5/5**

hyAUSD's *own* backing is 100% onchain and reconciles exactly, and it takes no leverage — in isolation that argues for 2. The score is set by the collateral the vault is indirectly financing, at 95% and 92% LTV in markets running ~90% utilisation, with bad debt socialising straight into NAV and no first-loss buffer.

The two legs are very different and the blend is what matters:

- **60% — PT-AUSD (≈2.5).** Priced by a fixed model discount rather than by market, which removes AMM manipulation but means the oracle can overstate a distressed PT. Bounded, though: it redeems at par into AUSD on October 8, 2026, and the collateral is fully onchain and countable. The live risk is liquidation execution on a thin Monad Pendle market, not permanent credit loss.
- **40% — savUSD (≈4).** Tracing the canonical stack on Avalanche (see Collateralization above) shows **$0.01 of collateral in `AvantMintingV2` and $741,565 at the sole registered custodian against 127,269,028 avUSD outstanding, so ~99.4% of the backing is offchain and unverifiable**, with no reserve attestation located. Every admin key across avUSD, savUSD, the minting contract and the Monad CCIP pool sits on **one address with no onchain quorum and no timelock**, able to appoint itself an avUSD minter via `setMinter`. And the Curvance oracle has **no avUSD/USD feed**, so neither the backing nor a depeg is observable from Monad. That is "partially collateralized or custodial / opaque reporting" (4). It does not go past 4, because three mitigations are real and were verified rather than taken on trust: a **10.51% first-loss buffer** (12.62M junior tranche + 0.75M Reserve Fund) sits below savUSD, the key is plausibly MPC rather than a hot EOA and is covered by an ongoing Trail of Bits OPSEC engagement, and neither seizure of the Monad collateral nor draining of the savUSD/avUSD rate is possible.

Blending 60/40 gives ≈3.1; taken conservatively for the compounding of unverifiable backing *with* an oracle that cannot price it: **3.5**.

**Subcategory B: Provability — 2/5**

Fully onchain and anyone can verify; accrual is permissionless; no attestations or custodians are involved. Not a 1, for two documented reasons: views are cached and stale between accruals (integrators must force accrual atomically), and NAV does not reflect borrower impairment until the cToken recognises it — which is exactly when a slow holder gets left with the concentrated loss. **2**.

**Funds Management Score = (3.5 + 2) / 2 = 2.75**

**Score: 2.75/5** — impeccable accounting over collateral that is thinner, worse-priced and far less verifiable than the accounting implies, partly offset by a real 10.5% first-loss buffer beneath the weaker leg.

#### Category 4: Liquidity Risk (Weight: 15%)

Exit is direct redemption at NAV with no queue, no fee and no cooldown — but capped at the underlying markets' idle cash, which is **3.85M AUSD against 18.35M NAV (21%)** at both markets' ~90% utilisation. The largest holder is 2.2× that budget. There is no secondary market for hyAUSD. A full exit for a large position depends on borrower repayment driven by the dynamic IRM — realistically days, and longer under stress. On top of that sits a hard restriction: a redeem-pause on *any* approved market blocks *all* withdrawals, and two `LendingOptimizerShareCToken` markets can force additional redemption pressure through liquidations. This is worse than "market-based or short queues, 3–7 days for full exit" (3) but better than "no liquidity / >10% impact" (4), since redemption is at par with no slippage when liquidity is present. Applying the +0.5 throttle modifier for the all-markets pause coupling to a base of 3: **3.5**.

**Score: 3.5/5** — par redemption, but only for the first fifth of the vault, and freezable wholesale.

#### Category 5: Operational Risk (Weight: 5%)

Team is public and named (Chris Carapola, Michael Butcher), with $7.6M raised across two rounds from identifiable funds (F Prime, GSR, Flowdesk, Auros, Offchain Labs). Documentation is genuinely good where it counts — the in-repo operations doc discloses risks most teams hide — and there is a demonstrated, successful incident response (Feb 2026 frontend attack, no losses). Against that: the **published Monad address registry is stale and incomplete** (assessed vault and both its markets absent; the listed `OracleManager` is not the live one), which is not merely cosmetic because the bug-bounty scope is defined by that page; no versioned incident-response runbook is published; and the legal entity (Cayman, per Crunchbase) could not be confirmed from primary sources. Between "fully doxxed, excellent docs, clear structure" (1) and "adequate with some gaps" (3): **2.5**.

**Score: 2.5/5** — public, well-funded, well-documented team with a materially out-of-date public contract registry.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.5 | 20% | 0.900 |
| Centralization & Control | 3.33 | 30% | 1.000 |
| Funds Management | 2.75 | 30% | 0.825 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.4/5.0** |

**Optional Modifiers:**
- Protocol live >2 years with no incidents: **not applicable** (55 days for the vault, 9 months on Monad)
- TVL maintained >$500M for >1 year: **not applicable** ($18.35M vault, $88.46M protocol)
- Final score capped at 1.0 minimum and 5.0 maximum

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |
| **N/A** | **Not Rated** | Terminal — do not use (exploited or wound down) |

**Final Risk Tier: Medium Risk** (weighted total 3.375, reported as 3.4 — the upper half of the Medium band. Any deterioration in the savUSD leg — a new avUSD minter, a further cap increase, erosion of the 10.5% junior buffer, or a lapse in reserve reporting — pushes this toward Elevated rather than down.)

**Integration notes for a Yearn strategy.** The score sits at the ceiling of Medium and is held up by good accounting, not by good risk isolation — the vault's own machinery is sound, while the collateral two layers down is custodial and single-key. If Yearn proceeds:

- **Size the position against exit liquidity, not TVL.** Cap allocation at a fraction of `_availableWithdrawLiquidity()` (currently 3.85M AUSD), not of the 18.35M NAV, and re-check before every deposit.
- **Treat Critical Risk #1 as a precondition.** An audit of `LendingOptimizer` and the addition of `0xaD663aC8…00Bf` plus both markets to the Monad Contract Addresses page (which puts them in the $250K bounty scope) would materially move Category 1 and, with it, the tier.
- **Force accrual atomically.** Never value the position from a raw `totalAssets()`/`exchangeRate()` read; call `accrueIfNeeded()` in the same transaction, per Curvance's own integration guidance.
- **Do not rely on the timelock.** Every governance action relevant to this vault has a zero-delay Emergency Council route. Block-level alerting on `PermissionsUpdated`, `MarketAdded`, `MarketRemoved` and `FeeUpdated` with an automated withdrawal trigger is the only meaningful defence.
- **Treat market B's 40% as custodial exposure, not DeFi collateral.** Its backing cannot be verified onchain and its entire admin surface is one EOA. If Yearn's mandate excludes single-key custodial dependencies, that alone caps the acceptable position size well below the vault's liquidity ceiling — or rules it out until Avant moves those keys to a multisig and publishes reserve attestations.
- **Plan for October 8, 2026.** PT-AUSD maturity requires an operator roll of market A. Reassess before that date regardless of the time-based trigger.

---

## Reassessment Triggers

- **Time-based**: Reassess in **3 months** (by November 17, 2026), or sooner — the vault is 55 days old and the score is dominated by facts that change quickly.
- **Calendar-based**: Reassess **before October 8, 2026** (PT-AUSD-8OCT2026 maturity, market A collateral roll).
- **TVL-based**: Reassess if vault `totalAssets()` changes by more than 40% in 30 days, or if available exit liquidity falls below 10% of NAV.
- **Scope-based**: Reassess immediately if `LendingOptimizer` receives its first audit, or if it is added to the Monad Contract Addresses page (bug-bounty scope).
- **Governance-based**: Reassess immediately on any `MarketAdded` / `MarketRemoved` event, any `PermissionsUpdated` grant of Market or Harvest permissions, any change to the DAO/Emergency Council/timelock addresses or Safe thresholds, or any non-zero `fee()`.
- **Incident-based**: Reassess after any exploit, any redeem-pause on either market, any decrease in the hyAUSD or cAUSD exchange rate (realized bad debt), any avUSD or AUSD depeg, or any CCIP incident affecting the savUSD pool.
- **Counterparty-based**: Reassess immediately if a new avUSD minter is appointed, if the Avant admin EOA changes or is replaced by a multisig (a material improvement worth re-scoring), or if Avant's published reserve attestation lapses or materially diverges from avUSD supply.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| August 17, 2026 | 3.4 | Initial assessment |
