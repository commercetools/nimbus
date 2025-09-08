import { forwardRef } from "react";
import { DrawerHeaderSlot } from "../drawer.slots";
import type { DrawerHeaderProps } from "../drawer.types";

/**
 * # Drawer.Header
 * 
 * The header section of the drawer content.
 * Typically contains the title and close button.
 * 
 * @example
 * ```tsx
 * <Drawer.Content side="left">
 *   <Drawer.Header>
 *     <Drawer.Title>Navigation</Drawer.Title>
 *     <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *   </Drawer.Header>
 * </Drawer.Content>
 * ```
 */
export const DrawerHeader = forwardRef<HTMLElement, DrawerHeaderProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <DrawerHeaderSlot ref={ref} {...restProps}>
        {children}
      </DrawerHeaderSlot>
    );
  }
);

DrawerHeader.displayName = "Drawer.Header";