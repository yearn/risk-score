---
name: generate-substack-article
description: Generate a Substack newsletter article from an existing risk assessment report.
allowed-tools: Read Write Edit Grep Glob Bash(npx:*) Bash(uv:*)
---

# Generating Substack Newsletter Articles

Transform an existing risk assessment report into a polished, prose-style Substack article.

## Prerequisites

- The source report must already exist in `reports/report/<slug>.md`
- Read `reports/substack/STYLE_GUIDE.md` for editorial rules
- Read `reports/substack/TEMPLATE.md` for article structure

## Workflow

### Step 1: Read the Source Report

Read the full report from `reports/report/<slug>.md`. Understand:
- The protocol: what it does, how it works
- The risk score and tier
- Key strengths and risks
- All data points that will feed into the article

### Step 2: Generate Images

Run the image generation script:
```bash
uv run scripts/substack/generate_images.py <slug>
```

This creates images in `reports/substack/output/<slug>/images/`:
- `hero.png` — OG-style hero image with score and tier
- `score-table.png` — Visual score breakdown by category
- `dependency.png` — Protocol dependency graph (if applicable)

Verify the images were generated successfully before proceeding.

### Step 3: Write the Article

Generate a **complete draft** following the template structure. For each section:

1. Read the corresponding section(s) from the source report
2. Transform notes/bullets into flowing prose paragraphs
3. Follow the style guide rules (no contract addresses, plain language scores, user perspective)
4. Maintain factual accuracy — every claim must trace back to the source report

Write the output to `reports/substack/output/<slug>/article.md`.

Include the metadata comment block at the top:
```markdown
<!--
Source: reports/report/<slug>.md
Generated: <current date>
Score: <score>/5.0
Tier: <tier>
Word count: <count>
-->
```

### Step 4: Review and Iterate

Present the draft to the user. Be prepared to:
- Adjust tone (more/less technical)
- Expand or condense specific sections
- Rewrite sections that don't flow well
- Add context the user wants to highlight
- Remove content the user finds unnecessary

### Step 5: Finalize

Once the user approves:
- Verify the final word count is in the 1200-1800 range
- Ensure all image placement markers are present
- Confirm the footer link points to the correct report URL
- The article is ready to paste into Substack with manual image uploads

## Rules

- **Never fabricate data.** If information isn't in the source report, mark it as needing input from the user.
- **Never include contract addresses** in the article prose. Link to the full report for technical details.
- **Always include the footer** linking back to the full technical report on curation.yearn.fi.
- **Respect the template structure.** Sections can be shorter or longer based on the protocol, but all sections should be present.
- **Check the dependency graph.** Only include the dependency graph image if the protocol has entries in `scripts/dependencies/protocols.yaml`. If not, omit that image and adjust the "Dependencies and Risks" section to be prose-only.
