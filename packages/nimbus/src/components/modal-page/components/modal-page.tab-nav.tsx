import { ModalPageTabNavSlot } from "../modal-page.slots";
import type { ModalPageTabNavProps } from "../modal-page.types";

/**
 * ModalPage.TabNav — layout container for tab navigation in the header.
 * Positions itself in the header grid's last row at full width.
 *
 * Place inside `ModalPage.Header` for route-based page navigation.
 * Wrap a `TabNav.Root` inside this component.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ModalPage.TabNav>
 *   <TabNav.Root aria-label="Order sections">
 *     <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
 *     <TabNav.Item href="/items">Items</TabNav.Item>
 *   </TabNav.Root>
 * </ModalPage.TabNav>
 * ```
 */
export const ModalPageTabNav = ({
  ref,
  children,
  ...props
}: ModalPageTabNavProps) => {
  return (
    <ModalPageTabNavSlot ref={ref} {...props}>
      {children}
    </ModalPageTabNavSlot>
  );
};

ModalPageTabNav.displayName = "ModalPage.TabNav";
