import path from "path";
import { CONFIG } from "./config";
import { findFiles } from "./utils/file-utils";
import { logger } from "./utils/logger";
import { parseMdxFile, writeMdxDocs } from "./generators/mdx/parse-mdx";
import { parseTypeFile, writeTypeDocs } from "./generators/types/parse-types";

/**
 * Check if a file path is within the nimbus package
 */
function isInNimbusPackage(filePath: string): boolean {
  const normalizedPath = path.normalize(filePath).replace(/\\/g, "/");
  const normalizedNimbusPath = path
    .normalize(CONFIG.packageDirs.nimbus)
    .replace(/\\/g, "/");
  return normalizedPath.startsWith(normalizedNimbusPath);
}

/**
 * Builds documentation for production
 */
export async function build(): Promise<void> {
  logger.info("Starting documentation build process");
  logger.separator();

  try {
    // Find all MDX files
    logger.info(`Finding MDX files in ${CONFIG.watchDir}`);
    const mdxFiles = await findFiles(CONFIG.watchDir, CONFIG.extensions.docs);
    logger.info(`Found ${mdxFiles.length} MDX files`);

    // Find TypeScript files (only from nimbus package)
    logger.info(`Finding TypeScript files in ${CONFIG.packageDirs.nimbus}`);
    const tsFiles = await findFiles(
      CONFIG.packageDirs.nimbus,
      CONFIG.extensions.code
    );
    logger.info(`Found ${tsFiles.length} TypeScript files in nimbus package`);

    // Process MDX files
    logger.info("Processing MDX files...");
    await Promise.all(mdxFiles.map(parseMdxFile));

    // Process TypeScript files
    logger.info("Processing TypeScript files...");
    await Promise.all(tsFiles.map(parseTypeFile));

    // Write documentation files
    logger.info("Writing documentation files...");
    await writeMdxDocs();
    await writeTypeDocs();

    logger.separator();
    logger.success("Documentation build completed successfully");
  } catch (error) {
    logger.error("Documentation build failed:", error);
    process.exit(1);
  }
}

// Execute build when run directly
// ES module compatible check for main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  build().catch((error) => {
    logger.error("Unhandled error in build process:", error);
    process.exit(1);
  });
}
