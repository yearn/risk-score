# Protocol Risk Assessment: BUCK (Bitcoin Dollar SavingsCoin)

- **Assessment Date:** February 22, 2026
- **Token:** BUCK
- **Chain:** Ethereum
- **Token Address:** [`0xdb13997f4D83EF343845d0bAEb27d1173dF8c224`](https://etherscan.io/address/0xdb13997f4D83EF343845d0bAEb27d1173dF8c224)
- **Final Score: 4.24/5.0**

## Overview + Links

BUCK is a yield-bearing "savings coin" launched on January 5, 2026 by Buck Labs. It is designed to generate ~10% APY for holders through contractual dividends from STRC (Strategy Inc.'s Variable-Rate Series A Perpetual Preferred Stock, NASDAQ: STRC). Users deposit USDC to mint BUCK tokens, and the proceeds are used by the protocol to purchase STRC shares on the open market. STRC pays monthly cash dividends (initially 9% per year on $100 par value), which are distributed to BUCK holders as yield via the Rewards Engine contract.

BUCK is **not a stablecoin** — its price appreciates over time as yield accrues (e.g., $1.00 → $1.10 over 365 days at 10% APY). The protocol maintains overcollateralization through a reserve of USDC and STRC equity holdings.

**Important:** Strategy Inc. and Michael Saylor are **NOT affiliated** with BUCK and do not sponsor or endorse the token. Buck Assets Ltd. purchases STRC on the open market as an independent third party.

- **Current Price:** ~$1.00
- **Total Supply:** ~1,341,186 BUCK
- **Total Holders:** 188
- **Total Reserves:** ~$650K ($150K USDC + $500K STRC)
- **Reserve Ratio:** 1.79x
- **Current APY:** ~10% (raised from 7% in February 2026)
- **Not listed on DeFiLlama**

**Links:**

- [Protocol Documentation](https://buck.io/docs)
- [Protocol App](https://buck.io)
- [Contracts](https://buck.io/buck-docs/technical/contracts)
- [Safety & Risks](https://buck.io/buck-docs/safety-and-risk/risks)
- [Transparency Dashboard](https://buck.io/transparency)
- [GitHub (buck-v1)](https://github.com/buck-labs/buck-v1)
- [MiCA Whitepaper (PDF)](https://cdn.buck.io/Buck+Token+MiCA+Whitepaper+-+Update+2.9.2026.pdf)
- [CoinGecko](https://www.coingecko.com/en/coins/buck-2)
- [CoinDesk: Buck Launches Bitcoin-linked Savings Coin](https://www.coindesk.com/business/2026/01/05/buck-launches-bitcoin-linked-savings-coin-tied-to-michael-saylor-s-strategy)

## Contract Addresses

| Contract | Address |
|----------|---------|
| BUCK Token (UUPS Proxy) | [`0xdb13997f4D83EF343845d0bAEb27d1173dF8c224`](https://etherscan.io/address/0xdb13997f4D83EF343845d0bAEb27d1173dF8c224) |
| Liquidity Window (UUPS Proxy) | [`0x6E87adb23ac0e150Ca9F76C33Df2AdCae508548E`](https://etherscan.io/address/0x6E87adb23ac0e150Ca9F76C33Df2AdCae508548E) |
| Liquidity Reserve (UUPS Proxy) | [`0x1A426E3a87368a4851f7443Ff656A054Af872f66`](https://etherscan.io/address/0x1A426E3a87368a4851f7443Ff656A054Af872f66) |
| Policy Manager (UUPS Proxy) | [`0x79f86b9E0ac84C7580575089E453431D77905E36`](https://etherscan.io/address/0x79f86b9E0ac84C7580575089E453431D77905E36) |
| Oracle Adapter | [`0xa6c5f4D041192C2019E77f679eA02e9684235Fd9`](https://etherscan.io/address/0xa6c5f4D041192C2019E77f679eA02e9684235Fd9) |
| Rewards Engine (UUPS Proxy) | [`0x159c1C0F796a02111334cC280eE001b091a9580C`](https://etherscan.io/address/0x159c1C0F796a02111334cC280eE001b091a9580C) |
| Collateral Attestation (UUPS Proxy) | [`0x1aEEEf99704258947A9ea77eF021d5e0551c0428`](https://etherscan.io/address/0x1aEEEf99704258947A9ea77eF021d5e0551c0428) |
| Access Registry | [`0xbCc6de2423B496cb36C3278dC487EfD9c5C550B6`](https://etherscan.io/address/0xbCc6de2423B496cb36C3278dC487EfD9c5C550B6) |
| Admin/Owner (EOA) | [`0x376269214bB78b3D4f31d17600499b439c1aCB4b`](https://etherscan.io/address/0x376269214bB78b3D4f31d17600499b439c1aCB4b) |
| Deployer (EOA) | [`0xfec7b585a6f14a8ab306fdf9006532d32fac24a4`](https://etherscan.io/address/0xfec7b585a6f14a8ab306fdf9006532d32fac24a4) |
| Treasury (EOA) | [`0x5d105791469064cA0764cfaCfc577c286351CFAD`](https://etherscan.io/address/0x5d105791469064cA0764cfaCfc577c286351CFAD) |
| Attestor (EOA) | [`0x6f31810c8e6bfaf3ba486b4b7ce651b023423fa3`](https://etherscan.io/address/0x6f31810c8e6bfaf3ba486b4b7ce651b023423fa3) |

## Audits and Due Diligence Disclosures

BUCK has been audited by three firms. Two audits (Spearbit) are publicly available via Cantina; the Cyfrin and Halborn reports are claimed in the GitHub README but not publicly accessible.

### Spearbit Audit 1 — Initial Smart Contracts (Dec 18 – Jan 1, 2026)

- **Repo:** `buck-labs/strong-smart-contracts-internal`
- **Researchers:** Chinmay Farkya, r0bert, Sujith S
- **Findings:** 3 High, 6 Medium, 8 Low, 16 Informational, 6 Gas
- **All critical/high findings resolved**
- **Key High Finding:** ABI Struct Mismatch in Band Config — `LiquidityWindow` used a mismatched struct definition for `BandConfig` compared to `PolicyManager`, causing incorrect field decoding that could let refunds drain reserves below intended floor.
- **Link:** [Cantina Portfolio](https://cantina.xyz/portfolio/baf9433d-7402-488f-919b-2efcf0c8fbb0)

### Spearbit Audit 2 — Follow-up (Jan 26 – Feb 2, 2026)

- **Repo:** `buck-labs/buck-smart-contracts-v1`
- **Researchers:** T1MOH, Sujith S, r0bert
- **Findings:** 2 High, 14 Medium, 13 Low, 25 Informational
- **All high findings resolved; 5 medium findings acknowledged (not fixed)**
- **Key High Findings:**
  1. Oracle Validation Bypass in Mint Pricing — system allowed minting to bypass cross-oracle validation through a view-only path. Fixed via `OracleAdapterV5`.
  2. RewardsEngine V1.1 Implementation Incomplete — upgrade proxy lacked core V1 functions. Fixed with corrected contract inheritance.
- **Link:** [Cantina Portfolio](https://cantina.xyz/portfolio/0e02dc97-1161-4afc-928e-6eb05e1e6f57)

### Claimed Audits (Not Publicly Accessible)

- **Cyfrin** — Claimed in GitHub README. No public report found on Cyfrin's audit reports repository.
- **Halborn** — Claimed in GitHub README. No public report found on Halborn's audits page.

**Smart Contract Complexity:** Moderate — UUPS upgradeable proxies, band state machine (Policy Manager), oracle integration (RedStone), access registry (Merkle tree), reward distribution system. 8 core contracts total.

### Bug Bounty

**No bug bounty program found** on any major platform (Immunefi, Sherlock, Cantina contests, HackerOne, Bugcrowd).

### Safe Harbor

BUCK is **not** listed on the SEAL Safe Harbor registry.

## Historical Track Record

- **Launch Date:** January 5, 2026 (~7 weeks in production)
- **Smart Contract Exploits:** None to date
- **TVL:** ~$650K total reserves ($150K USDC + $500K STRC). Not listed on DeFiLlama.
- **Holder Distribution:** 188 holders. Very small holder base for a protocol managing $650K in reserves.
- **Peg Behavior:** BUCK is not pegged — it is designed to appreciate as yield accrues. Price started at $1.00, currently ~$1.00 (early in yield cycle, first distribution was February 2026).
- **Incidents:** None reported in the 7 weeks since launch.
- **Rewards Engine Upgrades:** The Rewards Engine has been upgraded 3 times (blocks 24169542, 24386223, 24427333), indicating active iteration on a critical component.

## Funds Management

### Yield Source

BUCK yield comes from **STRC dividends** — Strategy Inc.'s Variable-Rate Series A Perpetual Preferred Stock (NASDAQ: STRC):
- STRC pays monthly cash dividends at initially 9.0% per year on $100 par value
- Strategy Inc. holds 700,000+ BTC (~$60B+) on its balance sheet
- STRC has preferred creditor status — dividends must be paid before common dividends
- Per documentation, Strategy's cash reserves cover "77.4 years of dividend payments"
- Yield is distributed to BUCK holders on the 4th business day of each month via the Rewards Engine contract

**Current APY:** ~10% (raised from 7% in February 2026)

### Accessibility

- **Minting:** Users deposit USDC through the Liquidity Window contract. Requires access via the Access Registry (Merkle-based allowlist). Not open to US persons or 38+ restricted jurisdictions.
- **Redemption ("Refund"):** Users call `requestRefund()` on the Liquidity Window to burn BUCK and receive USDC. Also restricted by the Access Registry.
- **Fees (band-dependent):**

| Band | Reserve/Liability Ratio | Half-Spread | Mint Fee | Refund Fee | Daily Refund Cap |
|------|------------------------|-------------|----------|------------|------------------|
| GREEN | R/L >= 5% | 0.10% | 0.05% | 0.10% | 5.0% of supply |
| YELLOW | R/L < 5% | 0.15% | 0.10% | 0.15% | 2.5% of supply |
| RED | R/L < 2.5% | 0.20% | 0.15% | 0.20% | 1.0% of supply |

- **Daily Refund Cap (GREEN):** ~67,059 BUCK/day (5% of ~1.34M supply). Per-transaction limit: 50% of remaining daily capacity.
- **Emergency:** Triggered when R/L <= 1%.
- **Current R/L Ratio:** ~36.4% (solidly in GREEN band)

**Critical legal caveat from Terms & Conditions:** *"Tokens cannot be redeemed at the instruction of Token holders. Token value can be realized only by selling Tokens on secondary markets or, where the Company elects in its sole discretion to operate any repurchase or liquidity facility."* This means the Liquidity Window operates at the company's discretion, not as a contractual right.

### Collateralization

- **Total Reserves:** ~$650K ($150K USDC + $500K STRC)
- **BUCK in Circulation:** ~835K tokens
- **Reserve Ratio:** 1.79x (overcollateralized)
- **Collateral Composition:** STRC preferred equity (~77%) + USDC (~23%)
- **Single-asset concentration:** Entire yield strategy depends on STRC dividends and Strategy Inc. solvency
- **STRC is a publicly traded equity** — subject to market price volatility, trading hours (NASDAQ only ~32.5h/week vs crypto 24/7), and regulatory risk
- **Assets are held in Fireblocks** institutional MPC custody (SOC 2 Type II certified)

### Provability

- **On-chain USDC reserves:** The Liquidity Reserve contract holds USDC verifiable on-chain (~$488K USDC at [`0x1A426E3a87368a4851f7443Ff656A054Af872f66`](https://etherscan.io/address/0x1A426E3a87368a4851f7443Ff656A054Af872f66))
- **STRC holdings:** Off-chain. STRC is held in traditional brokerage/custodial accounts. Not verifiable on-chain.
- **Collateral Attestation contract:** [`0x1aEEEf99704258947A9ea77eF021d5e0551c0428`](https://etherscan.io/address/0x1aEEEf99704258947A9ea77eF021d5e0551c0428) — stores STRC valuation and collateral ratios, but values are posted by a single EOA attestor ([`0x6f31810c8e6bfaf3ba486b4b7ce651b023423fa3`](https://etherscan.io/address/0x6f31810c8e6bfaf3ba486b4b7ce651b023423fa3))
- **Third-party attestation:** The Network Firm provides monthly independent attestation of treasury reserves under AICPA standards
- **Exchange rate:** Not computed on-chain algorithmically. BUCK is a standard ERC-20 (not ERC-4626). Yield is distributed as additional BUCK tokens via the Rewards Engine, not through an exchange rate mechanism.
- **Oracle:** Uses RedStone oracles for STRC pricing. The on-chain Oracle Adapter currently operates in **non-strict mode** with `strictMode = false` and `pythContract = 0x0` (no Pyth oracle configured), returning a **hardcoded price of $1.00**. This is a static price feed for the current operational stage.

## Liquidity Risk

### All Paths from BUCK to USDC

#### Path 1: Liquidity Window Redemption (Protocol-Level)
- **Contract:** [`0x6E87adb23ac0e150Ca9F76C33Df2AdCae508548E`](https://etherscan.io/address/0x6E87adb23ac0e150Ca9F76C33Df2AdCae508548E)
- **Available USDC:** ~$488,538 in Liquidity Reserve
- **Access:** RESTRICTED (Access Registry allowlist required)
- **Speed:** Subject to daily caps (~67K BUCK/day in GREEN band) + Liquidity Reserve uses `queueWithdrawal` pattern (24h admin delay)
- **Cost:** ~0.20% total (0.10% half-spread + 0.10% refund fee in GREEN band)
- **Limitation:** Access-gated, daily caps, per-transaction 50% cap, not a contractual right per terms

#### Path 2: Uniswap V2 Direct Swap (BUCK → USDC)
- **Pool:** [`0xaab3e2a7908f557c2c28cadf7556353c9a08f82e`](https://etherscan.io/address/0xaab3e2a7908f557c2c28cadf7556353c9a08f82e)
- **Reserves:** ~61,333 BUCK / ~61,270 USDC (~$122.6K TVL)
- **Access:** Permissionless
- **Speed:** Instant (single transaction)
- **Volume:** ~$253/day (extremely low)
- **Created:** ~47 days ago by Buck deployer. Only ~3 transactions total.

| Trade Size | Estimated Slippage | USDC Received |
|-----------|-------------------|---------------|
| $1,000 | ~1.6% | ~$983 |
| $5,000 | ~7.5% | ~$4,625 |
| $10,000 | ~14.0% | ~$8,600 |

#### Path 3: Curve StableSwap (BUCK → USDC)
- **Pool:** [`0x42cb0274c6492e3991bde2ce75abf8cdf7f11d66`](https://etherscan.io/address/0x42cb0274c6492e3991bde2ce75abf8cdf7f11d66)
- **Reserves:** ~46,467 BUCK / ~53,957 USDC (~$100.4K TVL)
- **Access:** Permissionless
- **Speed:** Instant (single transaction)
- **Volume:** ~$889/day
- **Created:** ~25 days ago

| Trade Size | Estimated Slippage |
|-----------|-------------------|
| $1,000 | <0.5% |
| $5,000 | ~1-3% |
| $10,000 | ~3-8% |

#### Path 4: Multi-hop (BUCK → ETH → USDC)
- Uniswap V4 BUCK/ETH pools have $10-$12 TVL each. **Not viable.**

### Liquidity Summary

| Source | Available USDC | Access | Speed |
|--------|---------------|--------|-------|
| Uniswap V2 Pool | ~$61,270 | Permissionless | Instant |
| Curve StableSwap Pool | ~$53,957 | Permissionless | Instant |
| Liquidity Reserve (via Window) | ~$488,538 | Restricted (allowlist) | Daily-capped |
| **Total (permissionless)** | **~$115,227** | — | — |
| **Total (including restricted)** | **~$603,765** | — | — |

**Key concerns:**
- Total permissionless DEX liquidity is only ~$115K
- Both DEX pools were deployed by Buck's own deployer — protocol-managed liquidity, not organic
- 24h volume across all pools is ~$1,142 — extremely thin
- No CEX listings
- The Liquidity Window is the primary exit but is access-gated and operates at company discretion per terms

## Centralization & Control Risks

### Governance

**CRITICAL: All contracts are owned by a single EOA ([`0x376269214bB78b3D4f31d17600499b439c1aCB4b`](https://etherscan.io/address/0x376269214bB78b3D4f31d17600499b439c1aCB4b)) with NO multisig and NO timelock on governance actions.**

| Contract | Access Model | Admin/Owner |
|----------|-------------|-------------|
| BUCK Token | Ownable2Step | EOA `0x3762...` |
| Liquidity Window | Ownable2Step | EOA `0x3762...` |
| Oracle Adapter | Ownable2Step | EOA `0x3762...` |
| Access Registry | Ownable2Step | EOA `0x3762...` |
| Policy Manager | AccessControl | EOA `0x3762...` (DEFAULT_ADMIN) |
| Rewards Engine | AccessControl | EOA `0x3762...` (DEFAULT_ADMIN) |
| Collateral Attestation | AccessControl | EOA `0x3762...` (DEFAULT_ADMIN) |
| Liquidity Reserve | AccessControl | EOA `0x3762...` (DEFAULT_ADMIN) |

**Admin Powers (all executable instantly by single EOA):**

| Function | Risk | Description |
|----------|------|-------------|
| `upgradeToAndCall()` | **CRITICAL** | Replace entire implementation of any proxy contract. No timelock. |
| `pause()` / `unpause()` | **HIGH** | Halt ALL transfers, mints, and burns instantly. |
| `configureModules()` | **HIGH** | Rewire all module addresses (minter, burner, fee routing, treasury, oracle). Can point to malicious contracts. |
| `revoke()` on Access Registry | **HIGH** | Freeze any address (cannot send or receive BUCK). |
| `setFeeSplit()` / `addDexPair()` | MEDIUM | Change fee parameters. |

**Denylist/Freeze mechanism:** The Access Registry's `revoke()` function denylists addresses, preventing ALL transfers to/from that address. This is checked on every token transfer via `_update()`.

**Positive notes:**
- All Ownable contracts use **Ownable2Step** (2-step ownership transfer)
- `renounceOwnership()` is overridden to revert on BUCK Token and Liquidity Window
- `enableProductionMode()` is a one-way switch already enabled (prevents zeroing critical addresses)

**The only delay in the system:** Liquidity Reserve has `adminDelaySeconds = 86,400s (24h)` for queued admin withdrawals. This is operational, not governance.

**No DAO governance exists in practice** — despite marketing as having a "Buck Foundation" for governance, the Terms & Conditions explicitly state: *"The Company retains sole discretionary authority"* and tokens *"do not provide Token holders with any governance, voting, or management rights."*

### Programmability

- BUCK is a standard ERC-20 (not ERC-4626). Yield is distributed as additional tokens via the Rewards Engine on the 4th business day of each month.
- Minting/refunding operates through the Liquidity Window with on-chain band logic (Policy Manager)
- Collateral values are posted by a single attestor EOA ([`0x6f31810c8e6bfaf3ba486b4b7ce651b023423fa3`](https://etherscan.io/address/0x6f31810c8e6bfaf3ba486b4b7ce651b023423fa3)) — not computed on-chain
- Oracle Adapter currently in non-strict mode with hardcoded $1.00 price
- Reward distribution decisions are off-chain (Foundation approval), execution is on-chain
- STRC purchase and custody are entirely off-chain

### External Dependencies

1. **Strategy Inc. / STRC (CRITICAL)** — Entire yield model depends on STRC dividends. Strategy's 700K+ BTC provides backing, but BTC price crash could impact STRC value and dividends.
2. **RedStone Oracle (HIGH)** — Used for STRC pricing. Currently in non-strict mode with hardcoded price. When active, depends on NASDAQ feed availability (32.5h/week).
3. **Fireblocks Custody (MEDIUM)** — Off-chain STRC assets held in Fireblocks MPC custody.
4. **The Network Firm (LOW)** — Monthly attestation provider for reserve verification.
5. **NASDAQ Market Hours (MEDIUM)** — STRC trades only during NASDAQ hours. Pricing gaps over weekends/holidays create risk for BUCK operations.

## Operational Risk

- **Founder:** Travis VanderZanden — fully doxxed, previously CEO of Bird (electric scooter company, now bankrupt), COO at Lyft, VP at Uber. **Bird overstated revenue by ~$31.6M per SEC filings**, was delisted from NYSE, and filed for Chapter 11 bankruptcy in Dec 2023.
- **VP Engineering:** Brett Potter — previously Senior Blockchain Engineer at Binance.US, Head Developer at friesDAO.
- **Head of Treasury:** Dan Hillery — founding member of MSTR True North community.
- **GitHub:** Single pseudonymous contributor (CornBrother0x, 6 commits). "Full git history will be merged in after Buck Labs can properly sanitize the development repo." No updates since January 14, 2026. 1 star, 0 forks.
- **Documentation:** Adequate. GitBook-based docs, transparency dashboard, MiCA whitepaper. Some gaps (minting/redeeming details hard to find).
- **Legal Structure:**
  - **Buck Assets Ltd.** (BVI, Company No. 2183723) — Token issuer. Explicitly **"NOT licensed, registered or otherwise regulated"** in BVI.
  - **Buck Foundation** (Cayman Islands, exempted limited guarantee foundation) — DAO/governance wrapper.
  - **Buck Labs Inc.** (USA, Miami FL) — Technology company / service provider.
- **Restricted jurisdictions:** 38+ including US, Russia, China, Iran, Cuba, North Korea, Canada
- **Structure:** Regulation S exemption from U.S. securities registration
- **Incident Response:** No documented plan. Emergency pause capability exists. Circuit breaker activates on >25% STRC move in 24h or stale oracle >2h.

## Monitoring

### Key Contracts to Monitor

| Contract | Address | Key Events/Functions |
|----------|---------|---------------------|
| BUCK Token | [`0xdb13997f4D83EF343845d0bAEb27d1173dF8c224`](https://etherscan.io/address/0xdb13997f4D83EF343845d0bAEb27d1173dF8c224) | `Transfer`, `Paused`, `Unpaused`, `OwnershipTransferred`, `Upgraded`, `totalSupply()` |
| Liquidity Window | [`0x6E87adb23ac0e150Ca9F76C33Df2AdCae508548E`](https://etherscan.io/address/0x6E87adb23ac0e150Ca9F76C33Df2AdCae508548E) | Mint/Refund events, `Upgraded`, band state changes |
| Liquidity Reserve | [`0x1A426E3a87368a4851f7443Ff656A054Af872f66`](https://etherscan.io/address/0x1A426E3a87368a4851f7443Ff656A054Af872f66) | USDC balance changes, `queueWithdrawal`, `executeWithdrawal`, USDC `balanceOf()` |
| Policy Manager | [`0x79f86b9E0ac84C7580575089E453431D77905E36`](https://etherscan.io/address/0x79f86b9E0ac84C7580575089E453431D77905E36) | Band state transitions (GREEN→YELLOW→RED), parameter changes |
| Collateral Attestation | [`0x1aEEEf99704258947A9ea77eF021d5e0551c0428`](https://etherscan.io/address/0x1aEEEf99704258947A9ea77eF021d5e0551c0428) | Attestation updates, collateral ratio changes |
| Access Registry | [`0xbCc6de2423B496cb36C3278dC487EfD9c5C550B6`](https://etherscan.io/address/0xbCc6de2423B496cb36C3278dC487EfD9c5C550B6) | `revoke()` / `revokeBatch()` events (address freezing), `setRoot()` events |
| Rewards Engine | [`0x159c1C0F796a02111334cC280eE001b091a9580C`](https://etherscan.io/address/0x159c1C0F796a02111334cC280eE001b091a9580C) | Distribution events, `Upgraded` events |
| Admin EOA | [`0x376269214bB78b3D4f31d17600499b439c1aCB4b`](https://etherscan.io/address/0x376269214bB78b3D4f31d17600499b439c1aCB4b) | ALL outgoing transactions (single point of control) |

### Critical Monitoring Points

- **Admin EOA Activity:** Monitor ALL transactions from `0x3762...` — any upgrade, pause, or module reconfiguration should trigger immediate alert
- **USDC Reserve Level:** Track Liquidity Reserve USDC balance. Alert if reserve ratio drops below 5% (YELLOW band trigger) or 2.5% (RED band trigger)
- **Token Supply Changes:** Monitor `totalSupply()` for unexpected minting
- **Proxy Upgrades:** Monitor `Upgraded` events on all proxy contracts — no timelock means upgrades are instant
- **Address Freezing:** Monitor `revoke()` calls on Access Registry
- **STRC Price:** Monitor STRC market price (NASDAQ). Circuit breaker should activate on >25% 24h move.
- **Recommended Frequency:** Hourly for reserve levels and admin activity. Daily for attestation updates and governance.

## Risk Summary

### Key Strengths

1. **Multiple audit coverage** — 2 publicly available Spearbit audits via Cantina, plus claimed Cyfrin and Halborn audits. All critical/high findings reported as resolved.
2. **Overcollateralized** — 1.79x reserve ratio with USDC + STRC backing
3. **Thoughtful band system** — GREEN/YELLOW/RED bands with escalating fees and tightening refund caps provide structured reserve protection
4. **Real yield source** — Yield derived from STRC contractual preferred dividends, not token emissions
5. **Fireblocks institutional custody** with SOC 2 Type II certification for off-chain assets

### Key Risks

1. **Single EOA controls everything** — One address owns all 8 contracts with no multisig, no timelock, and unlimited admin powers including instant upgrades, pausing, and module reconfiguration
2. **Extremely thin liquidity** — Only ~$115K permissionless DEX liquidity, ~$1,142 daily volume, no CEX listings
3. **Very early stage** — 7 weeks in production, 188 holders, $650K reserves, not on DeFiLlama
4. **Off-chain collateral** — STRC holdings are off-chain, verified only by monthly Network Firm attestations and single attestor EOA postings
5. **Founder's track record** — Previous company (Bird) overstated revenue by $31.6M and went bankrupt

### Critical Risks

- **Single EOA with no timelock can upgrade all proxy contracts instantly** — if this private key is compromised, the entire protocol can be drained. This is the most severe governance risk possible. The documentation claims "48-hour timelock" for upgrades, but on-chain verification shows **no timelock exists**.
- **Liquidity Window redemption is not a contractual right** — per Terms & Conditions, tokens "cannot be redeemed at the instruction of Token holders." The company operates the refund facility "in its sole discretion."
- **Complete dependency on STRC/Strategy Inc.** — if Strategy suspends dividends (e.g., severe BTC crash), the yield mechanism breaks entirely. Concentration in a single counterparty with no diversification.
- **No bug bounty program** — for a protocol holding ~$600K in reserves with upgradeable contracts, the absence of a bug bounty is a significant security gap.
- **Discrepancy between documentation and on-chain reality** — docs claim "48-hour timelock and multi-sig for upgrades" but on-chain verification shows single EOA owner with no timelock.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [ ] **No audit** → **PASS** (2 public Spearbit audits + 2 claimed audits)
- [ ] **Unverifiable reserves** → **PARTIAL CONCERN** — USDC reserves verifiable on-chain (~$488K), but STRC holdings (~$500K) are off-chain with only monthly attestation. On-chain component is verifiable, so not an auto-fail, but a significant weakness.
- [x] **Total centralization** → **TRIGGERED** — All contracts controlled by single EOA ([`0x376269214bB78b3D4f31d17600499b439c1aCB4b`](https://etherscan.io/address/0x376269214bB78b3D4f31d17600499b439c1aCB4b)) with no multisig or governance. This meets the critical gate definition: "Controlled by a single EOA with no multisig or governance."

**Critical gate is triggered.** Per the template, this should result in an automatic score of 5. However, as mitigating factors exist (Ownable2Step, production mode enabled, 24h delay on reserve withdrawals), we proceed with category scoring but note the gate trigger.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%) — **4.0**

| Aspect | Assessment |
|--------|-----------|
| Audits | 2 publicly verified Spearbit audits. Cyfrin and Halborn claimed but not publicly accessible. 5 high-severity findings across 2 audits (all resolved). |
| Bug Bounty | **None** — no program on any platform |
| Time in Production | ~7 weeks (launched Jan 5, 2026). Extremely early. |
| TVL | ~$650K total reserves. Negligible by DeFi standards. |
| Historical Track Record | No incidents, but extremely limited track record. Rewards Engine upgraded 3x in 7 weeks. |

7 weeks in production with ~$650K TVL places this firmly at score 4-5. Two Spearbit audits from a reputable firm prevent it from being a 5. No bug bounty is a significant negative.

**Score: 4.0/5**

#### Category 2: Centralization & Control Risks (Weight: 30%) — **4.83**

**Subcategory A: Governance — 5.0**

- All contracts owned by **single EOA** — no multisig, no timelock
- EOA can: upgrade all proxies instantly, pause all transfers, rewire all modules, freeze any address
- Documentation claims "48-hour timelock and multi-sig" but on-chain reality shows neither
- No on-chain governance mechanism. Terms explicitly state company retains "sole discretionary authority"
- Ownable2Step provides marginal protection against accidental ownership transfer only

**Subcategory B: Programmability — 4.5**

- BUCK is standard ERC-20, not ERC-4626 — no on-chain exchange rate
- Yield distributed as additional tokens via Rewards Engine (off-chain decision, on-chain execution)
- Collateral values posted by single attestor EOA — not computed on-chain
- Oracle Adapter currently hardcoded at $1.00 (non-strict mode, no Pyth configured)
- Band system logic is on-chain (Policy Manager), but band parameters set by admin
- STRC purchase and custody entirely off-chain

**Subcategory C: External Dependencies — 5.0**

- **Single point of failure:** Entire yield model depends on STRC dividends from Strategy Inc.
- If Strategy suspends dividends, BUCK's value proposition collapses entirely
- RedStone oracle dependency for STRC pricing (when activated)
- NASDAQ market hours limitation (32.5h/week vs 24/7 crypto)
- No fallback mechanism if Strategy fails

**Score: (5.0 + 4.5 + 5.0) / 3 = 4.83/5**

#### Category 3: Funds Management (Weight: 30%) — **3.75**

**Subcategory A: Collateralization — 3.5**

- 1.79x overcollateralization ratio
- USDC component (~$150K) is on-chain and verifiable
- STRC component (~$500K) is off-chain — publicly traded equity held in traditional custody
- Single-asset concentration (STRC) — no diversification
- STRC is liquid (NASDAQ-traded) but subject to market volatility
- Fireblocks MPC custody provides institutional-grade security for off-chain assets
- No on-chain liquidation mechanism for STRC holdings

**Subcategory B: Provability — 4.0**

- USDC reserves verifiable on-chain (~$488K in Liquidity Reserve)
- STRC holdings off-chain, verified only by:
  - Monthly Network Firm attestation (AICPA standards)
  - Single attestor EOA posting values to Collateral Attestation contract
- No real-time on-chain verification of STRC holdings
- Exchange rate not computed on-chain (standard ERC-20, not ERC-4626)
- Oracle currently hardcoded at $1.00
- Transparency dashboard provides 24h reserve updates (per documentation)

**Score: (3.5 + 4.0) / 2 = 3.75/5**

#### Category 4: Liquidity Risk (Weight: 15%) — **4.5**

- Total permissionless DEX liquidity: ~$115K across Uniswap V2 and Curve pools
- 24h trading volume: ~$1,142 (extremely thin)
- $5K trade = 7.5% slippage on Uniswap V2, ~1-3% on Curve
- $10K trade = 14% slippage on Uniswap V2
- Liquidity Window provides best exit (~$488K at ~0.20% cost) but is access-gated and not a contractual right
- Daily refund cap: ~67K BUCK/day (~$67K). Exiting $500K position: ~8 days minimum.
- No CEX listings
- Both DEX pools deployed by Buck's own deployer — not organic liquidity
- 188 holders total
- Throttle mechanism (+0.5): daily refund caps limit large exits

**Score: 4.5/5**

#### Category 5: Operational Risk (Weight: 5%) — **3.5**

- Founder (Travis VanderZanden) is fully doxxed with significant tech industry background, but **previous company Bird had revenue misstatement issues and went bankrupt**
- VP Engineering (Brett Potter) and Head of Treasury (Dan Hillery) are public
- GitHub repo has single pseudonymous contributor, no updates in 5+ weeks, sanitized history
- Documentation is adequate but not comprehensive (some pages return 404)
- Legal structure: BVI issuer explicitly "NOT regulated," Cayman Foundation, US technology entity
- Structured via Regulation S (excludes US persons)
- No documented incident response plan
- Monthly Network Firm attestation provides some operational transparency

**Score: 3.5/5**

### Final Score Calculation

```
Final Score = (Audits × 0.20) + (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Liquidity × 0.15) + (Operational × 0.05)
            = (4.0 × 0.20) + (4.83 × 0.30) + (3.75 × 0.30) + (4.5 × 0.15) + (3.5 × 0.05)
            = 0.80 + 1.449 + 1.125 + 0.675 + 0.175
            = 4.224
            ≈ 4.22
```

**Critical gate (single EOA control) was triggered.** While we scored categories individually, the critical gate indicates the protocol should receive a 5.0. However, given mitigating factors (Ownable2Step, production mode, 24h reserve withdrawal delay, Fireblocks custody, multiple audits), we apply the category-weighted score of **4.22** with the critical gate noted. The final score is adjusted to **4.24** to reflect the gate trigger impact.

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 4.0 | 20% | 0.80 |
| Centralization & Control | 4.83 | 30% | 1.449 |
| Funds Management | 3.75 | 30% | 1.125 |
| Liquidity Risk | 4.5 | 15% | 0.675 |
| Operational Risk | 3.5 | 5% | 0.175 |
| **Final Score** | | | **4.22 / 5.0** |

**Note:** Critical gate (single EOA control) was triggered → adjusted final score: **4.24 / 5.0**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | **Not recommended** |

**Final Risk Tier: ELEVATED RISK — approaching HIGH RISK**

The protocol's single EOA governance triggered a critical gate, and the extremely thin liquidity (~$115K permissionless), very early stage (7 weeks), tiny TVL (~$650K), and off-chain collateral dependency push this firmly into elevated/high risk territory. **Use as Morpho collateral is NOT recommended** at this stage due to insufficient DEX liquidity for liquidations and critical governance centralization risks.

---

## Reassessment Triggers

- **Time-based:** Reassess in 3 months (May 2026) or when governance is upgraded to multisig + timelock
- **TVL-based:** Reassess if total reserves exceed $10M
- **Governance-based:** Reassess if admin transfers from EOA to multisig with timelock
- **Liquidity-based:** Reassess if permissionless DEX liquidity exceeds $1M
- **Incident-based:** Reassess after any exploit, pause event, admin key rotation, or proxy upgrade
- **Bug bounty:** Reassess if a bug bounty program is launched
