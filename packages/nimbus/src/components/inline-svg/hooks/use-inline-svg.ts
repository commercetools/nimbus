import { useMemo } from "react";
import { useIsSSR } from "react-aria";
import { canUseDOM } from "@/utils";
import { sanitizeSvg } from "../utils";

/**
 * Hook for processing and sanitizing SVG data
 * @param data - Raw SVG markup as a string
 * @returns Processed SVG attributes, content, and sanitization status
 */
export function useInlineSvg(data: string) {
  // Sanitization (DOMPurify) and parsing (DOMParser) are browser-only, so the
  // SVG cannot be processed during server-side rendering. Rendering the raw,
  // unparsed markup on the server (and the parsed markup on the client) produces
  // mismatched HTML and breaks hydration. `useIsSSR()` stays true during both the
  // server render and the initial client (hydration) render, so we emit an empty
  // placeholder for both — keeping them identical — then process and render the
  // real SVG once it flips to false after hydration. (`canUseDOM()` guards the
  // browser-only DOMParser call below; it is not enough on its own because it is
  // already true during hydration.)
  const isSSR = useIsSSR();

  // Process and sanitize SVG data in a single operation
  const processedSvg = useMemo(() => {
    if (isSSR || !canUseDOM()) {
      return {
        isValid: true,
        svgAttributes: {},
        innerSvgContent: "",
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
      console.warn("InlineSvg: No SVG element found in markup");
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
      // Convert kebab-case and namespace prefixes to camelCase for React compatibility
      const reactAttrName = attr.name.replace(/[-:]([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      attrs[reactAttrName] = attr.value;
    }

    return {
      isValid: true,
      svgAttributes: attrs,
      innerSvgContent: svgEl.innerHTML,
    };
  }, [data, isSSR]);

  return processedSvg;
}
