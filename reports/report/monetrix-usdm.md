# Protocol Risk Assessment: Monetrix USDM

- **Assessment Date:** November 18, 2026 (Updated: November 25, 2026)
- **Token:** Monetrix USD (USDM)
- **Chain:** HyperEVM
- **Token Address:** [`0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377`](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377)
- **Final Score: 5.00/5.0**
- **Status:** GATED — score capped by the "total centralization" critical gate (a 2-of-3 HyperCore multisig holds about 86% of the backing and can move it with no delay); ungated weighted score is 3.88 (Elevated). No realized loss event.

## Overview + Links

Users deposit native USDC and get USDM 1:1. Monetrix moves most of that USDC to HyperCore, Hyperliquid's trading layer. There it holds HYPE and BTC and shorts the same amount on perpetual futures, so price moves cancel out and the position earns funding. It can also lend and borrow on Hyperliquid, earn maker rebates and use HLP. USDM itself earns nothing. Holders who stake USDM get sUSDM, which grows in value as yield is paid out.

This assessment covers plain (unstaked) USDM as collateral in a proposed HyperEVM Morpho Blue market that lends native USDC.

**Links**

- [Monetrix documentation and architecture](https://doc.monetrix.xyz/how-it-works/architecture)
- [Earn app](https://www.monetrix.xyz/app/earn) and [transparency dashboard](https://www.monetrix.xyz/app/transparency)
- [Public Code4rena contest repository](https://github.com/code-423n4/2026-04-monetrix)
- [Security disclosures and deployed contracts](https://doc.monetrix.xyz/risk-and-security/audits-and-contracts)
- [DefiLlama TVL and methodology](https://defillama.com/protocol/monetrix-usdm) and [L2BEAT Hyperliquid dependency analysis](https://l2beat.com/publications/lighter-vs-hyperliquid)
- [Assessment request in issue #603](https://github.com/yearn/risk-score/issues/603)

**Decision.** Do not supply Yearn funds to a USDM-collateral market for now. There are two main reasons:

1. **Most backing can be moved with no delay.** A 2-of-3 HyperCore multisig held about 86% of the backing on November 25 and can send it anywhere. Monetrix has started moving funds to the Vault's own HyperCore account, which is governed by contract rules and timelocks. On November 24 the Foundation Safe also gave up its direct admin and governor roles, so contract upgrades now wait 48 hours and governor changes 24 hours.
2. **Exit liquidity is too small.** On November 23 only about 27K USDC could be sold instantly, against 2.77M USDM supply.

**Snapshot.** HyperEVM chain ID 999, [block 51,588,528](https://hyperevmscan.io/block/51588528), November 18, 2026 at 11:02:51 UTC, hash `0x5c21c10fa674371901b614d4e5b6b669fb24f5a621fd45da94c87a67ae53b29c`. Live HyperCore reads taken at other times are labeled with their own time.

## Audits and Due Diligence Disclosures

Code4rena reviewed Monetrix from April 24 to May 4, 2026 and published its report on May 26. The contest covered 20 contracts and found one medium issue and no high issues. It included the access controller and the shared upgrade logic. It did not cover InstantRedeem or InstantUnstake. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [contest scope](https://github.com/code-423n4/2026-04-monetrix/blob/3d94be1361ca01d959f9165a78f0d75c5657fe3e/scope.txt), [Monetrix contract inventory](https://doc.monetrix.xyz/risk-and-security/audits-and-contracts).

The live setup differs from what the auditors were told. The contest notes say the admin and governor roles sit behind 48-hour and 24-hour timelocks. Until November 24, 2026 the Foundation Safe held those roles directly. In the [revocation transaction](https://hyperevmscan.io/tx/0x2b4633f491b73486d96b80978dad93ed4a4d4ce32b7238c66cad9a9095e8f0fa) it gave `DEFAULT_ADMIN_ROLE` to the 48-hour timelock and revoked its own `DEFAULT_ADMIN_ROLE` and `GOVERNOR`, which now matches the contest notes. The deployed controller also lets `GUARDIAN` manage `OPERATOR`. [Contest governance assumptions](https://github.com/code-423n4/2026-04-monetrix/blob/3d94be1361ca01d959f9165a78f0d75c5657fe3e/README.md#L202-L211), [deployed access controller](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code).

The medium finding (M-01) is still relevant. The Accountant counts debt only for assets listed in a registry, and any operator can delete a registry entry. Deleting the USDC entry hides any USDC loan from the backing number. HYPE and UBTC are counted at full value. There was no HYPE or UBTC loan at the snapshot. We treat this as an accepted risk: see Provability. [Code4rena findings](https://code4rena.com/reports/2026-04-monetrix), [deployed Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [deployed Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

### Bug Bounty

There is no active bug bounty. The security page says one is planned after launch. Monetrix is not in SEAL Safe Harbor. Its docs still list responsible-disclosure channels as "pending mainnet launch" and point to general contact channels. [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design), [Monetrix contact channels](https://doc.monetrix.xyz/resources/resources), [SEAL Safe Harbor](https://safeharbor.securityalliance.org/).

## Historical Track Record

- **Age and size.** USDM launched on June 10, 2026. DefiLlama shows $1.19M on June 11, a peak of $3.13M on October 7 and $2.87M on November 18, about 8% below the peak. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm).
- **Staking.** sUSDM held 2.568M USDM at the snapshot, about 89.8% of all USDM. [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).
- **Peg.** CoinGecko's 143 daily prices from June 29 to November 18 ranged from $0.9772 (August 20) to $1.0087 (July 12). Three days closed below $0.99. Hourly prices ranged from $0.9755 (November 15, 03:00 UTC) to $1.0206 (July 31, 20:00 UTC). [CoinGecko price history](https://www.coingecko.com/en/coins/monetrix-usd/historical_data).
- **Incidents.** We found no Monetrix loss or postmortem through November 23, 2026. [Monetrix security page](https://doc.monetrix.xyz/risk-and-security/security-design), [DefiLlama hacks list](https://defillama.com/hacks).

## Funds Management

Almost all the backing sits on HyperCore. There it is held as HYPE and BTC spot, hedged with short perps and partly financed with borrowed USDC. HLP is allowed, but nothing was in HLP.

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
| Core custody | [MonetrixCoreVault](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200) | HyperCore multisig account |
| Vault Core account | [MonetrixVault on Core](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) | HyperCore account controlled through the Vault |
| Settlement asset and transport | [Native USDC](https://hyperevmscan.io/address/0xb88339CB7199b77E23DB6E890353E22632Ba630f), [CoreDepositWallet](https://hyperevmscan.io/address/0x6B9E773128f453f5c2C60935Ee2DE2CBc5390A24) | [Circle source](https://github.com/circlefin/hyperevm-circle-contracts) |

### Accessibility

Anyone can deposit USDC and get USDM 1:1 in the same transaction, unless the contracts are paused. USDM can be redeemed only for USDC. There is no way to redeem for the backing assets, such as HYPE or BTC. There are two ways out:

1. **Standard redemption.** Request it, wait 48 hours, then claim USDC 1:1 with no fee. The claim pays only if the RedeemEscrow holds enough USDC.
2. **InstantRedeem.** Get USDC at once for a 0.30% fee. The minimum is 100 USDM. It pays from a small USDC buffer and allows at most 256 pending refill requests.

[Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [RedeemEscrow source](https://hyperevmscan.io/address/0x17100f8cafd727550bb32e6f1496d463da6d978f#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract), [USDM FAQ](https://doc.monetrix.xyz/guide/getting-started/faq).

### Token Mint Authority

**Mint mechanism:** Only the address stored as USDM's `vault()` can mint or burn. That is the MonetrixVault. `setVault` works only once and then reverts with `VaultAlreadySet`, so governance cannot swap in a new minter. The only way to change who mints is to upgrade the USDM or Vault contract, which needs the `UPGRADER` role. The USDC transfer path to HyperCore cannot mint USDM. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

**Mint requires backing:** Today the Vault mints in only two cases, and both bring in USDC first:

1. **Deposits.** The user's USDC comes in.
2. **Yield payouts.** USDC is pulled from the YieldEscrow.

The token contract itself checks only who is calling. It has no backing check and no supply cap. An upgraded USDM or Vault could therefore mint without backing. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code).

**Per-address mint authority** at the November 18 snapshot. [USDM proxy state](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377#readProxyContract).

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---|:---:|:---:|---|---|
| [MonetrixVault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) | Yes | Yes | USDM `onlyVault` | Mints on deposit or yield payout. Burns USDM it holds when a redemption is claimed. |

**Rate limits / supply caps:**

- **Deposit limits.** Each deposit must be 1–500,000 USDC. A deposit is rejected if it would push total USDM supply above 5M. Supply was 2.77M on November 23, so about 2.23M of room is left.
- **The 5M cap is not a hard limit.** Yield payouts do not check it, and governance can raise it through `setMaxTVL` after the 24-hour timelock.
- **Yield limits.** Operators can pay out yield at most once every 20 hours. Each payout is at most 40% a year of supply, pro-rated for the time since the last payout. With 2.77M supply that is about 2,530 USDC per 20 hours. Governance can raise the 40% to a hard-coded maximum of 50%.
- **Per-call staker limit.** Each mint to sUSDM is also capped at 1M USDM per call. At today's size this second limit does not matter.

[Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code).

**Backing check at mint time:** A deposit pulls the USDC in the same transaction as the mint. A yield payout first needs USDC in the YieldEscrow. Getting it there needs the Accountant to report a surplus (backing above supply) and needs USDC actually available on HyperEVM. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code).

### Collateralization

| Snapshot component | USDC or USDM units |
|---|---:|
| USDM total supply | 2,859,313.83 USDM |
| Reported backing (`totalBackingSigned()`) | 2,873,282.51 USDC |
| USDC in the Vault on HyperEVM | 1,164.55 USDC |
| USDC in the RedeemEscrow on HyperEVM | 71,823.58 USDC |
| Backing on HyperCore (the rest) | 2,800,294.38 USDC |
| Reported backing / supply | **100.49%** |
| InsuranceFund, not counted as backing | 11,523.94 USDC |

The supply and HyperEVM balances were rebuilt from Transfer logs and match the snapshot. The Accountant reported 13,968.68 USDC more backing than supply. Other balances at the snapshot:

- **Pending redemptions.** These totaled 72,229.08 USDM, held by the Vault until claimed. The RedeemEscrow was 405.50 USDC short of paying them all.
- **InsuranceFund.** It held 11,523.94 USDC, about 0.40% of supply. Governance decides whether to use it.

We could not re-read the Accountant's backing number at the snapshot block. It reads HyperCore through special precompile calls, and those fail for past blocks on every archive node we tried. DefiLlama's $2,871,263 for November 18, read from the same Accountant, matches within 0.1%. [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [InsuranceFund source](https://hyperevmscan.io/address/0xf93564ce88fa07d2d84953edb12b4f4262685233#code), [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm).

**What "on HyperCore" means.** At the snapshot 97.46% of the backing sat on HyperCore, not on HyperEVM. It is not staked HYPE. It is a hedged trading position. On November 23 the custody account held:

- **Spot HYPE:** 61,991.6 HYPE, about $3.96M, used as margin collateral.
- **HYPE short:** a perp short of the same size, so HYPE price moves cancel out.
- **Borrowed USDC:** about 1.67M.
- **BTC:** a small leg, 0.20 BTC long against an equal short.

The Vault's own HyperCore account had 108,050.25 USDC lent out at the snapshot: 140,277.53 USDC supplied on November 10, minus later withdrawals. It was emptied by November 22. Neither account had HLP on November 23. Only about 3% of backing was USDC on HyperEVM, ready to pay redemptions.

**Changes by November 25** (block 52,196,119, 09:04 UTC). Monetrix told us it is moving funds out of the multisig into the Vault's own HyperCore account, gradually, to avoid trading fees. Onchain:

- **Migration started.** On November 24 at 08:07 UTC the custody multisig sent 310,000 USDC to the Vault's own HyperCore account. That account then held 286,578.74 USDC (265,071.63 lent out and 21,507.11 spot).
- **Smaller, unleveraged hedge.** The custody account cut its HYPE hedge to 33,284.6 HYPE spot against an equal short, repaid the whole USDC loan and had 38,939.46 USDC lent out. The 0.20 BTC leg is unchanged.
- **Backing split.** Reported backing was 2,762,057.31 USDC against 2,752,526.99 USDM supply (100.35%). About 86.3% (2.38M USDC) sat in the custody multisig, 10.4% in the Vault's own HyperCore account and 3.4% on HyperEVM. So about 13.7% was under contract control.
- **Not yet switched over.** The Vault still routes deposits to the multisig when an operator chooses (`multisigVaultEnabled()` is `true`), and `pmEnabled()` is still `false`.

[Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [Vault state](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#readProxyContract), [custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [Vault HyperCore account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11), [Core Info ledger reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint).

The hedge still loses money if spot and perp prices drift apart, funding turns negative, the position is liquidated, or Hyperliquid auto-deleverages it. Most exposure is HYPE. HyperCore enforces the margin and liquidation rules. [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [Vault Core account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11), [Core Info reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint), [HyperCore portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin), [Monetrix ADL design](https://doc.monetrix.xyz/risk-and-security/anti-adl-shield).

### Provability

Anyone can compare the Accountant's `totalBackingSigned()` with USDM `totalSupply()` and check the HyperEVM balances and HyperCore positions. The weak spot is the registry that tells the Accountant which assets to read. Any one operator can delete an entry.

**Why deletion exists.** The Accountant reads every listed entry strictly. If one entry is wrong, the backing read reverts and yield payouts stop, so operators can delete it to fix the read. The code assumes deleting an entry can only lower the backing number. That holds for HYPE and BTC. The USDC entry, however, counts USDC lent out *minus* USDC borrowed, so while the custody account had a 1.67M USDC loan (November 23), deleting it would have raised reported backing by 1.67M. The extra "surplus" could then be paid out as yield.

**Accepted risk.** Yield payouts are capped by code at about 40% of supply a year (at most 50% by a hard-coded limit) and need USDC on HyperEVM, so any over-payment is rate-limited. Monetrix confirmed the issue is known. On November 25 the custody account had repaid its USDC loan, so the USDC entry was positive (+38,939.46 USDC) and deleting it would lower reported backing. This becomes material again only if the custody account borrows USDC again, which the monitoring below flags. DefiLlama reads the same Accountant, so it would show the same number. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [Vault settlement source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Core custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

Yield is paid in two steps. First an operator proposes an amount (`settle`). Then `distributeYield` splits it: 75% goes to stakers as new USDM sent to sUSDM, 10% to the InsuranceFund and 15% to the Foundation. sUSDM was worth about 1.0412 USDM at the snapshot (`sUSDM.convertToAssets()`). [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Config state](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee#readProxyContract), [sUSDM state](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF#readProxyContract).

## Liquidity Risk

A standard redemption locks USDM for 48 hours, then pays USDC 1:1 and burns the USDM. Pending requests earn nothing. A matured claim pays only if the RedeemEscrow has enough USDC. Filling the escrow requires operators to close positions on HyperCore and move USDC back. The user guide says the cooldown is three days and that USDM burns at request. The live contracts use 48 hours and burn at claim. At the snapshot InstantRedeem had 2,846.29 USDC. [Redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem), [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [RedeemEscrow code](https://hyperevmscan.io/address/0x17100f8cafd727550bb32e6f1496d463da6d978f#code), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract).

All USDM trading is on Hybra, a DEX built by the same team as Monetrix. Snapshot quotes, including fees and excluding gas:

| USDM sold | Direct Hybra pool, USDC out | Discount to par | InstantRedeem, USDC out |
|---:|---:|---:|---:|
| 1,000 | 998.83 | 0.117% | 997.00 |
| 10,000 | 9,987.63 | 0.124% | Buffer too small |
| 50,000 | 24,731.57, partial fill | 0.171% on the 24,774.03 USDM sold | Buffer too small |
| 100,000 | 24,731.57, partial fill | 0.171% on the 24,774.03 USDM sold | Buffer too small |

The other venues were smaller:

- **Direct pool limit.** It could pay at most about 24.7K USDC. Selling more did nothing.
- **Route through WHYPE.** It paid at most 7,963.82 USDC, reached after about 9.02K USDM. Selling 5,000 USDM that way returned 4,736.14 USDC, 5.3% below par.
- **Separate V3 pool.** It held 551.19 USDC.

A large holder would have to use the 48-hour redemption.

**Who provides the liquidity.** At the snapshot the direct pool's [gauge](https://hyperevmscan.io/address/0x4A3A2b5ad2EC46b752eBC39ce3BA5109031eed11) held 99.99% of active liquidity in 47 positions, worth 24,727.26 USDC and 43,977.62 USDM. Two wallets supplied 89.7% of the active liquidity:

- [`0xb0026ca48937bd18c5941c05decab68b0fcced8a`](https://hyperevmscan.io/address/0xb0026ca48937bd18c5941c05decab68b0fcced8a) supplied 51.0%.
- [`0x77b90c77c5e647b6ad208dff364cdd42d44de124`](https://hyperevmscan.io/address/0x77b90c77c5e647b6ad208dff364cdd42d44de124) supplied 38.7%, including 12,481.22 USDC, about half the pool's USDC.

Neither wallet holds a Monetrix role or is a Safe or HyperCore signer. The larger one only made one public deposit into the Vault. We found no onchain link to Monetrix, but an offchain link cannot be ruled out. If either wallet withdraws, most of the direct exit liquidity is gone. [Position manager](https://hyperevmscan.io/address/0xcc9E3991360229Fd13694022b9456D371f1a2568), [direct pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3), [router](https://hyperevmscan.io/address/0xBEC2BF10B7172C8E5621569BD285E9ADB1806426), [quoter](https://hyperevmscan.io/address/0x8CD6acfF822eE9E3240501b3CeDa64364791e4E2), [USDM/WHYPE pool](https://hyperevmscan.io/address/0xC263eD5351816e2f348c520B208a00383f563E32), [WHYPE/USDC pool](https://hyperevmscan.io/address/0x4C3078122fE4F946A6Dd3bFF487C19661DeA9314), [V3 pool](https://hyperevmscan.io/address/0xcC3F48fB9Cb724759a07d6D12Aa85f75EC045a16).

**Liquidity during past dips.** CoinGecko prices are in USD; these quotes show what the direct pool could pay in USDC at that block.

- **November 15 hourly low.** The direct pool paid 997.86 USDC for 1,000 USDM but ran out at 4,918.36 USDC, after 4,933.91 USDM. The instant buffer held 2,167.92 USDC.
- **August 20 daily low.** A full 50,000 USDM sale returned 49,947.57 USDC.
- **October 26 and November 16.** The pool ran out at about 18,878 USDM and 20,071 USDM.

[CoinGecko price history](https://www.coingecko.com/en/coins/monetrix-usd/historical_data), [November 15 block](https://hyperevmscan.io/block/51295555), [August 20 block](https://hyperevmscan.io/block/43643363), [October 26 block](https://hyperevmscan.io/block/49528008), [November 16 block](https://hyperevmscan.io/block/51372415).

## Centralization & Control Risks

### Governance

All Monetrix roles live in one access controller. The 2-of-3 [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract) has owners who are not publicly named, and it has no modules or guard. Role holders on November 24, 2026:

- **48-hour timelock.** It holds `DEFAULT_ADMIN_ROLE`, which grants and revokes all roles and upgrades the access controller, and it is the only `UPGRADER`.
- **24-hour timelock.** It is the only `GOVERNOR`.
- **Foundation Safe.** It holds only `GUARDIAN` now. It controls both timelocks: it can propose, execute and cancel on them, and it is their admin.
- **Operators.** Four plain wallets (EOAs) hold `OPERATOR`. `GUARDIAN`, which is the Safe, manages them.

**What changed on November 24.** At the snapshot the Safe also held `DEFAULT_ADMIN_ROLE` and `GOVERNOR` directly, which let it skip both timelocks. In one Safe transaction (safeTxHash `0xa6730235567bfd5cc0a2551dac83c9abfbde62f421b26594ad787687940c0c42`, [block 52,098,255](https://hyperevmscan.io/block/52098255), 06:20 UTC) it gave `DEFAULT_ADMIN_ROLE` to the 48-hour timelock and revoked its own `DEFAULT_ADMIN_ROLE` and `GOVERNOR`. Neither timelock had any queued operations afterwards. [revocation transaction](https://hyperevmscan.io/tx/0x2b4633f491b73486d96b80978dad93ed4a4d4ce32b7238c66cad9a9095e8f0fa).

Roles were rebuilt from events and checked with `hasRole`. [Access controller events](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [24-hour timelock](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF#readContract), [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e#readContract).

**The timelocks now hold.** Upgrades, role grants and access-controller upgrades need the 48-hour timelock. Governor actions such as `emergencyRawAction`, escrow and Accountant swaps, deposit routing, fees and buffer withdrawals need the 24-hour timelock. The Safe still proposes and executes on both, so changes stay 2-of-3 but are now public at least a day in advance. As timelock admin the Safe can change who proposes, but it cannot shorten the delay, which only the timelock itself can change. The Safe keeps these instant `GUARDIAN` powers: pause and unpause the Vault, USDM and sUSDM, pause operators, set the bridge interval and retention amount, and add or remove `OPERATOR` wallets.

**Accepted risk: instant pause and operator changes.** We do not count these `GUARDIAN` powers toward the critical gate. Pausing must be instant to work in an emergency, and a pause-only role does not trigger the gate. Adding an operator adds no new power: any one of the four existing operators can already do everything a new one could, so the operator role itself is the risk, assessed in the table below. [Access controller source](https://hyperevmscan.io/address/0x91f9e952cec0dd3902d7bb75de94921d62174bb9#code), [Safe singleton](https://hyperevmscan.io/address/0x29fcB43b46531BcA003ddC8FCB67FFE91900C762#code), [MultiSendCallOnly](https://hyperevmscan.io/address/0x9641d764fc13c8B624c04430C7356C1C7C8102e2#code), [batching source](https://github.com/safe-global/safe-smart-account/blob/v1.4.1/contracts/libraries/MultiSendCallOnly.sol).

USDM has a global pause that stops all transfers, mints and burns. It has no per-wallet freeze or seizure. [USDM source](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).

### Critical Permission Paths and Weakest Link

| What can be done | Who can do it | Limits | Funds at risk |
|---|---|---|---|
| Upgrade USDM, the Vault, sUSDM, escrows and the access controller (including who can mint) | [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e), proposed and executed by the [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) | 2-of-3 plus a 48-hour public delay (since November 24; no delay before) | Unlimited unbacked USDM, USDC in the Vault and escrows, 2.568M USDM in [sUSDM](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF), and the Vault's HyperCore account |
| Send any HyperCore action from the Vault (`emergencyRawAction`), pull principal back (`emergencyBridgePrincipalFromL1`), and change where deposits go or which escrows and Accountant are used | [24-hour timelock](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF) through `GOVERNOR`, driven by the Foundation Safe | 2-of-3 plus a 24-hour public delay (since November 24). Works even when the Vault is paused | The Vault's HyperCore account (108,050.25 USDC at the snapshot, about 1 USDC on November 23) and all future deposits |
| Move assets out of the HyperCore custody account | [Custody multisig](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), sharing one signer with the Foundation Safe | 2-of-3, no Monetrix delay. Positions may need to be closed first | The main backing portfolio |
| Trade the custody account (accepted trading risk) | [Core API agent](https://app.hyperliquid.xyz/explorer/address/0x564Bfb706F0eFdaCF7AaFf44a1a780a9ABB66fAc), one key named `operator`, valid until January 6, 2027. Not a Vault operator, Safe owner or custody signer | One key, no delay, no total loss cap. HyperCore checks each order. Trades can add USDC borrowing against HYPE (65% LTV) and BTC (50% LTV). Per Hyperliquid's signing rules it cannot withdraw or send funds to other addresses. [Exchange actions](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint), [portfolio margin](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/portfolio-margin) | The custody portfolio: 33,284.6 HYPE spot with an equal short, a 0.20 BTC leg and no USDC loan (November 25) |
| Trade the Vault's HyperCore account and send new deposits there (accepted trading risk) | Any of the four `OPERATOR` wallets | Approved HYPE and BTC pairs only. HyperCore checks each order. No total loss cap. Cannot send funds to other addresses | Funds in that account (286,578.74 USDC on November 25) and new deposits |
| Delete [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) registry entries (accepted risk) | Any of the four `OPERATOR` wallets | One signer, no delay. Payouts stay limited by the 20-hour interval, 40% a year and HyperEVM USDC | The reported backing number. Material only while the custody account borrows USDC (1.67M on November 23, none on November 25) |
| Release escrowed funds | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) for the USDC escrows. [sUSDM](https://hyperevmscan.io/address/0x5f1ab62C3159eBE04aFF14Beef84b0b60de63DDF) for the staking escrow | Claims check owner and cooldown. Only USDC above pending claims can be taken back | 71,823.58 USDC in RedeemEscrow, 78,900.67 USDM in the staking escrow, 0 in YieldEscrow (snapshot) |
| Pause USDM, sUSDM and the Vault | Foundation Safe through `GUARDIAN` | 2-of-3, no delay. A pause also blocks Morpho liquidations | All USDM exits |
| Add or remove `OPERATOR` wallets (accepted risk) | Foundation Safe through `GUARDIAN` | 2-of-3, no delay. Adds no power beyond what one existing operator already has | Same as the operator rows above |
| Withdraw insurance and instant-exit buffers, change fees and recipients | 24-hour timelock through `GOVERNOR`, driven by the Foundation Safe | 2-of-3 plus a 24-hour public delay | 11,523.94 USDC insurance, 2,846.29 USDC InstantRedeem buffer, InstantUnstake buffer |

**Weakest link.** The easiest way to lose backing is the **custody multisig**. Two of three signers can move about 86% of the backing (2.38M USDC on November 25) to any address, or change the signer set, with no delay. Hyperliquid's docs say a `MultiSig` action "wraps around any normal action", including transfers and withdrawals. A HyperCore multisig cannot sit behind a timelock, because contracts cannot sign for it. One signer is also a Foundation Safe owner. The fix Monetrix is working on is moving the funds to the Vault's own HyperCore account, which only contract rules and the timelocks can move. [HyperCore multisig](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/multi-sig).

Next is the **Foundation Safe**. It can still mint unbacked USDM through an upgrade, reaching about 73K USDC in the Vault and RedeemEscrow and 2.568M USDM in sUSDM, and move the Vault's HyperCore funds. Since November 24 those actions wait 48 or 24 hours in a public queue. The 48-hour delay does not guarantee holders can exit first: a redemption also takes 48 hours and pays only if the escrow holds USDC. [USDM code](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code), [HyperCore multisig](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/multi-sig), [Core transfers](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers).

**Accepted trading and accounting risks.** These do not trigger the gate:

- **The custody API key.** It trades the custody account, as API ("agent") keys normally do on Hyperliquid. HyperCore checks each order, but nothing caps total losses. It cannot withdraw or send funds to other addresses, which need the account owner's signature. [Core Info `extraAgents`](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint), [API wallets](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets).
- **Operator wallets.** Any of the four can trade the Vault's HyperCore account on approved HYPE and BTC pairs at prices it chooses, and choose to send new deposits there. Funds can only leave that account back to the Vault, or through governor actions behind the 24-hour timelock. [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [HyperCore order checks](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/error-responses).
- **Registry deletion.** It is rate-limited by the yield caps and was not material on November 25 (see Provability).
- **Instant pause and operator changes** by the Foundation Safe (see Governance).

Only about 9.5K USDC of surplus (November 25) and the separate 12.0K USDC InsuranceFund would absorb losses before USDM is under-backed. [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract).

### Programmability

The contracts handle minting, redemption claims, cooldowns and the sUSDM price automatically. People decide the rest: operators choose when to trade, when to move USDC between HyperEVM and HyperCore, when to fill the redemption escrow and how much yield to pay. Because yield starts with an operator's proposal, sUSDM's price can lag real profits and losses. A request on HyperEVM does not guarantee the matching HyperCore action has finished. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code), [HyperCore execution docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

### External Dependencies

Everything depends on HyperCore: trading, margin, prices, balances and moving USDC back to HyperEVM. If HyperCore halts or a transfer fails, the backing exists but cannot reach the redemption escrow. The Vault sends USDC to HyperCore through Circle's `depositFor`. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [L2BEAT contract discovery](https://disco.l2beat.com/ui/p/hyperliquid), [HyperCore transfer docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/hypercore-less-than-greater-than-hyperevm-transfers).

The Accountant uses HyperCore prices and balances with no backup source. If a read fails, it reverts. Governance can upgrade it and change its settings. The small USDC balance on HyperEVM can pay some redemptions during a HyperCore outage. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).

## Morpho USDM/USDC Oracle and Market Design

**Decision.** Keep the Yearn supply cap at zero. Reconsider when three things are true:

1. The backing has moved from the HyperCore custody multisig to the Vault's own HyperCore account, or the share left in the multisig is immaterial. Upgrades and governor changes already go through the timelocks (since November 24).
2. There is much deeper exit liquidity on a venue Monetrix does not control.
3. An independent price feed exists.

Even with a good oracle, a USDM pause would block liquidations.

**Oracle.** We suggest a feed that reports USDM's backing per token, capped at 1: `min(1, net backing / USDM supply)`.

- **Who computes it.** An independent provider (for example a RedStone or Pyth "fundamental" feed), from both HyperCore accounts' full assets and loans plus the USDC in the Vault and RedeemEscrow.
- **Precedent.** Stable-collateral markets on HyperEVM already use this kind of feed. AVLT/USD₮0 (91.5% LLTV) uses RedStone `AVLT_FUNDAMENTAL/USD` through [this oracle](https://hyperevmscan.io/address/0xf3fAf23D8485bC0B37e15E3CF28E178330F05b0a). hbUSDT/USD₮0 uses an Ojo/RedStone fundamental feed through [this oracle](https://hyperevmscan.io/address/0x79eD085F7E43acF66f91e9B9375555d1b0B91a69). limUSD/USDC (86% LLTV) uses a Pyth-backed feed through [this oracle](https://hyperevmscan.io/address/0xcE9ce1fBa8598fE8dA69Bfb018C425c3E496B395).
- **Wiring.** A `MorphoChainlinkOracleV2` with only `BASE_FEED_1` set. With an 8-decimal feed, `SCALE_FACTOR` is `10^28` and par is `10^36`, since both tokens have 6 decimals.

Do not use these as price sources:

- **The Hybra DEX price.** Selling about 24K USDM empties the direct pool, after which the price can be pushed anywhere for almost nothing.
- **The Accountant's `totalBackingSigned()` directly.** One operator can inflate it, its HyperCore reads can revert and block liquidations, and governance can upgrade it after the 48-hour timelock.

No such feed exists today:

- Pyth's two "USDM" feeds are for other tokens.
- RedStone's repository has no Monetrix entry.
- We found no Chainlink feed and no existing Morpho market using USDM.

Morpho's standard oracle does not check whether a feed is stale, so Yearn would need its own staleness alert. A backing feed reacts to slow losses. It cannot react in time to an unbacked mint or a custody theft. Only the supply cap limits those. Morpho markets cannot change their oracle later. [Pyth USDM feed search](https://hermes.pyth.network/v2/price_feeds?query=USDM), [RedStone oracle repository](https://github.com/redstone-finance/redstone-oracles-monorepo), [Morpho oracle reference](https://docs.morpho.org/developers/contracts/oracles/), [Morpho oracle risks](https://docs.morpho.org/learn/concepts/oracle/), [Morpho Blue market parameters](https://docs.morpho.org/learn/concepts/blue/).

**LLTV.** We suggest 86%, not 91.5%. Morpho's liquidation bonus is `1 / (0.3 × LLTV + 0.7)`. A liquidator only profits if they can sell USDM above the oracle price divided by that bonus:

| LLTV | Liquidation bonus | Liquidator needs to sell at | Room before a max-LTV borrower is underwater |
|---|---|---|---|
| 91.5% | 1.026 | ≥ 97.45% of oracle | 8.5% |
| **86%** | **1.044** | **≥ 95.8% of oracle** | **14%** |
| 77% | 1.074 | ≥ 93.1% of oracle | 23% |

USDM already traded at $0.9755 while fully backed, right at the 91.5% limit. Only about 14K USDC of surplus and 11.5K USDC of insurance absorb losses. The strategy is a leveraged HYPE hedge that can lose money in jumps. limUSD/USDC, the closest comparable, uses 86%. [Morpho liquidation math](https://docs.morpho.org/learn/concepts/blue/liquidation/).

**Liquidity for liquidations today.** Live quotes from the Hybra [quoter](https://hyperevmscan.io/address/0x8CD6acfF822eE9E3240501b3CeDa64364791e4E2) around block 52,045,770 (November 23, about 14:30 UTC):

| USDM sold | [Direct pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3) | Via [WHYPE](https://hyperevmscan.io/address/0xC263eD5351816e2f348c520B208a00383f563E32) |
|---|---|---|
| 1,000 | 998.53 USDC (0.15% below par) | 975.79 (2.4%) |
| 5,000 | 4,992.41 (0.15%) | 4,595.19 (8.1%) |
| 10,000 | 9,984.23 (0.16%) | 7,219.31, the most this route pays |
| 24,048 | 24,000.24, the most the pool pays (0.20%) | — |
| 25,000+ | nothing left | — |

Add InstantRedeem's 3,002 USDC (0.30% fee) and a 136 USDC V3 pool. In total about 27K USDC can be sold instantly. A liquidator must sell the debt times the bonus, so at most about 26K USDC of debt can be liquidated in one go. Beyond that, a liquidator must wait 48 hours for redemption. On November 23 the RedeemEscrow held 89.5K USDC against 107.6K owed, and the Vault held 540 USDC. Total borrowing should stay around 25–50K USDC until liquidity is much deeper.

## Operational Risk

Monetrix is built by the Hybra team, whose leads use public aliases. The same team runs the Hybra DEX, which holds all USDM trading liquidity. The docs cover security, architecture and usage. Some details differ from the live contracts, such as the cooldown length and when USDM burns.

We searched all 51 published doc pages on November 23:

- **No legal details.** They name no legal entity, governing law or jurisdiction.
- **No published incident procedures.** The security page says incident procedures exist but does not publish them or show they were ever used.

[Monetrix team](https://doc.monetrix.xyz/team/team), [Monetrix terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design), [Hybra audit and contract records](https://hybra-foundation.gitbook.io/hybra-foundation/security/contracts), [documentation index](https://doc.monetrix.xyz/llms.txt).

## Monitoring

| Frequency | What to watch | Act when |
|---|---|---|
| On each change | [AccessController](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events) role events and `hasRole()`, [24-hour](https://hyperevmscan.io/address/0x6f00b0Fbc805a8319b4837BB152F4FE700A329BF) and [48-hour timelock](https://hyperevmscan.io/address/0xDe54E1F99752062ef448Dcc6C7636f90214C789e) events and `getMinDelay()`, [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE) threshold and modules, `Upgraded` on every Monetrix proxy, `RoleGranted` for `UPGRADER`, `GOVERNOR` or `DEFAULT_ADMIN_ROLE` to anything other than the two timelocks, `RoleGranted` for `OPERATOR`, and `CallScheduled` on either timelock | Reassess any change in signers, roles, code or delay. Escalate at once if the Safe or any non-timelock address gets `UPGRADER`, `GOVERNOR` or `DEFAULT_ADMIN_ROLE`, or if a scheduled call upgrades a proxy or changes roles |
| On each change | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11#events) `EmergencyActionSent`, `PrincipalBridgedFromL1`, `MultisigVaultUpdated`, `AccountantUpdated`, `RedeemEscrowUpdated`, `YieldEscrowUpdated`, `OperatorPaused`, `PmEnabledUpdated`, `HlpDepositEnabledUpdated` and `HlpDeposited`. [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#events) and [InstantUnstake](https://hyperevmscan.io/address/0xaaCE6A69C27dF3F92763F688606335cBf3CE329d#events) `BufferWithdrawn`, `FeeBpsUpdated`, `FeeRecipientUpdated` and `RecoveryRecipientUpdated`. [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106#events) `Withdrawn` | Escalate emergency actions, rerouting, contract swaps, reserve withdrawals and new HLP use |
| On each registry change | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#events) `VaultSuppliedRegistered`, `VaultSuppliedRemoved`, `MultisigSuppliedRegistered` and `MultisigSuppliedRemoved`. Compare every entry from `vaultSupplied(index)` and `multisigSupplied(index)` with both HyperCore accounts' balances and loans | Escalate any deletion. Flag any balance or loan missing from the backing number, and any new USDC loan in the custody account, which makes registry deletion material again |
| Hourly and on large flows | [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705) `totalBackingSigned()` vs USDM `totalSupply()` and our own backing count. Margin, loans, hedge balance and withdrawals for the [custody account](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200) and [Vault HyperCore account](https://app.hyperliquid.xyz/explorer/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11). Custody signers via Core Info `userToMultiSigSigners`, and the [API agent](https://app.hyperliquid.xyz/explorer/address/0x564Bfb706F0eFdaCF7AaFf44a1a780a9ABB66fAc) and its `validUntil` (January 6, 2027) via `extraAgents` | Investigate backing below 100%, loans missing from the count, failed reads, an unhedged position, new signers or agents, a failed transfer back, or a rise in the custody multisig's share of backing (86% on November 25) |
| Hourly and before any allocation | [Vault](https://hyperevmscan.io/address/0x5586c2c8223C73Ec0B41D6352748e6c173372E11) and USDM `paused()`, [RedeemEscrow](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578) `totalOwed()` and `shortfall()`, [InstantRedeem](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32) `bufferBalance()` and `pendingReplenishCount()`, and a debt-sized quote on the [Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3) | Reassess on a pause, a growing shortfall, any matured claim that cannot be paid, or an exit price below liquidation break-even |
| Daily | [Config](https://hyperevmscan.io/address/0x01313E95c0dD7FD4AD67Edc39823B079f6734Cee) caps, cooldowns and `AddressUpdated` for `foundation` and `insuranceFund` (they receive 25% of yield). Vault `multisigVault()` and `multisigVaultEnabled()`. [InsuranceFund](https://hyperevmscan.io/address/0x4D9f48F3055FA354254B1CA82a0badb88f7c2106) `balance()` divided by USDM supply | Reassess a new loan type, a new custody route, a new yield recipient, a big change in holdings or any insurance withdrawal |

If HyperCore reads fail on chain, use Core Info and note the time. Treat failed or stale reads as lost monitoring until they work again. [HyperCore precompiles](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [Hyperliquid Info reference](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint).

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
  Core custody account → HYPE / BTC hedge and USDC borrowing
  Vault's Core account → USDC lending and return path to HyperEVM
  HyperCore balance and price reads → MonetrixAccountant

Governance
  Foundation Safe → 48h timelock → admin, role grants and upgrades
  Foundation Safe → 24h timelock → GOVERNOR settings and emergency actions
  Foundation Safe → GUARDIAN → pauses and operator list
  HyperCore multisig and API agent → Core custody account
  Foundation Safe and Vault operators → Vault's own Core account
```

## Risk Summary

### Key Strengths

- Anyone can deposit USDC and get USDM 1:1 in one transaction.
- The code is verified and the backing can be checked by anyone on HyperEVM and HyperCore.
- There are two exit paths: a 48-hour redemption at par and an instant buffer.
- Code4rena reviewed the core contracts, and the Accountant subtracts the registered USDC loan.
- Since November 24, contract upgrades and governor changes wait 48 and 24 hours in public timelocks.
- Monetrix has started moving backing into the Vault's own HyperCore account, which is under contract control (about 13.7% of backing including HyperEVM USDC on November 25).

### Key Risks

- About 97% of backing sits on HyperCore and depends on its trading, margin and USDC transfers back.
- The backing is mostly a HYPE hedge (33,284.6 HYPE on November 25, with no USDC loan). Price gaps, negative funding, liquidation or auto-deleveraging can lose money.
- USDM can be redeemed only for USDC, after 48 hours, and only if the escrow is funded. Instant liquidity is about 27K USDC.
- A pause blocks Morpho liquidations, and no independent price feed exists.

### Critical Risks

- A 2-of-3 HyperCore multisig, sharing one signer with the Foundation Safe, can move about 86% of the backing (2.38M USDC on November 25) with no delay.
- The 2-of-3 Foundation Safe can still upgrade USDM and mint unbacked tokens, but since November 24 only through the 48-hour timelock.

## Risk Score Assessment

Scores use the November 18 snapshot and the published Yearn rubric. The category-weighted score shows the underlying risk before the governance gate.

### Critical Risk Gates

- [x] **Unverified contract source** -> **PASS** — The USDM proxy and its implementation are verified. [USDM proxy](https://hyperevmscan.io/address/0xE2d2959f89B6389DeB624bF076Fe7D9E5401f377#code), [implementation](https://hyperevmscan.io/address/0x05faf9cfa7143804e7fb0db423fde8330cd586df#code).
- [x] **No audit** -> **PASS** — Code4rena reviewed the core system. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix).
- [x] **Unverifiable reserves** -> **PASS** — HyperEVM balances and HyperCore assets and loans are public. A correct count needs checking them against the operator-editable registry. [Accountant](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [HyperCore reads](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore).
- [ ] **Total centralization** -> **TRIGGERED** — Applied under the Governance rubric's "EOA or <3 signers" row. Two of three HyperCore custody signers can move about 86% of the backing (November 25) to any address with no timelock. The custody API key, operator trading, registry deletion and instant pause or operator changes are accepted risks and do not trigger the gate.

  [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200), [Core API agent](https://app.hyperliquid.xyz/explorer/address/0x564Bfb706F0eFdaCF7AaFf44a1a780a9ABB66fAc).

**Critical gate "Total centralization" is triggered.** Per the scoring framework the final score is capped at 5.00; the category-weighted score of 3.88 is recorded for comparability.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 3.5/5.** One Code4rena review covers the core contracts. It did not cover the instant exits, and it assumed timelocks that the live setup did not enforce until November 24. The system is complex, and there is no bug bounty. [Code4rena report](https://code4rena.com/reports/2026-04-monetrix), [Monetrix security design](https://doc.monetrix.xyz/risk-and-security/security-design).

**Subcategory B: Historical Track Record — 4.0/5.** About five months live and under $10M TVL. There were several small depegs, and at the lowest hourly price the direct pool could absorb only about 4.9K USDM. [USDM deployment](https://hyperevmscan.io/tx/0x8ae34c4d6667f585110e44721cf920f1b797ab93d23da3091fd7f2eade5a96c5), [DefiLlama TVL](https://defillama.com/protocol/monetrix-usdm), [CoinGecko price history](https://www.coingecko.com/en/coins/monetrix-usd/historical_data), [November 15 block](https://hyperevmscan.io/block/51295555).

**Score: 3.75/5** — (3.5 + 4.0) / 2.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0/5.** Two of three custody signers can move about 86% of the backing with no delay. The Foundation Safe now needs the 48-hour or 24-hour timelock for upgrades and governor actions, but this does not change the score because the custody path has no delay. [Vault code](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [Foundation Safe](https://hyperevmscan.io/address/0x73a964d19E409E390628AFb1b5B42dde130F45EE#readProxyContract), [access controller](https://hyperevmscan.io/address/0x301024E319191495146AB3627fe3Fc1FfE586595#events), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Programmability — 3.5/5.** Minting, claims and the sUSDM price are automatic. Trading, refilling the escrow and paying yield depend on operators and HyperCore. [Vault source](https://hyperevmscan.io/address/0x08f69c88c47ef1c5274fc11bfe350561252c77f2#code), [sUSDM source](https://hyperevmscan.io/address/0x8a83295c57d854751ff89c8871d7daddb05029d1#code).

**Subcategory C: External Dependencies — 4.5/5.** Nearly all backing depends on HyperCore for trading, margin, prices and withdrawals. The HyperEVM USDC balance can still pay some redemptions during an outage. This matches how the d2 HYPE+ and Unit uBTC reports score Hyperliquid. [HyperCore execution docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore), [d2 HYPE+](https://github.com/yearn/risk-score/blob/master/reports/report/d2-hypeplus.md), [Unit uBTC](https://github.com/yearn/risk-score/blob/master/reports/report/unit-ubtc.md).

**Score: 4.33/5** — (5.0 + 3.5 + 4.5) / 3.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.0/5.** Reported backing was 100.49% of supply at the snapshot and 100.35% on November 25. About 86% sits in a 2-of-3 custody account, which puts it in the rubric's custodial band. The buffer is thin and the position is a HYPE hedge (leveraged with a 1.67M USDC loan on November 23, unleveraged on November 25), so real coverage depends on closing positions cleanly. [Accountant state](https://hyperevmscan.io/address/0x8950A5136f3994f82b998e37e1183b8A37c12705#readProxyContract), [Core custody](https://app.hyperliquid.xyz/explorer/address/0x6E25e5D971BDa9799F7A5242f4720b5B3f939200).

**Subcategory B: Provability — 2.5/5.** The inputs are public. A correct count needs checking both HyperCore accounts' full assets and loans against registries that operators can edit. DefiLlama reads the same Accountant. [Accountant source](https://hyperevmscan.io/address/0x5ce5e40522e8cb42d7a1ae2dadab808d31f1a8e2#code), [DefiLlama methodology](https://defillama.com/protocol/monetrix-usdm).

**Score: 3.25/5** — (4.0 + 2.5) / 2.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 4.50/5** — The base score is 4.0: the main exit is a 48-hour queue that pays only when the escrow is funded, and instant liquidity is under $1M. We add 0.5 for throttling, because claims stall when operators are slow to move USDC back from HyperCore and the instant buffer is small. The drawdown adjustment does not apply. [RedeemEscrow state](https://hyperevmscan.io/address/0xa118B1DBEb940944D071DBeC787A2D2e8D3B6578#readProxyContract), [InstantRedeem state](https://hyperevmscan.io/address/0xaa556b9755C249F9B6b98F89dd20C5D4997B8F32#readProxyContract), [direct Hybra pool](https://hyperevmscan.io/address/0xA9F34bf9B9E6163f21dEaA2F136beed816ab48e3).

#### Category 5: Operational Risk (Weight: 5%)

**Score: 3.50/5** — The team uses public aliases and publishes documentation. Some docs differ from the live contracts. No legal entity or jurisdiction is named, and incident procedures are not published. [Team](https://doc.monetrix.xyz/team/team), [terms](https://doc.monetrix.xyz/resources/terms-and-disclaimer), [redemption guide](https://doc.monetrix.xyz/guide/getting-started/redeem).

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

**Final Risk Tier: High Risk (GATED).** The 5.00/5.0 score is in the 4.50–5.00 tier. Yearn should not supply to a USDM-collateral Morpho market at this snapshot.

## Reassessment Triggers

- **Time-based.** Refresh within 60 days if a market proposal is still active, and before any Yearn allocation.
- **TVL-based.** Reassess if TVL moves more than 25% from the snapshot or instant exit liquidity changes a lot.
- **Incident-based.** Reassess after a loss, a depeg, backing below 100%, an unpaid matured redemption, a custody or role change, a pause, or a change in backing assets.
- **Market readiness.** Reassess when there is an independent price feed, liquidity that can absorb a debt-sized sale, and the backing moved out of the HyperCore custody multisig.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [November 18, 2026](https://github.com/yearn/risk-score/pull/617) | 5.00 | Initial assessment of USDM as Morpho collateral. Governance gate applied. On November 24 the Foundation Safe moved admin and governor powers behind the 48-hour and 24-hour timelocks; on November 25 the gate applies only through the HyperCore custody multisig (about 86% of backing), after Monetrix began moving funds to the Vault's own account. |
