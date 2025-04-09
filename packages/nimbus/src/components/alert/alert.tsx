import AlertTitle from "./components/alert.title";
import AlertDescription from "./components/alert.description";
import AlertActions from "./components/alert.actions";
import AlertDismissButton from "./components/alert.dismiss-button";
import AlertRoot from "./components/alert.root";

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 */
const Alert = {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
  DismissButton: AlertDismissButton,
};

export default Alert;
