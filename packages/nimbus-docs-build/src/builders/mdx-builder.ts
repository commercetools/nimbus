/**
 * MDX Builder
 *
 * Handles MDX file discovery, parsing, and per-route JSON generation
 */
import fs from "fs/promises";
import { parseAllMdx } from "../parsers/parse-mdx.js";
import type { MdxDocument } from "../types/mdx.js";
import { flog } from "../utils/logger.js";
import { findFiles } from "../utils/file-utils.js";
import { validateFilePath } from "../utils/validate-file-path.js";

/**
 * Write per-route JSON files for all documents
 */
async function writeRouteFiles(
  docs: Map<string, MdxDocument>,
  outputDir: string
): Promise<void> {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Write per-route JSON files
  for (const [, doc] of docs) {
    // Use route field (derived from menu path) for consistent filenames across the system
    const routeId = doc.meta.route.replace(/\//g, "-");
    const outputPath = validateFilePath(outputDir, `${routeId}.json`);

    // Write per-route JSON
    await fs.writeFile(outputPath, JSON.stringify(doc, null, 2));
  }
}

/**
 * Build MDX documentation
 */
export async function buildMdx(
  packagesDir: string,
  routesOutputDir: string
): Promise<Map<string, MdxDocument>> {
  flog("[1/6] Finding MDX files...");
  const mdxFiles = await findFiles(packagesDir, ".mdx");
  flog(`Found ${mdxFiles.length} MDX files`);

  flog("[2/6] Parsing MDX files...");
  const docs = await parseAllMdx(mdxFiles);
  flog(`[MDX] Parsed ${docs.size} documentation files`);

  // Write per-route JSON files
  await writeRouteFiles(docs, routesOutputDir);

  return docs;
}
