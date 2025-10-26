/**
 * Main Documentation Build Script
 *
 * Orchestrates the entire documentation build process:
 * 1. Parse MDX files
 * 2. Parse TypeScript types
 * 3. Generate route manifest
 * 4. Optimize assets
 * 5. Validate content
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { performance } from "perf_hooks";
import { parseAllMdx, flog } from "./parse-mdx";
import { parseTypes } from "./parse-types";
import { generateRouteManifest } from "./generate-routes";
import { optimizeAssets } from "./optimize-assets";
import { validateContent } from "./validate-content";
import {
  loadCache,
  saveCache,
  needsRebuild,
  updateCacheEntry,
  cleanCache,
  calculateFileHash,
  clearCache,
  getCacheStats,
} from "./build-cache";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Find all files with a specific extension recursively
 */
async function findFiles(dir: string, extension: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and dist
        if (entry.name === "node_modules" || entry.name === "dist") {
          continue;
        }

        const subFiles = await findFiles(fullPath, extension);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        if (
          path.extname(entry.name).toLowerCase() === extension.toLowerCase()
        ) {
          files.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore permission errors
  }

  return files;
}

/**
 * Main build function
 */
export async function build(options: { noCache?: boolean } = {}) {
  const startTime = performance.now();

  console.log("\n🚀 Starting documentation build...\n");

  try {
    // Handle cache clearing
    if (options.noCache) {
      await clearCache();
    }

    // Load build cache
    const cache = await loadCache();
    const cacheStats = getCacheStats(cache);
    if (cache.files.size > 0) {
      console.log(`📦 Loaded cache with ${cacheStats.totalFiles} entries\n`);
    }

    // Paths
    const packagesDir = path.resolve(__dirname, "../../../..");
    const outputDir = path.resolve(__dirname, "../../../../apps/docs/src/data");
    const routesOutputDir = path.join(outputDir, "routes");

    // Ensure output directories exist
    await fs.mkdir(routesOutputDir, { recursive: true });

    // Step 1: Find all MDX files
    flog("[1/6] Finding MDX files...");
    const mdxFiles = await findFiles(packagesDir, ".mdx");
    flog(`Found ${mdxFiles.length} MDX files`);

    // Check which files need rebuilding
    const filesToRebuild: string[] = [];
    let cachedFiles = 0;

    for (const file of mdxFiles) {
      if (await needsRebuild(file, cache)) {
        filesToRebuild.push(file);
      } else {
        cachedFiles++;
      }
    }

    if (cachedFiles > 0) {
      console.log(
        `\x1b[32m\n  ➜ Using cache for ${cachedFiles} files (rebuilding ${filesToRebuild.length})\n\x1b[0m`
      );
    }

    // Step 2: Parse MDX files
    flog("[2/6] Parsing MDX files...");
    const docs = await parseAllMdx(mdxFiles, routesOutputDir);

    // Step 3: Validate content
    flog("[3/6] Validating content...");
    const errors = validateContent(docs);
    if (errors.filter((e) => e.severity === "error").length > 0) {
      throw new Error("Content validation failed");
    }

    // Step 4: Generate route manifest
    flog("[4/6] Generating route manifest...");
    const manifestPath = path.join(outputDir, "route-manifest.json");
    await generateRouteManifest(docs, manifestPath);

    // Step 5: Parse TypeScript types
    flog("[5/6] Parsing TypeScript types...");
    const typesPath = path.join(outputDir, "types.json");
    await parseTypes(typesPath);

    // Step 6: Optimize assets
    flog("[6/6] Optimizing assets...");
    const assetsOutputDir = path.resolve(
      __dirname,
      "../../../../apps/docs/public/images"
    );
    await optimizeAssets(packagesDir, assetsOutputDir);

    // Update cache for all processed files
    for (const file of mdxFiles) {
      const hash = await calculateFileHash(file);
      const route = docs.get(file)?.meta.route || "";
      const outputPath = path.join(routesOutputDir, `${route}.json`);
      updateCacheEntry(cache, file, hash, outputPath);
    }

    // Clean stale cache entries
    await cleanCache(cache, mdxFiles);

    // Save cache
    await saveCache(cache);
    console.log(
      `\x1b[32m\n  ➜ Saved cache with ${cache.files.size} entries\n\x1b[0m`
    );

    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n✨ Documentation build completed in ${duration}s ✨\n`);
  } catch (error) {
    console.error("\n❌ Build failed:", error);
    process.exit(1);
  }
}

// Run if called directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const noCache = args.includes("--no-cache");

  build({ noCache }).catch((error) => {
    console.error("Build error:", error);
    process.exit(1);
  });
}
