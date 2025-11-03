/**
 * @commercetools/nimbus-docs-build
 *
 * Documentation build system for Nimbus design system
 *
 * @packageDocumentation
 */

// Main build function
export { build } from "./builders/build.js";

// Individual builders (for advanced usage)
export {
  buildMdx,
  buildTypes,
  buildManifest,
  buildSeo,
} from "./builders/index.js";

// Parsers
export {
  parseMdxFile,
  parseAllMdx,
  parseTypes,
  parseTypesToFile,
  parseTypesToFiles,
} from "./parsers/index.js";

// Generators
export {
  generateRouteManifest,
  generateSearchIndex,
  generateRobots,
  generateSitemap,
} from "./generators/index.js";

// Validation
export { validateContent } from "./validation/index.js";

// Cache utilities
export {
  loadCache,
  saveCache,
  needsRebuild,
  updateCacheEntry,
  cleanCache,
  getCacheStats,
  clearCache,
  calculateFileHash,
} from "./cache/index.js";

// Asset optimization
export { optimizeAssets } from "./assets/index.js";

// Utilities
export {
  flog,
  errorLog,
  warnLog,
  successLog,
  sluggify,
  menuToPath,
  findMonorepoRoot,
  getPathFromMonorepoRoot,
  findFiles,
  findFilesByExtensions,
} from "./utils/index.js";

// Schemas and types
export * from "./schemas/index.js";
export * from "./types/index.js";

// Re-export type-only imports for convenience
export type { ComponentDoc, PropItem } from "react-docgen-typescript";
