# Protocol Risk Assessment: Apyx

- **Assessment Date:** April 19, 2026 (Updated: October 5, 2026)
- **Token:** apxUSD
- **Chain:** Ethereum + Base + BNB Chain + Solana
- **Token Address:** [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
- **Final Score: 3.52/5.0**
- **Snapshot:** Ethereum block [26,126,833](https://etherscan.io/block/26126833), October 5, 2026 14:42 UTC; Accountable API snapshot October 5, 2026 14:46 UTC

## Overview + Links

Apyx is a "Dividend-Backed Stablecoin" (DBS) protocol that converts offchain corporate dividend income from publicly-traded Digital Asset Treasury (DAT) preferred shares into onchain programmable yield. The protocol offers two tokens:

- **apxUSD**: A synthetic dollar that Apyx describes as backed by an overcollateralized basket of low-volatility, variable-rate DAT preferred shares. It does NOT pay yield directly to holders and serves as the protocol's primary liquidity and collateral layer.
- **apyUSD**: A yield-bearing ERC-4626 vault token. Users deposit apxUSD and receive apyUSD, which accrues yield through a rising exchange rate (non-rebasing) funded by dividends from the underlying DAT preferred share portfolio.

**Collateral**: The basket consists of preferred shares from publicly-traded companies plus a cash/equivalents buffer:
- **STRC** (Strategy Inc Variable Rate Series A Perpetual Preferred Stock, $100 par value, Nasdaq-listed), held at Alpaca and as onchain STRCx
- **SATA** (Strive Inc Variable Rate Series A Perpetual Preferred Stock, Nasdaq-listed) is an eligible basket asset, but the [July and August 2026 Wolf reports](#reserve-attestations) show a **$0 SATA balance** on all four report dates. The securities reserve is currently STRC-only.

Apyx states that the collateral is dynamically rebalanced based on issuer concentration limits, liquidity needs, and overcollateralization requirements.

### Can Holders Lose Money?

Yes. apxUSD is intended to trade near $1, but it is not backed by onchain stablecoins or cash-equivalents. Its backing is an offchain and tokenized portfolio of DAT preferred shares. If those preferred shares fall in value, dividends are cut, custody fails, reserves are misreported, or liquid secondary markets dry up, apxUSD can trade below $1 and holders can lose principal.

This has already happened. **apxUSD traded below par from early June 2026**, reaching a daily low of ~$0.75 in late June after a record STRC drawdown. It recovered gradually through August and September and traded at **$0.988 on October 5, 2026 (−1.2%)**. It has not yet held $0.99 for a sustained period. See *Historical Track Record → June 2026 Depeg*.

apyUSD inherits the same risk because it is redeemable into apxUSD. Its exchange rate can rise in apxUSD terms while the USD value of apxUSD itself falls. The redemption cooldown (up to 20 days) can also delay exits during stress.

**Key metrics (October 5, 2026):**
- apxUSD market price: **$0.988** — 1.2% below par ([DefiLlama](https://coins.llama.fi/prices/current/ethereum:0x98a878B1CD98131b271883b390F68d2c90674665))
- apxUSD Total Supply (Ethereum): **~302.47M** (supply cap 750M)
- Accountable Proof of Solvency (October 5, 14:46 UTC): **$177.77M asset reserves / $176.54M circulating supply = 100.70% collateralization**; redemption value **$0.9984** ([dashboard](https://accountable.apyx.fi/), [API](https://api.accountable.apyx.fi/dashboard)). Protocol-held inventory ($60.66M) and protocol-owned liquidity ($65.27M) are excluded from circulating supply.
- Chainlink [APXUSD / USD Exchange Rate](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5) feed: **1.000000** (last updated October 4, 2026, 19:00 UTC)
- Base supply: ~9.64M apxUSD and ~0.35M apyUSD via Chainlink CCIP
- BNB Chain supply: ~2.57M apxUSD via Chainlink CCIP ([token](https://bscscan.com/token/0x6b3788fd6604bbf03c5378d24e57bb334baad4af))
- Solana: live CCIP route; remote supply **TODO** (no Solana RPC configured). Ethereum escrow less Base and BNB supply implies ~6.01M.
- apyUSD vault totalAssets: ~167.18M apxUSD; exchange rate: ~1.4375 apxUSD per apyUSD
- Curve apxUSD-USDC v3 Pool: **3.12M apxUSD + 1.66M USDC** ([pool](https://etherscan.io/address/0x6f63deedc9870d6c16fc644c6654748352cdc87c)); 85.3% of LP is held by an Apyx 2-of-4 Safe. The original Curve pool remains drained (~$5.7K).
- Uniswap V4 PoolManager: ~10.20M apxUSD (singleton balance, not tradable depth)
- Listed on CoinGecko
- Chains: Ethereum, Base, BNB Chain, and Solana via Chainlink CCIP
- Protocol launched: February 18, 2026 (~229 days ago)

**Links:**

- [Protocol Website](https://apyx.fi/)
- [Protocol Documentation](https://docs.apyx.fi)
- [apxUSD Overview](https://docs.apyx.fi/product-overview/apxusd-overview)
- [apyUSD Overview](https://docs.apyx.fi/product-overview/apyusd-overview)
- [Blog - Introducing Apyx](https://blog.apyx.fi/introducing-apyx/)
- [Post-Mortem: The STRC Drawdown & the apxUSD Price Movement (June 8, 2026)](https://blog.apyx.fi/post-mortem/)
- [Apyx 2.0: Redemption Value & Total Collateralization (June 15, 2026)](https://blog.apyx.fi/apyx-2-0-redemption-value-total-collateralization-evolution-of-the-dividend-backed-dollar/)
- [Introducing aptUSD (September 1, 2026)](https://blog.apyx.fi/introducing-aptusd/)
- [APYX TGE Update (September 23, 2026)](https://blog.apyx.fi/apyx-tge-update/)
- [Audits Page](https://docs.apyx.fi/resources/audits)
- [Third-Party Attestation Page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation)
- [Custody Overview](https://docs.apyx.fi/collateral-and-custody/custody-overview)
- [Transparency](https://docs.apyx.fi/collateral-and-custody/transparency)
- [Accountable Proof-of-Reserves Dashboard](https://accountable.apyx.fi/)
- [Accountable DVN Registry](https://dvn.accountable.capital/v1/stats)
- [Curve Pool (original, drained)](https://www.curve.finance/dex/ethereum/pools/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)
- [Curve apxUSD-USDC v3 Pool](https://www.curve.finance/dex/ethereum/pools/0x6f63deedc9870d6c16fc644c6654748352cdc87c)
- [Chainlink APXUSD / USD Exchange Rate feed](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5)
- [CoinGecko](https://www.coingecko.com/en/coins/apxusd)
- [GitHub - evm-contracts](https://github.com/apyx-labs/evm-contracts)

## Contract Addresses

### Core Contracts (Ethereum)

| Contract | Address | Type |
|----------|---------|------|
| apxUSD (Proxy) | [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665) | ERC-20, UUPS Proxy |
| apxUSD (Implementation, current) | [`0xdd71fd677fde2ed2579a3c45204f41a11016ccb4`](https://etherscan.io/address/0xdd71fd677fde2ed2579a3c45204f41a11016ccb4) | ApxUSD (upgraded) |
| apyUSD (Proxy) | [`0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a`](https://etherscan.io/address/0x38eeb52f0771140d10c4e9a9a72349a329fe8a6a) | ERC-4626 Vault, UUPS Proxy |
| apyUSD (Implementation, current) | [`0xfd616567ecc1607f61073951a1e822f7315bb112`](https://etherscan.io/address/0xfd616567ecc1607f61073951a1e822f7315bb112) | ApyUSD. Set May 27, 2026 (block 25188571) via [`0x4e5b…696d`](https://etherscan.io/tx/0x4e5b0a6da667cef27e23745f7fd217baa6242b6365ad18b894720cbfb3b4696d). Adds `burnWithAssets`, `denyList`, `feeWallet`, `redeemForMinAssets`, `getCCIPAdmin`. |
| AccessManager | [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824) | OpenZeppelin AccessManager |
| MinterV0 | [`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e) | Mint Strategy (EIP-712) |
| ApxUSDRateOracle (Proxy) | [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d) | Curve Pool Oracle, UUPS Proxy |
| ApxUSDRateOracle (Implementation, current) | [`0x26ea4a9099b4da41b2d0e7e9874a29104d8bb17f`](https://etherscan.io/address/0x26ea4a9099b4da41b2d0e7e9874a29104d8bb17f) | Rate oracle (upgraded) |
| LinearVestV0 | [`0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f`](https://etherscan.io/address/0x0d62b4cc02b4b51ed19ddf41d7a7979cf394c99f) | Yield Vesting (~17-day linear) |
| YieldDistributor | [`0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a`](https://etherscan.io/address/0xdbca79adc13a0fa6f921d5cf5b3fae2b8a739c2a) | Distributes yield to vesting |
| AddressList | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Whitelist/Deny List. Wired into apxUSD, apyUSD, and UnlockToken — see *Deny List* under Centralization. |
| UnlockToken | [`0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6`](https://etherscan.io/address/0x93775e2dfa4e716c361a1f53f212c7ae031bf4e6) | apyUSD Unlock Token (`unlockingDelay() = 1,728,000s` = 20 days) |
| Fee Wallet | [`0x6F93635F2A1C19b4F7f1BD9BA655F6A073C629Dc`](https://etherscan.io/address/0x6F93635F2A1C19b4F7f1BD9BA655F6A073C629Dc) | Recipient of the apyUSD unlocking fee (`apyUSD.feeWallet()`); admin-settable via `setFeeWallet`. |
| CommitToken (apxUSD) | [`0x17122d869d981d184118b301313bcd157c79871e`](https://etherscan.io/address/0x17122d869d981d184118b301313bcd157c79871e) | CT-apxUSD |
| CommitToken (LP) | [`0xdfc3cf7e540628a52862907dc1ab935cd5859375`](https://etherscan.io/address/0xdfc3cf7e540628a52862907dc1ab935cd5859375) | CT-apxUSDUSDC |
| OrderDelegate | [`0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1`](https://etherscan.io/address/0x5c697433e214b1a6d7a2ddd4cdca1505c98f75f1) | Minting Delegate |
| Mint Pass-Through | [`0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8) | Apyx-controlled hop contract: `asset()` returns apxUSD; `authority()` returns the Apyx AccessManager. Balance is currently 0 apxUSD. |
| Chainlink APXUSD / USD Exchange Rate | [`0x651b101f72f82630cf59c68e6ee4305afbd3b1f5`](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5) | Chainlink `EACAggregatorProxy` (18 decimals), deployed April 23, 2026. Apyx describes it as the onchain NAV publication. Read at 1.000000; the price-bounded peg contracts below use it as their reference price. |
| Peg-liquidity contract (unverified) | [`0xc42c921e05e335768878de6484ef0767443845d7`](https://etherscan.io/address/0xc42c921e05e335768878de6484ef0767443845d7) | Deployed August 7, 2026. Getters: `BASE` = apxUSD, `USDC()`, `POOL()` = Curve v3 pool, `navOracle()` = the Chainlink feed above, `NAV_STALENESS_THRESHOLD()` = 86,400s, `MAX_SLIPPAGE_BPS()` = 200, `WITHDRAW_DESTINATION()` = Guardian Safe. Its two operator functions are gated to role 42, which is held by EOA [`0x2a55dd001195eee92aeb8983dccedf1700a077b0`](https://etherscan.io/address/0x2a55dd001195eee92aeb8983dccedf1700a077b0). Holds ~176K apxUSD + ~101K USDC. |
| CoW Protocol order contract (unverified) | [`0xda6977ebdd0ad90c93be11c48fff9950123ef997`](https://etherscan.io/address/0xda6977ebdd0ad90c93be11c48fff9950123ef997) | Deployed October 1, 2026. EIP-1271 order signer for [GPv2Settlement](https://etherscan.io/address/0x9008d19f58aabd9ed0d60971565aa8510560ab41): `BASE()` = apxUSD, `QUOTE()` = USDC, `BASE_ORACLE()` = the Chainlink feed, `ORACLE_STALENESS_THRESHOLD()` = 90,000s, `MAX_ORDER_TTL()` = 3,600s. Orders are signed by role 43 (EOA [`0x58209e67a777132efaaac2d6959d9fa6de330df1`](https://etherscan.io/address/0x58209e67a777132efaaac2d6959d9fa6de330df1)), and `withdrawReceiver()` is the Liquidity Safe. Holds ~929K apxUSD + ~357K USDC. A predecessor contract, [`0x2ab07a623a2fe2dce950f1a9012de8f201b4d512`](https://etherscan.io/address/0x2ab07a623a2fe2dce950f1a9012de8f201b4d512) (September 24), now holds 0. |

### Cross-Chain Contracts

| Contract | Address | Type |
|----------|---------|------|
| apxUSD (Base) | [`0xd993935e13851dd7517af10687ec7e5022127228`](https://basescan.org/address/0xd993935e13851dd7517af10687ec7e5022127228) | Base deployment of apxUSD |
| apyUSD (Base) | [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://basescan.org/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) | Base deployment of apyUSD |
| Base AccessManager | [`0x8AFDE6a90d2396A64eB97e8E69e7548289f78A1D`](https://basescan.org/address/0x8AFDE6a90d2396A64eB97e8E69e7548289f78A1D) | AccessManager returned by Base token `authority()` |
| apxUSD (BNB Chain) | [`0x6b3788fd6604bbf03c5378d24e57bb334baad4af`](https://bscscan.com/token/0x6b3788fd6604bbf03c5378d24e57bb334baad4af) | BNB Chain apxUSD representation; ~2.57M supply at the October 5 snapshot; `getCCIPAdmin()` returns the Guardian Safe |
| apxUSD (Solana) | [`HAYQtfJEQ9DbDbaHEhxfGsWbSZ3ywthdsVB3PuB72DYe`](https://solscan.io/token/HAYQtfJEQ9DbDbaHEhxfGsWbSZ3ywthdsVB3PuB72DYe) | Solana mint returned by `getRemoteToken(124615329519749607)` (decoded from bytes32); remote pool [`AuWWEJVQFesgLLZtbjFTR3wne35tqxWfdoC4zhBdkHPe`](https://solscan.io/account/AuWWEJVQFesgLLZtbjFTR3wne35tqxWfdoC4zhBdkHPe). Supply and mint authority **TODO**. |
| Ethereum CCIP LockReleaseTokenPool | [`0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5`](https://etherscan.io/address/0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5) | Escrows canonical apxUSD (**~18.22M** at the snapshot) and maps CCIP routes to the Base, BNB Chain, and Solana remote tokens; `owner()` = Guardian Safe |

**Bridge / interoperability:** Apyx uses **Chainlink CCIP** with a lock/release model on Ethereum. The Ethereum TokenAdminRegistry maps apxUSD to the LockReleaseTokenPool above. Its onchain `getSupportedChains()` returns three selectors, resolved through Chainlink's [chain-selectors registry](https://github.com/smartcontractkit/chain-selectors): Base `15971525489660198786`, BNB Chain `11344663589394136015`, and **Solana mainnet `124615329519749607`**. `getRemoteToken` maps each selector to the remote token listed above. Canonical apxUSD is escrowed on Ethereum, and remote tokens are bridged representations. Inbound and outbound rate limits are enabled on every lane. Base and BNB Chain have 5M-apxUSD buckets in each direction. Solana has a 5.5M outbound bucket and a 2M inbound bucket. The pool owner and the BNB token's `getCCIPAdmin()` are both the Guardian Safe. Escrow of ~18.22M exceeds the verified Base and BNB Chain supply (~12.21M combined), leaving ~6.01M attributable to Solana if escrow and remote supply reconcile. That Solana figure is **TODO** until it is read directly.

### Governance & Multisig Contracts

| Contract | Address | Configuration |
|----------|---------|---------------|
| Admin Safe (current) | [`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96) | **4-of-6** Gnosis Safe, current holder of ADMIN_ROLE (0 exec delay). Granted 2026-03-20. |
| Guardian/Upgrader Safe (former Admin) | [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2) | **4-of-7** Gnosis Safe. One owner was added and the threshold was raised from 3 in tx [`0xd7692f06…5aae`](https://etherscan.io/tx/0xd7692f068fd795bae4418b828087e0e86c3cc85ad102af25a2717176f87f5aae) on August 31, 2026; no owners were removed. It no longer holds ADMIN_ROLE. It holds role 24 (UPGRADER for apxUSD/apyUSD, 3-day exec delay), role 21 (PAUSER, 0 delay), role 22 (UNPAUSER, 4-hour delay), role 23 (includes apxUSD `setSupplyCap`, 1-day delay), role 25 (UPGRADER for the alqUSD/aptUSD family and new oracles, 7-day delay), role 7 (YIELD_OPERATOR, 0 delay), and operational roles 44/52/54. It is also owner of the CCIP token pool. |
| Operations Safe | [`0x37b0779a66edc491df83e59a56d485835323a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555) | 3-of-6 Gnosis Safe. No AccessManager roles. Holds 713,088 STRCx. |
| Liquidity Safe (label inferred) | [`0xe6f8ad24367c1038ad1ce15af72a62408ba33c46`](https://etherscan.io/address/0xe6f8ad24367c1038ad1ce15af72a62408ba33c46) | **2-of-4** Gnosis Safe created May 25, 2026 by an Admin Safe signer; two of its four owners are also Admin Safe owners. It holds ~15.91M apxUSD, ~0.76M USDC, and **85.3% of the Curve v3 LP**, and is the `withdrawReceiver()` of the CoW order contract. No AccessManager roles. |
| Third-Party Safe | [`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`](https://etherscan.io/address/0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50) | 2-of-3 Gnosis Safe, holds 0 apxUSD and ~5.79M apyUSD. |

### Liquidity Contracts

| Contract | Address | Type |
|----------|---------|------|
| Curve apxUSD/USDC Pool (original) | [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) | CurveStableSwapNG; drained (~3,790 apxUSD + ~1,956 USDC) |
| Curve apxUSD-USDC v3 Pool | [`0x6f63deedc9870d6c16fc644c6654748352cdc87c`](https://etherscan.io/address/0x6f63deedc9870d6c16fc644c6654748352cdc87c) | CurveStableSwapNG (A = 100, fee 0.20%), created July 30, 2026. Holds ~3.12M apxUSD + ~1.66M USDC. The Liquidity Safe owns 85.3% of the LP. |
| Uniswap V4 Pool Manager | [`0x000000000004444c5dc75cb358380d2e3de08a90`](https://etherscan.io/address/0x000000000004444c5dc75cb358380d2e3de08a90) | Uniswap V4 singleton holding ~10.20M apxUSD. The balance aggregates all pools and includes out-of-range positions, so it is an upper bound on inventory rather than executable depth. |

### Onchain Backing References

| Contract | Address | Type |
|----------|---------|------|
| STRCX (Strategy PP Variable xStock) | [`0x1aad217b8f78dba5e6693460e8470f8b1a3977f3`](https://etherscan.io/token/0x1aad217b8f78dba5e6693460e8470f8b1a3977f3) | Tokenized STRC preferred share (Payward / xStocks line). Ethereum total supply 1,697,133; Apyx Operations Safe holds **713,088 (~42%)**. This gives partial onchain visibility into the STRC component of apxUSD backing. |

### Shared AccessManager: alqUSD / aptUSD Product Family

Apyx launched [aptUSD](https://blog.apyx.fi/introducing-aptusd/) on September 1, 2026. Apyx describes aptUSD as a Treasury-backed yield token whose accounting asset is alqUSD. Both are governed by the **same AccessManager and Admin Safe** as apxUSD:

| Contract | Address | Notes |
|----------|---------|-------|
| alqUSD (Proxy) | [`0x15c91ebccb2c659b3a208214a103cbcb9d5f9671`](https://etherscan.io/address/0x15c91ebccb2c659b3a208214a103cbcb9d5f9671) | `ApxUSD` implementation code, [`0x7263…7125`](https://etherscan.io/address/0x7263857e9c0f59eb33e3cd9a130cb46827d97125); supply ~5.10M, cap 100M |
| aptUSD (Proxy) | [`0x093df218d70ea6036afa26704a1c70d12010b908`](https://etherscan.io/address/0x093df218d70ea6036afa26704a1c70d12010b908) | `ApyUSD` implementation code, [`0x8971…9bc2`](https://etherscan.io/address/0x8971851e204b525009416268cda59a9e21ef9bc2); `asset()` = alqUSD; supply ~2.10M |
| MinterV0 (alqUSD) | [`0xcbaf4ac85710bc0b678de6a25b33eed85fd1ca15`](https://etherscan.io/address/0xcbaf4ac85710bc0b678de6a25b33eed85fd1ca15) | Role 51 (1-hour exec delay); role 51 is the only role mapped to `alqUSD.mint(address,uint256,uint256)`. It holds no apxUSD mint role (role 4 was granted and then revoked in tx [`0x4d8e…6a7e`](https://etherscan.io/tx/0x4d8e37233ada3d9c82ac5bd0a734908a8b8461945a4ee73cd2ba426c6f816a7e)). |
| ApyxCollateralRatioOracleV1 / ApyxRedemptionOracle | [`0x8dcc40a043d79b93e542cf14e89fe4532a545341`](https://etherscan.io/address/0x8dcc40a043d79b93e542cf14e89fe4532a545341) / [`0xd2b39946f642fbb7db2cd5a817bf6a3f387b60f9`](https://etherscan.io/address/0xd2b39946f642fbb7db2cd5a817bf6a3f387b60f9) | UUPS proxies; ADMIN_ROLE-only `pushRound`. One round each, set to 1.0 on August 28, 2026. No apxUSD contract was found to read them. |

There is no verified mechanical path from alqUSD/aptUSD into apxUSD backing. The new MinterV0 cannot call `apxUSD.mint`, and the Wolf/Accountable reserve figures cover apxUSD. The shared exposure is governance: a compromise of the Admin Safe or AccessManager would affect both product families.

### On-Chain Verification (Etherscan, October 5, 2026)

All core contracts are **verified on Etherscan**:

| Contract | Etherscan Name | Verified | Proxy |
|----------|---------------|----------|-------|
| apxUSD | ERC1967Proxy → ApxUSD (impl) | Yes | Yes (UUPS) |
| apyUSD | ERC1967Proxy → ApyUSD (impl) | Yes | Yes (UUPS) |
| AccessManager | AccessManager | Yes | No |
| MinterV0 | MinterV0 | Yes | No |
| ApxUSDRateOracle | ERC1967Proxy → ApxUSDRateOracle (impl) | Yes | Yes (UUPS) |
| LinearVestV0 | LinearVestV0 | Yes | No |
| Peg-liquidity contract ([`0xc42c…45d7`](https://etherscan.io/address/0xc42c921e05e335768878de6484ef0767443845d7)) | — | **No** | No |
| CoW order contracts ([`0xda69…f997`](https://etherscan.io/address/0xda6977ebdd0ad90c93be11c48fff9950123ef997), [`0x2ab0…d512`](https://etherscan.io/address/0x2ab07a623a2fe2dce950f1a9012de8f201b4d512)) | — | **No** | No |

The core apxUSD/apyUSD contracts were compiled with Solidity 0.8.30 using OpenZeppelin v5.5.0. The peg-liquidity and CoW order contracts hold apxUSD and USDC and are AccessManager-governed, but their source is not verified on Etherscan. Their behaviour above is inferred from public getters and bytecode selectors only.

## Audits and Due Diligence Disclosures

### Audit History

| # | Firm | Date | Scope | Report |
|---|------|------|-------|--------|
| 1 | **Quantstamp** | Feb 2026 | APX USD Stablecoin | [Certificate](https://certificate.quantstamp.com/full/apx-usd-stablecoin/2a5be074-3d9f-49e7-aa08-46fb5f1e5bd6/index.html) |
| 2 | **Zellic** | Mar 2026 | Apyx Stablecoin | [Report (PDF)](https://github.com/Zellic/publications/blob/master/Apyx%20Stablecoin%20-%20Zellic%20Audit%20Report.pdf) |
| 3 | **Certora** | Mar 2026 | apxUSD (formal verification) | [Report](https://www.certora.com/reports/apyx-apxusd) / [PDF](https://github.com/Certora/SecurityReports/blob/main/Reports/2026/03_02_2026_Apyx_apxUSD.pdf) |

**Notes:**
- **Certora**: Published March 3, 2026. **14 total findings: 1 High severity (fixed and confirmed), 4 Medium, 9 Low/Informational.** Notable: M-01 flagged the backing model as entirely trust-based with no onchain verification. Repo tag `audit/2026-01-19-certora` confirms.
- All three audits are now publicly verifiable. The [Apyx docs audits page](https://docs.apyx.fi/resources/audits) lists all three with direct links.

### Reserve Attestations

| Period | Report Dates | Opinion Date | Latest Attested Assets | Standard / Opinion | Link |
|--------|--------------|--------------|-------------------------|--------------------|------|
| **March 2026** | March 24 and 31 | April 14 | $52,988,762 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#march-2026) |
| **April 2026** | April 9 and 30 | May 18 | $133,927,390 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#april-2026) |
| **May 2026** | May 5 and 31 | June 17 | $302,457,888 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#may-2026) |
| **June 2026** | June 17 and 30 | July 22 | $193,307,068 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#june-2026) |
| **July 2026** | July 20 and 31 | August 12 | $170,847,984 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#july-2026) |
| **August 2026** | August 13 and 31 | September 11 | $168,458,777 | AICPA examination; fairly stated in all material respects | [PDF section](https://docs.apyx.fi/collateral-and-custody/third-party-attestation#august-2026) |

**Notes:**
- The March–June PDFs were fetched through Chromium/Playwright on August 3, 2026. The July and August PDFs were downloaded directly from the GitBook file links on October 5, 2026, returned HTTP 200 `application/pdf`, and were read in full. All six are Independent Accountant's Reports conducted under AICPA attestation standards to obtain reasonable assurance; Wolf opines that management's asset assertions are fairly stated in all material respects.
- Scope is narrower than proof of solvency: the opinions cover the reported assets' existence, ownership, custody, and valuation at two dates per month. They do not opine on apxUSD liabilities or collateral coverage. The July and August management reports are titled *Monthly Securities Balance Attestation* and are limited to STRC, SATA, and STRCx. Cash and cash-equivalent balances are outside the attested figures.
- The reporting entity in the July and August opinions is **Preference Foundation** (or one of its subsidiaries). Securities are valued at observable closing market prices on each report date. Onchain STRCx is valued at the underlying STRC close because the STRCx market is thinly traded.
- The April–August reports name **Alpaca** as the U.S. brokerage holding offchain STRC/SATA. August 31 attests `$66,363,383` at Alpaca and `$102,095,394` of self-custodied onchain STRCx, totaling `$168,458,777`. **SATA is `$0` on all four July and August report dates.** The bank/custodian for cash and cash-equivalent balances is not named.
- The Operations Safe held 694,956 STRCx at Ethereum block [25,877,000](https://etherscan.io/block/25877000) (August 31). That is less than the `$102.1M` attested onchain STRCx at any STRC price below ~$147, so part of the attested STRCx sits in wallets this review did not identify. These could be on another chain. **TODO**: identify the remaining STRCx wallets.
- Six consecutive monthly reports confirm the publication cadence through August, with opinions issued 11–22 days after month-end. The September report is not yet listed; on the observed lag it would be due by around October 22.
- Docs mention a cash/short-term Treasuries buffer, but this review did not find a public breakdown of where those cash-equivalent assets are held, whether cash is bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another instrument, nor maturity/WAM details for the Treasuries component.
- The protocol's target or minimum overcollateralization requirement is not publicly disclosed. Accountable publicly reports the current ratio, which was 100.70% at this snapshot.

### Accountable Data Verification

| Provider | Mechanism | Status | Evidence |
|----------|-----------|--------|----------|
| **Accountable** | Data Verification Network / Proof-of-Reserves dashboard | Live since **April 23, 2026**; `frequency = live`; `connectors = 3`; `verifiability = 4`; `oracle = chainlink` | [Accountable Dashboard](https://accountable.apyx.fi/) / [DVN registry](https://dvn.accountable.capital/v1/stats) |

**Notes:**
- Accountable's registry (re-read October 5, 2026) lists Apyx as a `por` integration for ticker `apxUSD`, with API URL `https://api.accountable.apyx.fi/dashboard`, dashboard URL `https://accountable.apyx.fi`, and `oracle = chainlink`. The registry field indicates Accountable data is delivered through Chainlink, which is consistent with the [APXUSD / USD Exchange Rate](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5) feed. The exact mapping from the API's `redemption_value` (0.9984) to the feed's answer (1.000000) is not documented.
- [Apyx announced](https://telemetr.io/en/channels/3567636548-apyx_announcements/posts) that Accountable provides third-party assurance on reserves with near-real-time visibility into outstanding supply, reserve composition, collateral coverage, and cross-platform distribution.
- **Live data retrieved on October 5, 2026 at 14:46 UTC** (direct HTTPS request with browser headers): the API returned `$177,772,906.34` of asset reserves against `$176,544,148.56` of circulating supply. That gives a `1.006960` collateral ratio, and the API reports a `$0.9984` redemption value. The response separately reported `$60,664,350.58` of inventory and `$65,265,015.68` of protocol-owned liquidity. Including those categories produced `$303,702,272.60` of total reserves against `$302,473,514.82` total supply, which matches onchain Ethereum `totalSupply()`. Accountable marked the snapshot `verifiability = 100` and included Nitro-enclave attestation material, a signed merkle root, and zk proofs over the liability and collateral data.
- The API identities reconcile: asset reserves equal STRC (`$153,984,542.64`) plus Cash & Equivalents (`$23,782,952.77`) plus Other (`$5,410.93`), while circulating supply equals total supply less inventory and protocol-owned liquidity. The displayed collateral ratio is asset reserves divided by circulating supply, rather than all reported reserve categories divided by total supply.
- **Coverage trend (API daily timeline):** asset-reserve coverage rose from 96.05% on August 10 to 98.82% on August 25, 99.53% on September 5, and first exceeded 100% on September 20 (100.49%). It peaked at 101.68% on October 1. Over the same period, circulating supply fell from ~229.98M to ~176.54M while protocol inventory rose from ~29.42M to ~60.66M. Apyx-held apxUSD (inventory plus POL, ~$125.9M) is now **41.6% of total supply**. The coverage ratio therefore depends on treating that protocol-held apxUSD as non-circulating.
- Onchain cross-check of inventory and POL is partial. Identified Apyx-controlled apxUSD includes the Guardian Safe (~13.49M), the Liquidity Safe (~15.91M), the Liquidity Safe's share of the Curve v3 pool (~2.66M apxUSD + ~1.42M USDC), and the CoW/peg contracts (~1.11M). The Guardian Safe also holds ~6.93M apyUSD, worth ~9.96M apxUSD at 1.4375. That totals ~$43M of apxUSD. The remaining ~$83M of reported inventory and POL is not reconciled to addresses in this review (**TODO**). Candidates include Uniswap V4 positions, Pendle, and remote chains.
- The remaining methodological limitation is valuation, not availability. The API does not expose source-level timestamps or explain whether STRC/SATA coverage uses last-traded prices, broker/custodian marks, modeled fair values, bid-side liquidation marks, or another source when Nasdaq is closed.

**How Accountable works (as understood from public materials):**
- [Accountable](https://docs.accountable.capital/accountable-documentation/data-verification-network-dvn) is a third-party data-verification provider. Its system connects to data sources, ingests reserve/liability data, and publishes a dashboard/API for proof-of-reserves or proof-of-solvency reporting.
- Accountable's public DVN registry assigns Apyx `verifiability = 4`, `connectors = 3`, and `frequency = live`. In Accountable's own verification-level model, level 3 is direct connector-based data sourcing, level 4 adds secure-enclave based verification (hardware-level attestation such as SGX/Nitro), and level 5 is zkTLS. Therefore, the Apyx integration should be treated as a live third-party connector/enclave verification system, **not** as a fully onchain or fully zkTLS-backed proof.
- For Apyx, the live dashboard compares token liabilities/outstanding supply against offchain reserve assets and shows reserve composition and collateral coverage. Its API `supply_split` itemizes Ethereum only (equal to total supply). Remote supply is therefore counted through the Ethereum CCIP escrow, and route-level Base/BNB/Solana reconciliation is not available there.

**Trustworthiness assessment:**
- **Useful and materially better than self-reporting.** The live Accountable dashboard and public JSON API are independently inspectable and introduce a data-verification layer between attestations. This is sufficient to clear the framework's unverifiable-reserves gate.
- **Inventory/POL classification is self-defined.** The 100.70% ratio excludes ~$125.9M of Apyx-held apxUSD from liabilities. That treatment holds only while the inventory is genuinely held by Apyx and not redeemable against reserves. On a total-supply basis, asset reserves cover 58.8% of supply. The remaining reserve categories are protocol-held apxUSD and liquidity positions rather than external assets.
- **Not trustless.** Accountable does not make the preferred-share collateral onchain, does not by itself enforce minting limits, and does not remove the need to trust the completeness of connected accounts, custody setup, connector configuration, enclave implementation, and Accountable's own operations.
- **Not a substitute for formal attestation/audit.** The Wolf & Company attestation remains important because it is an examination-level accounting opinion. Accountable is best treated as continuous monitoring evidence.

### On-Chain Complexity

The architecture is moderately complex:
- **UUPS Proxy Pattern**: apxUSD, apyUSD, and ApxUSDRateOracle all use ERC-1967 UUPS upgradeable proxies
- **AccessManager**: Centralized role-based access control (OpenZeppelin AccessManager) governs all contracts
- **Two-Step Minting**: EIP-712 signed orders → AccessManager-scheduled execution with rate limiting
- **Yield Distribution**: YieldDistributor → LinearVestV0 (~17-day linear vesting) → apyUSD vault
- **Cooldown Mechanism**: UnlockToken contract enforces withdrawal cooldown for apyUSD

### Bug Bounty

**No active bug bounty program found.** Searches across Immunefi, Sherlock, Cantina, HackerOne, and Safe Harbor found no listing. On October 5, 2026, `immunefi.com/bug-bounty/apyx` returned 404 and Cantina returned "Bounty not found". This is a notable gap.

## Historical Track Record

- **Time in Production**: apxUSD proxy deployed February 18, 2026 (block [24481772](https://etherscan.io/tx/0xfb528661b410cce683a1ee40b49a5249dbd677e8304a102927bc6639486f450b)). In production for **~229 days** as of October 5, 2026, or about 7.5 months.
- **GitHub Repository**: [`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts) — public Foundry repo. Contains all core contract source code, comprehensive test suite (invariant tests, audit-remediation tests), Slither CI. No license specified.
- **TVL History**: Not tracked by DeFi Llama (`api.llama.fi/protocol/apyx-apxusd` returns 400). Listed on CoinGecko. Based on onchain data (October 5, 2026):
  - Ethereum apxUSD `totalSupply`: **~302.47M** (supply cap 750M)
  - Base supply: ~9.64M apxUSD and ~0.35M apyUSD
  - BNB Chain supply: ~2.57M apxUSD
  - Solana supply: **TODO** (~6.01M implied by Ethereum escrow less Base and BNB supply)
  - apyUSD vault totalAssets: ~167.18M apxUSD
  - Curve v3 pool: ~3.12M apxUSD + ~1.66M USDC; original Curve pool ~$5.7K
  - Guardian/Upgrader Safe: **~13.49M apxUSD + ~6.93M apyUSD**, 0 USDC
  - Liquidity Safe: ~15.91M apxUSD + ~0.76M USDC + 85.3% of Curve v3 LP
  - Operations Safe: ~1 apxUSD, 0 apyUSD, ~0.6 USDC, holds **713,088 STRCx (~42% of Ethereum STRCx supply)** as onchain backing
  - Third-Party Safe: 0 apxUSD, ~5.79M apyUSD
- **Supply History**: ~13M at launch → ~67M on March 26 → ~175M on April 19 → ~306.86M on May 7 → ~524.66M peak (late May/June) → ~312.07M on August 1 → **~302.47M on October 5**. The contraction from peak was executed through onchain `burn`/`burnFrom` calls and reflects the redemption wave that followed the June depeg. Burns are observable onchain rather than settled exclusively offchain.
- **Incidents**: **One material incident — the June 2026 depeg (below).** No exploit, realized custody loss, or smart-contract failure was identified. Accountable asset-reserve coverage of circulating supply was 92.24% on August 3 and first exceeded 100% on September 20. It was 100.70% at this snapshot.
- **Peg Stability**: **Broken in early June 2026; largely but not fully recovered.** apxUSD traded at $0.881 on August 1, crossed $0.95 in mid-August, and was $0.988 on October 5 (−1.2%). DefiLlama marks touched $0.991 on September 29 and $0.993 on October 2 but have not held above $0.99. Note that Curve `get_virtual_price()` is *not* a peg measure. It is a cumulative LP-share accumulator that only rises with fee accrual and cannot fall during a depeg, so peg quality must be read from market price.

### June 2026 Depeg

The protocol's first major stress event, documented by Apyx in a [post-mortem published June 8, 2026](https://blog.apyx.fi/post-mortem/). Prices below are DefiLlama daily marks for [`0x98a878B1…4665`](https://coins.llama.fi/chart/ethereum:0x98a878B1CD98131b271883b390F68d2c90674665).

| Date | Event | apxUSD |
|------|-------|--------|
| Late May 2026 | BTC falls ~30% in a month, ~20% in a week. STRC declines from par to **$90.38** — its largest drawdown on record. | ~$1.00 |
| ~Jun 1–3 | apxUSD trades below NAV; deepest wicks occur overnight while Nasdaq is closed. | **$0.90** |
| Jun 1–5 | Guardian Safe withdraws ~88% of its Curve LP (40,890,164 → <10,000,000 by block [25252968](https://etherscan.io/block/25252968)). | ~$0.90 |
| Jun 8 | Post-mortem published. Partial recovery as redemptions are processed. | ~$0.96 |
| Jun 15 | [Apyx 2.0](https://blog.apyx.fi/apyx-2-0-redemption-value-total-collateralization-evolution-of-the-dividend-backed-dollar/) announced — redemption value and total collateralization model. | ~$0.96 |
| Jun 26–29 | Second leg down; daily low **$0.749** (−25%). | **$0.75** |
| Jul 6 | Guardian Safe's remaining Curve LP goes to 0 (block [25474518](https://etherscan.io/block/25474518)). | ~$0.88 |
| Jul 30 | Curve apxUSD-USDC v3 pool [created](https://etherscan.io/tx/0x54cba1d2047ad9fd74a965ed23b4ac76376788d87b54eae6154845193d353705). The Liquidity Safe holds 85.3% of its LP at the October 5 snapshot. | ~$0.88 |
| Aug 1 | Discount persists; 8+ weeks without recovery to par. | **$0.881** |
| Aug 7 | Peg-liquidity contract [`0xc42c…45d7`](https://etherscan.io/address/0xc42c921e05e335768878de6484ef0767443845d7) deployed against the Curve v3 pool and the Chainlink NAV feed. | ~$0.93 |
| Aug 21–25 | Recovery through $0.95; Accountable coverage reaches 98.8%. | ~$0.95–0.97 |
| Sep 16 | Chainlink [APXUSD / USD Exchange Rate](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5) reaches 1.000000. Sampled rounds show it as low as 0.798653 on June 26. | ~$0.97 |
| Sep 20 | Accountable asset-reserve coverage first exceeds 100% (100.49%). | ~$0.98 |
| Oct 1 | CoW Protocol order contract [`0xda69…f997`](https://etherscan.io/address/0xda6977ebdd0ad90c93be11c48fff9950123ef997) deployed. | ~$0.99 |
| Oct 5 | Snapshot: Accountable coverage 100.70%, redemption value $0.9984. | **$0.988** |

**Root causes** (Apyx's own accounting, in the post-mortem):
1. **Collateral shock** — STRC, the majority of the backing basket, fell to $90.38 as BTC sold off. Apyx notes STRC is ~80% retail-held, which thinned liquidity into the decline.
2. **Overnight/weekend liquidity gap** — the deepest dislocations occurred while US equity markets were closed. The protocol could neither sell STRC nor confidently bid apxUSD without knowing where STRC would open. This is the structural TradFi/DeFi mismatch flagged as an inferred stress path in the prior assessment; it materialized as described.
3. **Transparency dashboard displayed an incorrect NAV** — a bug in the STRCX pricing feed caused the public dashboard to show a *higher* NAV than the team's internal figures. Users transacted against wrong reserve data during the most critical window. Apyx also notes the Accountable dashboard grouped POL and inventory into "Cash & Equivalents," which led external analysts to misread collateral composition.
4. **Operational plumbing** — mint/redeem is manual by design (multisig, time delays, daily caps); the coordination required exceeded what the setup could deliver at the pace of the event.
5. **POL withdrawal** — the Guardian Safe removed the bulk of the only permissionless exit venue during the drawdown (see *Protocol-Owned Liquidity*).

**What held**: Apyx states that the protocol remained solvent throughout and that reserves exceeded the market value of circulating supply. Accountable's August 3 snapshot reported a 92.24% asset-reserve ratio, consistent with redemption below par rather than full dollar backing during the discount. The current API does not retroactively prove every reserve mark during the June event. Independently observable outcomes are narrower: the apyUSD/apxUSD redemption rate did not decline; the unlock window remained active; and the apyUSD/apxUSD Morpho market saw no STRC-driven liquidations because its oracle is the redemption rate rather than spot or DEX price. Apyx also reports that redemptions were processed proportionally across the asset basket.

**Why recovery took four months**: no deep onchain pool remained for arbitrage, direct apxUSD redemption is permissioned and priced at redemption value, and the separate apyUSD exit can take up to 20 days. Apyx 2.0's explicit redemption-value model means the market prices forward STRC drawdown risk into apxUSD rather than treating $1 as a floor. STRC itself traded around **$84 (−16% below par)** by [July 1, 2026](https://blog.apyx.fi/strategy-strc-everyones-wrong-but-were-right/). The price converged as reserve coverage rebuilt toward 100%, circulating supply contracted to ~176.5M, and Apyx re-seeded protocol-owned venues. These were the new Curve v3 pool, a Chainlink-NAV-bounded peg contract, and CoW Protocol orders. The recovery therefore again rests on **issuer-controlled liquidity**, the same property that failed in June. Apyx's [TGE update](https://blog.apyx.fi/apyx-tge-update/) (September 23, 2026) postponed the APYX token launch, citing STRC's drawdown as having "revealed gaps we needed to close".

### Ethereum apxUSD Supply Distribution

Snapshot at block [26,126,833](https://etherscan.io/block/26126833) (October 5, 2026), supply ~302.47M:

| Holder | Balance | % of Supply |
|--------|---------|-------------|
| apyUSD Vault (`totalAssets`) | ~167.18M apxUSD | ~55.3% |
| CCIP LockReleaseTokenPool (escrow for Base/BNB/Solana) | ~18.22M apxUSD | ~6.0% |
| Liquidity Safe ([`0xe6f8…3c46`](https://etherscan.io/address/0xe6f8ad24367c1038ad1ce15af72a62408ba33c46)) | ~15.91M apxUSD | ~5.3% |
| Guardian/Upgrader Safe ([`0xf986…3ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2)) | ~13.49M apxUSD | ~4.5% |
| Uniswap V4 PoolManager | ~10.20M apxUSD | ~3.4% |
| Curve apxUSD-USDC v3 Pool | ~3.12M apxUSD | ~1.0% |
| CoW order contract + peg-liquidity contract | ~1.11M apxUSD | ~0.4% |
| Curve Pool (original) | ~3,790 apxUSD | <0.01% |
| Admin Safe (4-of-6) | 0 | 0% |
| Operations Safe | ~1 apxUSD (holds 713,088 STRCx) | <0.01% |
| Third-Party Safe | 0 apxUSD (holds ~5.79M apyUSD) | 0% |
| Other (Pendle, Morpho, users, etc.) | ~73.25M — **TODO: holder-level reconciliation incomplete** | ~24.2% |

Notes: the apyUSD vault row is `totalAssets()`, which includes apxUSD held directly by the vault **plus** vested apxUSD claimable from LinearVestV0 — it is not purely a token balance. The original Curve pool was drained by the Guardian Safe in two stages: ~88% of the LP between June 1 and June 5, 2026, and the remainder by July 6 (LP balance 40,890,164 → 0).

Base apxUSD totalSupply is ~9,636,756, Base apyUSD totalSupply is ~346,931, and BNB Chain apxUSD supply is ~2,574,052 as of October 5. These are claims on the CCIP escrow row above, not additional Ethereum supply. Solana supply could not be read (**TODO**). A full cross-chain liability-versus-escrow reconciliation remains **TODO** because Accountable's `supply_split` itemizes Ethereum only.

## Funds Management

### Minting & Redemption

**Minting apxUSD**: **Permissioned, no onchain collateral required.** Minting creates tokens without any backing asset transfer in the transaction. The `ApxUSD.mint()` function only checks that the caller has the authorized mint role and that `totalSupply` does not exceed `supplyCap` — then calls `_mint(to, amount)`. **No `transferFrom`, no collateral deposit, no onchain proof of backing.** The collateral relationship is offchain and is checked after the fact through Accountable's live feed and Wolf's periodic examination reports rather than enforced atomically at mint.

Minting uses EIP-712 structured data signing via MinterV0 with onchain safeguards including per-order limits, rate limits, execution delay, and nonce-based replay protection.

**Minting roles (verified onchain October 5, 2026):**
- **MinterV0** ([`0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e`](https://etherscan.io/address/0x2c36e1adfaa80ee0324b04cc814f5207bb7ba76e)): Holds `MINT_STRAT_ROLE` (role 1) with **60-second execution delay**, and role 4 with **4-hour execution delay**. `getTargetFunctionRole(apxUSD, mint(address,uint256,uint256))` = 4, so the 4-hour path is the live apxUSD mint gate.
- On August 26, 2026, role 4 was granted to the new alqUSD MinterV0 [`0xcbaf…ca15`](https://etherscan.io/address/0xcbaf4ac85710bc0b678de6a25b33eed85fd1ca15). Because of the role's 3-day grant delay, the `RoleGranted` event set it to take effect on August 29. It was revoked on August 27 in tx [`0x4d8e…6a7e`](https://etherscan.io/tx/0x4d8e37233ada3d9c82ac5bd0a734908a8b8461945a4ee73cd2ba426c6f816a7e), before it became active. This was the grant delay working as designed. That contract now holds only role 51, which mints alqUSD. MinterV0 is the only verified apxUSD mint-role holder.
- **Current Admin Safe** ([`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)): Holds ADMIN_ROLE with 0 execution delay. `getRoleGrantDelay` is 3 days for roles 1 and 4, and `getTargetAdminDelay(apxUSD)` is 3 days. The admin therefore cannot instantly create a new minter path without running into role-grant or target-admin-delay timelocks (see Governance section).
- **Supply cap**: `setSupplyCap` on apxUSD is gated to role 23, held by the Guardian Safe with a 1-day execution delay. The cap is 750M.

General users acquire apxUSD through secondary markets (Curve, Uniswap, CoW Protocol).

**Minting apyUSD**: **Permissionless** -- any user can deposit apxUSD into the ERC-4626 vault to receive apyUSD. No KYB/KYC required (certain jurisdictions restricted via frontend).

**Redeeming apyUSD → apxUSD**: Uses UnlockToken contract with:
1. User requests redemption (exchange rate locks at this point)
2. **Cooldown of up to 20 days** (`UnlockToken.unlockingDelay() = 1,728,000s`; no yield accrual during cooldown)
3. User claims assets after cooldown
- `apyUSD.unlockingFee() = 1e15` (**0.1%**), paid to the [Fee Wallet](https://etherscan.io/address/0x6F93635F2A1C19b4F7f1BD9BA655F6A073C629Dc) and settable by the admin via `setUnlockingFee`. The post-mortem describes the user-facing schedule as a **3-to-20-day window with a fee declining linearly from 3.5% to 0.1%**; only the 0.1% terminal fee is readable onchain, and the declining schedule could not be located in the UnlockToken or apyUSD ABIs — **TODO**: identify where the early-exit fee is computed.
- Adding assets to existing request **resets the cooldown**
- Only one pending request at a time
- `redeemForMinAssets(uint256,uint256,address)` on the current implementation lets a redeemer set a minimum-assets bound, i.e. redemption output is not guaranteed to be a fixed rate at claim time.

**Redemption value (Apyx 2.0)**: Following the June depeg, Apyx [announced a redemption-value and total-collateralization model](https://blog.apyx.fi/apyx-2-0-redemption-value-total-collateralization-evolution-of-the-dividend-backed-dollar/) (June 15, 2026). Redemption is priced off protocol-computed redemption value rather than an implicit $1, which means whitelisted redeemers can be paid **below par** when collateral marks are below par. This is a design change to the exit path and a contributor to why the market prices apxUSD below $1 rather than treating par as a floor. Apyx states in its [TGE update](https://blog.apyx.fi/apyx-tge-update/) that NAV "was published onchain throughout via Chainlink". The matching onchain artifact is the [APXUSD / USD Exchange Rate](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5) feed. It is consumed by Apyx's peg-liquidity and CoW order contracts as their reference price. This review did not identify it as an input to apxUSD, MinterV0, or apyUSD. The feed reads 1.000000 while Accountable's `redemption_value` is 0.9984. Accountable's registry lists `oracle = chainlink` for Apyx, but whether the feed is capped at 1.0 is **TODO**. Direct apxUSD mint/redeem remains permissioned and largely offchain.

### Accessibility

- **apxUSD deposits (into Morpho, Curve, etc.)**: Permissionless
- **apxUSD minting/redemption**: Permissioned (whitelisted entities only)
- **apyUSD deposits**: Permissionless
- **apyUSD redemptions**: Permissionless but subject to the unlock cooldown (up to 20 days) and to the deny list
- **Geographic restrictions**: US, EU, EEA, and sanctioned jurisdictions restricted

### Collateralization

- **Backing**: Preferred shares from publicly-traded DAT companies plus a documented cash/short-term Treasuries buffer. STRC is held offchain at Alpaca and onchain as STRCx; SATA was $0 on every July and August Wolf report date. Accountable's October 5 snapshot reports **100.70% asset-reserve coverage of circulating supply**, with $153.98M STRC, $23.78M cash & equivalents, and $5.4K other. The redemption value is **$0.9984**. Coverage was 92.24% on August 3 and first exceeded 100% on September 20. The buffer above par is ~$1.23M (Accountable `net`), which a ~0.8% fall in STRC marks would erase.
- **Collateral quality**: Variable-rate perpetual preferred shares. These are equities (not stablecoins or crypto assets). They sit subordinated to debt obligations in the capital structure. The preferred shares have dividend adjustment mechanisms that theoretically stabilize their price near par value. Asset reserves are now **~86.6% STRC**, a single issuer, and ~13.4% cash/equivalents.
- **Cash & equivalents**: Apyx docs state that the backing includes cash and short-term Treasuries as a liquidity/volatility buffer, but do **not** publicly specify the exact instruments, allocation, maturity profile, account type, bank/broker/custodian, or whether any portion is held as bank cash, brokerage sweep cash, money-market exposure, Treasury bills/notes, or another cash-equivalent instrument. No CEX custody for this buffer is described in the docs reviewed.
- **Custody**: Docs describe collateral as held in third-party prime brokerage accounts with multi-party MPC key management. The April–August Wolf reports name **Alpaca** as the U.S. brokerage holding offchain STRC/SATA, and onchain STRCx is self-custodied. The bank/custodian for cash and cash-equivalent balances remains unnamed.
- **Onchain verification**: Partial, and growing. By August 31, onchain STRCx ($102.1M) exceeded STRC held at Alpaca ($66.4M) in the Wolf report. The Apyx Operations Safe ([`0x37b0…a555`](https://etherscan.io/address/0x37b0779a66edc491df83e59a56d485835323a555)) holds **713,088 STRCx** ([`0x1aad…77f3`](https://etherscan.io/token/0x1aad217b8f78dba5e6693460e8470f8b1a3977f3)), the Payward-issued tokenized version of STRC (xStocks line, custodied 1:1 against the underlying preferred shares). That is **~42% of Ethereum STRCx supply**. At DefiLlama's STRCx mark of $104.06 it is worth ~$74.2M, about 42% of circulating supply and ~24.5% of total supply. Wolf values STRCx at the underlying STRC close rather than the thin STRCx market. The rest of the attested onchain STRCx is in wallets not identified here (**TODO**). The remaining backing depends on offchain STRC and cash attestations.
- Off-chain verification:
  - **Six downloadable Wolf & Company examination reports** cover March–August 2026. All PDFs returned HTTP 200 with valid extractable content. Conducted under AICPA attestation standards, the opinions cover asset existence, ownership, custody, and valuation, but not liabilities or overall collateral coverage. The July and August reports are explicitly limited to securities, so cash is not attested.
  - Accountable's public API was retrieved on October 5, 2026. It reports `$177.77M` asset reserves against `$176.54M` circulating supply (100.70%), with `verifiability = 100`, Nitro-enclave attestation material, a signed merkle root, and zk proofs over liability and collateral data.
  - Underlying shares are publicly-traded and priced transparently on Nasdaq — which also means reserve marks move with a volatile equity, as June demonstrated.

### Provability

- **apxUSD backing**: Hybrid offchain and tokenized. The [attestation page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation) publishes six downloadable Wolf & Company examination reports for March–August 2026. The reports were independently fetched and read. They provide reasonable assurance over reported securities existence, ownership, custody, and valuation at two dates per month. They do not test token liabilities, cash balances (July/August), or collateral coverage.
- **Reserve reporting failed during the stress event.** Apyx's own post-mortem records that the public transparency dashboard displayed an **inflated NAV** throughout the June drawdown, caused by a bug in the STRCX pricing feed, and that the team's internal admin dashboard carried different, more accurate numbers. The Accountable dashboard separately grouped protocol-owned liquidity and inventory into "Cash & Equivalents," which Apyx says led multiple external analysts to misread collateral composition. The proof-of-reserves surface was wrong precisely when holders most needed it — this is the single strongest argument against treating the reporting stack as reliable.
- **Accountable data verification**: Accountable's DVN registry lists an Apyx/apxUSD Proof-of-Reserves dashboard live since April 23, 2026 (`frequency = live`, `connectors = 3`, registry verification level `4`). The [public API](https://api.accountable.apyx.fi/dashboard) returned a fresh, internally reconcilable snapshot on October 5, 2026, with `verifiability = 100` plus Nitro-enclave attestation material. Its total supply matched onchain `totalSupply()`. This is meaningful transparent verification and clears the critical gate. It does not make the reserve assets onchain or eliminate valuation/model risk, particularly given the June NAV incident and the absence of source-level freshness metadata in the response.
- **apyUSD exchange rate**: Calculated onchain via ERC-4626 standard (`convertToAssets()`/`convertToShares()`). The exchange rate is not directly admin-set and does not use the manually-set ApxUSDRateOracle. It is derived from `totalAssets() / totalSupply()`, where `totalAssets()` includes apxUSD held directly by the apyUSD vault plus vested apxUSD available from LinearVestV0. Anyone can verify this onchain. Current rate: **~1.4375 apxUSD per apyUSD** (`totalAssets` ~167.18M / `totalSupply` ~116.29M). This rate held through the June drawdown — LinearVestV0 ingests only realized dividends and never references STRC market price, so the ratchet did not reverse. Note that a stable apyUSD/apxUSD rate says nothing about the USD value of apxUSD itself.
- **Yield distribution**: Semi-programmatic. Authorized operators/admins can initiate the amount of apxUSD yield sent into YieldDistributor/LinearVestV0; there is no onchain oracle that independently verifies the offchain dividend amount before it is distributed. Once apxUSD is deposited into LinearVestV0, vesting is programmatic (~17-day linear), and the apyUSD vault pulls vested yield, increasing `totalAssets()` and therefore the ERC-4626 exchange rate. This means the **PPS formula is onchain-verifiable**, but the **correctness of the yield amount relative to real offchain dividends remains trust/attestation-based**.
- **Rate oracle**: The ApxUSDRateOracle is **manually set** by a role-0 caller via `setRate()`. Currently 1.000000. No onchain price feed, no TWAP, no staleness check. **Crucially, `getTargetFunctionRole(oracle, setRate)` is 0 (ADMIN_ROLE) and `getTargetAdminDelay(oracle)` is 0 — the current Admin Safe can change the oracle rate instantly with no timelock.** It prices the original, now-drained Curve pool. The Curve v3 pool was [deployed](https://etherscan.io/tx/0x54cba1d2047ad9fd74a965ed23b4ac76376788d87b54eae6154845193d353705) by `deploy_plain_pool` with zero oracle addresses and method IDs, so the v3 pool does **not** read this oracle.
- **Chainlink NAV feed**: The [APXUSD / USD Exchange Rate](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5) Chainlink feed (631 rounds since April 23, 2026) publishes an apxUSD NAV/redemption rate onchain. Feed history tracks the depeg and recovery: 0.951185 on June 5, 0.798653 on June 26, 0.913 on July 28, and 1.000000 from September 16. The feed improves observability. Accountable's registry lists `oracle = chainlink` for Apyx, so Accountable is the likely upstream. The feed reads 1.000000 while the API's `redemption_value` is 0.9984. Any capping logic is **TODO**.
- **Cross-chain supply**: apxUSD and apyUSD trade on Base, and apxUSD is also live on BNB Chain and Solana. The Ethereum CCIP LockReleaseTokenPool maps all three remote tokens and escrows canonical apxUSD. This adds a bridge/infrastructure dependency: remote liquidity and cross-chain supply accounting depend on CCIP operation, token-pool/admin configuration, and escrow remaining reconciled to remote supply. Accountable's API currently itemizes Ethereum only in `supply_split`, so full route-by-route reconciliation remains **TODO**.

## Liquidity Risk

### Primary Exit Mechanisms

For the Morpho collateral use case, the relevant question is: how can liquidators exit an apxUSD position?

1. **Curve apxUSD-USDC v3 Pool** ([`0x6f63…c87c`](https://etherscan.io/address/0x6f63deedc9870d6c16fc644c6654748352cdc87c)): ~3.12M apxUSD + ~1.66M USDC, A = 100, 0.20% fee. `get_dy` quotes at the snapshot block: 1K apxUSD → 990.58 USDC, 100K → 98,983 USDC, **1M → 975,442 USDC** (~2.5% below par), and 2M → 1,595,569 USDC (~20% below par). This is the deepest measured Ethereum exit, but **85.3% of its LP belongs to the Apyx Liquidity Safe**.
2. **Uniswap V4**: ~10.20M apxUSD sits in the PoolManager singleton. The balance is an upper bound on inventory, **not** executable depth: it aggregates all pools and includes out-of-range concentrated-liquidity positions. Depth at a given slippage was not independently measured in this review.
3. **CoW Protocol orders**: The Apyx CoW order contract holds ~929K apxUSD and ~357K USDC. Its orders are signed by an EOA operator and bounded by the Chainlink NAV feed. This is issuer inventory offered through a batch-auction venue, not third-party depth. Order pricing logic is unverified.
4. **Direct apxUSD Redemption**: Available only to whitelisted entities and priced at redemption value rather than par (Apyx 2.0). This permissioned/manual primary-market process is distinct from apyUSD's onchain 20-day UnlockToken cooldown; no fixed apxUSD cooldown was verified. It is not a general exit path.
5. **Pendle**: PT-apxUSD positions provide some additional secondary market activity.
6. **Original Curve pool** ([`0xe1b9…a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414)): drained (~3,790 apxUSD + ~1,956 USDC). Not an exit path.

### Liquidity Assessment

- **The discount has mostly closed.** apxUSD traded 11–25% below par from early June through July, then recovered to $0.988 by October 5. Holders who exited during June–August took double-digit losses. A small holder can now exit at about 1% below par.
- **Exit depth is ~$1M before slippage exceeds ~2.5%.** On Curve v3, a 1M apxUSD sale clears at ~2.5% below par; 2M clears ~20% below par. CoW orders and Uniswap V4 add some depth that was not measured.
- **Supply-to-liquidity**: ~302M supply against ~10.2M of Uniswap V4 inventory plus ~3.1M on Curve v3 is a **~23× ratio** on the most generous reading of depth. The effective ratio is worse.
- **Do not read the Curve virtual price as peg health.** `get_virtual_price()` (1.0065 original, 1.0104 v3) is a cumulative fee accumulator, monotonically non-decreasing, and would keep rising through a depeg. Use market price.
- **Morpho context**: third-party exit depth for liquidators is still thin. Most of the measured depth is Apyx-controlled: 85.3% of the Curve v3 LP, the CoW inventory, and the peg-liquidity contract. A liquidator unwinding more than ~$1M onchain depends on Apyx keeping that liquidity in place.

### Protocol-Owned Liquidity (POL) Concentration

The concentration risk flagged at the prior assessment materialized, and the timing matters: **the Guardian Safe pulled its liquidity as the peg broke, not after it stabilized.**

Guardian Safe LP balance on the Curve pool, read at block:

| Block | Date | LP balance |
|-------|------|-----------|
| 25200000 | May 29, 2026 | 40,890,163 |
| 25252968 | **Jun 5, 2026** | <10,000,000 |
| 25260000 | Jun 6, 2026 | 4,817,606 |
| 25440000 | Jul 1, 2026 | 4,817,606 |
| 25474518 | Jul 6, 2026 | **0** |

- ~88% of the position was removed between June 1 and June 5 — the same days apxUSD first traded to $0.90 and the post-mortem's "deepest wicks" occurred. The remaining tranche was withdrawn July 6.
- Apyx's post-mortem gives the rationale: with Nasdaq closed the protocol "could not confidently bid apxUSD" without knowing where STRC would open, and defending a price above realizable NAV would have burned cash. That is a coherent treasury decision — but the effect on users is that the only permissionless exit was withdrawn at the moment of maximum need, and the report scores the effect, not the intent.
- The withdrawal required no protocol permission: Curve `remove_liquidity` has no admin gate, no timelock, and no AccessManager involvement. A Safe transaction at the Guardian Safe's then-current 3-of-6 threshold was sufficient, and the same is true of any venue Apyx seeds.
- **Implication for liquidators**: the ~$29M of original Curve depth no longer exists and was never third-party depth to begin with.

**Re-seeded POL (July–October 2026).** Apyx has rebuilt issuer-controlled liquidity:

- **Curve v3** ([`0x6f63…c87c`](https://etherscan.io/address/0x6f63deedc9870d6c16fc644c6654748352cdc87c)): the 2-of-4 Liquidity Safe holds 85.3% of the LP, a lower signing threshold than the 3-of-6 Safe that drained the original pool.
- **Peg-liquidity contract** ([`0xc42c…45d7`](https://etherscan.io/address/0xc42c921e05e335768878de6484ef0767443845d7)): an EOA with role 42 can trade or withdraw against the Curve v3 pool within a 2% slippage bound and a 24-hour NAV-staleness bound. Withdrawals go to the Guardian Safe.
- **CoW order contract** ([`0xda69…f997`](https://etherscan.io/address/0xda6977ebdd0ad90c93be11c48fff9950123ef997)): an EOA with roles 43/44 signs NAV-bounded orders and can withdraw tokens to the Liquidity Safe. Changing the withdraw receiver requires role 24 (Guardian Safe, 3-day delay).
- Accountable reports POL at ~$65.27M, but only part of that is visible in the venues above (see *Accountable Data Verification*).

The same property that failed in June applies to all of it. Removing the LP or withdrawing inventory needs only a Safe or EOA transaction with no timelock, and the issuer has already shown it will step back when it cannot price STRC. Treat this liquidity as withdrawable at the issuer's discretion when it is most needed.

## Centralization & Control Risks

### Governance

Apyx uses an OpenZeppelin AccessManager v5 (`0xe167330e2eac88666de253e9607c6d9ae0ca2824`) for centralized role-based access control across all contracts. **Governance was restructured on 2026-03-20/21.**

**Role assignments (verified onchain October 5, 2026):**

| Role ID | Label (inferred) | Current Holder(s) | Execution Delay |
|---------|------------------|-------------------|-----------------|
| 0 | ADMIN_ROLE | Admin Safe **4-of-6** ([`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)) | 0 seconds |
| 1 | MINT_STRAT | MinterV0 | 60 seconds |
| 4 | apxUSD `mint(address,uint256,uint256)` | MinterV0 | 14,400 seconds (4 hours) |
| 7 | YIELD_OPERATOR | Guardian/Upgrader Safe 4-of-7 | 0 seconds |
| 21 | PAUSER | Guardian/Upgrader Safe 4-of-7 | 0 seconds |
| 22 | UNPAUSER | Guardian/Upgrader Safe 4-of-7 | 14,400 seconds (4 hours) |
| 23 | apxUSD `setSupplyCap` | Guardian/Upgrader Safe 4-of-7 | 86,400 seconds (1 day) |
| 24 | UPGRADER (apxUSD, apyUSD) | Guardian/Upgrader Safe 4-of-7 | **259,200 seconds (3 days)** |
| 25 | UPGRADER (alqUSD, aptUSD, new oracles) | Guardian/Upgrader Safe 4-of-7 | 604,800 seconds (7 days) |
| 31 | (distributed to 6 new-Admin-Safe owners + former Admin Safe) | multiple | 0 seconds |
| 42 | Peg-liquidity operator | EOA [`0x2a55…77b0`](https://etherscan.io/address/0x2a55dd001195eee92aeb8983dccedf1700a077b0) | 0 seconds |
| 43 | CoW order signer | EOA [`0x5820…0df1`](https://etherscan.io/address/0x58209e67a777132efaaac2d6959d9fa6de330df1) | 0 seconds |
| 44 | CoW `withdrawTokens` | Guardian Safe, the EOA above, and the retired CoW contract | 0 seconds |
| 51 | alqUSD mint | alqUSD MinterV0 | 3,600 seconds (1 hour) |

Roles 42–44 and 51–54 have **0-second grant delays**, and roles 42–44 are administered by ADMIN_ROLE (`getRoleAdmin` = 0). The Admin Safe can therefore add operators to the peg-liquidity and CoW contracts instantly, but those contracts can only send funds to fixed receivers (Guardian Safe / Liquidity Safe).

**Global AccessManager parameters (verified onchain):**
- `minSetback` = 432,000 seconds (5 days): minimum delay before any role-delay reduction takes effect.
- `expiration` = 604,800 seconds (7 days): scheduled operations expire after 7 days.
- `getRoleGrantDelay(ADMIN_ROLE)` = 604,800 seconds (7 days); roles 21–25 also 7 days; roles 1 and 4 (apxUSD mint) 259,200 seconds (3 days).
- `getTargetAdminDelay` (delay for AccessManager-admin operations changing a target's config) = **259,200 seconds (3 days)** on apxUSD, apyUSD, MinterV0, YieldDistributor, LinearVestV0, AddressList, UnlockToken; **0 seconds** on the Rate Oracle, the AccessManager itself, and the alqUSD/aptUSD family and new oracles.

**Effective upgrade delays (verified via `canCall`):**
- `upgradeToAndCall` on apxUSD / apyUSD: must be called by role 24 holder → **3-day execution delay** (only the Guardian/Upgrader 4-of-7 Safe can initiate).
- `upgradeToAndCall` on the Rate Oracle: restricted to ADMIN_ROLE → **0-second delay** (current 4-of-6 Admin Safe can upgrade instantly).
- `setRate` on the Rate Oracle: ADMIN_ROLE → **0-second delay**.
- `pause` on apxUSD / apyUSD: role 21 holder → **0-second delay** (Guardian Safe can pause instantly).
- `unpause` on apxUSD / apyUSD: role 22 holder → **4-hour delay**.

**Multisig Details:**
- **Current Admin Safe (4-of-6)**: Sole holder of ADMIN_ROLE (0-sec delay). Can change roles and config (subject to 3-day target-admin-delay on most targets and 7-day role-grant delay), upgrade the rate oracle instantly, and set the oracle rate instantly. Currently holds 0 apxUSD.
- **Guardian/Upgrader Safe (4-of-7, former Admin)**: Threshold raised from 3-of-6 on August 31, 2026 by adding one owner. Retains roles 7, 21, 22, 23, 24, and 25. Sole entity that can actually initiate proxy upgrades on apxUSD/apyUSD (subject to 3-day delay). Can pause instantly. Owns the CCIP token pool. Holds ~13.49M apxUSD and ~6.93M apyUSD.
- **Liquidity Safe (2-of-4)**: No AccessManager roles, but holds ~15.91M apxUSD, 85.3% of the Curve v3 LP, and receives CoW-contract withdrawals. It is the lowest-threshold Safe controlling material apxUSD liquidity.
- **Operations Safe**: 3-of-6 Gnosis Safe. No AccessManager roles. Holds the 713,088 STRCx onchain reserve position.
- **Deployer EOA**: ADMIN_ROLE was properly revoked shortly after initial grant.

**Key concerns:**
- Admin-Safe-to-Upgrader-Safe separation prevents the 4-of-6 current Admin Safe from unilaterally upgrading the core stablecoin contracts without waiting through timelocks: it would have to either (a) schedule a `setTargetFunctionRole` change on apxUSD/apyUSD (3-day target-admin-delay), or (b) grant role 24 to a new address (7-day role-grant delay) and then still wait the 3-day execution delay. This is a substantial improvement over the prior zero-delay configuration.
- **The Rate Oracle remains a zero-delay control, now with a narrower blast radius.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay. It prices only the original, drained Curve pool (~$5.7K). The live Curve v3 pool was deployed without any rate oracle.
- Admin Safe and Guardian Safe are not independent. All six Admin Safe owners are also owners of the Guardian Safe, which adds one further owner. The 4-of-7 threshold can therefore be met entirely by Admin Safe signers.
- **Shared AccessManager across products.** The alqUSD/aptUSD family, its MinterV0, and two new oracles are governed by the same AccessManager. These targets have a 0-second target-admin delay, and their roles 51–54 have 0-second grant delays. They do not carry apxUSD mint authority, but an Admin Safe compromise now reaches a larger contract set.
- **apyUSD implementation history** (`Upgraded(address)` events on the proxy): block 24495109 → `0x1c40…531e`; block 24770480 (Mar 30, 2026, tx [`0xd2d6…6eee`](https://etherscan.io/tx/0xd2d6402c540a482a267fa10a168bd6df8d4b53a9fecde093a40cae66a67f6eee)) → `0x2085…cacf`; block 25124599 (May 18, 2026, tx [`0x064b…d441`](https://etherscan.io/tx/0x064b70ff07a642edf4807731e0c4f69fec509eee3bd6a2d8c013f52e2ad7d441)) → `0x6f4d…3173`; block 25188571 (May 27, 2026, tx [`0x4e5b…696d`](https://etherscan.io/tx/0x4e5b0a6da667cef27e23745f7fd217baa6242b6365ad18b894720cbfb3b4696d)) → current [`0xfd61…b112`](https://etherscan.io/address/0xfd616567ecc1607f61073951a1e822f7315bb112). Four upgrades in ~3.5 months, two of them nine days apart, on a contract holding the majority of circulating apxUSD. Every upgrade routed through the Guardian Safe under the 3-day execution delay, so the timelock is functioning as designed. No further apxUSD, apyUSD, or rate-oracle upgrades occurred between May 27 and the October 5 snapshot; implementations are unchanged.

### Deny List

The canonical apxUSD token, the current apyUSD implementation, and the redemption queue all read the same deny list:

- `apxUSD.denyList()` → [`0x2c271ddF…F6AA`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) (AddressList); the ERC-20 transfer hook rejects transfers involving denied addresses
- `apyUSD.denyList()` → [`0x2c271ddF…F6AA`](https://etherscan.io/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa) (AddressList)
- `UnlockToken.denyList()` → same AddressList
- All three references are admin-settable via `setDenyList`, and the AddressList is itself governed by the AccessManager

This is a **user-level freeze path across the assessed stablecoin, yield vault, and redemption queue**. A listed address can be prevented from transferring apxUSD and blocked from the apyUSD exit path while its principal remains in the system. List-content changes are not rate-limited or protected by a user-visible timelock. Combined with apyUSD's up-to-20-day unlock cooldown and permissioned apxUSD redemption, this concentrates meaningful transfer and exit discretion in the admin path. No evidence was found that the deny list has been used punitively; the risk is the capability itself.

### Programmability

- **apxUSD**: Standard ERC-20 with no onchain exchange rate (it's a 1:1 stablecoin). Minting is permissioned and programmatically rate-limited.
- **apyUSD exchange rate**: Calculated onchain via ERC-4626 (`totalAssets / totalSupply`). Programmatic, no admin input needed for the rate itself. Admins/operators cannot directly type in an arbitrary apyUSD exchange rate without changing onchain assets/share supply or upgrading contracts.
- **Yield distribution**: Semi-manual. Authorized operators/admins deposit apxUSD into YieldDistributor → LinearVestV0 → apyUSD vault pulls vested yield. The yield vesting is programmatic (~17-day linear), but the initial deposit amount is admin/operator initiated and is not verified by an onchain dividend oracle.
- **Rate oracle**: **Manually set** by ADMIN_ROLE with 0-second execution delay. The `setRate()` function has no automation, no TWAP, no staleness check, and no onchain price feed.
- **Minting**: Two-step process (request → execute). Execution delay is 60 seconds via role 1, or 4 hours via role 4. To bypass via role self-grant, the Admin Safe would hit a 7-day role-grant delay or a 3-day target-admin-delay for function-role reconfiguration.

### External Dependencies

| Dependency | Type | Criticality | Impact of Failure |
|------------|------|-------------|-------------------|
| **Preferred shares (STRC; SATA eligible but $0 in July–August)** | Collateral backing | **Critical** | All value derives from preferred equity held at Alpaca or as onchain STRCx. Dividend cuts, issuer default, or custody failure would impair backing |
| **MPC Custody Providers** | Asset custody | **Critical** | Compromise or failure of custody could lead to loss of collateral. Multi-party MPC mitigates single-point risk |
| **STRC (Strategy Inc)** | ~86.6% of asset reserves, single issuer | **Critical** | Concentration in one issuer's preferred stock. STRC's record drawdown to $90.38 in June, and ~$84 by July, transmitted directly into the apxUSD market price |
| **xStocks / Payward (STRCx)** | Tokenized STRC custody | **High** | Onchain STRCx ($102.1M at August 31) depends on the issuer's 1:1 custody of underlying STRC |
| **Curve StableSwap-NG (v3 pool)** | Deepest measured Ethereum exit | **High** | ~$4.8M pool, 85.3% Apyx-owned LP; ~1M apxUSD clears at ~2.5% below par |
| **Uniswap V4** | Ethereum spot venue | **High** | ~10.20M apxUSD singleton inventory; balances overstate executable depth |
| **CoW Protocol** | Issuer order venue | **Medium** | Apyx's EIP-1271 order contract sells/buys apxUSD through GPv2Settlement at NAV-bounded prices |
| **Chainlink APXUSD / USD feed** | NAV publication | **Medium** | Reference price for the peg-liquidity and CoW contracts; not read by apxUSD/apyUSD core contracts |
| **Gnosis Safe** | Multisig infrastructure | **High** | All governance actions flow through Safe multisigs |
| **Ethereum L1 + CCIP** | Canonical settlement and cross-chain transport | **High** | Canonical apxUSD and escrow (~18.22M) are on Ethereum; Base, BNB Chain, and Solana representations depend on CCIP route and pool configuration |

**Key dependency risk**: The protocol has a **critical dependency on offchain assets and custody** that cannot be verified onchain, concentrated in a single issuer's preferred stock. The legacy rate oracle is manually set, but now prices only the drained original pool. Ethereum spot liquidity is concentrated in issuer-controlled venues (Curve v3 LP, CoW orders) plus Uniswap V4. Remote supply on three chains adds CCIP and cross-chain reconciliation risk.

## Operational Risk

- **Team Transparency**: **Public**. Six founding contributors are [named on the Apyx website](https://apyx.fi/#team), most with extensive crypto and TradFi backgrounds. Five currently hold C-suite roles at **DeFi Development Corp.** (Nasdaq: DFDV):
  - **Joseph Onorati** — CEO of DFDV. Former CSO at Kraken (8 years), founded a crypto market-making/HFT firm, former CEO of CaVirtEx (Canada's first Bitcoin exchange). Master's in Economics (monetary theory).
  - **Parker White, CFA** — COO & CIO of DFDV. Former Director of Engineering at Kraken (6 years). Background in bond trading and portfolio management (~$2B AUM). Active in DeFi since 2021.
  - **John Han, CFA** — CFO of DFDV. Former CFO of a unicorn L1 blockchain company, VP of Finance at Binance, Head of Strategic Finance at Kraken. Previously at Goldman Sachs equity research.
  - **Dan Kang (DK)** — CSO of DFDV. Former Head of Strategy at Kraken (3 years). Background as a long-short equity analyst (7 years), formerly at Morgan Stanley and Snap. Mathematics degree from Columbia.
  - **Pete Humiston** — CMO of DFDV. In crypto full-time since 2018. Former Sales & Trading at Jefferies. Focus on research, content, and marketing.
  - **Dawson Reid** — Founding contributor. 9 years at Kraken across full engineering stack. 15+ years of software engineering experience, in crypto since 2013.

  The team has strong overlap with DFDV, which is also Apyx's first institutional investor. This dual role (team members = investor executives) is a notable concentration of interest.
- **Fundraising**: Raised $3M across two rounds at a $300M valuation. "No VCs, by design." First institutional capital from DFDV.
- **Documentation**: Adequate. Main docs, FAQ, and audits page are functional. Documentation has been updated since launch.
- **Legal Structure**: **Preference Capital (BVI) Ltd.** and affiliates, incorporated in the British Virgin Islands. Explicitly disclaims being a "marketplace facilitator, broker, financial institution or creditor." Liability capped at $100 per user. US, EU, EEA geo-blocked. The July and August Wolf reports name **Preference Foundation** (or one of its subsidiaries) as the owner of the attested securities. Its jurisdiction and relationship to Preference Capital (BVI) Ltd. are not stated in the reports (**TODO**).
- **Incident Response**: Not formally documented. The Admin Safe can pause the protocol immediately. No Guardian or independent cancellation mechanism.
- **Code Availability**: Contracts verified on Etherscan and **open-sourced on GitHub** ([`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts)). Full Foundry project with source and tests. No license specified.
- **Points Program**: "Pips" points program active with various multipliers (5x for holding apxUSD, 10x for committing, up to 16x for Curve LP; 24x for holding aptUSD until September 22). This may attract mercenary capital. The APYX token generation event, previously scheduled for October 13, 2026, was [postponed](https://blog.apyx.fi/apyx-tge-update/) on September 23 without a new date. Apyx acknowledged that participants had "committed capital" and "rolled Pendle maturities" around the original date.
- **Product scope expansion**: Apyx launched aptUSD (Treasury-backed, via alqUSD) on September 1, 2026 and says it intends to become a broader RWA issuance platform. The new products share apxUSD's AccessManager and Admin Safe (see *Shared AccessManager*).

## Monitoring

### apxUSD Token Monitoring

- **apxUSD contract**: [`0x98a878B1CD98131b271883b390F68d2c90674665`](https://etherscan.io/address/0x98a878B1CD98131b271883b390F68d2c90674665)
  - Monitor `totalSupply()` for unexpected minting events
  - **Alert**: If supply increases by >5M in 24 hours (supply ~302M against a 750M cap; unbacked mint is a top-tier risk here, so the threshold stays tight while supply is contracting)
  - Monitor `Transfer` events for large movements (>$500K)
  - Monitor `Paused`/`Unpaused` events
  - Monitor mints (`Transfer` with `from = 0x0`) and **track the destination**. **Alert (Critical)**: if a mint destination is anything other than the documented pass-through [`0xcca1af4d`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8), or if the pass-through forwards anywhere other than the Guardian Safe.
  - Monitor burns (`Transfer` with `to = 0x0`) — the redemption pipeline now settles onchain, so burn volume is a usable proxy for redemption pressure.

### Peg Monitoring

apxUSD has recovered to ~$0.988 but has not held $0.99; these are the primary user-impact signals.

- **Market price** (CoinGecko / DefiLlama / GeckoTerminal, not Curve `get_virtual_price()` — see *Liquidity Assessment*)
  - **Alert (Critical)**: price below $0.97 (last breached in early September)
  - **Alert (Critical)**: any leg down >3% in 24 hours
  - **Alert**: price above $0.99 sustained for 30 days — the signal that would justify an upward reassessment
- **Chainlink [APXUSD / USD Exchange Rate](https://etherscan.io/address/0x651b101f72f82630cf59c68e6ee4305afbd3b1f5)**: **Alert (High)** if `latestAnswer` falls below 0.99 or `updatedAt` is older than 26 hours; it is the reference price for Apyx's peg-liquidity and CoW contracts.
- **STRC market price** — collateral marks transmit directly into apxUSD. Track distance from $100 par. The coverage buffer above 100% was only ~$1.23M at the snapshot, roughly a 0.8% STRC move.
- **Overnight and weekend windows**: the deepest June dislocations occurred while Nasdaq was closed and STRC marks were stale. Monitor apxUSD price, Curve v3 and Uniswap V4 inventory, CoW order-contract balances, and Accountable/Chainlink timestamps through weekends and US market holidays.
- **Public NAV vs. onchain reality**: the June incident was a pricing-feed bug that inflated the published NAV. Cross-check the Accountable/transparency dashboard NAV against independently computed STRCX marks rather than trusting the published figure.

### Mint Pass-Through Monitoring

- **Pass-through contract**: [`0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8`](https://etherscan.io/address/0xcca1af4d4afccc113d7682fbec1c5888f9b7f7b8)
  - Monitor all apxUSD inflows and outflows
  - **Alert**: If outflow destination is not the Guardian Safe (would indicate fresh mints routed somewhere else)
  - **Alert**: If `authority()` ever returns an address other than the Apyx AccessManager (`0xe167…2824`)

### Rate Oracle Monitoring

- **ApxUSDRateOracle**: [`0xa2ef2e7bf32248083e514a737259f3785ea8d37d`](https://etherscan.io/address/0xa2ef2e7bf32248083e514a737259f3785ea8d37d)
  - Prices only the drained original Curve pool; the Curve v3 pool has no rate oracle
  - Monitor `RateUpdated` events -- any rate change should be investigated
  - **Alert**: If rate deviates from 1.0 by >1%
  - **Alert**: If rate deviates from 1.0 by >5% (critical)
  - Monitor for proxy upgrade events (`Upgraded`)

### Liquidity Venue Monitoring

- **Curve v3 Pool**: [`0x6f63deedc9870d6c16fc644c6654748352cdc87c`](https://etherscan.io/address/0x6f63deedc9870d6c16fc644c6654748352cdc87c)
  - Holds ~3.12M apxUSD + ~1.66M USDC; the Liquidity Safe owns 85.3% of the LP
  - **Alert (Critical)**: any `RemoveLiquidity`/`RemoveLiquidityOne`/`RemoveLiquidityImbalance` by the Liquidity Safe or Guardian Safe, or total pool balances below $2.5M
  - Monitor the pool balance ratio (apxUSD vs USDC sides) for directional pressure. Do **not** alert on `get_virtual_price()`; it is a fee accumulator and cannot detect a depeg.
- **Original Curve Pool**: [`0xe1b96555bbeca40e583bbb41a11c68ca4706a414`](https://etherscan.io/address/0xe1b96555bbeca40e583bbb41a11c68ca4706a414) — drained (~$5.7K); alert only if Apyx re-seeds it
- **Peg-liquidity contract** [`0xc42c…45d7`](https://etherscan.io/address/0xc42c921e05e335768878de6484ef0767443845d7) and **CoW order contract** [`0xda69…f997`](https://etherscan.io/address/0xda6977ebdd0ad90c93be11c48fff9950123ef997)
  - Monitor apxUSD/USDC balances and `withdrawTokens` calls; **Alert (High)** if either is emptied or `withdrawReceiver()` changes
- **Uniswap V4 PoolManager**:
  - Monitor [`0x000000000004444c5dc75cb358380d2e3de08a90`](https://etherscan.io/address/0x000000000004444c5dc75cb358380d2e3de08a90) apxUSD balance (~10.20M tokens)
  - **Alert (Critical)**: if the PoolManager apxUSD balance drops below **5M tokens** (~50% of current inventory). Note this is a token balance, not a USD figure, and it overstates executable depth.
  - **Alert (High)**: any large apxUSD withdrawal from the PoolManager attributable to an Apyx Safe — this is the same action that removed the Curve exit in June

### Governance Monitoring

- **Admin Safe (4-of-6, current)**: [`0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96`](https://etherscan.io/address/0xabdd8c8ee69e5f5180eb9352aeffc5ceead65e96)
  - Monitor for owner/signer changes and threshold modifications
  - **Alert**: Immediately on any signer replacement or threshold change
  - Monitor all Safe transaction executions (role grants, rate oracle calls)

- **Guardian/Upgrader Safe (4-of-7)**: [`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`](https://etherscan.io/address/0xf9862efc1704ac05e687f66e5cd8c130e5663ce2)
  - Monitor Safe transactions — this is the sole initiator of apxUSD/apyUSD proxy upgrades (3-day delayed) and the CCIP pool owner
  - **Alert**: On any scheduled upgrade operation, owner change, or threshold change

- **Liquidity Safe (2-of-4)**: [`0xe6f8ad24367c1038ad1ce15af72a62408ba33c46`](https://etherscan.io/address/0xe6f8ad24367c1038ad1ce15af72a62408ba33c46)
  - **Alert**: On any owner/threshold change, Curve v3 LP transfer/removal, or apxUSD outflow above 1M

- **AccessManager**: [`0xe167330e2eac88666de253e9607c6d9ae0ca2824`](https://etherscan.io/address/0xe167330e2eac88666de253e9607c6d9ae0ca2824)
  - Monitor `RoleGranted`, `RoleRevoked`, `TargetFunctionRoleUpdated`, `TargetAdminDelayUpdated`, `RoleGrantDelayChanged` events
  - Monitor `OperationScheduled` / `OperationExecuted` / `OperationCanceled` events for pending admin ops during their delay window
  - **Alert**: On any role change or delay-parameter change; **Alert (Critical)** on any grant of role 1 or 4 (apxUSD mint) or on new holders of roles 42–44 (peg/CoW operators, 0-second grant delay)

### Supply & Holder Monitoring

- Monitor Guardian/Upgrader Safe (`0xf9862efc1704ac05e687f66e5cd8c130e5663ce2`) balance and movements (apxUSD, apyUSD, USDC, and LP tokens of any venue)
- Monitor Operations Safe ([`0x37B0779A66edc491df83e59a56D485835323a555`](https://etherscan.io/address/0x37B0779A66edc491df83e59a56D485835323a555)) **STRCx balance** — the largest identified onchain portion of apxUSD backing (713,088 STRCx, ~$74M at the snapshot STRCx mark)
  - **Alert (Critical)**: Any STRCX transfer out of the Operations Safe, especially to non-Apyx counterparties (would represent a reduction in onchain reserves)
  - **Alert (High)**: STRCX balance drops by >5% in 24 hours
- Monitor Third-Party Safe (`0x81f5d98ea5acf65640ce8bb68aa8449b7c304c50`) balance
- Monitor MinterV0 for mint execution events
- Monitor the AddressList (`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`) for deny-list additions — a listed address can be blocked from transferring apxUSD and from the apyUSD exit path
- **Alert**: If apxUSD `supplyCap` changes from current 750M

### Accountable Proof-of-Reserves Monitoring

- **Dashboard**: [`https://accountable.apyx.fi/`](https://accountable.apyx.fi/)
- **Public JSON API**: [`https://api.accountable.apyx.fi/dashboard`](https://api.accountable.apyx.fi/dashboard). Fetch this endpoint directly or through a browser context; the frontend host's `/dashboard` route is not the JSON endpoint.
- **Registry entry**: [`https://dvn.accountable.capital/v1/stats`](https://dvn.accountable.capital/v1/stats) should continue to list `name = apyx`, `ticker = apxUSD`, `frequency = live`, `connectors = 3`, and `verifiability = 4`.
- **Alert**: If the Accountable dashboard/API becomes unavailable, stale, degraded, or removed from the DVN registry.
- **Alert**: If connector count or verifiability level decreases.
- **Ratio calculation**: Recompute asset coverage from `(STRC + Cash & Equivalents + Other) / (total_supply - inventory - pol)` rather than trusting the rounded `collateralization` field. October 5 baseline: `177,772,906.34 / 176,544,148.56 = 100.6960%`.
- **Alert (Critical)**: Coverage below 100% on two consecutive newer reports; **Alert (High)** below 105% (currently breached at 100.70%) or on a material shift toward less liquid/non-public assets. Re-polling the same `ts` must not confirm a critical condition.
- **Alert (High)**: inventory + POL changing by >$10M in a day. The coverage ratio excludes these balances from liabilities, so reclassification moves the ratio without any change in reserves.

### Chainlink CCIP / Base / BNB Chain / Solana Monitoring

- **Base apxUSD**: [`0xd993935e13851dd7517af10687ec7e5022127228`](https://basescan.org/address/0xd993935e13851dd7517af10687ec7e5022127228)
- **Base apyUSD**: [`0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa`](https://basescan.org/address/0x2c271ddf484ac0386d216eb7eb9ff02d4dc0f6aa)
- **BNB Chain apxUSD**: [`0x6b3788fd6604bbf03c5378d24e57bb334baad4af`](https://bscscan.com/token/0x6b3788fd6604bbf03c5378d24e57bb334baad4af)
- **Solana apxUSD**: [`HAYQtfJEQ9DbDbaHEhxfGsWbSZ3ywthdsVB3PuB72DYe`](https://solscan.io/token/HAYQtfJEQ9DbDbaHEhxfGsWbSZ3ywthdsVB3PuB72DYe)
- **Ethereum LockReleaseTokenPool**: [`0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5`](https://etherscan.io/address/0x0e9cA42Bc60bE25F9A67f52173067Cc0Bb405BB5) — escrow ~18.22M apxUSD
- Monitor Chainlink CCIP status for the Ethereum/Base, Ethereum/BNB, and Ethereum/Solana routes, remote token supply, token-pool configuration, rate limits, remote-token mappings, and escrow-versus-remote-supply reconciliation.
- **Alert (Critical)**: If Base + BNB + Solana apxUSD supply exceeds Ethereum escrow.
- **Alert**: If any route is paused, rate-limited, reconfigured, or if remote supply changes without a matching lock/release accounting path.

### Monitoring Frequency

| Category | Frequency | Priority |
|----------|-----------|----------|
| **apxUSD market price / peg** | Real-time | **Critical** |
| Rate oracle changes | Real-time | Critical |
| Proxy upgrade events | Real-time | Critical |
| **Uniswap V4 PoolManager apxUSD inventory** | Real-time | **Critical** |
| **Guardian Safe / Liquidity Safe LP token balances** (POL withdrawal or redeployment) | Real-time | **Critical** |
| **Operations Safe STRCx balance** (onchain reserves) | Real-time | **Critical** |
| **Mint pass-through 0xcca1af4d outflow destination** | Real-time | **Critical** |
| Accountable PoR dashboard freshness / registry status | Real-time | Critical |
| Chainlink CCIP / Base + BNB + Solana supply reconciliation | Real-time | Critical |
| **Curve v3 LP held by the Liquidity Safe** (POL withdrawal) | Real-time | **Critical** |
| Chainlink APXUSD / USD feed answer and staleness | Real-time | High |
| Peg-liquidity / CoW contract balances and withdrawals | Real-time | High |
| AccessManager role changes | Real-time | Critical |
| Admin Safe transactions | Real-time | Critical |
| Guardian Safe transactions (Safe-level) | Real-time | Critical |
| STRC / SATA distance from par | Daily (market hours) | High |
| Deny-list additions (AddressList) | Real-time | High |
| Curve pool balance ratio | Every 6 hours | High |
| apxUSD supply changes | Every 6 hours | High |
| apxUSD `supplyCap` increases | Real-time | High |
| Large holder movements | Daily | Medium |

## Risk Summary

### Key Strengths

- **Publicly-traded collateral**: The underlying STRC preferred shares are Nasdaq-listed with transparent pricing, dividend policies, and regulatory oversight.
- **Three reputable audits**: Quantstamp, Zellic, and Certora audits all completed and publicly published with remediation evidence in the repo.
- **Six independently readable examination reports**: Wolf & Company reports covering March–August 2026 are downloadable and provide reasonable assurance under AICPA attestation standards over securities existence, ownership, custody, and valuation. The monthly cadence has held through August, and Alpaca is named as the brokerage holding offchain STRC.
- **Live third-party reserve verification**: Accountable's public API returned a fresh, internally reconcilable snapshot with 100% dashboard verifiability and Nitro-enclave attestation material. It showed coverage falling to 92.24% in August and recovering to 100.70% by October, rather than requiring reliance on Apyx's solvency claim.
- **Onchain NAV publication**: A Chainlink APXUSD / USD Exchange Rate feed has published the redemption rate since April 2026. It tracked the depeg down to 0.7987 and back to 1.0.
- **Structural safeguards worked as designed under stress**: the unlock window prevented a bank run, and the apyUSD/apxUSD Morpho market saw zero liquidations from the STRC move because its oracle is the redemption rate rather than spot price.
- **Credible incident response**: a detailed, self-critical post-mortem was published within days, naming the NAV feed bug and the operational shortfalls explicitly rather than attributing the depeg solely to market conditions.
- **Onchain timelocks on core admin functions**: 3-day execution delay on apxUSD/apyUSD proxy upgrades (via role 24); 7-day role-grant delay for ADMIN_ROLE and roles 21–25; 3-day grant delay on apxUSD mint roles; 5-day `minSetback` on delay reductions; 3-day `targetAdminDelay` on core contracts; 4-hour unpause delay. In August, a role-4 (apxUSD mint) grant to the new alqUSD minter was revoked before its 3-day grant delay elapsed.
- **Governance thresholds**: Admin Safe 4-of-6; Guardian/Upgrader Safe raised to 4-of-7 on August 31, 2026.
- **Stable core code since May**: No apxUSD, apyUSD, or rate-oracle upgrades between May 27 and October 5.
- **Onchain burn path active**: supply contraction from the ~524.66M peak settled through `burn`/`burnFrom` calls, so redemption pressure is observable onchain.
- **Growing onchain backing visibility**: attested onchain STRCx reached $102.1M by August 31, exceeding offchain STRC at Alpaca. The Operations Safe alone holds 713,088 STRCx (~$74M).
- **Open-source code**: Full Foundry project with invariant tests and Slither CI.
- **Public, credentialed team**: Six named founding contributors with verifiable backgrounds at Kraken, Goldman Sachs, Binance, and DeFi Development Corp.

### Key Risks

- **Incomplete peg recovery**: apxUSD bottomed at ~$0.75 in late June and was $0.988 on October 5. It has touched but not held $0.99, after four months below par.
- **Thin coverage buffer**: Accountable shows 100.70% asset-reserve coverage, a ~$1.23M cushion that a ~0.8% STRC move would erase. Coverage depends on excluding ~$125.9M of Apyx-held inventory and POL (41.6% of supply) from liabilities, and only ~$43M of that is reconciled to identified addresses here.
- **BTC/DAT stress sensitivity (realized)**: the preferred-share collateral is issued by Digital Asset Treasury companies whose market value tracks BTC. A ~30% BTC drawdown transmitted straight through STRC into the apxUSD market price.
- **Weekend/overnight market-gap risk (realized)**: the deepest dislocations occurred while Nasdaq was closed and STRC marks were stale. NAV-bounded CoW orders and the peg-liquidity contract are now visible onchain, but they are issuer-operated and their pricing logic is unverified.
- **Reserve reporting failed during the incident**: the public NAV was inflated by a pricing-feed bug for the duration of the drawdown, and Accountable's earlier asset bucketing misled analysts. The live API now separates STRC, POL, cash/equivalents, inventory, and other reserves, but it does not expose source-level timestamps or the off-hours marking method.
- **Attestation scope narrowed to securities**: the July and August Wolf reports cover only STRC/SATA/STRCx. Cash (~$23.8M per Accountable) is unattested and its custodian unnamed.
- **Rate Oracle retains zero-delay admin control**: the 4-of-6 Admin Safe can upgrade the Rate Oracle proxy or call `setRate()` instantly. It now prices only the drained original Curve pool.
- **Unbacked-mint design**: `ApxUSD.mint()` creates tokens without any onchain collateral transfer — backing is verified only offchain via attestations.
- **Admin freeze path across transfers and the exit**: the deny list is wired into apxUSD, apyUSD, and the UnlockToken redemption queue; apxUSD redemption is permissioned and priced at redemption value rather than par.
- **Issuer-controlled liquidity again**: the re-seeded Curve v3 LP sits in a 2-of-4 Safe, and the CoW/peg contracts are run by EOA operators with no timelock on withdrawals.
- **Issuer concentration**: asset reserves are ~86.6% STRC, a single issuer's preferred stock; SATA is $0.
- **Unverified contracts holding funds**: the peg-liquidity and CoW order contracts hold ~1.1M apxUSD and ~0.46M USDC without verified source.
- **Shared AccessManager with new products**: alqUSD/aptUSD and two new oracles share apxUSD's Admin Safe and AccessManager, with 0-second target-admin delays.
- **CCIP / remote-chain dependency**: apxUSD is live on Base, BNB Chain, and Solana, while apyUSD is live on Base. Remote supply depends on the Ethereum LockReleaseTokenPool (~18.22M escrow) and route configuration. Solana supply is unverified.
- **Young protocol**: ~229 days in production, with its only stress test producing a four-month depeg.
- **DFDV concentration**: all six founding contributors are executives at DeFi Development Corp. (Nasdaq: DFDV), which is also the protocol's first institutional investor. BVI legal entity with $100 liability cap.
- **No bug bounty program**: notable absence for a protocol with >$300M Ethereum apxUSD supply.

### Critical Risks

- **Ethereum exit depth is ~$1M and issuer-controlled**: Curve v3 absorbs ~1M apxUSD at ~2.5% below par, and 2M at ~20% below. 85.3% of that LP, plus the CoW and peg-contract inventory, can be withdrawn by Apyx without a timelock — as the original Curve POL was in June. Whitelisted apxUSD redemption is a separate permissioned/manual path priced at redemption value; the 20-day UnlockToken cooldown applies to apyUSD, not apxUSD.
- **Reserve coverage at par with no buffer**: Accountable reports 100.70% asset-reserve coverage of circulating supply. That depends on STRC marks and on Apyx's classification of ~41.6% of supply as non-circulating. The June NAV bug shows that even a live reserve-reporting surface can be wrong during the conditions that matter.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one
- Use decimals (e.g., 2.5) when a subcategory falls between scores
- Prioritize onchain evidence over documentation claims

### Critical Risk Gates

- [x] **Unverified contract source** -- apxUSD, apyUSD, AccessManager, MinterV0, the rate oracle, and their current implementations are source-verified on Etherscan. The newer peg-liquidity and CoW order contracts are **unverified**. They hold ~1.1M apxUSD and ~0.46M USDC of Apyx inventory, cannot mint apxUSD, and can only release funds to fixed Apyx receivers. That is recorded as a category risk rather than a gate failure. **PASS**
- [x] **No audit** -- Three reputable audits confirmed: Quantstamp (Feb 2026), Zellic (Mar 2026), Certora (Mar 2026). All publicly published. **PASS**
- [x] **Unverifiable reserves** -- The [Accountable public API](https://api.accountable.apyx.fi/dashboard) was retrieved on October 5, 2026. The fresh response exposes reserve composition, supply (matching onchain `totalSupply()`), a 100.70% collateral ratio, `verifiability = 100`, Nitro-enclave attestation material, and zk proofs. Six Wolf & Company examination reports (March–August) were independently fetched and read; they cover securities existence, ownership, custody, and valuation. A Chainlink feed publishes the redemption rate onchain. The historical NAV bug, securities-only opinion scope, and remaining valuation/cash-custody limitations stay category risks, but reserves are verifiable through transparent third-party evidence. **PASS**
- [x] **Total centralization** -- 4-of-6 Gnosis Safe for ADMIN_ROLE, 4-of-7 Safe for pause/upgrade. Operational EOAs hold only bounded peg-liquidity/CoW roles. Not a single EOA. **PASS**

**All critical gates pass.** Proceeding to category scoring; the thin coverage buffer and remaining transparency limitations are reflected in Funds Management rather than a gate override.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits**: 3 confirmed audits from reputable firms (Quantstamp, Zellic, Certora), all publicly published with remediation evidence. Certora identified 14 findings (1 High, fixed).
- **Bug Bounty**: None found (Immunefi 404, Cantina "Bounty not found" on October 5, 2026).
- **Time in Production**: ~229 days.
- **TVL**: ~302.47M Ethereum apxUSD supply (cap 750M), including ~18.22M escrowed for Base (~9.64M), BNB Chain (~2.57M), and Solana. Listed on CoinGecko.
- **Incidents**: **One material incident.** The June 2026 depeg: apxUSD fell to $0.90, then to a daily low of $0.749, recovered to $0.881 by August 1, and reached $0.988 by October 5. No exploit, realized custody loss, or smart-contract failure was identified. Accountable coverage was below 100% from at least August 3 until September 20. Response was strong: a self-critical post-mortem within days, proportional redemptions, and structural safeguards (unlock window, rate ratchet, redemption-rate oracle on Morpho) that all performed as designed.

**Audits subcategory: ~3** — three top-firm audits with public remediation evidence would score 1 on coverage alone, pulled toward the middle of the range by the complete absence of a bug bounty at >$300M supply.

**Historical Track Record subcategory: ~4.5** — the protocol has moved into the rubric's 6–12 month band (anchor 3) with >$100M scale. The incident still dominates: its only stress test produced a four-month depeg that has not fully closed, and reserve coverage was below par for roughly seven weeks of the observed window.

**Score: 3.75/5** — `(3 + 4.5) / 2`. Lowered from 4.0 because the protocol crossed into the 6–12 month production band and the depeg has largely recovered. It stays well above 3 because the recovery is incomplete and the track record still contains a four-month depeg.

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- 4-of-6 Admin Safe (ADMIN_ROLE, 0 exec delay).
- Separate 4-of-7 Guardian/Upgrader Safe (raised from 3-of-6 on August 31, 2026) holds role 24 with 3-day execution delay on apxUSD/apyUSD proxy upgrades, plus pauser/unpauser/supply-cap/yield-operator roles. All six Admin Safe owners also sit on the Guardian Safe, so the two Safes are not independent.
- 7-day role-grant delay for ADMIN_ROLE and roles 21–25; 3-day grant delay on apxUSD mint roles 1 and 4. 5-day `minSetback`. 3-day `targetAdminDelay` on core contracts.
- Rate Oracle has **no timelock**: ADMIN_ROLE can upgrade the oracle or call `setRate()` with 0-second delay. It now prices only the drained original Curve pool.
- The same AccessManager now governs the alqUSD/aptUSD family and two new oracles with 0-second target-admin delays. There is no apxUSD mint path from those targets.
- No independent Guardian with a veto on upgrades; the Admin Safe can in principle reroute upgrades by creating a new role and granting it (subject to the 7-day grant delay and 3-day target-admin-delay).

**Governance Score: 3.0** -- Between score 3 (moderate multisig with short timelock, several admin functions centralized) and score 4 (low threshold, <12h timelock). Core stablecoin proxy upgrades and mint-role grants have meaningful multi-day timelocks. The August revocation of a pending role-4 grant shows the grant delay functioning. The Guardian threshold increase helps, but signer overlap with the Admin Safe limits its value. The rate oracle remains zero-delay, though its blast radius has shrunk.

**Subcategory B: Programmability**

- apxUSD: Standard ERC-20, no onchain exchange rate needed (1:1 stablecoin).
- apyUSD: ERC-4626 with programmatic exchange rate.
- Yield distribution: ~17-day linear vesting is programmatic, but initial deposits are admin-initiated.
- NAV: published onchain through a Chainlink feed, apparently sourced from Accountable, but not enforced by apxUSD mint/redeem.
- Peg operations: issuer-run through EOA operators (peg-liquidity contract, CoW orders), bounded by the Chainlink NAV and fixed withdrawal receivers.
- Rate oracle: Manually set, no automation, no staleness check.
- Minting: Permissioned; 60-second delay for role 1 path, 4-hour delay for role 4 path.

**Programmability Score: 3.5** -- Hybrid system. apyUSD exchange rate and yield vesting are onchain, and NAV is now published onchain. Mint/redeem and peg operations remain manual or operator-driven, and yield distribution is still admin-initiated.

**Subcategory C: External Dependencies**

- **Critical**: Preferred share collateral (STRC) and custody providers (Alpaca; xStocks/Payward for STRCx)
- **High**: Curve v3 and Uniswap V4 venues; Chainlink CCIP across three remote chains
- **Medium**: Chainlink NAV feed, CoW Protocol, Gnosis Safe infrastructure

**Dependencies Score: 4.0** -- Critical dependency on offchain and tokenized equity custody, concentrated in a single issuer's preferred stock (~86.6% of asset reserves). No fallback mechanism if custody providers fail. Exit liquidity depends on issuer-owned venues, and remote supply on three CCIP lanes adds route and escrow-reconciliation dependencies.

**Centralization Score = (3.0 + 3.5 + 4.0) / 3 = 3.5**

**Score: 3.5/5** -- Held at 3.5. Timelocks on core upgrades and role grants remain a material strength; core implementations are unchanged since May 27. Two facts push against holding: the deny list is wired into apxUSD transfers, apyUSD, and the redemption queue, while Apyx 2.0 prices redemption at protocol-computed redemption value rather than par. These capabilities would support Programmability 4.0 — `(3.0 + 4.0 + 4.0) / 3 = 3.67` — but no punitive deny-list use was observed, and the Chainlink NAV feed now makes the redemption value publicly observable. The shared AccessManager and new EOA operator roles are noted but do not change subcategory anchors. Held at 3.5; see *Reassessment Triggers*.

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- Backing by publicly-traded preferred shares (STRC only; SATA $0 in the July and August attestations), held at Alpaca and as self-custodied onchain STRCx
- Cash/short-term Treasuries buffer (~$23.8M per Accountable) documented, but exact instruments, location, custodian, and maturity profile are undisclosed, and cash is outside the July/August Wolf scope
- Accountable reports **100.70%** asset-reserve coverage of circulating supply and a $0.9984 redemption value. The buffer above par is ~$1.23M, about a 0.8% STRC move.
- Coverage depends on excluding ~$125.9M of protocol inventory and POL (41.6% of total supply) from liabilities. On a total-supply basis, asset reserves are 58.8% of supply.
- Onchain STRCx attested at $102.1M on August 31; Operations Safe holds 713,088 STRCx (~$74M at the snapshot STRCx mark)
- Reserve is equity (not stablecoins) — **and the volatility is not theoretical**: STRC posted its largest-ever drawdown from par in June, reaching $90.38, and was around $84 by July 1.
- Six downloadable Wolf & Company AICPA examination reports cover March–August 2026; each was independently fetched and read.

**Collateralization Score: 3.5** — Improved from 4.0. Accountable shows asset reserves back at par for circulating supply after a period below it. That moves the backing column toward the rubric's "100% collateral, some offchain" band. The score does not reach 3 because the collateral is single-issuer equity, the over-par buffer is under 1%, and coverage relies on Apyx's own classification of a large protocol-held balance as non-circulating. Cash custody also remains unnamed and unattested.

**Subcategory B: Provability**

- apyUSD exchange rate: onchain (ERC-4626)
- apxUSD collateral: hybrid offchain/tokenized. Six Wolf & Company examination reports on the [attestation page](https://docs.apyx.fi/collateral-and-custody/third-party-attestation) cover March–August 2026 and are independently downloadable. They provide reasonable assurance over securities existence, ownership, custody, and valuation at two dates per month. They do not opine on liabilities or collateral coverage, and from July they exclude cash.
- **Reserve reporting was wrong during the June drawdown**: the public transparency dashboard displayed an inflated NAV for the duration of the event due to an STRCX pricing-feed bug, diverging from the team's internal figures, and the Accountable dashboard grouped POL and inventory into "Cash & Equivalents" in a way Apyx says misled external analysts.
- Accountable data verification: live proof-of-reserves integration listed in the DVN registry (`frequency = live`, `connectors = 3`, verification level `4`, `oracle = chainlink`) since April 23, 2026. Its public API returned an internally reconcilable snapshot whose total supply matched onchain `totalSupply()`. Pricing methodology for offchain STRC marks, especially outside Nasdaq market hours, is still not independently established — and this is exactly where the June failure occurred.
- Onchain NAV: Chainlink APXUSD / USD Exchange Rate feed (1.000000 at snapshot).
- Onchain backing visibility: more than half of attested securities were onchain STRCx at August 31. Only the Operations Safe's 713,088 STRCx is tied to an identified wallet here.
- Inventory/POL: ~$83M of the ~$125.9M Accountable excludes from circulating supply was not reconciled to addresses.
- Onchain supply history: contraction from peak settled through `burn`/`burnFrom` calls, so redemption pressure is observable onchain.

**Provability Score: 3.0** — Held. Attestation cadence continued through August, onchain STRCx grew, and NAV is now published onchain. These improvements are offset by the securities-only attestation scope, unidentified STRCx wallets, and the unreconciled inventory/POL that drives the headline ratio. Accountable still omits source-level freshness, and the public NAV was wrong during the June event.

**Funds Management Score = (3.5 + 3.0) / 2 = 3.25**

**Score: 3.25/5** — Lowered from 3.5 because Accountable now reports asset reserves at par for circulating supply. Holders remain exposed to single-issuer preferred-share losses, offchain custody, valuation/reporting errors, and Apyx's classification of protocol-held supply.

#### Category 4: Liquidity Risk (Weight: 15%)

- **Exit mechanism**: no direct redemption for general holders. apxUSD redemption is whitelisted, manual, and priced at redemption value rather than par. The up-to-20-day UnlockToken cooldown applies to apyUSD→apxUSD redemption, not to apxUSD itself. Rubric band **4** ("withdrawal queues or restrictions").
- **Depth**: Curve v3 absorbs ~1M apxUSD at ~2.5% below par (band **3**: `>$1M, 1-3% slippage`). Uniswap V4 holds ~10.20M apxUSD of inventory that overstates executable depth, and CoW orders add some issuer-quoted size.
- **Large-holder impact**: a 2M apxUSD Curve sale clears ~20% below par, and exits above ~$1M depend on issuer liquidity remaining in place. Band **4** (">1 week or >10% impact").
- **Supply-to-liquidity ratio**: ~302M supply against ~13.3M of Curve v3 and V4 inventory is **~23×** on the most generous reading.
- **Modifiers**: the rubric's "maintained liquidity during major drawdowns: −0.5" does **not** apply — ~88% of POL was withdrawn in the first week of the June depeg, and the current depth is again issuer-owned. The `+0.5` throttle modifier is **not** applied: the fixed 20-day cooldown belongs to apyUSD, while no fixed cooldown was verified for the assessed apxUSD token.

**Score: 4.0/5** — Lowered from 4.5. The rubric dimensions average to ~3.67 (4 / 3 / 4), rounded up because the measured depth is Apyx-controlled and withdrawable without a timelock, as in June. The re-seeded Curve v3 pool, CoW orders, and a ~1.2% discount (versus 12–25%) justify leaving the 4.5 band. Reassess if a durable third-party venue appears, the Liquidity Safe removes LP, or redemption opens beyond the whitelist.

#### Category 5: Operational Risk (Weight: 5%)

- **Team**: Public. Six named founding contributors with verifiable backgrounds (Kraken, Goldman Sachs, Binance, DFDV). Strong institutional credibility via Nasdaq-listed DFDV.
- **Documentation**: Adequate, with gaps. Main docs, FAQ, and audits page are functional and list all three audits, six attestations, and the aptUSD product. The peg-liquidity and CoW order contracts are undocumented and unverified.
- **Legal Structure**: BVI entity, US/EU/EEA geo-blocked. Attested securities are held by Preference Foundation, whose jurisdiction and relationship to the BVI entity are not disclosed.
- **Incident Response**: No formal published plan, but a real test: a detailed post-mortem within days of the June event, naming the NAV feed bug, delayed communications, and operational shortfalls explicitly. Admin can pause immediately.
- **Operational limits exposed in June**: Apyx states its manual mint/redeem process — multisig coordination across signers and time zones, brokerage sales, wires, USDC conversion, pool deployment — could not keep pace with the event. The manual design is deliberate (anti-inflation safeguards) but is a documented throughput constraint under stress.
- **Roadmap changes**: the APYX TGE was postponed on September 23 after participants had positioned for an October 13 date, and the protocol is expanding into an RWA platform on the same governance stack.
- **Code Availability**: Core contracts verified on Etherscan and open-sourced on GitHub ([`apyx-labs/evm-contracts`](https://github.com/apyx-labs/evm-contracts)). Full Foundry project with 60+ test files, invariant tests, and Slither CI. No license specified.

**Score: 3/5** — Held at 3.0. Public, well-credentialed team; open-source core code with comprehensive tests; fast, self-critical incident disclosure. These are offset by undocumented peg contracts, an undisclosed relationship between the attested entity and the BVI entity, minimal disclosure on "Cash & Equivalents", and a TGE postponement after users had positioned around it.

### Final Score Calculation

```
Final Score = (Centralization × 0.30) + (Funds Mgmt × 0.30) + (Audits × 0.20) + (Liquidity × 0.15) + (Operational × 0.05)
```

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 3.75 | 20% | 0.75 |
| Centralization & Control | 3.5 | 30% | 1.05 |
| Funds Management | 3.25 | 30% | 0.975 |
| Liquidity Risk | 4.0 | 15% | 0.60 |
| Operational Risk | 3.0 | 5% | 0.15 |
| **Final Score** | | | **3.52/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |
| **N/A** | **Not Rated** | Terminal — do not use (exploited or wound down) |

**Final Risk Tier: Elevated Risk — Limited approval, strict limits**

> The final score is 3.52 (Elevated, just above the Medium boundary). apxUSD has recovered to ~$0.988, Accountable coverage is back at 100.70%, and Curve v3 restores ~$1M of exit depth. The score stays Elevated because that depth is issuer-owned and withdrawable, the over-par buffer is under 1%, coverage depends on excluding ~41.6% of supply as protocol-held, and the four-month depeg remains the protocol's only stress-test result.

---

Apyx's apxUSD is a novel "Dividend-Backed Stablecoin" bridging offchain corporate dividends into onchain yield. The governance architecture built after the March 20–21 restructure is intact. Core implementations are unchanged since May 27, and multi-day upgrade timelocks and role-grant delays hold. The Guardian Safe's threshold rose to 4-of-7. The 3-day grant delay also stopped a role-4 apxUSD mint grant to a new contract before it took effect.

The June 2026 stress test showed that governance was never the binding constraint. A record STRC drawdown transmitted directly into the apxUSD market price, and the deepest dislocations landed overnight while Nasdaq was closed and collateral marks were stale. The public NAV dashboard displayed inflated numbers throughout, and the Guardian Safe withdrew the bulk of the only permissionless Ethereum exit venue in the same week. The recovery since then has three drivers: STRC marks recovered, circulating supply contracted to ~176.5M through burns and growth in protocol-held inventory (~29.4M → ~60.7M since August 10), and Apyx re-seeded issuer-owned venues — Curve v3, a NAV-bounded peg contract, and CoW orders. Accountable coverage crossed 100% on September 20 and the Chainlink NAV feed returned to 1.0 on September 16. apxUSD itself has not yet held $0.99.

**Residual concerns underlying the 3.52 score:**
- **Incomplete peg recovery.** apxUSD at $0.988 (−1.2%) after four months below par, low of ~$0.75.
- **Issuer-owned exit depth.** Curve v3 absorbs ~1M apxUSD at ~2.5% below par, but 85.3% of its LP is in a 2-of-4 Safe. The CoW and peg-contract inventory is EOA-operated, and none of it is timelocked — the same property that failed in June. Whitelisted apxUSD redemption is manual and priced at redemption value, not $1; the 20-day cooldown applies only when exiting apyUSD.
- **Coverage at par with no buffer.** Accountable shows 100.70% asset-reserve coverage (a ~$1.23M cushion), which relies on classifying ~$125.9M of Apyx-held apxUSD as non-circulating. Only ~$43M of that was reconciled to addresses.
- **Collateral is a single volatile issuer.** ~86.6% of asset reserves are STRC, and SATA is $0. Reserve marks move with an equity, not a cash instrument.
- **Attestation scope.** The Wolf reports cover securities only (from July explicitly), not cash, liabilities, or coverage; the latest covers August 31.
- **Rate Oracle has no timelock.** ADMIN_ROLE can upgrade the oracle and call `setRate()` with zero delay, though it now prices only the drained original Curve pool.
- **Admin discretion over transfers and the exit.** The deny list is wired into apxUSD, apyUSD, and the redemption queue; apxUSD redemption is permissioned and uses redemption-value pricing.
- **Shared governance with new products and unverified peg contracts.** alqUSD/aptUSD share the AccessManager and Admin Safe, and the peg-liquidity and CoW contracts are unverified.
- **Cross-chain reconciliation remains incomplete.** Base, BNB Chain, and Solana supplies depend on Ethereum CCIP escrow (~18.22M); Solana supply is unverified, and Accountable's `supply_split` itemizes only Ethereum.
- **Custody disclosure remains incomplete.** Alpaca is named for offchain STRC, but the cash-account custodian, the remaining STRCx wallets, and the Preference Foundation's relationship to the BVI entity are undisclosed.
- **No bug bounty program** at >$300M Ethereum apxUSD supply.

**Conditions for continued or increased exposure**, roughly in order of how much each would move the score:

1. **Restore a credible onchain exit.** Third-party liquidity that Apyx cannot unilaterally withdraw, deep enough to absorb a meaningful position near par. Protocol-owned liquidity does not satisfy this — June demonstrated why. At minimum, move issuer LP behind a timelock or a higher-threshold Safe.
2. **Peg recovery.** apxUSD sustained above $0.99 for 30 days.
3. **Rebuild an over-par buffer** that survives a plausible STRC drawdown, and reconcile inventory/POL to published addresses.
4. **Add a non-zero execution delay or target-admin-delay to the Rate Oracle** (`ApxUSDRateOracle`) so `setRate()` and `upgradeToAndCall` cannot execute instantly.
5. **Extend the examination scope** to cash, liabilities, and collateral coverage, not only securities balances.
6. **Verify the peg-liquidity and CoW order contracts** on Etherscan and document their pricing rules.
7. **Complete the transparency-stack remediation**: publish the NAV pricing methodology (including how STRC is marked outside Nasdaq hours and how the Chainlink feed relates to `redemption_value`), and expose source-level freshness in the Accountable API.
8. **Complete custody disclosure** by naming the bank/custodian for cash and cash equivalents, every STRCx wallet, and the Preference Foundation's legal relationship to the BVI entity.
9. **Launch a bug bounty program** (Immunefi / Cantina / Safe Harbor).

**Monitoring priorities:**
- **apxUSD market price** — the primary user-impact signal until the peg holds. Not the Curve virtual price.
- **Liquidity Safe Curve v3 LP and CoW/peg contract balances** — the current exit depth is issuer-owned.
- Chainlink APXUSD / USD feed answer and staleness.
- Rate oracle for any `RateUpdated` event (currently 1.0).
- Admin Safe (4-of-6) and Guardian/Upgrader Safe (4-of-7) for any ownership/threshold changes or role grant/revoke events.
- Scheduled operations in AccessManager (`OperationScheduled` event) — any pending upgrade should trigger review during the delay window.
- Accountable PoR dashboard freshness, coverage ratio, connector count, and verifiability level.
- Chainlink CCIP Ethereum/Base, Ethereum/BNB, and Ethereum/Solana route status, remote token supply, and cross-chain escrow reconciliation.
- Uniswap V4 PoolManager apxUSD balance (~10.20M).
- Guardian Safe and Liquidity Safe LP token and apxUSD movements.
- STRC market price and distance from par, especially during sharp BTC drawdowns.
- **Weekend and holiday windows** where STRC marks are stale and apxUSD keeps trading — the mechanism behind June's deepest wicks.
- Operations Safe STRCx balance (713,088, ~42% of Ethereum STRCx supply) — a decline would reduce onchain visibility.
- Monthly Wolf examination-report cadence, link availability, and scope (September report expected around October 22).
- Curve v3 pool balance ratio (not virtual price) for directional pressure.

---

## Reassessment Triggers

- **Peg-based**: Reassess **upward** if apxUSD sustains above $0.99 for 30 days. Reassess **downward** if it falls below $0.97 again, on any leg down >3% in 24 hours, or if the discount widens past 5% for a sustained period.
- **Attestation cadence**: Reassess when the September 2026 Wolf examination report is published (expected around October 22). Also reassess if reports stop appearing, links break, the engagement standard or scope changes, or an opinion begins covering cash, liabilities, and collateral coverage in addition to securities.
- **Redemption mechanics**: Reassess if the Apyx 2.0 redemption value is enforced onchain in apxUSD mint/redeem, if the deny list is used against a non-sanctions counterparty, if `setUnlockingFee` or `unlockingDelay` change, or if apxUSD redemption is opened beyond the whitelist. The second and third would support raising Programmability from 3.5 to 4.0; the last would be a material improvement to Liquidity.
- **Accountable verification**: Reassess if the dashboard/API becomes unavailable or stale, asset-reserve coverage falls below 100% on two consecutive daily reports, inventory + POL moves by more than $10M in a day, Accountable removes or downgrades the Apyx registry entry, connector count decreases, or verifiability level decreases.
- **Chainlink NAV feed**: Reassess if the APXUSD / USD Exchange Rate feed answers below 0.99, goes stale for more than 26 hours, or diverges materially from Accountable's `redemption_value`.
- **Cross-chain / CCIP**: Reassess if any Ethereum/Base, Ethereum/BNB, or Ethereum/Solana CCIP lane is paused or impaired, token-pool/admin configuration or rate limits change materially, remote apxUSD/apyUSD supply diverges from Ethereum escrow accounting, or Apyx migrates to a different bridge provider.
- **Governance-based**: Reassess on any ownership/threshold change to the Admin, Guardian, or Liquidity Safe, any change to `targetAdminDelay` or `roleGrantDelay` on AccessManager, any grant of apxUSD mint roles 1/4, any rate-oracle change (upgrade or `setRate`), or any further apxUSD/apyUSD implementation upgrades.
- **Shared-product**: Reassess if alqUSD/aptUSD contracts gain any apxUSD mint, burn, or reserve-sharing path, or if the peg-liquidity/CoW contracts are upgraded, replaced, or verified.
- **Time-based**: Reassess in 1 month (early November 2026).
- **Supply/TVL-based**: Ethereum supply is ~302.47M. Reassess if it exceeds 400M (toward the 750M cap), if the supply cap changes, if remote-chain apxUSD supply grows materially without clear CCIP escrow reconciliation, or if the Uniswap V4 PoolManager apxUSD balance drops below 5M tokens.
- **Liquidity-based**: Reassess if a durable third-party venue appears (the condition that would most improve the Liquidity score), if Curve v3 pool balances fall below $2.5M, or if Uniswap V4 apxUSD inventory falls materially.
- **POL movement-based**: Reassess if the Liquidity Safe or Guardian Safe removes Curve v3 LP, or deploys LP into any new venue. Treat any such deployment as withdrawable, per June.
- **Collateral-based**: Reassess if STRC moves more than 5% from par, if issuer dividend policy changes, or if the basket composition shifts (SATA re-added or other assets added).
- **Market-stress based**: Reassess if BTC falls >10% in 1 hour or >20% in 24 hours and STRC prices, Accountable collateral coverage, or apxUSD peg quality deteriorate. Reassess urgently if this happens over a weekend/holiday while STRC marks are stale and apxUSD sells off before Nasdaq trading reopens — this is the exact sequence that produced the June depeg.
- **Incident-based**: Reassess after any exploit, unplanned oracle change, or any further NAV/reserve-reporting error.
- **Bug bounty**: Reassess if a bug bounty program is launched.

## Assessment History

| Date | Score | Notes |
|------|-------|-------|
| [March 26, 2026](https://github.com/yearn/risk-score/pull/110) | 5.0 (Gated) | Initial assessment. Failed Critical Risk Gates (no audit, unverifiable reserves, total centralization). |
| [April 19, 2026](https://github.com/yearn/risk-score/pull/140) | 3.5 | All critical gates cleared after governance restructure and attestation publication. Supply ~175M. |
| [May 29, 2026](https://github.com/yearn/risk-score/pull/227) | 3.66 | Tier raised to Elevated Risk. POL concentration (99.96% Curve LP), supply growth outpacing attestation (524M vs 67M attested). |
| [August 1, 2026](https://github.com/yearn/risk-score/pull/373) | 3.72 | June 2026 depeg recorded: apxUSD below par since early June, low ~$0.75, $0.881 at eight weeks. Guardian Safe withdrew ~88% of Curve LP June 1–5 and the remainder by July 6 (~$29M → ~$11.9K). Ethereum supply contracted 524M → 312M via onchain burns; Base and BNB Chain routes are live through CCIP. The 20-day cooldown applies to apyUSD, not direct apxUSD redemption. The deny list controls apxUSD transfers, apyUSD, and the unlock queue. Playwright retrieved Accountable's public API (92.24% asset-reserve coverage, $0.9131 redemption value, 100% dashboard verifiability, Nitro attestation) and all four Wolf examination reports for March–June. The Wolf opinions verify asset existence, ownership, custody, and valuation and name Alpaca for offchain STRC/SATA, but do not attest liabilities or coverage. Audits & Historical 3.5→4.0; Liquidity 4.0→4.5; Funds Management 3.875→3.5. |
| [October 5, 2026](https://github.com/yearn/risk-score/pull/PR_NUMBER) | 3.52 | apxUSD recovered from $0.881 to $0.988. Accountable asset-reserve coverage rose from 92.24% to 100.70% (above 100% since September 20), with ~$125.9M of Apyx inventory/POL excluded from circulating supply. Chainlink APXUSD/USD NAV feed returned to 1.0 on September 16. Apyx re-seeded issuer-owned liquidity: Curve v3 (~$4.8M, 85.3% LP in a 2-of-4 Safe; ~1M clears ~2.5% below par), an unverified NAV-bounded peg contract, and CoW orders. Wolf July/August reports are securities-only and show SATA at $0. Guardian Safe raised to 4-of-7. The Solana CCIP lane is live. alqUSD/aptUSD launched on the shared AccessManager without an apxUSD mint path. Audits & Historical 4.0→3.75; Funds Management 3.5→3.25; Liquidity 4.5→4.0. |
