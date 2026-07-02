import { marked } from "marked";
import { protocolIconUrl, chainIconUrl } from "./icons";

// Override the default GFM del (strikethrough) tokenizer to only match
// ~~double tildes~~, not ~single tildes~. Reports use ~$value frequently
// for approximations, which otherwise gets rendered as <del>strikethrough</del>.
marked.use({
  tokenizer: {
    del(src) {
      const match = src.match(/^~~(?=[^\s~])([\s\S]*?[^\s~])~~(?=[^~]|$)/);
      if (match) {
        return {
          type: "del",
          raw: match[0],
          text: match[1],
          tokens: this.lexer.inlineTokens(match[1]),
        };
      }
      return undefined;
    },
  },
});

/**
 * "terminal" — a realized event (exploit or wind-down) supersedes a
 * forward-looking risk score. These reports are Not Rated (finalScore = null)
 * and listed separately, off the 1–5 scale.
 * "caution" — the report keeps its numeric score but carries a flag
 * (e.g. GATED: score capped by a critical gate).
 */
export type StatusKind = "caution" | "terminal";

export interface ReportMeta {
  slug: string;
  name: string;
  date: string;
  /** Effective date for sorting (uses (Updated: ...) when present). 0 if unparseable. */
  dateSortable: number;
  token: string;
  chain: string;
  /** null when Not Rated: a terminal status (HACKED/DEAD) or an explicit "Final Score: N/A". */
  finalScore: number | null;
  type: "Protocol" | "Asset";
  iconUrl: string;
  chainIconUrl: string;
  /** Normalized status tag, e.g. "GATED" | "HACKED" | "DEAD". Absent = active. */
  status?: string;
  /** Whether the status pulls the report off the scale ("terminal") or just flags it ("caution"). */
  statusKind?: StatusKind;
}

export interface CategoryScore {
  category: string;
  score: number;
  weight: string;
  weighted: number;
}

export interface ReportData extends ReportMeta {
  overviewHtml: string;
  scoreTable: CategoryScore[];
  riskSummaryHtml: string;
  fullReportHtml: string;
}

const TYPE_OVERRIDES: Record<string, "Protocol" | "Asset"> = {
  "unit-ubtc": "Asset",
};

const DEFILLAMA_SLUG_OVERRIDES: Record<string, string> = {
  "midas-mhyper": "midas-rwa",
  "infinifi": "infinifi",
  "reserve-ethplus": "reserve-protocol",
};

function parseDefillamaSlug(slug: string, content: string): string {
  if (DEFILLAMA_SLUG_OVERRIDES[slug]) return DEFILLAMA_SLUG_OVERRIDES[slug];
  const match = content.match(/defillama\.com\/protocol\/([a-z0-9-]+)/i);
  return match?.[1] ?? "";
}

/** Statuses that pull a report off the numeric scale (score → null, listed under "Not Rated"). */
const TERMINAL_STATUSES = new Set([
  "HACKED",
  "DEAD",
  "DEPRECATED",
  "WIND-DOWN",
  "WINDDOWN",
]);

function classifyStatus(raw?: string): {
  status?: string;
  statusKind?: StatusKind;
} {
  if (!raw) return {};
  // Take the first word (e.g. "HACKED" from "HACKED (2026-03-22)") and normalize.
  const status = raw.trim().toUpperCase().split(/[\s(]/)[0].replace(/[^A-Z-]/g, "");
  if (!status) return {};
  const statusKind: StatusKind = TERMINAL_STATUSES.has(status)
    ? "terminal"
    : "caution";
  return { status, statusKind };
}

function parseDateSortable(raw: string): number {
  if (!raw) return 0;
  // If there's a parenthetical "(Updated: <date>)" / "(updated <date>)",
  // prefer that as the effective date.
  const updated = raw.match(/\((?:updated:?)\s*([^)]+)\)/i);
  const candidate = (updated?.[1] ?? raw.split("(")[0]).replace(/^-\s*/, "").trim();
  const t = Date.parse(candidate);
  return Number.isNaN(t) ? 0 : t;
}


function parseMeta(slug: string, content: string): ReportMeta {
  const titleMatch = content.match(
    /^# (?:Protocol|Asset) Risk Assessment:\s*(.+)$/m,
  );
  const name = titleMatch?.[1]?.trim() ?? slug;

  const type =
    TYPE_OVERRIDES[slug] ??
    (content.match(/^# Asset/m) ? "Asset" : "Protocol");

  const dateMatch = content.match(/\*\*Assessment Date:\*\*\s*(.+)/);
  const tokenMatch = content.match(/\*\*Token:\*\*\s*(.+)/);
  const chainMatch = content.match(/\*\*Chain:\*\*\s*(.+)/);
  // Metadata lives in the header block — the bullet list before the first "## "
  // section. Scope status/score matching to it so body prose like
  // "**Status:** Live since…" (e.g. a bug-bounty status line) is never mistaken
  // for a report status tag.
  const header = content.split(/\n## /)[0];
  const scoreMatch = header.match(/\*\*Final Score:\s*([\d.]+)\/5\.0\*\*/);
  const naMatch = /\*\*Final Score:\s*N\/?A/i.test(header);
  // Prefer the newer "Status:" field; fall back to legacy "Warning:".
  const statusMatch =
    header.match(/\*\*Status:\*\*\s*(.+)/) ??
    header.match(/\*\*Warning:\*\*\s*(.+)/);
  const { status, statusKind } = classifyStatus(statusMatch?.[1]);

  // Not Rated when explicitly "N/A" or when a terminal event supersedes the score.
  const finalScore =
    naMatch || statusKind === "terminal"
      ? null
      : scoreMatch
        ? parseFloat(scoreMatch[1])
        : null;

  const defillamaSlug = parseDefillamaSlug(slug, content);
  const chainStr = chainMatch?.[1]?.trim() ?? "";

  const dateRaw = dateMatch?.[1]?.trim() ?? "";
  return {
    slug,
    name,
    date: dateRaw,
    dateSortable: parseDateSortable(dateRaw),
    token: tokenMatch?.[1]?.trim() ?? "",
    chain: chainStr,
    finalScore,
    type,
    iconUrl: protocolIconUrl(defillamaSlug),
    chainIconUrl: chainIconUrl(chainStr),
    status,
    statusKind,
  };
}

function extractSection(content: string, heading: string): string {
  const sections = content.split(/(?=^## )/m);
  const section = sections.find((s) => s.startsWith(`## ${heading}`));
  if (!section) return "";
  const lines = section.split("\n");
  return lines.slice(1).join("\n").trim();
}

function parseScoreTable(content: string): CategoryScore[] {
  // Try standard table format: | Category | Score | Weight | Weighted |
  const tableMatch = content.match(
    /\| Category \| Score \| Weight \| Weighted \|[\s\S]*?(?=\n\n|\n[^|])/,
  );

  if (tableMatch) {
    const rows = tableMatch[0].split("\n").filter((r) => r.startsWith("|"));
    return rows
      .slice(2) // skip header + separator
      .map((row) => {
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (cells.length < 4) return null;
        const category = cells[0].replace(/\*\*/g, "");
        // Skip summary rows
        if (/final|weighted score|category-weighted/i.test(category))
          return null;
        return {
          category,
          score: parseFloat(cells[1]) || 0,
          weight: cells[2],
          weighted: parseFloat(cells[3]) || 0,
        };
      })
      .filter((r): r is CategoryScore => r !== null);
  }

  // Fallback: parse from category headings (reserve-ethplus style)
  const categories: CategoryScore[] = [];
  const categoryPatterns = [
    { name: "Audits & Historical", weight: "20%" },
    { name: "Centralization & Control", weight: "30%" },
    { name: "Funds Management", weight: "30%" },
    { name: "Liquidity Risk", weight: "15%" },
    { name: "Operational Risk", weight: "5%" },
  ];

  for (const cat of categoryPatterns) {
    const pattern = new RegExp(
      `#{3,4}\\s*\\d*\\.?\\s*${cat.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\\n]*\\n\\*\\*Score:\\s*([\\d.]+)`,
    );
    const match = content.match(pattern);
    if (match) {
      const score = parseFloat(match[1]);
      const weightNum = parseFloat(cat.weight) / 100;
      categories.push({
        category: cat.name,
        score,
        weight: cat.weight,
        weighted: Math.round(score * weightNum * 1000) / 1000,
      });
    }
  }

  return categories;
}

function extractFullBody(content: string): string {
  const sections = content.split(/(?=^## )/m);
  const skipHeadings = [
    "Overview + Links",
    "Risk Summary",
    "Risk Score Assessment",
  ];
  const bodySections = sections
    .slice(1) // skip title/metadata block
    .filter((s) => !skipHeadings.some((h) => s.startsWith(`## ${h}`)));
  return bodySections.join("\n").trim();
}

export function parseReport(slug: string, content: string): ReportData {
  const meta = parseMeta(slug, content);

  const overviewMd = extractSection(content, "Overview + Links");
  const riskSummaryMd = extractSection(content, "Risk Summary");
  const scoreTable = parseScoreTable(content);
  const fullBodyMd = extractFullBody(content);

  return {
    ...meta,
    overviewHtml: marked.parse(overviewMd, { async: false }) as string,
    scoreTable,
    riskSummaryHtml: marked.parse(riskSummaryMd, { async: false }) as string,
    fullReportHtml: marked.parse(fullBodyMd, { async: false }) as string,
  };
}
