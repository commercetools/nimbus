/**
 * Search Index Generator
 *
 * Generates a searchable index from documentation
 */
import fs from "fs/promises";
import type { MdxDocument } from "../types/mdx.js";
import { flog } from "../utils/logger.js";

/**
 * Strip markdown formatting from text
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic
    .replace(/`([^`]+)`/g, "$1") // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .trim();
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
      description: doc.meta.description || "",
      tags: doc.meta.tags || [],
      route: doc.meta.route,
      menu: doc.meta.menu,
      // Strip markdown and truncate content for search (first 500 chars)
      content: stripMarkdown(doc.mdx).slice(0, 500),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  await fs.writeFile(outputPath, JSON.stringify(searchItems, null, 2));

  flog(`[Search] Generated index with ${searchItems.length} items`);
}
