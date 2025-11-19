import { AlertActions as AlertActionsSlot } from "../alert.slots";
import type { AlertActionsProps } from "../alert.types";

/**
 * Alert.Actions - Container for action buttons within the alert
 *
 * @supportsStyleProps
 */
export const AlertActions = ({ children, ...props }: AlertActionsProps) => {
  return <AlertActionsSlot {...props}>{children}</AlertActionsSlot>;
};

AlertActions.displayName = "Alert.Actions";
