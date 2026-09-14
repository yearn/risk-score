import type { APIRoute, GetStaticPaths } from "astro";
import { getAllSlugs, getReportBySlug } from "../../lib/reports";
import { generateReportOgImage } from "../../lib/og";

export const getStaticPaths: GetStaticPaths = () => {
  return getAllSlugs().map((slug) => ({ params: { slug } }));
};

export const GET: APIRoute = async ({ params }) => {
  const report = getReportBySlug(params.slug!);
  if (!report) return new Response("Not found", { status: 404 });

  const png = await generateReportOgImage(report);
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
