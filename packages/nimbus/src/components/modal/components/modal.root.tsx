import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { ModalRootSlot } from "../modal.slots";
import type { ModalRootProps } from "../modal.types";

/**
 * # Modal.Root
 *
 * The root component that provides context and state management for the modal.
 * Uses React Aria's DialogTrigger for accessibility and keyboard interaction.
 *
 * This component must wrap all modal parts (Trigger, Content, etc.) and provides
 * the modal open/close state and variant styling context.
 *
 * @example
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Header>
 *       <Modal.Title>Modal Title</Modal.Title>
 *     </Modal.Header>
 *     <Modal.Body>Modal content</Modal.Body>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const ModalRoot = (props: ModalRootProps) => {
  const {
    children,
    isOpen,
    onOpenChange,
    defaultOpen = false,
    isDisabled = false,
    ...restProps
  } = props;

  return (
    <ModalRootSlot {...restProps}>
      <RaDialogTrigger
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        isDisabled={isDisabled}
      >
        {children}
      </RaDialogTrigger>
    </ModalRootSlot>
  );
};

ModalRoot.displayName = "Modal.Root";
