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

## Audits and Due Diligence Disclosures

InfiniFi had security audits by Certora, Spearbit, Cantina.

- **Certora**: Formal Verification & Security Assessment (March-May 2025). Report published June 4, 2025.
- **Spearbit**: Conducted a prior audit.
- **Cantina**: InfiniFi held a public audit/bug bounty competition on **Cantina** in April 2025 with a reward pool of ~$40,000 ($35k + $5k).

### Bug Bounty

- [Bug Bounty Program](https://cantina.xyz/bounties/509e46d0-a107-43aa-b46e-b2fe7e2ea591)

## Historical Track Record

- **Production History**: The protocol launched in June 2025 with a points program beginning June 1, 2025, designed to reward participation during its six month launch phase.
- **TVL**: $183.27M. (26.01.26)
- **Incidents**: No reported security incidents or exploits found.
- **Peg Stability**: iUSD is designed to be redeemable 1:1. Users can mint iUSD against deposits.

## Funds Management

The protocol acts as an asset manager, deploying user funds into other protocols.

- **Strategy**: Funds are deployed into "liquid DeFi platforms" (AAVE, Fluid) and fixed yield strategies (Pendle, Ethena).
- **Asset Allocation**: As of Jan 2026, $34.90M (19%) is held in Liquid Farms (instant withdrawal available) and $148.37M (81%) in Illiquid Farms (locked maturity).
- **Risk Hierarchy**: Losses are socialized based on a "liability ladder":
  1. liUSD (Locked) holders take the first loss.
  2. siUSD (Staked) holders take the next loss.
  3. iUSD (Stablecoin) holders are the last to be affected.

### Accessibility

- **Minting**: Users deposit supported assets (USDC, USDT, USDe, sUSDe) to mint iUSD.
- **Redemption**: iUSD redemptions for USDC are "instant" via the liquid reserves ($34.90M).
- **Fees/Limits**: Not explicitly detailed, but "Self-Laddering Engine" manages duration risk.

### Collateralization

- **Backing**: iUSD is backed by the assets deployed in the underlying strategies.
- **Verification**: The protocol uses a "Self-Laddering Engine" to match asset duration with liability duration (locked periods).
- **Off-chain Risks**: The strategies mentioned (Aave, Fluid, Pendle, Ethena, Maple) are mostly on-chain, though Maple involves institutional lending which carries off-chain credit risk.
- **Token Breakdown**: 115.07M siUSD (Staked), 43.34M liUSD (Locked), 24.86M iUSD (Liquid/Unstaked).

### Provability

- **Transparency**: Reserves and allocations are verifiable on-chain.
- **Reserves**: $34.90M in liquid reserves.

## Liquidity Risk

- **Exit Liquidity**:
  - **iUSD**: $3.3M on-chain DEX liquidity. Instant redemptions against the $34.90M liquid reserve.
  - **Coverage**: The $34.90M liquid reserve fully covers the circulating unstaked iUSD supply (24.86M).
    - **siUSD**: The holders of siUSD can exit with this flow: siUSD --> iUSD --> USDC.
    - **liUSD**: Locked (1-13 weeks) but represented by a transferable ERC20 token, allowing for potential secondary market exit.
- **Withdrawal Queues**: "Only time there'd be a queue is if there was a mass withdrawal event & these funds depleted." The protocol manages this via the liability ladder and keeping significant liquid reserves.

## Centralization & Control Risks

### Governance

The governance system is split into three branches to check and balance power:

1.  **Allocators (Active Management)**: Decide "How much" capital goes to specific strategies. They cannot route funds to arbitrary addresses.
2.  **Verifiers (Token Holders - liUSD)**: Vote to approve the "Allowlist" of safe protocols.
3.  **Vetoers (Guardians)**: A council of 5 entities. A single Vetoer can block any new protocol or product. This acts as a safety brake.

- **Timelocks**: Not explicitly detailed, but the Vetoer system implies immediate stopping power.

### Programmability

- **Hybrid Model**: The "Self-Laddering Engine" algorithmically matches asset duration with liability duration. "Allocators" actively manage the amount of capital deployed to specific allowlisted strategies.
- **Oracle**: Protocol uses Chainlink price feeds for asset pricing to maintain the 1:1 mint ratio and calculate collateral value.
- **Oracle Upgradeability**: Oracles are upgradable via governance.

### External Dependencies

- **Critical**: Heavily dependent on the performance and security of **Aave, Fluid, Pendle, and Ethena**. A failure in any of these protocols would result in losses (absorbed first by liUSD).
- **Stablecoins**: Dependent on USDC, USDT, USDe, sUSDe pegs.

## Operational Risk

- **Team**: InfiniFi Labs.
- **Documentation**: Comprehensive documentation available at [docs.infinifi.xyz](https://docs.infinifi.xyz/).
- **Communication**: Active community and governance structure.

## Monitoring

- **Governance**: We can monitor changes to the "Allowlist" and Allocator decisions.
- **Backing**: We can monitor the total value of assets in strategies vs total iUSD supply.
- **Reserves**: We can monitor the liquid reserve ratio in the redemption contract. Which is currently $34.9M

## Risk Score

### 1. Audits & Historical Track Record (Score: 2.5)

- **Audits**: Decent coverage (Certora Formal Verification, Spearbit, Cantina Public Contest).
- **History**: <1 year in production (Launch ~Mid-2025).
- **Bounty**: Active ($100k).
- _Score rationale_: Strong audits but short history.

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
- **Depth**: $34.90M liquid reserves fully cover the 24.86M circulating iUSD. $3.3M DEX liquidity provides secondary exit.
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
