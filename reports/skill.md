---
name: generating-risk-reports
description: List of actions, guidelines and tools used for generating risk assessment reports for protocols and assets.
allowed-tools: Read Write Edit Grep Glob Bash(git:*) Bash(gh:*) Bash(cast:*) Bash(curl:*) Bash(uv:*)
---

# Generating risk assessment reports

- Always mark sections as "TODO" if information is unavailable or not found, never assume anything.
- Follow instructions in `reports/README.md`.
- Try to validate onchain code against the protocol's GitHub repository.
- Before starting, pull latest `master`.
- When the report is ready, open a draft pull request with a concise summary, source notes, and validation notes.
- Every new risk report must include a matching dependency graph at `reports/graph/<slug>.yaml`; follow `reports/graph/SKILL.md`.
- Never trust protocol documentation alone. Use docs to understand the intended architecture, then verify claims onchain when possible.
- Back every material claim with a valid link. This includes contracts, transactions, governance records, protocol docs, dashboard/API data, TVL values, and allocation data.
- Actively search for hidden or indirect fund-loss paths for end users: privileged minting, upgradeable implementations, proxy admins, oracle control, role escalation, pause/blacklist paths, redemption gates, offchain custody, fee switches, strategy migration controls, and dependency failure modes.

## Pre-Assessment: Architecture First

Before writing any claims about a protocol, complete these steps in order:

### Pass 1: Architecture Mapping
1. **Read the protocol's GitHub README** — understand the contract architecture, what components exist, and how they relate. Browse the repo directory structure (`src/`, `contracts/`, etc.).
2. **For every contract in the address table, fetch and review its ABI** — use Etherscan or `cast`. Look for references to other contracts (factory → deployed markets, kernel → tranches, vault → strategies). List all public functions.
3. **Read protocol documentation** (gitbook, docs site) — understand the claimed architecture, fund flow, and governance before verifying onchain. Documentation is not evidence by itself.
4. **Draw a contract architecture diagram** — map all layers (vault, strategy, factory, markets, governance, underlying protocols). This diagram goes in the report as an appendix. Do this FIRST, not last.
5. **Trace the fund flow end-to-end onchain** — follow the money from user deposit to final yield source. Check token balances, look at who holds what.

### Pass 1.5: Supply vs Reserves Reconciliation

Before writing any collateralization claims, complete this arithmetic check:

1. **Get the token's total supply** — `cast call <token> "totalSupply()(uint256)"`
2. **Locate ALL contracts holding backing collateral** — do NOT rely on contract labels ("treasury", "vault"). Check token balances (wstETH, WBTC, USDC, etc.) across every known protocol contract: pools, managers, treasuries, routers, keepers. Protocols often migrate architectures (V1 → V2) and collateral custody may move to new contracts.
3. **Sum the USD value of all located collateral** and compare to total supply. If `total collateral found < total supply`, you are missing collateral locations — keep searching before writing the report.
4. **Compute the actual system-wide CR** = total collateral USD / total debt USD. Do not report per-market CRs as the system CR — they can be misleading (e.g. a legacy market with $8K at 12,000% CR and $0 in the main pool).
5. **Cross-check with DeFi Llama TVL** — if your collateral total diverges significantly from reported TVL, investigate the gap.

This step must pass before proceeding. A mismatch between supply and reserves is a red flag that the architecture mapping (Pass 1) is incomplete.

### Pass 1.6: Mint Authority Enumeration

Before writing the *Token Mint Authority* section of the report (defined in `reports/TEMPLATE.md`), enumerate every address that can mint the assessed token. Patterns to check, in order:

1. **AccessControl-based tokens** (most modern protocols, OpenZeppelin):
   - Read the token's source on Etherscan and grep for `onlyRole(...)` modifiers on `mint` / `burn` functions. Note every role name involved (`MINTER_ROLE`, `RECEIPT_TOKEN_MINTER`, custom names).
   - For each role, enumerate holders: `getRoleMemberCount(role)` and then `getRoleMember(role, i)` for `i = 0..count-1`. Patterns documented in `reports/etherscan/SKILL.md` § "Role & permission enumeration".
   - Examples: InfiniFi `RECEIPT_TOKEN_MINTER` (4 holders), Cap `AccessControl` (via `0x7731…c683`).

2. **Whitelist-mapping tokens** (Liquity-fork style):
   - Read `mintList(address)` for known protocol contracts.
   - Iterate `addToMintList` / `removeFromMintList` events to find every address ever granted, then check current state.
   - Worked example: `reports/report/mezo-musd.md` lines 67–80.

3. **Ownable tokens**: read `owner()` — that single address can mint via `mint(...)`. Classify owner (EOA, multisig, contract).

4. **Bridge-managed tokens**: read the bridge controller address (Wormhole NTT Manager, LayerZero OFT/OFT-Adapter, CCIP token pool, etc.). It typically holds the only mint authority on the destination chain. Confirm by reading the token's `mint` function for the access check.
   - **Always segment the bridge model — this is a material risk difference, so verify it, never assume:**
     - **Bridge mints the native token** (`mint`): the bridge controller itself holds mint/burn authority on the *canonical* token. A bridge compromise mints **unbacked native supply and dilutes every holder, including on mainnet**. Worked examples: Midas mHYPER — the LayerZero OFT adapter `0x148c…81a0` holds `M_HYPER_MINT_OPERATOR_ROLE` (`reports/report/midas-mhyper.md`); Paxos USDG — the `OFTWrapper` is Supply Controller SC3 with a 45M USDG mint capacity (`reports/report/paxos-usdg.md`).
     - **Bridged representation** (`lock`): the canonical token is locked/escrowed on its origin chain and the remote token is only a bridged claim. Blast radius is bounded by remote supply plus the locked collateral. Worked example: Sky USDS — the OFT Adapter locks USDS and **does not hold `wards` on USDS**, so it cannot mint native (`reports/report/sky-usds.md`).
     - **Underlying transport** (`transport`): the protocol bridges an *underlying* asset (e.g. USDC via CCTP) to remote strategies; the assessed token is not bridged at all. Exposure is funds in transit. Worked example: `reports/report/yearn-yvusd.md`.
   - To tell them apart, check whether the bridge contract holds mint authority on the native token — e.g. `wards(<adapter>)` (Sky-style), `hasRole(MINTER_ROLE, <adapter>)` / the role enumeration in this pass, or the token's supply-controller table. State the model and the evidence explicitly in the report, **and record the adapter address** — several reports named a bridge without one, forcing later re-derivation.
   - **Finding the adapter — do not conclude "no bridge" from these alone.** The most common LayerZero shape is a **plain ERC-20 on mainnet + a separate OFT Adapter + a native OFT on the remote chain**. Three checks that look authoritative but miss it:
     - *"The mainnet token isn't an OFT"* (`endpoint()` reverts) — expected under this shape; the adapter is a different contract.
     - *LayerZero's public OFT registry* (`https://metadata.layerzero-api.com/v1/metadata/experiment/ofts/list`) — useful when it hits, but **incomplete** (it lists Resolv, but not Cap or InfiniFi).
     - *DeFiLlama `chains`* — tracks **protocol TVL by chain, not token deployments**; it reported "Ethereum only" for protocols whose token was live on Katana.
     Instead, work **backwards from the remote chain**: find the token on the destination explorer (a same-address CREATE2/vanity deployment is a strong hint), confirm it is an OFT (`oftVersion()`, `endpoint()`), then read `peers(<origin eid>)` (Ethereum = `30101`) to get the mainnet adapter. Verify with `adapter.token()`, `adapter.endpoint()` (canonical LZ V2 `EndpointV2` = `0x1a44076050125825900e736c501f859c50fE728c`), and the escrowed `balanceOf(adapter)`.
   - **Check every bridge family, not just one.** A negative LayerZero result is not a negative bridge result: also check Chainlink CCIP (`TokenAdminRegistry.getPool(token)` on Ethereum = `0xb22764f98dD05c789929716D677382Df22C05Cb6`, then the pool's `typeAndVersion()` — `LockRelease…` ⇒ `lock`, `BurnMint…` ⇒ `mint`), Circle CCTP, and the AggLayer/LxLy unified bridge (`PolygonZkEVMBridgeV2` `0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe`, same address on every connected chain; `getTokenWrappedAddress(0, <mainnet token>)` on the destination reveals a canonical wrapper).

5. **For every role-holder address**, classify it in the *Notes* column of the mint table: EOA, multisig (with threshold + named-vs-anonymous signers), or specific contract (with its purpose, e.g. "MintController — entry-point proxy for user deposits"). If a role-holder is itself a multisig, also document its threshold and signer set.

6. **Cross-check against the dependency-graph** (if a YAML exists at `reports/graph/<slug>.yaml`): every mint-authority contract should appear as a node with a `mints` edge (direction: `minter → token`) connecting to the assessed token. The `mints` edge kind renders red and is reserved for privileged supply-creation authority. If your enumeration finds an address that the graph doesn't, the graph is incomplete; if the graph shows a `mints` edge from an address that you can't reproduce onchain, the graph is wrong. Absence of `mints` edges means the token has no privileged minter (permissionless ERC-4626, collateral-only mint, etc.) — also a valid and important visual signal.

### Pass 2: Verification and Scoring
Only after architecture mapping, supply reconciliation, and mint-authority enumeration are complete, proceed to verify each component onchain and write risk assessments.

### "Doesn't Exist" Checklist
Before writing any claim that functionality is missing, unverifiable, or doesn't exist onchain, confirm ALL of the following:
- [ ] Searched the GitHub repo for the functionality
- [ ] Checked all known contract ABIs for related functions
- [ ] Read the protocol documentation about how this is supposed to work
- [ ] Checked factory/deployer contracts for related deployments or events
- [ ] Checked onchain event logs for related contract creation

If any answer is "no," use **"unverified"** not **"doesn't exist."**

## Risk

- If you need to validate risk of layer 2 or bridge, check it out on: https://l2beat.com/scaling/risk
- LlamaRisk has good reports on the risk of protocols and assets: https://www.llamarisk.com/research
- See if asset or protocol is reviewed by Steakhouse, check their reports: https://kitchen.steakhouse.financial/archive
- When validating protocols, see for info on which focused on protocol decentralization: https://www.defiscan.info/
- Always include whole `Risk Tier` table and bold the final risk tier.
- Treat an unverified contract source as a triggered critical gate (score 5, the first gate): if the assessed contract — or its implementation behind a proxy — is not source-verified on a public block explorer, it fails the gate. Verify via Etherscan `getsourcecode` / `cast` (see `reports/etherscan/SKILL.md`).
- Set the header `Status:` field for exception reports (see `reports/TEMPLATE.md`): `GATED` keeps the numeric score (gate-capped, still live), while terminal states `HACKED`/`DEAD` use `Final Score: N/A` and render off the scale under "Not Rated". Omit `Status:` for normal reports.
- Explain how minting and redeeming works, if present. Verify whether the operations are atomic and whether minting requires backing — flag any path that lets an admin mint unbacked tokens as a high-risk finding. Full mint-authority enumeration (every role-holder, with classification) goes into the *Token Mint Authority* section of the report; the procedure is in Pass 1.6 above.
- Treat any path that can move, dilute, freeze, trap, or misprice user funds as a possible end-user loss path, even if it is not described as such in docs.

## Tools

- Use Foundry to fetch blockchain data; focus on `cast`. Docs: https://www.getfoundry.sh/cast
- Use RPC URLs from `.env`. For Ethereum mainnet, use `RPC_1` first and `RPC_2` as fallback. For other chains, use the chain-specific `RPC_<chain_id>` variable when available, for example `RPC_8453` for Base.
- For Python scripts, use `scripts/env.py` to load `.env` and resolve RPC/API-key aliases: call `load_repo_env()` once, then `get_rpc_url(chain_id)` or `get_explorer_api_key(name)`. Do not reimplement `.env` path walking or env-var fallback lists in report scripts.
- Use Etherscan to fetch blockchain data; usage is defined in `reports/etherscan/SKILL.md`.
- For fetching TVL, use the DeFiLlama API. Docs: https://api-docs.defillama.com/ or use script: `uv run reports/scripts/fetch_defillama_tvl.py [protocol]`
- If you use some script multiple times, add it to the `reports/scripts` folder but first ask for permission before committing it.
- Check `.env` for environment variables and secrets. If you cannot access `.env`, stop early and report the blocker.

### Fetching JS-rendered / doc-host sources (Notion, Google Docs)

Issue links often point to Google Docs and Notion. `WebFetch` only sees the static HTML shell of these (content is rendered client-side or behind a login), so it returns an empty/login page. Use the host's data endpoint instead — no browser needed. (Playwright is usually a dead end here: the sandbox lacks Chromium's system libraries and `apt`/`python3-venv` to install them.)

**Google Docs** (works when the doc is link-shared "anyone with the link"):
```bash
# Extract the file id from the URL .../document/d/<FILE_ID>/edit
curl -sL "https://docs.google.com/document/d/<FILE_ID>/export?format=txt" -o /tmp/doc.txt
# Verify it's the real doc, not an auth wall:
grep -qi "accounts.google\|sign in" /tmp/doc.txt && echo "LOGIN WALL — needs auth/MCP" || echo "OK"
```
`export?format=txt` gives clean text; `format=html` preserves structure. If it returns a login page the doc is private — fall back to the Google Drive MCP (ask the user to authenticate) or ask them to paste/export it.

**Notion** (works for public/published pages, including `*.notion.site` custom domains):
```bash
# URL ends in ...-<32-hex-pageid>. Hyphenate it into a UUID:
#   328723f942ca80adb0a0ced3adf5a0b8 -> 328723f9-42ca-80ad-b0a0-ced3adf5a0b8
curl -s "https://<subdomain>.notion.site/api/v3/loadCachedPageChunkV2" \
  -H "Content-Type: application/json" \
  --data '{"page":{"id":"<UUID>"},"limit":300,"cursor":{"stack":[]},"verticalColumns":false}' \
  -o /tmp/page.json
```
Parse the JSON in Python. **Gotcha:** the block value is double-nested — read `recordMap.block[id]["value"]["value"]` (not `["value"]`). Walk the page's `content` array recursively; the human text of each block is `properties.title`, a list of rich-text segments `[[ "text", ... ], ...]` — join `seg[0]`. Map `type` to markdown (`header`→`#`, `sub_header`→`##`, `bulleted_list`→`- `, etc.). If a fresh request comes back as skeleton blocks (no `value`), retry — Notion sometimes returns a cached chunk first.

**GitBook docs** (e.g. `*.gitbook.io`): two tricks.
- Append `.md` to any page URL to get clean markdown instead of the rendered HTML: `https://<proj>.gitbook.io/<space>/<page>.md`.
- Many GitBook sites expose a built-in Q&A endpoint — GET the page's `.md` URL with an `ask=<natural-language question>` query param, and it returns a direct answer plus sourced excerpts (look for an "Agent Instructions / Querying This Documentation" note on the site confirming it's enabled):
  ```bash
  curl -sL --get "https://<proj>.gitbook.io/<space>/<page>.md" \
    --data-urlencode "ask=List every audit: firm, date, scope, and report link."
  ```
  Great for filling gaps without reading every page (audits, params, governance). Caveats: it only knows what's in the docs *text* — content locked inside linked PDFs/files (e.g. audit firm names) won't be returned. The docs root is often behind a Cloudflare bot-challenge; if `curl` returns a "Just a moment…" page, target a specific sub-page, retry, or use `WebFetch`.

For all of these: treat the extracted text as documentation (claims to verify), and **always reconcile against on-chain state** — docs can be stale or describe a superseded design.

## Post-Assessment

- After the report is finalized, generate or update the contract dependency graph YAML at `reports/graph/<slug>.yaml`; procedure defined in skill `generating-dependency-graphs` in `reports/graph/SKILL.md`. The graph publishes to `/graph/<slug>/` and is auto-linked from the report page when the YAML exists.
- The report task is not ready for draft PR until the graph exists and `npm run build` validates both the report page and graph schema, unless the graph cannot be produced from available information. If graph data is unavailable, explain why and mark the missing graph facts as `TODO`.
- **Bridge dependencies:** if the assessed asset/protocol depends on a cross-chain bridge or messaging layer (LayerZero / OFT, Chainlink CCIP, Circle CCTP, AggLayer / LxLy (Katana), Wormhole, Axelar, Stargate, etc.), record it in `src/data/bridges.json` so it appears on the `/bridges/` page. Add the report's `slug` under the matching bridge with `kind: "direct"` (the assessed asset itself bridges through it) or `kind: "indirect"` (it depends on something else that does), a `model` (`mint` / `lock` / `transport` — the segmentation defined in Pass 1.6 item 4; use `unknown` only if genuinely unverified, which the checker warns on), plus a short `integration` and `detail`. If the bridge isn't listed yet, add a new bridge object (`id`, `name`, `type`, `url`, `description`, `keywords`), inserted in alphabetical order by `name` (the checker enforces this). The build runs `scripts/check_bridges.mjs`, which (a) fails if a dependency `slug` has no report, and (b) warns when a report mentions a bridge keyword but isn't listed — resolve every warning by either adding the dependency or adding the slug to that bridge's `ignore` list (for genuine non-dependency mentions). Run `npm run check-bridges` to enforce zero unreviewed mentions.
