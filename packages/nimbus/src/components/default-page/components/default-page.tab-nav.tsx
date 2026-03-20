import { DefaultPageTabNavSlot } from "../default-page.slots";
import type { DefaultPageTabNavProps } from "../default-page.types";

/**
 * DefaultPage.TabNav - Layout container for tab navigation in the header.
 * Positions itself in the header grid's last row at full width.
 *
 * Place inside `DefaultPage.Header` for route-based page navigation.
 * Use either as a wrapper around `TabNav.Root`, or with `as={TabNav.Root}`
 * for a flatter DOM structure.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * // As a wrapper
 * <DefaultPage.TabNav>
 *   <TabNav.Root aria-label="Customer sections">
 *     <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 *   </TabNav.Root>
 * </DefaultPage.TabNav>
 *
 * // With as prop (flatter DOM)
 * <DefaultPage.TabNav as={TabNav.Root} aria-label="Customer sections">
 *   <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 * </DefaultPage.TabNav>
 * ```
 */
export const DefaultPageTabNav = ({
  ref,
  children,
  ...props
}: DefaultPageTabNavProps) => {
  return (
    <DefaultPageTabNavSlot ref={ref} {...props}>
      {children}
    </DefaultPageTabNavSlot>
  );
};

DefaultPageTabNav.displayName = "DefaultPage.TabNav";
