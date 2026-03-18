import { Link as RALink } from "react-aria-components";
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
  ref,
  ...rest
}: TabNavItemProps) => {
  return (
    <TabNavItemSlot asChild ref={ref} {...rest}>
      <RALink
        href={href}
        isDisabled={isDisabled}
        target={target}
        rel={rel}
        aria-current={isCurrent ? "page" : undefined}
      >
        {children}
      </RALink>
    </TabNavItemSlot>
  );
};

TabNavItem.displayName = "TabNav.Item";
