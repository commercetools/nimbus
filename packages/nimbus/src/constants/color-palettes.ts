/**
 * Semantic color palettes used for component states and feedback.
 * These colors convey meaning and purpose in the UI (primary actions,
 * informational messages, success states, warnings, and errors).
 */
export const SEMANTIC_COLOR_PALETTES = [
  "primary",
  "neutral",
  "info",
  "positive",
  "warning",
  "critical",
] as const;

/**
 * Brand-specific color palettes for commercetools design identity.
 * These colors represent the commercetools brand and should be used
 * consistently across brand materials.
 */
export const BRAND_COLOR_PALETTES = ["ctviolet", "ctteal", "ctyellow"] as const;

/**
 * System color palettes providing a wide range of decorative options.
 * These 25 colors are interchangeable based on contrast levels and can be
 * used for data visualization, categorization, and visual variety.
 * Note: blackAlpha and whiteAlpha do not adapt to color mode.
 */
export const SYSTEM_COLOR_PALETTES = [
  "sky",
  "mint",
  "lime",
  "yellow",
  "amber",
  "orange",
  "brown",
  "gold",
  "bronze",
  "grass",
  "green",
  "jade",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "iris",
  "violet",
  "purple",
  "plum",
  "pink",
  "crimson",
  "ruby",
  "red",
  "tomato",
] as const;

/**
 * Combined array of all available color palettes in the design system.
 * Used to derive the ColorPalette union type for type-safe palette references.
 */
export const ALL_COLOR_PALETTES = [
  ...SEMANTIC_COLOR_PALETTES,
  ...BRAND_COLOR_PALETTES,
  ...SYSTEM_COLOR_PALETTES,
] as const;
