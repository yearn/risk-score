import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://risk.yearn.fi",
});
