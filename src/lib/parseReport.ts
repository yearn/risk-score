import { marked } from "marked";
import { protocolIconUrl, chainIconUrl, defillamaIconUrl } from "./icons";

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
  /** Earliest (original) assessment date, human-readable. Falls back to `date`. */
  originalDate: string;
  /** Most recent assessment/reassessment date, human-readable. Falls back to `date`. */
  latestDate: string;
  /** True when the report has been reassessed/updated at least once. */
  isUpdated: boolean;
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

/** One row of the "Assessment History" table — a point-in-time score snapshot. */
export interface HistoryEntry {
  date: string;
  score: string;
  notes: string;
}

export interface ReportData extends ReportMeta {
  overviewHtml: string;
  scoreTable: CategoryScore[];
  riskSummaryHtml: string;
  fullReportHtml: string;
  /** Chronological score history (oldest first). Synthesized from meta when the report has no table yet. */
  history: HistoryEntry[];
}

const TYPE_OVERRIDES: Record<string, "Protocol" | "Asset"> = {
  "unit-ubtc": "Asset",
};

// Typed DefiLlama icon references for reports whose markdown has no
// `defillama.com/protocol/<slug>` link (or where that protocol icon isn't the
// right one). Forms: "protocol:<slug>", "stablecoin:<slug>", "token:<address>".
// Resolved via defillamaIconUrl() — same mechanism the Bridges page uses.
const DEFILLAMA_ICON_OVERRIDES: Record<string, string> = {
  "midas-mhyper": "protocol:midas-rwa",
  "infinifi": "protocol:infinifi",
  "reserve-ethplus": "protocol:reserve-protocol",
  "apyx-apxusd": "protocol:apyx-protocol",
  "paxos-usdg": "stablecoin:global-dollar",
  "superstate-ustb": "protocol:superstate",
};

function parseIconUrl(slug: string, content: string): string {
  const override = DEFILLAMA_ICON_OVERRIDES[slug];
  if (override) return defillamaIconUrl(override);
  // Otherwise scrape a DefiLlama protocol link from the report body.
  const match = content.match(/defillama\.com\/protocol\/([a-z0-9-]+)/i);
  return match?.[1] ? protocolIconUrl(match[1]) : "";
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

// Keywords that flag a report as reassessed/updated even when the parenthetical
// carries no explicit second date (e.g. "(reassessment; vault unpaused ...)").
const REASSESS_KEYWORDS = /updated|reassess|recheck|refresh|prior assessment|previous/i;
// Matches month-name dates like "July 3, 2026", "Feb 12, 2026", "April 22, 2026".
const HUMAN_DATE = /[A-Z][a-z]+\.?\s+\d{1,2},?\s+\d{4}/g;

/**
 * Splits an "Assessment Date" value into its original and most-recent dates and
 * decides whether the report is an update of an earlier assessment. Handles the
 * varied conventions in the reports: "(Updated: X)", "(reassessed X)",
 * "(reassessment; prior assessments A; B)", "(rechecked A; refreshed B)", etc.
 * Uses the earliest date found as the original and the latest as the current one,
 * which is correct whether the new date sits before or inside the parenthetical.
 */
function parseAssessmentDates(raw: string): {
  originalDate: string;
  latestDate: string;
  isUpdated: boolean;
} {
  const fallback = raw.trim();
  const hasKeyword = REASSESS_KEYWORDS.test(raw);
  const dated = (raw.match(HUMAN_DATE) ?? [])
    .map((s) => ({ s, t: Date.parse(s) }))
    .filter((d) => !Number.isNaN(d.t))
    .sort((a, b) => a.t - b.t);

  if (dated.length === 0) {
    return { originalDate: fallback, latestDate: fallback, isUpdated: hasKeyword };
  }
  const originalDate = dated[0].s;
  const latestDate = dated[dated.length - 1].s;
  const isUpdated = hasKeyword || dated[0].t !== dated[dated.length - 1].t;
  return { originalDate, latestDate, isUpdated };
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

  const iconUrl = parseIconUrl(slug, content);
  const chainStr = chainMatch?.[1]?.trim() ?? "";

  const dateRaw = dateMatch?.[1]?.trim() ?? "";
  const { originalDate, latestDate, isUpdated } = parseAssessmentDates(dateRaw);
  return {
    slug,
    name,
    date: dateRaw,
    dateSortable: parseDateSortable(dateRaw),
    originalDate,
    latestDate,
    isUpdated,
    token: tokenMatch?.[1]?.trim() ?? "",
    chain: chainStr,
    finalScore,
    type,
    iconUrl,
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
    "Assessment History",
  ];
  const bodySections = sections
    .slice(1) // skip title/metadata block
    .filter((s) => !skipHeadings.some((h) => s.startsWith(`## ${h}`)));
  return bodySections.join("\n").trim();
}

/**
 * Parses the optional "## Assessment History" table (Date | Score | Notes) into
 * structured rows. When a report has no such table yet, synthesizes a single
 * current-state row from the header so every report shows a seed to grow from.
 */
function parseHistory(content: string, meta: ReportMeta): HistoryEntry[] {
  const section = extractSection(content, "Assessment History");
  const rows = section
    .split("\n")
    .filter((r) => r.trim().startsWith("|"))
    .slice(2) // skip header + separator
    .map((row): HistoryEntry | null => {
      const cells = row.split("|").slice(1, -1).map((c) => c.trim());
      if (!cells[0]) return null;
      return { date: cells[0], score: cells[1] ?? "", notes: cells[2] ?? "" };
    })
    .filter((r): r is HistoryEntry => r !== null);

  if (rows.length > 0) return rows;

  // Fallback: seed a single row from the current header.
  const score =
    meta.finalScore != null ? meta.finalScore.toFixed(1) : (meta.status ?? "N/A");
  return [
    {
      date: meta.latestDate,
      score,
      notes: meta.isUpdated ? "Reassessment" : "Initial assessment",
    },
  ];
}

export function parseReport(slug: string, content: string): ReportData {
  const meta = parseMeta(slug, content);

  const overviewMd = extractSection(content, "Overview + Links");
  const riskSummaryMd = extractSection(content, "Risk Summary");
  const scoreTable = parseScoreTable(content);
  const fullBodyMd = extractFullBody(content);
  const history = parseHistory(content, meta);

  return {
    ...meta,
    overviewHtml: marked.parse(overviewMd, { async: false }) as string,
    scoreTable,
    riskSummaryHtml: marked.parse(riskSummaryMd, { async: false }) as string,
    fullReportHtml: marked.parse(fullBodyMd, { async: false }) as string,
    history,
  };
}
