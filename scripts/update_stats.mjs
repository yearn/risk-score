#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, "reports", "report");
const OUT = path.join(ROOT, "src", "data", "stats.json");

const DEFILLAMA_URL = "https://api.llama.fi/protocol/yearn";

function countReports() {
  return fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith(".md")).length;
}

async function fetchTvl() {
  const res = await fetch(DEFILLAMA_URL);
  if (!res.ok) throw new Error(`DefiLlama responded ${res.status}`);
  const data = await res.json();
  const chainTvls = data.currentChainTvls ?? {};
  const total = Object.values(chainTvls).reduce(
    (sum, v) => sum + (typeof v === "number" ? v : 0),
    0,
  );
  return { total, byChain: chainTvls };
}

async function main() {
  const reportCount = countReports();
  let tvl = { total: 0, byChain: {} };
  let tvlSource = "live";
  try {
    tvl = await fetchTvl();
  } catch (err) {
    console.warn("[update_stats] DefiLlama fetch failed:", err.message);
    if (fs.existsSync(OUT)) {
      const prev = JSON.parse(fs.readFileSync(OUT, "utf-8"));
      tvl = prev.tvl ?? tvl;
      tvlSource = "cached";
    } else {
      tvlSource = "fallback";
    }
  }

  const stats = {
    reportCount,
    tvl,
    chainCount: Object.keys(tvl.byChain).length,
    updatedAt: new Date().toISOString(),
    tvlSource,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(stats, null, 2) + "\n");
  console.log(
    `[update_stats] reports=${reportCount} tvl=$${(tvl.total / 1e6).toFixed(2)}M chains=${stats.chainCount} (${tvlSource})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
