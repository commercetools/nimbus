import { DetailPageTabNavSlot } from "../detail-page.slots";
import type { DetailPageTabNavProps } from "../detail-page.types";

/**
 * DetailPage.TabNav - Layout container for tab navigation in the header.
 * Positions itself in the header grid's last row at full width.
 *
 * Place inside `DetailPage.Header` for route-based page navigation.
 * Use either as a wrapper around `TabNav.Root`, or with `as={TabNav.Root}`
 * for a flatter DOM structure.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * // As a wrapper
 * <DetailPage.TabNav>
 *   <TabNav.Root aria-label="Customer sections">
 *     <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 *   </TabNav.Root>
 * </DetailPage.TabNav>
 *
 * // With as prop (flatter DOM)
 * <DetailPage.TabNav as={TabNav.Root} aria-label="Customer sections">
 *   <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 * </DetailPage.TabNav>
 * ```
 */
export const DetailPageTabNav = ({
  ref,
  children,
  ...props
}: DetailPageTabNavProps) => {
  return (
    <DetailPageTabNavSlot ref={ref} {...props}>
      {children}
    </DetailPageTabNavSlot>
  );
};

DetailPageTabNav.displayName = "DetailPage.TabNav";
