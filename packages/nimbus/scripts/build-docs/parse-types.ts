/**
 * TypeScript Props Parser
 *
 * Extracts component prop types using react-docgen-typescript
 * with access to proper tsconfig paths
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import docgen from "react-docgen-typescript";
import type { ComponentDoc } from "react-docgen-typescript";
import { flog } from "./parse-mdx";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Determines whether a prop should be filtered out of documentation.
 * Returns true if the prop should be KEPT, false if it should be FILTERED.
 */
const shouldFilterProp = (prop: {
  name: string;
  parent?: { name?: string };
}): boolean => {
  // React Key attribute
  const isReactKeyAttribute = prop.name === "key";

  // All HTML attributes
  const isHTMLAttribute = prop.parent?.name === "HTMLAttributes";

  // HTML-Event listener
  const isDOMAttribute = prop.parent?.name === "DOMAttributes";

  // ButtonHTMLAttributes
  const isButtonAttribute = prop.parent?.name === "ButtonHTMLAttributes";

  // GlobalDOMEvents
  const isGlobalDOMEvent = prop.parent?.name === "GlobalDOMEvents";

  // GlobalDOMAttribute
  const isGlobalDOMAttribute = prop.parent?.name === "GlobalDOMAttributes";

  // Chakra related props
  const isChakraSystemProperty = prop.parent?.name === "SystemProperties";
  const isChakraCondition = prop.parent?.name === "Conditions";
  const isSlotRecipeDefinition = prop.name === "recipe";

  // Default accessibility props
  const isAriaAttribute = prop.parent?.name === "AriaAttributes";

  // HTML fallback props
  const isHtmlFallbackProp = prop.parent?.name === "HtmlProps";

  // Exclude redundant props
  if (
    isReactKeyAttribute ||
    isHTMLAttribute ||
    isDOMAttribute ||
    isButtonAttribute ||
    isGlobalDOMEvent ||
    isGlobalDOMAttribute ||
    isAriaAttribute ||
    isChakraSystemProperty ||
    isChakraCondition ||
    isSlotRecipeDefinition ||
    isHtmlFallbackProp
  ) {
    return false;
  }

  // Keep all other props
  return true;
};

/**
 * Enrich component with metadata based on JSDoc tags and props
 */
const enrichComponent = (component: ComponentDoc): Record<string, unknown> => {
  // Check if component has @supportsStyleProps JSDoc tag
  const supportsStyleProps = "supportsStyleProps" in (component.tags || {});

  return {
    supportsStyleProps,
  };
};

/**
 * Process parsed component types in a single pass
 */
const processComponentTypes = (
  rawParsedTypes: ComponentDoc[]
): ComponentDoc[] => {
  return rawParsedTypes.map((component) => {
    // Step 1: Filter props
    const filteredProps = Object.fromEntries(
      Object.entries(component.props).filter(([, prop]) =>
        shouldFilterProp(prop)
      )
    );

    // Step 2: Generate component-level metadata from JSDoc tags and filtered props
    const metadata = enrichComponent(component);

    // Step 3: Return component with metadata and filtered props
    return {
      ...component,
      ...metadata,
      props: filteredProps,
    };
  });
};

/**
 * Parse TypeScript files and extract component props
 */
export async function parseTypes(outputPath: string): Promise<void> {
  try {
    const indexPath = path.resolve(__dirname, "../../src/index.ts");

    // Configure parser options
    const options = {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    };

    flog("[TSX] Parsing component types...");

    // Parse all types from the index file
    const rawTypes = docgen.parse(indexPath, options);

    // Process types (filter + enrich)
    const processedTypes = processComponentTypes(rawTypes);

    // Write to output file
    await fs.writeFile(outputPath, JSON.stringify(processedTypes, null, 2));

    flog(`[TSX] Parsed ${processedTypes.length} component types`);
  } catch (error) {
    console.error("Error parsing types:", error);
    throw error;
  }
}
