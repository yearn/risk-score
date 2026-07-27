import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  // Always the stable production domain. Using VERCEL_URL here leaks the
  // per-deployment hostname (e.g. risk-score-<hash>-yearn.vercel.app) into
  // canonical/og URLs, splitting SEO signal across throwaway aliases.
  site: "https://curation.yearn.fi",
});
