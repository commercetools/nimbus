import { forwardRef, useRef } from "react";
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
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (props, forwardedRef) => {
    const { as, asChild, children, ...rest } = props;

    const localRef = useRef<HTMLDivElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const elementType = as || (asChild ? "span" : "div") || "div";

    return (
      <BadgeRoot as={elementType} {...mergeProps(rest, { ref })}>
        {children}
      </BadgeRoot>
    );
  }
);
