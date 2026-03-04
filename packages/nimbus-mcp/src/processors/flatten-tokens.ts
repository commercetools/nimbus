import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single flattened design token. */
export interface FlatToken {
  /** Dot-separated token name (e.g. "spacing.400"). */
  name: string;
  /** Resolved token value (e.g. "16px"). */
  value: string;
  /** Top-level category (e.g. "spacing", "color", "fontSize"). */
  category: string;
  /** Path segments from root to this token. */
  path: string[];
}

/** Complete output of the token flattener. */
export interface FlatTokenData {
  /** All tokens in a flat list. */
  tokens: FlatToken[];
  /** Tokens grouped by category. */
  byCategory: Record<string, FlatToken[]>;
  /** Reverse-lookup: value → list of token names that resolve to it. */
  reverseLookup: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Keys that are DTCG (Design Token Community Group) metadata, not child tokens. */
const DTCG_KEYS = new Set(["$type", "$description", "$extensions"]);

/**
 * Returns true if the object is a leaf token (has `$value` or `value`).
 * The value may be a primitive or a `{ _light, _dark }` object for color tokens.
 */
function isLeafToken(obj: unknown): obj is Record<string, unknown> {
  return (
    obj !== null &&
    typeof obj === "object" &&
    ("$value" in (obj as Record<string, unknown>) ||
      "value" in (obj as Record<string, unknown>))
  );
}

/** Returns true if a token value is a `{ _light, _dark }` color-mode object. */
function isColorModeValue(
  val: unknown
): val is { _light: string; _dark: string } {
  return (
    val !== null &&
    typeof val === "object" &&
    "_light" in (val as Record<string, unknown>) &&
    "_dark" in (val as Record<string, unknown>)
  );
}

/** Extracts the raw value from a leaf token (before color-mode handling). */
function getRawTokenValue(token: Record<string, unknown>): unknown {
  return token.$value ?? token.value;
}

// ---------------------------------------------------------------------------
// Core flattening
// ---------------------------------------------------------------------------

/**
 * Recursively walks a token tree and collects all leaf tokens.
 *
 * For color tokens with `{ _light, _dark }` values, the token is stored once
 * with a combined display value like `hsl(…) / hsl(…)` and both mode values
 * are registered separately for reverse lookup.
 */
function walkTokenTree(
  node: Record<string, unknown>,
  category: string,
  pathSegments: string[],
  result: FlatToken[],
  colorModeValues: Map<string, { light: string; dark: string }>
): void {
  for (const [key, val] of Object.entries(node)) {
    if (DTCG_KEYS.has(key)) continue;

    if (isLeafToken(val)) {
      const raw = getRawTokenValue(val as Record<string, unknown>);
      const tokenPath = [...pathSegments, key];
      const tokenName = tokenPath.join(".");

      if (isColorModeValue(raw)) {
        // Store combined display value
        result.push({
          name: tokenName,
          value: `${raw._light} / ${raw._dark}`,
          category,
          path: tokenPath,
        });
        // Track both mode values for reverse-lookup enrichment
        colorModeValues.set(tokenName, {
          light: raw._light,
          dark: raw._dark,
        });
      } else {
        result.push({
          name: tokenName,
          value: String(raw),
          category,
          path: tokenPath,
        });
      }
    } else if (val !== null && typeof val === "object") {
      walkTokenTree(
        val as Record<string, unknown>,
        category,
        [...pathSegments, key],
        result,
        colorModeValues
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Hex enrichment from base tokens.json
// ---------------------------------------------------------------------------

/**
 * Walks the base tokens.json color tree and maps hex values to the
 * corresponding Chakra theme token name.
 *
 * Base tokens use `color.{group}.{palette}.light.{step}` / `…dark.{step}`
 * with hex `$value`. These map to the Chakra token `color.{group}.{palette}.{step}`.
 */
function enrichWithHexValues(
  baseColorTree: Record<string, unknown>,
  reverseLookup: Record<string, string[]>
): void {
  // Walk each color sub-group (system-palettes, brand-palettes, semantic-palettes)
  for (const [groupKey, groupVal] of Object.entries(baseColorTree)) {
    if (
      groupKey.startsWith("$") ||
      groupVal === null ||
      typeof groupVal !== "object"
    )
      continue;

    const group = groupVal as Record<string, unknown>;

    for (const [paletteKey, paletteVal] of Object.entries(group)) {
      if (
        paletteKey.startsWith("$") ||
        paletteVal === null ||
        typeof paletteVal !== "object"
      )
        continue;

      const palette = paletteVal as Record<string, unknown>;

      // Check if this palette has light/dark sub-objects (not direct $value leaves)
      for (const mode of ["light", "dark"] as const) {
        const modeObj = palette[mode];
        if (modeObj === null || typeof modeObj !== "object") continue;

        const steps = modeObj as Record<string, unknown>;
        for (const [step, stepVal] of Object.entries(steps)) {
          if (
            step.startsWith("$") ||
            stepVal === null ||
            typeof stepVal !== "object"
          )
            continue;

          const leaf = stepVal as Record<string, unknown>;
          const hexVal = leaf.$value ?? leaf.value;
          if (typeof hexVal !== "string") continue;

          const chakraTokenName = `color.${groupKey}.${paletteKey}.${step}`;
          const normalised = normaliseValue(hexVal);

          const existing = reverseLookup[normalised];
          if (existing) {
            if (!existing.includes(chakraTokenName)) {
              existing.push(chakraTokenName);
            }
          } else {
            reverseLookup[normalised] = [chakraTokenName];
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Flattens a token tree into a structured output with flat list,
 * category groups, and reverse-lookup index.
 *
 * For color tokens with `{ _light, _dark }` values, both mode values are
 * indexed in the reverse lookup pointing to the same token name.
 *
 * @param baseColorTree - Optional base tokens.json `color` subtree for hex enrichment.
 */
export function flattenTokenTree(
  tokenTree: Record<string, unknown>,
  baseColorTree?: Record<string, unknown>
): FlatTokenData {
  const tokens: FlatToken[] = [];
  const colorModeValues = new Map<string, { light: string; dark: string }>();

  for (const [topKey, topVal] of Object.entries(tokenTree)) {
    if (topVal === null || typeof topVal !== "object") continue;

    const node = topVal as Record<string, unknown>;
    walkTokenTree(node, topKey, [topKey], tokens, colorModeValues);
  }

  // Group by category
  const byCategory: Record<string, FlatToken[]> = {};
  for (const token of tokens) {
    const group = byCategory[token.category] ?? [];
    group.push(token);
    byCategory[token.category] = group;
  }

  // Build reverse-lookup (value → token names)
  const reverseLookup: Record<string, string[]> = {};
  for (const token of tokens) {
    const normalised = normaliseValue(token.value);
    const names = reverseLookup[normalised] ?? [];
    names.push(token.name);
    reverseLookup[normalised] = names;
  }

  // Add individual _light and _dark values to reverse lookup
  for (const [tokenName, modes] of colorModeValues) {
    for (const modeValue of [modes.light, modes.dark]) {
      const normalised = normaliseValue(modeValue);
      const names = reverseLookup[normalised] ?? [];
      if (!names.includes(tokenName)) {
        names.push(tokenName);
      }
      reverseLookup[normalised] = names;
    }
  }

  // Enrich reverse-lookup with hex values from base tokens
  if (baseColorTree) {
    enrichWithHexValues(baseColorTree, reverseLookup);
  }

  return { tokens, byCategory, reverseLookup };
}

/**
 * Normalises a token value for reverse-lookup matching.
 * - Lowercases
 * - Trims whitespace
 */
function normaliseValue(value: string): string {
  return value.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// File I/O
// ---------------------------------------------------------------------------

/** Default path to theme-tokens.ts relative to the monorepo root. */
function defaultThemeTokensPath(): string {
  return resolve(
    __dirname,
    "../../../../packages/tokens/src/generated/chakra/theme-tokens.ts"
  );
}

/** Default path to base tokens.json for hex enrichment. */
function defaultBaseTokensPath(): string {
  return resolve(__dirname, "../../../../packages/tokens/src/base/tokens.json");
}

/**
 * Dynamically imports a theme-tokens.ts file and returns its default export.
 */
async function loadThemeTokens(
  filePath: string
): Promise<Record<string, unknown>> {
  const mod = (await import(filePath)) as { default: Record<string, unknown> };
  return mod.default;
}

/**
 * Reads the base tokens.json and returns only the `color` subtree.
 * Returns undefined if the file doesn't exist or has no color key.
 */
async function loadBaseColorTree(
  filePath: string
): Promise<Record<string, unknown> | undefined> {
  try {
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const color = parsed.color;
    if (color !== null && typeof color === "object") {
      return color as Record<string, unknown>;
    }
  } catch {
    // Base tokens file not available — skip hex enrichment
  }
  return undefined;
}

/**
 * Loads the Chakra theme tokens and returns flattened token data,
 * optionally enriched with hex values from base tokens.json.
 *
 * @param themeTokensPath - Override for the theme-tokens.ts path.
 * @param baseTokensPath - Override for the base tokens.json path (set to `null` to skip hex enrichment).
 */
export async function flattenTokensFromFile(
  themeTokensPath?: string,
  baseTokensPath?: string | null
): Promise<FlatTokenData> {
  const themePath = themeTokensPath ?? defaultThemeTokensPath();
  const tokenTree = await loadThemeTokens(themePath);

  let baseColorTree: Record<string, unknown> | undefined;
  if (baseTokensPath !== null) {
    const basePath = baseTokensPath ?? defaultBaseTokensPath();
    baseColorTree = await loadBaseColorTree(basePath);
  }

  return flattenTokenTree(tokenTree, baseColorTree);
}

/**
 * Looks up token names by value. Returns an empty array if no match.
 *
 * @param data - Flattened token data from `flattenTokenTree` or `flattenTokensFromFile`.
 * @param value - The value to look up (e.g. "16px", "hsl(40, 60%, 99%)", "#ffc53d").
 */
export function reverseLookup(data: FlatTokenData, value: string): string[] {
  return data.reverseLookup[normaliseValue(value)] ?? [];
}
