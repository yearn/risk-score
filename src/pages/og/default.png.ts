import type { APIRoute } from "astro";
import { generateDefaultOgImage } from "../../lib/og";

export const GET: APIRoute = async () => {
  const png = await generateDefaultOgImage();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
