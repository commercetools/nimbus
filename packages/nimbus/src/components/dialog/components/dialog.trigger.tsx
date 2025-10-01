import { Button as RaButton } from "react-aria-components";
import { DialogTriggerSlot } from "../dialog.slots";
import type { DialogTriggerProps } from "../dialog.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { chakra } from "@chakra-ui/react/styled-system";

export const DialogTrigger = ({
  ref: forwardedRef,
  children,
  asChild,
  ...props
}: DialogTriggerProps) => {
  // If asChild is true, wrap children directly in RaButton with asChild
  if (asChild) {
    return (
      <chakra.button ref={forwardedRef} asChild {...props}>
        {children}
      </chakra.button>
    );
  }

  const [styleProps, restProps] = extractStyleProps(props);

  // Otherwise, wrap with both DialogTriggerSlot and RaButton
  // Only pass React Aria compatible props to avoid type conflicts
  return (
    <DialogTriggerSlot {...styleProps} asChild>
      <RaButton ref={forwardedRef} {...restProps}>
        {children}
      </RaButton>
    </DialogTriggerSlot>
  );
};

DialogTrigger.displayName = "Dialog.Trigger";
