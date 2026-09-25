import { AlertTitle as AlertTitleSlot } from "../alert.slots";
import type { AlertTitleProps } from "../alert.types";
import { Heading } from "../../heading/heading";

/**
 * Alert.Title - Displays the title text for the alert. Renders a `div` by
 * default; pass `as` to render a heading.
 *
 * @supportsStyleProps
 */
export const AlertTitle = (props: AlertTitleProps) => {
  const {
    ref: forwardedRef,
    children,
    as = "div",
    slot = null,
    ...restProps
  } = props;

  return (
    <AlertTitleSlot asChild {...restProps}>
      <Heading
        ref={forwardedRef as React.Ref<HTMLHeadingElement>}
        as={as}
        slot={slot}
        fontSize="inherit"
        lineHeight="inherit"
        fontWeight="600"
      >
        {children}
      </Heading>
    </AlertTitleSlot>
  );
};

AlertTitle.displayName = "Alert.Title";
