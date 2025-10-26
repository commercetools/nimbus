/**
 * Robots.txt Generator
 *
 * Generates robots.txt for SEO and crawler control
 */

import fs from "fs/promises";

const BASE_URL = "https://nimbus.commercetools.com"; // Update with actual URL

/**
 * Generate robots.txt
 */
export async function generateRobots(outputPath: string): Promise<void> {
  const robots = `# Nimbus Documentation Robots.txt
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl rate (optional)
Crawl-delay: 1

# Disallow private/internal routes if any
# Disallow: /api/
# Disallow: /internal/
`;

  await fs.writeFile(outputPath, robots, "utf-8");
  console.log(`✓ Generated robots.txt`);
}
