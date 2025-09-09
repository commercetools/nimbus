import { forwardRef } from "react";
import { Text as RaText } from "react-aria-components";
import { DrawerDescriptionSlot } from "../drawer.slots";
import type { DrawerDescriptionProps } from "../drawer.types";

/**
 * # Drawer.Description
 *
 * The accessible description element for the drawer.
 * Uses React Aria's Text with slot="description" for proper accessibility.
 *
 * This description provides additional context about the drawer content
 * and is announced by screen readers along with the title.
 *
 * @example
 * <Drawer.Content side="right">
 *   <Drawer.Header>
 *     <Drawer.Title>User Profile</Drawer.Title>
 *   </Drawer.Header>
 *   <Drawer.Body>
 *     <Drawer.Description>
 *       View and edit your account information and preferences.
 *     </Drawer.Description>
 *     profile form
 *   </Drawer.Body>
 * </Drawer.Content>
 */
export const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  DrawerDescriptionProps
>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <RaText slot="description" ref={ref} {...restProps}>
      <DrawerDescriptionSlot asChild>{children}</DrawerDescriptionSlot>
    </RaText>
  );
});

DrawerDescription.displayName = "Drawer.Description";
