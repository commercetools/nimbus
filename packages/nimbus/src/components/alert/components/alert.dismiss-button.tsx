import { AlertDismissButton as AlertDismissButtonSlot } from "../alert.slots";
import type { AlertDismissButtonProps } from "../alert.types";
import { Clear } from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { alertMessagesStrings } from "../alert.messages";

/**
 * Alert.DismissButton - Button to dismiss or close the alert
 *
 * @supportsStyleProps
 */
export const AlertDismissButton = ({ ...props }: AlertDismissButtonProps) => {
  const msg = useLocalizedStringFormatter(alertMessagesStrings);

  return (
    <AlertDismissButtonSlot>
      <IconButton
        aria-label={msg.format("dismiss")}
        {...props}
        variant="ghost"
        size="2xs"
      >
        <Clear role="img" />
      </IconButton>
    </AlertDismissButtonSlot>
  );
};

AlertDismissButton.displayName = "Alert.DismissButton";
