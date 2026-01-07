import { Close } from "@commercetools/nimbus-icons";
import { DrawerCloseTriggerSlot } from "../drawer.slots";
import type { DrawerCloseTriggerProps } from "../drawer.types";
import { IconButton } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { drawerMessagesStrings } from "../drawer.messages";

/**
 * Drawer.CloseTrigger - A button that closes the drawer when activated
 *
 * @supportsStyleProps
 */
export const DrawerCloseTrigger = (props: DrawerCloseTriggerProps) => {
  const msg = useLocalizedStringFormatter(drawerMessagesStrings);
  const { ref: forwardedRef, "aria-label": ariaLabel, ...restProps } = props;

  return (
    <DrawerCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={ariaLabel || msg.format("closeTrigger")}
        {...restProps}
      >
        <Close />
      </IconButton>
    </DrawerCloseTriggerSlot>
  );
};

DrawerCloseTrigger.displayName = "Drawer.CloseTrigger";
