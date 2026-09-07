---
name: reviewing-risk-reports
description: Procedure for reviewing an existing Yearn risk report for factual correctness, evidence quality, unsupported claims, scoring consistency, and missing monitoring detail.
---

# Reviewing risk assessment reports

Reviews a report at `reports/report/<slug>.md` against the standard set by
`AGENTS.md` (evidence rules), `reports/README.md` (scoring framework),
`reports/TEMPLATE.md` (required sections), and `reports/SKILL.md` (investigation
procedure).

**Report findings; do not rewrite** unless explicitly asked to apply
corrections.

## What to check

### Evidence and sourcing

- Unsupported claims, or material claims with no source link.
- Stale, ambiguous, or low-quality sources — a docs page asserting something the
  chain contradicts, a dashboard with no timestamp, a dead link.
- **Truncated onchain identifiers quoted without a link to the full one.** A
  bare `` `0xABCD…EF12` `` is unverifiable. The link target must be the full
  checksummed address on the correct explorer; the display form may stay
  compact. Same rule in `src/data/bridges.json` `detail` strings.
- Claims that something "doesn't exist" without the checklist in
  `reports/SKILL.md` § *The "doesn't exist" checklist* having been run —
  especially **liquidity venues**, which is where it is skipped. "No secondary
  market" with only Uniswap checked is a finding.
- Missing `TODO` markers where information is genuinely unavailable. A confident
  sentence covering a gap is worse than an explicit `TODO`.

### Onchain facts

- Incorrect contract addresses, owners, roles, multisig thresholds, chain IDs,
  deployment details, or protocol parameters.
- Proxy implementations and proxy admins that no longer match.
- Facts asserted from documentation that should have been verified with `cast`
  or Etherscan (`reports/onchain/SKILL.md`).
- Mint authority: does the enumeration cover every role-holder, and does it
  reconcile with the `mints` edges in `reports/graph/<slug>.yaml`?
- Supply vs reserves: does the collateral located actually account for total
  supply (`reports/SKILL.md` § Pass 1.5)?

### Governance and multisig

Apply the rule in `reports/SKILL.md` § *Governance and multisig documentation*.
Flag:

- A multisig documented without its **threshold and owner count**.
- A multisig whose signer set is not characterized as **publicly named or
  anonymous** — that property is a scoring input, and leaving it unstated reads
  as unchecked.
- Signer **overlap between nominally independent Safes** in the governance path
  that the report leaves for the reader to discover by diffing address lists.
- Attempts to **deanonymize** individuals behind anonymous signer addresses —
  out of scope, and not evidence.

Do **not** flag a report merely for listing signer addresses. Enumerating the
signer set is correct and expected in a new assessment; anonymity and signer
overlap have both moved final scores in this repo. The narrower rule — refresh
threshold and count only, without re-deriving identities — applies to
*reassessments* (`reports/reassessment/SKILL.md`), not to new reports.

### Scoring and structure

- Inconsistent risk-tier reasoning: a category score the section's own evidence
  does not support, or a final score that does not follow from the weighted
  categories.
- Critical gates not checked, especially the unverified-source gate.
- A `Status:` field missing or wrong for an exception report (`GATED` keeps the
  numeric score; `HACKED` / `DEAD` use `Final Score: N/A`).
- The whole `Risk Tier` table present, with the final tier bolded.
- Required template sections missing.

### Monitoring

- Missing monitoring addresses, data-fetching functions, or threshold
  suggestions.
- Reassessment triggers that are absent, vague, or not actually observable.

### Companion artifacts

- Does `reports/graph/<slug>.yaml` exist, and does it match the report's
  contracts, allocations, and mint authority?
- If the report depends on a bridge, is it recorded in `src/data/bridges.json`
  (`reports/bridges/SKILL.md`)? `npm run check-bridges` reports mentions that
  are not listed.

## Output

Return **findings first, ordered by severity**. For each finding give:

- file path and section
- the specific claim at issue
- evidence (an onchain read, a link, a contradicting source)
- a concrete correction

Separate confirmed errors from things you could not verify; say which is which
rather than merging them into one list.
