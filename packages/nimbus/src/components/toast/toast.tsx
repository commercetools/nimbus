import {
  ToastTitle,
  ToastDescription,
  ToastActionTrigger,
  ToastCloseTrigger,
  ToastRoot,
} from "./components";

/**
 * Toast
 * ============================================================
 * Notification component for displaying temporary, non-intrusive messages
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/toast}
 *
 * @example
 * ```tsx
 * <Toast.Root type="info">
 *   <Toast.Title>Information</Toast.Title>
 *   <Toast.Description>This is an informational toast message.</Toast.Description>
 *   <Toast.CloseTrigger />
 * </Toast.Root>
 * ```
 */
export const Toast = {
  /**
   * # Toast.Root
   *
   * The root component that provides context and configuration for the toast.
   * Must wrap all toast parts (Title, Description, ActionTrigger, CloseTrigger) to coordinate their behavior.
   *
   * @example
   * ```tsx
   * <Toast.Root type="info">
   *   <Toast.Title>Title</Toast.Title>
   *   <Toast.Description>Description</Toast.Description>
   * </Toast.Root>
   * ```
   */
  Root: ToastRoot,
  /**
   * # Toast.Title
   *
   * Displays the title text for the toast.
   * Typically shown in bold to provide a clear heading for the toast message.
   *
   * @example
   * ```tsx
   * <Toast.Root type="error">
   *   <Toast.Title>Error Occurred</Toast.Title>
   * </Toast.Root>
   * ```
   */
  Title: ToastTitle,
  /**
   * # Toast.Description
   *
   * Displays the descriptive text for the toast.
   * Provides detailed information about the toast's purpose or the action required.
   *
   * @example
   * ```tsx
   * <Toast.Root type="warning">
   *   <Toast.Title>Warning</Toast.Title>
   *   <Toast.Description>Please review the following items before proceeding.</Toast.Description>
   * </Toast.Root>
   * ```
   */
  Description: ToastDescription,
  /**
   * # Toast.ActionTrigger
   *
   * Button for action within the toast.
   * Allows users to take actions directly from the toast message.
   *
   * @example
   * ```tsx
   * <Toast.Root type="success">
   *   <Toast.Title>Success</Toast.Title>
   *   <Toast.Description>Your changes have been saved.</Toast.Description>
   *   <Toast.ActionTrigger onClick={() => console.log('Undo')}>Undo</Toast.ActionTrigger>
   * </Toast.Root>
   * ```
   */
  ActionTrigger: ToastActionTrigger,
  /**
   * # Toast.CloseTrigger
   *
   * Button to dismiss or close the toast.
   * Provides users with the ability to manually remove the toast from view.
   *
   * @example
   * ```tsx
   * <Toast.Root type="info">
   *   <Toast.Title>Notification</Toast.Title>
   *   <Toast.Description>You have new messages.</Toast.Description>
   *   <Toast.CloseTrigger onClick={() => console.log('Dismissed')} />
   * </Toast.Root>
   * ```
   */
  CloseTrigger: ToastCloseTrigger,
};

// exports for internal use by react-docgen
export {
  ToastRoot as _ToastRoot,
  ToastTitle as _ToastTitle,
  ToastDescription as _ToastDescription,
  ToastActionTrigger as _ToastActionTrigger,
  ToastCloseTrigger as _ToastCloseTrigger,
};
