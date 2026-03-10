# Protocol Risk Assessment: Noon

- **Assessment Date:** March 10, 2026
- **Token:** sUSN (Staked USN)
- **Chain:** Ethereum
- **Token Address:** [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D)
- **Final Score: 3.6/5.0**

## Overview + Links

Noon is a stablecoin protocol built around USN, a USD-pegged stablecoin backed 1:1 by USDT, USDC, or short-term U.S. Treasury Bills held in custodial wallets. sUSN is the staked version of USN — an ERC-4626 vault token that accrues yield from the protocol's diversified delta-neutral strategies.

The protocol generates returns through multiple strategies:
- **Funding rate arbitrage** — delta-neutral BTC/ETH positions capturing funding rates (custodian: Ceffu)
- **Tokenized U.S. Treasury Bills** — short-term sovereign debt (custodian: Alpaca Securities / Dinari)
- **Collateralized Loan Obligations (CLOs)** — Janus Henderson JAAA fund (custodian: Alpaca Securities)
- **Private credit** — Fasanara Fintech Tactical Credit Fund (F-TAC) (custodian: Fasanara Capital)
- **DeFi lending** — Euler and Morpho curated vaults (custodian: ForDefi MPC wallet)
- **Pendle Principal Tokens** — fixed-yield instruments (custodian: ForDefi)

Yield is distributed: **80%** to sUSN holders (via rebase), **10%** to the Noon Insurance Fund, **10%** to the Noon Operations Fund.

sUSN's value appreciates as the protocol mints new USN into the staking pool proportional to daily returns.

**Key metrics (on-chain verified, March 10, 2026):**
- Protocol TVL: ~$31M (DeFiLlama)
- USN total supply: 27,923,316 USN (`totalSupply()` on-chain)
- sUSN total supply: 20,647,638 sUSN (`totalSupply()` on-chain)
- sUSN total assets: 24,116,984 USN staked (`totalAssets()` on-chain)
- sUSN exchange rate: 1 sUSN = 1.1680 USN (`convertToAssets(1e18)` = 1,168,026,297,247,539,186)
- Chains: Ethereum (~$27.9M), Sophon (~$1.3M), TAC (~$1.0M), zkSync Era (~$0.8M)

**Yearn use case per issue #66:**
- Use sUSN as collateral on Morpho for sUSN/USDC market

**Links:**

- [Protocol Documentation](https://docs.noon.capital)
- [Protocol App](https://app.noon.capital)
- [DeFiLlama](https://defillama.com/protocol/noon)
- [Proof of Solvency Dashboard](https://noon.accountable.capital/)
- [Mirror Blog](https://mirror.xyz/nooncapital.eth)
- [Twitter/X](https://x.com/ag_noon)
- [CoinGecko](https://www.coingecko.com/en/coins/staked-usn)

## Contract Addresses

### Core Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| USN | [`0xdA67B4284609d2d48e5d10cfAc411572727dc1eD`](https://etherscan.io/address/0xdA67B4284609d2d48e5d10cfAc411572727dc1eD) | TransparentUpgradeableProxy → USNUpgradeableHyperlane |
| sUSN (Staking Vault) | [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D) | TransparentUpgradeableProxy → StakingVaultOFTUpgradeableHyperlane |
| MinterHandlerV2 | [`0xB91b361ebE4022Bb62dF0651bDD09b21209ac058`](https://etherscan.io/address/0xB91b361ebE4022Bb62dF0651bDD09b21209ac058) | Non-proxy, minting logic |

### Proxy Infrastructure

| Contract | ProxyAdmin | ProxyAdmin Owner |
|----------|-----------|-----------------|
| USN | [`0x55f39512cb43111a13e8440ee3e3602e72628239`](https://etherscan.io/address/0x55f39512cb43111a13e8440ee3e3602e72628239) | 3-of-6 Multisig |
| sUSN | [`0x1908284b50ee152c9f00c8e65a81fc1c4520bd81`](https://etherscan.io/address/0x1908284b50ee152c9f00c8e65a81fc1c4520bd81) | 3-of-6 Multisig |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| Multisig | [`0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f`](https://etherscan.io/address/0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f) | 3-of-6 Gnosis Safe v1.4.1, all anonymous signers (on-chain verified via `getThreshold()` and `getOwners()`) |

### Collateral Wallets (Ethereum)

| Wallet | Address | Type |
|--------|---------|------|
| Noon Collateral 1 | [`0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089`](https://etherscan.io/address/0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089) | 4-of-5 Gnosis Safe (on-chain verified) |
| Noon Collateral 2 | [`0x1b2262903Fdb0a8eb84291cC227426be590c4503`](https://etherscan.io/address/0x1b2262903Fdb0a8eb84291cC227426be590c4503) | 3-of-4 Gnosis Safe (on-chain verified) |
| Noon Collateral 3 | [`0x4fD04553468610e5a88a2cffA38E057C954312Da`](https://etherscan.io/address/0x4fD04553468610e5a88a2cffA38E057C954312Da) | **EOA** (on-chain verified — no contract code) |

### On-Chain Verification (Etherscan + cast, March 10, 2026)

| Contract | Name | Verified | Proxy | Implementation |
|----------|------|----------|-------|----------------|
| USN | TransparentUpgradeableProxy → USNUpgradeableHyperlane | Yes | Yes | [`0x6bdC8104ec827cd48b9cac526420b59a31bc8397`](https://etherscan.io/address/0x6bdC8104ec827cd48b9cac526420b59a31bc8397) |
| sUSN | TransparentUpgradeableProxy → StakingVaultOFTUpgradeableHyperlane | Yes | Yes | [`0xD1fFb6a6a42c86b931b2a6d388d1f25c1c775b34`](https://etherscan.io/address/0xD1fFb6a6a42c86b931b2a6d388d1f25c1c775b34) |
| MinterHandlerV2 | MinterHandlerV2 | Yes | No | — |
| Multisig | GnosisSafeProxy (Safe v1.4.1) | Yes | Yes | — |

**On-chain ownership verification (via `cast`):**
- USN `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig) ✓
- sUSN `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig) ✓
- USN ProxyAdmin `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig) ✓
- sUSN ProxyAdmin `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig) ✓
- Multisig `getThreshold()` → 3, `getOwners()` → 6 signers ✓

**Withdrawal period**: The sUSN vault delegates withdrawal logic to a separate handler via `setWithdrawalHandler()`. The withdrawal period is not exposed as a direct public view function on the sUSN contract. The `WithdrawPeriodUpdated` event and `WithdrawPeriodNotElapsed` error in the ABI confirm a configurable cooldown exists. Documentation states T+5 maximum (20% at T+0, 60% at T+3, 100% at T+5).

## Audits and Due Diligence Disclosures

### Audit History

| # | Firm | Date | Scope | Findings | Status | Report |
|---|------|------|-------|----------|--------|--------|
| 1 | **Quantstamp** | Sep 2024 | Initial smart contracts | Unknown | Unknown | No public report found |
| 2 | **Halborn** | Dec 16-19, 2024 | Noon Core (USN, Staking Vault, MinterHandler, Withdrawal/Redeem handlers) | 0C, 2H, 2M, 2L, 2I | 100% resolved | [Report](https://www.halborn.com/audits/dclm-noon/noon-core) |
| 3 | **Halborn** | Mar 26-27, 2025 | Staking Vault (Hyperlane cross-chain) | 0C, 0H, 1M, 1L | 100% resolved | [Report](https://www.halborn.com/audits/noon-capital-stablecoin/staking-vault-c3c4ef) |
| 4 | **Hashlock** | Jun 2025 | NOON governance token, Stake, Vesting | "Secure" rating | All resolved | [PDF](https://hashlock.com/wp-content/uploads/2025/07/Noon-Capital-Smart-Contract-Audit-Report-Final-Report-v3.pdf) |
| 5 | **Hashlock** | Nov 2025 | Updates | "Secure" rating | All resolved | [PDF](https://hashlock.com/wp-content/uploads/2025/07/Noon-Capital-2nd-Smart-Contract-Audit-Report-Final-Report-v1.pdf) |

**Key findings from Halborn Core audit (all resolved):**
- **H:** Implement mechanisms against donation attacks in the vault
- **H:** Remove a check creating a DOS in the redeem function
- **M:** Re-implement the 2% difference between USN/Collateral when USN is minted
- **M:** Implement a check to prevent the rebasing role from breaking the vault

**Concerns:**
- The Quantstamp audit (2024) has no publicly accessible report or certificate — cannot verify scope or findings
- Halborn's second audit was only 2 days long (March 26-27, 2025) and covered only cross-chain extensions
- Hashlock is a less well-known audit firm compared to tier-1 firms (Trail of Bits, Cyfrin, OpenZeppelin)
- No audit of the MinterHandlerV2 contract specifically (the current deployed version)

### On-Chain Complexity

The architecture is moderately complex:
- **Upgradeable proxies**: Both USN and sUSN use OpenZeppelin TransparentUpgradeableProxy
- **ERC-4626 vault**: sUSN implements the ERC-4626 tokenized vault standard for USN staking
- **Cross-chain**: Both tokens integrate LayerZero OFT and Hyperlane for multi-chain bridging
- **RBAC**: Role-based access control with `DEFAULT_ADMIN_ROLE`, `REBASE_MANAGER_ROLE`, `BLACKLIST_MANAGER_ROLE`, `MINTER_ROLE`
- **Withdrawal handler**: Redemptions go through a separate handler contract (not direct ERC-4626 withdraw)
- **Blacklist/whitelist**: Both contracts have blacklisting capabilities that can freeze user funds

### Bug Bounty

**No active bug bounty program found.** Searched Immunefi, Sherlock, Cantina, HackerOne, and Safe Harbor — no listings for Noon Capital. The documentation does not mention a bug bounty or responsible disclosure policy. This is a notable gap.

## Historical Track Record

- **USN deployment**: October 3, 2024 (block 20884046) — ~17 months on-chain
- **sUSN deployment**: November 6, 2024 (block 21130318) — ~16 months on-chain
- **Public beta launch**: January 25, 2025 — ~14 months of active usage
- **GitHub**: Private repository (`dclf-labs/Noon-Core-Audit`), not public
- **Incidents**: No reported security incidents, exploits, or hacks found
- **TVL History**:

| Period | TVL | Notes |
|--------|-----|-------|
| Jan 2025 | ~$28.5M | Public beta launch, peak TVL |
| Mar 2025 (early) | ~$16.6M | Significant dip |
| Mar 2025 (late) | ~$28M | Recovery |
| Mar 2026 | ~$31M | Current (Ethereum ~$27.9M, Sophon ~$1.3M, TAC ~$1.0M, zkSync Era ~$0.8M) |

- **TVL Volatility**: The protocol experienced a ~42% drawdown (from $28.5M to $16.6M) in early March 2025 but recovered. TVL has grown to ~$31M, with a notable shift toward Ethereum (from ~$21.3M to ~$27.9M) while zkSync Era dropped from ~$3.3M to ~$0.8M.
- **Exchange rate (on-chain verified March 10, 2026)**:
  - `convertToAssets(1e18)` = 1,168,026,297,247,539,186 = 1.1680 USN per sUSN
  - `totalAssets()` = 24,116,984,220,685,763,950,027,012 = 24,116,984 USN
  - `totalSupply()` = 20,647,638,051,915,079,811,578,141 = 20,647,638 sUSN
  - `maxRedeem(address)` = 0 (direct ERC-4626 redemption disabled)
  - As an ERC-4626 vault, the exchange rate should only increase. The 16.8% appreciation over ~16 months implies ~12.6% annualized yield.
- **USN Peg**: No reported depegging events found. USN is backed 1:1 by USDT/USDC/T-Bills.

## Funds Management

### Deposit/Withdrawal Flow

**Minting USN**: Institutional/permissioned users mint USN by depositing USDT or USDC through the MinterHandlerV2 contract. On-chain verified safeguards:
- `mintLimitPerBlock`: 10,000,000 USN (1e25 wei)
- `directMintLimitPerDay`: 10,000,000 USN (1e25 wei)
- `rebaseLimit`: 50,000 USN (5e22 wei)
- `priceThresholdBps`: 50 (0.5%)
- `custodialWallet`: [`0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089`](https://etherscan.io/address/0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089) (Noon Collateral 1)

Retail users buy USN on DEXes.

**Staking to sUSN**: Users deposit USN into the sUSN vault (ERC-4626). Shares are minted proportional to the current exchange rate.

**Withdrawal from sUSN**: `maxRedeem()` currently returns **0** — direct ERC-4626 redemption is disabled. Users must call `createWithdrawalRequest()` which routes through a withdrawal handler. The protocol guarantees 100% of TVL redeemable within T+5 days:
- T+0: 20% of TVL accessible
- T+3: 60% of TVL accessible
- T+5: 100% of TVL accessible

Alternatively, users can sell sUSN on DEXes for immediate (but potentially slippage-impacted) liquidity.

### Accessibility

- **USN minting**: Restricted to permissioned/whitelisted addresses via MinterHandler. Currently in "permissionless" transfer mode (anyone can transfer USN)
- **sUSN staking**: Anyone can deposit USN to receive sUSN
- **sUSN redemption**: Subject to withdrawal request + cooldown period (up to 5 days). Not atomic
- **Fees**: Not explicitly documented in public sources

### Collateralization

- **Backing**: USN is backed 1:1 by USDT, USDC, or short-term U.S. Treasury Bills. Collateral is held by custodians:
  - **Ceffu** — funding rate arbitrage (off-exchange, tri-partite settlement)
  - **Alpaca Securities** (via Dinari) — T-Bills and CLOs (FINRA member, SIPC + Lloyd's of London insurance)
  - **Fasanara Capital** — private credit (F-TAC fund, $6B AUM)
  - **ForDefi** — DeFi strategies (institutional MPC wallet, on-chain visibility)
- **On-chain collateral**: Only DeFi strategies (Euler, Morpho, Pendle) are visible on-chain via ForDefi wallets. The majority of collateral is **off-chain/custodial**
- **Insurance layers**: Nexus Mutual (DeFi smart contract risk), SIPC + Lloyd's of London (TradFi custodial), and internal Insurance Fund (10% of revenue)
- **No on-chain over-collateralization mechanism**: Unlike protocols with on-chain liquidation and collateral ratios, USN relies on custodial backing with periodic verification
- **Private credit exposure**: Fasanara F-TAC positions have **T+3 month redemption windows**, creating potential liquidity mismatch with the T+5 day user redemption guarantee

### Provability

- **Proof of Solvency**: Partnership with Accountable provides real-time, independent verification using zero-knowledge proofs and secure enclaves. Dashboard at [noon.accountable.capital](https://noon.accountable.capital/)
- **On-chain verifiability**: sUSN exchange rate is programmatic on-chain (ERC-4626). DeFi strategy positions visible via ForDefi wallets on-chain
- **Off-chain reserves**: TradFi positions (T-Bills, CLOs, private credit, CEX funding rate arb) are **not on-chain verifiable**. Users must trust Accountable's verification and custodian attestations
- **Yield distribution**: Rebase mechanism — protocol mints new USN into the staking pool via `REBASE_MANAGER_ROLE`. The rebase amount is controlled by the team (up to `rebaseLimit` of ~50K USN per transaction)
- **Collateral self-dealing prohibition**: Documentation states Noon never redeploys assets back into Noon or lends to vaults accepting USN as collateral

## Liquidity Risk

### Primary Exit Mechanisms

1. **Withdrawal request from sUSN vault**: `createWithdrawalRequest()` → cooldown → claim. T+5 maximum (20% at T+0, 60% at T+3, 100% at T+5). Not instant
2. **DEX swap**: USN/sUSN pool on Uniswap V3 (Ethereum) with ~$33K USN 24h volume and ~$156 sUSN 24h volume (CoinGecko). Extremely thin liquidity for a $31M protocol
3. **USN redemption to stablecoins**: Permissioned institutional redemption via the dApp (subject to daily limits during public beta)

### Liquidity Assessment

- **Primary liquidity**: The main exit path is through the cooldown-based withdrawal mechanism (up to 5 days)
- **Secondary market**: DEX liquidity is negligible (~$33K USN daily volume, ~$156 sUSN daily volume per CoinGecko). sUSN has virtually no secondary market liquidity
- **On-chain maxRedeem = 0**: Direct ERC-4626 redemption is disabled. Must use withdrawal handler
- **Same-value redemption**: sUSN redeems for USN (stablecoin-denominated), so price change risk is minimal for the Morpho collateral use case
- **Liquidity mismatch**: The protocol promises T+5 full redemption, but private credit positions (Fasanara F-TAC) have T+3 month redemption. If a significant portion of TVL is in private credit, a bank-run scenario could stress the redemption guarantee
- **Small TVL**: At ~$31M, the protocol is small. Large positions relative to TVL could create concentration risk

### Morpho Market (sUSN/USDC)

| Parameter | Value |
|-----------|-------|
| Market ID | `0x8924445a76b678c536df977ed9222fb0b23ee5311497dd0223fe6270bb20b4e6` |
| Collateral | sUSN ([`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D)) |
| Loan Token | USDC ([`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) |
| Oracle | MorphoChainlinkOracleV2 ([`0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa`](https://etherscan.io/address/0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa)) |
| IRM | AdaptiveCurveIrm ([`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)) |
| LLTV | 86% |
| Total Supply | ~$8.3M USDC |
| Total Borrow | ~$7.4M USDC |
| Utilization | ~89.6% |

### Morpho Oracle Analysis (on-chain verified)

The oracle is a `MorphoChainlinkOracleV2` that combines three data sources:

1. **BASE_VAULT** (sUSN→USN conversion): Reads `convertToAssets()` directly from the sUSN vault contract — **on-chain, trustless**
2. **BASE_FEED_1** (USN/USD price): Stork oracle adapter — returns $1.00 (1e18 with 18 decimals)
3. **QUOTE_FEED_1** (USDC/USD price): Chainlink feed — returns ~$0.9999 (99,997,640 with 8 decimals)

The oracle formula: `price = vault_conversion * baseFeed1 * SCALE_FACTOR / quoteFeed1`

| Parameter | Address | Description | Current Value |
|-----------|---------|-------------|---------------|
| BASE_VAULT | [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D) | sUSN vault (ERC-4626 exchange rate) | 1.1680 USN/sUSN |
| BASE_VAULT_CONVERSION_SAMPLE | — | Conversion sample amount | 1e8 |
| BASE_FEED_1 | [`0x6e498b02C0036235c8164A502b0eECC7660BD889`](https://etherscan.io/address/0x6e498b02C0036235c8164A502b0eECC7660BD889) | StorkChainlinkAdapter (USN/USD) | 1e18 (=$1.00) |
| BASE_FEED_2 | `0x0` | Not set | — |
| QUOTE_FEED_1 | [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) | Chainlink USDC/USD (8 dec) | 99,992,975 (=$0.9999) |
| QUOTE_FEED_2 | `0x0` | Not set | — |
| SCALE_FACTOR | — | Decimal adjustment | 1,000,000 |
| **price()** | — | **Final oracle price** | **1,168,108,349,611,560,212,104,900 (~1.168 USDC/sUSN)** |

**Stork adapter details:**
- Description: `"A port of a chainlink aggregator powered by Stork"`
- Returns via `latestRoundData()`: roundId, answer, startedAt, updatedAt, answeredInRound — all fields except `answer` return the same value (1,773,040,009,161,351,644), which does **not** appear to be a valid Unix timestamp. This means **staleness checks based on `updatedAt` will not work correctly**.

**Oracle concerns:**
- **Positive**: The sUSN→USN exchange rate is read directly from the vault contract on-chain (trustless, manipulation-resistant)
- **Stork USN/USD feed risk**: If USN depegs (e.g., drops to $0.90) but the Stork feed continues reporting $1.00, the oracle would **overvalue sUSN collateral**, allowing borrowers to extract more than their collateral is worth. This is the primary oracle risk
- **Stork is newer**: Less battle-tested than Chainlink. The adapter's non-standard `latestRoundData()` timestamps suggest incomplete Chainlink interface compliance
- **Single oracle source for USN/USD**: No redundant oracle or fallback. If Stork fails or returns stale data during a USN depeg, liquidations would malfunction
- **86% LLTV is aggressive** for an asset with a 5-day withdrawal window — liquidators may struggle to unwind sUSN collateral quickly through DEXes with only ~$33K USN daily volume and ~$156 sUSN daily volume

## Centralization & Control Risks

### Governance

The entire protocol is controlled by a single 3-of-6 Gnosis Safe multisig with **no timelock**:

| Role | Controlled By | Description |
|------|---------------|-------------|
| ProxyAdmin Owner (USN) | 3-of-6 Multisig | Can upgrade USN implementation immediately |
| ProxyAdmin Owner (sUSN) | 3-of-6 Multisig | Can upgrade sUSN implementation immediately |
| USN Owner (Ownable2Step) | 3-of-6 Multisig | Blacklisting, whitelist, admin settings |
| sUSN DEFAULT_ADMIN_ROLE | 3-of-6 Multisig | All role grants, rescue tokens, treasury settings |
| MinterHandler DEFAULT_ADMIN_ROLE | 3-of-6 Multisig | Mint limits, custodial wallet, oracle settings |
| REBASE_MANAGER_ROLE | Granted by Multisig | Controls yield distribution (rebase) |
| BLACKLIST_MANAGER_ROLE | Granted by Multisig | Can freeze user funds |
| MINTER_ROLE | Granted by Multisig | Can mint USN (via MinterHandler) |

**Key governance concerns:**
- **No timelock**: The 3-of-6 multisig can upgrade both USN and sUSN contracts **immediately**. No delay for review or cancellation. This is a critical governance weakness
- **All anonymous signers**: All 6 multisig signers are anonymous EOAs. No known entities or independent signers
- **rescueToken()**: The sUSN vault has a function allowing the owner to extract any ERC-20 tokens from the vault — potential extraction vector if the multisig is compromised
- **Blacklist**: Both USN and sUSN have blacklisting capabilities. The multisig can freeze user funds at any time
- **Rebase control**: The `REBASE_MANAGER_ROLE` controls yield distribution. A compromised rebase manager could manipulate the sUSN exchange rate
- **No Guardian or independent oversight**: Unlike protocols with independent Guardians or timelocked governance, Noon has a single multisig controlling everything
- **Ownable2Step**: USN uses two-step ownership transfer, which is a positive security measure

### Programmability

- **sUSN exchange rate**: Calculated on-chain via ERC-4626 standard. Programmatic
- **Yield distribution**: Via rebase — the `REBASE_MANAGER_ROLE` mints USN into the staking pool. This is a **manual, privileged operation**, not a programmatic yield accrual
- **Minting**: MinterHandler has safeguards (per-block limits, daily limits, price thresholds), but minting is ultimately controlled by privileged roles
- **Withdrawals**: Go through a handler contract. The withdrawal period is configurable by the admin (via `WithdrawPeriodUpdated` event)

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **Ceffu** | Custodian (CEX arb) | **Critical** | Loss of funds in funding rate positions |
| **Alpaca Securities / Dinari** | Custodian (TradFi) | **Critical** | Loss of T-Bill and CLO positions |
| **Fasanara Capital** | Custodian (private credit) | **High** | Loss of private credit positions, T+3mo redemption |
| **ForDefi** | MPC wallet (DeFi) | **High** | Loss of DeFi strategy positions |
| **Stork** | Oracle (Morpho market) | **High** | Oracle failure could cause incorrect liquidations |
| **LayerZero / Hyperlane** | Cross-chain bridges | **Medium** | Bridge exploit could affect cross-chain sUSN |
| **Accountable** | Proof of solvency | **Medium** | Loss of reserve transparency |
| **Nexus Mutual** | DeFi insurance | **Low** | Loss of smart contract risk coverage |

**Key dependency risk**: Noon has **multiple critical custodial dependencies**. Unlike fully on-chain protocols, the majority of reserves are held off-chain with custodians. A custodian failure, hack, or insolvency would directly impact USN backing. The protocol is fundamentally a **custodial stablecoin** with on-chain token wrappers.

## Operational Risk

- **Team transparency**: Founder **Arpan Gautam** is publicly identified — Wharton MBA, ex-McKinsey, ex-Dexterity Capital CFO, founded DCLF Labs / Noon Capital in June 2024. Other team members are not publicly identified. Fauve Altman (marketing) is partially known. All multisig signers are anonymous
- **Documentation**: Good quality. Comprehensive docs at docs.noon.capital covering safety framework, strategies, custody, and governance principles. Actively maintained
- **Legal structure**: **British Virgin Islands (BVI)** jurisdiction via DCLF Labs. Limited regulatory oversight and investor protection. Self-funded (no VC)
- **Incident response**: Documented 24-hour incident plan with "predefined response procedures, rollback capabilities, and emergency communication channels." Admin Multisig can pause the protocol immediately
- **Source code**: Private GitHub repository (`dclf-labs/Noon-Core-Audit`). **Not open source**. Contracts are verified on Etherscan but source is not publicly browsable
- **Token allocation**: 20% to team with 7-year lockup (1-year cliff + 6-year linear vesting)

## Monitoring

### sUSN Vault Monitoring

- **sUSN contract**: [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D)
  - Monitor `convertToAssets(1e18)` for exchange rate changes (should only increase)
  - **Alert**: If exchange rate **decreases** — indicates potential issue with rebase or loss event
  - Monitor `Rebase(amount)` events for yield distribution frequency and amounts
  - Monitor `Deposit`, `Withdraw` events for large movements (>$500K given ~$31M TVL)
  - **Alert**: Single deposits/withdrawals >$2M

### USN Token Monitoring

- **USN contract**: [`0xdA67B4284609d2d48e5d10cfAc411572727dc1eD`](https://etherscan.io/address/0xdA67B4284609d2d48e5d10cfAc411572727dc1eD)
  - Monitor `totalSupply()` for unexpected minting events
  - **Alert**: Minting >10M USN in a single day (matches `directMintLimitPerDay`)
  - Monitor `Transfer` events from/to collateral wallets

### Governance Monitoring

- **Multisig**: [`0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f`](https://etherscan.io/address/0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change
  - Monitor for proxy upgrade transactions (`upgradeAndCall` on ProxyAdmin contracts)
  - **Alert**: Immediately on any proxy upgrade — **no timelock means upgrade is instant**
- **RBAC changes** (on sUSN and MinterHandler):
  - Monitor `RoleGranted`, `RoleRevoked` events
  - **Alert**: Immediately on any role change
- **Blacklist events** (on USN and sUSN):
  - Monitor `blacklistAccount`, `unblacklistAccount` calls
  - **Alert**: Immediately if any address is blacklisted
- **Withdrawal period changes** (on sUSN):
  - Monitor `WithdrawPeriodUpdated` events
  - **Alert**: Immediately on any cooldown period change

### Collateral Wallet Monitoring

- **Noon Collateral 1**: [`0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089`](https://etherscan.io/address/0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089) (4-of-5 Safe)
- **Noon Collateral 2**: [`0x1b2262903Fdb0a8eb84291cC227426be590c4503`](https://etherscan.io/address/0x1b2262903Fdb0a8eb84291cC227426be590c4503) (3-of-4 Safe)
- **Noon Collateral 3**: [`0x4fD04553468610e5a88a2cffA38E057C954312Da`](https://etherscan.io/address/0x4fD04553468610e5a88a2cffA38E057C954312Da) (**EOA** — higher risk, no multisig protection)
  - Monitor for large outflows from all wallets
  - **Alert**: If total collateral wallet balances drop significantly relative to USN total supply
  - **Alert**: Any outflows from Collateral 3 (EOA) should be reviewed

### USN Peg Monitoring

- **USN price**: Monitor USN/USD price on CoinGecko and DEXes
  - **Alert**: If USN deviates >0.5% from $1.00 peg (significant depegging)
  - **Alert**: If USN deviates >2% from $1.00 peg (critical — directly impacts sUSN collateral value via Stork oracle risk)
  - Current price: $0.9997 (well-pegged, March 10, 2026)

### Morpho Market Monitoring

- **Oracle**: [`0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa`](https://etherscan.io/address/0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa)
  - Monitor oracle price for staleness or deviation from sUSN vault exchange rate
  - **Alert**: If Stork feed deviates >1% from sUSN's on-chain `convertToAssets()` value
- **Stork Base Feed**: [`0x6e498b02C0036235c8164A502b0eECC7660BD889`](https://etherscan.io/address/0x6e498b02C0036235c8164A502b0eECC7660BD889)
  - Monitor for staleness or unexpected answer changes

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Proxy upgrade events | Real-time | Critical |
| Multisig signer/threshold changes | Real-time | Critical |
| sUSN exchange rate decrease | Every 6 hours | Critical |
| Blacklist events (USN/sUSN) | Real-time | Critical |
| RBAC role changes | Real-time | Critical |
| Withdrawal period changes | Real-time | Critical |
| Rebase events | Daily | High |
| USN total supply changes | Daily | High |
| Collateral wallet balances | Daily | High |
| Collateral 3 (EOA) outflows | Real-time | High |
| Morpho oracle price vs sUSN rate | Every 6 hours | High |
| USN peg stability | Hourly | High |
| Protocol TVL changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Diversified yield sources**: Multiple uncorrelated strategies (funding rate arb, T-Bills, CLOs, DeFi lending, Pendle PTs) reduce single-strategy risk
- **Independent solvency verification**: Real-time proof of solvency via Accountable partnership with zero-knowledge proofs and secure enclaves
- **Layered insurance**: Nexus Mutual (DeFi), SIPC + Lloyd's of London (TradFi), and internal Insurance Fund provide multiple layers of coverage
- **Institutional custodians**: Ceffu, Alpaca Securities (FINRA/SIPC), and Fasanara Capital are established institutional custodians
- **Self-dealing prohibition**: Protocol explicitly avoids circular collateral dependencies

### Key Risks

- **No timelock on governance**: The 3-of-6 multisig can upgrade contracts, change parameters, and extract tokens **immediately** with no delay. This is the most critical governance weakness
- **Mostly off-chain/custodial reserves**: The majority of USN backing is held off-chain with custodians. On-chain verifiability is limited to DeFi strategy positions only
- **No bug bounty program**: No formal bug bounty on any platform despite ~$31M TVL
- **Anonymous multisig signers**: All 6 signers are anonymous EOAs. No independent or known-entity signers
- **Small and young protocol**: ~$31M TVL with ~14 months of public beta operation. Limited track record
- **5-day withdrawal lockup**: Not compatible with instant liquidation needs on Morpho
- **Private code**: Source code is not publicly available (private GitHub repository)
- **BVI jurisdiction**: Limited regulatory oversight and investor protection

### Critical Risks

- **Immediate proxy upgrade**: The multisig can change the USN or sUSN contract logic at any time without warning. A compromised multisig could drain all funds instantly via a malicious upgrade
- **rescueToken() function**: The sUSN vault owner can extract any ERC-20 tokens from the vault. Combined with no timelock, this is a significant extraction vector
- **Liquidity mismatch**: Private credit positions (Fasanara F-TAC) have T+3 month redemption windows while the protocol promises T+5 day user redemptions. A bank-run scenario could break the redemption guarantee
- **Stork oracle risk**: The Morpho market relies on a single Stork oracle feed with no fallback. A Stork outage or manipulation could cause incorrect liquidations
- **Blacklist capability**: Both USN and sUSN can blacklist addresses, freezing user funds without recourse

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Protocol audited by Halborn (2x) and Hashlock (2x). Quantstamp audit unverifiable. **PASS** (marginal — Quantstamp audit cannot be verified)
- [ ] **Unverifiable reserves** — The majority of reserves are held off-chain with custodians. While Accountable provides independent verification, reserves are **not fully on-chain verifiable**. Accountable is a third-party service, not a trustless on-chain mechanism. **BORDERLINE** — the Accountable partnership provides verification but the reserves themselves are custodial
- [x] **Total centralization** — 3-of-6 Gnosis Safe multisig. Not a single EOA. **PASS** (though the lack of timelock is very concerning)

**All gates technically pass** (Accountable provides a verification mechanism, even if off-chain). Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 2 audits by Halborn (reputable), 2 audits by Hashlock (lesser-known). Quantstamp audit unverifiable. Total: 4 verifiable audits across 2 firms
- **Bug Bounty**: None
- **Time in Production**: ~14 months public beta, ~16 months sUSN on-chain. Young protocol
- **TVL**: ~$31M. Small
- **Incidents**: None reported

**Score: 3.5/5** — Multiple audits but from a mix of reputable (Halborn) and lesser-known (Hashlock) firms. Quantstamp audit is unverifiable. No bug bounty. Production history of ~14 months beta. Small TVL (~$31M). Between score 3 (1 audit by reputable firm, 6-12 months, TVL >$10M) and score 4 (1 audit by lesser-known firm, 3-6 months, TVL <$10M). The multiple Halborn audits and 14-month track record prevent a score of 4, but the absence of a bug bounty, small TVL, and unverifiable Quantstamp audit prevent a score of 3.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-6 multisig with all anonymous signers
- **No timelock** — all changes are immediate
- Proxy upgrades can be executed instantly
- Blacklist capability on both tokens
- rescueToken() function allows token extraction
- Ownable2Step provides ownership transfer safety

**Governance Score: 4.5** — The 3-of-6 threshold is between score 3 and score 4. However, the **complete absence of a timelock** is a critical deficiency that pushes this firmly toward score 4-5. The combination of no timelock + anonymous signers + proxy upgradeability + rescueToken() + blacklisting approaches score 5 (unlimited admin powers). The multisig structure and Ownable2Step prevent a full 5.

**Subcategory B: Programmability**

- sUSN exchange rate: on-chain via ERC-4626. Programmatic
- Yield distribution: via manual rebase by privileged role. **Not programmatic**
- Minting: controlled by MinterHandler with safeguards but privileged roles
- Withdrawal period: configurable by admin
- Accounting: mix of on-chain (ERC-4626) and off-chain (custodial positions)

**Programmability Score: 3.5** — The ERC-4626 vault mechanics are programmatic, but yield distribution is manual (rebase), withdrawal parameters are admin-controlled, and most accounting is off-chain with custodians. Between score 3 (hybrid) and score 4 (significant manual intervention).

**Subcategory C: External Dependencies**

- **Critical**: Multiple custodians (Ceffu, Alpaca/Dinari, Fasanara, ForDefi)
- **High**: Stork oracle (Morpho market)
- **High**: LayerZero and Hyperlane (cross-chain bridges)
- **Medium**: Accountable (solvency verification)
- Multiple critical dependencies with varying levels of trust

**Dependencies Score: 4.0** — Many dependencies including multiple custodians, a newer oracle provider (Stork), and two bridge protocols. Critical functionality (reserve custody) depends on multiple external parties. Failure of any single custodian could partially break the system.

**Centralization Score = (4.5 + 3.5 + 4.0) / 3 = 4.0**

**Score: 4.0/5** — The absence of a timelock is the dominant factor. The 3-of-6 multisig with all anonymous signers, instant proxy upgradeability, rescueToken(), blacklisting, manual rebase, and multiple custodial dependencies create an elevated centralization risk profile.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- USN backed 1:1 by USDT/USDC/T-Bills — good collateral quality
- Collateral held by institutional custodians (Ceffu, Alpaca Securities, Fasanara)
- SIPC + Lloyd's of London insurance on TradFi positions
- No on-chain over-collateralization mechanism
- Private credit positions have T+3 month redemption (liquidity mismatch)
- Collateral verification via Accountable (not on-chain)

**Collateralization Score: 3.5** — High-quality collateral (stablecoins, T-Bills) but held off-chain with custodians. Between score 3 (100% collateral, some off-chain, periodic attestation) and score 4 (partially collateralized or custodial, opaque). The institutional custodians and insurance layers prevent a full score of 4, but the off-chain custody and liquidity mismatch prevent a score of 3.

**Subcategory B: Provability**

- sUSN exchange rate: fully on-chain (ERC-4626)
- DeFi strategy positions: visible on-chain via ForDefi wallets
- TradFi positions (T-Bills, CLOs, private credit, CEX arb): **not on-chain verifiable**
- Accountable provides independent verification, but it's a third-party service
- Rebase amounts are set by privileged role

**Provability Score: 3.5** — Hybrid on-chain/off-chain. The sUSN layer is transparent but the underlying reserve composition is opaque from an on-chain perspective. Accountable provides attestation but is not trustless. Between score 3 (hybrid, known custodian attestation) and score 4 (primarily off-chain, infrequent reporting). The real-time Accountable verification prevents a score of 4.

**Funds Management Score = (3.5 + 3.5) / 2 = 3.5**

**Score: 3.5/5** — USN has good collateral quality and institutional custodians, but the predominantly off-chain custody model limits on-chain verifiability. The Accountable partnership provides some transparency but is not a trustless mechanism.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: Withdrawal request + up to 5-day cooldown. Not instant
- **DEX liquidity**: ~$33K USN daily volume, ~$156 sUSN daily volume (CoinGecko). Negligible for a $31M protocol
- **maxRedeem = 0**: Direct ERC-4626 redemption disabled. Must use withdrawal handler
- **Liquidity mismatch**: Private credit positions have T+3 month redemption vs T+5 day user guarantee
- **Same-value redemption**: sUSN redeems for USN (stablecoin-denominated)
- **Small TVL**: Large positions could dominate TVL and create concentration risk
- **Morpho context**: 5-day withdrawal delay makes liquidation of sUSN collateral slow — could be problematic at 86% LLTV

**Score: 3.5/5** — Withdrawals require up to 5 days and go through a handler process. DEX liquidity is negligible (~$33K USN daily, ~$156 sUSN daily). The same-value stablecoin redemption is a positive factor. Between score 3 (market-based or short queues, >$1M, 3-7 days exit) and score 4 (withdrawal queues or restrictions, <$1M, >1 week or >10% impact). The 5-day maximum and extremely thin DEX liquidity push toward 3.5. The Morpho collateral use case introduces additional concern: if sUSN needs to be liquidated, the 5-day withdrawal delay could prevent timely liquidation.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Founder Arpan Gautam publicly identified (Wharton, McKinsey, Dexterity Capital). Other team members mostly unknown. Multisig signers all anonymous
- **Documentation**: Good quality, comprehensive safety framework documentation
- **Legal Structure**: BVI (DCLF Labs). Limited regulatory protection. Self-funded
- **Source code**: Private repository. Not open source
- **Incident Response**: Documented 24-hour plan with emergency pause capability

**Score: 3.5/5** — Founder is doxxed with strong credentials, but the rest of the team and all multisig signers are unknown. Good documentation. BVI jurisdiction with limited oversight. Private source code. Between score 3 (mixed known/unknown, adequate docs, uncertain structure) and score 4 (mostly unknown, poor docs, no clear entity).

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.5 | 20% | 0.70 |
| Centralization & Control | 4.0 | 30% | 1.20 |
| Funds Management | 3.5 | 30% | 1.05 |
| Liquidity Risk | 3.5 | 15% | 0.525 |
| Operational Risk | 3.5 | 5% | 0.175 |
| **Final Score** | | | **3.65** |

**Final Score: 3.6** (rounded to 1 decimal)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| 2.5-3.5 | Medium Risk | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | **Limited approval, strict limits** |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Elevated Risk**

---

Noon's sUSN is a yield-bearing staked stablecoin backed by diversified strategies with institutional custodians and independent solvency verification. The ERC-4626 vault mechanics are standard and transparent.

However, the protocol has significant centralization concerns: **no timelock** on a 3-of-6 anonymous multisig that can instantly upgrade both contracts, extract tokens via `rescueToken()`, and blacklist addresses. The predominantly **off-chain custodial** reserve model limits on-chain verifiability, and the **5-day withdrawal delay** creates compatibility challenges with the intended Morpho collateral use case (86% LLTV with slow liquidation path).

**For the intended Yearn use case (sUSN as Morpho collateral):**

The 5-day withdrawal lockup is the primary compatibility concern flagged in the issue. If sUSN collateral needs to be liquidated on Morpho, the liquidator cannot redeem sUSN for USN quickly — they must either sell on DEXes (extremely thin liquidity, ~$33K USN daily, ~$156 sUSN daily) or wait up to 5 days via the withdrawal handler. At an 86% LLTV, this creates a risk of bad debt accumulation if the sUSN/USDC price drops faster than liquidators can exit. The Stork oracle (non-Chainlink, single source, no fallback) adds additional risk to the Morpho market.

**Key conditions for any exposure:**

- Monitor multisig for instant proxy upgrades (no timelock — **critical**)
- Monitor sUSN exchange rate for any decreases
- Monitor rebase events for frequency and consistency
- Monitor collateral wallet balances relative to USN supply
- Monitor Stork oracle feed vs sUSN vault exchange rate
- Verify Accountable proof of solvency dashboard is operational
- Request the team implement a timelock before increasing exposure
- Verify bug bounty program status with the team

---

## Reassessment Triggers

- **Time-based**: Reassess in 3 months (June 2026) given the protocol's youth and elevated risk tier
- **TVL-based**: Reassess if TVL changes by more than 50% (below ~$15.5M or above ~$46.5M)
- **Incident-based**: Reassess after any exploit, governance change, collateral modification, or custodian incident
- **Governance-based**: Reassess if a timelock is implemented (should improve Centralization score significantly)
- **Bug bounty**: Reassess if/when a bug bounty program is launched
- **Audit-based**: Reassess if additional audits by tier-1 firms (Trail of Bits, OpenZeppelin, Cyfrin) are completed
- **Morpho market-based**: Reassess if the Stork oracle is replaced with a native Chainlink feed or if LLTV is adjusted
