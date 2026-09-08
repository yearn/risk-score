# Protocol Risk Assessment: Saturn (USDat)

- **Assessment Date:** May 27, 2026 (Updated: September 8, 2026)
- **Token:** USDat (Saturn USD)
- **Chain:** Ethereum
- **Token Address:** [`0x23238f20b894f29041f48D88eE91131C395Aaa71`](https://etherscan.io/address/0x23238f20b894f29041f48D88eE91131C395Aaa71)
- **Final Score: 3.15/5.0**

> Assessment requested in [yearn/risk-score#135](https://github.com/yearn/risk-score/issues/135) — *"USDat as collateral"*. This report assesses **USDat**, the non-yielding stablecoin. The staked, yield-bearing **sUSDat** ([`0xD166337499E176bbC38a1FBd113Ab144e5bd2Df7`](https://etherscan.io/address/0xD166337499E176bbC38a1FBd113Ab144e5bd2Df7)) carries materially different (STRC credit) risk and is discussed only as context.

## Overview + Links

**Saturn** is a credit protocol that issues two tokens:

- **USDat** — a fully-collateralized, non-rebasing stablecoin pegged 1:1 to USD. It is an **M0 "extension" token**. At launch (through August 19, 2026) each USDat was backed 1:1 by M0's `$M` token, M0's tokenized U.S. Treasuries product. On **August 19, 2026**, Saturn's Admin Timelock executed a governed proxy upgrade that migrated USDat's backing asset entirely from `$M` to **PYUSDx** ([`0xeBDB0942cE16386Ab90718C7BD10C91CDb66b14d`](https://etherscan.io/address/0xeBDB0942cE16386Ab90718C7BD10C91CDb66b14d)), a separate M0-framework "extension" token backed 1:1 by **PYUSD** (PayPal USD, issued by Paxos Trust Company) via the MoonPay/M0/PayPal **PYUSDx** tokenization framework (launched February 27, 2026). Onboarded (whitelisted) users mint and redeem USDat 1:1 with USDC through Saturn's web application. Yield does **not** accrue to USDat holders — it is routed to a single Saturn-controlled `yieldRecipient`.
- **sUSDat** — an ERC-4626 vault that stakes USDat to earn yield (targeting 11%+) from **STRC**, Strategy's (formerly MicroStrategy) short-term, BTC-backed perpetual preferred-equity instrument. sUSDat redemptions are **queued** (Saturn must liquidate the underlying STRC position before returning USDat).

The key risk separation: **USDat's collateral is a tokenized fiat-stablecoin (PYUSD, via M0/MoonPay's PYUSDx)**, while the STRC/Bitcoin credit exposure sits in the sUSDat yield layer. Yearn's integration target is USDat as collateral.

**On-chain facts (verified September 8, 2026, block [25,933,103](https://etherscan.io/block/25933103), 2026-09-08 14:00:35 UTC, via `RPC_1`/Etherscan API):**
- USDat total supply: **64,102,946.043590 USDat** (`totalSupply()` = `64102946043590`, 6 decimals) — down from 118,250,954.018485 on June 17, 2026 (‑46%)
- `$M` held by the USDat contract: **0** (`M.balanceOf(USDat)`); `isAllowedAsset($M)` = **false**; `assetCap($M)` = **0** — `$M` is fully retired as a backing asset (confirmed from verified source: `$M` was registered as a capped, replaceable legacy asset at the moment of migration, then organically drained via market-callable `replaceAsset`, then its cap was explicitly zeroed by the Asset Cap Timelock on September 1, 2026 — see Funds Management)
- `PYUSDx` held by the USDat contract: **64,102,946.043590** (`PYUSDx.balanceOf(USDat)`) — reconciles **exactly** with `totalSupply()`, i.e. still 100% on-chain backed, 1:1, just with a different underlying asset
- **Mint/burn activity since the August 19, 2026 upgrade (verified via `Transfer` event logs, full range, direct RPC):** 42 mint events totaling ~9.47M USDat, versus **286 burn events totaling ~39.21M USDat** — net **‑29.74M** in this ~20-day window alone, roughly triple the pace of the ‑24.4M net decline over the prior two months (June 17 → August 19: 118.25M → 93.85M). Redemption activity clearly accelerated after the backing migration. Separately, **92 `AssetReplaced` events** (market-callable swaps of legacy `$M` for `PYUSDx`, not new USDat issuance) fired in the same window versus only **33 `AssetWrapped`** (alt-asset deposit) events — see Funds Management for what these mean.
- [DefiLlama TVL](https://defillama.com/protocol/saturn) (Saturn, USDat+sUSDat combined): **~$138.0M** on September 8, 2026, down from a August peak of ~$210M (mid-June) / ~$173-182M (through late August); the sharpest drop (~$173M → ~$146M) occurred in the week following the August 19 upgrade, consistent with the accelerated burn activity above
- sUSDat total supply: **~73.31M shares** (18 decimals), totalAssets: **~$74.41M** (both down from ~98.34M shares / ~$92.48M on June 17, 2026)
- Deployed: **2026-03-10** (proxy creation block 24,629,431); implementation upgraded **2026-08-19** (block [25,789,911](https://etherscan.io/tx/0x489450d4a23d076918ce70adbc4c5693b6634728269ba5991f355447c699b51f), executed through the Admin Saturn Timelock). Verified source (Etherscan API, `getsourcecode`, status OK) shows this is not a patched `JMIExtension` but a **different base architecture**: `USDat` now inherits MoonPay/M0's `MultiMint`/`YieldToOne` "PYUSDX platform" contracts, explicitly documented in-source as an "Upgrade-only PYUSDX extension... replaces the legacy JMIExtension (M-backed) implementation."
- Saturn's own [key-addresses page](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/key-addresses) now also lists USDat/sUSDat deployments on **BNB Chain** and **Monad** — a new cross-chain surface not present in the June 17, 2026 assessment, and **not small**: BNB Chain USDat total supply = **1,989,731.37** (~$2.0M, verified on-chain September 8, 2026) and **Monad USDat total supply = 27,598,577.36** (~$27.6M, same address `0x0Bb150DFa86EA5d7742F07FEfCD8E8edA81D64eF`, verified on-chain via `https://rpc.monad.xyz`). **Combined non-Ethereum USDat supply (~$29.6M) is roughly 46% of Ethereum mainnet's own supply (64.1M)** — this is a materially large cross-chain surface, not a footnote, and its bridging/lockbox/mint mechanism was **not assessed this session** (both chain deployments show small, likely OFT/bridge-wrapper-style bytecode — 830 bytes — clearly distinct from the full mainnet implementation).

**Links:**

- [Protocol Documentation](https://saturncredit.gitbook.io/saturn-docs)
- [Protocol App](https://saturn.credit/)
- [Key Addresses](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/key-addresses)
- [Transparency & Audits](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/transparency-and-audits)
- GitHub Repositories (per audit reports): [`saturn-organization/saturn-dollar`](https://github.com/saturn-organization/saturn-dollar) (USDat) and [`saturn-organization/saturn-yield-dollar`](https://github.com/saturn-organization/saturn-yield-dollar) (sUSDat/vault). Note: the first Saturn Dollar audits covered the earlier self-issued USDat design; Certora Audit #3 covers the deployed M0 [`m-extensions`](https://github.com/m0-foundation) `JMIExtension` design (see Audits).
- [M0 Documentation](https://docs.m0.org/) — underlying `$M` token
- [Serenity Research — USDat Initial Review (May 2026)](https://serenityresearch.substack.com/p/serenity-premium-usdat-by-saturn) (third-party)
- [Alea Research — Saturn: Building Bitcoin's Credit Layer](https://alearesearch.substack.com/p/saturn-building-bitcoins-credit-layer) (third-party)
- LlamaRisk / Steakhouse coverage — TODO (none located as of assessment date)

## Audits and Due Diligence Disclosures

**Four audit reports are published** (Saturn [Transparency & Audits](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/transparency-and-audits)), all reviewed for this assessment:

| # | Firm | Date | Scope (commits) | Findings | Resolution |
|---|------|------|------|----------|------------|
| 1 | **Three Sigma** | 30 Dec 2025 – 12 Jan 2026 | `saturn-dollar` `ad2a465` + `saturn-yield-dollar` `aa762cc` (532 nSLOC) | 0 Crit, 2 High, 5 Med, 13 Low, 3 Info | Both High fixed; 1 Med (USDat-depeg share pricing) acknowledged; 2 Low + 1 Info acknowledged |
| 2 | **Certora** | 16–23 Jan 2026 | `saturn-yield-dollar` `c8c5a4c`→`a55f288`, `saturn-dollar` `bfc6c91` | 0 Crit, 0 High, 2 Med, 8 Low, 5 Info | 11 / 15 fixed; M-02 + several Low acknowledged |
| 3 | **Certora** (Audit #3) | Apr 30 2026 | **Saturn Dollar M0 Extensions** - Saturn extension of M0 for USDat/sUSDat; manual code review plus Certora Prover specification and verification | Full report details issues and verified properties; public summary does not enumerate finding counts | See [Certora report](https://www.certora.com/reports/saturn-dollar-m0-extensions) |
| 4 | **Certora** (Formal Verification) | Apr 30 2026 | Formal verification included in the Saturn Dollar M0 Extensions engagement | Security properties formally proven with Certora Prover | See [Certora report](https://www.certora.com/reports/saturn-dollar-m0-extensions) |

So coverage is strong on paper — two reputable firms, four reports including formal verification. Importantly, Certora Audit #3 is specifically the **Saturn Dollar M0 Extensions** review and covers the M0 `JMIExtension` architecture used by deployed USDat (`0x2323…aa71`, impl `0x17ca…e52e`), including manual review and Certora Prover verification of the contracts in scope.

> **Audit-scope caveat:** the earliest Saturn Dollar audits covered a *self-issued* `saturn-dollar/src/USDat.sol` design (80 nSLOC) described as "a simple ERC20… minted 1:1 against stable assets by whitelisted users," with a `PROCESSOR_ROLE` that **mints** and a `_blacklisted` mapping. The Certora Audit #3 (dated April 30, 2026) covers the **M0 `JMIExtension`** design that was deployed and backed by `$M` (wrap/unwrap, `swapFacility`, `whitelist`, `forceTransfer`).
>
> **New gap identified this reassessment (September 8, 2026):** on August 19, 2026, USDat's implementation was upgraded again (new implementation [`0x496a4A33b6181F4536203488d9a05AC1429E702c`](https://etherscan.io/address/0x496a4A33b6181F4536203488d9a05AC1429E702c), verified source) and 100% of the backing was migrated from `$M` to **PYUSDx**, introducing new functions (`replaceAsset`, `isAllowedAsset`, `assetBalanceOf`, `getReplaceAssetWhitelist`, a `VERSION_MANAGER_ROLE`/`pinnedImplementation` mechanism) not present in the April 30, 2026 Certora scope. **None of the four previously-published audits cover this asset-replacement mechanism or the PYUSDx-backed architecture.** Saturn's [Transparency & Audits page](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/transparency-and-audits) now lists **five** audit report files (up from four as of June 17, 2026); the fifth file's firm, date, and scope could not be determined this session — the page is JavaScript-rendered and titles are not exposed to static fetches. **TODO: identify the fifth audit and confirm whether it covers the PYUSDx migration.**
- **Notable audited findings** (on the prior design, useful context): Three Sigma `H01` — blacklist enforced only on recipient, letting blacklisted senders move tokens (fixed); `H02` / Certora `M-01`,`M-02` — reward-distribution front-running, redistribute-sandwich, and rounding dust leakage in the sUSDat vault (fixed/acknowledged); Three Sigma `M03` / Certora `L-01` — the sUSDat vault assumes USDat = $1, so a USDat depeg or a lag between off-chain STRC purchase and on-chain USDat burn can leave the vault mis-priced/under-backed (acknowledged; client switching the oracle to price STRC in USDat terms and adding a bridge-loan flow). Certora also flagged **no test coverage for StakedUSDat** and that **`PROCESSOR_ROLE` is the dominant trust boundary** in the earlier design.
- Smart-contract architecture complexity: **moderate**. The deployed USDat is a `TransparentUpgradeableProxy` over a well-structured M0/MoonPay extension; novel Saturn surface is small. The sUSDat layer is more complex (multi-token NAV vault + ERC-721 withdrawal queue + processor-driven off-chain settlement).
- **Independent security disclosure found this session, not in any Saturn-published audit or the June 17, 2026 report:** [Innora Security Research](https://gist.github.com/sgInnora/b70ad98327649ed4ab976a122f45e485) published **SAT-001 (Critical)**, **SAT-002 (High)**, **SAT-003 (Medium)**, and **SAT-004 (Informational)** findings against the **sUSDat vault** on **April 14, 2026** (researcher: Feng Ning) — SAT-001 describes an arithmetic underflow in `convertFromStrc()`/`burnQueuedShares()` capable of freezing withdrawals for up to 30 days; SAT-002 describes the PROCESSOR role extracting up to 33.33% per conversion cycle via independently-applied tolerances in `_validateConversion()`; SAT-003 describes front-running risk in `redistributeLockedAmount()`. The researcher reported disclosing immediately rather than via standard 90-day coordinated disclosure, citing "structural indicators suggesting intentional design," and that the contract was **unpatched, unpaused, unaudited** as of the disclosure date. **This session could not independently verify current patch/exploit status, whether Saturn responded, or whether findings are disputed** — `sUSDat.paused()` reads **false** as of September 8, 2026 (no active pause), but that alone doesn't confirm a fix. This affects **sUSDat** (context layer), not USDat's own backing, but is directly relevant to the "sUSDat context risk" already carried in this report's Key Risks, and to Saturn's operational/security-responsiveness track record. **TODO: high-priority follow-up** — determine current status of SAT-001/002/003/004.

### Bug Bounty `[If Applicable]`

- No bug bounty program — confirmed absent from the docs as of June 17, 2026 (via the GitBook docs Q&A endpoint) and not found on Immunefi; independently corroborated by the Innora disclosure above ("no publicly listed security contact"), not re-checked directly this session.
- Safe Harbor (SEAL) adoption: **TODO** — not confirmed.

## Historical Track Record

- **Time in production: ~6 months** (USDat deployed 2026-03-10, assessed September 8, 2026). Still young; has now been through one major backing-asset migration (see Funds Management).
- TVL: DefiLlama's combined Saturn (USDat+sUSDat) figure peaked around **~$210M** in mid-June 2026, held roughly **$173-190M** through late August, then dropped to **~$138M** by September 8, 2026. USDat's own on-chain supply fell from 118.25M (June 17) to 64.10M (September 8), a **-46%** contraction, but this was **not a steady decline**: verified `Transfer` event logs show the contraction accelerated sharply after the August 19, 2026 upgrade — a net **-29.74M** in the ~20 days since (286 burn events, ~39.21M, against only 42 mint events, ~9.47M), roughly **triple the pace** of the -24.4M net decline over the prior two months (June 17 → August 19). No depeg accompanied the contraction (Etherscan-quoted USDat price: **$0.9992** on September 8, 2026 — see Liquidity), and redemptions went through the normal 1:1 `unwrap` path rather than distressed AMM selling. This looks like an orderly but genuinely accelerated wave of net redemptions coinciding with the backing migration, not a loss event — but the acceleration itself, and whether it reflects reduced holder confidence in the PYUSDx-backed design, is a live, unresolved question this reassessment surfaces rather than settles.
- Past security incidents: none known. The August 19, 2026 implementation upgrade and backing-asset swap was executed through the governed 5-day Admin Timelock (not an emergency/incident action) — see Funds Management and Centralization.
- Peg history: USDat trades near $1 ($0.9992 quoted September 8, 2026); the Curve USDC/USDat pool is now **imbalanced** toward USDat (see Liquidity), consistent with net sell pressure but not a depeg. No depeg events observed. **TODO: pull a full historical peg/price series (Etherscan Pro / Dune) covering the migration window.**
- Concentration risk from large depositors / holder distribution: **TODO** (holder list requires Etherscan Pro). sUSDat NAV (totalAssets ≈ $74.41M, September 8, 2026) exceeds USDat's own total supply (64.10M), confirming sUSDat's `totalAssets()` is an off-chain NAV accounting figure (including STRC exposure) rather than a literal on-chain USDat balance.
- Funding: **Pre-Seed**: $800K led by **YZi Labs** and **Sora Ventures**. **Seed**: $2M led by **Spartan**.
- **STRC stability history** (sUSDat-layer context, from Saturn's risk analysis): STRC's annualized realized volatility fell from ~15.25% to ~2.14% after a $2.25B reserve was implemented (~Feb 2026); max observed intraday drawdown ~6.03% (2025-11-20). STRC has traded below par 10 times since inception, with the last five recoveries each under 10 days.

## Funds Management

USDat is now built on **MoonPay/M0's "PYUSDX platform" `MultiMint`/`YieldToOne` contracts** (verified from source, `getsourcecode` via Etherscan API, status OK): the new implementation is explicitly documented in-source as an "Upgrade-only PYUSDX extension... replaces the legacy JMIExtension (M-backed) implementation. It is never deployed fresh, so it exposes `migrate` (a reinitializer) rather than `initialize`." This is a base-architecture change, not just a parameter swap. The current fund flow is:

```
Mint (wrap):  PYUSDx ──(whitelisted user, via M0 Swap Facility 0x0bC3…4173)──▶ USDat (1:1, atomic, wrap(recipient,amount))
                            └── PYUSDx is itself backed 1:1 by PYUSD (Paxos Trust Co.) via the MoonPay/M0 PYUSDx framework

Redeem (unwrap): USDat ──(whitelisted user, via M0 Swap Facility)──▶ PYUSDx (1:1, atomic, unwrap(amount))
                            └── swap facility's downstream PYUSDx→PYUSD→USDC settlement not independently verified this session (TODO)

Legacy-asset drain (Aug 19 – Sep 1, 2026, market-callable, NOT whitelist-gated):
  Caller supplies PYUSDx ──replaceAsset──▶ USDat releases $M 1:1 to caller, until $M cap → 0

Yield routing:  yield ──▶ yieldRecipient (0x3dc0…F5b5, Saturn)
```

- The protocol delegates backing entirely to **M0** (via its extension-token framework); the specific extension token changed from `$M` to **PYUSDx**. There is no other on-chain delegation for USDat itself, but PYUSDx introduces two additional off-chain counterparties in the trust chain: **MoonPay Digital Assets Limited** (PYUSDx tokenization framework operator) and **Paxos Trust Company** (PYUSD issuer). Collateral is held as **PYUSDx** on the USDat contract — verified September 8, 2026: `PYUSDx.balanceOf(USDat)` = 64,102,946.043590, exactly matching `USDat.totalSupply()`.
- **The backing-asset swap, mechanism confirmed from source:** on **August 19, 2026** (block [25,789,911](https://etherscan.io/tx/0x489450d4a23d076918ce70adbc4c5693b6634728269ba5991f355447c699b51f)), the Admin Saturn Timelock executed an implementation upgrade to `0x496a4A33b6181F4536203488d9a05AC1429E702c` (verified source, deployed 6 days earlier by "M0: Deployer" `0xF2f1ACbe0BA726fEE8d75f3E32900526874740bB`), which called `migrate()` in the same transaction. `migrate()` verified the contract's held `$M` covered `totalSupply() - totalAssets()`, minted any `$M`-yield surplus to `yieldRecipient`, and **registered the entire `$M` balance (93,846,665.049387) as a capped, replaceable "alt-asset"** (`AssetCapSet($M, 93846665049387)`, same block). From then on, **any account** (whitelist does not gate this path; only an optional, currently-**disabled** `replaceAssetWhitelist` could restrict it — `isReplaceAssetWhitelistEnabled()` = false, verified) could call `replaceAsset` through the swap facility to hand in PYUSDx and pull out `$M` 1:1, up to the registered cap. **92 such `AssetReplaced` calls fired between August 19 and September 8, 2026**, fully draining `$M`. On **September 1, 2026** the Asset Cap Timelock (`0x7D343D17896D2cd87A49b4fB8872298A883f78f7`, executed via `0x59Ebb7143dDDd7b045dE7B0bd0F99446143F1624`) called `setAssetCap($M, 0)`, formally closing the legacy asset off (`isAllowedAsset($M)` and further wraps/replaces now permanently blocked). Net effect: the *decision* to open and later close the `$M` off-ramp was governed (timelocked), but the *pace and volume* of the actual asset-composition swap was market-driven, not a single privileged sweep.
- **PYUSDx is the implicit primary asset, not tracked by `isAllowedAsset`/`assetCap` — resolved, not an anomaly.** Source confirms `_revertIfInvalidAsset` explicitly reverts if `asset == pyusdx`: the `assets`/`isAllowedAsset`/`assetCap`/`assetBalanceOf` accounting in `MultiMint` exists **only** for secondary/legacy "alt-assets" like the retired `$M`. PYUSDx wraps/unwraps go through the separate, always-available 2-argument `wrap(recipient, amount)`/`unwrap(amount)` functions inherited from the base `Extension`/`YieldToOne` contracts, which is why `isAllowedAsset(PYUSDx)` correctly reads **false** by design.
- **Real new issuance vs. legacy-asset churn, since the August 19, 2026 upgrade (verified via `Transfer` event logs):** only **42 mint events (~9.47M USDat)** represent genuine new USDat issuance (`wrap`), against **286 burn events (~39.21M USDat)** — a **~4.5x** higher count and **~4.1x** higher volume of redemptions than new mints in this window, and roughly triple the net-contraction pace of the prior two months. This is separate from, and should not be conflated with, the 92 `replaceAsset` calls above (which swap backing composition without changing `totalSupply`). See Historical Track Record and Liquidity Risk for the risk read on this.
- The **M0 Swap Facility address itself changed**: from `0xB6807116b3B1B321a390594e31ECD6e0076f6278` (still listed on Saturn's [key-addresses page](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/key-addresses), which is now **stale** on this point) to `0x0bC305e7e13113cAEd3f5486849e9518a1cC4173`, confirmed via `USDat.swapFacility()` on-chain September 8, 2026. Only the current `swapFacility()` address can call `wrap`/`unwrap`/`replaceAsset` — the old facility address has lost all such power.
- Whitelist enforcement is **unchanged and confirmed from source**: both the PYUSDx-wrap path and the (now-moot) alt-asset-wrap path call `_revertIfNotWhitelisted` on depositor and recipient; `unwrap` checks the burning account. `replaceAsset` itself carries **no** whitelist check (see above) — only its own, currently-disabled caller whitelist.
- **No USDC-specific cap exists in the new design.** The prior $10M USDC minting cap was a property of the retired `$M`-era `JMIExtension`; the new `MultiMint` contract has no cap field for PYUSDx (it is not tracked in the `assets` mapping at all — see above), so there is currently no on-chain cap on PYUSDx-denominated minting at the USDat-contract layer. Any upstream cap would live in the swap facility or Saturn's off-chain app and was not verified this session.
- **Monitoring delegation changes:** the `ASSET_CAP_MANAGER_ROLE` (still the Asset Cap Timelock, unchanged — see Governance) authorized and later closed the `$M` alt-asset registration described above. This is exactly the "Backing-mix-based" reassessment trigger from the June 17, 2026 report, which has now been **triggered and is the primary driver of this reassessment**.

### Accessibility `[If Applicable]`

- **Who can mint/redeem:** only **whitelisted ("onboarded") addresses**. The whitelist is enforced on `wrap` (mint) and `unwrap` (redeem) via `_revertIfNotWhitelisted` (verified in source). `isWhitelistEnabled()` = **true** on-chain.
- **Regular transfers are NOT whitelist-gated** — verified: the whitelist hooks fire only on `_beforeWrap`/`_beforeUnwrap`, not on `transfer`/`transferFrom`. This is why the Curve pool (not whitelisted) trades freely. **Implication for Yearn: a non-onboarded holder can hold and transfer USDat but cannot mint or redeem directly — its only exit is the secondary market (Curve/Pancake) unless Yearn is whitelisted.**
- **Atomicity:** the on-chain wrap (asset → USDat) and unwrap (USDat → asset) are atomic; this has not changed. USDat→USDC redemption for onboarded users was described as effectively 1:1 and prompt (Treasury-backed, no queue) as of June 17, 2026. The **sUSDat** layer has a withdrawal queue (STRC liquidation); USDat itself does not.
- **Redemption path — first leg confirmed from source, downstream leg still TODO:** `unwrap(amount)` is whitelist-gated (`_revertIfNotWhitelisted`), burns USDat 1:1, and sends PYUSDx to `msg.sender` (the swap facility) — verified directly from the new implementation's source. The old wM/Uniswap-specific routing documented June 17, 2026 no longer applies (that was `$M`-era). **TODO still open:** how the swap facility converts the received PYUSDx into USDC for the end user (PYUSD redemption, a DEX leg, or both) is swap-facility-level logic that was not decompiled this session. Non-onboarded users still cannot redeem directly and must exit via the Curve pool (see Liquidity).
- **Fees / cooldowns on USDat:** the USDat-level `wrap`/`unwrap` functions are 1:1 with no fee or cooldown coded at that layer (confirmed from source — no fee logic in `_wrap`/`_unwrap`). Any fee would be applied further downstream in the swap facility's PYUSDx→USDC settlement, which is unverified this session — **TODO**. (The **10 bps fee** and withdrawal **queue** documented in Saturn's docs apply to the **sUSDat** staking layer, not USDat, and are unaffected by this change.)

### Token Mint Authority

**Mint mechanism:** Closed mint — USDat can only be minted by the current **M0 Swap Facility** calling `wrap(...)`, which is gated `onlySwapFacility` (checked dynamically against `swapFacility()`, which changed address on August 19, 2026 — see below). There is no `MINTER_ROLE` that can issue USDat directly. Minting requires depositing backing (PYUSDx, or an allowed asset) in the same transaction, and the caller must be whitelisted.

**Mint requires backing:** **Yes** — `wrap` pulls in the backing asset 1:1 before minting USDat; verified September 8, 2026 that `PYUSDx.balanceOf(USDat)` exactly equals `USDat.totalSupply()`. No role can mint unbacked USDat under the current implementation. **Caveat:** the contract is an upgradeable proxy; the Admin (ProxyAdmin owner) could upgrade the implementation to alter this — and did, on August 19, 2026, to change the backing asset (see Funds Management).

**Per-address mint authority** (verified on-chain September 8, 2026, block 25,933,103, from token contract `0x23238f20b894f29041f48D88eE91131C395Aaa71`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0x0bC305e7e13113cAEd3f5486849e9518a1cC4173`](https://etherscan.io/address/0x0bC305e7e13113cAEd3f5486849e9518a1cC4173) | ✓ | ✓ | `onlySwapFacility` (`wrap`/`unwrap`) | **New** M0 Swap Facility, effective August 19, 2026, replacing `0xB680…6278`. Sole mint/burn path; mint pulls PYUSDx 1:1 first. Caller must be whitelisted. Itself a verified `TransparentUpgradeableProxy` (implementation `0xc373…b3f3`, contract name `SwapFacility`); its ProxyAdmin (`0xc421…f53b`) is owned by `0x4867…9D19` (small contract, 171 bytes) — **not** the Saturn Admin Timelock, confirming this component sits outside Saturn's own governance and is controlled by M0-side infrastructure. Exact identity/threshold of that controller not attributed this session — **TODO**. |
| [`0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B`](https://etherscan.io/address/0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B) | — | (seize) | `FORCED_TRANSFER_MANAGER_ROLE` | Compliance (Fireblocks 2/3 MPC). Cannot mint; can `forceTransfer` tokens out of **frozen** accounts. Also holds `FREEZE_MANAGER_ROLE`, `PAUSER_ROLE`, `WHITELIST_MANAGER_ROLE`. Role holder unchanged, re-verified via `hasRole` on the new implementation. |
| [`0xfD5782E3BFF366601da3973aE30C583dE4F08A67`](https://etherscan.io/address/0xfD5782E3BFF366601da3973aE30C583dE4F08A67) | (via upgrade) | (via upgrade) | `DEFAULT_ADMIN_ROLE` + ProxyAdmin owner | **Admin Saturn Timelock** (5-day delay). Cannot mint directly, but **owns the ProxyAdmin** and used its upgrade power on August 19, 2026 to change the implementation and the backing asset. Role holder unchanged, re-verified via `hasRole`. |

**Rate limits / supply caps:** No global USDat supply cap. `setAssetCap`/`ASSET_CAP_MANAGER_ROLE` (Asset Cap Timelock, unchanged) applies only to secondary "alt-assets" like the now-fully-retired `$M` (`assetCap($M)` = 0, explicitly zeroed September 1, 2026 — see Funds Management). **PYUSDx itself has no cap field in the new `MultiMint` design** — confirmed from source, it is deliberately excluded from the capped-asset accounting as the implicit primary asset. The previously-documented **$10M USDC cap** was specific to the retired `$M`-backed `JMIExtension` design and has **no direct analog** in the current architecture; any equivalent limit would live in the swap facility or Saturn's off-chain app, not verified this session.

**Backing check at mint time:** **Atomic** — the Swap Facility/`wrap` path requires the backing asset to be received before USDat is minted; unchanged in principle, re-confirmed via the exact PYUSDx-balance/totalSupply reconciliation above.

> No `mints` (privileged unbacked-supply) edge exists for USDat: supply creation is collateral-gated through the Swap Facility, not a privileged minter. The only way to subvert this is a proxy upgrade by the Admin Timelock — the mechanism that was, in fact, used (through the normal 5-day-delay governance path, not an exploit) to change the backing asset on August 19, 2026.

### Collateralization

- **Backing: 100% on-chain, now in `PYUSDx`, not `$M`.** Verified (September 8, 2026): `PYUSDx.balanceOf(USDat)` = 64,102,946.043590 vs `totalSupply` = 64,102,946.043590 → exact match, fully backed, no observable excess/deficit at this snapshot. `$M.balanceOf(USDat)` = 0.
- **Collateral quality — reassessed:** PYUSDx is an M0-framework "extension" token backed 1:1 by **PYUSD**, PayPal's stablecoin issued by **Paxos Trust Company, NA** (a federally regulated national banking association), via the MoonPay/M0/PayPal PYUSDx tokenization framework launched February 27, 2026. This is a **different collateral class** from the prior `$M` (tokenized Treasuries): PYUSD is a fiat-referenced, cash-and-short-duration-Treasury-backed stablecoin rather than a pure Treasuries wrapper. USDat's backing is now arguably **one layer further removed** than before: USDat → PYUSDx → PYUSD → Paxos reserves (three hops, two of them off-chain-attested), versus the prior USDat → `$M` → M0 Treasury reserves (two hops, one off-chain-attested). Paxos is a well-established, NYDFS-supervised issuer with a track record (also issues USDP, and previously issued BUSD), which offsets some of the added layering, but this introduces **new counterparty dependencies on MoonPay and Paxos/PayPal** that did not previously exist for USDat. See External Dependencies.
- **Over-collateralization / liquidations:** USDat is a 1:1 wrapper, not a CDP — no liquidations, no maintenance ratio. Unchanged. Peg stability now rests on (a) PYUSDx/PYUSD redeemability and (b) the Curve/Pancake arbitrage pools.
- **Custodial / privileged actions on funds:** The compliance MPC can `freeze` any account and `forceTransfer` (seize) tokens from frozen accounts, and can `pause` all transfers. Unchanged, re-verified via `hasRole` on the new implementation. The Admin Timelock can upgrade the contract (5-day delay) — and did, on August 19, 2026.
- **Risk curation:** asset caps are managed by `ASSET_CAP_MANAGER_ROLE`, still held by the Asset Cap Timelock (`0x7d343D17896d2cd87a49B4Fb8872298a883F78f7`; `getMinDelay()` = 432,000 seconds / 5 days, re-verified September 8, 2026). This role registered `$M` as a capped legacy alt-asset at migration time and later zeroed that cap on September 1, 2026, once it had been fully drained via market-callable `replaceAsset` calls (see Funds Management). PYUSDx itself is not part of this capped-asset system at all — by design, not gap.

### Provability

- USDat's backing is **fully on-chain verifiable in real time** (`PYUSDx.balanceOf(USDat)` vs `totalSupply()`, reconciled exactly on September 8, 2026), same programmatic-verifiability property as the prior `$M`-backed design. `currentIndex()` — used for the `$M` design — now **reverts** on the new implementation; the equivalent PYUSDx-era accounting getter was not identified this session (**TODO**).
- The **next layer down** now differs from June 17, 2026: it is **PYUSD's** backing (Paxos Trust Company's cash/short-duration-Treasury reserves, subject to Paxos's own regulatory attestation regime as a NYDFS-chartered trust company), routed through the **MoonPay/M0 PYUSDx** framework, rather than M0's own Treasury reserves directly. Paxos publishes regular reserve attestations for PYUSD; Saturn's own docs do not yet describe this chain for USDat specifically — **TODO: confirm whether Saturn discloses the PYUSDx/PYUSD attestation chain to USDat holders.**
- Saturn uses **Accountable** for proof-of-reserves of the off-chain sUSDat assets, and **Chainlink** publishes a live `Saturn sUSDat NAV` NAVLink feed from Accountable at [`0x73B8E902638a21B4d0319CF99Fa333b2727AD318`](https://etherscan.io/address/0x73B8E902638a21B4d0319CF99Fa333b2727AD318) ([Chainlink feed page](https://data.chain.link/feeds/ethereum/mainnet/susdat-nav)). These feeds primarily serve **sUSDat** NAV (STRC is off-chain, custodied at Clear Street); not re-verified this session but no reason to expect they changed. A `Saturn STRC Price Feed` (`0x5f7eCD0D045c393da6cb6c933c671AC305A871BF`) and a `Chainlink STRC Price Feed` (`0xf4d2076277fff631EFC4385Ab36b1f7734218d23`) also exist on-chain.

## Liquidity Risk

- **Primary exit for onboarded users:** direct 1:1 redemption USDat → PYUSDx/USDC via the Swap Facility, per the pre-migration design (prompt, no queue); redemption mechanics under the PYUSDx-backed architecture were **not independently re-verified this session** — see Accessibility.
- **Exit for non-whitelisted holders (e.g., a Yearn vault that is not onboarded):** secondary market only.
  - **Curve USDC/USDat pool** [`0xf4d0cf32908b2c7f1021339c43df0f77f06896d7`](https://etherscan.io/address/0xf4d0cf32908b2c7f1021339c43df0f77f06896d7): **3,985,395.62 USDC + 5,262,471.89 USDat ≈ $9.25M, imbalanced toward USDat** (verified on-chain September 8, 2026) — down from ~$20.6M and roughly-balanced on June 17, 2026. The USDC-side shortfall relative to USDat is consistent with net USDat sell pressure into the pool (mirroring the ~46% on-chain supply contraction) but the quoted market price ($0.9992, Etherscan, September 8, 2026) shows no material depeg.
  - **Curve USDC/sUSDat pool** [`0x6206ca315c2fcdd2a857b47efb285aa12c529a7a`](https://etherscan.io/address/0x6206ca315c2fcdd2a857b47efb285aa12c529a7a) (sUSDat layer; not re-verified this session).
  - **PancakeSwap USDT/USDat pool on BSC** [`0xF80Ab3Cc041d8Ccc1c51AcC295AFdba26AD70Aa9`](https://bscscan.com/address/0xF80Ab3Cc041d8Ccc1c51AcC295AFdba26AD70Aa9) (not re-verified this session).
- For a token whose on-chain supply is now ~$64.1M, ~$9.25M of on-chain USDat/USDC liquidity (~14.4% of supply, down from ~17.4% in June) is thinner in both absolute and relative terms. A large exit ($2-3M+) by a non-whitelisted holder would now move the Curve pool more than it would have in June.
- **Slippage curve, quoted on-chain via `get_dy` (September 8, 2026):** selling 1M USDat → 998,750 USDC (**0.13%** slippage); 2M → 1,995,519 USDC (**0.22%**); 3M → 2,985,126 USDC (**0.50%**); 4M → 3,850,280 USDC (**3.74%**); 5M → 3,966,336 USDC (**20.7%** — the pool's entire USDC side is only ~3.99M, so quotes above ~4M asymptote toward draining it entirely). **Practical read: exits up to ~$3M clear cleanly; a $4M+ non-whitelisted exit is expensive, and $5M+ is not practically executable through this pool alone.**
- The cleanest mitigation for Yearn is to be **whitelisted** so it can redeem 1:1 directly, removing dependence on pool depth.
- USDat itself has **no withdrawal queue** (unchanged). (The queue applies to sUSDat / STRC liquidation.)
- Behavior under stress / historical drawdown liquidity: **TODO** — the August 19-September 8, 2026 TVL contraction is the first material drawdown period observed; a focused post-mortem of pool depth and peg during that window was not performed this session.

## Centralization & Control Risks

### Governance

- **Upgradeable:** USDat is a `TransparentUpgradeableProxy`. Implementation: [`0x496a4A33b6181F4536203488d9a05AC1429E702c`](https://etherscan.io/address/0x496a4A33b6181F4536203488d9a05AC1429E702c) (verified source; upgraded from [`0x17cac25c6d6bbcb592837fea083a5c8eb4d1e52e`](https://etherscan.io/address/0x17cac25c6d6bbcb592837fea083a5c8eb4d1e52e) on August 19, 2026, block 25,789,911). ProxyAdmin: [`0xcf1072DA5f0D127AEf99136489BAd08bFa3D1A7D`](https://etherscan.io/address/0xcf1072DA5f0D127AEf99136489BAd08bFa3D1A7D), **owned by the Admin Saturn Timelock** `0xfD5782E3BFF366601da3973aE30C583dE4F08A67` (5-day delay, re-verified September 8, 2026 — unchanged owner).
- **Governance roles unchanged across the upgrade** — every role below was re-verified via `hasRole` directly on the new implementation (September 8, 2026) and matches the June 17, 2026 assessment exactly. The `DEFAULT_ADMIN_ROLE` and ProxyAdmin ownership remain with the **Admin Saturn Timelock** (`getMinDelay()` = 432,000 seconds / 5 days, re-verified). The Compliance and Processor addresses remain **Fireblocks 2-of-3 MPC** wallets (no timelock). `ASSET_CAP_MANAGER_ROLE` remains on the **Asset Cap Manager Timelock** (`0x7D343D17896D2cd87A49B4fB8872298A883f78f7`; 5-day delay, re-verified). What changed is not who holds these roles, but what the Admin Timelock **did** with its upgrade power — see Funds Management.
- **Privileged roles (re-verified on-chain via `hasRole` on the current implementation, September 8, 2026):**

| Role | Holder | Type | Power |
|------|--------|------|-------|
| `DEFAULT_ADMIN_ROLE` + ProxyAdmin owner | [`0xfD5782E3BFF366601da3973aE30C583dE4F08A67`](https://etherscan.io/address/0xfD5782E3BFF366601da3973aE30C583dE4F08A67) (Admin Saturn Timelock) | Timelock contract (`getMinDelay()` = 5 days) | Grant/revoke roles; **upgrade the implementation** |
| `FREEZE_MANAGER_ROLE` | [`0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B`](https://etherscan.io/address/0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B) (Compliance) | Fireblocks 2/3 MPC | Freeze/unfreeze any account |
| `FORCED_TRANSFER_MANAGER_ROLE` | [`0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B`](https://etherscan.io/address/0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B) (Compliance) | Fireblocks 2/3 MPC | **Seize** tokens from frozen accounts |
| `PAUSER_ROLE` | [`0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B`](https://etherscan.io/address/0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B) (Compliance) | Fireblocks 2/3 MPC | Pause all transfers |
| `WHITELIST_MANAGER_ROLE` | [`0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B`](https://etherscan.io/address/0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B) (Compliance) | Fireblocks 2/3 MPC | Manage mint/redeem whitelist |
| `YIELD_RECIPIENT_MANAGER_ROLE` | [`0x09D6E34cE24D54890fF0BC6a090b5f880F8C729f`](https://etherscan.io/address/0x09D6E34cE24D54890fF0BC6a090b5f880F8C729f) (Processor) | Fireblocks 2/3 MPC | Change the yield recipient |
| `ASSET_CAP_MANAGER_ROLE` | [`0x7d343D17896d2cd87a49B4Fb8872298a883F78f7`](https://etherscan.io/address/0x7d343D17896d2cd87a49B4Fb8872298a883F78f7) (Asset Cap Timelock) | Timelock contract (`getMinDelay()` = 5 days) | Authorize/cap backing assets |

- **Can governance pause, freeze, or seize user funds? Yes** — freeze + forced transfer + pause are all live and held by the Compliance MPC. Unchanged from June 17, 2026. These are standard regulated-stablecoin compliance controls (cf. USDG, USDC) but represent real holder risk and a notable centralization signal.
- **Documentation discrepancy — new instance found this session:** Saturn's [key-addresses page](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/key-addresses) still lists the **old** M0 Swap Facility (`0xB6807116b3B1B321a390594e31ECD6e0076f6278`) as the "Mint and Redeem Contract," but the live `USDat.swapFacility()` getter returns a **different, new address** (`0x0bC305e7e13113cAEd3f5486849e9518a1cC4173`) as of the August 19, 2026 upgrade. On-chain state is authoritative; the docs page has not been updated to reflect either the new swap facility or the backing-asset change. The docs page also states "All USDat capital is held directly in the USDat smart contract, verifiable onchain at any time" — this remains **true** post-migration (the capital is PYUSDx, held in the USDat contract), even though the asset identity changed.

### Programmability

- Core mint/redeem and accounting remain **programmatic and on-chain**: USDat is 1:1 non-rebasing; backing is verifiable on-chain via direct balance reconciliation. The prior `currentIndex()` exchange-rate getter now **reverts** on the new implementation — the PYUSDx-era equivalent was not identified this session (**TODO**).
- Off-chain dependencies: user **onboarding/whitelist**, the USDC↔PYUSDx swap routing in Saturn's app, the **MoonPay/Paxos PYUSD issuance/redemption pipeline** (new since June 17, 2026), and the sUSDat STRC management (off-chain). For USDat-as-collateral the critical accounting is still on-chain.

### External Dependencies

- **M0 remains a single critical dependency**, now compounded by **new second-order dependencies on MoonPay and Paxos/PayPal.** USDat is 100% backed by PYUSDx (an M0 extension of PYUSD); if M0, MoonPay's PYUSDx framework, or Paxos/PYUSD depegs, is paused, or has impaired reserves, USDat is directly affected. This is a **wider dependency surface than the June 17, 2026 assessment** (M0 alone). **TODO: assess M0's, MoonPay's, and Paxos's own risk posture (minter/issuer collateralization, governance, audits, regulatory standing) — collectively the de-facto floor on USDat's risk.**
- **M0 Swap Facility** — changed address on August 19, 2026, from `0xB680…6278` to [`0x0bC305e7e13113cAEd3f5486849e9518a1cC4173`](https://etherscan.io/address/0x0bC305e7e13113cAEd3f5486849e9518a1cC4173); still the sole mint/redeem contract. **TODO: confirm who controls/can-upgrade the new Swap Facility and which assets it accepts.**
- **New, materially large cross-chain surface (not present June 17, 2026):** Saturn's key-addresses page now lists USDat/sUSDat deployments on **BNB Chain** and **Monad**. Verified on-chain September 8, 2026: BNB Chain supply ~$2.0M, but **Monad supply is ~$27.6M — roughly 46% of Ethereum mainnet's own USDat supply.** This is not a minor footnote; a large share of total USDat exists outside Ethereum, and its bridging/lockbox/mint mechanism, and whether Ethereum-side backing is shared with or separate from the other chains, was **not assessed this session** — **TODO: apply the [bridge-dependency assessment](../../.agents/skills/assessing-bridge-dependencies/SKILL.md)**, treated as a priority follow-up given the size involved, before Yearn relies on any USDat-supply or backing-ratio figure as chain-exhaustive.
- **Fireblocks MPC** infrastructure underpins the Compliance and Processor keys; the Admin key remains behind the Saturn Timelock. Unchanged.
- Oracles: STRC price feeds and the Chainlink `Saturn sUSDat NAV` feed are relevant to sUSDat NAV, not USDat's 1:1 peg. Unchanged. The sUSDat yield is packaged STRC credit/dividend exposure, not generic "stablecoin yield"; it carries off-chain custody/execution, NAV/oracle, and withdrawal-queue liquidity risk.

## Operational Risk

- **Team:** Backed by reputable investors (**YZi Labs**, **Sora Ventures**, **Spartan**). Founder/team identities and track record: **TODO** (not fully verified this session).
- **Documentation:** GitBook plus a detailed private DD pack (FAQ, contract spec, ops/risk, STRC analysis). Reasonably thorough, but contains **internal inconsistencies** — see the Governance note on the stale "Copper custodial / 3-of-5" description. Quality: good for a young protocol, with version drift.
- **Legal structure / jurisdiction (from DD docs):** A **Cayman foundation** owns a **BVI token issuer ("Saturn Capital")** that receives user stablecoins and issues USDat. When USDat is staked, Saturn Capital invests via a **regulated BVI fund ("Saturn Fund")** that holds the STRC; the smart-contract layer is launched under **Panama** jurisdiction. Off-chain service providers: **Galaxy** (execution broker / on-off-ramp), **Clear Street** (STRC custody, Galaxy's partner), **Securitize** (fund administrator/transfer agent), **Fireblocks** (key management). Note: per the DD docs, "ownership claims cannot be enforced in court for the capital backing the protocol" — relevant mainly to the **sUSDat/STRC** layer (USDat's backing, now PYUSDx, is held on-chain in the token contract).
- **Incident response:** Documented compliance levers (pause, blacklist + fund recall via forced transfer) exist; a formal tested incident-response plan is **TODO**.

## Monitoring

Key contracts and signals:

| What | Contract / Call | Threshold / Watch |
|------|------------------|-------------------|
| Backing ratio | `M.balanceOf(0x2323…aa71)` vs `USDat.totalSupply()` | Alert if backing/supply < 1.00 (any shortfall) |
| Peg | Curve pool `0xf4d0…96d7` price; off-chain USDat/USD | Alert on >0.5% deviation from $1 |
| Implementation upgrade | `ProxyAdmin 0xcf10…1A7D` `Upgraded` events; EIP-1967 impl slot of `0x2323…aa71` | Alert on **any** upgrade — this fired once already (Aug 19, 2026) |
| Admin/role changes | `RoleGranted`/`RoleRevoked` on USDat; ProxyAdmin `OwnershipTransferred` | Alert on any change to the role table above |
| Freeze / forced transfer / pause | `Freeze`/`ForcedTransfer`/`Paused` events on USDat | Alert on any event |
| Backing asset composition | `assetBalanceOf(asset)` for `$M` and `PYUSDx`; `replaceAsset`/`AssetCapSet` events; `isAllowedAsset(asset)` | Alert on any further asset-replacement or new allowed asset — this already fired once (`$M` → `PYUSDx`, Aug 19, 2026) |
| Swap facility address | `USDat.swapFacility()` | Alert on any change — already changed once (Aug 19, 2026) |
| Yield recipient change | `setYieldRecipient` / yield-recipient events | Alert on change |
| Liquidity depth | Curve `0xf4d0…96d7` / `0x6206…9a7a` balances | Alert if USDat-side depth drops sharply — depth already roughly halved since June 2026 |
| PYUSDx / PYUSD health | `PYUSDx.totalSupply()`, PYUSD peg, Paxos attestations | Track underlying-asset risk (replaces prior `$M`/M0 health item) |
| Cross-chain supply | BNB Chain USDat (`0x0Bb1…64eF`) and Monad USDat total supply | Track new cross-chain surface; not covered by this report's scoring |

Recommended frequency: backing ratio and peg **hourly**; governance/upgrade/freeze/asset-replacement events **real-time** (event-driven); liquidity and PYUSDx/PYUSD health **daily**.

## Appendix: Contract Architecture

```
GOVERNANCE (Admin timelocked; compliance/processor Fireblocks 2/3 MPC; asset caps timelocked)
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Admin Timelock 0xfD57…8A67 → DEFAULT_ADMIN_ROLE + owns ProxyAdmin   │
  │   5-day delay                                                       │
  │ Compliance 0x10D5…703B → FREEZE / FORCED_TRANSFER / PAUSER / WHITELIST│
  │ Processor 0x09D6…729f  → YIELD_RECIPIENT_MANAGER                      │
  │ Asset Cap Timelock 0x7d34…78f7 → ASSET_CAP_MANAGER             │
  │   5-day delay                                                       │
  └───────────────┬──────────────────────────────┬────────────────────────┘
                  │ owns                          │ roles
        ┌─────────▼─────────┐                     │
        │ ProxyAdmin        │                     │
        │ 0xcf10…1A7D       │                     │
        └─────────┬─────────┘                     │
                  │ upgrades                       │
TOKEN LAYER       ▼                                ▼
        ┌─────────────────────────────────────────────────────┐
        │ USDat (TransparentUpgradeableProxy) 0x2323…aa71       │
        │   impl 0x496a…702c  (upgraded Aug 19, 2026; was       │
        │   0x17ca…e52e M0 JMIExtension + ForcedTransfer)       │
        │   1:1 non-rebasing wrapper · whitelist on wrap/unwrap │
        └───────▲───────────────────────────────┬─────────────┘
                │ wrap/unwrap (onlySwapFacility) │ holds backing
        ┌───────┴────────────┐          ┌────────▼─────────────┐
        │ M0 Swap Facility   │◀──USDC──▶│ PYUSDx (M0 extension) │
        │ 0x0bC3…4173 (NEW,   │  swap    │ 0xeBDB…6b14d          │
        │ was 0xB680…6278)    │          │ (was $M 0x866A…be1b,  │
        └────────────────────┘          │  now $M balance = 0)  │
                                         └────────┬─────────────┘
                                                  │ backed 1:1 by
PROTOCOL / UNDERLYING                             ▼
        ┌─────────────────────────────────────────────────────┐
        │ PYUSD (Paxos Trust Company) via MoonPay/M0 PYUSDx    │
        │ tokenization framework (launched Feb 27, 2026)       │
        │ — off-chain reserves, Paxos attestation/regulation   │
        └─────────────────────────────────────────────────────┘

YIELD LAYER (context only — not USDat backing)
        sUSDat 0xD166…2Df7 (ERC-4626 on USDat) → STRC (Strategy BTC-backed
        preferred equity) → queued redemptions, STRC price feeds

CROSS-CHAIN (new as of this reassessment, bridge mechanism not scored)
        USDat also deployed on BNB Chain (0x0Bb1…64eF, ~$2.0M supply, verified
        TransparentUpgradeableProxy) and Monad (same address, ~$27.6M supply —
        ~46% of Ethereum mainnet supply, verified TransparentUpgradeableProxy)
```

---

## Risk Summary

### Key Strengths

- **100% on-chain-verifiable backing**, still fully reconciled after a full backing-asset migration: `PYUSDx.balanceOf(USDat)` exactly matches `totalSupply()` as of September 8, 2026.
- **Closed, collateral-gated mint** — no `MINTER_ROLE`; USDat can only be minted by depositing backing through the (current) M0 Swap Facility (no unbacked-mint path absent an upgrade).
- **Freely transferable** despite the whitelist (whitelist gates only mint/redeem), so secondary-market holding/transfer is unrestricted.
- **Governance behaved as designed:** the entire backing-asset swap was executed through the disclosed 5-day Admin Timelock, not an emergency bypass or an undisclosed key — the governance model held up under a real, material change.
- Reputable backers (YZi Labs, Sora Ventures, Spartan); PYUSD's issuer (Paxos) is a well-established, regulated stablecoin issuer.

### Key Risks

- **Centralized control mitigated by timelock, and that power was exercised:** the **Admin** and **ProxyAdmin** are behind the **Admin Saturn Timelock** (5-day delay); on August 19, 2026 it used its upgrade power to change USDat's implementation and swap the entire backing asset from `$M` to `PYUSDx`. This was governed (not an exploit), but it demonstrates the timelock's real reach: a compromised or malicious Admin Timelock could redefine the token's collateral again. The **Compliance** and **Processor** keys remain Fireblocks **2/3 MPC** wallets with no timelock — they can still **freeze, seize, and pause** user funds.
- **Unaudited architecture change:** none of the four previously-published audits (including the April 30, 2026 Certora Audit #3, the most recent) cover the `replaceAsset` mechanism or the PYUSDx-backed design now live in production. A fifth audit file appeared on Saturn's transparency page after this migration, but its scope could not be confirmed this session.
- **Expanded external-dependency surface:** USDat now depends on **M0 and MoonPay and Paxos/PayPal** (previously M0 alone) — one more off-chain-attested hop between USDat and its ultimate reserves (USDat → PYUSDx → PYUSD → Paxos, vs. the prior USDat → `$M` → M0 Treasuries).
- **Material, accelerating contraction since the June 17, 2026 assessment:** USDat on-chain supply -46% (118.25M → 64.10M), sUSDat NAV -20% (~$92.5M → ~$74.4M), and Curve USDC/USDat liquidity roughly halved (~$20.6M → ~$9.25M) and now imbalanced toward USDat. The pace of net redemptions roughly **tripled** in the ~20 days following the August 19 backing migration versus the prior two months (verified via mint/burn event counts — see Historical Track Record). No depeg observed (quoted price $0.9992), and redemptions used the normal 1:1 path, but the magnitude, direction, and timing (concentrated around the migration) warrant close monitoring rather than a clean "large token, stable" read.
- **Unresolved third-party security disclosure on sUSDat:** Innora Security Research published a Critical-severity finding (potential 30-day withdrawal freeze) and a High-severity finding (PROCESSOR-role over-extraction) against the sUSDat vault on April 14, 2026 — before, and unaddressed by, both Saturn's own audits and the June 17, 2026 report. Current patch/exploit status could not be confirmed this session (see Audits and Due Diligence Disclosures).
- **New, unassessed cross-chain surface:** USDat/sUSDat are now also deployed on BNB Chain (~$2.0M supply, verified) and Monad (unverified); bridge/lockbox risk for these deployments has not been evaluated.
- **Still young** (~6 months live) and has now been through one major, if orderly, architecture change — reduces rather than adds to the maturity signal from age alone.
- **Exit for non-whitelisted holders is secondary-market only**, and that market is thinner than in June (~$9.25M Curve depth vs ~$64.1M on-chain supply); direct 1:1 redemption requires onboarding.

### Critical Risks `[If Any]`

- Upgradeable proxy controlled by a **5-day timelock** is a meaningful improvement over an un-timelocked MPC setup, but the trust model still rests on the Admin timelock — and that power was used, on August 19, 2026, to change the token's entire backing asset. A compromised timelock could redefine the token (including minting) again. The Compliance and Processor MPCs remain no-timelock and can freeze/seize/pause. This does not by itself trip a critical gate (it is not a single EOA, reserves remain verifiable, and audits exist for the base extension model), but it is the dominant risk and was realized in practice (governed, not malicious) this reassessment period.
- The deployed USDat token now relies on **two** M0 extension products in its lifetime (the original `$M` design and the current PYUSDx design), and the more recent one has **no dedicated third-party audit** yet identified. USDat still inherits M0's, MoonPay's, and Paxos's own governance, reserve, and swap-facility risks.

---

## Risk Score Assessment

**Scoring Guidelines:** Conservative; on-chain evidence prioritized.

### Critical Risk Gates

- [ ] **No audit** — Not triggered (four reports reviewed: 1× Three Sigma + 3× Certora incl. formal verification cover the base M0-extension design; a fifth, unidentified audit file has since appeared on Saturn's transparency page). Note: none of the four confirmed reports cover the PYUSDx-backed architecture live since August 19, 2026 — see Audits.
- [ ] **Unverifiable reserves** — Not triggered (PYUSDx backing is verifiable on-chain in real time; reconciled exactly against `totalSupply()` on September 8, 2026).
- [ ] **Total centralization** — Not triggered (timelock + 2/3 MPC for compliance/processor, not a single EOA), though centralization remains material and the Admin Timelock's upgrade power was exercised this period.

**All gates pass** → proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits:** Four reports remain on record (1× Three Sigma + 3× Certora incl. formal verification), zero unresolved Highs/Criticals in the public summaries. However, the most recent confirmed audit (Certora, April 30, 2026) **predates and does not cover** the August 19, 2026 PYUSDx migration or the `replaceAsset` mechanism — the currently-live backing architecture is effectively unaudited. A fifth audit file appeared on Saturn's transparency page but could not be identified this session. Separately, an independent researcher (Innora Security Research) published an unaddressed Critical/High-severity disclosure against the **sUSDat** vault on April 14, 2026 that predates and is not covered by any Saturn-published audit either (see Audits and Due Diligence Disclosures). This is closer to "coverage exists but is dated / doesn't cover the current design, with an independent unresolved finding on the sister product" than "actively covered" → **3.0** (up from 2.5 on June 17, 2026).
- **Historical:** ~6 months in production (→4 on time, at the edge of the 3-6 month bucket) against ~$64-138M TVL depending on measure (→1-2 on scale); the youth (and the protocol's first major architecture change, still unaudited) continues to dominate over the TVL/scale signal → **4.0** (unchanged).

**Audits & Historical Score = (3.0 + 4.0) / 2 = 3.5**

**Score: 3.5/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance:** Upgradeable proxy controlled by a 5-day timelock (Admin + ProxyAdmin) + 2/3 MPC (Compliance/Processor); asset-cap management is timelocked. Unchanged mechanics, but the Admin Timelock's upgrade power was exercised this period to change the backing asset, confirming it is a live, material trust boundary rather than a theoretical one → **2.5** (unchanged).
- **Programmability:** Mostly programmatic; 1:1 non-rebasing, backing verifiable on-chain by direct balance reconciliation; the prior `currentIndex()` exchange-rate getter now reverts on the new implementation, a minor loss of programmatic transparency; some off-chain onboarding → **2.0** (unchanged).
- **External Dependencies:** Previously a single critical dependency on M0. Now M0 **and** MoonPay's PYUSDx framework **and** Paxos/PayPal (PYUSD issuer) are all critical to USDat's backing, plus new (unassessed) cross-chain deployments on BNB Chain and Monad. More compounding critical dependencies than before → **4.5** (up from 4.0).

**Centralization Score = (2.5 + 2.0 + 4.5) / 3 = 3.0**

**Score: 3.0/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization:** 100% on-chain backing, now in PYUSDx, exactly reconciled against supply. Collateral quality remains high (PYUSD is issued by the regulated Paxos Trust Company), but backing is now **one layer further removed** (USDat → PYUSDx → PYUSD → Paxos reserves, vs. the prior USDat → `$M` → M0 Treasuries), and the migration mechanism itself has no dedicated audit coverage yet → **3.0** (up from 2.5).
- **Provability:** PYUSDx backing is still real-time on-chain verifiable by direct balance reconciliation. The deeper layer (Paxos's PYUSD reserves) relies on Paxos's own attestation regime, which is not yet clearly disclosed by Saturn for USDat specifically, and the previous on-chain exchange-rate getter (`currentIndex()`) no longer functions → **3.0** (up from 2.5).

**Funds Management Score = (3.0 + 3.0) / 2 = 3.0**

**Score: 3.0/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- 1:1 direct redemption for onboarded users (mechanics under the new backing asset not independently re-verified — see Accessibility); for others, market-based exit via a Curve pool that has **roughly halved** in depth since June 2026 (~$9.25M vs ~$20.6M) against a supply that has also roughly halved (~$64.1M vs ~$118.3M), so the depth-to-supply ratio is only modestly worse (~14.4% vs ~17.4%), but the pool is now imbalanced toward USDat and absolute depth for large exits is thinner → **3.5** (up from 3.0).

**Score: 3.5/5**

#### Category 5: Operational Risk (Weight: 5%)

- Reputable backers, adequate docs with gaps (now including a stale swap-facility address and an un-updated backing-asset description on Saturn's own docs), team/legal/incident-response details unverified → **2.5** (unchanged).

**Score: 2.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.5 | 20% | 0.70 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 3.0 | 30% | 0.90 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.15 / 5.0** |

**Optional Modifiers:** none apply (protocol <2 years, TVL history <1 year).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK (3.15/5.0) — Approved with enhanced monitoring.** The score moved up from 2.8/5.0 (June 17, 2026) primarily because of an unaudited backing-asset migration, an expanded external-dependency chain (M0 + MoonPay + Paxos), and thinner secondary-market liquidity — not because of any realized loss, depeg, or governance failure. The protocol remains inside the Medium Risk band; this is not a critical-gate or tier-boundary event.

---

## Reassessment Triggers `[If Applicable]`

> Three triggers from the June 17, 2026 assessment fired between then and this reassessment (TVL/supply change beyond ±30%, an implementation upgrade, and non-`$M` backing becoming material) — this reassessment addresses all three.

- **Time-based:** Reassess in **2 months** (shorter than the prior 3-month window, given the still-young protocol, one major unaudited architecture change, and an ongoing TVL contraction).
- **TVL-based:** Reassess if USDat supply changes by more than **±30%** from 64.10M, or if the PYUSDx-backing/supply ratio drops below 1.00.
- **Dependency-based:** Reassess on any PYUSDx/PYUSD depeg, pause, or governance/minter change at M0, MoonPay, or Paxos.
- **Governance-based:** Reassess on any further USDat implementation upgrade, role change, swap-facility address change, or a freeze/forced-transfer/pause event.
- **Backing-mix-based:** Reassess if the backing asset changes again, or if `isAllowedAsset`/`assetCap` semantics are clarified in a way that changes the current read.
- **Audit-based:** Reassess once the PYUSDx-backed architecture and `replaceAsset` mechanism receive dedicated third-party audit coverage (or once the unidentified fifth audit file is confirmed to — or not to — cover it).
- **Cross-chain-based:** Reassess if BNB Chain or Monad USDat supply becomes material relative to Yearn's exposure, or if bridge mechanics are mapped and found to introduce new risk.
- **Incident-based:** Reassess after any exploit or peg deviation.

---

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [June 17, 2026](https://github.com/yearn/risk-score/pull/225) | 2.825 | Initial assessment |
| [September 8, 2026](https://github.com/yearn/risk-score/pull/PR_NUMBER_PLACEHOLDER) | 3.15 | Reassessment: backing migrated `$M` → PYUSDx via a new MultiMint/PYUSDX base architecture (Aug 19, 2026 upgrade); new M0 Swap Facility (M0-controlled, not Saturn's timelock); supply -46% with redemption pace tripling post-migration (286 burns vs 42 mints); Curve liquidity roughly halved; Monad deployment found to carry ~46% of mainnet supply; unaddressed third-party Critical/High sUSDat disclosure (Innora, Apr 2026) surfaced; governance roles unchanged |

---

## Pending TODOs (for follow-up)

**Resolved this session** (previously open, now confirmed from verified source and/or on-chain events — see inline citations above): the `replaceAsset` mechanism, caller, and authority (§Funds Management); the `isAllowedAsset(PYUSDx)`/`assetCap(PYUSDx)` behavior (by-design exclusion, not an anomaly); the USDat-level redemption first leg and fee structure (§Accessibility); the prior $10M USDC-cap question (no direct analog in the new design); the BNB Chain and Monad USDat supply figures (both verified on-chain: ~$2.0M and ~$27.6M respectively) and their proxy verification status; on-chain slippage quotes for $1-5M USDat exits (§Liquidity Risk).

**Still open:**

1. Identify the **fifth audit file** on Saturn's transparency page (firm, date, scope) and confirm whether it covers the PYUSDx migration / `replaceAsset` mechanism — blocked by JavaScript-rendered content across three fetch attempts this session.
2. Determine current status of the **Innora Security Research SAT-001/002/003/004 disclosure** against sUSDat (published April 14, 2026): patched, disputed, or still live. High priority given Critical severity claimed and no follow-up found via web search this session.
3. Decompile or otherwise verify the **M0 Swap Facility's** (`0x0bC3…4173`) downstream PYUSDx→USDC settlement logic and its controlling entity in more detail (its ProxyAdmin owner `0x4867…9D19` was identified but not further attributed).
4. Map the **BNB Chain and Monad** USDat/sUSDat bridge/lockbox mechanism using the [bridge-dependency skill](../../.agents/skills/assessing-bridge-dependencies/SKILL.md) — now higher priority given Monad alone carries ~46% of Ethereum mainnet's USDat supply.
5. Assess **M0's, MoonPay's, and Paxos's** own risk posture (issuer collateralization, governance, audits, regulatory standing) as the de-facto floor on USDat risk.
6. Confirm **Safe Harbor (SEAL)** status — safeharbor.securityalliance.org did not return usable content via fetch this session (JS-rendered).
7. Pull **holder distribution** and a **historical peg/price series spanning the August 19, 2026 migration** (Etherscan Pro / Dune).
8. Confirm **team identities** — web search this session returned only name-collision results with unrelated companies also named "Saturn"; nothing confidently attributable to Saturn Credit was found.
9. Confirm the **equivalent of `currentIndex()`** (reverts on the new implementation) for programmatic exchange-rate computation, if one exists.
10. Confirm whether **Saturn discloses the PYUSDx→PYUSD→Paxos attestation chain** to USDat holders anywhere in its docs.

### Sources consulted this session (September 8, 2026)

On-chain verification via `cast` against `RPC_1` (project `.env`, Ethereum), `https://rpc.monad.xyz` (Monad), and `https://bsc-rpc.publicnode.com` (BNB Chain); Etherscan API v2 (`ETHERSCAN_TOKEN` from project `.env`) for `getsourcecode` on the new USDat implementation, the M0 Swap Facility and its implementation, and the BNB Chain/Monad USDat proxies; full verified Solidity source (56 files) retrieved via both the Etherscan API and Sourcify v2 API and read directly for the mint/redeem/asset-replacement mechanics documented above. Earlier in this session, before `.env` was located, public RPC endpoints (`rpc.mevblocker.io`, `ethereum-rpc.publicnode.com`) were used for the initial discovery pass; findings were re-verified against the authenticated `RPC_1` endpoint where it mattered. Saturn's [key-addresses](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/key-addresses) and [transparency-and-audits](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/transparency-and-audits) GitBook pages; DefiLlama protocol TVL API; public web search for PYUSDx/MoonPay/Paxos background and for independent security disclosures (surfaced the Innora Security Research gist); Certora's public report page (confirmed April 30, 2026 date, no PYUSDx mention). Sources from the June 17, 2026 assessment (DD docs, prior audit PDFs) were not re-fetched.
