# Protocol Risk Assessment Template

## Overview + Links

Explain in short what protocol does, usage and yield sources. Add links to docs.

## Audits and Due Diligence Disclosures

List audits and verify there are no critical problems. How complex is the onchain smart contract architecture?

### Bug Bounty

Link to bug bounty program and reward amount. Note the platform (Immunefi, Code4rena, HackerOne) and maximum payout tier.

## Historical Track Record

- How long has the protocol been in production?
- Past security incidents or exploits?
- How were past incidents handled? (Response time, communication, user reimbursement)
- TVL history and stability
- Any historical peg deviations or depegging events?
- Team's track record with previous projects

## Funds Management

- Is the protocol delegating the funds to another protocol/s?
- Do we have a due diligence document for those protocols?
- How will we monitor any changes in the funds' delegation?

### Accessibility

- Who can mint the token? Anyone or whitelisted addresses?
- Is minting atomic in a single transaction? (e.g., depositing USDC and receiving xUSDC in the same tx)
- Redemption mechanics: Who can redeem? Any restrictions?
- Are there any fees, rate limits, or cooldown periods for minting/redeeming?
- Slippage considerations during entry/exit

### Collateralization

- Is it collateralized on-chain? For example, does a user deposit USDC to mint xUSD?
- What is the collateral quality?
- Which assets can be used as collateral?
- What are the over-collateralization ratios?
- What are the maintenance ratios for those collaterals?
- Are liquidations on-chain?
- Peg stability mechanisms in place?
- Does the system require risk curation for its CDP? (e.g., setting max mintable caps, adjusting maintenance margins, modifying liquidation thresholds, etc.) If yes, who manages these?
- If the system is not programmatic and funds are controlled by an EOA, multisig, or custodian, are the possible actions on those funds explicitly disclosed by the team?
  For example:
  - Are funds used to open ETH short positions on Binance?
  - Are funds used as collateral to borrow rETH/wstETH?
- What are the reserves used for? Are they deployed into risk-free, medium-risk, or high-risk strategies? For example, depositing the collateral ETH into the Yearn WETH vault is low risk, while depositing it into Aave and borrowing USDC against it is high risk.
- Does the team provide attestations or audits for the off-chain components?

### Provability

- How easy is it to prove that the token's reserves exist where the documentation claims they are?
- If the token has a yield-bearing component, how easy is it to calculate the on-chain yield?
- Can anyone compute it, or only parties with off-chain information?
- How does the on-chain reporting work? Does it rely on a privileged admin role to update an "exchange rate" (e.g., increasing a yield-bearing token's rate or reserves in general), or does it compute values on-chain/off-chain in a transparent way?
- If collateral is off-chain, how transparent is the team? Are funds held in exchange accounts or custody wallets? Are the expected actions of those wallets explicitly stated? (e.g., "Off-chain funds are used exclusively to open ETH shorts on Binance; nothing else.")
- Merkle proof systems for off-chain reserves? Are they implemented?
- Real-time attestations vs periodic reporting? How frequently are reserves verified?
- Third-party verification mechanisms? (Chainlink PoR, custodian attestations, etc.)

## Liquidity Risk

- What is the exit liquidity for the token?
- On-chain liquidity depth across different DEXes
- Slippage analysis for different redemption sizes
- Redemption mechanisms: Direct (1:1 with collateral) vs market-based?
- Are there withdrawal queues or delays?
- Historical liquidity during market stress periods
- Can large holders exit without significant price impact?

## Centralization & Control Risks

### Governance

- Are the contracts upgradable? Define the owner, multisig or timelock.
- Is it a multisig with at least an N/M threshold? Timelock delay?
- Are there privileged roles in the smart contracts capable of causing serious harm to token holders? (e.g., A privileged minter who can mint infinite tokens in a 1:1 model or a yield-bearing wrapper whose exchange rate is fully dependent on an admin's arbitrary input)
- Can governance pause, freeze, or seize user funds?
- What powers do governance/admin roles have?

### Programmability

- How programmatic is the system? For example, **BOLD** is fully programmatic—every calculation and reserve is on-chain and openly verifiable. In contrast, **rUSD** is not fully programmatic because its rate is provided by a privileged role calling a contract function with their chosen input. Basically how much is it handled by smart contracts like DeFi should be.
- If it protocol relies on vaults, how is PPS (price per share) defined? In code or offchain accounting?
- Is the oracle upgradeable? Who can upgrade it?
- Are there off-chain dependencies for critical functions? (e.g., keepers, relayers, backends)

### External Dependencies

- What external protocols does this protocol depend on? (e.g., Chainlink oracles, Curve pools, Aave lending markets)
- How critical are these dependencies? Would failure of a dependency break core functionality?
- What oracle systems are used? Multiple sources or single point of failure?
- Are there fallback mechanisms if dependencies fail?
- Does the protocol hold positions in other protocols? (e.g., LP tokens, lending positions)
- Cross-chain dependencies? Bridge risks?
- Centralized infrastructure dependencies? (RPC nodes, indexers, APIs)

## Operational Risk

- Team transparency: Are team members public? Anon?
- Documentation quality: Complete, clear, and maintained?
- Communication channels: Discord, Twitter, forum? Response times?
- Development activity: Active development? Regular updates?
- Community engagement: Size and quality of community
- Legal structure: DAO, foundation, company? Jurisdiction?
- Incident response plan: Documented? Previously tested?

## Monitoring

- Add monitoring for crucial parts of the protocol: governance and backing is mandatory. Open PR in Yearn monitoring repository: https://github.com/yearn/monitoring-scripts-py
- For Safe multisig monitoring add address to following file: https://github.com/yearn/monitoring-scripts-py/blob/main/safe/main.py
- For Timelock monitoring, define address and ask team members to add Tenderly alerts.
- Create telegram group specific to protocol that is monitored. Invite Telegram SAM bot: @sam_alerter_bot
- Define how often Github Actions must be triggered, hourly or daily, and the script to one of the following workflow files: https://github.com/yearn/monitoring-scripts-py/tree/main/.github/workflows
