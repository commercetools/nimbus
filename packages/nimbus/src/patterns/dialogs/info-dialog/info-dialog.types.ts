import type { ReactNode } from "react";

/**
 * Props for the InfoDialog pattern component.
 *
 * A pre-composed read-only informational dialog built on top of the Nimbus
 * Dialog primitive. The flat API covers the overwhelmingly common
 * informational-dialog case (string or composed-JSX title, default size,
 * default dismiss behaviour).
 *
 * Consumers needing a non-default size or custom dismissability should
 * compose `Dialog.Root`, `Dialog.Content`, `Dialog.Header`, `Dialog.Title`,
 * `Dialog.Body`, and `Dialog.CloseTrigger` directly (see the "Escape hatch"
 * section in the dev documentation).
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
   * Callback fired when the open state changes.
   *
   * Invoked with `false` when the user closes the dialog via the close
   * button in the header, the Escape key, or a click on the overlay.
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Accessible label for the dialog, forwarded to the underlying
   * `Dialog.Root`.
   *
   * By default the dialog's accessible name is derived from `title`. Provide
   * this override when `title` is a composed `ReactNode` whose text content
   * would produce a confusing accessible name (for example a title that
   * concatenates inline badges or icons).
   */
  "aria-label"?: string;
};
