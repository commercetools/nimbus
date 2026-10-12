/**
 * Search Index Generator
 *
 * Generates a searchable index from documentation
 */
import fs from "fs/promises";
import path from "path";
import type { MdxDocument } from "../types/mdx.js";
import { flog } from "../utils/logger.js";
import { validateFilePath } from "../utils/validate-file-path.js";

/**
 * Strips markdown formatting from text for the search index.
 *
 * Fenced code blocks are extracted first so the formatting regexes never
 * touch code examples; only the fence markers are dropped and the code is
 * restored verbatim. Inline backticks are preserved so prop names and
 * imports stay searchable. Mirrors the stripper in nimbus-mcp/src/utils/markdown.ts.
 */
export function stripMarkdown(text: string): string {
  // The private-use delimiter (\uE000) never occurs in MDX source.
  const codeBlocks: string[] = [];
  const withPlaceholders = text.replace(
    /^```[^\n]*\n([\s\S]*?)^```[ \t]*$/gm,
    (_, content: string) => {
      codeBlocks.push(content.trimEnd());
      return `\uE000CODE${codeBlocks.length - 1}\uE000`;
    }
  );

  const stripped = withPlaceholders
    .replace(/<[A-Z][^>]*\/>/g, "") // Self-closing JSX render directives
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "") // Paired JSX wrappers
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return stripped.replace(
    /\uE000CODE(\d+)\uE000/g,
    (_, i) => codeBlocks[Number(i)]
  );
}

/**
 * Generate search index from parsed documents
 */
export async function generateSearchIndex(
  docs: Map<string, MdxDocument>,
  outputPath: string
): Promise<void> {
  const searchItems = Array.from(docs.values())
    .map((doc) => ({
      id: doc.meta.id,
      title: doc.meta.title,
      exportName: doc.meta.exportName,
      description: doc.meta.description || "",
      tags: doc.meta.tags || [],
      route: doc.meta.route,
      menu: doc.meta.menu,
      // Strip markdown and truncate content for search (first 500 chars)
      content: stripMarkdown(doc.mdx).slice(0, 500),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const outputDir = path.dirname(outputPath);
  const validatedPath = validateFilePath(outputDir, path.basename(outputPath));
  await fs.writeFile(validatedPath, JSON.stringify(searchItems, null, 2));

  flog(`[Search] Generated index with ${searchItems.length} items`);
}
