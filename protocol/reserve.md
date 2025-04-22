# Reserve Protocol

## Documentation & Resources

- [Website](https://reserve.org/)
- [Documentation](https://reserve.org/protocol/)
- [RTokens](https://reserve.org/protocol/rtokens/)
- [RSR](https://reserve.org/protocol/reserve_rights_rsr/)
- [LlamaRisk](https://www.llamarisk.com/research/rtoken-risk-ethplus)

## Protocol Analysis

The Reserve protocol is the platform that allows for the permissionless creation of asset-backed, yield-bearing & overcollateralized stablecoins on Ethereum.

Examples:

- [ETH+](https://app.reserve.org/ethereum/token/0xe72b141df173b999ae7c1adcbf60cc9833ce56a8/overview)
- [bsdETH](https://app.reserve.org/base/token/0xcb327b99ff831bf8223cced12b1338ff3aa322ff/overview)

### RToken

RToken is the generic name for a stablecoin that gets created on top of the Reserve Protocol. RTokens are fully asset-backed by any combination of ERC-20 tokens and can be protected against collateral default by Reserve Rights (RSR) staking. Each RToken is governed separately.

The RToken platform is a tool to aggregate relatively stable assets together to create basket-backed stablecoins. Governance can update the basket configuration regularly. When the current basket is updated, or in the case of a default, the protocol makes onchain trades to reach the new basket composition.

Today, the main use-cases we see are (1) a more decentralized USD-backed coin, which reduces dependence on any one fiatcoin issuer, and (2) a single simple USD-based coin that packages the yield of DeFi protocols.

### Reserve Rights (RSR)

Reserve Rights (RSR) exists as an overcollateralization mechanism to protect RToken holders in the unlikely event of a collateral token default. In order for RSR holders to provide this overcollateralization, they can decide to stake on any one RToken, or divide their RSR tokens by staking on multiple RTokens. RSR holders can also decide not to stake their RSR at all.

RSR can be staked on a particular RToken, where it has two roles:

- Staked RSR receives a portion of the RToken collateral’s revenue in exchange for being the first capital-at-risk in the case of collateral default.
- Staked RSR proposes and votes on changes to the RToken’s configuration.

#### Staking RSR

When RSR is staked, it is actually at stake. Staked RSR can be seized by the protocol in the event of a collateral token default, in order to cover losses for RToken holders. It is seized pro-rata if this happens.

An important component of the design involves recapitalization. The system strives for full redeemability, which requires an equal value of wstETH, rETH, and sfrxETH, i.e. the underlying collateral basket. In case of a significant depeg affecting any collateral asset (as reported by price feed oracles), a default is triggered. This initiates an auction to sell the defaulted collateral for the emergency ETH+ collateral (set to WETH). Any shortfall that results will be recapitalized by auctioning off RSR in stRSR for the required amount of WETH.

Un-staking RSR comes with a delay, which is configurable by governance, and predicted to usually be between about 7 and 30 days. This delay is necessary so that in the event of a default, the staked RSR will remain in the staking contract for long enough to allow the RToken to seize any RSR it needs to cover losses. During the unstaking delay period, the staker does not earn any rewards but is still slashable.

#### Governance

The Reserve team has deployed a recommended governance system for RTokens (Reserve Governor Anastasius) that will be suggested to RToken deployers by default. This governance system is a slightly modified version of OpenZeppelin Governor.

A timelock component is introduced once a proposal is approved. This adds a configurable delay between the approval of a proposal and its execution, which allows RToken holders to make a decision before something is changed.

By default, the end-to-end process for approving & executing proposals is 8 days.

In addition to the Owner role, each RToken has several additional assignable roles: the Pauser, the Short Freezer, the Long Freezer, and the Guardian—which can be given to any Ethereum addresses by the RToken deployer/owner. Each has the ability to put their RToken’s system into certain states in the case of an attack, exploit, or bug.

### Redemption

Redemptions of RToken are permissionless and immediate if the cumulative total of withdrawals exceed both throttles over a rolling hour. Note that the collateral basket is protocol owned, making a share of the underlying basket redeemable by anyone in possession of RToken. The protocol redeems RToken for an equal value of the constituent collateral types, weighted by the target weighting of the basket. Although it may not be fully redeemable at all times. This is the case immediately after a basket change or a collateral default.

### Collateral Price

Each collateral has an associated plugin address that contains a price feed from an external oracle source and is referenced during the above mentioned protocol action to ensure accurate pricing of the collateral assets. The plugin addresses can be replaced by governance and are currently set to the optimal available oracles for all collateral assets. This generally involves a Chainlink feed where possible, although not all oracles have access to a Chainlink feed.

## Monitoring

- Timelock contract for governance actions (governance votes are available on Reserve website)
- The redemption price: [`basketNeeded`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8#readProxyContract#F9) / [`totalSupply`](https://etherscan.io/address/0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8#readProxyContract#F22)  in the RToken contract. Undercollateralized if the ratio is less than 1.
- The exchange rate between RSR and StRSR, example [eth+RSR](https://etherscan.io/address/0xffa151Ad0A0e2e40F39f9e5E9F87cF9E45e819dd#readProxyContract#F16). Falling ratio could indicate the risk for RToken.
- Bonus: Pauser, Freezer and Guardian roles.
