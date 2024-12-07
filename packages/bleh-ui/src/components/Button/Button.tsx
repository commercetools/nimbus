import { forwardRef } from "react";
import { ButtonRoot } from "./Button.slots";
import type { ButtonProps } from "./Button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { children, busy, ...rest } = props;

    return (
      <ButtonRoot ref={ref} {...rest}>
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
