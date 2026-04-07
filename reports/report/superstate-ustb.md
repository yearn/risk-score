# Protocol Risk Assessment: Superstate USTB

- **Assessment Date:** April 7, 2026
- **Token:** USTB
- **Chain:** Ethereum
- **Token Address:** [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)
- **Final Score: 2.33/5.0**

## Overview + Links

USTB is a tokenized investment fund issued by Superstate Inc. that provides exposure to short-duration U.S. Treasury Bills and Agency securities. The fund's investment objective is to seek current income consistent with liquidity and stability of principal, targeting returns in line with the federal funds rate.

USTB uses a **price appreciation model** (non-rebasing) — each USTB token represents one share in the fund, and the NAV per share increases daily as interest income from Treasury Bills accrues. The token price has grown from ~$10.00 at inception (February 2024) to ~$11.05 as of April 2026.

Investors undergo KYC/AML onboarding, get their wallet addresses whitelisted on the AllowList smart contract, and can then subscribe (mint) or redeem (burn) USTB tokens via USDC or USD. On-chain atomic subscription and redemption is available through the Protocol Mint and Redeem system, with a USDC instant redemption facility (currently ~$1.7M, capacity varies as it is refilled regularly).

The fund is structured as a series of **Superstate Asset Trust**, a **Delaware Statutory Trust**, providing bankruptcy remoteness from Superstate Inc. The sub-advisor is **Federated Hermes**, the custodian is **UMB Bank** (OCC-regulated), and the auditor is **Ernst & Young**.

- **Current NAV/Share:** ~$11.045 (SuperstateOracle: $11.045231, Chainlink: $11.044354 — verified on-chain April 2026)
- **On-chain Supply (Ethereum):** ~56.59M USTB (~$625M on-chain)
- **Total AUM:** ~$650M+ (including Solana and book-entry shares)
- **On-chain Holders (Ethereum):** ~70
- **Current APY:** ~2.58% (30-day), tracking the federal funds rate
- **Management Fee:** 0.15% annually (waived until AUM exceeds $200M — now exceeded)

**Links:**

- [Protocol Documentation](https://docs.superstate.com/)
- [USTB Fund Info](https://superstate.com/assets/ustb)
- [Smart Contract Addresses](https://docs.superstate.com/welcome-to-superstate/smart-contracts)
- [Security Documentation](https://docs.superstate.com/welcome-to-superstate/security)
- [GitHub (USTB contracts)](https://github.com/superstateinc/ustb/tree/main)
- [LlamaRisk Assessment](https://www.llamarisk.com/research/2024-10-07t21-32-09-000z)
- [Aave Forum — USTB/BUIDL GSM](https://governance.aave.com/t/arfc-ustb-buidl-gsm/19299/3)
- [DeFiLlama](https://defillama.com/protocol/superstate-ustb)
- [CoinGecko](https://www.coingecko.com/en/coins/superstate-short-duration-us-government-securities-fund-ustb)
- [Chainlink USTB NAV/Share Feed](https://data.chain.link/feeds/ethereum/mainnet/ustb-nav-per-share)
- [RWA.xyz](https://app.rwa.xyz/assets/USTB)
- [Etherscan Token Page](https://etherscan.io/token/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)

## Contract Addresses

*All addresses verified on-chain April 2026.*

| Contract | Address |
|----------|---------|
| USTB Token (Proxy) | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) |
| USTB Implementation (SuperstateTokenV5_1, VERSION "5") | [`0x1f50a1ee0ec8275d0c83b7bb08896b4b47d6e8c4`](https://etherscan.io/address/0x1f50a1ee0ec8275d0c83b7bb08896b4b47d6e8c4) |
| USTB ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) |
| AllowList V3.1 (Proxy) | [`0x02f1fa8b196d21c7b733eb2700b825611d8a38e5`](https://etherscan.io/address/0x02f1fa8b196d21c7b733eb2700b825611d8a38e5) |
| AllowList Implementation (Allowlist, VERSION "3.1") | [`0x2f67d98bd20d9580f52efa5ff70edaed9f2f316d`](https://etherscan.io/address/0x2f67d98bd20d9580f52efa5ff70edaed9f2f316d) |
| AllowList ProxyAdmin | [`0xb819692a58db9dd4d3b403a875439b6ca155c610`](https://etherscan.io/address/0xb819692a58db9dd4d3b403a875439b6ca155c610) |
| Superstate Continuous Price Oracle (not a proxy) | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) |
| Chainlink USTB NAV/Share Oracle | [`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC) |
| RedemptionIdle (Proxy) | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) |
| RedemptionIdle Implementation | [`0x8efba8af37af48d2e0a04b0aae60f0e9bc8de007`](https://etherscan.io/address/0x8efba8af37af48d2e0a04b0aae60f0e9bc8de007) |
| RedemptionIdle ProxyAdmin | [`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869) |
| USDC Sweep Destination (EOA) | [`0x774AE279c21B6a17a6E2BD5ab5398FF98F398807`](https://etherscan.io/address/0x774AE279c21B6a17a6E2BD5ab5398FF98F398807) |

### Owner Addresses

The system is controlled by **4 distinct EOAs** (all code size 0, no multisig):

| Role | Address |
|------|---------|
| USTB Token Owner + USTB ProxyAdmin Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) |
| AllowList Owner + AllowList ProxyAdmin Owner | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) |
| RedemptionIdle Owner + RedemptionIdle ProxyAdmin Owner | [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) |
| Oracle Owner | [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) |

## Audits and Due Diligence Disclosures

Superstate has undergone **11 security audits** from 3 firms (0xMacro, ChainSecurity, Offside Labs) plus **formal verification by Certora**, making this one of the most extensively audited RWA tokenization protocols.

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
| -- | **ChainSecurity** | 2023 | Compound SUPTB (original token) | 2 Critical (fixed — encumbrance transferability, transferFrom permission bypass) |
| -- | **Offside Labs** | May 2025 | Solana Allowlist | Separate program audit |
| -- | **Certora** | -- | Formal verification | Mathematical verification of contract properties |

**Total findings across all audits: 2 Critical (Solana), 4 High, 7 Medium — all fixed or acknowledged with rationale.**

**Smart Contract Complexity:** Moderate — Upgradeable EIP-1967 proxy, ERC-20 with ERC-7246 (deprecated in V4), AllowList-gated transfers, on-chain subscription via Chainlink oracle, multi-chain bridging. Clean OpenZeppelin patterns with proper storage gaps.

### Bug Bounty

- **Platform:** Self-hosted (security@superstate.co)
- **Formal Rewards:** None — "Superstate does not have a formal reward policy. Researchers should not expect compensation for discovering vulnerabilities."
- **Safe Harbor:** CFAA and DMCA safe harbor language for good-faith researchers
- **Note:** The lack of formal monetary rewards is a weakness compared to Immunefi-style programs

### Safe Harbor

Superstate is **not** listed on the SEAL Safe Harbor registry. This is typical for regulated RWA issuers.

## Historical Track Record

- **Fund Launch:** February 2024 on Ethereum (~26 months in production)
- **Contract Deployment:** December 6, 2023 (block 18,725,909)
- **Contract Upgrades:** Token has been upgraded through 5 versions (V1→V5_1, VERSION "5"), AllowList through 3 versions (V1→V3.1, VERSION "3.1"). Each upgrade was audited prior to deployment.
- **Smart Contract Exploits:** None. No security incidents, hacks, or exploits reported.
- **Price History:** NAV/Share has increased monotonically from ~$10.00 (inception) to ~$11.05 (April 2026), consistent with steady Treasury yield accrual. ATL: $10.29 (Feb 2025), ATH: ~$11.05 (current).
- **AUM Growth:**
  - Feb 2024: Launch
  - Oct 2024: ~$114M (per LlamaRisk report)
  - Mar 2025: ~$300M allocated by Spark alone
  - Mar 2026: ~$650M+ total AUM, ~$572M on-chain TVL (DeFiLlama)
  - Apr 2026: ~$625M on-chain (56.59M USTB × $11.045 NAV, verified on-chain)
- **Holder Distribution:** ~70 on-chain holders on Ethereum. Top 10 holders hold ~83.5% of supply. This concentration is expected for an institutional-grade permissioned fund. Top holders include EOAs (institutional investors) and smart contracts (DeFi integrations).
- **Incidents:** None. No hacks, exploits, or adverse events involving Superstate or USTB.

## Funds Management

### Yield Sources

1. **U.S. Treasury Bills** — Primary holding. At least 95% of the fund invested in short-duration (< 1 year maturity) U.S. Treasury Bills and Agency securities.
2. **Cash** — Up to 5% held in cash for liquidity facilitation.

The fund uses a **laddered approach** with holdings spread across various near-term maturities for liquidity and interest rate management.

### Accessibility

- **KYC Required:** Yes — investors must be **Qualified Purchasers** ($5M+ in investments for individuals, $25M for institutions) AND **Accredited Investors**. Full KYC/AML screening required.
- **Subscriptions (Minting):**
  - **On-chain atomic:** `subscribe()` function atomically transfers USDC and mints USTB at the Continuous NAV/S price. Available 24/7.
  - **Off-chain:** USD wire transfer, processed on Market Days (NYSE/Federal Reserve open days).
  - Max subscription fee: 0.1% (10 bps), configurable per stablecoin.
- **Redemptions (Burning):**
  - **On-chain atomic:** Via RedemptionIdle contract, burns USTB and sends USDC at Continuous NAV/S price. USDC instant redemption facility (~$1.7M as of April 2026), regularly replenished.
  - **Off-chain:** Transfer tokens to contract address or call `offchainRedeem()`. Proceeds in USDC or USD wire. T+0 if before 9:00 AM EST on Market Days, otherwise T+1.
  - No redemption fees for standard redemptions.
- **Geographic Restrictions:** Available to qualified purchasers in the U.S. and select offshore jurisdictions (Cayman Islands, BVI, Bermuda). Not available to sanctioned countries.
- **Management Fee:** 0.15% annually (waived until AUM exceeds $200M — now exceeded).

### Collateralization

- **Backing Model:** Off-chain — USTB tokens represent shares in a fund that holds U.S. Treasury Bills and Agency securities at **UMB Bank** (OCC-regulated qualified custodian).
- **Collateral Quality:** U.S. Treasury Bills are considered the **lowest-risk financial instrument** globally — backed by the full faith and credit of the U.S. government.
- **Sub-Advisor:** **Federated Hermes** — a major institutional asset manager managing $800B+ AUM — handles daily portfolio management.
- **Bankruptcy Remoteness:** The fund is a separate legal entity (series within a Delaware Statutory Trust) with inter-series liability protection, bankruptcy-remote from Superstate Inc.
- **Verification:** Ernst & Young conducts annual audits. NAV Consulting / NAV Fund Services provides independent NAV calculation.

### Provability

- **NAV/Price Updates:** The Superstate Continuous Price Oracle ([`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8)) extrapolates real-time prices using linear interpolation between NAV/S checkpoints. Updates every second, 24/7/365. Compatible with Chainlink AggregatorV3Interface. **Note:** Since prices are linearly interpolated between checkpoints, the on-chain price is an estimate that may diverge from the actual NAV between checkpoint updates — the price catches up only when the next checkpoint is posted by Superstate.
- **Chainlink NAV Feed:** Chainlink provides an independent NAV/Share data feed ([`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC)).
- **On-chain Supply:** Total USTB supply is verifiable on-chain via `totalSupply()`.
- **Off-chain Assets:** The underlying Treasury portfolio is held off-chain at UMB Bank. Token holders cannot independently verify the specific Treasury holdings on-chain. However:
  - Independent NAV calculation by NAV Consulting/NAV Fund Services
  - Annual audit by Ernst & Young
  - Chainlink Proof of Reserves was in development (per LlamaRisk, Oct 2024)
  - Redundant record-keeping across fund calculation agent, internal records, and on-chain records
- **Reserve Transparency:** USTB publishes headline NAV, AUM, and yield data publicly on [superstate.com/assets/ustb](https://superstate.com/assets/ustb). However, granular portfolio holdings (specific T-Bill CUSIPs, maturities, allocations) are only accessible through the authenticated investor portal (requires Qualified Purchaser onboarding and 2FA). The fund is structured under SEC exemptions with regulatory reporting requirements.

## Liquidity Risk

- **Primary Exit:** On-chain atomic redemption via RedemptionIdle contract at Continuous NAV/S price. USDC instant redemption capacity varies (~$1.7M as of April 2026, regularly refilled).
- **Secondary Exit:** Off-chain redemption via wire transfer or USDC. T+0 if before 9:00 AM EST on Market Days, otherwise T+1. No withdrawals during weekends/U.S. holidays.
- **DEX Liquidity:** None. USTB has $0 24h trading volume on DEXs. Not listed on any exchanges. This is by design — the token is a regulated fund product, not a freely tradeable token.
- **Transfer Restrictions:** All transfers require both sender and receiver to be on the AllowList. Removing an address from the AllowList effectively freezes their tokens.
- **DeFi Integrations (Liquidity Venues):**
  - **Spark Protocol (MakerDAO):** $300M allocated to USTB as yield-generating reserve
  - **Aave Horizon:** USTB accepted as collateral to borrow USDC, GHO, RLUSD
  - **Morpho / Pareto / Gauntlet:** USTB-adjacent via Pareto Credit Vault CV tokens as Morpho collateral; Gauntlet levered RWA strategy (~13% APY, ~$51M collateral)
  - **M^0 Protocol:** USTB designated as first eligible collateral for all M^0 network stablecoins (MetaMask mUSD, Noble USDN)
  - **FalconX:** USTB used as prime brokerage trading collateral
  - **BitGo:** Tri-party derivative collateral
- **Stress Scenario:** In a scenario requiring large-scale redemption, liquidity depends on Superstate's ability to sell the underlying Treasury portfolio (highly liquid) and process USDC conversions via Circle. T-Bills are among the most liquid financial instruments globally, mitigating this risk.

### AllowList Freeze Risk (Critical for DeFi Integrations)

**If an address is removed from the AllowList, the USTB tokens held by that address are completely frozen with zero exit paths:**

1. `transfer()` reverts — AllowList checks sender AND receiver
2. `transferFrom()` reverts — same AllowList check
3. On-chain redemption via RedemptionIdle reverts — requires AllowList status
4. `offchainRedeem()` reverts — requires AllowList status
5. DEX swap impossible — $0 liquidity AND DEX contracts would also need AllowList permission

**There is no fallback exit mechanism.** The only recovery path is to contact Superstate to be re-whitelisted, or have Superstate perform an `adminBurn()` and process a manual off-chain redemption.

**Implications for Yearn:** Yearn's vault/strategy contract must be whitelisted by Superstate via protocol address permissions. If Superstate removes this permission (regulatory action, policy change, sanctions, dispute, or operational error), Yearn's entire USTB position becomes frozen and unredeemable. This is a fundamentally different risk profile from permissionless DeFi tokens where DEX liquidity provides a fallback exit.

**On-chain verification (April 2026):** Confirmed that DeFi protocols integrating USTB (e.g., Midas RedemptionVault at [`0x569d7dccbf6923350521ecbc28a555a500c4f0ec`](https://etherscan.io/address/0x569d7dccbf6923350521ecbc28a555a500c4f0ec), Frax FrxUSDCustodian at [`0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33`](https://etherscan.io/address/0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33)) are individually whitelisted on the AllowList with assigned entity IDs. Maple Finance's protocol contracts are NOT whitelisted — Maple's USTB collateral is held by borrowers in their own wallets as off-chain collateral arrangements, not locked in Maple smart contracts.

## Centralization & Control Risks

### Governance

**Governance Model:** Fully centralized — Superstate Inc. controls all administrative functions. No on-chain governance, no DAO, no community voting.

**Key Privileged Roles (verified on-chain, April 2026):**

| Role | Address | Type | Powers |
|------|---------|------|--------|
| USTB Token Owner + USTB ProxyAdmin Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | **EOA** | `mint`, `bulkMint`, `adminBurn`, `pause`/`unpause`, `accountingPause`/`accountingUnpause`, `setOracle`, `setStablecoinConfig`, `setRedemptionContract`, `setChainIdSupport`, `setMaximumOracleDelay`. Can `upgrade()` / `upgradeAndCall()` USTB token implementation via ProxyAdmin. |
| AllowList Owner + AllowList ProxyAdmin Owner | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) | **EOA** | `setEntityIdForAddress`, `setEntityAllowedForPublicInstrument`, `setEntityAllowedForPrivateInstrument`, `setProtocolAddressPermission`. Can `upgrade()` AllowList implementation via ProxyAdmin. |
| RedemptionIdle Owner + RedemptionIdle ProxyAdmin Owner | [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) | **EOA** | `pause`/`unpause`, `setRedemptionFee`, `setSweepDestination`, `setMaximumOracleDelay`, `withdraw` (extract USDC). Can `upgrade()` RedemptionIdle implementation via ProxyAdmin. |
| Oracle Owner | [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) | **EOA** | `addCheckpoint` / `addCheckpoints` (set NAV price), `setMaximumAcceptablePriceDelta`. Oracle is **not** a proxy — cannot be upgraded. |

**Critical centralization concerns:**

1. **EOA-controlled administration** — The system is controlled by **4 distinct EOAs**, each with no multisig, no timelock, and no governance delay. The USTB Token Owner (`0xad30...ca83`) controls minting, burning from any address, pausing all operations, changing the oracle, and upgrading the USTB contract implementation. Separate EOAs control the AllowList, RedemptionIdle, and Oracle — splitting control across more keys reduces single-key blast radius but none have multisig protection.
2. **Admin burn capability** — The owner can call `adminBurn(address, uint256)` to forcibly burn tokens from any holder's address. This is documented as being for "exogenous legal circumstances" (regulatory compliance).
3. **No timelock on any operation** — Contract upgrades, parameter changes, and critical admin functions execute immediately with no delay period for users to react.
4. **AllowList control** — Removing an address from the AllowList effectively freezes their tokens (they cannot transfer or redeem). This is a compliance feature but also a centralization vector.
5. **Oracle pricing control** — The Oracle Owner (`0x4B1d...1395`) controls NAV checkpoints via `addCheckpoint()`. While the oracle uses programmatic linear interpolation between checkpoints, the checkpoint values themselves are set by this EOA. A malicious or compromised oracle owner could post incorrect NAV values affecting subscription/redemption pricing.

**Mitigations:**

- **Turnkey secure enclaves** — Private key operations are performed inside hardware-enforced Trusted Execution Environments (TEEs). Keys are never exposed to Superstate or the application.
- **Two-step ownership transfer** — `Ownable2StepUpgradeable` requires propose + accept for ownership changes, preventing accidental transfer.
- **`renounceOwnership` disabled** — Cannot accidentally or maliciously renounce ownership.
- **Regulatory accountability** — Superstate Inc. is a U.S. corporation operating under SEC exemptions, with registered transfer agent status. Malicious admin actions would have direct legal consequences.
- **Institutional-grade service providers** — UMB Bank (custodian), Ernst & Young (auditor), and Federated Hermes (sub-advisor) provide independent oversight of the underlying fund.

### Programmability

- **NAV/Price:** The Continuous Price Oracle computes real-time NAV/S on-chain using linear extrapolation between NAV checkpoints set by Superstate. Chainlink provides an independent feed. NAV checkpoints are set by the admin, but the extrapolation is programmatic.
- **Subscriptions:** Atomic on-chain subscription at oracle price is programmatic (anyone allowlisted can call `subscribe()`).
- **Redemptions:** Atomic on-chain redemption is programmatic (via RedemptionIdle contract).
- **Transfers:** Programmatic AllowList enforcement on every transfer (on-chain check).
- **Minting/Burning:** Admin-only. Minting reflects off-chain subscriptions. Admin burning is for regulatory compliance.
- **Accounting:** Dual pause mechanism (transfers vs. mint/burn) is admin-controlled.

### External Dependencies

1. **U.S. Treasury Market (Critical)** — Fund holds U.S. Treasury Bills and Agency securities. An unprecedented U.S. government default would directly impact the fund. Extremely low probability.
2. **UMB Bank (Critical)** — Qualified custodian for the underlying assets. UMB is an OCC-regulated national bank.
3. **Federated Hermes (Critical)** — Sub-advisor handling daily portfolio management. Major institutional asset manager with $800B+ AUM.
4. **Circle (High)** — USDC subscriptions and redemptions route through Circle. A USDC depeg would not affect USTB NAV (backed by Treasuries) but would affect the USDC redemption path.
5. **Chainlink (Medium)** — NAV/Share oracle feed. Superstate also runs their own Continuous Price Oracle as primary source.
6. **Turnkey (Medium)** — Non-custodial key management via secure enclaves. Failure could delay admin operations.
7. **Ernst & Young (Low)** — Annual audit of the fund. Provides independent verification.
8. **NAV Consulting (Low)** — Independent NAV calculation agent.

## Operational Risk

- **Team:** Robert Leshner (Co-Founder & CEO, previously co-founded Compound Finance, CFA, UPenn Economics), Reid Cuming (Co-Founder & COO, ex-Square, Stripe, Chime), Jim Hiltner (Co-Founder & Head of BD, ex-Compound Sales), Dean Swennumson (Co-Founder & Head of Ops, ex-Compound Operations). Team also includes alumni from Goldman Sachs, Coinbase, SEC, Frax Finance. ~23 employees.
- **Funding:** ~$100.5M raised across 3 rounds:
  - Seed: $4M (June 2023) — ParaFi, Cumberland, 1kx
  - Series A: $14M (November 2023) — Distributed Global, CoinFund, Breyer Capital, Galaxy, Hack VC
  - Series B: $82.5M (January 2026) — Bain Capital Crypto, Distributed Global, Brevan Howard Digital, Galaxy Digital, Haun Ventures
- **Documentation:** Comprehensive docs at [docs.superstate.com](https://docs.superstate.com/) covering fund mechanics, legal structure, smart contracts, security. Actively maintained.
- **Legal Structure:**
  - **Superstate Inc.** (Delaware corporation) — parent company and investment adviser
  - **Superstate Asset Trust** (Delaware Statutory Trust, organized June 15, 2023) — bankruptcy-remote fund entity
  - **Superstate Advisers LLC** — Exempt Reporting Adviser (SEC)
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
| USTB Token | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) | Token state | `Mint`, `AdminBurn`, `OffchainRedeem`, `Bridge`, `SubscribeV2`, `Paused`/`Unpaused`, `AccountingPaused`/`AccountingUnpaused`, `SetOracle`, `SetRedemptionContract`, `SetStablecoinConfig`, `SetMaximumOracleDelay`, `OwnershipTransferStarted`, `totalSupply()` |
| Continuous Price Oracle | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) | NAV pricing (not a proxy) | `NewCheckpoint`, `SetMaximumAcceptablePriceDelta`, `OwnershipTransferStarted`, `latestRoundData()` |
| AllowList V3.1 | [`0x02f1fa8b196d21c7b733eb2700b825611d8a38e5`](https://etherscan.io/address/0x02f1fa8b196d21c7b733eb2700b825611d8a38e5) | Permission changes | `EntityIdSet`, `ProtocolAddressPermissionSet`, `PublicInstrumentPermissionSet`, `PrivateInstrumentPermissionSet`, `OwnershipTransferStarted` |
| RedemptionIdle | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) | Redemption liquidity | `RedeemV2`, `Withdraw`, `SetRedemptionFee`, `SetSweepDestination`, `Paused`/`Unpaused`, `OwnershipTransferStarted`, USDC `balanceOf()` |
| USTB ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) | USTB proxy upgrades | `Upgraded` event on USTB proxy, `OwnershipTransferred` |
| AllowList ProxyAdmin | [`0xb819692a58db9dd4d3b403a875439b6ca155c610`](https://etherscan.io/address/0xb819692a58db9dd4d3b403a875439b6ca155c610) | AllowList proxy upgrades | `Upgraded` event on AllowList proxy, `OwnershipTransferred` |
| RedemptionIdle ProxyAdmin | [`0xcaba8c12873fffed13431d98bf6b836dff08e869`](https://etherscan.io/address/0xcaba8c12873fffed13431d98bf6b836dff08e869) | RedemptionIdle proxy upgrades | `Upgraded` event on RedemptionIdle proxy, `OwnershipTransferred` |

### Admin EOAs to Monitor

| EOA | Role | Key Actions |
|-----|------|-------------|
| [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | USTB Token + ProxyAdmin Owner | Mint, adminBurn, pause, upgrade USTB impl, set oracle/redemption/stablecoin config |
| [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) | AllowList + ProxyAdmin Owner | Add/remove addresses, set permissions, upgrade AllowList impl |
| [`0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765`](https://etherscan.io/address/0x8cf40e96e7d7fd8A7A9bEf70d3882fbBC4D40765) | RedemptionIdle + ProxyAdmin Owner | Pause redemptions, withdraw USDC, set fees, upgrade RedemptionIdle impl |
| [`0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395`](https://etherscan.io/address/0x4B1df64357a5D484563c9b7c16a80eD8B8fB1395) | Oracle Owner | Set NAV checkpoints (pricing), set price delta |

### Critical Monitoring Points

- **NAV/Share:** Track Continuous Price Oracle (`latestRoundData()`) and Chainlink feed — should increase monotonically. Alert on any decrease (would indicate fund losses). Current: ~$11.045. Checkpoint expiration: 5 days.
- **Admin Burns:** Monitor `AdminBurn` events — forced burns from holder addresses are a critical event.
- **Pause Events:** Monitor `Paused`/`Unpaused` and `AccountingPaused`/`AccountingUnpaused` on USTB Token AND RedemptionIdle.
- **Contract Upgrades:** Monitor **all 3 ProxyAdmins** for `Upgraded` events — USTB ProxyAdmin (`0xb9d2...2146`), AllowList ProxyAdmin (`0xb819...c610`), and RedemptionIdle ProxyAdmin (`0xcaba...e869`). Any proxy upgrade executes immediately with no timelock.
- **Oracle Changes:** Monitor `SetOracle` events on USTB Token and `NewCheckpoint` events on the Oracle. Monitor `SetMaximumAcceptablePriceDelta` on Oracle (current: $1.00).
- **AllowList Changes:** Monitor `ProtocolAddressPermissionSet` and `EntityIdSet` events, especially protocol address permissions (DeFi integrations).
- **Redemption Capacity:** Monitor USDC `balanceOf()` on RedemptionIdle — current ~$1.7M. Also monitor `Withdraw` events (owner can extract USDC) and `SetRedemptionFee` (currently 0).
- **Ownership Transfers:** Monitor `OwnershipTransferStarted` on all 4 contracts (USTB, AllowList, RedemptionIdle, Oracle) and `OwnershipTransferred` on all 3 ProxyAdmins.
- **Large Supply Changes:** Alert on mints/burns >5% of total supply in 24h. Current supply: ~56.59M USTB.
- **Recommended Frequency:** Hourly for NAV/pause/admin events. Daily for AllowList and redemption capacity.

## Risk Summary

### Key Strengths

1. **Safest underlying asset class** — 95%+ invested in U.S. Treasury Bills, the lowest-risk financial instrument globally, backed by the full faith and credit of the U.S. government
2. **Great audit coverage** — 11 audits from 3 firms (0xMacro, ChainSecurity, Offside Labs) plus Certora formal verification, with ongoing audit relationship as code evolves
3. **Institutional-grade service providers** — UMB Bank (OCC-regulated custodian), Federated Hermes (sub-advisor, $800B+ AUM), Ernst & Young (auditor), NAV Consulting (independent NAV)
4. **Strong team and backing** — Compound Finance founders, $100.5M raised from Bain Capital Crypto, Distributed Global, Brevan Howard, Galaxy Digital, Haun Ventures
5. **Bankruptcy-remote legal structure** — Delaware Statutory Trust with inter-series liability protection, SEC-regulated framework
6. **Large AUM** — $650M+ with strong institutional adoption (Spark $300M, Aave Horizon, M^0)

### Key Risks

1. **EOA-controlled admin** — 4 distinct EOAs control token minting, forced burning, pausing, oracle changes, and proxy upgrades. No multisig, no timelock on any. The separation across 4 keys reduces single-key blast radius but none have multisig protection.
2. **Off-chain assets** — Underlying Treasury portfolio held off-chain at UMB Bank. Token holders cannot independently verify holdings on-chain. Must rely on NAV agent, auditor, and regulatory framework.
3. **No DEX liquidity** — Exit exclusively through Superstate's mint/redeem system. No secondary market. Transfer restricted to allowlisted addresses only.
4. **No formal bug bounty rewards** — Researchers explicitly told not to expect compensation for vulnerability discoveries.
5. **Permissioned access** — Only Qualified Purchasers ($5M+) who pass KYC can hold or transfer USTB. Limits DeFi composability.

### Critical Risks

- **AllowList freeze risk** — If Superstate removes an address from the AllowList, the holder's tokens are **completely frozen with zero exit paths**. No transfers, no redemption, no DEX fallback. For DeFi protocols integrating USTB, this means Superstate has unilateral power to freeze an entire protocol's USTB position.
- **Private key compromise** — 4 separate EOAs control different parts of the system. Compromise of `0xad30...ca83` alone could upgrade the USTB token to malicious code, mint unlimited tokens, or burn tokens from any address, all with no delay. Other EOAs control AllowList (freeze addresses), RedemptionIdle (withdraw USDC, pause redemptions), and Oracle (manipulate pricing). Mitigated by Turnkey secure enclaves but each remains a single point of failure.
- **Admin burn capability** — The `adminBurn()` function can confiscate tokens from any holder. While documented as a regulatory compliance tool, this gives Superstate unilateral power over user funds.
- **No upgrade delay** — All 3 proxy contracts (USTB Token, AllowList, RedemptionIdle) can be upgraded immediately with no timelock for users or protocols (like Aave, Morpho, Spark) to react.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** → **PASS** — 11 audits by 3 firms + Certora formal verification. Great coverage.
- [x] **Unverifiable reserves** → **PASS** — Off-chain reserves, but verified by independent NAV agent (NAV Consulting), annual EY audit, SEC regulatory framework, bankruptcy-remote trust structure. Chainlink NAV feed provides on-chain pricing. Not fully on-chain verifiable, but multiple independent verification layers.
- [x] **Total centralization** → **BORDERLINE PASS** — 4 distinct EOAs control admin functions (token, allowlist, redemption, oracle) with no multisig or timelock on any. However, Superstate is a U.S. corporation under SEC regulation, with registered transfer agent status, institutional custodian, and institutional-grade key management via Turnkey secure enclaves. The separation across 4 keys and the regulatory accountability partially compensate for the lack of on-chain governance.

**Result:** Protocol passes critical gates. Proceeding to category scoring with conservative bias on centralization.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.25**

| Aspect | Assessment |
|--------|-----------|
| Audits | 11 audits by 3 firms (0xMacro ×9, ChainSecurity, Offside Labs) + Certora formal verification. Continuous audit relationship — each version audited before deployment. |
| Bug Bounty | Self-hosted, no formal monetary rewards. Weaker than Immunefi-style programs. |
| Time in Production | Fund: ~26 months (Feb 2024). Contracts: ~28 months (Dec 2023). Multiple version upgrades, all audited. |
| TVL | ~$650M+ total AUM, ~$625M on-chain (56.59M USTB × $11.045 NAV) |
| Historical Incidents | None. No security incidents, exploits, or adverse events. |

**Subcategory A: Audits — 1.5** Great audit coverage (11 audits + formal verification) is among the strongest in the RWA space. The lack of a formal bug bounty with monetary rewards prevents a perfect score.

**Subcategory B: Historical — 1.0** Over 2 years in production with zero incidents and sustained TVL >$100M. Clean operational history across 5 token versions and 3 AllowList versions.

**Score: (1.5 + 1.0) / 2 = 1.25/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.0**

**Subcategory A: Governance — 4.0**

- **4 distinct EOAs** control the system with no multisig on any:
  - `0xad30...ca83` — USTB Token owner + USTB ProxyAdmin owner (mint, adminBurn, pause, oracle, stablecoin config, proxy upgrades)
  - `0x7747...2bfe` — AllowList owner + AllowList ProxyAdmin owner (permissions, proxy upgrades)
  - `0x8cf4...0765` — RedemptionIdle owner + RedemptionIdle ProxyAdmin owner (pause redemptions, withdraw USDC, set fees, proxy upgrades)
  - `0x4B1d...1395` — Oracle owner (NAV checkpoints, price delta)
- **No timelock** on any operation — upgrades, parameter changes, and critical functions execute immediately
- No on-chain governance, no DAO, no community voting
- **Positive:** Separation across 4 keys reduces single-key blast radius compared to a single EOA controlling everything
- **Positive:** Turnkey secure enclaves for key management, two-step ownership transfer (`Ownable2StepUpgradeable`), `renounceOwnership` disabled
- **Positive:** Regulatory accountability — Superstate is a U.S. corporation with SEC-registered transfer agent, subject to securities law enforcement
- Despite regulatory mitigations and key separation, the on-chain governance remains EOA-controlled with no multisig or timelock on any contract

**Subcategory B: Programmability — 2.0**

- NAV pricing: Continuous Price Oracle uses programmatic linear extrapolation between admin-set checkpoints. Chainlink provides independent feed
- Subscriptions: Atomic on-chain subscription at oracle price is programmatic (allowlisted users call `subscribe()`)
- Redemptions: Atomic on-chain redemption via RedemptionIdle is programmatic
- Transfer enforcement: AllowList checks on every transfer are on-chain and programmatic
- Minting/burning: Admin-controlled, reflects off-chain operations
- Overall: Core token operations (subscribe, redeem, transfer) are well-automated on-chain. NAV pricing has a good programmatic model. Admin functions (mint, burn, pause) are necessarily manual for a regulated fund.

**Subcategory C: External Dependencies — 2.0**

- U.S. Treasury Bills: Safest possible underlying asset
- UMB Bank: OCC-regulated, established custodian
- Federated Hermes: $800B+ AUM institutional asset manager
- Circle: USDC infrastructure, blue-chip stablecoin provider
- Chainlink: Established oracle network
- All external dependencies are institutional-grade with long track records

**Score: (4.0 + 2.0 + 2.0) / 3 = 2.67 → 3.0/5** — Rounded up to 3.0 due to the severity of the EOA-with-no-timelock governance issue, which is the dominant risk factor. The system is now confirmed to use 4 separate EOAs (reducing single-key blast radius compared to a single admin), but each contract still has one EOA with no multisig or timelock. While external dependencies and programmability are strong, the governance centralization drags the overall category.

#### Category 3: Funds Management (Weight: 30%) — **2.25**

**Subcategory A: Collateralization — 1.5**

- U.S. Treasury Bills are the **safest underlying asset class** — backed by the full faith and credit of the U.S. government
- Fund structured as a bankruptcy-remote Delaware Statutory Trust with inter-series liability protection
- UMB Bank (OCC-regulated) as qualified custodian
- Federated Hermes as institutional sub-advisor managing the portfolio
- At least 95% in Treasuries, up to 5% cash for liquidity
- Virtually zero credit risk on the underlying assets

**Subcategory B: Provability — 3.0**

- NAV calculated independently by NAV Consulting/NAV Fund Services (third party)
- Annual audit by Ernst & Young
- Chainlink NAV/Share feed provides independent on-chain pricing
- Superstate Continuous Price Oracle provides real-time extrapolation
- Headline NAV, AUM, and yield publicly visible on [superstate.com/assets/ustb](https://superstate.com/assets/ustb)
- Granular portfolio holdings (T-Bill CUSIPs, maturities) gated behind authenticated investor portal — not publicly accessible
- SEC regulatory reporting requirements
- Redundant record-keeping: fund agent records + internal records + on-chain records
- However: underlying Treasury holdings are off-chain and cannot be independently verified on-chain by token holders
- Chainlink Proof of Reserves was in development (per LlamaRisk, Oct 2024) but not yet confirmed live

**Score: (1.5 + 3.0) / 2 = 2.25/5** — The safest possible underlying asset (U.S. Treasuries) with institutional-grade custody. However, significant off-chain dependencies: portfolio holdings are not publicly verifiable (gated investor portal), NAV relies on off-chain calculation agents, and Chainlink Proof of Reserves is not yet live. Multiple independent parties provide oversight but the lack of public transparency on actual holdings is a material weakness.

#### Category 4: Liquidity Risk (Weight: 15%) — **3.0**

- On-chain atomic redemption at NAV/S price via RedemptionIdle (~$1.7M USDC instant capacity as of April 2026, varies as refilled)
- Off-chain redemption: T+0 if before 9 AM EST on Market Days, otherwise T+1
- No DEX liquidity whatsoever — $0 24h volume, not listed on any exchange
- Transfers restricted to allowlisted addresses only — limits secondary market formation
- **AllowList freeze risk:** If removed from AllowList, tokens are completely frozen with zero exit paths — no transfer, no redemption, no DEX fallback. Superstate has unilateral power to freeze any holder's position.
- Same-value asset (USD-denominated Treasury fund) — no price slippage risk on redemption
- Underlying Treasuries are among the most liquid financial instruments globally
- Large DeFi integrations provide some institutional exit paths (Spark, Aave Horizon)
- No withdrawal during weekends/U.S. holidays (off-chain path)
- On-chain atomic redemption available 24/7 up to facility capacity

**Score: 3.0/5** — Redemption mechanism is functional with both on-chain atomic and off-chain paths, and same-value asset mitigates waiting risk. However, the complete absence of secondary market liquidity combined with the AllowList freeze risk creates a critical dependency: if Superstate removes a holder from the AllowList, tokens are irrecoverably frozen with no fallback exit. This is fundamentally different from permissionless DeFi tokens. The extremely high liquidity of the underlying Treasuries is irrelevant if the on-chain exit is blocked.

#### Category 5: Operational Risk (Weight: 5%) — **1.0**

- **Team:** Fully doxxed, prominent founders (Robert Leshner — Compound Finance), institutional backgrounds (CFA, Goldman Sachs, SEC, Coinbase)
- **Funding:** $100.5M from top-tier investors (Bain Capital Crypto, Distributed Global, Brevan Howard, Galaxy Digital, Haun Ventures)
- **Service Providers:** UMB Bank (custodian), Ernst & Young (auditor), Federated Hermes (sub-advisor), NAV Consulting (NAV agent) — all institutional-grade
- **Documentation:** Comprehensive, actively maintained, publicly available
- **Legal:** U.S. corporation, SEC-registered transfer agent, Delaware Statutory Trust, Reg D/Section 3(c)(7) compliance
- **Incident Response:** Turnkey secure enclaves, dual pause mechanism, admin capabilities for wallet recovery
- **Industry:** Superstate Industry Council (50+ members), SEC Crypto Task Force engagement
- **License:** BUSL 1.1

**Score: 1.0/5** — Exceptional operational maturity. Strong team, massive VC backing, institutional-grade service providers across every function, proactive regulatory engagement, comprehensive documentation.

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (1.25 × 0.20) + (3.0 × 0.30) + (2.25 × 0.30) + (3.0 × 0.15) + (1.0 × 0.05)
            = 0.25 + 0.90 + 0.675 + 0.45 + 0.05
            = 2.325
            ≈ 2.33
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.25 | 20% | 0.25 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 2.25 | 30% | 0.675 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.0 | 5% | 0.05 |
| **Final Score** | | | **2.33 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

USTB benefits from the safest possible underlying asset class (U.S. Treasury Bills), great audit coverage, institutional-grade service providers, a strong legal structure, and over 2 years of incident-free operation. The primary risk factors are the centralized admin (4 distinct EOAs with no multisig or timelock) and heavy off-chain dependencies for reserve provability (holdings gated behind investor portal, no Chainlink Proof of Reserves yet). These are partially mitigated by key separation across 4 EOAs, regulatory accountability, secure key management (Turnkey TEEs), and the institutional framework around the fund.

**Score change from prior assessment (March 2026: 2.38 → April 2026: 2.33):** Driven by improved Historical subscore (>2 years in production, score 1 vs prior ~2) and updated on-chain verification revealing 4 separate EOAs (modest positive vs prior assumption).

**Key conditions for exposure:**

1. Monitor all 4 admin EOAs for ownership transfer events
2. Monitor all 3 ProxyAdmins for contract upgrades (`Upgraded` events)
3. Monitor Oracle for `NewCheckpoint` events and NAV/Share feed for anomalies
4. Monitor RedemptionIdle USDC balance for redemption capacity (currently ~$1.7M)
5. Monitor AllowList for `ProtocolAddressPermissionSet` changes affecting DeFi integrations
6. Verify Superstate's regulatory standing periodically (SEC filings, transfer agent status)

**Score-improving triggers:**

- **Multisig adoption:** If Superstate transitions admin control from EOA to a multisig (even a team-internal multisig), the Centralization score would improve significantly
- **Timelock:** Adding a timelock on contract upgrades and critical parameter changes would reduce the governance risk
- **Chainlink Proof of Reserves:** If deployed, would improve the Provability sub-score
- **Formal bug bounty:** Launching a funded bug bounty on Immunefi would improve the Audits score

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (October 2026) — longer interval given the stability of the underlying asset and regulatory framework
- **TVL-based:** Reassess if AUM changes by more than 50%
- **Incident-based:** Reassess after any exploit, admin key compromise, contract upgrade, governance change, or regulatory action
- **Governance-based:** Reassess if Superstate adopts multisig, timelock, or other governance improvements (potential score improvement)
- **Regulatory-based:** Reassess if SEC takes enforcement action or Superstate's regulatory status changes (transfer agent, ERA)

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

### Other Audits

| Firm | Date | Scope | Link |
|------|------|-------|------|
| ChainSecurity | 2023 | Compound SUPTB (original token) | [Report](https://www.chainsecurity.com/security-audit/compound-suptb) |
| Offside Labs | May 2025 | Solana Allowlist | [Superstate Docs](https://docs.superstate.com/welcome-to-superstate/security) |
| Certora | -- | Formal Verification | [Superstate Docs](https://docs.superstate.com/welcome-to-superstate/security) |

## Appendix B — Contract Architecture

*Verified on-chain April 7, 2026. All owners are EOAs (code size 0). No multisig, no timelock on any contract.*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GOVERNANCE LAYER (4 EOAs)                          │
│                                                                             │
│  EOA 0xad30...ca83          EOA 0x7747...2bfe      EOA 0x8cf4...0765       │
│  ├─ USTB Token owner        ├─ AllowList owner     ├─ RedemptionIdle owner │
│  └─ USTB ProxyAdmin owner   └─ AL ProxyAdmin owner └─ RI ProxyAdmin owner │
│                                                                             │
│  EOA 0x4B1d...1395                                                         │
│  └─ Oracle owner (addCheckpoint, setMaxAcceptablePriceDelta)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                          PROXY ADMIN LAYER                                  │
│                                                                             │
│  ProxyAdmin 0xb9d2...2146   ProxyAdmin 0xb819...c610  ProxyAdmin 0xcaba..69│
│  └─ upgrade(USTB Proxy)     └─ upgrade(AllowList)      └─ upgrade(Redemp.) │
│     upgradeAndCall()           upgradeAndCall()            upgradeAndCall() │
│     changeProxyAdmin()         changeProxyAdmin()          changeProxyAdmin │
├─────────────────────────────────────────────────────────────────────────────┤
│                          TOKEN LAYER                                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────┐                  │
│  │  USTB Token (Proxy) 0x4341...1C4e                    │                  │
│  │  impl: SuperstateTokenV5_1 (VERSION "5")             │                  │
│  │                                                       │                  │
│  │  Admin (owner only):                                  │                  │
│  │  ├── mint() / bulkMint()                              │                  │
│  │  ├── adminBurn(address, amount)                       │                  │
│  │  ├── pause() / unpause()                              │                  │
│  │  ├── accountingPause() / accountingUnpause()          │                  │
│  │  ├── setOracle(newOracle)                             │                  │
│  │  ├── setRedemptionContract(newContract)               │                  │
│  │  ├── setStablecoinConfig(stablecoin, dest, fee)       │                  │
│  │  ├── setChainIdSupport(chainId, supported)            │                  │
│  │  └── setMaximumOracleDelay(delay)                     │                  │
│  │                                                       │                  │
│  │  User functions (AllowList-gated):                    │                  │
│  │  ├── subscribe(to, amount, stablecoin)                │                  │
│  │  ├── offchainRedeem(amount)                           │                  │
│  │  ├── bridge(amount, dest, chainId)                    │                  │
│  │  └── transfer / transferFrom                          │                  │
│  └──────────┬──────────┬─────────────┬──────────────────┘                  │
│             │          │             │                                       │
│        reads│     reads│        reads│                                       │
│             ▼          ▼             ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                      PROTOCOL LAYER                                         │
│                                                                             │
│  ┌───────────────────┐  ┌──────────────────────┐  ┌─────────────────────┐  │
│  │ AllowList V3.1     │  │ SuperstateOracle     │  │ RedemptionIdle      │  │
│  │ (Proxy) 0x02f1..e5│  │ 0xe4fa..28a8         │  │ (Proxy) 0x4c21..cf  │  │
│  │                    │  │ (NOT a proxy)        │  │                     │  │
│  │ Admin:             │  │                      │  │ Admin (owner):      │  │
│  │ ├ setEntityId..()  │  │ Admin (owner):       │  │ ├ pause/unpause()   │  │
│  │ ├ setEntity..Pub() │  │ ├ addCheckpoint()    │  │ ├ setRedemptionFee()│  │
│  │ ├ setEntity..Priv()│  │ ├ addCheckpoints()   │  │ ├ setSweepDest()    │  │
│  │ ├ setProtocol..()  │  │ ├ setMaxAcceptable.. │  │ ├ setMaxOracleDelay │  │
│  │ └ transferOwner()  │  │ └ transferOwner()    │  │ ├ withdraw()        │  │
│  │                    │  │                      │  │ └ transferOwner()   │  │
│  │ Gating:            │  │ Exposes:             │  │                     │  │
│  │ isAddressAllowed   │  │ latestRoundData()    │  │ User:               │  │
│  │ ForFund("USTB")    │  │ (Chainlink-compat)   │  │ └ redeem(amount)    │  │
│  │ hasAnyProtocol     │  │                      │  │                     │  │
│  │ Permissions()      │  │ NAV: $11.045/share   │  │ USDC bal: ~$1.7M    │  │
│  └───────────────────┘  │ Expiry: 5 days       │  │ Oracle delay: 1h    │  │
│                          └──────────────────────┘  │ Fee: 0              │  │
│                                                     └─────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                      EXTERNAL / UNDERLYING LAYER                            │
│                                                                             │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────────────────────┐   │
│  │ USDC       │  │ Chainlink    │  │ Off-chain                        │   │
│  │ 0xA0b8..48 │  │ NAV Feed     │  │ ├── UMB Bank (custodian)         │   │
│  │            │  │ 0x289B..AAC  │  │ ├── Federated Hermes (sub-adv)   │   │
│  │ Used for:  │  │              │  │ ├── Ernst & Young (auditor)       │   │
│  │ subscribe  │  │ Independent  │  │ ├── NAV Consulting (NAV agent)   │   │
│  │ redeem     │  │ NAV source   │  │ └── U.S. Treasury Bills (~95%)   │   │
│  └────────────┘  └──────────────┘  └───────────────────────────────────┘   │
│                                                                             │
│  Sweep destination (subscription + redemption USDC):                        │
│  EOA 0x774A...8807                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Proxy Upgrade Paths

Each proxy can be upgraded immediately (no timelock) by its ProxyAdmin owner:

| Proxy | ProxyAdmin | Owner (EOA) | Functions |
|-------|-----------|-------------|-----------|
| USTB Token `0x4341...1C4e` | `0xb9d2...2146` | `0xad30...ca83` | `upgrade()`, `upgradeAndCall()`, `changeProxyAdmin()` |
| AllowList `0x02f1...38e5` | `0xb819...c610` | `0x7747...2bfe` | `upgrade()`, `upgradeAndCall()`, `changeProxyAdmin()` |
| RedemptionIdle `0x4c21...54cf` | `0xcaba...e869` | `0x8cf4...0765` | `upgrade()`, `upgradeAndCall()`, `changeProxyAdmin()` |

The Oracle (`0xe4fa...28a8`) is **not a proxy** and cannot be upgraded. However, the USTB Token owner can replace it entirely via `setOracle(newAddress)`.
