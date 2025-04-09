import { forwardRef } from "react";
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
    return (
      <Button px={0} py={0} ref={ref} {...props}>
        {children}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
