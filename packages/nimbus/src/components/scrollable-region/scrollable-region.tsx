import { Box } from "@chakra-ui/react/box";
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
 * toggles based on overflow state. Renders as `<section>` for
 * `role="region"` and `<div>` for `role="group"` by default; override
 * with the `as` prop.
 */
export const ScrollableRegion = ({
  ref: forwardedRef,
  role = "group",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  debounceMs,
  scrollable,
  as,
  children,
  style,
  ...rest
}: ScrollableRegionProps) => {
  const hookOptions: UseScrollableRegionResolvedOptions = {
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    debounceMs,
    scrollable,
  };

  const { ref, containerProps } = useScrollableRegion(hookOptions);

  const mergedRef = mergeRefs(ref, forwardedRef);

  // Merge user styles with hook styles
  const mergedStyle = style
    ? { ...containerProps.style, ...style }
    : containerProps.style;

  // Default element: <section> for role="region", <div> for role="group"
  const defaultAs = role === "region" ? "section" : "div";

  return (
    <Box
      as={as ?? defaultAs}
      ref={mergedRef}
      {...containerProps}
      {...rest}
      style={mergedStyle}
    >
      {children}
    </Box>
  );
};

ScrollableRegion.displayName = "ScrollableRegion";
