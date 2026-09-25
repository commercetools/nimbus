import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";
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

const flattenFragments = (nodes: ReactNode[]): ReactNode[] =>
  nodes.flatMap((node) =>
    isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment
      ? flattenFragments(Children.toArray(node.props.children)).map((child) =>
          isValidElement(child)
            ? cloneElement(child, { key: `${node.key}/${child.key}` })
            : child
        )
      : node
  );

const resolveBasePalette = (colorPalette: AlertProps["colorPalette"]) => {
  if (colorPalette == null || typeof colorPalette === "string") {
    return colorPalette;
  }
  const base = Array.isArray(colorPalette)
    ? colorPalette[0]
    : (colorPalette as { base?: string }).base;
  // Without a base value the palette is inherited, so assume a non-status one.
  return base ?? "neutral";
};

const getIconFromColorPalette = (colorPalette: string | null | undefined) => {
  if (colorPalette == null) return null;
  switch (colorPalette) {
    case "critical":
      return <ErrorOutline />;
    case "info":
      return <Info />;
    case "warning":
      return <WarningAmber />;
    case "positive":
      return <CheckCircleOutline />;
    case "primary":
      return <Campaign />;
    default:
      return <Article />;
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

  const renderedChildren = hideIcon
    ? childArray.filter(
        (child) => !(isValidElement(child) && child.type === AlertIcon)
      )
    : childArray;

  const basePalette = resolveBasePalette(restProps.colorPalette);

  const autoIcon =
    !hideIcon && !hasCustomIcon ? getIconFromColorPalette(basePalette) : null;

  const defaultRole = basePalette === "critical" ? "alert" : "status";

  return (
    <AlertRootSlot ref={ref} role={defaultRole} {...restProps}>
      {autoIcon && <AlertIconSlot>{autoIcon}</AlertIconSlot>}
      {renderedChildren}
    </AlertRootSlot>
  );
};

AlertRoot.displayName = "Alert.Root";
