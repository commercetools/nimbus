import { AlertTitle as AlertTitleSlot } from "../alert.slots";
import type { AlertTitleProps } from "../alert.types";
import { Heading } from "../../heading/heading";

/**
 * Alert.Title - Displays the title text for the alert.
 *
 * Renders the Nimbus `Heading`. Defaults to a non-heading element (`as="p"`)
 * so it does not inject into the document outline; pass `as="h2"` (etc.) to
 * make it a real heading when the page hierarchy warrants it.
 *
 * @supportsStyleProps
 */
export const AlertTitle = (props: AlertTitleProps) => {
  const { ref: forwardedRef, children, as = "p", ...restProps } = props;

  return (
    <AlertTitleSlot asChild {...restProps}>
      <Heading ref={forwardedRef} as={as} fontWeight="600">
        {children}
      </Heading>
    </AlertTitleSlot>
  );
};

AlertTitle.displayName = "Alert.Title";
