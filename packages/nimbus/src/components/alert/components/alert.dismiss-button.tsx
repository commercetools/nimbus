import { useContext, useEffect } from "react";
import { AlertDismissButton as AlertDismissButtonSlot } from "../alert.slots";
import type { AlertDismissButtonProps } from "../alert.types";
import { Clear } from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button";
import { AlertContext } from "./alert.root";

const AlertDismissButton = ({
  children,
  ...props
}: AlertDismissButtonProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertDismissButtonSlot>
          <IconButton
            aria-label="Dismiss"
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

export default AlertDismissButton;
