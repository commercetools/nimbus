import { isValidElement, forwardRef, cloneElement } from "react";
import { useButton, useObjectRef } from "react-aria";
import { Box } from "@/components";
import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { as, asChild, startIcon, endIcon, children, ...rest } = props;
    const objRef = useObjectRef(ref);
    const { buttonProps } = useButton(
      {
        ...rest,
        elementType: as,
      },
      objRef
    );

    if (asChild && isValidElement(children)) {
      return (
        <ButtonRoot asChild ref={objRef} {...rest} {...buttonProps}>
          {cloneElement(children, {
            children: (
              <>
                {startIcon && <Box as="span">{startIcon}</Box>}
                {!startIcon && !endIcon ? (
                  (children.props as { children: React.ReactNode }).children
                ) : (
                  <Box as="span" flexGrow="1">
                    {(children.props as { children: React.ReactNode }).children}
                  </Box>
                )}
                {endIcon && <Box as="span">{endIcon}</Box>}
              </>
            ),
          } as { children: React.ReactNode })}
        </ButtonRoot>
      );
    }

    return (
      <ButtonRoot as={as || "button"} ref={objRef} {...rest} {...buttonProps}>
        {startIcon && <Box as="span">{startIcon}</Box>}

        {!startIcon && !endIcon ? (
          children
        ) : (
          <Box as="span" flexGrow="1">
            {children}
          </Box>
        )}

        {endIcon && <Box as="span">{endIcon}</Box>}
      </ButtonRoot>
    );
  }
);

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";
