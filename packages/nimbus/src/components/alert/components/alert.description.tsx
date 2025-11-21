import { AlertDescription as AlertDescriptionSlot } from "../alert.slots";
import type { AlertDescriptionProps } from "../alert.types";

/**
 * Alert.Description - Displays the description text for the alert
 *
 * @supportsStyleProps
 */
export const AlertDescription = ({
  children,
  ...props
}: AlertDescriptionProps) => {
  return <AlertDescriptionSlot {...props}>{children}</AlertDescriptionSlot>;
};

AlertDescription.displayName = "Alert.Description";
