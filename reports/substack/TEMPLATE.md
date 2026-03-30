# Substack Article Template

Use this template to structure every Substack newsletter article generated from a risk assessment report.

---

## Article Structure

```markdown
# [Protocol Name]: Risk Assessment Deep Dive

*Published by Yearn Curation | [Month Day, Year]*

![Hero image: [Protocol Name] risk score [X.X] - [Risk Tier]](images/hero.png)

[1-2 opening paragraphs with no heading. Lead with the verdict: what is this
protocol, what does it score, and what risk tier does that place it in? State the
single most important strength and the single most important risk. This is the
section most readers will see in the Substack preview — make it count.]

## What Is [Protocol Name]?

[2-3 paragraphs. Explain the protocol to someone who hasn't used it. Cover:
- What it does and how it generates yield
- When it launched and current TVL
- Key backing or partnerships
- Link to the protocol's app/site

Weave metrics naturally into prose. Don't list them as bullets.]

## Security Profile

[2-3 paragraphs. Transform the audit table and security data into narrative:
- Number and quality of audits, name the firms
- Bug bounty program and maximum payout
- Historical incidents (with honest context)
- Smart contract complexity assessment in plain terms

Frame positively where warranted: "backed by three independent audits" reads
better than a table of dates.]

## How Your Funds Are Managed

[2-3 paragraphs. Explain from a depositor's perspective:
- What happens when you deposit (what token do you get back?)
- Where do funds actually go? (strategies, protocols, yield sources)
- How withdrawals work — instant or delayed? Typical wait times?
- Collateralization — how can you verify backing on-chain?

This is the section where readers decide if they'd actually use the protocol.]

![Score breakdown showing category scores and final weighted result](images/score-table.png)

## Centralization and Control

[2-3 paragraphs. Cover the governance structure:
- Who can upgrade contracts? What protections exist (timelocks, multisig)?
- How are day-to-day operations managed? (operator roles, automation)
- What's the worst a privileged actor could do, and how quickly?

Frame as a spectrum. Quantify protections: "a 48-hour timelock means the
community has two full days to react to any proposed change."]

## Dependencies and Risks

[1-2 paragraphs. Cover external dependencies:
- What other protocols does this depend on? (oracles, underlying assets, bridges)
- What's the concentration risk? (e.g., "50% in a single LST protocol")
- What happens if a dependency fails?

If the protocol appears in the dependency graph, include the image:]

![Protocol dependency graph showing external protocol relationships](images/dependency.png)

## Liquidity: Can You Get Out?

[1-2 paragraphs. From the user's exit perspective:
- How do you withdraw? Is it atomic or queued?
- What slippage should you expect at various sizes?
- Are there historical examples of liquidity stress?
- Any withdrawal fees or lock-up periods?]

## The Bottom Line

[2-3 paragraphs. Synthesize, don't repeat:
- Clear recommendation: is this suitable for allocation?
- Under what conditions or limits?
- Key strengths that support the score
- Key risks that limit it
- One-sentence final assessment

End with the link to the full technical report.]

---

*This assessment is part of Yearn's ongoing curation work. For the complete
technical report — including contract addresses, detailed scoring rubrics,
and monitoring setup — visit the
[full report on curation.yearn.fi](https://curation.yearn.fi/report/[slug]).*
```

---

## Image Placement

Three images break up the article:

1. **Hero image** — Top of article, immediately after the byline. Generated from the existing OG image system (protocol icon, score, tier, color-coded background).

2. **Score table image** — After "How Your Funds Are Managed", before "Centralization and Control". Provides a visual data break in the middle of the article. Shows the five category scores with weights and the final weighted result.

3. **Dependency graph** — Inside "Dependencies and Risks" section. Only include if the protocol has entries in `protocols.yaml`. Shows the protocol's direct dependencies as a filtered Mermaid graph rendered to PNG.

## Metadata

Each generated article should include a comment block at the top (stripped before pasting to Substack) with:

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

- Substack does not render markdown tables well. All tabular data should be presented as images or converted to prose.
- Images must be uploaded manually in the Substack editor at the marked positions.
- The `---` horizontal rule renders as a section divider in Substack.
- Bold and italic formatting transfers correctly from markdown paste.
- Links work as standard markdown `[text](url)` when pasted.
