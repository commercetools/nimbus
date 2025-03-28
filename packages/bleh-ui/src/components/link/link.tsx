import { forwardRef, useRef } from "react";
import { LinkRoot } from "./link.slots";
import type { LinkProps } from "./link.types";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";

/**
 * Link
 * ============================================================
 * To allow a user to navigate to a different page or resource
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLAnchorElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (props, forwardedRef) => {
    const { as, asChild, children, ...rest } = props;

    const localRef = useRef<HTMLAnchorElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const elementType = (as as string) || (asChild ? "span" : "a") || "a";
    const { linkProps } = useLink({ ...rest, elementType }, ref);

    return (
      <LinkRoot {...mergeProps(rest, linkProps, { as, asChild, ref })}>
        {children}
      </LinkRoot>
    );
  }
);

Link.displayName = "Link";
