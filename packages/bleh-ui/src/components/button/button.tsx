import { isValidElement, forwardRef } from "react";
import { useButton, useObjectRef } from "react-aria";
import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { as, asChild, children, ...rest } = props;
    const objRef = useObjectRef(ref);

    // if asChild is set, for react-aria to add the button-role, the elementType
    // has to be manually set to something else than button
    const elementType = as || (asChild ? "a" : "button") || "button";

    const { buttonProps } = useButton(
      {
        ...rest,
        elementType,
      },
      objRef
    );

    return (
      <ButtonRoot
        as={as}
        asChild={asChild}
        ref={objRef}
        {...rest}
        {...buttonProps}
      >
        {children}
      </ButtonRoot>
    );
  }
);

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";
