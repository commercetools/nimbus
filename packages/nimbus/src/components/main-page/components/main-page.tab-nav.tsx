import { MainPageTabNavSlot } from "../main-page.slots";
import type { MainPageTabNavProps } from "../main-page.types";

/**
 * MainPage.TabNav - Layout container for tab navigation in the header.
 * Positions itself in the header grid's last row at full width.
 *
 * Place inside `MainPage.Header` for route-based page navigation.
 * Use either as a wrapper around `TabNav.Root`, or with `as={TabNav.Root}`
 * for a flatter DOM structure.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * // As a wrapper
 * <MainPage.TabNav>
 *   <TabNav.Root aria-label="Product sections">
 *     <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 *   </TabNav.Root>
 * </MainPage.TabNav>
 *
 * // With as prop (flatter DOM)
 * <MainPage.TabNav as={TabNav.Root} aria-label="Product sections">
 *   <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 * </MainPage.TabNav>
 * ```
 */
export const MainPageTabNav = ({
  ref,
  children,
  ...props
}: MainPageTabNavProps) => {
  return (
    <MainPageTabNavSlot ref={ref} {...props}>
      {children}
    </MainPageTabNavSlot>
  );
};

MainPageTabNav.displayName = "MainPage.TabNav";
