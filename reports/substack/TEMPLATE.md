# Substack Article Template

Use this template to structure every Substack newsletter article generated from a risk assessment report.

---

## Article Structure

```markdown
# [Protocol Name]: Risk Assessment Deep Dive

*Published by Yearn Curation | [Month Day, Year]*

![Hero image: [Protocol Name] risk score [X.X] - [Risk Tier]](images/hero.png)

[1-2 opening paragraphs, no heading. Lead with the verdict: what is this
protocol, what does it score, and what risk tier does that place it in? State
the single biggest strength and the single biggest risk. Keep each paragraph to
2-3 sentences — this section is what most readers see in the Substack preview.]

## What Is [Protocol Name]?

[2-3 short paragraphs (2-4 sentences each). Explain the protocol to someone who
hasn't used it:
- What it does and how it generates yield
- When it launched and current TVL
- Key backing or partnerships
- Link to the protocol's app/site

Weave metrics naturally into prose — don't list them as bullets.]

## Security Profile

[2-3 short paragraphs. Transform the audit table into narrative:
- Number and quality of audits, name the firms
- Bug bounty program and maximum payout
- Historical incidents with honest context
- Smart contract complexity in plain terms]

## How Your Funds Are Managed

[2-3 short paragraphs from a depositor's perspective:
- What happens when you deposit (what token do you get back?)
- Where do funds actually go? (strategies, protocols, yield sources)
- How withdrawals work — instant or delayed? Typical wait times?

End the section with a pointer to the architecture diagram:

> For the full contract and fund-flow picture, see **Appendix A** below.]

![Score breakdown showing category scores and final weighted result](images/score-table.png)

## Centralization and Control

[2-3 short paragraphs on governance:
- Who can upgrade contracts? What protections exist (timelocks, multisig)?
- How are day-to-day operations handled? (operator roles, automation)
- What's the worst a privileged actor could do, and how quickly?

Frame as a spectrum, quantify protections. End with:

> The full control chain — who can do what, and on what delay — is laid out in
> **Appendix B**.]

## Dependencies and Risks

[1-2 short paragraphs on external dependencies:
- What other protocols does this depend on? (oracles, underlying assets)
- What's the concentration risk?
- What happens if a dependency fails?

End with:

> See **Appendix C** for the full dependency graph.]

## Liquidity: Can You Get Out?

[1-2 short paragraphs from the user's exit perspective:
- How do you withdraw? Is it atomic or queued?
- What slippage should you expect at various sizes?
- Any withdrawal fees or lock-up periods?]

## The Bottom Line

[2-3 short paragraphs to synthesize:
- Clear recommendation: suitable for allocation?
- Key strengths that support the score
- Key risks that limit it
- One-sentence final assessment]

---

## Appendix

### A. Contract Architecture

[1-2 sentences describing the diagram: vault proxy, implementation, external
contracts that actually hold funds, and the deposit/withdraw path.]

![Contract architecture: deposit and fund flow through vault proxy, implementation, and external protocols](images/architecture.png)

### B. Governance and Control Chain

[1-2 sentences describing who is at each level and the delay between them.]

![Governance chain: token holders, governor, timelock, admin actions](images/governance.png)

### C. External Dependencies

[1-2 sentences naming the critical vs. non-critical dependencies.]

![Protocol dependency graph: critical and supporting external protocols](images/dependency.png)

---

*This assessment is part of Yearn's ongoing curation work. For the complete
technical report — including contract addresses, detailed scoring rubrics,
and monitoring setup — visit the
[full report on curation.yearn.fi](https://curation.yearn.fi/report/[slug]).*
```

---

## Image Placement

Five images anchor the article — two in the main flow, three in the appendix:

**Main flow:**
1. **Hero** — top of article, right after the byline. Auto-generated from the OG image system.
2. **Score table** — after "How Your Funds Are Managed". Acts as a mid-article visual reset. Shows the five category scores and final weighted result.

**Appendix:**

3. **Contract Architecture** (`images/architecture.png`) — referenced from "How Your Funds Are Managed". Shows the contracts that actually hold and move funds (proxy → implementation → external protocols). Author-written Mermaid in `architecture.mmd`.
4. **Governance & Control** (`images/governance.png`) — referenced from "Centralization and Control". Shows the control chain: token holders → governor → timelock → admin, plus any privileged roles outside that chain. Author-written Mermaid in `governance.mmd`.
5. **External Dependencies** (`images/dependency.png`) — referenced from "Dependencies and Risks". Auto-generated from `scripts/dependencies/protocols.yaml`. If no entry exists, omit Appendix C entirely.

The logical order of appendix diagrams mirrors the main article flow: mechanism (A) → control (B) → outside risk (C). Keep it that way.

## Authoring the Mermaid Diagrams

For each article, write two Mermaid files into `reports/substack/output/<slug>/images/`:

- `architecture.mmd` — contract + fund-flow diagram
- `governance.mmd` — governance + control chain

Keep each diagram to 6-12 nodes. More than that and the PNG becomes unreadable at Substack's inline width. Use `graph TB` (top-to-bottom) for both — it reads naturally on mobile.

Running `uv run scripts/substack/generate_images.py <slug>` renders every `.mmd` file it finds into a matching `.png`.

## Metadata

Each generated article includes a comment block at the top (stripped before pasting to Substack):

```markdown
<!--
Source: reports/report/[slug].md
Generated: [timestamp]
Score: [X.X]/5.0
Tier: [Risk Tier]
Word count: [count]
-->
```

## Substack-Specific Notes

- Substack does not render markdown tables well. All tabular data is presented as images or prose.
- Images must be uploaded manually in the Substack editor at the marked positions.
- The `---` horizontal rule renders as a section divider in Substack.
- Bold and italic formatting transfers correctly from markdown paste.
- Links work as standard markdown `[text](url)` when pasted.
