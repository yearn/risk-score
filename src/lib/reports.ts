import fs from "node:fs";
import path from "node:path";
import { parseReport, type ReportData } from "./parseReport";

const REPORTS_DIR = path.resolve("reports/report");

export function getAllReports(): ReportData[] {
  const files = fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(".md", "");
      const content = fs.readFileSync(path.join(REPORTS_DIR, file), "utf-8");
      return parseReport(slug, content);
    })
    .sort((a, b) => a.finalScore - b.finalScore);
}

export function getReportBySlug(slug: string): ReportData | undefined {
  const file = path.join(REPORTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const content = fs.readFileSync(file, "utf-8");
  return parseReport(slug, content);
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}
