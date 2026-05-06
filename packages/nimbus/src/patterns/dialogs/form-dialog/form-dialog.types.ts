import type { ReactNode } from "react";

/**
 * Props for the FormDialog pattern component.
 *
 * A pre-composed save/cancel dialog built on top of the Nimbus Dialog
 * primitive and Button primitive, shaped for hosting an editable form
 * in the body. The flat API covers the overwhelmingly common
 * form-in-a-modal case: a title, form content, two action callbacks,
 * and optional state props.
 *
 * Consumers needing a non-default size, custom dismissability,
 * per-button `data-*` attributes, or a separate `onClose` / `onCancel`
 * distinction should compose `Dialog.Root`, `Dialog.Content`,
 * `Dialog.Header`, `Dialog.Title`, `Dialog.Body`, `Dialog.Footer`,
 * `Dialog.CloseTrigger`, and `Button` directly (see the "Escape hatch"
 * section in the dev documentation).
 */
export type FormDialogProps = {
  /**
   * Title rendered inside the dialog header.
   *
   * When passed as a string, the dialog's accessible name is derived
   * from the string automatically. When passed as a ReactNode (for
   * example a composed heading with an icon or badge), pair with
   * `aria-label` if the composed markup would not produce a meaningful
   * accessible name.
   */
  title: ReactNode;

  /**
   * Form content rendered inside the dialog body.
   *
   * The pattern does NOT wrap children in a native `<form>` element —
   * `onSave` is invoked from the save button's `onPress`, not from a
   * form `submit` event. Consumers wanting Enter-to-submit semantics or
   * browser-native validation should wrap their fields in
   * `<form onSubmit={handleSubmit}>` inside `children` and call the
   * pattern's `onSave` from `handleSubmit`.
   *
   * Long content scrolls within the body; the header and footer remain
   * pinned at the top and bottom of the dialog respectively.
   */
  children: ReactNode;

  /**
   * Callback fired when the user explicitly saves by clicking the save
   * button. Not invoked when the dialog is dismissed via the cancel
   * button, the close button in the header, the Escape key, or an
   * overlay click.
   *
   * If the callback returns a `Promise`, the dialog stays open while
   * the promise is pending and closes automatically when it fulfills.
   * If the promise rejects, the dialog stays open so the consumer can
   * surface validation errors and let the user correct and retry —
   * pair with `isSaveLoading` to render the spinner / lockout while
   * the promise is in flight.
   */
  onSave: () => void | Promise<void>;

  /**
   * Callback fired when the user cancels — by clicking the cancel
   * button, the close button in the header, pressing Escape, or
   * clicking the overlay. Always paired with `onOpenChange(false)` so
   * consumers can distinguish a semantic cancel from a generic
   * open-state change.
   */
  onCancel: () => void;

  /**
   * Whether the dialog is open (controlled mode).
   *
   * Pair with `onOpenChange` to drive the dialog from consumer state.
   * When omitted, use `defaultOpen` to start the dialog open in
   * uncontrolled mode.
   */
  isOpen?: boolean;

  /**
   * Whether the dialog is open by default (uncontrolled mode).
   *
   * Use when the consumer does not need to observe or control the open
   * state. Ignored when `isOpen` is provided.
   *
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when the open state changes. Invoked with `false`
   * whenever the dialog is closed via any affordance (save, cancel,
   * close button, Escape, overlay click).
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Label for the save button.
   *
   * When omitted, the button renders the localized default
   * `Nimbus.FormDialog.save` ("Save" in English).
   */
  saveLabel?: ReactNode;

  /**
   * Label for the cancel button.
   *
   * When omitted, the button renders the localized default
   * `Nimbus.FormDialog.cancel` ("Cancel" in English).
   */
  cancelLabel?: ReactNode;

  /**
   * Whether the save button is disabled.
   *
   * Use to gate the save action on consumer-side validity (e.g.
   * required form fields are empty or invalid).
   */
  isSaveDisabled?: boolean;

  /**
   * Whether the save action is in flight.
   *
   * When `true`, the save button shows a loading spinner and is
   * disabled, the cancel button is also disabled, and the dialog's
   * dismiss affordances (Escape, overlay click, close button) are
   * suppressed for the duration — preventing races between save and
   * cancel and protecting against in-flight data loss.
   */
  isSaveLoading?: boolean;

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
