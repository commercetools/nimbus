import {
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertDismissButton,
  AlertRoot,
} from "./components";

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/alert}
 *
 * @example
 * ```tsx
 * <Alert.Root tone="info" variant="outlined">
 *   <Alert.Title>Information</Alert.Title>
 *   <Alert.Description>This is an informational alert message.</Alert.Description>
 * </Alert.Root>
 * ```
 */
export const Alert = {
  /**
   * # Alert.Root
   *
   * The root component that provides context and configuration for the alert.
   * Must wrap all alert parts (Title, Description, Actions, DismissButton) to coordinate their behavior.
   *
   * @example
   * ```tsx
   * <Alert.Root tone="info" variant="outlined">
   *   <Alert.Title>Title</Alert.Title>
   *   <Alert.Description>Description</Alert.Description>
   * </Alert.Root>
   * ```
   */
  Root: AlertRoot,
  /**
   * # Alert.Title
   *
   * Displays the title text for the alert.
   * Typically shown in bold to provide a clear heading for the alert message.
   *
   * @example
   * ```tsx
   * <Alert.Root tone="critical">
   *   <Alert.Title>Error Occurred</Alert.Title>
   * </Alert.Root>
   * ```
   */
  Title: AlertTitle,
  /**
   * # Alert.Description
   *
   * Displays the descriptive text for the alert.
   * Provides detailed information about the alert's purpose or the action required.
   *
   * @example
   * ```tsx
   * <Alert.Root tone="warning">
   *   <Alert.Title>Warning</Alert.Title>
   *   <Alert.Description>Please review the following items before proceeding.</Alert.Description>
   * </Alert.Root>
   * ```
   */
  Description: AlertDescription,
  /**
   * # Alert.Actions
   *
   * Container for action buttons within the alert.
   * Allows users to take actions directly from the alert message.
   *
   * @example
   * ```tsx
   * <Alert.Root tone="positive">
   *   <Alert.Title>Success</Alert.Title>
   *   <Alert.Description>Your changes have been saved.</Alert.Description>
   *   <Alert.Actions>
   *     <Button>View Details</Button>
   *   </Alert.Actions>
   * </Alert.Root>
   * ```
   */
  Actions: AlertActions,
  /**
   * # Alert.DismissButton
   *
   * Button to dismiss or close the alert.
   * Provides users with the ability to manually remove the alert from view.
   *
   * @example
   * ```tsx
   * <Alert.Root tone="info">
   *   <Alert.Title>Notification</Alert.Title>
   *   <Alert.Description>You have new messages.</Alert.Description>
   *   <Alert.DismissButton onClick={() => console.log('Dismissed')} />
   * </Alert.Root>
   * ```
   */
  DismissButton: AlertDismissButton,
};

// exports for internal use by react-docgen
export {
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
  AlertDescription as _AlertDescription,
  AlertActions as _AlertActions,
  AlertDismissButton as _AlertDismissButton,
};
