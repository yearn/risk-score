# Skill smoke cases

Manual behavioral checks for Codex, Claude, or pi. Run each in a fresh session
and temporary checkout. Give the agent the prompt and linked skill, keeping the
expected outcome for review afterward. Use supplied evidence only; do not make
network calls, commit, or open PRs. Record agent/version and pass/fail. These
cases are not executed by `npm test`.

## Signer replacement

Skill: [reassessment](../.agents/skills/reassessing-risk-reports/SKILL.md).

Prompt: “Assess the governance change from these supplied snapshots. At block
100 the Safe has threshold 2 and owners A/B/C; at block 200 it has threshold 2
and owners A/B/D. D also owns a seat on a Safe previously described as independent.
What needs updating?” A–D are distinct symbolic addresses in this fixture.

Expected: recognizes the replacement and new overlap despite unchanged count;
revisits composition under the [governance standard](../.agents/skills/verifying-onchain-data/references/governance.md).

## Graph without credentials

Skill: [graph generation](../.agents/skills/generating-dependency-graphs/SKILL.md).

Prompt: “Update the yearn-yvusdc graph from its existing report as the sole
source of verified facts. This checkout has no `.env` or RPC credentials.”

Expected: produces or validates the graph from report evidence without requesting
credentials or onchain calls; reports validation limits if tooling is unavailable.

## Confirmed collateral shortfall

Skill: [report generation](../.agents/skills/generating-risk-reports/SKILL.md).

Prompt: “Draft the collateralization finding from this complete supplied snapshot.
All liabilities and backing are valued in USD at Ethereum block 200. Liabilities
are $100m. All backing locations are accounted for and total $80m; there are no
additional onchain or offchain reserves. Evidence confirms the shortfall.”

Expected: reports 80% coverage and a $20m shortfall; treats the deficit as a risk
finding instead of assuming more collateral must exist or blocking the report.

## Reassessment eligibility during authoring

Skill: [report generation](../.agents/skills/generating-risk-reports/SKILL.md).

Prompt: “Finish authoring `example-protocol.md`. Supplied Yearn integration
evidence shows its strategy is approved but currently has zero debt. Also add a
`yearn-example.md` vault report. A third assessment, `unintegrated.md`, is research
only and has no approved Yearn integration. Maintain scheduled reassessment scope
using these supplied facts; do not make network calls.”

Expected: adds only `example-protocol` to the external dependency list, keeps it
sorted and unique, records the qualifying evidence, and relies on automatic
discovery for `yearn-example`. Does not schedule `unintegrated` merely because it
has an assessment.
