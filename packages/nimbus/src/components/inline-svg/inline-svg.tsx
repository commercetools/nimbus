import { forwardRef, useMemo, useRef, useEffect } from "react";
import { mergeRefs } from "@chakra-ui/react";

import type { InlineSvgProps } from "./inline-svg.types";
import { InlineSvgRootSlot } from "./inline-svg.slots";
import { sanitizeSvg, canUseDOM } from "./utils";

/**
 * # InlineSvg
 *
 * Renders arbitrary SVG markup as an icon with built-in XSS protection.
 * The component sanitizes the provided SVG string to remove potentially
 * dangerous elements and attributes before rendering.
 *
 * @example
 * ```tsx
 * <InlineSvg
 *   data='<svg viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12..."/></svg>'
 *   size="md"
 *   color="primary.500"
 * />
 * ```
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/media/inline-svg}
 */
export const InlineSvg = forwardRef<SVGSVGElement, InlineSvgProps>(
  (props, forwardedRef) => {
    const {
      data,
      title,
      description,
      preserveViewBox = true,
      className,
      ...rest
    } = props;

    const localRef = useRef<SVGSVGElement>(null);
    const ref = mergeRefs(localRef, forwardedRef);

    // Sanitize the SVG data
    const sanitizedSvg = useMemo(() => {
      if (!canUseDOM()) {
        return data;
      }

      const sanitized = sanitizeSvg(data, {
        allowStyles: false,
        forbiddenAttributes: [],
        forbiddenTags: [],
      });

      if (!sanitized) {
        console.warn("InlineSvg: Failed to sanitize SVG data");
        return null;
      }

      return sanitized;
    }, [data]);

    // Extract viewBox and other attributes from sanitized SVG
    const svgAttributes = useMemo(() => {
      if (!sanitizedSvg || !canUseDOM()) {
        return {};
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitizedSvg, "image/svg+xml");
      const svgEl = doc.querySelector("svg");

      if (!svgEl) {
        return {};
      }

      const attrs: Record<string, string> = {};

      // Extract specific attributes we want to preserve
      const attributesToPreserve = ["viewBox", "width", "height", "xmlns"];

      for (const attrName of attributesToPreserve) {
        const value = svgEl.getAttribute(attrName);
        if (value) {
          attrs[attrName] = value;
        }
      }

      // Only preserve viewBox if requested
      if (!preserveViewBox) {
        delete attrs.viewBox;
      }

      return attrs;
    }, [sanitizedSvg, preserveViewBox]);

    // Extract inner HTML (paths, shapes, etc.) from sanitized SVG
    const innerSvgContent = useMemo(() => {
      if (!sanitizedSvg || !canUseDOM()) {
        return "";
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitizedSvg, "image/svg+xml");
      const svgEl = doc.querySelector("svg");

      if (!svgEl) {
        return "";
      }

      // Get the inner HTML of the SVG element
      return svgEl.innerHTML;
    }, [sanitizedSvg]);

    // Update the SVG element with accessibility elements
    useEffect(() => {
      if (!localRef.current || !canUseDOM()) {
        return;
      }

      const svgElement = localRef.current;

      // Add title element if provided
      if (title) {
        const existingTitle = svgElement.querySelector("title");
        if (existingTitle) {
          existingTitle.textContent = title;
        } else {
          const titleElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          titleElement.textContent = title;
          svgElement.insertBefore(titleElement, svgElement.firstChild);
        }
      }

      // Add desc element if provided
      if (description) {
        const existingDesc = svgElement.querySelector("desc");
        if (existingDesc) {
          existingDesc.textContent = description;
        } else {
          const descElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "desc"
          );
          descElement.textContent = description;
          const titleEl = svgElement.querySelector("title");
          if (titleEl) {
            svgElement.insertBefore(descElement, titleEl.nextSibling);
          } else {
            svgElement.insertBefore(descElement, svgElement.firstChild);
          }
        }
      }
    }, [title, description]);

    // Don't render if sanitization failed
    if (!sanitizedSvg) {
      return null;
    }

    return (
      <InlineSvgRootSlot
        ref={ref}
        className={className}
        role={title ? "img" : "presentation"}
        aria-label={title}
        aria-describedby={description ? "inline-svg-desc" : undefined}
        {...svgAttributes}
        {...rest}
        dangerouslySetInnerHTML={{ __html: innerSvgContent }}
      />
    );
  }
);

InlineSvg.displayName = "InlineSvg";
