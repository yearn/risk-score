/**
 * Render Substack images for a risk report.
 *
 * Usage:
 *   npx tsx scripts/substack/render_images.ts <slug> <output-dir>
 *
 * Generates:
 *   <output-dir>/hero.png       - OG-style hero image (1200x630)
 *   <output-dir>/score-table.png - Score breakdown image (1000x500)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import satori, { type SatoriNode } from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dirname, "../..");
const REPORTS_DIR = join(ROOT, "reports/report");
const FONTS_DIR = join(ROOT, "src/fonts");

const fonts = {
  regular: readFileSync(join(FONTS_DIR, "inter-regular.woff")),
  bold: readFileSync(join(FONTS_DIR, "inter-bold.woff")),
};

const FONT_CONFIG = [
  { name: "Inter", data: fonts.regular, weight: 400 as const, style: "normal" as const },
  { name: "Inter", data: fonts.bold, weight: 700 as const, style: "normal" as const },
];

// ---------------------------------------------------------------------------
// Inline color/tier logic (mirrors src/lib/colors.ts)
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score <= 1.5) return "#22C55E";
  if (score <= 2.5) return "#86EFAC";
  if (score <= 3.5) return "#FACC15";
  if (score <= 4.5) return "#FB923C";
  return "#EF4444";
}

function scoreTier(score: number): string {
  if (score <= 1.5) return "Minimal Risk";
  if (score <= 2.5) return "Low Risk";
  if (score <= 3.5) return "Medium Risk";
  if (score <= 4.5) return "Elevated Risk";
  return "High Risk";
}

function scoreTextColor(score: number): string {
  if (score <= 3.5) return "#0C0C0C";
  return "#FFFFFF";
}

// ---------------------------------------------------------------------------
// Protocol icon fetching (DeFiLlama icons, prefers SVG)
// ---------------------------------------------------------------------------

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

async function fetchProtocolIcon(defillamaSlug: string): Promise<string | undefined> {
  if (!defillamaSlug) return undefined;

  const url = `https://icons.llamao.fi/icons/protocols/${defillamaSlug}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;

    const contentType = res.headers.get("content-type") ?? "";
    const raw = Buffer.from(await res.arrayBuffer());

    // If SVG, use directly as data URI
    if (contentType.includes("svg") || raw.subarray(0, 5).toString().includes("<svg")) {
      return `data:image/svg+xml;base64,${raw.toString("base64")}`;
    }

    // Otherwise convert to PNG via sharp
    const png = await sharp(raw).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Parse report metadata and scores from markdown
// ---------------------------------------------------------------------------

interface ReportMeta {
  name: string;
  date: string;
  token: string;
  chain: string;
  finalScore: number;
  defillamaSlug: string;
}

interface CategoryScore {
  category: string;
  score: number;
  weight: string;
  weighted: number;
}

function parseMeta(content: string, slug: string): ReportMeta {
  const titleMatch = content.match(
    /^# (?:Protocol|Asset) Risk Assessment:\s*(.+)$/m,
  );
  const name = titleMatch?.[1]?.trim() ?? slug;
  const dateMatch = content.match(/\*\*Assessment Date:\*\*\s*(.+)/);
  const tokenMatch = content.match(/\*\*Token:\*\*\s*(.+)/);
  const chainMatch = content.match(/\*\*Chain:\*\*\s*(.+)/);
  const scoreMatch = content.match(/\*\*Final Score:\s*([\d.]+)\/5\.0\*\*/);

  return {
    name,
    date: dateMatch?.[1]?.trim() ?? "",
    token: tokenMatch?.[1]?.trim() ?? "",
    chain: chainMatch?.[1]?.trim() ?? "",
    finalScore: parseFloat(scoreMatch?.[1] ?? "0"),
    defillamaSlug: parseDefillamaSlug(slug, content),
  };
}

function parseScoreTable(content: string): CategoryScore[] {
  const tableMatch = content.match(
    /\| Category \| Score \| Weight \| Weighted \|[\s\S]*?(?=\n\n|\n[^|])/,
  );

  if (tableMatch) {
    const rows = tableMatch[0].split("\n").filter((r) => r.startsWith("|"));
    return rows
      .slice(2)
      .map((row) => {
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (cells.length < 4) return null;
        const category = cells[0].replace(/\*\*/g, "");
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

  // Fallback: parse from category headings
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

// ---------------------------------------------------------------------------
// SVG → PNG helper
// ---------------------------------------------------------------------------

function svgToPng(svg: string, width: number): Buffer {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  return Buffer.from(resvg.render().asPng());
}

// ---------------------------------------------------------------------------
// Yearn logo as base64 data URI for embedding in Satori images
// ---------------------------------------------------------------------------

// Y icon extracted from the full yearn-logo.svg (just the symbol, not the wordmark)
const YEARN_Y_ICON_SVG = `<svg viewBox="85 100 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M158.023 158.666C158.757 161.099 159.137 163.652 159.137 166.262C159.137 173.271 156.401 179.862 151.436 184.816C146.47 189.771 139.865 192.501 132.841 192.501C125.817 192.501 119.211 189.771 114.239 184.816C109.274 179.862 106.538 173.271 106.538 166.262C106.538 163.652 106.918 161.099 107.652 158.666L94.3138 145.363C90.9254 151.575 89 158.691 89 166.262C89 190.416 108.628 210 132.834 210C157.041 210 176.669 190.416 176.669 166.262C176.669 158.691 174.743 151.575 171.355 145.37L158.023 158.672V158.666Z" fill="#ffffff"/>
<path d="M124.069 175.008H141.606V147.171L171.45 117.38L159.049 105.006L132.847 131.163L106.62 105L94.2188 117.374L124.069 147.152V175.008Z" fill="#ffffff"/>
</svg>`;
const yearnLogoDataUri = `data:image/svg+xml;base64,${Buffer.from(YEARN_Y_ICON_SVG).toString("base64")}`;

// ---------------------------------------------------------------------------
// Hero image (matches OG style from src/lib/og.ts, with Yearn logo on right)
// ---------------------------------------------------------------------------

async function generateHeroImage(meta: ReportMeta, protocolIconDataUri?: string): Promise<Buffer> {
  const color = scoreColor(meta.finalScore);
  const tier = scoreTier(meta.finalScore);
  const textColor = scoreTextColor(meta.finalScore);

  // Build the icons for the right half
  const iconElements: SatoriNode[] = [];
  if (protocolIconDataUri) {
    iconElements.push({
      type: "img",
      props: {
        src: protocolIconDataUri,
        width: 140,
        height: 140,
        style: { borderRadius: "70px" },
      },
    } as SatoriNode);
  }
  iconElements.push({
    type: "img",
    props: {
      src: yearnLogoDataUri,
      width: 140,
      height: 140,
    },
  } as SatoriNode);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0c0c0c",
          padding: "0",
        },
        children: [
          // Top accent bar
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "6px",
                background:
                  "linear-gradient(90deg, #0675F9 0%, #0675F9 60%, transparent 100%)",
              },
            },
          },
          // Main content row: text left, logo right
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                padding: "50px 60px",
                flex: "1",
                alignItems: "stretch",
              },
              children: [
                // Left column: text content
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      flex: "1",
                      justifyContent: "space-between",
                    },
                    children: [
                      // YEARN CURATION header
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "24px",
                                  fontWeight: 700,
                                  color: "#0675F9",
                                  letterSpacing: "2px",
                                },
                                children: "YEARN CURATION",
                              },
                            },
                          ],
                        },
                      },
                      // Protocol name + score
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize:
                                    meta.name.length > 25 ? "52px" : "64px",
                                  fontWeight: 700,
                                  color: "#f4f4f4",
                                  lineHeight: 1.1,
                                },
                                children: meta.name,
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "20px",
                                },
                                children: [
                                  {
                                    type: "div",
                                    props: {
                                      style: {
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: color,
                                        color: textColor,
                                        borderRadius: "12px",
                                        padding: "10px 24px",
                                        fontSize: "32px",
                                        fontWeight: 700,
                                      },
                                      children: `${meta.finalScore.toFixed(1)} / 5.0`,
                                    },
                                  },
                                  {
                                    type: "div",
                                    props: {
                                      style: {
                                        fontSize: "32px",
                                        fontWeight: 700,
                                        color: color,
                                      },
                                      children: tier,
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      // Token + chain
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "22px",
                            color: "#9d9d9d",
                          },
                          children: [
                            meta.token,
                            meta.chain ? ` · ${meta.chain}` : "",
                          ].filter(Boolean),
                        },
                      },
                    ],
                  },
                },
                // Right half: protocol icon + Yearn icon
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "64px",
                      flex: "1",
                    },
                    children: iconElements,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, fonts: FONT_CONFIG },
  );

  return svgToPng(svg, 1200);
}

// ---------------------------------------------------------------------------
// Score table image
// ---------------------------------------------------------------------------

async function generateScoreTableImage(
  scores: CategoryScore[],
  finalScore: number,
): Promise<Buffer> {
  if (scores.length === 0) {
    throw new Error("No score data found in report");
  }

  const tier = scoreTier(finalScore);
  const finalColor = scoreColor(finalScore);

  const rows = scores.map((s) => ({
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid #2a2a2a",
      },
      children: [
        // Color dot + category name
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              flex: "1",
              gap: "12px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: "12px",
                    height: "12px",
                    borderRadius: "6px",
                    backgroundColor: scoreColor(s.score),
                    flexShrink: 0,
                  },
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: "18px", color: "#e0e0e0" },
                  children: s.category,
                },
              },
            ],
          },
        },
        // Weight
        {
          type: "div",
          props: {
            style: {
              width: "80px",
              textAlign: "center" as const,
              fontSize: "18px",
              color: "#9d9d9d",
            },
            children: s.weight,
          },
        },
        // Score
        {
          type: "div",
          props: {
            style: {
              width: "80px",
              textAlign: "right" as const,
              fontSize: "20px",
              fontWeight: 700,
              color: scoreColor(s.score),
            },
            children: s.score.toFixed(1),
          },
        },
      ],
    },
  }));

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0c0c0c",
          borderRadius: "16px",
          border: "1px solid #2a2a2a",
          overflow: "hidden",
        },
        children: [
          // Header
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "2px solid #2a2a2a",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0675F9",
                      letterSpacing: "2px",
                    },
                    children: "RISK SCORE BREAKDOWN",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "14px",
                            color: "#9d9d9d",
                            letterSpacing: "1px",
                          },
                          children: tier.toUpperCase(),
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Column headers
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                padding: "12px 24px",
                borderBottom: "1px solid #2a2a2a",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      flex: "1",
                      fontSize: "13px",
                      color: "#666",
                      letterSpacing: "1px",
                    },
                    children: "CATEGORY",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      width: "80px",
                      textAlign: "center" as const,
                      fontSize: "13px",
                      color: "#666",
                      letterSpacing: "1px",
                    },
                    children: "WEIGHT",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      width: "80px",
                      textAlign: "right" as const,
                      fontSize: "13px",
                      color: "#666",
                      letterSpacing: "1px",
                    },
                    children: "SCORE",
                  },
                },
              ],
            },
          },
          // Score rows
          ...rows,
          // Final score footer
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                borderTop: "2px solid #2a2a2a",
                marginTop: "auto",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#e0e0e0",
                    },
                    children: "Final Score",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            backgroundColor: finalColor,
                            color: scoreTextColor(finalScore),
                            borderRadius: "8px",
                            padding: "8px 20px",
                            fontSize: "22px",
                            fontWeight: 700,
                          },
                          children: `${finalScore.toFixed(1)} / 5.0`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1000, height: 120 + scores.length * 52 + 80, fonts: FONT_CONFIG },
  );

  return svgToPng(svg, 1000);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const [slug, outputDir] = process.argv.slice(2);

  if (!slug || !outputDir) {
    console.error("Usage: npx tsx scripts/substack/render_images.ts <slug> <output-dir>");
    process.exit(1);
  }

  const reportPath = join(REPORTS_DIR, `${slug}.md`);
  if (!existsSync(reportPath)) {
    console.error(`Report not found: ${reportPath}`);
    process.exit(1);
  }

  const content = readFileSync(reportPath, "utf-8");
  const meta = parseMeta(content, slug);
  const scores = parseScoreTable(content);

  mkdirSync(outputDir, { recursive: true });

  // Fetch protocol icon (try SVG first via DeFiLlama)
  let protocolIconDataUri: string | undefined;
  if (meta.defillamaSlug) {
    console.log(`Fetching protocol icon for: ${meta.defillamaSlug}`);
    protocolIconDataUri = await fetchProtocolIcon(meta.defillamaSlug);
    if (protocolIconDataUri) {
      const isSvg = protocolIconDataUri.startsWith("data:image/svg");
      console.log(`  icon: ${isSvg ? "SVG" : "PNG"} fetched`);
    } else {
      console.log("  icon: not found, hero will show Yearn logo only");
    }
  }

  // Generate hero image
  const heroPng = await generateHeroImage(meta, protocolIconDataUri);
  const heroPath = join(outputDir, "hero.png");
  writeFileSync(heroPath, heroPng);
  console.log(`hero: ${heroPath}`);

  // Generate score table image
  if (scores.length > 0) {
    const scorePng = await generateScoreTableImage(scores, meta.finalScore);
    const scorePath = join(outputDir, "score-table.png");
    writeFileSync(scorePath, scorePng);
    console.log(`score-table: ${scorePath}`);
  } else {
    console.warn("No score data found — skipping score-table.png");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
