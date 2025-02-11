import { forwardRef, useRef } from "react";
import { useButton, useObjectRef } from "react-aria";

import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

import { Tooltip } from "../tooltip";
import { TooltipTrigger } from "react-aria-components";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const objRef = useRef(ref);
    const { buttonProps } = useButton(props, objRef);
    const { children, ...rest } = props;

    return (
      <TooltipTrigger delay={0} closeDelay={0}>
        <ButtonRoot ref={objRef} {...rest} {...buttonProps}>
          {children}
        </ButtonRoot>
        <Tooltip placement="top end">So cool</Tooltip>
      </TooltipTrigger>
    );
  }
);

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";
