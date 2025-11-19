import { AlertDismissButton as AlertDismissButtonSlot } from "../alert.slots";
import type { AlertDismissButtonProps } from "../alert.types";
import { Clear } from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button";
import { useIntl } from "react-intl";
import { messages } from "../alert.i18n";

/**
 * Alert.DismissButton - Button to dismiss or close the alert
 *
 * @supportsStyleProps
 */
export const AlertDismissButton = ({ ...props }: AlertDismissButtonProps) => {
  const intl = useIntl();

  return (
    <AlertDismissButtonSlot>
      <IconButton
        aria-label={intl.formatMessage(messages.dismiss)}
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
