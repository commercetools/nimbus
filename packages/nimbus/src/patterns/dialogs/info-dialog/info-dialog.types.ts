import type { ReactNode } from "react";

/**
 * Props for the InfoDialog pattern component.
 *
 * A pre-composed read-only informational dialog built on top of the Nimbus
 * Dialog primitive. The flat four-prop API covers the overwhelmingly common
 * informational-dialog case (string or composed-JSX title, default size,
 * default dismiss behaviour).
 *
 * Consumers needing a non-default size, custom dismissability, or a custom
 * accessible label should compose `Dialog.Root`, `Dialog.Content`,
 * `Dialog.Header`, `Dialog.Title`, `Dialog.Body`, and `Dialog.CloseTrigger`
 * directly (see the "Escape hatch" section in the dev documentation).
 */
export type InfoDialogProps = {
  /**
   * Title rendered inside the dialog header.
   *
   * When passed as a string, the dialog's accessible name is derived from
   * the string automatically. When passed as a ReactNode (for example a
   * composed heading with an icon or badge), consumers remain responsible
   * for any additional a11y affordances their composition requires.
   */
  title: ReactNode;

  /**
   * Content rendered inside the dialog body.
   *
   * Long content scrolls within the body; the header remains pinned at the
   * top of the dialog.
   */
  children: ReactNode;

  /**
   * Whether the dialog is open (controlled mode).
   */
  isOpen?: boolean;

  /**
   * Callback fired when the open state changes.
   *
   * Invoked with `false` when the user closes the dialog via the close
   * button in the header, the Escape key, or a click on the overlay.
   */
  onOpenChange?: (isOpen: boolean) => void;
};
