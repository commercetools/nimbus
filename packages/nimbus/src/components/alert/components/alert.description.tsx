import { AlertDescription as AlertDescriptionSlot } from "../alert.slots";
import type { AlertDescriptionProps } from "../alert.types";
import { Text } from "../../text/text";

/**
 * Alert.Description - Displays the description text for the alert.
 *
 * Renders the Nimbus `Text` primitive.
 *
 * @supportsStyleProps
 */
export const AlertDescription = (props: AlertDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <AlertDescriptionSlot asChild {...restProps}>
      <Text ref={forwardedRef}>{children}</Text>
    </AlertDescriptionSlot>
  );
};

AlertDescription.displayName = "Alert.Description";
