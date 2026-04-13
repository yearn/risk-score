# Protocol Risk Assessment: Midas mHYPER

- **Assessment Date:** February 7, 2026 (updated April 9, 2026)
- **Token:** mHYPER
- **Chain:** Ethereum (also deployed on Monad, Plasma, Katana)
- **Token Address:** [`0x9b5528528656DBC094765E2abB79F293c21191B9`](https://etherscan.io/token/0x9b5528528656dbc094765e2abb79f293c21191b9)
- **Final Score: 2.9/5.0**

## Overview + Links

mHYPER is a tokenized certificate (Liquid Yield Token / LYT) issued by Midas Software GmbH, a German-incorporated tokenization platform. It references the performance of **market-neutral, stablecoin-focused strategies** managed by [Hyperithm](https://www.hyperithm.com/), a digital asset management firm based in Tokyo and Seoul.

mHYPER is **not** a stablecoin — its value floats based on strategy performance. Yield is auto-compounded into the token price (NAV), updated onchain twice per week via a custom oracle (see [oracle history](https://etherscan.io/address/0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68)). The token has appreciated from $1.00 at inception to ~$1.089 as of April 2026.

The yield strategy includes:

- Leveraged USDe positions on **Aave**
- Stablecoin farming on **Pendle**
- Basis trading on **Hyperliquid**
- Liquidity provision on **Morpho** vaults
- Carry trades, liquidation arbitrage, reward farming

Legally, mHYPER tokens are structured as **subordinated debt instruments** of Midas Software GmbH. Midas operates [two issuance structures](https://docs.midas.app/legal/legal-structure): a **Luxembourg securitisation** vehicle with statutory asset segregation and bankruptcy remoteness, and a **German GmbH** structure. mHYPER uses the **German GmbH structure**.

**Key Stats:**

- **mHYPER Market Cap:** ~$50.7M (total NAV across all chains per [attestation report](https://drive.google.com/drive/folders/1MJi_xq8aR0TaL0DJw6Q91SFxM_z0OcYZ), April 7, 2026)
- **Total Supply:** ~46,590,889 mHYPER across 4 chains (Ethereum ~41.5M, Monad ~2.5M, Katana ~1.8M, Plasma ~717K)
- **Holders:** ~467 addresses (Ethereum only)
- **APY:** ~9.24%
- **Midas Platform TVL:** ~$368M [SumCap tracker](https://midas.sumcap.xyz/), [DeFiLlama](https://defillama.com/protocol/midas-rwa) doesn't count all positions
- **KYC Required:** Yes (greenlist enforced onchain)

**Links:**

- [Midas Documentation](https://docs.midas.app/)
- [Midas App - mHYPER](https://midas.app/mhyper)
- [Hyperithm Website](https://www.hyperithm.com/)
- [Legal Documents](https://docs.midas.app/resources/legal-product-documentation/mhyper)
- [mHYPER Transparency Page](https://midas.app/transparency?token=mhyper)

## Contract Addresses

All contracts use OpenZeppelin's `TransparentUpgradeableProxy` pattern with a shared `ProxyAdmin`.


| Contract                                     | Proxy Address                                                                                                         | Implementation Address                                                                                                |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **mHYPER Token**                             | [0x9b5528528656DBC094765E2abB79F293c21191B9](https://etherscan.io/address/0x9b5528528656DBC094765E2abB79F293c21191B9) | [0xE4386180dF7285E7D78794148E1B31c9EDfb0689](https://etherscan.io/address/0xE4386180dF7285E7D78794148E1B31c9EDfb0689) |
| **mHYPER/USD Oracle** (CustomAggregatorFeed) | [0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68](https://etherscan.io/address/0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68) | [0xFcA6c2087e6321385745f3080D586d088a7f707f](https://etherscan.io/address/0xFcA6c2087e6321385745f3080D586d088a7f707f) |
| **mHYPER DataFeed**                          | [0x92004DCC5359eD67f287F32d12715A37916deCdE](https://etherscan.io/address/0x92004DCC5359eD67f287F32d12715A37916deCdE) | [0xE3240302aCEc5922b8549509615c16a97C05654A](https://etherscan.io/address/0xE3240302aCEc5922b8549509615c16a97C05654A) |
| **DepositVault**                             | [0x6Be2f55816efd0d91f52720f096006d63c366e98](https://etherscan.io/address/0x6Be2f55816efd0d91f52720f096006d63c366e98) | [0x570C15bC5faF98531A8b351d69E22E41e3505E47](https://etherscan.io/address/0x570C15bC5faF98531A8b351d69E22E41e3505E47) |
| **RedemptionVaultWithSwapper**               | [0xbA9FD2850965053Ffab368Df8AA7eD2486f11024](https://etherscan.io/address/0xbA9FD2850965053Ffab368Df8AA7eD2486f11024) | [0xd2B5f8f1DED3D6e00965b8215b57A33c21101c63](https://etherscan.io/address/0xd2B5f8f1DED3D6e00965b8215b57A33c21101c63) |
| **MidasAccessControl**                       | [0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) | [0xDd5a54bA2ab379a5e642c58f98ad793a183960e2](https://etherscan.io/address/0xDd5a54bA2ab379a5e642c58f98ad793a183960e2) |
| **ProxyAdmin** (shared)                      | [0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC) | N/A                                                                                                                   |
| **Tokens Receiver**                          | [0xF356c5e9F69DaDB332Bb098C7Ed960Db1d3376DD](https://etherscan.io/address/0xF356c5e9F69DaDB332Bb098C7Ed960Db1d3376DD) | N/A                                                                                                                   |
| **Deployer**                                 | [0xa0819ae43115420beb161193b8d8ba64c9f9facc](https://etherscan.io/address/0xa0819ae43115420beb161193b8d8ba64c9f9facc) | N/A                                                                                                                   |


**Other Chain Deployments:**

- **mHYPER (Monad):** [`0xd90f6bfed23ffde40106fc4498dd2e9edb95e4e7`](https://monadscan.com/address/0xd90f6bfed23ffde40106fc4498dd2e9edb95e4e7)
- **mHYPER (Plasma):** `0xb31bea5c2a43f942a3800558b1aa25978da75f8a`
- **mHYPER (Katana):** [`0x926a8a63Fa1e1FDBBEb811a0319933B1A0F1EDbb`](https://katanascan.com/address/0x926a8a63Fa1e1FDBBEb811a0319933B1A0F1EDbb)

## Audits and Due Diligence Disclosures

- [Midas Audits](https://docs.midas.app/resources/audits)
- [Hacken Audit Report](https://hacken.io/audits/midas/sca-midas-vault-dec2023/)
- [Sherlock Audit Contest #1 (May 2024)](https://audits.sherlock.xyz/contests/332)
- [Sherlock Audit Contest #2 (Aug 2024)](https://github.com/sherlock-audit/2024-08-midas-minter-redeemer-judging)

**Audit Status:** Extensive — 10 audits across 2023-2025 cover the Midas core contracts (vaults, tokens, access control, bridges, oracles). mHYPER is an implementation of these audited contracts. The 2025 audits cover the current core contracts.

**2025 Audits:**

| Audit | Firm | Scope | Link |
|-------|------|-------|------|
| Midas Core Contracts (2025) | **Côme** | Core contracts | [Report](https://docs.midas.app/resources/audits/come-midas-core-contracts-2025) |
| Midas Core Contracts Contest (2025) | **Sherlock** | Core contracts | [Contest](https://docs.midas.app/resources/audits/sherlock-midas-core-contracts-2025) |

**2024 Audits:**

| Audit | Firm | Scope | Link |
|-------|------|-------|------|
| Midas Core Contracts (2024) | **Hacken** | Core contracts | [Report](https://docs.midas.app/resources/audits/hacken-midas-core-contracts-2024) |
| Midas Core Contracts Contest (2024) | **Sherlock** | DepositVault, RedemptionVault, MidasAccessControl, DataFeed | [Contest](https://docs.midas.app/resources/audits/sherlock-midas-core-contracts-2024) |
| Issuance & Redemption Vaults | **Sherlock** | Instant mint/redeem, BUIDL integration, new oracles | [Contest](https://docs.midas.app/resources/audits/sherlock-issuance-redemption-2024) |
| Bridge Integrations | **Sherlock** | LayerZero & Axelar bridge integrations | [Contest](https://docs.midas.app/resources/audits/sherlock-bridge-integrations-2024) |
| Oracle System | **Sherlock** | Oracle infrastructure | [Contest](https://docs.midas.app/resources/audits/sherlock-oracle-system-2024) |
| Legacy Tokens & Vaults | **Sherlock** | Legacy components | [Contest](https://docs.midas.app/resources/audits/sherlock-legacy-tokens-2024) |
| Midas Contracts (2024) | **Côme** | Contracts | [Report](https://docs.midas.app/resources/audits/come-midas-contracts-2024) |

**2023 Audits:**

| Audit | Firm | Scope | Link |
|-------|------|-------|------|
| Midas Contracts (2023) | **Hacken** | mTBILL token, DepositVault, RedemptionVault, ManageableVault, access control (15 contracts) | [Report](https://docs.midas.app/resources/audits/hacken-midas-contracts-2023) |

**Hacken Audit Results (Dec 2023):**

- Security Score: 10/10 (post-fix). 100% branch coverage
- 0 Critical, 1 High (Accepted — USD tokens with custom decimals), 2 Medium (1 fixed: missing oracle refresh; 1 accepted: 1:1 price assumption), 1 Low (permissive role for token burning — accepted), 4 Observations
- **Critical note:** Auditors explicitly flagged the protocol as **"highly centralized"** with system admins controlling all critical roles

**Sherlock Core Contracts Contest (2024):**

- 1 High (blacklist bypass via `renounceRole` — acknowledged), 2 Medium (corruptible upgradability pattern — fixed; excessive vault admin permissions — acknowledged)

**Sherlock Issuance & Redemption Contest (2024):**

- 1 High (reclassified to Medium — RedemptionVaultWithBUIDL initialization DoS), 6 Medium (BUIDL balance handling, standard redemption allowance gaps, spec/code discrepancies)

**Smart Contract Complexity:** Low-Moderate

- mHYPER extends mTBILL (simple ERC-20 with pausable, role-controlled mint/burn)
- Standard OpenZeppelin TransparentUpgradeableProxy pattern
- Custom oracle (CustomAggregatorFeed) wrapping Chainlink's AggregatorV3 interface — **not** a Chainlink data feed
- Role-based access control via shared MidasAccessControl contract

### Bug Bounty

- **$1,000,000 USD** total allocated across two platforms ([Midas docs](https://docs.midas.app/security/smart-contract-security)):
  - **[Sherlock Bug Bounty](https://audits.sherlock.xyz/bug-bounties/122)** — Live since March 31, 2026. Max payout: $500,000 USDC. Tiers: Critical $25K-$500K (10% of affected funds), High $5K-$25K, Medium $5K, Low $500-$1K. Covers Ethereum (`contracts/**/*.sol`) and Solana (`programs/**/*.rs`)
  - **[Cantina Bug Bounty](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1)** — Live since March 23, 2026. Max payout: $500,000. Tiers: Critical $500K, High $25K, Medium $5K, Low $1K

## Historical Track Record

- **Production History:** mHYPER token created on Ethereum [July 15, 2025](https://etherscan.io/tx/0x8dd0b1216e7970be06bd897ed57ebfba3f4213ec63d68aa622740608e93ffd5f) (~9 months in production). Midas platform launched with mTBILL in mid-2024 (~22 months total)
- **TVL Growth:** Midas grew from ~$4M (July 2024) to ~$275M (February 2026), now ~$216.6M (April 2026)
- **mHYPER Market Cap:** ~$45M with ~467 holders
- **Price History:** mHYPER has traded between $1.024 (ATL, Sep 2025) and $1.089 (ATH, Apr 2026) — steady appreciation consistent with yield accrual. Oracle price: $1.08858 (round 78, last updated April 7, 2026)

**Hyperithm Track Record:**

- Founded January 2018 (7+ years operating history)
- Co-founded by Sangrok Oh (ex-Morgan Stanley) and Woojun Lloyd Lee (Forbes 30 Under 30)
- Backed by Coinbase Ventures, Samsung Next, Hashed, Kakao, Naver. $11M Series B (Aug 2021)
- Dual regulatory registration: SPBQII in Japan (FSA), VASP in South Korea (KoFIU)

## Funds Management

Hyperithm is the strategy manager for mHYPER, deploying funds across multiple DeFi protocols using market-neutral, stablecoin-focused strategies. Funds remain under Midas control via Fordefi custody.

- **Fund Manager:** Hyperithm (Tokyo/Seoul, founded 2018, AUM $300M+)
- **Strategy:** Multi-chain stablecoin yield — leveraged USDe on Aave, farming on Pendle, basis trading on Hyperliquid, Morpho vault liquidity, carry trades, liquidation arbitrage. Per [transparency page](https://midas.app/transparency?token=mhyper) (April 10, 2026): Fluid 28.7%, Aave 21.6%, Kamino 19.3% (Solana lending), Morpho 15.0%, Pendle 14.7%, Wallet 0.7%, Hyperliquid/Lighter <0.1%. Total NAV ~$49.6M
- **Strategy Execution:** Offchain by Hyperithm with discretionary investment decisions
- **Custody:** Fordefi MPC custody with tri-party quorum per [Fordefi case study](https://web.fordefi.com/customer-stories/how-midas-brings-tokenized-investment-opportunities-on-chain-with-fordefis-defi-native-custody-2ti85) (Midas + Hyperithm + independent signer — operations outside predefined rules require all three parties). Blockaid co-signer provides automated onchain transaction monitoring and threat protection (per Midas). Fordefi is the primary custodian for LYT products; Midas also uses Fireblocks for other product lines
- **Monitoring:** NAV updates provided by Hyperithm, reviewed by Midas, then published onchain twice per week

### Accessibility

- **KYC Required:** Yes — users must complete KYC/AML screening (1-4 business days). Once approved, added to onchain greenlist via `Greenlistable` contract. Chainalysis Oracle integration for sanctions screening
- **Minting:** Deposit USDC, receive mHYPER tokens. Default mode is instant issuance
- **Redemption:** Two modes:
  - **Instant:** Atomic onchain at oracle price when liquidity is available, **0.50% instant redemption fee.**
  - **Standard:** 1-3 business day queue (fallback when instant capacity is insufficient). Subject to Risk Manager setting aside funds
- **Fees:** 0% management fee, 20% performance fee (from yield, earned by Midas), 0% standard mint/redeem fees, 0.50% instant redemption fee (earned by the mHYPER portfolio itself to compensate for cash drag from keeping redemption liquidity idle)
- **Geographic Restrictions:** Not available to US persons, UK, China, and sanctioned countries.

### Collateralization

- **Backing Model:** Offchain / hybrid — mHYPER is a **subordinated debt instrument** of Midas Software GmbH, not a direct claim on underlying assets
- **Collateral Quality:** Strategies target stablecoin-focused, market-neutral positions across Aave (blue-chip), Pendle (established), Hyperliquid (newer, centralized perps DEX), Morpho (established), Kamino (Solana). Includes leveraged positions and basis trading
- **Verifiability:** Mostly onchain — per Midas, ~96% of mHYPER strategy positions are held onchain and visible via the [transparency page](https://midas.app/transparency?token=mhyper); ~4% are held on CEX/offchain venues. Wallet-to-product attribution and the offchain component still depend on Midas/Hyperithm reporting and the Attestation Engine; the link between those wallets and mHYPER is not enforced by smart contracts
- **Risk Curation:** Hyperithm has discretion over allocation within the broad strategy framework. Midas enforces policy limits via Fordefi policy engine (address, asset, contract method, notional size)
- **Tri-Party Governance (via Fordefi):** Per [Fordefi case study](https://web.fordefi.com/customer-stories/how-midas-brings-tokenized-investment-opportunities-on-chain-with-fordefis-defi-native-custody-2ti85): Midas Treasury + Hyperithm (Asset Manager) + Independent Oversight Signer. Operations within predefined rules clear automatically; anything outside routes to tri-party quorum. No single group can act unilaterally for custody operations
- **Legal Structure:** LYT holders are **subordinate creditors** of Midas Software GmbH. mHYPER uses the German GmbH issuance structure — no statutory asset segregation or bankruptcy remoteness. Midas's Luxembourg securitisation vehicle offers these protections but is used for other products, not mHYPER

### Provability

- **Reserve Transparency:** Hybrid. Strategy wallets are partially onchain, but full portfolio composition requires offchain reporting. The [Midas Attestation Engine](https://docs.midas.app/transparency/the-midas-attestation-engine) (SAVE, introduced March 2026) adds a multi-party verification layer via three contracts: [KeystoneForwarder](https://etherscan.io/address/0x0b93082D9b3C7C97fAcd250082899BAcf3af3885) (Chainlink DON router), [SaveCreReceiverProxy](https://etherscan.io/address/0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6) (receiver), and [MidasSaveRegistryWithClaim](https://etherscan.io/address/0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d) (registry). The registry is a hash-only store: it records proof IDs, attestation hashes, claim hashes, verifier hashes, timestamps, and attestor/verifier addresses. It does **not** expose the actual reserve data, wallet balances, document content, or an onchain URI/CID that lets users retrieve the source artifact from the registry alone. Midas docs state that notarized source material is stored on IPFS, while public weekly PDF reports are available on [Google Drive](https://drive.google.com/drive/folders/1MJi_xq8aR0TaL0DJw6Q91SFxM_z0OcYZ). The onchain registry proves that a specific hash was attested and independently verified, but interpreting the underlying NAV/reserve data still depends on offchain-disclosed artifacts and links
- **NAV/Price Updates:** Token price updated **twice per week** by Midas via a privileged role on the `CustomAggregatorFeed` oracle. Current price: ~$1.089 (round 79, 8 decimals). The oracle enforces onchain bounds: `maxAnswerDeviation` of 0.35% per update (35000000 in 8-decimal precision), `minAnswer` of $0.10, and `maxAnswer` of $1,000 — providing tight deviation control per update. The oracle price is deterministic onchain at deposit time (users know the exact token amount). For standard redemptions, the price may update before processing — this ensures the payout accurately reflects current NAV, avoiding over/under-payment to either the redeemer or remaining holders. The Attestation Engine separately verifies and anchors NAV source-data hashes, but does not currently enforce oracle update correctness onchain
- **Verification Agent:** [The Attestation Engine](https://docs.midas.app/transparency/the-midas-attestation-engine) introduces **LlamaRisk** and **Canary Protocol** as independent third-party verifiers that confirm data origins, processes, and handling meet defined criteria
- **Third-Party Verification:** For Morpho integration, eOracle independently verifies and publishes pricing. Steakhouse applies market discounts for liquidation optimization. The Attestation Engine publishes verified hashes onchain via **Chainlink Runtime Environment**, replacing the previous self-generated attestation reports. The oracle wraps the Chainlink AggregatorV3 interface but the underlying price feed is **not** a Chainlink data feed

## Liquidity Risk

- **DEX Liquidity:** Negligible — ~$11.5K total on Uniswap V4 (mHYPER/USDC 0.2% pool). 24h volume effectively $0. Not a viable exit for any position size. DEX liquidity has declined ~64% since February 2026
- **Primary Exit:** Via Midas redemption vaults (instant or standard mode)
- **Instant Redemption:** 1-2% target capacity, topped up multiple times per day
- **Standard Redemption:** 1-3 business day queue when instant capacity is insufficient
- **Pendle:** ~$10.14M TVL in mHYPER Pendle pools across 5 markets (yield tokenization, not direct swap liquidity). Up from ~$5.53M in February
- **Stress Test:** mHYPER processed $150M+ in redemptions in 48 hours when Stream Finance unwound its $75M leveraged position. This is a positive signal for the redemption mechanism but required standard (non-instant) processing and active coordination
- **Large Holder Impact:** With ~467 holders and $45M market cap, average position is ~$96K. Large holders likely face multi-day standard redemption queues

## Centralization & Control Risks

### Governance

- **Contract Upgradeability:** Yes — all contracts use `TransparentUpgradeableProxy` with a shared `ProxyAdmin` at [`0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC`](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC)
- **ProxyAdmin Owner:** [`MidasTimelockController`](https://etherscan.io/address/0xE3EEe3e0D2398799C884a47FC40C029C8e241852) — a verified OpenZeppelin `TimelockController` with a **48-hour minimum delay**. Contract upgrades must be proposed, wait 48 hours, then executed
- **Timelock Proposer/Executor:** Gnosis Safe [`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89) — **1/3 onchain threshold** (any single Safe owner can propose/execute). The practical signer setup is stronger than a plain 1/3 EOA Safe, but part of that protection is offchain:
  - [`0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f`](https://etherscan.io/address/0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f) — EOA onchain. Per Midas, controlled by a Fordefi MPC policy with 3/n approvers — not verifiable onchain
  - [`0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7`](https://etherscan.io/address/0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7) — Nested Gnosis Safe (3/7)
  - [`0xC50BD8430545C80a681C7cb33E6560fB0Bd86880`](https://etherscan.io/address/0xC50BD8430545C80a681C7cb33E6560fB0Bd86880) — EOA onchain. Per Midas, controlled by a Fireblocks MPC policy with 3/n approvers — not verifiable onchain
- **Access Control:** Role-based via `MidasAccessControl` ([`0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B`](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B))
- **DEFAULT_ADMIN_ROLE holders:** Three addresses hold `DEFAULT_ADMIN_ROLE` on MidasAccessControl — **role changes (mint/burn/pause/blacklist grants) bypass the timelock** and can be executed immediately:
  - The 1/3 Gnosis Safe ([`0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89`](https://etherscan.io/address/0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89))
  - [`0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227`](https://etherscan.io/address/0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227) — EOA onchain. [Per Midas](https://docs.midas.app/security/smart-contract-security#midas-controller), Fordefi MPC (3/n) — not verifiable onchain
  - [`0x875c06a295c41c27840b9c9dfda7f3d819d8bc6a`](https://etherscan.io/address/0x875c06a295c41c27840b9c9dfda7f3d819d8bc6a) — EOA onchain. [Per Midas](https://docs.midas.app/security/smart-contract-security#midas-controller), Fireblocks MPC (3/n) — not verifiable onchain
  - **Any one of these three can grant/revoke any role with no timelock.** Midas states they are working on gating specific functions behind a timelock
- **Governance Model:** No onchain governance. Midas controls all admin functions
- **Privileged Roles:**
  1. **`M_HYPER_MINT_OPERATOR_ROLE`** (`0xe6046a6e8c55ddf579e30dbcefd2018a368c8b9d4836e839e4858921fb6305d7`) — Can mint unlimited mHYPER tokens. **The `mint()` function has no onchain collateral check** — it only verifies the caller has the mint role, then calls OpenZeppelin `_mint()` directly. Currently held by:
    - [`0x5683de280d0c3967fba2f04d707fa1ef5a044e25`](https://etherscan.io/address/0x5683de280d0c3967fba2f04d707fa1ef5a044e25) — EOA onchain. Per Midas, Fordefi MPC (3/n) used for operational processes — not verifiable onchain. Also holds BURN, PAUSE, BLACKLIST, and GREENLIST roles (5 total, all mHYPER-only). Nonce 0 (never sent a transaction). **Not listed as a mint role holder in [Midas security docs](https://docs.midas.app/security/smart-contract-security#role-based-access-control)** (docs only mention DepositVault and OFT bridge). All roles [granted](https://etherscan.io/tx/0x4254a910f7133d2ef54913662f19a0af1f9974d33391ca84ca8c60dffa025301) in a single batch on July 16, 2025
    - [`0xbA9FD2850965053Ffab368Df8AA7eD2486f11024`](https://etherscan.io/address/0xbA9FD2850965053Ffab368Df8AA7eD2486f11024) — DepositVault (mints when users deposit USDC)
    - [`0x148c86390a4ae6f7a02df5903bc0a89e8b4581a0`](https://etherscan.io/address/0x148c86390a4ae6f7a02df5903bc0a89e8b4581a0) — LayerZero OFT adapter (cross-chain bridge)
  2. **`M_HYPER_BURN_OPERATOR_ROLE`** — Can burn mHYPER tokens from any address. Currently held by the same EOA [`0x5683de280d0c3967fba2f04d707fa1ef5a044e25`](https://etherscan.io/address/0x5683de280d0c3967fba2f04d707fa1ef5a044e25), plus the RedemptionVault and LayerZero adapter
  3. **`M_HYPER_PAUSE_OPERATOR_ROLE`** — Can pause/unpause the contract (freezing all transfers)
  4. **`DEFAULT_ADMIN_ROLE`** — Can grant/revoke all other roles (held by 1/3 Safe + two standalone EOAs, no timelock). A compromised admin can grant itself the MINT role and mint unbacked tokens in two transactions
  5. **ProxyAdmin owner** — Can upgrade all contract implementations (via 48hr timelock)
  6. **Oracle updater** — Can set the NAV price via `CustomAggregatorFeed`. Currently held by EOA [`0xd1e01471f3e1002d4eec1b39b7dbd7aff952a99f`](https://etherscan.io/address/0xd1e01471f3e1002d4eec1b39b7dbd7aff952a99f) — a single EOA with no timelock on price updates. Onchain bounds: max 0.35% deviation per update, price range $0.10-$1,000
  7. **Blacklist operator** — Can blacklist addresses from interacting with the token
- **Fund Seizure / Unbacked Minting:** The mint operator can create tokens without depositing collateral (no onchain backing check). The burn operator can burn from any address. The blacklist/pause operators can freeze activity. Role grants bypass the timelock — any of the three `DEFAULT_ADMIN_ROLE` holders can grant themselves these roles immediately and unilaterally. `renounceRole` is disabled (always reverts)
- **Audit Assessment:** Hacken auditors explicitly flagged the protocol as **"highly centralized"** with system admins controlling all critical roles

### Programmability

- **System Operations:** Primarily offchain. Strategy execution, NAV calculation, and redemption processing are handled by Midas/Hyperithm offchain
- **Oracle/NAV Updates:** The `CustomAggregatorFeed` is updated twice per week by a privileged role. The Attestation Engine adds a programmatic verification layer via Chainlink CRE, but the onchain price update itself is still admin-triggered
- **PPS Definition:** The oracle price IS the PPS. It is updated by an admin role, not computed onchain from reserves. NAV source data is now independently checked through the Attestation Engine pipeline, but oracle updates are not computed or enforced by that registry
- **Off-Chain Dependencies:** Critical
  - Hyperithm's strategy execution and NAV reporting
  - Midas's redemption processing
  - KYC/AML verification (greenlist management)
  - Fordefi for MPC custody and transaction signing

### External Dependencies

- **Hyperithm (Critical):** Strategy management, NAV calculation, risk monitoring. Single external dependency for core value proposition. If Hyperithm fails or misreports, token holders have no onchain recourse
- **Fordefi (Critical):** MPC custody of underlying assets with tri-party MPC governance. All fund movements depend on it
- **Strategy Counterparties (Critical):**
  - **Fluid** — 28.7% of NAV, borrow/lend
  - **Aave** — 21.6% of NAV, leveraged USDe positions (blue-chip)
  - **Kamino** — 19.3% of NAV, Solana lending protocol (rebranded from Hubble Protocol, launched 2022)
  - **Morpho** — 15.0% of NAV, vault liquidity provision (established)
  - **Pendle** — 14.7% of NAV, yield token farming (established)
  - **Hyperliquid** — <0.1% of NAV, basis trading (newer, centralized perps DEX)
- **Stablecoin Dependencies:** USDC, USDe (Ethena) — depegging events could impact strategy performance
- **Oracle:** NAV reported via custom contract, now with independent verification through the Midas Attestation Engine (Chainlink CRE, LlamaRisk, Canary Protocol, vlayer)
- **MPC wallet platform (Critical):** Midas holds distributed backup shares for the Fordefi workspace, allowing them to recover and secure key material in case of counterparty failure. Dual controls are enforced in all recovery procedures, preventing any single point of failure.

## Operational Risk

- **Team Transparency:** Fully doxxed. Dennis Dinkelmeyer (CEO, ex-Goldman Sachs), Fabrice Grinda (Executive Chairman, co-founded OLX, FJ Labs), Romain Bourgois (CPO, ex-Ondo Finance). Team includes alumni from Goldman Sachs, Anchorage Digital, Capital Group
- **Investors:** Framework Ventures (lead), BlockTower, HV Capital, Coinbase Ventures, GSR, Hack VC, Cathay Ledger, 6th Man Ventures, FJ Labs, Lattice Capital. $8.75M seed (March 2024)
- **Documentation Quality:** Comprehensive docs at docs.midas.app covering token mechanics, fees, risk management, smart contracts. [Base Prospectus](https://content.gitbook.com/content/MndxFHqGeA4nzBBeKDTV/blobs/gEQxhKLOMjDS4tRW2my1/Midas_Prospectus_Update_2025.pdf) publicly available (approved by FMA Liechtenstein, July 17, 2025, valid until July 17, 2026 — succeeding the original July 2024 prospectus). [mHYPER Final Terms](https://content.gitbook.com/content/MndxFHqGeA4nzBBeKDTV/blobs/Rh0tXsofDB8UQWaklyuE/Midas_Final_Terms_mHYPER_2025.pdf) and [KID](https://content.gitbook.com/content/MndxFHqGeA4nzBBeKDTV/blobs/0mtdYQ1fSELYbNqAP9jd/KID_mHYPER.pdf) available
- **Legal Structure:** Midas Software GmbH, Pappelallee 78/79, 10437 Berlin, Germany (HRB 254645, LEI 984500BB00BN6D2B7C48). Incorporated June 2023. The issuer is **neither licensed nor registered** with the Liechtenstein FMA or any other supervisory authority. Midas operates [two issuance structures](https://docs.midas.app/legal/legal-structure)
- **Incident Response:** During the Stream Finance incident, Midas/Hyperithm processed $150M+ in redemptions within 48 hours and communicated publicly. Demonstrated operational capability under stress

## Monitoring

1. **Oracle/NAV Updates (CRITICAL)**
  - **Contract:** [0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68](https://etherscan.io/address/0x43881B05C3BE68B2d33eb70aDdF9F666C5005f68) (CustomAggregatorFeed)
  - **Monitor:** `AnswerUpdated` events, `latestRoundData()` values
  - **Alert:** Price decrease >1%, stale price (>10 days without update), unexpected large price jumps
  - **Frequency:** Hourly
2. **Access Control Changes (CRITICAL)**
  - **Contract:** [0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B](https://etherscan.io/address/0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B) (MidasAccessControl)
  - **Monitor:** `RoleGranted`, `RoleRevoked` events
  - **Alert:** Any role change
  - **Frequency:** On event
3. **Contract Upgrades (CRITICAL)**
  - **Contract:** [0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC](https://etherscan.io/address/0xbf25b58cB8DfaD688F7BcB2b87D71C23A6600AaC) (ProxyAdmin)
  - **Monitor:** `Upgraded` events on all proxy contracts
  - **Alert:** Any implementation change
  - **Frequency:** Hourly
4. **Token Supply & Transfers (RECOMMENDED)**
  - **Contract:** [0x9b5528528656DBC094765E2abB79F293c21191B9](https://etherscan.io/address/0x9b5528528656DBC094765E2abB79F293c21191B9) (mHYPER)
  - **Monitor:** `Paused`/`Unpaused` events, large mint/burn events, `Blacklisted` events
  - **Alert:** Pause events, mints >$1M, any blacklist changes
  - **Frequency:** On event
5. **Vault Activity (RECOMMENDED)**
  - **Contract:** [0x6Be2f55816efd0d91f52720f096006d63c366e98](https://etherscan.io/address/0x6Be2f55816efd0d91f52720f096006d63c366e98) (DepositVault)
  - **Contract:** [0xbA9FD2850965053Ffab368Df8AA7eD2486f11024](https://etherscan.io/address/0xbA9FD2850965053Ffab368Df8AA7eD2486f11024) (RedemptionVaultWithSwapper)
  - **Monitor:** Large deposits/redemptions, vault USDC balance
  - **Alert:** Redemptions >$5M, vault balance <$100K
  - **Frequency:** Hourly
6. **External Protocol Health (RECOMMENDED)**
  - Monitor Aave, Pendle, Hyperliquid, Morpho, and Ethena (USDe) for incidents that could impact mHYPER's underlying positions

## Risk Summary

### Key Strengths

- **Doxxed team with institutional backing** — Goldman Sachs / Morgan Stanley alumni, backed by Coinbase Ventures, Framework Ventures, BlockTower
- **Institutional-grade custody** — Fordefi MPC with tri-party MPC governance prevents unilateral fund access
- **Regulatory compliance** — FMA-approved Base Prospectus (July 2025, valid until July 2026), German GmbH legal structure, KYC enforcement onchain
- **Proven redemption capacity** — Processed $150M+ in redemptions within 48 hours under stress (Stream Finance incident)
- **Extensive audits + active bug bounty** — 10 audits across 2023-2025 (Hacken, Côme, Sherlock) covering core contracts, vaults, bridges, and oracles. $1M bug bounty across Sherlock + Cantina. Clean track record (~9 months mHYPER, ~22 months Midas platform)

### Key Risks

- **NAV reporting trust assumptions** — Hyperithm reports NAV, which is now checked through the [Attestation Engine](https://docs.midas.app/transparency/the-midas-attestation-engine) (LlamaRisk + Canary verify, vlayer notarizes, Chainlink CRE publishes hashes onchain). This is a significant improvement over previous single-party reporting, but source artifacts and full portfolio composition remain offchain, and the oracle update itself is still admin-triggered
- **Negligible onchain liquidity** — ~$11.5K on Uniswap (down from ~$32K), effectively $0 daily volume. Exit is entirely dependent on Midas's redemption infrastructure (1-3 days). There is limited instant liquidity 1-2% of total supply to mitigate this
- **Weak access control and partial timelock** — While contract upgrades have a 48-hour timelock, `DEFAULT_ADMIN_ROLE` is held by three direct addresses: the 1/3 Gnosis Safe plus two EOAs. The Safe owner set includes two Midas-claimed MPC-controlled EOAs and one nested 3/7 Safe, but the two direct admin EOAs are a separate control plane. Any direct admin can grant mint/burn/pause/blacklist roles and seize or freeze user funds without delay. The oracle price is also controlled by a single EOA with no timelock
- **Unbacked minting** - tokens can be minted without collateral by the admin

---

## Risk Score Assessment

**Scoring Guidelines:**

- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- **No audit** → **PASS** — 10 audits (Hacken, Côme, Sherlock, 2023-2025) cover the shared vault infrastructure, bridges, and oracles
- **Unverifiable reserves** → **PASS** — Reserves are managed offchain by Hyperithm. NAV is admin-reported but now checked through the Midas Attestation Engine: LlamaRisk and Canary Protocol verify data origins and processes, vlayer provides cryptographic notarization, and attestation hashes are published onchain. Full portfolio composition still requires offchain trust and the source artifacts are not retrievable from the registry alone, but the multi-party verification pipeline provides meaningful independent oversight
- **Total centralization** → **PASS** — Role-based access control, tri-party MPC governance via Fordefi, 48-hour timelock on contract upgrades. However, the 1/3 Safe threshold and role changes bypass the timelock

**Result:** Protocol passes critical gates. Proceeding to category scoring.

---

### Category Scoring (1-5 scale, 1 = safest)

#### 1. Audits & Historical Track Record (Weight: 20%)

**Audits:**

- 10 audits across 3 years (2023-2025): 2 Hacken + 2 Côme + 6 Sherlock contests
- Broad coverage: core contracts, vaults, bridges (LayerZero/Axelar), oracle system, legacy components
- 2025 audits (Côme + Sherlock) cover current core contracts — no longer stale
- mHYPER is an implementation of the audited Midas core contracts
- Several findings accepted rather than fixed in earlier audits

**Bug Bounty:** $1M total allocated across [Sherlock](https://audits.sherlock.xyz/bug-bounties/122) ($500K max, Critical $25K-$500K) and [Cantina](https://cantina.xyz/bounties/d77405e5-99ce-4ba5-846c-885820b030e1) ($500K max). Active since March 2026.

**Time in Production:**

- mHYPER: ~9 months (July 2025)
- Midas platform: ~22 months
- TVL ~$45M for mHYPER, ~$216.6M for Midas total
- No security incidents

**Score: 1.5/5** — Extensive audit coverage (10 audits, 3 firms, 2023-2025) including 2025 audits on current core contracts. mHYPER is an implementation of these audited contracts. Some findings accepted not fixed in earlier audits. Strong $1M bug bounty across two platforms (Sherlock + Cantina) with defined tiers. Clean operational record (~9 months mHYPER, ~22 months platform).

#### 2. Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 3.0**

- Upgradeable proxy contracts with **48-hour timelock** on upgrades via `MidasTimelockController` — users have time to react to proposed upgrades
- However, role changes (mint/burn/pause/blacklist grants) bypass the timelock entirely
- `DEFAULT_ADMIN_ROLE` is held by **three direct addresses**: the 1/3 Gnosis Safe plus two standalone EOAs. Any direct admin can grant/revoke any role with no timelock. The Safe's owner set is partially mitigated by Midas-claimed Fordefi/Fireblocks MPC signers and one nested 3/7 Safe, but those mitigations apply to the Safe owner set, not to the two direct admin EOAs unless Midas separately confirms their control setup
- Oracle price updated by a single EOA with no timelock
- Admin controls all critical roles (flagged by auditors as "highly centralized")
- Tri-party MPC custody (Fordefi) is a positive but applies only to fund movements, not contract administration

**Subcategory B: Programmability — 4.0**

- Strategy execution fully offchain (Hyperithm)
- NAV/oracle admin-updated twice per week. The Attestation Engine adds programmatic verification and onchain hash publication via Chainlink CRE, but the onchain price update is still admin-triggered and not contractually gated by the attestation
- PPS is admin-reported, not computed onchain from reserves. NAV source data is independently checked through the Attestation Engine, but price updates are not computed or enforced by the registry
- Redemption partially offchain (standard redemptions processed by Midas team)
- Users cannot independently compute the exchange rate onchain; the registry does not expose the source document or a retrievable URI/CID
- No smart contract restrictions on how the funds are managed, owner has full control. Tokens can be minted without backing

**Subcategory C: External Dependencies — 3.5**

- Hyperithm: single critical dependency for strategy management and NAV calculation
- Strategy counterparties: Aave (blue-chip), Pendle (established), Hyperliquid (newer), Morpho (established), Kamino
- Stablecoin exposure: sUSDai, USDe, sNUSD (carries its own depeg risk)
- Distributed backup shares for the Fordefi workspace, allowing Midas to recover and secure key material in case of counterparty failure. Dual controls are enforced in all recovery procedures, preventing any single point of failure.

**Centralization Score = (3.0 + 4.0 + 3.5) / 3 ≈ 3.5**

**Score: 3.5/5** — High centralization driven by EOAs with `DEFAULT_ADMIN_ROLE`, offchain operations. The Attestation Engine adds a programmatic verification layer (Chainlink CRE) but the onchain registry only stores hashes, not proof content. The 48-hour timelock on upgrades is a meaningful positive, but role changes bypass it entirely. Tri-party MPC custody (Fordefi) partially mitigates fund movement risks. High concern is that tokens can be minted without backing

#### 3. Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5**

- Tokens are subordinated debt instruments — not direct claims on collateral
- Strategies are stablecoin-focused but managed offchain with discretionary authority by Hyperithm
- Includes leveraged positions across multiple protocols
- No onchain collateral verification in smart contracts, admin can mint tokens without backing
- Tri-party MPC custody via Fordefi should prevent unilateral fund access

**Subcategory B: Provability — 3.0**

- NAV reported by Hyperithm, now independently checked through the Midas Attestation Engine with hashes published onchain
- Multi-party verification pipeline: LlamaRisk + Canary Protocol verify data origins and processes, vlayer provides cryptographic notarization, Chainlink CRE publishes hashes onchain with BFT consensus. Midas docs state that source artifacts are stored on IPFS, but the registry does not expose a retrievable CID/URI
- Reserve transparency is hybrid: per Midas, ~96% of mHYPER strategy positions are onchain and ~4% are CEX/offchain. The attestation engine provides tamper-evident hash records but does not make all underlying positions fully transparent or enforce wallet-to-product attribution onchain

**Funds Management Score = (3.5 + 3.0) / 2 = 3.25 ≈ 3.3**

**Score: 3.3/5** — Offchain funds management with subordinated debt structure. The Attestation Engine (March 2026) significantly improves provability by introducing multi-party verification (LlamaRisk, Canary, vlayer) and onchain attestation-hash publishing via Chainlink CRE, replacing the previous self-generated attestation reports. Full portfolio composition still requires some offchain trust; per Midas, most funds are in onchain wallets while ~4% are CEX/offchain. Leveraged strategy positions add risk. NAV verification will have delay compared to onchain data, and admin-controlled minting can break accounting between reported NAV and token supply.

#### 4. Liquidity Risk (Weight: 15%)

- **Exit Mechanism:** Instant redemption at oracle price (0.50% fee) when available, otherwise standard redemption in 1-3 business days
- **DEX Liquidity:** Negligible — ~$11.5K total on Uniswap V4 (down ~64% from ~$32K in February), effectively $0 daily volume. Not viable for any position size
- **Instant Redemption Capacity:** Liquidity target is 1-2% of circulating supply, but can have additional fees
- **Pendle:** ~$10.14M TVL in mHYPER pools across 5 markets (yield tokenization, not direct exit liquidity)
- **Stress Performance:** Processed $150M+ in 48 hours during Stream Finance incident, but via standard redemption requiring active coordination
- **Large Holder Impact:** ~467 holders, average ~$96K. Significant exits require multi-day standard redemption path

**Score: 3.0/5** — Redemption mechanism works, but entirely dependent on Midas infrastructure. No meaningful secondary market — DEX liquidity has declined significantly to ~$11.5K. Instant redemption vault should provide some liquidity. Standard redemptions take up to 3 business days.

#### 5. Operational Risk (Weight: 5%)

- **Team:** Fully doxxed with strong institutional backgrounds (Goldman Sachs, Morgan Stanley, Ondo Finance, OLX). Well-funded ($8.75M from top crypto VCs)
- **Hyperithm:** Established fund manager (founded 2018), backed by Coinbase Ventures, Samsung Next. Dual-registered (Japan FSA, South Korea KoFIU). Concerns around co-CEO's TRUMP meme coin position and alleged regulatory filing failure
- **Documentation:** Comprehensive docs, publicly available prospectus, weekly reports
- **Legal:** Two issuance structures per [Midas docs](https://docs.midas.app/legal/legal-structure): Luxembourg securitisation (bankruptcy-remote) and German GmbH. mHYPER uses the German GmbH structure — no statutory asset segregation. FMA-approved Base Prospectus (July 2025). Issuer is neither licensed nor registered with FMA per the prospectus

**Score: 1.5/5** — Strong team transparency and institutional credibility. Well-documented and regulated. Minor concerns about Hyperithm regulatory compliance and the thinly capitalized legal entity.

### Final Score

| Category                 | Score | Weight | Weighted    |
| ------------------------ | ----- | ------ | ----------- |
| Audits & Historical      | 1.5   | 20%    | 0.30        |
| Centralization & Control | 3.5   | 30%    | 1.05        |
| Funds Management         | 3.3   | 30%    | 0.99        |
| Liquidity Risk           | 3.0   | 15%    | 0.45        |
| Operational Risk         | 1.5   | 5%     | 0.075       |
| **Final Score**          |       |        | **2.9/5.0** |


### Risk Tier

| Final Score | Risk Tier       | Recommendation                        |
| ----------- | --------------- | ------------------------------------- |
| 1.0-1.5     | Minimal Risk    | Approved, high confidence             |
| 1.5-2.5     | Low Risk        | Approved with standard monitoring     |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5     | Elevated Risk   | Limited approval, strict limits       |
| 4.5-5.0     | High Risk       | Not recommended                       |


**Final Risk Tier: Medium Risk (2.9/5.0)**

**Recommendation:** Approved with **enhanced monitoring** and strict exposure limits.

**Required Conditions:**

1. **Limited Exposure** — Cap allocation at 10-15% of vault with gradual ramp-up
2. **Enhanced Monitoring** — Real-time alerts on oracle updates, role changes, contract upgrades, and vault activity (see Monitoring section)
3. **Verify Multisig Configuration** — Confirm the ProxyAdmin owner and role holder multisig setup before deployment
4. **Monthly NAV Cross-Check** — Independently estimate NAV from known strategy positions where possible
5. **Quarterly Reassessment** — Given the offchain nature and evolving regulatory landscape

**Key Concerns Driving the Score:**

- Offchain strategy execution with NAV determined offchain (verification pipeline improves trust but does not eliminate offchain dependency)
- Role changes (mint/burn/pause/blacklist grants) bypass the 48-hour timelock. `DEFAULT_ADMIN_ROLE` is held by the 1/3 Safe plus two direct EOAs. The Safe owner set has one nested 3/7 Safe and two Midas-claimed MPC signers, but those offchain controls cannot be confirmed onchain and do not cover the two direct admin EOAs unless separately confirmed
- Negligible secondary market liquidity, relying on Midas to keep instant redemption vault at 1-2% of total supply
- Dependency on Hyperithm for strategy execution (NAV verification now multi-party via Attestation Engine)
- No smart contract restrictions on how the funds are managed. Tokens can be minted without backing

**Mitigating Factors:**

- Strong team and institutional backing
- Clean ~9-month track record (mHYPER) / ~22-month (Midas platform)
- Proven redemption under stress ($150M+ in 48 hours)
- Institutional-grade custody (Fordefi tri-party MPC)
- 10 audits (2023-2025) on shared infrastructure + $1M bug bounty across Sherlock + Cantina
- Attestation Engine (March 2026) with multi-party verification: LlamaRisk, Canary Protocol, vlayer cryptographic notarization, Chainlink CRE onchain publishing

---

## Reassessment Triggers

- **Time-based**: Reassess in 3 months (July 2026)
- **TVL-based**: Reassess if mHYPER market cap changes by more than 50%
- **Incident-based**: Reassess after any exploit, NAV discrepancy, governance change, contract upgrade, or regulatory action
- **Hyperithm regulatory outcome**: Reassess when South Korean regulatory filing matter is resolved
- **Timelock expansion**: If Midas extends the 48-hour timelock to cover role changes (not just upgrades)
- **Minting**: If Midas removes the option to mint unbacked tokens
- **Audit**: If new audit covering current mHYPER contracts is published, reassess
- **Attestation Engine maturity**: If the Attestation Engine demonstrates sustained operation and expanded coverage (e.g., real-time attestations, additional verifiers), reassess for potential Provability score improvement

---

## Appendix: Contract Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION LAYER                           │
│                                                                     │
│  ┌───────────────────────────┐    ┌──────────────────────────────┐  │
│  │  DepositVault             │    │  RedemptionVaultWithSwapper   │  │
│  │  (TransparentProxy)       │    │  (TransparentProxy)          │  │
│  │  0x6Be2f558..e98          │    │  0xbA9FD285..024             │  │
│  │                           │    │                              │  │
│  │  User deposits USDC ──────┼───▶│  User redeems mHYPER        │  │
│  │  Vault calls mint()       │    │  Vault calls burn()          │  │
│  │  Has: MINT_OPERATOR_ROLE  │    │  Has: BURN_OPERATOR_ROLE     │  │
│  └─────────────┬─────────────┘    └──────────────┬───────────────┘  │
│                │ mints                           │ burns             │
│                ▼                                 ▼                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  mHYPER Token (TransparentProxy)                             │   │
│  │  0x9b5528528656DBC094765E2abB79F293c21191B9                  │   │
│  │  impl: 0xE4386180dF7285E7D78794148E1B31c9EDfb0689            │   │
│  │                                                              │   │
│  │  mint(to, amount) ── only role check, NO collateral check    │   │
│  │  burn(from, amount) ── can burn from any address             │   │
│  │  pause() / unpause() / blacklist()                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────┐    ┌───────────────────────────────┐  │
│  │  CustomAggregatorFeed    │    │  mHYPER DataFeed              │  │
│  │  (Oracle / NAV)          │    │  (TransparentProxy)           │  │
│  │  0x43881B05..f68         │    │  0x92004DCC..dE               │  │
│  │                          │    │                               │  │
│  │  Weekly admin-set price  │    │  Feeds price data to vaults   │  │
│  │  Current: $1.089 (r78)   │    │                               │  │
│  └──────────────────────────┘    └───────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  MidasLzMintBurnOFTAdapter (LayerZero)                       │   │
│  │  0x148c86390a4ae6f7a02df5903bc0a89e8b4581a0                  │   │
│  │  Cross-chain bridge: has MINT + BURN roles                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     ACCESS CONTROL LAYER                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  MidasAccessControl (TransparentProxy)                       │   │
│  │  0x0312A9D1Ff2372DDEdCBB21e4B6389aFc919aC4B                  │   │
│  │                                                              │   │
│  │  All token/vault operations check roles via this contract    │   │
│  │  grantRole() / revokeRole() ── admin can change any role     │   │
│  │  renounceRole() ── DISABLED (always reverts)                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────┐    ┌───────────────────────────────┐  │
│  │  ProxyAdmin              │    │  MidasTimelockController      │  │
│  │  0xbf25b58c..AaC         │◀───│  0xE3EEe3e0..852             │  │
│  │                          │    │                               │  │
│  │  Can upgrade all proxy   │    │  48-hour minimum delay        │  │
│  │  implementations         │    │  Proposer/Executor: 1/3 Safe │  │
│  └──────────────────────────┘    └───────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     OFF-CHAIN DEPENDENCIES                          │
│                                                                     │
│  ┌──────────────────────────┐    ┌───────────────────────────────┐  │
│  │  Hyperithm               │    │  Fordefi MPC Custody          │  │
│  │  (Strategy Manager)      │    │  (Tri-party quorum)          │  │
│  │                          │    │                               │  │
│  │  Executes strategies:    │    │  Midas + Hyperithm +          │  │
│  │  Aave, Pendle,           │    │  Independent signer           │  │
│  │  Hyperliquid, Morpho     │    │                               │  │
│  │  Reports NAV offchain   │    │  Holds underlying assets      │  │
│  └──────────────────────────┘    └───────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Attestation Engine (March 2026)                             │   │
│  │  LlamaRisk + Canary Protocol verify → vlayer notarizes       │   │
│  │  → Chainlink CRE publishes hashes onchain                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GOVERNANCE                                   │
│                                                                     │
│  DEFAULT_ADMIN_ROLE (3 holders, can grant/revoke ANY role):         │
│  ├─ 0xd4195cf4df289a4748c1a7b6ddbe770e27ba1227 (Fordefi MPC?)      │
│  ├─ 0x875c06a295c41c27840b9c9dfda7f3d819d8bc6a (Fireblocks MPC?)   │
│  └─ 1/3 Gnosis Safe 0xB60842E9DaBCd1C52e354ac30E82a97661cB7E89    │
│     ├─ EOA 0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f (Fordefi?)  │
│     ├─ 3/7 Safe 0x82B30194bEae06D991Bc71850F949ec8cB7E0CB7        │
│     └─ EOA 0xC50BD8430545C80a681C7cb33E6560fB0Bd86880 (Fireblocks?)│
│                                                                     │
│  Mint/Burn Operator EOA (holds BOTH roles):                         │
│  └─ 0x5683de280d0c3967fba2f04d707fa1ef5a044e25                     │
│                                                                     │
│  Oracle Updater EOA (sets NAV price, no timelock):                  │
│  └─ 0xd1e01471f3e1002d4eec1b39b7dbd7aff952a99f                     │
│                                                                     │
│  ⚠ Role changes bypass timelock (only upgrades go through 48h)     │
│  ⚠ mint() has no onchain collateral check                         │
│  ⚠ Any single DEFAULT_ADMIN can grant MINT role → unbacked tokens  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Data flow: User deposits USDC → DepositVault mints mHYPER at oracle
price. Funds go to Hyperithm via Fordefi custody for offchain strategy
execution. NAV updated 2x/week by oracle updater EOA. User redeems via
RedemptionVault (instant if liquidity available) or standard queue.
```

### Attestation Engine (SAVE)

- [Attestation Engine Documentation](https://docs.midas.app/transparency/the-midas-attestation-engine)
- [Midas Attestation Engine Blog Post](https://midas.app/blog/introducing-the-midas-attestation-engine/)

The Midas Attestation Engine uses three onchain contracts:


| Contract                   | Address                                                                                                                 | Role                                                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KeystoneForwarder          | [`0x0b93082D9b3C7C97fAcd250082899BAcf3af3885`](https://etherscan.io/address/0x0b93082D9b3C7C97fAcd250082899BAcf3af3885) | Chainlink DON router — validates oracle signatures, forwards reports                                                                                             |
| SaveCreReceiverProxy       | [`0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6`](https://etherscan.io/address/0xC50102b6598924Aa8deB201c757bFb9a3dBdB9b6) | Midas receiver — parses Chainlink report, calls `setAttestation()`                                                                                               |
| MidasSaveRegistryWithClaim | [`0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d`](https://etherscan.io/address/0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d) | Registry — stores proof metadata. Owner: [`0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f`](https://etherscan.io/address/0x8003544D32eE074aA8A1fb72129Fa8Ef7fe02E5f) |


**Flow** (example [tx](https://etherscan.io/tx/0x48fe8eebeb1c23963a521b45255fec0c5a1073d459aeb6e3067da1133a109f42)):

```
EOA 0xdE7E.. → report() on KeystoneForwarder (validates 4 Chainlink DON signatures)
  → onReport() on SaveCreReceiverProxy
    → setAttestation(proofId, hash) on Registry
```

**What IS stored onchain** (verify with `cast call 0x2D6e9F608807436DE5D9603B00Abe3FEd1Bc809d`):


| Function                              | Returns                         | Example                                                     |
| ------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| `proofExists(bytes32)`                | `true/false`                    | `true`                                                      |
| `proofIdToName(bytes32)`              | proof label                     | `"mhyper-por"`                                              |
| `proofIdToLatestAttestation(bytes32)` | hash + attestor + timestamp     | hash `0x4188041f..`, attestor `0xC501..`, April 10 15:19 UTC |
| `getClaimsForProofId(bytes32)`        | claim IDs                       | 1 claim from provider `0xc024..`                            |
| `getAllVerifications(bytes32)`        | verification hashes + verifiers | 2 verifications (EOA `0xF16C..` + proxy `0xc82f..`)         |


Proof ID for mHYPER: `0xac9a528065afb4290ab62fb0ee1a9110d48ed834454d2d04ab369b4832bbda7a`

**What is NOT stored onchain:**

- No actual reserve data (amounts, balances, NAV, wallet addresses)
- No ABI-exposed IPFS CID or URI getter — a `proofIdToUri()` call reverts
- No document content or protocol-level breakdown

**Where the actual data lives:**

Midas docs state that source artifacts are stored on IPFS, while public weekly PDF reports are available on [Google Drive](https://drive.google.com/drive/folders/1MJi_xq8aR0TaL0DJw6Q91SFxM_z0OcYZ). Each PDF contains total supply per chain, collateral breakdown (strategy + settlement reserve + funds in process), and price. The registry anchors hashes onchain, but users need offchain-disclosed artifacts or links to retrieve and interpret the underlying NAV/reserve data.
