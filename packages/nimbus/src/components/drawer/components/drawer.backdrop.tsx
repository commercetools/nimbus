import { forwardRef } from "react";
import { DrawerBackdropSlot } from "../drawer.slots";
import type { DrawerBackdropProps } from "../drawer.types";

/**
 * # Drawer.Backdrop
 *
 * The backdrop overlay that appears behind the drawer content.
 * Provides a semi-transparent overlay that can dismiss the drawer when clicked.
 *
 * @example
 * ```tsx
 * <Drawer.Content side="left">
 *   <Drawer.Backdrop />
 *   <Drawer.Header>Title</Drawer.Header>
 * </Drawer.Content>
 * ```
 */
export const DrawerBackdrop = forwardRef<HTMLDivElement, DrawerBackdropProps>(
  (props, ref) => {
    const { style, ...restProps } = props;

    return <DrawerBackdropSlot ref={ref} style={style} {...restProps} />;
  }
);

DrawerBackdrop.displayName = "Drawer.Backdrop";
