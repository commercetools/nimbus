import fs from "fs";
import debounce from "lodash/debounce";
import docgen from "react-docgen-typescript";
import path from "path";

export const flog = (str: any) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

// Thats where compiled docs will be saved
const compiledTypesFile = "./src/data/types.json";

// Main entry point for parsing
const fileToGrabTypesFrom: string = "./../../packages/nimbus/src/index.ts";
const componentsDir = "./../../packages/nimbus/src/components";

// Automatically find all component .tsx files
const findComponentFiles = (dir: string): string[] => {
  const componentFiles: string[] = [];

  const scanDirectory = (currentDir: string) => {
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);

        if (item.isDirectory()) {
          scanDirectory(fullPath);
        } else if (
          item.isFile() &&
          item.name.endsWith(".tsx") &&
          !item.name.includes(".test.") &&
          !item.name.includes(".spec.") &&
          !item.name.includes(".slots.") &&
          !item.name.includes(".recipe.")
        ) {
          // Only include main component files, not slots, recipes, or test files
          componentFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Could not scan directory ${currentDir}:`, error);
    }
  };

  scanDirectory(dir);
  return componentFiles;
};

// Detect components that likely have poor type resolution (few props detected)
const hasValidComponent = (results: any[]): boolean => {
  return (
    results.length > 0 &&
    results.some((r) => r.displayName && Object.keys(r.props || {}).length > 0)
  );
};

const hasPoorTypeResolution = (componentResult: any): boolean => {
  if (!componentResult || !componentResult.props) return false;

  // Skip hooks and non-component exports
  const displayName = componentResult.displayName || "";
  if (
    displayName.startsWith("use") ||
    displayName.endsWith("Props") ||
    displayName.includes("Context")
  ) {
    return false;
  }

  const propCount = Object.keys(componentResult.props).length;
  // If component has very few props, it likely has poor type resolution
  // Most React components should have at least a few props (children, className, etc.)
  return propCount < 15; // Increased threshold for better detection
};

const writeDocs = debounce(() => {
  const options = {
    savePropValueAsString: true,
    propFilter: (prop: any) => {
      // Filter out some clearly unwanted props but be less aggressive
      const isDOMAttribute = prop.parent?.name === "DOMAttributes";
      const isChackraSystemProperty = prop.parent?.name === "SystemProperties";

      // Only filter these specific cases
      if (isDOMAttribute || isChackraSystemProperty) {
        return false;
      }

      // Include everything else - AriaButtonProps, HTMLAttributes, etc.
      return true;
    },
    // Enhanced type resolution options
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    shouldRemoveUndefinedFromOptional: true,
    // Additional options for complex types
    skipChildrenPropWithoutDoc: false, // Include children prop
    componentNameResolver: (exp: any, source: any) => {
      // Help with proper component name resolution
      return exp.getName();
    },
  };

  // Try withDefaultConfig for simpler, more reliable type resolution
  const parser = docgen.withDefaultConfig(options);

  // Parse main index for general components
  let allResults = parser.parse(fileToGrabTypesFrom);

  // Find all component files
  const allComponentFiles = findComponentFiles(componentsDir);

  // Automatically detect and re-parse components with poor type resolution
  const componentsNeedingEnhancement: string[] = [];

  for (const componentResult of allResults) {
    if (hasPoorTypeResolution(componentResult)) {
      // Find the corresponding component file
      const componentFile = allComponentFiles.find((file) => {
        const fileName = path.basename(file, ".tsx").toLowerCase();
        const componentName = componentResult.displayName?.toLowerCase();

        // Try exact filename match first
        if (fileName === componentName) return true;

        // Try directory-based match (e.g., /button/button.tsx)
        if (file.includes(`/${componentName}/`) && fileName === componentName)
          return true;

        // Try component in its own directory
        const dirName = path.basename(path.dirname(file)).toLowerCase();
        if (dirName === componentName && fileName === componentName)
          return true;

        return false;
      });

      if (componentFile) {
        componentsNeedingEnhancement.push(componentFile);
      }
    }
  }

  // Re-parse components with enhanced individual parsing
  for (const componentFile of componentsNeedingEnhancement) {
    try {
      const componentResults = parser.parse(componentFile);
      // Merge results, replacing any duplicates with the individual parsing results
      componentResults.forEach((newResult) => {
        const existingIndex = allResults.findIndex(
          (existing) => existing.displayName === newResult.displayName
        );
        if (existingIndex >= 0) {
          const oldPropCount = Object.keys(
            allResults[existingIndex].props || {}
          ).length;
          const newPropCount = Object.keys(newResult.props || {}).length;

          if (newPropCount > oldPropCount) {
            allResults[existingIndex] = newResult; // Replace with better resolution
            flog(
              `[AUTO-ENHANCED] Improved ${newResult.displayName}: ${oldPropCount} → ${newPropCount} props`
            );
          }
        } else {
          allResults.push(newResult); // Add new component
        }
      });
    } catch (error) {
      console.warn(
        `Failed to auto-enhance ${componentFile}:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  fs.writeFileSync(compiledTypesFile, JSON.stringify(allResults, null, 2));
  flog("[TSX] Prop tables updated");

  // Log summary of auto-enhanced components
  if (componentsNeedingEnhancement.length > 0) {
    const enhancedNames = componentsNeedingEnhancement.map((file) => {
      const baseName = path.basename(file, ".tsx");
      return baseName.charAt(0).toUpperCase() + baseName.slice(1);
    });
    flog(
      `Auto-enhanced ${componentsNeedingEnhancement.length} components: ${enhancedNames.join(", ")}`
    );
  }
}, 500);

const observable = (target: any, callback: any, _base: any[] = []) => {
  for (const key in target) {
    if (typeof target[key] === "object")
      target[key] = observable(target[key], callback, [..._base, key]);
  }
  return new Proxy(target, {
    set(target, key, value) {
      if (typeof value === "object")
        value = observable(value, callback, [..._base, key as string]);
      callback([..._base, key], (target[key as string] = value));
      return value;
    },
  });
};

const typesObj = observable({}, writeDocs);

export const parseTypes = async (filePath: string) => {
  // Skip files from node_modules to avoid duplicated IDs
  if (filePath.includes("node_modules")) {
    return;
  }

  fs.readFile(filePath, "utf8", async (err, content) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }
    typesObj[filePath] = true;
  });
};
