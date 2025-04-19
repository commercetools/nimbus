// filepath: /Volumes/Code/nimbus/apps/docs/scripts/generators/types/parse-types.ts
import docgen from "react-docgen-typescript";
import path from "path";
import { logger } from "../../utils/logger";
import { writeJsonFile, fileCache } from "../../utils/file-utils";
import { CONFIG } from "../../config";

/**
 * Configuration options for the TypeScript parser
 */
const DOCGEN_OPTIONS = {
  savePropValueAsString: true,
  propFilter: (prop: { parent?: { name: string } }) => {
    // Skip common props from these interfaces
    const excludedParents = [
      "DOMAttributes",
      "SystemProperties",
      "Conditions",
      "AriaAttributes",
      "HtmlProps",
      "HTMLAttributes",
    ];

    return !excludedParents.includes(prop.parent?.name || "");
  },
};

/**
 * A set to track processed files to avoid duplicate processing
 * and to know which files have changed since last type generation
 */
const processedFiles = new Set<string>();
let typesNeedUpdate = false;

/**
 * Parses TypeScript files for type information
 * @param filePath Path to the TypeScript file
 * @returns Boolean indicating success or failure
 */
export async function parseTypeFile(filePath: string): Promise<boolean> {
  try {
    logger.debug(`Processing TypeScript file: ${filePath}`);

    // Mark as needing update since we have a new or changed file
    typesNeedUpdate = true;

    // Mark file as processed
    processedFiles.add(filePath);

    // Actual type extraction happens when writing docs
    return true;
  } catch (error) {
    logger.error(`Error processing TypeScript file ${filePath}:`, error);
    return false;
  }
}

/**
 * Check if a file is a component file that should be documented
 */
function isComponentFile(filePath: string): boolean {
  const componentPattern = /\/components\/[^/]+\/[^/]+\.(tsx?|jsx?)$/;
  return componentPattern.test(filePath);
}

/**
 * Extracts component types from a nimbus package component
 */
async function extractComponentTypes(): Promise<any[]> {
  try {
    logger.info(`Extracting types from ${CONFIG.typeSource}`);

    // Parse the main source file
    const typeData = docgen.parse(CONFIG.typeSource, DOCGEN_OPTIONS);

    return typeData;
  } catch (error) {
    logger.error("Error extracting component types:", error);
    return [];
  }
}

/**
 * Writes the extracted type information to the output file
 * Will only regenerate types if files have changed
 */
export async function writeTypeDocs(): Promise<void> {
  // Only regenerate if files have changed
  if (!typesNeedUpdate) {
    logger.info("No TypeScript files changed, skipping type extraction");
    return;
  }

  try {
    const startTime = performance.now();

    // Extract types
    const typeData = await extractComponentTypes();

    // Write to the output file
    await writeJsonFile(CONFIG.outputFiles.types, typeData);

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(0);

    logger.success(
      `Type documentation updated (${typeData.length} components, ${duration}ms)`
    );

    // Reset the update flag
    typesNeedUpdate = false;
  } catch (error) {
    logger.error("Failed to write type documentation:", error);
  }
}
