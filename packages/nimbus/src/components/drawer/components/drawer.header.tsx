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
 * <Drawer.Content>
 *   <Drawer.Header>
 *     <Drawer.Title>Drawer Title</Drawer.Title>
 *     <Drawer.CloseTrigger />
 *   </Drawer.Header>
 *   <Drawer.Body>...</Drawer.Body>
 * </Drawer.Content>
 * ```
 */
export const DrawerHeader = (props: DrawerHeaderProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DrawerHeaderSlot ref={forwardedRef} {...restProps}>
      {children}
    </DrawerHeaderSlot>
  );
};

DrawerHeader.displayName = "Drawer.Header";
