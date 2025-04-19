import path from "path";
import { CONFIG } from "../config";
import { getPathFromMonorepoRoot } from "@/scripts/utils/find-monorepo-root";
import { logger } from "./logger";
import { sluggify } from "@/src/utils/sluggify";

/**
 * Generates a route path from a menu structure
 * @param menu Menu structure array or string
 * @returns Route path string
 */
export function generateRoute(menu: string | string[]): string {
  if (typeof menu === "string") {
    return sluggify(menu);
  }

  if (Array.isArray(menu)) {
    return menu.map((item) => sluggify(item)).join("/");
  }

  return "";
}

/**
 * Checks if a file path should be processed or ignored
 * @param filePath File path to check
 * @returns Boolean indicating if the file should be processed
 */
export function shouldProcessFile(filePath: string): boolean {
  // Skip files from ignored directories
  for (const ignoreDir of CONFIG.ignoreDirs) {
    if (filePath.includes(`/${ignoreDir}/`)) {
      return false;
    }
  }

  // Check file extension
  const ext = path.extname(filePath).toLowerCase();
  const validExtensions = [
    ...CONFIG.extensions.code,
    ...CONFIG.extensions.docs,
  ];

  return validExtensions.includes(ext);
}

/**
 * Gets the relative path from the monorepo root
 * This is a wrapper around the existing utility with better error handling
 */
export async function getRepoPath(filePath: string): Promise<string> {
  try {
    return await getPathFromMonorepoRoot(filePath);
  } catch (error) {
    logger.error(`Error getting repo path for ${filePath}:`, error);
    // Fallback to a relative path if the monorepo root can't be determined
    return path.relative(process.cwd(), filePath);
  }
}

/**
 * Normalizes a file path for consistent handling
 */
export function normalizePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/g, "/");
}
