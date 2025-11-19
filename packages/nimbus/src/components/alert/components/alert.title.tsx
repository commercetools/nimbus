import { AlertTitle as AlertTitleSlot } from "../alert.slots";
import type { AlertTitleProps } from "../alert.types";

/**
 * Alert.Title - Displays the title text for the alert
 *
 * @supportsStyleProps
 */
export const AlertTitle = ({ children, ...props }: AlertTitleProps) => {
  return (
    <AlertTitleSlot {...props} fontWeight="600">
      {children}
    </AlertTitleSlot>
  );
};

AlertTitle.displayName = "Alert.Title";
