# Protocol Risk Assessment: Avant savETH

- **Assessment Date:** October 28, 2026
- **Onchain Snapshot:** Ethereum block [26294115](https://etherscan.io/block/26294115) (hash `0xb912715c1f481f0ad114b21777b3f988f99d0a7dd0cf13d395aab282d4645e1c`, October 28, 2026 22:06:59 UTC). Arbitrum and Linea remote-supply reads, the Morpho API, DeFiLlama and Avant's transparency API were read the same evening at current state, not at a pinned block. The multi-chain reserve reconciliation (October 29, 2026) used public RPC endpoints for Monad, Sei, Berachain and Avalanche at the requester's instruction.
- **Token:** savETH (Staked avETH)
- **Chain:** Ethereum
- **Token Address:** [`0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341`](https://etherscan.io/address/0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341)
- **Final Score: 3.47/5.0**

> **Address correction.** The [request issue](https://github.com/yearn/risk-score/issues/565) links [`0xb8D89678E75a973E74698c976716308abB8a46A4`](https://etherscan.io/address/0xb8D89678E75a973E74698c976716308abB8a46A4). Onchain, that contract is `"Staked avUSD"` / `savUSD`, a CCIP-bridged copy of Avant's USD product. Avant's [contract-address page](https://docs.avantprotocol.com/security/contract-addresses) lists it the same way. The issue title, its description and the referenced [WETH/savETH Morpho market](https://app.morpho.org/ethereum/variable/0xd98cd88ae5b336086b39fb1d62ba6171282e946105b010143f0e89f8fe7cff36/weth-saveth#market) all refer to savETH. That market's `collateralToken` is [`0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341`](https://etherscan.io/address/0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341) (`name()` = `"Staked avETH"`, `symbol()` = `"savETH"`). This report assesses that token.

## Overview + Links

Avant is an Ethena-style yield protocol that issues three tokens per underlying asset ([Core Tokens](https://docs.avantprotocol.com/overview/core-tokens)):

- **avETH** [`0x9469470C9878bf3d6d0604831d9A3A366156f7EE`](https://etherscan.io/address/0x9469470C9878bf3d6d0604831d9A3A366156f7EE) is the base token. It is minted 1:1 against WETH through an RFQ minting contract. Avant moves the WETH straight into offchain-managed "market-neutral" strategies. avETH earns no yield itself.
- **savETH** [`0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341`](https://etherscan.io/address/0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341) is the assessed token: an ERC-4626 vault over avETH and the **senior tranche**. Avant credits it daily with avETH yield. Exits use a cooldown (currently 24 hours).
- **avETHx** ("avETH MAX") [`0x2E8b7190eE84E7AC757Ddff42Ba14d4EAe24B865`](https://etherscan.io/address/0x2E8b7190eE84E7AC757Ddff42Ba14d4EAe24B865) is the **junior tranche**. It receives an extra 10% share of yield in exchange for absorbing losses before savETH. Its price is set by an Avant service key in a `PriceStorage` contract.

The contracts are close copies of Ethena's `USDe` / `EthenaMinting` / `StakedUSDeV2`, renamed (`AvantCoin`, `AvantMintingV2`, `StakedAvantCoinV2`). They keep Ethena's single-admin role model, blacklist-and-redistribute powers and cooldown silo.

**Yield source (from Avant's own transparency API).** The ETH book is more than an ETH lending book. Avant's [`/api/metrics/aveth`](https://app.avantprotocol.com/api/metrics/aveth) endpoint, which backs the [Transparency page](https://app.avantprotocol.com/transparency), reported the following as of October 13, 2026:

- **$30.44M of ETH and derivatives:** WETH $12.94M, weETH $11.26M, wstETH $5.16M, WETH.e $1.08M. This is mostly collateral on Aave, Spark, Morpho, Euler and Curvance.
- **$37.86M of stablecoin debt** plus $2.58M of HONEY debt borrowed against that collateral.
- **$39.22M of stablecoin assets** bought with the borrowed funds. Most is Avant's own **savUSD ($32.71M)**, plus avUSD ($2.33M), Curvance hyAUSD ($1.79M) and cAUSD ($1.27M).
- **Net NAV $30.46M; asset/liability coverage 175.3%.**

In plain terms, savETH's yield is largely an ETH-collateralised carry trade into Avant's USD product. savUSD alone equals **107% of the avETH book's NAV**. See [Collateralization](#collateralization).

**Key metrics (snapshot block 26294115):**

| Metric | Value | Source |
|---|---|---|
| avETH supply | 12,211.18 avETH (~$28.79M at Chainlink ETH/USD $2,357.83) | `avETH.totalSupply()` |
| savETH supply | 10,110.82 savETH | `savETH.totalSupply()` |
| savETH `totalAssets()` | 10,739.35 avETH | `savETH.totalAssets()`; matches the vault's avETH balance (no unvested rewards) |
| savETH exchange rate | 1.062164 avETH per savETH | `convertToAssets(1e18)` |
| avETHx supply / price | 1,326.59 avETHx × 1.100357 avETH = 1,459.72 avETH | `PriceStorage.lastPrice()` |
| DeFiLlama Ethereum TVL | $28.82M (12,211.18 WETH) | [DeFiLlama — Avant Protocol](https://defillama.com/protocol/avant-protocol) |
| DeFiLlama protocol TVL (all chains) | $150.8M (Avalanche $121.95M, Ethereum $28.82M) | same |
| Recent savETH APY | 3.61% (week of Oct 22, 2026); avETHx 7.37% | Avant metrics API |

**Links:**

- [Protocol Documentation](https://docs.avantprotocol.com/)
- [App / Transparency dashboard](https://app.avantprotocol.com/transparency)
- [Contract Addresses](https://docs.avantprotocol.com/security/contract-addresses)
- [Strategy Addresses](https://docs.avantprotocol.com/yield-strategies-and-revenue/strategy-addresses)
- [Contract and OPSEC Audits](https://docs.avantprotocol.com/security/contract-and-opsec-audits)
- [DeFiLlama](https://defillama.com/protocol/avant-protocol)
- [Morpho WETH/savETH market](https://app.morpho.org/ethereum/variable/0xd98cd88ae5b336086b39fb1d62ba6171282e946105b010143f0e89f8fe7cff36/weth-saveth#market)
- Related report in this repository: [Curvance hyAUSD](curvance-hyausd.md), whose Appendix B covers Avant's savUSD stack on Avalanche (the same code base and the same admin key)

No public GitHub repository was found; all code review below is against Etherscan-verified source.

## Audits and Due Diligence Disclosures

Avant publishes eight smart-contract reports on its [audits page](https://docs.avantprotocol.com/security/contract-and-opsec-audits). The figures below come from the PDFs themselves:

| Date | Firm | Scope | Findings (as reported) |
|---|---|---|---|
| June 6, 2024 | Dedaub | Avant USD (avUSD/savUSD/minting) | No critical/high/medium; low and advisory items, some acknowledged |
| July 13, 2024 | Omniscia | avUSD System | 3 medium (2 alleviated, 1 acknowledged), 1 minor (acknowledged), 22 informational (19 alleviated) |
| March 31, 2025 | Omniscia | avUSD Minting v2 | No major/medium; minor and informational items, all alleviated |
| April 1, 2025 | Omniscia | Cross-chain ERC-20 token bridge (CCIP tokens) | No major/medium; minor and informational items, all alleviated |
| August 26, 2025 | Riley | Max (junior tranche) contracts | Acknowledged items, including immutable deployment and admin hand-off |
| August 27, 2025 | Cyfrin | Max (junior tranche) contracts | 0 C/H/M; 2 low (both acknowledged), 7 informational |
| June 24, 2026 | Cyfrin | RequestsManagerV2 | 0 C/H/M; 1 low (acknowledged), 3 informational |
| June 24, 2026 | Cyfrin | RequestsManagerV2 formal verification | 1 low (acknowledged) |

**Material unresolved finding — Cyfrin L-2 "Use multi-sig wallet for contract admin and owner" (Acknowledged).** Cyfrin found that the Ethereum deployer [`0xA5Ab0683d4f4AD107766a9fc4dDd49B5a960e661`](https://etherscan.io/address/0xA5Ab0683d4f4AD107766a9fc4dDd49B5a960e661) and the then-admin [`0xD47777Cf34305Dec4F1095F164792C1A4AFB327e`](https://etherscan.io/address/0xD47777Cf34305Dec4F1095F164792C1A4AFB327e) were both EOAs. Avant replied that it *"intends to transfer contract ownership and admin privileges to EOAs within the ForDeFi custodian ecosystem… only a quorum of admin-level users will be allowed to perform admin contract calls."* Onchain, admin did move in September 2025 to [`0xd4d23209aaE8630bf386b7393763a5b7865e57cb`](https://etherscan.io/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb) (block 23291289 for avETH ownership). That address has no code, so it is consistent with a Fordefi MPC wallet but cannot be shown to be one onchain. See [Governance](#governance).

**Code complexity:** low to moderate. The ETH stack is a near-verbatim Ethena fork plus a small request/price-storage pair for the junior tranche. The real complexity sits offchain, in how the book is run.

**Code match (ETH deployments vs audited code).** No audit names the ETH deployments, and the audited commits are in a private repository, so no hash-level diff is possible. The Avalanche avUSD contracts are not on Sourcify, and Etherscan's free tier does not serve Avalanche. As a substitute, the verified ETH sources were normalised (asset names mapped back) and diffed against Ethena's public originals: [`StakedUSDeV2`](https://etherscan.io/address/0x9D39A5DE30e57443BfF2A8307A4256c8797A3497) and [`USDe`](https://etherscan.io/address/0x4c9EDD5852cd905f086C759E8383e09bff1E68B3). The remaining differences were then matched to the audit texts:

- **Junior contracts:** `SimpleToken`, `PriceStorage` and `RequestsManagerV2` carry exactly the file names in the Cyfrin/Riley scopes.
- **savETH / Silo / `SingleAdminAccessControl`:** apart from an OpenZeppelin v5 port (`_update` hook, `_grantRole` return value) and ETH-sized `MIN_SHARES` (0.00001 vs Ethena's 1), every change from Ethena matches a recorded Omniscia avUSD-System remediation. These are `SafeERC20` in the Silo, the zero-amount early return in `unstake()`, and the cached `cooldowns` storage pointer.
- **`AvantMintingV2`:** the 1:1 ratio check (`_checkCollateralToStablecoinRatio` / `stablesDeltaLimit`) is the code quoted in Omniscia's Minting v2 report.
- **Unaudited delta — avETH's minter model.** The audited avUSD (Omniscia, July 2024) has a single `address public minter` set by `setMinter(address newMinter)`. avETH instead has a `minters` mapping with `setMinter(address,bool)`, allowing any number of concurrent minters. No reviewed audit covers this change. It does not create the unbacked-mint power, since the owner could repoint the single minter in the audited design too. It does mean a newly added minter would not displace `AvantMintingV2`, so it would be less visible.

Net: the ETH senior stack is audited avUSD code plus recorded remediations. The only unaudited logic change found is in the mint-authority model.

### Bug Bounty

- **No public bug bounty found.** `immunefi.com/bug-bounty/avant` and `/avantprotocol` return 404, and `cantina.xyz/bounties/avant` shows "Bounty not found". Avant's docs do not mention a bounty.
- **Safe Harbor: not adopted.** The [SEAL Safe Harbor registry](https://safeharbor.securityalliance.org/)'s data API (`/api/v1/agreements`) lists 33 adopting protocols on October 29, 2026, and Avant is not among them. The `avant`, `avant-protocol` and `avantprotocol` slugs return an empty body, the same as a nonexistent slug. No Avant admin or token address appears in any agreement.
- **Operational security:** Avant states that Trail of Bits runs an ongoing OPSEC engagement (findings not published) and that Hypernative provides real-time monitoring ([Security Partners](https://docs.avantprotocol.com/security/security-partners)).

## Historical Track Record

- **Protocol:** founded June 2024 by Rhett Shipp, who also founded Gravita. The founding was reported with a $6.5M seed round at a $25M post-money valuation ([The Block, Nov 27, 2024](https://www.theblock.co/post/328512/avant-protocol-ethena-like-seed-funding)). avUSD has run on Avalanche since late 2024.
- **savETH:** deployed August 11, 2025 ([creation tx](https://etherscan.io/tx/0xd98e54775643e7d617fc98331ca26ffd5aa62979a8c7dac6c9e3c1a9ac40f1f5)), so **~14.5 months** in production.
- **No exploits or depegs found** in public sources. A full `PriceSet` scan of the junior `PriceStorage` (58 updates) found **no downward price moves**, so the junior tranche has never been marked down for a loss.
- **savETH growth** (supply and exchange rate at each month's last savETH transfer):

| Month | savETH supply | Rate (avETH/savETH) |
|---|---:|---:|
| Sep 2025 | 866.7 | 1.003867 |
| Dec 2025 | 2,151.0 | 1.021425 |
| Mar 2026 | 4,479.5 | 1.033373 |
| Jun 2026 | 7,599.3 | 1.046605 |
| Aug 2026 | 10,494.9 (peak) | 1.055062 |
| Oct 2026 | 10,110.8 | 1.062164 |

- **avETH flows:** 530 mints totalling 18,995.38 avETH and 275 redemptions totalling 6,784.20 avETH. That nets to 12,211.18, exactly matching supply. The largest single redemption was 793.02 avETH ([tx](https://etherscan.io/tx/0x08017f114dcfb17ce3f2d5c2906d78360592584671da88ba3c8e95f79710abbc), May 2026); the largest month was May 2026 at 2,139.99 avETH redeemed.
- **Concentration (savETH holders, full Transfer-history reconstruction):**

| Holder | savETH | Share |
|---|---:|---:|
| Gearbox `CreditAccountV3` [`0x6cc892a7ad2c72b8f0d49ce8660da928f7e6101b`](https://etherscan.io/address/0x6cc892a7ad2c72b8f0d49ce8660da928f7e6101b) ("savETH CM", borrower [`0x3D461625Dc02F1D4c8b14601439357be2eC07904`](https://etherscan.io/address/0x3D461625Dc02F1D4c8b14601439357be2eC07904)) | 3,353.98 | 33.17% |
| CCIP `LockReleaseTokenPool` [`0x43f47a434dadd5a122c42e49378365cca949fa54`](https://etherscan.io/address/0x43f47a434dadd5a122c42e49378365cca949fa54) (bridged to Arbitrum/Dolomite) | 1,702.10 | 16.83% |
| Morpho Blue [`0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb`](https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb) | 1,687.07 | 16.69% |
| EOA [`0x66b206c91374453cda591e84287eefef7a3d4f21`](https://etherscan.io/address/0x66b206c91374453cda591e84287eefef7a3d4f21) | 1,226.40 | 12.13% |
| EOA [`0x3D461625Dc02F1D4c8b14601439357be2eC07904`](https://etherscan.io/address/0x3D461625Dc02F1D4c8b14601439357be2eC07904) | 473.59 | 4.68% |
| Morpho Midnight [`0x471686c42792f93528b000bef54bc10e3aa2045f`](https://etherscan.io/address/0x471686c42792f93528b000bef54bc10e3aa2045f) | 400.00 | 3.96% |

  Only 80 addresses hold savETH. About 70% of supply sits in leveraged-lending venues (Gearbox, Morpho, Dolomite via CCIP, Midnight), and a few looping addresses dominate both minting and borrowing.

## Funds Management

### Accessibility

- **Minting avETH:** permissioned RFQ. The user signs an EIP-712 order, and Avant's `MINTER_ROLE` EOA [`0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2`](https://etherscan.io/address/0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2) submits it to `AvantMintingV2` [`0x09becF6E5e297825D19aA14eD6081A03524532D7`](https://etherscan.io/address/0x09becF6E5e297825D19aA14eD6081A03524532D7). The user's WETH goes **directly to the custodian address** in the same transaction, and avETH is minted. `WETH` is the only supported asset.
- **Staking:** permissionless ERC-4626 `deposit`/`mint` of avETH into savETH. Soft-blacklisted addresses are blocked; none are currently blacklisted.
- **Unstaking:** `cooldownShares`/`cooldownAssets` burns savETH, moves the avETH to the `AvantCoinSilo` [`0x1a3e690B6EbC3013A89e922167570B2684D238e8`](https://etherscan.io/address/0x1a3e690B6EbC3013A89e922167570B2684D238e8), and starts a `cooldownDuration` timer, currently **86,400 s (24 h)**. `unstake()` then releases the avETH. A new cooldown resets the timer for the user's whole pending amount. No yield accrues while cooling down.
- **Redeeming avETH for WETH:** permissioned RFQ through `REDEEMER_ROLE` (the same EOA). The contract pays out of **its own WETH balance**, which was 0.0000001 WETH at the snapshot, so Avant must fund it from strategies before each redemption. The docs say redemptions *"can take up to 7 days depending on market liquidity"* ([Redeeming avAssets](https://docs.avantprotocol.com/overview/using-avant-protocol/redeeming-avassets)).
- **Eligibility:** the [Terms of Use](https://docs.avantprotocol.com/legal-and-risk/terms-of-use) bar Restricted Persons, which include **US** persons and residents of sanctioned territories. Avant may "refuse to execute instructions" for compliance reasons.
- **Rate limits:** `maxMintPerBlock` = `maxRedeemPerBlock` = 5,000 avETH (raised from 250 at block 23584116). Per-block caps bind only within `AvantMintingV2`.
- **Fees:** redemption fee "may apply", shown in the app. Junior `mintFee`/`burnFee` are 0.

**Selective fast-exit windows.** The admin has called `setCooldownDuration` **97 times**: 50 × 86,400 s, 46 × 60 s, and once 604,800 s (the deploy value). Since April 20, 2026 it has repeatedly dropped the cooldown to **60 seconds** for a few minutes (median window 336 s, longest 6.9 days) and then restored 24 h. The three most recent windows were October 20, 21 and 22, 2026 ([example](https://etherscan.io/tx/0x642d16ed7f379026fae279d0048011b28c34b4a29a31197377ff2876328bd781)). **3,135.3 avETH of the 7,139.5 avETH ever unstaked (44%) left during these windows.** Most of it went to Safe [`0x1cde180fd33935c744623d655696eb3a77e5d891`](https://etherscan.io/address/0x1cde180fd33935c744623d655696eb3a77e5d891) (2-of-5; 2,252.9 avETH) and to the market's large borrowers. The windows are unannounced, so in practice the admin offers near-instant exits to some holders. A liquidator cannot plan around them.

### Token Mint Authority

savETH itself has no privileged mint: shares are minted only by ERC-4626 deposit against avETH, plus `redistributeLockedAmount` (below). The material mint authority is over **avETH**, which savETH holds.

**Mint mechanism:** avETH is `Ownable2Step` with a `minters` mapping. `setMinter(address,bool)` is `onlyOwner`, and `mint()` checks only `minters[msg.sender]`.

**Mint requires backing:** *Through `AvantMintingV2`, yes.* `stablesDeltaLimit` = 0, so `avantcoin_amount` cannot exceed the WETH amount, and the WETH must be transferred from the benefactor in the same transaction. **Through `setMinter`, no.** The avETH owner can appoint any address, including itself, as a minter and mint without limit. The per-block caps live only in `AvantMintingV2`.

**Per-address mint authority** (verified onchain at block 26294115 from [`0x9469470C9878bf3d6d0604831d9A3A366156f7EE`](https://etherscan.io/address/0x9469470C9878bf3d6d0604831d9A3A366156f7EE); full `MinterUpdated` and `OwnershipTransferred` history scanned from deployment):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---|:-:|:-:|---|---|
| [`0x09becF6E5e297825D19aA14eD6081A03524532D7`](https://etherscan.io/address/0x09becF6E5e297825D19aA14eD6081A03524532D7) `AvantMintingV2` | ✓ | ✓ (`burnFrom` on redeem, needs holder allowance) | `minters[...] = true` (single `MinterUpdated` event, block 23120623) | Atomic 1:1 WETH backing; 5,000 avETH/block cap |
| [`0xd4d23209aaE8630bf386b7393763a5b7865e57cb`](https://etherscan.io/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb) (avETH `owner()`) | Indirect | — | `setMinter` | Can grant itself unbounded mint; no timelock |
| [`0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2`](https://etherscan.io/address/0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2) | Via `AvantMintingV2` | Via `AvantMintingV2` | `MINTER_ROLE` + `REDEEMER_ROLE` on minting | Hot EOA (nonce 1,123). Needs a benefactor signature **and** that benefactor's WETH, so it cannot mint unbacked |

On Ethereum, avETH's CCIP pool is a `LockReleaseTokenPool` [`0xbd09e8846b9dbda54ef386bd9ef3bbd15add50ee`](https://etherscan.io/address/0xbd09e8846b9dbda54ef386bd9ef3bbd15add50ee) (0.0012 avETH escrowed), so it cannot mint canonical avETH.

**Other savETH supply or balance powers (savETH `DEFAULT_ADMIN_ROLE` = [`0xd4d23209aaE8630bf386b7393763a5b7865e57cb`](https://etherscan.io/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb)):**

- `redistributeLockedAmount(from, to)` burns the **entire** savETH balance of a `FULL_RESTRICTED_STAKER_ROLE` holder and mints it to `to` (or burns it into vesting). The admin can grant itself `BLACKLIST_MANAGER_ROLE`, blacklist any address except the owner, and then seize. **This can target Morpho Blue, the Gearbox credit account, Midnight or the CCIP pool.**
- `transferInRewards` (`REWARDER_ROLE`, hot EOA [`0xdb87e930065bc4c9cc4273672a64bf8e2761f1d8`](https://etherscan.io/address/0xdb87e930065bc4c9cc4273672a64bf8e2761f1d8)) adds avETH that vests over 8 h. The rewarder cannot remove assets. Paired with an unbacked avETH mint, however, it can inflate the savETH rate.
- `rescueTokens` reverts for the avETH asset, so the admin cannot pull staked avETH out of the vault.

Role enumeration (full `RoleGranted`/`RoleRevoked` scan, confirmed with `hasRole` at the snapshot):

| Contract | Role | Holder |
|---|---|---|
| savETH | `DEFAULT_ADMIN_ROLE` / `owner()` | `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` |
| savETH | `REWARDER_ROLE` | `0xdb87e930065bc4c9cc4273672a64bf8e2761f1d8` (EOA) |
| savETH | `BLACKLIST_MANAGER_ROLE`, `SOFT_/FULL_RESTRICTED_STAKER_ROLE` | none ever granted |
| avETH | `owner()` (Ownable2Step; `pendingOwner` = 0) | `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` |
| AvantMintingV2 | `DEFAULT_ADMIN_ROLE`, `COLLATERAL_MANAGER_ROLE` | `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` |
| AvantMintingV2 | `MINTER_ROLE`, `REDEEMER_ROLE` | `0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2` (EOA) |
| AvantMintingV2 | `GATEKEEPER_ROLE` | none |
| avETHx, PriceStorage, RequestsManagerV2 | `defaultAdmin()` (1-day `defaultAdminDelay` on admin transfer only) | `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` |
| PriceStorage | `SERVICE_ROLE` (sets junior price) | `0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2` |
| avETHx | `SERVICE_ROLE` (mint/burn) | RequestsManagerV2 [`0x9362B7986E162E99e5d28969214e5797682D7a39`](https://etherscan.io/address/0x9362B7986E162E99e5d28969214e5797682D7a39); legacy manager revoked |
| savETH CCIP pool | `owner()`, `getTokenConfig().administrator` | `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` |

### Collateralization

**Where the backing is.** Mint-time WETH goes directly to the **sole registered custodian** [`0xd0f02713D9905D4F08512F3305Eee1CAC47D6ac9`](https://etherscan.io/address/0xd0f02713D9905D4F08512F3305Eee1CAC47D6ac9). That address is an EOA and is also listed as an avETH strategy address. There have been **zero `CustodyTransfer` events**, so collateral never sits in a protocol contract. At the snapshot the custodian held only 0.147 ETH and spam tokens. The custodian forwards it: 16,121.8 WETH has gone out to strategy wallet [`0x6CC60A0b57bc882A0471980D0e2D4aD7DDf3C4bD`](https://etherscan.io/address/0x6CC60A0b57bc882A0471980D0e2D4aD7DDf3C4bD) (4,430.4 returned) and 6,780.9 WETH to `AvantMintingV2` for redemptions. From `0x6CC6…` the assets go into Aave V4, Spark, Aave V3 and Morpho on Ethereum, and over bridges (Wormhole NTT, AggLayer, CCIP) to Monad, Sei, Berachain and Base. The positions are itemised in the reconciliation below. That wallet also supplies 40.0 WETH to the very Morpho savETH market under review.

**Onchain reconciliation (all chains).** All **60 EVM addresses** Avant publishes were checked: strategy wallets for every product, archived ones, and the Reserve Funds.

- **Wallet:** essentially the whole ETH book sits in one published wallet, [`0x6CC60A0b57bc882A0471980D0e2D4aD7DDf3C4bD`](https://etherscan.io/address/0x6CC60A0b57bc882A0471980D0e2D4aD7DDf3C4bD), which uses the same address on every chain.
- **Ethereum reads:** at the snapshot block.
  - Aave V3 Core/Lido/EtherFi, Spark, and **Aave V4**. The Aave V4 Spoke is [`0x94e7A5dCbE816e498b89aB752661904E2F56c485`](https://etherscan.io/address/0x94e7A5dCbE816e498b89aB752661904E2F56c485); its Hub is [`0xcca852bc40e560adc3b1cc58ca5b55638ce826c9`](https://etherscan.io/address/0xcca852bc40e560adc3b1cc58ca5b55638ce826c9).
  - Morpho through its API.
- **Other chains:** read on October 29, 2026 at current state.
  - Monad, Sei, Berachain and Avalanche were read through their **public RPC endpoints**, used at the requester's instruction because no configured RPC exists for them. Base and Katana used the configured RPCs.
  - Token discovery used Etherscan v2 `tokentx` (Monad, Sei, Berachain).
  - Sei and Berachain Morpho positions came from onchain `SupplyCollateral`/`Borrow` events plus `position()`. Curvance used `convertToAssets`/`debtBalance`.

| Chain | Assets located | Debt located |
|---|---|---:|
| Ethereum | **Aave V4:** 4,167.75 WETH + 550 wstETH + 4,680.81 weETH (10,034.2 ETH). **Spark:** 1,100.72 wstETH. **Aave V3:** 96.42 weETH + 73.04 WETH. **Morpho:** 40 WETH supplied. Together **11,627.6 ETH**. Also $5.69M savUSD (Morpho collateral) and $0.08M Euler eUSDC | Aave V4 $14.22M (12.60M USDG, 1.12M frxUSD, 0.50M USDC; HF 1.37); Spark $1.97M; Aave V3 $0.25M; Morpho USDC $4.80M |
| Monad | Curvance: 8,682,909 savUSD collateral (two markets), 1.28M AUSD + 0.38M USDC supplied, 1.80M AUSD in hyAUSD; Morpho $0.24M savUSD | Curvance AUSD $4.65M, USDC $0.81M |
| Sei | Morpho: 6,963,825 savUSD collateral | PYUSD0 $4.18M |
| Berachain | Morpho: 2,651,425 savUSD + 130 WETH collateral | BUSD $2.57M |
| Base | Morpho: $2.09M savUSD collateral | USDC $1.72M |
| Avalanche | 99,000 savUSD | — |

savUSD units are valued at the Avalanche vault rate (1.212211 avUSD) with avUSD at $1; ETH at the snapshot Chainlink price, $2,357.83.

- **Located gross ETH collateral:** **11,757.6 ETH, 96.3% of the 12,211.18 avETH outstanding**. On Ethereum it matches Avant's own ≈11,671 ETH figure to within 0.4%.
- **Located stablecoin side:** $33.87M of assets against $35.17M of debt. **savUSD alone is $30.32M, 115% of located NAV.**
- **Located net NAV: 11,203.6 ETH, i.e. 91.75% of avETH supply. Unlocated: ≈1,008 ETH.**

The gap corresponds to dashboard items not found in published wallets at current state: Avalanche WETH.e, Aave and Royco legs; Movement (non-EVM); Berachain Kodiak/Bex LPs and Dolomite; Midas mGLOBAL; and a Stake DAO LP. As of October 13 these totalled ≈$3.4M net (≈1,450 ETH). They could have moved since, or sit in unpublished wallets. **No attestation covers them.**

The reconciliation therefore supports Avant's dashboard rather than contradicting it. Reserves *are* verifiable onchain, but only with multi-chain, multi-protocol work, and the net figure depends on savUSD being worth its avUSD rate (see [Curvance hyAUSD, Appendix B](curvance-hyausd.md)). An earlier version of this report understated located collateral (1,593 ETH) because its scan omitted Aave V4.

**Self-reported book (Avant metrics API, October 13, 2026):**

| Bucket | Assets | Debt |
|---|---:|---:|
| ETH & derivatives (WETH, weETH, wstETH, WETH.e, ETH) | $30.44M | — |
| Stablecoins: savUSD $32.71M, avUSD $2.33M, hyAUSD $1.79M, cAUSD $1.27M, other $1.12M | $39.22M | $37.86M (USDC, USDG, USDS, PYUSD0, cAUSD, frxUSD, RLUSD, PYUSD, USDC.e, USDT) |
| Other (Midas mGLOBAL $0.78M, HONEY $0.45M, misc.) | $1.24M | $2.58M (HONEY) |
| **Net NAV** | **$30.46M** | |

At the October 13 Chainlink price ($2,498.07, block 26187014), the NAV equals **12,192.86 ETH against 12,135.12 avETH outstanding: 100.48%, a 57.7 ETH surplus**. This is Avant's own figure. There is no attestation or proof of reserve; Chainlink PoR is "actively developing" per [Security Partners](https://docs.avantprotocol.com/security/security-partners).

**Collateral quality and the circular exposure.** The ETH legs are blue-chip LSTs on blue-chip lenders. The yield, however, comes from borrowing ~$40M of dollars against them and holding **Avant-issued savUSD/avUSD and Curvance products (≈$38.7M, 127% of NAV)**. savUSD is itself backed ~99% offchain under the same admin key (see [Curvance hyAUSD, Appendix B](curvance-hyausd.md)). Two consequences follow:

1. **An ~11% loss on savUSD would consume the whole first-loss buffer**, and anything beyond that falls on savETH. All figures below are at the October 13, 2026 NAV date (block 26187014, ETH $2,498.07):
   - **Junior tranche:** 1,313.67 avETHx × 1.097376 = **1,441.59 avETH ($3.60M)**, matching the 1,441.62 avETH then held by the junior treasuries. That is **11.01%** of the $32.71M savUSD position.
   - **With the reported surplus and Reserve Fund:** adding the 57.74 ETH surplus and the Reserve Fund's 40.31 avETH raises it to 1,539.64 avETH ($3.85M), **11.76%**.
   - **At a 13% savUSD loss ($4.25M):** this leaves **≈$405.8K of senior impairment**.

   The ETH and USD products are therefore not isolated, despite the docs' per-asset Reserve Funds.
2. The stablecoin positions are themselves levered (savUSD/cAUSD as collateral on Curvance and Morpho). A savUSD oracle drop could trigger liquidations inside the ETH book.

**First-loss buffer (onchain, snapshot block):**

| Layer | Amount (avETH) | Notes |
|---|---:|---|
| Junior avETHx: 1,326.59 × 1.100357 | 1,459.72 | Held as avETH in treasury [`0xdD71CDd615f677E98C604bFF5679294cC7a6089b`](https://etherscan.io/address/0xdD71CDd615f677E98C604bFF5679294cC7a6089b) (1,381.46) + [`0x29b091B0b70D24FEd3BEC3f511B92CC54307c0F6`](https://etherscan.io/address/0x29b091B0b70D24FEd3BEC3f511B92CC54307c0F6) (78.23) = 1,459.68 ✓ |
| ETH Reserve Fund [`0x4a6f696a6F921921dC959D19E911a2034063CFdA`](https://etherscan.io/address/0x4a6f696a6F921921dC959D19E911a2034063CFdA): 38.01 savETH × 1.062164 | 40.37 | Held **in savETH**, i.e. a claim on the pool it protects |
| Governance backstop | — | "Planned future" per [Fund Protection Layers](https://docs.avantprotocol.com/security/fund-protection-layers) |
| **Senior avETH** (supply less junior holdings) | 10,751.50 | savETH vault 10,739.35 + silo 2.45 + other holders |

At the snapshot, the junior buffer is **13.58%** of senior avETH (13.95% including the circular Reserve Fund). That ratio measures cover against senior *liabilities*. Measured against the savUSD exposure that drives the main loss scenario, the cover is **11.01% (junior only) / 11.76% (with surplus and Reserve Fund)** at the aligned October 13 figures above.

**The waterfall is not enforced onchain.** savETH's rate is `avETH balance / shares` and cannot fall. A loss would surface instead as avETH being worth less than 1 ETH. The junior tranche absorbs it only if Avant (a) cuts the avETHx price through `PriceStorage` and (b) burns or uses the junior treasury's avETH to restore the backing ratio. Both are discretionary actions by the same admin and service keys. `PriceStorage` bounds each update to +5% / −33%, but there is no limit on how many updates can be chained.

**Can Avant "do whatever it wants" with the assets?** Onchain, yes. The custodian and strategy wallets are EOAs (MPC per Avant), with no contract-level allowlist. Guardrails exist only offchain: Avant describes Fordefi policy-engine address whitelisting, RBAC, and multi-signature authorization for external transfers ([Operational Security](https://docs.avantprotocol.com/security/operational-security), [Secure Asset Management](https://docs.avantprotocol.com/security/secure-asset-management)). The Terms state that Reserves are **"beneficially owned by the Foundation"**, so holders have a contractual claim, not ownership of the assets.

### Provability

- **savETH/avETH ratio:** fully onchain and reproducible (`totalAssets()` = vault avETH balance − unvested). It rose monotonically from 1.000 to 1.062164 over 14 months.
- **Yield input:** Avant computes the weekly yield offchain and pushes it daily through `transferInRewards`. There were 405 distributions totalling 277.48 avETH; the largest was 1.706 avETH. Nothing onchain checks that a distribution matches realised strategy P&L.
- **avETH backing:** offchain-managed but held in onchain DeFi positions. An independent multi-chain reconciliation of the published wallets located 91.75% of avETH supply net (see [Collateralization](#collateralization)). Avant publishes 10 ETH strategy addresses (EVM, Aptos, Stellar), and its transparency API reports a weekly NAV and allocation breakdown. The latest period end was October 13, 15 days before this snapshot. There is no third-party attestation, Merkle proof or live PoR.
- **Junior price:** set by the service EOA through `PriceStorage.setPrice` within per-update bounds; not computed onchain.

## Liquidity Risk

**There is no secondary market.** Checks run:

- Uniswap V3 savETH/WETH and avETH/WETH at every fee tier (100/500/3000/10000): no pool.
- Uniswap V2: no pair. Curve MetaRegistry `find_pools_for_coins`: empty.
- GeckoTerminal: a single ~$100 V4 savETH/USDC pool.
- The Uniswap V4 PoolManager holds 0 savETH and 0 avETH.
- The full holder reconstruction shows no AMM, Balancer or Curve contract holding either token.

**The only exit to WETH is through Avant:**

1. `cooldownShares`: 24 h. The admin can set the duration from 0 to 90 days, but a change applies only to cooldowns started (or reset) afterwards. Each request stores its own `cooldownEnd`.
2. `unstake()` returns avETH.
3. An RFQ redemption executed by Avant's `REDEEMER_ROLE` EOA, paid from WETH Avant must first move into `AvantMintingV2`. Documented at up to 7 days; per-block cap 5,000 avETH.

The full path is therefore **~2 to 8 days and permissioned**. US persons are excluded by the Terms. Historical redemptions were serviced up to 793 avETH in one transaction and 2,140 avETH in a month. That is evidence of operational capacity, not a guarantee.

**Implications for a lender (Morpho market `0xd98cd88ae5b336086b39fb1d62ba6171282e946105b010143f0e89f8fe7cff36`):**

- **Market:** LLTV 91.5%, oracle [`0x943da86D8686f86F0b3b43fF78A92AAE1A6Ed3a7`](https://etherscan.io/address/0x943da86D8686f86F0b3b43fF78A92AAE1A6Ed3a7), AdaptiveCurve IRM. 1,359.51 WETH supplied, 1,207.84 WETH borrowed (88.84% utilisation), 151.67 WETH idle. Collateral is 1,687.06 savETH, an aggregate LTV of 67.4%. The only listed vault supplier is KPK ETH Yield (V2) [`0x5dbf760b4fd0cDdDe0366b33aEb338b2A6d77725`](https://etherscan.io/address/0x5dbf760b4fd0cDdDe0366b33aEb338b2A6d77725). No bad debt.
- **Borrowers:** three positions hold essentially all debt:

| Borrower | Collateral (savETH) | Debt (WETH) | Health factor |
|---|---:|---:|---:|
| [`0xE29Bb87D5a3a8Ef6b24EDb35D0D8eF0241cB39d1`](https://etherscan.io/address/0xE29Bb87D5a3a8Ef6b24EDb35D0D8eF0241cB39d1) | 885.81 | 768.86 | 1.120 |
| [`0x3D461625Dc02F1D4c8b14601439357be2eC07904`](https://etherscan.io/address/0x3D461625Dc02F1D4c8b14601439357be2eC07904) | 570.89 | 262.06 | 2.117 |
| [`0x8C2527051D0E98ad09211749FafbE1Aa590c01B3`](https://etherscan.io/address/0x8C2527051D0E98ad09211749FafbE1Aa590c01B3) | 192.70 | 176.92 | 1.059 |

  All three are EOAs and among the largest avETH minters, i.e. savETH loopers.
- **Liquidation incentive:** at 91.5% LLTV, Morpho's LIF is `1/(0.3·0.915+0.7)` = **1.0262, a 2.6% bonus**. A liquidator of the largest position would receive ~850 avETH-equivalent of savETH. They would then carry it for days through a permissioned redemption, with US persons excluded, to earn 2.6%. Liquidators are therefore likely to be Avant-affiliated or OTC counterparties. In a stress event (Avant pauses redemptions, or the admin keeps the cooldown long) there may be **no external liquidator**, and positions would sit until bad debt.
- **When would liquidations occur?** Because the oracle is rate-based and savETH's rate only rises, health factors fall only when the WETH borrow rate (3.53%) exceeds savETH's yield (3.61% last week). Liquidations are therefore rare and slow. The real lender risk is an avETH impairment that the oracle cannot see (see [External Dependencies](#external-dependencies)).
- **Lender exit:** WETH suppliers can withdraw only the 151.67 WETH idle. Above that they depend on repayments or on the IRM pushing borrowers out.

## Centralization & Control Risks

### Governance

- **Upgradeability:** savETH, avETH, `AvantMintingV2`, the Silo and `RequestsManagerV2` are **not proxies**. avETHx and `PriceStorage` are ERC-1967 proxies, but their implementations ([`0x1411f6d18d4e0015ee2dc22d4f7b6893dedbdbe1`](https://etherscan.io/address/0x1411f6d18d4e0015ee2dc22d4f7b6893dedbdbe1), [`0x511c025ed8c04e363d398c21d165563adddbee99`](https://etherscan.io/address/0x511c025ed8c04e363d398c21d165563adddbee99)) expose no upgrade function and the admin slot is zero, so they are **effectively immutable**. Cyfrin's response notes also say the Max contracts were deployed immutably. This is a genuine strength.
- **Admin:** one address, [`0xd4d23209aaE8630bf386b7393763a5b7865e57cb`](https://etherscan.io/address/0xd4d23209aaE8630bf386b7393763a5b7865e57cb), holds every admin power across savETH, avETH, minting, the junior contracts and the savETH CCIP pool. It also owns the bridged savETH token on Arbitrum, and on Avalanche/Monad it is the same key that controls avUSD/savUSD ([Curvance report](curvance-hyausd.md)). It has **no code (nonce 215)**, so it is **not an onchain multisig and there is no timelock**. Avant states it is a Fordefi MPC wallet requiring an admin quorum (Cyfrin L-2 response). This is a team representation; the quorum and policy are not observable.
- **Powers exercisable immediately by that key:**
  - `avETH.setMinter`: unbacked avETH mint, unlimited.
  - savETH: grant blacklist roles, freeze any holder (including Morpho Blue), and `redistributeLockedAmount` to seize the frozen balance.
  - `setCooldownDuration` from 0 to 90 days. Each request's `cooldownEnd` is fixed when `cooldownShares`/`cooldownAssets` is called, so raising the duration does **not** extend requests already pending; they stay claimable at their stored deadline. It does impose up to 90 days on every **newly initiated** cooldown, and on any holder who adds to an existing one (adding resets that holder's whole pending amount to the new deadline). Setting it to 0 makes all pending requests claimable immediately and re-enables instant ERC-4626 `withdraw`/`redeem`. The admin has used short windows (60 s) to give some holders instant exits (observed 46 times).
  - `AvantMintingV2`: add custodians, change per-block limits and `stablesDeltaLimit`.
  - CCIP pool: set rate limits and remote pools.
  - Junior: `emergencyWithdraw`, fees up to 5%, treasury and price-bound changes.
- **Hot operational keys:** `MINTER/REDEEMER/SERVICE/PAUSER` EOA [`0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2`](https://etherscan.io/address/0xaf6fd55a83b0f85b4f330e2b25512c2b669786d2). A compromise can mis-set the junior price and block mints and redemptions, but it cannot mint unbacked avETH. The `REWARDER` EOA [`0xdb87e930065bc4c9cc4273672a64bf8e2761f1d8`](https://etherscan.io/address/0xdb87e930065bc4c9cc4273672a64bf8e2761f1d8) can only add assets.
- **Signers:** not public; offchain MPC.

### Programmability

- savETH's share price is onchain ERC-4626, but its input (daily rewards) is an offchain calculation pushed by a hot key.
- avETH backing is managed entirely offchain by Avant and "expert trading partners", across 10+ wallets and 10 protocols on 8+ chains.
- Mint and redeem are RFQ flows that need Avant's backend. Redemptions need manual funding of the minting contract.
- The junior price and its loss absorption are manual.
- The cooldown is changed operationally, often several times a week.

### External Dependencies

| Dependency | Role | Criticality |
|---|---|---|
| **Avant savUSD / avUSD** (Avalanche + bridged) | ≈$35M of the ETH book's assets (107% of NAV in savUSD alone) | **Critical** — an ~11.8% savUSD loss exhausts the junior buffer, surplus and Reserve Fund (Oct 13 figures) |
| **Fordefi MPC** | Custody of admin key, custodian and strategy wallets | **Critical** |
| Aave V3, Spark, Morpho, Euler | ETH/LST collateral and stablecoin borrowing | High (blue-chip) |
| Curvance (Monad), Dolomite, Royco, Bex, Hocket | Smaller stablecoin legs; hyAUSD $1.79M, cAUSD $1.27M | Medium |
| Lido wstETH, ether.fi weETH | $16.4M of LST collateral | Medium |
| Midas mGLOBAL | $0.78M | Low |
| Chainlink CCIP | savETH lock-release pool (1,702.10 savETH escrowed for Arbitrum) | Medium (see below) |
| Morpho oracle (for the Morpho market) | `MorphoChainlinkOracleV2` with **only** `BASE_VAULT` = savETH (sample 1e18). No feeds, `SCALE_FACTOR` 1e18, `price()` = 1.062164e36 | Design-level |

**Morpho oracle.** The oracle prices savETH as `savETH.convertToAssets(1e18)` and treats **1 avETH as exactly 1 WETH**. This matches Morpho's established exchange-rate pattern for ERC-4626 LST/vault collateral (e.g. wstETH/WETH-style markets) and cannot be manipulated profitably through donation: a donor pays the full donation while gaining only their pro-rata share. Its blind spot is the one that matters here, though. **An impairment of avETH's offchain backing is invisible to the oracle**, because savETH's rate never decreases. The oracle is immutable (no owner) and was deployed January 15, 2026 by [`0xf0cf1e3ec6264b03241826f5b2abda17b4352a75`](https://etherscan.io/address/0xf0cf1e3ec6264b03241826f5b2abda17b4352a75) through Morpho's oracle factory [`0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766`](https://etherscan.io/address/0x3A7bB36Ee3f3eE32A60e9f2b33c1e5f2E83ad766). There is also an admin path: unbacked avETH → `transferInRewards` (after granting `REWARDER_ROLE`) → savETH rate up ≤ the minted amount over 8 h → borrow more WETH. The vesting slows this; no cap prevents it.

**CCIP.** The Ethereum pool [`0x43f47a434dadd5a122c42e49378365cca949fa54`](https://etherscan.io/address/0x43f47a434dadd5a122c42e49378365cca949fa54) is `LockReleaseTokenPool 1.5.1` with lanes to Avalanche, Linea and Arbitrum. Each inbound bucket holds 2,518.51 savETH of capacity refilling at 0.02915 savETH/s (~2,518/day). Bridged supply reconciles:

- Arbitrum `FactoryBurnMintERC20 1.6.2` [`0x23E3df1196b3249c9b0A9476f990F105591872De`](https://arbiscan.io/address/0x23E3df1196b3249c9b0A9476f990F105591872De): 1,702.1034 savETH, of which 1,702.0082 is in a Dolomite isolation vault [`0xcd518b638cf13b1d34254450d6a04b99e1a61a5d`](https://arbiscan.io/address/0xcd518b638cf13b1d34254450d6a04b99e1a61a5d).
- Linea [`0xA0Fbf835fd24bD1aAFD39a0D4b1779B5B8329770`](https://lineascan.build/address/0xA0Fbf835fd24bD1aAFD39a0D4b1779B5B8329770): 0.0008 savETH.
- Avalanche [`0x260c0c715A279F239cF44e2F73E964AB550738f3`](https://snowtrace.io/address/0x260c0c715A279F239cF44e2F73E964AB550738f3): **0.000474 savETH**, measured from Ethereum because no Avalanche RPC is configured and Etherscan's free tier does not serve Avalanche. The pool's `Locked`/`Released` events record the calling ramp, and the CCIP 1.5 ramps are lane-specific. The Avalanche `EVM2EVMOnRamp 1.5.0` [`0xafd31c0c78785adf53e4c185670bfd5376249d8a`](https://etherscan.io/address/0xafd31c0c78785adf53e4c185670bfd5376249d8a) locked 0.113975 savETH and the Avalanche `EVM2EVMOffRamp 1.5.0` [`0xd98E80C79a15E4dbaF4C40B6cCDF690fe619BFBb`](https://etherscan.io/address/0xd98E80C79a15E4dbaF4C40B6cCDF690fe619BFBb) released 0.113501. The shared CCIP 1.6 `OnRamp` [`0x913814782144864e523c3fdb78e3ca25d2c2aeca`](https://etherscan.io/address/0x913814782144864e523c3fdb78e3ca25d2c2aeca) nets to 1,702.1034, which equals Arbitrum supply, so effectively no Avalanche flow went through 1.6.

A CCIP or pool-owner compromise could release up to the 1,702 savETH escrow in one lane's bucket. That harms remote holders, not Ethereum savETH's backing. The `mint` exposure is on the remote chains (Dolomite), not Ethereum.

## Operational Risk

- **Team:** founder Rhett Shipp is public (also Gravita). The Block reported a team of eight in late 2024. Other team members are not listed in the docs. The strategy partner named at launch was 0xPartners.
- **Legal:** "Avant Protocol Foundation and its affiliates"; jurisdiction not stated in the reviewed Terms. Binding individual arbitration. Reserves are beneficially owned by the Foundation. US persons are excluded.
- **Documentation:**
  - Good coverage of mechanics, strategy addresses and reserve wallets, plus a live transparency API.
  - Some claims are stale or inconsistent: docs say bridging is "exclusively" CCIP in one place and "CCIP and LayerZero" in another; the governance backstop is still "future"; PoR and Chainlink savToken feeds are "planned".
  - The docs do not disclose that the admin is a single address or that the ETH book is levered into savUSD.
- **Incident response:** Hypernative monitoring and a Trail of Bits OPSEC engagement are stated. No public incident history.

## Monitoring

| What | Contract / getter | Threshold / alert | Frequency |
|---|---|---|---|
| Unbacked mint path | avETH [`0x9469470C9878bf3d6d0604831d9A3A366156f7EE`](https://etherscan.io/address/0x9469470C9878bf3d6d0604831d9A3A366156f7EE): `MinterUpdated`, `OwnershipTransferStarted/Transferred`, `owner()` | **Any event → page immediately** | Event-driven |
| avETH supply vs mint flow | `totalSupply()` vs Σ`Mint` − Σ`Redeem` on `AvantMintingV2` [`0x09becF6E5e297825D19aA14eD6081A03524532D7`](https://etherscan.io/address/0x09becF6E5e297825D19aA14eD6081A03524532D7) | Any divergence | Hourly |
| Seizure / freeze | savETH [`0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341`](https://etherscan.io/address/0xDA06eE2dACF9245Aa80072a4407deBDea0D7e341): `RoleGranted` (any role), `LockedAmountRedistributed`, `AdminTransferRequested` | Any blacklist grant, especially on Morpho Blue / Gearbox / Midnight / CCIP pool → page | Event-driven |
| Exit gate | savETH `cooldownDuration()` / `CooldownDurationUpdated` | > 86,400 s → alert; ≥ 7 days → page. Log 60 s windows (selective exits) | Event-driven |
| savETH rate | `convertToAssets(1e18)`; `RewardsReceived` | Any decrease; any single reward > 5 avETH (largest so far 1.706) | Hourly |
| Minting config | `AvantMintingV2`: `CustodianAddressAdded/Removed`, `AssetAdded`, `MaxMintPerBlockChanged`, `stablesDeltaLimit()`, `RoleGranted` | Any change; `stablesDeltaLimit` > 0 | Event-driven |
| Redemption functioning | `Redeem` events; WETH balance of `AvantMintingV2` | No redemption for 7 days while requests are known pending; `disableMintRedeem` | Daily |
| Junior buffer | avETHx [`0x2E8b7190eE84E7AC757Ddff42Ba14d4EAe24B865`](https://etherscan.io/address/0x2E8b7190eE84E7AC757Ddff42Ba14d4EAe24B865) `totalSupply()` × PriceStorage [`0x985b5eF57dBE19B4EE1eD43b9AdEB1A61f2f6f23`](https://etherscan.io/address/0x985b5eF57dBE19B4EE1eD43b9AdEB1A61f2f6f23) `lastPrice()` ÷ (avETH supply − junior treasury avETH) | < 10% → alert; < 7% → page. Any `PriceSet` decrease → page (loss event) | Daily |
| Junior treasury | avETH balance of [`0xdD71CDd615f677E98C604bFF5679294cC7a6089b`](https://etherscan.io/address/0xdD71CDd615f677E98C604bFF5679294cC7a6089b) and [`0x29b091B0b70D24FEd3BEC3f511B92CC54307c0F6`](https://etherscan.io/address/0x29b091B0b70D24FEd3BEC3f511B92CC54307c0F6) vs junior claim | Shortfall > 1% | Daily |
| Reserve Fund | savETH balance of [`0x4a6f696a6F921921dC959D19E911a2034063CFdA`](https://etherscan.io/address/0x4a6f696a6F921921dC959D19E911a2034063CFdA) | Decrease > 20% | Daily |
| Offchain NAV | [`/api/metrics/aveth`](https://app.avantprotocol.com/api/metrics/aveth): `nav.netNav` (USD→ETH via Chainlink) vs avETH supply; savUSD share of assets | NAV/supply < 100% → alert; < 97% → page. `periodEnd` older than 14 days → alert | Weekly |
| savUSD health (cross-product) | savUSD rate and avUSD backing per [Curvance report](curvance-hyausd.md) monitoring | Any savUSD/avUSD rate decrease or avUSD depeg → page | Daily |
| Morpho market | `market(0xd98cd88ae5b336086b39fb1d62ba6171282e946105b010143f0e89f8fe7cff36)`; borrower health factors | Utilisation > 95%; any HF < 1.03; collateral > 2,500 savETH | Hourly |
| CCIP escrow | `savETH.balanceOf(0x43f47a434dadd5a122c42e49378365cca949fa54)` vs Arbitrum + Linea + Avalanche supply; pool `owner()`, rate-limit changes | Remote supply > escrow; any config change | Daily |
| Admin key activity | Nonce of `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` (215 at snapshot) | Burst of transactions outside the cooldown-toggle pattern | Daily |

## Appendix: Contract Architecture

```
 Full addresses for every box are in the tables above.

                    ┌──────────────────────────────────────────────────────────┐
 GOVERNANCE         │ Avant admin key (no code; Avant says Fordefi MPC)        │
                    │ owner/admin of avETH, savETH, AvantMintingV2, avETHx,    │
                    │ PriceStorage, RequestsManagerV2, savETH CCIP pool        │
                    │ NO multisig onchain · NO timelock                        │
                    └───────┬───────────────┬───────────────┬──────────────────┘
          setMinter (unbounded)    blacklist+redistribute   cooldown 0–90d (new requests)
                            │               │               │
 TOKEN LAYER   ┌────────────▼───┐   ┌───────▼───────────────▼──┐   ┌────────────────┐
               │ avETH (Ownable)│◄──│ savETH (ERC-4626, immut.)│──►│ AvantCoinSilo  │
               │ 12,211.18      │   │ 10,110.82 sh / 10,739 av │   │ cooldown escrow│
               └───▲────────┬───┘   └────┬─────────────────────┘   └────────────────┘
       mint (1:1 WETH,  │ burn      │ REWARDER EOA pushes daily avETH
       5,000/blk)       │           │
               ┌───────┴────────┐   │ holders: Gearbox 33% · CCIP pool 17% (→Arbitrum/Dolomite)
               │ AvantMintingV2 │   │          Morpho Blue 17% · Midnight 4%
               │ MINTER/REDEEMER│   │
               │ (service EOA)  │   ▼
               └───┬────────────┘   Morpho WETH/savETH 91.5% LLTV
       WETH routed │ directly       oracle = savETH.convertToAssets (avETH ≡ WETH)
                   ▼
 STRATEGY  Custodian EOA ──► strategy wallets (EOAs on 8+ chains)
                   │   ETH/LST collateral $30.4M on Aave · Spark · Morpho · Euler · Curvance
                   │   └─ borrow ~$40M stables ──► savUSD $32.7M · avUSD · hyAUSD · cAUSD
                   ▼
 JUNIOR    avETHx (immutable proxy) ◄─ RequestsManagerV2 ◄─ PriceStorage (SERVICE EOA, +5%/-33% per update)
           1,326.59 × 1.100357 = 1,459.7 avETH held by two junior treasury EOAs
 RESERVE   ETH Reserve Fund EOA = 38.01 savETH (circular)
```

---

## Risk Summary

### Key Strengths

- **Immutable contracts.** No assessed contract can be upgraded; the junior proxies have no upgrade path. Code is a lightly modified Ethena fork with eight published audits (Dedaub, Omniscia ×3, Cyfrin ×3, Riley) and no critical or high findings.
- **Atomic, 1:1 mint backing through the official path.** `stablesDeltaLimit = 0`, WETH is transferred in the same transaction, and avETH supply reconciles exactly to mint/redeem history (12,211.18).
- **A real, sizable junior buffer.** 1,459.7 avETH (13.6% of senior) is held as avETH and reconciles to the avETHx price × supply. No junior markdown has ever been recorded, and Avant self-reports a 100.48% NAV/supply ratio, and an independent multi-chain reconciliation located 91.75% of supply net (96.3% gross ETH collateral).
- **Onchain, monotonic savETH rate.** Staked avETH cannot be rescued out of the vault, and the rate rose 6.2% over ~14 months with no decrease.

### Key Risks

- **One no-code address holds every admin power with no timelock.** It can mint unlimited unbacked avETH, freeze and seize any savETH holder (including Morpho Blue's collateral), and impose up to 90-day cooldowns on new exit requests. MPC quorum is claimed but not verifiable.
- **The ETH book is levered into Avant's own USD product.** savUSD alone is 107% of NAV, and Avant/Curvance-linked dollar assets are 127%. A savUSD loss above ~11.8% exhausts the junior tranche, surplus and Reserve Fund (11.0% for the junior tranche alone, October 13 figures), so savETH's senior protection depends on avUSD's offchain backing.
- **No permissionless exit.** There is no DEX liquidity. The WETH exit is a 24 h cooldown plus an Avant-executed RFQ redemption (up to 7 days), unavailable to US persons. Morpho liquidators earn a 2.6% bonus for multi-day, counterparty-dependent inventory risk.
- **The loss waterfall is offchain.** savETH's rate cannot fall, so an impairment surfaces as avETH < 1 ETH, which the Morpho oracle ignores. Junior loss absorption requires discretionary admin actions.
- **Selective exits.** The admin repeatedly opens unannounced 60-second cooldown windows; 44% of all unstaking used them.

### Critical Risks

- **Backing is only ~92% located and leans on savUSD.** A multi-chain reconciliation located a net NAV of 11,203.6 ETH against 12,211.18 avETH; the ≈1,008 ETH remainder is unattested. savUSD, whose own backing is ~99% offchain, makes up 115% of the located NAV.
- **Unbacked mint + rate-blind oracle.** A compromise or misuse of `0xd4d23209aaE8630bf386b7393763a5b7865e57cb` can mint avETH, stake it, post savETH on Morpho/Gearbox and borrow out WETH. It could also seize lending-market collateral via `redistributeLockedAmount`. Nothing onchain delays or caps this.

---

## Risk Score Assessment

### Critical Risk Gates

- [ ] **Unverified contract source** — all assessed contracts and implementations are verified on Etherscan. **Pass.**
- [ ] **No audit** — eight reports from reputable firms. **Pass.**
- [ ] **Unverifiable reserves** — **Pass (borderline).** Reserves can be verified onchain. A full multi-chain reconciliation of the published wallets located **11,757.6 ETH of gross ETH collateral (96.3% of avETH)** and a **net NAV of 11,203.6 ETH (91.75%)**, with the ≈8% remainder matching dashboard legs on chains or venues not read here. There is no third-party attestation, and verification needs work across six chains. The unlocated remainder and the savUSD dependency are penalised in [Collateralization](#collateralization) rather than gated.
- [ ] **Total centralization** — every admin power sits on one no-code address with no timelock. Avant represents it, in writing to its auditor, as a Fordefi MPC wallet requiring an admin quorum. Consistent with this repository's treatment of the same key in [Curvance hyAUSD](curvance-hyausd.md), this is scored as unverified MPC rather than a single-key EOA. **Pass (borderline); penalised in Governance.**

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

- **Audits: 2.5.** Eight audits by reputable firms, all findings resolved or low-severity. Penalised for no public bug bounty, no Safe Harbor adoption, no audit naming the ETH deployments, and an unaudited change to avETH's minter model. The rest of the ETH code matches audited avUSD code plus recorded remediations.
- **Historical: 2.5.** savETH has been live ~14.5 months (score 2) at ~$28.8M (score 3). The broader protocol has run since late 2024 at ~$150M with no incidents.

**Score: 2.5/5** — `(2.5 + 2.5) / 2`.

#### Category 2: Centralization & Control Risks (Weight: 30%)

- **Governance: 4.5.** A single onchain admin, with no multisig or timelock, holds unbounded mint, seize and exit-lock powers. Held off 5.0 because every contract is immutable (no upgrade risk) and Avant documents MPC quorum custody with an ongoing Trail of Bits OPSEC engagement.
- **Programmability: 3.5.** The savETH share price is onchain, but its input is offchain-calculated rewards pushed by a hot key. Backing is managed offchain, mint and redemption are RFQ and manually funded, junior pricing and loss absorption are manual, and the cooldown is toggled operationally.
- **Dependencies: 4.0.** Many dependencies: Aave, Spark, Morpho, Euler, Curvance, Dolomite, LSTs, CCIP, and critically Avant's own savUSD (107% of NAV) and Fordefi custody. Failure of savUSD or custody impairs savETH directly.

**Score: 4.0/5** — `(4.5 + 3.5 + 4.0) / 3 = 4.0`.

#### Category 3: Funds Management (Weight: 30%)

- **Collateralization: 3.5.**
  - Positives: 96.3% of avETH located as gross ETH/LST collateral on blue-chip lenders; 91.75% located net (Avant self-reports 100.48%); a verified 13.6% junior buffer.
  - Negatives: ≈8% of net backing unlocated and unattested; custodial MPC wallets with no onchain allowlist; the yield leg is a levered position in Avant's own offchain-backed savUSD; the loss waterfall is not enforced onchain; the Reserve Fund is circular.
- **Provability: 3.5.**
  - The savETH/avETH ratio and the junior buffer are onchain and reproducible.
  - avETH backing can be reconciled onchain from published wallets (91.75% located net), but only across six chains and many protocols, against a self-reported weekly NAV. There is no attestation or PoR.

**Score: 3.5/5** — `(3.5 + 3.5) / 2`.

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 4.0/5.** There is no secondary-market liquidity at any size. The only route to WETH is a 24 h cooldown plus a permissioned, manually funded RFQ redemption documented at up to 7 days, unavailable to US persons, with the cooldown for new requests admin-extendable to 90 days. Capacity has been demonstrated (793 avETH in one redemption, 2,140 avETH in a month), and a same-asset (ETH-denominated) loan tolerates longer exits, so the score is held at 4.0 rather than 4.5.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 2.5/5.**

- **Team:** public founder with prior protocol history, but a small and otherwise undisclosed team.
- **Legal:** Foundation entity of unstated jurisdiction.
- **Documentation:** good docs and transparency API, but material omissions (single admin key, levered savUSD exposure) and some stale statements.

### Final Score Calculation


| Category | Score | Weight | Weighted |
|---|---|---|---|
| Audits & Historical | 2.5 | 20% | 0.500 |
| Centralization & Control | 4.0 | 30% | 1.200 |
| Funds Management | 3.5 | 30% | 1.050 |
| Liquidity Risk | 4.0 | 15% | 0.600 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Final Score** | | | **3.47/5.0** |

No optional modifiers apply: savETH is under 2 years old and below $500M TVL.

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** (top of the band).

As lending collateral, savETH should be sized against two facts. First, no liquidator can exit it without Avant. Second, the oracle cannot see an avETH impairment. Exposure in the WETH/savETH market should stay small relative to Avant's demonstrated redemption throughput and the ~1,460 avETH junior buffer, with the Monitoring alerts on `setMinter`, blacklist roles, the cooldown and the junior price wired to act on lender positions.

---

## Reassessment Triggers

- **Time-based:** reassess in 3 months (January 2027).
- **TVL-based:** reassess if avETH supply or the Morpho market's collateral changes by more than 50%, or if the junior buffer falls below 10% of senior.
- **Incident-based:**
  - Any `MinterUpdated`, admin or owner transfer, blacklist grant, `cooldownDuration` above 1 day, or `PriceSet` decrease.
  - Any savUSD/avUSD loss or depeg.
  - Redemptions not served within 7 days.
  - Movement of the admin key to an onchain multisig and timelock (likely score improvement).
  - Launch of Chainlink PoR or a savETH exchange-rate feed.
  - Located onchain NAV falling below 90% of avETH supply on re-reconciliation, which would trigger the unverifiable-reserves gate.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [October 28, 2026](https://github.com/yearn/risk-score/pull/567) | 3.47 | Initial assessment |
