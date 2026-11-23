# Protocol Risk Assessment: Monetrix USDM

- **Assessment Date:** November 18, 2026
- **Token:** Monetrix USD (USDM)
- **Chain:** HyperEVM
- **Token Address:** [`0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377`](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377)
- **Final Score: 5.00/5.0**
- **Status:** GATED — score capped by the "total centralization" critical gate (2-of-3 Foundation Safe can self-grant UPGRADER and upgrade USDM without delay); ungated weighted score is 3.88 (Elevated). No realized loss event.

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

Code4rena reviewed Monetrix between April 24 and May 4, 2026 and published its report on May 26. The contest covered 20 contracts and reported one medium finding and zero high findings. Its scope included the access controller and shared upgrade logic. The deployed controller adds `GUARDIAN` as the administrator of `OPERATOR`, and the Foundation Safe's direct grants differ from the contest's timelock assumptions. InstantRedeem and InstantUnstake were outside the published scope. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [contest scope](https://github.com/code-423n4/2026-04-monetrix/blob/3d94be1361ca01d959f9165a78f0d75c5657fe3e/scope.txt), [contest governance assumptions](https://github.com/code-423n4/2026-04-monetrix/blob/3d94be1361ca01d959f9165a78f0d75c5657fe3e/README.md#L202-L211), [deployed access controller](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code), [Monetrix contract inventory](https://doc.monetrix.xyz/risk-and-security/audits-and-contracts).

The deployed Accountant nets USDC borrowing for registered portfolio-margin accounts. The M-01 accounting risk persists because an operator can remove a registered liability from the backing calculation. The Accountant counts supplied HYPE and UBTC gross. The assessment snapshot recorded no borrow against those two entries. Monitor for new non-USDC borrowing and changes to the Vault's multisig-routing flag, which has no dedicated event. [Code4rena findings](https://code4rena.com/reports/2026-04-monetrix), [deployed Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [deployed Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

### Bug Bounty

Monetrix has no active bug bounty. Its security page describes a bounty as planned after launch. Monetrix is not enrolled in SEAL Safe Harbor. Its documentation still lists responsible-disclosure channels as pending mainnet launch and directs critical reports to its general contact channels. [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design), [Monetrix contact channels](https://doc.monetrix.xyz/resources/resources), [SEAL Safe Harbor](https://safeharbor.securityalliance.org/).

## Historical Track Record

- **Time in production and TVL.** USDM was deployed on June 10, 2026 UTC. DefiLlama recorded $1.19M on June 11, a $3.13M peak on October 7 and $2.87M on November 18, roughly 8% below peak after five months of live history. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm).
- **Staking concentration.** At the snapshot, the sUSDM staking contract held 2.568M USDM, approximately 89.8% of outstanding supply. [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).
- **Peg history.** CoinGecko's 143 daily observations from June 29 through November 18 ranged from $0.9772 on August 20 to $1.0087 on July 12. Three daily observations were below $0.99. Hourly observations over the same period ranged from $0.9755 on November 15 at 03:00 UTC to $1.0206 on July 31 at 20:00 UTC. [CoinGecko price history](https://www.coingecko.com/en/coins/monetrix-usd/historical_data).
- **Security incidents.** The reviewed public sources did not identify a realized Monetrix USDM loss or postmortem through November 23, 2026. [Monetrix security disclosures](https://doc.monetrix.xyz/risk-and-security/security-design), [DefiLlama incident register](https://defillama.com/hacks).

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

Archive reads reproduced USDM supply and the EVM balances. The queued claims of 72,229.08 USDC corresponded to 72,229.08 USDM still held by the Vault and included in supply. RedeemEscrow showed a 405.50 USDC shortfall relative to those claims. The reported backing mark was 13,968.68 USDC above supply. The separate InsuranceFund held 11,523.94 USDC, about 0.40% of supply, and governance decides whether to use it to cover losses. The reported mark is the Accountant's `totalBackingSigned()` at the snapshot block. Its HyperCore inputs come from precompiles, and the configured HyperEVM RPCs return current state for past blocks, so this review could not reproduce the pinned read. The Core total is the amount implied by that mark. DefiLlama's $2,871,263 for November 18, read from the same Accountant, agrees within 0.1%. [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [InsuranceFund source](https://hyperevmscan.io/address/0xf93564ce88fa07d2d84953edb12b4f4262685233#code), [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm).

The two HyperCore accounts together represented 97.46% of the reported mark. The custody account held predominantly HYPE exposure, with a smaller BTC leg and USDC borrowing. The Vault's own Core account ledger nets to 108,050.25 USDC supplied at the snapshot: 140,277.53 USDC supplied on November 10 less later withdrawals. Core Info returned no HLP equity for either account on November 23. The live Core Info API at 11:05 UTC showed short positions broadly matching the HYPE and BTC exposure on the custody account. Those offsets leave exposure to spot–perp basis, execution, funding, liquidation and auto-deleveraging, especially given the HYPE concentration. HyperCore enforces margin and liquidation for the strategy. Monetrix governance sets the Vault's deposit cap, supported hedge assets and settlement parameters. Minting and redeeming at par support peg arbitrage while the protocol operates and exits are funded. [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [Vault Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11), [Core Info ledger and vault-equity reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint), [HyperCore portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin), [Monetrix ADL design](https://doc.monetrix.xyz/risk-and-security/anti-adl-shield), [MonetrixConfig](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract).

### Provability

Anyone can compare `totalBackingSigned()` with USDM `totalSupply()` and reconcile EVM balances and Core positions. The Accountant counts Core USDC debt through a registry that operators can edit. Removing the USDC entry hides the debt from the backing figure. HyperCore still records and enforces the debt. At 12:29 UTC on November 23, the registered custody account owed about 1.67M USDC net. Omitting that entry would overstate backing by the same amount. Actual backing can fall if the Vault uses that false surplus to pay out principal as yield. Yield settlement still requires available EVM USDC and is limited by the settlement interval and annualized cap. DefiLlama's TVL uses the same Accountant. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Vault settlement source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

An operator proposes periodic strategy P&L for settlement. The Vault and Accountant check EVM USDC, eligible surplus, elapsed time and the annualized cap. At the snapshot, Config split distributed yield 75% to stakers, 10% to insurance and 15% to the Foundation when sUSDM had outstanding shares. Share conversion is public through `sUSDM.convertToAssets()`, which returned about 1.0412 USDM per sUSDM after decimal normalization. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).

## Liquidity Risk

A regular redemption locks USDM, starts a 48-hour cooldown and burns the tokens when the owner claims USDC. The request is fixed at par and earns no yield while pending. Each request matures independently. Owners can claim matured requests in any order while the escrow has enough USDC. Escrow funding depends on available EVM balances and successful Core withdrawals and unwinds. The guide describes a three-day cooldown and burning on request, while the deployed Vault and Config establish the live behavior. InstantRedeem had 2,846.29 USDC available across users and pays from that buffer before replenishing through the delayed route. [Redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [RedeemEscrow code](https://hyperevmscan.io/address/0x17100f8cafd727550bb32e6f1496d463da6d978f#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

| USDM input | Direct Hybra V4, USDC out | Direct discount to par | InstantRedeem, USDC out |
|---:|---:|---:|---:|
| 1,000 | 998.83 | 0.117% | 997.00 |
| 10,000 | 9,987.63 | 0.124% | Buffer too small |
| 50,000 | 24,731.57, partial fill | 0.171% on 24,774.03 USDM of input | Buffer too small |
| 100,000 | 24,731.57, partial fill | 0.171% on 24,774.03 USDM of input | Buffer too small |

The quotes use snapshot state, include route fees and exclude gas. The V4 router can leave some input unswapped. Its exact-input output plateaued at 24,731.57 USDC, and the V4 quoter required 24,774.03 USDM for that output. The route through the two WHYPE pools with tick spacing 50 is not a full fill: its output plateaued at 7,963.82 USDC, which the V4 quoter reached with about 9.02K USDM of input. A 5,000 USDM sale on that route returned 4,736.14 USDC, 5.3% below par. A separate Hybra V3 USDM/USDC pool held 551.19 USDC. A large holder relying on these routes would need delayed redemption or additional liquidity. The Hybra DEX is built by the same team as Monetrix. **LP concentration.** At the snapshot, the pool's [gauge](https://hyperevmscan.io/address/0x4A3A2b5ad2EC46b752eBC39ce3BA5109031eed11) held 99.99% of active liquidity in 47 staked positions, worth 24,727.26 USDC and 43,977.62 USDM. Two depositors supplied 89.7% of in-range liquidity. [`0xb0026ca48937bd18c5941c05decab68b0fcced8a`](https://hyperevmscan.io/address/0xb0026ca48937bd18c5941c05decab68b0fcced8a) supplied 51.0%, and [`0x77b90c77c5e647b6ad208dff364cdd42d44de124`](https://hyperevmscan.io/address/0x77b90c77c5e647b6ad208dff364cdd42d44de124) supplied 38.7%, including 12,481.22 USDC, about half the pool's USDC. Neither is a Monetrix role holder, Foundation Safe owner, Core custody signer or the Core API agent. The larger depositor's only Vault interaction was a public `deposit`. This review found no onchain link between either depositor and Monetrix, but offchain affiliation cannot be excluded. Withdrawal by either depositor would remove most of the direct exit depth. Positions were reconstructed from position-NFT transfers into the gauge and read at the snapshot block. [Position manager](https://hyperevmscan.io/address/0xcc9E3991360229Fd13694022b9456D371f1a2568), [Direct V4 pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3), [V4 router](https://hyperevmscan.io/address/0xBEC2BF10B7172C8E5621569BD285E9ADB1806426), [V4 quoter](https://hyperevmscan.io/address/0x8CD6acfF822eE9E3240501b3CeDa64364791e4E2), [USDM/WHYPE pool](https://hyperevmscan.io/address/0xC263eD5351816e2f348c520B208a00383f563E32), [WHYPE/USDC pool](https://hyperevmscan.io/address/0x4C3078122fE4F946A6Dd3bFF487C19661DeA9314), [direct V3 pool](https://hyperevmscan.io/address/0xcC3F48fB9Cb724759a07d6D12Aa85f75EC045a16).

**Exit depth during discounts.** At the CoinGecko hourly low on November 15 at 03:00 UTC, the direct V4 route quoted 997.86 USDC for 1,000 USDM and capped at 4,918.36 USDC for 4,933.91 USDM of input. The instant buffer held 2,167.92 USDC. At the August 20 daily low, the same route quoted a full 50,000 USDM sale for 49,947.57 USDC. At the other two daily observations below $0.99, the route capped at inputs of about 18,878 USDM on October 26 and 20,071 USDM on November 16. CoinGecko measures prices in USD. These simulations measure what the direct pool could pay in USDC at the sampled blocks. [CoinGecko price history](https://www.coingecko.com/en/coins/monetrix-usd/historical_data), [November 15 block](https://hyperevmscan.io/block/51295555), [August 20 block](https://hyperevmscan.io/block/43643363), [October 26 block](https://hyperevmscan.io/block/49528008), [November 16 block](https://hyperevmscan.io/block/51372415), [V4 quoter](https://hyperevmscan.io/address/0x8CD6acfF822eE9E3240501b3CeDa64364791e4E2).

## Centralization & Control Risks

### Governance

The shared access controller is UUPS upgradeable through `DEFAULT_ADMIN_ROLE`. The other Monetrix proxies in scope use `UPGRADER`. The Foundation Safe is 2-of-3 with no verified public attribution for the owners, no enabled Safe modules and no guard at the snapshot. It directly holds `DEFAULT_ADMIN_ROLE`, `GOVERNOR` and `GUARDIAN`. The 24-hour timelock also holds `GOVERNOR`, and the 48-hour timelock is the sole current `UPGRADER` holder. The Foundation Safe administers both timelocks alongside each timelock itself and holds proposer, executor and canceller on both. The same Safe can make direct governor changes and grant roles through the controller. `GUARDIAN` administers `OPERATOR`, and four EOAs, with no contract code at the snapshot, held that operator role. These assignments were reconstructed from role events through the snapshot and checked with `hasRole`. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [24-hour timelock](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF#readContract), [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e#readContract).

The current USDM implementation exposes a global pause that covers ordinary transfers, minting and burning. The reviewed implementation has no per-holder freeze or seizure function. The Foundation Safe holds `DEFAULT_ADMIN_ROLE`, which can grant `UPGRADER` immediately. Two Safe signers can approve a single batch that grants the role to the Safe and then upgrades a Monetrix proxy protected by `UPGRADER`. The deployed Safe v1.4.1 and MultiSendCallOnly contracts support this flow. The Safe can also upgrade the access controller directly through `DEFAULT_ADMIN_ROLE`. The 48-hour delay applies when using the timelock's execution path. [Access controller source](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code), [USDM source](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Safe singleton](https://hyperevmscan.io/address/0x29fcB43b46531BcA003ddC8FCB67FFE91900C762#code), [deployed MultiSendCallOnly](https://hyperevmscan.io/address/0x9641d764fc13c8B624c04430C7356C1C7C8102e2#code), [batching source](https://github.com/safe-global/safe-smart-account/blob/v1.4.1/contracts/libraries/MultiSendCallOnly.sol).

### Critical Permission Paths and Weakest Link

| Capability and target | Current holder / control path | Safeguards | Assets exposed |
|---|---|---|---|
| Proxy upgrades of USDM, the Vault, sUSDM, escrows and the access controller, including mint authority | [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) through direct `DEFAULT_ADMIN_ROLE`. It upgrades the access controller directly and can grant itself `UPGRADER` for every other Monetrix proxy. | 2-of-3 with no mandatory delay. The 48-hour timelock holds `UPGRADER`, and the Safe can grant the role directly. | Unbounded unbacked USDM issuance, EVM USDC in the Vault and escrows, 2.568M USDM held by the [sUSDM proxy](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF), and the Vault's Core account. |
| Vault Core actions and routing through `emergencyRawAction`, `emergencyBridgePrincipalFromL1`, `setMultisigVault`, `setAccountant`, `setRedeemEscrow` and `setYieldEscrow` | Foundation Safe through direct `GOVERNOR`. | 2-of-3 with no mandatory delay. `emergencyRawAction` can send funds from the Vault's Core account or authorize an API wallet even while the Vault is paused. | The Vault's Core account, with 108,050.25 USDC supplied at the snapshot and about 1 USDC on November 23, and future deposits and escrow funding that governance can redirect. |
| HyperCore custody transfers and withdrawals | [Native Core custody multisig](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), with one signer in common with the Foundation Safe. | Two of three signers can move available Core spot assets without a Monetrix timelock. HyperCore margin and settlement rules govern how much is available. Positions or loans may need to be unwound first. | This account holds the main USDM backing portfolio in HYPE and BTC hedges, with USDC borrowing. Assets moved out of the backing accounts reduce USDM backing. |
| Order placement and cancellation for the HyperCore custody account | [Core API agent](https://app.hyperliquid.xyz/explorer/address/0x564Bfb706F0eFdaCF7AaFf44a1a780a9ABB66fAc), named `operator` and registered by the custody multisig. It is a single key with no HyperEVM code and is not a Vault operator, Foundation Safe owner or Core custody signer. Its registration is valid until January 6, 2027. | One key with no Monetrix delay and no cumulative loss cap. HyperCore applies per-order price, balance and margin checks. API wallets sign actions for the account. Hyperliquid documents agent-signed asset sends only when the destination matches the source address, while transfers to other addresses and withdrawals use user-signed actions. Under portfolio margin, an order that exceeds available balance automatically borrows against HYPE at 0.65 LTV and BTC at 0.5 LTV, so agent trades can add USDC debt. The exchange API lists no separate borrow/lend action. [Exchange actions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint), [portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin). | The main backing portfolio: 61,991.6 HYPE in spot against an equal perp short, a 0.20 BTC leg and 1.67M USDC of borrowing on November 23. That is about 97% of the backing mark. Repeated losing trades reduce USDM backing. |
| Trading from the Vault's Core account | Each of four `OPERATOR` EOAs can trade independently. | The Vault restricts eligible assets. HyperCore applies balance, margin and order-price checks. Monetrix imposes no cumulative trading-loss cap. | Funds in the Vault's own Core account and new deposits routed there. |
| [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) supplied-asset registries | Each of the four `OPERATOR` EOAs can add custody entries and remove entries for either Core account. | One signer with no mandatory delay. Yield settlement is subject to the minimum interval, annualized cap and available EVM USDC. | Marked backing, settlement surplus and downstream pricing. The November 23 check found 1.67M USDC net debt in the registered custody entry. |
| RedeemEscrow, YieldEscrow and staking escrow releases | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) controls the USDC escrows. [sUSDM](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF) controls the staking escrow. Ultimate authority follows governance of the two proxies. | The current claim paths enforce ownership and cooldowns. Ordinary redemption escrow reclamation is limited to USDC above pending obligations. | 71,823.58 USDC in RedeemEscrow, 78,900.67 USDM in the staking escrow and zero USDC in YieldEscrow at the snapshot. |
| USDM and sUSDM transfers, Vault activity and bridge retention | Foundation Safe through `GUARDIAN`. | 2-of-3 with no mandatory delay. The transfer pause includes collateral delivery in liquidations. | USDM exits, sUSDM withdrawals and Morpho collateral delivery. |
| Insurance and instant-exit reserves, fees and recovery destinations | Foundation Safe through direct `GOVERNOR`. The ordinary operator replenish path follows configured destinations. | 2-of-3 with no mandatory delay on governor actions. | 11,523.94 USDC insurance, 2,846.29 USDC instant redeem buffer, and the separate instant unstake buffer. |

**Weakest material paths.** A single API agent key can trade the main [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), which carries about 97% of the backing mark. HyperCore checks each order. Monetrix imposes no cumulative loss cap, so repeated losing trades can erode the backing without any withdrawal. Hyperliquid's documented agent-signed actions are orders, cancels and other trading actions, asset sends back to the same account, and staking deposits. Orders can add portfolio-margin borrowing. Transfers to other addresses and withdrawals need the account's own user signature. [Core Info `extraAgents`](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint), [API wallets](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets), [exchange actions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint), [portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin).

Separately, one `OPERATOR` EOA can place trades at caller-set prices from the [Vault's own Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11). HyperCore can reject individual orders over price, balance or margin limits. The Vault limits eligible assets but has no cumulative loss cap. Repeated losing trades can consume the account's equity. The operator can also send future deposits into that account after reserving USDC for the redemption escrow shortfall and the configured retention amount. The account had 108,050.25 USDC supplied at the snapshot. Withdrawals through November 22 returned that balance to HyperEVM. At 12:02 UTC on November 23 it held about 1 USDC supplied, 0.10 HYPE in spot and no perp positions or HLP equity. The direct trading exposure is the money in that account and any further deposits routed there. [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [HyperCore order checks](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/error-responses), [Vault Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11).

At the reported November 18 mark, roughly 14K USDC of surplus could absorb losses before backing fell below supply. The 11.5K USDC InsuranceFund was separate and could cover further losses if governance deployed it. An operator can separately change reported backing by removing an Accountant entry. [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [InsuranceFund source](https://hyperevmscan.io/address/0xf93564ce88fa07d2d84953edb12b4f4262685233#code), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code).

The [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) has the broadest authority at 2-of-3 with no mandatory delay. Through `DEFAULT_ADMIN_ROLE` it can grant itself `UPGRADER`, enable unbounded unbacked minting, and reach the approximately 73K USDC held by the Vault and RedeemEscrow and 2.568M USDM held by sUSDM at the snapshot. Through direct `GOVERNOR` it can move the Vault's Core balances and redirect future bridged deposits. Separately, two Core custody signers can transfer the main backing account's available assets. The reported 2.80M USDC of net Core backing covers both accounts. The custody account's single API agent can also trade that portfolio, as described above. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [sUSDM code](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code), [access controller code](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code), [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [HyperCore multisig](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/multi-sig), [Core transfers](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers), [portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin).

### Programmability

The EVM contracts execute minting, track redemption claims, enforce funding and cooldown checks and calculate sUSDM's exchange rate from onchain balances. Operators decide when to trade, move USDC between environments, fund the queue and settle yield. Since yield starts with an operator-proposed amount, the published sUSDM rate can lag strategy P&L between distributions. The protocol also relies on Core custody operations and asynchronous execution for withdrawals from deployed backing. A successful EVM request alone establishes no guarantee that the corresponding Core operation has settled. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code), [HyperCore execution documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

### External Dependencies

HyperCore order execution, portfolio margin, balance reads and Core–EVM transfers serve both the strategy and its redemption pipeline. The Vault sends native USDC to HyperCore through `depositFor` and uses Hyperliquid's Core–EVM return path. A HyperCore halt or failed transfer can leave marked backing unavailable to the EVM escrow. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [L2BEAT contract discovery](https://disco.l2beat.com/ui/p/hyperliquid), [HyperCore transfer documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers).

The Accountant uses HyperCore oracle prices and balance precompiles for its strategy marks. Required reads can revert, and the assessed implementation has no independent price fallback. The Accountant is UUPS upgradeable, and its Config and accepted asset registry can change through governance. Funded EVM balances can cover some redemptions during a Core disruption. Their snapshot size makes that a limited backstop. The proposed Morpho oracle would be a separate dependency. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

## Morpho USDM/USDC Oracle and Market Design

**Market decision.** Keep the Yearn supply cap at zero pending a stronger governance and custody setup, larger independently available immediate liquidity and an audited price feed. A USDM transfer pause can block collateral delivery during liquidation under any price design. Delayed Core backing, governance powers and token transfer restrictions remain material under any oracle design.

**Pricing for a future pilot.** Use a direct, independently governed USDM/USDC feed with minimum liquidity and observation requirements, or a USDM/USD feed divided by a separately validated USDC/USD feed. Require a live debt-sized liquidation quote and sufficient depth to support those feeds. Use conservative net backing per USDM as a one-sided ceiling alongside market price and par only after independently reconciling the full assets and liabilities of both Core accounts and the Vault's EVM backing. Treat `totalBackingSigned()` as a diagnostic because a single operator can change the registry that determines which positions and liabilities it counts. A fall in either the confirmed market price or independently reconciled net backing must be able to reduce the reported value. Treat isolated weak DEX prints as alerts pending independent confirmation. The current Hybra spot price or an uncorroborated TWAP relies on shallow liquidity and should carry no standalone pricing authority. InstantRedeem's 0.997 USDC payout applies only when its buffer is funded and the exit path is operational. No independent production USDM feed was found on November 23. Pyth's two feeds named USDM track other issuers' tokens. RedStone's oracle repository has no Monetrix reference. Public searches found no Chainlink or other production feed, and no existing Morpho market using USDM as collateral. A pilot therefore needs a newly deployed, audited feed and a credible secondary input before supply. [Pyth USDM feed search](https://hermes.pyth.network/v2/price_feeds?query=USDM), [RedStone oracle repository](https://github.com/redstone-finance/redstone-oracles-monorepo), [Morpho oracle reference](https://docs.morpho.org/developers/contracts/oracles/), [Oracle deployment guidance](https://docs.morpho.org/curate/tutorials-market-v1/deploying-oracle/), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

Implement and test bounded feed age, confidence and deviation checks and exercise stale-feed and backing-read failures before supply. An oracle revert can block liquidation as well as new borrowing. A blind zero price can create wrongful liquidations. Use an independently validated fallback only while it remains within its freshness and confidence bounds, and document joint failure handling before deployment. Morpho market parameters are fixed. Replacing an unsuitable oracle address requires a new market and a migration. [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/), [Morpho oracle risks](https://docs.morpho.org/learn/concepts/oracle/).

**Units and sizing.** Both USDM and native USDC have six decimals. The oracle should return `floor(USDC_per_USDM × 10^36)`. Par is `10^36`, and 0.97 USDC per USDM is `97 × 10^34`. For any later pilot select an enabled LLTV only after stressing depeg, gas, slippage, funding and delayed reserve availability. For example, with a 77% LLTV the Blue liquidation incentive multiplier is about 1.074. Liquidators need an executable exit above roughly 93.1% of the oracle mark to cover repayment before gas. At a fixed $1 mark, an executable $0.90 exit leaves liquidation uneconomic even if a borrower is otherwise eligible. Model concurrent borrower liquidations and size aggregate exposure against the smallest stressed executable route. [Morpho oracle units](https://docs.morpho.org/developers/contracts/oracles/), [Morpho liquidation math](https://docs.morpho.org/learn/concepts/blue/liquidation/).

## Operational Risk

Monetrix is built by the Hybra team, whose leads identify themselves by public aliases. Hybra publishes its own audits and deployment records. The same team's Hybra DEX hosts the only direct USDM/USDC route quoted in this report, so the main secondary exit venue is affiliated with the issuer. Monetrix provides security, architecture and user documentation, but the descriptions of delegated operation, cooldown and burn timing need to be reconciled with the deployment. A search of all 51 published documentation pages on November 23 found no named operating entity, governing law or jurisdiction. The security page says incident procedures exist but does not publish them, and the documentation records no exercise or prior use. [Monetrix team](https://doc.monetrix.xyz/team/team), [Monetrix terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design), [Hybra audit and contract records](https://hybra-foundation.gitbook.io/hybra-foundation/security/contracts), [documentation index](https://doc.monetrix.xyz/llms.txt).

## Monitoring

| Frequency | Contracts and signals | Trigger |
|---|---|---|
| On each change | [AccessController](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events) role events and `hasRole()`, [24-hour](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF) and [48-hour timelocks](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e) schedule and execution events and `getMinDelay()`, [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) threshold and modules, proxy `Upgraded` on every Monetrix proxy, and AccessController `RoleGranted` for `UPGRADER`, `GOVERNOR` or `DEFAULT_ADMIN_ROLE` to any address other than the two timelocks. | Reassess any change in threshold, role authority, implementation or minimum enforced delay. Escalate immediately if the Foundation Safe or any non-timelock account receives `UPGRADER`. |
| On each change | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#events) `EmergencyActionSent`, `PrincipalBridgedFromL1`, `MultisigVaultUpdated`, `AccountantUpdated`, `RedeemEscrowUpdated`, `YieldEscrowUpdated`, `OperatorPaused`, `PmEnabledUpdated`, `HlpDepositEnabledUpdated` and `HlpDeposited`. [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#events) and [InstantUnstake](https://hyperevmscan.io/address/0xaaCE6A69C27dF3F92763F688606335cBf3CE329d#events) `BufferWithdrawn`, `FeeBpsUpdated`, `FeeRecipientUpdated` and `RecoveryRecipientUpdated`, and [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106#events) `Withdrawn`. | Escalate emergency actions, routing or accounting replacements, reserve withdrawals and new HLP exposure. |
| On each registry change | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#events) `VaultSuppliedRegistered`, `VaultSuppliedRemoved`, `MultisigSuppliedRegistered` and `MultisigSuppliedRemoved`. Read `vaultSuppliedLength()` and `multisigSuppliedLength()`, then compare each registry entry from `vaultSupplied(index)` and `multisigSupplied(index)` with both Core accounts' balances and debt. | Escalate any deletion immediately. Flag any outstanding balance or debt omitted from the backing mark. |
| Hourly and on large flows | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) `totalBackingSigned()` vs USDM `totalSupply()` and independently reconciled backing. Track margin, borrow balances, hedge delta and withdrawals for the [custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200) and [Vault Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11). Track custody signers with Core Info `userToMultiSigSigners`, and the [Core API agent](https://app.hyperliquid.xyz/explorer/address/0x564Bfb706F0eFdaCF7AaFf44a1a780a9ABB66fAc) and its `validUntil` (January 6, 2027) with `extraAgents`. | Investigate backing below 100%, differences in liabilities counted, failed reads, an unhedged material leg, changed Core authorization or a failed Core return. |
| Hourly and before any allocation | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) and USDM `paused()`, [RedeemEscrow](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578) `totalOwed()` and `shortfall()`, [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32) `bufferBalance()` and `pendingReplenishCount()`, and [Hybra](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3) debt-sized full-fill quote. | Reassess a pause, rising shortfall, any matured unfunded claim or an executable exit below liquidation break-even. |
| Daily | [Config](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee) caps, registry and cooldowns, plus `AddressUpdated` for `foundation` and `insuranceFund`, which receive 25% of distributed yield. Check Vault `multisigVault()` and `multisigVaultEnabled()`, and [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106) `balance()` divided by USDM supply. | Reassess a new borrowing leg, changed custody route, changed yield recipient, material drift in collateral allocation or any insurance drawdown. |

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
- A single delegated API agent key can trade the main Core custody portfolio, about 97% of the backing mark, without a Monetrix cumulative loss cap. Each of four operator EOAs can trade from the Vault's Core account and route new deposits there. Each can also remove Accountant registry entries and materially distort the backing mark. Under Hyperliquid's documented signing rules, the agent's trades can add portfolio-margin borrowing, but it cannot withdraw or transfer to other addresses.

## Risk Score Assessment

Scores use the November 18 snapshot and the published Yearn rubric. The category-weighted score describes the underlying risk before the governance gate is applied.

### Critical Risk Gates

- [x] **Unverified contract source** -> **PASS** — The USDM proxy and its active implementation have verified source. [USDM proxy](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377#code), [active implementation](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).
- [x] **No audit** -> **PASS** — Code4rena reviewed the core system. Coverage of later components and changes is evaluated under Category 1. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix).
- [x] **Unverifiable reserves** -> **PASS** — EVM balances and live Core assets and liabilities are publicly readable. Independent reconciliation requires checking those balances against the operator-editable registry. [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [HyperCore reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).
- [ ] **Total centralization** -> **TRIGGERED** — Applied under the Governance rubric's "EOA or <3 signers" row. The 2-of-3 Foundation Safe can authorize unbacked minting without a timelock. Two of three Core custody signers can move the available assets backing USDM without a Monetrix timelock. A single delegated API agent key can trade the Core custody portfolio, about 97% of the backing mark, with no Monetrix cumulative loss cap. Any one of the four operator EOAs can route new deposits to the Vault's Core account and trade them under the same limits. [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [Core API agent](https://app.hyperliquid.xyz/explorer/address/0x564Bfb706F0eFdaCF7AaFf44a1a780a9ABB66fAc).

**Critical gate "Total centralization" is triggered.** Per the scoring framework the final score is capped at 5.00; the category-weighted score of 3.88 is recorded for comparability.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 3.5/5.** One public Code4rena review covers the core contracts. Its scope excludes the instant exits, and its governance assumptions differ from the deployed grants. The system has complex EVM–Core interactions and no active bounty. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design).

**Subcategory B: Historical Track Record — 4.0/5.** About five months in production and TVL below $10M. CoinGecko recorded several discounts, and the direct Hybra route filled only about 4.9K USDM at the lowest hourly observation. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm), [CoinGecko price history](https://www.coingecko.com/en/coins/monetrix-usd/historical_data), [November 15 block](https://hyperevmscan.io/block/51295555).

**Score: 3.75/5** — (3.5 + 4.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0/5.** A single API agent key can trade the main Core custody portfolio, and one operator EOA can trade the Vault's Core account and new deposits routed there, without a Monetrix cumulative loss cap. The Foundation Safe's 2-of-3 approvals reach direct `GOVERNOR` powers and role administration without either timelock. The direct withdrawal path from the separate Core custody account uses its native 2-of-3 authorization. [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Programmability — 3.5/5.** Minting, claim checks and sUSDM conversion are calculated onchain. Trading, replenishment and yield settlement depend on active operator decisions and Core execution. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code).

**Subcategory C: External Dependencies — 4.5/5.** HyperCore is the shared dependency for trading, margin, valuations and withdrawals for nearly all backing. Funded EVM balances can still pay some redemptions during a Core disruption. This score follows the treatment of Hyperliquid exposure in the d2 HYPE+ and Unit uBTC assessments. [HyperCore execution documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [d2 HYPE+](https://github.com/yearn/risk-score/blob/master/reports/report/d2-hypeplus.md), [Unit uBTC](https://github.com/yearn/risk-score/blob/master/reports/report/unit-ubtc.md).

**Score: 4.33/5** — (5.0 + 3.5 + 4.5) / 3.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.0/5.** The reported mark covered 100.49% of outstanding USDM, with about 97% of the mark across both Core accounts. The main portfolio is in the native 2-of-3 custody account, which places the backing in the rubric's custodial band. The narrow reported buffer and concentration in actively managed, leveraged HYPE basis positions make realized coverage sensitive to unwinds and margin. [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Provability — 2.5/5.** Live backing inputs and Core marks are public. Reconciliation requires checking both accounts' full assets and liabilities against the operator-editable registries. DeFiLlama reads the same Accountant. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

**Score: 3.25/5** — (4.0 + 2.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 4.50/5** — Base 4.0: the standard exit is a 48-hour cooldown queue whose claims also require escrow funding, and verified immediate depth is below $1M. A +0.5 throttle adjustment applies because claims stall when escrow funding lags operator-driven Core withdrawals, and the instant buffer is finite and discretionary. The drawdown adjustment does not apply. [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract), [direct Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

#### Category 5: Operational Risk (Weight: 5%)

**Score: 3.50/5** — The Hybra team has public aliases and publishes protocol documentation. Material live-state discrepancies remain. The documentation names no legal entity or jurisdiction and does not publish its incident procedures. [Team](https://doc.monetrix.xyz/team/team), [terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem).

### Final Score Calculation

| Category | Score | Weight | Weighted |
|---|---:|---:|---:|
| Audits & Historical | 3.75 | 20% | 0.750 |
| Centralization & Control | 4.33 | 30% | 1.300 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 4.50 | 15% | 0.675 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Category-weighted score** | | | **3.88/5.0** |
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
