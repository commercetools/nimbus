import { AlertRoot as AlertRootSlot, AlertIcon } from "../alert.slots";
import type { AlertProps, AlertRootComponent } from "../alert.types";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@commercetools/nimbus-icons";

const getIconFromColorPalette = (colorPalette: AlertProps["colorPalette"]) => {
  switch (colorPalette) {
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

/**
 * Alert.Root - Provides feedback to the user about the status of an action or system event
 *
 * @supportsStyleProps
 */
export const AlertRoot: AlertRootComponent = (props) => {
  const { ref, children, ...restProps } = props;

  return (
    <AlertRootSlot ref={ref} {...restProps} role="alert">
      <AlertIcon alignItems="flex-start">
        {getIconFromColorPalette(restProps.colorPalette)}
      </AlertIcon>
      {children}
    </AlertRootSlot>
  );
};

AlertRoot.displayName = "Alert.Root";
