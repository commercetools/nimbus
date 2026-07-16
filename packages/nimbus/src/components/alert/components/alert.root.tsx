import { Children, Fragment, isValidElement, type ReactNode } from "react";
import {
  AlertRoot as AlertRootSlot,
  AlertIcon as AlertIconSlot,
} from "../alert.slots";
import { AlertIcon } from "./alert.icon";
import { AlertDismissButton } from "./alert.dismiss-button";
import type { AlertProps, AlertRootComponent } from "../alert.types";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@commercetools/nimbus-icons";

// Children.toArray only flattens arrays/iterables, not Fragments — consumers
// composing children via `<>...</>` would otherwise hide their explicit
// <Alert.Icon>/<Alert.DismissButton> from detection below. Recurse into any
// top-level Fragment so detection sees the same children regardless of
// whether the caller wrapped them in a Fragment.
const flattenFragments = (nodes: ReactNode[]): ReactNode[] =>
  nodes.flatMap((node) =>
    isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment
      ? flattenFragments(Children.toArray(node.props.children))
      : node
  );

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
  const { ref, children, hideIcon, dismissible, onDismiss, ...restProps } =
    props;

  const childArray = flattenFragments(Children.toArray(children));
  const hasCustomIcon = childArray.some(
    (child) => isValidElement(child) && child.type === AlertIcon
  );
  const hasManualDismiss = childArray.some(
    (child) => isValidElement(child) && child.type === AlertDismissButton
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
      {dismissible && !hasManualDismiss && (
        <AlertDismissButton onPress={onDismiss} />
      )}
    </AlertRootSlot>
  );
};

AlertRoot.displayName = "Alert.Root";
