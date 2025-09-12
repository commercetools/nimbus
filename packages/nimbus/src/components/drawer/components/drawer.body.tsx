import { forwardRef } from "react";
import { DrawerBodySlot } from "../drawer.slots";
import type { DrawerBodyProps } from "../drawer.types";

/**
 * # Drawer.Body
 *
 * The main body content section of the drawer.
 * Contains the primary drawer content with scrollable overflow handling.
 *
 * @example
 * ```tsx
 * <Drawer.Content side="left">
 *   <Drawer.Header>
 *     <Drawer.Title>Navigation</Drawer.Title>
 *   </Drawer.Header>
 *   <Drawer.Body>
 *     <nav>
 *       <a href="/home">Home</a>
 *       <a href="/about">About</a>
 *     </nav>
 *   </Drawer.Body>
 * </Drawer.Content>
 * ```
 */
export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <DrawerBodySlot ref={ref} {...restProps}>
        {children}
      </DrawerBodySlot>
    );
  }
);

DrawerBody.displayName = "Drawer.Body";
