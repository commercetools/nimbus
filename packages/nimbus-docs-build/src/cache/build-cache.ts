/**
 * Build Cache System
 *
 * Implements incremental builds by tracking file hashes and
 * only rebuilding changed content.
 */
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import type { BuildCache } from "../types/config.js";
import { validateFilePath } from "../utils/validate-file-path.js";

const DEFAULT_CACHE_DIR = ".cache";
const CACHE_FILENAME = "build-cache.json";

/**
 * Get cache file path
 */
function getCachePath(cacheDir?: string): string {
  const dir = cacheDir || DEFAULT_CACHE_DIR;
  // Validate cache directory path to prevent traversal
  const baseDir = process.cwd();
  return validateFilePath(baseDir, dir, CACHE_FILENAME);
}

/**
 * Calculate file hash for cache validation
 *
 * @param filePath - Absolute path to file (should be pre-validated by caller)
 * @note Callers must ensure filePath is validated to prevent path traversal
 */
export async function calculateFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Load build cache from disk
 */
export async function loadCache(cacheDir?: string): Promise<BuildCache> {
  try {
    const cachePath = getCachePath(cacheDir);
    const cacheFileDir = path.dirname(cachePath);
    await fs.mkdir(cacheFileDir, { recursive: true });

    const content = await fs.readFile(cachePath, "utf-8");
    const data = JSON.parse(content);

    return {
      version: data.version || "1.0.0",
      files: new Map(Object.entries(data.files || {})),
    };
  } catch {
    // Cache doesn't exist or is invalid, return empty cache
    return {
      version: "1.0.0",
      files: new Map(),
    };
  }
}

/**
 * Save build cache to disk
 */
export async function saveCache(
  cache: BuildCache,
  cacheDir?: string
): Promise<void> {
  const cachePath = getCachePath(cacheDir);
  const cacheFileDir = path.dirname(cachePath);
  await fs.mkdir(cacheFileDir, { recursive: true });

  const data = {
    version: cache.version,
    files: Object.fromEntries(cache.files),
  };

  await fs.writeFile(cachePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Check if a file needs rebuilding
 */
export async function needsRebuild(
  filePath: string,
  cache: BuildCache
): Promise<boolean> {
  try {
    const currentHash = await calculateFileHash(filePath);
    const cacheEntry = cache.files.get(filePath);

    // No cache entry = needs build
    if (!cacheEntry) return true;

    // Hash changed = needs rebuild
    if (cacheEntry.hash !== currentHash) return true;

    // Check if output still exists
    try {
      await fs.access(cacheEntry.outputPath);
      return false; // Output exists and hash matches
    } catch {
      return true; // Output missing, needs rebuild
    }
  } catch {
    // Error reading file, assume needs rebuild
    return true;
  }
}

/**
 * Update cache entry for a file
 */
export function updateCacheEntry(
  cache: BuildCache,
  filePath: string,
  hash: string,
  outputPath: string
): void {
  cache.files.set(filePath, {
    hash,
    timestamp: Date.now(),
    outputPath,
  });
}

/**
 * Clear stale cache entries (files that no longer exist)
 */
export async function cleanCache(
  cache: BuildCache,
  validFiles: string[]
): Promise<void> {
  const validSet = new Set(validFiles);

  for (const [filePath] of cache.files) {
    if (!validSet.has(filePath)) {
      cache.files.delete(filePath);
    }
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(cache: BuildCache): {
  totalFiles: number;
  oldestEntry: number;
  newestEntry: number;
} {
  let oldestEntry = Date.now();
  let newestEntry = 0;

  for (const [, entry] of cache.files) {
    if (entry.timestamp < oldestEntry) oldestEntry = entry.timestamp;
    if (entry.timestamp > newestEntry) newestEntry = entry.timestamp;
  }

  return {
    totalFiles: cache.files.size,
    oldestEntry,
    newestEntry,
  };
}

/**
 * Clear entire cache
 */
export async function clearCache(cacheDir?: string): Promise<void> {
  try {
    const dir = cacheDir || DEFAULT_CACHE_DIR;
    await fs.rm(dir, { recursive: true, force: true });
    console.log("✓ Build cache cleared");
  } catch (error) {
    console.warn("Warning: Could not clear cache:", error);
  }
}
