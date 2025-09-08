import { forwardRef } from "react";
import { DrawerFooterSlot } from "../drawer.slots";
import type { DrawerFooterProps } from "../drawer.types";

/**
 * # Drawer.Footer
 * 
 * The footer section of the drawer, typically containing action buttons.
 * Positioned at the bottom of the drawer with consistent spacing.
 * 
 * @example
 * ```tsx
 * <Drawer.Content side="right">
 *   <Drawer.Header>
 *     <Drawer.Title>Settings</Drawer.Title>
 *   </Drawer.Header>
 *   <Drawer.Body>Settings content</Drawer.Body>
 *   <Drawer.Footer>
 *     <button>Cancel</button>
 *     <button>Save Changes</button>
 *   </Drawer.Footer>
 * </Drawer.Content>
 * ```
 */
export const DrawerFooter = forwardRef<HTMLElement, DrawerFooterProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <DrawerFooterSlot ref={ref} {...restProps}>
        {children}
      </DrawerFooterSlot>
    );
  }
);

DrawerFooter.displayName = "Drawer.Footer";