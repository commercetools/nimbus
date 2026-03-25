import { DefaultPageTabNavSlot } from "../default-page.slots";
import type { DefaultPageTabNavProps } from "../default-page.types";

/**
 * DefaultPage.TabNav - Layout container for tab navigation in the header.
 * Positions itself in the header grid's last row at full width.
 *
 * Place inside `DefaultPage.Header` for route-based page navigation.
 * Wrap a `TabNav.Root` inside this component.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <DefaultPage.TabNav>
 *   <TabNav.Root aria-label="Customer sections">
 *     <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 *   </TabNav.Root>
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
