---
name: generating-risk-reports
description: Procedure for producing a new or substantially updated Yearn risk assessment report, from architecture mapping through onchain verification to scoring.
---

# Generating risk assessment reports

Use the [agent guide](../../../AGENTS.md) for evidence, environment, and workflow;
[scoring framework](../../../reports/README.md) and
[template](../../../reports/TEMPLATE.md) define the output and scoring rules.
Create `reports/report/<slug>.md`.

## Investigation

1. **Map architecture before scoring.** Read the protocol repository and docs,
   inspect verified source/ABIs for contracts in the address table, and follow
   references through factories, strategies, markets, and governance. Draw the
   contract architecture appendix and trace deposits to the final yield source.
2. **Reconcile supply and backing.** Locate collateral across all known protocol
   contracts, including migrated deployments. Normalize decimals and value both
   liabilities and collateral in the same units; use share conversion where
   relevant. Compute system-wide collateral/debt, not a legacy market's ratio,
   and investigate discrepancies with DeFiLlama TVL. A shortfall may mean missing
   custody locations, actual undercollateralization, or unavailable offchain
   evidence: establish which, or mark the gap `TODO`. Do not assume all deficits
   are undiscovered collateral.
3. **Enumerate mint authority and control.** Follow
   [onchain verification](../verifying-onchain-data/SKILL.md). Trace every mint
   entrypoint and caller-side restriction, including who can grant roles or
   upgrade implementations. Explain mint/redemption backing requirements and atomicity.
   Apply the [multisig standard](../verifying-onchain-data/references/governance.md).
4. **Investigate cross-chain exposure** using the
   [bridge skill](../assessing-bridge-dependencies/SKILL.md) when the asset or
   its underlying dependencies cross chains.
5. **Verify and score each component** against the template after mapping its
   fund and control paths. Include monitoring addresses, getters, thresholds,
   and observable reassessment triggers. Cross-check relevant independent
   research: [L2BEAT](https://l2beat.com/scaling/risk),
   [LlamaRisk](https://www.llamarisk.com/research),
   [Steakhouse](https://kitchen.steakhouse.financial/archive), and
   [DefiScan](https://www.defiscan.info/).

## Negative claims and liquidity

Before claiming a function or deployment does not exist, check repository code,
known ABIs, protocol docs, factories/deployers, and creation events. An incomplete
search supports “unverified,” not “doesn't exist.”

Before claiming no secondary market or exit exists:

- Check Uniswap V3 fee tiers (100 / 500 / 3000 / 10000), V2, Curve StableSwap-NG
  and Twocrypto, Balancer, and relevant chain-specific venues.
- Inspect material token holders for pools or vaults missed by venue searches.
  If reconstructing holders from `Transfer` events, scan the full history and
  confirm current balances.
- Quote executable exits at several sizes (`get_dy`, `quoteExactInputSingle`);
  pool TVL alone is not depth. Check LP concentration separately: available
  liquidity may be controlled by protocol insiders and removable.

## Tools and completion

For TVL, use `uv run reports/scripts/fetch_defillama_tvl.py <slug>`.
Read [source-fetching recipes](references/fetching-sources.md) only when a linked
Google Doc, Notion page, or GitBook page cannot be retrieved normally.

Create or update the [dependency graph](../generating-dependency-graphs/SKILL.md).
