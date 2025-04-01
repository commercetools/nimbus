import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";
import {
  AlertRoot,
  AlertIcon,
  AlertActions as AlertActionsSlot,
  AlertDescription as AlertDescriptionSlot,
  AlertDismiss as AlertDismissSlot,
  AlertTitle as AlertTitleSlot,
  type AlertActionsProps,
  type AlertDescriptionProps,
  type AlertDismissProps,
  type AlertTitleProps,
} from "./alert.slots";
import type { AlertProps } from "./alert.types";
import { Box } from "../box";
import { Stack } from "../stack";
import {
  CheckCircleOutline,
  Clear,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@bleh-ui/icons";
import { IconButton } from "../icon-button";

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

type AlertComponent = ForwardRefExoticComponent<
  AlertProps & RefAttributes<HTMLDivElement>
> & {
  Title: typeof AlertTitle;
  Description: typeof AlertDescription;
  Actions: typeof AlertActions;
  Dismiss: typeof AlertDismiss;
};

type AlertContextValue = {
  setTitle: (title: ReactNode) => void;
  setDescription: (description: ReactNode) => void;
  setActions: (actions: ReactNode) => void;
  setDismiss: (dismiss: ReactNode) => void;
};

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
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
        <AlertRoot ref={ref} {...props} role="alert">
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
        </AlertRoot>
      </AlertContext.Provider>
    );
  }
) as AlertComponent;
Alert.displayName = "Alert";

export const AlertTitle = ({ children, ...props }: AlertTitleProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertTitleSlot {...props} fontWeight="600">
          {children}
        </AlertTitleSlot>
      );
      // Register it with the parent
      context.setTitle(slotElement);

      // On unmount, remove it
      return () => context.setTitle(null);
    }
  }, [children, props]);

  return null;
};
AlertTitle.displayName = "AlertTitle";

export const AlertDismiss = ({ children, ...props }: AlertDismissProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertDismissSlot>
          <IconButton
            {...props}
            aria-label="Dismiss"
            variant="ghost"
            size="2xs"
          >
            <Clear />
          </IconButton>
        </AlertDismissSlot>
      );
      // Register it with the parent
      context.setDismiss(slotElement);

      // On unmount, remove it
      return () => context.setDismiss(null);
    }
  }, [children, props]);

  return null;
};
AlertDismiss.displayName = "AlertDismiss";

export const AlertDescription = ({
  children,
  ...props
}: AlertDescriptionProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertDescriptionSlot {...props}>{children}</AlertDescriptionSlot>
      );
      // Register it with the parent
      context.setDescription(slotElement);

      // On unmount, remove it
      return () => context.setDescription(null);
    }
  }, [children, props]);

  return null;
};
AlertDescription.displayName = "AlertDescription";

export const AlertActions = ({ children, ...props }: AlertActionsProps) => {
  const context = useContext(AlertContext);

  useEffect(() => {
    if (context) {
      const slotElement = (
        <AlertActionsSlot {...props}>{children}</AlertActionsSlot>
      );
      // Register it with the parent
      context.setActions(slotElement);

      // On unmount, remove it
      return () => context.setActions(null);
    }
  }, [children, props]);

  return null;
};
AlertActions.displayName = "AlertActions";

Alert.Title = AlertTitle;
Alert.Description = AlertDescription;
Alert.Actions = AlertActions;
Alert.Dismiss = AlertDismiss;
