import fs from "fs/promises";
import matter from "gray-matter";
import { MdxFileFrontmatter } from "../../../src/types";
import { logger } from "../../utils/logger";
import { fileCache, writeJsonFile } from "../../utils/file-utils";
import {
  findPackageName,
  generateRoute,
  getRepoPath,
} from "../../utils/path-utils";
import { CONFIG } from "../../config";
import { mdxDocumentSchema } from "../../../schemas/mdx-document";
import { getToc } from "./toc-builder";

/**
 * Track which files have been changed to optimize writes
 */
let mdxFilesChanged = false;

/**
 * Parses an MDX file and extracts its content and metadata
 * @param filePath Path to the MDX file
 * @returns Boolean indicating success or failure
 */
export async function parseMdxFile(filePath: string): Promise<boolean> {
  try {
    const startTime = performance.now();
    logger.debug(`Processing MDX file: ${filePath}`);

    // Try to read file content, using cache when possible
    let content: string;
    try {
      content = await fileCache.getContent(filePath);
    } catch (error) {
      // File might have been deleted
      logger.warn(`File not found or inaccessible: ${filePath}`);
      fileCache.remove(filePath);
      mdxFilesChanged = true;
      return false;
    }

    // Parse frontmatter and MDX content
    const { data: meta, content: mdx } = matter(content);

    // Generate table of contents
    const toc = await getToc(filePath);

    // Get relative path from repo root for linking
    const repoPath = await getRepoPath(filePath);

    // Find the package name from the closest package.json
    const packageName = (await findPackageName(filePath)) || "unknown";

    // Construct document data
    const documentData = {
      meta: {
        ...meta,
        repoPath,
        packageName,
        order: meta.order || 999,
        route: generateRoute(meta.menu),
        toc,
      },
      mdx,
    };

    try {
      // Check if there's an existing cached version
      const cachedFile = fileCache.getCachedFile(filePath);
      const cachedResult = cachedFile?.processingResult;

      // Compare with previous result to see if anything changed
      if (cachedResult) {
        const prevData = JSON.stringify(cachedResult);
        const newData = JSON.stringify(documentData);

        if (prevData === newData) {
          // No changes, skip validation and update
          const endTime = performance.now();
          logger.debug(
            `No changes in MDX file (${(endTime - startTime).toFixed(1)}ms): ${filePath}`
          );
          return true;
        }
      }

      // Validate document data against schema
      const validData = mdxDocumentSchema.parse(documentData);

      // Store in cache
      fileCache.update(filePath, validData);
      mdxFilesChanged = true;

      const endTime = performance.now();
      logger.info(
        `Processed MDX file (${(endTime - startTime).toFixed(1)}ms): ${filePath}`
      );
      return true;
    } catch (error) {
      logger.error(`Schema validation error for ${filePath}:`, error);
      return false;
    }
  } catch (error) {
    logger.error(`Error processing MDX file ${filePath}:`, error);
    return false;
  }
}

/**
 * Writes the accumulated MDX documentation to the output file
 */
export async function writeMdxDocs(): Promise<void> {
  // Skip writing if no files have changed
  if (!mdxFilesChanged) {
    logger.debug("No MDX files changed, skipping documentation write");
    return;
  }

  try {
    const startTime = performance.now();
    const results = fileCache.getAllResults();

    // Sort documentation by keys to ensure consistent order
    const sortedResults = Object.keys(results)
      .sort()
      .reduce<Record<string, MdxFileFrontmatter>>((acc, key) => {
        acc[key] = results[key];
        return acc;
      }, {});

    // Write to the output file
    await writeJsonFile(CONFIG.outputFiles.docs, sortedResults);

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(1);
    const fileCount = Object.keys(sortedResults).length;

    logger.success(
      `MDX documentation updated (${fileCount} files, ${duration}ms)`
    );

    // Reset the changed flag
    mdxFilesChanged = false;
  } catch (error) {
    logger.error("Failed to write MDX documentation:", error);
  }
}
