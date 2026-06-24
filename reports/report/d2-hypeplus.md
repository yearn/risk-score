# Protocol Risk Assessment: D2 Finance HYPE++

- **Assessment Date:** June 23, 2026
- **Token:** HYPE++
- **Chain:** Arbitrum
- **Token Address:** [`0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`](https://arbiscan.io/address/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004)
- **Final Score: 3.73/5.0**

## Overview + Links

D2 Finance offers actively managed ERC-4626 strategy vaults. The scoped asset is the HYPE++ vault on Arbitrum, a USDC-denominated strategy vault whose funds are moved from the vault into a D2 trader/OMS contract during trading epochs. D2 docs describe each strategy as a standalone vault + trader contract + trader OMS; users deposit during a funding phase, funds are custodied by the trader during the trading phase, and funds are returned to the vault at the end of an epoch for withdrawal or rollover.

The HYPE++ vault is currently in epoch 20. Onchain state verified on June 23, 2026:

- Current epoch funding start: June 6, 2026 02:10 UTC.
- Current epoch trading start: June 8, 2026 13:00 UTC.
- Current epoch end: July 3, 2026 08:00 UTC.
- `custodied() = true`; direct user withdrawals are disabled while custodied.
- `totalAssets() = 12,417,628.982186 USDC`; `totalSupply() = 8,379,842.251215 HYPE++`.
- HYPE++ trader holds ~5.52M USDC directly and all outstanding dgnHYPE shares; dgnHYPE reports ~6.90M USDC `totalAssets()`. This reconciles to HYPE++ `totalAssets()`, but deeper dgnHYPE positions remain a nested D2 strategy dependency.

**Links:**

- [Protocol Documentation](https://gitbook.d2.finance/)
- [D2 HYPE++ Strategy Page](https://d2.finance/strategies/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004)
- [Architecture Docs](https://gitbook.d2.finance/protocol/architecture)
- [Trading Strategy Docs](https://gitbook.d2.finance/protocol/trading-strategies)
- [Smart Contract Audits](https://gitbook.d2.finance/security-and-contracts/smart-contract-audits)
- [Strategy Contract List](https://gitbook.d2.finance/security-and-contracts/smart-contracts/strategy-contracts)
- [D2 Multisig List](https://gitbook.d2.finance/security-and-contracts/smart-contracts/d2-multi-sigs)
- [Paladin D2 Audit Page](https://paladinsec.co/projects/d2/)
- [Cyfrin D2 v2.1 Audit PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-02-24-cyfrin-d2-v2.1.pdf)
- [Cyfrin D2 HYPE CoreWriter v2.0 Audit PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-10-16-cyfrin-d2-hype-corewriter-v2.0.pdf)
- [Arbitrum L2BEAT Risk Page](https://l2beat.com/scaling/projects/arbitrum)

## Contract Addresses

| Contract | Address | Type |
|----------|---------|------|
| HYPE++ Vault | [`0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`](https://arbiscan.io/address/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004) | `VaultV1Whitelisted`, ERC-4626-style vault |
| HYPE++ Trader / OMS | [`0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3`](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3) | Verified selector router (non-upgradeable; delegatecalls modules) |
| Trader Module (legacy) | [`0xc8071ad5560904b3b721e7e5d29742f523a69111`](https://arbiscan.io/address/0xc8071ad5560904b3b721e7e5d29742f523a69111) | Standalone AccessControl contract; deployed earlier, not proxy-linked to trader |
| Vault Owner | [`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46) | EOA, owns BOTH HYPE++ vault and dgnHYPE vault |
| Trader Admin / Executor / Fee Receiver | [`0x7ab129978091DEE65A319c5FC728818D73221999`](https://arbiscan.io/address/0x7ab129978091DEE65A319c5FC728818D73221999) | EOA with `DEFAULT_ADMIN_ROLE` and `EXECUTOR_ROLE` on trader |
| D2 Vault Multisig | [`0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0`](https://arbiscan.io/address/0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0) | Safe, 4-of-7; also trader admin/executor |
| dgnHYPE Vault | [`0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd`](https://arbiscan.io/address/0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd) | Nested D2 ERC-4626 vault held by HYPE++ trader |
| dgnHYPE Trader / Custody Safe | [`0x155d0B27B754ebC664aeD565945C1AaEa91966fb`](https://arbiscan.io/address/0x155d0B27B754ebC664aeD565945C1AaEa91966fb) | Nested D2 custody Safe, 3-of-5 |
| USDC | [`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`](https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831) | Underlying asset |
| Vault Factory | [`0xb5B272EF918835651375f84D463b1Ba7B61eF028`](https://arbiscan.io/address/0xb5B272EF918835651375f84D463b1Ba7B61eF028) | Deployed HYPE++ vault |
| Strategy Factory | [`0x2AA01FdE174aB160b4e4F49F152C20d6Ec029d67`](https://arbiscan.io/address/0x2AA01FdE174aB160b4e4F49F152C20d6Ec029d67) | Deployed HYPE++ trader |

Deployment metadata:

- HYPE++ vault and trader were deployed in transaction [`0xf5642a6a...6265e`](https://arbiscan.io/tx/0xf5642a6afa068616ac286c0c26ef32f46bc43333edf79fe071ff3f60b346265e) at Arbitrum block `276124793` on November 19, 2024.
- The vault is NOT behind a proxy (both EIP-1967 and OpenZeppelin transparent proxy slots are zero); it is a standalone `VaultV1Whitelisted` contract. Ownership is transferable via the standard Ownable `transferOwnership()`.
- The trader is NOT a standard proxy (EIP-1967/beacon/transparent proxy slots are zero); it is a standalone selector router that delegatecalls to pre-configured modules.
- The contract at [`0xc8071ad5560904b3b721e7e5d29742f523a69111`](https://arbiscan.io/address/0xc8071ad5560904b3b721e7e5d29742f523a69111) was deployed earlier (block `218684412`, tx [`0xe432dabc...8675`](https://arbiscan.io/tx/0xe432dabfc9572c103e858399f29530b458fdbb882b4ab0e94245eeae553a8675)) by a different EOA (`0x00Aa367B7692be05E47B9c461fF35410208158b0`) and is not referenced in the trader's bytecode; it does not serve as a proxy implementation for the HYPE++ trader.

## Audits and Due Diligence Disclosures

D2 publicly lists three audit links: Paladin, Cyfrin D2 v2.1, and Cyfrin Hyperliquid CoreWriter. The most directly relevant audit lineage is:

| Date | Firm | Scope | Link |
|------|------|-------|------|
| Mar 23, 2023 | Paladin | D2 staking contracts | [Paladin D2](https://paladinsec.co/projects/d2/) |
| Sep 27, 2023 | Paladin | D2 strategy stack including `VaultV1`, `TraderV0`, StrategyETH, AccessControl, and DeFi modules | [Paladin D2](https://paladinsec.co/projects/d2/) |
| Feb 24, 2025 | Cyfrin | D2 v2.1 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-02-24-cyfrin-d2-v2.1.pdf) |
| Oct 16, 2025 | Cyfrin | D2 HYPE CoreWriter v2.0 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-10-16-cyfrin-d2-hype-corewriter-v2.0.pdf) |

Paladin's public page lists the September 2023 strategy audit as completed with 85 total issues: 18 governance, 3 high, 8 medium, 23 low, and 33 informational. Paladin's page also cautions users to confirm they are interacting with audited contracts. HYPE++ was deployed later, in November 2024, but the verified source identifies the vault as `VaultV1Whitelisted` and the trader as D2's `Strategy` router/OMS architecture.

### Bug Bounty

No active Immunefi, Sherlock, Cantina, HackerOne, Code4rena, or Safe Harbor program was found in the D2 docs reviewed for this assessment. Targeted manual searches on Immunefi ("D2 Finance") and the [Safe Harbor registry](https://safeharbor.securityalliance.org/) (SEAL) returned no listed program. D2 publishes audit links and security process statements, but no public bounty with payout terms was verified onchain or through the platforms checked.

## Historical Track Record

HYPE++ was deployed on November 19, 2024, giving the scoped vault roughly 19 months of onchain history at the June 23, 2026 assessment date. Current scoped TVL is approximately $12.42M based on `totalAssets()` in USDC terms.

D2 documentation describes a broader multi-year strategy record and states that the team combines DeFi-native and traditional finance derivatives experience. This is useful context, but the report scores the onchain HYPE++ vault rather than offchain performance history.

No public exploit specific to the HYPE++ vault was identified in this pass. The main historical concern is not a known loss event; it is the intentionally active-managed design, where funds are transferred out of the vault into a trader contract and can be exposed to a broad set of trading modules, allowed tokens, nested D2 vault tokens, and external DeFi venues.

## Funds Management

HYPE++ is an ERC-4626-compatible USDC vault. Users deposit USDC during funding windows and receive HYPE++ shares. During the trading phase, the trader contract calls `custodyFunds()` on the vault and receives the vault's USDC. While `custodied = true`, `totalAssets()` returns the last `custodiedAmount` rather than current vault-held USDC.

Current reserve reconciliation, verified June 23, 2026:

| Component | Value |
|-----------|-------|
| HYPE++ `totalAssets()` | 12,417,628.982186 USDC |
| HYPE++ `totalSupply()` | 8,379,842.251215 shares |
| HYPE++ vault USDC balance | 0 USDC |
| HYPE++ trader direct USDC balance | 5,517,527.061191 USDC |
| HYPE++ trader dgnHYPE balance | 5,266,942.856401 dgnHYPE shares |
| dgnHYPE `totalSupply()` | 5,266,942.856401 shares |
| dgnHYPE `totalAssets()` | 6,900,278.503957 USDC |
| dgnHYPE trader direct USDC balance found | 1,000,278.503957 USDC |
| dgnHYPE trader custody type | 3-of-5 Safe |

The HYPE++ top-level arithmetic reconciles: direct USDC (~5.52M) plus dgnHYPE reported assets (~6.90M) equals HYPE++ `totalAssets()` (~12.42M). However, dgnHYPE itself is a nested active D2 strategy with custodied funds. Its `trader()` is a 3-of-5 Safe, and dgnHYPE uses the same custodied accounting pattern: while custodied, `totalAssets()` returns the stored `custodiedAmount` rather than live token balances. Only ~1.0M real Arbitrum USDC was found at the dgnHYPE Safe during this pass; the remaining dgnHYPE reported assets are therefore not fully verifiable from simple ERC-20 balances. Recent dgnHYPE Safe token-transfer history also includes a non-USDC token with a visually confusable symbol (`0xd13CEB6071cAe7d0A880059A022c1750E096D3ED`), which was not counted as backing.

**Control concentration:** The dgnHYPE vault's `owner()` is the same EOA ([`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46)) that owns the HYPE++ vault, concentrating control of both vaults in a single EOA.

### Accessibility

- Deposit and mint are available only during the funding phase, only while not custodied, and only for whitelisted users or users holding more than `whitelistBalance` of `whitelistAsset`.
- Current `whitelistAsset` is USDC and `whitelistBalance` is `1,000,000` base units (1 USDC), meaning users with more than 1 USDC can satisfy the holder branch of `onlyWhitelisted()`.
- Withdraw and redeem are available only while not custodied and not during an active epoch.
- Current `maxDeposits` is 12,500,000 USDC, and current `totalDeposits` is 12,417,628.982186 USDC.

### Token Mint Authority

**Mint mechanism:** ERC-4626 deposit/mint. HYPE++ shares are minted by `deposit()` or `mint()` only when USDC is transferred into the vault. There is no privileged `MINTER_ROLE` on the HYPE++ vault.

**Mint requires backing:** Yes at the HYPE++ vault level. `deposit()` and `mint()` route through OpenZeppelin ERC-4626 mechanics and require underlying asset transfer in the same transaction. This does not remove trading-loss risk after funds are custodied.

**Per-address mint authority** (verified onchain on June 23, 2026, from token contract `0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any user satisfying `onlyWhitelisted()` during funding | Yes | Yes, via redeem/withdraw after epoch | ERC-4626 deposit/redeem | Requires USDC transfer for mint; redeem is blocked while custodied or during epoch |
| [`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46) | No direct unbacked mint | No | Vault owner | EOA can set whitelist parameters, deposit caps, and epoch schedule |
| [`0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3`](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3) | No direct unbacked mint | No | Trader | Can custody and return funds; trading losses are borne by vault users |

**Rate limits / supply caps:** Current `maxDeposits` is 12,500,000 USDC.

**Backing check at mint time:** Atomic at the HYPE++ vault level. Collateral must transfer into the vault on mint/deposit.

### Collateralization

HYPE++ is not overcollateralized. It is a share token over an actively managed USDC strategy. The top-level HYPE++ accounting reconciles to direct USDC plus dgnHYPE shares, but the system is not equivalent to a passive collateral vault:

- While custodied, the vault's `totalAssets()` is the stored `custodiedAmount`, not a live mark-to-market of all current trader positions.
- The verified source comments on `returnFunds()` state that losses may be sustained during trading and investors suffer the loss.
- HYPE++ currently depends on dgnHYPE for ~55.6% of reported assets by value, creating recursive D2 strategy exposure.
- The trader's allowed token list contains 32 tokens (including volatile assets: WETH [`0x82aF49447D8a07e3bd95BD0d56f35241523fBab1`](https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1), WBTC [`0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f`](https://arbiscan.io/address/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f), ARB, GMX, GRAIL, PENDLE, LINK, wstETH, and old bridged USDC.e [`0xFF970A61A04b1cA14834A43f5dE4533eDBBD5CC8`](https://arbiscan.io/address/0xFF970A61A04b1cA14834A43f5dE4533eDBBD5CC8)) and the allowed spender list contains 30 addresses, including major Arbitrum DeFi venues and D2 strategy vaults.
- dgnHYPE's `trader()` is a 3-of-5 Safe; only ~1.0M real USDC was directly observed there versus ~6.90M reported `totalAssets()`.

### Provability

Top-level HYPE++ accounting is partially provable:

- `totalAssets()`, `custodiedAmount()`, direct USDC balances, dgnHYPE balances, and dgnHYPE `totalAssets()` are onchain.
- HYPE++ does not need an offchain price oracle for the top-level USDC + dgnHYPE share accounting observed in this pass.
- End-to-end position risk is not fully transparent from a single call because nested dgnHYPE is itself custodied by a Safe and reports stored custodied accounting while active.
- D2 docs state positions are generally onchain-verifiable but disclose exceptions for Flowdesk OTC trades and partial verifiability of Flowdesk collateral. No Flowdesk exposure was proven for HYPE++ in this pass, but the disclosure is relevant to D2's strategy model.

## Liquidity Risk

Exit liquidity is restricted by epoch state rather than by a normal liquid secondary market. Current HYPE++ withdrawals/redeems are unavailable because `custodied() = true` and the current epoch ends on July 3, 2026. Users can only redeem after the trader returns funds and the vault is out of epoch.

No meaningful onchain DEX liquidity for HYPE++ was identified in this pass. The primary exit path is vault redemption after epoch completion, subject to returned assets and any trading PnL. Large holders should assume exit timing is governed by the epoch schedule and D2's trader returning funds, not by instant secondary-market liquidity.

## Centralization & Control Risks

### Governance

The largest risk is centralization:

- HYPE++ vault owner is an EOA, not the documented D2 Vault MS.
- The owner EOA can call `startEpoch()`, `setMaxDeposits()`, `setWhitelistAsset()`, `setWhitelistBalance()`, `transferOwnership()`, and whitelist status functions.
- The HYPE++ vault is NOT behind a proxy (EIP-1967/beacon/transparent proxy slots verified zero). This means the vault logic cannot be upgraded, but ownership can be transferred at any time via `transferOwnership()`.
- HYPE++ trader `DEFAULT_ADMIN_ROLE` holders are the D2 Vault MS and an EOA.
- HYPE++ trader `EXECUTOR_ROLE` holders are the D2 Vault MS and the same EOA.
- The EOA also receives trader fees via `feeReceiver()`.
- The D2 Vault MS is a 4-of-7 Safe, matching D2's documented vault multisig address, but there is no onchain timelock on trader role changes or vault owner actions.
- dgnHYPE vault has the same EOA owner as HYPE++, further concentrating control.

The trader contract is a standalone selector router (code size ~4.2KB; EIP-1967/beacon/transparent proxy slots all zero) that delegatecalls modules based on `msg.sig`. The constructor wires selectors to module targets. The trader uses OpenZeppelin `AccessControl` (not `AccessControlEnumerable`), so `getRoleMemberCount` and `getRoleMember` are not available — role-holder enumeration requires scanning `RoleGranted`/`RoleRevoked` events. Operationally, this gives the executor a broad DeFi action surface, bounded by the strategy's allowed tokens/spenders/modules, but still much more discretionary than a passive vault.

### Programmability

The strategy is hybrid/manual:

- Vault deposit/withdraw rules are programmatic.
- Trading execution is manual or offchain-directed through executor role calls into the trader OMS.
- Epoch start/end scheduling is owner-controlled.
- PnL crystallizes when the trader returns funds to the vault.

The design is appropriate for an active derivatives/managed strategy product, but it scores poorly under a Yearn-style risk framework because users rely on D2 operators to trade safely and return funds.

### External Dependencies

Dependencies include:

- Arbitrum One as the execution chain. L2BEAT lists Arbitrum One as a Stage 1 optimistic rollup and notes upgrade/security-council and sequencer-related trust assumptions.
- Circle/Arbitrum USDC as the base asset.
- D2's nested dgnHYPE strategy.
- Broad Arbitrum DeFi venues approved in the trader's allowed spender list, including Aave, 1inch, GMX/Camelot-style modules, and D2 strategy contracts.
- Offchain operator process for strategy decisions.

## Operational Risk

D2 documentation is materially better than many active-manager vaults: it describes architecture, epochs, security process, strategy philosophy, multisigs, and audit links. D2 also discloses BVI approved asset manager language and a Marshall Islands DAO for frontend hosting.

Operational gaps remain:

- The current HYPE++ vault owner is an EOA, not the documented Vault MS; no D2 documentation reviewed explains this vault-specific ownership choice or states whether ownership will be transferred.
- The EOA with trader admin/executor/fee-receiver roles is not identified in the docs reviewed.
- No public bug bounty with payout terms was found.
- Nested dgnHYPE backing is only partially transparent from ERC-20 balances: the dgnHYPE Safe directly held ~1.0M real USDC against ~6.90M reported `totalAssets()`.

## Monitoring

Recommended monitoring frequency: hourly during active epochs, daily outside active epochs.

Monitor these contracts and values:

- HYPE++ vault [`0x7528...5004`](https://arbiscan.io/address/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004)
  - `custodied()`, `custodiedAmount()`, `totalAssets()`, `totalSupply()`, `totalDeposits()`, `maxDeposits()`, `getCurrentEpochInfo()`
  - Events: `EpochStarted`, `FundsCustodied`, `FundsReturned`, `NewMaxDeposits`, `NewWhitelistStatus`, `OwnershipTransferred`
- HYPE++ trader [`0x8CaB...45B3`](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3)
  - `hasRole(DEFAULT_ADMIN_ROLE, account)` and `hasRole(EXECUTOR_ROLE, account)` for known holders
  - The trader uses plain `AccessControl` (not `AccessControlEnumerable`); `getRoleMemberCount` and `getRoleMember` are unavailable. Monitor `RoleGranted`/`RoleRevoked` events for role-holder enumeration.
  - Events: `RoleGranted(bytes32,address,address)`, `RoleRevoked(bytes32,address,address)`
  - `getAllowedTokens()`, `getAllowedSpenders()`, `feeReceiver()`, `performanceFeeRate()`, `managementFeeRate()`
  - Note: `setFeeReceiver()` is gated by `DEFAULT_ADMIN_ROLE` (verified onchain). `setPerformanceFeeRate` and `setManagementFeeRate` selectors were not found on the trader's direct interface — fee changes may route through modules.
- Vault owner EOA [`0x0E8c...9A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46)
  - All outbound transactions to HYPE++ vault, dgnHYPE vault, and any vault factory.
  - Note: This EOA owns both HYPE++ and dgnHYPE vaults.
- Trader role EOA [`0x7ab1...1999`](https://arbiscan.io/address/0x7ab129978091DEE65A319c5FC728818D73221999)
  - All role/admin/trading transactions.
- D2 Vault MS [`0xB2fE...6CE0`](https://arbiscan.io/address/0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0)
  - Safe: `getThreshold()`, `getOwners()`; monitor `AddedOwner`, `RemovedOwner`, `ChangedThreshold` events.
  - Trader role changes via this Safe.
- dgnHYPE vault [`0x6416...59dd`](https://arbiscan.io/address/0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd)
  - `totalAssets()`, `totalSupply()`, `custodied()`, `trader()`, `owner()`
- dgnHYPE Safe [`0x155d...66fb`](https://arbiscan.io/address/0x155d0B27B754ebC664aeD565945C1AaEa91966fb)
  - `getThreshold()`, `getOwners()`; monitor threshold/owner changes and direct USDC balance against reported `custodiedAmount`.

Suggested alert thresholds:

- Any vault `OwnershipTransferred` event.
- Any trader `RoleGranted` or `RoleRevoked` event.
- Any `setMaxDeposits()` change greater than 10%.
- Any new epoch with an end timestamp materially longer than 30 days.
- Any mismatch where direct HYPE++ trader assets plus dgnHYPE-derived assets fail to reconcile to HYPE++ `totalAssets()` by more than 1%.
- Any dgnHYPE `totalAssets()` drop greater than 2% between checks.

## Appendix: Contract Architecture

```
User USDC
   |
   v
[HYPE++ Vault / VaultV1Whitelisted]  (non-upgradeable, no proxy)
   - ERC-4626 share token
   - owner: EOA 0x0E8c... (Ownable, transferOwnership available)
   - deposits only during funding window
   - withdrawals only after epoch and when not custodied
   - trader is immutable (set at construction, no setTrader function)
   |
   | custodyFunds() during epoch (only trader can call)
   v
[HYPE++ Trader / Strategy OMS]  (selector router, not a proxy, ~4.2KB)
   - delegatecalls modules by msg.sig; AccessControl (not Enumerable)
   - DEFAULT_ADMIN_ROLE: Vault MS + EOA 0x7ab1...
   - EXECUTOR_ROLE: Vault MS + EOA 0x7ab1...
   - fee receiver: EOA 0x7ab1... (performanceFeeRate = 20%)
   - allowed tokens/spenders define trading surface
   |
   +--> Direct USDC balance (~5.52M)
   |
   +--> [dgnHYPE Vault shares] (~5.27M shares = 100% of supply)
          |
          v
        [dgnHYPE Vault / VaultV1Whitelisted]  (non-upgradeable, no proxy)
          - owner: EOA 0x0E8c... (same EOA as HYPE++ vault owner)
          - trader: 3-of-5 Safe 0x155d...
          |
          v
        [dgnHYPE Trader / 3-of-5 Safe]
          - reports ~6.90M USDC totalAssets (custodiedAmount)
          - ~1.0M real USDC directly observed; remainder in active positions

Governance / control:

[EOA 0x0E8c...] --owns--> [HYPE++ Vault]
[EOA 0x0E8c...] --owns--> [dgnHYPE Vault]
[Vault MS 4/7]  --DEFAULT_ADMIN+EXECUTOR--> [HYPE++ Trader]
[EOA 0x7ab1...] --DEFAULT_ADMIN+EXECUTOR--> [HYPE++ Trader]
[EOA 0x7ab1...] <--feeReceiver-- [HYPE++ Trader]
```

---

## Risk Summary

### Key Strengths

- HYPE++ share minting requires USDC deposit; no privileged unbacked share minter was found.
- Top-level HYPE++ assets reconcile to direct USDC plus dgnHYPE shares.
- The vault is not upgradeable (no proxy); the trader is a non-proxy selector router — no hidden upgrade path was found.
- D2 publishes architecture docs, multisig docs, contract lists, and audit links.
- The D2 Vault MS is a 4-of-7 Safe and holds trader admin/executor roles alongside the EOA.

### Key Risks

- HYPE++ vault owner is an EOA with direct control over epoch scheduling, deposit caps, and whitelist settings. The same EOA also owns the dgnHYPE vault.
- Trader admin/executor authority includes an EOA with no timelock.
- The trader's allowed token list includes volatile assets (WETH, WBTC, ARB, GMX, GRAIL, PENDLE, LINK, wstETH) and old bridged USDC.e, expanding the strategy risk surface.
- Funds are actively custodied by the trader during epochs; users cannot withdraw while custodied.
- HYPE++ currently has large nested exposure to dgnHYPE (~55.6% of assets), another D2 active strategy controlled by the same EOA owner.
- End-to-end backing is not a simple live reserve balance; it depends on D2 trader execution and return of funds.

### Critical Risks

- A compromised or malicious trader executor can interact with a broad allowed DeFi surface (32 tokens, 30 spenders) and cause trading losses before funds are returned.
- A compromised or malicious vault owner can manipulate epoch timing, transfer ownership, and change access controls for BOTH vaults, delaying exits or changing who can deposit/redeem.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one.
- Use decimals when a subcategory falls between scores.
- Prioritize onchain evidence over documentation claims.

### Critical Risk Gates

- [ ] **No audit** - Protocol has not been audited by reputable firms
- [ ] **Unverifiable reserves** - Reserves cannot be verified onchain or through transparent attestation
- [ ] **Total centralization** - Controlled by a single EOA with no multisig or governance

The total-centralization gate is not marked because the D2 Vault MS also holds trader roles. However, the EOA owner and EOA trader role-holder materially drive the high centralization score.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

| Score | Audit coverage | Bug bounty |
|-------|-----------------|------------|
| **1** | 3+ audits by top firms | Active, max payout >$1M |
| **2** | 2+ audits by reputable firms | Max payout >$200K |
| **3** | 1 audit by reputable firm | Bounty program present |
| **4** | 1 audit by lesser-known firm or dated | Minimal or no bounty |
| **5** | No audit (CRITICAL GATE) | - |

**Subcategory B: Historical Track Record**

| Score | Time in production | Scale (TVL) |
|-------|-------------------|-------------|
| **1** | >2 years | Sustained >$100M |
| **2** | 1-2 years | >$50M |
| **3** | 6-12 months | >$10M |
| **4** | 3-6 months | <$10M |
| **5** | <3 months | No meaningful TVL |

**Audits & Historical Score = (2.0 + 2.5) / 2 = 2.25/5** - Multiple audits exist, and HYPE++ has more than one year of history, but scoped TVL is much lower than $50M and no public bug bounty was verified.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

| Score | Contract Upgradeability | Timelock | Privileged Roles |
|-------|------------------------|----------|-----------------|
| **1** | Immutable or fully decentralized DAO | 7+ days timelock on critical operations | Multisig above 3/5 threshold, no EOA roles. Multi-party approval required |
| **2** | Multisig 7/11+ with timelock | 24+ hours | Limited roles, cannot seize funds |
| **3** | Multisig 5/9 with timelock | 24+ hours | Some powerful roles, constrained by timelock |
| **4** | Multisig 3/5 or low threshold | <12 hours | Powerful admin roles with limited constraints |
| **5** | EOA or <3 signers (CRITICAL GATE) | No timelock | Unlimited admin powers |

**Subcategory B: Programmability**

| Score | System Operations | PPS/Rate Definition |
|-------|------------------|---------------------|
| **1** | Fully programmatic | Calculated onchain algorithmically |
| **2** | Mostly programmatic with minor admin input | onchain with some parameters |
| **3** | Hybrid onchain/offchain operations | onchain but reliant on admin updates |
| **4** | Significant manual intervention required | Offchain accounting with periodic reporting |
| **5** | Fully custodial/centralized operations | Admin-controlled rate, no transparency |

**Subcategory C: External Dependencies**

| Score | Protocol Dependencies | Criticality |
|-------|----------------------|-------------|
| **1** | No external dependencies | N/A |
| **2** | 1-2 blue-chip dependencies | Non-critical |
| **3** | 2-3 established protocol dependencies | Some critical functions depend on them |
| **4** | Many or newer protocol dependencies | Critical functionality depends on them |
| **5** | Single point of failure dependency | Failure breaks entire protocol |

**Centralization Score = (4.5 + 4.0 + 4.0) / 3 = 4.17/5** - EOA owner and EOA trader admin/executor roles, no timelock, broad manual trading, nested D2 strategy exposure, and many allowed external venues.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

| Score | Backing | Collateral Quality | Verifiability |
|-------|---------|-------------------|---------------|
| **1** | 100%+ onchain, over-collateralized | Blue-chip assets (ETH, WBTC, stablecoins) | Real-time onchain verification |
| **2** | 100% onchain collateral | High-quality DeFi assets (LSTs, major LPs) | onchain with some complexity |
| **3** | 100% collateral, some offchain | Mixed quality or newer protocols | Periodic custodian attestation |
| **4** | Partially collateralized or custodial | Lower-quality or illiquid assets | Opaque or infrequent reporting |
| **5** | Uncollateralized or unverifiable (CRITICAL GATE) | Unknown or very high-risk assets | No verification possible |

**Subcategory B: Provability**

| Score | Reserve Transparency | Reporting Mechanism | Third-Party Verification |
|-------|---------------------|--------------------|-----------------------|
| **1** | Fully onchain, anyone can verify | Programmatic, real-time | Multiple verification sources |
| **2** | Mostly onchain, some offchain | onchain with periodic updates | Single reliable source |
| **3** | Hybrid onchain/offchain | Manual reporting by admins | Known custodian attestation |
| **4** | Primarily offchain | Infrequent reporting | Self-reported only |
| **5** | Opaque, cannot verify | No reporting | No verification |

**Funds Management Score = (4.0 + 4.5) / 2 = 4.25/5** - Top-level balances reconcile, but funds are custodied during active trading, `totalAssets()` is not a live full-position valuation while custodied, and nested dgnHYPE backing is only partially visible from ERC-20 balances.

#### Category 4: Liquidity Risk (Weight: 15%)

| Score | Exit Mechanism | Liquidity Depth | Large Holder Impact |
|-------|---------------|----------------|---------------------|
| **1** | Direct 1:1 redemption, instant | >$10M, <0.5% slippage | Full exit with <0.5% impact |
| **2** | Direct redemption with minor delays | >$5M, <1% slippage | Exit with <1% impact over 1-3 days |
| **3** | Market-based or short queues | >$1M, 1-3% slippage | 3-7 days for full exit |
| **4** | Withdrawal queues or restrictions | <$1M, >3% slippage | >1 week or >10% impact |
| **5** | No clear exit mechanism | No liquidity | Cannot exit without massive losses |

**Score: 4.0/5** - Exit path is clear but restricted by epoch/custody state; no meaningful secondary liquidity was verified.

#### Category 5: Operational Risk (Weight: 5%)

| Score | Team Transparency | Documentation | Legal/Compliance |
|-------|------------------|---------------|-----------------|
| **1** | Fully doxxed or well-known, established reputation | Excellent, comprehensive | Clear legal structure |
| **2** | Mostly public or known anons | Good, mostly complete | Established entity |
| **3** | Mixed unknown and known anons | Adequate, some gaps | Uncertain structure |
| **4** | Mostly unknown, limited info | Poor or outdated | No clear legal entity |
| **5** | Fully unknown, no reputation | No documentation | No legal structure |

**Score: 3.0/5** - Documentation and audit disclosures are adequate, but operational role-holder identity, bug bounty status, and vault-owner mismatch remain gaps.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.25 | 20% | 0.45 |
| Centralization & Control | 4.17 | 30% | 1.25 |
| Funds Management | 4.25 | 30% | 1.28 |
| Liquidity Risk | 4.00 | 15% | 0.60 |
| Operational Risk | 3.00 | 5% | 0.15 |
| **Final Score** | | | **3.73/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk**

---

## Reassessment Triggers

- **Governance-based:** Reassess immediately if vault ownership transfers, trader roles change, Safe threshold/signers change, or a timelock is added.
- **Epoch-based:** Reassess if funds are not returned within 72 hours after the published epoch end or if a new epoch exceeds 30 days.
- **Funds-based:** Reassess if HYPE++ `totalAssets()` falls by more than 2% outside expected fee/PnL reporting, or if reconciliation between HYPE++ direct assets plus dgnHYPE-derived assets fails by more than 1%.
- **Dependency-based:** Reassess if dgnHYPE strategy composition changes, if dgnHYPE experiences losses, or if Flowdesk/OTC exposure is introduced.
- **Incident-based:** Reassess after any D2, Arbitrum, GMX, Aave, 1inch, Camelot, Circle USDC, or nested D2 strategy incident.
