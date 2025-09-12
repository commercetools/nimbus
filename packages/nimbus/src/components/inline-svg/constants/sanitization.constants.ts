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
];

/**
 * Protocols allowed in URL attributes
 */
export const ALLOWED_PROTOCOLS = ["http:", "https:", "#", "//"];
