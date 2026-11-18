# Protocol Risk Assessment: Monetrix USDM

- **Assessment Date:** November 18, 2026
- **Token:** Monetrix USD (USDM)
- **Chain:** HyperEVM
- **Token Address:** [`0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377`](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377)
- **Final Score: 5.00/5.0**
- **Status:** GATED

## Overview + Links

Monetrix issues USDM against native USDC and invests the backing on HyperCore. The strategy pairs spot holdings with short perpetuals and can use Hyperliquid borrow/lend and HLP. USDM is the dollar claim. Stakers receive the portfolio's distributed yield through sUSDM, a separate token whose USDM exchange rate changes over time. This assessment covers unstaked USDM as collateral for a proposed HyperEVM Morpho Blue market borrowing native USDC. [Monetrix architecture](https://doc.monetrix.xyz/how-it-works/architecture), [transparency dashboard](https://www.monetrix.xyz/app/transparency), [issue #603](https://github.com/yearn/risk-score/issues/603).

**Decision.** Defer Yearn supply to a USDM-collateral market. A 2-of-3 governance Safe can exercise material powers directly, and a separate 2-of-3 HyperCore account controls most backing. Immediate liquidity is small relative to supply. A fixed 1 USDC oracle would carry those risks into lender solvency by continuing to value impaired USDM at par.

**Snapshot.** HyperEVM chain ID 999, [block 51,588,528](https://hyperevmscan.io/block/51588528), November 18, 2026 at 11:02:51 UTC, hash `0x5c21c10fa674371901b614d4e5b6b669fb24f5a621fd45da94c87a67ae53b29c`. Figures from Hyperliquid's live Info API are separately identified.

## Audits and Due Diligence Disclosures

Code4rena reviewed Monetrix between April 24 and May 4, 2026 and published its report on May 26. The contest covered 20 contracts and reported one medium finding and zero high findings. The deployed Accountant now deducts USDC portfolio-margin borrowing for registered accounts, addressing the observed USDC case in M-01. Its non-USDC supplied-asset branch still reads supplied balances without netting borrow amounts. The snapshot reads for supplied HYPE and UBTC showed zero borrow. TODO verify future supported borrow assets and audit coverage for post-contest changes, including instant exits and live governance wiring. No active bounty payout or SEAL Safe Harbor enrollment was independently confirmed. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [public contest source](https://github.com/code-423n4/2026-04-monetrix), [deployed Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Monetrix security disclosures](https://doc.monetrix.xyz/risk-and-security/security-design), [SEAL Safe Harbor](https://safeharbor.securityalliance.org/).

## Historical Track Record

The token was deployed on June 10, 2026 UTC. DefiLlama's series begins June 11 at $1.19M, peaked at $3.13M on October 7 and reported $2.87M on November 18. At the snapshot, 2.568M USDM, approximately 89.8% of outstanding supply, sat in the staking vault. This is concentration in a contract. TODO establish concentration by beneficial holder, stress-period exit liquidity and complete peg and incident history. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm), [DefiLlama peg data](https://defillama.com/stablecoin/monetrix-usdm), [sUSDM](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).

## Funds Management

### Contract Inventory

| Contract or account | Live address | Snapshot implementation |
|---|---|---|
| USDM | [Token proxy](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377) | [USDM](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code) |
| MonetrixVault | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) | [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code) |
| MonetrixAccountant | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) | [Accountant code](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code) |
| MonetrixConfig | [Config](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee) | [Config code](https://hyperevmscan.io/address/0x1cc4c32f029cfec5c47b0d0850632231992059bc#code) |
| RedeemEscrow | [Escrow](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578) | [Escrow code](https://hyperevmscan.io/address/0x17100f8cafd727550bb32e6f1496d463da6d978f#code) |
| YieldEscrow | [Yield escrow](https://hyperevmscan.io/address/0x12E4F1a26dc008e68C0E77A60881680eDa91c58C) | [Yield escrow code](https://hyperevmscan.io/address/0xfe68855e768e3cd979f92e26cf5c58d1be248fb6#code) |
| InsuranceFund | [Insurance](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106) | [Insurance code](https://hyperevmscan.io/address/0xf93564ce88fa07d2d84953edb12b4f4262685233#code) |
| sUSDM | [Staking token](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF) | [Staking code](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code) |
| Staking escrow | [sUSDMEscrow](https://hyperevmscan.io/address/0xD81600838Ab778D49038Df9c3B78CDcA244E3707#code) | Immutable |
| Instant exits | [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32), [InstantUnstake](https://hyperevmscan.io/address/0xaaCE6A69C27dF3F92763F688606335cBf3CE329d) | [Redeem code](https://hyperevmscan.io/address/0xf90624991d13ed3b66470d5a0babc7f78a7c4ae4#code), [unstake code](https://hyperevmscan.io/address/0xb778b2ca48b4198e0e60ec0973155ff1e81899db#code) |
| MonetrixAccessController | [Access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595) | [Access controller code](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code) |
| Timelocks | [24-hour](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF#code), [48-hour](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e#code) | Immutable |
| Core custody | [MonetrixCoreVault](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200) | HyperCore account |
| Settlement asset and transport | [Native USDC](https://hyperevmscan.io/address/0xb88339CB7199b77E23DB6E890353E22632Ba630f), [CoreDepositWallet](https://hyperevmscan.io/address/0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24) | [Circle source](https://github.com/circlefin/hyperevm-circle-contracts) |

### Accessibility and Token Mint Authority

Anyone can deposit between 1 and 500,000 USDC per transaction while minting is open, with a 5M USDM limit on total supply through the deposit path. The Vault takes USDC and mints USDM 1:1 atomically. Both tokens have six decimals. The separate distribution path mints the stakers' share when the Vault pulls previously settled USDC from YieldEscrow. Settlement uses an annualized cap of 40% and a minimum 20-hour interval. These bounds govern the Vault paths. At the token level only the current `vault()` can mint or burn, and the token checks caller identity rather than backing or amount. `GOVERNOR` can replace that address. HyperEVM–HyperCore transport moves backing USDC and has no USDM mint role. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code).

| Current address | Mint | Burn | Enforced by |
|---|---|---|---|
| [MonetrixVault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) | Yes | Yes, from its own balance | USDM `onlyVault`. Issuance via `deposit` or `distributeYield`. |

### Collateralization and Provability

| Snapshot component | USDC or USDM units |
|---|---:|
| USDM total supply | 2,859,313.83 USDM |
| Signed backing | 2,873,282.51 USDC |
| HyperEVM Vault USDC | 1,164.55 USDC |
| HyperEVM RedeemEscrow USDC | 71,823.58 USDC |
| Net HyperCore backing, inferred from the remainder | 2,800,294.38 USDC |
| Backing / supply | **100.49%** |
| InsuranceFund, excluded from backing | 11,523.94 USDC |

The queued claims of 72,229.08 USDC corresponded to 72,229.08 USDM still held by the Vault and included in supply. Counting both would double-count liabilities. RedeemEscrow showed a 405.50 USDC shortfall relative to those claims, while system-wide marked backing exceeded supply by 13,968.68 USDC. The DefiLlama adapter reads the same Accountant and its $2.87M figure is broadly consistent with this snapshot. It provides an external data check of the reported number. [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

HyperCore accounts represented 97.46% of marked backing. The custody account held predominantly HYPE exposure, with a smaller BTC leg and USDC borrowing. The Vault's own Core account had about 108K USDC supplied. Both accounts showed zero HLP equity. The live Core Info API at 11:05 UTC showed short positions broadly matching the HYPE and BTC exposure on the custody account. Those offsets leave exposure to spot–perp basis, execution, funding, liquidation and auto-deleveraging, especially given the HYPE concentration. The Accountant values positions with HyperCore precompiles and registered asset lists. Its marked backing has limited relevance to the USDC available to a liquidator in the same transaction. [Core account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Monetrix ADL design](https://doc.monetrix.xyz/risk-and-security/anti-adl-shield).

## Liquidity Risk

A regular redemption locks USDM, starts a 48-hour cooldown and burns the tokens when the owner claims USDC. The guide describes a three-day cooldown and burning on request. The deployed Config and Vault establish the live behavior. Escrow funding depends on available EVM balances and successful Core withdrawals and unwinds. InstantRedeem charges 30 bps and had 2,846.29 USDC available across users, with a 100 USDM minimum. [Redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

| USDM input | Direct Hybra V4, USDC out | InstantRedeem, USDC out |
|---:|---:|---:|
| 100 | 99.88 | 99.70 |
| 1,000 | 998.83 | 997.00 |
| 2,500 | 2,497.06 | 2,492.50 |
| 10,000 | 9,987.63 | Buffer too small |
| 25,000 | 24,707.37 | Buffer too small |
| 50,000 and 100,000 | 24,707.37, partial execution | Buffer too small |

The quotes are read-only simulations of the deployed router and InstantRedeem at the snapshot, inclusive of route fees and before gas. The router can leave some input unswapped. Its flat output at the two largest sizes indicates exhaustion of this route. The separate Hybra WHYPE route returned roughly 7,683 USDC at a 10,000 USDM input. Treat these as route-specific observations. TODO confirm full-fill cutoff, LP concentration and aggregate executable exit depth across additional routes. [Direct USDM/USDC pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3), [V4 router](https://hyperevmscan.io/address/0xBEC2BF10B7172C8E5621569BD285E9ADB1806426), [WHYPE pool](https://hyperevmscan.io/address/0xC263eD5351816e2f348c520B208a00383f563E32).

## Centralization & Control Risks

The shared access controller is UUPS upgradeable through `DEFAULT_ADMIN_ROLE`. The other Monetrix proxies in scope use `UPGRADER`. The Foundation Safe is 2-of-3 with no verified public attribution for the owners, no enabled Safe modules and no guard at the snapshot. It directly holds `DEFAULT_ADMIN_ROLE`, `GOVERNOR` and `GUARDIAN`. The 24-hour timelock also holds `GOVERNOR`, and the 48-hour timelock is the sole current `UPGRADER` holder. The Foundation Safe administers both timelocks alongside each timelock itself and holds proposer, executor and canceller on both. The same Safe can make direct governor changes and grant roles through the controller. `GUARDIAN` administers `OPERATOR`, and four individual wallets held that operator role. These assignments were reconstructed from role events through the snapshot and checked with `hasRole`. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [24-hour timelock](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF#readContract), [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e#readContract).

### Critical Permission Paths and Weakest Link

| Capability | Current authority and safeguards | Exposure |
|---|---|---|
| Change mint authority and roles, upgrade the access controller, change protocol routing or accounting | Foundation Safe, direct 2-of-3 with no required delay. Regular component upgrades can go through the 48-hour timelock, while the role-admin path is immediate. | USDM issuance, protocol backing and redemption liquidity. |
| Hold and move HyperCore backing | Separate native 2-of-3 account according to live Core Info state. One signer overlaps with the Foundation Safe. Core margin and settlement rules govern withdrawal availability. | Most of the approximately 2.80M USDC net backing located on HyperCore. |
| Operate strategy, settlement, redemption funding and supplied-asset registration | Four Vault operators can act individually. The Vault limits eligible hedge pairs. No cumulative loss limit was identified for delegated execution. Separately, the Core account had an active trading agent at the live read. | Assets in the respective Core accounts, accounting availability and timely redemptions. |
| Pause transfers or operator activity, change bridge retention | Foundation Safe as guardian. USDM's pause applies to ERC-20 transfers, including collateral seizure and transfer in a liquidation. | USDM exit and liquidation availability. |
| Withdraw insurance and instant exit reserves, change fees and replenish recovery destinations | Governor, including the direct Foundation Safe. The ordinary operator replenish path follows configured destinations. | 11,523.94 USDC insurance, 2,846.29 USDC immediate redeem liquidity, and the separate instant unstake buffer. |
| Change native USDC or CoreDepositWallet operation | Circle token control includes pause, blacklist and proxy upgrades. CoreDepositWallet has distinct externally controlled owner, pauser, rescuer and upgrade admin at the snapshot. | Dependence on USDC transferability and Core settlement infrastructure. |

**Weakest material paths.** Delegated Core trading has no verified independent cumulative loss limit. Both the Foundation Safe and the Core custody multisig fall below the three-signer governance threshold. The Foundation Safe controls mint authority without a mandatory delay, and the Core multisig controls the bulk of backing. TODO verify the Core agent's permitted action set and turnover limits against the current HyperCore rules and confirm the granularity of the risk limits used by keepers. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Core account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore multisig reference](https://www.hyperliquiddocs.io/hypercore/multi-sig.html), [Circle contracts](https://github.com/circlefin/hyperevm-circle-contracts).

### External Dependencies

HyperCore order execution, portfolio margin, balance precompiles and Core–EVM transfers serve both the strategy and its redemption pipeline. Circle's native USDC and CoreDepositWallet handle the settlement asset. The vault uses the local `depositFor` and Core return path. This is an underlying USDC transport dependency, and the reviewed path stays within Hyperliquid. A halt or impairment can trap marked backing away from the EVM escrow. [Circle native USDC](https://www.circle.com/multi-chain-usdc/hyperevm), [Circle contract source](https://github.com/circlefin/hyperevm-circle-contracts), [L2BEAT contract discovery](https://disco.l2beat.com/ui/p/hyperliquid), [HyperCore transfer documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers).

## Morpho USDM/USDC Oracle and Market Design

**Market decision.** Keep the Yearn supply cap at zero pending a stronger governance and custody setup, larger independently available immediate liquidity and an audited price feed. A USDM transfer pause can block collateral delivery during liquidation under any price design. An oracle cannot make delayed Core backing liquid, prevent governance changes, or remediate token transfer restrictions. Existing Yearn usage or approval is TODO. Issue #603 requests an assessment. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho liquidation](https://docs.morpho.org/learn/concepts/blue/liquidation/), [issue #603](https://github.com/yearn/risk-score/issues/603).

**Pricing for a future pilot.** Use a direct, independently governed USDM/USDC feed with minimum liquidity and observation requirements, or a USDM/USD feed divided by a separately validated USDC/USD feed. Require a live debt-sized liquidation quote and sufficient depth to support those feeds. Use conservative corroborated net backing per USDM as a one-sided ceiling alongside market price and par. A fall in either observed market price or net backing must be able to reduce the reported value. Treat isolated weak DEX prints as alerts pending independent confirmation. The current Hybra spot price or an uncorroborated TWAP relies on shallow liquidity and should carry no standalone pricing authority. Likewise, InstantRedeem's 0.997 USDC payout applies only when its buffer is funded. TODO identify and verify an independent production feed and a credible secondary input before deployment. [Morpho oracle reference](https://docs.morpho.org/developers/contracts/oracles/), [Oracle deployment guidance](https://docs.morpho.org/curate/tutorials-market-v1/deploying-oracle/), [Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

Implement and test bounded feed age, confidence and deviation checks and exercise stale-feed and backing-read failures before supply. An oracle revert can block liquidation as well as new borrowing. A blind zero price can create wrongful liquidations. Use an independently validated fallback only while it remains within its freshness and confidence bounds, and document joint failure handling before deployment. Morpho market parameters are fixed. Replacing an unsuitable oracle address requires a new market and a migration. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho oracle risks](https://docs.morpho.org/learn/concepts/oracle/).

**Units and sizing.** Both USDM and native USDC have six decimals. The oracle should return `floor(USDC_per_USDM × 10^36)`. Par is `10^36`, and 0.97 USDC per USDM is `97 × 10^34`. For any later pilot select an enabled LLTV only after stressing depeg, gas, slippage, funding and delayed reserve availability. For example, with a 77% LLTV the Blue liquidation incentive multiplier is about 1.074. Liquidators need an executable exit above roughly 93.1% of the oracle mark to cover repayment before gas. At a fixed $1 mark, an executable $0.90 exit leaves liquidation uneconomic even if a borrower is otherwise eligible. Model concurrent borrower liquidations and size aggregate exposure against the smallest stressed executable route. [Morpho oracle units](https://docs.morpho.org/developers/contracts/oracles/), [Morpho liquidation math](https://docs.morpho.org/learn/concepts/blue/liquidation/).

## Operational Risk and Monitoring

The Hybra team identifies itself by public aliases, with security, architecture and user documentation available. The reviewed public disclosures give limited detail on legal structure and tested incident procedures. Current source and configuration should take precedence over the architecture and redemption guides on delegated operation, cooldown and burn timing. [Team](https://doc.monetrix.xyz/team/team), [terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [security design](https://doc.monetrix.xyz/risk-and-security/security-design).

| Frequency | Source and signals | Trigger |
|---|---|---|
| On each change | Access controller role events, both Timelock schedule/execute events, Foundation Safe threshold/owners/modules, proxy `Upgraded`, USDM `VaultSet` and Core account signer/agent changes | Reassess every material change. |
| Hourly and on large flows | Accountant `totalBackingSigned()` vs USDM `totalSupply()`; Core account margin, borrow, hedge delta and withdrawals | Investigate backing below 100%, failed reads, unhedged exposure or a failed Core return. |
| Hourly and before any allocation | Vault/USDM pause state, RedeemEscrow `totalOwed()` and `shortfall()`, InstantRedeem `bufferBalance()` and full-size DEX exit | Reassess a pause, rising shortfall, delay beyond the configured cooldown or an executable exit below the liquidation break-even. |
| Daily | Check Config caps, collateral registry, fee and cooldown settings, Core and EVM custody split and InsuranceFund `balance()` | Reassess any new borrowing leg, increased concentration, or insurance drawdown. |

## Appendix: Contract Architecture

```text
Native USDC → MonetrixVault → USDM holder → sUSDM (optional)
                    │                         ↑
                    ├─ CoreDepositWallet → HyperCore custody and strategy
                    │                        │
                    │    redeem USDC ← realized Core proceeds
                    ├─ RedeemEscrow → matured claim → USDC holder
                    └─ YieldEscrow → sUSDM / insurance / foundation

HyperCore and EVM balances → MonetrixAccountant → settlement checks
Foundation Safe → AccessController → vault, token and escrow permissions
Foundation Safe → 24h/48h timelocks → delegated governance and upgrades
HyperCore multisig → leveraged spot/short-perp portfolio
```

## Risk Score Assessment

The assessed proxy's implementation is verified, a published external audit exists, and material backing is observable onchain. **The governance gate triggers** because material authority rests with fewer than three signers, including direct Foundation Safe governance and separate Core custody. This gives **5.00/5.0, High Risk (GATED)**. The ungated score is **3.85/5.0**.

| Category | Score | Weight | Weighted | Basis |
|---|---:|---:|---:|---|
| Audits & Historical | 3.75 | 20% | 0.75 | Audits 3.5 and history 4. One public review, partial current-version coverage and five months of live history below $10M. |
| Centralization & Control | 4.50 | 30% | 1.35 | Governance 5, programmability 3.5 and dependencies 5. Direct low-threshold authority, keeper-mediated execution and common HyperCore dependency. |
| Funds Management | 3.00 | 30% | 0.90 | Collateralization 3.5 and provability 2.5. Marked backing is observable, heavily allocated and depends on a leveraged custody account plus registered accounting inputs. |
| Liquidity | 4.50 | 15% | 0.675 | A two-day queue, thin atomic depth and a small removable instant buffer. |
| Operational | 3.50 | 5% | 0.175 | Public aliases and material gaps in live-state documentation and disclosure. |
| **Ungated score** | | | **3.85** | |
| **Final Score** | | | **5.00/5.0** | **Governance gate.** |
