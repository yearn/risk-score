import type { APIRoute } from "astro";
import { getAllReports } from "../lib/reports";
import { scoreTier } from "../lib/colors";

// llms.txt — a markdown briefing for LLMs and AI search engines, served at the
// site root by convention. Generated at build time so the report count, score
// list, and methodology stay current on every deploy without manual edits.
// Spec: https://llmstxt.org
const SITE = "https://curation.yearn.fi";

export const GET: APIRoute = async () => {
  // Alphabetical by name so a model (or human) scanning for a specific protocol
  // can find it quickly.
  const reports = [...getAllReports()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const lines: string[] = [
    "# Yearn Curation",
    "",
    "> Independent, open-source risk assessments for DeFi protocols, vaults, and stablecoins. Each asset is scored 1.0-5.0 on a transparent weighted rubric and monitored continuously.",
    "",
    "Yearn Curation is the risk research arm of Yearn Finance. We evaluate DeFi yield-bearing assets so allocators can deploy capital with a clear, reproducible understanding of counterparty, collateral, oracle, liquidity, and contract risk. Every assessment is public, lives on GitHub, and traces each claim back to onchain evidence or a primary source.",
    "",
    "## Scoring methodology",
    "",
    "Each rated asset receives a Final Score from 1.0 (lowest risk) to 5.0 (highest risk), a weighted average of five categories:",
    "",
    "- Centralization & Control — 30%",
    "- Funds Management — 30%",
    "- Audits & Historical — 20%",
    "- Liquidity Risk — 15%",
    "- Operational Risk — 5%",
    "",
    "Final scores map to risk tiers (the tier is computed from the full-precision weighted average; the displayed score is rounded to one decimal place):",
    "",
    "- at most 1.5 — Minimal Risk",
    "- at most 2.5 — Low Risk",
    "- at most 3.5 — Medium Risk",
    "- at most 4.5 — Elevated Risk",
    "- above 4.5 — High Risk",
    "",
    "Assets affected by a terminal event (exploit or wind-down) are listed as **Not Rated** and excluded from the numeric scale.",
    "",
    "## Assessed assets",
    "",
    `Browse all ${reports.length} reports at ${SITE}/reports/`,
    "",
    `Each report URL follows the pattern \`${SITE}/report/{slug}/\` and includes the score breakdown, overview, key strengths and risks, contract addresses, audit history, and governance analysis. Markdown sources are on GitHub: https://github.com/yearn/risk-score/tree/master/reports/report`,
    "",
  ];

  for (const r of reports) {
    const label =
      r.finalScore != null
        ? `${r.name} — ${r.finalScore.toFixed(1)}/5.0 ${scoreTier(r.finalScore)}`
        : `${r.name} — Not Rated`;
    lines.push(`- [${label}](${SITE}/report/${r.slug}/): ${r.token} on ${r.chain}`);
  }

  lines.push(
    "",
    "## Other resources",
    "",
    `- [Token exposures](${SITE}/tokens/): shared-asset overlap across curated protocols`,
    `- [Bridge dependencies](${SITE}/bridges/): cross-chain bridge risk`,
    `- [Live monitoring](${SITE}/monitoring/): real-time protocol alerts (governance, oracle, owner changes)`,
    "- [Yearn Curation introduction](https://docs.yearn.fi/getting-started/products/curating/introduction)",
    "- [Source repository](https://github.com/yearn/risk-score)",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
