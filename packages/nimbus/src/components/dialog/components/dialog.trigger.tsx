import { Button as RaButton } from "react-aria-components";
import { DialogTriggerSlot } from "../dialog.slots";
import type { DialogTriggerProps } from "../dialog.types";

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
export const DialogTrigger = (props: DialogTriggerProps) => {
  const { 
    children, 
    asChild, 
    isDisabled, 
    // Extract button-specific props that might not work with React Aria Button
    value,
    type,
    form,
    name,
    formAction,
    formEncType,
    formMethod,
    formNoValidate,
    formTarget,
    ...restProps 
  } = props;

  // If asChild is true, wrap children directly in RaButton with asChild
  if (asChild) {
    return (
      <DialogTriggerSlot asChild disabled={isDisabled} {...restProps}>
        {children}
      </DialogTriggerSlot>
    );
  }

  // Otherwise, wrap with both DialogTriggerSlot and RaButton
  // Only pass React Aria compatible props to avoid type conflicts
  return (
    <DialogTriggerSlot asChild>
      <RaButton 
        isDisabled={isDisabled}
        className={restProps.className}
        id={restProps.id}
      >
        {children}
      </RaButton>
    </DialogTriggerSlot>
  );
};

DialogTrigger.displayName = "Dialog.Trigger";
