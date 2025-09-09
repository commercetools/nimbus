import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { DialogRootSlot } from "../dialog.slots";
import type { DialogRootProps } from "../dialog.types";

/**
 * # Dialog.Root
 *
 * The root component that provides context and state management for the dialog.
 * Uses React Aria's DialogTrigger for accessibility and keyboard interaction.
 *
 * This component must wrap all dialog parts (Trigger, Content, etc.) and provides
 * the dialog open/close state and variant styling context.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Dialog Title</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>Dialog content</Dialog.Body>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogRoot = (props: DialogRootProps) => {
  const {
    children,
    isOpen,
    onOpenChange,
    defaultOpen = false,
    ...restProps
  } = props;

  return (
    <DialogRootSlot {...restProps}>
      <RaDialogTrigger
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
      >
        {children}
      </RaDialogTrigger>
    </DialogRootSlot>
  );
};

DialogRoot.displayName = "Dialog.Root";
