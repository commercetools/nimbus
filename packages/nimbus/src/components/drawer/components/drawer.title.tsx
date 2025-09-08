import { forwardRef } from "react";
import { Heading as RaHeading } from "react-aria-components";
import { DrawerTitleSlot } from "../drawer.slots";
import type { DrawerTitleProps } from "../drawer.types";

/**
 * # Drawer.Title
 * 
 * The accessible title element for the drawer.
 * Uses React Aria's Heading for proper accessibility labeling.
 * 
 * This title automatically labels the drawer for screen readers and
 * provides the primary heading for the drawer content.
 * 
 * @example
 * ```tsx
 * <Drawer.Content side="left">
 *   <Drawer.Header>
 *     <Drawer.Title>Navigation Menu</Drawer.Title>
 *     <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *   </Drawer.Header>
 * </Drawer.Content>
 * ```
 */
export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <RaHeading slot="title" ref={ref} {...restProps}>
        <DrawerTitleSlot asChild>
          {children}
        </DrawerTitleSlot>
      </RaHeading>
    );
  }
);

DrawerTitle.displayName = "Drawer.Title";