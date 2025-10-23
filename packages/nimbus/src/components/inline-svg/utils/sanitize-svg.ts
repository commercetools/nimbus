import DOMPurify from "dompurify";
import { DEFAULT_FORBIDDEN_TAGS } from "../constants";

/**
 * Configuration options for SVG sanitization
 */
type SanitizationOptions = {
  /**
   * Whether to allow style attributes in SVG elements
   * @default false
   */
  allowStyles?: boolean;
  /**
   * Additional attributes to remove during sanitization beyond the default set
   * @default []
   */
  forbiddenAttributes?: string[];
  /**
   * Additional tags to remove during sanitization beyond the default set
   * @default []
   */
  forbiddenTags?: string[];
};

/**
 * Sanitizes SVG markup string to prevent XSS attacks
 * @param svgString - The SVG markup as a string
 * @param options - Optional sanitization configuration
 * @returns Sanitized SVG string or null if invalid
 */
export function sanitizeSvg(
  svgString: string,
  options: SanitizationOptions = {}
): string | null {
  const {
    allowStyles = false,
    forbiddenAttributes = [],
    forbiddenTags = [],
  } = options;

  if (!svgString || typeof svgString !== "string") {
    return null;
  }

  if (!canUseDOM()) {
    return svgString;
  }

  const allForbiddenTags = [...DEFAULT_FORBIDDEN_TAGS, ...forbiddenTags];
  const allForbiddenAttributes = [
    ...(allowStyles ? [] : ["style"]),
    ...forbiddenAttributes,
  ];

  return DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: allForbiddenTags,
    FORBID_ATTR: allForbiddenAttributes,
  });
}

/**
 * Checks if we're in a browser environment
 */
export function canUseDOM(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}
