import { useControlledState } from "react-stately/useControlledState";
import { Button } from "@/components/button/button";
import { Dialog } from "@/components/dialog/dialog";
import { LoadingSpinner } from "@/components/loading-spinner/loading-spinner";
import { useLocalizedStringFormatter } from "@/hooks";
import { formDialogMessagesStrings } from "./form-dialog.messages";
import type { FormDialogProps } from "./form-dialog.types";

/**
 * # FormDialog
 *
 * A pre-composed save/cancel dialog pattern built on top of the Nimbus
 * `Dialog` and `Button` primitives, shaped for hosting an editable form
 * in the body. Exposes a flat API (`title`, `children`, `onSave`,
 * `onCancel`, plus optional state, label, and accessibility props) for
 * the common case of editing data inside a modal.
 *
 * Close affordances: clicking the cancel button, the X button in the
 * header, pressing Escape, or clicking the overlay all invoke
 * `onCancel` and `onOpenChange(false)`. Clicking the save button
 * invokes `onSave` and then closes — synchronously for `void` returns,
 * or after the returned `Promise` fulfills for async saves; rejected
 * promises leave the dialog open so the consumer can surface
 * validation errors. The save path never fires `onCancel`.
 *
 * When `isSaveLoading` is `true` the entire dialog is locked: the save
 * button shows a spinner and is disabled, the cancel button is
 * disabled, and Escape / overlay click / close-button click are all
 * suppressed.
 *
 * The pattern does not wrap `children` in a native `<form>` element.
 * Consumers wanting Enter-to-submit semantics or browser-native
 * validation should wrap their fields in
 * `<form onSubmit={handleSubmit}>` inside `children` and call `onSave`
 * from `handleSubmit`.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <FormDialog
 *   title="Edit profile"
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSave={handleSave}
 *   onCancel={() => setIsOpen(false)}
 *   isSaveDisabled={!isDirty}
 * >
 *   <TextInput label="Display name" value={name} onChange={setName} />
 * </FormDialog>
 * ```
 */
export const FormDialog = ({
  title,
  children,
  onSave,
  onCancel,
  isOpen,
  defaultOpen,
  onOpenChange,
  saveLabel,
  cancelLabel,
  isSaveDisabled = false,
  isSaveLoading = false,
  "aria-label": ariaLabel,
}: FormDialogProps) => {
  const msg = useLocalizedStringFormatter(formDialogMessagesStrings);

  // Internalize open state so we can close the dialog from our cancel
  // and save buttons without relying on `slot="close"` (which races
  // its `onOpenChange` notification against the button's `onPress`
  // handler and double-fires the cancel callback).
  const [open, setOpen] = useControlledState<boolean>(
    isOpen,
    defaultOpen ?? false,
    onOpenChange
  );

  const resolvedSaveLabel = saveLabel ?? msg.format("save");
  const resolvedCancelLabel = cancelLabel ?? msg.format("cancel");

  const handleSave = async () => {
    const result = onSave();
    // If the consumer returns a Promise, wait for it to settle before
    // closing — otherwise the dialog vanishes synchronously and the
    // consumer's `isSaveLoading` lockout never paints. On rejection we
    // stay open so the consumer can surface validation errors and let
    // the user retry.
    if (result instanceof Promise) {
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
  // overlay click, and the close-button X. Our cancel and save buttons
  // close via `setOpen(false)` directly and do NOT route through this
  // callback. The X close button is owned by the pattern via
  // `isDisabled={isSaveLoading}`, so this handler does not need to
  // re-check the loading flag for it.
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
      isDismissable={!isSaveLoading}
      isKeyboardDismissDisabled={isSaveLoading}
      scrollBehavior="inside"
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.CloseTrigger isDisabled={isSaveLoading} />
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
        <Dialog.Footer>
          <Button
            variant="outline"
            isDisabled={isSaveLoading}
            onPress={handleCancelButton}
          >
            {resolvedCancelLabel}
          </Button>
          <Button
            variant="solid"
            colorPalette="primary"
            isDisabled={isSaveDisabled || isSaveLoading}
            onPress={handleSave}
          >
            {resolvedSaveLabel}
            {isSaveLoading && <LoadingSpinner ml="100" size="2xs" />}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

FormDialog.displayName = "FormDialog";
