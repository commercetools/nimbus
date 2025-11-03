/**
 * Sitemap Generator
 *
 * Generates sitemap.xml for SEO
 */
import fs from "fs/promises";
import type { RouteManifest } from "../types/mdx.js";

/**
 * Generate sitemap.xml from route manifest
 */
export async function generateSitemap(
  manifest: RouteManifest,
  baseUrl: string,
  outputPath: string
): Promise<void> {
  const urls = manifest.routes.map((route) => {
    const lastmod = new Date().toISOString().split("T")[0];
    const priority = route.path === "/" ? "1.0" : "0.8";
    const changefreq = "weekly";

    return `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  await fs.writeFile(outputPath, sitemap, "utf-8");
  console.log(`✓ Generated sitemap with ${urls.length} URLs`);
}
