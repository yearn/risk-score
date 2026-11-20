import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  // Canonical URLs stay on the production domain in every environment.
  site: "https://curation.yearn.fi",
  integrations: [
    sitemap({
      // OG image endpoints are binary PNGs, not crawlable documents.
      filter: (page) => !page.includes("/og/"),
    }),
  ],
});
