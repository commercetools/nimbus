import { Dialog } from "@/components";
import type { InfoDialogProps } from "./info-dialog.types";

/**
 * # InfoDialog
 *
 * A pre-composed, read-only informational dialog pattern built on top of the
 * Nimbus `Dialog` primitive. Exposes a flat four-prop API (`title`, `isOpen`,
 * `onOpenChange`, `children`) for the common case of showing information the
 * user only needs to read and dismiss.
 *
 * Close affordances: the X button in the header, the Escape key, and a click
 * on the overlay all invoke `onOpenChange(false)`.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <InfoDialog
 *   title="Shipping restrictions"
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <Text>Some goods cannot be shipped to the selected region.</Text>
 * </InfoDialog>
 * ```
 */
export const InfoDialog = ({
  title,
  children,
  isOpen,
  onOpenChange,
}: InfoDialogProps) => {
  return (
    <Dialog.Root isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

InfoDialog.displayName = "InfoDialog";
