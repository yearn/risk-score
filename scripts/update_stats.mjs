#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, "reports", "report");
const OUT = path.join(ROOT, "src", "data", "stats.json");

function countReports() {
  return fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith(".md")).length;
}

async function main() {
  const reportCount = countReports();

  const stats = {
    reportCount,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(stats, null, 2) + "\n");
  console.log(`[update_stats] reports=${reportCount}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
