import fs from "fs";
import path from "path";

/**
 * Injects recipe variant props into generated types.json
 *
 * This script solves the issue where RecipeVariantProps<typeof recipe>
 * is not expanded by react-docgen-typescript, causing recipe props
 * (size, variant, tone, etc.) to be invisible in the documentation.
 *
 * It works by:
 * 1. Reading the generated types.json
 * 2. For each component, checking if a recipe file exists
 * 3. Dynamically importing the recipe
 * 4. Extracting variant keys and options from the recipe definition
 * 5. Injecting those as explicit props in types.json
 */

const TYPES_FILE = "./src/data/types.json";
const NIMBUS_COMPONENTS_DIR = "./../../packages/nimbus/src/components";

// Set to true to see detailed logging about recipe discovery
const VERBOSE_LOGGING = process.env.VERBOSE === "true";

interface PropData {
  name: string;
  type: { name: string };
  defaultValue?: { value: string };
  required: boolean;
  description?: string;
}

interface ComponentData {
  displayName: string;
  description?: string;
  props?: Record<string, PropData>;
  filePath: string;
}

interface Recipe {
  variants?: Record<string, Record<string, unknown>>;
  defaultVariants?: Record<string, string>;
}

/**
 * Converts a PascalCase string to camelCase
 * Example: "NumberInput" → "numberInput"
 */
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Attempts to dynamically import a recipe for a given component
 */
async function loadRecipe(componentName: string): Promise<Recipe | null> {
  // Convert component name to kebab-case directory name
  // e.g., "AlertRoot" -> "alert", "Alert" -> "alert", "ButtonRoot" -> "button"
  const baseComponentName = componentName.replace(/Root$/, "");
  const kebabName = baseComponentName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  const possiblePaths = [
    // Standard recipe files (.tsx and .ts)
    path.join(NIMBUS_COMPONENTS_DIR, kebabName, `${kebabName}.recipe.tsx`),
    path.join(NIMBUS_COMPONENTS_DIR, kebabName, `${kebabName}.recipe.ts`),
  ];

  if (VERBOSE_LOGGING) {
    console.log(`\n🔍 Looking for recipe: ${componentName}`);
    console.log(`   Base name: ${baseComponentName}`);
    console.log(`   Kebab case: ${kebabName}`);
  }

  for (const recipePath of possiblePaths) {
    try {
      if (fs.existsSync(recipePath)) {
        if (VERBOSE_LOGGING) {
          console.log(`   Found recipe file: ${recipePath}`);
        }

        // Import from file system path - need to convert to file URL for ESM
        const fileUrl = `file://${path.resolve(recipePath)}`;
        const recipeModule = await import(fileUrl);

        // Recipe exports are typically named {component}Recipe or {component}SlotRecipe
        // Try camelCase (numberInputRecipe), kebab-case (number-inputRecipe), and all lowercase (numberinputRecipe)
        const camelCaseName = toCamelCase(baseComponentName);
        const possibleExportNames = [
          `${camelCaseName}Recipe`, // NEW: "numberInputRecipe" - most common
          `${camelCaseName}SlotRecipe`, // NEW: "numberInputSlotRecipe"
          `${kebabName}Recipe`, // "number-inputRecipe" - works for single words
          `${kebabName}SlotRecipe`, // "number-inputSlotRecipe"
          `${baseComponentName.toLowerCase()}Recipe`, // "numberinputRecipe" - all lowercase fallback
          `${baseComponentName.toLowerCase()}SlotRecipe`, // "numberinputSlotRecipe"
        ];

        if (VERBOSE_LOGGING) {
          console.log(`   Trying exports: ${possibleExportNames.join(", ")}`);
        }

        for (const exportName of possibleExportNames) {
          const recipeExport = recipeModule[exportName];
          if (recipeExport?.variants) {
            if (VERBOSE_LOGGING) {
              console.log(`   ✅ Found: ${exportName}`);
            }
            return recipeExport as Recipe;
          }
        }

        // Try default export
        if (recipeModule.default?.variants) {
          if (VERBOSE_LOGGING) {
            console.log(`   ✅ Found: default export`);
          }
          return recipeModule.default as Recipe;
        }

        if (VERBOSE_LOGGING) {
          console.log(`   ❌ No matching export found`);
        }
      }
    } catch {
      // Silently skip recipes with import errors
      // (These often have dependencies that aren't available in the doc generation context)
      if (VERBOSE_LOGGING) {
        console.log(`   ⚠️  Import error, skipping`);
      }
      continue;
    }
  }

  return null;
}

/**
 * Creates a prop definition from recipe variant data
 */
function createVariantProp(
  variantName: string,
  variantOptions: string[],
  defaultValue?: string
): PropData {
  const unionType = variantOptions.map((opt) => `"${opt}"`).join(" | ");

  return {
    name: variantName,
    type: { name: unionType },
    required: false,
    description: `Visual ${variantName} of the component${defaultValue ? ` (default: "${defaultValue}")` : ""}`,
    ...(defaultValue && {
      defaultValue: { value: `"${defaultValue}"` },
    }),
  };
}

/**
 * Main function to inject recipe props into types.json
 */
export async function injectRecipeProps() {
  console.log("🔍 Injecting recipe props into types.json...");

  // Read existing types.json
  const typesData: ComponentData[] = JSON.parse(
    fs.readFileSync(TYPES_FILE, "utf-8")
  );

  let injectedCount = 0;

  // Process each component
  for (const component of typesData) {
    // Try to load recipe for this component
    const recipe = await loadRecipe(component.displayName);

    if (!recipe || !recipe.variants) {
      continue;
    }

    // Initialize props object if it doesn't exist
    if (!component.props) {
      component.props = {};
    }

    // Extract variant keys and options from recipe
    for (const [variantName, variantOptions] of Object.entries(
      recipe.variants
    )) {
      const optionKeys = Object.keys(variantOptions);
      const defaultValue = recipe.defaultVariants?.[variantName];

      // Only inject if the prop doesn't already exist explicitly
      if (!component.props[variantName]) {
        component.props[variantName] = createVariantProp(
          variantName,
          optionKeys,
          defaultValue
        );
        injectedCount++;
        console.log(
          `  ✓ Injected ${variantName} prop into ${component.displayName}`
        );
      }
    }
  }

  // Write updated types.json
  fs.writeFileSync(TYPES_FILE, JSON.stringify(typesData, null, 2));
  console.log(
    `✨ Successfully injected ${injectedCount} recipe props into types.json\n`
  );
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  injectRecipeProps().catch(console.error);
}
