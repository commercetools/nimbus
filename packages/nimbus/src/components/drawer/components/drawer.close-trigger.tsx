import { Close } from "@commercetools/nimbus-icons";
import { DrawerCloseTriggerSlot } from "../drawer.slots";
import type { DrawerCloseTriggerProps } from "../drawer.types";
import { IconButton } from "@/components";
import { useLocale } from "react-aria-components";
import { drawerMessages } from "../drawer.messages";

/**
 * Drawer.CloseTrigger - A button that closes the drawer when activated
 *
 * @supportsStyleProps
 */
export const DrawerCloseTrigger = (props: DrawerCloseTriggerProps) => {
  const { ref: forwardedRef, "aria-label": ariaLabel, ...restProps } = props;
  const { locale } = useLocale();

  return (
    <DrawerCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={
          ariaLabel || drawerMessages.getStringForLocale("closeTrigger", locale)
        }
        {...restProps}
      >
        <Close />
      </IconButton>
    </DrawerCloseTriggerSlot>
  );
};

DrawerCloseTrigger.displayName = "Drawer.CloseTrigger";
