import { forwardRef } from "react";
import { ButtonContext, useContextProps } from "react-aria-components";
import type { IconButtonProps } from "./icon-button.types";
import { Button } from "@/components";

/**
 * IconButton
 * ============================================================
 * displays a button with only an icon as child. It is based
 * on the regular `Button` component, but with a few adjustments.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => {
    // button context must be passed down as props to button component, or it is lost
    const [buttonContextProps, buttonRef] = useContextProps(
      props,
      ref,
      ButtonContext
    );

    return (
      <Button px={0} py={0} ref={buttonRef} {...buttonContextProps}>
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
