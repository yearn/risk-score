# Protocol Risk Assessment: Noon

- **Assessment Date:** April 27, 2026 (metrics refresh; reassessment March 23, 2026; original March 10, 2026)
- **Token:** sUSN (Staked USN)
- **Chain:** Ethereum
- **Token Address:** [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D)
- **Final Score: 3.4/5.0**

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

**Key metrics (on-chain verified, April 27, 2026, block 24,973,944):**
- Protocol TVL: ~$26.57M (DeFiLlama: $23.75M Ethereum + $1.07M TAC + $0.89M zkSync Era + $0.86M Sophon)
- USN total supply: 23,761,212 USN (`totalSupply()` on-chain) — **down ~14.2%** from 27.70M on Mar 23
- sUSN total supply: 17,554,251 sUSN (`totalSupply()` on-chain) — down ~3.5% from Mar 23
- sUSN total assets: 20,755,626 USN staked (`totalAssets()` on-chain) — down ~2.7% from Mar 23
- sUSN exchange rate: 1 sUSN = 1.1824 USN (`convertToAssets(1e18)` = 1,182,370,407,318,935,270) — up 0.9% from 1.1717 on Mar 23 (~9.4% annualized over 35 days)
- ~87.4% of USN is staked in sUSN (20.76M / 23.76M) — staking ratio has risen as USN supply contracted

**Yearn use case per issue #66:**
- Use sUSN as collateral on Morpho for sUSN/USDC market

**Recent developments (since original March 1 assessment):**
- **Timelock deployed** (verified on-chain March 23, 2026) — custom Timelock contract at [`0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F`](https://etherscan.io/address/0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F) with 48-hour delay. Both ProxyAdmins (USN + sUSN) now owned by timelock. Token contracts (USN, sUSN) still directly owned by multisig — operational functions (blacklist, rescueToken, rebase) are NOT timelocked
- **Source code now public** (March 18-19, 2026) — Core contracts at [dclf-labs/Protocol-Core](https://github.com/dclf-labs/Protocol-Core), governance at [dclf-labs/Governance-Core](https://github.com/dclf-labs/Governance-Core). CI includes Slither + Mythril static analysis. Test coverage: 96-100%
- **DCLM market maker liquidation agreement** — DCL Markets Ltd contractually obligated to buy sUSN at previous day's price (paying USDT/USDC) within 24 hours (+24h grace) if sUSN depegs >1%. Must execute even at a loss. BVI law, JAMS arbitration in London. 45-day termination notice
- **Ceffu funding rate arbitrage paused** — Team confirms paused 12+ months with no restart anticipated. Reduces active custodial exposure to Ceffu
- **Alpaca/Dinari clarification** — Team claims Alpaca assets tokenized on-chain via Dinari with T+1 redemption. **Not verified on-chain** — no Dinari dShares or tokenized T-bill tokens found in any collateral wallet. T-bills appear to remain off-chain at Alpaca Securities
- **Anonymous signers** — No fix planned. Team commitment to adding independent/known entity signers after >$100M TVL growth; open to Yearn as signer
- **NOON governance token launched on KuCoin** (March 5, 2026) — veToken system with sNOON staking (up to 4x voting multiplier, 12-month lock). Does **not** change the underlying 3-of-6 multisig admin structure
- **tBTC Bitcoin Yield Vault** launched on Starknet (January 2026) — uses tBTC as collateral, borrows USDC, deploys into sUSN, and loops. Reached $454K TVL within 2 days at 6.79% APY
- **US GENIUS Act** (passed July 2025) + OCC rulemaking (early 2026) — creates strict framework for stablecoin issuers, including foreign issuers serving US users. Relevant for Noon as a BVI entity

**Links:**

- [Protocol Documentation](https://docs.noon.capital)
- [Protocol App](https://app.noon.capital)
- [DeFiLlama](https://defillama.com/protocol/noon)
- [Proof of Solvency Dashboard](https://noon.accountable.capital/)
- [Mirror Blog](https://mirror.xyz/nooncapital.eth)
- [Twitter/X](https://x.com/ag_noon)
- [CoinGecko](https://www.coingecko.com/en/coins/staked-usn)
- [Serenity Research — Noon USN Review (Jun 2025, paywalled)](https://serenityresearch.substack.com/p/serenity-premium-rwa-stablecoin-series-adf)

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
| USN | [`0x55f39512cb43111a13e8440ee3e3602e72628239`](https://etherscan.io/address/0x55f39512cb43111a13e8440ee3e3602e72628239) | Timelock (48h delay) |
| sUSN | [`0x1908284b50ee152c9f00c8e65a81fc1c4520bd81`](https://etherscan.io/address/0x1908284b50ee152c9f00c8e65a81fc1c4520bd81) | Timelock (48h delay) |

### Governance

| Contract | Address | Configuration |
|----------|---------|---------------|
| Timelock | [`0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F`](https://etherscan.io/address/0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F) | Custom Timelock, 48h delay (MIN_DELAY: 1 day, MAX_DELAY: 2 days), owned by Multisig, Solidity 0.8.28, verified on Etherscan |
| Multisig | [`0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f`](https://etherscan.io/address/0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f) | 3-of-6 Gnosis Safe v1.4.1, all anonymous signers (on-chain verified via `getThreshold()` and `getOwners()`) |

**Governance chain (on-chain verified April 27, 2026; unchanged from March 23 verification):**

```
Multisig (0x1ea1...327f) — 3-of-6 anonymous signers
  ├── owns Timelock (0xE5e4...5A7F) — 48-hour delay on proxy upgrades
  │     ├── owns USN ProxyAdmin (0x55f3...2239)
  │     └── owns sUSN ProxyAdmin (0x1908...0b81)
  ├── directly owns USN token (0xdA67...1eD) — NO timelock on operational functions
  └── directly owns sUSN token (0xE24a...91D) — NO timelock on operational functions
```

### Collateral Wallets (Ethereum)

| Wallet | Address | Type |
|--------|---------|------|
| Noon Collateral 1 | [`0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089`](https://etherscan.io/address/0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089) | 4-of-5 Gnosis Safe (on-chain verified) |
| Noon Collateral 2 | [`0x1b2262903Fdb0a8eb84291cC227426be590c4503`](https://etherscan.io/address/0x1b2262903Fdb0a8eb84291cC227426be590c4503) | 3-of-4 Gnosis Safe (on-chain verified) |
| Noon Collateral 3 | [`0x4fD04553468610e5a88a2cffA38E057C954312Da`](https://etherscan.io/address/0x4fD04553468610e5a88a2cffA38E057C954312Da) | **EOA** (on-chain verified — no contract code) |

### On-Chain Verification (Etherscan + cast, April 27, 2026)

| Contract | Name | Verified | Proxy | Implementation |
|----------|------|----------|-------|----------------|
| USN | TransparentUpgradeableProxy → USNUpgradeableHyperlane | Yes | Yes | [`0x6bdC8104ec827cd48b9cac526420b59a31bc8397`](https://etherscan.io/address/0x6bdC8104ec827cd48b9cac526420b59a31bc8397) |
| sUSN | TransparentUpgradeableProxy → StakingVaultOFTUpgradeableHyperlane | Yes | Yes | [`0xD1fFb6a6a42c86b931b2a6d388d1f25c1c775b34`](https://etherscan.io/address/0xD1fFb6a6a42c86b931b2a6d388d1f25c1c775b34) |
| MinterHandlerV2 | MinterHandlerV2 | Yes | No | — |
| Multisig | GnosisSafeProxy (Safe v1.4.1) | Yes | Yes | — |

**On-chain ownership verification (via `cast`, April 27, 2026; unchanged):**
- USN `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig, direct) ✓
- sUSN `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig, direct) ✓
- USN ProxyAdmin `owner()` → `0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F` (**Timelock**, 48h delay) ✓
- sUSN ProxyAdmin `owner()` → `0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F` (**Timelock**, 48h delay) ✓
- Timelock `owner()` → `0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f` (3-of-6 multisig) ✓
- Timelock `delay()` → 172,800 seconds (48 hours) ✓
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
- **NOON token launch**: March 5, 2026 — governance token listed on KuCoin (NOON/USDT). veToken system with sNOON staking for voting power. Current price: ~$0.027
- **GitHub**: **Public** as of March 18-19, 2026: [Protocol-Core](https://github.com/dclf-labs/Protocol-Core) (core contracts), [Governance-Core](https://github.com/dclf-labs/Governance-Core) (NOON staking). CI includes Slither + Mythril static analysis. Test coverage: 96-100%
- **Incidents**: No reported security incidents, exploits, or hacks found
- **TVL History**:

| Period | TVL | Notes |
|--------|-----|-------|
| Jan 2025 | ~$28.5M | Public beta launch, peak TVL |
| Mar 2025 (early) | ~$16.6M | Significant dip |
| Mar 2025 (late) | ~$28M | Recovery |
| Mar 23, 2026 | ~$30.75M | Prior assessment point (DeFiLlama) |
| Apr 27, 2026 | ~$26.57M | Current (DeFiLlama) — USN supply contracted ~14% over 35 days |

- **TVL Volatility**: The protocol experienced a ~42% drawdown (from $28.5M to $16.6M) in early March 2025 but recovered. Between March 23 and April 27, 2026, **USN total supply declined from 27.70M to 23.76M (-14.2%)** while sUSN supply fell only ~3.5% — suggesting unstaked USN was redeemed out of the system. TVL overall fell ~$4.18M (-13.6%).
- **Exchange rate (on-chain verified April 27, 2026, block 24,973,944)**:
  - `convertToAssets(1e18)` = 1,182,370,407,318,935,270 = 1.1824 USN per sUSN
  - `totalAssets()` = 20,755,626,497,920,483,229,282,898 = 20,755,626 USN
  - `totalSupply()` = 17,554,250,655,667,681,594,850,093 = 17,554,251 sUSN
  - `maxRedeem(address)` = 0 (direct ERC-4626 redemption still disabled)
  - As an ERC-4626 vault, the exchange rate should only increase. The 18.24% appreciation over ~17 months implies ~12.3% annualized yield. Rate progression: 1.1680 (Mar 10) → 1.1717 (Mar 23) → 1.1822 (Apr 22) → 1.1824 (Apr 27) — appreciation continues but slowed in the last 5 days alongside the supply contraction.
- **USN Peg**: No reported depegging events found. USN is backed 1:1 by USDT/USDC/T-Bills. Current price: $0.9997 (CoinGecko, April 27, 2026).

## Funds Management

### Deposit/Withdrawal Flow

**Minting USN**: The USN token has a single `admin` address that can call `mint()`. Currently the admin is the MinterHandlerV2 contract ([`0xB91b361ebE4022Bb62dF0651bDD09b21209ac058`](https://etherscan.io/address/0xB91b361ebE4022Bb62dF0651bDD09b21209ac058)). The multisig (USN owner) can change this admin at any time via `setAdmin()` — **NOT behind timelock**.

MinterHandlerV2 exposes **three minting paths** (on-chain verified):

| Path | Collateral Required? | Who Can Call | Limit | Atomic? |
|------|---------------------|-------------|-------|---------|
| `mint(order, sig)` | **Yes** — `safeTransferFrom(user, custodialWallet)` | MINTER_ROLE (multisig) + signed order from whitelisted user | 10M USN/block | Yes |
| `directMint(collateral, amount, minUsn)` | **Yes** — `safeTransferFrom(user, custodialWallet)`, priced via Chainlink oracle | Any whitelisted user | 10M USN/block + 10M USN/day | Yes |
| `mintAndRebase(amount)` | **NO — mints USN without any collateral** | MINTER_ROLE (multisig) only | 50,000 USN/call | Yes |

**`mintAndRebase()` is the critical risk vector**: The multisig can mint up to 50,000 USN per call with zero collateral deposit. The newly minted USN is sent directly into the sUSN staking vault via `rebase()`, increasing the sUSN exchange rate as "yield." The trust assumption is that off-chain reserves back this minting, but **nothing on-chain enforces it**.

**No on-chain supply enforcement (verified):**
- USN has **no supply cap** (`maxSupply()`, `cap()` do not exist on the contract)
- `mintAndRebase()` has **no cooldown** between calls (confirmed on-chain: 2 calls only 45 blocks / ~9 minutes apart)
- **No daily aggregate limit** — no `totalRebased` counter or per-day tracking
- `setRebaseLimit()` has **no upper bound** — multisig can set it to `type(uint256).max`
- The sUSN vault's `rebase()` accepts **unlimited amounts** from any `REBASE_MANAGER_ROLE` holder
- **NOT behind timelock** — both `mintAndRebase()` and `setRebaseLimit()` are immediate
- Historical activity: 25 `MintAndRebase` events total, ~178,512 USN minted via this path. Limit already raised twice (30K → 40K → 50K)

**Worst case (multisig compromise):** The multisig could call `setRebaseLimit(type(uint256).max)` then `mintAndRebase(any_amount)` in a single transaction — minting unlimited USN with zero collateral and zero on-chain resistance. This would inflate the sUSN exchange rate, allowing borrowers on Morpho to extract more USDC than their collateral is worth.

**MINTER_ROLE holders** on MinterHandlerV2 (on-chain verified):
- [`0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f`](https://etherscan.io/address/0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f) (3-of-6 multisig) — **active**

**REBASE_MANAGER_ROLE holders** on sUSN vault (on-chain verified — all active, no revocations found):
- [`0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f`](https://etherscan.io/address/0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f) (multisig)
- [`0xB91b361ebE4022Bb62dF0651bDD09b21209ac058`](https://etherscan.io/address/0xB91b361ebE4022Bb62dF0651bDD09b21209ac058) (MinterHandlerV2)
- [`0x173806021b18c4e60170e412dc88f991eb00d699`](https://etherscan.io/address/0x173806021b18c4e60170e412dc88f991eb00d699) (EOA — deployer)
- [`0xcc2447b495cbc8c2263619ff3dc4c13604c9b11f`](https://etherscan.io/address/0xcc2447b495cbc8c2263619ff3dc4c13604c9b11f) (EOA — unknown)

**Concern**: Two EOAs still hold `REBASE_MANAGER_ROLE`. While they cannot mint USN themselves (only MinterHandlerV2 is USN admin), if they obtained USN tokens they could call `rebase()` directly on the vault to inflate the exchange rate.

On-chain verified MinterHandlerV2 parameters:
- `mintLimitPerBlock`: 10,000,000 USN (1e25 wei)
- `directMintLimitPerDay`: 10,000,000 USN (1e25 wei)
- `rebaseLimit`: 50,000 USN (5e22 wei)
- `priceThresholdBps`: 50 (0.5%)
- `oracleStalenessThreshold`: 172,800 seconds (48 hours)
- `custodialWallet`: [`0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089`](https://etherscan.io/address/0x365bd6fb4200e422a2b1f7b9Dfb1C00471E6D089) (Noon Collateral 1)

Retail users buy USN on DEXes.

**Staking to sUSN**: Users deposit USN into the sUSN vault (ERC-4626). Shares are minted proportional to the current exchange rate.

**Withdrawal from sUSN**: `maxRedeem()` currently returns **0** — direct ERC-4626 redemption is disabled. Users must call `createWithdrawalRequest()` which routes through a withdrawal handler. The protocol guarantees 100% of TVL redeemable within T+5 days:
- T+0: 20% of TVL accessible
- T+3: 60% of TVL accessible
- T+5: 100% of TVL accessible

Alternatively, users can sell sUSN on DEXes for immediate (but potentially slippage-impacted) liquidity.

### Accessibility

- **USN minting**: Three paths — `mint()` requires MINTER_ROLE + whitelisted user with collateral; `directMint()` requires whitelisted user with collateral + Chainlink price; `mintAndRebase()` requires MINTER_ROLE only (no collateral). All minting is atomic (single transaction)
- **USN transfers**: Permissionless (anyone can transfer USN)
- **sUSN staking**: Anyone can deposit USN to receive sUSN
- **sUSN redemption**: Subject to withdrawal request + cooldown period (up to 5 days). Not atomic
- **Fees**: Not explicitly documented in public sources

### Collateralization

- **Backing**: USN is backed 1:1 by USDT, USDC, or short-term U.S. Treasury Bills. Collateral is held by custodians:
  - **Ceffu** — funding rate arbitrage (off-exchange, tri-partite settlement). **Paused 12+ months per team; no restart anticipated**
  - **Alpaca Securities** (via Dinari) — T-Bills and CLOs (FINRA member, SIPC + Lloyd's of London insurance). Team claims assets tokenized on-chain via Dinari with T+1 redemption. **Not verified on-chain** — no Dinari dShares or tokenized T-bill tokens found in collateral wallets; T-bills appear to remain off-chain at Alpaca Securities
  - **Fasanara Capital** — private credit (F-TAC fund, $6B AUM)
  - **ForDefi** — DeFi strategies (institutional MPC wallet, on-chain visibility)
- **On-chain collateral**: Only DeFi strategies (Euler, Morpho, Pendle) are visible on-chain via ForDefi wallets. Collateral wallets primarily hold USDC and DeFi positions. The majority of collateral is **off-chain/custodial**
- **Market maker backstop**: DCL Markets Ltd (DCLM) contractually obligated to buy sUSN at previous day's price within 24h (+24h grace) if sUSN depegs >1%. Must execute even at a loss. Provides a contractual (not on-chain) liquidation backstop
- **Insurance layers**: Nexus Mutual (DeFi smart contract risk), SIPC + Lloyd's of London (TradFi custodial), and internal Insurance Fund (10% of revenue)
- **No on-chain over-collateralization mechanism**: Unlike protocols with on-chain liquidation and collateral ratios, USN relies on custodial backing with periodic verification
- **Private credit exposure**: Fasanara F-TAC positions have **T+3 month redemption windows**, creating potential liquidity mismatch with the T+5 day user redemption guarantee

### Provability

- **Proof of Solvency**: Partnership with Accountable provides real-time, independent verification using zero-knowledge proofs and secure enclaves. Dashboard at [noon.accountable.capital](https://noon.accountable.capital/)
- **On-chain verifiability**: sUSN exchange rate is programmatic on-chain (ERC-4626). DeFi strategy positions visible via ForDefi wallets on-chain
- **Off-chain reserves**: TradFi positions (T-Bills, CLOs, private credit, CEX funding rate arb) are **not on-chain verifiable**. Users must trust Accountable's verification and custodian attestations
- **Yield distribution**: Via `mintAndRebase()` — the multisig (MINTER_ROLE) mints new USN **without any collateral deposit** and sends it into the sUSN vault. This is the mechanism that increases the sUSN exchange rate. The rebase amount is controlled by the team (up to `rebaseLimit` of 50,000 USN per call, adjustable by multisig). **No on-chain enforcement that off-chain reserves back the minted USN**. Additionally, 4 addresses hold `REBASE_MANAGER_ROLE` on the sUSN vault (including 2 EOAs)
- **Collateral self-dealing prohibition**: Documentation states Noon never redeploys assets back into Noon or lends to vaults accepting USN as collateral

## Liquidity Risk

### Primary Exit Mechanisms

1. **Withdrawal request from sUSN vault**: `createWithdrawalRequest()` → cooldown → claim. T+5 maximum (20% at T+0, 60% at T+3, 100% at T+5). Not instant
2. **DEX swap**: USN/sUSN pools on Uniswap V3 (Ethereum). Secondary-market volume remains negligible: USN 24h volume ~$5.7K, sUSN 24h volume ~$1.6 (CoinGecko, Apr 27, 2026; vs ~$33K / ~$156 on Mar 23 and ~$626 / ~$118 on Apr 22). USN volume rebounded slightly from Apr 22 but sUSN volume effectively collapsed to zero. No on-DEX exit for anything but retail-sized positions
3. **USN redemption to stablecoins**: Permissioned institutional redemption via the dApp (subject to daily limits during public beta)

### Liquidity Assessment

- **Primary liquidity**: The main exit path is through the cooldown-based withdrawal mechanism (up to 5 days)
- **Secondary market**: DEX liquidity is negligible. CoinGecko 24h volumes (Apr 27, 2026): USN ~$5.7K, sUSN ~$1.6 — sUSN secondary depth is effectively zero. Volumes have been highly variable (Mar 23: $33K USN / $156 sUSN; Apr 22: $626 USN / $118 sUSN) but consistently negligible relative to ~$26.6M TVL
- **On-chain maxRedeem = 0**: Direct ERC-4626 redemption is disabled. Must use withdrawal handler
- **Same-value redemption**: sUSN redeems for USN (stablecoin-denominated), so price change risk is minimal for the Morpho collateral use case
- **DCLM market maker backstop**: DCL Markets Ltd contractually obligated to buy sUSN at previous day's price within 24h if sUSN depegs >1%. Provides a contractual (off-chain) backstop but depends on DCLM's willingness and solvency
- **Liquidity mismatch**: The protocol promises T+5 full redemption, but private credit positions (Fasanara F-TAC) have T+3 month redemption. If a significant portion of TVL is in private credit, a bank-run scenario could stress the redemption guarantee
- **Small TVL**: At ~$26.57M (Apr 27, 2026, down from ~$30.75M on Mar 23), the protocol is small and has contracted ~13.6% over the last 35 days. Large positions relative to TVL could create concentration risk
- **Morpho market tightly utilized (89.6% on Apr 27, 2026; was 100% on Mar 23)**: Supply ~$8.45M, borrow ~$7.57M. The headroom for withdrawals is only ~$880K at current utilization; a single large borrow could push the market back to 100% and re-lock new supply

### Morpho Market (sUSN/USDC)

| Parameter | Value |
|-----------|-------|
| Market ID | `0x8924445a76b678c536df977ed9222fb0b23ee5311497dd0223fe6270bb20b4e6` |
| Collateral | sUSN ([`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D)) |
| Loan Token | USDC ([`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`](https://etherscan.io/address/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)) |
| Oracle | MorphoChainlinkOracleV2 ([`0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa`](https://etherscan.io/address/0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa)) |
| IRM | AdaptiveCurveIrm ([`0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC`](https://etherscan.io/address/0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC)) |
| LLTV | 86% |
| Total Supply | ~$8.45M USDC |
| Total Borrow | ~$7.57M USDC |
| Utilization | **89.6%** (Apr 27, 2026; was ~100% on Mar 23 — new supply entered but market remains tightly utilized) |

### Morpho Oracle Analysis (on-chain verified)

The oracle is a `MorphoChainlinkOracleV2` that combines three data sources:

1. **BASE_VAULT** (sUSN→USN conversion): Reads `convertToAssets()` directly from the sUSN vault contract — **on-chain, trustless**
2. **BASE_FEED_1** (USN/USD price): Stork oracle adapter — returns $1.00 (1e18 with 18 decimals)
3. **QUOTE_FEED_1** (USDC/USD price): Chainlink feed — returns ~$0.9999 (99,997,640 with 8 decimals)

The oracle formula: `price = vault_conversion * baseFeed1 * SCALE_FACTOR / quoteFeed1`

| Parameter | Address | Description | Current Value |
|-----------|---------|-------------|---------------|
| BASE_VAULT | [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D) | sUSN vault (ERC-4626 exchange rate) | 1.1824 USN/sUSN |
| BASE_VAULT_CONVERSION_SAMPLE | — | Conversion sample amount | 1e8 |
| BASE_FEED_1 | [`0x6e498b02C0036235c8164A502b0eECC7660BD889`](https://etherscan.io/address/0x6e498b02C0036235c8164A502b0eECC7660BD889) | StorkChainlinkAdapter (USN/USD) | 1e18 (=$1.00) |
| BASE_FEED_2 | `0x0` | Not set | — |
| QUOTE_FEED_1 | [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6) | Chainlink USDC/USD (8 dec) | 99,979,871 (=$0.9998) |
| QUOTE_FEED_2 | `0x0` | Not set | — |
| SCALE_FACTOR | — | Decimal adjustment | 1,000,000 |
| **price()** | — | **Final oracle price** | **1,182,608,447,254,347,827,674,232 (~1.1826 USDC/sUSN)** |

**Stork adapter details:**
- Description: `"A port of a chainlink aggregator powered by Stork"`
- Returns via `latestRoundData()`: roundId, answer, startedAt, updatedAt, answeredInRound — all fields except `answer` return the same value (1,773,040,009,161,351,644), which does **not** appear to be a valid Unix timestamp. This means **staleness checks based on `updatedAt` will not work correctly**.

**Oracle concerns:**
- **Positive**: The sUSN→USN exchange rate is read directly from the vault contract on-chain (trustless, manipulation-resistant)
- **Stork USN/USD feed risk**: If USN depegs (e.g., drops to $0.90) but the Stork feed continues reporting $1.00, the oracle would **overvalue sUSN collateral**, allowing borrowers to extract more than their collateral is worth. This is the primary oracle risk
- **Stork is newer**: Less battle-tested than Chainlink. The adapter's non-standard `latestRoundData()` timestamps suggest incomplete Chainlink interface compliance
- **Single oracle source for USN/USD**: No redundant oracle or fallback. If Stork fails or returns stale data during a USN depeg, liquidations would malfunction
- **86% LLTV is aggressive** for an asset with a 5-day withdrawal window — liquidators may struggle to unwind sUSN collateral quickly through DEXes with thin liquidity. The Morpho market remains tightly utilized (**89.6%** as of Apr 27, 2026; was 100% on Mar 23), leaving only ~$880K of withdrawable supply headroom

## Centralization & Control Risks

### Governance

The protocol is controlled by a 3-of-6 Gnosis Safe multisig. **Proxy upgrades are now behind a 48-hour timelock** (verified on-chain March 23, 2026). Operational functions remain directly controlled by the multisig:

| Role | Controlled By | Timelocked? | Description |
|------|---------------|-------------|-------------|
| ProxyAdmin Owner (USN) | Timelock → Multisig | **Yes (48h)** | Proxy upgrades require 48-hour delay |
| ProxyAdmin Owner (sUSN) | Timelock → Multisig | **Yes (48h)** | Proxy upgrades require 48-hour delay |
| USN Owner (Ownable2Step) | 3-of-6 Multisig | **No** | Blacklisting, whitelist, admin settings — immediate |
| sUSN DEFAULT_ADMIN_ROLE | 3-of-6 Multisig | **No** | All role grants, rescue tokens, treasury settings — immediate |
| MinterHandler DEFAULT_ADMIN_ROLE | 3-of-6 Multisig | **No** | Mint limits, custodial wallet, oracle settings — immediate |
| REBASE_MANAGER_ROLE | Granted by Multisig | **No** | Controls yield distribution (rebase) |
| BLACKLIST_MANAGER_ROLE | Granted by Multisig | **No** | Can freeze user funds |
| MINTER_ROLE | Granted by Multisig | **No** | Can mint USN (via MinterHandler) |

**Key governance concerns:**
- **Partial timelock coverage**: The 48-hour timelock protects against instant proxy upgrades (the most critical governance action). However, **operational functions are NOT timelocked**: blacklisting, rescueToken(), rebase, role grants, and minting parameters can still be changed immediately by the multisig
- **All anonymous signers**: All 6 multisig signers are anonymous EOAs. No known entities or independent signers. Team has committed to adding known signers after >$100M TVL; open to Yearn as signer
- **rescueToken()**: The sUSN vault has a function allowing the owner to extract any ERC-20 tokens from the vault — NOT behind timelock. Potential extraction vector if the multisig is compromised
- **Blacklist**: Both USN and sUSN have blacklisting capabilities. The multisig can freeze user funds at any time — NOT behind timelock
- **Unbacked minting via `mintAndRebase()`**: The multisig (MINTER_ROLE) can mint up to 50,000 USN per call with **zero collateral deposit** and distribute it as yield to sUSN stakers. The `rebaseLimit` is adjustable by the multisig — NOT behind timelock. No on-chain mechanism verifies off-chain reserves back this minting
- **USN admin changeable without timelock**: The multisig can call `setAdmin()` on USN to change who can mint — NOT behind timelock. A compromised multisig could set a malicious admin to mint unlimited USN
- **REBASE_MANAGER_ROLE held by 4 addresses**: Multisig, MinterHandlerV2, and 2 EOAs (`0x1738...d699` deployer, `0xcc24...b11f` unknown). The 2 EOAs could call `rebase()` directly on the vault if they obtained USN tokens, inflating the exchange rate
- **No Guardian or independent oversight**: While proxy upgrades are now timelocked, there is no independent Guardian or veto mechanism. The same multisig controls both the timelock and all operational functions
- **Ownable2Step**: USN uses two-step ownership transfer, which is a positive security measure
- **NOON governance token** (launched March 5, 2026): veToken system with sNOON staking for voting power. While this introduces governance participation, it does **not** replace the 3-of-6 multisig as the contract admin — the multisig retains all privileged roles and proxy upgrade authority

### Programmability

- **sUSN exchange rate**: Calculated on-chain via ERC-4626 standard. Programmatic
- **Yield distribution**: Via `mintAndRebase()` — mints new USN without collateral and deposits into staking vault. This is a **manual, privileged operation**, not a programmatic yield accrual. No on-chain enforcement of backing
- **Minting**: Three paths — `mint()` and `directMint()` require collateral (atomic, with safeguards). `mintAndRebase()` requires NO collateral (up to 50K USN/call). USN admin can be changed by multisig without timelock
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
- **Legal structure**: **British Virgin Islands (BVI)** jurisdiction via DCLF Labs. Limited regulatory oversight and investor protection. Self-funded (no VC). The US GENIUS Act (passed July 2025) and subsequent OCC rulemaking require foreign stablecoin issuers serving US users to apply for OCC registration — potential regulatory risk for Noon's BVI structure
- **Incident response**: Documented 24-hour incident plan with "predefined response procedures, rollback capabilities, and emergency communication channels." Admin Multisig can pause the protocol immediately
- **Source code**: **Public** as of March 18-19, 2026. [Protocol-Core](https://github.com/dclf-labs/Protocol-Core) and [Governance-Core](https://github.com/dclf-labs/Governance-Core). CI includes Slither + Mythril static analysis. Contracts also verified on Etherscan
- **Token allocation**: 20% to team with 7-year lockup (1-year cliff + 6-year linear vesting)

## Monitoring

### sUSN Vault Monitoring

- **sUSN contract**: [`0xE24a3DC889621612422A64E6388927901608B91D`](https://etherscan.io/address/0xE24a3DC889621612422A64E6388927901608B91D)
  - Monitor `convertToAssets(1e18)` for exchange rate changes (should only increase)
  - **Alert**: If exchange rate **decreases** — indicates potential issue with rebase or loss event
  - Monitor `Rebase(amount)` events for yield distribution frequency and amounts
  - Monitor `Deposit`, `Withdraw` events for large movements (>$500K given ~$26.6M TVL)
  - **Alert**: Single deposits/withdrawals >$2M

### USN Token Monitoring

- **USN contract**: [`0xdA67B4284609d2d48e5d10cfAc411572727dc1eD`](https://etherscan.io/address/0xdA67B4284609d2d48e5d10cfAc411572727dc1eD)
  - Monitor `totalSupply()` for unexpected minting events
  - **Alert**: Minting >10M USN in a single day (matches `directMintLimitPerDay`)
  - Monitor `Transfer` events from/to collateral wallets
  - Monitor for `setAdmin(address)` calls (selector `0x704b6c02`) — replaces the USN minter address without timelock; a malicious admin could mint unlimited USN
  - **Alert**: Immediately on any `setAdmin()` call (i.e., any time the USN admin moves away from MinterHandlerV2 [`0xB91b361ebE4022Bb62dF0651bDD09b21209ac058`](https://etherscan.io/address/0xB91b361ebE4022Bb62dF0651bDD09b21209ac058))
- **MinterHandlerV2**: [`0xB91b361ebE4022Bb62dF0651bDD09b21209ac058`](https://etherscan.io/address/0xB91b361ebE4022Bb62dF0651bDD09b21209ac058)
  - Monitor `MintAndRebase(amount)` events — each call mints USN without collateral
  - **Alert**: If `mintAndRebase` called more than once per day or with amount close to `rebaseLimit`
  - Monitor for `setRebaseLimit(uint256)` calls — parameter changes with no timelock
  - **Alert**: Immediately on any `rebaseLimit` change
  - Monitoring may also be done by tracking the multisig Safe's outgoing transactions filtered by target contract (USN vs MinterHandlerV2) rather than by event-name parsing

### Governance Monitoring

- **Multisig**: [`0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f`](https://etherscan.io/address/0x1ea169EcCcf7714E7ba04900e1a3357cCA77327f)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change
  - Monitor Timelock [`0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F`](https://etherscan.io/address/0xE5e412C212B4FBbF550A94e7BD5e83dB0B315A7F) for queued proxy upgrade transactions
  - **Alert**: Immediately on any queued upgrade — 48-hour window to review and react before execution
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
  - Current price: $0.9997 (well-pegged, April 27, 2026; CoinGecko)

### Morpho Market Monitoring

- **Oracle**: [`0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa`](https://etherscan.io/address/0xC415Cc3F04F9074A9562aEEe02591e65D39A94aa)
  - Monitor `price()` against the expected formula `convertToAssets(1e18) × USN/USD ÷ USDC/USD` (after normalizing decimals — BASE_VAULT 18 dec, BASE_FEED_1 18 dec, QUOTE_FEED_1 8 dec, SCALE_FACTOR 1e6, output 36 dec)
  - **Alert**: If `price()` deviates >1% from the expected value (indicates Stork or Chainlink USDC/USD feed misbehavior)
- **Stork USN/USD feed (BASE_FEED_1)**: [`0x6e498b02C0036235c8164A502b0eECC7660BD889`](https://etherscan.io/address/0x6e498b02C0036235c8164A502b0eECC7660BD889)
  - This is a USN/USD price feed (currently a constant `1e18` = $1.00), **not** an sUSN/USN exchange rate — do not compare it to `convertToAssets()` directly
  - **Alert**: If `latestAnswer()` deviates >0.5% from `1e18` ($1.00) — would indicate Stork is now reporting a USN depeg
  - **Alert**: If the off-chain market USN/USD price (CoinGecko/DEX) deviates >1% from the Stork-reported value — oracle-vs-market divergence is the primary depeg risk because the Morpho oracle would then overvalue sUSN collateral
  - Note on staleness: the Stork adapter's `latestRoundData()` returns a non-Unix value in `updatedAt`, so wall-clock staleness checks against `block.timestamp` will not work — fall back to monitoring whether the feed value has updated within the expected cadence
- **Chainlink USDC/USD feed (QUOTE_FEED_1)**: [`0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6`](https://etherscan.io/address/0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6)
  - Standard Chainlink staleness checks apply — `updatedAt` is a normal Unix timestamp
  - **Alert**: If `latestAnswer()` deviates >0.5% from $1.00 or `updatedAt` is older than the feed's heartbeat

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| Timelock queued upgrade events | Real-time | Critical |
| Multisig signer/threshold changes | Real-time | Critical |
| sUSN exchange rate decrease | Every 6 hours | Critical |
| Blacklist events (USN/sUSN) | Real-time | Critical |
| RBAC role changes | Real-time | Critical |
| Withdrawal period changes | Real-time | Critical |
| USN admin changes (`setAdmin()`) | Real-time | Critical |
| `rebaseLimit` changes | Real-time | Critical |
| `mintAndRebase` events (unbacked minting) | Real-time | High |
| Rebase events | Daily | High |
| USN total supply changes | Daily | High |
| Collateral wallet balances | Daily | High |
| Collateral 3 (EOA) outflows | Real-time | High |
| Morpho oracle price vs sUSN rate | Every 6 hours | High |
| Morpho market utilization rate | Daily | High |
| USN peg stability | Hourly | High |
| Protocol TVL changes | Daily | Medium |

## Risk Summary

### Key Strengths

- **Timelock on proxy upgrades**: 48-hour delay on the most critical governance action (contract upgrades). Verified on-chain
- **Public source code**: Both core and governance repos now public with Slither + Mythril CI and 96-100% test coverage
- **DCLM market maker backstop**: Contractual liquidation agreement provides guaranteed buyer for sUSN during depeg events
- **Diversified yield sources**: Multiple uncorrelated strategies (T-Bills, CLOs, DeFi lending, Pendle PTs) reduce single-strategy risk. Ceffu funding rate arb paused
- **Independent solvency verification**: Real-time proof of solvency via Accountable partnership with zero-knowledge proofs and secure enclaves
- **Layered insurance**: Nexus Mutual (DeFi), SIPC + Lloyd's of London (TradFi), and internal Insurance Fund provide multiple layers of coverage
- **Self-dealing prohibition**: Protocol explicitly avoids circular collateral dependencies

### Key Risks

- **Unlimited unbacked minting via `mintAndRebase()`**: The multisig can mint USN without any collateral deposit — no supply cap, no cooldown, no daily aggregate limit. `setRebaseLimit()` has no upper bound. No on-chain enforcement of backing whatsoever. The `rebaseLimit` and USN admin are changeable by the multisig without timelock
- **Partial timelock coverage**: Proxy upgrades are now behind a 48-hour timelock, but operational functions (blacklist, rescueToken, rebase, minting, role grants) remain immediately executable by the 3-of-6 multisig
- **Mostly off-chain/custodial reserves**: The majority of USN backing is held off-chain with custodians. Alpaca/Dinari tokenization claim not verified on-chain. On-chain verifiability limited to DeFi strategy positions
- **REBASE_MANAGER_ROLE on 2 EOAs**: Deployer EOA and unknown EOA still hold REBASE_MANAGER_ROLE on the sUSN vault — should be revoked
- **No bug bounty program**: No formal bug bounty on any platform despite ~$26.6M TVL
- **Anonymous multisig signers**: All 6 signers are anonymous EOAs. No independent or known-entity signers. Commitment to add known signers only after >$100M TVL
- **5-day withdrawal lockup**: Not compatible with instant liquidation needs on Morpho
- **Morpho market tightly utilized (89.6%, was 100% on Mar 23)**: ~$880K withdrawable supply headroom; can snap back to 100% on any sizable new borrow
- **BVI jurisdiction**: Limited regulatory oversight and investor protection

### Critical Risks

- **Unlimited unbacked minting**: `mintAndRebase()` allows the multisig to mint USN with zero collateral — no supply cap, no cooldown, no daily limit. The multisig can call `setRebaseLimit(type(uint256).max)` then `mintAndRebase(any_amount)` in a single transaction with zero on-chain resistance. USN `admin` (who can mint) is also changeable without timelock. A compromised multisig could mint unlimited USN, inflate the sUSN exchange rate, and drain Morpho USDC via overborrowing
- **rescueToken() function without timelock**: The sUSN vault owner (multisig) can extract any ERC-20 tokens from the vault immediately — NOT behind the 48-hour timelock. This remains a significant extraction vector if the multisig is compromised
- **Operational functions without timelock**: Blacklisting, rebase manipulation, role grants, minting admin changes, and minting parameter changes can be executed immediately by the 3-of-6 multisig
- **Liquidity mismatch**: Private credit positions (Fasanara F-TAC) have T+3 month redemption windows while the protocol promises T+5 day user redemptions. A bank-run scenario could break the redemption guarantee
- **Stork oracle risk**: The Morpho market relies on a single Stork oracle feed with no fallback. A Stork outage or manipulation could cause incorrect liquidations
- **Blacklist capability**: Both USN and sUSN can blacklist addresses, freezing user funds without recourse — NOT behind timelock

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize on-chain evidence over documentation claims

### Critical Risk Gates

- [x] **No audit** — Protocol audited by Halborn (2x) and Hashlock (2x). Quantstamp audit unverifiable. Source code now public. **PASS**
- [x] **Unverifiable reserves** — **PASS (borderline)**. The majority of reserves are held off-chain with custodians. Team claims Alpaca/Dinari tokenization but not verified on-chain. Accountable provides independent verification (zero-knowledge proofs + secure enclaves) at [noon.accountable.capital](https://noon.accountable.capital/), which satisfies the "transparent attestation" leg of the gate — but the reserves themselves are custodial, not trustlessly on-chain. Concern carried into the Funds Management score rather than the gate
- [x] **Total centralization** — 3-of-6 Gnosis Safe multisig with 48-hour timelock on proxy upgrades. Not a single EOA. **PASS**

**All three gates pass.** The Unverifiable-reserves gate passes on the "transparent attestation" clause via Accountable; the residual opacity of off-chain custodial reserves is captured in the Funds Management category (Provability subscore 3.5). Proceed to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 2 audits by Halborn (reputable), 2 audits by Hashlock (lesser-known). Quantstamp audit unverifiable. Total: 4 verifiable audits across 2 firms
- **Source code**: Now public with Slither + Mythril CI and 96-100% test coverage
- **Bug Bounty**: None
- **Time in Production**: ~17 months public beta, ~17 months sUSN on-chain. Maturing protocol
- **TVL**: ~$26.57M (Apr 27, 2026, down from ~$30.75M on Mar 23 — -13.6% in 35 days). Small and now contracting
- **Incidents**: None reported

**Score: 3.0/5** — Multiple audits from reputable (Halborn) and lesser-known (Hashlock) firms. Source code now public with static analysis CI — a meaningful improvement enabling independent review. No bug bounty remains a gap. Production history of ~17 months (approaching score 2 rubric of 1-2 years). TVL ~$26.6M (still >$10M threshold for score 3; contracted 13.6% in the last 35 days — worth watching for the reassessment trigger at ~$15M). Between score 2 (2+ audits by reputable firms, 1-2 years, TVL >$50M) and score 3 (1 audit by reputable firm, bug bounty, 6-12 months, TVL >$10M). The public source code, multiple Halborn audits, and 17-month track record meet score 3 criteria. The absence of a bug bounty prevents reaching score 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 3-of-6 multisig with all anonymous signers
- **48-hour timelock on proxy upgrades** (verified on-chain) — most critical governance action is now delayed
- Operational functions (blacklist, rescueToken, rebase, role grants) remain **immediately executable** by multisig
- Blacklist capability on both tokens — NOT timelocked
- rescueToken() function allows token extraction — NOT timelocked
- Ownable2Step provides ownership transfer safety

**Governance Score: 3.5** — The 48-hour timelock on proxy upgrades is a significant improvement, meeting the score 3 rubric criterion of "24+ hours timelock." However, the 3-of-6 threshold (lower than score 3's 5/9) and the fact that operational functions (blacklist, rescueToken, rebase) are NOT behind the timelock keep this above score 3. Between score 3 (multisig 5/9 with timelock, powerful roles constrained by timelock) and score 4 (multisig 3/5, powerful admin roles with limited constraints). The timelock on upgrades prevents score 4, but the untimelocked operational powers and anonymous signers prevent score 3.

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

**Dependencies Score: 3.5** — Many dependencies including multiple custodians, a newer oracle provider (Stork), and two bridge protocols. Critical functionality (reserve custody) depends on multiple external parties. Ceffu funding rate arb being paused reduces one active critical dependency. DCLM market maker adds a contractual (not on-chain) dependency. Failure of any single custodian could partially break the system.

**Centralization Score = (3.5 + 3.5 + 3.5) / 3 = 3.5**

**Score: 3.5/5** — The 48-hour timelock on proxy upgrades significantly improves the governance posture compared to the previous assessment. However, operational functions remain untimelocked, signers are anonymous, and multiple custodial dependencies persist. The public source code enables independent review but doesn't reduce centralization directly.

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
- **DEX liquidity**: ~$5.7K USN daily volume, ~$1.6 sUSN daily volume (CoinGecko, Apr 27, 2026; was ~$626 / ~$118 on Apr 22 and ~$33K / ~$156 on Mar 23). Effectively no DEX exit for a ~$26.6M protocol
- **maxRedeem = 0**: Direct ERC-4626 redemption disabled. Must use withdrawal handler
- **Liquidity mismatch**: Private credit positions have T+3 month redemption vs T+5 day user guarantee
- **Same-value redemption**: sUSN redeems for USN (stablecoin-denominated)
- **Small TVL**: Large positions could dominate TVL and create concentration risk
- **Morpho context**: 5-day withdrawal delay makes liquidation of sUSN collateral slow — could be problematic at 86% LLTV

**Score: 3.5/5** — Withdrawals require up to 5 days and go through a handler process. DEX liquidity remains effectively zero on the sUSN side (~$1.6/day on Apr 27, vs ~$118 on Apr 22 and ~$156 on Mar 23). USN volume rebounded to ~$5.7K/day from ~$626 on Apr 22 — still negligible relative to TVL. The DCLM market maker backstop provides a contractual (off-chain) exit mechanism for >1% depeg events, which is a positive factor. The same-value stablecoin redemption is also positive. However, the Morpho market remains tightly utilized (**89.6% on Apr 27, was 100% on Mar 23**) — only ~$880K of withdrawable supply headroom. Between score 3 (market-based or short queues, >$1M, 3-7 days exit) and score 4 (withdrawal queues or restrictions, <$1M, >1 week or >10% impact). The DCLM backstop provides some comfort but is contractual, not on-chain. The tight Morpho utilization, 5-day withdrawal delay, and collapsed sUSN DEX volume offset the DCLM improvement, keeping score at 3.5.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Founder Arpan Gautam publicly identified (Wharton, McKinsey, Dexterity Capital). Other team members mostly unknown. Multisig signers all anonymous
- **Documentation**: Good quality, comprehensive safety framework documentation
- **Legal Structure**: BVI (DCLF Labs). Limited regulatory protection. Self-funded
- **Source code**: **Public** since March 18-19, 2026. [Protocol-Core](https://github.com/dclf-labs/Protocol-Core) and [Governance-Core](https://github.com/dclf-labs/Governance-Core). CI with Slither + Mythril. Contracts verified on Etherscan
- **Incident Response**: Documented 24-hour plan with emergency pause capability

**Score: 3.0/5** — Founder is doxxed with strong credentials, but the rest of the team and all multisig signers are unknown. Good documentation. BVI jurisdiction with limited oversight. **Source code now public** with CI including Slither + Mythril — a meaningful transparency improvement. Between score 2 (mostly public or known anons, good docs, established entity) and score 3 (mixed unknown and known anons, adequate docs, uncertain structure). The public source code and good documentation meet score 2-3 criteria, but the mostly unknown team and BVI jurisdiction keep this at score 3.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted | Previous |
|----------|-------|--------|----------|----------|
| Audits & Historical | 3.0 | 20% | 0.60 | 3.5 |
| Centralization & Control | 3.5 | 30% | 1.05 | 4.0 |
| Funds Management | 3.5 | 30% | 1.05 | 3.5 |
| Liquidity Risk | 3.5 | 15% | 0.525 | 3.5 |
| Operational Risk | 3.0 | 5% | 0.15 | 3.5 |
| **Final Score** | | | **3.375** | **3.65** |

**Final Score: 3.4** (rounded to 1 decimal) — improved from 3.6

**Key score changes:**
- **Centralization**: 4.0 → 3.5 (48-hour timelock on proxy upgrades, verified on-chain)
- **Audits & Historical**: 3.5 → 3.0 (public source code with CI, longer production history)
- **Operational Risk**: 3.5 → 3.0 (public repos, Slither/Mythril CI)
- **Funds Management**: 3.5 → 3.5 (unchanged — Alpaca/Dinari tokenization not verified on-chain)
- **Liquidity Risk**: 3.5 → 3.5 (unchanged — DCLM backstop offsets Morpho utilization risk; 89.6% Apr 27 vs 100% Mar 23)

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| 1.0-1.5 | Minimal Risk | Approved, high confidence |
| 1.5-2.5 | Low Risk | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | **Approved with enhanced monitoring** |
| 3.5-4.5 | Elevated Risk | Limited approval, strict limits |
| 4.5-5.0 | High Risk | Not recommended |

**Final Risk Tier: Medium Risk** (improved from Elevated Risk)

---

Noon's sUSN is a yield-bearing staked stablecoin backed by diversified strategies with institutional custodians and independent solvency verification. The ERC-4626 vault mechanics are standard and transparent.

Since the initial assessment, the team has made meaningful improvements: **48-hour timelock on proxy upgrades** (verified on-chain), **public source code** with CI including Slither + Mythril, and a **DCLM market maker backstop** providing contractual liquidation support. Ceffu funding rate arbitrage has been paused 12+ months.

However, concerns remain: the `mintAndRebase()` function allows **unbacked USN minting** (up to 50K/call, limit adjustable without timelock), operational functions (blacklist, rescueToken, rebase, USN admin) are **NOT behind the timelock**, all 6 multisig signers are anonymous, 2 EOAs still hold `REBASE_MANAGER_ROLE` (verified still true on Apr 27), the predominantly **off-chain custodial** reserve model limits on-chain verifiability (Alpaca/Dinari tokenization not verified on-chain), and the **5-day withdrawal delay** plus **89.6% Morpho utilization** (100% on Mar 23) create liquidity challenges. USN supply has also contracted ~14.2% in the last 35 days, worth watching against the ~$15M TVL reassessment trigger.

**For the intended Yearn use case (sUSN as Morpho collateral):**

The 5-day withdrawal lockup remains the primary compatibility concern. If sUSN collateral needs to be liquidated on Morpho, the liquidator cannot redeem sUSN for USN quickly — they must either sell on DEXes (which now show near-zero sUSN volume: ~$5.7K/day USN, ~$1.6/day sUSN) or wait up to 5 days via the withdrawal handler. The DCLM market maker backstop provides some comfort (contractual buyer at previous day's price within 24h during >1% depeg), but it is contractual/off-chain, not an on-chain guarantee. At 86% LLTV and 89.6% Morpho utilization (was 100% on Mar 23), this creates concentration and bad debt risk. The Stork oracle (non-Chainlink, single source, no fallback) adds additional risk.

**Key conditions for any exposure:**

- Monitor timelock for pending proxy upgrade transactions (48h delay gives time to react — **improvement**)
- Monitor multisig for untimelocked operational changes (blacklist, rescueToken, role grants, USN admin — **still critical**)
- Monitor `mintAndRebase()` calls — each one mints USN without collateral (up to 50K/call)
- Monitor `setRebaseLimit()` and `setAdmin()` calls — parameter changes with no timelock
- Monitor sUSN exchange rate for any decreases
- Monitor rebase events for frequency and consistency
- Monitor collateral wallet balances relative to USN supply
- Monitor Stork oracle feed vs sUSN vault exchange rate
- Monitor Morpho market utilization rate (currently 89.6%, was 100% on Mar 23 — thin withdrawal headroom)
- Verify Accountable proof of solvency dashboard is operational
- Request the team revoke `REBASE_MANAGER_ROLE` from EOAs (`0x1738...d699`, `0xcc24...b11f`)
- Request the team extend timelock to cover operational functions (blacklist, rescueToken, rebaseLimit, USN admin)
- Request the team implement a bug bounty program

---

## Reassessment Triggers

- **Time-based**: Reassess in 3 months (June 2026)
- **TVL-based**: Reassess if TVL changes by more than 50% (below ~$15M or above ~$46M)
- **Incident-based**: Reassess after any exploit, governance change, collateral modification, or custodian incident
- **Governance-based**: Reassess if timelock is extended to cover operational functions (blacklist, rescueToken, role grants) — should further improve Centralization score
- **Signer-based**: Reassess if known-entity or independent signers are added to the multisig
- **Bug bounty**: Reassess if/when a bug bounty program is launched
- **Audit-based**: Reassess if additional audits by tier-1 firms (Trail of Bits, OpenZeppelin, Cyfrin) are completed
- **Morpho market-based**: Reassess if the Stork oracle is replaced with a native Chainlink feed, if LLTV is adjusted, or if utilization returns to 100% (currently 89.6%)
- **DCLM backstop**: Reassess if DCLM market maker agreement is terminated (45-day notice period)
