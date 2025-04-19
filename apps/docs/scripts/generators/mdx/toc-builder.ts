import { read } from "to-vfile";
import { remark } from "remark";
import remarkFlexibleToc from "remark-flexible-toc";
import { TocItem } from "../../../src/types";
import { logger } from "../../utils/logger";
import { fileCache } from "../../utils/file-utils";

// Cache TOC generation promises to avoid parallel processing of the same file
const tocPromises = new Map<string, Promise<TocItem[]>>();

/**
 * Gets the table of contents for an MDX file
 * @param filePath Path to the MDX file
 * @returns Promise resolving to an array of TOC items
 */
export async function getToc(filePath: string): Promise<TocItem[]> {
  try {
    // If we already have a promise for this file, return it to avoid duplicate work
    if (tocPromises.has(filePath)) {
      return tocPromises.get(filePath)!;
    }

    // Check cache first
    const cachedToc = fileCache.getTocItems(filePath);
    if (cachedToc) {
      logger.debug(`Using cached TOC for ${filePath}`);
      return cachedToc;
    }

    // Create a new promise for generating the TOC
    const tocPromise = generateToc(filePath);

    // Store the promise in the map
    tocPromises.set(filePath, tocPromise);

    // Once the promise resolves, remove it from the map
    tocPromise.finally(() => {
      tocPromises.delete(filePath);
    });

    return tocPromise;
  } catch (error) {
    logger.error(`Error getting TOC for ${filePath}:`, error);
    return [];
  }
}

/**
 * Generates a new TOC for an MDX file
 */
async function generateToc(filePath: string): Promise<TocItem[]> {
  try {
    const startTime = performance.now();
    const toc: TocItem[] = [];

    await remark()
      .use(remarkFlexibleToc, { tocRef: toc })
      .process(await read(filePath));

    // Store in cache for future use
    fileCache.setTocItems(filePath, toc);

    const endTime = performance.now();
    logger.debug(
      `Generated TOC for ${filePath} with ${toc.length} items (${(endTime - startTime).toFixed(1)}ms)`
    );
    return toc;
  } catch (error) {
    logger.error(`Error generating TOC for ${filePath}:`, error);
    return [];
  }
}
