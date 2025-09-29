import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DrawerTitleSlot } from "../drawer.slots";
import type { DrawerTitleProps } from "../drawer.types";
import { Heading } from "@/components";
/**
 * # Drawer.Title
 *
 * The accessible title element for the drawer.
 * Uses React Aria's Heading for proper accessibility and screen reader support.
 *
 * @example
 * ```tsx
 * <Drawer.Content>
 *   <Drawer.Header>
 *     <Drawer.Title>Confirm Action</Drawer.Title>
 *   </Drawer.Header>
 *   <Drawer.Body>...</Drawer.Body>
 * </Drawer.Content>
 * ```
 */
export const DrawerTitle = (props: DrawerTitleProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLHeadingElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DrawerTitleSlot asChild {...restProps}>
      <Heading ref={ref} slot="title" as="h2" textStyle="lg">
        {children}
      </Heading>
    </DrawerTitleSlot>
  );
};

DrawerTitle.displayName = "Drawer.Title";
