# Protocol Risk Assessment: Monetrix USDM

- **Assessment Date:** November 18, 2026
- **Token:** Monetrix USD (USDM)
- **Chain:** HyperEVM
- **Token Address:** [`0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377`](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377)
- **Final Score: 5.00/5.0**
- **Status:** GATED

## Overview + Links

Monetrix issues USDM against native USDC and invests the backing on HyperCore. The strategy pairs spot holdings with short perpetuals to earn funding and can use Hyperliquid borrow/lend, maker rebates and HLP returns. USDM is the dollar claim. Stakers receive the portfolio's distributed yield through sUSDM, a separate token whose USDM exchange rate changes over time. This assessment covers unstaked USDM as collateral for a proposed HyperEVM Morpho Blue market borrowing native USDC.

**Links**

- [Monetrix documentation and architecture](https://doc.monetrix.xyz/how-it-works/architecture)
- [Earn app](https://www.monetrix.xyz/app/earn) and [transparency dashboard](https://www.monetrix.xyz/app/transparency)
- [Public Code4rena contest repository](https://github.com/code-423n4/2026-04-monetrix)
- [Security disclosures and deployed contracts](https://doc.monetrix.xyz/risk-and-security/audits-and-contracts)
- [DefiLlama TVL and methodology](https://defillama.com/protocol/monetrix-usdm) and [L2BEAT Hyperliquid dependency analysis](https://l2beat.com/publications/lighter-vs-hyperliquid)
- [Assessment request in issue #603](https://github.com/yearn/risk-score/issues/603)

**Decision.** Defer Yearn supply to a USDM-collateral market. A 2-of-3 governance Safe can exercise material powers directly, and a separate 2-of-3 HyperCore account controls most backing. Immediate liquidity is small relative to supply. A fixed 1 USDC oracle would carry those risks into lender solvency by continuing to value impaired USDM at par.

**Snapshot.** HyperEVM chain ID 999, [block 51,588,528](https://hyperevmscan.io/block/51588528), November 18, 2026 at 11:02:51 UTC, hash `0x5c21c10fa674371901b614d4e5b6b669fb24f5a621fd45da94c87a67ae53b29c`. Figures from Hyperliquid's live Info API are separately identified.

## Audits and Due Diligence Disclosures

Code4rena reviewed Monetrix between April 24 and May 4, 2026 and published its report on May 26. The contest covered 20 contracts and reported one medium finding and zero high findings. The architecture spans upgradeable tokens and escrow contracts, a shared access controller, and a portfolio-margin account on a separate execution environment. Several key checks depend on interactions across those components. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [public contest source](https://github.com/code-423n4/2026-04-monetrix), [Monetrix contract inventory](https://doc.monetrix.xyz/risk-and-security/audits-and-contracts).

The deployed Accountant nets USDC borrowing for registered portfolio-margin accounts, addressing the observed USDC case in M-01. The non-USDC supplied balances remain gross in the Accountant. Snapshot reads showed zero borrow against the supplied HYPE and UBTC entries. Some low-severity operational findings still have relevant live behavior, including the absence of a dedicated event for changing the multisig-routing flag. TODO confirm audit coverage of the deployed instant exits and governance wiring, and reassess the accounting if non-USDC borrow assets are enabled. [Code4rena findings](https://code4rena.com/reports/2026-04-monetrix), [deployed Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [deployed Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

### Bug Bounty

Monetrix's security page describes a planned ongoing bounty and provides a disclosure contact. TODO verify a live program, maximum payout and SEAL Safe Harbor enrollment. [Monetrix security disclosures](https://doc.monetrix.xyz/risk-and-security/security-design), [SEAL Safe Harbor](https://safeharbor.securityalliance.org/).

## Historical Track Record

- **Time in production and TVL.** USDM was deployed on June 10, 2026 UTC. DefiLlama recorded $1.19M on June 11, a $3.13M peak on October 7 and $2.87M on November 18, roughly 8% below peak after five months of live history. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm).
- **Holder concentration.** At the snapshot, 2.568M USDM, approximately 89.8% of outstanding supply, sat in the sUSDM staking contract. TODO establish beneficial-holder concentration across direct USDM and balances held through sUSDM. [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).
- **Peg history.** In the 16 available daily observations from November 3–18 in DefiLlama's Monetrix USD series, USDM ranged from $0.9832 on November 14 to $1.0098 on November 5. Two observations fell more than 1% from par. TODO establish earlier and intraday peg behavior and the exit sizes available during the observed discounts. [DefiLlama peg chart](https://defillama.com/stablecoin/monetrix-usdm), [daily price series](https://stablecoins.llama.fi/stablecoinprices).
- **Security incidents.** The reviewed public sources did not identify a realized Monetrix USDM loss or postmortem through the assessment date. TODO confirm complete incident history with Monetrix. [Monetrix security disclosures](https://doc.monetrix.xyz/risk-and-security/security-design), [DefiLlama incident register](https://defillama.com/hacks).

## Funds Management

The Vault delegates most backing to HyperCore. The portfolio uses HYPE and BTC basis positions and USDC borrow/lend. HLP is an approved venue with zero observed allocation. The monitoring plan tracks the Vault's Core custody configuration, the Accountant's asset registries and the observed Core positions and balances.

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

### Accessibility

Any account can deposit native USDC to mint USDM or request redemption of its USDM while the relevant contracts are unpaused. Deposit is an atomic 1:1 exchange. Standard redemption takes a request and an owner-initiated claim after the configured 48-hour cooldown. The standard path pays USDC at par without a protocol redemption fee, subject to escrow funding. The atomic redemption path has a 100 USDM minimum, a 30 bp fee, a finite USDC buffer and a cap of 256 pending replenishment requests. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

### Token Mint Authority

**Mint mechanism:** USDM authorizes the current `vault()` through `onlyVault`. The deployed Vault mints on permissionless deposits and during operator-initiated yield distribution. Governance can change the designated Vault. The Core–EVM transport moves backing USDC and has no USDM mint role. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

**Mint requires backing:** The current Vault paths require USDC from the depositor or YieldEscrow. The token's mint check enforces the caller address and governance can designate a different minter without a token-level backing check. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

**Per-address mint authority** at the November 18 snapshot. [USDM proxy state](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377#readProxyContract).

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---|:---:|:---:|---|---|
| [MonetrixVault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) | Yes | Yes | USDM `onlyVault` | Mints on deposit or distribution. Burns from the Vault's own balance. |

**Rate limits / supply caps:** Deposit limits are 1–500,000 USDC per transaction and 5M USDM total supply through the deposit path. Yield settlement has a minimum 20-hour interval and a 40% annualized bound. Staker yield injection has a separate 1M USDM per-call cap. The USDM token itself has no mint cap. [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code).

**Backing check at mint time:** Deposit pulls matching USDC in the mint transaction. Yield distribution pulls USDC previously settled into YieldEscrow before it mints the portion distributed to sUSDM. Settlement checks available EVM USDC and the Accountant's distributable surplus. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code).

### Collateralization

| Snapshot component | USDC or USDM units |
|---|---:|
| USDM total supply | 2,859,313.83 USDM |
| Signed backing | 2,873,282.51 USDC |
| HyperEVM Vault USDC | 1,164.55 USDC |
| HyperEVM RedeemEscrow USDC | 71,823.58 USDC |
| Net HyperCore backing, inferred from the remainder | 2,800,294.38 USDC |
| Backing / supply | **100.49%** |
| InsuranceFund, excluded from backing | 11,523.94 USDC |

The queued claims of 72,229.08 USDC corresponded to 72,229.08 USDM still held by the Vault and included in supply. Counting both would double-count liabilities. RedeemEscrow showed a 405.50 USDC shortfall relative to those claims, while system-wide marked backing exceeded supply by 13,968.68 USDC. The separate InsuranceFund covered about 0.40% of outstanding supply at face value and can be withdrawn by governance. [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [InsuranceFund source](https://hyperevmscan.io/address/0xf93564ce88fa07d2d84953edb12b4f4262685233#code).

HyperCore accounts represented 97.46% of marked backing. The custody account held predominantly HYPE exposure, with a smaller BTC leg and USDC borrowing. The Vault's own Core account had about 108K USDC supplied. Both accounts showed zero HLP equity. The live Core Info API at 11:05 UTC showed short positions broadly matching the HYPE and BTC exposure on the custody account. Those offsets leave exposure to spot–perp basis, execution, funding, liquidation and auto-deleveraging, especially given the HYPE concentration. HyperCore enforces margin and liquidation for the strategy. Monetrix governance sets the Vault's deposit cap, supported hedge assets and settlement parameters. Minting and redeeming at par support peg arbitrage while the protocol operates and exits are funded. [Core account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin), [Monetrix ADL design](https://doc.monetrix.xyz/risk-and-security/anti-adl-shield), [MonetrixConfig](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract).

### Provability

Anyone can compare `totalBackingSigned()` with USDM `totalSupply()` and reconcile the EVM balances and registered Core positions through the precompiles. The Accountant excludes the insurance and undistributed yield reserves and marks the portfolio using HyperCore prices. The calculation depends on the live asset registry and values positions at a mark rather than an executable redemption quote. DefiLlama's approximately $2.87M figure reads the same Accountant. TODO verify an independent reserve attestation or separately maintained full-portfolio reconciliation. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

An operator proposes periodic strategy P&L for settlement. The Vault and Accountant check EVM USDC, eligible surplus, elapsed time and the annualized cap. At the snapshot, Config split distributed yield 75% to stakers, 10% to insurance and 15% to the Foundation when sUSDM had outstanding shares. Share conversion is public through `sUSDM.convertToAssets()`, which returned about 1.0412 USDM per sUSDM after decimal normalization. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).

## Liquidity Risk

A regular redemption locks USDM, starts a 48-hour cooldown and burns the tokens when the owner claims USDC. The request is fixed at par and earns no yield while pending. Each request matures independently. Owners can claim matured requests in any order while the escrow has enough USDC. Escrow funding depends on available EVM balances and successful Core withdrawals and unwinds. The guide describes a three-day cooldown and burning on request, while the deployed Vault and Config establish the live behavior. InstantRedeem had 2,846.29 USDC available across users and pays from that buffer before replenishing through the delayed route. [Redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [RedeemEscrow code](https://hyperevmscan.io/address/0x17100f8cafd727550bb32e6f1496d463da6d978f#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

| USDM input | Direct Hybra V4, USDC out | Direct discount to par | InstantRedeem, USDC out |
|---:|---:|---:|---:|
| 100 | 99.88 | 0.116% | 99.70 |
| 1,000 | 998.83 | 0.117% | 997.00 |
| 2,500 | 2,497.06 | 0.118% | 2,492.50 |
| 10,000 | 9,987.63 | 0.124% | Buffer too small |
| 25,000, 50,000 and 100,000 | 24,707.37, output capped | Full-fill depth unverified | Buffer too small |

The quotes are read-only simulations of the deployed router and InstantRedeem at the snapshot, inclusive of route fees and before gas. The router can leave some input unswapped. The separate Hybra WHYPE route returned roughly 7,683 USDC at a 10,000 USDM input request, with full execution unverified at that size. A large holder relying on the verified routes would need delayed redemption or additional liquidity to exit at a small discount. TODO confirm full-fill cutoffs, LP concentration, aggregate exit depth across venues and liquidity during the historical discounts. [Direct USDM/USDC pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3), [V4 router](https://hyperevmscan.io/address/0xBEC2BF10B7172C8E5621569BD285E9ADB1806426), [WHYPE pool](https://hyperevmscan.io/address/0xC263eD5351816e2f348c520B208a00383f563E32).

## Centralization & Control Risks

### Governance

The shared access controller is UUPS upgradeable through `DEFAULT_ADMIN_ROLE`. The other Monetrix proxies in scope use `UPGRADER`. The Foundation Safe is 2-of-3 with no verified public attribution for the owners, no enabled Safe modules and no guard at the snapshot. It directly holds `DEFAULT_ADMIN_ROLE`, `GOVERNOR` and `GUARDIAN`. The 24-hour timelock also holds `GOVERNOR`, and the 48-hour timelock is the sole current `UPGRADER` holder. The Foundation Safe administers both timelocks alongside each timelock itself and holds proposer, executor and canceller on both. The same Safe can make direct governor changes and grant roles through the controller. `GUARDIAN` administers `OPERATOR`, and four individual wallets held that operator role. These assignments were reconstructed from role events through the snapshot and checked with `hasRole`. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [24-hour timelock](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF#readContract), [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e#readContract).

The current USDM implementation exposes a global pause that covers ordinary transfers, minting and burning. The reviewed implementation has no per-holder freeze or seizure function. Upgrade authority and the ability to change the designated minter still give governance material control over the token and its backing. [USDM source](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|---|---|---|---|
| USDM minter changes, AccessController role assignments and upgrades, Vault routing and accounting configuration | [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) through direct `GOVERNOR` and `DEFAULT_ADMIN_ROLE`. Component proxy upgrades use `UPGRADER`. | Direct powers require 2-of-3 with no mandatory delay. The 48-hour timelock is the current `UPGRADER` holder and the Safe administers the role. | USDM issuance, protocol backing and redemption liquidity. |
| HyperCore backing custody and withdrawals | [Native Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), separate from the Foundation Safe. | 2-of-3 per live Core Info state, with one signer overlap. HyperCore margin and settlement govern funds available for withdrawal. | Most of the approximately 2.80M USDC net backing on HyperCore. |
| Vault strategy, settlement and redemption operations, and Accountant supplied-asset registration | Vault `OPERATOR` wallets hold authority individually. The Core custody account separately delegates trading. | Vault hedge-pair allowlist and yield settlement bounds. TODO verify cumulative execution limits and the Core agent's exact permissions. | Core portfolio and availability of accounting and redeems. |
| RedeemEscrow, YieldEscrow and staking escrow releases | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) controls the USDC escrows. [sUSDM](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF) controls the staking escrow. Ultimate authority follows governance of the two proxies. | The current claim paths enforce ownership and cooldowns. Ordinary redemption escrow reclamation is limited to USDC above pending obligations. | 71,823.58 USDC in RedeemEscrow, 78,900.67 USDM in the staking escrow and zero USDC in YieldEscrow at the snapshot. |
| USDM and sUSDM transfers, Vault activity and bridge retention | Foundation Safe through `GUARDIAN`. | 2-of-3 with no mandatory delay. The transfer pause includes collateral delivery in liquidations. | USDM exits, sUSDM withdrawals and Morpho collateral delivery. |
| Insurance and instant-exit reserves, fees and recovery destinations | Foundation Safe through direct `GOVERNOR`. The ordinary operator replenish path follows configured destinations. | 2-of-3 with no mandatory delay on governor actions. | 11,523.94 USDC insurance, 2,846.29 USDC instant redeem buffer, and the separate instant unstake buffer. |
| Native USDC and CoreDepositWallet permissions | Circle token pause, blacklist and upgrade authorities. CoreDepositWallet has owner, pauser, rescuer and upgrade admin roles. | Separate role holders for the Core wallet at the snapshot. TODO verify offchain approval requirements supporting Circle's roles. | USDC transfers and availability of Core settlement and return flows. |

**Weakest material paths.** Delegated Core trading has no verified independent cumulative loss limit. Both the Foundation Safe and the Core custody multisig fall below the three-signer governance threshold. The Foundation Safe controls mint authority without a mandatory delay, and the Core multisig controls the bulk of backing. TODO verify the Core agent's permitted action set and turnover limits against the current HyperCore rules and confirm the granularity of the risk limits used by keepers. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Core account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore multisig reference](https://www.hyperliquiddocs.io/hypercore/multi-sig.html), [Circle contracts](https://github.com/circlefin/hyperevm-circle-contracts).

### Programmability

The EVM contracts execute minting, track redemption claims, enforce funding and cooldown checks and calculate sUSDM's exchange rate from onchain balances. Operators decide when to trade, move USDC between environments, fund the queue and settle yield. Since yield starts with an operator-proposed amount, the published sUSDM rate can lag strategy P&L between distributions. The protocol also relies on Core custody operations and asynchronous execution for withdrawals from deployed backing. A successful EVM request alone establishes no guarantee that the corresponding Core operation has settled. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code), [HyperCore execution documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

### External Dependencies

HyperCore order execution, portfolio margin, balance precompiles and Core–EVM transfers serve both the strategy and its redemption pipeline. Circle's native USDC and CoreDepositWallet handle the settlement asset. The vault uses the local `depositFor` and Core return path. This is an underlying USDC transport dependency, and the reviewed path stays within Hyperliquid. A halt or impairment can trap marked backing away from the EVM escrow. [Circle native USDC](https://www.circle.com/multi-chain-usdc/hyperevm), [Circle contract source](https://github.com/circlefin/hyperevm-circle-contracts), [L2BEAT contract discovery](https://disco.l2beat.com/ui/p/hyperliquid), [HyperCore transfer documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers).

The Accountant uses HyperCore oracle prices and balance precompiles for its strategy marks. Required reads can revert, and the assessed implementation has no independent price fallback. The Accountant is UUPS upgradeable, and its Config and accepted asset registry can change through governance. Funded EVM balances can cover some redemptions during a Core disruption. Their snapshot size makes that a limited backstop. The proposed Morpho oracle would be a separate dependency. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

## Morpho USDM/USDC Oracle and Market Design

**Market decision.** Keep the Yearn supply cap at zero pending a stronger governance and custody setup, larger independently available immediate liquidity and an audited price feed. A USDM transfer pause can block collateral delivery during liquidation under any price design. An oracle cannot make delayed Core backing liquid, prevent governance changes, or remediate token transfer restrictions. Existing Yearn usage or approval is TODO. Issue #603 requests an assessment. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho liquidation](https://docs.morpho.org/learn/concepts/blue/liquidation/), [issue #603](https://github.com/yearn/risk-score/issues/603).

**Pricing for a future pilot.** Use a direct, independently governed USDM/USDC feed with minimum liquidity and observation requirements, or a USDM/USD feed divided by a separately validated USDC/USD feed. Require a live debt-sized liquidation quote and sufficient depth to support those feeds. Use conservative corroborated net backing per USDM as a one-sided ceiling alongside market price and par. A fall in either observed market price or net backing must be able to reduce the reported value. Treat isolated weak DEX prints as alerts pending independent confirmation. The current Hybra spot price or an uncorroborated TWAP relies on shallow liquidity and should carry no standalone pricing authority. Likewise, InstantRedeem's 0.997 USDC payout applies only when its buffer is funded. TODO identify and verify an independent production feed and a credible secondary input before deployment. [Morpho oracle reference](https://docs.morpho.org/developers/contracts/oracles/), [Oracle deployment guidance](https://docs.morpho.org/curate/tutorials-market-v1/deploying-oracle/), [Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

Implement and test bounded feed age, confidence and deviation checks and exercise stale-feed and backing-read failures before supply. An oracle revert can block liquidation as well as new borrowing. A blind zero price can create wrongful liquidations. Use an independently validated fallback only while it remains within its freshness and confidence bounds, and document joint failure handling before deployment. Morpho market parameters are fixed. Replacing an unsuitable oracle address requires a new market and a migration. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho oracle risks](https://docs.morpho.org/learn/concepts/oracle/).

**Units and sizing.** Both USDM and native USDC have six decimals. The oracle should return `floor(USDC_per_USDM × 10^36)`. Par is `10^36`, and 0.97 USDC per USDM is `97 × 10^34`. For any later pilot select an enabled LLTV only after stressing depeg, gas, slippage, funding and delayed reserve availability. For example, with a 77% LLTV the Blue liquidation incentive multiplier is about 1.074. Liquidators need an executable exit above roughly 93.1% of the oracle mark to cover repayment before gas. At a fixed $1 mark, an executable $0.90 exit leaves liquidation uneconomic even if a borrower is otherwise eligible. Model concurrent borrower liquidations and size aggregate exposure against the smallest stressed executable route. [Morpho oracle units](https://docs.morpho.org/developers/contracts/oracles/), [Morpho liquidation math](https://docs.morpho.org/learn/concepts/blue/liquidation/).

## Operational Risk

Monetrix is built by the Hybra team, whose leads identify themselves by public aliases. Hybra publishes its own audits and deployment records. Monetrix provides security, architecture and user documentation, but the descriptions of delegated operation, cooldown and burn timing need to be reconciled with the deployment. The public terms and security materials give limited detail on the legal entity and on tested incident procedures. TODO confirm the governing entity and jurisdiction, and obtain the incident runbook and evidence of exercises or prior use. [Monetrix team](https://doc.monetrix.xyz/team/team), [Monetrix terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design), [Hybra audit and contract records](https://hybra-foundation.gitbook.io/hybra-foundation/security/contracts).

## Monitoring

| Frequency | Contracts and signals | Trigger |
|---|---|---|
| On each change | [AccessController](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events) role events and `hasRole()`, [24-hour](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF) and [48-hour timelocks](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e) schedule and execution events and `getMinDelay()`, [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) threshold and modules, proxy `Upgraded` and [USDM](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377) `VaultSet`. | Reassess any change in threshold, role authority, implementation or minimum enforced delay. |
| Hourly and on large flows | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) `totalBackingSigned()` vs USDM `totalSupply()`. Track [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200) margin, borrow balances, hedge delta, withdrawals and signer/agent changes via precompile and Core Info reads as available. | Investigate backing below 100%, failed reads, an unhedged material leg, a changed Core authorization or a failed Core return. |
| Hourly and before any allocation | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) and USDM `paused()`, [RedeemEscrow](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578) `totalOwed()` and `shortfall()`, [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32) `bufferBalance()` and `pendingReplenishCount()`, and [Hybra](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3) debt-sized full-fill quote. | Reassess a pause, rising shortfall, any matured unfunded claim or an executable exit below liquidation break-even. |
| Daily | [Config](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee) caps, registry and cooldowns. Check Vault `multisigVault()` and `multisigVaultEnabled()`, Accountant supplied registries, and [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106) `balance()` divided by USDM supply. | Reassess a new borrowing leg, changed custody route, material drift in collateral allocation or any insurance drawdown. |

If pinned precompile reads fail, use Core Info for a current diagnostic and record the time difference. Treat stale or failed reads as a loss of monitoring coverage until reconciliation succeeds. [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [Hyperliquid Info reference](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint).

## Appendix: Contract Architecture

```text
Vault / token layer
  User USDC → MonetrixVault → USDM → optional sUSDM staking

Protocol layer
  MonetrixVault → RedeemEscrow → matured claim → user USDC
  MonetrixVault → YieldEscrow → stakers, InsuranceFund and Foundation
  Vault and Core balances → MonetrixAccountant → settlement checks
  MonetrixConfig → deposit, redemption and settlement parameters

Underlying layer
  MonetrixVault ↔ CoreDepositWallet / Core return path
                     ↔ HyperCore custody and strategy
                       → HYPE / BTC basis and USDC borrow/lend
  HyperCore balance and price precompiles → MonetrixAccountant

Governance
  Foundation Safe → AccessController → token, Vault and escrow permissions
  Foundation Safe → 24h / 48h timelocks → governance and upgrades
  HyperCore multisig → Core custody and strategy
```

## Risk Summary

### Key Strengths

- Permissionless deposits transfer native USDC and mint matching USDM in the same transaction.
- Verified deployed code and Core state allow public reconciliation of reserves and supply.
- Separate redemption escrow and a funded instant buffer provide two protocol exit paths.
- Code4rena reviewed the core system, and the live Accountant nets the observed USDC portfolio-margin debt.

### Key Risks

- 97.46% of marked backing depends on HyperCore execution, portfolio margin and the USDC return path.
- The strategy is concentrated in HYPE basis exposure. Basis divergence, negative funding, liquidation or auto-deleveraging can reduce backing.
- The 48-hour redemption cooldown and limited immediate exit depth constrain liquidation size. The direct Hybra route returned about 24.7K USDC before output flattened.
- A transfer pause can block collateral delivery in Morpho. A proposed market also needs a price feed that responds to a depeg and a deterioration in backing.

### Critical Risks

- The Foundation Safe has 2-of-3 authority over mint and protocol governance without a mandatory delay. A separate native 2-of-3 account controls most backing, with one signer overlap between the two groups.
- Strategy execution relies on individually authorized accounts. Independent cumulative loss limits for delegated execution remain unverified.

## Risk Score Assessment

Scores use the November 18 snapshot and the published Yearn rubric. The category-weighted score describes the underlying risk before the governance gate is applied.

### Critical Risk Gates

- [ ] **Unverified contract source.** The USDM proxy and its active implementation have verified source. [USDM proxy](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377#code), [active implementation](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).
- [ ] **No audit.** Code4rena reviewed the core system. Coverage of later components and changes is evaluated under Category 1. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix).
- [ ] **Unverifiable reserves.** The Vault and RedeemEscrow balances and Core position inputs are observable onchain. [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [HyperCore reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).
- [x] **Total centralization.** The Governance rubric triggers the gate for a material control path requiring fewer than three signers. The direct 2-of-3 Foundation path and native 2-of-3 Core custody each meet that condition. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 3.5/5.** One public Code4rena review covers the core system. The deployed system has complex EVM–Core interactions. Post-contest coverage and an active bounty remain unverified. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design).

**Subcategory B: Historical Track Record — 4.0/5.** About five months in production and TVL below $10M. The observed price series includes brief discounts, and verified stress-period exit depth is pending. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm), [DefiLlama peg chart](https://defillama.com/stablecoin/monetrix-usdm).

**Score: 3.75/5** — (3.5 + 4.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0/5.** Direct 2-of-3 governance, role administration and Core custody determine the material control paths. The 24- and 48-hour timelocks provide scheduled routes for selected operations alongside the Foundation Safe's direct powers. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Programmability — 3.5/5.** Minting, claim checks and sUSDM conversion are calculated onchain. Trading, replenishment and yield settlement depend on active operator decisions and Core execution. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code).

**Subcategory C: External Dependencies — 5.0/5.** HyperCore outage or impairment can disrupt order execution, backing reads and the return of USDC from the same portfolio. Circle's USDC and settlement infrastructure add a second critical dependency. [HyperCore execution documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [Circle contracts](https://github.com/circlefin/hyperevm-circle-contracts).

**Score: 4.50/5** — (5.0 + 3.5 + 5.0) / 3.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 3.5/5.** Marked backing covered 100.49% of outstanding USDM. The narrow buffer and concentration in actively managed, leveraged HYPE basis positions make realized coverage sensitive to unwinds and margin. [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Provability — 2.5/5.** Backing inputs and the Accountant mark are public. Reconciliation depends on registered assets and Core marks. The independent TVL publisher uses the same Accountant, and a separate reserve attestation remains unverified. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

**Score: 3.00/5** — (3.5 + 2.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 4.50/5** — The standard exit requires a two-day cooldown and sufficient escrow funding at claim. Verified immediate depth is small relative to liabilities, the instant buffer is discretionary, and large exits depend on timely Core returns. No stress-performance adjustment was applied. [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract), [direct Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

#### Category 5: Operational Risk (Weight: 5%)

**Score: 3.50/5** — The Hybra team has public aliases and publishes protocol documentation. Material live-state discrepancies remain, and the legal entity, jurisdiction and tested incident procedures are unverified. [Team](https://doc.monetrix.xyz/team/team), [terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem).

### Final Score Calculation

| Category | Score | Weight | Weighted |
|---|---:|---:|---:|
| Audits & Historical | 3.75 | 20% | 0.750 |
| Centralization & Control | 4.50 | 30% | 1.350 |
| Funds Management | 3.00 | 30% | 0.900 |
| Liquidity Risk | 4.50 | 15% | 0.675 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Category-weighted score** | | | **3.85/5.0** |
| **Final Score** | | | **5.00/5.0** |

The optional age and sustained-TVL modifiers do not apply. The governance gate sets the final score to 5.00.

### Risk Tier

**Final Risk Tier: High Risk (GATED).** The 5.00/5.0 score is in the 4.50–5.00 tier. Yearn supply to a USDM-collateral Morpho market is not recommended at this snapshot.

## Reassessment Triggers

- **Time-based.** Refresh this assessment within 60 days if a market proposal remains active, and before any Yearn allocation.
- **TVL-based.** Reassess if TVL moves more than 25% from the snapshot or the share of backing available for immediate exits materially changes.
- **Incident-based.** Reassess after a loss, material depeg, backing below 100%, unfunded matured redemptions, a custody or role change, a transfer pause, or a change in eligible backing assets.
- **Market readiness.** Reassess once an independent, deployable price feed, debt-sized executable liquidity and stronger governance safeguards can be verified.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [November 18, 2026](https://github.com/yearn/risk-score/pull/604) | 5.00 | Initial assessment of USDM as Morpho collateral. Governance gate applied. |
