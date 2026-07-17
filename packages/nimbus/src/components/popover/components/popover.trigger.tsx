import { Button as RaButton } from "react-aria-components";
import { chakra } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import type { PopoverTriggerProps } from "../popover.types";

export const PopoverTrigger = ({
  ref: forwardedRef,
  children,
  asChild,
  ...props
}: PopoverTriggerProps) => {
  if (asChild) {
    return (
      <chakra.button ref={forwardedRef} asChild {...props}>
        {children}
      </chakra.button>
    );
  }

  const [, restProps] = extractStyleProps(props);

  return (
    <RaButton ref={forwardedRef} {...restProps}>
      {children}
    </RaButton>
  );
};

PopoverTrigger.displayName = "Popover.Trigger";
