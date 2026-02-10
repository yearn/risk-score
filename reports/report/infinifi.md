# Protocol Risk Assessment: InfiniFi

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT, USDe, sUSDe) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol automatically deploys deposited collateral into various DeFi yield strategies (Aave, Fluid, Pendle, Ethena) to generate returns.

The protocol offers three tiers of tokens:

1. **iUSD**: The base stablecoin (deposit receipt). Not yield bearing directly but liquid.
2. **siUSD**: Staked iUSD. Yield-bearing and liquid (can be exited via secondary markets).
3. **liUSD**: Locked iUSD. Highest yield, governance power, but locked for 1-13 weeks. Serves as "first loss" capital.

**Links:**

- [Protocol Documentation](https://docs.infinifi.xyz/)
- [Protocol App](https://infinifi.xyz/)
- [Protocol Analytics](https://stats.infinifi.xyz/)
- [GitHub](https://github.com/InfiniFi-Labs/infinifi-protocol)
- [Audits](https://docs.infinifi.xyz/audits)


## Contract Addresses

All contracts verified on Blockscout/Etherscan. Compiled with Solidity 0.8.28 (except Gnosis Safe: 0.7.6).

- **iUSD (ReceiptToken)**: [`0x48f9e38f3070AD8945DFEae3FA70987722E3D89c`](https://etherscan.io/address/0x48f9e38f3070AD8945DFEae3FA70987722E3D89c) — ERC20, restricted mint/burn via CoreControlled roles
- **siUSD (StakedToken)**: [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) — ERC4626 vault wrapping iUSD
- **InfiniFiCore (AccessControl)**: [`0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490`](https://etherscan.io/address/0xF6d48735EcCf12bDC1DF2674b1ce3fcb3bD25490) — Central AccessControlEnumerable, 17+ roles. DEFAULT_ADMIN_ROLE has 0 holders (renounced).
- **Gateway (Proxy)**: [`0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5`](https://etherscan.io/address/0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5) — TransparentUpgradeableProxy → InfiniFiGatewayV3 (`0xb44e494535A8fC1f0081F4F9289BCc7c57FbffB6`)
- **Gateway ProxyAdmin**: [`0x21071E0f9D600571Ffe47873e95fffF2FAc9141c`](https://etherscan.io/address/0x21071E0f9D600571Ffe47873e95fffF2FAc9141c) — Owned by Long Timelock (7-day delay for upgrades)
- **Liquid Farms (Instant Liquidity)**:
  - **Fluid USDC (ERC4626Farm)**: [`0x1484d6C834Ac99B9E50B17e57F85C8603F65657A`](https://etherscan.io/address/0x1484d6C834Ac99B9E50B17e57F85C8603F65657A) — targets fUSDC vault
  - **Euler Sentora USDC (ERC4626Farm)**: [`0x6FBc446f25Ab5141C4F7E7711E52DFc0AdA407A5`](https://etherscan.io/address/0x6FBc446f25Ab5141C4F7E7711E52DFc0AdA407A5) — targets eUSDC-70 EVK vault
  - **Aave v3 Horizon (AaveV3Farm)**: [`0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032`](https://etherscan.io/address/0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032) — targets aHorRwaUSDC
  - **Spark USDC Vault (SparkSUSDCFarm)**: [`0xd880D7C5CaFdbE2AEc281250995abF612235e563`](https://etherscan.io/address/0xd880D7C5CaFdbE2AEc281250995abF612235e563) — targets sUSDC
  - **Aave (AaveV3Farm)**: [`0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580`](https://etherscan.io/address/0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580) — targets aEthUSDC
- **Team Multisig**: [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c) — Gnosis Safe v1.4.1, **4/7 threshold**, 7 EOA signers, nonce 287
- **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s delay
- **Short Timelock (1 day)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — 86,400s delay

## Audits and Due Diligence Disclosures

InfiniFi has undergone extensive security review via Certora, Spearbit/Cantina Code, and a Cantina public competition, plus multiple ongoing upgrade reviews.

- **Spearbit / Cantina Code** (March-April 2025): Main protocol security review. Report published April 1, 2025. Findings: **8 High, 6 Medium, 25 Low, 4 Gas, 24 Informational**. Auditors: Noah Marconi (Lead), R0bert (Lead), Slowfi, Jonatas Martins. [Report PDF](https://raw.githubusercontent.com/spearbit/portfolio/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf).
- **Certora**: Formal Verification & Security Assessment (March 21 – May 20, 2025). Report published June 4, 2025. Covers formal verification via Certora Prover and manual review. [Report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report).
- **Cantina Public Competition** (April 2025): Public audit competition. [Competition link](https://cantina.xyz/competitions/2ac7f906-1661-47eb-bfd6-519f5db0d36b). Reward pool claimed ~$40,000 ($35k + $5k) — amount unconfirmed via automation.
- **Ongoing Cantina Code / Spearbit Managed Reviews** (6+ additional reviews of upgrades):
  - siUSD rewards interpolation update
  - Pendle SY farm integration
  - Multiasset farms (new farm types)
  - PR 209: Multiple new farms
  - PR 228: J-Curve Smoother, ReservoirFarm, Fluid rewards
  - PR 224: Crosschain support (CCIP + LayerZero)
  All PDFs accessible via [auditor portfolio](https://r0bert-ethack.github.io/).
Note: The initial Spearbit audit and "Cantina Code" review appear to be the **same engagement** (same auditors, same date, same file size). They should not be counted as separate audits.

### Bug Bounty

- [Bug Bounty Program on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591)

## Historical Track Record

- **Production History**: The protocol launched in June 2025 with a points program beginning June 1, 2025, designed to reward participation during its six month launch phase.
- **TVL**: $177.69M. (03.02.26)
- **Incidents**: No reported security incidents or exploits found.
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed into "liquid DeFi platforms" (AAVE, Fluid) and fixed yield strategies (Pendle, Ethena).
- **Asset Allocation**: As of February 2026, $37.78M (21%) is held in Liquid Farms (instant withdrawal available) and $139.91M (79%) in Illiquid Farms (locked maturity).
- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Minting**: Users deposit supported assets (USDC, USDT, USDe, sUSDe) to mint iUSD.
- **Redemption**:

  - **Instant**: Users can instantly redeem iUSD for USDC as long as there is sufficient liquidity in the _Liquid Farms_ (currently ~$37.78M). No queue, whitelisting not required, anyone can redeem. When this reserve is depleted, there will be a FIFO queue.

  - **Queue**: If liquid reserves are depleted, redemption requests enter a **FIFO Queue**. Pending requests are fulfilled as capital is unwound from illiquid strategies or new deposits enter.
  - **Whitelisting**: No whitelist for redemption; anyone holding iUSD can redeem or enter the queue.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Off-chain Risks**: The strategies mentioned (Aave, Fluid, Pendle, Ethena, Maple) are mostly on-chain, though Maple involves institutional lending which carries off-chain credit risk.
- **Token Breakdown**: 115.07M siUSD (Staked), 43.34M liUSD (Locked), 24.86M iUSD (Liquid/Unstaked).

### Provability

- **Transparency**: Reserves and allocations are verifiable on-chain.
- **Reserves**: $37.78M in liquid reserves.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: $3.3M on-chain DEX liquidity. Instant redemptions against the $37.78M liquid reserve.
  - **Coverage**: The $37.78M liquid reserve fully covers the circulating unstaked iUSD supply (24.86M).
    - **siUSD**: The holders of siUSD can exit with this flow: siUSD --> iUSD --> USDC.
    - **liUSD**: Locked (1-13 weeks) but represented by a transferable ERC20 token, allowing for potential secondary market exit.
- **Withdrawal Queues**: "Only time there'd be a queue is if there was a mass withdrawal event & these funds depleted." The protocol manages this via the liability ladder and keeping significant liquid reserves.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 day delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 day delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Team Multisig**: Gnosis Safe v1.4.1 at [`0x80608f852D152024c0a2087b16939235fEc2400c`](https://etherscan.io/address/0x80608f852D152024c0a2087b16939235fEc2400c). **4/7 threshold**, 7 anonymous EOA signers.

  | # | Signer | Additional Roles |
  |---|--------|------------------|
  | 1 | `0x7055E782B94b15BB6142aaFB326a9CeC36399eE5` | — |
  | 2 | `0xDAdB38219425c761dd0f3a4d684Fc36f533af7bD` | EXECUTOR_ROLE (timelock) |
  | 3 | `0xa9BDBEb17c81677Cb1830B74B1832C16Ec5CEF61` | — |
  | 4 | `0x6DFa1A32604088EB969242AafFb92420F78373f6` | EXECUTOR_ROLE (timelock) |
  | 5 | `0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685` | PAUSE |
  | 6 | `0xfd4691dfA327Adb0d6f3c7b4224B3cc881D4F6fa` | EXECUTOR_ROLE (timelock) |
  | 7 | `0x383965940c950008a4B67BfaA477Fdf6AC91a7F7` | EXECUTOR_ROLE (timelock), PAUSE |

- **Timelocks**: Both are custom `Timelock.sol` extending OZ TimelockController. They override `hasRole()` to delegate role checks to the central `InfiniFiCore` contract. Both have DEFAULT_ADMIN_ROLE renounced (immutable role configuration).

  - **Long Timelock (7 days)**: [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) — 604,800s confirmed on-chain.
  - **Short Timelock (1 day)**: [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) — 86,400s confirmed on-chain.

  **Role assignments on both timelocks** (verified on-chain via InfiniFiCore):

  | Role | Holder(s) |
  |------|-----------|
  | PROPOSER_ROLE | Multisig (4/7 required to schedule) |
  | CANCELLER_ROLE | Multisig (4/7 required to cancel) |
  | EXECUTOR_ROLE | 5 individual EOAs: signers #2, #4, #6, #7 + deployer EOA (`0xdecaDAc8778D088A30eE811b8Cc4eE72cED9Bf22`) |

  Governance flow: **Multisig proposes (4/7) → Timelock delay → Any 1 of 5 executor EOAs triggers execution.**

- **GOVERNOR role holders** (3 contracts, verified on InfiniFiCore):
  - Long Timelock (`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`)
  - MinorRolesManager (`0xa08Bf802dCecd3c44E6420a52d5158867366be9b`) — can only grant/revoke PAUSE, PERIODIC_REBALANCER, FARM_SWAP_CALLER
  - FluidRewardsClaimer (`0xD0ec80032C0da717BD78B9569321D9069365241E`) — can only claim Fluid rewards
  - Deployer EOA has properly **renounced** GOVERNOR. DEFAULT_ADMIN_ROLE has **0 holders** on Core.

- **Actions by timelock tier**:

    **Long Timelock (7 days) — GOVERNOR role:**
    enableBucket, setMaxLossPercentage, setAddress (gateway), setAfterMintHook, setBeforeRedeemHook, setYieldSharing, enableAsset, disableAsset, setLendingPool, setSafeAddress, emergencyAction, proxy upgrades (owns ProxyAdmin), all role grants/revokes (except MinorRolesManager-delegated roles)

    **Short Timelock (1 day) — PROTOCOL_PARAMETERS role:**
    setBucketMultiplier, setMinAssetAmount, setSafetyBufferSize, setPerformanceFeeAndRecipient, setLiquidReturnMultiplier, setTargetIlliquidRatio, setCap, setMaxSlippage, addFarms, removeFarms, setEnabledRouter, setPendleRouter, setCooldown, setAssetRebalanceThreshold

    **Short Timelock (1 day) — ORACLE_MANAGER role:**
    setOracle, setPrice
    Note: ORACLE_MANAGER has 4 holders: Short Timelock + Accounting contract + YieldSharingV2 contract + Oracle Factory contract.

    **Multisig WITHOUT timelock:**
    | Role | Capability |
    |------|-----------|
    | UNPAUSE | Unpause any paused contract |
    | EMERGENCY_WITHDRAWAL | Move funds from farms to predefined safe address, deprecate farms |
    | MANUAL_REBALANCER | Rebalance funds between whitelisted farms |
    | FARM_SWAP_CALLER | Trigger swap operations in farms |
    | MINOR_ROLES_MANAGER | Grant/revoke PAUSE, PERIODIC_REBALANCER, FARM_SWAP_CALLER via MinorRolesManager contract |

- **PAUSE role holders** (4 individual EOAs can pause the protocol without multisig/timelock):
  - `0x383965940c950008a4B67BfaA477Fdf6AC91a7F7` (multisig signer #7)
  - `0xd53Ffb2DB125015aB4D461bAD3fA959Ef1a1e685` (multisig signer #5)
  - `0x6ef71cA9cD708883E129559F5edBFb9d9D5C1d8A`
  - `0x0652412777f0c1F46b1164d5cdF3295Bdf43F2f2`

- **emergencyAction bypass analysis**: The `Timelock.sol` contract **overrides emergencyAction to a no-op**, preventing any GOVERNOR holder from using it to bypass timelock delays. This is a deliberate safety mechanism confirmed in source code.

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
- **Oracle Updates**: Oracles are upgradeable via governance (**Short Timelock**, 1-day delay). The iUSD price oracle (`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`) is a FixedPriceOracle — price changes only during loss socialization events (de-peg).

### External Dependencies

- **Dependency**: Heavily dependent on the performance and security of **Aave, Fluid, Pendle, and Ethena**. A failure in any of these protocols would result in losses (absorbed first by liUSD).
- **Stablecoins**: Dependent on USDC, USDT, USDe, sUSDe pegs.

## Operational Risk

- **Team**: InfiniFi Labs. Pseudonymous/semi-anonymous team. Key contributors identified via GitHub:
  - **eswak (Erwan Beauvois)**: Lead architect. Former Fei Protocol core dev (2021-2022), Ethereum Credit Guild core dev (2022-2024). Toulouse, France.
  - **RobAnon (@RobAnon94)**: Contributor. Former sole developer of Revest Finance core contracts. Note: Revest Finance was exploited for ~$2M via reentrancy in March 2022.
  - **nikollamalic (Nikola Malic)**: Developer. Former Revest Finance infrastructure contributor.
  - No public team page. GitHub org has zero public members listed.
- **Funding**: $3M Pre-Seed (Feb 2025) led by Electric Capital, with participation from New Form Capital, Axiom, Kraynos Capital, Sam Kazemian (Frax Finance founder), Defi Dad.
- **Legal Structure**: No disclosed legal entity, jurisdiction, or DAO structure. TODO.
- **Documentation**: Technical documentation in the GitHub README is comprehensive. Public docs at [docs.infinifi.xyz](https://docs.infinifi.xyz/) behind Cloudflare protection (content not independently verified).
- **Communication**: Twitter/X at [@infinifilabs](https://x.com/infinifilabs). No public governance forum found (not on Snapshot, Tally, or Commonwealth).
- **Incident Response**: No documented incident response plan found. Emergency capabilities exist via EMERGENCY_WITHDRAWAL role (multisig, no timelock) and system pause (4 individual EOAs).

## Monitoring

### Contracts to Monitor

| Contract | Address | Why Monitor Directly |
|----------|---------|---------------------|
| **Long Timelock** | [`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`](https://etherscan.io/address/0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9) | All critical governance actions (GOVERNOR role) |
| **Short Timelock** | [`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`](https://etherscan.io/address/0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32) | Parameter changes (PROTOCOL_PARAMETERS, ORACLE_MANAGER) |
| **EmergencyWithdrawal** | [`0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9`](https://etherscan.io/address/0xa406aFC7967C63C5c454AD1f0e0dB9a761fe26e9) | Multisig-direct, no timelock |
| **ORACLE_IUSD** | [`0x8ABc952f91dB6695E765744ae340BC5eA4B344c1`](https://etherscan.io/address/0x8ABc952f91dB6695E765744ae340BC5eA4B344c1) | De-peg event (autonomous, triggered by loss socialization) |
| **LockingController** | [`0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7`](https://etherscan.io/address/0x1d95cC100D6Cd9C7BbDbD7Cb328d99b3D6037fF7) | First-loss buffer for liUSD holders. `LossesApplied` = protocol taking damage. Auto-pauses if losses exceed `maxLossPercentage` threshold. |
| **siUSD** | [`0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`](https://etherscan.io/address/0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB) | `VaultLoss` = losses exceeded liUSD first-loss buffer, now hitting siUSD stakers |
| **UnwindingModule** | [`0x7092A43aE5407666C78dBEa657a1891f42b3dFcc`](https://etherscan.io/address/0x7092A43aE5407666C78dBEa657a1891f42b3dFcc) | Handles forced liquidation of illiquid positions (e.g. Pendle fixed-term). `CriticalLoss` = losses during unwinding exceed module balance. |

Note: Contracts whose state changes only via timelocks (InfiniFiCore, Gateway, FarmRegistry, Accounting, MintController, RedeemController, YieldSharingV2, MinorRolesManager, JCurveSmoother, etc.) do not need separate monitoring — all their changes appear as `CallScheduled`/`CallExecuted` on the timelocks.

### Governance Monitoring (Timelocks + Multisig)

All timelocked actions (GOVERNOR, PROTOCOL_PARAMETERS, ORACLE_MANAGER) are captured by monitoring the timelock events. No need to separately monitor downstream contract events that can only be triggered via timelocks.

| Contract | Event | Significance |
|----------|-------|-------------|
| **Long/Short Timelock** | `CallScheduled(bytes32 id, uint256 index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)` | New governance action proposed — decode `data` to understand what will change. Early warning window (7d or 1d). |
| **Long/Short Timelock** | `CallExecuted(bytes32 id, uint256 index, address target, uint256 value, bytes data)` | Governance action executed — verify expected outcome |
| **Long/Short Timelock** | `Cancelled(bytes32 id)` | Scheduled action cancelled — may indicate contested governance |
| **Long/Short Timelock** | `MinDelayChange(uint256 oldDuration, uint256 newDuration)` | Timelock delay changed — reduction is critical |

### Non-Timelocked Events — Immediate Alert

These events bypass the timelock and can be triggered directly by the multisig or individual role holders.

| Contract | Event | Triggered By | Significance |
|----------|-------|-------------|-------------|
| **Any CoreControlled** | `Paused(address account)` | 4 individual PAUSE EOAs | Emergency pause — no multisig or timelock required |
| **Any CoreControlled** | `Unpaused(address account)` | Multisig (UNPAUSE, no timelock) | System resumed |
| **EmergencyWithdrawal** | `EmergencyWithdraw(uint256 timestamp, address farm, uint256 amount)` | Multisig (no timelock) | Emergency fund extraction from farm |

### Protocol Health Events — Immediate Alert

Autonomous events triggered by protocol state, not governance actions.

| Contract | Event | Significance |
|----------|-------|-------------|
| **ORACLE_IUSD** | `PriceSet(uint256 timestamp, uint256 price)` | iUSD price changed — price below 1.0 = de-peg (loss socialization to iUSD holders) |
| **LockingController** | `LossesApplied(uint256 timestamp, uint256 amount)` | First-loss tranche consuming — liUSD holders taking losses |
| **siUSD** | `VaultLoss(uint256 timestamp, uint256 epoch, uint256 assets)` | Losses cascading past first-loss tranche to siUSD holders |
| **UnwindingModule** | `CriticalLoss(uint256 timestamp, uint256 amount)` | Losses during forced liquidation of illiquid positions exceed module balance |

### Key State to Poll

- **TVL**: Monitor total protocol TVL via liquid + illiquid farm balances
- **Liquid Reserve Ratio**: Liquid reserves vs total TVL

## Risk Summary

### Key Strengths

- Strong risk segmentation design with liability ladder (liUSD first-loss → siUSD → iUSD)
- Comprehensive audit coverage: Spearbit/Cantina Code main review + 6 ongoing upgrade reviews + Certora formal verification + public competition
- Robust governance: 4/7 multisig + dual timelock (7d/1d) + separation of powers. DEFAULT_ADMIN renounced. emergencyAction bypass prevented via no-op override in Timelock.
- All contracts verified on-chain, all farms properly target expected DeFi protocols
- Backed by reputable investors (Electric Capital, Sam Kazemian)

### Key Risks

- Short operational history (<1 year in production since June 2025)
- Compounded smart contract risk from underlying strategies (Aave, Fluid, Pendle, Ethena, Maple)
- Pseudonymous team with notable history concerns: key contributor (RobAnon) authored Revest Finance contracts exploited for $2M; lead dev's prior projects (Fei, ECG) have wound down
- 79% of assets in illiquid strategies — a mass redemption exceeding $37.78M liquid reserves would trigger a queue
- Multisig has significant non-timelocked powers (EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE)
- No disclosed legal entity or incident response plan
- Certora formal verification report published but finding severity breakdown not available on the landing page (full PDF required for detailed review)

### Critical Risks

- None identified that would trigger automatic score of 5. All contracts verified, reserves on-chain, multisig governance with timelocks in place.

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** — PASSED. Multiple audits by reputable firms (Spearbit, Certora, Cantina).
- [x] **Unverifiable reserves** — PASSED. All reserves verifiable on-chain.
- [x] **Total centralization** — PASSED. 4/7 multisig with dual timelocks, DEFAULT_ADMIN renounced.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: Strong coverage — Spearbit/Cantina Code main review (8H/6M/25L), Certora formal verification ([report](https://www.certora.com/reports/infinifi-protocol-formal-verification-report)), Cantina public competition, 6+ upgrade reviews.
- **History**: <1 year in production (Launch June 2025). TVL >$100M.
- **Bounty**: [Active on Cantina](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591).

**Score: 2.5/5** — Extensive audit coverage including ongoing upgrade reviews and formal verification, offset by short production history (<1 year).

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 2.5**
- 4/7 multisig (Gnosis Safe v1.4.1) with dual timelocks (7d for critical, 1d for routine)
- Separation of powers design (Allocators/Verifiers/Vetoers)
- DEFAULT_ADMIN renounced on both timelocks and Core
- However: multisig signers are all anonymous EOAs; multisig has significant non-timelocked powers (EMERGENCY_WITHDRAWAL, MANUAL_REBALANCER, UNPAUSE)

**Subcategory B: Programmability — 3.0**
- Hybrid model: algorithmic Self-Laddering Engine + active Allocator management
- Oracle-dependent for pricing (Chainlink feeds, upgradeable via Short Timelock)
- emergencyAction safely disabled on timelocks

**Subcategory C: Dependencies — 3.5**
- Heavily dependent on 4+ external protocols (Aave, Fluid, Pendle, Ethena)
- Dependent on USDC, USDT, USDe, sUSDe pegs
- Failure in any underlying would cause losses (absorbed by liability ladder)

**Score: 3.0/5** — (2.5 + 3.0 + 3.5) / 3 = 3.0. Solid governance architecture offset by anonymous signers, significant non-timelocked powers, and heavy external dependencies.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 2.0**
- 100% on-chain DeFi assets. No off-chain or custodial holdings (except Maple credit risk).
- First-loss tranches (liUSD → siUSD) protect iUSD holders.
- All farm contracts verified and targeting expected DeFi protocols.

**Subcategory B: Provability — 2.0**
- All reserves verifiable on-chain via farm contracts.
- Exchange rate (siUSD) computed programmatically via ERC4626 standard.
- YieldSharing and Accounting contracts handle on-chain yield calculation.

**Score: 2.0/5** — (2.0 + 2.0) / 2 = 2.0. Funds are transparent and verifiable on-chain.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit**: Instant 1:1 redemption for iUSD against liquid reserves ($37.78M).
- **Depth**: Liquid reserves ($37.78M) > circulating unstaked iUSD (24.86M). $3.3M DEX liquidity as secondary exit.
- **Queue**: FIFO queue activates only if liquid reserves depleted.
- **Concern**: 79% of TVL in illiquid strategies. Mass redemption beyond liquid reserves would trigger queue delays.

**Score: 2.0/5** — Strong primary liquidity (reserves > floating supply). Queue mechanism is a mild concern but mitigated by the liability ladder design.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Semi-pseudonymous. Experienced DeFi developers (Fei, Revest, ECG backgrounds). One contributor's prior project (Revest) was hacked for $2M.
- **Funding**: $3M Pre-Seed from reputable VCs.
- **Docs**: Above average technical documentation.
- **Legal**: No disclosed entity or jurisdiction.
- **Incident Response**: No documented plan. Emergency capabilities exist on-chain.

**Score: 2.5/5** — Experienced team with VC backing, but pseudonymous with concerning prior project history, no legal entity, and no incident response plan.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.0 | 30% | 0.90 |
| Funds Management | 2.0 | 30% | 0.60 |
| Liquidity Risk | 2.0 | 15% | 0.30 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **2.425** |

**Final Score: 2.4**

### Risk Tier: Low/Medium Risk

InfiniFi is a stablecoin model with a strong focus on risk segmentation (liUSD absorbing first losses). The main risks are from its short operational history (<1 year) so not yet really battle tested, the compounded smart contract risk of its underlying strategies (Pendle, Ethena, etc.), and significant non-timelocked powers held by the anonymous multisig (emergency withdrawal, rebalancing).

---

## Reassessment Triggers

- **Time-based**: Reassess in 6 months (August 2026) — protocol will have >1 year history
- **TVL-based**: Reassess if TVL changes by more than 50%
- **Incident-based**: Reassess after any exploit, governance change, collateral modification, or signer change on the multisig
- **Certora findings**: Reassess Audits score once full Certora PDF is reviewed for detailed finding severities
