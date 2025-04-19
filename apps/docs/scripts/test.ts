// filepath: /Volumes/Code/nimbus/apps/docs/scripts/test.ts
import { performance } from "perf_hooks";
import { findFiles } from "./utils/file-utils";
import { logger } from "./utils/logger";
import { CONFIG } from "./config";
import { parseMdxFile, writeMdxDocs } from "./generators/mdx/parse-mdx";
import { parseTypeFile, writeTypeDocs } from "./generators/types/parse-types";
import { fileURLToPath } from "url";

/**
 * Test harness to verify the documentation generation system
 *
 * This simple script:
 * 1. Finds all MDX and TS files in the packages directory
 * 2. Times the processing of these files
 * 3. Outputs metrics to the console
 */
async function runTest(): Promise<void> {
  logger.info("Running documentation generator test");
  logger.separator();

  try {
    // Find all test files
    logger.info(`Finding MDX files in ${CONFIG.watchDir}`);
    const startFindMdx = performance.now();
    const mdxFiles = await findFiles(CONFIG.watchDir, CONFIG.extensions.docs);
    const findMdxTime = performance.now() - startFindMdx;
    logger.info(
      `Found ${mdxFiles.length} MDX files in ${findMdxTime.toFixed(2)}ms`
    );

    logger.info(`Finding TypeScript files in ${CONFIG.watchDir}`);
    const startFindTs = performance.now();
    const tsFiles = await findFiles(CONFIG.watchDir, CONFIG.extensions.code);
    const findTsTime = performance.now() - startFindTs;
    logger.info(
      `Found ${tsFiles.length} TypeScript files in ${findTsTime.toFixed(2)}ms`
    );

    // Process MDX files
    logger.info("Processing MDX files...");
    const startMdxProcess = performance.now();
    const mdxResults = await Promise.all(mdxFiles.map(parseMdxFile));
    const mdxProcessTime = performance.now() - startMdxProcess;
    const successfulMdx = mdxResults.filter((result) => result).length;
    logger.info(
      `Processed ${successfulMdx}/${mdxFiles.length} MDX files in ${mdxProcessTime.toFixed(2)}ms`
    );

    // Process TypeScript files
    logger.info("Processing TypeScript files...");
    const startTsProcess = performance.now();
    const tsResults = await Promise.all(tsFiles.map(parseTypeFile));
    const tsProcessTime = performance.now() - startTsProcess;
    const successfulTs = tsResults.filter((result) => result).length;
    logger.info(
      `Processed ${successfulTs}/${tsFiles.length} TypeScript files in ${tsProcessTime.toFixed(2)}ms`
    );

    // Write documentation files
    logger.info("Writing documentation files...");
    const startWrite = performance.now();
    await writeMdxDocs();
    await writeTypeDocs();
    const writeTime = performance.now() - startWrite;
    logger.info(`Wrote documentation files in ${writeTime.toFixed(2)}ms`);

    // Calculate total time
    const totalTime =
      findMdxTime + findTsTime + mdxProcessTime + tsProcessTime + writeTime;
    logger.success(`Total processing time: ${totalTime.toFixed(2)}ms`);

    // Output metrics
    logger.separator();
    logger.info("Performance Metrics:");
    logger.info(
      `- Finding files: ${(findMdxTime + findTsTime).toFixed(2)}ms (${(((findMdxTime + findTsTime) / totalTime) * 100).toFixed(2)}%)`
    );
    logger.info(
      `- Processing MDX: ${mdxProcessTime.toFixed(2)}ms (${((mdxProcessTime / totalTime) * 100).toFixed(2)}%)`
    );
    logger.info(
      `- Processing TS: ${tsProcessTime.toFixed(2)}ms (${((tsProcessTime / totalTime) * 100).toFixed(2)}%)`
    );
    logger.info(
      `- Writing files: ${writeTime.toFixed(2)}ms (${((writeTime / totalTime) * 100).toFixed(2)}%)`
    );
    logger.info(
      `- Average time per MDX file: ${(mdxProcessTime / mdxFiles.length).toFixed(2)}ms`
    );
    logger.info(
      `- Average time per TS file: ${(tsProcessTime / tsFiles.length).toFixed(2)}ms`
    );
  } catch (error) {
    logger.error("Test failed:", error);
  }
}

// Run the test when this file is executed directly
// ES module compatible check for main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runTest().catch((error) => {
    logger.error("Unhandled error in test:", error);
    process.exit(1);
  });
}
