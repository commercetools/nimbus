import type { UiKitTokenEntry, UiKitTokenMap } from "../types.js";

/**
 * Converts a CSS custom property name (e.g. "--constraint-7", "--spacing-xl")
 * to its camelCase JS equivalent (e.g. "constraint7", "spacingXl").
 */
export function cssPropertyToCamelCase(cssProperty: string): string {
  const stripped = cssProperty.replace(/^--/, "");
  return stripped.replace(/-([a-z0-9])/g, (_, char: string) =>
    char.toUpperCase()
  );
}

/**
 * Category derivation rules: maps UI Kit token name prefixes to recommended
 * Nimbus token categories. Order matters — longer prefixes are checked first.
 */
const CATEGORY_RULES: Array<{ prefix: string; category: string }> = [
  { prefix: "backgroundColorFor", category: "color" },
  { prefix: "borderColorFor", category: "color" },
  { prefix: "borderRadiusFor", category: "borderRadius" },
  { prefix: "fontColorFor", category: "color" },
  { prefix: "heightFor", category: "size" },
  { prefix: "shadowFor", category: "shadow" },
  { prefix: "constraint", category: "size" },
  { prefix: "spacing", category: "spacing" },
  { prefix: "color", category: "color" },
  { prefix: "fontSize", category: "fontSize" },
  { prefix: "fontWeight", category: "fontWeight" },
  { prefix: "lineHeight", category: "lineHeight" },
  { prefix: "borderRadius", category: "borderRadius" },
  { prefix: "borderWidth", category: "borderWidth" },
  { prefix: "shadow", category: "shadow" },
];

/**
 * Derives the recommended Nimbus token category from a camelCase UI Kit token name.
 * Returns null if no category rule matches.
 */
export function deriveCategory(tokenName: string): string | null {
  for (const rule of CATEGORY_RULES) {
    if (tokenName.startsWith(rule.prefix)) {
      return rule.category;
    }
  }
  return null;
}

/**
 * Builds a UI Kit token map from a raw custom-properties.json object.
 * The input is Record<string, string> where keys are CSS custom property names
 * (e.g. "--constraint-7") and values are CSS values (e.g. "342px").
 */
export function buildUiKitTokenMap(
  customProperties: Record<string, string>
): UiKitTokenMap {
  const map: UiKitTokenMap = {};

  for (const [cssProperty, cssValue] of Object.entries(customProperties)) {
    const camelCase = cssPropertyToCamelCase(cssProperty);
    const entry: UiKitTokenEntry = {
      cssValue,
      recommendedCategory: deriveCategory(camelCase),
    };
    map[camelCase] = entry;
  }

  return map;
}
