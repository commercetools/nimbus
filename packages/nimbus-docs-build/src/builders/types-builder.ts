/**
 * Types Builder
 *
 * Handles TypeScript type extraction and generation
 */
import { parseTypesToFiles } from "../parsers/parse-types.js";
import { flog } from "../utils/logger.js";
import type { DocsBuilderConfig } from "../types/config.js";

/**
 * Build TypeScript component types
 */
export async function buildTypes(
  componentIndexPath: string,
  typesOutputDir: string,
  propFilter?: DocsBuilderConfig["propFilter"]
): Promise<number> {
  flog("[5/6] Parsing TypeScript types...");

  const manifest = await parseTypesToFiles(
    componentIndexPath,
    typesOutputDir,
    propFilter
  );

  const componentCount = Object.keys(manifest).length;
  flog(`[TSX] Parsed ${componentCount} component types`);

  return componentCount;
}
