import { Children, isValidElement } from "react";
import {
  AlertRoot as AlertRootSlot,
  AlertIcon as AlertIconSlot,
} from "../alert.slots";
import { AlertIcon } from "./alert.icon";
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
  const { ref, children, hideIcon, ...restProps } = props;

  const childArray = Children.toArray(children);
  const hasCustomIcon = childArray.some(
    (child) => isValidElement(child) && child.type === AlertIcon
  );

  // hideIcon strips any explicit <Alert.Icon> children as well as the auto icon.
  const renderedChildren = hideIcon
    ? childArray.filter(
        (child) => !(isValidElement(child) && child.type === AlertIcon)
      )
    : children;

  const showAutoIcon = !hideIcon && !hasCustomIcon;

  return (
    <AlertRootSlot ref={ref} role="status" {...restProps}>
      {showAutoIcon && (
        <AlertIconSlot alignItems="flex-start">
          {getIconFromColorPalette(restProps.colorPalette)}
        </AlertIconSlot>
      )}
      {renderedChildren}
    </AlertRootSlot>
  );
};

AlertRoot.displayName = "Alert.Root";
