# Protocol Risk Assessment: Saturn (USDat)

- **Assessment Date:** May 27, 2026
- **Token:** USDat (Saturn USD)
- **Chain:** Ethereum
- **Token Address:** [`0x23238f20b894f29041f48D88eE91131C395Aaa71`](https://etherscan.io/address/0x23238f20b894f29041f48D88eE91131C395Aaa71)
- **Final Score: 3.0/5.0**

> Assessment requested in [yearn/risk-score#135](https://github.com/yearn/risk-score/issues/135) — *"USDat as collateral"*. This report assesses **USDat**, the non-yielding stablecoin. The staked, yield-bearing **sUSDat** ([`0xD166337499E176bbC38a1FBd113Ab144e5bd2Df7`](https://etherscan.io/address/0xD166337499E176bbC38a1FBd113Ab144e5bd2Df7)) carries materially different (STRC credit) risk and is discussed only as context.

## Overview + Links

**Saturn** is a credit protocol that issues two tokens:

- **USDat** — a fully-collateralized, non-rebasing stablecoin pegged 1:1 to USD. It is an **M0 "extension" token**: each USDat is backed 1:1 by M0's `$M` token, M0's tokenized U.S. Treasuries product. Onboarded (whitelisted) users mint and redeem USDat 1:1 with USDC through Saturn's web application. The M0-native Treasury yield does **not** accrue to USDat holders — it is routed to a single Saturn-controlled `yieldRecipient`.
- **sUSDat** — an ERC-4626 vault that stakes USDat to earn yield (targeting 11%+) from **STRC**, Strategy's (formerly MicroStrategy) short-term, BTC-backed perpetual preferred-equity instrument. sUSDat redemptions are **queued** (Saturn must liquidate the underlying STRC position before returning USDat).

The key risk separation: **USDat's collateral is tokenized U.S. Treasuries (via M0)**, while the STRC/Bitcoin credit exposure sits in the sUSDat yield layer. Yearn's integration target is USDat as collateral.

**On-chain facts (verified May 27, 2026):**
- USDat total supply: **125,957,146.79 USDat** (`totalSupply()` = `125957146785226`, 6 decimals)
- `$M` held by the USDat contract: **126,010,142.17 M** (`M.balanceOf(USDat)`) → ~100% backed, small excess ≈ accrued yield
- DefiLlama TVL (Saturn): **$125.06M** — reconciles with supply
- Deployed: **2026-03-10** (proxy creation block 24,629,431)

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

> **Audit-scope caveat:** the earliest Saturn Dollar audits covered a *self-issued* `saturn-dollar/src/USDat.sol` design (80 nSLOC) described as "a simple ERC20… minted 1:1 against stable assets by KYC-verified users," with a `PROCESSOR_ROLE` that **mints** and a `_blacklisted` mapping. The deployed USDat is instead an **M0 `JMIExtension`** — wrap/unwrap of `$M`, `swapFacility`, `whitelist`, `forceTransfer`, no `PROCESSOR_ROLE` mint. This pivot is covered by Certora Audit #3, so the prior "deployed token not covered" finding is removed. The main residual audit limitation is that the full deployed trust model still depends on M0 and on Saturn's live configuration/roles.
- **Notable audited findings** (on the prior design, useful context): Three Sigma `H01` — blacklist enforced only on recipient, letting blacklisted senders move tokens (fixed); `H02` / Certora `M-01`,`M-02` — reward-distribution front-running, redistribute-sandwich, and rounding dust leakage in the sUSDat vault (fixed/acknowledged); Three Sigma `M03` / Certora `L-01` — the sUSDat vault assumes USDat = $1, so a USDat depeg or a lag between off-chain STRC purchase and on-chain USDat burn can leave the vault mis-priced/under-backed (acknowledged; client switching the oracle to price STRC in USDat terms and adding a bridge-loan flow). Certora also flagged **no test coverage for StakedUSDat** and that **`PROCESSOR_ROLE` is the dominant trust boundary** in the earlier design.
- Smart-contract architecture complexity: **moderate**. The deployed USDat is a `TransparentUpgradeableProxy` over a well-structured M0 extension; novel Saturn surface is small. The sUSDat layer is more complex (multi-token NAV vault + ERC-721 withdrawal queue + processor-driven off-chain settlement).

### Bug Bounty `[If Applicable]`

- No bug bounty program — confirmed absent from the docs (via the GitBook docs Q&A endpoint) and not found on Immunefi.
- Safe Harbor (SEAL) adoption: **TODO** — not confirmed.

## Historical Track Record

- **Time in production: ~2.5 months** (USDat deployed 2026-03-10). This is very young.
- TVL: ~$126M, reached quickly after launch. High TVL in a <3-month-old protocol is itself a concentration consideration rather than a maturity signal.
- Past security incidents: none known (none expected given age).
- Peg history: USDat trades near $1; the Curve USDC/USDat pool is roughly balanced (see Liquidity). No depeg events observed. **TODO: pull historical peg/price series for a fuller picture.**
- Concentration risk from large depositors / holder distribution: **TODO** (holder list requires Etherscan Pro). A large fraction of supply is staked into sUSDat (sUSDat supply ≈ 106.5M shares).
- Funding: seed round (Jan 2026) led by **YZi Labs** and **Sora Ventures** plus angels. Reported amount conflicts across sources ($800K vs $2M) — **TODO: confirm**.
- **STRC stability history** (sUSDat-layer context, from Saturn's risk analysis): STRC's annualized realized volatility fell from ~15.25% to ~2.14% after a $2.25B reserve was implemented (~Feb 2026); max observed intraday drawdown ~6.03% (2025-11-20). STRC has traded below par 10 times since inception, with the last five recoveries each under 10 days.

## Funds Management

USDat is an M0 extension. The fund flow is:

```
USDC  ──(Saturn app, onboarded user)──▶  M0 Swap Facility  ──swap──▶  $M  ──wrap──▶  USDat (1:1)
                                                                                       │
                                              M0 Treasury yield ───────────────────────┘──▶ yieldRecipient (Saturn)
```

- The protocol delegates backing entirely to **M0** (the `$M` token). There is no other delegation for USDat itself. The collateral asset is held as `$M` on the USDat contract.
- **Monitoring delegation changes:** the `ASSET_CAP_MANAGER_ROLE` can authorize additional backing assets (the M0 "JMI / Just Mint It" model supports collateral assets beyond `$M`). Today `totalAssets()` ≈ 0 (backing is effectively all `$M`), but this is a parameter to watch — see Monitoring.

### Accessibility `[If Applicable]`

- **Who can mint/redeem:** only **whitelisted ("onboarded") addresses**. The whitelist is enforced on `wrap` (mint) and `unwrap` (redeem) via `_revertIfNotWhitelisted` (verified in source). `isWhitelistEnabled()` = **true** on-chain.
- **Regular transfers are NOT whitelist-gated** — verified: the whitelist hooks fire only on `_beforeWrap`/`_beforeUnwrap`, not on `transfer`/`transferFrom`. This is why the Curve pool (not whitelisted) trades freely. **Implication for Yearn: a non-onboarded holder can hold and transfer USDat but cannot mint or redeem directly — its only exit is the secondary market (Curve/Pancake) unless Yearn is whitelisted.**
- **Atomicity:** the on-chain wrap (M → USDat) and unwrap (USDat → M) are atomic. The USDC↔M leg runs through the M0 Swap Facility in the same user flow. USDat→USDC redemption for onboarded users is effectively 1:1 and prompt (Treasury-backed, no queue). The **sUSDat** layer has a withdrawal queue (STRC liquidation); USDat itself does not.
- **Redemption path (verified against Saturn DD docs):** an onboarded user redeems in two on-chain legs — (1) `swap`/`swapWithPermit` on the M0 Swap Facility to turn USDat into **wM** ([`0x437cc33344a0B27A429f795ff6B469C72698B291`](https://etherscan.io/address/0x437cc33344a0B27A429f795ff6B469C72698B291)), then (2) swap wM → USDC via the Uniswap wM/USDC pool (**1 bps fee** on that leg). Non-KYC'd users cannot redeem and must exit via the Curve pool.
- **Fees / cooldowns on USDat:** mint is 1:1 with USDC and effectively fee-free aside from the 1 bps Uniswap leg on the wM→USDC redemption path; no cooldown or queue on USDat itself. (The **10 bps fee** in Saturn's docs and the withdrawal **queue** apply to the **sUSDat** staking layer, not USDat.)

### Token Mint Authority

**Mint mechanism:** Closed mint — USDat can only be minted by the **M0 Swap Facility** calling `wrap(...)`, which is gated `onlySwapFacility`. There is no `MINTER_ROLE` that can issue USDat directly. Minting requires depositing backing (`$M` or an allowed asset) in the same transaction, and the caller must be whitelisted.

**Mint requires backing:** **Yes** — `wrap` pulls in `$M` (or an allowed asset, 1:1) before minting USDat. No role can mint unbacked USDat under the current implementation. **Caveat:** the contract is an upgradeable proxy; the Admin (ProxyAdmin owner) could upgrade the implementation to alter this. See Centralization.

**Per-address mint authority** (verified on-chain May 27, 2026, from token contract `0x23238f20b894f29041f48D88eE91131C395Aaa71`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| [`0xB6807116b3B1B321a390594e31ECD6e0076f6278`](https://etherscan.io/address/0xB6807116b3B1B321a390594e31ECD6e0076f6278) | ✓ | ✓ | `onlySwapFacility` (`wrap`/`unwrap`) | M0 Swap Facility ("Mint and Redeem Contract"). Sole mint/burn path; mint pulls `$M` 1:1 first. Caller must be whitelisted. |
| [`0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B`](https://etherscan.io/address/0x10D59F776db12b4B271b2609CB8b7Ddd0A82703B) | — | (seize) | `FORCED_TRANSFER_MANAGER_ROLE` | Compliance (Fireblocks 2/3 MPC). Cannot mint; can `forceTransfer` tokens out of **frozen** accounts. Also holds `FREEZE_MANAGER_ROLE`, `PAUSER_ROLE`, `WHITELIST_MANAGER_ROLE`. |
| [`0x610182581C93687Ca03F4a8E7f124f8cEC616820`](https://etherscan.io/address/0x610182581C93687Ca03F4a8E7f124f8cEC616820) | (via upgrade) | (via upgrade) | `DEFAULT_ADMIN_ROLE` + ProxyAdmin owner | Admin (Fireblocks 2/3 MPC). Cannot mint directly, but **owns the ProxyAdmin** and can upgrade the implementation to introduce a mint path. |

**Rate limits / supply caps:** No global USDat supply cap. Per-asset caps exist for non-`$M` backing assets (`setAssetCap`, `ASSET_CAP_MANAGER_ROLE`); none are material today.

**Backing check at mint time:** **Atomic** — the Swap Facility/`wrap` path requires the backing asset to be received before USDat is minted.

> No `mints` (privileged unbacked-supply) edge exists for USDat: supply creation is collateral-gated through the Swap Facility, not a privileged minter. The only way to subvert this is a proxy upgrade by the Admin MPC.

### Collateralization

- **Backing: 100% on-chain in `$M`.** Verified: `M.balanceOf(USDat)` = 126,010,142.17 vs `totalSupply` = 125,957,146.79 → fully backed with a small excess (undistributed yield, `yield()` ≈ $52,992).
- **Collateral quality:** `$M` is M0's tokenized short-term U.S. Treasuries product — high quality. However, USDat's backing is **one protocol layer removed**: USDat's solvency depends on `$M` holding its peg and on M0's own (off-chain, attested) Treasury reserves. USDat holds ~$126M of `$M` out of `$M`'s ~$342M total supply (~37%) — a large share of a single underlying.
- **Over-collateralization / liquidations:** USDat is a 1:1 wrapper, not a CDP — no liquidations, no maintenance ratio. Peg stability rests on (a) `$M` redeemability and (b) the Curve/Pancake arbitrage pools.
- **Custodial / privileged actions on funds:** The compliance MPC can `freeze` any account and `forceTransfer` (seize) tokens from frozen accounts, and can `pause` all transfers. These are disclosed as compliance controls. The Admin MPC can upgrade the contract.
- **Risk curation:** asset caps for additional backing assets are managed by `ASSET_CAP_MANAGER_ROLE`, now held by the Saturn Timelock (`0x7d343D17896d2cd87a49B4Fb8872298a883F78f7`; `getMinDelay()` = 432,000 seconds / 5 days, verified June 7, 2026). The prior Processor 2 holder `0xA18f…A3Ad` no longer has the role.

### Provability

- USDat's `$M` backing is **fully on-chain verifiable in real time** (`M.balanceOf(USDat)` vs `totalSupply()`), and the exchange rate (`currentIndex()`) is read programmatically from M0 — anyone can compute it.
- The **next layer down** (M0's Treasury reserves backing `$M`) is off-chain and relies on M0's own attestation/governance.
- Saturn uses **Accountable** for proof-of-reserves of the off-chain sUSDat assets, and **Chainlink** publishes a live `Saturn sUSDat NAV` NAVLink feed from Accountable at [`0x73B8E902638a21B4d0319CF99Fa333b2727AD318`](https://etherscan.io/address/0x73B8E902638a21B4d0319CF99Fa333b2727AD318) ([Chainlink feed page](https://data.chain.link/feeds/ethereum/mainnet/susdat-nav)). On-chain verification June 7, 2026: `description()` = `Saturn sUSDat NAV`, `decimals()` = 18, `latestRoundData()` returned answer `1.007071305776136200`. The Chainlink page lists Ethereum Mainnet, NAVLink product type, Accountable as data source, and 0.5% deviation threshold. These feeds primarily serve **sUSDat** NAV (STRC is off-chain, custodied at Clear Street). For **USDat**, the `$M` backing is held in the token contract and is directly verifiable on-chain without relying on these feeds. A `Saturn STRC Price Feed` (`0x5f7eCD0D045c393da6cb6c933c671AC305A871BF`) and a `Chainlink STRC Price Feed` (`0xf4d2076277fff631EFC4385Ab36b1f7734218d23`) also exist on-chain.

## Liquidity Risk

- **Primary exit for onboarded users:** direct 1:1 redemption USDat → `$M`/USDC via the Swap Facility (Treasury-backed, prompt, no queue).
- **Exit for non-whitelisted holders (e.g., a Yearn vault that is not onboarded):** secondary market only.
  - **Curve USDC/USDat pool** [`0xf4d0cf32908b2c7f1021339c43df0f77f06896d7`](https://etherscan.io/address/0xf4d0cf32908b2c7f1021339c43df0f77f06896d7): ~$9.72M USDC + ~$9.66M USDat ≈ **$19.4M, balanced** (verified on-chain).
  - **Curve USDC/sUSDat pool** [`0x6206ca315c2fcdd2a857b47efb285aa12c529a7a`](https://etherscan.io/address/0x6206ca315c2fcdd2a857b47efb285aa12c529a7a) (sUSDat layer).
  - **PancakeSwap USDT/USDat pool on BSC** [`0xF80Ab3Cc041d8Ccc1c51AcC295AFdba26AD70Aa9`](https://bscscan.com/address/0xF80Ab3Cc041d8Ccc1c51AcC295AFdba26AD70Aa9).
- For a ~$126M token, ~$19M of on-chain USDat liquidity is moderate. Small-to-mid exits clear with low slippage; a large exit ($5M+) by a non-whitelisted holder would move the Curve pool meaningfully. **Slippage curve per size: TODO (quote on-chain).**
- The cleanest mitigation for Yearn is to be **whitelisted** so it can redeem 1:1 directly, removing dependence on pool depth.
- USDat itself has **no withdrawal queue**. (The queue applies to sUSDat / STRC liquidation.)
- Behavior under stress / historical drawdown liquidity: **TODO** (insufficient history — <3 months).

## Centralization & Control Risks

### Governance

- **Upgradeable:** USDat is a `TransparentUpgradeableProxy`. Implementation: [`0x17cac25c6d6bbcb592837fea083a5c8eb4d1e52e`](https://etherscan.io/address/0x17cac25c6d6bbcb592837fea083a5c8eb4d1e52e). ProxyAdmin: [`0xcf1072DA5f0D127AEf99136489BAd08bFa3D1A7D`](https://etherscan.io/address/0xcf1072DA5f0D127AEf99136489BAd08bFa3D1A7D), **owned by the Admin address** `0x6101…6820`.
- **No on-chain timelock for upgrade/admin/compliance keys and no Gnosis Safe** — the Admin, Compliance, and Processor addresses are **Fireblocks 2-of-3 MPC** wallets (per docs). A 2/3 MPC is functionally a low-threshold, no-timelock controller. Exception: `ASSET_CAP_MANAGER_ROLE` has moved to the Saturn Timelock with a 5-day delay.
- **Privileged roles (verified on-chain via `hasRole`):**

| Role | Holder | Type | Power |
|------|--------|------|-------|
| `DEFAULT_ADMIN_ROLE` + ProxyAdmin owner | `0x6101…6820` (Admin) | Fireblocks 2/3 MPC | Grant/revoke roles; **upgrade the implementation** |
| `FREEZE_MANAGER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | Freeze/unfreeze any account |
| `FORCED_TRANSFER_MANAGER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | **Seize** tokens from frozen accounts |
| `PAUSER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | Pause all transfers |
| `WHITELIST_MANAGER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | Manage mint/redeem whitelist |
| `YIELD_RECIPIENT_MANAGER_ROLE` | `0x09D6…729f` (Processor) | Fireblocks 2/3 MPC | Change the yield recipient |
| `ASSET_CAP_MANAGER_ROLE` | `0x7d34…78f7` (Saturn Timelock) | Timelock contract (`getMinDelay()` = 5 days) | Authorize/cap additional backing assets |

- **Can governance pause, freeze, or seize user funds? Yes** — freeze + forced transfer + pause are all live and held by the Compliance MPC. These are standard regulated-stablecoin compliance controls (cf. USDG, USDC) but represent real holder risk and a notable centralization signal.
- **Documentation discrepancy (resolved in favour of on-chain):** Saturn's internal Ops/Risk doc describes an *earlier* design in which "funds that back USDat are held in a Copper custodial multisig wallet" (not in the contract) and the admin is a "3-of-5 multisig." The **live, on-chain design supersedes this**: USDat is an M0 extension, the `$M` backing sits **in the token contract** (verified: `M.balanceOf(USDat)` = $126M), and the main admin/compliance roles are held by **Fireblocks 2/3 MPC** addresses (per the key-addresses page), while asset-cap management now sits behind the Saturn Timelock. Treat on-chain state as authoritative; the "off-chain custody / 3-of-5" framing is stale. The exact MPC signer threshold cannot be verified on-chain (MPC is off-chain) — taken from docs.

### Programmability

- Core mint/redeem and accounting are **programmatic and on-chain**: USDat is 1:1 non-rebasing; the index/exchange rate is read from M0 (`currentIndex()`); backing is verifiable on-chain.
- Off-chain dependencies: user **onboarding/KYC** (whitelist), the USDC↔`$M` swap routing in Saturn's app, and the sUSDat STRC management (off-chain). For USDat-as-collateral the critical accounting is on-chain.

### External Dependencies

- **M0 is a single critical dependency.** USDat is 100% backed by `$M`; if M0 depegs, is paused, or its Treasury backing is impaired, USDat is directly affected. M0 is a permissioned stablecoin protocol with its own governance and minter set. **TODO: assess M0's own risk posture (minter collateralization, governance, audits) — it is the de-facto floor on USDat's risk.**
- **M0 Swap Facility** (`0xB680…6278`) — the sole mint/redeem contract; an M0/Saturn-controlled component. **TODO: confirm who controls/can-upgrade the Swap Facility and which assets it accepts.**
- **Fireblocks MPC** infrastructure underpins the Admin, Compliance, and Processor keys.
- Oracles: STRC price feeds and the Chainlink `Saturn sUSDat NAV` feed are relevant to sUSDat NAV, not USDat's 1:1 peg. The sUSDat yield is packaged STRC credit/dividend exposure, not generic "stablecoin yield"; it carries off-chain custody/execution, NAV/oracle, and withdrawal-queue liquidity risk.

## Operational Risk

- **Team:** Backed by reputable investors (**YZi Labs**, **Sora Ventures**). Founder/team identities and track record: **TODO** (not fully verified this session).
- **Documentation:** GitBook plus a detailed private DD pack (FAQ, contract spec, ops/risk, STRC analysis). Reasonably thorough, but contains **internal inconsistencies** — see the Governance note on the stale "Copper custodial / 3-of-5" description. Quality: good for a young protocol, with version drift.
- **Legal structure / jurisdiction (from DD docs):** A **Cayman foundation** owns a **BVI token issuer ("Saturn Capital")** that receives user stablecoins and issues USDat. When USDat is staked, Saturn Capital invests via a **regulated BVI fund ("Saturn Fund")** that holds the STRC; the smart-contract layer is launched under **Panama** jurisdiction. Off-chain service providers: **Galaxy** (execution broker / on-off-ramp), **Clear Street** (STRC custody, Galaxy's partner), **Securitize** (fund administrator/transfer agent), **Fireblocks** (key management). Note: per the DD docs, "ownership claims cannot be enforced in court for the capital backing the protocol" — relevant mainly to the **sUSDat/STRC** layer (USDat's `$M` backing is on-chain).
- **Incident response:** Documented compliance levers (pause, blacklist + fund recall via forced transfer) exist; a formal tested incident-response plan is **TODO**.

## Monitoring

Key contracts and signals:

| What | Contract / Call | Threshold / Watch |
|------|------------------|-------------------|
| Backing ratio | `M.balanceOf(0x2323…aa71)` vs `USDat.totalSupply()` | Alert if backing/supply < 1.00 (any shortfall) |
| Peg | Curve pool `0xf4d0…96d7` price; off-chain USDat/USD | Alert on >0.5% deviation from $1 |
| Implementation upgrade | `ProxyAdmin 0xcf10…1A7D` `Upgraded` events; EIP-1967 impl slot of `0x2323…aa71` | Alert on **any** upgrade |
| Admin/role changes | `RoleGranted`/`RoleRevoked` on USDat; ProxyAdmin `OwnershipTransferred` | Alert on any change to the role table above |
| Freeze / forced transfer / pause | `Freeze`/`ForcedTransfer`/`Paused` events on USDat | Alert on any event |
| New backing assets | `AssetCapSet` events; `totalAssets()` | Alert if non-`$M` backing becomes material |
| Yield recipient change | `setYieldRecipient` / yield-recipient events | Alert on change |
| Liquidity depth | Curve `0xf4d0…96d7` / `0x6206…9a7a` balances | Alert if USDat-side depth drops sharply |
| M0 health | `$M` peg, M0 total supply / pause status (`0x866A…be1b`) | Track underlying-protocol risk |

Recommended frequency: backing ratio and peg **hourly**; governance/upgrade/freeze events **real-time** (event-driven); liquidity and M0 health **daily**.

## Appendix: Contract Architecture

```
GOVERNANCE (Fireblocks 2/3 MPC for admin/compliance; asset caps timelocked)
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Admin 0x6101…6820   → DEFAULT_ADMIN_ROLE + owns ProxyAdmin (upgrade)  │
  │ Compliance 0x10D5…703B → FREEZE / FORCED_TRANSFER / PAUSER / WHITELIST│
  │ Processor 0x09D6…729f  → YIELD_RECIPIENT_MANAGER                      │
  │ Timelock 0x7d34…78f7 → ASSET_CAP_MANAGER                         │
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
        │   impl 0x17ca…e52e  (M0 JMIExtension + ForcedTransfer)│
        │   1:1 non-rebasing wrapper · whitelist on wrap/unwrap │
        └───────▲───────────────────────────────┬─────────────┘
                │ wrap/unwrap (onlySwapFacility) │ holds backing
        ┌───────┴────────────┐          ┌────────▼─────────────┐
        │ M0 Swap Facility   │◀──USDC──▶│ $M (M0 token)        │
        │ 0xB680…6278        │  swap    │ 0x866A…be1b          │
        └────────────────────┘          └────────┬─────────────┘
                                                  │ backed by
PROTOCOL / UNDERLYING                             ▼
        ┌─────────────────────────────────────────────────────┐
        │ M0 protocol — tokenized U.S. Treasuries (off-chain   │
        │ reserves, M0 governance & minters)                   │
        └─────────────────────────────────────────────────────┘

YIELD LAYER (context only — not USDat backing)
        sUSDat 0xD166…2Df7 (ERC-4626 on USDat) → STRC (Strategy BTC-backed
        preferred equity) → queued redemptions, STRC price feeds
```

---

## Risk Summary

### Key Strengths

- **100% on-chain-verifiable backing** in `$M` (tokenized U.S. Treasuries); backing ≥ supply confirmed on-chain, reconciles with DefiLlama TVL.
- **Closed, collateral-gated mint** — no `MINTER_ROLE`; USDat can only be minted by depositing backing through the M0 Swap Facility (no unbacked-mint path absent an upgrade).
- **Freely transferable** despite the whitelist (whitelist gates only mint/redeem), so secondary-market holding/transfer is unrestricted.
- High-quality, well-audited underlying codebase (M0 `m-extensions`); thin bespoke Saturn surface.
- Reputable backers (YZi Labs, Sora Ventures); 1:1 prompt redemption for onboarded users.

### Key Risks

- **Highly centralized control:** the Admin, Compliance, and Processor keys are Fireblocks **2/3 MPC** wallets with **no timelock**; the Admin can **upgrade** the token at will, and Compliance can **freeze, seize, and pause** user funds. Asset-cap changes are now behind the Saturn Timelock (5-day delay), which is an improvement but does not reduce the upgrade/admin trust assumption.
- **Single critical dependency on M0** — USDat fully inherits `$M`'s peg and M0's (off-chain, attested) Treasury risk; USDat holds ~37% of all `$M`.
- **Very young** (~2.5 months live) with no track record through stress.
- **sUSDat context risk:** sUSDat yield is packaged STRC credit/dividend exposure with off-chain custody/execution, NAV/oracle reliance, and withdrawal-queue liquidity risk. This is separate from USDat backing but relevant if USDat liquidity or peg support depends on the broader Saturn system.
- **Exit for non-whitelisted holders is secondary-market only** (~$19M Curve depth vs ~$126M supply); direct 1:1 redemption requires onboarding.

### Critical Risks `[If Any]`

- Upgradeable proxy controlled by a 2/3 MPC with no timelock means **the trust model ultimately rests on the Admin keys** — a compromised/misused Admin MPC could redefine the token (including minting). This does not by itself trip a critical gate (it is not a single EOA, reserves are verifiable, and there are audits), but it is the dominant risk.
- The deployed USDat token relies on the M0 extension model. Certora Audit #3 covers Saturn's M0 Extensions implementation, but USDat still inherits M0's own governance, reserve, and swap-facility risks.

---

## Risk Score Assessment

**Scoring Guidelines:** Conservative; on-chain evidence prioritized.

### Critical Risk Gates

- [ ] **No audit** — Not triggered (four reports reviewed: 1× Three Sigma + 3× Certora incl. formal verification; Certora Audit #3 covers the deployed M0-extension design).
- [ ] **Unverifiable reserves** — Not triggered (`$M` backing is verifiable on-chain in real time).
- [ ] **Total centralization** — Not triggered (2/3 MPC + roles, not a single EOA), though centralization is high.

**All gates pass** → proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits:** Strong on paper — four reports (1× Three Sigma + 3× Certora incl. formal verification), zero unresolved Highs/Criticals in the public summaries, and Certora Audit #3 covers the deployed M0-extension design. Remaining negatives are young code, centralization/configuration risk, and no bug bounty → **2.5**.
- **Historical:** <3 months in production (→5 on time) but >$100M TVL (→1 on scale); the youth dominates and high TVL this early is not a maturity signal → **4.0**.

**Audits & Historical Score = (2.5 + 4.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance:** Upgradeable proxy controlled by 2/3 MPC with no timelock; Compliance can freeze/seize/pause; asset-cap management is timelocked → **4.0**.
- **Programmability:** Mostly programmatic; 1:1 non-rebasing, index read on-chain; some off-chain onboarding → **2.0**.
- **External Dependencies:** Single critical dependency on M0 (plus Fireblocks) → **4.0**.

**Centralization Score = (4.0 + 2.0 + 4.0) / 3 = 3.33**

**Score: 3.3/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization:** 100% on-chain `$M` backing, high-quality (Treasuries) but one layer removed via M0 → **2.5**.
- **Provability:** `$M` backing real-time on-chain; deeper Treasury layer off-chain/attested; Accountable-backed Chainlink sUSDat NAV feed is live for the yield layer → **2.5**.

**Funds Management Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5**

#### Category 4: Liquidity Risk (Weight: 15%)

- 1:1 direct redemption for onboarded users; for others, market-based exit via ~$19M Curve pool against ~$126M supply (1–3% slippage on mid-size, more on large exits) → **3.0**.

**Score: 3.0/5**

#### Category 5: Operational Risk (Weight: 5%)

- Reputable backers, adequate docs with gaps, team/legal/incident-response details unverified → **2.5**.

**Score: 2.5/5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.25 | 20% | 0.65 |
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.97 ≈ 3.0 / 5.0** |

**Optional Modifiers:** none apply (protocol <2 years, TVL history <1 year).

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: MEDIUM RISK (3.0/5.0) — Approved with enhanced monitoring**

---

## Reassessment Triggers `[If Applicable]`

- **Time-based:** Reassess in **3 months** (protocol is <3 months old; track maturity and audit confirmation).
- **TVL-based:** Reassess if USDat supply changes by more than **±30%**, or if backing/supply ratio drops below 1.00.
- **Dependency-based:** Reassess on any `$M`/M0 depeg, pause, or governance/minter change.
- **Governance-based:** Reassess on any USDat implementation upgrade, role change, or a freeze/forced-transfer/pause event.
- **Backing-mix-based:** Reassess if non-`$M` backing assets become material (`AssetCapSet`).
- **Incident-based:** Reassess after any exploit or peg deviation.

---

## Pending TODOs (for follow-up)

1. Confirm **Safe Harbor (SEAL)** status (bug bounty confirmed **none** — not in docs, not on Immunefi).
2. Assess **M0's own risk** (minter collateralization, governance, audits) as the floor on USDat risk; confirm who controls/can-upgrade the **M0 Swap Facility** and accepted assets.
3. Pull **holder distribution** and **historical peg/price** series (Etherscan Pro / Dune).
4. Confirm **team identities** and **seed amount** ($800K vs $2M). (GitHub repos now recorded: `saturn-organization/saturn-dollar`, `saturn-organization/saturn-yield-dollar`.)
5. Quote **on-chain slippage** for USDat exit sizes ($1M / $5M / $10M) on the Curve pool.
6. Optional: generate the contract dependency graph YAML at `reports/graph/saturn-usdat.yaml`.

### Sources consulted this session

GitBook docs + key addresses; on-chain verification via `cast`/Etherscan; DefiLlama TVL; the issue's deeper sources rendered via Notion's public page API and a Google Docs text export (Saturn DD FAQ, Product Operations & Risk, STRC Risk Analysis, STRC Product intro, and the contract-spec doc); and the **four published audit PDFs** (Three Sigma Audit #1; Certora Audit #2, Audit #3, Formal Verification), Certora public report pages, Chainlink data feed page. The Lucidchart flow-of-funds and the X post were not ingested.
