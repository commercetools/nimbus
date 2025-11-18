/**
 * Main Documentation Build Orchestrator
 *
 * Coordinates the entire documentation build process with optional caching
 */
import { performance } from "perf_hooks";
import { validateContent } from "../validation/validate-content.js";
import { optimizeAssets } from "../assets/optimize-assets.js";
import { buildMdx } from "./mdx-builder.js";
import { buildTypes } from "./types-builder.js";
import { buildManifest } from "./manifest-builder.js";
import { buildSeo } from "./seo-builder.js";
import type { DocsBuilderConfig, BuildResult } from "../types/config.js";
import { flog, successLog } from "../utils/logger.js";

/**
 * Main build function
 */
export async function build(config: DocsBuilderConfig): Promise<BuildResult> {
  const startTime = performance.now();

  console.log("\n🚀 Starting documentation build...\n");

  try {
    // Step 1-2: Parse MDX files and write per-route JSON
    const docs = await buildMdx(
      config.sources.packagesDir,
      config.output.routesDir
    );

    // Step 3: Validate content
    if (config.validation?.enabled !== false) {
      flog("[3/6] Validating content...");
      const errors = validateContent(docs);
      const errorCount = errors.filter((e) => e.severity === "error").length;

      if (errorCount > 0 && config.validation?.strict) {
        throw new Error("Content validation failed");
      }
    }

    // Step 4: Generate route manifest and search index
    const manifest = await buildManifest(
      docs,
      config.output.manifestPath,
      config.output.searchIndexPath
    );

    // Step 5: Parse TypeScript types
    let componentCount = 0;
    if (config.sources.componentIndexPath) {
      componentCount = await buildTypes(
        config.sources.componentIndexPath,
        config.output.typesDir,
        config.propFilter
      );
    }

    // Step 6: Optimize assets
    if (config.output.assetsDir && config.assets?.enabled !== false) {
      flog("[6/6] Optimizing assets...");
      await optimizeAssets(
        config.sources.packagesDir,
        config.output.assetsDir,
        config.assets?.imageExtensions
      );
    }

    // Optional: Generate SEO files
    if (config.seo?.baseUrl) {
      await buildSeo(
        manifest,
        config.seo.baseUrl,
        config.seo.generateRobots ? config.output.robotsPath : undefined,
        config.seo.generateSitemap ? config.output.sitemapPath : undefined
      );
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    successLog(
      `Documentation build completed in ${(duration / 1000).toFixed(2)}s ✨`
    );

    return {
      routeCount: docs.size,
      componentCount,
      duration,
      cacheUsed: false,
      filesRebuilt: docs.size,
      filesCached: 0,
    };
  } catch (error) {
    console.error("\n❌ Build failed:", error);
    throw error;
  }
}
