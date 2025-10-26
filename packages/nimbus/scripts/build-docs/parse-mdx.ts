/**
 * MDX Parser for Documentation Build System
 *
 * Generates per-route JSON files instead of a monolithic docs.json
 * for better code splitting and performance.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { remark } from "remark";
import remarkFlexibleToc from "remark-flexible-toc";
import { read } from "to-vfile";
import { mdxDocumentSchema } from "./schemas";
import type { MdxDocument, TocItem } from "./types";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const flog = (str: string) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

/**
 * Generate table of contents from MDX content
 */
const generateToc = async (filePath: string): Promise<TocItem[]> => {
  const toc: TocItem[] = [];

  await remark()
    .use(remarkFlexibleToc, { tocRef: toc })
    .process(await read(filePath));

  return toc || [];
};

/**
 * Convert menu array to route path
 */
const menuToPath = (menu: string[]): string => {
  return menu.map((item) => item.toLowerCase().replace(/\s+/g, "-")).join("/");
};

/**
 * Get path relative to monorepo root
 */
const getPathFromMonorepoRoot = (filePath: string): string => {
  const repoRoot = path.resolve(__dirname, "../../../..");
  return path.relative(repoRoot, filePath);
};

/**
 * Parse a single MDX file and return structured document data
 */
export async function parseMdxFile(
  filePath: string
): Promise<MdxDocument | null> {
  try {
    // Skip node_modules
    if (filePath.includes("node_modules")) {
      return null;
    }

    // Read file content
    const content = await fs.readFile(filePath, "utf8");

    // Parse frontmatter
    const { data: meta, content: mdx } = matter(content);

    // Generate TOC
    const toc = await generateToc(filePath);

    // Get relative path
    const repoPath = getPathFromMonorepoRoot(filePath);

    // Build document structure
    const document: MdxDocument = {
      meta: {
        ...meta,
        repoPath,
        order: meta.order || 999,
        route: menuToPath(meta.menu || []),
        toc,
      },
      mdx,
    };

    // Validate with Zod
    const validatedDoc = mdxDocumentSchema.parse(document);

    return validatedDoc;
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error);
    return null;
  }
}

/**
 * Parse all MDX files and generate per-route JSON files
 */
export async function parseAllMdx(
  mdxFiles: string[],
  outputDir: string
): Promise<Map<string, MdxDocument>> {
  const docs = new Map<string, MdxDocument>();

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Parse all files in parallel
  const results = await Promise.all(
    mdxFiles.map(async (filePath) => {
      const doc = await parseMdxFile(filePath);
      return { filePath, doc };
    })
  );

  // Write per-route JSON files
  for (const { doc } of results) {
    if (!doc) continue;

    const routeId = doc.meta.id.toLowerCase().replace(/\s+/g, "-");
    const outputPath = path.join(outputDir, `${routeId}.json`);

    // Save to map
    docs.set(doc.meta.repoPath, doc);

    // Write per-route JSON
    await fs.writeFile(outputPath, JSON.stringify(doc, null, 2));
  }

  flog(`[MDX] Parsed ${docs.size} documentation files`);
  return docs;
}

/**
 * Incremental build: Only rebuild changed files
 */
export async function parseChangedMdx(
  changedFiles: string[],
  outputDir: string
): Promise<void> {
  flog(`[MDX] Rebuilding ${changedFiles.length} changed files`);

  for (const filePath of changedFiles) {
    const doc = await parseMdxFile(filePath);
    if (!doc) continue;

    const routeId = doc.meta.id.toLowerCase().replace(/\s+/g, "-");
    const outputPath = path.join(outputDir, `${routeId}.json`);

    await fs.writeFile(outputPath, JSON.stringify(doc, null, 2));
  }

  flog("[MDX] Incremental build complete");
}
