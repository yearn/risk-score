# Protocol Risk Assessment: Across Protocol

- **Assessment Date:** May 12, 2026
- **Token:** Across V2 LP Tokens (Av2-WETH-LP, Av2-USDC-LP, Av2-USDT-LP, Av2-DAI-LP, Av2-WBTC-LP)
- **Chain:** Ethereum Mainnet
- **HubPool Address:** [`0xc186fA914353c44b2E33eBE05f21846F1048bEda`](https://etherscan.io/address/0xc186fA914353c44b2E33eBE05f21846F1048bEda)
- **Final Score: 3.5/5.0**

> The issue (yearn/risk-score#169) lists "Across Protocol" as both protocol and asset. For a Yearn integration, the only yield-bearing Across asset is the per-pool **LP token** minted by the HubPool when LPs deposit underlying. This assessment focuses on those LP tokens. The ACX governance token is **not** a yield-bearing asset and is out of scope; it is referenced only where it bears on operational risk.

## Overview + Links

Across is an intent-based cross-chain bridge built by Risk Labs (the team that also built UMA). LPs deposit a single asset (WETH, USDC, USDT, DAI, WBTC, etc.) into the **HubPool** on Ethereum and receive an LP token that represents a pro-rata claim on the pool's `liquidReserves + utilizedReserves + undistributedLpFees`. Relayers front capital to bridge users on destination chains and are reimbursed in periodic root bundles validated by UMA's Optimistic Oracle. LP yield comes from the fee paid by bridge users, amortized into the pool's exchange rate over time.

**Yield source:** Bridge fees paid by depositors, accrued onchain as `undistributedLpFees` and amortized into `exchangeRateCurrent` at a rate of `lpFeeRatePerSecond` per second.

**Yield-bearing assets covered:** Across V2 LP Tokens (the five canonical L1 pools — WETH, USDC, USDT, DAI, WBTC).

**Links:**

- [Protocol Documentation](https://docs.across.to/)
- [Protocol Dashboard / Pool UI](https://app.across.to/pool)
- [GitHub — across-protocol/contracts](https://github.com/across-protocol/contracts)
- [Security / Audits Page](https://docs.across.to/resources/audits) (OpenZeppelin reports linked individually in the Audits section below)
- [Bug Bounty Page](https://docs.across.to/introduction/bug-bounty)
- [DefiLlama — Across](https://defillama.com/protocol/across)
- [Risk Labs Foundation](https://risklabs.foundation/)
- [Across blog — "Why Across Has Never Been Hacked"](https://across.to/blog/why-across-has-never-been-hacked)
- [Across blog — "A Deep Dive Into Across Protocol's Security"](https://across.to/blog/A-Deep-Dive-Into-Across-Protocols-Security)
- [UMA case study on Across](https://blog.uma.xyz/articles/case-study-how-uma-secures-across-protocol)
- LlamaRisk: no dedicated Across report found on [llamarisk.com/research](https://www.llamarisk.com/research) at the time of this assessment.

## Audits and Due Diligence Disclosures

All formal audits to date have been performed by a single firm — **OpenZeppelin**. No public Code4rena, Spearbit, Trail of Bits, or Cantina contests for Across were located.

| Date | Scope | Findings (notable) | Source |
|------|-------|--------------------|--------|
| Jul 2023 | V2 zkSync Era integration (`ZkSync_SpokePool`, `ZkSync_Adapter`) | 1 medium (resolved), 6 notes | [OZ — Across V2 Incremental Audit](https://www.openzeppelin.com/news/across-v2-incremental-audit) |
| Jan 8 – 30, 2024 | V3 incremental | 4 med, 7 low, 16 notes (25/27 resolved) | [OZ — Across V3 Incremental Audit](https://www.openzeppelin.com/news/across-v3-incremental-audit) |
| May 20 – Jun 7, 2024 | V3 + Oval (Blast L2, EIP-7683, MulticallHandler) | 4 med, 7 low, 14 notes (all resolved) | [OZ — Across V3 and Oval Incremental Audit](https://www.openzeppelin.com/news/across-v3-and-oval-incremental-audit) |
| Oct 7 – 30, 2024 | L3 / ZkStack / Predictable Relay Hash / ERC-7683 / World Chain | **1 critical**, 2 high, 8 med, 3 low, 14 notes — critical/high resolved | [OZ — Across Audit (Oct 2024)](https://www.openzeppelin.com/news/across-audit) |
| Nov 26 – Dec 18, 2024 | SVM Spoke (Solana) | 2 high (1 partial, 1 unresolved), 1 med unresolved, 9 low, 7 notes | [OZ — SVM Spoke Audit](https://www.openzeppelin.com/news/svm-spoke-audit) |
| May 15 – 26, 2025 | Periphery Changes Audit (`SpokePoolPeriphery.sol`, `MulticallHandler.sol`, `PeripherySigningLib.sol`) | 0 critical, 1 high, 3 med, 3 low, 6 notes — **all resolved** | [OZ — Periphery Changes Audit](https://www.openzeppelin.com/news/periphery-changes-audit) |
| May 19 – 23, 2025 | OFT Integration Differential Audit (LayerZero OFT support, PRs #1031/#1032) | 0 critical, **1 high (unresolved)**, 7 med (4 resolved, 1 partial), 13 low (1 resolved, 3 partial), 11 notes | [OZ — Across OFT Integration Differential Audit](https://www.openzeppelin.com/news/across-protocol-oft-integration-differential-audit) |

**Smart contract complexity:** Moderate-to-high. The HubPool is a single non-upgradeable contract (~1k lines) on L1, but the broader system spans many UUPS-upgradeable SpokePools across every supported chain, many ChainAdapters, the BondToken, an UMA Optimistic Oracle dependency, a HubPoolStore, an AcrossConfigStore, and a MulticallHandler. Cross-chain orchestration via `relaySpokePoolAdminFunction` is a meaningful additional attack surface.

**Unresolved findings:**
- The October 2024 audit found a critical issue (resolved).
- The Nov–Dec 2024 SVM Spoke audit lists unresolved high and medium findings (scoped to the Solana SpokePool — does not affect Ethereum mainnet LP tokens directly, but remains open in the same codebase).
- The May 2025 OFT Integration Differential audit has **one unresolved high-severity finding** ("failed messengers rendering canonical methods useless"); per OpenZeppelin's writeup the team chose not to implement try/catch logic and plans manual intervention if such a situation arises.

**Sole-auditor concentration:** The exclusive use of OpenZeppelin over the protocol's lifetime is a concentration risk. Across has not published any non-OZ external review.

### Bug Bounty

- **Platform:** Self-hosted by Across at [docs.across.to/introduction/bug-bounty](https://docs.across.to/introduction/bug-bounty). Submissions go to bugs@across.to.
- **Severity tiers (from primary docs):** Low $250, Medium $1,000, High $10,000, Critical **up to $1,000,000**. Severity uses the OWASP risk-rating model.
- **Scope:** All smart contracts and off-chain code within the `across-protocol` repository, including bots and front-end code.
- **Immunefi:** **Not listed.** `immunefi.com/bug-bounty/acrossprotocol/` returned 404 at research time. Across does not have an Immunefi program — the bounty is fully self-hosted.
- **Safe Harbor (SEAL):** TODO — could not access `safeharbor.securityalliance.org/adopters` (404). Confirm with team whether Across has adopted Safe Harbor.

## Historical Track Record

- **HubPool deployment:** May 2022 (Ethereum block 14,819,537) — **~4 years** in production.
- **V3 (intents-based) launch:** February 22, 2024, per the official Medium announcement.
- **Cumulative bridge volume / fees (DefiLlama, May 12, 2026):** **$59.566B cumulative bridged**, **$18.53M cumulative fees**.
- **TVL (DefiLlama, May 12, 2026):** **$27.98M** (confirmed via `reports/scripts/fetch_defillama_tvl.py across`).
- **Peak TVL:** **$248.88M on December 9, 2024** (DefiLlama).
- **TVL trajectory:** 89% drawdown from Dec 2024 peak to May 2026; ~30× peak-to-min volatility ratio. The protocol now sits well below the "$50M sustained" threshold.

**Past security incidents (bridge contracts):**

- **No direct exploits of Across bridge contracts** since the May 2022 launch, corroborated by the Across blog ["Why Across Has Never Been Hacked"](https://across.to/blog/why-across-has-never-been-hacked), the DefiLlama bridge incident database (no entry for Across), and the absence of any postmortem in the Across forum or GitHub.

**Operational / governance incident (June 2025, NOT a smart-contract exploit):**

- On June 26 – 27, 2025, researcher "Ogle" (Glue founder) publicly alleged that Across leadership manipulated DAO votes to transfer **150M ACX (~$23M)** from the DAO treasury to Risk Labs Foundation. The allegation centers on Across treasurer Kevin Chan reportedly voting "yes" on the second proposal via undisclosed wallet `maxodds.eth`, which provided a material share of the yes-votes on a 50M ACX retrospective proposal.
- ACX price reaction: ~10% drop in 24h, ~40% drop month-over-month, ~91% drawdown from Dec 2024 ATH.
- Across CEO Hart Lambur publicly denied: "The allegations in here are categorically untrue and I will vigorously defend our protocol and our team."
- Sources: [crypto.news](https://crypto.news/across-protocol-token-plunges-23m-misappropriation-2025/), [The Block](https://www.theblock.co/post/360075/across-protocol-founder-refutes-allegations), [Bitget News](https://www.bitget.com/news/detail/12560604837743).
- **Impact on LPs:** Direct LP claims (`liquidReserves + utilizedReserves`) are not affected by ACX governance events. Indirect impact: the same multisig signers (Risk Labs representatives, per the [Across Governance Operating Manual](https://forum.across.to/t/across-governance-operating-manual/1447)) that allegedly directed treasury votes also control the HubPool, BondToken, and every SpokePool with no timelock — i.e., reputational concerns about governance integrity translate directly into custody risk for LP funds.

**Peg deviations:** Not applicable — LP tokens are not pegged; they represent a pro-rata share of an asset pool and accrue value through fee accrual.

**Concentration risk among depositors:** TODO — top-holder analysis of each LP token contract was not run during this assessment. The small total TVL (~$28M) implies a small number of LPs may dominate any given pool — review the top-holder list for the relevant LP token on Etherscan (e.g. [Av2-USDC-LP holders](https://etherscan.io/token/0xC9b09405959f63F72725828b5d449488b02be1cA#balances)) before sizing a Yearn position.

## Funds Management

**Fund delegation:** Across does **not** redelegate LP funds to external yield protocols. LP capital sits in two states only:

1. `liquidReserves` — held in the HubPool's own balance on Ethereum.
2. `utilizedReserves` — fronted by relayers on destination SpokePools, returning to the HubPool via canonical bridges (Arbitrum, Optimism, Base, etc.) as part of each ~1.5-hour root-bundle settlement cycle.

So fund delegation risk is limited to (a) the HubPool's own custody and (b) every connected canonical bridge and SpokePool. There is no rehypothecation into Aave/Morpho/etc.

**Monitoring fund delegation:** Use `HubPool.pooledTokens(l1Token)` to read `(lpToken, isEnabled, lastLpFeeUpdate, utilizedReserves, liquidReserves, undistributedLpFees)` per pool. See Monitoring section.

### Accessibility

- **Minting (LP entry):** Permissionless via `HubPool.addLiquidity(l1Token, l1TokenAmount)` or `addLiquidityETH` (for the WETH pool with `msg.value`). Atomic in a single transaction. Mints `l1TokenAmount * 1e18 / exchangeRateCurrent` LP tokens to the caller.
- **Redeeming (LP exit):** Permissionless via `HubPool.removeLiquidity(l1Token, lpAmount, sendEth)`. Atomic. Burns LP tokens and transfers `lpAmount * exchangeRateCurrent / 1e18` of the underlying — provided `liquidReserves` is sufficient.
- **Pause:** Both `addLiquidity` and `removeLiquidity` carry the `unpaused` modifier, so the 3-of-5 HubPool owner multisig can suspend deposits and withdrawals atomically via `setPaused(true)`.
- **Fees:** No mint/redeem fee charged by the contract; LPs only realize the protocol's value through exchange-rate appreciation.
- **Rate limits / cooldown:** No cooldown. The de-facto rate limit is the pool's `liquidReserves` balance — if redemption demand exceeds idle inventory, the call reverts and the LP must wait for the next root-bundle settlement to repatriate `utilizedReserves`.

### Collateralization

- **Onchain collateral:** Yes. Each LP token is a pro-rata claim on the underlying L1 token held in the HubPool plus the matching `utilizedReserves` that are inflight on SpokePools.
- **Collateral quality:** The five canonical pools (WETH, USDC, USDT, DAI, WBTC) are all blue-chip. Across also enables long-tail pools (ACX, POOL, SNX, BAL, UMA, LSK) which are out of scope for this assessment.
- **Over-collateralization / maintenance:** None. LP backing target is 1:1 — there is no safety buffer like RSR or insurance fund.
- **Liquidations / peg mechanism:** N/A — LP tokens are not pegged; redemption is at exchange rate, not a market price.
- **EOA / multisig / custodian control:** The HubPool itself is **immutable** Solidity (no proxy) but a 3-of-5 Gnosis Safe ([`0xB524735356985D2f267FA010D681f061DfF03715`](https://etherscan.io/address/0xB524735356985D2f267FA010D681f061DfF03715), confirmed via `cast call HubPool.owner()`) holds powerful admin keys with **no timelock between signing and execution**. The Safe can:
  - `setPaused(bool)` — freeze LP entry/exit.
  - `haircutReserves(address,int256)` — **directly write down `utilizedReserves`, pro-rata loss to LPs**. This is intended for the case where a connected L2 fails and inflight `utilizedReserves` become unrecoverable, but the function itself has no onchain economic guardrail.
  - `relaySpokePoolAdminFunction(uint256,bytes)` — execute any function on any SpokePool, including UUPS upgrades, via ChainAdapters.
  - `setBond`, `setLiveness`, `setIdentifier` — change the parameters of the Optimistic Oracle dispute machinery, including the bond currency.
  - `disableL1TokenForLiquidityProvision(token)` — close a pool to new deposits.
  - `setProtocolFeeCapture(address,uint256)` — set the protocol fee share (capped at 50%) and recipient.

  These powers are not documented in a public on-chain governance manual that constrains the multisig (the [Across Governance Operating Manual](https://forum.across.to/t/across-governance-operating-manual/1447) describes an off-chain Snapshot process, but the multisig retains the ability to act without it onchain).

- **Risk curation:** Pool enablement and parameters are governance-controlled. Bridge LP fee rate parameters live in `AcrossConfigStore` ([`0x3B03509645713718B78951126E0A6de6f10043f5`](https://etherscan.io/address/0x3B03509645713718B78951126E0A6de6f10043f5)) and are governance-mutable.

### Provability

- **Reserve verifiability:** Excellent. Anyone can call `HubPool.pooledTokens(l1Token)` to read `liquidReserves`, `utilizedReserves`, `undistributedLpFees` and `HubPool.exchangeRateCurrent(l1Token)` to compute LP NAV. All data is onchain.
- **Yield calculation:** Onchain. The exchange rate is computed in `_exchangeRateCurrent` (`contracts/hub-pool/HubPool.sol`) as `(liquidReserves + utilizedReserves - undistributedLpFees + accumulatedLpFees) * 1e18 / totalSupply`. There is no admin-set rate.
- **Off-chain reserves:** None. The protocol does not custody assets off-chain.
- **Third-party verification:** No Chainlink PoR or custodian attestation is required — reserves are directly visible onchain. Optimistic Oracle disputes route through UMA's DVM, which is governed by UMA token holders.
- **Mint without backing:** No. LP tokens can only be minted via `addLiquidity`, which transfers the underlying L1 token first. There is no admin mint role on the LP token (verified by reading the LP token contracts, which are deployed by `LpTokenFactory` ([`0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d`](https://etherscan.io/address/0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d)) with the HubPool as the sole minter).
- **Caveat — `haircutReserves`:** While LP tokens cannot be created out of thin air, the multisig CAN reduce LP NAV by calling `haircutReserves`, which reduces `utilizedReserves` without burning LP tokens. This is the closest analog to an "admin write-down" power.

## Liquidity Risk

- **Exit mechanism:** Direct 1:1 redemption from the HubPool via `removeLiquidity`. No queue, no cooldown.
- **Constraint:** Bound by the pool's `liquidReserves` at redemption time. If `liquidReserves` is too low (because inventory is currently fronted on a SpokePool awaiting repatriation), the redemption reverts. The LP must either redeem a smaller amount, wait for the next root-bundle settlement, or sell the LP token OTC.
- **DEX liquidity for LP tokens themselves:** Minimal — Av2-*-LP tokens are not widely listed on DEXes. LPs should plan to exit via the HubPool, not via swap.
- **Slippage:** None on redemption (exchange rate, not market price).
- **Withdrawal queues / delays:** Officially none, but practically the per-pool `liquidReserves` ceiling acts as a soft throttle. Verified on May 12, 2026 onchain:
  - WETH pool: `liquidReserves ≈ 2,202.5 WETH` vs `utilizedReserves ≈ 2,141.3 WETH` — roughly half of total claims sit in flight.
  - USDT pool: `liquidReserves ≈ 73,605 USDT` vs `utilizedReserves ≈ 1,648,932 USDT` — **22× more capital in flight than liquid** at snapshot, meaning a large USDT-LP exit would revert.
  - USDC pool: `liquidReserves ≈ 783,118 USDC` vs `utilizedReserves ≈ 598,273 USDC` — moderately liquid.
  - DAI pool: `liquidReserves ≈ 679,840 DAI` vs `utilizedReserves ≈ 449,376 DAI` — moderately liquid.
- **Historical liquidity during stress:** Across continued to allow withdrawals during the Dec 2024 → Feb 2025 TVL collapse ($249M → $28M) without imposing a queue, per the DefiLlama TVL series; individual pools may still have been temporarily unredeemable.
- **Large holder impact:** A holder of >`liquidReserves` worth of any LP token cannot exit in a single transaction. They must wait for inflight inventory to return via canonical bridges (~1.5 hour settlement cadence; longer for chains with slow native bridges like Optimistic Rollup 7-day exits — though Across uses fast canonical messaging not the full L2 challenge period).

## Centralization & Control Risks

### Governance

- **HubPool upgradability:** **Immutable.** The HubPool contract has no proxy (EIP-1967 implementation slot is zero); it is fixed Solidity bytecode deployed in May 2022.
- **SpokePool upgradability:** **UUPS upgradable**, with the HubPool as the admin. The 3-of-5 multisig can deploy a new SpokePool implementation on any connected chain by calling `relaySpokePoolAdminFunction()` through the appropriate ChainAdapter — atomically, with no timelock.
- **HubPool owner:** [`0xB524735356985D2f267FA010D681f061DfF03715`](https://etherscan.io/address/0xB524735356985D2f267FA010D681f061DfF03715) ("Across Protocol: Hub Pool Owner MultiSig" per Etherscan label). Gnosis Safe v1.3.0.
- **Multisig threshold:** **3 of 5** (verified via `cast call getThreshold()`).
- **Multisig signers (verified via `cast call getOwners()`):**
  1. [`0x72b32C1a6A75CBAfAe36c0CA8e763946d370E766`](https://etherscan.io/address/0x72b32C1a6A75CBAfAe36c0CA8e763946d370E766)
  2. [`0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe`](https://etherscan.io/address/0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe)
  3. [`0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9`](https://etherscan.io/address/0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9)
  4. [`0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d`](https://etherscan.io/address/0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d)
  5. [`0x868CF19464e17F76D6419ACC802B122c22D2FD34`](https://etherscan.io/address/0x868CF19464e17F76D6419ACC802B122c22D2FD34)

  Per the [Across Governance Operating Manual](https://forum.across.to/t/across-governance-operating-manual/1447), the council that holds these keys is composed of Risk Labs representatives. **The natural-person mapping of each signer address is not publicly disclosed — TODO: confirm signer identities with the Across team if required for integration approval.**

- **Timelock:** **None.** No timelock contract is deployed between the multisig and the HubPool (confirmed by reading `HubPool.owner()` directly returning the Safe address with no intermediate proxy). The protocol's `deployed-addresses.json` on GitHub does not list a Timelock for chain 1. Snapshot governance is off-chain and does not gate signer actions.
- **Privileged roles capable of harm:** Yes — the multisig can pause LP redemption, write down LP NAV via `haircutReserves`, upgrade any SpokePool implementation, change the bond token, and disable any pool. All these are atomic and not constrained by any onchain delay.
- **Fund seizure:** The multisig cannot directly transfer LP-owned underlying tokens out of the HubPool — there is no `sweep` or `withdrawTo` function on the HubPool admin surface. But it can effectively seize value via (a) `haircutReserves` to write down NAV, (b) deploying a malicious SpokePool implementation to drain SpokePool inventory, or (c) `setBond` plus a malicious bundle proposal during the 30-minute liveness window. The latter two routes are non-trivial and depend on UMA dispute resolution, but the multisig has the unilateral ability to attempt them.

### Programmability

- **System operations:** Bundle execution, refund, and rebalance are fully onchain and callable by any actor. **Dispute is permissionless.** **Bundle proposal is *not* permissionless** — the BondToken (ABT) overrides `transferFrom` to require either `proposers[src] == true` or that `src` is not the current root-bundle proposer; tracing `HubPool.proposeRootBundle()`, the contract sets `rootBundleProposal.proposer = msg.sender` before the bond transfer, so the proposer-side require collapses to `require(proposers[src])`. `setProposer(address,bool)` is `onlyOwner` on the BondToken, and the BondToken owner is the same 3-of-5 Hub Pool Owner Safe ([`0xB524735356985D2f267FA010D681f061DfF03715`](https://etherscan.io/address/0xB524735356985D2f267FA010D681f061DfF03715), verified via `cast call BondToken.owner()`). In effect, the dataworker is admin-gated. Source: [BondToken.sol on Etherscan](https://etherscan.io/address/0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea#code).
- **Bond size:** `bondAmount() = 0.45 ABT` (verified onchain). ABT is issued 1:1 against deposited WETH.
- **Off-chain components:**
  - **Dataworker / bundler:** Off-chain bot that aggregates fills into a root bundle and posts it onchain. In practice, Risk Labs runs the canonical dataworker and is on the proposer allowlist; new proposers would need to be added by the multisig. Liveness is **only 30 minutes** (`HubPool.liveness() = 1800`, verified onchain), so honest disputers must be online to catch invalid bundles.
  - **Relayers:** Off-chain capital providers that fill destination intents. Permissionless — anyone can run a relayer.
  - **LP fee parameters:** `lpFeeRatePerSecond` lives in `AcrossConfigStore` and is governance-controlled.
- **PPS / exchange rate:** Defined onchain by a deterministic formula; no admin update path (other than `haircutReserves`, which writes down the inputs but does not redefine the formula).

### External Dependencies

- **UMA Optimistic Oracle V3:** [`0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE`](https://etherscan.io/address/0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE). Disputes route through UMA's DVM. The OO uses identifier `"ACROSS-V2"` (verified onchain via `HubPool.identifier()`). UMA itself is governed by a separate UMA-holder DAO, which is also Risk Labs–affiliated.
- **Canonical L1↔L2 bridges (Arbitrum, Optimism, Base, Polygon, zkSync, Linea, Blast, World Chain, etc.):** Critical for repatriating `utilizedReserves` to the HubPool. Failure of any of these (a frozen rollup, a halted canonical bridge) isolates that chain's SpokePool inventory until the underlying issue resolves — or until the multisig writes down the loss via `haircutReserves`.
- **Ethereum mainnet:** Full L1 dependency.
- **No oracle pricing dependency for LP NAV:** Unlike Reserve/RSR, Across does NOT need Chainlink or any price oracle to value LP reserves; the underlying token itself is what's owed.
- **Fallback mechanisms:** If UMA DVM fails to resolve, root bundle execution is blocked until the proposal is replaced. Liquidity remains in the HubPool / SpokePools but cannot be rebalanced. The multisig can `emergencyDeleteProposal` to clear the queue.

## Operational Risk

- **Team transparency:** Public. Risk Labs leadership is disclosed on [risklabs.foundation/#team](https://risklabs.foundation/#team) — Hart Lambur (CEO), Matt Rice (CTO), Melissa Quinn (COO), Kevin Chan (Treasurer), Ryan Carman (Head of Product), James Richard Fry (Head of Marketing). Hart Lambur is publicly known from UMA.
- **Legal structure:** Risk Labs is a Cayman Islands **Exempted Foundation Company**, registered with the Cayman Islands General Registry (RA000086) under registry ID **339077** ([GLEIF LEI 984500B2DE6O0F0P5071](https://api.gleif.org/api/v1/lei-records/984500B2DE6O0F0P5071)). Registered address: 23 Lime Tree Bay Avenue, PO Box 10176, c/o ZEDRA Trust Company (Cayman) Limited, Grand Cayman, KY1-1002. Entity status: ACTIVE; LEI registration status: ISSUED; next renewal due 2026-11-21. Risk Labs' own website does not disclose jurisdiction; this citation is sourced from the GLEIF registry, not the foundation's website.
- **Documentation:** Good. [docs.across.to](https://docs.across.to/) is comprehensive and current; concept docs explain the intents architecture clearly. Contract address and bug-bounty pages are reachable at the URLs cited above.
- **Incident response:** No public, documented incident-response runbook surfaced during research. The multisig can call `setPaused(true)` to freeze entry/exit in an emergency. The protocol has not had a smart-contract incident to test response capability.
- **Reputational concern:** The unresolved June 2025 ACX governance / treasury controversy weighs on operational risk because the parties involved are the same parties who hold the HubPool keys. While the alleged misconduct is not a contract-level loss event for LPs, it speaks directly to governance integrity — see Historical Track Record above.

## Monitoring

### Critical contracts to monitor

| Contract | Address | Purpose |
|---|---|---|
| HubPool | [`0xc186fA914353c44b2E33eBE05f21846F1048bEda`](https://etherscan.io/address/0xc186fA914353c44b2E33eBE05f21846F1048bEda) | Pool state, paused flag, admin events |
| Hub Pool Owner Multisig | [`0xB524735356985D2f267FA010D681f061DfF03715`](https://etherscan.io/address/0xB524735356985D2f267FA010D681f061DfF03715) | Signer / threshold changes |
| Ethereum SpokePool | [`0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5`](https://etherscan.io/address/0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) | UUPS upgrades, admin events |
| BondToken (ABT) | [`0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea`](https://etherscan.io/address/0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) | Bond currency parameters |
| AcrossConfigStore | [`0x3B03509645713718B78951126E0A6de6f10043f5`](https://etherscan.io/address/0x3B03509645713718B78951126E0A6de6f10043f5) | LP fee rate config |
| Av2-WETH-LP | [`0x28F77208728B0A45cAb24c4868334581Fe86F95B`](https://etherscan.io/address/0x28F77208728B0A45cAb24c4868334581Fe86F95B) | LP supply (only if Yearn holds this) |
| Av2-USDC-LP | [`0xC9b09405959f63F72725828b5d449488b02be1cA`](https://etherscan.io/address/0xC9b09405959f63F72725828b5d449488b02be1cA) | LP supply (only if Yearn holds this) |
| Av2-USDT-LP | [`0xC2faB88f215f62244d2E32c8a65E8F58DA8415a5`](https://etherscan.io/address/0xC2faB88f215f62244d2E32c8a65E8F58DA8415a5) | LP supply (only if Yearn holds this) |
| Av2-DAI-LP | [`0x4FaBacAC8C41466117D6A38F46d08ddD4948A0cB`](https://etherscan.io/address/0x4FaBacAC8C41466117D6A38F46d08ddD4948A0cB) | LP supply (only if Yearn holds this) |
| Av2-WBTC-LP | [`0x59C1427c658E97a7d568541DaC780b2E5c8affb4`](https://etherscan.io/address/0x59C1427c658E97a7d568541DaC780b2E5c8affb4) | LP supply (only if Yearn holds this) |

### Critical values / events to watch

| Item | Method | Threshold / Trigger | Frequency |
|---|---|---|---|
| HubPool paused state | `HubPool.paused()` | Any `true` → page oncall | Hourly |
| Per-pool reserves & exchange rate | `HubPool.pooledTokens(l1Token)` and `HubPool.exchangeRateCurrent(l1Token)` | Track `liquidReserves` vs Yearn position size; alert when `liquidReserves < Yearn LP size × 1.5` | Hourly |
| `HaircutReserves` event | HubPool event filter | **Any emission** → page oncall and assess impairment | On event |
| `SpokePoolAdminFunctionTriggered` event | HubPool event filter | Any emission → investigate (potential SpokePool upgrade) | On event |
| `BondSet`, `LivenessSet`, `IdentifierSet` events | HubPool event filter | Any emission → assess implications | On event |
| `RootBundleDisputed` event | HubPool event filter | Any emission → halt risk window, monitor UMA DVM outcome | On event |
| Safe owner / threshold changes | Watch `AddedOwner`, `RemovedOwner`, `ChangedThreshold` on the 3-of-5 Safe | Any change | On event |
| Liveness parameter | `HubPool.liveness()` | Alert if reduced below current 1800 (30 min) | Daily |
| Bond amount / token | `HubPool.bondAmount()`, `HubPool.bondToken()` | Alert if changed to a less-liquid token or reduced amount | Daily |
| TVL | DefiLlama `across` slug | Alert if 30-day change > ±50% | Daily |
| ACX governance controversy follow-up | Across forum, X | Material updates | Weekly |

**Monitoring implementation:**
1. Open a PR in [yearn/monitoring-scripts-py](https://github.com/yearn/monitoring-scripts-py) adding the Hub Pool Owner Safe to the safe-monitoring list.
2. Add a workflow that polls `HubPool.paused()` and the relevant `pooledTokens()` reserves hourly.
3. Add Tenderly alerts for the HubPool events listed above.
4. Configure a Telegram group with the SAM bot (@sam_alerter_bot) for paged events.

If on-chain queries are insufficient, fall back to DefiLlama for TVL and the Across forum / X for governance signals.

## Appendix: Contract Architecture

```
                        Yearn LP Position
                                │
                                ▼
              ┌──────────────────────────────────────┐
              │   Av2-*-LP tokens (ERC20)            │  ← deployed by LpTokenFactory
              │   WETH / USDC / USDT / DAI / WBTC    │     0x7dB6...fD9d (sole minter = HubPool)
              └──────────────────────────────────────┘
                                │ minted / burned 1:1
                                ▼
        ╔════════════════════════════════════════════════════╗
        ║  PROTOCOL LAYER (Ethereum L1)                      ║
        ║                                                    ║
        ║  HubPool (IMMUTABLE, NON-UPGRADEABLE)              ║
        ║  0xc186fA9143...8bEda                              ║
        ║    • addLiquidity / removeLiquidity                ║
        ║    • exchangeRateCurrent / pooledTokens            ║
        ║    • proposeRootBundle / executeRootBundleLeaves   ║
        ║    • haircutReserves      ← admin loss-write-down  ║
        ║    • relaySpokePoolAdminFunction ← cross-chain     ║
        ║                              admin to SpokePools   ║
        ║                                                    ║
        ║   ┌──────────────┐   ┌──────────────┐              ║
        ║   │ BondToken    │   │ ConfigStore  │              ║
        ║   │ (ABT)        │   │ (LP fees)    │              ║
        ║   │ 0xee1DC6...  │   │ 0x3B0350...  │              ║
        ║   └──────────────┘   └──────────────┘              ║
        ╚════════════════════════════════════════════════════╝
                  │                       │
                  ▼                       ▼
        ┌──────────────────┐    ┌──────────────────────────┐
        │ UMA Optimistic   │    │ Ethereum_SpokePool       │
        │ Oracle V3        │    │ 0x5c7BCd6E... (UUPS proxy)│
        │ 0xfb55F43f...    │    │ admin = HubPool          │
        │ identifier:      │    └──────────────────────────┘
        │ "ACROSS-V2"      │              │
        │ liveness: 1800s  │              │ relay via
        └──────────────────┘              │ ChainAdapters
                  │                       ▼
                  │              ┌─────────────────────────┐
                  │              │ SpokePools on Arbitrum, │
                  ▼              │ Optimism, Base, Polygon,│
        ┌──────────────────┐     │ zkSync, Linea, Blast,   │
        │ UMA DVM          │     │ World Chain, etc.       │
        │ (UMA tokenholder │     │ (all UUPS, admin=HubPool│
        │  vote)           │     │  via relaySpokePool-    │
        └──────────────────┘     │  AdminFunction)         │
                                 └─────────────────────────┘

        ╔════════════════════════════════════════════════════╗
        ║  GOVERNANCE LAYER                                  ║
        ║                                                    ║
        ║  Hub Pool Owner Gnosis Safe v1.3.0                 ║
        ║  0xB524735356985D2f267FA010D681f061DfF03715        ║
        ║  Threshold: 3-of-5    ← NO TIMELOCK                ║
        ║                                                    ║
        ║  Powers (all unilateral, no delay):                ║
        ║   • setPaused                                      ║
        ║   • haircutReserves                                ║
        ║   • relaySpokePoolAdminFunction (incl. upgrades)   ║
        ║   • disable pools / set bond / set liveness        ║
        ╚════════════════════════════════════════════════════╝
```

**Trust boundaries:**
- LP holders trust the 3-of-5 multisig to refrain from `haircutReserves` abuse and to refrain from upgrading SpokePools maliciously.
- LP holders trust UMA OOv3 + DVM to correctly resolve disputed bundles within the 30-minute liveness window (assisted by honest disputers always being online).
- LP holders trust the canonical L1↔L2 bridges of every connected chain to repatriate `utilizedReserves`.

---

## Risk Summary

### Key Strengths

- **HubPool is immutable** — the core LP-custody contract is not upgradeable, eliminating an entire class of upgrade-risk that affects most LP yield protocols.
- **LP NAV is 100% onchain and trivially verifiable** — `HubPool.exchangeRateCurrent(l1Token)` and `pooledTokens(l1Token)` give a complete picture; no oracle or off-chain attestation is needed.
- **~4 years live with zero direct bridge-contract exploit** at multi-billion-dollar cumulative volume.
- **Continuous OpenZeppelin audit coverage** from V1 through 2025 with high-severity findings resolved.
- **Atomic, permissionless LP redemption** at exchange rate (subject to per-pool `liquidReserves`).

### Key Risks

- **3-of-5 multisig with NO timelock** controls all admin actions, including `haircutReserves` (a function with no economic guardrail that directly writes down LP NAV) and cross-chain SpokePool UUPS upgrades.
- **All five signers are reportedly Risk Labs representatives** (per the Across Governance Operating Manual), with natural-person identities undisclosed — there is no externally-diversified safeguard against insider action.
- **Unresolved June 2025 ACX governance controversy** ($23M alleged misappropriation) attaches reputational risk to the same parties that hold the bridge keys.
- **30-minute liveness window** on the Optimistic Oracle assumes honest, always-online disputers; UMA DVM ultimate finality depends on UMA tokenholder economic security.
- **TVL collapsed 89% from Dec 2024 peak** ($249M → $28M as of May 12, 2026), well below the "$50M sustained" track-record threshold.
- **Sole-auditor concentration** (only OpenZeppelin).
- **Per-pool liquidity asymmetry** — at snapshot, the USDT pool had ~22× more inventory in flight than liquid, so a large LP exit on certain pools can revert until the next settlement cycle.
- **Root-bundle proposers are admin-gated** via the BondToken allowlist (same 3-of-5 Safe is the BondToken owner). Disputes are permissionless, but the canonical dataworker pipeline is centralized.

### Critical Risks

- **No timelock + powerful admin** (`haircutReserves`, cross-chain SpokePool upgrade authority) creates a clean single point of failure if 3 of 5 keys are compromised, coerced, or used in concert against LPs. There is no onchain delay for LPs to exit before a hostile action takes effect.

---

## Risk Score Assessment

**Scoring Guidelines:**
- Be conservative: when uncertain between two scores, choose the higher (riskier) one.
- Use decimals (e.g., 2.5) when a subcategory falls between scores.
- Prioritize onchain evidence over documentation claims.

### Critical Risk Gates

- [x] **No audit** — **PASS.** Seven OpenZeppelin audits 2023–2025.
- [x] **Unverifiable reserves** — **PASS.** Reserves fully onchain via `HubPool.pooledTokens(l1Token)`.
- [x] **Total centralization** — **PASS.** 3-of-5 multisig (not single EOA), though notably without timelock.

All gates pass; proceeding to category scoring.

### Category Scores

#### Category 1: Audits & Historical Track Record (Weight: 20%)

**Subcategory A: Audits & Security Reviews**

- Seven audits by a single reputable firm (OpenZeppelin), 2023–2025. One critical finding in Oct 2024 (resolved).
- Bug bounty: self-hosted, up to $1M max payout per docs.
- Sole-auditor concentration is meaningful given the protocol's complexity.
- Rubric match: between "2+ audits by reputable firms" (Score 2) and "1 audit by reputable firm" (Score 3) because all audits come from one firm. Bug bounty at $1M fits Score 2 ("max payout >$200K") — but not Score 1's "$1M" gate without confirmation that payout is escrowed.
- **Subcategory Score: 2.5**

**Subcategory B: Historical Track Record**

- ~4 years live (>2 years → Score 1 on time).
- Current TVL ~$28M (between Score 3 ">$10M" and Score 2 ">$50M"); peak was $249M but not sustained.
- Rubric match: time meets Score 1, TVL fits Score 3. Average to ~2.
- **Subcategory Score: 2.0**

**Category 1 Score = (2.5 + 2.0) / 2 = 2.25 ≈ 2.5**

#### Category 2: Centralization & Control Risks (Weight: 30%)

**Subcategory A: Governance**

- HubPool is immutable, but SpokePools are UUPS-upgradeable with the 3-of-5 multisig as admin.
- **3-of-5 multisig with NO timelock** matches Score 4 of the rubric ("Multisig 3/5 or low threshold" + "No timelock") directly.
- Privileged roles are powerful (`haircutReserves`, cross-chain admin) with no economic guardrail.
- Signers are reportedly all Risk Labs representatives (no external diversification) — additional half-point penalty.
- **Subcategory Score: 4.0**

**Subcategory B: Programmability**

- Bundle dispute / execution / refund are fully onchain and permissionless.
- Exchange rate is computed onchain by deterministic formula.
- **Bundle proposal is admin-gated:** the BondToken's `transferFrom` blocks bond posting into the HubPool unless the proposer is on an `onlyOwner` allowlist; the BondToken owner is the same 3-of-5 Hub Pool Owner Safe. Disputes remain permissionless. The 30-minute liveness window assumes honest disputers are online.
- Rubric match: bundle execution/dispute/refund and PPS calculation match Score 1 ("Fully programmatic"/"calculated onchain algorithmically"); admin-gated proposer pushes "system operations" toward Score 3 ("hybrid onchain/offchain operations"). Averaged across operations: Score ~2.5.
- **Subcategory Score: 2.5**

**Subcategory C: External Dependencies**

- UMA OOv3 (critical for dispute resolution).
- Canonical L1↔L2 bridges for every supported chain (critical for `utilizedReserves` repatriation).
- Rubric match: "Many or newer protocol dependencies" + "Critical functionality depends on them" → Score 4. UMA and the major canonical bridges are blue-chip, which softens it.
- **Subcategory Score: 3.5**

**Category 2 Score = (4.0 + 2.5 + 3.5) / 3 = 3.33 ≈ 3.3**

#### Category 3: Funds Management (Weight: 30%)

**Subcategory A: Collateralization**

- 100% onchain backing (per-pool `liquidReserves + utilizedReserves`).
- Collateral quality is excellent for the canonical 5 pools (WETH, USDC, USDT, DAI, WBTC).
- No over-collateralization buffer / safety module.
- Caveat: multisig CAN write down NAV via `haircutReserves` with no timelock. This is intended for true bridge-loss events but is unilaterally callable.
- Rubric match: "100% onchain collateral" + "blue-chip assets" + "real-time onchain verification" matches Score 1. Penalty for `haircutReserves` power and ~50% of capital sitting on L2s under canonical bridge trust → +0.5.
- **Subcategory Score: 1.5**

**Subcategory B: Provability**

- Fully onchain, anyone can verify in a single `eth_call`.
- Real-time programmatic exchange rate; no admin reporting needed.
- Rubric match: Score 1 ("Fully onchain, anyone can verify"; "Programmatic, real-time"; "Multiple verification sources" via UMA Optimistic Oracle).
- **Subcategory Score: 1.0**

**Category 3 Score = (1.5 + 1.0) / 2 = 1.25 ≈ 1.5**

#### Category 4: Liquidity Risk (Weight: 15%)

- Atomic 1:1 redemption against pool reserves — Score 1 on exit mechanism in normal conditions.
- Per-pool liquidity asymmetry: at snapshot the USDT pool had `utilizedReserves` 22× larger than `liquidReserves`, so a large redemption on that pool would revert until next settlement (~1.5h normally, potentially days during a stressed chain).
- DEX liquidity for LP tokens themselves is minimal; users must redeem via HubPool.
- Rubric match: "Direct redemption with minor delays" (Score 2) when liquid; degrades to "Withdrawal queues or restrictions" (Score 4) for pools running utilization > 100% on a given snapshot.
- Throttle-by-`liquidReserves` adds +0.5 per modifier.
- **Subcategory Score: 3.0** (averaging across pools and accounting for the implicit throttle).

#### Category 5: Operational Risk (Weight: 5%)

- Team partially doxxed via Risk Labs Foundation team page (Hart Lambur, Matt Rice, Melissa Quinn, etc.). UMA is the team's prior public protocol.
- Documentation is good and current.
- Legal: Cayman Islands Exempted Foundation Company (Cayman General Registry ID 339077, GLEIF LEI 984500B2DE6O0F0P5071, status ACTIVE/ISSUED).
- Negative weight from unresolved June 2025 ACX governance controversy.
- Rubric match: "Mostly public or known anons" + "Good, mostly complete" + "Established entity" matches Score 2; the unresolved governance controversy pushes toward Score 2.5.
- **Subcategory Score: 2.5**

### Final Score Calculation

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Audits & Historical | 2.5 | 20% | 0.50 |
| Centralization & Control | 3.3 | 30% | 0.99 |
| Funds Management | 1.5 | 30% | 0.45 |
| Liquidity Risk | 3.0 | 15% | 0.45 |
| Operational Risk | 2.5 | 5% | 0.125 |
| **Subtotal** | | | **2.52** |

**Optional Modifiers:**
- Protocol live >2 years with no incidents: **−0.5** (qualifies — ~4 years live, no bridge-contract exploit).
- TVL maintained >$500M for >1 year: **0** (does not qualify — peak was $249M and current is $28M).
- Unresolved June 2025 governance controversy involving the same parties that hold the HubPool multisig keys: **+0.5** (custom risk modifier; not in standard rubric but material to the centralization picture).
- No timelock on a multisig with `haircutReserves` + cross-chain upgrade authority: **+1.0** (custom risk modifier; the LP has no exit window if signers act adversely).

**Adjusted Final Score: 2.52 − 0.5 + 0.5 + 1.0 = 3.52 ≈ 3.5**

### Risk Tier

| Final Score | Risk Tier | Recommendation |
|------------|-----------|----------------|
| **1.0-1.5** | **Minimal Risk** | Approved, high confidence |
| **1.5-2.5** | **Low Risk** | Approved with standard monitoring |
| **2.5-3.5** | **Medium Risk** | Approved with enhanced monitoring |
| **3.5-4.5** | **Elevated Risk** | Limited approval, strict limits |
| **4.5-5.0** | **High Risk** | Not recommended |

**Final Risk Tier: Medium Risk** (at the upper boundary of the 2.5–3.5 range).

**Interpretation:** Across LP tokens represent a medium-risk integration target sitting on the boundary with Elevated Risk. The protocol's core technical design — immutable HubPool, fully onchain NAV, atomic permissionless redemption, four years without a bridge exploit — is genuinely strong. What pulls the score from Low Risk into Medium Risk is the governance configuration: a 3-of-5 multisig of related parties with no timelock, holding both the `haircutReserves` power on LP NAV and cross-chain SpokePool upgrade authority **and** the BondToken's proposer allowlist (so the canonical dataworker is admin-gated, not permissionless), against the backdrop of an unresolved June 2025 ACX-treasury controversy involving those same parties. The custom modifiers above reflect this concentration. Note: if a timelock were added between the multisig and the HubPool, and if the June 2025 governance issue were resolved through an external review or remediation, the score would naturally move back into Low Risk territory.

---

## Reassessment Triggers

- **Time-based:** Reassess in 6 months (by November 12, 2026).
- **TVL-based:** Reassess if Across protocol TVL crosses $100M upward or $10M downward.
- **Incident-based:** Reassess after any of:
  - Any `HaircutReserves` event on the HubPool.
  - Any SpokePool UUPS upgrade (watch for `SpokePoolAdminFunctionTriggered`).
  - Any change to the Hub Pool Owner Safe owners or threshold.
  - Any reduction in `liveness()` below 1800 seconds (30 min).
  - Any change in `bondToken()` or `bondAmount()`.
  - Any new postmortem in the Across forum or GitHub.
  - Material development in the June 2025 ACX governance controversy (legal action, external audit/review, or settlement).
- **Audit-based:** Reassess after any new external audit by a non-OpenZeppelin firm, or after any unresolved high/critical finding is closed.
