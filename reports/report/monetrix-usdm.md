# Protocol Risk Assessment: Monetrix USDM

- **Assessment Date:** November 18, 2026
- **Token:** Monetrix USD (USDM)
- **Chain:** HyperEVM
- **Token Address:** [`0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377`](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377)
- **Final Score: 5.00/5.0**
- **Status:** GATED — score capped by the "total centralization" critical gate (2-of-3 Foundation Safe can self-grant UPGRADER and upgrade USDM without delay); ungated weighted score is 3.87 (Elevated). No realized loss event.

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

**Snapshot.** HyperEVM chain ID 999, [block 51,588,528](https://hyperevmscan.io/block/51588528), November 18, 2026 at 11:02:51 UTC, hash `0x5c21c10fa674371901b614d4e5b6b669fb24f5a621fd45da94c87a67ae53b29c`. Live Core Info and precompile reads taken outside that block have separate timestamps.

## Audits and Due Diligence Disclosures

Code4rena reviewed Monetrix between April 24 and May 4, 2026 and published its report on May 26. The contest covered 20 contracts and reported one medium finding and zero high findings. The architecture spans upgradeable tokens and escrow contracts, a shared access controller, and a portfolio-margin account on a separate execution environment. Several key checks depend on interactions across those components. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [public contest source](https://github.com/code-423n4/2026-04-monetrix), [Monetrix contract inventory](https://doc.monetrix.xyz/risk-and-security/audits-and-contracts).

The deployed Accountant nets USDC borrowing for registered portfolio-margin accounts. The M-01 liability omission remains possible because any `OPERATOR` can remove a supplied-asset entry without checking for outstanding debt. Removing a net-borrowed USDC entry omits the liability from `totalBackingSigned()` and can inflate the surplus available for yield settlement. Settlement still requires EVM USDC and remains subject to the minimum settlement interval and annualized cap. Non-USDC supplied balances are counted gross. The original snapshot recorded zero borrow against the supplied HYPE and UBTC entries. The Vault still emits no dedicated event for changes to the multisig-routing flag. TODO confirm audit coverage of the deployed instant exits and governance wiring, and reassess the accounting if non-USDC borrow assets are enabled. [Code4rena findings](https://code4rena.com/reports/2026-04-monetrix), [deployed Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [deployed Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

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
| Vault Core account | [MonetrixVault on Core](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) | HyperCore account controlled through the Vault |
| Settlement asset and transport | [Native USDC](https://hyperevmscan.io/address/0xb88339CB7199b77E23DB6E890353E22632Ba630f), [CoreDepositWallet](https://hyperevmscan.io/address/0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24) | [Circle source](https://github.com/circlefin/hyperevm-circle-contracts) |

### Accessibility

Any account can deposit native USDC to mint USDM or request redemption of its USDM while the relevant contracts are unpaused. Deposit is an atomic 1:1 exchange. Standard redemption takes a request and an owner-initiated claim after the configured 48-hour cooldown. The standard path pays USDC at par without a protocol redemption fee, subject to escrow funding. The atomic redemption path has a 100 USDM minimum, a 30 bp fee, a finite USDC buffer and a cap of 256 pending replenishment requests. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

### Token Mint Authority

**Mint mechanism:** USDM authorizes the current `vault()` through `onlyVault`. The deployed Vault mints on permissionless deposits and during operator-initiated yield distribution. `setVault` is one-shot and reverts with `VaultAlreadySet` once a Vault is designated, so `GOVERNOR` cannot reassign the minter. Mint authority changes only through a USDM or Vault proxy upgrade, which requires `UPGRADER`. The Core–EVM transport moves backing USDC and has no USDM mint role. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

**Mint requires backing:** The current Vault paths require USDC from the depositor or YieldEscrow. The token's mint check enforces only the caller address and has no token-level backing check or supply cap. An upgraded USDM or Vault implementation could therefore mint without backing. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

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
| Reported signed backing | 2,873,282.51 USDC |
| HyperEVM Vault USDC | 1,164.55 USDC |
| HyperEVM RedeemEscrow USDC | 71,823.58 USDC |
| Reported net HyperCore backing, inferred from the remainder | 2,800,294.38 USDC |
| Reported backing / supply | **100.49%** |
| InsuranceFund, excluded from backing | 11,523.94 USDC |

Archive reads reproduced USDM supply and the EVM balances. The queued claims of 72,229.08 USDC corresponded to 72,229.08 USDM still held by the Vault and included in supply. RedeemEscrow showed a 405.50 USDC shortfall relative to those claims. The separate InsuranceFund covered about 0.40% of outstanding supply at face value and can be withdrawn by governance. The original assessment's backing mark implies a 13,968.68 USDC surplus. DeFiLlama reported about $2.87M for November 18 using the same Accountant. TODO recover the timestamped Accountant output and Core inputs for the exact mark and the net backing of each Core account. The archive RPCs tested could serve EVM state at the snapshot, but the historical HyperCore precompile read reverted. [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [original backing figures](https://github.com/yearn/risk-score/blob/535d2e55e754b0d4eb40e3c659a27ba8c17f7a23/reports/report/monetrix-usdm.md#L87-L101), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm), [HyperEVM RPC documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/json-rpc).

The two HyperCore accounts together represented 97.46% of the reported mark. The custody account held predominantly HYPE exposure, with a smaller BTC leg and USDC borrowing. The original assessment recorded about 108K USDC supplied in the Vault's own Core account and zero HLP equity in both accounts. The live Core Info API at 11:05 UTC showed short positions broadly matching the HYPE and BTC exposure on the custody account. Those offsets leave exposure to spot–perp basis, execution, funding, liquidation and auto-deleveraging, especially given the HYPE concentration. HyperCore enforces margin and liquidation for the strategy. Monetrix governance sets the Vault's deposit cap, supported hedge assets and settlement parameters. Minting and redeeming at par support peg arbitrage while the protocol operates and exits are funded. [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [Vault Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11), [HyperCore portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin), [Monetrix ADL design](https://doc.monetrix.xyz/risk-and-security/anti-adl-shield), [MonetrixConfig](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract).

### Provability

Anyone can compare `totalBackingSigned()` with USDM `totalSupply()` and reconcile EVM balances and Core positions through the precompiles. The Accountant excludes the insurance and undistributed yield reserves and values the portfolio at HyperCore marks. Its result depends on an operator-editable registry. On November 20, 2026 at 18:57 UTC, the custody account's USDC entry was registered and the supplied-balance precompile (`0x811`, token index `0`) showed about 1.51M USDC borrowed and zero supplied. At those balances, removing the entry would increase reported backing by about 1.51M USDC. Removing an entry with a positive position can lower the mark. Compare the full Core assets and liabilities with the Accountant's registries before relying on the mark. TODO verify an independent reserve attestation or separately maintained full-portfolio reconciliation. [Accountant source and precompile definitions](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

An operator proposes periodic strategy P&L for settlement. The Vault and Accountant check EVM USDC, eligible surplus, elapsed time and the annualized cap. At the snapshot, Config split distributed yield 75% to stakers, 10% to insurance and 15% to the Foundation when sUSDM had outstanding shares. Share conversion is public through `sUSDM.convertToAssets()`, which returned about 1.0412 USDM per sUSDM after decimal normalization. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).

## Liquidity Risk

A regular redemption locks USDM, starts a 48-hour cooldown and burns the tokens when the owner claims USDC. The request is fixed at par and earns no yield while pending. Each request matures independently. Owners can claim matured requests in any order while the escrow has enough USDC. Escrow funding depends on available EVM balances and successful Core withdrawals and unwinds. The guide describes a three-day cooldown and burning on request, while the deployed Vault and Config establish the live behavior. InstantRedeem had 2,846.29 USDC available across users and pays from that buffer before replenishing through the delayed route. [Redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [RedeemEscrow code](https://hyperevmscan.io/address/0x17100f8cafd727550bb32e6f1496d463da6d978f#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

| USDM input | Direct Hybra V4, USDC out | Direct discount to par | InstantRedeem, USDC out |
|---:|---:|---:|---:|
| 100 | 99.88 | 0.116% | 99.70 |
| 1,000 | 998.83 | 0.117% | 997.00 |
| 2,500 | 2,497.06 | 0.118% | 2,492.50 |
| 10,000 | 9,987.63 | 0.124% | Buffer too small |
| 25,000, 50,000 and 100,000 | 24,731.57, partial fill | 0.171% on 24,774.03 USDM of input | Buffer too small |

The quotes use snapshot state, include route fees and exclude gas. The V4 router can leave some input unswapped. Its exact-input output plateaued at 24,731.57 USDC, and the V4 quoter required 24,774.03 USDM for the same exact output, a 0.171% discount on the filled portion. The V4 quoter returned 7,963.82 USDC for a 10,000 USDM input request through the two WHYPE pools with tick spacing 50. Full execution of that route remains unverified. A separate Hybra V3 USDM/USDC pool held 551.19 USDC at the snapshot. A large holder relying on the quoted routes would need delayed redemption or additional liquidity. The Hybra DEX is built by the same team as Monetrix. TODO quote the V3 pool and measure aggregate full-fill depth, LP concentration including issuer-affiliated liquidity, and liquidity during the historical discounts. [Direct V4 pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3), [V4 router](https://hyperevmscan.io/address/0xBEC2BF10B7172C8E5621569BD285E9ADB1806426), [V4 quoter](https://hyperevmscan.io/address/0x8CD6acfF822eE9E3240501b3CeDa64364791e4E2), [USDM/WHYPE pool](https://hyperevmscan.io/address/0xC263eD5351816e2f348c520B208a00383f563E32), [WHYPE/USDC pool](https://hyperevmscan.io/address/0x4C3078122fE4F946A6Dd3bFF487C19661DeA9314), [direct V3 pool](https://hyperevmscan.io/address/0xcC3F48fB9Cb724759a07d6D12Aa85f75EC045a16).

## Centralization & Control Risks

### Governance

The shared access controller is UUPS upgradeable through `DEFAULT_ADMIN_ROLE`. The other Monetrix proxies in scope use `UPGRADER`. The Foundation Safe is 2-of-3 with no verified public attribution for the owners, no enabled Safe modules and no guard at the snapshot. It directly holds `DEFAULT_ADMIN_ROLE`, `GOVERNOR` and `GUARDIAN`. The 24-hour timelock also holds `GOVERNOR`, and the 48-hour timelock is the sole current `UPGRADER` holder. The Foundation Safe administers both timelocks alongside each timelock itself and holds proposer, executor and canceller on both. The same Safe can make direct governor changes and grant roles through the controller. `GUARDIAN` administers `OPERATOR`, and four EOAs, with no contract code at the snapshot, held that operator role. These assignments were reconstructed from role events through the snapshot and checked with `hasRole`. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [24-hour timelock](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF#readContract), [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e#readContract).

The current USDM implementation exposes a global pause that covers ordinary transfers, minting and burning. The reviewed implementation has no per-holder freeze or seizure function. Upgrade authority still gives governance material control over the token and its backing. In the [access controller source](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code), `UPGRADER` is administered by `DEFAULT_ADMIN_ROLE`, which the Foundation Safe holds directly. The Safe can grant itself `UPGRADER` and upgrade any Monetrix proxy in the same 2-of-3 approval flow, so the 48-hour upgrade timelock is not binding. [USDM source](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|---|---|---|---|
| Proxy upgrades of USDM, the Vault, sUSDM, escrows and the access controller, including mint authority | [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) through direct `DEFAULT_ADMIN_ROLE`. It upgrades the access controller directly and can grant itself `UPGRADER` for every other Monetrix proxy. | 2-of-3 with no mandatory delay. The 48-hour timelock holds `UPGRADER`, and the Safe can grant the role directly. | Unbounded unbacked USDM issuance, EVM USDC in the Vault and escrows, 2.568M USDM held by the [sUSDM proxy](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF), and the Vault's Core account. |
| Vault Core actions and routing through `emergencyRawAction`, `emergencyBridgePrincipalFromL1`, `setMultisigVault`, `setAccountant`, `setRedeemEscrow` and `setYieldEscrow` | Foundation Safe through direct `GOVERNOR`. The Vault source names the 24-hour timelock as the intended guard for the emergency functions, but the Safe also holds `GOVERNOR` directly. | 2-of-3 with no mandatory delay. `emergencyRawAction` forwards any CoreWriter action from the Vault's Core account, including spot sends to an arbitrary destination and adding an API wallet, and ignores both pause flags. | Vault's Core account, with about 108K USDC supplied in the original assessment. Future deposits and escrow funding can be redirected. TODO reconcile the Vault's net Core balance at the snapshot. |
| HyperCore backing custody and withdrawals | [Native Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), separate from the Foundation Safe. | 2-of-3 per live Core Info state, with one signer overlap. HyperCore margin and settlement govern funds available for withdrawal. | The custody account's portion of combined Core backing, predominantly HYPE and BTC hedges. TODO verify the account's net marked balance at the snapshot. |
| Vault strategy, settlement and redemption operations | Four `OPERATOR` EOAs hold authority individually. The Core custody account separately delegates trading. | One signer with no mandatory delay. `executeHedge`, `closeHedge` and `repairHedge` enforce the configured asset allowlist and accept caller-supplied prices. The trades have no oracle price bound or cumulative loss cap. Operators can also enable HLP deposits and route Vault funds into HLP. TODO verify the Core agent's exact permissions. | The Vault's Core account through off-market fills or HLP exposure. |
| [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) supplied-asset registries | Any of the four `OPERATOR` EOAs can add custody entries and remove entries for either Core account. | One signer with no mandatory delay. Removal checks the index and can omit a position with an outstanding balance. Yield settlement is subject to the minimum interval, annualized cap and available EVM USDC. | Marked backing, settlement surplus and any downstream pricing that relies on the Accountant. A November 20 read measured 1.51M USDC net debt in the registered custody entry. |
| RedeemEscrow, YieldEscrow and staking escrow releases | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) controls the USDC escrows. [sUSDM](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF) controls the staking escrow. Ultimate authority follows governance of the two proxies. | The current claim paths enforce ownership and cooldowns. Ordinary redemption escrow reclamation is limited to USDC above pending obligations. | 71,823.58 USDC in RedeemEscrow, 78,900.67 USDM in the staking escrow and zero USDC in YieldEscrow at the snapshot. |
| USDM and sUSDM transfers, Vault activity and bridge retention | Foundation Safe through `GUARDIAN`. | 2-of-3 with no mandatory delay. The transfer pause includes collateral delivery in liquidations. | USDM exits, sUSDM withdrawals and Morpho collateral delivery. |
| Insurance and instant-exit reserves, fees and recovery destinations | Foundation Safe through direct `GOVERNOR`. The ordinary operator replenish path follows configured destinations. | 2-of-3 with no mandatory delay on governor actions. | 11,523.94 USDC insurance, 2,846.29 USDC instant redeem buffer, and the separate instant unstake buffer. |
| Native USDC and CoreDepositWallet permissions | Circle token pause, blacklist and upgrade authorities. CoreDepositWallet has owner, pauser, rescuer and upgrade admin roles. | Separate role holders for the Core wallet at the snapshot. TODO verify offchain approval requirements supporting Circle's roles. | USDC transfers and availability of Core settlement and return flows. |

**Weakest material paths.** Any one of the four `OPERATOR` EOAs can cause material loss in the [Vault's Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) through repeated trades at caller-set prices. The asset allowlist limits what they can trade, and there is no mandatory delay, oracle price bound or cumulative loss cap. This is the path with the fewest approvals. Operators can separately distort the backing mark by altering the Accountant's registries. [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Accountant code](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code).

The [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) has the broadest authority at 2-of-3 with no mandatory delay. Through `DEFAULT_ADMIN_ROLE` it can grant itself `UPGRADER`, enable unbounded unbacked minting, and reach the approximately 73K USDC held by the Vault and RedeemEscrow and 2.568M USDM held by sUSDM at the snapshot. Through direct `GOVERNOR` it can move the Vault's Core balances and redirect future bridged deposits. The separate native 2-of-3 Core custody multisig controls the custody account's share of the reported 2.80M USDC in combined Core backing. TODO verify the account-level split and the delegated Core agent's permitted actions and turnover limits. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [sUSDM code](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code), [access controller code](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code), [CoreWriter actions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore multisig reference](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/multi-sig).

### Programmability

The EVM contracts execute minting, track redemption claims, enforce funding and cooldown checks and calculate sUSDM's exchange rate from onchain balances. Operators decide when to trade, move USDC between environments, fund the queue and settle yield. Since yield starts with an operator-proposed amount, the published sUSDM rate can lag strategy P&L between distributions. The protocol also relies on Core custody operations and asynchronous execution for withdrawals from deployed backing. A successful EVM request alone establishes no guarantee that the corresponding Core operation has settled. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code), [HyperCore execution documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

### External Dependencies

HyperCore order execution, portfolio margin, balance precompiles and Core–EVM transfers serve both the strategy and its redemption pipeline. Circle's native USDC and CoreDepositWallet handle the settlement asset. The vault uses the local `depositFor` and Core return path. This is an underlying USDC transport dependency, and the reviewed path stays within Hyperliquid. A halt or impairment can trap marked backing away from the EVM escrow. [Circle native USDC](https://www.circle.com/multi-chain-usdc/hyperevm), [Circle contract source](https://github.com/circlefin/hyperevm-circle-contracts), [L2BEAT contract discovery](https://disco.l2beat.com/ui/p/hyperliquid), [HyperCore transfer documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers).

The Accountant uses HyperCore oracle prices and balance precompiles for its strategy marks. Required reads can revert, and the assessed implementation has no independent price fallback. The Accountant is UUPS upgradeable, and its Config and accepted asset registry can change through governance. Funded EVM balances can cover some redemptions during a Core disruption. Their snapshot size makes that a limited backstop. The proposed Morpho oracle would be a separate dependency. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

## Morpho USDM/USDC Oracle and Market Design

**Market decision.** Keep the Yearn supply cap at zero pending a stronger governance and custody setup, larger independently available immediate liquidity and an audited price feed. A USDM transfer pause can block collateral delivery during liquidation under any price design. An oracle cannot make delayed Core backing liquid, prevent governance changes, or remediate token transfer restrictions. Existing Yearn usage or approval is TODO. Issue #603 requests an assessment. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho liquidation](https://docs.morpho.org/learn/concepts/blue/liquidation/), [issue #603](https://github.com/yearn/risk-score/issues/603).

**Pricing for a future pilot.** Use a direct, independently governed USDM/USDC feed with minimum liquidity and observation requirements, or a USDM/USD feed divided by a separately validated USDC/USD feed. Require a live debt-sized liquidation quote and sufficient depth to support those feeds. Use conservative net backing per USDM as a one-sided ceiling alongside market price and par only after independently reconciling the full assets and liabilities of both Core accounts and the Vault's EVM backing. Treat `totalBackingSigned()` as a diagnostic because a single operator can change the registry that determines which positions and liabilities it counts. A fall in either the confirmed market price or independently reconciled net backing must be able to reduce the reported value. Treat isolated weak DEX prints as alerts pending independent confirmation. The current Hybra spot price or an uncorroborated TWAP relies on shallow liquidity and should carry no standalone pricing authority. InstantRedeem's 0.997 USDC payout applies only when its buffer is funded and the exit path is operational. TODO identify and verify an independent production feed and a credible secondary input before deployment. [Morpho oracle reference](https://docs.morpho.org/developers/contracts/oracles/), [Oracle deployment guidance](https://docs.morpho.org/curate/tutorials-market-v1/deploying-oracle/), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

Implement and test bounded feed age, confidence and deviation checks and exercise stale-feed and backing-read failures before supply. An oracle revert can block liquidation as well as new borrowing. A blind zero price can create wrongful liquidations. Use an independently validated fallback only while it remains within its freshness and confidence bounds, and document joint failure handling before deployment. Morpho market parameters are fixed. Replacing an unsuitable oracle address requires a new market and a migration. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho oracle risks](https://docs.morpho.org/learn/concepts/oracle/).

**Units and sizing.** Both USDM and native USDC have six decimals. The oracle should return `floor(USDC_per_USDM × 10^36)`. Par is `10^36`, and 0.97 USDC per USDM is `97 × 10^34`. For any later pilot select an enabled LLTV only after stressing depeg, gas, slippage, funding and delayed reserve availability. For example, with a 77% LLTV the Blue liquidation incentive multiplier is about 1.074. Liquidators need an executable exit above roughly 93.1% of the oracle mark to cover repayment before gas. At a fixed $1 mark, an executable $0.90 exit leaves liquidation uneconomic even if a borrower is otherwise eligible. Model concurrent borrower liquidations and size aggregate exposure against the smallest stressed executable route. [Morpho oracle units](https://docs.morpho.org/developers/contracts/oracles/), [Morpho liquidation math](https://docs.morpho.org/learn/concepts/blue/liquidation/).

## Operational Risk

Monetrix is built by the Hybra team, whose leads identify themselves by public aliases. Hybra publishes its own audits and deployment records. The same team's Hybra DEX hosts the only direct USDM/USDC route quoted in this report, so the main secondary exit venue is affiliated with the issuer. Monetrix provides security, architecture and user documentation, but the descriptions of delegated operation, cooldown and burn timing need to be reconciled with the deployment. The public terms and security materials give limited detail on the legal entity and on tested incident procedures. TODO confirm the governing entity and jurisdiction, and obtain the incident runbook and evidence of exercises or prior use. [Monetrix team](https://doc.monetrix.xyz/team/team), [Monetrix terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design), [Hybra audit and contract records](https://hybra-foundation.gitbook.io/hybra-foundation/security/contracts).

## Monitoring

| Frequency | Contracts and signals | Trigger |
|---|---|---|
| On each change | [AccessController](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events) role events and `hasRole()`, [24-hour](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF) and [48-hour timelocks](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e) schedule and execution events and `getMinDelay()`, [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) threshold and modules, proxy `Upgraded` on every Monetrix proxy, and AccessController `RoleGranted` for `UPGRADER`, `GOVERNOR` or `DEFAULT_ADMIN_ROLE` to any address other than the two timelocks. | Reassess any change in threshold, role authority, implementation or minimum enforced delay. Escalate immediately if the Foundation Safe or any non-timelock account receives `UPGRADER`. |
| On each change | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#events) `EmergencyActionSent`, `PrincipalBridgedFromL1`, `MultisigVaultUpdated`, `AccountantUpdated`, `RedeemEscrowUpdated`, `YieldEscrowUpdated`, `OperatorPaused`, `PmEnabledUpdated`, `HlpDepositEnabledUpdated` and `HlpDeposited`. [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#events) and [InstantUnstake](https://hyperevmscan.io/address/0xaaCE6A69C27dF3F92763F688606335cBf3CE329d#events) `BufferWithdrawn`, `FeeBpsUpdated` and `RecoveryRecipientUpdated`, and [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106#events) `Withdrawn`. | Escalate emergency actions, routing or accounting replacements, reserve withdrawals and new HLP exposure. |
| On each registry change | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#events) `VaultSuppliedRegistered`, `VaultSuppliedRemoved`, `MultisigSuppliedRegistered` and `MultisigSuppliedRemoved`. Read `vaultSuppliedLength()` and `multisigSuppliedLength()`, then compare each registry entry from `vaultSupplied(index)` and `multisigSupplied(index)` with both Core accounts' balances and debt. | Escalate any deletion immediately. Flag any outstanding balance or debt omitted from the backing mark. |
| Hourly and on large flows | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) `totalBackingSigned()` vs USDM `totalSupply()` and independently reconciled backing. Track margin, borrow balances, hedge delta and withdrawals for the [custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200) and [Vault Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11). Track custody signer and agent changes via Core Info. | Investigate backing below 100%, differences in liabilities counted, failed reads, an unhedged material leg, changed Core authorization or a failed Core return. |
| Hourly and before any allocation | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) and USDM `paused()`, [RedeemEscrow](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578) `totalOwed()` and `shortfall()`, [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32) `bufferBalance()` and `pendingReplenishCount()`, and [Hybra](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3) debt-sized full-fill quote. | Reassess a pause, rising shortfall, any matured unfunded claim or an executable exit below liquidation break-even. |
| Daily | [Config](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee) caps, registry and cooldowns. Check Vault `multisigVault()` and `multisigVaultEnabled()`, and [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106) `balance()` divided by USDM supply. | Reassess a new borrowing leg, changed custody route, material drift in collateral allocation or any insurance drawdown. |

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
  MonetrixVault → CoreDepositWallet → Core custody account
                                   ↘ Vault's own Core account
  Core custody account → HYPE / BTC basis and USDC borrow/lend
  Vault's Core account → USDC supply and Core–EVM return path
  HyperCore balance and price precompiles → MonetrixAccountant

Governance
  Foundation Safe → AccessController → token, Vault and escrow permissions
  Foundation Safe → 24h / 48h timelocks → governance and upgrades
  HyperCore multisig and delegated agent → Core custody account
  Foundation Safe and Vault operators → Vault's own Core account
```

## Risk Summary

### Key Strengths

- Permissionless deposits transfer native USDC and mint matching USDM in the same transaction.
- Verified deployed code and Core state allow public reconciliation of reserves and supply.
- Separate redemption escrow and a funded instant buffer provide two protocol exit paths.
- Code4rena reviewed the core system. The live Accountant nets registered USDC portfolio-margin debt.

### Key Risks

- The two Core accounts together accounted for 97.46% of the reported backing mark. Both depend on HyperCore execution, portfolio margin and the USDC return path.
- The strategy is concentrated in HYPE basis exposure. Basis divergence, negative funding, liquidation or auto-deleveraging can reduce backing.
- The 48-hour redemption cooldown and limited immediate exit depth constrain liquidation size. The direct Hybra V4 route capped at 24,731.57 USDC for about 24,774.03 USDM of input.
- A transfer pause can block collateral delivery in Morpho. A proposed market also needs a price feed that responds to a depeg and a deterioration in backing.

### Critical Risks

- The Foundation Safe has 2-of-3 authority over mint and protocol governance without a mandatory delay. It can grant itself `UPGRADER` and bypass the 48-hour upgrade timelock, reaching the 2.568M USDM held by sUSDM at the snapshot. It also controls the Vault's own Core account through `emergencyRawAction`. A separate native 2-of-3 account controls the main Core custody portfolio, with one signer overlap.
- Each of four operator EOAs can trade from the Vault's Core account at caller-set limit prices without an oracle bound or cumulative loss cap, or remove an Accountant registry entry and materially distort the backing mark. Independent cumulative loss limits for delegated Core execution remain unverified.

## Risk Score Assessment

Scores use the November 18 snapshot and the published Yearn rubric. The category-weighted score describes the underlying risk before the governance gate is applied.

### Critical Risk Gates

- [x] **Unverified contract source** -> **PASS** — The USDM proxy and its active implementation have verified source. [USDM proxy](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377#code), [active implementation](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).
- [x] **No audit** -> **PASS** — Code4rena reviewed the core system. Coverage of later components and changes is evaluated under Category 1. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix).
- [x] **Unverifiable reserves** -> **PASS** — EVM balances and live Core assets and liabilities are publicly readable. Independent reconciliation requires checking those balances against the operator-editable registry. The historical Core split at the assessment block remains TODO. [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [HyperCore reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).
- [ ] **Total centralization** -> **TRIGGERED** — Applied under the Governance rubric's "EOA or <3 signers" row. The 2-of-3 Foundation Safe holds a no-delay path to unbacked minting, and the native 2-of-3 Core multisig holds most backing. The four operator EOAs independently meet the EOA condition because they set loss-causing trade limit prices without an oracle bound. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Critical gate "Total centralization" is triggered.** Per the scoring framework the final score is capped at 5.00; the category-weighted score of 3.87 is recorded for comparability.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 3.5/5.** One public Code4rena review covers the core system. The deployed system has complex EVM–Core interactions. Post-contest coverage and an active bounty remain unverified. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design).

**Subcategory B: Historical Track Record — 4.0/5.** About five months in production and TVL below $10M. The observed price series includes brief discounts, and verified stress-period exit depth is pending. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm), [DefiLlama peg chart](https://defillama.com/stablecoin/monetrix-usdm).

**Score: 3.75/5** — (3.5 + 4.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0/5.** One operator EOA can cause material trading losses in the Vault's Core account. The Foundation Safe's 2-of-3 approvals reach direct `GOVERNOR` powers and role administration without either timelock. The direct withdrawal path from the separate Core custody account uses its native 2-of-3 authorization. [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Programmability — 3.5/5.** Minting, claim checks and sUSDM conversion are calculated onchain. Trading, replenishment and yield settlement depend on active operator decisions and Core execution. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code).

**Subcategory C: External Dependencies — 4.5/5.** HyperCore outage or impairment can disrupt order execution, backing reads and the return of USDC from the same portfolio. Circle's USDC and settlement infrastructure add a second critical dependency. The score stops short of 5.0 because HyperCore is an established venue and funded EVM balances can still pay some redemptions during a Core disruption. This is consistent with the Hyperliquid dependency scoring in the [d2-hypeplus](https://github.com/yearn/risk-score/blob/master/reports/report/d2-hypeplus.md) and [unit-ubtc](https://github.com/yearn/risk-score/blob/master/reports/report/unit-ubtc.md) reports. [HyperCore execution documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [Circle contracts](https://github.com/circlefin/hyperevm-circle-contracts).

**Score: 4.33/5** — (5.0 + 3.5 + 4.5) / 3.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.0/5.** The reported mark covered 100.49% of outstanding USDM, with about 97% of the mark across both Core accounts. The main portfolio is in the native 2-of-3 custody account, which places the backing in the rubric's custodial band. The narrow reported buffer and concentration in actively managed, leveraged HYPE basis positions make realized coverage sensitive to unwinds and margin. TODO recover per-account and aggregate historical Core values. [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Provability — 2.5/5.** Live backing inputs and Core marks are public. Reconciliation also requires checking the operator-editable registries against both accounts' full assets and liabilities. DeFiLlama uses the same Accountant, and a separate reserve attestation remains unverified. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

**Score: 3.25/5** — (4.0 + 2.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 4.50/5** — The standard exit requires a two-day cooldown and sufficient escrow funding at claim. Verified immediate depth is small relative to liabilities, the instant buffer is discretionary, and large exits depend on timely Core returns. No stress-performance adjustment was applied. [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract), [direct Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

#### Category 5: Operational Risk (Weight: 5%)

**Score: 3.50/5** — The Hybra team has public aliases and publishes protocol documentation. Material live-state discrepancies remain, and the legal entity, jurisdiction and tested incident procedures are unverified. [Team](https://doc.monetrix.xyz/team/team), [terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem).

### Final Score Calculation

| Category | Score | Weight | Weighted |
|---|---:|---:|---:|
| Audits & Historical | 3.75 | 20% | 0.750 |
| Centralization & Control | 4.33 | 30% | 1.300 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 4.50 | 15% | 0.675 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Category-weighted score** | | | **3.87/5.0** |
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
