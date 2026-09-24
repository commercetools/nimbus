import { AlertDescription as AlertDescriptionSlot } from "../alert.slots";
import type { AlertDescriptionProps } from "../alert.types";
import { Text } from "../../text/text";

/**
 * Alert.Description - Displays the description text for the alert.
 *
 * Renders the Nimbus `Text` primitive as a `div` rather than `Text`'s default
 * `p`, because a description regularly holds block content — a `Stack`, a
 * list, several paragraphs. None of those may legally sit inside a `p`: the
 * HTML parser closes the paragraph early and lifts the content out of it,
 * which breaks the layout anywhere the markup is parsed rather than built by
 * React (server rendering, hydration). Pass `as="p"` for a description that
 * really is a single paragraph.
 *
 * @supportsStyleProps
 */
export const AlertDescription = (props: AlertDescriptionProps) => {
  const { ref: forwardedRef, children, as = "div", ...restProps } = props;

  return (
    <AlertDescriptionSlot asChild {...restProps}>
      <Text ref={forwardedRef} as={as}>
        {children}
      </Text>
    </AlertDescriptionSlot>
  );
};

AlertDescription.displayName = "Alert.Description";
