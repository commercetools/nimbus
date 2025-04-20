import fs from "fs/promises";
import path from "path";
import { logger } from "./logger";
import { CONFIG } from "../config";

/**
 * Cached file content to avoid redundant processing
 */
interface CachedFile {
  path: string;
  content: string;
  lastModified: number;
  processingResult?: any;
  tocItems?: any[];
}

/**
 * A class to handle file operations with caching
 */
class FileCache {
  private _cache: Map<string, CachedFile> = new Map();

  /**
   * Check if a file has changed since it was last cached
   */
  async isUnchanged(filePath: string): Promise<boolean> {
    try {
      const cached = this._cache.get(filePath);
      if (!cached) return false;

      const stats = await fs.stat(filePath);
      return stats.mtimeMs === cached.lastModified;
    } catch (error) {
      logger.error(`Error checking file stats for ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Get cached file content if available, otherwise read from disk and cache
   */
  async getContent(filePath: string): Promise<string> {
    try {
      // Check if file exists and is up to date in cache
      if (await this.isUnchanged(filePath)) {
        logger.debug(`Using cached content for ${filePath}`);
        return this._cache.get(filePath)!.content;
      }

      // Read file content
      const content = await fs.readFile(filePath, "utf8");
      const stats = await fs.stat(filePath);

      // Update cache
      this._cache.set(filePath, {
        path: filePath,
        content,
        lastModified: stats.mtimeMs,
      });

      logger.debug(`Read and cached content for ${filePath}`);
      return content;
    } catch (error) {
      logger.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Update the cached processing result for a file
   */
  update(filePath: string, processingResult: any): void {
    const cached = this._cache.get(filePath);
    if (cached) {
      cached.processingResult = processingResult;
    } else {
      // Create new cache entry if it doesn't exist
      this._cache.set(filePath, {
        path: filePath,
        content: "",
        lastModified: Date.now(),
        processingResult,
      });
    }
  }

  /**
   * Remove a file from the cache
   */
  remove(filePath: string): void {
    this._cache.delete(filePath);
  }

  /**
   * Get all cached processing results
   */
  getAllResults(): Record<string, any> {
    const results: Record<string, any> = {};
    this._cache.forEach((file) => {
      if (file.processingResult) {
        // Use the repoPath property from the meta object as the key
        // This is the relative path from the monorepo root
        const key = file.processingResult.meta?.repoPath;
        results[key] = file.processingResult;
      }
    });
    return results;
  }

  /**
   * Update or set TOC items for a file
   */
  setTocItems(filePath: string, tocItems: any[]): void {
    const cached = this._cache.get(filePath);
    if (cached) {
      cached.tocItems = tocItems;
    } else {
      // Create new cache entry if it doesn't exist
      this._cache.set(filePath, {
        path: filePath,
        content: "",
        lastModified: Date.now(),
        tocItems,
      });
    }
  }

  /**
   * Get TOC items for a file if available
   */
  getTocItems(filePath: string): any[] | undefined {
    return this._cache.get(filePath)?.tocItems;
  }

  /**
   * Get a cached file entry
   */
  getCachedFile(filePath: string): CachedFile | undefined {
    return this._cache.get(filePath);
  }
}

// Export singleton instance
export const fileCache = new FileCache();

/**
 * Find files recursively with the given extensions
 */
export async function findFiles(
  dir: string,
  extensions: string[],
  ignored: string[] = CONFIG.ignoreDirs
): Promise<string[]> {
  let results: string[] = [];

  try {
    const items = await fs.readdir(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = await fs.stat(fullPath);

      // Skip ignored directories
      if (stats.isDirectory()) {
        if (!ignored.some((ignore) => item === ignore)) {
          const subResults = await findFiles(fullPath, extensions, ignored);
          results = results.concat(subResults);
        }
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (extensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    logger.error(`Error finding files in ${dir}:`, error);
  }

  return results;
}

/**
 * Write content to a JSON file with pretty formatting
 */
export async function writeJsonFile(
  filePath: string,
  data: any
): Promise<void> {
  try {
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    logger.debug(`Successfully wrote to ${filePath}`);
  } catch (error) {
    logger.error(`Error writing to ${filePath}:`, error);
    throw error;
  }
}
