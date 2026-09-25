import { AlertDescription as AlertDescriptionSlot } from "../alert.slots";
import type { AlertDescriptionProps } from "../alert.types";
import { Text } from "../../text/text";

/**
 * Alert.Description - Displays the description text for the alert. Renders a
 * `div` by default so it can hold block content.
 *
 * @supportsStyleProps
 */
export const AlertDescription = (props: AlertDescriptionProps) => {
  const {
    ref: forwardedRef,
    children,
    as = "div",
    slot = null,
    ...restProps
  } = props;

  return (
    <AlertDescriptionSlot asChild {...restProps}>
      <Text ref={forwardedRef} as={as} slot={slot}>
        {children}
      </Text>
    </AlertDescriptionSlot>
  );
};

AlertDescription.displayName = "Alert.Description";
