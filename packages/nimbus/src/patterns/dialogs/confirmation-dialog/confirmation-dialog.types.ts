import type { ReactNode } from "react";

/**
 * Props for the ConfirmationDialog pattern component.
 *
 * A pre-composed confirm/cancel dialog built on top of the Nimbus Dialog
 * primitive and Button primitive. The flat API covers the overwhelmingly
 * common confirm/cancel-dialog case: a title, a body, two action callbacks,
 * and optional state and intent props.
 *
 * Consumers needing a non-default size, custom dismissability, per-button
 * `data-*` attributes, or a separate `onClose` / `onCancel` distinction
 * should compose `Dialog.Root`, `Dialog.Content`, `Dialog.Header`,
 * `Dialog.Title`, `Dialog.Body`, `Dialog.Footer`, `Dialog.CloseTrigger`,
 * and `Button` directly (see the "Escape hatch" section in the dev
 * documentation).
 */
export type ConfirmationDialogProps = {
  /**
   * Title rendered inside the dialog header.
   *
   * When passed as a string, the dialog's accessible name is derived from
   * the string automatically. When passed as a ReactNode (for example a
   * composed heading with an icon or badge), pair with `aria-label` if
   * the composed markup would not produce a meaningful accessible name.
   */
  title: ReactNode;

  /**
   * Content rendered inside the dialog body.
   *
   * Long content scrolls within the body; the header and footer remain
   * pinned at the top and bottom of the dialog respectively.
   */
  children: ReactNode;

  /**
   * Callback fired when the user explicitly confirms by clicking the
   * confirm button. Not invoked when the dialog is dismissed via the
   * cancel button, the close button in the header, the Escape key, or
   * an overlay click.
   *
   * If the callback returns a `Promise`, the dialog stays open while
   * the promise is pending and closes automatically when it
   * fulfills. If the promise rejects, the dialog stays open so the
   * consumer can surface the error and let the user retry — pair
   * with `isConfirmLoading` to render the spinner / lockout while
   * the promise is in flight.
   */
  onConfirm: () => void | Promise<void>;

  /**
   * Callback fired when the user cancels — by clicking the cancel button,
   * the close button in the header, pressing Escape, or clicking the
   * overlay. Always paired with `onOpenChange(false)` so consumers can
   * distinguish a semantic cancel from a generic open-state change.
   */
  onCancel: () => void;

  /**
   * Whether the dialog is open (controlled mode).
   *
   * Pair with `onOpenChange` to drive the dialog from consumer state. When
   * omitted, use `defaultOpen` to start the dialog open in uncontrolled mode.
   */
  isOpen?: boolean;

  /**
   * Whether the dialog is open by default (uncontrolled mode).
   *
   * Use when the consumer does not need to observe or control the open state.
   * Ignored when `isOpen` is provided.
   *
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when the open state changes. Invoked with `false`
   * whenever the dialog is closed via any affordance (confirm, cancel,
   * close button, Escape, overlay click).
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Label for the confirm button.
   *
   * When omitted, the button renders the localized default
   * `Nimbus.ConfirmationDialog.confirm` ("Confirm" in English).
   */
  confirmLabel?: ReactNode;

  /**
   * Label for the cancel button.
   *
   * When omitted, the button renders the localized default
   * `Nimbus.ConfirmationDialog.cancel` ("Cancel" in English).
   */
  cancelLabel?: ReactNode;

  /**
   * Visual intent of the confirm action.
   *
   * - `"default"` renders the confirm button with the primary color
   *   palette.
   * - `"destructive"` renders the confirm button with the critical
   *   color palette, suitable for delete / remove / discard flows.
   *
   * @default "default"
   */
  intent?: "default" | "destructive";

  /**
   * Whether the confirm button is disabled.
   *
   * Use to gate the confirm action on consumer-side validity (e.g. a
   * required acknowledgement checkbox is unchecked).
   */
  isConfirmDisabled?: boolean;

  /**
   * Whether the confirm action is in flight.
   *
   * When `true`, the confirm button shows a loading spinner and is
   * disabled, the cancel button is also disabled, and the dialog's
   * dismiss affordances (Escape, overlay click, close button) are
   * suppressed for the duration — preventing races between confirm and
   * cancel.
   */
  isConfirmLoading?: boolean;

  /**
   * Accessible label for the dialog, forwarded to the underlying
   * `Dialog.Root`.
   *
   * By default the dialog's accessible name is derived from `title`.
   * Provide this override when `title` is a composed `ReactNode` whose
   * text content would produce a confusing accessible name (for example
   * a title that concatenates inline badges or icons).
   */
  "aria-label"?: string;
};
