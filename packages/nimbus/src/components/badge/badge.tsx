import { useRef } from "react";
import { BadgeRoot } from "./badge.slots";
import type { BadgeProps } from "./badge.types";
import { mergeRefs } from "@chakra-ui/react";
import { useObjectRef, mergeProps } from "react-aria";
/**
 * Badge
 * ============================================================
 * badge
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLSpanElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

export const Badge = (props: BadgeProps) => {
  const { ref: forwardedRef, as, children, ...rest } = props;

  const localRef = useRef<HTMLSpanElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const elementType = as || "span";

  return (
    <BadgeRoot as={elementType} {...mergeProps(rest, { ref })}>
      {children}
    </BadgeRoot>
  );
};

Badge.displayName = "Badge";
