import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { Close } from "@commercetools/nimbus-icons";
import { DrawerCloseTriggerSlot } from "../drawer.slots";
import type { DrawerCloseTriggerProps } from "../drawer.types";
import { IconButton } from "@/components";

/**
 * # Drawer.CloseTrigger
 *
 * A button that closes the drawer when activated.
 * Displays an IconButton with a close (X) icon by default.
 *
 * The component automatically handles the close behavior through React Aria's
 * context, so no additional onPress handler is needed.
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *   <Drawer.Content>
 *     <Drawer.Header>
 *       <Drawer.Title>Title</Drawer.Title>
 *       <Drawer.CloseTrigger aria-label="Close drawer" />
 *     </Drawer.Header>
 *     <Drawer.Body>Content</Drawer.Body>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const DrawerCloseTrigger = (props: DrawerCloseTriggerProps) => {
  const {
    ref: forwardedRef,
    "aria-label": ariaLabel = "Close drawer",
    ...restProps
  } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLButtonElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DrawerCloseTriggerSlot>
      <IconButton
        ref={ref}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={ariaLabel}
        {...restProps}
      >
        <Close />
      </IconButton>
    </DrawerCloseTriggerSlot>
  );
};

DrawerCloseTrigger.displayName = "Drawer.CloseTrigger";
