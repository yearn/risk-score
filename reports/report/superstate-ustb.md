# Protocol Risk Assessment: Superstate USTB

- **Assessment Date:** March 5, 2026
- **Token:** USTB (Superstate Short Duration U.S. Government Securities Fund)
- **Chain:** Ethereum
- **Token Address:** [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)
- **Final Score: 2.23/5.0**

## Overview + Links

USTB is a tokenized investment fund issued by Superstate Inc. that provides exposure to short-duration U.S. Treasury Bills and Agency securities. The fund's investment objective is to seek current income consistent with liquidity and stability of principal, targeting returns in line with the federal funds rate.

USTB uses a **price appreciation model** (non-rebasing) — each USTB token represents one share in the fund, and the NAV per share increases daily as interest income from Treasury Bills accrues. The token price has grown from ~$10.00 at inception (February 2024) to ~$11.00 as of March 2026.

Investors undergo KYC/AML onboarding, get their wallet addresses whitelisted on the AllowList smart contract, and can then subscribe (mint) or redeem (burn) USTB tokens via USDC or USD. On-chain atomic subscription and redemption is available through the Protocol Mint and Redeem system, with a ~$10M USDC instant redemption facility refilled regularly.

The fund is structured as a series of **Superstate Asset Trust**, a **Delaware Statutory Trust**, providing bankruptcy remoteness from Superstate Inc. The sub-advisor is **Federated Hermes**, the custodian is **UMB Bank** (OCC-regulated), and the auditor is **Ernst & Young**.

- **Current NAV/Share:** ~$11.00
- **On-chain Supply (Ethereum):** ~55.49M USTB (~$610M on-chain)
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
- [Chainlink USTB NAV/Share Feed](https://data.chain.link/feeds/ethereum/mainnet/ustb-nav)
- [RWA.xyz](https://app.rwa.xyz/assets/USTB)
- [Etherscan Token Page](https://etherscan.io/token/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e)

## Contract Addresses

| Contract | Address |
|----------|---------|
| USTB Token (Proxy) | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) |
| USTB Implementation (SuperstateTokenV5_1) | [`0x1f50a1ee0ec8275d0c83b7bb08896b4b47d6e8c4`](https://etherscan.io/address/0x1f50a1ee0ec8275d0c83b7bb08896b4b47d6e8c4) |
| ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) |
| AllowList V3 (Proxy) | [`0x02f1fa8b196d21c7b733eb2700b825611d8a38e5`](https://etherscan.io/address/0x02f1fa8b196d21c7b733eb2700b825611d8a38e5) |
| AllowList V3 Implementation | [`0x2f67d98bd20d9580f52efa5ff70edaed9f2f316d`](https://etherscan.io/address/0x2f67d98bd20d9580f52efa5ff70edaed9f2f316d) |
| AllowList V3 ProxyAdmin | [`0xb819692a58db9dd4d3b403a875439b6ca155c610`](https://etherscan.io/address/0xb819692a58db9dd4d3b403a875439b6ca155c610) |
| Superstate Continuous Price Oracle | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) |
| Chainlink USTB NAV/Share Oracle | [`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC) |
| RedemptionIdle (Proxy) | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) |
| Token Owner (EOA) | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) |
| ProxyAdmin Owner (EOA) | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) |
| AllowList V3 Owner (EOA) | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) |

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

- **Fund Launch:** February 2024 on Ethereum (~13 months in production)
- **Contract Deployment:** December 6, 2023 (block 18,725,909)
- **Contract Upgrades:** Token has been upgraded through 5 versions (V1→V5_1), AllowList through 3 versions (V1→V3). Each upgrade was audited prior to deployment.
- **Smart Contract Exploits:** None. No security incidents, hacks, or exploits reported.
- **Price History:** NAV/Share has increased monotonically from ~$10.00 (inception) to ~$11.00 (March 2026), consistent with steady Treasury yield accrual. ATL: $10.29 (Feb 2025), ATH: ~$11.00 (current).
- **AUM Growth:**
  - Feb 2024: Launch
  - Oct 2024: ~$114M (per LlamaRisk report)
  - Mar 2025: ~$300M allocated by Spark alone
  - Mar 2026: ~$650M+ total AUM, ~$572M on-chain TVL (DeFiLlama)
- **Holder Distribution:** ~70 on-chain holders on Ethereum. Top 10 holders hold ~83.5% of supply. This concentration is expected for an institutional-grade permissioned fund. Top holders include EOAs (institutional investors) and smart contracts (DeFi integrations).
- **Incidents:** None. No hacks, exploits, or adverse events involving Superstate or USTB.
- **Compound Lawsuit (indirect):** Co-founder Robert Leshner faces a pending securities class action related to Compound Labs (COMP token classification). This is Compound-specific and does not directly involve Superstate.

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
  - **On-chain atomic:** Via RedemptionIdle contract, burns USTB and sends USDC at Continuous NAV/S price. ~$10M USDC instant redemption facility, regularly replenished.
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

- **NAV/Price Updates:** The Superstate Continuous Price Oracle ([`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8)) extrapolates real-time prices using linear interpolation between NAV/S checkpoints. Updates every second, 24/7/365. Compatible with Chainlink AggregatorV3Interface.
- **Chainlink NAV Feed:** Chainlink provides an independent NAV/Share data feed ([`0x289B5036cd942e619E1Ee48670F98d214E745AAC`](https://etherscan.io/address/0x289B5036cd942e619E1Ee48670F98d214E745AAC)).
- **On-chain Supply:** Total USTB supply is verifiable on-chain via `totalSupply()`.
- **Off-chain Assets:** The underlying Treasury portfolio is held off-chain at UMB Bank. Token holders cannot independently verify the specific Treasury holdings on-chain. However:
  - Independent NAV calculation by NAV Consulting/NAV Fund Services
  - Annual audit by Ernst & Young
  - Chainlink Proof of Reserves was in development (per LlamaRisk, Oct 2024)
  - Redundant record-keeping across fund calculation agent, internal records, and on-chain records
- **Reserve Transparency:** USTB publishes daily NAV and transparent holdings via the Superstate website and investor portal. The fund is structured under SEC exemptions with regulatory reporting requirements.

## Liquidity Risk

- **Primary Exit:** On-chain atomic redemption via RedemptionIdle contract at Continuous NAV/S price. ~$10M USDC instant redemption capacity, regularly refilled.
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

**On-chain verification (March 2026):** Confirmed that DeFi protocols integrating USTB (e.g., Midas RedemptionVault at [`0x569d7dccbf6923350521ecbc28a555a500c4f0ec`](https://etherscan.io/address/0x569d7dccbf6923350521ecbc28a555a500c4f0ec), Frax FrxUSDCustodian at [`0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33`](https://etherscan.io/address/0x5fbaa3a3b489199338fbd85f7e3d444dc0504f33)) are individually whitelisted on the AllowList with assigned entity IDs. Maple Finance's protocol contracts are NOT whitelisted — Maple's USTB collateral is held by borrowers in their own wallets as off-chain collateral arrangements, not locked in Maple smart contracts.

## Centralization & Control Risks

### Governance

**Governance Model:** Fully centralized — Superstate Inc. controls all administrative functions. No on-chain governance, no DAO, no community voting.

**Key Privileged Roles (verified on-chain, March 2026):**

| Role | Address | Type | Powers |
|------|---------|------|--------|
| Token Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | **EOA** | `mint`, `bulkMint`, `adminBurn`, `pause`/`unpause`, `accountingPause`/`accountingUnpause`, `setOracle`, `setStablecoinConfig`, `setRedemptionContract`, `setChainIdSupport` |
| ProxyAdmin Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | **EOA** (same as above) | Can upgrade USTB token implementation to arbitrary new code |
| AllowList V3 Owner | [`0x7747940adbc7191f877a9b90596e0da4f8deb2fe`](https://etherscan.io/address/0x7747940adbc7191f877a9b90596e0da4f8deb2fe) | **EOA** | Can add/remove addresses from AllowList, set entity permissions, set protocol permissions |

**Critical centralization concerns:**

1. **EOA-controlled administration** — Both the token owner and ProxyAdmin owner are the **same EOA** (`0xad30...ca83`). There is no multisig, no timelock, and no governance delay. A single private key controls minting, burning from any address, pausing all operations, changing the oracle, and upgrading the contract implementation.
2. **Admin burn capability** — The owner can call `adminBurn(address, uint256)` to forcibly burn tokens from any holder's address. This is documented as being for "exogenous legal circumstances" (regulatory compliance).
3. **No timelock on any operation** — Contract upgrades, parameter changes, and critical admin functions execute immediately with no delay period for users to react.
4. **AllowList control** — Removing an address from the AllowList effectively freezes their tokens (they cannot transfer or redeem). This is a compliance feature but also a centralization vector.

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
- **Documentation:** Comprehensive docs at docs.superstate.com covering fund mechanics, legal structure, smart contracts, security. Actively maintained.
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
| USTB Token | [`0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e`](https://etherscan.io/address/0x43415eB6ff9DB7E26A15b704e7A3eDCe97d31C4e) | Token state | `Mint`, `AdminBurn`, `OffchainRedeem`, `Bridge`, `SubscribeV2`, `Paused`/`Unpaused`, `AccountingPaused`/`AccountingUnpaused`, `totalSupply()` |
| Continuous Price Oracle | [`0xe4fa682f94610ccd170680cc3b045d77d9e528a8`](https://etherscan.io/address/0xe4fa682f94610ccd170680cc3b045d77d9e528a8) | NAV pricing | `latestRoundData()`, checkpoint updates |
| AllowList V3 | [`0x02f1fa8b196d21c7b733eb2700b825611d8a38e5`](https://etherscan.io/address/0x02f1fa8b196d21c7b733eb2700b825611d8a38e5) | Permission changes | Entity/protocol permission changes, address additions/removals |
| RedemptionIdle | [`0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf`](https://etherscan.io/address/0x4c21b7577c8fe8b0b0669165ee7c8f67fa1454cf) | Redemption liquidity | USDC balance (redemption capacity), large redemptions |
| ProxyAdmin | [`0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146`](https://etherscan.io/address/0xb9d285dcad879513dc9c1a3b2e0cccb21c3c2146) | Implementation upgrades | `Upgraded` events on proxy contracts |
| Token Owner | [`0xad309bb6f13074128b4f23ef9ea2fe8552afca83`](https://etherscan.io/address/0xad309bb6f13074128b4f23ef9ea2fe8552afca83) | Admin actions | `SetOracle`, `SetStablecoinConfig`, `SetRedemptionContract`, ownership transfer proposals |

### Critical Monitoring Points

- **NAV/Share:** Track Continuous Price Oracle and Chainlink feed — should increase monotonically. Alert on any decrease (would indicate fund losses).
- **Admin Burns:** Monitor `AdminBurn` events — forced burns from holder addresses are a critical event.
- **Pause Events:** Monitor `Paused`/`Unpaused` and `AccountingPaused`/`AccountingUnpaused` events.
- **Contract Upgrades:** Monitor ProxyAdmin for implementation changes on USTB token and AllowList.
- **Oracle Changes:** Monitor `SetOracle` events — changing the price oracle affects subscription/redemption pricing.
- **AllowList Changes:** Monitor permission changes, especially protocol address permissions (DeFi integrations).
- **Redemption Capacity:** Monitor RedemptionIdle USDC balance — depletion could temporarily disable instant on-chain redemption.
- **Large Supply Changes:** Alert on mints/burns >5% of total supply in 24h.
- **Recommended Frequency:** Hourly for NAV/pause/admin events. Daily for AllowList and redemption capacity.

## Risk Summary

### Key Strengths

1. **Safest underlying asset class** — 95%+ invested in U.S. Treasury Bills, the lowest-risk financial instrument globally, backed by the full faith and credit of the U.S. government
2. **Exceptional audit coverage** — 11 audits from 3 firms (0xMacro, ChainSecurity, Offside Labs) plus Certora formal verification, with ongoing audit relationship as code evolves
3. **Institutional-grade service providers** — UMB Bank (OCC-regulated custodian), Federated Hermes (sub-advisor, $800B+ AUM), Ernst & Young (auditor), NAV Consulting (independent NAV)
4. **Strong team and backing** — Compound Finance founders, $100.5M raised from Bain Capital Crypto, Distributed Global, Brevan Howard, Galaxy Digital, Haun Ventures
5. **Bankruptcy-remote legal structure** — Delaware Statutory Trust with inter-series liability protection, SEC-regulated framework
6. **Large AUM** — $650M+ with strong institutional adoption (Spark $300M, Aave Horizon, M^0)

### Key Risks

1. **EOA-controlled admin** — Single EOA controls token minting, forced burning, pausing, oracle changes, and proxy upgrades. No multisig, no timelock. This is the most significant centralization risk.
2. **Off-chain assets** — Underlying Treasury portfolio held off-chain at UMB Bank. Token holders cannot independently verify holdings on-chain. Must rely on NAV agent, auditor, and regulatory framework.
3. **No DEX liquidity** — Exit exclusively through Superstate's mint/redeem system. No secondary market. Transfer restricted to allowlisted addresses only.
4. **No formal bug bounty rewards** — Researchers explicitly told not to expect compensation for vulnerability discoveries.
5. **Permissioned access** — Only Qualified Purchasers ($5M+) who pass KYC can hold or transfer USTB. Limits DeFi composability.

### Critical Risks

- **AllowList freeze risk** — If Superstate removes an address from the AllowList, the holder's tokens are **completely frozen with zero exit paths**. No transfers, no redemption, no DEX fallback. For DeFi protocols integrating USTB, this means Superstate has unilateral power to freeze an entire protocol's USTB position. This is the most critical risk for Yearn's use case.
- **Private key compromise of admin EOA** — A single compromised key (`0xad30...ca83`) could upgrade the contract to malicious code, mint unlimited tokens, or burn tokens from any address, all with no delay. Mitigated by Turnkey secure enclaves but fundamentally a single point of failure.
- **Admin burn capability** — The `adminBurn()` function can confiscate tokens from any holder. While documented as a regulatory compliance tool, this gives Superstate unilateral power over user funds.
- **No upgrade delay** — Contract upgrades execute immediately with no timelock for users or protocols (like Aave, Morpho, Spark) to react.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** → **PASS** — 11 audits by 3 firms + Certora formal verification. Exceptional coverage.
- [x] **Unverifiable reserves** → **PASS** — Off-chain reserves, but verified by independent NAV agent (NAV Consulting), annual EY audit, SEC regulatory framework, bankruptcy-remote trust structure. Chainlink NAV feed provides on-chain pricing. Not fully on-chain verifiable, but multiple independent verification layers.
- [x] **Total centralization** → **BORDERLINE PASS** — Single EOA controls all admin functions with no multisig or timelock. However, Superstate is a U.S. corporation under SEC regulation, with registered transfer agent status, institutional custodian, and institutional-grade key management via Turnkey secure enclaves. The regulatory accountability and legal framework provide off-chain governance guarantees that partially compensate for the lack of on-chain governance.

**Result:** Protocol passes critical gates. Proceeding to category scoring with conservative bias on centralization.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **1.5**

| Aspect | Assessment |
|--------|-----------|
| Audits | 11 audits by 3 firms (0xMacro ×9, ChainSecurity, Offside Labs) + Certora formal verification. Continuous audit relationship — each version audited before deployment. |
| Bug Bounty | Self-hosted, no formal monetary rewards. Weaker than Immunefi-style programs. |
| Time in Production | Fund: ~13 months (Feb 2024). Contracts: ~15 months (Dec 2023). Multiple version upgrades, all audited. |
| TVL | ~$650M+ total AUM, ~$572M on-chain TVL |
| Historical Incidents | None. No security incidents, exploits, or adverse events. |

Exceptional audit coverage (11 audits + formal verification) is among the strongest in the RWA space. Clean operational history with significant AUM. The lack of a formal bug bounty with monetary rewards prevents a perfect score.

**Score: 1.5/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **3.0**

**Subcategory A: Governance — 4.0**

- **Single EOA** (`0xad30...ca83`) controls all admin functions (mint, adminBurn, pause, oracle, stablecoin config) AND proxy upgrades. No multisig.
- **No timelock** on any operation — upgrades, parameter changes, and critical functions execute immediately
- No on-chain governance, no DAO, no community voting
- AllowList controlled by a separate EOA (`0x7747...1bfe`) — also no multisig
- **Positive:** Turnkey secure enclaves for key management, two-step ownership transfer, renounceOwnership disabled
- **Positive:** Regulatory accountability — Superstate is a U.S. corporation with SEC-registered transfer agent, subject to securities law enforcement
- Despite regulatory mitigations, the on-chain governance structure is a single EOA with unchecked power

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

**Score: (4.0 + 2.0 + 2.0) / 3 = 2.67 → 3.0/5** — Rounded up to 3.0 due to the severity of the EOA-with-no-timelock governance issue, which is the dominant risk factor. While external dependencies and programmability are strong, the governance centralization drags the overall category.

#### Category 3: Funds Management (Weight: 30%) — **1.75**

**Subcategory A: Collateralization — 1.5**

- U.S. Treasury Bills are the **safest underlying asset class** — backed by the full faith and credit of the U.S. government
- Fund structured as a bankruptcy-remote Delaware Statutory Trust with inter-series liability protection
- UMB Bank (OCC-regulated) as qualified custodian
- Federated Hermes as institutional sub-advisor managing the portfolio
- At least 95% in Treasuries, up to 5% cash for liquidity
- Virtually zero credit risk on the underlying assets

**Subcategory B: Provability — 2.0**

- NAV calculated independently by NAV Consulting/NAV Fund Services (third party)
- Annual audit by Ernst & Young
- Chainlink NAV/Share feed provides independent on-chain pricing
- Superstate Continuous Price Oracle provides real-time extrapolation
- Daily NAV and holdings published via website/investor portal
- SEC regulatory reporting requirements
- Redundant record-keeping: fund agent records + internal records + on-chain records
- However: underlying Treasury holdings are off-chain and cannot be independently verified on-chain by token holders
- Chainlink Proof of Reserves was in development (per LlamaRisk, Oct 2024) but not yet confirmed live

**Score: (1.5 + 2.0) / 2 = 1.75/5** — The safest possible underlying asset (U.S. Treasuries) with institutional-grade custody and independent verification layers. Off-chain holdings prevent on-chain verifiability but multiple independent parties provide oversight.

#### Category 4: Liquidity Risk (Weight: 15%) — **3.0**

- On-chain atomic redemption at NAV/S price via RedemptionIdle (~$10M USDC instant capacity)
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
            = (1.5 × 0.20) + (3.0 × 0.30) + (1.75 × 0.30) + (3.0 × 0.15) + (1.0 × 0.05)
            = 0.30 + 0.90 + 0.525 + 0.45 + 0.05
            = 2.225
            ≈ 2.23
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 1.5 | 20% | 0.30 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 1.75 | 30% | 0.525 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 1.0 | 5% | 0.05 |
| **Final Score** | | | **2.23 / 5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | **Approved with standard monitoring** |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: LOW RISK**

USTB benefits from the safest possible underlying asset class (U.S. Treasury Bills), exceptional audit coverage, institutional-grade service providers, and a strong legal structure. The primary risk factor is the centralized admin (single EOA with no multisig or timelock), which is partially mitigated by regulatory accountability, secure key management, and the institutional framework around the fund.

**Key conditions for exposure:**

1. Monitor for any admin EOA changes (ownership transfer events)
2. Monitor for contract upgrades (ProxyAdmin events)
3. Monitor oracle changes and NAV/Share feed for anomalies
4. Monitor RedemptionIdle USDC balance for redemption capacity
5. Verify Superstate's regulatory standing periodically (SEC filings, transfer agent status)

**Score-improving triggers:**

- **Multisig adoption:** If Superstate transitions admin control from EOA to a multisig (even a team-internal multisig), the Centralization score would improve significantly
- **Timelock:** Adding a timelock on contract upgrades and critical parameter changes would reduce the governance risk
- **Chainlink Proof of Reserves:** If deployed, would improve the Provability sub-score
- **Formal bug bounty:** Launching a funded bug bounty on Immunefi would improve the Audits score

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (September 2026) — longer interval given the stability of the underlying asset and regulatory framework
- **TVL-based:** Reassess if AUM changes by more than 50%
- **Incident-based:** Reassess after any exploit, admin key compromise, contract upgrade, governance change, or regulatory action
- **Governance-based:** Reassess if Superstate adopts multisig, timelock, or other governance improvements (potential score improvement)
- **Regulatory-based:** Reassess if SEC takes enforcement action or Superstate's regulatory status changes (transfer agent, ERA)
- **Compound lawsuit:** Reassess if the Compound securities class action ruling creates material impact on Superstate's leadership

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
