# Protocol Risk Assessment: StakedHYPE

- **Assessment Date:** May 19, 2026
- **Token:** stHYPE
- **Chain:** HyperEVM (Hyperliquid L1 ecosystem)
- **Token Address:** [`0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1`](https://hyperevmscan.io/address/0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1)
- **Final Score: 2.86/5.0**

> **Reassessment note (May 19, 2026):** Governance posture improved materially since the Feb 2026 assessment — multisig moved from 3-of-5 to **4-of-6** (2026-04-07), and a **48-hour OpenZeppelin TimelockController** ([`0xc5DEd4F7F53919c714059a17d31371aE847E23D2`](https://hyperevmscan.io/address/0xc5DEd4F7F53919c714059a17d31371aE847E23D2)) was inserted between the Safe and all three ProxyAdmin contracts (2026-04-10). The `setSelfDisableTransfer()` admin function was removed in the same upgrade window. Two new audits added (Guardian Jan 2026, Obsidian Apr 2026). Offsetting risks: OverseerV1 liquid HYPE reserve dropped from 261,729 HYPE to **5,127 HYPE** (0.15% of backing) with no docs-disclosed buffer relocation; Morpho wstHYPE collateral collapsed from ~$44M to ~$4M (~$65M total wstHYPE lending exposure remains, with HyperLend now dominant at $56.9M).

## Overview + Links

StakedHYPE issues `stHYPE`, a liquid staking token representing HYPE staked into Hyperliquid validators through Hyperliquid Stake Marketplace (HSM). Conceptually it is similar to stETH: users deposit native HYPE, receive an LST (`stHYPE`), and accumulate staking rewards in token exchange rate terms.

StakedHYPE was originally built by **Thunderhead Labs**, a multi-LST provider (stFLIP, stELX, stMOVE, tPOKT, stHYPE) with shared modular infrastructure across products. In August 2025, stHYPE was **acquired by Valantis Labs**, which now maintains the protocol. The codebase benefits from components battle-tested across multiple Thunderhead LST deployments.

The architecture has two layers:

1. **LST layer (StakedHYPE)**
- User-facing mint/redeem flow for stHYPE.
- Maintains a withdrawal queue and reserve buffer.

2. **Validator staking layer (HSM)**
- HYPE is delegated into Hyperliquid validators via HSM infra.
- Uses HSM voting and delegation controls to distribute stake and manage exits.

**Links:**

- [StakedHYPE docs](https://docs.stakedhype.fi/)
- [HSM technical page](https://docs.stakedhype.fi/technical/hyperliquid-stake-marketplace-hsm)
- [Stake Accounts & Architecture](https://docs.stakedhype.fi/technical/stake-accounts)
- [stHYPE Integration (mint/burn/unstaking)](https://docs.stakedhype.fi/technical/integrate)
- [Transparency & Risks](https://docs.stakedhype.fi/info/transparency-and-risks)
- [Contract Addresses](https://docs.stakedhype.fi/technical/contract-addresses)
- [Audits](https://docs.stakedhype.fi/technical/audits)
- [StakedHYPE security page](https://docs.stakedhype.fi/technical/security)
- [StakedHYPE governance page](https://docs.stakedhype.fi/governance)
- [Hyperliquid staking docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking)
- [Hyperliquid validator docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking)

## Contract Addresses

All contracts are deployed on HyperEVM (Hyperliquid L1). Explorer: [HyperEVMScan](https://hyperevmscan.io).

| Contract | Address | Type |
|----------|---------|------|
| stHYPE | [`0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1`](https://hyperevmscan.io/address/0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1) | Proxy (ERC-20 LST) |
| stHYPE Impl | [`0xe71caf5c1fe56d8897c7b604295d23968049e057`](https://hyperevmscan.io/address/0xe71caf5c1fe56d8897c7b604295d23968049e057) | Implementation (upgraded since Feb 2026) |
| stHYPE ProxyAdmin | [`0xe7b0f26e8e20e109441f0ad1c885fffbb27125dc`](https://hyperevmscan.io/address/0xe7b0f26e8e20e109441f0ad1c885fffbb27125dc) | EIP-1967 Admin |
| OverseerV1 | [`0xB96f07367e69e86d6e9C3F29215885104813eeAE`](https://hyperevmscan.io/address/0xB96f07367e69e86d6e9C3F29215885104813eeAE) | Proxy (mint/burn controller) |
| OverseerV1 Impl | [`0xac43e7a1467bf6a4db24bf1f121fb59be6c9f831`](https://hyperevmscan.io/address/0xac43e7a1467bf6a4db24bf1f121fb59be6c9f831) | Implementation (upgraded since Feb 2026) |
| OverseerV1 ProxyAdmin | [`0x943a7e81373423f7bb0fb6a3e55553638264fd6b`](https://hyperevmscan.io/address/0x943a7e81373423f7bb0fb6a3e55553638264fd6b) | EIP-1967 Admin |
| wstHYPE | [`0x94e8396e0869c9F2200760aF0621aFd240E1CF38`](https://hyperevmscan.io/address/0x94e8396e0869c9F2200760aF0621aFd240E1CF38) | Proxy (wrapped shares) |
| wstHYPE Impl | [`0x104324863cfb2220756c60384efa9bb67a57aaf7`](https://hyperevmscan.io/address/0x104324863cfb2220756c60384efa9bb67a57aaf7) | Implementation (upgraded since Feb 2026) |
| wstHYPE ProxyAdmin | [`0xa29a2043b2fcbc9189beb9e6efcb2ba48bb3d586`](https://hyperevmscan.io/address/0xa29a2043b2fcbc9189beb9e6efcb2ba48bb3d586) | EIP-1967 Admin |
| TimelockController (upgrades) | [`0xc5DEd4F7F53919c714059a17d31371aE847E23D2`](https://hyperevmscan.io/address/0xc5DEd4F7F53919c714059a17d31371aE847E23D2) | OZ TimelockController, 48h min delay (added 2026-04-10) |
| Governance Multisig | [`0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9`](https://hyperevmscan.io/address/0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9) | Gnosis Safe (**4-of-6**, raised from 3-of-5 on 2026-04-07) |
| stHYPE/WHYPE AMM Withdrawal Module | [`0x69e487aa3132708d08a979b2d07c5119bb77f698`](https://hyperevmscan.io/address/0x69e487aa3132708d08a979b2d07c5119bb77f698) | Services AMM-pool unstakes (dominant net-receiver of Overseer HYPE Feb–May 2026) |
| HyperCore Staking Module #1 | [`0x591540F231055743A37F691C3ffd50E4E53561ab`](https://hyperevmscan.io/address/0x591540F231055743A37F691C3ffd50E4E53561ab) | Validator delegation module |
| HyperCore Staking Module #2 | [`0x16a4814e8eB502C56CeBd73F9c8aC7FDee29c042`](https://hyperevmscan.io/address/0x16a4814e8eB502C56CeBd73F9c8aC7FDee29c042) | Validator delegation module |
| HyperCore Staking Module #3 | [`0xf992aa323ec183733213f874b6322b8bd1aAD625`](https://hyperevmscan.io/address/0xf992aa323ec183733213f874b6322b8bd1aAD625) | Validator delegation module |
| HyperCore Staking Module #4 | [`0x06b5659f16110319137220D1EFd680053F5e72a2`](https://hyperevmscan.io/address/0x06b5659f16110319137220D1EFd680053F5e72a2) | Validator delegation module |
| HyperCore Staking Module #5 | [`0xe787dD1347A29e6807D164C4FA43105b64048556`](https://hyperevmscan.io/address/0xe787dD1347A29e6807D164C4FA43105b64048556) | Validator delegation module |
| HyENA HIP-3 / USDe Quote Asset | [`0xa5101b03675294c87ab7381b41d4225eb8709128`](https://hyperevmscan.io/address/0xa5101b03675294c87ab7381b41d4225eb8709128) | HIP-3 stake module |
| HyENA HIP-3 Deployer | [`0x358e783c32147b344a1168e0984d3350de4e07cb`](https://hyperevmscan.io/address/0x358e783c32147b344a1168e0984d3350de4e07cb) | HIP-3 delegation/quote-asset deployer |
| MANAGER role | [`0x53D6c6594d14f9bBDFC572f048312728F7B2418e`](https://hyperevmscan.io/address/0x53D6c6594d14f9bBDFC572f048312728F7B2418e) | Operational manager (per Roles & Controls registry) |
| REBASER role | [`0x4eb038eb501045daa520b972fcad48c429531e10`](https://hyperevmscan.io/address/0x4eb038eb501045daa520b972fcad48c429531e10) | Rebase/exchange-rate trigger (per Roles & Controls registry) |
| FEE_RECIPIENT | [`0xa2666b4dd1242def4c3cf5731a85aa8457fe01c1`](https://hyperevmscan.io/address/0xa2666b4dd1242def4c3cf5731a85aa8457fe01c1) | Protocol fee destination |

All contracts are **upgradeable** via EIP-1967 transparent proxy pattern. Each proxy has a separate ProxyAdmin contract. Since the 2026-04-10 governance upgrade, **all three ProxyAdmin contracts are owned by the TimelockController** (`0xc5DEd4F7...`, verified via `owner()` on each ProxyAdmin). The TimelockController has a **48-hour minimum delay** (`getMinDelay()` returns 172,800 seconds) and the Safe multisig holds `PROPOSER_ROLE`, `EXECUTOR_ROLE`, and `CANCELLER_ROLE` on it (the zero address does NOT hold `EXECUTOR_ROLE`, so execution is multisig-restricted, not open). The TimelockController is self-administered (`DEFAULT_ADMIN_ROLE` held by the timelock itself). Net effect: **implementation upgrades now require a 48-hour delay between Safe proposal and execution.** Role changes and other `DEFAULT_ADMIN_ROLE`-gated actions on stHYPE/OverseerV1 are NOT timelocked — the Safe holds those roles directly.

Source: [docs.valantis.xyz/stakedhype/contract-addresses](https://docs.valantis.xyz/stakedhype/contract-addresses), [docs.valantis.xyz/stakedhype/roles-and-controls-registry](https://docs.valantis.xyz/stakedhype/roles-and-controls-registry), and onchain verification via `cast` against `https://rpc.hyperliquid.xyz/evm` (EIP-1967 admin/implementation slots, `getMinDelay()`, `hasRole()`).

## How Hyperliquid Staking Works (Context)

Hyperliquid’s staking model is validator-based and epoch-driven.

- Users stake HYPE and delegate to validators.
- Rewards accrue through validator performance and protocol emissions/fees.
- Validator set and stake movement are constrained by protocol rules (epoch timing and activation/deactivation semantics).
- Hyperliquid docs describe validator/L1 operational risks; this is the core external risk inherited by any HYPE liquid staking protocol.

### Slashing in Hyperliquid (Important for stHYPE)

As of **May 19, 2026**, Hyperliquid docs continue to state that core HYPE staking has:

- **No automatic validator slashing mechanism** in live staking (unchanged since Feb 2026).
- **Jailing** as the immediate validator penalty path for uptime/behavior issues.
- A note that governance may introduce explicit validator slashing in the future.

Practical interpretation for stHYPE:
- **Today:** direct stake haircut from automatic validator slashing is low-probability because that mechanism is not yet active in base staking.
- **Still material risk:** validator jailing, poor validator performance, or chain-level instability can still reduce effective yield and delay exits.
- **Future risk step-up:** if governance enables validator slashing later, stHYPE loss profile can change meaningfully and requires immediate reassessment.

Historical status:
- No official Hyperliquid documentation found describing a past **validator slashing event** in HYPE staking as of May 19, 2026.
- The only notable validator-level intervention episode in the period remains the JELLY market manipulation (March 2025), which did not involve stake slashing.
- This is an inference from official docs and release/risk pages; absence of a documented event is not proof of impossibility.

For stHYPE specifically, staking operations route through HSM abstractions and StakedHYPE’s queue/buffer logic, which adds additional smart-contract and operational layers on top of base protocol staking.

## Audits and Due Diligence Disclosures

StakedHYPE publicly lists **6 audits** on its audits page and the [Valantis audits repo](https://github.com/ValantisLabs/audits):

| # | Date | Firm | Scope | Link |
|---|---|---|---|---|
| 1 | Feb 2025 | Three Sigma | StakedHYPE contracts | [Report](https://github.com/ValantisLabs/audits/blob/main/Three_Sigma_Feb_25.pdf) |
| 2 | Oct 2025 | Pashov Audit Group | StakedHYPE contracts | [Report](https://github.com/ValantisLabs/audits/blob/main/pashov_oct_25.pdf) |
| 3 | Nov 2025 | Pashov Audit Group | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/pashov_nov_2025.pdf) |
| 4 | Nov 2025 | Guardian Audits | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/guardian_nov_2025.pdf) |
| 5 | Jan 2026 | Guardian Audits | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/guardian_jan_2026.pdf) |
| 6 | Apr 2026 | Obsidian | StakedHYPE updates | [Report](https://github.com/ValantisLabs/audits/blob/main/obsidian_april_2026.pdf) |

In addition to formal audits, the Valantis audits repo now publishes monthly **Health Reports** (Mar 1 2026, Apr 1 2026) providing ongoing engineering disclosure cadence.

StakedHYPE was originally built by **Thunderhead Labs** (multi-LST provider: stFLIP, stELX, stMOVE, tPOKT) and acquired by **Valantis Labs** in August 2025. Cross-LST audits with shared modular components are available in the [Thunderhead audits repo](https://github.com/thunderhead-labs/audits). The Three Sigma audit is mirrored in both repos (identical SHA: `4c39b756`).

The governance system is based on a modified [FraxGovernorOmega](https://github.com/trailofbits/publications/blob/master/reviews/2023-05-fraxgov-securityreview.pdf) (audited by Trail of Bits), but is **still not implemented** as of May 19, 2026. The [Valantis upgrade-and-risk-governance docs](https://docs.valantis.xyz/stakedhype/upgrade-and-risk-governance) describe a planned migration to Valantis Governance + Lido-style **Dual-Governance veto** for stHYPE holders — roadmap only, not live.

Additional disclosures:
- HSM docs state code and technical docs are expected to be published in GitHub once finalized, indicating parts of stack/process may still be maturing.
- No public formal verification disclosure was identified.

### Bug Bounty

No Immunefi/Sherlock/Cantina bug bounty program identified. The [Valantis transparency-and-risks docs](https://docs.valantis.xyz/stakedhype/transparency-and-risks) **explicitly state** the protocol does NOT run an active public bug bounty program as of May 2026 (regression noted relative to peer LSTs).

Disclosed security contacts:
- Email: audit@valantis.xyz (per [security page](https://docs.stakedhype.fi/technical/security))
- Discord: [StakedHYPE Discord](https://t.co/zZB5aEVqCh)
- Twitter: [@ValantisLabs](https://twitter.com/ValantisLabs)

Assessment note:
- Responsible disclosure channel exists, but absence of a public bounty with payout tiers weakens external adversarial testing incentives relative to peers. The explicit "no bug bounty" disclosure (rather than an oversight) increases concern.

## Historical Track Record

- StakedHYPE documentation indicates active production operation with stHYPE issuance and unstaking mechanisms live.
- Listed on [DeFiLlama](https://defillama.com/protocol/sthype) since February 2025 (~15 months at assessment date; first user-facing TVL July 2025).
- **Current TVL**: ~$158.6M (May 19, 2026, per DeFiLlama) — **+28% vs Feb 2026 reassessment** ($124M).
- **Peak TVL**: ~$544.5M (July 14, 2025).
- **TVL trend**: Recovered from Feb 2026 trough; currently at ~29% of ATH. Movement consistent with broader market conditions and HYPE price action.
- No major publicly disclosed exploit on stHYPE / Valantis Labs / Thunderhead Labs identified. Not listed on [Rekt News](https://rekt.news/) or [DeFiLlama Hacks](https://defillama.com/hacks).
- **Adjacent incident (not stHYPE-caused)**: Purrlend exploit on April 25, 2026 (~$1.5M) drained mixed collateral including wstHYPE, kHYPE, WHYPE, and stablecoins. Root cause was Purrlend-side, not StakedHYPE — included here for awareness of HyperEVM lending-stack fragility around wstHYPE collateral.
- Track record materially shorter and less battle-tested than older LSTs like stETH (~15 months vs 3+ years), but matures further with each clean quarter.

## Funds Management

### Strategy and delegation model

stHYPE deposits are managed via HSM-integrated staking operations:

- User deposits -> mint stHYPE.
- Capital is distributed across validator/delegation pathways using HSM.
- A reserve buffer is kept to improve withdrawal responsiveness.
- Redemptions rely on reserve and, when needed, unstake/rebalance processes.

### Accessibility

- stHYPE minting is permissionless at user level through protocol interface.
- Unstaking uses a queue-based process and does not guarantee instant 1:1 native withdrawal.
- Queue and buffer mechanics are key liquidity controls and must be actively monitored.

### Collateralization

Onchain state (verified May 19, 2026 via `cast` against `https://rpc.hyperliquid.xyz/evm`, HyperEVM block 35,538,934):
- **stHYPE totalSupply**: 3,331,041.01 stHYPE (Feb 2026: 4,252,373.17 — **-21.7%**)
- **Exchange rate** (`balancePerShare`): 1.026262 HYPE per stHYPE (Feb 2026: 1.0203 — **+0.59%** in 90 days ≈ 2.4% annualised, in line with HyperEVM staking yield)
- **Total HYPE backing** (`totalSupply × exchangeRate`): ~3,418,520 HYPE
- **OverseerV1 native HYPE balance**: **5,124.82 HYPE** (0.15% of backing) — Feb 2026: 261,728.59 HYPE (6.0%). The drop is NOT a buffer relocation to a new contract; it reflects **normal withdrawal-servicing flow**. Onchain trace (Etherscan V2 API, chain 999, Feb 1 – May 19 2026): the dominant net-receiver of HYPE from Overseer is the documented **stHYPE/WHYPE AMM Withdrawal Module** [`0x69e487aa…f698`](https://hyperevmscan.io/address/0x69e487aa3132708d08a979b2d07c5119bb77f698) (~1.0M HYPE net out). The five HyperCore Staking Modules are net senders **back** to Overseer (~-1.32M combined), consistent with returning unstaked HYPE to fulfill withdrawals. No single >100k tx caused the drop — dozens of normal-sized transfers. Four large net-receiving EOAs (`0xbda2…`, `0xcdb4…`, `0x183d…`, `0x98265…`) totaling ~644K HYPE are not labeled in the published Roles & Controls Registry — **TODO**: confirm with Valantis whether these are operator/keeper hot wallets or end-user withdrawals.
- **maxRedeemable** (OverseerV1): 0 HYPE — no instant redemption buffer available at time of check; all burns go through the unstaking queue (Feb 2026: also 0).
- **burnCount**: 42,180 total burns processed (+3,067 vs Feb 2026, +7.8%).

Economic backing is staked HYPE plus liquid reserves. The remaining ~99.85% of HYPE is staked across validators via HyperCore Staking Modules.
- Backing quality is primarily dependent on Hyperliquid validator set quality and slashing/operational outcomes.
- This is not offchain custodial collateral; risk is onchain protocol + validator behavior.

### Provability

- Core staking and token accounting are onchain by design.
- Key onchain readable functions verified: `totalSupply()`, `balancePerShare()`, `totalShares()`, `maxRedeemable()`, `burnCount()`, `getBurns(address)`, `redeemable(uint256)`.
- Exchange rate (`balancePerShare`) is programmatically updated onchain — not reliant on admin oracle updates.
- Contracts use OpenZeppelin AccessControl with MINTER_ROLE, BURNER_ROLE, PAUSER_ROLE, DEFAULT_ADMIN_ROLE. Verified via `hasRole(bytes32,address)` on May 19 2026:
  - **stHYPE.DEFAULT_ADMIN_ROLE** → governance multisig `0x97dee0ea...` (true), TimelockController (false), OverseerV1 (false)
  - **stHYPE.MINTER_ROLE** → OverseerV1 (true), multisig (false)
  - **stHYPE.BURNER_ROLE** → OverseerV1 (true), multisig (false)
  - **stHYPE.PAUSER_ROLE** → not held by multisig, OverseerV1, TimelockController, or any of the 6 individual Safe signers (holder unverified — stHYPE contracts are AccessControl, not AccessControlEnumerable, so role-member enumeration reverts; off-multisig pauser delegate possible but not located this session)
  - **OverseerV1.DEFAULT_ADMIN_ROLE** → multisig (true), TimelockController (false), OverseerV1 (false)
  - **OverseerV1.PAUSER_ROLE** → not held by multisig, TimelockController, or OverseerV1
- **ProxyAdmin ownership** (all 3 verified via `owner()`): now held by TimelockController `0xc5DEd4F7F53919c714059a17d31371aE847E23D2`, NOT directly by the multisig (governance improvement vs Feb 2026).
- **TimelockController self-administered**: `hasRole(DEFAULT_ADMIN_ROLE, timelock)` returns true; multisig holds `PROPOSER_ROLE` / `EXECUTOR_ROLE` / `CANCELLER_ROLE`. `EXECUTOR_ROLE` is NOT granted to the zero address (execution is multisig-restricted, not open).
- **Transparency gaps remain in several areas:**
  - **Validator delegation breakdown**: No public dashboard or onchain mechanism shows per-validator stake distribution. The [operators page](https://docs.stakedhype.fi/governance/operators) lists operator names (ASXN, B-harvest, HypurrCO, etc.) but publishes no addresses, delegation amounts, or performance metrics.
  - **Queue monitoring**: The only user-facing tool is an estimated withdrawal time at `app.valantis.xyz/staking` ([stake accounts docs](https://docs.stakedhype.fi/technical/stake-accounts)). No real-time queue depth, position, or reserve utilization data is published.
  - **HSM still not deployed**: The HSM docs page returns 404 as of May 2026 (was a design document in Feb 2026). The Hyperliquid Stake Marketplace remains unshipped per public documentation; no HIP-3 deployers cited as using HSM.
  - **Offchain operational components**: Reserve management relies on *"active liquidity management from the Protocol Delegator"* and *"coordination with custodians / HIP-3 operators"* ([stake accounts docs](https://docs.stakedhype.fi/technical/stake-accounts)) — offchain processes with no onchain enforcement or public monitoring.
  - **Buffer/reserve flow now clearer (Feb→May 2026)**: OverseerV1's native HYPE balance fell from 261,729 to 5,125. Onchain trace confirms this is normal withdrawal-servicing — dominant sink is the documented stHYPE/WHYPE AMM Withdrawal Module ([`0x69e487aa…f698`](https://hyperevmscan.io/address/0x69e487aa3132708d08a979b2d07c5119bb77f698)). Four large undocumented EOA receivers (~644K HYPE combined) remain a TODO for operator-wallet labeling. No standalone "buffer contract" is published in docs — Overseer itself appears to be the buffer, replenished by staking-module returns rather than maintained as a static float.
  - **1:1 backing unverifiable end-to-end**: The [transparency page](https://docs.stakedhype.fi/info/transparency-and-risks) claims *"stHYPE is always backed 1:1 by native HYPE"*, but no independent verification tool is provided. Users can verify EVM-side state (`totalSupply`, `balancePerShare`) but cannot independently audit the full HyperCore validator delegation breakdown.

## Liquidity Risk

stHYPE exit risk is higher than a pure wrapper token:

- There is an unstaking queue design (not instant native redemption in all conditions).
- Docs disclose a reserve buffer with a [`maxRedeemable()`](https://docs.stakedhype.fi/technical/integrate) function for instant redemptions, a Managed Liquidity Buffer (1M HYPE early-exit threshold, 300k HYPE buffer), and up to a 90-day wind-down horizon for specialized stake accounts in extreme stress conditions.

### DEX Liquidity (per DeFiLlama yields/pools, May 19, 2026)

**stHYPE liquidity expanded materially since Feb 2026, driven primarily by Pendle.**

**stHYPE pools (~$6.26M total, was ~$380K):**

| Venue | Pair | TVL |
|-------|------|-----|
| Pendle | stHYPE (market 1) | ~$2.71M |
| Pendle | stHYPE (market 2) | ~$2.71M |
| Pendle | stHYPE AMM LP (market 1) | ~$364K |
| Pendle | stHYPE AMM LP (market 2) | ~$364K |
| HyperSwap V3 | WHYPE-stHYPE | ~$116K (combined across pools) |

**wstHYPE pools (~$690K total, was ~$138K):**

| DEX | Pair | TVL |
|-----|------|-----|
| Nest V1 | WHYPE-WSTHYPE | $614K |
| Project X | WSTHYPE-KHYPE | $44.8K |
| Project X | WHYPE-WSTHYPE | $30.5K |

**No wstHYPE/USDC or wstHYPE/USDT pairs exist anywhere on HyperEVM** — there is still no direct stablecoin exit path via DEX for either token. Pendle markets meaningfully improve stHYPE-side exit depth but route to HYPE/WHYPE rather than stables.

### wstHYPE as Lending Collateral

Lending protocols accept **wstHYPE (wrapped stHYPE)**, not native stHYPE, as collateral for borrowing. This is the primary use case for staked HYPE derivatives and the key risk vector, since liquidation of undercollateralized positions depends on available onchain liquidity.

Lending exposure shifted significantly since Feb 2026: Morpho wstHYPE collateral collapsed (~$44M → ~$4M) while HyperLend nearly doubled (~$30M → ~$57M). New lenders Euler v2 and HypurrFi have appeared.

| Protocol | Type | wstHYPE Collateral (May 19, 2026) | wstHYPE Collateral (Feb 18, 2026) |
|----------|------|-----------------------------------|-----------------------------------|
| HyperLend (Pooled) | Pooled lending | **$56.9M** | $30.1M |
| Morpho Blue (5 markets) | Isolated markets | **$4.05M** | $44.0M |
| HypurrFi (Pooled) | Pooled lending | **$2.87M** | — (new) |
| Felix CDP | CDP | **$1.08M** | $1.9M |
| Euler v2 | Isolated/pooled | **$312K** | — (new) |
| **Total** | | **~$65.2M** | $76.0M |

Source: DeFiLlama pools API (`https://yields.llama.fi/pools`), queried 2026-05-19.

~$65M of wstHYPE remains used as lending collateral (the bulk of stHYPE supply is wrapped). The migration toward HyperLend pooled lending concentrates more wstHYPE exposure in a single Aave-fork pool, which is a structural shift in counterparty/exit risk relative to Morpho's per-market isolation.

### Liquidation Risk

**wstHYPE onchain liquidation remains structurally fragile**, despite incremental DEX-liquidity improvement. ~$65M of wstHYPE is used as borrowing collateral, but total wstHYPE DEX liquidity is only ~$690K with zero stablecoin pairs. When a borrower's position becomes undercollateralized, liquidators still face systemic obstacles:

1. **No stablecoin exit**: No wstHYPE/USDC or wstHYPE/USDT pools exist. Liquidators must route through HYPE derivatives (wstHYPE → WHYPE → USDC), adding hops and slippage. HyperLend's pooled model means borrowers can borrow any pool asset (including stablecoins) against wstHYPE.
2. **Thin DEX depth**: $690K total wstHYPE liquidity (up from $138K in Feb) is still ~95x smaller than collateral. The largest single wstHYPE pool (Nest V1 WHYPE-WSTHYPE, $614K) cannot absorb liquidations from $65M in collateral.
3. **Unwrap delay**: Converting wstHYPE → stHYPE is instant at the contract level, but stHYPE → HYPE requires the 7-day unstaking queue (up to 90 days under stress). Liquidators cannot quickly realize value.
4. **Correlated stress**: In a HYPE price drawdown, both the collateral value (wstHYPE) and exit liquidity (WHYPE pools) decline simultaneously, creating a liquidation spiral risk where falling prices trigger liquidations that cannot be efficiently executed.
5. **Concentration shift to HyperLend**: $56.9M (87% of wstHYPE collateral) is now in a single pooled Aave-fork. Liquidation infra quality and oracle robustness on HyperLend are the dominant counterparty risk.
6. **Adjacent HyperEVM lending precedent**: The April 25, 2026 Purrlend exploit (~$1.5M) drained mixed HyperEVM collateral including wstHYPE, kHYPE, and WHYPE. Root cause was lender-side, not StakedHYPE — but it demonstrates that HyperEVM lending venues holding wstHYPE are not yet battle-tested.

This creates a structural fragility: ~$65M of wstHYPE borrowing collateral against ~$690K of DEX exit liquidity — a **~94:1 collateral-to-liquidity ratio** (improved from ~550:1 in Feb but still extreme).

### Practical Implications

- In normal conditions, the protocol's unstaking queue (7-day) remains the primary exit path.
- **Secondary market exit is improving but still constrained**: Pendle markets add meaningful stHYPE depth (~$6M), but spot DEX pools remain thin and wstHYPE→stable still requires multi-hop routing through HYPE. Any meaningful position must still rely primarily on protocol unstaking.
- In stress conditions, exits can be delayed up to 90 days (specialized stake account wind-down) and/or become market-impact sensitive.
- **Lending market liquidations remain the primary systemic risk vector** due to the collateral-to-liquidity mismatch above; concentration in HyperLend pooled lending heightens single-venue dependency.

## Centralization & Control Risks

### Governance

StakedHYPE docs describe a planned dual-governance model based on a modified [FraxGovernorOmega](https://github.com/trailofbits/publications/blob/master/reviews/2023-05-fraxgov-securityreview.pdf), and the [Valantis upgrade-and-risk-governance docs](https://docs.valantis.xyz/stakedhype/upgrade-and-risk-governance) describe a planned migration to Valantis Governance + Lido-style **Dual-Governance veto** for stHYPE holders:
- **Legislative branch**: Multisig composed of Thunderhead team, Valantis team, ecosystem partners, and community members.
- **Executive branch**: stHYPE token holder veto power over governance proposals.

**Current status: NOT YET IMPLEMENTED** as of May 19, 2026. Docs explicitly state *"no protocol-wide on-chain upgrade timelock guarantee"* in the long term, though a 48-hour TimelockController has been added at the proxy-admin layer (see below).

Onchain verified governance data (May 19, 2026, via `cast` against `https://rpc.hyperliquid.xyz/evm`):
- **Multisig address**: [`0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9`](https://hyperevmscan.io/address/0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9) (Gnosis Safe v1.3.0 on HyperEVM)
- **Threshold**: **4-of-6** (verified via `getThreshold()` — raised from 3-of-5 on 2026-04-07)
- **Owners** (verified via `getOwners()`):
  - [`0x4F1Badad95B7A5901b6927d6C4A6761b3e8A00b4`](https://hyperevmscan.io/address/0x4F1Badad95B7A5901b6927d6C4A6761b3e8A00b4)
  - [`0xD78a2374d5459ed44087fcfe5A40105B03CD9D71`](https://hyperevmscan.io/address/0xD78a2374d5459ed44087fcfe5A40105B03CD9D71)
  - [`0x5cd0448cC4AAE28e46BabdB285B9E3B601872378`](https://hyperevmscan.io/address/0x5cd0448cC4AAE28e46BabdB285B9E3B601872378)
  - [`0x10f6160f0033700CB55C478826068DAD4d210465`](https://hyperevmscan.io/address/0x10f6160f0033700CB55C478826068DAD4d210465)
  - [`0x785c7DF2717c119929BC5a3d6c52638D2918aC2C`](https://hyperevmscan.io/address/0x785c7DF2717c119929BC5a3d6c52638D2918aC2C)
  - [`0x4993522ee8091cc7A452Af7a98D5ef4a269f6FC5`](https://hyperevmscan.io/address/0x4993522ee8091cc7A452Af7a98D5ef4a269f6FC5)
- **Nonce**: 43 (was 20 in Feb 2026 — 23 transactions executed in the 90-day window, consistent with active operational use including the 2026-04 governance upgrades)
- **Timelock (NEW since Feb 2026)**: [`0xc5DEd4F7F53919c714059a17d31371aE847E23D2`](https://hyperevmscan.io/address/0xc5DEd4F7F53919c714059a17d31371aE847E23D2) — OpenZeppelin TimelockController, **48-hour minimum delay** (`getMinDelay()` returns 172,800). Inserted between Safe and ProxyAdmin contracts on 2026-04-10. Multisig holds PROPOSER_ROLE, EXECUTOR_ROLE, CANCELLER_ROLE; execution is multisig-restricted (zero address does NOT hold EXECUTOR_ROLE). The timelock is self-administered.
- **Timelock scope**: Protects **implementation upgrades only** (via ProxyAdmin ownership). Does NOT protect `DEFAULT_ADMIN_ROLE` actions on stHYPE/OverseerV1 (role grants, parameter updates), which the multisig can still execute without delay.
- **Other 2026-04-10 changes**: `setSelfDisableTransfer()` admin function removed — DEFAULT_ADMIN can no longer freeze user addresses (reduced admin trust).
- **Signer identities**: Not individually disclosed. Described only as "Thunderhead team, Valantis Team, ecosystem partners."

Risk implications:
- Governance posture **improved materially** since Feb 2026: higher threshold (3-of-5 → 4-of-6), upgrade timelock (48h), and removal of admin transfer-disable.
- However, the planned dual-governance with stHYPE holder veto is still not live.
- The timelock applies **only to implementation upgrades**, not to role/parameter changes — critical to keep monitor coverage on RoleGranted/RoleRevoked events on stHYPE and OverseerV1.

### Programmability

- Hybrid system: smart-contract based staking + operational policy layer for delegation, reserves, and queue management.
- More complex than simple wrappers (WHYPE/WETH).
- Potential sensitivity to offchain operator execution quality and policy correctness.

### External Dependencies

Critical dependencies include:
1. Hyperliquid L1 consensus/liveness.
2. Hyperliquid validator performance and staking/slashing rules.
3. HSM mechanism assumptions and stake-market behavior.
4. DEX liquidity conditions for stHYPE/HYPE exits.

Dependency concentration on Hyperliquid ecosystem is structurally high.

## Operational Risk

- Docs quality is good and technically detailed.
- Security page and audit disclosures are positive. One co-founder found a [$6M white-hat vulnerability in Curve](https://docs.stakedhype.fi/technical/security), demonstrating security expertise.
- Public bounty program absent. Not listed on Immunefi, Sherlock, Code4rena, or Cantina.
- Team operates as "known anons" via Valantis Labs. Key GitHub contributors identified: Ankit Parashar (0xparashar), Ed (happenwah). Twitter: [@ValantisLabs](https://twitter.com/ValantisLabs).
- Thunderhead Labs (original builder) has operational track record across multiple LST deployments (stFLIP, stELX, stMOVE, tPOKT). The Valantis acquisition adds the AMM/DEX expertise of the Valantis team.
- Team/governance transparency is improving but appears earlier-stage than mature LST incumbents.

## Monitoring

Key contracts to monitor:
- stHYPE Proxy: [`0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1`](https://hyperevmscan.io/address/0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1)
- OverseerV1 Proxy: [`0xB96f07367e69e86d6e9C3F29215885104813eeAE`](https://hyperevmscan.io/address/0xB96f07367e69e86d6e9C3F29215885104813eeAE)
- wstHYPE Proxy: [`0x94e8396e0869c9F2200760aF0621aFd240E1CF38`](https://hyperevmscan.io/address/0x94e8396e0869c9F2200760aF0621aFd240E1CF38)
- Governance Multisig: [`0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9`](https://hyperevmscan.io/address/0x97dee0ea4ca10560f260a0f6f45bdc128a1d51f9) (Gnosis Safe 4-of-6)
- TimelockController: [`0xc5DEd4F7F53919c714059a17d31371aE847E23D2`](https://hyperevmscan.io/address/0xc5DEd4F7F53919c714059a17d31371aE847E23D2) (48h min delay, owns all 3 ProxyAdmin contracts)

### 1. Governance Monitoring (MANDATORY)

Monitor all privileged role actions and parameter changes for:
- RoleGranted / RoleRevoked events on stHYPE and OverseerV1 (AccessControl) — these are NOT timelocked
- TimelockController `CallScheduled` / `CallExecuted` / `Cancelled` events (early visibility of proposed upgrades)
- queue limits and withdrawal controls
- reserve/buffer parameters
- delegation strategy controls
- Upgraded events on proxy contracts (implementation changes)

Alert immediately on:
- ownership/multisig signer changes (AddedOwner/RemovedOwner on Safe)
- threshold changes (ChangedThreshold on Safe)
- TimelockController role grants/revokes (especially EXECUTOR_ROLE to zero address = open execution)
- TimelockController `MinDelayChange` events (delay reduction is a downgrade)
- implementation upgrades (Upgraded event on proxy)
- emergency pause activations

### 2. Backing & Solvency Monitoring (MANDATORY)

Track:
- total stHYPE supply
- estimated total managed HYPE (staked + liquid reserve)
- backing ratio trend
- validator concentration and large delegation shifts

Alert thresholds:
- backing ratio deterioration >1% in 24h (without expected event)
- single validator concentration >25%

### 3. Queue & Exit Monitoring (MANDATORY)

Track:
- queue size and age distribution
- realized withdrawal times
- reserve utilization rate

Alert thresholds:
- median queue delay > target SLA for 24h+
- reserve buffer utilization >80% sustained
- abrupt increase in queued exits (>20% day-over-day)

### 4. Market Liquidity Monitoring

Track:
- stHYPE/HYPE and stHYPE/stable pool depth
- slippage for representative sizes
- depeg vs implied fair value

Alert thresholds:
- >2% sustained discount vs implied NAV proxy
- pool depth drop >40% day-over-day

### 5. Hyperliquid Base Risk Monitoring

Track official Hyperliquid staking/validator announcements for:
- validator jailing incidents
- any governance activation of validator slashing
- validator instability
- staking parameter changes
- chain liveness incidents

## Risk Summary

### Key Strengths

1. Clear product-market fit: native HYPE liquid staking primitive; #2 LST on HyperEVM by share.
2. Public audit trail with multiple firms and multiple rounds (now 6 audits, plus monthly Health Reports).
3. **48-hour upgrade timelock added (2026-04-10)** plus multisig threshold raised to 4-of-6 — material governance improvement vs Feb 2026.
4. Removed `setSelfDisableTransfer()` admin function — reduced admin trust surface.
5. Onchain staking economics rather than offchain custodial backing; programmatic exchange rate.

### Key Risks

1. Queue-based exits and stress-path wind-down mechanics introduce liquidity delay risk.
2. Role/parameter changes on stHYPE/OverseerV1 are NOT timelocked (only upgrades are); planned dual-governance veto still not live.
3. OverseerV1 liquid HYPE reserve fell from 6.0% to 0.15% of backing — onchain trace confirms this is normal withdrawal-servicing via the documented stHYPE/WHYPE AMM Withdrawal Module, not a buffer disappearance. Four undocumented EOA receivers (~644K HYPE combined) remain a labeling TODO.
4. wstHYPE lending exposure (~$65M) concentrated in HyperLend pooled lending (~$57M, 87%); single-venue counterparty/liquidation risk.
5. Strong dependency on Hyperliquid validator and chain-level risk.
6. Slashing regime may change via governance (currently no automatic validator slashing in base staking).
7. Bug bounty program explicitly absent per docs.

### Critical Risks

- No immediate critical gate failure found from available public docs.
- Highest tail risk is correlated Hyperliquid chain/validator stress causing both backing and liquidity pressure simultaneously.
- Adjacent risk: HyperEVM lending venues holding wstHYPE are not yet battle-tested (Purrlend exploit April 25, 2026 illustrates the lending-stack fragility, though it did not affect StakedHYPE directly).

---

## Risk Score Assessment

### Critical Risk Gates

- [x] **No audit** -- PASS (6 audits disclosed)
- [x] **Unverifiable reserves** -- PASS (onchain staking model; OverseerV1 reserve drop to 0.15% noted as TODO for buffer relocation verification, not a gate failure)
- [x] **Total centralization** -- PASS (not single-EOA; multisig is 4-of-6 with 48h upgrade timelock)

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **6 disclosed audits** across Feb 2025–Apr 2026 (Three Sigma, Pashov x2, Guardian x2, Obsidian). Governance audit via Trail of Bits (inherited FraxGov). Monthly Health Reports added (Mar/Apr 2026).
- **No bug bounty program** on any major platform (explicitly disclosed by Valantis as not running one).
- ~15 months in production, TVL ~$158.6M (recovered from Feb trough; peaked ~$544M).
- Per rubric: 3+ audits → score 1–2 range for audits, but no bug bounty → cannot reach score 1. Production time 12–24 months with TVL >$100M fits score 2–3 for track record. Two new audits and 90 days more production tenure modestly improve the score.

**Score: 2.5/5** (unchanged — additional audits offset by explicit "no bug bounty" disclosure as regression vs peers)

#### Category 2: Centralization & Control Risks (Weight: 30%)

Subscores:
- Governance: **3.0** — 4-of-6 multisig (verified onchain, raised from 3-of-5 on 2026-04-07), **48-hour TimelockController on ProxyAdmin upgrades** (added 2026-04-10), signer identities still undisclosed, role/parameter changes still NOT timelocked, planned dual-governance not yet implemented. Per rubric: "Multisig 4/6 with raised threshold" + "Timelock on upgrades (not roles/params)" + "Powerful admin roles with limited constraints" = improved score 3.0 (was 4.0 in Feb).
- Programmability: **3.0** — Hybrid onchain/offchain (unchanged). Exchange rate is onchain (`balancePerShare`), but validator delegation strategy requires offchain operational decisions. OverseerV1 has MINTER_ROLE and BURNER_ROLE over stHYPE.
- External dependencies: **4.0** — Critical single-ecosystem dependency on Hyperliquid L1 (consensus, validator performance, staking rules). Unchanged.

Centralization score = (3.0 + 3.0 + 4.0) / 3 = **3.33**

**Score: 3.33/5** (improved from 3.67)

#### Category 3: Funds Management (Weight: 30%)

Subscores:
- Collateralization: **2.5** — 100% onchain collateral (staked HYPE), not over-collateralized. Liquid reserve at OverseerV1 dropped from 6.0% to 0.15% of backing; onchain trace confirms this is normal withdrawal-servicing (dominant sink is the documented stHYPE/WHYPE AMM Withdrawal Module), not a buffer disappearance. The system operates as flow-through reserve (Overseer replenished by staking-module returns) rather than maintaining a static float.
- Provability: **2.0** — Key state readable onchain (`totalSupply`, `balancePerShare`, `maxRedeemable`, `burnCount`). Exchange rate updated programmatically. AccessControl roles verified via `hasRole()`. Some offchain complexity around validator delegation not fully transparent.

Funds management score = (2.5 + 2.0) / 2 = **2.25**

**Score: 2.25/5** (unchanged)

#### Category 4: Liquidity Risk (Weight: 15%)

- Queue-based withdrawals: 7-day standard unstaking, up to 90-day for specialized stake account wind-down.
- DEX liquidity is now **~$6.95M total** ($6.26M stHYPE Pendle-heavy + $690K wstHYPE) across HyperEVM venues — material improvement vs ~$380K in Feb but still ~4% of $158M TVL.
- `maxRedeemable()` returned 0 at time of check — no instant redemption buffer available.
- Protocol unstaking queue remains the primary exit mechanism; Pendle adoption adds tradable depth on the stHYPE side.
- ~$65M of wstHYPE used as lending collateral (HyperLend ~$57M, Morpho $4M, others) against only ~$690K wstHYPE DEX liquidity and zero stablecoin pairs. Liquidations are still structurally fragile (~94:1 collateral-to-liquidity ratio).
- Concentration shift: HyperLend pooled lending now holds 87% of wstHYPE collateral — single-venue counterparty risk.
- Per rubric: "Withdrawal queues or restrictions" + "<$10M DEX liquidity for wrapped form" + ">1 week potential exit time" = score 3–4. Improved DEX liquidity warrants a notch down from 4.0 to 3.5.

**Score: 3.5/5** (improved from 4.0)

#### Category 5: Operational Risk (Weight: 5%)

- Good docs and audits; cadence improved with monthly Health Reports.
- Explicit no-bug-bounty stance; governance dual-governance roadmap unshipped.
- One adjacent HyperEVM lending incident (Purrlend, Apr 25 2026) demonstrates ecosystem fragility around wstHYPE collateral, though not StakedHYPE-caused.

**Score: 3.0/5** (unchanged)

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.33 | 30% | 1.00 |
| Funds Management | 2.25 | 30% | 0.68 |
| Liquidity Risk | 3.5 | 15% | 0.53 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **2.86 / 5.0** |

## Overall Risk Score: **2.86 / 5.0**

### Risk Tier: **MEDIUM RISK**

Rationale:
- Governance posture improved materially since Feb 2026: multisig 3-of-5 → 4-of-6, 48-hour upgrade timelock added, `setSelfDisableTransfer()` removed. Score improvement from 3.03 → 2.86.
- Audit coverage now 6 firms across 4 distinct review windows; still no bug bounty (explicit per Valantis docs).
- DEX liquidity materially better thanks to Pendle markets (~$6.3M on stHYPE side), but wstHYPE→stablecoin onchain exit remains absent; protocol unstaking queue (7+ days) is still the realistic exit path for any meaningful size.
- ~$65M wstHYPE lending collateral concentrated in HyperLend (~$57M, 87%) — single-venue counterparty risk introduced as Morpho exposure collapsed.
- OverseerV1 liquid HYPE buffer fell from 6.0% to 0.15% of backing with no docs-disclosed relocation — flagged as TODO; warrants direct confirmation with Valantis before next reassessment.
- Strong single-ecosystem dependency on Hyperliquid L1 unchanged.
- Partially offset by: onchain verifiable backing, programmatic exchange rate, Thunderhead's multi-LST track record, 15 months production tenure, no incidents on stHYPE itself.

## Reassessment Triggers

1. Any governance architecture upgrade (timelock delay change, dual-governance/token-veto rollout, multisig threshold/owner change).
2. TimelockController EXECUTOR_ROLE granted to zero address (open execution) or `MinDelayChange` reducing the 48-hour delay.
3. Material changes to unstake queue logic, reserve policy, or `maxRedeemable()` buffer parameters; confirmation of buffer relocation contract.
4. Any Hyperliquid validator jailing wave or governance rollout of validator slashing.
5. Any stHYPE discount >3% sustained for >24h.
6. Any incident disclosure by StakedHYPE, Valantis, or Hyperliquid affecting staking settlement.
7. Material change in wstHYPE lending venue concentration (HyperLend dominance reduces/grows, or new pooled venues introduce single-venue oracle/liquidation risk).
8. Release of new audits or a public bug bounty program (Immunefi/Sherlock/Cantina).

## Sources

- Valantis StakedHYPE docs: https://docs.valantis.xyz/stakedhype
- Roles and Controls Registry: https://docs.valantis.xyz/stakedhype/roles-and-controls-registry
- Upgrade and Risk Governance: https://docs.valantis.xyz/stakedhype/upgrade-and-risk-governance
- Contract Addresses: https://docs.valantis.xyz/stakedhype/contract-addresses
- Transparency and Risks: https://docs.valantis.xyz/stakedhype/transparency-and-risks
- StakedHYPE docs home (legacy): https://docs.stakedhype.fi/
- Stake Accounts & Architecture: https://docs.stakedhype.fi/technical/stake-accounts
- Integration (mint/burn/unstaking): https://docs.stakedhype.fi/technical/integrate
- StakedHYPE security: https://docs.stakedhype.fi/technical/security
- wstHYPE docs: https://docs.stakedhype.fi/technical/wsthype
- ValantisLabs audit repo: https://github.com/ValantisLabs/audits
- Thunderhead Labs audit repo: https://github.com/thunderhead-labs/audits
- Three Sigma Feb 2025 audit: https://github.com/ValantisLabs/audits/blob/main/Three_Sigma_Feb_25.pdf
- Pashov Oct 2025 audit: https://github.com/ValantisLabs/audits/blob/main/pashov_oct_25.pdf
- Pashov Nov 2025 audit: https://github.com/ValantisLabs/audits/blob/main/pashov_nov_2025.pdf
- Guardian Nov 2025 audit: https://github.com/ValantisLabs/audits/blob/main/guardian_nov_2025.pdf
- Guardian Jan 2026 audit: https://github.com/ValantisLabs/audits/blob/main/guardian_jan_2026.pdf
- Obsidian Apr 2026 audit: https://github.com/ValantisLabs/audits/blob/main/obsidian_april_2026.pdf
- Trail of Bits FraxGov audit (governance basis): https://github.com/trailofbits/publications/blob/master/reviews/2023-05-fraxgov-securityreview.pdf
- DeFiLlama stHYPE: https://defillama.com/protocol/sthype
- DeFiLlama pools API: https://yields.llama.fi/pools
- Hyperliquid staking docs: https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/staking
- Hyperliquid risks docs: https://hyperliquid.gitbook.io/hyperliquid-docs/risks
- ASXN HyperScreener (LST data): https://hyperscreener.asxn.xyz/liquid-staking
- Onchain verification: `cast` against `https://rpc.hyperliquid.xyz/evm` (chain ID 999, block 35,538,934 at assessment time)

## Appendix: HyperEVM Liquid Staking Market Share

stHYPE remains the #2 LST on HyperEVM by TVL. Per DeFiLlama (queried 2026-05-19):

| Token | TVL (DeFiLlama) | Approx share |
|-------|----------------:|-------------:|
| kHYPE (Kinetiq) | $849.5M | ~82% |
| stHYPE (Valantis) | $158.6M | ~15% |
| kmHype (Kinetiq) | $33.7M | ~3% |
| Hyperbeat LST | $14.1M | ~1% |

Total approx market: ~$1.05B (DeFiLlama-tracked LSTs only; excludes vHYPE/iHYPE/beHYPE/etc. which were tracked separately by ASXN in Feb 2026 but not extractable from the JS-rendered ASXN page this session — full share table marked as **TODO** for next reassessment).

~$65M of stHYPE supply is wrapped as wstHYPE and deposited as lending collateral (~30% of stHYPE TVL), down from ~60% concentration in Feb 2026.
