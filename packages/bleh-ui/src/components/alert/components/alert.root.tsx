import {
  createContext,
  forwardRef,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertRoot as AlertRootSlot, AlertIcon } from "../alert.slots";
import type { AlertProps, AlertRootComponent } from "../alert.types";
import { Box } from "../../box";
import { Stack } from "../../stack";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@bleh-ui/icons";

const getIconFromTone = (tone: AlertProps["tone"]) => {
  switch (tone) {
    case "critical":
      return <ErrorOutline />;
    case "info":
      return <Info />;
    case "warning":
      return <WarningAmber />;
    case "positive":
      return <CheckCircleOutline />;
    default:
      return null;
  }
};

type AlertContextValue = {
  setTitle: (title: ReactNode) => void;
  setDescription: (description: ReactNode) => void;
  setActions: (actions: ReactNode) => void;
  setDismiss: (dismiss: ReactNode) => void;
};

export const AlertContext = createContext<AlertContextValue | undefined>(
  undefined
);

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 */
const AlertRoot: AlertRootComponent = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, ...props }, ref) => {
    const [titleNode, setTitle] = useState<ReactNode>(null);
    const [descriptionNode, setDescription] = useState<ReactNode>(null);
    const [actionsNode, setActions] = useState<ReactNode>(null);
    const [dismissNode, setDismiss] = useState<ReactNode>(null);

    // Memoize the context value so we don't cause unnecessary re-renders
    const contextValue = useMemo(
      () => ({
        setTitle,
        setDescription,
        setActions,
        setDismiss,
      }),
      [setTitle, setDescription, setActions, setDismiss]
    );

    return (
      <AlertContext.Provider value={contextValue}>
        <AlertRootSlot ref={ref} {...props} role="alert">
          <AlertIcon alignItems="flex-start">
            {getIconFromTone(props.tone)}
          </AlertIcon>
          <Stack flex="1" gap="200">
            <Box>
              {titleNode}
              {descriptionNode}
            </Box>
            {actionsNode}
          </Stack>
          {dismissNode}

          {children}
        </AlertRootSlot>
      </AlertContext.Provider>
    );
  }
);

AlertRoot.displayName = "Alert";

export default AlertRoot;
