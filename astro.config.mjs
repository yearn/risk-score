import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  // Always the stable production domain, never a per-deployment hostname,
  // which would split SEO signal across throwaway aliases.
  site: "https://curation.yearn.fi",
  integrations: [
    sitemap({
      // OG image endpoints are binary PNGs, not crawlable documents.
      filter: (page) => !page.includes("/og/"),
    }),
  ],
});
