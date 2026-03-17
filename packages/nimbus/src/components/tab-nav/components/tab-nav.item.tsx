import { useRef } from "react";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";
import { TabNavItemSlot } from "../tab-nav.slots";
import type { TabNavItemProps } from "../tab-nav.types";

/**
 * # TabNav.Item
 *
 * An individual tab-styled navigation link. Renders as an `<a>` element.
 *
 * When `isCurrent` is true, sets `aria-current="page"` on the anchor to
 * indicate to assistive technologies that this link represents the current page.
 * Uses standard sequential Tab key navigation — no roving tabindex.
 *
 * @supportsStyleProps
 */
export const TabNavItem = ({
  children,
  href,
  isCurrent,
  isDisabled,
  target,
  rel,
  ref: forwardedRef,
  ...rest
}: TabNavItemProps) => {
  const localRef = useRef<HTMLAnchorElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const { linkProps } = useLink(
    { ...rest, href, isDisabled, elementType: "a" },
    ref
  );

  return (
    <TabNavItemSlot
      {...mergeProps(rest, linkProps, {
        href: isDisabled ? undefined : href,
        ref,
        target,
        rel,
        "aria-current": isCurrent ? ("page" as const) : undefined,
      })}
    >
      {children}
    </TabNavItemSlot>
  );
};

TabNavItem.displayName = "TabNav.Item";
