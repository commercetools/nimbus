/**
 * Tags that are forbidden in SVG content for security reasons
 */
export const DEFAULT_FORBIDDEN_TAGS = [
  "script",
  "style",
  "iframe",
  "embed",
  "object",
  "applet",
  "link",
  "base",
  "meta",
] as const;

/**
 * Attributes that are forbidden in SVG content for security reasons
 */
export const DEFAULT_FORBIDDEN_ATTRIBUTES = [
  /*
   * Note: Event handlers (attributes starting with "on") are blocked by pattern matching
   * in sanitize-svg.ts rather than being listed here explicitly
   * */
  "style", // Unless explicitly allowed
  "href", // Will be sanitized separately
  "xlink:href", // Will be sanitized separately
] as const;

/**
 * Protocols allowed in URL attributes
 */
export const ALLOWED_PROTOCOLS = ["http:", "https:", "#", "//"] as const;
