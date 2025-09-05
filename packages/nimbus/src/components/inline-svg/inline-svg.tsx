import { forwardRef } from "react";
import type { InlineSvgProps } from "./inline-svg.types";
import { InlineSvgRootSlot } from "./inline-svg.slots";
import { useInlineSvg } from "./hooks";

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
    const { data, ...rest } = props;

    const { isValid, svgAttributes, innerSvgContent } = useInlineSvg(data);

    // Don't render if sanitization failed
    if (!isValid) {
      return null;
    }

    return (
      <InlineSvgRootSlot
        ref={forwardedRef}
        role="presentation"
        {...svgAttributes}
        {...rest}
        dangerouslySetInnerHTML={{ __html: innerSvgContent }}
      />
    );
  }
);

InlineSvg.displayName = "InlineSvg";
