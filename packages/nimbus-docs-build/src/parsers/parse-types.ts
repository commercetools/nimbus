/**
 * TypeScript Props Parser
 *
 * Extracts component prop types using react-docgen-typescript
 * with access to proper tsconfig paths
 */
import fs from "fs/promises";
import docgen from "react-docgen-typescript";
import type { ComponentDoc } from "react-docgen-typescript";
import { processComponentTypes } from "./process-types.js";
import type { DocsBuilderConfig } from "../types/config.js";

/**
 * Parse TypeScript files and extract component props
 * @param config - Configuration with componentIndexPath and optional propFilter
 * @returns Array of processed component docs
 */
export async function parseTypes(
  config: Pick<DocsBuilderConfig, "sources" | "propFilter">
): Promise<ComponentDoc[]> {
  try {
    const indexPath = config.sources.componentIndexPath;
    if (!indexPath) {
      throw new Error("componentIndexPath is required for type parsing");
    }

    // Configure parser options
    const options = {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    };

    // Parse all types from the index file
    const rawTypes = docgen.parse(indexPath, options);

    // Process types (filter + enrich)
    const processedTypes = processComponentTypes(rawTypes, config.propFilter);

    return processedTypes;
  } catch (error) {
    console.error("Error parsing types:", error);
    throw error;
  }
}

/**
 * Parse types and write to a single output file
 * @param componentIndexPath - Path to component index file
 * @param outputPath - Path to write types JSON
 * @param propFilter - Optional custom prop filter
 */
export async function parseTypesToFile(
  componentIndexPath: string,
  outputPath: string,
  propFilter?: DocsBuilderConfig["propFilter"]
): Promise<void> {
  const processedTypes = await parseTypes({
    sources: { packagesDir: "", componentIndexPath },
    propFilter,
  });

  await fs.writeFile(outputPath, JSON.stringify(processedTypes, null, 2));
}

/**
 * Parse types and write individual component type files
 * @param componentIndexPath - Path to component index file
 * @param outputDir - Directory to write individual type files
 * @param propFilter - Optional custom prop filter
 * @returns Manifest mapping component names to filenames
 */
export async function parseTypesToFiles(
  componentIndexPath: string,
  outputDir: string,
  propFilter?: DocsBuilderConfig["propFilter"]
): Promise<Record<string, string>> {
  const processedTypes = await parseTypes({
    sources: { packagesDir: "", componentIndexPath },
    propFilter,
  });

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Write individual component type files and build manifest
  const manifest: Record<string, string> = {};

  for (const componentDoc of processedTypes) {
    const componentName = componentDoc.displayName;
    if (!componentName) continue;

    const filename = `${componentName}.json`;
    const filePath = `${outputDir}/${filename}`;

    // Write individual component type file
    await fs.writeFile(filePath, JSON.stringify(componentDoc, null, 2));

    // Add to manifest
    manifest[componentName] = filename;
  }

  // Write manifest file
  const manifestPath = `${outputDir}/manifest.json`;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  return manifest;
}
