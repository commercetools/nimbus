/**
 * Robots.txt Generator
 *
 * Generates robots.txt for SEO and crawler control
 */
import fs from "fs/promises";

/**
 * Generate robots.txt
 */
export async function generateRobots(
  baseUrl: string,
  outputPath: string
): Promise<void> {
  const robots = `# Nimbus Documentation Robots.txt
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl rate (optional)
Crawl-delay: 1

# Disallow private/internal routes if any
# Disallow: /api/
# Disallow: /internal/
`;

  await fs.writeFile(outputPath, robots, "utf-8");
  console.log(`✓ Generated robots.txt`);
}
