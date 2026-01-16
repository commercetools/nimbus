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
 *   color="primary.9"
 * />
 * ```
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/media/inline-svg}
 */
export const InlineSvg = (props: InlineSvgProps) => {
  const { data, ref, slot, ...rest } = props;

  const { isValid, svgAttributes, innerSvgContent } = useInlineSvg(data);

  // Don't render if sanitization failed
  if (!isValid) {
    return null;
  }

  // Always render as SVG - no asChild support
  return (
    <InlineSvgRootSlot asChild slot={slot ?? undefined} {...rest}>
      <svg
        ref={ref}
        role="presentation"
        {...svgAttributes}
        dangerouslySetInnerHTML={{ __html: innerSvgContent }}
      />
    </InlineSvgRootSlot>
  );
};

InlineSvg.displayName = "InlineSvg";
