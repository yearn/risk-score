# Protocol Risk Assessment: Mezo MUSD

## Overview + Links

Mezo is a Bitcoin-focused Layer-1 appchain (EVM-compatible, Cosmos SDK-based) described as "the onchain Bitcoin banking platform." MUSD is Mezo's native stablecoin, a **Liquity V1 fork** that allows users to borrow MUSD against BTC collateral (via tBTC) through a CDP (Collateralized Debt Position) model. Each MUSD is fully backed by Bitcoin and can be redeemed for BTC at face value.

Key modifications from Liquity V1:
- **Fixed interest rates** (1-5% APR) instead of Liquity's one-time borrowing fee
- **BTC-only collateral** (via tBTC) instead of ETH
- **Interest Rate Manager** for governance-set global rates
- **Protocol Controlled Value (PCV)** with a 100M MUSD bootstrap loan into the Stability Pool at genesis
- **Refinancing mechanism** for borrowers to update their rate
- Solidity 0.8.24 (Liquity V1 used 0.6.x)

MUSD is minted on the Mezo chain and bridged to Ethereum via **Wormhole's Native Token Transfer (NTT)** protocol.

The protocol is built by **Thesis**, the crypto venture studio that previously built Keep Network, tBTC, and Threshold Network. Thesis has been building Bitcoin DeFi infrastructure since 2018-2019.

**Links:**

- [Protocol Documentation](https://mezo.org/docs/users)
- [Protocol App](https://mezo.org)
- [GitHub - MUSD Contracts](https://github.com/mezo-org/musd)
- [GitHub - Mezo Org](https://github.com/mezo-org)
- [Audits Repository](https://github.com/mezo-org/audits)
- [CoinGecko - MUSD](https://www.coingecko.com/en/coins/mezo-usd)
- [DeFiLlama - Mezo Borrow](https://defillama.com/protocol/mezo-borrow)

## Contract Addresses

### Mezo Chain (Chain ID: 31612)

| Contract | Address |
|----------|---------|
| MUSD Token | [`0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186`](https://explorer.mezo.org/token/0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186) |
| ActivePool | [`0x3012C2fE1240e3754E5C200A0946bb0E07474876`](https://explorer.mezo.org/address/0x3012C2fE1240e3754E5C200A0946bb0E07474876) |
| DefaultPool | [`0xE4B5913C0c82dB2eFC553b95c0173efb90a07c8B`](https://explorer.mezo.org/address/0xE4B5913C0c82dB2eFC553b95c0173efb90a07c8B) |
| CollSurplusPool | [`0xBF51807ACb3394B8550f0554FB9098856Ef5F491`](https://explorer.mezo.org/address/0xBF51807ACb3394B8550f0554FB9098856Ef5F491) |
| GasPool | [`0x3EB418BdBE95b4b9cf465ecfBD8424685ACD1Bc1`](https://explorer.mezo.org/address/0x3EB418BdBE95b4b9cf465ecfBD8424685ACD1Bc1) |

### Ethereum Mainnet

| Contract | Address | Notes |
|----------|---------|-------|
| MUSD Token | [`0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186`](https://etherscan.io/address/0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186) | ERC20, mint/burn controlled via whitelist |
| NTT Manager (Bridge) | [`0x5293158bf7a81ED05418DA497a80F7e6Dbf4477E`](https://etherscan.io/address/0x5293158bf7a81ED05418DA497a80F7e6Dbf4477E) | Wormhole NTT, burn/mint mode |
| Wormhole Transceiver | [`0x76ddB3f1dDe02391Ef0A28664499B74C29d18d3E`](https://etherscan.io/address/0x76ddB3f1dDe02391Ef0A28664499B74C29d18d3E) | ERC1967Proxy → WormholeTransceiver |
| Mezo Multisig | [`0x98D8899c3030741925BE630C710A98B57F397C7a`](https://etherscan.io/address/0x98D8899c3030741925BE630C710A98B57F397C7a) | Gnosis Safe, **5/9 threshold** |
| NTT Pauser Multisig | [`0x40C7b9612B394212394EA860cACd0e176CA4Ae5B`](https://etherscan.io/address/0x40C7b9612B394212394EA860cACd0e176CA4Ae5B) | Gnosis Safe, **2/4 threshold** |

**MUSD Ethereum Token Details:**
- Name: Mezo USD
- Symbol: MUSD
- Decimals: 18
- Total Supply on Ethereum: ~2,571,721 MUSD (as of 2026-02-13)
- Owner: Mezo Multisig (5/9)

**Mezo Multisig Signers (5/9):**

| # | Signer |
|---|--------|
| 1 | [`0x7f043FF8B5Ce02E543eE83fcdec94944D24ebD5d`](https://etherscan.io/address/0x7f043FF8B5Ce02E543eE83fcdec94944D24ebD5d) |
| 2 | [`0x09C146B526E5139E0bDe31aF85AD44761eC70d00`](https://etherscan.io/address/0x09C146B526E5139E0bDe31aF85AD44761eC70d00) |
| 3 | [`0x930b76784C1FB86335ab174dFE321B44eA0ADfdA`](https://etherscan.io/address/0x930b76784C1FB86335ab174dFE321B44eA0ADfdA) |
| 4 | [`0xAbB0C40DBc7FF3455087888C87217064Ad10a944`](https://etherscan.io/address/0xAbB0C40DBc7FF3455087888C87217064Ad10a944) |
| 5 | [`0x9bE76D5aB050aa8c77f6Ad25F25f633B2cB8ed85`](https://etherscan.io/address/0x9bE76D5aB050aa8c77f6Ad25F25f633B2cB8ed85) |
| 6 | [`0x696BA87e3Ef864335A9E30Ae4653b516Fb93a1AB`](https://etherscan.io/address/0x696BA87e3Ef864335A9E30Ae4653b516Fb93a1AB) |
| 7 | [`0x351a1C1bE5fE133204DBd74789dA67c68e40A84c`](https://etherscan.io/address/0x351a1C1bE5fE133204DBd74789dA67c68e40A84c) |
| 8 | [`0xF63bc5326c4d5ab123a20Ec5D5805B365a3355E4`](https://etherscan.io/address/0xF63bc5326c4d5ab123a20Ec5D5805B365a3355E4) |
| 9 | [`0x6F016C33e55e40f24239fB9ab96A6e3D75059686`](https://etherscan.io/address/0x6F016C33e55e40f24239fB9ab96A6e3D75059686) |

**Mint/Burn Permissions on Ethereum MUSD:**

| Address | Can Mint | Can Burn | Role |
|---------|----------|----------|------|
| NTT Manager (`0x5293...`) | Yes | Yes | Bridge mint/burn |
| `0x52b9...` | Yes | Yes | TODO: identify |
| `0xe9c3...` | Yes | No | TODO: identify |
| `0x70ce...` | No | Yes | TODO: identify |
| `0x1d5b...` | No | Yes | TODO: identify |

## Audits and Due Diligence Disclosures

MUSD is a fork of Liquity V1, which itself was extensively audited. The Mezo team has conducted audits on their modifications.

### MUSD-Specific Audits

| Auditor | Scope | Date | Link |
|---------|-------|------|------|
| **Cantina** | MUSD smart contracts | April 2025 | [PDF](https://mezo.org/docs/audits/2025-04-15%20-%20Cantina%20-%20MUSD.pdf) |
| **Thesis Defense** | Mezo Earn | January 2026 | Listed in [audits repo](https://github.com/mezo-org/audits) |

### Other Mezo Audits

| Auditor | Scope | Date | Link |
|---------|-------|------|------|
| **Halborn** | mezod (chain client) | January 2025 | [PDF](https://mezo.org/docs/audits/2025-01-31%20-%20Halborn%20-%20mezod.pdf) |
| **Halborn** | mezod (chain client) | October 2024 | [PDF](https://mezo.org/docs/audits/2024-10-18%20-%20Halborn%20-%20mezod.pdf) |
| **Halborn** | Mezo Native Bridge | September 2025 | [PDF](https://mezo.org/docs/audits/2025-09-18%20-%20Halborn%20-%20Mezo%20Native%20Bridge.pdf) |
| **OtterSec** | Bridge | March 2025 | [PDF](https://mezo.org/docs/audits/2025-03-18%20-%20OtterSec%20-%20Bridge%20Audit.pdf) |
| **Thesis Defense** | MezoBridge contract | September 2025 | [PDF](https://mezo.org/docs/audits/2025-09-10%20-%20Thesis%20Defense%20-%20MezoBridge%20contract.pdf) |
| **Quantstamp** | Passport/App | May 2024 | [PDF](https://mezo.org/docs/audits/2024-05-03%20-%20Quantstamp%20-%20Passport%20contracts.pdf) |

**Note:** "Thesis Defense" appears to be an internal/affiliated security team, not an independent third-party auditor. The only independent MUSD-specific audit is by **Cantina** (April 2025).

### Underlying Liquity V1 Audits

The base Liquity V1 code has been extensively audited:
- **Trail of Bits** — 3 separate audit reports (protocol, stability pool, proxy contracts)
- **Coinspect** — Security review
- **Certora** — Formal verification
- Liquity V1 has been live on Ethereum since April 2021 with $0 lost to smart contract exploits.

### Smart Contract Complexity

Moderate complexity. The core CDP logic follows Liquity V1's proven architecture (TroveManager, BorrowerOperations, StabilityPool, SortedTroves, ActivePool, DefaultPool). Key additions include InterestRateManager, PCV, and BorrowerOperationsSignatures. The codebase uses Solidity 0.8.24 with Echidna fuzz testing.

### Bug Bounty

- No Immunefi bug bounty program found.
- Mezo has a security policy at `security@mezo.org` with a 48-hour response SLA. See [SECURITY.md](https://github.com/mezo-org/mezod/blob/main/SECURITY.md).
- No formal bug bounty with defined payouts was identified.

## Historical Track Record

- **Production History**: Mezo Borrow (MUSD) first appears on DeFiLlama on 2026-01-20. The Mezo chain launched earlier with bridge functionality. MUSD has been live for approximately **3-4 weeks** at time of assessment.
- **TVL**: Mezo Borrow TVL is ~$19.6M (2026-02-13). Mezo Bridge TVL is ~$43.6M.
- **MUSD Supply on Ethereum**: ~2,571,721 MUSD bridged to Ethereum.
- **Incidents**: No reported security incidents or exploits found for Mezo or MUSD.
- **Peg Stability** (CoinGecko data, 2025-08-14 to 2026-02-12):
  - Mean price: $0.9945
  - Min: $0.9794 (-2.06% from peg)
  - Max: $1.0472 (+4.72% from peg)
  - Standard deviation: $0.0089
  - Notable depeg events: Brief upward deviations to $1.032 (Aug 2025) and $1.047 (Oct 2025).
  - Recent trend: Consistently trading at $0.988-0.993 (slight discount).
- **Concentration Risk**: With only ~$2.6M MUSD on Ethereum and $19.6M TVL on Mezo chain, the user base is likely concentrated among early adopters.

## Funds Management

MUSD operates as a CDP stablecoin — it does **not** delegate funds to other protocols. All collateral (BTC) is held within the protocol's own pool contracts (ActivePool, DefaultPool).

### Accessibility

- **Minting**: Anyone can mint MUSD by depositing BTC collateral on the Mezo chain and opening a trove (CDP). Minimum collateral: $1,800 USD worth of BTC.
- **Bridging**: MUSD is bridged to Ethereum via Wormhole NTT (burn on Mezo, mint on Ethereum and vice versa).
- **Redemption**: Anyone can redeem MUSD for BTC at face value on the Mezo chain (Liquity-style redemptions against lowest-collateral-ratio troves). 0.75% redemption fee for non-borrowers.
- **Fees**:

| Fee Type | Amount | Notes |
|----------|--------|-------|
| Interest Rate | 1-5% APR (fixed) | Set at loan opening, fixed for life of loan |
| Issuance Fee | 0.1% | On borrowed MUSD amount |
| Refinance Fee | 0.1% | Fraction of issuance fee |
| Redemption Fee | 0.75% | For non-borrowers redeeming MUSD for BTC |
| Gas Deposit | 200 MUSD | Returned when loan is closed |

### Collateralization

- **Backing**: MUSD is 100% backed by BTC collateral (specifically tBTC) on the Mezo chain. Over-collateralized by design.
- **Minimum Collateral Ratio (MCR)**: 110% (same as Liquity V1)
- **Critical Collateral Ratio (CCR)**: 150% — below this, Recovery Mode is triggered
- **Liquidation**: Positions below 110% ICR are liquidated. The Stability Pool absorbs debt first; if depleted, debt is redistributed to remaining borrowers.
- **Recovery Mode**: When system TCR < 150%, liquidation threshold rises to 150%.
- **PCV Bootstrap**: The protocol minted a 100M MUSD bootstrap loan into the Stability Pool at genesis — this provides initial liquidation buffer but creates protocol-owned debt.
- **Collateral Quality**: BTC via tBTC (Threshold Network's decentralized Bitcoin bridge). tBTC has 24,000+ BTC bridged since 2020 with no loss events. However, tBTC itself introduces bridge/signer risk.

### Provability

- **On-chain Verification**: Collateral is held in on-chain pool contracts on the Mezo chain (ActivePool, DefaultPool). Anyone can verify total collateral and total debt.
- **No Exchange Rate**: MUSD targets 1:1 USD peg through arbitrage mechanics (not an exchange-rate model). No PPS/rate calculations needed.
- **Oracle**: BTC/USD price feed (likely Chainlink-based per the PriceFeed.sol interface) is used for collateral ratio calculations.
- **tBTC Proof of Reserves**: Available at [tbtcscan.com/wallets](https://tbtcscan.com/wallets) for verifying BTC backing of tBTC itself.
- **Cross-chain Complexity**: Verifying MUSD backing requires checking the Mezo chain, not Ethereum. On Ethereum, MUSD is purely a bridged token — its backing exists on the Mezo chain.

## Liquidity Risk

### On-Chain Liquidity (Ethereum)

| Pool | Platform | TVL | MUSD Share | Notes |
|------|----------|-----|------------|-------|
| MUSD/2pool | Curve | ~$1,258,148 | 77.0% | Metapool with USDC/USDT |
| OUSD/MUSD | Curve | ~$116,224 | 79.4% | Imbalanced toward MUSD |
| USDC/MUSD | Uniswap V3 | ~$646,755 | 62.0% | |
| USDC/MUSD | Uniswap V4 | ~$592,000 | — | Per DeFiLlama |
| tBTC/MUSD | Uniswap V4 | ~$336,000 | — | Per DeFiLlama |
| **Total** | | **~$2,949,000** | | |

**24h Trading Volume**: ~$514,000 (CoinGecko)

### Liquidity Assessment

- **Total DEX liquidity**: ~$2.95M across Ethereum DEXes.
- **Pool imbalance**: MUSD is the majority asset in both Curve pools (77% and 79.4%), indicating selling pressure or insufficient demand-side liquidity.
- **Slippage**: For a $100K MUSD→USDC swap, expect >2-3% slippage given pool depths and imbalances.
- **Redemption mechanism**: On the Mezo chain, MUSD can be redeemed 1:1 for BTC collateral (minus 0.75% fee). This is the primary exit path. On Ethereum, exit requires either DEX swap or bridging back to Mezo for redemption.
- **No withdrawal queues**: Liquity-style redemptions are instant against troves.
- **Bridge dependency**: Exiting via redemption requires bridging MUSD back to Mezo chain (Wormhole NTT), adding latency and bridge risk.

## Centralization & Control Risks

### Governance

**On Ethereum (bridged MUSD):**

- **MUSD Token Owner**: Mezo Multisig [`0x98D8899c3030741925BE630C710A98B57F397C7a`](https://etherscan.io/address/0x98D8899c3030741925BE630C710A98B57F397C7a) — **5/9 Gnosis Safe**
- **NTT Manager Owner**: Same Mezo Multisig (5/9)
- **Wormhole Transceiver Owner**: Same Mezo Multisig (5/9)
- **NTT Pauser**: Separate Safe [`0x40C7b9612B394212394EA860cACd0e176CA4Ae5B`](https://etherscan.io/address/0x40C7b9612B394212394EA860cACd0e176CA4Ae5B) — **2/4 threshold** (lower threshold allows fast pause in emergencies)
- **No Timelock**: No timelock was found on the Ethereum MUSD contracts. The 5/9 multisig has direct control.
- **Mint/Burn Control**: The multisig-owned MUSD contract has a mintList/burnList whitelist. The owner can add/remove addresses with minting/burning privileges.
- **Signers**: 9 EOA signers, identities not publicly disclosed.
- **Bridge pausability**: NTT Manager is currently unpaused. The 2/4 pauser multisig can pause bridging.

**On Mezo Chain (native MUSD):**

- The Mezo chain is a new L1 with its own validator set. Governance uses veBTC/veMEZO vote-escrow model.
- Core MUSD contracts (TroveManager, BorrowerOperations, StabilityPool) follow Liquity V1 architecture which is largely immutable once deployed — however the addition of InterestRateManager introduces governable parameters.
- Interest rates are set by governance (controlled by early participants with veBTC/veMEZO).

**Privileged Roles:**
- Multisig can update the MUSD mint/burn whitelist on Ethereum
- Multisig owns the bridge contracts (can upgrade NTT Manager proxy)
- InterestRateManager can change borrowing rates on Mezo chain
- PCV contract manages the 100M MUSD bootstrap loan

### Programmability

- **Core CDP Logic**: Fully programmatic on-chain (Liquity V1 model). Liquidations, redemptions, and collateral management are all automated.
- **No PPS/Exchange Rate**: MUSD is a 1:1 stablecoin, not a vault token. No admin-controlled rate.
- **Bridge Operations**: Wormhole NTT relies on Wormhole Guardian network (19 guardians, 13/19 threshold) for cross-chain message verification — semi-decentralized.
- **Interest Rate Changes**: Require governance action, not fully programmatic.

### External Dependencies

| Dependency | Criticality | Risk Level |
|------------|-------------|------------|
| **tBTC (Threshold Network)** | Critical — sole collateral type | Medium. Decentralized Bitcoin bridge with 6+ years of operation, but adds bridge risk layer |
| **Wormhole NTT** | Critical — only bridge for MUSD to Ethereum | Medium. Wormhole is a major bridge protocol with 19 guardians, but has had a $320M exploit in Feb 2022 (on a different product) |
| **Mezo Chain** | Critical — MUSD is minted here | High. New L1 chain with limited track record |
| **BTC/USD Oracle** | Critical — used for collateral ratio calculations | Medium. Likely Chainlink-based |

## Operational Risk

- **Team Transparency**: Built by **Thesis** (thesis.co), a well-known crypto venture studio founded by Matt Luongo. Previously built Keep Network, tBTC, and Threshold Network. Team is mostly known/doxxed in crypto circles.
- **Documentation Quality**: Good. Comprehensive docs at mezo.org/docs/users, open-source codebase at github.com/mezo-org/musd.
- **Legal Structure**: Thesis is a company (US-based). The **Supernormal Foundation** holds 10% of MEZO token supply for ecosystem development. Investor contact: IR@thesis.co.
- **Incident Response**: Security policy documented at `security@mezo.org` with 48-hour response SLA. No incidents to evaluate response quality.
- **MEZO Token Distribution**: Team (20%) + Investors (30%) = 50% with vesting (1-year cliff, 3-year linear). Foundation (10%) unlocked at TGE. Community (40%).

## Monitoring

### Key Contracts to Monitor

**Ethereum:**
- MUSD Token: [`0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186`](https://etherscan.io/address/0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186)
- NTT Manager: [`0x5293158bf7a81ED05418DA497a80F7e6Dbf4477E`](https://etherscan.io/address/0x5293158bf7a81ED05418DA497a80F7e6Dbf4477E)
- Mezo Multisig: [`0x98D8899c3030741925BE630C710A98B57F397C7a`](https://etherscan.io/address/0x98D8899c3030741925BE630C710A98B57F397C7a)

### Critical Events to Watch

- **Mint/Burn whitelist changes** on MUSD token (owner can add/remove minters)
- **NTT Manager upgrades** (proxy upgradeable by multisig)
- **Bridge pauses** on NTT Manager
- **Multisig signer/threshold changes**
- **Large bridge transactions** (MUSD flowing between Mezo and Ethereum)
- **MUSD peg deviations** >2% on DEXes
- **Mezo chain TCR** approaching 150% (Recovery Mode trigger)
- **Curve/Uniswap pool balance ratios** (further imbalance = selling pressure)

### Recommended Frequency

- **Hourly**: Peg monitoring, bridge transaction volume
- **Daily**: TVL changes, pool balance ratios, multisig activity
- **Weekly**: Collateral ratio trends on Mezo chain, liquidity depth changes

## Risk Summary

### Key Strengths

- **Battle-tested base code**: Liquity V1 fork — the core CDP architecture has been live since April 2021 with no smart contract exploits
- **Experienced team**: Thesis has 6+ years building Bitcoin DeFi infrastructure (tBTC, Keep, Threshold)
- **Over-collateralized**: Minimum 110% collateral ratio with robust liquidation mechanics
- **Transparent**: Open-source code, on-chain verifiable collateral, documented security policy
- **Conservative parameters**: MCR (110%) and CCR (150%) are identical to Liquity V1's proven settings

### Key Risks

- **Very new protocol**: MUSD has been live for only ~3-4 weeks. Extremely limited production track record
- **Chain risk**: Mezo is a new L1 — chain stability, validator decentralization, and liveness are unproven
- **Double bridge risk**: MUSD on Ethereum depends on both tBTC (BTC→Mezo bridge) and Wormhole NTT (Mezo→Ethereum bridge)
- **Limited liquidity**: Only ~$2.95M DEX liquidity on Ethereum with significant pool imbalances (MUSD is 77-79% of Curve pools)
- **No bug bounty**: No formal bug bounty program with defined payouts
- **Single audit for MUSD**: Only one independent audit (Cantina, April 2025). "Thesis Defense" audits are from an affiliated entity

### Critical Risks

- **Bridge dependency**: If Wormhole NTT is compromised or paused, MUSD on Ethereum becomes non-redeemable until bridge is restored. The 2/4 pauser multisig has a low threshold.
- **New chain single point of failure**: All MUSD collateral lives on Mezo chain. If the Mezo chain experiences extended downtime or consensus failure, Ethereum MUSD holders cannot redeem.
- **Bootstrap loan**: 100M MUSD bootstrap loan into Stability Pool creates significant protocol-owned debt — the system's initial capitalization is not from organic demand.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [ ] **No audit** - Protocol has been audited (Cantina for MUSD, Halborn for chain/bridge)
- [ ] **Unverifiable reserves** - Reserves are on-chain on Mezo chain (verifiable, though requires cross-chain checking)
- [ ] **Total centralization** - 5/9 multisig (not a single EOA)

**All gates pass.** Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 1 independent MUSD audit (Cantina). Multiple bridge/chain audits (Halborn, OtterSec). Base code (Liquity V1) has 3+ audits from top firms. However, MUSD modifications only have 1 independent audit.
- **Bug Bounty**: No formal bug bounty — just a security email contact.
- **Time in Production**: ~3-4 weeks for MUSD. The base Liquity V1 code has been live 4+ years.
- **TVL**: ~$19.6M on Mezo chain. ~$2.6M MUSD on Ethereum.

Liquity V1's extensive audit history and 4+ year track record is a strong positive, but MUSD's own modifications have only 1 independent audit, no bug bounty, and extremely limited production time. The very short track record and lack of bug bounty push this toward a higher score.

**Score: 3.5/5** - Single independent audit on modifications, no bug bounty, <1 month in production. Strong underlying Liquity V1 base partially mitigates.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 5/9 multisig controls Ethereum MUSD (owner, bridge, upgrades)
- No timelock on Ethereum contracts
- Signers are anonymous EOAs
- Multisig can modify mint/burn whitelist (potential to add arbitrary minters)

**Governance Score: 3.5/5** - 5/9 multisig is reasonable but no timelock and anonymous signers reduce confidence.

**Subcategory B: Programmability**

- Core CDP operations are fully programmatic (Liquity V1 model)
- No PPS/rate manipulation surface
- Bridge relies on Wormhole Guardian network (semi-decentralized)
- Interest rates require governance intervention

**Programmability Score: 2/5** - Mostly programmatic system, algorithmic peg maintenance.

**Subcategory C: External Dependencies**

- tBTC (critical — sole collateral)
- Wormhole NTT (critical — only Ethereum bridge)
- Mezo chain (critical — where collateral lives)
- BTC/USD oracle (critical — collateral ratio calculation)

**Dependencies Score: 4/5** - Multiple critical dependencies, each of which is a potential single point of failure for Ethereum MUSD holders.

**Centralization Score = (3.5 + 2 + 4) / 3 = 3.17**

**Score: 3.2/5** - Reasonable multisig governance but no timelock, high external dependency risk, anonymous signers.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- 100%+ on-chain collateral (over-collateralized CDPs)
- BTC (via tBTC) is a high-quality asset, but tBTC adds bridge risk layer
- Collateral is on Mezo chain, not Ethereum — requires cross-chain verification
- Liquidation mechanics are proven (Liquity V1 model)

**Collateralization Score: 2.5/5** - Over-collateralized with BTC, but tBTC bridge layer and cross-chain verification complexity add risk.

**Subcategory B: Provability**

- Collateral verifiable on Mezo chain (ActivePool, DefaultPool)
- No exchange rate to verify (1:1 stablecoin)
- tBTC has proof of reserves at tbtcscan.com
- Cross-chain complexity: Ethereum holders must trust Mezo chain state

**Provability Score: 2.5/5** - On-chain verification exists but requires checking a different chain. tBTC PoR adds transparency.

**Funds Management Score = (2.5 + 2.5) / 2 = 2.5**

**Score: 2.5/5** - Well-collateralized with proven CDP mechanics, but cross-chain complexity and tBTC dependency add friction.

#### Category 4: Liquidity Risk (Weight: 15%)

- **DEX Liquidity**: ~$2.95M total across Ethereum DEXes
- **Pool Imbalance**: MUSD is 77-79% of Curve pools (significant imbalance indicating selling pressure)
- **Redemption**: Can redeem 1:1 for BTC on Mezo chain (minus 0.75% fee), but requires bridging back
- **Slippage**: >2-3% for $100K+ swaps on Ethereum
- **24h Volume**: ~$514K

The primary exit mechanism (Liquity redemption) works well but requires bridging back to Mezo. DEX liquidity on Ethereum is limited with significant pool imbalances.

**Score: 3.5/5** - Limited DEX liquidity (<$3M) with pool imbalances. Redemption exists but requires cross-chain bridge. Not suitable for large position exits on Ethereum without significant slippage.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Thesis is well-known, Matt Luongo (CEO) is public. Strong reputation in Bitcoin DeFi.
- **Documentation**: Good quality, comprehensive.
- **Legal Structure**: US-based company (Thesis) + Supernormal Foundation. Clear structure.
- **Incident Response**: Documented security policy, no incidents to test against.

**Score: 2/5** - Well-known team with strong track record, good documentation, clear legal structure.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.5 | 20% | 0.70 |
| Centralization & Control | 3.2 | 30% | 0.96 |
| Funds Management | 2.5 | 30% | 0.75 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 2.0 | 5% | 0.10 |
| **Final Score** | | | **3.035/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk (3.0/5.0)**

The protocol benefits from a battle-tested Liquity V1 codebase and an experienced team, but the very short production history, cross-chain complexity (Mezo chain + tBTC + Wormhole NTT), limited Ethereum liquidity, and lack of bug bounty place it firmly in the medium risk category. Enhanced monitoring is recommended, particularly around bridge operations, peg stability, and Mezo chain health.

---

## Reassessment Triggers

- **Time-based**: Reassess in 3 months (May 2026) — the protocol needs more production time
- **TVL-based**: Reassess if MUSD supply on Ethereum grows above $10M or drops below $1M
- **Liquidity-based**: Reassess if Ethereum DEX liquidity drops below $1M or Curve pool imbalances exceed 85%
- **Incident-based**: Reassess after any exploit, bridge pause, Mezo chain downtime, or significant peg deviation (>5%)
- **Governance-based**: Reassess if multisig threshold or signers change, or if a timelock is added
- **Audit-based**: Reassess when additional independent audits are completed or a formal bug bounty is launched
