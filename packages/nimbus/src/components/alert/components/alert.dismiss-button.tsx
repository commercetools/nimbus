import { useContext, useEffect } from "react";
import { AlertDismissButton as AlertDismissButtonSlot } from "../alert.slots";
import type { AlertDismissButtonProps } from "../alert.types";
import { Clear } from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button";
import { AlertContext } from "./alert.root";
import { useIntl } from "react-intl";
import { messages } from "../alert.i18n";

/**
 * Alert.DismissButton - Button to dismiss or close the alert
 *
 * @supportsStyleProps
 */
export const AlertDismissButton = ({
  children,
  ...props
}: AlertDismissButtonProps) => {
  const context = useContext(AlertContext);
  const intl = useIntl();

  useEffect(() => {
    if (context) {
      const slotElement = (
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
      // Register it with the parent
      context.setDismiss(slotElement);

      // On unmount, remove it
      return () => context.setDismiss(null);
    }
  }, [children, props]);

  return null;
};

AlertDismissButton.displayName = "Alert.DismissButton";
