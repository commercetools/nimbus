import { Close } from "@commercetools/nimbus-icons";
import { DrawerCloseTriggerSlot } from "../drawer.slots";
import type { DrawerCloseTriggerProps } from "../drawer.types";
import { IconButton } from "@/components";
import { messages } from "../drawer.i18n";
import { useIntl } from "react-intl";

/**
 * Drawer.CloseTrigger - A button that closes the drawer when activated
 *
 * @supportsStyleProps
 */
export const DrawerCloseTrigger = (props: DrawerCloseTriggerProps) => {
  const { ref: forwardedRef, "aria-label": ariaLabel, ...restProps } = props;
  const intl = useIntl();

  return (
    <DrawerCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={ariaLabel || intl.formatMessage(messages.closeTrigger)}
        {...restProps}
      >
        <Close />
      </IconButton>
    </DrawerCloseTriggerSlot>
  );
};

DrawerCloseTrigger.displayName = "Drawer.CloseTrigger";
