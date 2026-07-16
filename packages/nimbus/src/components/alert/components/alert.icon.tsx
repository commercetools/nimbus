import { AlertIcon as AlertIconSlot } from "../alert.slots";
import type { AlertIconProps } from "../alert.types";

/**
 * Alert.Icon - Optional custom icon slot.
 *
 * When omitted, Alert renders an automatic status icon based on `colorPalette`.
 * When provided, it replaces the automatic icon. Suppressed entirely by the
 * `hideIcon` prop on `Alert.Root`.
 *
 * @supportsStyleProps
 */
export const AlertIcon = ({ children, ...props }: AlertIconProps) => {
  return <AlertIconSlot {...props}>{children}</AlertIconSlot>;
};

AlertIcon.displayName = "Alert.Icon";
