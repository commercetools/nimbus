/**
 * Manifest Builder
 *
 * Generates route manifest and search index
 */
import { generateRouteManifest } from "../generators/routes.js";
import { generateSearchIndex } from "../generators/search.js";
import type { MdxDocument, RouteManifest } from "../types/mdx.js";
import { flog } from "../utils/logger.js";

/**
 * Build route manifest and search index
 */
export async function buildManifest(
  docs: Map<string, MdxDocument>,
  manifestPath: string,
  searchIndexPath: string
): Promise<RouteManifest> {
  flog("[4/6] Generating route manifest...");
  const manifest = await generateRouteManifest(docs, manifestPath);

  flog("[4/6] Generating search index...");
  await generateSearchIndex(docs, searchIndexPath);

  return manifest;
}
