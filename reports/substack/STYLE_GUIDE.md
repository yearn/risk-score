# Substack Style Guide

Editorial rules for converting risk assessment reports into Substack newsletter articles.

## Target Audience

DeFi-literate readers who understand staking, liquidity, governance, and yield — but are **not** smart contract auditors. Think: an active DeFi user evaluating whether to deposit into a protocol.

## Tone and Voice

- **Confident but measured.** State findings clearly without excessive hedging. "The protocol has a 48-hour timelock" not "it appears the protocol may have what seems to be a timelock."
- **Evidence-based.** Every claim must come from the original report. Never add information, speculation, or claims not present in the source.
- **Conservative.** Match the original report's cautious, risk-aware tone. Do not oversell strengths or downplay risks.
- **Second person where natural.** "Your funds are backed by..." reads better than "User funds are backed by..." on Substack.

## Structure Rules

### Paragraph Length
- **Keep paragraphs to 2-4 sentences.** Substack readers scan. A single paragraph that runs five or six sentences becomes a wall of text on mobile.
- If a paragraph is getting too long, split it on the first natural seam — a topic shift, a qualifier, or a transition from fact to implication.
- One-sentence paragraphs are fine when they carry a key verdict or transition. Don't overuse them.

### Paragraphs over Bullets
- Convert bullet-point lists into flowing paragraphs with complete sentences.
- A bullet like "Launch Date: October 25, 2024" becomes part of a sentence: "The protocol launched in October 2024 and has been operating for over a year without incident."
- Exception: If a list genuinely aids readability (e.g., 3 key risks at the end), keep it as a short list.

### Push Technical Detail into Diagrams
- The article explains **what matters and why**. The appendix diagrams carry the **contract-level detail**.
- Resist the urge to enumerate every role, every contract, every external protocol in prose. Name the 2-3 most important, then point readers to the relevant appendix.
- Cross-reference format: `> See **Appendix B** for the full control chain.` placed as a block quote at the end of the section it's relevant to.

### Contract Addresses
- **Remove from prose.** Do not include hex addresses in the Substack article. They clutter the reading experience.
- Reference contracts by name: "the ARM proxy contract" or "the Timelock Controller."
- Direct readers to the full report for addresses: link to `curation.yearn.fi/report/<slug>`.

### Risk Scores
- Translate numeric scores into plain language: "Origin ARM scores 1.5 out of 5.0, placing it in the **Low Risk** tier — approved with standard monitoring."
- Include the score number for precision, but always pair it with the tier name.
- Briefly explain what the score means for a reader unfamiliar with the scale.

### Technical Terms
- Use DeFi terms freely (TVL, ERC4626, multisig, timelock, oracle) — the audience knows these.
- Spell out less common terms on first use: "formal verification (mathematical proof that the code behaves as specified)."
- Avoid deep Solidity specifics (function signatures, storage slots) unless critical to a risk point.

### Transitions
- Add transitional phrases between sections for narrative flow: "Beyond the security profile, it's worth examining how funds are actually managed day to day."
- Each section should feel like a natural continuation, not an abrupt topic switch.

## Section-Specific Guidelines

### Opening paragraphs (no heading)
- Lead with the verdict. What is this protocol, and should you care?
- State the final score and risk tier prominently.
- One sentence on the single biggest strength and single biggest risk.
- These paragraphs sit directly below the hero image with no section title.

### What Is [Protocol]?
- Explain the protocol as if introducing it to someone who hasn't used it.
- Weave in TVL, launch date, and yield source naturally.
- Keep it accessible — avoid copy-pasting the Overview section verbatim.

### Security Profile
- Transform the audit table into narrative: "The protocol has undergone three independent audits — two by OpenZeppelin and one formal verification by Certora — with no critical unresolved findings."
- Mention the bug bounty as a positive signal with the amount.
- Cover historical incidents honestly but with context (e.g., different product, different codebase).

### How Your Funds Are Managed
- Explain the deposit and withdrawal flow from a user's perspective.
- Clarify if withdrawals are instant or delayed, and what the typical wait looks like.
- Describe collateralization in terms the reader can verify: "You can check the vault's backing ratio on-chain at any time."

### Centralization and Control
- Frame governance as a spectrum, not binary. "The protocol is governed by..." rather than labeling it centralized or decentralized.
- Highlight timelock durations — readers should understand the protection window.
- Mention multisig thresholds (e.g., 5-of-8) but skip individual signer addresses.

### Dependencies and Risks
- Explain what could go wrong if an external dependency fails.
- Quantify concentration: "50% of collateral sits in a single protocol" is more impactful than "relies on multiple protocols."
- End with a pointer to **Appendix C** rather than listing every integration in prose.

### Appendix Diagrams
- **Order is fixed:** A = Contract Architecture, B = Governance & Control, C = External Dependencies. The logical progression is mechanism → control → outside risk, which mirrors the main article's flow.
- Each appendix entry is 1-2 sentences of description plus the image. Don't re-explain the diagram in prose; the diagram is the explanation.
- Omit an entry entirely if the underlying data doesn't support it (e.g., no `protocols.yaml` entry means no Appendix C).

### Liquidity: Can You Get Out?
- Frame from the user's perspective: "If you need to exit, here's what to expect."
- Mention typical wait times, slippage estimates, and any queue mechanisms.

### The Bottom Line
- Synthesize, don't repeat. This is your recommendation paragraph.
- State clearly: is this suitable for allocation? Under what conditions?
- End with a link to the full technical report.

## Formatting for Substack

- **Bold** for emphasis on key terms and risk tier names.
- *Italics* sparingly, for protocol names on first reference or publication attribution.
- Use `---` horizontal rules only to separate the footer/disclaimer from the article body.
- Keep paragraphs to 3-5 sentences maximum. Substack readers scan.
- Images should have descriptive alt text and a brief caption below them.

## Word Count

Target **1200-1800 words** per article. The original reports are 300-500 lines of dense notes — the Substack version should be significantly shorter in raw content but longer in prose.

## What to Omit

- Contract address tables (link to full report instead)
- Detailed scoring rubrics and subcategory breakdowns (the score table image covers this)
- Monitoring section (relevant to operators, not newsletter readers)
- Reassessment triggers (internal process detail)
- Inline function calls and Solidity references
- Individual multisig signer addresses
