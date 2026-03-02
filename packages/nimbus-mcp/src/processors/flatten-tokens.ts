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
// DTCG helpers
// ---------------------------------------------------------------------------

/** Keys that are DTCG metadata, not child tokens. */
const DTCG_KEYS = new Set(["$type", "$description", "$extensions"]);

/** Returns true if the object is a DTCG leaf token (has `$value` or `value`). */
function isLeafToken(obj: unknown): obj is Record<string, unknown> {
  return (
    obj !== null &&
    typeof obj === "object" &&
    ("$value" in (obj as Record<string, unknown>) ||
      "value" in (obj as Record<string, unknown>))
  );
}

/** Extracts the resolved value string from a leaf token. */
function getTokenValue(token: Record<string, unknown>): string {
  const raw = token.$value ?? token.value;
  return String(raw);
}

// ---------------------------------------------------------------------------
// Core flattening
// ---------------------------------------------------------------------------

/**
 * Recursively walks a DTCG token tree and collects all leaf tokens.
 *
 * For color tokens with light/dark structure, both modes are included with
 * the mode as part of the path (e.g. `color.system-palettes.amber.light.1`).
 */
function walkTokenTree(
  node: Record<string, unknown>,
  category: string,
  pathSegments: string[],
  result: FlatToken[]
): void {
  for (const [key, val] of Object.entries(node)) {
    if (DTCG_KEYS.has(key)) continue;

    if (isLeafToken(val)) {
      const tokenPath = [...pathSegments, key];
      result.push({
        name: tokenPath.join("."),
        value: getTokenValue(val as Record<string, unknown>),
        category,
        path: tokenPath,
      });
    } else if (val !== null && typeof val === "object") {
      walkTokenTree(
        val as Record<string, unknown>,
        category,
        [...pathSegments, key],
        result
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Flattens a DTCG token tree into a structured output with flat list,
 * category groups, and reverse-lookup index.
 */
export function flattenTokenTree(
  tokenTree: Record<string, unknown>
): FlatTokenData {
  const tokens: FlatToken[] = [];

  for (const [topKey, topVal] of Object.entries(tokenTree)) {
    if (topVal === null || typeof topVal !== "object") continue;

    const node = topVal as Record<string, unknown>;
    // The top-level key is the category (e.g. "spacing", "color", "fontSize")
    walkTokenTree(node, topKey, [topKey], tokens);
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

  return { tokens, byCategory, reverseLookup };
}

/**
 * Normalises a token value for reverse-lookup matching.
 * - Lowercases hex colours
 * - Trims whitespace
 */
function normaliseValue(value: string): string {
  return value.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// File I/O
// ---------------------------------------------------------------------------

/** Default path to tokens.json relative to the monorepo root. */
function defaultTokensPath(): string {
  // From src/processors/ → ../../../.. gets to monorepo root
  return resolve(__dirname, "../../../../packages/tokens/src/base/tokens.json");
}

/**
 * Reads tokens.json and returns the flattened token data.
 *
 * @param tokensPath - Optional override for the tokens.json path.
 */
export async function flattenTokensFromFile(
  tokensPath?: string
): Promise<FlatTokenData> {
  const filePath = tokensPath ?? defaultTokensPath();
  const raw = await readFile(filePath, "utf-8");
  const tokenTree = JSON.parse(raw) as Record<string, unknown>;
  return flattenTokenTree(tokenTree);
}

/**
 * Looks up token names by value. Returns an empty array if no match.
 *
 * @param data - Flattened token data from `flattenTokenTree` or `flattenTokensFromFile`.
 * @param value - The value to look up (e.g. "16px", "#ffc53d").
 */
export function reverseLookup(data: FlatTokenData, value: string): string[] {
  return data.reverseLookup[normaliseValue(value)] ?? [];
}
