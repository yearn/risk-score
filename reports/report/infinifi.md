# Protocol Risk Assessment: InfiniFi

## Overview + Links

InfiniFi is a stablecoin protocol that allows users to deposit assets (USDC, USDT, USDe, sUSDe) to mint iUSD, a stablecoin pegged to the US Dollar. The protocol automatically deploys deposited collateral into various DeFi yield strategies (Aave, Fluid, Pendle, Ethena) to generate returns.

The protocol offers three tiers of tokens:

1. **iUSD**: The base stablecoin (deposit receipt). Not yield bearing directly but liquid.
2. **siUSD**: Staked iUSD. Yield-bearing and liquid (can be exited via secondary markets).
3. **liUSD**: Locked iUSD. Highest yield, governance power, but locked for 1-13 weeks. Serves as "first loss" capital.

**Links:**

- [Protocol Documentation](https://docs.infinifi.xyz/)
- [Protocol App](https://infinifi.xyz/)
- [Protocol Analytics](https://stats.infinifi.xyz/)
- [GitHub](https://github.com/InfiniFi-Labs/infinifi-protocol)
- [Audits](https://docs.infinifi.xyz/audits)

## Contract Addresses

- **iUSD (Token)**: `0x48f9e38f3070AD8945DFEae3FA70987722E3D89c`
- **siUSD (Token)**: `0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB`
- **Liquid Farms (Instant Liquidity)**:
  - **Fluid USDC**: `0x1484d6C834Ac99B9E50B17e57F85C8603F65657A` (~$21.53M)
  - **Euler Sentora USDC**: `0x6FBc446f25Ab5141C4F7E7711E52DFc0AdA407A5` (~$7.50M)
  - **Aave v3 Horizon**: `0x817d93DbdFd8190bbef0a73fCf5Dd9DA5A87E032` (~$5.00M)
  - **Spark USDC Vault**: `0xd880D7C5CaFdbE2AEc281250995abF612235e563` (~$1.88M)
  - **Aave**: `0xbFd5FC8DecA3C6128bfCE0FE46c25616811c3580` (~$1.88M)
- **Team Multisig**: `0x80608f852D152024c0a2087b16939235fEc2400c`

## Audits and Due Diligence Disclosures

InfiniFi had security audits by Certora, Spearbit, Cantina.

- **Certora**: Formal Verification & Security Assessment (March-May 2025). Report published June 4, 2025.
- **Spearbit**: Conducted a prior audit.
- **Cantina**: InfiniFi held a public audit/bug bounty competition on **Cantina** in April 2025 with a reward pool of ~$40,000 ($35k + $5k).

### Bug Bounty

- [Bug Bounty Program](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591)

## Historical Track Record

- **Production History**: The protocol launched in June 2025 with a points program beginning June 1, 2025, designed to reward participation during its six month launch phase.
- **TVL**: $177.69M. (03.02.26)
- **Incidents**: No reported security incidents or exploits found.
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed into "liquid DeFi platforms" (AAVE, Fluid) and fixed yield strategies (Pendle, Ethena).
- **Asset Allocation**: As of February 2026, $37.78M (21%) is held in Liquid Farms (instant withdrawal available) and $139.91M (79%) in Illiquid Farms (locked maturity).
- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Minting**: Users deposit supported assets (USDC, USDT, USDe, sUSDe) to mint iUSD.
- **Redemption**:

  - **Instant**: Users can instantly redeem iUSD for USDC as long as there is sufficient liquidity in the _Liquid Farms_ (currently ~$37.78M). No queue, whitelisting not required, anyone can redeem. When this reserve is depleted, there will be a FIFO queue.

  - **Queue**: If liquid reserves are depleted, redemption requests enter a **FIFO Queue**. Pending requests are fulfilled as capital is unwound from illiquid strategies or new deposits enter.
  - **Whitelisting**: No whitelist for redemption; anyone holding iUSD can redeem or enter the queue.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Off-chain Risks**: The strategies mentioned (Aave, Fluid, Pendle, Ethena, Maple) are mostly on-chain, though Maple involves institutional lending which carries off-chain credit risk.
- **Token Breakdown**: 115.07M siUSD (Staked), 43.34M liUSD (Locked), 24.86M iUSD (Liquid/Unstaked).

### Provability

- **Transparency**: Reserves and allocations are verifiable on-chain.
- **Reserves**: $37.78M in liquid reserves.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: $3.3M on-chain DEX liquidity. Instant redemptions against the $37.78M liquid reserve.
  - **Coverage**: The $37.78M liquid reserve fully covers the circulating unstaked iUSD supply (24.86M).
    - **siUSD**: The holders of siUSD can exit with this flow: siUSD --> iUSD --> USDC.
    - **liUSD**: Locked (1-13 weeks) but represented by a transferable ERC20 token, allowing for potential secondary market exit.
- **Withdrawal Queues**: "Only time there'd be a queue is if there was a mass withdrawal event & these funds depleted." The protocol manages this via the liability ladder and keeping significant liquid reserves.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
    - _Timelock_: Changes to capital allocation parameters (e.g., Farm Registry updates) use the **Short Timelock** (1 day delay).
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
    - _Scope_: Adding a new protocol to the allowlist requires a governance vote and must pass through the **Short Timelock** (1 day delay).
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Timelocks**:

  - **Long Timelock (7 days)**: Used for critical changes like granting roles. (`0x3D18480CC32B6AB3B833dCabD80E76CfD41c48a9`)
  - **Short Timelock (1 day)**: Used for routine tasks like fee adjustments, farm registry updates, and adding new protocols to the allowlist. (`0x4B174afbeD7b98BA01F50E36109EEE5e6d327c32`)

    Long Timelock (7 days) - GOVERNOR role:
    enableBucket, setMaxLossPercentage
    setAddress (gateway)
    setAfterMintHook, setBeforeRedeemHook
    setYieldSharing
    enableAsset, disableAsset
    setLendingPool
    setSafeAddress
    emergencyAction

    Short Timelock (1 day) - PROTOCOL_PARAMETERS role:
    setBucketMultiplier
    setMinAssetAmount
    setSafetyBufferSize, setPerformanceFeeAndRecipient, setLiquidReturnMultiplier, setTargetIlliquidRatio
    setCap, setMaxSlippage
    addFarms, removeFarms
    setEnabledRouter, setPendleRouter
    setCooldown
    setAssetRebalanceThreshold

    Short Timelock (1 day) - ORACLE_MANAGER role:
    setOracle
    setPrice

    Note: All timelock actions require 4/7 multisig approval before being scheduled.

- **Emergency**: The `GOVERNOR` role can bypass delays via `emergencyAction()`.
- **Capabilities**: Timelocks can execute arbitrary calls (`execute`, `executeBatch`), grant/revoke roles, schedule actions, and pause/unpause the system.

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
  Every action has to go through multisig prior to anything being scheduled.
  So the flow here is : 1. msig + 2. timelock

Oracle timelock management

- PROPOSER_ROLE (keccak256("PROPOSER_ROLE"))
  - Can propose new actions in timelocks
  - Assigned to: 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1
- EXECUTOR_ROLE (keccak256("EXECUTOR_ROLE"))
  - Can execute actions in timelocks after their delay
    -Assigned to: 0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63
- **Oracle Updates**: Oracles are upgradeable via governance (**Short Timelock**).

### External Dependencies

- **Dependency**: Heavily dependent on the performance and security of **Aave, Fluid, Pendle, and Ethena**. A failure in any of these protocols would result in losses (absorbed first by liUSD).
- **Stablecoins**: Dependent on USDC, USDT, USDe, sUSDe pegs.

## Operational Risk

- **Team**: InfiniFi Labs.
- **Documentation**: Comprehensive documentation available at [docs.infinifi.xyz](https://docs.infinifi.xyz/).
- **Communication**: Active community and governance structure.

## Monitoring

- **Governance**: Monitor changes to the "Allowlist" and Msig and Timelock actions.
- **TVL**: Monitor TVL.
- **Reserves**: Monitor the liquid reserve ratio in the Liquid Farms (currently ~$37.78M).
- **Contract Addresses**:
  - **Gateway**: `0x3f04b65Ddbd87f9CE0A2e7Eb24d80e7fb87625b5` (Proxy)
  - **RedeemController**: The Gateway delegates redemption logic to the `RedeemController` (retrieved via `getAddress("redeemController")`).
- **Monitoring**:
  - **Redemptions**: Monitor the `Redeem` event in the `RedeemController` contract.
  - **Liquidity**: The `RedeemController` holds the redemption funds (asset tokens). Its `liquidity()` function reports available assets.
  - **Queue**: Monitor the `totalEnqueuedRedemptions` variable in the `RedeemController` to track the backlog of iUSD waiting for exit.

## Risk Score

### 1. Audits & Historical Track Record (Score: 2.5)

- **Audits**: Decent coverage (Certora Formal Verification, Spearbit, Cantina Public Contest).
- **History**: <1 year in production (Launch Mid 2025).
- **Bounty**: Active ($100k).
- _Score rationale_: Audits but short history.

### 2. Centralization & Control Risks (Score: 3.0)

- **Governance**: 2.5. Separation of powers (Allocators vs Verifiers vs Vetoers) is a strong design. 5 entity Vetoer council is a centralized safeguard.
- **Programmability**: 3. Active management of allocations by Allocators.
- **Dependencies**: 3.5. Exposure to multiple external protocols (Aave, Fluid, Pendle, Ethena).

### 3. Funds Management (Score: 1.5)

- **Collateralization**: 1.5. 100% on-chain DeFi assets. "First loss" tranches (liUSD) protect iUSD.
- **Provability**: 1.5. Verifiable on-chain,
- _Score rationale_: Solid backing model with risk tranche protection.

### 4. Liquidity Risk (Score: 2.0)

- **Exit**: Instant redemptions for iUSD.
- **Depth**: $37.8M liquid reserves fully cover the 24.86M circulating iUSD. $3.5M DEX liquidity provides secondary exit.
- _Score rationale_: Strong primary liquidity (reserves > floating supply).

### 5. Operational Risk (Score: 2.5)

- **Team**: InfiniFi Labs.
- **Docs**: Above average quality.
- _Score rationale_: Standard for anon DeFi teams.

### Calculation

$$
\text{Final Score} = (3.0 \times 0.3) + (1.5 \times 0.3) + (2.5 \times 0.2) + (2.0 \times 0.15) + (2.5 \times 0.05)
$$

$$
\text{Final Score} = 0.9 + 0.45 + 0.5 + 0.3 + 0.125 = 2.275
$$

**Final Score: 2.3**

## Risk Tier: Low/Medium Risk

InfiniFi is a stablecoin model with a strong focus on risk segmentation (liUSD absorbing first losses). The main risks are from its short operational history (<1 year) so not yet really battle tested and the compounded smart contract risk of its underlying strategies (Pendle, Ethena, etc.).
