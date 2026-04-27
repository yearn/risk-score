import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { scoreColor, scoreTier, scoreTextColor } from "./colors";

const WIDTH = 1200;
const HEIGHT = 630;

const fontsDir = join(process.cwd(), "src", "fonts");

const fonts = {
  regular: readFileSync(join(fontsDir, "inter-regular.woff")),
  bold: readFileSync(join(fontsDir, "inter-bold.woff")),
};

export async function generateReportOgImage(report: {
  name: string;
  finalScore: number;
  token: string;
  chain: string;
  iconUrl?: string;
}): Promise<Buffer> {
  const color = scoreColor(report.finalScore);
  const tier = scoreTier(report.finalScore);
  const textColor = scoreTextColor(report.finalScore);

  let iconDataUri: string | undefined;
  if (report.iconUrl) {
    try {
      const res = await fetch(report.iconUrl);
      if (res.ok) {
        const raw = Buffer.from(await res.arrayBuffer());
        const png = await sharp(raw).png().toBuffer();
        iconDataUri = `data:image/png;base64,${png.toString("base64")}`;
      }
    } catch {}
  }

  const nameRowChildren: Record<string, unknown>[] = [
    // Left: name + score
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: "1",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: report.name.length > 25 ? "52px" : "64px",
                fontWeight: 700,
                color: "#f4f4f4",
                lineHeight: 1.1,
              },
              children: report.name,
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
                    children: `${report.finalScore.toFixed(1)} / 5.0`,
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
  ];

  if (iconDataUri) {
    nameRowChildren.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "33.3%",
          flexShrink: 0,
        },
        children: {
          type: "img",
          props: {
            src: iconDataUri,
            width: 156,
            height: 156,
            style: {
              borderRadius: "78px",
            },
          },
        },
      },
    });
  }

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
                background: "linear-gradient(90deg, #0675F9 0%, #0675F9 60%, transparent 100%)",
              },
            },
          },
          // Content
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                padding: "50px 60px",
                flex: "1",
                justifyContent: "space-between",
              },
              children: [
                // Header
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
                // Protocol name + icon row
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "40px",
                    },
                    children: nameRowChildren,
                  },
                },
                // Bottom meta
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
                      report.token,
                      report.chain ? ` · ${report.chain}` : "",
                    ].filter(Boolean),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
        { name: "Inter", data: fonts.bold, weight: 700, style: "normal" },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  return resvg.render().asPng();
}

export async function generateDefaultOgImage(): Promise<Buffer> {
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
          // Subtle blue glow anchored top-right, matching the landing hero
          backgroundImage:
            "radial-gradient(circle at 85% 12%, rgba(6, 117, 249, 0.32), rgba(6, 117, 249, 0.08) 35%, transparent 60%)",
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
          // Content
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                padding: "0 80px",
                flex: "1",
                justifyContent: "center",
                alignItems: "center",
                gap: "32px",
              },
              children: [
                // Eyebrow pill
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 22px",
                      border: "1px solid #424242",
                      borderRadius: "999px",
                      backgroundColor: "rgba(40, 40, 40, 0.6)",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "12px",
                            height: "12px",
                            borderRadius: "999px",
                            backgroundColor: "#0675F9",
                            boxShadow: "0 0 0 6px rgba(6, 117, 249, 0.18)",
                          },
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#9d9d9d",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                          },
                          children: "Independent DeFi Risk Curation",
                        },
                      },
                    ],
                  },
                },
                // Title — two lines, second line in brand blue
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      lineHeight: 1.05,
                      letterSpacing: "-2px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "108px",
                            fontWeight: 700,
                            color: "#f4f4f4",
                          },
                          children: "Risk-curated yield",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "108px",
                            fontWeight: 700,
                            color: "#0675F9",
                          },
                          children: "by Yearn.",
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
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
        { name: "Inter", data: fonts.bold, weight: 700, style: "normal" },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  return resvg.render().asPng();
}
