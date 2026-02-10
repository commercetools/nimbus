import { ToastRoot as ToastRootSlot, ToastIcon } from "../toast.slots";
import type { ToastRootProps, ToastRootComponent } from "../toast.types";
import {
  CheckCircleOutline,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@commercetools/nimbus-icons";

/**
 * Get the appropriate icon for the toast type.
 */
const getIconFromType = (type: ToastRootProps["type"]) => {
  switch (type) {
    case "error":
      return <ErrorOutline />;
    case "info":
      return <Info />;
    case "warning":
      return <WarningAmber />;
    case "success":
      return <CheckCircleOutline />;
    default:
      return null;
  }
};

/**
 * Get the color palette for the toast type.
 */
const getColorPalette = (type: ToastRootProps["type"]) => {
  switch (type) {
    case "error":
      return "critical";
    case "info":
      return "info";
    case "warning":
      return "warning";
    case "success":
      return "positive";
    default:
      return "info";
  }
};

/**
 * Get ARIA role and live region politeness based on toast type.
 * Warning and error toasts are assertive (role="alert"),
 * info and success toasts are polite (role="status").
 */
const getARIAAttributes = (type: ToastRootProps["type"]) => {
  if (type === "warning" || type === "error") {
    return {
      role: "alert" as const,
      "aria-live": "assertive" as const,
    };
  }
  return {
    role: "status" as const,
    "aria-live": "polite" as const,
  };
};

/**
 * Toast.Root - The root component that provides context and configuration for the toast.
 *
 * @supportsStyleProps
 */
export const ToastRoot: ToastRootComponent = (props) => {
  const { ref, children, type = "info", ...restProps } = props;

  const ariaAttributes = getARIAAttributes(type);
  const colorPalette = getColorPalette(type);

  return (
    <ToastRootSlot
      ref={ref}
      colorPalette={colorPalette}
      {...ariaAttributes}
      {...restProps}
    >
      <ToastIcon alignItems="flex-start">{getIconFromType(type)}</ToastIcon>
      {children}
    </ToastRootSlot>
  );
};

ToastRoot.displayName = "Toast.Root";
