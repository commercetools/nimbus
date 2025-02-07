import React, { forwardRef, cloneElement } from "react";
import { useButton, useObjectRef } from "react-aria";
import { Box } from "@/components";
import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { asChild, startIcon, endIcon, children, ...rest } = props;
    const objRef = useObjectRef(ref);
    const { buttonProps } = useButton(rest, objRef);

    if (asChild && React.isValidElement(children)) {
      return (
        <ButtonRoot asChild ref={objRef} {...rest} {...buttonProps}>
          {cloneElement(children, {
            children: (
              <>
                {startIcon && <Box as="span">{startIcon}</Box>}
                {children.props.children}
                {endIcon && <Box as="span">{endIcon}</Box>}
              </>
            ),
          })}
        </ButtonRoot>
      );
    }

    return (
      <ButtonRoot ref={objRef} {...rest} {...buttonProps}>
        {startIcon && <Box as="span">{startIcon}</Box>}
        <Box as="span" flexGrow="1">
          {children}
        </Box>
        {endIcon && <Box as="span">{endIcon}</Box>}
      </ButtonRoot>
    );
  }
);

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";
