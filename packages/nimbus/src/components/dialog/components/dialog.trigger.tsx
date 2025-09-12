import { Button as RaButton } from "react-aria-components";
import { DialogTriggerSlot } from "../dialog.slots";
import type { DialogTriggerProps } from "../dialog.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * # Dialog.Trigger
 *
 * The trigger element that opens the dialog when activated.
 * Uses React Aria's Button for accessibility and keyboard support.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>...</Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogTrigger = ({
  children,
  asChild,
  ...props
}: DialogTriggerProps) => {
  // If asChild is true, wrap children directly in RaButton with asChild
  if (asChild) {
    return (
      <DialogTriggerSlot asChild {...props}>
        {children}
      </DialogTriggerSlot>
    );
  }

  const [styleProps, restProps] = extractStyleProps(props);

  // Otherwise, wrap with both DialogTriggerSlot and RaButton
  // Only pass React Aria compatible props to avoid type conflicts
  return (
    <DialogTriggerSlot {...styleProps} asChild>
      <RaButton {...restProps}>{children}</RaButton>
    </DialogTriggerSlot>
  );
};

DialogTrigger.displayName = "Dialog.Trigger";
