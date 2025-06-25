import { useRef } from "react";
import { useButton, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

export const Button = (props: ButtonProps) => {
  const { ref: forwardedRef, as, asChild, children, ...rest } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLButtonElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // if asChild is set, for react-aria to add the button-role, the elementType
  // has to be manually set to something else than button

  const elementType = as || (asChild ? "a" : "button") || "button";

  const { buttonProps } = useButton(
    {
      ...rest,
      elementType,
    },
    ref
  );

  return (
    <ButtonRoot {...mergeProps(rest, buttonProps, { as, asChild })} ref={ref}>
      {children}
    </ButtonRoot>
  );
};

// Manually assign a displayName for debugging purposes
Button.displayName = "Button";
