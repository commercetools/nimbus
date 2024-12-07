import { forwardRef } from "react";
import { ButtonRoot } from "./Button.slots";
import type { ButtonProps } from "./Button.types";
import { useButton } from "react-aria";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { children, busy, ...rest } = props;
    const { buttonProps } = useButton(props, ref);

    const { size, ...cleanButtonProps } = buttonProps;

    return (
      <ButtonRoot ref={ref} {...rest} {...cleanButtonProps}>
        {children}
      </ButtonRoot>
    );
  }
);

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";

/**
 * Alternatively a named function, could be used to
 * avaoid explicitly setting a displayName, that
 * might just read a little awkward:
 *
 * export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
 *   function Button(props, ref)  {
 *     const { children, busy, ...rest } = props;
 *     return (
 *       <ButtonRoot ref={ref} {...rest}>
 *         {children}
 *       </ButtonRoot>
 *     );
 *   }
 * );
 */
