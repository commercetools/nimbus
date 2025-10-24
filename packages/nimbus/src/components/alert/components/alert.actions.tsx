import { useContext, useEffect } from "react";
import { AlertActions as AlertActionsSlot } from "../alert.slots";
import type { AlertActionsProps } from "../alert.types";
import { AlertContext } from "./alert.root";

/**
 * Alert.Actions - Container for action buttons within the alert
 *
 * @supportsStyleProps
 */
export const AlertActions = ({ children, ...props }: AlertActionsProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertActionsSlot {...props}>{children}</AlertActionsSlot>
      );
      // Register it with the parent
      context.setActions(slotElement);

      // On unmount, remove it
      return () => context.setActions(null);
    }
  }, [children, props]);

  return null;
};

AlertActions.displayName = "Alert.Actions";
