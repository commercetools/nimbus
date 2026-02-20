/**
 * Generates a JSON mapping file containing resolved/formatted values for tokens
 * that the TS plugin can't handle from designTokens alone:
 * - Semantic colors (bg, fg, border.*) with resolved light-mode values
 * - Text styles formatted as "fontSize: Xpx, lineHeight: Ypx"
 * - Layer styles formatted as "prop1: val1, prop2: val2"
 * - Letter spacing unwrapped from {value: "..."} format
 *
 * Reads semantic colors and layer styles from their source .ts files so the
 * mapping stays in sync without hardcoding definitions.
 *
 * Run after `build:tokens` — consumes @commercetools/nimbus-tokens.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../src/generated-token-mapping.json");

/** Path to the nimbus theme source files (relative to this script) */
const SEMANTIC_COLORS_PATH = join(
  __dirname,
  "../../nimbus/src/theme/semantic-tokens/colors.ts"
);
const LAYER_STYLES_PATH = join(
  __dirname,
  "../../nimbus/src/theme/layer-styles.ts"
);

async function main() {
  const { designTokens, themeTokens } = await import(
    "@commercetools/nimbus-tokens"
  );

  const colorLookup = buildColorLookup(designTokens.color);
  const semanticColors = resolveSemanticColors(colorLookup, themeTokens);
  const textStyles = formatTextStyles(designTokens.textStyle);
  const layerStyles = loadAndFormatLayerStyles();
  const letterSpacing = unwrapLetterSpacing(designTokens.letterSpacing);

  const mapping = { semanticColors, textStyles, layerStyles, letterSpacing };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(mapping, null, 2) + "\n");
  // eslint-disable-next-line no-console
  console.log(`Generated token mapping → ${OUTPUT_PATH}`);
}

// ---------------------------------------------------------------------------
// Color lookup
// ---------------------------------------------------------------------------

/**
 * Build a flat lookup: "paletteName.step" → "hsl(...)" using light-mode values.
 */
function buildColorLookup(colorObj) {
  const lookup = {};
  if (!colorObj || typeof colorObj !== "object") return lookup;

  for (const group of Object.values(colorObj)) {
    if (!group || typeof group !== "object") continue;

    for (const [paletteName, palette] of Object.entries(group)) {
      if (typeof palette === "string") {
        lookup[paletteName] = palette;
        continue;
      }
      if (!palette || typeof palette !== "object") continue;

      if ("light" in palette && "dark" in palette) {
        for (const [step, value] of Object.entries(palette.light)) {
          if (typeof value === "string") {
            lookup[`${paletteName}.${step}`] = value;
          }
        }
      } else {
        for (const [step, value] of Object.entries(palette)) {
          if (typeof value === "string") {
            lookup[`${paletteName}.${step}`] = value;
          }
        }
      }
    }
  }

  return lookup;
}

/**
 * Resolve a Chakra token reference like "{colors.neutral.12}" against the lookup.
 */
function resolveRef(ref, lookup) {
  const match = ref.match(/^\{colors\.(.+)\}$/);
  if (!match) return ref;
  return lookup[match[1]] || ref;
}

// ---------------------------------------------------------------------------
// Semantic colors — read from source file
// ---------------------------------------------------------------------------

/**
 * Extract the object literal body from a `defineXxx(...)` call in a TS source file.
 * Returns the raw JS object string between the outermost `{` and `}`.
 */
function extractObjectFromDefineCall(source, fnCallPrefix) {
  const markerIdx = source.indexOf(fnCallPrefix);
  if (markerIdx === -1) return undefined;

  let depth = 0;
  let objStart = -1;
  let objEnd = -1;

  for (let i = markerIdx + fnCallPrefix.length; i < source.length; i++) {
    if (source[i] === "{") {
      if (depth === 0) objStart = i;
      depth++;
    } else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        objEnd = i + 1;
        break;
      }
    }
  }

  if (objStart === -1 || objEnd === -1) return undefined;
  return source.substring(objStart, objEnd);
}

/**
 * Read semantic color definitions from the nimbus theme source and resolve
 * token references to light-mode CSS values.
 *
 * The source file uses `defineSemanticTokens.colors({...})` which is a type-only
 * wrapper, plus spreads of `themeTokens.color["*-palettes"]` for palette colors.
 * We evaluate the object with real themeTokens and then filter out palette keys
 * to keep only the semantic shortcuts (bg, fg, border.*).
 */
function resolveSemanticColors(colorLookup, themeTokens) {
  let source;
  try {
    source = readFileSync(SEMANTIC_COLORS_PATH, "utf-8");
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      `Could not read ${SEMANTIC_COLORS_PATH}, skipping semantic colors`
    );
    return {};
  }

  const objSource = extractObjectFromDefineCall(
    source,
    "defineSemanticTokens.colors("
  );
  if (!objSource) {
    // eslint-disable-next-line no-console
    console.warn(
      "Could not extract object from defineSemanticTokens.colors(), skipping semantic colors"
    );
    return {};
  }

  // Evaluate the object literal with themeTokens in scope.
  // The spread operators (...themeTokens.color["system-palettes"]) will use the
  // real themeTokens passed as a parameter.
  let fullDef;
  try {
    const fn = new Function("themeTokens", `return (${objSource});`);
    fullDef = fn(themeTokens);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Could not evaluate semantic colors object:", e.message);
    return {};
  }

  // Identify palette keys that came from the spread operators — these are
  // already handled by the plugin's existing color flattening logic.
  const paletteKeys = new Set([
    ...Object.keys(themeTokens.color?.["system-palettes"] || {}),
    ...Object.keys(themeTokens.color?.["brand-palettes"] || {}),
    ...Object.keys(themeTokens.color?.["semantic-palettes"] || {}),
  ]);

  // Keep only the semantic shortcuts (bg, fg, border, etc.)
  const semanticDefs = {};
  for (const [key, val] of Object.entries(fullDef)) {
    if (!paletteKeys.has(key)) {
      semanticDefs[key] = val;
    }
  }

  // Flatten nested structure and resolve token references
  const result = {};
  flattenSemanticTokenDefs(semanticDefs, "", result, colorLookup);
  return result;
}

/**
 * Recursively flatten Chakra semantic token definitions into a flat map.
 *
 * Structure: `{ border: { DEFAULT: { value: "..." }, muted: { value: "..." } } }`
 * → `{ "border": "resolved", "border.muted": "resolved" }`
 *
 * DEFAULT means use the parent key name. `value` is either a string reference
 * or an object with `_light`/`_dark` keys (use `_light`).
 */
function flattenSemanticTokenDefs(obj, prefix, result, lookup) {
  for (const [key, val] of Object.entries(obj)) {
    if (!val || typeof val !== "object") continue;

    const name =
      key === "DEFAULT" ? prefix : prefix ? `${prefix}.${key}` : key;

    if ("value" in val) {
      // Leaf node: { value: "..." } or { value: { _light, _dark } }
      const rawValue = val.value;

      if (typeof rawValue === "string") {
        result[name] = resolveRef(rawValue, lookup);
      } else if (
        rawValue &&
        typeof rawValue === "object" &&
        "_light" in rawValue
      ) {
        const lightVal = rawValue._light;
        result[name] =
          typeof lightVal === "string" && lightVal.startsWith("{")
            ? resolveRef(lightVal, lookup)
            : String(lightVal);
      }
    } else {
      // Nested group — recurse
      flattenSemanticTokenDefs(val, name, result, lookup);
    }
  }
}

// ---------------------------------------------------------------------------
// Layer styles — read from source file
// ---------------------------------------------------------------------------

/**
 * Read layer style definitions from the nimbus theme source and format
 * each as a "prop: val, prop: val" display string.
 *
 * The source uses `defineLayerStyles({...})` which is a type-only wrapper.
 */
function loadAndFormatLayerStyles() {
  let source;
  try {
    source = readFileSync(LAYER_STYLES_PATH, "utf-8");
  } catch {
    // eslint-disable-next-line no-console
    console.warn(
      `Could not read ${LAYER_STYLES_PATH}, skipping layer styles`
    );
    return {};
  }

  const objSource = extractObjectFromDefineCall(source, "defineLayerStyles(");
  if (!objSource) {
    // eslint-disable-next-line no-console
    console.warn(
      "Could not extract object from defineLayerStyles(), skipping layer styles"
    );
    return {};
  }

  let layerDef;
  try {
    const fn = new Function(`return (${objSource});`);
    layerDef = fn();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Could not evaluate layer styles object:", e.message);
    return {};
  }

  // Format each layer style: { value: { opacity: "0.5", ... } } → "opacity: 0.5, ..."
  const result = {};
  for (const [name, entry] of Object.entries(layerDef)) {
    if (entry && typeof entry === "object" && "value" in entry) {
      const valueObj = entry.value;
      if (valueObj && typeof valueObj === "object") {
        result[name] = Object.entries(valueObj)
          .map(([prop, val]) => `${prop}: ${val}`)
          .join(", ");
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Text styles & letter spacing — from designTokens
// ---------------------------------------------------------------------------

/**
 * Format textStyle composites into display strings.
 * e.g. { fontSize: "14px", lineHeight: "22px" } → "fontSize: 14px, lineHeight: 22px"
 */
function formatTextStyles(textStyleObj) {
  if (!textStyleObj || typeof textStyleObj !== "object") return {};

  const result = {};
  for (const [name, value] of Object.entries(textStyleObj)) {
    if (value && typeof value === "object") {
      result[name] = Object.entries(value)
        .map(([prop, val]) => `${prop}: ${val}`)
        .join(", ");
    }
  }
  return result;
}

/**
 * Unwrap letterSpacing from {value: "..."} format.
 */
function unwrapLetterSpacing(letterSpacingObj) {
  if (!letterSpacingObj || typeof letterSpacingObj !== "object") return {};

  const result = {};
  for (const [name, value] of Object.entries(letterSpacingObj)) {
    if (value && typeof value === "object" && "value" in value) {
      result[name] = value.value;
    } else if (typeof value === "string") {
      result[name] = value;
    }
  }
  return result;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to generate token mapping:", err);
  process.exit(1);
});
