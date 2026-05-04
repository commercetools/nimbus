import { useControlledState } from "react-stately/useControlledState";
import { Button } from "@/components/button/button";
import { Dialog } from "@/components/dialog/dialog";
import { LoadingSpinner } from "@/components/loading-spinner/loading-spinner";
import { useLocalizedStringFormatter } from "@/hooks";
import { confirmationDialogMessagesStrings } from "./confirmation-dialog.messages";
import type { ConfirmationDialogProps } from "./confirmation-dialog.types";

/**
 * # ConfirmationDialog
 *
 * A pre-composed confirm/cancel dialog pattern built on top of the Nimbus
 * `Dialog` and `Button` primitives. Exposes a flat API
 * (`title`, `children`, `onConfirm`, `onCancel`, plus optional state, label,
 * intent, and accessibility props) for the common case of asking the user
 * "are you sure?" before a confirm/cancel action.
 *
 * Close affordances: clicking the cancel button, the X button in the
 * header, pressing Escape, or clicking the overlay all invoke `onCancel`
 * and `onOpenChange(false)`. Clicking the confirm button invokes
 * `onConfirm` and then closes — synchronously for `void` returns, or
 * after the returned `Promise` fulfills for async confirms; rejected
 * promises leave the dialog open. The confirm path never fires
 * `onCancel`.
 *
 * When `isConfirmLoading` is `true` the entire dialog is locked: the
 * confirm button shows a spinner and is disabled, the cancel button is
 * disabled, and Escape / overlay click / close-button click are all
 * suppressed.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmationDialog
 *   title="Delete project"
 *   intent="destructive"
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   onConfirm={handleDelete}
 *   onCancel={() => setIsOpen(false)}
 * >
 *   <Text>This action cannot be undone.</Text>
 * </ConfirmationDialog>
 * ```
 */
export const ConfirmationDialog = ({
  title,
  children,
  onConfirm,
  onCancel,
  isOpen,
  defaultOpen,
  onOpenChange,
  confirmLabel,
  cancelLabel,
  intent = "default",
  isConfirmDisabled = false,
  isConfirmLoading = false,
  "aria-label": ariaLabel,
}: ConfirmationDialogProps) => {
  const msg = useLocalizedStringFormatter(confirmationDialogMessagesStrings);

  // Internalize open state so we can close the dialog from our cancel
  // and confirm buttons without relying on `slot="close"` (which races
  // its `onOpenChange` notification against the button's `onPress`
  // handler and double-fires the cancel callback).
  const [open, setOpen] = useControlledState<boolean>(
    isOpen,
    defaultOpen ?? false,
    onOpenChange
  );

  const resolvedConfirmLabel = confirmLabel ?? msg.format("confirm");
  const resolvedCancelLabel = cancelLabel ?? msg.format("cancel");
  const confirmColorPalette = intent === "destructive" ? "critical" : "primary";

  const handleConfirm = async () => {
    const result = onConfirm();
    // If the consumer returns a Promise, wait for it to settle before
    // closing — otherwise the dialog vanishes synchronously and the
    // consumer's `isConfirmLoading` lockout never paints. On rejection
    // we stay open so the consumer can surface an error and let the
    // user retry.
    if (
      result !== undefined &&
      typeof (result as Promise<void>).then === "function"
    ) {
      try {
        await result;
        setOpen(false);
      } catch {
        // intentional: stay open on rejection
      }
    } else {
      setOpen(false);
    }
  };

  const handleCancelButton = () => {
    onCancel();
    setOpen(false);
  };

  // `Dialog.Root` invokes its `onOpenChange` for dismiss paths not
  // driven by an explicit `onPress` in this component — Escape,
  // overlay click, and the close-button X (which is `slot="close"`
  // inside Dialog.CloseTrigger). Our cancel and confirm buttons close
  // via `setOpen(false)` directly and do NOT route through this
  // callback.
  const handleAmbientOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onCancel();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog.Root
      isOpen={open}
      onOpenChange={handleAmbientOpenChange}
      aria-label={ariaLabel}
      isDismissable={!isConfirmLoading}
      isKeyboardDismissDisabled={isConfirmLoading}
      scrollBehavior="inside"
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.CloseTrigger isDisabled={isConfirmLoading} />
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="outline"
            isDisabled={isConfirmLoading}
            onPress={handleCancelButton}
          >
            {resolvedCancelLabel}
          </Button>
          <Button
            variant="solid"
            colorPalette={confirmColorPalette}
            isDisabled={isConfirmDisabled || isConfirmLoading}
            onPress={handleConfirm}
          >
            {resolvedConfirmLabel}
            {isConfirmLoading && <LoadingSpinner ml="100" size="2xs" />}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

ConfirmationDialog.displayName = "ConfirmationDialog";
