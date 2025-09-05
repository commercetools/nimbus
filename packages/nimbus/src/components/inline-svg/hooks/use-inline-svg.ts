import { useMemo } from "react";
import { sanitizeSvg, canUseDOM } from "../utils";

/**
 * Hook for processing and sanitizing SVG data
 * @param data - Raw SVG markup as a string
 * @returns Processed SVG attributes, content, and sanitization status
 */
export function useInlineSvg(data: string) {
  // Process and sanitize SVG data in a single operation
  const processedSvg = useMemo(() => {
    if (!canUseDOM()) {
      return {
        isValid: true,
        svgAttributes: {},
        innerSvgContent: data,
      };
    }

    const sanitized = sanitizeSvg(data, {
      allowStyles: false,
      forbiddenAttributes: [],
      forbiddenTags: [],
    });

    if (!sanitized) {
      console.warn("InlineSvg: Failed to sanitize SVG data");
      return {
        isValid: false,
        svgAttributes: {},
        innerSvgContent: "",
      };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, "image/svg+xml");
    const svgEl = doc.querySelector("svg");

    if (!svgEl) {
      return {
        isValid: false,
        svgAttributes: {},
        innerSvgContent: "",
      };
    }

    const attrs: Record<string, string> = {};

    // Preserve all attributes from the sanitized SVG element
    // Security: Only attributes that passed sanitization are included
    for (const attr of Array.from(svgEl.attributes)) {
      // Convert kebab-case to camelCase for React compatibility
      const reactAttrName = attr.name.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      attrs[reactAttrName] = attr.value;
    }

    return {
      isValid: true,
      svgAttributes: attrs,
      innerSvgContent: svgEl.innerHTML,
    };
  }, [data]);

  return processedSvg;
}
