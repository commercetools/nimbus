import type { ReactNode } from "react";
import type { ButtonProps } from "@/components/button/button.types";

/**
 * Props for the FormActionBar pattern.
 *
 * A flat-props API surface around a `Group` of save/cancel/delete buttons for
 * use inside form footers (e.g., `DefaultPage.Footer`, `ModalPage.Footer`,
 * `Drawer.Footer`, `Dialog.Footer`).
 *
 * The delete button is only rendered when `onDelete` is provided.
 */
export type FormActionBarProps = {
  /**
   * Called when the user presses the save button.
   */
  onSave: () => void;

  /**
   * Called when the user presses the cancel button.
   */
  onCancel: () => void;

  /**
   * Called when the user presses the delete button. When omitted, the delete
   * button is not rendered.
   */
  onDelete?: () => void;

  /**
   * Override for the save button label. Defaults to an i18n message ("Save").
   * Accepts a `ReactNode` so consumers can include an icon alongside the
   * label (e.g., `<><Icon slot="icon" /> Publish</>`).
   */
  saveLabel?: ReactNode;

  /**
   * Override for the cancel button label. Defaults to an i18n message ("Cancel").
   * Accepts a `ReactNode` so consumers can include an icon alongside the label.
   */
  cancelLabel?: ReactNode;

  /**
   * Override for the delete button label. Defaults to an i18n message ("Delete").
   * Accepts a `ReactNode` so consumers can include an icon alongside the label.
   */
  deleteLabel?: ReactNode;

  /**
   * Disables the save button. Useful when the form has validation errors or
   * no pending changes.
   * @default false
   */
  isSaveDisabled?: boolean;

  /**
   * Shows a loading spinner inside the save button and disables all buttons
   * while saving.
   * @default false
   */
  isSaveLoading?: boolean;

  /**
   * Shows a loading spinner inside the delete button and disables all buttons
   * while deleting. Only meaningful when `onDelete` is provided.
   * @default false
   */
  isDeleteLoading?: boolean;

  /**
   * Accessible label for the action bar group. Defaults to an i18n message
   * ("Form actions").
   */
  "aria-label"?: string;

  /**
   * Forwards a React Aria slot name onto the cancel button. The primary use
   * case is `"close"` when the bar is rendered inside a `Dialog`, `Drawer`,
   * or `ModalPage` footer — React Aria's dialog wires a close handler into
   * any descendant button with `slot="close"`, so the dialog dismisses when
   * the user cancels without the consumer having to also call `setIsOpen`.
   * The consumer's `onCancel` still fires alongside the slot behavior.
   */
  cancelSlot?: string;

  /**
   * Size applied uniformly to the delete, cancel, and save buttons. Matches
   * the underlying `Button`'s `size` prop.
   * @default "md"
   */
  buttonSize?: ButtonProps["size"];
};
