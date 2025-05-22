import { AlertTitle } from "./components/alert.title";
import { AlertDescription } from "./components/alert.description";
import { AlertActions } from "./components/alert.actions";
import { AlertDismissButton } from "./components/alert.dismiss-button";
import { AlertRoot } from "./components/alert.root";

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 */
export const Alert = {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
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
