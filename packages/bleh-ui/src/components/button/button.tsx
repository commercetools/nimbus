import { forwardRef, useRef } from "react";
import { useButton, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";

import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
    const { buttonProps } = useButton(props, ref);
    const { children, ...rest } = props;

    return (
      <ButtonRoot {...mergeProps(buttonProps, rest, { ref })}>
        {children}
      </ButtonRoot>
    );
  }
);

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";
