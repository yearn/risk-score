# Protocol Risk Assessment: Superstate USTB

- **Assessment Date:** March 5, 2026 (Updated: October 18, 2026)
- **Token:** USTB
- **Chain:** Ethereum
- **Token Address:** [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)
- **Final Score: 2.10/5.0**

## Overview + Links

USTB is a tokenized investment fund that provides exposure to short-duration U.S. Treasury Bills and Agency securities. The fund's investment objective is to seek current income consistent with liquidity and stability of principal, targeting returns in line with the federal funds rate. The fund is officially named the **"Invesco Short Duration US Government Securities Fund"** — the name is also set onchain in the token contract's `name()` — and is externally managed by **Invesco Advisers, Inc.** under a strategic partnership with Superstate. Superstate announced the partnership in March 2026 ([newsroom](https://superstate.com/newsroom/invesco-superstate-bring-world-class-funds-onchain)), bringing Invesco as the first external asset manager on the Superstate platform. The placement agent is **Invesco Distributors, Inc.** and the transfer agent is **Superstate Services LLC** (not affiliated with Invesco). The fund's CUSIP is 86851T204.

USTB uses a **price appreciation model** (non-rebasing) — each USTB token represents one share in the fund, and the NAV per share increases daily as interest income from Treasury Bills accrues. The token price has grown from ~$10.00 at inception (February 2024) to ~$11.25 as of October 2026.

Investors undergo KYC/AML onboarding, get their wallet addresses whitelisted on the AllowList smart contract, and can then subscribe (mint) or redeem (burn) USTB tokens via USDC or USD. Onchain atomic subscription and redemption is available through the Protocol Mint and Redeem system, with a USDC instant redemption facility whose balance swings between zero and ~$10M as it is drawn down and refilled (median ~$5.2M since mid-August 2026).

The fund is structured as a series of **Superstate Asset Trust**, a **Delaware Statutory Trust**, providing bankruptcy remoteness from Superstate Inc. The investment manager is **Invesco Advisers, Inc.** (replacing Federated Hermes as of the March 2026 partnership), the custodian is **The Bank of New York Mellon** (replacing UMB Bank), and the auditor is **PricewaterhouseCoopers LLP**. NAV calculation is performed by **NAV Fund Services**.

- **Current NAV/Share:** $11.246553 (official daily NAV, [Superstate API](https://api.superstate.com/v1/funds/1/nav-daily), October 18, 2026 row). Onchain at **block [26,221,493](https://etherscan.io/block/26221493)** (2026-10-18T19:18:59Z): Chainlink feed $11.246553 — an exact match to the official NAV — and SuperstateOracle $11.249846, round 463. The SuperstateOracle figure is *not* reproducible without pinning the block: it extrapolates linearly and continuously, so it advances every second between checkpoints.
- **Onchain Supply (Ethereum):** 53,751,560.27 USTB (~$604.5M at $11.246553)
- **DeFiLlama:** the [Invesco USTB listing](https://defillama.com/protocol/invesco-ustb) (formerly "Superstate USTB", slug `superstate-ustb`) now uses a `dummy.js` adapter and returns an empty TVL series, so DeFiLlama no longer tracks USTB TVL. The historical peak it recorded was ~$923.8M on April 28, 2026. TVL in this report is taken from onchain supply × NAV and the Superstate NAV API.
- **Total AUM (all networks + book-entry):** $819,437,092 with 72,861,177 shares outstanding (per [Superstate NAV API](https://api.superstate.com/v1/funds/1/nav-daily), October 18, 2026). Ethereum holds ~73.8% of shares; the remaining ~26.2% is split between book-entry, Plume, and Solana (USTB mint [`CCz3SGVz…`](https://explorer.solana.com/address/CCz3SGVziFeLYk2xfEstkiqJfYkjaSWb2GCABYsVcjo2)). `TODO`: Plume and Solana token supplies — no Plume (`RPC_98866`) or Solana RPC is configured in `.env`. AUM peaked at $1.061B on May 19, 2026 and touched ~$737M in late September 2026 before recovering.
- **Onchain Holders (Ethereum):** 81 addresses with a nonzero balance, reconstructed from all 31,582 `Transfer` events since deployment (balances sum exactly to `totalSupply()`), October 18, 2026
- **Current APY:** 3.60% (30-day yield), 3.58% (7-day yield), 3.65% (1-day yield) — [Superstate yield API](https://api.superstate.com/v1/funds/1/yield), as of October 15, 2026
- **Management Fee:** 0.15% annually for all investors, with a monthly rebate of 0.10% on average daily holdings above $25M. No performance fee. ([superstate.com/assets/ustb](https://superstate.com/assets/ustb), footnote 2)

**Links:**

- [Protocol Documentation](https://docs.superstate.com/)
- [USTB Fund Info](https://superstate.com/assets/ustb)
- [Smart Contract Addresses](https://docs.superstate.com/investors/smart-contracts) — the Plume Mainnet entries list [`0xe4fa682f…`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) (USTB) and [`0x4c21b757…`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) (USCC), which collide with the Ethereum Superstate Oracle and RedemptionIdle addresses. This is **not** a documentation error: both are genuine Plume deployments (same deployer, same nonce, different chain), confirmed via Plume RPC — [`0xe4fa682f…`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) returns `name() == "Invesco Short Duration US Government Securities Fund"`, `symbol() == "USTB"`, `VERSION() == "1.3.0"`, supply ~169,699 USTB.
- [Security Documentation](https://docs.superstate.com/investors/security)
- [Public Fund API — Daily NAV](https://api.superstate.com/v1/funds/1/nav-daily) · [Yield](https://api.superstate.com/v1/funds/1/yield) · [Portfolio Holdings](https://api.superstate.com/v2/funds/1/holdings)
- [GitHub (legacy USTB contracts, last updated April 2025)](https://github.com/superstateinc/ustb/tree/main)
- [LlamaRisk Assessment](https://www.llamarisk.com/research/2024-10-07t21-32-09-000z) — **October 2024, ~24 months old.** Predates the Invesco partnership, the BNY Mellon custodian change, the auditor change to PwC, and the entire `FundToken` migration. Treat its architecture and service-provider descriptions as historical.
- [Aave Forum — USTB/BUIDL GSM](https://governance.aave.com/t/arfc-ustb-buidl-gsm/19299/3)
- [DeFiLlama — USTB](https://defillama.com/protocol/invesco-ustb)
- [CoinGecko](https://www.coingecko.com/en/coins/superstate-short-duration-us-government-securities-fund-ustb)
- [Chainlink USTB NAV/Share Feed](https://data.chain.link/feeds/ethereum/mainnet/ustb-nav-per-share)
- [RWA.xyz](https://app.rwa.xyz/assets/USTB)
- [Etherscan Token Page](https://etherscan.io/token/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)

## Contract Addresses

*All addresses as of October 18, 2026 (block 26,221,493).*

| Contract | Address |
|----------|---------|
| USTB Token (Proxy) | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) |
| USTB Implementation (FundToken, VERSION "1.3.0") | [`0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c`](https://etherscan.io/address/0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c) |
| USTB ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) |
| AllowList V4.2 (Proxy, OZ v5 TransparentUpgradeableProxy) | [`0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f`](https://etherscan.io/address/0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f) |
| AllowList Implementation (AllowlistV4_2, VERSION "4.2.0") | [`0x2151706cb4763c20381a8860e25a713f6e1e3b93`](https://etherscan.io/address/0x2151706cb4763c20381a8860e25a713f6e1e3b93) |
| AllowList ProxyAdmin (OZ v5 `ProxyAdmin`, `upgradeAndCall` only) | [`0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46`](https://etherscan.io/address/0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46) |
| Superstate Continuous Price Oracle (not a proxy) | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) |
| Chainlink USTB NAV/Share Oracle | [`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC) |
| RedemptionIdle (Proxy) | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) |
| RedemptionIdle Implementation | [`0x8efba8af37af48d2e0a04b0aae60f0e9bc8de007`](https://etherscan.io/address/0x8efba8af37af48d2e0a04b0aae60f0e9bc8de007) |
| RedemptionIdle ProxyAdmin | [`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869) |
| USDC Sweep Destination (EOA) | [`0x774AE279c21B6a17a6E2BD5ab5398FF98F398807`](https://etherscan.io/address/0x774AE279c21B6a17a6E2BD5ab5398FF98F398807) |

### Owner Addresses

The system is controlled by **4 distinct EOAs** (all code size 0, no multisig, October 18, 2026):

| Role | Address |
|------|---------|
| USTB Token Owner + USTB ProxyAdmin Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) |
| AllowList Owner + AllowList ProxyAdmin Owner | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) |
| RedemptionIdle Owner + RedemptionIdle ProxyAdmin Owner | [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) |
| Oracle Owner | [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) |

## Audits and Due Diligence Disclosures

Superstate has undergone **16 security audits** from 5 firms (0xMacro ×11, Zellic ×2, ChainSecurity, Offside Labs, Certora), making this one of the most extensively audited RWA tokenization protocols. **However, none of them scope the implementation currently deployed for USTB** — see "Audit coverage gap on the live implementation" below.

### Audit History

| # | Firm | Date | Scope | Key Findings |
|---|------|------|-------|-------------|
| A-1 | **0xMacro** | Jul 2024 | Redemption contract | 2M (1 fixed, 1 won't do — USDC peg assumption) |
| A-2 | **0xMacro** | Jul 2024 | USTB/USCC Token + AllowList | 1M (fixed — EIP-2612 non-compliance), 8 code quality |
| A-3 | **0xMacro** | Nov 2024 | Liquidation, Oracle, Token V2 | 3M (all fixed — oracle underflow, SafeERC20, deploy scripts) |
| A-4 | **0xMacro** | Nov 2024 | Token + Redemption V2 | 2H (fixed — redemption fee bypass, subscribe allowlist bypass), 1M (fixed) |
| A-5 | **0xMacro** | Jan 2025 | Token V3 + Redemption | No H/M/L issues — cleanest EVM audit |
| A-6 | **0xMacro** | Apr 2025 | Token + Redemption updates | No H/M/L issues |
| A-7 | **0xMacro** | May 2025 | Solana Allowlist Program | 2C (fixed — ownership validation bypass), 1H (fixed — PDA frontrunning DOS) |
| A-8 | **0xMacro** | May 2025 | Equity Token (new product) | 1H (fixed — incorrect event source) |
| A-9 | **0xMacro** | Jul 2025 | AllowlistV3 (EVM) | No issues found — cleanest audit |
| A-10 | **0xMacro** | Nov 2025 | DIP (Direct Issuance Protocol), Dippable, EquityToken | 3L (1 addressed, 2 acknowledged), 4 code quality, 2 informational. No C/H/M |
| A-11 | **0xMacro** | Feb 2026 | DIP v1.1, Dippable, EquityToken | No issues or discrepancies found |
| -- | **Zellic** | Feb 17, 2026 | AllowlistV4_0, **FundToken**, SuperstateTokenCore + components, RedemptionV2 / RedemptionIdleV2 / RedemptionYieldV2, SuperstateOracle, Dip, EquityToken | 6 findings: 4 Low, 2 Informational. **No Critical / High / Medium** |
| -- | **Zellic** | Jun 23, 2026 | AllowlistV4_2, **FundTokenV1_2_0**, EquityTokenV1_4_0, AccountingPausable / Bridgeable / Redeemable / Subscribable / Scalable / Dippable, ERC20MetadataSettable, Dip | 2 findings: 1 Medium (v5.1→v1.2.0 migration dropped the accounting-pause flag — fixed in commit `6216afed`), 1 Informational (fixed). **No Critical / High** |
| -- | **ChainSecurity** | 2023 | Compound SUPTB (original token) | 2 Critical (fixed — encumbrance transferability, transferFrom permission bypass) |
| -- | **Offside Labs** | May 2025 | Solana Allowlist program | 6 findings — thaw-IX account-check bypass, PDA init failure, excessive rent, rent-refund logic, admin-authority DoS, permissionless-init frontrunning |
| -- | **Certora** | Apr 21–28, 2025 | Solana Allowlist program (`program/src/*`, `api/src/*`), commit `cab1688` → fix `9d357c8` | 1 Critical + 1 High + 4 Informational, **all 6 fixed**. C-01: `process_thaw()` did not check allowlist accounts, letting anyone thaw any account. H-01: grief vector on `create_pda_account` |

**Total findings across all audits: 3 Critical, 5 High, 8 Medium — all fixed or acknowledged with rationale.** The Solana allowlist thaw bypass was independently found by three firms (0xMacro A-7, Offside Labs §4.1, Certora C-01) in the same May-2025 window, and fixed.

> **Correction on Certora.** Prior versions of this report listed Certora as "formal verification — mathematical verification of contract properties" with no date or scope. The actual [Certora report](https://docs.superstate.com/investors/smart-contracts) is a **manual security assessment of the Solana Allowlist program**, not formal verification, and not of the EVM contracts. Its own methodology section states "The team performed a manual audit." **No formal verification of the USTB EVM contracts is evidenced by any published Superstate document.**

**Audit coverage gap on the live implementation:** the deployed USTB implementation is `FundTokenV1_3_0` ([`0xb3ac55dd…`](https://etherscan.io/address/0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c), `VERSION() == "1.3.0"`, deployed July 21, 2026).

- **v1.3.0 is not covered by any published audit.** Zellic's February 2026 engagement scoped `token/src/fund/FundToken.sol`; its June 2026 engagement scoped `token/src/fund/v1.2.0/FundTokenV1_2_0.sol` at commit `1b6d2c63`. The deployed contract is a *different, later* version, shipped one day after v1.2.0 went live. The v1.2.0 → v1.3.0 delta has **no public audit coverage and cannot be independently reviewed**. By contrast, the live AllowList (`AllowlistV4_2`, `VERSION() == "4.2.0"`) is the same contract name and version that Zellic's June 2026 engagement scoped.
- **The delta cannot be diffed.** The v1.3.0 source is verified on Etherscan, but it is not published in a public repository — `superstateinc/ustb` was last pushed April 2025 and still contains the legacy `SuperstateToken` code, and the audited repository `superstateinc/superstate-evm-audit` returns 404 (private). There is no public v1.2.0 source to diff the deployed v1.3.0 against.
- **What this does and does not mean.** Zellic's reviews cover the architecture, component model, and migration path that v1.3.0 inherits, and the one Medium finding (accounting-pause state dropped during migration) is demonstrably fixed in the deployed bytecode — the remediation comment appears verbatim in the Etherscan-verified source. So the deployed code is not unreviewed *in substance*. But no auditor has attested to the exact bytecode holding ~$605M, and the size of the v1.2.0→v1.3.0 change is unknown to any outside party. `TODO`: obtain the v1.3.0 changelog or an audit scoped to the deployed version.

**Smart Contract Complexity:** Moderate-to-high. The July 2026 upgrade replaced the monolithic `SuperstateTokenV5_1` with a modular `FundToken` built from ERC-7201 namespaced components (`AccountingPausable`, `Allowlistable`, `Bridgeable`, `Permittable`, `Redeemable`, `Subscribable`, `ERC20MetadataSettable`) shared with Superstate's `EquityToken`. V5.1-compatible getters (`accountingPaused()`, `allowlistV2()`, `redemptionContract()`, `supportedChainIds()`, `SUPERSTATE_TOKEN_PRECISION`) are retained so existing integrations and monitoring keep working.

**Storage migration (verified onchain).** `initializeV1_2_0` does not read the new ERC-7201 namespaces — it reads the *legacy v5.1 contiguous* slots directly via `sload` and replays them into the new namespaced layout. This is the storage-layout-sensitive pattern that produced Zellic's one Medium finding. The slot map is stated in the deployed source's own comments and confirmed by reading the proxy's storage at block 25,773,912:

| Slot | Field | `cast storage` value | Matches getter (block 25,773,912) |
|------|-------|----------------------|----------------|
| 754 | `accountingPaused` | `0x…0000` | `accountingPaused() == false` ✓ |
| 755 | `maximumOracleDelay` | `0x…0e10` (3600) | `maximumOracleDelay() == 3600` ✓ |
| 756 | `superstateOracle` | `0x…e4fa682f94610ccd170680cc3b045d77d9e528a8` | `superstateOracle()` ✓ |
| 758 | `allowlistV2` | `0x…02f1fa8b196d21c7b733eb2700b825611d8a38e5` | `allowlist()` ✓ |
| 759 | `redemptionContract` | `0x…4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf` | `getRedemptionContract()` ✓ |

Reproduce with `cast storage 0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e <slot> --block 25773912`. Note that slot 757 is unused by the migration, and that these legacy slots are *not* zeroed after migration — they retain stale copies while the live values sit in the ERC-7201 namespaces. Slot 758 shows this in practice: after the September 22, 2026 `setAllowlist()` call it still holds the retired V3.1 address while `allowlist()` returns the AllowlistV4_2 proxy. Monitoring must read the getters, not the legacy slots.

### Bug Bounty

- **Platform:** Self-hosted (security@superstate.co)
- **Rewards:** Severity- and impact-based, with a **minimum reward of $50,000** for critical vulnerabilities (smart-contract or private-key-infrastructure compromise, loss of funds, unauthorized state changes, etc.). No maximum payout is published; lower-severity findings are assessed case by case. Payouts require identity verification and sanctions screening ([Security docs](https://docs.superstate.com/investors/security))
- **Safe Harbor:** CFAA and DMCA safe harbor language for good-faith researchers
- **Note:** Self-hosted rather than on Immunefi or a similar platform, with no published maximum payout and no third-party escrow or mediation, so rewards are at Superstate's discretion above the $50K floor

### Safe Harbor

Superstate is **not** listed on the SEAL Safe Harbor registry. This is typical for regulated RWA issuers.

## Historical Track Record

- **Fund Launch:** February 2024 on Ethereum (~32 months in production)
- **Contract Deployment:** December 6, 2023 (block 18,725,909)
- **Contract Upgrades:** The USTB proxy has taken **10 implementation upgrades** since deployment (`Upgraded` events on the proxy). The most recent two came a day apart in July 2026 and replaced the legacy `SuperstateToken` line entirely: `FundTokenV1_2_0` on [July 20, 2026](https://etherscan.io/tx/0x57acccedf2e7672e3e22a36376f39314a06b7710206b289554bd85ba505a158d) and `FundTokenV1_3_0` on [July 21, 2026](https://etherscan.io/tx/0x910c0875998ca08f76ad59751906eb23cfc69392092bf6c6754a0b5598f34ae2). RedemptionIdle is still on its original implementation ([`0x8efba8af…`](https://etherscan.io/address/0x8efba8af37af48d2e0a04b0aae60f0e9bc8de007)), despite RedemptionV2 having been audited.
- **AllowList Replacement (September 22, 2026):** Pre-announced in the ["EVM Allowlist Migration from v3.1 to v4.2"](https://docs.superstate.com/investors/smart-contracts) section of Superstate's docs, which describes the interface changes (entity model removed, `isAllowed(wallet, token)` as the main read, token-only callers for `isAddressAllowedForFund`, `AllowedSet` events). Rather than upgrading the V3.1 AllowList proxy, Superstate deployed a new `AllowlistV4_2` proxy ([`0xBcBC2b4F…`](https://etherscan.io/address/0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f)) from the AllowList owner EOA on [July 17, 2026](https://etherscan.io/tx/0x36e082533efb1126b9e5b8d430681b8823a8136c88edb6ccbac80abfcb11fcb1). It pre-populated permissions over the following two months, then had the USTB owner EOA repoint the token with a single `setAllowlist()` call on [September 22, 2026](https://etherscan.io/tx/0xdc78187cb8ed874af4a3057f08a4aeccc228b52b8c7d9a80f10964a1ba8e7c21) (`AllowlistUpdated(0x02f1fa8b…, 0xBcBC2b4F…)`). USCC, VBDC and NOUS-B now read the same AllowlistV4_2 contract. The cutover stranded no one: all 81 current USTB holders return `isAllowed(holder, USTB) == true` on the new contract. The old V3.1 proxy ([`0x02f1fa8b…`](https://etherscan.io/address/0x02f1fa8b196d21c7b733eb2700b825611d8a38e5)) is no longer read by USTB.
- **Smart Contract Exploits:** None. No security incidents, hacks, or exploits reported.
- **Price History:** NAV/Share has increased monotonically from ~$10.00 (inception) to $11.246553 (October 18, 2026), consistent with steady Treasury yield accrual — the daily NAV series in the Superstate API contains no day-over-day decrease. ATL: $10.29 (Feb 2025), ATH: $11.246553 (current).
- **Pause History:** The token was paused on [December 7, 2023](https://etherscan.io/tx/0x5c7b9b2e662f99523d41f975d415cff6c085e99e41a02dff8e6ca2a723e06712) and unpaused on [May 14, 2024](https://etherscan.io/tx/0xb74bef08ee01fd1a4c5b8df2eb6d200c0e8af63bd79a72c3084022c8f0a94e7c) — the pre-launch/early-operations window. No pause events since. Accounting pause has never been engaged.
- **Admin Burn History:** `adminBurn()` has been exercised twice: [September 5, 2025](https://etherscan.io/tx/0x72d12d9913affb20ac82c927ce29d3f41fe3b84a068d38eb92f8e6beb409bf51) for 611,410.45 USTB (~$6.6M at then-NAV) from [`0xcfc50541…`](https://etherscan.io/address/0xcfc50541c3deaf725ce738ef87ace2ad778ba0c5), and [June 4, 2026](https://etherscan.io/tx/0x06308c94a3b806ee5f9c6d8109fad0c46fb95acf19db77e088aab78984f3d315) for 167.41 USTB from [`0xc95e7dfc…`](https://etherscan.io/address/0xc95e7dfc299f162c684db2c9d21488efc9638076). The forced-burn capability is therefore operationally live, not dormant. No further `AdminBurn` events occurred through October 18, 2026.
- **AllowList Revocation Precedent:** On [September 5, 2025](https://etherscan.io/tx/0xb669e1bf0ef2d5f1deec7aa5a91574c2a83cd22d336c3412dddd6d7f6b44eadf) Superstate revoked Morpho Blue's ([`0xbbbbbbbb…`](https://etherscan.io/address/0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb)) protocol permission for **USCC**, alongside [`0x4095f064…`](https://etherscan.io/address/0x4095f064b8d3c3548a3bebfd0bbfd04750e30077). USTB protocol permissions have not been revoked, but this confirms the revocation power is used in practice against integrated DeFi protocols.
- **AUM Growth:**
  - Feb 2024: Launch
  - Oct 2024: ~$114M ([LlamaRisk assessment](https://www.llamarisk.com/research/2024-10-07t21-32-09-000z), October 2024)
  - Apr 2025: Sky executive vote onboards USTB to the Spark Liquidity Layer (Spark Tokenization Grand Prix) with a **300M USDC deposit rate-limit ceiling**; Spark subscribes ~$300.1M over five tranches in April and fully exits in July 2025
  - Mar 2026: Invesco partnership announced — Invesco Advisers becomes external investment manager, BNY Mellon replaces UMB Bank as custodian. ~$650M+ total AUM, ~$572M onchain TVL (DeFiLlama)
  - Apr 2026: onchain USTB TVL peaks at ~$923.8M (April 28, DeFiLlama)
  - Jun 2026: $948.1M total AUM, 85.32M shares outstanding, NAV $11.112749 (Superstate NAV API, June 13)
  - Jul 2026: Token migrated from `SuperstateTokenV5_1` to the `FundToken` architecture over two consecutive upgrades
  - Aug 2026: ~$954M total AUM, ~85.3M shares. Ethereum onchain 69.31M USTB (~$775M). Aave Horizon aToken ~6.08M USTB, Midas RedemptionVault ~5.68M USTB, Frax FrxUSDCustodian ~2.94M USTB
  - Sep 2026: AUM falls to ~$737M (September 23) with ~34.7M USTB of gross redemptions during the month; AllowList cut over to V4.2 on September 22
  - Oct 2026: $819.4M total AUM, 72.86M shares, NAV $11.246553 (October 18). Ethereum onchain 53.75M USTB (~$604.5M). Midas RedemptionVault ~6.56M USTB (~$73.8M), BitGo ~2.22M USTB (~$25.0M), Frax ~1.78M USTB (~$20.1M), Aave Horizon ~0.95M USTB (~$10.7M)
- **Holder Distribution:** 81 onchain holders on Ethereum (October 18, 2026, reconstructed from `Transfer` events). Top 10 holders hold ~83.1% of supply, with the single largest holder — an EOA ([`0x0a4956a9…`](https://etherscan.io/address/0x0a4956a93fa13c34b84f5720b5499da9193fcf0d)) — at 26.04% (~$157.4M). Eight of the top ten are EOAs (institutional investors, custodial wallets); the remaining contract holders are Midas (12.20%), BitGo `WalletSimple` (4.13%) and Frax (3.32%), with Aave Horizon now at 1.77%. This concentration is expected for an institutional-grade permissioned fund.
- **Incidents:** None. No hacks, exploits, or adverse events involving Superstate or USTB.

## Funds Management

### Yield Sources

1. **U.S. Treasury Bills** — Primary holding. At least 95% of the fund invested in short-duration (< 1 year maturity) U.S. Treasury Bills and Agency securities.
2. **Cash** — Up to 5% held in cash for liquidity facilitation.

The fund uses a **laddered approach** with holdings spread across various near-term maturities for liquidity and interest rate management. The published portfolio (as of September 21, 2026) is **35 U.S. Treasury Bill positions totalling $724,478,127 — 99.59% of the fund** — with maturities laddered from October 13, 2026 to March 18, 2027, all inside one year. Current yields on the individual bills run 3.54%–4.14%. No non-Treasury security appears in the portfolio.

**Supply vs reserves reconciliation:** published holdings of $724,478,127 (September 21, 2026) against a same-day reported AUM of $727,483,365.67 leaves a residual of ~$3.0M (0.41%), consistent with the stated 99.59% holdings coverage and a small cash balance. Independently, on October 18, 2026 Ethereum `totalSupply()` of 53,751,560.27 USTB is 73.8% of the 72,861,177 shares reported outstanding; the remaining ~19.1M shares are book-entry plus the Plume and Solana tokens. `TODO`: Plume and Solana token supplies — no Plume (`RPC_98866`) or Solana RPC is configured in `.env`, so the per-chain split of that remainder is unverified.

### Accessibility

- **KYC Required:** Yes — investors must be **Qualified Purchasers** ($5M+ in investments for individuals, $25M for institutions) AND **Accredited Investors**. Full KYC/AML screening required.
- **Subscriptions (Minting):**
  - **Onchain atomic:** `subscribe()` function atomically transfers USDC and mints USTB at the Continuous NAV/S price. Available 24/7. Shares are delivered immediately for USDC orders, including non-business days.
  - **Offchain:** USD wire transfer, same-day for wires received before 5:00 PM ET.
  - Max subscription fee: 0.1% (10 bps), configurable per stablecoin. Currently set to 0.
- **Redemptions (Burning):**
  - **Onchain atomic:** Via RedemptionIdle contract, burns USTB and sends USDC at Continuous NAV/S price. USDC instant redemption facility with highly variable capacity: 141,644 USDC at block 26,221,493 (October 18, 2026). Sampling `balanceOf()` every ~12 hours from August 17 to October 18, 2026 (125 samples) gives a median of ~$5.2M (~0.9% of Ethereum USTB) and a maximum of ~$10.0M; the balance was below $1M in 18% of samples and at or near zero in 9%. Superstate announced "$10M USDC instant redemption facility, refilled twice daily" on the [Aave governance forum (Jan 2025)](https://governance.aave.com/t/arfc-ustb-buidl-gsm/19299/3), but [docs](https://docs.superstate.com/investors/smart-contracts) only state: "USDC liquidity will be replenished in this contract regularly" — the actual onchain balance varies significantly.
  - **Offchain:** Transfer tokens to contract address or call `offchainRedeem()`. Proceeds in USDC or USD wire. USDC payouts are delivered same-day, including non-business days, subject to available liquidity; USD wires are same-day if requested before 1:00 PM ET.
  - **Book-entry conversion:** `bridgeToBookEntry()` burns tokens onchain and moves the shares to Superstate's book-entry register, an additional non-USDC exit from the token wrapper.
  - Redemption fee is 0 (`redemptionFee()` verified onchain), capped at 10 bps by the contract.
- **Geographic Restrictions:** Available to qualified purchasers in the U.S. and select offshore jurisdictions (Cayman Islands, BVI, Bermuda). Not available to sanctioned countries.
- **Management Fee:** 0.15% annually for all investors. The Investment Manager rebates 0.10% monthly on average daily holdings above $25M. No performance fee or performance allocation.

### Collateralization

- **Backing Model:** Offchain — USTB tokens represent shares in a fund that holds U.S. Treasury Bills and Agency securities at **The Bank of New York Mellon** (systemically important U.S. custodian bank, replacing UMB Bank as of the Invesco partnership).
- **Collateral Quality:** U.S. Treasury Bills are considered the **lowest-risk financial instrument** globally — backed by the full faith and credit of the U.S. government.
- **Investment Manager:** **Invesco Advisers, Inc.** — a subsidiary of Invesco Ltd. (publicly traded, $1.7T+ AUM) — handles daily portfolio management, replacing Federated Hermes as of the March 2026 partnership. No sub-advisor.
- **Bankruptcy Remoteness:** The fund is a separate legal entity (series within a Delaware Statutory Trust) with inter-series liability protection, bankruptcy-remote from Superstate Inc.
- **Verification:** PricewaterhouseCoopers LLP conducts annual audits. NAV Fund Services provides independent NAV calculation. Line-item portfolio holdings are published publicly and can be reconciled against onchain supply.

### Provability

- **NAV/Price Updates:** The Superstate Continuous Price Oracle ([`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8)) extrapolates real-time prices using linear interpolation between NAV/S checkpoints. Updates every second, 24/7/365. Compatible with Chainlink AggregatorV3Interface. **Checkpoint expiration: 5 days** — if the Oracle Owner does not post a new checkpoint within 5 days, `latestRoundData()` reverts with `StaleCheckpoint()`, which causes both `subscribe()` and `redeem()` to revert, freezing all onchain USTB operations. The 5-day window covers weekends and U.S. holidays. **Note:** Since prices are linearly interpolated between checkpoints, the onchain price is an estimate that may diverge from the actual NAV between checkpoint updates — the price catches up only when the next checkpoint is posted by Superstate.
- **Chainlink NAV Feed:** Chainlink provides an independent NAV/Share data feed ([`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC)), 6 decimals. Its October 18, 2026 answer of $11.246553 matches the official daily NAV exactly, providing a cross-check on the Superstate oracle's interpolated price.
- **Onchain Supply:** Total USTB supply is verifiable onchain via `totalSupply()`.
- **Offchain Assets:** The underlying Treasury portfolio is held offchain at BNY Mellon. Token holders cannot verify the specific Treasury holdings *onchain*, but they can now verify them offchain against a public, unauthenticated feed:
  - Independent NAV calculation by NAV Fund Services
  - Annual audit by PricewaterhouseCoopers LLP
  - Public line-item holdings, daily NAV, AUM, share count, and yield via the Superstate fund API (no login required)
  - Redundant record-keeping across fund calculation agent, internal records, and onchain records
  - Chainlink Proof of Reserves was described as in development by [LlamaRisk in October 2024](https://www.llamarisk.com/research/2024-10-07t21-32-09-000z) and is still not live for USTB two years later — reserve attestation remains issuer-published rather than onchain
- **Reserve Transparency:** Superstate publishes NAV, AUM, share count, yield, **and full line-item portfolio holdings** publicly, both on [superstate.com/assets/ustb](https://superstate.com/assets/ustb) and through an open API — [daily NAV](https://api.superstate.com/v1/funds/1/nav-daily), [yield](https://api.superstate.com/v1/funds/1/yield), and [holdings](https://api.superstate.com/v2/funds/1/holdings). Each holding row carries security name, base value/cost, maturity date, current yield, and percent of fund. This closes the prior gap where granular holdings were only visible inside the authenticated investor portal. Two caveats remain: holdings are published as a **dated snapshot** (September 21, 2026 as of this assessment — roughly a 4-week lag) and are marked unaudited, and the data is self-reported by the issuer with no independent attestation between the annual PwC audits. The fund is structured under SEC exemptions with regulatory reporting requirements.

## Liquidity Risk

- **Primary Exit:** Onchain atomic redemption via RedemptionIdle contract at Continuous NAV/S price, 0 fee. USDC instant redemption capacity swings between zero and ~$10M (141,644 USDC on October 18, 2026; median ~$5.2M, ~0.9% of Ethereum USTB, over August 17 – October 18, 2026). The facility is regularly drained to zero and refilled.
- **Secondary Exit:** Offchain redemption via wire transfer or USDC. USDC payouts are delivered same-day including non-business days, subject to available liquidity; USD wires same-day if requested before 1:00 PM ET.
- **Tertiary Exit:** `bridgeToBookEntry()` converts tokenized shares into book-entry shares held directly with Superstate, removing the smart-contract wrapper without a cash redemption.
- **DEX Liquidity:** None. USTB has $0 24h trading volume on DEXs. Not listed on any exchanges. AllowlistV4_2 includes a `checkAllowlist()` hook for Uniswap v4 permissioned pools, but the Uniswap v4 PoolManager ([`0x00000000…4444c5dc75cB358380D2e3dE08A90`](https://etherscan.io/address/0x000000000004444c5dc75cB358380D2e3dE08A90)) holds no USTB. This is by design — the token is a regulated fund product, not a freely tradeable token. Superstate's own risk disclosures state Tokenized Shares "are not listed on any exchange or trading system and may only be transferred through limited peer-to-peer transactions," that the buyer pool is narrow, and that holders "may be unable to sell their Shares in a timely manner or at all."
- **Transfer Restrictions:** All transfers require both sender and receiver to be on the AllowList. Removing an address from the AllowList effectively freezes their tokens.
- **DeFi Integrations (Liquidity Venues), balances at October 18, 2026:**
  - **Aave Horizon:** USTB accepted as collateral to borrow USDC, GHO, RLUSD. The `aHorRwaUSTB` aToken ([`0x4e58a2e4…`](https://etherscan.io/address/0x4e58a2e433a739726134c83d2f07b2562e8dfdb3), pool [`0xAe05Cd22…`](https://etherscan.io/address/0xAe05Cd22df81871bc7cC2a04BeCfb516bFe332C8)) holds 953,263.80 USTB (~$10.7M), 1.77% of supply. Uses LlamaGuard NAV Oracle (risk-adjusted, built with Chainlink).
  - **Midas RedemptionVault** ([`0x569d7dcc…`](https://etherscan.io/address/0x569d7dccbf6923350521ecbc28a555a500c4f0ec)): 6,560,089.35 USTB (~$73.8M), 12.20% of supply — the largest contract holder
  - **Frax FrxUSDCustodian** ([`0x5fbaa3a3…`](https://etherscan.io/address/0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33)): 1,784,163.52 USTB (~$20.1M), 3.32% of supply
  - **BitGo:** a `WalletSimple` multisig ([`0xbd02c511…`](https://etherscan.io/address/0xbd02c51150a4ab6ce97b9de2025644594f3e75b8)) holds 2,221,214.14 USTB (~$25.0M), consistent with the documented tri-party derivative collateral role
  - **Spark Protocol / Sky:** the Spark ALM Proxy ([`0x1601843c…`](https://etherscan.io/address/0x1601843c5E9bC251A3272907010AFa41Fa18347E)) holds **0 USTB** and has done since July 2025 — see "Spark's entry and full exit" below. Spark's current Superstate exposure is to the sister fund **USCC**, not USTB, onboarded by the [October 16, 2025 Sky executive](https://github.com/sky-ecosystem/executive-votes/blob/main/2025/executive-vote-2025-10-16-allocator-4-launch.md) with a 100M USDC deposit ceiling. Grove, the other Sky allocator with a `SUPERSTATE_FACET` in its ALM module set, holds 0 USTB. The Spark ALM Proxy is not permitted for USTB on the current AllowList (`isAllowed(0x1601…, USTB) == false`).
  - **M^0 Protocol:** USTB designated as first eligible collateral for all M^0 network stablecoins (MetaMask mUSD, Noble USDN)
  - **FalconX:** USTB used as prime brokerage trading collateral
- **Stress Scenario:** In a scenario requiring large-scale redemption, liquidity depends on Superstate's ability to sell the underlying Treasury portfolio (highly liquid) and process USDC conversions via Circle. T-Bills are among the most liquid financial instruments globally, mitigating this risk. The onchain instant facility typically covers under 1% of Ethereum supply and is frequently empty, so any exit above a few million dollars — and at times any exit at all — falls back to the offchain same-day path and Superstate's operational discretion.

### AllowList Freeze Risk (Critical for DeFi Integrations)

**If an address is removed from the AllowList, the USTB tokens held by that address are completely frozen with zero exit paths:**

1. `transfer()` reverts — AllowList checks sender AND receiver
2. `transferFrom()` reverts — same AllowList check
3. Onchain redemption via RedemptionIdle reverts — requires AllowList status
4. `offchainRedeem()` reverts — requires AllowList status
5. DEX swap impossible — $0 liquidity AND DEX contracts would also need AllowList permission

**There is no fallback exit mechanism.** The only recovery path is to contact Superstate to be re-whitelisted, or have Superstate perform an `adminBurn()` and process a manual offchain redemption.

**Implications for Yearn:** Yearn's vault/strategy contract must be permitted by Superstate on the AllowList (`setAllowed(addr, USTB, true)`). If Superstate removes this permission (regulatory action, policy change, sanctions, dispute, or operational error), Yearn's entire USTB position becomes frozen and unredeemable. This is a fundamentally different risk profile from permissionless DeFi tokens where DEX liquidity provides a fallback exit.

**Onchain permission model (AllowlistV4_2, October 18, 2026):** The V4.2 AllowList drops V3.1's entity IDs and protocol-permission flags. It keeps a flat `allowed[token][address]` map, plus a `PUBLIC` scope (`address(0)`) that applies only when a token's `isPublicInstrument()` is true (USTB: `false`). Each DeFi integration is therefore permitted address-by-address for USTB: Aave Horizon aToken [`0x4e58a2e4…`](https://etherscan.io/address/0x4e58a2e433a739726134c83d2f07b2562e8dfdb3), Midas RedemptionVault [`0x569d7dcc…`](https://etherscan.io/address/0x569d7dccbf6923350521ecbc28a555a500c4f0ec), Frax FrxUSDCustodian [`0x5fbaa3a3…`](https://etherscan.io/address/0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33), BitGo [`0xbd02c511…`](https://etherscan.io/address/0xbd02c51150a4ab6ce97b9de2025644594f3e75b8) and RedemptionIdle all return `isAllowed(addr, USTB) == true`. 653 addresses are currently permitted for USTB (654 `AllowedSet` grants, 1 revocation). Permissions can be granted or revoked by the owner directly (`setAllowed` / `setAllowedBatch`) or by anyone relaying an EIP-712 signature from the owner key (`setAllowedWithSignature`, nonce + deadline protected). The relay path adds no new signer, but an owner-signed revocation could be submitted by a third party. Maple Finance's protocol contracts are NOT whitelisted — Maple's USTB collateral is held by borrowers in their own wallets as offchain collateral arrangements, not locked in Maple smart contracts.

**The freeze power is not hypothetical.** On [September 5, 2025](https://etherscan.io/tx/0xb669e1bf0ef2d5f1deec7aa5a91574c2a83cd22d336c3412dddd6d7f6b44eadf) Superstate called `setProtocolAddressPermission(0xbbbbbbbb…, "USCC", false)`, revoking Morpho Blue's protocol permission for its sister fund USCC (a second address, [`0x4095f064…`](https://etherscan.io/address/0x4095f064b8d3c3548a3bebfd0bbfd04750e30077), was revoked in the same window). USCC now runs on the same AllowlistV4_2 contract as USTB, under the same admin EOA — see the separate [Superstate USCC assessment](https://curation.yearn.fi/report/superstate-uscc/). No USTB protocol permission has been revoked to date, but a live precedent exists for a whitelisted DeFi protocol's permission being withdrawn by unilateral admin action.

## Centralization & Control Risks

### Governance

**Governance Model:** Fully centralized — Superstate Inc. controls all administrative functions. No onchain governance, no DAO, no community voting.

**Key Privileged Roles (October 18, 2026):**

| Role | Address | Type | Powers |
|------|---------|------|--------|
| USTB Token Owner + USTB ProxyAdmin Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | **EOA** | `mint`, `bulkMint`, `adminBurn`, `pause`/`unpause`, `accountingPause`/`accountingUnpause`, `setOracle`, `setStablecoinConfig`, `setRedemptionContract`, `setChainIdSupport`, `setMaximumOracleDelay`, and — new in `FundToken` v1.3.0 — `setAllowlist`, `setIsPublicInstrument`, `setName`, `setSymbol`. Can `upgrade()` / `upgradeAndCall()` USTB token implementation via ProxyAdmin. |
| AllowList Owner + AllowList ProxyAdmin Owner | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) | **EOA** | AllowlistV4_2: `setAllowed`, `setAllowedBatch`, and signs EIP-712 payloads for `setAllowedWithSignature` (relayable by anyone). Can `upgradeAndCall()` the AllowList implementation via its OZ v5 ProxyAdmin. |
| RedemptionIdle Owner + RedemptionIdle ProxyAdmin Owner | [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) | **EOA** | `pause`/`unpause`, `setRedemptionFee`, `setSweepDestination`, `setMaximumOracleDelay`, `withdraw` (extract USDC). Can `upgrade()` RedemptionIdle implementation via ProxyAdmin. |
| Oracle Owner | [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) | **EOA** | `addCheckpoint` / `addCheckpoints` (set NAV price), `setMaximumAcceptablePriceDelta`. Oracle is **not** a proxy — cannot be upgraded. |

**Critical centralization concerns:**

1. **EOA-controlled administration** — The system is controlled by **4 distinct EOAs**, each with no multisig, no timelock, and no governance delay. The USTB Token Owner ([`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83)) controls minting, burning from any address, pausing all operations, changing the oracle, and upgrading the USTB contract implementation. Separate EOAs control the AllowList, RedemptionIdle, and Oracle — splitting control across more keys reduces single-key blast radius but none have multisig protection.
2. **Admin burn capability** — The owner can call `adminBurn(address, uint256)` to forcibly burn tokens from any holder's address. This is documented as being for "exogenous legal circumstances" (regulatory compliance) and has been exercised twice (September 2025, June 2026).
3. **No timelock on any operation** — Contract upgrades, parameter changes, and critical admin functions execute immediately with no delay period for users to react. The July 2026 migration demonstrated this end to end: the entire token implementation was replaced twice in two days, each time in a single owner transaction with no announcement window, while ~$750M+ of user shares sat behind the proxy.
4. **AllowList control** — Removing an address from the AllowList effectively freezes their tokens (they cannot transfer or redeem). This is a compliance feature but also a centralization vector, and it has been used against an integrated DeFi protocol (Morpho Blue / USCC, September 2025). On top of per-address control, the USTB owner can replace the entire AllowList contract with `setAllowlist()`, and did so on September 22, 2026 in a single transaction with no timelock.
5. **Oracle pricing control** — The Oracle Owner ([`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395)) controls NAV checkpoints via `addCheckpoint()`. While the oracle uses programmatic linear interpolation between checkpoints, the checkpoint values themselves are set by this EOA. A malicious or compromised oracle owner could post incorrect NAV values affecting subscription/redemption pricing.
6. **Expanded owner surface in v1.3.0** — The `FundToken` rewrite added four owner-only setters that the prior V5.1 implementation did not expose: `setAllowlist()` (swap the entire compliance gate for another contract), `setIsPublicInstrument()` (change which allowlist permission model applies), and `setName()` / `setSymbol()` (rename the token in place — used in this cycle to rebrand from "Superstate Short Duration US Government Securities Fund" to "Invesco Short Duration US Government Securities Fund"). These are convenience/compliance controls rather than direct fund-loss paths, but each widens what a single compromised key can do without an upgrade. `setAllowlist()` was used on September 22, 2026 to switch USTB to the new AllowlistV4_2 contract. That migration was benign and all holders were pre-permitted, but it showed that the one owner key can swap the whole compliance gate instantly.

**Mitigations:**

- **Turnkey secure enclaves (TEE, not MPC)** — Private key operations are performed inside hardware-enforced Trusted Execution Environments. Per [Turnkey's own security documentation](https://docs.turnkey.com/security/non-custodial-key-mgmt), "private key material is only decrypted within these enclaves" and Turnkey "only stores encrypted private keys." This is **materially weaker than MPC/threshold signing**: a complete private key exists and is reconstituted in enclave memory on every signature, so the trust model rests on enclave integrity, Turnkey's policy engine, and the secrecy of the API credentials that authorise signing — rather than on a key that is never assembled anywhere. Onchain the distinction is invisible: all four owners produce ordinary ECDSA signatures, carry no contract code, and have no EIP-7702 delegation (`cast code` returns `0x` for each), so an outside observer cannot verify the signing arrangement at all. `TODO`: Turnkey supports N-of-M policy quorums that would function as an offchain multisig, but Superstate's policy configuration is not published — the effective signing quorum behind each EOA is unknown and unverifiable.
- **Two-step ownership transfer** — `Ownable2StepUpgradeable` requires propose + accept for ownership changes, preventing accidental transfer.
- **`renounceOwnership` disabled** — Cannot accidentally or maliciously renounce ownership.
- **Regulatory accountability** — Superstate Advisers LLC is a **fully SEC-registered investment adviser** ([CRD 336188, SEC #801-132908](https://adviserinfo.sec.gov/firm/summary/336188), status ACTIVE), and Superstate Services LLC is an SEC-registered transfer agent. Malicious admin actions would have direct legal consequences.
- **Oracle price floor** — `FundToken` v1.3.0 hardcodes an immutable `MINIMUM_ACCEPTABLE_PRICE` of $7.00 (verified onchain), below which subscriptions revert. This bounds — but does not eliminate — the damage from a corrupted or manipulated NAV checkpoint.
- **Institutional-grade service providers** — BNY Mellon (custodian), PricewaterhouseCoopers LLP (auditor), Invesco Advisers (investment manager), and NAV Fund Services (NAV agent) provide independent oversight of the underlying fund.

### Programmability

- **NAV/Price:** The Continuous Price Oracle computes real-time NAV/S onchain using linear extrapolation between NAV checkpoints set by Superstate. Chainlink provides an independent feed. NAV checkpoints are set by the admin, but the extrapolation is programmatic and the token enforces an immutable $7.00 price floor on subscriptions.
- **Subscriptions:** Atomic onchain subscription at oracle price is programmatic (anyone allowlisted can call `subscribe()`).
- **Redemptions:** Atomic onchain redemption is programmatic (via RedemptionIdle contract).
- **Transfers:** Programmatic AllowList enforcement on every transfer (onchain check).
- **Minting/Burning:** Admin-only. Minting reflects offchain subscriptions. Admin burning is for regulatory compliance.
- **Accounting:** Dual pause mechanism (transfers vs. mint/burn) is admin-controlled.

### External Dependencies

1. **U.S. Treasury Market (Critical)** — Fund holds U.S. Treasury Bills and Agency securities. An unprecedented U.S. government default would directly impact the fund. Extremely low probability.
2. **BNY Mellon (Critical)** — Qualified custodian for the underlying assets. The Bank of New York Mellon is one of the world's largest custodian banks with ~$50T+ assets under custody.
3. **Invesco (Critical)** — Investment manager handling daily portfolio management via Invesco Advisers, Inc., a subsidiary of Invesco Ltd. (publicly traded, NYSE: IVZ, $1.7T+ AUM). Replaced Federated Hermes as of March 2026.
4. **Circle (High)** — USDC subscriptions and redemptions route through Circle. A USDC depeg would not affect USTB NAV (backed by Treasuries) but would affect the USDC redemption path.
5. **Chainlink (Medium)** — NAV/Share oracle feed. Superstate also runs their own Continuous Price Oracle as primary source.
6. **Turnkey (Medium)** — Non-custodial key management via secure enclaves. Failure could delay admin operations.
7. **PricewaterhouseCoopers LLP (Low)** — Annual audit of the fund. Provides independent verification.
8. **NAV Fund Services (Low)** — Independent NAV calculation agent.

**Cross-chain distribution — no third-party bridge.** USTB is issued on Ethereum, Solana and Plume, but Superstate does **not** use LayerZero, CCIP, Wormhole, Axelar or any other third-party messaging protocol. The token's `bridge(amount, dest, chainId)` function burns on the source chain and emits a `Bridge` event; Superstate then mints the corresponding shares on the destination chain as an operational step, with supported destinations gated by the owner via `setChainIdSupport`. There is therefore no external bridge contract to audit or exploit, and no wrapped/escrowed representation — but the cross-chain leg is **admin-mediated and trust-based**: a user who burns on Ethereum relies entirely on Superstate to mint on the destination, with no onchain proof, no timeout, and no self-service recovery. Exposure is bounded by the ~26.2% of shares not on Ethereum, which also includes book-entry holdings (`TODO`: current Plume and Solana token supplies — no Plume or Solana RPC is configured in `.env`). Yearn exposure would be Ethereum-only, so this is context rather than a scored risk. Because no third-party bridge is involved, USTB has no dependency entry in `src/data/bridges.json` and appears only on the CCIP, LayerZero and Axelar `ignore` lists; `scripts/check_bridges.mjs` reports 0 warnings.

## Operational Risk

- **Team:** Robert Leshner (Co-Founder & CEO, previously co-founded Compound Finance, CFA, UPenn Economics), Reid Cuming (Co-Founder & COO, ex-Square, Stripe, Chime), Jim Hiltner (Co-Founder & Head of BD, ex-Compound Sales), Dean Swennumson (Co-Founder & Head of Ops, ex-Compound Operations). Team also includes alumni from Goldman Sachs, Coinbase, SEC, Frax Finance. ~23 employees.
- **Funding:** ~$100.5M raised across 3 rounds:
  - Seed: $4M (June 2023) — led by ParaFi, Cumberland, and 1kx. Source: stated in Superstate's [Series A announcement](https://superstate.com/newsroom/superstate-announces-series-a-financing); also reported by [The Block](https://www.theblock.co/post/263049/coinfund-co-leads-14-million-series-a-round-for-asset-manager-superstate).
  - Series A: $14M first close (announced November 15, 2023) — co-led by Distributed Global and CoinFund, with Breyer Capital, Galaxy, Arrington Capital, Road Capital, CMT Digital, Folius Ventures, Nascent, Hack VC, Modular Capital, and Department of XYZ participating. Sources: [Superstate newsroom](https://superstate.com/newsroom/superstate-announces-series-a-financing), [The Block](https://www.theblock.co/post/263049/coinfund-co-leads-14-million-series-a-round-for-asset-manager-superstate)
  - Series B: $82.5M (announced January 22, 2026) — led by Bain Capital Crypto with Distributed Global; Haun Ventures, Brevan Howard Digital, Galaxy Digital, Sentinel Global participating. Sources: [Superstate newsroom](https://superstate.com/newsroom/superstate-raises-82.5m-series-b-financing), [CoinDesk](https://www.coindesk.com/business/2026/01/22/tokenization-firm-superstate-raises-usd82-5-million-to-bring-wall-street-onchain), [Orrick (deal counsel)](https://www.orrick.com/en/News/2026/02/Superstate-Raises-82-5-Million-Series-B-to-Advance-Tokenized-Investment-Products)
  - The $100.5M total is the sum of the three rounds; press coverage of the Series B independently describes total funding as "over $100 million."
- **Documentation:** Comprehensive docs at [docs.superstate.com](https://docs.superstate.com/) covering fund mechanics, legal structure, smart contracts, security. Actively maintained.
- **Legal Structure:**
  - **Superstate Inc.** (Delaware corporation) — parent company; its own adviser registration (SEC #802-129496) is now INACTIVE, having been superseded by Superstate Advisers LLC
  - **Superstate Asset Trust** (Delaware Statutory Trust, organized June 15, 2023) — bankruptcy-remote fund entity
  - **Superstate Advisers LLC** — SEC-registered investment adviser under the Investment Advisers Act of 1940 ([CRD 336188, SEC #801-132908](https://adviserinfo.sec.gov/firm/summary/336188), ACTIVE), a step up from the prior exempt-reporting-adviser posture
  - **Superstate Services LLC** — SEC-registered transfer agent (March 2025)
  - Fund operates under Section 3(c)(7) of the Investment Company Act; offered pursuant to Rule 506(c) of Regulation D
  - Restricted to Qualified Purchasers and Accredited Investors
- **Incident Response:** Turnkey secure enclaves for key management. Admin can pause transfers and/or accounting independently. Can force-burn and re-mint to new addresses for compromised investor wallets. No publicly documented formal incident response playbook.
- **License:** BUSL 1.1 (Business Source License)
- **Industry Participation:** Superstate Industry Council (50+ institutional members). Active engagement with SEC Crypto Task Force (formal submission June 2025).

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Purpose | Key Events/Functions |
|----------|---------|---------|---------------------|
| USTB Token | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) | Token state | `Mint`, `AdminBurn`, `OffchainRedeem`, `Bridge`, `SubscribeV2`, `Paused`/`Unpaused`, `AccountingPaused`/`AccountingUnpaused`, `SetOracle`, `SetRedemptionContract`, `SetStablecoinConfig`, `SetMaximumOracleDelay`, `OwnershipTransferStarted`, `totalSupply()`. **New in v1.3.0:** `AllowlistUpdated`, `IsPublicInstrumentUpdated`, `NameSet`, `SymbolSet` |
| Continuous Price Oracle | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) | NAV pricing (not a proxy) | `NewCheckpoint`, `SetMaximumAcceptablePriceDelta`, `OwnershipTransferStarted`, `latestRoundData()`. Public getter on USTB token: `superstateOracle()` returns current oracle address. |
| AllowList V4.2 | [`0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f`](https://etherscan.io/address/0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f) | Permission changes | `AllowedSet(addr, token, allowed)` (filter `token == USTB` or `PUBLIC`), `OwnershipTransferStarted`, `Upgraded` |
| RedemptionIdle | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) | Redemption liquidity | `RedeemV2`, `Withdraw`, `SetRedemptionFee`, `SetSweepDestination`, `Paused`/`Unpaused`, `OwnershipTransferStarted`, USDC `balanceOf()` |
| USTB ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) | USTB proxy upgrades | `Upgraded` event on USTB proxy, `OwnershipTransferred` |
| AllowList ProxyAdmin | [`0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46`](https://etherscan.io/address/0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46) | AllowList proxy upgrades | `Upgraded` event on AllowList proxy, `OwnershipTransferred` |
| RedemptionIdle ProxyAdmin | [`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869) | RedemptionIdle proxy upgrades | `Upgraded` event on RedemptionIdle proxy, `OwnershipTransferred` |

### Admin EOAs to Monitor

| EOA | Role | Key Actions |
|-----|------|-------------|
| [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | USTB Token + ProxyAdmin Owner | Mint, adminBurn, pause, upgrade USTB impl, set oracle/redemption/stablecoin config |
| [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) | AllowList + ProxyAdmin Owner | Add/remove addresses, set permissions, upgrade AllowList impl |
| [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) | RedemptionIdle + ProxyAdmin Owner | Pause redemptions, withdraw USDC, set fees, upgrade RedemptionIdle impl |
| [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) | Oracle Owner | Set NAV checkpoints (pricing), set price delta |

### Critical Monitoring Points

- **NAV/Share:** Track Continuous Price Oracle (`latestRoundData()`) and Chainlink feed — should increase monotonically. Alert on any decrease (would indicate fund losses). Current: $11.249846 (Superstate oracle), $11.246553 (Chainlink). **Staleness check:** read `checkpoints(latestRoundData().roundId)` and take `effectiveAt` (second field of the `(uint64 timestamp, uint64 effectiveAt, uint128 navs)` tuple), compute `block.timestamp - effectiveAt`; alert if > 4 days (345600s) — oracle reverts `StaleCheckpoint()` at `CHECKPOINT_EXPIRATION_PERIOD` = 5 days (432000s), freezing subscribe/redeem. Latest checkpoint at assessment time (round 463, `effectiveAt` October 16, 2026 13:14 UTC) was ~2.25 days old over a weekend, inside both the alert threshold and the expiry window.
- **Implementation Drift:** Read EIP-1967 implementation slot on the USTB proxy and alert on any change from [`0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c`](https://etherscan.io/address/0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c) (FundToken v1.3.0). Also alert if `VERSION()` changes from `"1.3.0"`.
- **Admin Burns:** Monitor `AdminBurn` events — forced burns from holder addresses are a critical event. Two have occurred to date.
- **Pause Events:** Monitor `Paused`/`Unpaused` and `AccountingPaused`/`AccountingUnpaused` on USTB Token AND RedemptionIdle.
- **Contract Upgrades:** Monitor **all 3 ProxyAdmins** for `Upgraded` events — USTB ProxyAdmin ([`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146)), AllowList ProxyAdmin ([`0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46`](https://etherscan.io/address/0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46)), and RedemptionIdle ProxyAdmin ([`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869)). Any proxy upgrade executes immediately with no timelock.
- **Token Configuration (v1.3.0 setters):**
  - **`AllowlistUpdated` — CRITICAL, page immediately.** `setAllowlist()` swaps the entire compliance gate in one owner transaction with no timelock. A malicious or erroneous allowlist address can freeze every holder at once (if it denies all) or void KYC gating entirely (if it permits all). **Alert condition:** any `AllowlistUpdated` event, OR `allowlist()` returning anything other than [`0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f`](https://etherscan.io/address/0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f). Poll `allowlist()` hourly as a belt-and-braces check against a missed event; on trigger, treat the USTB position as frozen-risk until the new allowlist is reviewed and confirm `isAllowed(<our address>, USTB)` still returns true. (On V4.2, `isAddressAllowedForFund` reverts unless the caller is the token itself, so use `isAllowed` from an offchain monitor.)
  - **`IsPublicInstrumentUpdated` — high.** Changes which allowlist permission model applies to every transfer. Alert on any event or on `isPublicInstrument()` returning anything other than `false`.
  - **`NameSet` / `SymbolSet` — informational.** Cosmetic, but a symbol change breaks the `Allowlistable` private-instrument lookup keyed on ticker, so alert and re-verify allowlist resolution.
  - Current state: `allowlist() == 0xBcBC2b4F…`, `isPublicInstrument() == false`, `maximumOracleDelay() == 3600s`.
- **Oracle Changes:** Monitor `SetOracle` events on USTB Token (2 to date) and `NewCheckpoint` events on the Oracle. Monitor `SetMaximumAcceptablePriceDelta` on Oracle (current: $1.00).
- **AllowList Changes:** Monitor `AllowedSet` events on AllowlistV4_2 where `token` is USTB ([`0x43415eB6…`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)) or `PUBLIC` (`address(0)`). Alert immediately on any `allowed == false` touching our address or a DeFi integration (Aave Horizon, Midas, Frax). There have been 1,925 `AllowedSet` events since July 17, 2026, 3 of them revocations (all for one address on August 4, 2026, before the cutover).
- **Redemption Capacity:** Monitor USDC `balanceOf()` on RedemptionIdle — 141,644 USDC on October 18, 2026, median ~$5.2M and max ~$10.0M since mid-August. Because the facility routinely empties between refills, alert on a sustained zero balance (e.g. > 24h) rather than any single low reading. Also monitor `Withdraw` events (owner can extract USDC) and `SetRedemptionFee` (currently 0).
- **Ownership Transfers:** Monitor `OwnershipTransferStarted` on all 4 contracts (USTB, AllowList V4.2, RedemptionIdle, Oracle) and `OwnershipTransferred` on all 3 ProxyAdmins. All `pendingOwner()` values are currently zero.
- **Large Supply Changes:** Alert on mints/burns >5% of total supply in 24h. Current supply: 53,751,560.27 USTB.
- **Offchain Reserve Reconciliation:** Cross-check the public [holdings API](https://api.superstate.com/v2/funds/1/holdings) and [NAV API](https://api.superstate.com/v1/funds/1/nav-daily) against onchain `totalSupply()` × NAV. Alert if the holdings snapshot goes stale beyond ~45 days or if disclosed holdings fall materially below reported AUM.
- **Recommended Frequency:** Hourly for NAV/pause/admin events. Daily for AllowList, redemption capacity, and implementation slot. Weekly for the reserve reconciliation.

## Risk Summary

### Key Strengths

1. **Safest underlying asset class** — 99.59% of the fund is in disclosed U.S. Treasury Bills, the lowest-risk financial instrument globally, backed by the full faith and credit of the U.S. government
2. **Great audit coverage** — 16 audits from 5 firms (0xMacro ×11, Zellic ×2, ChainSecurity, Offside Labs, Certora), with an ongoing audit relationship as code evolves; the `FundToken` *architecture* was reviewed by Zellic twice in 2026, though not the exact deployed version (see Key Risks #7)
3. **Public, reconcilable reserve disclosure** — line-item T-Bill holdings, daily NAV, AUM, share count, and yield are published through an open API and reconcile to within 0.41% of reported AUM and to Ethereum onchain supply
4. **Institutional-grade service providers** — BNY Mellon (custodian, ~$50T+ AUC), Invesco Advisers (investment manager, $1.7T+ AUM), PricewaterhouseCoopers LLP (auditor), NAV Fund Services (independent NAV)
5. **Strong team and backing** — Compound Finance founders, $100.5M raised from Bain Capital Crypto, Distributed Global, Brevan Howard, Galaxy Digital, Haun Ventures
6. **Bankruptcy-remote legal structure with upgraded regulatory standing** — Delaware Statutory Trust with inter-series liability protection; Superstate Advisers LLC is now a fully SEC-registered investment adviser rather than an exempt reporting adviser
7. **Large AUM** — $819.4M total across all networks (~$604.5M on Ethereum), with institutional adoption across Midas (~$73.8M), BitGo (~$25.0M), Frax (~$20.1M), Aave Horizon (~$10.7M), and M^0. Note Spark, previously the single largest holder at ~$300M, fully exited in July 2025 and its current Superstate exposure is to USCC rather than USTB

### Key Risks

1. **EOA-controlled admin** — 4 distinct EOAs control token minting, forced burning, pausing, oracle changes, and proxy upgrades. No multisig, no timelock on any. The separation across 4 keys reduces single-key blast radius but none have multisig protection.
2. **Offchain assets** — Underlying Treasury portfolio held offchain at BNY Mellon. Holdings are disclosed publicly but as a dated, unaudited, issuer-published snapshot; nothing is attested onchain and Chainlink Proof of Reserves is still not live.
3. **No DEX liquidity, single exit channel** — Exit is exclusively through Superstate's mint/redeem system. No secondary market. Transfers restricted to allowlisted addresses only, and the *instant* onchain facility holds a median ~$5.2M (under 1% of Ethereum supply) and is regularly empty — larger exits depend on Superstate processing them same-day offchain rather than on any contract guarantee.
4. **Modest, self-hosted bug bounty** — critical findings carry a $50K minimum reward, but there is no published maximum, no Immunefi-style platform, and payouts are at Superstate's discretion.
5. **Permissioned access** — Only Qualified Purchasers ($5M+) who pass KYC can hold or transfer USTB. Limits DeFi composability.
6. **Holder concentration** — top 10 addresses hold ~83.1% of supply, the largest single EOA 26.04%.
7. **The deployed implementation has no audit coverage** — Zellic scoped `FundToken` (Feb 2026) and `FundTokenV1_2_0` (Jun 2026); the live contract is `FundTokenV1_3_0`, shipped a day after v1.2.0. No published report covers it, the audited repo is private, and the public `superstateinc/ustb` repo has not been updated since April 2025 — so the v1.2.0→v1.3.0 delta cannot be diffed or independently reviewed by anyone outside Superstate. The inherited architecture was reviewed and the one Medium finding is fixed in the deployed bytecode, but the exact code holding ~$605M is unattested.

### Critical Risks

- **AllowList freeze risk** — If Superstate removes an address from the AllowList, the holder's tokens are **completely frozen with zero exit paths**. No transfers, no redemption, no DEX fallback. For DeFi protocols integrating USTB, this means Superstate has unilateral power to freeze an entire protocol's USTB position — a power it has already exercised once against Morpho Blue for its sister fund USCC (September 2025).
- **Private key compromise** — 4 separate EOAs control different parts of the system. Compromise of [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) alone could upgrade the USTB token to malicious code, mint unlimited tokens, burn tokens from any address, or swap the AllowList contract, all with no delay. Other EOAs control AllowList (freeze addresses), RedemptionIdle (withdraw USDC, pause redemptions), and Oracle (manipulate pricing, bounded below by the $7.00 subscription floor). Mitigated by Turnkey secure enclaves but each remains a single point of failure.
- **Admin burn capability** — The `adminBurn()` function can confiscate tokens from any holder. While documented as a regulatory compliance tool, this gives Superstate unilateral power over user funds, and it has been used twice.
- **No upgrade delay** — All 3 proxy contracts (USTB Token, AllowList, RedemptionIdle) can be upgraded immediately with no timelock for users or protocols (like Aave, Morpho, Spark) to react. July 2026 showed this in practice: two full implementation replacements in two days, no notice period.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **Unverified contract source** → **PASS** — The live implementation `FundTokenV1_3_0` ([`0xb3ac55dd…`](https://etherscan.io/address/0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c)) is source-verified on Etherscan (Solidity 0.8.28), as are the AllowList and RedemptionIdle implementations.
- [x] **No audit** → **PASS** — 16 audits by 5 firms. Great coverage of the codebase and architecture. Note the gate is assessed on the protocol's audit posture, not on version-exact scoping; the deployed v1.3.0 lacking its own report is scored down in Category 1 rather than treated as "no audit."
- [x] **Unverifiable reserves** → **PASS** — Offchain reserves, but line-item holdings are now publicly published and reconcile to reported AUM within 0.05% and to onchain supply; further verified by an independent NAV agent (NAV Fund Services), annual PwC audit, SEC regulatory framework, and a bankruptcy-remote trust structure. Chainlink NAV feed provides onchain pricing matching official NAV exactly.
- [x] **Total centralization** → **BORDERLINE PASS** — 4 distinct EOAs control admin functions (token, allowlist, redemption, oracle) with no multisig or timelock on any. However, Superstate is a U.S. corporation under SEC regulation, with registered transfer agent status, institutional custodian, and institutional-grade key management via Turnkey secure enclaves. The separation across 4 keys and the regulatory accountability partially compensate for the lack of onchain governance.

**Result:** Protocol passes critical gates. Proceeding to category scoring with conservative bias on centralization.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.25**

| Aspect | Assessment |
|--------|-----------|
| Audits | 16 audits by 5 firms (0xMacro ×11, Zellic ×2, ChainSecurity, Offside Labs, Certora). Continuous audit relationship — Zellic reviewed the `FundToken` architecture in Feb 2026 and `FundTokenV1_2_0` in Jun 2026. The deployed `FundTokenV1_3_0` is **not** covered by any published report. |
| Bug Bounty | Self-hosted ([security@superstate.co](https://docs.superstate.com/investors/security)); minimum $50K reward for critical vulnerabilities, no published maximum. |
| Time in Production | ~32 months with TVL >$1M (since Feb 2024 — DeFiLlama first data point Mar 8, 2024 already at ~$38M). Contracts deployed Dec 2023. 10 implementation upgrades. |
| TVL | $819.4M total AUM across all networks; ~$604.5M on Ethereum (53.75M USTB × $11.246553 NAV). DeFiLlama no longer tracks USTB TVL. |
| Historical Incidents | None. No security incidents, exploits, or adverse events. |

**Subcategory A: Audits — 1.5** Sixteen audits across five firms is among the strongest coverage in the RWA space, and the two Zellic engagements de-risked the July 2026 architecture migration — the Medium-severity migration bug Zellic found is fixed in the deployed bytecode. Two factors hold this at 1.5 rather than 1.0: the bug bounty is a self-hosted program with a $50K critical-severity floor and no published maximum (rubric row 3, "bounty program present" — short of row 2's >$200K max payout), and **the deployed `FundTokenV1_3_0` has no audit report of its own**, with no public repository against which the v1.2.0→v1.3.0 delta could be diffed. The rubric's audit-coverage column is comfortably a 1; the bounty column and the version gap pull the subcategory up to 1.5.

**Subcategory B: Historical — 1.0** Over two and a half years in production with zero incidents and sustained TVL well above $100M. Clean operational history across ten implementation upgrades, including a full architecture migration executed without disruption. Already at the rubric floor.

**Score: (1.5 + 1.0) / 2 = 1.25/5.** Broad audit coverage and a long clean track record are offset by the audit-to-deployment version gap on the token. The live AllowlistV4_2 is within Zellic's June 2026 scope.

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.0**

**Subcategory A: Governance — 4.0** *(documented deviation from the rubric — see note below)*

> **Rubric deviation, stated explicitly.** USTB matches all three columns of the rubric's **score-5** Governance row: EOA control (not <3 signers — *zero* signers, four plain EOAs), no timelock, and effectively unlimited admin powers (mint, forced burn, freeze, upgrade). A strict rubric read scores this **5.0**, which is also the first critical gate. This report scores it **4.0**, consistent with the prior assessment, on three mitigations: (a) control is split across four independent keys, so no single compromise takes the whole system; (b) keys are held in Turnkey hardware TEEs rather than hot wallets; (c) Superstate operates as an SEC-registered investment adviser and registered transfer agent, so admin abuse carries direct securities-law consequences rather than being purely self-policed. The gate is recorded as **BORDERLINE PASS** rather than a clean pass for the same reason. Reviewers who weight onchain controls over legal accountability should read this subcategory as 5.0, which would move Centralization to (5.0+2.0+2.0)/3 = 3.0 — the same 3.0 this report already assigns after rounding, so **the final score is unchanged either way**.

- **4 distinct EOAs** control the system with no multisig on any:
  - [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) — USTB Token owner + USTB ProxyAdmin owner (mint, adminBurn, pause, oracle, stablecoin config, proxy upgrades)
  - [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) — AllowList owner + AllowList ProxyAdmin owner (permissions, proxy upgrades)
  - [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) — RedemptionIdle owner + RedemptionIdle ProxyAdmin owner (pause redemptions, withdraw USDC, set fees, proxy upgrades)
  - [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) — Oracle owner (NAV checkpoints, price delta)
- **No timelock** on any operation — upgrades, parameter changes, and critical functions execute immediately. Demonstrated in July 2026 (two consecutive full implementation replacements in two days, each a single owner transaction with no notice window) and again on September 22, 2026, when `setAllowlist()` swapped the entire compliance gate in one transaction.
- No onchain governance, no DAO, no community voting
- **Widened owner surface:** `FundToken` v1.3.0 adds `setAllowlist()`, `setIsPublicInstrument()`, `setName()`, and `setSymbol()` to the owner's existing mint/burn/pause/oracle powers
- **Positive:** Separation across 4 keys reduces single-key blast radius compared to a single EOA controlling everything
- **Positive:** Turnkey secure enclaves for key management, two-step ownership transfer (`Ownable2StepUpgradeable`, all `pendingOwner()` zero), `renounceOwnership` disabled
- **Positive:** Regulatory accountability — Superstate Advisers LLC is a fully SEC-registered investment adviser (801-132908) and Superstate Services LLC an SEC-registered transfer agent, subject to securities law enforcement
- Despite regulatory mitigations and key separation, the onchain governance remains EOA-controlled with no multisig or timelock on any contract, and the admin surface grew rather than shrank this cycle

**Subcategory B: Programmability — 2.0**

- NAV pricing: Continuous Price Oracle uses programmatic linear extrapolation between admin-set checkpoints, with an immutable $7.00 floor enforced in the token. Chainlink provides an independent feed that currently matches official NAV exactly
- Subscriptions: Atomic onchain subscription at oracle price is programmatic (allowlisted users call `subscribe()`), fee 0
- Redemptions: Atomic onchain redemption via RedemptionIdle is programmatic, fee 0, capped at 10 bps in code
- Transfer enforcement: AllowList checks on every transfer are onchain and programmatic
- Minting/burning: Admin-controlled, reflects offchain operations
- Overall: Core token operations (subscribe, redeem, transfer) are well-automated onchain. NAV pricing has a good programmatic model. Admin functions (mint, burn, pause) are necessarily manual for a regulated fund.

**Subcategory C: External Dependencies — 2.0**

- U.S. Treasury Bills: Safest possible underlying asset
- BNY Mellon: Systemically important custodian bank, ~$50T+ assets under custody
- Invesco: $1.7T+ AUM publicly traded institutional asset manager (NYSE: IVZ)
- Circle: USDC infrastructure, blue-chip stablecoin provider
- Chainlink: Established oracle network
- All external dependencies are institutional-grade with long track records

**Score: (4.0 + 2.0 + 2.0) / 3 = 2.67 → 3.0/5**, rounded up to 3.0 due to the severity of the EOA-with-no-timelock governance issue, which remains the dominant risk factor. The owners are the same four EOAs (all code size 0), there is no multisig or timelock, the owner's callable surface includes the four `FundToken` v1.3.0 setters, and both the no-notice upgrade path (July 2026) and the no-notice allowlist swap (September 2026) have now been exercised. External dependencies and programmability remain strong, but governance centralization continues to drag the category.

#### Category 3: Funds Management (Weight: 30%) — **2.0**

**Subcategory A: Collateralization — 1.5**

- U.S. Treasury Bills are the **safest underlying asset class** — backed by the full faith and credit of the U.S. government
- Fund structured as a bankruptcy-remote Delaware Statutory Trust with inter-series liability protection
- BNY Mellon as qualified custodian (~$50T+ AUC)
- Invesco Advisers, Inc. as investment manager ($1.7T+ parent AUM), no sub-advisor
- The published portfolio is 99.59% short-duration T-Bills across 35 positions maturing within one year; the ~0.41% residual is cash
- Virtually zero credit risk on the underlying assets
- Unchanged from the prior scoring: collateral quality is best-in-class, but custody is offchain, so the rubric's "real-time onchain verification" condition for a 1 is not met

**Subcategory B: Provability — 2.5**

- **Line-item portfolio holdings are now published publicly** — security name, base value/cost, maturity, current yield, and percent of fund for all 35 positions, via [superstate.com/assets/ustb](https://superstate.com/assets/ustb) and an open, unauthenticated API at [`/v2/funds/1/holdings`](https://api.superstate.com/v2/funds/1/holdings). This removes the prior gating behind the Qualified-Purchaser investor portal, which was the stated reason for the previous 3.0.
- **Reserves reconcile:** disclosed holdings of $724,478,127 against same-day AUM of $727,483,366 (September 21, 2026) — a 0.41% residual matching the stated cash balance. Ethereum token supply (53.75M USTB) sits within the 72.86M shares reported outstanding; the remainder is book-entry plus Plume and Solana tokens (per-chain split `TODO`).
- Daily NAV, AUM, share count, and yield published through the same open API
- NAV calculated independently by NAV Fund Services (third party)
- Annual audit by PricewaterhouseCoopers LLP (Big Four)
- Chainlink NAV/Share feed provides independent onchain pricing, currently matching official NAV to the cent
- Superstate Continuous Price Oracle provides real-time extrapolation
- SEC regulatory reporting requirements; Superstate Advisers LLC now a fully registered investment adviser
- Redundant record-keeping: fund agent records + internal records + onchain records
- **Remaining gaps:** holdings are an issuer-published, unaudited snapshot with a ~4-week lag rather than a continuous or independently attested feed, the assets themselves sit offchain and cannot be proven onchain, and Chainlink Proof of Reserves — described as in development by [LlamaRisk in October 2024](https://www.llamarisk.com/research/2024-10-07t21-32-09-000z) — is still not live for USTB
- **Why 2.5 and not 2.0.** The rubric's row 2 requires "mostly onchain" reserves, "onchain with periodic updates" reporting, and a "single reliable source" of third-party verification. USTB clears the third condition (NAV Fund Services + PwC + Chainlink) but fails the first two on their literal terms: the reserves are entirely *offchain*, and the reporting mechanism is an *offchain* issuer-run API, not an onchain feed. Four specific gaps keep it above a clean 2.0 — (i) the holdings snapshot is issuer-published with no independent attestation between annual audits, so it is self-reported data; (ii) it carries a ~4-week lag (September 21 data read on October 18) rather than being periodic-and-current; (iii) nothing about the reserves is provable onchain — a reader must trust the API; (iv) Chainlink Proof of Reserves remains unshipped after ~24 months. Equally, it is clearly better than row 3's "manual reporting by admins," because the data is machine-readable, complete to line-item level, and arithmetically reconcilable against both AUM and onchain supply. 2.5 is the honest midpoint.

**Score: (1.5 + 2.5) / 2 = 2.0/5.** The safest possible underlying asset with institutional-grade custody, and strong reserve transparency: the full T-Bill portfolio is public, machine-readable, and reconcilable against both reported AUM and onchain supply. What still holds the category back is that verification remains an offchain, issuer-published exercise — there is no onchain proof of reserves, and the holdings snapshot is dated and unaudited.

#### Category 4: Liquidity Risk (Weight: 15%) — **2.0**

- Onchain atomic redemption at NAV/S price via RedemptionIdle, 0 fee. Instant capacity is volatile: 141,644 USDC on October 18, 2026, median ~$5.2M (~0.9% of Ethereum USTB) and max ~$10.0M over August 17 – October 18, 2026, with the balance at or near zero in ~9% of half-day samples
- Offchain redemption improved: USDC payouts delivered same-day **including non-business days**, subject to available liquidity; USD wires same-day if requested before 1:00 PM ET
- Third exit: `bridgeToBookEntry()` converts tokens to book-entry shares held directly with Superstate
- No DEX liquidity whatsoever — $0 24h volume, not listed on any exchange. Superstate's own disclosures warn holders "may be unable to sell their Shares in a timely manner or at all"
- Transfers restricted to allowlisted addresses only — limits secondary market formation
- **AllowList freeze risk:** If removed from AllowList, tokens are completely frozen with zero exit paths — no transfer, no redemption, no DEX fallback. Superstate has unilateral power to freeze any holder's position, and revoked Morpho Blue's protocol permission for USCC in September 2025, establishing that this is an operational lever rather than a theoretical one.
- Same-value asset (USD-denominated Treasury fund) — no price slippage risk on redemption
- Underlying Treasuries are among the most liquid financial instruments globally, laddered with the nearest maturities days away
- DeFi integrations provide institutional exit paths (Midas ~$73.8M, Frax ~$20.1M, Aave Horizon ~$10.7M), though each of those venues depends on the same AllowList permission
- Holder concentration is high: top 10 hold ~83.1%, so a single large redeemer can exhaust the instant facility many times over

**Demonstrated redemption throughput (onchain, Feb 2025 – Oct 18, 2026).** The exit path is not theoretical — it is one of the most heavily exercised parts of the system. Aggregating all `OffchainRedeem` events on the token and `RedeemV2` events on RedemptionIdle:

| Metric | Value |
|---|---|
| Offchain redemptions | 11,069 events, ~534.4M USTB |
| Onchain atomic redemptions | 10,058 events, ~112.3M USTB |
| Combined | 21,127 events, ~646.7M USTB |
| Largest single redemption | **28,190,683 USTB (~$303.1M)**, [July 17, 2025](https://etherscan.io/tx/0x49eefbb55bcae635426ff7994dbcbe4c853cb0f230f6856a27be64b0e1ead466) — Spark's full exit from the Spark Liquidity Layer position |
| Other $150M+ single exits | [18,116,960 USTB](https://etherscan.io/tx/0xd70423b90fe9c92b3adb95167dabf63d8c214ebaf07d7098b093f81c92938f52) and [17,623,587 USTB](https://etherscan.io/tx/0xbfcee3207a23debd202e0785d0168b57851123064f85c74f2a9916755a73d501), both April 2026 |
| Recent monthly redemption volume (offchain + onchain) | 39.0M USTB (Aug 2026), 34.7M USTB (Sep 2026) — multiples of total AUM per year |

A single holder has exited ~$302M in one transaction, and ~$200M exits have happened twice more since. Redemptions ran continuously through the Invesco manager transition, the July 2026 contract migration, and the September 2026 AllowList cutover without interruption.

**Spark's entry and full exit — the largest redemption in USTB's history.** The single biggest data point above is attributable to a named counterparty with a complete governance paper trail, which makes it unusually good evidence:

| Date | Event |
|---|---|
| Mar 24, 2025 | Sky [Governance Poll 1213](https://vote.makerdao.com/polling/QmTE29em) proposes onboarding USTB to the Spark Liquidity Layer under the Spark Tokenization Grand Prix |
| [Apr 3, 2025](https://github.com/sky-ecosystem/community/blob/master/governance/votes/Executive%20vote%20-%20April%203,%202025.md) | Executive vote passes: deposit rate limit **300M USDC** (slope 100M/day), **withdrawals unlimited**. Deposit path is `subscribe()` on the token; redeem path is RedemptionIdle |
| Apr 7 – Apr 22, 2025 | Spark ALM Proxy subscribes in five tranches, reaching **28,190,693.11 USTB (~$300.1M** at the then-NAV of $10.645395) — effectively maxing the approved ceiling |
| Jul 17, 2025 | **Full exit in a single transaction**: 28,190,683.11 USTB (~$303.1M at $10.752206) burned via [`0x49eefbb5…`](https://etherscan.io/tx/0x49eefbb55bcae635426ff7994dbcbe4c853cb0f230f6856a27be64b0e1ead466) |
| Since | Spark ALM Proxy holds 0 USTB |

Two things follow. First, the **~$300M ceiling that prior versions of this report described as "$300M allocated by Spark" was a rate limit, not a standing allocation** — Spark deployed roughly that amount, held it for about three months, and left. Second, a sophisticated institutional allocator moved ~$300M in and ~$303M out at NAV with no fee, no slippage, and no queue, exercising the exit exactly as designed. That is the strongest available evidence that the redemption channel functions at size.

It cuts both ways: the largest single redemption in USTB's history is also a major DeFi allocator *withdrawing entirely*, and Spark's subsequent Superstate allocation went to USCC rather than back into USTB. Read as a liquidity proof it is strong; read as a demand signal it is not.

**Score: 2.0/5.** On the rubric's three columns this asset scores at or near row 1: the exit is a **direct 1:1 redemption at NAV with zero fee and zero slippage** (it is a fund redemption, not a market trade, so there is no price impact at any size), same-day including non-business days for USDC, and the onchain atomic path is instant 24/7 up to facility capacity. The "liquidity depth >$10M" and "full exit with <0.5% impact" conditions are met empirically, not just on paper — $302M has cleared in a single transaction. Two factors hold it at 2.0 rather than 1.0 or 1.5: the *instant* onchain facility has a median of only ~$5.2M (under 1% of Ethereum supply) and is regularly drained to zero, so anything larger depends on Superstate's same-day offchain processing rather than a contract guarantee; and there is no secondary market at all, so the redemption channel is the *only* channel.

**On the AllowList freeze risk and why it is not scored here.** Earlier versions of this report scored this category 3.0 principally because delisting an address strands its tokens with no DEX fallback. That risk is real, is unchanged, and is documented above and in Critical Risks — but it is a *governance/centralization* failure mode, not a liquidity-depth one, and it is already priced into Category 2 (Governance 4.0, with the critical gate marked BORDERLINE PASS). Scoring it twice double-counted a single root cause and understated a redemption mechanism that demonstrably clears $300M tickets. Readers who prefer to keep the conditional freeze risk inside the liquidity score should read this category as 3.0, which would raise the final score from 2.10 to **2.25** — still LOW RISK.

#### Category 5: Operational Risk (Weight: 5%) — **1.0**

- **Team:** Fully doxxed, prominent founders (Robert Leshner — Compound Finance), institutional backgrounds (CFA, Goldman Sachs, SEC, Coinbase)
- **Funding:** $100.5M from top-tier investors (Bain Capital Crypto, Distributed Global, Brevan Howard, Galaxy Digital, Haun Ventures)
- **Service Providers:** BNY Mellon (custodian), PricewaterhouseCoopers LLP (auditor), Invesco Advisers, Inc. (investment manager), NAV Fund Services (NAV agent) — all institutional-grade
- **Documentation:** Comprehensive, actively maintained, publicly available, now backed by an open fund data API
- **Legal:** U.S. corporation, SEC-registered investment adviser (801-132908) and SEC-registered transfer agent, Delaware Statutory Trust, Reg D/Section 3(c)(7) compliance
- **Incident Response:** Turnkey secure enclaves, dual pause mechanism, admin capabilities for wallet recovery
- **Industry:** Superstate Industry Council (50+ members), SEC Crypto Task Force engagement
- **License:** BUSL 1.1

**Score: 1.0/5**, at the rubric floor. Exceptional operational maturity. Strong team, massive VC backing, institutional-grade service providers across every function, proactive regulatory engagement, comprehensive documentation. The move from exempt-reporting-adviser to full SEC investment-adviser registration and the retention of a Big Four auditor reinforce the existing score but cannot lower it further.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.25 | 20% | 0.25 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 2.0 | 30% | 0.60 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 1.0 | 5% | 0.05 |
| **Final Score** | | | **2.10 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.00–1.49 | Minimal Risk | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | **Approved with standard monitoring** |
| 2.50–3.49 | Medium Risk | Approved with enhanced monitoring |
| 3.50–4.49 | Elevated Risk | Limited approval, strict limits |
| 4.50–5.00 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

USTB benefits from the safest possible underlying asset class (U.S. Treasury Bills), great audit coverage across five firms, institutional-grade service providers, a strong legal structure, and over two and a half years of incident-free operation. Two things are now demonstrated rather than asserted. Reserve transparency: the full line-item T-Bill portfolio, daily NAV, AUM, and share count are published through an open API and reconcile to within 0.05% of reported AUM and to onchain supply. And redemption capacity: ~647M USTB has been redeemed across 21,127 events since February 2025, including a single ~$302M exit, at NAV with zero fee and zero slippage.

The dominant residual risk is that the entire system is controlled by four EOAs with no multisig and no timelock. The July 2026 migration (two complete implementation replacements in two days) and the September 2026 single-transaction AllowList swap, each executed by one owner key, showed how fast that path moves. The owner's callable surface widened rather than narrowed, the forced-burn power has been exercised twice, and the AllowList revocation power has been used against an integrated DeFi protocol on the sister fund. Offchain reserve verification, while much better disclosed, is still issuer-published with no onchain attestation. These are partially mitigated by key separation across 4 EOAs, upgraded regulatory standing, secure key management (Turnkey TEEs), and the institutional framework around the fund.

**Key conditions for exposure:**

1. Monitor all 4 admin EOAs for ownership transfer events
2. Monitor all 3 ProxyAdmins for contract upgrades (`Upgraded` events) and the USTB proxy's EIP-1967 implementation slot for drift from [`0xb3ac55dd…`](https://etherscan.io/address/0xb3ac55dd09aa70e9bfbb12f45cd38a1f1597588c)
3. Monitor Oracle for `NewCheckpoint` events and NAV/Share feed for anomalies; alert on checkpoint age > 4 days
4. Monitor RedemptionIdle USDC balance for redemption capacity (median ~$5.2M since mid-August 2026, regularly drained to zero; 141,644 USDC on October 18, 2026)
5. Monitor AllowlistV4_2 for `AllowedSet` revocations affecting USTB holders or DeFi integrations, and the token's `allowlist()` pointer for any further swap
6. Monitor the new v1.3.0 config events (`AllowlistUpdated`, `IsPublicInstrumentUpdated`, `NameSet`, `SymbolSet`)
7. Reconcile the public holdings/NAV API against onchain supply weekly; alert if the holdings snapshot goes stale
8. Verify Superstate's regulatory standing periodically (SEC adviser registration 801-132908, transfer agent status)

**Score-improving triggers:**

- **Multisig adoption:** If Superstate transitions admin control from EOA to a multisig (even a team-internal multisig), the Centralization score would improve significantly
- **Timelock:** Adding a timelock on contract upgrades and critical parameter changes would reduce the governance risk
- **Chainlink Proof of Reserves or independent attestation:** Would take Provability from 2.5 to 2.0 or better
- **Continuous / shorter-lag holdings disclosure:** Reducing the ~4-week snapshot lag, or having holdings independently attested between annual audits, would also lift Provability
- **Larger bug bounty:** Publishing a maximum payout above $200K, or moving the program to Immunefi or a similar platform, would improve the Audits score
- **Public source repository for the live implementation:** Publishing the `FundToken` v1.3.0 source in a public repo, and an audit scoped to the deployed version, would remove the current audit-to-deployment gap

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (April 2027)
- **TVL-based:** Reassess if AUM changes by more than 50%
- **Incident-based:** Reassess after any exploit, admin key compromise, contract upgrade, governance change, or regulatory action
- **Upgrade-based:** Reassess on any `Upgraded` event, any further `AllowlistUpdated` event, a RedemptionV2 rollout, or a `FundToken` version past v1.3.0
- **Governance-based:** Reassess if Superstate adopts multisig, timelock, or other governance improvements (potential score improvement)
- **AllowList-based:** Reassess if any USTB permission for a DeFi integration or Yearn address is revoked
- **Transparency-based:** Reassess if the public holdings/NAV API is withdrawn or goes materially stale, or if Chainlink Proof of Reserves goes live
- **Regulatory-based:** Reassess if SEC takes enforcement action or Superstate's regulatory status changes (transfer agent, adviser registration)

---

## Appendix A — Audit Reports

### 0xMacro Audits

| # | Date | Scope | Link |
|---|------|-------|------|
| A-1 | Jul 2024 | Redemption contract | [Report](https://0xmacro.com/library/audits/superstate-1) |
| A-2 | Jul 2024 | USTB/USCC Token + AllowList | [Report](https://0xmacro.com/library/audits/superstate-2) |
| A-3 | Nov 2024 | Liquidation, Oracle, Token V2 | [Report](https://0xmacro.com/library/audits/superstate-3) |
| A-4 | Nov 2024 | Token + Redemption V2 | [Report](https://0xmacro.com/library/audits/superstate-4) |
| A-5 | Jan 2025 | Token V3 + Redemption | [Report](https://0xmacro.com/library/audits/superstate-5) |
| A-6 | Apr 2025 | Token + Redemption updates | [Report](https://0xmacro.com/library/audits/superstate-6) |
| A-7 | May 2025 | Solana Allowlist Program | [Report](https://0xmacro.com/library/audits/superstate-7) |
| A-8 | May 2025 | Equity Token | [Report](https://0xmacro.com/library/audits/superstate-8) |
| A-9 | Jul 2025 | AllowlistV3 (EVM) | [Report](https://0xmacro.com/library/audits/superstate-9) |
| A-10 | Nov 2025 | DIP, Dippable, EquityToken | [Report](https://0xmacro.com/library/audits/superstate-10) |
| A-11 | Feb 2026 | DIP v1.1, Dippable, EquityToken | [Report](https://0xmacro.com/library/audits/superstate-11) |

### Other Audits

| Firm | Date | Scope | Link |
|------|------|-------|------|
| Zellic | Feb 17, 2026 | AllowlistV4_0, FundToken, SuperstateTokenCore + components, RedemptionV2 / IdleV2 / YieldV2, SuperstateOracle, Dip, EquityToken | [Report PDF](https://docs.superstate.com/investors/smart-contracts) ("Superstate Smart Contracts — Zellic Audit Report") |
| Zellic | Jun 23, 2026 | AllowlistV4_2, FundTokenV1_2_0, EquityTokenV1_4_0, shared components, Dip | [Report PDF](https://docs.superstate.com/investors/smart-contracts) ("Superstate EVM — Zellic Audit Report") |
| ChainSecurity | 2023 | Compound SUPTB (original token) | [Report](https://www.chainsecurity.com/security-audit/compound-suptb) |
| Offside Labs | May 2025 | Solana Allowlist | [Superstate Docs](https://docs.superstate.com/investors/smart-contracts) |
| Certora | Apr 2025 | Solana Allowlist program (manual audit) | [Superstate Docs](https://docs.superstate.com/investors/smart-contracts) |

Both Zellic reports are linked as file attachments on the [Smart contracts](https://docs.superstate.com/investors/smart-contracts) documentation page rather than at stable public URLs.

## Appendix B — Contract Architecture

*State as of October 18, 2026. All owners are EOAs (code size 0). No multisig, no timelock on any contract.*

```
GOVERNANCE LAYER (4 EOAs — all code size 0, no multisig)
═══════════════════════════════════════════════════════════

  [EOA-1] USTB Token owner + USTB ProxyAdmin owner
  [EOA-2] AllowList owner + AllowList ProxyAdmin owner
  [EOA-3] RedemptionIdle owner + RedemptionIdle ProxyAdmin owner
  [EOA-4] Oracle owner (addCheckpoint, setMaxAcceptablePriceDelta)
          │               │                │               │
          ▼               ▼                ▼               │
PROXY ADMIN LAYER                                          │
═════════════════                                          │
                                                           │
  [PA-1] upgrade(USTB)       ← owned by [EOA-1]           │
  [PA-2] upgrade(AllowList)  ← owned by [EOA-2]           │
  [PA-3] upgrade(Redemption) ← owned by [EOA-3]           │
          │               │                │               │
          ▼               ▼                ▼               │
TOKEN LAYER                                                │
═══════════                                                │
                                                           │
  [USTB] USTB Token (Proxy)                                │
  impl: FundTokenV1_3_0 (VERSION "1.3.0")                  │
        modular ERC-7201 components                        │
                                                           │
  Admin (owner [EOA-1] only):                              │
  ├── mint() / bulkMint()  ← no backing check onchain    │
  ├── adminBurn(address, amount)                           │
  ├── pause() / unpause()                                  │
  ├── accountingPause() / accountingUnpause()              │
  ├── setOracle(newOracle)                                 │
  ├── setRedemptionContract(newContract)                   │
  ├── setStablecoinConfig(stablecoin, dest, fee)           │
  ├── setChainIdSupport(chainId, supported)                │
  ├── setMaximumOracleDelay(delay)                         │
  ├── setAllowlist(newAllowlist)        ← new in v1.3.0  │
  ├── setIsPublicInstrument(bool)       ← new in v1.3.0  │
  └── setName() / setSymbol()           ← new in v1.3.0  │
                                                           │
  Immutable: MINIMUM_ACCEPTABLE_PRICE = $7.00              │
                                                           │
  User functions (AllowList-gated):                        │
  ├── subscribe(to, amount, stablecoin)                    │
  ├── offchainRedeem(amount)                               │
  ├── bridge(amount, dest, chainId)                        │
  ├── bridgeToBookEntry(amount)                            │
  └── transfer / transferFrom                              │
          │               │                │               │
     reads│          reads│           reads│               │
          ▼               ▼                ▼               ▼
PROTOCOL LAYER
══════════════

  [AL] AllowList V4.2 (Proxy)    [ORC] SuperstateOracle      [RI] RedemptionIdle (Proxy)
  owner: [EOA-2]                  (NOT a proxy)                owner: [EOA-3]
                                  owner: [EOA-4]
  Admin:                                                       Admin:
  ├ setAllowed(addr, token, b)    Admin:                       ├ pause/unpause()
  ├ setAllowedBatch()             ├ addCheckpoint()            ├ setRedemptionFee()
  ├ setAllowedWithSignature()     ├ addCheckpoints()           ├ setSweepDestination()
  │ (owner EIP-712 sig,           ├ setMaxAcceptable           ├ setMaximumOracleDelay()
  │  relayable by anyone)         │ PriceDelta()               ├ withdraw()
  └ transferOwnership()           └ transferOwnership()        └ transferOwnership()

  Gating:                         Exposes:                     User:
  isAllowed(addr, token)          latestRoundData()            └ redeem(amount)
  isAddressAllowedForFund()       (Chainlink-compat)
  (token-only caller)                                          USDC bal: 0 – ~10M
  checkAllowlist() (Uni v4)       NAV: $11.2498/share          Oracle delay: 1h
                                  Expiry: 5 days               Fee: 0

EXTERNAL / UNDERLYING LAYER
════════════════════════════

  [USDC] USDC                 [CL] Chainlink NAV Feed       Offchain
  Used for subscribe/redeem   Independent NAV source         ├── BNY Mellon (custodian)
                                                             ├── Invesco Advisers (investment mgr)
  [SWEEP] Sweep destination                                  ├── PricewaterhouseCoopers (auditor)
  (subscription + redemption USDC)                           ├── NAV Fund Services (NAV agent)
                                                             └── U.S. Treasury Bills (99.59%)
```

**Address Legend:**

| Label | Address |
|-------|---------|
| [EOA-1] | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) |
| [EOA-2] | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) |
| [EOA-3] | [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) |
| [EOA-4] | [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) |
| [PA-1] USTB ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) |
| [PA-2] AllowList ProxyAdmin | [`0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46`](https://etherscan.io/address/0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46) |
| [PA-3] RedemptionIdle ProxyAdmin | [`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869) |
| [USTB] USTB Token (Proxy) | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) |
| [AL] AllowList V4.2 (Proxy) | [`0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f`](https://etherscan.io/address/0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f) |
| [ORC] SuperstateOracle | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) |
| [RI] RedemptionIdle (Proxy) | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) |
| [CL] Chainlink NAV Feed | [`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC) |
| [USDC] USDC | [`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) |
| [SWEEP] Sweep Destination (EOA) | [`0x774AE279c21B6a17a6E2BD5ab5398FF98F398807`](https://etherscan.io/address/0x774AE279c21B6a17a6E2BD5ab5398FF98F398807) |

### Proxy Upgrade Paths

Each proxy can be upgraded immediately (no timelock) by its ProxyAdmin owner:

| Proxy | ProxyAdmin | Owner (EOA) | Functions |
|-------|-----------|-------------|-----------|
| USTB Token [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | `upgrade()`, `upgradeAndCall()`, `changeProxyAdmin()` |
| AllowList V4.2 [`0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f`](https://etherscan.io/address/0xBcBC2b4FB2AbE1C598C9ea91E0b03338e4728D1f) | [`0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46`](https://etherscan.io/address/0xbD09445048322ed9d83F99cEdE8f8dc0fc0FBD46) | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) | `upgradeAndCall()` (OZ v5 `ProxyAdmin`) |
| RedemptionIdle [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) | [`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869) | [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) | `upgrade()`, `upgradeAndCall()`, `changeProxyAdmin()` |

The Oracle ([`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8)) is **not a proxy** and cannot be upgraded. However, the USTB Token owner can replace it entirely via `setOracle(newAddress)`, and can likewise replace the AllowList contract via `setAllowlist(newAddress)` without touching any proxy.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [March 5, 2026](https://github.com/yearn/risk-score/pull/81) | 2.38 | Initial assessment |
| [April 7, 2026](https://github.com/yearn/risk-score/pull/130) | 2.33 | Reassessment: Historical subscore improved (>2 years in production); onchain verification confirmed 4 separate admin EOAs rather than one |
| [June 13, 2026](https://github.com/yearn/risk-score/pull/249) | 2.33 | Reassessment: Invesco Advisers replaces Federated Hermes as investment manager, BNY Mellon replaces UMB Bank as custodian; APY, holders and AUM refreshed |
| [August 17, 2026](https://github.com/yearn/risk-score/pull/409) | 2.10 | Reassessment: token migrated to FundToken v1.3.0 over two July upgrades; public holdings/NAV API closes the reserve-transparency gap (Provability 3.0 → 2.5); Liquidity 3.0 → 2.0 on ~567M USTB of demonstrated redemptions incl. Spark's ~$303M single-transaction exit; Spark's "$300M allocation" corrected to a rate-limit ceiling, fully exited July 2025; Certora corrected from "formal verification" to a Solana allowlist audit; auditor now PwC |
| [October 18, 2026](https://github.com/yearn/risk-score/pull/538) | 2.10 | Reassessment: USTB switched to a new AllowlistV4_2 contract via `setAllowlist()` (Sep 22, 2026), all holders pre-permitted; Ethereum supply 53.75M USTB (~$604.5M), total AUM $819.4M; RedemptionIdle instant facility shown to swing 0–~$10M; DeFiLlama no longer tracks TVL; bug bounty now pays a $50K minimum for critical findings (Audits held at 1.5); seed and Series A sourced to Superstate's own announcement; no score change |
