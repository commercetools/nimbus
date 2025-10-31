import { DrawerTitleSlot } from "../drawer.slots";
import type { DrawerTitleProps } from "../drawer.types";
import { Heading } from "@/components";

/**
 * Drawer.Title - The accessible title element for the drawer
 *
 * @supportsStyleProps
 */
export const DrawerTitle = (props: DrawerTitleProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DrawerTitleSlot asChild {...restProps}>
      <Heading ref={forwardedRef} slot="title" as="h2" textStyle="lg">
        {children}
      </Heading>
    </DrawerTitleSlot>
  );
};

DrawerTitle.displayName = "Drawer.Title";
