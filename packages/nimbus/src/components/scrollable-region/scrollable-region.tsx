import { Box } from "@chakra-ui/react/box";
import { useScrollableRegion } from "@/hooks/use-scrollable-region/use-scrollable-region";
import type { UseScrollableRegionResolvedOptions } from "@/hooks/use-scrollable-region/use-scrollable-region.types";
import { mergeRefs } from "@/utils";
import type { ScrollableRegionProps } from "./scrollable-region.types";

/**
 * ScrollableRegion
 * ============================================================
 * An accessible scrollable container that automatically detects overflow
 * and manages keyboard focus, ARIA roles, and focus ring.
 *
 * Uses `useScrollableRegion` internally. For applying scrollable-region
 * a11y to an existing element (e.g., a compound component slot), use
 * the hook directly instead.
 *
 * Features:
 *
 * - dynamic overflow detection via ResizeObserver (vertical and horizontal)
 * - conditional `tabIndex`, ARIA role, and accessible name based on overflow state
 * - keyboard-only focus ring using react-aria's `useFocusRing`
 * - forwards refs to the underlying DOM element
 */
export const ScrollableRegion = ({
  ref: forwardedRef,
  role = "group",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  debounceMs,
  scrollable,
  children,
  className,
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

  return (
    <Box
      ref={mergedRef}
      className={className}
      {...containerProps}
      {...rest}
      style={mergedStyle}
    >
      {children}
    </Box>
  );
};

ScrollableRegion.displayName = "ScrollableRegion";
