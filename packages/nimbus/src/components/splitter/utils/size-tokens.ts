import { themeTokens } from "@commercetools/nimbus-tokens";

/**
 * The curated set of `sizes` design tokens accepted by
 * `useResponsiveSplitterSizes` as size values and threshold keys: the named
 * t-shirt scale (`3xs`–`8xl`) and the `breakpoint-*` sizes.
 *
 * Hand-authored on purpose — deriving from `keyof typeof themeTokens.size` would
 * also pull in the numeric scale (`"25"`…`"9600"`), which both pollutes
 * autocomplete and makes a string like `"400"` ambiguous against the pixel
 * `number` `400`. A unit test asserts every member still exists in
 * `themeTokens.size`, so a token rename/removal becomes a build failure rather
 * than a silent runtime miss.
 */
export const SPLITTER_SIZE_TOKENS = [
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "breakpoint-sm",
  "breakpoint-md",
  "breakpoint-lg",
  "breakpoint-xl",
  "breakpoint-2xl",
] as const;

/** A size token name accepted by `useResponsiveSplitterSizes`. */
export type SplitterSizeToken = (typeof SPLITTER_SIZE_TOKENS)[number];

const TOKEN_SET: ReadonlySet<string> = new Set(SPLITTER_SIZE_TOKENS);

/** Type guard: is `value` one of the curated splitter size tokens? */
export const isSplitterSizeToken = (
  value: unknown
): value is SplitterSizeToken =>
  typeof value === "string" && TOKEN_SET.has(value);

/**
 * Resolve a size token to its pixel value via `themeTokens.size`. Returns `null`
 * when the token is missing or its value is not a finite pixel number.
 *
 * @example
 * resolveTokenToPx("breakpoint-sm"); // → 480
 * resolveTokenToPx("md");            // → 448
 */
export const resolveTokenToPx = (token: SplitterSizeToken): number | null => {
  const entry = (
    themeTokens.size as Record<string, { value: string } | undefined>
  )[token];
  if (!entry) return null;
  const px = parseFloat(entry.value);
  return Number.isFinite(px) ? px : null;
};
