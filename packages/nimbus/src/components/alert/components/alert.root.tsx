import { Children, Fragment, isValidElement, type ReactNode } from "react";
import {
  AlertRoot as AlertRootSlot,
  AlertIcon as AlertIconSlot,
} from "../alert.slots";
import { AlertIcon } from "./alert.icon";
import type { AlertProps, AlertRootComponent } from "../alert.types";
import {
  Article,
  Campaign,
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
    // The two non-severity palettes still get an icon, so the leading column
    // is consistent across the set — but deliberately outside the severity
    // shape family above, because neither has a severity to reinforce.
    case "primary":
      return <Campaign />;
    case "neutral":
      return <Article />;
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

  const childArray = flattenFragments(Children.toArray(children));
  const hasCustomIcon = childArray.some(
    (child) => isValidElement(child) && child.type === AlertIcon
  );

  // hideIcon strips any explicit <Alert.Icon> children as well as the auto icon.
  const renderedChildren = hideIcon
    ? childArray.filter(
        (child) => !(isValidElement(child) && child.type === AlertIcon)
      )
    : children;

  // Resolve the auto icon up front: some palettes (e.g. neutral) have no status
  // icon, so this can be null. Only render the icon slot when there is actually
  // an icon to show — an empty icon slot would still occupy the grid's leading
  // column and leave a phantom indent in front of the content.
  const autoIcon =
    !hideIcon && !hasCustomIcon
      ? getIconFromColorPalette(restProps.colorPalette)
      : null;

  // A critical alert interrupts the screen reader; every other palette is
  // announced politely. A consumer-supplied `role` overrides either.
  const defaultRole =
    restProps.colorPalette === "critical" ? "alert" : "status";

  return (
    <AlertRootSlot ref={ref} role={defaultRole} {...restProps}>
      {/* No alignment prop: the recipe boxes the icon to one text line and
          centres it there, which a `flex-start` style prop would override. */}
      {autoIcon && <AlertIconSlot>{autoIcon}</AlertIconSlot>}
      {renderedChildren}
    </AlertRootSlot>
  );
};

AlertRoot.displayName = "Alert.Root";
