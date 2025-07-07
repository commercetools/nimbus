import { useRef } from "react";
import { useSeparator, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DividerRoot } from "./divider.slots";
import type { DividerProps } from "./divider.types";

/**
 * Divider
 * ============================================================
 * A visual separator that divides content sections
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'orientation', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 * - built with React Aria for accessibility
 */

export const Divider = (props: DividerProps) => {
  const { ref: forwardedRef, as, orientation = "horizontal", ...rest } = props;

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const elementType = as || "div";

  // Use React Aria's useSeparator hook for accessibility
  const { separatorProps } = useSeparator({
    orientation,
    ...rest,
  });

  return (
    <DividerRoot
      as={elementType}
      {...mergeProps(rest, { ref, orientation }, separatorProps, {
        "aria-orientation": orientation,
      })}
    />
  );
};

Divider.displayName = "Divider";
