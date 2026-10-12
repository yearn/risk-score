# Protocol Risk Assessment: D2 Finance HYPE++

- **Assessment Date:** August 10, 2026 (Updated: October 12, 2026)
- **Token:** HYPE++
- **Chain:** Arbitrum
- **Token Address:** [`0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`](https://arbiscan.io/address/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004)
- **Final Score: 4.10/5.0**
- **Snapshot:** Onchain state read at Arbitrum block `514216436` (October 12, 2026 20:10 UTC); event history read from block `489802915` (August 1, 2026). HyperCore account balances read from the public Hyperliquid info API on October 12, 2026.

## Overview + Links

D2 Finance offers actively managed ERC-4626 strategy vaults. The scoped asset is the HYPE++ vault on Arbitrum, a USDC-denominated strategy vault whose funds are moved from the vault into a D2 trader/OMS contract during trading epochs. D2 docs describe each strategy as a standalone vault + strategy contract + trader OMS; users deposit during a funding phase, funds are custodied by the trader during the trading phase, and funds are returned to the vault at the end of an epoch for withdrawal or rollover.

The HYPE++ vault is currently in epoch 23:

- Funding start: September 30, 2026 12:42 UTC.
- Trading start: October 2, 2026 08:00 UTC.
- Scheduled epoch end: **January 15, 2027 08:00 UTC** (~105 days of trading).
- Funds custodied on October 12, 2026 00:46 UTC ([transaction](https://arbiscan.io/tx/0x0271d60aef01a0ed5ac8cbf63cca0158df60099bc4ed17f1d49f148cbffa8750)); `custodied() = true`, so direct user withdrawals are disabled.
- `totalAssets() = 8,662,163.870361 USDC`; `totalSupply() = 5,641,236.892148 HYPE++` (~1.5355 USDC per share).
- The HYPE++ trader holds 1.00M USDC directly, 1.66M USDC supplied to Aave V3, and all outstanding dgnHYPE shares (6.00M USDC `totalAssets()`). These reconcile to HYPE++ `totalAssets()`. dgnHYPE is a nested D2 strategy whose custody Safe forwards capital to operational EOAs and into Hyperliquid/HyperCore; see Funds Management.

**Links:**

- [Protocol Documentation](https://gitbook.d2.finance/)
- [D2 HYPE++ Strategy Page](https://d2.finance/strategies/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004)
- [Architecture Docs](https://gitbook.d2.finance/protocol/architecture)
- [Strategies (Strategy Vaults) Docs](https://gitbook.d2.finance/protocol/strategies-strategy-vaults)
- [Security Docs](https://gitbook.d2.finance/security-and-contracts/security) (vault-owner and executor-role policy)
- [Disclaimer and Restrictions](https://gitbook.d2.finance/disclaimers/disclaimer-and-restrictions) (V0 sub-vault and Anchorage Digital Porto disclosure)
- [Smart Contract Audits](https://gitbook.d2.finance/security-and-contracts/smart-contract-audits)
- [Paladin D2 Audit Page](https://paladinsec.co/projects/d2/)
- [Cyfrin D2 v2.1 Audit PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-02-24-cyfrin-d2-v2.1.pdf)
- [Cyfrin D2 HYPE CoreWriter v2.0 Audit PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-10-16-cyfrin-d2-hype-corewriter-v2.0.pdf)
- [DeFi Llama: D2 Finance](https://defillama.com/protocol/d2-finance)
- [Arbitrum L2BEAT Risk Page](https://l2beat.com/scaling/projects/arbitrum)
- [Hyperliquid Bridge2 on Arbitrum](https://arbiscan.io/address/0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7)
- [Circle HyperCore CCTP Contract Addresses](https://developers.circle.com/cctp/references/hypercore-contract-addresses)
- [Circle CCTP Contract Addresses](https://developers.circle.com/cctp/references/contract-addresses)

D2's public docs no longer publish the strategy contract list or the D2 multisig list pages that earlier versions of the GitBook carried; contract roles in this report are verified onchain.

## Contract Addresses

| Contract | Address | Type |
|----------|---------|------|
| HYPE++ Vault | [`0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`](https://arbiscan.io/address/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004) | `VaultV1Whitelisted`, ERC-4626-style vault |
| HYPE++ Trader / OMS | [`0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3`](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3) | Verified selector router (non-upgradeable; delegatecalls modules) |
| D2 Module (D2 facet) | [`0xc8071aD5560904B3b721e7E5d29742F523a69111`](https://arbiscan.io/address/0xc8071aD5560904B3b721e7E5d29742F523a69111) | Delegatecall module; implements `d2_deposit`/`d2_withdraw` (`EXECUTOR_ROLE`-gated), hardcoded in Strategy Factory |
| Vault Owner | [`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46) | EOA onchain (team states institutional MPC/HSM custody); owns BOTH HYPE++ vault and dgnHYPE vault |
| Trader Admin / Executor / Fee Receiver | [`0x7ab129978091DEE65A319c5FC728818D73221999`](https://arbiscan.io/address/0x7ab129978091DEE65A319c5FC728818D73221999) | EOA onchain (team states institutional MPC/HSM custody); holds `DEFAULT_ADMIN_ROLE` and `EXECUTOR_ROLE` on trader |
| D2 Vault Multisig | [`0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0`](https://arbiscan.io/address/0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0) | Safe, 4-of-7; also trader admin/executor |
| dgnHYPE Vault | [`0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd`](https://arbiscan.io/address/0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd) | Nested D2 `VaultV0` held by HYPE++ trader |
| dgnHYPE Trader / Custody Safe | [`0x155d0B27B754ebC664aeD565945C1AaEa91966fb`](https://arbiscan.io/address/0x155d0B27B754ebC664aeD565945C1AaEa91966fb) | Nested D2 custody Safe, 3-of-5 |
| Hyperliquid Operational EOA 1 | [`0x0C684f333A7e120bce61383DA670bbB0157e82d0`](https://arbiscan.io/address/0x0C684f333A7e120bce61383DA670bbB0157e82d0) | EOA receiving USDC from the dgnHYPE Safe and forwarding it to HyperCore via Bridge2 or Circle CCTP |
| Hyperliquid Operational EOA 2 | [`0x11A691612BD108e57cC04ea42B006C9CB1ff006A`](https://arbiscan.io/address/0x11A691612BD108e57cC04ea42B006C9CB1ff006A) | EOA that received USDC from the dgnHYPE Safe in August 2026; routes through Bridge2 and Circle HyperCore CCTP |
| Hyperliquid Operational EOA 3 | [`0x4c3d48cbe2186beeafecc6723630ab8eda4117fc`](https://arbiscan.io/address/0x4c3d48cbe2186beeafecc6723630ab8eda4117fc) | EOA that returned ~2.55M USDC from HyperCore to the dgnHYPE Safe on September 19, 2026 |
| Aave V3 aArbUSDCn | [`0x724dc807b04555b71ed48a6896b6f41593b8c637`](https://arbiscan.io/address/0x724dc807b04555b71ed48a6896b6f41593b8c637) | Aave V3 Arbitrum aToken for native USDC (pool [`0x794a61358D6845594F94dc1DB02A252b5b4814aD`](https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD)); held by HYPE++ trader |
| Hyperliquid Bridge2 | [`0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7`](https://arbiscan.io/address/0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7) | Verified Hyperliquid Arbitrum bridge contract; not an EOA |
| Circle HyperCore CCTP Extension | [`0xA95d9c1F655341597C94393fDdc30cf3c08E4fcE`](https://arbiscan.io/address/0xA95d9c1F655341597C94393fDdc30cf3c08E4fcE) | Circle-documented Arbitrum contract for USDC transfers to HyperCore |
| Circle CCTP V2 MessageTransmitter | [`0x81D40F21F12A8F0E3252Bccb954D722d4c464B64`](https://arbiscan.io/address/0x81D40F21F12A8F0E3252Bccb954D722d4c464B64) | Circle-documented CCTP V2 contract; mints USDC on Arbitrum for HyperCore withdrawals |
| USDC | [`0xaf88d065e77c8cC2239327C5EDb3A432268e5831`](https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831) | Underlying asset |
| Vault Factory | [`0xb5B272EF918835651375f84D463b1Ba7B61eF028`](https://arbiscan.io/address/0xb5B272EF918835651375f84D463b1Ba7B61eF028) | Deployed HYPE++ vault |
| Strategy Factory | [`0x2AA01FdE174aB160b4e4F49F152C20d6Ec029d67`](https://arbiscan.io/address/0x2AA01FdE174aB160b4e4F49F152C20d6Ec029d67) | Deployed HYPE++ trader |

Deployment metadata:

- HYPE++ vault and trader were deployed in transaction [`0xf5642a6a...6265e`](https://arbiscan.io/tx/0xf5642a6afa068616ac286c0c26ef32f46bc43333edf79fe071ff3f60b346265e) at Arbitrum block `276124793` on November 19, 2024.
- The vault is NOT behind a proxy (EIP-1967 implementation slot is zero; re-checked October 12, 2026); it is a standalone `VaultV1Whitelisted` contract. Ownership is transferable via the standard Ownable `transferOwnership()`.
- The trader is NOT a standard proxy (EIP-1967 implementation slot is zero); it is a standalone selector router that delegatecalls to pre-configured modules.
- The contract at [`0xc8071aD5560904B3b721e7E5d29742F523a69111`](https://arbiscan.io/address/0xc8071aD5560904B3b721e7E5d29742F523a69111) is the **D2 module** (verified source `D2_Module`): it was deployed earlier (block `218684412`, tx [`0xe432dabc...8675`](https://arbiscan.io/tx/0xe432dabfc9572c103e858399f29530b458fdbb882b4ab0e94245eeae553a8675)) by a different EOA ([`0x00Aa367B7692be05E47B9c461fF35410208158b0`](https://arbiscan.io/address/0x00Aa367B7692be05E47B9c461fF35410208158b0)), and the Strategy Factory hardcodes it as the D2 facet. The HYPE++ trader wires it as `targets[28]` — the delegatecall target for the `d2_deposit(address,uint256)` and `d2_withdraw(address,uint256)` selectors (both `EXECUTOR_ROLE`-gated). It is not a proxy implementation, but it is an active delegatecall module in the trading path.

## Audits and Due Diligence Disclosures

D2 publicly lists three audit links: Paladin, Cyfrin D2 v2.1, and Cyfrin Hyperliquid CoreWriter. The most directly relevant audit lineage is:

| Date | Firm | Scope | Link |
|------|------|-------|------|
| Mar 23, 2023 | Paladin | D2 staking contracts | [Paladin D2](https://paladinsec.co/projects/d2/) |
| Sep 27, 2023 | Paladin | D2 strategy stack including `VaultV1`, `TraderV0`, StrategyETH, AccessControl, and DeFi modules | [Paladin D2](https://paladinsec.co/projects/d2/) |
| Feb 24, 2025 | Cyfrin | D2 v2.1 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-02-24-cyfrin-d2-v2.1.pdf) |
| Oct 16, 2025 | Cyfrin | D2 HYPE CoreWriter v2.0 | [PDF](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-10-16-cyfrin-d2-hype-corewriter-v2.0.pdf) |

Paladin's public page lists the September 2023 strategy audit as completed with 85 total issues: 18 governance, 3 high, 8 medium, 23 low, and 33 informational. Paladin's page also cautions users to confirm they are interacting with audited contracts. HYPE++ was deployed later, in November 2024, but the verified source identifies the vault as `VaultV1Whitelisted` and the trader as D2's `Strategy` router/OMS architecture.

The audits cover smart-contract code. They do not cover the majority of HYPE++ capital at the snapshot: 69.27% sits in dgnHYPE, whose trader is a standard Safe that forwards funds to EOAs and HyperCore accounts, where no D2 contract logic constrains it.

### Bug Bounty

No active Immunefi, Sherlock, Cantina, HackerOne, Code4rena, or Safe Harbor program was found in the D2 docs (re-checked October 12, 2026). Targeted manual searches on Immunefi ("D2 Finance") and the [Safe Harbor registry](https://safeharbor.securityalliance.org/) (SEAL) returned no listed program. D2 publishes audit links and security process statements, but no public bounty with payout terms was found.

## Historical Track Record

HYPE++ was deployed on November 19, 2024, giving the scoped vault roughly 23 months of onchain history at the October 12, 2026 snapshot. Scoped TVL is $8.66M based on `totalAssets()` in USDC terms. [DeFi Llama](https://defillama.com/protocol/d2-finance) reports $28.69M for D2 Finance protocol-wide on October 12, 2026 (30-day peak $35.01M on September 19, 2026).

Dated epoch outcomes and TVL changes:

| Epoch | Funds custodied | Funds returned | Result |
|-------|-----------------|----------------|--------|
| 21 (Jul 9 – Sep 18, 2026 scheduled) | 11,691,129.81 USDC | 11,914,081.42 USDC on September 19, 2026 03:33 UTC ([tx](https://arbiscan.io/tx/0x5200a70ddaa585f5283b10af2baa909b9271e9f370b282c9d40553f71b90184f)) | +1.91% to depositors; 55,737.90 USDC performance fee ([tx](https://arbiscan.io/tx/0xeaebe0cba5db42049768897b4cab6d2eef401b548270d3f0b0c0d00f5f996d82)). Returned ~19.5h after the scheduled end. |
| 22 (Sep 22 – Sep 30, 2026 scheduled) | 8,164,463.85 USDC on September 25 ([tx](https://arbiscan.io/tx/0xc3fbe137a8a8bd9733e56f014d36695f41247defa20c97d7e7f5bff6788af1ec)) | 8,297,153.45 USDC on September 30, 2026 12:36 UTC ([tx](https://arbiscan.io/tx/0xad328538ebc7770de1de49fe68d6297c4f2876d2e4aae03a13d7a82ebbfe37c5)) | +1.63% to depositors; 33,172.40 USDC fee ([tx](https://arbiscan.io/tx/0x13a397b78121bde6f443c6c2e5595d98f00f6dac9bc26685c4a01b29801fca2f)). The gain was a transfer from the trader-role EOA, not trading by the HYPE++ trader; see Funds Management. |
| 23 (Oct 2, 2026 – Jan 15, 2027 scheduled) | 8,662,163.87 USDC on October 12 ([tx](https://arbiscan.io/tx/0x0271d60aef01a0ed5ac8cbf63cca0158df60099bc4ed17f1d49f148cbffa8750)) | Pending | — |

- HYPE++ `totalAssets()` was 11.69M USDC on August 10, 2026 and 8.66M USDC on October 12, 2026 (-25.9%). The decline came from net withdrawals during the September 19 – October 2, 2026 funding windows: ~7.45M USDC withdrawn versus ~4.06M USDC deposited. The share price rose from ~1.4827 to ~1.5355 USDC over the same period.
- The owner raised `maxDeposits` from 12M to 15M USDC on September 19, 2026 ([tx](https://arbiscan.io/tx/0xe69c6561a73a713e0dd2c4dabcffb1ee897e5e978c7da8fbb89c0970638076ae)) and lowered it to 10M USDC on September 22, 2026 ([tx](https://arbiscan.io/tx/0x6880756d0aa497f0514fe7043152aadbf66094a25110a491563fefd3dee5ae04)).
- The owner added 34 addresses to the whitelist (`NewWhitelistStatus(..., true)`) on September 20 ([tx](https://arbiscan.io/tx/0x834323ce6b5a0570b0b82f18de7695ca0674d513ed313433b56eb742c547795d)) and September 30, 2026 ([tx](https://arbiscan.io/tx/0x8e216eb530e285dc1ebb3e69b7d618199151eb1658b0f8a577794b409267f0d6)). No whitelist removals were emitted since August 1, 2026.

D2 documentation describes a broader multi-year strategy record and states that the team combines DeFi-native and traditional finance derivatives experience. This is useful context, but the report scores the onchain HYPE++ vault rather than offchain performance history.

No public exploit specific to the HYPE++ vault was identified. The main historical concern is not a known loss event; it is the intentionally active-managed design, where funds are transferred out of the vault into a trader contract and onward into nested D2 custody, operational EOAs, and HyperCore trading accounts.

## Funds Management

HYPE++ is an ERC-4626-compatible USDC vault. Users deposit USDC during funding windows and receive HYPE++ shares. During the trading phase, the trader contract calls `custodyFunds()` on the vault and receives the vault's USDC. While `custodied = true`, `totalAssets()` returns the last `custodiedAmount` rather than current vault-held USDC. At epoch end the trader calls `returnFunds()`; the amount returned becomes the new vault NAV.

Current reserve reconciliation (block `514216436`, October 12, 2026):

| Component | Value | Share of HYPE++ `totalAssets()` |
|-----------|-------|------|
| HYPE++ `totalAssets()` / `custodiedAmount()` | 8,662,163.870361 USDC | 100% |
| HYPE++ `totalSupply()` | 5,641,236.892148 shares | — |
| HYPE++ vault USDC balance | 0 USDC | — |
| HYPE++ trader direct USDC balance | 1,000,999.329714 USDC | 11.56% |
| HYPE++ trader Aave V3 aArbUSDCn balance | 1,661,212.950725 USDC | 19.18% |
| HYPE++ trader dgnHYPE balance | 4,410,567.717197 shares (= 100% of dgnHYPE `totalSupply()`) | — |
| dgnHYPE `totalAssets()` / `custodiedAmount()` | 6,000,065.047643 USDC | 69.27% |
| dgnHYPE custody Safe direct USDC balance | 3,410,065.048382 USDC | — |
| dgnHYPE custody type | 3-of-5 Safe | — |

The top-level HYPE++ arithmetic reconciles: direct USDC + Aave aUSDC + dgnHYPE reported assets = 8,662,277.33 USDC versus 8,662,163.87 USDC `totalAssets()` (+113 USDC of Aave interest). The trader's Aave position came from five `aave_supply` calls on October 12, 2026 (e.g., [900,000 USDC](https://arbiscan.io/tx/0x26e59c7ac9a9d4c894b92d978ba8d60deb082472c53f71035bdb21fe96dbe878)), and its 6,000,000 USDC dgnHYPE deposit was made the same day ([tx](https://arbiscan.io/tx/0x4e8c5cf510a12ae66f32a25e1f9b79eddb3af63d428b7889d9c2953cb8e56bbf)).

dgnHYPE is a nested active D2 strategy with custodied funds. Its `trader()` is a 3-of-5 Safe, and dgnHYPE uses the same custodied accounting pattern: while custodied, `totalAssets()` returns the stored `custodiedAmount` rather than live balances. dgnHYPE epoch 23 has funding start October 11, 2026 01:10 UTC, trading start October 12, 2026 01:10 UTC, and a scheduled end of October 13, 2026 01:10 UTC; the Safe took custody of 6,000,065.05 USDC on October 12, 2026 01:24 UTC ([tx](https://arbiscan.io/tx/0xb9b44c743bce158d983b3b30ddcf0cc956ccfdbb44ca20014d02014b0d06ca66)). dgnHYPE withdrawals stay blocked until the Safe calls `returnFunds()`. That call does not depend on the scheduled end, so the HYPE++ exposure is governed by the HYPE++ epoch (ending January 15, 2027) and by when the Safe returns funds.

### Hyperliquid custody path

Arbitrum transfers show the route for dgnHYPE capital:

- **Outbound, July–August 2026:** On July 27, 2026, the dgnHYPE vault transferred 7,500,500.905511 USDC to its custody Safe ([transaction](https://arbiscan.io/tx/0x97cb497f929e953743bed88489168d1d185e7f4070ca8d88781b06b514f21a0b)). The Safe transferred 5.0M USDC to operational EOA 1 ([`0x0C684f333A7e120bce61383DA670bbB0157e82d0`](https://arbiscan.io/address/0x0C684f333A7e120bce61383DA670bbB0157e82d0)), which deposited it into Hyperliquid `Bridge2` (e.g., [900,000 USDC Safe transfer](https://arbiscan.io/tx/0x6d3e7171405c82605f894baa6587af9ce5a542313438f0fc3b5dab886ac4107c), [900,000 USDC bridge deposit](https://arbiscan.io/tx/0x1c8ac299aba7018fcea3a5ba7dd090d12df0c6b50647af19d4ec4db271437e6d)). On August 1, 2026 the Safe sent 400,000 USDC to operational EOA 2 ([`0x11A691612BD108e57cC04ea42B006C9CB1ff006A`](https://arbiscan.io/address/0x11A691612BD108e57cC04ea42B006C9CB1ff006A)), which used both `Bridge2` ([example](https://arbiscan.io/tx/0xbf2a7e1a935c7888411137e3a485d61112460628d7c8257d7f0d641b22b1e217)) and Circle's HyperCore CCTP extension ([example](https://arbiscan.io/tx/0xa16131d106d5b550a2db239b77dd1b5743dab406b6498ddcad4258c9efa8316d)).
- **Other Safe counterparties, August 2026:** On August 20, 2026 the Safe sent 170,000 USDC to another unidentified EOA, [`0x9a62fee8aa39ef2623ba54293282726da31e3259`](https://arbiscan.io/address/0x9a62fee8aa39ef2623ba54293282726da31e3259) (e.g., [85,000 USDC](https://arbiscan.io/tx/0xff864e4a4cdbe33c30b15738a19a5037ea01f0a7292242928787d2f5b1449c25)). That EOA also receives USDC from operational EOA 2 and forwards it to [`0x2ca22119cea729ac4ee86efe2188f9aa98045d49`](https://arbiscan.io/address/0x2ca22119cea729ac4ee86efe2188f9aa98045d49) (e.g., [200,000 USDC](https://arbiscan.io/tx/0xb0dc0cdd21a46f919c79826aa69e87afe0bbcd5f3ccb0bee3fb37322a64d0b62)). On August 27, 2026 the trader-role EOA sent 200,000 USDC to the Safe in several transfers (e.g., [60,000 USDC](https://arbiscan.io/tx/0xa409cb88c47735e309a91a42bab758dd45fb29f17d65a2f474bf3c2761f2d7c5)). The Safe, the trader-role EOA, and these EOAs exchange funds outside the vault accounting path.
- **Return, September 19, 2026:** Withdrawals from Hyperliquid arrived on Arbitrum as USDC minted through Circle's CCTP V2 [`MessageTransmitterV2`](https://arbiscan.io/address/0x81D40F21F12A8F0E3252Bccb954D722d4c464B64); the decoded messages carry source domain 19 (HyperEVM) and destination domain 3 (Arbitrum) per [Circle's domain list](https://developers.circle.com/cctp/concepts/supported-chains-and-domains). Operational EOA 1 received ~3.10M USDC (e.g., [mint](https://arbiscan.io/tx/0x6822ac0f6975d9417019f729a6d1886baf1489c21f0ab98513497a88930a14fa)), and a third EOA, [`0x4c3d48cbe2186beeafecc6723630ab8eda4117fc`](https://arbiscan.io/address/0x4c3d48cbe2186beeafecc6723630ab8eda4117fc), received ~2.55M USDC (e.g., [mint](https://arbiscan.io/tx/0xc88c28824549de10987584c10b9f36556420386edc512763dc010808834a184c)). Both forwarded the USDC to the Safe within minutes, and the Safe returned 7,778,689.51 USDC to dgnHYPE ([tx](https://arbiscan.io/tx/0x2ac5eaff43afc1fde0bf55f25c71cb66c3df02dec50822cbe43286e82f6b089b)), +3.71% on the custodied amount.
- **Outbound, October 12, 2026:** After taking custody of 6.00M USDC, the Safe sent 2.60M USDC to operational EOA 1 (e.g., [800,000 USDC](https://arbiscan.io/tx/0x26dfe4ab8cf9f2cc394434c9a60ce4b4b9be56aace607517e90725210f18b673)). The EOA forwarded 2,599,000 USDC to the Circle HyperCore CCTP extension (e.g., [800,000 USDC](https://arbiscan.io/tx/0xca02ab52111946f5a1eea5e9cbfe6ff72241820c2def98b1314bc58e64ce6bae)). The remaining 3.41M USDC was still in the Safe at the snapshot.
- **Off-vault settlement into HYPE++ (September 30, 2026):** During HYPE++ epoch 22, the trader made no calls between `custodyFunds()` and `returnFunds()` ([trader transaction list](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3)). The epoch's entire gain came from transfers into the trader of 165,862 USDC by the trader-role EOA [`0x7ab129978091DEE65A319c5FC728818D73221999`](https://arbiscan.io/address/0x7ab129978091DEE65A319c5FC728818D73221999) (e.g., [40,000 USDC](https://arbiscan.io/tx/0x467dde6b0faac1c2586fa75d1b6d406151cfe25363dd88c1fd06363aaeabd430)). That gain was 132,689.60 USDC to depositors plus 33,172.40 USDC fee, and it arrived after dgnHYPE had already settled and while HYPE++ held no dgnHYPE. Earlier that day the dgnHYPE Safe had received 269,990 USDC from an unidentified EOA, [`0x2ca22119cea729ac4ee86efe2188f9aa98045d49`](https://arbiscan.io/address/0x2ca22119cea729ac4ee86efe2188f9aa98045d49) ([tx](https://arbiscan.io/tx/0x694ccb564293f33fbaadfb19b17bcd1ac3af3f2a558933cef25e7928c581f4eb)), and sent 260,000 USDC to the trader-role EOA (e.g., [160,000 USDC](https://arbiscan.io/tx/0x9d658635e694e5cfbb00ad615ca5f5002845428b863a8c93eba09430a1994aa1)). HYPE++ PnL can therefore be credited by discretionary EOA transfers from outside the vault/trader accounting path.
- **HyperCore state (Hyperliquid info API, October 12, 2026):** Operational EOA 1 holds short BTC and HYPE perpetuals (20x and 10x leverage settings; ~$1.33M notional) plus spot USDC (~1.89M), HYPE, and UBTC. Operational EOA 3 holds a long HYPE perpetual (~$1.81M notional, 10x), short BTC and long ETH perpetuals, plus spot USDC (~1.21M) and ~75,971 HYPE. The Safe has no HyperCore balance. These accounts may serve more than one D2 strategy, and nothing onchain attributes their holdings to dgnHYPE or HYPE++. TODO: D2 attribution of HyperCore accounts and balances to dgnHYPE.
- All operational addresses are EOAs (no bytecode). The Hyperliquid `Bridge2` and Circle CCTP destinations are verified contracts. The material trust issue is the **Safe -> EOA -> HyperCore** path: once the Safe releases funds, its 3-of-5 approval no longer governs them; control follows the EOA and HyperCore account keys.
- D2's [disclaimer page](https://gitbook.d2.finance/disclaimers/disclaimer-and-restrictions) states that the V0 sub-vault architecture is managed through an Anchorage Digital Porto wallet operated by a licensed Approved Investment Manager, and that V0 trader permissions are enforced by the Porto wallet's policy engine rather than by smart contract. This is a team representation; it is not observable onchain.
- The dgnHYPE Safe and the trader-role EOA are frequent targets of address poisoning. Lookalike addresses send zero-value and fake-"USDC" transfers that mimic operational EOA 1, EOA 2, and the trader-role EOA (e.g., a [fake-token transfer](https://arbiscan.io/tx/0x793d387be65cd6b837ad93ffd2d4d39b27e42c85002310a2853cefb092bd9453) from lookalike [`0x0c68973c41ba3b60f463433d54036182f22582d0`](https://arbiscan.io/address/0x0c68973c41ba3b60f463433d54036182f22582d0)). No real USDC transfer to a lookalike address was found in the reviewed history. The Safe's unrestricted transfers to EOAs are therefore also exposed to signer address-verification errors.

**Control concentration:** The dgnHYPE vault's `owner()` is the same EOA ([`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46)) that owns the HYPE++ vault, so a single onchain EOA controls both vaults (D2 states this is an institutional MPC/HSM custody wallet; not verifiable onchain). dgnHYPE is a different contract: its verified source is `VaultV0` (codehash differs from the HYPE++ `VaultV1Whitelisted` vault), and `whitelistBalance()`/`whitelistAsset()` do not exist on it (they revert). Its `withdraw`/`redeem` are still gated by `onlyWhitelisted`, but VaultV0's modifier is a pure `require(whitelisted[msg.sender])` with no holder-balance branch. So the **blacklist path applies to dgnHYPE**: the owner can remove its sole holder, the HYPE++ trader. The `setWhitelistBalance(uint256.max)` balance-gate path does **not** exist there. Because the HYPE++ trader holds 100% of dgnHYPE supply, blocking dgnHYPE redemptions would trap ~69.27% of HYPE++ assets (~$6.00M) inside the nested strategy.

### Accessibility

- Deposit and mint are available only during the funding phase, only while not custodied, and only for whitelisted users or users holding more than `whitelistBalance` of `whitelistAsset`.
- Current `whitelistAsset` is USDC and `whitelistBalance` is `1,000,000` base units (1 USDC), meaning users with more than 1 USDC can satisfy the holder branch of `onlyWhitelisted()`.
- **Withdraw and redeem are also gated by `onlyWhitelisted()`** — verified against the verified source. All four functions (`deposit`, `mint`, `withdraw`, `redeem`) share the same modifier, which is `require(whitelisted[msg.sender] || IERC20(whitelistAsset).balanceOf(msg.sender) > whitelistBalance)`. Because of the holder branch, `setWhitelistStatus(user, false)` alone does **not** block a user who still holds more than `whitelistBalance` (currently >1 USDC) of `whitelistAsset` — they continue to satisfy the modifier and can withdraw. The reliable block is `setWhitelistBalance(type(uint256).max)`, which disables the holder branch for everyone. See § Critical Risks.
- Withdrawals are also blocked while custodied or during an active epoch.
- Current `maxDeposits` is 10,000,000 USDC, and current `totalDeposits` is 8,662,163.870361 USDC. dgnHYPE `maxDeposits` is 8,000,000 USDC.
- HYPE++ `MAX_EPOCH_DURATION()` is 315,360,000 seconds (10 years), so the contract does not meaningfully bound the epoch length the owner can schedule.

### Token Mint Authority

**Mint mechanism:** ERC-4626 deposit/mint. HYPE++ shares are minted by `deposit()` or `mint()` only when USDC is transferred into the vault. There is no privileged `MINTER_ROLE` on the HYPE++ vault.

**Mint requires backing:** Yes at the HYPE++ vault level. `deposit()` and `mint()` route through OpenZeppelin ERC-4626 mechanics and require underlying asset transfer in the same transaction. This does not remove trading-loss risk after funds are custodied, and the share price after each epoch equals whatever the trader returns.

**Per-address mint authority** (verified onchain on October 12, 2026, from token contract `0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`):

| Address | Can Mint | Can Burn | Role / Mechanism | Notes |
|---------|:--------:|:--------:|------------------|-------|
| Any user satisfying `onlyWhitelisted()` during funding | Yes | Yes, via redeem/withdraw after epoch | ERC-4626 deposit/redeem | Requires USDC transfer for mint; redeem is blocked while custodied or during epoch |
| [`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46) | No direct unbacked mint | No | Vault owner | EOA can set whitelist parameters, deposit caps, and epoch schedule |
| [`0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3`](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3) | No direct unbacked mint | No | Trader | Can custody and return funds; the returned amount sets NAV, and trading losses are borne by vault users |

**Rate limits / supply caps:** Current `maxDeposits` is 10,000,000 USDC.

**Backing check at mint time:** Atomic at the HYPE++ vault level. Collateral must transfer into the vault on mint/deposit.

### Collateralization

HYPE++ is not overcollateralized. It is a share token over an actively managed USDC strategy. The top-level HYPE++ accounting reconciles to direct USDC, Aave aUSDC, and dgnHYPE shares, but the system is not equivalent to a passive collateral vault:

- While custodied, the vault's `totalAssets()` is the stored `custodiedAmount`, not a live mark-to-market of all current trader positions.
- The verified source comments on `returnFunds()` state that losses may be sustained during trading and investors suffer the loss.
- HYPE++ depends on dgnHYPE for 69.27% of reported assets, creating recursive D2 strategy exposure. The remaining 30.73% is USDC held directly or in Aave V3 by the contract-constrained HYPE++ trader.
- The trader's allowed token list contains 32 tokens (including volatile assets: WETH [`0x82aF49447D8a07e3bd95BD0d56f35241523fBab1`](https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1), WBTC [`0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f`](https://arbiscan.io/address/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f), ARB, GMX, GRAIL, PENDLE, LINK, wstETH, and old bridged USDC.e [`0xFF970A61A04b1cA14834A43f5dE4533eDBBD5CC8`](https://arbiscan.io/address/0xFF970A61A04b1cA14834A43f5dE4533eDBBD5CC8)) and the allowed spender list contains 30 addresses, including major Arbitrum DeFi venues and D2 strategy vaults. Both counts are unchanged at the snapshot.
- dgnHYPE's `trader()` is a 3-of-5 Safe holding 3.41M USDC directly against 6.00M reported `totalAssets()`; 2.60M USDC was forwarded on October 12, 2026 to operational EOA 1 and on to HyperCore. **The Safe is a standard Safe with no onchain guardrails**: 3-of-5 signers can call `execTransaction` to send assets to any address. Unlike the HYPE++ trader OMS, which is constrained to 32 pre-approved tokens and 30 venues, the dgnHYPE Safe has unrestricted custody over 69.27% of HYPE++ assets.
- HyperCore holdings in the operational accounts include leveraged perpetual positions on HYPE, BTC, and ETH. Nothing onchain attributes them to dgnHYPE.

### Provability

Top-level HYPE++ accounting is partially provable:

- `totalAssets()`, `custodiedAmount()`, direct USDC balances, Aave aToken balances, dgnHYPE balances, and dgnHYPE `totalAssets()` are onchain.
- HYPE++ does not need an offchain price oracle for the top-level USDC + aUSDC + dgnHYPE share accounting.
- End-to-end position risk is not transparent from a single call because nested dgnHYPE is custodied by a Safe and reports stored custodied accounting while active.
- Arbitrum transfers expose the path from dgnHYPE to its Safe, through operational EOAs, and into HyperCore via Bridge2 or Circle CCTP, plus the CCTP return path. HyperCore account balances are visible through Hyperliquid's API, but those accounts are not attributed to a specific vault, so no complete cross-venue NAV can be built.
- Epoch NAV is whatever amount the trader returns. In HYPE++ epoch 22 the gain was credited by transfers from the trader-role EOA (sourced via the dgnHYPE Safe from an unidentified EOA) rather than generated by recorded trader activity. Depositors therefore rely on D2's offchain books for PnL attribution.
- D2 docs state positions are generally onchain-verifiable but disclose exceptions for Flowdesk OTC trades and partial verifiability of Flowdesk collateral. No Flowdesk exposure was proven for HYPE++, but the disclosure is relevant to D2's strategy model.

## Liquidity Risk

Exit liquidity is restricted by epoch state rather than by a normal liquid secondary market. HYPE++ withdrawals/redeems are unavailable because `custodied() = true` and epoch 23 is scheduled to end on **January 15, 2027**, about 95 days after funds were custodied and 105 days after trading started. Users can only redeem after the trader returns funds and the vault is out of epoch. The next exit window is therefore more than three months away and depends on the trader returning funds.

Epoch lengths vary: epoch 21 ran ~72 days of trading, epoch 22 ~8 days, and epoch 23 is scheduled for ~105 days. The owner EOA sets each schedule, and the 10-year `MAX_EPOCH_DURATION` gives no practical contract bound. Historical funding windows did process large exits: ~7.45M USDC was withdrawn between September 19 and October 2, 2026.

No meaningful onchain DEX liquidity for HYPE++ was identified. The primary exit path is vault redemption after epoch completion, subject to returned assets and any trading PnL.

## Centralization & Control Risks

### Governance

The largest risk is centralization:

**Custody-wallet representation (team):** D2 states that the two operational addresses — the vault owner [`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46) and the trader admin/executor/fee-receiver [`0x7ab129978091DEE65A319c5FC728818D73221999`](https://arbiscan.io/address/0x7ab129978091DEE65A319c5FC728818D73221999) — are institutional MPC/HSM custody wallets, not single-key EOAs. The described controls are biometric authentication, quorum signing, distributed shards/HSM, and policy engines that gate operational and administrative calls with defined thresholds and allowed initiators. None of this is observable onchain (both addresses hold no bytecode); D2 discloses it to institutional/fund LPs under NDA, so it is recorded here as a team representation rather than an independently verifiable fact. It does not change the onchain control surface: those addresses hold unilateral owner/admin/executor/fee-receiver powers with no onchain timelock.

- HYPE++ vault owner is an EOA. D2's [Security docs](https://gitbook.d2.finance/security-and-contracts/security) state that "the vault owner default is a 4/7 multi-sig"; HYPE++ does not follow that default.
- The owner EOA can call `startEpoch()`, `setMaxDeposits()`, `setWhitelistAsset()`, `setWhitelistBalance()`, `transferOwnership()`, `setWhitelistStatus()`, `setWhitelistStatuses()`, and `renounceOwnership()`.
- **Critical:** The owner can block all withdrawals via two one-transaction paths:
  1. `setWhitelistStatus(user, false)` / `setWhitelistStatuses([...], [false,...])` — removes specific users from the whitelist mapping for `withdraw`/`redeem` (not just `deposit`/`mint`). On HYPE++ this only bites users who do not independently satisfy the holder branch, so to block a target it must be paired with a raised `whitelistBalance`; on dgnHYPE (`VaultV0`, no holder branch) it is fully effective on its own.
  2. `setWhitelistBalance(type(uint256).max)` — no user can hold more than `uint256.max` tokens, so the holder branch can never pass and every non-whitelisted `withdraw()`/`redeem()` reverts. One transaction, zero enumeration, blocks every shareholder indiscriminately. (This selector exists on the HYPE++ `VaultV1Whitelisted` vault, not on the dgnHYPE `VaultV0`.)
  The `onlyWhitelisted()` modifier gates all four functions (`deposit`, `mint`, `withdraw`, `redeem`) on both vaults — verified against verified source. On HYPE++ (`VaultV1Whitelisted`) the modifier includes the `balanceOf > whitelistBalance` holder branch; on dgnHYPE (`VaultV0`) it is a pure `whitelisted[msg.sender]` mapping check.
- The HYPE++ vault is NOT behind a proxy. This means the vault logic cannot be upgraded, but ownership can be transferred at any time via `transferOwnership()`. No `OwnershipTransferred` event was emitted on either vault since August 1, 2026.
- HYPE++ trader `DEFAULT_ADMIN_ROLE` holders are the D2 Vault MS and the trader-role EOA. `EXECUTOR_ROLE` holders are the same two addresses. The full `RoleGranted`/`RoleRevoked` history contains only the November 19, 2024 deployment events (factory roles granted and then revoked).
- The trader-role EOA also receives trader fees via `feeReceiver()`. `performanceFeeRate()` is 20% and `managementFeeRate()` is 0.
- The D2 Vault MS is a 4-of-7 Safe, but there is no onchain timelock on trader role changes or vault owner actions.
- dgnHYPE vault has the same EOA owner as HYPE++, further concentrating control. dgnHYPE is a `VaultV0` (distinct bytecode) whose `withdraw`/`redeem` are also `onlyWhitelisted`, but with no holder-balance branch. Blacklisting its sole holder (the HYPE++ trader) via `setWhitelistStatus` therefore blocks redemptions; the `setWhitelistBalance(uint256.max)` path does not exist on VaultV0. A dgnHYPE-level block would trap ~69.27% of HYPE++ assets (~$6.00M).
- The dgnHYPE Safe is a 3-of-5 Safe (threshold and owner count unchanged at the snapshot).

The trader contract is a standalone selector router (code size ~4.2KB; EIP-1967 implementation slot zero) that delegatecalls modules based on `msg.sig`. The constructor wires selectors to module targets. The trader uses solidstate `AccessControl` (which, like OpenZeppelin's, is not enumerable — `getRoleMemberCount` and `getRoleMember` are unavailable), so role-holder enumeration requires scanning `RoleGranted`/`RoleRevoked` events. Operationally, this gives the executor a broad DeFi action surface, bounded by the strategy's allowed tokens/spenders/modules, but still much more discretionary than a passive vault.

### Programmability

The strategy is manual and custodial for most of its capital:

- Vault deposit/withdraw rules are programmatic.
- Trading execution is manual or offchain-directed. In the HYPE++ trader it runs through executor role calls into the OMS. In dgnHYPE (69.27% of assets) it runs through Safe transactions, operational EOAs, and HyperCore accounts with no contract-level constraints.
- Epoch start/end scheduling is owner-controlled, with no practical maximum duration.
- NAV crystallizes at whatever amount the trader returns. Epoch 22 showed that PnL can be credited by discretionary EOA transfers rather than recorded trading.

The design suits an active derivatives/managed strategy product, but it scores poorly under a Yearn-style risk framework because users rely on D2 operators to trade safely, report PnL honestly, and return funds.

### External Dependencies

Dependencies include:

- Arbitrum One as the execution chain. L2BEAT lists Arbitrum One as a Stage 1 optimistic rollup and notes upgrade/security-council and sequencer-related trust assumptions.
- Circle/Arbitrum USDC as the base asset.
- D2's nested dgnHYPE strategy (69.27% of assets).
- Hyperliquid/HyperCore for spot and derivatives execution, reached from the dgnHYPE Safe through operational EOAs and then Hyperliquid Bridge2 or Circle CCTP.
- Circle CCTP (HyperCore extension outbound; CCTP V2 mints on return) as the main USDC transport between Arbitrum and HyperCore.
- Aave V3 Arbitrum (19.18% of HYPE++ assets via aArbUSDCn at the snapshot).
- Anchorage Digital Porto policy engine for V0 sub-vault operations (team-disclosed; not observable onchain).
- Broad Arbitrum DeFi venues approved in the trader's allowed spender list, including Aave, 1inch, GMX/Camelot-style modules, and D2 strategy contracts.
- Offchain operator process for strategy decisions.

## Operational Risk

D2 documentation covers architecture, epochs, security process, strategy philosophy, vault-owner policy, and audit links. D2 also discloses BVI approved asset manager language and a Marshall Islands DAO for frontend hosting. D2 states that a BVI Financial Services Commission-approved investment manager carries out discretionary management of the HYPE++ strategy, including the dgnHYPE allocation sleeve, and is subject to fiduciary duties under that regime. Where the strategy takes OTC exposure, D2 says that regulated entity is the ISDA counterparty facing the desks. This is recorded as a team representation; it does not change the onchain custody mechanics described above.

Operational gaps remain:

- The HYPE++ vault owner is an EOA, contradicting D2's own documented 4/7-multisig default. No D2 documentation reviewed explains this vault-specific ownership choice or states whether ownership will be transferred (D2 states this address is an institutional MPC/HSM custody wallet — see Governance).
- The public docs reviewed do not identify the EOA holding trader admin/executor/fee-receiver roles (D2 states it is an institutional MPC/HSM custody wallet — see Governance).
- D2's GitBook no longer publishes the strategy contract list or the multisig list, reducing public mapping of strategy addresses and signer sets.
- No public bug bounty with payout terms was found.
- Nested dgnHYPE backing is only partially transparent: the Safe held 3.41M USDC against 6.00M reported `totalAssets()`, with the balance forwarded to HyperCore accounts that are not publicly attributed.
- At least three operational EOAs sit between the dgnHYPE Safe and HyperCore. No public documentation reviewed identifies those EOAs, their key-management policy, or their recovery process. D2 represents the V0 path as operated through an Anchorage Digital Porto wallet by its regulated investment manager; this is a legal/policy layer, not an onchain control.
- HYPE++ epoch 22 PnL was credited via transfers from the trader-role EOA that originated outside the vault and trader accounting path.
- The Safe and trader-role EOA receive persistent address-poisoning traffic; the Safe's unrestricted transfer model relies on signers verifying destination addresses manually.

## Monitoring

Recommended monitoring frequency: hourly during active epochs, daily outside active epochs.

Monitor these contracts and values:

- HYPE++ vault [`0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004`](https://arbiscan.io/address/0x75288264FDFEA8ce68e6D852696aB1cE2f3E5004)
  - `custodied()`, `custodiedAmount()`, `totalAssets()`, `totalSupply()`, `totalDeposits()`, `maxDeposits()`, `getCurrentEpochInfo()`, `getCurrentEpoch()`, `whitelistBalance()`, `whitelistAsset()`
  - Events: `EpochStarted`, `FundsCustodied`, `FundsReturned`, `NewMaxDeposits`, `NewWhitelistStatus`, `OwnershipTransferred`
- HYPE++ trader [`0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3`](https://arbiscan.io/address/0x8CaBD8b787e8c69C5f24091cFDA197fF570345B3)
  - `hasRole(DEFAULT_ADMIN_ROLE, account)` and `hasRole(EXECUTOR_ROLE, account)` for known holders
  - The trader uses solidstate `AccessControl` (not enumerable); `getRoleMemberCount` and `getRoleMember` are unavailable. Monitor `RoleGranted`/`RoleRevoked` events for role-holder enumeration.
  - Events: `RoleGranted(bytes32,address,address)`, `RoleRevoked(bytes32,address,address)`
  - `getAllowedTokens()`, `getAllowedSpenders()`, `feeReceiver()`, `performanceFeeRate()`, `managementFeeRate()`
  - Direct USDC balance and Aave [`aArbUSDCn`](https://arbiscan.io/address/0x724dc807b04555b71ed48a6896b6f41593b8c637) balance.
  - Inbound USDC transfers from non-vault addresses (especially the trader-role EOA) before `returnFunds()`.
  - Note: `setFeeReceiver()` and fee-rate changes go through `setFeeRates(uint256,uint256)` (both gated by `DEFAULT_ADMIN_ROLE`, verified onchain).
- Vault owner EOA [`0x0E8c0470773c65498F438cac380648B314399A46`](https://arbiscan.io/address/0x0E8c0470773c65498F438cac380648B314399A46)
  - All outbound transactions to HYPE++ vault, dgnHYPE vault, and any vault factory.
  - Note: This EOA owns both HYPE++ and dgnHYPE vaults.
- Trader role EOA [`0x7ab129978091DEE65A319c5FC728818D73221999`](https://arbiscan.io/address/0x7ab129978091DEE65A319c5FC728818D73221999)
  - All role/admin/trading transactions and USDC flows to/from the HYPE++ trader and the dgnHYPE Safe.
- D2 Vault MS [`0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0`](https://arbiscan.io/address/0xB2fEDed045F3fd9FcCCF8E7e95729c4182916CE0)
  - Safe: `getThreshold()`, `getOwners()`; monitor `AddedOwner`, `RemovedOwner`, `ChangedThreshold` events.
  - Trader role changes via this Safe.
- dgnHYPE vault [`0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd`](https://arbiscan.io/address/0x64167cd42859F64cfF2Aa4B63c3175cceF9659dd)
  - `totalAssets()`, `totalSupply()`, `custodied()`, `custodiedAmount()`, `trader()`, `owner()`, `getCurrentEpochInfo()`
- dgnHYPE Safe [`0x155d0B27B754ebC664aeD565945C1AaEa91966fb`](https://arbiscan.io/address/0x155d0B27B754ebC664aeD565945C1AaEa91966fb)
  - `getThreshold()`, `getOwners()`; monitor threshold/owner changes and direct USDC balance against reported `custodiedAmount`.
  - All outbound USDC transfers; compare each destination against the known operational EOAs (exact 40-character match, given address-poisoning lookalikes).
- Hyperliquid operational EOAs [`0x0C684f333A7e120bce61383DA670bbB0157e82d0`](https://arbiscan.io/address/0x0C684f333A7e120bce61383DA670bbB0157e82d0), [`0x11A691612BD108e57cC04ea42B006C9CB1ff006A`](https://arbiscan.io/address/0x11A691612BD108e57cC04ea42B006C9CB1ff006A), and [`0x4c3d48cbe2186beeafecc6723630ab8eda4117fc`](https://arbiscan.io/address/0x4c3d48cbe2186beeafecc6723630ab8eda4117fc)
  - Monitor every inbound transfer from the dgnHYPE Safe, subsequent Bridge2/CCTP deposits, unexpected destinations, and whether funds return before epoch settlement.
  - HyperCore `clearinghouseState` / `spotClearinghouseState` via the Hyperliquid info API: account value, open perpetual notional, and leverage.
- Hyperliquid [`Bridge2`](https://arbiscan.io/address/0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7), Circle [`HyperCore CCTP extension`](https://arbiscan.io/address/0xA95d9c1F655341597C94393fDdc30cf3c08E4fcE), and Circle [`MessageTransmitterV2`](https://arbiscan.io/address/0x81D40F21F12A8F0E3252Bccb954D722d4c464B64)
  - Monitor deposits/mints attributable to the operational EOAs and bridge/validator/CCTP incidents.

Suggested alert thresholds:

- Any vault `OwnershipTransferred` event.
- Any `NewWhitelistStatus` event with status `false` targeting a non-zero shareholder (blacklisting of existing depositors blocks withdrawal), and any `whitelistBalance()` change.
- Any trader `RoleGranted` or `RoleRevoked` event.
- Any `setMaxDeposits()` change greater than 10%.
- Any new epoch with a scheduled trading period materially longer than 30 days (epoch 23 is ~105 days).
- Any mismatch where HYPE++ trader direct USDC + Aave aUSDC + dgnHYPE-derived assets fail to reconcile to HYPE++ `totalAssets()` by more than 1%.
- Any dgnHYPE `totalAssets()` drop greater than 2% between checks.
- Any dgnHYPE Safe transfer to an address other than the dgnHYPE vault or a known operational EOA, or any operational-EOA transfer to a destination other than the identified Hyperliquid/CCTP routes.
- Any inbound transfer to the HYPE++ trader from the trader-role EOA or another non-vault address in the 24 hours before `returnFunds()`.
- Funds not returned within 72 hours after the scheduled epoch end (January 15, 2027 08:00 UTC for epoch 23).

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
   +--> Direct USDC balance (~1.00M, 11.56%)
   |
   +--> [Aave V3 aArbUSDCn] (~1.66M, 19.18%)
   |
   +--> [dgnHYPE Vault shares] (~4.41M shares = 100% of supply; ~6.00M USDC, 69.27%)
          |
          v
        [dgnHYPE Vault / VaultV0]  (non-upgradeable, no proxy)
          - owner: EOA 0x0E8c... (same EOA as HYPE++ vault owner)
          - trader: 3-of-5 Safe 0x155d...
          |
          v
        [dgnHYPE Trader / 3-of-5 Safe]
          - reports ~6.00M USDC totalAssets (custodiedAmount)
          - unrestricted Safe execution (team: Anchorage Porto policy engine)
          - ~3.41M real USDC directly observed; 2.60M forwarded Oct 12, 2026
          |
          +--> [Operational EOA 1 0x0C68...] --USDC--> [Bridge2 / Circle CCTP HyperCore ext.]
          |
          +--> [Operational EOA 2 0x11A6...] --USDC--> [Bridge2 / Circle CCTP HyperCore ext.]
          |
          +<-- [Operational EOA 1 / EOA 3 0x4c3d...] <--CCTP V2 mint-- [HyperCore withdrawals]
                                                     |
                                                     v
                                               [HyperCore trading accounts]

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
- Top-level HYPE++ assets reconcile to direct USDC, Aave aUSDC, and dgnHYPE shares.
- The vault is not upgradeable (no proxy); the trader is a non-proxy selector router — no hidden upgrade path was found.
- Trader roles, fee settings, and allowed token/spender lists are unchanged since deployment.
- Recent epochs returned funds with positive results (epoch 21 +1.91%, epoch 22 +1.63%), and the September 19 – October 2, 2026 funding windows processed ~7.45M USDC of withdrawals.
- D2 publishes architecture docs, vault-owner policy, and audit links.

### Key Risks

- HYPE++ vault owner is an EOA with direct control over epoch scheduling, deposit caps, and whitelist settings — including the ability to block all users from **withdrawing** (not just depositing) via either blacklist (paired with a raised `whitelistBalance`) or `setWhitelistBalance(uint256.max)`. The same EOA also owns the dgnHYPE vault (a `VaultV0`), which is exposed to the blacklist path only — its `onlyWhitelisted` has no balance-gate branch.
- Trader admin/executor authority includes an EOA with no timelock.
- The trader's allowed token list includes volatile assets (WETH, WBTC, ARB, GMX, GRAIL, PENDLE, LINK, wstETH) and old bridged USDC.e, expanding the strategy risk surface.
- Funds are custodied by the trader during epochs. The current epoch 23 locks capital until at least January 15, 2027 (~105 days of trading), and the 10-year `MAX_EPOCH_DURATION` gives no practical contract bound on schedule length.
- HYPE++ has large nested exposure to dgnHYPE (69.27% of assets), another D2 active strategy controlled by the same EOA owner. The dgnHYPE custody Safe has no onchain guardrails, making it a separate trust surface for the majority of HYPE++ capital.
- dgnHYPE capital is routed from its 3-of-5 Safe through at least three operational EOAs into HyperCore accounts with leveraged perpetual positions. Once funds leave the multisig, they depend on single-address key custody, and the accounts' holdings are not attributable to dgnHYPE.
- HYPE++ NAV equals whatever the trader returns. Epoch 22 PnL was credited by trader-role EOA transfers rather than recorded trading.
- HYPE++ TVL fell 25.9% between August 10 and October 12, 2026, to $8.66M.

### Critical Risks

- **A compromised vault owner EOA can permanently block all users from withdrawing** via two independent one-transaction paths:
  1. **Blacklist:** `setWhitelistStatus(victim, false)` or `setWhitelistStatuses([...], [false,...])` — removes specific users from the whitelist mapping. On HYPE++ this is not sufficient on its own: the `onlyWhitelisted()` holder branch still lets a removed user withdraw as long as they hold more than `whitelistBalance` (currently >1 USDC) of `whitelistAsset`, so this path must be paired with a raised `whitelistBalance` to bite. (On the dgnHYPE `VaultV0`, which has no holder branch, the blacklist path is fully effective on its own.)
  2. **Balance gate:** `setWhitelistBalance(type(uint256).max)` — no user can satisfy `whitelistAsset.balanceOf(user) > uint256.max`, so the holder branch can never pass and every non-whitelisted `withdraw()` and `redeem()` reverts. One transaction, no enumeration needed, blocks every shareholder indiscriminately. This is the reliable single-transaction block on HYPE++.
  Both paths work because the `onlyWhitelisted()` modifier gates `withdraw()` and `redeem()`, not just `deposit()` and `mint()` (verified against the verified `VaultV1Whitelisted` source). There is no onchain bypass. The blacklist path also applies to dgnHYPE, a separate `VaultV0` contract (distinct bytecode; `whitelistBalance`/`whitelistAsset` do not exist there). There the HYPE++ trader is the sole holder, so blacklisting it traps $6.00M (69.27% of HYPE++ assets). The vault holds zero USDC while custodied, so the trader must return funds before blocked users could even attempt an exit, and even after `returnFunds()` the gated `withdraw`/`redeem` would revert. With `transferOwnership()`, a compromised EOA can move this power to a new attacker address and make the block permanent. D2 states this owner address is an institutional MPC/HSM custody wallet (see Governance), but the onchain powers are the same regardless of key custody.
- A compromised or malicious trader executor can interact with a broad allowed DeFi surface (32 tokens, 30 spenders) and cause trading losses before funds are returned.
- **The dgnHYPE Safe (3-of-5) and its downstream operational EOAs form an unrestricted custody path for $6.00M (69.27% of HYPE++ assets).** Unlike the HYPE++ trader OMS, which is constrained to pre-approved tokens and venues, the dgnHYPE custody Safe is a standard Safe. 3-of-5 signers can call `execTransaction` to execute `USDC.transfer(attacker, amount)` or any other arbitrary call, with no onchain restriction. That authority is used routinely: millions of USDC go to EOAs that then fund HyperCore trading accounts. Once transferred, the Safe's threshold no longer protects those funds; control follows the relevant EOA/HyperCore account key. Neither the dgnHYPE vault, the HYPE++ vault, nor the HYPE++ trader can constrain or override the Safe signers or the downstream EOA keys. D2 represents these addresses as operated by its regulated investment manager through an Anchorage Digital Porto policy engine (see Operational Risk); that is a legal/policy layer and does not constrain the onchain custody path.
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

The total-centralization gate is not marked because the D2 Vault MS also holds trader roles and the dgnHYPE custody is a 3-of-5 Safe. However, the EOA owner and EOA trader role-holder materially drive the high centralization score. The unverifiable-reserves gate is not marked because the top-level vault holdings reconcile onchain and the HyperCore destination accounts are publicly observable, although they are not attributable to dgnHYPE.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews — 2.5**

Three audits from Paladin and Cyfrin cover the D2 strategy stack and Hyperliquid CoreWriter (score-1/2 band for coverage). However, there is no public bug bounty (score-4 band), the trading surface is complex, and the audits do not cover the Safe/EOA/HyperCore custody path that holds 69.27% of capital.

**Subcategory B: Historical Track Record — 3.0**

About 23 months in production (1–2 years: score 2), but scoped TVL is $8.66M, below the $10M threshold (score 4).

**Audits & Historical Score = (2.5 + 3.0) / 2 = 2.75/5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance — 5.0**

The vault owner is an EOA with no timelock. It can block all withdrawals in one transaction and transfer ownership; the trader admin role is also held by an EOA. The dgnHYPE Safe is an unrestricted custody surface for 69.27% of assets.

**Subcategory B: Programmability — 4.5**

Most capital is operated through unrestricted Safe transactions, operational EOAs, and HyperCore accounts. NAV is whatever the trader returns, and epoch 22 PnL was credited by trader-role EOA transfers rather than recorded trading. Epoch schedules are owner-set with no practical bound. The HYPE++ OMS constraints and programmatic deposit/withdraw rules keep this short of fully custodial (5.0).

**Subcategory C: External Dependencies — 4.0**

Critical dependencies are Hyperliquid/HyperCore, Circle CCTP and USDC, Arbitrum, Aave V3, and the nested dgnHYPE strategy, plus the broad allowed DeFi venue list.

**Centralization Score = (5.0 + 4.5 + 4.0) / 3 = 4.50/5**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization — 4.5**

69.27% of assets sit in unrestricted Safe custody and are forwarded through EOAs into leveraged HyperCore trading. `totalAssets()` is a stored custodied amount, not a live valuation.

**Subcategory B: Provability — 4.5**

Top-level balances reconcile onchain. However, dgnHYPE's deployed capital sits in HyperCore accounts that are not attributable to the vault, no complete cross-venue NAV is published, and PnL can be credited off-vault at the operator's discretion.

**Funds Management Score = (4.5 + 4.5) / 2 = 4.50/5**

#### Category 4: Liquidity Risk (Weight: 15%)

**Score: 4.5/5**

The exit path exists but is closed until the epoch 23 scheduled end of January 15, 2027 (~105 days of trading), and only opens after the trader returns funds. The owner EOA sets epoch lengths with a 10-year contract maximum, and there is no secondary liquidity. Past funding windows did process large exits.

#### Category 5: Operational Risk (Weight: 5%)

**Score: 3.5/5**

Documentation covers architecture, risk, and legal structure (BVI investment manager representation). The gaps:

- The HYPE++ owner contradicts D2's documented 4/7-multisig default.
- The strategy contract and multisig lists were removed from the docs.
- Operational EOAs are undisclosed.
- There is no bug bounty.
- PnL settlement runs through off-vault transfers.

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.75 | 20% | 0.550 |
| Centralization & Control | 4.50 | 30% | 1.350 |
| Funds Management | 4.50 | 30% | 1.350 |
| Liquidity Risk | 4.50 | 15% | 0.675 |
| Operational Risk | 3.50 | 5% | 0.175 |
| **Final Score** | | | **4.10/5.0** |

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.00–1.49** | **Minimal Risk** | Approved, high confidence |
| **1.50–2.49** | **Low Risk** | Approved with standard monitoring |
| **2.50–3.49** | **Medium Risk** | Approved with enhanced monitoring |
| **3.50–4.49** | **Elevated Risk** | Limited approval, strict limits |
| **4.50–5.00** | **High Risk** | Not recommended |

**Final Risk Tier: Elevated Risk**

---

## Reassessment Triggers

- **Governance-based:** Reassess immediately if vault ownership transfers, trader roles change, Safe threshold/signers change, or a timelock is added.
- **Epoch-based:** Reassess if funds are not returned within 72 hours after the scheduled epoch end (January 15, 2027 08:00 UTC for epoch 23), if the next epoch's trading period exceeds 30 days, and after epoch 23 settles.
- **Funds-based:** Reassess if HYPE++ `totalAssets()` falls by more than 2% outside expected fee/PnL reporting, or if reconciliation between HYPE++ direct assets, Aave aUSDC, and dgnHYPE-derived assets fails by more than 1%.
- **Dependency-based:** Reassess if dgnHYPE strategy composition changes, if dgnHYPE experiences losses, if a new operational EOA appears, if funds route to a new bridge/custodian, or if Flowdesk/OTC exposure is introduced.
- **Incident-based:** Reassess after any D2, Arbitrum, Hyperliquid, Circle USDC/CCTP, Aave, GMX, 1inch, Camelot, or nested D2 strategy incident.

## Assessment History

| Date | Score | Notes |
| --- | --- | --- |
| [August 10, 2026](https://github.com/yearn/risk-score/pull/393) | 3.85 | Initial assessment |
| October 12, 2026 | 4.10 | Epoch 23 (~105-day lock to Jan 15, 2027); TVL $11.69M → $8.66M; dgnHYPE 69.27% of assets; Aave V3 position added; epoch 22 PnL credited via trader-role EOA; third operational EOA and CCTP return path traced. Rescored Audits & Historical (2.25 → 2.75), Programmability (4.0 → 4.5), Liquidity (4.0 → 4.5), Operational (3.0 → 3.5). |
