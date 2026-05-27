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
- GitHub Repository — TODO (Saturn `USDat.sol` extends the open-source [M0 `m-extensions`](https://github.com/m0-foundation) library; a dedicated Saturn repo was not located)
- [M0 Documentation](https://docs.m0.org/) — underlying `$M` token
- [Serenity Research — USDat Initial Review (May 2026)](https://serenityresearch.substack.com/p/serenity-premium-usdat-by-saturn) (third-party)
- [Alea Research — Saturn: Building Bitcoin's Credit Layer](https://alearesearch.substack.com/p/saturn-building-bitcoins-credit-layer) (third-party)
- LlamaRisk / Steakhouse coverage — TODO (none located as of assessment date)

## Audits and Due Diligence Disclosures

- The Saturn docs [Transparency & Audits](https://saturncredit.gitbook.io/saturn-docs/operations-and-governance/transparency-and-audits) page references **four audit report files**, but the firm names, dates and scopes are not displayed inline (they are gitbook file links). **TODO: download each report and record firm, date, scope, and unresolved findings.**
- The bulk of USDat's logic is the **M0 `m-extensions` library** (`JMIExtension`, `MYieldToOne`, `Freezable`, `ForcedTransferable`, `Pausable`). This M0 codebase has been independently audited multiple times as part of the M0 protocol. Saturn's own additions are a thin `USDat.sol` wrapper (whitelist gating + forced-transfer wiring), which lowers bespoke-code risk.
- Smart-contract architecture complexity: **moderate**. USDat is a `TransparentUpgradeableProxy` over a well-structured M0 extension. The novel surface is small; the main risk is upgradeability and admin powers, not contract complexity.
- Unresolved audit findings: **TODO** (pending audit report review).

### Bug Bounty `[If Applicable]`

- No bug bounty program located on the docs site or Immunefi. **TODO: confirm whether a program exists.**
- Safe Harbor (SEAL) adoption: **TODO** — not confirmed.

## Historical Track Record

- **Time in production: ~2.5 months** (USDat deployed 2026-03-10). This is very young.
- TVL: ~$126M, reached quickly after launch. High TVL in a <3-month-old protocol is itself a concentration consideration rather than a maturity signal.
- Past security incidents: none known (none expected given age).
- Peg history: USDat trades near $1; the Curve USDC/USDat pool is roughly balanced (see Liquidity). No depeg events observed. **TODO: pull historical peg/price series for a fuller picture.**
- Concentration risk from large depositors / holder distribution: **TODO** (holder list requires Etherscan Pro). A large fraction of supply is staked into sUSDat (sUSDat supply ≈ 106.5M shares).
- Funding: seed round (Jan 2026) led by **YZi Labs** and **Sora Ventures** plus angels. Reported amount conflicts across sources ($800K vs $2M) — **TODO: confirm**.

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
- Fees / rate limits / cooldowns on USDat mint/redeem: **TODO** (not documented inline).

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
- **Risk curation:** asset caps for additional backing assets are managed by `ASSET_CAP_MANAGER_ROLE` (Processor MPC).

### Provability

- USDat's `$M` backing is **fully on-chain verifiable in real time** (`M.balanceOf(USDat)` vs `totalSupply()`), and the exchange rate (`currentIndex()`) is read programmatically from M0 — anyone can compute it.
- The **next layer down** (M0's Treasury reserves backing `$M`) is off-chain and relies on M0's own attestation/governance.
- Saturn states it is working with **Accountable** for real-time proof-of-reserves and that **Chainlink** will publish a NAV oracle from the Accountable feed. **TODO: confirm whether the Accountable PoR feed and Chainlink NAV oracle are live, and their addresses/update cadence.** A `Saturn STRC Price Feed` (`0x5f7eCD0D045c393da6cb6c933c671AC305A871BF`) and a `Chainlink STRC Price Feed` (`0xf4d2076277fff631EFC4385Ab36b1f7734218d23`) exist (these relate to STRC/sUSDat NAV).

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
- **No on-chain timelock and no Gnosis Safe** — all privileged addresses are **Fireblocks 2-of-3 MPC** wallets (per docs). A 2/3 MPC is functionally a low-threshold, no-timelock controller.
- **Privileged roles (verified on-chain via `hasRole`):**

| Role | Holder | Type | Power |
|------|--------|------|-------|
| `DEFAULT_ADMIN_ROLE` + ProxyAdmin owner | `0x6101…6820` (Admin) | Fireblocks 2/3 MPC | Grant/revoke roles; **upgrade the implementation** |
| `FREEZE_MANAGER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | Freeze/unfreeze any account |
| `FORCED_TRANSFER_MANAGER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | **Seize** tokens from frozen accounts |
| `PAUSER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | Pause all transfers |
| `WHITELIST_MANAGER_ROLE` | `0x10D5…703B` (Compliance) | Fireblocks 2/3 MPC | Manage mint/redeem whitelist |
| `YIELD_RECIPIENT_MANAGER_ROLE` | `0x09D6…729f` (Processor) | Fireblocks 2/3 MPC | Change the yield recipient |
| `ASSET_CAP_MANAGER_ROLE` | `0xA18f…A3Ad` (Processor 2) | Fireblocks 2/3 MPC | Authorize/cap additional backing assets |

- **Can governance pause, freeze, or seize user funds? Yes** — freeze + forced transfer + pause are all live and held by the Compliance MPC. These are standard regulated-stablecoin compliance controls (cf. USDG, USDC) but represent real holder risk and a notable centralization signal.

### Programmability

- Core mint/redeem and accounting are **programmatic and on-chain**: USDat is 1:1 non-rebasing; the index/exchange rate is read from M0 (`currentIndex()`); backing is verifiable on-chain.
- Off-chain dependencies: user **onboarding/KYC** (whitelist), the USDC↔`$M` swap routing in Saturn's app, and the sUSDat STRC management (off-chain). For USDat-as-collateral the critical accounting is on-chain.

### External Dependencies

- **M0 is a single critical dependency.** USDat is 100% backed by `$M`; if M0 depegs, is paused, or its Treasury backing is impaired, USDat is directly affected. M0 is a permissioned stablecoin protocol with its own governance and minter set. **TODO: assess M0's own risk posture (minter collateralization, governance, audits) — it is the de-facto floor on USDat's risk.**
- **M0 Swap Facility** (`0xB680…6278`) — the sole mint/redeem contract; an M0/Saturn-controlled component. **TODO: confirm who controls/can-upgrade the Swap Facility and which assets it accepts.**
- **Fireblocks MPC** infrastructure underpins all admin keys.
- Oracles: STRC price feeds (Saturn + Chainlink) are relevant to sUSDat NAV, not USDat's 1:1 peg.

## Operational Risk

- **Team:** Backed by reputable investors (**YZi Labs**, **Sora Ventures**). Founder/team identities and track record: **TODO** (not fully verified this session).
- **Documentation:** Reasonably complete gitbook covering architecture, addresses, and a transparency page; some operational specifics (redemption fees, audit firm names, PoR status) are not inline. Quality: adequate with gaps.
- **Legal structure / jurisdiction:** **TODO** ("Saturn Labs"; not confirmed).
- **Incident response plan:** **TODO** (not documented).

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
GOVERNANCE (Fireblocks 2/3 MPC — no timelock)
  ┌─────────────────────────────────────────────────────────────────────┐
  │ Admin 0x6101…6820   → DEFAULT_ADMIN_ROLE + owns ProxyAdmin (upgrade)  │
  │ Compliance 0x10D5…703B → FREEZE / FORCED_TRANSFER / PAUSER / WHITELIST│
  │ Processor 0x09D6…729f  → YIELD_RECIPIENT_MANAGER                      │
  │ Processor2 0xA18f…A3Ad → ASSET_CAP_MANAGER                            │
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

- **Highly centralized control:** every privileged key is a Fireblocks **2/3 MPC** with **no timelock**; the Admin can **upgrade** the token at will, and Compliance can **freeze, seize, and pause** user funds.
- **Single critical dependency on M0** — USDat fully inherits `$M`'s peg and M0's (off-chain, attested) Treasury risk; USDat holds ~37% of all `$M`.
- **Very young** (~2.5 months live) with no track record through stress.
- **Exit for non-whitelisted holders is secondary-market only** (~$19M Curve depth vs ~$126M supply); direct 1:1 redemption requires onboarding.

### Critical Risks `[If Any]`

- Upgradeable proxy controlled by a 2/3 MPC with no timelock means **the trust model ultimately rests on the Admin keys** — a compromised/misused Admin MPC could redefine the token (including minting). This does not by itself trip a critical gate (it is not a single EOA, reserves are verifiable, and there are audits), but it is the dominant risk.

---

## Risk Score Assessment

**Scoring Guidelines:** Conservative; on-chain evidence prioritized.

### Critical Risk Gates

- [ ] **No audit** — Not triggered (audit reports referenced; underlying M0 library independently audited). *Confirm firms — TODO.*
- [ ] **Unverifiable reserves** — Not triggered (`$M` backing is verifiable on-chain in real time).
- [ ] **Total centralization** — Not triggered (2/3 MPC + roles, not a single EOA), though centralization is high.

**All gates pass** → proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits:** Four referenced reports + heavily-audited M0 library, but Saturn-specific firms/dates unverified and no confirmed bug bounty → **2.5**.
- **Historical:** <3 months in production (→5 on time) but >$100M TVL (→1 on scale); the youth dominates and high TVL this early is not a maturity signal → **4.0**.

**Audits & Historical Score = (2.5 + 4.0) / 2 = 3.25**

**Score: 3.25/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance:** Upgradeable proxy, 2/3 MPC, no timelock, can freeze/seize/pause → **4.0**.
- **Programmability:** Mostly programmatic; 1:1 non-rebasing, index read on-chain; some off-chain onboarding → **2.0**.
- **External Dependencies:** Single critical dependency on M0 (plus Fireblocks) → **4.0**.

**Centralization Score = (4.0 + 2.0 + 4.0) / 3 = 3.33**

**Score: 3.3/5**

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization:** 100% on-chain `$M` backing, high-quality (Treasuries) but one layer removed via M0 → **2.5**.
- **Provability:** `$M` backing real-time on-chain; deeper Treasury layer off-chain/attested; Accountable PoR + Chainlink NAV planned but not confirmed live → **2.5**.

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

1. Download the **4 audit reports** from the Saturn docs and record firm, date, scope, and unresolved findings.
2. Confirm **bug bounty** existence and Safe Harbor (SEAL) status.
3. Confirm **Accountable PoR feed** and **Chainlink NAV oracle** live status, addresses, and update cadence.
4. Assess **M0's own risk** (minter collateralization, governance, audits) as the floor on USDat risk; confirm who controls/can-upgrade the **M0 Swap Facility** and accepted assets.
5. Pull **holder distribution** and **historical peg/price** series (Etherscan Pro / Dune).
6. Confirm **team identities/legal entity**, **seed amount** ($800K vs $2M), and **USDat redemption fees/cooldown** (if any).
7. Quote **on-chain slippage** for USDat exit sizes ($1M / $5M / $10M) on the Curve pool.
8. Optional: generate the contract dependency graph YAML at `reports/graph/saturn-usdat.yaml`.
