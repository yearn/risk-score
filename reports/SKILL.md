---
name: generating-risk-reports
description: Procedure for producing a new or substantially updated Yearn risk assessment report, from architecture mapping through onchain verification to scoring.
---

# Generating risk assessment reports

Produces a report at `reports/report/<slug>.md` from `reports/TEMPLATE.md`.

Read first: the evidence rules and workflow in `AGENTS.md` (never assume, verify
onchain, link every claim, link the full form of every truncated identifier),
and the scoring framework in `reports/README.md`. This skill covers the
investigation procedure those rules apply to.

Related skills: `verifying-onchain-data` (`reports/onchain/SKILL.md`) for role
and mint-authority enumeration, `assessing-bridge-dependencies`
(`reports/bridges/SKILL.md`) when the asset crosses chains,
`generating-dependency-graphs` (`reports/graph/SKILL.md`) for the graph every
new report must ship with.

## Order of work

Architecture first. Do not write a risk claim about a component you have not
yet mapped — most bad findings in this repo's history trace to scoring a
protocol whose shape was only half understood.

1. **Pass 1** — map the architecture and trace the fund flow.
2. **Pass 1.5** — reconcile supply against reserves.
3. **Pass 1.6** — enumerate mint authority.
4. **Pass 2** — verify each component and write the assessment.

Passes 1.5 and 1.6 are gates: a failure there means Pass 1 is incomplete, and
the fix is more mapping, not a hedged sentence in the report.

## Pass 1: Architecture mapping

1. **Read the protocol's GitHub README** — understand the contract
   architecture, what components exist, and how they relate. Browse the repo
   directory structure (`src/`, `contracts/`, etc.).
2. **For every contract in the address table, fetch and review its ABI** — via
   Etherscan or `cast`. Look for references to other contracts (factory →
   deployed markets, kernel → tranches, vault → strategies). List all public
   functions.
3. **Read the protocol documentation** (gitbook, docs site) — understand the
   claimed architecture, fund flow, and governance before verifying onchain.
4. **Draw a contract architecture diagram** — map every layer (vault, strategy,
   factory, markets, governance, underlying protocols). This goes in the report
   as an appendix. Do it FIRST, not last.
5. **Trace the fund flow end-to-end onchain** — follow the money from user
   deposit to final yield source. Check token balances; look at who holds what.

## Pass 1.5: Supply vs reserves reconciliation

Before writing any collateralization claim, complete this arithmetic:

1. **Get total supply** — `cast call <token> "totalSupply()(uint256)"`.
2. **Locate ALL contracts holding backing collateral.** Do NOT rely on contract
   labels ("treasury", "vault"). Check token balances (wstETH, WBTC, USDC, …)
   across every known protocol contract: pools, managers, treasuries, routers,
   keepers. Protocols migrate architectures (V1 → V2) and custody moves with
   them.
3. **Sum the USD value of all located collateral** and compare to total supply.
   If `collateral found < supply`, you are missing collateral locations — keep
   searching before writing the report.
4. **Compute the system-wide CR** = total collateral USD / total debt USD. Do
   not report a per-market CR as the system CR — they mislead badly (e.g. a
   legacy market holding $8K at 12,000% CR while the main pool holds $0).
5. **Cross-check against DeFiLlama TVL.** A significant divergence is a signal
   to investigate, not to annotate.

A mismatch between supply and reserves is a red flag that Pass 1 is incomplete.

## Pass 1.6: Mint authority enumeration

Before writing the *Token Mint Authority* section (defined in
`reports/TEMPLATE.md`), enumerate every address that can mint the assessed
token. The onchain mechanics — role hashing, `getRoleMember` iteration,
`RoleGranted` log walking, Liquity-style mint lists — are in
`reports/onchain/SKILL.md`. Patterns to work through, in order:

1. **AccessControl tokens** (most modern protocols). Read the token source and
   grep for `onlyRole(...)` on `mint` / `burn`. Note every role name involved
   (`MINTER_ROLE`, `RECEIPT_TOKEN_MINTER`, custom names), then enumerate
   holders of each. Examples: InfiniFi `RECEIPT_TOKEN_MINTER` (4 holders), Cap
   (via its `AccessControl` root).
2. **Whitelist-mapping tokens** (Liquity-fork style). Read `mintList(address)`
   for known protocol contracts, then iterate `addToMintList` /
   `removeFromMintList` events to find every address ever granted and check
   current state. Worked example: `reports/report/mezo-musd.md`.
3. **Ownable tokens.** Read `owner()` — that single address can mint. Classify
   it (EOA, multisig, contract).
4. **Bridge-managed tokens.** A bridge can hold mint authority directly or
   authenticate a downstream controller that holds it. **Always segment the
   model — `mint` vs `lock` vs `transport` is a material risk difference, so
   verify it, never assume**, and never conclude "no bridge" from a single
   negative check. Full procedure, including how to find an OFT adapter that
   the obvious checks miss: `reports/bridges/SKILL.md`.
5. **Classify every role-holder** in the *Notes* column: EOA, multisig (with
   threshold and signer count), or a specific contract with its purpose
   ("MintController — entry-point proxy for user deposits"). See *Governance
   and multisig documentation* below for how far to take the multisig case.
6. **Cross-check against the dependency graph** at `reports/graph/<slug>.yaml`.
   Every mint-authority contract should appear as a node with a `mints` edge
   (direction: `minter → token`). If your enumeration finds an address the
   graph lacks, the graph is incomplete; if the graph shows a `mints` edge you
   cannot reproduce onchain, the graph is wrong. No `mints` edges at all is a
   valid and important signal — permissionless ERC-4626, collateral-only mint.

## Governance and multisig documentation

Multisig composition is a scoring input, not trivia: anonymity, signer overlap
between nominally independent Safes, and signers that hold other privileged
roles have all changed final scores in this repo. Document it accordingly, and
apply the same rule in every skill.

**In a new assessment, record:**

- Threshold and owner count (`getThreshold()`, `getOwners()`).
- Whether the signer set is **publicly named or anonymous** — this is the
  scoring-relevant property, and an unstated one reads as an unchecked one.
- Signer addresses when they are **material**: overlap with another Safe in the
  governance path, a signer that also holds a named role, or a signer that is a
  contract rather than an EOA. Show the overlap; do not make the reader diff
  two address lists.

**Do not** attempt to deanonymize individuals behind anonymous signer
addresses. "Anonymous, 5 EOAs, 4 of 5 on hardware wallets per protocol docs" is
a complete finding; a name hunt is out of scope and is not evidence.

**In a reassessment**, refresh threshold and owner count only. Do not re-derive
the named/anonymous determination unless the threshold or the owner set
changed — see `reports/reassessment/SKILL.md`.

## The "doesn't exist" checklist

Before writing that functionality is missing, unverifiable, or absent onchain,
confirm ALL of:

- [ ] Searched the GitHub repo for the functionality
- [ ] Checked all known contract ABIs for related functions
- [ ] Read the protocol documentation on how this is supposed to work
- [ ] Checked factory/deployer contracts for related deployments or events
- [ ] Checked onchain event logs for related contract creation

If any answer is "no", write **"unverified"**, not **"doesn't exist"**.

### This applies to liquidity venues, and that is where it gets skipped

Before writing "no secondary market", "illiquid", or "no exit exists", check
**all** of:

- [ ] Uniswap V3 factory `getPool(tokenA, tokenB, fee)` across **every** fee
      tier (100 / 500 / 3000 / 10000), and V2 `getPair`
- [ ] **Curve** — StableSwap-NG and Twocrypto factories both
- [ ] Balancer, and any chain-specific venue
- [ ] **The token holder list as a catch-all** — enumerate `Transfer` events,
      compute balances, identify every contract holding a material share. Any
      pool, lending market or vault holding the token surfaces here regardless
      of venue. This single query subsumes the ones above
- [ ] Measure depth with `get_dy` / `quoteExactInputSingle` at several sizes
      rather than quoting pool TVL

A real case: an earlier revision of `reports/report/flying-tulip.md` asserted
ftUSD had "no secondary market at any size" after checking only the two Uniswap
factories. It missed a Curve StableSwap-NG pool holding ~$1.87M that clears
$500K at 0.30%, and the error propagated into a Liquidity subscore and a "the
peg cannot be market-tested" claim. The holder-list check would have caught it
in one query.

**Then check who provides the liquidity you found.** In the same report the
Curve pool turned out to be ~100% one EOA behind a gauge whose `manager` was a
protocol admin signer — available, but not the independent third-party market
the first pass implied. Depth is a fact about the pool; durability is a fact
about its LPs, and the two need separate sentences.

## Scoring

Scoring categories, weights, and the 1–5 rubric live in `reports/TEMPLATE.md`
and `reports/README.md`. Rules specific to writing the assessment:

- **Always include the whole `Risk Tier` table** and bold the final tier.
- **Unverified source is a triggered critical gate** (score 5, the first gate):
  if the assessed contract — or its implementation behind a proxy — is not
  source-verified on a public explorer, it fails. Verify with Etherscan
  `getsourcecode` / `cast` (`reports/onchain/SKILL.md`).
- **Set the header `Status:` field for exception reports** (see
  `reports/TEMPLATE.md`). `GATED` keeps the numeric score (gate-capped, still
  live); terminal states `HACKED` / `DEAD` use `Final Score: N/A` and render off
  the scale under "Not Rated". Omit `Status:` for normal reports.
- **Explain minting and redemption** where present. Verify whether the
  operations are atomic and whether minting requires backing. Any path that
  lets an admin mint unbacked tokens is a high-risk finding.
- **Cross-check external risk research** where it exists: L2BEAT for L2/bridge
  risk, LlamaRisk and Steakhouse for protocol and asset reports, DefiScan for
  decentralization staging. Links in `AGENTS.md`.

## Tools

Onchain reads, `.env` conventions, and `scripts/env.py` usage are in
`AGENTS.md`. Beyond those:

- **Etherscan role/permission enumeration:** `reports/onchain/SKILL.md`.
- **TVL:** DeFiLlama API (<https://api-docs.defillama.com/>) or
  `uv run reports/scripts/fetch_defillama_tvl.py [protocol]`.
- **Reusable scripts** go in `reports/scripts/` — ask before committing one.

### Fetching JS-rendered sources

Issue links often point at Google Docs, Notion, or GitBook. `WebFetch` sees
only the static shell of the first two and returns an empty or login page. Use
the host's data endpoint instead — no browser needed.

**Google Docs** (link-shared "anyone with the link"):

```bash
# File id from .../document/d/<FILE_ID>/edit
curl -sL "https://docs.google.com/document/d/<FILE_ID>/export?format=txt" -o /tmp/doc.txt
grep -qi "accounts.google\|sign in" /tmp/doc.txt && echo "LOGIN WALL" || echo "OK"
```

`format=txt` gives clean text; `format=html` preserves structure. A login page
means the doc is private — ask for an export rather than guessing at contents.

**Notion** (public and published pages, including `*.notion.site`):

```bash
# URL ends in ...-<32-hex-pageid>. Hyphenate into a UUID:
#   328723f942ca80adb0a0ced3adf5a0b8 -> 328723f9-42ca-80ad-b0a0-ced3adf5a0b8
curl -s "https://<subdomain>.notion.site/api/v3/loadCachedPageChunkV2" \
  -H "Content-Type: application/json" \
  --data '{"page":{"id":"<UUID>"},"limit":300,"cursor":{"stack":[]},"verticalColumns":false}' \
  -o /tmp/page.json
```

Parse in Python. **Gotcha:** the block value is double-nested — read
`recordMap.block[id]["value"]["value"]`, not `["value"]`. Walk the page's
`content` array recursively; each block's human text is `properties.title`, a
list of rich-text segments `[["text", ...], ...]` — join `seg[0]`. Map `type` to
markdown (`header`→`#`, `sub_header`→`##`, `bulleted_list`→`- `). If a fresh
request returns skeleton blocks with no `value`, retry — Notion sometimes serves
a cached chunk first.

**GitBook** (e.g. `*.gitbook.io`) — two tricks:

- Append `.md` to any page URL for clean markdown:
  `https://<proj>.gitbook.io/<space>/<page>.md`.
- Many GitBook sites expose a Q&A endpoint — GET the `.md` URL with an
  `ask=<question>` param for a direct answer plus sourced excerpts:

  ```bash
  curl -sL --get "https://<proj>.gitbook.io/<space>/<page>.md" \
    --data-urlencode "ask=List every audit: firm, date, scope, and report link."
  ```

  Useful for filling gaps without reading every page. It only knows the docs
  *text* — content inside linked PDFs (often the audit firm names) is not
  returned. The docs root is often behind a Cloudflare challenge; if `curl`
  returns "Just a moment…", target a sub-page or use `WebFetch`.

Treat everything extracted this way as documentation — claims to verify, and
always reconcile against onchain state.

## Post-assessment

1. **Dependency graph.** Generate or update `reports/graph/<slug>.yaml` per
   `reports/graph/SKILL.md`. It publishes to `/graph/<slug>/` and is auto-linked
   from the report page once the YAML exists.
2. **Bridge index.** If the asset or protocol depends on a bridge or messaging
   layer, record it in `src/data/bridges.json` per `reports/bridges/SKILL.md`
   so it appears on `/bridges/`.
3. **Validate.** `npm run build` must pass, covering both the report page and
   the graph schema. Run `npm run check-bridges` to enforce zero unreviewed
   bridge mentions.

The task is not ready for a draft PR until the graph exists and the build
validates it — unless the graph genuinely cannot be produced from available
information, in which case explain why and mark the missing facts `TODO`.
