import { chakra } from "@chakra-ui/react/styled-system";
import { useScrollableRegion } from "@/hooks/use-scrollable-region/use-scrollable-region";
import type { UseScrollableRegionResolvedOptions } from "@/hooks/use-scrollable-region/use-scrollable-region.types";
import { mergeRefs } from "@/utils";
import type { ScrollableRegionProps } from "./scrollable-region.types";

/**
 * ScrollableRegion
 * ============================================================
 * An accessible scrollable container that detects content overflow and
 * conditionally adds `tabIndex` so keyboard users can scroll.
 *
 * Uses the internal `useScrollableRegion` hook for overflow detection
 * and accessibility management.
 *
 * ARIA `role` and accessible name are always applied. Only `tabIndex`
 * toggles based on overflow state.
 */
export const ScrollableRegion = ({
  ref: forwardedRef,
  role = "group",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  scrollable,
  children,
  style,
  ...rest
}: ScrollableRegionProps) => {
  const hookOptions: UseScrollableRegionResolvedOptions = {
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    scrollable,
  };

  const { ref, containerProps } = useScrollableRegion(hookOptions);

  const mergedRef = mergeRefs(ref, forwardedRef);

  // Merge user styles with hook styles
  const mergedStyle = style
    ? { ...containerProps.style, ...style }
    : containerProps.style;

  const Element = role === "region" ? chakra.section : chakra.div;

  return (
    <Element
      ref={mergedRef}
      focusVisibleRing="outside"
      {...containerProps}
      {...rest}
      style={mergedStyle}
    >
      {children}
    </Element>
  );
};

ScrollableRegion.displayName = "ScrollableRegion";
