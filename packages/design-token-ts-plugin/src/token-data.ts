/**
 * Loads design token data from @commercetools/nimbus-tokens and builds
 * lookup maps for enriching autocomplete with CSS values.
 *
 * Also loads a generated mapping for tokens that aren't simple key→string pairs:
 * semantic colors (bg, fg, border.*), textStyles, layerStyles, letterSpacing.
 */

/** category name → { token name → CSS value string } */
export type CategoryValues = Record<string, Record<string, string>>;

/** category name → Set of all token names in that category */
export type CategorySets = Record<string, Set<string>>;

export interface TokenData {
  categoryValues: CategoryValues;
  categorySets: CategorySets;
}

/** Shape of the generated-token-mapping.json file */
interface GeneratedTokenMapping {
  semanticColors: Record<string, string>;
  textStyles: Record<string, string>;
  layerStyles: Record<string, string>;
  letterSpacing: Record<string, string>;
}

/**
 * Attempt to load tokens and build lookup maps.
 * Returns undefined if token loading fails (graceful degradation).
 */
function loadDesignTokens(): Record<string, unknown> | undefined {
  // Try main entrypoint first
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@commercetools/nimbus-tokens");
    if (mod.designTokens) return mod.designTokens;
  } catch {
    // Main entrypoint may fail in some Node/ESM contexts
  }

  // Fallback: resolve the package directory and load the generated CJS entrypoint
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    // Resolve any file from the package to find its directory
    // Use require.resolve with paths to find the package location
    const mainPath = require.resolve("@commercetools/nimbus-tokens");
    // mainPath is something like .../packages/tokens/dist/commercetools-nimbus-tokens.esm.js
    // Navigate up to the package root, then down to the generated CJS file
    const distDir = path.dirname(mainPath);
    const pkgDir = path.dirname(distDir);
    const generatedCjsPath = path.join(
      pkgDir,
      "generated/ts/dist/commercetools-nimbus-tokens-generated-ts.cjs.dev.js"
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(generatedCjsPath);
    if (mod.designTokens) return mod.designTokens;
  } catch {
    // Fallback also failed
  }

  return undefined;
}

/**
 * Load the generated token mapping JSON from the same directory as the compiled plugin.
 * Falls back to undefined if the file doesn't exist (graceful degradation).
 */
function loadGeneratedMapping(): GeneratedTokenMapping | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const mappingPath = path.join(__dirname, "generated-token-mapping.json");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(mappingPath) as GeneratedTokenMapping;
  } catch {
    return undefined;
  }
}

export function loadTokenData(): TokenData | undefined {
  try {
    const tokens = loadDesignTokens();
    if (!tokens) return undefined;

    const categoryValues: CategoryValues = {};
    const categorySets: CategorySets = {};

    // Simple flat categories: key → string value
    const flatCategories: Record<string, string> = {
      spacing: "spacing",
      blur: "blurs",
      borderRadius: "radii",
      borderWidth: "borderWidths",
      fontSize: "fontSizes",
      lineHeight: "lineHeights",
      size: "sizes",
      border: "borders",
      shadow: "shadows",
      duration: "durations",
      easing: "easings",
      fontFamily: "fonts",
      breakpoints: "breakpoints",
    };

    for (const [tokenKey, categoryName] of Object.entries(flatCategories)) {
      const data = tokens[tokenKey];
      if (!data || typeof data !== "object") continue;

      const values: Record<string, string> = {};
      for (const [name, val] of Object.entries(data)) {
        if (typeof val === "string") {
          values[name] = val;
        } else if (typeof val === "number") {
          values[name] = String(val);
        }
        // Skip composite objects (e.g. textStyle entries, letterSpacing with {value})
      }
      if (Object.keys(values).length > 0) {
        categoryValues[categoryName] = values;
        categorySets[categoryName] = new Set(Object.keys(values));
      }
    }

    // Spacing: also generate negative tokens
    if (categoryValues["spacing"]) {
      const negValues: Record<string, string> = {
        ...categoryValues["spacing"],
      };
      for (const [name, val] of Object.entries(categoryValues["spacing"])) {
        // Only negate numeric token names
        if (/^\d+$/.test(name) && val.endsWith("px")) {
          const px = parseFloat(val);
          negValues[`-${name}`] = `-${px}px`;
        }
      }
      categoryValues["spacing"] = negValues;
      categorySets["spacing"] = new Set(Object.keys(negValues));
    }

    // Font weight: numeric values
    if (tokens.fontWeight && typeof tokens.fontWeight === "object") {
      const values: Record<string, string> = {};
      for (const [name, val] of Object.entries(tokens.fontWeight)) {
        if (typeof val === "number") {
          values[name] = String(val);
        } else if (typeof val === "string") {
          values[name] = val;
        }
      }
      if (Object.keys(values).length > 0) {
        categoryValues["fontWeights"] = values;
        categorySets["fontWeights"] = new Set(Object.keys(values));
      }
    }

    // Opacity: numeric values
    if (tokens.opacity && typeof tokens.opacity === "object") {
      const values: Record<string, string> = {};
      for (const [name, val] of Object.entries(tokens.opacity)) {
        if (typeof val === "number") {
          values[name] = String(val);
        } else if (typeof val === "string") {
          values[name] = val;
        }
      }
      if (Object.keys(values).length > 0) {
        categoryValues["opacity"] = values;
        categorySets["opacity"] = new Set(Object.keys(values));
      }
    }

    // Colors: flatten nested structure into dot-notation keys
    // The color object has sub-groups: "blacks-and-whites", "system-palettes",
    // "brand-palettes", "semantic-palettes"
    if (tokens.color && typeof tokens.color === "object") {
      const colorValues: Record<string, string> = {};

      for (const groupObj of Object.values(tokens.color)) {
        if (!groupObj || typeof groupObj !== "object") continue;
        flattenColors(groupObj as Record<string, unknown>, "", colorValues);
      }

      if (Object.keys(colorValues).length > 0) {
        categoryValues["colors"] = colorValues;
        categorySets["colors"] = new Set(Object.keys(colorValues));
      }
    }

    // zIndex
    if (tokens.zIndex && typeof tokens.zIndex === "object") {
      const values: Record<string, string> = {};
      for (const [name, val] of Object.entries(tokens.zIndex)) {
        if (typeof val === "number") {
          values[name] = String(val);
        } else if (typeof val === "string") {
          values[name] = val;
        }
      }
      if (Object.keys(values).length > 0) {
        categoryValues["zIndex"] = values;
        categorySets["zIndex"] = new Set(Object.keys(values));
      }
    }

    // Load generated token mapping for semantic colors, composite tokens, etc.
    const mapping = loadGeneratedMapping();
    if (mapping) {
      // Merge semantic colors into existing colors category
      if (mapping.semanticColors) {
        if (!categoryValues["colors"]) {
          categoryValues["colors"] = {};
        }
        Object.assign(categoryValues["colors"], mapping.semanticColors);
        categorySets["colors"] = new Set(Object.keys(categoryValues["colors"]));
      }

      // Add textStyles category
      if (mapping.textStyles && Object.keys(mapping.textStyles).length > 0) {
        categoryValues["textStyles"] = mapping.textStyles;
        categorySets["textStyles"] = new Set(Object.keys(mapping.textStyles));
      }

      // Add layerStyles category
      if (mapping.layerStyles && Object.keys(mapping.layerStyles).length > 0) {
        categoryValues["layerStyles"] = mapping.layerStyles;
        categorySets["layerStyles"] = new Set(Object.keys(mapping.layerStyles));
      }

      // Add letterSpacing category
      if (
        mapping.letterSpacing &&
        Object.keys(mapping.letterSpacing).length > 0
      ) {
        categoryValues["letterSpacing"] = mapping.letterSpacing;
        categorySets["letterSpacing"] = new Set(
          Object.keys(mapping.letterSpacing)
        );
      }
    }

    return { categoryValues, categorySets };
  } catch {
    // Token loading failed — plugin degrades gracefully
    return undefined;
  }
}

/**
 * Recursively flatten a color object into dot-notation keys.
 * For light/dark structures, show both values as "<light> / <dark> (d)".
 * E.g. { amber: { light: { "1": "hsl(a)" }, dark: { "1": "hsl(b)" } } }
 *   → "amber.1" → "hsl(a) / hsl(b) (d)"
 * E.g. { black: "hsl(...)" } → "black" → "hsl(...)"
 */
function flattenColors(
  obj: Record<string, unknown>,
  prefix: string,
  result: Record<string, string>
): void {
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof val === "string") {
      result[fullKey] = val;
    } else if (val && typeof val === "object") {
      const record = val as Record<string, unknown>;

      // If this object has "light" and "dark" keys, merge both
      if ("light" in record && "dark" in record) {
        const lightObj = record.light as Record<string, unknown> | undefined;
        const darkObj = record.dark as Record<string, unknown> | undefined;
        const colorPrefix = prefix ? `${prefix}.${key}` : key;

        if (lightObj && typeof lightObj === "object") {
          for (const [step, lightVal] of Object.entries(lightObj)) {
            if (typeof lightVal !== "string") continue;
            const darkVal = darkObj?.[step];
            const stepKey = `${colorPrefix}.${step}`;
            if (typeof darkVal === "string" && darkVal !== lightVal) {
              result[stepKey] = `${lightVal} / ${darkVal} (d)`;
            } else {
              result[stepKey] = lightVal;
            }
          }
        }
      } else {
        // Regular nested object — recurse
        flattenColors(record, fullKey, result);
      }
    }
  }
}
