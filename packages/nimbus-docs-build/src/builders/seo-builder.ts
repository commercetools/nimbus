/**
 * SEO Builder
 *
 * Generates SEO files (robots.txt, sitemap.xml)
 */
import { generateRobots } from "../generators/robots.js";
import { generateSitemap } from "../generators/sitemap.js";
import type { RouteManifest } from "../types/mdx.js";

/**
 * Build SEO files
 */
export async function buildSeo(
  manifest: RouteManifest,
  baseUrl: string,
  robotsPath?: string,
  sitemapPath?: string
): Promise<void> {
  if (robotsPath) {
    await generateRobots(baseUrl, robotsPath);
  }

  if (sitemapPath) {
    await generateSitemap(manifest, baseUrl, sitemapPath);
  }
}
