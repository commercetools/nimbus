import {
  DEFAULT_FORBIDDEN_TAGS,
  DEFAULT_FORBIDDEN_ATTRIBUTES,
  ALLOWED_PROTOCOLS,
} from "../constants";

/**
 * Configuration options for SVG sanitization
 */
interface SanitizationOptions {
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
}

/**
 * Sanitizes a URL to prevent XSS attacks
 */
function sanitizeUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Allow fragment identifiers
  if (trimmed.startsWith("#")) return trimmed;

  // Parse and validate URL
  try {
    const parsed = new URL(trimmed);
    if ((ALLOWED_PROTOCOLS as readonly string[]).includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // If it's not a valid URL, treat it as a relative path
    if (!trimmed.includes(":")) {
      return trimmed;
    }
  }

  // Block any other protocols (javascript:, data:, etc.)
  return "";
}

/**
 * Recursively sanitizes an SVG element and its children
 */
function sanitizeElement(
  element: Element,
  options: SanitizationOptions = {}
): Element | null {
  const {
    allowStyles = false,
    forbiddenAttributes = [],
    forbiddenTags = [],
  } = options;

  const tagName = element.tagName.toLowerCase();

  // Check if tag is forbidden
  const allForbiddenTags = [...DEFAULT_FORBIDDEN_TAGS, ...forbiddenTags];
  if (allForbiddenTags.includes(tagName)) {
    return null;
  }

  // Clone the element to avoid modifying the original
  const cloned = element.cloneNode(false) as Element;

  // Process attributes
  const allForbiddenAttrs = [
    ...DEFAULT_FORBIDDEN_ATTRIBUTES,
    ...forbiddenAttributes,
  ];
  if (!allowStyles && !allForbiddenAttrs.includes("style")) {
    allForbiddenAttrs.push("style");
  }

  for (const attr of Array.from(element.attributes)) {
    const attrName = attr.name.toLowerCase();

    // Remove forbidden attributes
    let isForbidden = false;

    // Check for event handlers (anything starting with "on")
    if (attrName.startsWith("on")) {
      isForbidden = true;
    }

    // Check for explicitly forbidden attributes
    if (!isForbidden) {
      for (const forbidden of allForbiddenAttrs) {
        if (attrName === forbidden || attrName.startsWith(forbidden)) {
          isForbidden = true;
          break;
        }
      }
    }

    if (isForbidden) {
      continue;
    }

    // Sanitize URLs in href and xlink:href attributes
    if (attrName === "href" || attrName === "xlink:href") {
      const sanitizedUrl = sanitizeUrl(attr.value);
      if (sanitizedUrl) {
        cloned.setAttribute(attr.name, sanitizedUrl);
      }
      continue;
    }

    // Copy safe attributes
    cloned.setAttribute(attr.name, attr.value);
  }

  // Recursively process children
  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      cloned.appendChild(child.cloneNode(true));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const sanitizedChild = sanitizeElement(child as Element, options);
      if (sanitizedChild) {
        cloned.appendChild(sanitizedChild);
      }
    }
  }

  return cloned;
}

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
  if (!svgString || typeof svgString !== "string") {
    return null;
  }

  // Use DOMParser to parse the SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString.trim(), "image/svg+xml");

  // Check for parsing errors
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    console.warn("InlineSvg: Invalid SVG markup provided");
    return null;
  }

  // Find the SVG element
  const svgElement = doc.querySelector("svg");
  if (!svgElement) {
    console.warn("InlineSvg: No SVG element found in markup");
    return null;
  }

  // Sanitize the SVG element
  const sanitized = sanitizeElement(svgElement, options);
  if (!sanitized) {
    return null;
  }

  // Convert back to string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(sanitized);
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
