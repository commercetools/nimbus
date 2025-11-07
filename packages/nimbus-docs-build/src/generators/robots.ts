/**
 * Robots.txt Generator
 *
 * Generates robots.txt for SEO and crawler control
 */
import fs from "fs/promises";
import path from "path";
import { validateFilePath } from "../utils/validate-file-path.js";

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

  // Validate output path to prevent traversal
  const outputDir = path.dirname(outputPath);
  const validatedPath = validateFilePath(outputDir, path.basename(outputPath));
  await fs.writeFile(validatedPath, robots, "utf-8");
  console.log(`✓ Generated robots.txt`);
}
