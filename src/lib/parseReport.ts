import { marked } from "marked";

export interface ReportMeta {
  slug: string;
  name: string;
  date: string;
  token: string;
  chain: string;
  finalScore: number;
  type: "Protocol" | "Asset";
  iconUrl: string;
  chainIconUrl: string;
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

function iconUrl(defillamaSlug: string): string {
  if (!defillamaSlug) return "";
  return `https://icons.llamao.fi/icons/protocols/${defillamaSlug}?w=48&h=48`;
}

const CHAIN_ID_MAP: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  polygon: 137,
  optimism: 10,
  bnb: 56,
  avalanche: 43114,
};

function chainIconUrl(chain: string): string {
  const lower = chain.toLowerCase();
  if (lower.includes("hyperliquid") || lower.includes("hyperev")) {
    return "https://icons.llamao.fi/icons/chains/rsz_hyperliquid?w=48&h=48";
  }
  for (const [key, id] of Object.entries(CHAIN_ID_MAP)) {
    if (lower.includes(key)) {
      return `https://token-assets-one.vercel.app/api/chains/${id}/logo-32.png?fallback=true`;
    }
  }
  return "";
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
  const scoreMatch = content.match(/\*\*Final Score:\s*([\d.]+)\/5\.0\*\*/);

  const defillamaSlug = parseDefillamaSlug(slug, content);
  const chainStr = chainMatch?.[1]?.trim() ?? "";

  return {
    slug,
    name,
    date: dateMatch?.[1]?.trim() ?? "",
    token: tokenMatch?.[1]?.trim() ?? "",
    chain: chainStr,
    finalScore: parseFloat(scoreMatch?.[1] ?? "0"),
    type,
    iconUrl: iconUrl(defillamaSlug),
    chainIconUrl: chainIconUrl(chainStr),
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

export function parseReport(slug: string, content: string): ReportData {
  const meta = parseMeta(slug, content);

  const overviewMd = extractSection(content, "Overview + Links");
  const riskSummaryMd = extractSection(content, "Risk Summary");
  const scoreTable = parseScoreTable(content);

  return {
    ...meta,
    overviewHtml: marked.parse(overviewMd, { async: false }) as string,
    scoreTable,
    riskSummaryHtml: marked.parse(riskSummaryMd, { async: false }) as string,
  };
}
